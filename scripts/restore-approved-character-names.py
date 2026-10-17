"""Restore only the actor-name excerpts from the user's approved references."""
from pathlib import Path
import hashlib,json
import soundfile as sf
root=Path(__file__).resolve().parent.parent
spec=json.loads((root/'source-assets/character-voices/name-excerpts.json').read_text('utf8'))
bank=json.loads((root/'dist/assets/character-voices/ready/manifest.json').read_text('utf8'))
backup=root/'outputs/original-generated-names';backup.mkdir(parents=True,exist_ok=True)
for key,entry in spec.items():
 source=root/entry['source']
 if hashlib.sha256(source.read_bytes()).hexdigest()!=entry['sourceSha256']:raise ValueError('Reference changed; review the excerpt times again.')
 target=(root/'dist'/bank[key][entry['text']].removeprefix('./')).resolve()
 if target.parent!=(root/'dist/assets/character-voices/ready').resolve():raise ValueError('Invalid bank path')
 if not (backup/target.name).exists():(backup/target.name).write_bytes(target.read_bytes())
 samples,rate=sf.read(source,dtype='int16',always_2d=True)
 clip=samples[round(entry['start']*rate):round(entry['end']*rate)]
 sf.write(target,clip,rate,format='WAV',subtype='PCM_16')
 if hashlib.sha256(target.read_bytes()).hexdigest()!=entry['clipSha256']:raise ValueError('Excerpt no longer matches approved samples')
 print(key+' approved name restored')
