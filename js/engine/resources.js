// Resource Simulation & Interdependent ECLSS Systems
// Oxygen, Water, Food, Electricity with Real Cause-and-Effect Mechanics

export class ResourceManager {
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
