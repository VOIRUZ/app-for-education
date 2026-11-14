/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Narrative Database & Interactive Story Script
 * ============================================================================
 * Inspired by choice-driven narrative adventures (The Henry Stickmin Collection),
 * with an atmospheric, grounded, and emotionally resonant story.
 * ============================================================================
 */

const NARRATIVE_DATA = {
  // Crew Profiles
  characters: {
    alex: {
      name: "Commander Alex Cole",
      shortName: "Alex",
      role: "Mission Commander",
      color: "#f59e0b",
      bio: "Pragmatic, steady, and deeply protective of the crew. Keeps a handwritten journal each night.",
      portraits: {
        neutral: "alex_neutral",
        determined: "alex_determined",
        worried: "alex_worried",
        smiling: "alex_smiling",
        tired: "alex_tired"
      }
    },
    maya: {
      name: "Dr. Maya Lin",
      shortName: "Maya",
      role: "Chief Engineer (ECLSS)",
      color: "#38bdf8",
      bio: "Brilliant, blunt, and hyper-focused. Manages her anxiety by fixing things. Has a 7-year-old daughter in Vancouver.",
      portraits: {
        neutral: "maya_neutral",
        focused: "maya_focused",
        stressed: "maya_stressed",
        smiling: "maya_smiling",
        alarmed: "maya_alarmed"
      }
    },
    sully: {
      name: "Sam 'Sully' Sullivan",
      shortName: "Sully",
      role: "Astrobotanist & Systems",
      color: "#22c55e",
      bio: "Optimistic, witty, and deeply attached to his greenhouse seedlings. Talks to his potato vines when stressed.",
      portraits: {
        neutral: "sully_neutral",
        grinning: "sully_grinning",
        worried: "sully_worried",
        excited: "sully_excited",
        tired: "sully_tired"
      }
    },
    tariq: {
      name: "Dr. Tariq Al-Mansoor",
      shortName: "Tariq",
      role: "Flight Surgeon & Physicist",
      color: "#a855f7",
      bio: "Calm, philosophical, and observant. Brews dried mint tea from the greenhouse and watches over everyone's mental health.",
      portraits: {
        neutral: "tariq_neutral",
        gentle: "tariq_gentle",
        concerned: "tariq_concerned",
        relieved: "tariq_relieved"
      }
    },
    houston: {
      name: "Flight Director Vance (Houston)",
      shortName: "Houston",
      role: "Mission Control",
      color: "#94a3b8",
      bio: "Speaking through a 14-minute audio delay across 225 million kilometres of deep space.",
      portraits: {
        neutral: "houston_neutral"
      }
    }
  },

  // Rooms inside Outpost Chryse
  rooms: {
    common: {
      id: "common",
      name: "Common Room & Mess",
      icon: "☕",
      desc: "The emotional heart of the outpost. A scarred dining table, magnetic chessboard, and photo wall.",
      ambience: "hum",
      charactersPresent: ["maya", "sully", "tariq"],
      hotspots: [
        {
          id: "photo_wall",
          label: "Polaroid Photo Board",
          icon: "🖼️",
          x: 28, y: 38,
          text: "Snapshots pinned to cork: Maya lifting her daughter on her shoulders at Stanley Park. Sully's golden retriever wearing cardboard astronaut ears. Tariq's university astronomy society under the desert night sky in Oman."
        },
        {
          id: "coffee_pot",
          label: "Ration Coffee Thermos",
          icon: "☕",
          x: 62, y: 64,
          text: "Recycled water brewed with chicory and ground coffee pouches. Smells faintly like burnt toast, but Tariq calls it 'liquid perseverance'."
        },
        {
          id: "chess_board",
          label: "Magnetic Chessboard",
          icon: "♟️",
          x: 48, y: 72,
          text: "An unfinished match between Maya and Tariq. Maya plays aggressively with knights; Tariq's pawns are stubbornly dug in."
        }
      ]
    },
    life_support: {
      id: "life_support",
      name: "ECLSS & MOXIE Bay",
      icon: "🔧",
      desc: "The lungs and kidneys of the habitat. Thick insulated lines thrumming with heated gas and purified water.",
      ambience: "machinery",
      charactersPresent: ["maya"],
      hotspots: [
        {
          id: "moxie_core",
          label: "MOXIE Electrolysis Core",
          icon: "💨",
          x: 35, y: 45,
          text: "The Solid Oxide Electrolysis reactor. Takes Mars' 95% CO₂ atmosphere, heats it to 800°C, and tears away oxygen atoms for the crew to breathe.",
          science: "NASA Perseverance demonstrated MOXIE on Mars, proving that future human crews can generate breathing oxygen directly from the Martian atmosphere!"
        },
        {
          id: "water_distiller",
          label: "Vapor Compression Distiller",
          icon: "💧",
          x: 72, y: 52,
          text: "The Urine Processor & Condensate loop. Recycles over 95% of moisture from crew breath, hygiene, and sweat into pure drinking water.",
          science: "The International Space Station's ECLSS system recycles over 98% of all water. Astronauts jokingly say: 'Yesterday's coffee becomes tomorrow's coffee.'"
        },
        {
          id: "tool_chest",
          label: "Magnetic Tool Rack",
          icon: "🧰",
          x: 18, y: 58,
          text: "Torque wrenches, sealant tape, multi-meters, and spare copper O-rings. Every bolt in this outpost has been turned by Maya at least three times."
        }
      ]
    },
    greenhouse: {
      id: "greenhouse",
      name: "Hydroponics Greenhouse",
      icon: "🌱",
      desc: "Warm purple LED grow lights wash over vibrant green shelves of dwarf potatoes, radishes, and leafy greens.",
      ambience: "trickle",
      charactersPresent: ["sully"],
      hotspots: [
        {
          id: "potato_rack",
          label: "Potato Grow Trays",
          icon: "🥔",
          x: 40, y: 55,
          text: "Deep green leaves sprouting from aeroponic mist chambers. Sully has labeled one tuber 'Sir Spud-a-Lot'.",
          science: "Aeroponic farming sprays plant roots with nutrient mist, using 95% less water than soil agriculture and accelerating growth in reduced gravity."
        },
        {
          id: "grow_lights",
          label: "LED Spectrum Grid",
          icon: "💡",
          x: 50, y: 22,
          text: "Tuned blue and red LED panels mimicking the photosynthetically active radiation plants need to thrive indoors."
        },
        {
          id: "mint_pot",
          label: "Tariq's Mint Cutting",
          icon: "🌿",
          x: 78, y: 62,
          text: "A small terracotta pot with fragrant peppermint. Sully harvests three leaves each evening for Tariq's sleep tea."
        }
      ]
    },
    bunks: {
      id: "bunks",
      name: "Crew Sleeping Quarters",
      icon: "🛏️",
      desc: "Four narrow sleeping berths lined with acoustic fabric and personal mementos. Quiet and peaceful.",
      ambience: "quiet",
      charactersPresent: ["tariq"],
      hotspots: [
        {
          id: "alex_bunk",
          label: "Alex's Desk & Journal",
          icon: "📓",
          x: 25, y: 60,
          text: "A worn leather notebook filled with mission checklists, daily resource math, and unsent letters home."
        },
        {
          id: "maya_bunk",
          label: "Maya's Bunk",
          icon: "🧸",
          x: 52, y: 55,
          text: "A hand-knitted woolen bunny tucked near the pillow, sent by her daughter Chloe before launch."
        },
        {
          id: "bookshelf",
          label: "Paperback Shelf",
          icon: "📚",
          x: 82, y: 40,
          text: "Dog-eared books shared between the crew: sci-fi paperbacks, poetry collections, and a dense handbook on orbital mechanics."
        }
      ]
    },
    comms: {
      id: "comms",
      name: "Observation & Comm Station",
      icon: "📡",
      desc: "Curved panoramic viewport showing the rusty dunes of Mars. Radio transmitters crackle with solar static.",
      ambience: "radio",
      charactersPresent: [],
      hotspots: [
        {
          id: "mars_window",
          label: "Panoramic Viewport",
          icon: "🌄",
          x: 50, y: 38,
          text: "The Chryse Planitia desert stretches to the curved horizon. Iron-red sand dunes shifting under faint dust devils beneath an ochre sky."
        },
        {
          id: "radio_console",
          label: "Deep Space Transceiver",
          icon: "📻",
          x: 22, y: 65,
          text: "High-gain S-band terminal locked to NASA's Deep Space Network. Audio signals take 14 minutes each way."
        },
        {
          id: "beacon_switch",
          label: "Approach Guidance Beacon",
          icon: "🚨",
          x: 78, y: 68,
          text: "Laser guidance transponder that will guide resupply vessel 'Valkyrie-1' through atmospheric entry on Sol 7."
        }
      ]
    },
    airlock: {
      id: "airlock",
      name: "Airlock & Solar Yard",
      icon: "🌌",
      desc: "Pressurized transition chamber. White EMU EVA space suits hang on racks; thick reinforced glass looks out toward the solar farm.",
      ambience: "wind",
      charactersPresent: [],
      hotspots: [
        {
          id: "eva_suits",
          label: "Planetary EVA Suits",
          icon: "🧑‍🚀",
          x: 30, y: 50,
          text: "White composite suits with gold-plated sun visors and backpack life-support scrubbers. Smells faintly of ozone and Martian regolith."
        },
        {
          id: "solar_view",
          label: "Solar Array Farm (Outside)",
          icon: "⚡",
          x: 75, y: 45,
          text: "Four massive dual-axis solar wings tracking the small Martian sun across the sky. Fine rust dust coats their edges.",
          science: "Mars receives only about 43% of the sunlight Earth does. Solar arrays must be kept clean of electrostatic dust to keep habitats powered."
        }
      ]
    }
  },

  // 7 Sols Narrative Progression
  sols: [
    // ------------------------------------------------------------------------
    // SOL 1
    // ------------------------------------------------------------------------
    {
      sol: 1,
      chapterTitle: "Sol 1: The Seven-Day Notice",
      situationSummary: "Scheduled supply freighter 'Valkyrie-1' suffered a second-stage thruster burn abort. Delay confirmed: exactly 7 Martian Sols. Outpost stores must be conserved.",
      introDialogues: [
        {
          speaker: "houston",
          portrait: "neutral",
          text: "Chryse Base, this is Houston. We have confirmation from Flight Dynamics... Valkyrie-1 experienced a gimbal lockout during the trans-Mars injection burn. The vessel is safe, but their arrival vector is pushed back by seven days."
        },
        {
          speaker: "maya",
          portrait: "focused",
          text: "Seven Sols? Our fresh rations were timed to run out tomorrow morning. And the second water recycling cartridge is already past its rated service life."
        },
        {
          speaker: "sully",
          portrait: "grinning",
          text: "Hey, look on the bright side. That means seven more days of my stellar company before we have to unpack crates!"
        },
        {
          speaker: "tariq",
          portrait: "gentle",
          text: "A week is manageable, friends. But only if we treat our reserves with respect from this very hour. Alex, the crew is waiting on your call."
        },
        {
          speaker: "alex",
          portrait: "determined",
          text: "We have air in our tanks, food on the shelves, and each other. We survive seven Sols. Let's get to work."
        }
      ],
      // Phase 5 Henry Stickmin Style Choice
      emergency: {
        title: "Dilemma: The First Ration Order",
        desc: "Maya pulls up the power and food logs on her tablet. 'Alex, we need to set our operating stance right now. How do we budget our power and meals?'",
        choices: [
          {
            id: "strict",
            title: "Strict Lockdown",
            tagline: "Cut auxiliary heat & cut meals to half.",
            icon: "🔒",
            preview: "Safe margins, but Sully's stomach will grumble loudly.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "smiling", text: "Mathematically sound. It builds a comfortable buffer for our battery bank." },
                { speaker: "sully", portrait: "worried", text: "My stomach just let out a sound like a dying rover compressor. But aye-aye, Cap." }
              ],
              resourceDeltas: { power: +15, food: -6, morale: -8 },
              log: "Rationing locked to strict protocol. Reserves protected, but crew morale dipped."
            }
          },
          {
            id: "balanced",
            title: "Balanced Routine",
            tagline: "Maintain normal meals & moderate power.",
            icon: "⚖️",
            preview: "Steady sustainable pace. Keeps everyone focused.",
            consequence: {
              dialogue: [
                { speaker: "tariq", portrait: "gentle", text: "A wise middle ground, Alex. Panic rationing before we even assess our systems would only breed anxiety." },
                { speaker: "maya", portrait: "neutral", text: "I'll keep a sharp eye on the battery draw during night cycles." }
              ],
              resourceDeltas: { power: -5, food: -12, morale: +5 },
              log: "Standard routine preserved. The crew feels trusted and grounded."
            }
          },
          {
            id: "feast",
            title: "Sully's Welcome Stew",
            tagline: "Cook a warm comforting dinner together.",
            icon: "🍲",
            preview: "Burns extra food, but crew bonding reaches 100%.",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "excited", text: "Now you're talking! Dried beef, dehydrated onions, and fresh hydroponic basil! Dinner is served!" },
                { speaker: "alex", portrait: "smiling", text: "Smells like home. We tackle tomorrow with full hearts." },
                { speaker: "maya", portrait: "smiling", text: "I will admit... this beats sucking meal gel from a foil tube." }
              ],
              resourceDeltas: { power: -8, food: -18, morale: +20, health: +5 },
              log: "The crew shared hot stew around the mess table, laughing together. Morale is soaring!"
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 2
    // ------------------------------------------------------------------------
    {
      sol: 2,
      chapterTitle: "Sol 2: The Humming Pipes",
      situationSummary: "Adjusting to the new tempo. A strange metallic vibration develops in the water recycling centrifuge.",
      introDialogues: [
        {
          speaker: "maya",
          portrait: "stressed",
          text: "Listen to that. Hear that high-pitched rattle coming from the utility conduit behind the mess hall? That's not the normal hum."
        },
        {
          speaker: "sully",
          portrait: "neutral",
          text: "I thought that was just my stomach again. Wait... no, that definitely sounds like a bolt loose in a turbine."
        },
        {
          speaker: "tariq",
          portrait: "concerned",
          text: "If the vacuum distillation loop jams, our recycled water output drops to zero by sunset."
        },
        {
          speaker: "alex",
          portrait: "determined",
          text: "Nobody panic. Let's diagnose it before we start tearing panels off the walls."
        }
      ],
      emergency: {
        title: "Emergency: Rattle in the Water Recycler",
        desc: "The ECLSS distillation centrifuge is vibrating against its mountings. Water pressure is starting to oscillate erratically!",
        choices: [
          {
            id: "strip_down",
            title: "Maya's Full Teardown",
            tagline: "Disassemble the pump casing to inspect the rotor.",
            icon: "🔧",
            preview: "Takes 3 hours of meticulous engineering work.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "smiling", text: "Aha! A calcium carbonate crystal had wedged right against the ceramic impeller blade. Cleared it! Running smooth as silk." },
                { speaker: "tariq", portrait: "gentle", text: "Brilliant hands as always, Maya." }
              ],
              resourceDeltas: { water: +8, power: -5, morale: +10 },
              log: "Maya disassembled the pump and removed a mineral obstruction. Water recycling efficiency fully restored!"
            }
          },
          {
            id: "percussive",
            title: "Percussive Maintenance",
            tagline: "Give the pipe casing a firm, calculated tap.",
            icon: "🔨",
            preview: "The classic space engineer gamble! Fast and funny.",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "grinning", text: "*CLANG!* ...Look at that! The rattle stopped! The needle settled right in the green!" },
                { speaker: "maya", portrait: "alarmed", text: "You did NOT just fix a four-million-dollar NASA ECLSS unit by whacking it with an adjustable wrench?!" },
                { speaker: "sully", portrait: "excited", text: "Technically, Commander, I applied 'targeted mechanical vibration'." }
              ],
              resourceDeltas: { water: +2, morale: +15 },
              log: "Sully tapped the casing with a wrench. The mineral flake dislodged instantly. Everyone had a good laugh!"
            }
          },
          {
            id: "bypass",
            title: "Software Pressure Bypass",
            tagline: "Throttle flow by 25% to prevent cavitation.",
            icon: "💻",
            preview: "Zero physical risk, but slightly lowers water recovery rate.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "focused", text: "Bypass active. The vibration stopped, but our daily recycling yield will be 15% lower until we do a proper overhaul." },
                { speaker: "alex", portrait: "neutral", text: "Acceptable trade-off for now. Good work keeping the system intact." }
              ],
              resourceDeltas: { water: -6, power: +5, morale: 0 },
              log: "Rerouted water flow via software bypass. Vibration ceased with minor recovery loss."
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 3
    // ------------------------------------------------------------------------
    {
      sol: 3,
      chapterTitle: "Sol 3: The Crimson Wall",
      situationSummary: "A massive synoptic dust storm blankets Chryse Planitia. Sunlight dims to twilight; temperatures drop sharply.",
      introDialogues: [
        {
          speaker: "alex",
          portrait: "worried",
          text: "Look out the observation viewport. The western horizon... it's gone. It's just a wall of orange dust stretching to the clouds."
        },
        {
          speaker: "maya",
          portrait: "alarmed",
          text: "Atmospheric optical depth just jumped from Tau 0.3 to 1.85. Our solar array output is cratering by sixty percent."
        },
        {
          speaker: "tariq",
          portrait: "concerned",
          text: "And the exterior temperature sensor is dropping past -78°C. If our battery dies while heating the habitat tonight, the airlock seals could become brittle and freeze."
        },
        {
          speaker: "sully",
          portrait: "worried",
          text: "The greenhouse grow lights are already flickering... My poor baby tomatoes are shivering."
        }
      ],
      emergency: {
        title: "Storm Crisis: The Freezing Grid",
        desc: "Howling winds are buffeting the habitat domes. Dust is coating the photovoltaic panels and solar charging has nearly ceased!",
        choices: [
          {
            id: "eva_lock",
            title: "Brave Storm EVA",
            tagline: "Alex & Maya head outside to lock panel tilts.",
            icon: "🌪️",
            preview: "Tense spacewalk in howling winds to secure the arrays.",
            consequence: {
              dialogue: [
                { speaker: "alex", portrait: "tired", text: "Can barely see five meters through the visor... but the storm latches are locked. Array Bank B is protected from wind shear!" },
                { speaker: "maya", portrait: "smiling", text: "We made it back inside in one piece. Hand me a towel, my helmet is covered in red talcum powder." }
              ],
              resourceDeltas: { power: +20, oxygen: -5, health: -5, morale: +12 },
              log: "Alex and Maya executed a perilous storm EVA. Solar panel mechanisms secured against the gale!"
            }
          },
          {
            id: "mothball_aero",
            title: "Mothball Greenhouse",
            tagline: "Dim grow lights to direct all watts to habitat heat.",
            icon: "🌱",
            preview: "Saves critical kilowatts, but hurts crop harvest.",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "tired", text: "I tucked thermal insulating foil over the seedling trays... We'll lose a few leaves, but the crew stays warm tonight." },
                { speaker: "tariq", portrait: "gentle", text: "Thank you for the sacrifice, Sully. You put the family first." }
              ],
              resourceDeltas: { power: +25, food: -8, morale: -5 },
              log: "Power routed from greenhouse to habitat life support. Warmth secured at the cost of fresh produce."
            }
          },
          {
            id: "movie_night",
            title: "Emergency Huddle & Stories",
            tagline: "Gather in the mess hall under blankets on low power.",
            icon: "🎦",
            preview: "Drains some battery, but creates an unforgettable crew bond.",
            consequence: {
              dialogue: [
                { speaker: "tariq", portrait: "gentle", text: "Hot peppermint tea for everyone. Sit close, wrap the wool blankets around your shoulders." },
                { speaker: "maya", portrait: "smiling", text: "Tariq, tell us that story again about your first telescope in the desert dunes." },
                { speaker: "sully", portrait: "grinning", text: "Outside it sounds like freight trains, but in here... it feels like home." }
              ],
              resourceDeltas: { power: -18, food: -6, morale: +25, health: +10 },
              log: "The crew huddled together in the warm mess hall, sharing childhood memories through the howling storm. Unbreakable morale!"
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 4
    // ------------------------------------------------------------------------
    {
      sol: 4,
      chapterTitle: "Sol 4: Letters from Earth",
      situationSummary: "Halfway through the ordeal. A deep-space packet arrives containing personal audio messages from family back on Earth.",
      introDialogues: [
        {
          speaker: "houston",
          portrait: "neutral",
          text: "Chryse Base, we've bundled a wideband data burst on the Deep Space Network. Personal audio letters from your families are queued on your terminal."
        },
        {
          speaker: "maya",
          portrait: "focused",
          text: "Chloe sent a voice note... But playing audio and decompressing the video files will keep our S-band receiver cooking power for two hours."
        },
        {
          speaker: "sully",
          portrait: "worried",
          text: "I haven't heard my brother's voice in five months. Even my dog apparently barked into the microphone."
        },
        {
          speaker: "tariq",
          portrait: "gentle",
          text: "The psychological sustenance of hearing home is just as vital as calories or oxygen, Alex. What should we do?"
        }
      ],
      emergency: {
        title: "Decision: The Data Burst from Home",
        desc: "The receiver is holding 1.2 gigabytes of personal family messages. How do we allocate our transmission power?",
        choices: [
          {
            id: "full_audio",
            title: "Full Audio Playback",
            tagline: "Power the audio amplifiers so everyone hears their letters.",
            icon: "🎧",
            preview: "Uses 12 kWh of power, but restores spirit and tears of joy.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "smiling", text: "Chloe sang her whole school alphabet song for me... and told me to bring her back a red Martian rock. I'm going to hold that rock in my hands." },
                { speaker: "sully", portrait: "grinning", text: "Buster really did bark! Twice! He recognized my flight suit on the webcam!" },
                { speaker: "alex", portrait: "smiling", text: "Best twelve kilowatt-hours we've ever spent." }
              ],
              resourceDeltas: { power: -12, morale: +30, health: +8 },
              log: "The crew listened to messages from home together in tears and laughter. Morale reached maximum!"
            }
          },
          {
            id: "text_only",
            title: "Transcribe to Text",
            tagline: "Run lightweight text transcription to save electricity.",
            icon: "📄",
            preview: "Saves all battery power, but lacks emotional warmth.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "neutral", text: "Text reads cleanly on the tablet. It's safe on our battery reserve." },
                { speaker: "sully", portrait: "tired", text: "It's good to read... but I sure would've loved to hear that silly dog bark." }
              ],
              resourceDeltas: { power: -2, morale: +5 },
              log: "Family letters read as text printouts. Practical power conservation."
            }
          },
          {
            id: "group_reply",
            title: "Record Defiant Reply First",
            tagline: "Transmit a united video message back to Mission Control.",
            icon: "📹",
            preview: "'Tell Earth Base Chryse is standing tall.'",
            consequence: {
              dialogue: [
                { speaker: "alex", portrait: "determined", text: "Houston, we hear you loud and clear. Tell our families we are healthy, we are working together, and we will be standing on the landing pad waiting for Valkyrie." },
                { speaker: "houston", portrait: "neutral", text: "...Copy that, Chryse. The entire control room in Houston just stood up and clapped. Hang in there." }
              ],
              resourceDeltas: { power: -8, morale: +20 },
              log: "Sent an inspiring crew video message back to Earth. Mission Control and families celebrated!"
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 5
    // ------------------------------------------------------------------------
    {
      sol: 5,
      chapterTitle: "Sol 5: The Freezing Point",
      situationSummary: "Day 5 brings the coldest Martian night of the season (-88°C). A coolant valve freezes inside the primary ECLSS line.",
      introDialogues: [
        {
          speaker: "maya",
          portrait: "alarmed",
          text: "We have an ice plug! External temperature hit minus eighty-eight. The water condensate loop isn't circulating — pressure is climbing against the bulkhead!"
        },
        {
          speaker: "tariq",
          portrait: "concerned",
          text: "If that copper pipe bursts, our remaining greywater will flash-boil into the vacuum trench. We would lose forty liters in seconds."
        },
        {
          speaker: "sully",
          portrait: "worried",
          text: "My hands are numb just standing near the access crawlway. What's the plan, Alex?"
        }
      ],
      emergency: {
        title: "Crisis: The Ice Plug in the Pipe",
        desc: "A solid plug of frozen water is blocking the life-support recycling loop. The pressure gauge is creeping dangerously into the red zone!",
        choices: [
          {
            id: "blanket_wrap",
            title: "Mylar Blanket Wrap",
            tagline: "Strip insulating foil from crew bunks to wrap the pipe.",
            icon: "🛏️",
            preview: "Sacrifice bed comfort to save the water loop.",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "grinning", text: "Wrapped it three layers thick and taped it with duct tape. Look at that — the heat of the room is thawing it out!" },
                { speaker: "maya", portrait: "smiling", text: "Pressure dropping back to nominal. Tonight we sleep in our flight jackets, but our water is safe." }
              ],
              resourceDeltas: { water: +12, morale: -4, health: 0 },
              log: "Insulated the frozen pipe with bed blankets. Ice plug thawed safely without burst!"
            }
          },
          {
            id: "glycol_flush",
            title: "Tariq's Chemical Flush",
            tagline: "Inject medical-grade saline/glycol solution to melt ice.",
            icon: "🧪",
            preview: "Fast chemical reaction, but draws from medical supplies.",
            consequence: {
              dialogue: [
                { speaker: "tariq", portrait: "gentle", text: "Depolymerizing agent injected. The ice crystal lattice dissolved in twenty seconds." },
                { speaker: "maya", portrait: "focused", text: "Clean flow restored! Dr. Tariq, your biochemistry saves the day again." }
              ],
              resourceDeltas: { water: +10, health: -5, morale: +8 },
              log: "Dr. Tariq injected a safe chemical thaw agent into the manifold. Flow restored instantly."
            }
          },
          {
            id: "moxie_heat",
            title: "Reroute MOXIE Thermal Vent",
            tagline: "Vent 800°C exhaust gas from the oxygen furnace.",
            icon: "🔥",
            preview: "Hot industrial engineering gambit. Consumes power.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "focused", text: "Opening exhaust bypass damper 4... WHOOSH. That blast of hot gas warmed the whole crawlspace!" },
                { speaker: "alex", portrait: "smiling", text: "Ice gone. And the corridor feels like a Finnish sauna for once." }
              ],
              resourceDeltas: { power: -10, oxygen: -2, water: +15, morale: +10 },
              log: "Rerouted MOXIE furnace exhaust gas to thaw the crawlway. Rapid, effective fix!"
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 6
    // ------------------------------------------------------------------------
    {
      sol: 6,
      chapterTitle: "Sol 6: The Long Night",
      situationSummary: "Only 24 hours until Valkyrie-1 reaches Mars. A sudden micrometeorite shower tests the outpost's hull.",
      introDialogues: [
        {
          speaker: "sully",
          portrait: "grinning",
          text: "Tomorrow! Exactly twenty-four hours and we'll see retro-thrusters in the sky! I can practically taste fresh apples!"
        },
        {
          speaker: "tariq",
          portrait: "gentle",
          text: "One more night, friends. Let us stay vigilant. The final stretch is always where fatigue plays tricks."
        },
        {
          speaker: "maya",
          portrait: "alarmed",
          text: "*CLANG-CRACK!* ...WHAT WAS THAT?! Did something just punch through the outer airlock shell?!"
        },
        {
          speaker: "alex",
          portrait: "worried",
          text: "Pressure drop sensor in Hab Module C! It's a micrometeorite puncture! Everyone to your stations!"
        }
      ],
      emergency: {
        title: "Disaster: Micrometeorite Puncture in Greenhouse",
        desc: "A pebble-sized space rock penetrated the outer dome of the Greenhouse! A loud hiss echoes as cabin air escapes into the Martian vacuum!",
        choices: [
          {
            id: "sully_rush",
            title: "Sully's Heroic Seal",
            tagline: "Sully sprints in with a high-pressure patch kit.",
            icon: "🏃‍♂️",
            preview: "Risky and frantic, but saves 100% of the greenhouse plants!",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "excited", text: "SLAPPED THE COMPOSITE SEAL RIGHT OVER THE HOLE! *Hiss stops.* ...Whew. My hair was literally blowing toward the ceiling!" },
                { speaker: "alex", portrait: "smiling", text: "Outstanding reflex, Sully! You just saved our entire biological bay." },
                { speaker: "sully", portrait: "grinning", text: "Nobody messes with my potato plants. Not even orbital space gravel." }
              ],
              resourceDeltas: { oxygen: -4, food: +10, morale: +20, health: -3 },
              log: "Sully sprinted into the depressurizing bay and slapped a seal over the breach. Heroic save!"
            }
          },
          {
            id: "bulkhead_door",
            title: "Slam Emergency Bulkheads",
            tagline: "Lockdown the greenhouse door from the central hub.",
            icon: "🚪",
            preview: "100% crew safety, but sacrifices the plants inside.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "neutral", text: "Bulkhead sealed. Central habitat pressure is rock solid at 14.7 psi." },
                { speaker: "sully", portrait: "tired", text: "The crops in Bay C are exposed to vacuum... But the crew is safe. That's what matters." }
              ],
              resourceDeltas: { oxygen: 0, food: -12, morale: -10 },
              log: "Emergency bulkhead sealed off the breach. Crew safe, but secondary greenhouse crops lost."
            }
          },
          {
            id: "aerosol_foam",
            title: "Automated Aerosol Foam",
            tagline: "Discharge the ceiling polymer fire foam cannons.",
            icon: "🧯",
            preview: "Fast automated seal, but makes a sticky mess.",
            consequence: {
              dialogue: [
                { speaker: "maya", portrait: "smiling", text: "Foam expanded and hardened in three seconds. Hole is plugged airtight!" },
                { speaker: "sully", portrait: "grinning", text: "Everything in the room looks like it was covered in melted marshmallow... but the air is holding!" }
              ],
              resourceDeltas: { oxygen: -6, power: -8, morale: +10 },
              log: "Automated sealant foam sealed the puncture instantly. Sticky, but 100% effective."
            }
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // SOL 7
    // ------------------------------------------------------------------------
    {
      sol: 7,
      chapterTitle: "Sol 7: Valkyrie Over Chryse",
      situationSummary: "The final Sol! De-orbit telemetry locked. Resupply freighter 'Valkyrie-1' enters Mars' upper atmosphere.",
      introDialogues: [
        {
          speaker: "houston",
          portrait: "neutral",
          text: "Chryse Base... this is Houston Flight. Valkyrie-1 has performed its de-orbit retro-burn. Telemetry shows hypersonic entry interface in twelve minutes."
        },
        {
          speaker: "alex",
          portrait: "smiling",
          text: "Copy that, Houston. Seven days, zero casualties, and our outpost is standing proud."
        },
        {
          speaker: "maya",
          portrait: "smiling",
          text: "I'm looking out the cockpit window... I see it! A bright trail of atmospheric ionization burning across the stars!"
        },
        {
          speaker: "sully",
          portrait: "excited",
          text: "THEY'RE HERE! THEY'RE ACTUALLY HERE!"
        },
        {
          speaker: "tariq",
          portrait: "relieved",
          text: "We made it, my friends. We kept each other alive."
        }
      ],
      emergency: {
        title: "Climax: Guiding Valkyrie to Touchdown",
        desc: "Surface dust is swirling around the landing pad. Valkyrie's pilot calls over comms: 'Chryse Base, we need a final ground alignment lock!'",
        choices: [
          {
            id: "beacon_max",
            title: "All Power to the Landing Lasers",
            tagline: "Overload the guidance beacon into a bright column of light.",
            icon: "🌟",
            preview: "Paints a brilliant cyan highway straight down to the tarmac.",
            consequence: {
              dialogue: [
                { speaker: "alex", portrait: "determined", text: "Capacitors discharged! Beacon burning at maximum lumen output!" },
                { speaker: "houston", portrait: "neutral", text: "Valkyrie confirms optical lock. Thruster touchdown in 3... 2... 1... CONTACT LIGHT! Valkyrie has landed at Chryse Base!" }
              ],
              resourceDeltas: { power: -25, morale: +50 },
              log: "High-intensity guidance laser locked the descent path. Valkyrie-1 made a textbook touchdown on Landing Pad Alpha!"
            }
          },
          {
            id: "voice_guidance",
            title: "Alex's Voice Vectoring",
            tagline: "Guide the pilot manually over radio telemetry.",
            icon: "🎙️",
            preview: "A calm, legendary commander's descent callout.",
            consequence: {
              dialogue: [
                { speaker: "alex", portrait: "determined", text: "Valkyrie, you're drifting three meters east. Correct yaw two degrees... hold steady... ease down on retro-throttle." },
                { speaker: "houston", portrait: "neutral", text: "Engine cutoff! Gear down! Main landing struts engaged! We have arrived!" }
              ],
              resourceDeltas: { power: -5, morale: +40 },
              log: "Commander Alex talked the resupply lander through the storm turbulence. Flawless manual landing!"
            }
          },
          {
            id: "signal_flare",
            title: "Launch Magnesium Flare",
            tagline: "Ignite a brilliant emergency flare from the airlock.",
            icon: "🚀",
            preview: "Spectacular fiery beacon illuminating the red desert.",
            consequence: {
              dialogue: [
                { speaker: "sully", portrait: "excited", text: "FLARE AWAY! Look at that bright white fire lighting up the whole crater!" },
                { speaker: "houston", portrait: "neutral", text: "Valkyrie visual contact confirmed! Touchdown complete!" }
              ],
              resourceDeltas: { hull: -5, morale: +35 },
              log: "Magnesium flare ignited over Chryse crater. The resupply lander touched down safely beside the habitat!"
            }
          }
        ]
      }
    }
  ]
};

const NASA_FIELD_MANUAL = [
  {
    id: "moxie_o2",
    title: "MOXIE: Solid Oxide Electrolysis (O2)",
    icon: "💨",
    badge: "ECLSS SUBSYSTEM",
    summary: "Extracting breathable oxygen directly from Mars' thin CO2 atmosphere at 800°C.",
    content: "The Mars Oxygen ISRU Experiment (MOXIE) demonstrated on the Perseverance rover extracts atmospheric carbon dioxide (CO2) and uses solid oxide electrolysis cells (SOEC) at 800°C to strip oxygen atoms: 2CO2 → 2CO + O2. On a human-scale outpost, keeping the ceramic membrane heated requires steady electrical power, but provides an inexhaustible atmospheric source of oxygen independent of water reserves."
  },
  {
    id: "water_sabatier",
    title: "Closed-Loop Water Recovery & Sabatier",
    icon: "💧",
    badge: "LIFE SUPPORT",
    summary: "Recycling humidity and greywater with 93%+ recovery efficiency.",
    content: "NASA's Environmental Control and Life Support System (ECLSS) on the ISS and future Martian habitats recovers wastewater, sweat, and exhaled breath via vacuum rotary distillation and catalytic oxidation. Combined with the Sabatier reactor (CO2 + 4H2 → CH4 + 2H2O), metabolic byproducts are converted back into clean potable drinking water."
  },
  {
    id: "greenhouse_plants",
    title: "Martian Agriculture & Aeroponics",
    icon: "🌱",
    badge: "ASTROBOTANY",
    summary: "High-yield aeroponic nutrient misting for fast caloric and psychological replenishment.",
    content: "Growing food on Mars cannot rely on unwashed regolith due to toxic perchlorate salts (ClO4⁻). Aeroponic chambers suspend root systems in air, misting them with nutrient-rich aqueous solutions every few minutes. Fast-growing crops like dwarf potatoes, radishes, and leafy greens consume 95% less water than soil agriculture while scrubbing cabin CO2."
  },
  {
    id: "power_solar_rtg",
    title: "Dual Power: Solar Arrays & MMRTG",
    icon: "⚡",
    badge: "ENERGY GRID",
    summary: "Balancing day-night solar generation with reliable nuclear decay baseload.",
    content: "Chryse Planitia receives approximately 590 W/m² of peak solar irradiance at equinox. The outpost balances high-efficiency triple-junction photovoltaic arrays for daytime peak loads with a Multi-Mission Radioisotope Thermoelectric Generator (MMRTG) running on Plutonium-238 decay for continuous 24/7 baseline life support."
  },
  {
    id: "dust_tau",
    title: "Martian Dust Storms & Optical Depth (Tau)",
    icon: "🌪️",
    badge: "METEOROLOGY",
    summary: "Understanding Beer-Lambert atmospheric attenuation: I = I_0 * e^(-tau).",
    content: "Atmospheric optical depth (Tau) measures opacity from suspended iron-oxide dust particles. At Tau 0.3, the sky is clear pink. At Tau 2.5+, daytime turns to twilight and solar power drops below 15%. Outpost survival during storm peaks requires shedding non-vital loads (comms beacons, science racks) and keeping battery reserves above 35%."
  },
  {
    id: "radiation_shield",
    title: "Galactic Cosmic Rays & Regolith Shielding",
    icon: "🛡️",
    badge: "CREW HEALTH",
    summary: "Protecting astronauts from Solar Particle Events and GCR using water walls and regolith.",
    content: "Without a global magnetosphere or thick atmosphere, Mars astronauts face ~0.65 mSv/sol of background ionizing radiation. During Solar Particle Events (SPE), coronal mass ejections can spike surface doses dangerously. The outpost habitat places water storage tanks and 1-meter thick compressed regolith bags over bunk modules to absorb high-energy protons."
  }
];

if (typeof window !== 'undefined') {
  window.NARRATIVE_DATA = NARRATIVE_DATA;
  window.NASA_FIELD_MANUAL = NASA_FIELD_MANUAL;
}
