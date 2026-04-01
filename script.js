/* ============================================
   WIN98 PORTFOLIO — script.js
   ============================================ */

/* ── Boot sequence ──────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('bootBar');
  const bootScreen = document.getElementById('bootScreen');
  const desktop = document.getElementById('desktop');

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    bar.style.width = Math.min(pct, 100) + '%';
    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        bootScreen.style.display = 'none';
        desktop.style.display = 'block';
        startClock();
        // Auto-open About window after a moment
        setTimeout(() => openWindow('about'), 400);
      }, 600);
    }
  }, 200);
});

/* ── Clock ──────────────────────────────────── */
function startClock() {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('taskbarClock').textContent = `${h}:${m}`;
  }
  tick();
  setInterval(tick, 10000);
}

/* ── Window management ──────────────────────── */
let zCounter = 10;
const openWindows = {};

function openWindow(id) {
  const el = document.getElementById('win-' + id);
  if (!el) return;

  closeStart();

  if (el.dataset.minimized === 'true') {
    el.style.display = 'flex';
    el.dataset.minimized = 'false';
    focusWindow(id);
    return;
  }

  if (el.style.display !== 'none' && el.style.display !== '') {
    focusWindow(id);
    return;
  }

  el.style.display = 'flex';
  el.style.flexDirection = 'column';
  focusWindow(id);
  addTaskbarBtn(id);

  if (id === 'skills') animateSkillBars();
  if (id === 'minesweeper') initMine();
}

function closeWindow(id) {
  const el = document.getElementById('win-' + id);
  if (el) {
    el.style.display = 'none';
    el.dataset.minimized = 'false';
  }
  removeTaskbarBtn(id);
}

function minimizeWindow(id) {
  const el = document.getElementById('win-' + id);
  if (el) {
    el.style.display = 'none';
    el.dataset.minimized = 'true';
    const btn = document.getElementById('tb-' + id);
    if (btn) btn.style.borderStyle = 'inset';
  }
}

function maximizeWindow(id) {
  const el = document.getElementById('win-' + id);
  if (!el) return;
  if (el.dataset.maximized === 'true') {
    el.style.top    = el.dataset.restoreTop    || '80px';
    el.style.left   = el.dataset.restoreLeft   || '80px';
    el.style.width  = el.dataset.restoreWidth  || '480px';
    el.style.height = el.dataset.restoreHeight || 'auto';
    el.dataset.maximized = 'false';
  } else {
    el.dataset.restoreTop    = el.style.top;
    el.dataset.restoreLeft   = el.style.left;
    el.dataset.restoreWidth  = el.style.width;
    el.dataset.restoreHeight = el.style.height;
    el.style.top    = '0px';
    el.style.left   = '0px';
    el.style.width  = '100vw';
    el.style.height = 'calc(100vh - 30px)';
    el.dataset.maximized = 'true';
  }
}

function focusWindow(id) {
  document.querySelectorAll('.win98-window').forEach(w => w.classList.remove('active'));
  const el = document.getElementById('win-' + id);
  if (el) {
    el.classList.add('active');
    zCounter++;
    el.style.zIndex = zCounter;
  }
  // Highlight taskbar button
  document.querySelectorAll('.taskbar-btn').forEach(b => b.style.borderStyle = '');
  const btn = document.getElementById('tb-' + id);
  if (btn) btn.style.borderStyle = 'inset';
}

/* ── Taskbar buttons ────────────────────────── */
const winLabels = {
  about: '👤 About Me', portfolio: '💼 Portfolio',
  skills: '⚙️ Skills', contact: '📧 Contact',
  minesweeper: '💣 Minesweeper', notepad: '📝 ReadMe.txt',
  recyclebin: '🗑️ Recycle Bin'
};

function addTaskbarBtn(id) {
  if (document.getElementById('tb-' + id)) return;
  const tasks = document.getElementById('taskbarTasks');
  const btn = document.createElement('button');
  btn.className = 'taskbar-btn';
  btn.id = 'tb-' + id;
  btn.textContent = winLabels[id] || id;
  btn.onclick = () => {
    const el = document.getElementById('win-' + id);
    if (el && el.dataset.minimized === 'true') {
      openWindow(id);
    } else if (el && el.classList.contains('active')) {
      minimizeWindow(id);
    } else {
      openWindow(id);
    }
  };
  tasks.appendChild(btn);
}

function removeTaskbarBtn(id) {
  const btn = document.getElementById('tb-' + id);
  if (btn) btn.remove();
}

/* ── Draggable windows ──────────────────────── */
document.addEventListener('mousedown', (e) => {
  const titlebar = e.target.closest('.win-titlebar');
  if (!titlebar) return;

  const winId = titlebar.dataset.win;
  if (!winId) return;
  const win = document.getElementById('win-' + winId);
  if (!win) return;

  // Don't drag if clicking buttons
  if (e.target.classList.contains('win-btn')) return;

  focusWindow(winId);

  const startX = e.clientX - win.offsetLeft;
  const startY = e.clientY - win.offsetTop;

  function onMove(e) {
    let nx = e.clientX - startX;
    let ny = e.clientY - startY;
    // Constrain to desktop
    nx = Math.max(0, Math.min(nx, window.innerWidth - win.offsetWidth));
    ny = Math.max(0, Math.min(ny, window.innerHeight - 30 - 20));
    win.style.left = nx + 'px';
    win.style.top  = ny + 'px';
  }
  function onUp() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
});

// Focus window on click
document.addEventListener('mousedown', (e) => {
  const win = e.target.closest('.win98-window');
  if (win) {
    const id = win.id.replace('win-', '');
    focusWindow(id);
  }
});

/* ── Start menu ─────────────────────────────── */
function toggleStart() {
  const menu = document.getElementById('startMenu');
  menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}
function closeStart() {
  document.getElementById('startMenu').style.display = 'none';
}
document.addEventListener('mousedown', (e) => {
  if (!e.target.closest('.start-menu') && !e.target.closest('.start-btn')) {
    closeStart();
  }
});

/* ── Shutdown ───────────────────────────────── */
function shutdown() {
  closeStart();
  document.getElementById('shutdownScreen').style.display = 'flex';
}

/* ── Portfolio projects ─────────────────────── */
const projects = {
  proj1: {
    title: 'Project One',
    tags: ['HTML', 'CSS', 'JavaScript'],
    desc: 'A short description of this project. What did you build? What problem did it solve? Replace this with your real project info and add a live demo link.'
  },
  proj2: {
    title: 'Project Two',
    tags: ['React', 'Node.js', 'MongoDB'],
    desc: 'Describe your second project here. Talk about the tech stack, the challenge you overcame, and the outcome. Link to the live version or GitHub repo.'
  },
  proj3: {
    title: 'Project Three',
    tags: ['Python', 'API', 'Data'],
    desc: 'Another great project goes here. This is your chance to show off your breadth of skills. Customise each entry with screenshots, links, and context.'
  },
  proj4: {
    title: 'Project Four',
    tags: ['TypeScript', 'Next.js'],
    desc: 'Your fourth project. Keep descriptions concise but informative — visitors want to understand your work quickly and then click through to see it live.'
  },
  proj5: {
    title: 'Project Five',
    tags: ['Unity', 'C#', 'Game Dev'],
    desc: 'A game or interactive project. Detail what genre it is, how long you worked on it, and what you learned. Add a playable link if available.'
  },
  proj6: {
    title: 'Project Six',
    tags: ['Design', 'Figma', 'UI/UX'],
    desc: 'A design-focused project or case study. Describe your process, tools used, and outcome. Link to a Behance or Dribbble page if applicable.'
  }
};

function showProject(id) {
  const p = projects[id];
  if (!p) return;
  document.getElementById('folderView').style.display = 'none';
  document.getElementById('projectDetail').style.display = 'block';
  document.getElementById('projTitle').textContent = p.title;
  document.getElementById('projDesc').textContent = p.desc;
  document.getElementById('addressPath').textContent = `C:\\Portfolio\\Projects\\${p.title.replace(/ /g, '_')}\\`;
  document.getElementById('portStatus').textContent = `${p.tags.length} file(s)`;

  const tagsEl = document.getElementById('projTags');
  tagsEl.innerHTML = '';
  p.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'proj-tag';
    span.textContent = t;
    tagsEl.appendChild(span);
  });
}

function hideProject() {
  document.getElementById('folderView').style.display = 'flex';
  document.getElementById('projectDetail').style.display = 'none';
  document.getElementById('addressPath').textContent = 'C:\\Portfolio\\Projects\\';
  document.getElementById('portStatus').textContent = '6 object(s)';
}

/* ── Skills tabs & bars ─────────────────────── */
function switchTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));

  const activeTab = document.querySelector(`.tab[onclick="switchTab('${name}')"]`);
  if (activeTab) activeTab.classList.add('active');
  const content = document.getElementById('tab-' + name);
  if (content) {
    content.classList.remove('hidden');
    // Animate bars in the newly shown tab
    content.querySelectorAll('.skill-bar').forEach(bar => {
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = bar.dataset.pct + '%'; }, 50);
    });
  }
}

function animateSkillBars() {
  setTimeout(() => {
    document.querySelectorAll('#tab-frontend .skill-bar').forEach(bar => {
      bar.style.width = bar.dataset.pct + '%';
    });
  }, 100);
}

/* ── Contact form / send ────────────────────── */
function sendMessage() {
  const email   = document.getElementById('senderEmail').value.trim();
  const subject = document.getElementById('subjectField').value.trim();
  const body    = document.getElementById('emailBody').value.trim();

  if (!email || !body) {
    showError('Please fill in your email address and message before sending.');
    return;
  }

  const status = document.getElementById('contactStatus');
  status.textContent = 'Sending...';
  setTimeout(() => {
    status.textContent = '✓ Message sent successfully!';
    document.getElementById('senderEmail').value = '';
    document.getElementById('subjectField').value = '';
    document.getElementById('emailBody').value = '';
    setTimeout(() => { status.textContent = 'Ready to compose'; }, 4000);
  }, 800);
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  const errWin = document.getElementById('win-error');
  if (!errWin) return;
  errWin.style.display = 'flex';
  errWin.style.flexDirection = 'column';
  zCounter++;
  errWin.style.zIndex = zCounter;
  addTaskbarBtn('error');
}

/* ── Minesweeper ────────────────────────────── */
const MINE_COLS = 9, MINE_ROWS = 9, MINE_COUNT = 10;
let mineBoard = [], mineRevealed = [], mineFlagged = [];
let mineGameOver = false, mineWon = false;
let mineTimerVal = 0, mineTimerInterval = null;
let mineFirstClick = true;

function initMine() {
  clearInterval(mineTimerInterval);
  mineGameOver = false; mineWon = false; mineFirstClick = true;
  mineTimerVal = 0;
  mineBoard    = Array(MINE_ROWS * MINE_COLS).fill(0);
  mineRevealed = Array(MINE_ROWS * MINE_COLS).fill(false);
  mineFlagged  = Array(MINE_ROWS * MINE_COLS).fill(false);

  document.getElementById('mineFace').textContent = '🙂';
  document.getElementById('mineTimer').textContent = '000';
  document.getElementById('mineCount').textContent = String(MINE_COUNT).padStart(3, '0');
  renderMine();
}

function placeMines(safeIdx) {
  let placed = 0;
  while (placed < MINE_COUNT) {
    const idx = Math.floor(Math.random() * MINE_ROWS * MINE_COLS);
    if (idx !== safeIdx && mineBoard[idx] !== -1) {
      mineBoard[idx] = -1;
      placed++;
    }
  }
  // Calculate numbers
  for (let i = 0; i < MINE_ROWS * MINE_COLS; i++) {
    if (mineBoard[i] === -1) continue;
    mineBoard[i] = getNeighbors(i).filter(n => mineBoard[n] === -1).length;
  }
}

function getNeighbors(idx) {
  const r = Math.floor(idx / MINE_COLS), c = idx % MINE_COLS;
  const neighbors = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (dr === 0 && dc === 0) continue;
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < MINE_ROWS && nc >= 0 && nc < MINE_COLS)
      neighbors.push(nr * MINE_COLS + nc);
  }
  return neighbors;
}

function revealCell(idx) {
  if (mineGameOver || mineRevealed[idx] || mineFlagged[idx]) return;

  if (mineFirstClick) {
    mineFirstClick = false;
    placeMines(idx);
    mineTimerInterval = setInterval(() => {
      mineTimerVal = Math.min(mineTimerVal + 1, 999);
      document.getElementById('mineTimer').textContent = String(mineTimerVal).padStart(3, '0');
    }, 1000);
  }

  mineRevealed[idx] = true;

  if (mineBoard[idx] === -1) {
    mineGameOver = true;
    clearInterval(mineTimerInterval);
    document.getElementById('mineFace').textContent = '😵';
    // Reveal all mines
    mineBoard.forEach((v, i) => { if (v === -1) mineRevealed[i] = true; });
    renderMine();
    setTimeout(() => showError('💥 BOOM! You hit a mine. Better luck next time!'), 200);
    return;
  }

  if (mineBoard[idx] === 0) {
    getNeighbors(idx).forEach(n => {
      if (!mineRevealed[n] && !mineFlagged[n]) revealCell(n);
    });
  }

  checkWin();
  renderMine();
}

function flagCell(e, idx) {
  e.preventDefault();
  if (mineGameOver || mineRevealed[idx]) return;
  mineFlagged[idx] = !mineFlagged[idx];
  const flagged = mineFlagged.filter(Boolean).length;
  document.getElementById('mineCount').textContent = String(Math.max(0, MINE_COUNT - flagged)).padStart(3, '0');
  renderMine();
}

function checkWin() {
  const unrevealed = mineRevealed.filter((v, i) => !v && mineBoard[i] !== -1).length;
  if (unrevealed === 0) {
    mineWon = true; mineGameOver = true;
    clearInterval(mineTimerInterval);
    document.getElementById('mineFace').textContent = '😎';
    setTimeout(() => showError('🎉 You won Minesweeper! Clearly a developer of great talent.'), 200);
  }
}

function renderMine() {
  const grid = document.getElementById('mineGrid');
  grid.innerHTML = '';
  for (let i = 0; i < MINE_ROWS * MINE_COLS; i++) {
    const cell = document.createElement('div');
    cell.className = 'mine-cell';

    if (mineRevealed[i]) {
      cell.classList.add('revealed');
      if (mineBoard[i] === -1) {
        cell.textContent = '💣';
        cell.classList.add('exploded');
      } else if (mineBoard[i] > 0) {
        cell.textContent = mineBoard[i];
        cell.classList.add('mine-' + mineBoard[i]);
      }
    } else if (mineFlagged[i]) {
      cell.textContent = '🚩';
      cell.classList.add('flagged');
    }

    cell.addEventListener('click', () => revealCell(i));
    cell.addEventListener('contextmenu', (e) => flagCell(e, i));
    grid.appendChild(cell);
  }
}

/* ── Keyboard shortcuts ─────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeStart();
});
