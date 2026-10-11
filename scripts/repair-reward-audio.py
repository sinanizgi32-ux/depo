"""Regenerate finite teacher rewards; no pupil data is read or written."""
import pathlib,json,io,urllib.request,re,time
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly
ROOT=pathlib.Path(__file__).resolve().parent.parent
BANK=ROOT/'dist/assets/character-voices/ready'
texts=['Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.']
def normal(text):return re.sub(r'[^a-zçğıöşü]','',text.lower().replace('i̇','i'))
def request(url,data,kind,origin,timeout=180):
 req=urllib.request.Request(url,data=data,headers={'Content-Type':kind,'Origin':origin})
 with urllib.request.urlopen(req,timeout=timeout) as response:return response.read()
report_file=ROOT/'outputs/reward-voice-qa.json'
try:report=json.loads(report_file.read_text('utf8'))
except (OSError,ValueError):report=[]
for _ in range(120):
 try:
  with urllib.request.urlopen('http://127.0.0.1:4182/api/voice-status',timeout=2) as response:
   if json.loads(response.read()).get('ready'):break
 except Exception:pass
 time.sleep(1)
else:raise RuntimeError('Voice service did not become ready')
for text in texts:
 for character in ['pofidik','dila','kipir','mina']:
  max_pause=.22 if len(text.split())==1 else .4
  previous=next((r for r in report if r['character']==character and r['text']==text),None)
  if previous and previous['accepted'] and previous['longestPause']<max_pause:continue
  report=[r for r in report if not(r['character']==character and r['text']==text)]
  manifest=json.loads((BANK/'manifest.json').read_text('utf-8-sig'))
  path=BANK/pathlib.Path(manifest[character][text]).name
  original=path.read_bytes()
  accepted=False
  for attempt in range(3):
   payload=json.dumps({'character':character,'text':text,'force':True}).encode()
   data=request('http://127.0.0.1:4182/api/voice',payload,'application/json','http://127.0.0.1:4180')
   wav,sr=sf.read(io.BytesIO(data));out=io.BytesIO();sf.write(out,resample_poly(wav,16000,sr),16000,format='WAV',subtype='PCM_16')
   heard=json.loads(request('http://127.0.0.1:4181/api/transcribe',out.getvalue(),'audio/wav','http://127.0.0.1:4181',60))['text']
   # Flag long internal silence, excluding existing leading/trailing margins.
   hop=int(sr*.02);energy=np.sqrt(np.mean(np.pad(wav**2,(0,(-len(wav))%hop)).reshape(-1,hop),axis=1))
   active=np.flatnonzero(energy>max(.001,energy.max()*.02));longest=run=0
   for value in energy[active[0]:active[-1]+1] if len(active) else []:
    run=run+1 if value<=max(.001,energy.max()*.02) else 0;longest=max(longest,run)
   seconds=len(wav)/sr
   # Turkish soft ğ is not a consonant release; ASR may spell natural "doğru" as "doru".
   words_correct=normal(heard)==normal(text) or (text=='Doğru.' and normal(heard)=='doru')
   accepted=words_correct and longest*.02<max_pause and .3<seconds<max(3.5,len(text.split())*1.3+1)
   if accepted:break
  if not accepted:
   temporary=path.with_suffix('.repair.tmp');temporary.write_bytes(original);temporary.replace(path)
  row={'character':character,'text':text,'heard':heard,'seconds':round(seconds,2),'longestPause':round(longest*.02,2),'accepted':accepted,'attempts':attempt+1}
  report.append(row)
  (ROOT/'outputs/reward-voice-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf8')
  print(json.dumps(row,ensure_ascii=True),flush=True)
print('DONE '+str(sum(r['accepted'] for r in report))+'/'+str(len(report))+' rewards accepted; failed candidates restored.',flush=True)
