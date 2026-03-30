let audioContext: AudioContext | null = null;

export function playNotificationSound() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // iPhone tri-tone: three ascending notes
  const notes = [
    { freq: 1046.5, start: 0, duration: 0.12 },      // C6
    { freq: 1318.5, start: 0.14, duration: 0.12 },    // E6
    { freq: 1568.0, start: 0.28, duration: 0.18 },    // G6
  ];

  const now = audioContext.currentTime;

  for (const note of notes) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = note.freq;

    gain.gain.setValueAtTime(0, now + note.start);
    gain.gain.linearRampToValueAtTime(0.25, now + note.start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now + note.start);
    osc.stop(now + note.start + note.duration + 0.01);
  }
}
