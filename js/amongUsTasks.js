// ============================================================================
// MOON WATER RESEARCH & SURVIVAL ADVENTURE
// Among Us Style Interactive Station Mini-Games
// Tactile, Responsive & Satisfying Astronaut Ship Tasks
// ============================================================================

class AmongUsTaskManager {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.modal = null;
    this.canvasArea = null;
    this.titleText = null;
    this.stationIcon = null;
    this.instruction = null;
    this.stamp = null;
    this.btnSkip = null;
    this.onCompleteCallback = null;
    this.activeTask = null;
    this.isCompleted = false;
  }

  init(domElements) {
    this.modal = domElements.taskModal;
    this.canvasArea = domElements.taskCanvasArea;
    this.titleText = domElements.taskTitleText;
    this.stationIcon = domElements.taskStationIcon;
    this.instruction = domElements.taskInstruction;
    this.stamp = domElements.taskCompletedStamp;
    this.btnSkip = domElements.btnSkipTask;

    if (this.btnSkip) {
      this.btnSkip.addEventListener('click', () => {
        this.audio.playClick();
        this.finishTask();
      });
    }
  }

  startTask(taskType, stationKey, onComplete) {
    this.onCompleteCallback = onComplete;
    this.isCompleted = false;
    this.activeTask = taskType;

    if (this.stamp) this.stamp.classList.add('hidden');
    if (this.modal) this.modal.classList.remove('hidden');

    // Route to specific mini-game
    switch (taskType) {
      case 'wires':
        this.setupWiresTask();
        break;
      case 'filter_debris':
        this.setupFilterDebrisTask();
        break;
      case 'divert_power':
        this.setupDivertPowerTask();
        break;
      case 'frequency_dial':
        this.setupFrequencyTask();
        break;
      case 'simon_says':
        this.setupSimonSaysTask();
        break;
      default:
        this.setupWiresTask();
        break;
    }
  }

  finishTask() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    if (this.audio) this.audio.playTaskSuccess();

    if (this.stamp) {
      this.stamp.classList.remove('hidden');
      this.stamp.classList.add('animate-stamp');
    }

    setTimeout(() => {
      if (this.modal) this.modal.classList.add('hidden');
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
    }, 1200);
  }

  // ================= 1. FIX ELECTRICAL WIRING TASK (AMONG US CLASSIC) =================

  setupWiresTask() {
    this.stationIcon.innerText = '⚡';
    this.titleText.innerText = 'FIX ELECTRICAL WIRING // PRIMARY LIFE SUPPORT';
    this.instruction.innerText = 'Click a wire on the LEFT, then click the MATCHING COLOR on the RIGHT!';

    const colors = [
      { id: 'red', hex: '#ef4444', label: 'RED' },
      { id: 'blue', hex: '#00e5ff', label: 'CYAN' },
      { id: 'yellow', hex: '#ffd54f', label: 'YELLOW' },
      { id: 'pink', hex: '#ec4899', label: 'PINK' }
    ];

    // Left order is fixed, Right order is shuffled
    const leftOrder = [...colors];
    const rightOrder = [...colors].sort(() => Math.random() - 0.5);

    let selectedLeft = null;
    const connectedWires = new Set();

    this.canvasArea.innerHTML = `
      <div class="wires-task-container">
        <div class="wires-column left-wires" id="wires-left-col">
          ${leftOrder.map(c => `
            <div class="wire-port-item" data-color="${c.id}" data-side="left">
              <span class="wire-label" style="color: ${c.hex};">${c.label}</span>
              <div class="wire-node" style="background: ${c.hex}; box-shadow: 0 0 10px ${c.hex};"></div>
            </div>
          `).join('')}
        </div>

        <svg class="wires-svg-canvas" id="wires-svg-layer">
          <!-- Dynamic connected wire lines -->
        </svg>

        <div class="wires-column right-wires" id="wires-right-col">
          ${rightOrder.map(c => `
            <div class="wire-port-item" data-color="${c.id}" data-side="right">
              <div class="wire-node" style="background: ${c.hex}; box-shadow: 0 0 10px ${c.hex};"></div>
              <span class="wire-status-led" id="led-right-${c.id}"></span>
              <span class="wire-label" style="color: ${c.hex};">${c.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const svgLayer = document.getElementById('wires-svg-layer');
    const leftPorts = this.canvasArea.querySelectorAll('.wire-port-item[data-side="left"]');
    const rightPorts = this.canvasArea.querySelectorAll('.wire-port-item[data-side="right"]');

    const redrawWires = () => {
      svgLayer.innerHTML = '';
      connectedWires.forEach(colorId => {
        const leftEl = this.canvasArea.querySelector(`.wire-port-item[data-side="left"][data-color="${colorId}"] .wire-node`);
        const rightEl = this.canvasArea.querySelector(`.wire-port-item[data-side="right"][data-color="${colorId}"] .wire-node`);
        if (!leftEl || !rightEl) return;

        const containerRect = svgLayer.getBoundingClientRect();
        const lRect = leftEl.getBoundingClientRect();
        const rRect = rightEl.getBoundingClientRect();

        const x1 = lRect.left + lRect.width / 2 - containerRect.left;
        const y1 = lRect.top + lRect.height / 2 - containerRect.top;
        const x2 = rRect.left + rRect.width / 2 - containerRect.left;
        const y2 = rRect.top + rRect.height / 2 - containerRect.top;

        const colorObj = colors.find(c => c.id === colorId);
        const hex = colorObj ? colorObj.hex : '#fff';

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', hex);
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('filter', 'drop-shadow(0 0 6px ' + hex + ')');
        svgLayer.appendChild(line);
      });
    };

    leftPorts.forEach(port => {
      port.addEventListener('click', () => {
        const color = port.getAttribute('data-color');
        if (connectedWires.has(color)) return; // already connected

        // Deselect previous
        leftPorts.forEach(p => p.classList.remove('selected-wire'));
        port.classList.add('selected-wire');
        selectedLeft = color;
        this.audio.playClick();
      });
    });

    rightPorts.forEach(port => {
      port.addEventListener('click', () => {
        if (!selectedLeft) return;
        const rightColor = port.getAttribute('data-color');

        if (rightColor === selectedLeft) {
          // Success match!
          connectedWires.add(selectedLeft);
          this.audio.playWireSnap();

          const led = document.getElementById(`led-right-${rightColor}`);
          if (led) {
            led.classList.add('active');
            led.style.background = '#76ff03';
            led.style.boxShadow = '0 0 10px #76ff03';
          }

          leftPorts.forEach(p => p.classList.remove('selected-wire'));
          selectedLeft = null;
          redrawWires();

          if (connectedWires.size === colors.length) {
            setTimeout(() => this.finishTask(), 400);
          }
        } else {
          // Wrong wire color
          this.audio.playTaskError();
          port.classList.add('error-shake');
          setTimeout(() => port.classList.remove('error-shake'), 400);
        }
      });
    });

    // Resize listener for SVG wires
    window.addEventListener('resize', redrawWires, { once: true });
  }

  // ================= 2. CLEAR WATER FILTER SEDIMENT TASK =================

  setupFilterDebrisTask() {
    this.stationIcon.innerText = '💧';
    this.titleText.innerText = 'CLEAR WATER FILTER SEDIMENT // ECLSS RECYCLER';
    this.instruction.innerText = 'Click the moon dust and ice sediment chunks to vacuum them out!';

    const totalDebris = 6;
    let clearedCount = 0;

    this.canvasArea.innerHTML = `
      <div class="debris-task-container">
        <div class="debris-pipe-chamber" id="debris-chamber">
          <div class="water-flow-indicator"></div>
          <!-- Debris chunks injected dynamically -->
        </div>
        <div class="debris-footer">
          <div class="debris-counter">SEDIMENT BLOCKS REMOVED: <span id="debris-count-val" style="color: #76ff03; font-weight: 900;">0 / ${totalDebris}</span></div>
          <button id="btn-flush-water" class="btn-flush-water disabled" disabled>PURGE & FLUSH FILTER 🌊</button>
        </div>
      </div>
    `;

    const chamber = document.getElementById('debris-chamber');
    const counterVal = document.getElementById('debris-count-val');
    const btnFlush = document.getElementById('btn-flush-water');

    const debrisPositions = [
      { left: '20%', top: '25%', size: '44px', label: 'MOON DUST', rot: '12deg' },
      { left: '45%', top: '18%', size: '38px', label: 'ICE GRIT', rot: '-20deg' },
      { left: '72%', top: '30%', size: '48px', label: 'MINERAL', rot: '35deg' },
      { left: '26%', top: '65%', size: '40px', label: 'SILICA', rot: '-10deg' },
      { left: '54%', top: '70%', size: '46px', label: 'REGOLITH', rot: '18deg' },
      { left: '78%', top: '62%', size: '36px', label: 'SLAG', rot: '-30deg' }
    ];

    debrisPositions.forEach((pos, idx) => {
      const rock = document.createElement('div');
      rock.className = 'debris-chunk';
      rock.style.left = pos.left;
      rock.style.top = pos.top;
      rock.style.width = pos.size;
      rock.style.height = pos.size;
      rock.style.transform = `rotate(${pos.rot})`;
      rock.innerHTML = `<span class="debris-label">${pos.label}</span>`;

      rock.addEventListener('click', () => {
        this.audio.playDebrisPop();
        rock.classList.add('crumb-shatter');
        clearedCount++;
        counterVal.innerText = `${clearedCount} / ${totalDebris}`;

        setTimeout(() => rock.remove(), 250);

        if (clearedCount >= totalDebris) {
          btnFlush.classList.remove('disabled');
          btnFlush.removeAttribute('disabled');
          btnFlush.classList.add('ready-flush');
        }
      });

      chamber.appendChild(rock);
    });

    btnFlush.addEventListener('click', () => {
      this.audio.playChime();
      btnFlush.innerText = 'FLUSHING PIPES...';
      setTimeout(() => this.finishTask(), 500);
    });
  }

  // ================= 3. DIVERT POWER SLIDERS TASK =================

  setupDivertPowerTask() {
    this.stationIcon.innerText = '⚡';
    this.titleText.innerText = 'DIVERT POWER SLIDERS // ELECTRICAL DISTRIBUTION';
    this.instruction.innerText = 'Slide all 4 power breakers into the highlighted GREEN safety notches!';

    const channels = [
      { id: 'o2', name: 'O₂ SCRUBBERS', target: 75, current: 20 },
      { id: 'heat', name: 'CABIN HEAT', target: 60, current: 15 },
      { id: 'comms', name: 'RADIO DISH', target: 80, current: 30 },
      { id: 'life', name: 'BATTERY CHARGE', target: 50, current: 10 }
    ];

    this.canvasArea.innerHTML = `
      <div class="power-sliders-container">
        ${channels.map(ch => `
          <div class="slider-channel-box" data-ch="${ch.id}">
            <div class="channel-header">
              <span class="ch-name">${ch.name}</span>
              <span class="ch-val" id="val-${ch.id}">${ch.current}%</span>
            </div>
            <div class="slider-track-wrap">
              <div class="slider-target-zone" style="bottom: ${ch.target - 10}%; height: 20%;"></div>
              <input type="range" class="vertical-power-slider" id="slider-${ch.id}" min="0" max="100" value="${ch.current}">
            </div>
            <div class="slider-led-status" id="led-${ch.id}">OFFLINE</div>
          </div>
        `).join('')}
      </div>
    `;

    const checkAllAligned = () => {
      let allLocked = true;
      channels.forEach(ch => {
        const slider = document.getElementById(`slider-${ch.id}`);
        const val = parseInt(slider.value, 10);
        const inZone = Math.abs(val - ch.target) <= 8;
        if (!inZone) allLocked = false;
      });

      if (allLocked) {
        setTimeout(() => this.finishTask(), 500);
      }
    };

    channels.forEach(ch => {
      const slider = document.getElementById(`slider-${ch.id}`);
      const valText = document.getElementById(`val-${ch.id}`);
      const led = document.getElementById(`led-${ch.id}`);

      slider.addEventListener('input', () => {
        const val = parseInt(slider.value, 10);
        valText.innerText = `${val}%`;

        const inZone = Math.abs(val - ch.target) <= 8;
        if (inZone) {
          led.innerText = 'LOCKED';
          led.classList.add('aligned');
          this.audio.playSliderClick();
        } else {
          led.innerText = 'ALIGNING';
          led.classList.remove('aligned');
        }

        checkAllAligned();
      });
    });
  }

  // ================= 4. ALIGN RADIO FREQUENCY TASK =================

  setupFrequencyTask() {
    this.stationIcon.innerText = '📡';
    this.titleText.innerText = 'ALIGN ANTENNA FREQUENCY // ROVER COMMS LINK';
    this.instruction.innerText = 'Turn frequency dial until the CYAN wave matches the GREEN target signal!';

    const targetFreq = 104.5;
    let currentFreq = 72.0;

    this.canvasArea.innerHTML = `
      <div class="freq-task-container">
        <div class="oscilloscope-screen">
          <canvas id="scope-canvas" width="600" height="200"></canvas>
          <div class="scope-legend">
            <span style="color: #76ff03;">● GREEN: Rover Beacon (104.5 MHz)</span>
            <span style="color: #00e5ff; margin-left: 14px;">● CYAN: Your Lander Antenna</span>
          </div>
        </div>

        <div class="freq-controls-bar">
          <span class="freq-label">FREQUENCY:</span>
          <input type="range" id="freq-slider" min="60" max="150" step="0.5" value="${currentFreq}">
          <span id="freq-display" class="freq-display">${currentFreq.toFixed(1)} MHz</span>
          <button id="btn-lock-signal" class="btn-lock-signal disabled" disabled>LOCK SIGNAL 🔒</button>
        </div>
      </div>
    `;

    const canvas = document.getElementById('scope-canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('freq-slider');
    const display = document.getElementById('freq-display');
    const btnLock = document.getElementById('btn-lock-signal');

    let animId = null;
    let phase = 0;

    const drawScope = () => {
      ctx.fillStyle = '#050b14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Green target wave
      ctx.strokeStyle = '#76ff03';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * 0.05 + phase) * 45;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Cyan player wave
      const freqDelta = Math.abs(currentFreq - targetFreq);
      const isLocked = freqDelta <= 1.5;

      ctx.strokeStyle = isLocked ? '#76ff03' : '#00e5ff';
      ctx.lineWidth = isLocked ? 3.5 : 2;
      ctx.beginPath();
      const waveSpeed = 0.02 + (currentFreq * 0.0003);
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 + Math.sin(x * (0.05 * (currentFreq / targetFreq)) + phase) * 45;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += 0.06;
      if (!this.isCompleted) {
        animId = requestAnimationFrame(drawScope);
      }
    };

    drawScope();

    slider.addEventListener('input', () => {
      currentFreq = parseFloat(slider.value);
      display.innerText = `${currentFreq.toFixed(1)} MHz`;
      this.audio.playSliderClick();

      const freqDelta = Math.abs(currentFreq - targetFreq);
      if (freqDelta <= 1.5) {
        display.style.color = '#76ff03';
        btnLock.classList.remove('disabled');
        btnLock.removeAttribute('disabled');
        btnLock.innerText = 'LOCK SIGNAL (100% MATCH) ✓';
      } else {
        display.style.color = '#00e5ff';
        btnLock.classList.add('disabled');
        btnLock.setAttribute('disabled', 'true');
        btnLock.innerText = 'LOCK SIGNAL 🔒';
      }
    });

    btnLock.addEventListener('click', () => {
      if (animId) cancelAnimationFrame(animId);
      this.finishTask();
    });
  }

  // ================= 5. SIMON SAYS REACTOR MEMORY KEYPAD TASK =================

  setupSimonSaysTask() {
    this.stationIcon.innerText = '🍃';
    this.titleText.innerText = 'REACTOR MEMORY KEYPAD // CO₂ SCRUBBER CYCLE';
    this.instruction.innerText = 'Watch the flashing sequence, then repeat the pattern!';

    const pads = [
      { id: 0, color: '#00e5ff', label: 'CYAN' },
      { id: 1, color: '#ffd54f', label: 'YELLOW' },
      { id: 2, color: '#76ff03', label: 'GREEN' },
      { id: 3, color: '#ef4444', label: 'RED' }
    ];

    // 3-step sequence
    const targetSeq = [
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 4)
    ];

    let playerStep = 0;
    let isShowingSequence = true;

    this.canvasArea.innerHTML = `
      <div class="simon-task-container">
        <div class="simon-status-header">
          <span id="simon-status-text" class="simon-status-text">MEMORIZE THE PATTERN...</span>
          <div class="simon-progress-dots">
            <span class="step-dot" id="dot-0"></span>
            <span class="step-dot" id="dot-1"></span>
            <span class="step-dot" id="dot-2"></span>
          </div>
        </div>

        <div class="simon-keypad-grid">
          ${pads.map(p => `
            <button class="simon-pad" data-id="${p.id}" id="pad-${p.id}" style="border-color: ${p.color};">
              <span class="pad-light" style="background: ${p.color};"></span>
              <span class="pad-label" style="color: ${p.color};">${p.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const statusText = document.getElementById('simon-status-text');

    const flashPad = (padId, callback) => {
      const padEl = document.getElementById(`pad-${padId}`);
      if (!padEl) return;
      padEl.classList.add('pad-active');
      this.audio.playKeypadTone(padId);

      setTimeout(() => {
        padEl.classList.remove('pad-active');
        if (callback) setTimeout(callback, 200);
      }, 400);
    };

    const playSequence = () => {
      isShowingSequence = true;
      statusText.innerText = 'MEMORIZE THE FLASHING PATTERN...';
      let i = 0;
      const step = () => {
        if (i < targetSeq.length) {
          flashPad(targetSeq[i], () => {
            i++;
            step();
          });
        } else {
          isShowingSequence = false;
          statusText.innerText = 'YOUR TURN: REPEAT THE 3-STEP CODE!';
          statusText.style.color = '#76ff03';
        }
      };
      setTimeout(step, 600);
    };

    playSequence();

    const padButtons = this.canvasArea.querySelectorAll('.simon-pad');
    padButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isShowingSequence || this.isCompleted) return;

        const clickedId = parseInt(btn.getAttribute('data-id'), 10);
        flashPad(clickedId);

        if (clickedId === targetSeq[playerStep]) {
          // Correct click
          const dot = document.getElementById(`dot-${playerStep}`);
          if (dot) dot.classList.add('done');
          playerStep++;

          if (playerStep === targetSeq.length) {
            statusText.innerText = 'PATTERN VERIFIED! REACTOR FLUSHED!';
            setTimeout(() => this.finishTask(), 450);
          }
        } else {
          // Wrong button!
          this.audio.playTaskError();
          statusText.innerText = 'INCORRECT CODE! RE-INITIALIZING...';
          statusText.style.color = '#ef4444';
          playerStep = 0;
          for (let d = 0; d < 3; d++) {
            const dt = document.getElementById(`dot-${d}`);
            if (dt) dt.classList.remove('done');
          }
          setTimeout(playSequence, 1200);
        }
      });
    });
  }
}

window.AmongUsTaskManager = AmongUsTaskManager;
