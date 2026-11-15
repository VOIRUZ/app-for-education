// ============================================================================
// MOON WATER RESEARCH & SURVIVAL ADVENTURE
// Simple, Engaging Dialogue & Clear Visual Trade-offs
// Green Up-Arrows (▲) for Gains, Red Down-Arrows (▼) for Losses
// Integrated with Tactile Among-Us Style Ship Tasks
// ============================================================================

const CHARACTERS = {
  frisk: {
    name: 'Frisk Amberheart',
    role: 'Lander Commander',
    color: '#00e5ff',
    badge: 'COMMANDER',
    avatar: 'frisk'
  },
  asriel: {
    name: 'Asriel Shells',
    role: 'Rover Driver',
    color: '#76ff03',
    badge: 'ROVER LEAD',
    avatar: 'asriel'
  },
  control: {
    name: 'Houston Control',
    role: 'Earth Flight Director',
    color: '#ffd54f',
    badge: 'MISSION CONTROL',
    avatar: 'control'
  }
};

// Opening Story Sequence (Fast, Action-Packed, Easy English)
const OPENING_CINEMATIC = [
  {
    scene: 'space_transit',
    speaker: 'control',
    text: 'Ares Lander, you are touching down on the Moon! Search the dark craters for water ice to support future human bases.'
  },
  {
    scene: 'impact',
    speaker: 'frisk',
    text: 'MAYDAY! A stray space rock tore off our supply trailer! It crashed into Shackleton Crater 35 km away!'
  },
  {
    scene: 'moon_landing',
    speaker: 'asriel',
    text: 'We touched down safely, but all our tools and extra parts are out at the crash site! I will drive the rover to bring them back.'
  },
  {
    scene: 'departure',
    speaker: 'asriel',
    text: 'You have 7 days alone inside the ship. Walk to the stations when warning alarms sound. Balance our air, water, and power. Stay alive, Frisk!'
  }
];

// The 7-Day Survival Campaign
const DAYS_DATA = [
  // ================= SOL 1 =================
  {
    dayNumber: 1,
    title: 'THE AIR LEAK',
    subtitle: 'Sol 1 — 6 Sols until Asriel Returns',
    overview: 'A stray pebble cracked our air pipe. Cabin air is escaping into space!',
    event: {
      title: 'EMERGENCY: OXYGEN PIPE LEAKING',
      desc: 'Air pressure is dropping fast! Walk your astronaut to the OXYGEN GENERATOR on the left to repair the wiring and make fresh air.',
      targetStation: 'oxygen'
    },
    objective: 'Walk to the OXYGEN GENERATOR on the left wall to fix the air leak.',
    stationKey: 'oxygen',
    taskType: 'wires', // Among Us Wire Task
    dialogueIntro: [
      { speaker: 'asriel', text: 'Frisk! The main air pipe sprung a leak! Move to the Oxygen Generator on the left wall right now!' },
      { speaker: 'frisk', text: 'On my way! I am reconnecting the electrical wires to start splitting water into breathable oxygen.' }
    ],
    decision: {
      prompt: 'CHOOSE HOW TO RESTORE CABIN AIR',
      options: [
        {
          id: 'd1_opt_balanced',
          title: 'Standard Air Generation',
          icon: '💨',
          badge: 'RECOMMENDED',
          summary: 'Splits water into clean oxygen at a safe, steady speed.',
          gains: [
            { qty: '+35%', label: 'Oxygen' }
          ],
          losses: [
            { qty: '12%', label: 'Water' },
            { qty: '10%', label: 'Power' }
          ],
          impact: { oxygen: +35, water: -12, power: -10, hydrogen: +10 }
        },
        {
          id: 'd1_opt_heavy',
          title: 'Emergency Air Blast',
          icon: '⚡',
          badge: 'FASTEST AIR',
          summary: 'Floods the cabin with maximum air immediately, but burns lots of water.',
          gains: [
            { qty: '+50%', label: 'Oxygen' }
          ],
          losses: [
            { qty: '25%', label: 'Water' },
            { qty: '22%', label: 'Power' }
          ],
          impact: { oxygen: +50, water: -25, power: -22, hydrogen: +20 }
        },
        {
          id: 'd1_opt_conservative',
          title: 'Low Trickle Mode',
          icon: '🔋',
          badge: 'SAVES WATER',
          summary: 'Uses very little water, but cabin air stays thin and breathless.',
          gains: [
            { qty: '+18%', label: 'Oxygen' }
          ],
          losses: [
            { qty: '5%', label: 'Water' },
            { qty: '4%', label: 'Power' }
          ],
          impact: { oxygen: +18, water: -5, power: -4, hydrogen: +5 }
        }
      ]
    },
    experimentId: 'electrolysis',
    resolutionDialogue: [
      { speaker: 'frisk', text: 'Air pressure restored! Fresh oxygen is pumping through the vents.' },
      { speaker: 'asriel', text: 'Telemetry confirms you are breathing easy! I am 5 km out in the rover. Rest up for Sol 2!' }
    ]
  },

  // ================= SOL 2 =================
  {
    dayNumber: 2,
    title: 'SOLAR DUST BROWNOUT',
    subtitle: 'Sol 2 — 5 Sols until Asriel Returns',
    overview: 'Moon dust covered our solar panels. Power output dropped by half!',
    event: {
      title: 'EMERGENCY: BATTERY RUNNING LOW',
      desc: 'Solar power cut in half! Walk your astronaut to the POWER GRID on the right to rebalance our electricity breakers.',
      targetStation: 'power'
    },
    objective: 'Walk to the POWER GRID on the right to adjust power sliders.',
    stationKey: 'power',
    taskType: 'divert_power', // Among Us Power Slider Task
    dialogueIntro: [
      { speaker: 'control', text: 'Ares Lander, moon dust cut your solar power in half. Rebalance your electrical circuits before night falls.' },
      { speaker: 'frisk', text: 'Moving to the Power Grid station to divert power and keep our batteries alive.' }
    ],
    decision: {
      prompt: 'SET NIGHTTIME HEATING & BATTERY PLAN',
      options: [
        {
          id: 'd2_opt_eco',
          title: 'Eco Heating Mode (17°C)',
          icon: '🌡️',
          badge: 'RECOMMENDED',
          summary: 'Lowers cabin heat a little to ensure batteries survive through the cold night.',
          gains: [
            { qty: '+15%', label: 'Battery Power Saved' }
          ],
          losses: [
            { qty: '5%', label: 'Cabin Comfort' }
          ],
          impact: { power: +15, morale: -5 }
        },
        {
          id: 'd2_opt_comfort',
          title: 'Full Cozy Warmth (22°C)',
          icon: '🔥',
          badge: 'HIGH DRAIN',
          summary: 'Keeps cabin warm and bright like Earth, but drains heavy battery reserves.',
          gains: [
            { qty: '+10%', label: 'Astronaut Morale' }
          ],
          losses: [
            { qty: '22%', label: 'Battery Power' }
          ],
          impact: { power: -22, morale: +10 }
        },
        {
          id: 'd2_opt_clamp',
          title: 'Emergency Cold Sleep',
          icon: '🔌',
          badge: 'MAX POWER SAVER',
          summary: 'Shuts off all cabin heaters and relies strictly on thick spacesuit layers.',
          gains: [
            { qty: '+25%', label: 'Battery Power Saved' }
          ],
          losses: [
            { qty: '18%', label: 'Freezing Discomfort' }
          ],
          impact: { power: +25, morale: -18 }
        }
      ]
    },
    experimentId: 'power_management',
    resolutionDialogue: [
      { speaker: 'frisk', text: 'Power breakers rebalanced. Battery drain is safely under control.' },
      { speaker: 'asriel', text: 'Nice work saving power. I have replacement solar panels strapped to my cart. 10 km down!' }
    ]
  },

  // ================= SOL 3 =================
  {
    dayNumber: 3,
    title: 'DIRTY WATER FILTER',
    subtitle: 'Sol 3 — 4 Sols until Asriel Returns',
    overview: 'Sediment and fine moon dust clogged the water recycling pipe.',
    event: {
      title: 'EMERGENCY: WATER FILTER BLOCKED',
      desc: 'Wastewater recycler has stalled! Walk your astronaut to the WATER RECYCLER at the back to clear sediment and restart flow.',
      targetStation: 'water'
    },
    objective: 'Walk to the WATER RECYCLER at the back to clean the filter tank.',
    stationKey: 'water',
    taskType: 'filter_debris', // Among Us Debris Vacuum Task
    dialogueIntro: [
      { speaker: 'frisk', text: 'Water pump warning light is flashing. Fine grit clogged the main recycler filter!' },
      { speaker: 'asriel', text: 'Head to the Water Recycler at the back. Vacuum out the sediment chunks and flush the line!' }
    ],
    decision: {
      prompt: 'CHOOSE WATER PURIFIER SETTING',
      options: [
        {
          id: 'd3_opt_standard',
          title: 'Standard 3-Stage Clean',
          icon: '💧',
          badge: 'RECOMMENDED',
          summary: 'Recovers fresh, safe drinking water from wastewater at normal power.',
          gains: [
            { qty: '+32%', label: 'Drinking Water' }
          ],
          losses: [
            { qty: '12%', label: 'Battery Power' }
          ],
          impact: { water: +32, power: -12 }
        },
        {
          id: 'd3_opt_surge',
          title: 'High Pressure Water Flush',
          icon: '🌊',
          badge: 'MAX WATER',
          summary: 'Flushes all wastewater through high pressure pumps to fill water tanks full.',
          gains: [
            { qty: '+45%', label: 'Drinking Water' }
          ],
          losses: [
            { qty: '25%', label: 'Heavy Battery Power' }
          ],
          impact: { water: +45, power: -25 }
        },
        {
          id: 'd3_opt_gravity',
          title: 'Slow Gravity Drip',
          icon: '⏳',
          badge: 'ZERO POWER',
          summary: 'Bypasses the electric pump and lets water slowly drip by gravity.',
          gains: [
            { qty: '+15%', label: 'Drinking Water' }
          ],
          losses: [
            { qty: '6%', label: 'Bitter Mineral Taste' }
          ],
          impact: { water: +15, morale: -6 }
        }
      ]
    },
    experimentId: 'water_filtration',
    resolutionDialogue: [
      { speaker: 'frisk', text: 'Filter cleared and flushed! Fresh drinking water is filling the main tank.' },
      { speaker: 'asriel', text: 'Water purity looks great on my screen! I hit the 18 km mark. Halfway to the crashed module!' }
    ]
  },

  // ================= SOL 4 =================
  {
    dayNumber: 4,
    title: 'RADIO SIGNAL DRIFT',
    subtitle: 'Sol 4 — 3 Sols until Asriel Returns',
    overview: 'A moon quake shook our roof antenna. We lost radio connection with Asriel!',
    event: {
      title: 'ALERT: RADIO SIGNAL LOST',
      desc: 'Antenna shifted off target! Walk your astronaut to the COMMS TERMINAL at the back to steer the dish back onto Asriel\'s rover.',
      targetStation: 'comms'
    },
    objective: 'Walk to the COMMS TERMINAL to tune the radio antenna frequency.',
    stationKey: 'comms',
    taskType: 'frequency_dial', // Among Us Oscilloscope Frequency Task
    dialogueIntro: [
      { speaker: 'frisk', text: 'Asriel, can you hear me? All I hear is loud radio static!' },
      { speaker: 'control', text: 'A small moon tremor nudged your rooftop dish. Walk to the Comms Terminal and dial back into Asriel\'s wave.' }
    ],
    decision: {
      prompt: 'CHOOSE ANTENNA TRACKING PROFILE',
      options: [
        {
          id: 'd4_opt_highgain',
          title: 'Motorized Lock & Video',
          icon: '📡',
          badge: 'RECOMMENDED',
          summary: 'Motors automatically follow Asriel\'s rover for crystal clear voice and video.',
          gains: [
            { qty: '+10%', label: 'Video Connection & Morale' }
          ],
          losses: [
            { qty: '14%', label: 'Battery Power' }
          ],
          impact: { power: -14, morale: +10 }
        },
        {
          id: 'd4_opt_burst',
          title: 'Short Audio Pings',
          icon: '📻',
          badge: 'SAVES POWER',
          summary: 'Leaves antenna stationary and sends short audio beeps every half hour.',
          gains: [
            { qty: '+10%', label: 'Battery Power Saved' }
          ],
          losses: [
            { qty: '5%', label: 'Audio Static & Delay' }
          ],
          impact: { power: +10, morale: -5 }
        },
        {
          id: 'd4_opt_omni',
          title: 'Wide Radio Broadcast',
          icon: '🌐',
          badge: 'SIMPLE BROADCAST',
          summary: 'Blasts radio signals in all directions without steering, but wastes lots of power.',
          gains: [
            { qty: '100%', label: 'Instant Connect' }
          ],
          losses: [
            { qty: '20%', label: 'Wasted Battery Power' }
          ],
          impact: { power: -20, morale: 0 }
        }
      ]
    },
    experimentId: 'antenna_puzzle',
    resolutionDialogue: [
      { speaker: 'asriel', text: 'Frisk! Loud and clear! I can see the crashed module shining on the crater rim! Loading the gear!' },
      { speaker: 'frisk', text: 'Radio locked tight. Stay safe on the ridge, Asriel.' }
    ]
  },

  // ================= SOL 5 =================
  {
    dayNumber: 5,
    title: 'STUFFY AIR (CO₂ HIGH)',
    subtitle: 'Sol 5 — 2 Sols until Asriel Returns',
    overview: 'Exhaled carbon dioxide is building up in the cabin. The air is getting stuffy and toxic!',
    event: {
      title: 'CRITICAL ALERT: CO₂ RISING IN CABIN',
      desc: 'Air scrubber is clogged! Walk your astronaut to the SCIENCE WORKBENCH in the center to flush out the exhaled carbon dioxide.',
      targetStation: 'bench'
    },
    objective: 'Walk to the SCIENCE WORKBENCH to cycle the air scrubber.',
    stationKey: 'bench',
    taskType: 'simon_says', // Among Us Simon Says Memory Task
    dialogueIntro: [
      { speaker: 'frisk', text: 'The cabin CO2 meter is flashing red! My head is pounding—the air is getting stuffy.' },
      { speaker: 'asriel', text: 'Move to the Science Workbench! Key in the purge code to bake the filters or pop an emergency sponge!' }
    ],
    decision: {
      prompt: 'CHOOSE AIR CLEANING METHOD',
      options: [
        {
          id: 'd5_opt_zeolite',
          title: 'Heated Filter Flush',
          icon: '🍃',
          badge: 'RECOMMENDED',
          summary: 'Heats the scrubber beds to blow trapped carbon dioxide out into space.',
          gains: [
            { qty: '-0.80%', label: 'CO₂ Dropped (Clean Air!)' }
          ],
          losses: [
            { qty: '16%', label: 'Heater Power' }
          ],
          impact: { co2: -80, power: -16 }
        },
        {
          id: 'd5_opt_lioh',
          title: 'Emergency Chemical Sponge',
          icon: '🧪',
          badge: 'INSTANT FIX',
          summary: 'Uses one disposable chemical canister to instantly clean the air without power.',
          gains: [
            { qty: '-0.95%', label: 'CO₂ Dropped Instantly' }
          ],
          losses: [
            { qty: '1', label: 'Emergency Sponge Expended' }
          ],
          impact: { co2: -95, power: 0 }
        },
        {
          id: 'd5_opt_low_vent',
          title: 'Slow Fan Speed',
          icon: '💨',
          badge: 'SAVES POWER',
          summary: 'Runs scrubber fans at low speed to save battery, but air stays slightly stuffy.',
          gains: [
            { qty: '+12%', label: 'Battery Power Saved' }
          ],
          losses: [
            { qty: '8%', label: 'Headache & Stuffy Air' }
          ],
          impact: { co2: -35, power: -4, morale: -8 }
        }
      ]
    },
    experimentId: 'co2_scrubber',
    resolutionDialogue: [
      { speaker: 'frisk', text: 'Filter beds flushed clean. Head feels clear again—air is fresh.' },
      { speaker: 'asriel', text: 'Cart is hitched to the rover! I have retrieved the water ice drill and extra solar panels! Heading home!' }
    ]
  },

  // ================= SOL 6 =================
  {
    dayNumber: 6,
    title: 'THE CRATER FREEZE',
    subtitle: 'Sol 6 — 1 Sol until Asriel Returns',
    overview: 'The crater wall blocked the sun completely! Solar power dropped to zero!',
    event: {
      title: 'CRITICAL EMERGENCY: SUNLIGHT GONE',
      desc: 'Sun is blocked! Batteries down to 18%! Walk your astronaut to the POWER GRID to start the Emergency Fuel Cell.',
      targetStation: 'power'
    },
    objective: 'Walk to the POWER GRID to wire up the Emergency Fuel Cell.',
    stationKey: 'power',
    taskType: 'wires', // Among Us Wires for Emergency Fuel Cell
    dialogueIntro: [
      { speaker: 'frisk', text: 'Total solar blackout! The crater rim is blocking the sun. Batteries are at critical 18%!' },
      { speaker: 'control', text: 'Start your emergency fuel cell now! Combine your stored hydrogen and oxygen to produce power and water!' }
    ],
    decision: {
      prompt: 'IGNITE EMERGENCY FUEL CELL',
      options: [
        {
          id: 'd6_opt_fuelcell',
          title: 'Start Fuel Cell Reaction',
          icon: '⚡',
          badge: 'RECOMMENDED',
          summary: 'Burns stored gases together to make massive electricity and fresh pure water.',
          gains: [
            { qty: '+40%', label: 'Emergency Power' },
            { qty: '+22%', label: 'Fresh Pure Water' }
          ],
          losses: [
            { qty: '14%', label: 'Oxygen Reserve' }
          ],
          impact: { power: +40, water: +22, oxygen: -14 }
        },
        {
          id: 'd6_opt_hibernation',
          title: 'Freeze Sleep in Spacesuits',
          icon: '❄️',
          badge: 'SAVES GASES',
          summary: 'Turns off all lights and heaters to save gas, enduring freezing cold.',
          gains: [
            { qty: '100%', label: 'Stored Gases Preserved' }
          ],
          losses: [
            { qty: '25%', label: 'Severe Shivering Cold' }
          ],
          impact: { morale: -25, power: +10 }
        },
        {
          id: 'd6_opt_discharge',
          title: 'Drain Batteries to 2%',
          icon: '🔋',
          badge: 'BYPASS LIMITS',
          summary: 'Bypasses safety locks to drain batteries completely empty, risking permanent damage.',
          gains: [
            { qty: '+20%', label: 'Temporary Power' }
          ],
          losses: [
            { qty: '20%', label: 'Permanent Battery Health' }
          ],
          impact: { power: +20, morale: -5 }
        }
      ]
    },
    experimentId: 'fuel_cell',
    resolutionDialogue: [
      { speaker: 'frisk', text: 'Fuel cell ignited! Lights are bright, heat is flowing, and fresh water is condensing!' },
      { speaker: 'asriel', text: 'Hold on Frisk! I see your outpost beacon flashing over the hill! Rover ETA: 6 hours!' }
    ]
  },

  // ================= SOL 7 =================
  {
    dayNumber: 7,
    title: 'THE RESCUE & THE GREAT CHOICE',
    subtitle: 'Sol 7 — Asriel Has Returned!',
    overview: 'Asriel arrived at the airlock with the supply cart! Solars fixed. Humanity\'s lunar choice awaits.',
    event: {
      title: 'MISSION EVENT: ROVER AT THE AIRLOCK',
      desc: 'Asriel is outside the front door! Walk your astronaut to the CUPOLA AIRLOCK at the front to dock the cart.',
      targetStation: 'airlock'
    },
    objective: 'Walk to the CUPOLA AIRLOCK at the front to decide our mission fate.',
    stationKey: 'airlock',
    taskType: null, // Final choice directly
    dialogueIntro: [
      { speaker: 'asriel', text: 'Frisk! I made it! The rover cart, replacement solar cells, and the deep ice drill are safe!' },
      { speaker: 'frisk', text: 'Airlock opened! Power is back to 100%! Now we must choose what comes next for humanity.' }
    ],
    decision: {
      prompt: 'DECIDE HUMANITY\'S MOON MISSION DESTINY',
      options: [
        {
          id: 'ending_a',
          title: 'Fly Back to Earth (Safety First)',
          icon: '🚀',
          badge: 'SAFE JOURNEY HOME',
          summary: 'You survived 7 impossible days alone. Fire the rocket engine and return home as heroes.',
          gains: [
            { qty: '100%', label: 'Crew Survival & Hero\'s Welcome on Earth' }
          ],
          losses: [
            { qty: '1', label: 'Moon Water Proof Left Unfinished' }
          ],
          impact: { morale: +50 }
        },
        {
          id: 'ending_b',
          title: 'Test the Moon Ice (True Scientists!)',
          icon: '🔬',
          badge: 'HISTORIC DISCOVERY',
          summary: 'Unpack the drill, analyze the dark crater ice, and prove water exists on the Moon!',
          gains: [
            { qty: '100%', label: 'Confirm Moon Water & Enable Future Lunar Cities!' }
          ],
          losses: [
            { qty: '14 Sols', label: 'Longer Stay Living off Recycled Supplies' }
          ],
          impact: { morale: +100 }
        }
      ]
    },
    experimentId: null,
    resolutionDialogue: []
  }
];

// Epilogue Details for Endings A & B
const ENDING_A_DATA = {
  title: 'MISSION SUCCESS: RETURN TO EARTH',
  badge: 'ENDING A: THE HEROES RETURN',
  dialogue: [
    { speaker: 'asriel', text: 'Rocket engines primed! Countdown in 3... 2... 1... Liftoff from the Moon!' },
    { speaker: 'control', text: 'Ares Lander, you survived 7 days alone on the Moon through impossible odds. Welcome home, heroes!' }
  ],
  epilogue: 'Commander Frisk and Asriel safely splashed down in the Pacific Ocean. Your resourcefulness kept the ship running through every emergency, proving human bravery and problem-solving can conquer space!'
};

const ENDING_B_DATA = {
  title: 'HISTORIC DISCOVERY: MOON WATER PROVEN!',
  badge: 'ENDING B: TRUE SCIENTIFIC PIONEERS',
  dialogue: [
    { speaker: 'frisk', text: 'Sensor beam fired into the polar crater ice core! Reading unmistakable water peaks!' },
    { speaker: 'asriel', text: 'WATER ICE DETECTED! Over 5% water ice trapped inside the lunar dirt! We found it, Frisk!' },
    { speaker: 'control', text: 'Houston is cheering! You confirmed drinkable water and rocket fuel on the Moon. Humanity is here to stay!' }
  ],
  epilogue: 'By choosing scientific discovery, Frisk and Asriel unlocked humanity\'s future across the solar system. With water ice confirmed at the lunar South Pole, future astronauts will produce drinking water, breathable air, and rocket fuel right on the Moon!'
};

// 10 NASA Research Topics (Clean, Simple, Easy to Understand)
const NASA_TOPICS = [
  {
    id: 'electrolysis',
    title: 'Splitting Water into Breathable Air',
    category: 'Life Support',
    desc: 'Electricity from solar panels passes through water (H₂O) to split it into Oxygen (O₂) for breathing and Hydrogen (H₂) for fuel cells.'
  },
  {
    id: 'water_filtration',
    title: 'Recycling Every Drop of Water',
    category: 'Water Recycling',
    desc: 'On the Moon, water is gold. Ceramic filters, active charcoal, and pressure pumps purify sweat, condensation, and wastewater back into 100% clean drinking water.'
  },
  {
    id: 'co2_scrubber',
    title: 'Removing Carbon Dioxide from Cabin Air',
    category: 'Air Scrubber',
    desc: 'Astronauts exhale carbon dioxide. Thermal mineral filters trap CO₂ and bake it out into space so the cabin air stays crisp and healthy.'
  },
  {
    id: 'power_management',
    title: 'Solar Panels & Lunar Shadows',
    category: 'Electricity',
    desc: 'At the Moon\'s South Pole, mountains cast long, cold shadows. Solar arrays must be positioned on high ridge peaks to catch continuous sunlight.'
  },
  {
    id: 'antenna_puzzle',
    title: 'Steering Radio Waves Across Space',
    category: 'Comms',
    desc: 'Direct dish antennas steer high-frequency radio waves directly at rovers and satellites to transmit voice, video, and survival telemetry.'
  },
  {
    id: 'fuel_cell',
    title: 'Hydrogen Fuel Cells: Power + Fresh Water',
    category: 'Power & Fuel',
    desc: 'When sunlight disappears, combining stored hydrogen and oxygen together generates electricity and produces pure, warm drinking water as a bonus!'
  },
  {
    id: 'lunar_water_lab',
    title: 'Detecting Trapped Ice in Moon Dust',
    category: 'Moon Science',
    desc: 'Infrared light shines onto deep crater dirt. Water molecules absorb specific wavelengths of light, proving water ice is present without melting it.'
  },
  {
    id: 'spacesuit_systems',
    title: 'Spacesuits: Personal Mini-Spaceships',
    category: 'Crew Safety',
    desc: 'Spacesuits maintain pure oxygen pressure, protect against 120°C heat and -130°C cold, and shield astronauts from cosmic radiation.'
  },
  {
    id: 'crater_geology',
    title: 'Permanently Shadowed Craters',
    category: 'Lunar Geography',
    desc: 'Because the Moon has no tilt, deep crater bottoms have never seen sunlight for billions of years, keeping ancient water ice frozen like a cosmic freezer.'
  },
  {
    id: 'moon_base_future',
    title: 'Building Permanent Moon Outposts',
    category: 'Future Exploration',
    desc: 'With local water ice for drinking and rocket fuel, humans can build permanent research bases on the Moon as the launchpad for Mars!'
  }
];

// Alias for research database
const RESEARCH_DATABASE = NASA_TOPICS;
