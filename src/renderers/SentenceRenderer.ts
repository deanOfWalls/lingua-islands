import { escapeHtml } from '../utils/html.js';
import type { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import type { RevealContentOptions, Sentence } from '../types/index.js';
import { MasteryRenderer } from './MasteryRenderer.js';

/** Sentence list rows and detail content. */
export class SentenceRenderer {
  constructor(
    private readonly repository: CurriculumRepository,
    private readonly masteryRenderer: MasteryRenderer,
  ) {}

  renderRow(sentence: Sentence, showIsland = false): string {
    const island = showIsland ? this.repository.getIsland(sentence.islandId) : undefined;
    return `
      <button type="button" class="sentence-row" data-sentence="${sentence.id}">
        ${this.masteryRenderer.renderDot(sentence.id)}
        <div class="sentence-row-content">
          <div class="sentence-row-english">${escapeHtml(sentence.english)}</div>
          <div class="sentence-row-pinyin">${escapeHtml(sentence.pinyin)}</div>
          ${island ? `<div class="sentence-row-meta">${escapeHtml(island.name)}</div>` : ''}
        </div>
        ${this.masteryRenderer.renderFavoriteStar(sentence.id)}
      </button>`;
  }

  renderRows(sentences: readonly Sentence[], showIsland = false): string {
    return sentences.map((sentence) => this.renderRow(sentence, showIsland)).join('');
  }

  renderRevealContent(sentence: Sentence, options: RevealContentOptions = {}): string {
    const showMastery = options.showMastery ?? true;
    const showHeader = options.showHeader ?? true;

    return `
      ${showHeader ? `
        <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
        <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>` : ''}
      ${sentence.literal ? `<div class="literal-text">Literal: ${escapeHtml(sentence.literal)}</div>` : ''}
      ${this.renderStructureNotes(sentence)}
      ${this.renderBreakdown(sentence)}
      ${this.renderPatternTags(sentence)}
      ${this.renderUsageNotes(sentence)}
      ${this.renderExamples(sentence)}
      ${showMastery ? this.masteryRenderer.renderSection(sentence.id) : ''}`;
  }

  renderDetail(sentence: Sentence, islandName: string): string {
    return `
      <div class="sentence-detail">
        <div class="flashcard-label">${escapeHtml(islandName)}</div>
        <div class="sentence-detail-english">${escapeHtml(sentence.english)}</div>
        <div class="pinyin-large">${escapeHtml(sentence.pinyin)}</div>
        <div class="detail-section">
          <h4>Characters</h4>
          <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
        </div>
        ${this.renderRevealContent(sentence, { showHeader: false })}
        <div class="sentence-detail-actions">
          <a href="#practice-active?mode=single&sentence=${sentence.id}" class="btn btn-primary">Practice</a>
          <button type="button" class="btn btn-ghost" id="speak-btn-2">🔊 Listen</button>
        </div>
      </div>`;
  }

  private renderStructureNotes(sentence: Sentence): string {
    if (!sentence.structureNotes) return '';
    return `
      <div class="detail-section">
        <h4>Structure</h4>
        <p>${escapeHtml(sentence.structureNotes)}</p>
      </div>`;
  }

  private renderUsageNotes(sentence: Sentence): string {
    if (!sentence.usageNotes) return '';
    return `
      <div class="detail-section">
        <h4>Usage</h4>
        <p>${escapeHtml(sentence.usageNotes)}</p>
      </div>`;
  }

  private renderBreakdown(sentence: Sentence): string {
    if (!sentence.breakdown.length) return '';
    const rows = sentence.breakdown.map((word) => `
      <tr>
        <td class="breakdown-hanzi">${escapeHtml(word.hanzi)}</td>
        <td class="breakdown-pinyin">${escapeHtml(word.pinyin)}</td>
        <td>${escapeHtml(word.meaning)}</td>
      </tr>`).join('');

    return `
      <div class="detail-section">
        <h4>Word Breakdown</h4>
        <table class="breakdown-table"><tbody>${rows}</tbody></table>
      </div>`;
  }

  private renderPatternTags(sentence: Sentence): string {
    if (!sentence.patternIds.length) return '';
    const tags = sentence.patternIds.map((patternId) => {
      const pattern = this.repository.getPattern(patternId);
      if (!pattern) return '';
      const label = this.repository.getPatternFormulaPinyin(pattern);
      return `<a href="#pattern/${patternId}" class="tag">${escapeHtml(label)}</a>`;
    }).join('');

    return `
      <div class="detail-section">
        <h4>Patterns</h4>
        <div class="tag-list">${tags}</div>
      </div>`;
  }

  private renderExamples(sentence: Sentence): string {
    if (!sentence.examples.length) return '';
    const items = sentence.examples.map((example) => `
      <div class="example-item">
        <div class="example-hanzi">${escapeHtml(example.hanzi)}</div>
        <div class="example-pinyin">${escapeHtml(example.pinyin)}</div>
        <div class="example-english">${escapeHtml(example.english)}</div>
      </div>`).join('');

    return `
      <div class="detail-section">
        <h4>Related Examples</h4>
        ${items}
      </div>`;
  }
}
