"""Local Turkish character voice synthesis. Reference audio never leaves this machine."""
import json,io,os,pathlib,threading,collections,time,hashlib,select,socket
os.environ.setdefault('TQDM_DISABLE','1')
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
ROOT=pathlib.Path(__file__).resolve().parent.parent
KEYS=('pofidik','kipir','dila','mina')
status={'ready':False,'message':'Karakter ses modeli hazırlanıyor.'}
model=None;conditions={};lock=threading.Lock();cache=collections.OrderedDict()
priority=threading.Condition();generating=False;foreground_waiting=0
current_alive=lambda:True
class RequestCancelled(Exception):pass
CACHE_DIR=ROOT/'outputs/voice-cache';CACHE_DIR.mkdir(parents=True,exist_ok=True)
reference_hashes={key:hashlib.sha256((ROOT/'source-assets/character-voices'/f'{key}-reference.wav').read_bytes()).hexdigest() for key in KEYS}
FIXED_PHRASES={'Aferin!','Harikasın!','Süpersin!','Çok güzel!','Çok güzel yaptın!','Çok güzel başardın!','Aferin! Çok güzel yaptın. Şimdi birlikte devam edelim.'}
BANK_DIR=ROOT/'dist/assets/character-voices/ready'
bank_lock=threading.Lock()
def prepared(key,text):
 try:
  manifest=json.loads((BANK_DIR/'manifest.json').read_text(encoding='utf-8-sig'))
  name=pathlib.Path(manifest[key][text]).name
  return (BANK_DIR/name).read_bytes()
 except (OSError,KeyError,ValueError):return None
def persist_static(key,text,data):
 try:allowed=set(json.loads((BANK_DIR/'static-phrases.json').read_text(encoding='utf-8-sig')))
 except (OSError,ValueError):allowed=set()
 if text not in allowed:return
 with bank_lock:
  BANK_DIR.mkdir(parents=True,exist_ok=True)
  name=key+'-'+hashlib.sha256(text.encode()).hexdigest()[:20]+'.wav'
  audio=BANK_DIR/name
  if not audio.exists():audio.write_bytes(data)
  manifest_file=BANK_DIR/'manifest.json'
  try:manifest=json.loads(manifest_file.read_text(encoding='utf-8-sig'))
  except (OSError,ValueError):manifest={}
  manifest.setdefault(key,{})[text]='./assets/character-voices/ready/'+name
  temporary=BANK_DIR/'manifest.tmp';temporary.write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8');temporary.replace(manifest_file)
def synth(key,text,background=False,alive=lambda:True):
 global generating,foreground_waiting,current_alive
 import soundfile as sf
 token=(key,text)
 bank_data=prepared(key,text)
 if bank_data:return bank_data
 if token in cache:return cache[token]
 digest=hashlib.sha256(('v3-tr-.35-.5-.65|'+reference_hashes[key]+'|'+text).encode()).hexdigest()
 file=CACHE_DIR/f'{key}-{digest}.wav'
 if text in FIXED_PHRASES and file.exists():return file.read_bytes()
 with priority:
  if not background:foreground_waiting+=1
  priority.wait_for(lambda:not generating and (not background or foreground_waiting==0))
  if not background:foreground_waiting-=1
  generating=True
 try:
  if not alive():raise RequestCancelled()
  current_alive=alive
  token=(key,text)
  bank_data=prepared(key,text)
  if bank_data:return bank_data
  if token in cache:return cache[token]
  digest=hashlib.sha256(('v3-tr-.35-.5-.65|'+reference_hashes[key]+'|'+text).encode()).hexdigest()
  file=CACHE_DIR/f'{key}-{digest}.wav'
  if text in FIXED_PHRASES and file.exists():return file.read_bytes()
  model.conds=conditions[key]
  wav=model.generate(text,language_id='tr',exaggeration=.35,cfg_weight=.5,temperature=.65)
  out=io.BytesIO();sf.write(out,wav.squeeze().detach().cpu().numpy(),model.sr,format='WAV',subtype='PCM_16');data=out.getvalue()
  cache[token]=data
  persist_static(key,text,data)
  if text in FIXED_PHRASES:
   temporary=file.with_suffix('.tmp');temporary.write_bytes(data);temporary.replace(file)
  while sum(map(len,cache.values()))>64*1024*1024:cache.popitem(last=False)
  return data
 finally:
  current_alive=lambda:True
  with priority:generating=False;priority.notify_all()
def initialize():
 global model
 try:
  import torch
  from chatterbox.mtl_tts import ChatterboxMultilingualTTS
  torch.set_num_threads(min(8,os.cpu_count() or 4))
  model=ChatterboxMultilingualTTS.from_pretrained(device='cpu',t3_model='v3')
  def check_cancel(_module,_inputs):
   if not current_alive():raise RequestCancelled()
  model.t3.speech_emb.register_forward_pre_hook(check_cancel)
  for key in KEYS:
   model.prepare_conditionals(str(ROOT/'source-assets/character-voices'/f'{key}-reference.wav'),exaggeration=.35);conditions[key]=model.conds
  status.update(ready=True,message='Dört karakterin Türkçe sesleri hazır.')
  print(status['message'],flush=True)
  folder=ROOT/'dist/assets/character-voices';folder.mkdir(parents=True,exist_ok=True)
  for key in KEYS:
   demo=folder/f'{key}-demo.wav'
   if demo.exists():continue
   data=synth(key,'Aferin! Çok güzel yaptın. Şimdi birlikte devam edelim.');demo.write_bytes(data)
   print(key+' deneme sesi üretildi.',flush=True)
 except Exception as error:
  status.update(ready=False,message='Karakter ses modeli açılamadı: '+type(error).__name__)
  print(str(error),flush=True)
class Handler(BaseHTTPRequestHandler):
 def alive(self):
  try:
   readable,_,_=select.select([self.connection],[],[],0)
   return not readable or self.connection.recv(1,socket.MSG_PEEK)!=b''
  except OSError:return False
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
   self.reply(200,synth(key,text,value.get('background') is True,self.alive),'audio/wav')
  except (RequestCancelled,ConnectionAbortedError,ConnectionResetError,BrokenPipeError):pass
  except Exception as error:self.reply(500,json.dumps({'error':type(error).__name__}).encode())
threading.Thread(target=initialize,daemon=True).start()
print('Yerel karakter ses hizmeti: 127.0.0.1:4182',flush=True)
ThreadingHTTPServer(('127.0.0.1',4182),Handler).serve_forever()
