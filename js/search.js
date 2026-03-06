/* Search Module — Ctrl+K / Click to search across notes, history, flashcards */
const Search = (() => {
    let isOpen = false;

    function open() {
        isOpen = true;
        const overlay = document.getElementById('search-overlay');
        overlay.classList.remove('hidden');
        const input = document.getElementById('search-input');
        input.value = '';
        input.focus();
        document.getElementById('search-results').innerHTML = `<div class="search-empty">${I18n.getLang() === 'sv' ? 'Skriv för att söka bland anteckningar, historik och flashkort...' : 'Type to search notes, history, and flashcards...'}</div>`;
    }

    function close() {
        isOpen = false;
        document.getElementById('search-overlay')?.classList.add('hidden');
    }

    function toggle() { isOpen ? close() : open(); }

    function search(query) {
        if (!query || query.length < 2) {
            document.getElementById('search-results').innerHTML = `<div class="search-empty">${I18n.getLang() === 'sv' ? 'Skriv minst 2 tecken...' : 'Type at least 2 characters...'}</div>`;
            return;
        }
        const q = query.toLowerCase();
        const results = [];
        const username = Auth.currentUser();
        if (!username) return;
        const data = Storage.getUserData(username);

        // Search saved notes
        const notes = JSON.parse(localStorage.getItem('sc_notes_' + username) || '[]');
        notes.forEach(note => {
            if (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q) || note.summary?.toLowerCase().includes(q)) {
                results.push({ icon: '📝', type: 'note', title: note.title, desc: note.summary || note.content.substring(0, 80), action: () => { close(); location.hash = 'notes'; } });
            }
        });

        // Search history
        (data.history || []).forEach(h => {
            if (h.detail?.toLowerCase().includes(q) || h.type?.toLowerCase().includes(q)) {
                const d = new Date(h.date);
                results.push({ icon: { summarize: '📝', quiz: '❓', flashcards: '🃏', timer: '⏱️', game: '🎮' }[h.type] || '📜', type: 'history', title: h.detail, desc: d.toLocaleDateString() + ' — +' + h.xp + ' XP', action: () => { close(); location.hash = 'history'; } });
            }
        });

        // Search word bank (for flashcard-like results)
        const words = I18n.getLang() === 'sv'
            ? ['biologi', 'kemi', 'matematik', 'geografi', 'historia', 'fysik', 'litteratur', 'psykologi', 'filosofi', 'ekonomi']
            : ['biology', 'chemistry', 'mathematics', 'geography', 'history', 'physics', 'literature', 'psychology', 'philosophy', 'economics'];
        words.forEach(w => {
            if (w.includes(q)) {
                results.push({ icon: '🃏', type: 'flashcard', title: w, desc: I18n.getLang() === 'sv' ? 'Flashkort-term' : 'Flashcard term', action: () => { close(); location.hash = 'flashcards'; } });
            }
        });

        // Search page names
        const pages = [
            { name: I18n.t('navDashboard'), hash: 'dashboard', icon: '🏠' },
            { name: I18n.t('navSummarizer'), hash: 'summarizer', icon: '📝' },
            { name: I18n.t('navQuiz'), hash: 'quiz', icon: '❓' },
            { name: I18n.t('navFlashcards'), hash: 'flashcards', icon: '🃏' },
            { name: I18n.t('navTimer'), hash: 'timer', icon: '⏱️' },
            { name: I18n.t('navProgress'), hash: 'progress', icon: '📊' },
            { name: I18n.t('navHistory'), hash: 'history', icon: '📜' },
            { name: I18n.t('navLeaderboard'), hash: 'leaderboard', icon: '🏆' },
            { name: I18n.t('navAchievements'), hash: 'achievements', icon: '🎖️' },
            { name: I18n.t('navGames'), hash: 'games', icon: '🎮' },
            { name: I18n.t('navSettings'), hash: 'settings', icon: '⚙️' },
            { name: I18n.t('navPatchNotes'), hash: 'patchnotes', icon: '📋' },
            { name: I18n.t('navCredits'), hash: 'credits', icon: '💜' },
        ];
        pages.forEach(p => {
            if (p.name.toLowerCase().includes(q)) {
                results.push({ icon: p.icon, type: 'page', title: p.name, desc: I18n.getLang() === 'sv' ? 'Gå till sida' : 'Go to page', action: () => { close(); location.hash = p.hash; } });
            }
        });

        const container = document.getElementById('search-results');
        if (results.length === 0) {
            container.innerHTML = `<div class="search-empty">${I18n.getLang() === 'sv' ? 'Inga resultat hittades' : 'No results found'} 😔</div>`;
        } else {
            container.innerHTML = results.slice(0, 15).map((r, i) => `<div class="search-result-item" data-idx="${i}"><div class="search-result-icon">${r.icon}</div><div class="search-result-info"><strong>${r.title}</strong><p>${r.desc}</p></div></div>`).join('');
            container.querySelectorAll('.search-result-item').forEach(item => {
                const idx = parseInt(item.dataset.idx);
                item.addEventListener('click', () => results[idx].action());
            });
        }
    }

    function init() {
        // Click outside closes
        document.getElementById('search-overlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'search-overlay') close();
        });
        // Search input
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            search(e.target.value.trim());
        });
        // Escape closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) close();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); toggle(); }
        });
        // Search button
        document.getElementById('search-btn')?.addEventListener('click', toggle);
    }

    return { open, close, toggle, init };
})();
