/* App — Main Application Controller */
const App = (() => {
    function init() {
        I18n.init();
        Storage.initDemoLeaderboard();

        if (Auth.isLoggedIn()) {
            showApp();
        } else {
            showAuth();
        }

        // Auth forms
        document.getElementById('login-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value.trim();
            const p = document.getElementById('login-password').value;
            const result = Auth.login(u, p);
            if (result.ok) { showApp(); }
            else { document.getElementById('login-error').textContent = I18n.t(result.error); }
        });

        document.getElementById('signup-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('signup-username').value.trim();
            const p = document.getElementById('signup-password').value;
            const c = document.getElementById('signup-confirm').value;
            if (p !== c) { document.getElementById('signup-error').textContent = I18n.t('signupErrorMatch'); return; }
            const result = Auth.signup(u, p);
            if (result.ok) { showApp(); }
            else { document.getElementById('signup-error').textContent = I18n.t(result.error); }
        });

        // Toggle auth forms
        document.getElementById('show-signup')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('signup-form').classList.remove('hidden');
        });
        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-form').classList.add('hidden');
            document.getElementById('login-form').classList.remove('hidden');
        });

        // Logout
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            Auth.logout();
            showAuth();
        });

        // Lang toggle — also track switches for polyglot achievement
        document.getElementById('lang-btn')?.addEventListener('click', () => {
            const next = I18n.getLang() === 'en' ? 'sv' : 'en';
            I18n.setLang(next);
            // Track language switches
            const username = Auth.currentUser();
            if (username) {
                const data = Storage.getUserData(username);
                data.langSwitches = (data.langSwitches || 0) + 1;
                Storage.saveUserData(username, data);
                Gamification.checkAchievements(data, username);
            }
            Router.handleHash(); // Re-render current page
        });

        // Sidebar toggle (mobile)
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('open');
        });

        I18n.updateDOM();
    }

    function showApp() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('topbar-username').textContent = Auth.currentUser();
        I18n.updateDOM();
        Router.init();
    }

    function showAuth() {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
        I18n.updateDOM();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init };
})();
