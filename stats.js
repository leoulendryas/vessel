/**
 * stats.js - vessel Stats Page Logic
 */

let sb = null;
let allLogs = [];
let chart = null;
let authMode = 'login';
let userProgram = null;

document.addEventListener('DOMContentLoaded', async () => {
  initSupabase();
  
  if (sb) {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      showAuth();
    } else {
      await showApp(user);
    }
  } else {
    loadAllData();
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

// --- AUTH (Copied from app.js for consistency) ---

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
      showToast("Login failed! 🧐", "error");
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
  await loadAllData();
}

async function loadUserProgram() {
  try {
    const { data, error } = await sb.from('user_programs').select('program_data').maybeSingle();
    if (!error && data) userProgram = data.program_data;
  } catch (err) { console.error(err); }
}

async function handleLogout() {
  await sb.auth.signOut();
  location.reload();
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerText = msg;
  t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 2800);
}

// --- DATA LOADING ---

async function loadAllData() {
  try {
    if (sb) {
      const { data, error } = await sb.from('logs').select('*').order('date', { ascending: false });
      if (error) throw error;
      allLogs = data;
    } else {
      allLogs = JSON.parse(localStorage.getItem('gymLogs') || '[]');
    }

    if (allLogs.length === 0) {
      renderEmptyState();
      return;
    }

    renderSummary();
    renderChartSection();
    renderPRs();
    renderImproved();
    renderRecent();

  } catch (err) {
    console.error(err);
    document.getElementById('content').innerHTML = '<div class="empty-state">Error loading stats. Check your connection.</div>';
  }
}

function renderEmptyState() {
  const sections = ['summary-cards', 'progress-section', 'pr-section', 'improved-section', 'recent-section'];
  sections.forEach(id => document.getElementById(id).innerHTML = '');
  document.getElementById('summary-cards').innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1">
      No data yet. <a href="index.html">Go log your first workout!</a> 💪
    </div>
  `;
}

// --- SUMMARY CARDS ---

function renderSummary() {
  const daysLogged = new Set(allLogs.map(l => l.date)).size;
  
  // This week (last 7 days)
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }
  const thisWeekCount = new Set(allLogs.filter(l => last7Days.includes(l.date)).map(l => l.date)).size;

  const totalVolume = allLogs.reduce((sum, l) => sum + (l.weight * (l.reps || 1)), 0);
  const exTracked = new Set(allLogs.map(l => l.exercise_id)).size;

  document.getElementById('summary-cards').innerHTML = `
    <div class="stat-card highlight">
      <div class="sc-label">Days logged</div>
      <div class="sc-val">${daysLogged}</div>
      <div class="sc-sub">Total sessions</div>
    </div>
    <div class="stat-card">
      <div class="sc-label">This week</div>
      <div class="sc-val">${thisWeekCount}</div>
      <div class="sc-sub">Days active</div>
    </div>
    <div class="stat-card">
      <div class="sc-label">Total Volume</div>
      <div class="sc-val">${formatVolume(totalVolume)}</div>
      <div class="sc-sub">kg moved</div>
    </div>
    <div class="stat-card">
      <div class="sc-label">Exercises</div>
      <div class="sc-val">${exTracked}</div>
      <div class="sc-sub">Tracked</div>
    </div>
  `;
}

function formatVolume(v) {
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return v.toString();
}

// --- PROGRESS CHART ---

function renderChartSection() {
  const container = document.getElementById('progress-section');
  
  // Get all unique exercises that have logs
  const exIds = [...new Set(allLogs.map(l => l.exercise_id))];
  const exOptions = exIds.map(id => {
    const log = allLogs.find(l => l.exercise_id === id);
    return { id, name: log.exercise_name, count: allLogs.filter(l => l.exercise_id === id).length };
  }).sort((a, b) => b.count - a.count);

  container.innerHTML = `
    <div class="section-title">Progress over time</div>
    <div class="chart-card">
      <div class="chart-controls">
        <select id="ex-select" onchange="updateChart(this.value)">
          ${exOptions.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
        </select>
      </div>
      <canvas id="progChart"></canvas>
    </div>
  `;

  if (exOptions.length > 0) {
    updateChart(exOptions[0].id);
  }
}

function updateChart(exId) {
  const logs = allLogs.filter(l => l.exercise_id === exId);
  
  // Group by date, take max weight
  const grouped = {};
  logs.forEach(l => {
    if (!grouped[l.date] || l.weight > grouped[l.date]) {
      grouped[l.date] = l.weight;
    }
  });

  const sortedDates = Object.keys(grouped).sort();
  const data = sortedDates.map(d => grouped[d]);
  const labels = sortedDates.map(d => formatDateShort(d));

  if (chart) chart.destroy();

  const ctx = document.getElementById('progChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#CCFF00',
        backgroundColor: 'rgba(204,255,0,0.07)',
        borderWidth: 2,
        pointBackgroundColor: '#CCFF00',
        pointRadius: 4,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: '#444' },
          grid: { color: 'rgba(255,255,255,0.04)' }
        },
        y: {
          ticks: { color: '#444' },
          grid: { color: 'rgba(255,255,255,0.04)' }
        }
      }
    }
  });
}

// --- PRS ---

function renderPRs() {
  const container = document.getElementById('pr-section');
  
  const prs = {};
  allLogs.forEach(l => {
    if (!prs[l.exercise_id] || l.weight > prs[l.exercise_id].weight) {
      prs[l.exercise_id] = l;
    }
  });

  const sortedPrs = Object.values(prs).sort((a, b) => b.weight - a.weight);

  container.innerHTML = `
    <div class="section-title">Personal records 🏆</div>
    <div class="pr-card">
      ${sortedPrs.map(pr => `
        <div class="pr-item">
          <div class="pr-info">
            <div class="pr-name">${pr.exercise_name}</div>
            <div class="pr-tag">${getDayLabel(pr.day_id)}</div>
          </div>
          <div class="pr-stats">
            <div class="pr-val">${pr.weight}kg</div>
            <div class="pr-date">${formatDateShort(pr.date)}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- MOST IMPROVED ---

function renderImproved() {
  const container = document.getElementById('improved-section');
  
  const groups = {};
  allLogs.forEach(l => {
    if (!groups[l.exercise_id]) groups[l.exercise_id] = [];
    groups[l.exercise_id].push(l);
  });

  const improvements = [];
  Object.keys(groups).forEach(id => {
    const logs = groups[id].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (logs.length < 2) return;

    const first = logs[0].weight;
    const latest = logs[logs.length - 1].weight;
    const gain = latest - first;
    const pct = (gain / first) * 100;

    if (gain > 0) {
      improvements.push({ id, name: logs[0].exercise_name, gain, pct });
    }
  });

  if (improvements.length === 0) return;

  const sorted = improvements.sort((a, b) => b.pct - a.pct).slice(0, 5);
  const maxPct = Math.max(...sorted.map(s => s.pct));

  container.innerHTML = `
    <div class="section-title">Most improved 🚀</div>
    <div class="volume-card">
      ${sorted.map(s => `
        <div class="improved-item">
          <div class="improved-header">
            <div class="improved-name">${s.name}</div>
            <div class="improved-gain">+${s.gain.toFixed(1)}kg (+${s.pct.toFixed(0)}%)</div>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${(s.pct / maxPct) * 100}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// --- RECENT ACTIVITY ---

function renderRecent() {
  const container = document.getElementById('recent-section');
  const recent = allLogs.slice(0, 12);

  container.innerHTML = `
    <div class="section-title">Recent activity</div>
    <div class="recent-card">
      ${recent.map(l => `
        <div class="recent-item">
          <div class="recent-info">
            <div class="recent-name">${l.exercise_name}</div>
            <div class="recent-tag">${getDayLabel(l.day_id)}</div>
          </div>
          <div class="recent-stats">
            <div class="recent-val">${l.weight}kg ${l.reps ? `× ${l.reps}` : ''}</div>
            <div class="recent-date">${formatDateShort(l.date)}</div>
          </div>
        </div>
      `).join('')}
      <button class="clear-btn" onclick="clearAllData()">Clear all data</button>
    </div>
  `;
}

async function clearAllData() {
  if (!confirm("Are you sure? This will delete all your logged data forever.")) return;

  try {
    if (sb) {
      const { error } = await sb.from('logs').delete().neq('exercise_id', '0'); // Delete all
      if (error) throw error;
    } else {
      localStorage.removeItem('gymLogs');
    }
    location.reload();
  } catch (err) {
    alert("Error clearing data");
  }
}

// --- HELPERS ---

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function getDayLabel(dayId) {
  const day = PROGRAM.days.find(d => d.id === dayId);
  return day ? day.label : 'Workout';
}
