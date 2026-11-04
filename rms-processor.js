// AudioWorklet: 128샘플 블록 RMS를 모아 약 512샘플(~11ms)마다 메인 스레드로 전달 (오디오 원본은 전달/업로드하지 않음)
class RmsProcessor extends AudioWorkletProcessor {
  constructor() { super(); this.sum = 0; this.n = 0; this.peak = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) { const v = ch[i]; this.sum += v * v; const a = v < 0 ? -v : v; if (a > this.peak) this.peak = a; }
      this.n += ch.length;
      if (this.n >= 512) { this.port.postMessage({ rms: Math.sqrt(this.sum / this.n), peak: this.peak }); this.sum = 0; this.n = 0; this.peak = 0; }
    }
    return true;
  }
}
registerProcessor('rms-processor', RmsProcessor);
