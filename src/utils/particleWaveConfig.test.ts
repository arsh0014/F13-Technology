import test from 'node:test';
import assert from 'node:assert/strict';
import { HERO_PLACEHOLDER_STATS } from '../data/siteContent';
import {
  clamp01,
  computeScrollWipeState,
  getParticleGridConfig,
  getPrismTrajectory,
} from './particleWaveConfig';

test('clamp01 clamps bounds and handles non-finite numbers safely', () => {
  assert.equal(clamp01(-0.5), 0);
  assert.equal(clamp01(0.42), 0.42);
  assert.equal(clamp01(2.3), 1);
  assert.equal(clamp01(Number.NaN), 0);
});

test('getParticleGridConfig adapts particle counts cleanly across desktop, mobile, and software WebGL', () => {
  const desktop = getParticleGridConfig(1440, false, false);
  const mobile = getParticleGridConfig(390, false, false);
  const software = getParticleGridConfig(1440, true, false);
  const reduced = getParticleGridConfig(1440, false, true);

  assert.ok(desktop.cols > mobile.cols);
  assert.equal(software.pixelRatioCap, 1);
  assert.ok(reduced.ambientCount < desktop.ambientCount);
});

test('computeScrollWipeState orchestrates white-to-black clip-path reveal and nav polarity', () => {
  const start = computeScrollWipeState(0);
  assert.equal(start.clipInsetTopPercent, 100);
  assert.equal(start.navDarkActive, false);
  assert.equal(start.bottomNavDarkActive, false);
  assert.equal(start.headlineRevealProgress, 0);

  const mid = computeScrollWipeState(0.5);
  assert.equal(mid.clipInsetTopPercent, 50);
  assert.equal(mid.navDarkActive, false);
  assert.equal(mid.bottomNavDarkActive, true);
  assert.ok(mid.headlineRevealProgress > 0 && mid.headlineRevealProgress < 1);

  const complete = computeScrollWipeState(1);
  assert.equal(complete.clipInsetTopPercent, 0);
  assert.equal(complete.navDarkActive, true);
  assert.equal(complete.headlineRevealProgress, 1);
  assert.ok(complete.whiteScale < 1);
});

test('getPrismTrajectory drifts across center plane and responds to bounded pointer input', () => {
  const origin = getPrismTrajectory(0, 0, 0);
  const shiftedRight = getPrismTrajectory(0, 1, -0.5);
  assert.ok(shiftedRight.x > origin.x);
  assert.ok(shiftedRight.ry > origin.ry);

  const midCycle = getPrismTrajectory(Math.PI / 0.44, 0, 0);
  assert.notEqual(midCycle.x, origin.x);
});

test('HERO_PLACEHOLDER_STATS exposes 4 clearly labeled editable placeholder metrics', () => {
  assert.equal(HERO_PLACEHOLDER_STATS.length, 4);
  HERO_PLACEHOLDER_STATS.forEach((stat) => {
    assert.ok(stat.label.includes('PLACEHOLDER'));
    assert.ok(stat.number.length >= 2);
  });
});
