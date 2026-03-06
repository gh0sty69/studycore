/* Patch Notes Page */
const PatchNotesPage = (() => {
  function render() {
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('patchNotesTitle')}</h1><p>${I18n.t('patchNotesSubtitle')}</p></div>
      <div class="patch-timeline">
        
        <div class="card patch-entry">
          <div class="patch-version">v2.7.3 <span class="patch-date">— March 6, 2026</span></div>
          <div class="patch-category" style="color:var(--success); font-weight:600; margin-top:0.5rem;">✨ New Features</div>
          <ul class="patch-list">
            <li>🐛 <b>Discord Bug Reporter:</b> Added a "Report Bug" button to the sidebar that securely beams bug reports straight to the developer's Discord server.</li>
            <li>💬 <b>Chat UI Overhaul:</b> The global chat feature now has fully modern, beautiful, iMessage/Discord style chat bubble CSS.</li>
          </ul>
          <div class="patch-category" style="color:var(--danger); font-weight:600; margin-top:0.5rem;">🛠️ Bug Fixes</div>
          <ul class="patch-list">
            <li>Fixed an issue where the new Chat system wasn't loading its CSS files, leaving it looking like 1995.</li>
          </ul>
          <div class="patch-category" style="color:var(--text-muted); font-weight:600; margin-top:0.5rem;">📌 Minor Changes</div>
          <ul class="patch-list">
            <li>Patch Notes are now clearly categorized for easier reading.</li>
            <li>Secret upgrades to the AI model behind the scenes...</li>
          </ul>
        </div>

        <div class="card patch-entry">
          <div class="patch-version">v2.7.2 <span class="patch-date">— March 6, 2026</span></div>
          <div class="patch-category" style="color:var(--success); font-weight:600; margin-top:0.5rem;">✨ New Features</div>
          <ul class="patch-list">
            <li>📖 <b>Offline Sync Guide:</b> Built-in help modal in Settings to assist users stuck behind strict school/corporate Wi-Fi firewalls blocking cloud connectivity.</li>
          </ul>
        </div>
        
        <div class="card patch-entry">
          <div class="patch-version">v2.7.0 <span class="patch-date">— March 6, 2026</span></div>
          <div class="patch-category" style="color:var(--success); font-weight:600; margin-top:0.5rem;">✨ New Features</div>
          <ul class="patch-list">
            <li>☢️ <b>Nuclear Cloud Override:</b> Complete rewrite of login architecture to prioritize Cloud credentials. Logging into a valid cloud account now instantly purges local broken data.</li>
          </ul>
          <div class="patch-category" style="color:var(--danger); font-weight:600; margin-top:0.5rem;">🛠️ Bug Fixes</div>
          <ul class="patch-list">
            <li>Permanently solved the cross-device sync lockouts.</li>
            <li>Added detailed Diagnostic orange text to login failures to detect network drops exactly.</li>
          </ul>
        </div>

        <div class="card patch-entry">
          <div class="patch-version">v2.6.0 <span class="patch-date">— March 6, 2026</span></div>
          <div class="patch-category" style="color:var(--success); font-weight:600; margin-top:0.5rem;">✨ New Features</div>
          <ul class="patch-list">
            <li>⚙️ <b>Force Cloud Sync:</b> New button in Settings to manually overwrite the Firebase cloud with local data.</li>
          </ul>
          <div class="patch-category" style="color:var(--text-muted); font-weight:600; margin-top:0.5rem;">📌 Minor Changes</div>
          <ul class="patch-list">
            <li>Bypasses all password collisions.</li>
          </ul>
        </div>

        <div class="card patch-entry">
          <div class="patch-version">v2.5.0 <span class="patch-date">— March 6, 2026</span></div>
          <div class="patch-category" style="color:var(--success); font-weight:600; margin-top:0.5rem;">✨ New Features</div>
          <ul class="patch-list">
            <li>🤖 Automated AI — 100% free automated Gemini Pro AI without needing manual API keys</li>
            <li>☁️ Firebase Cloud Sync — completely seamless login across home and school computers</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v2.3.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> Search, Focus Mode & More</div>
          <ul class="patch-list">
            <li>🔍 Ctrl+K Search — instantly search notes, history, flashcards, and pages</li>
            <li>🎯 Focus Mode — distraction-free timer that hides sidebar and navigation</li>
            <li>📌 Saved Notes — save and organize summaries into folders</li>
            <li>👋 Onboarding Tour — 9-step walkthrough for first-time users</li>
            <li>🔑 Password Change — update your password from settings</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v2.2.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> More Games & Update Notifications</div>
          <ul class="patch-list">
            <li>🚀 Update notification banner — shows when app updates while you're offline</li>
            <li>📖 Definition Dash — match terms to their definitions</li>
            <li>✏️ Fill in the Blank — complete study sentences</li>
            <li>💀 Study Hangman — guess study terms letter by letter</li>
            <li>🎮 Now 7 study games total (all fully translated EN/SV)</li>
            <li>📋 Version tracking system for update detection</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v2.1.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag improve">IMPROVE</span> Settings & Polish</div>
          <ul class="patch-list">
            <li>⚙️ Expanded settings — themes, font size, animations, timer config, notifications</li>
            <li>💾 Data export/import as JSON backup</li>
            <li>🎨 Theme options: Default Dark, Midnight, AMOLED Black</li>
            <li>🔔 Toggle XP/achievement popups and streak reminders</li>
            <li>⚠️ Account deletion and streak reset</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v2.0.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> Study Games & Gamification</div>
          <ul class="patch-list">
            <li>🎮 Study Games — Word Scramble, Memory Match, Trivia Blitz, Speed Typing</li>
            <li>📋 Patch Notes page</li>
            <li>🏆 Real-only leaderboard (no fake users)</li>
            <li>🎖️ 16 total achievements</li>
            <li>📄 Google Docs & Slides import</li>
            <li>🖼️ Custom app logo</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v1.0.0 <span class="patch-date">— March 5, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> Initial Release</div>
          <ul class="patch-list">
            <li>📝 AI Note Summarizer</li>
            <li>❓ Quiz Generator</li>
            <li>🃏 Flashcards with 3D flip animation</li>
            <li>⏱️ Pomodoro Study Timer</li>
            <li>📊 Progress Tracker</li>
            <li>📜 Study History</li>
            <li>🏆 Leaderboard</li>
            <li>🎖️ 8 Achievements</li>
            <li>🔥 Daily streak system</li>
            <li>⭐ XP & Level system</li>
            <li>🌐 English & Swedish support</li>
            <li>🔐 User accounts with localStorage</li>
            <li>🌙 Dark mode default</li>
          </ul>
        </div>
      </div>
    </div>`;
  }
  return { render };
})();
