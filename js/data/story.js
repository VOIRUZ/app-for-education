// MARS OUTPOST: SEVEN DAYS TO SURVIVE
// Comprehensive Story, Dialogue, Educational Notes, and Daily Scenarios

export const CHARACTERS = {
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

export const EDUCATIONAL_TOPICS = {
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
export const DAYS_DATA = [
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
