/* Auth — Authentication Module */
const Auth = (() => {
    function hashPassword(pw) { return btoa(pw); }

    async function signup(username, password) {
        if (!username || username.length < 1) return { ok: false, error: 'signupErrorShort' };
        if (password.length < 4) return { ok: false, error: 'signupErrorShort' };

        const users = Storage.getUsers();
        if (users[username]) return { ok: false, error: 'signupErrorExists' };

        // Try Firebase first
        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                const snap = await db.ref('users/' + username).once('value');
                if (snap.exists()) return { ok: false, error: 'signupErrorExists' };

                const newUser = { password: hashPassword(password), data: Storage.getDefaultData() };
                await db.ref('users/' + username).set(newUser);

                users[username] = newUser;
                Storage.saveUsers(users);
                Storage.setCurrentUser(username);
                return { ok: true };
            } catch (err) { console.error('Firebase signup error:', err); }
        }

        users[username] = { password: hashPassword(password), data: Storage.getDefaultData() };
        Storage.saveUsers(users);
        Storage.setCurrentUser(username);
        return { ok: true };
    }

    async function login(username, password) {
        const users = Storage.getUsers();

        // Try Firebase first
        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                const snap = await db.ref('users/' + username).once('value');
                if (snap.exists()) {
                    const dbUser = snap.val();
                    if (dbUser.password === hashPassword(password)) {
                        users[username] = dbUser; // Sync cloud data locally
                        Storage.saveUsers(users);
                        Storage.setCurrentUser(username);
                        return { ok: true };
                    } else {
                        return { ok: false, error: 'loginError' };
                    }
                }
            } catch (err) { console.error('Firebase login error:', err); }
        }

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
