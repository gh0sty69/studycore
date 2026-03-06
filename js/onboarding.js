/* Onboarding Tour — First-time user walkthrough */
const Onboarding = (() => {
    let currentStep = 0;

    const steps_en = [
        { icon: '👋', title: 'Welcome to StudyCore!', desc: 'Your AI-powered study assistant. Let me show you around!' },
        { icon: '📝', title: 'Summarize Notes', desc: 'Paste your study notes and get instant summaries with key points. You can even import from Google Docs!' },
        { icon: '❓', title: 'Generate Quizzes', desc: 'Turn your notes into multiple-choice quizzes to test your knowledge. Earn XP for every quiz!' },
        { icon: '🃏', title: 'Flashcards', desc: 'Create flashcards from your notes with a smooth flip animation. Perfect for memorization!' },
        { icon: '⏱️', title: 'Study Timer', desc: 'Stay focused with the Pomodoro timer. 25 minutes of focus, 5 minutes of break. Enable Focus Mode for zero distractions!' },
        { icon: '🎮', title: 'Study Games', desc: '7 fun games to learn while playing — Word Scramble, Trivia, Hangman, and more!' },
        { icon: '🔥', title: 'Streaks & XP', desc: 'Study every day to build your streak! Earn XP for every activity, level up, and unlock achievements.' },
        { icon: '🔍', title: 'Quick Search', desc: 'Press Ctrl+K anytime to instantly search your notes, history, and pages.' },
        { icon: '🚀', title: 'You\'re all set!', desc: 'Start studying to earn XP and climb the leaderboard! Good luck! 🎉' },
    ];

    const steps_sv = [
        { icon: '👋', title: 'Välkommen till StudyCore!', desc: 'Din AI-drivna studieassistent. Låt mig visa dig runt!' },
        { icon: '📝', title: 'Sammanfatta Anteckningar', desc: 'Klistra in dina anteckningar och få direkta sammanfattningar. Du kan importera från Google Docs!' },
        { icon: '❓', title: 'Skapa Quiz', desc: 'Förvandla anteckningar till flervalsfrågor. Tjäna XP för varje quiz!' },
        { icon: '🃏', title: 'Flashkort', desc: 'Skapa flashkort med smidig vändningsanimation. Perfekt för memorering!' },
        { icon: '⏱️', title: 'Studietimer', desc: 'Håll fokus med Pomodoro-timern. 25 minuter fokus, 5 minuters paus. Aktivera Fokusläge!' },
        { icon: '🎮', title: 'Studiespel', desc: '7 roliga spel — Ordpussel, Trivia, Hänga Gubbe och mer!' },
        { icon: '🔥', title: 'Svitar & XP', desc: 'Studera varje dag för att bygga din svit! Tjäna XP, levla upp och lås upp utmärkelser.' },
        { icon: '🔍', title: 'Snabbsökning', desc: 'Tryck Ctrl+K när som helst för att söka bland anteckningar, historik och sidor.' },
        { icon: '🚀', title: 'Du är redo!', desc: 'Börja studera för att tjäna XP och klättra på topplistan! Lycka till! 🎉' },
    ];

    function getSteps() { return I18n.getLang() === 'sv' ? steps_sv : steps_en; }

    function show() {
        currentStep = 0;
        renderStep();
    }

    function renderStep() {
        const steps = getSteps();
        const step = steps[currentStep];
        const overlay = document.getElementById('tour-overlay');
        const isLast = currentStep === steps.length - 1;
        const isFirst = currentStep === 0;
        const skipText = I18n.getLang() === 'sv' ? 'Hoppa över' : 'Skip';
        const nextText = I18n.getLang() === 'sv' ? 'Nästa' : 'Next';
        const prevText = I18n.getLang() === 'sv' ? 'Tillbaka' : 'Back';
        const doneText = I18n.getLang() === 'sv' ? 'Starta Studier!' : 'Start Studying!';

        overlay.innerHTML = `<div class="tour-card">
      <span class="tour-icon">${step.icon}</span>
      <h2>${step.title}</h2>
      <p>${step.desc}</p>
      <div class="tour-dots">${steps.map((_, i) => `<div class="tour-dot ${i === currentStep ? 'active' : ''}"></div>`).join('')}</div>
      <div class="tour-btns">
        ${isFirst ? `<button class="btn btn-ghost btn-sm" id="tour-skip">${skipText}</button>` : `<button class="btn btn-ghost btn-sm" id="tour-prev">${prevText}</button>`}
        <button class="btn btn-primary btn-sm" id="tour-next">${isLast ? doneText : nextText}</button>
      </div>
    </div>`;
        overlay.classList.remove('hidden');

        document.getElementById('tour-skip')?.addEventListener('click', close);
        document.getElementById('tour-prev')?.addEventListener('click', () => { currentStep--; renderStep(); });
        document.getElementById('tour-next')?.addEventListener('click', () => {
            if (isLast) { close(); } else { currentStep++; renderStep(); }
        });
    }

    function close() {
        document.getElementById('tour-overlay')?.classList.add('hidden');
        const username = Auth.currentUser();
        if (username) localStorage.setItem('sc_tour_done_' + username, 'true');
    }

    function shouldShow(username) {
        return !localStorage.getItem('sc_tour_done_' + username);
    }

    return { show, close, shouldShow };
})();
