# 🔴 MARS OUTPOST: SEVEN DAYS TO SURVIVE
### WebAssembly (WASM) 2D Resource-Management Survival Game

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-Nagpur%202026-blue.svg)](https://www.spaceappschallenge.org/2026/local-events/nagpur)
[![Challenge](https://img.shields.io/badge/Challenge-Junior%20Astronaut%20Mission%20Trainer-orange.svg)](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details)
[![Architecture](https://img.shields.io/badge/Architecture-C%2B%2B%20%2F%20WebAssembly%20(WASM)-brightgreen.svg)](#3-technology-stack--architecture)
[![Team](https://img.shields.io/badge/Team-Base8-brightgreen.svg)](#2-team-details)

> **Mission Objective:** Keep the entire astronaut crew alive, maintain life-support infrastructure, and survive seven Martian days (Sols) until Earth's delayed resupply freighter *Valkyrie-1* touches down on Mars.

---

## 1. Project Overview & Problem Statement

### **Project:** MARS OUTPOST: SEVEN DAYS TO SURVIVE
**Challenge:** [Build a Junior Astronaut Mission Trainer](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details)  
**Host Event:** NASA Space Apps Challenge 2026 — Nagpur (WCEM / ICTRD / AstraVeda)  
**Subjects:** Space Exploration, Life Support Systems (ECLSS), WebAssembly, Physics Simulation, STEM Education  

### Mission Lore
You assume the role of Outpost Commander stationed at Chryse Planitia on Mars. An unexpected navigation and thruster burn error delays Earth's scheduled resupply spacecraft (*Valkyrie-1*) by **seven Martian Sols**. 

With non-negotiable metabolic demands, abrasive dust storms, extreme -85°C nights, and hypervelocity micrometeoroids, you must manage power distribution, in-situ oxygen generation (MOXIE), water distillation, and astronaut morale to ensure the entire crew survives.

---

## 2. Team Details

**Team Name:** Base8  

| Member Name | Home Institution | GitHub Username | Role / Contribution |
|---|---|---|---|
| **Neel Tawre** | *[Institution]* | [@nirukun](https://github.com/nirukun) | Team Lead & Systems Architect |
| **Viral Bodbe** | *[Institution]* | *[@username]* | Game Engine & Physics Simulation |
| **Sanket Paradkar** | *[Institution]* | *[@username]* | UI/UX & WebGL2 Canvas Visuals |
| **Gauri Choudhary** | *[Institution]* | *[@username]* | Educational Content & NASA Research |
| **Dharti Charpe** | *[Institution]* | *[@username]* | Audio Synthesis & Asset Integration |

---

## 3. Technology Stack & Architecture

The game is built with a genuine **WebAssembly (WASM)** core architecture. All life-support physics, resource calculations, determinism, and state machines are authored in modern C++ and compiled to standard WebAssembly.

```
+------------------------------------------------------------------------+
|                          BROWSER APPLICATION                           |
|                                                                        |
|  +--------------------+   +---------------------+   +---------------+  |
|  | WebGL2 / Canvas 2D |   |  Web Audio Engine   |   | UI Shell / HUD|  |
|  | Interactive Outpost|   |  Martian Atmosphere |   | Daily Modals  |  |
|  +--------------------+   +---------------------+   +---------------+  |
|            ^                         ^                      ^          |
|            |                         |                      |          |
|  +---------+-------------------------+----------------------+-------+  |
|  |                JavaScript WebAssembly Bridge                     |  |
|  |                    (mars_outpost_wasm.js)                        |  |
|  +------------------------------------------------------------------+  |
|                                  | (Direct C ABI Calls & Linear Memory)|
|                                  v                                     |
|  +------------------------------------------------------------------+  |
|  |               NATIVE WEBASSEMBLY ENGINE (WASM 1.0)               |  |
|  |                       (mars_outpost.wasm)                        |  |
|  |                                                                  |  |
|  |  * MOXIE Solid Oxide Electrolysis Model (CO2 -> O2)              |  |
|  |  * ECLSS Water Recovery & Distillation Math                      |  |
|  |  * Solar Attenuation & Atmospheric Dust (Beer-Lambert Tau)       |  |
|  |  * Subsystem Power Dispatch & Battery Discharge Dynamics        |  |
|  |  * Astronaut Circadian & Metabolic Degradation                   |  |
|  |  * Daily Sol State Machine & Deterministic PRNG                  |  |
|  +------------------------------------------------------------------+  |
|                                  ^                                     |
|                                  | (Compiled via Emscripten / build)   |
|  +------------------------------------------------------------------+  |
|  |                      C++ SOURCE CODE BASE                        |  |
|  |               (mars_outpost.cpp / mars_outpost.h)                |  |
+--+------------------------------------------------------------------+--+
```

### Key Technologies
- **C++17 Engine:** `mars_outpost.h` & `mars_outpost.cpp`
- **WebAssembly (WASM):** `mars_outpost.wasm` compiled for high performance.
- **Hardware-Accelerated Canvas:** WebGL2 & Canvas 2D rendering of interactive habitat domes, animated conduits, tracking solar arrays, micrometeoroid showers, and thruster-assisted landing.
- **Web Audio API:** Real-time synthesis of pneumatic airlock venting, MOXIE pump hums, emergency klaxons, and Martian atmospheric wind.
- **Original Asset Pipeline:** Integrated meteorites (`Meteor_01-10.png`), explosions, rockets, and status items from `assets/`.

---

## 4. 5-Phase Daily Gameplay Loop

Every Martian Sol follows a strict 5-phase structure:

1. **Phase 1 — Daily Situation Report:**
   - Planetary meteorological scan (Optical Depth $\tau$, Ambient Temp, Solar Irradiance, Radiation Level).
   - Mission alert level and morning crew condition.
2. **Phase 2 — Resource Management:**
   - Real-time balances of **Oxygen**, **Electricity**, **Clean Water**, **Food Rations**, and **Hull Integrity**.
   - Live net delta calculation ($+\Delta / -\Delta$ per Sol).
3. **Phase 3 — Outpost Management & EVA Maintenance:**
   - Electrical power dispatch across 5 major subsystems.
   - Crew rationing policies (Half, Normal, Feast).
   - EVA Spacewalk Action Points (AP): Clean solar panels, service MOXIE, overhaul water distillers, patch outer hull, and treat crew.
4. **Phase 4 — Unexpected Martian Scenarios:**
   - Sols 1-7 feature distinct historical and scientifically accurate emergencies (Dust devils, Synoptic storms, ECLSS ruptures, Solar Particle Events, Meteoroid strikes, and Valkyrie-1 Terminal Guidance).
   - 3 tactical choices per incident with real trade-offs and NASA scientific explanations.
5. **Phase 5 — End-of-Sol Telemetry Debrief:**
   - Full audit of resources consumed, generated, remaining, and crew health delta carrying over to the next Sol.

---

## 5. Scientific Accuracy & Educational Integration

The simulation incorporates verified NASA and CSA engineering references:

- **MOXIE (Mars Oxygen In-Situ Resource Utilization Experiment):** Solid oxide electrolysis at 800°C converting $2\text{CO}_2 \rightarrow 2\text{CO} + \text{O}_2$.
- **ECLSS Closed-Loop Water Recovery:** Vacuum Compression Distillation (VCD) and Urine Processor Assembly (UPA) reclaiming over 95% of humidity and wastewater.
- **Atmospheric Dust & Solar Flux:** Beer-Lambert law ($I = I_0 \cdot e^{-\tau}$) modeling how dust storms diminish solar output down to twilight levels.
- **Space Radiation Shielding:** Mitigation of Galactic Cosmic Rays (GCR) and Solar Particle Events (SPE) using hydrogenous polymers, water shielding, and regolith bunkers.
- **Space Aeroponics:** Closed-loop nutrient misting accelerating plant biomass growth without soil.
- **Interactive Field Manual:** In-game encyclopedia accessible anytime via the **FIELD MANUAL** button.

---

## 6. Local Setup & Execution Guide

The game executes through a local development server:

### Prerequisites
- Python 3.8+ (or Bun / Node.js)
- Modern desktop browser (Chrome, Edge, Firefox, Safari)

### Run with Local Dev Server
```bash
# Clone the repository
git clone git@github.com:VOIRUZ/app-for-education.git
cd app-for-education

# Start local server (Python 3)
python -m http.server 8080

# Alternatively, run with Bun:
# bun run --port 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your web browser.

### Recompiling the WebAssembly Engine
If you wish to modify the C++ simulation logic:

```bash
# With Python WASM Assembler:
python build_wasm.py

# Or with Emscripten SDK (emcc):
make
# or
emcc mars_outpost.cpp -O3 -s WASM=1 -o mars_outpost.js
```

---

## 7. AI Usage Disclosure

*In strict compliance with Section 5 of the NASA Space Apps Challenge Participant Rulebook:*

- **AI Tools Employed:** **Gemini 3.8 Flash** (Google DeepMind).
- **Scope of Assistance:**
  - Mathematical modeling of ECLSS consumption ratios and Mars atmospheric dust attenuation formulas.
  - Assistance with WebAssembly binary bytecode specification construction.
  - Reviewing responsive UI layout and audio synthesis parameter tuning.
- **Human Engineering & Integration:**
  - All core game logic, system architecture choices, UI/UX asset implementations, and final integrations are authored, tested, and verified by human team members of **Base8**.
- **Authorship Compliance:**
  - No AI tools, bots, or co-author tags are assigned as git commit authors. All commits are authored by human contributors.
