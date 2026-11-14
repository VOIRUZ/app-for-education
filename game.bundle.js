// MARS OUTPOST: SEVEN DAYS TO SURVIVE
// Standalone bundle: Works directly via file:// and http:// in all modern browsers
(function() {
  "use strict";

// ===== js/data/story.js =====
// MARS OUTPOST: SEVEN DAYS TO SURVIVE
// Comprehensive Story, Dialogue, Educational Notes, and Daily Scenarios
const CHARACTERS = {
  alex: {
    name: 'Alex Vance',
    role: 'Systems Specialist (You)',
    color: '#00e5ff',
    badge: 'OPS'
  },
  maya: {
    name: 'Commander Maya Chen',
    role: 'Mission Commander',
    color: '#4fc3f7',
    badge: 'CMD',
    bio: 'Former aerospace test pilot. Carries the weight of the crew on her shoulders, balancing mission protocols with deep care for her team.'
  },
  liam: {
    name: 'Dr. Liam Brooks',
    role: 'Lead Life-Support Engineer',
    color: '#ffb74d',
    badge: 'ENG',
    bio: 'Scottish mechanical genius with a dry sense of humor. Uses jokes to mask his stress, but knows every bolt of the outpost inside out.'
  },
  samira: {
    name: 'Dr. Samira Morales',
    role: 'Astrobiologist & Medical Officer',
    color: '#81c784',
    badge: 'BIO / MED',
    bio: 'Specialist in closed-loop ecosystems. Passionate about Martian botany and fiercely protective of both human health and her greenhouse sprouts.'
  },
  earth: {
    name: 'Houston Mission Control (CapCom)',
    role: 'Earth Support',
    color: '#e0e0e0',
    badge: 'EARTH'
  }
};
const EDUCATIONAL_TOPICS = {
  moxie: {
    title: 'MOXIE (Mars Oxygen ISRU)',
    tag: 'NASA Technology',
    icon: '💨',
    summary: 'The Mars Oxygen In-Situ Resource Utilization Experiment (MOXIE) extracts oxygen from the Martian atmosphere by collecting carbon dioxide (CO2), compressing it, and using solid oxide electrolysis at ~800°C to split CO2 into pure Oxygen (O2) and Carbon Monoxide (CO).',
    linkText: 'Learn more about MOXIE on NASA Perseverance'
  },
  sabatier: {
    title: 'Sabatier Water Recovery & Urine Processor',
    tag: 'Life Support Systems',
    icon: '💧',
    summary: 'On the International Space Station and future Martian outposts, the Environmental Control and Life Support System (ECLSS) recycles over 98% of all water—including humidity from astronaut breath, sweat, and purified urine through vacuum distillation and the catalytic Sabatier chemical reaction.',
    linkText: 'NASA ECLSS Water Recovery Architecture'
  },
  regolith: {
    title: 'Martian Regolith & Agriculture',
    tag: 'Astrobiology',
    icon: '🌱',
    summary: 'Martian soil (regolith) is rich in iron oxides, but contains hazardous perchlorate salts toxic to humans and plants. Before farming, regolith must be thoroughly washed or treated with perchlorate-eating bacteria, then enriched with organic compost and nitrogen-fixing inoculants.',
    linkText: 'NASA Plant Habitat & Space Agriculture Studies'
  },
  solarDust: {
    title: 'Martian Dust & Solar Array Attenuation',
    tag: 'Martian Environment',
    icon: '☀️',
    summary: 'Martian dust particles are extremely fine and electrostatically charged. During seasonal storms, dust blocks over 90% of sunlight and settles on solar panels, severely crippling electrical generation—the exact fate that ended NASA’s Opportunity and InSight missions.',
    linkText: 'NASA Mars Dust Storm Environmental Studies'
  },
  radiation: {
    title: 'Cosmic Rays & Solar Particle Events (SPE)',
    tag: 'Space Medicine',
    icon: '🛡️',
    summary: 'Without a strong global magnetic field or thick atmosphere like Earth, Mars’s surface is bombarded by Galactic Cosmic Radiation and Solar Particle Events. Habitats utilize thick compacted Martian regolith sandbags or hydrogen-dense water shielding to absorb ionizing radiation.',
    linkText: 'NASA Space Radiation Health Risks'
  },
  circadian: {
    title: 'The Martian Sol & Circadian Stress',
    tag: 'Human Factors',
    icon: '⏰',
    summary: 'A Martian day (called a "Sol") lasts 24 hours, 39 minutes, and 35 seconds. That extra 39 minutes per day continually disrupts human circadian rhythms, leading to sleep debt, reduced cognitive sharpness, and mood volatility unless strictly managed with scheduled light spectrums.',
    linkText: 'NASA Behavioral Health & Confinement Research'
  }
};

// 7-Day Campaign Narrative Structure
const DAYS_DATA = [
  // ================= DAY 1 =================
  {
    dayNumber: 1,
    title: 'The Delay Announced',
    subtitle: '7 Sols to Caelum-4 Arrival',
    briefing: 'Mission Control informs the outpost that supply vessel Caelum-4 suffered an upper-stage trajectory gimbal fault. Resupply is delayed by exactly seven days. The crew gathers in the Common Room to take inventory.',
    environmentalCondition: 'Clear skies. Ambient temp: -62°C. Solar radiance normal.',
    defaultResources: {
      oxygen: 88,
      water: 82,
      food: 90,
      electricity: 95
    },
    // Phase 1 Story Dialogue
    storyDialogue: [
      {
        speaker: 'earth',
        portrait: 'neutral',
        text: 'Ares Outpost Alpha, this is Houston Flight Operations. We have a confirmation on the telemetry error for supply vessel Caelum-4. Orbital insertion burn was aborted.'
      },
      {
        speaker: 'maya',
        portrait: 'serious',
        text: 'Houston, copy that. What is the updated rendezvous window? We were scheduled to crack our primary emergency supply crate tomorrow morning.'
      },
      {
        speaker: 'earth',
        portrait: 'neutral',
        text: 'Telemetry shows the carrier stage needs seven days to cycle back into orbital phasing. Seven days, Alpha. You will need to tighten your margins until Sol 7.'
      },
      {
        speaker: 'liam',
        portrait: 'grin',
        text: 'Seven days without fresh coffee beans and Earth mail? Well, at least my recycled turnip stew won’t have any competition.'
      },
      {
        speaker: 'samira',
        portrait: 'worried',
        text: 'Jokes aside, Liam... our water recycling loop was already due for a primary filter flush, and the hydroponic wheat crop is three days away from budding.'
      },
      {
        speaker: 'maya',
        portrait: 'determined',
        text: 'Alex, as our systems specialist, I need you on top of this. Take a walk through the habitat. Inspect life support, talk to the team, and let us decide how we handle the water system before nightfall.'
      }
    ],
    // Interactive Room Details
    roomInteractions: {
      command: [
        { id: 'comms_desk', name: 'Comms Console', icon: '📡', text: 'Telemetry feed shows Caelum-4 looping in a wide Martian elliptic orbit. 7 days countdown ticking down.', eduTopic: 'circadian' },
        { id: 'window_mars', name: 'Observation Port', icon: '🪟', text: 'The rusty expanse of Acidalia Planitia stretches toward the pink horizon. Quiet, desolate, and beautiful.' }
      ],
      common: [
        { id: 'maya_talk', name: 'Talk to Maya', icon: '💬', dialogue: [
          { speaker: 'maya', portrait: 'calm', text: 'I trust this crew, Alex. We trained for contingencies in the Utah desert for two years. Keep your head clear and don’t let small hitches snowball.' }
        ]},
        { id: 'earth_photo', name: 'Family Photo Board', icon: '🖼️', text: 'A snapshot of the crew during winter training in Iceland, standing in front of a frozen waterfall with broad smiles.' }
      ],
      greenhouse: [
        { id: 'samira_talk', name: 'Talk to Samira', icon: '💬', dialogue: [
          { speaker: 'samira', portrait: 'gentle', text: 'The dwarf wheat and cherry tomatoes are holding on. Plants are surprisingly resilient, Alex. Sometimes I think they handle Mars better than we do.' }
        ]},
        { id: 'hydroponics_rack', name: 'Hydroponic Rack #2', icon: '🌱', text: 'Automated nutrient sprayers hiss quietly. Green leaves glow under violet LED growth arrays.', eduTopic: 'regolith' }
      ],
      lifesupport: [
        { id: 'liam_talk', name: 'Talk to Liam', icon: '💬', dialogue: [
          { speaker: 'liam', portrait: 'thinking', text: 'The Sabatier water recovery unit has a persistent hiss in valve 4. It’s functioning, but the pressure differential makes me nervous.' }
        ]},
        { id: 'moxie_unit', name: 'MOXIE Oxygen Generator', icon: '⚙️', text: 'Humming at 790°C. Electrolysis is steadily producing breathable O2 from atmospheric CO2.', eduTopic: 'moxie' },
        { id: 'water_sabatier', name: 'Sabatier Recycling Loop', icon: '🚰', text: 'Condensation line shows minor moisture dripping onto the rubberized floor seal.', eduTopic: 'sabatier' }
      ],
      exterior: [
        { id: 'solar_farm', name: 'Solar Array Station', icon: '☀️', text: 'Photovoltaic cells tracking the sun. Dust coverage is minimal today at 4%.', eduTopic: 'solarDust' },
        { id: 'rover', name: 'Ares Rover #1', icon: '🚜', text: 'Parked in the charging berth. Battery at 92%. Ready for emergency surface runs if needed.' }
      ]
    },
    // The Critical Daily Decision (Henry Stickmin-inspired choice cards)
    decision: {
      promptTitle: 'EMERGENCY: WATER CONDENSER LEAK',
      promptDesc: 'Liam discovers a hairline micro-crack in the secondary Sabatier condensation manifold. Water droplets are weeping onto the insulated baseplate. If untreated, we lose 15L of recycled water per sol.',
      options: [
        {
          id: 'opt_resin',
          title: 'A. QUICK COMPOSITE RESIN SEAL',
          icon: '🧪',
          badge: 'FAST & CONSERVATIVE',
          desc: 'Apply thermal sealant putty over the leak immediately without shutting down the system.',
          consequenceText: 'The seal holds cleanly without taking the water recycling offline. Liam is pleased, saving valuable water reserves with zero power disruption.',
          impact: { water: +6, electricity: 0, crewMorale: +5, trust: 'liam' }
        },
        {
          id: 'opt_overhaul',
          title: 'B. COMPLETE VALVE OVERHAUL',
          icon: '🔧',
          badge: 'THOROUGH & DEMANDING',
          desc: 'Shut down life support water pumps for 3 hours to replace the damaged sleeve with a spare copper-gasket.',
          consequenceText: 'A permanent structural fix! However, shutting down the loop consumed extra power and forced the crew to use backup battery reserves.',
          impact: { water: +12, electricity: -12, crewMorale: 0, trust: 'all' }
        },
        {
          id: 'opt_bypass',
          title: 'C. BYPASS TO HYDROPONIC DRAIN',
          icon: '🌿',
          badge: 'BOTANICAL RECOVERY',
          desc: 'Reroute the unpressurized condensation drip straight into Samira’s greenhouse reserve cistern.',
          consequenceText: 'Samira’s greenhouse thrives with extra moisture! But drinking water storage takes a minor hit until properly sanitized.',
          impact: { water: -5, food: +8, crewMorale: +4, trust: 'samira' }
        }
      ]
    }
  },

  // ================= DAY 2 =================
  {
    dayNumber: 2,
    title: 'The Reality of Rationing',
    subtitle: '6 Sols to Caelum-4 Arrival',
    briefing: 'The crew wakes up to reduced breakfast rations. The initial shock of the delay settles into the daily grind. Temperature inside the living quarters drops slightly as heaters are adjusted to conserve battery reserves.',
    environmentalCondition: 'Hazy morning. High atmospheric carbon haze. Temp: -68°C.',
    defaultResources: {
      oxygen: 84,
      water: 78,
      food: 80,
      electricity: 88
    },
    storyDialogue: [
      {
        speaker: 'liam',
        portrait: 'stressed',
        text: 'Half-portion protein paste and warm, filtered water. Ah, the true luxury of interplanetary exploration.'
      },
      {
        speaker: 'samira',
        portrait: 'calm',
        text: 'The spirulina algae cultures are high in amino acids, Liam. It might taste like pond moss, but it will keep your red blood cell count stable.'
      },
      {
        speaker: 'maya',
        portrait: 'serious',
        text: 'We need to discuss the power curve for the greenhouse. Solar generation drops 18% during late afternoons this week. If we keep full grow-lights on, our life-support batteries will be at 40% before midnight.'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'If we cut greenhouse power, does the budding wheat crop survive?'
      },
      {
        speaker: 'samira',
        portrait: 'worried',
        text: 'It would stunt the harvest, Alex. That harvest was supposed to supplement our fresh carbohydrates for Day 5 and 6.'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'daily_audio', name: 'Earth Audio Message', icon: '📻', text: 'Maya’s sister sent an audio greeting from Vancouver: "Hey Maya, mom made apple dumplings today. We watched Mars rise through the binoculars. Stay safe out there."' }
      ],
      common: [
        { id: 'liam_coffee', name: 'Talk to Liam', icon: '💬', dialogue: [
          { speaker: 'liam', portrait: 'thinking', text: 'I measured the caloric output of the crew. If we keep physical workouts to an hour a day, we burn 300 fewer calories without losing muscle mass.' }
        ]}
      ],
      greenhouse: [
        { id: 'crop_sensor', name: 'Spectrometer Scanner', icon: '🔬', text: 'Greenhouse soil analysis indicates low phosphorus. Samira is manually adjusting micro-nutrients.', eduTopic: 'regolith' }
      ],
      lifesupport: [
        { id: 'heater_bank', name: 'Thermal Control Grid', icon: '🌡️', text: 'Hab quarters set to 18.5°C to conserve 8 kWh daily. A little chilly, but sweaters are mandatory.' }
      ],
      exterior: [
        { id: 'horizon_dust', name: 'Southwestern Horizon', icon: '🌪️', text: 'Faint tawny dust devils dancing on the rim of Holden Crater. Wind speeds climbing to 42 km/h.' }
      ]
    },
    decision: {
      promptTitle: 'CRITICAL CHOICE: POWER vs. GREENHOUSE HARVEST',
      promptDesc: 'Solar collection is slipping. We must balance our battery bank against Samira’s experimental greenhouse harvest.',
      options: [
        {
          id: 'opt_save_power',
          title: 'A. CONSERVE BATTERIES (HALVE GROW LIGHTS)',
          icon: '🔋',
          badge: 'ENERGY FIRST',
          desc: 'Prioritize outpost life-support buffers and battery longevity over fresh crops.',
          consequenceText: 'Power reserves remain safely high. The wheat crop wilts slightly, meaning stricter food rationing later, but heating and O2 remain uninterrupted.',
          impact: { electricity: +12, food: -10, crewMorale: -4, trust: 'maya' }
        },
        {
          id: 'opt_boost_crops',
          title: 'B. DIVERTE AUXILIARY POWER TO GREENHOUSE',
          icon: '🌾',
          badge: 'SUSTENANCE BOOST',
          desc: 'Keep UV grow-lights at 100% capacity to guarantee an early harvest of nutritious greens.',
          consequenceText: 'The greenhouse blooms! Fresh greens give the crew a major psychological boost at dinner, though electricity dips into amber reserves.',
          impact: { food: +15, electricity: -14, crewMorale: +8, trust: 'samira' }
        },
        {
          id: 'opt_crew_ration',
          title: 'C. HOST A "STORY NIGHT" & SHARE RATIONS',
          icon: '☕',
          badge: 'CREW MORALE FOCUS',
          desc: 'Open one of the sealed luxury rations (chocolate & tea) and gather the crew to relieve anxiety.',
          consequenceText: 'The crew shares childhood stories and laughs under the soft lamp. Fear vanishes for an evening. Morale hits an all-time high!',
          impact: { food: -6, crewMorale: +14, electricity: -4, trust: 'all' }
        }
      ]
    }
  },

  // ================= DAY 3 =================
  {
    dayNumber: 3,
    title: 'The Great Dust Storm',
    subtitle: '5 Sols to Caelum-4 Arrival',
    briefing: 'A massive regional dust storm descends from Arabia Terra. Atmospheric visibility drops below 200 meters. The red Martian sky turns a bruised, eerie violet-brown. Dust covers the solar panel arrays.',
    environmentalCondition: 'Severe Dust Storm. Wind: 88 km/h. Optical depth tau = 3.2. Solar output -65%.',
    defaultResources: {
      oxygen: 79,
      water: 72,
      food: 72,
      electricity: 62
    },
    storyDialogue: [
      {
        speaker: 'maya',
        portrait: 'worried',
        text: 'Listen to that wind against the exterior hull... sounds like a freight train brushing past.'
      },
      {
        speaker: 'liam',
        portrait: 'serious',
        text: 'The solar farm output just dropped by 65%. The electrostatic dust is clinging to the photovoltaic glass like wet flour.'
      },
      {
        speaker: 'samira',
        portrait: 'stressed',
        text: 'Our main batteries are discharging at 4.2 kilowatts. If we don’t clean the panels or cut major systems, we will brown out in seven hours.'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'An EVA in an 80 km/h dust storm is high risk. The dust will foul the suit bearings and static can short the telemetry.'
      },
      {
        speaker: 'maya',
        portrait: 'determined',
        text: 'We need a decision. Do we risk an astronaut outside with the pneumatic wiper, cut the life-support grid to emergency levels, or run the backup methane fuel cell?'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'storm_radar', name: 'Doppler Weather Radar', icon: '📡', text: 'The storm spans 1,200 km across the canyonlands. Peak winds will hit at 16:00 Martian time.', eduTopic: 'solarDust' }
      ],
      common: [
        { id: 'bunk_talk', name: 'Talk to Samira', icon: '💬', dialogue: [
          { speaker: 'samira', portrait: 'worried', text: 'I keep thinking about the Opportunity rover... it stood on Mars for fifteen years until one single dust storm smothered its solar arrays forever.' }
        ]}
      ],
      greenhouse: [
        { id: 'shutter_seal', name: 'Reinforced Window Shutters', icon: '🛡️', text: 'Titanium storm blinds lowered over the greenhouse skylights to prevent micrometeorite scouring.' }
      ],
      lifesupport: [
        { id: 'battery_bank', name: 'Primary Lithium Battery Bank', icon: '⚡', text: 'Discharge alarm blinking amber: 48% remaining capacity. Depleting steadily.' }
      ],
      exterior: [
        { id: 'storm_window', name: 'Airlock Outer Portal', icon: '🌪️', text: 'Swirling clouds of red grit pummel the double-paned reinforced quartz. Absolute zero visibility.' }
      ]
    },
    decision: {
      promptTitle: 'CRITICAL EMERGENCY: THE SOLAR DUST BLACKOUT',
      promptDesc: 'Dust on the panels has strangled our power grid. How do we survive the night of the storm?',
      options: [
        {
          id: 'opt_brave_eva',
          title: 'A. BRAVE THE DUST STORM (EVA BRUSH RUN)',
          icon: '🧑‍🚀',
          badge: 'HIGH RISK / HIGH REWARD',
          desc: 'Alex and Liam suit up in tethered EVA gear to manually clear the solar arrays with pressurized CO2 lances.',
          consequenceText: 'A harrowing 45 minutes in pitch-black swirling grit! The panels are cleared, restoring 80% solar generation! Both return safely, exhausted but victorious.',
          impact: { electricity: +28, oxygen: -8, crewMorale: +10, trust: 'liam' }
        },
        {
          id: 'opt_brownout',
          title: 'B. INITIATE EMERGENCY OUTPOST SHUTDOWN',
          icon: '🔌',
          badge: 'DEFENSIVE SURVIVAL',
          desc: 'Shut off common room heating, science labs, and non-essential pumps. Huddle in the thermal core.',
          consequenceText: 'The habitat turns freezing cold and dark, but the power drain slows to a crawl. The crew spends the night shivering together under thermal blankets.',
          impact: { electricity: +8, crewMorale: -10, food: -4, trust: 'maya' }
        },
        {
          id: 'opt_fuel_cell',
          title: 'C. OVERCLOCK THE BACKUP METHANE FUEL CELL',
          icon: '🔥',
          badge: 'RESOURCE CONSUMPTION',
          desc: 'Burn our emergency reserves of liquid methane and stored oxygen to produce immediate electricity.',
          consequenceText: 'Power surges back to full! The base is warm and illuminated, but burning our backup fuel cell consumed precious oxygen reserves.',
          impact: { electricity: +22, oxygen: -14, water: +4, crewMorale: +3, trust: 'all' }
        }
      ]
    }
  },

  // ================= DAY 4 =================
  {
    dayNumber: 4,
    title: 'Equipment Malfunction & The Letter',
    subtitle: '4 Sols to Caelum-4 Arrival',
    briefing: 'The storm has receded into a dull rust fog. However, the electrostatic dust that infiltrated the outer vents has clogged the MOXIE secondary zeolite intake filters. The air is starting to smell stale and metallic.',
    environmentalCondition: 'Residual dust haze. Wind: 30 km/h. Atmospheric pressure 610 Pa.',
    defaultResources: {
      oxygen: 68,
      water: 66,
      food: 65,
      electricity: 74
    },
    storyDialogue: [
      {
        speaker: 'samira',
        portrait: 'stressed',
        text: 'Alex, my CO2 dosimeter just beeped. Ambient CO2 is up to 0.8% in the common area. It’s not lethal yet, but we are going to wake up with splitting headaches.'
      },
      {
        speaker: 'liam',
        portrait: 'stressed',
        text: 'The zeolite scrubber beds are choked with ultrafine Martian silt. I’ve taken the housing apart twice, but the ceramic heating element is cracked.'
      },
      {
        speaker: 'maya',
        portrait: 'serious',
        text: 'We also received a high-priority packet from Earth during the night. A video broadcast from our families... and an engineering advisory from NASA JPL.'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'What does JPL say about the zeolite beds?'
      },
      {
        speaker: 'maya',
        portrait: 'worried',
        text: 'They advise against operating at over 700°C with cracked ceramic—high risk of thermal runaway. They recommend either tapping our one-time medical O2 reserves, or attempting a chemical backflush.'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'family_video', name: 'Earth Video Terminal', icon: '📺', text: 'Liam’s little daughter waves at the camera holding a drawing of a red rocket: "Come home soon, Daddy! I saved half my birthday cake in the freezer for you!" Liam wipes a tear.' }
      ],
      common: [
        { id: 'co2_sensor', name: 'CO2 Environmental Alarm', icon: '⚠️', text: 'Blinking yellow. Carbon Dioxide levels climbing slowly. Fresh air ventilation restricted.' }
      ],
      greenhouse: [
        { id: 'botany_scrub', name: 'Talk to Samira', icon: '💬', dialogue: [
          { speaker: 'samira', portrait: 'thinking', text: 'Plants absorb CO2 and release O2, but our small greenhouse can only scrub about 15% of four humans’ respiratory output. We can’t rely on plants alone.' }
        ]}
      ],
      lifesupport: [
        { id: 'disassembled_moxie', name: 'Disassembled MOXIE Unit', icon: '🛠️', text: 'Screws, heat sinks, and ceramic filter tiles laid out on Liam’s workbench. Smells of scorched ozone.' }
      ],
      exterior: [
        { id: 'mars_sunset', name: 'Blue Martian Sunset', icon: '🌅', text: 'Through the airlock window, the sun sets as a tiny, intense blue jewel amidst the twilight dust.' }
      ]
    },
    decision: {
      promptTitle: 'CRITICAL CHOICE: OXYGEN SCRUBBER RESTORATION',
      promptDesc: 'CO2 is building up in the habitat. How do we restore clean, breathable air before the night is out?',
      options: [
        {
          id: 'opt_backflush',
          title: 'A. CHEMICAL BACKFLUSH WITH PRESSURIZED NITROGEN',
          icon: '💨',
          badge: 'INGENIOUS ENGINEERING',
          desc: 'Liam and Alex rig an improvised reverse nitrogen flush to blast the dust particles out of the pores.',
          consequenceText: 'A loud hiss and a cloud of red dust blows into the exterior vent! The filters clear and O2 output jumps back to 95%! Liam gives Alex an enthusiastic high-five.',
          impact: { oxygen: +22, electricity: -6, crewMorale: +7, trust: 'liam' }
        },
        {
          id: 'opt_medical_o2',
          title: 'B. TAP EMERGENCY MEDICAL O2 CYLINDERS',
          icon: '🏥',
          badge: 'SAFE BUT COSTLY',
          desc: 'Crack open the sealed medical oxygen bottles to maintain breathable air without risking the heater.',
          consequenceText: 'Air quality stabilizes instantly, sweet and cool. But our medical reserve is now empty—any future decompression or injury will be catastrophic.',
          impact: { oxygen: +14, food: 0, crewMorale: +2, trust: 'samira' }
        },
        {
          id: 'opt_greenhouse_hyper',
          title: 'C. OVERDRIVE BOTANICAL AERATION',
          icon: '🌿',
          badge: 'BIOLOGICAL SCRUB',
          desc: 'Pump the habitat air directly through the algal bioreactors and increase light intensity to max.',
          consequenceText: 'The algae works overtime, scrubbing CO2! However, the intense cycling drains greenhouse water reservoirs and burns through power.',
          impact: { oxygen: +16, water: -12, electricity: -8, crewMorale: +5, trust: 'samira' }
        }
      ]
    }
  },

  // ================= DAY 5 =================
  {
    dayNumber: 5,
    title: 'Solar Particle Event (Radiation Alert)',
    subtitle: '3 Sols to Caelum-4 Arrival',
    briefing: 'Deep space satellite GOES-Mars detects a Coronal Mass Ejection (CME) erupting from the Sun directly along Mars’s orbital path. A severe Solar Particle Event will strike in two hours. The crew must retreat to the shielded core.',
    environmentalCondition: 'Extreme Solar Radiation Warning. Flux: 450 mSv/hr. Habitat exterior unsafe.',
    defaultResources: {
      oxygen: 72,
      water: 58,
      food: 58,
      electricity: 65
    },
    storyDialogue: [
      {
        speaker: 'earth',
        portrait: 'serious',
        text: 'Ares Alpha, urgent broadcast. Solar observatories confirm a class X-4 flare heading down your throat. You have approximately 110 minutes before primary proton storm arrival.'
      },
      {
        speaker: 'maya',
        portrait: 'determined',
        text: 'All crew: Radiation Protocol Gamma. We need to move bedding, communication relays, and emergency rations into the subterranean storm shelter immediately.'
      },
      {
        speaker: 'liam',
        portrait: 'stressed',
        text: 'Wait—the main coolant pump for the habitat’s external radiator is vibrating. If the radiator freezes up while we are locked in the storm shelter, the whole water loop will burst into ice.'
      },
      {
        speaker: 'samira',
        portrait: 'worried',
        text: 'Someone would have to stay in the engineering annex to manually monitor the heat bypass valve during the initial radiation front.'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'Or we deploy the habitat’s experimental electromagnetic deflector coils—if we have enough power.'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'dosimeter_board', name: 'Radiation Monitor', icon: '☢️', text: 'Dosimeter counts clicking faster. Solar cosmic rays already penetrating the upper atmosphere.', eduTopic: 'radiation' }
      ],
      common: [
        { id: 'shelter_hatch', name: 'Storm Shelter Hatch', icon: '🛡️', text: 'Heavy lead-lined hatch leading 3 meters beneath the Martian surface, flanked by water-jacket walls.' }
      ],
      greenhouse: [
        { id: 'plant_lead', name: 'Greenhouse Shielding', icon: '🌱', text: 'Samira is covering the sensitive seedling beds with radiation-absorbent boron quilts.' }
      ],
      lifesupport: [
        { id: 'shaking_pump', name: 'External Radiator Pump', icon: '⚙️', text: 'Shuddering with an ominous rhythmic clang. The thermal glycol is approaching slush point.' }
      ],
      exterior: [
        { id: 'aurora_sky', name: 'Martian Aurora Sky', icon: '🌌', text: 'Eerie emerald and violet curtains of solar radiation glowing across the dark Martian horizon.' }
      ]
    },
    decision: {
      promptTitle: 'EXTREME CRISIS: SOLAR PARTICLE STORM DEFENSE',
      promptDesc: 'A lethal radiation wave is hitting. The radiator pump might freeze, but the shelter is the only safe spot.',
      options: [
        {
          id: 'opt_shelter_all',
          title: 'A. SEAL ENTIRE CREW IN STORM SHELTER',
          icon: '🚪',
          badge: 'HUMAN LIFE FIRST',
          desc: 'Lock all four astronauts safely inside the subterranean bunker. Let automated systems take their chances.',
          consequenceText: 'The crew is 100% safe from ionizing radiation! However, without manual tuning, the external radiator valve froze, losing 15% of our water lines.',
          impact: { water: -14, electricity: -6, crewMorale: +6, trust: 'maya' }
        },
        {
          id: 'opt_heroic_watch',
          title: 'B. ALEX MONITORS ENGINEERING (LEAD APRON)',
          icon: '🛡️',
          badge: 'TACTICAL SACRIFICE',
          desc: 'Alex wears a heavy lead-lined EVA suit in engineering to keep the pump manually cycling throughout the peak.',
          consequenceText: 'Heroic work! The water loop stays warm and perfectly intact! Alex receives a mild radiation dose (manageable with antioxidants), earning deep respect from the crew.',
          impact: { water: +8, oxygen: -6, crewMorale: +12, trust: 'all' }
        },
        {
          id: 'opt_magnetic_coil',
          title: 'C. OVERDRIVE ELECTROMAGNETIC DEFLECTOR',
          icon: '⚡',
          badge: 'HIGH TECH SHIELD',
          desc: 'Route all surplus battery power into the habitat roof coil to create a localized deflector bubble.',
          consequenceText: 'The deflector hums like a jet engine, deflecting incoming charged particles! Everything survives, but our electrical grid is drained almost to zero.',
          impact: { electricity: -28, oxygen: +4, crewMorale: +8, trust: 'liam' }
        }
      ]
    }
  },

  // ================= DAY 6 =================
  {
    dayNumber: 6,
    title: 'The Longest Night',
    subtitle: '2 Sols to Caelum-4 Arrival',
    briefing: 'Freezing temperatures outside plunge to -98°C. Inside, exhaustion and stress weigh heavy. Reserves are low, joints ache, and Liam has developed a persistent bronchial cough from dust exposure. The psychological challenge reaches its peak.',
    environmentalCondition: 'Extreme Polar Cold. Surface Temp: -98°C. Atmospheric stillness.',
    defaultResources: {
      oxygen: 60,
      water: 52,
      food: 46,
      electricity: 52
    },
    storyDialogue: [
      {
        speaker: 'liam',
        portrait: 'stressed',
        text: '*Coughs into sleeve* I’m fine, Samira. Just... forgot how heavy gravity feels when you haven’t had a real sandwich in five months.'
      },
      {
        speaker: 'samira',
        portrait: 'worried',
        text: 'Your pulse is 110, Liam, and your lung sounds are wheezy. You’ve been working twenty-hour shifts keeping those pumps from freezing.'
      },
      {
        speaker: 'maya',
        portrait: 'tired',
        text: 'Forty-eight hours. Just forty-eight hours until Caelum-4’s landing thrusters fire on the horizon. We can’t let anyone burn out now.'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'We have enough battery power to either run the medical diagnostic vaporizer for Liam, keep the habitat warm, or boost our long-range uplink.'
      },
      {
        speaker: 'liam',
        portrait: 'grin',
        text: 'Don’t waste juice on me. Put on an extra pair of thermal socks and let’s listen to some music.'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'beacon_scan', name: 'Orbital Approach Radar', icon: '📡', text: 'Caelum-4 carrier signal locked! Distance: 48,000 km. On course for descent corridor in two days.' }
      ],
      common: [
        { id: 'guitar_corner', name: 'Liam’s Acoustic Guitar', icon: '🎸', text: 'A small travel guitar with carbon-fiber strings. Liam left handwritten chord sheets of old Scottish folk songs on the stool.' }
      ],
      greenhouse: [
        { id: 'blooming_flower', name: 'Martian Flower Bud', icon: '🌸', text: 'A single, vibrant red nasturtium flower blooming in the hydroponic bed. Proof that life can flourish on Mars.' }
      ],
      lifesupport: [
        { id: 'heaters_humming', name: 'Primary Air Recirculator', icon: '💨', text: 'Straining against the arctic exterior chill. Frost forming along the corner rivets.' }
      ],
      exterior: [
        { id: 'starry_sky', name: 'Martian Night Sky', icon: '✨', text: 'Earth shines brilliantly in the sky—a brilliant pale blue beacon in a sea of razor-sharp stars.' }
      ]
    },
    decision: {
      promptTitle: 'DIFFICULT CHOICE: CARE FOR THE CREW',
      promptDesc: 'Liam is sick, the outpost is freezing, and energy reserves are razor thin. How do we pull through the longest night?',
      options: [
        {
          id: 'opt_treat_liam',
          title: 'A. MEDICAL TREATMENT & REST FOR LIAM',
          icon: '💊',
          badge: 'COMPASSION & CARE',
          desc: 'Order Liam to his bunk, administer warm medicated steam in the med-bay, and relieve him of duties.',
          consequenceText: 'Liam’s cough subsides as his fever breaks. He wakes up refreshed and tears up seeing his friends took over his maintenance shift. Crew morale surges!',
          impact: { electricity: -8, food: -4, crewMorale: +16, trust: 'liam' }
        },
        {
          id: 'opt_max_heat',
          title: 'B. CRANK AUXILIARY HEAT FOR EVERYONE',
          icon: '🔥',
          badge: 'PHYSICAL WARMTH',
          desc: 'Reroute remaining backup capacitor energy to warm the entire habitat to a cozy 22°C.',
          consequenceText: 'The freezing frost melts away from the walls. The crew sleeps deeply and comfortably for the first time in days, waking up energized and focused.',
          impact: { electricity: -16, crewMorale: +10, water: -4, trust: 'all' }
        },
        {
          id: 'opt_conserve_hold',
          title: 'C. HUDDLE AND ENDURE (CONSERVE ALL RESERVES)',
          icon: '🧣',
          badge: 'GRIT & DISCIPLINE',
          desc: 'Endure the cold with thermal coats, drink hot tea, and keep every kilowatt ready for tomorrow’s landing beacon.',
          consequenceText: 'It was a cold, sleepless night with chattering teeth, but every watt of energy was preserved for tomorrow’s critical final approach!',
          impact: { electricity: +14, crewMorale: -5, food: -4, trust: 'maya' }
        }
      ]
    }
  },

  // ================= DAY 7 =================
  {
    dayNumber: 7,
    title: 'The Supply Ship Arrival',
    subtitle: 'FINAL SOL: Caelum-4 Atmospheric Entry',
    briefing: 'THE FINAL DAY. Doppler radar alerts that Caelum-4 has ignited its de-orbit retro-rockets. In ninety minutes, the automated cargo lander will descend through the thin Martian atmosphere. The crew must guide it to a pinpoint landing!',
    environmentalCondition: 'High atmospheric winds over the landing zone. Visibility 5 km. Final Descent Sol.',
    defaultResources: {
      oxygen: 55,
      water: 48,
      food: 40,
      electricity: 50
    },
    storyDialogue: [
      {
        speaker: 'earth',
        portrait: 'neutral',
        text: 'Ares Alpha, this is Houston Flight Director. Caelum-4 entry interface in T-minus 14 minutes. Atmospheric entry speed is Mach 24.'
      },
      {
        speaker: 'maya',
        portrait: 'determined',
        text: 'Copy that, Houston. We have visual radar acquisition. Altitude 85 kilometers and descending.'
      },
      {
        speaker: 'liam',
        portrait: 'grin',
        text: 'Look out the viewport! Do you see that shooting star cutting through the red sky?'
      },
      {
        speaker: 'samira',
        portrait: 'gentle',
        text: 'That’s no shooting star... that’s seven tons of fresh food, spare parts, water filters, and letters from Earth!'
      },
      {
        speaker: 'alex',
        portrait: 'neutral',
        text: 'Commander! The automated laser guidance array on landing pad 2 isn’t pinging the lander—the transponder lost signal in the upper dust layer!'
      },
      {
        speaker: 'maya',
        portrait: 'serious',
        text: 'If Caelum-4 doesn’t lock onto our landing beacon, its computer will trigger an abort-to-crash 30 kilometers out into the crater! Alex, what do we do?!'
      }
    ],
    roomInteractions: {
      command: [
        { id: 'final_radar', name: 'Descent Telemetry Console', icon: '🎯', text: 'Caelum-4 lander telemetry flashing: "BEACON SEARCH TIMEOUT IN 120s".' }
      ],
      common: [
        { id: 'celebration_cup', name: 'Crew Coffee Pot', icon: '☕', text: 'The last dregs of instant coffee brewing on the warmer. Today, we either feast or we starve.' }
      ],
      greenhouse: [
        { id: 'crop_ready', name: 'Ready-to-Harvest Wheat', icon: '🌾', text: 'Golden wheat stalks swaying under the gentle greenhouse fans. Life survived seven days on Mars.' }
      ],
      lifesupport: [
        { id: 'final_meters', name: 'All Systems Final Status', icon: '📊', text: 'ECLSS, MOXIE, and Sabatier all operating at steady-state. We held the line.' }
      ],
      exterior: [
        { id: 'lander_flame', name: 'Descending Lander Flame', icon: '🚀', text: 'A brilliant fiery streak descending through the purple Martian stratosphere!' }
      ]
    },
    decision: {
      promptTitle: 'FINAL DECISION: GUIDE THE SUPPLY SHIP HOME',
      promptDesc: 'The automated beacon is offline. We have 90 seconds to guide Caelum-4 onto the landing pad!',
      options: [
        {
          id: 'opt_laser_overdrive',
          title: 'A. OVERDRIVE HIGH-GAIN RADAR TRANSPONDER',
          icon: '📡',
          badge: 'POWER SURGE GUIDANCE',
          desc: 'Channel our remaining habitat battery directly into the rooftop parabolic dish to burn through atmospheric ionization.',
          consequenceText: 'A blinding green laser beam shoots into the sky! Caelum-4 locks on instantly! Terminal retro-rockets fire with a deafening roar, touching down 15 meters from the outpost!',
          impact: { electricity: -20, crewMorale: +25, trust: 'all' }
        },
        {
          id: 'opt_rover_triangulate',
          title: 'B. DEPLOY ROVER AS MOBILE BEACON',
          icon: '🚜',
          badge: 'GROUND INTERCEPTION',
          desc: 'Alex and Liam remotely pilot Ares Rover #1 onto the crest of the ridge to create a two-point triangulation radar lock.',
          consequenceText: 'Flawless precision! The rover’s auxiliary dish establishes the vector. Caelum-4 makes a picture-perfect touchdown on the landing grid amidst cheers and tears!',
          impact: { electricity: -10, crewMorale: +20, trust: 'liam' }
        },
        {
          id: 'opt_manual_override',
          title: 'C. MAYA TAKES MANUAL FLY-BY-WIRE CONTROL',
          icon: '🕹️',
          badge: 'TEST PILOT INSTINCT',
          desc: 'Transfer terminal descent control to Commander Maya’s manual flight joystick in the command module.',
          consequenceText: 'Maya’s test-pilot nerves of steel shine! With sweat on her brow, she manually guides the 7-ton spacecraft down safely onto the pad! Mission accomplished!',
          impact: { oxygen: -5, crewMorale: +22, trust: 'maya' }
        }
      ]
    }
  }
];


// ===== js/engine/audio.js =====
// Web Audio API Sound Synthesizer & Ambient Engine
// 100% Procedural - Zero External Audio Files, Zero WASM
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.windNode = null;
    this.windGain = null;
    this.musicTimer = null;
    this.isMuted = false;
    this.currentMood = 'calm'; // 'calm', 'tense', 'emotional', 'victory'
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupWindAmbience();
      this.startAmbientMusic();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.windGain) {
      this.windGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);
    }
    return !this.isMuted;
  }

  setMood(mood) {
    this.currentMood = mood;
  }

  // Atmospheric Martian Wind (White Noise + Sweeping Biquad Lowpass Filter)
  setupWindAmbience() {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;
      filter.Q.value = 3.0;

      // Slowly modulate filter frequency for wind gusts
      setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const targetFreq = 140 + Math.random() * 220;
        filter.frequency.linearRampToValueAtTime(targetFreq, now + 3);
      }, 3500);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = this.isMuted ? 0 : 0.035;

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);
      whiteNoise.start(0);
      this.windNode = whiteNoise;
    } catch (e) {
      console.warn('Audio ambience init notice:', e);
    }
  }

  // Procedural Warm Space Chords (Soft sine chords for emotional storytelling)
  startAmbientMusic() {
    const chordProgressions = {
      calm: [
        [220, 261.63, 329.63], // Am
        [174.61, 220, 261.63], // F
        [261.63, 329.63, 392], // C
        [196, 246.94, 293.66]  // G
      ],
      tense: [
        [146.83, 174.61, 220], // Dm
        [138.59, 174.61, 207.65], // C#dim
        [130.81, 164.81, 196]  // C
      ],
      emotional: [
        [261.63, 329.63, 392, 493.88], // Cmaj7
        [220, 261.63, 329.63, 392],    // Am7
        [174.61, 220, 261.63, 329.63]  // Fmaj7
      ]
    };

    let chordIdx = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const chords = chordProgressions[this.currentMood] || chordProgressions.calm;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      this.playPadChord(chord, 4.5);
    }, 6000);
  }

  playPadChord(frequencies, duration = 4.0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    frequencies.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  }

  // --- SOUND EFFECTS ---

  playClick() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playTypewriter() {
    if (!this.ctx || this.isMuted) return;
    if (Math.random() > 0.4) return; // subtle throttle
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200 + Math.random() * 300, now);
    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  playRadioSquelch() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playChime() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    });
  }

  playAlarm() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(500, now + 0.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }
}


// ===== js/engine/canvas-renderer.js =====
// 2D Illustrated Canvas Renderer
// Hand-crafted Illustrated Environments, Expressive Characters & Atmospheric Martian Scenes
// Inspired by Henry Stickmin & Indie Narrative Adventures (Warm, Accessible, Character-Focused)
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    let radius = 0;
    if (typeof r === 'number') radius = r;
    else if (Array.isArray(r)) radius = r[0] || 0;
    this.rect(x, y, w, h);
    return this;
  };
}

class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.currentRoom = 'command'; // 'command', 'common', 'greenhouse', 'lifesupport', 'exterior'
    this.animTime = 0;
    this.interactiveObjects = [];
    this.hoveredObject = null;
    this.dustParticles = [];
    this.weatherEffect = 'clear'; // 'clear', 'dust_storm', 'radiation'
    this.initDust();
  }

  initDust() {
    this.dustParticles = [];
    for (let i = 0; i < 70; i++) {
      this.dustParticles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 + 1,
        speedY: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  setRoom(roomKey) {
    this.currentRoom = roomKey;
  }

  setWeather(weather) {
    this.weatherEffect = weather;
  }

  resize() {
    const container = this.canvas.parentElement;
    const w = (container && container.clientWidth) || window.innerWidth || 1280;
    const h = (container && container.clientHeight) || window.innerHeight || 720;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  render(dt = 0.016, gameState = null) {
    this.animTime += dt;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Save transform scale for responsive 1280x720 virtual canvas
    ctx.save();
    const scaleX = w / 1280;
    const scaleY = h / 720;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (w - 1280 * scale) / 2;
    const offsetY = (h - 720 * scale) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw Current Illustrated Room
    switch (this.currentRoom) {
      case 'command':
        this.drawCommandHub(ctx);
        break;
      case 'common':
        this.drawCommonRoom(ctx);
        break;
      case 'greenhouse':
        this.drawGreenhouse(ctx);
        break;
      case 'lifesupport':
        this.drawLifeSupport(ctx);
        break;
      case 'exterior':
        this.drawExteriorMars(ctx);
        break;
      default:
        this.drawCommandHub(ctx);
    }

    // Weather / Atmospheric overlays
    if (this.currentRoom === 'exterior' || this.weatherEffect === 'dust_storm') {
      this.drawAtmosphericEffects(ctx);
    }

    // Interactive highlights & click targets
    this.drawInteractiveHighlights(ctx);

    ctx.restore();
  }

  // ================= 1. COMMAND HUB =================
  drawCommandHub(ctx) {
    // Wall backdrop - clean warm slate
    const wallGrad = ctx.createLinearGradient(0, 0, 0, 520);
    wallGrad.addColorStop(0, '#1c2836');
    wallGrad.addColorStop(1, '#2c3e50');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, 1280, 560);

    // Floor
    this.drawOutpostFloor(ctx, '#34495e', '#2c3e50');

    // Large Panoramic Observation Window to Mars
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(140, 50, 680, 320, 24);
    ctx.clip();

    // Mars sky outside window
    this.drawMarsSky(ctx, 140, 50, 680, 320);
    // Red Martian horizon & craters
    this.drawMarsLandscape(ctx, 140, 220, 680, 150);

    // Window glass reflection & frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(180, 60);
    ctx.lineTo(340, 360);
    ctx.stroke();
    ctx.restore();

    // Reinforced Window Frame
    ctx.strokeStyle = '#4a627a';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.roundRect(140, 50, 680, 320, 24);
    ctx.stroke();

    // Communications Desk & Computer Terminals
    ctx.fillStyle = '#1e2b37';
    ctx.beginPath();
    ctx.roundRect(860, 180, 360, 360, 16);
    ctx.fill();
    ctx.strokeStyle = '#3d566e';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Comms Monitors
    ctx.fillStyle = '#0a1520';
    ctx.fillRect(890, 210, 300, 150);
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(890, 210, 300, 150);

    // Orbit Path Graphic on Screen
    ctx.strokeStyle = '#4fc3f7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(1040, 285, 90, 35, 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Mars dot & Caelum-4 ship dot
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(1040, 285, 14, 0, Math.PI * 2);
    ctx.fill();

    const shipAngle = this.animTime * 0.8;
    const shipX = 1040 + Math.cos(shipAngle) * 90;
    const shipY = 285 + Math.sin(shipAngle) * 35;
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(shipX, shipY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Monitor text
    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('CAELUM-4 ORBITAL TRACKING', 905, 230);
    ctx.fillStyle = '#7f9bb3';
    ctx.font = '10px monospace';
    ctx.fillText('STATUS: PHASING BURN ACTIVE', 905, 345);

    // Holographic Mars Globe on Central Pedestal
    this.drawHoloGlobe(ctx, 480, 480);

    // Character: Commander Maya standing by observation port
    this.drawCharacterFigure(ctx, 300, 340, 'maya', 'Maya Chen', 'CMD');
  }

  // ================= 2. COMMON LIVING ROOM =================
  drawCommonRoom(ctx) {
    // Warm, welcoming habitat colors
    ctx.fillStyle = '#2b313d';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#404958', '#313844');

    // Warm ceiling lighting pendant
    ctx.save();
    const lampGlow = ctx.createRadialGradient(640, 60, 20, 640, 280, 480);
    lampGlow.addColorStop(0, 'rgba(255, 220, 160, 0.25)');
    lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lampGlow;
    ctx.fillRect(0, 0, 1280, 720);

    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(640, 0);
    ctx.lineTo(640, 80);
    ctx.stroke();

    ctx.fillStyle = '#ffa726';
    ctx.beginPath();
    ctx.arc(640, 95, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bunk beds on left wall
    ctx.fillStyle = '#37474f';
    ctx.fillRect(60, 120, 220, 420);
    // Bed 1 (Top)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(80, 180, 180, 70);
    ctx.fillStyle = '#ff7043'; // warm orange blanket
    ctx.fillRect(120, 190, 130, 55);
    ctx.fillStyle = '#ffffff'; // pillow
    ctx.beginPath();
    ctx.roundRect(85, 195, 30, 45, 6);
    ctx.fill();

    // Bed 2 (Bottom)
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(80, 360, 180, 70);
    ctx.fillStyle = '#42a5f5'; // blue blanket
    ctx.fillRect(120, 370, 130, 55);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(85, 375, 30, 45, 6);
    ctx.fill();

    // Corkboard with Earth Photos & Notes
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(360, 130, 320, 190);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 8;
    ctx.strokeRect(360, 130, 320, 190);

    // Photos pinned to board
    this.drawPolaroid(ctx, 390, 160, -0.08, '#4fc3f7', 'Iceland Crew');
    this.drawPolaroid(ctx, 490, 155, 0.05, '#81c784', 'Home Lawn');
    this.drawPolaroid(ctx, 590, 170, -0.04, '#ffb74d', 'Launch Day');

    // Central Dining Table with Mugs
    ctx.fillStyle = '#546e7a';
    ctx.beginPath();
    ctx.ellipse(660, 500, 190, 65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#37474f';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Coffee mugs with tiny animated steam
    this.drawCoffeeMug(ctx, 610, 485, '#e53935');
    this.drawCoffeeMug(ctx, 700, 495, '#00acc1');

    // Acoustic Guitar in corner
    this.drawGuitar(ctx, 1080, 320);

    // Character: Dr. Samira sitting relaxed
    this.drawCharacterFigure(ctx, 820, 380, 'samira', 'Samira Morales', 'BIO');
  }

  // ================= 3. GREENHOUSE / HYDROPONICS =================
  drawGreenhouse(ctx) {
    // Translucent biological pod with magenta grow lighting
    ctx.fillStyle = '#1c2e26';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#264235', '#1e332a');

    // Domed skylight looking at Mars sky
    ctx.save();
    ctx.beginPath();
    ctx.arc(640, 220, 460, Math.PI * 0.9, Math.PI * 0.1, true);
    ctx.lineTo(1280, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 100, 150, 0.08)';
    ctx.fill();
    ctx.restore();

    // Violet / Magenta LED Growth Racks
    for (let row = 0; row < 3; row++) {
      const rackY = 160 + row * 120;
      // Rack bar
      ctx.fillStyle = '#37474f';
      ctx.fillRect(160, rackY, 960, 20);

      // Pinkish-purple LED strips glowing
      const ledGlow = Math.sin(this.animTime * 2 + row) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(236, 64, 122, ${0.7 * ledGlow})`;
      ctx.shadowColor = '#ec407a';
      ctx.shadowBlur = 15;
      ctx.fillRect(170, rackY + 14, 940, 6);
      ctx.shadowBlur = 0;

      // Planter trays with lush greens
      ctx.fillStyle = '#2e7d32';
      for (let plant = 0; plant < 18; plant++) {
        const plantX = 190 + plant * 52;
        const plantH = 26 + (plant % 4) * 6;
        ctx.beginPath();
        ctx.ellipse(plantX, rackY + 50, 20, plantH, 0, Math.PI, 0);
        ctx.fill();

        // Tiny cherry tomatoes on row 2
        if (row === 1 && plant % 3 === 0) {
          ctx.fillStyle = '#e53935';
          ctx.beginPath();
          ctx.arc(plantX + 6, rackY + 38, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#2e7d32';
        }
      }

      // Hydroponic clear water tubes with animated bubbles
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(150, rackY + 60);
      ctx.lineTo(1130, rackY + 60);
      ctx.stroke();
    }

    // Nutrient Mixer Console
    ctx.fillStyle = '#2b3d33';
    ctx.beginPath();
    ctx.roundRect(80, 360, 180, 220, 12);
    ctx.fill();
    ctx.strokeStyle = '#43a047';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#81c784';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('NUTRIENT RECOVERY', 95, 390);
    ctx.fillText('PH: 6.4 | EC: 1.8', 95, 415);

    // Character: Dr. Samira or Liam
    this.drawCharacterFigure(ctx, 740, 350, 'samira', 'Samira Morales', 'BIO');
  }

  // ================= 4. LIFE SUPPORT & ENGINEERING =================
  drawLifeSupport(ctx) {
    // Industrial engineering hub
    ctx.fillStyle = '#222831';
    ctx.fillRect(0, 0, 1280, 560);
    this.drawOutpostFloor(ctx, '#393e46', '#222831');

    // Overhead Heavy Conduit Pipes (Color coded: Blue=O2, Cyan=Water, Yellow=Power)
    this.drawConduitPipe(ctx, 0, 60, 1280, 18, '#0288d1', 'O2 DISTRIBUTION');
    this.drawConduitPipe(ctx, 0, 95, 1280, 16, '#00acc1', 'RECYCLED WATER');
    this.drawConduitPipe(ctx, 0, 128, 1280, 14, '#fbc02d', 'SOLAR BUS 400V');

    // THE MOXIE UNIT (Mars Oxygen ISRU Electrolysis Chamber)
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.roundRect(160, 200, 280, 340, 18);
    ctx.fill();
    ctx.strokeStyle = '#546e7a';
    ctx.lineWidth = 6;
    ctx.stroke();

    // MOXIE Electrolysis Inspection Port (Glowing warm orange inside)
    const moxiePulse = Math.sin(this.animTime * 4) * 0.15 + 0.85;
    ctx.fillStyle = `rgba(255, 112, 67, ${0.8 * moxiePulse})`;
    ctx.shadowColor = '#ff7043';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(300, 320, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Brass pressure valve gauge
    this.drawPressureGauge(ctx, 230, 240, 'BAR');
    this.drawPressureGauge(ctx, 370, 240, '°C');

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NASA MOXIE (O2 ISRU)', 300, 420);
    ctx.fillStyle = '#7f9bb3';
    ctx.font = '10px monospace';
    ctx.fillText('CORE TEMP: 792°C | 99.4% PURITY', 300, 440);
    ctx.textAlign = 'left';

    // Sabatier Water Recovery Unit
    ctx.fillStyle = '#263238';
    ctx.beginPath();
    ctx.roundRect(520, 220, 260, 320, 16);
    ctx.fill();
    ctx.strokeStyle = '#00acc1';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#00acc1';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('SABATIER WATER LOOP', 545, 255);
    ctx.fillStyle = '#80deea';
    ctx.font = '10px monospace';
    ctx.fillText('CATALYST: RUTHENIUM-TITANIA', 545, 280);
    ctx.fillText('EFFICIENCY: 98.4%', 545, 305);

    // Storage Water Level Tube
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(720, 320, 24, 180);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(722, 360, 20, 138); // water fill

    // Character: Dr. Liam Brooks tinkering with wrench
    this.drawCharacterFigure(ctx, 880, 330, 'liam', 'Liam Brooks', 'ENG');
  }

  // ================= 5. EXTERIOR MARS SURFACE =================
  drawExteriorMars(ctx) {
    // Vast red Martian Sky
    this.drawMarsSky(ctx, 0, 0, 1280, 440);

    // Distant Rugged Crater Ridges
    this.drawMarsLandscape(ctx, 0, 260, 1280, 240);

    // Outpost Dome Structure on left
    ctx.fillStyle = '#e0e6ed';
    ctx.beginPath();
    ctx.arc(220, 500, 240, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Outpost Airlock Door
    ctx.fillStyle = '#37474f';
    ctx.beginPath();
    ctx.roundRect(320, 380, 90, 160, 8);
    ctx.fill();
    ctx.strokeStyle = '#ff7043';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('AIRLOCK 1', 335, 400);

    // Photovoltaic Solar Array Farm on right ridge
    this.drawSolarArray(ctx, 840, 320, 160, 90);
    this.drawSolarArray(ctx, 1020, 300, 160, 90);

    // Ares Rover #1 parked on red dust
    this.drawMarsRover(ctx, 580, 420);

    // Weather warning beacon
    if (this.weatherEffect === 'dust_storm') {
      ctx.fillStyle = 'rgba(255, 34, 68, 0.25)';
      ctx.fillRect(0, 0, 1280, 720);
    }
  }

  // --- REUSABLE ILLUSTRATED ART COMPONENTS ---

  drawOutpostFloor(ctx, mainColor, darkColor) {
    ctx.fillStyle = mainColor;
    ctx.fillRect(0, 520, 1280, 200);

    // Perspective floor tiles
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;
    for (let x = -200; x < 1500; x += 140) {
      ctx.beginPath();
      ctx.moveTo(x, 520);
      ctx.lineTo(x + (x - 640) * 0.4, 720);
      ctx.stroke();
    }
    for (let y = 520; y < 720; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }
  }

  drawMarsSky(ctx, x, y, w, h) {
    const sky = ctx.createLinearGradient(x, y, x, y + h);
    if (this.weatherEffect === 'dust_storm') {
      sky.addColorStop(0, '#3a1f18');
      sky.addColorStop(0.5, '#5c2d20');
      sky.addColorStop(1, '#8b4513');
    } else {
      sky.addColorStop(0, '#120d18'); // near vacuum dark violet
      sky.addColorStop(0.5, '#4a2528');
      sky.addColorStop(1, '#9e4732'); // dusty pink-red horizon
    }
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);

    // Earth in the sky (Pale Blue Dot)
    if (this.weatherEffect !== 'dust_storm') {
      ctx.fillStyle = '#64b5f6';
      ctx.shadowColor = '#64b5f6';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + w * 0.72, y + h * 0.28, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  drawMarsLandscape(ctx, x, y, w, h) {
    // Distant layered red hills
    ctx.fillStyle = '#6d2b1f';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let px = x; px <= x + w; px += 40) {
      const hillY = y + 40 + Math.sin(px * 0.008) * 25 + Math.cos(px * 0.02) * 12;
      ctx.lineTo(px, hillY);
    }
    ctx.lineTo(x + w, y + h);
    ctx.fill();

    // Foreground rolling dunes
    ctx.fillStyle = '#a0402c';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    for (let px = x; px <= x + w; px += 30) {
      const duneY = y + 100 + Math.sin(px * 0.005 + 1) * 35;
      ctx.lineTo(px, duneY);
    }
    ctx.lineTo(x + w, y + h);
    ctx.fill();
  }

  drawHoloGlobe(ctx, cx, cy) {
    ctx.save();
    // Glowing pedestal
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 40, cy, 80, 60);

    // Blue holographic light beam
    ctx.fillStyle = 'rgba(0, 229, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 90, cy - 140);
    ctx.lineTo(cx + 90, cy - 140);
    ctx.lineTo(cx + 30, cy);
    ctx.closePath();
    ctx.fill();

    // Rotating Mars Globe Wireframe
    const rot = this.animTime * 0.5;
    ctx.shadowColor = '#ff7043';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#ff7043';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy - 80, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Latitude rings
    ctx.beginPath();
    ctx.ellipse(cx, cy - 80, 50, 20 * Math.sin(rot), 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawPolaroid(ctx, x, y, rot, pinColor, caption) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // White photo card
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 75, 90);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;

    // Photo image
    ctx.fillStyle = '#90caf9';
    ctx.fillRect(6, 6, 63, 60);

    // Caption
    ctx.fillStyle = '#37474f';
    ctx.font = '8px cursive, sans-serif';
    ctx.fillText(caption, 8, 80);

    // Pushpin
    ctx.fillStyle = pinColor;
    ctx.beginPath();
    ctx.arc(37, 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawCoffeeMug(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, 22, 26, [0, 0, 6, 6]);
    ctx.fill();

    // Handle
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 24, y + 13, 8, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();

    // Steam wafting
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steamY = y - 6 - (this.animTime * 15 % 20);
    ctx.moveTo(x + 11, y - 2);
    ctx.quadraticCurveTo(x + 16, steamY + 8, x + 11, steamY);
    ctx.stroke();
  }

  drawGuitar(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.2);

    // Body
    ctx.fillStyle = '#8d6e63';
    ctx.beginPath();
    ctx.ellipse(0, 100, 36, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(0, 45, 28, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soundhole
    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(0, 65, 12, 0, Math.PI * 2);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#d7ccc8';
    ctx.fillRect(-6, -40, 12, 85);
    // Headstock
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(-8, -60, 16, 22);

    ctx.restore();
  }

  drawConduitPipe(ctx, x, y, w, h, color, label) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x, y, w, 3);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText(label, x + 200, y + h - 4);
    ctx.fillText(label, x + 700, y + h - 4);
  }

  drawPressureGauge(ctx, x, y, unit) {
    ctx.fillStyle = '#cfd8dc';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#455a64';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Needle
    const needleAngle = Math.sin(this.animTime + x) * 0.6 - 0.4;
    ctx.strokeStyle = '#d32f2f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(needleAngle) * 18, y + Math.sin(needleAngle) * 18);
    ctx.stroke();

    ctx.fillStyle = '#37474f';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(unit, x, y + 15);
    ctx.textAlign = 'left';
  }

  drawSolarArray(ctx, x, y, w, h) {
    ctx.save();
    // Metal mounting leg
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + h);
    ctx.lineTo(x + w * 0.5, y + h + 80);
    ctx.stroke();

    // Angled Blue Photovoltaic Panel
    ctx.fillStyle = '#1565c0';
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - 20, y + h);
    ctx.lineTo(x - 20, y + h + 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dust particles on panels if storm
    if (this.weatherEffect === 'dust_storm') {
      ctx.fillStyle = 'rgba(160, 82, 45, 0.75)';
      ctx.fill();
    }
    ctx.restore();
  }

  drawMarsRover(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);

    // 6 Big Rocker-Bogie Wheels
    ctx.fillStyle = '#263238';
    const wheelPositions = [-70, -20, 30, -55, -5, 45];
    wheelPositions.forEach((wx, i) => {
      const wy = i < 3 ? 40 : 35;
      ctx.beginPath();
      ctx.arc(wx, wy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // White Rover Chassis Body
    ctx.fillStyle = '#eceff1';
    ctx.strokeStyle = '#b0bec5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-80, -20, 140, 50, 8);
    ctx.fill();
    ctx.stroke();

    // High Gain Antenna Mast
    ctx.strokeStyle = '#78909c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, -20);
    ctx.lineTo(40, -65);
    ctx.stroke();

    // Camera Sensor Head
    ctx.fillStyle = '#37474f';
    ctx.fillRect(32, -75, 24, 14);

    // Rover NASA / Ares Decal
    ctx.fillStyle = '#0288d1';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('ARES ROVER 1', -65, 5);

    ctx.restore();
  }

  // --- CHARACTER SPRITES (Charming, Expressive, Henry Stickmin Inspired) ---
  drawCharacterFigure(ctx, x, y, charKey, name, badge) {
    ctx.save();
    ctx.translate(x, y);

    // Subtle breathing / idle animation
    const breath = Math.sin(this.animTime * 2.5 + x) * 2;

    // Shadow on floor
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 160, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs / Boots
    ctx.fillStyle = '#cfd8dc';
    ctx.fillRect(-16, 95 + breath, 12, 65);
    ctx.fillRect(4, 95 + breath, 12, 65);
    ctx.fillStyle = '#37474f'; // heavy boots
    ctx.fillRect(-20, 150 + breath, 18, 14);
    ctx.fillRect(2, 150 + breath, 18, 14);

    // Torso - Outpost Jumpsuit / Flight suit
    let suitColor = '#ffffff';
    let trimColor = '#00e5ff';
    if (charKey === 'maya') { suitColor = '#283593'; trimColor = '#ffd54f'; } // Navy Commander
    if (charKey === 'liam') { suitColor = '#e65100'; trimColor = '#ffb74d'; } // Orange Engineer
    if (charKey === 'samira') { suitColor = '#1b5e20'; trimColor = '#81c784'; } // Green Medical

    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.roundRect(-24, 25 + breath, 48, 75, 10);
    ctx.fill();

    // Role Chest Stripe / Patch
    ctx.fillStyle = trimColor;
    ctx.fillRect(-20, 38 + breath, 40, 6);

    // Head / Face
    ctx.fillStyle = '#ffcc80'; // skin tone
    ctx.beginPath();
    ctx.arc(0, -5 + breath, 24, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Features
    if (charKey === 'maya') {
      ctx.fillStyle = '#212121'; // neat black bun
      ctx.beginPath();
      ctx.arc(0, -14 + breath, 25, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, -32 + breath, 12, 0, Math.PI * 2); // bun
      ctx.fill();
    } else if (charKey === 'liam') {
      ctx.fillStyle = '#5d4037'; // messy brown hair
      ctx.beginPath();
      ctx.arc(0, -15 + breath, 25, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      // Goggles on forehead
      ctx.fillStyle = '#37474f';
      ctx.fillRect(-18, -22 + breath, 36, 10);
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(-14, -20 + breath, 12, 6);
      ctx.fillRect(2, -20 + breath, 12, 6);
    } else if (charKey === 'samira') {
      ctx.fillStyle = '#3e2723'; // wavy dark hair
      ctx.beginPath();
      ctx.arc(0, -12 + breath, 26, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      ctx.fillRect(-24, -10 + breath, 12, 45); // hair side lock
    }

    // Expressive Eyes (Henry Stickmin charm)
    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(-7, -4 + breath, 3, 0, Math.PI * 2);
    ctx.arc(7, -4 + breath, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smile / expression
    ctx.strokeStyle = '#212121';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 4 + breath, 6, 0, Math.PI);
    ctx.stroke();

    // Floating Name Tag above character
    ctx.fillStyle = 'rgba(10, 20, 30, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-60, -60 + breath, 120, 22, 4);
    ctx.fill();
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${name} [${badge}]`, 0, -45 + breath);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  drawAtmosphericEffects(ctx) {
    // Swirling dust particles across canvas
    ctx.save();
    this.dustParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x > 1280) p.x = 0;
      if (p.y > 720) p.y = 0;
      if (p.y < 0) p.y = 720;

      ctx.fillStyle = `rgba(220, 120, 80, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawInteractiveHighlights(ctx) {
    // Subtle pulsating glow on interactive props
    if (this.hoveredObject) {
      // Handled via DOM overlays for crisp responsiveness
    }
  }
}


// ===== js/engine/resources.js =====
// Resource Simulation & Interdependent ECLSS Systems
// Oxygen, Water, Food, Electricity with Real Cause-and-Effect Mechanics
class ResourceManager {
  constructor() {
    this.resources = {
      oxygen: 90,
      water: 85,
      food: 92,
      electricity: 95
    };

    this.crew = {
      maya: { name: 'Maya Chen', health: 100, morale: 95, status: 'Optimal' },
      liam: { name: 'Liam Brooks', health: 95, morale: 90, status: 'Optimal' },
      samira: { name: 'Samira Morales', health: 100, morale: 92, status: 'Optimal' },
      alex: { name: 'Alex Vance', health: 100, morale: 95, status: 'Optimal' }
    };

    // Allocation policies
    this.allocation = {
      foodRations: 'standard', // 'full', 'standard', 'half', 'emergency'
      powerGrid: 'balanced',   // 'high_efficiency', 'balanced', 'power_saver'
      waterRecycling: 'standard' // 'heavy_filter', 'standard', 'conserve'
    };

    this.dailyLog = [];
  }

  reset(defaultResources = null) {
    if (defaultResources) {
      this.resources = { ...defaultResources };
    } else {
      this.resources = { oxygen: 90, water: 85, food: 92, electricity: 95 };
    }
    for (const member in this.crew) {
      this.crew[member].health = 100;
      this.crew[member].morale = 95;
      this.crew[member].status = 'Optimal';
    }
  }

  setAllocation(type, value) {
    if (this.allocation[type] !== undefined) {
      this.allocation[type] = value;
    }
  }

  // Calculate daily consumption and production based on day conditions & player allocations
  simulateDailyPassage(dayData) {
    const report = {
      consumed: {},
      produced: {},
      net: {},
      notes: []
    };

    // 1. Food Calculation
    let foodBurn = 12;
    let foodMoraleModifier = 0;
    if (this.allocation.foodRations === 'full') {
      foodBurn = 18;
      foodMoraleModifier = +6;
      report.notes.push('Full rations boosted crew energy and lifted spirits.');
    } else if (this.allocation.foodRations === 'standard') {
      foodBurn = 12;
      foodMoraleModifier = +1;
    } else if (this.allocation.foodRations === 'half') {
      foodBurn = 7;
      foodMoraleModifier = -6;
      report.notes.push('Half rations caused hunger pangs and minor fatigue.');
    } else if (this.allocation.foodRations === 'emergency') {
      foodBurn = 4;
      foodMoraleModifier = -14;
      report.notes.push('Emergency quarter-rations severely impacted crew morale and stamina.');
    }

    // 2. Electricity Calculation
    let solarGeneration = 28;
    if (dayData.dayNumber === 3) {
      // Dust storm cuts solar dramatically
      solarGeneration = 10;
      report.notes.push('Severe Martian dust storm attenuated solar array output by 65%.');
    }

    let powerDrain = 26;
    if (this.allocation.powerGrid === 'power_saver') {
      powerDrain = 16;
      report.notes.push('Power saver mode conserved battery reserve.');
    } else if (this.allocation.powerGrid === 'high_efficiency') {
      powerDrain = 32;
    }

    // 3. Water Calculation
    let waterDrain = 14;
    let waterRecovered = 10;
    if (this.allocation.waterRecycling === 'heavy_filter') {
      waterRecovered = 14;
      powerDrain += 5; // consumes more power
    } else if (this.allocation.waterRecycling === 'conserve') {
      waterRecovered = 7;
      powerDrain -= 3;
    }

    // 4. Oxygen Calculation (MOXIE Electrolysis)
    let o2Consumed = 15;
    let o2Produced = 12;
    if (this.resources.electricity < 25) {
      o2Produced = 6; // power brownout cuts MOXIE
      report.notes.push('Low battery grid choked MOXIE electrolysis output.');
    }

    // Apply Net Changes
    const dO2 = o2Produced - o2Consumed;
    const dH2O = waterRecovered - waterDrain;
    const dFood = -foodBurn;
    const dPower = solarGeneration - powerDrain;

    this.resources.oxygen = Math.max(0, Math.min(100, Math.round(this.resources.oxygen + dO2)));
    this.resources.water = Math.max(0, Math.min(100, Math.round(this.resources.water + dH2O)));
    this.resources.food = Math.max(0, Math.min(100, Math.round(this.resources.food + dFood)));
    this.resources.electricity = Math.max(0, Math.min(100, Math.round(this.resources.electricity + dPower)));

    // Crew Status Update
    for (const key in this.crew) {
      const c = this.crew[key];
      c.morale = Math.max(0, Math.min(100, c.morale + foodMoraleModifier));

      // Health penalties if critical
      if (this.resources.oxygen < 20) {
        c.health = Math.max(0, c.health - 20);
        c.status = 'Hypoxia Warning';
      } else if (this.resources.water < 15) {
        c.health = Math.max(0, c.health - 15);
        c.status = 'Dehydrated';
      } else if (this.resources.food < 10) {
        c.health = Math.max(0, c.health - 12);
        c.status = 'Malnourished';
      } else if (c.health > 85) {
        c.status = 'Optimal';
      } else {
        c.status = 'Fatigued';
      }
    }

    report.net = { oxygen: dO2, water: dH2O, food: dFood, electricity: dPower };
    return report;
  }

  // Apply instant impact from narrative choice
  applyChoiceImpact(impact) {
    if (!impact) return;
    if (impact.oxygen) this.resources.oxygen = Math.max(0, Math.min(100, this.resources.oxygen + impact.oxygen));
    if (impact.water) this.resources.water = Math.max(0, Math.min(100, this.resources.water + impact.water));
    if (impact.food) this.resources.food = Math.max(0, Math.min(100, this.resources.food + impact.food));
    if (impact.electricity) this.resources.electricity = Math.max(0, Math.min(100, this.resources.electricity + impact.electricity));

    if (impact.crewMorale) {
      for (const key in this.crew) {
        this.crew[key].morale = Math.max(0, Math.min(100, this.crew[key].morale + impact.crewMorale));
      }
    }
  }

  // Check if any loss condition triggered
  checkDefeat() {
    if (this.resources.oxygen <= 0) {
      return { lost: true, reason: 'Oxygen depletion resulted in atmospheric hypoxia in the habitat.' };
    }
    if (this.resources.water <= 0) {
      return { lost: true, reason: 'Critical water depletion caused fatal dehydration and loop failure.' };
    }
    if (this.resources.food <= 0) {
      return { lost: true, reason: 'Complete exhaustion of food reserves. The crew was unable to sustain biological functions.' };
    }
    if (this.resources.electricity <= 0) {
      return { lost: true, reason: 'Total power blackout caused habitat temperatures to plummet to -70°C.' };
    }

    // Check if any crew member perished
    for (const key in this.crew) {
      if (this.crew[key].health <= 0) {
        return { lost: true, reason: `${this.crew[key].name} succumbed to severe physical trauma and exhaustion.` };
      }
    }

    return { lost: false };
  }
}


// ===== js/engine/dialogue.js =====
// Interactive Narrative Dialogue System with Typewriter & Character Portraits
// Inspired by Henry Stickmin & Indie Narrative Adventures
class DialogueEngine {
  constructor(audio) {
    this.audio = audio;
    this.dialogueQueue = [];
    this.currentIndex = 0;
    this.currentText = '';
    this.targetText = '';
    this.isTyping = false;
    this.typeTimer = null;
    this.onCompleteCallback = null;

    // DOM bindings
    this.boxEl = document.getElementById('dialogue-box');
    this.speakerEl = document.getElementById('dialogue-speaker');
    this.roleEl = document.getElementById('dialogue-role');
    this.textEl = document.getElementById('dialogue-text');
    this.portraitEl = document.getElementById('dialogue-portrait');
    this.indicatorEl = document.getElementById('dialogue-indicator');

    if (this.boxEl) {
      this.boxEl.addEventListener('click', () => this.handleAdvance());
    }
  }

  startSequence(dialogueList, onComplete = null) {
    if (!dialogueList || dialogueList.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    this.dialogueQueue = [...dialogueList];
    this.currentIndex = 0;
    this.onCompleteCallback = onComplete;
    this.showBox();
    this.displayCurrentLine();
  }

  showBox() {
    if (this.boxEl) {
      this.boxEl.classList.remove('hidden');
    }
  }

  hideBox() {
    if (this.boxEl) {
      this.boxEl.classList.add('hidden');
    }
  }

  displayCurrentLine() {
    if (this.currentIndex >= this.dialogueQueue.length) {
      this.hideBox();
      if (this.onCompleteCallback) {
        this.onCompleteCallback();
      }
      return;
    }

    const line = this.dialogueQueue[this.currentIndex];
    const char = CHARACTERS[line.speaker] || { name: line.speaker, role: 'Crew', color: '#fff' };

    if (this.speakerEl) {
      this.speakerEl.innerText = char.name;
      this.speakerEl.style.color = char.color;
    }
    if (this.roleEl) {
      this.roleEl.innerText = `[${char.badge || char.role}]`;
    }

    // Play radio squelch for Earth
    if (line.speaker === 'earth') {
      this.audio.playRadioSquelch();
    }

    // Update Portrait
    this.updatePortrait(line.speaker, line.portrait || 'neutral');

    // Typewriter effect
    this.targetText = line.text;
    this.currentText = '';
    this.isTyping = true;
    if (this.indicatorEl) this.indicatorEl.classList.add('hidden');

    clearInterval(this.typeTimer);
    let charIdx = 0;
    this.typeTimer = setInterval(() => {
      if (charIdx < this.targetText.length) {
        this.currentText += this.targetText[charIdx];
        if (this.textEl) this.textEl.innerText = this.currentText;
        if (charIdx % 3 === 0) {
          this.audio.playTypewriter();
        }
        charIdx++;
      } else {
        this.finishTyping();
      }
    }, 22);
  }

  finishTyping() {
    clearInterval(this.typeTimer);
    this.isTyping = false;
    this.currentText = this.targetText;
    if (this.textEl) this.textEl.innerText = this.currentText;
    if (this.indicatorEl) this.indicatorEl.classList.remove('hidden');
  }

  handleAdvance() {
    if (this.isTyping) {
      this.finishTyping();
    } else {
      this.audio.playClick();
      this.currentIndex++;
      this.displayCurrentLine();
    }
  }

  updatePortrait(speakerKey, expression = 'neutral') {
    if (!this.portraitEl) return;
    // Render clean procedural SVG avatar
    this.portraitEl.innerHTML = this.getCharacterSVG(speakerKey, expression);
  }

  getCharacterSVG(key, expression) {
    if (key === 'earth') {
      return `
        <svg viewBox="0 0 100 100" class="portrait-svg">
          <circle cx="50" cy="50" r="45" fill="#263238" stroke="#78909c" stroke-width="3"/>
          <path d="M25 65 Q50 35 75 65" fill="none" stroke="#00e5ff" stroke-width="4"/>
          <circle cx="50" cy="45" r="8" fill="#ffd54f"/>
          <text x="50" y="82" fill="#b0bec5" font-size="10" font-family="monospace" text-anchor="middle">HOUSTON</text>
        </svg>
      `;
    }

    let hairColor = '#212121';
    let suitColor = '#1976d2';
    let skinColor = '#ffcc80';

    if (key === 'maya') {
      hairColor = '#212121';
      suitColor = '#1a237e'; // Navy
    } else if (key === 'liam') {
      hairColor = '#5d4037';
      suitColor = '#e65100'; // Orange
    } else if (key === 'samira') {
      hairColor = '#3e2723';
      suitColor = '#2e7d32'; // Green
      skinColor = '#ffb74d';
    } else if (key === 'alex') {
      hairColor = '#37474f';
      suitColor = '#37474f';
    }

    // Expressions
    let eyeShape = '<circle cx="40" cy="50" r="4" fill="#212121"/><circle cx="60" cy="50" r="4" fill="#212121"/>';
    let mouth = '<path d="M42 66 Q50 72 58 66" fill="none" stroke="#212121" stroke-width="2.5" stroke-linecap="round"/>';

    if (expression === 'worried' || expression === 'stressed') {
      mouth = '<path d="M42 68 Q50 63 58 68" fill="none" stroke="#212121" stroke-width="2.5" stroke-linecap="round"/>';
    } else if (expression === 'grin') {
      mouth = '<path d="M40 64 Q50 76 60 64 Z" fill="#ffffff" stroke="#212121" stroke-width="2"/>';
    } else if (expression === 'serious' || expression === 'tired') {
      mouth = '<line x1="42" y1="67" x2="58" y2="67" stroke="#212121" stroke-width="2.5" stroke-linecap="round"/>';
    }

    return `
      <svg viewBox="0 0 100 100" class="portrait-svg">
        <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#334155" stroke-width="3"/>
        <!-- Suit Collar -->
        <path d="M20 95 Q50 75 80 95 Z" fill="${suitColor}"/>
        <!-- Neck -->
        <rect x="42" y="66" width="16" height="15" fill="${skinColor}"/>
        <!-- Head -->
        <circle cx="50" cy="50" r="24" fill="${skinColor}"/>
        <!-- Hair -->
        <path d="M26 48 Q50 20 74 48 Q70 24 50 22 Q30 24 26 48 Z" fill="${hairColor}"/>
        ${key === 'maya' ? '<circle cx="50" cy="20" r="10" fill="#212121"/>' : ''}
        ${key === 'liam' ? '<rect x="32" y="28" width="36" height="7" rx="3" fill="#37474f"/><rect x="36" y="30" width="10" height="4" fill="#00e5ff"/><rect x="54" y="30" width="10" height="4" fill="#00e5ff"/>' : ''}
        <!-- Eyes & Mouth -->
        ${eyeShape}
        ${mouth}
      </svg>
    `;
  }
}


// ===== js/engine/game.js =====
// Main Game State Machine, Day Progression, and Daily Loop Phases
// "MARS OUTPOST: SEVEN DAYS TO SURVIVE"
class MarsGame {
  constructor() {
    this.audio = new AudioEngine();
    this.renderer = null;
    this.resources = new ResourceManager();
    this.dialogue = null;

    this.currentDayIndex = 0; // 0 = Day 1, up to 6 = Day 7
    this.currentPhase = 'INIT'; // 'STORY', 'REPORT', 'EXPLORE', 'DECISION', 'CONSEQUENCE', 'END_REPORT', 'VICTORY', 'DEFEAT'
    this.selectedDecision = null;
    this.decisionHistory = [];
    this.isMuted = false;

    // Bind DOM
    this.dom = {
      canvas: document.getElementById('gameCanvas'),
      hudSol: document.getElementById('hud-sol'),
      hudDaysLeft: document.getElementById('hud-days-left'),
      hudO2: document.getElementById('hud-o2'),
      hudH2O: document.getElementById('hud-h2o'),
      hudFood: document.getElementById('hud-food'),
      hudPower: document.getElementById('hud-power'),
      hudMorale: document.getElementById('hud-morale'),
      roomNav: document.getElementById('room-nav'),
      hotspotsContainer: document.getElementById('hotspots-container'),
      eduModal: document.getElementById('edu-modal'),
      eduTitle: document.getElementById('edu-title'),
      eduTag: document.getElementById('edu-tag'),
      eduIcon: document.getElementById('edu-icon'),
      eduSummary: document.getElementById('edu-summary'),
      eduCloseBtn: document.getElementById('edu-close-btn'),
      reportModal: document.getElementById('report-modal'),
      reportTitle: document.getElementById('report-title'),
      reportSub: document.getElementById('report-sub'),
      reportWeather: document.getElementById('report-weather'),
      reportCrewList: document.getElementById('report-crew-list'),
      reportProceedBtn: document.getElementById('report-proceed-btn'),
      decisionPanel: document.getElementById('decision-panel'),
      decisionTitle: document.getElementById('decision-title'),
      decisionDesc: document.getElementById('decision-desc'),
      decisionCards: document.getElementById('decision-cards'),
      endDayModal: document.getElementById('end-day-modal'),
      endDayTitle: document.getElementById('end-day-title'),
      endDaySummary: document.getElementById('end-day-summary'),
      endDayResourceDiff: document.getElementById('end-day-diff'),
      endDayNextBtn: document.getElementById('end-day-next-btn'),
      victoryModal: document.getElementById('victory-modal'),
      defeatModal: document.getElementById('defeat-modal'),
      defeatReason: document.getElementById('defeat-reason'),
      btnRestart: document.getElementById('btn-restart-game'),
      btnRestartDefeat: document.getElementById('btn-restart-defeat'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      btnProceedToIncident: document.getElementById('btn-proceed-incident'),
      rationSelect: document.getElementById('ration-select'),
      powerSelect: document.getElementById('power-select'),
      waterSelect: document.getElementById('water-select')
    };
  }

  init() {
    this.renderer = new CanvasRenderer(this.dom.canvas);
    this.dialogue = new DialogueEngine(this.audio);

    // Window resize
    window.addEventListener('resize', () => this.renderer.resize());
    this.renderer.resize();

    this.bindEvents();
    this.startCampaign();

    // Start render loop
    let lastT = performance.now();
    const loop = (t) => {
      const dt = Math.min((t - lastT) / 1000, 0.1);
      lastT = t;
      this.renderer.render(dt, this);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  bindEvents() {
    // Audio toggle
    if (this.dom.btnAudioToggle) {
      this.dom.btnAudioToggle.addEventListener('click', () => {
        this.audio.init();
        const unmuted = this.audio.toggleMute();
        this.dom.btnAudioToggle.innerText = unmuted ? '🔊 AUDIO ON' : '🔇 AUDIO MUTED';
      });
    }

    // Room navigation buttons
    document.querySelectorAll('.room-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.audio.init();
        this.audio.playClick();
        const roomKey = e.currentTarget.dataset.room;
        this.switchRoom(roomKey);
      });
    });

    // Educational modal close
    if (this.dom.eduCloseBtn) {
      this.dom.eduCloseBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.eduModal.classList.add('hidden');
      });
    }

    // Situation report proceed button
    if (this.dom.reportProceedBtn) {
      this.dom.reportProceedBtn.addEventListener('click', () => {
        this.audio.init();
        this.audio.playClick();
        this.dom.reportModal.classList.add('hidden');
        this.startPhaseExploration();
      });
    }

    // Proceed from exploration to daily incident
    if (this.dom.btnProceedToIncident) {
      this.dom.btnProceedToIncident.addEventListener('click', () => {
        this.audio.playClick();
        this.startPhaseDecision();
      });
    }

    // End of day next button
    if (this.dom.endDayNextBtn) {
      this.dom.endDayNextBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.dom.endDayModal.classList.add('hidden');
        this.advanceToNextDay();
      });
    }

    // Rations & allocation dropdowns
    if (this.dom.rationSelect) {
      this.dom.rationSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('foodRations', e.target.value);
        this.audio.playClick();
      });
    }
    if (this.dom.powerSelect) {
      this.dom.powerSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('powerGrid', e.target.value);
        this.audio.playClick();
      });
    }
    if (this.dom.waterSelect) {
      this.dom.waterSelect.addEventListener('change', (e) => {
        this.resources.setAllocation('waterRecycling', e.target.value);
        this.audio.playClick();
      });
    }

    // Restart game buttons
    if (this.dom.btnRestart) {
      this.dom.btnRestart.addEventListener('click', () => this.restartGame());
    }
    if (this.dom.btnRestartDefeat) {
      this.dom.btnRestartDefeat.addEventListener('click', () => this.restartGame());
    }
  }

  startCampaign() {
    this.currentDayIndex = 0;
    this.decisionHistory = [];
    const dayData = DAYS_DATA[0];
    this.resources.reset(dayData.defaultResources);
    this.loadDay(this.currentDayIndex);
  }

  restartGame() {
    this.dom.victoryModal.classList.add('hidden');
    this.dom.defeatModal.classList.add('hidden');
    this.dom.endDayModal.classList.add('hidden');
    this.dom.reportModal.classList.add('hidden');
    this.dom.decisionPanel.classList.add('hidden');
    this.startCampaign();
  }

  loadDay(dayIndex) {
    const dayData = DAYS_DATA[dayIndex];
    if (!dayData) return;

    // Set weather in renderer
    if (dayData.dayNumber === 3) {
      this.renderer.setWeather('dust_storm');
      this.audio.setMood('tense');
    } else if (dayData.dayNumber === 5) {
      this.renderer.setWeather('radiation');
      this.audio.setMood('tense');
    } else if (dayData.dayNumber === 6) {
      this.renderer.setWeather('clear');
      this.audio.setMood('emotional');
    } else {
      this.renderer.setWeather('clear');
      this.audio.setMood('calm');
    }

    this.updateHUD();
    this.switchRoom('command');

    // Phase 1: Daily Story Dialogue
    this.currentPhase = 'STORY';
    this.dom.roomNav.classList.add('hidden');
    this.dom.btnProceedToIncident.classList.add('hidden');

    this.dialogue.startSequence(dayData.storyDialogue, () => {
      // Once story dialogue is done, show Situation Report (Phase 2)
      this.showSituationReport();
    });
  }

  // Phase 2: Situation Report
  showSituationReport() {
    this.currentPhase = 'REPORT';
    const dayData = DAYS_DATA[this.currentDayIndex];

    this.dom.reportTitle.innerText = `SOL ${dayData.dayNumber}: ${dayData.title.toUpperCase()}`;
    this.dom.reportSub.innerText = dayData.subtitle;
    this.dom.reportWeather.innerText = dayData.environmentalCondition;

    // Render crew status
    let crewHTML = '';
    for (const key in this.resources.crew) {
      const c = this.resources.crew[key];
      const charInfo = CHARACTERS[key] || { badge: 'CREW' };
      crewHTML += `
        <div class="crew-status-card">
          <div class="crew-badge">${charInfo.badge}</div>
          <div class="crew-name">${c.name}</div>
          <div class="crew-stat-bar">
            <span>HEALTH: ${c.health}%</span>
            <span>MORALE: ${c.morale}%</span>
          </div>
          <div class="crew-cond">${c.status}</div>
        </div>
      `;
    }
    this.dom.reportCrewList.innerHTML = crewHTML;
    this.dom.reportModal.classList.remove('hidden');
    this.audio.playChime();
  }

  // Phase 3: Outpost Exploration & Management
  startPhaseExploration() {
    this.currentPhase = 'EXPLORE';
    this.dom.roomNav.classList.remove('hidden');
    this.dom.btnProceedToIncident.classList.remove('hidden');
    this.switchRoom('command');
  }

  switchRoom(roomKey) {
    this.renderer.setRoom(roomKey);
    // Update active room button
    document.querySelectorAll('.room-btn').forEach(b => {
      if (b.dataset.room === roomKey) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Render Room Hotspots
    this.renderRoomHotspots(roomKey);
  }

  renderRoomHotspots(roomKey) {
    const container = this.dom.hotspotsContainer;
    container.innerHTML = '';

    const dayData = DAYS_DATA[this.currentDayIndex];
    const interactions = (dayData.roomInteractions && dayData.roomInteractions[roomKey]) || [];

    interactions.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'hotspot-btn';
      btn.innerHTML = `<span class="icon">${item.icon}</span><span class="label">${item.name}</span>`;
      btn.addEventListener('click', () => {
        this.audio.init();
        this.audio.playClick();

        if (item.dialogue) {
          this.dialogue.startSequence(item.dialogue);
        } else if (item.eduTopic) {
          this.showEducationalTopic(item.eduTopic);
        } else if (item.text) {
          this.dialogue.startSequence([
            { speaker: 'alex', portrait: 'neutral', text: item.text }
          ]);
        }
      });
      container.appendChild(btn);
    });
  }

  showEducationalTopic(topicKey) {
    const topic = EDUCATIONAL_TOPICS[topicKey];
    if (!topic) return;

    this.dom.eduTitle.innerText = topic.title;
    this.dom.eduTag.innerText = topic.tag;
    this.dom.eduIcon.innerText = topic.icon;
    this.dom.eduSummary.innerText = topic.summary;
    this.dom.eduModal.classList.remove('hidden');
    this.audio.playChime();
  }

  // Phase 4: Henry Stickmin-Inspired Decision
  startPhaseDecision() {
    this.currentPhase = 'DECISION';
    this.dom.roomNav.classList.add('hidden');
    this.dom.btnProceedToIncident.classList.add('hidden');
    this.dom.hotspotsContainer.innerHTML = '';

    const dayData = DAYS_DATA[this.currentDayIndex];
    const dec = dayData.decision;

    this.dom.decisionTitle.innerText = dec.promptTitle;
    this.dom.decisionDesc.innerText = dec.promptDesc;

    // Render 3 Choice Cards
    let cardsHTML = '';
    dec.options.forEach((opt, idx) => {
      cardsHTML += `
        <div class="choice-card" data-idx="${idx}">
          <div class="choice-badge">${opt.badge}</div>
          <div class="choice-icon">${opt.icon}</div>
          <div class="choice-title">${opt.title}</div>
          <div class="choice-desc">${opt.desc}</div>
        </div>
      `;
    });
    this.dom.decisionCards.innerHTML = cardsHTML;
    this.dom.decisionPanel.classList.remove('hidden');

    this.audio.playAlarm();

    // Bind card clicks
    document.querySelectorAll('.choice-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.idx, 10);
        this.selectDecisionOption(dec.options[idx]);
      });
    });
  }

  selectDecisionOption(option) {
    this.audio.playClick();
    this.selectedDecision = option;
    this.dom.decisionPanel.classList.add('hidden');

    // Apply immediate consequence
    this.resources.applyChoiceImpact(option.impact);
    this.updateHUD();

    // Show consequence dialogue / aftermath
    this.dialogue.startSequence([
      { speaker: 'alex', portrait: 'neutral', text: `DECISION EXECUTED: ${option.title}` },
      { speaker: 'maya', portrait: 'determined', text: option.consequenceText }
    ], () => {
      this.showEndDayReport(option);
    });
  }

  // Phase 5: End-of-Day Report & Next Day Check
  showEndDayReport(decisionMade) {
    this.currentPhase = 'END_REPORT';
    const dayData = DAYS_DATA[this.currentDayIndex];

    // Simulate daily passage
    const simReport = this.resources.simulateDailyPassage(dayData);
    this.updateHUD();

    // Check defeat
    const defeatCheck = this.resources.checkDefeat();
    if (defeatCheck.lost) {
      this.triggerDefeat(defeatCheck.reason);
      return;
    }

    // Populate End-of-day summary
    this.dom.endDayTitle.innerText = `SOL ${dayData.dayNumber} COMPLETED`;
    let summaryNotes = `<p><strong>Decision Outcome:</strong> ${decisionMade.consequenceText}</p>`;
    simReport.notes.forEach(note => {
      summaryNotes += `<p>• ${note}</p>`;
    });
    this.dom.endDaySummary.innerHTML = summaryNotes;

    // Resource diffs
    this.dom.endDayResourceDiff.innerHTML = `
      <div class="diff-chip ${simReport.net.oxygen >= 0 ? 'pos' : 'neg'}">💨 O2: ${simReport.net.oxygen >= 0 ? '+' : ''}${simReport.net.oxygen}%</div>
      <div class="diff-chip ${simReport.net.water >= 0 ? 'pos' : 'neg'}">💧 H2O: ${simReport.net.water >= 0 ? '+' : ''}${simReport.net.water}%</div>
      <div class="diff-chip ${simReport.net.food >= 0 ? 'pos' : 'neg'}">🥫 Food: ${simReport.net.food}%</div>
      <div class="diff-chip ${simReport.net.electricity >= 0 ? 'pos' : 'neg'}">⚡ Power: ${simReport.net.electricity >= 0 ? '+' : ''}${simReport.net.electricity}%</div>
    `;

    this.dom.endDayModal.classList.remove('hidden');
    this.audio.playChime();
  }

  advanceToNextDay() {
    this.currentDayIndex++;
    if (this.currentDayIndex >= 7) {
      this.triggerVictory();
    } else {
      this.loadDay(this.currentDayIndex);
    }
  }

  updateHUD() {
    const dayData = DAYS_DATA[this.currentDayIndex] || { dayNumber: 7 };
    this.dom.hudSol.innerText = `SOL ${dayData.dayNumber} / 7`;
    const daysLeft = 7 - dayData.dayNumber;
    this.dom.hudDaysLeft.innerText = daysLeft === 0 ? 'ARRIVAL TODAY' : `${daysLeft} SOLS REMAINING`;

    const res = this.resources.resources;
    this.dom.hudO2.innerText = `${res.oxygen}%`;
    this.dom.hudH2O.innerText = `${res.water}%`;
    this.dom.hudFood.innerText = `${res.food}%`;
    this.dom.hudPower.innerText = `${res.electricity}%`;

    // Average crew morale
    let totalMorale = 0;
    let count = 0;
    for (const k in this.resources.crew) {
      totalMorale += this.resources.crew[k].morale;
      count++;
    }
    const avgMorale = Math.round(totalMorale / count);
    this.dom.hudMorale.innerText = `${avgMorale}%`;
  }

  triggerVictory() {
    this.currentPhase = 'VICTORY';
    this.audio.setMood('emotional');
    this.audio.playChime();
    this.dom.victoryModal.classList.remove('hidden');
  }

  triggerDefeat(reason) {
    this.currentPhase = 'DEFEAT';
    this.audio.setMood('tense');
    this.audio.playAlarm();
    this.dom.defeatReason.innerText = reason;
    this.dom.defeatModal.classList.remove('hidden');
  }
}

// Auto-boot upon DOM load
function bootGame() {
  if (window.__marsGameBooted) return;
  window.__marsGameBooted = true;
  const game = new MarsGame();
  game.init();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', bootGame);
} else {
  bootGame();
}



})();
