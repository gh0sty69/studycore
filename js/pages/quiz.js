/* Quiz Generator Page — AI-Powered */
const QuizPage = (() => {
    let questions = [];
    let currentQ = 0;
    let score = 0;
    let answered = false;

    function render() {
        const sv = I18n.getLang() === 'sv';
        const aiStatus = AI.isAvailable()
            ? `<span style="color:var(--success);font-size:0.8rem">✅ ${sv ? 'AI aktiverad' : 'AI enabled'}</span>`
            : `<span style="color:var(--text-muted);font-size:0.8rem">💡 ${sv ? 'Lägg till Gemini API-nyckel i inställningar för AI-quiz' : 'Add Gemini API key in settings for AI-powered quizzes'}</span>`;
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('quizTitle')}</h1><p>${I18n.t('quizSubtitle')}</p></div>
      <div id="quiz-setup" class="card">
        <div class="form-group"><textarea id="quiz-input" rows="8" placeholder="${I18n.t('quizPasteNotes')}"></textarea></div>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
          <button class="btn btn-primary" id="generate-quiz-btn">${I18n.t('generateQuizBtn')}</button>
          ${aiStatus}
        </div>
        <p id="quiz-loading" class="mt-1 hidden" style="color:var(--text-secondary);font-size:0.85rem">⏳ ${sv ? 'Genererar quiz med AI...' : 'Generating quiz with AI...'}</p>
      </div>
      <div id="quiz-area" class="hidden"></div>
    </div>`;
    }

    function init() {
        document.getElementById('generate-quiz-btn')?.addEventListener('click', generateQuiz);
    }

    async function generateQuiz() {
        const input = document.getElementById('quiz-input')?.value.trim();
        if (!input || input.length < 30) return;

        const loadingEl = document.getElementById('quiz-loading');

        if (AI.isAvailable()) {
            // Use real AI
            try {
                loadingEl?.classList.remove('hidden');
                document.getElementById('generate-quiz-btn').disabled = true;
                const aiQuestions = await AI.generateQuiz(input, I18n.getLang());
                questions = aiQuestions.map(q => ({
                    question: q.question,
                    options: q.options,
                    correct: q.correct
                }));
            } catch (err) {
                console.error('AI quiz error:', err);
                // Fallback to local generation
                questions = generateLocal(input);
            } finally {
                loadingEl?.classList.add('hidden');
                document.getElementById('generate-quiz-btn').disabled = false;
            }
        } else {
            // Local fallback
            questions = generateLocal(input);
        }

        if (questions.length === 0) return;
        currentQ = 0; score = 0; answered = false;
        document.getElementById('quiz-setup')?.classList.add('hidden');
        showQuestion();
    }

    function generateLocal(input) {
        // Improved local quiz generator — avoids title words, picks meaningful keywords
        const sentences = input.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 15);
        const localQuestions = [];
        const used = new Set();

        // Get title words to exclude (first line)
        const firstLine = input.split('\n')[0]?.toLowerCase() || '';
        const titleWords = new Set(firstLine.split(/\s+/).map(w => w.replace(/[^a-zA-ZåäöÅÄÖ]/g, '').toLowerCase()));

        // Skip first sentence (often a title)
        const startIdx = sentences.length > 2 ? 1 : 0;

        for (let i = startIdx; i < sentences.length && localQuestions.length < 5; i++) {
            const s = sentences[i].trim();
            if (used.has(s) || s.length < 20) continue;
            used.add(s);
            // Pick content words (not title words, not short words)
            const words = s.split(/\s+/).filter(w => {
                const clean = w.replace(/[^a-zA-ZåäöÅÄÖ]/g, '').toLowerCase();
                return clean.length > 4 && !titleWords.has(clean);
            });
            if (words.length < 2) continue;
            const keyWord = words[Math.floor(Math.random() * words.length)];
            const qText = s.replace(keyWord, '______');
            // Get other words from text as distractors
            const allWords = input.split(/\s+/).filter(w => {
                const c = w.replace(/[^a-zA-ZåäöÅÄÖ]/g, '');
                return c.length > 4 && c.toLowerCase() !== keyWord.toLowerCase();
            });
            const options = [keyWord];
            const shuffledWords = allWords.sort(() => Math.random() - 0.5);
            for (const w of shuffledWords) {
                const clean = w.replace(/[^a-zA-ZåäöÅÄÖ]/g, '');
                if (!options.includes(clean) && clean.length > 3) {
                    options.push(clean);
                    if (options.length >= 4) break;
                }
            }
            const filler = ['analysis', 'structure', 'function', 'development', 'principle', 'application'];
            while (options.length < 4) {
                const f = filler[Math.floor(Math.random() * filler.length)];
                if (!options.includes(f)) options.push(f);
            }
            options.sort(() => Math.random() - 0.5);
            localQuestions.push({ question: `Fill in the blank: "${qText}"`, options, correct: options.indexOf(keyWord) });
        }
        return localQuestions;
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
