import { APP_NAME } from '../constants.js';
import { BaseView } from './BaseView.js';

export class HomeView extends BaseView {
  render(): void {
    const { shell, repository, statsRenderer } = this.ctx;
    const stats = repository.getOverallStats();

    shell.setTitle(APP_NAME);
    shell.setBackVisible(false);
    shell.setActions('');

    shell.main.innerHTML = `
      <div class="hero-brand">
        <h2>${APP_NAME}</h2>
        <p>Learn the language of your own life.</p>
      </div>
      ${statsRenderer.renderOverallStats(stats)}
      <div class="action-grid">
        <a href="#practice-active?mode=all" class="action-card">
          <div class="action-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8M8 12h8"/></svg>
          </div>
          <div class="action-card-text">
            <h3>Practice All</h3>
            <p>Active recall from English</p>
          </div>
        </a>
        <a href="#islands" class="action-card">
          <div class="action-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
          </div>
          <div class="action-card-text">
            <h3>Browse Islands</h3>
            <p>Life topics & sentences</p>
          </div>
        </a>
        <a href="#practice-active?mode=weak" class="action-card">
          <div class="action-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
          </div>
          <div class="action-card-text">
            <h3>Review Weak</h3>
            <p>Sentences below level 2</p>
          </div>
        </a>
        <a href="#shadow" class="action-card">
          <div class="action-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>
          </div>
          <div class="action-card-text">
            <h3>Shadow Mode</h3>
            <p>Listen, repeat, next</p>
          </div>
        </a>
      </div>
      <div class="page-header">
        <h2>Daily tip</h2>
        <p>If you know the Mandarin, don't say the English. Use it in real life.</p>
      </div>`;
  }
}