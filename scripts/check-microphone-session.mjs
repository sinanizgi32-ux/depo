import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
let requests=0,stops=0,pagehide;
const track={readyState:'live',enabled:true,stop(){this.readyState='ended';stops++;}};
const stream={getTracks:()=>[track],getAudioTracks:()=>[track]};
const audioNode=()=>({connect(){},disconnect(){},gain:{value:1}});
class AudioContext {
 constructor(){this.sampleRate=48000;this.destination={};}
 async resume(){}
 createMediaStreamSource(){return audioNode();}
 createScriptProcessor(){return audioNode();}
 createGain(){return audioNode();}
 async close(){}
}
const window={location:{origin:'http://localhost'},addEventListener:(type,fn)=>{if(type==='pagehide')pagehide=fn;}};window.parent=window;
const context=vm.createContext({window,navigator:{mediaDevices:{getUserMedia:async()=>{requests++;return stream;}}},AudioContext,AbortController,Float32Array,Int16Array,ArrayBuffer,DataView,Math});
vm.runInContext(fs.readFileSync(new URL('../dist/local-speech.js',import.meta.url),'utf8'),context);
const manager=window.LocalMicrophone;
await Promise.all([manager.ensure(),manager.ensure()]);assert.equal(requests,1);assert.equal(track.enabled,false);
for(let i=0;i<5;i++){
 const rec=new window.LocalSpeechRecognition();await rec.start();assert.equal(track.enabled,true);
 rec.abort();assert.equal(track.enabled,false);assert.equal(stops,0);
}
assert.equal(requests,1,'Five trials must share the same permission stream');
pagehide();assert.equal(stops,1);assert.equal(manager.available(),false);
console.log('OK: One permission request, five captures reuse the stream, muted between answers, stopped on app exit.');
