import { MASTERED_THRESHOLD, WEAK_THRESHOLD } from '../constants.js';
import type {
  Island,
  IslandStats,
  OverallStats,
  Pattern,
  Sentence,
  StarterPack,
} from '../types/index.js';
import type { ProgressStore } from '../services/ProgressStore.js';

/** Read-only access to curriculum data and derived stats. */
export class CurriculumRepository {
  constructor(
    private readonly pack: StarterPack,
    private readonly progress: ProgressStore,
  ) {}

  get islands(): readonly Island[] {
    return this.pack.islands;
  }

  get patterns(): readonly Pattern[] {
    return this.pack.patterns;
  }

  get sentences(): readonly Sentence[] {
    return this.pack.sentences;
  }

  getIsland(islandId: string): Island | undefined {
    return this.pack.islands.find((island) => island.id === islandId);
  }

  getPattern(patternId: string): Pattern | undefined {
    return this.pack.patterns.find((pattern) => pattern.id === patternId);
  }

  getSentence(sentenceId: string): Sentence | undefined {
    return this.pack.sentences.find((sentence) => sentence.id === sentenceId);
  }

  getSentencesForIsland(islandId: string): Sentence[] {
    return this.pack.sentences.filter((sentence) => sentence.islandId === islandId);
  }

  getSentencesForPattern(patternId: string): Sentence[] {
    return this.pack.sentences.filter((sentence) => sentence.patternIds.includes(patternId));
  }

  getPatternFormulaPinyin(pattern: Pattern): string {
    return pattern.formulaPinyin ?? pattern.formula;
  }

  getIslandStats(islandId: string): IslandStats {
    const sentences = this.getSentencesForIsland(islandId);
    const mastered = sentences.filter(
      (sentence) => this.progress.getMastery(sentence.id) >= MASTERED_THRESHOLD,
    ).length;
    return { total: sentences.length, mastered };
  }

  getOverallStats(): OverallStats {
    const { sentences } = this.pack;
    const mastered = sentences.filter(
      (sentence) => this.progress.getMastery(sentence.id) >= MASTERED_THRESHOLD,
    ).length;
    const weak = sentences.filter(
      (sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD,
    ).length;
    const practiced = sentences.filter(
      (sentence) => this.progress.getMastery(sentence.id) > 0,
    ).length;
    return { total: sentences.length, mastered, weak, practiced };
  }

  getSortedIslands(): Island[] {
    return [...this.pack.islands].sort((a, b) => a.priority - b.priority);
  }
}
