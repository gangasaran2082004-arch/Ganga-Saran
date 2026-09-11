// Tarang Web Audio Synthesizer & Sound FX Engine
// Generates royalty-free, zero-network-dependent audio tracks and sound effects

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrackType: string | null = null;
  private intervalId: any = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play button click haptic tick
  public playClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // Heart like pop sound
  public playHeartSound() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  // Start continuous rhythmic background music tailored by category
  public startBackgroundTrack(category: string) {
    this.stopBackgroundTrack();
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.currentTrackType = category;

    // Melodic notes depending on category
    let notes = [261.63, 329.63, 392.0, 523.25]; // C, E, G, C
    let tempo = 300; // ms

    if (category === 'comedy') {
      notes = [329.63, 392.0, 493.88, 587.33]; // Quirky E minor
      tempo = 240;
    } else if (category === 'music' || category === 'punjabi') {
      notes = [196.0, 246.94, 293.66, 392.0, 440.0]; // Punchy high bass
      tempo = 180;
    } else if (category === 'romance') {
      notes = [220.0, 261.63, 329.63, 440.0]; // Gentle A minor acoustic
      tempo = 450;
    }

    let noteIdx = 0;
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      try {
        const freq = notes[noteIdx % notes.length];
        noteIdx++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = category === 'comedy' ? 'square' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const volume = category === 'comedy' ? 0.04 : 0.06;
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempo / 1000) * 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + (tempo / 1000) * 0.8);
      } catch (e) {}
    }, tempo);
  }

  public stopBackgroundTrack() {
    this.isPlaying = false;
    this.currentTrackType = null;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public isTrackPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
