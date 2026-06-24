import { MASTERED_THRESHOLD, WEAK_THRESHOLD } from '../constants.js';
/** Read-only access to curriculum data and derived stats. */
export class CurriculumRepository {
    constructor(pack, progress) {
        this.pack = pack;
        this.progress = progress;
    }
    get islands() {
        return this.pack.islands;
    }
    get patterns() {
        return this.pack.patterns;
    }
    get sentences() {
        return this.pack.sentences;
    }
    getIsland(islandId) {
        return this.pack.islands.find((island) => island.id === islandId);
    }
    getPattern(patternId) {
        return this.pack.patterns.find((pattern) => pattern.id === patternId);
    }
    getSentence(sentenceId) {
        return this.pack.sentences.find((sentence) => sentence.id === sentenceId);
    }
    getSentencesForIsland(islandId) {
        return this.pack.sentences.filter((sentence) => sentence.islandId === islandId);
    }
    getSentencesForPattern(patternId) {
        return this.pack.sentences.filter((sentence) => sentence.patternIds.includes(patternId));
    }
    getPatternFormulaPinyin(pattern) {
        return pattern.formulaPinyin ?? pattern.formula;
    }
    getIslandStats(islandId) {
        const sentences = this.getSentencesForIsland(islandId);
        const mastered = sentences.filter((sentence) => this.progress.getMastery(sentence.id) >= MASTERED_THRESHOLD).length;
        return { total: sentences.length, mastered };
    }
    getOverallStats() {
        const { sentences } = this.pack;
        const mastered = sentences.filter((sentence) => this.progress.getMastery(sentence.id) >= MASTERED_THRESHOLD).length;
        const weak = sentences.filter((sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD).length;
        const practiced = sentences.filter((sentence) => this.progress.getMastery(sentence.id) > 0).length;
        return { total: sentences.length, mastered, weak, practiced };
    }
    getSortedIslands() {
        return [...this.pack.islands].sort((a, b) => a.priority - b.priority);
    }
}
//# sourceMappingURL=CurriculumRepository.js.map