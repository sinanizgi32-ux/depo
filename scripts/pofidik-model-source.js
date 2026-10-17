import {gunzipSync} from 'three/addons/libs/fflate.module.js';

// Both the chooser and the game use the same deployed model transport.
export async function loadPofidik(loader, onProgress=()=>{}) {
 const base=new URL('./assets/avatars/pofidik/',location.href);
 const manifestResponse=await fetch(new URL('model-chunks.json',base));
 let bytes;
 if(manifestResponse.ok && (manifestResponse.headers.get('content-type')||'').includes('json')){
  const manifest=await manifestResponse.json();
  const parts=[];let received=0;
  for(const name of manifest.gzip_files){
   if(!/^model-gzip-chunk-\d+\.bin$/.test(name))throw Error('Invalid model part');
   const response=await fetch(new URL(name,base));if(!response.ok)throw Error('Model part unavailable');
   const part=new Uint8Array(await response.arrayBuffer());parts.push(part);received+=part.length;onProgress(parts.length/manifest.gzip_files.length);
  }
  const joined=new Uint8Array(received);let offset=0;for(const part of parts){joined.set(part,offset);offset+=part.length;}
  bytes=gunzipSync(joined);
 }else{
  const response=await fetch(new URL('model.glb.gz',base));
  if(!response.ok)throw Error('Model unavailable');
  bytes=gunzipSync(new Uint8Array(await response.arrayBuffer()));onProgress(1);
 }
 if(new DataView(bytes.buffer,bytes.byteOffset,12).getUint32(0,true)!==0x46546c67)throw Error('Invalid GLB');
 return loader.parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),base.href);
}
