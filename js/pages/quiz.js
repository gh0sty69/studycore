/* Quiz Generator Page */
const QuizPage = (() => {
    let questions = [];
    let currentQ = 0;
    let score = 0;
    let answered = false;

    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('quizTitle')}</h1><p>${I18n.t('quizSubtitle')}</p></div>
      <div id="quiz-setup" class="card">
        <div class="form-group"><textarea id="quiz-input" rows="8" placeholder="${I18n.t('quizPasteNotes')}"></textarea></div>
        <button class="btn btn-primary" id="generate-quiz-btn">${I18n.t('generateQuizBtn')}</button>
      </div>
      <div id="quiz-area" class="hidden"></div>
    </div>`;
    }

    function init() {
        document.getElementById('generate-quiz-btn')?.addEventListener('click', generateQuiz);
    }

    function generateQuiz() {
        const input = document.getElementById('quiz-input')?.value.trim();
        if (!input || input.length < 30) return;
        const sentences = input.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 10);
        questions = [];
        const used = new Set();
        for (let i = 0; i < Math.min(5, sentences.length); i++) {
            const s = sentences[i].trim();
            if (used.has(s)) continue;
            used.add(s);
            const words = s.split(/\s+/).filter(w => w.length > 3);
            if (words.length < 3) continue;
            const keyWord = words[Math.floor(Math.random() * words.length)];
            const qText = s.replace(keyWord, '______');
            const options = [keyWord];
            const filler = ['concept', 'method', 'process', 'element', 'factor', 'system', 'theory', 'model'];
            while (options.length < 4) {
                const f = filler[Math.floor(Math.random() * filler.length)];
                if (!options.includes(f)) options.push(f);
            }
            options.sort(() => Math.random() - 0.5);
            questions.push({ question: `Fill in the blank: "${qText}"`, options, correct: options.indexOf(keyWord) });
        }
        if (questions.length === 0) return;
        currentQ = 0; score = 0; answered = false;
        document.getElementById('quiz-setup')?.classList.add('hidden');
        showQuestion();
    }

    function showQuestion() {
        answered = false;
        const area = document.getElementById('quiz-area');
        if (!area) return;
        area.classList.remove('hidden');
        if (currentQ >= questions.length) {
            area.innerHTML = `<div class="card page-enter text-center">
        <h2>${I18n.t('quizComplete')}</h2>
        <div class="quiz-score">${I18n.t('quizScore', { score, total: questions.length })}</div>
        <button class="btn btn-primary" id="new-quiz-btn">${I18n.t('newQuiz')}</button>
      </div>`;
            document.getElementById('new-quiz-btn')?.addEventListener('click', resetQuiz);
            const data = Storage.getUserData(Auth.currentUser());
            data.quizzesCompleted++;
            Storage.saveUserData(Auth.currentUser(), data);
            Gamification.awardXP('quiz');
            Gamification.recordActivity('quiz', I18n.t('completedQuiz'));
            return;
        }
        const q = questions[currentQ];
        area.innerHTML = `<div class="card quiz-question">
      <p class="text-muted mb-1" style="font-size:0.85rem">${I18n.t('questionOf', { n: currentQ + 1, total: questions.length })}</p>
      <h3>${q.question}</h3>
      <div class="quiz-options">${q.options.map((o, i) => `<div class="quiz-option" data-idx="${i}"><span>${String.fromCharCode(65 + i)}.</span><span>${o}</span></div>`).join('')}</div>
      <div class="mt-2" style="text-align:right"><button class="btn btn-primary hidden" id="next-q-btn">${I18n.t('nextQuestion')}</button></div>
    </div>`;
        area.querySelectorAll('.quiz-option').forEach(opt => {
            opt.addEventListener('click', () => answerQuestion(parseInt(opt.dataset.idx)));
        });
    }

    function answerQuestion(idx) {
        if (answered) return;
        answered = true;
        const q = questions[currentQ];
        const opts = document.querySelectorAll('.quiz-option');
        opts.forEach((o, i) => {
            o.classList.add('disabled');
            if (i === q.correct) o.classList.add('correct');
            if (i === idx && idx !== q.correct) o.classList.add('incorrect');
        });
        if (idx === q.correct) score++;
        currentQ++;
        document.getElementById('next-q-btn')?.classList.remove('hidden');
        document.getElementById('next-q-btn')?.addEventListener('click', showQuestion);
    }

    function resetQuiz() {
        questions = []; currentQ = 0; score = 0;
        document.getElementById('quiz-setup')?.classList.remove('hidden');
        document.getElementById('quiz-area')?.classList.add('hidden');
    }

    return { render, init };
})();
