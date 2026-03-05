/* Settings Page */
const SettingsPage = (() => {
    function render() {
        const lang = I18n.getLang();
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('settingsTitle')}</h1><p>${I18n.t('settingsSubtitle')}</p></div>
      <div class="card settings-section">
        <h3>${I18n.t('profile')}</h3>
        <div class="settings-row">
          <label>${I18n.t('username')}</label>
          <span style="font-weight:600">${Auth.currentUser()}</span>
        </div>
      </div>
      <div class="card settings-section">
        <h3>${I18n.t('language')}</h3>
        <div class="settings-row">
          <label>${I18n.t('language')}</label>
          <select id="settings-lang" style="width:auto;padding:0.4rem 0.8rem;background:var(--bg-input);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);font-family:var(--font)">
            <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
            <option value="sv" ${lang === 'sv' ? 'selected' : ''}>Svenska</option>
          </select>
        </div>
      </div>
      <div class="card settings-section">
        <h3>${I18n.t('dangerZone')}</h3>
        <div class="settings-row">
          <label>${I18n.t('dataManagement')}</label>
          <button class="btn btn-danger btn-sm" id="clear-data-btn">${I18n.t('clearAllData')}</button>
        </div>
      </div>
    </div>`;
    }

    function init() {
        document.getElementById('settings-lang')?.addEventListener('change', (e) => {
            I18n.setLang(e.target.value);
            // Re-render page to apply translations
            if (typeof Router !== 'undefined') Router.navigate('settings');
        });
        document.getElementById('clear-data-btn')?.addEventListener('click', () => {
            if (confirm(I18n.t('clearDataConfirm'))) {
                const username = Auth.currentUser();
                Storage.saveUserData(username, Storage.getDefaultData());
                if (typeof Router !== 'undefined') Router.navigate('settings');
            }
        });
    }

    return { render, init };
})();
