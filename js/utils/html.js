/** HTML escaping for safe template output. */
export function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}
//# sourceMappingURL=html.js.map