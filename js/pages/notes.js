/* Saved Notes Page — Save & organize summaries into folders */
const NotesPage = (() => {
    let activeFolder = 'all';

    function getNotes() {
        return JSON.parse(localStorage.getItem('sc_notes_' + Auth.currentUser()) || '[]');
    }
    function saveNotes(notes) {
        localStorage.setItem('sc_notes_' + Auth.currentUser(), JSON.stringify(notes));
    }

    function render() {
        const notes = getNotes();
        const folders = ['all', ...new Set(notes.map(n => n.folder).filter(Boolean))];
        const filtered = activeFolder === 'all' ? notes : notes.filter(n => n.folder === activeFolder);
        const sv = I18n.getLang() === 'sv';
        const title = sv ? 'Sparade Anteckningar' : 'Saved Notes';
        const subtitle = sv ? 'Organisera dina sammanfattningar i mappar.' : 'Organize your summaries into folders.';
        const newBtn = sv ? 'Ny Anteckning' : 'New Note';
        const newFolder = sv ? '+ Ny Mapp' : '+ New Folder';
        const empty = sv ? 'Inga sparade anteckningar ännu. Sammanfatta anteckningar så sparas de här!' : 'No saved notes yet. Summarize notes and they\'ll appear here!';

        return `<div class="page-enter">
      <div class="page-header"><h1>📌 ${title}</h1><p>${subtitle}</p></div>
      <div class="notes-toolbar">
        ${folders.map(f => `<button class="folder-tag ${f === activeFolder ? 'active' : ''}" data-folder="${f}">${f === 'all' ? (sv ? '📂 Alla' : '📂 All') : '📁 ' + f}</button>`).join('')}
        <button class="folder-tag" id="add-folder-btn">${newFolder}</button>
      </div>
      <button class="btn btn-primary btn-sm mb-2" id="new-note-btn">➕ ${newBtn}</button>
      ${filtered.length === 0 ? `<div class="history-empty" style="padding:2rem;text-align:center;color:var(--text-muted)">${empty}</div>` :
                filtered.map((n, i) => `<div class="card saved-note-card" data-note-idx="${i}">
          <h4>${n.title}</h4>
          <p>${(n.summary || n.content).substring(0, 120)}...</p>
          <div class="note-meta">
            <span>📁 ${n.folder || (sv ? 'Ingen mapp' : 'No folder')}</span>
            <span>${new Date(n.date).toLocaleDateString()}</span>
          </div>
        </div>`).join('')}
    </div>`;
    }

    function init() {
        // Folder tabs
        document.querySelectorAll('.folder-tag[data-folder]').forEach(btn => {
            btn.addEventListener('click', () => { activeFolder = btn.dataset.folder; Router.navigate('notes'); });
        });
        // New folder
        document.getElementById('add-folder-btn')?.addEventListener('click', () => {
            const name = prompt(I18n.getLang() === 'sv' ? 'Mappnamn:' : 'Folder name:');
            if (name && name.trim()) { activeFolder = name.trim(); Router.navigate('notes'); }
        });
        // New note
        document.getElementById('new-note-btn')?.addEventListener('click', () => {
            const sv = I18n.getLang() === 'sv';
            showNoteEditor({ title: '', content: '', summary: '', folder: activeFolder === 'all' ? '' : activeFolder, date: new Date().toISOString() }, -1);
        });
        // View note
        document.querySelectorAll('.saved-note-card').forEach(card => {
            card.addEventListener('click', () => {
                const notes = getNotes();
                const filtered = activeFolder === 'all' ? notes : notes.filter(n => n.folder === activeFolder);
                const idx = parseInt(card.dataset.noteIdx);
                if (filtered[idx]) showNoteViewer(filtered[idx], notes.indexOf(filtered[idx]));
            });
        });
    }

    function showNoteEditor(note, editIdx) {
        const sv = I18n.getLang() === 'sv';
        const overlay = document.createElement('div');
        overlay.className = 'note-modal-overlay';
        overlay.innerHTML = `<div class="note-modal">
      <h3>${editIdx >= 0 ? (sv ? 'Redigera' : 'Edit') : (sv ? 'Ny Anteckning' : 'New Note')}</h3>
      <div class="form-group"><label>${sv ? 'Titel' : 'Title'}</label><input type="text" id="note-title" value="${note.title}" placeholder="${sv ? 'Anteckningens titel' : 'Note title'}"></div>
      <div class="form-group"><label>${sv ? 'Mapp' : 'Folder'}</label><input type="text" id="note-folder" value="${note.folder}" placeholder="${sv ? 'Mappnamn (valfritt)' : 'Folder name (optional)'}"></div>
      <div class="form-group"><label>${sv ? 'Innehåll' : 'Content'}</label><textarea id="note-content" rows="8" placeholder="${sv ? 'Skriv eller klistra in anteckningar...' : 'Write or paste notes...'}">${note.content}</textarea></div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-primary" id="note-save">${sv ? 'Spara' : 'Save'}</button>
        <button class="btn btn-ghost" id="note-cancel">${sv ? 'Avbryt' : 'Cancel'}</button>
      </div>
    </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById('note-cancel')?.addEventListener('click', () => overlay.remove());
        document.getElementById('note-save')?.addEventListener('click', () => {
            const notes = getNotes();
            const newNote = {
                title: document.getElementById('note-title').value || (sv ? 'Utan titel' : 'Untitled'),
                content: document.getElementById('note-content').value,
                folder: document.getElementById('note-folder').value.trim(),
                summary: document.getElementById('note-content').value.substring(0, 100),
                date: new Date().toISOString(),
            };
            if (editIdx >= 0) { notes[editIdx] = newNote; } else { notes.unshift(newNote); }
            saveNotes(notes);
            overlay.remove();
            Router.navigate('notes');
        });
    }

    function showNoteViewer(note, realIdx) {
        const sv = I18n.getLang() === 'sv';
        const overlay = document.createElement('div');
        overlay.className = 'note-modal-overlay';
        overlay.innerHTML = `<div class="note-modal">
      <h3>${note.title}</h3>
      <p class="text-muted mb-1" style="font-size:0.8rem">📁 ${note.folder || (sv ? 'Ingen mapp' : 'No folder')} · ${new Date(note.date).toLocaleDateString()}</p>
      <div style="white-space:pre-wrap;font-size:0.9rem;color:var(--text-secondary);line-height:1.6;margin:1rem 0">${note.content}</div>
      <div style="display:flex;gap:0.5rem">
        <button class="btn btn-secondary" id="note-edit">${sv ? 'Redigera' : 'Edit'}</button>
        <button class="btn btn-danger" id="note-delete">${sv ? 'Radera' : 'Delete'}</button>
        <button class="btn btn-ghost" id="note-close-view">${sv ? 'Stäng' : 'Close'}</button>
      </div>
    </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById('note-close-view')?.addEventListener('click', () => overlay.remove());
        document.getElementById('note-edit')?.addEventListener('click', () => { overlay.remove(); showNoteEditor(note, realIdx); });
        document.getElementById('note-delete')?.addEventListener('click', () => {
            if (!confirm(sv ? 'Radera denna anteckning?' : 'Delete this note?')) return;
            const notes = getNotes(); notes.splice(realIdx, 1); saveNotes(notes);
            overlay.remove(); Router.navigate('notes');
        });
    }

    // Auto-save from summarizer
    function saveFromSummarizer(content, summary) {
        const notes = getNotes();
        const sv = I18n.getLang() === 'sv';
        notes.unshift({
            title: (sv ? 'Sammanfattning' : 'Summary') + ' — ' + new Date().toLocaleDateString(),
            content, summary, folder: '', date: new Date().toISOString(),
        });
        saveNotes(notes);
    }

    return { render, init, saveFromSummarizer };
})();
