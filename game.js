/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Narrative-Driven Survival Adventure - Master Controller
 * ============================================================================
 * Inspired by The Henry Stickmin Collection & Indie Narrative Adventures
 * Core Simulation Engine: C++ compiled to WebAssembly (mars_outpost.wasm)
 * ============================================================================
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  initCtx() {
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
      this.initCtx();
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
    } catch (e) {
      // Audio policy graceful bypass
    }
  }

  playClick() {
    this.playTone(850, 'triangle', 0.04, 0.04);
  }

  playAction() {
    this.playTone(600, 'square', 0.06, 0.03);
    setTimeout(() => this.playTone(900, 'square', 0.08, 0.03), 40);
  }

  playAlarm() {
    if (this.muted) return;
    this.playTone(720, 'sawtooth', 0.18, 0.06);
    setTimeout(() => this.playTone(600, 'sawtooth', 0.18, 0.06), 180);
    setTimeout(() => this.playTone(720, 'sawtooth', 0.22, 0.06), 360);
  }

  playSuccess() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.25, 0.08), idx * 120);
    });
  }

  playDefeat() {
    if (this.muted) return;
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.35, 0.08), idx * 180);
    });
  }

  startAmbientWind() {
    // Gentle synthesized wind
    this.playTone(180, 'sine', 1.5, 0.02);
  }

  stopAmbientWind() {
    // No-op
  }
}

class MarsNarrativeGame {
  constructor() {
    this.wasm = new MarsWasmBridge();
    this.sound = new SoundEngine();
    this.portraits = new PortraitEngine();
    this.roomRenderer = null;

    this.currentSol = 1;
    this.currentPhase = 1; // 1: Story, 2: Report, 3: Alloc, 4: Roam, 5: Dilemma, 6: Debrief
    this.gameActive = false;

    // Narrative State
    this.crewMorale = 92;
    this.crewHealth = 100;
    this.decisionsHistory = [];
    this.dialogueQueue = [];
    this.currentDialogueIndex = 0;
    this.typewriterInterval = null;
    this.isTypewriting = false;
  }

  async init() {
    console.log("[STORY GAME] Booting Mars Outpost Narrative Adventure...");

    // 1. Initialize WebAssembly Simulation Engine
    const wasmOk = await this.wasm.loadWasm('mars_outpost.wasm');
    if (!wasmOk) {
      console.warn("[WASM] Fallback simulation active.");
    }
    this.wasm.initGame(Date.now());
    this.gameActive = true;

    // 2. Initialize Illustrated Room Renderer
    this.roomRenderer = new RoomRenderer('room-canvas', this);

    // 3. Bind UI Buttons & Tabs
    this.bindUI();

    // 4. Update Header HUD
    this.updateHUD();

    // 5. Begin Sol 1 - Phase 1: Daily Story
    this.startSolStory(1);
  }

  bindUI() {
    // Room Navigation Tabs
    const tabs = document.querySelectorAll('.room-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const roomId = e.currentTarget.dataset.room;
        this.roomRenderer.setRoom(roomId);
      });
    });

    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
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

    // Restart Button
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        if (confirm("Restart from Sol 1? All progress and story decisions will reset.")) {
          this.restartGame();
        }
      });
    }

    // Dialogue Box Advance Button / Click
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
      dialogueBox.addEventListener('click', () => {
        this.advanceDialogue();
      });
    }

    // Contextual Action Bar Buttons
    const btnTalk = document.getElementById('act-talk');
    if (btnTalk) {
      btnTalk.addEventListener('click', () => {
        this.sound.playClick();
        const room = NARRATIVE_DATA.rooms[this.roomRenderer.currentRoomId];
        if (room && room.charactersPresent && room.charactersPresent.length > 0) {
          this.startCharacterDialogue(room.charactersPresent[0]);
        } else {
          this.showNotification("Nobody is in this room right now. Check the Common Room or Greenhouse!");
        }
      });
    }

    const btnAlloc = document.getElementById('act-alloc');
    if (btnAlloc) {
      btnAlloc.addEventListener('click', () => {
        this.sound.playClick();
        this.openAllocationModal();
      });
    }

    const btnReport = document.getElementById('act-report');
    if (btnReport) {
      btnReport.addEventListener('click', () => {
        this.sound.playClick();
        this.openSituationReportModal();
      });
    }

    const btnReadyNight = document.getElementById('act-ready-night');
    if (btnReadyNight) {
      btnReadyNight.addEventListener('click', () => {
        this.sound.playAction();
        this.triggerPhase5Emergency();
      });
    }
  }

  updateRoomTabsUI() {
    const tabs = document.querySelectorAll('.room-tab-btn');
    tabs.forEach(tab => {
      if (tab.dataset.room === this.roomRenderer.currentRoomId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const room = NARRATIVE_DATA.rooms[this.roomRenderer.currentRoomId];
    const banner = document.getElementById('room-banner-text');
    if (banner && room) {
      banner.textContent = `${room.icon} ${room.name} — ${room.desc}`;
    }
  }

  updateHUD() {
    const sol = this.wasm.getSol();
    this.currentSol = sol;
    const eta = Math.max(0, 7 - sol);

    document.getElementById('hud-sol-text').textContent = `SOL ${sol} OF 7`;
    document.getElementById('hud-eta-text').textContent = (eta === 0) ? "INBOUND FOR LANDING" : `${eta} SOLS TO VALKYRIE`;
    document.getElementById('hud-progress-fill').style.width = `${(sol / 7) * 100}%`;

    // Resources from WebAssembly
    const o2 = this.wasm.getResourceValue(0);
    const pwr = this.wasm.getResourceValue(1);
    const water = this.wasm.getResourceValue(2);
    const food = this.wasm.getResourceValue(3);
    const hull = this.wasm.getResourceValue(4);

    document.getElementById('hud-res-o2').textContent = `${o2.toFixed(0)} kg`;
    document.getElementById('hud-res-water').textContent = `${water.toFixed(0)} L`;
    document.getElementById('hud-res-food').textContent = `${food.toFixed(0)} meals`;
    document.getElementById('hud-res-power').textContent = `${pwr.toFixed(0)} kWh`;
    document.getElementById('hud-res-hull').textContent = `${hull.toFixed(0)}%`;
    document.getElementById('hud-res-morale').textContent = `${Math.round(this.crewMorale)}%`;

    // Warning indicators
    this.toggleWarning('card-res-o2', o2 < 20);
    this.toggleWarning('card-res-water', water < 25);
    this.toggleWarning('card-res-food', food < 15);
    this.toggleWarning('card-res-power', pwr < 30);

    this.updateRoomTabsUI();
  }

  toggleWarning(elementId, isWarning) {
    const el = document.getElementById(elementId);
    if (el) {
      if (isWarning) el.classList.add('warning-pulse');
      else el.classList.remove('warning-pulse');
    }
  }

  // ==========================================================================
  // PHASE 1: DAILY STORY SEQUENCE
  // ==========================================================================
  startSolStory(sol) {
    this.currentPhase = 1;
    this.sound.playTone(520, 'triangle', 0.2, 0.08);

    const solData = NARRATIVE_DATA.sols[sol - 1];
    if (!solData) return;

    // Set Common Room for morning briefing
    this.roomRenderer.setRoom('common');

    // Show phase indicator
    this.showPhaseBanner(`PHASE 1: ${solData.chapterTitle.toUpperCase()}`);

    // Queue Dialogues
    this.playDialogueSequence(solData.introDialogues, () => {
      // Once dialogue completes, show Phase 2: Situation Report
      this.openSituationReportModal();
    });
  }

  // ==========================================================================
  // PHASE 2: MORNING SITUATION REPORT
  // ==========================================================================
  openSituationReportModal() {
    this.currentPhase = 2;
    const solData = NARRATIVE_DATA.sols[this.currentSol - 1];

    const modal = document.getElementById('modal-situation');
    document.getElementById('sit-title').textContent = solData.chapterTitle;
    document.getElementById('sit-summary').textContent = solData.situationSummary;

    // Environmental readings
    document.getElementById('sit-temp').textContent = `${this.wasm.getAmbientTemp().toFixed(1)}°C`;
    document.getElementById('sit-tau').textContent = `Tau ${this.wasm.getDustTau().toFixed(2)}`;
    document.getElementById('sit-solar').textContent = `${Math.round(this.wasm.getSolarFlux())} W/m²`;
    document.getElementById('sit-rad').textContent = `${this.wasm.getRadiationMsv().toFixed(2)} mSv/sol`;

    modal.classList.add('active');

    const btnAck = document.getElementById('btn-sit-ack');
    btnAck.onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
      // Proceed to Phase 3: Allocations
      this.openAllocationModal();
    };
  }

  // ==========================================================================
  // PHASE 3: RESOURCE ALLOCATION
  // ==========================================================================
  openAllocationModal() {
    this.currentPhase = 3;
    const modal = document.getElementById('modal-allocations');

    const pwrLife = this.wasm.getSubsystemPower(0);
    const pwrWater = this.wasm.getSubsystemPower(1);
    const pwrAero = this.wasm.getSubsystemPower(2);

    const sliderLife = document.getElementById('alloc-pwr-life');
    const sliderWater = document.getElementById('alloc-pwr-water');
    const sliderAero = document.getElementById('alloc-pwr-aero');

    sliderLife.value = pwrLife;
    sliderWater.value = pwrWater;
    sliderAero.value = pwrAero;

    const updateAllocLabels = () => {
      document.getElementById('lbl-pwr-life').textContent = `${sliderLife.value}%`;
      document.getElementById('lbl-pwr-water').textContent = `${sliderWater.value}%`;
      document.getElementById('lbl-pwr-aero').textContent = `${sliderAero.value}%`;
    };
    updateAllocLabels();

    sliderLife.oninput = () => { this.wasm.setSubsystemPower(0, parseFloat(sliderLife.value)); updateAllocLabels(); };
    sliderWater.oninput = () => { this.wasm.setSubsystemPower(1, parseFloat(sliderWater.value)); updateAllocLabels(); };
    sliderAero.oninput = () => { this.wasm.setSubsystemPower(2, parseFloat(sliderAero.value)); updateAllocLabels(); };

    modal.classList.add('active');

    const btnSave = document.getElementById('btn-save-alloc');
    btnSave.onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
      this.startPhase4FreeRoam();
    };
  }

  // ==========================================================================
  // PHASE 4: OUTPOST MANAGEMENT & FREE ROAM
  // ==========================================================================
  startPhase4FreeRoam() {
    this.currentPhase = 4;
    this.showPhaseBanner("PHASE 4: OUTPOST MANAGEMENT — EXPLORE ROOMS & TALK WITH CREW");
    this.showNotification("Explore the outpost! Talk to crew members, inspect machinery, and when ready, click 'Ready for Evening'.");
    this.updateHUD();
  }

  // ==========================================================================
  // PHASE 5: EMERGENCY DILEMMA (HENRY STICKMIN CHOICE CARDS)
  // ==========================================================================
  triggerPhase5Emergency() {
    this.currentPhase = 5;
    this.sound.playAlarm();

    const solData = NARRATIVE_DATA.sols[this.currentSol - 1];
    const emergency = solData.emergency;

    const modal = document.getElementById('modal-emergency');
    document.getElementById('em-title').textContent = emergency.title;
    document.getElementById('em-desc').textContent = emergency.desc;

    const container = document.getElementById('em-choices-container');
    container.innerHTML = '';

    emergency.choices.forEach((choice, idx) => {
      const card = document.createElement('div');
      card.className = 'choice-card';
      card.innerHTML = `
        <div class="choice-icon-large">${choice.icon}</div>
        <div class="choice-content">
          <div class="choice-tag">OPTION 0${idx + 1}</div>
          <div class="choice-title">${choice.title}</div>
          <div class="choice-tagline">${choice.tagline}</div>
          <div class="choice-preview">${choice.preview}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        this.sound.playAction();
        modal.classList.remove('active');
        this.executeEmergencyChoice(choice);
      });
      container.appendChild(card);
    });

    modal.classList.add('active');
  }

  executeEmergencyChoice(choice) {
    const res = choice.consequence;
    this.decisionsHistory.push({
      sol: this.currentSol,
      choice: choice.title,
      log: res.log
    });

    // Apply Resource & Morale Deltas
    if (res.resourceDeltas) {
      if (res.resourceDeltas.morale) this.crewMorale = Math.max(0, Math.min(100, this.crewMorale + res.resourceDeltas.morale));
      if (res.resourceDeltas.health) this.crewHealth = Math.max(0, Math.min(100, this.crewHealth + res.resourceDeltas.health));
    }

    this.updateHUD();

    // Play Out Consequence Dialogue
    this.playDialogueSequence(res.dialogue, () => {
      // Proceed to Phase 6: End-of-Sol Debrief
      this.showPhase6Debrief(res.log);
    });
  }

  // ==========================================================================
  // PHASE 6: END-OF-DAY REPORT & JOURNAL
  // ==========================================================================
  showPhase6Debrief(choiceLog) {
    this.currentPhase = 6;
    this.sound.playTone(440, 'triangle', 0.4, 0.08);

    // Call WASM simulation tick to advance resources & verify survival
    const survived = this.wasm.advanceSol();

    const o2 = this.wasm.getResourceValue(0);
    const pwr = this.wasm.getResourceValue(1);
    const water = this.wasm.getResourceValue(2);
    const food = this.wasm.getResourceValue(3);

    // Check Defeat
    if (this.wasm.getGameStatus() === 2 || o2 <= 0 || pwr <= 0 || water <= 0 || food <= 0 || this.crewHealth <= 0) {
      this.showDefeatScreen();
      return;
    }

    // Check Victory
    if (this.currentSol >= 7 || this.wasm.getGameStatus() === 1) {
      this.showVictoryScreen();
      return;
    }

    const modal = document.getElementById('modal-debrief');
    document.getElementById('deb-sol-title').textContent = `EVENING JOURNAL &bull; SOL ${this.currentSol}`;
    document.getElementById('deb-log-text').textContent = `"${choiceLog} Another night falls across Chryse Planitia. The wind is rattling the outer airlock hatch, but inside the habitat, the air is clean, the crew is resting, and we are one Sol closer to seeing Valkyrie-1 in the sky."`;

    document.getElementById('deb-o2').textContent = `${o2.toFixed(1)} kg`;
    document.getElementById('deb-pwr').textContent = `${pwr.toFixed(1)} kWh`;
    document.getElementById('deb-water').textContent = `${water.toFixed(1)} L`;
    document.getElementById('deb-food').textContent = `${food.toFixed(1)} meals`;
    document.getElementById('deb-morale').textContent = `${Math.round(this.crewMorale)}%`;

    modal.classList.add('active');

    const btnNext = document.getElementById('btn-deb-next');
    btnNext.onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
      this.currentSol = this.wasm.getSol();
      this.updateHUD();
      this.startSolStory(this.currentSol);
    };
  }

  // ==========================================================================
  // DIALOGUE SYSTEM (Visual Novel Style with Expressive Portraits)
  // ==========================================================================
  playDialogueSequence(dialogues, onComplete) {
    if (!dialogues || dialogues.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    this.dialogueQueue = dialogues;
    this.currentDialogueIndex = 0;
    this.onDialogueComplete = onComplete;
    this.renderCurrentDialogue();
  }

  renderCurrentDialogue() {
    const item = this.dialogueQueue[this.currentDialogueIndex];
    if (!item) {
      document.getElementById('dialogue-overlay').classList.remove('active');
      if (this.onDialogueComplete) this.onDialogueComplete();
      return;
    }

    const overlay = document.getElementById('dialogue-overlay');
    overlay.classList.add('active');

    const charData = NARRATIVE_DATA.characters[item.speaker] || NARRATIVE_DATA.characters.alex;
    document.getElementById('diag-name').textContent = charData.name;
    document.getElementById('diag-role').textContent = charData.role;
    document.getElementById('diag-role').style.color = charData.color;

    // Portrait SVG
    const portraitSvg = this.portraits.getPortraitSvg(item.speaker, item.portrait || 'neutral');
    const portraitImg = document.getElementById('diag-portrait-img');
    portraitImg.src = portraitSvg;

    // Typewriter effect
    this.typewriterText(item.text);
  }

  typewriterText(fullText) {
    const textEl = document.getElementById('diag-text');
    textEl.textContent = '';
    clearInterval(this.typewriterInterval);
    this.isTypewriting = true;

    let i = 0;
    this.typewriterInterval = setInterval(() => {
      if (i < fullText.length) {
        textEl.textContent += fullText.charAt(i);
        i++;
        if (i % 3 === 0) this.sound.playTone(800 + Math.random() * 200, 'sine', 0.02, 0.02);
      } else {
        clearInterval(this.typewriterInterval);
        this.isTypewriting = false;
      }
    }, 22);
  }

  advanceDialogue() {
    if (this.isTypewriting) {
      // Instantly finish line
      clearInterval(this.typewriterInterval);
      const item = this.dialogueQueue[this.currentDialogueIndex];
      document.getElementById('diag-text').textContent = item.text;
      this.isTypewriting = false;
      return;
    }

    this.sound.playClick();
    this.currentDialogueIndex++;
    if (this.currentDialogueIndex < this.dialogueQueue.length) {
      this.renderCurrentDialogue();
    } else {
      document.getElementById('dialogue-overlay').classList.remove('active');
      if (this.onDialogueComplete) this.onDialogueComplete();
    }
  }

  // ==========================================================================
  // CHARACTER BANTER & HOTSPOT INSPECTIONS
  // ==========================================================================
  startCharacterDialogue(charKey) {
    const char = NARRATIVE_DATA.characters[charKey];
    let banterLines = [];

    if (charKey === 'maya') {
      banterLines = [
        { speaker: "maya", portrait: "focused", text: "I'm checking the flow rate on the water distiller. If I can tighten the seal by another half-millimeter, we'll squeeze out an extra liter per Sol." },
        { speaker: "alex", portrait: "smiling", text: "Don't forget to take a break, Maya. You've been on your feet since morning." },
        { speaker: "maya", portrait: "smiling", text: "I will, Alex. Once I know every single machine in this outpost is humming like a cello." }
      ];
    } else if (charKey === 'sully') {
      banterLines = [
        { speaker: "sully", portrait: "grinning", text: "Look at tray four, Alex! The potato leaves are reaching right toward the purple grow lights! Nature always finds a way, even 225 million kilometres from Earth." },
        { speaker: "alex", portrait: "smiling", text: "They look healthy, Sully. You've done an incredible job keeping fresh greens on our table." },
        { speaker: "sully", portrait: "excited", text: "When Valkyrie arrives, I'm personally handing the pilot a freshly picked radish. Best welcoming gift in the solar system!" }
      ];
    } else if (charKey === 'tariq') {
      banterLines = [
        { speaker: "tariq", portrait: "gentle", text: "The crew's blood pressure and cognitive metrics are remarkably stable, Alex. That is a testament to your steady hand as Commander." },
        { speaker: "alex", portrait: "neutral", text: "It's a team effort, Tariq. Your mint tea and quiet wisdom keep us sane." },
        { speaker: "tariq", portrait: "relieved", text: "We are travelers on an ancient desert, my friend. A little patience and a warm cup make all the difference." }
      ];
    }

    this.playDialogueSequence(banterLines, null);
  }

  showHotspotInspector(hotspot) {
    const modal = document.getElementById('modal-hotspot');
    document.getElementById('hot-icon').textContent = hotspot.icon;
    document.getElementById('hot-title').textContent = hotspot.label;
    document.getElementById('hot-text').textContent = hotspot.text;

    const sciBox = document.getElementById('hot-science-box');
    if (hotspot.science) {
      sciBox.style.display = 'block';
      document.getElementById('hot-science-text').textContent = hotspot.science;
    } else {
      sciBox.style.display = 'none';
    }

    modal.classList.add('active');
    document.getElementById('btn-hot-close').onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
    };
  }

  openFieldManual() {
    const modal = document.getElementById('modal-manual');
    const container = document.getElementById('manual-container');
    container.innerHTML = '';

    NASA_FIELD_MANUAL.forEach(article => {
      const card = document.createElement('div');
      card.className = 'manual-story-card';
      card.innerHTML = `
        <div class="manual-story-header">
          <span class="manual-story-icon">${article.icon}</span>
          <div>
            <h3>${article.title}</h3>
            <span class="manual-story-badge">${article.badge}</span>
          </div>
        </div>
        <div class="manual-story-summary">${article.summary}</div>
        <div class="manual-story-body">${article.content}</div>
      `;
      container.appendChild(card);
    });

    modal.classList.add('active');
    document.getElementById('btn-close-manual').onclick = () => {
      this.sound.playClick();
      modal.classList.remove('active');
    };
  }

  showPhaseBanner(text) {
    const el = document.getElementById('phase-announcement');
    if (el) {
      el.textContent = text;
      el.classList.add('visible');
      setTimeout(() => el.classList.remove('visible'), 4000);
    }
  }

  showNotification(msg) {
    const notif = document.getElementById('floating-notif');
    if (notif) {
      notif.textContent = msg;
      notif.classList.add('show');
      setTimeout(() => notif.classList.remove('show'), 4500);
    }
  }

  // ==========================================================================
  // VICTORY & DEFEAT STORY ENDINGS
  // ==========================================================================
  showVictoryScreen() {
    this.gameActive = false;
    this.sound.playSuccess();

    const modal = document.getElementById('modal-victory');
    document.getElementById('vic-summary').textContent = `
      Seven Sols on Mars. Zero lost lives.
      As the dust settles around Landing Pad Alpha, the landing legs of 'Valkyrie-1' cool in the thin Martian air. 
      The hatch swings open, and fresh crates of Earth supplies, letters, and fresh fruit are unloaded by smiling hands.
      Alex, Maya, Sully, and Tariq stand arm-in-arm on the surface, looking up at the sky.
      You didn't just manage resources — you kept a human family alive across 225 million kilometres of empty space.
    `;
    modal.classList.add('active');

    document.getElementById('btn-vic-restart').onclick = () => {
      modal.classList.remove('active');
      this.restartGame();
    };
  }

  showDefeatScreen() {
    this.gameActive = false;
    this.sound.playDefeat();

    const modal = document.getElementById('modal-defeat');
    modal.classList.add('active');

    document.getElementById('btn-def-restart').onclick = () => {
      modal.classList.remove('active');
      this.restartGame();
    };
  }

  restartGame() {
    this.wasm.initGame(Date.now());
    this.crewMorale = 92;
    this.crewHealth = 100;
    this.decisionsHistory = [];
    this.currentSol = 1;
    this.gameActive = true;
    this.updateHUD();
    this.startSolStory(1);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.storyGame = new MarsNarrativeGame();
  window.storyGame.init();
});
