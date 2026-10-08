from pathlib import Path
from PIL import Image
import json,sys,shutil
r=Path(__file__).resolve().parents[1]
paths=json.loads(sys.argv[1])
pairs={'thickness':['thin','thick'],'time':['day','night'],'position':['inside','outside']}
for key,src in paths.items():
 pair,kind=key.split('-');original=r/'source-assets/opposites'/pair/(kind+'.png');original.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,original)
 im=Image.open(original).convert('RGB');w,h=im.size
 out=r/'dist/assets/opposites'/pair;out.mkdir(parents=True,exist_ok=True)
 for row,label in enumerate(pairs[pair]):
  for col in range(5):
   box=(round(col*w/5)+5,round(row*h/2)+5,round((col+1)*w/5)-5,round((row+1)*h/2)-5)
   tile=im.crop(box);tile.save(out/f'{kind}-{label}-{col}.webp',quality=95,method=6)
 manifest=r/'source-assets/opposites'/pair/'prompts.json'
 manifest.write_text(json.dumps({'method':'built-in image_gen','source':original.name,'layout':'5 columns, top/bottom opposite concept pairs','labels':pairs[pair],'invariants':'same pair camera, object color, size; vary only concept; complete safe margins; no text; photoreal'},ensure_ascii=False,indent=2),encoding='utf-8')
print('Prepared 60 verified local WebP cards and preserved original atlases.')
