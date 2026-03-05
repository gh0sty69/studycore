/* Study Games Page */
const GamesPage = (() => {
    const WORDS = ['biology', 'chemistry', 'mathematics', 'geography', 'history', 'physics', 'literature', 'psychology', 'philosophy', 'economics', 'astronomy', 'neuroscience', 'algorithm', 'hypothesis', 'photosynthesis', 'mitochondria', 'evolution', 'ecosystem', 'democracy', 'renaissance'];
    let currentWord = '';
    let scrambled = '';
    let matchPairs = [];
    let selectedTile = null;
    let matchedCount = 0;

    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('gamesTitle')}</h1><p>${I18n.t('gamesSubtitle')}</p></div>
      <div class="games-grid">
        <div class="card game-card" id="game-scramble"><span class="game-icon">🔤</span><h3>${I18n.t('wordScramble')}</h3><p>${I18n.t('wordScrambleDesc')}</p></div>
        <div class="card game-card" id="game-match"><span class="game-icon">🧩</span><h3>${I18n.t('memoryMatch')}</h3><p>${I18n.t('memoryMatchDesc')}</p></div>
      </div>
      <div id="game-area" class="game-area"></div>
    </div>`;
    }

    function init() {
        document.getElementById('game-scramble')?.addEventListener('click', startScramble);
        document.getElementById('game-match')?.addEventListener('click', startMatch);
    }

    function scrambleWord(w) {
        const arr = w.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    function startScramble() {
        currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        scrambled = scrambleWord(currentWord);
        while (scrambled === currentWord) scrambled = scrambleWord(currentWord);
        const area = document.getElementById('game-area');
        area.innerHTML = `<div class="card page-enter">
      <h3 style="text-align:center;margin-bottom:0.5rem">${I18n.t('wordScramble')}</h3>
      <div class="scramble-word">${scrambled.toUpperCase()}</div>
      <div style="max-width:300px;margin:0 auto">
        <div class="form-group"><input type="text" id="scramble-input" placeholder="${I18n.t('typeAnswer')}"></div>
        <div style="display:flex;gap:0.5rem">
          <button class="btn btn-primary" id="scramble-check" style="flex:1">${I18n.t('checkAnswer')}</button>
          <button class="btn btn-secondary" id="scramble-next" style="flex:1">${I18n.t('nextWord')}</button>
        </div>
        <p id="scramble-result" class="mt-2 text-center" style="font-weight:600"></p>
      </div>
    </div>`;
        document.getElementById('scramble-check')?.addEventListener('click', checkScramble);
        document.getElementById('scramble-next')?.addEventListener('click', startScramble);
        document.getElementById('scramble-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') checkScramble(); });
    }

    function checkScramble() {
        const input = document.getElementById('scramble-input')?.value.trim().toLowerCase();
        const resultEl = document.getElementById('scramble-result');
        if (input === currentWord) {
            resultEl.textContent = I18n.t('correct');
            resultEl.style.color = 'var(--success)';
            recordGamePlay();
        } else {
            resultEl.textContent = I18n.t('incorrect');
            resultEl.style.color = 'var(--danger)';
        }
    }

    function startMatch() {
        const pairs = [];
        const selected = WORDS.sort(() => Math.random() - 0.5).slice(0, 4);
        selected.forEach(w => {
            pairs.push({ id: w + '_word', text: w, pair: w, type: 'word' });
            pairs.push({ id: w + '_cap', text: w.charAt(0).toUpperCase() + w.slice(1), pair: w, type: 'cap' });
        });
        matchPairs = pairs.sort(() => Math.random() - 0.5);
        selectedTile = null; matchedCount = 0;
        const area = document.getElementById('game-area');
        area.innerHTML = `<div class="card page-enter">
      <h3 style="text-align:center;margin-bottom:0.5rem">${I18n.t('memoryMatch')}</h3>
      <div class="match-grid" id="match-grid">${matchPairs.map((p, i) => `<div class="match-tile" data-idx="${i}">${p.text}</div>`).join('')}</div>
      <p id="match-result" class="mt-2 text-center" style="font-weight:600"></p>
      <div class="text-center mt-2"><button class="btn btn-secondary" id="match-restart">${I18n.t('newGame')}</button></div>
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
        if (!selectedTile && selectedTile !== 0) {
            selectedTile = idx;
        } else {
            const prevTile = tiles[selectedTile];
            const p1 = matchPairs[selectedTile];
            const p2 = matchPairs[idx];
            if (p1.pair === p2.pair && p1.type !== p2.type) {
                prevTile.classList.add('matched');
                tile.classList.add('matched');
                prevTile.classList.remove('selected');
                tile.classList.remove('selected');
                matchedCount++;
                if (matchedCount === 4) {
                    document.getElementById('match-result').textContent = I18n.t('matchComplete');
                    recordGamePlay();
                }
            } else {
                prevTile.classList.add('wrong');
                tile.classList.add('wrong');
                setTimeout(() => {
                    prevTile.classList.remove('selected', 'wrong');
                    tile.classList.remove('selected', 'wrong');
                }, 500);
            }
            selectedTile = null;
        }
    }

    function recordGamePlay() {
        const data = Storage.getUserData(Auth.currentUser());
        data.gamesPlayed = (data.gamesPlayed || 0) + 1;
        Storage.saveUserData(Auth.currentUser(), data);
        Gamification.awardXP('game');
        Gamification.recordActivity('game', I18n.t('playedGame'));
    }

    return { render, init };
})();
