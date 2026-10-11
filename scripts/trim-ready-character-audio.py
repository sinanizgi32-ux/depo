"""Remove only long silence margins; retain an original backup and reference WAVs."""
import ast,pathlib,shutil
import soundfile as sf
root=pathlib.Path(__file__).resolve().parent.parent
source=root/'scripts/serve-character-voices.py';tree=ast.parse(source.read_text('utf8'))
tree.body=[node for node in tree.body if isinstance(node,ast.FunctionDef) and node.name=='trim_silence']
scope={};exec(compile(tree,str(source),'exec'),scope)
backup=root/'outputs/voice-bank-original-margins';backup.mkdir(parents=True,exist_ok=True)
count=0;saved=0
for filename in (root/'dist/assets/character-voices/ready').glob('*.wav'):
 info=sf.info(filename)
 if info.subtype!='PCM_16' or info.channels!=1:continue
 wav,sr=sf.read(filename,dtype='float64');trimmed=scope['trim_silence'](wav,sr)
 if len(trimmed)==len(wav):continue
 original=backup/filename.name
 if not original.exists():shutil.copy2(filename,original)
 temporary=filename.with_suffix('.trim.tmp');sf.write(temporary,trimmed,sr,format='WAV',subtype='PCM_16');temporary.replace(filename)
 count+=1;saved+=(len(wav)-len(trimmed))/sr
print(f'OK: {count} recordings; {saved:.1f} seconds of empty margins removed; originals retained; references untouched.')
