/**
 * Vedic Chanting & Sanskrit Prosody Synthesis Engine
 * Combines Web Speech Synthesis with an authentic Web Audio API Tanpura Drone
 * and Svara intonation cadence.
 */

export interface ChantAudioState {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  currentSegment: string;
  speed: number;
  droneEnabled: boolean;
}

class VedicChantSynthesizer {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private tanpuraNodes: {
    masterGain?: GainNode;
    oscillators?: OscillatorNode[];
  } = {};
  private listeners: Set<(state: ChantAudioState) => void> = new Set();
  
  private state: ChantAudioState = {
    isPlaying: false,
    isPaused: false,
    progress: 0,
    currentSegment: "",
    speed: 0.9, // Traditional measured Adhyayana pace
    droneEnabled: true,
  };

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(callback: (state: ChantAudioState) => void): () => void {
    this.listeners.add(callback);
    callback(this.state);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.state }));
  }

  /**
   * Initialize and start ambient Tanpura harmonic drone using Web Audio API
   */
  private startTanpuraDrone() {
    if (!this.state.droneEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx || this.audioCtx.state === "closed") {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      this.stopTanpuraDrone();

      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      // Soft gentle fade in to meditative volume
      masterGain.gain.exponentialRampToValueAtTime(0.06, this.audioCtx.currentTime + 1.2);
      masterGain.connect(this.audioCtx.destination);

      const oscillators: OscillatorNode[] = [];
      // Classical Indian Sa-Pa Tanpura Frequencies (Tuned around C3 / 130.81 Hz and G3 / 196 Hz)
      const baseFreqs = [130.81, 196.0, 261.63, 130.81 * 0.5];

      baseFreqs.forEach((freq, idx) => {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const filter = this.audioCtx.createBiquadFilter();
        const gain = this.audioCtx.createGain();

        // Warm harmonic overtone filter
        filter.type = "bandpass";
        filter.frequency.value = freq * 1.5;
        filter.Q.value = 3.0;

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq + (idx === 0 ? 0.3 : -0.2), this.audioCtx.currentTime);

        // Subtle slow amplitude breathing
        gain.gain.setValueAtTime(0.35, this.audioCtx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        oscillators.push(osc);
      });

      this.tanpuraNodes = { masterGain, oscillators };
    } catch (e) {
      console.warn("Vedic Tanpura Audio synthesis not available on this device", e);
    }
  }

  private stopTanpuraDrone() {
    try {
      if (this.tanpuraNodes.masterGain && this.audioCtx) {
        this.tanpuraNodes.masterGain.gain.exponentialRampToValueAtTime(
          0.0001,
          this.audioCtx.currentTime + 0.6
        );
        setTimeout(() => {
          this.tanpuraNodes.oscillators?.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch (_) {}
          });
          this.tanpuraNodes = {};
        }, 650);
      }
    } catch (_) {}
  }

  /**
   * Convert Sanskrit / IAST / Devanagari text into natural prosodic chant segments
   */
  public prepareVedicRecitationText(rawText: string): string {
    if (!rawText) return "";
    return rawText
      .replace(/[\n\r]+/g, " । ")
      .replace(/॥/g, " ॥ ")
      .replace(/\|\|/g, " ॥ ")
      .replace(/\|/g, " । ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Select best available voice for Sanskrit / Indian chanting
   */
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    // Preference hierarchy: Sanskrit, Hindi, Marathi, Bengali, Telugu, Indian English
    const prefLanguages = ["sa", "hi", "mr", "bn", "te", "ta", "kn", "gu", "en-IN", "hi-IN"];

    for (const lang of prefLanguages) {
      const matched = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(lang.toLowerCase()) ||
          v.name.toLowerCase().includes("india") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("sanskrit")
      );
      if (matched) return matched;
    }

    // Fallback to default or first available voice
    return voices.find((v) => v.default) || voices[0] || null;
  }

  /**
   * Chant / Play Sanskrit Verse aloud
   */
  public chant(verseText: string, speedOverride?: number) {
    if (!this.synth) {
      console.warn("Speech synthesis is not supported in this browser.");
      return;
    }

    this.stop();

    const cleanText = this.prepareVedicRecitationText(verseText);
    if (!cleanText) return;

    this.startTanpuraDrone();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = this.getBestVoice();
    if (voice) {
      utterance.voice = voice;
      if (voice.lang) {
        utterance.lang = voice.lang;
      }
    }

    const currentSpeed = speedOverride !== undefined ? speedOverride : this.state.speed;
    utterance.rate = currentSpeed;
    utterance.pitch = 0.95; // Resonant lower meditative pitch
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.currentSegment = cleanText;
      this.notify();
    };

    utterance.onpause = () => {
      this.state.isPaused = true;
      this.notify();
    };

    utterance.onresume = () => {
      this.state.isPaused = false;
      this.notify();
    };

    utterance.onend = () => {
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.state.progress = 100;
      this.stopTanpuraDrone();
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn("Chant playback error:", e);
      this.state.isPlaying = false;
      this.state.isPaused = false;
      this.stopTanpuraDrone();
      this.notify();
    };

    utterance.onboundary = (event) => {
      if (event.name === "word" && cleanText.length > 0) {
        const percent = Math.min(100, Math.round((event.charIndex / cleanText.length) * 100));
        this.state.progress = percent;
        this.notify();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state.isPlaying && !this.state.isPaused) {
      this.synth.pause();
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.state.isPlaying && this.state.isPaused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.stopTanpuraDrone();
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.progress = 0;
    this.currentUtterance = null;
    this.notify();
  }

  public setSpeed(speed: number) {
    this.state.speed = speed;
    if (this.state.isPlaying && this.currentUtterance) {
      // Re-chant with new speed
      const text = this.state.currentSegment;
      this.chant(text, speed);
    } else {
      this.notify();
    }
  }

  public toggleDrone() {
    this.state.droneEnabled = !this.state.droneEnabled;
    if (this.state.isPlaying) {
      if (this.state.droneEnabled) {
        this.startTanpuraDrone();
      } else {
        this.stopTanpuraDrone();
      }
    }
    this.notify();
  }

  public getState(): ChantAudioState {
    return { ...this.state };
  }
}

export const vedicChantSynthesizer = new VedicChantSynthesizer();
