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
                        const localUser = users[username];
                        if (localUser) {
                            const localXP = (localUser.data && localUser.data.xp) ? localUser.data.xp : 0;
                            const cloudXP = (dbUser.data && dbUser.data.xp) ? dbUser.data.xp : 0;
                            if (localXP > cloudXP) {
                                await db.ref('users/' + username).set(localUser); // Overwrite cloud
                            } else {
                                users[username] = dbUser; // Sync cloud locally
                                Storage.saveUsers(users);
                            }
                        } else {
                            users[username] = dbUser; // New PC, pull from cloud
                            Storage.saveUsers(users);
                        }
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

        // Push local user to Firebase if available and logging in locally
        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                const snap = await db.ref('users/' + username).once('value');
                if (!snap.exists()) {
                    await db.ref('users/' + username).set(user);
                }
            } catch (err) { }
        }

        Storage.setCurrentUser(username);
        return { ok: true };
    }

    async function syncLocalAccount() {
        const username = currentUser();
        if (!username) return;
        const users = Storage.getUsers();
        const user = users[username];
        if (!user) return;

        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                const snap = await db.ref('users/' + username).once('value');
                if (!snap.exists()) {
                    await db.ref('users/' + username).set(user);
                    console.log('Migrated local user to Firebase cloud.');
                } else {
                    // Prevent empty cloud accounts from overwriting rich local accounts
                    const dbUser = snap.val();
                    if (dbUser.password === user.password) {
                        const localXP = (user.data && user.data.xp) ? user.data.xp : 0;
                        const cloudXP = (dbUser.data && dbUser.data.xp) ? dbUser.data.xp : 0;

                        // If local has more XP, it means the cloud account is an empty/newer duplicate.
                        // Overwrite the cloud with local rich data instead.
                        if (localXP > cloudXP) {
                            await db.ref('users/' + username).set(user);
                            console.log('Local account had more XP, overwrote cloud account.');
                        } else {
                            users[username] = dbUser;
                            Storage.saveUsers(users);
                            console.log('Synced cloud data locally.');
                        }
                    }
                }
            } catch (err) { }
        }
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

    return { signup, login, logout, isLoggedIn, currentUser, syncLocalAccount };
})();
