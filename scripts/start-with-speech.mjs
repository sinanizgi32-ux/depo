import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundled=path.join(process.env.USERPROFILE||'', '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe');
const python=process.env.NAMING_PYTHON||(existsSync(bundled)?bundled:'python');
let speech,characterVoice,voicePreparation;
const voicePython=path.join(root,".voice-runtime","Scripts","python.exe");
if(existsSync(voicePython)){try{await fetch("http://127.0.0.1:4182/api/voice-status",{signal:AbortSignal.timeout(1000)});}catch{characterVoice=spawn(voicePython,["scripts/serve-character-voices.py"],{cwd:root,stdio:"inherit",windowsHide:true});characterVoice.on("error",()=>console.error("Karakter ses hizmeti başlatılamadı."));}}
if(existsSync(voicePython)){voicePreparation=spawn(process.execPath,['scripts/prepare-character-audio.mjs'],{cwd:root,stdio:'inherit',windowsHide:true});voicePreparation.on('error',()=>console.error('Sabit karakter kayıtları hazırlanamadı.'));}
try {
 const response=await fetch('http://127.0.0.1:4181/api/status',{signal:AbortSignal.timeout(1500)});
 if(!response.ok)throw new Error('unavailable');
} catch {
 speech=spawn(python,['scripts/serve-naming.py'],{cwd:root,stdio:'inherit',windowsHide:true});
 speech.on('error',()=>console.error('Dinleme açılamadı. Python ve requirements-speech.txt bağımlılıklarını kontrol edin.'));
}
const web=spawn(process.execPath,['scripts/serve.mjs',...process.argv.slice(2)],{cwd:root,stdio:'inherit',windowsHide:true});
const stop=()=>{speech?.kill();voicePreparation?.kill();characterVoice?.kill();web.kill();};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
web.on('exit',code=>{speech?.kill();voicePreparation?.kill();characterVoice?.kill();process.exitCode=code||0;});
