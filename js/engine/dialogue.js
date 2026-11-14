// Interactive Narrative Dialogue System with Typewriter & Character Portraits
// Inspired by Henry Stickmin & Indie Narrative Adventures

import { CHARACTERS } from '../data/story.js';

export class DialogueEngine {
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
