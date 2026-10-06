import {readFile,writeFile} from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const url=new URL('../dist/assets/avatars/pofidik/model.glb',import.meta.url);
const model=await readFile(url);
const compressed=gzipSync(model,{level:9});
assert.deepEqual(gunzipSync(compressed),model);
await writeFile(new URL('../dist/assets/avatars/pofidik/model.glb.gz',import.meta.url),compressed);
console.log(`Pofidik aktarımı: ${model.length} → ${compressed.length} bayt; model değişmedi.`);
