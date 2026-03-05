/* Study History Page */
const HistoryPage = (() => {
    const typeIcons = { summarize: '📝', quiz: '❓', flashcards: '🃏', timer: '⏱️' };
    const typeBg = { summarize: 'var(--accent-soft)', quiz: 'var(--success-soft)', flashcards: 'var(--warning-soft)', timer: 'var(--danger-soft)' };

    function render() {
        const data = Storage.getUserData(Auth.currentUser());
        const items = data.history || [];
        if (items.length === 0) {
            return `<div class="page-enter">
        <div class="page-header"><h1>${I18n.t('historyTitle')}</h1><p>${I18n.t('historySubtitle')}</p></div>
        <div class="history-empty">${I18n.t('noHistory')}</div></div>`;
        }
        const rows = items.map(item => {
            const icon = typeIcons[item.type] || '📌';
            const bg = typeBg[item.type] || 'var(--accent-soft)';
            const dateStr = formatDate(item.date);
            return `<div class="history-item">
        <div class="history-icon" style="background:${bg}">${icon}</div>
        <div class="history-details"><h4>${item.detail}</h4><p>${dateStr}</p></div>
        <div class="history-xp">${I18n.t('earnedXP', { n: item.xp })}</div>
      </div>`;
        }).join('');
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('historyTitle')}</h1><p>${I18n.t('historySubtitle')}</p></div>
      <div class="history-list">${rows}</div></div>`;
    }

    function formatDate(iso) {
        const d = new Date(iso);
        const now = new Date();
        const diff = Math.floor((now - d) / 86400000);
        if (diff === 0) return I18n.t('today');
        if (diff === 1) return I18n.t('yesterday');
        return I18n.t('daysAgo', { n: diff });
    }

    return { render };
})();
