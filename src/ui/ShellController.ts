import type { ShellElements } from '../types/index.js';

/** Controls persistent app chrome: header, back button, bottom nav. */
export class ShellController {
  constructor(private readonly elements: ShellElements) {}

  get main(): HTMLElement {
    return this.elements.main;
  }

  setTitle(title: string): void {
    this.elements.topTitle.textContent = title;
  }

  setBackVisible(visible: boolean): void {
    this.elements.backBtn.classList.toggle('hidden', !visible);
  }

  setActions(html: string): void {
    this.elements.topActions.innerHTML = html;
  }

  setActiveNav(navKey: string): void {
    this.elements.bottomNav.querySelectorAll('.nav-item').forEach((element) => {
      const item = element as HTMLElement;
      item.classList.toggle('active', item.dataset.nav === navKey);
    });
  }

  queryMain<T extends Element>(selector: string): T | null {
    return this.elements.main.querySelector(selector);
  }

  queryMainAll(selector: string): NodeListOf<Element> {
    return this.elements.main.querySelectorAll(selector);
  }

  bindBack(handler: () => void): void {
    this.elements.backBtn.addEventListener('click', handler);
  }
}
