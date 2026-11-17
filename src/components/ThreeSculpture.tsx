import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { gsap } from '../utils/gsapSetup';

interface ThreeSculptureProps {
  active?: boolean;
}

export function ThreeSculpture({ active = true }: ThreeSculptureProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0.5);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );
    observer.observe(mount);
    return () => observer.disconnect();
  }, []);

  // Scroll-linked progress tracker (detached from WebGL initialization lifecycle)
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(scrollProgressRef, {
        current: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: mount,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            scrollProgressRef.current = self.progress;
          },
        },
      });
    }, mountRef);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active || !nearViewport) return;

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

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050505');
    scene.fog = new THREE.Fog('#050505', 8, 18);

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 6.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envRT = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // Cool optical key + teal rim fill lighting
    const hemi = new THREE.HemisphereLight(0x99f6e4, 0x111113, 0.85);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00c2a8, 1.65);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Composite 7-part architectural sculpture group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d4d8,
      metalness: 0.92,
      roughness: 0.2,
      anisotropy: 0.75,
      clearcoat: 0.4,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });

    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f2,
      metalness: 0.08,
      roughness: 0.65,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    });

    const cobaltGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x00c2a8,
      metalness: 0.1,
      roughness: 0.12,
      transmission: isSoftwareGl ? 0 : 0.82,
      transparent: true,
      opacity: isSoftwareGl ? 0.58 : 1,
      ior: 1.55,
      thickness: 1.2,
      clearcoat: 1.0,
      emissive: new THREE.Color(0x008774),
      emissiveIntensity: 0.12,
    });

    const darkObsidianMat = new THREE.MeshStandardMaterial({
      color: 0x111113,
      metalness: 0.4,
      roughness: 0.45,
    });

    // 1. Primary silhouette: architectural faceted core
    const coreGeo = new THREE.OctahedronGeometry(0.95, 0);
    const coreMesh = new THREE.Mesh(coreGeo, cobaltGlassMat);
    coreMesh.castShadow = !isSoftwareGl;
    sculptureGroup.add(coreMesh);

    // 2. Inner precision wireframe frame
    const frameGeo = new THREE.IcosahedronGeometry(1.18, 0);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: true,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    sculptureGroup.add(frameMesh);

    // 3 & 4. Interlocking orbital rings
    const ringGeo1 = new THREE.TorusGeometry(1.65, 0.055, 16, 48);
    const ringMesh1 = new THREE.Mesh(ringGeo1, titaniumMat);
    ringMesh1.rotation.set(Math.PI / 3.2, 0.3, 0);
    sculptureGroup.add(ringMesh1);

    const ringGeo2 = new THREE.TorusGeometry(1.98, 0.038, 16, 48);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ceramicMat);
    ringMesh2.rotation.set(-Math.PI / 4, Math.PI / 5, 0);
    sculptureGroup.add(ringMesh2);

    // 5. Stepped architectural plinth discs
    const plinthGeo = new THREE.CylinderGeometry(1.3, 1.45, 0.14, 32);
    const plinthMesh = new THREE.Mesh(plinthGeo, darkObsidianMat);
    plinthMesh.position.y = -2.05;
    plinthMesh.receiveShadow = !isSoftwareGl;
    sculptureGroup.add(plinthMesh);

    // 6 & 7. Orbiting accent nodes
    const nodeGeo = new THREE.SphereGeometry(0.11, 16, 16);
    const nodeMeshA = new THREE.Mesh(nodeGeo, ceramicMat);
    nodeMeshA.position.set(1.65, 0, 0);
    ringMesh1.add(nodeMeshA);

    const nodeMeshB = new THREE.Mesh(nodeGeo, cobaltGlassMat);
    nodeMeshB.position.set(-1.98, 0, 0);
    ringMesh2.add(nodeMeshB);

    // Throttled Raycaster hover highlight + click spin impulse + pointer drag orbit
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(99, 99);
    const interactives = [coreMesh, ringMesh1, ringMesh2];
    let hoveredMesh: THREE.Object3D | null = null;
    let lastRaycastMs = 0;

    const pointer = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      dragOffsetX: 0,
      dragOffsetY: 0,
      dragging: false,
      lastClientX: 0,
      lastClientY: 0,
    };
    let impulseSpin = 0;
    let scrollDamped = 0.5;
    let coreEmissiveBoost = 0.08;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      pointer.targetX = (nx - 0.5) * 0.72;
      pointer.targetY = (ny - 0.5) * 0.45;

      if (pointer.dragging) {
        pointer.dragOffsetX += (e.clientX - pointer.lastClientX) * 0.008;
        pointer.dragOffsetY = THREE.MathUtils.clamp(
          pointer.dragOffsetY + (e.clientY - pointer.lastClientY) * 0.006,
          -0.65,
          0.65,
        );
        pointer.lastClientX = e.clientX;
        pointer.lastClientY = e.clientY;
      }

      const now = performance.now();
      if (now - lastRaycastMs >= 60) {
        lastRaycastMs = now;
        pointerNdc.set(nx * 2 - 1, -(ny * 2 - 1));
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(interactives, false);
        hoveredMesh = hits.length > 0 ? hits[0].object : null;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      pointer.dragging = true;
      pointer.lastClientX = e.clientX;
      pointer.lastClientY = e.clientY;
      impulseSpin = Math.min(5.2, impulseSpin + 3.2);
    };

    const onPointerUp = () => {
      pointer.dragging = false;
    };

    const onPointerLeave = () => {
      pointer.dragging = false;
      hoveredMesh = null;
    };

    mount.addEventListener('pointermove', onPointerMove, { passive: true });
    mount.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    mount.addEventListener('pointerleave', onPointerLeave, { passive: true });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 480;
      const h = mount.clientHeight || 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;
    let extraAngle = 0;

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
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += dt;

      if (!prefersReduced) {
        pointer.currentX = THREE.MathUtils.damp(pointer.currentX, pointer.targetX, 5, dt);
        pointer.currentY = THREE.MathUtils.damp(pointer.currentY, pointer.targetY, 5, dt);
        impulseSpin = THREE.MathUtils.damp(impulseSpin, 0, 2.4, dt);
        extraAngle += impulseSpin * dt;
        scrollDamped = THREE.MathUtils.damp(scrollDamped, scrollProgressRef.current, 4.5, dt);

        const targetEmissive = hoveredMesh === coreMesh ? 0.52 : 0.08 + impulseSpin * 0.08;
        coreEmissiveBoost = THREE.MathUtils.damp(coreEmissiveBoost, targetEmissive, 8, dt);
        cobaltGlassMat.emissiveIntensity = coreEmissiveBoost;

        const ringHover = hoveredMesh === ringMesh1 || hoveredMesh === ringMesh2;
        titaniumMat.emissive.setHex(ringHover ? 0x00c2a8 : 0x000000);
        titaniumMat.emissiveIntensity = ringHover ? 0.24 : 0;

        // Scroll-linked orbital breathing & core elevation
        const spread = (scrollDamped - 0.5) * 0.7;
        coreMesh.position.y = Math.sin(elapsed * 0.8) * 0.06 + spread * 0.28;
        ringMesh1.position.z = spread * 0.35;
        ringMesh2.position.z = -spread * 0.35;

        coreMesh.rotation.y = elapsed * 0.35 + extraAngle * 1.15;
        coreMesh.rotation.x = Math.sin(elapsed * 0.5) * 0.18;
        frameMesh.rotation.y = -elapsed * 0.22 - extraAngle * 0.6;
        ringMesh1.rotation.z = elapsed * 0.28 + extraAngle * 0.75;
        ringMesh2.rotation.z = -elapsed * 0.2 - extraAngle * 0.55;

        sculptureGroup.rotation.y = pointer.currentX + pointer.dragOffsetX + spread * 0.35;
        sculptureGroup.rotation.x = pointer.currentY + pointer.dragOffsetY;
      }

      renderer.render(scene, camera);

      if (prefersReduced) return;
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);

      coreGeo.dispose();
      frameGeo.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      plinthGeo.dispose();
      nodeGeo.dispose();

      titaniumMat.dispose();
      ceramicMat.dispose();
      cobaltGlassMat.dispose();
      darkObsidianMat.dispose();
      frameMat.dispose();
      envRT.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [active, nearViewport]);

  return (
    <div
      ref={mountRef}
      data-testid="three-sculpture-canvas"
      aria-label="Interactive 3D architectural technology sculpture"
      className="w-full h-full min-h-[320px] sm:min-h-[380px] overflow-hidden bg-[#050505] cursor-grab active:cursor-grabbing"
    />
  );
}
