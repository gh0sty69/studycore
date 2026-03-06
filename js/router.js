/* Router — Hash-based SPA Router */
const Router = (() => {
    const pages = {
        dashboard: { render: () => DashboardPage.render(), init: null },
        summarizer: { render: () => SummarizerPage.render(), init: () => SummarizerPage.init() },
        quiz: { render: () => QuizPage.render(), init: () => QuizPage.init() },
        flashcards: { render: () => FlashcardsPage.render(), init: () => FlashcardsPage.init() },
        timer: { render: () => TimerPage.render(), init: () => TimerPage.init() },
        progress: { render: () => ProgressPage.render(), init: null },
        history: { render: () => HistoryPage.render(), init: null },
        leaderboard: { render: () => LeaderboardPage.render(), init: () => LeaderboardPage.init() },
        achievements: { render: () => AchievementsPage.render(), init: null },
        settings: { render: () => SettingsPage.render(), init: () => SettingsPage.init() },
        games: { render: () => GamesPage.render(), init: () => GamesPage.init() },
        notes: { render: () => NotesPage.render(), init: () => NotesPage.init() },
        chat: { render: () => ChatPage.render(), init: () => ChatPage.init() },
        patchnotes: { render: () => PatchNotesPage.render(), init: null },
        credits: { render: () => CreditsPage.render(), init: null },
    };

    function navigate(pageName) {
        // Cleanup previous page
        try { ChatPage.cleanup(); } catch { }
        const page = pages[pageName] || pages.dashboard;
        const container = document.getElementById('page-container');
        if (!container) return;
        container.innerHTML = page.render();
        if (page.init) page.init();
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });
        document.getElementById('sidebar')?.classList.remove('open');
    }

    function handleHash() {
        const hash = location.hash.replace('#', '') || 'dashboard';
        navigate(hash);
    }

    function init() {
        window.addEventListener('hashchange', handleHash);
        handleHash();
    }

    return { navigate, init, handleHash };
})();
