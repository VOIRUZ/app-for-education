/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Core Game Engine & Life-Support Simulation Implementation
 * ============================================================================
 * Developed for NASA Space Apps Challenge 2026 - Junior Astronaut Mission Trainer
 * ============================================================================
 */

#include "mars_outpost.h"
#include <string.h>
#include <math.h>

// Master singleton state instance
static OutpostState g_state;

// ============================================================================
// PSEUDO-RANDOM NUMBER GENERATOR (Deterministic Linear Congruential Generator)
// ============================================================================
static uint32_t lcg_rand(void) {
    g_state.rng_state = g_state.rng_state * 1664525u + 1013904223u;
    return g_state.rng_state;
}

static float rand_range(float min_val, float max_val) {
    uint32_t r = lcg_rand();
    float normalized = (float)(r & 0xFFFF) / 65535.0f;
    return min_val + normalized * (max_val - min_val);
}

// Helper clamp
static float clampf(float val, float min_val, float max_val) {
    if (val < min_val) return min_val;
    if (val > max_val) return max_val;
    return val;
}

// ============================================================================
// GAME INITIALIZATION
// ============================================================================
void wasm_init_game(uint32_t seed) {
    memset(&g_state, 0, sizeof(OutpostState));
    g_state.rng_state = (seed == 0) ? 133742u : seed;

    g_state.current_sol = 1;
    g_state.current_phase = PHASE_SITUATION_REPORT;
    g_state.game_status = STATUS_PLAYING;
    g_state.defeat_reason = DEFEAT_NONE;
    g_state.action_points_remaining = BASE_ACTION_POINTS;

    // --- Resources Baseline ---
    // RES_OXYGEN (kg)
    g_state.resource_current[RES_OXYGEN] = 60.0f;
    g_state.resource_max[RES_OXYGEN]     = 100.0f;

    // RES_POWER (kWh battery storage)
    g_state.resource_current[RES_POWER]  = 120.0f;
    g_state.resource_max[RES_POWER]      = 160.0f;

    // RES_WATER (Liters)
    g_state.resource_current[RES_WATER]  = 110.0f;
    g_state.resource_max[RES_WATER]      = 180.0f;

    // RES_FOOD (Meal packs)
    g_state.resource_current[RES_FOOD]   = 72.0f;
    g_state.resource_max[RES_FOOD]       = 100.0f;

    // RES_HULL (% integrity)
    g_state.resource_current[RES_HULL]   = 95.0f;
    g_state.resource_max[RES_HULL]       = 100.0f;

    // RES_HEALTH (% average)
    g_state.resource_current[RES_HEALTH] = 100.0f;
    g_state.resource_max[RES_HEALTH]     = 100.0f;

    // RES_MORALE (% average)
    g_state.resource_current[RES_MORALE] = 92.0f;
    g_state.resource_max[RES_MORALE]     = 100.0f;

    // Policies
    g_state.food_ration_level = RATION_NORMAL;
    g_state.water_ration_level = RATION_NORMAL;

    // --- Subsystems Default Configuration ---
    for (int i = 0; i < NUM_SUBSYSTEMS; ++i) {
        g_state.subsystems[i].power_allocated = 100.0f;
        g_state.subsystems[i].efficiency = 1.0f;
        g_state.subsystems[i].condition = 95.0f;
        g_state.subsystems[i].is_damaged = false;
        g_state.subsystems[i].is_offline = false;
    }

    // --- Crew Roster ---
    strncpy(g_state.crew[0].name, "Cmdr. Sarah Chen", 31);
    strncpy(g_state.crew[0].role, "Mission Commander", 31);
    strncpy(g_state.crew[0].specialty, "Command / EVA", 31);
    g_state.crew[0].health = 100.0f;
    g_state.crew[0].morale = 95.0f;
    g_state.crew[0].injured = false;

    strncpy(g_state.crew[1].name, "Dr. Marcus Vance", 31);
    strncpy(g_state.crew[1].role, "Life Support Engineer", 31);
    strncpy(g_state.crew[1].specialty, "ECLSS / MOXIE", 31);
    g_state.crew[1].health = 100.0f;
    g_state.crew[1].morale = 92.0f;
    g_state.crew[1].injured = false;

    strncpy(g_state.crew[2].name, "Elena Rostova", 31);
    strncpy(g_state.crew[2].role, "Astrobotanist", 31);
    strncpy(g_state.crew[2].specialty, "Aeroponics", 31);
    g_state.crew[2].health = 100.0f;
    g_state.crew[2].morale = 90.0f;
    g_state.crew[2].injured = false;

    strncpy(g_state.crew[3].name, "Dr. Tariq Al-Mansoor", 31);
    strncpy(g_state.crew[3].role, "Systems Specialist", 31);
    strncpy(g_state.crew[3].specialty, "Power / Regolith", 31);
    g_state.crew[3].health = 100.0f;
    g_state.crew[3].morale = 91.0f;
    g_state.crew[3].injured = false;

    // Environmental parameters for Sol 1
    g_state.ambient_temp_celsius = -62.0f;
    g_state.dust_opacity_tau = 0.35f;
    g_state.solar_irradiance = 560.0f;
    g_state.radiation_sieverts = 0.65f; // mSv/sol

    // Prepare Day 1 Scenario Event
    wasm_prepare_sol_event(1);
}

// ============================================================================
// SYSTEM SIMULATION & TELEMETRY CALCULATIONS
// ============================================================================
static void recalculate_resource_rates(void) {
    // 1. Oxygen (MOXIE & LiOH scrubbers)
    // Crew consumption: ~0.84 kg/astronaut/sol -> 3.36 kg/sol total
    float base_o2_cons = 3.36f;
    g_state.resource_daily_cons[RES_OXYGEN] = base_o2_cons;

    // Production: MOXIE output proportional to power and condition
    float moxie_power_factor = g_state.subsystems[SYS_LIFE_SUPPORT].power_allocated / 100.0f;
    float moxie_cond_factor  = g_state.subsystems[SYS_LIFE_SUPPORT].condition / 100.0f;
    float moxie_eff          = g_state.subsystems[SYS_LIFE_SUPPORT].efficiency;
    float max_moxie_yield    = 4.60f; // kg/sol at peak
    g_state.resource_daily_prod[RES_OXYGEN] = max_moxie_yield * moxie_power_factor * moxie_cond_factor * moxie_eff;

    // 2. Power (Solar arrays + RTG)
    // Solar production follows Beer-Lambert attenuation: I = I0 * exp(-tau)
    float dust_factor = expf(-clampf(g_state.dust_opacity_tau, 0.2f, 3.0f));
    float solar_gen_peak = 115.0f; // kWh/sol in clear skies
    float solar_power = solar_gen_peak * dust_factor * (g_state.subsystems[SYS_POWER_GRID].condition / 100.0f);
    float rtg_base = 25.0f; // Nuclear RTG provides uninterrupted base power
    g_state.resource_daily_prod[RES_POWER] = solar_power + rtg_base;

    // Power consumption: Subsystems draw power based on allocated %
    float life_support_draw = 35.0f * (g_state.subsystems[SYS_LIFE_SUPPORT].power_allocated / 100.0f);
    float water_rec_draw    = 22.0f * (g_state.subsystems[SYS_WATER_RECYCLER].power_allocated / 100.0f);
    float aero_draw         = 20.0f * (g_state.subsystems[SYS_AEROPONICS].power_allocated / 100.0f);
    float shield_draw       = 24.0f * (g_state.subsystems[SYS_SHIELDING].power_allocated / 100.0f);
    float comms_draw        = 12.0f * (g_state.subsystems[SYS_COMMS_BEACON].power_allocated / 100.0f);
    float hab_heating_draw  = 18.0f; // Baseline life habitat thermal stabilization
    g_state.resource_daily_cons[RES_POWER] = life_support_draw + water_rec_draw + aero_draw + shield_draw + comms_draw + hab_heating_draw;

    // 3. Water (Recycled condensate + Urine processor)
    // Consumption: 4 astronauts * 2.8 L = 11.2 L/sol
    float water_cons_mult = 1.0f;
    if (g_state.water_ration_level == RATION_HALF) water_cons_mult = 0.55f;
    else if (g_state.water_ration_level == RATION_FEAST) water_cons_mult = 1.35f;
    g_state.resource_daily_cons[RES_WATER] = 11.2f * water_cons_mult;

    // Recycler recovers up to 92% of wastewater if powered and conditioned
    float w_power_factor = g_state.subsystems[SYS_WATER_RECYCLER].power_allocated / 100.0f;
    float w_cond_factor  = g_state.subsystems[SYS_WATER_RECYCLER].condition / 100.0f;
    float max_recovery_rate = 0.90f;
    g_state.resource_daily_prod[RES_WATER] = g_state.resource_daily_cons[RES_WATER] * max_recovery_rate * w_power_factor * w_cond_factor;

    // 4. Food (Rations & Aeroponics)
    // Base crew consumption: 4 * 3 meals = 12 meals/sol
    float food_cons_mult = 1.0f;
    if (g_state.food_ration_level == RATION_HALF) food_cons_mult = 0.50f;
    else if (g_state.food_ration_level == RATION_FEAST) food_cons_mult = 1.50f;
    g_state.resource_daily_cons[RES_FOOD] = 12.0f * food_cons_mult;

    // Aeroponics produces supplemental fresh yield (up to 3.5 ration equivalents/sol)
    float a_power_factor = g_state.subsystems[SYS_AEROPONICS].power_allocated / 100.0f;
    float a_cond_factor  = g_state.subsystems[SYS_AEROPONICS].condition / 100.0f;
    g_state.resource_daily_prod[RES_FOOD] = 3.5f * a_power_factor * a_cond_factor;

    // 5. Hull degradation baseline (slight atmospheric abrasion / thermal cycles)
    g_state.resource_daily_prod[RES_HULL] = 0.0f;
    g_state.resource_daily_cons[RES_HULL] = 1.5f;

    // 6. Health & Morale baseline
    g_state.resource_daily_prod[RES_HEALTH] = 0.0f;
    g_state.resource_daily_cons[RES_HEALTH] = 0.0f;
    g_state.resource_daily_prod[RES_MORALE] = 0.0f;
    g_state.resource_daily_cons[RES_MORALE] = 0.0f;
}

// ============================================================================
// STATE INSPECTION & TELEMETRY ACCESSORS
// ============================================================================
int wasm_get_sol(void) { return g_state.current_sol; }
int wasm_get_phase(void) { return g_state.current_phase; }
void wasm_set_phase(int phase) { 
    g_state.current_phase = phase; 
    recalculate_resource_rates();
}

int wasm_get_game_status(void) { return g_state.game_status; }
int wasm_get_defeat_reason(void) { return g_state.defeat_reason; }

float wasm_get_resource_value(int res_id) {
    if (res_id < 0 || res_id >= NUM_RESOURCES) return 0.0f;
    return g_state.resource_current[res_id];
}

float wasm_get_resource_max(int res_id) {
    if (res_id < 0 || res_id >= NUM_RESOURCES) return 100.0f;
    return g_state.resource_max[res_id];
}

float wasm_get_resource_prod(int res_id) {
    recalculate_resource_rates();
    if (res_id < 0 || res_id >= NUM_RESOURCES) return 0.0f;
    return g_state.resource_daily_prod[res_id];
}

float wasm_get_resource_cons(int res_id) {
    recalculate_resource_rates();
    if (res_id < 0 || res_id >= NUM_RESOURCES) return 0.0f;
    return g_state.resource_daily_cons[res_id];
}

void wasm_set_subsystem_power(int sys_id, float percent) {
    if (sys_id < 0 || sys_id >= NUM_SUBSYSTEMS) return;
    g_state.subsystems[sys_id].power_allocated = clampf(percent, 0.0f, 100.0f);
    recalculate_resource_rates();
}

float wasm_get_subsystem_power(int sys_id) {
    if (sys_id < 0 || sys_id >= NUM_SUBSYSTEMS) return 0.0f;
    return g_state.subsystems[sys_id].power_allocated;
}

float wasm_get_subsystem_efficiency(int sys_id) {
    if (sys_id < 0 || sys_id >= NUM_SUBSYSTEMS) return 0.0f;
    return g_state.subsystems[sys_id].efficiency;
}

float wasm_get_subsystem_condition(int sys_id) {
    if (sys_id < 0 || sys_id >= NUM_SUBSYSTEMS) return 0.0f;
    return g_state.subsystems[sys_id].condition;
}

void wasm_set_ration_policy(int policy_type, int level) {
    if (level < 0 || level > 2) return;
    if (policy_type == 0) {
        g_state.food_ration_level = level;
    } else if (policy_type == 1) {
        g_state.water_ration_level = level;
    }
    recalculate_resource_rates();
}

int wasm_get_ration_policy(int policy_type) {
    if (policy_type == 0) return g_state.food_ration_level;
    return g_state.water_ration_level;
}

int wasm_get_action_points(void) {
    return g_state.action_points_remaining;
}

bool wasm_perform_maintenance(int sys_id) {
    if (g_state.action_points_remaining <= 0) return false;
    if (sys_id < 0 || sys_id >= NUM_SUBSYSTEMS) return false;

    // Restore subsystem condition
    g_state.subsystems[sys_id].condition = clampf(g_state.subsystems[sys_id].condition + 30.0f, 0.0f, 100.0f);
    g_state.subsystems[sys_id].is_damaged = false;
    g_state.subsystems[sys_id].efficiency = 1.0f;

    // If repairing hull
    if (sys_id == SYS_SHIELDING) {
        g_state.resource_current[RES_HULL] = clampf(g_state.resource_current[RES_HULL] + 15.0f, 0.0f, 100.0f);
    }

    g_state.action_points_remaining--;
    recalculate_resource_rates();
    return true;
}

bool wasm_perform_crew_treatment(int crew_idx) {
    if (g_state.action_points_remaining <= 0) return false;
    if (crew_idx < 0 || crew_idx >= CREW_SIZE) return false;

    g_state.crew[crew_idx].health = clampf(g_state.crew[crew_idx].health + 25.0f, 0.0f, 100.0f);
    g_state.crew[crew_idx].morale = clampf(g_state.crew[crew_idx].morale + 20.0f, 0.0f, 100.0f);
    g_state.crew[crew_idx].injured = false;

    g_state.action_points_remaining--;
    return true;
}

// Environmental readings
float wasm_get_ambient_temp(void) { return g_state.ambient_temp_celsius; }
float wasm_get_dust_tau(void) { return g_state.dust_opacity_tau; }
float wasm_get_solar_flux(void) { return g_state.solar_irradiance; }
float wasm_get_radiation_msv(void) { return g_state.radiation_sieverts; }

// Crew telemetry
float wasm_get_crew_health(int crew_idx) {
    if (crew_idx < 0 || crew_idx >= CREW_SIZE) return 0.0f;
    return g_state.crew[crew_idx].health;
}

float wasm_get_crew_morale(int crew_idx) {
    if (crew_idx < 0 || crew_idx >= CREW_SIZE) return 0.0f;
    return g_state.crew[crew_idx].morale;
}

const char* wasm_get_crew_name(int crew_idx) {
    if (crew_idx < 0 || crew_idx >= CREW_SIZE) return "";
    return g_state.crew[crew_idx].name;
}

const char* wasm_get_crew_role(int crew_idx) {
    if (crew_idx < 0 || crew_idx >= CREW_SIZE) return "";
    return g_state.crew[crew_idx].role;
}

// ============================================================================
// DYNAMIC MARS SCENARIOS & EVENT DEFINITIONS (SOL 1 TO 7)
// ============================================================================
void wasm_prepare_sol_event(int sol) {
    g_state.selected_event_option = -1;
    g_state.current_event.id = sol;

    switch (sol) {
        case 1:
            strncpy(g_state.current_event.title, "Supply Vessel Delay: Sol 1 Baseline", 63);
            strncpy(g_state.current_event.description,
                "Mission Control confirms the Earth resupply freighter 'Valkyrie-1' suffered a second-stage ignition anomaly. Arrival delayed by 7 Sols. Outpost life-support autonomy must be calibrated immediately.", 255);
            strncpy(g_state.current_event.scientific_context,
                "NASA ECLSS protocols require closed-loop resource recycling. On Mars, resupply missions take 6-9 months; self-sufficiency through MOXIE (in-situ oxygen production) and water recovery is mission-critical.", 383);

            strncpy(g_state.current_event.option_text[0], "Establish Strict ECLSS Conservation", 95);
            strncpy(g_state.current_event.option_desc[0], "Reduce auxiliary power by 15%, conserving 10 kWh battery buffer.", 159);
            g_state.current_event.option_cost_res[0] = RES_POWER;
            g_state.current_event.option_cost_val[0] = 0.0f; // Boosts buffer

            strncpy(g_state.current_event.option_text[1], "Overclock MOXIE Electrolysis Loop", 95);
            strncpy(g_state.current_event.option_desc[1], "Generate +8 kg emergency Oxygen immediately, consuming 18 kWh of power.", 159);
            g_state.current_event.option_cost_res[1] = RES_POWER;
            g_state.current_event.option_cost_val[1] = 18.0f;

            strncpy(g_state.current_event.option_text[2], "Prioritize Aeroponics Biomass", 95);
            strncpy(g_state.current_event.option_desc[2], "Infuse nutrient salts into greenhouse trays, netting +6 meals but drawing 8 L water.", 159);
            g_state.current_event.option_cost_res[2] = RES_WATER;
            g_state.current_event.option_cost_val[2] = 8.0f;

            // Environmental baseline
            g_state.ambient_temp_celsius = -60.0f;
            g_state.dust_opacity_tau = 0.35f;
            g_state.solar_irradiance = 560.0f;
            g_state.radiation_sieverts = 0.65f;
            break;

        case 2:
            strncpy(g_state.current_event.title, "Martian Dust Devil Incursion", 63);
            strncpy(g_state.current_event.description,
                "A thermal vortex (dust devil) swept directly across Photovoltaic Array Beta. Fine iron-oxide dust particles coat the panels, reducing electrical generation by 35%.", 255);
            strncpy(g_state.current_event.scientific_context,
                "Martian dust is electrostatic and clung to the rovers Opportunity and InSight, eventually starving them of solar power. NASA engineers rely on tilt mechanisms and compressed gas blowers.", 383);

            strncpy(g_state.current_event.option_text[0], "Emergency EVA: Manual Panel Brushing", 95);
            strncpy(g_state.current_event.option_desc[0], "Cmdr Chen cleans the array. Restores 100% solar output, but tires crew (-10% Morale).", 159);
            g_state.current_event.option_cost_res[0] = RES_MORALE;
            g_state.current_event.option_cost_val[0] = 10.0f;

            strncpy(g_state.current_event.option_text[1], "Fire Compressed Nitrogen Gas Thrusters", 95);
            strncpy(g_state.current_event.option_desc[1], "Automated pulse clears 80% dust. Consumes 4 kg Oxygen reserve gas.", 159);
            g_state.current_event.option_cost_res[1] = RES_OXYGEN;
            g_state.current_event.option_cost_val[1] = 4.0f;

            strncpy(g_state.current_event.option_text[2], "Accept Solar Loss & Rely on RTG Backup", 95);
            strncpy(g_state.current_event.option_desc[2], "Save crew energy and gas, but solar production remains curtailed (-25 kWh/sol).", 159);
            g_state.current_event.option_cost_res[2] = RES_POWER;
            g_state.current_event.option_cost_val[2] = 20.0f;

            g_state.ambient_temp_celsius = -64.0f;
            g_state.dust_opacity_tau = 0.65f;
            g_state.solar_irradiance = 480.0f;
            g_state.radiation_sieverts = 0.70f;
            break;

        case 3:
            strncpy(g_state.current_event.title, "Synoptic Martian Dust Storm", 63);
            strncpy(g_state.current_event.description,
                "A regional dust storm blankets the basin. Atmospheric optical depth (Tau) spikes to 1.8. Daytime sunlight is dimmed to twilight; outpost external temperatures plummet to -82°C.", 255);
            strncpy(g_state.current_event.scientific_context,
                "Global dust storms on Mars can loft particles 50 km high and last months. Without nuclear power (RTGs or kilopower reactors), a Martian base would freeze and run out of power within days.", 383);

            strncpy(g_state.current_event.option_text[0], "Activate RTG Deep Heat Exchangers", 95);
            strncpy(g_state.current_event.option_desc[0], "Reroute radioisotope thermal runoff directly to living habitats. Safely maintains warmth.", 159);
            g_state.current_event.option_cost_res[0] = RES_POWER;
            g_state.current_event.option_cost_val[0] = 5.0f;

            strncpy(g_state.current_event.option_text[1], "Mothball Aeroponics & Conserve Kilowatts", 95);
            strncpy(g_state.current_event.option_desc[1], "Shut down grow lights during storm. Saves 25 kWh power, but loses 8 food rations.", 159);
            g_state.current_event.option_cost_res[1] = RES_FOOD;
            g_state.current_event.option_cost_val[1] = 8.0f;

            strncpy(g_state.current_event.option_text[2], "Drain Reserve Batteries to Keep Full Operations", 95);
            strncpy(g_state.current_event.option_desc[2], "Burn through 35 kWh battery energy to sustain nominal outpost schedules.", 159);
            g_state.current_event.option_cost_res[2] = RES_POWER;
            g_state.current_event.option_cost_val[2] = 35.0f;

            g_state.ambient_temp_celsius = -82.0f;
            g_state.dust_opacity_tau = 1.85f;
            g_state.solar_irradiance = 190.0f;
            g_state.radiation_sieverts = 0.85f;
            break;

        case 4:
            strncpy(g_state.current_event.title, "ECLSS Primary Condensate Line Rupture", 63);
            strncpy(g_state.current_event.description,
                "A brass manifold in the Urine Processing Assembly ruptured from thermal contraction. Greywater is leaking into the sub-floor trench, and water recycling has halted!", 255);
            strncpy(g_state.current_event.scientific_context,
                "The ISS Environmental Control and Life Support System recycles over 98% of all water via vacuum distillation. A mechanical seal failure requires rapid isolation before biological or chemical contamination.", 383);

            strncpy(g_state.current_event.option_text[0], "Emergency Chemical Solder & Seal", 95);
            strncpy(g_state.current_event.option_desc[0], "Dr. Vance patches the conduit. Costs 5 kg structural epoxy/hull, but restores full recycling.", 159);
            g_state.current_event.option_cost_res[0] = RES_HULL;
            g_state.current_event.option_cost_val[0] = 5.0f;

            strncpy(g_state.current_event.option_text[1], "Switch to Emergency Reverse-Osmosis Siphon", 95);
            strncpy(g_state.current_event.option_desc[1], "Draws 15 kWh additional power to pressurize secondary membrane filters. Loses 8 L water.", 159);
            g_state.current_event.option_cost_res[1] = RES_WATER;
            g_state.current_event.option_cost_val[1] = 8.0f;

            strncpy(g_state.current_event.option_text[2], "Ration Water & Delay Repairs to Next Sol", 95);
            strncpy(g_state.current_event.option_desc[2], "Saves materials today, but water recycling remains broken (-10 L water loss tomorrow).", 159);
            g_state.current_event.option_cost_res[2] = RES_HEALTH;
            g_state.current_event.option_cost_val[2] = 8.0f;

            g_state.ambient_temp_celsius = -71.0f;
            g_state.dust_opacity_tau = 0.80f;
            g_state.solar_irradiance = 390.0f;
            g_state.radiation_sieverts = 0.68f;
            break;

        case 5:
            strncpy(g_state.current_event.title, "Coronal Mass Ejection: Solar Particle Event", 63);
            strncpy(g_state.current_event.description,
                "Space Weather satellite 'Deep Space-4' reports a major X-class solar flare directed at Mars. Energetic proton flux will reach the outpost within 4 hours!", 255);
            strncpy(g_state.current_event.scientific_context,
                "Mars lacks a global geomagnetic field. During Solar Particle Events (SPE), surface radiation can jump from ~0.6 mSv/day to over 10 mSv/day. Astronauts must shelter in hydrogen-rich water or regolith-shielded bunkers.", 383);

            strncpy(g_state.current_event.option_text[0], "Power Up Magnetic Deflection Barrier", 95);
            strncpy(g_state.current_event.option_desc[0], "Route 28 kWh into the superconducting coils. 100% crew radiation protection.", 159);
            g_state.current_event.option_cost_res[0] = RES_POWER;
            g_state.current_event.option_cost_val[0] = 28.0f;

            strncpy(g_state.current_event.option_text[1], "Evacuate Crew to Subsurface Water-Trench Bunker", 95);
            strncpy(g_state.current_event.option_desc[1], "Astronauts sleep in crowded storm cellar for 24 hours. Safe, but causes claustrophobia (-12% Morale).", 159);
            g_state.current_event.option_cost_res[1] = RES_MORALE;
            g_state.current_event.option_cost_val[1] = 12.0f;

            strncpy(g_state.current_event.option_text[2], "Inject Radioprotective Antioxidant Cocktails", 95);
            strncpy(g_state.current_event.option_desc[2], "Crew administers medical countermeasures. Partial cellular damage (-8% Crew Health).", 159);
            g_state.current_event.option_cost_res[2] = RES_HEALTH;
            g_state.current_event.option_cost_val[2] = 8.0f;

            g_state.ambient_temp_celsius = -65.0f;
            g_state.dust_opacity_tau = 0.45f;
            g_state.solar_irradiance = 520.0f;
            g_state.radiation_sieverts = 9.80f; // Critical radiation spike
            break;

        case 6:
            strncpy(g_state.current_event.title, "Micrometeoroid Shower & Hull Puncture", 63);
            strncpy(g_state.current_event.description,
                "A dense stream of hypervelocity micrometeoroids struck the habitation dome and Photovoltaic Array Alpha! Ultrasonic sensors sound rapid decompression in Science Lab B!", 255);
            strncpy(g_state.current_event.scientific_context,
                "Mars' atmosphere is only 1% as dense as Earth's, letting millimeter-sized space gravel reach terminal impact velocity (15 km/s). Whipple shields and automated fast-acting bulkhead valves are essential.", 383);

            strncpy(g_state.current_event.option_text[0], "Rapid Bulkhead Seal & Kevlar Patch", 95);
            strncpy(g_state.current_event.option_desc[0], "Seal the breach immediately. Loses 6 kg Oxygen before pressure stabilizes; restores hull safety.", 159);
            g_state.current_event.option_cost_res[0] = RES_OXYGEN;
            g_state.current_event.option_cost_val[0] = 6.0f;

            strncpy(g_state.current_event.option_text[1], "Sacrifice Science Module & Purge Airlock", 95);
            strncpy(g_state.current_event.option_desc[1], "Isolate and depressurize Lab B. Hull drops -12%, but preserves all remaining Oxygen.", 159);
            g_state.current_event.option_cost_res[1] = RES_HULL;
            g_state.current_event.option_cost_val[1] = 12.0f;

            strncpy(g_state.current_event.option_text[2], "Perform Emergency Night-EVA Repair", 95);
            strncpy(g_state.current_event.option_desc[2], "Dr. Al-Mansoor ventures outside in sub-zero dark to weld exterior plating. High risk (-15% Health to Dr. Tariq).", 159);
            g_state.current_event.option_cost_res[2] = RES_HEALTH;
            g_state.current_event.option_cost_val[2] = 15.0f;

            g_state.ambient_temp_celsius = -78.0f;
            g_state.dust_opacity_tau = 0.40f;
            g_state.solar_irradiance = 540.0f;
            g_state.radiation_sieverts = 0.75f;
            break;

        case 7:
            strncpy(g_state.current_event.title, "Terminal Descent of Resupply Ship 'Valkyrie-1'", 63);
            strncpy(g_state.current_event.description,
                "The 7-day ordeal reaches its climax! 'Valkyrie-1' has entered Mars transfer orbit and initiated its hypersonic aero-braking corridor. Outpost beacons must guide it to Landing Pad Alpha!", 255);
            strncpy(g_state.current_event.scientific_context,
                "Landing heavy payloads on Mars requires Supersonic Retro-Propulsion and real-time terminal radio telemetry. The outpost's radar transponders guide the lander through Martian turbulence.", 383);

            strncpy(g_state.current_event.option_text[0], "All Power to Deep-Space Guidance Beacon", 95);
            strncpy(g_state.current_event.option_desc[0], "Direct 30 kWh into landing transponders. Guarantees pinpoint touchdown and immediate resupply link!", 159);
            g_state.current_event.option_cost_res[0] = RES_POWER;
            g_state.current_event.option_cost_val[0] = 30.0f;

            strncpy(g_state.current_event.option_text[1], "Manual Optical Tracking from Command Cupola", 95);
            strncpy(g_state.current_event.option_desc[1], "Crew tracks descent trajectory visually with laser rangefinders. Consumes crew stamina (-15% Morale).", 159);
            g_state.current_event.option_cost_res[1] = RES_MORALE;
            g_state.current_event.option_cost_val[1] = 15.0f;

            strncpy(g_state.current_event.option_text[2], "Deploy Autonomous Retro-Beacon Flare", 95);
            strncpy(g_state.current_event.option_desc[2], "Launch solid rocket flare from rover bay. Consumes 5 kg reserve fuel/epoxy (-5% Hull).", 159);
            g_state.current_event.option_cost_res[2] = RES_HULL;
            g_state.current_event.option_cost_val[2] = 5.0f;

            g_state.ambient_temp_celsius = -62.0f;
            g_state.dust_opacity_tau = 0.32f;
            g_state.solar_irradiance = 570.0f;
            g_state.radiation_sieverts = 0.60f;
            break;
    }

    recalculate_resource_rates();
}

int wasm_get_event_id(void) { return g_state.current_event.id; }
const char* wasm_get_event_title(void) { return g_state.current_event.title; }
const char* wasm_get_event_desc(void) { return g_state.current_event.description; }
const char* wasm_get_event_science(void) { return g_state.current_event.scientific_context; }
const char* wasm_get_event_option_text(int opt_idx) {
    if (opt_idx < 0 || opt_idx >= MAX_EVENT_OPTIONS) return "";
    return g_state.current_event.option_text[opt_idx];
}
const char* wasm_get_event_option_desc(int opt_idx) {
    if (opt_idx < 0 || opt_idx >= MAX_EVENT_OPTIONS) return "";
    return g_state.current_event.option_desc[opt_idx];
}

bool wasm_choose_event_option(int opt_idx) {
    if (opt_idx < 0 || opt_idx >= MAX_EVENT_OPTIONS) return false;
    g_state.selected_event_option = opt_idx;

    int cost_res = g_state.current_event.option_cost_res[opt_idx];
    float cost_val = g_state.current_event.option_cost_val[opt_idx];

    // Deduct cost
    if (cost_res >= 0 && cost_res < NUM_RESOURCES && cost_val > 0.0f) {
        g_state.resource_current[cost_res] -= cost_val;
        if (g_state.resource_current[cost_res] < 0.0f) {
            g_state.resource_current[cost_res] = 0.0f;
        }
    }

    // Specific rewards / outcomes per Sol and option
    if (g_state.current_sol == 1 && opt_idx == 1) {
        g_state.resource_current[RES_OXYGEN] = clampf(g_state.resource_current[RES_OXYGEN] + 8.0f, 0.0f, g_state.resource_max[RES_OXYGEN]);
    } else if (g_state.current_sol == 1 && opt_idx == 2) {
        g_state.resource_current[RES_FOOD] = clampf(g_state.resource_current[RES_FOOD] + 6.0f, 0.0f, g_state.resource_max[RES_FOOD]);
    } else if (g_state.current_sol == 2 && opt_idx == 0) {
        g_state.subsystems[SYS_POWER_GRID].condition = 100.0f;
    } else if (g_state.current_sol == 4 && opt_idx == 0) {
        g_state.subsystems[SYS_WATER_RECYCLER].condition = 95.0f;
        g_state.subsystems[SYS_WATER_RECYCLER].efficiency = 1.0f;
    }

    recalculate_resource_rates();
    return true;
}

// ============================================================================
// SOL DAY PROGRESSION & END-OF-DAY AUDIT
// ============================================================================
bool wasm_advance_sol(void) {
    if (g_state.game_status != STATUS_PLAYING) return false;

    recalculate_resource_rates();

    int sol_idx = g_state.current_sol - 1;
    SolReport* report = &g_state.history[sol_idx];
    report->sol = g_state.current_sol;

    for (int r = 0; r < NUM_RESOURCES; ++r) {
        report->res_start[r] = g_state.resource_current[r];
        report->res_consumed[r] = g_state.resource_daily_cons[r];
        report->res_produced[r] = g_state.resource_daily_prod[r];

        // Apply net delta
        float net = report->res_produced[r] - report->res_consumed[r];
        g_state.resource_current[r] = clampf(g_state.resource_current[r] + net, 0.0f, g_state.resource_max[r]);
        report->res_end[r] = g_state.resource_current[r];
    }

    // Crew physiological & psychological simulation based on resource margins
    float health_drop = 0.0f;
    float morale_drop = 0.0f;

    // Oxygen deficit
    if (g_state.resource_current[RES_OXYGEN] <= 5.0f) {
        health_drop += 35.0f;
        morale_drop += 25.0f;
    } else if (g_state.resource_current[RES_OXYGEN] <= 15.0f) {
        health_drop += 12.0f;
        morale_drop += 10.0f;
    }

    // Water deficit
    if (g_state.resource_current[RES_WATER] <= 5.0f) {
        health_drop += 30.0f;
        morale_drop += 20.0f;
    } else if (g_state.water_ration_level == RATION_HALF) {
        health_drop += 3.0f;
        morale_drop += 6.0f;
    }

    // Food deficit
    if (g_state.resource_current[RES_FOOD] <= 0.0f) {
        health_drop += 20.0f;
        morale_drop += 15.0f;
    } else if (g_state.food_ration_level == RATION_HALF) {
        health_drop += 2.0f;
        morale_drop += 5.0f;
    } else if (g_state.food_ration_level == RATION_FEAST) {
        health_drop -= 4.0f; // Healing
        morale_drop -= 8.0f;
    }

    // Power collapse during freezing Martian night (-60C to -85C)
    if (g_state.resource_current[RES_POWER] <= 0.0f) {
        health_drop += 40.0f; // Hypothermia
        morale_drop += 30.0f;
    }

    // Radiation damage
    if (g_state.radiation_sieverts > 2.0f && g_state.subsystems[SYS_SHIELDING].power_allocated < 50.0f) {
        health_drop += 15.0f;
    }

    // Hull integrity breach penalty
    if (g_state.resource_current[RES_HULL] < 30.0f) {
        morale_drop += 15.0f;
        health_drop += 8.0f;
    }

    // Update each astronaut
    float total_health = 0.0f;
    float total_morale = 0.0f;
    for (int i = 0; i < CREW_SIZE; ++i) {
        g_state.crew[i].health = clampf(g_state.crew[i].health - health_drop + rand_range(-2.0f, 2.0f), 0.0f, 100.0f);
        g_state.crew[i].morale = clampf(g_state.crew[i].morale - morale_drop + rand_range(-2.0f, 2.0f), 0.0f, 100.0f);
        if (g_state.crew[i].health < 30.0f) {
            g_state.crew[i].injured = true;
        }
        total_health += g_state.crew[i].health;
        total_morale += g_state.crew[i].morale;
    }

    g_state.resource_current[RES_HEALTH] = total_health / (float)CREW_SIZE;
    g_state.resource_current[RES_MORALE] = total_morale / (float)CREW_SIZE;

    report->health_delta = -health_drop;
    report->morale_delta = -morale_drop;

    // Check Defeat Conditions
    if (g_state.resource_current[RES_OXYGEN] <= 0.0f) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_ASPHYXIATION;
        return false;
    }
    if (g_state.resource_current[RES_POWER] <= 0.0f && g_state.resource_daily_prod[RES_POWER] < g_state.resource_daily_cons[RES_POWER]) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_POWER_COLLAPSE;
        return false;
    }
    if (g_state.resource_current[RES_WATER] <= 0.0f) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_DEHYDRATION;
        return false;
    }
    if (g_state.resource_current[RES_FOOD] <= 0.0f && g_state.current_sol > 2) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_STARVATION;
        return false;
    }
    if (g_state.resource_current[RES_HULL] <= 0.0f) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_HULL_BREACH;
        return false;
    }
    if (g_state.resource_current[RES_HEALTH] <= 0.0f) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_CREW_FATALITY;
        return false;
    }
    if (g_state.resource_current[RES_MORALE] <= 0.0f) {
        g_state.game_status = STATUS_DEFEAT;
        g_state.defeat_reason = DEFEAT_MORALE_BREAKDOWN;
        return false;
    }

    // Check Victory Condition
    if (g_state.current_sol >= TOTAL_SOLS) {
        g_state.game_status = STATUS_VICTORY;
        return true;
    }

    // Advance to next Sol
    g_state.current_sol++;
    g_state.current_phase = PHASE_SITUATION_REPORT;
    g_state.action_points_remaining = BASE_ACTION_POINTS;

    // Prepare next day's event and environmental dynamics
    wasm_prepare_sol_event(g_state.current_sol);

    return true;
}

// Score Calculation
int wasm_calculate_mission_score(void) {
    if (g_state.game_status == STATUS_DEFEAT) {
        return g_state.current_sol * 1000;
    }

    int score = 10000; // Base completion bonus
    score += (int)(g_state.resource_current[RES_HEALTH] * 50.0f);
    score += (int)(g_state.resource_current[RES_MORALE] * 35.0f);
    score += (int)(g_state.resource_current[RES_OXYGEN] * 25.0f);
    score += (int)(g_state.resource_current[RES_POWER] * 15.0f);
    score += (int)(g_state.resource_current[RES_WATER] * 20.0f);
    score += (int)(g_state.resource_current[RES_FOOD] * 18.0f);
    score += (int)(g_state.resource_current[RES_HULL] * 40.0f);

    return score;
}

const OutpostState* wasm_get_state_ptr(void) {
    return &g_state;
}
