/**
 * ============================================================================
 * CHRONO RESUPPLY: SEVEN DAYS ON THE CSS CHRYSALIS
 * 2D JRPG Space Adventure & Survival Simulator
 * ============================================================================
 */

// ============================================================================
// 1. JRPG SYNTHESIZED SOUND ENGINE
// ============================================================================
class JrpgSoundEngine {
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
    if (now - this.lastStepTime < 260) return;
    this.lastStepTime = now;
    this.playTone(160 + Math.random() * 30, 'triangle', 0.04, 0.02);
  }

  playTalkBleep(speaker = 'leo') {
    if (this.muted) return;
    let pitch = 650;
    if (speaker === 'vance') pitch = 380;
    else if (speaker === 'maya') pitch = 780;
    else if (speaker === 'tariq') pitch = 480;
    this.playTone(pitch + Math.random() * 60, 'sine', 0.04, 0.03);
  }

  playClick() {
    this.playTone(920, 'triangle', 0.04, 0.04);
  }

  playImpact() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.6);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch (e) {}
  }

  playAlarm() {
    if (this.muted) return;
    this.playTone(720, 'sawtooth', 0.16, 0.06);
    setTimeout(() => this.playTone(540, 'sawtooth', 0.16, 0.06), 160);
  }

  playLaser() {
    if (this.muted) return;
    this.playTone(880, 'sawtooth', 0.12, 0.06);
  }

  playChime() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.06), idx * 80);
    });
  }

  playVictoryFanfare() {
    if (this.muted) return;
    const fanfare = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50, 1318.5];
    fanfare.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.35, 0.08), i * 130);
    });
  }

  playDefeat() {
    if (this.muted) return;
    const sad = [440, 392, 349.23, 261.63];
    sad.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 'sawtooth', 0.35, 0.08), i * 180);
    });
  }
}

// ============================================================================
// 2. GRID-BASED SPACESHIP WORLD & MAP
// ============================================================================
const TILE_SIZE = 38;
const GRID_COLS = 48;
const GRID_ROWS = 36;

const ROOM_DEFS = [
  { id: 'bridge', name: 'COMMAND BRIDGE', c1: 17, r1: 2, c2: 30, r2: 9, color: '#16233b' },
  { id: 'comms', name: 'COMMUNICATIONS HUB', c1: 34, r1: 2, c2: 45, r2: 9, color: '#182438' },
  { id: 'quarters', name: 'CREW QUARTERS', c1: 3, r1: 2, c2: 14, r2: 9, color: '#1f2430' },
  { id: 'atrium', name: 'CENTRAL ATRIUM', c1: 16, r1: 12, c2: 31, r2: 21, color: '#1e283d' },
  { id: 'lab', name: 'RESEARCH LABORATORY', c1: 3, r1: 12, c2: 13, r2: 21, color: '#172738' },
  { id: 'hydroponics', name: 'HYDROPONICS GARDEN', c1: 34, r1: 12, c2: 45, r2: 21, color: '#162a22' },
  { id: 'lifesupport', name: 'LIFE SUPPORT (AIR SHAFT)', c1: 3, r1: 24, c2: 14, r2: 32, color: '#14253a' },
  { id: 'engineering', name: 'ENGINEERING BAY', c1: 17, r1: 24, c2: 30, r2: 33, color: '#131e33' },
  { id: 'storage', name: 'STORAGE BAY', c1: 34, r1: 24, c2: 45, r2: 32, color: '#1b2230' }
];

const CORRIDOR_DEFS = [
  { c1: 22, r1: 9, c2: 25, r2: 12 },
  { c1: 22, r1: 21, c2: 25, r2: 24 },
  { c1: 14, r1: 5, c2: 17, r2: 7 },
  { c1: 30, r1: 5, c2: 34, r2: 7 },
  { c1: 13, r1: 15, c2: 16, r2: 18 },
  { c1: 31, r1: 15, c2: 34, r2: 18 },
  { c1: 7, r1: 21, c2: 10, r2: 24 },
  { c1: 38, r1: 21, c2: 41, r2: 24 },
  { c1: 14, r1: 27, c2: 17, r2: 29 },
  { c1: 30, r1: 27, c2: 34, r2: 29 }
];

// Interactive Objects / Consoles in the Spaceship
const INTERACTIVE_OBJECTS = [
  { id: 'console_bridge', type: 'task', taskId: 'asteroids', name: 'Tactical Defense Terminal', room: 'COMMAND BRIDGE', c: 24, r: 4, icon: '☄️' },
  { id: 'console_airshaft', type: 'task', taskId: 'o2_filter', name: 'Damaged Air Shaft & Scrubber', room: 'LIFE SUPPORT', c: 8, r: 27, icon: '💨' },
  { id: 'console_hydro', type: 'task', taskId: 'hydroponics', name: 'Aeroponic Irrigation Rack', room: 'HYDROPONICS GARDEN', c: 39, r: 16, icon: '🌱' },
  { id: 'console_wiring', type: 'task', taskId: 'wiring', name: 'Power Distribution Junction', room: 'ENGINEERING BAY', c: 22, r: 27, icon: '⚡' },
  { id: 'console_manifold', type: 'task', taskId: 'manifold', name: 'Antimatter Reactor Manifold', room: 'ENGINEERING BAY', c: 26, r: 27, icon: '🔢' },
  { id: 'console_storage', type: 'task', taskId: 'refuel', name: 'Coolant & Fuel Reserves', room: 'STORAGE BAY', c: 39, r: 27, icon: '⛽' },
  { id: 'console_lab', type: 'task', taskId: 'scan', name: 'Bio-Analyzer Scanner', room: 'RESEARCH LABORATORY', c: 8, r: 16, icon: '🧪' },
  { id: 'console_comms', type: 'task', taskId: 'comms', name: 'Long-Range Satellite Transceiver', room: 'COMMUNICATIONS HUB', c: 39, r: 4, icon: '📡' },
  { id: 'bunk_bed', type: 'rest', name: 'Crew Bunk Bed', room: 'CREW QUARTERS', c: 8, r: 4, icon: '🛏️' }
];

// NPC Crew Members
const CREW_NPCS = [
  {
    id: 'vance',
    name: 'Captain Vance',
    role: 'Ship Commander',
    room: 'COMMAND BRIDGE',
    c: 24,
    r: 6,
    color: '#ef4444'
  },
  {
    id: 'maya',
    name: 'Maya',
    role: 'Chief Engineer',
    room: 'ENGINEERING BAY',
    c: 24,
    r: 30,
    color: '#f59e0b'
  },
  {
    id: 'tariq',
    name: 'Dr. Tariq',
    role: 'Astrobiologist',
    room: 'RESEARCH LABORATORY',
    c: 8,
    r: 18,
    color: '#10b981'
  }
];

// ============================================================================
// 3. SEVEN DAYS STORY SCRIPT & QUEST PROGRESSION
// ============================================================================
const STORY_CAMPAIGN = [
  {
    day: 1,
    title: "DAY 1 OF 7",
    chapter: "THE IMPACT",
    introLog: "An asteroid has struck near the air shaft. Life-support is compromised and Earth reports our resupply ship is delayed by 7 days. We must stabilize the ship.",
    steps: [
      {
        id: 'talk_vance',
        targetId: 'vance',
        objective: "Speak with Captain Vance on the Command Bridge.",
        dialogue: [
          { speaker: 'vance', text: "Cadet Leo! Thank stars you're on your feet. That asteroid shook the whole superstructure." },
          { speaker: 'leo', text: "Captain! What's the damage? I heard alarms ringing in the lower corridors." },
          { speaker: 'vance', text: "The impact punctured the main air shaft right above Life Support. Maya is securing engineering, but I need you to inspect the air shaft and clear the debris." },
          { speaker: 'leo', text: "Understood, Captain. Heading straight to Life Support!" }
        ]
      },
      {
        id: 'fix_airshaft',
        targetId: 'console_airshaft',
        objective: "Clear the debris blocking the Air Shaft in Life Support.",
        taskMinigame: 'o2_filter'
      },
      {
        id: 'check_storage',
        targetId: 'console_storage',
        objective: "Check emergency food and coolant reserves in Storage Bay.",
        taskMinigame: 'refuel'
      },
      {
        id: 'rest_bunk',
        targetId: 'bunk_bed',
        objective: "Return to Crew Quarters and rest for the night.",
        dialogue: [
          { speaker: 'leo', text: "The air shaft is cleared and rations are accounted for. We survived our first day... Six more to go." }
        ]
      }
    ],
    debrief: "The air shaft has been temporarily cleared. Maya and Dr. Tariq are monitoring life-support fluctuations, but we made it through our first day. Six days until Valkyrie arrives."
  },
  {
    day: 2,
    title: "DAY 2 OF 7",
    chapter: "LIFE SUPPORT CRISIS",
    introLog: "Day 2 begins. Carbon dioxide levels are creeping upward due to damaged scrubber filters. Dr. Tariq needs assistance in the Laboratory.",
    steps: [
      {
        id: 'talk_tariq',
        targetId: 'tariq',
        objective: "Meet Dr. Tariq in the Research Laboratory.",
        dialogue: [
          { speaker: 'tariq', text: "Good morning, Leo. Look at these sensor readouts... our CO2 scrubbers are struggling." },
          { speaker: 'leo', text: "Is the air toxic, Doctor?" },
          { speaker: 'tariq', text: "Not yet, but if we don't purify the biological filtration cultures, we will be gasping by nightfall. I need you to scan and isolate the contaminated sample on the analyzer." }
        ]
      },
      {
        id: 'scan_lab',
        targetId: 'console_lab',
        objective: "Isolate contaminated culture on the Bio-Analyzer Scanner.",
        taskMinigame: 'scan'
      },
      {
        id: 'purge_airshaft',
        targetId: 'console_airshaft',
        objective: "Recalibrate the Life Support scrubber airflow.",
        taskMinigame: 'o2_filter'
      },
      {
        id: 'rest_bunk_d2',
        targetId: 'bunk_bed',
        objective: "Rest in Crew Quarters.",
        dialogue: [
          { speaker: 'leo', text: "Clean air is circulating again. The crew breathes easy tonight. Five days remain." }
        ]
      }
    ],
    debrief: "Dr. Tariq's cultures are stable and oxygen flow is back within nominal margins. The habitat is quiet again tonight."
  },
  {
    day: 3,
    title: "DAY 3 OF 7",
    chapter: "FOOD & SUSTENANCE",
    introLog: "Day 3. Our emergency pre-packaged rations are half-depleted. We must restore the Hydroponics Garden to yield fresh produce.",
    steps: [
      {
        id: 'talk_tariq_hydro',
        targetId: 'tariq',
        objective: "Ask Dr. Tariq about our food reserves.",
        dialogue: [
          { speaker: 'tariq', text: "Leo, our sealed rations are dropping fast. But the good news is our hydroponic potato and tomato vines have bloomed!" },
          { speaker: 'leo', text: "Can we harvest them today?" },
          { speaker: 'tariq', text: "Yes! Head to the Hydroponics Garden, flush the nutrient irrigation line, and harvest the ripe produce." }
        ]
      },
      {
        id: 'harvest_hydro',
        targetId: 'console_hydro',
        objective: "Flush irrigation and harvest crops in Hydroponics Garden.",
        taskMinigame: 'hydroponics'
      },
      {
        id: 'store_rations',
        targetId: 'console_storage',
        objective: "Store the fresh produce in the Storage Bay.",
        dialogue: [
          { speaker: 'leo', text: "Fresh greens stored safely! The mess hall smells wonderful tonight." }
        ]
      },
      {
        id: 'rest_bunk_d3',
        targetId: 'bunk_bed',
        objective: "Rest in Crew Quarters.",
        dialogue: [
          { speaker: 'leo', text: "A warm meal did wonders for crew morale. Four days until resupply." }
        ]
      }
    ],
    debrief: "The Hydroponics Garden yielded fresh, nutritious produce. Captain Vance smiled for the first time since the asteroid impact."
  },
  {
    day: 4,
    title: "DAY 4 OF 7",
    chapter: "POWER BROWNOUT",
    introLog: "Day 4. Lights flicker and auxiliary alarms hum. Power conduits connecting Engineering to the rest of the ship are failing.",
    steps: [
      {
        id: 'talk_maya',
        targetId: 'maya',
        objective: "Report to Engineer Maya in the Engineering Bay.",
        dialogue: [
          { speaker: 'maya', text: "Leo! Grab a soldering kit! The power grid took a massive surge when the asteroid clipped our hull!" },
          { speaker: 'leo', text: "Where do we start, Maya?" },
          { speaker: 'maya', text: "First, rewire the fried junction box on the port wall. Then help me reset the reactor manifolds in exact sequence!" }
        ]
      },
      {
        id: 'fix_wires',
        targetId: 'console_wiring',
        objective: "Rewire the severed junction in Engineering Bay.",
        taskMinigame: 'wiring'
      },
      {
        id: 'reset_manifold',
        targetId: 'console_manifold',
        objective: "Stabilize the Reactor Manifold in Engineering Bay.",
        taskMinigame: 'manifold'
      },
      {
        id: 'rest_bunk_d4',
        targetId: 'bunk_bed',
        objective: "Rest in Crew Quarters.",
        dialogue: [
          { speaker: 'leo', text: "The hum of the reactor is steady again. Warm light fills the corridors. Three days to go." }
        ]
      }
    ],
    debrief: "Maya and Leo restored full electrical voltage across all decks. The ship's batteries are charging efficiently."
  },
  {
    day: 5,
    title: "DAY 5 OF 7",
    chapter: "THE LONG-RANGE BEACON",
    introLog: "Day 5. We need to calibrate the deep space antenna and establish communication with the delayed resupply ship Valkyrie.",
    steps: [
      {
        id: 'talk_vance_comms',
        targetId: 'vance',
        objective: "Speak with Captain Vance on the Bridge.",
        dialogue: [
          { speaker: 'vance', text: "Leo, today is our best orbital window to contact Valkyrie-1." },
          { speaker: 'leo', text: "Is the communications array operational?" },
          { speaker: 'vance', text: "The antenna needs manual coordinate calibration in the Communications Hub. Transmit our telemetry and listen for their reply." }
        ]
      },
      {
        id: 'calibrate_comms',
        targetId: 'console_comms',
        objective: "Calibrate the antenna and transmit beacon in Comms Hub.",
        taskMinigame: 'comms'
      },
      {
        id: 'report_vance_d5',
        targetId: 'vance',
        objective: "Report the transmission result to Captain Vance.",
        dialogue: [
          { speaker: 'leo', text: "Captain! Valkyrie responded! They confirmed their approach trajectory. Two more days!" },
          { speaker: 'vance', text: "Splendid work, Cadet. The whole crew owes you our lives." }
        ]
      },
      {
        id: 'rest_bunk_d5',
        targetId: 'bunk_bed',
        objective: "Rest in Crew Quarters.",
        dialogue: [
          { speaker: 'leo', text: "We heard human voices from Earth over the static. Hope is stronger than ever." }
        ]
      }
    ],
    debrief: "Valkyrie-1 confirms orbital deceleration burn. They are locked onto our transponder. Just two days left."
  },
  {
    day: 6,
    title: "DAY 6 OF 7",
    chapter: "MICROMETEORITE STORM",
    introLog: "Day 6. A dense cluster of space rocks is drifting into our orbital path. We must protect the ship's observation vista and solar wings.",
    steps: [
      {
        id: 'talk_vance_storm',
        targetId: 'vance',
        objective: "Join Captain Vance on the Bridge for defense station.",
        dialogue: [
          { speaker: 'vance', text: "All hands to battle stations! A debris field is on collision course!" },
          { speaker: 'leo', text: "Defensive point-defense lasers armed and ready!" },
          { speaker: 'vance', text: "Take the tactical console, Leo! Vaporize those rocks before they breach our hull!" }
        ]
      },
      {
        id: 'defense_asteroids',
        targetId: 'console_bridge',
        objective: "Destroy incoming asteroids using the Bridge defense console.",
        taskMinigame: 'asteroids'
      },
      {
        id: 'final_inspection',
        targetId: 'console_airshaft',
        objective: "Perform final life-support seal inspection in Life Support.",
        taskMinigame: 'o2_filter'
      },
      {
        id: 'rest_bunk_d6',
        targetId: 'bunk_bed',
        objective: "Rest before the arrival tomorrow.",
        dialogue: [
          { speaker: 'leo', text: "The storm has passed. Tomorrow, Valkyrie arrives. We made it." }
        ]
      }
    ],
    debrief: "The hull held firm against the meteor storm. All systems are green. Tomorrow is arrival day."
  },
  {
    day: 7,
    title: "DAY 7 OF 7",
    chapter: "VALKYRIE ARRIVES",
    introLog: "Day 7! The resupply freighter Valkyrie-1 is on final docking approach. Gather with the crew on the Bridge.",
    steps: [
      {
        id: 'gather_bridge',
        targetId: 'vance',
        objective: "Gather with the crew on the Command Bridge.",
        dialogue: [
          { speaker: 'vance', text: "Crew of the Chrysalis... Seven days ago, an asteroid took our air shaft and left us stranded in the dark." },
          { speaker: 'maya', text: "We rewired the ship, patched the conduits, and kept the engines humming!" },
          { speaker: 'tariq', text: "We grew food, purified our air, and stood by each other." },
          { speaker: 'vance', text: "And thanks to Cadet Leo, we survived every single day. Look through the panoramic vista... she's here!" }
        ]
      },
      {
        id: 'view_arrival',
        targetId: 'console_bridge',
        objective: "Witness Valkyrie-1 docking from the Bridge Vista.",
        dialogue: [
          { speaker: 'leo', text: "Contact light! Docking clamps engaged! Valkyrie has arrived!" }
        ]
      }
    ],
    debrief: "Mission Accomplished! Valkyrie-1 has safely docked."
  }
];

// ============================================================================
// 4. MAIN JRPG GAME CONTROLLER
// ============================================================================
class JrpgSpaceGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sound = new JrpgSoundEngine();

    // Map Grid Representation
    this.grid = [];
    this.initMapGrid();

    // Player (Cute Chibi Astronaut Leo)
    this.player = {
      x: 24 * TILE_SIZE,
      y: 8 * TILE_SIZE,
      radius: 12,
      speed: 4.2,
      facing: 'down',
      isMoving: false,
      walkTimer: 0,
      expression: 'happy'
    };

    // Camera
    this.camera = { x: 0, y: 0 };

    // Survival Resources (Bottom-Right HUD)
    this.co2 = 15.0;
    this.o2 = 92.0;
    this.food = 88.0;

    // Track all completed tasks on ship
    this.completedTasks = new Set();

    // Campaign State
    this.currentDayIdx = 0;
    this.currentStepIdx = 0;
    this.gameActive = false;

    // Cutscene & Dialogue State
    this.inCutscene = true;
    this.cutsceneStep = 0;
    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.isTyping = false;
    this.typewriterInterval = null;
    this.nearestTarget = null;
    this.activeMinigameTarget = null;

    // Keys State
    this.keys = {};
    this.mouseTarget = null;
    this.isMouseDown = false;

    // Stars Parallax
    this.stars = [];
    for (let i = 0; i < 110; i++) {
      this.stars.push({
        x: Math.random() * (GRID_COLS * TILE_SIZE),
        y: Math.random() * (GRID_ROWS * TILE_SIZE),
        size: Math.random() * 2 + 0.6,
        speed: Math.random() * 0.3 + 0.08
      });
    }

    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.bindInputs();
    this.renderTaskChecklist();
    this.startOpeningCutscene();

    requestAnimationFrame((t) => this.loop(t));
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initMapGrid() {
    this.grid = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      this.grid[r] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        this.grid[r][c] = 0;
      }
    }

    // Paint Rooms
    ROOM_DEFS.forEach(room => {
      for (let r = room.r1; r <= room.r2; r++) {
        for (let c = room.c1; c <= room.c2; c++) {
          if (r === room.r1 || r === room.r2 || c === room.c1 || c === room.c2) {
            this.grid[r][c] = 1;
          } else {
            this.grid[r][c] = 2;
          }
        }
      }
    });

    // Paint Corridors & Carve Doorways
    CORRIDOR_DEFS.forEach(corr => {
      for (let r = corr.r1; r <= corr.r2; r++) {
        for (let c = corr.c1; c <= corr.c2; c++) {
          this.grid[r][c] = 2;
        }
      }
    });
  }

  isWalkable(x, y) {
    const pRad = this.player.radius;
    const probes = [
      { x: x - pRad, y: y - pRad },
      { x: x + pRad, y: y - pRad },
      { x: x - pRad, y: y + pRad },
      { x: x + pRad, y: y + pRad }
    ];

    for (const p of probes) {
      const c = Math.floor(p.x / TILE_SIZE);
      const r = Math.floor(p.y / TILE_SIZE);
      if (r < 0 || r >= GRID_ROWS || c < 0 || c >= GRID_COLS) return false;
      if (this.grid[r][c] !== 2) return false;
    }
    return true;
  }

  bindInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.handleActionInput();
      }
      if (e.key === 'Escape') {
        this.closeMinigame();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse Navigation
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.inCutscene) {
        this.advanceOpeningCutscene();
        return;
      }
      const diagOverlay = document.getElementById('jrpg-dialogue-box');
      if (diagOverlay && diagOverlay.classList.contains('active')) {
        this.advanceDialogue();
        return;
      }
      this.isMouseDown = true;
      this.mouseTarget = { x: e.clientX + this.camera.x, y: e.clientY + this.camera.y };
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        this.mouseTarget = { x: e.clientX + this.camera.x, y: e.clientY + this.camera.y };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.mouseTarget = null;
    });

    // Action button
    const btnAct = document.getElementById('btn-action');
    if (btnAct) {
      btnAct.addEventListener('click', () => this.handleActionInput());
    }

    // Dialogue Overlay click anywhere advances dialogue
    const diagBox = document.getElementById('jrpg-dialogue-box');
    if (diagBox) {
      diagBox.addEventListener('click', () => this.advanceDialogue());
    }

    // Skip Cutscene Button
    const btnSkip = document.getElementById('btn-skip-cutscene');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => this.skipCutscene());
    }

    // Cutscene subtitle click advances scene
    const cutsceneSub = document.getElementById('cutscene-sub-box');
    if (cutsceneSub) {
      cutsceneSub.addEventListener('click', () => this.advanceOpeningCutscene());
    }

    // Sound button
    const btnSound = document.getElementById('btn-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        this.sound.muted = !this.sound.muted;
        document.getElementById('sound-icon').textContent = this.sound.muted ? '🔇' : '🔊';
        if (!this.sound.muted) this.sound.playClick();
      });
    }

    // Tasks dropdown toggle
    const btnToggleTasks = document.getElementById('btn-toggle-tasks');
    const tasksList = document.getElementById('tasks-checklist-list');
    const tasksChevron = document.getElementById('tasks-chevron');
    if (btnToggleTasks && tasksList) {
      btnToggleTasks.addEventListener('click', () => {
        const isClosed = tasksList.style.display === 'none';
        tasksList.style.display = isClosed ? 'flex' : 'none';
        if (tasksChevron) tasksChevron.textContent = isClosed ? '▲' : '▼';
      });
    }

    // Minigame Close
    const btnCloseTask = document.getElementById('btn-close-task');
    if (btnCloseTask) {
      btnCloseTask.addEventListener('click', () => this.closeMinigame());
    }

    // Day Next Button
    const btnNextDay = document.getElementById('btn-next-day');
    if (btnNextDay) {
      btnNextDay.addEventListener('click', () => {
        document.getElementById('day-transition-modal').classList.remove('active');
        this.advanceToNextDay();
      });
    }

    // Victory Restart
    const btnRestart = document.getElementById('btn-restart-game');
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        document.getElementById('ending-cutscene-modal').classList.remove('active');
        this.resetGame();
      });
    }

    // Defeat Retry
    const btnRetry = document.getElementById('btn-retry-expedition');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        document.getElementById('defeat-modal').classList.remove('active');
        this.resetGame();
      });
    }
  }

  handleActionInput() {
    if (this.inCutscene) {
      this.advanceOpeningCutscene();
      return;
    }

    const diagOverlay = document.getElementById('jrpg-dialogue-box');
    if (diagOverlay && diagOverlay.classList.contains('active')) {
      this.advanceDialogue();
      return;
    }

    if (this.nearestTarget) {
      this.sound.playClick();
      this.interactWithTarget(this.nearestTarget);
    }
  }

  // ==========================================================================
  // OPENING CINEMATIC CUTSCENE
  // ==========================================================================
  startOpeningCutscene() {
    this.inCutscene = true;
    this.cutsceneStep = 0;
    const overlay = document.getElementById('cutscene-overlay');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => this.renderCutsceneScene(), 50);
  }

  skipCutscene() {
    this.inCutscene = false;
    const overlay = document.getElementById('cutscene-overlay');
    if (overlay) overlay.classList.remove('active');
    document.getElementById('screen-fx-overlay').classList.remove('active');
    this.startDay(0);
  }

  advanceOpeningCutscene() {
    this.cutsceneStep++;
    if (this.cutsceneStep > 3) {
      this.skipCutscene();
    } else {
      this.renderCutsceneScene();
    }
  }

  renderCutsceneScene() {
    const speakerEl = document.getElementById('cutscene-speaker');
    const textEl = document.getElementById('cutscene-sub-text');
    const portraitEl = document.getElementById('cutscene-portrait');
    const stage = document.getElementById('cutscene-stage');
    const cCanvas = document.getElementById('cutscene-canvas');
    if (!cCanvas || !stage) return;
    const cCtx = cCanvas.getContext('2d');

    cCanvas.width = stage.clientWidth || window.innerWidth;
    cCanvas.height = stage.clientHeight || (window.innerHeight * 0.6);

    cCtx.fillStyle = '#060a14';
    cCtx.fillRect(0, 0, cCanvas.width, cCanvas.height);

    // Stars
    cCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 80; i++) {
      cCtx.beginPath();
      cCtx.arc(Math.random() * cCanvas.width, Math.random() * cCanvas.height, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      cCtx.fill();
    }

    // Spaceship
    cCtx.fillStyle = '#1e293b';
    cCtx.strokeStyle = '#38bdf8';
    cCtx.lineWidth = 3;
    cCtx.beginPath();
    cCtx.roundRect(cCanvas.width / 2 - 130, cCanvas.height / 2 - 40, 260, 80, 20);
    cCtx.fill();
    cCtx.stroke();

    cCtx.fillStyle = '#0284c7';
    cCtx.fillRect(cCanvas.width / 2 - 200, cCanvas.height / 2 - 25, 60, 50);
    cCtx.fillRect(cCanvas.width / 2 + 140, cCanvas.height / 2 - 25, 60, 50);

    if (this.cutsceneStep === 0) {
      speakerEl.textContent = "PROLOGUE: SCENE 1 — AN ORDINARY DAY";
      textEl.textContent = "Deep space, Year 2026. The research spaceship CSS Chrysalis glides quietly past the Martian orbital plane. Cadet Leo and the small crew prepare for their scheduled quarterly resupply...";
      portraitEl.innerHTML = this.getPortraitSVG('leo', 'happy');
      this.sound.playTone(520, 'sine', 0.2, 0.05);
    } else if (this.cutsceneStep === 1) {
      speakerEl.textContent = "SCENE 2 — THE ASTEROID IMPACT!";
      textEl.textContent = "BOOM! An unexpected rogue asteroid strikes the lower deck! Alarms shriek across the corridors, bulkhead doors seal, and thick red dust fills the life-support vents!";
      portraitEl.innerHTML = this.getPortraitSVG('leo', 'worried');
      this.sound.playImpact();
      stage.style.animation = 'shake 0.5s';
      setTimeout(() => stage.style.animation = '', 500);
      document.getElementById('screen-fx-overlay').classList.add('active');
    } else if (this.cutsceneStep === 2) {
      speakerEl.textContent = "SCENE 3 — EMERGENCY ON THE BRIDGE";
      textEl.textContent = "Captain Vance: 'Attention crew! The asteroid punctured our primary air shaft. Worse, Earth Mission Control reports the resupply ship Valkyrie encountered a navigation error... It is delayed by SEVEN DAYS!'";
      portraitEl.innerHTML = this.getPortraitSVG('vance', 'worried');
      this.sound.playAlarm();
    } else if (this.cutsceneStep === 3) {
      speakerEl.textContent = "SCENE 4 — SEVEN DAYS TO SURVIVE";
      textEl.textContent = "Captain Vance: 'Seven days. Limited oxygen, rising CO2, and scarce food. We keep this ship alive together. Cadet Leo, report to the Bridge immediately!'";
      portraitEl.innerHTML = this.getPortraitSVG('vance', 'determined');
      document.getElementById('screen-fx-overlay').classList.remove('active');
    }
  }

  // ==========================================================================
  // CAMPAIGN DAY PROGRESSION
  // ==========================================================================
  startDay(dayIdx) {
    this.currentDayIdx = dayIdx;
    this.currentStepIdx = 0;
    this.gameActive = true;

    // Reset daily tasks
    this.completedTasks.clear();
    this.renderTaskChecklist();

    const campaign = STORY_CAMPAIGN[dayIdx];
    document.getElementById('hud-day-title').textContent = campaign.title;
    document.getElementById('hud-chapter-title').textContent = campaign.chapter;

    this.player.x = 24 * TILE_SIZE;
    this.player.y = 8 * TILE_SIZE;
    this.player.facing = 'down';

    this.showToast(`✨ ${campaign.title}: ${campaign.chapter}`);
    this.updateCurrentObjective();
    this.updateHUD();
  }

  getCurrentStep() {
    const campaign = STORY_CAMPAIGN[this.currentDayIdx];
    if (!campaign) return null;
    return campaign.steps[this.currentStepIdx];
  }

  updateCurrentObjective() {
    const step = this.getCurrentStep();
    const objEl = document.getElementById('hud-objective-text');
    if (step && objEl) {
      objEl.textContent = step.objective;
    }
  }

  advanceStep() {
    this.currentStepIdx++;
    const campaign = STORY_CAMPAIGN[this.currentDayIdx];

    if (this.currentStepIdx >= campaign.steps.length) {
      this.completeDay();
    } else {
      this.updateCurrentObjective();
      this.showToast("Objective Updated!");
      this.sound.playChime();
    }
  }

  completeDay() {
    this.gameActive = false;
    this.sound.playVictoryFanfare();

    if (this.currentDayIdx >= 6) {
      this.triggerGameVictory();
      return;
    }

    const campaign = STORY_CAMPAIGN[this.currentDayIdx];
    const modal = document.getElementById('day-transition-modal');
    document.getElementById('day-deb-title').textContent = `${campaign.title} SURVIVED`;
    document.getElementById('day-deb-quote').textContent = `"${campaign.debrief}"`;
    document.getElementById('deb-o2').textContent = `${Math.round(this.o2)}%`;
    document.getElementById('deb-co2').textContent = `${Math.round(this.co2)}%`;
    document.getElementById('deb-food').textContent = `${Math.round(this.food)}%`;

    modal.classList.add('active');
  }

  advanceToNextDay() {
    this.o2 = Math.min(100, this.o2 + 10);
    this.food = Math.max(10, this.food - 8);
    this.startDay(this.currentDayIdx + 1);
  }

  // ==========================================================================
  // JRPG DIALOGUE SYSTEM
  // ==========================================================================
  startDialogueSequence(dialogues, onComplete) {
    this.dialogueQueue = dialogues;
    this.dialogueIndex = 0;
    this.onDialogueComplete = onComplete;
    this.renderDialogue();
  }

  renderDialogue() {
    const item = this.dialogueQueue[this.dialogueIndex];
    if (!item) {
      document.getElementById('jrpg-dialogue-box').classList.remove('active');
      if (this.onDialogueComplete) this.onDialogueComplete();
      return;
    }

    const box = document.getElementById('jrpg-dialogue-box');
    box.classList.add('active');

    let speakerName = "Cadet Leo";
    let speakerRole = "Mission Protagonist";
    let emotion = 'happy';

    if (item.speaker === 'vance') {
      speakerName = "Captain Vance";
      speakerRole = "Ship Commander";
      emotion = 'determined';
    } else if (item.speaker === 'maya') {
      speakerName = "Maya";
      speakerRole = "Chief Engineer";
      emotion = 'happy';
    } else if (item.speaker === 'tariq') {
      speakerName = "Dr. Tariq";
      speakerRole = "Astrobiologist";
      emotion = 'happy';
    }

    document.getElementById('dialogue-speaker-name').textContent = speakerName;
    document.getElementById('dialogue-speaker-role').textContent = speakerRole;
    document.getElementById('dialogue-portrait').innerHTML = this.getPortraitSVG(item.speaker, emotion);

    this.typewriterText(item.text, item.speaker);
  }

  typewriterText(fullText, speaker) {
    const textEl = document.getElementById('dialogue-text');
    textEl.textContent = '';
    clearInterval(this.typewriterInterval);
    this.isTyping = true;

    let i = 0;
    this.typewriterInterval = setInterval(() => {
      if (i < fullText.length) {
        textEl.textContent += fullText.charAt(i);
        i++;
        if (i % 2 === 0) this.sound.playTalkBleep(speaker);
      } else {
        clearInterval(this.typewriterInterval);
        this.isTyping = false;
      }
    }, 20);
  }

  advanceDialogue() {
    if (this.isTyping) {
      clearInterval(this.typewriterInterval);
      const item = this.dialogueQueue[this.dialogueIndex];
      document.getElementById('dialogue-text').textContent = item.text;
      this.isTyping = false;
      return;
    }

    this.sound.playClick();
    this.dialogueIndex++;
    if (this.dialogueIndex < this.dialogueQueue.length) {
      this.renderDialogue();
    } else {
      document.getElementById('jrpg-dialogue-box').classList.remove('active');
      if (this.onDialogueComplete) this.onDialogueComplete();
    }
  }

  // ==========================================================================
  // TASK CHECKLIST & PERSISTENCE
  // ==========================================================================
  renderTaskChecklist() {
    const listEl = document.getElementById('tasks-checklist-list');
    const countEl = document.getElementById('task-completion-count');
    if (!listEl) return;
    listEl.innerHTML = '';

    const taskObjects = INTERACTIVE_OBJECTS.filter(o => o.type === 'task');
    let completedCount = 0;

    taskObjects.forEach(task => {
      const isDone = this.completedTasks.has(task.id);
      if (isDone) completedCount++;

      const li = document.createElement('li');
      li.className = `task-item-row ${isDone ? 'completed' : ''}`;
      li.innerHTML = `
        <span class="task-bullet">${isDone ? '✓' : '●'}</span>
        <span>${task.room}: ${task.name}</span>
      `;
      li.addEventListener('click', () => {
        // Teleport camera/hint
        this.showToast(`Console located in ${task.room}`);
      });
      listEl.appendChild(li);
    });

    if (countEl) {
      countEl.textContent = `${completedCount}/${taskObjects.length}`;
    }
  }

  // ==========================================================================
  // EXPRESSIVE CHIBI PORTRAIT GENERATOR (RESPONSIVE SVG)
  // ==========================================================================
  getPortraitSVG(character, emotion = 'happy') {
    if (character === 'vance') {
      return `
        <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
          <circle cx="50" cy="50" r="44" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
          <path d="M 25 35 Q 50 15 75 35 Q 75 25 50 20 Q 25 25 25 35" fill="#cbd5e1"/>
          <circle cx="50" cy="52" r="28" fill="#fed7aa"/>
          <path d="M 40 62 Q 50 66 60 62 Q 50 70 40 62" fill="#94a3b8"/>
          <circle cx="42" cy="48" r="3.5" fill="#0f172a"/>
          <circle cx="58" cy="48" r="3.5" fill="#0f172a"/>
          <line x1="38" y1="42" x2="46" y2="44" stroke="#475569" stroke-width="2.5"/>
          <line x1="62" y1="44" x2="54" y2="42" stroke="#475569" stroke-width="2.5"/>
        </svg>
      `;
    } else if (character === 'maya') {
      return `
        <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
          <circle cx="50" cy="50" r="44" fill="#1e293b" stroke="#f59e0b" stroke-width="3"/>
          <circle cx="50" cy="50" r="32" fill="#78350f"/>
          <rect x="24" y="32" width="52" height="10" rx="4" fill="#f59e0b"/>
          <circle cx="50" cy="54" r="25" fill="#fde68a"/>
          <ellipse cx="40" cy="52" rx="4.5" ry="6" fill="#0f172a"/>
          <ellipse cx="60" cy="52" rx="4.5" ry="6" fill="#0f172a"/>
          <circle cx="39" cy="50" r="2" fill="#fff"/>
          <circle cx="59" cy="50" r="2" fill="#fff"/>
          <path d="M 44 65 Q 50 70 56 65" stroke="#92400e" stroke-width="2.5" fill="none"/>
        </svg>
      `;
    } else if (character === 'tariq') {
      return `
        <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
          <circle cx="50" cy="50" r="44" fill="#1e293b" stroke="#10b981" stroke-width="3"/>
          <path d="M 28 42 Q 50 20 72 42 Q 68 25 50 24 Q 32 25 28 42" fill="#1e293b"/>
          <circle cx="50" cy="54" r="26" fill="#fcd34d"/>
          <circle cx="41" cy="50" r="8" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
          <circle cx="59" cy="50" r="8" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
          <line x1="49" y1="50" x2="51" y2="50" stroke="#38bdf8" stroke-width="2.5"/>
          <circle cx="41" cy="50" r="3" fill="#0f172a"/>
          <circle cx="59" cy="50" r="3" fill="#0f172a"/>
          <path d="M 45 66 Q 50 69 55 66" stroke="#78350f" stroke-width="2" fill="none"/>
        </svg>
      `;
    }

    // Default: Cadet Leo (Cute Chibi Astronaut)
    return `
      <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
        <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
        <circle cx="50" cy="50" r="32" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <circle cx="50" cy="54" r="24" fill="#fed7aa"/>
        <ellipse cx="41" cy="50" rx="4.5" ry="6.5" fill="#0f172a"/>
        <ellipse cx="59" cy="50" rx="4.5" ry="6.5" fill="#0f172a"/>
        <circle cx="40" cy="48" r="2" fill="#fff"/>
        <circle cx="58" cy="48" r="2" fill="#fff"/>
        <circle cx="35" cy="58" r="4" fill="#fda4af" opacity="0.7"/>
        <circle cx="65" cy="58" r="4" fill="#fda4af" opacity="0.7"/>
        ${emotion === 'worried' 
          ? '<ellipse cx="50" cy="62" rx="3.5" ry="4" fill="#991b1b"/>' 
          : '<path d="M 45 61 Q 50 67 55 61" stroke="#9a3412" stroke-width="2.5" fill="none"/>'}
        <path d="M 28 35 Q 50 25 72 35" stroke="#bae6fd" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"/>
      </svg>
    `;
  }

  // ==========================================================================
  // INTERACTION HANDLING (ALWAYS ACCESSIBLE!)
  // ==========================================================================
  interactWithTarget(target) {
    const step = this.getCurrentStep();

    // 1. If NPC, speak with NPC
    if (target.isNPC) {
      if (step && step.targetId === target.id && step.dialogue) {
        this.startDialogueSequence(step.dialogue, () => {
          this.advanceStep();
        });
      } else {
        if (target.id === 'vance') {
          this.startDialogueSequence([
            { speaker: 'vance', text: "Keep a watchful eye on the life-support meters, Leo. We survive as one team." }
          ]);
        } else if (target.id === 'maya') {
          this.startDialogueSequence([
            { speaker: 'maya', text: "All systems in Engineering are operating within safe tolerances. Don't forget to check the wiring!" }
          ]);
        } else if (target.id === 'tariq') {
          this.startDialogueSequence([
            { speaker: 'tariq', text: "The hydroponic crops are thriving. Remember to harvest fresh produce to keep our rations high." }
          ]);
        }
      }
      return;
    }

    // 2. If Rest Bunk
    if (target.id === 'bunk_bed') {
      if (step && step.targetId === 'bunk_bed') {
        this.startDialogueSequence([
          { speaker: 'leo', text: "Tasks for today are accomplished. Resting in the bunk until tomorrow..." }
        ], () => {
          this.advanceStep();
        });
      } else {
        this.startDialogueSequence([
          { speaker: 'leo', text: "I still have active tasks to complete before I can rest for the night!" }
        ]);
      }
      return;
    }

    // 3. If Task Console — ALWAYS OPENS THE MINIGAME!
    if (target.type === 'task') {
      this.activeMinigameTarget = target;
      this.openMinigame(target.taskId, target);
    }
  }

  // ==========================================================================
  // MINIGAMES IMPLEMENTATION (ROBUST, DRAGGABLE, PLAYABLE)
  // ==========================================================================
  openMinigame(minigameId, target) {
    this.sound.playClick();
    const modal = document.getElementById('task-modal');
    const viewport = document.getElementById('minigame-viewport');
    document.getElementById('minigame-room-tag').textContent = target.room;
    document.getElementById('minigame-title').textContent = target.name;

    viewport.innerHTML = '';

    if (minigameId === 'o2_filter') {
      document.getElementById('minigame-instructions').textContent = "Drag debris pieces into the suction chute on the left.";
      this.renderO2Filter(viewport);
    } else if (minigameId === 'wiring') {
      document.getElementById('minigame-instructions').textContent = "Connect matching colored wires from left to right.";
      this.renderWiring(viewport);
    } else if (minigameId === 'manifold') {
      document.getElementById('minigame-instructions').textContent = "Click numbers 1 to 10 in ascending numerical order.";
      this.renderManifold(viewport);
    } else if (minigameId === 'asteroids') {
      document.getElementById('minigame-instructions').textContent = "Click incoming asteroids to blast them with defense lasers.";
      this.renderAsteroids(viewport);
    } else if (minigameId === 'hydroponics') {
      document.getElementById('minigame-instructions').textContent = "Click ripe vegetables to harvest them into the crate.";
      this.renderHydro(viewport);
    } else if (minigameId === 'scan') {
      document.getElementById('minigame-instructions').textContent = "Select the anomalous contaminated test tube.";
      this.renderScan(viewport);
    } else if (minigameId === 'refuel') {
      document.getElementById('minigame-instructions').textContent = "Hold the button until coolant levels reach 100%.";
      this.renderRefuel(viewport);
    } else if (minigameId === 'comms') {
      document.getElementById('minigame-instructions').textContent = "Click TRANSMIT BEACON to establish long-range link.";
      this.renderComms(viewport);
    }

    modal.classList.add('active');
  }

  closeMinigame() {
    const modal = document.getElementById('task-modal');
    if (modal) modal.classList.remove('active');
    this.activeMinigameTarget = null;
  }

  onMinigameComplete() {
    this.sound.playChime();
    this.closeMinigame();

    if (this.activeMinigameTarget) {
      this.completedTasks.add(this.activeMinigameTarget.id);
      this.renderTaskChecklist();
    }

    // Replenish survival meters
    this.o2 = Math.min(100, this.o2 + 15);
    this.co2 = Math.max(5, this.co2 - 15);
    this.food = Math.min(100, this.food + 15);
    this.updateHUD();

    this.showToast("Task Complete! Ship Systems Restored.");

    // Advance story step if this task was the current objective
    const step = this.getCurrentStep();
    if (step && this.activeMinigameTarget && step.targetId === this.activeMinigameTarget.id) {
      this.advanceStep();
    }
  }

  renderO2Filter(container) {
    container.innerHTML = `
      <div id="filter-box" style="position:relative; width:100%; height:100%; background:#101726; overflow:hidden;">
        <div id="v-chute" style="position:absolute; left:25px; top:60px; width:130px; height:260px; border:3px dashed #38bdf8; border-radius:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#38bdf8; font-weight:700; pointer-events:none;">
          <span style="font-size:2.5rem;">⬅</span>
          <span>SUCTION CHUTE</span>
        </div>
      </div>
    `;
    const box = document.getElementById('filter-box');
    const chute = document.getElementById('v-chute');
    let cleared = 0;
    const pieces = ['🍂', '🪨', '🍂', '🔩'];

    pieces.forEach((icon, i) => {
      const p = document.createElement('div');
      p.style.cssText = `position:absolute; left:${240 + i * 85}px; top:${100 + (i % 2) * 110}px; font-size:2.6rem; cursor:grab; user-select:none; z-index:10;`;
      p.textContent = icon;
      box.appendChild(p);

      let isDragging = false;
      let startX, startY;
      let initialLeft, initialTop;

      const onStart = (clientX, clientY) => {
        isDragging = true;
        startX = clientX;
        startY = clientY;
        initialLeft = p.offsetLeft;
        initialTop = p.offsetTop;
        p.style.cursor = 'grabbing';
      };

      const onMove = (clientX, clientY) => {
        if (!isDragging) return;
        const dx = clientX - startX;
        const dy = clientY - startY;
        p.style.left = `${initialLeft + dx}px`;
        p.style.top = `${initialTop + dy}px`;

        const pr = p.getBoundingClientRect();
        const cr = chute.getBoundingClientRect();
        if (pr.left < cr.right && pr.right > cr.left && pr.top < cr.bottom && pr.bottom > cr.top) {
          isDragging = false;
          p.remove();
          this.sound.playTone(600, 'square', 0.08, 0.05);
          cleared++;
          if (cleared >= pieces.length) this.onMinigameComplete();
        }
      };

      const onEnd = () => {
        isDragging = false;
        p.style.cursor = 'grab';
      };

      p.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onEnd);

      p.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) onStart(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) onMove(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchend', onEnd);
    });
  }

  renderWiring(container) {
    const colors = ['#ef4444', '#38bdf8', '#eab308', '#ec4899'];
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; width:100%; padding:2.5rem 4rem; height:100%; align-items:center; background:#111726;">
        <div id="w-left" style="display:flex; flex-direction:column; gap:2.2rem;">
          ${colors.map((c) => `<button class="w-btn" data-c="${c}" style="width:40px; height:40px; border-radius:10px; background:${c}; border:3px solid #000; cursor:pointer; box-shadow:0 4px 8px rgba(0,0,0,0.5);"></button>`).join('')}
        </div>
        <div style="color:#94a3b8; font-weight:700; text-align:center;">
          <div>SELECT WIRE</div>
          <div style="font-size:0.75rem; color:#64748b; margin-top:4px;">Then click matching socket</div>
        </div>
        <div id="w-right" style="display:flex; flex-direction:column; gap:2.2rem;">
          ${[...colors].reverse().map((c) => `<button class="w-tgt" data-c="${c}" style="width:40px; height:40px; border-radius:10px; background:${c}; border:3px solid #000; cursor:pointer; box-shadow:0 4px 8px rgba(0,0,0,0.5);"></button>`).join('')}
        </div>
      </div>
    `;

    let activeColor = null;
    let connected = 0;
    container.querySelectorAll('.w-btn').forEach(b => {
      b.onclick = () => {
        activeColor = b.dataset.c;
        container.querySelectorAll('.w-btn').forEach(x => x.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)');
        b.style.boxShadow = '0 0 16px #fff';
        this.sound.playTone(500, 'sine', 0.05, 0.04);
      };
    });
    container.querySelectorAll('.w-tgt').forEach(t => {
      t.onclick = () => {
        if (t.dataset.c === activeColor) {
          t.style.opacity = '0.35';
          t.disabled = true;
          this.sound.playTone(850, 'triangle', 0.08, 0.05);
          connected++;
          activeColor = null;
          if (connected >= 4) this.onMinigameComplete();
        } else {
          this.sound.playTone(200, 'sawtooth', 0.1, 0.05);
        }
      };
    });
  }

  renderManifold(container) {
    let expected = 1;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);
    container.innerHTML = `
      <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:1rem; padding:2rem; width:100%; max-width:520px;">
        ${nums.map(n => `<button class="m-btn" data-n="${n}" style="aspect-ratio:1; font-size:1.8rem; font-weight:800; background:#242f48; border:3px solid #475569; border-radius:14px; color:#fff; cursor:pointer; transition:all 0.15s;">${n}</button>`).join('')}
      </div>
    `;
    container.querySelectorAll('.m-btn').forEach(btn => {
      btn.onclick = () => {
        const val = parseInt(btn.dataset.n);
        if (val === expected) {
          this.sound.playTone(320 + expected * 60, 'triangle', 0.1, 0.05);
          btn.style.background = '#22c55e';
          btn.style.borderColor = '#4ade80';
          btn.disabled = true;
          expected++;
          if (expected > 10) this.onMinigameComplete();
        } else {
          this.sound.playTone(180, 'sawtooth', 0.2, 0.06);
          expected = 1;
          container.querySelectorAll('.m-btn').forEach(b => {
            b.style.background = '#242f48';
            b.style.borderColor = '#475569';
            b.disabled = false;
          });
        }
      };
    });
  }

  renderAsteroids(container) {
    let hits = 0;
    container.innerHTML = `
      <div style="position:relative; width:100%; height:100%; cursor:crosshair; background:#020617; overflow:hidden;">
        <div style="position:absolute; top:1rem; right:1.5rem; font-family:var(--font-mono); font-weight:700; color:#ef4444; font-size:1.1rem; z-index:20;">BLASTED: <span id="ast-num">0</span> / 6</div>
        <div id="ast-box"></div>
      </div>
    `;
    const box = document.getElementById('ast-box');
    for (let i = 0; i < 6; i++) {
      const ast = document.createElement('div');
      ast.style.cssText = `position:absolute; left:${50 + Math.random() * 480}px; top:${40 + Math.random() * 260}px; font-size:2.8rem; cursor:pointer; user-select:none;`;
      ast.textContent = '☄️';
      box.appendChild(ast);

      ast.onclick = () => {
        this.sound.playLaser();
        ast.remove();
        hits++;
        document.getElementById('ast-num').textContent = hits;
        if (hits >= 6) this.onMinigameComplete();
      };
    }
  }

  renderHydro(container) {
    let harvested = 0;
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:2rem; padding:2rem; justify-content:center; height:100%;">
        <div style="display:flex; gap:2rem; font-size:3.5rem;">
          <span class="crop" style="cursor:pointer; transition:transform 0.2s;">🥔</span>
          <span class="crop" style="cursor:pointer; transition:transform 0.2s;">🍅</span>
          <span class="crop" style="cursor:pointer; transition:transform 0.2s;">🥕</span>
          <span class="crop" style="cursor:pointer; transition:transform 0.2s;">🥬</span>
        </div>
        <div style="color:#22c55e; font-weight:700;">CLICK RIPE CROPS TO HARVEST</div>
      </div>
    `;
    container.querySelectorAll('.crop').forEach(c => {
      c.onclick = () => {
        this.sound.playClick();
        c.style.transform = 'scale(0)';
        c.style.pointerEvents = 'none';
        harvested++;
        if (harvested >= 4) this.onMinigameComplete();
      };
    });
  }

  renderScan(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:2rem;">
        <div style="display:flex; gap:1.8rem; align-items:center;">
          <div class="tube" style="width:48px; height:160px; border:3px solid #64748b; border-radius:0 0 20px 20px; background:#22c55e; cursor:pointer;"></div>
          <div class="tube" style="width:48px; height:160px; border:3px solid #64748b; border-radius:0 0 20px 20px; background:#38bdf8; cursor:pointer;"></div>
          <div id="bad-tube" style="width:48px; height:160px; border:3px solid #ef4444; border-radius:0 0 20px 20px; background:#ef4444; cursor:pointer; box-shadow:0 0 20px rgba(239,68,68,0.8);"></div>
          <div class="tube" style="width:48px; height:160px; border:3px solid #64748b; border-radius:0 0 20px 20px; background:#eab308; cursor:pointer;"></div>
        </div>
        <div style="font-family:var(--font-mono); color:#f87171; font-weight:700;">⚠️ CLICK THE ANOMALOUS RED PATHOGEN CULTURE</div>
      </div>
    `;
    document.getElementById('bad-tube').onclick = () => this.onMinigameComplete();
  }

  renderRefuel(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.8rem; justify-content:center; height:100%;">
        <div style="width:260px; height:26px; background:#0f172a; border:2px solid #475569; border-radius:999px; overflow:hidden;">
          <div id="tank-fill" style="height:100%; width:0%; background:#f59e0b; transition:width 0.05s linear;"></div>
        </div>
        <button id="btn-pump" class="btn-jrpg-primary btn-gold" style="padding:1rem 2.2rem; font-size:1.1rem;">HOLD TO TRANSFER COOLANT</button>
      </div>
    `;
    const fill = document.getElementById('tank-fill');
    const btn = document.getElementById('btn-pump');
    let pct = 0, itv = null;
    const start = () => {
      itv = setInterval(() => {
        pct += 3.5;
        fill.style.width = `${pct}%`;
        this.sound.playTone(250 + pct * 3, 'sawtooth', 0.05, 0.02);
        if (pct >= 100) { clearInterval(itv); this.onMinigameComplete(); }
      }, 50);
    };
    const stop = () => clearInterval(itv);
    btn.onmousedown = start;
    btn.onmouseup = stop;
    btn.onmouseleave = stop;
    btn.ontouchstart = (e) => { e.preventDefault(); start(); };
    btn.ontouchend = stop;
  }

  renderComms(container) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.8rem; justify-content:center; height:100%;">
        <div style="font-size:4.5rem;">📡</div>
        <button id="btn-trans" class="btn-jrpg-primary" style="padding:1rem 2.2rem; font-size:1.1rem;">TRANSMIT ORBITAL BEACON</button>
      </div>
    `;
    document.getElementById('btn-trans').onclick = () => {
      this.sound.playChime();
      this.onMinigameComplete();
    };
  }

  // ==========================================================================
  // MAIN ANIMATION & UPDATE LOOP
  // ==========================================================================
  loop(timestamp) {
    this.update();
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  update() {
    if (!this.gameActive) return;

    let dx = 0, dy = 0;
    if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
    if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
    if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    if (this.mouseTarget) {
      const dist = Math.hypot(this.mouseTarget.x - this.player.x, this.mouseTarget.y - this.player.y);
      if (dist > 18) {
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
      if (Math.abs(dx) > Math.abs(dy)) {
        this.player.facing = dx > 0 ? 'right' : 'left';
      } else {
        this.player.facing = dy > 0 ? 'down' : 'up';
      }

      this.player.walkTimer += 0.24;
      this.sound.playStep();

      const nextX = this.player.x + dx * this.player.speed;
      const nextY = this.player.y + dy * this.player.speed;

      if (this.isWalkable(nextX, this.player.y)) this.player.x = nextX;
      if (this.isWalkable(this.player.x, nextY)) this.player.y = nextY;
    }

    const targetCamX = this.player.x - this.canvas.width / 2;
    const targetCamY = this.player.y - this.canvas.height / 2;
    this.camera.x += (targetCamX - this.camera.x) * 0.12;
    this.camera.y += (targetCamY - this.camera.y) * 0.12;

    this.checkProximity();

    // Survival Decay
    this.co2 = Math.min(100, this.co2 + 0.003);
    this.o2 = Math.max(0, this.o2 - 0.0025);
    this.food = Math.max(0, this.food - 0.0018);

    if (this.co2 >= 100 || this.o2 <= 0 || this.food <= 0) {
      this.triggerGameDefeat();
      return;
    }

    this.updateCurrentRoomDisplay();
    this.updateHUD();
  }

  checkProximity() {
    let nearest = null;
    let minDist = 72;

    // Check NPCs
    for (const npc of CREW_NPCS) {
      const nx = (npc.c + 0.5) * TILE_SIZE;
      const ny = (npc.r + 0.5) * TILE_SIZE;
      const d = Math.hypot(nx - this.player.x, ny - this.player.y);
      if (d < minDist) {
        minDist = d;
        nearest = { id: npc.id, name: npc.name, role: npc.role, isNPC: true, x: nx, y: ny };
      }
    }

    // Check Consoles
    for (const obj of INTERACTIVE_OBJECTS) {
      const ox = (obj.c + 0.5) * TILE_SIZE;
      const oy = (obj.r + 0.5) * TILE_SIZE;
      const d = Math.hypot(ox - this.player.x, oy - this.player.y);
      if (d < minDist) {
        minDist = d;
        nearest = { ...obj, x: ox, y: oy };
      }
    }

    this.nearestTarget = nearest;
    const btnAct = document.getElementById('btn-action');
    const actLabel = document.getElementById('action-label');
    const actIcon = document.getElementById('action-icon');

    if (btnAct) {
      if (nearest) {
        btnAct.classList.remove('disabled');
        btnAct.classList.add('active');
        if (nearest.isNPC) {
          actLabel.textContent = `TALK TO ${nearest.name.toUpperCase()}`;
          actIcon.textContent = '💬';
        } else {
          actLabel.textContent = `INTERACT`;
          actIcon.textContent = nearest.icon || '⚙️';
        }
      } else {
        btnAct.classList.add('disabled');
        btnAct.classList.remove('active');
        actLabel.textContent = 'INTERACT';
        actIcon.textContent = '💬';
      }
    }
  }

  updateCurrentRoomDisplay() {
    const pc = Math.floor(this.player.x / TILE_SIZE);
    const pr = Math.floor(this.player.y / TILE_SIZE);
    let rName = 'HALLWAY CORRIDOR';

    for (const room of ROOM_DEFS) {
      if (pc >= room.c1 && pc <= room.c2 && pr >= room.r1 && pr <= room.r2) {
        rName = room.name;
        break;
      }
    }
    const el = document.getElementById('current-room-text');
    if (el) el.textContent = rName;
  }

  updateHUD() {
    const barCo2 = document.getElementById('bar-co2');
    const valCo2 = document.getElementById('val-co2');
    if (barCo2 && valCo2) {
      barCo2.style.width = `${Math.min(100, this.co2)}%`;
      valCo2.textContent = `${Math.round(this.co2)}%`;
    }

    const barO2 = document.getElementById('bar-o2');
    const valO2 = document.getElementById('val-o2');
    if (barO2 && valO2) {
      barO2.style.width = `${Math.max(0, this.o2)}%`;
      valO2.textContent = `${Math.round(this.o2)}%`;
    }

    const barFood = document.getElementById('bar-food');
    const valFood = document.getElementById('val-food');
    if (barFood && valFood) {
      barFood.style.width = `${Math.max(0, this.food)}%`;
      valFood.textContent = `${Math.round(this.food)}%`;
    }
  }

  showToast(msg) {
    const toast = document.getElementById('toast-banner');
    const txt = document.getElementById('toast-text');
    if (toast && txt) {
      txt.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  // ==========================================================================
  // RENDERING
  // ==========================================================================
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Starfield Background
    ctx.fillStyle = '#060913';
    ctx.fillRect(this.camera.x - 50, this.camera.y - 50, this.canvas.width + 100, this.canvas.height + 100);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (const star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Spaceship Grid Tiles
    this.renderSpaceshipTiles(ctx);

    // 3. Interactive Objects & Consoles
    this.renderConsoles(ctx);

    // 4. Crew NPCs
    this.renderCrewNPCs(ctx);

    // 5. Chibi Protagonist (Leo)
    this.renderChibiPlayer(ctx);

    ctx.restore();
  }

  renderSpaceshipTiles(ctx) {
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const val = this.grid[r][c];
        const x = c * TILE_SIZE;
        const y = r * TILE_SIZE;

        if (val === 1) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        } else if (val === 2) {
          ctx.fillStyle = '#111726';
          ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    ROOM_DEFS.forEach(room => {
      const rx = (room.c1 + room.c2) / 2 * TILE_SIZE;
      const ry = (room.r1 + 1.2) * TILE_SIZE;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = 'bold 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(room.name, rx, ry);
    });
  }

  renderConsoles(ctx) {
    for (const obj of INTERACTIVE_OBJECTS) {
      const x = obj.c * TILE_SIZE;
      const y = obj.r * TILE_SIZE;
      const isTarget = (this.nearestTarget && this.nearestTarget.id === obj.id);
      const isCompleted = this.completedTasks.has(obj.id);

      ctx.fillStyle = isCompleted ? '#1e293b' : '#334155';
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8, 8);
      ctx.fill();
      ctx.strokeStyle = isTarget ? '#f59e0b' : (isCompleted ? '#22c55e' : '#475569');
      ctx.lineWidth = isTarget ? 3 : 1.5;
      ctx.stroke();

      ctx.font = '16px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obj.icon, x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 5);

      if (isTarget) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE / 2, y - 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Fredoka, sans-serif';
        ctx.fillText('E', x + TILE_SIZE / 2, y - 6);
      }
    }
  }

  renderCrewNPCs(ctx) {
    for (const npc of CREW_NPCS) {
      const x = (npc.c + 0.5) * TILE_SIZE;
      const y = (npc.r + 0.5) * TILE_SIZE;
      const isTarget = (this.nearestTarget && this.nearestTarget.id === npc.id);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(x, y + 14, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = npc.color;
      ctx.beginPath();
      ctx.roundRect(x - 10, y - 6, 20, 18, 6);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y - 12, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(x - 7, y - 15, 14, 8, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, x, y - 26);

      if (isTarget) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x, y - 38, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Fredoka, sans-serif';
        ctx.fillText('TALK', x, y - 34);
      }
    }
  }

  renderChibiPlayer(ctx) {
    const p = this.player;
    const waddle = p.isMoving ? Math.sin(p.walkTimer) * 4 : 0;

    ctx.save();
    ctx.translate(p.x, p.y);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (p.facing === 'up') {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-10, -14, 20, 22, 6);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (p.facing === 'left') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(6, -8, 8, 16);
    } else if (p.facing === 'right') {
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-14, -8, 8, 16);
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-10, -4, 20, 18, [6, 6, 8, 8]);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-10, 8, 20, 4);

    ctx.fillStyle = '#334155';
    ctx.fillRect(-9, 14, 7, 6 + waddle);
    ctx.fillRect(2, 14, 7, 6 - waddle);

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -12, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (p.facing !== 'up') {
      let vx = 0;
      if (p.facing === 'left') vx = -4;
      if (p.facing === 'right') vx = 4;

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-10 + vx, -17, 20, 12, 6);
      ctx.fill();

      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.roundRect(-8 + vx, -15, 16, 9, 4);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-4 + vx, -12, 2.2, 0, Math.PI * 2);
      ctx.arc(4 + vx, -12, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4.5 + vx, -13, 0.9, 0, Math.PI * 2);
      ctx.arc(3.5 + vx, -13, 0.9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fda4af';
      ctx.beginPath();
      ctx.arc(-6 + vx, -8, 2, 0, Math.PI * 2);
      ctx.arc(6 + vx, -8, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================================================
  // VICTORY & DEFEAT STORY ENDINGS
  // ==========================================================================
  triggerGameVictory() {
    this.gameActive = false;
    this.sound.playVictoryFanfare();

    const modal = document.getElementById('ending-cutscene-modal');
    modal.classList.add('active');

    const vCanvas = document.getElementById('ending-vista-canvas');
    if (!vCanvas) return;
    const vCtx = vCanvas.getContext('2d');
    vCanvas.width = 600;
    vCanvas.height = 220;

    vCtx.fillStyle = '#050914';
    vCtx.fillRect(0, 0, vCanvas.width, vCanvas.height);

    const grad = vCtx.createRadialGradient(300, 110, 20, 300, 110, 260);
    grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.2)');
    grad.addColorStop(1, 'transparent');
    vCtx.fillStyle = grad;
    vCtx.fillRect(0, 0, vCanvas.width, vCanvas.height);

    vCtx.fillStyle = '#f59e0b';
    vCtx.beginPath();
    vCtx.roundRect(220, 60, 160, 70, 16);
    vCtx.fill();
    vCtx.strokeStyle = '#fff';
    vCtx.lineWidth = 3;
    vCtx.stroke();

    vCtx.fillStyle = '#38bdf8';
    vCtx.fillRect(250, 80, 100, 25);
    vCtx.fillStyle = '#fff';
    vCtx.font = 'bold 12px Fredoka, sans-serif';
    vCtx.textAlign = 'center';
    vCtx.fillText("VALKYRIE-1 RESUPPLY", 300, 97);
  }

  triggerGameDefeat() {
    this.gameActive = false;
    this.sound.playDefeat();

    let reason = "Life-support systems suffered a catastrophic breakdown.";
    if (this.co2 >= 100) reason = "CO₂ accumulation exceeded 100%. The ship's atmosphere became unbreathable.";
    else if (this.o2 <= 0) reason = "Atmospheric oxygen was fully depleted. The crew suffocated before resupply.";
    else if (this.food <= 0) reason = "Food rations reached 0%. The crew succumbed to severe starvation.";

    document.getElementById('defeat-reason-text').textContent = reason;
    document.getElementById('defeat-modal').classList.add('active');
  }

  resetGame() {
    this.co2 = 15.0;
    this.o2 = 92.0;
    this.food = 88.0;
    this.completedTasks.clear();
    this.currentDayIdx = 0;
    this.currentStepIdx = 0;
    this.startDay(0);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.spaceGame = new JrpgSpaceGame();
  });
}
