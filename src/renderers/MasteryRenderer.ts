import { MASTERY_LABELS, MASTERY_LEVELS } from '../constants.js';
import { escapeHtml } from '../utils/html.js';
import type { MasteryLevel } from '../types/index.js';
import type { ProgressStore } from '../services/ProgressStore.js';

/** Mastery indicators and rating controls. */
export class MasteryRenderer {
  constructor(private readonly progress: ProgressStore) {}

  renderDot(sentenceId: string): string {
    const level = this.progress.getMastery(sentenceId);
    return `<span class="mastery-dot mastery-dot--${level}" title="${MASTERY_LABELS[level]}"></span>`;
  }

  renderFavoriteStar(sentenceId: string): string {
    const active = this.progress.isFavorite(sentenceId) ? 'active' : '';
    return `<span class="fav-star ${active}" aria-hidden="true">★</span>`;
  }

  renderButtons(sentenceId: string, selected?: MasteryLevel): string {
    const current = selected ?? this.progress.getMastery(sentenceId);
    return MASTERY_LEVELS.map((level) => `
      <button type="button" class="mastery-btn ${current === level ? 'selected' : ''}"
        data-mastery="${level}" data-sentence="${sentenceId}">
        <span class="mastery-btn-num">${level}</span>
        ${MASTERY_LABELS[level]}
      </button>`).join('');
  }

  renderSection(sentenceId: string): string {
    return `
      <div class="detail-section">
        <h4>How well do you know this?</h4>
        <div class="mastery-row">${this.renderButtons(sentenceId)}</div>
      </div>`;
  }
}

export { escapeHtml };
