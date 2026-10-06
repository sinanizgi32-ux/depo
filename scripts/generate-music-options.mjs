import fs from 'node:fs';
const sr=22050;
for(const [id,duration,bpm,melody] of [['steps',90,104,[72,76,79,76,74,77,81,79]]]){
 const n=sr*duration,pcm=Buffer.alloc(n*2),beat=60/bpm,f=m=>440*2**((m-69)/12);
 for(let i=0;i<n;i++){const t=i/sr,step=Math.floor(t/beat),u=t-step*beat,section=Math.floor(t/(beat*32));const midi=melody[(step+section*2)%melody.length]+(section%3===2?-12:0);let v=Math.sin(2*Math.PI*f(midi)*u)*Math.exp(-u*(id==='garden'?2.5:7))*Math.min(1,u/.012)*.19;v+=Math.sin(2*Math.PI*f(midi)*2*u)*Math.exp(-u*12)*.025;const roots=[48,53,45,55],root=roots[Math.floor(step/8)%4];for(const k of [12,16,19])v+=Math.sin(2*Math.PI*f(root+k)*t)*.023*Math.sin(Math.PI*(t%(beat*8))/(beat*8));v+=Math.sin(2*Math.PI*f(root)*t)*.05;v*=Math.min(1,t/2,(duration-t)/3);pcm.writeInt16LE(Math.round(v*32767),i*2);}
 const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(pcm.length+36,4);h.write('WAVE',8);h.write('fmt ',12);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(sr,24);h.writeUInt32LE(sr*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);fs.mkdirSync('dist/assets/music',{recursive:true});fs.writeFileSync(`dist/assets/music/${id}.wav`,Buffer.concat([h,pcm]));console.log(id,duration);
}

await import('./differentiate-menu-music.mjs');
