// ============================================================================
// MOON WATER RESEARCH & SURVIVAL ADVENTURE
// Realistic 3D Graphics Engine, Panoramic Windshield & Mouse Look System
// Three.js r128 — High-Fidelity Sci-Fi Spaceship & Dynamic Exploration
// ============================================================================

class MoonGame3D {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.currentSceneName = 'interior'; // 'space', 'interior', 'lunar_surface', 'lab'
    this.animTime = 0;
    this.raycaster = null;
    this.mouse = { x: 0, y: 0 };
    this.shakeIntensity = 0;

    // Sub-scene root groups
    this.spaceGroup = null;
    this.interiorGroup = null;
    this.surfaceGroup = null;
    this.labGroup = null;

    // Dynamic Station & Interactive References
    this.stations = {};
    this.interactiveObjects = [];
    this.nearestStation = null;
    this.activeObjectiveStation = null;

    // Callbacks
    this.onStationNearCallback = null;
    this.onStationLeaveCallback = null;
    this.onStationInteractCallback = null;
    this.onWindshieldViewToggle = null;
    this.audioRef = null;

    // Dynamic Monitor Canvas Textures
    this.monitorTextures = {};
    this.monitorCanvases = {};

    // ================= MOUSE LOOK & ORBITAL CAMERA =================
    this.camYaw = 0; // Horizontal rotation angle in radians (0 = looking down -Z)
    this.camPitch = 0.22; // Vertical tilt angle in radians
    this.camDistance = 34; // Distance from player in 3rd person
    this.isDraggingMouse = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.dragDistance = 0;
    this.isWindshieldMode = false;

    // ================= ASTRONAUT PLAYER CHARACTER =================
    this.astronaut = null;
    this.astronautLimbs = {
      torso: null,
      leftLeg: null,
      rightLeg: null,
      leftKnee: null,
      rightKnee: null,
      leftArm: null,
      rightArm: null,
      visor: null,
      backpack: null
    };
    this.playerPos = { x: 0, y: -30.5, z: 20 };
    this.playerVel = { x: 0, z: 0 };
    this.targetRotation = Math.PI;
    this.walkCycle = 0;
    this.isMoving = false;
    this.lastFootstepTime = 0;

    // Movement Controls
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };
    this.clickTarget = null;
    this.clickTargetMarker = null;

    // Camera targets for smooth cinematic tracking
    this.camTargetPos = { x: 0, y: 15, z: 60 };
    this.camTargetLook = { x: 0, y: 5, z: 0 };

    // Outside Lunar Vista References
    this.roverBeaconLight = null;
    this.crashBeaconLight = null;
    this.outsideEarthMesh = null;

    // Spacecraft dynamics in space
    this.earthMesh = null;
    this.spacecraftGroup = null;
    this.resourceModuleMesh = null;
    this.thrusterParticles = null;
    this.isModuleDetached = false;
  }

  setAudio(audio) {
    this.audioRef = audio;
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded, running fallback');
      this.initFallback2D();
      return;
    }

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040711);

    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 4000);
    this.camera.position.set(0, 15, 60);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();

    // 2. Input Listeners (Keyboard, Mouse Look Drag, Click-to-Move)
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));

    const dom = this.renderer.domElement;
    dom.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    dom.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    dom.addEventListener('click', (e) => this.onCanvasClick(e));

    // 3. Build Environments
    this.buildStarfield();
    this.buildSpaceScene();
    this.buildInteriorScene();
    this.buildSurfaceScene();
    this.buildLabScene();

    // 4. Default to interior scene
    this.switchScene('interior');

    // 5. Render Loop
    this.animate();
  }

  // ================= TEXTURE GENERATORS (REALISTIC MATERIALS) =================

  // 1. Quilted NASA Thermal Insulation Blanket (Orion / Apollo / ISS Fabric)
  createQuiltedThermalTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dde2e8';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = 'rgba(70, 85, 105, 0.45)';
    ctx.lineWidth = 2.5;

    const step = 64;
    for (let x = -512; x <= 1024; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 512, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, 512);
      ctx.lineTo(x + 512, 0);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(40, 55, 75, 0.5)';
    for (let y = step / 2; y < 512; y += step) {
      for (let x = step / 2; x < 512; x += step) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 12;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + n));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 8);
    return texture;
  }

  // 2. High-Tech Non-Slip Metallic Floor Deck Plate
  createDeckPlateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#111722';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#1a2434';
    for (let y = 0; y < 512; y += 32) {
      ctx.fillRect(0, y, 512, 4);
    }
    for (let x = 0; x < 512; x += 32) {
      ctx.fillRect(x, 0, 4, 512);
    }

    ctx.fillStyle = '#080d15';
    for (let y = 16; y < 512; y += 32) {
      for (let x = 16; x < 512; x += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 10);
    return texture;
  }

  // 3. Dynamic Animated Monitor Canvas Textures
  setupMonitorCanvas(key, width = 256, height = 192) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);

    this.monitorCanvases[key] = { canvas, ctx, width, height };
    this.monitorTextures[key] = texture;
    return texture;
  }

  updateMonitorCanvases(time) {
    for (const key in this.monitorCanvases) {
      const item = this.monitorCanvases[key];
      const ctx = item.ctx;
      const w = item.width;
      const h = item.height;

      ctx.fillStyle = '#050c18';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#0e2038';
      ctx.fillRect(0, 0, w, 28);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`SYS // ${key.toUpperCase()}`, 10, 19);

      if (key === 'oxygen') {
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.fillRect(10, 36, w - 20, 70);

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 10; x < w - 10; x += 3) {
          const y = 70 + Math.sin((x * 0.08) + time * 6) * 18;
          if (x === 10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#76ff03';
        ctx.font = '10px monospace';
        ctx.fillText(`O2 PURITY: 99.4% [ACTIVE]`, 14, 128);
        ctx.fillStyle = '#ffd54f';
        ctx.fillText(`ELECTROLYSIS CELL: 28.2V`, 14, 144);

        ctx.fillStyle = '#142842';
        ctx.fillRect(14, 156, w - 28, 12);
        ctx.fillStyle = '#00e5ff';
        const prog = (Math.sin(time * 2) * 0.5 + 0.5) * (w - 28);
        ctx.fillRect(14, 156, prog, 12);
      } else if (key === 'power') {
        ctx.strokeStyle = '#ffd54f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 10; x < w - 10; x += 3) {
          const y = 65 + Math.sin((x * 0.1) - time * 8) * 22;
          if (x === 10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#ffd54f';
        ctx.font = '10px monospace';
        ctx.fillText(`SOLAR BUS: 1,850 W / 3,600 W`, 14, 120);
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(`ARRAY BETA: 48% EFFICIENCY`, 14, 136);

        for (let b = 0; b < 6; b++) {
          ctx.fillStyle = b < 4 ? '#76ff03' : '#37474f';
          ctx.fillRect(14 + b * 36, 154, 28, 16);
        }
      } else if (key === 'water') {
        ctx.fillStyle = 'rgba(0, 176, 255, 0.2)';
        ctx.fillRect(10, 36, w - 20, 60);

        ctx.strokeStyle = '#00b0ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 10; x < w - 10; x += 4) {
          const y = 66 + Math.cos((x * 0.06) + time * 4) * 14;
          if (x === 10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = '#e0f2fe';
        ctx.font = '10px monospace';
        ctx.fillText(`ECLSS WATER RECYCLER: NOMINAL`, 14, 120);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`GRAYWATER INLET: 1.8 L/HR`, 14, 136);
        ctx.fillText(`REVERSE OSMOSIS: LOCKED`, 14, 152);
      } else if (key === 'comms') {
        const cx = w / 2;
        const cy = 75;
        const r = 38;

        ctx.strokeStyle = 'rgba(118, 255, 3, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2); ctx.stroke();

        const sweepAngle = time * 3;
        ctx.strokeStyle = '#76ff03';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepAngle) * r, cy + Math.sin(sweepAngle) * r);
        ctx.stroke();

        ctx.fillStyle = '#76ff03';
        ctx.font = '10px monospace';
        ctx.fillText(`ASRIEL ROVER CARRIER: LOCK 94%`, 14, 134);
        ctx.fillStyle = '#bbf7d0';
        ctx.fillText(`SHACKLETON RIDGE AZIMUTH: 182.4°`, 14, 150);
      } else if (key === 'bench') {
        const cx = w / 2;
        const cy = 72;
        const sz = 24;
        const a = time * 1.5;

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeRect(cx - sz + Math.cos(a) * 8, cy - sz, sz * 2, sz * 2);

        ctx.fillStyle = '#fb7185';
        ctx.font = '10px monospace';
        ctx.fillText(`SPECTROMETER: INFRARED H2O`, 14, 126);
        ctx.fillStyle = '#00e5ff';
        ctx.fillText(`SAMPLE CORE: POLAR ICE [READY]`, 14, 144);
      } else if (key === 'windshield') {
        // Cockpit Nav Computer HUD
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`HORIZON BEARING: 182° SOUTH`, 14, 52);
        ctx.fillText(`ELEVATION: -1.2° // POLAR PLAIN`, 14, 70);
        ctx.fillStyle = '#76ff03';
        ctx.fillText(`ROVER TRANSPONDER: SIGNAL +42dBm`, 14, 94);
        ctx.fillStyle = '#ffd54f';
        ctx.fillText(`CRASHED MODULE: 35 KM EAST`, 14, 114);

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(12, 130, w - 24, 40);
        ctx.fillText(`VIEWPORT: PANORAMIC COCKPIT`, 20, 154);
      }

      this.monitorTextures[key].needsUpdate = true;
    }
  }

  // ================= 3D ENVIRONMENTS =================

  buildStarfield() {
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3800;
    const pos = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 3200;
      pos[i + 1] = (Math.random() - 0.5) * 3200;
      pos[i + 2] = (Math.random() - 0.5) * 3200;

      const tint = Math.random();
      if (tint > 0.8) {
        colors[i] = 0.5; colors[i + 1] = 0.9; colors[i + 2] = 1.0;
      } else if (tint > 0.6) {
        colors[i] = 1.0; colors[i + 1] = 0.85; colors[i + 2] = 0.6;
      } else {
        colors[i] = 1.0; colors[i + 1] = 1.0; colors[i + 2] = 1.0;
      }
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    this.starfield = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starfield);
  }

  // SCENE 1: Space Transit
  buildSpaceScene() {
    this.spaceGroup = new THREE.Group();

    // Planet Earth
    const earthGeo = new THREE.SphereGeometry(75, 48, 48);
    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1d4ed8,
      emissive: 0x071b3e,
      specular: 0x60a5fa,
      shininess: 30
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthMesh.position.set(-280, 110, -600);
    this.spaceGroup.add(this.earthMesh);

    // Continents
    const continentMat = new THREE.MeshPhongMaterial({ color: 0x15803d, shininess: 15 });
    for (let c = 0; c < 10; c++) {
      const landGeo = new THREE.SphereGeometry(15 + Math.random() * 12, 20, 20);
      const land = new THREE.Mesh(landGeo, continentMat);
      land.position.set(
        (Math.random() - 0.5) * 65,
        (Math.random() - 0.5) * 65,
        (Math.random() - 0.5) * 65
      );
      this.earthMesh.add(land);
    }

    // Atmospheric Glow
    const atmoGeo = new THREE.RingGeometry(76, 92, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const atmo = new THREE.Mesh(atmoGeo, atmoMat);
    atmo.position.copy(this.earthMesh.position);
    this.spaceGroup.add(atmo);

    // The Moon in distance
    const moonGeo = new THREE.SphereGeometry(42, 32, 32);
    const moonMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    this.spaceMoonMesh = new THREE.Mesh(moonGeo, moonMat);
    this.spaceMoonMesh.position.set(450, -60, -850);
    this.spaceGroup.add(this.spaceMoonMesh);

    // Spacecraft
    this.spacecraftGroup = new THREE.Group();

    const navGeo = new THREE.ConeGeometry(12, 34, 32);
    const navMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.25 });
    const navMesh = new THREE.Mesh(navGeo, navMat);
    navMesh.rotation.z = -Math.PI / 2;
    navMesh.position.set(30, 0, 0);
    this.spacecraftGroup.add(navMesh);

    const crewGeo = new THREE.CylinderGeometry(11, 11, 40, 32);
    const crewMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.7, roughness: 0.3 });
    const crewMesh = new THREE.Mesh(crewGeo, crewMat);
    crewMesh.rotation.z = -Math.PI / 2;
    crewMesh.position.set(-6, 0, 0);
    this.spacecraftGroup.add(crewMesh);

    this.resourceModuleMesh = new THREE.Group();
    const resGeo = new THREE.BoxGeometry(26, 16, 16);
    const resMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6, roughness: 0.4 });
    const resBody = new THREE.Mesh(resGeo, resMat);
    this.resourceModuleMesh.add(resBody);

    const solarMat = new THREE.MeshPhongMaterial({
      color: 0x0369a1,
      emissive: 0x0284c7,
      specular: 0x7dd3fc,
      shininess: 90
    });
    const solarWing1 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 44), solarMat);
    solarWing1.position.set(0, 0, 28);
    this.resourceModuleMesh.add(solarWing1);

    const solarWing2 = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 44), solarMat);
    solarWing2.position.set(0, 0, -28);
    this.resourceModuleMesh.add(solarWing2);

    this.resourceModuleMesh.position.set(-42, 0, 0);
    this.spacecraftGroup.add(this.resourceModuleMesh);

    const thrusterGeo = new THREE.BufferGeometry();
    const thrusterCount = 80;
    const thrusterPos = new Float32Array(thrusterCount * 3);
    for (let i = 0; i < thrusterCount * 3; i += 3) {
      thrusterPos[i] = -60 - Math.random() * 80;
      thrusterPos[i + 1] = (Math.random() - 0.5) * 4;
      thrusterPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    thrusterGeo.setAttribute('position', new THREE.BufferAttribute(thrusterPos, 3));
    this.thrusterParticles = new THREE.Points(
      thrusterGeo,
      new THREE.PointsMaterial({ color: 0x00e5ff, size: 4.5, transparent: true, opacity: 0.85 })
    );
    this.spacecraftGroup.add(this.thrusterParticles);

    this.spaceGroup.add(this.spacecraftGroup);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.position.set(300, 200, 250);
    this.spaceGroup.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x131f33, 0.9);
    this.spaceGroup.add(ambientLight);

    this.scene.add(this.spaceGroup);
  }

  // SCENE 2: Realistic Spaceship Interior Cabin + Panoramic Cockpit Windshield
  buildInteriorScene() {
    this.interiorGroup = new THREE.Group();

    // 1. Smooth Cylindrical Padded Hull (NASA quilted blanket)
    const quiltTex = this.createQuiltedThermalTexture();
    const hullMat = new THREE.MeshStandardMaterial({
      map: quiltTex,
      roughness: 0.75,
      metalness: 0.15,
      side: THREE.BackSide
    });
    const hullGeo = new THREE.CylinderGeometry(55, 55, 170, 48, 1, true);
    const cabinHull = new THREE.Mesh(hullGeo, hullMat);
    cabinHull.rotation.x = Math.PI / 2;
    this.interiorGroup.add(cabinHull);

    // 2. Heavy Titanium Bulkhead Arches with LED lights
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x243247,
      metalness: 0.85,
      roughness: 0.25
    });
    for (let z = -65; z <= 65; z += 28) {
      const arch = new THREE.Mesh(new THREE.TorusGeometry(54.4, 2.0, 16, 48), archMat);
      arch.position.z = z;
      this.interiorGroup.add(arch);

      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
      const led1 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 1.5), ledMat);
      led1.position.set(-36, 38, z);
      this.interiorGroup.add(led1);

      const led2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 1.5), ledMat);
      led2.position.set(36, 38, z);
      this.interiorGroup.add(led2);
    }

    // 3. Metallic Grated Floor Deck
    const deckTex = this.createDeckPlateTexture();
    const floorGeo = new THREE.BoxGeometry(68, 2, 162);
    const floorMat = new THREE.MeshStandardMaterial({
      map: deckTex,
      metalness: 0.7,
      roughness: 0.35
    });
    this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
    this.floorMesh.position.set(0, -32, 0);
    this.floorMesh.receiveShadow = true;
    this.floorMesh.userData = { isFloor: true };
    this.interiorGroup.add(this.floorMesh);

    // Floor Guide Strips
    const stripCyanMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const guideLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 160), stripCyanMat);
    guideLeft.position.set(-16, -30.8, 0);
    this.interiorGroup.add(guideLeft);

    const guideRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 160), stripCyanMat);
    guideRight.position.set(16, -30.8, 0);
    this.interiorGroup.add(guideRight);

    // 4. COCKPIT WINDSHIELD & REALISTIC SURROUNDING MOON VISTA OUTSIDE
    this.buildCockpitWindshieldAndLunarVista();

    // 5. Interactive Sci-Fi Consoles (Key Outpost Stations)
    this.createRealisticStation(
      'oxygen',
      'OXYGEN ELECTROLYSIS UNIT',
      -26, -16, -25,
      0x00e5ff,
      '💨',
      this.interiorGroup
    );

    this.createRealisticStation(
      'power',
      'SOLAR ARRAY & POWER BUS',
      26, -16, -25,
      0xffb703,
      '⚡',
      this.interiorGroup
    );

    this.createRealisticStation(
      'water',
      'ECLSS WATER RECYCLER',
      -26, -16, 25,
      0x00b0ff,
      '💧',
      this.interiorGroup
    );

    this.createRealisticStation(
      'comms',
      'LONG-RANGE COMMS TERMINAL',
      26, -16, 25,
      0x76ff03,
      '📡',
      this.interiorGroup
    );

    this.createScienceWorkbench(0, -26, -2, this.interiorGroup);

    // 6. Click-to-Move Floor Marker
    const markerGeo = new THREE.RingGeometry(2.5, 3.5, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    this.clickTargetMarker = new THREE.Mesh(markerGeo, markerMat);
    this.clickTargetMarker.rotation.x = -Math.PI / 2;
    this.clickTargetMarker.position.y = -30.8;
    this.interiorGroup.add(this.clickTargetMarker);

    // 7. Realistic 3D Astronaut Model
    this.buildAstronautCharacter();

    // 8. Overhead Interior Lighting
    const ceilingLight1 = new THREE.PointLight(0xfffaed, 1.4, 90);
    ceilingLight1.position.set(0, 32, -25);
    this.interiorGroup.add(ceilingLight1);

    const ceilingLight2 = new THREE.PointLight(0xfffaed, 1.4, 90);
    ceilingLight2.position.set(0, 32, 25);
    this.interiorGroup.add(ceilingLight2);

    const ambientInterior = new THREE.AmbientLight(0x1a2638, 1.1);
    this.interiorGroup.add(ambientInterior);

    this.scene.add(this.interiorGroup);
  }

  // ================= PANORAMIC COCKPIT WINDSHIELD & MOON SURROUNDINGS =================
  buildCockpitWindshieldAndLunarVista() {
    const cockpitGroup = new THREE.Group();
    cockpitGroup.position.set(0, 0, -82);

    // 1. Cockpit Frame Structure (Heavy Titanium Arch Framing the Windshield)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.9,
      roughness: 0.2
    });

    // Main Cockpit Upper Canopy Arch
    const canopyArch = new THREE.Mesh(
      new THREE.TorusGeometry(32, 2.8, 16, 48),
      frameMat
    );
    canopyArch.position.set(0, 4, 0);
    cockpitGroup.add(canopyArch);

    // Center Vertical Windshield Divider Pillar
    const centerPillar = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 42, 16),
      frameMat
    );
    centerPillar.position.set(0, 4, 0);
    cockpitGroup.add(centerPillar);

    // Left and Right Diagonal Structural Struts
    const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 36, 12), frameMat);
    strutL.position.set(-18, 6, 0);
    strutL.rotation.z = 0.55;
    cockpitGroup.add(strutL);

    const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 36, 12), frameMat);
    strutR.position.set(18, 6, 0);
    strutR.rotation.z = -0.55;
    cockpitGroup.add(strutR);

    // 2. High-Clarity Space Glass Windshield Panels
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f2b48,
      transparent: true,
      opacity: 0.25,
      metalness: 0.95,
      roughness: 0.04,
      side: THREE.DoubleSide
    });

    const leftGlass = new THREE.Mesh(new THREE.CircleGeometry(29, 36, 0, Math.PI), glassMat);
    leftGlass.rotation.z = Math.PI / 2;
    leftGlass.position.set(0, 4, 0.2);
    cockpitGroup.add(leftGlass);

    // 3. Cockpit Pilot Instrumentation Console (Under Windshield)
    const navConsoleGeo = new THREE.BoxGeometry(46, 14, 16);
    const navConsoleMat = new THREE.MeshStandardMaterial({ color: 0x152336, metalness: 0.85, roughness: 0.25 });
    const navConsole = new THREE.Mesh(navConsoleGeo, navConsoleMat);
    navConsole.position.set(0, -18, 6);
    cockpitGroup.add(navConsole);

    // Interactive Station Hit Target for Windshield View
    navConsole.userData = { stationKey: 'windshield', label: 'COCKPIT WINDSHIELD DECK' };
    this.interactiveObjects.push(navConsole);

    const monitorTex = this.setupMonitorCanvas('windshield', 256, 192);
    const navScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 10),
      new THREE.MeshBasicMaterial({ map: monitorTex, side: THREE.DoubleSide })
    );
    navScreen.position.set(0, -12, 14.2);
    cockpitGroup.add(navScreen);

    // Station Proximity Floor Ring
    const floorRing = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.5, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
    );
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.set(0, -30.8, 16);
    cockpitGroup.add(floorRing);

    cockpitGroup.userData = { stationKey: 'windshield', label: 'COCKPIT WINDSHIELD DECK', floorRing };
    this.stations['windshield'] = cockpitGroup;
    this.stations['airlock'] = cockpitGroup; // Fallback alias
    this.interiorGroup.add(cockpitGroup);

    // ================= SURROUNDING LUNAR LANDSCAPE OUTSIDE WINDSHIELD =================
    const lunarVistaGroup = new THREE.Group();
    lunarVistaGroup.position.set(0, 0, -84);

    // 1. Cratered Lunar Regolith Ground Plane extending forward outside
    const groundGeo = new THREE.PlaneGeometry(900, 900, 64, 64);
    const pos = groundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      // Realistic lunar crater ridges outside the front of the ship
      const d = Math.sin(vx * 0.009) * 28 + Math.cos(vy * 0.007) * 24 + Math.sin(vx * 0.025 + vy * 0.02) * 6;
      pos.setZ(i, d);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.95,
      metalness: 0.1
    });
    const moonGround = new THREE.Mesh(groundGeo, groundMat);
    moonGround.rotation.x = -Math.PI / 2;
    moonGround.position.set(0, -38, -320);
    lunarVistaGroup.add(moonGround);

    // 2. Dual Rover Tire Tracks curving into the distance
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
    for (let t = 0; t < 22; t++) {
      const zPos = -40 - t * 24;
      const xCurve = Math.sin(t * 0.2) * 25 - 20;

      const trackL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 14), trackMat);
      trackL.position.set(xCurve - 4, -36.5, zPos);
      lunarVistaGroup.add(trackL);

      const trackR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 14), trackMat);
      trackR.position.set(xCurve + 4, -36.5, zPos);
      lunarVistaGroup.add(trackR);
    }

    // 3. Scattered Lunar Boulders & Rocks Outside
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.9, metalness: 0.15 });
    const rockPositions = [
      [-32, -34, -75, 4.5], [26, -35, -90, 5.2], [-65, -32, -140, 8.0],
      [48, -31, -160, 6.5], [-15, -34, -110, 3.8], [75, -29, -210, 11.0],
      [-95, -28, -250, 14.0], [10, -33, -190, 4.2], [-40, -30, -290, 9.5]
    ];
    rockPositions.forEach(([rx, ry, rz, scale]) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 1), rockMat);
      rock.position.set(rx, ry, rz);
      rock.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      lunarVistaGroup.add(rock);
    });

    // 4. Asriel's Polar Rover Model (In Distance along the ridge)
    const roverGroup = new THREE.Group();
    roverGroup.position.set(-55, -22, -260);

    const roverBody = new THREE.Mesh(
      new THREE.BoxGeometry(14, 7, 22),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.3 })
    );
    roverGroup.add(roverBody);

    // Rover High-Gain Dish
    const dish = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 1, 2, 16),
      new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.9 })
    );
    dish.position.set(0, 7, 0);
    roverGroup.add(dish);

    // Blinking Green Rover Beacon Light
    this.roverBeaconLight = new THREE.PointLight(0x76ff03, 2.5, 90);
    this.roverBeaconLight.position.set(0, 10, 0);
    roverGroup.add(this.roverBeaconLight);

    const beaconSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x76ff03 })
    );
    beaconSphere.position.set(0, 10, 0);
    roverGroup.add(beaconSphere);

    lunarVistaGroup.add(roverGroup);

    // 5. Crashed Resource Module Debris (35 km away on the crater rim)
    const crashGroup = new THREE.Group();
    crashGroup.position.set(130, 15, -460);

    const crashBody = new THREE.Mesh(
      new THREE.BoxGeometry(22, 14, 18),
      new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.4 })
    );
    crashBody.rotation.set(0.4, 0.2, 0.5);
    crashGroup.add(crashBody);

    // Blinking Amber Emergency Strobe
    this.crashBeaconLight = new THREE.PointLight(0xffb703, 3.0, 140);
    this.crashBeaconLight.position.set(0, 12, 0);
    crashGroup.add(this.crashBeaconLight);

    const strobeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffb703 })
    );
    strobeSphere.position.set(0, 12, 0);
    crashGroup.add(strobeSphere);

    lunarVistaGroup.add(crashGroup);

    // 6. Planet Earth Hanging in the Starry Lunar Sky Outside
    const earthOutside = new THREE.Mesh(
      new THREE.SphereGeometry(36, 48, 48),
      new THREE.MeshPhongMaterial({
        color: 0x2563eb,
        emissive: 0x071b3e,
        specular: 0x60a5fa,
        shininess: 35
      })
    );
    earthOutside.position.set(-85, 75, -420);
    lunarVistaGroup.add(earthOutside);
    this.outsideEarthMesh = earthOutside;

    // Earth Atmospheric Rim Glow
    const earthAtm = new THREE.Mesh(
      new THREE.RingGeometry(37, 44, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
    );
    earthAtm.position.copy(earthOutside.position);
    lunarVistaGroup.add(earthAtm);

    // 7. Dramatic Lunar Horizon Sun Light (Casts long shadows across craters)
    const moonSunLight = new THREE.DirectionalLight(0xfff7e6, 2.8);
    moonSunLight.position.set(280, 60, -180);
    lunarVistaGroup.add(moonSunLight);

    this.interiorGroup.add(lunarVistaGroup);
  }

  // ================= STATIONS & APPARATUS =================
  createRealisticStation(stationKey, label, x, y, z, accentHex, icon, parentGroup) {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(x, y, z);
    stationGroup.userData = { stationKey, label, baseColor: accentHex };

    const consoleGeo = new THREE.BoxGeometry(10, 32, 20);
    const consoleMat = new THREE.MeshStandardMaterial({
      color: 0x1b2636,
      metalness: 0.85,
      roughness: 0.25
    });
    const baseMesh = new THREE.Mesh(consoleGeo, consoleMat);
    stationGroup.add(baseMesh);

    const monitorTex = this.setupMonitorCanvas(stationKey, 256, 192);
    const screenGeo = new THREE.PlaneGeometry(15, 11);
    const screenMat = new THREE.MeshBasicMaterial({
      map: monitorTex,
      side: THREE.DoubleSide
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(x < 0 ? 5.2 : -5.2, 5, 0);
    screenMesh.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
    stationGroup.add(screenMesh);

    const trimGeo = new THREE.BoxGeometry(10.4, 1.2, 20.4);
    const trimMat = new THREE.MeshBasicMaterial({ color: accentHex });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.set(0, 15, 0);
    stationGroup.add(trimMesh);

    const ringGeo = new THREE.TorusGeometry(8, 0.45, 12, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accentHex,
      transparent: true,
      opacity: 0.6
    });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.set(x < 0 ? 12 : -12, -14.8, 0);
    stationGroup.add(floorRing);
    stationGroup.userData.floorRing = floorRing;

    const stationLight = new THREE.PointLight(accentHex, 1.6, 38);
    stationLight.position.set(x < 0 ? 8 : -8, 6, 0);
    stationGroup.add(stationLight);

    parentGroup.add(stationGroup);

    baseMesh.userData = { stationKey, parentGroup: stationGroup };
    this.interactiveObjects.push(baseMesh);
    this.stations[stationKey] = stationGroup;
  }

  createScienceWorkbench(x, y, z, parentGroup) {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, y, z);
    benchGroup.userData = { stationKey: 'bench', label: 'SCIENCE WORKBENCH', baseColor: 0xf43f5e };

    const tableGeo = new THREE.CylinderGeometry(16, 16, 6, 24);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.25 });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    benchGroup.add(tableMesh);

    const holoCoreGeo = new THREE.CylinderGeometry(5, 5, 2, 20);
    const holoCoreMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const holoMesh = new THREE.Mesh(holoCoreGeo, holoCoreMat);
    holoMesh.position.y = 4;
    benchGroup.add(holoMesh);

    const monitorTex = this.setupMonitorCanvas('bench', 256, 192);
    const screenGeo = new THREE.PlaneGeometry(12, 9);
    const screenMat = new THREE.MeshBasicMaterial({ map: monitorTex, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 10, -5);
    benchGroup.add(screen);

    const ringGeo = new THREE.TorusGeometry(12, 0.45, 12, 36);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.5 });
    const floorRing = new THREE.Mesh(ringGeo, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.set(0, -4.8, 0);
    benchGroup.add(floorRing);
    benchGroup.userData.floorRing = floorRing;

    parentGroup.add(benchGroup);
    tableMesh.userData = { stationKey: 'bench', parentGroup: benchGroup };
    this.interactiveObjects.push(tableMesh);
    this.stations['bench'] = benchGroup;
  }

  // ================= 3D ASTRONAUT PLAYER CHARACTER =================
  buildAstronautCharacter() {
    this.astronaut = new THREE.Group();
    this.astronaut.position.set(this.playerPos.x, this.playerPos.y, this.playerPos.z);

    const suitMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.15,
      roughness: 0.65
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.5,
      roughness: 0.4
    });

    // Torso
    const torsoGeo = new THREE.BoxGeometry(4.8, 6.8, 3.4);
    const torso = new THREE.Mesh(torsoGeo, suitMat);
    torso.position.y = 8.5;
    this.astronaut.add(torso);
    this.astronautLimbs.torso = torso;

    // DCM
    const dcmGeo = new THREE.BoxGeometry(3.0, 3.0, 1.2);
    const dcmMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const dcm = new THREE.Mesh(dcmGeo, dcmMat);
    dcm.position.set(0, 8.8, 2.0);
    this.astronaut.add(dcm);

    const dcmScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    dcmScreen.position.set(0, 9.2, 2.65);
    this.astronaut.add(dcmScreen);

    // PLSS Backpack
    const plssGeo = new THREE.BoxGeometry(4.6, 7.2, 2.8);
    const plssMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.4, roughness: 0.4 });
    const plss = new THREE.Mesh(plssGeo, plssMat);
    plss.position.set(0, 8.8, -2.5);
    this.astronaut.add(plss);
    this.astronautLimbs.backpack = plss;

    const tankGeo = new THREE.CylinderGeometry(0.9, 0.9, 5.5, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.85, roughness: 0.2 });
    const tank1 = new THREE.Mesh(tankGeo, tankMat);
    tank1.position.set(-1.4, 8.8, -3.8);
    this.astronaut.add(tank1);

    const tank2 = new THREE.Mesh(tankGeo, tankMat);
    tank2.position.set(1.4, 8.8, -3.8);
    this.astronaut.add(tank2);

    // Helmet & Visor
    const neckRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.1, 0.35, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.9, roughness: 0.2 })
    );
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.y = 12.2;
    this.astronaut.add(neckRing);

    const helmetGeo = new THREE.SphereGeometry(2.5, 24, 24);
    const helmet = new THREE.Mesh(helmetGeo, suitMat);
    helmet.position.y = 14.4;
    this.astronaut.add(helmet);

    const visorGeo = new THREE.SphereGeometry(2.35, 24, 24, 0, Math.PI, 0, Math.PI * 0.75);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0x451a03,
      metalness: 0.95,
      roughness: 0.08,
      side: THREE.DoubleSide
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.rotation.x = -Math.PI / 2;
    visor.position.set(0, 14.5, 0.4);
    this.astronaut.add(visor);
    this.astronautLimbs.visor = visor;

    // Legs
    this.astronautLimbs.leftLeg = new THREE.Group();
    this.astronautLimbs.leftLeg.position.set(-1.6, 5.2, 0);
    const thighL = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 4.2, 16), suitMat);
    thighL.position.y = -2.1;
    this.astronautLimbs.leftLeg.add(thighL);

    this.astronautLimbs.leftKnee = new THREE.Group();
    this.astronautLimbs.leftKnee.position.set(0, -4.2, 0);
    const shinL = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 4.2, 16), suitMat);
    shinL.position.y = -2.1;
    this.astronautLimbs.leftKnee.add(shinL);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 3.4), jointMat);
    bootL.position.set(0, -4.6, 0.6);
    this.astronautLimbs.leftKnee.add(bootL);
    this.astronautLimbs.leftLeg.add(this.astronautLimbs.leftKnee);
    this.astronaut.add(this.astronautLimbs.leftLeg);

    this.astronautLimbs.rightLeg = new THREE.Group();
    this.astronautLimbs.rightLeg.position.set(1.6, 5.2, 0);
    const thighR = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.0, 4.2, 16), suitMat);
    thighR.position.y = -2.1;
    this.astronautLimbs.rightLeg.add(thighR);

    this.astronautLimbs.rightKnee = new THREE.Group();
    this.astronautLimbs.rightKnee.position.set(0, -4.2, 0);
    const shinR = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 4.2, 16), suitMat);
    shinR.position.y = -2.1;
    this.astronautLimbs.rightKnee.add(shinR);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 3.4), jointMat);
    bootR.position.set(0, -4.6, 0.6);
    this.astronautLimbs.rightKnee.add(bootR);
    this.astronautLimbs.rightLeg.add(this.astronautLimbs.rightKnee);
    this.astronaut.add(this.astronautLimbs.rightLeg);

    // Arms
    this.astronautLimbs.leftArm = new THREE.Group();
    this.astronautLimbs.leftArm.position.set(-3.2, 10.8, 0);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 6.4, 16), suitMat);
    armL.position.y = -3.2;
    this.astronautLimbs.leftArm.add(armL);
    this.astronaut.add(this.astronautLimbs.leftArm);

    this.astronautLimbs.rightArm = new THREE.Group();
    this.astronautLimbs.rightArm.position.set(3.2, 10.8, 0);
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.8, 6.4, 16), suitMat);
    armR.position.y = -3.2;
    this.astronautLimbs.rightArm.add(armR);

    const wristScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.5, 0.2),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff })
    );
    wristScreen.position.set(0.6, -5.5, 0.4);
    this.astronautLimbs.rightArm.add(wristScreen);
    this.astronaut.add(this.astronautLimbs.rightArm);

    this.interiorGroup.add(this.astronaut);
  }

  // SCENE 3: Surface & Lab
  buildSurfaceScene() {
    this.surfaceGroup = new THREE.Group();
    this.scene.add(this.surfaceGroup);
  }

  buildLabScene() {
    this.labGroup = new THREE.Group();

    const labHull = new THREE.Mesh(
      new THREE.BoxGeometry(160, 90, 160),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, side: THREE.BackSide })
    );
    this.labGroup.add(labHull);

    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(90, 18, 45),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 })
    );
    bench.position.set(0, -26, 0);
    this.labGroup.add(bench);

    const chamberGeo = new THREE.CylinderGeometry(10, 10, 24, 24);
    const chamberMat = new THREE.MeshPhongMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.75,
      emissive: 0x0284c7
    });
    this.laserChamber = new THREE.Mesh(chamberGeo, chamberMat);
    this.laserChamber.position.set(0, -6, 0);
    this.labGroup.add(this.laserChamber);

    const labLight = new THREE.PointLight(0x00e5ff, 2.2, 120);
    labLight.position.set(0, 20, 0);
    this.labGroup.add(labLight);

    const labAmbient = new THREE.AmbientLight(0x1e293b, 1.2);
    this.labGroup.add(labAmbient);

    this.scene.add(this.labGroup);
  }

  // ================= MOUSE LOOK & DRAGGING =================
  onMouseDown(e) {
    this.isDraggingMouse = true;
    this.lastMousePos = { x: e.clientX, y: e.clientY };
    this.dragDistance = 0;
  }

  onMouseMove(e) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.isDraggingMouse) {
      const dx = e.clientX - this.lastMousePos.x;
      const dy = e.clientY - this.lastMousePos.y;
      this.dragDistance += Math.abs(dx) + Math.abs(dy);

      this.camYaw -= dx * 0.0055;
      this.camPitch += dy * 0.004;

      if (this.isWindshieldMode) {
        this.camPitch = Math.max(-0.45, Math.min(0.55, this.camPitch));
        this.camYaw = Math.max(-1.5, Math.min(1.5, this.camYaw));
      } else {
        this.camPitch = Math.max(-0.25, Math.min(0.75, this.camPitch));
      }

      this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
  }

  onMouseUp(e) {
    this.isDraggingMouse = false;
  }

  onWheel(e) {
    if (this.isWindshieldMode) return;
    e.preventDefault();
    this.camDistance = Math.max(12, Math.min(48, this.camDistance + e.deltaY * 0.03));
  }

  onKeyDown(e) {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.key === 'ArrowUp') this.keys.forward = true;
    if (k === 's' || e.key === 'ArrowDown') this.keys.backward = true;
    if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
    if (k === 'd' || e.key === 'ArrowRight') this.keys.right = true;

    if (e.key === 'Escape' && this.isWindshieldMode) {
      this.exitWindshieldView();
    }

    if (k === 'e') {
      if (this.isWindshieldMode) {
        this.exitWindshieldView();
      } else if (this.nearestStation && this.onStationInteractCallback) {
        if (this.nearestStation.userData.stationKey === 'windshield' || this.nearestStation.userData.stationKey === 'airlock') {
          this.enterWindshieldView();
        } else {
          this.onStationInteractCallback(this.nearestStation.userData.stationKey);
        }
      }
    }
  }

  onKeyUp(e) {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.key === 'ArrowUp') this.keys.forward = false;
    if (k === 's' || e.key === 'ArrowDown') this.keys.backward = false;
    if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
    if (k === 'd' || e.key === 'ArrowRight') this.keys.right = false;
  }

  onCanvasClick(e) {
    // If dragged mouse to look around, do not register as click-to-move
    if (this.dragDistance > 6) return;
    if (!this.raycaster || !this.camera || this.currentSceneName !== 'interior') return;
    if (this.isWindshieldMode) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const hits = this.raycaster.intersectObjects(this.interactiveObjects, true);
    if (hits.length > 0) {
      let hit = hits[0].object;
      while (hit && !hit.userData.stationKey && hit.parent) {
        hit = hit.parent;
      }
      if (hit && hit.userData.stationKey) {
        const targetStationKey = hit.userData.stationKey;
        if (targetStationKey === 'windshield' || targetStationKey === 'airlock') {
          this.enterWindshieldView();
          return;
        }

        const stationObj = this.stations[targetStationKey];
        if (stationObj) {
          const targetX = targetStationKey === 'bench' ? 0 : (stationObj.position.x > 0 ? 12 : -12);
          const targetZ = stationObj.position.z;
          this.setClickTarget(targetX, targetZ, () => {
            if (this.onStationInteractCallback) {
              this.onStationInteractCallback(targetStationKey);
            }
          });
          return;
        }
      }
    }

    if (this.floorMesh) {
      const floorHits = this.raycaster.intersectObject(this.floorMesh);
      if (floorHits.length > 0) {
        const pt = floorHits[0].point;
        this.setClickTarget(pt.x, pt.z);
      }
    }
  }

  // ================= COCKPIT WINDSHIELD VIEWPORT TOGGLE =================
  enterWindshieldView() {
    this.isWindshieldMode = true;
    this.camYaw = 0;
    this.camPitch = 0.05;
    if (this.audioRef) this.audioRef.playWindshieldWhoosh();
    if (this.onWindshieldViewToggle) this.onWindshieldViewToggle(true);
  }

  exitWindshieldView() {
    this.isWindshieldMode = false;
    this.camYaw = 0;
    this.camPitch = 0.22;
    if (this.audioRef) this.audioRef.playClick();
    if (this.onWindshieldViewToggle) this.onWindshieldViewToggle(false);
  }

  toggleWindshieldView() {
    if (this.isWindshieldMode) this.exitWindshieldView();
    else this.enterWindshieldView();
  }

  setClickTarget(x, z, onArrival = null) {
    if (this.isWindshieldMode) return;
    const clampedX = Math.max(-24, Math.min(24, x));
    const clampedZ = Math.max(-62, Math.min(62, z));

    this.clickTarget = { x: clampedX, z: clampedZ, onArrival };

    if (this.clickTargetMarker) {
      this.clickTargetMarker.position.set(clampedX, -30.8, clampedZ);
      this.clickTargetMarker.material.opacity = 0.85;
    }
  }

  updatePlayerMovement(delta) {
    if (!this.astronaut || this.currentSceneName !== 'interior' || this.isWindshieldMode) return;

    let moveX = 0;
    let moveZ = 0;

    if (this.keys.forward) moveZ -= 1;
    if (this.keys.backward) moveZ += 1;
    if (this.keys.left) moveX -= 1;
    if (this.keys.right) moveX += 1;

    if (this.clickTarget) {
      const dx = this.clickTarget.x - this.playerPos.x;
      const dz = this.clickTarget.z - this.playerPos.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 1.2) {
        moveX = dx / dist;
        moveZ = dz / dist;
      } else {
        const arrivalCb = this.clickTarget.onArrival;
        this.clickTarget = null;
        if (this.clickTargetMarker) this.clickTargetMarker.material.opacity = 0;
        if (arrivalCb) arrivalCb();
      }
    }

    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      moveX /= len;
      moveZ /= len;
      this.isMoving = true;
      this.targetRotation = Math.atan2(moveX, moveZ);
    } else {
      this.isMoving = false;
    }

    const speed = 28.0;
    this.playerVel.x = THREE.MathUtils.lerp(this.playerVel.x, moveX * speed, 0.2);
    this.playerVel.z = THREE.MathUtils.lerp(this.playerVel.z, moveZ * speed, 0.2);

    this.playerPos.x += this.playerVel.x * delta;
    this.playerPos.z += this.playerVel.z * delta;

    this.playerPos.x = Math.max(-26, Math.min(26, this.playerPos.x));
    this.playerPos.z = Math.max(-65, Math.min(65, this.playerPos.z));

    this.astronaut.position.x = this.playerPos.x;
    this.astronaut.position.z = this.playerPos.z;

    let diff = this.targetRotation - this.astronaut.rotation.y;
    while (diff < -Math.PI) diff += Math.PI * 2;
    while (diff > Math.PI) diff -= Math.PI * 2;
    this.astronaut.rotation.y += diff * 0.18;

    if (this.isMoving && len > 0.05) {
      this.walkCycle += delta * 12;

      this.astronautLimbs.leftLeg.rotation.x = Math.sin(this.walkCycle) * 0.55;
      this.astronautLimbs.rightLeg.rotation.x = -Math.sin(this.walkCycle) * 0.55;

      this.astronautLimbs.leftKnee.rotation.x = Math.max(0, -Math.sin(this.walkCycle) * 0.5);
      this.astronautLimbs.rightKnee.rotation.x = Math.max(0, Math.sin(this.walkCycle) * 0.5);

      this.astronautLimbs.leftArm.rotation.x = -Math.sin(this.walkCycle) * 0.4;
      this.astronautLimbs.rightArm.rotation.x = Math.sin(this.walkCycle) * 0.4;

      this.astronaut.position.y = this.playerPos.y + Math.abs(Math.sin(this.walkCycle)) * 0.4;

      const now = performance.now();
      if (Math.abs(Math.sin(this.walkCycle)) > 0.92 && now - this.lastFootstepTime > 320) {
        if (this.audioRef) this.audioRef.playFootstep();
        this.lastFootstepTime = now;
      }
    } else {
      this.astronautLimbs.leftLeg.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.leftLeg.rotation.x, 0, 0.1);
      this.astronautLimbs.rightLeg.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.rightLeg.rotation.x, 0, 0.1);
      this.astronautLimbs.leftKnee.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.leftKnee.rotation.x, 0, 0.1);
      this.astronautLimbs.rightKnee.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.rightKnee.rotation.x, 0, 0.1);
      this.astronautLimbs.leftArm.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.leftArm.rotation.x, 0, 0.1);
      this.astronautLimbs.rightArm.rotation.x = THREE.MathUtils.lerp(this.astronautLimbs.rightArm.rotation.x, 0, 0.1);

      this.astronaut.position.y = this.playerPos.y + Math.sin(this.animTime * 2.2) * 0.15;
    }

    this.checkStationProximity();
  }

  checkStationProximity() {
    let closest = null;
    let minDist = 16.0;

    for (const key in this.stations) {
      const st = this.stations[key];
      const dist = Math.hypot(st.position.x - this.playerPos.x, st.position.z - this.playerPos.z);
      if (dist < minDist) {
        minDist = dist;
        closest = st;
      }
    }

    if (closest !== this.nearestStation) {
      this.nearestStation = closest;
      if (closest) {
        if (this.onStationNearCallback) {
          this.onStationNearCallback(closest.userData.stationKey, closest.userData.label);
        }
      } else {
        if (this.onStationLeaveCallback) {
          this.onStationLeaveCallback();
        }
      }
    }
  }

  setActiveObjectiveStation(stationKey) {
    this.activeObjectiveStation = stationKey;
  }

  switchScene(sceneName) {
    this.currentSceneName = sceneName;
    this.isWindshieldMode = false;

    if (this.spaceGroup) this.spaceGroup.visible = (sceneName === 'space');
    if (this.interiorGroup) this.interiorGroup.visible = (sceneName === 'interior');
    if (this.surfaceGroup) this.surfaceGroup.visible = (sceneName === 'lunar_surface');
    if (this.labGroup) this.labGroup.visible = (sceneName === 'lab');

    if (sceneName === 'space') {
      this.camTargetPos = { x: 45, y: 35, z: 140 };
      this.camTargetLook = { x: 0, y: 0, z: 0 };
    } else if (sceneName === 'interior') {
      this.camYaw = 0;
      this.camPitch = 0.22;
      this.camDistance = 34;
    } else if (sceneName === 'lab') {
      this.camTargetPos = { x: 0, y: 12, z: 75 };
      this.camTargetLook = { x: 0, y: -6, z: 0 };
    }
  }

  triggerModuleDetachment() {
    this.isModuleDetached = true;
    this.shakeIntensity = 20;
  }

  triggerScreenShake(intensity = 16) {
    this.shakeIntensity = intensity;
  }

  onWindowResize() {
    if (!this.renderer || !this.camera) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  // ================= MAIN RENDER LOOP =================
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = 0.016;
    this.animTime += delta;

    // 1. Interior Scene Dynamics
    if (this.currentSceneName === 'interior') {
      this.updatePlayerMovement(delta);
      this.updateMonitorCanvases(this.animTime);

      // Pulse Beacons outside on Moon
      if (this.roverBeaconLight) {
        this.roverBeaconLight.intensity = Math.sin(this.animTime * 6) * 1.5 + 1.8;
      }
      if (this.crashBeaconLight) {
        this.crashBeaconLight.intensity = Math.sin(this.animTime * 4) * 2.0 + 2.0;
      }
      if (this.outsideEarthMesh) {
        this.outsideEarthMesh.rotation.y += 0.001;
      }

      // Station Floor Ring Glow
      for (const key in this.stations) {
        const ring = this.stations[key].userData.floorRing;
        if (ring) {
          if (this.activeObjectiveStation === key) {
            const p = Math.sin(this.animTime * 5) * 0.4 + 0.6;
            ring.material.opacity = p;
            ring.scale.set(1 + p * 0.15, 1 + p * 0.15, 1);
          } else {
            ring.material.opacity = 0.35;
            ring.scale.set(1, 1, 1);
          }
        }
      }

      // 2. Camera Positioning: Windshield Mode vs Orbital 3rd Person
      if (this.camera) {
        if (this.isWindshieldMode) {
          // Cockpit Windshield Panoramic View
          this.camTargetPos.x = 0;
          this.camTargetPos.y = -8.5;
          this.camTargetPos.z = -75;

          const lookDist = 200;
          this.camTargetLook.x = Math.sin(this.camYaw) * lookDist;
          this.camTargetLook.y = -8.5 - Math.sin(this.camPitch) * 80;
          this.camTargetLook.z = -75 - Math.cos(this.camYaw) * lookDist;
        } else {
          // Free Mouse-Orbit 3rd Person Follow Camera
          const lookX = this.playerPos.x;
          const lookY = this.playerPos.y + 8;
          const lookZ = this.playerPos.z;

          const hDist = this.camDistance * Math.cos(this.camPitch);
          const vDist = this.camDistance * Math.sin(this.camPitch);

          this.camTargetPos.x = lookX + Math.sin(this.camYaw) * hDist;
          this.camTargetPos.y = lookY + vDist;
          this.camTargetPos.z = lookZ + Math.cos(this.camYaw) * hDist;

          this.camTargetLook.x = lookX;
          this.camTargetLook.y = lookY;
          this.camTargetLook.z = lookZ - 4;
        }
      }
    }

    // 3. Smooth Camera Lerp & Screen Shake
    if (this.camera) {
      let shakeX = 0;
      let shakeY = 0;
      if (this.shakeIntensity > 0) {
        shakeX = (Math.random() - 0.5) * this.shakeIntensity;
        shakeY = (Math.random() - 0.5) * this.shakeIntensity;
        this.shakeIntensity *= 0.92;
        if (this.shakeIntensity < 0.2) this.shakeIntensity = 0;
      }

      const lerpSpeed = this.isWindshieldMode ? 0.08 : 0.06;
      this.camera.position.x += (this.camTargetPos.x + shakeX - this.camera.position.x) * lerpSpeed;
      this.camera.position.y += (this.camTargetPos.y + shakeY - this.camera.position.y) * lerpSpeed;
      this.camera.position.z += (this.camTargetPos.z - this.camera.position.z) * lerpSpeed;

      this.camera.lookAt(
        this.camTargetLook.x,
        this.camTargetLook.y,
        this.camTargetLook.z
      );
    }

    // 4. Planet Earth & Space Scene Dynamics
    if (this.earthMesh) {
      this.earthMesh.rotation.y += 0.0015;
    }

    if (this.spacecraftGroup && this.currentSceneName === 'space') {
      this.spacecraftGroup.position.y = Math.sin(this.animTime * 1.5) * 3;
      this.spacecraftGroup.rotation.z = Math.sin(this.animTime * 0.8) * 0.03;

      if (this.isModuleDetached && this.resourceModuleMesh) {
        this.resourceModuleMesh.position.x -= 0.6;
        this.resourceModuleMesh.position.y -= 0.3;
        this.resourceModuleMesh.rotation.z += 0.03;
      }
    }

    // 5. Lab Laser Chamber
    if (this.laserChamber && this.currentSceneName === 'lab') {
      const pulse = Math.sin(this.animTime * 6) * 0.2 + 0.8;
      this.laserChamber.scale.set(pulse, 1, pulse);
    }

    // 6. Render
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  initFallback2D() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const render2D = () => {
      ctx.fillStyle = '#050815';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00e5ff';
      ctx.font = '22px monospace';
      ctx.fillText('Moon Water Research 3D Engine Active', 40, 80);
      requestAnimationFrame(render2D);
    };
    render2D();
  }
}
