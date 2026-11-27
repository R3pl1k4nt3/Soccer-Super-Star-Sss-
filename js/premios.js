/* Estrella del Balón · clasificaciones individuales, equipos ideales y premios. */

/* jugadores que cuentan para una competición (ck = 'L:ESP1', 'C:ESP', 'E:E1', 'T:WC') */
function compPlayers(ck){
 var L=ck.charAt(0),k=ck.slice(2),f;
 if(L==='L'){var lg=byId(S.lgs,k),set={};lg.clubs.forEach(function(id){set[id]=1;});f=function(p){return set[p.c];};}
 else if(L==='C')f=function(p){return p.c>=0&&S.clubs[p.c].co===k;};
 else{var T=tourById(k),ts={};if(!T)return [];T.teams.forEach(function(id){ts[id]=1;});f=L==='E'?function(p){return ts[p.c];}:function(p){return ts[p.nat];};}
 return S.pl.filter(function(p){return p&&p.st[L]&&f(p);});
}
function stOf(p,L){return p.st[L]||[0,0,0,0];}
function avgR(p,L){var s=stOf(p,L);return s[0]?s[3]/s[0]:0;}
function leaders(ck,key,n){
 var L=ck.charAt(0),ps=compPlayers(ck),mx=0;
 ps.forEach(function(p){mx=Math.max(mx,stOf(p,L)[0]);});
 var minA=Math.max(1,Math.round(mx*0.4));
 if(key==='g')ps.sort(function(a,b){return stOf(b,L)[1]-stOf(a,L)[1]||stOf(a,L)[0]-stOf(b,L)[0];});
 else if(key==='a')ps.sort(function(a,b){return stOf(b,L)[2]-stOf(a,L)[2]||stOf(a,L)[0]-stOf(b,L)[0];});
 else{ps=ps.filter(function(p){return stOf(p,L)[0]>=minA;});ps.sort(function(a,b){return avgR(b,L)-avgR(a,L);});}
 return ps.slice(0,n||10);
}
function clubName(p){return p.c>=0?S.clubs[p.c].n:'-';}
function snap(p,r){return {n:p.me?S.name:p.n,p:p.p,c:clubName(p),nat:p.nat,r:r==null?null:r1(r),me:p.me?1:0};}
/* once ideal 4-3-3 eligiendo el mejor por puesto según una puntuación */
function xiBy(cands,score){
 var used={},xi=[];
 F433.forEach(function(g){var best=null,bs=-1e9;cands.forEach(function(p){if(used[p.i]||posGroup(p.p)!==g)return;var s=score(p);if(s>bs){bs=s;best=p;}});
  if(best){used[best.i]=1;xi.push(snap(best,bs));}});
 return xi;
}
function lgCoef(lg){var s=0;lg.clubs.forEach(function(id){s+=S.clubs[id].str;});return s/lg.clubs.length/70;}
/* peso de la liga para premios mundiales: castiga mucho las categorías bajas */
/* coeficiente de liga (como la Bota de Oro): LaLiga y Premier 2, Bundesliga y Serie A 1,9, Ligue 1 1,8, Portugal y Países Bajos 1,5, el resto menos */
var LGCO={ESP:[2,1.1,0.8,0.6],ENG:[2,1.2,0.9,0.7],ITA:[1.9,1.05,0.75],GER:[1.9,1.1,0.8],FRA:[1.8,1,0.7],POR:[1.5,0.8],NED:[1.5,0.8],IRL:[1,0.6]};
function lgCo(lg){var a=LGCO[lg.co];return a&&a[lg.t-1]!=null?a[lg.t-1]:0.8;}
function lgW(lg){return Math.pow(lgCo(lg)/2,2);}
/* jugadores que van con su selección: los 23 mejores de cada país */
var NATTOP=null;
function natTop(){var key=S.season+'_'+S.slot;if(NATTOP&&NATTOP.k===key)return NATTOP.s;var by={},set={};
 S.pl.forEach(function(p){if(p&&!p.me&&p.c>=0)(by[p.nat]=by[p.nat]||[]).push(p);});
 Object.keys(by).forEach(function(n){by[n].sort(function(a,b){return b.o-a.o;}).slice(0,23).forEach(function(p){set[p.i]=1;});});
 NATTOP={k:key,s:set};return set;}
/* para optar al Balón de Oro hay que ser titular en tu club e ir con tu selección */
function boEligible(p){var c=S.clubs[p.c];if(!c)return 0;var lp=c.pj||0;
 if(p.me){var caps=S.nt.caps-(S.ntCaps0||0),st=S.ss.st!=null?S.ss.st:S.ss.pj;if(lp>=8&&st<lp*0.55)return 0.08;if(caps<=0&&S.slot>8)return 0.2;return 1;}
 var L=stOf(p,'L');if(lp>=8&&L[0]<lp*0.55)return 0.08;if(!natTop()[p.i])return 0.2;return 1;}
function lgOfPlayer(p){return p.c>=0?lgOf(p.c):null;}

/* ---------- fin de mes: equipo del mes de cada liga ---------- */
function monthEnd(m){
 valuation();
 S.lgs.forEach(function(lg){
  var set={};lg.clubs.forEach(function(id){set[id]=1;});
  var c=S.pl.filter(function(p){return p&&set[p.c]&&p.ms[0]>=2;});
  if(c.length<11)return;
  var sc=function(p){return p.ms[1]/p.ms[0]+p.ms[2]*0.05+p.ms[3]*0.03;};
  /* jugador del mes: nota media, goles y asistencias por partido, y haber jugado casi todo el mes */
  var pom=function(p){var n=p.ms[0],cl=S.clubs[p.c],ppg=cl&&cl.pj?cl.pts/cl.pj:1.3;return p.ms[1]/n+(p.ms[2]*0.55+p.ms[3]*0.3)/Math.max(2,n)+Math.min(n,4)*0.06+(ppg-1.3)*0.35+norm()*0.2;};
  var xi=xiBy(c,sc),best=null,bs=-1;c.filter(function(p){return p.ms[0]>=3;}).forEach(function(p){var s=pom(p);if(s>bs){bs=s;best=p;}});
  if(!best){c.forEach(function(p){var s=sc(p);if(s>bs){bs=s;best=p;}});}
  S.aw.push({k:'TOM',s:S.season,m:m,lg:lg.id,xi:xi,best:snap(best,bs)});
  if(set[S.pl[S.me].c]&&typeof monthQueue==='function')monthQueue(m,lg);
  if(xi.some(function(x){return x.me;})){var t='Equipo del mes ('+MONTHS[m]+') · '+lg.n;myAward(t,2,0);hito('tom',t,{m:MONTHS[m]});}
  if(best.me){var t2='Jugador del mes ('+MONTHS[m]+') · '+lg.n;myAward(t2,5,Math.round(S.contract.wage*2));hito('pom',t2,{m:MONTHS[m]});}
 });
 S.pl.forEach(function(p){if(p)p.ms=[0,0,0,0];});
 S.aw=S.aw.filter(function(a){return a.k==='TOM'?a.s===S.season:a.s>=S.season-1;});
 sponsorMonth();
 bizMonth();
}
function myAward(t,medals,cash){S.medals+=medals||0;S.money+=cash||0;S.trophies.push({s:S.season,n:t,k:'ind'});logm('Premio: '+t+'.');toast('Premio: '+t);}
/* ---------- hitos: cada logro con su temporada, club y división ---------- */
function hitoCtx(){var me=S.pl[S.me],c=me&&me.c>=0?S.clubs[me.c]:null,lg=c&&!c.guest?lgOf(c.id):null;
 return {club:c?c.n:'',lg:lg?lg.n:'',tier:lg?lg.t:0,niv:c&&lg?Math.round(lgLevelOf(c.id)):0,co:c?country(c.co).n:''};}
function hito(k,t,x){
 if(!S.hitos&&typeof hitosMig==='function'){hitosMig();S.hitos=S.hitos.filter(function(h){return !(h.s===S.season&&h.t===t);});}
 S.hitos=S.hitos||[];var h=hitoCtx();h.k=k;h.s=S.season;h.t=t;if(x)Object.keys(x).forEach(function(q){h[q]=x[q];});S.hitos.push(h);
 if(typeof newsAdd==='function'&&['pom','mvp','pich','ast','yng','bdo','bdop','bdoy','bota','eux','eum','wxi','liga','copa','euro','sel','toy'].indexOf(k)>=0)newsAdd(['liga','copa','euro','sel'].indexOf(k)>=0?'¡Título para '+S.name+'! '+(h.club&&k!=='sel'?h.club+' gana ':'')+t:S.name+' recibe el premio: '+t,'yo');}
function trophyKind(n,k){if(k==='liga'||k==='sel'||k==='asc')return k;return (S.eu||[]).some(function(T){return T.n===n;})?'euro':'copa';}
function addTrophy(n,k){S.trophies.push({s:S.season,n:n,k:k||'copa'});hito(trophyKind(n,k),n);S.stats.titles=(S.stats.titles||0)+1;logm('¡Título! '+n+'.');if(typeof titleMoment==='function')titleMoment(n);}
function trophyCheck(kind,win,n){var me=S.pl[S.me];
 if(kind==='club'&&win===me.c)addTrophy(n,'copa');
 if(kind==='nat'&&win===me.nat&&S.tourCalled)addTrophy(n+' con '+nation(me.nat).n,'sel');}
function tourCall(){var p=ntCallP()*1.05,ok=Math.random()<p;var U=S.tours.filter(function(t){return t.teams.indexOf(S.pl[S.me].nat)>=0;})[0];
 if(!U)return false;
 if(ok)logm('Convocado para '+U.n+' con '+nation(S.pl[S.me].nat).n+'.');else logm(nation(S.pl[S.me].nat).n+' juega '+U.n+', pero no entras en la lista.');
 return ok;}

/* ---------- fin de temporada: premios ---------- */
function ballonScore(p,champ){
 var lg=lgOfPlayer(p);if(!lg)return 0;var k=lgW(lg),L=stOf(p,'L'),E=stOf(p,'E'),T=stOf(p,'T'),C=stOf(p,'C');
 if(L[0]+E[0]<12)return 0;
 var s=(L[0]?(L[3]/L[0]-6)*18:0)*k+L[1]*0.9*k+L[2]*0.5*k+(C[1]*0.4)*k;
 if(E[0]){var ec=1;S.eu.forEach(function(t){if(t.teams.indexOf(p.c)>=0)ec=t.coef||1;});s+=(E[1]*1.2+E[2]*0.6+(E[3]/E[0]-6)*5)*ec;}
 if(T[0])s+=T[1]*1.0+T[2]*0.5+(T[3]/T[0]-6)*4;
 s+=champ[p.c]||0;
 if(p.nat&&champ['n_'+p.nat]&&T[0])s+=champ['n_'+p.nat];
 if(posGroup(p.p)==='POR'||POSD[p.p].df)s+=L[0]*0.08*k;
 return s>0?s*boEligible(p):s;
}
function seasonAwards(){
 var out=[],me=S.pl[S.me];
 function mine(t,medals,cash,k){out.push({t:t,medals:medals,cash:cash});S.trophies.push({s:S.season,n:t,k:'ind'});if(k)hito(k,t);}
 /* puntos por títulos para el Balón de Oro */
 var champ={};
 S.lgs.forEach(function(lg){var t=table(lg)[0];champ[t.id]=(champ[t.id]||0)+6*lgW(lg);});
 COUNTRIES.forEach(function(co){var w=S.cups[co.id].win;if(w!=null)champ[w]=(champ[w]||0)+2.5;});
 S.eu.forEach(function(T){if(T.win!=null)champ[T.win]=(champ[T.win]||0)+({E1:12,E2:5,E3:2})[T.id];});
 S.tours.forEach(function(T){if(T.win!=null)champ['n_'+T.win]=({WC:14,EC:10,NC:7})[T.id];});
 /* premios por liga */
 S.lgs.forEach(function(lg){
  var ck='L:'+lg.id,ps=compPlayers(ck);if(!ps.length)return;
  var g=leaders(ck,'g',1)[0],a=leaders(ck,'a',1)[0],b=leaders(ck,'r',1)[0];
  var young=ps.filter(function(p){return (p.me?S.age:p.a)<=21&&stOf(p,'L')[0]>=10;}).sort(function(x,y){return avgR(y,'L')-avgR(x,'L');})[0];
  var mx=0;ps.forEach(function(p){mx=Math.max(mx,stOf(p,'L')[0]);});
  var xi=xiBy(ps.filter(function(p){return stOf(p,'L')[0]>=mx*0.5;}),function(p){return avgR(p,'L');});
  S.aw.push({k:'TOY',s:S.season,lg:lg.id,xi:xi,top:g?snap(g,stOf(g,'L')[1]):null,ast:a?snap(a,stOf(a,'L')[2]):null,mvp:b?snap(b,avgR(b,'L')):null,yng:young?snap(young,avgR(young,'L')):null});
  if(g&&g.me)mine('Máximo goleador · '+lg.n+' ('+stOf(g,'L')[1]+' goles)',10,S.contract.wage*4,'pich');
  if(a&&a.me)mine('Máximo asistente · '+lg.n+' ('+stOf(a,'L')[2]+')',6,S.contract.wage*2,'ast');
  if(b&&b.me)mine('Mejor jugador · '+lg.n,10,S.contract.wage*6,'mvp');
  if(young&&young.me)mine('Mejor jugador joven · '+lg.n,6,S.contract.wage*2,'yng');
  if(xi.some(function(x){return x.me;}))mine('Equipo de la temporada · '+lg.n,4,0,'toy');
 });
 /* competiciones europeas y torneos de selecciones */
 S.eu.concat(S.tours).forEach(function(T){
  var ck=(T.kind==='nat'?'T:':'E:')+T.id,L=ck.charAt(0),ps=compPlayers(ck);if(!ps.length)return;
  var g=leaders(ck,'g',1)[0],b=leaders(ck,'r',1)[0];
  var xi=xiBy(ps.filter(function(p){return stOf(p,L)[0]>=2;}),function(p){return avgR(p,L)+stOf(p,L)[0]*0.05;});
  S.aw.push({k:'TOC',s:S.season,comp:T.id,n:T.n,xi:xi,top:g?snap(g,stOf(g,L)[1]):null,mvp:b?snap(b,avgR(b,L)):null,win:T.win==null?'':T.kind==='nat'?nation(T.win).n:S.clubs[T.win].n});
  if(g&&g.me&&stOf(g,L)[1]>0)mine('Máximo goleador · '+T.n,8,0,'tocg');
  if(b&&b.me)mine('Mejor jugador · '+T.n,8,0,'tocm');
  if(xi.some(function(x){return x.me;}))mine('Equipo ideal · '+T.n,4,0,'toc');
 });
 /* equipo europeo de la temporada: lo mejor de las tres competiciones europeas, ponderado por su nivel */
 var ecf={};S.eu.forEach(function(T){var w=({E1:1.25,E2:1,E3:0.8})[T.id]||1;T.teams.forEach(function(id){ecf[id]=Math.max(ecf[id]||0,w);});});
 var eus=S.pl.filter(function(p){return p&&p.c>=0&&ecf[p.c]&&stOf(p,'E')[0]>=4;}),esc2=function(p){var E=stOf(p,'E');return ((E[3]/E[0]-6)*4+E[1]*0.8+E[2]*0.5+E[0]*0.15)*ecf[p.c];};
 if(eus.length>=11){var exi=xiBy(eus,esc2),eb=null,ebs=-1e9;eus.forEach(function(p){var s=esc2(p);if(s>ebs){ebs=s;eb=p;}});
  S.aw.push({k:'TOYE',s:S.season,xi:exi,best:eb?snap(eb,ebs):null});
  if(exi.some(function(x){return x.me;}))mine('Equipo europeo de la temporada',8,S.contract.wage*2,'eux');
  if(eb&&eb.me)mine('Mejor jugador de Europa',15,S.contract.wage*5,'eum');}
 /* equipo mundial del año y Balón de Oro */
 var all=S.pl.filter(function(p){return p&&p.c>=0;}),scs={};
 all.forEach(function(p){scs[p.i]=ballonScore(p,champ);});
 var cand=all.filter(function(p){return scs[p.i]>0;});
 var wxi=xiBy(cand,function(p){return scs[p.i];});
 S.aw.push({k:'TOYW',s:S.season,xi:wxi});
 if(wxi.some(function(x){return x.me;}))mine('Equipo mundial del año',12,S.contract.wage*4,'wxi');
 cand.sort(function(a,b){return scs[b.i]-scs[a.i];});
 var top=cand.slice(0,30),myRank=top.findIndex(function(p){return p.me;})+1;
 S.bdo.push({s:S.season,top:top.slice(0,10).map(function(p){var x=snap(p,scs[p.i]);x.g=stOf(p,'L')[1]+stOf(p,'E')[1]+stOf(p,'T')[1]+stOf(p,'C')[1];return x;}),me:myRank||0,mes:r1(scs[S.me]||0)});
 if(myRank===1)mine('Balón de Oro',40,S.contract.wage*20,'bdo');
 else if(myRank&&myRank<=3)mine('Podio del Balón de Oro ('+myRank+'º)',15,S.contract.wage*5,'bdop');
 else if(myRank)logm('Quedas '+myRank+'º en el Balón de Oro.');
 var yg=cand.filter(function(p){return (p.me?S.age:p.a)<=21;})[0];
 S.bdo[S.bdo.length-1].young=yg?snap(yg,scs[yg.i]):null;
 if(yg&&yg.me)mine('Trofeo al mejor joven del mundo',15,S.contract.wage*4,'bdoy');
 /* bota de oro: goles de liga ponderados por el nivel */
 var bota=null,bv=0;all.forEach(function(p){var lg=lgOfPlayer(p);if(!lg)return;var v=stOf(p,'L')[1]*lgCo(lg);if(v>bv){bv=v;bota=p;}});
 if(bota){S.bdo[S.bdo.length-1].bota=snap(bota,stOf(bota,'L')[1]);if(bota.me)mine('Bota de Oro ('+stOf(bota,'L')[1]+' goles)',20,S.contract.wage*6,'bota');}
 if(S.bdo.length>40)S.bdo.shift();
 return out;
}
