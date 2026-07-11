// Tiny dependency-free 8-bit "blip" sound generator using the Web Audio API.
// Avoids shipping binary sound assets — everything is synthesized on the fly.

let ctx;
function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  return ctx;
}

export function blip({ freq = 620, duration = 0.06, type = "square", volume = 0.05 } = {}) {
  try {
    const audioCtx = getCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Silently ignore — audio isn't critical to functionality
  }
}

export const sfx = {
  click: () => blip({ freq: 720, duration: 0.05 }),
  success: () => {
    blip({ freq: 520, duration: 0.08 });
    setTimeout(() => blip({ freq: 780, duration: 0.1 }), 90);
  },
  type: () => blip({ freq: 880 + Math.random() * 200, duration: 0.02, volume: 0.02 }),
  swap: () => blip({ freq: 300, duration: 0.05, type: "triangle" })
};
