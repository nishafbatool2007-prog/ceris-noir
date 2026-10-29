/**
 * Web Audio Engine for AuraLavande Music
 * Supports real audio streaming (HTML5 Audio connected to Web Audio filters)
 * as well as generative Web Audio synthesis for offline/ambient fallback.
 * Connects to AnalyserNode for real-time visualizer canvas rendering.
 */

import { EqualizerSettings, Track } from '../types/music';

// Musical notes frequencies in Hz for Web Audio synthesis fallback
const NOTE_FREQS: Record<string, number[]> = {
  'Db Major': [138.59, 174.61, 207.65, 277.18, 349.23, 415.30, 554.37],
  'Ab Major': [207.65, 261.63, 311.13, 415.30, 523.25, 622.25],
  'F Minor':  [174.61, 207.65, 261.63, 349.23, 415.30, 523.25],
  'C Minor':  [130.81, 155.56, 196.00, 261.63, 311.13, 392.00],
  'E Major':  [164.81, 207.65, 246.94, 329.63, 415.30, 493.88],
  'A Minor':  [110.00, 130.81, 164.81, 220.00, 261.63, 329.63],
  'D Major':  [146.83, 185.00, 220.00, 293.66, 369.99, 440.00],
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bassFilter: BiquadFilterNode | null = null;
  private midFilter: BiquadFilterNode | null = null;
  private trebleFilter: BiquadFilterNode | null = null;
  public analyser: AnalyserNode | null = null;

  // Real audio element streaming
  private audioEl: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;
  private isStreamPlaying: boolean = false;

  // Active synthesizers and loops
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private playbackTime: number = 0;
  private timerInterval: any = null;
  private synthLoopId: any = null;
  private activeVoices: OscillatorNode[] = [];

  // Ambient sound layers
  private vinylGain: GainNode | null = null;
  private vinylNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private rainNode: AudioBufferSourceNode | null = null;

  // Listeners
  private onTimeUpdateCallbacks: Set<(currentTime: number) => void> = new Set();
  private onStateChangeCallbacks: Set<(playing: boolean) => void> = new Set();

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);

    // 3-band Equalizer
    this.bassFilter = this.ctx.createBiquadFilter();
    this.bassFilter.type = 'lowshelf';
    this.bassFilter.frequency.setValueAtTime(250, this.ctx.currentTime);
    this.bassFilter.gain.setValueAtTime(0, this.ctx.currentTime);

    this.midFilter = this.ctx.createBiquadFilter();
    this.midFilter.type = 'peaking';
    this.midFilter.frequency.setValueAtTime(1500, this.ctx.currentTime);
    this.midFilter.Q.setValueAtTime(1, this.ctx.currentTime);
    this.midFilter.gain.setValueAtTime(0, this.ctx.currentTime);

    this.trebleFilter = this.ctx.createBiquadFilter();
    this.trebleFilter.type = 'highshelf';
    this.trebleFilter.frequency.setValueAtTime(4500, this.ctx.currentTime);
    this.trebleFilter.gain.setValueAtTime(0, this.ctx.currentTime);

    // Analyser for real-time visualization
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.85;

    // Route graph: inputs -> bass -> mid -> treble -> masterGain -> analyser -> destination
    this.bassFilter.connect(this.midFilter);
    this.midFilter.connect(this.trebleFilter);
    this.trebleFilter.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    this.initAmbientNodes();
  }

  private initAmbientNodes() {
    if (!this.ctx || !this.masterGain) return;

    // Generate vinyl crackle buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const vinylBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const vData = vinylBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.002) {
        vData[i] = (Math.random() * 2 - 1) * 0.4;
      } else {
        vData[i] = (Math.random() * 2 - 1) * 0.015;
      }
    }

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.vinylGain.connect(this.masterGain);

    this.vinylNode = this.ctx.createBufferSource();
    this.vinylNode.buffer = vinylBuffer;
    this.vinylNode.loop = true;
    this.vinylNode.start();

    // Generate rain noise buffer
    const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const rData = rainBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      rData[i] = (lastOut + 0.02 * white) / 1.02; // pinkish rain noise
      lastOut = rData[i];
    }

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(900, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    this.rainNode = this.ctx.createBufferSource();
    this.rainNode.buffer = rainBuffer;
    this.rainNode.loop = true;
    this.rainNode.start();
  }

  public async playTrack(track: Track, startTime: number = 0) {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.stopPlayback();
    this.currentTrack = track;
    this.playbackTime = startTime;
    this.isPlaying = true;
    this.notifyState();

    // Check if track has an audio URL stream (e.g. Karan Aujla - For A Reason)
    if (track.audioUrl) {
      this.playRealAudioStream(track.audioUrl, startTime);
    } else {
      this.startMusicSynthesis();

      // Start synth playback timer
      this.timerInterval = setInterval(() => {
        if (!this.isPlaying || !this.currentTrack) return;
        this.playbackTime += 0.5;
        if (this.playbackTime >= this.currentTrack.duration) {
          this.playbackTime = 0;
        }
        this.notifyTime();
      }, 500);
    }
  }

  private playRealAudioStream(url: string, startTime: number) {
    if (!this.ctx || !this.bassFilter) return;

    this.isStreamPlaying = true;
    this.audioEl = new Audio();
    // Do not force anonymous crossOrigin to prevent CORS block on external media hosts
    this.audioEl.src = url;

    this.audioEl.addEventListener('canplay', () => {
      if (this.audioEl && startTime > 0 && Math.abs(this.audioEl.currentTime - startTime) > 1) {
        this.audioEl.currentTime = startTime;
      }
    });

    this.audioEl.addEventListener('timeupdate', () => {
      if (this.audioEl) {
        this.playbackTime = this.audioEl.currentTime;
        this.notifyTime();
      }
    });

    this.audioEl.addEventListener('ended', () => {
      this.isPlaying = false;
      this.notifyState();
    });

    this.audioEl.addEventListener('error', (e) => {
      console.warn('Audio stream error, switching to audio synthesis:', e);
      this.isStreamPlaying = false;
      this.startMusicSynthesis();
    });

    try {
      if (this.ctx && !this.mediaSourceNode) {
        this.mediaSourceNode = this.ctx.createMediaElementSource(this.audioEl);
        this.mediaSourceNode.connect(this.bassFilter);
      }
    } catch (e) {
      // Audio source may already be connected or CORS restricted
    }

    this.audioEl.play().catch((err) => {
      console.warn('Audio stream play fallback:', err);
      this.isStreamPlaying = false;
      this.startMusicSynthesis();
    });
  }

  private startMusicSynthesis() {
    if (!this.ctx || !this.bassFilter || !this.currentTrack) return;

    const scale = NOTE_FREQS[this.currentTrack.musicalKey] || NOTE_FREQS['Db Major'];
    const bpm = this.currentTrack.bpm || 80;
    const beatInterval = (60 / bpm) * 1000;

    let step = 0;

    const playChordStep = () => {
      if (!this.isPlaying || !this.ctx || !this.bassFilter) return;

      const now = this.ctx.currentTime;
      const rootNote = scale[step % scale.length];
      const chordNotes = [
        rootNote,
        scale[(step + 2) % scale.length],
        scale[(step + 4) % scale.length],
      ];

      chordNotes.forEach((freq, idx) => {
        if (!this.ctx || !this.bassFilter) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        if (this.currentTrack?.genre.includes('Lo-Fi')) {
          osc.type = 'sine';
        } else if (this.currentTrack?.genre.includes('Ambient')) {
          osc.type = idx === 0 ? 'sine' : 'triangle';
        } else {
          osc.type = 'triangle';
        }

        osc.frequency.setValueAtTime(freq * (idx === 0 ? 0.5 : 1), now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.07 / (idx + 1), now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (beatInterval / 1000) * 2.5);

        osc.connect(gain);
        gain.connect(this.bassFilter);

        osc.start(now);
        osc.stop(now + (beatInterval / 1000) * 2.8);
        this.activeVoices.push(osc);
      });

      if (step % 2 === 0) {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();
        arpOsc.type = 'sine';
        const arpFreq = scale[(step * 3) % scale.length] * 2;
        arpOsc.frequency.setValueAtTime(arpFreq, now + 0.3);

        arpGain.gain.setValueAtTime(0.001, now + 0.3);
        arpGain.gain.exponentialRampToValueAtTime(0.04, now + 0.4);
        arpGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        arpOsc.connect(arpGain);
        arpGain.connect(this.bassFilter);
        arpOsc.start(now + 0.3);
        arpOsc.stop(now + 1.3);
        this.activeVoices.push(arpOsc);
      }

      step++;
      this.synthLoopId = setTimeout(playChordStep, beatInterval);
    };

    playChordStep();
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopPlayback(false);
    this.notifyState();
  }

  public resume() {
    if (!this.currentTrack) return;
    this.isPlaying = true;
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.audioEl && this.isStreamPlaying) {
      this.audioEl.play().catch(() => {});
    } else {
      this.startMusicSynthesis();
      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          if (!this.isPlaying || !this.currentTrack) return;
          this.playbackTime += 0.5;
          if (this.playbackTime >= this.currentTrack.duration) {
            this.playbackTime = 0;
          }
          this.notifyTime();
        }, 500);
      }
    }
    this.notifyState();
  }

  public seek(seconds: number) {
    this.playbackTime = Math.max(0, Math.min(seconds, this.currentTrack?.duration || 300));
    if (this.audioEl) {
      this.audioEl.currentTime = this.playbackTime;
    }
    this.notifyTime();
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(volume, 1)), this.ctx.currentTime);
    }
    if (this.audioEl) {
      this.audioEl.volume = Math.max(0, Math.min(volume, 1));
    }
  }

  public applyEqualizer(eq: EqualizerSettings) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.bassFilter) this.bassFilter.gain.setValueAtTime(eq.bass, now);
    if (this.midFilter) this.midFilter.gain.setValueAtTime(eq.mid, now);
    if (this.trebleFilter) this.trebleFilter.gain.setValueAtTime(eq.treble, now);

    if (this.vinylGain) {
      this.vinylGain.gain.setValueAtTime((eq.vinylNoise / 100) * 0.15, now);
    }
    if (this.rainGain) {
      this.rainGain.gain.setValueAtTime((eq.rainSound / 100) * 0.25, now);
    }
  }

  private stopPlayback(resetTime: boolean = true) {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
      this.audioEl = null;
    }
    this.isStreamPlaying = false;

    if (this.synthLoopId) {
      clearTimeout(this.synthLoopId);
      this.synthLoopId = null;
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.activeVoices.forEach((voice) => {
      try {
        voice.stop();
        voice.disconnect();
      } catch (e) {
        // Voice might already have ended
      }
    });
    this.activeVoices = [];

    if (resetTime) {
      this.playbackTime = 0;
    }
  }

  public getVisualizerData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64);
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  public subscribeTime(cb: (time: number) => void) {
    this.onTimeUpdateCallbacks.add(cb);
    return () => this.onTimeUpdateCallbacks.delete(cb);
  }

  public subscribeState(cb: (playing: boolean) => void) {
    this.onStateChangeCallbacks.add(cb);
    return () => this.onStateChangeCallbacks.delete(cb);
  }

  private notifyTime() {
    this.onTimeUpdateCallbacks.forEach((cb) => cb(this.playbackTime));
  }

  private notifyState() {
    this.onStateChangeCallbacks.forEach((cb) => cb(this.isPlaying));
  }

  public getCurrentTime(): number {
    return this.playbackTime;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioEngine = new AudioEngine();
