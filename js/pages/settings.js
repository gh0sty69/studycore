/* Settings Page — Comprehensive */
const SettingsPage = (() => {
  function render() {
    const lang = I18n.getLang();
    const username = Auth.currentUser();
    const data = Storage.getUserData(username);
    const isOwner = Storage.isOwner(username);
    const settings = getUserSettings();

    return `<div class="page-enter">
      <div class="page-header"><h1>${t('settingsTitle')}</h1><p>${t('settingsSubtitle')}</p></div>

      <!-- Profile -->
      <div class="card settings-section">
        <h3>👤 ${t('profile')}</h3>
        <div class="settings-row"><label>${t('username')}</label><span style="font-weight:600">${username} ${isOwner ? '<span class="owner-badge">👑 OWNER</span>' : ''}</span></div>
        <div class="settings-row"><label>${t('level')}</label><span style="font-weight:600">${t('level')} ${data.level || 1} — ${data.xp || 0} XP</span></div>
        <div class="settings-row"><label>${t('currentStreak')}</label><span style="font-weight:600">🔥 ${data.streak || 0} ${t('days')}</span></div>
        <div class="settings-row"><label>${t('achievementsUnlocked')}</label><span style="font-weight:600">🎖️ ${(data.achievements || []).length} / ${Gamification.ACHIEVEMENTS.length}</span></div>
        <div class="settings-row"><label>${t('gamesPlayed')}</label><span style="font-weight:600">🎮 ${data.gamesPlayed || 0}</span></div>
      </div>

      <!-- Language -->
      <div class="card settings-section">
        <h3>🌐 ${t('language')}</h3>
        <div class="settings-row">
          <label>${t('language')}</label>
          <select id="settings-lang" class="settings-select">
            <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
            <option value="sv" ${lang === 'sv' ? 'selected' : ''}>Svenska</option>
          </select>
        </div>
      </div>

      <!-- Appearance -->
      <div class="card settings-section">
        <h3>🎨 ${t('sAppearance')}</h3>
        <div class="settings-row">
          <label>${t('sTheme')}</label>
          <select id="settings-theme" class="settings-select">
            <option value="default" ${settings.theme === 'default' ? 'selected' : ''}>${t('sThemeDefault')}</option>
            <option value="midnight" ${settings.theme === 'midnight' ? 'selected' : ''}>${t('sThemeMidnight')}</option>
            <option value="amoled" ${settings.theme === 'amoled' ? 'selected' : ''}>${t('sThemeAmoled')}</option>
          </select>
        </div>
        <div class="settings-row">
          <label>${t('sFontSize')}</label>
          <select id="settings-fontsize" class="settings-select">
            <option value="small" ${settings.fontSize === 'small' ? 'selected' : ''}>${t('sFontSmall')}</option>
            <option value="medium" ${settings.fontSize === 'medium' ? 'selected' : ''}>${t('sFontMedium')}</option>
            <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>${t('sFontLarge')}</option>
          </select>
        </div>
        <div class="settings-row">
          <label>${t('sAnimations')}</label>
          <label class="toggle"><input type="checkbox" id="settings-animations" ${settings.animations ? 'checked' : ''}><span class="toggle-slider"></span></label>
        </div>
      </div>



      <!-- Firebase Backend -->
      <div class="card settings-section">
        <h3>🔥 ${t('sFirebase')}</h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">${t('sFirebaseDesc')}</p>
        <div class="settings-row" style="flex-direction:column;align-items:stretch;gap:0.5rem">
          <label>${t('sFirebaseConfig')}</label>
          <textarea id="settings-firebase-config" rows="4" style="font-family:monospace;font-size:0.75rem" placeholder='{"apiKey":"...","authDomain":"...","databaseURL":"...","projectId":"..."}'>${(() => { const c = FirebaseModule.getConfig(); return c ? JSON.stringify(c, null, 2) : ''; })()}</textarea>
        </div>
        <button class="btn btn-primary btn-sm mt-1" id="save-firebase-btn">${t('sSaveFirebase')}</button>
        <p id="firebase-result" class="mt-1" style="font-size:0.8rem;min-height:1rem">${FirebaseModule.isAvailable() ? '<span style="color:var(--success)">🟢 ' + t('sFirebaseActive') + '</span>' : ''}</p>
      </div>

      <!-- Timer Settings -->
      <div class="card settings-section">
        <h3>⏱️ ${t('sTimerSettings')}</h3>
        <div class="settings-row">
          <label>${t('sFocusDuration')}</label>
          <select id="settings-focus" class="settings-select">
            <option value="15" ${settings.focusMin == 15 ? 'selected' : ''}>15 min</option>
            <option value="25" ${settings.focusMin == 25 ? 'selected' : ''}>25 min</option>
            <option value="30" ${settings.focusMin == 30 ? 'selected' : ''}>30 min</option>
            <option value="45" ${settings.focusMin == 45 ? 'selected' : ''}>45 min</option>
            <option value="60" ${settings.focusMin == 60 ? 'selected' : ''}>60 min</option>
          </select>
        </div>
        <div class="settings-row">
          <label>${t('sBreakDuration')}</label>
          <select id="settings-break" class="settings-select">
            <option value="3" ${settings.breakMin == 3 ? 'selected' : ''}>3 min</option>
            <option value="5" ${settings.breakMin == 5 ? 'selected' : ''}>5 min</option>
            <option value="10" ${settings.breakMin == 10 ? 'selected' : ''}>10 min</option>
            <option value="15" ${settings.breakMin == 15 ? 'selected' : ''}>15 min</option>
          </select>
        </div>
        <div class="settings-row">
          <label>${t('sTimerSound')}</label>
          <label class="toggle"><input type="checkbox" id="settings-timer-sound" ${settings.timerSound ? 'checked' : ''}><span class="toggle-slider"></span></label>
        </div>
      </div>

      <!-- Notifications -->
      <div class="card settings-section">
        <h3>🔔 ${t('sNotifications')}</h3>
        <div class="settings-row">
          <label>${t('sXPPopups')}</label>
          <label class="toggle"><input type="checkbox" id="settings-xp-popups" ${settings.xpPopups ? 'checked' : ''}><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <label>${t('sAchievementPopups')}</label>
          <label class="toggle"><input type="checkbox" id="settings-achieve-popups" ${settings.achievePopups ? 'checked' : ''}><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-row">
          <label>${t('sStreakReminder')}</label>
          <label class="toggle"><input type="checkbox" id="settings-streak-reminder" ${settings.streakReminder ? 'checked' : ''}><span class="toggle-slider"></span></label>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card settings-section">
        <h3>💾 ${t('dataManagement')}</h3>
        <div class="settings-row">
          <label>${t('sExportData')}</label>
          <button class="btn btn-secondary btn-sm" id="export-btn">${t('sExport')}</button>
        </div>
        <div class="settings-row">
          <label>${t('sImportData')}</label>
          <button class="btn btn-secondary btn-sm" id="import-btn">${t('sImport')}</button>
          <input type="file" id="import-file" accept=".json" style="display:none">
        </div>
        <div class="settings-row">
          <label>${t('sResetStreak')}</label>
          <button class="btn btn-danger btn-sm" id="reset-streak-btn">${t('sReset')}</button>
        </div>
        <div class="settings-row" style="margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.75rem;">
          <label>Force Cloud Sync <small style="display:block;color:var(--text-muted);font-weight:normal;">Overrides cloud data with local data</small></label>
          <button class="btn btn-primary btn-sm" id="force-sync-btn">Force Sync</button>
        </div>
        <div class="settings-row" style="margin-top:0.5rem; border-top:1px solid var(--border); padding-top:0.75rem;">
          <label>Blocked by School Wi-Fi? <small style="display:block;color:var(--text-muted);font-weight:normal;">Learn how to bypass firewalls</small></label>
          <button class="btn btn-secondary btn-sm" id="offline-guide-btn">Offline Sync Guide</button>
        </div>
      </div>

      <!-- Password Change -->
      <div class="card settings-section">
        <h3>🔑 ${t('sChangePassword')}</h3>
        <div class="form-group"><label>${t('sCurrentPw')}</label><input type="password" id="pw-current" placeholder="••••"></div>
        <div class="form-group"><label>${t('sNewPw')}</label><input type="password" id="pw-new" placeholder="••••"></div>
        <div class="form-group"><label>${t('sConfirmPw')}</label><input type="password" id="pw-confirm" placeholder="••••"></div>
        <button class="btn btn-primary btn-sm" id="change-pw-btn">${t('sChangePwBtn')}</button>
        <p id="pw-result" class="mt-1" style="font-size:0.85rem;min-height:1.2rem"></p>
      </div>

      <!-- Danger Zone -->
      <div class="card settings-section" style="border-color:var(--danger)">
        <h3>⚠️ ${t('dangerZone')}</h3>
        <div class="settings-row">
          <label>${t('clearAllData')}</label>
          <button class="btn btn-danger btn-sm" id="clear-data-btn">${t('clearAllData')}</button>
        </div>
        <div class="settings-row">
          <label>${t('sDeleteAccount')}</label>
          <button class="btn btn-danger btn-sm" id="delete-account-btn">${t('sDelete')}</button>
        </div>
      </div>

      <!-- App Info -->
      <div class="card settings-section" style="text-align:center;color:var(--text-muted)">
        <p style="font-size:0.85rem">StudyCore v2.3 — ${t('sMadeWith')} ghosty</p>
        <p style="font-size:0.75rem;margin-top:0.25rem">© 2026 StudyCore. All rights reserved.</p>
      </div>
    </div>`;
  }

  function t(key) { return I18n.t(key); }

  function getUserSettings() {
    const raw = localStorage.getItem('sc_settings_' + Auth.currentUser());
    const defaults = {
      theme: 'default', fontSize: 'medium', animations: true,
      focusMin: 25, breakMin: 5, timerSound: true,
      xpPopups: true, achievePopups: true, streakReminder: true
    };
    if (!raw) return defaults;
    try { return { ...defaults, ...JSON.parse(raw) }; } catch { return defaults; }
  }

  function saveSettings(settings) {
    localStorage.setItem('sc_settings_' + Auth.currentUser(), JSON.stringify(settings));
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'midnight') {
      root.style.setProperty('--bg-primary', '#05060a');
      root.style.setProperty('--bg-secondary', '#0c0e16');
      root.style.setProperty('--bg-card', '#10131e');
      root.style.setProperty('--bg-card-hover', '#181c2e');
    } else if (theme === 'amoled') {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#050505');
      root.style.setProperty('--bg-card', '#0a0a0a');
      root.style.setProperty('--bg-card-hover', '#141414');
    } else {
      root.style.setProperty('--bg-primary', '#0f1117');
      root.style.setProperty('--bg-secondary', '#1a1d27');
      root.style.setProperty('--bg-card', '#1e2130');
      root.style.setProperty('--bg-card-hover', '#252840');
    }
  }

  function applyFontSize(size) {
    const root = document.documentElement;
    if (size === 'small') root.style.fontSize = '14px';
    else if (size === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';
  }

  function init() {
    const settings = getUserSettings();
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);

    // Language
    document.getElementById('settings-lang')?.addEventListener('change', (e) => {
      I18n.setLang(e.target.value);
      const username = Auth.currentUser();
      if (username) {
        const data = Storage.getUserData(username);
        data.langSwitches = (data.langSwitches || 0) + 1;
        Storage.saveUserData(username, data);
      }
      Router.navigate('settings');
    });

    // Theme
    document.getElementById('settings-theme')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.theme = e.target.value; saveSettings(s); applyTheme(s.theme);
    });

    // Font size
    document.getElementById('settings-fontsize')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.fontSize = e.target.value; saveSettings(s); applyFontSize(s.fontSize);
    });

    // Animations toggle
    document.getElementById('settings-animations')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.animations = e.target.checked; saveSettings(s);
      document.body.style.setProperty('--transition-base', s.animations ? '0.25s ease' : '0s');
      document.body.style.setProperty('--transition-fast', s.animations ? '0.15s ease' : '0s');
    });

    // Firebase Backend Config
    document.getElementById('save-firebase-btn')?.addEventListener('click', () => {
      const input = document.getElementById('settings-firebase-config');
      const resultEl = document.getElementById('firebase-result');
      const val = input?.value.trim();

      if (!val) {
        FirebaseModule.saveConfig(null);
        FirebaseModule.reset();
        resultEl.innerHTML = '';
        return;
      }

      try {
        const config = JSON.parse(val);
        if (!config.apiKey || !config.databaseURL) throw new Error('Missing apiKey or databaseURL');

        FirebaseModule.saveConfig(config);
        FirebaseModule.reset();
        const db = FirebaseModule.init();

        if (db) {
          resultEl.innerHTML = '<span style="color:var(--success)">🟢 ' + t('sFirebaseActive') + '</span>';
        } else {
          resultEl.innerHTML = '<span style="color:var(--danger)">❌ ' + t('sFirebaseError') + '</span>';
        }
      } catch (err) {
        resultEl.innerHTML = '<span style="color:var(--danger)">❌ ' + t('sFirebaseInvalid') + '</span>';
      }
    });

    // Timer settings
    document.getElementById('settings-focus')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.focusMin = parseInt(e.target.value); saveSettings(s);
    });
    document.getElementById('settings-break')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.breakMin = parseInt(e.target.value); saveSettings(s);
    });
    document.getElementById('settings-timer-sound')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.timerSound = e.target.checked; saveSettings(s);
    });

    // Notification toggles
    document.getElementById('settings-xp-popups')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.xpPopups = e.target.checked; saveSettings(s);
    });
    document.getElementById('settings-achieve-popups')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.achievePopups = e.target.checked; saveSettings(s);
    });
    document.getElementById('settings-streak-reminder')?.addEventListener('change', (e) => {
      const s = getUserSettings(); s.streakReminder = e.target.checked; saveSettings(s);
    });

    // Export
    document.getElementById('export-btn')?.addEventListener('click', () => {
      const data = Storage.getUserData(Auth.currentUser());
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `studycore_${Auth.currentUser()}_backup.json`;
      a.click(); URL.revokeObjectURL(url);
    });

    // Import
    document.getElementById('import-btn')?.addEventListener('click', () => {
      document.getElementById('import-file')?.click();
    });
    document.getElementById('import-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          Storage.saveUserData(Auth.currentUser(), imported);
          Router.navigate('settings');
        } catch { alert('Invalid file format'); }
      };
      reader.readAsText(file);
    });

    // Reset streak
    document.getElementById('reset-streak-btn')?.addEventListener('click', () => {
      if (!confirm(I18n.t('sResetConfirm'))) return;
      const data = Storage.getUserData(Auth.currentUser());
      data.streak = 0; data.lastStudyDate = null;
      Storage.saveUserData(Auth.currentUser(), data);
      Router.navigate('settings');
    });

    // Clear all data
    document.getElementById('clear-data-btn')?.addEventListener('click', () => {
      if (!confirm(I18n.t('clearDataConfirm'))) return;
      Storage.saveUserData(Auth.currentUser(), Storage.getDefaultData());
      Router.navigate('settings');
    });

    // Delete account
    document.getElementById('delete-account-btn')?.addEventListener('click', () => {
      if (!confirm(I18n.t('sDeleteConfirm'))) return;
      const users = Storage.getUsers();
      delete users[Auth.currentUser()];
      Storage.saveUsers(users);
      Auth.logout();
      location.reload();
    });

    // Force Cloud Sync
    document.getElementById('force-sync-btn')?.addEventListener('click', async () => {
      const btn = document.getElementById('force-sync-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Syncing...';
      btn.disabled = true;

      const username = Auth.currentUser();
      const users = Storage.getUsers();
      const localUser = users[username];

      if (window.FirebaseModule && FirebaseModule.isAvailable() && localUser) {
        try {
          const db = FirebaseModule.getDB();
          await db.ref('users/' + username).set(localUser);
          btn.textContent = 'Success!';
          btn.style.backgroundColor = 'var(--success)';
          btn.style.color = '#fff';
        } catch (err) {
          btn.textContent = 'Failed';
          btn.style.backgroundColor = 'var(--danger)';
          console.error(err);
        }
      } else {
        btn.textContent = 'Firebase Not Connected';
        btn.style.backgroundColor = 'var(--danger)';
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 3000);
    });

    // Offline Guide Modal
    document.getElementById('offline-guide-btn')?.addEventListener('click', () => {
      document.getElementById('offline-guide-modal').classList.remove('hidden');
    });
    document.getElementById('close-offline-guide')?.addEventListener('click', () => {
      document.getElementById('offline-guide-modal').classList.add('hidden');
    });
    document.getElementById('understood-offline-guide')?.addEventListener('click', () => {
      document.getElementById('offline-guide-modal').classList.add('hidden');
    });

    // Password change
    document.getElementById('change-pw-btn')?.addEventListener('click', () => {
      const current = document.getElementById('pw-current')?.value;
      const newPw = document.getElementById('pw-new')?.value;
      const confirm = document.getElementById('pw-confirm')?.value;
      const resultEl = document.getElementById('pw-result');
      const username = Auth.currentUser();
      const users = Storage.getUsers();

      if (!current || !newPw || !confirm) {
        resultEl.textContent = I18n.t('sAllFieldsRequired'); resultEl.style.color = 'var(--danger)'; return;
      }
      if (users[username]?.password !== btoa(current)) {
        resultEl.textContent = I18n.t('sWrongPassword'); resultEl.style.color = 'var(--danger)'; return;
      }
      if (newPw.length < 4) {
        resultEl.textContent = I18n.t('signupErrorShort'); resultEl.style.color = 'var(--danger)'; return;
      }
      if (newPw !== confirm) {
        resultEl.textContent = I18n.t('signupErrorMatch'); resultEl.style.color = 'var(--danger)'; return;
      }
      users[username].password = btoa(newPw);
      Storage.saveUsers(users);
      resultEl.textContent = I18n.t('sPwChanged'); resultEl.style.color = 'var(--success)';
      document.getElementById('pw-current').value = '';
      document.getElementById('pw-new').value = '';
      document.getElementById('pw-confirm').value = '';
    });
  }

  // Apply saved settings on load
  function applyOnLoad() {
    const user = Auth.currentUser();
    if (!user) return;
    const settings = getUserSettings();
    applyTheme(settings.theme);
    applyFontSize(settings.fontSize);
    if (!settings.animations) {
      document.body.style.setProperty('--transition-base', '0s');
      document.body.style.setProperty('--transition-fast', '0s');
    }
  }

  return { render, init, applyOnLoad, getUserSettings };
})();
