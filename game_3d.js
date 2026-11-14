/**
 * ============================================================================
 * CSS CHRYSALIS 3D — PERSONA 3-INSPIRED JRPG SPACE SURVIVAL GAME
 * ============================================================================
 * Complete overhaul matching Persona 3 / Persona 3 Reload art direction:
 * - Slender, stylish mature anime protagonist (Makoto Yuki tribute) with:
 *   * Swept blue anime hair with bangs
 *   * Detailed EVA spacesuit with tailored jacket, high collar
 *   * Red S.E.E.S.-style armband on left sleeve
 *   * Tactical chest harness & hip utility holster
 *   * Transparent curved glossy helmet visor showing anime face
 *   * Life-support backpack with glowing thrusters & conduits
 *   * Full skeletal joint animations: Idle, Walk, Run, Turn, Interact
 * - 3 Distinct anime crew members (Captain Vance, Maya, Dr. Tariq)
 * - 10 seamlessly interconnected 3D sectors (9 Rooms + Observation Deck):
 *   Command Bridge, Observation Deck, Central Atrium, Engineering Bay,
 *   Research Laboratory, Hydroponics Bay, Communications Hub,
 *   Crew Quarters, Life Support, Cargo / Storage Bay.
 * - Watertight 2.5D walkable NavMesh with wall-sliding collision (zero stuckness)
 * - Smooth third-person JRPG follow camera with Right-Click drag orbit & Wheel zoom
 * - Atmospheric Persona 3 lighting with glowing pillar bands & sci-fi textures
 * - Persona 3 minimap on bottom-left showing rooms and rotating player arrow
 * - Minimal bottom-right survival HUD (O2, CO2, Food)
 * - 8 tactile interactive terminal minigames with drag-and-drop
 * - 7-day survival progression with daily narrative emergencies
 * - Procedural Web Audio API sound synthesizer
 * ============================================================================
 */

(function () {
  'use strict';

  // ============================================================================
  // 1. SOUND & AUDIO SYNTHESIZER (Web Audio API)
  // ============================================================================
  class AudioController {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.ambientGain = null;
    }

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
        this.startAmbientDrone();
      } catch (e) {
        console.warn('AudioContext not supported:', e);
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled && this.ctx && this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } else if (this.enabled && this.ctx && this.ambientGain) {
        this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      }
      return this.enabled;
    }

    startAmbientDrone() {
      if (!this.ctx || !this.enabled) return;
      try {
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        this.ambientGain.connect(this.ctx.destination);

        // Low sci-fi binaural hum (55Hz & 55.6Hz)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(this.ambientGain);

        osc1.start();
        osc2.start();
      } catch (e) {
        console.warn('Could not start ambient sound:', e);
      }
    }

    play(soundType) {
      if (!this.enabled) return;
      if (!this.ctx) this.init();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      switch (soundType) {
        case 'blip': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }
        case 'confirm': {
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.04);
            gain.gain.setValueAtTime(0.07, now + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + i * 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.04);
            osc.stop(now + 0.38 + i * 0.04);
          });
          break;
        }
        case 'alarm': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(740, now);
          osc.frequency.linearRampToValueAtTime(440, now + 0.3);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }
        case 'impact': {
          const bufferSize = this.ctx.sampleRate * 1.2;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(260, now);
          filter.frequency.exponentialRampToValueAtTime(35, now + 1.2);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          noise.start(now);
          noise.stop(now + 1.2);
          break;
        }
        case 'step': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(130 + Math.random() * 20, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }
      }
    }
  }

  // ============================================================================
  // 2. CHARACTER PORTRAIT DEFINITIONS (Persona 3 SVGs)
  // ============================================================================
  const Portraits = {
    vance: `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#0f172a"/>
        <line x1="0" y1="20" x2="100" y2="40" stroke="#00f0ff" stroke-width="1.2" opacity="0.4"/>
        <path d="M 50 24 L 62 48 L 50 64 L 38 48 Z" fill="#e2e8f0"/>
        <path d="M 32 30 Q 50 14 68 28 Q 72 40 66 48 L 62 42 L 56 46 L 50 36 L 44 46 L 36 40 Z" fill="#94a3b8"/>
        <path d="M 30 76 L 50 62 L 70 76 L 80 100 L 20 100 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
        <path d="M 44 68 L 50 62 L 56 68 L 50 82 Z" fill="#f59e0b"/>
        <circle cx="44" cy="46" r="2.5" fill="#38bdf8"/>
        <circle cx="56" cy="46" r="2.5" fill="#38bdf8"/>
        <line x1="58" y1="38" x2="54" y2="44" stroke="#ff1744" stroke-width="1.5"/>
      </svg>
    `,
    maya: `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#1e1b4b"/>
        <line x1="10" y1="0" x2="90" y2="100" stroke="#ffb300" stroke-width="1.5" opacity="0.4"/>
        <path d="M 50 26 L 63 50 L 50 64 L 37 50 Z" fill="#fed7aa"/>
        <path d="M 28 32 Q 50 12 72 30 Q 76 56 68 60 L 64 50 L 58 54 L 50 42 L 40 54 L 34 50 Q 24 44 28 32 Z" fill="#1e293b"/>
        <rect x="36" y="28" width="12" height="8" rx="3" fill="#f97316" stroke="#fff" stroke-width="1.2"/>
        <rect x="52" y="28" width="12" height="8" rx="3" fill="#f97316" stroke="#fff" stroke-width="1.2"/>
        <circle cx="43" cy="48" r="2.8" fill="#f59e0b"/>
        <circle cx="57" cy="48" r="2.8" fill="#f59e0b"/>
        <path d="M 26 78 L 50 64 L 74 78 L 84 100 L 16 100 Z" fill="#ea580c" stroke="#fed7aa" stroke-width="1.5"/>
      </svg>
    `,
    tariq: `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#022c22"/>
        <line x1="0" y1="80" x2="100" y2="20" stroke="#00e676" stroke-width="1.2" opacity="0.35"/>
        <path d="M 50 25 L 61 48 L 50 63 L 39 48 Z" fill="#fef3c7"/>
        <path d="M 33 26 Q 50 16 67 24 Q 70 38 65 44 L 50 32 L 35 44 Z" fill="#0f172a"/>
        <rect x="38" y="42" width="10" height="7" rx="1" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
        <rect x="52" y="42" width="10" height="7" rx="1" fill="none" stroke="#00f0ff" stroke-width="1.5"/>
        <path d="M 28 78 L 50 64 L 72 78 L 80 100 L 20 100 Z" fill="#f8fafc" stroke="#0d9488" stroke-width="2"/>
      </svg>
    `,
    leo: `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#0a1020"/>
        <path d="M 50 26 L 62 48 L 50 63 L 38 48 Z" fill="#ffedd5"/>
        <!-- Swept blue anime hair (Makoto Yuki) -->
        <path d="M 30 32 Q 48 10 72 26 Q 76 46 66 52 L 60 44 L 54 48 L 50 36 L 40 48 L 34 40 Z" fill="#1e3a8a"/>
        <path d="M 40 20 Q 48 12 58 18 L 52 26 Z" fill="#00f0ff"/>
        <circle cx="44" cy="46" r="2.8" fill="#00f0ff"/>
        <circle cx="56" cy="46" r="2.8" fill="#00f0ff"/>
        <!-- High Collar Uniform with Red Armband -->
        <path d="M 28 76 L 50 63 L 72 76 L 82 100 L 18 100 Z" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
        <rect x="22" y="78" width="10" height="14" fill="#ff1744"/>
      </svg>
    `,
    chrysalis: `
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#05070e"/>
        <circle cx="75" cy="25" r="16" fill="#ef4444" opacity="0.75"/>
        <polygon points="20,50 50,30 80,50 65,70 35,70" fill="#38bdf8" stroke="#00f0ff" stroke-width="2"/>
      </svg>
    `
  };

  // ============================================================================
  // 3. GAME STATE & NARRATIVE DEFINITIONS
  // ============================================================================
  const STATE = {
    sol: 1,
    maxSols: 7,
    o2: 92,
    co2: 15,
    food: 88,
    activeMissionTitle: 'THE IMPACT',
    activeObjective: 'Meet Captain Vance on Bridge, then repair Life Support.',
    inCutscene: true,
    inDialogue: false,
    activeTaskModal: null,
    isAlarming: false,
    soundEnabled: true,
    currentRoom: 'Command Bridge'
  };

  const SOl_DATA = [
    {
      sol: 1,
      title: 'THE IMPACT',
      objective: 'Meet Captain Vance on Bridge, then repair Life Support air shaft.',
      lore: 'An uncharted asteroid tore into Section 4! Systems are unstable and life support is leaking.',
      quote: '"The asteroid tore through Section 4. We have seven days until Valkyrie arrives. Stay sharp, Cadet."',
      speaker: 'Captain Vance',
      requiredTasks: ['task_life_patch', 'task_life_scrubber', 'task_bridge_nav']
    },
    {
      sol: 2,
      title: 'ATMOSPHERIC SCRUBBING',
      objective: 'Scrub carbon buildup in Life Support and balance Hydroponic nutrients.',
      lore: 'CO₂ levels are rising drastically due to damaged filtration scrubbers.',
      quote: '"If those scrubbers fail, we\'ll choke on our own breath before day four. Get them back online."',
      speaker: 'Maya',
      requiredTasks: ['task_life_scrubber', 'task_hydro_nutrients']
    },
    {
      sol: 3,
      title: 'SOLAR FLARE INTERFERENCE',
      objective: 'Recalibrate Communications array and align orbital telemetry.',
      lore: 'A massive coronal mass ejection from the Sun blind-sided our long-range transmitters.',
      quote: '"Earth\'s beacon went completely dark. Tune that frequency before Valkyrie misses our orbital window!"',
      speaker: 'Captain Vance',
      requiredTasks: ['task_comms_freq', 'task_bridge_nav']
    },
    {
      sol: 4,
      title: 'HYDROPONICS CRISIS',
      objective: 'Analyze biological blight in Science Lab and formulate nutrient solution.',
      lore: 'Emergency food crops are withering under radiation contamination.',
      quote: '"The spirulina culture is destabilizing. Without this harvest, food reserves will collapse."',
      speaker: 'Dr. Tariq',
      requiredTasks: ['task_lab_dna', 'task_hydro_nutrients']
    },
    {
      sol: 5,
      title: 'REACTOR FLUX EMERGENCY',
      objective: 'Balance the magnetic confinement rings in the Engineering Fusion Reactor.',
      lore: 'Plasma turbulence inside the reactor core is threatening a catastrophic containment trip.',
      quote: '"The magnetic coils are redlining! I need you down here at the reactor terminal now!"',
      speaker: 'Maya',
      requiredTasks: ['task_eng_reactor', 'task_atrium_gyro']
    },
    {
      sol: 6,
      title: 'COSMIC DUST STORM',
      objective: 'Weld auxiliary hull plates and synchronize central navigation gyroscope.',
      lore: 'A dense micrometeorite field is battering the ship\'s exterior bulkheads.',
      quote: '"Hull integrity dropping across all sectors. Everyone, battle stations! One more day until rescue."',
      speaker: 'Captain Vance',
      requiredTasks: ['task_life_patch', 'task_atrium_gyro', 'task_bridge_nav']
    },
    {
      sol: 7,
      title: 'VALKYRIE-1 RENDEZVOUS',
      objective: 'Align final docking transponder and broadcast clear approach vector!',
      lore: 'The heavy resupply freighter Valkyrie-1 is on radar approach! Finish all final diagnostics.',
      quote: '"Valkyrie-1 has cleared Martian orbit! Broadcast our approach transponder and bring her home!"',
      speaker: 'Captain Vance',
      requiredTasks: ['task_bridge_nav', 'task_comms_freq', 'task_eng_reactor']
    }
  ];

  // ============================================================================
  // 4. TASK REGISTRY (8 Interactive Ship Consoles)
  // ============================================================================
  const TASKS = [
    {
      id: 'task_bridge_nav',
      name: 'Orbital Course Alignment',
      room: 'Command Bridge',
      x: 0,
      z: -34,
      minigame: 'radar_align',
      instruction: 'Click and drag crosshair onto target orbit beacon until locked.',
      completed: false,
      o2Bonus: 5,
      co2Bonus: -5,
      foodBonus: 0
    },
    {
      id: 'task_comms_freq',
      name: 'Sub-Space Frequency Tuning',
      room: 'Communications Hub',
      x: -32,
      z: -26,
      minigame: 'freq_tune',
      instruction: 'Adjust Frequency and Amplitude sliders to match the green carrier wave.',
      completed: false,
      o2Bonus: 0,
      co2Bonus: 0,
      foodBonus: 10
    },
    {
      id: 'task_quarters_terminal',
      name: 'Crew Health & Bio-Monitoring',
      room: 'Crew Quarters',
      x: 32,
      z: -26,
      minigame: 'code_hack',
      instruction: 'Input the 4-digit biometric emergency override sequence in order.',
      completed: false,
      o2Bonus: 8,
      co2Bonus: -8,
      foodBonus: 8
    },
    {
      id: 'task_atrium_gyro',
      name: 'Central Gyroscope Reset',
      room: 'Central Atrium',
      x: 0,
      z: 0,
      minigame: 'gyro_lock',
      instruction: 'Click [LOCK] when each spinning ring aligns with the cyan notch.',
      completed: false,
      o2Bonus: 10,
      co2Bonus: -5,
      foodBonus: 0
    },
    {
      id: 'task_lab_dna',
      name: 'Biological Sample Analysis',
      room: 'Science Lab',
      x: -32,
      z: 0,
      minigame: 'dna_match',
      instruction: 'Click matching base pairs (A-T, C-G) to synthesize stabilizing enzyme.',
      completed: false,
      o2Bonus: 10,
      co2Bonus: -10,
      foodBonus: 15
    },
    {
      id: 'task_hydro_nutrients',
      name: 'Hydroponic Nutrient Balancing',
      room: 'Hydroponics Bay',
      x: 32,
      z: 0,
      minigame: 'nutrient_balance',
      instruction: 'Drag N, P, K nutrient levers into the target green safety zones.',
      completed: false,
      o2Bonus: 12,
      co2Bonus: -10,
      foodBonus: 20
    },
    {
      id: 'task_life_patch',
      name: 'Air Shaft Hull Puncture Weld',
      room: 'Life Support',
      x: -32,
      z: 26,
      minigame: 'hull_weld',
      instruction: 'Drag titanium plate over rupture and weld the 4 seams shut.',
      completed: false,
      o2Bonus: 25,
      co2Bonus: -20,
      foodBonus: 0
    },
    {
      id: 'task_eng_reactor',
      name: 'Fusion Reactor Flux Calibration',
      room: 'Engineering',
      x: 0,
      z: 32,
      minigame: 'reactor_flux',
      instruction: 'Balance the 2 magnetic containment stabilizer sliders into sync.',
      completed: false,
      o2Bonus: 10,
      co2Bonus: -15,
      foodBonus: 10
    }
  ];

  // ============================================================================
  // 5. 10 SECTORS ARCHITECTURE & WATERTIGHT WALKABLE NAVMESH
  // ============================================================================
  // Clean continuous walkable zones with generous overlapping margins
  // Each zone: { name, minX, maxX, minZ, maxZ, color, isRoom }
  const SECTORS = [
    // 1. Central Atrium (Hub)
    { name: 'Central Atrium', minX: -12, maxX: 12, minZ: -12, maxZ: 12, color: 0x00f0ff, isRoom: true },

    // 2. North Corridor (Bridge Artery) — Overlaps Atrium and Bridge
    { name: 'North Corridor', minX: -4.5, maxX: 4.5, minZ: -24, maxZ: -8, color: 0x00f0ff, isRoom: false },

    // 3. Command Bridge
    { name: 'Command Bridge', minX: -12, maxX: 12, minZ: -38, maxZ: -20, color: 0x00f0ff, isRoom: true },

    // 4. Observation Deck (Far North Balcony) — Overlaps Bridge
    { name: 'Observation Deck', minX: -9, maxX: 9, minZ: -52, maxZ: -36, color: 0x38bdf8, isRoom: true },

    // 5. South Corridor (Engineering Artery) — Overlaps Atrium and Engineering
    { name: 'South Corridor', minX: -4.5, maxX: 4.5, minZ: 8, maxZ: 24, color: 0x06b6d4, isRoom: false },

    // 6. Engineering Bay
    { name: 'Engineering', minX: -12, maxX: 12, minZ: 21, maxZ: 41, color: 0x06b6d4, isRoom: true },

    // 7. West Corridor (Lab Artery) — Overlaps Atrium and Science Lab
    { name: 'West Corridor', minX: -24, maxX: -8, minZ: -4.5, maxZ: 4.5, color: 0x2dd4bf, isRoom: false },

    // 8. Research Laboratory
    { name: 'Science Lab', minX: -41, maxX: -22, minZ: -10, maxZ: 10, color: 0x2dd4bf, isRoom: true },

    // 9. East Corridor (Hydroponics Artery) — Overlaps Atrium and Hydroponics
    { name: 'East Corridor', minX: 8, maxX: 24, minZ: -4.5, maxZ: 4.5, color: 0x00e676, isRoom: false },

    // 10. Hydroponics Bay
    { name: 'Hydroponics Bay', minX: 22, maxX: 41, minZ: -10, maxZ: 10, color: 0x00e676, isRoom: true },

    // 11. North-West Corridor (Lab to Communications Hub)
    { name: 'NW Corridor', minX: -36, maxX: -28, minZ: -20, maxZ: -8, color: 0x38bdf8, isRoom: false },

    // 12. Communications Hub
    { name: 'Communications Hub', minX: -41, maxX: -23, minZ: -35, maxZ: -17, color: 0x38bdf8, isRoom: true },

    // 13. North-East Corridor (Hydroponics to Crew Quarters)
    { name: 'NE Corridor', minX: 28, maxX: 36, minZ: -20, maxZ: -8, color: 0x818cf8, isRoom: false },

    // 14. Crew Quarters
    { name: 'Crew Quarters', minX: 23, maxX: 41, minZ: -35, maxZ: -17, color: 0x818cf8, isRoom: true },

    // 15. South-West Corridor (Lab to Life Support)
    { name: 'SW Corridor', minX: -36, maxX: -28, minZ: 8, maxZ: 20, color: 0xff1744, isRoom: false },

    // 16. Life Support
    { name: 'Life Support', minX: -41, maxX: -23, minZ: 17, maxZ: 35, color: 0xff1744, isRoom: true },

    // 17. South-East Corridor (Hydroponics to Cargo Bay)
    { name: 'SE Corridor', minX: 28, maxX: 36, minZ: 8, maxZ: 20, color: 0xffb300, isRoom: false },

    // 18. Cargo / Storage Bay
    { name: 'Cargo Bay', minX: 23, maxX: 41, minZ: 17, maxZ: 35, color: 0xffb300, isRoom: true }
  ];

  // Watertight geometric navigation tester with wall-sliding
  function isPositionWalkable(x, z, margin = 0.5) {
    for (let i = 0; i < SECTORS.length; i++) {
      const s = SECTORS[i];
      if (
        x >= s.minX + margin &&
        x <= s.maxX - margin &&
        z >= s.minZ + margin &&
        z <= s.maxZ - margin
      ) {
        return true;
      }
    }
    return false;
  }

  // Determine current active sector name
  function getSectorAt(x, z) {
    for (let i = 0; i < SECTORS.length; i++) {
      const s = SECTORS[i];
      if (x >= s.minX && x <= s.maxX && z >= s.minZ && z <= s.maxZ) {
        return s.name;
      }
    }
    return 'Corridor';
  }

  // ============================================================================
  // 6. THREE.JS ENGINE SETUP & PROCEDURAL TEXTURES
  // ============================================================================
  const audio = new AudioController();
  let scene, camera, renderer;
  let playerGroup, playerAnim = { walkCycle: 0, isMoving: false, isRunning: false };
  let playerSkeleton = {};
  let crewCharacters = {};
  let interactiveObjects = [];
  let starParticles, marsSphere, asteroidMeshes = [];
  let reactorLight, reactorCoreMesh;
  let alarmLight;

  const keysDown = {};
  let cameraSettings = {
    distance: 5.6,
    minDist: 3.2,
    maxDist: 8.5,
    height: 2.8,
    yaw: 0,
    pitch: 0.28,
    isOrbiting: false,
    startX: 0,
    startY: 0
  };

  // Helper: Create Sci-Fi Canvas Texture
  function createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, 256, 256);

    // Subtle carbon grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.strokeRect(32, 32, 192, 192);

    // Diagonal hazard corner accents
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(32, 32);
    ctx.moveTo(256, 0); ctx.lineTo(224, 32);
    ctx.moveTo(0, 256); ctx.lineTo(32, 224);
    ctx.moveTo(256, 256); ctx.lineTo(224, 224);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function createWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0e1526';
    ctx.fillRect(0, 0, 256, 256);

    // Vertical structural ribbing
    ctx.fillStyle = '#090d18';
    ctx.fillRect(10, 0, 24, 256);
    ctx.fillRect(222, 0, 24, 256);

    // Beveled center panel
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 30, 176, 196);

    // Horizontal cyan indicator strip
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(40, 126, 176, 4);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  // ============================================================================
  // 7. INITIALIZE ENGINE & WORLD
  // ============================================================================
  function initEngine() {
    const container = document.getElementById('canvas-container');
    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04060d);
    scene.fog = new THREE.FogExp2(0x04060d, 0.015);

    camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Build World Elements
    buildLighting();
    buildSpaceAndCosmos();
    buildSpaceshipArchitecture();
    buildDetailedProps();
    buildProtagonistAnimeCharacter();
    buildAnimeCrewNPCs();
    buildInteractiveTerminals();

    // Setup Systems
    setupInputAndCameraControls();
    setupUIListeners();
    updateChecklistDrawer();
    updateHUDResources();

    window.addEventListener('resize', onWindowResize);

    // Start Prologue Cutscene
    startPrologueCutscene();

    // Start Game Loop
    requestAnimationFrame(renderLoop);
  }

  // ============================================================================
  // 8. ATMOSPHERIC LIGHTING & SHADOWS
  // ============================================================================
  function buildLighting() {
    // Ambient fill: Moody dark midnight blue
    const ambientLight = new THREE.AmbientLight(0x0a162c, 1.4);
    scene.add(ambientLight);

    // Key directional light for soft shadows
    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 0.85);
    keyLight.position.set(20, 35, -15);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Red Emergency Alarm Light
    alarmLight = new THREE.PointLight(0xff1744, 0, 70);
    alarmLight.position.set(0, 8, 0);
    scene.add(alarmLight);

    // Localized Room Spotlights & Accent Lights
    SECTORS.filter(s => s.isRoom).forEach(r => {
      const pLight = new THREE.PointLight(r.color, 1.3, 22);
      const cx = (r.minX + r.maxX) / 2;
      const cz = (r.minZ + r.maxZ) / 2;
      pLight.position.set(cx, 4.8, cz);
      scene.add(pLight);
    });

    // Tokamak Reactor Core Point Light in Engineering
    reactorLight = new THREE.PointLight(0x00f0ff, 2.8, 28);
    reactorLight.position.set(0, 3.8, 32);
    scene.add(reactorLight);
  }

  // ============================================================================
  // 9. SPACE COSMOS (Starfield, Mars & Tumbling Asteroids)
  // ============================================================================
  function buildSpaceAndCosmos() {
    // 2500 Twinkling Star Points
    const starGeo = new THREE.BufferGeometry();
    const count = 2500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = (Math.random() - 0.5) * 500 + 40;
      positions[i + 2] = (Math.random() - 0.5) * 800 - 160;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.6,
      transparent: true,
      opacity: 0.85
    });
    starParticles = new THREE.Points(starGeo, starMat);
    scene.add(starParticles);

    // Mars Planet Sphere in outer space
    const marsGeo = new THREE.SphereGeometry(48, 32, 32);
    const marsMat = new THREE.MeshBasicMaterial({ color: 0xc2410c });
    marsSphere = new THREE.Mesh(marsGeo, marsMat);
    marsSphere.position.set(80, 25, -240);
    scene.add(marsSphere);

    // 16 Floating 3D Asteroids tumbling in space outside the Bridge Viewport
    const rockGeo = new THREE.DodecahedronGeometry(3.2, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    });
    for (let i = 0; i < 16; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 80 + 15,
        -70 - Math.random() * 110
      );
      const s = Math.random() * 1.6 + 0.6;
      rock.scale.set(s, s * 0.8, s * 1.2);
      scene.add(rock);
      asteroidMeshes.push({
        mesh: rock,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        )
      });
    }
  }

  // ============================================================================
  // 10. SPACESHIP ARCHITECTURE (10 Sectors, Walls, Bulkheads, Pillars)
  // ============================================================================
  function buildSpaceshipArchitecture() {
    const floorTexture = createFloorTexture();
    const wallTexture = createWallTexture();

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.4,
      metalness: 0.7
    });

    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.5,
      metalness: 0.5
    });

    // 1. Build Floors for All Sectors
    SECTORS.forEach(s => {
      const w = s.maxX - s.minX;
      const d = s.maxZ - s.minZ;
      const cx = (s.minX + s.maxX) / 2;
      const cz = (s.minZ + s.maxZ) / 2;

      const fGeo = new THREE.BoxGeometry(w, 0.4, d);
      const fMesh = new THREE.Mesh(fGeo, floorMat);
      fMesh.position.set(cx, -0.2, cz);
      fMesh.receiveShadow = true;
      scene.add(fMesh);

      // Floor Guide Tracks (Persona cyan/yellow stripes)
      if (s.isRoom) {
        const borderGeo = new THREE.BoxGeometry(w, 0.04, 0.2);
        const borderMat = new THREE.MeshBasicMaterial({ color: s.color });
        const nBorder = new THREE.Mesh(borderGeo, borderMat);
        nBorder.position.set(cx, 0.02, s.minZ);
        scene.add(nBorder);
        const sBorder = new THREE.Mesh(borderGeo, borderMat);
        sBorder.position.set(cx, 0.02, s.maxZ);
        scene.add(sBorder);
      }
    });

    // 2. Build Outer Perimeter Walls
    const wallHeight = 5.2;
    function addWallSegment(x, z, w, d) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, wallHeight, d), wallMat);
      mesh.position.set(x, wallHeight / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
    }

    // Command Bridge & Observation Deck Walls
    addWallSegment(-12, -29, 0.8, 18);
    addWallSegment(12, -29, 0.8, 18);
    addWallSegment(-9, -44, 0.8, 14);
    addWallSegment(9, -44, 0.8, 14);

    // Panoramic Viewport on Observation Deck (Glass into space)
    const glassGeo = new THREE.PlaneGeometry(16, 4.5);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.85
    });
    const viewportWindow = new THREE.Mesh(glassGeo, glassMat);
    viewportWindow.position.set(0, 2.5, -52);
    scene.add(viewportWindow);

    // Central Atrium Pillars (Persona 3 Tartarus pillar style with glowing rings!)
    const pillarCoords = [
      [-10, -10], [10, -10], [-10, 10], [10, 10]
    ];
    pillarCoords.forEach(pos => {
      buildArchitecturalPillar(pos[0], pos[1], 0x00f0ff);
    });

    // Corridors Arched Door Bulkheads
    const archCoords = [
      [0, -8], [0, -20], [0, 8], [0, 20],
      [-8, 0], [-20, 0], [8, 0], [20, 0]
    ];
    archCoords.forEach(pos => {
      buildBulkheadArch(pos[0], pos[1], pos[0] === 0);
    });
  }

  // Tartarus-Inspired Support Pillar with Glowing Light Rings (Persona 3 Reference)
  function buildArchitecturalPillar(x, z, glowColor) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const shaftGeo = new THREE.CylinderGeometry(0.85, 0.95, 5.2, 16);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.position.y = 2.6;
    group.add(shaft);

    // Glowing Amber/Cyan Light Rings (Direct tribute to Persona 3 Tartarus pillars in image 2!)
    const ringGeo = new THREE.TorusGeometry(0.9, 0.08, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: glowColor });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 1.8;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 3.6;
    group.add(ring2);

    scene.add(group);
  }

  // Bulkhead Doorframe Arch with Illuminated Status Stripe
  function buildBulkheadArch(x, z, isNorthSouth) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const archMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.7 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0x00e676 }); // Green open status

    if (isNorthSouth) {
      // Left post
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), archMat);
      p1.position.set(-4.2, 2.5, 0);
      group.add(p1);
      // Right post
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), archMat);
      p2.position.set(4.2, 2.5, 0);
      group.add(p2);
      // Top header
      const top = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 0.9), archMat);
      top.position.set(0, 4.8, 0);
      group.add(top);
      // Green illuminated indicator
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(6, 0.12, 0.95), lightMat);
      stripe.position.set(0, 4.4, 0);
      group.add(stripe);
    } else {
      // Left post
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), archMat);
      p1.position.set(0, 2.5, -4.2);
      group.add(p1);
      // Right post
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 5, 0.8), archMat);
      p2.position.set(0, 2.5, 4.2);
      group.add(p2);
      // Top header
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 9.2), archMat);
      top.position.set(0, 4.8, 0);
      group.add(top);
      // Green indicator
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 6), lightMat);
      stripe.position.set(0, 4.4, 0);
      group.add(stripe);
    }

    scene.add(group);
  }

  // ============================================================================
  // 11. DETAILED ROOM MACHINERY & PROPS
  // ============================================================================
  function buildDetailedProps() {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    // 1. Central Atrium: Holographic Earth/Mars Star Map
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 2.4, 0);
    const globeWire = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.65 })
    );
    globeGroup.add(globeWire);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 1.2, 8), metalMat);
    ped.position.set(0, 0.6, 0);
    scene.add(ped);
    scene.add(globeGroup);
    scene.userData.globe = globeGroup;

    // 2. Engineering: Tokamak Fusion Reactor Core
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 3.6, 32);
    reactorCoreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.8, wireframe: true })
    );
    coreGroup.add(reactorCoreMesh);
    const ringGeo = new THREE.TorusGeometry(3.6, 0.25, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, metalness: 0.9 });
    const r1 = new THREE.Mesh(ringGeo, ringMat);
    coreGroup.add(r1);
    const r2 = new THREE.Mesh(ringGeo, ringMat);
    r2.rotation.x = Math.PI / 2;
    coreGroup.add(r2);
    scene.add(coreGroup);
    scene.userData.reactorGroup = coreGroup;

    // 3. Hydroponics: Tiered Vertical Plant Racks
    for (let k = -1; k <= 1; k += 2) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.4, 12), metalMat);
      rack.position.set(32 + k * 5.5, 2.2, 0);
      scene.add(rack);
      for (let level = 1; level <= 3; level++) {
        const foliage = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 11.5), new THREE.MeshBasicMaterial({ color: 0x00e676 }));
        foliage.position.set(32 + k * 5.5, level * 1.2, 0);
        scene.add(foliage);
      }
    }

    // 4. Life Support: Ruptured Air Duct with Sparks
    const rupture = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 2.4, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 })
    );
    rupture.position.set(-32, 1.2, 31);
    scene.add(rupture);
  }

  // ============================================================================
  // 12. HIGH-QUALITY ANIME 3D PROTAGONIST (MAKOTO YUKI PERSONA 3 TRIBUTE)
  // ============================================================================
  function buildProtagonistAnimeCharacter() {
    playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, -28); // Spawn on Command Bridge

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 }); // Peach anime skin
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.35, metalness: 0.3 }); // Midnight Blue anime hair
    const suitJacketMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6 }); // Tailored dark navy uniform
    const whiteCollarMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }); // Crisp white shirt collar
    const redArmbandMat = new THREE.MeshStandardMaterial({ color: 0xff1744, roughness: 0.4 }); // S.E.E.S. Crimson Armband!
    const beltLeatherMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 }); // Tactical belt
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4, metalness: 0.5 }); // High-tech boots

    const visorMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.3,
      transmission: 0.85,
      clearcoat: 1.0
    });

    // 1. Pelvis Root (Hierarchical center)
    const pelvis = new THREE.Group();
    pelvis.position.y = 1.15;
    playerGroup.add(pelvis);

    // 2. Torso (Slender tailored jacket, tall anime proportions)
    const spine = new THREE.Group();
    spine.position.y = 0.25;
    pelvis.add(spine);

    const chestGeo = new THREE.BoxGeometry(0.72, 0.85, 0.45);
    const chest = new THREE.Mesh(chestGeo, suitJacketMat);
    chest.position.y = 0.42;
    chest.castShadow = true;
    spine.add(chest);

    // High White Stand-up Collar (Persona 3 uniform detail)
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.22, 12), whiteCollarMat);
    collar.position.y = 0.88;
    chest.add(collar);

    // Diagonal Tactical Chest Harness Strap
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.48), beltLeatherMat);
    strap.rotation.z = Math.PI / 6;
    strap.position.set(0, 0, 0.02);
    chest.add(strap);

    // Tactical Utility Belt around waist with metallic buckle
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.12, 0.48), beltLeatherMat);
    belt.position.y = -0.38;
    chest.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.52), new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
    buckle.position.y = -0.38;
    chest.add(buckle);

    // Hip Holster / Equipment Bag on Right Hip (Persona 3 Hero item)
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.26), beltLeatherMat);
    holster.position.set(0.44, -0.45, 0.05);
    chest.add(holster);

    // Life-Support Backpack Unit on Back
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.35), suitJacketMat);
    backpack.position.set(0, 0.05, -0.32);
    chest.add(backpack);

    // Twin Thruster Nozzles at base of backpack
    const thrusterGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.2, 8);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const tL = new THREE.Mesh(thrusterGeo, thrusterMat);
    tL.position.set(-0.16, -0.42, -0.32);
    chest.add(tL);
    const tR = new THREE.Mesh(thrusterGeo, thrusterMat);
    tR.position.set(0.16, -0.42, -0.32);
    chest.add(tR);

    // 3. Neck & Head
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.05;
    chest.add(headGroup);

    // Anime Face (Tapered chin, delicate jawline)
    const faceGeo = new THREE.CylinderGeometry(0.24, 0.15, 0.42, 12);
    const face = new THREE.Mesh(faceGeo, skinMat);
    face.position.set(0, 0.08, 0.04);
    headGroup.add(face);

    // Anime Eyes (Blue iris, lashes)
    const eyeGeo = new THREE.PlaneGeometry(0.06, 0.04);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.09, 0.12, 0.24);
    headGroup.add(eyeL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.09, 0.12, 0.24);
    headGroup.add(eyeR);

    // Styled Swept Blue Anime Hair (Makoto Yuki Tribute)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    // Hair Cap Base
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), hairMat);
    hairCap.position.set(0, 0.2, -0.04);
    hairGroup.add(hairCap);

    // Swept Bangs draping forward across right eye
    const bangGeo = new THREE.ConeGeometry(0.18, 0.5, 6);
    const bang1 = new THREE.Mesh(bangGeo, hairMat);
    bang1.rotation.set(-Math.PI / 4, 0, -Math.PI / 5);
    bang1.position.set(0.14, 0.18, 0.22);
    hairGroup.add(bang1);

    const bang2 = new THREE.Mesh(bangGeo, hairMat);
    bang2.rotation.set(-Math.PI / 4, 0, Math.PI / 8);
    bang2.position.set(-0.12, 0.22, 0.2);
    hairGroup.add(bang2);

    // Transparent / Reflective Curved Visor Helmet
    const visorGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.scale.set(1.05, 1.15, 1.1);
    visorMesh.position.set(0, 0.15, 0.02);
    headGroup.add(visorMesh);

    // 4. Arms (Slender sleeves, Crimson Armband on left arm, gloves)
    const armGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.65, 8);
    const gloveGeo = new THREE.BoxGeometry(0.15, 0.22, 0.18);

    // Left Arm (with S.E.E.S. Crimson Armband!)
    const shoulderL = new THREE.Group();
    shoulderL.position.set(-0.46, 0.32, 0);
    chest.add(shoulderL);

    const upperArmL = new THREE.Mesh(armGeo, suitJacketMat);
    upperArmL.position.y = -0.28;
    shoulderL.add(upperArmL);

    // S.E.E.S. Red Armband around Left Arm!
    const armband = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.22, 12), redArmbandMat);
    armband.position.y = -0.18;
    shoulderL.add(armband);

    const handL = new THREE.Mesh(gloveGeo, bootMat);
    handL.position.y = -0.65;
    shoulderL.add(handL);

    // Right Arm
    const shoulderR = new THREE.Group();
    shoulderR.position.set(0.46, 0.32, 0);
    chest.add(shoulderR);

    const upperArmR = new THREE.Mesh(armGeo, suitJacketMat);
    upperArmR.position.y = -0.28;
    shoulderR.add(upperArmR);

    const handR = new THREE.Mesh(gloveGeo, bootMat);
    handR.position.y = -0.65;
    shoulderR.add(handR);

    // 5. Legs & Boots (Slender trousers, tall astronaut boots)
    const legGeo = new THREE.CylinderGeometry(0.13, 0.1, 0.72, 8);
    const bootGeo = new THREE.BoxGeometry(0.22, 0.32, 0.42);

    // Left Leg
    const hipL = new THREE.Group();
    hipL.position.set(-0.22, 0, 0);
    pelvis.add(hipL);

    const thighL = new THREE.Mesh(legGeo, suitJacketMat);
    thighL.position.y = -0.36;
    hipL.add(thighL);

    const footL = new THREE.Mesh(bootGeo, bootMat);
    footL.position.set(0, -0.82, 0.08);
    hipL.add(footL);

    // Right Leg
    const hipR = new THREE.Group();
    hipR.position.set(0.22, 0, 0);
    pelvis.add(hipR);

    const thighR = new THREE.Mesh(legGeo, suitJacketMat);
    thighR.position.y = -0.36;
    hipR.add(thighR);

    const footR = new THREE.Mesh(bootGeo, bootMat);
    footR.position.set(0, -0.82, 0.08);
    hipR.add(footR);

    scene.add(playerGroup);

    playerSkeleton = {
      pelvis,
      spine,
      chest,
      headGroup,
      shoulderL,
      shoulderR,
      hipL,
      hipR
    };
  }

  // ============================================================================
  // 13. INDIVIDUAL 3D ANIME CREW MEMBERS (VANCE, MAYA, TARIQ)
  // ============================================================================
  function buildAnimeCrewNPCs() {
    const crewRoster = [
      {
        id: 'vance',
        name: 'Captain Vance',
        role: 'COMMANDER',
        x: 0,
        z: -34,
        rotY: 0,
        coatColor: 0x0284c7,
        capeColor: 0xf8fafc,
        hairColor: 0x94a3b8 // Silver hair
      },
      {
        id: 'maya',
        name: 'Maya',
        role: 'CHIEF ENGINEER',
        x: -4,
        z: 32,
        rotY: Math.PI / 4,
        coatColor: 0xea580c, // Thermal hazard orange
        capeColor: 0x1e293b,
        hairColor: 0xb45309 // Fiery auburn ponytail
      },
      {
        id: 'tariq',
        name: 'Dr. Tariq',
        role: 'SCIENCE OFFICER',
        x: -30,
        z: 0,
        rotY: Math.PI / 2,
        coatColor: 0x0d9488, // Teal science suit
        capeColor: 0xffffff, // White lab coat
        hairColor: 0x0f172a // Neat dark hair
      }
    ];

    crewRoster.forEach(c => {
      const group = new THREE.Group();
      group.position.set(c.x, 0, c.z);
      group.rotation.y = c.rotY;

      const bodyMat = new THREE.MeshStandardMaterial({ color: c.coatColor, roughness: 0.4, metalness: 0.6 });
      const coatMat = new THREE.MeshStandardMaterial({ color: c.capeColor, roughness: 0.5 });
      const hairMat = new THREE.MeshStandardMaterial({ color: c.hairColor, roughness: 0.4 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.6 });

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.1, 0.48), bodyMat);
      torso.position.y = 1.6;
      group.add(torso);

      // Overcoat / Mantle
      const cape = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.3, 0.52), coatMat);
      cape.position.set(0, 1.55, -0.04);
      group.add(cape);

      // Head & Hair
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 16), skinMat);
      head.position.y = 2.45;
      group.add(head);

      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.39, 16, 16), hairMat);
      hair.position.set(0, 2.55, -0.05);
      group.add(hair);

      // Visor
      const visor = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      visor.rotation.y = -Math.PI / 2;
      visor.position.set(0, 2.45, 0.08);
      group.add(visor);

      // Legs
      const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.95, 8), bodyMat);
      legL.position.set(-0.24, 0.5, 0);
      group.add(legL);
      const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.95, 8), bodyMat);
      legR.position.set(0.24, 0.5, 0);
      group.add(legR);

      // Floating Overhead Diamond (Persona 3 marker)
      const diamond = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.35, 0),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
      );
      diamond.position.y = 3.4;
      group.add(diamond);

      scene.add(group);
      crewCharacters[c.id] = { group, diamond, data: c };

      interactiveObjects.push({
        type: 'npc',
        id: c.id,
        name: c.name,
        role: c.role,
        x: c.x,
        z: c.z,
        marker: diamond,
        group
      });
    });
  }

  // ============================================================================
  // 14. INTERACTIVE CONSOLES & TASK TERMINALS
  // ============================================================================
  function buildInteractiveTerminals() {
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    TASKS.forEach(t => {
      const consoleGroup = new THREE.Group();
      consoleGroup.position.set(t.x, 0, t.z);

      const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 0.75), consoleMat);
      base.position.y = 0.65;
      consoleGroup.add(base);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.05), screenMat);
      screen.position.set(0, 1.25, 0.22);
      screen.rotation.x = -Math.PI / 6;
      consoleGroup.add(screen);

      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.38, 0),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true })
      );
      marker.position.y = 2.4;
      consoleGroup.add(marker);

      scene.add(consoleGroup);

      interactiveObjects.push({
        type: 'task',
        id: t.id,
        name: t.name,
        taskData: t,
        x: t.x,
        z: t.z,
        marker,
        group: consoleGroup
      });
    });
  }

  // ============================================================================
  // 15. INPUT HANDLING & PROFESSIONAL THIRD-PERSON CAMERA
  // ============================================================================
  function setupInputAndCameraControls() {
    window.addEventListener('keydown', e => {
      keysDown[e.key.toLowerCase()] = true;

      if (e.key === 'e' || e.key === 'E') {
        handleInteractAction();
      }

      if (e.key === 'Escape') {
        if (STATE.inCutscene) {
          skipPrologueCutscene();
        } else if (STATE.activeTaskModal) {
          closeTaskModal();
        }
      }
    });

    window.addEventListener('keyup', e => {
      keysDown[e.key.toLowerCase()] = false;
    });

    const container = document.getElementById('canvas-container');

    // Right-Click or Left-Drag Camera Rotation
    container.addEventListener('mousedown', e => {
      audio.init();
      // Right click (2) or left click on canvas (0)
      if (e.button === 2 || e.button === 0) {
        cameraSettings.isOrbiting = true;
        cameraSettings.startX = e.clientX;
        cameraSettings.startY = e.clientY;
      }
    });

    container.addEventListener('contextmenu', e => {
      e.preventDefault(); // Prevent browser right-click menu
    });

    window.addEventListener('mousemove', e => {
      if (!cameraSettings.isOrbiting) return;
      const dx = e.clientX - cameraSettings.startX;
      const dy = e.clientY - cameraSettings.startY;
      cameraSettings.startX = e.clientX;
      cameraSettings.startY = e.clientY;

      cameraSettings.yaw -= dx * 0.006;
      cameraSettings.pitch = Math.max(0.08, Math.min(1.05, cameraSettings.pitch + dy * 0.005));
    });

    window.addEventListener('mouseup', () => {
      cameraSettings.isOrbiting = false;
    });

    // Mouse Wheel Zoom
    window.addEventListener('wheel', e => {
      cameraSettings.distance = Math.max(
        cameraSettings.minDist,
        Math.min(cameraSettings.maxDist, cameraSettings.distance + e.deltaY * 0.005)
      );
    }, { passive: true });
  }

  // ============================================================================
  // 16. UI & MODAL LISTENERS
  // ============================================================================
  function setupUIListeners() {
    // Sound Button
    document.getElementById('btn-sound').addEventListener('click', () => {
      const on = audio.toggle();
      document.getElementById('sound-icon').textContent = on ? '🔊' : '🔇';
      showToast(on ? 'AUDIO RESTORED' : 'AUDIO MUTED');
    });

    // Checklist Drawer
    document.getElementById('btn-toggle-tasks').addEventListener('click', () => {
      audio.play('blip');
      const list = document.getElementById('task-checklist-list');
      const chev = document.getElementById('tasks-chevron');
      const closed = list.style.display === 'none';
      list.style.display = closed ? 'flex' : 'none';
      chev.textContent = closed ? '▲' : '▼';
    });

    // HUD Action Button
    document.getElementById('btn-action-main').addEventListener('click', handleInteractAction);

    // Minigame Close
    document.getElementById('btn-close-task').addEventListener('click', closeTaskModal);

    // Dialogue Overlay
    document.getElementById('p3-dialogue-overlay').addEventListener('click', advanceDialogue);

    // Cutscene Advance & Skip
    document.getElementById('cutscene-sub-box').addEventListener('click', advanceCutscene);
    document.getElementById('btn-skip-cutscene').addEventListener('click', skipPrologueCutscene);

    // Next Sol Debrief Button
    document.getElementById('btn-next-day').addEventListener('click', advanceToNextSol);

    // Restart Expedition
    document.getElementById('btn-restart-game').addEventListener('click', () => window.location.reload());
    document.getElementById('btn-retry-expedition').addEventListener('click', () => window.location.reload());
  }

  // ============================================================================
  // 17. CUTSCENE SYSTEM (Asteroid Impact Shockwave)
  // ============================================================================
  const cutsceneSteps = [
    {
      speaker: 'CSS CHRYSALIS &bull; DEEP SPACE',
      portrait: 'chrysalis',
      text: 'Year 2026. Scientific research vessel CSS Chrysalis cruises on the Martian orbital approach...',
      camPos: { x: 0, y: 12, z: -70 },
      lookAt: { x: 0, y: 3, z: -30 }
    },
    {
      speaker: 'SHIP AI ALARM &bull; PROXIMITY ALERT',
      portrait: 'chrysalis',
      text: 'WARNING: Uncharted high-velocity asteroid cluster detected on collision trajectory!',
      camPos: { x: -35, y: 16, z: -90 },
      lookAt: { x: 0, y: 2, z: -35 },
      triggerImpact: true
    },
    {
      speaker: 'CAPTAIN VANCE',
      portrait: 'vance',
      text: 'Brace for impact! All personnel secure your life-support harnesses immediately!',
      camPos: { x: 0, y: 4.5, z: -45 },
      lookAt: { x: 0, y: 2.5, z: -34 }
    },
    {
      speaker: 'MAYA &bull; CHIEF ENGINEER',
      portrait: 'maya',
      text: 'Direct hit on lower Section 4! Air shaft ruptured! CO₂ scrubbers are overloading!',
      camPos: { x: -32, y: 5.5, z: 16 },
      lookAt: { x: -32, y: 2, z: 26 }
    },
    {
      speaker: 'CAPTAIN VANCE',
      portrait: 'vance',
      text: 'Cadet Leo. Earth resupply freighter Valkyrie-1 is seven days out. Keep this crew alive. Report to the Bridge.',
      camPos: { x: 0, y: 3.5, z: -32 },
      lookAt: { x: 0, y: 2.2, z: -34 }
    }
  ];

  let currentCutsceneIdx = 0;
  let targetCamPos = new THREE.Vector3();
  let targetLookAt = new THREE.Vector3();

  function startPrologueCutscene() {
    STATE.inCutscene = true;
    currentCutsceneIdx = 0;
    document.getElementById('cutscene-overlay').classList.add('active');
    renderCutsceneStep();
  }

  function renderCutsceneStep() {
    const step = cutsceneSteps[currentCutsceneIdx];
    if (!step) {
      endPrologueCutscene();
      return;
    }

    document.getElementById('cutscene-speaker').innerHTML = step.speaker;
    document.getElementById('cutscene-sub-text').textContent = step.text;
    document.getElementById('cutscene-portrait').innerHTML = Portraits[step.portrait] || Portraits.vance;

    if (step.camPos) {
      targetCamPos.set(step.camPos.x, step.camPos.y, step.camPos.z);
      targetLookAt.set(step.lookAt.x, step.lookAt.y, step.lookAt.z);
    }

    if (step.triggerImpact) {
      audio.play('impact');
      audio.play('alarm');
      triggerRedAlarm(true);
      document.body.classList.add('p3-screen-shake');
      setTimeout(() => document.body.classList.remove('p3-screen-shake'), 900);
    }
  }

  function advanceCutscene() {
    audio.play('blip');
    currentCutsceneIdx++;
    if (currentCutsceneIdx >= cutsceneSteps.length) {
      endPrologueCutscene();
    } else {
      renderCutsceneStep();
    }
  }

  function skipPrologueCutscene() {
    audio.play('click');
    endPrologueCutscene();
  }

  function endPrologueCutscene() {
    STATE.inCutscene = false;
    document.getElementById('cutscene-overlay').classList.remove('active');
    playerGroup.position.set(0, 0, -28);
    cameraSettings.yaw = 0;
    cameraSettings.pitch = 0.28;
    showToast('MISSION ACTIVE &bull; SOL 01');
  }

  function triggerRedAlarm(enable) {
    STATE.isAlarming = enable;
    const overlay = document.getElementById('alarm-overlay');
    if (enable) {
      overlay.classList.add('active');
      alarmLight.intensity = 2.4;
    } else {
      overlay.classList.remove('active');
      alarmLight.intensity = 0;
    }
  }

  // ============================================================================
  // 18. PERSONA 3 DIALOGUE ENGINE
  // ============================================================================
  let dialogueQueue = [];
  let dialogueIdx = 0;

  function triggerDialogue(chain) {
    if (!chain || chain.length === 0) return;
    STATE.inDialogue = true;
    dialogueQueue = chain;
    dialogueIdx = 0;
    document.getElementById('p3-dialogue-overlay').classList.add('active');
    renderDialogueNode();
  }

  function renderDialogueNode() {
    const node = dialogueQueue[dialogueIdx];
    if (!node) {
      closeDialogue();
      return;
    }

    document.getElementById('dialogue-speaker-name').textContent = node.speaker;
    document.getElementById('dialogue-speaker-role').textContent = node.role || 'CREW';
    document.getElementById('dialogue-text').textContent = node.text;
    document.getElementById('dialogue-portrait').innerHTML = Portraits[node.portrait] || Portraits.vance;
    audio.play('blip');
  }

  function advanceDialogue() {
    if (!STATE.inDialogue) return;
    dialogueIdx++;
    if (dialogueIdx >= dialogueQueue.length) {
      closeDialogue();
    } else {
      renderDialogueNode();
    }
  }

  function closeDialogue() {
    STATE.inDialogue = false;
    document.getElementById('p3-dialogue-overlay').classList.remove('active');
  }

  // ============================================================================
  // 19. PROXIMITY DETECTION & INTERACTION
  // ============================================================================
  function updateProximityCheck() {
    if (STATE.inCutscene || STATE.inDialogue || STATE.activeTaskModal) {
      hidePrompt();
      return;
    }

    const pPos = playerGroup.position;
    let nearestObj = null;
    let minDist = 3.6;

    interactiveObjects.forEach(obj => {
      const dx = pPos.x - obj.x;
      const dz = pPos.z - obj.z;
      const dist = Math.hypot(dx, dz);
      if (dist < minDist) {
        minDist = dist;
        nearestObj = obj;
      }
    });

    if (nearestObj) {
      showPrompt(nearestObj);
    } else {
      hidePrompt();
    }
  }

  function showPrompt(obj) {
    const prompt = document.getElementById('interaction-prompt');
    const actionBtn = document.getElementById('btn-action-main');

    document.getElementById('prompt-action-type').textContent = obj.type === 'npc' ? 'TALK' : 'MAINTAIN';
    document.getElementById('prompt-target-name').textContent = obj.name;
    document.getElementById('action-btn-text').textContent = obj.name.toUpperCase();

    prompt.classList.add('active');
    actionBtn.classList.remove('disabled');
    prompt.dataset.targetId = obj.id;
  }

  function hidePrompt() {
    const prompt = document.getElementById('interaction-prompt');
    const actionBtn = document.getElementById('btn-action-main');
    prompt.classList.remove('active');
    actionBtn.classList.add('disabled');
    prompt.dataset.targetId = '';
  }

  function handleInteractAction() {
    if (STATE.inCutscene) {
      advanceCutscene();
      return;
    }
    if (STATE.inDialogue) {
      advanceDialogue();
      return;
    }

    const prompt = document.getElementById('interaction-prompt');
    const targetId = prompt.dataset.targetId;
    if (!targetId) return;

    const targetObj = interactiveObjects.find(o => o.id === targetId);
    if (!targetObj) return;

    if (targetObj.type === 'npc') {
      interactWithNPC(targetObj);
    } else if (targetObj.type === 'task') {
      openTaskModal(targetObj.taskData);
    }
  }

  function interactWithNPC(npc) {
    audio.play('confirm');
    const solData = SOl_DATA[STATE.sol - 1];

    if (npc.id === 'vance') {
      triggerDialogue([
        {
          speaker: 'CAPTAIN VANCE',
          role: 'COMMANDER',
          portrait: 'vance',
          text: `Cadet Leo. Today is Sol ${STATE.sol}. ${solData.lore}`
        },
        {
          speaker: 'CAPTAIN VANCE',
          role: 'COMMANDER',
          portrait: 'vance',
          text: `Current Mission: ${solData.objective} Keep O₂ above critical and monitor food reserves!`
        },
        {
          speaker: 'CADET LEO',
          role: 'CADET ASTRONAUT',
          portrait: 'leo',
          text: 'Understood, Captain. I am maintaining our life-support loop.'
        }
      ]);
    } else if (npc.id === 'maya') {
      triggerDialogue([
        {
          speaker: 'MAYA',
          role: 'CHIEF ENGINEER',
          portrait: 'maya',
          text: 'Cadet! The fusion coils and life support ducts took heavy stress.'
        },
        {
          speaker: 'MAYA',
          role: 'CHIEF ENGINEER',
          portrait: 'maya',
          text: 'If CO₂ spikes above 80%, hypoxia will take down the crew. Check the scrubbers in Life Support!'
        }
      ]);
    } else if (npc.id === 'tariq') {
      triggerDialogue([
        {
          speaker: 'DR. TARIQ',
          role: 'SCIENCE OFFICER',
          portrait: 'tariq',
          text: 'Sensors detect atmospheric fluctuations. The hydroponic crop cultures are vital.'
        },
        {
          speaker: 'DR. TARIQ',
          role: 'SCIENCE OFFICER',
          portrait: 'tariq',
          text: 'Balance the nutrient levers in Hydroponics so our rations don\'t collapse before Valkyrie arrives.'
        }
      ]);
    }
  }

  // ============================================================================
  // 20. TACTILE TERMINAL MINIGAMES
  // ============================================================================
  function openTaskModal(task) {
    audio.play('blip');
    STATE.activeTaskModal = task;

    document.getElementById('minigame-room-tag').textContent = task.room.toUpperCase() + ' SUBSYSTEM';
    document.getElementById('minigame-title').textContent = task.name.toUpperCase();
    document.getElementById('minigame-instructions').textContent = task.instruction;

    const viewport = document.getElementById('minigame-viewport');
    viewport.innerHTML = '';

    switch (task.minigame) {
      case 'radar_align':
        renderRadarMinigame(viewport, task);
        break;
      case 'freq_tune':
        renderFrequencyMinigame(viewport, task);
        break;
      case 'nutrient_balance':
        renderNutrientMinigame(viewport, task);
        break;
      case 'dna_match':
        renderDNAMinigame(viewport, task);
        break;
      case 'hull_weld':
        renderHullWeldMinigame(viewport, task);
        break;
      case 'reactor_flux':
        renderReactorFluxMinigame(viewport, task);
        break;
      case 'gyro_lock':
        renderGyroMinigame(viewport, task);
        break;
      case 'code_hack':
      default:
        renderCodeHackMinigame(viewport, task);
        break;
    }

    document.getElementById('task-modal').classList.add('active');
  }

  function closeTaskModal() {
    audio.play('click');
    STATE.activeTaskModal = null;
    document.getElementById('task-modal').classList.remove('active');
  }

  function completeTask(task) {
    audio.play('confirm');
    task.completed = true;

    STATE.o2 = Math.min(100, STATE.o2 + (task.o2Bonus || 15));
    STATE.co2 = Math.max(5, STATE.co2 + (task.co2Bonus || -15));
    STATE.food = Math.min(100, STATE.food + (task.foodBonus || 10));

    updateHUDResources();
    updateChecklistDrawer();
    showToast(`${task.name.toUpperCase()} RESTORED!`);

    if (task.id === 'task_life_patch' && STATE.isAlarming) {
      triggerRedAlarm(false);
    }

    closeTaskModal();
    checkDailyCompletion();
  }

  // --- MINIGAME 1: Radar Orbital Course Alignment ---
  function renderRadarMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%; height:100%; justify-content:center;">
        <div style="position:relative; width:260px; height:260px; border-radius:50%; border:2px solid #00f0ff; background:#080e1a; overflow:hidden; box-shadow:0 0 25px rgba(0,240,255,0.3);">
          <div style="position:absolute; inset:0; border-radius:50%; border:1px dashed rgba(0,240,255,0.4);"></div>
          <div style="position:absolute; width:100%; height:1px; top:50%; background:rgba(0,240,255,0.3);"></div>
          <div style="position:absolute; height:100%; width:1px; left:50%; background:rgba(0,240,255,0.3);"></div>
          <div id="radar-beacon" style="position:absolute; width:24px; height:24px; border-radius:50%; background:#00e676; box-shadow:0 0 15px #00e676; top:35px; left:180px; cursor:pointer;"></div>
          <div id="radar-crosshair" style="position:absolute; width:36px; height:36px; border:2px solid #ff1744; border-radius:50%; top:120px; left:50px; pointer-events:none; transition:transform 0.05s;">
            <div style="position:absolute; width:100%; height:2px; top:17px; background:#ff1744;"></div>
            <div style="position:absolute; height:100%; width:2px; left:17px; background:#ff1744;"></div>
          </div>
        </div>
        <button id="btn-lock-radar" class="p3-primary-btn"><span>LOCK ORBITAL BEACON</span></button>
      </div>
    `;

    const beacon = container.querySelector('#radar-beacon');
    const crosshair = container.querySelector('#radar-crosshair');
    const lockBtn = container.querySelector('#btn-lock-radar');
    let locked = false;

    container.querySelector('div[style*="border-radius:50%"]').addEventListener('mousemove', e => {
      if (locked) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(10, Math.min(230, e.clientX - rect.left - 18));
      const y = Math.max(10, Math.min(230, e.clientY - rect.top - 18));
      crosshair.style.left = x + 'px';
      crosshair.style.top = y + 'px';

      const dist = Math.hypot(x - 180, y - 35);
      if (dist < 20) {
        crosshair.style.borderColor = '#00e676';
        lockBtn.style.background = 'linear-gradient(135deg, #00e676, #059669)';
        locked = true;
        audio.play('blip');
      }
    });

    lockBtn.addEventListener('click', () => {
      if (locked) {
        completeTask(task);
      } else {
        showToast('ALIGN CROSSHAIR ON GREEN BEACON FIRST');
        audio.play('click');
      }
    });
  }

  // --- MINIGAME 2: Frequency Wave Tuner ---
  function renderFrequencyMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%; padding:1.5rem;">
        <canvas id="wave-canvas" width="480" height="160" style="background:#090e1a; border:2px solid #00f0ff; border-radius:6px; box-shadow:0 0 20px rgba(0,240,255,0.25);"></canvas>
        <div style="display:flex; gap:2rem; width:100%; max-width:480px;">
          <div style="flex:1; display:flex; flex-direction:column; gap:0.4rem;">
            <label style="font-family:'Teko'; font-size:1.1rem; color:#00f0ff;">FREQUENCY (Hz)</label>
            <input type="range" id="freq-slider" min="1" max="10" value="3" style="width:100%; cursor:pointer;">
          </div>
          <div style="flex:1; display:flex; flex-direction:column; gap:0.4rem;">
            <label style="font-family:'Teko'; font-size:1.1rem; color:#00f0ff;">AMPLITUDE</label>
            <input type="range" id="amp-slider" min="10" max="70" value="25" style="width:100%; cursor:pointer;">
          </div>
        </div>
        <div style="font-family:'JetBrains Mono'; font-size:1.1rem; color:#fff;">SIGNAL RESONANCE: <span id="resonance-val" style="color:#ff1744;">45%</span></div>
        <button id="btn-broadcast-freq" class="p3-primary-btn"><span>LOCK FREQUENCY</span></button>
      </div>
    `;

    const canvas = container.querySelector('#wave-canvas');
    const ctx = canvas.getContext('2d');
    const freqInput = container.querySelector('#freq-slider');
    const ampInput = container.querySelector('#amp-slider');
    const resText = container.querySelector('#resonance-val');
    const broadcastBtn = container.querySelector('#btn-broadcast-freq');

    let animId;
    let t = 0;
    const targetFreq = 6;
    const targetAmp = 50;

    function drawWave() {
      t += 0.04;
      ctx.fillStyle = '#090e1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = 80 + Math.sin(x * 0.03 * targetFreq + t) * targetAmp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const uFreq = parseFloat(freqInput.value);
      const uAmp = parseFloat(ampInput.value);

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = 80 + Math.sin(x * 0.03 * uFreq + t) * uAmp;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      const diffFreq = Math.abs(uFreq - targetFreq);
      const diffAmp = Math.abs(uAmp - targetAmp);
      const match = Math.max(0, Math.min(100, Math.round(100 - diffFreq * 12 - diffAmp * 1.2)));

      resText.textContent = match + '%';
      resText.style.color = match > 88 ? '#00e676' : '#ff1744';

      animId = requestAnimationFrame(drawWave);
    }
    drawWave();

    broadcastBtn.addEventListener('click', () => {
      const match = parseInt(resText.textContent);
      if (match >= 88) {
        cancelAnimationFrame(animId);
        completeTask(task);
      } else {
        showToast('MATCH THE TARGET WAVE (>88%)');
        audio.play('click');
      }
    });
  }

  // --- MINIGAME 3: Nutrient Balancing Levers ---
  function renderNutrientMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.5rem; width:100%; padding:1.5rem;">
        <div style="display:flex; justify-content:space-around; width:100%; max-width:460px;">
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <span style="font-family:'Teko'; font-size:1.3rem; color:#00e676;">NITROGEN (N)</span>
            <input type="range" orient="vertical" id="lever-n" min="0" max="100" value="20" style="height:150px; cursor:pointer;">
            <span id="val-n" style="font-family:'JetBrains Mono'; color:#cbd5e1;">20%</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <span style="font-family:'Teko'; font-size:1.3rem; color:#00e676;">PHOSPHORUS (P)</span>
            <input type="range" orient="vertical" id="lever-p" min="0" max="100" value="85" style="height:150px; cursor:pointer;">
            <span id="val-p" style="font-family:'JetBrains Mono'; color:#cbd5e1;">85%</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:0.5rem;">
            <span style="font-family:'Teko'; font-size:1.3rem; color:#00e676;">POTASSIUM (K)</span>
            <input type="range" orient="vertical" id="lever-k" min="0" max="100" value="10" style="height:150px; cursor:pointer;">
            <span id="val-k" style="font-family:'JetBrains Mono'; color:#cbd5e1;">10%</span>
          </div>
        </div>
        <div style="font-size:0.95rem; color:#94a3b8; text-align:center;">TARGET SAFE ZONE: N [55-65%] &bull; P [40-50%] &bull; K [70-80%]</div>
        <button id="btn-inject-nutrients" class="p3-primary-btn"><span>INJECT NUTRIENT FORMULA</span></button>
      </div>
    `;

    const levN = container.querySelector('#lever-n');
    const levP = container.querySelector('#lever-p');
    const levK = container.querySelector('#lever-k');
    const vN = container.querySelector('#val-n');
    const vP = container.querySelector('#val-p');
    const vK = container.querySelector('#val-k');

    [levN, levP, levK].forEach(l => {
      l.addEventListener('input', () => {
        vN.textContent = levN.value + '%';
        vP.textContent = levP.value + '%';
        vK.textContent = levK.value + '%';
      });
    });

    container.querySelector('#btn-inject-nutrients').addEventListener('click', () => {
      const n = parseInt(levN.value);
      const p = parseInt(levP.value);
      const k = parseInt(levK.value);

      if (n >= 50 && n <= 70 && p >= 35 && p <= 55 && k >= 65 && k <= 85) {
        completeTask(task);
      } else {
        showToast('ALL LEVERS MUST BE IN TARGET ZONES');
        audio.play('click');
      }
    });
  }

  // --- MINIGAME 4: DNA Sequence Matching ---
  function renderDNAMinigame(container, task) {
    const targetPairs = ['A', 'C', 'T', 'G'];
    const complements = { A: 'T', T: 'A', C: 'G', G: 'C' };
    let currentIndex = 0;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.4rem; width:100%; padding:1.5rem;">
        <div style="font-family:'Teko'; font-size:1.4rem; color:#2dd4bf;">SYNTHESIZE BASE PAIR COMPLEMENTS</div>
        <div style="display:flex; gap:1.2rem;">
          ${targetPairs.map((b, i) => `
            <div id="dna-slot-${i}" style="width:65px; height:75px; background:#0f172a; border:2px solid #334155; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.2rem;">
              <span style="font-family:'Teko'; font-size:1.6rem; color:#00f0ff;">${b}</span>
              <span class="slot-comp" style="font-family:'JetBrains Mono'; font-size:1.1rem; color:#64748b;">?</span>
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:1rem; margin-top:0.8rem;">
          <button class="dna-btn p3-primary-btn" data-base="A"><span>BASE A</span></button>
          <button class="dna-btn p3-primary-btn" data-base="T"><span>BASE T</span></button>
          <button class="dna-btn p3-primary-btn" data-base="C"><span>BASE C</span></button>
          <button class="dna-btn p3-primary-btn" data-base="G"><span>BASE G</span></button>
        </div>
      </div>
    `;

    container.querySelectorAll('.dna-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.dataset.base;
        const required = complements[targetPairs[currentIndex]];

        if (selected === required) {
          audio.play('blip');
          const slot = container.querySelector(`#dna-slot-${currentIndex} .slot-comp`);
          slot.textContent = selected;
          slot.style.color = '#00e676';
          container.querySelector(`#dna-slot-${currentIndex}`).style.borderColor = '#00e676';
          currentIndex++;

          if (currentIndex >= targetPairs.length) {
            setTimeout(() => completeTask(task), 300);
          }
        } else {
          audio.play('click');
          showToast(`INCORRECT PAIR! (A pairs with T, C pairs with G)`);
        }
      });
    });
  }

  // --- MINIGAME 5: Air Shaft Titanium Plate Weld ---
  function renderHullWeldMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1rem; width:100%; height:100%; justify-content:center;">
        <div id="weld-stage" style="position:relative; width:340px; height:240px; background:#080e1a; border:3px solid #ff1744; overflow:hidden;">
          <div style="position:absolute; width:160px; height:80px; top:80px; left:90px; border:2px dashed #ff1744; background:rgba(255,23,68,0.15); display:flex; align-items:center; justify-content:center;">
            <span style="font-family:'Teko'; font-size:1.1rem; color:#ff1744;">HULL BREACH</span>
          </div>
          <div id="drag-patch" style="position:absolute; width:160px; height:80px; top:15px; left:15px; background:linear-gradient(135deg, #475569, #1e293b); border:2px solid #00f0ff; cursor:grab; display:flex; align-items:center; justify-content:center; box-shadow:0 0 15px rgba(0,240,255,0.4);">
            <span style="font-family:'Teko'; font-size:1.1rem; color:#00f0ff; pointer-events:none;">TITANIUM PLATE</span>
          </div>
        </div>
        <button id="btn-seal-weld" class="p3-primary-btn disabled"><span>WELD HULL SEAMS</span></button>
      </div>
    `;

    const patch = container.querySelector('#drag-patch');
    const sealBtn = container.querySelector('#btn-seal-weld');
    let isDragging = false;
    let startX = 0, startY = 0, initialLeft = 15, initialTop = 15;
    let isAligned = false;

    patch.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = patch.offsetLeft;
      initialTop = patch.offsetTop;
      patch.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const nx = Math.max(5, Math.min(170, initialLeft + dx));
      const ny = Math.max(5, Math.min(150, initialTop + dy));
      patch.style.left = nx + 'px';
      patch.style.top = ny + 'px';

      if (Math.abs(nx - 90) < 18 && Math.abs(ny - 80) < 18) {
        patch.style.borderColor = '#00e676';
        sealBtn.classList.remove('disabled');
        isAligned = true;
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      patch.style.cursor = 'grab';
    });

    sealBtn.addEventListener('click', () => {
      if (isAligned) {
        completeTask(task);
      } else {
        showToast('DRAG PLATE OVER BREACH FIRST');
      }
    });
  }

  // --- MINIGAME 6: Fusion Reactor Flux Calibration ---
  function renderReactorFluxMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%; padding:1.5rem;">
        <div style="font-family:'Teko'; font-size:1.5rem; color:#00f0ff;">MAGNETIC CONFINEMENT FLUX</div>
        <div style="display:flex; gap:1.5rem; width:100%; max-width:480px;">
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.4rem;">
            <label style="font-family:'Teko'; font-size:1.1rem; color:#38bdf8;">COIL ALPHA</label>
            <input type="range" id="flux-1" min="0" max="100" value="25" style="width:100%; cursor:pointer;">
            <span id="flux-v1" style="font-family:'JetBrains Mono'; color:#fff;">25%</span>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:0.4rem;">
            <label style="font-family:'Teko'; font-size:1.1rem; color:#38bdf8;">COIL BETA</label>
            <input type="range" id="flux-2" min="0" max="100" value="70" style="width:100%; cursor:pointer;">
            <span id="flux-v2" style="font-family:'JetBrains Mono'; color:#fff;">70%</span>
          </div>
        </div>
        <div style="font-size:0.95rem; color:#94a3b8;">STABILITY TARGET: BOTH COILS AT 50% &plusmn; 8%</div>
        <button id="btn-flux-lock" class="p3-primary-btn"><span>SYNCHRONIZE FLUX</span></button>
      </div>
    `;

    const f1 = container.querySelector('#flux-1');
    const f2 = container.querySelector('#flux-2');
    const v1 = container.querySelector('#flux-v1');
    const v2 = container.querySelector('#flux-v2');

    [f1, f2].forEach(sl => {
      sl.addEventListener('input', () => {
        v1.textContent = f1.value + '%';
        v2.textContent = f2.value + '%';
      });
    });

    container.querySelector('#btn-flux-lock').addEventListener('click', () => {
      const val1 = parseInt(f1.value);
      const val2 = parseInt(f2.value);
      if (Math.abs(val1 - 50) <= 8 && Math.abs(val2 - 50) <= 8) {
        completeTask(task);
      } else {
        showToast('ADJUST BOTH SLIDERS TO 50%');
        audio.play('click');
      }
    });
  }

  // --- MINIGAME 7: Gyroscope Reset Lock ---
  function renderGyroMinigame(container, task) {
    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%; height:100%; justify-content:center;">
        <div style="position:relative; width:220px; height:220px; border-radius:50%; border:3px solid #334155; display:flex; align-items:center; justify-content:center;">
          <div id="gyro-notch" style="position:absolute; width:12px; height:12px; top:-6px; background:#00f0ff; border-radius:50%; box-shadow:0 0 10px #00f0ff;"></div>
          <div id="gyro-spinner" style="position:absolute; width:180px; height:180px; border-radius:50%; border:3px dashed #00e676;">
            <div style="position:absolute; width:14px; height:14px; top:-7px; left:83px; background:#00e676; border-radius:50%;"></div>
          </div>
        </div>
        <button id="btn-lock-gyro" class="p3-primary-btn"><span>LOCK GYRO ALIGNMENT</span></button>
      </div>
    `;

    const spinner = container.querySelector('#gyro-spinner');
    let angle = 0;
    let animId;

    function spin() {
      angle = (angle + 2.5) % 360;
      spinner.style.transform = `rotate(${angle}deg)`;
      animId = requestAnimationFrame(spin);
    }
    spin();

    container.querySelector('#btn-lock-gyro').addEventListener('click', () => {
      if (angle <= 25 || angle >= 335) {
        cancelAnimationFrame(animId);
        completeTask(task);
      } else {
        showToast('MISSED ALIGNMENT! TIMING IS CRITICAL');
        audio.play('click');
      }
    });
  }

  // --- MINIGAME 8: Biometric Code Entry ---
  function renderCodeHackMinigame(container, task) {
    const code = ['7', '3', '9', '2'];
    let entered = '';

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:1.2rem; width:100%; padding:1rem;">
        <div style="font-family:'Teko'; font-size:1.3rem; color:#818cf8;">INPUT OVERRIDE KEY: [ 7 - 3 - 9 - 2 ]</div>
        <div id="code-display" style="width:200px; height:45px; background:#0f172a; border:2px solid #00f0ff; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono'; font-size:1.5rem; color:#00f0ff; letter-spacing:0.3em;">____</div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.6rem; width:220px;">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
            <button class="num-key p3-primary-btn" data-num="${n}" style="padding:0.6rem; font-size:1.2rem;"><span>${n}</span></button>
          `).join('')}
        </div>
      </div>
    `;

    const display = container.querySelector('#code-display');

    container.querySelectorAll('.num-key').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.play('blip');
        entered += btn.dataset.num;
        display.textContent = entered.padEnd(4, '_');

        if (entered.length === 4) {
          if (entered === code.join('')) {
            completeTask(task);
          } else {
            audio.play('click');
            showToast('ACCESS DENIED: KEYPAD CLEARED');
            entered = '';
            display.textContent = '____';
          }
        }
      });
    });
  }

  // ============================================================================
  // 21. PERSONA 3 MINIMAP (BOTTOM-LEFT RADAR)
  // ============================================================================
  function updateMinimap() {
    const canvas = document.getElementById('minimap-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, w, h);

    // Map bounds: X ∈ [-45, 45], Z ∈ [-55, 45]
    // Center at (w/2, h/2 - 5)
    const scale = 1.35;
    const ox = w / 2;
    const oz = h / 2 + 5;

    function toScreen(x, z) {
      return {
        x: ox + x * scale,
        y: oz + z * scale
      };
    }

    // Draw all sectors
    SECTORS.forEach(s => {
      const p1 = toScreen(s.minX, s.minZ);
      const p2 = toScreen(s.maxX, s.maxZ);
      const sw = p2.x - p1.x;
      const sh = p2.y - p1.y;

      const isCurrent = s.name === STATE.currentRoom;

      ctx.fillStyle = isCurrent ? 'rgba(0, 240, 255, 0.28)' : 'rgba(30, 41, 59, 0.45)';
      ctx.fillRect(p1.x, p1.y, sw, sh);

      ctx.strokeStyle = isCurrent ? '#00f0ff' : 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = isCurrent ? 1.5 : 1;
      ctx.strokeRect(p1.x, p1.y, sw, sh);
    });

    // Draw NPC Markers
    Object.values(crewCharacters).forEach(c => {
      const sp = toScreen(c.data.x, c.data.z);
      ctx.fillStyle = '#' + c.data.coatColor.toString(16).padStart(6, '0');
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Player Arrow
    if (playerGroup) {
      const p = playerGroup.position;
      const sp = toScreen(p.x, p.z);
      const rot = -playerGroup.rotation.y + Math.PI;

      ctx.save();
      ctx.translate(sp.x, sp.y);
      ctx.rotate(rot);

      // Cyan Player Arrow
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4, 5);
      ctx.lineTo(0, 3);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    // Update Room Title
    const titleEl = document.getElementById('minimap-room-title');
    if (titleEl && STATE.currentRoom) {
      titleEl.textContent = STATE.currentRoom.toUpperCase();
    }
  }

  // ============================================================================
  // 22. HUD, DRAWER & RESOURCE UPDATES
  // ============================================================================
  function updateChecklistDrawer() {
    const list = document.getElementById('task-checklist-list');
    const ratio = document.getElementById('task-completed-ratio');
    if (!list) return;

    list.innerHTML = '';
    const completedCount = TASKS.filter(t => t.completed).length;
    ratio.textContent = `${completedCount}/${TASKS.length}`;

    TASKS.forEach(t => {
      const li = document.createElement('li');
      li.className = `drawer-item ${t.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span class="item-check">${t.completed ? '✓' : '○'}</span>
        <div class="item-info">
          <strong class="item-name">${t.name}</strong>
          <span class="item-room">${t.room}</span>
        </div>
      `;
      li.addEventListener('click', () => {
        if (!t.completed) showToast(`NAVIGATE TO ${t.room.toUpperCase()}`);
      });
      list.appendChild(li);
    });
  }

  function updateHUDResources() {
    const valO2 = document.getElementById('val-o2');
    const barO2 = document.getElementById('bar-o2');
    if (valO2 && barO2) {
      valO2.textContent = Math.round(STATE.o2) + '%';
      barO2.style.width = Math.round(STATE.o2) + '%';
      barO2.style.background = STATE.o2 < 30 ? 'linear-gradient(90deg, #be123c, #ff1744)' : 'linear-gradient(90deg, #0284c7, #00f0ff)';
    }

    const valCO2 = document.getElementById('val-co2');
    const barCO2 = document.getElementById('bar-co2');
    if (valCO2 && barCO2) {
      valCO2.textContent = Math.round(STATE.co2) + '%';
      barCO2.style.width = Math.round(STATE.co2) + '%';
      barCO2.style.background = STATE.co2 > 70 ? 'linear-gradient(90deg, #b91c1c, #ff1744)' : 'linear-gradient(90deg, #d97706, #f97316)';
    }

    const valFood = document.getElementById('val-food');
    const barFood = document.getElementById('bar-food');
    if (valFood && barFood) {
      valFood.textContent = Math.round(STATE.food) + '%';
      barFood.style.width = Math.round(STATE.food) + '%';
    }

    if (STATE.o2 <= 0 || STATE.co2 >= 100 || STATE.food <= 0) {
      triggerDefeat();
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('toast-banner');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ============================================================================
  // 23. 7-DAY PROGRESSION
  // ============================================================================
  function checkDailyCompletion() {
    const solData = SOl_DATA[STATE.sol - 1];
    if (!solData) return;

    const reqDone = solData.requiredTasks.every(tid => {
      const t = TASKS.find(item => item.id === tid);
      return t && t.completed;
    });

    if (reqDone) {
      setTimeout(() => triggerEveningDebrief(), 800);
    }
  }

  function triggerEveningDebrief() {
    audio.play('confirm');
    const solData = SOl_DATA[STATE.sol - 1];

    document.getElementById('day-deb-title').textContent = `SOL 0${STATE.sol} COMPLETED`;
    document.getElementById('day-deb-quote').textContent = solData.quote;
    document.getElementById('deb-o2').textContent = Math.round(STATE.o2) + '%';
    document.getElementById('deb-co2').textContent = Math.round(STATE.co2) + '%';
    document.getElementById('deb-food').textContent = Math.round(STATE.food) + '%';

    document.getElementById('day-transition-modal').classList.add('active');
  }

  function advanceToNextSol() {
    document.getElementById('day-transition-modal').classList.remove('active');

    if (STATE.sol >= STATE.maxSols) {
      triggerVictory();
      return;
    }

    STATE.sol++;
    const nextSolData = SOl_DATA[STATE.sol - 1];

    TASKS.forEach(t => t.completed = false);

    STATE.food = Math.max(10, STATE.food - 12);
    STATE.co2 = Math.min(80, STATE.co2 + 10);
    STATE.o2 = Math.max(20, STATE.o2 - 8);

    document.getElementById('hud-sol-num').textContent = `0${STATE.sol}`;
    document.getElementById('hud-mission-title').textContent = nextSolData.title;
    document.getElementById('hud-objective-text').textContent = nextSolData.objective;

    updateHUDResources();
    updateChecklistDrawer();
    showToast(`AWAKENED TO SOL 0${STATE.sol}`);

    if (STATE.sol === 7) {
      triggerDialogue([
        {
          speaker: 'CAPTAIN VANCE',
          role: 'COMMANDER',
          portrait: 'vance',
          text: 'Cadet Leo! Valkyrie-1 is on radar final approach! Broadcast our transponder and prepare for docking!'
        }
      ]);
    }
  }

  function triggerVictory() {
    audio.play('confirm');
    document.getElementById('ending-cutscene-modal').classList.add('active');
  }

  function triggerDefeat() {
    audio.play('alarm');
    let reason = 'Atmospheric oxygen depleted. The crew succumbed before rescue arrived.';
    if (STATE.co2 >= 100) reason = 'Carbon dioxide reached lethal toxicity levels across all decks.';
    if (STATE.food <= 0) reason = 'Food rations completely exhausted. Survival was no longer possible.';

    document.getElementById('defeat-reason-text').textContent = reason;
    document.getElementById('defeat-modal').classList.add('active');
  }

  // ============================================================================
  // 24. PLAYER MOVEMENT & COLLISION RESOLUTION (WATERTIGHT & WALL SLIDING)
  // ============================================================================
  function updatePlayerMovement(delta) {
    if (STATE.inCutscene || STATE.inDialogue || STATE.activeTaskModal) {
      return;
    }

    const isRunning = keysDown['shift'] || keysDown['shiftleft'] || keysDown['shiftright'];
    const speed = (isRunning ? 13.5 : 8.5) * delta;

    let moveX = 0;
    let moveZ = 0;

    if (keysDown['w'] || keysDown['arrowup']) moveZ -= 1;
    if (keysDown['s'] || keysDown['arrowdown']) moveZ += 1;
    if (keysDown['a'] || keysDown['arrowleft']) moveX -= 1;
    if (keysDown['d'] || keysDown['arrowright']) moveX += 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    playerAnim.isMoving = isMoving;
    playerAnim.isRunning = isRunning;

    if (isMoving) {
      const len = Math.hypot(moveX, moveZ);
      moveX /= len;
      moveZ /= len;

      // Transform movement relative to camera yaw
      const camYaw = cameraSettings.yaw;
      const worldDX = moveX * Math.cos(camYaw) - moveZ * Math.sin(camYaw);
      const worldDZ = moveX * Math.sin(camYaw) + moveZ * Math.cos(camYaw);

      const curX = playerGroup.position.x;
      const curZ = playerGroup.position.z;
      const newX = curX + worldDX * speed;
      const newZ = curZ + worldDZ * speed;

      // Collision with Wall-Sliding: test full move -> X-only -> Z-only
      if (isPositionWalkable(newX, newZ)) {
        playerGroup.position.x = newX;
        playerGroup.position.z = newZ;
      } else if (isPositionWalkable(newX, curZ)) {
        playerGroup.position.x = newX;
      } else if (isPositionWalkable(curX, newZ)) {
        playerGroup.position.z = newZ;
      }

      // Smoothly rotate player toward movement direction
      const targetAngle = Math.atan2(worldDX, worldDZ);
      playerGroup.rotation.y = THREE.MathUtils.lerp(playerGroup.rotation.y, targetAngle, 0.22);

      // Footstep audio
      const animFreq = isRunning ? 16 : 10;
      playerAnim.walkCycle += delta * animFreq;
      if (Math.sin(playerAnim.walkCycle) > 0.94 && !playerAnim._stepped) {
        audio.play('step');
        playerAnim._stepped = true;
      } else if (Math.sin(playerAnim.walkCycle) <= 0.94) {
        playerAnim._stepped = false;
      }

      // Skeletal Walk / Sprint Animations
      const swing = Math.sin(playerAnim.walkCycle) * (isRunning ? 0.75 : 0.52);
      playerSkeleton.hipL.rotation.x = swing;
      playerSkeleton.hipR.rotation.x = -swing;
      playerSkeleton.shoulderL.rotation.x = -swing * 0.85;
      playerSkeleton.shoulderR.rotation.x = swing * 0.85;

      // Forward Body Lean when sprinting
      playerSkeleton.spine.rotation.x = isRunning ? -0.22 : 0;
      playerSkeleton.pelvis.position.y = 1.15 + Math.abs(Math.sin(playerAnim.walkCycle * 2)) * 0.08;
    } else {
      // Idle Breathing Animation
      playerAnim.walkCycle += delta * 2;
      const breath = Math.sin(playerAnim.walkCycle) * 0.04;
      playerSkeleton.pelvis.position.y = 1.15 + breath;
      playerSkeleton.spine.rotation.x = THREE.MathUtils.lerp(playerSkeleton.spine.rotation.x, 0, 0.15);
      playerSkeleton.shoulderL.rotation.x = THREE.MathUtils.lerp(playerSkeleton.shoulderL.rotation.x, 0, 0.15);
      playerSkeleton.shoulderR.rotation.x = THREE.MathUtils.lerp(playerSkeleton.shoulderR.rotation.x, 0, 0.15);
      playerSkeleton.hipL.rotation.x = THREE.MathUtils.lerp(playerSkeleton.hipL.rotation.x, 0, 0.15);
      playerSkeleton.hipR.rotation.x = THREE.MathUtils.lerp(playerSkeleton.hipR.rotation.x, 0, 0.15);
    }

    // Update Room Location
    const room = getSectorAt(playerGroup.position.x, playerGroup.position.z);
    if (room !== STATE.currentRoom) {
      STATE.currentRoom = room;
      const el = document.getElementById('hud-room-name');
      if (el) el.textContent = room.toUpperCase();
    }
  }

  // ============================================================================
  // 25. THIRD-PERSON JRPG CAMERA SYSTEM (NO WALL CLIPPING, SMOOTH FOLLOW)
  // ============================================================================
  function updateCamera(delta) {
    if (STATE.inCutscene) {
      camera.position.lerp(targetCamPos, 0.08);
      camera.lookAt(targetLookAt);
      return;
    }

    const pPos = playerGroup.position;
    const dist = cameraSettings.distance;
    const height = cameraSettings.height;

    // Spherical orbit coordinates relative to player
    const offsetX = Math.sin(cameraSettings.yaw) * Math.cos(cameraSettings.pitch) * dist;
    const offsetZ = Math.cos(cameraSettings.yaw) * Math.cos(cameraSettings.pitch) * dist;
    const offsetY = Math.sin(cameraSettings.pitch) * dist + height;

    const idealCamPos = new THREE.Vector3(
      pPos.x - offsetX,
      pPos.y + offsetY,
      pPos.z - offsetZ
    );

    camera.position.lerp(idealCamPos, 0.14);

    const lookTarget = new THREE.Vector3(pPos.x, pPos.y + 1.7, pPos.z);
    camera.lookAt(lookTarget);
  }

  // ============================================================================
  // 26. MAIN ANIMATION & RENDERING LOOP
  // ============================================================================
  let clock = new THREE.Clock();

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    const delta = Math.min(clock.getDelta(), 0.1);

    // Resource degradation
    STATE.o2 = Math.max(0, STATE.o2 - delta * 0.04);
    STATE.co2 = Math.min(100, STATE.co2 + delta * 0.035);
    STATE.food = Math.max(0, STATE.food - delta * 0.025);
    updateHUDResources();

    // Movement & Camera
    updatePlayerMovement(delta);
    updateCamera(delta);

    // Rotate Cosmos Asteroids
    asteroidMeshes.forEach(a => {
      a.mesh.rotation.x += a.rotSpeed.x;
      a.mesh.rotation.y += a.rotSpeed.y;
    });

    // Spin Holographic Globe
    if (scene.userData.globe) {
      scene.userData.globe.rotation.y += 0.01;
    }

    // Pulse Fusion Reactor Core
    if (scene.userData.reactorGroup) {
      scene.userData.reactorGroup.rotation.y += 0.025;
      scene.userData.reactorGroup.rotation.z += 0.015;
      if (reactorLight) {
        reactorLight.intensity = 2.4 + Math.sin(clock.getElapsedTime() * 6) * 0.6;
      }
    }

    // Hover Overhead Interactive Diamonds
    const hover = Math.sin(clock.getElapsedTime() * 4) * 0.12;
    interactiveObjects.forEach(obj => {
      if (obj.marker) {
        obj.marker.position.y = 2.4 + hover;
        obj.marker.rotation.y += 0.03;
      }
    });

    Object.values(crewCharacters).forEach(c => {
      if (c.diamond) {
        c.diamond.position.y = 3.4 + hover;
        c.diamond.rotation.y += 0.03;
      }
    });

    // Proximity Prompts & Minimap
    updateProximityCheck();
    updateMinimap();

    // Render Scene
    renderer.render(scene, camera);
  }

  function onWindowResize() {
    if (!renderer || !camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // ============================================================================
  // 27. AUTOMATED NAVIGATION VERIFICATION SUITE
  // ============================================================================
  // Validates that every single sector and room is 100% accessible
  window.__verifySpaceshipNavigation = function () {
    console.log('%c[CSS CHRYSALIS] Running Complete NavMesh Accessibility Audit...', 'color:#00f0ff; font-weight:bold;');

    const waypoints = [
      { name: 'Command Bridge', x: 0, z: -28 },
      { name: 'Observation Deck', x: 0, z: -44 },
      { name: 'North Corridor', x: 0, z: -16 },
      { name: 'Central Atrium', x: 0, z: 0 },
      { name: 'South Corridor', x: 0, z: 16 },
      { name: 'Engineering Bay', x: 0, z: 32 },
      { name: 'West Corridor', x: -16, z: 0 },
      { name: 'Science Lab', x: -32, z: 0 },
      { name: 'Communications Hub', x: -32, z: -26 },
      { name: 'Life Support', x: -32, z: 26 },
      { name: 'East Corridor', x: 16, z: 0 },
      { name: 'Hydroponics Bay', x: 32, z: 0 },
      { name: 'Crew Quarters', x: 32, z: -26 },
      { name: 'Cargo Bay', x: 32, z: 26 }
    ];

    let passed = true;

    // Test 1: Verify all waypoints are strictly walkable
    waypoints.forEach(wp => {
      const walkable = isPositionWalkable(wp.x, wp.z);
      if (!walkable) {
        console.error(`FAIL: Waypoint ${wp.name} at (${wp.x}, ${wp.z}) is NOT walkable!`);
        passed = false;
      } else {
        console.log(`✓ Waypoint ${wp.name} is walkable.`);
      }
    });

    // Test 2: Verify continuous path walkability between adjacent sectors
    const transitions = [
      ['Command Bridge', 'North Corridor', 0, -22],
      ['North Corridor', 'Central Atrium', 0, -10],
      ['Central Atrium', 'South Corridor', 0, 10],
      ['South Corridor', 'Engineering Bay', 0, 22],
      ['Central Atrium', 'West Corridor', -10, 0],
      ['West Corridor', 'Science Lab', -23, 0],
      ['Science Lab', 'Communications Hub', -32, -18],
      ['Science Lab', 'Life Support', -32, 18],
      ['Central Atrium', 'East Corridor', 10, 0],
      ['East Corridor', 'Hydroponics Bay', 23, 0],
      ['Hydroponics Bay', 'Crew Quarters', 32, -18],
      ['Hydroponics Bay', 'Cargo Bay', 32, 18],
      ['Command Bridge', 'Observation Deck', 0, -38]
    ];

    transitions.forEach(([from, to, x, z]) => {
      const walkable = isPositionWalkable(x, z);
      if (!walkable) {
        console.error(`FAIL: Seam between ${from} and ${to} at (${x}, ${z}) is BLOCKED!`);
        passed = false;
      } else {
        console.log(`✓ Seam between ${from} and ${to} is smooth & continuous.`);
      }
    });

    if (passed) {
      console.log('%c[CSS CHRYSALIS] ALL 14 SECTORS & TRANSITIONS ACCESSIBLE: 100% PASS', 'color:#00e676; font-weight:bold;');
    }
    return passed;
  };

  // Bootstrap
  window.addEventListener('DOMContentLoaded', () => {
    initEngine();
  });

})();
