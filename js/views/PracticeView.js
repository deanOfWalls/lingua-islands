import { escapeHtml } from '../utils/html.js';
import { BaseView } from './BaseView.js';
export class PracticeSetupView extends BaseView {
    render() {
        const { shell, repository } = this.ctx;
        shell.setTitle('Practice');
        shell.setBackVisible(false);
        shell.setActions('');
        const islandChips = repository.islands.map((island) => `
      <a href="#practice-active?mode=island&island=${island.id}" class="filter-chip">${escapeHtml(island.name.split('/')[0].trim())}</a>
    `).join('');
        shell.main.innerHTML = `
      <div class="page-header">
        <h2>Practice</h2>
        <p>See English, say Mandarin aloud, then reveal.</p>
      </div>
      <div class="action-grid">
        <a href="#practice-active?mode=all" class="btn btn-primary btn-block">Practice All Sentences</a>
        <a href="#practice-active?mode=weak" class="btn btn-ghost btn-block">Review Weak Sentences</a>
        <a href="#practice-active?mode=favorites" class="btn btn-ghost btn-block">Practice Favorites</a>
        <a href="#shadow" class="btn btn-secondary btn-block">Shadow Mode</a>
      </div>
      <div class="filter-section">
        <h3>By Island</h3>
        <div class="chip-grid">${islandChips}</div>
      </div>`;
    }
}
export class PracticeActiveView extends BaseView {
    render(params) {
        const { shell, practice, router, audio, sentenceRenderer, statsRenderer, rerender } = this.ctx;
        const queue = practice.startFlashcard(params);
        if (!queue.length) {
            shell.setTitle('Practice');
            shell.setBackVisible(true);
            shell.setActions('');
            shell.main.innerHTML = statsRenderer.renderEmptyState('No sentences to practice', 'Try a different filter or add more sentences.', '<a href="#practice" class="btn btn-primary mt-16">Back to Practice</a>');
            return;
        }
        const session = practice.getFlashcardSession();
        const sentence = session.queue[session.index];
        shell.setTitle(`Practice ${session.index + 1}/${session.queue.length}`);
        shell.setBackVisible(true);
        shell.setActions('');
        shell.main.innerHTML = `
      <div class="practice-container">
        ${statsRenderer.renderPracticeProgress(session.index, session.queue.length)}
        <div class="flashcard">
          <div class="flashcard-prompt">
            <div class="flashcard-label">Say it in Mandarin</div>
            <div class="flashcard-english">${escapeHtml(sentence.english)}</div>
            ${!session.revealed ? '<p class="flashcard-hint">Try speaking aloud before revealing</p>' : ''}
          </div>
          ${session.revealed ? `
            <div class="flashcard-reveal">
              <div class="audio-controls">
                <button type="button" class="btn btn-sm btn-ghost" id="speak-normal">🔊 Normal</button>
                <button type="button" class="btn btn-sm btn-ghost" id="speak-slow">🐢 Slow</button>
              </div>
              ${sentenceRenderer.renderRevealContent(sentence)}
            </div>` : ''}
        </div>
        <div class="practice-controls">
          ${!session.revealed ? `
            <button type="button" class="btn btn-primary btn-block" id="reveal-btn">Reveal Answer</button>
          ` : `
            <div class="practice-controls-row">
              <button type="button" class="btn btn-ghost" id="detail-btn">Details</button>
              <button type="button" class="btn btn-primary" id="next-btn">Next →</button>
            </div>
          `}
          <button type="button" class="btn btn-secondary btn-block" id="skip-btn">Skip</button>
        </div>
      </div>`;
        shell.queryMain('#reveal-btn')?.addEventListener('click', () => {
            practice.revealFlashcard();
            rerender();
            audio.speakSentence(sentence);
        });
        shell.queryMain('#speak-normal')?.addEventListener('click', () => audio.speakSentence(sentence, 'normal'));
        shell.queryMain('#speak-slow')?.addEventListener('click', () => audio.speakSentence(sentence, 'slow'));
        shell.queryMain('#next-btn')?.addEventListener('click', () => this.handleNext());
        shell.queryMain('#skip-btn')?.addEventListener('click', () => this.handleSkip());
        shell.queryMain('#detail-btn')?.addEventListener('click', () => {
            router.navigate(`#sentence/${sentence.id}`);
        });
        this.bindMasteryButtons();
    }
    handleNext() {
        const { shell, practice, statsRenderer, rerender } = this.ctx;
        const hasMore = practice.advanceFlashcard();
        if (!hasMore) {
            practice.clear();
            shell.setTitle('Done!');
            shell.setBackVisible(true);
            shell.main.innerHTML = statsRenderer.renderEmptyState('Session complete! 🎉', 'Great work. Use these sentences in real life today.', `
          <a href="#practice" class="btn btn-primary mt-16">Practice Again</a>
          <a href="#home" class="btn btn-ghost mt-16" style="display:block;margin-top:10px">Home</a>
        `);
            return;
        }
        rerender();
    }
    handleSkip() {
        const { practice, router, rerender } = this.ctx;
        const hasMore = practice.skipFlashcard();
        if (!hasMore) {
            practice.clear();
            router.navigate('#practice');
            return;
        }
        rerender();
    }
}
export class ShadowView extends BaseView {
    render(islandId) {
        const { shell, practice, audio, statsRenderer, rerender } = this.ctx;
        if (!practice.getShadowSession()) {
            practice.startShadow(islandId);
        }
        const session = practice.getShadowSession();
        if (!session)
            return;
        const sentence = session.queue[session.index];
        if (!sentence) {
            practice.clear();
            shell.setTitle('Shadow');
            shell.setBackVisible(true);
            shell.main.innerHTML = statsRenderer.renderEmptyState('Shadow session complete', '', '<a href="#home" class="btn btn-primary mt-16">Home</a>');
            return;
        }
        shell.setTitle(`Shadow ${session.index + 1}/${session.queue.length}`);
        shell.setBackVisible(true);
        shell.setActions('');
        shell.main.innerHTML = `
      <div class="practice-container">
        ${statsRenderer.renderPracticeProgress(session.index, session.queue.length)}
        <div class="flashcard">${this.renderStep(sentence, session.step)}</div>
        <div class="practice-controls">
          <button type="button" class="btn btn-ghost btn-block" id="shadow-replay">🔊 Replay</button>
          <button type="button" class="btn btn-primary btn-block" id="shadow-next">${this.nextLabel(session.step)}</button>
        </div>
      </div>`;
        if (session.step === 'listen') {
            window.setTimeout(() => audio.speakSentence(sentence), 300);
        }
        shell.queryMain('#shadow-replay')?.addEventListener('click', () => audio.speakSentence(sentence));
        shell.queryMain('#shadow-next')?.addEventListener('click', () => {
            practice.advanceShadowStep();
            rerender();
        });
    }
    nextLabel(step) {
        if (step === 'listen')
            return 'Ready to repeat';
        if (step === 'repeat')
            return 'Show meaning';
        return 'Next sentence';
    }
    renderStep(sentence, step) {
        if (step === 'listen') {
            return `
        <div class="shadow-step">
          <div class="shadow-step-icon">👂</div>
          <h3>Listen</h3>
          <p>Pay attention to tones and rhythm.</p>
          <div class="pinyin-large mt-16">${escapeHtml(sentence.pinyin)}</div>
          <details class="pattern-hanzi-details pattern-hanzi-details--compact mt-16">
            <summary>Characters</summary>
            <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
          </details>
        </div>`;
        }
        if (step === 'repeat') {
            return `
        <div class="shadow-step">
          <div class="shadow-step-icon">🗣️</div>
          <h3>Repeat aloud</h3>
          <p>Copy the pronunciation and flow.</p>
          <div class="pinyin-large mt-16">${escapeHtml(sentence.pinyin)}</div>
          <p class="mt-16" style="color:var(--text-muted)">${escapeHtml(sentence.english)}</p>
          <details class="pattern-hanzi-details pattern-hanzi-details--compact mt-16">
            <summary>Characters</summary>
            <div class="hanzi-large">${escapeHtml(sentence.hanzi)}</div>
          </details>
        </div>`;
        }
        return `
      <div class="shadow-step">
        <div class="shadow-step-icon">💡</div>
        <h3>Meaning</h3>
        <p>${escapeHtml(sentence.english)}</p>
        ${sentence.literal ? `<p class="mt-16" style="font-style:italic;color:var(--text-muted)">${escapeHtml(sentence.literal)}</p>` : ''}
      </div>`;
    }
}
//# sourceMappingURL=PracticeView.js.map