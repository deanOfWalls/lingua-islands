import { BaseView } from './BaseView.js';

export class PatternsView extends BaseView {
  render(): void {
    const { shell, repository, patternRenderer } = this.ctx;

    shell.setTitle('Patterns');
    shell.setBackVisible(false);
    shell.setActions('');

    const cards = repository.patterns.map((pattern) => {
      const count = repository.getSentencesForPattern(pattern.id).length;
      return `
        <a href="#pattern/${pattern.id}" class="pattern-card">
          ${patternRenderer.renderBlock(pattern, { compact: true })}
          <div class="island-meta" style="margin-top:10px">
            <span>${count} sentence${count !== 1 ? 's' : ''}</span>
          </div>
        </a>`;
    }).join('');

    shell.main.innerHTML = `
      <div class="page-header">
        <h2>Grammar Patterns</h2>
        <p>Reusable pinyin structures across your islands.</p>
      </div>
      <div class="card-list">${cards}</div>`;
  }
}

export class PatternDetailView extends BaseView {
  render(patternId: string): void {
    const { shell, repository, router, patternRenderer, sentenceRenderer } = this.ctx;
    const pattern = repository.getPattern(patternId);

    if (!pattern) {
      router.navigate('#patterns');
      return;
    }

    const sentences = repository.getSentencesForPattern(patternId);

    shell.setTitle(pattern.name);
    shell.setBackVisible(true);
    shell.setActions(`
      <a href="#practice-active?mode=pattern&pattern=${patternId}" class="icon-btn" aria-label="Practice pattern">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      </a>`);

    shell.main.innerHTML = `
      <div class="pattern-card pattern-card--detail" style="margin-bottom:16px">
        ${patternRenderer.renderBlock(pattern)}
        ${patternRenderer.renderExamples(sentences)}
      </div>
      <a href="#practice-active?mode=pattern&pattern=${patternId}" class="btn btn-primary btn-block mb-16">Practice Pattern</a>
      <div class="page-header" style="margin-bottom:12px">
        <h2 style="font-size:1.1rem">All sentences</h2>
      </div>
      <div class="card-list">${sentenceRenderer.renderRows(sentences, true)}</div>`;

    this.bindSentenceRows();
  }
}
