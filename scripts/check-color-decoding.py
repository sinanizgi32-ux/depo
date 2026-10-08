"""Compare task-wide prompts using synthetic color recordings, no expected answer hint."""
import pathlib,json,wave,numpy as np
from faster_whisper import WhisperModel
root=pathlib.Path(__file__).resolve().parent.parent
model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,download_root=str(pathlib.Path.home()/'.cache/dijital-ozel-egitim/whisper-small'))
prompts=['Kırmızı. Mavi. Sarı. Yeşil.','Bu kırmızı. Bu mavi. Bu sarı. Bu yeşil.','kırmızı, mavi, sarı, yeşil, kırmızı, mavi, sarı, yeşil']
records=[]
with wave.open(str(root/'outputs/color-speech-check/sarı.wav'),'rb') as w:
 samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
samples=np.pad(samples,(6400,8000))
for prompt in prompts:
 segments,_=model.transcribe(samples,language='tr',initial_prompt=prompt,hotwords='kırmızı mavi sarı yeşil',beam_size=10,condition_on_previous_text=False,vad_filter=False,temperature=0)
 text=' '.join(s.text for s in segments)
 records.append({'prompt':prompt,'text':text})
print(json.dumps(records,ensure_ascii=False))
