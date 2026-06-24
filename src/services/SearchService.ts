import type { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import type { SearchFilters, Sentence } from '../types/index.js';
import type { ProgressStore } from './ProgressStore.js';
import { WEAK_THRESHOLD } from '../constants.js';

/** Sentence search and filtering. */
export class SearchService {
  constructor(
    private readonly repository: CurriculumRepository,
    private readonly progress: ProgressStore,
  ) {}

  search(query: string, filters: SearchFilters = {}): Sentence[] {
    let results = [...this.repository.sentences];

    if (filters.islandId) {
      results = results.filter((sentence) => sentence.islandId === filters.islandId);
    }
    if (filters.patternId) {
      results = results.filter((sentence) => sentence.patternIds.includes(filters.patternId!));
    }
    if (filters.weak) {
      results = results.filter(
        (sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD,
      );
    }
    if (filters.favorites) {
      results = results.filter((sentence) => this.progress.isFavorite(sentence.id));
    }
    if (filters.mastery !== undefined) {
      results = results.filter(
        (sentence) => this.progress.getMastery(sentence.id) === filters.mastery,
      );
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return results;

    return results.filter((sentence) => this.matchesQuery(sentence, trimmed));
  }

  private matchesQuery(sentence: Sentence, query: string): boolean {
    const island = this.repository.getIsland(sentence.islandId);
    const fields: Array<string | undefined> = [
      sentence.english,
      sentence.hanzi,
      sentence.pinyin,
      sentence.pinyinNumbered,
      sentence.literal,
      sentence.meaning,
      ...sentence.tags,
      island?.name,
      ...sentence.patternIds,
    ];
    return fields.some((field) => field && field.toLowerCase().includes(query));
  }
}
