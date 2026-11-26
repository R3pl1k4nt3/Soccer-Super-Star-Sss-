/* Estrella del Balón · entorno: representante, redes, material, patrocinios, prensa, eventos, mercado y dinero. */

var SHOP=[
 {id:'coach',n:'Entrenador personal',d:'+1 punto de habilidad por partido y nivel',c:[80000,250000,700000]},
 {id:'nutri',n:'Nutricionista',d:'+4 de energía semanal por nivel',c:[40000,120000,300000]},
 {id:'physio',n:'Fisioterapeuta',d:'Menos lesiones y más cortas',c:[60000,180000,450000]},
 {id:'psico',n:'Psicólogo deportivo',d:'+1 medalla en partidos con nota 7 o más, por nivel',c:[90000,280000,700000]}
];
var INVEST=[
 {id:'piso',n:'Piso de alquiler',c:150000,w:1200},{id:'cafe',n:'Cafetería',c:450000,w:3800},{id:'rest',n:'Restaurante',c:700000,w:6000},
 {id:'gym',n:'Gimnasio',c:1200000,w:11000},{id:'ropa',n:'Marca de ropa propia',c:2200000,w:20000},{id:'acad',n:'Escuela de fútbol',c:3500000,w:34000},
 {id:'inmo',n:'Inmobiliaria',c:6000000,w:60000},{id:'hotel',n:'Hotel boutique',c:10000000,w:110000}
];

/* ---------- representante ---------- */
function agent(){return byId(AGENTS,S.agent)||AGENTS[0];}
function agentLvl(){return agent().lvl;}
function agentCom(){return agent().com;}
function agentWage(){return 1+0.07*(agentLvl()-1);}
function hireAgent(id){
 var a=byId(AGENTS,id);if(!a||a.id===S.agent)return;
 if(overall()<a.req){toast(a.n+' solo representa a jugadores de valoración '+a.req+' o más.',1);return;}
 if(S.fol<a.fol){toast(a.n+' pide al menos '+fnum(a.fol)+' seguidores.',1);return;}
 if(S.money<a.fee){toast('La firma cuesta '+fmt(a.fee)+'.',1);return;}
 S.money-=a.fee;S.agent=id;logm('Firmas con tu nuevo representante: '+a.n+'.');toast('Nuevo representante: '+a.n);genOffers();save();render();
}
function fireAgent(){if(S.agent==='a1')return;logm('Dejas a '+agent().n+'. Vuelve a llevarte tu primo.');S.agent='a1';save();render();}
function agentSearch(){
 if(!windowOpen()){toast('El mercado está cerrado.',1);return;}
 if(S.agSearch===S.season+'_'+(S.slot<10?0:1)){toast('Tu representante ya ha movido tu nombre en este mercado.',1);return;}
 S.agSearch=S.season+'_'+(S.slot<10?0:1);genOffers('Tu representante te trae nuevas ofertas.');toast('Nuevas ofertas en la lista.');save();render();
}

/* ---------- ofertas de clubes ---------- */
function genOffers(msg){
 var lvl=agentLvl(),ov=overall(),me=S.pl[S.me],cur=S.clubs[me.c];
 var nat=S.pl[S.me].nat,can=S.clubs[S.cantera].co;
 var stand=ov>=cur.str+12; /* si destacas mucho, te ojean desde fuera aunque tu representante sea modesto */
 var okCo=function(co){if(lvl>=3||stand)return true;if(co===cur.co)return true;return lvl>=2&&(co===can||co===nat);};
 var hi=ov+3+3*lvl+(S.rumor?3:0),lo=Math.min(ov-8,cur.str-4);
 var c=shuffle(S.clubs.filter(function(x){return !x.guest&&x.id!==cur.id&&okCo(x.co)&&x.str<=hi&&x.str>=lo;}));
 c.sort(function(a,b){return (b.str+Math.random()*6)-(a.str+Math.random()*6);});
 c=c.slice(0,1+lvl+(S.listed?2:0));
 if(!c.length)c=S.clubs.filter(function(x){return x.id!==cur.id&&x.co===cur.co;}).sort(function(a,b){return Math.abs(a.str-ov)-Math.abs(b.str-ov);}).slice(0,2);
 S.offers=c.map(function(x){var w=wageFor(x.str,ov);return {club:x.id,wage:w,years:1+Math.floor(Math.random()*4),bonus:Math.round(w*4*(1+0.2*(lvl-1)))};});
 S.rumor=0;
 if(msg)logm(msg);
}
/* fichar por un club: terms y prima vienen de la negociación; sin ellos, se firma la oferta tal cual */
function accept(i,terms,prima){
 var o=S.offers[i];if(!o)return;
 if(!windowOpen()){toast('El mercado está cerrado. Abre al inicio de temporada y en enero.',1);return;}
 var me=S.pl[S.me],old=S.clubs[me.c],cl=S.clubs[o.club],k=ctr(),fee=transferFee(),cut=k.so?Math.round(fee*k.so/100):0;
 old.ros.splice(old.ros.indexOf(S.me),1);cl.ros.push(S.me);me.c=cl.id;
 S.contract=terms||{wage:o.wage,years:o.years,gb:0,ab:0,apb:0,so:0};
 var pr=prima!=null?prima:o.bonus;S.money+=pr+cut;
 S.rel.coach=50;S.rel.team=45;S.rel.board=50;S.rel.fans=cl.id===S.cantera?75:45;
 S.listed=0;S.renewDue=0;S.bobj=null;S.bm=null;S.treqNo=-1;
 logm('Fichas por '+cl.n+' ('+lgName(cl)+') por un traspaso de '+fmv(fee)+'. Salario '+fmt(S.contract.wage)+' por semana, '+S.contract.years+' año(s)'+(pr?', prima de '+fmt(pr):'')+bonusTxt(S.contract)+'.'+(cut?' Cobras tu '+k.so+'% de la venta: '+fmt(cut)+'.':'')+(cl.id===S.cantera?' Vuelves a casa.':''));
 S.offers=[];genOffers();toast('Fichas por '+cl.n);save();render();
}

/* ---------- community manager y redes ---------- */
function cmObj(){return S.cm?byId(CMS,S.cm):null;}
function hireCM(id){var c=byId(CMS,id);if(!c)return;S.cm=id;logm('Contratas a '+c.n+' para llevar tus redes ('+fmt(c.c)+' por semana).');save();render();}
function fireCM(){if(!S.cm)return;logm('Prescindes de tu community manager.');S.cm=null;save();render();}
function cmWeekly(){var c=cmObj();if(!c)return;S.fol=Math.round(S.fol*(1+c.g));if(c.pr)rel('press',c.pr);
 if(Math.random()<c.risk){rel('press',-4);rel('fans',-2);var m=pick(['Un tuit antiguo tuyo se hace viral y no para bien.','Tu cuenta publica por error una foto de fiesta un día de entreno.','Una respuesta a un aficionado rival acaba en polémica.']);logm(m);toast(m,1);}}
function socialIncome(){var c=cmObj();return Math.round(S.fol/1000*3*(0.7+S.rel.press/100)*(c?1+c.g*20:1));}
function postValue(){var c=cmObj();return Math.round((S.fol*0.02+2000)*(c?c.post:1));}
function postPaid(){
 if(S.post){toast('Ya has publicado esta semana.',1);return;}
 var m=postValue();S.money+=m;S.post=1;logm('Colaboración pagada en redes: '+fmt(m)+'.');toast('Cobras '+fmt(m)+' por la colaboración.');save();render();
}

/* ---------- material ---------- */
var GEAR_CACHE=null;
function gearCatalog(){
 if(GEAR_CACHE&&GEAR_CACHE.gk===(S.pos==='POR'))return GEAR_CACHE.list;
 var gk=S.pos==='POR',list=[];
 BRANDS.filter(function(b){return b.cat==='botas';}).forEach(function(b){
  BRAND_GAMAS[b.tier].forEach(function(gid){var G=byId(GAMAS,gid),mult=1+0.15*(b.tier-1);
   (gk?GK_BOOT_TYPES:BOOT_TYPES).forEach(function(t){list.push({id:b.id+'_'+gid+'_'+t.id,slot:'botas',n:b.n+' '+t.n,brand:b.id,gama:G.n,type:t.id,sk:t.sk,b:G.b+(b.tier===4&&gid==='e'?1:0),c:Math.round(G.c*mult/100)*100,dur:G.dur+b.tier*2});});
   if(gk)GLOVE_TYPES.forEach(function(t){list.push({id:'gl_'+b.id+'_'+gid+'_'+t.id,slot:'guantes',n:'Guantes '+b.n+' '+t.n,brand:b.id,gama:G.n,type:t.id,sk:t.sk,b:G.b,c:Math.round(G.c*mult*0.8/100)*100,dur:G.dur+b.tier*2});});
  });
 });
 var kb={b:'leo',m:'kai',p:'fel',e:'tri'};
 GAMAS.forEach(function(G){KIT_TYPES.forEach(function(t){var b=byId(BRANDS,kb[G.id]);list.push({id:'kit_'+G.id+'_'+t.id,slot:'ropa',n:t.n+' '+b.n,brand:b.id,gama:G.n,type:t.id,sk:t.sk,b:Math.max(1,G.b-1),c:Math.round(G.c*0.6/100)*100,dur:G.dur});});});
 GEAR_CACHE={gk:gk,list:list};return list;
}
function bootSponsor(){var s=S.spons.filter(function(x){return x.cat==='botas';})[0];return s?s.id:null;}
function buyGear(id){
 var it=byId(gearCatalog(),id);if(!it)return;
 var bs=bootSponsor();
 if(it.slot==='botas'&&bs&&it.brand!==bs){toast('Tu contrato con '+byId(BRANDS,bs).n+' te obliga a jugar con sus botas.',1);return;}
 if(S.money<it.c){toast('Te faltan '+fmt(it.c-S.money)+'.',1);return;}
 S.money-=it.c;equip(it);logm('Compras '+it.n+' ('+it.gama+').');toast('Equipas '+it.n);save();render();
}
function equip(it){S.gear[it.slot]={id:it.id,n:it.n,brand:it.brand,gama:it.gama,sk:it.sk,b:it.b,dur:it.dur,max:it.dur};}
function wearGear(){Object.keys(S.gear).forEach(function(sl){var g=S.gear[sl];if(!g)return;g.dur--;if(g.dur<=0){logm('Tu material se ha gastado: '+g.n+'.');toast('Se gasta: '+g.n,1);delete S.gear[sl];}});}

/* ---------- patrocinios ---------- */
function brandReq(b){var t=BTIER[b.tier],l=agentLvl();return {ov:t.ov-(l-1),fol:Math.round(t.fol*(1-0.1*(l-1)))};}
function brandOk(b){var r=brandReq(b);return overall()>=r.ov&&S.fol>=r.fol;}
function sponsorIncome(){return S.spons.reduce(function(s,x){return s+x.w;},0);}
function sponsorOffer(b,raise){
 var t=BTIER[b.tier],me=S.pl[S.me],vis=Math.exp((S.clubs[me.c].str-60)/40);
 var w=t.w*(1+Math.max(0,overall()-brandReq(b).ov)/40)*(1+0.08*(agentLvl()-1))*(0.85+Math.random()*0.3)*vis*(raise||1);
 return {id:b.id,cat:b.cat,w:Math.round(w/100)*100,yrs:1+Math.floor(Math.random()*3),posts:t.posts};
}
function sponsorMonth(){
 /* obligaciones */
 S.spons=S.spons.filter(function(s){var b=byId(BRANDS,s.id);
  if(s.done<s.posts){s.strikes=(s.strikes||0)+1;s.sat=clamp((s.sat||60)-20,0,100);
   if(s.strikes>=2){logm(b.n+' rescinde tu contrato por no cumplir con las publicaciones.');toast(b.n+' rescinde el patrocinio',1);rel('press',-3);return false;}
   logm(b.n+' se queja: no has hecho las publicaciones pactadas ('+s.done+'/'+s.posts+').');}
  else s.sat=clamp((s.sat||60)+5,0,100);
  s.done=0;return true;});
 /* nuevas propuestas */
 var cats={};S.spons.forEach(function(s){cats[s.cat]=1;});
 S.sofs=S.sofs.filter(function(o){return !cats[o.cat];}).slice(0,4);
 var have={};S.sofs.forEach(function(o){have[o.id]=1;});
 shuffle(BRANDS.slice()).forEach(function(b){if(S.sofs.length>=4||cats[b.cat]||have[b.id]||!brandOk(b))return;
  if(Math.random()<0.18+0.06*agentLvl()){S.sofs.push(sponsorOffer(b));have[b.id]=1;logm(b.n+' quiere patrocinarte. Mira las propuestas en Negocios.');}});
}
function sponsorSeason(){
 S.spons=S.spons.filter(function(s){s.yrs--;if(s.yrs>0)return true;var b=byId(BRANDS,s.id);
  if((s.sat||60)>=50&&brandOk(b)){var o=sponsorOffer(b,1.15);S.sofs.unshift(o);logm(b.n+' quiere renovar tu patrocinio.');}
  else logm('Termina tu patrocinio con '+b.n+'.');
  return false;});
}
function signSponsor(i){
 var o=S.sofs[i];if(!o)return;var b=byId(BRANDS,o.id);
 if(S.spons.some(function(s){return s.cat===o.cat;})){toast('Ya tienes un patrocinador de '+BCAT[o.cat].toLowerCase()+'.',1);return;}
 S.spons.push({id:o.id,cat:o.cat,w:o.w,yrs:o.yrs,posts:o.posts,done:0,sat:60,strikes:0});S.sofs.splice(i,1);
 logm('Firmas con '+b.n+': '+fmt(o.w)+' por semana durante '+o.yrs+' año(s).');toast('Patrocinio firmado: '+b.n);
 if(o.cat==='botas'){var it=gearCatalog().filter(function(g){return g.slot==='botas'&&g.brand===o.id;}).sort(function(x,y){return y.b-x.b;})[0];if(it){equip(it);logm(b.n+' te regala sus botas '+it.n+' ('+it.gama+').');}}
 save();render();
}
function rejectSponsor(i){var o=S.sofs[i];if(!o)return;S.sofs.splice(i,1);save();render();}
function sponsorPost(id){var s=S.spons.filter(function(x){return x.id===id;})[0];if(!s)return;
 if(s.wk===S.slot){toast('Ya has publicado para esta marca esta semana.',1);return;}
 if(s.done>=s.posts){toast('Ya cumples las publicaciones de este mes.',1);return;}
 s.wk=S.slot;s.done++;S.fol=Math.round(S.fol*1.003);logm('Publicación para '+byId(BRANDS,id).n+' ('+s.done+'/'+s.posts+' este mes).');save();render();}
function cancelSponsor(id){S.spons=S.spons.filter(function(x){return x.id!==id;});logm('Rescindes tu patrocinio con '+byId(BRANDS,id).n+'.');rel('press',-1);save();render();}

/* ---------- ruedas de prensa ---------- */
var PRESS=[
 {w:function(r){return r.win&&(r.g>0||r.r>=7.5);},q:'¿Cómo valoras tu partido de hoy?',a:[
  {n:'El mérito es de todo el equipo',fx:{team:3,press:1,moral:2}},
  {n:'Hoy he demostrado que soy el mejor',fx:{fol:.03,press:2,team:-3,moral:5}},
  {n:'Todavía puedo hacerlo mucho mejor',fx:{coach:3,moral:1}}]},
 {w:function(r){return r.lose;},q:'¿Qué ha fallado hoy?',a:[
  {n:'Asumo mi parte de culpa',fx:{coach:2,fans:2,moral:-2}},
  {n:'El árbitro nos ha perjudicado',fx:{press:-2,fans:2,board:-2,fol:.01}},
  {n:'Hay que mirar hacia delante',fx:{moral:1}}]},
 {w:function(r){return r.role==='banquillo'||r.role==='suplente';},q:'¿Estás contento con tus minutos?',a:[
  {n:'Respeto las decisiones del míster',fx:{coach:4}},
  {n:'Merezco jugar más, y lo sabe todo el mundo',fx:{coach:-5,fans:2,moral:2}},
  {n:'Trabajaré para ganarme el puesto',fx:{coach:2,team:1,moral:1}}]},
 {w:function(r){var me=S.pl[S.me];return !r.nat&&overall()>S.clubs[me.c].str+4;},q:'Se habla del interés de clubes más grandes. ¿Te vas a quedar?',a:[
  {n:'Estoy feliz aquí',fx:{fans:4,board:3}},
  {n:'Nunca se sabe en el fútbol',fx:{fol:.02,board:-3,fans:-2,rumor:1}},
  {n:'Eso lo lleva mi representante',fx:{press:1}}]},
 {w:function(r){return r.imp>=1.6&&!r.win&&!r.lose;},q:'Partido muy igualado. ¿Os veis favoritos para la vuelta o el próximo cruce?',a:[
  {n:'Respeto al rival, pero vamos a ganar',fx:{moral:3,press:2}},
  {n:'Somos inferiores, toca sufrir',fx:{moral:-2,fans:-1,press:1}},
  {n:'Les vamos a pasar por encima',fx:{moral:5,press:3,team:-2}}]},
 {w:function(r){return r.imp>=1.8&&r.win;},q:'¡Gran victoria en un partido clave! ¿A quién se la dedicas?',a:[
  {n:'A nuestra afición',fx:{fans:6}},
  {n:'A mi familia',fx:{press:2,moral:3}},
  {n:'A los que no creían en mí',fx:{fol:.04,press:-1,moral:4}}]},
 {w:function(r){return r.nat;},q:'¿Qué significa para ti jugar con tu selección?',a:[
  {n:'Es un orgullo enorme',fx:{fans:3,press:2}},
  {n:'Quiero ser el líder de este equipo',fx:{moral:3,press:1,fol:.02}},
  {n:'Ahora mismo mi cabeza está en mi club',fx:{board:3,press:-2}}]},
 {w:function(r){return r.mins>0&&r.r<5.5;},q:'La prensa critica tu nivel. ¿Qué respondes?',a:[
  {n:'Tienen razón, debo mejorar',fx:{press:3,moral:-1}},
  {n:'No leo lo que se dice de mí',fx:{moral:2,press:-2}},
  {n:'Que esperen al próximo partido',fx:{moral:4,press:1,fol:.01}}]},
 {w:function(r){return true;},q:'¿Cuál es tu objetivo para lo que queda de temporada?',a:[
  {n:'Ganar títulos',fx:{moral:2,board:2,press:1}},
  {n:'Ser titular indiscutible',fx:{coach:1,moral:2}},
  {n:'Ir partido a partido',fx:{coach:2}}]}
];
function pressAfter(rep,interactive){
 if(!rep||!interactive||S.press)return;
 var big=rep.imp>=1.6||rep.g>=2||rep.r>=8.5||(rep.mins>0&&rep.r<5);
 if(!big&&Math.random()>0.22)return;
 var qs=[];PRESS.forEach(function(p,i){if(p.w(rep))qs.push(i);});
 var gen=qs.pop();qs=shuffle(qs).slice(0,big?2:1);if(!qs.length)qs=[gen];
 S.press={qs:qs,i:0,ctx:rep.comp,ans:[]};
}
function pressAnswer(ai){
 var P=S.press;if(!P)return;var q=PRESS[P.qs[P.i]],a=q.a[ai],fx=a.fx,parts=[];
 Object.keys(fx).forEach(function(k){var v=fx[k];
  if(k==='fol'){S.fol=Math.round(S.fol*(1+v));parts.push('seguidores +'+Math.round(v*100)+'%');}
  else if(k==='moral'){moral(v*2);parts.push('moral '+(v>0?'+':'')+v*2);}
  else if(k==='rumor'){S.rumor=1;parts.push('más interés de otros clubes');}
  else{rel(k,v);parts.push(REL_INFO[k][0].toLowerCase()+' '+(v>0?'+':'')+v);}});
 P.ans.push({q:q.q,a:a.n,fx:parts.join(', ')});
 P.i++;
 if(P.i>=P.qs.length){logm('Rueda de prensa: «'+a.n+'».');S.pressLast=P;S.press=null;}
 save();render();
}
function pressSkip(){if(!S.press)return;rel('press',-2);logm('Te niegas a hablar con la prensa.');S.press=null;save();render();}

/* ---------- eventos ---------- */
var REL_INFO={coach:['Entrenador','Más relación, más opciones de ser titular y de ganar los duelos'],team:['Vestuario','Mejora la fuerza de tu equipo y tu nota'],press:['Prensa','Más ingresos por redes, convocatorias y mejores titulares'],fans:['Afición','Más dinero en las primas por partido'],board:['Directiva','Mejores salarios en contratos y ofertas']};
function evMoney(){return Math.round(Math.max(8000,S.fol*0.04)/100)*100;}
var EVENTS=[
 {t:'Una marca local te propone un anuncio',d:'Quieren tu cara en su próxima campaña.',o:[
  {n:'Aceptar',f:function(){var m=evMoney();S.money+=m;rel('press',1);S.fol=Math.round(S.fol*1.02);return 'Cobras '+fmt(m)+' por el anuncio.';}},
  {n:'Rechazar',f:function(){rel('fans',1);return 'Prefieres centrarte en el fútbol. La afición lo valora.';}}]},
 {t:'Un periodista pide una entrevista exclusiva',d:'Quiere hablar de tu momento de forma.',o:[
  {n:'Aceptar',f:function(){rel('press',5);S.fol=Math.round(S.fol*1.02);return 'La entrevista sale bien. Sube tu relación con la prensa.';}},
  {n:'Rechazar',f:function(){rel('press',-3);return 'El periodista se lo toma mal.';}}]},
 {t:'El entrenador te cita en su despacho',d:'Quiere comentar tu actitud en los entrenamientos.',o:[
  {n:'Escuchar y aceptar críticas',f:function(){rel('coach',4);addProg(pick(S.skills),2);return 'Sales con ideas claras y +2 puntos de habilidad.';}},
  {n:'Defender tu postura',f:function(){if(Math.random()<0.4){rel('coach',2);rel('team',2);return 'El míster respeta tu carácter.';}rel('coach',-6);return 'La discusión sube de tono. Baja la relación con el míster.';}}]},
 {t:'Un compañero te pide ayuda',d:'Pasa por un mal momento personal.',o:[
  {n:'Ayudarle',f:function(){rel('team',5);return 'El vestuario aprecia el gesto.';}},
  {n:'Mantenerte al margen',f:function(){rel('team',-3);return 'Algunos compañeros lo notan.';}}]},
 {t:'Aficionados te esperan a la salida',d:'Piden fotos y autógrafos.',o:[
  {n:'Pararte con ellos',f:function(){rel('fans',4);S.fol=Math.round(S.fol*1.01);return 'Las fotos corren por redes.';}},
  {n:'Pasar de largo',f:function(){rel('fans',-3);return 'Se oyen algunos pitidos.';}}]},
 {t:'La directiva te propone ampliar contrato',d:'Te ofrecen una mejora pequeña pero segura.',o:[
  {n:'Aceptar',f:function(){S.contract.wage=Math.round(S.contract.wage*1.05/100)*100;S.contract.years++;rel('board',3);return 'Tu salario sube un 5% y sumas un año de contrato.';}},
  {n:'Que negocie tu representante',f:function(){if(Math.random()<clamp(0.2+agentLvl()*0.08+(S.rel.board-50)/150,0.1,0.8)){S.contract.wage=Math.round(S.contract.wage*(1.08+0.02*agentLvl())/100)*100;S.contract.years++;return agent().n+' consigue una subida del '+(8+2*agentLvl())+'%.';}rel('board',-5);return 'La negociación se rompe y la directiva se enfría.';}}]},
 {t:'Invitación a un acto benéfico',d:'Es el sábado, con otros jugadores de la liga.',o:[
  {n:'Ir (cuesta '+fmt(3000)+')',f:function(){if(S.money<3000)return 'No tienes dinero para ir.';S.money-=3000;rel('fans',4);rel('press',3);return 'Gran imagen pública.';}},
  {n:'Declinar',f:function(){return 'Dejas pasar la invitación.';}}]},
 {t:'Rumores de fichaje en prensa',d:'Dicen que un grande se interesa por ti.',o:[
  {n:'Desmentirlo',f:function(){rel('press',2);rel('board',2);return 'Tu club agradece la lealtad.';}},
  {n:'Dejar que crezca',f:function(){S.fol=Math.round(S.fol*1.05);rel('board',-3);rel('coach',-2);S.rumor=1;return 'Ganas seguidores y más clubes preguntan por ti, pero molesta en el club.';}}]},
 {t:'Tu patrocinador organiza un acto',d:'Quieren que aparezcas en la presentación de un producto.',c:function(){return S.spons.length>0;},o:[
  {n:'Ir al acto',f:function(){var s=pick(S.spons);s.sat=clamp((s.sat||60)+15,0,100);S.energy=Math.max(0,S.energy-10);S.fol=Math.round(S.fol*1.015);return byId(BRANDS,s.id).n+' queda encantada contigo.';}},
  {n:'Excusarte',f:function(){var s=pick(S.spons);s.sat=clamp((s.sat||60)-15,0,100);return byId(BRANDS,s.id).n+' no se lo toma bien.';}}]},
 {t:'Pique en el entrenamiento',d:'Un compañero te entra muy fuerte en un partidillo.',o:[
  {n:'Encararte con él',f:function(){rel('team',-3);rel('coach',-2);moral(2);return 'Hay que separaros. El míster no está contento.';}},
  {n:'Dejarlo pasar',f:function(){rel('team',1);moral(-1);return 'Te tragas el orgullo y sigues entrenando.';}},
  {n:'Hablar con él después',f:function(){rel('team',3);return 'Aclaráis las cosas en el vestuario.';}}]},
 {t:'El míster te prueba en otra posición',d:'Quiere ver si le das una alternativa táctica.',o:[
  {n:'Aceptar el reto',f:function(){rel('coach',5);moral(-2);return 'Al míster le gusta tu disposición.';}},
  {n:'Pedirle jugar en tu puesto',f:function(){if(S.rel.coach>=60){rel('coach',-1);return 'Lo entiende: te deja en tu sitio.';}rel('coach',-6);return 'No le sienta bien que le discutas.';}}]},
 {t:'Novatada en el vestuario',d:'Los veteranos preparan una broma a los nuevos y te toca.',c:function(){return S.age<=21;},o:[
  {n:'Seguir la broma',f:function(){rel('team',4);return 'Te ganas al vestuario.';}},
  {n:'Negarte',f:function(){rel('team',-4);return 'Algunos veteranos te miran mal.';}}]},
 {t:'El capitán te pide que hables en el vestuario',d:'Antes de un partido importante quiere que digas unas palabras.',o:[
  {n:'Dar un discurso',f:function(){if(S.moral>=50){rel('team',5);moral(3);return 'Tu discurso enciende al equipo.';}rel('team',-2);return 'No te salen las palabras y el vestuario lo nota.';}},
  {n:'Ceder la palabra a un veterano',f:function(){rel('team',1);return 'Prefieres hablar en el campo.';}}]},
 {t:'Un compañero filtra a la prensa una discusión',d:'Sale publicado que discutiste con el míster.',o:[
  {n:'Desmentirlo en público',f:function(){rel('coach',3);rel('press',-2);return 'El míster agradece que lo cortes.';}},
  {n:'Buscar al chivato',f:function(){rel('team',-4);rel('coach',1);return 'El ambiente se enrarece.';}},
  {n:'No decir nada',f:function(){rel('press',-1);return 'La noticia se apaga sola.';}}]},
 {t:'La directiva te invita al palco',d:'Quieren que acompañes a unos inversores en un partido de la cantera.',o:[
  {n:'Ir',f:function(){rel('board',5);S.energy=Math.max(0,S.energy-5);return 'Los inversores salen encantados contigo.';}},
  {n:'Excusarte',f:function(){rel('board',-3);return 'En los despachos lo apuntan.';}}]},
 {t:'Una fiesta de cumpleaños de un compañero',d:'Es la víspera del partido.',o:[
  {n:'Ir un rato',f:function(){rel('team',4);if(Math.random()<0.35){S.energy=Math.max(0,S.energy-20);rel('coach',-4);return 'Se alarga la noche. El míster se entera.';}return 'Buen rato con el vestuario.';}},
  {n:'Quedarte en casa',f:function(){rel('coach',1);return 'Descansas para el partido.';}}]}
];
function newEvent(){var ok=EVENTS.map(function(e,i){return i;}).filter(function(i){return !EVENTS[i].c||EVENTS[i].c();});S.event={i:pick(ok)};}
function doEvent(oi){if(!S.event)return;var ev=EVENTS[S.event.i];S.event=null;var m=ev.o[oi].f();logm(m);toast(m);save();render();}

/* ---------- acciones sociales ---------- */
var ACTS=[
 {id:'consejo',w:'coach',n:'Pedir consejo al entrenador',d:'+4 relación y +2 puntos en una habilidad',cd:4,cost:0,run:function(){rel('coach',4);var k=pick(S.skills);addProg(k,2);return 'El míster te da claves de '+k.n+': +2 puntos.';}},
 {id:'minutos',w:'coach',n:'Pedir más minutos',d:'Solo si estás jugando poco. Sale bien si tu último partido fue bueno',cd:4,cost:0,
  cond:function(){return !S.last||S.last.mins<60?null:'Estás jugando: no tiene sentido pedir más minutos.';},
  run:function(){if(S.last&&S.last.mins>0&&S.last.r>=6.5){rel('coach',5);return 'El míster valora tu actitud.';}rel('coach',-6);return 'No le ha sentado bien.';}},
 {id:'extra',w:'coach',n:'Quedarte a entrenar extra',d:'−12 de energía, +3 puntos de habilidad y +2 con el míster',cd:2,cost:0,
  cond:function(){return S.energy>=30?null:'Estás demasiado cansado.';},
  run:function(){S.energy=Math.max(0,S.energy-12);rel('coach',2);var k=pick(S.skills);addProg(k,3);return 'Te quedas después del entreno: +3 puntos en '+k.n+'.';}},
 {id:'tactica',w:'coach',n:'Proponer una idea táctica',d:'Si le convence, +5 con el míster y moral; si no, se molesta',cd:6,cost:0,
  run:function(){if(Math.random()<0.35+S.rel.coach/250){rel('coach',5);moral(3);return 'Al míster le gusta tu idea y la prueba en el entreno.';}rel('coach',-3);return 'El míster te recuerda quién manda.';}},
 {id:'cena',w:'team',n:'Cena de equipo',d:'Cuesta '+fmt(5000)+', +5 relación',cd:8,cost:5000,run:function(){rel('team',5);return 'Buen ambiente en el vestuario.';}},
 {id:'joven',w:'team',n:'Ayudar a un compañero joven',d:'+3 relación con el vestuario y +1 con el míster',cd:3,cost:0,run:function(){rel('team',3);rel('coach',1);return 'Te lo agradecen.';}},
 {id:'capitan',w:'team',n:'Hablar con el capitán',d:'+3 vestuario, +1 míster. Con buena relación, más moral',cd:5,cost:0,run:function(){rel('team',3);rel('coach',1);if(S.rel.team>=60){moral(3);return 'El capitán te dice que cuenta contigo para los partidos grandes.';}return 'Charla tranquila con el capitán.';}},
 {id:'consola',w:'team',n:'Torneo de videojuegos en la concentración',d:'+4 vestuario, −5 de energía',cd:4,cost:0,run:function(){rel('team',4);S.energy=Math.max(0,S.energy-5);return pick(['Ganas el torneo y te ríes de todos.','Pierdes en la final y no paran de picarte.','Noche divertida con el vestuario.']);}},
 {id:'reunion',w:'board',n:'Pedir una reunión con la directiva',d:'Hablas del proyecto, tu papel o tu futuro',cd:6,cost:0,
  cond:function(){return S.bm?'Ya tienes una reunión pendiente.':null;},
  run:function(){newBoardMeeting(true);return 'La directiva te recibe en su despacho.';}},
 {id:'entrevista',w:'press',n:'Dar una entrevista',d:'+4 relación con la prensa y más seguidores. Rinde menos si das muchas',cd:2,dim:1,cost:0,run:function(f){rel('press',Math.round(4*f));S.fol=Math.round(S.fol*(1+0.01*f));return f<1?'Otra entrevista más: ya no despierta tanto interés.':'Buena entrevista.';}},
 {id:'polemica',w:'press',n:'Declaraciones polémicas',d:'Muchos seguidores, pero riesgo con prensa y vestuario. Repetirlas sale cada vez peor',cd:3,dim:1,cost:0,run:function(f){S.fol=Math.round(S.fol*(1+0.04*f));if(Math.random()<0.5*f){rel('press',3);return 'Los titulares te favorecen.';}rel('press',-4-(f<1?2:0));rel('team',-3-(f<1?2:0));return f<1?'Otra polémica más: la prensa y el vestuario se cansan de ti.':'Los titulares te pasan factura.';}},
 {id:'directo',w:'press',n:'Directo en redes',d:'+1,5% de seguidores. A veces se te escapa algo',cd:2,dim:1,cost:0,run:function(f){S.fol=Math.round(S.fol*(1+0.015*f));if(Math.random()<0.15){rel('team',-3);return 'Comentas una cosa del vestuario que no debías.';}rel('press',1);return 'Buen directo: tus seguidores responden.';}},
 {id:'autografos',w:'fans',n:'Firmar autógrafos',d:'+3 relación con la afición',cd:1,cost:0,run:function(){rel('fans',3);S.fol=Math.round(S.fol*1.005);return 'La afición se va contenta.';}},
 {id:'pena',w:'fans',n:'Visitar una peña',d:'Cuesta '+fmt(2000)+', +5 afición',cd:6,cost:2000,run:function(){rel('fans',5);return 'La peña te recibe como a un ídolo.';}},
 {id:'dona',w:'fans',n:'Donar a una causa local',d:'Cuesta '+fmt(10000)+', +5 afición y +2 prensa',cd:6,cost:10000,run:function(){rel('fans',5);rel('press',2);return 'Gran gesto con tu comunidad.';}},
 {id:'contrato',w:'board',n:'Pedir mejora de contrato',d:'Abre una negociación con la directiva. Una vez por temporada y con el mercado abierto',season:1,cost:0,
  cond:function(){if(!windowOpen())return 'Solo con el mercado abierto (inicio de temporada y enero).';var me=S.pl[S.me];if(overall()<S.clubs[me.c].str-4&&S.rel.board<60)return 'La directiva no ve motivos: rinde más o mejora tu relación con ella.';return null;},
  run:function(){negOpen('ren');return 'Te sientas a negociar con la directiva.';}}
];
/* estado de una acción: si se puede hacer y, si no, por qué y cuándo */
function actState(a){
 var wk=S.wk||0,cd=S.actCd||{},ss=S.actSeason||{};
 if(a.season&&ss[a.id]===S.season)return {ok:false,why:'Ya la has pedido esta temporada.',lbl:'Próxima temporada'};
 if(cd[a.id]>wk){var w=cd[a.id]-wk;return {ok:false,why:'Disponible dentro de '+w+' semana'+(w>1?'s':'')+'.',lbl:'En '+w+' sem.'};}
 var c=a.cond&&a.cond();if(c)return {ok:false,why:c,lbl:'No disponible'};
 if(S.money<a.cost)return {ok:false,why:'Te faltan '+fmt(a.cost-S.money)+'.',lbl:fmt(a.cost)};
 if(S.acts<=0)return {ok:false,why:'Ya has usado tus 2 acciones de esta semana.',lbl:'Sin agenda'};
 return {ok:true,lbl:a.cost?'Hacer · '+fmt(a.cost):'Hacer'};
}
/* las acciones repetidas rinden menos: cada uso en las últimas 10 semanas resta un 30 % */
function actFactor(a){if(!a.dim)return 1;var u=(S.actUse||{})[a.id]||[],wk=S.wk||0,n=u.filter(function(x){return wk-x<10;}).length;return Math.max(0.25,1-0.3*n);}
function doAct(id){
 var a=byId(ACTS,id),st=actState(a);
 if(!st.ok){toast(st.why,1);return;}
 var f=actFactor(a);
 S.money-=a.cost;S.acts--;
 S.actCd=S.actCd||{};S.actSeason=S.actSeason||{};S.actUse=S.actUse||{};
 if(a.cd)S.actCd[id]=(S.wk||0)+a.cd;
 if(a.season)S.actSeason[id]=S.season;
 (S.actUse[id]=S.actUse[id]||[]).push(S.wk||0);if(S.actUse[id].length>6)S.actUse[id].shift();
 var m=a.run(f);logm(m);toast(m);save();render();
}
/* ---------- tienda e inversiones ---------- */
function buy(id){var it=byId(SHOP,id),l=itemLvl(id);if(l>=3)return;var c=it.c[l];if(S.money<c){toast('Te faltan '+fmt(c-S.money)+'.',1);return;}S.money-=c;S.items[id]=l+1;logm('Contratas: '+it.n+' (nivel '+(l+1)+').');save();render();}
function invest(id){bizBuy(id);}
function fundIn(f){var m=Math.round(S.money*f);if(m<1000){toast('No tienes dinero para aportar.',1);return;}S.money-=m;S.fund+=m;save();render();}
function fundOut(){if(S.fund<=0)return;S.money+=S.fund;S.fund=0;save();render();}
