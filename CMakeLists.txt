cmake_minimum_required(VERSION 3.15)
project(MarsOutpostSurvival CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(EMSCRIPTEN)
    add_executable(mars_outpost mars_outpost.cpp mars_outpost.h)
    set_target_properties(mars_outpost PROPERTIES
        OUTPUT_NAME "mars_outpost"
        SUFFIX ".js"
        LINK_FLAGS "-O3 -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s NO_EXIT_RUNTIME=1 -s MODULARIZE=1 -s EXPORT_NAME='MarsOutpostModule'"
    )
else()
    add_library(mars_outpost SHARED mars_outpost.cpp mars_outpost.h)
endif()
