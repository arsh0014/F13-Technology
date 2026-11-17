import test from 'node:test';
import assert from 'node:assert/strict';
import { INSIGHTS_ARTICLES, SERVICES } from '../data/siteContent';
import {
  filterInsightsByCategory,
  getServiceById,
  getNextSlideIndex,
  getPrevSlideIndex,
} from './catalog';

test('filterInsightsByCategory returns all items for All and filters specific categories', () => {
  const all = filterInsightsByCategory(INSIGHTS_ARTICLES, 'All');
  assert.equal(all.length, INSIGHTS_ARTICLES.length);

  const aiOnly = filterInsightsByCategory(INSIGHTS_ARTICLES, 'Artificial Intelligence');
  assert.equal(aiOnly.length, 1);
  assert.equal(aiOnly[0]?.category, 'Artificial Intelligence');
});

test('getServiceById finds expected service among all 10 offerings', () => {
  assert.equal(SERVICES.length, 10);
  const cyber = getServiceById(SERVICES, 'cybersecurity');
  assert.equal(cyber?.title, 'Cybersecurity Solutions');
  assert.equal(getServiceById(SERVICES, 'nonexistent'), undefined);
});

test('carousel slide navigation wraps cleanly in both directions', () => {
  assert.equal(getNextSlideIndex(0, 3), 1);
  assert.equal(getNextSlideIndex(2, 3), 0);
  assert.equal(getPrevSlideIndex(0, 3), 2);
  assert.equal(getPrevSlideIndex(1, 3), 0);
});
