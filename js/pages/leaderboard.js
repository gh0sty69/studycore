/* Leaderboard Page */
const LeaderboardPage = (() => {
    let activeTab = 'alltime';

    function render() {
        const lb = Storage.getLeaderboard();
        const currentUser = Auth.currentUser();
        // Ensure current user is in leaderboard
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
        return sorted.map((entry, i) => {
            const rank = i + 1;
            const topClass = rank <= 3 ? ` top-${rank}` : '';
            const currentClass = entry.username === currentUser ? ' current-user' : '';
            const streakVal = activeTab === 'weekly' ? entry.weeklyStreak : entry.streak;
            return `<div class="leaderboard-row${topClass}${currentClass}">
        <div class="lb-rank">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</div>
        <div class="lb-avatar">${entry.avatar || '👤'}</div>
        <div class="lb-name">${entry.username}${entry.username === currentUser ? ' (you)' : ''}</div>
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
