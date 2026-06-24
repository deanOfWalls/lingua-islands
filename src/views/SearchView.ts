import { BaseView } from './BaseView.js';

type SearchFilterKey = 'all' | 'weak' | 'favorites';

export class SearchView extends BaseView {
  render(): void {
    const { shell, repository, search, sentenceRenderer } = this.ctx;

    shell.setTitle('Search');
    shell.setBackVisible(false);
    shell.setActions('');

    shell.main.innerHTML = `
      <div class="search-box">
        <div class="search-input-wrap">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" class="search-input" id="search-input"
            placeholder="English, hanzi, pinyin, tags…" autocomplete="off" enterkeyhint="search">
        </div>
        <div class="search-filters" id="search-filters">
          <button type="button" class="filter-chip active" data-filter="all">All</button>
          <button type="button" class="filter-chip" data-filter="weak">Weak</button>
          <button type="button" class="filter-chip" data-filter="favorites">★ Favorites</button>
        </div>
      </div>
      <div id="search-results">
        <p class="search-results-count">Type to search ${repository.sentences.length} sentences</p>
      </div>`;

    const input = shell.queryMain<HTMLInputElement>('#search-input');
    const filtersContainer = shell.queryMain('#search-filters');
    const resultsContainer = shell.queryMain('#search-results');
    if (!input || !filtersContainer || !resultsContainer) return;

    let activeFilter: SearchFilterKey = 'all';

    const renderResults = (): void => {
      const filters =
        activeFilter === 'weak'
          ? { weak: true }
          : activeFilter === 'favorites'
            ? { favorites: true }
            : {};

      const results = search.search(input.value, filters);
      resultsContainer.innerHTML = `
        <p class="search-results-count">${results.length} result${results.length !== 1 ? 's' : ''}</p>
        <div class="card-list">
          ${results.length
            ? sentenceRenderer.renderRows(results, true)
            : '<div class="empty-state"><p>No matches found</p></div>'}
        </div>`;
      this.bindSentenceRows();
    };

    input.addEventListener('input', renderResults);
    filtersContainer.addEventListener('click', (event) => {
      const chip = (event.target as HTMLElement).closest('.filter-chip') as HTMLElement | null;
      if (!chip) return;
      activeFilter = chip.dataset.filter as SearchFilterKey;
      filtersContainer.querySelectorAll('.filter-chip').forEach((element) => {
        element.classList.toggle('active', element === chip);
      });
      renderResults();
    });

    input.focus();
  }
}
