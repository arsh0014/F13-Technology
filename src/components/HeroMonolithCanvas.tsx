import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroMonolithCanvasProps {
  variant: 'light' | 'dark';
  active?: boolean;
}

/**
 * Architectural Three.js wireframe terrain wave & rotating geometric monolith
 * matching NK Studio's signature spatial centerpiece across light hero & dark storytelling sections.
 */
export function HeroMonolithCanvas({
  variant,
  active = true,
}: HeroMonolithCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active) return;

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

    const scene = new THREE.Scene();
    const width = mount.clientWidth || 1280;
    const height = mount.clientHeight || 720;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const baseZ = width / height < 0.85 ? 9.8 : 7.8;
    camera.position.set(0, 1.35, baseZ);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // 1. Undulating architectural floor grid (PlaneGeometry displaced in wave)
    const segs = isSoftwareGl ? 22 : 34;
    const planeGeo = new THREE.PlaneGeometry(18, 12, segs, segs);
    planeGeo.rotateX(-Math.PI / 2.2);
    const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
    const baseY = new Float32Array(posAttr.count);
    const baseX = new Float32Array(posAttr.count);
    const baseZArr = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      baseX[i] = posAttr.getX(i);
      baseY[i] = posAttr.getY(i);
      baseZArr[i] = posAttr.getZ(i);
    }

    const gridMat = new THREE.MeshBasicMaterial({
      color: variant === 'light' ? 0xd4d4d8 : 0x0f766e,
      wireframe: true,
      transparent: true,
      opacity: variant === 'light' ? 0.36 : 0.32,
    });
    const terrainMesh = new THREE.Mesh(planeGeo, gridMat);
    terrainMesh.position.set(0, -1.75, -1.2);
    scene.add(terrainMesh);

    // 2. Tall tilted geometric architectural prism monolith (centerpiece)
    const monolithGeo = new THREE.BoxGeometry(1.1, 5.2, 1.1, 4, 14, 4);
    const monolithMat = new THREE.MeshBasicMaterial({
      color: 0x00c2a8,
      wireframe: true,
      transparent: true,
      opacity: variant === 'light' ? 0.24 : 0.3,
    });
    const monolithMesh = new THREE.Mesh(monolithGeo, monolithMat);
    monolithMesh.position.set(0.15, 0.2, 0.4);
    monolithMesh.rotation.set(0.14, 0.42, -0.22);
    scene.add(monolithMesh);

    // Subtle inner diagonal accent core
    const innerGeo = new THREE.BoxGeometry(0.6, 5.0, 0.6, 2, 10, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: variant === 'light' ? 0x0a0a0a : 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: variant === 'light' ? 0.08 : 0.12,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    monolithMesh.add(innerMesh);

    const pointer = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.45;
      pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 0.25;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 1280;
      const h = mount.clientHeight || 720;
      camera.aspect = w / h;
      camera.position.z = w / h < 0.85 ? 9.8 : 7.8;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsed = 0;

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

    function updateWaves(t: number) {
      for (let i = 0; i < posAttr.count; i++) {
        const x = baseX[i];
        const z = baseZArr[i];
        const dist = Math.sqrt(x * x + z * z);
        const wave =
          Math.sin(x * 0.55 + t * 1.1) * 0.32 +
          Math.cos(z * 0.65 - t * 0.85) * 0.28 +
          Math.sin(dist * 0.7 - t * 1.2) * 0.18;
        posAttr.setY(i, baseY[i] + wave);
      }
      posAttr.needsUpdate = true;
    }

    updateWaves(0.4);

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += dt;

      if (!prefersReduced) {
        pointer.cx = THREE.MathUtils.damp(pointer.cx, pointer.tx, 4.5, dt);
        pointer.cy = THREE.MathUtils.damp(pointer.cy, pointer.ty, 4.5, dt);

        updateWaves(elapsed);
        monolithMesh.rotation.y = 0.42 + elapsed * 0.22 + pointer.cx * 0.8;
        monolithMesh.rotation.x = 0.14 + Math.sin(elapsed * 0.45) * 0.06 + pointer.cy * 0.6;
        monolithMesh.position.y = 0.25 + Math.sin(elapsed * 0.8) * 0.1;
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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);

      planeGeo.dispose();
      monolithGeo.dispose();
      innerGeo.dispose();
      gridMat.dispose();
      monolithMat.dispose();
      innerMat.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [variant, active]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
