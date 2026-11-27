/* Estrella del Balón · balón parado: penaltis, córners, faltas y centros.
   Penalti a favor: decides si lo tiras tú o se lo dejas al lanzador. Si lo tiras, eliges lado, altura y potencia.
   Influyen tus Penaltis, Tiro, Potencia, Confianza y Concentración, si el penalti te lo han hecho a ti,
   la presión del partido y el portero rival. Quitarle el penalti al lanzador sin ser capitán o líder molesta en el vestuario. */

/* ---------- jugadas de balón parado (se suman al mazo de jugadas) ---------- */
var SITC_SP_TAKE=[
 {t:'Córner a favor: lo sacas tú.',v:'DFC',anim:'corner',z:[92,8],o:[
  {n:'Centro cerrado al primer palo',sk:['bpa','cen'],ok:['pos','sal'],rk:1,ef:'att'},
  {n:'Rosca al segundo palo, a tu rematador',sk:['efe','cen'],ok:['sal','cab'],rk:2,ef:'att'},
  {n:'En corto para combinar',sk:['pas','dec'],ok:['ant','mar'],vs:'MC',rk:0,ef:'att'}]},
 {t:'Falta lateral: la botas tú al área.',v:'DFC',anim:'cross',z:[76,16],o:[
  {n:'Centro tenso a media altura',sk:['bpa','cen'],ok:['pos','ant'],rk:1,ef:'att'},
  {n:'Con rosca buscando el remate',sk:['efe','bpa'],ok:['sal','cab'],rk:2,ef:'att'},
  {n:'Sacar rápido en corto',sk:['pas','vis'],ok:['ant','mar'],vs:'MC',rk:0,ef:'att'}]},
 {t:'Falta directa a 25 metros.',v:'POR',anim:'fk',z:[72,50],o:[
  {n:'Rosca por encima de la barrera',sk:['efe','bpa'],ok:['ref','sal'],rk:2,ef:'att',shot:1},
  {n:'Chut potente al palo del portero',sk:['pot','tir'],ok:['ref','pos'],rk:1,ef:'att',shot:1},
  {n:'Pase al compañero que entra',sk:['pas','vis'],ok:['ant','pos'],vs:'MCD',rk:0,ef:'att'}]}
];
var SITC_SP_AREA=[
 {t:'Córner a favor: atacas el área.',v:'DFC',anim:'corner',z:[90,46],o:[
  {n:'Cabezazo en el primer palo',sk:['cab','des'],ok:['sal','mar'],rk:1,ef:'att',shot:1},
  {n:'Desmarque al segundo palo y volea',sk:['des','pot'],ok:['mar','pos'],rk:2,ef:'att',shot:1},
  {n:'Bloquear al marcador para un compañero',sk:['fue','pos'],ok:['fue','mar'],rk:0,ef:'att'}]},
 {t:'Centro desde la banda al corazón del área.',v:'DFC',anim:'cross',z:[86,44],o:[
  {n:'Anticiparte al central y rematar',sk:['des','cab'],ok:['ant','sal'],rk:1,ef:'att',shot:1},
  {n:'Controlar con el pecho y chutar',sk:['ctl','pot'],ok:['ent','pos'],rk:2,ef:'att',shot:1},
  {n:'Dejarla de cabeza para el que llega',sk:['cab','vis'],ok:['sal','mar'],rk:0,ef:'att'}]}
];
function spPools(key){var t=['MC','MP','EXT','INT','LAT'].indexOf(key)>=0,a=['DC','DFC','MCD','MC'].indexOf(key)>=0;return (t?SITC_SP_TAKE:[]).concat(a?SITC_SP_AREA:[]);}

/* ---------- penaltis ---------- */
var PEN_DIR=[['izq','Izquierda'],['cen','Centro'],['der','Derecha']],PEN_H=[['abajo','Abajo'],['media','Media altura'],['arriba','Arriba']],PEN_W=[['suave','Suave'],['media','Media'],['fuerte','Fuerte']];
function penSkill(){return (skv('pnl')*2+skv('tir')+skv('pot')+skv('cfz')+skv('con'))/6;}
function penDesignated(){return (typeof isCaptain==='function'&&isCaptain())||skv('lid')>=65||(S.penTaker===(S.pl[S.me].c))||(S.penGoals||0)>=4;}
/* añade (a veces) un penalti a favor durante tus minutos */
function addPenDec(M,O,T){
 if(S.pos==='POR'||M.mins<=0)return;
 var P=POSD[S.pos],p=0.11*(M.mins/90)*(P.line==='DEL'?1.3:P.line==='MED'?1:0.7);if(Math.random()>=p)return;
 var gk=O.xi.filter(function(id){return S.pl[id].p==='POR';})[0];if(gk==null)gk=O.xi[0];
 var mates=T.xi.filter(function(id){return id!==S.me&&S.pl[id].p!=='POR';});if(!mates.length)return;
 var tk=mates.slice().sort(function(a,b){var x=S.pl[a],y=S.pl[b];return (pskill(y,'fin')+pskill(y,'tir'))-(pskill(x,'fin')+pskill(x,'tir'));})[0];
 var fouled=Math.random()<(P.line==='DEL'?0.6:P.line==='MED'?0.4:0.25),st=90-M.mins,mn=st+5+Math.floor(Math.random()*Math.max(1,M.mins-10));
 var me=penDesignated(),tn=S.pl[tk].n;
 M.decs.push({min:mn,spec:'pen',fouled:fouled?1:0,taker:tk,sit:(fouled?'¡Te derriban en el área! Penalti a favor.':'Penalti a favor: derriban a un compañero en el área.')+(me?' Eres el lanzador del equipo.':' El lanzador habitual es '+tn+'.'),main:gk,done:-1,anim:'pen',z:[88,50],
  opts:[{n:'Lanzarlo tú',pk:'me',sk:['pnl','tir'],ok:['ref','uno'],rk:1,ef:'att',shot:1,op:gk,min:mn,fm:0},
        {n:'Dejárselo a '+tn,pk:'mate',sk:['lid','dec'],ok:['ref','uno'],rk:0,ef:'att',op:gk,min:mn,fm:0}]});
}
function randAim(){return {d:pick(['izq','der','izq','der','cen']),h:pick(['abajo','media','media','arriba']),w:pick(['media','fuerte','media','suave'])};}
function penResolve(M,d,oi,aim){
 var o=d.opts[oi],side=mySide(M),gk=S.pl[o.op]||S.pl[d.main],gref=(pskill(gk,'ref')+pskill(gk,'uno'))/2;
 d.done=oi;d.anim='pen';
 if(o.pk==='mate'){var tk=S.pl[d.taker],sk=(pskill(tk,'fin')+pskill(tk,'tir'))/2,ok=Math.random()<clamp(0.64+(sk-gref)/150,0.5,0.88);
  d.aim=randAim();d.gkDir=ok?pick(['izq','der','cen'].filter(function(x){return x!==d.aim.d;})):d.aim.d;d.pout=ok?'gol':pick(['parada','parada','fuera']);d.ok=ok;
  if(ok){M.ev.push({min:d.min,side:side,sc:tk.i,as:-1,pen:1,shown:1});d.res='Gol de '+tk.n+' de penalti.';}
  else d.res=d.pout==='fuera'?tk.n+' manda el penalti fuera.':gk.n+' le para el penalti a '+tk.n+'.';
  if(d.fouled)rel('team',1);M.dr+=0.1;
  M.ev.sort(function(x,y){return x.min-y.min;});return;}
 aim=aim||randAim();d.aim=aim;
 var skl=penSkill(),press=(d.dec?0.03:0)+(M.imp>=1.6?0.02:0);
 var miss=clamp(0.03+(60-skl)/450+(aim.h==='arriba'?0.08:aim.h==='media'?0.02:0)+(aim.w==='fuerte'?0.05:aim.w==='suave'?-0.01:0)+(aim.d==='cen'?-0.01:0)+press-(d.fouled?0.015:0)-(S.moral-50)/1000,0.01,0.4);
 /* el portero: se queda en el centro a veces y adivina mejor si es bueno */
 var stay=Math.random()<0.18,gdir=stay?'cen':pick(['izq','der']);
 var read=clamp(0.33+(gref-skl)/300,0.22,0.5);if(!stay&&aim.d!=='cen'&&Math.random()<read)gdir=aim.d;
 var out;
 if(Math.random()<miss)out='fuera';
 else if(gdir===aim.d){var sv={abajo:0.62,media:0.5,arriba:0.18}[aim.h]+{suave:0.22,media:0,fuerte:-0.22}[aim.w]+(gref-penSkill())/220;
  if(aim.d==='cen')sv=aim.w==='suave'?0.85:aim.w==='media'?0.6:0.4;out=Math.random()<clamp(sv,0.05,0.92)?'parada':'gol';}
 else out='gol';
 d.gkDir=gdir;d.pout=out;d.ok=out==='gol';
 var where={izq:'a la izquierda',cen:'al centro',der:'a la derecha'}[aim.d]+', '+{abajo:'raso',media:'a media altura',arriba:'arriba'}[aim.h];
 if(out==='gol'){M.ev.push({min:d.min,side:side,sc:S.me,as:-1,pen:1,mine:1,shown:1});M.mg++;S.penGoals=(S.penGoals||0)+1;M.dr+=0.5;moral(2);
  d.res='¡Gol! Marcas el penalti '+where+(gdir!==aim.d?' y '+gk.n+' se tira al otro lado.':', imposible para '+gk.n+'.');}
 else{M.dr-=0.6;moral(-3);d.res=out==='fuera'?'Fallas el penalti: el balón se va '+(aim.h==='arriba'?'por encima del larguero.':'fuera, junto al palo.'):gk.n+' te para el penalti: adivina el lado.';}
 if(!penDesignated()&&!d.fouled){rel('team',out==='gol'?-1:-3);if(out!=='gol')rel('coach',-1);}
 if(out==='gol'&&(S.penGoals||0)>=3&&S.penTaker!==S.pl[S.me].c&&!nat(M)){S.penTaker=S.pl[S.me].c;logm('El míster te nombra lanzador de penaltis del equipo.');}
 M.ev.sort(function(x,y){return x.min-y.min;});
}
function nat(M){return !!(M&&M.desc&&M.desc.nat);}
/* ventana para elegir el disparo */
function penAimHTML(){
 var P=UI.pen,M=S.match;if(!P||!M)return '';var d=nextDec(M);if(!d)return '';var gk=S.pl[d.main];
 var grp=function(k,list,lbl){return '<p style="margin:10px 0 6px"><b>'+lbl+'</b></p><div class="chips">'+list.map(function(x){var on=P[k]===x[0];return '<button class="chip'+(on?' on':'')+'" data-a="penset" data-k="'+k+'" data-id="'+x[0]+'" aria-pressed="'+on+'">'+x[1]+'</button>';}).join(' ')+'</div>';};
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Lanzar el penalti"><div class="card pop">'+
  '<span class="badge">PENALTI · MINUTO '+d.min+"'</span><h2 style='margin:6px 0'>Elige tu disparo</h2>"+
  '<p class="small mut">Bajo los palos: <b>'+esc(gk.n)+'</b> (reflejos '+pskill(gk,'ref')+', mano a mano '+pskill(gk,'uno')+'). Tu golpeo: penaltis '+Math.round(skv('pnl'))+', tiro '+Math.round(skv('tir'))+', potencia '+Math.round(skv('pot'))+', confianza '+Math.round(skv('cfz'))+(d.fouled?' · te lo han hecho a ti: vas con confianza':'')+'.</p>'+
  grp('d',PEN_DIR,'Lado')+grp('h',PEN_H,'Altura')+grp('w',PEN_W,'Potencia')+
  '<p class="small mut">Arriba y fuerte es casi imparable si va entre los palos, pero es más fácil fallar. Raso y suave es seguro, pero si el portero adivina el lado, lo para.</p>'+
  '<div class="btns" style="margin-top:10px"><button class="go'+(P.d&&P.h&&P.w?'':' dis')+'" data-a="penshoot">Chutar</button><button class="go alt" data-a="pencancel">Volver</button></div></div></div>';
}
function penSet(k,v){if(!UI.pen)return;UI.pen[k]=v;render();}
function penShoot(){var P=UI.pen,M=S.match;if(!P||!M)return;if(!(P.d&&P.h&&P.w)){toast('Elige lado, altura y potencia.',1);return;}var d=nextDec(M);if(!d)return;d.aim={d:P.d,h:P.h,w:P.w};UI.pen=null;choose(P.oi);}
function penCancel(){UI.pen=null;render();}

/* ---------- animaciones de balón parado ---------- */
/* penalti visto desde detrás del lanzador: carrerilla, golpeo, el portero se lanza y el balón va a su sitio */
function penAnimSVG(P){
 var W=320,H=200,a=P.aim||{d:'cen',h:'media',w:'media'},out=P.pout||'gol',g=P.gkDir||'cen',key='pen'+P.min+'_'+P.n;
 var still=UI.animSeen===key||(typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);if(!still)setTimeout(function(){UI.animSeen=key;},3600);
 var gx0=70,gx1=250,gy0=46,gy1=146,tx={izq:98,cen:160,der:222}[a.d],ty={abajo:132,media:102,arriba:62}[a.h];
 if(out==='fuera'){if(a.h==='arriba'){ty=30;}else{tx=a.d==='der'?268:a.d==='izq'?52:tx+40;}}
 var kdx={izq:-46,cen:0,der:46}[g],krot={izq:-62,cen:0,der:62}[g];
 if(out==='parada'){tx=160+kdx*0.9;ty=a.h==='arriba'?70:a.h==='media'?100:126;}
 var dur=a.w==='fuerte'?0.35:a.w==='suave'?0.75:0.5,tKick=1.0,tEnd=tKick+dur,kit=clubColors(myClub());
 var anim=function(attr,from,to,beg,d){return still?'':'<animate attributeName="'+attr+'" from="'+from+'" to="'+to+'" begin="'+beg+'s" dur="'+d+'s" fill="freeze"/>';};
 var net='';for(var i=0;i<=10;i++)net+='<line x1="'+(gx0+i*18)+'" y1="'+gy0+'" x2="'+(gx0+i*18)+'" y2="'+gy1+'"/>';for(var j=0;j<=6;j++)net+='<line x1="'+gx0+'" y1="'+(gy0+j*16.6)+'" x2="'+gx1+'" y2="'+(gy0+j*16.6)+'"/>';
 /* portero: figura con brazos; se lanza girando hacia el lado */
 var keeper='<g transform="translate(160 146)'+(still?' translate('+kdx+' 0) rotate('+krot+')':'')+'">'+
  (still?'':'<animateTransform attributeName="transform" type="translate" from="160 146" to="'+(160+kdx)+' 146" begin="'+(tKick-0.05)+'s" dur=".45s" fill="freeze"/>')+
  '<g>'+(still?'':'<animateTransform attributeName="transform" type="rotate" from="0" to="'+krot+'" begin="'+(tKick-0.05)+'s" dur=".45s" fill="freeze"/>')+
  '<rect x="-9" y="-50" width="18" height="30" rx="6" fill="#f5c542"/><circle cx="0" cy="-58" r="8" fill="#e0b48a"/><line x1="-6" y1="-20" x2="-8" y2="0" stroke="#222" stroke-width="6" stroke-linecap="round"/><line x1="6" y1="-20" x2="8" y2="0" stroke="#222" stroke-width="6" stroke-linecap="round"/>'+
  '<line x1="-9" y1="-46" x2="-26" y2="-66" stroke="#f5c542" stroke-width="5" stroke-linecap="round"/><line x1="9" y1="-46" x2="26" y2="-66" stroke="#f5c542" stroke-width="5" stroke-linecap="round"/></g></g>';
 /* lanzador de espaldas: corre hacia el balón */
 var kicker='<g transform="translate('+(still?150:118)+' '+(still?208:238)+')">'+(still?'':'<animateTransform attributeName="transform" type="translate" from="118 238" to="150 208" begin="0.2s" dur=".8s" fill="freeze"/>')+
  '<rect x="-11" y="-44" width="22" height="30" rx="7" fill="'+kit.a+'"/><text x="0" y="-24" text-anchor="middle" font-size="12" font-weight="700" fill="'+kit.b+'">'+(S.look&&S.look.num||10)+'</text><circle cx="0" cy="-52" r="9" fill="#3b2a20"/><line x1="-6" y1="-14" x2="-9" y2="6" stroke="#fff" stroke-width="6" stroke-linecap="round"/><line x1="6" y1="-14" x2="12" y2="4" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>';
 var bx=still?tx:160,by=still?ty:176,br=still?5:9;
 var ball='<circle cx="'+bx+'" cy="'+by+'" r="'+br+'" fill="#fff" stroke="#111" stroke-width="1.5">'+anim('cx',160,tx,tKick,dur)+anim('cy',176,ty,tKick,dur)+anim('r',9,5,tKick,dur)+
  (out==='parada'&&!still?'<animate attributeName="cy" from="'+ty+'" to="'+(ty+40)+'" begin="'+tEnd+'s" dur=".4s" fill="freeze"/><animate attributeName="cx" from="'+tx+'" to="'+(tx+(kdx>0?40:-40))+'" begin="'+tEnd+'s" dur=".4s" fill="freeze"/>':'')+'</circle>';
 var ripple=out==='gol'?'<rect x="'+(tx-26)+'" y="'+(ty-20)+'" width="52" height="40" fill="none" stroke="#fff" stroke-width="2" opacity="'+(still?0.7:0)+'">'+(still?'':'<animate attributeName="opacity" values="0;1;.3;.8" begin="'+tEnd+'s" dur=".6s" fill="freeze"/>')+'</rect>':'';
 var lbl={gol:'¡GOL!',parada:'¡PARADA!',fuera:'¡FUERA!'}[out];
 return '<svg class="playanim pen" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animación del penalti: '+lbl+'">'+
  '<rect width="'+W+'" height="'+H+'" fill="#1d6f40"/><rect y="0" width="'+W+'" height="40" fill="#0d1a2c"/><rect y="146" width="'+W+'" height="'+(H-146)+'" fill="#23884e"/>'+
  '<g stroke="rgba(255,255,255,.35)" stroke-width="1">'+net+'</g><rect x="'+gx0+'" y="'+gy0+'" width="'+(gx1-gx0)+'" height="'+(gy1-gy0)+'" fill="none" stroke="#fff" stroke-width="5"/>'+
  '<ellipse cx="160" cy="180" rx="5" ry="2" fill="#fff" opacity=".8"/>'+ripple+keeper+kicker+ball+
  '<text x="160" y="28" text-anchor="middle" font-size="18" font-weight="800" fill="'+(out==='gol'?'#f5c542':'#fff')+'" opacity="'+(still?1:0)+'">'+lbl+(still?'':'<animate attributeName="opacity" from="0" to="1" begin="'+(tEnd+0.15)+'s" dur=".3s" fill="freeze"/>')+'</text></svg>';
}

SITC_SP_TAKE.forEach(function(s){s.role='take';});SITC_SP_AREA.forEach(function(s){s.role='area';});
/* córner, falta lateral y falta directa vistos desde arriba: el balón sale del banderín o del punto de la falta */
function setPieceSVG(P){
 var W=320,H=170,kit=clubColors(myClub()),key='sp'+P.min+'_'+P.n,still=UI.animSeen===key||(typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 if(!still)setTimeout(function(){UI.animSeen=key;},3200);
 var gx=W-8,gy=H/2,j=(P.min%20)-10,fk=P.anim==='fk',take=P.spr==='take'||fk;
 var sx=P.anim==='corner'?W-8:fk?W*0.7:W*0.72,sy=P.anim==='corner'?8:fk?H/2+j:14;
 var me=take?[sx,sy]:[W-44,gy-12+j*0.6],mate=[W-40,gy+14-j*0.5],def=[W-52,gy+j*0.4];
 var goal=P.gk==='g'||P.gk==='a'||(P.ok&&P.shot&&/Gol/.test(P.res||'')),seq=[];
 if(fk){seq=[[sx,sy,goal?gx-2:P.ok?gx-14:gx+2,goal?gy-10+j:P.ok?gy+4:gy-34,0.5,0.7]];}
 else if(goal&&take){seq=[[sx,sy,mate[0],mate[1],0.4,0.7],[mate[0],mate[1],gx,gy+j*0.5,1.15,0.35]];}
 else if(goal){seq=[[sx,sy,me[0],me[1],0.4,0.7],[me[0],me[1],gx,gy-8,1.15,0.35]];}
 else if(P.ok){var t=take?mate:me;seq=[[sx,sy,t[0],t[1],0.4,0.7],[t[0],t[1],gx+2,gy-40,1.15,0.4]];}
 else seq=[[sx,sy,def[0],def[1],0.4,0.7],[def[0],def[1],W-150,gy+30,1.15,0.6]];
 var mv=function(s){return still?'':'<animateMotion path="M0 0 L'+(s[2]-s[0]).toFixed(1)+' '+(s[3]-s[1]).toFixed(1)+'" begin="'+s[4]+'s" dur="'+s[5]+'s" fill="freeze"/>';};
 var balls='';seq.forEach(function(s,i){var last=i===seq.length-1;
  if(still){if(last)balls+='<circle cx="'+s[2]+'" cy="'+s[3]+'" r="4.5" fill="#fff" stroke="#111"/>';return;}
  balls+='<circle cx="'+s[0]+'" cy="'+s[1]+'" r="'+(i?4.5:5.5)+'" fill="#fff" stroke="#111" opacity="'+(i?0:1)+'">'+(i?'<set attributeName="opacity" to="1" begin="'+s[4]+'s"/>':'')+mv(s)+(!last?'<set attributeName="opacity" to="0" begin="'+seq[i+1][4]+'s"/>':'')+'</circle>';});
 var wall=fk?[-14,0,14].map(function(o){return '<circle cx="'+(sx+30)+'" cy="'+(sy+o)+'" r="6" fill="#e53935" stroke="#fff"/>';}).join(''):'';
 var end=seq[seq.length-1],lbl=goal?'¡GOL!':P.ok?(fk?'¡AL LARGUERO!':'¡REMATE!'):(fk?'¡PARADA!':'¡DESPEJE!');
 return '<svg class="playanim" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animación del balón parado">'+
  '<rect width="'+W+'" height="'+H+'" rx="10" fill="#1f7a46"/><g fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.4"><rect x="4" y="4" width="'+(W-8)+'" height="'+(H-8)+'"/><rect x="'+(W-70)+'" y="'+(H/2-48)+'" width="66" height="96"/><rect x="'+(W-26)+'" y="'+(H/2-22)+'" width="22" height="44"/><path d="M'+(W-70)+' '+(H/2-18)+' A22 22 0 0 0 '+(W-70)+' '+(H/2+18)+'"/></g>'+
  '<rect x="'+(W-6)+'" y="'+(H/2-16)+'" width="4" height="32" fill="#fff"/>'+(P.anim==='corner'?'<line x1="'+(W-6)+'" y1="6" x2="'+(W-6)+'" y2="-6" stroke="#f5c542" stroke-width="2"/>':'')+wall+
  '<circle cx="'+def[0]+'" cy="'+def[1]+'" r="9" fill="#e53935" stroke="#fff" stroke-width="2"/><circle cx="'+(W-60)+'" cy="'+(gy-26)+'" r="9" fill="#e53935" stroke="#fff" stroke-width="2"/><circle cx="'+(W-14)+'" cy="'+gy+'" r="9" fill="#f5c542" stroke="#fff" stroke-width="2"/>'+
  '<circle cx="'+mate[0]+'" cy="'+mate[1]+'" r="9" fill="'+kit.a+'" stroke="#fff" stroke-width="2"/><circle cx="'+me[0]+'" cy="'+me[1]+'" r="10" fill="'+kit.a+'" stroke="#f5c542" stroke-width="3"/>'+balls+
  '<text x="'+(W/2-40)+'" y="26" text-anchor="middle" font-size="16" font-weight="800" fill="'+(goal?'#f5c542':'#fff')+'" opacity="'+(still?1:0)+'">'+lbl+(still?'':'<animate attributeName="opacity" from="0" to="1" begin="'+(end[4]+end[5]).toFixed(2)+'s" dur=".3s" fill="freeze"/>')+'</text></svg>';
}