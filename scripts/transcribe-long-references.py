from pathlib import Path
import json,wave,numpy as np
from faster_whisper import WhisperModel
root=Path.cwd();model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=2,download_root=str(Path.home()/'.cache/dijital-ozel-egitim/whisper-small'))
rows={}
for key in ['pofidik','dila','kipir','mina']:
 with wave.open(str(root/'source-assets/character-voices'/(key+'-reference.wav'))) as wav:
  rate=wav.getframerate();audio=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2').astype(np.float32)/32768
 audio=np.interp(np.arange(round(len(audio)*16000/rate))*rate/16000,np.arange(len(audio)),audio).astype(np.float32)
 result,_=model.transcribe(audio,language='tr',word_timestamps=True,beam_size=5)
 rows[key]=[{'start':s.start,'end':s.end,'text':s.text,'words':[{'start':w.start,'end':w.end,'word':w.word} for w in s.words]} for s in result]
 print(key, ' '.join(s['text'] for s in rows[key]),flush=True)
 (root/'outputs/long-reference-transcription.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
