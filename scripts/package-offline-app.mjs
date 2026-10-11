import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-release-audio.mjs'],{stdio:'inherit'});
const bankRoot=path.resolve('dist/assets/character-voices/ready'),bank=JSON.parse(await fs.readFile(path.join(bankRoot,'manifest.json'),'utf8'));
const retained=new Set(Object.values(bank).flatMap(entries=>Object.values(entries)).map(url=>path.basename(url)));
try{const parts=JSON.parse(await fs.readFile(path.join(bankRoot,'greeting-parts.json'),'utf8'));for(const entries of Object.values(parts))for(const urls of Object.values(entries))for(const url of urls)retained.add(path.basename(url));}catch{}
const dest=path.resolve('outputs/release-'+Date.now()+'/www');
await fs.cp('dist',dest,{recursive:true,filter:source=>{if(source.endsWith('-reference.wav'))return false;const rel=path.relative(bankRoot,source);if(rel&&!rel.startsWith('..')&&!path.isAbsolute(rel))return retained.has(path.basename(source))||['manifest.json','greeting-parts.json','static-phrases.json'].includes(path.basename(source));return true;}});
console.log('Offline web assets with complete audio copied to '+dest);
