import { shuffle } from '../utils/array.js';
import { WEAK_THRESHOLD } from '../constants.js';
/** Encapsulates flashcard and shadow session state. */
export class PracticeSessionService {
    constructor(repository, progress) {
        this.repository = repository;
        this.progress = progress;
        this.session = null;
    }
    clear() {
        this.session = null;
    }
    getSession() {
        return this.session;
    }
    startFlashcard(params) {
        const paramsKey = JSON.stringify(params);
        if (this.session?.kind === 'flashcard' &&
            this.session.paramsKey === paramsKey) {
            return this.session.queue;
        }
        const queue = this.buildQueue(params);
        this.session = {
            kind: 'flashcard',
            queue,
            index: 0,
            revealed: false,
            paramsKey,
        };
        return queue;
    }
    getFlashcardSession() {
        return this.session?.kind === 'flashcard' ? this.session : null;
    }
    revealFlashcard() {
        if (this.session?.kind === 'flashcard') {
            this.session.revealed = true;
        }
    }
    advanceFlashcard() {
        if (this.session?.kind !== 'flashcard')
            return false;
        this.session.index += 1;
        this.session.revealed = false;
        return this.session.index < this.session.queue.length;
    }
    skipFlashcard() {
        return this.advanceFlashcard();
    }
    startShadow(islandId) {
        let queue = shuffle([...this.repository.sentences]);
        if (islandId) {
            queue = queue.filter((sentence) => sentence.islandId === islandId);
        }
        this.session = {
            kind: 'shadow',
            queue,
            index: 0,
            step: 'listen',
        };
    }
    getShadowSession() {
        return this.session?.kind === 'shadow' ? this.session : null;
    }
    advanceShadowStep() {
        if (this.session?.kind !== 'shadow')
            return;
        const steps = ['listen', 'repeat', 'meaning'];
        const currentIndex = steps.indexOf(this.session.step);
        if (currentIndex < steps.length - 1) {
            this.session.step = steps[currentIndex + 1];
            return;
        }
        this.session.index += 1;
        this.session.step = 'listen';
    }
    buildQueue(params) {
        let queue = [...this.repository.sentences];
        switch (params.mode) {
            case 'weak':
                queue = queue.filter((sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD);
                break;
            case 'favorites':
                queue = queue.filter((sentence) => this.progress.isFavorite(sentence.id));
                break;
            case 'island':
                queue = queue.filter((sentence) => sentence.islandId === params.island);
                break;
            case 'pattern':
                queue = queue.filter((sentence) => sentence.patternIds.includes(params.pattern));
                break;
            case 'single':
                queue = queue.filter((sentence) => sentence.id === params.sentence);
                break;
            default:
                break;
        }
        return shuffle(queue);
    }
}
//# sourceMappingURL=PracticeSessionService.js.map