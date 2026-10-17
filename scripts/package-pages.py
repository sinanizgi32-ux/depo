"""Build a self-contained static preview; PCM samples remain unchanged."""
from pathlib import Path
import json,shutil,hashlib
import soundfile as sf
import numpy as np

root=Path(__file__).resolve().parent.parent
source=root/'dist'
target=root/'_site'
if target.exists():raise SystemExit('Use a fresh _site output directory.')
def ignore(folder,names):
 p=Path(folder)
 if p.name=='ready':return [n for n in names if n.endswith(('.wav','.flac'))]
 if p==source/'assets/avatars/pofidik':return ['model.glb']
 return []
shutil.copytree(source,target,ignore=ignore)
folder=source/'assets/character-voices/ready'
bank=json.loads((folder/'manifest.json').read_text('utf8'))
parts=json.loads((folder/'greeting-parts.json').read_text('utf8'))
quality=json.loads((folder/'quality.json').read_text('utf8'))
# Rejected reward recordings cannot enter the published manifest.
rewards=set(t for values in quality.values() for t in values)
all_rewards=set(json.loads((root/'scripts/reward-texts.json').read_text('utf8')))
for key,entries in bank.items():
 for text in list(entries):
  if text in all_rewards and text not in quality.get(key,[]):del entries[text]
urls=set(url for entries in bank.values() for url in entries.values())
urls.update(url for entries in parts.values() for group in entries.values() for url in group)
mapped={}
for url in urls:
 src=(source/url.removeprefix('./')).resolve()
 if src.parent!=folder.resolve() or src.suffix!='.wav':raise ValueError('Invalid bank URL')
 samples,rate=sf.read(src,dtype='int16',always_2d=True)
 name=src.stem+'-'+hashlib.sha256(src.read_bytes()).hexdigest()[:12]+'.flac'
 dst=target/'assets/character-voices/ready'/name
 sf.write(dst,samples,rate,format='FLAC',subtype='PCM_16',compression_level=1.0)
 decoded,decoded_rate=sf.read(dst,dtype='int16',always_2d=True)
 if rate!=decoded_rate or not np.array_equal(samples,decoded):raise ValueError('PCM mismatch')
 mapped[url]='./assets/character-voices/ready/'+name
for entries in bank.values():
 for text,url in entries.items():entries[text]=mapped[url]
for entries in parts.values():
 for text,group in entries.items():entries[text]=[mapped[url] for url in group]
out=target/'assets/character-voices/ready'
(out/'manifest.json').write_text(json.dumps(bank,ensure_ascii=False),'utf8')
(out/'greeting-parts.json').write_text(json.dumps(parts,ensure_ascii=False),'utf8')
print(json.dumps({'losslessFiles':len(urls),'bytes':sum(p.stat().st_size for p in target.rglob('*') if p.is_file())}))
