/* Gamification — XP, Levels, Streaks, Achievements */
const Gamification = (() => {
    const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500, 10000];
    const XP_REWARDS = { summarize: 10, quiz: 20, flashcards: 10, timer: 25, streak: 15, game: 15 };

    const ACHIEVEMENTS = [
        { id: 'first_steps', icon: '🌟', titleKey: 'badgeFirstSteps', descKey: 'badgeFirstStepsDesc', check: d => (d.notesSummarized + d.quizzesCompleted + d.flashcardsReviewed + d.timerSessions) >= 1 },
        { id: 'quiz_master', icon: '🧠', titleKey: 'badgeQuizMaster', descKey: 'badgeQuizMasterDesc', check: d => d.quizzesCompleted >= 10 },
        { id: 'flashcard_expert', icon: '🃏', titleKey: 'badgeFlashcardExpert', descKey: 'badgeFlashcardExpertDesc', check: d => d.flashcardsReviewed >= 100 },
        { id: 'consistency', icon: '👑', titleKey: 'badgeConsistency', descKey: 'badgeConsistencyDesc', check: d => d.streak >= 7 },
        { id: 'warrior', icon: '⚔️', titleKey: 'badgeWarrior', descKey: 'badgeWarriorDesc', check: d => d.studyMinutes >= 600 },
        { id: 'legend', icon: '🔥', titleKey: 'badgeLegend', descKey: 'badgeLegendDesc', check: d => d.streak >= 30 },
        { id: 'scholar', icon: '📖', titleKey: 'badgeScholar', descKey: 'badgeScholarDesc', check: d => d.notesSummarized >= 20 },
        { id: 'time_lord', icon: '⏰', titleKey: 'badgeTimeLord', descKey: 'badgeTimeLordDesc', check: d => d.timerSessions >= 50 },
        { id: 'night_owl', icon: '🦉', titleKey: 'badgeNightOwl', descKey: 'badgeNightOwlDesc', check: () => new Date().getHours() >= 0 && new Date().getHours() < 5 },
        { id: 'speed_demon', icon: '⚡', titleKey: 'badgeSpeedDemon', descKey: 'badgeSpeedDemonDesc', check: d => d.quizzesCompleted >= 5 },
        { id: 'socialite', icon: '🤝', titleKey: 'badgeSocialite', descKey: 'badgeSocialiteDesc', check: d => { const lb = Storage.getLeaderboard(); const idx = lb.findIndex(e => e.username === Auth.currentUser()); return idx >= 0 && idx < 3; } },
        { id: 'gamer', icon: '🎮', titleKey: 'badgeGamer', descKey: 'badgeGamerDesc', check: d => (d.gamesPlayed || 0) >= 10 },
        { id: 'marathon', icon: '🏃', titleKey: 'badgeMarathon', descKey: 'badgeMarathonDesc', check: d => d.studyMinutes >= 300 },
        { id: 'perfect_score', icon: '💯', titleKey: 'badgePerfectScore', descKey: 'badgePerfectScoreDesc', check: d => (d.perfectQuizzes || 0) >= 1 },
        { id: 'veteran', icon: '🎗️', titleKey: 'badgeVeteran', descKey: 'badgeVeteranDesc', check: d => d.streak >= 30 },
        { id: 'polyglot', icon: '🌍', titleKey: 'badgePolyglot', descKey: 'badgePolyglotDesc', check: d => (d.langSwitches || 0) >= 5 },
    ];

    function getLevelForXP(xp) {
        let lvl = 1;
        for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
            if (xp >= LEVEL_THRESHOLDS[i]) lvl = i + 1; else break;
        }
        return lvl;
    }
    function getXPForNextLevel(level) { return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]; }
    function getXPForCurrentLevel(level) { return LEVEL_THRESHOLDS[level - 1] || 0; }

    function awardXP(type) {
        const username = Auth.currentUser();
        if (!username) return;
        const data = Storage.getUserData(username);
        const amount = XP_REWARDS[type] || 0;
        data.xp += amount;
        data.level = getLevelForXP(data.xp);
        Storage.saveUserData(username, data);
        showXPPopup(amount);
        checkAchievements(data, username);
        return amount;
    }

    function updateStreak() {
        const username = Auth.currentUser();
        if (!username) return;
        const data = Storage.getUserData(username);
        const today = new Date().toDateString();
        if (data.lastStudyDate === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (data.lastStudyDate === yesterday || !data.lastStudyDate) {
            data.streak = (data.lastStudyDate === yesterday) ? data.streak + 1 : 1;
        } else if (data.lastStudyDate !== today) {
            data.streak = 1;
        }
        data.lastStudyDate = today;
        data.xp += XP_REWARDS.streak;
        data.level = getLevelForXP(data.xp);
        Storage.saveUserData(username, data);
        Storage.updateLeaderboard(username, data.streak);
        checkAchievements(data, username);
    }

    function recordActivity(type, detail) {
        const username = Auth.currentUser();
        if (!username) return;
        const data = Storage.getUserData(username);
        data.history.unshift({ type, detail, date: new Date().toISOString(), xp: XP_REWARDS[type] || 0 });
        if (data.history.length > 100) data.history = data.history.slice(0, 100);
        Storage.saveUserData(username, data);
        updateStreak();
    }

    function checkAchievements(data, username) {
        let newUnlock = null;
        ACHIEVEMENTS.forEach(a => {
            if (!data.achievements.includes(a.id) && a.check(data)) {
                data.achievements.push(a.id);
                newUnlock = a;
            }
        });
        if (newUnlock) {
            Storage.saveUserData(username, data);
            showAchievementPopup(newUnlock);
        }
    }

    function showXPPopup(amount) {
        const el = document.getElementById('xp-popup');
        const text = document.getElementById('xp-popup-text');
        if (!el || !text) return;
        text.textContent = `+${amount} XP 🎉`;
        el.classList.remove('hidden', 'show');
        void el.offsetWidth;
        el.classList.add('show');
        setTimeout(() => { el.classList.remove('show'); el.classList.add('hidden'); }, 1800);
    }

    function showAchievementPopup(achievement) {
        const el = document.getElementById('achievement-popup');
        const nameEl = document.getElementById('achievement-popup-name');
        if (!el || !nameEl) return;
        nameEl.textContent = `${achievement.icon} ${I18n.t(achievement.titleKey)}`;
        el.classList.remove('hidden');
        el.classList.add('show');
        setTimeout(() => { el.classList.remove('show'); el.classList.add('hidden'); }, 3000);
    }

    return { ACHIEVEMENTS, LEVEL_THRESHOLDS, XP_REWARDS, getLevelForXP, getXPForNextLevel, getXPForCurrentLevel, awardXP, updateStreak, recordActivity, checkAchievements };
})();
