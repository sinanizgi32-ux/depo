import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = process.argv[2] || fileURLToPath(new URL('../dist/assets/dijital-ozel-egitim-menu-muzigi.wav', import.meta.url));
const sampleRate = 22050;
const bpm = 128;
const beat = 60 / bpm;
const beats = 128;
const duration = beats * beat;
const totalSamples = Math.floor(duration * sampleRate);
const pcm = Buffer.alloc(totalSamples * 2);
const note = midi => 440 * 2 ** ((midi - 69) / 12);
const melody = [72,76,79,76,74,77,81,77,76,79,83,79,74,77,81,79];
const bass = [48,48,53,53,45,45,55,55];
let seed = 981723;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

function envelope(position, length, attack = .04, release = .25) {
  if (position < 0 || position >= length) return 0;
  const inGain = Math.min(1, position / attack);
  const outGain = Math.min(1, (length - position) / release);
  return Math.max(0, Math.min(inGain, outGain));
}

function softTone(freq, local, length) {
  const env = envelope(local, length, .025, .19);
  return env * (Math.sin(2 * Math.PI * freq * local) * .72 + Math.sin(2 * Math.PI * freq * 2 * local) * .2 + Math.sin(2 * Math.PI * freq * 3 * local) * .08);
}

for (let i = 0; i < totalSamples; i += 1) {
  const time = i / sampleRate;
  const beatPos = time / beat;
  const halfStep = Math.floor(beatPos * 2);
  const melodyLocal = time - halfStep * beat / 2;
  const melodyMidi = melody[halfStep % melody.length] + (Math.floor(halfStep / 32) % 2 ? 0 : 12);
  let value = softTone(note(melodyMidi), melodyLocal, beat * .46) * .23;

  const bassStep = Math.floor(beatPos / 2);
  const bassLocal = time - bassStep * beat * 2;
  value += softTone(note(bass[bassStep % bass.length]), bassLocal, beat * 1.7) * .13;

  const chordRoots = [60,65,57,67];
  const chordIndex = Math.floor(beatPos / 4) % chordRoots.length;
  const chordLocal = time - Math.floor(beatPos / 4) * beat * 4;
  const chordEnv = envelope(chordLocal, beat * 4, .28, .55) * .045;
  for (const interval of [0,4,7]) value += Math.sin(2 * Math.PI * note(chordRoots[chordIndex] + interval) * time) * chordEnv;

  const beatLocal = time - Math.floor(beatPos) * beat;
  if (beatLocal < .075) value += Math.sin(2 * Math.PI * (92 - beatLocal * 620) * beatLocal) * envelope(beatLocal, .075, .004, .055) * .15;
  const eighthLocal = time - Math.floor(beatPos * 2) * beat / 2;
  if (eighthLocal < .035) value += random() * envelope(eighthLocal, .035, .002, .025) * .025;

  const masterFade = Math.min(1, time / .08, (duration - time) / .08);
  const sample = Math.max(-1, Math.min(1, value * masterFade));
  pcm.writeInt16LE(Math.round(sample * 32767), i * 2);
}

const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(sampleRate, 24);
header.writeUInt32LE(sampleRate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.concat([header, pcm]));
console.log(JSON.stringify({ output, duration, sampleRate }));
