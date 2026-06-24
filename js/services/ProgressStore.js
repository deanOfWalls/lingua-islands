import { STORAGE_KEY } from '../constants.js';
/** Encapsulates learner progress persisted in localStorage. */
export class ProgressStore {
    constructor() {
        this.data = {};
    }
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            this.data = raw ? JSON.parse(raw) : {};
        }
        catch {
            this.data = {};
        }
    }
    getMastery(sentenceId) {
        const level = this.data[sentenceId]?.mastery;
        return level ?? 0;
    }
    setMastery(sentenceId, level) {
        this.ensureEntry(sentenceId);
        this.data[sentenceId].mastery = level;
        this.persist();
    }
    isFavorite(sentenceId) {
        return this.data[sentenceId]?.favorite ?? false;
    }
    toggleFavorite(sentenceId) {
        this.ensureEntry(sentenceId);
        const next = !this.isFavorite(sentenceId);
        this.data[sentenceId].favorite = next;
        this.persist();
        return next;
    }
    ensureEntry(sentenceId) {
        if (!this.data[sentenceId]) {
            this.data[sentenceId] = { mastery: 0 };
        }
    }
    persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }
}
//# sourceMappingURL=ProgressStore.js.map