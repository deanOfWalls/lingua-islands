import { WEAK_THRESHOLD } from '../constants.js';
/** Sentence search and filtering. */
export class SearchService {
    constructor(repository, progress) {
        this.repository = repository;
        this.progress = progress;
    }
    search(query, filters = {}) {
        let results = [...this.repository.sentences];
        if (filters.islandId) {
            results = results.filter((sentence) => sentence.islandId === filters.islandId);
        }
        if (filters.patternId) {
            results = results.filter((sentence) => sentence.patternIds.includes(filters.patternId));
        }
        if (filters.weak) {
            results = results.filter((sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD);
        }
        if (filters.favorites) {
            results = results.filter((sentence) => this.progress.isFavorite(sentence.id));
        }
        if (filters.mastery !== undefined) {
            results = results.filter((sentence) => this.progress.getMastery(sentence.id) === filters.mastery);
        }
        const trimmed = query.trim().toLowerCase();
        if (!trimmed)
            return results;
        return results.filter((sentence) => this.matchesQuery(sentence, trimmed));
    }
    matchesQuery(sentence, query) {
        const island = this.repository.getIsland(sentence.islandId);
        const fields = [
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
//# sourceMappingURL=SearchService.js.map