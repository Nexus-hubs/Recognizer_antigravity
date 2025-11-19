// ===== WEB AUDIO API SOUND SYSTEM =====
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.sounds = {};
        this.initialized = false;
        this.musicSequencer = null;
    }

    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;
            this.masterGain.connect(this.audioContext.destination);
            this.musicSequencer = new TechnoSequencer(this.audioContext, this.masterGain);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    // Music controls
    startMusic() {
        if (this.musicSequencer) {
            this.musicSequencer.start();
        }
    }

    stopMusic() {
        if (this.musicSequencer) {
            this.musicSequencer.stop();
        }
    }

    // Create oscillator-based sound
    createOscillator(frequency, type = 'sine', duration = 0.1) {
        if (!this.initialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Engine hum (continuous background sound)
    playEngineHum() {
        if (!this.initialized || this.sounds.engineHum) return;

        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator1.type = 'sawtooth';
        oscillator1.frequency.value = 80;

        oscillator2.type = 'sine';
        oscillator2.frequency.value = 120;

        gainNode.gain.value = 0.05;

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator1.start();
        oscillator2.start();

        this.sounds.engineHum = { oscillator1, oscillator2, gainNode };
    }

    stopEngineHum() {
        if (this.sounds.engineHum) {
            this.sounds.engineHum.oscillator1.stop();
            this.sounds.engineHum.oscillator2.stop();
            delete this.sounds.engineHum;
        }
    }

    // Turn sound
    playTurn() {
        if (!this.initialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Collision/crash sound
    playCrash() {
        if (!this.initialized) return;

        // Create noise for crash effect
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start();
        noise.stop(this.audioContext.currentTime + 0.5);

        // Add bass thump
        const bass = this.audioContext.createOscillator();
        const bassGain = this.audioContext.createGain();

        bass.type = 'sine';
        bass.frequency.setValueAtTime(60, this.audioContext.currentTime);
        bass.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.3);

        bassGain.gain.setValueAtTime(0.8, this.audioContext.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        bass.connect(bassGain);
        bassGain.connect(this.masterGain);

        bass.start();
        bass.stop(this.audioContext.currentTime + 0.3);
    }

    // Victory sound
    playVictory() {
        if (!this.initialized) return;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.value = freq;

                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }, i * 100);
        });
    }

    // UI click sound
    playClick() {
        if (!this.initialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 800;

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    // Countdown beep
    playCountdown(final = false) {
        if (!this.initialized) return;

        const frequency = final ? 1200 : 800;
        const duration = final ? 0.3 : 0.15;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'square';
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Speed increase sound
    playSpeedUp() {
        if (!this.initialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
}

// ===== TECHNO MUSIC SEQUENCER =====
class TechnoSequencer {
    constructor(audioContext, masterGain) {
        this.audioContext = audioContext;
        this.masterGain = masterGain;
        this.isPlaying = false;
        this.tempo = 128; // BPM
        this.beatLength = 60 / this.tempo;
        this.currentBeat = 0;
        this.schedulerInterval = null;
        this.musicGain = null;
    }

    start() {
        if (this.isPlaying || !this.audioContext) return;

        this.isPlaying = true;
        this.currentBeat = 0;

        // Create music gain node
        this.musicGain = this.audioContext.createGain();
        this.musicGain.gain.value = 0.15;
        this.musicGain.connect(this.masterGain);

        // Start the sequencer
        this.schedule();
    }

    stop() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        if (this.schedulerInterval) {
            clearTimeout(this.schedulerInterval);
        }

        if (this.musicGain) {
            this.musicGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        }
    }

    schedule() {
        if (!this.isPlaying) return;

        const now = this.audioContext.currentTime;
        const beatTime = now + 0.1;

        // Kick drum (every beat)
        if (this.currentBeat % 4 === 0) {
            this.playKick(beatTime);
        }

        // Hi-hat (every 2 beats)
        if (this.currentBeat % 2 === 0) {
            this.playHiHat(beatTime);
        }

        // Bass (pattern)
        if (this.currentBeat % 8 === 0 || this.currentBeat % 8 === 6) {
            this.playBass(beatTime, 40);
        } else if (this.currentBeat % 8 === 3) {
            this.playBass(beatTime, 50);
        }

        // Synth stabs (occasional)
        if (this.currentBeat % 16 === 0) {
            this.playSynth(beatTime, 220);
        } else if (this.currentBeat % 16 === 8) {
            this.playSynth(beatTime, 330);
        }

        this.currentBeat++;

        // Schedule next beat
        this.schedulerInterval = setTimeout(() => this.schedule(), this.beatLength * 1000);
    }

    playKick(time) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);

        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.15);
    }

    playHiHat(time) {
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        noise.start(time);
    }

    playBass(time, frequency) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.value = frequency;

        filter.type = 'lowpass';
        filter.frequency.value = 300;
        filter.Q.value = 5;

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.3);
    }

    playSynth(time, frequency) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.value = frequency;

        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + 0.2);
    }
}

// Create global sound system instance
const soundSystem = new SoundSystem();
