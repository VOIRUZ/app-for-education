# 🌙 MOON H₂O: SEVEN DAYS ALONE
### 3D Realistic Space Science, Astronaut Exploration & Lunar Survival Simulation

An immersive, event-driven 3D space adventure where you explore your spacecraft, operate real NASA life-support systems, solve critical daily emergencies, and manage transparent resource trade-offs.

---

## 🎮 What's New & Upgraded

1. **🧑‍🚀 Walkable 3D Astronaut Character:**
   - Move freely inside the spacecraft cabin with **`[W][A][S][D]`** / **Arrow Keys** or **Click-to-Move** on the deck.
   - Realistic kinematics: animated leg stride, knee bend, arm counter-swing, torso bobbing, and magnetic space boot footstep audio.
   - Smooth 3rd-person orbital tracking camera that dynamically glides behind your astronaut.

2. **🚀 Realistic 3D Spaceship & Station Consoles (No More Blocky Shapes!):**
   - High-polygon 48-segment smooth curved cabin hull with authentic NASA quilted thermal insulation blankets.
   - Heavy structural bulkhead arches with recessed LED rim lighting.
   - Industrial non-slip grated floor deck with illuminated emergency guide strips.
   - 6 Interactive station pods with real-time animated monitor displays (oscillating waveforms, gas pressure dials, radar sweep needles, and spectrometry charts).
   - Circular Observation Cupola overlooking the cratered lunar surface and Earth.

3. **🚨 Event-Driven Gameplay (More Action, Drastically Reduced Dialogues):**
   - No more clicking through walls of text!
   - Each Sol triggers an immediate high-stakes **Emergency / Mission Event** with sliding alarm banners, klaxons, and pulsing station floor beacons.
   - Walk your astronaut to the target station, resolve the incident through hands-on science mini-games, and make critical decisions.

4. **⚖️ Transparent Trade-Offs (Cost vs Advantage Breakdown):**
   - Every single option across all 7 days explicitly shows:
     - **💎 ADVANTAGE / GAIN:** What facility or resource benefit you receive.
     - **⚠️ COST / LOSS YOU BEAR:** The exact sacrifice in water, power, oxygen, or comfort.
     - **🔔 REMINDER:** Operational caution about future consequences.
     - Color-coded resource delta pills showing immediate numerical impacts.

5. **🧑‍🚀 Realistic Astronaut Vector Avatars:**
   - **Commander Frisk:** White aerospace exploration helmet, curved gold/cyan visor with holographic HUD overlay, neck seal ring, and oxygen valves.
   - **Specialist Asriel:** Rugged polar lunar EVA helmet, gold sun visor reflecting crater rims, exterior floodlight, and high-gain comms antenna.
   - **CAPCOM Flight Director:** NASA headset with boom mic, tactical monitor reflection glasses, and flight vest.

6. **✍️ Flawless Typography & Spacing:**
   - Typewriter engine revamped with preserved spacing tokens—words appear instantly with clean, legible spacing and zero text crumbling.

---

## 🕹️ Controls

| Action | Control |
|---|---|
| **Move Astronaut** | `[W][A][S][D]` or `[↑][←][↓][→]` |
| **Click to Walk** | Left-click anywhere on the spaceship floor |
| **Interact with Station** | Press `[E]` or Click station when in range |
| **Advance Dialogue** | Left-click dialogue box or press `[Space]` / `[Enter]` |
| **Open Research Database** | Click floating `📚 NASA RESEARCH DATABASE` button |
| **Toggle Sound** | Click `🔊 AUDIO ON` in top HUD |

---

## 📅 The 7-Day Event-Driven Campaign

| Sol | Event Title | Station Target | Hands-On Science Event |
|---|---|---|---|
| **Sol 1** | **The Oxygen Leak** | Oxygen Generator | Electrolysis water-splitting reaction ($2\text{H}_2\text{O} \rightarrow 2\text{H}_2 + \text{O}_2$) |
| **Sol 2** | **Solar Array Brownout** | Power Grid | Rebalance power draw of heaters & life support against damaged solar bus |
| **Sol 3** | **Water Recovery Failure** | Water Recycler | Assemble 3-stage ECLSS mesh, activated carbon, and reverse osmosis filter |
| **Sol 4** | **Telemetry Signal Drift** | Comms Terminal | Tune parabolic dish azimuth to clear cosmic static and lock carrier signal |
| **Sol 5** | **Toxic CO₂ Surge** | Science Workbench | Cycle molecular zeolite desiccant beds to flush toxic carbon dioxide |
| **Sol 6** | **Point of No Return** | Power Grid | Ignite emergency catalytic hydrogen fuel cell for power and water burst |
| **Sol 7** | **The Rescue & Choice** | Cupola Airlock | Dock rover cart and decide humanity's path: **Return to Earth** vs **Continue Moon Research** |

---

## 🚀 How to Play Locally

### Option 1: One-Click Python Launcher
Open PowerShell or Command Prompt in this folder and run:
```bash
python run_game.py
```
*This boots the local mission server at `http://localhost:8085` and automatically opens your default browser!*

### Option 2: Direct Browser Launch
Open `index.html` directly in Google Chrome, Microsoft Edge, Brave, or Firefox.

---

## 👥 Team: Base8

| Member | Role / Focus |
|---|---|
| **Viral Bodbe** | Team Leader |
| **Neel Tawre** | Team Member |
| **Sanket Paradkar** | Team Member |
| **Gauri Choudhary** | Team Member |
| **Dharti Charpe** | Team Member |

---

## 🎨 Technology Highlights
- **100% Native WebGL & Three.js r128:** Full 3D rendering with custom procedural textures, soft shadows, and dynamic canvas monitor maps.
- **Procedural Web Audio API:** Zero external audio files—pure mathematical sound synthesis for magnetic boots, alarms, radio squelch, laser spectrometers, and hums.
- **Zero WASM / Zero Build Tools:** Pure standards-compliant web technologies that run instantly in any modern browser.

---

## 📚 References & Resources 

- [NASA Space Apps Challenge 2026 - Challenge Details](https://www.spaceappschallenge.org/2026/challenges/junior-astronaut-mission-trainer/?tab=details)
- [NASA Artemis Program](https://www.nasa.gov/specials/artemis/)
- [NASA Mars Exploration](https://mars.nasa.gov/)
- [NASA Life Support Systems (ECLSS)](https://www.nasa.gov/international-space-station/space-station-environmental-control-and-life-support-system/)
- [NASA MOXIE Instrument on Perseverance](https://mars.nasa.gov/mars2020/spacecraft/instruments/moxie/)
