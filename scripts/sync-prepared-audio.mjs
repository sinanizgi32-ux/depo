import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {voiceBankReader} from './voice-bank-files.mjs';
import {fileURLToPath} from 'node:url';
const run=promisify(execFile),root=fileURLToPath(new URL('../',import.meta.url));
const checkout=process.argv.find(a=>a.startsWith('--checkout='))?.slice(11);
if(!checkout||!path.isAbsolute(checkout)||path.resolve(checkout)===path.resolve(root))throw Error('Provide the existing GitHub checkout.');
const stageOnly=process.argv.includes('--stage-only');
const git=async args=>(await run('git',args,{cwd:checkout,maxBuffer:1048576})).stdout.trim();
if(await git(['remote','get-url','origin'])!=='https://github.com/sinanizgi32-ux/depo.git')throw Error('Unexpected remote.');
if(!stageOnly&&await git(['status','--porcelain']))throw Error('Checkout has unsaved changes; publication retained for review.');
const {bank,invalid}=await voiceBankReader()();if(invalid.length)throw Error('Invalid WAVs cannot be published.');
const relative='dist/assets/character-voices/ready',target=path.join(checkout,relative);
await fs.mkdir(target,{recursive:true});
let copied=0;
for(const url of new Set(Object.values(bank).flatMap(Object.values))){
 const name=path.basename(url),source=path.join(root,relative,name),dest=path.join(target,name),a=await fs.stat(source);let b;try{b=await fs.stat(dest);}catch{}
 if(!b||a.size!==b.size||a.mtimeMs>b.mtimeMs){await fs.copyFile(source,dest);copied++;}
}
await fs.writeFile(path.join(target,'manifest.json'),JSON.stringify(bank));
for(const name of ['greeting-parts.json','quality.json'])await fs.copyFile(path.join(root,relative,name),path.join(target,name));
await git(['add','--',relative]);
if(stageOnly){console.log(JSON.stringify({copied,staged:true}));process.exit(0);}
if(await git(['diff','--cached','--name-only'])){await git(['commit','--quiet','-m','Update prepared teacher audio bank']);await git(['push','origin','main']);}
console.log(JSON.stringify({copied,commit:await git(['rev-parse','HEAD'])}));
