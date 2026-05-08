export function playTone(type = "tap") {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const tones = {
    tap: [520, 0.05],
    success: [740, 0.12],
    error: [180, 0.12],
  };
  const [frequency, duration] = tones[type] || tones.tap;

  oscillator.frequency.value = frequency;
  oscillator.type = type === "error" ? "sawtooth" : "sine";
  gain.gain.setValueAtTime(0.04, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}
