"""Check ready-bank persistence, privacy and cancellation without loading the voice model."""
import ast,pathlib,tempfile,json,threading,time
source=pathlib.Path(__file__).with_name('serve-character-voices.py')
tree=ast.parse(source.read_text('utf8'))
tree.body=[node for node in tree.body if isinstance(node,(ast.Import,ast.ImportFrom,ast.Assign,ast.FunctionDef,ast.ClassDef))]
scope={'__file__':str(source)}
exec(compile(tree,str(source),'exec'),scope)
with tempfile.TemporaryDirectory() as temporary:
 folder=pathlib.Path(temporary);scope['BANK_DIR']=folder
 (folder/'static-phrases.json').write_text(json.dumps(['Balığı eşle.']),'utf8')
 scope['persist_static']('pofidik','Balığı eşle.',b'fixed-teacher-audio')
 assert scope['prepared']('pofidik','Balığı eşle.')==b'fixed-teacher-audio'
 manifest=(folder/'manifest.json').read_bytes()
 scope['persist_static']('pofidik','Öğrenci adı.',b'private')
 scope['persist_static']('pofidik','Hayır, söylediğin yanıt değil.',b'private')
 assert (folder/'manifest.json').read_bytes()==manifest
 scope['generating']=True
 result=[]
 def cancelled_request():
  try:scope['synth']('dila','İptal testi.',alive=lambda:False)
  except scope['RequestCancelled']:result.append('cancelled')
 worker=threading.Thread(target=cancelled_request);worker.start()
 deadline=time.monotonic()+5
 while scope['foreground_waiting']==0 and time.monotonic()<deadline:time.sleep(.01)
 assert scope['foreground_waiting']==1
 with scope['priority']:scope['generating']=False;scope['priority'].notify_all()
 worker.join(timeout=5)
 assert result==['cancelled'] and not worker.is_alive()
 assert scope['foreground_waiting']==0 and not scope['generating']
print('OK: sabit öğretmen kaydı kalıcı; öğrenci adı/yanıtı diske yazılmıyor; iptal edilen sıra isteği modeli çalıştırmıyor.')
