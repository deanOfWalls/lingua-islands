import type { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import type { Router } from '../router/Router.js';
import type { MasteryRenderer } from '../renderers/MasteryRenderer.js';
import type { PatternRenderer } from '../renderers/PatternRenderer.js';
import type { SentenceRenderer } from '../renderers/SentenceRenderer.js';
import type { StatsRenderer } from '../renderers/StatsRenderer.js';
import type { AudioService } from '../services/AudioService.js';
import type { PracticeSessionService } from '../services/PracticeSessionService.js';
import type { ProgressStore } from '../services/ProgressStore.js';
import type { SearchService } from '../services/SearchService.js';
import type { ShellController } from '../ui/ShellController.js';

/** Shared dependencies injected into views and controllers. */
export interface AppContext {
  shell: ShellController;
  router: Router;
  repository: CurriculumRepository;
  progress: ProgressStore;
  search: SearchService;
  practice: PracticeSessionService;
  audio: AudioService;
  sentenceRenderer: SentenceRenderer;
  patternRenderer: PatternRenderer;
  masteryRenderer: MasteryRenderer;
  statsRenderer: StatsRenderer;
  rerender: () => void;
}
