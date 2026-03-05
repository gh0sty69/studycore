/* Patch Notes Page */
const PatchNotesPage = (() => {
    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('patchNotesTitle')}</h1><p>${I18n.t('patchNotesSubtitle')}</p></div>
      <div class="patch-timeline">
        <div class="card patch-entry">
          <div class="patch-version">v2.0.0 <span class="patch-date">— March 6, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> Study Games — Word Scramble & Memory Match</div>
          <ul class="patch-list">
            <li>🎮 Added Study Games page with interactive Word Scramble and Memory Match</li>
            <li>📋 Added Patch Notes page to track updates</li>
            <li>💜 Added Credits page</li>
            <li>🏆 Leaderboard now only shows real registered users</li>
            <li>👑 Owner badge for app creator gh0sty69</li>
            <li>🎖️ Added 8 new achievements (16 total)</li>
            <li>📄 Google Docs & Google Slides import support</li>
            <li>🖼️ New custom app logo</li>
            <li>🎮 Games earn +15 XP per completion</li>
            <li>🌍 Polyglot achievement for language switchers</li>
          </ul>
        </div>
        <div class="card patch-entry">
          <div class="patch-version">v1.0.0 <span class="patch-date">— March 5, 2026</span></div>
          <div><span class="patch-tag new">NEW</span> Initial Release</div>
          <ul class="patch-list">
            <li>📝 AI Note Summarizer — paste notes and get summaries with key points</li>
            <li>❓ Quiz Generator — generate multiple-choice quizzes from notes</li>
            <li>🃏 Flashcards — create and flip through flashcards with animations</li>
            <li>⏱️ Pomodoro Study Timer — 25/5 focus/break sessions</li>
            <li>📊 Progress Tracker — track study statistics</li>
            <li>📜 Study History — view all past activities</li>
            <li>🏆 Leaderboard — compete with other users</li>
            <li>🎖️ 8 Achievement badges</li>
            <li>🔥 Daily study streak system</li>
            <li>⭐ XP & Level system</li>
            <li>🌐 English & Swedish language support</li>
            <li>🔐 User account system with localStorage</li>
            <li>🌙 Dark mode default theme</li>
          </ul>
        </div>
      </div>
    </div>`;
    }
    return { render };
})();
