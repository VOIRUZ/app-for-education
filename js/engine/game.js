// Main Game State Machine, Day Progression, and Daily Loop Phases
// "MARS OUTPOST: SEVEN DAYS TO SURVIVE"

import { DAYS_DATA, EDUCATIONAL_TOPICS, CHARACTERS } from '../data/story.js';
import { AudioEngine } from './audio.js';
import { CanvasRenderer } from './canvas-renderer.js';
import { ResourceManager } from './resources.js';
import { DialogueEngine } from './dialogue.js';

export class MarsGame {
  constructor() {
    this.audio = new AudioEngine();
    this.renderer = null;
    this.resources = new ResourceManager();
    this.dialogue = null;

    this.currentDayIndex = 0; // 0 = Day 1, up to 6 = Day 7
    this.currentPhase = 'INIT'; // 'STORY', 'REPORT', 'EXPLORE', 'DECISION', 'CONSEQUENCE', 'END_REPORT', 'VICTORY', 'DEFEAT'
    this.selectedDecision = null;
    this.decisionHistory = [];
    this.isMuted = false;

    // Bind DOM
    this.dom = {
      canvas: document.getElementById('gameCanvas'),
      hudSol: document.getElementById('hud-sol'),
      hudDaysLeft: document.getElementById('hud-days-left'),
      hudO2: document.getElementById('hud-o2'),
      hudH2O: document.getElementById('hud-h2o'),
      hudFood: document.getElementById('hud-food'),
      hudPower: document.getElementById('hud-power'),
      hudMorale: document.getElementById('hud-morale'),
      roomNav: document.getElementById('room-nav'),
      hotspotsContainer: document.getElementById('hotspots-container'),
      eduModal: document.getElementById('edu-modal'),
      eduTitle: document.getElementById('edu-title'),
      eduTag: document.getElementById('edu-tag'),
      eduIcon: document.getElementById('edu-icon'),
      eduSummary: document.getElementById('edu-summary'),
      eduCloseBtn: document.getElementById('edu-close-btn'),
      reportModal: document.getElementById('report-modal'),
      reportTitle: document.getElementById('report-title'),
      reportSub: document.getElementById('report-sub'),
      reportWeather: document.getElementById('report-weather'),
      reportCrewList: document.getElementById('report-crew-list'),
      reportProceedBtn: document.getElementById('report-proceed-btn'),
      decisionPanel: document.getElementById('decision-panel'),
      decisionTitle: document.getElementById('decision-title'),
      decisionDesc: document.getElementById('decision-desc'),
      decisionCards: document.getElementById('decision-cards'),
      endDayModal: document.getElementById('end-day-modal'),
      endDayTitle: document.getElementById('end-day-title'),
      endDaySummary: document.getElementById('end-day-summary'),
      endDayResourceDiff: document.getElementById('end-day-diff'),
      endDayNextBtn: document.getElementById('end-day-next-btn'),
      victoryModal: document.getElementById('victory-modal'),
      defeatModal: document.getElementById('defeat-modal'),
      defeatReason: document.getElementById('defeat-reason'),
      btnRestart: document.getElementById('btn-restart-game'),
      btnRestartDefeat: document.getElementById('btn-restart-defeat'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      btnProceedToIncident: document.getElementById('btn-proceed-incident'),
      rationSelect: document.getElementById('ration-select'),
      powerSelect: document.getElementById('power-select'),
      waterSelect: document.getElementById('water-select')
    };
  }

  init() {
    this.renderer = new CanvasRenderer(this.dom.canvas);
    this.dialogue = new DialogueEngine(this.audio);

    // Window resize
    window.addEventListener('resize', () => this.renderer.resize());
    this.renderer.resize();

    this.bindEvents();
    this.startCampaign();

    // Start render loop
    let lastT = performance.now();
    const loop = (t) => {
      const dt = Math.min((t - lastT) / 1000, 0.1);
      lastT = t;
      this.renderer.render(dt, this);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  bindEvents() {
    // Audio toggle
    if (this.dom.btnAudioToggle) {
      this.dom.btnAudioToggle.addEventListener('click', () => {
        this.audio.init();
        const unmuted = this.audio.toggleMute();
        this.dom.btnAudioToggle.innerText = unmuted ? '🔊 AUDIO ON' : '🔇 AUDIO MUTED';
      });
    }

    // Room navigation buttons
    document.querySelectorAll('.room-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.audio.init();
        this.audio.playClick();
        const roomKey = e.currentTarget.dataset.room;
        this.switchRoom(roomKey);
      });
    });

    // Educational modal close
    if (this.dom.eduCloseBtn) {
      this.dom.eduCloseBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.eduModal.classList.add('hidden');
      });
    }

    // Situation report proceed button
    if (this.dom.reportProceedBtn) {
      this.dom.reportProceedBtn.addEventListener('click', () => {
        this.audio.init();
        this.audio.playClick();
        this.dom.reportModal.classList.add('hidden');
        this.startPhaseExploration();
      });
    }

    // Proceed from exploration to daily incident
    if (this.dom.btnProceedToIncident) {
      this.dom.btnProceedToIncident.addEventListener('click', () => {
        this.audio.playClick();
        this.startPhaseDecision();
      });
    }

    // End of day next button
    if (this.dom.endDayNextBtn) {
      this.dom.endDayNextBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.endDayModal.classList.add('hidden');
        this.advanceToNextDay();
      });
    }

    // Rations & allocation dropdowns
    if (this.dom.rationSelect) {
      this.dom.rationSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('foodRations', e.target.value);
        this.audio.playClick();
      });
    }
    if (this.dom.powerSelect) {
      this.dom.powerSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('powerGrid', e.target.value);
        this.audio.playClick();
      });
    }
    if (this.dom.waterSelect) {
      this.dom.waterSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('waterRecycling', e.target.value);
        this.audio.playClick();
      });
    }

    // Restart game buttons
    if (this.dom.btnRestart) {
      this.dom.btnRestart.addEventListener('click', () => this.restartGame());
    }
    if (this.dom.btnRestartDefeat) {
      this.dom.btnRestartDefeat.addEventListener('click', () => this.restartGame());
    }
  }

  startCampaign() {
    this.currentDayIndex = 0;
    this.decisionHistory = [];
    const dayData = DAYS_DATA[0];
    this.resources.reset(dayData.defaultResources);
    this.loadDay(this.currentDayIndex);
  }

  restartGame() {
    this.dom.victoryModal.classList.add('hidden');
    this.dom.defeatModal.classList.add('hidden');
    this.dom.endDayModal.classList.add('hidden');
    this.dom.reportModal.classList.add('hidden');
    this.dom.decisionPanel.classList.add('hidden');
    this.startCampaign();
  }

  loadDay(dayIndex) {
    const dayData = DAYS_DATA[dayIndex];
    if (!dayData) return;

    // Set weather in renderer
    if (dayData.dayNumber === 3) {
      this.renderer.setWeather('dust_storm');
      this.audio.setMood('tense');
    } else if (dayData.dayNumber === 5) {
      this.renderer.setWeather('radiation');
      this.audio.setMood('tense');
    } else if (dayData.dayNumber === 6) {
      this.renderer.setWeather('clear');
      this.audio.setMood('emotional');
    } else {
      this.renderer.setWeather('clear');
      this.audio.setMood('calm');
    }

    this.updateHUD();
    this.switchRoom('command');

    // Phase 1: Daily Story Dialogue
    this.currentPhase = 'STORY';
    this.dom.roomNav.classList.add('hidden');
    this.dom.btnProceedToIncident.classList.add('hidden');

    this.dialogue.startSequence(dayData.storyDialogue, () => {
      // Once story dialogue is done, show Situation Report (Phase 2)
      this.showSituationReport();
    });
  }

  // Phase 2: Situation Report
  showSituationReport() {
    this.currentPhase = 'REPORT';
    const dayData = DAYS_DATA[this.currentDayIndex];

    this.dom.reportTitle.innerText = `SOL ${dayData.dayNumber}: ${dayData.title.toUpperCase()}`;
    this.dom.reportSub.innerText = dayData.subtitle;
    this.dom.reportWeather.innerText = dayData.environmentalCondition;

    // Render crew status
    let crewHTML = '';
    for (const key in this.resources.crew) {
      const c = this.resources.crew[key];
      const charInfo = CHARACTERS[key] || { badge: 'CREW' };
      crewHTML += `
        <div class="crew-status-card">
          <div class="crew-badge">${charInfo.badge}</div>
          <div class="crew-name">${c.name}</div>
          <div class="crew-stat-bar">
            <span>HEALTH: ${c.health}%</span>
            <span>MORALE: ${c.morale}%</span>
          </div>
          <div class="crew-cond">${c.status}</div>
        </div>
      `;
    }
    this.dom.reportCrewList.innerHTML = crewHTML;
    this.dom.reportModal.classList.remove('hidden');
    this.audio.playChime();
  }

  // Phase 3: Outpost Exploration & Management
  startPhaseExploration() {
    this.currentPhase = 'EXPLORE';
    this.dom.roomNav.classList.remove('hidden');
    this.dom.btnProceedToIncident.classList.remove('hidden');
    this.switchRoom('command');
  }

  switchRoom(roomKey) {
    this.renderer.setRoom(roomKey);
    // Update active room button
    document.querySelectorAll('.room-btn').forEach(b => {
      if (b.dataset.room === roomKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Render Room Hotspots
    this.renderRoomHotspots(roomKey);
  }

  renderRoomHotspots(roomKey) {
    const container = this.dom.hotspotsContainer;
    container.innerHTML = '';

    const dayData = DAYS_DATA[this.currentDayIndex];
    const interactions = (dayData.roomInteractions && dayData.roomInteractions[roomKey]) || [];

    interactions.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'hotspot-btn';
      btn.innerHTML = `<span class="icon">${item.icon}</span><span class="label">${item.name}</span>`;
      btn.addEventListener('click', () => {
        this.audio.init();
        this.audio.playClick();

        if (item.dialogue) {
          this.dialogue.startSequence(item.dialogue);
        } else if (item.eduTopic) {
          this.showEducationalTopic(item.eduTopic);
        } else if (item.text) {
          this.dialogue.startSequence([
            { speaker: 'alex', portrait: 'neutral', text: item.text }
          ]);
        }
      });
      container.appendChild(btn);
    });
  }

  showEducationalTopic(topicKey) {
    const topic = EDUCATIONAL_TOPICS[topicKey];
    if (!topic) return;

    this.dom.eduTitle.innerText = topic.title;
    this.dom.eduTag.innerText = topic.tag;
    this.dom.eduIcon.innerText = topic.icon;
    this.dom.eduSummary.innerText = topic.summary;
    this.dom.eduModal.classList.remove('hidden');
    this.audio.playChime();
  }

  // Phase 4: Henry Stickmin-Inspired Decision
  startPhaseDecision() {
    this.currentPhase = 'DECISION';
    this.dom.roomNav.classList.add('hidden');
    this.dom.btnProceedToIncident.classList.add('hidden');
    this.dom.hotspotsContainer.innerHTML = '';

    const dayData = DAYS_DATA[this.currentDayIndex];
    const dec = dayData.decision;

    this.dom.decisionTitle.innerText = dec.promptTitle;
    this.dom.decisionDesc.innerText = dec.promptDesc;

    // Render 3 Choice Cards
    let cardsHTML = '';
    dec.options.forEach((opt, idx) => {
      cardsHTML += `
        <div class="choice-card" data-idx="${idx}">
          <div class="choice-badge">${opt.badge}</div>
          <div class="choice-icon">${opt.icon}</div>
          <div class="choice-title">${opt.title}</div>
          <div class="choice-desc">${opt.desc}</div>
        </div>
      `;
    });
    this.dom.decisionCards.innerHTML = cardsHTML;
    this.dom.decisionPanel.classList.remove('hidden');

    this.audio.playAlarm();

    // Bind card clicks
    document.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        this.selectDecisionOption(dec.options[idx]);
      });
    });
  }

  selectDecisionOption(option) {
    this.audio.playClick();
    this.selectedDecision = option;
    this.dom.decisionPanel.classList.add('hidden');

    // Apply immediate consequence
    this.resources.applyChoiceImpact(option.impact);
    this.updateHUD();

    // Show consequence dialogue / aftermath
    this.dialogue.startSequence([
      { speaker: 'alex', portrait: 'neutral', text: `DECISION EXECUTED: ${option.title}` },
      { speaker: 'maya', portrait: 'determined', text: option.consequenceText }
    ], () => {
      this.showEndDayReport(option);
    });
  }

  // Phase 5: End-of-Day Report & Next Day Check
  showEndDayReport(decisionMade) {
    this.currentPhase = 'END_REPORT';
    const dayData = DAYS_DATA[this.currentDayIndex];

    // Simulate daily passage
    const simReport = this.resources.simulateDailyPassage(dayData);
    this.updateHUD();

    // Check defeat
    const defeatCheck = this.resources.checkDefeat();
    if (defeatCheck.lost) {
      this.triggerDefeat(defeatCheck.reason);
      return;
    }

    // Populate End-of-day summary
    this.dom.endDayTitle.innerText = `SOL ${dayData.dayNumber} COMPLETED`;
    let summaryNotes = `<p><strong>Decision Outcome:</strong> ${decisionMade.consequenceText}</p>`;
    simReport.notes.forEach(note => {
      summaryNotes += `<p>• ${note}</p>`;
    });
    this.dom.endDaySummary.innerHTML = summaryNotes;

    // Resource diffs
    this.dom.endDayResourceDiff.innerHTML = `
      <div class="diff-chip ${simReport.net.oxygen >= 0 ? 'pos' : 'neg'}">💨 O2: ${simReport.net.oxygen >= 0 ? '+' : ''}${simReport.net.oxygen}%</div>
      <div class="diff-chip ${simReport.net.water >= 0 ? 'pos' : 'neg'}">💧 H2O: ${simReport.net.water >= 0 ? '+' : ''}${simReport.net.water}%</div>
      <div class="diff-chip ${simReport.net.food >= 0 ? 'pos' : 'neg'}">🥫 Food: ${simReport.net.food}%</div>
      <div class="diff-chip ${simReport.net.electricity >= 0 ? 'pos' : 'neg'}">⚡ Power: ${simReport.net.electricity >= 0 ? '+' : ''}${simReport.net.electricity}%</div>
    `;

    this.dom.endDayModal.classList.remove('hidden');
    this.audio.playChime();
  }

  advanceToNextDay() {
    this.currentDayIndex++;
    if (this.currentDayIndex >= 7) {
      this.triggerVictory();
    } else {
      this.loadDay(this.currentDayIndex);
    }
  }

  updateHUD() {
    const dayData = DAYS_DATA[this.currentDayIndex] || { dayNumber: 7 };
    this.dom.hudSol.innerText = `SOL ${dayData.dayNumber} / 7`;
    const daysLeft = 7 - dayData.dayNumber;
    this.dom.hudDaysLeft.innerText = daysLeft === 0 ? 'ARRIVAL TODAY' : `${daysLeft} SOLS REMAINING`;

    const res = this.resources.resources;
    this.dom.hudO2.innerText = `${res.oxygen}%`;
    this.dom.hudH2O.innerText = `${res.water}%`;
    this.dom.hudFood.innerText = `${res.food}%`;
    this.dom.hudPower.innerText = `${res.electricity}%`;

    // Average crew morale
    let totalMorale = 0;
    let count = 0;
    for (const k in this.resources.crew) {
      totalMorale += this.resources.crew[k].morale;
      count++;
    }
    const avgMorale = Math.round(totalMorale / count);
    this.dom.hudMorale.innerText = `${avgMorale}%`;
  }

  triggerVictory() {
    this.currentPhase = 'VICTORY';
    this.audio.setMood('emotional');
    this.audio.playChime();
    this.dom.victoryModal.classList.remove('hidden');
  }

  triggerDefeat(reason) {
    this.currentPhase = 'DEFEAT';
    this.audio.setMood('tense');
    this.audio.playAlarm();
    this.dom.defeatReason.innerText = reason;
    this.dom.defeatModal.classList.remove('hidden');
  }
}

// Auto-boot upon DOM load
window.addEventListener('DOMContentLoaded', () => {
  const game = new MarsGame();
  game.init();
});
