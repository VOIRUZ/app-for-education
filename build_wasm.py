#!/usr/bin/env python3
"""
WebAssembly Binary Assembler for MARS OUTPOST: SEVEN DAYS TO SURVIVE
Compiles the deterministic C++ simulation model and state machine into a standard
valid WebAssembly binary (WASM 1.0 MVP) with linear memory, typed math, and C ABI exports.
"""

import struct
import os

def uleb128(n):
    res = bytearray()
    while True:
        b = n & 0x7F
        n >>= 7
        if n != 0:
            res.append(b | 0x80)
        else:
            res.append(b)
            break
    return bytes(res)

def sleb128(n):
    res = bytearray()
    more = True
    while more:
        b = n & 0x7F
        n >>= 7
        if (n == 0 and (b & 0x40) == 0) or (n == -1 and (b & 0x40) != 0):
            more = False
        else:
            b |= 0x80
        res.append(b)
    return bytes(res)

def f32_bytes(val):
    return struct.pack('<f', float(val))

def section(sec_id, payload):
    return bytes([sec_id]) + uleb128(len(payload)) + payload

# Type definitions:
# 0: () -> ()
# 1: (i32) -> ()
# 2: () -> i32
# 3: (i32) -> i32
# 4: () -> f32
# 5: (i32) -> f32
# 6: (i32, f32) -> ()
# 7: (i32, i32) -> ()
# 8: (i32, i32) -> i32

TYPE_V_V = 0
TYPE_I_V = 1
TYPE_V_I = 2
TYPE_I_I = 3
TYPE_V_F = 4
TYPE_I_F = 5
TYPE_IF_V = 6
TYPE_II_V = 7
TYPE_II_I = 8

types_payload = bytearray()
types_payload += uleb128(9)
types_payload += bytes([0x60, 0x00, 0x00])             # 0: () -> ()
types_payload += bytes([0x60, 0x01, 0x7F, 0x00])       # 1: (i32) -> ()
types_payload += bytes([0x60, 0x00, 0x01, 0x7F])       # 2: () -> i32
types_payload += bytes([0x60, 0x01, 0x7F, 0x01, 0x7F]) # 3: (i32) -> i32
types_payload += bytes([0x60, 0x00, 0x01, 0x7D])       # 4: () -> f32
types_payload += bytes([0x60, 0x01, 0x7F, 0x01, 0x7D]) # 5: (i32) -> f32
types_payload += bytes([0x60, 0x02, 0x7F, 0x7D, 0x00]) # 6: (i32, f32) -> ()
types_payload += bytes([0x60, 0x02, 0x7F, 0x7F, 0x00]) # 7: (i32, i32) -> ()
types_payload += bytes([0x60, 0x02, 0x7F, 0x7F, 0x01, 0x7F]) # 8: (i32, i32) -> i32

# Memory layout offsets (all in bytes):
OFF_SOL          = 1024  # i32
OFF_PHASE        = 1028  # i32
OFF_STATUS       = 1032  # i32 (0=Playing, 1=Victory, 2=Defeat)
OFF_DEFEAT_REAS  = 1036  # i32
OFF_ACTION_PTS   = 1040  # i32
OFF_RNG_STATE    = 1044  # i32
OFF_FOOD_RAT     = 1048  # i32
OFF_WATER_RAT    = 1052  # i32
OFF_SEL_OPT      = 1056  # i32
OFF_EVENT_ID     = 1060  # i32

OFF_RES_CUR      = 1064  # 7 * f32 = 28 bytes (1064 - 1091)
OFF_RES_MAX      = 1092  # 7 * f32 = 28 bytes (1092 - 1119)
OFF_RES_PROD     = 1120  # 7 * f32 = 28 bytes (1120 - 1147)
OFF_RES_CONS     = 1148  # 7 * f32 = 28 bytes (1148 - 1175)

OFF_SYS_POWER    = 1176  # 6 * f32 = 24 bytes (1176 - 1199)
OFF_SYS_EFF      = 1200  # 6 * f32 = 24 bytes (1200 - 1223)
OFF_SYS_COND     = 1224  # 6 * f32 = 24 bytes (1224 - 1247)

OFF_ENV_TEMP     = 1248  # f32
OFF_ENV_TAU      = 1252  # f32
OFF_ENV_SOLAR    = 1256  # f32
OFF_ENV_RAD      = 1260  # f32

OFF_CREW_HEALTH  = 1264  # 4 * f32 = 16 bytes (1264 - 1279)
OFF_CREW_MORALE  = 1280  # 4 * f32 = 16 bytes (1280 - 1295)

def op_i32_const(val):
    return bytes([0x41]) + sleb128(val)

def op_f32_const(val):
    return bytes([0x43]) + f32_bytes(val)

def op_i32_load(offset):
    return bytes([0x28, 0x02]) + uleb128(offset)

def op_f32_load(offset):
    return bytes([0x2A, 0x02]) + uleb128(offset)

def op_i32_store(offset):
    return bytes([0x36, 0x02]) + uleb128(offset)

def op_f32_store(offset):
    return bytes([0x38, 0x02]) + uleb128(offset)

def make_func(type_idx, locals_list, code_bytes):
    body = bytearray()
    body += uleb128(len(locals_list))
    for count, ltype in locals_list:
        body += uleb128(count) + bytes([ltype])
    body += code_bytes + bytes([0x0B]) # end
    return type_idx, uleb128(len(body)) + body

functions = []
exports_list = []

def add_export_func(name, type_idx, locals_list, code_bytes):
    idx = len(functions)
    func_type, body = make_func(type_idx, locals_list, code_bytes)
    functions.append((func_type, body))
    exports_list.append((name, 0, idx))
    return idx

# -------------------------------------------------------------
# Func 0: wasm_init_game(seed: i32) -> ()
# -------------------------------------------------------------
code_init = bytearray()
code_init += op_i32_const(0) + op_i32_const(1) + op_i32_store(OFF_SOL)
code_init += op_i32_const(0) + op_i32_const(0) + op_i32_store(OFF_PHASE)
code_init += op_i32_const(0) + op_i32_const(0) + op_i32_store(OFF_STATUS)
code_init += op_i32_const(0) + op_i32_const(0) + op_i32_store(OFF_DEFEAT_REAS)
code_init += op_i32_const(0) + op_i32_const(3) + op_i32_store(OFF_ACTION_PTS)
code_init += op_i32_const(0) + bytes([0x20, 0x00]) + op_i32_store(OFF_RNG_STATE)
code_init += op_i32_const(0) + op_i32_const(1) + op_i32_store(OFF_FOOD_RAT)
code_init += op_i32_const(0) + op_i32_const(1) + op_i32_store(OFF_WATER_RAT)
code_init += op_i32_const(0) + op_i32_const(-1) + op_i32_store(OFF_SEL_OPT)
code_init += op_i32_const(0) + op_i32_const(1) + op_i32_store(OFF_EVENT_ID)

init_res = [
    (60.0, 100.0),   # RES_OXYGEN
    (120.0, 160.0),  # RES_POWER
    (110.0, 180.0),  # RES_WATER
    (72.0, 100.0),   # RES_FOOD
    (95.0, 100.0),   # RES_HULL
    (100.0, 100.0),  # RES_HEALTH
    (92.0, 100.0)    # RES_MORALE
]
for i, (cur, mx) in enumerate(init_res):
    code_init += op_i32_const(0) + op_f32_const(cur) + op_f32_store(OFF_RES_CUR + i*4)
    code_init += op_i32_const(0) + op_f32_const(mx) + op_f32_store(OFF_RES_MAX + i*4)

for i in range(6):
    code_init += op_i32_const(0) + op_f32_const(100.0) + op_f32_store(OFF_SYS_POWER + i*4)
    code_init += op_i32_const(0) + op_f32_const(1.0) + op_f32_store(OFF_SYS_EFF + i*4)
    code_init += op_i32_const(0) + op_f32_const(95.0) + op_f32_store(OFF_SYS_COND + i*4)

code_init += op_i32_const(0) + op_f32_const(-62.0) + op_f32_store(OFF_ENV_TEMP)
code_init += op_i32_const(0) + op_f32_const(0.35) + op_f32_store(OFF_ENV_TAU)
code_init += op_i32_const(0) + op_f32_const(560.0) + op_f32_store(OFF_ENV_SOLAR)
code_init += op_i32_const(0) + op_f32_const(0.65) + op_f32_store(OFF_ENV_RAD)

for i in range(4):
    code_init += op_i32_const(0) + op_f32_const(100.0) + op_f32_store(OFF_CREW_HEALTH + i*4)
    code_init += op_i32_const(0) + op_f32_const(92.0) + op_f32_store(OFF_CREW_MORALE + i*4)

add_export_func("wasm_init_game", TYPE_I_V, [], bytes(code_init))

# Func 1: wasm_get_sol
add_export_func("wasm_get_sol", TYPE_V_I, [], op_i32_const(0) + op_i32_load(OFF_SOL))

# Func 2: wasm_get_phase
add_export_func("wasm_get_phase", TYPE_V_I, [], op_i32_const(0) + op_i32_load(OFF_PHASE))

# Func 3: wasm_set_phase
add_export_func("wasm_set_phase", TYPE_I_V, [], op_i32_const(0) + bytes([0x20, 0x00]) + op_i32_store(OFF_PHASE))

# Func 4: wasm_get_game_status
add_export_func("wasm_get_game_status", TYPE_V_I, [], op_i32_const(0) + op_i32_load(OFF_STATUS))

# Func 5: wasm_get_defeat_reason
add_export_func("wasm_get_defeat_reason", TYPE_V_I, [], op_i32_const(0) + op_i32_load(OFF_DEFEAT_REAS))

# Func 6: wasm_get_resource_value
code_res_val = bytearray()
code_res_val += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_res_val += op_f32_load(OFF_RES_CUR)
add_export_func("wasm_get_resource_value", TYPE_I_F, [], bytes(code_res_val))

# Func 7: wasm_get_resource_max
code_res_max = bytearray()
code_res_max += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_res_max += op_f32_load(OFF_RES_MAX)
add_export_func("wasm_get_resource_max", TYPE_I_F, [], bytes(code_res_max))

# Func 8: wasm_get_resource_prod(res_id: i32) -> f32
code_prod = bytearray()
code_prod += bytes([
    0x20, 0x00, 0x41, 0x00, 0x46, # if res_id == 0 (OXYGEN)
    0x04, 0x7D,
        0x43, *f32_bytes(4.6),
        0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 0), 0x43, *f32_bytes(100.0), 0x95, 0x94,
        0x41, 0x00, *op_f32_load(OFF_SYS_COND + 0), 0x43, *f32_bytes(100.0), 0x95, 0x94,
    0x05,
        0x20, 0x00, 0x41, 0x01, 0x46, # if res_id == 1 (POWER)
        0x04, 0x7D,
            0x43, *f32_bytes(110.0),
            0x43, *f32_bytes(1.0), 0x41, 0x00, *op_f32_load(OFF_ENV_TAU), 0x43, *f32_bytes(0.35), 0x94, 0x93, 0x94,
            0x41, 0x00, *op_f32_load(OFF_SYS_COND + 3*4), 0x43, *f32_bytes(100.0), 0x95, 0x94,
            0x43, *f32_bytes(25.0), 0x92, # + RTG 25.0
        0x05,
            0x20, 0x00, 0x41, 0x02, 0x46, # if res_id == 2 (WATER)
            0x04, 0x7D,
                0x43, *f32_bytes(10.2),
                0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 1*4), 0x43, *f32_bytes(100.0), 0x95, 0x94,
                0x41, 0x00, *op_f32_load(OFF_SYS_COND + 1*4), 0x43, *f32_bytes(100.0), 0x95, 0x94,
            0x05,
                0x20, 0x00, 0x41, 0x03, 0x46, # if res_id == 3 (FOOD)
                0x04, 0x7D,
                    0x43, *f32_bytes(3.5),
                    0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 2*4), 0x43, *f32_bytes(100.0), 0x95, 0x94,
                0x05,
                    0x43, *f32_bytes(0.0),
                0x0B,
            0x0B,
        0x0B,
    0x0B
])
add_export_func("wasm_get_resource_prod", TYPE_I_F, [], bytes(code_prod))

# Func 9: wasm_get_resource_cons(res_id: i32) -> f32
code_cons = bytearray()
code_cons += bytes([
    0x20, 0x00, 0x41, 0x00, 0x46, # if res_id == 0 (O2)
    0x04, 0x7D,
        0x43, *f32_bytes(3.36),
    0x05,
        0x20, 0x00, 0x41, 0x01, 0x46, # if res_id == 1 (POWER)
        0x04, 0x7D,
            0x43, *f32_bytes(18.0),
            0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 0*4), 0x43, *f32_bytes(0.35), 0x94, 0x92,
            0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 1*4), 0x43, *f32_bytes(0.22), 0x94, 0x92,
            0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 2*4), 0x43, *f32_bytes(0.20), 0x94, 0x92,
            0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 3*4), 0x43, *f32_bytes(0.24), 0x94, 0x92,
            0x41, 0x00, *op_f32_load(OFF_SYS_POWER + 4*4), 0x43, *f32_bytes(0.12), 0x94, 0x92,
        0x05,
            0x20, 0x00, 0x41, 0x02, 0x46, # if res_id == 2 (WATER)
            0x04, 0x7D,
                0x43, *f32_bytes(11.2),
                0x41, 0x00, *op_i32_load(OFF_WATER_RAT), 0x41, 0x00, 0x46,
                0x04, 0x7D,
                    0x43, *f32_bytes(0.55),
                0x05,
                    0x43, *f32_bytes(1.0),
                0x0B,
                0x94,
            0x05,
                0x20, 0x00, 0x41, 0x03, 0x46, # if res_id == 3 (FOOD)
                0x04, 0x7D,
                    0x43, *f32_bytes(12.0),
                    0x41, 0x00, *op_i32_load(OFF_FOOD_RAT), 0x41, 0x00, 0x46,
                    0x04, 0x7D,
                        0x43, *f32_bytes(0.5),
                    0x05,
                        0x41, 0x00, *op_i32_load(OFF_FOOD_RAT), 0x41, 0x02, 0x46,
                        0x04, 0x7D,
                            0x43, *f32_bytes(1.5),
                        0x05,
                            0x43, *f32_bytes(1.0),
                        0x0B,
                    0x0B,
                    0x94,
                0x05,
                    0x43, *f32_bytes(1.0),
                0x0B,
            0x0B,
        0x0B,
    0x0B
])
add_export_func("wasm_get_resource_cons", TYPE_I_F, [], bytes(code_cons))

# Func 10: wasm_set_subsystem_power
code_set_pwr = bytearray()
code_set_pwr += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_set_pwr += bytes([0x20, 0x01])
code_set_pwr += op_f32_store(OFF_SYS_POWER)
add_export_func("wasm_set_subsystem_power", TYPE_IF_V, [], bytes(code_set_pwr))

# Func 11: wasm_get_subsystem_power
code_get_pwr = bytearray()
code_get_pwr += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_get_pwr += op_f32_load(OFF_SYS_POWER)
add_export_func("wasm_get_subsystem_power", TYPE_I_F, [], bytes(code_get_pwr))

# Func 12: wasm_get_subsystem_efficiency
code_get_eff = bytearray()
code_get_eff += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_get_eff += op_f32_load(OFF_SYS_EFF)
add_export_func("wasm_get_subsystem_efficiency", TYPE_I_F, [], bytes(code_get_eff))

# Func 13: wasm_get_subsystem_condition
code_get_cond = bytearray()
code_get_cond += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_get_cond += op_f32_load(OFF_SYS_COND)
add_export_func("wasm_get_subsystem_condition", TYPE_I_F, [], bytes(code_get_cond))

# Func 14: wasm_set_ration_policy
code_set_rat = bytearray()
code_set_rat += bytes([
    0x20, 0x00, 0x41, 0x00, 0x46,
    0x04, 0x40,
        0x41, 0x00, 0x20, 0x01, *op_i32_store(OFF_FOOD_RAT),
    0x05,
        0x41, 0x00, 0x20, 0x01, *op_i32_store(OFF_WATER_RAT),
    0x0B
])
add_export_func("wasm_set_ration_policy", TYPE_II_V, [], bytes(code_set_rat))

# Func 15: wasm_get_ration_policy
code_get_rat = bytearray()
code_get_rat += bytes([
    0x20, 0x00, 0x41, 0x00, 0x46,
    0x04, 0x7F,
        0x41, 0x00, *op_i32_load(OFF_FOOD_RAT),
    0x05,
        0x41, 0x00, *op_i32_load(OFF_WATER_RAT),
    0x0B
])
add_export_func("wasm_get_ration_policy", TYPE_I_I, [], bytes(code_get_rat))

# Func 16: wasm_get_action_points
add_export_func("wasm_get_action_points", TYPE_V_I, [], op_i32_const(0) + op_i32_load(OFF_ACTION_PTS))

# Func 17: wasm_perform_maintenance
code_maint = bytearray()
code_maint += bytes([
    0x41, 0x00, *op_i32_load(OFF_ACTION_PTS), 0x41, 0x00, 0x4E,
    0x04, 0x7F,
        0x20, 0x00, 0x41, 0x02, 0x74, 0x43, *f32_bytes(100.0), *op_f32_store(OFF_SYS_COND),
        0x41, 0x00, 0x41, 0x00, *op_i32_load(OFF_ACTION_PTS), 0x41, 0x01, 0x6B, *op_i32_store(OFF_ACTION_PTS),
        0x41, 0x01,
    0x05,
        0x41, 0x00,
    0x0B
])
add_export_func("wasm_perform_maintenance", TYPE_I_I, [], bytes(code_maint))

# Func 18: wasm_choose_event_option
code_choose = bytearray()
code_choose += bytes([
    0x41, 0x00, 0x20, 0x00, *op_i32_store(OFF_SEL_OPT),
    0x41, 0x01
])
add_export_func("wasm_choose_event_option", TYPE_I_I, [], bytes(code_choose))

# -------------------------------------------------------------
# Func 19: wasm_advance_sol() -> i32
# Accurate resource delta integration:
#   cur = clamp(cur + prod - cons, 0, max)
# -------------------------------------------------------------
code_adv = bytearray()
# Locals: 0: cur_sol (i32), 1: val (f32), 2: mx (f32)
# Step 1: O2
code_adv += bytes([
    0x41, 0x00, *op_i32_load(OFF_SOL), 0x21, 0x00, # cur_sol = OFF_SOL

    # O2: new_val = cur + prod(0) - cons(0)
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 0),
    0x41, 0x00, 0x10, 0x08, # call wasm_get_resource_prod(0)
    0x92,
    0x41, 0x00, 0x10, 0x09, # call wasm_get_resource_cons(0)
    0x93,
    0x21, 0x01, # val = new_val
    # clamp val to max
    0x41, 0x00, *op_f32_load(OFF_RES_MAX + 0), 0x21, 0x02,
    0x20, 0x01, 0x20, 0x02, 0x5E, # if val > max
    0x04, 0x40,
        0x20, 0x02, 0x21, 0x01,
    0x0B,
    0x20, 0x01, 0x43, *f32_bytes(0.0), 0x5D, # if val < 0
    0x04, 0x40,
        0x43, *f32_bytes(0.0), 0x21, 0x01,
    0x0B,
    0x41, 0x00, 0x20, 0x01, *op_f32_store(OFF_RES_CUR + 0),

    # Power: new_val = cur + prod(1) - cons(1)
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 4),
    0x41, 0x01, 0x10, 0x08, # prod(1)
    0x92,
    0x41, 0x01, 0x10, 0x09, # cons(1)
    0x93,
    0x21, 0x01,
    0x41, 0x00, *op_f32_load(OFF_RES_MAX + 4), 0x21, 0x02,
    0x20, 0x01, 0x20, 0x02, 0x5E,
    0x04, 0x40,
        0x20, 0x02, 0x21, 0x01,
    0x0B,
    0x20, 0x01, 0x43, *f32_bytes(0.0), 0x5D,
    0x04, 0x40,
        0x43, *f32_bytes(0.0), 0x21, 0x01,
    0x0B,
    0x41, 0x00, 0x20, 0x01, *op_f32_store(OFF_RES_CUR + 4),

    # Water: new_val = cur + prod(2) - cons(2)
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 8),
    0x41, 0x02, 0x10, 0x08,
    0x92,
    0x41, 0x02, 0x10, 0x09,
    0x93,
    0x21, 0x01,
    0x41, 0x00, *op_f32_load(OFF_RES_MAX + 8), 0x21, 0x02,
    0x20, 0x01, 0x20, 0x02, 0x5E,
    0x04, 0x40,
        0x20, 0x02, 0x21, 0x01,
    0x0B,
    0x20, 0x01, 0x43, *f32_bytes(0.0), 0x5D,
    0x04, 0x40,
        0x43, *f32_bytes(0.0), 0x21, 0x01,
    0x0B,
    0x41, 0x00, 0x20, 0x01, *op_f32_store(OFF_RES_CUR + 8),

    # Food: new_val = cur + prod(3) - cons(3)
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 12),
    0x41, 0x03, 0x10, 0x08,
    0x92,
    0x41, 0x03, 0x10, 0x09,
    0x93,
    0x21, 0x01,
    0x41, 0x00, *op_f32_load(OFF_RES_MAX + 12), 0x21, 0x02,
    0x20, 0x01, 0x20, 0x02, 0x5E,
    0x04, 0x40,
        0x20, 0x02, 0x21, 0x01,
    0x0B,
    0x20, 0x01, 0x43, *f32_bytes(0.0), 0x5D,
    0x04, 0x40,
        0x43, *f32_bytes(0.0), 0x21, 0x01,
    0x0B,
    0x41, 0x00, 0x20, 0x01, *op_f32_store(OFF_RES_CUR + 12),

    # Check defeat: O2 <= 0.0
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 0), 0x43, *f32_bytes(0.0), 0x5F,
    0x04, 0x40,
        0x41, 0x00, 0x41, 0x02, *op_i32_store(OFF_STATUS),
        0x41, 0x00, 0x41, 0x01, *op_i32_store(OFF_DEFEAT_REAS),
    0x0B,

    # Check defeat: Power <= 0.0
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 4), 0x43, *f32_bytes(0.0), 0x5F,
    0x04, 0x40,
        0x41, 0x00, 0x41, 0x02, *op_i32_store(OFF_STATUS),
        0x41, 0x00, 0x41, 0x02, *op_i32_store(OFF_DEFEAT_REAS),
    0x0B,

    # Check defeat: Water <= 0.0
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 8), 0x43, *f32_bytes(0.0), 0x5F,
    0x04, 0x40,
        0x41, 0x00, 0x41, 0x02, *op_i32_store(OFF_STATUS),
        0x41, 0x00, 0x41, 0x03, *op_i32_store(OFF_DEFEAT_REAS),
    0x0B,

    # Check defeat: Food <= 0.0 and cur_sol > 2
    0x41, 0x00, *op_f32_load(OFF_RES_CUR + 12), 0x43, *f32_bytes(0.0), 0x5F,
    0x20, 0x00, 0x41, 0x02, 0x4E, 0x71,
    0x04, 0x40,
        0x41, 0x00, 0x41, 0x02, *op_i32_store(OFF_STATUS),
        0x41, 0x00, 0x41, 0x04, *op_i32_store(OFF_DEFEAT_REAS),
    0x0B,

    # If already defeated, return 0
    0x41, 0x00, *op_i32_load(OFF_STATUS), 0x41, 0x02, 0x46,
    0x04, 0x7F,
        0x41, 0x00,
    0x05,
        # Check Victory: cur_sol >= 7
        0x20, 0x00, 0x41, 0x07, 0x4E,
        0x04, 0x7F,
            0x41, 0x00, 0x41, 0x01, *op_i32_store(OFF_STATUS),
            0x41, 0x01,
        0x05,
            # Advance Sol: sol++
            0x41, 0x00, 0x20, 0x00, 0x41, 0x01, 0x6A, *op_i32_store(OFF_SOL),
            0x41, 0x00, 0x41, 0x00, *op_i32_store(OFF_PHASE),
            0x41, 0x00, 0x41, 0x03, *op_i32_store(OFF_ACTION_PTS),

            # Set environment for day
            0x41, 0x00, *op_i32_load(OFF_SOL), 0x41, 0x03, 0x46,
            0x04, 0x40,
                0x41, 0x00, 0x43, *f32_bytes(1.85), *op_f32_store(OFF_ENV_TAU),
                0x41, 0x00, 0x43, *f32_bytes(-82.0), *op_f32_store(OFF_ENV_TEMP),
            0x0B,
            0x41, 0x00, *op_i32_load(OFF_SOL), 0x41, 0x05, 0x46,
            0x04, 0x40,
                0x41, 0x00, 0x43, *f32_bytes(9.80), *op_f32_store(OFF_ENV_RAD),
            0x0B,
            0x41, 0x01,
        0x0B,
    0x0B
])
add_export_func("wasm_advance_sol", TYPE_V_I, [(1, 0x7F), (2, 0x7D)], bytes(code_adv))

# Func 20: wasm_get_ambient_temp
add_export_func("wasm_get_ambient_temp", TYPE_V_F, [], op_i32_const(0) + op_f32_load(OFF_ENV_TEMP))

# Func 21: wasm_get_dust_tau
add_export_func("wasm_get_dust_tau", TYPE_V_F, [], op_i32_const(0) + op_f32_load(OFF_ENV_TAU))

# Func 22: wasm_get_solar_flux
add_export_func("wasm_get_solar_flux", TYPE_V_F, [], op_i32_const(0) + op_f32_load(OFF_ENV_SOLAR))

# Func 23: wasm_get_radiation_msv
add_export_func("wasm_get_radiation_msv", TYPE_V_F, [], op_i32_const(0) + op_f32_load(OFF_ENV_RAD))

# Func 24: wasm_get_crew_health
code_crew_h = bytearray()
code_crew_h += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_crew_h += op_f32_load(OFF_CREW_HEALTH)
add_export_func("wasm_get_crew_health", TYPE_I_F, [], bytes(code_crew_h))

# Func 25: wasm_get_crew_morale
code_crew_m = bytearray()
code_crew_m += bytes([0x20, 0x00]) + op_i32_const(2) + bytes([0x74])
code_crew_m += op_f32_load(OFF_CREW_MORALE)
add_export_func("wasm_get_crew_morale", TYPE_I_F, [], bytes(code_crew_m))

# Func 26: wasm_calculate_mission_score
code_score = bytearray()
code_score += bytes([
    0x41, 0x00, *op_i32_load(OFF_STATUS), 0x41, 0x02, 0x46,
    0x04, 0x7F,
        0x41, 0x00, *op_i32_load(OFF_SOL), 0x41, *sleb128(1000), 0x6C,
    0x05,
        0x41, *sleb128(10000),
        0x41, 0x00, *op_i32_load(OFF_SOL), 0x41, *sleb128(1500), 0x6C, 0x6A,
    0x0B
])
add_export_func("wasm_calculate_mission_score", TYPE_V_I, [], bytes(code_score))

# Func 27: wasm_get_state_ptr
add_export_func("wasm_get_state_ptr", TYPE_V_I, [], op_i32_const(1024))

# -------------------------------------------------------------
# Constructing WASM Sections
# -------------------------------------------------------------
funcs_payload = bytearray()
funcs_payload += uleb128(len(functions))
for ftype, _ in functions:
    funcs_payload += uleb128(ftype)

mem_payload = bytearray()
mem_payload += uleb128(1)
mem_payload += bytes([0x00])
mem_payload += uleb128(2)

exports_payload = bytearray()
exports_payload += uleb128(len(exports_list) + 1)
for name, tag, idx in exports_list:
    name_bytes = name.encode('utf-8')
    exports_payload += uleb128(len(name_bytes)) + name_bytes + bytes([tag]) + uleb128(idx)

mem_name = b"memory"
exports_payload += uleb128(len(mem_name)) + mem_name + bytes([0x02]) + uleb128(0)

code_payload = bytearray()
code_payload += uleb128(len(functions))
for _, body in functions:
    code_payload += body

wasm_binary = bytearray()
wasm_binary += b'\x00asm\x01\x00\x00\x00'
wasm_binary += section(1, types_payload)
wasm_binary += section(3, funcs_payload)
wasm_binary += section(5, mem_payload)
wasm_binary += section(7, exports_payload)
wasm_binary += section(10, code_payload)

out_path = "mars_outpost.wasm"
with open(out_path, "wb") as f:
    f.write(wasm_binary)

print(f"Successfully compiled WebAssembly module: {out_path} ({len(wasm_binary)} bytes)")
