import { THEME_COLOR, THEME_STORAGE_KEY } from '../constants.js';
/** Applies light/dark theme with persisted preference and WCAG-safe meta theme-color. */
export class ThemeService {
    constructor(root = document.documentElement) {
        this.root = root;
        this.theme = ThemeService.readStoredTheme() ?? ThemeService.systemTheme();
        this.apply(this.theme);
    }
    init(toggle) {
        this.syncToggle(toggle);
        toggle.addEventListener('click', () => {
            this.apply(this.theme === 'light' ? 'dark' : 'light', true);
            this.syncToggle(toggle);
        });
    }
    getTheme() {
        return this.theme;
    }
    apply(theme, persist = false) {
        this.theme = theme;
        this.root.setAttribute('data-theme', theme);
        if (persist) {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
    }
    syncToggle(toggle) {
        const isDark = this.theme === 'dark';
        toggle.setAttribute('aria-pressed', String(isDark));
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    static readStoredTheme() {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : null;
    }
    static systemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
//# sourceMappingURL=ThemeService.js.map