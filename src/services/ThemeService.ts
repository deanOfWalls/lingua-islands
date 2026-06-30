import { THEME_COLOR, THEME_STORAGE_KEY, type ThemePreference } from '../constants.js';

/** Applies light/dark theme with persisted preference and WCAG-safe meta theme-color. */
export class ThemeService {
  private theme: ThemePreference;

  constructor(private readonly root: HTMLElement = document.documentElement) {
    this.theme = ThemeService.readStoredTheme() ?? ThemeService.systemTheme();
    this.apply(this.theme);
  }

  init(toggle: HTMLButtonElement): void {
    this.syncToggle(toggle);
    toggle.addEventListener('click', () => {
      this.apply(this.theme === 'light' ? 'dark' : 'light', true);
      this.syncToggle(toggle);
    });
  }

  getTheme(): ThemePreference {
    return this.theme;
  }

  private apply(theme: ThemePreference, persist = false): void {
    this.theme = theme;
    this.root.setAttribute('data-theme', theme);
    if (persist) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  }

  private syncToggle(toggle: HTMLButtonElement): void {
    const isDark = this.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  private static readStoredTheme(): ThemePreference | null {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  }

  private static systemTheme(): ThemePreference {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
