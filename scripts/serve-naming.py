"""Local-only speech prototype. Audio remains in memory and is never logged."""
import io,json,os,pathlib,threading,wave,time,re
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import urlsplit,unquote
import numpy as np
from faster_whisper import WhisperModel

ROOT=(pathlib.Path(__file__).resolve().parent.parent/'dist').resolve()
PORT=int(os.environ.get('NAMING_PORT','4181'))
MODEL_DIR=os.environ.get('NAMING_MODEL_DIR',str(pathlib.Path.home()/'.cache'/'dijital-ozel-egitim'/'whisper-small'))
model=None
status={'ready':False,'message':'Türkçe ses modeli hazırlanıyor.'}
lock=threading.Lock()
names=re.findall(r"\['[a-z]+','([^']+)','",(ROOT/'matching-data.js').read_text(encoding='utf-8-sig'))
# The complete 100-word vocabulary is supplied, never the trial's expected answer.
vocabulary='Türkçe renk ve nesne adları: kırmızı, mavi, sarı, yeşil, '+', '.join(names)
def load_model():
 global model
 try:
  model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4,download_root=MODEL_DIR)
  status.update(ready=True,message='Yerel Türkçe dinleme hazır. Ses bilgisayardan dışarı gönderilmez.')
  print('Yerel ses modeli hazır.',flush=True)
 except Exception as error:
  status.update(ready=False,message='Ses modeli başlatılamadı: '+type(error).__name__)
  print('Ses modeli başlatılamadı:',str(error),flush=True)
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(ROOT),**kwargs)
 def log_message(self,*args):pass
 def end_headers(self):self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');super().end_headers()
 def json(self,code,data):
  body=json.dumps(data,ensure_ascii=False).encode();self.send_response(code);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
 def safe(self):
  path=unquote(urlsplit(self.path).path)
  return not any(p.startswith('.') for p in path.split('/')) and '\\' not in path and '\x00' not in path and (ROOT/path.lstrip('/')).resolve().is_relative_to(ROOT)
 def do_GET(self):
  if urlsplit(self.path).path=='/api/status':self.json(200,status);return
  if not self.safe():self.send_error(403);return
  super().do_GET()
 def do_HEAD(self):
  if not self.safe():self.send_error(403);return
  super().do_HEAD()
 def do_POST(self):
  if self.path!='/api/transcribe':self.json(404,{'error':'Bulunamadı'});return
  if self.headers.get('Origin')!=f'http://127.0.0.1:{PORT}':self.json(403,{'error':'Yalnızca yerel prototip erişebilir'});return
  if not model:self.json(503,{'error':status['message']});return
  try:length=int(self.headers.get('Content-Length','0'))
  except ValueError:length=0
  if not 44<=length<=500000 or self.headers.get('Content-Type')!='audio/wav':self.json(400,{'error':'Geçersiz ses'});return
  if not lock.acquire(False):self.json(429,{'error':'Önceki yanıt işleniyor'});return
  try:
   self.connection.settimeout(10)
   raw=self.rfile.read(length)
   with wave.open(io.BytesIO(raw),'rb') as audio:
    if audio.getnchannels()!=1 or audio.getsampwidth()!=2 or audio.getframerate()!=16000 or audio.getnframes()>16000*12:raise ValueError('Geçersiz biçim')
    samples=np.frombuffer(audio.readframes(audio.getnframes()),dtype='<i2').astype(np.float32)/32768
   if not samples.size or np.sqrt(np.mean(samples*samples))<.003:self.json(200,{'text':'','uncertain':True});return
   start=time.monotonic()
   samples=np.pad(samples,(6400,8000))
   # A task-wide vocabulary contains every possible color, never this trial's answer.
   prompt='Renk adları: kırmızı, mavi, sarı, yeşil.' if self.headers.get('X-Teaching-Domain')=='colors' else 'Uzunluk kavramları: uzun, kısa.' if self.headers.get('X-Teaching-Domain')=='length' else 'Yaş kavramları: genç, yaşlı.' if self.headers.get('X-Teaching-Domain')=='age' else 'Zıt kavramlar: temiz, kirli, sıcak, soğuk, büyük, küçük, ağır, hafif, ince, kalın, gece, gündüz, içinde, dışında, dolu, boş, yeni, eski, sert, yumuşak, ıslak, kuru.' if self.headers.get('X-Teaching-Domain')=='opposites' else vocabulary
   if self.headers.get('X-Teaching-Domain')=='wh':
    # Task-wide vocabulary, not the expected answer to the current question.
    prompt='Türkçe olay yanıtları: Ela, Ali, Ece, Can, Ada, Mert, Zeynep, Deniz, Elif, Arda, Emir, İpek. Top, bardak, kitap, kalem, sulama kabı, araba, havlu, elma. Park, mutfak, kütüphane, sınıf, bahçe, oyun odası, yatak odası, okul bahçesi, banyo. Sabah, öğleden sonra, akşam. Dikkatlice, yavaşça, sakince, nazikçe. Oyuncakları toplamak, susuzluğunu gidermek, öyküyü öğrenmek, resim yapmak, çiçeğe su vermek, arkadaşıyla oynamak, ellerini kurulamak, yardım etmek, temiz meyve yemek, kitabı kaldırmak, paylaşmak.'
   segments,info=model.transcribe(samples,language='tr',task='transcribe',initial_prompt=prompt,beam_size=5,condition_on_previous_text=False,vad_filter=False,temperature=0)
   segments=list(segments)
   text=' '.join(s.text.strip() for s in segments if s.no_speech_prob<.6 and s.avg_logprob> -1.5)
   self.json(200,{'text':text,'uncertain':not bool(text),'elapsed':round(time.monotonic()-start,2)})
  except (ValueError,wave.Error):self.json(400,{'error':'Ses biçimi çözülemedi'})
  except Exception:self.json(500,{'error':'Ses çözümlemesi tamamlanamadı'})
  finally:lock.release()

threading.Thread(target=load_model,daemon=True).start()
print(f'Söyleme prototipi: http://127.0.0.1:{PORT}/naming-prototype.html',flush=True)
ThreadingHTTPServer(('127.0.0.1',PORT),Handler).serve_forever()

