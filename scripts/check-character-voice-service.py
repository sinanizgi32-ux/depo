"""Check ready-bank persistence, privacy and cancellation without loading the voice model."""
import ast,pathlib,tempfile,json,threading,time
import io,wave
source=pathlib.Path(__file__).with_name('serve-character-voices.py')
tree=ast.parse(source.read_text('utf8'))
tree.body=[node for node in tree.body if isinstance(node,(ast.Import,ast.ImportFrom,ast.Assign,ast.FunctionDef,ast.ClassDef))]
scope={'__file__':str(source)}
exec(compile(tree,str(source),'exec'),scope)
assert scope['reward_style']('Aferin!')
assert scope['reward_style']('Deniz, aferin!')
assert scope['reward_style']('Süpersin, Deniz!')
assert not scope['reward_style']('Uzun olanı eşle.')
assert not scope['reward_style']('Bu kedi. Şimdi sen söyle.')
with tempfile.TemporaryDirectory() as temporary:
 folder=pathlib.Path(temporary);scope['BANK_DIR']=folder
 audio_buffer=io.BytesIO()
 with wave.open(audio_buffer,'wb') as audio:
  audio.setnchannels(1);audio.setsampwidth(2);audio.setframerate(24000);audio.writeframes(b'\x01\x00'*2400)
 fixed_audio=audio_buffer.getvalue()
 (folder/'static-phrases.json').write_text(json.dumps(['Balığı eşle.']),'utf8')
 scope['persist_static']('pofidik','Balığı eşle.',fixed_audio)
 assert scope['prepared']('pofidik','Balığı eşle.')==fixed_audio
 ready_file=next(folder.glob('*.wav'));ready_file.write_bytes(fixed_audio[:100])
 assert scope['prepared']('pofidik','Balığı eşle.') is None
 scope['persist_static']('pofidik','Balığı eşle.',fixed_audio)
 assert scope['prepared']('pofidik','Balığı eşle.')==fixed_audio
 manifest=(folder/'manifest.json').read_bytes()
 scope['persist_static']('pofidik','Öğrenci adı.',b'private')
 scope['persist_static']('pofidik','Hayır, söylediğin yanıt değil.',b'private')
 assert (folder/'manifest.json').read_bytes()==manifest
 scope['generating']=True
 result=[]
 connected=[True]
 def cancelled_request():
  try:scope['synth']('dila','İptal testi.',alive=lambda:connected[0])
  except scope['RequestCancelled']:result.append('cancelled')
 worker=threading.Thread(target=cancelled_request);worker.start()
 deadline=time.monotonic()+5
 while scope['foreground_waiting']==0 and time.monotonic()<deadline:time.sleep(.01)
 assert scope['foreground_waiting']==1
 connected[0]=False
 worker.join(timeout=5)
 assert result==['cancelled'] and not worker.is_alive()
 assert scope['foreground_waiting']==0 and scope['generating']
 scope['generating']=False
scope['current_background']=True;scope['foreground_waiting']=1
try:scope['check_cancel']()
except scope['RequestCancelled']:pass
else:raise AssertionError('Background generation must yield to a waiting lesson')
scope['current_background']=False;scope['check_cancel']()
scope['foreground_waiting']=0;scope['current_background']=True;scope['check_cancel']()
print('OK: sabit öğretmen kaydı kalıcı; öğrenci adı/yanıtı diske yazılmıyor; iptal edilen sıra isteği modeli çalıştırmıyor.')

# A foreground cue joins its already-running prefetch instead of restarting it.
import numpy as np
began=threading.Event();release=threading.Event();calls=[];answers=[]
class Wave:
 def squeeze(self):return self
 def detach(self):return self
 def cpu(self):return self
 def numpy(self):return np.sin(np.arange(24000)*.04).astype(np.float32)*.1
class Model:
 sr=24000
 def generate(self,*args,**kwargs):calls.append(args);began.set();assert release.wait(5);return Wave()
scope['model']=Model();scope['conditions']={'dila':None};scope['current_background']=False
def generate(background):answers.append(scope['synth']('dila','Özel kuyruk birleşme testi.',background))
background=threading.Thread(target=lambda:generate(True));background.start();assert began.wait(5)
foreground=threading.Thread(target=lambda:generate(False));foreground.start()
deadline=time.monotonic()+5
while not scope['followers'] and time.monotonic()<deadline:time.sleep(.01)
assert scope['followers'] and scope['foreground_waiting']==0
scope['foreground_waiting']=1;scope['check_cancel']();scope['foreground_waiting']=0
release.set();background.join(5);foreground.join(5)
assert len(calls)==1 and len(answers)==2 and answers[0]==answers[1]
assert not scope['followers'] and not scope['generating']
wave=np.concatenate([np.zeros(14400),np.ones(2400)*.0001,np.sin(np.arange(24000)*.04)*.1,np.zeros(16800)])
trimmed=scope['trim_silence'](wave,24000)
assert len(trimmed)<len(wave) and np.count_nonzero(trimmed)==np.count_nonzero(wave),'Silence trimming must preserve every nonzero speech sample in this margin test'
print('OK: foreground joins identical prefetch once; trimmed silence preserves speech samples.')
