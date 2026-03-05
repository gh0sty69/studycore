/* Auth — Authentication Module */
const Auth = (() => {
    function hashPassword(pw) { return btoa(pw); }

    function signup(username, password) {
        if (!username || username.length < 1) return { ok: false, error: 'signupErrorShort' };
        if (password.length < 4) return { ok: false, error: 'signupErrorShort' };
        const users = Storage.getUsers();
        if (users[username]) return { ok: false, error: 'signupErrorExists' };
        users[username] = { password: hashPassword(password), data: Storage.getDefaultData() };
        Storage.saveUsers(users);
        Storage.setCurrentUser(username);
        return { ok: true };
    }

    function login(username, password) {
        const users = Storage.getUsers();
        const user = users[username];
        if (!user || user.password !== hashPassword(password)) {
            return { ok: false, error: 'loginError' };
        }
        Storage.setCurrentUser(username);
        return { ok: true };
    }

    function logout() {
        Storage.clearCurrentUser();
    }

    function isLoggedIn() {
        return !!Storage.getCurrentUsername();
    }

    function currentUser() {
        return Storage.getCurrentUsername();
    }

    return { signup, login, logout, isLoggedIn, currentUser };
})();
