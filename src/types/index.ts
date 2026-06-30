/** Domain and application types for Lingua Islands. */

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export type ShadowStep = 'listen' | 'repeat' | 'meaning';

export type PracticeMode =
  | 'all'
  | 'weak'
  | 'favorites'
  | 'island'
  | 'pattern'
  | 'single';

export interface SentenceProgress {
  mastery?: MasteryLevel;
  favorite?: boolean;
}

export interface ProgressStoreData {
  [sentenceId: string]: SentenceProgress;
}

export interface Island {
  id: string;
  name: string;
  goal: string;
  priority: number;
}

export interface Pattern {
  id: string;
  name: string;
  formula: string;
  formulaPinyin?: string;
  meaning: string;
  notes?: string;
}

export interface WordBreakdown {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface SentenceExample {
  hanzi: string;
  pinyin: string;
  english: string;
}

export interface Sentence {
  id: string;
  islandId: string;
  english: string;
  meaning: string;
  hanzi: string;
  pinyin: string;
  pinyinNumbered: string;
  literal: string;
  difficulty: number;
  tags: string[];
  patternIds: string[];
  breakdown: WordBreakdown[];
  structureNotes: string;
  usageNotes: string;
  examples: SentenceExample[];
  /** Optional TTS-only text when hanzi trips the synthesizer (display hanzi unchanged). */
  ttsText?: string;
  /** SAPI pinyin phoneme string for edge-tts SSML (e.g. zai4 shuo1 yi2 bian4). */
  ttsSapi?: string;
  audioUrl: string;
}

export interface StarterPack {
  metadata: Record<string, unknown>;
  islands: Island[];
  patterns: Pattern[];
  sentences: Sentence[];
}

export interface RouteState {
  view: string;
  parts: string[];
  params: Record<string, string>;
}

export interface SearchFilters {
  islandId?: string;
  patternId?: string;
  weak?: boolean;
  favorites?: boolean;
  mastery?: MasteryLevel;
}

export interface IslandStats {
  total: number;
  mastered: number;
}

export interface OverallStats {
  total: number;
  mastered: number;
  weak: number;
  practiced: number;
}

export interface RevealContentOptions {
  showMastery?: boolean;
  showHeader?: boolean;
}

export interface PatternBlockOptions {
  compact?: boolean;
}

export interface FlashcardSession {
  kind: 'flashcard';
  queue: Sentence[];
  index: number;
  revealed: boolean;
  paramsKey: string;
}

export interface ShadowSession {
  kind: 'shadow';
  queue: Sentence[];
  index: number;
  step: ShadowStep;
}

export type PracticeSession = FlashcardSession | ShadowSession;

export interface PracticeParams {
  mode?: PracticeMode | string;
  island?: string;
  pattern?: string;
  sentence?: string;
}

export interface ShellElements {
  main: HTMLElement;
  topTitle: HTMLElement;
  backBtn: HTMLButtonElement;
  topActions: HTMLElement;
  bottomNav: HTMLElement;
  themeToggle: HTMLButtonElement;
}
