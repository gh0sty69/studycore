/* Leaderboard Page */
const LeaderboardPage = (() => {
    let activeTab = 'alltime';

    function render() {
        const currentUser = Auth.currentUser();
        const data = Storage.getUserData(currentUser);
        Storage.updateLeaderboard(currentUser, data.streak);
        const updated = Storage.getLeaderboard();

        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('leaderboardTitle')}</h1><p>${I18n.t('leaderboardSubtitle')}</p></div>
      <div class="lb-banner">${I18n.t('lbMotivation')}</div>
      <div class="leaderboard-tabs">
        <button class="leaderboard-tab ${activeTab === 'alltime' ? 'active' : ''}" data-tab="alltime">${I18n.t('allTime')}</button>
        <button class="leaderboard-tab ${activeTab === 'weekly' ? 'active' : ''}" data-tab="weekly">${I18n.t('weekly')}</button>
      </div>
      <div class="leaderboard-list" id="lb-list">${renderList(updated, currentUser)}</div>
    </div>`;
    }

    function renderList(lb, currentUser) {
        const sorted = [...lb].sort((a, b) => activeTab === 'weekly' ? b.weeklyStreak - a.weeklyStreak : b.streak - a.streak);
        if (sorted.length === 0) {
            return '<div class="history-empty" style="padding:2rem;text-align:center;color:var(--text-muted)">No users yet. Sign up and start studying!</div>';
        }
        return sorted.map((entry, i) => {
            const rank = i + 1;
            const topClass = rank <= 3 ? ` top-${rank}` : '';
            const currentClass = entry.username === currentUser ? ' current-user' : '';
            const streakVal = activeTab === 'weekly' ? entry.weeklyStreak : entry.streak;
            const isOwner = Storage.isOwner(entry.username);
            const ownerBadge = isOwner ? ` <span class="owner-badge">👑 ${I18n.t('owner')}</span>` : '';
            const nameClass = isOwner ? 'lb-name owner-name' : 'lb-name';
            const youTag = entry.username === currentUser ? ' (you)' : '';
            const avatar = isOwner ? '👻' : (entry.avatar || '👤');
            return `<div class="leaderboard-row${topClass}${currentClass}">
        <div class="lb-rank">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</div>
        <div class="lb-avatar">${avatar}</div>
        <div class="${nameClass}">${entry.username}${youTag}${ownerBadge}</div>
        <div class="lb-streak">🔥 ${streakVal} ${I18n.t('days')}</div>
      </div>`;
        }).join('');
    }

    function init() {
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeTab = tab.dataset.tab;
                document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
                const list = document.getElementById('lb-list');
                if (list) list.innerHTML = renderList(Storage.getLeaderboard(), Auth.currentUser());
            });
        });
    }

    return { render, init };
})();
