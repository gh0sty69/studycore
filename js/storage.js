/* Storage — Data Persistence Layer */
const Storage = (() => {
    const USERS_KEY = 'sc_users';
    const CURRENT_KEY = 'sc_current_user';
    const OWNER_USERNAME = 'gh0sty69';

    function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    function getCurrentUsername() { return localStorage.getItem(CURRENT_KEY); }
    function setCurrentUser(username) { localStorage.setItem(CURRENT_KEY, username); }
    function clearCurrentUser() { localStorage.removeItem(CURRENT_KEY); }
    function getUserData(username) {
        const users = getUsers();
        return users[username]?.data || getDefaultData();
    }
    function saveUserData(username, data) {
        const users = getUsers();
        if (users[username]) { users[username].data = data; saveUsers(users); }
    }
    function getDefaultData() {
        return {
            xp: 0, level: 1,
            streak: 0, lastStudyDate: null,
            quizzesCompleted: 0, flashcardsReviewed: 0,
            notesSummarized: 0, studyMinutes: 0,
            timerSessions: 0, gamesPlayed: 0,
            langSwitches: 0, perfectQuizzes: 0,
            achievements: [],
            history: []
        };
    }
    function isOwner(username) { return username === OWNER_USERNAME; }

    // Leaderboard: only real registered users
    function initDemoLeaderboard() {
        // No demo users; leaderboard starts empty and populates from real signups
        if (!localStorage.getItem('sc_leaderboard')) {
            localStorage.setItem('sc_leaderboard', JSON.stringify([]));
        }
    }
    function getLeaderboard() { return JSON.parse(localStorage.getItem('sc_leaderboard') || '[]'); }
    function updateLeaderboard(username, streak) {
        const lb = getLeaderboard();
        const idx = lb.findIndex(e => e.username === username);
        if (idx >= 0) {
            lb[idx].streak = streak;
            lb[idx].weeklyStreak = Math.min(streak, 7);
        } else {
            lb.push({ username, streak, weeklyStreak: Math.min(streak, 7), avatar: '👤' });
        }
        lb.sort((a, b) => b.streak - a.streak);
        localStorage.setItem('sc_leaderboard', JSON.stringify(lb));
    }
    return { getUsers, saveUsers, getCurrentUsername, setCurrentUser, clearCurrentUser, getUserData, saveUserData, getDefaultData, isOwner, OWNER_USERNAME, initDemoLeaderboard, getLeaderboard, updateLeaderboard };
})();
