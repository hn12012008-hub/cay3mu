// Web Audio API Synthesizer for Mechanical Engine & Gearbox sound effects
class MechanicalAudio {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = true;
        this.engineGain = null;
        this.gearGain = null;
        this.osc1 = null;
        this.osc2 = null;
        this.gearOsc = null;
        this.filter = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.3;
        this.masterGain.connect(this.ctx.destination);

        // Low pass filter for deep combustion thumps
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 400;
        this.filter.Q.value = 3;
        this.filter.connect(this.masterGain);

        // Engine sound nodes
        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.value = 0.5;
        this.engineGain.connect(this.filter);

        // Oscillators for engine rumble
        this.osc1 = this.ctx.createOscillator();
        this.osc1.type = 'sawtooth';
        this.osc1.frequency.value = 20;

        this.osc2 = this.ctx.createOscillator();
        this.osc2.type = 'triangle';
        this.osc2.frequency.value = 10;

        this.osc1.connect(this.engineGain);
        this.osc2.connect(this.engineGain);

        this.osc1.start();
        this.osc2.start();

        // Gearbox whining sound
        this.gearGain = this.ctx.createGain();
        this.gearGain.gain.value = 0.05;
        this.gearGain.connect(this.masterGain);

        this.gearOsc = this.ctx.createOscillator();
        this.gearOsc.type = 'sine';
        this.gearOsc.frequency.value = 120;
        this.gearOsc.connect(this.gearGain);
        this.gearOsc.start();
    }

    toggleMute() {
        if (!this.ctx) {
            this.init();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    updateEngineSound(rpm, strokePhase) {
        if (!this.ctx || this.isMuted || rpm <= 0) {
            if (this.engineGain) this.engineGain.gain.value = 0;
            return;
        }

        // Base frequency directly proportional to RPM
        const baseFreq = Math.max(12, (rpm / 60) * 1.5);
        this.osc1.frequency.setTargetAtTime(baseFreq, this.ctx.currentTime, 0.03);
        this.osc2.frequency.setTargetAtTime(baseFreq * 0.5, this.ctx.currentTime, 0.03);

        // Filter cutoff rises with RPM
        const cutoff = 150 + (rpm / 3000) * 800;
        this.filter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 0.03);

        this.engineGain.gain.setTargetAtTime(0.4, this.ctx.currentTime, 0.05);
        if (this.gearGain) this.gearGain.gain.setTargetAtTime(0.01, this.ctx.currentTime, 0.05);
    }

    updateGearSound(rpm) {
        if (!this.ctx || this.isMuted || rpm <= 0) {
            if (this.gearGain) this.gearGain.gain.value = 0;
            return;
        }
        const gearFreq = 80 + (rpm / 3000) * 500;
        this.gearOsc.frequency.setTargetAtTime(gearFreq, this.ctx.currentTime, 0.03);
        if (this.gearGain) this.gearGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.05);
        if (this.engineGain) this.engineGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.05);
    }

    playSparkSound() {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        snap.type = 'highpass';
        snap.frequency.value = 2500;
        snapGain.gain.setValueAtTime(0.3, now);
        snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        snap.connect(snapGain);
        snapGain.connect(this.masterGain);
        snap.start(now);
        snap.stop(now + 0.05);
    }
}

window.MechanicalAudio = MechanicalAudio;
