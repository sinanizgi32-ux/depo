from pathlib import Path
import wave,numpy as np,json
from faster_whisper import WhisperModel
m=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,download_root=str(Path.home()/'.cache/dijital-ozel-egitim/whisper-small'))
for p in Path('dist/assets/character-voices').glob('*-demo.wav'):
 with wave.open(str(p)) as w:
  rate=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
 a=np.interp(np.arange(round(len(a)*16000/rate))*rate/16000,np.arange(len(a)),a).astype(np.float32)
 segments,_=m.transcribe(a,language='tr',beam_size=5);print(p.name,round(len(a)/16000,2),' '.join(s.text for s in segments),flush=True)
