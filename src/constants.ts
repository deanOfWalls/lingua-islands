import type { MasteryLevel } from './types/index.js';

export const STORAGE_KEY = 'lifelingo-progress';

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  0: 'New',
  1: 'Recognize',
  2: 'Slow',
  3: 'Natural',
  4: 'Auto',
};

export const MASTERY_LEVELS: readonly MasteryLevel[] = [0, 1, 2, 3, 4];

export const MASTERED_THRESHOLD: MasteryLevel = 3;

export const WEAK_THRESHOLD: MasteryLevel = 2;

export const BACK_ROUTES: Readonly<Record<string, string>> = {
  island: '#islands',
  pattern: '#patterns',
  sentence: '#islands',
  'practice-active': '#practice',
  shadow: '#home',
};

export const NAV_VIEWS = ['home', 'islands', 'practice', 'patterns', 'search'] as const;

export const DATA_URL = 'starter-pack.json';
