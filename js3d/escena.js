/* Estrella del Balón · escenas 3D (módulo ES, se carga solo cuando hace falta).
   Three.js + maniquíes de Quaternius (CC0) con animaciones de captura (correr, saltar, bailar, deslizarse, caer…).
   El golpeo al balón y la estirada del portero se hacen moviendo los huesos por código.
   Escenas: pen (penalti), gol (gol de jugada, a veces con regate), asis (pase decisivo), entrada (entrada en plancha) y corner. */
import * as THREE from 'three';
import {GLTFLoader} from '../vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {clone as skClone} from '../vendor/three/examples/jsm/utils/SkeletonUtils.js';

let R=null,SC=null,CAM=null,CLOCK=null,ASSETS=null,ACTIVE=null,WRAP=null,BALLTEX=null;
const GW=7.32,GH=2.44;

function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
async function loadAssets(){
 if(ASSETS)return ASSETS;
 const L=new GLTFLoader(),base=new URL('../3d/',import.meta.url).href;
 const [a,b]=await Promise.all([L.loadAsync(base+'jugador-a.glb'),L.loadAsync(base+'jugador-b.glb')]);
 ASSETS={a,b};return ASSETS;
}
function setup(){
 if(R)return;
 WRAP=el('div','s3d-wrap');WRAP.setAttribute('role','dialog');WRAP.setAttribute('aria-label','Jugada en 3D');
 const box=el('div','s3d-box'),cap=el('div','s3d-cap'),skip=el('button','go alt s3d-skip','Saltar');
 R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.shadowMap.enabled=true;
 box.appendChild(R.domElement);box.appendChild(cap);box.appendChild(skip);WRAP.appendChild(box);
 skip.addEventListener('click',()=>{if(ACTIVE)ACTIVE.done();});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&ACTIVE)ACTIVE.done();});
 CAM=new THREE.PerspectiveCamera(42,16/9,0.1,200);CLOCK=new THREE.Clock();
}
function size(){const w=Math.min(window.innerWidth*0.94,960),h=w*9/16;R.setSize(w,h);CAM.aspect=w/h;CAM.updateProjectionMatrix();}
/* ---------- campo, portería y balón ---------- */
function grassTex(){const c=document.createElement('canvas');c.width=512;c.height=512;const g=c.getContext('2d');
 for(let i=0;i<8;i++){g.fillStyle=i%2?'#2a8a4c':'#24803f';g.fillRect(0,i*64,512,64);}
 for(let i=0;i<4000;i++){g.fillStyle='rgba(0,0,0,'+(Math.random()*0.05)+')';g.fillRect(Math.random()*512,Math.random()*512,2,2);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,6);t.colorSpace=THREE.SRGBColorSpace;return t;}
function ballTex(){if(BALLTEX)return BALLTEX;const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,256,128);g.fillStyle='#111';
 for(let i=0;i<10;i++){const x=(i%5)*52+(i>4?26:0)+10,y=i>4?88:30;g.beginPath();for(let k=0;k<5;k++){const a=k*Math.PI*2/5-Math.PI/2;g.lineTo(x+12*Math.cos(a),y+12*Math.sin(a));}g.fill();}
 BALLTEX=new THREE.CanvasTexture(c);BALLTEX.colorSpace=THREE.SRGBColorSpace;return BALLTEX;}
function line(x1,z1,x2,z2,w){const m=new THREE.Mesh(new THREE.PlaneGeometry(Math.hypot(x2-x1,z2-z1),w||0.12),new THREE.MeshBasicMaterial({color:0xffffff}));m.rotation.x=-Math.PI/2;m.rotation.z=-Math.atan2(z2-z1,x2-x1);m.position.set((x1+x2)/2,0.012,(z1+z2)/2);return m;}
function buildPitch(){
 const s=new THREE.Scene();s.background=new THREE.Color(0x0d1a2c);s.fog=new THREE.Fog(0x0d1a2c,40,90);
 s.add(new THREE.HemisphereLight(0xdde8ff,0x2a4a2a,1.1));const sun=new THREE.DirectionalLight(0xffffff,2.2);sun.position.set(-12,25,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20});s.add(sun);
 const g=new THREE.Mesh(new THREE.PlaneGeometry(70,60),new THREE.MeshStandardMaterial({map:grassTex(),roughness:1}));g.rotation.x=-Math.PI/2;g.position.z=20;g.receiveShadow=true;s.add(g);
 /* área grande, pequeña, punto de penalti y frontal */
 [[-20.16,0,-20.16,16.5],[20.16,0,20.16,16.5],[-20.16,16.5,20.16,16.5],[-9.16,0,-9.16,5.5],[9.16,0,9.16,5.5],[-9.16,5.5,9.16,5.5],[-34,0,34,0]].forEach(a=>s.add(line(a[0],a[1],a[2],a[3])));
 const spot=new THREE.Mesh(new THREE.CircleGeometry(0.15,16),new THREE.MeshBasicMaterial({color:0xffffff}));spot.rotation.x=-Math.PI/2;spot.position.set(0,0.013,11);s.add(spot);
 /* portería con red */
 const post=new THREE.MeshStandardMaterial({color:0xffffff,roughness:0.4}),r=0.06;
 [[-GW/2,GH/2,0,GH],[GW/2,GH/2,0,GH]].forEach(p=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,p[3],12),post);m.position.set(p[0],p[1],p[2]);m.castShadow=true;s.add(m);});
 const bar=new THREE.Mesh(new THREE.CylinderGeometry(r,r,GW+r*2,12),post);bar.rotation.z=Math.PI/2;bar.position.set(0,GH,0);s.add(bar);
 const netM=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.45}),pts=[];
 for(let x=-GW/2;x<=GW/2+0.01;x+=0.3){pts.push(x,GH,0,x,GH,-1.6,x,GH,-1.6,x,0,-2.0);}
 for(let y=0;y<=GH+0.01;y+=0.3){pts.push(-GW/2,y,-1.6-0.4*(1-y/GH),GW/2,y,-1.6-0.4*(1-y/GH));}
 for(let z=0;z>=-2.0;z-=0.3){pts.push(-GW/2,0,z,-GW/2,GH,Math.max(z,-1.6),GW/2,0,z,GW/2,GH,Math.max(z,-1.6));}
 const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));const net=new THREE.LineSegments(ng,netM);s.add(net);s.userData.net=net;
 /* gradas sencillas al fondo */
 /* grada escalonada con público */
 const stM=new THREE.MeshStandardMaterial({color:0x5b6b86,roughness:0.9});
 for(let k=0;k<5;k++){const st=new THREE.Mesh(new THREE.BoxGeometry(80,1.6,1.6),stM);st.position.set(0,0.8+k*1.6,-9.5-k*1.6);s.add(st);
  for(let i=0;i<70;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.22,6,6),new THREE.MeshBasicMaterial({color:[0xf5c542,0xffffff,0x2bd47d,0xe53935,0x5aa9ff,0x1565c0][(i+k)%6]}));f.position.set(-38+i*1.1+Math.random()*0.4,1.85+k*1.6,-9.5-k*1.6);s.add(f);}}
 return s;
}
function makeBall(){const b=new THREE.Mesh(new THREE.SphereGeometry(0.11,24,16),new THREE.MeshStandardMaterial({map:ballTex(),roughness:0.5}));b.castShadow=true;b.position.y=0.11;return b;}
/* ---------- jugadores ---------- */
function makePlayer(kind,color){
 const src=ASSETS[kind],obj=skClone(src.scene),col=new THREE.Color(color);
 obj.traverse(o=>{if(o.isMesh){o.castShadow=true;o.material=o.material.clone();
  if(/Main/i.test(o.material.name))o.material.color=col;else o.material.color=new THREE.Color(0x222222);}});
 const mixer=new THREE.AnimationMixer(obj),clips={};src.animations.forEach(c=>clips[c.name]=c);
 const bone=re=>{let f=null;obj.traverse(o=>{if(!f&&o.isBone&&re.test(o.name))f=o;});return f;};
 const P={obj,mixer,cur:null,
  thighR:bone(/thigh.?r$/i),shinR:bone(/(shin.?r|calf_r)$/i),thighL:bone(/thigh.?l$/i),spine:bone(/spine.?0?0?3$|spine_03$/i),
  play(name,fade,once){const c=clips[name];if(!c)return;const a=mixer.clipAction(c);a.reset();a.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat);a.clampWhenFinished=!!once;
   if(P.cur&&P.cur!==a)P.cur.crossFadeTo(a,fade||0.2,false);a.play();P.cur=a;}};
 return P;
}
/* golpeo: la pierna derecha va atrás y luego adelante (k de 0 a 1) */
function kickPose(P,k,power){if(!P.thighR)return;const back=k<0.45?k/0.45:1-(k-0.45)/0.55,fwd=k<0.45?0:(k-0.45)/0.55;
 P.thighR.rotation.x+=(-0.9*back+1.6*Math.sin(Math.min(1,fwd)*Math.PI/2)*(0.8+0.3*power));if(P.shinR)P.shinR.rotation.x+=(1.2*back-0.9*fwd*0.5);
 if(P.spine)P.spine.rotation.x+=-0.15*fwd;}
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const lerp=(a,b,t)=>a+(b-a)*t;
/* trayectoria del balón con una pequeña parábola */
function ballAt(a,b,t,h){t=Math.max(0,Math.min(1,t));return new THREE.Vector3(lerp(a.x,b.x,t),lerp(a.y,b.y,t)+Math.sin(t*Math.PI)*(h||0),lerp(a.z,b.z,t));}

/* ---------- celebraciones ---------- */
const CELEB=['dance','jump','yes','slide','fold'];
function celebrate(sc,scorer,color,mate,t0,kind){
 /* algunas celebraciones son del segundo maniquí: se cambia al mismo sitio */
 let P=scorer;const useB=kind==='yes'||kind==='slide'||kind==='fold';
 if(useB){P=makePlayer('b',color);P.obj.position.copy(scorer.obj.position);P.obj.rotation.y=Math.PI;sc.add(P.obj);scorer.obj.visible=false;}
 if(kind==='dance')P.play('Dance_Loop',0.3);else if(kind==='jump')P.play('Jump_Start',0.2,true);else if(kind==='yes')P.play('Yes',0.2);else if(kind==='slide')P.play('Slide_Start',0.2,true);else P.play('Idle_FoldArms_Loop',0.3);
 if(mate){mate.play('Sprint_Loop',0.2);}
 return {P,kind,t0};
}

/* ---------- escenas ---------- */
function scenePen(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),ball=makeBall();
 me.obj.position.set(-1.2,0,14.2);me.obj.rotation.y=Math.PI+0.35;gk.obj.position.set(0,0,0.3);sc.add(me.obj,gk.obj,ball);ball.position.set(0,0.11,11);
 me.play('Jog_Fwd_Loop');gk.play('Idle_Loop');
 const aim=o.aim||{d:'cen',h:'media',w:'media'},out=o.out||'gol',gd=o.gkDir||'cen',pw={suave:0,media:0.5,fuerte:1}[aim.w];
 let tx={izq:-2.6,cen:0,der:2.6}[aim.d],ty={abajo:0.25,media:1.2,arriba:2.05}[aim.h],tz=-0.6;
 if(out==='fuera'){if(aim.h==='arriba')ty=3.1;else tx=aim.d==='der'?4.4:aim.d==='izq'?-4.4:tx+4.2;tz=-3;}
 const gx={izq:-2.4,cen:0,der:2.4}[gd],tKick=1.35,fly=lerp(0.75,0.38,pw),tHit=tKick+fly;
 if(out==='parada'){tx=gx*0.85;ty=Math.min(1.6,ty);tz=0.2;}
 const start=new THREE.Vector3(0,0.11,11),end=new THREE.Vector3(tx,ty,tz),rebound=new THREE.Vector3(tx*1.4,0.11,4.5);let cel=null;
 CAM.position.set(-0.4,1.7,17.2);CAM.lookAt(0,1.1,0);
 return {len:out==='gol'?6.4:5.2,cap:{gol:'¡GOL!',parada:'¡PARADA!',fuera:'¡FUERA!'}[out],tCap:tHit+0.1,update(t){
  /* carrerilla */
  const run=ease(t/tKick);me.obj.position.set(lerp(-1.2,-0.35,run),0,lerp(14.2,11.5,run));
  if(t>=tKick-0.05&&!me.k){me.k=1;me.play('Idle_Loop',0.1);}
  /* portero: se lanza justo al golpeo */
  if(t>=tKick-0.05&&gd!=='cen'&&!gk.j){gk.j=1;gk.play('Jump_Loop',0.1);}
  const dv=ease((t-tKick+0.05)/0.5);if(gd!=='cen'){gk.obj.position.x=gx*dv;gk.obj.position.y=Math.sin(Math.min(1,dv)*Math.PI)*0.5;gk.obj.rotation.z=(gd==='izq'?1:-1)*1.25*dv;}
  /* balón */
  if(t<tKick+0.12)ball.position.copy(start);
  else if(t<tHit)ball.position.copy(ballAt(start,end,(t-tKick-0.12)/(fly-0.12),out==='fuera'&&aim.h==='arriba'?0.6:0.25));
  else if(out==='parada')ball.position.copy(ballAt(end,rebound,(t-tHit)/0.7,0.8));
  else if(out==='gol')ball.position.copy(ballAt(end,new THREE.Vector3(tx*0.9,0.11,-1.7),(t-tHit)/0.5,0));
  ball.rotation.x-=0.3;
  if(out==='gol'&&t>tHit&&t<tHit+0.5)sc.userData.net.position.z=-0.15*Math.sin((t-tHit)*Math.PI*4)*(1-(t-tHit)*2);
  /* después: celebración, lamento o alegría del portero */
  if(t>tHit+0.6&&!cel){cel=1;if(out==='gol'){me.obj.rotation.y=0;const k=CELEB[Math.floor(Math.random()*CELEB.length)];cel=celebrate(sc,me,o.kit||'#1565c0',null,t,k);}
   else{const B=makePlayer('b',o.kit||'#1565c0');B.obj.position.copy(me.obj.position);B.obj.rotation.y=Math.PI;sc.add(B.obj);me.obj.visible=false;B.play('Idle_No_Loop',0.2);cel={P:B};
    if(out==='parada'){gk.obj.rotation.z=0;gk.obj.position.y=0;gk.play('Jump_Start',0.2,true);}}}
  if(cel&&cel.kind==='slide'&&t>cel.t0+0.5){cel.P.obj.position.z+=0.04;}
  /* cámara: sigue al balón y luego se acerca al lanzador */
  if(t>tHit+0.6){const p=(cel&&cel.P?cel.P:me).obj.position;CAM.position.lerp(new THREE.Vector3(p.x+2.2,1.9,p.z+4.2),0.04);CAM.lookAt(p.x,1.1,p.z);}
  me.t=t;if(t>tKick-0.25&&t<tKick+0.35)kickPose(me,(t-tKick+0.25)/0.6,pw);
 },mixers:()=>[me,gk].concat(cel&&cel.P?[cel.P]:[])};
}
function sceneGol(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),df=makePlayer('a','#e53935'),gk=makePlayer('a','#f5c542'),ball=makeBall(),dribble=!!o.dribble,head=!!o.head;
 const side=Math.random()<0.5?-1:1,gd=-side;sc.add(me.obj,df.obj,gk.obj,ball);
 me.obj.position.set(side*6,0,26);me.obj.rotation.y=Math.PI;df.obj.position.set(side*3,0,16);df.obj.rotation.y=0;gk.obj.position.set(0,0,0.4);
 me.play('Sprint_Loop');df.play('Jog_Fwd_Loop');gk.play('Idle_Loop');
 const tShot=dribble?2.6:1.9,shotFrom=new THREE.Vector3(side*1.8,0.11,dribble?12.5:15),goalT=new THREE.Vector3(gd*2.7,0.6+Math.random()*1.2,-0.6);let cel=null;
 CAM.position.set(side*9,3.2,30);CAM.lookAt(0,1,12);
 return {len:6.6,cap:'¡GOOOL!',tCap:tShot+0.6,update(t){
  const k=ease(t/tShot);const x=lerp(side*6,side*1.8,k)+(dribble?Math.sin(Math.max(0,(t-1.2))*4)*(t>1.2&&t<2.2?0.9:0):0),z=lerp(26,shotFrom.z,k);
  if(t<tShot){me.obj.position.set(x,0,z);ball.position.set(x+0.25*side*-1,0.11,z-0.6);ball.rotation.x-=0.25;}
  /* el defensa sale a por él; en el regate se queda atrás y cae */
  if(t<tShot){df.obj.position.lerp(new THREE.Vector3(me.obj.position.x,0,me.obj.position.z-1.2),0.03);df.obj.lookAt(me.obj.position.x,0,me.obj.position.z);}
  if(dribble&&t>1.7&&!df.f){df.f=1;df.play('Death01',0.15,true);}
  if(t>=tShot-0.05&&!me.k){me.k=1;me.play('Idle_Loop',0.1);}
  if(t>tShot-0.25&&t<tShot+0.35)kickPose(me,(t-tShot+0.25)/0.6,0.8);
  if(t>tShot+0.05&&!gk.j){gk.j=1;gk.play('Jump_Loop',0.1);}
  const dv=ease((t-tShot-0.05)/0.5);gk.obj.position.x=-gd*1.8*dv;gk.obj.rotation.z=(gd>0?1:-1)*1.2*dv;gk.obj.position.y=Math.sin(Math.min(1,dv)*Math.PI)*0.4;
  if(t>=tShot)ball.position.copy(ballAt(shotFrom,goalT,(t-tShot)/0.55,0.3));
  if(t>tShot+0.55&&t<tShot+1)sc.userData.net.position.z=-0.15*Math.sin((t-tShot)*12)*(1-(t-tShot-0.55)*2);
  if(t>tShot+0.9&&!cel){me.obj.rotation.y=0;cel=celebrate(sc,me,o.kit||'#1565c0',null,t,CELEB[Math.floor(Math.random()*CELEB.length)]);}
  if(cel&&cel.kind==='slide')cel.P.obj.position.z+=0.04;
  const p=(cel&&cel.P?cel.P:me).obj.position;
  if(t<tShot+0.6){CAM.position.lerp(new THREE.Vector3(p.x+side*5,2.6,p.z+7),0.05);CAM.lookAt(p.x*0.5,1,p.z-4);}
  else{CAM.position.lerp(new THREE.Vector3(p.x+2.4,1.9,p.z+4.4),0.04);CAM.lookAt(p.x,1.1,p.z);}
 },mixers:()=>[me,df,gk].concat(cel&&cel.P?[cel.P]:[])};
}
function sceneAsis(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),mt=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),ball=makeBall();
 const side=Math.random()<0.5?-1:1;sc.add(me.obj,mt.obj,gk.obj,ball);
 me.obj.position.set(side*14,0,14);me.obj.rotation.y=-side*Math.PI/2;mt.obj.position.set(-side*3,0,20);mt.obj.rotation.y=Math.PI;gk.obj.position.set(0,0,0.4);
 me.play('Jog_Fwd_Loop');mt.play('Sprint_Loop');gk.play('Idle_Loop');
 const tPass=1.3,tShot=2.4,pf=new THREE.Vector3(side*13.2,0.11,13.4),rcv=new THREE.Vector3(-side*0.8,0.11,9.5),goalT=new THREE.Vector3(side*2.6,0.5+Math.random()*1.3,-0.6);let cel=null;
 CAM.position.set(side*18,4,24);CAM.lookAt(0,1,10);
 return {len:6.4,cap:'¡ASISTENCIA!',tCap:tShot+0.6,update(t){
  if(t<tPass){me.obj.position.x=lerp(side*14,side*13.4,t/tPass);ball.position.copy(pf);}
  if(t>tPass-0.25&&t<tPass+0.35)kickPose(me,(t-tPass+0.25)/0.6,0.4);
  if(t>=tPass&&!me.k){me.k=1;me.play('Idle_Loop',0.2);}
  mt.obj.position.set(lerp(-side*3,rcv.x,ease(t/tShot)),0,lerp(20,rcv.z+0.5,ease(t/tShot)));
  if(t>=tPass&&t<tShot)ball.position.copy(ballAt(pf,rcv,(t-tPass)/(tShot-tPass),0.9));
  if(t>tShot-0.25&&t<tShot+0.35)kickPose(mt,(t-tShot+0.25)/0.6,0.9);
  if(t>=tShot){if(!mt.k){mt.k=1;mt.play('Idle_Loop',0.1);gk.play('Jump_Loop',0.1);}ball.position.copy(ballAt(rcv,goalT,(t-tShot)/0.45,0.2));
   const dv=ease((t-tShot)/0.5);gk.obj.position.x=-side*2*dv;gk.obj.rotation.z=(side>0?1:-1)*1.2*dv;}
  if(t>tShot+0.8&&!cel){me.obj.rotation.y=Math.PI;me.play('Sprint_Loop',0.2);mt.obj.rotation.y=0;cel=celebrate(sc,mt,o.kit||'#1565c0',null,t,pick2(['jump','yes','dance']));}
  if(cel){const tg=(cel.P||mt).obj.position;me.obj.position.lerp(new THREE.Vector3(tg.x+0.9,0,tg.z+0.4),0.03);me.obj.lookAt(tg.x,0,tg.z);}
  const f=t<tShot?ball.position:(cel&&cel.P?cel.P:mt).obj.position;CAM.position.lerp(new THREE.Vector3(f.x+side*4,2.6,f.z+7),0.04);CAM.lookAt(f.x*0.6,1,f.z-2);
 },mixers:()=>[me,mt,gk].concat(cel&&cel.P?[cel.P]:[])};
}
function sceneEntrada(sc,o){
 const me=makePlayer('b',o.kit||'#1565c0'),rv=makePlayer('b','#e53935'),ball=makeBall();sc.add(me.obj,rv.obj,ball);
 rv.obj.position.set(4,0,24);rv.obj.rotation.y=-Math.PI*0.75;me.obj.position.set(-2,0,20);me.obj.rotation.y=Math.PI*0.25;
 const run=makePlayer('a','#e53935');run.obj.position.copy(rv.obj.position);run.obj.rotation.y=rv.obj.rotation.y;sc.add(run.obj);rv.obj.visible=false;run.play('Sprint_Loop');
 const runMe=makePlayer('a',o.kit||'#1565c0');runMe.obj.position.copy(me.obj.position);runMe.obj.rotation.y=me.obj.rotation.y;sc.add(runMe.obj);me.obj.visible=false;runMe.play('Sprint_Loop');
 CAM.position.set(4.2,1.7,26.2);CAM.lookAt(0.8,0.6,21.4);const tSl=1.1;
 return {len:4.4,cap:'¡ROBO!',tCap:tSl+0.6,update(t){
  if(t<tSl){const k=t/tSl;run.obj.position.set(lerp(4,1.2,k),0,lerp(24,21.6,k));runMe.obj.position.set(lerp(-2,-0.2,k),0,lerp(20,21,k));ball.position.set(run.obj.position.x-0.5,0.11,run.obj.position.z-0.3);}
  if(t>=tSl&&!me.s){me.s=1;me.obj.position.copy(runMe.obj.position);me.obj.visible=true;runMe.obj.visible=false;me.play('Slide_Start',0.05,true);
   rv.obj.position.copy(run.obj.position);rv.obj.visible=true;run.obj.visible=false;}
  if(t>=tSl){me.obj.position.x+=0.03;if(t>tSl+0.25&&!rv.f){rv.f=1;rv.play('Hit_Knockback',0.05,true);}
   ball.position.copy(ballAt(new THREE.Vector3(0.7,0.11,21.3),new THREE.Vector3(-4,0.11,23),(t-tSl-0.15)/1.2,0.5));}
  if(t>tSl+1.6&&!me.e){me.e=1;me.play('Slide_Exit',0.2,true);}
  CAM.lookAt(0.8,0.6,21.4);
 },mixers:()=>[me,rv,run,runMe]};
}
function sceneCorner(sc,o){
 const hd=makePlayer('a',o.kit||'#1565c0'),df=makePlayer('a','#e53935'),gk=makePlayer('a','#f5c542'),tk=makePlayer('a',o.kit||'#1565c0'),ball=makeBall(),goal=o.out!=='fallo';
 sc.add(hd.obj,df.obj,gk.obj,tk.obj,ball);tk.obj.position.set(34,0,0.6);tk.obj.rotation.y=-Math.PI*0.6;hd.obj.position.set(-1,0,12);hd.obj.rotation.y=Math.PI;df.obj.position.set(0.6,0,6.6);gk.obj.position.set(0,0,0.5);
 [hd,df].forEach(p=>p.play('Jog_Fwd_Loop'));gk.play('Idle_Loop');tk.play('Idle_Loop');
 const flag=new THREE.Vector3(33.6,0.11,0.4),hp=new THREE.Vector3(0.2,2.2,6.2),gt=new THREE.Vector3(-2.3,1.8,-0.6),cl=new THREE.Vector3(6,0.11,16),tC=0.9,tH=2.4;let cel=null;
 CAM.position.set(10,6,24);CAM.lookAt(0,1,6);
 return {len:6,cap:goal?'¡GOL DE CABEZA!':'¡DESPEJE!',tCap:tH+0.5,update(t){
  if(t>tC-0.25&&t<tC+0.35)kickPose(tk,(t-tC+0.25)/0.6,0.6);
  if(t<tC)ball.position.copy(flag);else if(t<tH)ball.position.copy(ballAt(flag,hp,(t-tC)/(tH-tC),5));
  hd.obj.position.lerp(new THREE.Vector3(0,0,6.9),0.025);df.obj.position.lerp(new THREE.Vector3(0.8,0,6.5),0.02);
  if(t>tH-0.5&&!hd.j){hd.j=1;(goal?hd:df).play('Jump_Start',0.1,true);}
  const jy=Math.max(0,Math.sin(Math.min(1,(t-tH+0.5)/0.9)*Math.PI))*0.55;(goal?hd:df).obj.position.y=t>tH-0.5?jy:0;
  if(t>=tH){if(goal){ball.position.copy(ballAt(hp,gt,(t-tH)/0.5,0));if(!gk.j){gk.j=1;gk.play('Jump_Loop',0.1);}const dv=ease((t-tH)/0.5);gk.obj.position.x=1.6*dv;gk.obj.rotation.z=-1.1*dv;}
   else ball.position.copy(ballAt(hp,cl,(t-tH)/1,2));}
  if(goal&&t>tH+0.9&&!cel){hd.obj.rotation.y=0;cel=celebrate(sc,hd,o.kit||'#1565c0',null,t,CELEB[Math.floor(Math.random()*CELEB.length)]);}
  const f=t<tH?ball.position:(cel&&cel.P?cel.P:hd).obj.position;CAM.position.lerp(new THREE.Vector3(f.x+5,4,f.z+12),0.03);CAM.lookAt(f.x*0.5,1,f.z-3);
 },mixers:()=>[hd,df,gk,tk].concat(cel&&cel.P?[cel.P]:[])};
}
function pick2(a){return a[Math.floor(Math.random()*a.length)];}
const SCENES={pen:scenePen,gol:sceneGol,asis:sceneAsis,entrada:sceneEntrada,corner:sceneCorner};

/* ---------- reproducir ---------- */
export function debugStep(n,dt){return ACTIVE&&ACTIVE.step?ACTIVE.step(n,dt||1/30):-1;}
export function supported(){try{const c=document.createElement('canvas');return !!(window.WebGLRenderingContext&&(c.getContext('webgl2')||c.getContext('webgl')));}catch(e){return false;}}
export async function play(kind,o){
 if(!SCENES[kind]||!supported())return false;
 setup();size();document.body.appendChild(WRAP);WRAP.classList.add('load');
 const cap=WRAP.querySelector('.s3d-cap');cap.textContent='Cargando la jugada…';cap.classList.remove('on');
 try{await loadAssets();}catch(e){WRAP.remove();return false;}
 WRAP.classList.remove('load');cap.textContent='';
 SC=buildPitch();const S3=SCENES[kind](SC,o||{});
 return new Promise(res=>{
  let t=0,stop=false;CLOCK.start();
  ACTIVE={done(){if(stop)return;stop=true;ACTIVE=null;WRAP.remove();res(true);},
   /* solo para pruebas: avanza la escena a mano (en pestañas ocultas el navegador no pinta) */
   step(n,dt){for(let i=0;i<n;i++){t+=dt;S3.mixers().forEach(p=>p.mixer.update(dt));S3.update(t);}R.render(SC,CAM);return t;}};
  (function loop(){if(stop)return;const dt=Math.min(0.05,CLOCK.getDelta());t+=dt;
   S3.mixers().forEach(p=>p.mixer.update(dt));S3.update(t);
   if(t>S3.tCap&&!cap.classList.contains('on')){cap.textContent=S3.cap;cap.classList.add('on');}
   R.render(SC,CAM);if(t>=S3.len){ACTIVE&&ACTIVE.done();return;}requestAnimationFrame(loop);})();
 });
}
