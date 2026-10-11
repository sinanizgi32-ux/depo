"""Local Turkish character voice synthesis. Reference audio never leaves this machine."""
import json,io,os,pathlib,threading,collections,time,hashlib,select,socket,re,shutil
os.environ.setdefault('TQDM_DISABLE','1')
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
ROOT=pathlib.Path(__file__).resolve().parent.parent
KEYS=('pofidik','kipir','dila','mina','narrator')
status={'ready':False,'message':'Karakter ses modeli hazırlanıyor.'}
model=None;conditions={};lock=threading.Lock();cache=collections.OrderedDict()
priority=threading.Condition();generating=False;foreground_waiting=0
current_alive=lambda:True
current_background=False
current_token=None
followers={}
class RequestCancelled(Exception):pass
def trim_silence(wav,sr):
 import numpy as np
 wav=np.asarray(wav).reshape(-1);hop=max(1,int(sr*.01))
 if not len(wav):return wav
 energy=np.sqrt(np.mean(np.pad(wav**2,(0,(-len(wav))%hop)).reshape(-1,hop),axis=1))
 active=np.flatnonzero(energy>max(.0004,float(energy.max())*.008))
 if not len(active):return wav
 start=max(0,int(active[0])*hop-int(sr*.15));end=min(len(wav),(int(active[-1])+1)*hop+int(sr*.2))
 # Keep consonants and ordinary breathing; cut only long empty margins.
 if start<int(sr*.15):start=0
 if len(wav)-end<int(sr*.15):end=len(wav)
 return wav[start:end]
def check_cancel(_module=None,_inputs=None):
 protected=any(alive() for alive in tuple(followers.values()))
 if (not current_alive() and not protected) or (current_background and foreground_waiting>0 and not protected):raise RequestCancelled()

CACHE_DIR=ROOT/'outputs/voice-cache';CACHE_DIR.mkdir(parents=True,exist_ok=True)
reference_hashes={key:hashlib.sha256((ROOT/'source-assets/character-voices'/f'{key}-reference.wav').read_bytes()).hexdigest() for key in KEYS}
FIXED_PHRASES={'Aferin!','Harikasın!','Süpersin!','Çok güzel!','Çok güzel yaptın!','Çok güzel başardın!','Aferin! Çok güzel yaptın. Şimdi birlikte devam edelim.'}
REWARDS={'Aferin!','Çok güzel!','Bravo!','Süpersin!','Harikasın!','Mükemmel!','Muhteşem!','Ne güzel yaptın!','Böyle devam et!','İşte bu, başardın!','Çok iyi yaptın!','Başardın!','Çok başarılısın!','Harika bir cevap!','Çok dikkatliydin!','Tebrik ederim!','Şahane!','Çok güzel ilerliyorsun!','Çok güzel söyledin!','Doğru.'}
def reward_style(text):
 return text in REWARDS or bool(re.fullmatch(r'(?:[^.!?]{1,60},? (?:aferin|harikasın|süpersin)|(?:Aferin|Harikasın|Süpersin),? [^.!?]{1,60})!',text))
BANK_DIR=ROOT/'dist/assets/character-voices/ready'
bank_lock=threading.Lock()
def valid_wav(data):
 return len(data)>44 and data[:4]==b'RIFF' and data[8:12]==b'WAVE' and int.from_bytes(data[4:8],'little')+8==len(data)
def prepared(key,text):
 try:
  manifest=json.loads((BANK_DIR/'manifest.json').read_text(encoding='utf-8-sig'))
  name=pathlib.Path(manifest[key][text]).name
  data=(BANK_DIR/name).read_bytes()
  return data if valid_wav(data) else None
 except (OSError,KeyError,ValueError):return None
def persist_static(key,text,data,replace=False):
 try:allowed=set(json.loads((BANK_DIR/'static-phrases.json').read_text(encoding='utf-8-sig')))
 except (OSError,ValueError):allowed=set()
 if text not in allowed:return
 if not valid_wav(data):raise ValueError('Eksik WAV kaydı yayımlanamaz.')
 with bank_lock:
  BANK_DIR.mkdir(parents=True,exist_ok=True)
  name=key+'-'+hashlib.sha256((reference_hashes[key]+'|'+text).encode()).hexdigest()[:20]+'.wav'
  audio=BANK_DIR/name
  if replace and audio.exists():
   backup=ROOT/'outputs/voice-bank-revisions';backup.mkdir(parents=True,exist_ok=True)
   original=backup/name
   if not original.exists():shutil.copy2(audio,original)
  if replace or not audio.exists() or not valid_wav(audio.read_bytes()):
   audio_temporary=audio.with_suffix('.wav.tmp');audio_temporary.write_bytes(data);audio_temporary.replace(audio)
  manifest_file=BANK_DIR/'manifest.json'
  try:manifest=json.loads(manifest_file.read_text(encoding='utf-8-sig'))
  except (OSError,ValueError):manifest={}
  manifest.setdefault(key,{})[text]='./assets/character-voices/ready/'+name
  temporary=BANK_DIR/'manifest.tmp';temporary.write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8');temporary.replace(manifest_file)
def synth(key,text,background=False,alive=lambda:True,force=False):
 global generating,foreground_waiting,current_alive,current_background,current_token
 import soundfile as sf
 token=(key,text)
 bank_data=prepared(key,text)
 if bank_data and not force:return bank_data
 if token in cache and not force:
  persist_static(key,text,cache[token]);return cache[token]
 digest=hashlib.sha256(('v3-tr-.35-.5-.65|'+reference_hashes[key]+'|'+text).encode()).hexdigest()
 file=CACHE_DIR/f'{key}-{digest}.wav'
 if not force and text in FIXED_PHRASES and file.exists():
  data=file.read_bytes()
  if valid_wav(data):persist_static(key,text,data);return data
 with priority:
  follower=None;counted=False
  if not background:
   if generating and current_token==token:follower=object();followers[follower]=alive
   else:foreground_waiting+=1;counted=True
  try:
   while generating or (background and foreground_waiting>0):
    if not alive():raise RequestCancelled()
    priority.wait(timeout=.1)
   if not alive():raise RequestCancelled()
  finally:
   if counted:foreground_waiting-=1
   if follower is not None:followers.pop(follower,None)
   priority.notify_all()
  if token in cache and not force:
   persist_static(key,text,cache[token]);return cache[token]
  generating=True
  current_token=token
 try:
  if not alive():raise RequestCancelled()
  current_alive=alive
  current_background=background
  token=(key,text)
  bank_data=prepared(key,text)
  if bank_data and not force:return bank_data
  if token in cache and not force:
   persist_static(key,text,cache[token]);return cache[token]
  digest=hashlib.sha256(('v3-tr-.35-.5-.65|'+reference_hashes[key]+'|'+text).encode()).hexdigest()
  file=CACHE_DIR/f'{key}-{digest}.wav'
  if not force and text in FIXED_PHRASES and file.exists():
   data=file.read_bytes()
   if valid_wav(data):persist_static(key,text,data);return data
  model.conds=conditions[key]
  # Internal articulation cue preserves /s/ in the Turkish consonant cluster.
  # The displayed text and public catalog keep the correct spelling “ıslak”.
  spoken=re.sub(r'(?<!\w)ıslak(?!\w)',lambda m:'Is-lak' if m.group()[0].isupper() else 'ıs-lak',text,flags=re.IGNORECASE)
  # Moderate expressive delivery for rewards; instructions retain their calm style.
  wav=model.generate(spoken,language_id='tr',exaggeration=.55 if reward_style(text) else .35,cfg_weight=.5,temperature=.65)
  out=io.BytesIO();sf.write(out,trim_silence(wav.squeeze().detach().cpu().numpy(),model.sr),model.sr,format='WAV',subtype='PCM_16');data=out.getvalue()
  if not valid_wav(data):raise ValueError('Ses modeli boş kayıt üretti.')
  persist_static(key,text,data,replace=force)
  cache[token]=data
  if text in FIXED_PHRASES:
   temporary=file.with_suffix('.tmp');temporary.write_bytes(data);temporary.replace(file)
  while sum(map(len,cache.values()))>64*1024*1024:cache.popitem(last=False)
  return data
 finally:
  current_alive=lambda:True
  current_background=False
  with priority:current_token=None;generating=False;priority.notify_all()
def initialize():
 global model
 try:
  import torch
  from chatterbox.mtl_tts import ChatterboxMultilingualTTS,Conditionals
  from huggingface_hub import snapshot_download
  # Avoid oversubscribing physical cores during one-token CPU decoding.
  torch.set_num_threads(max(1,int(os.environ.get('VOICE_CPU_THREADS','4'))))
  torch.set_flush_denormal(True)
  checkpoint=None
  try:
   candidate=pathlib.Path(snapshot_download(repo_id='ResembleAI/chatterbox',local_files_only=True))
   if all((candidate/name).is_file() for name in ('ve.pt','t3_mtl23ls_v3.safetensors','s3gen.pt','grapheme_mtl_merged_expanded_v1.json')):checkpoint=candidate
  except Exception:pass
  model=ChatterboxMultilingualTTS.from_local(checkpoint,device='cpu',t3_model='v3') if checkpoint else ChatterboxMultilingualTTS.from_pretrained(device='cpu',t3_model='v3')
  for phase,component in [('tokens',model.t3),('wave',model.s3gen)]:
   original=component.inference
   def timed(*args,_original=original,_phase=phase,**kwargs):
    began=time.monotonic()
    try:return _original(*args,**kwargs)
    finally:print('voice-phase '+_phase+' '+str(round(time.monotonic()-began,3))+'s',flush=True)
   component.inference=timed
  model.t3.speech_emb.register_forward_pre_hook(check_cancel)
  wave_step=model.s3gen.flow.decoder.estimator.forward
  def cancellable_wave_step(*args,**kwargs):
   check_cancel()
   return wave_step(*args,**kwargs)
  model.s3gen.flow.decoder.estimator.forward=cancellable_wave_step
  for key in KEYS:
   identity=hashlib.sha256(('v3-.35-conditions-v1|'+str(checkpoint)+'|'+reference_hashes[key]).encode()).hexdigest()
   saved=CACHE_DIR/f'conditions-{key}-{identity}.pt'
   try:conditions[key]=Conditionals.load(saved,map_location='cpu').to('cpu')
   except Exception:
    model.prepare_conditionals(str(ROOT/'source-assets/character-voices'/f'{key}-reference.wav'),exaggeration=.35)
    with torch.inference_mode():model.t3.prepare_conditioning(model.conds.t3)
    conditions[key]=model.conds;temporary=saved.with_suffix('.tmp');model.conds.save(temporary);temporary.replace(saved)
  status.update(ready=True,message='Karakter ses hizmeti çalışıyor.')
  print(status['message'],flush=True)
  folder=ROOT/'dist/assets/character-voices';folder.mkdir(parents=True,exist_ok=True)
  for key in KEYS:
   demo=folder/f'{key}-demo.wav'
   stamp=demo.with_suffix('.reference-sha256')
   if demo.exists() and stamp.exists() and stamp.read_text()==reference_hashes[key]:continue
   data=synth(key,'Merhaba! Birlikte yeni bir maceraya başlıyoruz.' if key=='narrator' else 'Aferin! Çok güzel yaptın. Şimdi birlikte devam edelim.');demo.write_bytes(data);stamp.write_text(reference_hashes[key])
   print(key+' deneme sesi üretildi.',flush=True)
 except Exception as error:
  status.update(ready=False,message='Karakter ses modeli açılamadı: '+type(error).__name__)
  print(str(error),flush=True)
class Handler(BaseHTTPRequestHandler):
 def alive(self):
  try:
   readable,_,_=select.select([self.connection],[],[],0)
   return not readable or self.connection.recv(1,socket.MSG_PEEK)!=b''
  except (OSError,ValueError):return False
 def log_message(self,*args):pass
 def reply(self,code,data,kind='application/json'):
  self.send_response(code);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(data)));self.send_header('Cache-Control','no-store');self.send_header('Access-Control-Allow-Origin','http://127.0.0.1:4180');self.end_headers();self.wfile.write(data)
 def do_OPTIONS(self):
  if self.headers.get('Origin')!='http://127.0.0.1:4180':return self.reply(403,b'{}')
  self.send_response(204);self.send_header('Access-Control-Allow-Origin','http://127.0.0.1:4180');self.send_header('Access-Control-Allow-Methods','GET, POST');self.send_header('Access-Control-Allow-Headers','Content-Type');self.end_headers()
 def do_GET(self):
  self.reply(200,json.dumps(status,ensure_ascii=False).encode()) if self.path=='/api/voice-status' else self.reply(404,b'{}')
 def do_POST(self):
  if self.path!='/api/voice' or self.headers.get('Origin')!='http://127.0.0.1:4180':return self.reply(403,b'{}')
  try:size=int(self.headers.get('Content-Length',0))
  except ValueError:return self.reply(400,b'{}')
  if not 0<size<4096:return self.reply(400,b'{}')
  try:
   value=json.loads(self.rfile.read(size));key=value['character'];text=value['text']
   if key not in KEYS or not isinstance(text,str) or not 0<len(text)<=500:return self.reply(400,b'{}')
   if not status['ready']:return self.reply(503,json.dumps(status).encode())
   self.reply(200,synth(key,text,value.get('background') is True,self.alive,value.get('force') is True),'audio/wav')
  except (RequestCancelled,ConnectionAbortedError,ConnectionResetError,BrokenPipeError):pass
  except Exception as error:self.reply(500,json.dumps({'error':type(error).__name__}).encode())
threading.Thread(target=initialize,daemon=True).start()
print('Yerel karakter ses hizmeti: 127.0.0.1:4182',flush=True)
ThreadingHTTPServer(('127.0.0.1',4182),Handler).serve_forever()
