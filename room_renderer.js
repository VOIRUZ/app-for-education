/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Illustrated 2D Outpost Room Renderer
 * ============================================================================
 * Draws cozy, approachable, illustrated indie game room environments:
 * Common Room, Life Support, Greenhouse, Bunks, Comm Station, Airlock.
 * ============================================================================
 */

class RoomRenderer {
  constructor(canvasId, game) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.game = game;

    this.currentRoomId = 'common';
    this.hoveredHotspot = null;
    this.hoveredCharacter = null;
    this.animationTimer = 0;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initInput();
    this.animate();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = this.canvas.width = rect.width;
    this.height = this.canvas.height = Math.max(380, Math.min(540, window.innerHeight * 0.52));
  }

  setRoom(roomId) {
    if (NARRATIVE_DATA.rooms[roomId]) {
      this.currentRoomId = roomId;
      this.hoveredHotspot = null;
      this.hoveredCharacter = null;
      this.game.sound.playClick();
      this.game.updateRoomTabsUI();
    }
  }

  initInput() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const room = NARRATIVE_DATA.rooms[this.currentRoomId];
      let foundHotspot = null;
      let foundCharacter = null;

      // Check Hotspots
      if (room && room.hotspots) {
        for (const h of room.hotspots) {
          const hx = (h.x / 100) * this.width;
          const hy = (h.y / 100) * this.height;
          if (Math.hypot(mouseX - hx, mouseY - hy) <= 24) {
            foundHotspot = h;
            break;
          }
        }
      }

      // Check Characters in room
      if (room && room.charactersPresent) {
        room.charactersPresent.forEach((charKey, idx) => {
          const cx = this.getCharX(idx, room.charactersPresent.length);
          const cy = this.height * 0.68;
          if (Math.abs(mouseX - cx) < 35 && Math.abs(mouseY - cy) < 55) {
            foundCharacter = charKey;
          }
        });
      }

      this.hoveredHotspot = foundHotspot;
      this.hoveredCharacter = foundCharacter;
      this.canvas.style.cursor = (foundHotspot || foundCharacter) ? 'pointer' : 'default';
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredHotspot) {
        this.game.sound.playClick();
        this.game.showHotspotInspector(this.hoveredHotspot);
      } else if (this.hoveredCharacter) {
        this.game.sound.playClick();
        this.game.startCharacterDialogue(this.hoveredCharacter);
      }
    });
  }

  getCharX(idx, total) {
    if (total === 1) return this.width * 0.50;
    if (total === 2) return this.width * (0.35 + idx * 0.30);
    return this.width * (0.28 + idx * 0.22);
  }

  animate() {
    this.animationTimer += 0.03;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Room Environment
    this.drawRoomBackground();

    // Draw Room Objects & Machinery
    this.drawRoomScenery();

    // Draw Characters Present in Room
    this.drawCharacters();

    // Draw Interactive Hotspot Pins
    this.drawHotspots();

    // Draw Hover Tooltips
    this.drawTooltips();

    requestAnimationFrame(() => this.animate());
  }

  // ==========================================================================
  // ROOM ENVIRONMENT BACKGROUNDS
  // ==========================================================================
  drawRoomBackground() {
    const w = this.width;
    const h = this.height;

    // Soft warm wall gradient
    const wallGrad = this.ctx.createLinearGradient(0, 0, 0, h * 0.75);
    if (this.currentRoomId === 'greenhouse') {
      wallGrad.addColorStop(0, '#1e112a');
      wallGrad.addColorStop(1, '#2e1240');
    } else if (this.currentRoomId === 'comms' || this.currentRoomId === 'airlock') {
      wallGrad.addColorStop(0, '#0c1322');
      wallGrad.addColorStop(1, '#1e293b');
    } else {
      wallGrad.addColorStop(0, '#1e293b');
      wallGrad.addColorStop(1, '#334155');
    }
    this.ctx.fillStyle = wallGrad;
    this.ctx.fillRect(0, 0, w, h * 0.75);

    // Warm floor
    const floorGrad = this.ctx.createLinearGradient(0, h * 0.75, 0, h);
    floorGrad.addColorStop(0, '#475569');
    floorGrad.addColorStop(1, '#1e293b');
    this.ctx.fillStyle = floorGrad;
    this.ctx.fillRect(0, h * 0.75, w, h * 0.25);

    // Baseboard divider line
    this.ctx.strokeStyle = '#64748b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, h * 0.75);
    this.ctx.lineTo(w, h * 0.75);
    this.ctx.stroke();
  }

  // ==========================================================================
  // ROOM SCENERY & ILLUSTRATED PROPS
  // ==========================================================================
  drawRoomScenery() {
    const w = this.width;
    const h = this.height;
    const t = this.animationTimer;

    switch (this.currentRoomId) {
      case 'common':
        // Window showing red Mars desert
        this.drawWindow(w * 0.65, h * 0.15, w * 0.28, h * 0.35);

        // Polaroid Photo Board on left wall
        this.ctx.fillStyle = '#b45309';
        this.ctx.fillRect(w * 0.12, h * 0.20, w * 0.16, h * 0.25);
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(w * 0.12, h * 0.20, w * 0.16, h * 0.25);

        // Mini photos pinned
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(w * 0.14, h * 0.23, 28, 32);
        this.ctx.fillRect(w * 0.21, h * 0.25, 28, 30);
        this.ctx.fillRect(w * 0.16, h * 0.32, 30, 26);

        // Dining Table in center foreground
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.beginPath();
        this.ctx.roundRect(w * 0.25, h * 0.68, w * 0.50, h * 0.12, 6);
        this.ctx.fill();
        this.ctx.strokeStyle = '#cbd5e1';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Table legs
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(w * 0.30, h * 0.80, 10, h * 0.15);
        this.ctx.fillRect(w * 0.70, h * 0.80, 10, h * 0.15);

        // Warm overhead pendant lamp
        this.ctx.strokeStyle = '#64748b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.50, 0);
        this.ctx.lineTo(w * 0.50, h * 0.22);
        this.ctx.stroke();

        this.ctx.fillStyle = '#f59e0b';
        this.ctx.beginPath();
        this.ctx.arc(w * 0.50, h * 0.22, 14, Math.PI, 0);
        this.ctx.fill();

        // Warm light cone on table
        const lightGrad = this.ctx.createRadialGradient(w * 0.50, h * 0.25, 10, w * 0.50, h * 0.65, w * 0.35);
        lightGrad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
        lightGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
        this.ctx.fillStyle = lightGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.50, h * 0.24);
        this.ctx.lineTo(w * 0.80, h * 0.75);
        this.ctx.lineTo(w * 0.20, h * 0.75);
        this.ctx.closePath();
        this.ctx.fill();
        break;

      case 'life_support':
        // Big insulated pipes across the ceiling
        this.ctx.fillStyle = '#64748b';
        this.ctx.fillRect(0, h * 0.12, w, 22);
        this.ctx.fillRect(0, h * 0.20, w, 16);

        // MOXIE Electrolysis Furnace on left
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(w * 0.18, h * 0.28, w * 0.22, h * 0.46);
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(w * 0.18, h * 0.28, w * 0.22, h * 0.46);

        // Core glowing window (800°C)
        const glowAlpha = Math.sin(t * 3) * 0.15 + 0.85;
        this.ctx.fillStyle = `rgba(249, 115, 22, ${glowAlpha})`;
        this.ctx.fillRect(w * 0.23, h * 0.42, w * 0.12, h * 0.18);

        // Water Distillation Cylinder on right
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.ellipse(w * 0.75, h * 0.50, w * 0.12, h * 0.25, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#38bdf8';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Pulsing blue fluid inside
        this.ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        this.ctx.fillRect(w * 0.70, h * 0.45, w * 0.10, h * 0.20);
        break;

      case 'greenhouse':
        // Purple grow lights above
        for (let i = 0; i < 4; i++) {
          const gx = w * (0.20 + i * 0.20);
          this.ctx.fillStyle = '#a855f7';
          this.ctx.fillRect(gx - 25, h * 0.08, 50, 8);

          // Purple light wash
          const purpleGrad = this.ctx.createRadialGradient(gx, h * 0.10, 5, gx, h * 0.45, 110);
          purpleGrad.addColorStop(0, 'rgba(192, 132, 252, 0.35)');
          purpleGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
          this.ctx.fillStyle = purpleGrad;
          this.ctx.beginPath();
          this.ctx.arc(gx, h * 0.35, 100, 0, Math.PI * 2);
          this.ctx.fill();
        }

        // Tiered plant racks on walls
        this.ctx.fillStyle = '#334155';
        this.ctx.fillRect(w * 0.10, h * 0.35, w * 0.80, 12);
        this.ctx.fillRect(w * 0.10, h * 0.55, w * 0.80, 12);

        // Lush green potato leaves & tomato vines
        this.ctx.fillStyle = '#22c55e';
        for (let i = 0; i < 18; i++) {
          const px = w * 0.12 + i * (w * 0.042);
          this.ctx.beginPath();
          this.ctx.arc(px, h * 0.33, 11, 0, Math.PI * 2);
          this.ctx.arc(px + 4, h * 0.53, 13, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;

      case 'bunks':
        // Four sleeping berths stacked
        this.drawBunkPod(w * 0.15, h * 0.22, "Cmdr Alex Cole");
        this.drawBunkPod(w * 0.15, h * 0.48, "Dr. Maya Lin");
        this.drawBunkPod(w * 0.60, h * 0.22, "Sam Sullivan");
        this.drawBunkPod(w * 0.60, h * 0.48, "Dr. Tariq Al-Mansoor");
        break;

      case 'comms':
        // Big panoramic viewport looking at Mars
        this.drawWindow(w * 0.22, h * 0.12, w * 0.56, h * 0.48, true);

        // Radio control console in center
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(w * 0.32, h * 0.65, w * 0.36, h * 0.18);
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(w * 0.32, h * 0.65, w * 0.36, h * 0.18);

        // Audio waveform on CRT monitor
        this.ctx.fillStyle = '#052e16';
        this.ctx.fillRect(w * 0.36, h * 0.68, w * 0.28, 32);
        this.ctx.strokeStyle = '#22c55e';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        for (let x = 0; x < w * 0.28; x += 4) {
          const y = h * 0.68 + 16 + Math.sin((x * 0.1) + t * 4) * 8;
          if (x === 0) this.ctx.moveTo(w * 0.36 + x, y);
          else this.ctx.lineTo(w * 0.36 + x, y);
        }
        this.ctx.stroke();
        break;

      case 'airlock':
        // Heavy pressure hatch on right
        this.ctx.fillStyle = '#475569';
        this.ctx.beginPath();
        this.ctx.roundRect(w * 0.68, h * 0.20, w * 0.22, h * 0.54, 18);
        this.ctx.fill();
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 5;
        this.ctx.stroke();

        // Round window in airlock door looking outside at solar farm
        this.ctx.fillStyle = '#0f172a';
        this.ctx.beginPath();
        this.ctx.arc(w * 0.79, h * 0.38, 28, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#94a3b8';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // EVA Suits hanging on racks on left
        this.drawEvaSuit(w * 0.22, h * 0.32);
        this.drawEvaSuit(w * 0.40, h * 0.32);
        break;
    }
  }

  drawWindow(x, y, width, height, isCurved = false) {
    this.ctx.save();
    this.ctx.beginPath();
    if (isCurved) {
      this.ctx.roundRect(x, y, width, height, 16);
    } else {
      this.ctx.rect(x, y, width, height);
    }
    this.ctx.clip();

    // Mars sky outside
    const skyGrad = this.ctx.createLinearGradient(x, y, x, y + height);
    const tau = this.game.wasm ? this.game.wasm.getDustTau() : 0.35;
    if (tau > 1.2) {
      skyGrad.addColorStop(0, '#2e0f09');
      skyGrad.addColorStop(1, '#9a3412');
    } else {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.6, '#451a03');
      skyGrad.addColorStop(1, '#c2410c');
    }
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(x, y, width, height);

    // Stars outside if clear
    if (tau < 1.0) {
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(x + width * 0.2, y + height * 0.2, 2, 2);
      this.ctx.fillRect(x + width * 0.7, y + height * 0.15, 2, 2);
      this.ctx.fillRect(x + width * 0.85, y + height * 0.3, 1.5, 1.5);
    }

    // Distant Martian Dunes
    this.ctx.fillStyle = '#7c2d12';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height * 0.65);
    this.ctx.quadraticCurveTo(x + width * 0.4, y + height * 0.55, x + width, y + height * 0.62);
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x, y + height);
    this.ctx.fill();

    this.ctx.restore();

    // Window frame
    this.ctx.strokeStyle = '#0284c7';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    if (isCurved) {
      this.ctx.roundRect(x, y, width, height, 16);
    } else {
      this.ctx.rect(x, y, width, height);
    }
    this.ctx.stroke();
  }

  drawBunkPod(x, y, label) {
    const w = this.width * 0.28;
    const h = this.height * 0.22;

    this.ctx.fillStyle = '#1e293b';
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, w, h, 8);
    this.ctx.fill();
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Pillow & folded blanket
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(x + 10, y + h * 0.4, 28, 16);
    this.ctx.fillStyle = '#0284c7';
    this.ctx.fillRect(x + 40, y + h * 0.45, w - 50, h * 0.45);

    // Name tag
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px "Inter", sans-serif';
    this.ctx.fillText(label, x + 12, y + 20);
  }

  drawEvaSuit(x, y) {
    this.ctx.fillStyle = '#e2e8f0';
    // Helmet
    this.ctx.beginPath();
    this.ctx.arc(x, y, 16, 0, Math.PI * 2);
    this.ctx.fill();
    // Gold visor
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillRect(x - 8, y - 6, 16, 10);
    // Torso suit
    this.ctx.fillStyle = '#e2e8f0';
    this.ctx.fillRect(x - 14, y + 16, 28, 48);
    // Chest pack
    this.ctx.fillStyle = '#0284c7';
    this.ctx.fillRect(x - 8, y + 22, 16, 22);
  }

  // ==========================================================================
  // CHARACTERS RENDERING (Animated illustrated figures in room)
  // ==========================================================================
  drawCharacters() {
    const room = NARRATIVE_DATA.rooms[this.currentRoomId];
    if (!room || !room.charactersPresent) return;

    const t = this.animationTimer;

    room.charactersPresent.forEach((charKey, idx) => {
      const cx = this.getCharX(idx, room.charactersPresent.length);
      const cy = this.height * 0.68;
      const breath = Math.sin(t * 2 + idx) * 2;
      const isHovered = (this.hoveredCharacter === charKey);

      // Character Shadow
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.beginPath();
      this.ctx.ellipse(cx, cy + 50, 24, 7, 0, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw Character Sprite / Vector Figure
      this.drawCharacterFigure(charKey, cx, cy + breath, isHovered);

      // Hover speech bubble: "💬 Talk to Maya"
      if (isHovered) {
        const charData = NARRATIVE_DATA.characters[charKey];
        this.drawSpeechPrompt(cx, cy - 65, `💬 Talk to ${charData.shortName}`);
      }
    });
  }

  drawCharacterFigure(charKey, x, y, isHovered) {
    const charData = NARRATIVE_DATA.characters[charKey];
    const color = charData.color || '#38bdf8';

    this.ctx.save();
    this.ctx.translate(x, y);

    // Glow highlight if hovered
    if (isHovered) {
      this.ctx.shadowColor = color;
      this.ctx.shadowBlur = 15;
    }

    // Legs
    this.ctx.fillStyle = '#1e293b';
    this.ctx.fillRect(-10, 20, 8, 30);
    this.ctx.fillRect(2, 20, 8, 30);

    // Torso / Flight Jumpsuit
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.roundRect(-14, -14, 28, 36, 5);
    this.ctx.fill();

    // Chest trim
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(-6, -10, 12, 14);

    // Head
    this.ctx.fillStyle = '#fed7aa';
    this.ctx.beginPath();
    this.ctx.arc(0, -28, 14, 0, Math.PI * 2);
    this.ctx.fill();

    // Hair
    if (charKey === 'maya') {
      this.ctx.fillStyle = '#1e1b4b';
      this.ctx.beginPath();
      this.ctx.arc(0, -32, 14, Math.PI, 0);
      this.ctx.fill();
      // Bun
      this.ctx.beginPath();
      this.ctx.arc(0, -44, 6, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (charKey === 'sully') {
      this.ctx.fillStyle = '#ea580c';
      this.ctx.beginPath();
      this.ctx.arc(0, -32, 15, Math.PI, 0);
      this.ctx.arc(-8, -26, 6, 0, Math.PI * 2);
      this.ctx.arc(8, -26, 6, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (charKey === 'tariq') {
      this.ctx.fillStyle = '#27272a';
      this.ctx.beginPath();
      this.ctx.arc(0, -32, 14, Math.PI, 0);
      this.ctx.fill();
      // Beard
      this.ctx.beginPath();
      this.ctx.arc(0, -24, 7, 0, Math.PI);
      this.ctx.fill();
    } else {
      // Alex
      this.ctx.fillStyle = '#78350f';
      this.ctx.beginPath();
      this.ctx.arc(0, -32, 14, Math.PI, 0);
      this.ctx.fill();
    }

    // Simple friendly eye dots
    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(-4, -28, 1.8, 0, Math.PI * 2);
    this.ctx.arc(4, -28, 1.8, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  drawSpeechPrompt(x, y, text) {
    this.ctx.font = 'bold 12px "Inter", sans-serif';
    const textWidth = this.ctx.measureText(text).width;
    const pad = 12;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.roundRect(x - (textWidth + pad * 2) / 2, y - 14, textWidth + pad * 2, 28, 14);
    this.ctx.fill();
    this.ctx.strokeStyle = '#0284c7';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Little speech triangle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.moveTo(x - 5, y + 14);
    this.ctx.lineTo(x + 5, y + 14);
    this.ctx.lineTo(x, y + 20);
    this.ctx.fill();

    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillText(text, x - textWidth / 2, y + 5);
  }

  // ==========================================================================
  // INTERACTIVE HOTSPOTS
  // ==========================================================================
  drawHotspots() {
    const room = NARRATIVE_DATA.rooms[this.currentRoomId];
    if (!room || !room.hotspots) return;

    const t = this.animationTimer;

    for (const h of room.hotspots) {
      const hx = (h.x / 100) * this.width;
      const hy = (h.y / 100) * this.height;
      const isHovered = (this.hoveredHotspot === h);

      // Pulse ring
      const pulse = Math.sin(t * 3) * 3 + 18;
      this.ctx.strokeStyle = isHovered ? '#00f0ff' : 'rgba(251, 191, 36, 0.4)';
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.arc(hx, hy, pulse, 0, Math.PI * 2);
      this.ctx.stroke();

      // Pin badge
      this.ctx.fillStyle = isHovered ? '#00f0ff' : '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(hx, hy, 14, 0, Math.PI * 2);
      this.ctx.fill();

      // Icon
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(h.icon, hx, hy);
    }
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'alphabetic';
  }

  drawTooltips() {
    if (!this.hoveredHotspot) return;
    const h = this.hoveredHotspot;
    const hx = (h.x / 100) * this.width;
    const hy = (h.y / 100) * this.height;

    this.ctx.font = 'bold 12px "Inter", sans-serif';
    const text = `🔍 Inspect: ${h.label}`;
    const textWidth = this.ctx.measureText(text).width;
    const pad = 10;

    const tipX = Math.max(10, Math.min(this.width - textWidth - pad * 2 - 10, hx - (textWidth + pad * 2) / 2));
    const tipY = Math.max(10, hy - 32);

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.roundRect(tipX, tipY - 14, textWidth + pad * 2, 26, 5);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillText(text, tipX + pad, tipY + 4);
  }
}

if (typeof window !== 'undefined') {
  window.RoomRenderer = RoomRenderer;
}
