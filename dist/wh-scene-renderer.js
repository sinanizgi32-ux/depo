/* Deterministic, continuously animated scenes used to export the local films. */
(()=>{'use strict';
 const W=960,H=540,skin=['#f2c5a4','#b98260','#e0af8d','#9a6148','#f6d3bb'],shirts=['#3c92bf','#d97083','#7c74c5','#43a68c','#e7ad43'];
 const clamp=n=>Math.max(0,Math.min(1,n)),ease=n=>{n=clamp(n);return n*n*(3-2*n);},mix=(a,b,t)=>a+(b-a)*ease(t);
 function shape(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=3;c.stroke();}}
 function ellipse(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
 function line(c,x,y,xx,yy,color,width=9){c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
 function prop(c,name,x,y,scale=1,angle=0,fillLevel=1){c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);
  if(name==='top'){ellipse(c,0,0,24,24,'#ee714e');ellipse(c,-6,-7,8,8,'#ffd164');line(c,-22,0,22,0,'#f9d890',3);line(c,0,-22,0,22,'#f9d890',3);}
  else if(name==='kitap'){shape(c,-27,-21,54,42,4,'#4ba7ab','#24747f');shape(c,-21,-16,42,29,2,'#fff5da');line(c,0,-15,0,13,'#cebaa5',2);for(let i=0;i<3;i++){line(c,-17,-8+i*7,-5,-8+i*7,'#c5bead',2);line(c,5,-8+i*7,17,-8+i*7,'#c5bead',2);}}
  else if(name==='bardak'){shape(c,-16,-23,32,45,5,'#e7f8ff','#649cab');if(fillLevel>.01)shape(c,-12,19-20*fillLevel,24,20*fillLevel,2,'#76cce8');ellipse(c,0,-23,16,4,'#d1f0f4');}
  else if(name==='kalem'){c.rotate(-.4);shape(c,-4,-29,8,52,2,'#ebbc44','#bb9131');c.beginPath();c.moveTo(-4,23);c.lineTo(4,23);c.lineTo(0,33);c.closePath();c.fillStyle='#594334';c.fill();}
  else if(name==='elma'){ellipse(c,-7,0,17,21,'#ee6251');ellipse(c,8,0,17,21,'#ee6251');line(c,0,-19,2,-29,'#79603f',4);ellipse(c,10,-25,10,4,'#5c9f53');}
  else if(name==='havlu'){shape(c,-27,-20,54,40,5,'#55a7ce','#3484af');line(c,-21,-13,21,-13,'#cae7ef',3);line(c,-21,13,21,13,'#cae7ef',3);}
  else if(name==='sulama kabı'){shape(c,-22,-12,44,34,8,'#54a99a','#287d73');line(c,18,0,40,-17,'#54a99a',12);c.beginPath();c.arc(-27,-1,16,Math.PI*.5,Math.PI*1.5);c.strokeStyle='#348c82';c.lineWidth=7;c.stroke();}
  else if(name==='araba'){shape(c,-30,-9,60,22,6,'#e9b147','#bf8c32');shape(c,-17,-24,34,20,6,'#e9b147');shape(c,-12,-20,24,10,2,'#b9e9f1');ellipse(c,-19,14,9,9,'#3d5369');ellipse(c,19,14,9,9,'#3d5369');}
  else if(name==='çiçek'){shape(c,-20,5,40,32,4,'#bd805d');line(c,0,10,0,-42,'#5d9955',5);ellipse(c,-11,-17,12,5,'#70ab64');for(let i=0;i<6;i++){const a=i*Math.PI/3;ellipse(c,Math.cos(a)*12,-42+Math.sin(a)*12,9,9,'#efbd48');}ellipse(c,0,-42,8,8,'#aa7445');}
  c.restore();
 }
 function child(c,x,feet,palette,left,right,walk=0,scale=1,face='happy'){
  c.save();c.translate(x,feet);c.scale(scale,scale);const tone=skin[palette%5],shirt=shirts[palette%5];
  ellipse(c,0,4,49,9,'#24415b22');
  const swing=Math.sin(walk)*13;line(c,-15,-59,-20+swing,-10,'#405775',18);line(c,15,-59,20-swing,-10,'#405775',18);
  shape(c,-32+swing,-13,30,15,7,'#f3f1e9','#51677d');shape(c,7-swing,-13,30,15,7,'#f3f1e9','#51677d');
  shape(c,-34,-127,68,79,17,shirt);shape(c,-13,-144,26,27,8,tone);
  const arm=(side,hand)=>{const sx=side*29,sy=-114,tx=hand[0]-x,ty=hand[1]-feet;const ex=(sx+tx)/2+side*9,ey=(sy+ty)/2+9;line(c,sx,sy,ex,ey,tone,15);line(c,ex,ey,tx,ty,tone,13);ellipse(c,tx,ty,9,9,tone);};
  arm(-1,left);arm(1,right);
  ellipse(c,-36,-168,8,11,tone);ellipse(c,36,-168,8,11,tone);ellipse(c,0,-173,37,43,tone);
  c.beginPath();c.moveTo(-35,-179);c.bezierCurveTo(-43,-224,27,-232,36,-182);c.bezierCurveTo(18,-208,0,-190,-24,-193);c.closePath();c.fillStyle=['#49372d','#332e33','#65472f','#352c28','#77503a'][palette%5];c.fill();
  ellipse(c,-13,-174,3.2,4.5,'#344052');ellipse(c,13,-174,3.2,4.5,'#344052');ellipse(c,-20,-161,7,3,'#e6978e66');ellipse(c,20,-161,7,3,'#e6978e66');line(c,0,-170,-2,-160,'#bb8a6d',2);
  c.beginPath();c.arc(0,-158,9,.15,Math.PI-.15);c.strokeStyle='#9b5a57';c.lineWidth=2.5;c.stroke();c.restore();
 }
 const initial=()=>({x:270,px:360,py:333,holding:false,hidden:false,angle:0,walk:0,draw:0,water:0,fill:1});
 function step(state,a,p,n){const s={...state};p=clamp(p);s.walk=0;s.left=[s.x-42,364];s.right=[s.x+42,364];
  const reach=(x,y)=>{s.right=[mix(s.x+42,x,p),mix(364,y,p)];};
  if(a==='yürü'){s.x=mix(state.x,state.x<400?480:300,p);s.walk=p*Math.PI*6;s.left=[s.x-42+Math.sin(s.walk)*7,364];s.right=[s.x+42-Math.sin(s.walk)*7,364];}
  if(a==='al'){s.x=mix(state.x,Math.max(190,Math.min(690,state.px-55)),p);s.right=[mix(state.x+42,state.px,Math.min(1,p*2)),mix(364,state.py,Math.min(1,p*2))];if(p>.48){s.px=mix(state.px,s.x+55,(p-.48)/.52);s.py=mix(state.py,340,(p-.48)/.52);s.right=[s.px,s.py];s.holding=true;}}
  if(a==='düşür'){s.py=mix(state.py,427,p);s.angle=p*Math.PI*.8;s.holding=false;}
  if(a==='kutuya koy'||a==='ver'){s.x=mix(state.x,620,p*.9);s.walk=p*Math.PI*6;s.px=mix(state.px,a==='ver'?727:755,p);s.py=mix(state.py,a==='ver'?342:399,p);s.right=[s.px,s.py];if(p>.9)s.holding=false;}
  if(a==='iç'||a==='ye'){s.px=mix(state.px,s.x+22,Math.min(1,p*2));s.py=mix(state.py,a==='iç'?320:305,Math.min(1,p*2));s.angle=a==='iç'?-Math.sin(p*Math.PI)*.4:0;s.right=[s.px,s.py];if(a==='iç')s.fill=1-p;if(a==='ye'&&p>.82)s.hidden=true;}
  if(a==='oku'){s.px=s.x+36;s.py=328+Math.sin(p*Math.PI*2)*2;s.right=[s.px,s.py];s.left=[s.x+2,333];}
  if(a==='çiz'){s.px=486+Math.sin(p*Math.PI*5)*18;s.py=353+Math.cos(p*Math.PI*5)*8;s.x=mix(state.x,422,Math.min(1,p*2));s.right=[s.px,s.py];s.draw=p;}
  if(a==='kurula'){s.px=s.x+25+Math.sin(p*Math.PI*4)*12;s.py=344;s.right=[s.px+8,s.py];s.left=[s.px-8,s.py];}
  if(a==='yıka'){s.x=mix(state.x,422,p);s.px=488+Math.sin(p*Math.PI*4)*8;s.py=350;s.right=[s.px,s.py];s.water=Math.sin(p*Math.PI);}
  if(a==='sula'){s.x=mix(state.x,488,p);s.px=574;s.py=334;s.angle=.5*Math.sin(p*Math.PI);s.right=[s.px-15,s.py];s.water=Math.sin(p*Math.PI);}
  if(a==='selamla'){s.right=[s.x+60+Math.sin(p*Math.PI*6)*9,282];}
  if(s.holding&&a==='yürü'){s.px=s.x+55;s.py=340+Math.sin(s.walk)*3;s.right=[s.px,s.py];}
  return s;
 }
 function draw(canvas,story,time,bg){const c=canvas.getContext('2d');canvas.width=W;canvas.height=H;
  if(bg){c.drawImage(bg,0,0,W,H);c.fillStyle='#fff9e51c';c.fillRect(0,0,W,H);}else{c.fillStyle='#eaf3ed';c.fillRect(0,0,W,H);}
  c.fillStyle='#faf3eae8';c.fillRect(0,415,W,125);
  let s=initial(),t=Math.max(0,time-.4),idx=Math.min(story.actions.length-1,Math.floor(t/3)),p=clamp((t-idx*3)/3);
  for(let i=0;i<idx;i++)s=step(s,story.actions[i],1,i);s=step(s,story.actions[idx],p,idx);
  shape(c,322,346,89,12,4,'#dba96e');line(c,331,358,331,435,'#b88a5b',9);line(c,401,358,401,435,'#b88a5b',9);
  if(story.actions.includes('çiz')||story.actions.includes('yıka')){shape(c,450,359,107,12,4,'#dba96e');line(c,459,371,459,435,'#b88a5b',9);line(c,548,371,548,435,'#b88a5b',9);shape(c,463,343,78,15,3,story.actions.includes('çiz')?'#fffdf5':'#b8e6f4');if(s.draw){line(c,475,353,475+45*s.draw,344,'#5e9dbb',3);}}
  if(story.actions.includes('sula'))prop(c,'çiçek',631,371,1.2);
  if(story.actions.includes('kutuya koy')){shape(c,720,385,95,62,7,'#91b5c5','#5b8598');ellipse(c,767,385,46,11,'#688f9e');}
  const friend=story.actions.includes('ver')||story.actions.includes('selamla');
  if(friend){child(c,790,445,(story.palette+2)%5,[747,343],[832,364],0,.92);shape(c,737,452,106,26,13,'#ffffffde');c.fillStyle='#425367';c.font='600 17px sans-serif';c.textAlign='center';c.fillText(story.friend,790,471);}
  child(c,s.x,445,story.palette,s.left||[s.x-42,364],s.right||[s.x+42,364],s.walk);
  if(!s.hidden)prop(c,story.object,s.px,s.py,1,s.angle,s.fill);
  if(story.actions[idx]==='kutuya koy'&&p>.7)shape(c,720,400,95,47,5,'#91b5c5','#5b8598');
  if(s.water>.05){for(let i=0;i<6;i++){const yy=354+((time*90+i*15)%45);ellipse(c,story.object==='elma'?490:603+i*3,yy,2,5,'#64b8e8');}}
  shape(c,s.x-53,452,106,26,13,'#ffffffde');c.fillStyle='#425367';c.font='600 17px sans-serif';c.textAlign='center';c.fillText(story.actor,s.x,471);
  // A time marker remains explicit rather than relying on background lighting.
  shape(c,18,18,180,52,20,'#ffffffeb');ellipse(c,46,44,13,13,story.time==='akşam'?'#d6c887':'#f4c952');c.fillStyle='#46566b';c.textAlign='left';c.font='600 18px sans-serif';c.fillText(story.time==='öğleden sonra'?'Öğleden sonra':story.time==='sabah'?'Sabah':'Akşam',70,50);
 }
 window.WhScene={draw,prop,child,width:W,height:H};
})();
