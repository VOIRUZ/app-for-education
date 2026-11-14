// ============================================================================
// MOON WATER RESEARCH & SURVIVAL ADVENTURE
// Interactive Scientific Mini-Games & Experiment Simulators
// Child-friendly (7-13), Educational, Visual, Engaging
// ============================================================================

class ExperimentEngine {
  constructor(audio) {
    this.audio = audio;
    this.container = document.getElementById('experiment-modal');
    this.contentEl = document.getElementById('experiment-content');
    this.activeExperimentId = null;
    this.onCompleteCallback = null;
  }

  show(experimentId, onComplete) {
    this.activeExperimentId = experimentId;
    this.onCompleteCallback = onComplete;
    this.container.classList.remove('hidden');
    this.audio.playSwish();

    switch (experimentId) {
      case 'electrolysis':
        this.renderElectrolysis();
        break;
      case 'power_management':
        this.renderPowerManagement();
        break;
      case 'water_filtration':
        this.renderWaterFiltration();
        break;
      case 'antenna_puzzle':
        this.renderAntennaPuzzle();
        break;
      case 'co2_scrubber':
        this.renderCO2Scrubber();
        break;
      case 'fuel_cell':
        this.renderFuelCell();
        break;
      case 'lunar_water_lab':
        this.renderLunarWaterLab();
        break;
      default:
        this.contentEl.innerHTML = `<p>Experiment ready.</p>`;
    }
  }

  hide() {
    this.container.classList.add('hidden');
    this.activeExperimentId = null;
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  // 1. DAY 1: ELECTROLYSIS WATER SPLITTER
  renderElectrolysis() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">CHEMISTRY / ECLSS LIFE SUPPORT</div>
        <h2>⚡ ELECTROLYSIS: WATER-SPLITTING REACTOR</h2>
        <p class="exp-desc">
          Water molecules (<strong>H₂O</strong>) contain hydrogen and oxygen. Connect the water hose and power cable, then activate the electric current to split water into breathable oxygen!
        </p>

        <div class="reactor-diagram">
          <div class="reactor-chamber">
            <div class="electrode anode" id="anode-col">
              <span class="elec-label">+ ANODE (O₂)</span>
              <div class="bubble-stream" id="o2-bubbles"></div>
              <div class="gas-tank"><span id="o2-output">0 L</span></div>
            </div>
            <div class="water-core" id="water-level">
              <span class="h2o-label">LIQUID H₂O</span>
            </div>
            <div class="electrode cathode" id="cathode-col">
              <span class="elec-label">- CATHODE (H₂)</span>
              <div class="bubble-stream" id="h2-bubbles"></div>
              <div class="gas-tank"><span id="h2-output">0 L</span></div>
            </div>
          </div>
        </div>

        <div class="exp-controls">
          <button id="btn-connect-water" class="btn-subaction">🚰 1. Connect Water Line</button>
          <button id="btn-connect-power" class="btn-subaction" disabled>🔌 2. Connect 28V Power</button>
          <button id="btn-run-electrolysis" class="btn-primary" disabled>⚡ 3. ACTIVATE CURRENT</button>
        </div>

        <div class="science-callout" id="exp-status">
          Step 1: Click "Connect Water Line" to fill the reaction chamber.
        </div>
      </div>
    `;

    let waterConnected = false;
    let powerConnected = false;

    const btnWater = document.getElementById('btn-connect-water');
    const btnPower = document.getElementById('btn-connect-power');
    const btnRun = document.getElementById('btn-run-electrolysis');
    const statusText = document.getElementById('exp-status');

    btnWater.addEventListener('click', () => {
      this.audio.playClick();
      waterConnected = true;
      btnWater.disabled = true;
      btnWater.classList.add('completed');
      btnPower.disabled = false;
      document.getElementById('water-level').style.background = 'rgba(0, 176, 255, 0.45)';
      statusText.innerHTML = `✅ Water Line Locked! Now connect the 28V electrical bus.`;
    });

    btnPower.addEventListener('click', () => {
      this.audio.playClick();
      powerConnected = true;
      btnPower.disabled = true;
      btnPower.classList.add('completed');
      btnRun.disabled = false;
      statusText.innerHTML = `✅ Power Grid Synchronized! Ready to split water molecules. Click "ACTIVATE CURRENT"!`;
    });

    btnRun.addEventListener('click', () => {
      this.audio.playDiscovery();
      this.audio.playBubbleFizz();
      btnRun.disabled = true;

      // Start bubble animations
      document.getElementById('o2-bubbles').innerHTML = `
        <div class="bubble b1"></div><div class="bubble b2"></div><div class="bubble b3"></div>
      `;
      document.getElementById('h2-bubbles').innerHTML = `
        <div class="bubble b1"></div><div class="bubble b2"></div><div class="bubble b3"></div>
      `;

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        document.getElementById('o2-output').innerText = `${Math.round(progress * 0.35)} L O₂`;
        document.getElementById('h2-output').innerText = `${Math.round(progress * 0.7)} L H₂`;

        if (progress >= 100) {
          clearInterval(interval);
          statusText.innerHTML = `
            🎉 <strong>ELECTROLYSIS SUCCESSFUL!</strong><br>
            Chemical equation: <code>2H₂O + Electricity → 2H₂ + O₂</code><br>
            Breathable oxygen is now filling the cabin life support tanks!
          `;
          setTimeout(() => this.hide(), 2400);
        }
      }, 70);
    });
  }

  // 2. DAY 2: SOLAR POWER GRID & LOAD BALANCER
  renderPowerManagement() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">ELECTRICAL ENGINEERING / SOLAR DYNAMICS</div>
        <h2>☀️ SOLAR ARRAY & POWER LOAD BALANCER</h2>
        <p class="exp-desc">
          Damaged solar panels produce only <strong>1,800 Watts</strong>. If your active devices draw more power than the panels produce, batteries will drain! Toggle the devices to balance the grid safely.
        </p>

        <div class="power-meter-box">
          <div class="power-bar-row">
            <span>SOLAR GENERATION:</span>
            <strong style="color: #ffd54f;">1,800 W</strong>
          </div>
          <div class="power-bar-row">
            <span>TOTAL DRAW:</span>
            <strong id="total-draw-val" style="color: #ff5252;">2,400 W</strong>
          </div>
          <div class="power-bar-row">
            <span>NET BATTERY CHARGE RATE:</span>
            <strong id="net-rate-val" style="color: #ff5252;">-600 W (DRAINING!)</strong>
          </div>
        </div>

        <div class="device-toggle-list">
          <div class="device-toggle-item">
            <label>
              <input type="checkbox" id="dev-o2" checked>
              <strong>OXYGEN GENERATOR (900 W)</strong> — Vital for breathing
            </label>
          </div>
          <div class="device-toggle-item">
            <label>
              <input type="checkbox" id="dev-heat" checked>
              <strong>CABIN THERMAL HEATER (1,200 W)</strong> — Keeps habitat at 21°C
            </label>
          </div>
          <div class="device-toggle-item">
            <label>
              <input type="checkbox" id="dev-pc" checked>
              <strong>SCIENCE & ENTERTAINMENT PC (300 W)</strong> — Non-essential
            </label>
          </div>
        </div>

        <div class="exp-controls">
          <button id="btn-confirm-power" class="btn-primary" disabled>CONFIRM SAFE POWER GRID</button>
        </div>

        <div class="science-callout" id="power-hint">
          Goal: Turn off non-essential systems until Total Draw is ≤ 1,800W so batteries don't drain!
        </div>
      </div>
    `;

    const chkO2 = document.getElementById('dev-o2');
    const chkHeat = document.getElementById('dev-heat');
    const chkPC = document.getElementById('dev-pc');
    const drawEl = document.getElementById('total-draw-val');
    const netEl = document.getElementById('net-rate-val');
    const btnConfirm = document.getElementById('btn-confirm-power');
    const hintEl = document.getElementById('power-hint');

    const updateGrid = () => {
      this.audio.playClick();
      let total = 0;
      if (chkO2.checked) total += 900;
      if (chkHeat.checked) total += 1200;
      if (chkPC.checked) total += 300;

      const net = 1800 - total;
      drawEl.innerText = `${total} W`;

      if (net < 0) {
        netEl.innerText = `${net} W (DRAINING!)`;
        netEl.style.color = '#ff5252';
        btnConfirm.disabled = true;
        hintEl.innerText = `⚠️ Total draw exceeds solar power! Uncheck low-priority devices.`;
      } else {
        netEl.innerText = `+${net} W (STABLE / CHARGING!)`;
        netEl.style.color = '#69f0ae';
        btnConfirm.disabled = false;
        hintEl.innerHTML = `✅ <strong>EXCELLENT!</strong> Electrical draw is within solar capacity. Batteries are protected!`;
      }
    };

    chkO2.addEventListener('change', updateGrid);
    chkHeat.addEventListener('change', updateGrid);
    chkPC.addEventListener('change', updateGrid);

    btnConfirm.addEventListener('click', () => {
      this.audio.playDiscovery();
      btnConfirm.disabled = true;
      hintEl.innerHTML = `🎉 <strong>GRID BALANCED!</strong> Energy priority policy saved into life-support computer.`;
      setTimeout(() => this.hide(), 1600);
    });
  }

  // 3. DAY 3: MULTI-STAGE WATER RECOVERY FILTRATION
  renderWaterFiltration() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">ENVIRONMENTAL RECYCLING / ECLSS</div>
        <h2>💧 MULTI-STAGE WATER PURIFIER</h2>
        <p class="exp-desc">
          Graywater contains regolith dust, organic flakes, and dissolved salts. Insert all 3 purification filters into the processor to produce 99.8% pure drinking water!
        </p>

        <div class="filter-assembly">
          <div class="filter-slot" id="slot-1" data-stage="1">
            <span class="slot-title">STAGE 1: PARTICULATE MESH</span>
            <button class="btn-slot" id="btn-insert-1">INSERT COARSE MESH</button>
          </div>
          <div class="filter-slot" id="slot-2" data-stage="2">
            <span class="slot-title">STAGE 2: ACTIVATED CHARCOAL</span>
            <button class="btn-slot" id="btn-insert-2" disabled>INSERT CHARCOAL</button>
          </div>
          <div class="filter-slot" id="slot-3" data-stage="3">
            <span class="slot-title">STAGE 3: REVERSE OSMOSIS</span>
            <button class="btn-slot" id="btn-insert-3" disabled>INSERT MEMBRANE</button>
          </div>
        </div>

        <div class="water-quality-display">
          <span>WATER PURITY:</span>
          <strong id="water-purity-val" style="color: #ff9800;">45% (DIRTY GRAYWATER)</strong>
        </div>

        <div class="exp-controls">
          <button id="btn-run-pump" class="btn-primary" disabled>🚰 ENGAGE PURIFICATION PUMP</button>
        </div>

        <div class="science-callout" id="filter-hint">
          Click "INSERT COARSE MESH" to remove floating hair and dust particles.
        </div>
      </div>
    `;

    const b1 = document.getElementById('btn-insert-1');
    const b2 = document.getElementById('btn-insert-2');
    const b3 = document.getElementById('btn-insert-3');
    const btnPump = document.getElementById('btn-run-pump');
    const purityEl = document.getElementById('water-purity-val');
    const hintEl = document.getElementById('filter-hint');

    b1.addEventListener('click', () => {
      this.audio.playClick();
      b1.disabled = true;
      b1.innerText = '✅ INSTALLED';
      b2.disabled = false;
      purityEl.innerText = '65% (PARTICULATES REMOVED)';
      hintEl.innerText = 'Coarse particles trapped! Now insert Stage 2 Activated Charcoal to absorb odors.';
    });

    b2.addEventListener('click', () => {
      this.audio.playClick();
      b2.disabled = true;
      b2.innerText = '✅ INSTALLED';
      b3.disabled = false;
      purityEl.innerText = '82% (ORGANICS FILTERED)';
      hintEl.innerText = 'Charcoal bed ready! Finally, insert the Stage 3 microscopic Reverse Osmosis membrane.';
    });

    b3.addEventListener('click', () => {
      this.audio.playClick();
      b3.disabled = true;
      b3.innerText = '✅ INSTALLED';
      btnPump.disabled = false;
      purityEl.innerText = '95% (MEMBRANE LOADED)';
      hintEl.innerText = 'All 3 filter stages locked! Click "ENGAGE PURIFICATION PUMP" to cycle the water.';
    });

    btnPump.addEventListener('click', () => {
      this.audio.playDiscovery();
      btnPump.disabled = true;
      purityEl.innerText = '99.8% ULTRA-PURE (DRINKING SAFE!)';
      purityEl.style.color = '#00e5ff';
      hintEl.innerHTML = `🎉 <strong>WATER RECOVERED!</strong> 28 liters of clean, safe water transferred to primary reservoir.`;
      setTimeout(() => this.hide(), 1800);
    });
  }

  // 4. DAY 4: PARABOLIC ANTENNA ALIGNMENT PUZZLE
  renderAntennaPuzzle() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">RADIO PHYSICS & TELEMETRY</div>
        <h2>📡 S-BAND PARABOLIC ANTENNA TUNER</h2>
        <p class="exp-desc">
          Radio waves travel in straight lines through space. Rotate the azimuth angle until the dish points directly at Asriel’s rover on Shackleton Ridge to clear the static!
        </p>

        <div class="antenna-scope">
          <div class="waveform-box">
            <div class="oscilloscope-line" id="osc-wave"></div>
            <span class="carrier-text" id="carrier-status">CARRIER: NO SIGNAL (STATIC)</span>
          </div>
          <div class="signal-bar-box">
            <span>SIGNAL STRENGTH:</span>
            <div class="sig-track"><div class="sig-fill" id="sig-fill" style="width: 15%;"></div></div>
            <strong id="sig-pct">15%</strong>
          </div>
        </div>

        <div class="slider-control">
          <label>ANTENNA AZIMUTH BEARING: <strong id="bearing-val">110°</strong></label>
          <input type="range" id="bearing-slider" min="60" max="220" value="110" step="1">
        </div>

        <div class="exp-controls">
          <button id="btn-lock-signal" class="btn-primary" disabled>🔒 LOCK TELEMETRY CARRIER</button>
        </div>

        <div class="science-callout" id="antenna-hint">
          Drag the slider slowly toward 155° to align the dish with the rover's coordinates!
        </div>
      </div>
    `;

    const slider = document.getElementById('bearing-slider');
    const bearingVal = document.getElementById('bearing-val');
    const sigFill = document.getElementById('sig-fill');
    const sigPct = document.getElementById('sig-pct');
    const carrierText = document.getElementById('carrier-status');
    const btnLock = document.getElementById('btn-lock-signal');
    const hintEl = document.getElementById('antenna-hint');

    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      bearingVal.innerText = `${val}°`;

      // Target is 155 degrees
      const diff = Math.abs(val - 155);
      const signal = Math.max(5, Math.min(100, Math.round(100 - diff * 3.5)));

      sigFill.style.width = `${signal}%`;
      sigPct.innerText = `${signal}%`;

      if (signal > 88) {
        this.audio.playChime();
        carrierText.innerText = 'CARRIER: 5 BARS (ASRIEL ROVER LOCKED!)';
        carrierText.style.color = '#76ff03';
        sigFill.style.background = '#76ff03';
        btnLock.disabled = false;
        hintEl.innerHTML = `✅ <strong>PERFECT ALIGNMENT!</strong> Radio beam locked. Click "LOCK TELEMETRY"!`;
      } else {
        carrierText.innerText = 'CARRIER: WEAK SIGNAL (COSMIC STATIC)';
        carrierText.style.color = '#ff9800';
        sigFill.style.background = '#ff9800';
        btnLock.disabled = true;
      }
    });

    btnLock.addEventListener('click', () => {
      this.audio.playRadioSquelch();
      this.audio.playDiscovery();
      btnLock.disabled = true;
      hintEl.innerHTML = `🎉 <strong>TWO-WAY AUDIO RESTORED!</strong> Radio channel cleared.`;
      setTimeout(() => this.hide(), 1600);
    });
  }

  // 5. DAY 5: ZEOLITE CO₂ AIR SCRUBBER
  renderCO2Scrubber() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">ATMOSPHERIC RECYCLING / CDRA</div>
        <h2>🍃 MOLECULAR ZEOLITE CO₂ SCRUBBER</h2>
        <p class="exp-desc">
          Cabin CO₂ is at dangerous levels (<strong>1.8%</strong>). Zeolite crystals have microscopic pore cavities that trap CO₂ while allowing O₂ to pass. Engage the desiccant heaters and set the air circulation fan!
        </p>

        <div class="air-quality-gauges">
          <div class="gauge-card">
            <span>CARBON DIOXIDE (CO₂):</span>
            <strong id="co2-val" style="color: #ff5252;">1.8% (DANGEROUS)</strong>
          </div>
          <div class="gauge-card">
            <span>OXYGEN (O₂):</span>
            <strong style="color: #00e5ff;">20.4% (NORMAL)</strong>
          </div>
        </div>

        <div class="exp-controls">
          <button id="btn-purge-bed" class="btn-subaction">🔥 1. Heat Zeolite Bed to 180°C</button>
          <button id="btn-fan-speed" class="btn-subaction" disabled>💨 2. Set Circulation Fan to MAX</button>
          <button id="btn-scrub-air" class="btn-primary" disabled>🍃 3. CYCLE CABIN AIR</button>
        </div>

        <div class="science-callout" id="co2-hint">
          Click "Heat Zeolite Bed" to regenerate the molecular sieve crystals.
        </div>
      </div>
    `;

    const b1 = document.getElementById('btn-purge-bed');
    const b2 = document.getElementById('btn-fan-speed');
    const b3 = document.getElementById('btn-scrub-air');
    const co2Val = document.getElementById('co2-val');
    const hintEl = document.getElementById('co2-hint');

    b1.addEventListener('click', () => {
      this.audio.playClick();
      b1.disabled = true;
      b1.innerText = '✅ ZEOLITE HEATED';
      b2.disabled = false;
      hintEl.innerText = 'Zeolite crystals purged of moisture! Now switch the blower fan to MAX.';
    });

    b2.addEventListener('click', () => {
      this.audio.playClick();
      b2.disabled = true;
      b2.innerText = '✅ FAN RUNNING (3,200 RPM)';
      b3.disabled = false;
      hintEl.innerText = 'Air velocity nominal! Click "CYCLE CABIN AIR" to trap the CO2.';
    });

    b3.addEventListener('click', () => {
      this.audio.playDiscovery();
      b3.disabled = true;

      let co2 = 1.8;
      const interval = setInterval(() => {
        co2 -= 0.15;
        if (co2 <= 0.35) {
          co2 = 0.35;
          clearInterval(interval);
          co2Val.innerText = `${co2.toFixed(2)}% (SAFE & FRESH!)`;
          co2Val.style.color = '#76ff03';
          hintEl.innerHTML = `🎉 <strong>AIR RESTORED!</strong> Synthetic zeolite trapped all toxic CO₂. Safe breathing resumed!`;
          setTimeout(() => this.hide(), 2000);
        } else {
          co2Val.innerText = `${co2.toFixed(2)}%`;
        }
      }, 100);
    });
  }

  // 6. DAY 6: EMERGENCY FUEL CELL BURST
  renderFuelCell() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">REGENERATIVE CLEAN ENERGY</div>
        <h2>🔋 REGENERATIVE HYDROGEN FUEL CELL</h2>
        <p class="exp-desc">
          Combine the hydrogen byproduct stored on Day 1 with remaining oxygen to generate an immediate burst of electricity and fresh drinking water!
        </p>

        <div class="fuel-cell-reactor">
          <div class="fuel-input">HYDROGEN (H₂) INLET: 15 L</div>
          <div class="plus-sign">+</div>
          <div class="fuel-input">OXYGEN (O₂) INLET: 8 L</div>
          <div class="arrow-sign">➔</div>
          <div class="fuel-output">600W POWER + 3L PURE WATER</div>
        </div>

        <div class="exp-controls">
          <button id="btn-fire-fuel-cell" class="btn-primary">⚡ INITIATE CATALYTIC BURST</button>
        </div>

        <div class="science-callout" id="fuel-hint">
          Reaction formula: <code>2H₂ + O₂ → 2H₂O + Electricity + Heat</code>
        </div>
      </div>
    `;

    const btnFire = document.getElementById('btn-fire-fuel-cell');
    const hintEl = document.getElementById('fuel-hint');

    btnFire.addEventListener('click', () => {
      this.audio.playDiscovery();
      btnFire.disabled = true;
      hintEl.innerHTML = `🎉 <strong>FUEL CELL IGNITED!</strong> Power surge injected into batteries (+18%) and 3L pure water created!`;
      setTimeout(() => this.hide(), 1800);
    });
  }

  // 7. DAY 7 ENDING B: LUNAR WATER-ICE SPECTROMETER TEST
  renderLunarWaterLab() {
    this.contentEl.innerHTML = `
      <div class="exp-card">
        <div class="exp-badge">PLANETARY SCIENCE / LUNAR WATER DISCOVERY</div>
        <h2>🔬 LUNAR WATER-ICE SPECTROMETRIC LAB</h2>
        <p class="exp-desc">
          A core sample from the permanently shadowed polar crater is loaded in the chamber. Fire the infrared laser to test for the molecular signature of water!
        </p>

        <div class="spectrometer-view">
          <div class="laser-beam-anim" id="laser-visual"></div>
          <div class="spectrum-chart">
            <div class="absorption-peak" id="water-peak"></div>
            <span class="wavelength-tag">3.0 MICRON WATER-ICE ABSORPTION BAND</span>
          </div>
        </div>

        <div class="exp-controls">
          <button id="btn-fire-laser" class="btn-primary">🔴 FIRE INFRARED SPECTROMETER</button>
          <button id="btn-condense-water" class="btn-subaction" disabled>💧 CONDENSE WATER DROPLET</button>
        </div>

        <div class="science-callout" id="lab-hint">
          Click "FIRE INFRARED SPECTROMETER" to scan the frozen regolith core.
        </div>
      </div>
    `;

    const btnLaser = document.getElementById('btn-fire-laser');
    const btnCondense = document.getElementById('btn-condense-water');
    const hintEl = document.getElementById('lab-hint');
    const laserVis = document.getElementById('laser-visual');
    const peak = document.getElementById('water-peak');

    btnLaser.addEventListener('click', () => {
      this.audio.playLaserDrill();
      btnLaser.disabled = true;
      laserVis.style.background = 'linear-gradient(90deg, #ff1744, #00e5ff)';
      peak.style.height = '75px';
      peak.style.background = '#00e5ff';
      btnCondense.disabled = false;
      hintEl.innerHTML = `
        ✅ <strong>WATER CONFIRMED!</strong> Absorption dip at 3.0 microns proves water molecules are frozen in the regolith!
      `;
    });

    btnCondense.addEventListener('click', () => {
      this.audio.playDiscovery();
      btnCondense.disabled = true;
      hintEl.innerHTML = `
        🎉 <strong>HISTORIC MOMENT!</strong> A pure droplet of liquid lunar water has condensed in the chamber tube!
      `;
      setTimeout(() => this.hide(), 2200);
    });
  }
}
