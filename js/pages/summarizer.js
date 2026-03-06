/* AI Note Summarizer Page with Google Import — AI-Powered */
const SummarizerPage = (() => {
  function render() {
    const sv = I18n.getLang() === 'sv';
    const aiStatus = AI.isAvailable()
      ? `<span style="color:var(--success);font-size:0.8rem">✅ ${sv ? 'AI aktiverad' : 'AI enabled'}</span>`
      : `<span style="color:var(--text-muted);font-size:0.8rem">💡 ${sv ? 'Lägg till Gemini API-nyckel i inställningar för AI-sammanfattning' : 'Add Gemini API key in settings for AI summaries'}</span>`;
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('summarizerTitle')}</h1><p>${I18n.t('summarizerSubtitle')}</p></div>
      <div class="card">
        <div class="form-group">
          <label>${I18n.t('pasteNotes')}</label>
          <textarea id="summarizer-input" rows="8" placeholder="${I18n.t('pasteNotes')}"></textarea>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
          <button class="btn btn-primary" id="summarize-btn">${I18n.t('summarizeBtn')}</button>
          ${aiStatus}
        </div>
        <p id="summarize-loading" class="mt-1 hidden" style="color:var(--text-secondary);font-size:0.85rem">⏳ ${sv ? 'Sammanfattar med AI...' : 'Summarizing with AI...'}</p>
        <div class="import-section">
          <h3>📄 ${I18n.t('importGoogleDoc')} / ${I18n.t('importGoogleSlides')}</h3>
          <div class="import-row">
            <div class="form-group"><input type="text" id="google-import-url" placeholder="${I18n.t('importPlaceholder')}"></div>
            <button class="btn btn-secondary" id="google-import-btn">${I18n.t('importBtn')}</button>
          </div>
          <p id="import-status" class="mt-1" style="font-size:0.85rem"></p>
        </div>
      </div>
      <div id="summarizer-output" class="summarizer-output"></div>
    </div>`;
  }

  function init() {
    document.getElementById('summarize-btn')?.addEventListener('click', summarize);
    document.getElementById('google-import-btn')?.addEventListener('click', importFromGoogle);
  }

  function importFromGoogle() {
    const url = document.getElementById('google-import-url')?.value.trim();
    const statusEl = document.getElementById('import-status');
    if (!url) return;

    let docId = null, type = null;
    const docMatch = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
    const slidesMatch = url.match(/docs\.google\.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (docMatch) { docId = docMatch[1]; type = 'document'; }
    else if (slidesMatch) { docId = slidesMatch[1]; type = 'presentation'; }
    if (!docId) {
      statusEl.textContent = I18n.t('importError');
      statusEl.style.color = 'var(--danger)';
      return;
    }

    const exportUrl = `https://docs.google.com/${type}/d/${docId}/export?format=txt`;
    statusEl.textContent = '⏳ Importing...';
    statusEl.style.color = 'var(--text-secondary)';

    fetch(exportUrl)
      .then(res => { if (!res.ok) throw new Error('Failed'); return res.text(); })
      .then(text => {
        const textarea = document.getElementById('summarizer-input');
        if (textarea) textarea.value = text;
        statusEl.textContent = `✅ ${I18n.t('importSuccess')}`;
        statusEl.style.color = 'var(--success)';
      })
      .catch(() => {
        statusEl.textContent = I18n.t('importError');
        statusEl.style.color = 'var(--danger)';
      });
  }

  async function summarize() {
    const input = document.getElementById('summarizer-input')?.value.trim();
    if (!input || input.length < 20) return;
    const loadingEl = document.getElementById('summarize-loading');

    let summary, keyPoints, concepts;

    if (AI.isAvailable()) {
      try {
        loadingEl?.classList.remove('hidden');
        document.getElementById('summarize-btn').disabled = true;
        const result = await AI.summarize(input, I18n.getLang());
        summary = result.summary;
        keyPoints = result.keyPoints || [];
        concepts = result.concepts || [];
      } catch (err) {
        console.error('AI summarize error:', err);
        // Fallback
        ({ summary, keyPoints, concepts } = summarizeLocal(input));
      } finally {
        loadingEl?.classList.add('hidden');
        document.getElementById('summarize-btn').disabled = false;
      }
    } else {
      ({ summary, keyPoints, concepts } = summarizeLocal(input));
    }

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

    // Auto-save to saved notes
    try { NotesPage.saveFromSummarizer(input, summary); } catch { }
  }

  function summarizeLocal(input) {
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
    return { summary, keyPoints, concepts };
  }

  return { render, init };
})();
