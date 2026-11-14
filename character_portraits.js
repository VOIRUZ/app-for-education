/**
 * ============================================================================
 * MARS OUTPOST: SEVEN DAYS TO SURVIVE
 * Character Portrait & Visual Expression Engine
 * ============================================================================
 * Generates expressive, illustrated, cartoon-indie 2D portraits
 * inspired by The Henry Stickmin Collection and narrative indie adventures.
 * ============================================================================
 */

class PortraitEngine {
  constructor() {
    this.cache = {};
  }

  /**
   * Generates an SVG data URL for a character with a specific facial expression.
   */
  getPortraitSvg(characterKey, expression = 'neutral') {
    const key = `${characterKey}_${expression}`;
    if (this.cache[key]) return this.cache[key];

    let svg = '';
    switch (characterKey) {
      case 'alex':
        svg = this.renderAlex(expression);
        break;
      case 'maya':
        svg = this.renderMaya(expression);
        break;
      case 'sully':
        svg = this.renderSully(expression);
        break;
      case 'tariq':
        svg = this.renderTariq(expression);
        break;
      case 'houston':
      default:
        svg = this.renderHouston(expression);
        break;
    }

    const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    this.cache[key] = dataUrl;
    return dataUrl;
  }

  // --------------------------------------------------------------------------
  // Commander Alex Cole (Warm brown hair, confident, flight suit)
  // --------------------------------------------------------------------------
  renderAlex(expr) {
    // Eyebrows & mouth based on expression
    let browLeft = 'M 48 64 Q 60 62 72 66';
    let browRight = 'M 88 66 Q 100 62 112 64';
    let mouth = 'M 65 110 Q 80 116 95 110';
    let eyeLeft = '<circle cx="60" cy="74" r="4.5" fill="#1e293b"/>';
    let eyeRight = '<circle cx="100" cy="74" r="4.5" fill="#1e293b"/>';

    if (expr === 'determined') {
      browLeft = 'M 48 68 Q 62 60 74 65';
      browRight = 'M 86 65 Q 98 60 112 68';
      mouth = 'M 66 112 L 94 112';
    } else if (expr === 'worried') {
      browLeft = 'M 48 62 Q 60 68 72 66';
      browRight = 'M 88 66 Q 100 68 112 62';
      mouth = 'M 68 114 Q 80 108 92 114';
      eyeLeft = '<ellipse cx="60" cy="75" rx="5" ry="6" fill="#1e293b"/><circle cx="58" cy="73" r="1.5" fill="#fff"/>';
      eyeRight = '<ellipse cx="100" cy="75" rx="5" ry="6" fill="#1e293b"/><circle cx="98" cy="73" r="1.5" fill="#fff"/>';
    } else if (expr === 'smiling') {
      mouth = 'M 64 108 Q 80 124 96 108';
      browLeft = 'M 48 62 Q 60 58 72 62';
      browRight = 'M 88 62 Q 100 58 112 62';
    } else if (expr === 'tired') {
      browLeft = 'M 50 66 L 72 68';
      browRight = 'M 88 68 L 110 66';
      mouth = 'M 68 112 Q 80 110 92 112';
      eyeLeft = '<path d="M 54 75 Q 60 72 66 75" stroke="#1e293b" stroke-width="3" fill="none"/>';
      eyeRight = '<path d="M 94 75 Q 100 72 106 75" stroke="#1e293b" stroke-width="3" fill="none"/>';
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#1e293b" stroke="#f59e0b" stroke-width="4"/>
        <!-- Suit -->
        <path d="M 30 160 C 30 120 130 120 130 160 Z" fill="#ea580c"/>
        <path d="M 65 130 L 95 130 L 90 160 L 70 160 Z" fill="#f8fafc"/>
        <circle cx="80" cy="142" r="5" fill="#0284c7"/>
        <!-- Neck -->
        <rect x="70" y="105" width="20" height="20" fill="#fbcfe8"/>
        <!-- Head -->
        <ellipse cx="80" cy="82" rx="36" ry="42" fill="#fed7aa"/>
        <!-- Hair -->
        <path d="M 44 75 C 40 45 60 30 80 30 C 105 30 120 45 116 75 C 110 50 100 45 80 45 C 60 45 50 55 44 75 Z" fill="#78350f"/>
        <path d="M 44 65 Q 40 45 60 40 Q 80 38 100 42 Q 115 50 118 70 Q 105 52 80 50 Q 55 50 44 65 Z" fill="#92400e"/>
        <!-- Ears -->
        <circle cx="43" cy="82" r="7" fill="#fed7aa"/>
        <circle cx="117" cy="82" r="7" fill="#fed7aa"/>
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        <!-- Eyebrows -->
        <path d="${browLeft}" stroke="#78350f" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="${browRight}" stroke="#78350f" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Nose -->
        <path d="M 78 84 L 75 94 L 84 94" stroke="#d97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Mouth -->
        <path d="${mouth}" stroke="#b45309" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // Dr. Maya Lin (Chief Engineer, practical hair bun, wrench grease smudge)
  // --------------------------------------------------------------------------
  renderMaya(expr) {
    let mouth = 'M 68 112 Q 80 115 92 112';
    let browLeft = 'M 48 64 Q 60 62 72 65';
    let browRight = 'M 88 65 Q 100 62 112 64';
    let eyeLeft = '<circle cx="60" cy="74" r="4.5" fill="#0f172a"/>';
    let eyeRight = '<circle cx="100" cy="74" r="4.5" fill="#0f172a"/>';

    if (expr === 'focused') {
      browLeft = 'M 48 68 L 72 64';
      browRight = 'M 88 64 L 112 68';
      mouth = 'M 68 112 L 92 112';
    } else if (expr === 'stressed' || expr === 'alarmed') {
      browLeft = 'M 48 60 Q 60 66 72 64';
      browRight = 'M 88 64 Q 100 66 112 60';
      mouth = 'M 70 114 Q 80 106 90 114';
      eyeLeft = '<ellipse cx="60" cy="74" rx="5.5" ry="6.5" fill="#0f172a"/><circle cx="58" cy="72" r="1.5" fill="#fff"/>';
      eyeRight = '<ellipse cx="100" cy="74" rx="5.5" ry="6.5" fill="#0f172a"/><circle cx="98" cy="72" r="1.5" fill="#fff"/>';
    } else if (expr === 'smiling') {
      mouth = 'M 66 108 Q 80 124 94 108';
      browLeft = 'M 48 62 Q 60 58 72 62';
      browRight = 'M 88 62 Q 100 58 112 62';
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#0f172a" stroke="#38bdf8" stroke-width="4"/>
        <!-- Suit -->
        <path d="M 30 160 C 30 120 130 120 130 160 Z" fill="#0284c7"/>
        <path d="M 68 132 L 92 132 L 88 160 L 72 160 Z" fill="#38bdf8"/>
        <!-- Hair Bun on Top -->
        <circle cx="80" cy="28" r="16" fill="#1e1b4b"/>
        <!-- Neck -->
        <rect x="71" y="105" width="18" height="20" fill="#fde68a"/>
        <!-- Head -->
        <ellipse cx="80" cy="82" rx="35" ry="40" fill="#fef08a"/>
        <!-- Hair Front -->
        <path d="M 44 75 C 42 42 60 36 80 36 C 100 36 118 42 116 75 C 108 50 96 46 80 46 C 64 46 52 50 44 75 Z" fill="#1e1b4b"/>
        <!-- Side Bangs -->
        <path d="M 44 70 Q 42 95 46 100 Q 49 90 48 70 Z" fill="#1e1b4b"/>
        <path d="M 116 70 Q 118 95 114 100 Q 111 90 112 70 Z" fill="#1e1b4b"/>
        <!-- Grease Smudge on Left Cheek -->
        <ellipse cx="56" cy="92" rx="5" ry="2.5" fill="#64748b" opacity="0.6" transform="rotate(-15 56 92)"/>
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        <!-- Eyebrows -->
        <path d="${browLeft}" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="${browRight}" stroke="#1e1b4b" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Nose -->
        <path d="M 80 82 L 78 92 L 83 92" stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Mouth -->
        <path d="${mouth}" stroke="#991b1b" stroke-width="3" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // Sam "Sully" Sullivan (Curly red hair, freckles, sprout pin, wide smile)
  // --------------------------------------------------------------------------
  renderSully(expr) {
    let mouth = 'M 62 108 Q 80 126 98 108';
    let browLeft = 'M 48 62 Q 60 56 72 62';
    let browRight = 'M 88 62 Q 100 56 112 62';
    let eyeLeft = '<circle cx="60" cy="74" r="4.5" fill="#1e293b"/>';
    let eyeRight = '<circle cx="100" cy="74" r="4.5" fill="#1e293b"/>';

    if (expr === 'worried') {
      browLeft = 'M 48 60 Q 60 66 72 64';
      browRight = 'M 88 64 Q 100 66 112 60';
      mouth = 'M 68 115 Q 80 106 92 115';
    } else if (expr === 'excited') {
      mouth = 'M 62 105 Q 80 130 98 105 Z';
      eyeLeft = '<circle cx="60" cy="72" r="5" fill="#1e293b"/><circle cx="58" cy="70" r="1.8" fill="#fff"/>';
      eyeRight = '<circle cx="100" cy="72" r="5" fill="#1e293b"/><circle cx="98" cy="70" r="1.8" fill="#fff"/>';
    } else if (expr === 'tired') {
      mouth = 'M 70 114 L 90 114';
      browLeft = 'M 50 64 L 70 66';
      browRight = 'M 90 66 L 110 64';
      eyeLeft = '<path d="M 54 74 Q 60 70 66 74" stroke="#1e293b" stroke-width="3" fill="none"/>';
      eyeRight = '<path d="M 94 74 Q 100 70 106 74" stroke="#1e293b" stroke-width="3" fill="none"/>';
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#064e3b" stroke="#22c55e" stroke-width="4"/>
        <!-- Suit -->
        <path d="M 30 160 C 30 120 130 120 130 160 Z" fill="#15803d"/>
        <path d="M 68 132 L 92 132 L 88 160 L 72 160 Z" fill="#86efac"/>
        <!-- Sprout Badge on Collar -->
        <circle cx="50" cy="140" r="6" fill="#fff"/>
        <path d="M 50 142 Q 50 135 53 133 Q 56 135 54 139 Z" fill="#16a34a"/>
        <!-- Neck -->
        <rect x="71" y="105" width="18" height="20" fill="#fed7aa"/>
        <!-- Head -->
        <ellipse cx="80" cy="82" rx="36" ry="42" fill="#ffedd5"/>
        <!-- Curly Orange Hair -->
        <circle cx="55" cy="45" r="14" fill="#ea580c"/>
        <circle cx="75" cy="38" r="15" fill="#ea580c"/>
        <circle cx="95" cy="40" r="14" fill="#ea580c"/>
        <circle cx="110" cy="50" r="12" fill="#ea580c"/>
        <circle cx="45" cy="58" r="12" fill="#ea580c"/>
        <circle cx="115" cy="62" r="12" fill="#ea580c"/>
        <!-- Freckles -->
        <circle cx="52" cy="86" r="1.5" fill="#c2410c"/>
        <circle cx="58" cy="88" r="1.5" fill="#c2410c"/>
        <circle cx="63" cy="85" r="1.5" fill="#c2410c"/>
        <circle cx="97" cy="85" r="1.5" fill="#c2410c"/>
        <circle cx="102" cy="88" r="1.5" fill="#c2410c"/>
        <circle cx="108" cy="86" r="1.5" fill="#c2410c"/>
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        <!-- Eyebrows -->
        <path d="${browLeft}" stroke="#c2410c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="${browRight}" stroke="#c2410c" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Nose -->
        <circle cx="80" cy="90" r="4.5" fill="#fed7aa" stroke="#fb923c" stroke-width="2"/>
        <!-- Mouth -->
        <path d="${mouth}" stroke="#9a3412" stroke-width="3" stroke-linecap="round" fill="${expr === 'excited' ? '#7f1d1d' : 'none'}"/>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // Dr. Tariq Al-Mansoor (Neat silver-dappled beard, thoughtful, tea mug)
  // --------------------------------------------------------------------------
  renderTariq(expr) {
    let mouth = 'M 70 108 Q 80 114 90 108';
    let browLeft = 'M 48 62 Q 60 58 72 63';
    let browRight = 'M 88 63 Q 100 58 112 62';
    let eyeLeft = '<circle cx="60" cy="74" r="4.5" fill="#1e293b"/>';
    let eyeRight = '<circle cx="100" cy="74" r="4.5" fill="#1e293b"/>';

    if (expr === 'concerned') {
      browLeft = 'M 48 60 Q 60 66 72 64';
      browRight = 'M 88 64 Q 100 66 112 60';
      mouth = 'M 72 110 L 88 110';
    } else if (expr === 'relieved') {
      mouth = 'M 66 106 Q 80 120 94 106';
      eyeLeft = '<path d="M 54 75 Q 60 70 66 75" stroke="#1e293b" stroke-width="3" fill="none"/>';
      eyeRight = '<path d="M 94 75 Q 100 70 106 75" stroke="#1e293b" stroke-width="3" fill="none"/>';
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#3b0764" stroke="#a855f7" stroke-width="4"/>
        <!-- Suit -->
        <path d="M 30 160 C 30 120 130 120 130 160 Z" fill="#6b21a8"/>
        <path d="M 68 132 L 92 132 L 88 160 L 72 160 Z" fill="#d8b4fe"/>
        <!-- Neck -->
        <rect x="71" y="105" width="18" height="20" fill="#fde68a"/>
        <!-- Head -->
        <ellipse cx="80" cy="82" rx="35" ry="41" fill="#fcd34d"/>
        <!-- Hair (Black with silver streaks) -->
        <path d="M 44 72 C 40 40 60 32 80 32 C 100 32 120 40 116 72 C 108 48 95 44 80 44 C 65 44 52 48 44 72 Z" fill="#18181b"/>
        <path d="M 68 34 Q 72 44 75 44" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <path d="M 85 34 Q 88 44 92 44" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Beard -->
        <path d="M 50 85 Q 52 118 80 122 Q 108 118 110 85 Q 102 112 80 114 Q 58 112 50 85 Z" fill="#27272a"/>
        <path d="M 68 116 Q 80 120 92 116" stroke="#e2e8f0" stroke-width="2" fill="none"/>
        <!-- Eyes -->
        ${eyeLeft}
        ${eyeRight}
        <!-- Eyebrows -->
        <path d="${browLeft}" stroke="#18181b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="${browRight}" stroke="#18181b" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Nose -->
        <path d="M 80 80 L 76 92 L 84 92" stroke="#b45309" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Mouth -->
        <path d="${mouth}" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
      </svg>
    `;
  }

  // --------------------------------------------------------------------------
  // Houston Flight Director (Audio headset, mission badge)
  // --------------------------------------------------------------------------
  renderHouston(expr) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
        <circle cx="80" cy="80" r="76" fill="#0f172a" stroke="#94a3b8" stroke-width="4"/>
        <path d="M 30 160 C 30 120 130 120 130 160 Z" fill="#334155"/>
        <polygon points="80,126 73,155 87,155" fill="#0284c7"/>
        <ellipse cx="80" cy="80" rx="35" ry="40" fill="#fde68a"/>
        <!-- Headset -->
        <path d="M 40 80 Q 40 40 80 40 Q 120 40 120 80" stroke="#475569" stroke-width="5" fill="none"/>
        <rect x="35" y="70" width="10" height="20" rx="3" fill="#0f172a"/>
        <rect x="115" y="70" width="10" height="20" rx="3" fill="#0f172a"/>
        <path d="M 40 85 Q 45 105 65 105" stroke="#0f172a" stroke-width="3.5" fill="none"/>
        <circle cx="67" cy="105" r="4" fill="#0284c7"/>
        <circle cx="62" cy="76" r="4" fill="#1e293b"/>
        <circle cx="98" cy="76" r="4" fill="#1e293b"/>
        <path d="M 52 66 L 70 66" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
        <path d="M 90 66 L 108 66" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
        <path d="M 70 108 L 90 108" stroke="#b45309" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;
  }
}

if (typeof window !== 'undefined') {
  window.PortraitEngine = PortraitEngine;
}
