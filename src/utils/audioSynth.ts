/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChemicalElement } from '../types';

class OrbitiumAudioEngine {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private delayGain: GainNode | null = null;

  // Drones
  private baseOsc: OscillatorNode | null = null;
  private baseGain: GainNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private subGain: GainNode | null = null;

  // Harmonic voices from shells
  private shellsGain: GainNode | null = null;
  private shellsOscs: OscillatorNode[] = [];
  private shellsGains: GainNode[] = [];

  // LFOs
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private isMuted: boolean = false;
  private lastFrequencies: number[] = [];

  constructor() {
    // Lazy load on first user interaction
  }

  public init() {
    if (this.ctx) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      
      // Node initialization
      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.primaryGain.connect(this.ctx.destination);

      // Lowpass feedback filter for cosmic texture
      this.lowpassFilter = this.ctx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
      this.lowpassFilter.connect(this.primaryGain);

      // Warm echo delay effect
      this.delayNode = this.ctx.createDelay(1.5);
      this.delayGain = this.ctx.createGain();
      
      this.delayNode.delayTime.setValueAtTime(0.4, this.ctx.currentTime);
      this.delayGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.lowpassFilter.connect(this.delayNode);
      this.delayNode.connect(this.delayGain);
      this.delayGain.connect(this.lowpassFilter); // feedback loop

      // LFO for atmospheric ambient sweeping
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      
      this.lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // very slow sweep
      this.lfoGain.gain.setValueAtTime(120, this.ctx.currentTime); // 120Hz filter cutoff modulation

      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.lowpassFilter.frequency);
      
      this.lfo.start();

      // Master fade-in
      this.primaryGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

      console.log('Orbitium Procedural Audio System Initialized successfully.');
    } catch (e) {
      console.warn('Web Audio API is not supported or blocked in this browser.', e);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.primaryGain && this.ctx) {
      const value = muted ? 0.0 : 0.12;
      this.primaryGain.gain.linearRampToValueAtTime(value, this.ctx.currentTime + 0.3);
    }
  }

  // Plays a lovely high-frequency chime used during timeline unlock discoveries
  public playUnlockChime() {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Create dual chime oscillators
    const chime1 = this.ctx.createOscillator();
    const chime2 = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    chime1.type = 'triangle';
    chime2.type = 'sine';

    // Maj6 chord elements
    chime1.frequency.setValueAtTime(523.25, now); // C5
    chime2.frequency.setValueAtTime(659.25, now); // E5

    // Add brief glide
    chime1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.4); // C6
    chime2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.4); // E6

    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    chime1.connect(chimeGain);
    chime2.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);

    chime1.start(now);
    chime2.start(now);
    chime1.stop(now + 1.3);
    chime2.stop(now + 1.3);
  }

  /**
   * Generates a single dynamic grain of sound procedurally.
   */
  private playGrain(
    pitch: number,
    duration: number,
    gType: 'sine' | 'sawtooth' | 'triangle' | 'noise',
    gainVal: number,
    startTime: number,
    filterFreqValue?: number,
    panValue?: number
  ) {
    if (!this.ctx) return;
    const now = startTime;
    const oscGain = this.ctx.createGain();

    // Volume envelope for the grain (parabolic or linear-attack-exponential-release shape)
    oscGain.gain.setValueAtTime(0.0, now);
    const attack = duration * 0.18;
    const decay = duration * 0.82;
    oscGain.gain.linearRampToValueAtTime(gainVal, now + attack);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

    let lastNode: AudioNode = oscGain;

    // Apply stereo panning if available
    if (this.ctx.createStereoPanner && panValue !== undefined) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(panValue, now);
      oscGain.connect(panner);
      lastNode = panner;
    }

    // Apply bandpass filter to highlight local frequency components of each grain
    if (filterFreqValue !== undefined) {
      const gFilter = this.ctx.createBiquadFilter();
      gFilter.type = 'bandpass';
      gFilter.frequency.setValueAtTime(filterFreqValue, now);
      gFilter.Q.setValueAtTime(4.5, now);
      lastNode.connect(gFilter);
      lastNode = gFilter;
    }

    lastNode.connect(this.primaryGain || this.ctx.destination);

    if (gType === 'noise') {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      if (bufferSize > 0) {
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.connect(oscGain);
        noiseSource.start(now);
        noiseSource.stop(now + duration + 0.05);
      }
    } else {
      const osc = this.ctx.createOscillator();
      osc.type = gType;
      osc.frequency.setValueAtTime(pitch, now);
      osc.connect(oscGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    }
  }

  /**
   * Powerful Granular Synthesis Engine representing atomic bond crystallization.
   */
  public playGranularReactionSynth(type: 'covalent' | 'ionic' | 'explosion') {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;

    if (type === 'ionic') {
      // CRISP IONIC SNAP: Tiny rapid high-frequency click/snap cloud (electrostatic discharge)
      // Play a quick sub heavy thump at the core start
      const kick = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(150, now);
      kick.frequency.exponentialRampToValueAtTime(40, now + 0.22);
      kickGain.gain.setValueAtTime(0.35, now);
      kickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      kick.connect(kickGain);
      kickGain.connect(this.primaryGain || this.ctx.destination);
      kick.start(now);
      kick.stop(now + 0.25);

      // Schedule 22 crystal snapping grains
      const numGrains = 22;
      for (let i = 0; i < numGrains; i++) {
        const grainStart = now + (i * 0.008); // tightly packed 8ms apart
        const duration = 0.008 + (Math.random() * 0.018); // super snappy
        const pitch = 1400 + Math.random() * 2600; // electrostatic high-frequency
        const panned = (i % 2 === 0 ? 1 : -1) * (0.1 + Math.random() * 0.7);
        const gain = 0.03 + Math.random() * 0.08;
        const gType = Math.random() > 0.4 ? 'noise' : 'sine';
        const filterVal = Math.random() > 0.5 ? pitch : undefined;

        this.playGrain(pitch, duration, gType, gain, grainStart, filterVal, panned);
      }
    } else if (type === 'covalent') {
      // COVALENT HUM: Lush resonant harmonic drone/hum cloud of overlapping slow grains
      const numGrains = 65;
      const totalDuration = 1.3; // spans 1.3 seconds
      
      // Underlying warm root bass pad to tie it together
      const humBase = this.ctx.createOscillator();
      const humBaseGain = this.ctx.createGain();
      humBase.type = 'triangle';
      humBase.frequency.setValueAtTime(110, now);
      humBaseGain.gain.setValueAtTime(0.0, now);
      humBaseGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      humBaseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      humBase.connect(humBaseGain);
      humBaseGain.connect(this.primaryGain || this.ctx.destination);
      humBase.start(now);
      humBase.stop(now + 1.3);

      for (let i = 0; i < numGrains; i++) {
        // Distribute grains with slow breathing acceleration then deceleration
        const progress = i / numGrains;
        const grainOffset = progress * totalDuration;
        const grainStart = now + grainOffset;
        const duration = 0.12 + Math.random() * 0.16; // lingering grains
        
        // Formant / Overtones chord stack frequencies (110Hz root)
        const harmStack = [220, 330, 440, 550, 660, 880];
        const basePitch = harmStack[Math.floor(Math.random() * harmStack.length)];
        const fineDetune = (Math.random() - 0.5) * 8.0; // rich chorus detune
        const pitch = basePitch + fineDetune;
        
        const panned = Math.sin(progress * Math.PI * 2) * 0.7; // swirling circular panning
        const gain = 0.02 + (1.0 - progress) * 0.04;
        
        this.playGrain(pitch, duration, 'sine', gain, grainStart, undefined, panned);
      }
    } else {
      // EXPLOSIONS / HIGH ENERGY THERMAL WAVE: Heavy cascade of jagged high-impact grains
      // Start with massive kick drum wave
      const blast = this.ctx.createOscillator();
      const blastGain = this.ctx.createGain();
      blast.type = 'sawtooth';
      blast.frequency.setValueAtTime(180, now);
      blast.frequency.exponentialRampToValueAtTime(28, now + 0.85);
      blastGain.gain.setValueAtTime(0.4, now);
      blastGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      blast.connect(blastGain);
      blastGain.connect(this.primaryGain || this.ctx.destination);
      blast.start(now);
      blast.stop(now + 1.0);

      const numGrains = 90;
      const totalDuration = 2.2;

      for (let i = 0; i < numGrains; i++) {
        const progress = i / numGrains;
        // Dynamic interval spacing: spacing gets wider as the explosion debris disperses
        const grainOffset = Math.pow(progress, 1.6) * totalDuration;
        const grainStart = now + grainOffset;
        
        const duration = 0.015 + (1.0 - progress) * 0.28; // starts rapid/snappy, stretches into long rumbles
        // Pitch starts at sizzling high frequencies and falls into heavy rumbles
        const pitch = (2400 * (1.0 - progress)) + 50 + (Math.random() * 180);
        
        const panned = (Math.random() - 0.5) * 0.9;
        const gain = (0.05 + Math.random() * 0.08) * (1.0 - progress * 0.85);
        const gType = Math.random() > 0.45 ? 'sawtooth' : 'noise';
        const filterVal = 1200 * (1.0 - progress) + 80;

        this.playGrain(pitch, duration, gType, gain, grainStart, filterVal, panned);
      }
    }
  }

  // Plays chemical collision syntheses bangs
  public playReactionExplosion(type: 'covalent' | 'ionic' | 'explosion') {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    const boomGain = this.ctx.createGain();
    boomGain.gain.setValueAtTime(0.3, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + (type === 'explosion' ? 2.5 : 1.2));
    boomGain.connect(this.ctx.destination);

    // 1. Deep rumble oscillator
    const rumble = this.ctx.createOscillator();
    rumble.type = 'sawtooth';
    rumble.frequency.setValueAtTime(110, now);
    rumble.frequency.exponentialRampToValueAtTime(35, now + 0.6);
    rumble.connect(boomGain);
    rumble.start(now);
    rumble.stop(now + 2.0);

    // 2. Filtered noise explosion
    const bufferSize = this.ctx.sampleRate * (type === 'explosion' ? 2.0 : 0.8);
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(type === 'explosion' ? 1200 : 300, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(40, now + 0.6);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(boomGain);
    
    whiteNoise.start(now);
    whiteNoise.stop(now + (type === 'explosion' ? 2.5 : 1.2));
  }

  // Update real-time frequency based on distance during 3D drag collision setups
  public updateTetherSound(distance: number) {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Map distance (0 to 12) to frequencies (e.g. 100Hz to 600Hz)
    const normalized = Math.max(0, Math.min(1, distance / 12));
    const targetFreq = 480 - (normalized * 330); // closer makes it squeal higher!

    if (this.lowpassFilter) {
      // increase resonance as they get closer for suspense
      const targetQ = 1.0 + (1 - normalized) * 12.0;
      this.lowpassFilter.Q.setTargetAtTime(targetQ, now, 0.05);
      this.lowpassFilter.frequency.setTargetAtTime(targetFreq * 2.0, now, 0.05);
    }
  }

  // Transitions smoothly to a designated sound signature matching the element configuration
  public transitionToElement(el: ChemicalElement | null) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Reset old shell oscillators with quick envelope discharge
    this.shellsOscs.forEach((osc, idx) => {
      const g = this.shellsGains[idx];
      if (g) g.gain.linearRampToValueAtTime(0, now + 0.15);
      setTimeout(() => {
        try { osc.stop(); } catch(e){}
      }, 200);
    });
    this.shellsOscs = [];
    this.shellsGains = [];

    if (!el) {
      // Fade out sub levels to normal deep atmospheric sweep
      if (this.baseGain) this.baseGain.gain.setTargetAtTime(0.04, now, 0.6);
      if (this.subGain) this.subGain.gain.setTargetAtTime(0.02, now, 0.6);
      if (this.lowpassFilter) {
        this.lowpassFilter.frequency.setTargetAtTime(250, now, 0.5);
        this.lowpassFilter.Q.setTargetAtTime(1.0, now, 0.5);
      }
      return;
    }

    const atomicNum = el.number;
    // Base frequency linked inversely with Atomic Number:
    // Lighter elements scream, heavy elements have deep heavy drone
    const baseFreq = Math.max(38, 140 - (atomicNum * 0.8));
    const subFreq = baseFreq / 2.0;

    // Initialize Drone Generators if missing
    if (!this.baseOsc) {
      this.baseOsc = this.ctx.createOscillator();
      this.baseOsc.type = 'triangle';
      this.baseOsc.frequency.setValueAtTime(baseFreq, now);

      this.baseGain = this.ctx.createGain();
      this.baseGain.gain.setValueAtTime(0.05, now);

      this.baseOsc.connect(this.baseGain);
      if (this.lowpassFilter) this.baseGain.connect(this.lowpassFilter);
      this.baseOsc.start();
    } else {
      this.baseOsc.frequency.setTargetAtTime(baseFreq, now, 0.5);
    }

    if (!this.subOsc) {
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(subFreq, now);

      this.subGain = this.ctx.createGain();
      this.subGain.gain.setValueAtTime(0.04, now);

      this.subOsc.connect(this.subGain);
      if (this.lowpassFilter) this.subGain.connect(this.lowpassFilter);
      this.subOsc.start();
    } else {
      this.subOsc.frequency.setTargetAtTime(subFreq, now, 0.4);
    }

    // Energize filter based on energy behavior config!
    const behavior = el.visual?.energyBehavior || 'lattice';
    let filterCutoff = 350;
    let resonanceQ = 2.0;

    if (behavior === 'fusion' || behavior === 'radioactive') {
      filterCutoff = 800;
      resonanceQ = 4.0;
      // Slight unstable shaking LFO speed
      if (this.lfo) this.lfo.frequency.setTargetAtTime(3.8, now, 0.5);
    } else if (behavior === 'discharge') {
      filterCutoff = 950;
      resonanceQ = 5.5;
      if (this.lfo) this.lfo.frequency.setTargetAtTime(12.0, now, 0.2); // high speed electro crackle
    } else if (behavior === 'fluid') {
      filterCutoff = 400;
      resonanceQ = 1.5;
      if (this.lfo) this.lfo.frequency.setTargetAtTime(0.4, now, 0.8); // slow waves
    } else {
      // metallic or lattice (highly stable structures)
      filterCutoff = 300;
      resonanceQ = 1.0;
      if (this.lfo) this.lfo.frequency.setTargetAtTime(0.1, now, 1.0);
    }

    if (this.lowpassFilter) {
      this.lowpassFilter.frequency.setTargetAtTime(filterCutoff, now, 0.6);
      this.lowpassFilter.Q.setTargetAtTime(resonanceQ, now, 0.6);
    }

    // Active Shells translates to auxiliary harmonic overtones!
    // Each electron shell count acts as an overtone voice
    const activeShells = el.shells;
    activeShells.forEach((eCount, idx) => {
      // Overtones: base frequency multiplied by harmonic index
      // Offset slightly to create a magical spatial stereo detune
      const factor = idx + 1.5;
      const shellFreq = baseFreq * factor * (1.0 + (eCount * 0.005));

      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      // Metallic or radioactive behaves with sawtooth/saw for overtones
      osc.type = (behavior === 'metallic' || behavior === 'radioactive') ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(shellFreq, now);

      // Volume of harmonics is lower for outer shells
      const capVolume = Math.max(0.001, 0.02 / (idx + 1));
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(capVolume, now + 0.3);

      osc.connect(gain);
      if (this.lowpassFilter) gain.connect(this.lowpassFilter);
      
      osc.start(now);
      this.shellsOscs.push(osc);
      this.shellsGains.push(gain);
    });

    // Make drone richer
    if (this.baseGain) this.baseGain.gain.setTargetAtTime(0.08, now, 0.3);
    if (this.subGain) this.subGain.gain.setTargetAtTime(0.05, now, 0.3);
  }

  // Dual-Reactant dragging hum synthesizer trigger
  public triggerReactionSynth(re: any | null) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    
    // Play an ascending sine sweep as atomic tension starts
    const sweep = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(180, now);
    sweep.frequency.exponentialRampToValueAtTime(320, now + 0.5);
    
    g.gain.setValueAtTime(0.0, now);
    g.gain.linearRampToValueAtTime(0.06, now + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    sweep.connect(g);
    g.connect(this.ctx.destination);
    sweep.start(now);
    sweep.stop(now + 0.7);
  }

  // Real-time tether proximity tracking frequency shifter
  public updateTetherProximity(distance: number) {
    this.updateTetherSound(distance);
  }

  // Plays a procedural harmonic chime corresponding to the clicked shell's energy level / quantum level
  public playShellChime(shellIndex: number) {
    if (!this.ctx || this.isMuted) this.init();
    if (!this.ctx || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Outer shells (higher shellIndex) correspond to higher energy levels and higher frequencies!
    // K-shell (0) is base 220Hz (A3), L-shell (1) is 330Hz (E4), M-shell (2) is 440Hz (A4), N-shell (3) is 554.37Hz (C#5/major third), etc.
    const frequencies = [220, 277.18, 330, 440, 554.37, 659.25, 880];
    const baseFreq = frequencies[shellIndex % frequencies.length] || (220 + shellIndex * 110);
    
    const harmonic1 = baseFreq * 1.5; // Perfect fifth
    const harmonic2 = baseFreq * 2.0; // Perfect octave
    const harmonic3 = baseFreq * 2.5; // Major third overhead

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc3.type = 'sine';

    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(harmonic1, now);
    osc3.frequency.setValueAtTime(harmonic2, now);

    // Subtle quantum slide/vibrato
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.005, now + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(harmonic1 * 1.008, now + 0.25);
    osc3.frequency.exponentialRampToValueAtTime(harmonic3, now + 0.5);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2500, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 1.2);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    osc3.stop(now + 1.5);
  }

  // Explosive release acoustic feedback
  public triggerReactionFusingRelease(reactionType?: 'covalent' | 'ionic' | 'explosion') {
    this.playGranularReactionSynth(reactionType || 'explosion');
  }
}

export const OrbitiumAudio = new OrbitiumAudioEngine();
