import { BACK_ROUTES } from '../constants.js';
import type { RouteState } from '../types/index.js';

/** Hash-based client routing. */
export class Router {
  parseHash(): RouteState {
    const raw = location.hash.slice(1) || 'home';
    const [path, queryString] = raw.split('?');
    const parts = path.split('/').filter(Boolean);
    const params: Record<string, string> = {};

    if (queryString) {
      new URLSearchParams(queryString).forEach((value, key) => {
        params[key] = value;
      });
    }

    return { view: parts[0] ?? 'home', parts: parts.slice(1), params };
  }

  navigate(hash: string): void {
    location.hash = hash;
  }

  goBack(view: string): void {
    this.navigate(BACK_ROUTES[view] ?? '#home');
  }

  resolveActiveNav(view: string): string {
    if (['island', 'sentence'].includes(view)) return 'islands';
    if (view === 'pattern') return 'patterns';
    if (['practice-active', 'shadow'].includes(view)) return 'practice';
    return view;
  }
}
