/* App — Main Application Controller */
const App = (() => {
    const APP_VERSION = '2.7.3';

    function init() {
        I18n.init();
        Storage.initDemoLeaderboard();

        if (Auth.isLoggedIn()) {
            showApp();
            Auth.syncLocalAccount();
        } else {
            showAuth();
        }

        // Auth forms
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value.trim();
            const p = document.getElementById('login-password').value;
            const btn = e.target.querySelector('button');
            const orig = btn.innerHTML; btn.innerHTML = '...'; btn.disabled = true;
            document.getElementById('login-error').textContent = '';

            const result = await Auth.login(u, p);

            btn.innerHTML = orig; btn.disabled = false;
            if (result.ok) { showApp(); }
            else {
                const baseErr = I18n.t(result.error) || result.error;
                let finalMsg = baseErr;
                if (result.diagnostic) {
                    finalMsg += `<br><br><span style="color:#f39c12;font-size:0.85rem"><b>Diagnostic:</b> ${result.diagnostic}</span>`;
                }
                document.getElementById('login-error').innerHTML = finalMsg;
            }
        });

        document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const u = document.getElementById('signup-username').value.trim();
            const p = document.getElementById('signup-password').value;
            const c = document.getElementById('signup-confirm').value;
            if (p !== c) { document.getElementById('signup-error').textContent = I18n.t('signupErrorMatch'); return; }

            const btn = e.target.querySelector('button');
            const orig = btn.innerHTML; btn.innerHTML = '...'; btn.disabled = true;
            document.getElementById('signup-error').textContent = '';

            const result = await Auth.signup(u, p);

            btn.innerHTML = orig; btn.disabled = false;
            if (result.ok) { showApp(); }
            else { document.getElementById('signup-error').textContent = I18n.t(result.error) || result.error; }
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

        // Bug Reporter Modal & Discord Webhook
        const bugModal = document.getElementById('bug-report-modal');
        document.getElementById('bug-report-btn')?.addEventListener('click', () => {
            bugModal.classList.remove('hidden');
        });
        document.getElementById('close-bug-report')?.addEventListener('click', () => {
            bugModal.classList.add('hidden');
        });

        document.getElementById('submit-bug-report')?.addEventListener('click', async () => {
            const textEl = document.getElementById('bug-report-text');
            const statusEl = document.getElementById('bug-report-status');
            const text = textEl.value.trim();
            if (!text) return;

            // ⚠️ USER: PASTE YOUR DISCORD WEBHOOK URL HERE ⚠️
            const WEBHOOK_URL = 'YOUR_DISCORD_WEBHOOK_URL_HERE';

            const payload = {
                content: `🚨 **New Bug Report** from user: \`${Auth.currentUser() || 'Unknown'}\`\n\n**Report:**\n> ${text}`
            };

            statusEl.textContent = 'Sending...';
            statusEl.style.color = 'var(--text-main)';

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    statusEl.textContent = 'Report sent successfully! Thank you.';
                    statusEl.style.color = 'var(--success)';
                    textEl.value = '';
                    setTimeout(() => bugModal.classList.add('hidden'), 2000);
                } else {
                    const err = await response.text();
                    console.error('Webhook error:', err);
                    statusEl.textContent = 'Webhook URL not configured or invalid.';
                    statusEl.style.color = 'var(--danger)';
                }
            } catch (err) {
                console.error('Fetch error:', err);
                statusEl.textContent = 'Failed to send report. Network error.';
                statusEl.style.color = 'var(--danger)';
            }
        });

        // Lang toggle
        document.getElementById('lang-btn')?.addEventListener('click', () => {
            const next = I18n.getLang() === 'en' ? 'sv' : 'en';
            I18n.setLang(next);
            const username = Auth.currentUser();
            if (username) {
                const data = Storage.getUserData(username);
                data.langSwitches = (data.langSwitches || 0) + 1;
                Storage.saveUserData(username, data);
                Gamification.checkAchievements(data, username);
            }
            Router.handleHash();
        });

        // Sidebar toggle (mobile)
        document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
            document.getElementById('sidebar')?.classList.toggle('open');
        });

        // Update banner buttons
        document.getElementById('update-banner-btn')?.addEventListener('click', () => {
            hideUpdateBanner();
            location.hash = 'patchnotes';
        });
        document.getElementById('update-banner-close')?.addEventListener('click', () => {
            hideUpdateBanner();
        });

        // Init Search (Ctrl+K)
        Search.init();

        I18n.updateDOM();
    }

    function showApp() {
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('topbar-username').textContent = Auth.currentUser();
        I18n.updateDOM();
        Router.init();
        SettingsPage.applyOnLoad();
        checkForUpdate();

        // Onboarding tour for first-time users
        const username = Auth.currentUser();
        if (username && Onboarding.shouldShow(username)) {
            setTimeout(() => Onboarding.show(), 800);
        }
    }

    function showAuth() {
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
        I18n.updateDOM();
    }

    // Version tracking & update notification
    function checkForUpdate() {
        const username = Auth.currentUser();
        if (!username) return;
        const key = 'sc_last_version_' + username;
        const lastVersion = localStorage.getItem(key);
        if (lastVersion && lastVersion !== APP_VERSION) {
            setTimeout(() => showUpdateBanner(), 1200);
        }
        localStorage.setItem(key, APP_VERSION);
    }

    function showUpdateBanner() {
        const banner = document.getElementById('update-banner');
        if (!banner) return;
        const lang = I18n.getLang();
        const title = document.getElementById('update-banner-title');
        const desc = document.getElementById('update-banner-desc');
        const btn = document.getElementById('update-banner-btn');
        if (title) title.textContent = lang === 'sv' ? 'StudyCore Uppdaterad!' : 'StudyCore Updated!';
        if (desc) desc.textContent = lang === 'sv' ? 'Nya funktioner tillgängliga. Kolla vad som är nytt!' : 'New features are available. Check out what\'s new!';
        if (btn) btn.textContent = lang === 'sv' ? 'Visa Uppdateringar' : 'View Patch Notes';
        banner.classList.remove('hidden');
    }

    function hideUpdateBanner() {
        const banner = document.getElementById('update-banner');
        if (banner) {
            banner.style.animation = 'bannerSlideOut 0.3s ease forwards';
            setTimeout(() => { banner.classList.add('hidden'); banner.style.animation = ''; }, 300);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init, APP_VERSION };
})();
