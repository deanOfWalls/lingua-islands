import { AUDIO_NORMAL_PLAYBACK, AUDIO_SLOW_PLAYBACK } from '../constants.js';
/** Plays pre-generated neural MP3s (edge-tts) with browser TTS fallback. */
export class AudioService {
    constructor(synth = window.speechSynthesis) {
        this.currentAudio = null;
        this.synth = synth;
    }
    speakSentence(sentence, pace = 'normal') {
        const url = sentence.audioUrl?.trim();
        if (url) {
            const rate = pace === 'slow' ? AUDIO_SLOW_PLAYBACK : AUDIO_NORMAL_PLAYBACK;
            void this.playFile(url, rate);
            return;
        }
        const text = sentence.ttsText?.trim() || sentence.hanzi;
        this.speakHanzi(text, pace === 'slow' ? 0.55 : 0.85);
    }
    speakHanzi(text, rate = 0.85) {
        if (!this.synth)
            return;
        this.stopSynth();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[。！？，、]/g, ''));
        utterance.lang = 'zh-CN';
        utterance.rate = rate;
        this.synth.speak(utterance);
    }
    stop() {
        this.stopSynth();
        this.stopFile();
    }
    stopSynth() {
        this.synth?.cancel();
    }
    stopFile() {
        if (!this.currentAudio)
            return;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
    }
    playFile(url, playbackRate) {
        this.stop();
        const audio = new Audio(url);
        this.currentAudio = audio;
        const applyRate = () => {
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
//# sourceMappingURL=AudioService.js.map