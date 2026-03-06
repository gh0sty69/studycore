/* Chat Page — Real-time chat via Firebase (fallback to localStorage) */
const ChatPage = (() => {
    let firebaseListener = null;
    let pollInterval = null;
    let lastCount = 0;

    const CHAT_KEY = 'sc_chat_messages';
    const MAX_MESSAGES = 200;

    // --- localStorage fallback ---
    function getLocalMessages() {
        try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]'); }
        catch { return []; }
    }
    function saveLocalMessages(msgs) {
        if (msgs.length > MAX_MESSAGES) msgs = msgs.slice(-MAX_MESSAGES);
        localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
    }

    function render() {
        const sv = I18n.getLang() === 'sv';
        const online = FirebaseModule.isAvailable();
        const statusText = online
            ? `<span style="color:var(--success);font-size:0.75rem">🟢 ${sv ? 'Online — realtidschatt' : 'Online — real-time chat'}</span>`
            : `<span style="color:var(--text-muted);font-size:0.75rem">📡 ${sv ? 'Lokal chatt — lägg till Firebase i inställningar för global chatt' : 'Local chat — add Firebase in settings for global chat'}</span>`;

        return `<div class="page-enter">
      <div class="page-header">
        <h1>💬 ${sv ? 'Chatt' : 'Chat'}</h1>
        <p>${sv ? 'Chatta med andra StudyCore-användare.' : 'Chat with other StudyCore users.'}</p>
      </div>
      <div style="margin-bottom:0.5rem">${statusText}</div>
      <div class="card chat-container">
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-input-bar">
          <input type="text" id="chat-input" placeholder="${sv ? 'Skriv ett meddelande...' : 'Type a message...'}" autocomplete="off" maxlength="500">
          <button class="btn btn-primary" id="chat-send">${sv ? 'Skicka' : 'Send'}</button>
        </div>
      </div>
    </div>`;
    }

    function init() {
        document.getElementById('chat-send')?.addEventListener('click', sendMessage);
        document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        });
        document.getElementById('chat-input')?.focus();

        // Always render local cached messages immediately so the screen isn't blank
        renderMessages(getLocalMessages());

        if (FirebaseModule.isAvailable()) {
            // Firebase real-time listener (will cleanly overwrite local messages once connected)
            const db = FirebaseModule.getDB();
            const chatRef = db.ref('chat').orderByChild('time').limitToLast(MAX_MESSAGES);

            // Timeout to fallback if firewall blocks connection completely
            let connected = false;
            setTimeout(() => {
                if (!connected) setupOfflinePolling();
            }, 3000);

            firebaseListener = chatRef.on('value', (snapshot) => {
                connected = true;
                const msgs = [];
                snapshot.forEach(child => { msgs.push(child.val()); });

                // Save authoritative cloud messages to local cache
                saveLocalMessages(msgs);
                renderMessages(msgs);
            });
        } else {
            setupOfflinePolling();
        }
    }

    function setupOfflinePolling() {
        if (pollInterval) return;
        lastCount = getLocalMessages().length;
        pollInterval = setInterval(() => {
            const msgs = getLocalMessages();
            if (msgs.length !== lastCount) { lastCount = msgs.length; renderMessages(msgs); }
        }, 1500);
        window.addEventListener('storage', onStorageChange);
    }

    function cleanup() {
        if (firebaseListener && FirebaseModule.isAvailable()) {
            try { FirebaseModule.getDB().ref('chat').off('value', firebaseListener); } catch { }
            firebaseListener = null;
        }
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
        window.removeEventListener('storage', onStorageChange);
    }

    function onStorageChange(e) {
        if (e.key === CHAT_KEY) renderMessages(getLocalMessages());
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input?.value.trim();
        if (!text) return;

        const username = Auth.currentUser();
        const msg = {
            user: username,
            text: text,
            time: Date.now(),
            isOwner: Storage.isOwner(username)
        };

        // 1. Optimistic UI: Immediately save & render locally so it pops up instantly
        const msgs = getLocalMessages();
        msgs.push(msg);
        saveLocalMessages(msgs);
        renderMessages(msgs);

        // 2. Background Sync: Push to Firebase if configured
        if (FirebaseModule.isAvailable()) {
            FirebaseModule.getDB().ref('chat').push(msg).catch(e => console.error('Silent chat push error:', e));
        }

        input.value = '';

        // Award XP for first chat
        const data = Storage.getUserData(username);
        if (!data.chatMessageSent) {
            data.chatMessageSent = true;
            Storage.saveUserData(username, data);
            Gamification.awardXP('game');
        }
    }

    function renderMessages(msgs) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const currentUser = Auth.currentUser();
        const sv = I18n.getLang() === 'sv';

        if (!msgs || msgs.length === 0) {
            container.innerHTML = `<div class="chat-empty">${sv ? 'Inga meddelanden ännu. Var den första att chatta!' : 'No messages yet. Be the first to chat!'} 💬</div>`;
            return;
        }

        container.innerHTML = msgs.map(m => {
            const isMine = m.user === currentUser;
            const timeStr = formatTime(m.time);
            const nameClass = m.isOwner ? 'owner-name' : '';
            const badge = m.isOwner ? ' <span class="owner-badge" style="font-size:0.6rem;padding:0.1rem 0.3rem">👑 OWNER</span>' : '';
            return `<div class="chat-msg ${isMine ? 'chat-msg-mine' : 'chat-msg-other'}">
        <div class="chat-msg-header">
          <span class="chat-msg-user ${nameClass}">${escapeHtml(m.user)}${badge}</span>
          <span class="chat-msg-time">${timeStr}</span>
        </div>
        <div class="chat-msg-text">${escapeHtml(m.text)}</div>
      </div>`;
        }).join('');

        container.scrollTop = container.scrollHeight;
    }

    function formatTime(ts) {
        const d = new Date(ts);
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (isToday) return time;
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + time;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    return { render, init, cleanup };
})();
