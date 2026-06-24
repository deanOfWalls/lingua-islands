import { BACK_ROUTES } from '../constants.js';
/** Hash-based client routing. */
export class Router {
    parseHash() {
        const raw = location.hash.slice(1) || 'home';
        const [path, queryString] = raw.split('?');
        const parts = path.split('/').filter(Boolean);
        const params = {};
        if (queryString) {
            new URLSearchParams(queryString).forEach((value, key) => {
                params[key] = value;
            });
        }
        return { view: parts[0] ?? 'home', parts: parts.slice(1), params };
    }
    navigate(hash) {
        location.hash = hash;
    }
    goBack(view) {
        this.navigate(BACK_ROUTES[view] ?? '#home');
    }
    resolveActiveNav(view) {
        if (['island', 'sentence'].includes(view))
            return 'islands';
        if (view === 'pattern')
            return 'patterns';
        if (['practice-active', 'shadow'].includes(view))
            return 'practice';
        return view;
    }
}
//# sourceMappingURL=Router.js.map