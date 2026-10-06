// One permission request per app session. Tracks are muted outside response capture.
(()=>{
 try{if(window.parent!==window&&window.parent.location.origin===window.location.origin&&window.parent.LocalMicrophone){window.LocalMicrophone=window.parent.LocalMicrophone;return;}}catch{}
 let stream=null,pending=null,owner=null,generation=0;
 const available=()=>!!stream&&stream.getAudioTracks().some(t=>t.readyState==='live');
 window.LocalMicrophone={available,async ensure(){
  if(available())return stream;
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('secure-context');
  if(!pending){const token=generation;pending=navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false}).then(value=>{if(token!==generation){value.getTracks().forEach(t=>t.stop());throw new Error('microphone-closed');}stream=value;stream.getAudioTracks().forEach(t=>t.enabled=false);return stream;}).finally(()=>{pending=null;});}
  return pending;
 },enable(user){owner=user;stream?.getAudioTracks().forEach(t=>t.enabled=true);},disable(user){if(owner!==user)return;owner=null;stream?.getAudioTracks().forEach(t=>t.enabled=false);},close(){generation++;owner=null;stream?.getTracks().forEach(t=>t.stop());stream=null;}};
 window.addEventListener('pagehide',()=>window.LocalMicrophone.close());
})();
// SpeechRecognition-compatible local capture. PCM audio is sent only to this computer.
window.LocalSpeechRecognition=class {
 constructor(){this.active=false;this.started=false;this.parts=[];this.controller=new AbortController();}
 async start(){
  this.active=true;
  try{
   const stream=await window.LocalMicrophone.ensure();
   if(!this.active)return;
   window.LocalMicrophone.enable(this);
   this.stream=stream;this.context=new AudioContext();await this.context.resume();
   if(!this.active){this.cleanup();return;}
   const source=this.context.createMediaStreamSource(stream),processor=this.context.createScriptProcessor(2048,1,1),mute=this.context.createGain();mute.gain.value=0;
   source.connect(processor);processor.connect(mute);mute.connect(this.context.destination);this.processor=processor;this.rate=this.context.sampleRate;
   let hot=0,silence=0;this.samples=0;
   processor.onaudioprocess=event=>{
    if(!this.active||this.sending)return;
    const buffer=new Float32Array(event.inputBuffer.getChannelData(0));this.parts.push(buffer);this.samples+=buffer.length;
    const rms=Math.sqrt(buffer.reduce((sum,x)=>sum+x*x,0)/buffer.length),duration=buffer.length/this.rate;
    if(rms>.012){hot+=duration;silence=0;if(!this.started&&hot>=.12){this.started=true;this.onspeechstart?.();}}
    else{silence+=duration;hot=0;}
    if(this.started&&silence>.75||this.samples/this.rate>10)this.send();
   };
   this.onstart?.();
  }catch(error){if(this.active)this.onerror?.({error:error.name==='NotAllowedError'?'not-allowed':'microphone-unavailable'});this.abort();}
 }
 cleanup(){if(this.processor){this.processor.onaudioprocess=null;this.processor.disconnect();this.processor=null;}window.LocalMicrophone.disable(this);this.stream=null;this.context?.close().catch(()=>{});}
 abort(){this.active=false;this.controller.abort();this.cleanup();this.parts=[];}
 async send(){
  if(!this.active||this.sending)return;this.sending=true;this.cleanup();
  try{
   const joined=new Float32Array(this.samples);let offset=0;for(const part of this.parts){joined.set(part,offset);offset+=part.length;}this.parts=[];
   const count=Math.floor(joined.length*16000/this.rate),pcm=new Int16Array(count);
   for(let i=0;i<count;i++){const start=Math.floor(i*this.rate/16000),end=Math.min(joined.length,Math.floor((i+1)*this.rate/16000));let total=0;for(let j=start;j<end;j++)total+=joined[j];pcm[i]=Math.max(-1,Math.min(1,total/Math.max(1,end-start)))*32767;}
   const wav=new ArrayBuffer(44+pcm.byteLength),view=new DataView(wav);const str=(o,s)=>{for(let i=0;i<s.length;i++)view.setUint8(o+i,s.charCodeAt(i));};
   str(0,'RIFF');view.setUint32(4,36+pcm.byteLength,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,16000,true);view.setUint32(28,32000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,pcm.byteLength,true);for(let i=0;i<count;i++)view.setInt16(44+i*2,pcm[i],true);
   this.onprocessing?.();
   const response=await fetch('/api/transcribe',{method:'POST',headers:{'Content-Type':'audio/wav'},body:wav,signal:this.controller.signal});const result=await response.json();
   if(!this.active)return;if(!response.ok)throw new Error(result.error||'local-service');
   const value=[{transcript:result.text,confidence:result.uncertain?0:.8}];value.isFinal=true;this.onresult?.({resultIndex:0,results:[value]});this.onend?.();
  }catch(error){if(this.active&&error.name!=='AbortError')this.onerror?.({error:'local-service'});}
 }
};
