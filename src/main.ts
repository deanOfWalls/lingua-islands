import { LifeLingoApp } from './app/LifeLingoApp.js';
import type { ShellElements } from './types/index.js';

function queryRequired<T extends Element>(selector: string): T {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
  return element as T;
}

function getShellElements(): ShellElements {
  return {
    main: queryRequired<HTMLElement>('#main-content'),
    topTitle: queryRequired<HTMLElement>('#top-title'),
    backBtn: queryRequired<HTMLButtonElement>('#back-btn'),
    topActions: queryRequired<HTMLElement>('#top-actions'),
    bottomNav: queryRequired<HTMLElement>('#bottom-nav'),
  };
}

const app = new LifeLingoApp(getShellElements());
app.init();
