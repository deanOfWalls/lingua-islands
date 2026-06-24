import { BaseView } from './BaseView.js';

export class SentenceDetailView extends BaseView {
  render(sentenceId: string): void {
    const { shell, repository, router, progress, audio, sentenceRenderer, rerender } = this.ctx;
    const sentence = repository.getSentence(sentenceId);

    if (!sentence) {
      router.navigate('#islands');
      return;
    }

    const island = repository.getIsland(sentence.islandId);
    const isFavorite = progress.isFavorite(sentenceId);

    shell.setTitle('Sentence');
    shell.setBackVisible(true);
    shell.setActions(`
      <button type="button" class="icon-btn" id="fav-btn" aria-label="Toggle favorite">
        <span style="font-size:1.25rem;color:${isFavorite ? '#e8a317' : 'inherit'}">★</span>
      </button>
      <button type="button" class="icon-btn" id="speak-btn" aria-label="Play audio">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
      </button>`);

    shell.main.innerHTML = sentenceRenderer.renderDetail(sentence, island?.name ?? '');

    shell.queryMain('#fav-btn')?.addEventListener('click', () => {
      progress.toggleFavorite(sentenceId);
      rerender();
    });
    shell.queryMain('#speak-btn')?.addEventListener('click', () => audio.speakSentence(sentence));
    shell.queryMain('#speak-normal')?.addEventListener('click', () => audio.speakSentence(sentence, 'normal'));
    shell.queryMain('#speak-slow')?.addEventListener('click', () => audio.speakSentence(sentence, 'slow'));

    this.bindMasteryButtons();
  }
}
