/* Progress Tracker Page */
const ProgressPage = (() => {
    function render() {
        const data = Storage.getUserData(Auth.currentUser());
        const maxQ = Math.max(data.quizzesCompleted, 10);
        const maxF = Math.max(data.flashcardsReviewed, 100);
        const maxM = Math.max(data.studyMinutes, 600);
        const maxN = Math.max(data.notesSummarized, 20);
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('progressTitle')}</h1><p>${I18n.t('progressSubtitle')}</p></div>
      <div class="stats-grid">
        <div class="card stat-card"><div class="stat-icon purple">📝</div><div class="stat-info"><h3>${data.notesSummarized}</h3><p>${I18n.t('notesSum')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon green">❓</div><div class="stat-info"><h3>${data.quizzesCompleted}</h3><p>${I18n.t('quizzesDone')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon yellow">🃏</div><div class="stat-info"><h3>${data.flashcardsReviewed}</h3><p>${I18n.t('flashcardsStudied')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon red">⏱️</div><div class="stat-info"><h3>${data.studyMinutes}</h3><p>${I18n.t('studyMinutes')}</p></div></div>
      </div>
      <div class="card">
        <h3 class="mb-2">${I18n.t('progressOverview')}</h3>
        <div class="progress-bar-container">
          <div class="progress-bar-label"><span>${I18n.t('notesSum')}</span><span>${data.notesSummarized} / ${maxN}</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill purple" style="width:${(data.notesSummarized / maxN) * 100}%"></div></div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-label"><span>${I18n.t('quizzesDone')}</span><span>${data.quizzesCompleted} / ${maxQ}</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill green" style="width:${(data.quizzesCompleted / maxQ) * 100}%"></div></div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-label"><span>${I18n.t('flashcardsStudied')}</span><span>${data.flashcardsReviewed} / ${maxF}</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill yellow" style="width:${(data.flashcardsReviewed / maxF) * 100}%"></div></div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-label"><span>${I18n.t('studyMinutes')}</span><span>${data.studyMinutes} / ${maxM}</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill red" style="width:${(data.studyMinutes / maxM) * 100}%"></div></div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-label"><span>${I18n.t('currentStreak')}</span><span>${data.streak} ${I18n.t('days')}</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill purple" style="width:${Math.min((data.streak / 30) * 100, 100)}%"></div></div>
        </div>
      </div>
    </div>`;
    }
    return { render };
})();
