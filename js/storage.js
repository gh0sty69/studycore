/* Storage — Data Persistence Layer */
const Storage = (() => {
    const USERS_KEY = 'sc_users';
    const CURRENT_KEY = 'sc_current_user';

    function getUsers() {
        return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    }
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    function getCurrentUsername() {
        return localStorage.getItem(CURRENT_KEY);
    }
    function setCurrentUser(username) {
        localStorage.setItem(CURRENT_KEY, username);
    }
    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_KEY);
    }
    function getUserData(username) {
        const users = getUsers();
        return users[username]?.data || getDefaultData();
    }
    function saveUserData(username, data) {
        const users = getUsers();
        if (users[username]) {
            users[username].data = data;
            saveUsers(users);
        }
    }
    function getDefaultData() {
        return {
            xp: 0, level: 1,
            streak: 0, lastStudyDate: null,
            quizzesCompleted: 0, flashcardsReviewed: 0,
            notesSummarized: 0, studyMinutes: 0,
            timerSessions: 0,
            achievements: [],
            history: []
        };
    }
    function initDemoLeaderboard() {
        const key = 'sc_leaderboard';
        if (!localStorage.getItem(key)) {
            const demo = [
                { username: 'Alex', streak: 42, weeklyStreak: 7, avatar: '🧑‍💻' },
                { username: 'Emma', streak: 35, weeklyStreak: 6, avatar: '👩‍🎓' },
                { username: 'Leo', streak: 28, weeklyStreak: 5, avatar: '🧑‍🔬' },
                { username: 'Sofia', streak: 21, weeklyStreak: 4, avatar: '👩‍💼' },
                { username: 'Oscar', streak: 14, weeklyStreak: 3, avatar: '🧑‍🎨' },
                { username: 'Ella', streak: 10, weeklyStreak: 5, avatar: '👩‍🏫' },
                { username: 'Noah', streak: 7, weeklyStreak: 2, avatar: '🧑‍⚕️' },
                { username: 'Maja', streak: 5, weeklyStreak: 1, avatar: '👩‍🚀' },
            ];
            localStorage.setItem(key, JSON.stringify(demo));
        }
    }
    function getLeaderboard() {
        return JSON.parse(localStorage.getItem('sc_leaderboard') || '[]');
    }
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
    return { getUsers, saveUsers, getCurrentUsername, setCurrentUser, clearCurrentUser, getUserData, saveUserData, getDefaultData, initDemoLeaderboard, getLeaderboard, updateLeaderboard };
})();
