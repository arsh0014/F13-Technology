export interface ParticleGridConfig {
  cols: number;
  rows: number;
  ambientCount: number;
  pointSizeScale: number;
  pixelRatioCap: number;
}

export interface ScrollWipeState {
  progress: number;
  clipInsetTopPercent: number;
  whiteScale: number;
  whiteYOffset: number;
  whiteOpacity: number;
  headlineRevealProgress: number;
  navDarkActive: boolean;
  bottomNavDarkActive: boolean;
}

export interface PrismTransformState {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getParticleGridConfig(
  viewportWidth: number,
  isSoftwareGl: boolean,
  prefersReducedMotion: boolean,
): ParticleGridConfig {
  if (prefersReducedMotion) {
    return {
      cols: 42,
      rows: 28,
      ambientCount: 48,
      pointSizeScale: 1,
      pixelRatioCap: 1,
    };
  }

  if (isSoftwareGl) {
    return {
      cols: 62,
      rows: 44,
      ambientCount: 95,
      pointSizeScale: 1.32,
      pixelRatioCap: 1,
    };
  }

  if (viewportWidth < 640) {
    return {
      cols: 52,
      rows: 38,
      ambientCount: 80,
      pointSizeScale: 1.15,
      pixelRatioCap: 1.75,
    };
  }

  if (viewportWidth < 1024) {
    return {
      cols: 70,
      rows: 50,
      ambientCount: 120,
      pointSizeScale: 1.25,
      pixelRatioCap: 2,
    };
  }

  return {
    cols: 88,
    rows: 62,
    ambientCount: 160,
    pointSizeScale: 1.32,
    pixelRatioCap: 2,
  };
}

/**
 * Computes coordinated scroll wipe transforms between the White Editorial stage
 * and the Black Interactive 3D Digital Hero stage.
 */
export function computeScrollWipeState(rawProgress: number): ScrollWipeState {
  const progress = clamp01(rawProgress);

  // Smooth cubic in-out easing for clip-path reveal curtain
  const eased =
    progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

  const clipInsetTopPercent = Number(((1 - eased) * 100).toFixed(3));
  const whiteScale = Number((1 - eased * 0.055).toFixed(4));
  const whiteYOffset = Number((-eased * 44).toFixed(2));
  const whiteOpacity = Number((1 - Math.max(0, eased - 0.55) * 1.4).toFixed(4));

  // Giant black-section typography starts sliding up once >26% wiped in
  const headlineRevealProgress = clamp01((progress - 0.24) / 0.44);

  // Header sits near top (~32px / ~4% of viewport), so flip when clip top reaches 94% height
  const navDarkActive = clipInsetTopPercent <= 5.5;
  // Bottom edge is covered right as wipe begins from bottom
  const bottomNavDarkActive = clipInsetTopPercent <= 94;

  return {
    progress,
    clipInsetTopPercent,
    whiteScale,
    whiteYOffset,
    whiteOpacity: Math.max(0, Math.min(1, whiteOpacity)),
    headlineRevealProgress,
    navDarkActive,
    bottomNavDarkActive,
  };
}

/**
 * Pure deterministic kinematics for the original ARKON 3D translucent emerald prism.
 * Keeps a bold diagonal '/' angle while gliding horizontally and tilting cleanly on pointer input.
 */
export function getPrismTrajectory(
  elapsed: number,
  pointerX: number,
  pointerY: number,
): PrismTransformState {
  const clampedPx = Math.max(-1, Math.min(1, pointerX));
  const clampedPy = Math.max(-1, Math.min(1, pointerY));

  return {
    x: Math.sin(elapsed * 0.24) * 1.45 + clampedPx * 0.52,
    y: 0.05 + Math.cos(elapsed * 0.34) * 0.22 - clampedPy * 0.3,
    z: 0.55 + Math.cos(elapsed * 0.24) * 0.32,
    rx: 0.14 + Math.sin(elapsed * 0.32) * 0.1 + clampedPy * 0.28,
    ry: 0.32 + Math.sin(elapsed * 0.42) * 0.34 + clampedPx * 0.5,
    rz: -0.34 + Math.sin(elapsed * 0.22) * 0.05 - clampedPx * 0.1,
  };
}
