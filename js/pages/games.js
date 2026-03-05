/* Study Games Page — 4 Games, Fully Translated */
const GamesPage = (() => {
    // Word lists for games (translated)
    const WORDS_EN = ['biology', 'chemistry', 'mathematics', 'geography', 'history', 'physics', 'literature', 'psychology', 'philosophy', 'economics', 'astronomy', 'neuroscience', 'algorithm', 'hypothesis', 'photosynthesis', 'mitochondria', 'evolution', 'ecosystem', 'democracy', 'renaissance'];
    const WORDS_SV = ['biologi', 'kemi', 'matematik', 'geografi', 'historia', 'fysik', 'litteratur', 'psykologi', 'filosofi', 'ekonomi', 'astronomi', 'neurovetenskap', 'algoritm', 'hypotes', 'fotosyntes', 'mitokondrier', 'evolution', 'ekosystem', 'demokrati', 'renässans'];

    const TRIVIA_EN = [
        { q: 'What planet is known as the Red Planet?', a: 'mars', opts: ['mars', 'venus', 'jupiter', 'saturn'] },
        { q: 'What is the chemical symbol for water?', a: 'h2o', opts: ['h2o', 'co2', 'nacl', 'o2'] },
        { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare', opts: ['shakespeare', 'dickens', 'austen', 'hemingway'] },
        { q: 'What is the largest organ in the human body?', a: 'skin', opts: ['skin', 'liver', 'brain', 'heart'] },
        { q: 'What gas do plants absorb from the atmosphere?', a: 'carbon dioxide', opts: ['carbon dioxide', 'oxygen', 'nitrogen', 'hydrogen'] },
        { q: 'What is the speed of light in km/s (approx)?', a: '300000', opts: ['300000', '150000', '500000', '100000'] },
        { q: 'What is the powerhouse of the cell?', a: 'mitochondria', opts: ['mitochondria', 'nucleus', 'ribosome', 'golgi'] },
        { q: 'In which year did World War II end?', a: '1945', opts: ['1945', '1942', '1939', '1950'] },
    ];
    const TRIVIA_SV = [
        { q: 'Vilken planet kallas den Röda Planeten?', a: 'mars', opts: ['mars', 'venus', 'jupiter', 'saturnus'] },
        { q: 'Vad är den kemiska formeln för vatten?', a: 'h2o', opts: ['h2o', 'co2', 'nacl', 'o2'] },
        { q: 'Vem skrev Romeo och Julia?', a: 'shakespeare', opts: ['shakespeare', 'dickens', 'austen', 'hemingway'] },
        { q: 'Vad är det största organet i kroppen?', a: 'huden', opts: ['huden', 'levern', 'hjärnan', 'hjärtat'] },
        { q: 'Vilken gas absorberar växter från atmosfären?', a: 'koldioxid', opts: ['koldioxid', 'syre', 'kväve', 'väte'] },
        { q: 'Vad är ljusets hastighet i km/s (ungefär)?', a: '300000', opts: ['300000', '150000', '500000', '100000'] },
        { q: 'Vad är cellens kraftverk?', a: 'mitokondrier', opts: ['mitokondrier', 'cellkärna', 'ribosom', 'golgi'] },
        { q: 'Vilket år slutade andra världskriget?', a: '1945', opts: ['1945', '1942', '1939', '1950'] },
    ];

    let currentWord = '';
    let scrambled = '';
    let matchPairs = [];
    let selectedTile = null;
    let matchedCount = 0;
    let triviaIdx = 0;
    let triviaScore = 0;
    let triviaAnswered = false;
    let typingText = '';
    let typingStart = 0;
    let typingTimer = null;

    function getWords() { return I18n.getLang() === 'sv' ? WORDS_SV : WORDS_EN; }
    function getTrivia() { return I18n.getLang() === 'sv' ? TRIVIA_SV : TRIVIA_EN; }

    // i18n keys for game UI
    function gt(key) {
        const keys = {
            en: {
                gamesTitle: 'Study Games', gamesSubtitle: 'Learn through fun interactive games.',
                wordScramble: 'Word Scramble', wordScrambleDesc: 'Unscramble study-related words',
                memoryMatch: 'Memory Match', memoryMatchDesc: 'Match pairs of study concepts',
                triviaBlitz: 'Trivia Blitz', triviaBlitzDesc: 'Answer quick-fire trivia questions',
                speedTyping: 'Speed Typing', speedTypingDesc: 'Type study terms as fast as you can',
                typeAnswer: 'Type your answer...', checkAnswer: 'Check', correct: '✅ Correct!',
                incorrect: '❌ Try again!', nextWord: 'Next Word', newGame: 'New Game',
                matchComplete: '🎉 All pairs matched!', score: 'Score', clickToStart: 'Click to start typing!',
                typingComplete: 'Done!', wpm: 'WPM', timeLabel: 'Time', triviaComplete: 'Trivia Complete!',
                nextQuestion: 'Next', typeHere: 'Start typing here...',
            },
            sv: {
                gamesTitle: 'Studiespel', gamesSubtitle: 'Lär dig genom roliga interaktiva spel.',
                wordScramble: 'Ordpussel', wordScrambleDesc: 'Blanda om studierelaterade ord',
                memoryMatch: 'Minnespar', memoryMatchDesc: 'Matcha par av studiebegrepp',
                triviaBlitz: 'Kunskapsblitz', triviaBlitzDesc: 'Svara på snabba triviafrågor',
                speedTyping: 'Snabbskrivning', speedTypingDesc: 'Skriv studietermer så snabbt du kan',
                typeAnswer: 'Skriv ditt svar...', checkAnswer: 'Kontrollera', correct: '✅ Rätt!',
                incorrect: '❌ Försök igen!', nextWord: 'Nästa Ord', newGame: 'Nytt Spel',
                matchComplete: '🎉 Alla par matchade!', score: 'Resultat', clickToStart: 'Klicka för att börja skriva!',
                typingComplete: 'Klart!', wpm: 'OPM', timeLabel: 'Tid', triviaComplete: 'Trivia Klart!',
                nextQuestion: 'Nästa', typeHere: 'Börja skriva här...',
            }
        };
        return keys[I18n.getLang()]?.[key] || keys['en'][key] || key;
    }

    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${gt('gamesTitle')}</h1><p>${gt('gamesSubtitle')}</p></div>
      <div class="games-grid">
        <div class="card game-card" id="game-scramble"><span class="game-icon">🔤</span><h3>${gt('wordScramble')}</h3><p>${gt('wordScrambleDesc')}</p></div>
        <div class="card game-card" id="game-match"><span class="game-icon">🧩</span><h3>${gt('memoryMatch')}</h3><p>${gt('memoryMatchDesc')}</p></div>
        <div class="card game-card" id="game-trivia"><span class="game-icon">⚡</span><h3>${gt('triviaBlitz')}</h3><p>${gt('triviaBlitzDesc')}</p></div>
        <div class="card game-card" id="game-typing"><span class="game-icon">⌨️</span><h3>${gt('speedTyping')}</h3><p>${gt('speedTypingDesc')}</p></div>
      </div>
      <div id="game-area" class="game-area"></div>
    </div>`;
    }

    function init() {
        document.getElementById('game-scramble')?.addEventListener('click', startScramble);
        document.getElementById('game-match')?.addEventListener('click', startMatch);
        document.getElementById('game-trivia')?.addEventListener('click', startTrivia);
        document.getElementById('game-typing')?.addEventListener('click', startTyping);
    }

    // === WORD SCRAMBLE ===
    function scrambleWord(w) {
        const arr = w.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    function startScramble() {
        const words = getWords();
        currentWord = words[Math.floor(Math.random() * words.length)];
        scrambled = scrambleWord(currentWord);
        while (scrambled === currentWord) scrambled = scrambleWord(currentWord);
        const area = document.getElementById('game-area');
        area.innerHTML = `<div class="card page-enter">
      <h3 style="text-align:center;margin-bottom:0.5rem">${gt('wordScramble')}</h3>
      <div class="scramble-word">${scrambled.toUpperCase()}</div>
      <div style="max-width:320px;margin:0 auto">
        <div class="form-group"><input type="text" id="scramble-input" placeholder="${gt('typeAnswer')}"></div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary" id="scramble-check" style="flex:1">${gt('checkAnswer')}</button>
          <button class="btn btn-secondary" id="scramble-next" style="flex:1">${gt('nextWord')}</button>
        </div>
        <p id="scramble-result" class="mt-2 text-center" style="font-weight:600;min-height:1.5rem"></p>
      </div>
    </div>`;
        document.getElementById('scramble-check')?.addEventListener('click', checkScramble);
        document.getElementById('scramble-next')?.addEventListener('click', startScramble);
        document.getElementById('scramble-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') checkScramble(); });
        document.getElementById('scramble-input')?.focus();
    }

    function checkScramble() {
        const input = document.getElementById('scramble-input')?.value.trim().toLowerCase();
        const resultEl = document.getElementById('scramble-result');
        if (input === currentWord) {
            resultEl.textContent = gt('correct');
            resultEl.style.color = 'var(--success)';
            recordGamePlay();
        } else {
            resultEl.textContent = gt('incorrect');
            resultEl.style.color = 'var(--danger)';
        }
    }

    // === MEMORY MATCH ===
    function startMatch() {
        const words = getWords();
        const selected = [...words].sort(() => Math.random() - 0.5).slice(0, 4);
        const pairs = [];
        selected.forEach(w => {
            pairs.push({ id: w + '_a', text: w, pair: w, type: 'lower' });
            pairs.push({ id: w + '_b', text: w.toUpperCase(), pair: w, type: 'upper' });
        });
        matchPairs = pairs.sort(() => Math.random() - 0.5);
        selectedTile = null; matchedCount = 0;
        const area = document.getElementById('game-area');
        area.innerHTML = `<div class="card page-enter">
      <h3 style="text-align:center;margin-bottom:0.5rem">${gt('memoryMatch')}</h3>
      <div class="match-grid" id="match-grid">${matchPairs.map((p, i) => `<div class="match-tile" data-idx="${i}">${p.text}</div>`).join('')}</div>
      <p id="match-result" class="mt-2 text-center" style="font-weight:600;min-height:1.5rem"></p>
      <div class="text-center mt-2"><button class="btn btn-secondary" id="match-restart">${gt('newGame')}</button></div>
    </div>`;
        document.querySelectorAll('.match-tile').forEach(tile => {
            tile.addEventListener('click', () => handleMatchClick(parseInt(tile.dataset.idx)));
        });
        document.getElementById('match-restart')?.addEventListener('click', startMatch);
    }

    function handleMatchClick(idx) {
        const tiles = document.querySelectorAll('.match-tile');
        const tile = tiles[idx];
        if (tile.classList.contains('matched') || tile.classList.contains('selected')) return;
        tile.classList.add('selected');
        if (selectedTile === null) {
            selectedTile = idx;
        } else {
            const prevTile = tiles[selectedTile];
            const p1 = matchPairs[selectedTile];
            const p2 = matchPairs[idx];
            if (p1.pair === p2.pair && p1.type !== p2.type) {
                prevTile.classList.add('matched'); tile.classList.add('matched');
                prevTile.classList.remove('selected'); tile.classList.remove('selected');
                matchedCount++;
                if (matchedCount === 4) {
                    document.getElementById('match-result').textContent = gt('matchComplete');
                    recordGamePlay();
                }
            } else {
                prevTile.classList.add('wrong'); tile.classList.add('wrong');
                setTimeout(() => {
                    prevTile.classList.remove('selected', 'wrong');
                    tile.classList.remove('selected', 'wrong');
                }, 500);
            }
            selectedTile = null;
        }
    }

    // === TRIVIA BLITZ ===
    function startTrivia() {
        triviaIdx = 0; triviaScore = 0;
        showTriviaQuestion();
    }

    function showTriviaQuestion() {
        triviaAnswered = false;
        const trivia = getTrivia();
        const area = document.getElementById('game-area');
        if (triviaIdx >= trivia.length) {
            area.innerHTML = `<div class="card page-enter text-center">
        <h2>${gt('triviaComplete')}</h2>
        <div class="quiz-score">${gt('score')}: ${triviaScore} / ${trivia.length}</div>
        <button class="btn btn-primary" id="trivia-restart">${gt('newGame')}</button>
      </div>`;
            document.getElementById('trivia-restart')?.addEventListener('click', startTrivia);
            recordGamePlay();
            return;
        }
        const q = trivia[triviaIdx];
        const shuffled = [...q.opts].sort(() => Math.random() - 0.5);
        area.innerHTML = `<div class="card page-enter">
      <p class="text-muted mb-1" style="font-size:0.85rem">${gt('score')}: ${triviaScore} | ${triviaIdx + 1} / ${trivia.length}</p>
      <h3 style="margin-bottom:1rem">${q.q}</h3>
      <div class="quiz-options">${shuffled.map((o, i) => `<div class="quiz-option trivia-opt" data-answer="${o}"><span>${String.fromCharCode(65 + i)}.</span><span>${o}</span></div>`).join('')}</div>
    </div>`;
        document.querySelectorAll('.trivia-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                if (triviaAnswered) return;
                triviaAnswered = true;
                const answer = opt.dataset.answer;
                const trivia = getTrivia();
                const correct = trivia[triviaIdx].a;
                document.querySelectorAll('.trivia-opt').forEach(o => {
                    o.classList.add('disabled');
                    if (o.dataset.answer === correct) o.classList.add('correct');
                    if (o.dataset.answer === answer && answer !== correct) o.classList.add('incorrect');
                });
                if (answer === correct) triviaScore++;
                triviaIdx++;
                setTimeout(showTriviaQuestion, 1000);
            });
        });
    }

    // === SPEED TYPING ===
    function startTyping() {
        const words = getWords();
        const selected = [...words].sort(() => Math.random() - 0.5).slice(0, 6);
        typingText = selected.join(' ');
        typingStart = 0;
        if (typingTimer) clearInterval(typingTimer);
        const area = document.getElementById('game-area');
        area.innerHTML = `<div class="card page-enter">
      <h3 style="text-align:center;margin-bottom:1rem">${gt('speedTyping')}</h3>
      <div style="background:var(--bg-input);padding:1.25rem;border-radius:var(--radius-md);font-size:1.1rem;font-family:monospace;letter-spacing:0.05em;line-height:1.8;margin-bottom:1rem;text-align:center;color:var(--text-secondary)" id="typing-display">${typingText}</div>
      <div class="form-group"><input type="text" id="typing-input" placeholder="${gt('typeHere')}" autocomplete="off" autocorrect="off" spellcheck="false"></div>
      <div style="display:flex;justify-content:center;gap:2rem;margin-top:0.5rem">
        <div style="text-align:center"><div style="font-size:1.5rem;font-weight:700" id="typing-time">0.0s</div><div class="text-muted" style="font-size:0.8rem">${gt('timeLabel')}</div></div>
        <div style="text-align:center"><div style="font-size:1.5rem;font-weight:700" id="typing-wpm">0</div><div class="text-muted" style="font-size:0.8rem">${gt('wpm')}</div></div>
      </div>
      <p id="typing-result" class="mt-2 text-center" style="font-weight:600;min-height:1.5rem"></p>
      <div class="text-center mt-2"><button class="btn btn-secondary" id="typing-restart">${gt('newGame')}</button></div>
    </div>`;
        const input = document.getElementById('typing-input');
        input?.focus();
        input?.addEventListener('input', () => {
            if (!typingStart) {
                typingStart = Date.now();
                typingTimer = setInterval(updateTypingTimer, 100);
            }
            const val = input.value;
            // Highlight typed characters
            const display = document.getElementById('typing-display');
            if (display) {
                let html = '';
                for (let i = 0; i < typingText.length; i++) {
                    if (i < val.length) {
                        html += val[i] === typingText[i]
                            ? `<span style="color:var(--success)">${typingText[i]}</span>`
                            : `<span style="color:var(--danger);text-decoration:underline">${typingText[i]}</span>`;
                    } else {
                        html += typingText[i];
                    }
                }
                display.innerHTML = html;
            }
            if (val === typingText) {
                clearInterval(typingTimer);
                const elapsed = ((Date.now() - typingStart) / 1000).toFixed(1);
                const wordCount = typingText.split(' ').length;
                const wpm = Math.round((wordCount / (elapsed / 60)));
                document.getElementById('typing-result').textContent = `${gt('typingComplete')} ${elapsed}s — ${wpm} ${gt('wpm')}`;
                document.getElementById('typing-result').style.color = 'var(--success)';
                input.disabled = true;
                recordGamePlay();
            }
        });
        document.getElementById('typing-restart')?.addEventListener('click', startTyping);
    }

    function updateTypingTimer() {
        if (!typingStart) return;
        const elapsed = ((Date.now() - typingStart) / 1000).toFixed(1);
        const el = document.getElementById('typing-time');
        if (el) el.textContent = elapsed + 's';
        const wordCount = typingText.split(' ').length;
        const wpmEl = document.getElementById('typing-wpm');
        if (wpmEl && elapsed > 0) {
            wpmEl.textContent = Math.round(wordCount / (elapsed / 60));
        }
    }

    // === SHARED ===
    function recordGamePlay() {
        const data = Storage.getUserData(Auth.currentUser());
        data.gamesPlayed = (data.gamesPlayed || 0) + 1;
        Storage.saveUserData(Auth.currentUser(), data);
        Gamification.awardXP('game');
        Gamification.recordActivity('game', I18n.t('playedGame'));
    }

    return { render, init };
})();
