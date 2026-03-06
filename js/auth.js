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
        let cloudStatus = 'No Cloud Configured';

        // 1. NUCLEAR CLOUD OVERRIDE
        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                cloudStatus = 'Connected to Cloud, Checking Database...';

                // Set a timeout to catch network blocks (like school firewalls)
                const cloudPromise = db.ref('users/' + username).once('value');
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000));

                const snap = await Promise.race([cloudPromise, timeoutPromise]);

                if (snap.exists()) {
                    const cloudUser = snap.val();
                    if (cloudUser.password === hashPassword(password)) {
                        users[username] = cloudUser;
                        Storage.saveUsers(users);
                        Storage.setCurrentUser(username);
                        return { ok: true };
                    } else {
                        cloudStatus = 'Cloud reachable, but Cloud Password DOES NOT MATCH.';
                    }
                } else {
                    cloudStatus = 'Cloud reachable, but user not found in database.';
                }
            } catch (err) {
                if (err.message === 'timeout') {
                    cloudStatus = 'Cloud connection timed out (Firewall blocked?).';
                } else {
                    cloudStatus = 'Cloud Error: ' + err.message;
                }
                console.error('Firebase login error:', err);
            }
        }

        // 2. LOCAL FALLBACK
        const localUser = users[username];
        if (!localUser || localUser.password !== hashPassword(password)) {
            // Local failed too. Total failure. Return diagnostics.
            return {
                ok: false,
                error: 'loginError',
                diagnostic: cloudStatus
            };
        }

        // 3. LOCAL SUCCESS -> CLAIM CLOUD
        // If we reach here, Cloud either didn't exist or mismatched, but Local matched perfectly.
        // Therefore, this local machine holds the true account. We forcefully claim the cloud.
        if (window.FirebaseModule && FirebaseModule.isAvailable()) {
            try {
                const db = FirebaseModule.getDB();
                await db.ref('users/' + username).set(localUser);
            } catch (e) { }
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
