/* Estrella del Balón · escenas 3D (módulo ES, se carga solo cuando hace falta).
   Three.js + maniquíes de Quaternius (CC0) con animaciones de captura (correr, saltar, bailar, deslizarse, caer…).
   El golpeo al balón y la estirada del portero se hacen moviendo los huesos por código.
   Escenas: pen (penalti), gol (gol de jugada, a veces con regate), asis (pase decisivo), entrada (entrada en plancha) y corner. */
import * as THREE from 'three';
import {GLTFLoader} from '../vendor/three/examples/jsm/loaders/GLTFLoader.js';
import {clone as skClone} from '../vendor/three/examples/jsm/utils/SkeletonUtils.js';

let R=null,SC=null,CAM=null,CLOCK=null,ASSETS=null,ACTIVE=null,WRAP=null,BALLTEX=null,EXTRA=[];
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
 if(kind==='dance')P.play('Dance_Loop',0.3);else if(kind==='jump')P.play('Jump_Start',0.2,true);else if(kind==='yes')P.play('Yes',0.2);else if(kind==='slide')P.play('Slide_Start',0.2,true);
 else if(kind==='punch')P.play('Punch_Jab',0.2);else if(kind==='grada')P.play('Spell_Simple_Shoot',0.2,true);
 else if(kind==='grupo'){P.play('Jump_Loop',0.2);for(let i=0;i<3;i++){const m=makePlayer(i===1?'b':'a',color),a=Math.PI*(0.3+i*0.35);m.obj.position.set(P.obj.position.x+Math.cos(a)*1.3,0,P.obj.position.z+Math.sin(a)*1.3);m.obj.lookAt(P.obj.position.x,0,P.obj.position.z);sc.add(m.obj);m.play(i===1?'Yes':'Jump_Loop',0.1);EXTRA.push(m);}}
 else P.play('Idle_FoldArms_Loop',0.3);
 if(mate){mate.play('Sprint_Loop',0.2);}
 return {P,kind,t0};
}

/* ---------- escenas ---------- */
function scenePen(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),ball=makeBall();
 me.obj.position.set(-1.2,0,14.2);me.obj.rotation.y=Math.PI+0.35;gk.obj.position.set(0,0,0.3);sc.add(me.obj,gk.obj,ball);ball.position.set(0,0.11,11);
 const ref=referee(sc,4.5,12.5);ref.obj.lookAt(0,0,11);
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
  if(t<tKick)armsUp(ref,1,true);
 },mixers:()=>[me,gk,ref].concat(cel&&cel.P?[cel.P]:[])};
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
 const cap=WRAP.querySelector('.s3d-cap');cap.textContent='Cargando la jugada…';cap.classList.remove('on');cap.style.fontSize='';
 try{await loadAssets();}catch(e){WRAP.remove();return false;}
 WRAP.classList.remove('load');cap.textContent='';
 SC=buildPitch();EXTRA=[];const S3=SCENES[kind](SC,o||{});
 return new Promise(res=>{
  let t=0,stop=false;CLOCK.start();
  ACTIVE={done(){if(stop)return;stop=true;ACTIVE=null;WRAP.remove();res(true);},
   /* solo para pruebas: avanza la escena a mano (en pestañas ocultas el navegador no pinta) */
   step(n,dt){for(let i=0;i<n;i++){t+=dt;S3.mixers().concat(EXTRA).forEach(p=>p.mixer.update(dt));S3.update(t,dt);}R.render(SC,CAM);return t;}};
  (function loop(){if(stop)return;const dt=Math.min(0.05,CLOCK.getDelta());t+=dt;
   S3.mixers().concat(EXTRA).forEach(p=>p.mixer.update(dt));S3.update(t,dt);
   if(t>S3.tCap&&!cap.classList.contains('on')){cap.textContent=S3.cap;cap.classList.add('on');}
   R.render(SC,CAM);if(t>=S3.len){ACTIVE&&ACTIVE.done();return;}requestAnimationFrame(loop);})();
 });
}

/* ====================== escenas añadidas ====================== */
/* utilidades: brazos arriba, objetos en la mano, árbitro, trofeo, confeti y coche */
function boneOf(P,re){let f=null;P.obj.traverse(o=>{if(!f&&o.isBone&&re.test(o.name))f=o;});return f;}
const ARM={x:0,y:0,z:2.4,lx:0,ly:0,lz:2.4};export function debugArm(a){Object.assign(ARM,a);}
function armsUp(P,k,one){const L=boneOf(P,/upper_?arm.?l$/i),Rr=boneOf(P,/upper_?arm.?r$/i);k=Math.max(0,Math.min(1,k));
 if(Rr){Rr.rotation.x+=ARM.x*k;Rr.rotation.y+=ARM.y*k;Rr.rotation.z+=ARM.z*k;}if(L&&!one){L.rotation.x+=ARM.lx*k;L.rotation.y+=ARM.ly*k;L.rotation.z+=ARM.lz*k;}}
function holdInHand(P,mesh,left){const h=boneOf(P,left?/hand.?l$/i:/hand.?r$/i);if(h){h.add(mesh);}return mesh;}
function referee(sc,x,z){const r=makePlayer('a','#111111');r.obj.position.set(x,0,z);sc.add(r.obj);r.play('Idle_Loop');return r;}
function cardMesh(c){const m=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.09,0.004),new THREE.MeshBasicMaterial({color:c==='r'?0xe53935:0xf5c542}));m.scale.setScalar(1);return m;}
function trophyMesh(){const g=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:0xf5c542,metalness:0.9,roughness:0.25});
 const pts=[];for(let i=0;i<=12;i++){const t=i/12;pts.push(new THREE.Vector2(0.04+0.1*Math.sin(t*Math.PI*0.9)+(t>0.85?0.05:0),t*0.42));}
 const cup=new THREE.Mesh(new THREE.LatheGeometry(pts,20),mat);cup.position.y=0.1;g.add(cup);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.11,0.1,20),mat);base.position.y=0.05;g.add(base);
 [-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.TorusGeometry(0.06,0.012,8,16,Math.PI),mat);h.position.set(s*0.13,0.36,0);h.rotation.z=s*Math.PI/2;g.add(h);});return g;}
function confetti(sc,n,area,gold){const g=new THREE.Group(),cols=gold?[0xf5c542,0xffffff]:[0xf5c542,0xe53935,0x2bd47d,0x5aa9ff,0xffffff];
 for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(0.08,0.12),new THREE.MeshBasicMaterial({color:cols[i%cols.length],side:THREE.DoubleSide}));
  m.position.set((Math.random()-0.5)*area,3+Math.random()*5,(Math.random()-0.5)*area);m.userData.v=0.6+Math.random()*0.8;m.userData.r=Math.random()*3;g.add(m);}
 sc.add(g);return {upd(dt){g.children.forEach(m=>{m.position.y-=m.userData.v*dt;m.rotation.x+=m.userData.r*dt;m.rotation.y+=dt;if(m.position.y<0)m.position.y=6;});}};}
function carMesh(color){const g=new THREE.Group(),mt=new THREE.MeshStandardMaterial({color:color,metalness:0.6,roughness:0.3});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.5,4.2),mt);body.position.y=0.5;g.add(body);
 const cab=new THREE.Mesh(new THREE.BoxGeometry(1.6,0.45,1.9),new THREE.MeshStandardMaterial({color:0x223344,metalness:0.4,roughness:0.1,transparent:true,opacity:0.55}));cab.position.set(0,0.95,-0.2);g.add(cab);
 [[-0.9,1.3],[0.9,1.3],[-0.9,-1.3],[0.9,-1.3]].forEach(p=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.34,0.25,18),new THREE.MeshStandardMaterial({color:0x111111}));w.rotation.z=Math.PI/2;w.position.set(p[0],0.34,p[1]);g.add(w);});
 return g;}
function crowdBoost(sc){sc.children.forEach(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='SphereGeometry'&&o.position.z<-9)o.userData.cheer=Math.random()*6;});
 return {upd(t){sc.children.forEach(o=>{if(o.userData.cheer!=null){o.position.y+=Math.sin(t*8+o.userData.cheer)*0.01;}});}};}

/* paradas: eres el portero */
function sceneParada(sc,o){
 const sh=makePlayer('a','#e53935'),me=makePlayer('a',o.kit||'#f5c542'),ball=makeBall(),side=Math.random()<0.5?-1:1,catchIt=Math.random()<0.5;sc.add(sh.obj,me.obj,ball);
 sh.obj.position.set(-side*3,0,19);sh.obj.rotation.y=Math.PI;me.obj.position.set(0,0,0.6);me.play('Idle_Loop');sh.play('Sprint_Loop');
 const tS=1.4,from=new THREE.Vector3(-side*1.5,0.11,14),to=new THREE.Vector3(side*2.2,0.9,0.4);let thr=null;
 CAM.position.set(-side*2,1.6,-3.5);CAM.lookAt(0,1,8);
 return {len:6.2,cap:catchIt?'¡BLOCADO!':'¡PARADÓN!',tCap:tS+0.6,update(t){
  if(t<tS){const k=t/tS;sh.obj.position.set(lerp(-side*3,from.x-0.3,k),0,lerp(19,from.z+0.7,k));ball.position.set(sh.obj.position.x+0.3,0.11,sh.obj.position.z-0.6);}
  if(t>tS-0.25&&t<tS+0.35)kickPose(sh,(t-tS+0.25)/0.6,0.9);
  if(t>=tS&&!sh.k){sh.k=1;sh.play('Idle_Loop',0.2);me.play('Jump_Loop',0.1);}
  const dv=ease((t-tS)/0.5);if(t>=tS){me.obj.position.x=side*1.9*dv;me.obj.rotation.z=-side*1.2*dv;me.obj.position.y=Math.sin(Math.min(1,dv)*Math.PI)*0.5;}
  if(t>=tS&&t<tS+0.5)ball.position.copy(ballAt(from,to,(t-tS)/0.5,0.3));
  else if(t>=tS+0.5&&!catchIt)ball.position.copy(ballAt(to,new THREE.Vector3(side*5,0.11,3),(t-tS-0.5)/0.8,1));
  else if(t>=tS+0.5&&catchIt)ball.position.set(me.obj.position.x-side*0.3,me.obj.position.y+0.9,0.7);
  /* se levanta y saca con la mano */
  if(t>tS+1.4&&!thr){thr=makePlayer('b',o.kit||'#f5c542');thr.obj.position.set(me.obj.position.x,0,0.8);sc.add(thr.obj);me.obj.visible=false;thr.play(catchIt?'OverhandThrow':'Idle_No_Loop',0.1,catchIt);}
  if(thr&&catchIt){const k2=(t-tS-1.4);if(k2<0.7)ball.position.set(thr.obj.position.x,1.9,0.6);else ball.position.copy(ballAt(new THREE.Vector3(thr.obj.position.x,1.9,0.6),new THREE.Vector3(-side*8,0.11,22),(k2-0.7)/1.2,2.5));}
  if(t>tS+1.2){CAM.position.lerp(new THREE.Vector3(me.obj.position.x+3,1.8,5),0.04);CAM.lookAt(me.obj.position.x,1,0.6);}
 },mixers:()=>[sh,me].concat(thr?[thr]:[])};
}
/* falta directa con barrera */
function sceneFalta(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),ball=makeBall(),wall=[],goal=o.out!=='fallo',side=Math.random()<0.5?-1:1;
 me.obj.position.set(-1.6,0,25);me.obj.rotation.y=Math.PI+0.3;gk.obj.position.set(-side*0.6,0,0.5);sc.add(me.obj,gk.obj,ball);ball.position.set(0,0.11,23);
 for(let i=0;i<4;i++){const w=makePlayer('a','#e53935');w.obj.position.set(-1+i*0.62,0,14);sc.add(w.obj);w.play('Idle_Loop');wall.push(w);}
 me.play('Jog_Fwd_Loop');gk.play('Idle_Loop');
 const tK=1.2,start=new THREE.Vector3(0,0.11,23),peak=new THREE.Vector3(side*0.4,2.9,13.5),end=goal?new THREE.Vector3(side*3.2,2.1,-0.6):new THREE.Vector3(side*2.6,1.9,0.3);
 CAM.position.set(-2,2.2,30);CAM.lookAt(0,1.2,8);let cel=null;
 return {len:goal?6.5:5,cap:goal?'¡GOLAZO DE FALTA!':'¡PARADA!',tCap:tK+1.2,update(t){
  if(t<tK){const k=ease(t/tK);me.obj.position.set(lerp(-1.6,-0.4,k),0,lerp(25,23.7,k));}
  if(t>=tK&&!me.k){me.k=1;me.play('Idle_Loop',0.1);wall.forEach(w=>w.play('Jump_Start',0.05,true));}
  if(t>tK-0.25&&t<tK+0.35)kickPose(me,(t-tK+0.25)/0.6,0.7);
  wall.forEach(w=>{w.obj.position.y=t>tK?Math.max(0,Math.sin(Math.min(1,(t-tK)/0.7)*Math.PI))*0.45:0;});
  if(t>=tK){const u=Math.min(1,(t-tK)/1.05),a=start.clone().lerp(peak,u),b=peak.clone().lerp(end,u);ball.position.copy(a.lerp(b,u));}
  if(t>tK+0.6&&!gk.j){gk.j=1;gk.play('Jump_Loop',0.1);}const dv=ease((t-tK-0.6)/0.45);gk.obj.position.x=-side*0.6+side*(goal?2.1:2.8)*dv;gk.obj.rotation.z=-side*1.2*dv;gk.obj.position.y=Math.sin(Math.min(1,dv)*Math.PI)*0.6;
  if(!goal&&t>tK+1.05)ball.position.copy(ballAt(end,new THREE.Vector3(side*6,0.11,2),(t-tK-1.05)/0.7,1));
  if(goal&&t>tK+1.05&&t<tK+1.5)sc.userData.net.position.z=-0.15*Math.sin((t-tK)*12);
  if(goal&&t>tK+1.6&&!cel){me.obj.rotation.y=0;cel=celebrate(sc,me,o.kit||'#1565c0',null,t,pick2(CELEB));}
  if(cel&&cel.kind==='slide')cel.P.obj.position.z+=0.04;
  if(t>tK+1.6){const p=(cel&&cel.P?cel.P:me).obj.position;CAM.position.lerp(new THREE.Vector3(p.x+2.4,1.9,p.z+4.4),0.04);CAM.lookAt(p.x,1.1,p.z);}
 },mixers:()=>[me,gk].concat(wall,cel&&cel.P?[cel.P]:[])};
}
/* remates especiales: volea, chilena y cabezazo en carrera */
function sceneRemate(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),df=makePlayer('a','#e53935'),ball=makeBall(),tipo=o.tipo||'volea',side=Math.random()<0.5?-1:1;
 sc.add(me.obj,gk.obj,df.obj,ball);me.obj.position.set(side*0.5,0,15);me.obj.rotation.y=Math.PI;gk.obj.position.set(0,0,0.5);df.obj.position.set(side*1.2,0,11);
 me.play(tipo==='cabeza'?'Sprint_Loop':'Jog_Fwd_Loop');gk.play('Idle_Loop');df.play('Jog_Fwd_Loop');
 const cr=new THREE.Vector3(side*18,0.3,6),hit=new THREE.Vector3(side*0.2,tipo==='cabeza'?2.1:tipo==='chilena'?1.7:0.9,10),tH=1.8,gt=new THREE.Vector3(-side*2.4,0.8+Math.random()*1.2,-0.6);let cel=null;
 CAM.position.set(side*6,1.8,16);CAM.lookAt(0,1.3,8);
 return {len:6,cap:{volea:'¡QUÉ VOLEA!',chilena:'¡DE CHILENA!',cabeza:'¡GOL DE CABEZA!'}[tipo],tCap:tH+0.6,update(t){
  me.obj.position.z=lerp(15,10.4,ease(t/tH));
  if(t<tH)ball.position.copy(ballAt(cr,hit,t/tH,3.5));
  if(t>tH-0.45&&!me.j){me.j=1;me.play(tipo==='volea'?'Idle_Loop':'Jump_Start',0.1,true);}
  if(tipo==='cabeza')me.obj.position.y=t>tH-0.45?Math.max(0,Math.sin(Math.min(1,(t-tH+0.45)/0.9)*Math.PI))*0.5:0;
  if(tipo==='chilena'&&t>tH-0.35){const k=Math.min(1,(t-tH+0.35)/0.6);me.obj.rotation.x=-2.6*k;me.obj.position.y=Math.sin(Math.min(1,k)*Math.PI)*1.0+0.4*k;}
  if(tipo==='volea'&&t>tH-0.3&&t<tH+0.3){const R2=me.thighR;if(R2)R2.rotation.x+=1.6*Math.sin(Math.min(1,(t-tH+0.3)/0.6)*Math.PI);}
  if(t>=tH){ball.position.copy(ballAt(hit,gt,(t-tH)/0.45,0));if(!gk.j){gk.j=1;gk.play('Jump_Loop',0.1);}const dv=ease((t-tH)/0.45);gk.obj.position.x=side*1.6*dv;gk.obj.rotation.z=-side*1.1*dv;}
  if(t>tH+0.45&&t<tH+0.9)sc.userData.net.position.z=-0.15*Math.sin((t-tH)*12);
  if(t>tH+1&&!cel){me.obj.rotation.set(0,0,0);me.obj.position.y=0;cel=celebrate(sc,me,o.kit||'#1565c0',null,t,pick2(CELEB));}
  if(cel&&cel.kind==='slide')cel.P.obj.position.z+=0.04;
  const p=(cel&&cel.P?cel.P:me).obj.position;if(t>tH+0.8){CAM.position.lerp(new THREE.Vector3(p.x+2.4,1.9,p.z+4.4),0.04);CAM.lookAt(p.x,1.1,p.z);}
 },mixers:()=>[me,gk,df].concat(cel&&cel.P?[cel.P]:[])};
}
/* ocasión fallada */
function sceneFallo(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),gk=makePlayer('a','#f5c542'),ball=makeBall(),side=Math.random()<0.5?-1:1;sc.add(me.obj,gk.obj,ball);
 me.obj.position.set(side*4,0,22);me.obj.rotation.y=Math.PI;gk.obj.position.set(0,0,0.5);me.play('Sprint_Loop');gk.play('Idle_Loop');
 const tS=1.6,from=new THREE.Vector3(side*1.4,0.11,13),to=new THREE.Vector3(-side*4.6,1.2+Math.random()*1.5,-2);let sad=null;
 CAM.position.set(side*5,2.2,24);CAM.lookAt(0,1,8);
 return {len:5.2,cap:'¡FUERA POR POCO!',tCap:tS+0.6,update(t){
  if(t<tS){const k=t/tS;me.obj.position.set(lerp(side*4,side*1.6,k),0,lerp(22,13.6,k));ball.position.set(me.obj.position.x-side*0.2,0.11,me.obj.position.z-0.6);}
  if(t>tS-0.25&&t<tS+0.35)kickPose(me,(t-tS+0.25)/0.6,1);
  if(t>=tS){if(!me.k){me.k=1;me.play('Idle_Loop',0.1);}ball.position.copy(ballAt(from,to,(t-tS)/0.7,0.4));}
  if(t>tS+0.9&&!sad){sad=1;me.play('Hit_Head',0.2,true);}
  if(t>tS+0.7){CAM.position.lerp(new THREE.Vector3(me.obj.position.x+2,1.8,me.obj.position.z-4),0.04);CAM.lookAt(me.obj.position.x,1.3,me.obj.position.z);}
 },mixers:()=>[me,gk]};
}
/* tanda de penaltis: o.seq = [{mine:1/0, ok:1/0}], o.win */
function sceneTanda(sc,o){
 const kk=makePlayer('a',o.kit||'#1565c0'),kr=makePlayer('a','#e53935'),gk=makePlayer('a','#f5c542'),ball=makeBall(),seq=o.seq||[];sc.add(kk.obj,kr.obj,gk.obj,ball);gk.play('Idle_Loop');
 const D=2.2,start=new THREE.Vector3(0,0.11,11);let idx=-1,cur=null,dir=0,score=[0,0];
 CAM.position.set(0,1.8,16.5);CAM.lookAt(0,1.1,0);
 return {len:seq.length*D+2,cap:o.win?'¡GANÁIS LA TANDA!':'Perdéis en los penaltis',tCap:seq.length*D+0.3,update(t){
  const i=Math.floor(t/D),u=t-i*D;
  if(i!==idx&&i<seq.length){idx=i;const s=seq[i];cur=s.mine?kk:kr;(s.mine?kr:kk).obj.visible=false;cur.obj.visible=true;cur.obj.position.set(-0.6,0,13.5);cur.obj.rotation.y=Math.PI+0.3;cur.play('Jog_Fwd_Loop',0.05);cur.k=0;
   dir=pick2([-2.5,0,2.5]);gk.obj.position.set(0,0,0.4);gk.obj.rotation.z=0;gk.j=0;gk.play('Idle_Loop',0.05);
   const cap=WRAP.querySelector('.s3d-cap');cap.classList.add('on');cap.style.fontSize='22px';cap.textContent='Tanda: '+score[0]+' - '+score[1];}
  if(idx<seq.length&&cur){const s=seq[idx];const k=ease(u/0.9);cur.obj.position.set(lerp(-0.6,-0.3,k),0,lerp(13.5,11.5,k));
   if(u>0.65&&u<1.25)kickPose(cur,(u-0.65)/0.6,0.7);if(u>0.9&&!cur.k){cur.k=1;cur.play('Idle_Loop',0.1);gk.play('Jump_Loop',0.1);}
   const gdir=s.ok?(dir?-dir:2.4):(dir||2.4),dv=ease((u-0.9)/0.45);if(u>0.9){gk.obj.position.x=gdir*0.9*dv;gk.obj.rotation.z=(gdir>0?-1:1)*1.2*dv;}
   if(u<0.95)ball.position.copy(start);else{const end=s.ok?new THREE.Vector3(dir||0.1,1.1,-0.6):new THREE.Vector3(gdir*0.85,1,0.3);ball.position.copy(ballAt(start,end,(u-0.95)/0.45,0.2));}
   if(u>1.6&&!s.counted){s.counted=1;if(s.ok){if(s.mine)score[0]++;else score[1]++;}const cap=WRAP.querySelector('.s3d-cap');cap.textContent=(s.ok?'¡Gol! ':'¡Fallo! ')+score[0]+' - '+score[1];}}
  if(t>seq.length*D){const cap=WRAP.querySelector('.s3d-cap');cap.style.fontSize='';}
 },mixers:()=>[kk,kr,gk]};
}
/* lesión */
function sceneLesion(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),rv=makePlayer('a','#e53935'),ball=makeBall();let up=null;sc.add(me.obj,rv.obj,ball);
 me.obj.position.set(-3,0,22);me.obj.rotation.y=Math.PI/2;rv.obj.position.set(2,0,22.4);rv.obj.rotation.y=-Math.PI/2;me.play('Sprint_Loop');rv.play('Sprint_Loop');
 CAM.position.set(2.5,1.6,27);CAM.lookAt(-0.5,0.6,22);const tC=1;
 return {len:6,cap:'Te duele…',tCap:tC+0.5,update(t){
  if(t<tC){const k=t/tC;me.obj.position.x=lerp(-3,-0.3,k);rv.obj.position.x=lerp(2,0.4,k);ball.position.set(me.obj.position.x+0.4,0.11,22.2);}
  if(t>=tC&&!me.f){me.f=1;me.play('Death01',0.08,true);rv.play('Idle_Loop',0.2);}
  if(t>=tC)ball.position.copy(ballAt(new THREE.Vector3(0,0.11,22.2),new THREE.Vector3(4,0.11,26),(t-tC)/1.2,0.3));
  if(t>tC+3&&!up&&!o.grave){up=makePlayer('b',o.kit||'#1565c0');up.obj.position.copy(me.obj.position);up.obj.rotation.y=me.obj.rotation.y;sc.add(up.obj);me.obj.visible=false;up.play('LayToIdle',0.1,true);}
  CAM.lookAt(-0.4,0.5,22);
 },mixers:()=>[me,rv].concat(up?[up]:[])};
}
/* tarjeta: el árbitro llega y la enseña; con la roja te vas */
function sceneTarjeta(sc,o){
 const me=makePlayer('b',o.kit||'#1565c0'),ref=referee(sc,4,25),walk=makePlayer('a',o.kit||'#1565c0'),c=o.c||'y',card=cardMesh(c);sc.add(me.obj,walk.obj);walk.obj.visible=false;
 me.obj.position.set(0,0,22);me.obj.rotation.y=Math.PI/4;ref.obj.lookAt(0,0,22);ref.play('Jog_Fwd_Loop');me.play('Idle_FoldArms_Loop');
 CAM.position.set(-3.2,1.7,25.5);CAM.lookAt(1.2,1.3,22.8);let shown=false;
 return {len:c==='r'?6:4.4,cap:c==='r'?'¡ROJA!':'Amarilla',tCap:1.7,update(t){
  if(t<1.2){ref.obj.position.lerp(new THREE.Vector3(1.4,0,23.2),0.06);}else if(!ref.s){ref.s=1;ref.play('Idle_Loop',0.2);ref.obj.lookAt(0,0,22);}
  if(t>1.3){if(!shown){shown=true;holdInHand(ref,card);card.position.set(0,0.12,0);me.play('Idle_No_Loop',0.2);}armsUp(ref,Math.min(1,(t-1.3)/0.3),true);}
  if(c==='r'&&t>3.2){if(!walk.obj.visible){walk.obj.visible=true;walk.obj.position.copy(me.obj.position);me.obj.visible=false;walk.play('Walk_Loop',0.2);walk.obj.rotation.y=-Math.PI*0.8;}walk.obj.position.x-=0.02;walk.obj.position.z+=0.012;}
 },mixers:()=>[me,ref,walk]};
}
/* saque de banda */
function sceneBanda(sc,o){
 const me=makePlayer('b',o.kit||'#1565c0'),mt=makePlayer('a',o.kit||'#1565c0'),ball=makeBall();sc.add(me.obj,mt.obj,ball);
 me.obj.position.set(-20.6,0,26);me.obj.rotation.y=Math.PI/2;mt.obj.position.set(-14,0,23);mt.obj.rotation.y=-Math.PI/2;mt.play('Jog_Fwd_Loop');
 CAM.position.set(-23.5,1.8,30);CAM.lookAt(-17,1.2,24);
 return {len:3.6,cap:'Saque de banda',tCap:0.6,update(t){
  if(t<0.3&&!me.p){me.p=1;me.play('OverhandThrow',0.1,true);}
  if(t<0.75)ball.position.set(-20.6,2.1,26);else ball.position.copy(ballAt(new THREE.Vector3(-20.4,2.1,26),new THREE.Vector3(-14.6,1.1,23.2),(t-0.75)/0.9,1.2));
  mt.obj.position.x=lerp(-14,-15,Math.min(1,t/1.6));
 },mixers:()=>[me,mt]};
}
/* levantar un trofeo con el equipo */
function sceneTrofeo(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),cup=trophyMesh(),mates=[],conf=confetti(sc,260,16,false),crowd=crowdBoost(sc);sc.add(me.obj);me.obj.position.set(0,0,20);me.play('Idle_Loop');
 sc.add(cup);cup.scale.setScalar(1.5);
 for(let i=0;i<6;i++){const m=makePlayer(i%2?'b':'a',o.kit||'#1565c0'),a=i/6*Math.PI*2;m.obj.position.set(Math.cos(a)*2.2,0,20+Math.sin(a)*2.2);m.obj.lookAt(0,0,20);sc.add(m.obj);m.play(i%2?'Yes':'Jump_Loop');mates.push(m);}
 CAM.position.set(0,2.4,27);CAM.lookAt(0,1.6,20);
 return {len:7,cap:'¡CAMPEONES!',tCap:0.8,update(t,dt){
  const ku=Math.min(1,t/0.8);armsUp(me,ku);cup.position.set(me.obj.position.x,1.55+0.5*ku+Math.sin(t*4)*0.05,me.obj.position.z+0.12);conf.upd(1/60);crowd.upd(t);
  mates.forEach((m,i)=>{if(!(i%2))m.obj.position.y=Math.abs(Math.sin(t*5+i))*0.35;});
  CAM.position.set(Math.sin(t*0.4)*7,2.4,20+Math.cos(t*0.4)*7);CAM.lookAt(0,1.6,20);
  const cap=WRAP.querySelector('.s3d-cap');if(t>3&&o.n&&!this.n2){this.n2=1;cap.textContent=o.n;cap.style.fontSize='28px';}
 },mixers:()=>[me].concat(mates)};
}
/* gala del Balón de Oro */
function sceneGala(sc,o){
 sc.background=new THREE.Color(0x05070d);sc.fog=null;sc.children.slice().forEach(c=>{if(!c.isLight)sc.remove(c);});
 sc.add(new THREE.AmbientLight(0x8090b0,1.4));const spot=new THREE.SpotLight(0xfff2cc,160,40,0.45,0.5);spot.position.set(0,12,6);spot.target.position.set(0,0,0);sc.add(spot,spot.target);
 const stage=new THREE.Mesh(new THREE.CylinderGeometry(5,5,0.4,48),new THREE.MeshStandardMaterial({color:0x1b2238,metalness:0.4,roughness:0.4}));stage.position.y=0.2;sc.add(stage);
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.45,1.1,24),new THREE.MeshStandardMaterial({color:0x111111}));ped.position.set(0,0.95,-1.2);sc.add(ped);
 const ball=new THREE.Mesh(new THREE.SphereGeometry(0.22,32,24),new THREE.MeshStandardMaterial({color:0xf5c542,metalness:1,roughness:0.2}));ball.position.set(0,1.75,-1.2);sc.add(ball);
 for(let i=0;i<180;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(0.16,6,6),new THREE.MeshBasicMaterial({color:0x2a3350}));f.position.set(-9+Math.random()*18,0.6+Math.random()*1.4,6+Math.random()*7);sc.add(f);}
 const me=makePlayer('a','#34406a');me.obj.position.set(-6,0.4,1);me.obj.rotation.y=Math.PI/2;sc.add(me.obj);me.play('Walk_Formal_Loop');const conf=confetti(sc,220,10,true);
 CAM.position.set(4,2.2,9);CAM.lookAt(0,1.4,0);let got=false;
 return {len:8,cap:'¡BALÓN DE ORO!',tCap:4,update(t){
  if(t<3){me.obj.position.x=lerp(-6,-0.2,t/3);}else if(!me.s){me.s=1;me.play('Idle_Loop',0.3);me.obj.rotation.y=0;}
  if(t>3.4){got=true;const ku=Math.min(1,(t-3.4)/0.6);ball.position.set(me.obj.position.x,lerp(1.75,2.25,ku),me.obj.position.z+0.1);}
  if(t>3.4)armsUp(me,Math.min(1,(t-3.4)/0.6));if(t>4)conf.upd(1/60);
  CAM.position.lerp(new THREE.Vector3(me.obj.position.x+2.4,2,me.obj.position.z+5),0.03);CAM.lookAt(me.obj.position.x,1.6,me.obj.position.z);
 },mixers:()=>[me]};
}
/* presentación al fichar: con la camiseta ante la afición */
function sceneFichaje(sc,o){
 const me=makePlayer('b',o.kit||'#1565c0'),shirt=new THREE.Mesh(new THREE.PlaneGeometry(0.55,0.65),new THREE.MeshStandardMaterial({color:o.kit||'#1565c0',side:THREE.DoubleSide})),crowd=crowdBoost(sc);
 sc.add(me.obj);me.obj.position.set(0,0,18);me.play('Yes');
 const num=document.createElement('canvas');num.width=128;num.height=128;const g=num.getContext('2d');g.fillStyle=o.kit2||'#ffffff';g.font='bold 80px sans-serif';g.textAlign='center';g.fillText(String(o.num||10),64,95);
 const nm=new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(num),transparent:true}));nm.position.z=0.002;shirt.add(nm);
 shirt.position.set(0,1.45,18.35);sc.add(shirt);
 CAM.position.set(0,1.7,22.5);CAM.lookAt(0,1.4,18);
 return {len:5.5,cap:o.n?'¡Bienvenido al '+o.n+'!':'¡Nuevo club!',tCap:0.8,update(t){crowd.upd(t);shirt.position.y=1.45+Math.sin(t*3)*0.05;CAM.position.x=Math.sin(t*0.5)*2.2;CAM.lookAt(0,1.4,18);},mixers:()=>[me]};
}
/* rueda de prensa */
function scenePrensa(sc,o){
 sc.background=new THREE.Color(0x1a2233);sc.fog=null;sc.children.slice().forEach(c=>{if(!c.isLight)sc.remove(c);});
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(10,4),new THREE.MeshStandardMaterial({color:0x22304d}));wall.position.set(0,2,-1.5);sc.add(wall);
 for(let i=0;i<18;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(0.7,0.3),new THREE.MeshBasicMaterial({color:[0xf5c542,0x2bd47d,0xffffff][i%3]}));l.position.set(-3.6+(i%6)*1.45,0.9+Math.floor(i/6)*1.1,-1.49);sc.add(l);}
 const table=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.75,0.7),new THREE.MeshStandardMaterial({color:0x0e1424}));table.position.set(0,0.375,0.35);sc.add(table);
 const chair=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.45,0.5),new THREE.MeshStandardMaterial({color:0x333a4a}));chair.position.set(0,0.22,-0.45);sc.add(chair);
 for(let i=0;i<4;i++){const mic=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.35,8),new THREE.MeshStandardMaterial({color:0x222222}));mic.position.set(-0.3+i*0.2,0.98,0.65);mic.rotation.x=-0.5;sc.add(mic);}
 const me=makePlayer('a',o.kit||'#1565c0');me.obj.position.set(0,0.02,-0.45);sc.add(me.obj);me.play('Sitting_Talking_Loop');
 const flash=new THREE.PointLight(0xffffff,0,12);flash.position.set(0,2,4);sc.add(flash);
 CAM.position.set(0.7,1.35,2.6);CAM.lookAt(0,1.0,-0.3);
 return {len:4.6,cap:'Rueda de prensa',tCap:0.5,update(t){flash.intensity=Math.random()<0.06?40:flash.intensity*0.8;CAM.position.x=0.7+Math.sin(t*0.6)*0.3;CAM.lookAt(0,1.0,-0.3);},mixers:()=>[me]};
}
/* entrenamiento: conos, sprint y salto */
function sceneEntreno(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0');sc.add(me.obj);me.obj.position.set(-8,0,20);me.obj.rotation.y=Math.PI/2;me.play('Sprint_Loop');
 for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(0.15,0.35,12),new THREE.MeshStandardMaterial({color:0xff7a1a}));c.position.set(-6+i*2,0.17,20+(i%2?0.8:-0.8));sc.add(c);}
 const hurdle=new THREE.Mesh(new THREE.BoxGeometry(0.06,0.5,1.2),new THREE.MeshStandardMaterial({color:0xffffff}));hurdle.position.set(6.5,0.25,20);sc.add(hurdle);
 CAM.position.set(0,2,27);CAM.lookAt(0,0.8,20);
 return {len:5,cap:o.n||'¡Entrenamiento completado!',tCap:3.8,update(t){
  const x=lerp(-8,9,Math.min(1,t/4));me.obj.position.x=x;me.obj.position.z=20+(x<5?Math.sin(x*1.6)*0.8:0);
  if(x>5.8&&!me.j){me.j=1;me.play('Jump_Start',0.05,true);}me.obj.position.y=x>5.8&&x<7.4?Math.sin((x-5.8)/1.6*Math.PI)*0.6:0;
  if(x>7.5&&!me.r){me.r=1;me.play('Sprint_Loop',0.1);}CAM.lookAt(x*0.6,0.8,20);
 },mixers:()=>[me]};
}
/* coche nuevo */
function sceneCoche(sc,o){
 const car=carMesh(o.color||'#c62828'),me=makePlayer('a',o.kit||'#1565c0');car.add(me.obj);me.obj.position.set(-0.4,0.15,-0.2);me.play('Driving_Loop');
 car.position.set(-12,0,25);car.rotation.y=Math.PI/2;sc.add(car);
 CAM.position.set(-2,2.2,32);CAM.lookAt(0,0.8,25);
 return {len:5,cap:o.n?'¡Tu nuevo '+o.n+'!':'¡Coche nuevo!',tCap:1,update(t){car.position.x=lerp(-12,12,t/5);car.children.forEach(w=>{if(w.geometry&&w.geometry.type==='CylinderGeometry')w.rotation.x+=0.3;});CAM.lookAt(car.position.x,0.8,25);},mixers:()=>[me]};
}
/* retirada: vuelta de honor saludando */
function sceneRetiro(sc,o){
 const me=makePlayer('a',o.kit||'#1565c0'),conf=confetti(sc,200,30,false),crowd=crowdBoost(sc);sc.add(me.obj);me.obj.position.set(-10,0,5);me.obj.rotation.y=Math.PI/2;me.play('Walk_Loop');
 CAM.position.set(-4,1.8,11);CAM.lookAt(-8,1.4,5);
 return {len:7,cap:'¡Gracias, '+(o.n||'leyenda')+'!',tCap:1,update(t){me.obj.position.x=lerp(-10,6,t/7);armsUp(me,0.5+0.25*Math.sin(t*6),true);conf.upd(1/60);crowd.upd(t);CAM.position.lerp(new THREE.Vector3(me.obj.position.x+3,1.8,11),0.05);CAM.lookAt(me.obj.position.x,1.4,5);},mixers:()=>[me]};
}
Object.assign(SCENES,{parada:sceneParada,falta:sceneFalta,remate:sceneRemate,fallo:sceneFallo,tanda:sceneTanda,lesion:sceneLesion,tarjeta:sceneTarjeta,banda:sceneBanda,trofeo:sceneTrofeo,gala:sceneGala,fichaje:sceneFichaje,prensa:scenePrensa,entreno:sceneEntreno,coche:sceneCoche,retiro:sceneRetiro});
CELEB.push('punch','grada','grupo');