import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { getParticleGridConfig, getPrismTrajectory } from '../utils/particleWaveConfig';

interface DigitalParticleHeroCanvasProps {
  active?: boolean;
  wipeProgress?: number;
}

const TERRAIN_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSizeScale;
  uniform vec2 uPointer;
  attribute float aSeed;
  varying float vElevation;
  varying float vDepth;
  varying float vCursorGlow;

  void main() {
    vec3 pos = position;
    float waveA = sin(pos.x * 0.42 + uTime * 0.85) * cos(pos.z * 0.36 - uTime * 0.62) * 0.66;
    float waveB = sin(pos.x * 0.88 - pos.z * 0.54 + uTime * 1.12) * 0.26;
    float ridge = sin(length(pos.xz * 0.44) - uTime * 0.9) * 0.30;

    vec2 pointerPlane = vec2(uPointer.x * 8.5, -uPointer.y * 5.2);
    float dCursor = distance(pos.xz, pointerPlane);
    float cursorBump = exp(-dCursor * 0.38) * 0.72;

    float elevation = waveA + waveB + ridge + cursorBump;
    pos.y += elevation;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vElevation = elevation;
    vDepth = -mvPosition.z;
    vCursorGlow = exp(-dCursor * 0.40);

    float baseSize = (24.5 + aSeed * 12.0) * uSizeScale * uPixelRatio;
    gl_PointSize = clamp(baseSize / max(1.3, -mvPosition.z), 2.2, 8.2 * uPixelRatio);
  }
`;

const TERRAIN_FRAGMENT_SHADER = `
  varying float vElevation;
  varying float vDepth;
  varying float vCursorGlow;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;

    float disc = smoothstep(0.5, 0.05, dist);
    float crest = clamp((vElevation + 0.85) / 1.75, 0.0, 1.0);

    vec3 deepTeal = vec3(0.02, 0.55, 0.42);
    vec3 emerald = vec3(0.02, 0.96, 0.68);
    vec3 electric = vec3(0.58, 1.0, 0.88);

    vec3 color = mix(deepTeal, emerald, crest);
    color = mix(color, electric, clamp(crest * 0.48 + vCursorGlow * 0.65, 0.0, 1.0));

    float depthFade = smoothstep(24.5, 4.8, vDepth);
    float alpha = disc * depthFade * (0.58 + crest * 0.42);
    gl_FragColor = vec4(color, min(1.0, alpha));
  }
`;

const AMBIENT_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSpeed;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    pos.y = mod(pos.y + uTime * aSpeed + 4.5, 9.0) - 4.5;
    pos.x += sin(uTime * 0.45 + aSeed * 6.2831) * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vAlpha = 0.28 + 0.35 * sin(uTime * 1.4 + aSeed * 6.2831);
    gl_PointSize = clamp((14.0 + aSeed * 10.0) * uPixelRatio / max(1.8, -mvPosition.z), 1.6, 5.0 * uPixelRatio);
  }
`;

const AMBIENT_FRAGMENT_SHADER = `
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float disc = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(0.28, 0.96, 0.74, disc * clamp(vAlpha, 0.14, 0.72));
  }
`;

/**
 * Full-viewport black interactive Three.js hero featuring:
 * 1) Undulating GLSL 3D emerald/teal particle terrain wave with mouse ripple
 * 2) Suspended ambient depth particles
 * 3) Original ARKON 3D translucent beveled green diagonal prism with neon edge cage
 */
export function DigitalParticleHeroCanvas({
  active = true,
  wipeProgress = 1,
}: DigitalParticleHeroCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const wipeProgressRef = useRef(wipeProgress);

  activeRef.current = active;
  wipeProgressRef.current = wipeProgress;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas').getContext('webgl2');
        if (!probe) return true;
        const ext = probe.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
        const gpu = String(probe.getParameter(param));
        probe.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = mount.clientWidth || window.innerWidth || 1280;
    const height = mount.clientHeight || window.innerHeight || 720;
    const gridCfg = getParticleGridConfig(width, isSoftwareGl, prefersReduced);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.038);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 80);
    const computeCameraZ = (w: number, h: number) => (w / Math.max(1, h) < 0.85 ? 9.4 : 7.6);
    camera.position.set(0, 1.56, computeCameraZ(width, height));
    camera.lookAt(0, 0.0, -0.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    const dpr = isSoftwareGl
      ? 1
      : Math.min(window.devicePixelRatio || 1, gridCfg.pixelRatioCap);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.24;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    // Subtle environment reflection map for glass realism
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Scene lighting biased toward saturated emerald reflections
    const ambientLight = new THREE.AmbientLight(0x00cc88, 0.95);
    const keyLight = new THREE.DirectionalLight(0x6effcc, 2.4);
    keyLight.position.set(4.5, 6.2, 5.5);
    const rimLight = new THREE.DirectionalLight(0x00ffa3, 2.0);
    rimLight.position.set(-5.0, -2.5, 3.0);
    scene.add(ambientLight, keyLight, rimLight);

    // 1. 3D Interactive Particle Wave Terrain (extra-wide span for edge-to-edge bleed)
    const { cols, rows, ambientCount, pointSizeScale } = gridCfg;
    const totalPoints = cols * rows;
    const terrainPositions = new Float32Array(totalPoints * 3);
    const terrainSeeds = new Float32Array(totalPoints);

    const spanX = 36;
    const spanZ = 20;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const nz = r / Math.max(1, rows - 1) - 0.5;
      for (let c = 0; c < cols; c++) {
        const nx = c / Math.max(1, cols - 1) - 0.5;
        terrainPositions[idx * 3] = nx * spanX;
        terrainPositions[idx * 3 + 1] = 0;
        terrainPositions[idx * 3 + 2] = nz * spanZ;
        // Deterministic pseudo-random seed per grid cell
        terrainSeeds[idx] = Math.abs(Math.sin(idx * 12.9898) * 43758.5453) % 1;
        idx++;
      }
    }

    const terrainGeo = new THREE.BufferGeometry();
    terrainGeo.setAttribute('position', new THREE.BufferAttribute(terrainPositions, 3));
    terrainGeo.setAttribute('aSeed', new THREE.BufferAttribute(terrainSeeds, 1));

    const terrainUniforms = {
      uTime: { value: 0.8 },
      uPixelRatio: { value: dpr },
      uSizeScale: { value: pointSizeScale },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const terrainMat = new THREE.ShaderMaterial({
      vertexShader: TERRAIN_VERTEX_SHADER,
      fragmentShader: TERRAIN_FRAGMENT_SHADER,
      uniforms: terrainUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const terrainPoints = new THREE.Points(terrainGeo, terrainMat);
    terrainPoints.position.set(0, -1.42, -1.9);
    scene.add(terrainPoints);

    // 2. Ambient Floating Depth Particles
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientSpeeds = new Float32Array(ambientCount);
    const ambientSeeds = new Float32Array(ambientCount);
    for (let i = 0; i < ambientCount; i++) {
      const h1 = Math.abs(Math.sin((i + 1) * 78.233) * 43758.5453) % 1;
      const h2 = Math.abs(Math.sin((i + 1) * 39.425) * 21341.7123) % 1;
      const h3 = Math.abs(Math.sin((i + 1) * 91.113) * 19283.3141) % 1;
      ambientPositions[i * 3] = (h1 - 0.5) * 20;
      ambientPositions[i * 3 + 1] = (h2 - 0.5) * 9;
      ambientPositions[i * 3 + 2] = -7 + h3 * 9.5;
      ambientSpeeds[i] = 0.08 + h1 * 0.14;
      ambientSeeds[i] = h2;
    }

    const ambientGeo = new THREE.BufferGeometry();
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeo.setAttribute('aSpeed', new THREE.BufferAttribute(ambientSpeeds, 1));
    ambientGeo.setAttribute('aSeed', new THREE.BufferAttribute(ambientSeeds, 1));

    const ambientUniforms = {
      uTime: { value: 0.8 },
      uPixelRatio: { value: dpr },
    };
    const ambientMat = new THREE.ShaderMaterial({
      vertexShader: AMBIENT_VERTEX_SHADER,
      fragmentShader: AMBIENT_FRAGMENT_SHADER,
      uniforms: ambientUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // 3. Original ARKON 3D Translucent Green Diagonal Prism Group (3-part hierarchy)
    const prismGroup = new THREE.Group();

    const prismShape = new THREE.Shape();
    const w = 0.36;
    const h = 2.42;
    prismShape.moveTo(-w, -h);
    prismShape.lineTo(w, -h);
    prismShape.lineTo(w, h);
    prismShape.lineTo(-w, h);
    prismShape.closePath();

    const prismGeo = new THREE.ExtrudeGeometry(prismShape, {
      depth: 0.58,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 1,
    });
    prismGeo.center();

    const prismGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00ffaa,
      emissive: 0x00d98b,
      emissiveIntensity: isSoftwareGl ? 0.52 : 0.42,
      roughness: 0.16,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.45,
      transparent: true,
      opacity: isSoftwareGl ? 0.28 : 0.88,
      ...(isSoftwareGl
        ? {}
        : {
            transmission: 0.78,
            ior: 1.48,
            thickness: 1.1,
          }),
    });
    const prismMesh = new THREE.Mesh(prismGeo, prismGlassMat);
    prismGroup.add(prismMesh);

    const edgesGeo = new THREE.EdgesGeometry(prismGeo, 24);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0x5effcb,
      transparent: true,
      opacity: 0.96,
    });
    const prismEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    prismGroup.add(prismEdges);

    const coreGeo = new THREE.BoxGeometry(0.18, 4.45, 0.18);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x8effdc,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    prismGroup.add(coreMesh);

    const prismInnerLight = new THREE.PointLight(0x00ffa3, 3.6, 9);
    prismInnerLight.position.set(0, 0, 0.5);
    prismGroup.add(prismInnerLight);

    scene.add(prismGroup);

    const pointer = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!mount) return;
      const wNew = mount.clientWidth || window.innerWidth || 1280;
      const hNew = mount.clientHeight || window.innerHeight || 720;
      camera.aspect = wNew / Math.max(1, hNew);
      camera.position.z = computeCameraZ(wNew, hNew);
      camera.updateProjectionMatrix();
      renderer.setSize(wNew, hNew, false);
    };
    window.addEventListener('resize', onResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => onResize())
        : null;
    resizeObserver?.observe(mount);

    let frameId = 0;
    let disposed = false;
    let contextLost = false;
    let lastTime = performance.now();
    let elapsed = 0.8;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };
    const handleContextRestored = () => {
      contextLost = false;
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 75);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function applyFrame(dt: number) {
      pointer.cx = THREE.MathUtils.damp(pointer.cx, pointer.tx, 4.2, dt);
      pointer.cy = THREE.MathUtils.damp(pointer.cy, pointer.ty, 4.2, dt);

      terrainUniforms.uTime.value = elapsed;
      terrainUniforms.uPointer.value.set(pointer.cx, pointer.cy);
      ambientUniforms.uTime.value = elapsed;

      const t = getPrismTrajectory(elapsed, pointer.cx, pointer.cy);
      const scrollLift = (1 - wipeProgressRef.current) * -1.4;
      const aspectScale = camera.aspect < 0.85 ? 0.42 : 1;
      prismGroup.position.set(t.x * aspectScale, t.y + scrollLift, t.z);
      prismGroup.rotation.set(t.rx, t.ry, t.rz);

      camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.cx * 0.42, 3.0, dt);
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        1.56 - pointer.cy * 0.22,
        3.0,
        dt,
      );
      camera.lookAt(0, 0.0, -0.6);
    }

    // Initial deterministic composition render immediately on mount
    applyFrame(0.016);
    renderer.render(scene, camera);

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!prefersReduced && activeRef.current && !contextLost) {
        elapsed += dt;
        applyFrame(dt);
        renderer.render(scene, camera);
      }

      if (prefersReduced) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    if (!prefersReduced) {
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      resizeObserver?.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      terrainGeo.dispose();
      terrainMat.dispose();
      ambientGeo.dispose();
      ambientMat.dispose();
      prismGeo.dispose();
      prismGlassMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      envRT.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="digital-particle-canvas"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
