import fs from 'node:fs';
let html=fs.readFileSync('dist/action-teaching.html','utf8');
html=html.replace('Şu an beş eylemin videosu hazır. Farklı kişilerle ve farklı ortamlarda genelleme aşamaları yeni videolarla eklenecek.','30 eylem, her eylem için iki video örneği. İlk seviyede aynı örnek, sonraki seviyelerde farklı kişi ve ortam örnekleri kullanılır. Her seviyede beş deneme vardır.').replace('<script src="action-teaching-data.js">','<script src="action-video-library.js"></script><script src="action-catalog.js"></script><script src="action-teaching-data.js">');
fs.writeFileSync('dist/action-teaching.html',html);
let js=fs.readFileSync('dist/action-teaching.js','utf8');
js=js.replace('videos/${item.id}.jpg','videos/${item.video.poster}').replace('videos/${item.id}.mp4','videos/${item.video.file}').replace('Bu çocuk ne yapıyor? Söyle.','Ne yapıyor? Söyle.').replace('videos/${t.item.id}.mp4','videos/${t.item.video.file}').replace('videos/${t.item.id}.jpg','videos/${t.item.video.poster}');
fs.writeFileSync('dist/action-teaching.js',js);
let test=fs.readFileSync('scripts/check-action-teaching.mjs','utf8').replace("['naming-rules.js','action-teaching-data.js','action-teaching.js']","['naming-rules.js','action-video-library.js','action-catalog.js','action-teaching-data.js','action-teaching.js']");fs.writeFileSync('scripts/check-action-teaching.mjs',test);
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));pkg.version='0.20.0';fs.writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');
