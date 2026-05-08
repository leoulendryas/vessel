/**
 * app.js - vessel Workout Page Logic
 */

let sb = null;
let activeDay = 0;
let openExId = null;
let completedSets = {}; // { [exId]: Set<number> }
let timer = { running: false, exId: null, seconds: 0, total: 0, interval: null };
let authMode = 'login'; // or 'signup'
let userProgram = null;

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', async () => {
  initSupabase();
  buildFloatTimer();
  
  if (sb) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      showAuth();
    } else {
      await showApp(user);
    }
  } else {
    // If no SB, fallback to static app
    userProgram = PROGRAM;
    renderTabs();
    renderDay();
  }

  setupAuthListeners();
});

function initSupabase() {
  const isConfigured = SUPABASE_URL && !SUPABASE_URL.includes('YOUR_PROJECT');
  if (isConfigured) {
    try {
      sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.error("Supabase init failed", e);
    }
  }
}

// --- AUTH LOGIC ---

function setupAuthListeners() {
  const passInput = document.getElementById('auth-pass');
  const emoji = document.getElementById('pass-emoji');
  const msg = document.getElementById('pass-msg');
  if (!passInput || !emoji || !msg) return;
  
  passInput.addEventListener('input', (e) => {
    const len = e.target.value.length;
    if (len < 2) {
      emoji.innerText = '🤔';
      msg.innerText = 'Just type something. Or don\'t. I\'m a sign, not a cop.';
    } else if (len < 5) {
      emoji.innerText = '🤨';
      msg.innerText = 'Yeah, that\'s probably enough effort.';
    } else if (len < 7) {
      emoji.innerText = '😊';
      msg.innerText = 'Wow, you\'re really overthinking this.';
    } else if (len < 10) {
      emoji.innerText = '😎';
      msg.innerText = 'Okay, Mr. Cybersecurity. We get it.';
    } else {
      emoji.innerText = '🤯';
      msg.innerText = 'Bro, it\'s just a gym app. Relax. 😂';
    }
  });

  document.getElementById('auth-form').addEventListener('submit', handleAuthSubmit);
}

function toggleAuthMode() {
  authMode = authMode === 'login' ? 'signup' : 'login';
  const sub = document.getElementById('auth-sub');
  const btn = document.getElementById('auth-submit-btn');
  const switchText = document.getElementById('auth-switch-text');

  if (authMode === 'signup') {
    sub.innerText = "Join the vessel community.";
    btn.innerText = "Create Account";
    switchText.innerHTML = 'Already have an account? <span onclick="toggleAuthMode()">Login</span>';
  } else {
    sub.innerText = "Forge your discipline.";
    btn.innerText = "Enter vessel";
    switchText.innerHTML = 'New here? <span onclick="toggleAuthMode()">Create an account</span>';
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;
  const btn = document.getElementById('auth-submit-btn');

  btn.disabled = true;
  btn.innerText = authMode === 'login' ? "Entering..." : "Creating...";

  try {
    let result;
    if (authMode === 'login') {
      result = await sb.auth.signInWithPassword({ email, password });
    } else {
      result = await sb.auth.signUp({ email, password });
    }

    if (result.error) throw result.error;

    if (authMode === 'signup' && !result.data.session) {
      showToast("Check your email for a confirmation link! 📧", "success");
      btn.innerText = "Check your email!";
    } else {
      await showApp(result.data.user);
    }
  } catch (err) {
    console.error(err);
    if (err.message === 'Email not confirmed') {
      showToast("Verification pending! Check your email. 📧", "error");
    } else {
      const funErrors = [
        "Wrong key! 🚫",
        "Are you sure that's you? 🧐",
        "The vessel is locked... for now. 🔒",
        "Typo? Or just testing me? 😂"
      ];
      showToast(funErrors[Math.floor(Math.random() * funErrors.length)], "error");
    }
  } finally {
    btn.disabled = false;
    btn.innerText = authMode === 'login' ? "Enter vessel" : "Create Account";
  }
}

function showAuth() {
  document.getElementById('auth-overlay').classList.remove('hidden');
  document.getElementById('user-bar').classList.add('hidden');
}

async function showApp(user) {
  document.getElementById('auth-overlay').classList.add('hidden');
  document.getElementById('user-bar').classList.remove('hidden');
  document.getElementById('user-email').innerText = user.email;

  await loadUserProgram();
  renderTabs();
  renderDay();
}

async function loadUserProgram() {
  try {
    const { data, error } = await sb.from('user_programs').select('program_data').maybeSingle();
    
    if (error) throw error;

    if (!data) {
      userProgram = JSON.parse(JSON.stringify(PROGRAM));
      const { error: insError } = await sb.from('user_programs').insert({ program_data: userProgram });
      if (insError) console.error("Initial save failed", insError);
    } else {
      userProgram = data.program_data;
      // Migration: Ensure Sat/Sun exist for older 5-day accounts
      if (userProgram.days.length < 7) {
        const weekend = PROGRAM.days.slice(5);
        userProgram.days.push(...JSON.parse(JSON.stringify(weekend)));
      }
    }
  } catch (err) {
    console.error("Failed to load program", err);
    userProgram = PROGRAM;
  }
}

async function handleLogout() {
  await sb.auth.signOut();
  location.reload();
}

// --- RENDERING ---

function renderTabs() {
  const container = document.getElementById('day-tabs');
  const prog = userProgram || PROGRAM;
  container.innerHTML = prog.days.map((day, i) => `
    <div class="day-tab ${activeDay === i ? 'active' : ''}" onclick="switchDay(${i})">
      <div class="tab-label">${day.label}</div>
      <div class="tab-name">${day.tabName}</div>
    </div>
  `).join('');
}

function switchDay(index) {
  if (activeDay === index) return;
  activeDay = index;
  openExId = null;
  renderTabs();
  renderDay();
}

function renderDay() {
  const prog = userProgram || PROGRAM;
  const day = prog.days[activeDay];
  const panel = document.getElementById('panel');

  let html = `
    <div class="day-title">${day.title}</div>
    <div class="badge-row">
      ${(day.badges || []).map(b => `<div class="badge">${b}</div>`).join('')}
    </div>
  `;

  day.sections.forEach(sec => {
    if (sec.label) html += `<div class="sec-label">${sec.label}</div>`;
    sec.exercises.forEach(ex => {
      const isOpen = openExId === ex.id;
      html += `
        <div class="ex ${isOpen ? 'open' : ''}" id="ex-${ex.id}">
          <div class="ex-header" onclick="toggleEx('${ex.id}')">
            <div class="ex-info">
              <div class="ex-name">${ex.name}</div>
              <div class="ex-note">${ex.note || ''}</div>
            </div>
            <div class="ex-meta">
              <div class="pill pill-sets">${ex.sets}</div>
              <div class="pill">${ex.rpe || 'RPE -'}</div>
              <div class="chevron">▾</div>
            </div>
          </div>
          <div class="ex-detail">
            ${isOpen ? renderExDetail(ex) : ''}
          </div>
        </div>
      `;
    });
  });

  if (day.tip) {
    html += `
      <div class="tip-box">
        <strong>Tip:</strong> ${day.tip}
      </div>
    `;
  }

  panel.innerHTML = html;

  if (openExId) {
    const ex = findEx(openExId);
    if (ex) loadAndRenderLogs(ex);
  }
}

function renderExDetail(ex) {
  return `
    <div class="detail-grid">
      <div class="detail-card">
        <div class="dc-label">Rest between sets</div>
        <div class="dc-val">${ex.rest}</div>
        <div class="dc-hint">${ex.restHint || 'Set timer starts automatically when you finish a set.'}</div>
      </div>
      <div class="detail-card">
        <div class="dc-label">How to progress</div>
        <div class="dc-val">${ex.prog || 'Add weight or reps when possible.'}</div>
      </div>
    </div>

    <div class="set-tracker">
      <div class="st-label">Set Tracker</div>
      <div class="set-bubbles" id="bubbles-${ex.id}">
        ${renderBubbles(ex)}
      </div>
      <div class="st-progress" id="progress-text-${ex.id}">
        ${renderProgressText(ex)}
      </div>
    </div>

    <div class="rest-timer" id="timer-${ex.id}">
      <div class="rt-top">
        <div class="rt-label">⏱ Rest timer</div>
        <div class="rt-btns">
          <button class="rt-btn" onclick="resetTimer('${ex.id}', ${ex.restSec})">Reset</button>
          <button class="rt-btn" onclick="stopTimer(true)">Skip</button>
        </div>
      </div>
      <div class="rt-countdown" id="count-${ex.id}">0:00</div>
      <div class="rt-progress-bg">
        <div class="rt-progress-fill" id="fill-${ex.id}"></div>
      </div>
    </div>

    <div class="weight-log">
      <div class="wl-title">Log this session</div>
      <form class="wl-form" onsubmit="handleLogSubmit(event, '${ex.id}', '${ex.name}')">
        <div class="wl-field">
          <label>Weight (kg)</label>
          <input type="number" step="0.5" id="log-w-${ex.id}" placeholder="0" required>
        </div>
        <div class="wl-field">
          <label>Reps done</label>
          <input type="number" id="log-r-${ex.id}" placeholder="0" required>
        </div>
        <button type="submit" class="wl-submit" id="btn-${ex.id}">Save</button>
      </form>
      
      <div class="wl-history-label">Previous logs</div>
      <div class="wl-history" id="history-${ex.id}">
        <div class="empty-state">Loading history...</div>
      </div>
    </div>
  `;
}

// --- EXERCISE INTERACTIONS ---

function toggleEx(exId) {
  if (openExId === exId) {
    openExId = null;
  } else {
    openExId = exId;
  }
  renderDay();
  
  if (openExId) {
    setTimeout(() => {
      const el = document.getElementById(`ex-${exId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }
}

function findEx(id) {
  const prog = userProgram || PROGRAM;
  for (const day of prog.days) {
    for (const sec of day.sections) {
      const ex = sec.exercises.find(e => e.id === id);
      if (ex) return ex;
    }
  }
  return null;
}

// --- SET TRACKER ---

function renderBubbles(ex) {
  const doneSet = completedSets[ex.id] || new Set();
  let firstUndone = -1;
  let html = '';
  const numSets = parseInt(ex.numSets) || parseInt(ex.sets.split('×')[0]) || 3;

  for (let i = 1; i <= numSets; i++) {
    const isDone = doneSet.has(i);
    if (!isDone && firstUndone === -1) firstUndone = i;
    
    html += `
      <div class="set-bubble ${isDone ? 'done' : ''} ${firstUndone === i ? 'active-set' : ''}" 
           onclick="toggleSet('${ex.id}', ${i}, ${ex.restSec})">
        ${isDone ? '✓' : i}
      </div>
    `;
  }
  return html;
}

function renderProgressText(ex) {
  const doneSet = completedSets[ex.id] || new Set();
  const count = doneSet.size;
  const numSets = parseInt(ex.numSets) || parseInt(ex.sets.split('×')[0]) || 3;
  if (count === 0) return 'Tap a bubble when you finish a set';
  if (count >= numSets) return '🎯 All sets done! Great work.';
  return `<span>${count}</span> / ${numSets} sets done`;
}

function toggleSet(exId, setNum, restSec) {
  if (!completedSets[exId]) completedSets[exId] = new Set();
  const doneSet = completedSets[exId];

  if (doneSet.has(setNum)) {
    for (let i = setNum; i <= 20; i++) doneSet.delete(i);
    stopTimer(true);
  } else {
    doneSet.add(setNum);
    startTimer(exId, restSec);
  }

  const ex = findEx(exId);
  const bubbleCont = document.getElementById(`bubbles-${exId}`);
  const progCont = document.getElementById(`progress-text-${exId}`);
  if (bubbleCont) bubbleCont.innerHTML = renderBubbles(ex);
  if (progCont) progCont.innerHTML = renderProgressText(ex);
}

// --- TIMER LOGIC ---

function startTimer(exId, total) {
  stopTimer(false);
  
  timer.running = true;
  timer.exId = exId;
  timer.seconds = total;
  timer.total = total;

  const timerEl = document.getElementById(`timer-${exId}`);
  if (timerEl) timerEl.classList.add('visible');
  
  const floatEl = document.getElementById('float-timer');
  if (floatEl) {
    floatEl.classList.remove('done');
    floatEl.classList.add('show');
  }

  updateTimerUI();

  timer.interval = setInterval(() => {
    timer.seconds--;
    updateTimerUI();

    if (timer.seconds <= 0) {
      clearInterval(timer.interval);
      handleTimerEnd();
    }
  }, 1000);
}

function updateTimerUI() {
  const { seconds, total, exId } = timer;
  const formatted = formatTime(seconds);
  const percent = total > 0 ? ((total - seconds) / total) * 100 : 0;

  const countEl = document.getElementById(`count-${exId}`);
  const fillEl = document.getElementById(`fill-${exId}`);
  if (countEl) countEl.innerText = formatted;
  if (fillEl) fillEl.style.width = `${percent}%`;

  const ftTime = document.getElementById('ft-time');
  const ftFill = document.getElementById('ft-fill');
  if (ftTime) ftTime.innerText = formatted;
  if (ftFill) ftFill.style.width = `${percent}%`;
}

function formatTime(s) {
  if (s <= 0) return "Go! 🔥";
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return m > 0 ? `${m}:${rs.toString().padStart(2, '0')}` : `${rs}s`;
}

let ringingInterval = null;

function playBell() {
  stopRinging(); // Ensure no double ringing
  
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  
  const ring = () => {
    [261.63, 329.63, 392.00, 523.25].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.09;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.start(t);
      osc.stop(t + 1.2);
    });
  };

  ring();
  ringingInterval = setInterval(ring, 2000); // Ring every 2 seconds
}

function stopRinging() {
  if (ringingInterval) {
    clearInterval(ringingInterval);
    ringingInterval = null;
  }
}

function handleTimerEnd() {
  playBell();
  
  const { exId } = timer;
  const timerEl = document.getElementById(`timer-${exId}`);
  const floatEl = document.getElementById('float-timer');
  
  if (timerEl) {
    timerEl.classList.add('done');
    const countEl = document.getElementById(`count-${exId}`);
    if (countEl) countEl.innerText = "TIME'S UP! 🔔";
    
    // Change Skip to Stop Alarm
    const btns = timerEl.querySelector('.rt-btns');
    if (btns) {
      btns.innerHTML = `
        <button class="rt-btn btn-danger" style="background:var(--accent); color:var(--accent-text); border:none;" onclick="finalizeTimer()">STOP ALARM</button>
      `;
    }
  }
  
  if (floatEl) {
    floatEl.classList.add('done');
    const ftTime = document.getElementById('ft-time');
    if (ftTime) ftTime.innerText = "RINGING...";
    floatEl.querySelector('button').innerText = "STOP";
    floatEl.querySelector('button').onclick = finalizeTimer;
  }
}

function finalizeTimer() {
  stopRinging();
  
  const { exId } = timer;
  const timerEl = document.getElementById(`timer-${exId}`);
  const floatEl = document.getElementById('float-timer');

  if (timerEl) {
    document.getElementById(`count-${exId}`).innerText = "Go! 🔥";
    // Restore buttons
    const ex = findEx(exId);
    const btns = timerEl.querySelector('.rt-btns');
    if (btns) {
      btns.innerHTML = `
        <button class="rt-btn" onclick="resetTimer('${ex.id}', ${ex.restSec})">Reset</button>
        <button class="rt-btn" onclick="stopTimer(true)">Skip</button>
      `;
    }
  }

  if (floatEl) {
    document.getElementById('ft-time').innerText = "Go! 🔥";
    floatEl.querySelector('button').innerText = "Skip";
    floatEl.querySelector('button').onclick = () => stopTimer(true);
    
    setTimeout(() => {
      if (!timer.running && !ringingInterval) floatEl.classList.remove('show');
    }, 5000);
  }
}
