import * as THREE from 'three';
export function gateTorches(parent){const torches=[];const iron=new THREE.MeshStandardMaterial({color:'#4a4337',roughness:.72,metalness:.6});const timber=new THREE.MeshStandardMaterial({color:'#63452c',roughness:.9});
 const add=(g,m,p,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;p.add(o);return o;};
 for(let i=0;i<5;i++){const g=new THREE.Group();g.name=`gate-torch-${i+1}`;g.position.set(-1.6+i*.8,4.7,1.06);parent.add(g);add(new THREE.BoxGeometry(.26,.42,.08),iron,g,0,-.05,-.16);add(new THREE.CylinderGeometry(.055,.065,.54,10),timber,g,0,.07,0);add(new THREE.CylinderGeometry(.15,.08,.18,12),iron,g,0,.38,0);for(let j=0;j<4;j++){const tine=add(new THREE.CylinderGeometry(.018,.018,.22,6),iron,g,Math.cos(j*Math.PI/2)*.12,.5,Math.sin(j*Math.PI/2)*.12);tine.rotation.z=Math.cos(j*Math.PI/2)*-.2;}
 const flame=new THREE.Group();flame.position.y=.56;g.add(flame);const outer=add(new THREE.SphereGeometry(.15,12,10),new THREE.MeshBasicMaterial({color:'#ee8134'}),flame,0,.09,0);outer.scale.set(.75,1.8,.75);const heart=add(new THREE.SphereGeometry(.095,12,10),new THREE.MeshBasicMaterial({color:'#ffe4a0'}),flame,0,.06,.045);heart.scale.set(.7,1.65,.7);flame.visible=false;
 const light=new THREE.PointLight('#ffbf67',0,3.5,2);light.position.set(0,.65,.3);g.add(light);torches.push({flame,light,lit:false});}
 return torches;
}
export function lightTorch(torch,on){torch.lit=on;torch.flame.visible=on;torch.light.intensity=on?1.8:0;}
export function updateTorches(torches,time){torches.forEach((t,i)=>{if(!t.lit)return;t.flame.scale.set(1+Math.sin(time*3+i)*.025,1+Math.sin(time*4+i)*.045,1);t.flame.rotation.z=Math.sin(time*2+i)*.05;t.light.intensity=1.8+Math.sin(time*3+i)*.1;});}
