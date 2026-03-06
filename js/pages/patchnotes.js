/* Patch Notes Page */
const PatchNotesPage = (() => {
  function render() {
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('patchNotesTitle')}</h1><p>${I18n.t('patchNotesSubtitle')}</p></div>
      <div class="patch-timeline">
        <div class="card patch-entry">
          <div class="patch-version">v2.5.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> AI Automation, Firebase Cloud & Ghosty Effects</div>
          <ul class="patch-list">
            <li>🤖 Automated AI — 100% free automated Gemini Pro AI without needing manual API keys</li>
            <li>☁️ Firebase Cloud Sync — completely seamless login across home and school computers</li>
            <li>🚀 Aggressive Cache Busting — ensures that the app instantly updates for all users</li>
            <li>👻 Special Owner Effects — brand new insane CSS glowing/pulsing animations strictly for the creator's name ("ghosty")</li>
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
            <li>💜 Credits page for ghosty</li>
            <li>🏆 Real-only leaderboard (no fake users)</li>
            <li>👑 Owner badge with animated rainbow gradient name</li>
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
