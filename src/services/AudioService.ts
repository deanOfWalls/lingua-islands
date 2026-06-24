import { AUDIO_NORMAL_PLAYBACK, AUDIO_SLOW_PLAYBACK } from '../constants.js';
import type { Sentence } from '../types/index.js';

export type SpeechPace = 'normal' | 'slow';

/** Plays pre-generated neural MP3s (edge-tts) with browser TTS fallback. */
export class AudioService {
  private readonly synth: SpeechSynthesis | null;
  private currentAudio: HTMLAudioElement | null = null;

  constructor(synth: SpeechSynthesis | null = window.speechSynthesis) {
    this.synth = synth;
  }

  speakSentence(sentence: Sentence, pace: SpeechPace = 'normal'): void {
    const url = sentence.audioUrl?.trim();
    if (url) {
      const rate = pace === 'slow' ? AUDIO_SLOW_PLAYBACK : AUDIO_NORMAL_PLAYBACK;
      void this.playFile(url, rate);
      return;
    }
    const text = sentence.ttsText?.trim() || sentence.hanzi;
    this.speakHanzi(text, pace === 'slow' ? 0.55 : 0.85);
  }

  speakHanzi(text: string, rate = 0.85): void {
    if (!this.synth) return;
    this.stopSynth();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[。！？，、]/g, ''));
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    this.synth.speak(utterance);
  }

  stop(): void {
    this.stopSynth();
    this.stopFile();
  }

  private stopSynth(): void {
    this.synth?.cancel();
  }

  private stopFile(): void {
    if (!this.currentAudio) return;
    this.currentAudio.pause();
    this.currentAudio.currentTime = 0;
    this.currentAudio = null;
  }

  private playFile(url: string, playbackRate: number): Promise<void> {
    this.stop();
    const audio = new Audio(url);
    this.currentAudio = audio;

    const applyRate = (): void => {
      audio.defaultPlaybackRate = playbackRate;
      audio.playbackRate = playbackRate;
    };

    applyRate();
    audio.addEventListener('loadedmetadata', applyRate, { once: true });

    return audio.play().catch(() => {
      this.currentAudio = null;
    });
  }
}
