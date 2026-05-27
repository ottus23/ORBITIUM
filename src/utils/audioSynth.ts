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

  // Explosive release acoustic feedback
  public triggerReactionFusingRelease() {
    this.playReactionExplosion('explosion');
  }
}

export const OrbitiumAudio = new OrbitiumAudioEngine();
