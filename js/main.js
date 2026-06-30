import { LinguaIslandsApp } from './app/LinguaIslandsApp.js';
import { ThemeService } from './services/ThemeService.js';
function queryRequired(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Missing required element: ${selector}`);
    }
    return element;
}
function getShellElements() {
    return {
        main: queryRequired('#main-content'),
        topTitle: queryRequired('#top-title'),
        backBtn: queryRequired('#back-btn'),
        topActions: queryRequired('#top-actions'),
        bottomNav: queryRequired('#bottom-nav'),
        themeToggle: queryRequired('#theme-toggle'),
    };
}
const theme = new ThemeService();
theme.init(getShellElements().themeToggle);
const app = new LinguaIslandsApp(getShellElements());
app.init();
//# sourceMappingURL=main.js.map