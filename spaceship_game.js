/**
 * ============================================================================
 * CSS HORIZON — AMONG US-INSPIRED SPACESHIP SURVIVAL GAME
 * Complete Game Engine, Player Exploration, Spaceship Map & Tasks
 * ============================================================================
 */

// ============================================================================
// 1. SOUND ENGINE (Synthesized Web Audio API)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.lastStepTime = 0;
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.1, volume = 0.05) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playStep() {
    const now = Date.now();
    if (now - this.lastStepTime < 280) return;
    this.lastStepTime = now;
    this.playTone(120 + Math.random() * 40, 'triangle', 0.05, 0.03);
  }

  playClick() {
    this.playTone(850, 'triangle', 0.04, 0.04);
  }

  playUse() {
    this.playTone(450, 'sine', 0.08, 0.06);
    setTimeout(() => this.playTone(700, 'sine', 0.12, 0.05), 50);
  }

  playLaser() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playExplosion() {
    if (this.muted) return;
    this.playTone(90, 'sawtooth', 0.25, 0.08);
  }

  playWireSnap() {
    this.playTone(520, 'square', 0.08, 0.05);
    setTimeout(() => this.playTone(780, 'triangle', 0.1, 0.06), 60);
  }

  playChime() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.07), idx * 90);
    });
  }

  playError() {
    this.playTone(220, 'sawtooth', 0.12, 0.06);
    setTimeout(() => this.playTone(180, 'sawtooth', 0.18, 0.06), 100);
  }

  playAlarm() {
    if (this.muted) return;
    this.playTone(700, 'sawtooth', 0.2, 0.07);
    setTimeout(() => this.playTone(550, 'sawtooth', 0.2, 0.07), 200);
  }

  playVictory() {
    if (this.muted) return;
    const fanfare = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
    fanfare.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.28, 0.09), i * 140);
    });
  }

  playDefeat() {
    if (this.muted) return;
    const sad = [440, 392, 349.23, 261.63];
    sad.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sawtooth', 0.4, 0.08), i * 200);
    });
  }
}

// ============================================================================
// 2. SPACESHIP GEOMETRY & ROOM DEFINITIONS
// ============================================================================
const SPACESHIP_MAP = {
  width: 2000,
  height: 1600,
  rooms: [
    { id: 'cafeteria', name: 'CAFETERIA', x: 750, y: 650, w: 460, h: 360, color: '#1e283d' },
    { id: 'reactor', name: 'REACTOR', x: 220, y: 660, w: 360, h: 350, color: '#131e33' },
    { id: 'electrical', name: 'ELECTRICAL', x: 440, y: 1120, w: 340, h: 300, color: '#1f2430' },
    { id: 'storage', name: 'STORAGE', x: 860, y: 1120, w: 340, h: 320, color: '#1b2230' },
    { id: 'oxygen', name: 'OXYGEN ROOM', x: 1280, y: 1080, w: 320, h: 320, color: '#14253a' },
    { id: 'navigation', name: 'NAVIGATION', x: 1440, y: 670, w: 380, h: 340, color: '#16233b' },
    { id: 'communications', name: 'COMMUNICATIONS', x: 1340, y: 260, w: 320, h: 290, color: '#182438' },
    { id: 'greenhouse', name: 'GREENHOUSE', x: 820, y: 220, w: 390, h: 310, color: '#162a22' },
    { id: 'medbay', name: 'LABORATORY / MEDBAY', x: 380, y: 270, w: 340, h: 280, color: '#172738' }
  ],
  corridors: [
    // Hallway Reactor to Cafeteria
    { x: 580, y: 780, w: 170, h: 100 },
    // Hallway Cafeteria to Navigation
    { x: 1210, y: 780, w: 230, h: 100 },
    // Hallway Cafeteria North to Greenhouse
    { x: 920, y: 530, w: 120, h: 120 },
    // Hallway Cafeteria South to Storage
    { x: 920, y: 1010, w: 120, h: 110 },
    // Hallway Storage to Electrical
    { x: 780, y: 1220, w: 80, h: 90 },
    // Hallway Storage to Oxygen
    { x: 1200, y: 1220, w: 80, h: 90 },
    // Hallway MedBay to Greenhouse
    { x: 720, y: 360, w: 100, h: 90 },
    // Hallway Greenhouse to Comms
    { x: 1210, y: 360, w: 130, h: 90 },
    // Hallway Medbay to Cafeteria
    { x: 500, y: 550, w: 90, h: 130 },
    // Hallway Comms to Navigation
    { x: 1480, y: 550, w: 90, h: 120 },
    // Hallway Reactor to Electrical
    { x: 340, y: 1010, w: 100, h: 150 }
  ]
};

// ============================================================================
// 3. TASK DEFINITIONS (Among Us Style Minigames)
// ============================================================================
const ALL_TASKS = [
  {
    id: 'wiring_electrical',
    title: 'Fix Wiring',
    room: 'ELECTRICAL',
    x: 520,
    y: 1180,
    icon: '⚡',
    instruction: 'Connect matching colored wires from left to right.'
  },
  {
    id: 'o2_filter',
    title: 'Clean O₂ Filter',
    room: 'OXYGEN ROOM',
    x: 1440,
    y: 1150,
    icon: '💨',
    instruction: 'Drag floating debris and dust leaves into the suction chute on the left.'
  },
  {
    id: 'asteroids_nav',
    title: 'Clear Asteroids',
    room: 'NAVIGATION',
    x: 1680,
    y: 860,
    icon: '☄️',
    instruction: 'Click or tap on incoming asteroids to vaporize them with ship lasers.'
  },
  {
    id: 'calibrate_nav',
    title: 'Calibrate Navigation',
    room: 'NAVIGATION',
    x: 1560,
    y: 720,
    icon: '🧭',
    instruction: 'Drag the targeting reticle to align with the central crosshair.'
  },
  {
    id: 'reactor_manifold',
    title: 'Unlock Manifolds',
    room: 'REACTOR',
    x: 320,
    y: 800,
    icon: '🔢',
    instruction: 'Click the numbered manifold switches in ascending order from 1 to 10.'
  },
  {
    id: 'divert_power',
    title: 'Divert Power',
    room: 'REACTOR',
    x: 440,
    y: 920,
    icon: '🔌',
    instruction: 'Slide the highlighted system power slider up to 100% and flip the main breaker.'
  },
  {
    id: 'refuel_storage',
    title: 'Fuel Engines',
    room: 'STORAGE',
    x: 960,
    y: 1330,
    icon: '⛽',
    instruction: 'Press and hold the red REFUEL button until the canister reaches 100% capacity.'
  },
  {
    id: 'scan_medbay',
    title: 'Scan Biological Samples',
    room: 'LABORATORY / MEDBAY',
    x: 490,
    y: 350,
    icon: '🧪',
    instruction: 'Wait for the scanner to detect an anomaly, then select the red infected sample.'
  },
  {
    id: 'food_greenhouse',
    title: 'Sort Hydroponic Produce',
    room: 'GREENHOUSE',
    x: 1040,
    y: 390,
    icon: '🌱',
    instruction: 'Drag freshly harvested produce into the green hydroponics crate.'
  },
  {
    id: 'data_upload',
    title: 'Download & Upload Data',
    room: 'COMMUNICATIONS',
    x: 1470,
    y: 360,
    icon: '📡',
    instruction: 'Click UPLOAD DATA to transmit ship flight logs to Earth Mission Control.'
  }
];

// ============================================================================
// 4. MAIN SPACESHIP SURVIVAL GAME CONTROLLER
// ============================================================================
class SpaceshipSurvivalGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new SoundEngine();

    // Player State
    this.player = {
      x: 980,
      y: 830,
      radius: 20,
      speed: 4.8,
      vx: 0,
      vy: 0,
      facingRight: true,
      walkCycle: 0,
      isMoving: false,
      color: '#f97316' // Orange crewmate
    };

    // Camera
    this.camera = { x: 0, y: 0 };

    // Survival Metrics (STRICT MINIMAL: CO2, O2, Food)
    this.co2 = 15.0; // starts low (15%), rises to 100%
    this.o2 = 90.0;  // starts high (90%), drops to 0%
    this.food = 85.0;// starts high (85%), drops to 0%

    // Tasks Management
    this.assignedTasks = [];
    this.completedTasksCount = 0;
    this.nearestConsole = null;
    this.activeMinigame = null;

    // Keys State
    this.keys = {};
    this.mouseTarget = null;
    this.isMouseDown = false;

    // Game Lifecycle
    this.gameActive = false;
    this.gameStartTime = 0;
    this.alarmActive = false;
    this.alarmPulse = 0;

    // Starfield Parallax Particles
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * SPACESHIP_MAP.width,
        y: Math.random() * SPACESHIP_MAP.height,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.4 + 0.1
      });
    }

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.bindControls();
    this.setupMinigameClose();

    // Select 8 assigned tasks for this mission
    this.assignedTasks = ALL_TASKS.slice(0, 8).map(t => ({ ...t, completed: false }));
    this.renderChecklist();
    this.updateHUD();

    // Start Animation Loop
    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindControls() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (this.nearestConsole && !this.activeMinigame) {
          e.preventDefault();
          this.openConsole(this.nearestConsole);
        }
      }
      if (e.key === 'Escape') {
        this.closeConsole();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse / Touch Navigation
    this.canvas.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.updateMouseTarget(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        this.updateMouseTarget(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.mouseTarget = null;
    });

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.isMouseDown = true;
        this.updateMouseTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.updateMouseTarget(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isMouseDown = false;
      this.mouseTarget = null;
    });

    // USE button
    const btnUse = document.getElementById('btn-use');
    if (btnUse) {
      btnUse.addEventListener('click', () => {
        if (this.nearestConsole && !this.activeMinigame) {
          this.openConsole(this.nearestConsole);
        }
      });
    }

    // Audio toggle
    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.sound.muted = !this.sound.muted;
        document.getElementById('sound-icon').textContent = this.sound.muted ? '🔇' : '🔊';
        if (!this.sound.muted) this.sound.playClick();
      });
    }

    // Help Button
    const btnHelp = document.getElementById('btn-help');
    const helpModal = document.getElementById('help-modal');
    if (btnHelp && helpModal) {
      btnHelp.addEventListener('click', () => {
        this.sound.playClick();
        helpModal.classList.add('active');
      });
      document.getElementById('btn-close-help').onclick = () => {
        this.sound.playClick();
        helpModal.classList.remove('active');
      };
    }

    // Task Checklist Toggle
    const btnToggleList = document.getElementById('btn-toggle-checklist');
    const taskList = document.getElementById('task-list');
    if (btnToggleList && taskList) {
      btnToggleList.addEventListener('click', () => {
        const isHidden = taskList.style.display === 'none';
        taskList.style.display = isHidden ? 'flex' : 'none';
        btnToggleList.textContent = isHidden ? '▲' : '▼';
      });
    }

    // Start Mission Button
    const btnStart = document.getElementById('btn-start-game');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.sound.playClick();
        document.getElementById('main-menu').classList.remove('active');
        this.startMission();
      });
    }

    // Restart Buttons
    const btnVicRestart = document.getElementById('btn-victory-restart');
    if (btnVicRestart) {
      btnVicRestart.addEventListener('click', () => {
        document.getElementById('victory-modal').classList.remove('active');
        this.resetGame();
      });
    }

    const btnDefRestart = document.getElementById('btn-defeat-restart');
    if (btnDefRestart) {
      btnDefRestart.addEventListener('click', () => {
        document.getElementById('defeat-modal').classList.remove('active');
        this.resetGame();
      });
    }
  }

  updateMouseTarget(screenX, screenY) {
    // Map screen coordinate to world space
    this.mouseTarget = {
      x: screenX + this.camera.x,
      y: screenY + this.camera.y
    };
  }

  setupMinigameClose() {
    const btnClose = document.getElementById('btn-close-task');
    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.sound.playClick();
        this.closeConsole();
      });
    }
  }

  startMission() {
    this.gameActive = true;
    this.gameStartTime = Date.now();
    this.sound.playUse();
  }

  resetGame() {
    this.player.x = 980;
    this.player.y = 830;
    this.co2 = 15.0;
    this.o2 = 90.0;
    this.food = 85.0;
    this.assignedTasks = ALL_TASKS.slice(0, 8).map(t => ({ ...t, completed: false }));
    this.completedTasksCount = 0;
    this.gameActive = true;
    this.gameStartTime = Date.now();
    this.renderChecklist();
    this.updateHUD();
    this.sound.playUse();
  }

  // ==========================================================================
  // MAIN GAME LOOP (Update & Render at 60 FPS)
  // ==========================================================================
  loop(timestamp) {
    this.update();
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    if (!this.gameActive) return;

    // 1. Player Movement & Input Handling
    let dx = 0;
    let dy = 0;

    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    // Handle mouse/touch target
    if (this.mouseTarget) {
      const dist = Math.hypot(this.mouseTarget.x - this.player.x, this.mouseTarget.y - this.player.y);
      if (dist > 15) {
        dx = (this.mouseTarget.x - this.player.x) / dist;
        dy = (this.mouseTarget.y - this.player.y) / dist;
      }
    }

    if (dx !== 0 && dy !== 0) {
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
    }

    this.player.isMoving = (dx !== 0 || dy !== 0);
    if (this.player.isMoving) {
      if (dx > 0) this.player.facingRight = true;
      if (dx < 0) this.player.facingRight = false;
      this.player.walkCycle += 0.22;
      this.sound.playStep();

      // Propose new position
      const nextX = this.player.x + dx * this.player.speed;
      const nextY = this.player.y + dy * this.player.speed;

      // Spaceship Wall Collision
      if (this.isWalkable(nextX, this.player.y)) this.player.x = nextX;
      if (this.isWalkable(this.player.x, nextY)) this.player.y = nextY;
    }

    // 2. Camera follow player smoothly
    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.12;
    this.camera.y += (targetCamY - this.camera.y) * 0.12;

    // 3. Proximity to Tasks
    this.checkTaskProximity();

    // 4. Survival Rates Progression (Tick every frame)
    this.co2 = Math.min(100, this.co2 + 0.0035); // rises gradually
    this.o2 = Math.max(0, this.o2 - 0.0028);      // drops gradually
    this.food = Math.max(0, this.food - 0.0018);  // drops gradually

    // Check Alarm state
    const isCritical = (this.co2 > 75 || this.o2 < 25);
    const overlay = document.getElementById('emergency-overlay');
    if (isCritical) {
      if (!this.alarmActive) {
        this.alarmActive = true;
        this.sound.playAlarm();
      }
      overlay.classList.add('active');
    } else {
      this.alarmActive = false;
      overlay.classList.remove('active');
    }

    // Check Defeat Conditions
    if (this.co2 >= 100 || this.o2 <= 0 || this.food <= 0) {
      this.triggerDefeat();
      return;
    }

    // 5. Update Current Room Indicator
    this.updateCurrentRoomDisplay();
    this.updateHUD();
  }

  isWalkable(x, y) {
    const pRad = this.player.radius;
    // Check if inside any room
    for (const r of SPACESHIP_MAP.rooms) {
      if (x - pRad >= r.x && x + pRad <= r.x + r.w &&
          y - pRad >= r.y && y + pRad <= r.y + r.h) {
        return true;
      }
    }
    // Check if inside any corridor
    for (const c of SPACESHIP_MAP.corridors) {
      if (x - pRad >= c.x && x + pRad <= c.x + c.w &&
          y - pRad >= c.y && y + pRad <= c.y + c.h) {
        return true;
      }
    }
    return false;
  }

  checkTaskProximity() {
    let nearest = null;
    let minDist = 75;

    for (const task of this.assignedTasks) {
      if (task.completed) continue;
      const d = Math.hypot(task.x - this.player.x, task.y - this.player.y);
      if (d < minDist) {
        minDist = d;
        nearest = task;
      }
    }

    this.nearestConsole = nearest;
    const btnUse = document.getElementById('btn-use');
    if (btnUse) {
      if (nearest) {
        btnUse.classList.remove('disabled');
        btnUse.classList.add('active');
      } else {
        btnUse.classList.add('disabled');
        btnUse.classList.remove('active');
      }
    }
  }

  updateCurrentRoomDisplay() {
    let currentRoom = 'CORRIDOR';
    for (const r of SPACESHIP_MAP.rooms) {
      if (this.player.x >= r.x && this.player.x <= r.x + r.w &&
          this.player.y >= r.y && this.player.y <= r.y + r.h) {
        currentRoom = r.name;
        break;
      }
    }
    const el = document.getElementById('current-room-text');
    if (el) el.textContent = currentRoom;
  }

  updateHUD() {
    // CO2 meter
    const barCo2 = document.getElementById('bar-co2');
    const valCo2 = document.getElementById('val-co2');
    if (barCo2 && valCo2) {
      barCo2.style.width = `${Math.min(100, this.co2)}%`;
      valCo2.textContent = `${Math.round(this.co2)}%`;
      if (this.co2 > 75) barCo2.parentElement.parentElement.classList.add('critical');
      else barCo2.parentElement.parentElement.classList.remove('critical');
    }

    // O2 meter
    const barO2 = document.getElementById('bar-o2');
    const valO2 = document.getElementById('val-o2');
    if (barO2 && valO2) {
      barO2.style.width = `${Math.max(0, this.o2)}%`;
      valO2.textContent = `${Math.round(this.o2)}%`;
      if (this.o2 < 25) barO2.parentElement.parentElement.classList.add('critical');
      else barO2.parentElement.parentElement.classList.remove('critical');
    }

    // Food meter
    const barFood = document.getElementById('bar-food');
    const valFood = document.getElementById('val-food');
    if (barFood && valFood) {
      barFood.style.width = `${Math.max(0, this.food)}%`;
      valFood.textContent = `${Math.round(this.food)}%`;
    }

    // Total Task progress
    const taskBarFill = document.getElementById('task-bar-fill');
    const taskCounter = document.getElementById('task-counter');
    if (taskBarFill && taskCounter) {
      const pct = (this.completedTasksCount / this.assignedTasks.length) * 100;
      taskBarFill.style.width = `${pct}%`;
      taskCounter.textContent = `${this.completedTasksCount} / ${this.assignedTasks.length}`;
    }
  }

  renderChecklist() {
    const listEl = document.getElementById('task-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.assignedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span class="task-item-bullet">${task.completed ? '✓' : '●'}</span>
        <span>${task.room}: ${task.title}</span>
      `;
      listEl.appendChild(li);
    });
  }

  // ==========================================================================
  // RENDERING (2D Top-Down Viewport)
  // ==========================================================================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Camera translation
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Draw Space Background & Parallax Stars
    this.renderStarfield(ctx);

    // 2. Draw Spaceship Outer Hull & Corridors
    this.renderCorridors(ctx);

    // 3. Draw Rooms, Furniture, and Flooring
    this.renderRooms(ctx);

    // 4. Draw Task Consoles with Glow Outlines
    this.renderTaskConsoles(ctx);

    // 5. Draw Animated Crewmate Player
    this.renderPlayer(ctx);

    ctx.restore();
  }

  renderStarfield(ctx) {
    ctx.fillStyle = '#060810';
    ctx.fillRect(this.camera.x - 100, this.camera.y - 100, this.canvas.width + 200, this.canvas.height + 200);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (const star of this.stars) {
      star.x -= star.speed;
      if (star.x < 0) star.x = SPACESHIP_MAP.width;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderCorridors(ctx) {
    for (const c of SPACESHIP_MAP.corridors) {
      // Wall border
      ctx.fillStyle = '#1e2535';
      ctx.fillRect(c.x - 6, c.y - 6, c.w + 12, c.h + 12);
      // Floor
      ctx.fillStyle = '#111724';
      ctx.fillRect(c.x, c.y, c.w, c.h);

      // Floor grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x, c.y, c.w, c.h);
    }
  }

  renderRooms(ctx) {
    for (const r of SPACESHIP_MAP.rooms) {
      // Outer bulkhead wall
      ctx.fillStyle = '#263045';
      ctx.fillRect(r.x - 8, r.y - 8, r.w + 16, r.h + 16);

      // Room interior floor
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Room tiles pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let tx = r.x; tx < r.x + r.w; tx += 60) {
        ctx.beginPath();
        ctx.moveTo(tx, r.y);
        ctx.lineTo(tx, r.y + r.h);
        ctx.stroke();
      }
      for (let ty = r.y; ty < r.y + r.h; ty += 60) {
        ctx.beginPath();
        ctx.moveTo(r.x, ty);
        ctx.lineTo(r.x + r.w, ty);
        ctx.stroke();
      }

      // Room Name Tag on floor
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = 'bold 22px Fredoka, Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(r.name, r.x + r.w / 2, r.y + 40);

      // Custom Room Decor
      this.renderRoomDecor(ctx, r);
    }
  }

  renderRoomDecor(ctx, room) {
    if (room.id === 'cafeteria') {
      // Large circular table in center
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(room.x + room.w / 2, room.y + room.h / 2, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.stroke();
      // Red emergency button in center
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(room.x + room.w / 2, room.y + room.h / 2, 16, 0, Math.PI * 2);
      ctx.fill();
    } else if (room.id === 'reactor') {
      // Glowing fusion core
      const pulse = Math.sin(Date.now() * 0.005) * 6;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.arc(room.x + room.w / 2, room.y + room.h / 2, 70 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(room.x + room.w / 2, room.y + room.h / 2, 45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(room.x + room.w / 2, room.y + room.h / 2, 25, 0, Math.PI * 2);
      ctx.fill();
    } else if (room.id === 'greenhouse') {
      // Hydroponic beds
      ctx.fillStyle = '#15803d';
      ctx.fillRect(room.x + 30, room.y + 70, 70, 180);
      ctx.fillRect(room.x + room.w - 100, room.y + 70, 70, 180);
      // Purple LED glow
      ctx.fillStyle = 'rgba(192, 132, 252, 0.12)';
      ctx.fillRect(room.x + 20, room.y + 60, room.w - 40, 200);
    } else if (room.id === 'navigation') {
      // Front Cockpit Window looking into space
      ctx.fillStyle = '#020617';
      ctx.fillRect(room.x + room.w - 30, room.y + 40, 22, room.h - 80);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(room.x + room.w - 30, room.y + 40, 22, room.h - 80);
    }
  }

  renderTaskConsoles(ctx) {
    for (const task of this.assignedTasks) {
      const isNear = (this.nearestConsole && this.nearestConsole.id === task.id);
      
      // Console Box
      ctx.fillStyle = task.completed ? '#1e293b' : '#334155';
      ctx.fillRect(task.x - 22, task.y - 22, 44, 44);
      ctx.strokeStyle = task.completed ? '#475569' : '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(task.x - 22, task.y - 22, 44, 44);

      // Console Screen Glass
      ctx.fillStyle = task.completed ? '#15803d' : '#0284c7';
      ctx.fillRect(task.x - 16, task.y - 16, 32, 24);

      // Pulsing Interactive Highlight when uncompleted
      if (!task.completed) {
        const pulse = Math.sin(Date.now() * 0.007) * 4;
        ctx.strokeStyle = isNear ? '#f59e0b' : 'rgba(245, 158, 11, 0.5)';
        ctx.lineWidth = isNear ? 4 : 2;
        ctx.strokeRect(task.x - 26 - pulse / 2, task.y - 26 - pulse / 2, 52 + pulse, 52 + pulse);

        // Floating Prompt Icon
        if (isNear) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(task.x, task.y - 42, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#000';
          ctx.font = 'bold 13px Fredoka, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('E', task.x, task.y - 37);
        }
      }
    }
  }

  renderPlayer(ctx) {
    const p = this.player;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 18, 18, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(p.x, p.y);
    if (!p.facingRight) ctx.scale(-1, 1);

    // Walking leg sway
    const legOffset = p.isMoving ? Math.sin(p.walkCycle) * 6 : 0;

    // Backpack
    ctx.fillStyle = '#c2410c';
    ctx.beginPath();
    ctx.roundRect(-22, -10, 10, 22, 4);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Crewmate Body
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Head / Torso
    ctx.roundRect(-14, -20, 28, 34, [14, 14, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Left & Right Legs
    ctx.fillStyle = p.color;
    ctx.fillRect(-12, 12, 10, 10 + legOffset);
    ctx.fillRect(2, 12, 10, 10 - legOffset);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-12, 12, 10, 10 + legOffset);
    ctx.strokeRect(2, 12, 10, 10 - legOffset);

    // Visor (Cyan shiny glass)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(2, -14, 16, 12, 6);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Visor Reflection
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.roundRect(5, -12, 8, 4, 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================================================
  // CONSOLE MODAL & MINIGAMES ORCHESTRATION
  // ==========================================================================
  openConsole(task) {
    this.sound.playUse();
    this.activeMinigame = task.id;

    const modal = document.getElementById('task-modal');
    document.getElementById('minigame-room-tag').textContent = `${task.room} TERMINAL`;
    document.getElementById('minigame-title').textContent = task.title;
    document.getElementById('minigame-instruction').textContent = task.instruction;

    const container = document.getElementById('minigame-container');
    container.innerHTML = '';

    // Route to dedicated minigame renderer
    switch (task.id) {
      case 'wiring_electrical':
        this.startWiringMinigame(container);
        break;
      case 'asteroids_nav':
        this.startAsteroidsMinigame(container);
        break;
      case 'o2_filter':
        this.startO2FilterMinigame(container);
        break;
      case 'divert_power':
        this.startDivertPowerMinigame(container);
        break;
      case 'reactor_manifold':
        this.startManifoldMinigame(container);
        break;
      case 'scan_medbay':
        this.startScanMinigame(container);
        break;
      case 'refuel_storage':
        this.startRefuelMinigame(container);
        break;
      case 'calibrate_nav':
        this.startCalibrateNavMinigame(container);
        break;
      case 'food_greenhouse':
        this.startFoodSortMinigame(container);
        break;
      case 'data_upload':
        this.startDataUploadMinigame(container);
        break;
      default:
        this.startGenericTask(container);
        break;
    }

    modal.classList.add('active');
  }

  closeConsole() {
    this.activeMinigame = null;
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('active');
  }

  completeCurrentTask() {
    const task = this.assignedTasks.find(t => t.id === this.activeMinigame);
    if (task && !task.completed) {
      task.completed = true;
      this.completedTasksCount++;

      // Survival Resource Recovery
      if (task.id === 'o2_filter') {
        this.co2 = Math.max(5, this.co2 - 25);
        this.o2 = Math.min(100, this.o2 + 20);
      } else if (task.id === 'food_greenhouse') {
        this.food = Math.min(100, this.food + 25);
      } else if (task.id === 'divert_power' || task.id === 'refuel_storage') {
        this.o2 = Math.min(100, this.o2 + 10);
      }

      this.sound.playChime();
      this.renderChecklist();
      this.updateHUD();

      // Show Popup Completed Banner
      const banner = document.getElementById('task-completed-banner');
      if (banner) {
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2800);
      }

      setTimeout(() => {
        this.closeConsole();
        // Check Victory
        if (this.completedTasksCount >= this.assignedTasks.length) {
          this.triggerVictory();
        }
      }, 700);
    }
  }

  // ==========================================================================
  // MINIGAME 1: FIX WIRING
  // ==========================================================================
  startWiringMinigame(container) {
    const colors = ['red', 'blue', 'yellow', 'magenta'];
    const leftColors = [...colors].sort(() => Math.random() - 0.5);
    const rightColors = [...colors].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="wiring-board" id="wiring-board">
        <canvas id="wiring-canvas"></canvas>
        <div class="wiring-col" id="wires-left"></div>
        <div class="wiring-col" id="wires-right"></div>
      </div>
    `;

    const leftCol = document.getElementById('wires-left');
    const rightCol = document.getElementById('wires-right');
    const canvas = document.getElementById('wiring-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const connections = {}; // leftIndex: rightIndex
    let activeWire = null;

    leftColors.forEach((color, idx) => {
      const node = document.createElement('div');
      node.className = `wire-node ${color}`;
      node.dataset.color = color;
      node.dataset.idx = idx;
      leftCol.appendChild(node);

      node.addEventListener('mousedown', (e) => {
        if (connections[idx] !== undefined) return;
        const rect = node.getBoundingClientRect();
        const bRect = container.getBoundingClientRect();
        activeWire = {
          color: color,
          startIdx: idx,
          startX: rect.right - bRect.left,
          startY: rect.top + rect.height / 2 - bRect.top,
          currX: e.clientX - bRect.left,
          currY: e.clientY - bRect.top
        };
      });
    });

    rightColors.forEach((color, idx) => {
      const node = document.createElement('div');
      node.className = `wire-node ${color}`;
      node.dataset.color = color;
      node.dataset.idx = idx;
      rightCol.appendChild(node);
    });

    const redrawWires = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      // Draw completed connections
      for (const lIdx in connections) {
        const rIdx = connections[lIdx];
        const lNode = leftCol.children[lIdx];
        const rNode = rightCol.children[rIdx];
        const lR = lNode.getBoundingClientRect();
        const rR = rNode.getBoundingClientRect();
        const bR = container.getBoundingClientRect();

        const x1 = lR.right - bR.left;
        const y1 = lR.top + lR.height / 2 - bR.top;
        const x2 = rR.left - bR.left;
        const y2 = rR.top + rR.height / 2 - bR.top;

        ctx.strokeStyle = lNode.dataset.color === 'red' ? '#ef4444' :
                          lNode.dataset.color === 'blue' ? '#38bdf8' :
                          lNode.dataset.color === 'yellow' ? '#eab308' : '#ec4899';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw active dragging wire
      if (activeWire) {
        ctx.strokeStyle = activeWire.color === 'red' ? '#ef4444' :
                          activeWire.color === 'blue' ? '#38bdf8' :
                          activeWire.color === 'yellow' ? '#eab308' : '#ec4899';
        ctx.beginPath();
        ctx.moveTo(activeWire.startX, activeWire.startY);
        ctx.lineTo(activeWire.currX, activeWire.currY);
        ctx.stroke();
      }
    };

    container.addEventListener('mousemove', (e) => {
      if (activeWire) {
        const bR = container.getBoundingClientRect();
        activeWire.currX = e.clientX - bR.left;
        activeWire.currY = e.clientY - bR.top;
        redrawWires();
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (!activeWire) return;
      const bR = container.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Check if dropped on a matching right node
      let matched = false;
      Array.from(rightCol.children).forEach((rNode, rIdx) => {
        const rR = rNode.getBoundingClientRect();
        if (mouseX >= rR.left && mouseX <= rR.right &&
            mouseY >= rR.top && mouseY <= rR.bottom) {
          if (rNode.dataset.color === activeWire.color) {
            connections[activeWire.startIdx] = rIdx;
            matched = true;
            this.sound.playWireSnap();
          }
        }
      });

      if (!matched) this.sound.playError();
      activeWire = null;
      redrawWires();

      if (Object.keys(connections).length === 4) {
        this.completeCurrentTask();
      }
    });
  }

  // ==========================================================================
  // MINIGAME 2: CLEAR ASTEROIDS
  // ==========================================================================
  startAsteroidsMinigame(container) {
    let destroyed = 0;
    const targetCount = 10;

    container.innerHTML = `
      <div class="asteroids-viewport" id="asteroids-viewport">
        <canvas id="asteroids-canvas"></canvas>
        <div class="asteroids-hud">DESTROYED: <span id="ast-count">0</span> / 10</div>
      </div>
    `;

    const canvas = document.getElementById('asteroids-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const asteroids = [];
    for (let i = 0; i < 7; i++) {
      asteroids.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.7,
        radius: 24 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2
      });
    }

    const lasers = [];
    const particles = [];

    const anim = () => {
      if (this.activeMinigame !== 'asteroids_nav') return;
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Asteroids
      ctx.fillStyle = '#78716c';
      ctx.strokeStyle = '#a8a29e';
      ctx.lineWidth = 3;
      asteroids.forEach(a => {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0) a.x = canvas.width;
        if (a.x > canvas.width) a.x = 0;
        if (a.y < 0) a.y = canvas.height;
        if (a.y > canvas.height) a.y = 0;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Render Lasers
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height);
        ctx.lineTo(l.x, l.y);
        ctx.stroke();
        l.life -= 0.15;
        if (l.life <= 0) lasers.splice(i, 1);
      }

      // Render Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
      }

      requestAnimationFrame(anim);
    };
    anim();

    canvas.addEventListener('click', (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      this.sound.playLaser();
      lasers.push({ x: clickX, y: clickY, life: 1 });

      // Check hit
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        if (Math.hypot(clickX - a.x, clickY - a.y) < a.radius + 10) {
          this.sound.playExplosion();
          destroyed++;
          document.getElementById('ast-count').textContent = destroyed;

          // Spawn explosion particles
          for (let p = 0; p < 12; p++) {
            particles.push({
              x: a.x,
              y: a.y,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              size: Math.random() * 5 + 2,
              color: '#f59e0b',
              life: 1
            });
          }

          // Respawn asteroid
          asteroids.splice(i, 1);
          asteroids.push({
            x: Math.random() > 0.5 ? 0 : canvas.width,
            y: Math.random() * canvas.height,
            radius: 24 + Math.random() * 16,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5
          });

          if (destroyed >= targetCount) {
            this.completeCurrentTask();
          }
          break;
        }
      }
    });
  }

  // ==========================================================================
  // MINIGAME 3: CLEAN O2 FILTER
  // ==========================================================================
  startO2FilterMinigame(container) {
    let clearedCount = 0;
    const totalDebris = 6;

    container.innerHTML = `
      <div class="filter-chamber" id="filter-chamber">
        <div class="vacuum-chute" id="vacuum-chute">
          <span class="vacuum-arrow">⬅</span>
          <span>DISPOSAL CHUTE</span>
        </div>
      </div>
    `;

    const chamber = document.getElementById('filter-chamber');
    const chute = document.getElementById('vacuum-chute');
    const icons = ['🍂', '🪨', '🍂', '🔩', '🍂', '🪨'];

    for (let i = 0; i < totalDebris; i++) {
      const piece = document.createElement('div');
      piece.className = 'debris-piece';
      piece.textContent = icons[i];
      piece.style.left = `${220 + Math.random() * 260}px`;
      piece.style.top = `${80 + Math.random() * 220}px`;
      chamber.appendChild(piece);

      let isDragging = false;
      let startX, startY;

      piece.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - piece.offsetLeft;
        startY = e.clientY - piece.offsetTop;
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        piece.style.left = `${e.clientX - startX}px`;
        piece.style.top = `${e.clientY - startY}px`;

        // Check if inside vacuum chute
        const pR = piece.getBoundingClientRect();
        const cR = chute.getBoundingClientRect();
        if (pR.left < cR.right && pR.right > cR.left &&
            pR.top < cR.bottom && pR.bottom > cR.top) {
          isDragging = false;
          piece.remove();
          this.sound.playWireSnap();
          clearedCount++;
          if (clearedCount >= totalDebris) {
            this.completeCurrentTask();
          }
        }
      });

      window.addEventListener('mouseup', () => {
        isDragging = false;
      });
    }
  }

  // ==========================================================================
  // MINIGAME 4: DIVERT POWER
  // ==========================================================================
  startDivertPowerMinigame(container) {
    const channels = ['OXYGEN', 'SHIELDS', 'ENGINES', 'COMMS', 'LIGHTS'];
    const targetIdx = 0; // Target OXYGEN

    container.innerHTML = `
      <div class="divert-power-board">
        ${channels.map((name, i) => `
          <div class="power-channel ${i === targetIdx ? 'target' : ''}">
            <input type="range" min="0" max="100" value="${i === targetIdx ? '30' : '80'}" class="slider-vertical" id="pwr-slide-${i}" />
            <span class="channel-label">${name}</span>
          </div>
        `).join('')}
      </div>
    `;

    const targetSlider = document.getElementById(`pwr-slide-${targetIdx}`);
    targetSlider.addEventListener('input', () => {
      if (parseInt(targetSlider.value) >= 98) {
        this.sound.playWireSnap();
        targetSlider.disabled = true;
        this.completeCurrentTask();
      }
    });
  }

  // ==========================================================================
  // MINIGAME 5: UNLOCK MANIFOLDS (1-10 Sequence)
  // ==========================================================================
  startManifoldMinigame(container) {
    let currentExpected = 1;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="manifold-grid" id="manifold-grid">
        ${nums.map(n => `<button class="manifold-btn" data-num="${n}">${n}</button>`).join('')}
      </div>
    `;

    const btns = container.querySelectorAll('.manifold-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.num);
        if (val === currentExpected) {
          this.sound.playTone(300 + currentExpected * 60, 'triangle', 0.12, 0.06);
          btn.classList.add('active-correct');
          currentExpected++;
          if (currentExpected > 10) {
            this.completeCurrentTask();
          }
        } else {
          // Mistake: Reset
          this.sound.playError();
          currentExpected = 1;
          btns.forEach(b => b.classList.remove('active-correct'));
        }
      });
    });
  }

  // ==========================================================================
  // MINIGAME 6: SCAN BIOLOGICAL SAMPLES
  // ==========================================================================
  startScanMinigame(container) {
    const anomalyIdx = 2; // Tube 3 is infected
    container.innerHTML = `
      <div class="sample-scanner-stage">
        <div class="samples-rack">
          <div class="test-tube"><div class="tube-liquid" style="background:#22c55e;"></div></div>
          <div class="test-tube"><div class="tube-liquid" style="background:#38bdf8;"></div></div>
          <div class="test-tube anomaly" id="anomaly-tube"><div class="tube-liquid" style="background:#ef4444;"></div></div>
          <div class="test-tube"><div class="tube-liquid" style="background:#eab308;"></div></div>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.95rem; color:#f87171;">⚠️ ANOMALOUS PATHOGEN DETECTED IN SAMPLE #3</div>
      </div>
    `;

    document.getElementById('anomaly-tube').addEventListener('click', () => {
      this.sound.playUse();
      this.completeCurrentTask();
    });
  }

  // ==========================================================================
  // MINIGAME 7: REFUEL ENGINES
  // ==========================================================================
  startRefuelMinigame(container) {
    container.innerHTML = `
      <div class="refuel-stage">
        <div class="fuel-gauge-canister">
          <div class="fuel-fill-level" id="fuel-fill-level"></div>
        </div>
        <button class="btn-hold-refuel" id="btn-refuel">HOLD TO<br>REFUEL</button>
      </div>
    `;

    const fillLevel = document.getElementById('fuel-fill-level');
    const btn = document.getElementById('btn-refuel');
    let pct = 0;
    let interval = null;

    const startPumping = () => {
      interval = setInterval(() => {
        pct += 2.5;
        fillLevel.style.height = `${pct}%`;
        this.sound.playTone(200 + pct * 2, 'sawtooth', 0.05, 0.02);
        if (pct >= 100) {
          clearInterval(interval);
          this.completeCurrentTask();
        }
      }, 50);
    };

    const stopPumping = () => {
      clearInterval(interval);
    };

    btn.addEventListener('mousedown', startPumping);
    btn.addEventListener('mouseup', stopPumping);
    btn.addEventListener('mouseleave', stopPumping);
    btn.addEventListener('touchstart', startPumping, { passive: true });
    btn.addEventListener('touchend', stopPumping);
  }

  // ==========================================================================
  // MINIGAME 8: CALIBRATE NAVIGATION
  // ==========================================================================
  startCalibrateNavMinigame(container) {
    container.innerHTML = `
      <div class="navigation-reticle-stage" id="nav-stage">
        <div class="radar-ring" style="width:260px; height:260px;"></div>
        <div class="radar-ring" style="width:160px; height:160px;"></div>
        <div class="radar-ring" style="width:70px; height:70px;"></div>
        <div class="target-crosshair" id="nav-target" style="left:40px; top:40px;">🎯</div>
      </div>
    `;

    const target = document.getElementById('nav-target');
    const stage = document.getElementById('nav-stage');
    let isDragging = false;

    target.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left - 22;
      const y = e.clientY - rect.top - 22;
      target.style.left = `${x}px`;
      target.style.top = `${y}px`;

      // Check alignment in center (160, 160)
      if (Math.hypot(x - 138, y - 138) < 18) {
        isDragging = false;
        target.classList.add('aligned');
        this.sound.playWireSnap();
        this.completeCurrentTask();
      }
    });
    window.addEventListener('mouseup', () => isDragging = false);
  }

  // ==========================================================================
  // MINIGAME 9: SORT HYDROPONIC PRODUCE
  // ==========================================================================
  startFoodSortMinigame(container) {
    container.innerHTML = `
      <div class="food-sort-stage">
        <div class="food-items-row" id="food-items-row">
          <div class="food-item-token" draggable="true" data-type="produce">🥔</div>
          <div class="food-item-token" draggable="true" data-type="produce">🍅</div>
          <div class="food-item-token" draggable="true" data-type="produce">🥕</div>
        </div>
        <div class="food-bins-row">
          <div class="food-bin" id="bin-produce">
            <span style="font-size:2rem;">🥬</span>
            <span>HYDROPONICS BIN</span>
          </div>
        </div>
      </div>
    `;

    const bin = document.getElementById('bin-produce');
    let remaining = 3;

    container.querySelectorAll('.food-item-token').forEach(token => {
      token.addEventListener('click', () => {
        token.remove();
        this.sound.playClick();
        remaining--;
        if (remaining <= 0) {
          this.completeCurrentTask();
        }
      });
    });
  }

  // ==========================================================================
  // MINIGAME 10: DATA UPLOAD
  // ==========================================================================
  startDataUploadMinigame(container) {
    container.innerHTML = `
      <div class="data-transfer-stage">
        <div class="transfer-folder-anim">📁</div>
        <div class="transfer-progress-frame">
          <div class="transfer-progress-fill" id="upload-fill"></div>
        </div>
        <button class="btn-transfer-action" id="btn-do-upload">TRANSMIT DATA</button>
      </div>
    `;

    const btn = document.getElementById('btn-do-upload');
    const fill = document.getElementById('upload-fill');

    btn.addEventListener('click', () => {
      btn.disabled = true;
      let pct = 0;
      const interval = setInterval(() => {
        pct += 5;
        fill.style.width = `${pct}%`;
        this.sound.playTone(600 + pct * 4, 'sine', 0.05, 0.02);
        if (pct >= 100) {
          clearInterval(interval);
          this.completeCurrentTask();
        }
      }, 80);
    });
  }

  startGenericTask(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.5rem;">
        <div style="font-size:3.5rem;">🔧</div>
        <button class="btn-primary-large" id="btn-generic-complete">COMPLETE REPAIR</button>
      </div>
    `;
    document.getElementById('btn-generic-complete').onclick = () => this.completeCurrentTask();
  }

  // ==========================================================================
  // GAME OVER & VICTORY
  // ==========================================================================
  triggerVictory() {
    this.gameActive = false;
    this.sound.playVictory();

    const elapsedSeconds = Math.round((Date.now() - this.gameStartTime) / 1000);
    const mins = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(elapsedSeconds % 60).padStart(2, '0');

    document.getElementById('vic-time-text').textContent = `${mins}:${secs}`;
    document.getElementById('vic-o2-text').textContent = `${Math.round(this.o2)}%`;
    document.getElementById('vic-co2-text').textContent = `${Math.round(this.co2)}%`;

    document.getElementById('victory-modal').classList.add('active');
  }

  triggerDefeat() {
    this.gameActive = false;
    this.sound.playDefeat();

    let reason = "Life support systems failed. The crew suffocated.";
    if (this.co2 >= 100) reason = "CO₂ accumulation reached 100%. The ship atmosphere became toxic.";
    else if (this.o2 <= 0) reason = "Atmospheric oxygen depleted to 0%. The crew suffocated.";
    else if (this.food <= 0) reason = "Food rations reached 0%. The crew was unable to sustain operations.";

    document.getElementById('defeat-reason').textContent = reason;
    document.getElementById('defeat-modal').classList.add('active');
  }
}

// Global initialization on DOM ready
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.crewGame = new SpaceshipSurvivalGame();
  });
}
