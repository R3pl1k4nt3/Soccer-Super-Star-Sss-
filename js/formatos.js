/* Estrella del Balón · formatos reales de competición (temporada 2025-26, simplificados):
   ascensos, descensos y play-offs de cada país, copas, plazas europeas, Europa con fase de liga y clubes invitados. */

/* Fronteras entre divisiones, por país. La posición 1 es la primera de la tabla.
   rel: descienden directos (los últimos de la división superior).
   dir: ascienden directos (los primeros de la inferior).
   br: posiciones de la inferior que juegan el play-off; n: cuántos ascienden por él (1 por defecto).
   up: posición de la superior que juega la promoción contra el ganador del play-off.
   bar: promociones directas [posición en la superior, posición en la inferior]. */
var FMT={
 ESP:[{rel:3,dir:2,br:[3,4,5,6]},{rel:4,dir:2,br:[3,4,5,6],n:2},{rel:4,dir:2,br:[3,4,5,6],n:2}],
 ENG:[{rel:3,dir:2,br:[3,4,5,6]},{rel:3,dir:2,br:[3,4,5,6]},{rel:4,dir:3,br:[4,5,6,7]}],
 ITA:[{rel:3,dir:2,br:[3,4,5,6,7,8]},{rel:4,dir:3,br:[4,5,6,7]}],
 GER:[{rel:2,dir:2,bar:[[16,3]]},{rel:2,dir:2,bar:[[16,3]]}],
 FRA:[{rel:2,dir:2,br:[3,4,5],up:16},{rel:2,dir:2,bar:[[16,3]]}],
 POR:[{rel:2,dir:2,bar:[[16,3]]}],
 NED:[{rel:1,dir:1,bar:[[17,2],[16,3]]}],
 IRL:[{rel:1,dir:1,br:[2,3,4,5],up:9}]
};
/* Copas: sf2 semifinales a ida y vuelta; low el equipo de menor categoría juega en casa; max última división que participa. */
var CUPCFG={ESP:{sf2:1,low:1,max:4},ENG:{low:0,max:4},ITA:{sf2:1,low:0,max:2},GER:{low:1,max:3},FRA:{low:1,max:3},POR:{sf2:1,low:1,max:2},NED:{low:1,max:2},IRL:{low:0,max:2}};
/* Plazas europeas por país: [Liga de Campeones, Liga Europa (incluye la del campeón de copa), Conferencia]. */
var EUQ={ENG:[5,2,1],ESP:[5,2,1],ITA:[4,2,1],GER:[4,2,1],FRA:[3,2,1],POR:[2,2,1],NED:[2,1,1],IRL:[0,0,1]};
var EUNAMES={fic:['Copa de Europa','Copa Continental','Trofeo de Plata'],real:['UEFA Champions League','UEFA Europa League','UEFA Conference League']};
var EUMD=[8,8,6];      /* jornadas de la fase de liga de cada competición */
var EUPRIZE=[3,1.5,0.8],EUCOEF=[1.25,1.05,0.9];

/* Clubes invitados de países sin liga en el juego: solo juegan en Europa. [nombre, país, fuerza, cultura de nombres] */
var GUESTS=[
 ['Estambul Leones','Turquía',79,'sl'],['Kadıköy Canarios','Turquía',78,'sl'],['Beşiktaş Águilas','Turquía',74,'sl'],['Trebisonda Tormenta','Turquía',70,'sl'],['Başakşehir Búhos','Turquía',66,'sl'],
 ['Glasgow Celtas','Escocia',72,'en'],['Ibrox Azules','Escocia',71,'en'],['Aberdeen Dons','Escocia',62,'en'],['Edimburgo Corazones','Escocia',61,'en'],
 ['Brujas Azulnegro','Bélgica',73,'nl'],['Anderlecht Malvas','Bélgica',69,'nl'],['Genk Pitufos','Bélgica',68,'nl'],['Gante Búfalos','Bélgica',66,'nl'],['Amberes Grandes','Bélgica',67,'nl'],['Bruselas Unión','Bélgica',70,'fr'],
 ['Salzburgo Toros','Austria',72,'de'],['Viena Verdes','Austria',64,'de'],['Graz Negros','Austria',66,'de'],['Linz Atléticos','Austria',62,'de'],
 ['Pireo Leyendas','Grecia',71,'sl'],['Trébol de Atenas','Grecia',66,'sl'],['Salónica Águila','Grecia',69,'sl'],['Atenas Unión','Grecia',67,'sl'],
 ['Basilea Rojiazul','Suiza',65,'de'],['Berna Jóvenes','Suiza',67,'de'],['Zúrich Leones','Suiza',60,'de'],['Lugano Bianconeri','Suiza',61,'it'],
 ['Praga Eslavos','Chequia',67,'sl'],['Praga Esparta','Chequia',67,'sl'],['Pilsen Viktoria','Chequia',64,'sl'],
 ['Copenhague Leones','Dinamarca',68,'no'],['Herning Lobos','Dinamarca',67,'no'],['Brøndby Amarillos','Dinamarca',61,'no'],
 ['Bodø Relámpago','Noruega',66,'no'],['Molde Azules','Noruega',61,'no'],
 ['Malmö Celestes','Suecia',63,'no'],['Estocolmo Abejas','Suecia',60,'no'],['Solna Negros','Suecia',58,'no'],
 ['Zagreb Azules','Croacia',67,'sl'],['Split Murciélagos','Croacia',62,'sl'],['Rijeka Blancos','Croacia',60,'sl'],
 ['Belgrado Estrellas','Serbia',66,'sl'],['Belgrado Partisanos','Serbia',61,'sl'],
 ['Donetsk Mineros','Ucrania',68,'sl'],['Kiev Blancos','Ucrania',64,'sl'],
 ['Varsovia Legión','Polonia',63,'sl'],['Poznań Ferroviarios','Polonia',62,'sl'],['Białystok Amarillos','Polonia',61,'sl'],
 ['Bucarest Militares','Rumanía',60,'sl'],['Cluj Ferroviarios','Rumanía',58,'sl'],
 ['Budapest Águilas','Hungría',64,'sl'],
 ['Nicosia Azules','Chipre',57,'sl'],['Limasol Marineros','Chipre',56,'sl'],['Pafos Ciudad','Chipre',59,'sl'],
 ['Tel Aviv Macabeos','Israel',60,'en'],['Haifa Verdes','Israel',59,'en'],
 ['Bratislava Eslovanes','Eslovaquia',58,'sl'],['Razgrad Águilas','Bulgaria',57,'sl'],['Celje Condes','Eslovenia',55,'sl'],
 ['Bakú Caballos','Azerbaiyán',62,'sl'],['Almaty Estepa','Kazajistán',55,'sl'],['Astaná Halcones','Kazajistán',54,'sl']
];

/* ---------- eliminatorias: ganador con ida y vuelta, penaltis y desempate por mejor clasificado ---------- */
function aggTot(desc,gh,ga){var a=desc.agg||[0,0];return [gh+a[0],ga+a[1]];}
function koWinner(desc,gh,ga,pw){var t=aggTot(desc,gh,ga);return t[0]>t[1]?desc.h:t[0]<t[1]?desc.a:(pw==='a'?desc.a:desc.h);}
function penWinner(desc,gh,ga,sh,sa){
 if(!desc.ko||desc.leg===1)return null;var t=aggTot(desc,gh,ga);if(t[0]!==t[1])return null;
 if(desc.tb!=null)return desc.tb===desc.h?'h':'a';
 return Math.random()<0.5+(sh-sa)/200?'h':'a';
}
/* partidos de una ronda de pares {a: mejor cabeza de serie, b, l1: goles de la ida [a, b]} */
function pairDescs(pairs,ck,leg,neutral,extra){
 return pairs.map(function(p,ti){var d;
  if(leg===1)d={ck:ck,h:p.b,a:p.a,leg:1,ti:ti};
  else if(leg===2)d={ck:ck,h:p.a,a:p.b,ko:1,agg:[p.l1[0],p.l1[1]],ti:ti,leg:2};
  else d={ck:ck,h:p.a,a:p.b,ko:1,ti:ti,neutral:neutral?1:0};
  if(extra)Object.keys(extra).forEach(function(k){d[k]=extra[k];});
  return d;});
}

/* ---------- Europa: fase de liga de 36, play-off, octavos, cuartos y semis a doble partido, final ---------- */
/* pasos (semanas europeas): 0-7 liga, 8-9 play-off, 10-11 octavos, 12-13 cuartos, 14-15 semis, 16 final */
var LP_STEPS=17;
function newLP(idx,teams){
 var md=EUMD[idx],n=teams.length,rounds=makeFixtures(n).slice(0,n-1);
 var order=shuffle(teams.slice()),pick8=shuffle(rounds.map(function(r,i){return i;})).slice(0,md);
 var fx=pick8.map(function(ri){return rounds[ri].map(function(m){return Math.random()<0.5?[order[m[0]],order[m[1]]]:[order[m[1]],order[m[0]]];});});
 var gt={};teams.forEach(function(x){gt[x]={pts:0,pj:0,gf:0,gc:0};});
 return {id:'E'+(idx+1),n:EUNAMES[S.real?'real':'fic'][idx],kind:'club',fmt:'lp',md:md,teams:teams,fx:fx,gt:gt,step:0,kp:null,next:[],alive:teams.slice(),win:null,
  prize:EUPRIZE[idx],coef:EUCOEF[idx]};
}
function lpTable(T){return T.teams.slice().sort(function(a,b){var x=T.gt[a],y=T.gt[b];return y.pts-x.pts||(y.gf-y.gc)-(x.gf-x.gc)||y.gf-x.gf||S.clubs[b].str-S.clubs[a].str;});}
function lpStage(step){return step<8?'liga':step<10?'po':step<12?'r16':step<14?'qf':step<16?'sf':'f';}
function lpStageName(T){if(T.win!=null)return 'Terminada';var s=T.step;if(s<8)return s<T.md?'Fase de liga · J'+(s+1):'Fase de liga (terminada)';
 return {po:'Play-off',r16:'Octavos de final',qf:'Cuartos de final',sf:'Semifinales',f:'Final'}[lpStage(s)]+(s<16?(s%2?' · vuelta':' · ida'):'');}
function lpMatches(T){
 if(T.win!=null)return [];var s=T.step,ck='E:'+T.id;
 if(s<8){if(s>=T.md)return [];return T.fx[s].map(function(m){return {ck:ck,h:m[0],a:m[1],grp:1};});}
 if(s%2===0&&s<16||s===16){
  if(!T.kp){var tb=lpTable(T),w=T.next.filter(function(x){return x!=null;});
   if(s===8){T.kp=[];for(var i=8;i<16;i++)T.kp.push({a:tb[i],b:tb[31-i],l1:null});T.alive=tb.slice(0,24);}
   else if(s===10){var seeds=tb.slice(0,8),ws=w.slice().sort(function(a,b){return tb.indexOf(a)-tb.indexOf(b);});T.kp=seeds.map(function(x,i){return {a:x,b:ws[7-i],l1:null};});}
   else{T.kp=[];for(var j=0;j<w.length;j+=2)T.kp.push(tb.indexOf(w[j])<tb.indexOf(w[j+1])?{a:w[j],b:w[j+1],l1:null}:{a:w[j+1],b:w[j],l1:null});}
   T.next=[];}
  return pairDescs(T.kp,ck,s===16?0:1,true,{rn:lpStageName(T)});
 }
 return pairDescs(T.kp,ck,2,false,{rn:lpStageName(T)});
}
function lpFinalize(T){
 if(T.win!=null){T.step++;return;}
 var s=T.step;
 if(s>=8&&(s%2===1||s===16)){T.alive=T.next.filter(function(x){return x!=null;}).concat(s===9?lpTable(T).slice(0,8):[]);T.kp=null;
  if(s===16){T.win=T.next[0];trophyCheck('club',T.win,T.n);}}
 if(s===7)T.alive=lpTable(T).slice(0,24);
 T.step++;
}
function lpPlays(T,club){
 if(T.win!=null||T.teams.indexOf(club)<0)return false;var s=T.step;
 if(s<8)return s<T.md;
 var tb=lpTable(T),pos=tb.indexOf(club);
 if(s<10)return pos>=8&&pos<24;
 return T.alive.indexOf(club)>=0;
}

/* ---------- play-offs de ascenso y promociones ---------- */
function bndId(co,t){return co+t;}       /* frontera entre la división t y la t+1 */
function initPO(){
 S.po={};
 COUNTRIES.forEach(function(co){(FMT[co.id]||[]).forEach(function(f,i){
  var t=i+1,U=table(byId(S.lgs,co.id+t)),D=table(byId(S.lgs,co.id+(t+1)));
  var B={id:bndId(co.id,t),co:co.id,t:t,up:D.slice(0,f.dir).map(function(c){return c.id;}),down:U.slice(U.length-f.rel).map(function(c){return c.id;}),
   alive:(f.br||[]).map(function(p){return D[p-1].id;}),n:f.n||1,upPos:f.up?U[f.up-1].id:null,
   bars:(f.bar||[]).map(function(b){return {a:U[b[0]-1].id,b:D[b[1]-1].id,kind:'bar'};}),
   stage:(f.bar&&f.bar.length)?'bar':'br',pairs:[],res:[],w:null,log:[]};
  S.po[B.id]=B;poNext(B);
 });});
}
/* prepara la siguiente ronda: promociones directas, play-off (2, 3, 4 o 6 equipos) y promoción final */
function poNext(B){
 B.res=[];B.pairs=[];
 for(var guard=0;guard<6;guard++){
  if(B.stage==='bar'){if(!B.barDone){B.pairs=B.bars.slice();return;}B.stage='br';}
  if(B.stage==='br'){var al=B.alive,k=al.length;
   if(B.n===2&&k===4){B.pairs=[{a:al[0],b:al[3],kind:'br2'},{a:al[1],b:al[2],kind:'br2'}];return;}
   if(k===6){B.pairs=[{a:al[2],b:al[5],kind:'br'},{a:al[3],b:al[4],kind:'br'}];return;}
   if(k===4){B.pairs=[{a:al[0],b:al[3],kind:'br'},{a:al[1],b:al[2],kind:'br'}];return;}
   if(k===3){B.pairs=[{a:al[1],b:al[2],kind:'br'}];return;}
   if(k===2){B.pairs=[{a:al[0],b:al[1],kind:'fin'}];return;}
   if(k===1){B.w=al[0];B.alive=[];if(B.upPos!=null)B.stage='up';else{B.up.push(B.w);B.stage='done';}}
   else B.stage=B.upPos!=null&&B.w!=null&&!B.upDone?'up':'done';
  }
  if(B.stage==='up'){if(!B.upDone){B.pairs=[{a:B.upPos,b:B.w,kind:'up'}];return;}B.stage='done';}
  if(B.stage==='done')return;
 }
}
function poMatches(B){
 return B.pairs.map(function(p,ti){var fin=p.kind!=='br'&&p.kind!=='br2';
  return {ck:'P:'+B.id,h:p.a,a:p.b,ko:1,ti:ti,neutral:p.kind==='fin'?1:0,tb:fin?null:p.a,
   rn:p.kind==='bar'||p.kind==='up'?'Promoción':p.kind==='fin'?'Final del play-off':'Play-off de ascenso'};});
}
function poFinalize(B){
 if(!B.pairs.length)return;
 var kind=B.pairs[0].kind;
 B.pairs.forEach(function(p,ti){var w=B.res[ti];if(w==null)w=p.a;var lo=w===p.a?p.b:p.a;
  B.log.push({a:p.a,b:p.b,w:w,kind:p.kind});
  if(p.kind==='bar'||p.kind==='up'){if(w===p.b){B.up.push(p.b);B.down.push(p.a);}}
  else if(p.kind==='br2')B.up.push(w);
  else B.alive.splice(B.alive.indexOf(lo),1);
 });
 if(kind==='bar')B.barDone=1;
 if(kind==='up')B.upDone=1;
 if(kind==='br2'){B.alive=[];B.stage='done';}
 poNext(B);
}
function poAllDone(){return Object.keys(S.po||{}).every(function(k){return S.po[k].stage==='done';});}

/* ---------- clasificación europea con cupos reales y campeón de copa ---------- */
function euQualify(byTable){
 var q=[[],[],[]],taken={};
 COUNTRIES.forEach(function(co){
  var lg=byId(S.lgs,co.id+1),order=byTable?table(lg):lg.clubs.map(function(id){return S.clubs[id];}).sort(function(a,b){return b.str-a.str;});
  var Q=EUQ[co.id]||[0,0,0],k=0,cupW=byTable&&S.cups&&S.cups[co.id]?S.cups[co.id].win:null;
  for(var i=0;i<Q[0];i++){var c=order[k++];if(c){q[0].push(c.id);taken[c.id]=1;}}
  var uel=Q[1];
  if(uel>0&&cupW!=null&&!taken[cupW]){q[1].push(cupW);taken[cupW]=1;uel--;}
  while(uel>0&&k<order.length){var c2=order[k++];if(!taken[c2.id]){q[1].push(c2.id);taken[c2.id]=1;uel--;}}
  var uecl=Q[2];while(uecl>0&&k<order.length){var c3=order[k++];if(!taken[c3.id]){q[2].push(c3.id);taken[c3.id]=1;uecl--;}}
 });
 /* el resto de plazas, para los invitados por orden de fuerza (con algo de azar cada año) */
 var gs=S.clubs.filter(function(c){return c.guest;}).map(function(c){return {id:c.id,k:c.str+norm()*3};}).sort(function(a,b){return b.k-a.k;}).map(function(x){return x.id;});
 q.forEach(function(list){while(list.length<36&&gs.length)list.push(gs.shift());});
 return q;
}
function guestLvf(){return 0.45;}
