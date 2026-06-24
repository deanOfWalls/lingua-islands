/** Base class for route views with shared DOM bindings. */
export class BaseView {
    constructor(ctx) {
        this.ctx = ctx;
    }
    bindSentenceRows() {
        this.ctx.shell.queryMainAll('[data-sentence]').forEach((element) => {
            const row = element;
            if (row.classList.contains('mastery-btn'))
                return;
            row.addEventListener('click', (event) => {
                if (event.target.closest('summary, details'))
                    return;
                this.ctx.router.navigate(`#sentence/${row.dataset.sentence}`);
            });
        });
    }
    bindMasteryButtons(onUpdate) {
        this.ctx.shell.queryMainAll('.mastery-btn').forEach((element) => {
            const button = element;
            button.addEventListener('click', () => {
                const sentenceId = button.dataset.sentence;
                const level = Number(button.dataset.mastery);
                this.ctx.progress.setMastery(sentenceId, level);
                this.ctx.shell.queryMainAll(`.mastery-btn[data-sentence="${sentenceId}"]`).forEach((node) => {
                    const masteryButton = node;
                    masteryButton.classList.toggle('selected', Number(masteryButton.dataset.mastery) === level);
                });
                onUpdate?.();
            });
        });
    }
}
//# sourceMappingURL=BaseView.js.map