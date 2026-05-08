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
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed', err));
  }

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

function stopTimer(hideFloat) {
  clearInterval(timer.interval);
  timer.running = false;
  
  const oldExId = timer.exId;
  if (oldExId) {
    const timerEl = document.getElementById(`timer-${oldExId}`);
    if (timerEl) {
      timerEl.classList.remove('visible', 'done');
    }
  }

  const floatEl = document.getElementById('float-timer');
  if (hideFloat && floatEl) {
    floatEl.classList.remove('show');
  }
}

function resetTimer(exId, total) {
  startTimer(exId, total);
}

function buildFloatTimer() {
  const el = document.createElement('div');
  el.id = 'float-timer';
  el.className = 'float-timer';
  el.innerHTML = `
    <div class="ft-label">Resting</div>
    <div class="ft-time" id="ft-time">0:00</div>
    <div class="ft-progress-bg">
      <div class="ft-progress-fill" id="ft-fill"></div>
    </div>
    <button class="rt-btn" onclick="stopTimer(true)">Skip</button>
  `;
  document.body.appendChild(el);
}

// --- WEIGHT LOGGING ---

async function handleLogSubmit(e, exId, exName) {
  e.preventDefault();
  const btn = document.getElementById(`btn-${exId}`);
  const weightInput = document.getElementById(`log-w-${exId}`);
  const repsInput = document.getElementById(`log-r-${exId}`);
  
  const weight = parseFloat(weightInput.value);
  const reps = parseInt(repsInput.value);

  if (!weight || weight <= 0) {
    showToast("Please enter a valid weight", "error");
    return;
  }

  btn.disabled = true;
  btn.innerText = "Saving...";

  const newLog = {
    exercise_id: exId,
    exercise_name: exName,
    day_id: (userProgram || PROGRAM).days[activeDay].id,
    weight,
    reps,
    date: new Date().toISOString().split('T')[0]
  };

  try {
    if (sb) {
      const { error } = await sb.from('logs').insert([newLog]);
      if (error) throw error;
    } else {
      const logs = JSON.parse(localStorage.getItem('gymLogs') || '[]');
      logs.unshift({ ...newLog, id: Date.now().toString(), created_at: new Date().toISOString() });
      localStorage.setItem('gymLogs', JSON.stringify(logs));
    }

    showToast("Logged! 💪", "success");
    weightInput.value = "";
    repsInput.value = "";
    loadAndRenderLogs(findEx(exId));
  } catch (err) {
    console.error(err);
    showToast("Error saving log", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Save";
  }
}

async function loadAndRenderLogs(ex) {
  const container = document.getElementById(`history-${ex.id}`);
  if (!container) return;
  let logs = [];

  try {
    if (sb) {
      const { data, error } = await sb.from('logs')
        .select('*')
        .eq('exercise_id', ex.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      logs = data;
    } else {
      const allLogs = JSON.parse(localStorage.getItem('gymLogs') || '[]');
      logs = allLogs.filter(l => l.exercise_id === ex.id).slice(0, 8);
    }

    if (logs.length === 0) {
      container.innerHTML = '<div class="empty-state">No logs yet. Finish a set and save!</div>';
      return;
    }

    container.innerHTML = logs.map((log, i) => {
      const nextLog = logs[i + 1];
      let diffHtml = '';
      if (nextLog) {
        const diff = (log.weight - nextLog.weight).toFixed(1);
        const diffClass = diff > 0 ? 'up' : (diff < 0 ? 'down' : 'neutral');
        const sign = diff > 0 ? '+' : '';
        diffHtml = `<span class="wl-diff ${diffClass}">${sign}${diff}kg</span>`;
      }

      return `
        <div class="wl-entry">
          <div class="wl-date">${formatDate(log.date)}</div>
          <div class="wl-stats">
            ${diffHtml}
            <div class="wl-val">${log.weight}kg ${log.reps ? `× ${log.reps}` : ''}</div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    container.innerHTML = '<div class="empty-state">Error loading logs</div>';
  }
}

// --- PROGRAM EDITOR ---

function openProgramEditor() {
  document.getElementById('editor-overlay').classList.remove('hidden');
  renderEditor();
}

function closeProgramEditor() {
  document.getElementById('editor-overlay').classList.add('hidden');
}

function renderEditor() {
  const container = document.getElementById('editor-body');
  const prog = userProgram || PROGRAM;

  container.innerHTML = prog.days.map((day, di) => `
    <div class="edit-day-card">
      <div class="edit-field">
        <label>Day Name (e.g. Mon)</label>
        <input type="text" class="edit-input" value="${day.label}" onchange="updateDayField(${di}, 'label', this.value)">
      </div>
      <div class="edit-field">
        <label>Split Name (e.g. Chest & Tris)</label>
        <input type="text" class="edit-input" value="${day.tabName}" onchange="updateDayField(${di}, 'tabName', this.value)">
      </div>
      <div class="edit-field">
        <label>Full Title</label>
        <input type="text" class="edit-input" value="${day.title}" onchange="updateDayField(${di}, 'title', this.value)">
      </div>
      <div class="edit-field">
        <label>Day Tip (Leave empty to hide)</label>
        <textarea class="edit-input" onchange="updateDayField(${di}, 'tip', this.value)" rows="2">${day.tip || ''}</textarea>
      </div>
      
      <div style="margin-top:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div class="st-label" style="margin:0;">Exercises</div>
          <button class="rt-btn btn-sm" onclick="addExercise(${di})">+ Add Exercise</button>
        </div>
        
        <div class="edit-ex-header">
          <span>Exercise Name</span>
          <span>Sets</span>
          <span>RPE</span>
          <span>Rest(s)</span>
          <span>Progression</span>
          <span></span>
        </div>

        ${day.sections.map((sec, si) => 
          sec.exercises.map((ex, ei) => `
            <div class="edit-ex-row">
              <input type="text" class="edit-input" value="${ex.name}" onchange="updateExField(${di}, ${si}, ${ei}, 'name', this.value)" placeholder="Exercise Name">
              <input type="text" class="edit-input" value="${ex.sets}" onchange="updateExField(${di}, ${si}, ${ei}, 'sets', this.value)" placeholder="Sets (e.g. 3x10)">
              <input type="text" class="edit-input" value="${ex.rpe || ''}" onchange="updateExField(${di}, ${si}, ${ei}, 'rpe', this.value)" placeholder="RPE">
              <input type="number" class="edit-input" value="${ex.restSec}" onchange="updateExField(${di}, ${si}, ${ei}, 'restSec', this.value)" placeholder="Rest(s)">
              <input type="text" class="edit-input" value="${ex.prog || ''}" onchange="updateExField(${di}, ${si}, ${ei}, 'prog', this.value)" placeholder="How to progress">
              <button class="rt-btn btn-sm btn-remove" onclick="removeExercise(${di}, ${si}, ${ei})">✕</button>
            </div>
          `).join('')
        ).join('')}
      </div>
    </div>
  `).join('');
}

function updateDayField(di, field, val) {
  userProgram.days[di][field] = val;
}

function updateExField(di, si, ei, field, val) {
  if (field === 'restSec') val = parseInt(val) || 60;
  userProgram.days[di].sections[si].exercises[ei][field] = val;
  if (field === 'restSec') {
    userProgram.days[di].sections[si].exercises[ei].rest = `${val}s`;
  }
}

function addExercise(di) {
  const newEx = {
    id: 'ex-' + Date.now(),
    name: 'New Exercise',
    sets: '3 × 10',
    numSets: 3,
    rpe: 'RPE 7',
    rest: '60s',
    restSec: 60,
    prog: 'Add weight when possible.'
  };
  // Default to first section or create one
  if (!userProgram.days[di].sections || userProgram.days[di].sections.length === 0) {
    userProgram.days[di].sections = [{ label: 'Exercises', exercises: [] }];
  }
  userProgram.days[di].sections[0].exercises.push(newEx);
  renderEditor();
}

function removeExercise(di, si, ei) {
  userProgram.days[di].sections[si].exercises.splice(ei, 1);
  renderEditor();
}

async function saveProgram() {
  const btn = document.querySelector('.modal-footer .wl-submit');
  btn.disabled = true;
  btn.innerText = "Saving...";

  try {
    const { error } = await sb.from('user_programs')
      .update({ program_data: userProgram })
      .eq('user_id', (await sb.auth.getUser()).data.user.id);
    
    if (error) throw error;
    
    showToast("Program updated! 🔥", "success");
    closeProgramEditor();
    renderTabs();
    renderDay();
  } catch (err) {
    console.error(err);
    showToast("Failed to save program", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "Save Program";
  }
}

// --- HELPERS ---

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 2800);
}

function playBell() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
  } catch (e) {
    console.warn("Audio blocked");
  }
}
