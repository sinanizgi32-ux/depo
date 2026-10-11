import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export function voiceBankReader(root=new URL('../',import.meta.url)){
 const dist=new URL('dist/',root),folder=fileURLToPath(new URL('assets/character-voices/ready/',dist)),checked=new Set();
 return async function read(){
  let raw;try{raw=JSON.parse(await fs.readFile(new URL('manifest.json',new URL('assets/character-voices/ready/',dist)),'utf8'));}catch{return{bank:{},invalid:[]};}
  const bank={},invalid=[],jobs=Object.entries(raw).flatMap(([character,entries])=>Object.entries(entries).map(([text,url])=>({character,text,url})));
  for(let offset=0;offset<jobs.length;offset+=24)await Promise.all(jobs.slice(offset,offset+24).map(async({character,text,url})=>{
   let valid=false;
   if(typeof url==='string'&&checked.has(url))valid=true;
   else if(typeof url==='string'){
    try{const filename=fileURLToPath(new URL(url,dist)),relative=path.relative(folder,filename);if(relative.startsWith('..')||path.isAbsolute(relative)||path.extname(filename)!=='.wav')throw Error('Outside ready bank');
     const file=await fs.open(filename,'r');try{const info=await file.stat(),header=Buffer.alloc(44);await file.read(header,0,44,0);valid=info.size>44&&header.toString('ascii',0,4)==='RIFF'&&header.toString('ascii',8,12)==='WAVE'&&header.readUInt32LE(4)+8===info.size;}finally{await file.close();}
    }catch{}
   }
   if(valid){checked.add(url);(bank[character]??={})[text]=url;}else invalid.push({character,text});
  }));
  return{bank,invalid};
 };
}
