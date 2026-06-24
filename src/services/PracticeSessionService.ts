import { shuffle } from '../utils/array.js';
import type { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import type {
  FlashcardSession,
  PracticeParams,
  PracticeSession,
  Sentence,
  ShadowSession,
  ShadowStep,
} from '../types/index.js';
import type { ProgressStore } from './ProgressStore.js';
import { WEAK_THRESHOLD } from '../constants.js';

/** Encapsulates flashcard and shadow session state. */
export class PracticeSessionService {
  private session: PracticeSession | null = null;

  constructor(
    private readonly repository: CurriculumRepository,
    private readonly progress: ProgressStore,
  ) {}

  clear(): void {
    this.session = null;
  }

  getSession(): PracticeSession | null {
    return this.session;
  }

  startFlashcard(params: PracticeParams): Sentence[] {
    const paramsKey = JSON.stringify(params);
    if (
      this.session?.kind === 'flashcard' &&
      this.session.paramsKey === paramsKey
    ) {
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

  getFlashcardSession(): FlashcardSession | null {
    return this.session?.kind === 'flashcard' ? this.session : null;
  }

  revealFlashcard(): void {
    if (this.session?.kind === 'flashcard') {
      this.session.revealed = true;
    }
  }

  advanceFlashcard(): boolean {
    if (this.session?.kind !== 'flashcard') return false;
    this.session.index += 1;
    this.session.revealed = false;
    return this.session.index < this.session.queue.length;
  }

  skipFlashcard(): boolean {
    return this.advanceFlashcard();
  }

  startShadow(islandId?: string): void {
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

  getShadowSession(): ShadowSession | null {
    return this.session?.kind === 'shadow' ? this.session : null;
  }

  advanceShadowStep(): void {
    if (this.session?.kind !== 'shadow') return;

    const steps: ShadowStep[] = ['listen', 'repeat', 'meaning'];
    const currentIndex = steps.indexOf(this.session.step);
    if (currentIndex < steps.length - 1) {
      this.session.step = steps[currentIndex + 1]!;
      return;
    }

    this.session.index += 1;
    this.session.step = 'listen';
  }

  private buildQueue(params: PracticeParams): Sentence[] {
    let queue = [...this.repository.sentences];

    switch (params.mode) {
      case 'weak':
        queue = queue.filter(
          (sentence) => this.progress.getMastery(sentence.id) < WEAK_THRESHOLD,
        );
        break;
      case 'favorites':
        queue = queue.filter((sentence) => this.progress.isFavorite(sentence.id));
        break;
      case 'island':
        queue = queue.filter((sentence) => sentence.islandId === params.island);
        break;
      case 'pattern':
        queue = queue.filter((sentence) => sentence.patternIds.includes(params.pattern!));
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
