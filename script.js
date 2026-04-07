const questions = [
  { id: 1, question: 'Mengapa manusia berpindah dari nomaden ke menetap?', answer: 'Karena bertani lebih stabil' },
  { id: 2, question: 'Apa dampak bertani terhadap kehidupan sosial?', answer: 'Muncul desa dan kerja sama' },
  { id: 3, question: 'Kenapa logam mengubah kehidupan manusia?', answer: 'Lebih efisien untuk alat' },
  { id: 4, question: 'Apa ciri utama zaman Paleolitikum?', answer: 'Alat batu kasar' },
  { id: 5, question: 'Apa ciri utama zaman Mesolitikum?', answer: 'Alat batu lebih halus' },
  { id: 6, question: 'Apa ciri utama zaman Neolitikum?', answer: 'Mulai bertani' },
  { id: 7, question: 'Apa ciri utama zaman Perundagian?', answer: 'Menggunakan logam' },
  { id: 8, question: 'Mengapa manusia berburu hewan?', answer: 'Untuk makanan dan kulit' },
  { id: 9, question: 'Apa dampak teknologi terhadap pola hidup?', answer: 'Lebih efisien dan kompleks' },
  { id: 10, question: 'Apa hubungan manusia dengan alam praaksara?', answer: 'Bergantung penuh pada alam' },
];

const missions = [
  { id: 1, era: 'Paleolitikum', task: 'Berburu dan analisis lingkungan' },
  { id: 2, era: 'Mesolitikum', task: 'Pilih berpindah atau menetap sementara' },
  { id: 3, era: 'Neolitikum', task: 'Pilih bertani atau berburu' },
  { id: 4, era: 'Perundagian', task: 'Gunakan logam untuk efisiensi' },
];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const loadingScreen = document.getElementById('loading-screen');
const mainMenu = document.getElementById('main-menu');
const libraryMenu = document.getElementById('library-menu');
const settingsMenu = document.getElementById('settings-menu');
const gameContainer = document.getElementById('game-container');
const whirlpoolTransition = document.getElementById('whirlpool-transition');
const whirlpoolCaption = document.getElementById('whirlpool-caption');
const dialogOverlay = document.getElementById('dialog-overlay');
const quizOverlay = document.getElementById('quiz-overlay');
const factOverlay = document.getElementById('fact-overlay');
const inventoryOverlay = document.getElementById('inventory-overlay');
const craftingOverlay = document.getElementById('crafting-overlay');
const endingOverlay = document.getElementById('ending-overlay');
const tutorialOverlay = document.getElementById('tutorial-overlay');
const eatFlash = document.getElementById('eat-flash');
const dialogText = document.getElementById('dialog-text');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const factText = document.getElementById('fact-text');
const factHeading = document.getElementById('fact-heading');
const taskList = document.getElementById('task-list');
const questionCount = document.getElementById('question-count');
const inventoryCount = document.getElementById('inventory-count');
const woodCount = document.getElementById('wood-count');
const stoneCount = document.getElementById('stone-count');
const metalCount = document.getElementById('metal-count');
const foodCount = document.getElementById('food-count');
const swordStatus = document.getElementById('sword-status');
const healthFill = document.getElementById('health-fill');
const staminaFill = document.getElementById('stamina-fill');
const hungerFill = document.getElementById('hunger-fill');
const endingTitle = document.getElementById('ending-title');
const endingDialogue = document.getElementById('ending-dialogue');
const loadingTitle = document.getElementById('loading-title');
const loadingText = document.getElementById('loading-text');
const loadingProgress = document.getElementById('loading-progress');
const introScreen = document.getElementById('intro-screen');
const introText = document.getElementById('intro-text');
const introContinue = document.getElementById('intro-continue');
const tutorialText = document.getElementById('tutorial-text');
const tutorialClose = document.getElementById('tutorial-close');
const startBtn = document.getElementById('start-btn');
const libraryBtn = document.getElementById('library-btn');
const settingsBtn = document.getElementById('settings-btn');
const retryBtn = document.getElementById('retry-btn');
const mobileButtons = document.querySelectorAll('.control-button');
const mobileActionButtons = document.querySelectorAll('.action-button');
const settingSfx = document.getElementById('setting-sfx');
const settingReduceMotion = document.getElementById('setting-reduce-motion');

canvas.width = 1000;
canvas.height = 600;

const input = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  shift: false,
  e: false,
  g: false,
  f: false,
};

const state = {
  phase: 'loading',
  player: {
    x: 520,
    y: 320,
    width: 28,
    height: 38,
    baseSpeed: 2.85,
    sprintSpeed: 6.8,
    health: 100,
    stamina: 100,
    hunger: 100,
    exploration: 0,
    eatAnimT: 0,
  },
  inventory: {
    wood: 0,
    stone: 0,
    metal: 0,
    food: 1,
    sword: false,
    tool: false,
  },
  tasks: missions.map((mission) => ({ ...mission, complete: false })),
  animals: [],
  nodes: [],
  npcs: [],
  portal: { x: 860, y: 120, size: 52, found: false, primed: false },
  quizStones: [],
  usedQuestionIds: [],
  answerCount: 0,
  correctCount: 0,
  currentQuestion: null,
  currentOptions: [],
  currentMission: 0,
  dialogActive: false,
  quizActive: false,
  factActive: false,
  inventoryOpen: false,
  craftingOpen: false,
  ended: false,
  lastTime: 0,
  visitedAreas: new Set(),
  tasksCompleted: 0,
  sfx: true,
  swordVfxPhase: 0,
  openQuizAfterDialog: false,
};

const facts = {
  1: 'Fakta: Perubahan ke bertani membuat manusia mulai membangun desa dan bekerja sama.',
  2: 'Fakta: Bertani mengubah kehidupan sosial — muncul pembagian kerja dan kerja sama desa.',
  3: 'Fakta: Logam mempercepat produksi alat sehingga hidup manusia jauh lebih efisien.',
  4: 'Fakta: Paleolitikum dikenal dengan alat batu kasar dan pola hidup berburu-mengumpulkan.',
  5: 'Fakta: Mesolitikum menunjukkan adaptasi: alat lebih halus dan pilihan tempat lebih cerdas.',
  6: 'Fakta: Neolitikum membawa revolusi pertanian dan pemukiman menetap.',
  7: 'Fakta: Perundagian membuka era logam yang mengubah pertanian dan pertahanan.',
  8: 'Fakta: Berburu memberi protein dan bahan untuk pakaian serta perkakas.',
  9: 'Fakta: Teknologi mengubah pola hidup menjadi lebih terorganisir dan kompleks.',
  10: 'Fakta: Manusia praaksara hidup sangat bergantung pada alam sekitar mereka.',
};

const wrongAnswers = {
  1: ['Karena ingin berkeliling tanpa tujuan.', 'Karena kota modern sudah ada.'],
  2: ['Karena membuat manusia lebih sendiri.', 'Karena menghilangkan kerja sama.'],
  3: ['Karena logam membuat manusia takut alam.', 'Karena manusia berhenti berkreasi.'],
  4: ['Karena manusia sudah bertani intensif.', 'Karena manusia tinggal di apartemen.'],
  5: ['Karena manusia membuat mesin uap.', 'Karena manusia hidup di bawah laut.'],
  6: ['Karena manusia membuat pesawat.', 'Karena manusia hanya tinggal di gua.'],
  7: ['Karena manusia tidak butuh alat.', 'Karena manusia hanya makan buah.'],
  8: ['Karena hewan adalah hiasan saja.', 'Karena hewan dipelihara di kastil megah.'],
  9: ['Karena manusia berhenti berkomunikasi.', 'Karena manusia tidak butuh makanan.'],
  10: ['Karena manusia tidak pernah melihat sungai.', 'Karena manusia tidak peduli alam.'],
};

const ui = {
  questionCount,
  inventoryCount,
  woodCount,
  stoneCount,
  metalCount,
  foodCount,
  swordStatus,
  taskList,
  healthFill,
  staminaFill,
  hungerFill,
};

let typeToken = 0;

function start() {
  bindEvents();
  setupWorld();
  bindLibraryTabs();
  applyStoredSettings();
  startLoading();
}

function bindLibraryTabs() {
  document.querySelectorAll('.lib-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lib-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.library-pane').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById(`lib-${tab.dataset.tab}`);
      if (pane) pane.classList.add('active');
    });
  });
}

function applyStoredSettings() {
  const sfx = localStorage.getItem('chrono_sfx');
  const motion = localStorage.getItem('chrono_reduce_motion');
  if (sfx === '0' && settingSfx) settingSfx.checked = false;
  if (motion === '1' && settingReduceMotion) settingReduceMotion.checked = true;
  syncSettingsFromUI();
}

function syncSettingsFromUI() {
  state.sfx = settingSfx ? settingSfx.checked : true;
  document.body.classList.toggle('reduce-motion', settingReduceMotion && settingReduceMotion.checked);
  localStorage.setItem('chrono_sfx', state.sfx ? '1' : '0');
  localStorage.setItem('chrono_reduce_motion', settingReduceMotion && settingReduceMotion.checked ? '1' : '0');
}

function playBeep(freq = 440, dur = 0.06) {
  if (!state.sfx || typeof AudioContext === 'undefined') return;
  try {
    const ac = new AudioContext();
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.connect(g);
    g.connect(ac.destination);
    o.frequency.value = freq;
    g.gain.value = 0.04;
    o.start();
    setTimeout(() => {
      o.stop();
      ac.close();
    }, dur * 1000);
  } catch (_) { /* ignore */ }
}

function bindEvents() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  startBtn.addEventListener('click', showIntroScreen);
  introContinue.addEventListener('click', runWhirlpoolThenGame);
  tutorialClose.addEventListener('click', () => {
    tutorialOverlay.classList.add('hidden');
  });
  libraryBtn.addEventListener('click', () => togglePanel(libraryMenu, true));
  settingsBtn.addEventListener('click', () => togglePanel(settingsMenu, true));
  retryBtn.addEventListener('click', () => location.reload());
  document.querySelectorAll('.close-btn').forEach((button) => button.addEventListener('click', () => closeAllPanels()));
  document.getElementById('dialog-continue').addEventListener('click', closeDialog);
  document.getElementById('craft-sword').addEventListener('click', () => craftItem('sword'));
  document.getElementById('craft-tool').addEventListener('click', () => craftItem('tool'));
  if (settingSfx) settingSfx.addEventListener('change', syncSettingsFromUI);
  if (settingReduceMotion) settingReduceMotion.addEventListener('change', syncSettingsFromUI);

  mobileButtons.forEach((button) => {
    button.addEventListener('pointerdown', (e) => { e.preventDefault(); input[button.dataset.input] = true; });
    button.addEventListener('pointerup', (e) => { e.preventDefault(); input[button.dataset.input] = false; });
    button.addEventListener('pointerleave', () => { input[button.dataset.input] = false; });
  });
  mobileActionButtons.forEach((button) => {
    const action = button.dataset.action;
    if (action === 'shift') {
      button.addEventListener('pointerdown', (e) => { e.preventDefault(); input.shift = true; });
      button.addEventListener('pointerup', (e) => { e.preventDefault(); input.shift = false; });
      button.addEventListener('pointerleave', () => { input.shift = false; });
      return;
    }
    button.addEventListener('click', () => {
      if (action === 'e') handleInteraction();
      if (action === 'g') toggleInventory();
      if (action === 'f') toggleCrafting();
      if (action === 'q') tryEat();
    });
  });
}

function startLoading() {
  const welcome = 'Selamat datang, Penjelajah Waktu… Dunia praaksara menunggu. Bersiaplah memahami perjalanan manusia.';
  const steps = [
    'Memuat dunia praaksara…',
    'Membangun peta open world…',
    'Menyiapkan NPC, pohon, dan tambang…',
    'Menyusun 10 soal unik…',
    'Membuka portal waktu…',
  ];
  loadingTitle.textContent = 'CHRONO HUNTER';
  typeText(welcome, loadingText, 28);
  let index = 0;
  const runStep = () => {
    if (index >= steps.length) {
      loadingProgress.style.width = '100%';
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        state.phase = 'menu';
      }, 900);
      return;
    }
    typeText(steps[index], loadingText, 26);
    loadingProgress.style.width = `${((index + 1) / steps.length) * 100}%`;
    index += 1;
    setTimeout(runStep, 1600);
  };
  setTimeout(runStep, 2200);
}

function showIntroScreen() {
  mainMenu.classList.add('hidden');
  introScreen.classList.remove('hidden');
  const intro = [
    'Pemain: …Di mana aku? Langit ini asing. Udara panas dan bau tanah basah.',
    'Pemain: Baru saja aku di ruanganku—sekarang… tidak ada listrik, tidak ada jalan.',
    'Pemain: Tunggu. Pakaian orang-orang itu… batu dan tulang? Ini bukan duniamu.',
    'Pemain: Aku mengerti sekarang. Aku terlempar ke masa lalu. Masa praaksara.',
    'Sistem: Benar. Belajar dari sini adalah satu-satunya jalan untuk memahami dan keluar.',
  ].join('\n\n');
  typeText(intro, introText, 22);
  playBeep(330, 0.05);
}

function runWhirlpoolThenGame() {
  introScreen.classList.add('hidden');
  whirlpoolTransition.classList.remove('hidden');
  typeText('Pusaran waktu membawamu menembus lapisan zaman…', whirlpoolCaption, 24);
  playBeep(180, 0.08);
  setTimeout(() => {
    whirlpoolTransition.classList.add('hidden');
    beginGame();
  }, 3200);
}

function beginGame() {
  gameContainer.classList.remove('hidden');
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.getElementById('mobile-controls').classList.remove('hidden');
  }
  state.phase = 'playing';
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
  tutorialOverlay.classList.remove('hidden');
  const tut = 'Gerak: WASD atau panah. Shift = sprint (pakai stamina). E = tebang pohon / tambang batu (beberapa kali), bicara NPC, sentuh batu rune bercahaya untuk kuis, masuk celah. G = inventory, F = crafting. Q = makan. Total 10 soal unik: 4 dari misi NPC + 6 dari batu rune. Celah dimensi muncul setelah eksplorasi cukup.';
  typeText(tut, tutorialText, 20);
  showDialog('Kamu mendarat di tanah praaksara. Cari sumber daya, bicara pada penduduk, dan pahami setiap pilihan.');
}

function setupWorld() {
  state.nodes = [
    { x: 140, y: 130, type: 'tree', label: 'Pohon', hits: 0, maxHits: 3, collected: false },
    { x: 250, y: 320, type: 'stone', label: 'Batu', hits: 0, maxHits: 4, collected: false },
    { x: 420, y: 180, type: 'tree', label: 'Pohon', hits: 0, maxHits: 3, collected: false },
    { x: 620, y: 450, type: 'stone', label: 'Batu', hits: 0, maxHits: 4, collected: false },
    { x: 760, y: 260, type: 'metal', label: 'Logam', hits: 0, maxHits: 3, collected: false },
    { x: 180, y: 500, type: 'tree', label: 'Pohon', hits: 0, maxHits: 3, collected: false },
    { x: 340, y: 480, type: 'stone', label: 'Batu', hits: 0, maxHits: 4, collected: false },
  ];

  state.animals = [
    { x: 320, y: 220, type: 'boar', alive: true, speed: 0.22, dir: 1 },
    { x: 570, y: 120, type: 'deer', alive: true, speed: 0.18, dir: -1 },
    { x: 760, y: 520, type: 'boar', alive: true, speed: 0.2, dir: 1 },
    { x: 480, y: 360, type: 'deer', alive: true, speed: 0.19, dir: 1 },
  ];

  state.quizStones = [
    { x: 90, y: 520, used: false },
    { x: 900, y: 280, used: false },
    { x: 500, y: 520, used: false },
    { x: 700, y: 80, used: false },
    { x: 400, y: 360, used: false },
    { x: 160, y: 100, used: false },
  ];

  state.npcs = [
    { x: 120, y: 380, name: 'Penjaga Api', message: 'Pelajari lingkungan sebelum memilih strategi berburu.', id: 1, talkCount: 0 },
    { x: 520, y: 80, name: 'Nenek Cerita', message: 'Kamu bisa menetap sebentar atau mengikuti hewan. Pilihan membentuk ceritamu.', id: 2, talkCount: 0 },
    { x: 300, y: 200, name: 'Petani Batu', message: 'Bertani menahanmu di desa; berburu membawa kebebasan. Pikirkan dampak sosialnya.', id: 3, talkCount: 0 },
    { x: 880, y: 420, name: 'Pandai Besi', message: 'Logam membuat alat lebih tahan lama. Kumpulkan kayu dan batu untuk crafting.', id: 4, talkCount: 0 },
    { x: 640, y: 300, name: 'Pelukis Gua', message: 'Cerita di dinding mengingatkan: manusia selalu belajar dari alam.', id: 0, talkCount: 0 },
    { x: 200, y: 240, name: 'Pengumpul', message: 'Air dan hutan adalah peta hidup. Jika alam berubah, strategimu harus berubah.', id: 0, talkCount: 0 },
  ];

  updateTaskUI();
  updateInventoryUI();
}

function handleKeyDown(e) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = true;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === 'w' || k === 'a' || k === 's' || k === 'd') input[k] = true;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) input[e.key] = true;

  if (e.key === 'g' || e.key === 'G') toggleInventory();
  if (e.key === 'f' || e.key === 'F') toggleCrafting();
  if (e.key === 'q' || e.key === 'Q') tryEat();
  if (e.key === 'e' || e.key === 'E') {
    if (state.phase === 'playing' && !state.dialogActive && !state.quizActive && !state.factActive) {
      handleInteraction();
    }
  }
}

function handleKeyUp(e) {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') input.shift = false;
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (k === 'w' || k === 'a' || k === 's' || k === 'd') input[k] = false;
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) input[e.key] = false;
}

function togglePanel(panel, show) {
  panel.classList.toggle('hidden', !show);
}

function closeAllPanels() {
  [libraryMenu, settingsMenu, inventoryOverlay, craftingOverlay].forEach((panel) => panel.classList.add('hidden'));
  state.inventoryOpen = false;
  state.craftingOpen = false;
}

function toggleInventory() {
  inventoryOverlay.classList.toggle('hidden', state.inventoryOpen);
  state.inventoryOpen = !state.inventoryOpen;
}

function toggleCrafting() {
  craftingOverlay.classList.toggle('hidden', state.craftingOpen);
  state.craftingOpen = !state.craftingOpen;
}

function tryEat() {
  if (state.phase !== 'playing' || state.dialogActive || state.quizActive || state.factActive) return;
  if (state.inventory.food < 1) {
    showDialog('Tidak ada makanan. Berburu dengan pedang/kapak atau selesaikan sumber pangan.');
    return;
  }
  state.inventory.food -= 1;
  state.player.hunger = Math.min(100, state.player.hunger + 32);
  state.player.eatAnimT = 0.65;
  eatFlash.classList.remove('hidden');
  playBeep(520, 0.05);
  updateInventoryUI();
  setTimeout(() => eatFlash.classList.add('hidden'), 700);
}

function handleInteraction() {
  const playerRect = getRect(state.player);

  const nearNode = state.nodes.find((node) => !node.collected && rectIntersect(playerRect, getRect(node, 32, 32)));
  if (nearNode) {
    mineNode(nearNode);
    return;
  }

  const stone = state.quizStones.find((q) => !q.used && rectIntersect(playerRect, getRect(q, 24, 24)));
  if (stone) {
    stone.used = true;
    state.openQuizAfterDialog = false;
    openQuiz();
    return;
  }

  const nearNPC = state.npcs.find((npc) => rectIntersect(playerRect, getRect(npc, 40, 40)));
  if (nearNPC) {
    interactNPC(nearNPC);
    return;
  }

  const nearAnimal = state.animals.find((animal) => animal.alive && rectIntersect(playerRect, getRect(animal, 32, 28)));
  if (nearAnimal) {
    huntAnimal(nearAnimal);
    return;
  }

  const portalRect = getRect(state.portal, state.portal.size, state.portal.size);
  if (rectIntersect(playerRect, portalRect)) {
    interactPortal();
    return;
  }

  showDialog('Tidak ada yang bisa diinteraksi di sini. Dekati pohon, batu, NPC, hewan, atau celah dimensi.');
}

function mineNode(node) {
  node.hits += 1;
  playBeep(120 + node.hits * 40, 0.04);
  if (node.hits < node.maxHits) {
    const left = node.maxHits - node.hits;
    showDialog(`${node.label}: pukul lagi (${left} kali) — seperti menambang di Minecraft.`);
    return;
  }
  node.collected = true;
  if (node.type === 'tree') {
    state.inventory.wood += 2;
    openFact('Kayu didapat. Kayu dipakai untuk gagang alat dan bangunan sederhana.', { duration: 2600 });
  } else if (node.type === 'stone') {
    state.inventory.stone += 2;
    openFact('Batu ditambang. Batu jadi inti kapak dan ujung pedang primitif.', { duration: 2600 });
  } else if (node.type === 'metal') {
    state.inventory.metal += 1;
    openFact('Logam langka! Di Perundagian, logam mengubah kecepatan kerja dan pertahanan.', { duration: 2800 });
  }
  updateInventoryUI();
}

function interactNPC(npc) {
  if (npc.id === 0) {
    typeText(`${npc.name}: ${npc.message}`, dialogText, 24);
    dialogOverlay.classList.remove('hidden');
    state.dialogActive = true;
    return;
  }
  const mission = state.tasks.find((task) => task.id === npc.id);
  if (mission && !mission.complete) {
    mission.complete = true;
    state.tasksCompleted += 1;
    state.openQuizAfterDialog = true;
    showDialog(`${npc.name}: ${npc.message}\n\nMisi ${mission.era} selesai. Tutup dialog untuk melanjut ke kuis.`);
  } else {
    showDialog(`${npc.name}: ${npc.message}`);
  }
  updateTaskUI();
}

function huntAnimal(animal) {
  if (!state.inventory.sword && !state.inventory.tool) {
    showDialog('Kamu butuh alat. Buka crafting (F) dan buat pedang atau kapak.');
    return;
  }
  animal.alive = false;
  state.inventory.food += 1;
  state.player.hunger = Math.min(100, state.player.hunger + 14);
  openFact('Berburu sukses. Makanan menambah cadangan — tekan Q untuk makan dengan animasi.', { duration: 3000 });
  updateInventoryUI();
  playBeep(200, 0.06);
}

function interactPortal() {
  if (state.answerCount < 10) {
    showDialog('Celah dimensi berdenyut… tetapi hanya merespons setelah kamu menyelesaikan 10 soal yang muncul.');
    state.portal.primed = false;
    return;
  }
  if (!state.portal.primed) {
    state.portal.primed = true;
    showDialog('Celah dimensi terbuka. Tekan E sekali lagi untuk masuk dan menentukan nasibmu di akhir perjalanan.');
    return;
  }
  state.portal.primed = false;
  tryTriggerEnding();
}

function tryTriggerEnding() {
  if (state.answerCount < 10) {
    showDialog('Selesaikan semua soal yang muncul sebelum menutup cerita.');
    return;
  }
  state.ended = true;
  showEnding(computeEndingType());
}

function computeEndingType() {
  const correct = state.correctCount;
  const done = state.tasksCompleted;
  const explored = state.player.exploration;
  const secretReady = state.portal.found && done === missions.length && state.answerCount === 10 && explored >= 4;

  if (secretReady && correct >= 8) return 'SECRET';
  if (done === missions.length && correct >= 9 && state.answerCount === 10 && explored >= 3) return 'TRUE';
  if (done >= 2 && correct >= 6) return 'GOOD';
  return 'BAD';
}

function updateTaskUI() {
  ui.taskList.innerHTML = '';
  state.tasks.forEach((task) => {
    const item = document.createElement('div');
    item.className = 'task-item';
    item.innerHTML = `<strong>${task.era}</strong><br>${task.task}<br><span style="color:${task.complete ? '#6dff9a' : '#c0d8ff'};">${task.complete ? 'Selesai' : 'Belum'}</span>`;
    ui.taskList.appendChild(item);
  });
}

function updateInventoryUI() {
  ui.inventoryCount.innerText = state.inventory.wood + state.inventory.stone + state.inventory.metal + state.inventory.food;
  ui.woodCount.innerText = state.inventory.wood;
  ui.stoneCount.innerText = state.inventory.stone;
  ui.metalCount.innerText = state.inventory.metal;
  ui.foodCount.innerText = state.inventory.food;
  ui.swordStatus.innerText = state.inventory.sword ? 'Ya' : 'Tidak';
}

function updateHealthUI() {
  ui.healthFill.style.width = `${state.player.health}%`;
  ui.staminaFill.style.width = `${state.player.stamina}%`;
  ui.hungerFill.style.width = `${state.player.hunger}%`;
}

function updateUI() {
  updateInventoryUI();
  updateHealthUI();
}

function showDialog(text) {
  dialogText.innerText = '';
  dialogOverlay.classList.remove('hidden');
  state.dialogActive = true;
  typeText(text, dialogText, 26);
  playBeep(400, 0.04);
}

function closeDialog() {
  dialogOverlay.classList.add('hidden');
  state.dialogActive = false;
  if (state.openQuizAfterDialog) {
    state.openQuizAfterDialog = false;
    setTimeout(() => openQuiz(), 200);
  }
}

function openQuiz() {
  const question = chooseRandomQuestion();
  if (!question) {
    showDialog('Semua soal sudah terjawab. Menuju celah dimensi untuk melihat ending.');
    return;
  }
  state.currentQuestion = question;
  state.currentOptions = createOptions(question);
  quizQuestion.innerText = question.question;
  quizOptions.innerHTML = '';
  state.currentOptions.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.type = 'button';
    button.innerText = option.text;
    button.addEventListener('click', () => answerQuestion(option, button));
    quizOptions.appendChild(button);
  });
  quizOverlay.classList.remove('hidden');
  state.quizActive = true;
}

function chooseRandomQuestion() {
  const available = questions.filter((q) => !state.usedQuestionIds.includes(q.id));
  if (available.length === 0) return null;
  const chosen = available[Math.floor(Math.random() * available.length)];
  state.usedQuestionIds.push(chosen.id);
  return chosen;
}

function createOptions(question) {
  const wrong = wrongAnswers[question.id] ?? ['Coba pikirkan lagi.', 'Itu kurang tepat.'];
  const options = [
    { text: question.answer, correct: true },
    { text: wrong[0], correct: false },
    { text: wrong[1], correct: false },
  ];
  return shuffle(options);
}

function answerQuestion(option, buttonEl) {
  if (!state.quizActive) return;
  quizOptions.querySelectorAll('button').forEach((b) => { b.disabled = true; });
  if (option.correct) buttonEl.style.boxShadow = '0 0 20px rgba(80,255,160,0.5)';
  else buttonEl.style.boxShadow = '0 0 20px rgba(255,100,100,0.45)';

  const holdMs = 2800;
  setTimeout(() => {
    state.quizActive = false;
    quizOverlay.classList.add('hidden');
    state.answerCount += 1;
    questionCount.innerText = `${state.answerCount}/10`;

    const isCorrect = option.correct;
    if (isCorrect) state.correctCount += 1;

    const baseFact = facts[state.currentQuestion.id];
    const factBody = isCorrect
      ? baseFact
      : `Jawaban belum tepat. ${baseFact}`;

    openFact(factBody, {
      fromQuiz: true,
      correct: isCorrect,
      duration: 4000 + Math.random() * 1000,
    });

    if (state.answerCount === 10) {
      setTimeout(() => {
        showDialog('Semua soal selesai! Celah dimensi menunggu — eksplorasi jika belum menemukannya, lalu interaksi untuk masuk.');
      }, 4200);
    }
  }, holdMs);
}

function openFact(text, opts = {}) {
  const duration = opts.duration ?? 4000;
  const fromQuiz = opts.fromQuiz ?? false;
  const correct = opts.correct ?? true;

  factHeading.textContent = fromQuiz ? (correct ? '💡 Fakta Menarik' : '💡 Fakta & Koreksi') : '💡 Fakta Menarik';
  factText.innerText = '';
  factOverlay.classList.remove('hidden');
  state.factActive = true;
  typeText(text, factText, fromQuiz ? 22 : 26);

  setTimeout(() => {
    factOverlay.classList.add('hidden');
    state.factActive = false;
  }, duration);
}

function craftItem(itemName) {
  if (itemName === 'sword') {
    if (state.inventory.wood >= 4 && state.inventory.stone >= 2) {
      state.inventory.wood -= 4;
      state.inventory.stone -= 2;
      state.inventory.sword = true;
      openFact('Pedang primitif siap. VFX energi akan menyertai ayunanmu di dunia.', { duration: 2800 });
      playBeep(660, 0.07);
    } else {
      showDialog('Butuh 4 kayu dan 2 batu untuk pedang.');
    }
  }
  if (itemName === 'tool') {
    if (state.inventory.wood >= 2 && state.inventory.stone >= 3) {
      state.inventory.wood -= 2;
      state.inventory.stone -= 3;
      state.inventory.tool = true;
      openFact('Kapak batu selesai. Tambang pohon dan batu lebih cepat.', { duration: 2600 });
      playBeep(550, 0.06);
    } else {
      showDialog('Butuh 2 kayu dan 3 batu untuk kapak.');
    }
  }
  updateInventoryUI();
}

function typeText(text, container, speed = 45) {
  typeToken += 1;
  const myToken = typeToken;
  container.innerText = '';
  let index = 0;
  const tick = () => {
    if (myToken !== typeToken) return;
    if (index >= text.length) return;
    const char = text[index];
    container.innerText += char;
    index += 1;
    if (index < text.length) setTimeout(tick, speed);
  };
  tick();
}

function gameLoop(timestamp) {
  const delta = (timestamp - state.lastTime) / 1000;
  state.lastTime = timestamp;
  state.swordVfxPhase += delta * 8;
  update(delta);
  render();
  if (!state.ended) requestAnimationFrame(gameLoop);
}

function update(delta) {
  if (state.phase !== 'playing') return;
  handleMovement(delta);
  updateHunger(delta);
  moveAnimals(delta);
  if (state.player.eatAnimT > 0) state.player.eatAnimT = Math.max(0, state.player.eatAnimT - delta);
  updateUI();
  updateHealthUI();
  trackExploration();
}

function handleMovement(delta) {
  let speed = state.player.baseSpeed;
  const wantsSprint = input.shift && (input.w || input.s || input.a || input.d || input.ArrowUp || input.ArrowDown || input.ArrowLeft || input.ArrowRight);
  if (wantsSprint && state.player.stamina > 2) {
    speed = state.player.sprintSpeed;
    state.player.stamina = Math.max(0, state.player.stamina - 22 * delta);
  } else {
    state.player.stamina = Math.min(100, state.player.stamina + 16 * delta);
  }

  let dx = 0;
  let dy = 0;
  if (input.w || input.ArrowUp) dy -= 1;
  if (input.s || input.ArrowDown) dy += 1;
  if (input.a || input.ArrowLeft) dx -= 1;
  if (input.d || input.ArrowRight) dx += 1;
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }
  state.player.x = clamp(state.player.x + dx * speed * 60 * delta, 20, canvas.width - 40);
  state.player.y = clamp(state.player.y + dy * speed * 60 * delta, 20, canvas.height - 40);
}

function updateHunger(delta) {
  state.player.hunger = Math.max(0, state.player.hunger - 1.1 * delta);
  if (state.player.hunger <= 0) {
    state.player.health = Math.max(0, state.player.health - 10 * delta);
    if (state.player.health <= 0.5) triggerBadEnd();
  }
}

function triggerBadEnd() {
  state.ended = true;
  showEnding('BAD');
}

function moveAnimals(delta) {
  state.animals.forEach((animal) => {
    if (!animal.alive) return;
    animal.x += animal.speed * animal.dir * 60 * delta;
    const left = 60;
    const right = canvas.width - 60;
    if (animal.x < left || animal.x > right) animal.dir *= -1;
  });
}

function trackExploration() {
  const zoneX = Math.floor(state.player.x / 200);
  const zoneY = Math.floor(state.player.y / 150);
  const zoneKey = `${zoneX}:${zoneY}`;
  if (!state.visitedAreas.has(zoneKey)) {
    state.visitedAreas.add(zoneKey);
    state.player.exploration = state.visitedAreas.size;
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawWater();
  drawNodes();
  drawQuizStones();
  drawAnimals();
  drawNPCs();
  drawPortal();
  drawPlayer();
  drawHudTips();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#152a4a');
  gradient.addColorStop(1, '#050a14');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let y = 0; y < canvas.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawWater() {
  ctx.fillStyle = 'rgba(40, 150, 210, 0.2)';
  ctx.fillRect(0, 0, 220, 140);
  ctx.fillStyle = 'rgba(70, 180, 255, 0.14)';
  ctx.fillRect(140, 420, 260, 120);
}

function drawQuizStones() {
  state.quizStones.forEach((q) => {
    if (q.used) return;
    const pulse = 0.6 + Math.sin(performance.now() / 300 + q.x * 0.02) * 0.35;
    const g = ctx.createRadialGradient(q.x + 12, q.y + 12, 2, q.x + 12, q.y + 12, 22);
    g.addColorStop(0, `rgba(200, 255, 255, ${pulse})`);
    g.addColorStop(1, 'rgba(60, 120, 200, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(q.x + 12, q.y + 12, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(180, 240, 255, 0.9)';
    ctx.fillRect(q.x + 6, q.y + 10, 12, 8);
  });
}

function drawNodes() {
  state.nodes.forEach((node) => {
    if (node.collected) return;
    if (node.type === 'tree') drawTree(node.x, node.y, node.hits / node.maxHits);
    if (node.type === 'stone') drawRock(node.x, node.y, '#8a8a8a', node.hits / node.maxHits);
    if (node.type === 'metal') drawRock(node.x, node.y, '#7ee8d8', node.hits / node.maxHits);
  });
}

function drawTree(x, y, crack = 0) {
  ctx.fillStyle = '#2f7a32';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 8, 26, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5c3c1a';
  ctx.fillRect(x + 8, y + 24, 12, 18);
  if (crack > 0) {
    ctx.strokeStyle = `rgba(0,0,0,${0.15 + crack * 0.35})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 30);
    ctx.lineTo(x + 22, y + 12);
    ctx.stroke();
  }
}

function drawRock(x, y, color, crack = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 0, y + 20);
  ctx.lineTo(x + 15, y + 0);
  ctx.lineTo(x + 35, y + 6);
  ctx.lineTo(x + 45, y + 28);
  ctx.lineTo(x + 5, y + 34);
  ctx.fill();
  if (crack > 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.stroke();
  }
}

function drawAnimals() {
  state.animals.forEach((animal) => {
    if (!animal.alive) return;
    const bob = Math.sin(performance.now() / 400 + animal.x * 0.01) * 2;
    ctx.fillStyle = animal.type === 'boar' ? '#c77c2a' : '#d8c76d';
    ctx.fillRect(animal.x, animal.y + bob, 26, 18);
    ctx.fillStyle = '#111';
    ctx.fillRect(animal.x + 8, animal.y + 4 + bob, 10, 6);
  });
}

function drawNPCs() {
  state.npcs.forEach((npc) => {
    const pulse = 1 + Math.sin(performance.now() / 500 + npc.x) * 0.04;
    ctx.fillStyle = '#ffe08e';
    ctx.beginPath();
    ctx.arc(npc.x, npc.y, 18 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a3050';
    ctx.fillRect(npc.x - 6, npc.y - 4, 12, 14);
  });
}

function drawPortal() {
  const t = performance.now() / 1000;
  ctx.save();
  ctx.translate(state.portal.x + state.portal.size / 2, state.portal.y + state.portal.size / 2);
  ctx.rotate(t * 1.2);
  const grd = ctx.createRadialGradient(0, 0, 4, 0, 0, 36);
  grd.addColorStop(0, 'rgba(180, 230, 255, 0.9)');
  grd.addColorStop(0.5, 'rgba(80, 140, 255, 0.35)');
  grd.addColorStop(1, 'rgba(20, 60, 120, 0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.rotate(-t * 1.2);
  for (let i = 0; i < 3; i += 1) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.strokeStyle = `rgba(120, 200, 255, ${0.5 - i * 0.12})`;
    ctx.lineWidth = 4 - i;
    ctx.beginPath();
    ctx.arc(0, 0, 22 + i * 6, 0, Math.PI * 1.25);
    ctx.stroke();
  }
  ctx.restore();
  ctx.fillStyle = 'rgba(50, 110, 250, 0.12)';
  ctx.fillRect(state.portal.x, state.portal.y, state.portal.size, state.portal.size);
}

function drawSwordVfx(px, py) {
  const phase = state.swordVfxPhase;
  for (let i = 0; i < 6; i += 1) {
    const ang = phase + i * 0.9;
    const len = 22 + Math.sin(phase * 2 + i) * 6;
    const gx = px + 22 + Math.cos(ang) * len * 0.4;
    const gy = py + 8 + Math.sin(ang) * len * 0.35;
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 16);
    g.addColorStop(0, `rgba(120, 255, 255, ${0.45 - i * 0.06})`);
    g.addColorStop(1, 'rgba(40, 120, 255, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(gx, gy, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = 'rgba(180, 255, 255, 0.85)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(100, 220, 255, 0.9)';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(px + 20, py + 10);
  ctx.lineTo(px + 38 + Math.sin(phase) * 4, py - 6 + Math.cos(phase) * 3);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawPlayer() {
  const { x, y, width, height } = state.player;
  const bounce = state.player.eatAnimT > 0 ? Math.sin(state.player.eatAnimT * 20) * 3 : 0;
  ctx.fillStyle = '#82d3ff';
  ctx.fillRect(x, y + bounce, width, height);
  if (state.inventory.sword) {
    drawSwordVfx(x, y + bounce);
  } else if (state.inventory.tool) {
    ctx.strokeStyle = '#c9b28a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 18, y + bounce + 12);
    ctx.lineTo(x + 30, y + bounce - 2);
    ctx.stroke();
  }
}

function drawHudTips() {
  if (state.portal.found) return;
  if (state.player.exploration >= 3) {
    state.portal.found = true;
    showDialog('Celah dimensi muncul di peta! Dekati dan tekan E untuk berinteraksi — tekan E lagi untuk masuk setelah 10 soal selesai.');
  }
}

function getRect(obj, width = obj.width, height = obj.height) {
  return { x: obj.x, y: obj.y, width, height };
}

function rectIntersect(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showEnding(type) {
  endingOverlay.classList.remove('hidden');
  const data = {
    TRUE: {
      title: 'TRUE ENDING',
      text: 'Cahaya modern menyapu penglihatanmu. Kamu kembali ke dunia asal — persis pada waktu kamu berangkat.',
      extra: 'Pemain: Aku… pulang. Aku memahami perjalanan manusia dari bertahan hidup hingga berkembang. Sistem: Pengetahuanmu menutup pusaran. Selamat datang di rumah.',
    },
    GOOD: {
      title: 'GOOD ENDING',
      text: 'Pusaran melemah tetapi tidak menghilang sepenuhnya. Kamu mengerti banyak, meski masih ada yang perlu dilalui.',
      extra: 'Pemain: Aku belum sempurna, tapi aku tidak lagi kosong. Sistem: Perjalananmu berarti — lanjutkan belajar di duniamu.',
    },
    BAD: {
      title: 'BAD ENDING',
      text: 'Gelombang waktu mendorongmu jauh ke belakang — ke zaman Arkeozoikum yang keras. Tubuhmu tidak siap; napas terhenti di lautan purba.',
      extra: 'Pemain: Terlalu… dingin… ini bukan… Sistem: Jika pemahaman ditinggalkan, waktu memakan yang tersesat. Akhir tragis tak terelakkan.',
    },
    SECRET: {
      title: 'SECRET ENDING',
      text: 'Kamu memilih tinggal. Dari api unggun menjadi tembok kota — kamu membangun kerajaan dan diakui sebagai raja yang adil.',
      extra: 'Rakyat: Panjang umur sang penguasa! Pemain: Di zaman ini, aku menemukan tujuan. Aku bahagia memimpin dengan ilmu yang kutemukan. Sistem: Legenda baru lahir di garis waktu alternatif.',
    },
  };
  const block = data[type] || data.GOOD;
  endingTitle.textContent = block.title;
  endingDialogue.innerText = '';
  const convo = document.getElementById('ending-conversation');
  convo.innerText = '';
  typeText(block.text, endingDialogue, 32);
  setTimeout(() => {
    typeText(block.extra, convo, 28);
  }, block.text.length * 32 + 400);
  playBeep(type === 'BAD' ? 100 : 440, 0.12);
}

start();
