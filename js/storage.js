/* Storage — Data Persistence Layer */
const Storage = (() => {
    const USERS_KEY = 'sc_users';
    const CURRENT_KEY = 'sc_current_user';
    const OWNER_USERNAME = 'ghosty';

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

    // Leaderboard: ONLY real registered users, no fake/demo data ever
    function initDemoLeaderboard() {
        // Always rebuild leaderboard from actual registered users
        rebuildLeaderboard();
    }

    function rebuildLeaderboard() {
        const users = getUsers();
        const lb = [];
        Object.keys(users).forEach(username => {
            const data = users[username].data || getDefaultData();
            lb.push({
                username,
                streak: data.streak || 0,
                weeklyStreak: Math.min(data.streak || 0, 7),
                avatar: isOwner(username) ? '👻' : '👤'
            });
        });
        lb.sort((a, b) => b.streak - a.streak);
        localStorage.setItem('sc_leaderboard', JSON.stringify(lb));
    }

    function getLeaderboard() {
        // Always rebuild from real users to ensure no fake data
        rebuildLeaderboard();
        return JSON.parse(localStorage.getItem('sc_leaderboard') || '[]');
    }

    function updateLeaderboard(username, streak) {
        rebuildLeaderboard();
    }

    return { getUsers, saveUsers, getCurrentUsername, setCurrentUser, clearCurrentUser, getUserData, saveUserData, getDefaultData, isOwner, OWNER_USERNAME, initDemoLeaderboard, getLeaderboard, updateLeaderboard, rebuildLeaderboard };
})();
