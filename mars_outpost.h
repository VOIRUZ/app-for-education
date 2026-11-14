/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Core Game Engine & Life-Support Simulation
 * ============================================================================
 * Developed for NASA Space Apps Challenge 2026 - Junior Astronaut Mission Trainer
 * 
 * Language: C++17 / WebAssembly
 * Architecture: Deterministic simulation model of NASA ECLSS (Environmental Control
 *               and Life Support System), MOXIE oxygen generation, solar irradiance,
 *               and astronaut metabolic survival dynamics.
 * ============================================================================
 */

#ifndef MARS_OUTPOST_H
#define MARS_OUTPOST_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// ============================================================================
// CONSTANTS & ENUMERATIONS
// ============================================================================

#define TOTAL_SOLS             7
#define CREW_SIZE              4
#define NUM_RESOURCES          7
#define NUM_SUBSYSTEMS         6
#define MAX_EVENT_OPTIONS      3
#define BASE_ACTION_POINTS     3

// Resource Identifiers
enum ResourceType {
    RES_OXYGEN = 0,     // Stored Oxygen (kg)
    RES_POWER = 1,      // Battery Energy Reserves (kWh)
    RES_WATER = 2,      // Recycled Potable Water (Liters)
    RES_FOOD = 3,       // Packaged Food Rations (Meals)
    RES_HULL = 4,       // Outpost Structural Integrity (0 - 100%)
    RES_HEALTH = 5,     // Crew Aggregate Physical Health (0 - 100%)
    RES_MORALE = 6      // Crew Psychological Morale (0 - 100%)
};

// Outpost Subsystem Identifiers
enum SubsystemType {
    SYS_LIFE_SUPPORT = 0,    // MOXIE O2 & LiOH Carbon Dioxide Scrubbers
    SYS_WATER_RECYCLER = 1,  // ECLSS Urine Processing & Condensate Loop
    SYS_AEROPONICS = 2,      // LED Hydroponic Growth Chambers
    SYS_POWER_GRID = 3,      // Solar Arrays & RTG Auxiliary Grid
    SYS_SHIELDING = 4,       // Active Magnetic Barrier & Regolith Bunkers
    SYS_COMMS_BEACON = 5     // Deep Space Network Guidance Beacon
};

// Daily Loop Phases
enum GamePhase {
    PHASE_SITUATION_REPORT = 0,  // Morning telemetry & briefing
    PHASE_RESOURCE_ALLOC = 1,    // Subsystem power & rationing choices
    PHASE_MAINTENANCE = 2,       // EVA repairs & preventative maintenance
    PHASE_UNEXPECTED_EVENT = 3,  // Environmental or technical emergency
    PHASE_DAY_SUMMARY = 4        // End-of-Sol audit & telemetry log
};

// Game Status
enum GameStatus {
    STATUS_PLAYING = 0,
    STATUS_VICTORY = 1,
    STATUS_DEFEAT = 2
};

// Defeat Cause Codes
enum DefeatReason {
    DEFEAT_NONE = 0,
    DEFEAT_ASPHYXIATION = 1,     // O2 depleted to 0
    DEFEAT_POWER_COLLAPSE = 2,   // Power 0 during freezing night
    DEFEAT_DEHYDRATION = 3,      // Water depleted to 0
    DEFEAT_STARVATION = 4,       // Food depleted to 0
    DEFEAT_HULL_BREACH = 5,      // Structural integrity reached 0
    DEFEAT_CREW_FATALITY = 6,    // Crew health reached 0
    DEFEAT_MORALE_BREAKDOWN = 7  // Morale collapsed to 0
};

// Ration Policies
enum RationLevel {
    RATION_HALF = 0,    // 50% consumption (-health / -morale)
    RATION_NORMAL = 1,  // 100% nominal consumption (sustainable)
    RATION_FEAST = 2    // 150% consumption (+health / +morale recovery)
};

// Astronaut Crew Data
struct CrewMember {
    char name[32];
    char role[32];
    float health;        // 0.0 - 100.0
    float morale;        // 0.0 - 100.0
    bool injured;
    char specialty[32];  // e.g. "ECLSS", "Power", "Biology", "EVA"
};

// Subsystem Status
struct SubsystemState {
    float power_allocated;  // Percentage 0 - 100%
    float efficiency;       // Operating efficiency 0.0 - 1.0
    float condition;        // Wear & tear condition 0 - 100%
    bool is_damaged;
    bool is_offline;
};

// Daily Telemetry Record
struct SolReport {
    int sol;
    float res_consumed[NUM_RESOURCES];
    float res_produced[NUM_RESOURCES];
    float res_start[NUM_RESOURCES];
    float res_end[NUM_RESOURCES];
    float health_delta;
    float morale_delta;
    char event_title[64];
    char choice_made[64];
    char consequence_summary[256];
};

// Active Scenario Event
struct GameEvent {
    int id;
    char title[64];
    char description[256];
    char scientific_context[384];
    char option_text[MAX_EVENT_OPTIONS][96];
    char option_desc[MAX_EVENT_OPTIONS][160];
    int option_cost_res[MAX_EVENT_OPTIONS];     // Resource ID consumed
    float option_cost_val[MAX_EVENT_OPTIONS];   // Amount consumed
};

// Outpost Master State
struct OutpostState {
    int current_sol;             // 1 to 7
    int current_phase;           // GamePhase enum
    int game_status;             // GameStatus enum
    int defeat_reason;           // DefeatReason enum
    int action_points_remaining; // For repairs/maintenance

    // Resource Quantities (Current, Min Safe, Max Capacity)
    float resource_current[NUM_RESOURCES];
    float resource_max[NUM_RESOURCES];
    float resource_daily_prod[NUM_RESOURCES];
    float resource_daily_cons[NUM_RESOURCES];

    // Ration Policies
    int food_ration_level;   // RationLevel
    int water_ration_level;  // RationLevel

    // Subsystems
    SubsystemState subsystems[NUM_SUBSYSTEMS];

    // Crew
    CrewMember crew[CREW_SIZE];

    // Environment Conditions for Current Sol
    float ambient_temp_celsius; // e.g. -65 C
    float dust_opacity_tau;     // Optical depth Tau (0.3 normal, 2.5 heavy storm)
    float solar_irradiance;     // W/m^2 (nominal Mars ~590 W/m^2)
    float radiation_sieverts;   // mSv/day (nominal ~0.67 mSv, storm ~15 mSv)

    // Current Event
    GameEvent current_event;
    int selected_event_option;

    // History Log
    SolReport history[TOTAL_SOLS];

    // Random Number Generator Seed
    uint32_t rng_state;
};

// ============================================================================
// WASM EXPORTED FUNCTION DECLARATIONS (C ABI for Emscripten)
// ============================================================================

void wasm_init_game(uint32_t seed);
int wasm_get_sol(void);
int wasm_get_phase(void);
void wasm_set_phase(int phase);
int wasm_get_game_status(void);
int wasm_get_defeat_reason(void);

// Resource Telemetry
float wasm_get_resource_value(int res_id);
float wasm_get_resource_max(int res_id);
float wasm_get_resource_prod(int res_id);
float wasm_get_resource_cons(int res_id);

// Subsystem Control
void wasm_set_subsystem_power(int sys_id, float percent);
float wasm_get_subsystem_power(int sys_id);
float wasm_get_subsystem_efficiency(int sys_id);
float wasm_get_subsystem_condition(int sys_id);

// Ration Controls
void wasm_set_ration_policy(int policy_type, int level);
int wasm_get_ration_policy(int policy_type);

// Outpost Actions & Operations
int wasm_get_action_points(void);
bool wasm_perform_maintenance(int sys_id);
bool wasm_perform_crew_treatment(int crew_idx);

// Event Handling
void wasm_prepare_sol_event(int sol);
int wasm_get_event_id(void);
const char* wasm_get_event_title(void);
const char* wasm_get_event_desc(void);
const char* wasm_get_event_science(void);
const char* wasm_get_event_option_text(int opt_idx);
const char* wasm_get_event_option_desc(int opt_idx);
bool wasm_choose_event_option(int opt_idx);

// Sol Day Progression
bool wasm_advance_sol(void);

// Crew Telemetry
float wasm_get_crew_health(int crew_idx);
float wasm_get_crew_morale(int crew_idx);
const char* wasm_get_crew_name(int crew_idx);
const char* wasm_get_crew_role(int crew_idx);

// Environmental Sensors
float wasm_get_ambient_temp(void);
float wasm_get_dust_tau(void);
float wasm_get_solar_flux(void);
float wasm_get_radiation_msv(void);

// Performance / Score Calculation
int wasm_calculate_mission_score(void);

// State Memory Access
const OutpostState* wasm_get_state_ptr(void);

#ifdef __cplusplus
}
#endif

#endif // MARS_OUTPOST_H
