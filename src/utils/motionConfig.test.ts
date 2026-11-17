import test from 'node:test';
import assert from 'node:assert/strict';
import { FEATURED_PROJECTS } from '../data/siteContent';
import {
  clampMarqueeTimeScale,
  computeReelProgress,
  filterProjectsByIndustry,
  formatLoaderProgress,
  getSwipeDirection,
  shouldShowIntroLoader,
} from './motionConfig';

test('formatLoaderProgress pads single digits and clamps 0..100', () => {
  assert.equal(formatLoaderProgress(-5), '00');
  assert.equal(formatLoaderProgress(7), '07');
  assert.equal(formatLoaderProgress(100), '100');
  assert.equal(formatLoaderProgress(120), '100');
});

test('shouldShowIntroLoader skips when reduced motion or autostart=1 is active', () => {
  assert.equal(shouldShowIntroLoader(true, ''), false);
  assert.equal(shouldShowIntroLoader(false, '?autostart=1'), false);
  assert.equal(shouldShowIntroLoader(false, ''), true);
});

test('filterProjectsByIndustry filters concept showcases cleanly', () => {
  assert.equal(filterProjectsByIndustry(FEATURED_PROJECTS, 'All').length, FEATURED_PROJECTS.length);
  const fintech = filterProjectsByIndustry(FEATURED_PROJECTS, 'Financial Technology');
  assert.equal(fintech.length, 1);
  assert.equal(fintech[0]?.id, 'meridian-ledger');
});

test('getSwipeDirection detects horizontal swipe thresholds', () => {
  assert.equal(getSwipeDirection(-60), 'next');
  assert.equal(getSwipeDirection(60), 'prev');
  assert.equal(getSwipeDirection(20), null);
});

test('clampMarqueeTimeScale boosts speed cleanly and flips on negative scroll velocity', () => {
  assert.equal(clampMarqueeTimeScale(0), 1);
  assert.equal(clampMarqueeTimeScale(900), 3);
  assert.equal(clampMarqueeTimeScale(-900), -3);
  assert.equal(clampMarqueeTimeScale(10000), 4.5);
});

test('computeReelProgress clamps normalized reel progress between 0 and 1', () => {
  assert.equal(computeReelProgress(0, 1000, 1000), 1);
  assert.equal(computeReelProgress(250, 1500, 500), 0.25);
  assert.equal(computeReelProgress(2000, 1500, 500), 1);
});
