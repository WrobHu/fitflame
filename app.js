'use strict';

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════
const LEVELS = [
  { level: 1,  name: 'Nowicjusz',    xp: 0     },
  { level: 2,  name: 'Początkujący', xp: 200   },
  { level: 3,  name: 'Aktywny',      xp: 500   },
  { level: 4,  name: 'Regularny',    xp: 1000  },
  { level: 5,  name: 'Wojownik',     xp: 2000  },
  { level: 6,  name: 'Zaawansowany', xp: 3500  },
  { level: 7,  name: 'Atletyk',      xp: 5500  },
  { level: 8,  name: 'Mistrz',       xp: 8000  },
  { level: 9,  name: 'Ekspert',      xp: 11000 },
  { level: 10, name: 'Legenda',      xp: 15000 },
];

const BADGES = [
  { id: 'first_workout',  emoji: '🏋️', name: 'Pierwsze Kroki',    desc: 'Ukończ swój pierwszy trening' },
  { id: 'workouts_10',    emoji: '💪', name: 'Dekalog',            desc: 'Ukończ 10 treningów' },
  { id: 'workouts_50',    emoji: '🦁', name: 'Weteran',            desc: 'Ukończ 50 treningów' },
  { id: 'streak_gym_7',   emoji: '🔥', name: 'Tygodniowiec',       desc: '7 dni z rzędu na siłowni' },
  { id: 'streak_gym_30',  emoji: '⚡', name: 'Miesięcznik',         desc: '30 dni z rzędu na siłowni' },
  { id: 'streak_food_7',  emoji: '🥗', name: 'Czyste 7',           desc: '7 dni bez fast food z rzędu' },
  { id: 'streak_food_30', emoji: '🌿', name: 'Miesiąc bez Śmieci', desc: '30 dni bez fast food z rzędu' },
  { id: 'weight_goal',    emoji: '🎯', name: 'Cel Osiągnięty',     desc: 'Osiągnij swój cel wagowy' },
  { id: 'log_weight_30',  emoji: '📊', name: 'Skrupulatny',        desc: 'Zapisz wagę 30 razy' },
  { id: 'level_5',        emoji: '⚔️', name: 'Wojownik',           desc: 'Osiągnij poziom 5' },
  { id: 'level_10',       emoji: '👑', name: 'Legenda',            desc: 'Osiągnij poziom 10' },
  { id: 'volume_1000',    emoji: '🏆', name: 'Tona Stali',         desc: 'Podnieś 1000 kg w jednym treningu' },
];

const TEMPLATES = [
  { name: 'Push (Pchające)', emoji: '🫸', exercises: ['Wyciskanie sztangi', 'Wyciskanie hantli', 'Rozpiętki', 'Wyciskanie żołnierskie', 'Triceps wyciąg'] },
  { name: 'Pull (Ciągnące)', emoji: '🫷', exercises: ['Martwy ciąg', 'Wiosłowanie sztangą', 'Podciąganie', 'Biceps sztanga', 'Biceps młotkowy'] },
  { name: 'Nogi',            emoji: '🦵', exercises: ['Przysiady', 'Leg press', 'Wykroki', 'Uginanie nóg', 'Łydki'] },
  { name: 'Full Body',       emoji: '🌀', exercises: ['Przysiady', 'Wyciskanie sztangi', 'Martwy ciąg', 'Wiosłowanie', 'Overhead press'] },
  { name: 'Cardio + Core',   emoji: '🏃', exercises: ['Bieg/rower (min)', 'Plank (s)', 'Brzuszki', 'Hollow hold (s)', 'Burpees'] },
  { name: 'Własny',          emoji: '✏️', exercises: [] },
];

const QUOTES = [
  'Każdy trening przybliża Cię do celu!',
  'Ból jest tymczasowy, duma jest wieczna.',
  'Dzisiaj ciężko – jutro lżej.',
  'Twoje ciało może to zrobić. To umysł musisz przekonać.',
  'Nie ma drogi na skróty. Tylko ciężka praca!',
  'Rób to dla siebie.',
  'Jeszcze jeden dzień, jeszcze jeden krok.',
  'Jesteś silniejszy niż myślisz!',
  'Każdy mistrz był kiedyś początkującym.',
  'Konsekwencja bije motywację każdego dnia.',
  'Nie pytaj czy dasz radę – pytaj jak bardzo tego chcesz.',
  'Twój jedyny rywal to wczorajsza wersja Ciebie.',
  'Ciężkie treningi tworzą lekkie życie.',
  'Zacznij tam, gdzie jesteś. Użyj tego, co masz.',
];

const PL_DAYS   = ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'];
const PL_MONTHS = ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'];

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLabel(s) {
  const d = new Date(s + 'T00:00:00');
  return `${PL_DAYS[d.getDay()]}, ${d.getDate()} ${PL_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function shortDate(s) {
  const d = new Date(s + 'T00:00:00');
  return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}`;
}
function diffDays(a, b) {
  return Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000);
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ═══════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════
const Storage = {
  get(key, def = null) {
    try { const v = localStorage.getItem('ft_' + key); return v ? JSON.parse(v) : def; } catch { return def; }
  },
  set(key, val) { try { localStorage.setItem('ft_' + key, JSON.stringify(val)); } catch {} },
  getProfile() {
    return this.get('profile', { name: '', goalWeight: 80, startWeight: 80, height: 0, xp: 0, level: 1, lastOpenDate: '', joinDate: today(), weeklyGoal: 0 });
  },
  saveProfile(p) { this.set('profile', p); },
  getWorkouts()      { return this.get('workouts', []); },
  saveWorkouts(a)    { this.set('workouts', a); },
  getWeightLogs()    { return this.get('weight_logs', []); },
  saveWeightLogs(a)  { this.set('weight_logs', a); },
  getEatingLogs()    { return this.get('eating_logs', []); },
  saveEatingLogs(a)  { this.set('eating_logs', a); },
  getStreak(t)       { return this.get('streak_' + t, { current: 0, best: 0, lastDate: '' }); },
  saveStreak(t, s)   { this.set('streak_' + t, s); },
  getDailyState()    { return this.get('daily_state', { date: '', gymCheckedIn: false, foodCheckedIn: false, weightLogged: false }); },
  saveDailyState(s)  { this.set('daily_state', s); },
  getAchievements()  { return this.get('achievements', {}); },
  saveAchievements(a){ this.set('achievements', a); },
};

// ═══════════════════════════════════════════
// PROFILE & XP
// ═══════════════════════════════════════════
const ProfileMgr = {
  getLevelInfo(xp) {
    let info = LEVELS[0];
    for (const l of LEVELS) { if (xp >= l.xp) info = l; else break; }
    const nextIdx = LEVELS.indexOf(info) + 1;
    const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;
    return { ...info, next, xpInLevel: xp - info.xp, xpToNext: next ? next.xp - info.xp : 1 };
  },
  addXP(amount) {
    const p = Storage.getProfile();
    const oldXP = p.xp;
    p.xp = Math.max(0, p.xp + amount);
    const oldInfo = this.getLevelInfo(oldXP);
    const newInfo = this.getLevelInfo(p.xp);
    p.level = newInfo.level;
    Storage.saveProfile(p);
    if (amount > 0) Anim.xpPop(amount);
    if (newInfo.level > oldInfo.level) {
      setTimeout(() => Anim.levelUp(newInfo.level, newInfo.name), 800);
    }
    return p.xp;
  },
};

// ═══════════════════════════════════════════
// STREAK
// ═══════════════════════════════════════════
const StreakMgr = {
  evaluateOnOpen() {
    const t = today();
    const p = Storage.getProfile();
    if (p.lastOpenDate === t) return;
    for (const type of ['gym', 'food']) {
      const s = Storage.getStreak(type);
      if (s.lastDate && diffDays(s.lastDate, t) > 1) {
        s.current = 0;
        Storage.saveStreak(type, s);
      }
    }
    const ds = Storage.getDailyState();
    if (ds.date !== t) Storage.saveDailyState({ date: t, gymCheckedIn: false, foodCheckedIn: false, weightLogged: false });
    p.lastOpenDate = t;
    Storage.saveProfile(p);
  },
  checkIn(type) {
    const t = today();
    const ds = Storage.getDailyState();
    const key = type === 'gym' ? 'gymCheckedIn' : 'foodCheckedIn';
    if (ds[key]) return false;
    ds[key] = true; ds.date = t;
    Storage.saveDailyState(ds);
    const s = Storage.getStreak(type);
    s.current += 1;
    if (s.current > s.best) s.best = s.current;
    s.lastDate = t;
    Storage.saveStreak(type, s);
    return true;
  },
  undo(type) {
    const ds = Storage.getDailyState();
    const key = type === 'gym' ? 'gymCheckedIn' : 'foodCheckedIn';
    if (!ds[key]) return false;
    ds[key] = false;
    Storage.saveDailyState(ds);
    const s = Storage.getStreak(type);
    s.current = Math.max(0, s.current - 1);
    s.lastDate = s.current > 0 ? today() : '';
    Storage.saveStreak(type, s);
    // Remove eating log for today if food
    if (type === 'food') {
      const t = today();
      const logs = Storage.getEatingLogs().filter(l => l.date !== t);
      Storage.saveEatingLogs(logs);
    }
    return true;
  },
  isTodayCheckedIn(type) {
    const ds = Storage.getDailyState();
    return type === 'gym' ? ds.gymCheckedIn : ds.foodCheckedIn;
  },
  isTodayWeightLogged() { return Storage.getDailyState().weightLogged; },
  markWeightLogged() {
    const ds = Storage.getDailyState();
    ds.weightLogged = true;
    Storage.saveDailyState(ds);
  },
};

// ═══════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════
const AchievMgr = {
  check() {
    const unlocked  = Storage.getAchievements();
    const workouts  = Storage.getWorkouts();
    const wLogs     = Storage.getWeightLogs();
    const profile   = Storage.getProfile();
    const gymS      = Storage.getStreak('gym');
    const foodS     = Storage.getStreak('food');
    const levelInfo = ProfileMgr.getLevelInfo(profile.xp);

    const toCheck = [
      { id: 'first_workout',  cond: workouts.length >= 1 },
      { id: 'workouts_10',    cond: workouts.length >= 10 },
      { id: 'workouts_50',    cond: workouts.length >= 50 },
      { id: 'streak_gym_7',   cond: gymS.current >= 7 || gymS.best >= 7 },
      { id: 'streak_gym_30',  cond: gymS.current >= 30 || gymS.best >= 30 },
      { id: 'streak_food_7',  cond: foodS.current >= 7 || foodS.best >= 7 },
      { id: 'streak_food_30', cond: foodS.current >= 30 || foodS.best >= 30 },
      { id: 'log_weight_30',  cond: wLogs.length >= 30 },
      { id: 'level_5',        cond: levelInfo.level >= 5 },
      { id: 'level_10',       cond: levelInfo.level >= 10 },
      { id: 'weight_goal',    cond: (() => {
          if (!wLogs.length) return false;
          const last = wLogs[wLogs.length - 1].kg;
          const goal = profile.goalWeight, start = profile.startWeight;
          if (start > goal) return last <= goal;
          if (start < goal) return last >= goal;
          return false;
        })()
      },
      { id: 'volume_1000', cond: workouts.some(w =>
          w.exercises.reduce((s, e) => s + e.sets.reduce((ss, st) => ss + st.reps * (st.kg||0), 0), 0) >= 1000
        )
      },
    ];

    const queue = [];
    for (const { id, cond } of toCheck) {
      if (cond && !unlocked[id]) { unlocked[id] = { unlockedAt: today() }; queue.push(id); }
    }
    if (queue.length) {
      Storage.saveAchievements(unlocked);
      let i = 0;
      const showNext = () => { if (i < queue.length) Anim.badgeUnlock(queue[i++], showNext); };
      showNext();
    }
  },
};

// ═══════════════════════════════════════════
// ANIMATIONS
// ═══════════════════════════════════════════
const Anim = {
  xpPop(amount) {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.textContent = '+' + amount + ' XP';
    el.style.left = (Math.random() * 50 + 25) + '%';
    el.style.top  = '35%';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  },
  ripple(e, btn) {
    const rect = btn.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x - size/2}px;top:${y - size/2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  },
  confetti() {
    const colors = ['#58cc02','#ffd900','#ff9600','#1cb0f6','#ff4b4b','#ce82ff','#ffffff'];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      const size = Math.random() * 8 + 5;
      el.style.setProperty('--tx',  (Math.random() * 280 - 140) + 'px');
      el.style.setProperty('--ty',  (Math.random() * 250 + 80)  + 'px');
      el.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      el.style.setProperty('--dur', (Math.random() * 0.7 + 0.8) + 's');
      el.style.left       = (Math.random() * 100) + '%';
      el.style.top        = (Math.random() * 30 + 15) + '%';
      el.style.width      = size + 'px';
      el.style.height     = (Math.random() > 0.5 ? size : size * 0.4) + 'px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1700);
    }
  },
  countUp(el, target, duration = 500) {
    const start = parseInt(el.textContent) || 0;
    if (start === target) return;
    const startTime = performance.now();
    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(start + (target - start) * ease);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
    el.classList.remove('counting');
    void el.offsetWidth;
    el.classList.add('counting');
    setTimeout(() => el.classList.remove('counting'), 500);
  },
  levelUp(level, name) {
    document.getElementById('levelup-title').textContent = 'Poziom ' + level + '!';
    document.getElementById('levelup-sub').textContent   = 'Gratulacje! Jesteś teraz: ' + name;
    document.getElementById('levelup-overlay').classList.add('show');
    this.confetti();
  },
  badgeUnlock(id, onClose) {
    const badge = BADGES.find(b => b.id === id);
    if (!badge) { if (onClose) onClose(); return; }
    document.getElementById('badge-popup-emoji').textContent = badge.emoji;
    document.getElementById('badge-popup-name').textContent  = badge.name;
    document.getElementById('badge-popup-desc').textContent  = badge.desc;
    const el = document.getElementById('badge-overlay');
    el.classList.add('show');
    el._onClose = onClose;
    this.confetti();
  },
  toast(msg, ms = 2800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms);
  },
};

// ═══════════════════════════════════════════
// WEEKLY GOAL HELPERS
// ═══════════════════════════════════════════
function getWeekStart(date) {
  const d = new Date(date + 'T00:00:00');
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day); // Monday start
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

function workoutsThisWeek() {
  const ws = getWeekStart(today());
  return Storage.getWorkouts().filter(w => w.date >= ws).length;
}

// ═══════════════════════════════════════════
// RENDERS
// ═══════════════════════════════════════════
function renderHome() {
  const profile  = Storage.getProfile();
  const info     = ProfileMgr.getLevelInfo(profile.xp);
  const gymS     = Storage.getStreak('gym');
  const foodS    = Storage.getStreak('food');
  const workouts = Storage.getWorkouts();
  const wLogs    = Storage.getWeightLogs();
  const d = new Date();

  // Header
  document.getElementById('home-greeting').textContent = 'Cześć, ' + (profile.name || 'Ty') + '! 🔥';
  document.getElementById('home-date').textContent     = PL_DAYS[d.getDay()] + ', ' + d.getDate() + ' ' + PL_MONTHS[d.getMonth()];
  document.getElementById('home-avatar').textContent   = initials(profile.name);

  // XP bar
  const pct = info.next ? Math.round((info.xpInLevel / info.xpToNext) * 100) : 100;
  document.getElementById('xp-level-name').textContent = info.name;
  document.getElementById('xp-value').textContent      = profile.xp + (info.next ? ' / ' + info.next.xp + ' XP' : ' XP MAX');
  document.getElementById('xp-fill').style.width       = pct + '%';

  // Streaks (animated count-up)
  const gymNumEl  = document.getElementById('streak-gym-num');
  const foodNumEl = document.getElementById('streak-food-num');
  const prevGym   = parseInt(gymNumEl.textContent) || 0;
  const prevFood  = parseInt(foodNumEl.textContent) || 0;
  if (prevGym  !== gymS.current)  Anim.countUp(gymNumEl,  gymS.current);
  else gymNumEl.textContent  = gymS.current;
  if (prevFood !== foodS.current) Anim.countUp(foodNumEl, foodS.current);
  else foodNumEl.textContent = foodS.current;

  const gymCard  = document.getElementById('streak-gym-card');
  const foodCard = document.getElementById('streak-food-card');
  gymCard.classList.toggle('active-today', StreakMgr.isTodayCheckedIn('gym'));
  foodCard.classList.toggle('active-today', StreakMgr.isTodayCheckedIn('food'));
  document.getElementById('streak-gym-sub').textContent  = gymS.best > gymS.current && gymS.best > 0 ? '🏆 Rekord: ' + gymS.best : 'dni z rzędu';
  document.getElementById('streak-food-sub').textContent = foodS.best > foodS.current && foodS.best > 0 ? '🏆 Rekord: ' + foodS.best : 'dni z rzędu';

  // Weekly goal ring
  const wg = profile.weeklyGoal || 0;
  const wgCard = document.getElementById('weekly-goal-card');
  if (wg > 0) {
    wgCard.style.display = 'flex';
    const done = workoutsThisWeek();
    const circumference = 2 * Math.PI * 24;
    const offset = circumference * (1 - Math.min(done / wg, 1));
    document.getElementById('wg-ring-fill').style.strokeDasharray  = circumference;
    document.getElementById('wg-ring-fill').style.strokeDashoffset = offset;
    document.getElementById('wg-ring-text').textContent = done + '/' + wg;
    document.getElementById('wg-title').textContent = done >= wg ? '🎉 Cel osiągnięty!' : 'Cel tygodniowy';
    document.getElementById('wg-sub').textContent   = done >= wg
      ? 'Świetna robota w tym tygodniu!'
      : `Zostało ${wg - done} ${wg - done === 1 ? 'trening' : 'treningi'} do celu`;
  } else {
    wgCard.style.display = 'none';
  }

  // Check-in buttons
  const gymDone  = StreakMgr.isTodayCheckedIn('gym');
  const foodDone = StreakMgr.isTodayCheckedIn('food');
  const gymBtn   = document.getElementById('checkin-gym');
  const foodBtn  = document.getElementById('checkin-food');
  gymBtn.className  = 'checkin-btn ripple-host' + (gymDone ? ' done' : '');
  foodBtn.className = 'checkin-btn ripple-host' + (foodDone ? ' done-food' : '');
  document.getElementById('checkin-gym-check').textContent  = gymDone  ? '✅' : '○';
  document.getElementById('checkin-food-check').textContent = foodDone ? '✅' : '○';
  gymBtn.disabled  = false; // always clickable (for undo)
  foodBtn.disabled = false;

  // Stats
  document.getElementById('stat-workouts').textContent    = workouts.length;
  document.getElementById('stat-best-streak').textContent = Math.max(gymS.best, foodS.best);
  const lastW = wLogs.length ? wLogs[wLogs.length - 1].kg : null;
  document.getElementById('stat-weight').textContent = lastW ? lastW + '' : '—';

  // Quote
  const dayOfYear = Math.floor((Date.now() - new Date(d.getFullYear(),0,0)) / 86400000);
  document.getElementById('quote-text').textContent = QUOTES[dayOfYear % QUOTES.length];

  // Break banner: show if last open was 2+ days ago
  const lastOpen = profile.lastOpenDate;
  const showBanner = lastOpen && diffDays(lastOpen, today()) >= 2;
  document.getElementById('break-banner').style.display = showBanner ? 'flex' : 'none';
}

let weightChart = null;

function renderWeight() {
  const profile = Storage.getProfile();
  const logs    = Storage.getWeightLogs();
  const last    = logs.length ? logs[logs.length - 1] : null;

  document.getElementById('weight-current-val').textContent  = last ? last.kg : '—';
  document.getElementById('weight-current-date').textContent = last ? 'Pomiar: ' + dateLabel(last.date) : 'brak pomiaru';

  const start = profile.startWeight;
  const goal  = profile.goalWeight;
  const curr  = last ? last.kg : start;
  let pct = 0;
  if (start !== goal) pct = Math.max(0, Math.min(100, Math.round(Math.abs(curr - start) / Math.abs(goal - start) * 100)));
  document.getElementById('goal-fill').style.width   = pct + '%';
  document.getElementById('goal-pct').textContent    = pct + '%';
  document.getElementById('goal-start-lbl').textContent = start + ' kg';
  document.getElementById('goal-end-lbl').textContent   = goal  + ' kg';

  document.getElementById('wstat-start').textContent = start + ' kg';
  document.getElementById('wstat-goal').textContent  = goal  + ' kg';
  if (last) {
    const delta = +(last.kg - start).toFixed(1);
    document.getElementById('wstat-delta').textContent = (delta > 0 ? '+' : '') + delta + ' kg';
    document.getElementById('wstat-delta').style.color = (goal < start)
      ? (delta < 0 ? 'var(--green)' : 'var(--danger)')
      : (delta > 0 ? 'var(--green)' : 'var(--danger)');
  } else {
    document.getElementById('wstat-delta').textContent = '—';
  }

  const last30  = logs.slice(-30);
  const labels  = last30.map(l => shortDate(l.date));
  const data    = last30.map(l => l.kg);
  const ctx = document.getElementById('weight-chart').getContext('2d');
  if (weightChart) weightChart.destroy();
  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#58cc02',
        backgroundColor: 'rgba(88,204,2,0.15)',
        borderWidth: 3,
        pointRadius: data.length < 15 ? 5 : 3,
        pointBackgroundColor: '#58cc02',
        tension: 0.4, fill: true,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => c.parsed.y + ' kg' }, backgroundColor: '#242424', titleColor: '#f0f0f0', bodyColor: '#f0f0f0', borderColor: '#2e2e2e', borderWidth: 1 },
      },
      scales: {
        x: { grid: { display: false }, ticks: { maxTicksLimit: 7, font: { size: 11 }, color: '#777' } },
        y: { grid: { color: '#242424' }, ticks: { callback: v => v + ' kg', font: { size: 11 }, color: '#777' } },
      },
    },
  });
}

function renderAchievements() {
  const profile  = Storage.getProfile();
  const info     = ProfileMgr.getLevelInfo(profile.xp);
  const unlocked = Storage.getAchievements();
  const workouts = Storage.getWorkouts();
  const gymS     = Storage.getStreak('gym');
  const foodS    = Storage.getStreak('food');

  // Ring (r=58 → circumference = 2π×58 ≈ 364.4)
  const circumference = 2 * Math.PI * 58;
  const pct    = info.next ? info.xpInLevel / info.xpToNext : 1;
  const offset = circumference * (1 - pct);
  document.getElementById('ring-fill').style.strokeDasharray  = circumference;
  document.getElementById('ring-fill').style.strokeDashoffset = offset;
  document.getElementById('ring-level').textContent       = info.level;
  document.getElementById('level-name-display').textContent = info.name;
  document.getElementById('level-xp-sub').textContent     = info.next
    ? profile.xp + ' / ' + info.next.xp + ' XP do następnego poziomu'
    : '🏆 Maksymalny poziom!';

  const grid = document.getElementById('badge-grid');
  grid.innerHTML = '';
  for (const b of BADGES) {
    const isUnlocked = !!unlocked[b.id];
    const div = document.createElement('div');
    div.className = 'badge-card ' + (isUnlocked ? 'unlocked' : 'locked');
    div.innerHTML = `<span class="badge-emoji">${b.emoji}</span><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div>${isUnlocked ? `<div class="badge-unlock-date">🗓 ${unlocked[b.id].unlockedAt}</div>` : ''}`;
    grid.appendChild(div);
  }

  const totalVol = workouts.reduce((s, w) =>
    s + w.exercises.reduce((s2, e) => s2 + e.sets.reduce((s3, st) => s3 + st.reps * (st.kg||0), 0), 0), 0);
  document.getElementById('achiev-stats').innerHTML = `
    <div class="achiev-stat"><strong>${workouts.length}</strong><span>Treningów</span></div>
    <div class="achiev-stat"><strong>${Math.round(totalVol)} kg</strong><span>Łączna objętość</span></div>
    <div class="achiev-stat"><strong>${gymS.best}</strong><span>Rekord siłownia</span></div>
    <div class="achiev-stat"><strong>${foodS.best}</strong><span>Rekord jedzenie</span></div>
  `;
}

let historyOffset = 0;
const HISTORY_PAGE = 15;

function renderHistory(reset = true) {
  if (reset) historyOffset = 0;
  const workouts  = Storage.getWorkouts().slice().reverse();
  const wLogs     = Storage.getWeightLogs().slice().reverse();
  const eLogs     = Storage.getEatingLogs().slice().reverse();
  const container = document.getElementById('history-list');
  if (reset) container.innerHTML = '';

  const byDate = {};
  const add = (date, item) => { if (!byDate[date]) byDate[date] = []; byDate[date].push(item); };
  workouts.forEach(w => add(w.date, { type: 'workout', data: w }));
  wLogs.forEach(l   => add(l.date, { type: 'weight',  data: l }));
  eLogs.forEach(l   => add(l.date, { type: 'food',    data: l }));

  const dates = Object.keys(byDate).sort().reverse();
  if (!dates.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-state-emoji">📋</span><div class="empty-state-title">Brak historii</div><div class="empty-state-sub">Zacznij trenować, żeby zobaczyć historię!</div></div>`;
    document.getElementById('load-more-wrap').style.display = 'none';
    return;
  }

  const slice = dates.slice(historyOffset, historyOffset + HISTORY_PAGE);
  const moodEmoji = { bad: '😴', good: '💪', fire: '🔥' };

  for (const date of slice) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'history-day';
    dayDiv.innerHTML = `<div class="history-day-header">${dateLabel(date)}</div>`;

    for (const item of byDate[date]) {
      if (item.type === 'workout') {
        const w    = item.data;
        const sets = w.exercises.reduce((s, e) => s + e.sets.length, 0);
        const vol  = w.exercises.reduce((s, e) => s + e.sets.reduce((ss, st) => ss + st.reps * (st.kg||0), 0), 0);
        const el   = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
          <div class="history-item-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="history-item-icon">🏋️</span>
            <div class="history-item-info">
              <div class="history-item-title">${w.name || 'Trening'}${w.mood ? ' <span class="history-mood">' + moodEmoji[w.mood] + '</span>' : ''}</div>
              <div class="history-item-sub">${w.exercises.length} ćwiczeń • ${sets} serii • ${Math.round(vol)} kg</div>
            </div>
            <span class="history-expand-icon">▼</span>
          </div>
          <div class="history-item-body">
            ${w.exercises.map(e => `
              <div class="history-exercise">
                <div class="history-ex-name">${e.name || '—'}</div>
                <div class="history-sets">${e.sets.map((s,i) => `<span class="history-set-chip">${i+1}. ${s.reps}×${s.kg||0}kg</span>`).join('')}</div>
              </div>
            `).join('<div class="history-divider"></div>')}
            ${w.note ? `<div class="history-note">📝 ${w.note}</div>` : ''}
          </div>`;
        dayDiv.appendChild(el);
      } else if (item.type === 'weight') {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `<div class="history-item-header"><span class="history-item-icon">⚖️</span><div class="history-item-info"><div class="history-item-title">Pomiar wagi: ${item.data.kg} kg</div><div class="history-item-sub">Waga ciała</div></div></div>`;
        dayDiv.appendChild(el);
      } else if (item.type === 'food') {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `<div class="history-item-header"><span class="history-item-icon">🥗</span><div class="history-item-info"><div class="history-item-title">Dzień bez fast food ✅</div><div class="history-item-sub">Czyste jedzenie</div></div></div>`;
        dayDiv.appendChild(el);
      }
    }
    container.appendChild(dayDiv);
  }

  historyOffset += slice.length;
  document.getElementById('load-more-wrap').style.display = historyOffset < dates.length ? 'block' : 'none';
}

function renderProfile() {
  const profile  = Storage.getProfile();
  const info     = ProfileMgr.getLevelInfo(profile.xp);
  const wLogs    = Storage.getWeightLogs();
  const d = new Date(profile.joinDate + 'T00:00:00');

  const avatarBig = document.getElementById('profile-avatar-big');
  avatarBig.textContent = initials(profile.name);
  document.getElementById('profile-name-big').textContent = profile.name || '—';
  document.getElementById('profile-join').textContent     = 'Dołączył: ' + (profile.joinDate ? d.getDate() + ' ' + PL_MONTHS[d.getMonth()] + ' ' + d.getFullYear() : '—');
  document.getElementById('profile-level-badge').innerHTML = `⚡ Poziom ${info.level} — ${info.name}`;

  // BMI
  const lastKg = wLogs.length ? wLogs[wLogs.length - 1].kg : 0;
  const h = profile.height || 0;
  if (h > 0 && lastKg > 0) {
    const bmi = +(lastKg / ((h/100) ** 2)).toFixed(1);
    let label = '', desc = '', color = 'var(--text)';
    if (bmi < 18.5) { label = 'Niedowaga';     desc = 'Poniżej normy';       color = 'var(--blue)'; }
    else if (bmi < 25) { label = 'Norma ✅';   desc = 'Prawidłowa waga';     color = 'var(--green)'; }
    else if (bmi < 30) { label = 'Nadwaga';     desc = 'Nieznacznie powyżej'; color = 'var(--streak)'; }
    else               { label = 'Otyłość';     desc = 'Znacznie powyżej';    color = 'var(--danger)'; }
    document.getElementById('bmi-number').textContent = bmi;
    document.getElementById('bmi-number').style.color = color;
    document.getElementById('bmi-label').textContent  = label;
    document.getElementById('bmi-desc').textContent   = desc;
  } else {
    document.getElementById('bmi-number').textContent = '—';
    document.getElementById('bmi-label').textContent  = 'Uzupełnij wzrost';
    document.getElementById('bmi-desc').textContent   = 'Podaj wzrost w ustawieniach poniżej';
  }

  // Pre-fill edit form
  document.getElementById('p-name').value   = profile.name || '';
  document.getElementById('p-height').value = profile.height || '';
  document.getElementById('p-goal').value   = profile.goalWeight || '';

  // Weekly goal selector
  const wgSel = document.getElementById('wg-selector');
  wgSel.innerHTML = '';
  for (let i = 1; i <= 7; i++) {
    const btn = document.createElement('button');
    btn.className = 'wg-btn' + (profile.weeklyGoal === i ? ' selected' : '');
    btn.textContent = i + 'x';
    btn.onclick = () => {
      document.querySelectorAll('.wg-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const p = Storage.getProfile();
      p.weeklyGoal = i;
      Storage.saveProfile(p);
      Anim.toast('🎯 Cel: ' + i + 'x w tygodniu');
    };
    wgSel.appendChild(btn);
  }

  // Activity calendar (last 8 weeks)
  renderActivityCalendar();
}

function renderActivityCalendar() {
  const workouts  = Storage.getWorkouts();
  const eLogs     = Storage.getEatingLogs();
  const t         = today();
  const cal       = document.getElementById('activity-calendar');
  cal.innerHTML   = '';

  // Build date sets
  const workoutDates = new Set(workouts.map(w => w.date));
  const foodDates    = new Set(eLogs.map(l => l.date));

  // 56 days back from today (8 weeks), column = week, row = day
  const days = [];
  for (let i = 55; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  // Group into 8 columns of 7
  for (let w = 0; w < 8; w++) {
    const col = document.createElement('div');
    col.className = 'calendar-week';
    for (let d = 0; d < 7; d++) {
      const date = days[w * 7 + d];
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      const hasW = workoutDates.has(date);
      const hasF = foodDates.has(date);
      if (hasW && hasF) cell.classList.add('has-both');
      else if (hasW)    cell.classList.add('has-workout');
      else if (hasF)    cell.classList.add('has-food');
      if (date === t)   cell.classList.add('today');
      col.appendChild(cell);
    }
    cal.appendChild(col);
  }
}

// ═══════════════════════════════════════════
// WORKOUT SCREEN
// ═══════════════════════════════════════════
let currentWorkout = null;
let undoGymTimer   = null;
let undoFoodTimer  = null;
let pendingMoodCb  = null;

function renderWorkoutScreen() {
  const todayWorkouts = Storage.getWorkouts().filter(w => w.date === today());
  if (todayWorkouts.length > 0 && !currentWorkout) {
    showWorkoutSummary(todayWorkouts[todayWorkouts.length - 1]);
  } else if (currentWorkout) {
    document.getElementById('workout-today-summary').style.display = 'none';
    document.getElementById('workout-builder').style.display = 'block';
    renderWorkoutBuilder();
  } else {
    document.getElementById('workout-today-summary').style.display = 'none';
    document.getElementById('workout-builder').style.display = 'block';
    renderWorkoutBuilder();
  }
  renderTemplatesGrid();
}

function showWorkoutSummary(w) {
  document.getElementById('workout-today-summary').style.display = 'block';
  document.getElementById('workout-builder').style.display = 'none';
  const sets = w.exercises.reduce((s, e) => s + e.sets.length, 0);
  const vol  = w.exercises.reduce((s, e) => s + e.sets.reduce((ss, st) => ss + st.reps * (st.kg||0), 0), 0);
  document.getElementById('workout-summary-stats').innerHTML = `
    <div class="summary-stat"><strong>${w.exercises.length}</strong><span>ćwiczeń</span></div>
    <div class="summary-stat"><strong>${sets}</strong><span>serii</span></div>
    <div class="summary-stat"><strong>${Math.round(vol)}</strong><span>kg</span></div>
    ${w.mood ? `<div class="summary-stat"><strong style="font-size:28px">${{bad:'😴',good:'💪',fire:'🔥'}[w.mood]}</strong><span>samopoczucie</span></div>` : ''}
  `;
}

function renderWorkoutBuilder() {
  if (!currentWorkout) currentWorkout = { id: uid(), date: today(), name: '', exercises: [] };
  document.getElementById('workout-name').value = currentWorkout.name || '';
  document.getElementById('workout-note').value = currentWorkout.note || '';
  renderExercisesList();
}

function renderExercisesList() {
  const container = document.getElementById('exercises-list');
  container.innerHTML = '';
  if (!currentWorkout) return;
  currentWorkout.exercises.forEach((ex, ei) => {
    const lastKg = getLastKgForExercise(ex.name);
    const div = document.createElement('div');
    div.className = 'exercise-block';
    div.innerHTML = `
      <div class="exercise-header">
        <input class="input input-sm exercise-name-input" type="text"
          placeholder="Nazwa ćwiczenia" value="${ex.name || ''}"
          oninput="App._exNameChange(${ei}, this.value)">
        <button class="btn-icon" onclick="App._removeExercise(${ei})">✕</button>
      </div>
      <table class="sets-table">
        <thead><tr><th>#</th><th>Powt.</th><th>Kg</th><th></th></tr></thead>
        <tbody id="sets-${ei}">
          ${ex.sets.map((s, si) => setRowHtml(ei, si, s, lastKg)).join('')}
        </tbody>
      </table>
      <button class="add-set-btn" onclick="App._addSet(${ei})">➕ Dodaj serię</button>
    `;
    container.appendChild(div);
  });
}

function setRowHtml(ei, si, s, lastKg) {
  return `<tr class="set-row">
    <td><span class="set-num">${si+1}</span></td>
    <td><input class="set-input" type="number" inputmode="numeric"  min="1" max="999" value="${s.reps||''}" placeholder="10"
         oninput="App._setVal(${ei},${si},'reps',this.value)"></td>
    <td><input class="set-input" type="number" inputmode="decimal" min="0" max="999" step="0.5" value="${s.kg!==undefined&&s.kg!==''?s.kg:''}" placeholder="${lastKg||'0'}"
         oninput="App._setVal(${ei},${si},'kg',this.value)"></td>
    <td><button class="btn-icon" style="width:28px;height:28px;font-size:11px" onclick="App._removeSet(${ei},${si})">✕</button></td>
  </tr>`;
}

function getLastKgForExercise(name) {
  if (!name) return '';
  const n = name.trim().toLowerCase();
  const all = Storage.getWorkouts();
  for (let i = all.length - 1; i >= 0; i--) {
    const ex = all[i].exercises.find(e => (e.name||'').trim().toLowerCase() === n);
    if (ex && ex.sets.length) return ex.sets[ex.sets.length - 1].kg;
  }
  return '';
}

function renderTemplatesGrid() {
  const grid = document.getElementById('templates-grid');
  grid.innerHTML = '';
  TEMPLATES.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'template-btn';
    btn.innerHTML = `<span class="template-emoji">${t.emoji}</span>${t.name}`;
    btn.onclick = () => App.useTemplate(i);
    grid.appendChild(btn);
  });
}

// ═══════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════
function initSetup() {
  const profile = Storage.getProfile();
  if (profile.name) {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
    boot();
  } else {
    document.getElementById('setup-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }
}

// ═══════════════════════════════════════════
// APP OBJECT
// ═══════════════════════════════════════════
const App = {
  navigate(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'slide-in'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    const el = document.getElementById('screen-' + screen);
    el.classList.add('active');
    document.getElementById('tab-' + screen).classList.add('active');

    if (screen === 'home')         renderHome();
    if (screen === 'workout')      renderWorkoutScreen();
    if (screen === 'weight')       renderWeight();
    if (screen === 'achievements') renderAchievements();
    if (screen === 'history')      renderHistory(true);
    if (screen === 'profile')      renderProfile();
  },

  checkInGym(e) {
    const btn = document.getElementById('checkin-gym');
    if (StreakMgr.isTodayCheckedIn('gym')) return; // already done, click does nothing
    if (e) Anim.ripple(e, btn);
    const done = StreakMgr.checkIn('gym');
    if (!done) return;
    ProfileMgr.addXP(50);
    const s = Storage.getStreak('gym');
    if (s.current === 7)  setTimeout(() => ProfileMgr.addXP(100), 600);
    if (s.current === 30) setTimeout(() => ProfileMgr.addXP(200), 600);
    document.getElementById('streak-gym-card').classList.add('bounce');
    setTimeout(() => document.getElementById('streak-gym-card').classList.remove('bounce'), 500);
    renderHome();
    AchievMgr.check();
    Anim.toast('🏋️ Streak siłownia: ' + s.current + ' ' + (s.current === 1 ? 'dzień' : 'dni') + '!');
    // Show undo for 30s
    const undoBtn = document.getElementById('undo-gym');
    undoBtn.style.display = 'block';
    clearTimeout(undoGymTimer);
    undoGymTimer = setTimeout(() => { undoBtn.style.display = 'none'; }, 30000);
  },

  checkInFood(e) {
    const btn = document.getElementById('checkin-food');
    if (StreakMgr.isTodayCheckedIn('food')) return;
    if (e) Anim.ripple(e, btn);
    const done = StreakMgr.checkIn('food');
    if (!done) return;
    // Save eating log
    const eLogs = Storage.getEatingLogs();
    if (!eLogs.find(l => l.date === today())) {
      eLogs.push({ id: uid(), date: today(), clean: true });
      Storage.saveEatingLogs(eLogs);
    }
    ProfileMgr.addXP(20);
    const s = Storage.getStreak('food');
    if (s.current === 7)  setTimeout(() => ProfileMgr.addXP(100), 600);
    if (s.current === 30) setTimeout(() => ProfileMgr.addXP(200), 600);
    document.getElementById('streak-food-card').classList.add('bounce');
    setTimeout(() => document.getElementById('streak-food-card').classList.remove('bounce'), 500);
    renderHome();
    AchievMgr.check();
    Anim.toast('🥗 Streak jedzenie: ' + s.current + ' ' + (s.current === 1 ? 'dzień' : 'dni') + '!');
    const undoBtn = document.getElementById('undo-food');
    undoBtn.style.display = 'block';
    clearTimeout(undoFoodTimer);
    undoFoodTimer = setTimeout(() => { undoBtn.style.display = 'none'; }, 30000);
  },

  undoGym() {
    StreakMgr.undo('gym');
    ProfileMgr.addXP(-50);
    document.getElementById('undo-gym').style.display = 'none';
    clearTimeout(undoGymTimer);
    renderHome();
    Anim.toast('↩️ Cofnięto check-in siłowni');
  },

  undoFood() {
    StreakMgr.undo('food');
    ProfileMgr.addXP(-20);
    document.getElementById('undo-food').style.display = 'none';
    clearTimeout(undoFoodTimer);
    renderHome();
    Anim.toast('↩️ Cofnięto check-in jedzenia');
  },

  logWeight() {
    const val = parseFloat(document.getElementById('weight-input').value);
    if (!val || val < 20 || val > 400) { Anim.toast('⚠️ Podaj poprawną wagę'); return; }
    const logs = Storage.getWeightLogs();
    const t    = today();
    const idx  = logs.findIndex(l => l.date === t);
    const entry = { id: uid(), date: t, kg: +val.toFixed(1) };
    if (idx >= 0) logs[idx] = entry; else logs.push(entry);
    Storage.saveWeightLogs(logs);
    document.getElementById('weight-input').value = '';
    if (!StreakMgr.isTodayWeightLogged()) { ProfileMgr.addXP(10); StreakMgr.markWeightLogged(); }
    renderWeight();
    AchievMgr.check();
    Anim.toast('⚖️ Waga zapisana: ' + val + ' kg');
  },

  workoutTab(tab) {
    document.getElementById('seg-new').classList.toggle('active', tab === 'new');
    document.getElementById('seg-templates').classList.toggle('active', tab === 'templates');
    document.getElementById('workout-new-view').style.display       = tab === 'new' ? 'block' : 'none';
    document.getElementById('workout-templates-view').style.display = tab === 'templates' ? 'block' : 'none';
  },

  startNewWorkout() { currentWorkout = null; renderWorkoutScreen(); App.workoutTab('new'); },

  addExercise() {
    if (!currentWorkout) currentWorkout = { id: uid(), date: today(), name: '', exercises: [] };
    currentWorkout.exercises.push({ name: '', sets: [{ reps: '', kg: '' }] });
    renderExercisesList();
    setTimeout(() => {
      const inputs = document.querySelectorAll('.exercise-name-input');
      if (inputs.length) inputs[inputs.length - 1].focus();
    }, 50);
  },

  useTemplate(idx) {
    const t = TEMPLATES[idx];
    currentWorkout = {
      id: uid(), date: today(),
      name: t.name === 'Własny' ? '' : t.name,
      exercises: t.exercises.map(name => ({ name, sets: [{ reps: '', kg: '' }] })),
    };
    if (!currentWorkout.exercises.length) currentWorkout.exercises.push({ name: '', sets: [{ reps: '', kg: '' }] });
    App.workoutTab('new');
    document.getElementById('workout-today-summary').style.display = 'none';
    document.getElementById('workout-builder').style.display = 'block';
    document.getElementById('workout-name').value = currentWorkout.name;
    renderExercisesList();
    Anim.toast('📋 Szablon: ' + t.name);
  },

  finishWorkout() {
    if (!currentWorkout) return;
    currentWorkout.name = document.getElementById('workout-name').value.trim() || 'Trening';
    currentWorkout.note = document.getElementById('workout-note').value.trim();
    const validEx = currentWorkout.exercises.filter(e => e.sets.some(s => +s.reps > 0));
    if (!validEx.length) { Anim.toast('⚠️ Dodaj co najmniej jedno ćwiczenie z serią!'); return; }
    currentWorkout.exercises = validEx;
    currentWorkout.exercises.forEach(e => {
      e.sets = e.sets.filter(s => +s.reps > 0);
      e.sets.forEach(s => { s.reps = +s.reps || 0; s.kg = +s.kg || 0; });
    });

    // Save without mood first, then ask mood
    const saved = { ...currentWorkout };
    const workouts = Storage.getWorkouts();
    workouts.push(saved);
    Storage.saveWorkouts(workouts);

    ProfileMgr.addXP(50);
    if (!StreakMgr.isTodayCheckedIn('gym')) { setTimeout(() => App.checkInGym(null), 300); }

    // Weekly goal check
    const p = Storage.getProfile();
    if (p.weeklyGoal > 0) {
      const done = workoutsThisWeek();
      if (done === p.weeklyGoal) { setTimeout(() => { ProfileMgr.addXP(30); Anim.toast('🎯 Tygodniowy cel osiągnięty! +30 XP'); }, 1200); }
    }

    AchievMgr.check();
    Anim.confetti();

    // Show mood picker
    pendingMoodCb = (mood) => {
      if (mood) {
        const ws = Storage.getWorkouts();
        const idx = ws.findIndex(w => w.id === saved.id);
        if (idx >= 0) { ws[idx].mood = mood; Storage.saveWorkouts(ws); }
        saved.mood = mood;
      }
      currentWorkout = null;
      showWorkoutSummary(saved);
    };
    document.getElementById('mood-overlay').classList.add('show');
  },

  selectMood(mood) {
    document.getElementById('mood-overlay').classList.remove('show');
    if (pendingMoodCb) { pendingMoodCb(mood); pendingMoodCb = null; }
    Anim.toast('💪 Trening zapisany! +50 XP');
  },

  saveProfile() {
    const name   = document.getElementById('p-name').value.trim();
    const height = parseInt(document.getElementById('p-height').value) || 0;
    const goal   = parseFloat(document.getElementById('p-goal').value);
    if (!name) { Anim.toast('⚠️ Wpisz imię'); return; }
    const p = Storage.getProfile();
    p.name        = name;
    p.height      = height;
    p.goalWeight  = goal || p.goalWeight;
    Storage.saveProfile(p);
    renderProfile();
    Anim.toast('✅ Profil zapisany!');
  },

  exportData() {
    const data = {
      profile:      Storage.getProfile(),
      workouts:     Storage.getWorkouts(),
      weight_logs:  Storage.getWeightLogs(),
      eating_logs:  Storage.getEatingLogs(),
      streaks: {
        gym:  Storage.getStreak('gym'),
        food: Storage.getStreak('food'),
      },
      achievements: Storage.getAchievements(),
      exported_at:  new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'fitflame-backup-' + today() + '.json';
    a.click();
    URL.revokeObjectURL(url);
    Anim.toast('📤 Dane wyeksportowane!');
  },

  resetData() {
    if (!confirm('Usunąć wszystkie dane? Tej operacji nie można cofnąć.')) return;
    ['profile','workouts','weight_logs','eating_logs','streak_gym','streak_food','daily_state','achievements']
      .forEach(k => localStorage.removeItem('ft_' + k));
    localStorage.removeItem('ft_ios_hint_shown');
    location.reload();
  },

  loadMoreHistory() { renderHistory(false); },
  closeLevelUp()    { document.getElementById('levelup-overlay').classList.remove('show'); },
  closeBadge() {
    const el = document.getElementById('badge-overlay');
    const cb = el._onClose;
    el.classList.remove('show');
    el._onClose = null;
    if (cb) setTimeout(cb, 350);
  },

  // Workout internals
  _exNameChange(ei, val) { if (currentWorkout) currentWorkout.exercises[ei].name = val; },
  _removeExercise(ei)    { if (currentWorkout) { currentWorkout.exercises.splice(ei, 1); renderExercisesList(); } },
  _addSet(ei) {
    if (!currentWorkout) return;
    currentWorkout.exercises[ei].sets.push({ reps: '', kg: '' });
    renderExercisesList();
  },
  _removeSet(ei, si) {
    if (!currentWorkout) return;
    currentWorkout.exercises[ei].sets.splice(si, 1);
    renderExercisesList();
  },
  _setVal(ei, si, field, val) { if (currentWorkout) currentWorkout.exercises[ei].sets[si][field] = val; },
};

// ═══════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════
function boot() {
  StreakMgr.evaluateOnOpen();
  renderHome();
  renderTemplatesGrid();
  App.workoutTab('new');

  // iOS install hint
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone;
  if (isIOS && !isStandalone && !localStorage.getItem('ft_ios_hint_shown')) {
    setTimeout(() => {
      document.getElementById('ios-hint').classList.add('show');
      localStorage.setItem('ft_ios_hint_shown', '1');
    }, 3000);
  }
}

// ═══════════════════════════════════════════
// SETUP FORM
// ═══════════════════════════════════════════
document.getElementById('setup-submit').addEventListener('click', () => {
  const name   = document.getElementById('setup-name').value.trim();
  const height = parseInt(document.getElementById('setup-height').value) || 0;
  const weight = parseFloat(document.getElementById('setup-weight').value);
  const goal   = parseFloat(document.getElementById('setup-goal').value);
  if (!name)          { Anim.toast('Wpisz swoje imię');        return; }
  if (!weight || weight < 20) { Anim.toast('Podaj aktualną wagę'); return; }
  if (!goal   || goal   < 20) { Anim.toast('Podaj cel wagowy');    return; }

  const profile = Storage.getProfile();
  profile.name        = name;
  profile.height      = height;
  profile.startWeight = weight;
  profile.goalWeight  = goal;
  profile.xp          = 0;
  profile.level       = 1;
  profile.joinDate    = today();
  profile.lastOpenDate = '';
  profile.weeklyGoal  = 0;
  Storage.saveProfile(profile);
  Storage.saveWeightLogs([{ id: uid(), date: today(), kg: weight }]);

  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  boot();
  Anim.toast('🔥 Witaj, ' + name + '! Rozpalamy FitFlame!');
});

['setup-name','setup-height','setup-weight','setup-goal'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('setup-submit').click();
  });
});

document.addEventListener('DOMContentLoaded', initSetup);
