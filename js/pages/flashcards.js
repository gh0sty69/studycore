/* Flashcards Page */
const FlashcardsPage = (() => {
    let cards = [];
    let currentIdx = 0;
    let flipped = false;

    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('flashcardsTitle')}</h1><p>${I18n.t('flashcardsSubtitle')}</p></div>
      <div id="fc-setup" class="card">
        <div class="form-group"><textarea id="fc-input" rows="6" placeholder="${I18n.t('flashcardPaste')}"></textarea></div>
        <button class="btn btn-primary" id="generate-fc-btn">${I18n.t('generateCards')}</button>
      </div>
      <div id="fc-area" class="hidden"></div>
    </div>`;
    }

    function init() {
        document.getElementById('generate-fc-btn')?.addEventListener('click', generate);
    }

    function generate() {
        const input = document.getElementById('fc-input')?.value.trim();
        if (!input || input.length < 20) return;
        const sentences = input.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 10);
        cards = sentences.slice(0, 10).map(s => {
            const words = s.trim().split(/\s+/);
            const mid = Math.floor(words.length / 2);
            return { front: words.slice(0, mid).join(' ') + '...', back: s.trim() };
        });
        if (cards.length === 0) return;
        currentIdx = 0; flipped = false;
        document.getElementById('fc-setup')?.classList.add('hidden');
        renderCard();
        const data = Storage.getUserData(Auth.currentUser());
        data.flashcardsReviewed += cards.length;
        Storage.saveUserData(Auth.currentUser(), data);
        Gamification.awardXP('flashcards');
        Gamification.recordActivity('flashcards', I18n.t('reviewedFlashcards'));
    }

    function renderCard() {
        const area = document.getElementById('fc-area');
        if (!area || cards.length === 0) return;
        area.classList.remove('hidden');
        const c = cards[currentIdx];
        area.innerHTML = `
      <div class="flashcard-scene" id="fc-scene">
        <div class="flashcard ${flipped ? 'flipped' : ''}" id="fc-card">
          <div class="flashcard-face flashcard-front">${c.front}</div>
          <div class="flashcard-face flashcard-back">${c.back}</div>
        </div>
      </div>
      <div class="flashcard-counter">${I18n.t('cardOf', { n: currentIdx + 1, total: cards.length })}</div>
      <div class="flashcard-hint">${I18n.t('clickToFlip')}</div>
      <div class="flashcard-controls">
        <button class="btn btn-secondary" id="fc-prev">${I18n.t('previous')}</button>
        <button class="btn btn-secondary" id="fc-shuffle">🔀 ${I18n.t('shuffle')}</button>
        <button class="btn btn-secondary" id="fc-next">${I18n.t('next')}</button>
      </div>`;
        document.getElementById('fc-scene')?.addEventListener('click', () => {
            flipped = !flipped;
            document.getElementById('fc-card')?.classList.toggle('flipped', flipped);
        });
        document.getElementById('fc-prev')?.addEventListener('click', () => { currentIdx = (currentIdx - 1 + cards.length) % cards.length; flipped = false; renderCard(); });
        document.getElementById('fc-next')?.addEventListener('click', () => { currentIdx = (currentIdx + 1) % cards.length; flipped = false; renderCard(); });
        document.getElementById('fc-shuffle')?.addEventListener('click', () => { cards.sort(() => Math.random() - 0.5); currentIdx = 0; flipped = false; renderCard(); });
    }

    return { render, init };
})();
