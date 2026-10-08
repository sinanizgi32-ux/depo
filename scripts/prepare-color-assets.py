"""Crop reviewed generated contact sheets into independent lossless teaching assets."""
from pathlib import Path
from PIL import Image
from collections import deque
import numpy as np
import shutil,json
ROOT=Path(__file__).resolve().parent.parent
SRC=Path('C:/Users/sinan/.codex/generated_images/01a10cf0-0a37-7a02-93d3-8367278741a6')
OUT=ROOT/'dist/assets/colors'; OUT.mkdir(parents=True,exist_ok=True)
sources={
 'red':'866328df-129a-4889-a2f5-b9daee41fd29',
 'blue':'e2aa0761-42ff-4a75-861e-b2cbc9c975fb',
 'yellow':'0f3fa4b8-aae4-45ee-a6b9-1d86d370e1eb',
 'green':'4ec80640-fd61-4090-a657-ae31481b1db5',
 'extras':'7533004d-29be-4a22-869f-2eec5cfb585c',
 'regions':'a7b6678e-29d5-44f6-a49a-74bcf625cd47',
 'rooms':'3131e622-5e5f-4bb5-81e8-9bf2bc076736',
 'natural':'00c684b8-eff8-4efe-9836-b45a74a0836f',
 'completion':'c1edacec-19d4-41de-9892-1694bdc10925'}
originals=ROOT/'source-assets/colors'; originals.mkdir(parents=True,exist_ok=True)
def object_bounds(im,box):
 """Select the central complete object; crop only, do not change any pixels."""
 band=im.crop(box); pixels=np.asarray(band.convert('RGB'));mask=pixels.min(axis=2)<225
 seen=np.zeros(mask.shape,dtype=bool);height,width=mask.shape;groups=[]
 for yy,xx in zip(*np.where(mask)):
  if seen[yy,xx]:continue
  todo=deque([(yy,xx)]);seen[yy,xx]=True;size=0;left=right=int(xx);top=bottom=int(yy)
  while todo:
   y,x=todo.popleft();size+=1;left=min(left,x);right=max(right,x);top=min(top,y);bottom=max(bottom,y)
   for dy,dx in [(-1,0),(1,0),(0,-1),(0,1)]:
    ny,nx=y+dy,x+dx
    if 0<=ny<height and 0<=nx<width and mask[ny,nx] and not seen[ny,nx]:seen[ny,nx]=True;todo.append((ny,nx))
  if size>100 and top<=height*.6 and bottom>=height*.35:groups.append((size/(1+abs((top+bottom)/2-height/2)/height*4),(left,top,right+1,bottom+1)))
 if not groups:return box
 _,(l,t,r,b)=max(groups)
 return(box[0]+max(0,l-7),box[1]+max(0,t-7),box[0]+min(width,r+7),box[1]+min(height,b+7))
def atlas(key,rows,cols,names):
 path=SRC/f'exec-{sources[key]}.png'; shutil.copy2(path,originals/f'{key}-atlas.png')
 im=Image.open(path)
 bounds={'red':[0,240,478,700,970,1254],'blue':[0,245,485,701,949,1254],'yellow':[0,245,475,692,935,1254],'green':[0,246,498,721,959,1254],'extras':[0,312,611,928,1254],'completion':[0,410,794,1254]}.get(key)
 for n,name in enumerate(names):
  y,x=divmod(n,cols)
  top=round(bounds[y]*im.height/1254) if bounds else round(y*im.height/rows)
  bottom=round(bounds[y+1]*im.height/1254) if bounds else round((y+1)*im.height/rows)
  box=(round(x*im.width/cols)+4,top+4,round((x+1)*im.width/cols)-4,bottom-4)
  if bounds:
   expanded=(box[0],max(0,box[1]-32),box[2],min(im.height,box[3]+32))
   box=object_bounds(im,expanded)
  im.crop(box).save(OUT/f'{name}.webp',lossless=True,method=6)
for color in ['red','blue','yellow','green']:
 atlas(color,5,5,[f'{obj}-{color}-{i+1}' for obj in ['sock','book','pencil','wardrobe','door'] for i in range(5)])
atlas('extras',4,4,[f'{o}-{c}-1' for c,objects in [('red',['car','notebook','apple','cherry']),('blue',['car','notebook','sharpener','cake']),('yellow',['car','notebook','sharpener','flower']),('green',['car','notebook','apple','cake'])] for o in objects])
atlas('regions',2,3,['scene-ball','scene-cake','scene-flower','scene-eraser','scene-sign','scene-shelf'])
atlas('rooms',2,2,['room-red','room-blue','room-yellow','room-green'])
atlas('natural',2,2,['scene-child','scene-bird','scene-garden','scene-pencils'])
atlas('completion',3,4,[f'{obj}-{c}-1' for obj in ['sharpener','cake','flower'] for c in ['red','blue','yellow','green']])
(OUT/'sources.json').write_text(json.dumps({'tool':'built-in image_gen','originals':'source-assets/colors','atlasFiles':sources,'processing':'Equal-grid crop only; original colors retained; lossless WebP.','document':'renk-kavrami-son-3.docx','date':'2026-10-08'},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(list(OUT.glob("*.webp")))} lossless color images prepared.')
