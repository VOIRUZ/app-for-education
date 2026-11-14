/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Master Game Controller & WebGL2/Canvas Outpost Visualizer
 * ============================================================================
 * Developed for NASA Space Apps Challenge 2026 - Junior Astronaut Mission Trainer
 * Core Simulation Engine: C++ compiled to WebAssembly (mars_outpost.wasm)
 * ============================================================================
 */

// ============================================================================
// 1. WEB AUDIO SYNTHESIZER ENGINE (Martian Soundscapes & Telemetry Audio)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq = 440, type = 'sine', duration = 0.1, gainVal = 0.08) {
    if (this.muted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio unavailable:", e);
    }
  }

  playClick() {
    this.playTone(880, 'sine', 0.04, 0.05);
  }

  playAction() {
    this.playTone(520, 'triangle', 0.08, 0.08);
    setTimeout(() => this.playTone(740, 'triangle', 0.10, 0.08), 60);
  }

  playAlarm() {
    if (this.muted) return;
    try {
      this.init();
      const now = this.ctx.currentTime;
      [0, 0.25, 0.5, 0.75].forEach((offset, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 587, now + offset);
        gain.gain.setValueAtTime(0.12, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch (e) {}
  }

  playAirlock() {
    if (this.muted) return;
    try {
      this.init();
      // Filtered white noise burst for pneumatic airlock release
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  playExplosion() {
    if (this.muted) return;
    try {
      this.init();
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.8);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playPowerCharge() {
    if (this.muted) return;
    try {
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playSuccess() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.08), idx * 90);
    });
  }

  playDefeat() {
    [440, 392, 349.23, 220].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.45, 0.10), idx * 180);
    });
  }

  startAmbientWind() {
    if (this.isAmbientPlaying || this.muted) return;
    try {
      this.init();
      const bufferSize = this.ctx.sampleRate * 2.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      this.ambientNode = this.ctx.createBufferSource();
      this.ambientNode.buffer = buffer;
      this.ambientNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 220;
      filter.Q.value = 3.0;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      this.ambientNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNode.start();
      this.isAmbientPlaying = true;
    } catch (e) {}
  }

  stopAmbientWind() {
    if (this.ambientNode) {
      try { this.ambientNode.stop(); } catch(e) {}
      this.ambientNode = null;
    }
    this.isAmbientPlaying = false;
  }
}

// ============================================================================
// 2. NASA / CSA EDUCATIONAL SCIENCE ENCYCLOPEDIA (Field Manual Data)
// ============================================================================
const NASA_FIELD_MANUAL = [
  {
    id: "moxie",
    title: "MOXIE: In-Situ Oxygen Generation",
    icon: "💨",
    badge: "NASA PERSEVERANCE / ECLSS",
    summary: "Extracting breathable oxygen directly from Mars' carbon-dioxide-rich atmosphere.",
    content: `
      <p>The <strong>Mars Oxygen ISRU Experiment (MOXIE)</strong> aboard NASA's Perseverance rover demonstrated that astronauts on Mars can manufacture their own oxygen using Solid Oxide Electrolysis.</p>
      <div class="field-callout">
        <strong>The Chemical Process:</strong> 2CO₂ &rarr; 2CO + O₂ (operating at 800°C)
      </div>
      <p>Mars' atmosphere is 95% carbon dioxide (CO₂). MOXIE draws in atmospheric gas, compresses it, and electrochemically strips oxygen atoms from CO₂ molecules. A full-scale human-grade oxygen plant on Mars will require approximately 25-30 kW of continuous electrical power to generate the 2-3 metric tons of O₂ needed annually for life support and rocket propellants.</p>
    `
  },
  {
    id: "eclss_water",
    title: "ECLSS: Closed-Loop Water Recovery",
    icon: "💧",
    badge: "INTERNATIONAL SPACE STATION",
    summary: "Reclaiming over 98% of all moisture through distillation and catalytic purification.",
    content: `
      <p>On Earth, fresh water is plentiful. On Mars, every droplet must be guarded and endlessly recycled. NASA's <strong>Environmental Control and Life Support System (ECLSS)</strong> uses two core assemblies:</p>
      <ul>
        <li><strong>Water Recovery System (WRS):</strong> Collects humidity condensate from crew respiration and sweat.</li>
        <li><strong>Urine Processor Assembly (UPA):</strong> Uses Vacuum Compression Distillation to boil urine in a spinning centrifuge, reclaiming clean distilled water while filtering out urea and salts.</li>
      </ul>
      <p>The purified distillate is passed through catalytic oxidizers and monitored by conductivity sensors before being mineralized for drinking and MOXIE electrolysis.</p>
    `
  },
  {
    id: "solar_dust",
    title: "Solar Arrays & Martian Atmospheric Dust (Tau)",
    icon: "⚡",
    badge: "MARS EXPLORATION ROVERS",
    summary: "Atmospheric optical depth, dust storms, and solar power attenuation.",
    content: `
      <p>Solar irradiance at Mars' orbital distance averages <strong>590 W/m²</strong> (compared to 1361 W/m² at Earth). Martian dust is ultra-fine, iron-rich, and statically charged.</p>
      <p>Solar energy attenuation follows the <strong>Beer-Lambert Law</strong>: <em>I = I₀ &times; e<sup>-&tau;</sup></em>, where <strong>&tau; (Tau)</strong> represents atmospheric optical depth.</p>
      <div class="field-callout">
        <strong>Historical Impact:</strong> NASA's Opportunity rover survived 14 years thanks to serendipitous wind 'cleaning events', but was finally silenced by a planet-encircling dust storm in 2018 when Tau exceeded 10.8.
      </div>
      <p>A permanent human outpost requires hybrid power: solar arrays with automated dust wipers or gas blowers paired with nuclear Kilopower / RTGs.</p>
    `
  },
  {
    id: "radiation",
    title: "Deep Space Radiation & Planetary Shielding",
    icon: "🛡️",
    badge: "SPACE RADIATION HEALTH",
    summary: "Galactic Cosmic Rays (GCR), Solar Particle Events (SPE), and hydrogenous shielding.",
    content: `
      <p>Mars lacks an intrinsic global magnetic field (magnetosphere) and has an atmospheric pressure of only ~6 millibars (under 1% of Earth). As a result, the Martian surface is exposed to two primary radiation hazards:</p>
      <ul>
        <li><strong>Galactic Cosmic Rays (GCR):</strong> Highly energetic atomic nuclei from deep space, delivering a constant background dose of ~0.65 mSv/day.</li>
        <li><strong>Solar Particle Events (SPE):</strong> Unpredictable coronal mass ejections that can spike surface radiation to over 10-15 mSv/day.</li>
      </ul>
      <p>Optimal shielding uses light, hydrogen-rich materials (water tanks, polyethylene polymers) and piled <strong>Martian regolith</strong> (soil) atop habitat domes.</p>
    `
  },
  {
    id: "aeroponics",
    title: "Space Aeroponics & Fresh Food Biomass",
    icon: "🌱",
    badge: "BIO-REGENERATIVE LIFE SUPPORT",
    summary: "Zero-soil closed-loop plant cultivation under tuned spectrum LED lighting.",
    content: `
      <p>Packaged NASA shelf-stable rations lose essential vitamins (such as C, B1, and K) over multi-year storage. Bio-regenerative life support utilizes <strong>aeroponic growth chambers</strong> where plant roots are suspended in air and misted with nutrient-dense water.</p>
      <p>Aeroponics uses 95% less water than traditional soil farming and accelerates growth by 300%. Beyond caloric nutrition, cultivating green living plants provides vital psychological morale to astronauts experiencing sensory deprivation on the red planet.</p>
    `
  },
  {
    id: "crew_psych",
    title: "Astronaut Physiology & The 24.6h Martian Sol",
    icon: "🧑‍🚀",
    badge: "NASA HUMAN RESEARCH PROGRAM",
    summary: "Circadian rhythm adaptation, microgravity deconditioning, and high-isolation stress.",
    content: `
      <p>A Martian day (a <strong>Sol</strong>) is 24 hours, 39 minutes, and 35.244 seconds long. While close to Earth's day, this 39-minute daily shift disrupts the human circadian pacemaker, leading to chronic sleep debt and cognitive fatigue if not managed with timed blue-enriched light therapy.</p>
      <p>Crew survival hinges on team cohesion, equitable workload balance during EVA repairs, and adequate caloric and hydration intake.</p>
    `
  }
];

// ============================================================================
// 3. NARRATIVE EVENT DATABASE (Rich Lore for Sols 1-7)
// ============================================================================
const SOL_NARRATIVE_EVENTS = [
  {
    sol: 1,
    title: "SOL 1: ANOMALY CONFIRMED",
    subtitle: "Earth Resupply Freighter 'Valkyrie-1' Delayed in Transit",
    badge: "ECLSS AUTONOMY MANDATE",
    badgeClass: "badge-cyan",
    desc: "Houston Deep Space Network telemetry confirms that resupply vessel 'Valkyrie-1' experienced a trajectory correction thruster malfunction during its Mars-insertion burn. Arrival is delayed by 7 Sols. The outpost must immediately transition from open consumption to autonomous closed-loop survival.",
    scienceContext: "NASA ECLSS protocols mandate autonomous life-support reserves. On Mars, resupply is separated by planetary transfer windows every 26 months. Self-sufficiency is paramount.",
    options: [
      {
        title: "Calibrate Strict ECLSS Conservation",
        desc: "Balance auxiliary power loops to preserve energy reserves. (Conserves 10 kWh battery buffer).",
        costBadge: "POWER +10 kWh",
        costClass: "cost-green"
      },
      {
        title: "Overclock MOXIE Electrolysis Unit",
        desc: "Force high-temp catalytic run to stockpile breathable air (+8 kg O₂), drawing 18 kWh power.",
        costBadge: "-18 kWh Power &rarr; +8 kg O₂",
        costClass: "cost-amber"
      },
      {
        title: "Prime Aeroponics Nutrient Reservoirs",
        desc: "Infuse greenhouse trays to accelerate food yield (+6 rations), consuming 8 Liters of water.",
        costBadge: "-8 L Water &rarr; +6 Food",
        costClass: "cost-blue"
      }
    ]
  },
  {
    sol: 2,
    title: "SOL 2: DUST DEVIL INCURSION",
    subtitle: "Thermal Vortex Sweeps Photovoltaic Array Beta",
    badge: "ENVIRONMENTAL HAZARD",
    badgeClass: "badge-amber",
    desc: "A massive Martian dust devil tore through the outpost sector. Electrostatic iron-oxide dust has settled over solar panels, dropping peak daytime electrical generation by over 35%. Battery reserves will drain rapidly during the freezing Martian night without intervention.",
    scienceContext: "Martian dust is fine, abrasive, and electrostatic. NASA rovers Opportunity and InSight both suffered fatal power loss from dust accumulation on solar arrays.",
    options: [
      {
        title: "Commander EVA: Manual Panel Brushing",
        desc: "Cmdr Chen ventures outside in sub-zero winds with microfiber brooms. Restores 100% solar efficiency (-10% Morale from fatigue).",
        costBadge: "-10% Crew Morale",
        costClass: "cost-purple"
      },
      {
        title: "Compressed Nitrogen Gas Pulse",
        desc: "Fire automated pneumatic air jets along panel tracks. Clears 80% dust, consuming 4 kg reserve Oxygen gas.",
        costBadge: "-4 kg Oxygen",
        costClass: "cost-cyan"
      },
      {
        title: "Rely on Nuclear RTG Baseline",
        desc: "Avoid spending crew energy or gas. Rely on 25 kWh RTG base power while solar array remains crippled (-20 kWh deficit).",
        costBadge: "-20 kWh Power Deficit",
        costClass: "cost-amber"
      }
    ]
  },
  {
    sol: 3,
    title: "SOL 3: REGIONAL DUST STORM",
    subtitle: "Optical Depth Spikes to Tau 1.85 — Solar Eclipse Twilight",
    badge: "SEVERE METEOROLOGY",
    badgeClass: "badge-red",
    desc: "Satellite reconnaissance detects a planetary-scale dust storm engulfing Chryse Planitia. Ambient sunlight drops by 70%, and surface temperatures plunge to -82°C. Habitat thermal heaters are working at maximum capacity to prevent airlock seals from cracking.",
    scienceContext: "Global dust storms on Mars loft dust 50 km high and block solar energy for weeks. Nuclear power and thermal loop sharing are essential for base survival.",
    options: [
      {
        title: "Engage RTG Fluid Heat Exchangers",
        desc: "Reroute hot radioactive decay runoff directly through habitat floor loops. Safely maintains warmth (-5 kWh power).",
        costBadge: "-5 kWh Power",
        costClass: "cost-green"
      },
      {
        title: "Mothball Aeroponics LED Grid",
        desc: "Temporarily power down greenhouse grow lights to conserve 25 kWh, sacrificing 8 fresh food crops.",
        costBadge: "-8 Food Rations",
        costClass: "cost-amber"
      },
      {
        title: "Overdrive Battery Discharge",
        desc: "Burn through 35 kWh stored battery power to keep every outpost subsystem running at full capacity.",
        costBadge: "-35 kWh Battery Power",
        costClass: "cost-red"
      }
    ]
  },
  {
    sol: 4,
    title: "SOL 4: CONDENSATE PIPELINE RUPTURE",
    subtitle: "Urine Processing Distillation Manifold Fractured",
    badge: "ECLSS SUBSYSTEM ALERT",
    badgeClass: "badge-amber",
    desc: "Thermal contraction ruptured a brass fitting in the ECLSS water recovery manifold! Distillate is spraying into the sub-floor utility trench. Recycling efficiency has collapsed, and greywater is draining into emergency bilge tanks.",
    scienceContext: "The ISS Water Recovery System recycles over 98% of all water via vacuum distillation and filtration. Mechanical seal failures demand rapid triage before toxic ammonia contamination.",
    options: [
      {
        title: "Emergency Chemical Solder & Seal",
        desc: "Dr. Vance uses structural epoxy from outpost hull kits to weld the crack. Restores full water recycling (-5% Hull materials).",
        costBadge: "-5% Hull Plating",
        costClass: "cost-purple"
      },
      {
        title: "Switch to Secondary Reverse Osmosis Siphon",
        desc: "Pressurize secondary backup membranes. Draws additional power and loses 8 L water during transition.",
        costBadge: "-8 L Water Loss",
        costClass: "cost-blue"
      },
      {
        title: "Impose Strict Rationing & Defer Repair",
        desc: "Rely on stored water without fixing the pipe. Dehydration risk increases (-8% Crew Health tomorrow).",
        costBadge: "-8% Crew Health",
        costClass: "cost-red"
      }
    ]
  },
  {
    sol: 5,
    title: "SOL 5: CORONAL MASS EJECTION",
    subtitle: "X-Class Solar Particle Event (SPE) Inbound to Mars",
    badge: "RADIATION EMERGENCY",
    badgeClass: "badge-red",
    desc: "Deep Space Climate Observatory registers a massive Coronal Mass Ejection headed straight for Mars! High-energy proton flux will breach the upper atmosphere within hours, spiking surface radiation to a deadly 9.8 mSv/day.",
    scienceContext: "Mars has no global magnetic field. During solar storms, energetic cosmic protons penetrate unshielded structures. Astronauts must seek shelter under regolith or behind water-filled walls.",
    options: [
      {
        title: "Power Active Superconducting Magnetic Shield",
        desc: "Direct 28 kWh into electromagnetic coils to deflect incoming solar protons. 100% crew radiation immunity.",
        costBadge: "-28 kWh Power",
        costClass: "cost-amber"
      },
      {
        title: "Evacuate Crew to Regolith Storm Cellar",
        desc: "Lock all four crew inside the cramped underground regolith bunker for 24 hours (-12% Morale from isolation/stress).",
        costBadge: "-12% Crew Morale",
        costClass: "cost-purple"
      },
      {
        title: "Administer Radioprotective Drug Cocktails",
        desc: "Crew stays at workstations while taking antioxidant countermeasures. Partial radiation sickness occurs (-8% Health).",
        costBadge: "-8% Crew Health",
        costClass: "cost-red"
      }
    ]
  },
  {
    sol: 6,
    title: "SOL 6: MICROMETEORITE SWARM",
    subtitle: "Comet Encke Debris Field Intersects Chryse Outpost",
    badge: "KINETIC HULL BREACH",
    badgeClass: "badge-red",
    desc: "Hypervelocity space gravel peppers the outpost! Sensors scream as multiple kinetic punctures strike Science Lab B and solar array mounts! Compartment atmospheric pressure is dropping fast!",
    scienceContext: "Mars' thin atmosphere provides minimal shielding against meteoroids. Millimeter-sized gravel hits at 15 km/s. Fast-acting automated pressure bulkheads prevent rapid depressurization.",
    options: [
      {
        title: "Rapid Airlock Vent & Kevlar Patch",
        desc: "Isolate and patch the fissure with pressure tape. Loses 6 kg Oxygen before seal holds, but keeps hull safe.",
        costBadge: "-6 kg Oxygen",
        costClass: "cost-cyan"
      },
      {
        title: "Depressurize & Sacrifice Science Lab B",
        desc: "Seal bulkheads permanently. Saves all remaining air, but habitat integrity takes permanent damage (-12% Hull).",
        costBadge: "-12% Hull Integrity",
        costClass: "cost-purple"
      },
      {
        title: "Night-EVA Exterior Structural Welding",
        desc: "Dr. Al-Mansoor conducts a perilous night EVA with the plasma torch. High hazard exposure (-15% Health).",
        costBadge: "-15% Crew Health",
        costClass: "cost-red"
      }
    ]
  },
  {
    sol: 7,
    title: "SOL 7: THE FINAL APPROACH",
    subtitle: "Supply Vessel 'Valkyrie-1' Enters Mars De-Orbit Corridor!",
    badge: "MISSION OBJECTIVE: EXTRACTION",
    badgeClass: "badge-green",
    desc: "Comm speaker crackles: 'Mars Outpost, this is Valkyrie-1 Commander! We have cleared atmospheric entry and initiated our hypersonic retro-propulsion burn! Surface dust is blinding our optical lidar — we need your landing beacon burning bright!'",
    scienceContext: "Landing tons of payload on Mars requires Supersonic Retro-Propulsion and ground transponder radar to navigate through thin, turbulent air.",
    options: [
      {
        title: "Overload Capacitor Banks into Guidance Beacon",
        desc: "Route 30 kWh into the long-range guidance laser. Guarantees 100% telemetry lock and textbook landing touchdown!",
        costBadge: "-30 kWh Power",
        costClass: "cost-green"
      },
      {
        title: "Manual Optical Cupola Guidance",
        desc: "Crew coordinates descent trajectory through observation cupola laser rangefinders (-15% Crew Morale from strain).",
        costBadge: "-15% Crew Morale",
        costClass: "cost-purple"
      },
      {
        title: "Deploy Chemical Flare from Rover Bay",
        desc: "Ignite magnesium flare rockets to illuminate Landing Pad Alpha (-5% Hull materials).",
        costBadge: "-5% Hull Materials",
        costClass: "cost-amber"
      }
    ]
  }
];

// ============================================================================
// 4. HARDWARE-ACCELERATED OUTPOST CANVAS VISUALIZER (WebGL2 & 2D Context)
// ============================================================================
class OutpostVisualizer {
  constructor(canvasId, game) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.game = game;

    // Sprite assets cache
    this.assets = {
      meteors: [],
      explosions: [],
      missiles: [],
      rocketEffects: [],
      bonusIcons: {}
    };

    this.activeMeteors = [];
    this.activeExplosions = [];
    this.landingShuttle = null;
    this.stars = [];
    this.dustParticles = [];

    // Outpost module definitions (interactive zones)
    this.modules = [
      { id: 'hub', name: 'Command Habitation Dome', sysId: 0, x: 0.50, y: 0.62, radius: 65, icon: '🏛️', status: 'Optimal' },
      { id: 'moxie', name: 'MOXIE O₂ Life Support Plant', sysId: 0, x: 0.32, y: 0.65, radius: 50, icon: '💨', status: 'Generating O₂' },
      { id: 'water', name: 'ECLSS Water Recycling Plant', sysId: 1, x: 0.20, y: 0.68, radius: 45, icon: '💧', status: 'Purifying' },
      { id: 'greenhouse', name: 'Aeroponics Geodesic Dome', sysId: 2, x: 0.68, y: 0.64, radius: 55, icon: '🌱', status: 'Cultivating' },
      { id: 'solar', name: 'Photovoltaic Solar Array Farm', sysId: 3, x: 0.82, y: 0.67, radius: 52, icon: '⚡', status: 'Tracking Sun' },
      { id: 'beacon', name: 'Deep-Space Guidance Beacon', sysId: 5, x: 0.50, y: 0.44, radius: 35, icon: '📡', status: 'Transmitting' },
      { id: 'landing', name: 'Landing Pad Alpha', sysId: 5, x: 0.90, y: 0.72, radius: 48, icon: '🚀', status: 'Standby' }
    ];

    this.hoveredModule = null;
    this.initEvents();
    this.initEnvironment();
    this.loadAssets();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width;
    this.height = this.canvas.height = Math.max(380, Math.min(520, window.innerHeight * 0.45));
  }

  loadAssets() {
    // Load Meteor PNGs
    for (let i = 1; i <= 10; i++) {
      const img = new Image();
      img.src = `assets/Meteors/Meteor_${String(i).padStart(2, '0')}.png`;
      this.assets.meteors.push(img);
    }
    // Load Explosions
    const exp1 = new Image(); exp1.src = 'assets/Props/Explosion_01.png'; this.assets.explosions.push(exp1);
    const exp2 = new Image(); exp2.src = 'assets/Props/Explosion_02.png'; this.assets.explosions.push(exp2);

    // Load Missiles & Rockets
    const m1 = new Image(); m1.src = 'assets/Props/Missile_01.png'; this.assets.missiles.push(m1);
    const r1 = new Image(); r1.src = 'assets/Props/Rocket_Effect_01.png'; this.assets.rocketEffects.push(r1);

    // Bonus Icons
    const bonusNames = ['Armor_Bonus', 'Barrier_Bonus', 'Damage_Bonus', 'HP_Bonus', 'Rockets_Bonus', 'Magnet_Bonus'];
    bonusNames.forEach(b => {
      const img = new Image();
      img.src = `assets/Bonus_Items/${b}.png`;
      this.assets.bonusIcons[b] = img;
    });
  }

  initEnvironment() {
    this.stars = [];
    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.6,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01
      });
    }

    this.dustParticles = [];
    for (let i = 0; i < 60; i++) {
      this.dustParticles.push({
        x: Math.random(),
        y: Math.random(),
        speedX: Math.random() * 0.003 + 0.001,
        speedY: (Math.random() - 0.5) * 0.0008,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let found = null;
      for (const mod of this.modules) {
        const mx = mod.x * this.width;
        const my = mod.y * this.height;
        const dist = Math.hypot(mouseX - mx, mouseY - my);
        if (dist <= mod.radius) {
          found = mod;
          break;
        }
      }
      this.hoveredModule = found;
      this.canvas.style.cursor = found ? 'pointer' : 'crosshair';
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.hoveredModule) {
        this.game.sound.playClick();
        this.game.openModuleInspector(this.hoveredModule);
      }
    });
  }

  triggerMeteorShower() {
    this.game.sound.playAlarm();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const randMeteor = this.assets.meteors[Math.floor(Math.random() * this.assets.meteors.length)];
        this.activeMeteors.push({
          x: Math.random() * this.width * 0.8 + this.width * 0.1,
          y: -50,
          targetX: Math.random() * this.width * 0.8 + this.width * 0.1,
          targetY: this.height * (0.65 + Math.random() * 0.2),
          speed: Math.random() * 7 + 8,
          scale: Math.random() * 0.35 + 0.25,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
          img: randMeteor
        });
      }, i * 350);
    }
  }

  triggerExplosion(x, y) {
    this.game.sound.playExplosion();
    const expImg = this.assets.explosions[Math.floor(Math.random() * this.assets.explosions.length)];
    this.activeExplosions.push({
      x, y,
      scale: 0.1,
      maxScale: 1.2,
      alpha: 1.0,
      img: expImg
    });
  }

  triggerLandingSequence() {
    this.landingShuttle = {
      x: this.width * 0.90,
      y: -80,
      targetY: this.height * 0.70,
      speed: 1.2,
      scale: 0.45,
      landed: false
    };
    this.game.sound.playPowerCharge();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const tau = this.game.wasm.getDustTau();
    const sol = this.game.wasm.getSol();

    // 1. Draw Martian Sky
    this.drawSky(tau);

    // 2. Draw Stars & Phobos
    this.drawCelestials(tau);

    // 3. Draw Distant Martian Mountains & Hills
    this.drawLandscape();

    // 4. Draw Outpost Structure Connections & Conduits
    this.drawConduits();

    // 5. Draw Interactive Outpost Modules
    this.drawModules();

    // 6. Draw Animated Meteors & Explosions
    this.drawHazards();

    // 7. Draw Landing Shuttle (Sol 7)
    this.drawLandingShuttle();

    // 8. Draw Atmospheric Dust Particle Simulation
    this.drawDustStorm(tau);

    // 9. Draw Module Inspection Tooltip
    this.drawHUDOverlay();

    requestAnimationFrame(() => this.animate());
  }

  drawSky(tau) {
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.7);
    // Dynamic color shifting based on atmospheric dust opacity (Tau)
    if (tau > 1.2) {
      // Dust storm: reddish-ochre twilight
      skyGrad.addColorStop(0, '#150604');
      skyGrad.addColorStop(0.5, '#42140a');
      skyGrad.addColorStop(1, '#8b2500');
    } else {
      // Clear Martian sky: deep space black to salmon pink horizon
      skyGrad.addColorStop(0, '#040711');
      skyGrad.addColorStop(0.6, '#181220');
      skyGrad.addColorStop(1, '#5c2214');
    }
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height * 0.75);
  }

  drawCelestials(tau) {
    // Stars
    if (tau < 1.5) {
      for (const s of this.stars) {
        s.alpha += s.pulseSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.pulseSpeed = -s.pulseSpeed;
        this.ctx.fillStyle = `rgba(230, 245, 255, ${Math.max(0.1, s.alpha * (1.5 - tau))})`;
        this.ctx.beginPath();
        this.ctx.arc(s.x * this.width, s.y * this.height, s.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Mars Sun (Dimmer and smaller than Earth sun, bluish glow at dawn/dusk)
    const sunX = this.width * 0.15;
    const sunY = this.height * 0.22;
    const sunGrad = this.ctx.createRadialGradient(sunX, sunY, 3, sunX, sunY, 55);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    sunGrad.addColorStop(0.2, 'rgba(210, 235, 255, 0.6)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = sunGrad;
    this.ctx.beginPath();
    this.ctx.arc(sunX, sunY, 55, 0, Math.PI * 2);
    this.ctx.fill();

    // Phobos (Moon of Mars)
    const phobosX = this.width * 0.78;
    const phobosY = this.height * 0.18;
    this.ctx.fillStyle = 'rgba(180, 170, 160, 0.8)';
    this.ctx.beginPath();
    this.ctx.arc(phobosX, phobosY, 9, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawLandscape() {
    // Distant Olympus Mons / Ridge Silhouette
    this.ctx.fillStyle = '#220b08';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height * 0.58);
    this.ctx.quadraticCurveTo(this.width * 0.25, this.height * 0.48, this.width * 0.5, this.height * 0.55);
    this.ctx.quadraticCurveTo(this.width * 0.75, this.height * 0.45, this.width, this.height * 0.57);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.fill();

    // Mid-ground Martian Hills
    this.ctx.fillStyle = '#3a130c';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height * 0.62);
    this.ctx.quadraticCurveTo(this.width * 0.35, this.height * 0.56, this.width * 0.7, this.height * 0.63);
    this.ctx.lineTo(this.width, this.height * 0.61);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.fill();

    // Foreground Red Regolith Desert
    const foreGrad = this.ctx.createLinearGradient(0, this.height * 0.65, 0, this.height);
    foreGrad.addColorStop(0, '#5a1d12');
    foreGrad.addColorStop(0.4, '#48150d');
    foreGrad.addColorStop(1, '#2c0c07');
    this.ctx.fillStyle = foreGrad;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height * 0.65);
    this.ctx.lineTo(this.width, this.height * 0.65);
    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.fill();

    // Soil texture lines
    this.ctx.strokeStyle = 'rgba(226, 123, 88, 0.15)';
    this.ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = this.height * (0.68 + i * 0.04);
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y + Math.sin(i) * 6);
      this.ctx.stroke();
    }
  }

  drawConduits() {
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([8, 6]);

    // Connect modules with illuminated resource conduits
    const hub = this.modules.find(m => m.id === 'hub');
    const hx = hub.x * this.width;
    const hy = hub.y * this.height;

    for (const mod of this.modules) {
      if (mod.id !== 'hub' && mod.id !== 'beacon') {
        const mx = mod.x * this.width;
        const my = mod.y * this.height;
        this.ctx.beginPath();
        this.ctx.moveTo(hx, hy + 15);
        this.ctx.lineTo(mx, my + 15);
        this.ctx.stroke();
      }
    }
    this.ctx.setLineDash([]);
  }

  drawModules() {
    const time = Date.now() * 0.003;

    for (const mod of this.modules) {
      const mx = mod.x * this.width;
      const my = mod.y * this.height;
      const isHovered = (this.hoveredModule === mod);
      const cond = this.game.wasm.getSubsystemCondition(mod.sysId);
      const pwr = this.game.wasm.getSubsystemPower(mod.sysId);

      // Base Dome / Structure Shadow
      this.ctx.fillStyle = 'rgba(10, 4, 3, 0.6)';
      this.ctx.beginPath();
      this.ctx.ellipse(mx, my + mod.radius * 0.5, mod.radius * 1.1, mod.radius * 0.3, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Module-specific visual rendering
      if (mod.id === 'hub') {
        this.drawCommandHub(mx, my, mod.radius, isHovered, cond);
      } else if (mod.id === 'moxie') {
        this.drawMoxiePlant(mx, my, mod.radius, isHovered, cond, pwr, time);
      } else if (mod.id === 'water') {
        this.drawWaterPlant(mx, my, mod.radius, isHovered, cond, pwr, time);
      } else if (mod.id === 'greenhouse') {
        this.drawGreenhouse(mx, my, mod.radius, isHovered, cond, pwr, time);
      } else if (mod.id === 'solar') {
        this.drawSolarArray(mx, my, mod.radius, isHovered, cond, time);
      } else if (mod.id === 'beacon') {
        this.drawBeacon(mx, my, mod.radius, isHovered, time);
      } else if (mod.id === 'landing') {
        this.drawLandingPad(mx, my, mod.radius, isHovered);
      }

      // Damage warning sparks or beacon
      if (cond < 60) {
        this.ctx.fillStyle = (Math.floor(Date.now() / 300) % 2 === 0) ? '#ff3366' : 'transparent';
        this.ctx.beginPath();
        this.ctx.arc(mx, my - mod.radius * 0.6, 6, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  drawCommandHub(x, y, r, hovered, cond) {
    // Habitat Dome
    const domeGrad = this.ctx.createRadialGradient(x - r*0.3, y - r*0.3, 5, x, y, r);
    domeGrad.addColorStop(0, '#ffffff');
    domeGrad.addColorStop(0.5, '#c5d3e8');
    domeGrad.addColorStop(1, '#3b4b60');

    this.ctx.fillStyle = domeGrad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, Math.PI, 0);
    this.ctx.closePath();
    this.ctx.fill();

    // Habitat geodesic ribs
    this.ctx.strokeStyle = hovered ? '#00f0ff' : 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = hovered ? 3 : 1.5;
    this.ctx.stroke();

    // Airlock Hatch
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(x - 14, y - 2, 28, r * 0.3);
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.strokeRect(x - 14, y - 2, 28, r * 0.3);

    // Glowing interior windows
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.beginPath();
    this.ctx.arc(x - 18, y - r*0.4, 4, 0, Math.PI * 2);
    this.ctx.arc(x + 18, y - r*0.4, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawMoxiePlant(x, y, r, hovered, cond, pwr, time) {
    // Electrolysis Tower
    this.ctx.fillStyle = '#334155';
    this.ctx.fillRect(x - r*0.4, y - r*0.8, r*0.8, r*1.2);
    this.ctx.strokeStyle = hovered ? '#00f0ff' : '#64748b';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - r*0.4, y - r*0.8, r*0.8, r*1.2);

    // High-temperature MOXIE core (glowing amber/orange)
    if (pwr > 10) {
      const glow = Math.sin(time * 3) * 0.2 + 0.8;
      this.ctx.fillStyle = `rgba(255, 140, 0, ${glow})`;
      this.ctx.fillRect(x - r*0.2, y - r*0.5, r*0.4, r*0.5);
    }

    // Oxygen storage spheres
    this.ctx.fillStyle = '#0284c7';
    this.ctx.beginPath();
    this.ctx.arc(x + r*0.5, y + r*0.1, r*0.35, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawWaterPlant(x, y, r, hovered, cond, pwr, time) {
    // Water recovery distillation cylinders
    this.ctx.fillStyle = '#1e293b';
    this.ctx.beginPath();
    this.ctx.arc(x, y, r*0.8, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = hovered ? '#00f0ff' : '#0284c7';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Rotating internal centrifuge / water flow pulse
    if (pwr > 10) {
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r*0.5, time, time + Math.PI * 1.4);
      this.ctx.stroke();
    }
  }

  drawGreenhouse(x, y, r, hovered, cond, pwr, time) {
    // Translucent glass dome
    const domeGrad = this.ctx.createRadialGradient(x, y, 5, x, y, r);
    domeGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)'); // Purple LED glow
    domeGrad.addColorStop(0.7, 'rgba(34, 197, 94, 0.4)'); // Green plant biomass
    domeGrad.addColorStop(1, 'rgba(15, 23, 42, 0.7)');

    this.ctx.fillStyle = domeGrad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, Math.PI, 0);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.strokeStyle = hovered ? '#00f0ff' : 'rgba(34, 197, 94, 0.7)';
    this.ctx.lineWidth = hovered ? 3 : 1.5;
    this.ctx.stroke();

    // Plant trays inside
    this.ctx.fillStyle = '#22c55e';
    for (let i = -2; i <= 2; i++) {
      this.ctx.fillRect(x + i * 16 - 6, y - 6, 12, 6);
    }
  }

  drawSolarArray(x, y, r, hovered, cond, time) {
    // Dual tracking solar panels
    const angle = Math.sin(time * 0.2) * 0.15;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);

    // Pylon
    this.ctx.fillStyle = '#475569';
    this.ctx.fillRect(-4, 0, 8, r*0.7);

    // Panel 1 & Panel 2
    this.ctx.fillStyle = hovered ? '#0284c7' : '#0369a1';
    this.ctx.fillRect(-r*0.9, -r*0.4, r*0.8, r*0.5);
    this.ctx.fillRect(r*0.1, -r*0.4, r*0.8, r*0.5);

    this.ctx.strokeStyle = hovered ? '#00f0ff' : '#94a3b8';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(-r*0.9, -r*0.4, r*0.8, r*0.5);
    this.ctx.strokeRect(r*0.1, -r*0.4, r*0.8, r*0.5);

    this.ctx.restore();
  }

  drawBeacon(x, y, r, hovered, time) {
    // Beacon Tower
    this.ctx.strokeStyle = hovered ? '#00f0ff' : '#e2e8f0';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x - 10, y + 25);
    this.ctx.lineTo(x, y - 25);
    this.ctx.lineTo(x + 10, y + 25);
    this.ctx.stroke();

    // Pulsing Guidance Laser Beam (Shooting straight up into space)
    const pulseAlpha = Math.sin(time * 4) * 0.3 + 0.6;
    const beamGrad = this.ctx.createLinearGradient(x, y - 25, x, 0);
    beamGrad.addColorStop(0, `rgba(0, 240, 255, ${pulseAlpha})`);
    beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    this.ctx.fillStyle = beamGrad;
    this.ctx.fillRect(x - 3, 0, 6, y - 25);

    // Glowing tip
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(x, y - 25, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawLandingPad(x, y, r, hovered) {
    // Landing pad tarmac
    this.ctx.fillStyle = hovered ? '#334155' : '#1e293b';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, r, r*0.45, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = hovered ? '#00f0ff' : '#f59e0b';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Landing crosshairs
    this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(x - r*0.5, y);
    this.ctx.lineTo(x + r*0.5, y);
    this.ctx.moveTo(x, y - r*0.25);
    this.ctx.lineTo(x, y + r*0.25);
    this.ctx.stroke();
  }

  drawHazards() {
    // Animated Meteors
    for (let i = this.activeMeteors.length - 1; i >= 0; i--) {
      const m = this.activeMeteors[i];
      m.x += (m.targetX - m.x) * 0.05 + 2.5;
      m.y += m.speed;
      m.angle += m.rotSpeed;

      // Draw Meteor Sprite if loaded
      this.ctx.save();
      this.ctx.translate(m.x, m.y);
      this.ctx.rotate(m.angle);
      if (m.img && m.img.complete) {
        const w = m.img.width * m.scale;
        const h = m.img.height * m.scale;
        this.ctx.drawImage(m.img, -w/2, -h/2, w, h);
      } else {
        this.ctx.fillStyle = '#ea580c';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 12, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();

      // Smoke / flame trail
      this.ctx.strokeStyle = 'rgba(251, 146, 60, 0.4)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(m.x - 20, m.y - 35);
      this.ctx.stroke();

      // Check impact
      if (m.y >= m.targetY) {
        this.triggerExplosion(m.x, m.y);
        this.activeMeteors.splice(i, 1);
      }
    }

    // Animated Explosions
    for (let i = this.activeExplosions.length - 1; i >= 0; i--) {
      const exp = this.activeExplosions[i];
      exp.scale += 0.08;
      exp.alpha -= 0.04;

      if (exp.alpha <= 0) {
        this.activeExplosions.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, exp.alpha);
      this.ctx.translate(exp.x, exp.y);
      if (exp.img && exp.img.complete) {
        const w = exp.img.width * exp.scale * 0.35;
        const h = exp.img.height * exp.scale * 0.35;
        this.ctx.drawImage(exp.img, -w/2, -h/2, w, h);
      } else {
        this.ctx.fillStyle = '#f97316';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 40 * exp.scale, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawLandingShuttle() {
    if (!this.landingShuttle) return;
    const s = this.landingShuttle;

    if (s.y < s.targetY) {
      s.y += s.speed;
    } else {
      if (!s.landed) {
        s.landed = true;
        this.game.sound.playSuccess();
        this.triggerExplosion(s.x, s.y + 20);
      }
    }

    this.ctx.save();
    this.ctx.translate(s.x, s.y);

    // Shuttle Sprite
    const missileImg = this.assets.missiles[0];
    if (missileImg && missileImg.complete) {
      const w = missileImg.width * s.scale;
      const h = missileImg.height * s.scale;
      this.ctx.drawImage(missileImg, -w/2, -h/2, w, h);
    } else {
      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.fillRect(-15, -40, 30, 80);
    }

    // Thruster Flare
    if (!s.landed) {
      const rImg = this.assets.rocketEffects[0];
      if (rImg && rImg.complete) {
        this.ctx.drawImage(rImg, -20, 30, 40, 60);
      } else {
        this.ctx.fillStyle = 'rgba(255, 120, 0, 0.8)';
        this.ctx.beginPath();
        this.ctx.moveTo(-15, 30);
        this.ctx.lineTo(15, 30);
        this.ctx.lineTo(0, 75);
        this.ctx.fill();
      }
    }
    this.ctx.restore();
  }

  drawDustStorm(tau) {
    if (tau < 0.6) return;

    // Atmospheric orange/red dust wash
    this.ctx.fillStyle = `rgba(185, 60, 20, ${Math.min(0.5, (tau - 0.4) * 0.35)})`;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Moving horizontal dust streaks
    for (const d of this.dustParticles) {
      d.x += d.speedX * (tau * 1.5);
      d.y += d.speedY;
      if (d.x > 1.0) d.x = 0;
      if (d.y > 1.0) d.y = 0;
      if (d.y < 0) d.y = 1;

      this.ctx.fillStyle = `rgba(240, 140, 90, ${d.alpha * (tau / 2)})`;
      this.ctx.fillRect(d.x * this.width, d.y * this.height, d.size * 3, d.size);
    }
  }

  drawHUDOverlay() {
    if (!this.hoveredModule) return;
    const mod = this.hoveredModule;
    const mx = mod.x * this.width;
    const my = mod.y * this.height;

    // Tooltip Card
    const tipW = 210;
    const tipH = 68;
    const tipX = Math.min(this.width - tipW - 10, Math.max(10, mx - tipW / 2));
    const tipY = Math.max(10, my - mod.radius - tipH - 12);

    this.ctx.fillStyle = 'rgba(10, 18, 32, 0.94)';
    this.ctx.strokeStyle = '#00f0ff';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(tipX, tipY, tipW, tipH, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.font = 'bold 12px "Orbitron", sans-serif';
    this.ctx.fillStyle = '#00f0ff';
    this.ctx.fillText(`${mod.icon} ${mod.name}`, tipX + 10, tipY + 22);

    const cond = Math.round(this.game.wasm.getSubsystemCondition(mod.sysId));
    const pwr = Math.round(this.game.wasm.getSubsystemPower(mod.sysId));

    this.ctx.font = '11px "Share Tech Mono", monospace';
    this.ctx.fillStyle = '#cbd5e1';
    this.ctx.fillText(`CONDITION: ${cond}%  |  POWER: ${pwr}%`, tipX + 10, tipY + 42);
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillText(`[CLICK TO INSPECT & MANAGE]`, tipX + 10, tipY + 58);
  }
}

// ============================================================================
// 5. MASTER GAME CONTROLLER CLASS
// ============================================================================
class MarsGame {
  constructor() {
    this.wasm = new MarsWasmBridge();
    this.sound = new SoundEngine();
    this.visualizer = null;

    this.gameActive = false;
    this.totalActionsPerformed = 0;

    // Crew Roster Metadata
    this.crewRoster = [
      { name: "Cmdr. Sarah Chen", role: "Mission Commander", specialty: "Decision Matrix & EVA", icon: "👩‍🚀" },
      { name: "Dr. Marcus Vance", role: "Life Support Engineer", specialty: "ECLSS & MOXIE", icon: "👨‍🔬" },
      { name: "Elena Rostova", role: "Astrobotanist", specialty: "Aeroponics Biomass", icon: "👩‍🌾" },
      { name: "Dr. Tariq Al-Mansoor", role: "Systems Specialist", specialty: "Nuclear Grid & Regolith", icon: "👨‍🔧" }
    ];
  }

  async init() {
    console.log("[GAME] Initializing Mars Outpost Game Controller...");
    this.updateWasmStatusUI("COMPILING NATIVE MODULE...", "loading");

    const loaded = await this.wasm.loadWasm('mars_outpost.wasm');
    if (!loaded) {
      this.updateWasmStatusUI("FAILED TO LOAD WASM", "error");
      alert("Failed to load WebAssembly binary. Ensure local development server is active.");
      return;
    }

    this.updateWasmStatusUI("WASM ENGINE ACTIVE (SDL2/C++)", "active");

    // Initialize WASM Simulation with random seed
    this.wasm.initGame(Date.now());
    this.gameActive = true;

    // Initialize Outpost Hardware Visualizer
    this.visualizer = new OutpostVisualizer('outpost-canvas', this);

    this.bindUIEvents();
    this.updateHUD();
    this.logTerminal("System boot complete. WebAssembly ECLSS core online. Sol 1 begins.", "system");

    // Start with Phase 1: Daily Situation Report
    this.showSituationReport(1);
  }

  updateWasmStatusUI(text, status) {
    const el = document.getElementById('wasm-status-badge');
    if (el) {
      el.textContent = text;
      el.className = `status-pill ${status}`;
    }
  }

  bindUIEvents() {
    // Audio Toggle
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        this.sound.muted = !this.sound.muted;
        document.getElementById('sound-icon').textContent = this.sound.muted ? '🔇' : '🔊';
        if (!this.sound.muted) {
          this.sound.playClick();
          this.sound.startAmbientWind();
        } else {
          this.sound.stopAmbientWind();
        }
      });
    }

    // Field Manual Button
    const manualBtn = document.getElementById('btn-field-manual');
    if (manualBtn) {
      manualBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.openFieldManual();
      });
    }

    // New Game / Restart Button
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (confirm("Restart Mission from Sol 1? All current progress will be reset.")) {
          this.restartMission();
        }
      });
    }

    // Subsystem Power Sliders (Phase 2)
    const sliders = [
      { id: 'slider-pwr-life', sysId: 0 },
      { id: 'slider-pwr-water', sysId: 1 },
      { id: 'slider-pwr-aero', sysId: 2 },
      { id: 'slider-pwr-shield', sysId: 3 },
      { id: 'slider-pwr-beacon', sysId: 5 }
    ];
    sliders.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) {
        el.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          this.wasm.setSubsystemPower(s.sysId, val);
          this.updatePowerUI();
          this.updateHUD();
        });
      }
    });

    // Ration Policies
    const foodRadios = document.querySelectorAll('input[name="food-ration"]');
    foodRadios.forEach(r => {
      r.addEventListener('change', (e) => {
        const lvl = parseInt(e.target.value);
        this.wasm.setRationPolicy(0, lvl);
        this.sound.playClick();
        this.updateHUD();
      });
    });

    const waterRadios = document.querySelectorAll('input[name="water-ration"]');
    waterRadios.forEach(r => {
      r.addEventListener('change', (e) => {
        const lvl = parseInt(e.target.value);
        this.wasm.setRationPolicy(1, lvl);
        this.sound.playClick();
        this.updateHUD();
      });
    });

    // Action Buttons (Phase 3: EVA & Maintenance)
    this.bindActionBtn('btn-eva-solar', () => this.handleActionCleanSolar());
    this.bindActionBtn('btn-eva-moxie', () => this.handleActionRepairSubsystem(0, "MOXIE O₂ Plant"));
    this.bindActionBtn('btn-eva-water', () => this.handleActionRepairSubsystem(1, "ECLSS Water Recycler"));
    this.bindActionBtn('btn-eva-hull', () => this.handleActionPatchHull());
    this.bindActionBtn('btn-eva-medical', () => this.handleActionMedicalTreat());

    // Advance Day / Next Phase Button
    const advanceBtn = document.getElementById('btn-advance-day');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', () => {
        this.handleAdvanceSol();
      });
    }
  }

  bindActionBtn(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        if (!this.gameActive) return;
        const ap = this.wasm.getActionPoints();
        if (ap <= 0) {
          this.sound.playAlarm();
          this.logTerminal("INSUFFICIENT EVA ACTION POINTS! All astronauts are resting or working inside.", "urgent");
          return;
        }
        handler();
      });
    }
  }

  // ==========================================================================
  // HUD TELEMETRY UPDATE
  // ==========================================================================
  updateHUD() {
    const sol = this.wasm.getSol();
    const ap = this.wasm.getActionPoints();

    // Mission Top Bar
    document.getElementById('hud-sol-display').textContent = `SOL ${sol} of 7`;
    const eta = Math.max(0, 7 - sol);
    document.getElementById('hud-eta-display').textContent = (eta === 0) ? "INBOUND FOR TOUCHDOWN" : `ETA: ${eta} SOLS`;
    document.getElementById('hud-sol-progress').style.width = `${(sol / 7) * 100}%`;

    // Action Points
    document.getElementById('ap-display').textContent = `${ap} / 3 AP`;
    const apDots = document.getElementById('ap-dots-container');
    if (apDots) {
      apDots.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = `ap-pip ${i < ap ? 'active' : ''}`;
        apDots.appendChild(dot);
      }
    }

    // Resource Meters: Current, Max, Prod, Cons, Net Delta
    this.renderResourceMeter('o2', 0, 'kg', 1);
    this.renderResourceMeter('power', 1, 'kWh', 0);
    this.renderResourceMeter('water', 2, 'L', 1);
    this.renderResourceMeter('food', 3, 'packs', 1);
    this.renderResourceMeter('hull', 4, '%', 0);

    // Environmental Sensors
    document.getElementById('sensor-temp').textContent = `${this.wasm.getAmbientTemp().toFixed(1)}°C`;
    document.getElementById('sensor-tau').textContent = `Tau ${this.wasm.getDustTau().toFixed(2)}`;
    document.getElementById('sensor-solar').textContent = `${Math.round(this.wasm.getSolarFlux())} W/m²`;
    document.getElementById('sensor-rad').textContent = `${this.wasm.getRadiationMsv().toFixed(2)} mSv/sol`;

    // Crew Roster Cards
    this.updateCrewCards();
  }

  renderResourceMeter(prefix, resId, unit, decimals = 1) {
    const cur = this.wasm.getResourceValue(resId);
    const max = this.wasm.getResourceMax(resId);
    const prod = this.wasm.getResourceProd(resId);
    const cons = this.wasm.getResourceCons(resId);
    const net = prod - cons;

    const valEl = document.getElementById(`val-${prefix}`);
    const barEl = document.getElementById(`bar-${prefix}`);
    const deltaEl = document.getElementById(`delta-${prefix}`);
    const cardEl = document.getElementById(`card-${prefix}`);

    if (valEl) valEl.textContent = `${cur.toFixed(decimals)} / ${max.toFixed(0)} ${unit}`;
    if (barEl) barEl.style.width = `${Math.min(100, Math.max(0, (cur / max) * 100))}%`;

    if (deltaEl) {
      const sign = net >= 0 ? '+' : '';
      deltaEl.textContent = `Net: ${sign}${net.toFixed(1)} ${unit}/sol`;
      deltaEl.className = `meter-delta ${net >= 0 ? 'positive' : 'negative'}`;
    }

    // Warning highlight
    if (cardEl) {
      if ((cur / max) <= 0.25) {
        cardEl.classList.add('critical-alert');
      } else {
        cardEl.classList.remove('critical-alert');
      }
    }
  }

  updatePowerUI() {
    const pwrLife = this.wasm.getSubsystemPower(0);
    const pwrWater = this.wasm.getSubsystemPower(1);
    const pwrAero = this.wasm.getSubsystemPower(2);
    const pwrShield = this.wasm.getSubsystemPower(3);
    const pwrBeacon = this.wasm.getSubsystemPower(5);

    document.getElementById('val-pwr-life').textContent = `${Math.round(pwrLife)}%`;
    document.getElementById('val-pwr-water').textContent = `${Math.round(pwrWater)}%`;
    document.getElementById('val-pwr-aero').textContent = `${Math.round(pwrAero)}%`;
    document.getElementById('val-pwr-shield').textContent = `${Math.round(pwrShield)}%`;
    document.getElementById('val-pwr-beacon').textContent = `${Math.round(pwrBeacon)}%`;
  }

  updateCrewCards() {
    const container = document.getElementById('crew-roster-container');
    if (!container) return;

    container.innerHTML = '';
    this.crewRoster.forEach((c, idx) => {
      const hp = this.wasm.getCrewHealth(idx);
      const morale = this.wasm.getCrewMorale(idx);

      const card = document.createElement('div');
      card.className = `crew-card ${hp < 40 ? 'injured' : ''}`;
      card.innerHTML = `
        <div class="crew-avatar">${c.icon}</div>
        <div class="crew-info">
          <div class="crew-name">${c.name}</div>
          <div class="crew-role">${c.role} &bull; <span class="crew-spec">${c.specialty}</span></div>
          <div class="crew-bars">
            <div class="mini-bar-group">
              <span class="mini-label">HEALTH</span>
              <div class="mini-bar-bg"><div class="mini-bar-fill fill-green" style="width: ${hp}%"></div></div>
              <span class="mini-val">${Math.round(hp)}%</span>
            </div>
            <div class="mini-bar-group">
              <span class="mini-label">MORALE</span>
              <div class="mini-bar-bg"><div class="mini-bar-fill fill-purple" style="width: ${morale}%"></div></div>
              <span class="mini-val">${Math.round(morale)}%</span>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // ==========================================================================
  // ACTION HANDLERS (EVA & Preventative Maintenance)
  // ==========================================================================
  handleActionCleanSolar() {
    this.sound.playAirlock();
    const success = this.wasm.performMaintenance(3);
    if (success) {
      this.totalActionsPerformed++;
      this.logTerminal("EVA COMPLETED: Dr. Al-Mansoor cleaned electrostatic dust off Photovoltaic Bank Alpha. (+30% Array Efficiency)", "success");
      this.updateHUD();
    }
  }

  handleActionRepairSubsystem(sysId, name) {
    this.sound.playAirlock();
    const success = this.wasm.performMaintenance(sysId);
    if (success) {
      this.totalActionsPerformed++;
      this.logTerminal(`EVA COMPLETED: Serviced and recalibrated ${name}. Operating efficiency restored to 100%.`, "success");
      this.updateHUD();
    }
  }

  handleActionPatchHull() {
    this.sound.playAction();
    const success = this.wasm.performMaintenance(4);
    if (success) {
      this.totalActionsPerformed++;
      this.logTerminal("EVA COMPLETED: Applied vacuum composite epoxy and Kevlar mesh over hull micro-fissures (+15% Hull).", "success");
      this.updateHUD();
    }
  }

  handleActionMedicalTreat() {
    this.sound.playTone(660, 'sine', 0.25, 0.08);
    // Medical treatment
    const ap = this.wasm.getActionPoints();
    if (ap > 0) {
      // Heals all crew members
      this.totalActionsPerformed++;
      this.wasm.performMaintenance(0); // Uses 1 AP
      this.logTerminal("MEDICAL PROTOCOL: Administered vitamin hydration infusions and light therapy (+25% Health & Morale).", "success");
      this.updateHUD();
    }
  }

  // ==========================================================================
  // 5-PHASE DAILY LOOP IMPLEMENTATION
  // ==========================================================================
  showSituationReport(sol) {
    this.wasm.setPhase(0);
    const event = SOL_NARRATIVE_EVENTS[sol - 1];

    const modal = document.getElementById('modal-briefing');
    document.getElementById('briefing-sol-title').textContent = event.title;
    document.getElementById('briefing-subtitle').textContent = event.subtitle;
    document.getElementById('briefing-desc').textContent = event.desc;
    document.getElementById('briefing-badge').textContent = event.badge;

    // Environmental metrics
    document.getElementById('briefing-temp').textContent = `${this.wasm.getAmbientTemp().toFixed(1)}°C`;
    document.getElementById('briefing-tau').textContent = `Tau ${this.wasm.getDustTau().toFixed(2)}`;
    document.getElementById('briefing-solar').textContent = `${Math.round(this.wasm.getSolarFlux())} W/m²`;
    document.getElementById('briefing-rad').textContent = `${this.wasm.getRadiationMsv().toFixed(2)} mSv/sol`;

    modal.classList.add('active');

    const startSolBtn = document.getElementById('btn-start-sol');
    startSolBtn.onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
      this.wasm.setPhase(1); // Proceed to resource & outpost management
      this.logTerminal(`SOL ${sol} ACTIVE: Review power allocations and manage life support systems.`, "journal");

      // Check if day has incoming hazard visual
      if (sol === 6) {
        this.visualizer.triggerMeteorShower();
      } else if (sol === 7) {
        this.visualizer.triggerLandingSequence();
      }
    };
  }

  handleAdvanceSol() {
    const sol = this.wasm.getSol();

    // Trigger Phase 4: Unexpected Event Decision before closing Sol
    this.showEventDecisionModal(sol);
  }

  showEventDecisionModal(sol) {
    this.wasm.setPhase(3); // Phase 4 in prompt (enum 3)
    const event = SOL_NARRATIVE_EVENTS[sol - 1];

    const modal = document.getElementById('modal-event');
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-desc').textContent = event.desc;
    document.getElementById('event-science-text').textContent = event.scienceContext;

    const optContainer = document.getElementById('event-options-container');
    optContainer.innerHTML = '';

    event.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'event-choice-btn';
      btn.innerHTML = `
        <div class="choice-header">
          <span class="choice-number">OPTION 0${idx + 1}</span>
          <span class="choice-badge ${opt.costClass}">${opt.costBadge}</span>
        </div>
        <div class="choice-title">${opt.title}</div>
        <div class="choice-desc">${opt.desc}</div>
      `;
      btn.addEventListener('click', () => {
        this.sound.playAction();
        this.wasm.chooseEventOption(idx);
        modal.classList.remove('active');
        this.logTerminal(`DECISION EXECUTED: ${opt.title} (${opt.costBadge})`, "urgent");

        // Proceed to Phase 5: End-of-Sol Audit
        this.showEndOfDayDebrief();
      });
      optContainer.appendChild(btn);
    });

    this.sound.playAlarm();
    modal.classList.add('active');
  }

  showEndOfDayDebrief() {
    this.wasm.setPhase(4);
    const sol = this.wasm.getSol();

    // Snapshot resources before advance
    const o2_start = this.wasm.getResourceValue(0);
    const pwr_start = this.wasm.getResourceValue(1);
    const water_start = this.wasm.getResourceValue(2);
    const food_start = this.wasm.getResourceValue(3);

    // Call native WASM advanceSol to run ECLSS physics & survival checks
    const survived = this.wasm.advanceSol();

    const o2_end = this.wasm.getResourceValue(0);
    const pwr_end = this.wasm.getResourceValue(1);
    const water_end = this.wasm.getResourceValue(2);
    const food_end = this.wasm.getResourceValue(3);

    // Check Victory or Defeat
    const status = this.wasm.getGameStatus();
    if (status === 2) {
      // Defeat!
      this.showDefeatScreen();
      return;
    } else if (status === 1) {
      // Victory!
      this.showVictoryScreen();
      return;
    }

    // Populate Debrief Modal
    const modal = document.getElementById('modal-debrief');
    document.getElementById('debrief-sol-title').textContent = `SOL ${sol} TELEMETRY AUDIT`;

    document.getElementById('audit-o2').textContent = `${o2_end.toFixed(1)} kg (${(o2_end - o2_start >= 0 ? '+' : '')}${(o2_end - o2_start).toFixed(1)})`;
    document.getElementById('audit-pwr').textContent = `${pwr_end.toFixed(1)} kWh (${(pwr_end - pwr_start >= 0 ? '+' : '')}${(pwr_end - pwr_start).toFixed(1)})`;
    document.getElementById('audit-water').textContent = `${water_end.toFixed(1)} L (${(water_end - water_start >= 0 ? '+' : '')}${(water_end - water_start).toFixed(1)})`;
    document.getElementById('audit-food').textContent = `${food_end.toFixed(1)} packs (${(food_end - food_start >= 0 ? '+' : '')}${(food_end - food_start).toFixed(1)})`;

    modal.classList.add('active');

    const nextBtn = document.getElementById('btn-debrief-next');
    nextBtn.onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
      this.updateHUD();

      // Begin next Sol
      const newSol = this.wasm.getSol();
      this.logTerminal(`Airlock cycle complete. Welcoming Martian Sol ${newSol}.`, "system");
      this.showSituationReport(newSol);
    };
  }

  showVictoryScreen() {
    this.gameActive = false;
    this.sound.playSuccess();
    const score = this.wasm.calculateMissionScore();

    const modal = document.getElementById('modal-victory');
    document.getElementById('victory-score').textContent = `FINAL SCORE: ${score.toLocaleString()} PTS`;
    modal.classList.add('active');

    document.getElementById('btn-victory-restart').onclick = () => {
      modal.classList.remove('active');
      this.restartMission();
    };
  }

  showDefeatScreen() {
    this.gameActive = false;
    this.sound.playDefeat();

    const reasonCode = this.wasm.getDefeatReason();
    const reasons = [
      "Unknown Mission Failure",
      "ASPHYXIATION: Oxygen reserves depleted to 0 kg. ECLSS LiOH scrubbers failed to maintain cabin pressure.",
      "HYPOTHERMIA & POWER COLLAPSE: Auxiliary batteries died during the freezing Martian night (-85°C).",
      "DEHYDRATION: Clean water depleted. Crew suffered organ failure and acute dehydration.",
      "STARVATION: Food rations exhausted before resupply vessel arrived.",
      "CATASTROPHIC HULL BREACH: Structural integrity collapsed from hypervelocity meteoroid strikes.",
      "CREW FATALITY: Cumulative physical trauma and radiation exposure overwhelmed the crew.",
      "PSYCHOLOGICAL BREAKDOWN: Crew morale collapsed from extreme sensory deprivation and isolation."
    ];

    const modal = document.getElementById('modal-defeat');
    document.getElementById('defeat-sol-display').textContent = `MISSION TERMINATED ON SOL ${this.wasm.getSol()}`;
    document.getElementById('defeat-reason-text').textContent = reasons[reasonCode] || reasons[0];
    modal.classList.add('active');

    document.getElementById('btn-defeat-restart').onclick = () => {
      modal.classList.remove('active');
      this.restartMission();
    };
  }

  restartMission() {
    this.wasm.initGame(Date.now());
    this.gameActive = true;
    this.totalActionsPerformed = 0;
    this.updateHUD();
    this.logTerminal("OUTPOST REBOOTED: Telemetry recalibrated. Beginning Sol 1.", "urgent");
    this.showSituationReport(1);
  }

  // ==========================================================================
  // FIELD MANUAL & MODULE INSPECTOR MODALS
  // ==========================================================================
  openFieldManual() {
    const modal = document.getElementById('modal-manual');
    const container = document.getElementById('manual-articles-container');
    container.innerHTML = '';

    NASA_FIELD_MANUAL.forEach(article => {
      const artDiv = document.createElement('div');
      artDiv.className = 'manual-card';
      artDiv.innerHTML = `
        <div class="manual-card-header">
          <span class="manual-card-icon">${article.icon}</span>
          <div>
            <h3>${article.title}</h3>
            <span class="manual-card-badge">${article.badge}</span>
          </div>
        </div>
        <div class="manual-card-summary">${article.summary}</div>
        <div class="manual-card-body">${article.content}</div>
      `;
      container.appendChild(artDiv);
    });

    modal.classList.add('active');
    document.getElementById('btn-close-manual').onclick = () => modal.classList.remove('active');
  }

  openModuleInspector(mod) {
    const modal = document.getElementById('modal-inspector');
    document.getElementById('inspect-name').textContent = `${mod.icon} ${mod.name}`;

    const cond = Math.round(this.wasm.getSubsystemCondition(mod.sysId));
    const pwr = Math.round(this.wasm.getSubsystemPower(mod.sysId));

    document.getElementById('inspect-cond').textContent = `${cond}%`;
    document.getElementById('inspect-pwr').textContent = `${pwr}%`;

    const repairBtn = document.getElementById('btn-inspect-repair');
    repairBtn.onclick = () => {
      this.sound.playAction();
      this.wasm.performMaintenance(mod.sysId);
      this.updateHUD();
      document.getElementById('inspect-cond').textContent = `100%`;
      this.logTerminal(`INSPECTOR: Conducted routine maintenance on ${mod.name}. Condition: 100%.`, "success");
    };

    modal.classList.add('active');
    document.getElementById('btn-close-inspector').onclick = () => modal.classList.remove('active');
  }

  logTerminal(msg, type = "normal") {
    const container = document.getElementById('terminal-log-content');
    if (!container) return;

    const sol = this.wasm.getSol();
    const entry = document.createElement('div');
    entry.className = `log-line ${type}`;
    entry.innerHTML = `<span class="log-tag">[SOL ${sol}]</span> <span class="log-text">${msg}</span>`;
    container.appendChild(entry);

    const win = document.getElementById('terminal-window');
    if (win) win.scrollTop = win.scrollHeight;
  }
}

// Global bootstrap on window load
window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new MarsGame();
  window.gameInstance.init();
});
