import type { AppContext } from '../app/AppContext.js';
import type { MasteryLevel } from '../types/index.js';

/** Base class for route views with shared DOM bindings. */
export abstract class BaseView {
  constructor(protected readonly ctx: AppContext) {}

  abstract render(...args: unknown[]): void;

  protected bindSentenceRows(): void {
    this.ctx.shell.queryMainAll('[data-sentence]').forEach((element) => {
      const row = element as HTMLElement;
      if (row.classList.contains('mastery-btn')) return;
      row.addEventListener('click', (event) => {
        if ((event.target as HTMLElement).closest('summary, details')) return;
        this.ctx.router.navigate(`#sentence/${row.dataset.sentence}`);
      });
    });
  }

  protected bindMasteryButtons(onUpdate?: () => void): void {
    this.ctx.shell.queryMainAll('.mastery-btn').forEach((element) => {
      const button = element as HTMLButtonElement;
      button.addEventListener('click', () => {
        const sentenceId = button.dataset.sentence!;
        const level = Number(button.dataset.mastery) as MasteryLevel;
        this.ctx.progress.setMastery(sentenceId, level);
        this.ctx.shell.queryMainAll(`.mastery-btn[data-sentence="${sentenceId}"]`).forEach((node) => {
          const masteryButton = node as HTMLButtonElement;
          masteryButton.classList.toggle(
            'selected',
            Number(masteryButton.dataset.mastery) === level,
          );
        });
        onUpdate?.();
      });
    });
  }
}
