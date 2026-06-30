import type { MasteryLevel } from './types/index.js';

export const APP_NAME = 'Lingua Islands';

export const STORAGE_KEY = 'lifelingo-progress';

export const THEME_STORAGE_KEY = 'lingua-islands-theme';

export type ThemePreference = 'light' | 'dark';

/** Browser UI / status bar color per theme (WCAG-safe header backgrounds). */
export const THEME_COLOR: Record<ThemePreference, string> = {
  light: '#0a4f49',
  dark: '#0d2824',
};

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

/** Microsoft Edge neural voice — mainland Putonghua, clear male tone. */
export const TTS_VOICE = 'zh-CN-YunjianNeural';

/** MP3s are generated ~15% slower; normal play compensates toward natural pace. */
export const AUDIO_NORMAL_PLAYBACK = 1.28;

/** Slower for shadowing; keep above ~0.75 to avoid audio artifacts. */
export const AUDIO_SLOW_PLAYBACK = 0.78;
