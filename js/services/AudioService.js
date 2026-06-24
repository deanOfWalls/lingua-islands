/** Browser speech synthesis for Mandarin audio. */
export class AudioService {
    constructor(synth = window.speechSynthesis) {
        this.synth = synth;
    }
    speakHanzi(text, rate = 0.85) {
        if (!this.synth)
            return;
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[。！？，、]/g, ''));
        utterance.lang = 'zh-CN';
        utterance.rate = rate;
        this.synth.speak(utterance);
    }
    stop() {
        this.synth?.cancel();
    }
}
//# sourceMappingURL=AudioService.js.map