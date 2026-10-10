"""Split existing fixed greeting recordings at the start of 'Ben'. No pupil audio."""
from pathlib import Path
import json,wave,numpy as np
from faster_whisper import WhisperModel
root=Path(__file__).resolve().parent.parent
folder=root/'dist/assets/character-voices/ready'
manifest=json.loads((folder/'manifest.json').read_text('utf8'))
model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,download_root=str(Path.home()/'.cache/dijital-ozel-egitim/whisper-small'))
segments={}
for key,bank in manifest.items():
 segments[key]={}
 for text,url in bank.items():
  if not text.startswith(('Selam! Ben ','Merhaba! Ben ')):continue
  file=root/'dist'/url.removeprefix('./')
  with wave.open(str(file)) as w:rate=w.getframerate();frames=w.readframes(w.getnframes());params=w.getparams()
  audio=np.frombuffer(frames,dtype='<i2').astype(np.float32)/32768
  audio=np.interp(np.arange(round(len(audio)*16000/rate))*rate/16000,np.arange(len(audio)),audio).astype(np.float32)
  result,_=model.transcribe(audio,language='tr',word_timestamps=True,beam_size=5)
  words=[word for segment in result for word in segment.words]
  starts=[word.start for word in words if word.word.lower().strip(' .,!?')=='ben']
  if not starts or starts[0]<.12:continue
  offset=int(starts[0]*rate)*params.sampwidth*params.nchannels
  parts=[]
  for suffix,data in [('head',frames[:offset]),('tail',frames[offset:])]:
   part=file.with_name(file.stem+'-'+suffix+'.wav')
   with wave.open(str(part),'wb') as out:out.setparams(params);out.writeframes(data)
   parts.append('./assets/character-voices/ready/'+part.name)
  segments[key][text]=parts
 print(key,len(segments[key]),'kişiselleştirilebilir karşılama hazır.',flush=True)
(folder/'greeting-parts.json').write_text(json.dumps(segments,ensure_ascii=False),'utf8')
