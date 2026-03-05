/* AI Note Summarizer Page */
const SummarizerPage = (() => {
    function render() {
        return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('summarizerTitle')}</h1><p>${I18n.t('summarizerSubtitle')}</p></div>
      <div class="card"><div class="form-group">
        <label>${I18n.t('pasteNotes')}</label>
        <textarea id="summarizer-input" rows="8" placeholder="${I18n.t('pasteNotes')}"></textarea>
      </div>
      <button class="btn btn-primary" id="summarize-btn">${I18n.t('summarizeBtn')}</button></div>
      <div id="summarizer-output" class="summarizer-output"></div>
    </div>`;
    }
    function init() {
        document.getElementById('summarize-btn')?.addEventListener('click', summarize);
    }
    function summarize() {
        const input = document.getElementById('summarizer-input')?.value.trim();
        if (!input || input.length < 20) return;
        const sentences = input.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 5);
        const summary = sentences.slice(0, 3).join(' ');
        const keyPoints = sentences.slice(0, Math.min(5, sentences.length)).map(s => s.trim());
        const words = input.split(/\s+/);
        const wordFreq = {};
        words.forEach(w => {
            const clean = w.replace(/[^a-zA-ZåäöÅÄÖ]/g, '').toLowerCase();
            if (clean.length > 4) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
        });
        const concepts = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
        const outputEl = document.getElementById('summarizer-output');
        if (!outputEl) return;
        outputEl.innerHTML = `<div class="card page-enter">
      <div class="summary-section"><h3>${I18n.t('summaryLabel')}</h3><p style="color:var(--text-secondary);font-size:0.92rem">${summary}</p></div>
      <div class="summary-section"><h3>${I18n.t('keyPoints')}</h3><ul>${keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>
      <div class="summary-section"><h3>${I18n.t('keyConcepts')}</h3><div>${concepts.map(c => `<span class="concept-tag">${c}</span>`).join('')}</div></div>
    </div>`;
        const data = Storage.getUserData(Auth.currentUser());
        data.notesSummarized++;
        Storage.saveUserData(Auth.currentUser(), data);
        Gamification.awardXP('summarize');
        Gamification.recordActivity('summarize', I18n.t('summarized'));
    }
    return { render, init };
})();
