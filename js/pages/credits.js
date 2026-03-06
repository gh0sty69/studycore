/* Credits Page */
const CreditsPage = (() => {
  function render() {
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('creditsTitle')}</h1><p>${I18n.t('creditsSubtitle')}</p></div>
      <div class="card credits-card">
        <div class="credits-avatar">👻</div>
        <div class="credits-name">StudyCore</div>
        <div class="credits-role">${I18n.t('developedBy')} & Creator</div>
        <div class="owner-badge mt-2" style="display:inline-flex">👑 ${I18n.t('owner')}</div>
        <p class="mt-3 text-muted" style="max-width:500px;margin-left:auto;margin-right:auto">StudyCore was designed and developed with <span style="color:#e74c3c">❤</span> as a modern study platform to help students learn more effectively.</p>
        <div class="credits-links">
          <a href="https://github.com/gh0sty69" target="_blank" class="btn btn-secondary">🔗 GitHub</a>
          <a href="https://github.com/gh0sty69/studycore" target="_blank" class="btn btn-secondary">📂 Source Code</a>
        </div>
      </div>
      <div class="card mt-2" style="text-align:center;padding:1.5rem">
        <h3 style="margin-bottom:0.5rem">Built With</h3>
        <p class="text-muted" style="font-size:0.9rem">HTML5 · CSS3 · Vanilla JavaScript · Google Fonts (Inter)</p>

      </div>
    </div>`;
  }
  return { render };
})();
