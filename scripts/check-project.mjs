import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';

const root = new URL('../', import.meta.url);
const expected = ['breathe', 'nod_yes', 'shake_no', 'look_left', 'look_right', 'look_up', 'curious', 'ears', 'listen', 'bow', 'sway', 'stretch', 'blink', 'talk'];
for (const name of ['dist/app.js', 'dist/color-teaching.js', 'dist/color-teaching-data.js', 'dist/local-speech.js', 'dist/naming-scenes.js', 'dist/naming-rules.js', 'dist/naming-prototype.js', 'scripts/start-with-speech.mjs', 'dist/events-data.js', 'dist/matching-data.js', 'dist/object-matching.js', 'dist/pofidik-viewer.js', 'scripts/serve.mjs', 'scripts/pofidik-viewer-source.js']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(name, root))], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${name}: ${result.stderr}`);
}
const html = await readFile(new URL('dist/index.html', root), 'utf8');
assert.equal((html.match(/class="avatar-card"/g) || []).length, 4, 'Dört oyun arkadaşı korunmalı');
assert(!/data-avatar="mimo"|mimo-viewer\.js/.test(html), 'Eski Mimo artık uygulamada olmamalı');
assert(html.includes('./pofidik-viewer.js'));
for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)) await access(new URL(`dist/${match[1].slice(2)}`, root));
const data = await readFile(new URL('dist/assets/avatars/pofidik/model.glb', root));
const compressed = await readFile(new URL('dist/assets/avatars/pofidik/model.glb.gz', root));
assert(gunzipSync(compressed).equals(data), 'Sıkıştırılmış model onaylı modelle birebir aynı olmalı');
assert(compressed.length < data.length, 'Sıkıştırılmış model aktarımı küçültmeli');
assert.equal(data.readUInt32LE(0), 0x46546c67, 'GLB başlığı');
assert.equal(data.readUInt32LE(4), 2, 'GLB sürümü');
assert.equal(data.readUInt32LE(8), data.length, 'GLB uzunluğu');
const jsonLength = data.readUInt32LE(12);
const gltf = JSON.parse(data.subarray(20, 20 + jsonLength).toString('utf8').trim());
assert.deepEqual(gltf.animations.map(a => a.name).sort(), [...expected].sort(), 'Yalnızca istenen 14 animasyon olmalı');
assert((gltf.skins || []).some(skin => skin.joints.length === 49), '49 eklemli iskelet korunmalı');
assert((gltf.buffers || []).every(buffer => !buffer.uri), 'Model dış bir dosyaya bağımlı olmamalı');
assert((gltf.images || []).every(image => !image.uri || image.uri.startsWith('data:')), 'Dokular dosyanın içinde olmalı');
const manifest = JSON.parse(await readFile(new URL('dist/assets/avatars/pofidik/animations.json', root), 'utf8'));
assert.deepEqual(manifest.clips.map(c => c.name).sort(), [...expected].sort());
assert(data.length < 100 * 1024 * 1024, 'GitHub tek dosya sınırı');
console.log('OK: 4 karakter, Pofidik 14 animasyon, selamlar yok, yerel varlıklar tam, JavaScript geçerli.');
