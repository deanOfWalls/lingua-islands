import { LifeLingoApp } from './app/LifeLingoApp.js';
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
    };
}
const app = new LifeLingoApp(getShellElements());
app.init();
//# sourceMappingURL=main.js.map