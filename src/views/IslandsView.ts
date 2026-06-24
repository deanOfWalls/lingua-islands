import { escapeHtml } from '../utils/html.js';
import { BaseView } from './BaseView.js';

export class IslandsView extends BaseView {
  render(): void {
    const { shell, repository, statsRenderer } = this.ctx;

    shell.setTitle('Islands');
    shell.setBackVisible(false);
    shell.setActions('');

    const cards = repository.getSortedIslands().map((island) => {
      const stats = repository.getIslandStats(island.id);
      return `
        <a href="#island/${island.id}" class="island-card">
          <div class="island-card-header">
            <h3>${escapeHtml(island.name)}</h3>
            <span class="island-priority">#${island.priority}</span>
          </div>
          <p>${escapeHtml(island.goal)}</p>
          ${statsRenderer.renderProgressBar(stats.mastered, stats.total)}
        </a>`;
    }).join('');

    shell.main.innerHTML = `
      <div class="page-header">
        <h2>Language Islands</h2>
        <p>Small areas of life where you can function in Mandarin.</p>
      </div>
      <div class="card-list">${cards}</div>`;
  }
}

export class IslandDetailView extends BaseView {
  render(islandId: string): void {
    const { shell, repository, router, statsRenderer, sentenceRenderer } = this.ctx;
    const island = repository.getIsland(islandId);

    if (!island) {
      router.navigate('#islands');
      return;
    }

    const sentences = repository.getSentencesForIsland(islandId);
    const stats = repository.getIslandStats(islandId);

    shell.setTitle(island.name);
    shell.setBackVisible(true);
    shell.setActions(`
      <a href="#practice-active?mode=island&island=${islandId}" class="icon-btn" aria-label="Practice island">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </a>`);

    shell.main.innerHTML = `
      <div class="page-header">
        <h2>${escapeHtml(island.name)}</h2>
        <p>${escapeHtml(island.goal)}</p>
      </div>
      ${statsRenderer.renderIslandStats(stats, 'mb-16')}
      <a href="#practice-active?mode=island&island=${islandId}" class="btn btn-primary btn-block mb-16">Practice This Island</a>
      <div class="card-list">${sentenceRenderer.renderRows(sentences)}</div>`;

    this.bindSentenceRows();
  }
}
