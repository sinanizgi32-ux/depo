import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const bundled=path.join(process.env.USERPROFILE||'', '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe');
const python=process.env.NAMING_PYTHON||(existsSync(bundled)?bundled:'python');
let speech;
try {
 const response=await fetch('http://127.0.0.1:4181/api/status',{signal:AbortSignal.timeout(1500)});
 if(!response.ok)throw new Error('unavailable');
} catch {
 speech=spawn(python,['scripts/serve-naming.py'],{cwd:root,stdio:'inherit',windowsHide:true});
 speech.on('error',()=>console.error('Dinleme açılamadı. Python ve requirements-speech.txt bağımlılıklarını kontrol edin.'));
}
const web=spawn(process.execPath,['scripts/serve.mjs',...process.argv.slice(2)],{cwd:root,stdio:'inherit',windowsHide:true});
const stop=()=>{speech?.kill();web.kill();};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
web.on('exit',code=>{speech?.kill();process.exitCode=code||0;});
