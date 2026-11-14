// 2D Illustrated Canvas Renderer
// Hand-crafted Illustrated Environments, Expressive Characters & Atmospheric Martian Scenes
// Inspired by Henry Stickmin & Indie Narrative Adventures (Warm, Accessible, Character-Focused)

export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentRoom = 'command'; // 'command', 'common', 'greenhouse', 'lifesupport', 'exterior'
    this.animTime = 0;
    this.interactiveObjects = [];
    this.hoveredObject = null;
    this.dustParticles = [];
    this.weatherEffect = 'clear'; // 'clear', 'dust_storm', 'radiation'
    this.initDust();
  }

  initDust() {
    this.dustParticles = [];
    for (let i = 0; i < 70; i++) {
      this.dustParticles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 + 1,
        speedY: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  setRoom(roomKey) {
    this.currentRoom = roomKey;
  }

  setWeather(weather) {
    this.weatherEffect = weather;
  }

  resize() {
    const container = this.canvas.parentElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  render(dt = 0.016, gameState = null) {
    this.animTime += dt;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Save transform scale for responsive 1280x720 virtual canvas
    ctx.save();
    const scaleX = w / 1280;
    const scaleY = h / 720;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (w - 1280 * scale) / 2;
    const offsetY = (h - 720 * scale) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw Current Illustrated Room
    switch (this.currentRoom) {
      case 'command':
        this.drawCommandHub(ctx);
        break;
      case 'common':
        this.drawCommonRoom(ctx);
        break;
      case 'greenhouse':
        this.drawGreenhouse(ctx);
        break;
      case 'lifesupport':
        this.drawLifeSupport(ctx);
        break;
      case 'exterior':
        this.drawExteriorMars(ctx);
        break;
      default:
        this.drawCommandHub(ctx);
    }

    // Weather / Atmospheric overlays
    if (this.currentRoom === 'exterior' || this.weatherEffect === 'dust_storm') {
      this.drawAtmosphericEffects(ctx);
    }

    // Interactive highlights & click targets
    this.drawInteractiveHighlights(ctx);

    ctx.restore();
  }

  // ================= 1. COMMAND HUB =================
  drawCommandHub(ctx) {
    // Wall backdrop - clean warm slate
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 520);
    wallGrad.addColorStop(0, '#1c2836');
    wallGrad.addColorStop(1, '#2c3e50');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, 1280, 560);

    // Floor
    this.drawOutpostFloor(ctx, '#34495e', '#2c3e50');

    // Large Panoramic Observation Window to Mars
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(140, 50, 680, 320, 24);
    ctx.clip();

    // Mars sky outside window
    this.drawMarsSky(ctx, 140, 50, 680, 320);
    // Red Martian horizon & craters
    this.drawMarsLandscape(ctx, 140, 220, 680, 150);

    // Window glass reflection & frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(180, 60);
    ctx.lineTo(340, 360);
    ctx.stroke();
    ctx.restore();

    // Reinforced Window Frame
    ctx.strokeStyle = '#4a627a';
    ctx.lineWidth = 12;
    ctx.strokeRoundRect(140, 50, 680, 320, 24);

    // Communications Desk & Computer Terminals
    ctx.fillStyle = '#1e2b37';
    ctx.beginPath();
    ctx.roundRect(860, 180, 360, 360, 16);
    ctx.fill();
    ctx.strokeStyle = '#3d566e';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Comms Monitors
    ctx.fillStyle = '#0a1520';
    ctx.fillRect(890, 210, 300, 150);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(890, 210, 300, 150);

    // Orbit Path Graphic on Screen
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(1040, 285, 90, 35, 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Mars dot & Caelum-4 ship dot
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(1040, 285, 14, 0, Math.PI * 2);
    ctx.fill();

    const shipAngle = this.animTime * 0.8;
    const shipX = 1040 + Math.cos(shipAngle) * 90;
    const shipY = 285 + Math.sin(shipAngle) * 35;
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(shipX, shipY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Monitor text
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('CAELUM-4 ORBITAL TRACKING', 905, 230);
    ctx.fillStyle = '#7f9bb3';
    ctx.font = '10px monospace';
    ctx.fillText('STATUS: PHASING BURN ACTIVE', 905, 345);

    // Holographic Mars Globe on Central Pedestal
    this.drawHoloGlobe(ctx, 480, 480);

    // Character: Commander Maya standing by observation port
    this.drawCharacterFigure(ctx, 300, 340, 'maya', 'Maya Chen', 'CMD');
  }

  // ================= 2. COMMON LIVING ROOM =================
  drawCommonRoom(ctx) {
    // Warm, welcoming habitat colors
    ctx.fillStyle = '#2b313d';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#404958', '#313844');

    // Warm ceiling lighting pendant
    ctx.save();
    const lampGlow = ctx.createRadialGradient(640, 60, 20, 640, 280, 480);
    lampGlow.addColorStop(0, 'rgba(255, 220, 160, 0.25)');
    lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lampGlow;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(640, 0);
    ctx.lineTo(640, 80);
    ctx.stroke();

    ctx.fillStyle = '#ffa726';
    ctx.beginPath();
    ctx.arc(640, 95, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bunk beds on left wall
    ctx.fillStyle = '#37474f';
    ctx.fillRect(60, 120, 220, 420);
    // Bed 1 (Top)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(80, 180, 180, 70);
    ctx.fillStyle = '#ff7043'; // warm orange blanket
    ctx.fillRect(120, 190, 130, 55);
    ctx.fillStyle = '#ffffff'; // pillow
    ctx.beginPath();
    ctx.roundRect(85, 195, 30, 45, 6);
    ctx.fill();

    // Bed 2 (Bottom)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(80, 360, 180, 70);
    ctx.fillStyle = '#42a5f5'; // blue blanket
    ctx.fillRect(120, 370, 130, 55);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(85, 375, 30, 45, 6);
    ctx.fill();

    // Corkboard with Earth Photos & Notes
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(360, 130, 320, 190);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 8;
    ctx.strokeRect(360, 130, 320, 190);

    // Photos pinned to board
    this.drawPolaroid(ctx, 390, 160, -0.08, '#4fc3f7', 'Iceland Crew');
    this.drawPolaroid(ctx, 490, 155, 0.05, '#81c784', 'Home Lawn');
    this.drawPolaroid(ctx, 590, 170, -0.04, '#ffb74d', 'Launch Day');

    // Central Dining Table with Mugs
    ctx.fillStyle = '#546e7a';
    ctx.beginPath();
    ctx.ellipse(660, 500, 190, 65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Coffee mugs with tiny animated steam
    this.drawCoffeeMug(ctx, 610, 485, '#e53935');
    this.drawCoffeeMug(ctx, 700, 495, '#00acc1');

    // Acoustic Guitar in corner
    this.drawGuitar(ctx, 1080, 320);

    // Character: Dr. Samira sitting relaxed
    this.drawCharacterFigure(ctx, 820, 380, 'samira', 'Samira Morales', 'BIO');
  }

  // ================= 3. GREENHOUSE / HYDROPONICS =================
  drawGreenhouse(ctx) {
    // Translucent biological pod with magenta grow lighting
    ctx.fillStyle = '#1c2e26';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#264235', '#1e332a');

    // Domed skylight looking at Mars sky
    ctx.save();
    ctx.beginPath();
    ctx.arc(640, 220, 460, Math.PI * 0.9, Math.PI * 0.1, true);
    ctx.lineTo(1280, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 100, 150, 0.08)';
    ctx.fill();
    ctx.restore();

    // Violet / Magenta LED Growth Racks
    for (let row = 0; row < 3; row++) {
      const rackY = 160 + row * 120;
      // Rack bar
      ctx.fillStyle = '#37474f';
      ctx.fillRect(160, rackY, 960, 20);

      // Pinkish-purple LED strips glowing
      const ledGlow = Math.sin(this.animTime * 2 + row) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(236, 64, 122, ${0.7 * ledGlow})`;
      ctx.shadowColor = '#ec407a';
      ctx.shadowBlur = 15;
      ctx.fillRect(170, rackY + 14, 940, 6);
      ctx.shadowBlur = 0;

      // Planter trays with lush greens
      ctx.fillStyle = '#2e7d32';
      for (let plant = 0; plant < 18; plant++) {
        const plantX = 190 + plant * 52;
        const plantH = 26 + (plant % 4) * 6;
        ctx.beginPath();
        ctx.ellipse(plantX, rackY + 50, 20, plantH, 0, Math.PI, 0);
        ctx.fill();

        // Tiny cherry tomatoes on row 2
        if (row === 1 && plant % 3 === 0) {
          ctx.fillStyle = '#e53935';
          ctx.beginPath();
          ctx.arc(plantX + 6, rackY + 38, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#2e7d32';
        }
      }

      // Hydroponic clear water tubes with animated bubbles
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(150, rackY + 60);
      ctx.lineTo(1130, rackY + 60);
      ctx.stroke();
    }

    // Nutrient Mixer Console
    ctx.fillStyle = '#2b3d33';
    ctx.beginPath();
    ctx.roundRect(80, 360, 180, 220, 12);
    ctx.fill();
    ctx.strokeStyle = '#43a047';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#81c784';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('NUTRIENT RECOVERY', 95, 390);
    ctx.fillText('PH: 6.4 | EC: 1.8', 95, 415);

    // Character: Dr. Samira or Liam
    this.drawCharacterFigure(ctx, 740, 350, 'samira', 'Samira Morales', 'BIO');
  }

  // ================= 4. LIFE SUPPORT & ENGINEERING =================
  drawLifeSupport(ctx) {
    // Industrial engineering hub
    ctx.fillStyle = '#222831';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#393e46', '#222831');

    // Overhead Heavy Conduit Pipes (Color coded: Blue=O2, Cyan=Water, Yellow=Power)
    this.drawConduitPipe(ctx, 0, 60, 1280, 18, '#0288d1', 'O2 DISTRIBUTION');
    this.drawConduitPipe(ctx, 0, 95, 1280, 16, '#00acc1', 'RECYCLED WATER');
    this.drawConduitPipe(ctx, 0, 128, 1280, 14, '#fbc02d', 'SOLAR BUS 400V');

    // THE MOXIE UNIT (Mars Oxygen ISRU Electrolysis Chamber)
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.roundRect(160, 200, 280, 340, 18);
    ctx.fill();
    ctx.strokeStyle = '#546e7a';
    ctx.lineWidth = 6;
    ctx.stroke();

    // MOXIE Electrolysis Inspection Port (Glowing warm orange inside)
    const moxiePulse = Math.sin(this.animTime * 4) * 0.15 + 0.85;
    ctx.fillStyle = `rgba(255, 112, 67, ${0.8 * moxiePulse})`;
    ctx.shadowColor = '#ff7043';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(300, 320, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Brass pressure valve gauge
    this.drawPressureGauge(ctx, 230, 240, 'BAR');
    this.drawPressureGauge(ctx, 370, 240, '°C');

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NASA MOXIE (O2 ISRU)', 300, 420);
    ctx.fillStyle = '#7f9bb3';
    ctx.font = '10px monospace';
    ctx.fillText('CORE TEMP: 792°C | 99.4% PURITY', 300, 440);
    ctx.textAlign = 'left';

    // Sabatier Water Recovery Unit
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.roundRect(520, 220, 260, 320, 16);
    ctx.fill();
    ctx.strokeStyle = '#00acc1';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#00acc1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('SABATIER WATER LOOP', 545, 255);
    ctx.fillStyle = '#80deea';
    ctx.font = '10px monospace';
    ctx.fillText('CATALYST: RUTHENIUM-TITANIA', 545, 280);
    ctx.fillText('EFFICIENCY: 98.4%', 545, 305);

    // Storage Water Level Tube
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(720, 320, 24, 180);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(722, 360, 20, 138); // water fill

    // Character: Dr. Liam Brooks tinkering with wrench
    this.drawCharacterFigure(ctx, 880, 330, 'liam', 'Liam Brooks', 'ENG');
  }

  // ================= 5. EXTERIOR MARS SURFACE =================
  drawExteriorMars(ctx) {
    // Vast red Martian Sky
    this.drawMarsSky(ctx, 0, 0, 1280, 440);

    // Distant Rugged Crater Ridges
    this.drawMarsLandscape(ctx, 0, 260, 1280, 240);

    // Outpost Dome Structure on left
    ctx.fillStyle = '#e0e6ed';
    ctx.beginPath();
    ctx.arc(220, 500, 240, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Outpost Airlock Door
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.roundRect(320, 380, 90, 160, 8);
    ctx.fill();
    ctx.strokeStyle = '#ff7043';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('AIRLOCK 1', 335, 400);

    // Photovoltaic Solar Array Farm on right ridge
    this.drawSolarArray(ctx, 840, 320, 160, 90);
    this.drawSolarArray(ctx, 1020, 300, 160, 90);

    // Ares Rover #1 parked on red dust
    this.drawMarsRover(ctx, 580, 420);

    // Weather warning beacon
    if (this.weatherEffect === 'dust_storm') {
      ctx.fillStyle = 'rgba(255, 34, 68, 0.25)';
      ctx.fillRect(0, 0, 1280, 720);
    }
  }

  // --- REUSABLE ILLUSTRATED ART COMPONENTS ---

  drawOutpostFloor(ctx, mainColor, darkColor) {
    ctx.fillStyle = mainColor;
    ctx.fillRect(0, 520, 1280, 200);

    // Perspective floor tiles
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;
    for (let x = -200; x < 1500; x += 140) {
      ctx.beginPath();
      ctx.moveTo(x, 520);
      ctx.lineTo(x + (x - 640) * 0.4, 720);
      ctx.stroke();
    }
    for (let y = 520; y < 720; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }
  }

  drawMarsSky(ctx, x, y, w, h) {
    const sky = ctx.createLinearGradient(x, y, x, y + h);
    if (this.weatherEffect === 'dust_storm') {
      sky.addColorStop(0, '#3a1f18');
      sky.addColorStop(0.5, '#5c2d20');
      sky.addColorStop(1, '#8b4513');
    } else {
      sky.addColorStop(0, '#120d18'); // near vacuum dark violet
      sky.addColorStop(0.5, '#4a2528');
      sky.addColorStop(1, '#9e4732'); // dusty pink-red horizon
    }
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // Earth in the sky (Pale Blue Dot)
    if (this.weatherEffect !== 'dust_storm') {
      ctx.fillStyle = '#64b5f6';
      ctx.shadowColor = '#64b5f6';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + w * 0.72, y + h * 0.28, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawMarsLandscape(ctx, x, y, w, h) {
    // Distant layered red hills
    ctx.fillStyle = '#6d2b1f';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let px = x; px <= x + w; px += 40) {
      const hillY = y + 40 + Math.sin(px * 0.008) * 25 + Math.cos(px * 0.02) * 12;
      ctx.lineTo(px, hillY);
    }
    ctx.lineTo(x + w, y + h);
    ctx.fill();

    // Foreground rolling dunes
    ctx.fillStyle = '#a0402c';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let px = x; px <= x + w; px += 30) {
      const duneY = y + 100 + Math.sin(px * 0.005 + 1) * 35;
      ctx.lineTo(px, duneY);
    }
    ctx.lineTo(x + w, y + h);
    ctx.fill();
  }

  drawHoloGlobe(ctx, cx, cy) {
    ctx.save();
    // Glowing pedestal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 40, cy, 80, 60);

    // Blue holographic light beam
    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 90, cy - 140);
    ctx.lineTo(cx + 90, cy - 140);
    ctx.lineTo(cx + 30, cy);
    ctx.closePath();
    ctx.fill();

    // Rotating Mars Globe Wireframe
    const rot = this.animTime * 0.5;
    ctx.shadowColor = '#ff7043';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#ff7043';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - 80, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Latitude rings
    ctx.beginPath();
    ctx.ellipse(cx, cy - 80, 50, 20 * Math.sin(rot), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawPolaroid(ctx, x, y, rot, pinColor, caption) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // White photo card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 75, 90);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;

    // Photo image
    ctx.fillStyle = '#90caf9';
    ctx.fillRect(6, 6, 63, 60);

    // Caption
    ctx.fillStyle = '#37474f';
    ctx.font = '8px cursive, sans-serif';
    ctx.fillText(caption, 8, 80);

    // Pushpin
    ctx.fillStyle = pinColor;
    ctx.beginPath();
    ctx.arc(37, 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawCoffeeMug(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, 22, 26, [0, 0, 6, 6]);
    ctx.fill();

    // Handle
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 24, y + 13, 8, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();

    // Steam wafting
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steamY = y - 6 - (this.animTime * 15 % 20);
    ctx.moveTo(x + 11, y - 2);
    ctx.quadraticCurveTo(x + 16, steamY + 8, x + 11, steamY);
    ctx.stroke();
  }

  drawGuitar(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.2);

    // Body
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.ellipse(0, 100, 36, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 45, 28, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soundhole
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(0, 65, 12, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(-6, -40, 12, 85);
    // Headstock
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-8, -60, 16, 22);

    ctx.restore();
  }

  drawConduitPipe(ctx, x, y, w, h, color, label) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x, y, w, 3);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(label, x + 200, y + h - 4);
    ctx.fillText(label, x + 700, y + h - 4);
  }

  drawPressureGauge(ctx, x, y, unit) {
    ctx.fillStyle = '#cfd8dc';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#455a64';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Needle
    const needleAngle = Math.sin(this.animTime + x) * 0.6 - 0.4;
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(needleAngle) * 18, y + Math.sin(needleAngle) * 18);
    ctx.stroke();

    ctx.fillStyle = '#37474f';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(unit, x, y + 15);
    ctx.textAlign = 'left';
  }

  drawSolarArray(ctx, x, y, w, h) {
    ctx.save();
    // Metal mounting leg
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h);
    ctx.lineTo(x + w * 0.5, y + h + 80);
    ctx.stroke();

    // Angled Blue Photovoltaic Panel
    ctx.fillStyle = '#1565c0';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - 20, y + h);
    ctx.lineTo(x - 20, y + h + 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dust particles on panels if storm
    if (this.weatherEffect === 'dust_storm') {
      ctx.fillStyle = 'rgba(160, 82, 45, 0.75)';
      ctx.fill();
    }
    ctx.restore();
  }

  drawMarsRover(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // 6 Big Rocker-Bogie Wheels
    ctx.fillStyle = '#263238';
    const wheelPositions = [-70, -20, 30, -55, -5, 45];
    wheelPositions.forEach((wx, i) => {
      const wy = i < 3 ? 40 : 35;
      ctx.beginPath();
      ctx.arc(wx, wy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // White Rover Chassis Body
    ctx.fillStyle = '#eceff1';
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-80, -20, 140, 50, 8);
    ctx.fill();
    ctx.stroke();

    // High Gain Antenna Mast
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, -20);
    ctx.lineTo(40, -65);
    ctx.stroke();

    // Camera Sensor Head
    ctx.fillStyle = '#37474f';
    ctx.fillRect(32, -75, 24, 14);

    // Rover NASA / Ares Decal
    ctx.fillStyle = '#0288d1';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('ARES ROVER 1', -65, 5);

    ctx.restore();
  }

  // --- CHARACTER SPRITES (Charming, Expressive, Henry Stickmin Inspired) ---
  drawCharacterFigure(ctx, x, y, charKey, name, badge) {
    ctx.save();
    ctx.translate(x, y);

    // Subtle breathing / idle animation
    const breath = Math.sin(this.animTime * 2.5 + x) * 2;

    // Shadow on floor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 160, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Boots
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(-16, 95 + breath, 12, 65);
    ctx.fillRect(4, 95 + breath, 12, 65);
    ctx.fillStyle = '#37474f'; // heavy boots
    ctx.fillRect(-20, 150 + breath, 18, 14);
    ctx.fillRect(2, 150 + breath, 18, 14);

    // Torso - Outpost Jumpsuit / Flight suit
    let suitColor = '#ffffff';
    let trimColor = '#00e5ff';
    if (charKey === 'maya') { suitColor = '#283593'; trimColor = '#ffd54f'; } // Navy Commander
    if (charKey === 'liam') { suitColor = '#e65100'; trimColor = '#ffb74d'; } // Orange Engineer
    if (charKey === 'samira') { suitColor = '#1b5e20'; trimColor = '#81c784'; } // Green Medical

    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.roundRect(-24, 25 + breath, 48, 75, 10);
    ctx.fill();

    // Role Chest Stripe / Patch
    ctx.fillStyle = trimColor;
    ctx.fillRect(-20, 38 + breath, 40, 6);

    // Head / Face
    ctx.fillStyle = '#ffcc80'; // skin tone
    ctx.beginPath();
    ctx.arc(0, -5 + breath, 24, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Features
    if (charKey === 'maya') {
      ctx.fillStyle = '#212121'; // neat black bun
      ctx.beginPath();
      ctx.arc(0, -14 + breath, 25, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -32 + breath, 12, 0, Math.PI * 2); // bun
      ctx.fill();
    } else if (charKey === 'liam') {
      ctx.fillStyle = '#5d4037'; // messy brown hair
      ctx.beginPath();
      ctx.arc(0, -15 + breath, 25, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      // Goggles on forehead
      ctx.fillStyle = '#37474f';
      ctx.fillRect(-18, -22 + breath, 36, 10);
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(-14, -20 + breath, 12, 6);
      ctx.fillRect(2, -20 + breath, 12, 6);
    } else if (charKey === 'samira') {
      ctx.fillStyle = '#3e2723'; // wavy dark hair
      ctx.beginPath();
      ctx.arc(0, -12 + breath, 26, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      ctx.fillRect(-24, -10 + breath, 12, 45); // hair side lock
    }

    // Expressive Eyes (Henry Stickmin charm)
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(-7, -4 + breath, 3, 0, Math.PI * 2);
    ctx.arc(7, -4 + breath, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smile / expression
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 4 + breath, 6, 0, Math.PI);
    ctx.stroke();

    // Floating Name Tag above character
    ctx.fillStyle = 'rgba(10, 20, 30, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-60, -60 + breath, 120, 22, 4);
    ctx.fill();
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${name} [${badge}]`, 0, -45 + breath);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  drawAtmosphericEffects(ctx) {
    // Swirling dust particles across canvas
    ctx.save();
    this.dustParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > 1280) p.x = 0;
      if (p.y > 720) p.y = 0;
      if (p.y < 0) p.y = 720;

      ctx.fillStyle = `rgba(220, 120, 80, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawInteractiveHighlights(ctx) {
    // Subtle pulsating glow on interactive props
    if (this.hoveredObject) {
      // Handled via DOM overlays for crisp responsiveness
    }
  }
}
