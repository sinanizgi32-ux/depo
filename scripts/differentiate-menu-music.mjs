import fs from 'node:fs';
import crypto from 'node:crypto';
const preserved=fs.readFileSync('dist/assets/music/steps.wav');
const sr=22050, hz=m=>440*2**((m-69)/12);
function write(id,duration,events){const samples=new Float64Array(sr*duration);for(const e of events){const start=Math.floor(e.t*sr),len=Math.min(Math.floor(e.len*sr),samples.length-start);for(let j=0;j<len;j++){const t=j/sr,f=hz(e.note||48);let v;if(e.instrument==='piano'){v=(Math.sin(2*Math.PI*f*t)+.23*Math.sin(2*Math.PI*f*2*t)+.08*Math.sin(2*Math.PI*f*3*t))*Math.exp(-t*3.2);}else if(e.instrument==='guitar'){v=0;for(let k=1;k<=5;k++)v+=Math.sin(2*Math.PI*f*k*t+.12*k)*Math.exp(-t*(2.8+k*.8))/(k*k*.7); }else if(e.instrument==='flute'){v=(Math.sin(2*Math.PI*f*t)+.08*Math.sin(2*Math.PI*f*2*t))*Math.min(1,t/.09)*Math.exp(-t*.7);}else{v=(Math.sin(t*18217)+Math.sin(t*23431)*.5)*Math.exp(-t*55);}const env=Math.min(1,t/.006,(e.len-t)/.07);samples[start+j]+=v*Math.max(0,env)*e.gain;}}
 const pcm=Buffer.alloc(samples.length*2);let peak=0;for(const s of samples)peak=Math.max(peak,Math.abs(s));const scale=.65/Math.max(peak,.65);for(let i=0;i<samples.length;i++){const t=i/sr,fade=Math.min(1,t/1.8,(duration-t)/3);pcm.writeInt16LE(Math.round(samples[i]*scale*fade*32767),i*2);}const h=Buffer.alloc(44);h.write('RIFF');h.writeUInt32LE(pcm.length+36,4);h.write('WAVE',8);h.write('fmt ',12);h.writeUInt32LE(16,16);h.writeUInt16LE(1,20);h.writeUInt16LE(1,22);h.writeUInt32LE(sr,24);h.writeUInt32LE(sr*2,28);h.writeUInt16LE(2,32);h.writeUInt16LE(16,34);h.write('data',36);h.writeUInt32LE(pcm.length,40);fs.writeFileSync(`dist/assets/music/${id}.wav`,Buffer.concat([h,pcm]));console.log(id,duration,'peak',peak.toFixed(3));}
// Sakin Bahçe: flowing 3/4 piano waltz, sustained flute phrases, no percussion.
{
 const duration=105,b=60/84,events=[],chords=[[48,64,67,72],[53,65,69,72],[57,64,69,72],[55,62,67,71]],phrases=[[76,79,81,79,76,74,72,74],[77,81,84,81,79,77,76,72],[76,74,72,69,72,76,79,76],[74,79,77,74,71,74,72,72]];
 const add=(t,note,len,gain,instrument='piano')=>events.push({t,note,len,gain,instrument});
 for(let bar=0;bar*3*b<duration;bar++){const t=bar*3*b,c=chords[Math.floor(bar/2)%4];add(t,c[0],b*2.7,.12);for(const k of [1,2])for(const n of c.slice(1))add(t+k*b,n,b*.88,.045);if(bar%16>=8){const phrase=phrases[Math.floor(bar/16)%4];add(t,phrase[bar%8],b*2.7,.12,'flute');}else for(let k=0;k<3;k++)add(t+k*b,c[1+(bar+k)%3]+(bar%4===3?0:12),b*.92,.105);}
 write('garden',duration,events);
}
// Oyun Zamanı: syncopated plucked strings and soft hand percussion in 4/4.
{
 const duration=120,b=60/108,events=[],chords=[[50,66,69,73],[55,67,71,74],[52,64,67,71],[57,64,68,72]],melodies=[[78,76,73,69,71,73,76,78],[79,78,74,71,74,76,78,74],[76,74,71,67,71,74,76,71],[76,73,72,68,69,72,73,76]];
 const add=(t,note,len,gain,instrument='guitar')=>events.push({t,note,len,gain,instrument});
 for(let bar=0;bar*4*b<duration;bar++){const t=bar*4*b,c=chords[bar%4];for(const k of [0,1.5,2.5,3.5])for(const n of c.slice(1))add(t+k*b,n,b*.9,.035);add(t,c[0],b*1.8,.11);add(t+2*b,c[0]+7,b*1.6,.08);const m=melodies[Math.floor(bar/4)%4];for(const [index,k] of [0,.75,1.5,2.75].entries())add(t+k*b,m[(bar*4+index)%8]+(Math.floor(bar/8)%3===1?-12:0),b*.66,.15);for(const k of [1,3])add(t+k*b,48,.11,.035,'brush');}
 write('play',duration,events);
}
if(!fs.readFileSync('dist/assets/music/steps.wav').equals(preserved))throw Error('Neşeli Adımlar changed');console.log('Neşeli Adımlar preserved',crypto.createHash('sha256').update(preserved).digest('hex'));
