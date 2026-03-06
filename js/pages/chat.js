/* Chat Page — Real-time shared chat via localStorage */
const ChatPage = (() => {
    let pollInterval = null;
    let lastCount = 0;

    const CHAT_KEY = 'sc_chat_messages';
    const MAX_MESSAGES = 200;

    function getMessages() {
        try { return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]'); }
        catch { return []; }
    }

    function saveMessages(msgs) {
        // Keep last MAX_MESSAGES
        if (msgs.length > MAX_MESSAGES) msgs = msgs.slice(-MAX_MESSAGES);
        localStorage.setItem(CHAT_KEY, JSON.stringify(msgs));
    }

    function render() {
        const sv = I18n.getLang() === 'sv';
        const username = Auth.currentUser();
        const isOwner = Storage.isOwner(username);
        return `<div class="page-enter">
      <div class="page-header"><h1>💬 ${sv ? 'Chatt' : 'Chat'}</h1><p>${sv ? 'Chatta med andra StudyCore-användare.' : 'Chat with other StudyCore users.'}</p></div>
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
        renderMessages();
        // Send
        document.getElementById('chat-send')?.addEventListener('click', sendMessage);
        document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
        });
        document.getElementById('chat-input')?.focus();
        // Poll for new messages every 1.5s
        lastCount = getMessages().length;
        pollInterval = setInterval(pollMessages, 1500);
        // Listen for storage events from other tabs
        window.addEventListener('storage', onStorageChange);
    }

    function cleanup() {
        if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
        window.removeEventListener('storage', onStorageChange);
    }

    function onStorageChange(e) {
        if (e.key === CHAT_KEY) renderMessages();
    }

    function pollMessages() {
        const msgs = getMessages();
        if (msgs.length !== lastCount) {
            lastCount = msgs.length;
            renderMessages();
        }
    }

    function sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input?.value.trim();
        if (!text) return;

        const username = Auth.currentUser();
        const msgs = getMessages();
        msgs.push({
            user: username,
            text: text,
            time: Date.now(),
            isOwner: Storage.isOwner(username)
        });
        saveMessages(msgs);
        input.value = '';
        renderMessages();

        // Award XP for first chat message
        const data = Storage.getUserData(username);
        if (!data.chatMessageSent) {
            data.chatMessageSent = true;
            Storage.saveUserData(username, data);
            Gamification.awardXP('game');
        }
    }

    function renderMessages() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const msgs = getMessages();
        const currentUser = Auth.currentUser();
        const sv = I18n.getLang() === 'sv';

        if (msgs.length === 0) {
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
          <span class="chat-msg-user ${nameClass}">${m.user}${badge}</span>
          <span class="chat-msg-time">${timeStr}</span>
        </div>
        <div class="chat-msg-text">${escapeHtml(m.text)}</div>
      </div>`;
        }).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        lastCount = msgs.length;
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
