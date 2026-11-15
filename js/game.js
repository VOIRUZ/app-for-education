// ============================================================================
// MOON WATER RESEARCH & SURVIVAL ADVENTURE
// Main Game Controller, Unified Top Flight Bar & Dialogue Audio System
// Concise Dialogue, Transparent Trade-Offs (Cost vs Advantage), High Polish
// ============================================================================

class MoonGame {
  constructor() {
    this.audio = new AudioEngine();
    this.graphics = null;
    this.experiments = null;

    // Progression State
    this.currentDayIndex = 0; // 0 to 6 (Sol 1 to Sol 7)
    this.gameState = 'MENU'; // 'MENU', 'INTRO_CINEMATIC', 'DAY_PLAY', 'EXPERIMENT', 'DECISION', 'DAY_END', 'ENDING_A', 'ENDING_B'
    this.unlockedDatabase = new Set(['electrolysis']);

    // Resource System
    this.resources = {
      oxygen: 82,      // %
      water: 88,       // %
      power: 92,       // %
      food: 85,        // %
      co2: 0.45,       // % (danger if > 1.5%)
      hydrogen: 0,     // stored L
      morale: 95       // %
    };

    // DOM Elements
    this.dom = {
      viewport: document.getElementById('viewport-3d'),
      topHud: document.getElementById('top-hud'),
      solTitle: document.getElementById('hud-sol-title'),
      solSub: document.getElementById('hud-sol-sub'),
      valO2: document.getElementById('val-o2'),
      barO2: document.getElementById('bar-o2'),
      valH2O: document.getElementById('val-h2o'),
      barH2O: document.getElementById('bar-h2o'),
      valPwr: document.getElementById('val-pwr'),
      barPwr: document.getElementById('bar-pwr'),
      valFood: document.getElementById('val-food'),
      barFood: document.getElementById('bar-food'),
      valCO2: document.getElementById('val-co2'),
      barCO2: document.getElementById('bar-co2'),
      objectiveChip: document.getElementById('hud-objective-chip'),
      objectiveText: document.getElementById('hud-objective-text'),
      btnViewWindshield: document.getElementById('btn-view-windshield'),
      controlsGuide: document.getElementById('controls-guide'),
      stationPrompt: document.getElementById('station-prompt'),
      promptStationName: document.getElementById('prompt-station-name'),
      criticalToast: document.getElementById('critical-toast'),
      toastTitle: document.getElementById('toast-title'),
      toastDesc: document.getElementById('toast-desc'),
      btnToastAct: document.getElementById('btn-toast-act'),
      btnCloseToast: document.getElementById('btn-close-toast'),
      windshieldOverlay: document.getElementById('windshield-overlay'),
      btnExitWindshield: document.getElementById('btn-exit-windshield'),
      dialogueBox: document.getElementById('dialogue-box'),
      dialogueSpeaker: document.getElementById('dialogue-speaker'),
      dialogueRole: document.getElementById('dialogue-role'),
      dialogueText: document.getElementById('dialogue-text'),
      dialogueAvatar: document.getElementById('dialogue-avatar'),
      dialogueIndicator: document.getElementById('dialogue-indicator'),
      decisionPanel: document.getElementById('decision-panel'),
      decisionPrompt: document.getElementById('decision-prompt'),
      decisionCards: document.getElementById('decision-cards'),
      taskModal: document.getElementById('task-modal'),
      taskCanvasArea: document.getElementById('task-canvas-area'),
      taskTitleText: document.getElementById('task-title-text'),
      taskStationIcon: document.getElementById('task-station-icon'),
      taskInstruction: document.getElementById('task-instruction'),
      taskCompletedStamp: document.getElementById('task-completed-stamp'),
      btnSkipTask: document.getElementById('btn-skip-task'),
      menuModal: document.getElementById('main-menu-modal'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      btnOpenDatabase: document.getElementById('btn-open-database'),
      databaseModal: document.getElementById('database-modal'),
      btnCloseDatabase: document.getElementById('btn-close-database'),
      dbTopicsList: document.getElementById('db-topics-list'),
      dbDetailCard: document.getElementById('db-detail-card'),
      dayTitleScreen: document.getElementById('day-title-screen'),
      dayTitleMain: document.getElementById('day-title-main'),
      dayTitleSub: document.getElementById('day-title-sub'),
      endDayModal: document.getElementById('end-day-modal'),
      endDayTitle: document.getElementById('end-day-title'),
      endDaySummary: document.getElementById('end-day-summary'),
      btnNextDay: document.getElementById('btn-next-day'),
      epilogueModal: document.getElementById('epilogue-modal'),
      epilogueTitle: document.getElementById('epilogue-title'),
      epilogueBadge: document.getElementById('epilogue-badge'),
      epilogueBody: document.getElementById('epilogue-body'),
      btnRestartCampaign: document.getElementById('btn-restart-campaign')
    };

    // Dialogue State
    this.dialogueQueue = [];
    this.dialogueIndex = 0;
    this.typewriterTimer = null;
    this.isTyping = false;
    this.currentLineTargetText = '';
    this.currentSpeaker = 'frisk';
    this.onDialogueComplete = null;

    // Active Day State
    this.isEventTriggered = false;
    this.isStationBusy = false;

    // Among Us Style Interactive Task Subsystem
    this.tasks = new AmongUsTaskManager(this.audio);
  }

  init() {
    // 1. Initialize 3D Graphics
    this.graphics = new MoonGame3D(this.dom.viewport);
    this.graphics.setAudio(this.audio);
    this.graphics.init();

    // Bind Station Proximity & Windshield Callbacks
    this.graphics.onStationNearCallback = (key, label) => this.handleStationNear(key, label);
    this.graphics.onStationLeaveCallback = () => this.handleStationLeave();
    this.graphics.onStationInteractCallback = (key) => this.handleStationInteract(key);
    this.graphics.onWindshieldViewToggle = (isOpen) => this.handleWindshieldToggle(isOpen);

    // 2. Initialize Mini-Game Tasks & Experiment Subsystems
    this.tasks.init(this.dom);
    this.experiments = new ExperimentEngine(this.audio);

    // 3. Bind UI Events
    this.bindEvents();

    // 4. Populate Research Database
    this.buildDatabaseMenu();

    // 5. Update Initial HUD
    this.updateHUD();
  }

  bindEvents() {
    // Start Game
    this.dom.btnStartGame.addEventListener('click', () => {
      this.audio.init();
      this.audio.playDiscovery();
      this.dom.menuModal.classList.add('hidden');
      this.startOpeningCinematic();
    });

    // Audio Toggle
    this.dom.btnAudioToggle.addEventListener('click', () => {
      this.audio.init();
      const active = this.audio.toggleMute();
      this.dom.btnAudioToggle.innerText = active ? '🔊' : '🔇';
      this.dom.btnAudioToggle.title = active ? 'Mute Sound' : 'Enable Sound';
    });

    // Look Outside Cockpit Windshield Button
    this.dom.btnViewWindshield.addEventListener('click', () => {
      this.audio.init();
      this.graphics.toggleWindshieldView();
    });

    // Exit Windshield View Button
    this.dom.btnExitWindshield.addEventListener('click', () => {
      this.graphics.exitWindshieldView();
    });

    // Dialogue Advance
    this.dom.dialogueBox.addEventListener('click', () => this.advanceDialogue());
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (!this.dom.dialogueBox.classList.contains('hidden')) {
          e.preventDefault();
          this.advanceDialogue();
        }
      }
    });

    // Station Proximity Prompt Click
    this.dom.stationPrompt.addEventListener('click', () => {
      if (this.graphics && this.graphics.nearestStation) {
        const key = this.graphics.nearestStation.userData.stationKey;
        if (key === 'windshield' || key === 'airlock') {
          this.graphics.enterWindshieldView();
        } else {
          this.handleStationInteract(key);
        }
      }
    });

    // Critical Alert Toast Buttons
    this.dom.btnToastAct.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.criticalToast.classList.add('hidden');
      const dayData = DAYS_DATA[this.currentDayIndex];
      if (dayData && this.graphics.stations[dayData.stationKey]) {
        const st = this.graphics.stations[dayData.stationKey];
        const targetX = dayData.stationKey === 'bench' ? 0 : (st.position.x > 0 ? 12 : -12);
        const targetZ = dayData.stationKey === 'bench' ? (st.position.z + 20.0) : st.position.z;
        this.graphics.setClickTarget(targetX, targetZ, () => {
          this.handleStationInteract(dayData.stationKey);
        });
      }
    });

    this.dom.btnCloseToast.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.criticalToast.classList.add('hidden');
    });

    // Clicking Objective Chip re-opens notification or guides to station
    this.dom.objectiveChip.addEventListener('click', () => {
      this.audio.playClick();
      const dayData = DAYS_DATA[this.currentDayIndex];
      if (dayData) {
        this.dom.toastTitle.innerText = dayData.event.title;
        this.dom.toastDesc.innerText = dayData.event.desc;
        this.dom.criticalToast.classList.remove('hidden');
      }
    });

    // Research Database Modal (if present)
    if (this.dom.btnOpenDatabase) {
      this.dom.btnOpenDatabase.addEventListener('click', () => {
        this.audio.playSwish();
        this.dom.databaseModal.classList.remove('hidden');
      });
    }

    this.dom.btnCloseDatabase.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.databaseModal.classList.add('hidden');
    });

    // Next Sol Advance
    this.dom.btnNextDay.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.endDayModal.classList.add('hidden');
      this.advanceToNextDay();
    });

    // Restart Campaign
    this.dom.btnRestartCampaign.addEventListener('click', () => {
      this.audio.playClick();
      this.dom.epilogueModal.classList.add('hidden');
      this.resetCampaign();
    });
  }

  // ================= SCENARIO RUNNER & CINEMATICS =================

  startOpeningCinematic() {
    this.gameState = 'INTRO_CINEMATIC';
    this.graphics.switchScene('space');
    this.dom.topHud.classList.add('hidden');
    this.dom.controlsGuide.classList.add('hidden');

    this.queueDialogueSequence(OPENING_CINEMATIC, () => {
      this.startDay(0);
    });
  }

  startDay(dayIndex) {
    this.currentDayIndex = dayIndex;
    this.gameState = 'DAY_PLAY';
    this.isEventTriggered = false;
    this.isStationBusy = false;

    const dayData = DAYS_DATA[dayIndex];

    // Show Day Sol Title Splash
    this.dom.dayTitleMain.innerText = `SOL ${dayData.dayNumber}: ${dayData.title}`;
    this.dom.dayTitleSub.innerText = dayData.subtitle;
    this.dom.dayTitleScreen.classList.remove('hidden');
    this.audio.playAlarm();

    setTimeout(() => {
      this.dom.dayTitleScreen.classList.add('hidden');
      this.dom.topHud.classList.remove('hidden');
      this.dom.controlsGuide.classList.remove('hidden');

      this.graphics.switchScene('interior');
      this.updateHUD();

      // Configure Active Station in 3D Graphics
      this.graphics.setActiveObjectiveStation(dayData.stationKey);
      this.dom.objectiveText.innerText = dayData.stationKey.toUpperCase();

      // Trigger the Sol Event Toast
      this.triggerDailyEvent(dayData);
    }, 2400);
  }

  triggerDailyEvent(dayData) {
    this.isEventTriggered = true;
    this.audio.playKlaxon();
    this.graphics.triggerScreenShake(10);

    this.dom.toastTitle.innerText = dayData.event.title;
    this.dom.toastDesc.innerText = dayData.event.desc;
    this.dom.criticalToast.classList.remove('hidden');
  }

  // ================= STATION PROXIMITY & INTERACTION =================

  handleStationNear(stationKey, label) {
    if (this.graphics && this.graphics.isWindshieldMode) return;
    this.dom.promptStationName.innerText = label || stationKey.toUpperCase();
    this.dom.stationPrompt.classList.remove('hidden');
  }

  handleStationLeave() {
    this.dom.stationPrompt.classList.add('hidden');
  }

  handleStationInteract(stationKey) {
    if (this.isStationBusy) return;
    if (this.graphics && this.graphics.isWindshieldMode) return;

    const dayData = DAYS_DATA[this.currentDayIndex];
    this.audio.playStationInteract();

    // Check if player is interacting with the target objective station
    if (stationKey === dayData.stationKey) {
      this.isStationBusy = true;
      this.dom.stationPrompt.classList.add('hidden');
      this.dom.criticalToast.classList.add('hidden');

      // Play concise radio dialogue before action
      this.queueDialogueSequence(dayData.dialogueIntro, () => {
        if (dayData.experimentId) {
          this.unlockedDatabase.add(dayData.experimentId);
        }

        // If Sol has an Among Us tactical task, start the mini-game!
        if (dayData.taskType) {
          this.tasks.startTask(dayData.taskType, dayData.stationKey, () => {
            this.showDecision(dayData.decision);
          });
        } else if (dayData.experimentId && dayData.dayNumber !== 7) {
          this.experiments.show(dayData.experimentId, () => {
            this.showDecision(dayData.decision);
          });
        } else {
          this.showDecision(dayData.decision);
        }
      });
    } else if (stationKey === 'windshield' || stationKey === 'airlock') {
      this.graphics.enterWindshieldView();
    } else {
      const stName = stationKey.toUpperCase();
      this.queueDialogueSequence([
        { speaker: 'frisk', text: `${stName} is currently operating on standby. My primary emergency objective is at the ${dayData.stationKey.toUpperCase()} station.` }
      ]);
    }
  }

  handleWindshieldToggle(isOpen) {
    if (isOpen) {
      this.dom.windshieldOverlay.classList.remove('hidden');
      this.dom.btnViewWindshield.innerText = 'RETURN 🚶';
      this.dom.btnViewWindshield.classList.add('active');
      this.dom.stationPrompt.classList.add('hidden');
      this.dom.criticalToast.classList.add('hidden');
    } else {
      this.dom.windshieldOverlay.classList.add('hidden');
      this.dom.btnViewWindshield.innerText = '🔭 LOOK OUTSIDE';
      this.dom.btnViewWindshield.classList.remove('active');
    }
  }

  // ================= TRANSPARENT TRADE-OFF DECISION PANEL =================

  showDecision(decisionData) {
    this.dom.decisionPrompt.innerText = decisionData.prompt;
    this.dom.decisionCards.innerHTML = '';

    decisionData.options.forEach((opt) => {
      const card = document.createElement('div');
      card.className = 'decision-card';

      // Build Green Gains List (Green color with Up Arrow ▲)
      let gainsHtml = '';
      if (opt.gains && opt.gains.length > 0) {
        gainsHtml = opt.gains.map(g => `
          <div class="result-gain-row">
            <span class="gain-arrow">▲</span>
            <span class="gain-qty">${g.qty}</span>
            <span class="gain-label">${g.label}</span>
          </div>
        `).join('');
      } else if (opt.gain) {
        gainsHtml = `
          <div class="result-gain-row">
            <span class="gain-arrow">▲</span>
            <span class="gain-label">${opt.gain}</span>
          </div>
        `;
      }

      // Build Red Losses List (Red color with Down Arrow ▼ and quantity on right side of arrow)
      let lossesHtml = '';
      if (opt.losses && opt.losses.length > 0) {
        lossesHtml = opt.losses.map(l => `
          <div class="result-loss-row">
            <span class="loss-arrow">▼</span>
            <span class="loss-qty">${l.qty}</span>
            <span class="loss-label">${l.label}</span>
          </div>
        `).join('');
      } else if (opt.loss) {
        lossesHtml = `
          <div class="result-loss-row">
            <span class="loss-arrow">▼</span>
            <span class="loss-label">${opt.loss}</span>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="card-badge">${opt.badge}</div>
        <div class="card-icon-title">
          <span class="card-icon">${opt.icon}</span>
          <h3 class="card-title">${opt.title}</h3>
        </div>
        <p class="card-result-summary">${opt.summary || opt.desc}</p>
        
        <div class="tradeoff-outcome-box">
          <div class="outcome-section-title gains-header">WHAT YOU GAIN:</div>
          <div class="outcome-gains-list">
            ${gainsHtml || '<div class="result-gain-row"><span class="gain-arrow">▲</span><span class="gain-label">Standard Operation</span></div>'}
          </div>

          <div class="outcome-section-title losses-header">WHAT YOU LOSE:</div>
          <div class="outcome-losses-list">
            ${lossesHtml || '<div class="result-loss-row zero-loss"><span class="loss-arrow">▼</span><span class="loss-qty">0</span><span class="loss-label">No immediate loss</span></div>'}
          </div>
        </div>

        <button class="btn-commit-decision">CONFIRM THIS OPTION ▶</button>
      `;

      card.querySelector('.btn-commit-decision').addEventListener('click', (e) => {
        e.stopPropagation();
        this.commitDecision(opt);
      });
      card.addEventListener('click', () => {
        this.commitDecision(opt);
      });

      this.dom.decisionCards.appendChild(card);
    });

    this.dom.decisionPanel.classList.remove('hidden');
  }

  commitDecision(opt) {
    this.audio.playDiscovery();
    this.dom.decisionPanel.classList.add('hidden');

    if (opt.impact) {
      this.applyConsequences(opt.impact);
    }

    if (opt.id === 'ending_a') {
      this.triggerEndingA();
      return;
    } else if (opt.id === 'ending_b') {
      this.triggerEndingB();
      return;
    }

    const dayData = DAYS_DATA[this.currentDayIndex];

    this.queueDialogueSequence(dayData.resolutionDialogue, () => {
      this.isStationBusy = false;

      if (this.currentDayIndex === 5) {
        this.triggerDay6Collapse();
        return;
      }

      this.completeDay();
    });
  }

  applyConsequences(impact) {
    if (!impact) return;
    if (impact.oxygen) this.resources.oxygen = Math.max(0, Math.min(100, this.resources.oxygen + impact.oxygen));
    if (impact.water) this.resources.water = Math.max(0, Math.min(100, this.resources.water + impact.water));
    if (impact.power) this.resources.power = Math.max(0, Math.min(100, this.resources.power + impact.power));
    if (impact.food) this.resources.food = Math.max(0, Math.min(100, this.resources.food + impact.food));
    if (impact.co2) this.resources.co2 = Math.max(0.1, Math.min(3.0, this.resources.co2 + (impact.co2 * 0.01)));
    if (impact.hydrogen) this.resources.hydrogen += impact.hydrogen;
    if (impact.morale) this.resources.morale = Math.max(0, Math.min(100, this.resources.morale + impact.morale));

    this.updateHUD();
  }

  completeDay() {
    const dayData = DAYS_DATA[this.currentDayIndex];
    this.audio.playChime();

    this.resources.oxygen = Math.max(0, this.resources.oxygen - 10);
    this.resources.water = Math.max(0, this.resources.water - 7);
    this.resources.power = Math.max(0, this.resources.power - 8);
    this.resources.food = Math.max(0, this.resources.food - 8);
    this.resources.co2 = Math.min(2.5, this.resources.co2 + 0.12);

    this.updateHUD();

    this.dom.endDayTitle.innerText = `SOL ${dayData.dayNumber} SURVIVED!`;
    this.dom.endDaySummary.innerHTML = `
      <p style="font-size: 15px; color: #e2e8f0; margin-bottom: 14px;"><strong>Log:</strong> ${dayData.overview}</p>
      <div class="diff-grid">
        <div class="diff-pill">💨 O₂: ${Math.round(this.resources.oxygen)}%</div>
        <div class="diff-pill">💧 H₂O: ${Math.round(this.resources.water)}%</div>
        <div class="diff-pill">⚡ Power: ${Math.round(this.resources.power)}%</div>
        <div class="diff-pill">🥫 Food: ${Math.round(this.resources.food)}%</div>
      </div>
      <p style="margin-top: 14px; color: #76ff03; font-weight: 700;">
        🌙 Polar shadow deepens across the craters. Life support is nominal.
      </p>
    `;

    this.dom.endDayModal.classList.remove('hidden');
  }

  advanceToNextDay() {
    if (this.currentDayIndex < 6) {
      this.startDay(this.currentDayIndex + 1);
    }
  }

  // ================= DAY 6 COLLAPSE & ENDINGS =================

  triggerDay6Collapse() {
    this.audio.playHeartbeat(true);
    this.graphics.triggerScreenShake(26);

    this.dom.dayTitleMain.innerText = 'CRITICAL HYPOXIA & POLAR FREEZE';
    this.dom.dayTitleSub.innerText = 'Vision fading... Core temperature dropping...';
    this.dom.dayTitleScreen.classList.remove('hidden');

    setTimeout(() => {
      this.dom.dayTitleScreen.classList.add('hidden');
      this.startDay(6);
    }, 3400);
  }

  triggerEndingA() {
    this.gameState = 'ENDING_A';
    this.graphics.switchScene('space');

    this.queueDialogueSequence(ENDING_A_DATA.dialogue, () => {
      this.dom.epilogueTitle.innerText = ENDING_A_DATA.title;
      this.dom.epilogueBadge.innerText = ENDING_A_DATA.badge;
      this.dom.epilogueBadge.style.color = '#00e5ff';
      this.dom.epilogueBody.innerText = ENDING_A_DATA.epilogue;
      this.dom.epilogueModal.classList.remove('hidden');
      this.audio.playDiscovery();
    });
  }

  triggerEndingB() {
    this.gameState = 'ENDING_B';
    this.graphics.switchScene('lab');

    this.experiments.show('lunar_water_lab', () => {
      this.queueDialogueSequence(ENDING_B_DATA.dialogue, () => {
        this.dom.epilogueTitle.innerText = ENDING_B_DATA.title;
        this.dom.epilogueBadge.innerText = ENDING_B_DATA.badge;
        this.dom.epilogueBadge.style.color = '#76ff03';
        this.dom.epilogueBody.innerText = ENDING_B_DATA.epilogue;
        this.dom.epilogueModal.classList.remove('hidden');
        this.audio.playDiscovery();
      });
    });
  }

  resetCampaign() {
    this.resources = {
      oxygen: 82, water: 88, power: 92, food: 85, co2: 0.45, hydrogen: 0, morale: 95
    };
    this.currentDayIndex = 0;
    this.isEventTriggered = false;
    this.isStationBusy = false;
    this.dom.topHud.classList.add('hidden');
    this.dom.controlsGuide.classList.add('hidden');
    this.dom.criticalToast.classList.add('hidden');
    this.dom.windshieldOverlay.classList.add('hidden');
    this.dom.dialogueBox.classList.add('hidden');
    if (this.dom.taskModal) this.dom.taskModal.classList.add('hidden');
    this.dom.menuModal.classList.remove('hidden');
    this.graphics.switchScene('interior');
  }

  // ================= DIALOGUE ENGINE & VOICE AUDIO CHATTER =================

  queueDialogueSequence(lines, onComplete) {
    if (!lines || lines.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    this.dialogueQueue = [...lines];
    this.dialogueIndex = 0;
    this.onDialogueComplete = onComplete;
    this.dom.dialogueBox.classList.remove('hidden');
    this.displayCurrentDialogueLine();
  }

  displayCurrentDialogueLine() {
    if (this.dialogueIndex >= this.dialogueQueue.length) {
      this.dom.dialogueBox.classList.add('hidden');
      if (this.onDialogueComplete) {
        this.onDialogueComplete();
      }
      return;
    }

    const item = this.dialogueQueue[this.dialogueIndex];
    this.currentSpeaker = item.speaker || 'frisk';
    const speakerInfo = CHARACTERS[item.speaker] || {
      name: item.speaker, role: 'CREW', color: '#fff', badge: 'ASTRONAUT'
    };

    this.dom.dialogueSpeaker.innerText = speakerInfo.name;
    this.dom.dialogueSpeaker.style.color = speakerInfo.color;
    this.dom.dialogueRole.innerText = `[${speakerInfo.badge || speakerInfo.role}]`;

    // Render Detailed Realistic Astronaut Avatar
    this.dom.dialogueAvatar.innerHTML = this.renderAvatarSVG(item.speaker);

    // Audio: Transmission open chime / quindar tone / squelch
    this.audio.playCommsTransmission(this.currentSpeaker);

    // Typewriter Text Effect with Voice Audio Chatter and Preserved Spacing
    this.currentLineTargetText = item.text;
    this.dom.dialogueText.textContent = '';
    this.isTyping = true;
    this.dom.dialogueIndicator.classList.add('hidden');

    clearInterval(this.typewriterTimer);
    let charIdx = 0;
    let accumulatedText = '';

    this.typewriterTimer = setInterval(() => {
      if (charIdx < this.currentLineTargetText.length) {
        accumulatedText += this.currentLineTargetText[charIdx];
        this.dom.dialogueText.textContent = accumulatedText;

        // Play character voice audio on letters (every 2-3 characters)
        if (this.currentLineTargetText[charIdx] !== ' ' && charIdx % 2 === 0) {
          this.audio.playDialogueVoice(this.currentSpeaker);
        }
        charIdx++;
      } else {
        this.finishTyping();
      }
    }, 16);
  }

  finishTyping() {
    clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.dom.dialogueText.textContent = this.currentLineTargetText;
    this.dom.dialogueIndicator.classList.remove('hidden');
  }

  advanceDialogue() {
    if (this.isTyping) {
      this.finishTyping();
    } else {
      this.audio.playClick();
      this.dialogueIndex++;
      this.displayCurrentDialogueLine();
    }
  }

  // ================= REALISTIC ASTRONAUT AVATARS (SVG) =================

  renderAvatarSVG(characterKey) {
    if (characterKey === 'frisk') {
      return `
        <svg viewBox="0 0 100 100" class="avatar-svg">
          <defs>
            <radialGradient id="friskVisor" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stop-color="#fff3b0"/>
              <stop offset="40%" stop-color="#ffd54f"/>
              <stop offset="75%" stop-color="#ff8f00"/>
              <stop offset="100%" stop-color="#b45309"/>
            </radialGradient>
            <linearGradient id="friskSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="60%" stop-color="#e2e8f0"/>
              <stop offset="100%" stop-color="#94a3b8"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#070f1e" stroke="#00e5ff" stroke-width="2.5"/>
          <path d="M18 94 Q50 72 82 94 Z" fill="url(#friskSuit)"/>
          <path d="M30 76 Q50 68 70 76" stroke="#00e5ff" stroke-width="3" fill="none"/>
          <circle cx="34" cy="85" r="3" fill="#00e5ff"/>
          <circle cx="66" cy="85" r="3" fill="#ef4444"/>
          <circle cx="50" cy="46" r="30" fill="url(#friskSuit)" stroke="#cbd5e1" stroke-width="2"/>
          <ellipse cx="50" cy="46" r="23" fill="#1e293b"/>
          <ellipse cx="50" cy="46" rx="21" ry="19" fill="url(#friskVisor)"/>
          <path d="M34 33 Q50 28 66 33 Q50 36 34 33 Z" fill="#ffffff" opacity="0.6"/>
          <circle cx="50" cy="46" r="6" fill="none" stroke="#00e5ff" stroke-width="1" stroke-dasharray="2,2"/>
          <line x1="40" y1="46" x2="45" y2="46" stroke="#00e5ff" stroke-width="1.5"/>
          <line x1="55" y1="46" x2="60" y2="46" stroke="#00e5ff" stroke-width="1.5"/>
          <rect x="20" y="42" width="4" height="8" rx="2" fill="#00e5ff"/>
          <rect x="76" y="42" width="4" height="8" rx="2" fill="#00e5ff"/>
        </svg>
      `;
    } else if (characterKey === 'asriel') {
      return `
        <svg viewBox="0 0 100 100" class="avatar-svg">
          <defs>
            <radialGradient id="asrielVisor" cx="50%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="45%" stop-color="#ca8a04"/>
              <stop offset="85%" stop-color="#713f12"/>
              <stop offset="100%" stop-color="#1e1b4b"/>
            </radialGradient>
            <linearGradient id="asrielSuit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc"/>
              <stop offset="50%" stop-color="#cbd5e1"/>
              <stop offset="100%" stop-color="#475569"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#070f1e" stroke="#76ff03" stroke-width="2.5"/>
          <path d="M18 94 Q50 72 82 94 Z" fill="url(#asrielSuit)"/>
          <path d="M28 78 Q50 70 72 78" stroke="#76ff03" stroke-width="3" fill="none"/>
          <rect x="44" y="80" width="12" height="6" rx="2" fill="#15803d"/>
          <circle cx="50" cy="46" r="30" fill="url(#asrielSuit)" stroke="#94a3b8" stroke-width="2"/>
          <ellipse cx="50" cy="46" rx="22" ry="19" fill="url(#asrielVisor)"/>
          <path d="M31 52 Q50 48 69 53 L69 62 Q50 64 31 62 Z" fill="#0f172a" opacity="0.6"/>
          <path d="M35 34 Q50 30 65 34 Q50 37 35 34 Z" fill="#ffffff" opacity="0.55"/>
          <line x1="77" y1="42" x2="88" y2="18" stroke="#76ff03" stroke-width="2"/>
          <circle cx="88" cy="18" r="2.5" fill="#76ff03"/>
          <rect x="19" y="40" width="5" height="10" rx="2" fill="#facc15"/>
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 100 100" class="avatar-svg">
          <defs>
            <linearGradient id="controlVest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47" fill="#050815" stroke="#ffd54f" stroke-width="2.5"/>
          <path d="M20 94 Q50 74 80 94 Z" fill="url(#controlVest)" stroke="#334155" stroke-width="1.5"/>
          <rect x="42" y="78" width="16" height="16" rx="2" fill="#1e3a8a"/>
          <path d="M26 46 A 24 24 0 0 1 74 46" fill="none" stroke="#94a3b8" stroke-width="3.5"/>
          <circle cx="50" cy="48" r="21" fill="#fcd34d"/>
          <rect x="34" y="44" width="13" height="9" rx="2" fill="#00e5ff" opacity="0.85"/>
          <rect x="53" y="44" width="13" height="9" rx="2" fill="#00e5ff" opacity="0.85"/>
          <line x1="47" y1="48" x2="53" y2="48" stroke="#000" stroke-width="2"/>
          <rect x="22" y="42" width="6" height="14" rx="3" fill="#334155"/>
          <rect x="72" y="42" width="6" height="14" rx="3" fill="#334155"/>
          <path d="M72 52 Q62 66 50 63" fill="none" stroke="#cbd5e1" stroke-width="2.5"/>
          <circle cx="49" cy="63" r="2.5" fill="#ef4444"/>
        </svg>
      `;
    }
  }

  // ================= UNIFIED SLIM UPPER HUD UPDATE =================

  updateHUD() {
    const dayData = DAYS_DATA[this.currentDayIndex] || { dayNumber: 1, title: 'MISSION' };
    this.dom.solTitle.innerText = `SOL ${dayData.dayNumber} / 7`;
    const daysLeft = 7 - dayData.dayNumber;
    this.dom.solSub.innerText = daysLeft === 0 ? 'RESCUE DAY!' : `${daysLeft} SOLS REMAINING`;

    // Values & Progress Micro-Bars
    const o2Val = Math.round(this.resources.oxygen);
    const h2oVal = Math.round(this.resources.water);
    const pwrVal = Math.round(this.resources.power);
    const foodVal = Math.round(this.resources.food);
    const co2Val = this.resources.co2;

    this.dom.valO2.innerText = `${o2Val}%`;
    this.dom.barO2.style.width = `${Math.min(100, o2Val)}%`;
    this.dom.valO2.style.color = o2Val < 25 ? '#ef4444' : '#00e5ff';
    this.dom.barO2.style.background = o2Val < 25 ? '#ef4444' : '#00e5ff';

    this.dom.valH2O.innerText = `${h2oVal}%`;
    this.dom.barH2O.style.width = `${Math.min(100, h2oVal)}%`;
    this.dom.valH2O.style.color = h2oVal < 25 ? '#ef4444' : '#0284c7';
    this.dom.barH2O.style.background = h2oVal < 25 ? '#ef4444' : '#0284c7';

    this.dom.valPwr.innerText = `${pwrVal}%`;
    this.dom.barPwr.style.width = `${Math.min(100, pwrVal)}%`;
    this.dom.valPwr.style.color = pwrVal < 25 ? '#ef4444' : '#ffd54f';
    this.dom.barPwr.style.background = pwrVal < 25 ? '#ef4444' : '#ffd54f';

    this.dom.valFood.innerText = `${foodVal}%`;
    this.dom.barFood.style.width = `${Math.min(100, foodVal)}%`;

    this.dom.valCO2.innerText = `${co2Val.toFixed(2)}%`;
    const co2Pct = Math.min(100, Math.round((co2Val / 2.0) * 100));
    this.dom.barCO2.style.width = `${co2Pct}%`;
    this.dom.valCO2.style.color = co2Val > 1.2 ? '#ef4444' : '#76ff03';
    this.dom.barCO2.style.background = co2Val > 1.2 ? '#ef4444' : '#76ff03';
  }

  buildDatabaseMenu() {
    this.dom.dbTopicsList.innerHTML = '';
    RESEARCH_DATABASE.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = 'db-nav-item';
      if (idx === 0) btn.classList.add('active');
      btn.innerHTML = `<span>${item.icon}</span> <span>${item.title}</span>`;

      btn.addEventListener('click', () => {
        this.audio.playClick();
        document.querySelectorAll('.db-nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.showDatabaseCard(item);
      });

      this.dom.dbTopicsList.appendChild(btn);
    });

    this.showDatabaseCard(RESEARCH_DATABASE[0]);
  }

  showDatabaseCard(item) {
    let stepsHTML = '';
    item.howItWorks.forEach(st => {
      stepsHTML += `<li>${st}</li>`;
    });

    this.dom.dbDetailCard.innerHTML = `
      <div class="db-header-row">
        <span class="db-card-icon">${item.icon}</span>
        <div>
          <h2>${item.title}</h2>
          <span class="db-tag">${item.tag}</span>
        </div>
      </div>
      <div class="db-formula">🔬 ${item.formula}</div>
      <p class="db-summary">${item.summary}</p>
      <h3>HOW IT WORKS:</h3>
      <ol class="db-steps-list">${stepsHTML}</ol>
      <div class="db-fun-fact">
        💡 <strong>NASA & ASTRONOMY FACT:</strong><br>${item.funFact}
      </div>
    `;
  }
}

// Auto-boot on window load
window.addEventListener('DOMContentLoaded', () => {
  const game = new MoonGame();
  window.game = game;
  game.init();
});
