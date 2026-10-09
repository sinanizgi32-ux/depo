from pathlib import Path
from PIL import Image
import shutil,sys,json
root=Path(__file__).resolve().parent.parent
source=Path(sys.argv[1])
out=root/'dist/assets/5n1k/backgrounds';out.mkdir(parents=True,exist_ok=True)
original=root/'source-assets/5n1k';original.mkdir(parents=True,exist_ok=True)
shutil.copy2(source,original/'background-atlas.png')
img=Image.open(source)
names=['park','classroom','kitchen','bathroom','bedroom','library','schoolyard','garden','street','playroom']
for i,name in enumerate(names):
 x=i%5;y=i//5;w=img.width/5;h=img.height/2
 # Exclude the narrow white gutters from the generated atlas.
 crop=img.crop((round(x*w+7),round(y*h+7),round((x+1)*w-7),round((y+1)*h-7)))
 crop.save(out/(name+'.webp'),quality=96)
print('10 temiz ortam arka planı hazır.')
