import { escapeHtml } from '../utils/html.js';
import type { IslandStats, OverallStats } from '../types/index.js';

/** Reusable stat and progress UI fragments. */
export class StatsRenderer {
  renderOverallStats(stats: OverallStats): string {
    return `
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">${stats.total}</span>
          <span class="stat-label">Sentences</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.mastered}</span>
          <span class="stat-label">Natural+</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.weak}</span>
          <span class="stat-label">To review</span>
        </div>
      </div>`;
  }

  renderIslandStats(stats: IslandStats, className = ''): string {
    return `
      <div class="stats-row ${className}">
        <div class="stat-card">
          <span class="stat-value">${stats.total}</span>
          <span class="stat-label">Sentences</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.mastered}</span>
          <span class="stat-label">Natural+</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${stats.total - stats.mastered}</span>
          <span class="stat-label">Learning</span>
        </div>
      </div>`;
  }

  renderProgressBar(mastered: number, total: number): string {
    const pct = total ? Math.round((mastered / total) * 100) : 0;
    return `
      <div class="island-meta">
        <span>${total} sentences</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        <span>${pct}%</span>
      </div>`;
  }

  renderPracticeProgress(current: number, total: number): string {
    const pct = Math.round((current / total) * 100);
    return `
      <div class="practice-progress">
        <span>${current + 1} / ${total}</span>
        <div class="practice-progress-bar">
          <div class="practice-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }

  renderEmptyState(title: string, message: string, actionHtml = ''): string {
    return `
      <div class="empty-state">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(message)}</p>
        ${actionHtml}
      </div>`;
  }
}
