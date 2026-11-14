/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE - WebAssembly Integration Bridge
 * ============================================================================
 * Bridges the compiled C++ WebAssembly module (mars_outpost.wasm) to the browser.
 * Provides high-level JavaScript APIs, typed memory views, and robust error recovery.
 * ============================================================================
 */

class MarsWasmBridge {
  constructor() {
    this.wasmInstance = null;
    this.exports = null;
    this.memory = null;
    this.isLoaded = false;
  }

  /**
   * Initializes the WebAssembly binary module.
   * Employs WebAssembly.instantiateStreaming with seamless fallback to ArrayBuffer
   * to guarantee compatibility across all local and production development servers.
   */
  async loadWasm(wasmUrl = 'mars_outpost.wasm') {
    try {
      console.log(`[WASM] Loading Mars Outpost Core Engine from: ${wasmUrl}...`);
      
      const importObject = {
        env: {
          memory: new WebAssembly.Memory({ initial: 2, maximum: 16 }),
          abort: () => console.error("[WASM] Engine abort triggered"),
          js_log: (ptr, len) => console.log("[WASM Native Log]:", ptr, len)
        }
      };

      let result;
      // Try streaming instantiation first
      if (typeof WebAssembly.instantiateStreaming === 'function') {
        try {
          const response = await fetch(wasmUrl);
          if (response.ok && response.headers.get('content-type') === 'application/wasm') {
            result = await WebAssembly.instantiateStreaming(fetch(wasmUrl), importObject);
          }
        } catch (streamingErr) {
          console.warn("[WASM] Streaming compile fallback triggered:", streamingErr);
        }
      }

      // Robust fallback: fetch arrayBuffer then instantiate
      if (!result) {
        const response = await fetch(wasmUrl);
        if (!response.ok) {
          throw new Error(`HTTP Error fetching ${wasmUrl}: ${response.status} ${response.statusText}`);
        }
        const bytes = await response.arrayBuffer();
        result = await WebAssembly.instantiate(bytes, importObject);
      }

      this.wasmInstance = result.instance || result;
      this.exports = this.wasmInstance.exports;
      this.memory = this.exports.memory;
      this.isLoaded = true;

      console.log("[WASM] Core Engine initialized successfully. Native functions bound:", Object.keys(this.exports).length);
      return true;
    } catch (err) {
      console.error("[WASM] Critical error loading WebAssembly binary:", err);
      return false;
    }
  }

  // ==========================================================================
  // WRAPPED C++ WASM METHODS
  // ==========================================================================

  initGame(seed = Date.now()) {
    if (!this.isLoaded) return;
    this.exports.wasm_init_game(seed & 0xFFFFFFFF);
  }

  getSol() {
    return this.isLoaded ? this.exports.wasm_get_sol() : 1;
  }

  getPhase() {
    return this.isLoaded ? this.exports.wasm_get_phase() : 0;
  }

  setPhase(phase) {
    if (this.isLoaded) this.exports.wasm_set_phase(phase);
  }

  getGameStatus() {
    // 0 = Playing, 1 = Victory, 2 = Defeat
    return this.isLoaded ? this.exports.wasm_get_game_status() : 0;
  }

  getDefeatReason() {
    return this.isLoaded ? this.exports.wasm_get_defeat_reason() : 0;
  }

  getResourceValue(resId) {
    return this.isLoaded ? this.exports.wasm_get_resource_value(resId) : 0;
  }

  getResourceMax(resId) {
    return this.isLoaded ? this.exports.wasm_get_resource_max(resId) : 100;
  }

  getResourceProd(resId) {
    return this.isLoaded ? this.exports.wasm_get_resource_prod(resId) : 0;
  }

  getResourceCons(resId) {
    return this.isLoaded ? this.exports.wasm_get_resource_cons(resId) : 0;
  }

  setSubsystemPower(sysId, percent) {
    if (this.isLoaded) this.exports.wasm_set_subsystem_power(sysId, percent);
  }

  getSubsystemPower(sysId) {
    return this.isLoaded ? this.exports.wasm_get_subsystem_power(sysId) : 100;
  }

  getSubsystemEfficiency(sysId) {
    return this.isLoaded ? this.exports.wasm_get_subsystem_efficiency(sysId) : 1.0;
  }

  getSubsystemCondition(sysId) {
    return this.isLoaded ? this.exports.wasm_get_subsystem_condition(sysId) : 100;
  }

  setRationPolicy(type, level) {
    // type: 0 = Food, 1 = Water; level: 0 = Half, 1 = Normal, 2 = Feast
    if (this.isLoaded) this.exports.wasm_set_ration_policy(type, level);
  }

  getRationPolicy(type) {
    return this.isLoaded ? this.exports.wasm_get_ration_policy(type) : 1;
  }

  getActionPoints() {
    return this.isLoaded ? this.exports.wasm_get_action_points() : 0;
  }

  performMaintenance(sysId) {
    return this.isLoaded ? (this.exports.wasm_perform_maintenance(sysId) === 1) : false;
  }

  chooseEventOption(optIdx) {
    return this.isLoaded ? (this.exports.wasm_choose_event_option(optIdx) === 1) : false;
  }

  advanceSol() {
    return this.isLoaded ? (this.exports.wasm_advance_sol() === 1) : false;
  }

  getAmbientTemp() {
    return this.isLoaded ? this.exports.wasm_get_ambient_temp() : -60.0;
  }

  getDustTau() {
    return this.isLoaded ? this.exports.wasm_get_dust_tau() : 0.35;
  }

  getSolarFlux() {
    return this.isLoaded ? this.exports.wasm_get_solar_flux() : 550.0;
  }

  getRadiationMsv() {
    return this.isLoaded ? this.exports.wasm_get_radiation_msv() : 0.65;
  }

  getCrewHealth(crewIdx) {
    return this.isLoaded ? this.exports.wasm_get_crew_health(crewIdx) : 100.0;
  }

  getCrewMorale(crewIdx) {
    return this.isLoaded ? this.exports.wasm_get_crew_morale(crewIdx) : 100.0;
  }

  calculateMissionScore() {
    return this.isLoaded ? this.exports.wasm_calculate_mission_score() : 0;
  }

  /**
   * Direct Linear Memory Access
   * Returns a Float32Array view directly mapped to the C++ memory pool
   */
  getMemoryFloatView() {
    if (!this.memory) return null;
    return new Float32Array(this.memory.buffer);
  }

  getMemoryIntView() {
    if (!this.memory) return null;
    return new Int32Array(this.memory.buffer);
  }
}

// Export for ES modules or global window attachment
if (typeof window !== 'undefined') {
  window.MarsWasmBridge = MarsWasmBridge;
}
