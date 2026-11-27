/* Estrella del Balón · tu partido (duelos y decisiones), semanas y temporadas. */

/* Situaciones por posición. v: grupo del rival al que te enfrentas.
   Cada opción: n texto, sk tus habilidades, ok habilidades del rival, vs grupo del rival (si cambia), rk riesgo 0-2, ef att/def, shot si es un disparo. */
var SITS={
 POR:[
  {t:'Un delantero se planta solo ante ti.',v:'DC',o:[
   {n:'Achicar y salir a sus pies',sk:['uno','arr'],ok:['fin','reg'],rk:1,ef:'def'},
   {n:'Aguantar y adivinar el palo',sk:['ref','pos'],ok:['tir','fin'],rk:0,ef:'def'},
   {n:'Salir lejos a cortar',sk:['ace','arr'],ok:['ace','des'],rk:2,ef:'def'}]},
  {t:'Llega un centro peligroso al área.',v:'DC',o:[
   {n:'Salir a atrapar el balón',sk:['aer','cap'],ok:['cab','sal'],rk:1,ef:'def'},
   {n:'Quedarte bajo palos',sk:['ref','agi'],ok:['cab','fin'],rk:0,ef:'def'},
   {n:'Despejar de puños entre la gente',sk:['arr','fue'],ok:['sal','fue'],rk:2,ef:'def'}]},
  {t:'Atrapas el balón y el rival está descolocado.',v:'MC',o:[
   {n:'Saque largo al contraataque',sk:['sac','pal'],ok:['ant','pos'],rk:2,ef:'att'},
   {n:'Pase en corto al central',sk:['pas','con'],ok:['ant','res'],vs:'DC',rk:0,ef:'att'},
   {n:'Saque con la mano al lateral',sk:['sac','com'],ok:['ant','vel'],vs:'EI',rk:1,ef:'att'}]}],
 DFC:[
  {t:'El delantero rival encara tu zona.',v:'DC',o:[
   {n:'Anticiparte y cortar',sk:['ant','dec'],ok:['ctl','des'],rk:1,ef:'def'},
   {n:'Entrada fuerte',sk:['ent','fue'],ok:['reg','fue'],rk:2,ef:'def'},
   {n:'Temporizar y cerrar',sk:['pos','con'],ok:['reg','ace'],rk:0,ef:'def'}]},
  {t:'Balón aéreo dentro de tu área.',v:'DC',o:[
   {n:'Ganar el salto',sk:['sal','cab'],ok:['sal','cab'],rk:1,ef:'def'},
   {n:'Cargar con el cuerpo y despejar',sk:['fue','pos'],ok:['fue','cab'],rk:2,ef:'def'},
   {n:'Marcar de cerca',sk:['mar','con'],ok:['des','cab'],rk:0,ef:'def'}]},
  {t:'Córner a favor: subes al área rival.',v:'DFC',o:[
   {n:'Rematar de cabeza',sk:['cab','sal'],ok:['sal','mar'],rk:2,ef:'att',shot:1},
   {n:'Bloquear al central para un compañero',sk:['fue','pos'],ok:['fue','mar'],rk:1,ef:'att'},
   {n:'Quedarte en la frontal por si hay rechace',sk:['con','pas'],ok:['ant','vel'],vs:'MC',rk:0,ef:'att'}]}],
 LAT:[
  {t:'El extremo rival te encara.',v:'EXT',o:[
   {n:'Cerrar el paso',sk:['pos','mar'],ok:['reg','ace'],rk:0,ef:'def'},
   {n:'Entrada al balón',sk:['ent','ace'],ok:['reg','agi'],rk:2,ef:'def'},
   {n:'Anticipar el pase',sk:['ant','vel'],ok:['pas','ctl'],rk:1,ef:'def'}]},
  {t:'Tienes espacio por tu banda.',v:'EXT',o:[
   {n:'Subir y centrar',sk:['cen','vel'],ok:['vel','ent'],rk:1,ef:'att'},
   {n:'Combinar por dentro',sk:['pas','ctl'],ok:['ant','ent'],vs:'MC',rk:0,ef:'att'},
   {n:'Conducir hasta el área',sk:['reg','ace'],ok:['ent','pos'],rk:2,ef:'att',shot:1}]}],
 MCD:[
  {t:'El mediapunta rival recibe entre líneas.',v:'MP',o:[
   {n:'Entrada para robar',sk:['ent','fue'],ok:['ctl','reg'],rk:2,ef:'def'},
   {n:'Tapar la línea de pase',sk:['pos','ant'],ok:['vis','pas'],rk:0,ef:'def'},
   {n:'Presión inmediata',sk:['res','mar'],ok:['ctl','agi'],rk:1,ef:'def'}]},
  {t:'Recibes en la salida de balón.',v:'MC',o:[
   {n:'Cambio de juego al extremo',sk:['pal','vis'],ok:['ant','pos'],rk:1,ef:'att'},
   {n:'Pase seguro',sk:['pas','con'],ok:['ant','res'],rk:0,ef:'att'},
   {n:'Romper líneas conduciendo',sk:['ctl','fue'],ok:['ent','fue'],rk:2,ef:'att'}]}],
 MC:[
  {t:'Recibes de cara en el medio campo.',v:'MCD',o:[
   {n:'Pase filtrado entre líneas',sk:['pas','vis'],ok:['ant','pos'],rk:1,ef:'att'},
   {n:'Disparo desde fuera del área',sk:['tir','pot'],ok:['ref','pos'],vs:'POR',rk:2,ef:'att',shot:1},
   {n:'Mantener la posesión',sk:['pas','ctl'],ok:['ent','mar'],rk:0,ef:'att'}]},
  {t:'El rival intenta salir jugando.',v:'MC',o:[
   {n:'Presionar la salida',sk:['res','ent'],ok:['ctl','pas'],rk:1,ef:'def'},
   {n:'Cerrar líneas de pase',sk:['pos','ant'],ok:['vis','pas'],rk:0,ef:'def'},
   {n:'Robo agresivo',sk:['ent','fue'],ok:['ctl','fue'],rk:2,ef:'def'}]}],
 INT:[
  {t:'Recibes abierto en la banda.',v:'LAT',o:[
   {n:'Incorporarte y centrar',sk:['cen','ace'],ok:['vel','pos'],rk:1,ef:'att'},
   {n:'Diagonal y disparo',sk:['tir','reg'],ok:['ent','agi'],rk:2,ef:'att',shot:1},
   {n:'Apoyo por dentro',sk:['pas','vis'],ok:['ant','mar'],vs:'MCD',rk:0,ef:'att'}]},
  {t:'El rival intenta salir jugando.',v:'MC',o:[
   {n:'Presionar la salida',sk:['res','ent'],ok:['ctl','pas'],rk:1,ef:'def'},
   {n:'Cerrar líneas de pase',sk:['pos','ant'],ok:['vis','pas'],rk:0,ef:'def'},
   {n:'Robo agresivo',sk:['ent','fue'],ok:['ctl','fue'],rk:2,ef:'def'}]}],
 MP:[
  {t:'Recibes entre líneas.',v:'MCD',o:[
   {n:'Último pase al delantero',sk:['vis','pas'],ok:['ant','pos'],rk:1,ef:'att'},
   {n:'Regate en el pasillo interior',sk:['reg','agi'],ok:['ent','agi'],rk:2,ef:'att',shot:1},
   {n:'Pausa y apoyo',sk:['ctl','con'],ok:['mar','res'],rk:0,ef:'att'}]},
  {t:'Balón suelto en la frontal.',v:'POR',o:[
   {n:'Disparo de primeras',sk:['tir','pot'],ok:['ref','pos'],rk:2,ef:'att',shot:1},
   {n:'Controlar y filtrar',sk:['ctl','vis'],ok:['ant','mar'],vs:'DFC',rk:1,ef:'att'},
   {n:'Abrir a la banda',sk:['pas','con'],ok:['ant','pos'],vs:'MCD',rk:0,ef:'att'}]}],
 DC:[
  {t:'Recibes en el borde del área.',v:'DFC',o:[
   {n:'Disparo cruzado',sk:['tir','fin'],ok:['ref','pos'],vs:'POR',rk:1,ef:'att',shot:1},
   {n:'Aguantar de espaldas y descargar',sk:['fue','pas'],ok:['fue','ent'],rk:0,ef:'att'},
   {n:'Girarte y encarar',sk:['reg','ctl'],ok:['ent','ant'],rk:2,ef:'att',shot:1}]},
  {t:'Llega un centro al área.',v:'DFC',o:[
   {n:'Rematar de cabeza',sk:['cab','sal'],ok:['sal','mar'],rk:2,ef:'att',shot:1},
   {n:'Atacar el primer palo',sk:['des','fin'],ok:['ant','pos'],rk:1,ef:'att',shot:1},
   {n:'Dejar de cara a un compañero',sk:['ctl','pas'],ok:['mar','fue'],rk:0,ef:'att'}]},
  {t:'Te quedas mano a mano con el portero.',v:'POR',o:[
   {n:'Definir al palo largo',sk:['fin','con'],ok:['ref','uno'],rk:1,ef:'att',shot:1},
   {n:'Regatear al portero',sk:['reg','agi'],ok:['uno','arr'],rk:2,ef:'att',shot:1},
   {n:'Pase atrás a un compañero',sk:['pas','vis'],ok:['ant','vel'],vs:'DFC',rk:0,ef:'att'}]}],
 EXT:[
  {t:'Encaras al lateral rival.',v:'LAT',o:[
   {n:'Regatear y centrar',sk:['reg','cen'],ok:['ent','pos'],rk:1,ef:'att'},
   {n:'Recortar y disparar',sk:['reg','tir'],ok:['ent','agi'],rk:2,ef:'att',shot:1},
   {n:'Pase atrás seguro',sk:['pas','con'],ok:['ant','mar'],rk:0,ef:'att'}]},
  {t:'Tienes metros para correr al espacio.',v:'LAT',o:[
   {n:'Carrera y centro raso',sk:['vel','cen'],ok:['vel','ace'],rk:1,ef:'att'},
   {n:'Carrera y disparo al primer palo',sk:['ace','fin'],ok:['ref','pos'],vs:'POR',rk:2,ef:'att',shot:1},
   {n:'Frenar y esperar apoyos',sk:['ctl','dec'],ok:['pos','mar'],rk:0,ef:'att'}]}]
};
var SITKEY={POR:'POR',DFC:'DFC',LI:'LAT',LD:'LAT',MCD:'MCD',MC:'MC',VI:'INT',VD:'INT',MP:'MP',SD:'DC',DC:'DC',EI:'EXT',ED:'EXT'};
var PAY=[0.3,0.6,1],LOSS=[0.1,0.3,0.7];

/* elige al rival concreto del once contrario */
function oppFor(xi,group){
 var mypos=S.pos,g=group;
 if(g==='LAT')g=mypos==='EI'||mypos==='VI'?'LD':mypos==='ED'||mypos==='VD'?'LI':pick(['LI','LD']);
 if(g==='EXT')g=mypos==='LI'?'ED':mypos==='LD'?'EI':pick(['EI','ED']);
 var c=xi.filter(function(id){return posGroup(S.pl[id].p)===g;});
 if(!c.length)c=xi.filter(function(id){return S.pl[id].p!=='POR';});
 return pick(c);
}
/* habilidad del rival en este momento: su forma del día y el cansancio según el minuto */
function tiredF(p,id,min){var dt=typeof downTired==='function'?downTired(min):0;if(!min||(min<=55&&!dt))return 1;var cat=(SKO.concat(SKG).filter(function(s){return s[0]===id;})[0]||[])[2],k=(Math.max(0,Math.min(1,(min-55)/35))*0.1+dt)*(1-pskill(p,'res')/200);return 1-(cat==='fis'?k:k/2);}
function pskillNow(p,id,min,fm){return Math.round(clamp(pskill(p,id)*tiredF(p,id,min)+(fm||0),1,99));}
function duelP(o){
 var mine=skAvg(o.sk),p=S.pl[o.op],theirs=o.ok.reduce(function(s,id){return s+pskillNow(p,id,o.min,o.fm);},0)/o.ok.length;
 var base=[0.72,0.55,0.4][o.rk];
 return clamp(base+(mine-theirs)/50+(S.rel.coach-50)*0.001+(S.moral-50)*0.002-(S.energy<30?0.08:0)+traitDec(o)+(o.dec?tx('big'):0)+diff().p+(isCaptain()?0.02:0)-(typeof downDuel==='function'?downDuel(o.min):0),0.05,0.95);
}
function oppVals(o){var p=S.pl[o.op];return o.ok.map(function(id){return [SKNAME[id]||id,pskillNow(p,id,o.min,o.fm)];});}

/* rol del jugador en el partido */
function rivalFor(c){var best=null,g=posGroup(S.pos);c.ros.forEach(function(id){var p=S.pl[id];if(p.me)return;if(posGroup(p.p)===g&&(!best||p.o>best.o))best=p;});return best;}
function starterP(c){var rv=rivalFor(c),ref=rv?rv.o:c.str+2;return clamp(0.5+(overall()-ref+4)/22+(S.rel.coach-50)*0.004+(S.moral-50)*0.002+formF()*0.04,0.04,1);}
function ntStarterP(){var me=S.pl[S.me],pool=natPool(me.nat).map(function(i){return S.pl[i];}).filter(function(p){return posGroup(p.p)===posGroup(S.pos);});
 var ref=pool.length?pool[0].o:nation(me.nat).str-6;return clamp(0.5+(overall()-ref+2)/14,0.05,0.97);}

function matchImp(desc){
 var L=compLetter(desc.ck),imp=1;
 if(desc.ko||desc.leg)imp+=0.4;if(/Final/.test(desc.rn||''))imp+=0.8;else if(/Semifinal|Promoción/.test(desc.rn||''))imp+=0.3;if(L==='P')imp+=0.4;
 if(L==='E')imp+=0.3;if(L==='T')imp+=0.5;if(L==='N')imp+=0.1;
 return imp;
}
function syncMe(){var me=S.pl[S.me];me.o=Math.round(overall());me.a=S.age;me.p=S.pos;}

function prepMatch(desc){
 syncMe();
 var me=S.pl[S.me],nat=!!desc.nat,home=nat?desc.h===me.nat:desc.h===me.c;
 var role='fuera',mins=0;
 if(S.injured>0)role='lesionado';
 else{var p=nat?ntStarterP():starterP(S.clubs[me.c]);
  if(Math.random()<p){role='titular';mins=90;}
  else if(S.pos!=='POR'&&Math.random()<0.6){role='suplente';mins=Math.round(15+Math.random()*30);}
  else role='banquillo';}
 if(!nat&&(S.ban||0)>0&&role!=='lesionado'){role='sancionado';mins=0;}
 S.uxi=nat?{nid:me.nat,on:mins>0}:{cid:me.c,on:mins>0};
 var H=teamOf(desc,'h'),A=teamOf(desc,'a'),T=home?H:A,O=home?A:H,ov=overall();
 var inf=mins>0?((ov-T.str)*0.12+(nat?0:(S.rel.team-50)*0.03)+tx('team')+(S.moral-50)*0.02)*(mins/90):0;
 var sH=H.str+(home?inf:0),sA=A.str+(home?0:inf);
 var sc=simScore(sH,sA,desc.neutral),ev=makeEvents(H,A,sc[0],sc[1],S.me);
 var imp=matchImp(desc);
 var M={desc:desc,home:home,role:role,mins:mins,ev:ev,mg:0,ma:0,dr:0,decs:[],imp:imp,hn:H.n,an:A.n,hs:H.str,as:A.str,oxi:O.xi,txi:T.xi,fm:{}};
 if(mins>0){
  /* número de jugadas: el mínimo de siempre (1 con menos de 60 minutos, 2 con 60 o más, +1 en partidos importantes) y a veces más */
  var nd=(mins>=60?2:1)+(imp>=1.7&&mins>=60?1:0),st=90-mins,deck=sitDeck(SITKEY[S.pos]),xr=Math.random();
  var extra=xr<0.4?0:xr<0.72?1:xr<0.9?2:3;if(mins<45)extra=Math.min(extra,1);nd=Math.min(6,nd+extra);
  var used={};
  for(var i=0;i<nd;i++){var sit=sitDraw(deck),mn,tries=0;do{mn=st+3+Math.floor(Math.random()*(mins-6));}while((used[mn]||used[mn-1]||used[mn+1])&&tries++<20);used[mn]=1;
   var opts=shuffle(sit.o.slice()).map(function(o){var x={n:o.n,sk:o.sk,ok:o.ok,rk:o.rk,ef:o.ef,shot:o.shot||0};x.op=oppFor(O.xi,o.vs||sit.v);x.min=mn;if(M.fm[x.op]==null)M.fm[x.op]=Math.round(norm()*2);x.fm=M.fm[x.op];return x;});
   M.decs.push({min:mn,sit:sit.t,main:opts[0].op,opts:opts,done:-1,z:sitZone(sit),anim:sit.anim,spr:sit.role});}
  addPenDec(M,O,T);
  M.decs.sort(function(x,y){return x.min-y.min;});
  M.decs.forEach(function(d,i){if(i&&d.min<=M.decs[i-1].min)d.min=Math.min(89,M.decs[i-1].min+2);});
  preAssign(M,T);
 }
 M.clock=0;cardsPrep(M);
 return M;
}
/* antes de empezar se decide tu participación en los goles del equipo (solo en los minutos que juegas),
   la falta directa y los efectos de tus rasgos. Así el partido en directo puede cantar tus goles al momento. */
function preAssign(M,T){
 var mins=M.mins,st=90-mins,side=mySide(M),ov=overall(),P=POSD[S.pos];
 if(tx('fk')&&Math.random()<0.06*(1+(skv('bpa')+skv('efe'))/120)*tx('fk')*(mins/90)){M.ev.push({min:Math.min(89,st+2+Math.floor(Math.random()*Math.max(1,mins-3))),side:side,sc:S.me,as:-1,fk:1,mine:1});M.mg++;}
 var opg=M.ev.filter(function(e){return e.side!==side&&!e.x&&!e.pen&&e.min>=st;});
 if(opg.length&&Math.random()<tx('cancel'))opg[0].x=1;
 M.ev.forEach(function(e){if(e.side!==side||e.x||e.mine||e.min<st)return;
  var rt=clamp(ov/T.str,0.6,1.5),f=0.75*rt*rt;/* solo cuentan los goles con él en el campo */
  if(Math.random()<P.sg*f*(1+0.6*tx('gs'))){e.sc=S.me;if(e.as===S.me)e.as=-1;M.mg++;e.mine=1;}
  else if(Math.random()<P.sa*f*(1+0.6*tx('as'))){e.as=S.me;M.ma++;e.mine=1;}});
 /* el portero líbero a veces encaja por salir lejos */
 if(tx('risk')&&Math.random()<tx('risk'))M.ev.push({min:Math.min(89,st+2+Math.floor(Math.random()*Math.max(1,mins-3))),side:side==='h'?'a':'h',sc:wpickXI(M.oxi,-1,'sg'),as:-1,err:1});
 M.ev.sort(function(x,y){return x.min-y.min;});
 M.pre=1;
}
/* marcador en un minuto dado */
function scoreAt(M,min){var h=0,a=0;M.ev.forEach(function(e){if(e.x||e.min>min)return;if(e.side==='h')h++;else a++;});return [h,a];}
function isDecisive(M,d){var s=scoreAt(M,d.min),diff=Math.abs(s[0]-s[1]);return (d.min>=70&&diff<=1)||(M.imp>=1.8&&diff<=1);}
function nextDec(M){return M.decs.filter(function(x){return x.done<0;})[0];}
function markDec(M){var d=nextDec(M);if(d&&d.dec==null){d.dec=isDecisive(M,d)?1:0;d.opts.forEach(function(o){o.dec=d.dec;});}return d;}
function mySide(M){return M.home?'h':'a';}
function resolveDec(M,d,oi){
 if(typeof cardsTick==='function'){cardsTick(M,d.min-1);if(d.done>=0)return;}
 if(d.spec==='pen'){penResolve(M,d,oi,d.aim);return;}
 var o=d.opts[oi],ok=Math.random()<duelP(o),mult=d.dec?1.5:1,side=mySide(M),os=side==='h'?'a':'h',opp=S.pl[o.op];
 d.done=oi;d.ok=ok;
 if(ok){M.dr+=PAY[o.rk]*mult;
  if(o.ef==='att'){var gc=(o.shot?[0.12,0.3,0.5]:[0.08,0.22,0.4])[o.rk]*(d.dec?1.3:1)*(S.pos==='POR'?0.3:1);
   if(Math.random()<gc){if(o.shot){M.ev.push({min:d.min,side:side,sc:S.me,as:Math.random()<0.5?wpickXI(M.txi,S.me,'sa'):-1,mine:1,shown:1});M.mg++;d.res='¡Gol! Superas a '+opp.n;}
    else{M.ev.push({min:d.min,side:side,sc:wpickXI(M.txi,S.me,'sg'),as:S.me,mine:1,shown:1});M.ma++;d.res='Asistencia de gol. Superas a '+opp.n;}}
   else d.res='Ganas el duelo a '+opp.n;}
  else{var nx=M.ev.filter(function(e){return e.side===os&&!e.x&&e.min>=d.min&&e.min<=d.min+20;})[0];
   if(nx&&Math.random()<[0.5,0.7,0.9][o.rk]){nx.x=1;d.res='Evitas el gol de '+S.pl[nx.sc].n;}
   else if(Math.random()<[0.2,0.35,0.5][o.rk]){d.res='Frenas a '+opp.n+' y evitas una ocasión clara';M.dgc=(M.dgc||0)+1;}
   else d.res='Ganas el duelo a '+opp.n;}}
 else{M.dr-=LOSS[o.rk]*mult;d.res=opp.n+' te gana el duelo';
  if(o.ef==='def'&&o.rk===2&&!M.red&&S.pos!=='POR'&&Math.random()<0.035){M.red=d.min;d.res='Entrada a destiempo: tarjeta roja';}
  else if(o.ef==='def'&&o.rk===2&&Math.random()<0.3){M.ev.push({min:d.min,side:os,sc:o.op,as:-1,pen:1});d.res='Penalti en contra: lo marca '+opp.n;}
  else if(o.ef==='def'&&Math.random()<[0.1,0.2,0.3][o.rk]){M.ev.push({min:Math.min(90,d.min+1),side:os,sc:o.op,as:-1});d.res=opp.n+' te supera y marca';}
  else if(o.ef==='att'&&o.rk===2&&Math.random()<0.12){var cs=wpickXI(M.oxi,-1,'sg');M.ev.push({min:Math.min(90,d.min+2),side:os,sc:cs,as:o.op});d.res='Pierdes el balón y el rival marca a la contra';}}
 cardOnDuel(M,d,o,ok);
 M.ev.sort(function(x,y){return x.min-y.min;});
}
function autoDec(M,d){var best=0,bv=-9;d.opts.forEach(function(o,i){var p=duelP(o),v=p*PAY[o.rk]-(1-p)*LOSS[o.rk];if(v>bv){bv=v;best=i;}});resolveDec(M,d,best);}

function finishMatch(M){
 var desc=M.desc,nat=!!desc.nat,me=S.pl[S.me],home=M.home,ov=overall(),pos=S.pos,P=POSD[pos],mins=M.mins,side=mySide(M);
 var H=teamOf(desc,'h'),A=teamOf(desc,'a'),T=home?H:A;
 /* partidas guardadas a mitad de partido con la versión anterior */
 if(mins>0&&!M.pre)preAssign(M,T);
 cardsFinish(M);mins=M.mins;
 M.ev.sort(function(x,y){return x.min-y.min;});
 var ev=M.ev.filter(function(e){return !e.x;});
 var gh=ev.filter(function(e){return e.side==='h';}).length,ga=ev.length-gh;
 var gf=home?gh:ga,gc=home?ga:gh;
 var g=ev.filter(function(e){return e.sc===S.me;}).length,asi=ev.filter(function(e){return e.as===S.me;}).length,saves=0;
 var O=home?A:H;
 if(pos==='POR'&&mins>0){saves=poisson(2.6*Math.exp((O.str-T.str)/50))+(M.dgc||0);}
 var r=0;
 if(mins>0){
  r=6+(ov-O.str)*0.015+(gf>gc?0.4:gf<gc?-0.4:0)+norm()*0.6+S.bono*0.008+(S.rel.team-50)*0.003+(S.moral-50)*0.006+tx('rate')+clamp(M.dr*0.35,-0.9,0.9)-(S.energy<30?0.6:0)+(M.imp>1.5?tx('big')*3:0)+(M.imp<=1.2?tx('small'):0);
  if(pos==='POR')r+=saves*0.18-gc*0.22+(gc===0?0.7:0);
  else{r+=g*1.0+asi*0.5;if(P.df)r+=(gc===0?0.6:-0.15*gc);else if(P.line==='MED'&&gf>gc)r+=0.1;}
  r+=formF()*0.12;if(M.red)r-=1.5;
  if(mins<90)r=6+(r-6)*(0.4+0.6*mins/90);
  r=clamp(r,3.5,10);
 }
 var pw=penWinner(desc,gh,ga,H.str,A.str);
 /* estadísticas de todos */
 var over={};if(mins>0)over[S.me]=r;
 var xiH=H.xi,xiA=A.xi;
 creditMatch(desc,{xi:xiH,str:H.str},{xi:xiA,str:A.str},gh,ga,ev,over);
 applyResult(desc,gh,ga,pw);
 S.uxi=null;
 /* textos de los goles */
 var evs=ev.map(function(e){var s=e.side,tn=s==='h'?H.n:A.n,sc=e.sc===S.me?esc(S.name)+' (tú)':esc(S.pl[e.sc].n),as=e.as>=0?(e.as===S.me?esc(S.name)+' (tú)':esc(S.pl[e.as].n)):null;
  return {min:e.min,me:e.sc===S.me?'g':e.as===S.me?'a':'',txt:'Gol de '+sc+(e.fk?', de falta directa':e.pen?', de penalti':'')+(as?' (asist. '+as+')':'')+(s===side?'':' · '+esc(tn))};});
 /* puntos de habilidad */
 var vis=nat?1.3:Math.exp((S.clubs[me.c].str-50)/40),pts;
 if(mins>0)pts=Math.round((1+Math.max(0,r-5)*0.9+(gf>gc?1:0))*(0.45+0.55*mins/90)*(S.skills.length/8)*(0.8+0.2*M.imp)*growthF())+itemLvl('coach')+Math.round(gearFx('pts'));
 else pts=Math.round(S.skills.length/8)+itemLvl('coach');
 var gains={},ups=[],tw=0,gw=function(k){return k.w*(k.gr||1);};S.skills.forEach(function(k){tw+=gw(k);});
 for(var j=0;j<pts;j++){var x=Math.random()*tw,k=null,acc=0;for(var q=0;q<S.skills.length;q++){acc+=gw(S.skills[q]);if(x<acc){k=S.skills[q];break;}}
  if(!k||k.lvl>=capFor(k))continue;gains[k.n]=(gains[k.n]||0)+1;if(addProg(k,1))ups.push(k.n+' sube a nivel '+k.lvl);}
 ups.forEach(function(u){logm(u+'.');});
 /* medallas y primas */
 var medals=0,bonus=0,w=S.contract.wage;
 if(mins>0){medals=(r>=7?1:0)+(r>=8.5?1:0)+(r>=9.5?1:0)+(gf>gc?1:0)+(r>=7?itemLvl('psico'):0)+(M.imp>=1.8&&gf>gc?1:0);
  if(nat)bonus=Math.round(Math.max(0,r-5)*2500+(gf>gc?15000:0)+g*10000);
  else bonus=Math.round(Math.max(0,r-5)*400*Math.exp((S.clubs[me.c].str-40)/30))+(gf>gc?Math.round(w*0.15):0)+g*Math.round(w*0.4)+asi*Math.round(w*0.2)+((P.df||pos==='POR')&&gc===0&&mins>=60?Math.round(w*0.3):0);
  bonus=Math.round(bonus*M.imp*(1+(S.rel.fans-50)*0.004));
  if(!nat)bonus+=contractBonus(mins,g,asi);}
 S.medals+=medals;
 /* relaciones, moral y seguidores */
 if(mins>0){var res=gf>gc?1:gf<gc?-1:0;
  if(!nat){rel('team',res);rel('fans',res+(g?1:0));rel('coach',r>=7?1:r<5?-2:0);}
  else rel('fans',(g?2:0)+res);
  rel('press',(g>=2?2:0)+(r>=8.5?1:0)+(r<4.5?-1:0));
  moral((r-6.3)*3+res*2);
  if(tx('pressure')&&r<5.5){rel('press',-2);moral(-4);}
  S.fol=Math.round(S.fol*(1+0.002+Math.max(0,r-6)*0.003*vis+g*0.01*vis*M.imp+0.002*vis));}
 else{S.fol=Math.round(S.fol*1.001);if(M.role==='banquillo')moral(-2);}
 /* energía, lesiones y desgaste del material */
 var inj=0;
 S.energy=Math.max(0,S.energy-(mins+(typeof downMins==='function'?downMins(M)*0.6:0))/90*22*(1+tx('drain'))*(1-gearFx('drain')));
 if(mins>0){var pi=(S.energy<35?0.07:0.02)*(mins/90)*(1-0.3*itemLvl('physio'))*(1+tx('inj'))*(1-gearFx('inj'));
  if(Math.random()<pi){inj=2+Math.floor(Math.random()*4);if(itemLvl('physio'))inj=Math.max(2,inj-itemLvl('physio'));if(itemLvl('crio')>=2)inj=Math.max(2,inj-1);S.injured=inj;logm('Te lesionas. Baja de '+(inj-1)+' semana(s).');}
  wearGear();}
 /* estadísticas propias */
 var st=S.stats,ss=S.ss;
 if(mins>0){S.form=S.form||[];S.form.push(r1(r));if(S.form.length>5)S.form.shift();}
 if(mins>0){st.pj++;st.min+=mins;st.g+=g;st.a+=asi;st.rsum+=r;st.rn++;st.sv+=saves;
  if(nat){S.nt.caps++;S.nt.g+=g;S.nt.a+=asi;}
  else{ss.pj++;ss.g+=g;ss.a+=asi;ss.rsum+=r;ss.rn++;ss.min=(ss.min||0)+mins;if(M.role==='titular')ss.st=(ss.st||0)+1;}
  if((pos==='POR'||P.df)&&gc===0&&mins>=60){st.cs++;ss.cs=(ss.cs||0)+1;}}
 var decs=M.decs.map(function(d){return {min:d.min,n:d.opts[d.done].n,ok:d.ok,res:d.res,dec:d.dec};});
 var comp=compName(desc.ck)+(desc.rn?' · '+desc.rn:'');
 var rep={home:H.n,away:A.n,gh:gh,ga:ga,pw:pw,role:M.role,mins:mins,r:r,g:g,a:asi,saves:saves,gains:gains,pts:pts,bonus:bonus,medals:medals,evs:evs,inj:inj,comp:comp,decs:decs,imp:M.imp,nat:nat,win:gf>gc||(pw===side),lose:gf<gc||(pw&&pw!==side),gf:gf,gc:gc,red:M.red||0};
 cardsAfter(M,rep);
 rep.moments=checkMoments(M,rep);
 return rep;
}

/* ---------- semanas ---------- */
function compName(ck){var L=ck.charAt(0),k=ck.slice(2);
 if(L==='L')return byId(S.lgs,k).n+' ('+country(byId(S.lgs,k).co).n+')';
 if(L==='C')return S.cups[k].n;
 if(L==='E'||L==='T'){var T=tourById(k);return T?T.n:k;}
 if(L==='N')return 'Selección de '+nation(k).n;
 if(L==='P')return 'Play-off · '+country(k.slice(0,3)).n;return ck;}
function slotLabel(sl){
 if(!sl)return '';
 if(sl.k==='L')return 'Jornada de liga '+(sl.r+1);
 if(sl.k==='C')return 'Copa';
 if(sl.k==='E')return 'Europa · '+lpStageName({step:sl.r,md:8});
 if(sl.k==='P')return 'Play-offs de ascenso y promociones';
 if(sl.k==='N')return 'Parón de selecciones';
 if(sl.k==='T')return S.tours.map(function(t){return t.n;}).join(' / ');
 return '';
}
/* partido del jugador en la semana actual, si lo hay */
function myNextMatch(){
 var sl=S.cal[S.slot];if(!sl)return null;var me=S.pl[S.me],c=S.clubs[me.c];
 if(sl.k==='L'){var lg=lgOf(me.c),r=lgRoundAt(lg,sl.r);if(r<0)return null;var m=lgFix(lg)[r].filter(function(x){return x[0]===me.c||x[1]===me.c;})[0];return m?{h:m[0],a:m[1],ck:'L:'+lg.id,rn:'Jornada '+(r+1)}:null;}
 if(sl.k==='C'){var cu=S.cups[c.co];if(cu.win!=null||cu.alive.indexOf(me.c)<0)return null;return {cup:1,ck:'C:'+c.co};}
 if(sl.k==='E'){var T=S.eu.filter(function(t){return t.teams.indexOf(me.c)>=0;})[0];if(!T||!lpPlays(T,me.c))return null;return {eu:T.id,ck:'E:'+T.id};}
 if(sl.k==='P'){var B=null;Object.keys(S.po||{}).forEach(function(k){if(S.po[k].pairs.some(function(p){return p.a===me.c||p.b===me.c;}))B=S.po[k];});if(!B)return null;var pr=B.pairs.filter(function(p){return p.a===me.c||p.b===me.c;})[0];return {h:pr.a,a:pr.b,ck:'P:'+B.id,rn:poMatches(B)[B.pairs.indexOf(pr)].rn};}
 if(sl.k==='N')return {nt:1,ck:'N:'+me.nat};
 if(sl.k==='T'){var U=S.tours.filter(function(t){return t.teams.indexOf(me.nat)>=0;})[0];if(!U||U.win!=null||!S.tourCalled)return null;return {tour:U.id,ck:'T:'+U.id};}
 return null;
}
var batch=null;
function playSlot(pause){
 if(S.match||S.summary||S.retired)return null;
 var sl=S.cal[S.slot];S.wres=[];
 if(sl.k==='T'&&sl.r===0)S.tourCalled=tourCall();
 var ms=slotMatches(sl),mine=null;
 ms.forEach(function(d){if(isMine(d)&&!mine)mine=d;else playAI(d);});
 if(!mine){endSlot(null);return {none:1};}
 var M=prepMatch(mine);
 if(pause&&!S.auto&&M.decs.length){S.match=M;markDec(M);return {paused:1};}
 M.decs.forEach(function(d){markDec(M);autoDec(M,d);});
 var rep=finishMatch(M);endSlot(rep);return rep;
}
function choose(oi){
 var M=S.match;if(!M)return;
 var d=markDec(M);if(!d)return;
 oi=Math.max(0,Math.min(oi,d.opts.length-1));
 /* penalti: si lo tiras tú, antes eliges el disparo */
 if(d.spec==='pen'&&d.opts[oi]&&d.opts[oi].pk==='me'&&!d.aim&&typeof UI!=='undefined'&&!S.auto){UI.pen={oi:oi};render();return;}
 resolveDec(M,d,oi);
 /* resultado de la jugada en una ventana emergente */
 var o=d.opts[oi],gk=/^¡Gol!/.test(d.res)?'g':/^Asistencia/.test(d.res)?'a':null;
 M.clock=Math.max(M.clock||0,d.min);
 if(typeof UI!=='undefined')UI.pop={k:'dec',min:d.min,n:o.n,ok:d.ok,res:d.res,dec:d.dec,gk:gk,z:d.z,ef:o.ef,shot:o.shot,anim:d.anim,spr:d.spr,aim:d.aim,pout:d.pout,gkDir:d.gkDir,scNow:scoreAt(M,d.min),hn:M.hn,an:M.an,opp:S.pl[o.op].n};
 if(typeof s3dFor==='function'&&UI.pop)UI.pop.s3d=s3dFor(d,o,gk);
 markDec(M);
 save();render();
}
/* ---------- partido en directo: el reloj corre y se para en tus jugadas y en tus goles ---------- */
function liveTarget(M){var d=nextDec(M);return d?d.min:90;}
/* el gol o la asistencia tuya que cae en este minuto, si lo hay */
function liveGoalAt(M,min){return M.ev.filter(function(e){return e.min===min&&!e.x&&!e.shown&&(e.sc===S.me||e.as===S.me);})[0];}
/* avanza un minuto. Devuelve 'min', 'goal' (tu gol o asistencia), 'dec' (llega una jugada) o 'end' */
function liveStep(){
 var M=S.match;if(!M)return 'end';
 if(M.clock>=liveTarget(M))return nextDec(M)?'dec':liveEnd();
 M.clock++;if(typeof cardsTick==='function')cardsTick(M,M.clock);
 var g=liveGoalAt(M,M.clock);
 if(g){g.shown=1;if(typeof UI!=='undefined'){var mine=g.sc===S.me,o=g.sc===S.me?g.as:g.sc;
  UI.pop={k:'goal',gk:mine?'g':'a',min:g.min,fk:g.fk,z:g.fk?[76,50]:[80+Math.round(Math.random()*8),30+Math.round(Math.random()*40)],ef:'att',shot:1,n:'g'+g.min,s3d:typeof s3dGoal==='function'?s3dGoal(mine):null,with:o>=0&&S.pl[o]?S.pl[o].n:null,scNow:scoreAt(M,g.min),hn:M.hn,an:M.an};}return 'goal';}
 if(M.clock>=liveTarget(M))return nextDec(M)?'dec':liveEnd();
 return 'min';
}
/* salta hasta la próxima parada (jugada, gol tuyo o final) */
function liveJump(){var r,g=0;do{r=liveStep();}while(r==='min'&&g++<100);if(r!=='end'){save();render();}}
/* termina el partido: con quick (bot) resuelve solo lo que quede, sin ventanas */
function liveEnd(quick){
 var M=S.match;if(!M)return 'end';
 if(quick)M.decs.forEach(function(d){if(d.done<0){markDec(M);autoDec(M,d);}});
 S.match=null;if(typeof UI!=='undefined')UI.pen=null;var rep=finishMatch(M);endSlot(rep);
 if(rep){pressAfter(rep,true);if(!quick&&typeof UI!=='undefined'){UI.pop={k:'match',rep:rep};if(typeof s3dMatch==='function')UI.pop.s3d=s3dMatch(rep);}}
 save();if(!quick)render();return 'end';
}
function endSlot(rep){
 var sl=S.cal[S.slot],m0=slotMonth(S.slot);
 slotFinalize(sl);
 weekly(rep);
 if(rep){S.last=rep;S.reports=S.reports||[];S.reports.unshift(rep);if(S.reports.length>10)S.reports.length=10;if(batch){batch.n++;batch.pts+=rep.pts;batch.medals+=rep.medals;}}
 S.slot++;
 if(S.slot===janStart())genOffers('Se abre el mercado de invierno. Revisa las ofertas en Club.');
 if(S.slot>=S.cal.length||slotMonth(S.slot)!==m0)monthEnd(m0);
 if(S.slot>=S.cal.length)endSeason();
}
function janStart(){for(var i=0;i<S.cal.length;i++)if(S.cal[i].m===5)return i;return 30;}
function windowOpen(){var j=janStart();return S.slot<=4||(S.slot>=j&&S.slot<j+4);}
function weekly(rep){
 var inc=S.contract.wage,out=0;
 inc+=bizIncome();
 inc+=sponsorIncome();inc+=socialIncome();
 out+=Math.round(S.contract.wage*agentCom());
 if(S.cm)out+=byId(CMS,S.cm).c;
 S.money+=inc-out+(rep?rep.bonus:0);
 if(rep){rep.income=inc+rep.bonus;rep.costs=out;}
 if(batch)batch.money+=inc-out+(rep?rep.bonus:0);
 if(S.fund>0){var ret=S.fund*(0.0025+norm()*0.012);S.fund=Math.max(0,Math.round(S.fund+ret));}
 S.energy=Math.min(100,S.energy+14+4*itemLvl('nutri')+3*itemLvl('crio')+2*itemLvl('chef'));if(itemLvl('chef'))moral(itemLvl('chef')*0.4);
 if(S.injured>0)S.injured--;
 if(!rep){var k=pick(S.skills);if(addProg(k,1))logm(k.n+' sube a nivel '+k.lvl+'.');}
 cmWeekly();
 moral((50-S.moral)*0.05);
 S.acts=2;S.post=0;S.wk=(S.wk||0)+1;S.weekTrain=0;
 if(!S.event&&Math.random()<0.25)newEvent();
 boardWeekly();newsWeekly(rep);captainWeekly(rep);lifeWeekly();
}
function playN(n){
 if(S.summary||S.retired||S.match)return;
 if(S.freePending)freeStart();
 if(S.pre)return;
 /* límite de temporadas por día en la app (movil.js) */
 if(typeof seasonGate==='function'&&!seasonGate()){if(typeof UI!=='undefined'){UI.pop={k:'gate'};render();}return;}
 /* la rueda de prensa no bloquea: si sigues jugando sin responder, se da por no atendida */
 if(S.press){S.press=null;rel('press',-1);logm('No atiendes a la prensa tras el último partido.');}
 batch={n:0,pts:0,money:0,medals:0};
 var c=0,guard=0;
 while(c<n&&!S.summary&&!S.retired&&guard++<200){var r=playSlot(n===1);if(!r)break;if(r.paused)break;if(!r.none){c++;if(n===1)pressAfter(r,true);else pressAfter(r,false);}if(S.press)break;}
 var b=batch;batch=null;
 if(n===1&&b&&b.n===1&&S.last&&!S.match&&typeof UI!=='undefined'){UI.pop={k:'match',rep:S.last};if(typeof s3dMatch==='function')UI.pop.s3d=s3dMatch(S.last);}
 if(S.match)S.tab='match';
 save();render();
 if(b&&b.n>1)toast(b.n+' partidos: +'+b.pts+' puntos, '+fmt(b.money)+', '+b.medals+' medallas');
}

/* ---------- fin de temporada ---------- */
function endSeason(){
 var me=S.pl[S.me],c=S.clubs[me.c],lg=lgOf(me.c),tb=table(lg),pos=tb.indexOf(c)+1;
 var sm={season:S.season,pos:pos,club:c.n,league:lg.n,champion:pos===1,prize:0,age:S.age,renew:false,retire:false,ovBefore:overall(),apps:S.ss.pj,g:S.ss.g,a:S.ss.a,rating:S.ss.rn?S.ss.rsum/S.ss.rn:0,awards:[],moves:[]};
 var w=S.contract.wage;
 boardSeason(sm);rivalSeason();
 sm.prize=pos===1?w*12:pos<=4?w*5:pos<=Math.ceil(tb.length/2)?w*2:0;
 if(pos===1)addTrophy(lg.n+' ('+country(lg.co).n+')','liga');
 S.lgs.forEach(function(L){var t=table(L);S.champs.push({s:S.season,lg:L.id,c:t[0].id});});
 if(S.champs.length>400)S.champs=S.champs.slice(-400);
 sm.awards=seasonAwards();
 sm.awards.forEach(function(a){S.medals+=a.medals||0;sm.prize+=a.cash||0;});
 S.money+=sm.prize;
 S.hist.push({season:S.season,age:S.age,club:c.n,lg:lg.n,pos:pos,apps:S.ss.pj,g:S.ss.g,a:S.ss.a,rating:sm.rating,ov:sm.ovBefore});
 logm('Fin de temporada '+S.season+': '+pos+'º con '+c.n+(sm.champion?' (campeones)':'')+'.');
 /* clasificación europea antes de mover clubes */
 S.euq=euQualify(true);
 var euIn=null;S.euq.forEach(function(list,i){if(list.indexOf(me.c)>=0)euIn=EUNAMES[S.real?'real':'fic'][i];});sm.euNext=euIn;
 var hc0=hitoCtx(),moves=promoteRelegate();
 moves.forEach(function(m){if(m[0].id===me.c){sm.moved=m[2]>0?'Ascendéis a '+lgOf(me.c).n:'Descendéis a '+lgOf(me.c).n;if(m[2]>0)hito('asc','Ascenso a '+lgOf(me.c).n,hc0);}});
 driftClubs();
 /* edad */
 S.age++;
 Object.keys(S.rel).forEach(function(k){S.rel[k]=Math.round((S.rel[k]+(50-S.rel[k])*0.15)*10)/10;});
 if(S.age>=31){var dcl=declineFor(lgLevel());S.skills.forEach(function(k){k.pen+=Math.round((S.age-30)*(PHYS[k.id]?0.8:0.3)*dcl*10)/10;});}
 ageRosters();
 sm.transfers=aiTransfers().slice(0,6);
 sm.devs=aiSeasonEvolve();
 if(!S.freePending)captainSeason();rivalPick();
 /* contrato */
 S.contract.years--;
 /* sin renovación, te quedas libre al cerrar el resumen (vida.js · freeStart) */
 if(S.contract.years<=0){sm.free=S.clubs[me.c].n;S.freePending=1;logm('Se acaba tu contrato con '+S.clubs[me.c].n+'. Quedas libre.');}
 S.renewDue=S.contract.years===1?1:0;S.neg=null;S.bm=null;
 sponsorSeason();
 S.season++;
 startSeason();
 S.energy=100;S.injured=0;
 genOffers();
 sm.ovAfter=overall();
 if(S.age>=40){sm.retire=true;S.retired=true;}
 S.summary=sm;
}

/* ---------- nueva partida ---------- */
function wageFor(str,ov){var m=clamp((ov||str)/str,0.75,1.35);return Math.round(4000*Math.exp((str-40)/14)*m*agentWage()*(1+(S.rel.board-50)*0.002)*diff().w/100)*100;}
function newGame(name,pos,tp,ts,nat,co,real,look){
 real=!!real&&typeof REALDATA!=='undefined'&&!(typeof isApp==='function'&&isApp());
 S={v:VER,name:name,pos:pos,tp:tp,ts:ts,nat:nat,cat:defCat(pos),age:16,season:1,slot:0,money:60000,medals:5,energy:100,injured:0,bono:0,mult:1,moral:55,
  skills:newSkills(pos),pl:[],offers:[],items:{},invest:{},spons:[],sofs:[],agent:'a1',cm:null,gear:{},inv:[],
  stats:{pj:0,min:0,g:0,a:0,cs:0,sv:0,rsum:0,rn:0},ss:{pj:0,g:0,a:0,rsum:0,rn:0,cs:0},nt:{calls:0,caps:0,g:0,a:0,first:0},
  hist:[],log:[],trophies:[],hitos:[],aw:[],champs:[],bdo:[],last:null,tab:'home',retired:false,summary:null,rel:{coach:50,team:50,press:50,fans:50,board:50},
  fol:300,fund:0,auto:false,match:null,event:null,press:null,acts:2,post:0,posts:0,wres:[],contract:{wage:0,years:3}};
 S.real=real;S.realSeason=real?REALDATA.temporada:null;S.look=look?JSON.parse(JSON.stringify(look)):randomLook(pos);
 var w=buildWorld(real);S.clubs=w.clubs;S.lgs=w.lgs;S.lgBal=1;
 S.clubs.forEach(genRoster);
 /* empiezas sin club: c = -1 hasta que firmes en la pretemporada (pretemporada.js) */
 var mep={i:S.pl.length,n:name,p:pos,a:16,d:0,o:30,s:0,t:tp,nat:nat,c:-1,st:{},ms:[0,0,0,0],me:1};
 S.pl.push(mep);S.me=mep.i;S.cantera=null;S.startCo=co;
 S.tl={p:{t:0,x:0},s:{t:0,x:0}};S.tx=[];
 syncMe();
 S.euq=euQualify(false);
 startSeason();
 initPre(co);
 logm('Empiezas tu carrera sin club, a los 16 años. Pretemporada: busca equipo.');
 save();
}

/* ---------- entrenamiento ---------- */
function train(id){
 var k=mySk(id);
 if(k.lvl>=capFor(k)){var ci=capInfo(k.id);toast(ci.by?'Tu rasgo '+ci.by.n+' limita '+k.n+' a '+ci.cap+'.':capTop(k.id)>ci.cap?'Sube el rango de tu rasgo para pasar de '+ci.cap+' en '+k.n+'.':k.n+' ya está en su techo para tu puesto ('+ci.cap+').',1);return;}
 var n=S.mult,done=0,up=0;
 for(var i=0;i<n;i++){var c=pointCost(k,k.lvl);if(S.money<c)break;S.money-=c;up+=addProg(k,1);done++;S.weekTrain=(S.weekTrain||0)+1;if(k.lvl>=capFor(k))break;}
 if(!done){toast('No tienes dinero para entrenar '+k.n+'.',1);return;}
 if(up){toast(k.n+' sube a nivel '+k.lvl,0);logm(k.n+' sube a nivel '+k.lvl+'.');}
 save();render();
}
function promo(id){
 var k=mySk(id);
 if(k.lvl>=capFor(k)){toast('Esta habilidad ya está en su límite.',1);return;}
 var c=need(k.lvl)-k.prog;
 if(S.medals<c){toast('Necesitas '+c+' medallas y tienes '+S.medals+'.',1);return;}
 S.medals-=c;addProg(k,c);toast(k.n+' sube a nivel '+k.lvl,0);logm(k.n+' sube a nivel '+k.lvl+' con medallas.');save();render();
}
function bonoCost(){return 10000+3000*(S.bono/2);}
function bono(){if(S.bono>=70){toast('Bono al máximo.',1);return;}var c=bonoCost();if(S.money<c){toast('Te faltan '+fmt(c-S.money)+'.',1);return;}S.money-=c;S.bono+=2;save();render();}
