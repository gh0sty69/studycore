/* Achievements Page */
const AchievementsPage = (() => {
    function render() {
        const data = Storage.getUserData(Auth.currentUser());
        const badges = Gamification.ACHIEVEMENTS.map(a => {
            const isUnlocked = data.achievements.includes(a.id);
            return `<div class="card badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <span class="badge-icon">${a.icon}</span>
        <div class="badge-title">${I18n.t(a.titleKey)}</div>
        <div class="badge-desc">${I18n.t(a.descKey)}</div>
        <div class="badge-status ${isUnlocked ? 'unlocked' : 'locked'}">${isUnlocked ? I18n.t('unlocked') : I18n.t('locked')}</div>
      </div>`;
        }).join('');
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('achievementsTitle')}</h1><p>${I18n.t('achievementsSubtitle')}</p></div>
      <div class="badge-grid">${badges}</div></div>`;
    }
    return { render };
})();
