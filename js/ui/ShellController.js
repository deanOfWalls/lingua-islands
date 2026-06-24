/** Controls persistent app chrome: header, back button, bottom nav. */
export class ShellController {
    constructor(elements) {
        this.elements = elements;
    }
    get main() {
        return this.elements.main;
    }
    setTitle(title) {
        this.elements.topTitle.textContent = title;
    }
    setBackVisible(visible) {
        this.elements.backBtn.classList.toggle('hidden', !visible);
    }
    setActions(html) {
        this.elements.topActions.innerHTML = html;
    }
    setActiveNav(navKey) {
        this.elements.bottomNav.querySelectorAll('.nav-item').forEach((element) => {
            const item = element;
            item.classList.toggle('active', item.dataset.nav === navKey);
        });
    }
    queryMain(selector) {
        return this.elements.main.querySelector(selector);
    }
    queryMainAll(selector) {
        return this.elements.main.querySelectorAll(selector);
    }
    bindBack(handler) {
        this.elements.backBtn.addEventListener('click', handler);
    }
}
//# sourceMappingURL=ShellController.js.map