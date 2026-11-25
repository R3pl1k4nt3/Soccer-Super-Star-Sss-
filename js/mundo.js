/* Estrella del Balón · mundo: clubes, plantillas, calendario, ligas, copas, Europa, selecciones y temporada. */

var LSLOTS=46;          /* semanas de liga en el calendario (las ligas con menos jornadas descansan alguna semana) */
var FXC={};             /* caché de calendarios de liga (no se guarda) */

/* ---------- creación del mundo ---------- */
function buildWorld(real){
 var clubs=[],lgs=[];
 COUNTRIES.forEach(function(co){
  var used={},ti=0;
  co.lg.forEach(function(L,t0){
   var t=t0+1,n=L[1],list;
   var rd=real&&t===1&&REALDATA.lg[co.id];
   if(rd){list=rd.map(function(c,i){return [c.n,70,i];});n=list.length;}
   else if(t===1)list=co.top.slice();
   else if(co.extra&&co.extra[t])list=co.extra[t].slice();
   else{list=[];for(var i=0;i<n;i++){var town=co.towns[ti++%co.towns.length],nm;
     do{nm=co.pre?pick(co.pre)+' '+town:town+pick(co.suf);}while(used[nm]);
     var s=Math.round(L[3]-(L[3]-L[2])*i/(n-1)+norm()*1.5);list.push([nm,clamp(s,L[2]-2,L[3]+2)]);}}
   var lg={id:co.id+t,co:co.id,t:t,n:real&&co.rn?co.rn[t-1]:L[0],clubs:[]};
   list.slice(0,n).forEach(function(c){used[c[0]]=1;var cl={id:clubs.length,n:c[0],co:co.id,t:t,str:c[1],ros:[],pts:0,pj:0,gf:0,gc:0,w:0,d:0,l:0};if(c[2]!=null)cl.rd=c[2];clubs.push(cl);lg.clubs.push(cl.id);});
   lgs.push(lg);
  });
 });
 /* clubes invitados (solo Europa): reales del archivo si los hay y, si faltan, ficticios */
 var gl=[],have={};
 if(real&&REALDATA.guests)REALDATA.guests.forEach(function(g,i){gl.push({n:g.n,gco:g.co,str:65,rd:i,cul:'en'});have[g.co]=1;});
 GUESTS.forEach(function(g){if(gl.length<64&&!have[g[1]])gl.push({n:g[0],gco:g[1],str:g[2],cul:g[3]});});
 gl.forEach(function(g){var cl={id:clubs.length,n:g.n,co:'G',gco:g.gco,cul:g.cul,t:0,str:g.str,ros:[],guest:1,pts:0,pj:0,gf:0,gc:0,w:0,d:0,l:0};if(g.rd!=null){cl.rd=g.rd;cl.rg=1;}clubs.push(cl);});
 return {clubs:clubs,lgs:lgs};
}
function natFor(co){
 var home=co==='IRL'?0.85:0.72;
 if(Math.random()<home)return co;
 return wrand(NATIONS,function(n){return n.id===co?0:Math.pow(n.str/60,3);}).id;
}
function mkPlayer(club,pos,first,young){
 var d=first?Math.round(-2+Math.random()*9):-Math.round(3+Math.random()*10);
 var a=young?17+Math.floor(Math.random()*3):first?21+Math.floor(Math.random()*12):18+Math.floor(Math.random()*17);
 var pool=TRAITS.filter(function(t){return !!t.gk===(pos==='POR');});
 var nat=club.guest?(Math.random()<0.7?club.gco:wrand(NATIONS,function(n){return Math.pow(n.str/60,3);}).id):natFor(club.co);
 var p={i:S.pl.length,n:mkName(club.guest&&nat===club.gco?club.cul:nation(nat).cul),p:pos,a:a,d:d,o:50,s:Math.floor(Math.random()*1e9),t:Math.random()<0.3?pick(pool).id:'',nat:nat,c:club.id,st:{},ms:[0,0,0,0]};
 S.pl.push(p);return p;
}
function setOv(c){c.ros.forEach(function(id){var p=S.pl[id];if(!p.me){p.o=clamp(Math.round(c.str+p.d),12,97);if(p.tt==null)initAITrait(p);}});}
function genRoster(c){if(c.rd!=null)return realRoster(c);var seen={};c.ros=SLOTS.map(function(pos){var first=!seen[pos];seen[pos]=1;return mkPlayer(c,pos,first,false).i;});setOv(c);}
/* plantilla real: los jugadores del archivo, ordenados por valor, cubriendo cada puesto; si faltan, se generan */
function realRoster(c){
 var src=(c.rg?REALDATA.guests[c.rd]:REALDATA.lg[c.co][c.rd]).p.slice(),used={},ros=[];
 var mk=function(r){var pool=TRAITS.filter(function(t){return !!t.gk===(r[1]==='POR');});
  var p={i:S.pl.length,n:r[0],p:r[1],a:r[2],d:0,o:oFromValue(r[4],r[2],r[1],c.co,1),s:Math.floor(Math.random()*1e9),t:Math.random()<0.3?pick(pool).id:'',nat:r[3],c:c.id,st:{},ms:[0,0,0,0],real:1};
  p.vk=r1(r[4]/mvBase(p.o,p.a,p.p,c.co,1)*100)/100;S.pl.push(p);return p;};
 SLOTS.forEach(function(pos){var k=-1;for(var i=0;i<src.length;i++)if(!used[i]&&posGroup(src[i][1])===posGroup(pos)){k=i;break;}
  if(k>=0){used[k]=1;ros.push(mk(src[k]).i);}else ros.push(null);});
 for(var i=0;i<src.length&&ros.length<26;i++)if(!used[i]){used[i]=1;ros.push(mk(src[i]).i);}
 c.ros=ros.filter(function(x){return x!=null;});
 /* fuerza del club: media del mejor once menos 2,5 (como en la versión ficticia) */
 var xi=bestXI(c.ros,null,null),s=0;xi.forEach(function(id){s+=S.pl[id].o;});c.str=Math.round(s/xi.length-2.5);
 c.ros.forEach(function(id){var p=S.pl[id];p.d=p.o-c.str;initAITrait(p);});
 var seen={};c.ros.forEach(function(id){seen[S.pl[id].p]=(seen[S.pl[id].p]||0)+1;});
 SLOTS.forEach(function(pos){if(seen[pos]>0){seen[pos]--;return;}if(c.ros.length>=22&&pos!=='POR')return;var np=mkPlayer(c,pos,false,false);c.ros.push(np.i);});
 setOv(c);
}
function replacePlayer(c,idx,young){var old=S.pl[c.ros[idx]];var np=mkPlayer(c,old.p,old.d>-3,young);c.ros[idx]=np.i;S.pl[old.i]=0;}

/* ---------- alineaciones ---------- */
function posGroup(p){return POSD[p].g;}
/* mejor once en 4-3-3. force: id que juega sí o sí; ex: id que no juega */
function bestXI(ids,force,ex){
 var used={},xi=[];
 if(ex!=null)used[ex]=1;
 var fp=force!=null?S.pl[force]:null,fslot=-1;
 if(fp){used[force]=1;fslot=F433.indexOf(posGroup(fp.p));}
 F433.forEach(function(g,si){
  if(si===fslot){xi.push(force);fslot=-2;return;}
  var best=null;
  ids.forEach(function(id){if(used[id])return;var p=S.pl[id];if(posGroup(p.p)===g&&(!best||p.o>best.o))best=p;});
  if(!best)ids.forEach(function(id){if(used[id])return;var p=S.pl[id];if(!best||p.o>best.o)best=p;});
  if(best){used[best.i]=1;xi.push(best.i);}
 });
 return xi;
}
function clubXI(c){var me=S.pl[S.me],u=S.uxi;if(me.c===c.id&&u&&u.cid===c.id)return bestXI(c.ros,u.on?S.me:null,u.on?null:S.me);return bestXI(c.ros,null,me.c===c.id?S.me:null);}
/* convocados de una selección: los 23 mejores de esa nacionalidad */
function natPool(nid){
 var l=S.pl.filter(function(p){return p&&p.nat===nid&&p.c>=0&&!p.me;});
 l.sort(function(a,b){return b.o-a.o;});
 return l.slice(0,23).map(function(p){return p.i;});
}
function natXI(nid){var pool=natPool(nid),me=S.pl[S.me],u=S.uxi;
 if(me.nat===nid&&u&&u.nid===nid&&u.on)return bestXI(pool,S.me,null);
 return bestXI(pool,null,null);}

/* ---------- partidos simulados ---------- */
function simScore(sH,sA,neutral){var d=sH+(neutral?0:3)-sA;return [poisson(1.35*Math.exp(d/30)),poisson(1.1*Math.exp(-d/30))];}
function teamOf(desc,side){
 var id=desc[side];
 if(desc.nat){var n=nation(id);return {kind:'nat',id:id,n:n.n,str:n.str,xi:natXI(id)};}
 var c=S.clubs[id];return {kind:'club',id:id,n:c.n,str:c.str,xi:clubXI(c),c:c};
}
function wpickXI(xi,ex,key){
 var tot=0,w=xi.map(function(id){var p=S.pl[id];var x=(POSD[p.p][key]+0.01)*Math.pow(p.o/55,2);if(id===ex)x=0;tot+=x;return x;}),r=Math.random()*tot;
 for(var i=0;i<w.length;i++){r-=w[i];if(r<=0)return xi[i];}return xi[xi.length-1];
}
function makeEvents(H,A,gh,ga,ex){
 var ev=[],j;ex=ex==null?-1:ex;
 function add(side,T){var sc=wpickXI(T.xi,ex,'sg'),as=Math.random()<0.7?wpickXI(T.xi,sc===ex?-1:sc,'sa'):-1;if(as===ex)as=-1;ev.push({min:1+Math.floor(Math.random()*90),side:side,sc:sc,as:as});}
 for(j=0;j<gh;j++)add('h',H);for(j=0;j<ga;j++)add('a',A);
 ev.sort(function(x,y){return x.min-y.min;});return ev;
}
function compLetter(ck){return ck.charAt(0);}
/* suma estadísticas a cada jugador del partido */
function creditMatch(desc,H,A,gh,ga,ev,over){
 var L=compLetter(desc.ck),cnt={};
 ev.forEach(function(e){if(e.sc>=0){cnt[e.sc]=cnt[e.sc]||[0,0];cnt[e.sc][0]++;}if(e.as>=0){cnt[e.as]=cnt[e.as]||[0,0];cnt[e.as][1]++;}});
 [[H,gh,ga,A],[A,ga,gh,H]].forEach(function(z){var T=z[0],gf=z[1],gc=z[2],O=z[3];
  var res=gf>gc?0.5:gf<gc?-0.5:0,avg=0;T.xi.forEach(function(id){avg+=S.pl[id].o;});avg/=T.xi.length||1;
  T.xi.forEach(function(id){var p=S.pl[id],c=cnt[id]||[0,0],r;
   if(over&&over[id]!=null)r=over[id];
   else{r=6+res+c[0]*1.0+c[1]*0.5+(p.o-avg)*0.03+(T.str-O.str)*0.008+norm()*0.6;
    if(p.p==='POR'||POSD[p.p].df)r+=gc===0?0.5:-0.15*gc;r=clamp(r,3.5,10);}
   credit(p,L,r,c[0],c[1]);});
 });
}
function credit(p,L,r,g,a){
 var s=p.st[L]||(p.st[L]=[0,0,0,0]);s[0]++;s[1]+=g;s[2]+=a;s[3]=r1(s[3]+r);
 if(L==='L'){p.ms[0]++;p.ms[1]=r1(p.ms[1]+r);p.ms[2]+=g;p.ms[3]+=a;}
}
function playAI(desc){
 var H=teamOf(desc,'h'),A=teamOf(desc,'a'),sc=simScore(H.str,A.str,desc.neutral);
 var ev=makeEvents(H,A,sc[0],sc[1]);
 creditMatch(desc,H,A,sc[0],sc[1],ev,null);
 applyResult(desc,sc[0],sc[1],penWinner(desc,sc[0],sc[1],H.str,A.str));
}

/* ---------- calendario de la temporada ---------- */
/* 46 semanas de liga; entre medias, Europa (17), copa (8) y selecciones (4). Al final, play-offs (4) y torneo de verano. */
function buildCal(){
 var cal=[],ins={};
 function at(li,k,r){(ins[li]=ins[li]||[]).push({k:k,r:r});}
 [2,5,8,11,14,17,20,23,26,28,31,33,35,37,39,41,45].forEach(function(li,i){at(li,'E',i);});
 [4,9,13,18,22,27,32,36].forEach(function(li,i){at(li,'C',i);});
 [6,12,19,30].forEach(function(li,i){at(li,'N',i);});
 for(var li=0;li<LSLOTS;li++){cal.push({k:'L',r:li});(ins[li]||[]).forEach(function(x){cal.push(x);});}
 for(var p=0;p<4;p++)cal.push({k:'P',r:p});
 var nT=S.tours.reduce(function(m,t){return Math.max(m,tourSteps(t));},0);
 for(var i=0;i<nT;i++)cal.push({k:'T',r:i});
 var nonT=cal.filter(function(x){return x.k!=='T';}).length,j=0;
 cal.forEach(function(x){x.m=x.k==='T'?10:Math.min(9,Math.floor(j++*10/nonT));});
 return cal;
}
function slotMonth(i){var c=S.cal;if(!c||!c.length)return 0;return c[Math.min(i,c.length-1)].m;}
function lgRounds(lg){var n=lg.clubs.length,R=2*(n-1);while(R<30)R+=2*(n-1);return R;}
function makeFixtures(n){var arr=[],i,rounds=[];for(i=0;i<n;i++)arr.push(i);
 for(var r=0;r<n-1;r++){var rd=[];for(i=0;i<n/2;i++){var a=arr[i],b=arr[n-1-i];rd.push((r+i)%2?[a,b]:[b,a]);}rounds.push(rd);arr.splice(1,0,arr.pop());}
 return rounds.concat(rounds.map(function(rd){return rd.map(function(m){return [m[1],m[0]];});}));}
function lgFix(lg){
 var k=lg.id+'_'+S.season+'_'+lg.order.join('.');if(FXC[k])return FXC[k];
 var base=makeFixtures(lg.order.length),R=lgRounds(lg),out=[];
 while(out.length<R)out=out.concat(base);
 out=out.slice(0,R).map(function(rd){return rd.map(function(m){return [lg.order[m[0]],lg.order[m[1]]];});});
 FXC[k]=out;return out;
}
function lgRoundAt(lg,li){var R=lgRounds(lg),r=Math.ceil(li*R/LSLOTS);return (r<R&&Math.floor(r*LSLOTS/R)===li)?r:-1;}
function lgOf(clubId){var c=S.clubs[clubId];return c.guest?null:byId(S.lgs,c.co+c.t);}
function lgName(c){if(c.guest)return 'Invitado · '+c.gco;var lg=lgOf(c.id);return lg.n+' ('+country(c.co).n+')';}
function table(lg){return lg.clubs.map(function(id){return S.clubs[id];}).sort(function(a,b){return b.pts-a.pts||(b.gf-b.gc)-(a.gf-a.gc)||b.gf-a.gf||b.str-a.str;});}
function record(H,A,gh,ga){H.pj++;A.pj++;H.gf+=gh;H.gc+=ga;A.gf+=ga;A.gc+=gh;if(gh>ga){H.pts+=3;H.w++;A.l++;}else if(gh<ga){A.pts+=3;A.w++;H.l++;}else{H.pts++;A.pts++;H.d++;A.d++;}}

/* ---------- copas nacionales ---------- */
function initCups(){S.cups={};COUNTRIES.forEach(function(co){var cf=CUPCFG[co.id]||{};
 var ids=S.clubs.filter(function(c){return c.co===co.id&&!c.guest&&c.t<=(cf.max||9);}).map(function(c){return c.id;});
 S.cups[co.id]={n:S.real&&co.rcup?co.rcup:co.cup,alive:ids,next:[],r:0,win:null,kp:null,leg:0,last:[]};});}
function cupRoundName(n){return n===2?'Final':n<=4?'Semifinales':n<=8?'Cuartos de final':n<=16?'Octavos de final':n<=32?'Dieciseisavos de final':'Ronda de '+n;}
function cupMatches(co){
 var cu=S.cups[co],cf=CUPCFG[co]||{},ck='C:'+co;if(cu.win!=null||cu.alive.length<2)return [];
 if(cu.kp&&cu.leg===2)return pairDescs(cu.kp,ck,2,false,{rn:'Semifinales · vuelta'});
 var n=cu.alive.length;
 if(n===4&&cf.sf2){var s=shuffle(cu.alive.slice());cu.kp=[{a:s[0],b:s[1],l1:null},{a:s[2],b:s[3],l1:null}];cu.leg=1;cu.next=[];return pairDescs(cu.kp,ck,1,false,{rn:'Semifinales · ida'});}
 var P=1;while(P*2<=n)P*=2;
 var nm=P===n?n/2:n-P,list=cu.alive.slice().sort(function(a,b){return S.clubs[b].str-S.clubs[a].str;});
 var byes=list.slice(0,n-2*nm),play=shuffle(list.slice(n-2*nm));
 cu.next=byes.slice();cu.rn=cupRoundName(P===n?n:P*2);
 var out=[];for(var i=0;i<play.length;i+=2){var a=play[i],b=play[i+1];
  if(cf.low&&S.clubs[a].t<S.clubs[b].t){var t=a;a=b;b=t;}
  out.push({ck:ck,h:a,a:b,ko:1,neutral:n===2?1:0,rn:cu.rn});}
 return out;
}
function cupFinalize(co){var cu=S.cups[co];if(cu.win!=null||cu.alive.length<2)return;
 if(cu.kp){if(cu.leg===1){cu.leg=2;return;}cu.alive=cu.next.filter(function(x){return x!=null;});cu.kp=null;cu.leg=0;}
 else cu.alive=cu.next;
 cu.next=[];cu.r++;if(cu.alive.length===1){cu.win=cu.alive[0];trophyCheck('club',cu.win,cu.n);}}

/* ---------- torneos de selecciones: grupos y eliminatorias ---------- */
function newTour(id,n,kind,teams,rr){
 teams=teams.slice();var G=teams.length/4,groups=[];
 var st=function(x){return kind==='nat'?nation(x).str:S.clubs[x].str;};
 teams.sort(function(a,b){return st(b)-st(a);});
 for(var g=0;g<G;g++)groups.push([]);
 for(var pot=0;pot<4;pot++){var p=shuffle(teams.slice(pot*G,pot*G+G));for(g=0;g<G;g++)groups[g].push(p[g]);}
 var gt={};teams.forEach(function(x){gt[x]={pts:0,pj:0,gf:0,gc:0};});
 return {id:id,n:n,kind:kind,teams:teams,groups:groups,gt:gt,rr:rr,step:0,ko:null,next:[],win:null};
}
function tourSteps(T){var g=T.rr*3,q=T.groups.length*2,k=0;while(q>1){q/=2;k++;}return g+k;}
function tourStageName(T){if(T.fmt==='lp')return lpStageName(T);var g=T.rr*3;if(T.win!=null)return 'Terminado';if(T.step<g)return 'Fase de grupos · J'+(T.step+1);var n=T.ko?T.ko.length:T.groups.length*2;return cupRoundName(n);}
function gTable(T,grp){return grp.slice().sort(function(a,b){var x=T.gt[a],y=T.gt[b];return y.pts-x.pts||(y.gf-y.gc)-(x.gf-x.gc)||y.gf-x.gf;});}
function tourMatches(T,ckp){
 if(T.win!=null)return [];
 var g=T.rr*3,out=[],nat=T.kind==='nat'?1:0;
 if(T.step<g){var fx=makeFixtures(4),rd=fx[T.step];
  T.groups.forEach(function(grp){rd.forEach(function(m){out.push({ck:ckp+T.id,h:grp[m[0]],a:grp[m[1]],nat:nat,neutral:nat,grp:1});});});
  return out;}
 if(!T.ko){var G=T.groups.map(function(grp){return gTable(T,grp);}),ko=[];
  for(var i=0;i<G.length;i+=2)ko.push(G[i][0],G[i+1][1]);
  for(i=0;i<G.length;i+=2)ko.push(G[i+1][0],G[i][1]);
  T.ko=ko;}
 T.next=[];var fin=T.ko.length===2;
 for(var j=0;j<T.ko.length;j+=2)out.push({ck:ckp+T.id,h:T.ko[j],a:T.ko[j+1],nat:nat,neutral:nat||fin?1:0,ko:1,ti:j/2,rn:cupRoundName(T.ko.length)});
 return out;
}
function tourFinalize(T){
 if(T.win!=null)return;
 var g=T.rr*3;
 if(T.step>=g&&T.ko){T.ko=T.next.filter(function(x){return x!=null;});T.next=[];if(T.ko.length===1){T.win=T.ko[0];trophyCheck(T.kind,T.win,T.n);}}
 T.step++;
}
function tourById(id){var all=(S.eu||[]).concat(S.tours||[]);return byId(all,id);}

/* ---------- partidos de cada semana ---------- */
function slotMatches(sl){
 var out=[];
 if(sl.k==='L')S.lgs.forEach(function(lg){var r=lgRoundAt(lg,sl.r);if(r<0)return;lgFix(lg)[r].forEach(function(m){out.push({ck:'L:'+lg.id,h:m[0],a:m[1],rn:'Jornada '+(r+1)});});});
 else if(sl.k==='C')COUNTRIES.forEach(function(co){out=out.concat(cupMatches(co.id));});
 else if(sl.k==='E')S.eu.forEach(function(T){if(T.step===sl.r)out=out.concat(lpMatches(T));});
 else if(sl.k==='P')Object.keys(S.po||{}).forEach(function(k){out=out.concat(poMatches(S.po[k]));});
 else if(sl.k==='T')S.tours.forEach(function(T){if(T.step===sl.r)out=out.concat(tourMatches(T,'T:'));});
 else if(sl.k==='N'){var d=ntWindowMatch(sl.r);if(d)out.push(d);}
 return out;
}
function isMine(desc){var me=S.pl[S.me];if(desc.nat){var called=compLetter(desc.ck)==='T'?S.tourCalled:S.ntCalled;return !!called&&(desc.h===me.nat||desc.a===me.nat);}return desc.h===me.c||desc.a===me.c;}
function slotFinalize(sl){
 if(sl.k==='L'&&sl.r===LSLOTS-1)initPO();
 else if(sl.k==='C')COUNTRIES.forEach(function(co){cupFinalize(co.id);});
 else if(sl.k==='E')S.eu.forEach(function(T){if(T.step===sl.r)lpFinalize(T);});
 else if(sl.k==='P')Object.keys(S.po||{}).forEach(function(k){poFinalize(S.po[k]);});
 else if(sl.k==='T')S.tours.forEach(function(T){if(T.step===sl.r)tourFinalize(T);});
}
function applyResult(desc,gh,ga,pw){
 var L=compLetter(desc.ck),key=desc.ck.slice(2);
 if(L==='L')record(S.clubs[desc.h],S.clubs[desc.a],gh,ga);
 else if(L==='C'){var cu=S.cups[key];
  if(desc.leg===1)cu.kp[desc.ti].l1=[ga,gh];
  else if(desc.leg===2)cu.next[desc.ti]=koWinner(desc,gh,ga,pw);
  else cu.next.push(koWinner(desc,gh,ga,pw));}
 else if(L==='P')S.po[key].res[desc.ti]=koWinner(desc,gh,ga,pw);
 else if(L==='E'||L==='T'){var T=tourById(key);
  if(desc.grp){var x=T.gt[desc.h],y=T.gt[desc.a];x.pj++;y.pj++;x.gf+=gh;x.gc+=ga;y.gf+=ga;y.gc+=gh;if(gh>ga)x.pts+=3;else if(gh<ga)y.pts+=3;else{x.pts++;y.pts++;}}
  else if(desc.leg===1)T.kp[desc.ti].l1=[ga,gh];
  else T.next[desc.ti]=koWinner(desc,gh,ga,pw);}
 if(followed(desc))S.wres.push({ck:desc.ck,h:desc.h,a:desc.a,gh:gh,ga:ga,pw:pw,nat:desc.nat?1:0,rn:desc.rn||'',agg:desc.agg||null});
}
/* resultados que se muestran en la pestaña de competiciones */
function followed(desc){var me=S.pl[S.me],c=S.clubs[me.c];
 if(desc.ck==='L:'+c.co+c.t||desc.ck==='C:'+c.co||desc.ck.indexOf('P:'+c.co)===0)return true;
 var L=compLetter(desc.ck);return L==='E'&&!desc.grp||L==='T'||isMine(desc);}

/* ---------- selección: ventanas internacionales ---------- */
function ntWindowMatch(r){
 var me=S.pl[S.me],nid=me.nat,n=nation(nid);
 if(n.x)return null;
 S.ntCalled=ntCall();
 if(!S.ntCalled)return null;
 var opp=pick(NATIONS.filter(function(x){return x.id!==nid&&Math.abs(x.str-n.str)<14;}));
 var home=Math.random()<0.5;
 return {ck:'N:'+nid,h:home?nid:opp.id,a:home?opp.id:nid,nat:1,rn:r%2?'Partido de clasificación':'Amistoso internacional'};
}
function ntForm(){var s=S.ss;return s.rn?s.rsum/s.rn:6.2;}
function ntCallP(){
 var me=S.pl[S.me],n=nation(me.nat),pool=natPool(me.nat),ov=overall();
 if(S.age<17||S.injured>0)return 0;
 var same=pool.map(function(i){return S.pl[i];}).filter(function(p){return posGroup(p.p)===posGroup(S.pos);});
 var ref=same.length>=2?same[1].o:(pool.length?S.pl[pool[pool.length-1]].o:n.str-10);
 ref=Math.max(ref,n.str-14);
 return clamp(0.5+(ov-ref)/8+(ntForm()-6.5)*0.25+(S.rel.press-50)*0.004,0,0.97);
}
function ntCall(){var p=ntCallP();var ok=Math.random()<p;if(ok){S.nt.calls++;if(!S.nt.first){S.nt.first=S.season;logm('Primera convocatoria con '+nation(S.pl[S.me].nat).n+'.');}}return ok;}

/* ---------- inicio de temporada ---------- */
function startSeason(){
 S.clubs.forEach(function(c){c.pts=c.pj=c.gf=c.gc=c.w=c.d=c.l=0;});
 S.lgs.forEach(function(lg){lg.order=shuffle(lg.clubs.slice());});
 S.pl.forEach(function(p){if(p){p.st={};p.ms=[0,0,0,0];}});
 initCups();
 S.eu=[0,1,2].map(function(i){return newLP(i,S.euq[i]);});
 S.po={};
 S.tours=[];
 if(S.season%2===0)S.tours.push(newTour('WC',S.real?'Mundial':'Copa del Mundo','nat',NATIONS.map(function(n){return n.id;}),1));
 else{
  var eu=NATIONS.filter(function(n){return n.conf==='E';}).map(function(n){return {id:n.id,k:n.str+norm()*4};}).sort(function(a,b){return b.k-a.k;}).slice(0,16).map(function(x){return x.id;});
  var ot=NATIONS.filter(function(n){return n.conf==='O';}).map(function(n){return {id:n.id,k:n.str+norm()*4};}).sort(function(a,b){return b.k-a.k;}).slice(0,8).map(function(x){return x.id;});
  S.tours.push(newTour('EC',S.real?'Eurocopa':'Campeonato de Europa','nat',eu,1));
  S.tours.push(newTour('NC','Copa de Naciones','nat',ot,1));
 }
 S.cal=buildCal();S.slot=0;S.ntCalled=false;S.wres=[];
 S.ss={pj:0,g:0,a:0,rsum:0,rn:0,cs:0};
}

/* ---------- ascensos y descensos (según los play-offs de formatos.js) ---------- */
function promoteRelegate(){
 var moves=[];
 Object.keys(S.po||{}).forEach(function(k){var B=S.po[k];
  B.down.forEach(function(id){moves.push([S.clubs[id],B.t+1,-2]);});
  B.up.forEach(function(id){moves.push([S.clubs[id],B.t,2]);});});
 moves.forEach(function(m){var c=m[0],from=byId(S.lgs,c.co+c.t),to=byId(S.lgs,c.co+m[1]);
  from.clubs.splice(from.clubs.indexOf(c.id),1);to.clubs.push(c.id);c.t=m[1];c.str=c.str+m[2];c.moved=m[2]>0?'asc':'desc';});
 return moves;
}
/* la fuerza de cada club se mueve un poco cada año y tiende al rango de su liga */
function driftClubs(){
 S.lgs.forEach(function(lg){var co=country(lg.co),L=co.lg[lg.t-1],lo,hi;
  var strs=lg.clubs.map(function(id){return S.clubs[id].str;});
  if(L[2]!=null){lo=L[2];hi=L[3];}else{lo=Math.min.apply(null,strs);hi=Math.max.apply(null,strs);}
  lg.clubs.forEach(function(id){var c=S.clubs[id],mid=(lo+hi)/2;c.str=clamp(Math.round(c.str+norm()*1.4+(c.str<lo?(lo-c.str)*0.3:c.str>hi?(hi-c.str)*0.3:0)+(mid-c.str)*0.02),20,92);});
 });
}
/* envejecimiento, retiradas según edad y nivel, canteranos y plantillas de 22 a 26 */
var MINPOS={POR:2,DFC:3,LI:1,LD:1,MCD:1,MC:2,MP:1,EI:1,ED:1,DC:2};
function youth(c,pos){var p=mkPlayer(c,pos||pick(SLOTS),false,true);p.a=16+Math.floor(Math.random()*3);p.d=Math.round(-16+Math.random()*8+(Math.random()<0.07?9:0));c.ros.push(p.i);return p;}
function ageRosters(){
 var retired=0,newbies=0,LV={};
 /* nivel de cada liga: los jóvenes crecen más en ligas fuertes; los veteranos caen más despacio en ellas */
 S.clubs.forEach(function(c){if(LV[c.id]==null)LV[c.id]=typeof lgLevelOf==='function'?lgLevelOf(c.id):c.str;});
 S.clubs.forEach(function(c){
  var keep=[];
  c.ros.forEach(function(id){var p=S.pl[id];if(!p)return;if(p.me){keep.push(id);return;}
   if(!p.h){p.h=[p.o];p.hs=S.season;}
   p.a++;var L=LV[c.id],g=p.a<=21?1.6:p.a<=24?1:p.a>=31?-1.4:0;
   if(g>0){g*=1+(lgBase(L)-1)*lgAgeW(p.a);if(p.o>ceilOf(L))g*=0.4;}else if(g<0)g*=declineFor(L);
   p.d=clamp(p.d+g,-25,14);
   var good=p.d>2?2:p.d>-3?1:0,pr=(p.a-32-good)*0.2;
   if(p.a>=40||(p.a>=33+good&&Math.random()<pr)){S.pl[id]=0;retired++;return;}
   keep.push(id);});
  c.ros=keep;
  var n=1+Math.floor(Math.random()*3);for(var i=0;i<n;i++){youth(c);newbies++;}
  /* cubrir puestos */
  var cnt={};c.ros.forEach(function(id){var g=posGroup(S.pl[id].p);cnt[g]=(cnt[g]||0)+1;});
  Object.keys(MINPOS).forEach(function(g){while((cnt[g]||0)<MINPOS[g]){var p=mkPlayer(c,g,false,false);p.d=Math.round(-6-Math.random()*6);c.ros.push(p.i);cnt[g]=(cnt[g]||0)+1;newbies++;}});
  while(c.ros.length<22){youth(c);newbies++;}
  /* si sobran, se van los peores (sin dejar huecos en los puestos mínimos) */
  while(c.ros.length>26){var worst=null;c.ros.forEach(function(id){var p=S.pl[id];if(p.me)return;var g=posGroup(p.p);if((cnt[g]||0)<=(MINPOS[g]||0))return;if(!worst||p.d<worst.d)worst=p;});
   if(!worst)break;cnt[posGroup(worst.p)]--;c.ros.splice(c.ros.indexOf(worst.i),1);S.pl[worst.i]=0;}
  setOv(c);
 });
 return {retired:retired,newbies:newbies};
}
/* ---------- rasgos y evolución de los jugadores de la IA ----------
   Principal (p.t, rango p.tt) y, los mejores, secundario (p.t2, rango p.tt2, como mucho Oro).
   El rango sigue a la valoración: Bronce, Plata desde 67, Oro desde 77, Platino desde 86. */
function tierForO(o){return o>=86?3:o>=77?2:o>=67?1:0;}
function aiTraitPick(p,not){var pool=TRAITS.filter(function(t){return !!t.gk===(p.p==='POR')&&t.id!==not;}),e=EMP[p.p]||{};
 return wrand(pool,function(t){return 1+t.sk.reduce(function(s,id){return s+(e[id]||0);},0);}).id;}
function initAITrait(p){
 if(!p||p.me||p.tt!=null)return;
 if(!p.t&&Math.random()<clamp((p.o-45)/40,0.12,0.92))p.t=aiTraitPick(p);
 if(p.t)p.tt=clamp(tierForO(p.o)-(Math.random()<0.25?1:0),0,3);else p.tt=-1;
 if(p.t&&!p.t2&&p.o>=74&&Math.random()<0.45){p.t2=aiTraitPick(p,p.t);p.tt2=clamp(tierForO(p.o)-1,0,2);}
}
/* rasgos efectivos de un jugador de la IA (las partidas antiguas no los tienen guardados) */
function aiTraits(p){var out=[];if(p.t){out.push({id:p.t,t:p.tt!=null&&p.tt>=0?p.tt:tierForO(p.o),r:'p'});}if(p.t2)out.push({id:p.t2,t:p.tt2||0,r:'s'});return out;}
/* fin de temporada: guarda la valoración de cada jugador y hace evolucionar sus rasgos. Devuelve lo más destacado */
function aiSeasonEvolve(){
 var ris=[],ups=[];
 S.pl.forEach(function(p){if(!p||p.me||p.c<0)return;
  if(p.tt==null)initAITrait(p);
  if(!p.h){p.h=[p.o];p.hs=S.season+1;}else p.h.push(p.o);if(p.h.length>12){p.h.shift();p.hs++;}
  var d=p.h[p.h.length-1]-p.h[p.h.length-2];if(d>=4&&p.a<=24)ris.push({p:p,d:d});
  var tg=tierForO(p.o);
  if(p.t){if(tg>p.tt&&Math.random()<0.65){p.tt++;if(p.tt>=2)ups.push({p:p,id:p.t,t:p.tt});}
   else if(p.a>=32&&tg<p.tt&&Math.random()<0.35)p.tt--;}
  else if(Math.random()<clamp((p.o-55)/60,0,0.3)){p.t=aiTraitPick(p);p.tt=0;}
  if(p.t&&!p.t2&&p.o>=74&&Math.random()<0.2){p.t2=aiTraitPick(p,p.t);p.tt2=0;}
  else if(p.t2&&p.tt2<2&&tg-1>p.tt2&&Math.random()<0.5)p.tt2++;
 });
 ris.sort(function(a,b){return b.d-a.d||b.p.o-a.p.o;});ups.sort(function(a,b){return b.t-a.t||b.p.o-a.p.o;});
 return {ris:ris.slice(0,6).map(function(x){return {i:x.p.i,d:x.d};}),ups:ups.slice(0,6).map(function(x){return {i:x.p.i,id:x.id,t:x.t};})};
}
/* mercado de la IA: los clubes fuertes fichan a los mejores de clubes más débiles */
function aiTransfers(){
 var buyers=S.clubs.filter(function(c){return c.t===1&&c.str>=74;}).sort(function(a,b){return b.str-a.str;}),done=[];
 buyers.forEach(function(B){
  var xi=bestXI(B.ros,null,S.me),worst=null;
  xi.forEach(function(id){var p=S.pl[id];if(!worst||p.o<worst.o)worst=p;});
  if(!worst)return;
  var best=null;
  S.pl.forEach(function(p){if(!p||p.c<0||p.me||p.c===B.id||p.a>29)return;var sc=S.clubs[p.c];if(sc.str>=B.str-3)return;
   if(posGroup(p.p)!==posGroup(worst.p))return;if(p.o>worst.o+2&&(!best||p.o>best.o))best=p;});
  if(!best||Math.random()<0.35)return;
  var sell=S.clubs[best.c],o1=best.o,o2=worst.o;
  sell.ros[sell.ros.indexOf(best.i)]=worst.i;B.ros[B.ros.indexOf(worst.i)]=best.i;
  best.c=B.id;worst.c=sell.id;best.d=o1-B.str;worst.d=o2-sell.str;
  done.push(best.n+' ('+best.o+') ficha por '+B.n+' desde '+sell.n);
 });
 S.clubs.forEach(setOv);
 return done;
}
