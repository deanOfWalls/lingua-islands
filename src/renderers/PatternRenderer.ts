import { escapeHtml } from '../utils/html.js';
import type { CurriculumRepository } from '../repositories/CurriculumRepository.js';
import type { Pattern, PatternBlockOptions, Sentence } from '../types/index.js';

/** Pattern card and example markup. */
export class PatternRenderer {
  constructor(private readonly repository: CurriculumRepository) {}

  renderBlock(pattern: Pattern, options: PatternBlockOptions = {}): string {
    const formulaPinyin = this.repository.getPatternFormulaPinyin(pattern);
    const showHanzi = pattern.formula !== formulaPinyin;
    const compactClass = options.compact ? ' pattern-hanzi-details--compact' : '';

    return `
      <h3>${escapeHtml(pattern.name)}</h3>
      <div class="pattern-formula-pinyin">${escapeHtml(formulaPinyin)}</div>
      ${showHanzi ? `
        <details class="pattern-hanzi-details${compactClass}">
          <summary>Characters</summary>
          <div class="pattern-formula-hanzi">${escapeHtml(pattern.formula)}</div>
        </details>` : ''}
      <p class="pattern-meaning">${escapeHtml(pattern.meaning)}</p>
      ${pattern.notes ? `<p class="pattern-notes">${escapeHtml(pattern.notes)}</p>` : ''}`;
  }

  renderExamples(sentences: readonly Sentence[], limit = 5): string {
    const examples = sentences.slice(0, limit);
    if (!examples.length) return '';

    const items = examples.map((sentence) => `
      <button type="button" class="pattern-example" data-sentence="${sentence.id}">
        <div class="pattern-example-pinyin">${escapeHtml(sentence.pinyin)}</div>
        <div class="pattern-example-english">${escapeHtml(sentence.english)}</div>
        <details class="pattern-hanzi-details pattern-hanzi-details--compact">
          <summary>Characters</summary>
          <div class="pattern-example-hanzi">${escapeHtml(sentence.hanzi)}</div>
        </details>
      </button>`).join('');

    return `
      <div class="detail-section">
        <h4>Examples</h4>
        <div class="pattern-example-list">${items}</div>
      </div>`;
  }
}
