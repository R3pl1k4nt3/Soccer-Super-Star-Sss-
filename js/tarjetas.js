/* Estrella del Balón · tarjetas y sanciones.
   - Amarilla al perder un duelo defensivo (más probable cuanto más arriesgada es la opción) o en una entrada fuerte ganada;
     también alguna suelta en tus minutos según tu puesto. Tu Concentración las reduce. Dos amarillas son roja.
   - Roja directa: de 1 a 3 partidos de sanción; doble amarilla: 1 partido. Cada 5 amarillas de liga: 1 partido (ciclo).
   - Las sanciones se cumplen en partidos de club. Expulsado, dejas de jugar: tus goles y minutos cuentan hasta la roja.
   - Los rivales y compañeros también ven tarjetas, y para ellos dos amarillas también son roja.
   - Un equipo con uno menos pierde fuerza para el resto del partido y se cansa antes. */
function cardP(base){return clamp(base*(1-(skv('con')-50)/250),0.01,0.6);}
/* al preparar el partido: tarjetas sueltas tuyas y de los demás */
function cardsPrep(M){
 M.cards=[];M.yc=0;M.down={h:0,a:0};
 var side=mySide(M),os=side==='h'?'a':'h';
 /* el resto de jugadores: dos amarillas son roja y después de la roja no hay más tarjetas */
 [M.txi,M.oxi].forEach(function(xi,k){
  var n=poisson(1.7),raw=[];
  for(var i=0;i<n;i++){var id=pick(xi);if(id===S.me)continue;raw.push({min:1+Math.floor(Math.random()*89),id:id,t:Math.random()<0.025?'r':'y'});}
  raw.sort(function(a,b){return a.min-b.min;});
  var y={},off={};
  raw.forEach(function(c){
   if(off[c.id])return;
   var sd=k?os:side;
   /* el amonestado se cuida: la mitad de las veces evita la segunda */
   if(c.t==='y'&&y[c.id]&&Math.random()<0.5)return;
   if(c.t==='y'){M.cards.push({min:c.min,id:c.id,t:'y',side:k});y[c.id]=(y[c.id]||0)+1;if(y[c.id]<2)return;}
   M.cards.push({min:c.min,id:c.id,t:'r',side:k,r2:c.t==='y'?1:0});off[c.id]=1;manDown(M,sd,c.min,c.id);});
 });
 if(M.mins){var st=90-M.mins,line=(POSD[S.pos]||{}).line,f={POR:0.25,DEF:1.35,MED:1.1,DEL:0.7}[line]||1;
  if(Math.random()<cardP(0.1*f*(M.mins/90)))M.cards.push({min:st+3+Math.floor(Math.random()*Math.max(1,M.mins-6)),id:S.me,t:'y',me:1,pend:1});}
 M.cards.sort(function(a,b){return a.min-b.min;});
}
/* un equipo se queda con uno menos en el minuto min: pierde fuerza (MANSTR por expulsado) y, con esa fuerza,
   se vuelve a jugar lo que queda de partido. El marcador sale de la nueva fuerza: no se quitan ni se ponen goles a mano.
   Solo cambia lo que aún no se ha visto en el directo; tus goles ya decididos se respetan (salvo si el expulsado eres tú). */
var MANSTR=7;
function manDown(M,sd,min,id){
 M.down=M.down||{h:0,a:0};M.down[sd]++;M.downAt=M.downAt||{};if(M.downAt[sd]==null)M.downAt[sd]=min;
 M.sv=M.sv||{h:M.hs,a:M.as};M.sv[sd]-=MANSTR;M.off=M.off||{};M.off[id]=1;
 resimFrom(M,Math.max(min,M.clock||0),id===S.me);
}
/* vuelve a jugar desde el minuto from con las fuerzas actuales (M.sv). dropMine: tus goles ya decididos también se descartan */
function resimFrom(M,from,dropMine){
 var rem=(90-from)/90,mine=mySide(M);if(rem<=0)return;
 var off=M.off||{},xiOf=function(s){return (s===mine?M.txi:M.oxi).filter(function(x){return !off[x];});};
 /* lo que queda por jugar se descarta, menos tus goles y asistencias ya decididos */
 var kept={h:0,a:0};
 M.ev=M.ev.filter(function(e){if(e.x||e.shown||e.min<=from)return true;
  var me=(e.sc===S.me||e.as===S.me)&&!dropMine;if(me){kept[e.side]++;if(e.as!=null&&off[e.as])e.as=-1;}return me;});
 /* y se juega de nuevo con las fuerzas actuales */
 var d=M.sv.h+(M.desc&&M.desc.neutral?0:3)-M.sv.a,lam={h:1.35*Math.exp(d/30)*rem,a:1.1*Math.exp(-d/30)*rem};
 ['h','a'].forEach(function(s){var n=Math.max(0,poisson(lam[s])-kept[s]),xi=xiOf(s);
  for(var i=0;i<n;i++){var sc=pickSc(xi,-1),as=Math.random()<0.7?pickSc(xi,sc):-1;
   M.ev.push({min:Math.min(90,from+1+Math.floor(Math.random()*Math.max(1,90-from))),side:s,sc:sc,as:as===sc?-1:as});}});
 M.ev.sort(function(x,y){return x.min-y.min;});
}
/* ---------- tu equipo se queda con uno menos y tú sigues en el campo: decides tú ---------- */
var TENO=[
 {k:'sac',n:'Sacrificarte: bajar a ayudar en defensa',d:'El equipo sufre menos (+3 de fuerza), pero te cansas más y tendrás menos ocasiones de gol. Al entrenador le gusta.'},
 {k:'pos',n:'Mantener tu puesto',d:'Sigues igual: el equipo juega con la fuerza que le queda.'},
 {k:'cam',n:'Pedir el cambio para que entre un jugador de refresco',d:'Entra alguien que ayuda más atrás (+2 de fuerza). Tú dejas de jugar y ahorras energía.'}];
/* al pasar el reloj por la roja de un compañero */
function tenCheck(M,min){
 if(M.tenDone||M.red||M.subOff||!M.mins||min<90-M.mins)return null;
 var c=(M.cards||[]).filter(function(x){return x.t==='r'&&!x.me&&x.side===0&&x.min===min;})[0];
 if(!c)return null;M.tenDone=1;M.tenAsk={min:min,n:(S.pl[c.id]||{}).n||''};return M.tenAsk;
}
function tenChoose(i){
 var M=S.match;if(!M||!M.tenAsk)return;var o=TENO[i]||TENO[1],min=M.tenAsk.min,sd=mySide(M);M.tenAsk=null;M.tenPick=o.k;
 if(o.k==='sac'){M.sv[sd]+=3;M.sac=1;M.dr+=0.4;rel('coach',1);resimFrom(M,Math.max(min,M.clock||0),false);logm('Con uno menos, te sacrificas en defensa.');}
 else if(o.k==='cam'){M.sv[sd]+=2;M.subOff=min;M.off[S.me]=1;
  M.decs.forEach(function(d){if(d.done<0&&d.min>min){d.done=0;d.ok=false;d.res='Ya te han cambiado';d.skip=1;}});
  resimFrom(M,Math.max(min,M.clock||0),true);logm('Con uno menos, pides el cambio en el minuto '+min+'.');}
 if(typeof UI!=='undefined')UI.pop=null;save();render();
}
function tenPopHTML(a){
 return '<h2>¡Os quedáis con diez!</h2><p class="small mut">Minuto '+a.min+"'. Expulsan a "+esc(a.n)+'. ¿Qué haces?</p>'+
  TENO.map(function(o,i){return '<button class="opt" data-a="tenpick" data-i="'+i+'"><b>'+esc(o.n)+'</b><div class="small mut" style="margin-top:3px">'+esc(o.d)+'</div></button>';}).join('');
}
/* minutos que tu equipo juega con uno menos mientras tú estás en el campo (para el cansancio) */
function downMins(M){var s=mySide(M),a=M.downAt&&M.downAt[s];if(a==null)return 0;var end=M.red||M.subOff||90,st=90-(M.mins0||M.mins);return Math.max(0,end-Math.max(a,st))*(M.down[s]||1)*(M.sac?1.6:1);}
/* el rival con uno menos se cansa antes (sus duelos contra ti) y tu equipo con uno menos también lo nota */
function downTired(min){var M=S.match;if(!M||!M.downAt)return 0;var s=mySide(M),os=s==='h'?'a':'h',a=M.downAt[os];return a!=null&&min>a?Math.min(1,(min-a)/45)*0.06*(M.down[os]||1):0;}
function downDuel(min){var M=S.match;if(!M||!M.downAt)return 0;var s=mySide(M),a=M.downAt[s];return a!=null&&min>a?0.03*(M.down[s]||1):0;}
/* goleador al azar que no seas tú ni el expulsado (los goles tuyos se deciden en tus jugadas) */
function pickSc(xi,id){var ok=xi.filter(function(x){return x!==id&&x!==S.me;});return wpickXI(ok.length?ok:xi,-1,'sg');}
/* las amarillas sueltas tuyas se reciben cuando el reloj llega a su minuto */
function cardsTick(M,min){
 if(!M.cards)return;
 M.cards.forEach(function(c){if(!c.pend||c.min>min)return;c.pend=0;
  if((M.red&&c.min>=M.red)||(M.subOff&&c.min>=M.subOff)){c.void=1;return;}
  M.yc=(M.yc||0)+1;
  if(M.yc>=2&&!M.red){M.red=c.min;M.red2=1;M.cards.push({min:c.min,id:S.me,t:'r',me:1});expel(M,c.min);manDown(M,mySide(M),c.min,S.me);}});
 M.cards.sort(function(a,b){return a.min-b.min;});
}
/* amarilla (o segunda amarilla) para ti en un minuto */
function myYellow(M,min){
 if(M.red)return '';cardsTick(M,min);if(M.red)return '';
 M.yc=(M.yc||0)+1;M.cards.push({min:min,id:S.me,t:'y',me:1});
 if(M.yc>=2){M.red=min;M.red2=1;M.cards.push({min:min,id:S.me,t:'r',me:1});expel(M,min);manDown(M,mySide(M),min,S.me);return ' · Segunda amarilla: ¡expulsado!';}
 return ' · Tarjeta amarilla';
}
/* expulsado: las jugadas que quedan no las juegas */
function expel(M,min){M.decs.forEach(function(d){if(d.done<0&&d.min>min){d.done=0;d.ok=false;d.res='Estás expulsado';d.skip=1;}});}
/* tras cada duelo: entradas que se pagan con tarjeta */
function cardOnDuel(M,d,o,ok){
 if(o.ef!=='def')return;M.cards=M.cards||[];
 if(/roja/.test(d.res||'')&&!M.redDone){M.redDone=1;M.cards.push({min:d.min,id:S.me,t:'r',me:1});expel(M,d.min);manDown(M,mySide(M),d.min,S.me);return;}
 if(M.red)return;
 var lf={POR:0.2,DEF:1,MED:0.8,DEL:0.5}[(POSD[S.pos]||{}).line]||1,p=(ok?(o.rk===2?0.06:0):[0.04,0.1,0.2][o.rk])*lf;
 if(p&&Math.random()<cardP(p))d.res+=myYellow(M,d.min);
}
/* al cerrar el partido: amarillas sueltas, minutos hasta la roja y goles después de la expulsión */
function cardsFinish(M){
 if(!M.cards)return;
 cardsTick(M,90);
 if(M.subOff&&!M.red&&M.mins>0){M.mins0=M.mins;M.mins=Math.max(1,M.subOff-(90-M.mins0));}
 if(M.red&&M.mins>0){M.mins0=M.mins0||M.mins;var st=90-M.mins0,played=Math.max(1,M.red-st);
  M.ev.forEach(function(e){if(e.min<=M.red)return;if(e.sc===S.me){e.sc=wpickXI(M.txi,S.me,'sg');e.mine=e.as===S.me?1:0;}if(e.as===S.me)e.as=-1;});
  M.mins=played;}
 M.cards=M.cards.filter(function(c){return !c.void&&!c.pend;}).sort(function(a,b){return a.min-b.min;});
}
/* tras el partido: sanciones, ciclo de amarillas y relaciones */
function cardsAfter(M,rep){
 var club=!(M.desc&&M.desc.nat),lg=M.desc&&/^L:/.test(M.desc.ck);
 if(M.role==='sancionado'){S.ban=Math.max(0,(S.ban||0)-1);logm(S.ban?'Cumples un partido de sanción. Te quedan '+S.ban+'.':'Cumples la sanción: ya puedes volver a jugar.');}
 if(!M.cards)return;var y=M.cards.filter(function(c){return c.me&&c.t==='y';}).length,r=M.red?1:0;
 if(rep){rep.yc=y;rep.rc=r;rep.sub=M.subOff?1:0;rep.cards=M.cards.map(function(c){var p=S.pl[c.id];return {min:c.min,t:c.t,me:c.me?1:0,r2:c.r2||(c.me&&c.t==='r'&&M.red2)?1:0,n:c.id===S.me?S.name:(p?p.n:'')};});}
 S.stats.yc=(S.stats.yc||0)+y;S.stats.rc=(S.stats.rc||0)+r;if(S.ss){S.ss.ya=(S.ss.ya||0)+y;S.ss.ra=(S.ss.ra||0)+r;}
 if(r&&club){var ban=M.red2?1:1+Math.floor(Math.random()*2.4);S.ban=(S.ban||0)+ban;rel('coach',-4);rel('team',-2);moral(-4);
  logm((M.red2?'Expulsado por doble amarilla':'Roja directa')+': '+ban+' partido(s) de sanción.');}
 if(lg&&y&&!M.red2){var before=S.ss.yc||0;S.ss.yc=before+y;if(Math.floor(S.ss.yc/5)>Math.floor(before/5)){S.ban=(S.ban||0)+1;logm('Ciclo de amarillas: '+S.ss.yc+' en liga. Te pierdes el próximo partido.');}}
}
function cardIco(t){return "<span class='tarjeta-ico "+(t==='r'?'tj-roja':'tj-amarilla')+"' aria-label='"+(t==='r'?'Roja':'Amarilla')+"'></span>";}
function cardsHTML(r){
 if(!r.cards||!r.cards.length)return '';
 return '<h3 style="margin-top:12px">Tarjetas</h3>'+r.cards.map(function(c){return '<div class="ev"><b class="num">'+c.min+"'</b><span>"+cardIco(c.t)+' <span class="'+(c.me?'me':'')+'">'+esc(c.n)+(c.me?' (tú)':'')+'</span>'+(c.t==='r'?' <span class="small mut">'+(c.r2?'doble amarilla, ':'')+'expulsado</span>':'')+'</span></div>';}).join('');
}
/* tarjetas ya vistas en el directo (hasta el minuto c) */
function cardsFeed(M,c){
 var mine=mySide(M);
 return (M.cards||[]).filter(function(x){return !x.pend&&!x.void&&x.min<=c;}).map(function(x){var p=S.pl[x.id],n=x.id===S.me?S.name+' (tú)':(p?p.n:'');
  var team=x.me||x.side===0?(mine==='h'?M.hn:M.an):(mine==='h'?M.an:M.hn);
  return {min:x.min,cls:x.me?'me':'mut',t:cardIco(x.t)+' '+esc(n)+(x.t==='r'?' · expulsado, '+esc(team)+' se queda con uno menos':'')};});
}
function banTxt(){var p=[];if(S.ban>0)p.push('Sancionado: te pierdes '+S.ban+' partido(s) de club.');var y=(S.ss&&S.ss.yc)||0;if(y%5===4)p.push('Apercibido: llevas '+y+' amarillas en liga; una más y te pierdes un partido.');return p;}
/* antes del partido: tu situación de tarjetas */
function cardLine(nm){
 var y=(S.ss&&S.ss.yc)||0,ban=S.ban||0,club=!nm.nat,t='',k='mut';
 if(ban>0&&club){t='Sancionado: no puedes jugar este partido ('+ban+' por cumplir).';k='bad';}
 else if(y%5===4){t='Apercibido: llevas '+y+' amarillas en liga. Una más y te pierdes el siguiente partido de liga.';k='star';}
 else t='Tarjetas en liga esta temporada: '+y+' '+cardIco('y')+(y?' · a '+(5-y%5)+' del ciclo de sanción':'');
 return '<div class="small '+k+'" style="margin-top:8px">'+t+'</div>';
}
