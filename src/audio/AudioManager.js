/**
 * Tech Horizon - Global Futuristic Audio Management System
 * 
 * Provides procedural, zero-asset Web Audio API synthesis for:
 * 1. Deep-space ambient atmosphere (continuous across all sections, volume ~10-15%)
 * 2. Cosmic shooting star whooshes (synchronized with shooting stars)
 * 3. Crystal ice card crack, energy charge, futuristic blast & reform
 * 4. Rocket cursor double-click hyperboost, energy pulses ("pew/whoosh"), & micro-bursts
 * 5. Global mute/unmute state management and browser autoplay unlocking
 */

class TechHorizonAudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambienceGain = null;
    this.sfxGain = null;

    this.isInitialized = false;
    this.isMuted = false;
    this.isAmbiencePlaying = false;
    this.listeners = new Set();

    // Noise buffers
    this.pinkNoiseBuffer = null;

    // Cooldown trackers to prevent overlapping / audio spam
    this.lastShootingStarTime = 0;
    this.lastCardBlastTime = 0;
    this.lastCardReformTime = 0;

    // Read stored mute preference if available
    try {
      const storedMute = localStorage.getItem('tech_horizon_audio_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
    } catch {
      this.isMuted = false;
    }
  }

  // --------------------------------------------------------------------------
  // INITIALIZATION & AUTOPLAY HANDLING
  // --------------------------------------------------------------------------
  init() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      this.ctx = new AudioCtxClass();

      // Master Gain Node
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Ambience Sub-Gain (low volume ~10-14%)
      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);

      // SFX Sub-Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Pre-generate procedural pink noise buffer (4 seconds loop)
      this.pinkNoiseBuffer = this._createPinkNoiseBuffer(4);

      this.isInitialized = true;

      // Handle browser autoplay policy
      if (this.ctx.state === 'running') {
        this.startAmbience();
      } else {
        const unlockAudio = () => {
          if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().then(() => {
              this.startAmbience();
            }).catch(() => {});
          } else {
            this.startAmbience();
          }

          // Clean up first-interaction listeners
          window.removeEventListener('pointerdown', unlockAudio);
          window.removeEventListener('keydown', unlockAudio);
          window.removeEventListener('touchstart', unlockAudio);
          window.removeEventListener('scroll', unlockAudio);
        };

        window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
        window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
        window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
        window.addEventListener('scroll', unlockAudio, { once: true, passive: true });
      }
    } catch (err) {
      console.warn('[TechHorizonAudioManager] AudioContext init note:', err);
    }
  }

  // --------------------------------------------------------------------------
  // MUTE / UNMUTE MANAGEMENT
  // --------------------------------------------------------------------------
  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    try {
      localStorage.setItem('tech_horizon_audio_muted', this.isMuted.toString());
    } catch {}

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      // Smooth fade to prevent popping
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 1.0, now, 0.025);
    }

    // If unmuting while suspended, ensure context wakes up
    if (!this.isMuted && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => this.startAmbience()).catch(() => {});
    }

    this._notifyListeners();
  }

  getMuted() {
    return this.isMuted;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.isMuted);
    return () => this.listeners.delete(callback);
  }

  _notifyListeners() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isMuted);
      } catch {}
    });
  }

  _ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --------------------------------------------------------------------------
  // 1. GLOBAL SPACE AMBIENCE (Multi-layered continuous deep-space drone)
  // --------------------------------------------------------------------------
  startAmbience() {
    if (this.isAmbiencePlaying || !this.ctx || !this.ambienceGain) return;
    this.isAmbiencePlaying = true;

    try {
      const t = this.ctx.currentTime;

      // Layer A: Cosmic Sub Drone (55Hz + 55.4Hz binaural pulse)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      const droneFilter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, t); // A1 note
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55.4, t); // 0.4Hz hypnotic cosmic pulse

      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(140, t);

      droneGain.gain.setValueAtTime(0.08, t);

      osc1.connect(droneFilter);
      osc2.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.ambienceGain);

      osc1.start();
      osc2.start();

      // Layer B: Solar Wind / Deep Atmosphere (Filtered Pink Noise with Slow LFO)
      if (this.pinkNoiseBuffer) {
        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = this.pinkNoiseBuffer;
        noiseNode.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.Q.setValueAtTime(2.2, t);
        windFilter.frequency.setValueAtTime(260, t);

        // LFO for slow breathing atmospheric shift (0.05 Hz)
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.05, t);
        lfoGain.gain.setValueAtTime(120, t); // Sweeps between 140Hz and 380Hz

        lfo.connect(lfoGain);
        lfoGain.connect(windFilter.frequency);

        const windGain = this.ctx.createGain();
        windGain.gain.setValueAtTime(0.04, t);

        noiseNode.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.ambienceGain);

        noiseNode.start();
        lfo.start();
      }

      // Layer C: Subtle Ethereal Resonance (440Hz / 660Hz harmonic aura)
      const resOsc = this.ctx.createOscillator();
      const resFilter = this.ctx.createBiquadFilter();
      const resGain = this.ctx.createGain();

      resOsc.type = 'sine';
      resOsc.frequency.setValueAtTime(220, t); // Warm A3 octave

      resFilter.type = 'bandpass';
      resFilter.frequency.setValueAtTime(440, t);
      resFilter.Q.setValueAtTime(3.5, t);

      resGain.gain.setValueAtTime(0.012, t);

      resOsc.connect(resFilter);
      resFilter.connect(resGain);
      resGain.connect(this.ambienceGain);

      resOsc.start();
    } catch (e) {
      console.warn('[TechHorizonAudioManager] Ambience start note:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 2. SHOOTING STAR SOUND (Subtle cosmic whoosh synchronized with star trail)
  // --------------------------------------------------------------------------
  playShootingStar() {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Cooldown of 4.5s to prevent audio clutter
    const now = Date.now();
    if (now - this.lastShootingStarTime < 4500) return;
    this.lastShootingStarTime = now;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.42;

      // Bandpass swept pink noise
      if (this.pinkNoiseBuffer) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.pinkNoiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(2.8, t);
        filter.frequency.setValueAtTime(1400, t);
        filter.frequency.exponentialRampToValueAtTime(380, t + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.09, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        source.start(t);
        source.stop(t + duration);
      }

      // Very subtle high-frequency harmonic trail
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(600, t + duration);

      oscGain.gain.setValueAtTime(0.001, t);
      oscGain.gain.linearRampToValueAtTime(0.035, t + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // 3. CRYSTAL CARD INTERACTION SOUNDS
  // --------------------------------------------------------------------------

  /**
   * Click-to-reveal sequence:
   * 0–150ms: subtle crystal crack
   * 150–400ms: energy buildup
   * 400–650ms: short futuristic sci-fi energy blast & crystal shards reveal
   */
  playCrystalCrackAndBlast() {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    // Prevent muddy overlapping blasts
    const now = Date.now();
    if (now - this.lastCardBlastTime < 400) return;
    this.lastCardBlastTime = now;

    try {
      const t = this.ctx.currentTime;

      // ----------------------------------------------------------------------
      // PHASE 1: 0–150ms - Subtle Crystal Crack (High-Q glass fractures)
      // ----------------------------------------------------------------------
      const playCrackImpulse = (timeOffset, freq, amp) => {
        const ct = t + timeOffset;
        const crackOsc = this.ctx.createOscillator();
        const crackFilter = this.ctx.createBiquadFilter();
        const crackGain = this.ctx.createGain();

        crackOsc.type = 'square';
        crackOsc.frequency.setValueAtTime(freq, ct);
        crackOsc.frequency.exponentialRampToValueAtTime(freq * 0.4, ct + 0.035);

        crackFilter.type = 'bandpass';
        crackFilter.frequency.setValueAtTime(freq * 1.2, ct);
        crackFilter.Q.setValueAtTime(7, ct);

        crackGain.gain.setValueAtTime(amp, ct);
        crackGain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.04);

        crackOsc.connect(crackFilter);
        crackFilter.connect(crackGain);
        crackGain.connect(this.sfxGain);

        crackOsc.start(ct);
        crackOsc.stop(ct + 0.045);
      };

      playCrackImpulse(0.01, 2600, 0.12);
      playCrackImpulse(0.08, 3800, 0.10);

      // ----------------------------------------------------------------------
      // PHASE 2: 150–400ms - Short Energy Buildup (Rising sci-fi pitch charge)
      // ----------------------------------------------------------------------
      const chargeStart = t + 0.14;
      const chargeEnd = t + 0.40;

      const chargeOsc = this.ctx.createOscillator();
      const chargeFilter = this.ctx.createBiquadFilter();
      const chargeGain = this.ctx.createGain();

      chargeOsc.type = 'triangle';
      chargeOsc.frequency.setValueAtTime(260, chargeStart);
      chargeOsc.frequency.exponentialRampToValueAtTime(840, chargeEnd);

      chargeFilter.type = 'bandpass';
      chargeFilter.frequency.setValueAtTime(450, chargeStart);
      chargeFilter.frequency.exponentialRampToValueAtTime(1400, chargeEnd);
      chargeFilter.Q.setValueAtTime(3.2, chargeStart);

      chargeGain.gain.setValueAtTime(0.001, chargeStart);
      chargeGain.gain.linearRampToValueAtTime(0.18, chargeEnd);
      chargeGain.gain.setValueAtTime(0, chargeEnd);

      chargeOsc.connect(chargeFilter);
      chargeFilter.connect(chargeGain);
      chargeGain.connect(this.sfxGain);

      chargeOsc.start(chargeStart);
      chargeOsc.stop(chargeEnd);

      // ----------------------------------------------------------------------
      // PHASE 3: 400–650ms - Futuristic Sci-Fi Energy Blast (Clean energy burst)
      // ----------------------------------------------------------------------
      const blastStart = t + 0.39;
      const blastEnd = t + 0.65;

      // Warm sci-fi plasma drop (NOT realistic explosion)
      const blastOsc = this.ctx.createOscillator();
      const blastFilter = this.ctx.createBiquadFilter();
      const blastGain = this.ctx.createGain();

      blastOsc.type = 'sine';
      blastOsc.frequency.setValueAtTime(480, blastStart);
      blastOsc.frequency.exponentialRampToValueAtTime(70, blastEnd);

      blastFilter.type = 'lowpass';
      blastFilter.frequency.setValueAtTime(1200, blastStart);
      blastFilter.frequency.exponentialRampToValueAtTime(180, blastEnd);

      blastGain.gain.setValueAtTime(0.24, blastStart);
      blastGain.gain.exponentialRampToValueAtTime(0.001, blastEnd);

      blastOsc.connect(blastFilter);
      blastFilter.connect(blastGain);
      blastGain.connect(this.sfxGain);

      blastOsc.start(blastStart);
      blastOsc.stop(blastEnd);

      // Sparkling Crystalline Shard Dispersal (High shimmering sweep)
      const shardOsc = this.ctx.createOscillator();
      const shardFilter = this.ctx.createBiquadFilter();
      const shardGain = this.ctx.createGain();

      shardOsc.type = 'sine';
      shardOsc.frequency.setValueAtTime(3200, blastStart);
      shardOsc.frequency.exponentialRampToValueAtTime(1200, blastEnd);

      shardFilter.type = 'bandpass';
      shardFilter.frequency.setValueAtTime(3000, blastStart);
      shardFilter.Q.setValueAtTime(4.5, blastStart);

      shardGain.gain.setValueAtTime(0.10, blastStart);
      shardGain.gain.exponentialRampToValueAtTime(0.0001, blastEnd);

      shardOsc.connect(shardFilter);
      shardFilter.connect(shardGain);
      shardGain.connect(this.sfxGain);

      shardOsc.start(blastStart);
      shardOsc.stop(blastEnd);
    } catch {}
  }

  /**
   * Re-freeze sequence:
   * Reverse energy sound, subtle particle pull-in, soft crystal reformation sound
   */
  playCrystalReform() {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    const now = Date.now();
    if (now - this.lastCardReformTime < 350) return;
    this.lastCardReformTime = now;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.38;

      // Inward reverse energy sweep
      const revOsc = this.ctx.createOscillator();
      const revFilter = this.ctx.createBiquadFilter();
      const revGain = this.ctx.createGain();

      revOsc.type = 'triangle';
      revOsc.frequency.setValueAtTime(820, t);
      revOsc.frequency.exponentialRampToValueAtTime(260, t + duration);

      revFilter.type = 'bandpass';
      revFilter.frequency.setValueAtTime(1200, t);
      revFilter.frequency.exponentialRampToValueAtTime(400, t + duration);
      revFilter.Q.setValueAtTime(3.0, t);

      revGain.gain.setValueAtTime(0.01, t);
      revGain.gain.linearRampToValueAtTime(0.15, t + duration * 0.7);
      revGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      revOsc.connect(revFilter);
      revFilter.connect(revGain);
      revGain.connect(this.sfxGain);

      revOsc.start(t);
      revOsc.stop(t + duration);

      // Crystalline settling chime (Glass harmonic locking in place)
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      const chimeStart = t + 0.16;

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(1480, chimeStart);

      chimeGain.gain.setValueAtTime(0.09, chimeStart);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeStart + 0.22);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.sfxGain);

      chimeOsc.start(chimeStart);
      chimeOsc.stop(chimeStart + 0.24);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // 4. ROCKET CURSOR DOUBLE-CLICK SOUNDS
  // --------------------------------------------------------------------------

  /**
   * Short thruster boost sound when rocket accelerates forward
   */
  playRocketBoost() {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.16;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.exponentialRampToValueAtTime(460, t + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, t);

      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }

  /**
   * Fictional cyan energy projectile launch sound (futuristic electronic "pew/whoosh")
   * NOT realistic bullets, firearms, or weapons.
   */
  playRocketPulse(pulseIndex = 0) {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.085;

      // Subtle pitch variation per projectile for futuristic telemetry feel
      const baseFreq = 2100 - pulseIndex * 80;
      const endFreq = 580 - pulseIndex * 30;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq * 0.9, t);
      filter.frequency.exponentialRampToValueAtTime(endFreq * 1.1, t + duration);
      filter.Q.setValueAtTime(4.0, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }

  /**
   * Tiny particle burst when a projectile disappears
   */
  playProjectileBurst() {
    this._ensureContext();
    if (!this.ctx || this.isMuted) return;

    try {
      const t = this.ctx.currentTime;
      const duration = 0.035;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3100, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + duration);

      gain.gain.setValueAtTime(0.045, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + duration);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // HELPER: Generate 4-Second Pink Noise Loop Buffer
  // --------------------------------------------------------------------------
  _createPinkNoiseBuffer(durationSeconds = 4) {
    if (!this.ctx) return null;
    const sampleRate = this.ctx.sampleRate;
    const bufferSize = sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Paul Kellet's filter method for authentic pink noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }
}

// Export singleton instance
const AudioManager = new TechHorizonAudioManager();
export default AudioManager;
