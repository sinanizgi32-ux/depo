import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const context=vm.createContext({window:{},Math});
for(const file of ['matching-data','naming-scenes'])vm.runInContext(fs.readFileSync(new URL('../dist/'+file+'.js',import.meta.url),'utf8'),context);
const data=context.window.ObjectMatchingData,scenes=context.window.NamingScenes;
let count=0;
for(const item of Object.values(data.items)){
 const hashes=new Set();assert(scenes.environment(item));
 for(let i=0;i<5;i++){
  const image=fs.readFileSync(new URL('../dist/'+scenes.image(item.id,i).slice(2),import.meta.url));
  assert.equal(image.toString('ascii',0,4),'RIFF');assert.equal(image.toString('ascii',8,12),'WEBP');assert(image.length>1000);
  hashes.add(crypto.createHash('sha256').update(image).digest('hex'));count++;
 }
 assert.equal(hashes.size,5,item.id+' must have five different scenes');
}
assert.equal(scenes.environment(data.items.shampoo),'duş rafı');
assert.equal(scenes.environment(data.items.fish),'su altı');
assert.equal(scenes.environment(data.items.train),'raylar');
assert.equal(scenes.environment(data.items.ship),'su');
const engine=fs.readFileSync(new URL('../dist/naming-prototype.js',import.meta.url),'utf8');
assert(engine.includes('window.NamingScenes.image(t.item.id,index)'));
assert(!engine.includes('backdrop('));
console.log(`OK: ${count} full-scene photographs, five per noun, context routing and no pasted image backgrounds.`);
