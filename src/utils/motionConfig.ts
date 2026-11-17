import type { ProjectConcept } from '../data/siteContent';

export const MOTION_CURVE = [0.16, 1, 0.3, 1] as const;

export function formatLoaderProgress(value: number): string {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return clamped.toString().padStart(2, '0');
}

export function shouldShowIntroLoader(
  prefersReducedMotion: boolean,
  searchString: string,
): boolean {
  if (prefersReducedMotion) return false;
  const params = new URLSearchParams(searchString);
  if (params.get('autostart') === '1') return false;
  return true;
}

export function filterProjectsByIndustry(
  projects: ProjectConcept[],
  industry: string,
): ProjectConcept[] {
  if (industry === 'All') return projects;
  return projects.filter((project) => project.industry === industry);
}

export function getSwipeDirection(
  deltaX: number,
  threshold = 45,
): 'next' | 'prev' | null {
  if (deltaX <= -threshold) return 'next';
  if (deltaX >= threshold) return 'prev';
  return null;
}

export function clampMarqueeTimeScale(velocity: number, baseSpeed = 1): number {
  const boost = Math.min(3.5, Math.abs(velocity) / 450);
  const direction = velocity < -120 ? -1 : 1;
  return direction * (baseSpeed + boost);
}

export function computeReelProgress(
  scrollLeft: number,
  scrollWidth: number,
  clientWidth: number,
): number {
  const maxScroll = scrollWidth - clientWidth;
  if (maxScroll <= 0) return 1;
  return Math.max(0, Math.min(1, scrollLeft / maxScroll));
}
