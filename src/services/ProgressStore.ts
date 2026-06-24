import { STORAGE_KEY } from '../constants.js';
import type { MasteryLevel, ProgressStoreData, SentenceProgress } from '../types/index.js';

/** Encapsulates learner progress persisted in localStorage. */
export class ProgressStore {
  private data: ProgressStoreData = {};

  load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this.data = raw ? (JSON.parse(raw) as ProgressStoreData) : {};
    } catch {
      this.data = {};
    }
  }

  getMastery(sentenceId: string): MasteryLevel {
    const level = this.data[sentenceId]?.mastery;
    return level ?? 0;
  }

  setMastery(sentenceId: string, level: MasteryLevel): void {
    this.ensureEntry(sentenceId);
    this.data[sentenceId].mastery = level;
    this.persist();
  }

  isFavorite(sentenceId: string): boolean {
    return this.data[sentenceId]?.favorite ?? false;
  }

  toggleFavorite(sentenceId: string): boolean {
    this.ensureEntry(sentenceId);
    const next = !this.isFavorite(sentenceId);
    this.data[sentenceId].favorite = next;
    this.persist();
    return next;
  }

  private ensureEntry(sentenceId: string): void {
    if (!this.data[sentenceId]) {
      this.data[sentenceId] = { mastery: 0 };
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }
}

export type { SentenceProgress };
