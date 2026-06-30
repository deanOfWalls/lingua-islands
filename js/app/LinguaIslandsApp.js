import { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import { MasteryRenderer } from '../renderers/MasteryRenderer.js';
import { PatternRenderer } from '../renderers/PatternRenderer.js';
import { SentenceRenderer } from '../renderers/SentenceRenderer.js';
import { StatsRenderer } from '../renderers/StatsRenderer.js';
import { Router } from '../router/Router.js';
import { AudioService } from '../services/AudioService.js';
import { PracticeSessionService } from '../services/PracticeSessionService.js';
import { ProgressStore } from '../services/ProgressStore.js';
import { SearchService } from '../services/SearchService.js';
import { ShellController } from '../ui/ShellController.js';
import { DATA_URL } from '../constants.js';
import { HomeView } from '../views/HomeView.js';
import { IslandDetailView, IslandsView } from '../views/IslandsView.js';
import { PatternDetailView, PatternsView } from '../views/PatternsView.js';
import { PracticeActiveView, PracticeSetupView, ShadowView } from '../views/PracticeView.js';
import { SearchView } from '../views/SearchView.js';
import { SentenceDetailView } from '../views/SentenceDetailView.js';
/** Application root: wires services, views, and routing. */
export class LinguaIslandsApp {
    constructor(elements) {
        this.progress = new ProgressStore();
        this.router = new Router();
        this.audio = new AudioService();
        this.statsRenderer = new StatsRenderer();
        this.shell = new ShellController(elements);
    }
    async init() {
        this.progress.load();
        this.shell.bindBack(() => {
            this.router.goBack(this.router.parseHash().view);
        });
        try {
            const pack = await this.loadCurriculum();
            this.repository = new CurriculumRepository(pack, this.progress);
            this.search = new SearchService(this.repository, this.progress);
            this.practice = new PracticeSessionService(this.repository, this.progress);
            const masteryRenderer = new MasteryRenderer(this.progress);
            const patternRenderer = new PatternRenderer(this.repository);
            const sentenceRenderer = new SentenceRenderer(this.repository, masteryRenderer);
            this.ctx = {
                shell: this.shell,
                router: this.router,
                repository: this.repository,
                progress: this.progress,
                search: this.search,
                practice: this.practice,
                audio: this.audio,
                sentenceRenderer,
                patternRenderer,
                masteryRenderer,
                statsRenderer: this.statsRenderer,
                rerender: () => this.render(),
            };
            this.render();
            window.addEventListener('hashchange', () => this.render());
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.shell.main.innerHTML = this.statsRenderer.renderEmptyState('Could not load data', message, '<p style="margin-top:12px;font-size:0.85rem">Make sure starter-pack.json is in the same directory.</p>');
        }
    }
    async loadCurriculum() {
        const response = await fetch(DATA_URL);
        if (!response.ok)
            throw new Error('Failed to load data');
        return response.json();
    }
    render() {
        this.audio.stop();
        const route = this.router.parseHash();
        this.shell.setActiveNav(this.router.resolveActiveNav(route.view));
        switch (route.view) {
            case 'home':
                new HomeView(this.ctx).render();
                break;
            case 'islands':
                new IslandsView(this.ctx).render();
                break;
            case 'island':
                new IslandDetailView(this.ctx).render(route.parts[0] ?? '');
                break;
            case 'patterns':
                new PatternsView(this.ctx).render();
                break;
            case 'pattern':
                new PatternDetailView(this.ctx).render(route.parts[0] ?? '');
                break;
            case 'sentence':
                new SentenceDetailView(this.ctx).render(route.parts[0] ?? '');
                break;
            case 'practice':
                this.practice.clear();
                new PracticeSetupView(this.ctx).render();
                break;
            case 'practice-active':
                new PracticeActiveView(this.ctx).render(route.params);
                break;
            case 'shadow':
                if (this.practice.getSession()?.kind !== 'shadow') {
                    this.practice.clear();
                }
                new ShadowView(this.ctx).render(route.params.island);
                break;
            case 'search':
                new SearchView(this.ctx).render();
                break;
            default:
                this.router.navigate('#home');
        }
    }
}
//# sourceMappingURL=LinguaIslandsApp.js.map