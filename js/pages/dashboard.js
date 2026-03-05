/* Dashboard Page */
const DashboardPage = (() => {
  const quotes = [
    '"The secret of getting ahead is getting started." — Mark Twain',
    '"Education is the most powerful weapon." — Nelson Mandela',
    '"The beautiful thing about learning is that no one can take it away from you." — B.B. King',
    '"Study hard what interests you in the most undisciplined, irreverent and original manner possible." — Richard Feynman',
    '"The more that you read, the more things you will know." — Dr. Seuss',
    '"An investment in knowledge pays the best interest." — Benjamin Franklin',
    '"Live as if you were to die tomorrow. Learn as if you were to live forever." — Mahatma Gandhi',
  ];
  function render() {
    const data = Storage.getUserData(Auth.currentUser());
    const level = Gamification.getLevelForXP(data.xp);
    const currentLvlXP = Gamification.getXPForCurrentLevel(level);
    const nextLvlXP = Gamification.getXPForNextLevel(level);
    const xpInLevel = data.xp - currentLvlXP;
    const xpNeeded = nextLvlXP - currentLvlXP;
    const xpPct = xpNeeded > 0 ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const streakText = data.streak > 0 ? I18n.t('streakTitle', { n: data.streak }) : I18n.t('streakMsgZero');
    const streakSub = data.streak > 0 ? I18n.t('streakMsg') : '';
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('dashTitle')}</h1><p>${I18n.t('dashSubtitle')}</p></div>
      <div class="streak-display">
        <span class="streak-flame">🔥</span>
        <div class="streak-info"><h2>${streakText}</h2><p>${streakSub}</p></div>
      </div>
      <div class="xp-bar-container">
        <div class="xp-header">
          <span class="xp-level">${I18n.t('level')} <span class="level-num">${level}</span></span>
          <span class="xp-text">${I18n.t('xpProgress', { current: data.xp, next: nextLvlXP })}</span>
        </div>
        <div class="xp-bar-track"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
      </div>
      <div class="quote-card">${quote}</div>
      <div class="dashboard-grid">
        <div class="card stat-card"><div class="stat-icon purple">📊</div><div class="stat-info"><h3>${data.quizzesCompleted}</h3><p>${I18n.t('quizzesCompleted')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon green">🃏</div><div class="stat-info"><h3>${data.flashcardsReviewed}</h3><p>${I18n.t('flashcardsReviewed')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon yellow">⏱️</div><div class="stat-info"><h3>${data.studyMinutes}</h3><p>${I18n.t('totalStudyTime')}</p></div></div>
        <div class="card stat-card"><div class="stat-icon red">🎖️</div><div class="stat-info"><h3>${data.achievements.length}</h3><p>${I18n.t('achievementsUnlocked')}</p></div></div>
      </div>
      <h2 class="mt-3 mb-2">${I18n.t('quickAccess')}</h2>
      <div class="dashboard-grid">
        <div class="card quick-card" onclick="location.hash='summarizer'"><span class="card-icon">📝</span><h3>${I18n.t('summarizeNotes')}</h3><p>${I18n.t('summarizeDesc')}</p></div>
        <div class="card quick-card" onclick="location.hash='quiz'"><span class="card-icon">❓</span><h3>${I18n.t('generateQuiz')}</h3><p>${I18n.t('quizDesc')}</p></div>
        <div class="card quick-card" onclick="location.hash='flashcards'"><span class="card-icon">🃏</span><h3>${I18n.t('flashcards')}</h3><p>${I18n.t('flashcardsDesc')}</p></div>
        <div class="card quick-card" onclick="location.hash='timer'"><span class="card-icon">⏱️</span><h3>${I18n.t('studyTimer')}</h3><p>${I18n.t('timerDesc')}</p></div>
        <div class="card quick-card" onclick="location.hash='progress'"><span class="card-icon">📊</span><h3>${I18n.t('progressTracker')}</h3><p>${I18n.t('progressDesc')}</p></div>
        <div class="card quick-card" onclick="location.hash='games'"><span class="card-icon">🎮</span><h3>${I18n.t('studyGames')}</h3><p>${I18n.t('gamesDesc')}</p></div>
      </div>
    </div>`;
  }
  return { render };
})();
