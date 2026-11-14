# ============================================================================
# MARS OUTPOST: SEVEN DAYS TO SURVIVE - Emscripten Build Makefile
# ============================================================================

CC = emcc
CXX = em++

CFLAGS = -O3 -std=c++17 -Wall
EMFLAGS = -s WASM=1 \
          -s ALLOW_MEMORY_GROWTH=1 \
          -s INITIAL_MEMORY=655360 \
          -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall","getValue","setValue","UTF8ToString","stringToUTF8"]' \
          -s EXPORTED_FUNCTIONS='["_wasm_init_game","_wasm_get_sol","_wasm_get_phase","_wasm_set_phase","_wasm_get_game_status","_wasm_get_defeat_reason","_wasm_get_resource_value","_wasm_get_resource_max","_wasm_get_resource_prod","_wasm_get_resource_cons","_wasm_set_subsystem_power","_wasm_get_subsystem_power","_wasm_get_subsystem_efficiency","_wasm_get_subsystem_condition","_wasm_set_ration_policy","_wasm_get_ration_policy","_wasm_get_action_points","_wasm_perform_maintenance","_wasm_perform_crew_treatment","_wasm_prepare_sol_event","_wasm_get_event_id","_wasm_get_event_title","_wasm_get_event_desc","_wasm_get_event_science","_wasm_get_event_option_text","_wasm_get_event_option_desc","_wasm_choose_event_option","_wasm_advance_sol","_wasm_get_crew_health","_wasm_get_crew_morale","_wasm_get_crew_name","_wasm_get_crew_role","_wasm_get_ambient_temp","_wasm_get_dust_tau","_wasm_get_solar_flux","_wasm_get_radiation_msv","_wasm_calculate_mission_score","_wasm_get_state_ptr"]' \
          -s NO_EXIT_RUNTIME=1 \
          -s MODULARIZE=1 \
          -s EXPORT_NAME='MarsOutpostModule'

all: mars_outpost.wasm

mars_outpost.wasm: mars_outpost.cpp mars_outpost.h
	$(CXX) $(CFLAGS) mars_outpost.cpp $(EMFLAGS) -o mars_outpost.js

clean:
	rm -f mars_outpost.js mars_outpost.wasm
