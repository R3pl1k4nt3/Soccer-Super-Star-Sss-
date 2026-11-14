/* Estrella del Balón · núcleo: utilidades, posiciones, habilidades, rasgos, guardado. */
var KEY='estrella_balon_v5', VER=5, MAXL=14;

/* ---------- utilidades ---------- */
var $=function(s){return document.querySelector(s);};
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function norm(){var u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function poisson(l){var L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random();}while(p>L);return k-1;}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){n=Math.round(n);var a=Math.abs(n);if(a>=1e6)return '€'+(+(n/1e6).toFixed(2))+'M';if(a>=1e3)return '€'+(+(n/1e3).toFixed(a<1e4?1:0))+'k';return '€'+n;}
function ds(x,d){return (+x).toFixed(d==null?1:d).replace('.',',');}
function fnum(n){return n>=1e6?(+(n/1e6).toFixed(2))+' M':n>=1e3?(+(n/1e3).toFixed(1))+' k':String(Math.round(n));}
function r1(x){return Math.round(x*10)/10;}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function byId(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null;}
function wrand(items,wf){var tot=0,w=items.map(function(x){var v=Math.max(0,wf(x));tot+=v;return v;}),r=Math.random()*tot;for(var i=0;i<w.length;i++){r-=w[i];if(r<=0)return items[i];}return items[items.length-1];}

/* ---------- posiciones ---------- */
var WL=[3,2,3,1,2,2,1,1,3,1,2,1,2,4],WW=[4,3,2,1,4,2,3,1,1,2,1,2,2,4],WI=[2,2,3,1,3,3,2,1,2,3,2,1,2,3];
var POSD={
 POR:{n:'Portero',line:'POR',g:'POR',sg:0,sa:0},
 DFC:{n:'Defensa central',line:'DEF',g:'DFC',df:1,sg:.04,sa:.04},
 LI:{n:'Lateral izquierdo',line:'DEF',g:'LI',df:1,sg:.04,sa:.22},
 LD:{n:'Lateral derecho',line:'DEF',g:'LD',df:1,sg:.04,sa:.22},
 MCD:{n:'Mediocentro defensivo',line:'MED',g:'MCD',df:1,sg:.05,sa:.08},
 MC:{n:'Mediocentro',line:'MED',g:'MC',sg:.12,sa:.22},
 VI:{n:'Interior izquierdo',line:'MED',g:'MC',sg:.15,sa:.26},
 VD:{n:'Interior derecho',line:'MED',g:'MC',sg:.15,sa:.26},
 MP:{n:'Mediapunta',line:'MED',g:'MP',sg:.22,sa:.32},
 SD:{n:'Segundo delantero',line:'DEL',g:'DC',sg:.35,sa:.2},
 DC:{n:'Delantero centro',line:'DEL',g:'DC',sg:.45,sa:.12},
 EI:{n:'Extremo izquierdo',line:'DEL',g:'EI',sg:.30,sa:.30},
 ED:{n:'Extremo derecho',line:'DEL',g:'ED',sg:.30,sa:.30}
};
var POS={};Object.keys(POSD).forEach(function(k){POS[k]=POSD[k].n;});
var F433=['POR','LI','DFC','DFC','LD','MCD','MC','MP','EI','DC','ED'];
var ORDER=['POR','DFC','LI','LD','MCD','MC','VI','VD','MP','SD','DC','EI','ED'];
var SLOTS=['POR','POR','DFC','DFC','DFC','DFC','LI','LI','LD','LD','MCD','MCD','MC','MC','VI','VD','MP','SD','DC','DC','EI','ED'];
var PHYS={ace:1,vel:1,agi:1,res:1,sal:1,fue:1};

/* ---------- habilidades ---------- */
var CATS=[['men','Mentales'],['fis','Físicas'],['def','Defensa'],['med','Medio'],['ata','Ataque']];
var SKO=[['con','Concentración','men'],['cfz','Confianza','men'],['cst','Consistencia','men'],['lid','Liderazgo','men'],['dec','Decisión','men'],
 ['ace','Aceleración','fis'],['vel','Velocidad','fis'],['agi','Agilidad','fis'],['res','Resistencia','fis'],['fue','Fuerza','fis'],['sal','Salto','fis'],
 ['mar','Marcaje','def'],['ent','Robo de balón','def'],['ant','Anticipación','def'],['pos','Posicionamiento','def'],
 ['pas','Pase corto','med'],['pal','Pase largo','med'],['vis','Visión','med'],['ctl','Control del balón','med'],['bpa','Balón parado','med'],
 ['tir','Tiro','ata'],['fin','Finalización','ata'],['reg','Regate','ata'],['cab','Remate de cabeza','ata'],['cen','Centros','ata'],['des','Desmarque','ata']];
var SKG=[['con','Concentración','men'],['cfz','Confianza','men'],['cst','Consistencia','men'],['com','Comunicación','men'],
 ['ace','Aceleración','fis'],['agi','Agilidad','fis'],['fue','Fuerza','fis'],['sal','Salto','fis'],
 ['arr','Arrojo','def'],['cap','Captura','def'],['ref','Reflejos','def'],['pos','Posicionamiento','def'],['aer','Juego aéreo','def'],['uno','Mano a mano','def'],
 ['sac','Saque','med'],['pal','Pase largo','med'],['pas','Pase con el pie','med']];
var SKNAME={};SKG.concat(SKO).forEach(function(s){SKNAME[s[0]]=s[1];});
var CATW={POR:[2,2,3,1,0],DFC:[3,3,3,2,1],LI:[2,3,3,2,2],LD:[2,3,3,2,2],MCD:[3,3,3,3,1],MC:[3,2,2,4,2],VI:[2,3,2,3,3],VD:[2,3,2,3,3],MP:[2,2,1,3,3],SD:[2,3,1,2,3],DC:[2,3,1,1,3],EI:[2,3,1,2,3],ED:[2,3,1,2,3]};
var EMP={POR:{arr:4,cap:4,ref:4,pos:3,uno:3,sac:2,con:3},DFC:{mar:4,ent:4,ant:4,pos:4,sal:3,cab:3,fue:3},
 LI:{cen:4,res:4,ace:4,vel:3,mar:3,ent:3},LD:{cen:4,res:4,ace:4,vel:3,mar:3,ent:3},MCD:{ent:4,mar:3,ant:4,pas:3,res:4,fue:3},
 MC:{pas:4,vis:4,ctl:4,res:3},VI:{res:4,pas:3,cen:3,reg:3,vis:3,ace:3},VD:{res:4,pas:3,cen:3,reg:3,vis:3,ace:3},
 MP:{vis:4,ctl:4,reg:4,pas:4,fin:3,tir:3,des:3},SD:{fin:4,des:4,tir:4,reg:3,ace:3,vel:3},DC:{fin:4,cab:4,tir:4,fue:3,des:3,sal:3},
 EI:{reg:4,ace:4,vel:4,cen:4,fin:3,agi:3},ED:{reg:4,ace:4,vel:4,cen:4,fin:3,agi:3}};
function skW(pos,id,cat){var e=EMP[pos];if(e&&e[id])return e[id];return Math.max(1,CATW[pos][['men','fis','def','med','ata'].indexOf(cat)]);}
function catName(c){if(S&&S.pos==='POR'){if(c==='def')return 'Portería';if(c==='med')return 'Distribución';}for(var i=0;i<CATS.length;i++)if(CATS[i][0]===c)return CATS[i][1];return c;}
function newSkills(pos){return (pos==='POR'?SKG:SKO).map(function(s){var w=skW(pos,s[0],s[2]);return {id:s[0],n:s[1],cat:s[2],w:w,lvl:1,prog:0,pen:0,base:Math.round(22+Math.random()*12+w*2)};});}

/* ---------- rasgos ---------- */
var TRAITS=[
 {id:'reg',n:'Regateador excepcional',d:'Desborda con facilidad. Más ocasiones y mejor nota.',sk:['reg','ctl','agi'],fx:{rate:.2,gs:.1,as:.1}},
 {id:'tl',n:'Tirador de larga distancia',d:'Más goles desde fuera del área.',sk:['tir','fin'],fx:{gs:.25}},
 {id:'fk',n:'Lanzador de faltas',d:'Cada partido tienes opción de marcar de falta directa.',sk:['bpa','tir'],fx:{fk:1}},
 {id:'muro',n:'Muro de hierro',d:'Evitas goles rivales con más frecuencia.',sk:['mar','ent','fue'],fx:{cancel:.14}},
 {id:'mago',n:'Mago del balón',d:'Muchas más asistencias.',sk:['ctl','pas','vis'],fx:{as:.5}},
 {id:'killer',n:'Killer del área',d:'Más goles dentro del área.',sk:['fin','des','cab'],fx:{gs:.35}},
 {id:'rayo',n:'Velocista',d:'Ganas todas las carreras. Algo más de nota y asistencias.',sk:['ace','vel','agi'],fx:{rate:.15,as:.15}},
 {id:'aereo',n:'Rey del juego aéreo',d:'Dominas el área en el juego aéreo.',sk:['cab','sal','fue'],fx:{gs:.2,cancel:.06}},
 {id:'capi',n:'Líder nato',d:'Tu equipo juega mejor contigo en el campo.',sk:['lid','con','cfz'],fx:{team:1.5}},
 {id:'pulmon',n:'Pulmón infinito',d:'Te cansas mucho menos en cada partido.',sk:['res','fue'],fx:{drain:-.3,rate:.1}},
 {id:'pase',n:'Pase milimétrico',d:'Asistencias con pases largos y filtrados.',sk:['pal','vis','pas'],fx:{as:.4}},
 {id:'centr',n:'Centrador letal',d:'Tus centros acaban en gol.',sk:['cen','pal'],fx:{as:.45}},
 {id:'lector',n:'Lector del juego',d:'Te adelantas a las jugadas. Evitas goles y mejoras la nota.',sk:['ant','pos','dec'],fx:{cancel:.1,rate:.1}},
 {id:'grande',n:'Jugador de partidos grandes',d:'Subes tu nivel cuando más importa.',sk:['cfz','cst','dec'],fx:{rate:.25,big:.08}},
 {id:'gato',n:'Gato bajo palos',d:'Paradas imposibles. Evitas más goles.',gk:1,sk:['ref','agi','arr'],fx:{cancel:.15}},
 {id:'libero',n:'Portero líbero',d:'Juegas con los pies y mejoras tu nota.',gk:1,sk:['sac','pal','pas'],fx:{rate:.2}},
 {id:'paran',n:'Parapenaltis',d:'Dominas el uno contra uno.',gk:1,sk:['uno','ref','cfz'],fx:{cancel:.12}},
 {id:'gral',n:'General de la defensa',d:'Ordenas a tu defensa y mejora tu equipo.',gk:1,sk:['com','pos','aer'],fx:{cancel:.08,team:1.2}}
];
function traitById(id){return byId(TRAITS,id);}
function trW(id){return S.tp===id?1:S.ts===id?0.5:0;}
function tx(key){var s=0;TRAITS.forEach(function(t){var w=trW(t.id);if(w&&t.fx[key])s+=t.fx[key]*w;});return s;}
function tb(id){var b=0;TRAITS.forEach(function(t){var w=trW(t.id);if(w&&t.sk.indexOf(id)>=0)b+=8*w;});return b;}
function capFor(k){return tb(k.id)>0?MAXL:MAXL-3;}
function traitDec(o){var b=0;TRAITS.forEach(function(t){var w=trW(t.id);if(w&&t.sk.some(function(id){return o.sk.indexOf(id)>=0;}))b+=0.06*w;});return Math.min(b,0.12);}
function traitLine(){var a=traitById(S.tp),b=traitById(S.ts);return 'Rasgos: '+(a?a.n:'-')+' (principal) · '+(b?b.n:'-')+' (secundario)';}
function defCat(pos){var w=CATW[pos],b=0;for(var i=1;i<5;i++)if(w[i]>=w[b])b=i;return ['men','fis','def','med','ata'][b];}

/* ---------- valor de habilidades del jugador ---------- */
function need(l){return 8+3*l;}
function skVal(k){return Math.max(1,k.base+(k.lvl-1)*5-k.pen+tb(k.id)+gearB(k.id));}
function skRaw(k){return Math.max(1,k.base+(k.lvl-1)*5-k.pen+tb(k.id));}
function skv(id){var k=mySk(id);return k?skVal(k):30;}
function mySk(id){for(var i=0;i<S.skills.length;i++)if(S.skills[i].id===id)return S.skills[i];return null;}
function overall(){var sw=0,s=0;S.skills.forEach(function(k){sw+=k.w;s+=k.w*skVal(k);});return s/sw;}
function skAvg(sk){var s=0,n=0;sk.forEach(function(id){var k=mySk(id);if(k){s+=skVal(k);n++;}});return n?s/n:30;}
function catAvg(c){var s=0,n=0;S.skills.forEach(function(k){if(k.cat===c){s+=skVal(k);n++;}});return n?s/n:0;}
function pointCost(k,lvl){return (k.w>=3?12000:4000)*(1+0.25*(lvl-1));}
function costFor(k,n){var cap=capFor(k),l=k.lvl,p=k.prog,sum=0;for(var i=0;i<n;i++){if(l>=cap)break;sum+=pointCost(k,l);p++;if(p>=need(l)){p=0;l++;}}return Math.round(sum);}
function addProg(k,n){var cap=capFor(k),up=0;while(n>0&&k.lvl<cap){k.prog++;n--;if(k.prog>=need(k.lvl)){k.prog=0;k.lvl++;up++;}}if(k.lvl>=cap)k.prog=0;return up;}
/* bonus del material equipado */
function gearB(id){if(!S||!S.gear)return 0;var b=0;Object.keys(S.gear).forEach(function(sl){var g=S.gear[sl];if(g&&g.sk.indexOf(id)>=0)b+=g.b;});return b;}

/* habilidades de un jugador de la IA: se generan con su semilla, no se guardan */
function pskills(p){var r=rng(p.s);return (p.p==='POR'?SKG:SKO).map(function(s){var w=skW(p.p,s[0],s[2]);return {id:s[0],n:s[1],cat:s[2],v:Math.round(clamp(p.o+(w-2.5)*3.5+(r()-.5)*12,8,99))};});}
function pskill(p,id){if(p.me)return Math.round(skv(id));var l=pskills(p);for(var i=0;i<l.length;i++)if(l[i].id===id)return l[i].v;return p.o;}

/* ---------- nombres ---------- */
function mkName(cul){var pool=NAMES[cul]||NAMES.es;return pick(pool[0])+' '+pick(pool[1]);}
function nation(id){return byId(NATIONS,id)||{id:id,n:id,cul:'en',conf:'X',str:55,x:1};}
function country(id){return byId(COUNTRIES,id);}

/* ---------- valor de mercado (estilo Transfermarkt) ---------- */
/* peso de cada liga por país y división */
var LVF={ESP:[1,.45,.22,.12],ENG:[1.15,.55,.32,.2],ITA:[.95,.42,.2],GER:[.95,.5,.25],FRA:[.85,.38,.18],POR:[.7,.25],NED:[.7,.25],IRL:[.22,.12]};
function ageF(a){return a<=19?1.4:a<=21?1.3:a<=23?1.2:a<=25?1.05:a<=27?1:a<=29?.85:a<=30?.7:a<=31?.6:a<=33?.45:.3;}
var POSF={POR:.7,DFC:.9,LI:.85,LD:.85,MCD:.95,MC:1,VI:1,VD:1,MP:1.05,SD:1.1,EI:1.1,ED:1.1,DC:1.15};
function lvf(co,t){if(co==='G'||!t)return 0.45;var l=LVF[co]||[.2];return l[Math.min(t,l.length)-1];}
function mvBase(o,a,pos,co,t){return 1e8*Math.exp((o-90)/8)*ageF(a)*POSF[pos]*lvf(co,t);}
function mvRound(v){var s=v<1e6?25000:v<1e7?100000:500000;return Math.max(10000,Math.round(v/s)*s);}
/* valoración que corresponde a un valor de mercado (para la versión real) */
function oFromValue(v,a,pos,co,t){return clamp(Math.round(90+8*Math.log(v/(1e8*ageF(a)*POSF[pos]*lvf(co,t)))),15,97);}
function mv(p){
 if(!p)return 0;var c=p.c>=0&&S.clubs[p.c]?S.clubs[p.c]:null,co=c?c.co:'ESP',t=c?c.t:4;
 if(p.me){var f=S.ss&&S.ss.rn>=5?clamp(1+(S.ss.rsum/S.ss.rn-6.5)*0.15,0.8,1.3):1;var fame=1+Math.min(0.3,Math.log10(Math.max(1,S.fol))/30);return mvRound(mvBase(overall(),S.age,S.pos,co,t)*f*fame);}
 return mvRound(mvBase(p.o,p.a,p.p,co,t)*(p.vk||1));
}
function fmv(v){return v>=1e6?(+(v/1e6).toFixed(v>=1e7?1:2)).toString().replace('.',',')+' M€':Math.round(v/1000)+' mil €';}

/* ---------- guardado ---------- */
var S=null, toasts=[];
function logm(m){S.log.unshift({t:'T'+S.season+' · '+MONTHS[slotMonth(S.slot)].slice(0,3),m:m});if(S.log.length>60)S.log.length=60;}
function toast(m,err){var t={m:m,err:!!err,id:Math.random()};toasts.push(t);if(toasts.length>3)toasts.shift();render();setTimeout(function(){toasts=toasts.filter(function(x){return x!==t;});render();},2600);}
function rel(k,v){S.rel[k]=clamp(Math.round((S.rel[k]+v)*10)/10,0,100);}
function moral(v){S.moral=clamp(Math.round(S.moral+v),0,100);}
function itemLvl(id){return S.items[id]||0;}
