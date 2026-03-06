/* Study Timer Page — Pomodoro with Focus Mode */
const TimerPage = (() => {
  let totalTime, remaining, running = false, isBreak = false, interval = null, focusMode = false;
  const CIRC = 2 * Math.PI * 120;

  function getSettings() {
    try { return SettingsPage.getUserSettings(); } catch { return { focusMin: 25, breakMin: 5 }; }
  }

  function getFocusTime() { return (getSettings().focusMin || 25) * 60; }
  function getBreakTime() { return (getSettings().breakMin || 5) * 60; }

  function render() {
    if (!totalTime) { totalTime = getFocusTime(); remaining = getFocusTime(); }
    const sv = I18n.getLang() === 'sv';
    const focusBtnText = focusMode ? (sv ? 'Avsluta Fokusläge' : 'Exit Focus Mode') : (sv ? 'Fokusläge' : 'Focus Mode');
    return `<div class="page-enter">
      <div class="page-header"><h1>${I18n.t('timerTitle')}</h1><p>${I18n.t('timerSubtitle')}</p></div>
      <div class="timer-container">
        <div class="timer-circle">
          <svg viewBox="0 0 260 260">
            <circle class="timer-track" cx="130" cy="130" r="120"/>
            <circle class="timer-progress ${isBreak ? 'break-mode' : ''}" id="timer-ring" cx="130" cy="130" r="120" stroke-dasharray="${CIRC}" stroke-dashoffset="0"/>
          </svg>
          <div class="timer-text">
            <div class="timer-digits" id="timer-digits">${formatTime(remaining)}</div>
            <div class="timer-label" id="timer-label">${isBreak ? I18n.t('breakTime') : I18n.t('focusSession')}</div>
          </div>
        </div>
        <div class="timer-controls">
          <button class="btn btn-primary" id="timer-start">${running ? I18n.t('pause') : I18n.t('start')}</button>
          <button class="btn btn-secondary" id="timer-reset">${I18n.t('reset')}</button>
          <button class="btn btn-ghost" id="timer-focus">🎯 ${focusBtnText}</button>
        </div>
        <p id="timer-msg" class="mt-2 text-muted text-center" style="font-size:0.9rem"></p>
      </div>
    </div>`;
  }

  function init() {
    updateRing();
    document.getElementById('timer-start')?.addEventListener('click', toggleTimer);
    document.getElementById('timer-reset')?.addEventListener('click', resetTimer);
    document.getElementById('timer-focus')?.addEventListener('click', toggleFocus);
  }

  function toggleFocus() {
    focusMode = !focusMode;
    if (focusMode) {
      document.body.classList.add('focus-mode');
      // Add exit button
      if (!document.getElementById('focus-exit')) {
        const btn = document.createElement('button');
        btn.id = 'focus-exit';
        btn.className = 'focus-exit-btn';
        btn.textContent = I18n.getLang() === 'sv' ? '✕ Avsluta Fokus' : '✕ Exit Focus';
        btn.addEventListener('click', toggleFocus);
        document.body.appendChild(btn);
      }
    } else {
      document.body.classList.remove('focus-mode');
      document.getElementById('focus-exit')?.remove();
    }
    Router.navigate('timer');
  }

  function toggleTimer() {
    if (running) { clearInterval(interval); running = false; }
    else { running = true; interval = setInterval(tick, 1000); }
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = running ? I18n.t('pause') : I18n.t('resume');
  }

  function tick() {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval); running = false;
      if (!isBreak) {
        const focusMin = getSettings().focusMin || 25;
        const data = Storage.getUserData(Auth.currentUser());
        data.studyMinutes += focusMin;
        data.timerSessions++;
        Storage.saveUserData(Auth.currentUser(), data);
        Gamification.awardXP('timer');
        Gamification.recordActivity('timer', I18n.t('timerSession'));
        document.getElementById('timer-msg').textContent = I18n.t('sessionComplete');
        isBreak = true; totalTime = getBreakTime(); remaining = getBreakTime();
      } else {
        document.getElementById('timer-msg').textContent = I18n.t('breakComplete');
        isBreak = false; totalTime = getFocusTime(); remaining = getFocusTime();
      }
      const btn = document.getElementById('timer-start');
      if (btn) btn.textContent = I18n.t('start');
    }
    updateDisplay();
  }

  function resetTimer() {
    clearInterval(interval); running = false;
    isBreak = false; totalTime = getFocusTime(); remaining = getFocusTime();
    updateDisplay();
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = I18n.t('start');
    const msg = document.getElementById('timer-msg');
    if (msg) msg.textContent = '';
  }

  function updateDisplay() {
    const digits = document.getElementById('timer-digits');
    const label = document.getElementById('timer-label');
    if (digits) digits.textContent = formatTime(remaining);
    if (label) label.textContent = isBreak ? I18n.t('breakTime') : I18n.t('focusSession');
    updateRing();
  }

  function updateRing() {
    const ring = document.getElementById('timer-ring');
    if (!ring) return;
    const pct = remaining / totalTime;
    ring.setAttribute('stroke-dashoffset', CIRC * (1 - pct));
    ring.classList.toggle('break-mode', isBreak);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  return { render, init };
})();
