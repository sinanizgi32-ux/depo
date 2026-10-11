"""Local teacher-voice repair; never reads or stores pupil names/transcripts."""
import pathlib,json,io,time,urllib.request,re
import soundfile as sf
from scipy.signal import resample_poly
ROOT=pathlib.Path(__file__).resolve().parent.parent
BANK=ROOT/'dist/assets/character-voices/ready'
def generate(key,text,force=False):
 payload=json.dumps({'character':key,'text':text,'force':force}).encode()
 req=urllib.request.Request('http://127.0.0.1:4182/api/voice',data=payload,headers={'Origin':'http://127.0.0.1:4180','Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=180) as response:return response.read()
def transcript(data):
 wav,sr=sf.read(io.BytesIO(data));wav=resample_poly(wav,16000,sr);out=io.BytesIO();sf.write(out,wav,16000,format='WAV',subtype='PCM_16')
 req=urllib.request.Request('http://127.0.0.1:4181/api/transcribe',data=out.getvalue(),headers={'Origin':'http://127.0.0.1:4181','Content-Type':'audio/wav'})
 with urllib.request.urlopen(req,timeout=60) as response:return json.loads(response.read())['text']
bank=json.loads((BANK/'manifest.json').read_text('utf-8-sig'))
for character in ['pofidik','dila','kipir','mina']:
 for text in ['Gösterilen karta dokun.','Hayır, bu kartın yeri farklı.']:
  generate(character,text);print(character+' event hint ready',flush=True)
report=[]
for character,entries in bank.items():
 for text in entries:
  if not re.search(r'(?<!\w)ıslak(?!\w)',text,re.IGNORECASE):continue
  for attempt in range(3):
   data=generate(character,text,True);heard=transcript(data)
   if re.search(r'(?:ıslak|islak|ıs[ -]lak|is[ -]lak)',heard,re.IGNORECASE):break
  else:raise RuntimeError('Wet articulation QA failed: '+character)
  report.append({'character':character,'text':text,'heard':heard});print(json.dumps(report[-1],ensure_ascii=True),flush=True)
(ROOT/'outputs/wet-articulation-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf8')
print('DONE: event hints ready in four voices; every previously recorded wet phrase regenerated and locally transcribed.',flush=True)
