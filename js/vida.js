/* Estrella del Balón · Vida y Negocios.
   Vida: Equipo (entrenador, vestuario y directiva), Redes y publicidad, y Representante.
   Negocios: resumen, patrocinios y empresas.
   Aquí van también las reuniones con la directiva, la petición de traspaso y la ventana de negociación de contratos. */

/* ---------- contrato con bonus ----------
   gb: bonus por gol · ab: bonus por asistencia · apb: bonus por partido jugado · so: % de tu próxima venta */
function ctr(){var c=S.contract;if(!c)c=S.contract={wage:0,years:2};if(c.gb==null){c.gb=0;c.ab=0;c.apb=0;c.so=0;}return c;}
var NEGF=[
 {k:'wage',n:'Salario semanal',lvl:1,money:1},
 {k:'years',n:'Años de contrato',lvl:1},
 {k:'prima',n:'Prima de fichaje',lvl:2,money:1},
 {k:'apb',n:'Bonus por partido jugado',lvl:2,money:1},
 {k:'gb',n:'Bonus por gol',lvl:3,money:1},
 {k:'ab',n:'Bonus por asistencia',lvl:3,money:1},
 {k:'so',n:'% de tu próxima venta',lvl:4}
];
/* lo que espera la directiva de ti en una temporada: goles, asistencias y partidos */
function expStats(){
 var h=S.hist[S.hist.length-1],P=POSD[S.pos]||{sg:.1,sa:.1};
 if(h&&h.apps>=8)return {g:Math.max(0.5,h.g*30/h.apps),a:Math.max(0.5,h.a*30/h.apps),pj:Math.min(34,h.apps)};
 return {g:Math.max(0.3,P.sg*30),a:Math.max(0.3,P.sa*24),pj:22};
}
function transferFee(){return mvRound(mv(S.pl[S.me])*clamp(0.55+0.18*ctr().years,0.55,1.3));}
/* lo que le cuesta al club un contrato, por temporada */
function negValue(t){var e=expStats();return t.wage*40+t.prima/Math.max(1,t.years)+t.gb*e.g+t.ab*e.a+t.apb*e.pj+t.so/100*transferFee()*0.3;}
function negStep(k,b){
 if(k==='wage')return Math.max(100,Math.round(b.wage*0.05/100)*100);
 if(k==='prima')return Math.max(1000,Math.round(Math.max(b.prima,b.wage*4)*0.15/1000)*1000);
 if(k==='gb')return Math.max(100,Math.round(b.wage*0.1/100)*100);
 if(k==='ab')return Math.max(100,Math.round(b.wage*0.06/100)*100);
 if(k==='apb')return Math.max(100,Math.round(b.wage*0.04/100)*100);
 if(k==='so')return 5;return 1;
}
function negOpen(kind,i){
 var me=S.pl[S.me],c,base,agl=agentLvl(),ov=overall();
 if(kind==='fich'){
  var o=S.offers[i];if(!o)return;
  if(!windowOpen()){toast('El mercado está cerrado. Abre al inicio de temporada y en enero.',1);return;}
  c=S.clubs[o.club];base={wage:o.wage,years:o.years,prima:Math.round(o.bonus/1000)*1000,gb:0,ab:0,apb:0,so:0};
 }else if(kind==='libre'){
  var x=S.pre&&S.pre.clubs[i];if(!x||!x.offer)return;
  c=S.clubs[x.id];base={wage:x.offer.wage,years:x.offer.years,prima:x.offer.bonus,gb:0,ab:0,apb:0,so:0};
 }else{
  c=S.clubs[me.c];var k=ctr(),mk=wageFor(c.str,ov);
  base={wage:Math.max(k.wage,Math.round(Math.max(k.wage*1.03,mk)/100)*100),years:Math.max(2,k.years+1),prima:Math.round(mk*2/1000)*1000,gb:k.gb,ab:k.ab,apb:k.apb,so:k.so};
 }
 var tol=0.04+0.05*agl+(S.rel.board-50)/300+clamp((ov-c.str)/50,-0.1,0.2)+(kind==='ren'&&S.rel.board>=65?0.03:0)+(kind==='libre'?0.05:0);
 S.neg={k:kind,club:c.id,oi:kind==='ren'?-1:i,base:base,cur:JSON.parse(JSON.stringify(base)),ask:JSON.parse(JSON.stringify(base)),tol:Math.max(0.03,tol),pat:1+agl,pat0:1+agl,msg:kind!=='ren'?c.n+' te presenta su oferta.':'La directiva te presenta su propuesta de renovación.',hist:[]};
 save();render();
}
function negShow(f){return agentLvl()>=f.lvl;}
function negAdj(k,d){
 var N=S.neg;if(!N)return;var f=NEGF.filter(function(x){return x.k===k;})[0];if(!f||!negShow(f))return;
 var v=N.ask[k]+d*negStep(k,N.base);
 if(k==='years')v=clamp(v,1,5);else if(k==='so')v=clamp(v,0,30);else v=Math.max(0,v);
 if(k==='wage')v=Math.max(Math.round(N.base.wage*0.8/100)*100,v);
 N.ask[k]=v;render();
}
function negRatio(t){var N=S.neg;return negValue(t)/negValue(N.base);}
function negPropose(){
 var N=S.neg;if(!N)return;var r=negRatio(N.ask),lim=1+N.tol;
 if(r<=lim+1e-9){N.hist.push('Aceptan tu propuesta.');negSign(N.ask);return;}
 var over=r-lim;N.pat-=over>0.35?2:1;
 if(N.pat<=0){negBreak();return;}
 /* contraoferta: se acercan a tu petición hasta su límite */
 var vb=negValue(N.base),va=negValue(N.ask),tgt=vb*(1+N.tol*0.92),s=clamp((tgt-vb)/Math.max(1,va-vb),0,1);
 var cur={};Object.keys(N.base).forEach(function(k){var x=N.base[k]+(N.ask[k]-N.base[k])*s;cur[k]=k==='years'?N.ask.years:k==='so'?Math.round(x):Math.round(x/100)*100;});
 N.cur=cur;
 N.msg=over>0.35?'Tu petición les parece desorbitada. Se enfadan, pero te hacen una contraoferta.':over>0.12?'Les parece demasiado. Te hacen una contraoferta.':'Están cerca. Te hacen una contraoferta.';
 N.hist.push(N.msg);save();render();
}
function negAcceptCur(){var N=S.neg;if(!N)return;negSign(N.cur);}
function negBreak(){
 var N=S.neg,c=S.clubs[N.club];S.neg=null;
 if(N.k==='libre'){var x=S.pre&&S.pre.clubs[N.oi];if(x){x.offer=null;x.st='roto';S.pre.log.unshift(c.n+' rompe la negociación.');}toast(c.n+' se retira de la negociación',1);}
 else if(N.k==='fich'){S.offers.splice(N.oi,1);logm(c.n+' rompe la negociación: tus exigencias son demasiado altas.');toast(c.n+' se retira de la negociación',1);}
 else{rel('board',-5);logm('La directiva rompe la negociación de tu renovación.');toast('La directiva rompe la negociación',1);}
 save();render();
}
function negQuit(){var N=S.neg;if(!N)return;S.neg=null;if(N.k==='ren')rel('board',-1);save();render();}
function negSign(t){
 var N=S.neg;S.neg=null;var c=S.clubs[N.club];
 var terms={wage:t.wage,years:t.years,gb:t.gb,ab:t.ab,apb:t.apb,so:t.so};
 if(N.k==='fich'){accept(N.oi,terms,t.prima);return;}
 if(N.k==='libre'){freeSign(N.oi,terms,t.prima);return;}
 S.contract=terms;S.money+=t.prima;S.renewDue=0;S.negSeason=S.season;rel('board',2);
 logm('Renuevas con '+c.n+': '+fmt(t.wage)+'/semana, '+t.years+' año(s)'+(t.prima?', prima de '+fmt(t.prima):'')+bonusTxt(terms)+'.');
 toast('Renovación firmada');save();render();
}
function bonusTxt(t){var p=[];if(t.gb)p.push(fmt(t.gb)+' por gol');if(t.ab)p.push(fmt(t.ab)+' por asistencia');if(t.apb)p.push(fmt(t.apb)+' por partido');if(t.so)p.push(t.so+'% de tu próxima venta');return p.length?' · '+p.join(', '):'';}
/* bonus del contrato en un partido de club */
function contractBonus(mins,g,a){var k=ctr();if(mins<=0)return 0;return g*k.gb+a*k.ab+k.apb;}

/* ventana de negociación */
function negHTML(){
 var N=S.neg;if(!N)return '';var c=S.clubs[N.club],agl=agentLvl(),r=negRatio(N.ask),lim=1+N.tol;
 var h='<div class="modal" role="dialog" aria-modal="true" aria-label="Negociación de contrato"><div class="card neg"><div class="rowb"><h2 style="margin:0;display:flex;align-items:center;gap:10px">'+crestSVG(c,32)+(N.k==='fich'?'Fichaje · ':N.k==='libre'?'Jugador libre · ':'Renovación · ')+esc(c.n)+'</h2></div>'+
  '<p class="small mut">Negocia '+esc(agent().n)+' (nivel '+agl+'). '+(agl<5?'Un representante mejor ve más cláusulas y la directiva le tolera más exigencias.':'Ves todas las cláusulas y el límite exacto de la directiva.')+'</p>'+
  '<p class="negmsg">'+esc(N.msg)+'</p>';
 h+='<div class="negrows"><div class="negrow neghead"><span>Cláusula · oferta del club</span><span>Tu petición</span></div>';
 NEGF.forEach(function(f){var sh=negShow(f),fm=function(v){return f.money?fmt(v):f.k==='so'?v+'%':v+(v===1?' año':' años');};
  if(!sh){h+='<div class="negrow mut"><div class="negl"><b>'+f.n+'</b><span class="small">Tu representante no llega a negociar esto (nivel '+f.lvl+')</span></div></div>';return;}
  var ch=N.ask[f.k]!==N.cur[f.k];
  h+='<div class="negrow"><div class="negl"><b>'+f.n+'</b><span class="small mut">Club: <span class="num">'+fm(N.cur[f.k])+'</span></span></div><div class="negadj"><button class="chip" data-a="negadj" data-id="'+f.k+'" data-n="-1" aria-label="Bajar '+f.n+'">−</button><b class="num'+(ch?' star':'')+'">'+fm(N.ask[f.k])+'</b><button class="chip" data-a="negadj" data-id="'+f.k+'" data-n="1" aria-label="Subir '+f.n+'">+</button></div></div>';});
 h+='</div>';
 /* lo que ve tu representante */
 var pct=Math.round((r-1)*100),pl=N.pat/N.pat0;
 h+='<div class="kv" style="margin-top:8px"><div><b class="num '+(r<=lim?'good':'bad')+'">'+(pct>=0?'+':'')+pct+'%</b><span>Coste de tu petición frente a su oferta</span></div>';
 if(agl>=5)h+='<div><b class="num">+'+Math.round(N.tol*100)+'%</b><span>Límite de la directiva</span></div>';
 else if(agl>=4)h+='<div><b class="num">+'+Math.max(0,Math.round(N.tol*100)-3)+'–'+(Math.round(N.tol*100)+3)+'%</b><span>Límite aproximado</span></div>';
 else if(agl>=2)h+='<div><b class="num">'+(r<=lim?'Asumible':r<=lim+0.12?'Al límite':'Excesivo')+'</b><span>Lo que intuye tu representante</span></div>';
 h+=(agl>=3?'<div><b class="num '+(pl>0.6?'good':pl>0.3?'':'bad')+'">'+N.pat+' / '+N.pat0+'</b><span>Paciencia de la directiva</span></div>':'<div><b class="num">?</b><span>Paciencia de la directiva</span></div>')+'</div>';
 if(N.k==='fich'){h+='<p class="small mut">Traspaso estimado: '+fmv(transferFee())+(ctr().so?' · cobrarías tu '+ctr().so+'%: '+fmt(transferFee()*ctr().so/100):'')+'.</p>';}
 h+='<div class="btns" style="margin-top:10px"><button class="go" data-a="negprop">Proponer</button><button class="go alt" data-a="negacc">Aceptar la oferta del club</button><button class="go alt full" data-a="negquit">Levantarte de la mesa</button></div></div></div>';
 return h;
}

/* ---------- jugador libre: se acaba el contrato sin renovar ---------- */
function freeOffer(c,f){var w=Math.max(300,Math.round(wageFor(c.str,overall())*f*(0.92+Math.random()*0.16)/100)*100);
 return {wage:w,years:1+Math.floor(Math.random()*3)+(S.age<=28?1:0),bonus:Math.round(w*(6+2*agentLvl())/1000)*1000};}
/* clubes que se pueden interesar: según tu valoración y el alcance de tu representante */
function freePool(P){
 var me=S.pl[S.me],ov=overall(),lvl=agentLvl(),old=P&&P.old!=null?S.clubs[P.old]:null,co=old?old.co:S.startCo,can=S.cantera!=null?S.clubs[S.cantera].co:co,have={};
 (P&&P.clubs||[]).forEach(function(x){have[x.id]=1;});
 var okCo=function(c){return lvl>=3||c===co||(lvl>=2&&(c===can||c===me.nat));};
 var c=S.clubs.filter(function(x){return !x.guest&&!have[x.id]&&okCo(x.co)&&x.str<=ov+2+2*lvl&&x.str>=ov-14;});
 return shuffle(c).sort(function(a,b){return (b.str+Math.random()*8)-(a.str+Math.random()*8);});
}
function freeStart(){
 if(!S.freePending||S.retired)return;S.freePending=0;
 var me=S.pl[S.me],old=S.clubs[me.c];
 if(old){var j=old.ros.indexOf(S.me);if(j>=0)old.ros.splice(j,1);}
 me.c=-1;S.offers=[];S.listed=0;S.bm=null;S.neg=null;S.bobj=null;S.renewDue=0;S.match=null;S.press=null;
 var P={free:1,wk:1,weeks:3,used:false,co:old?old.co:S.startCo,old:old?old.id:null,clubs:[],log:[]};
 var pool=freePool(P),ov=overall(),lvl=agentLvl();
 var dir=pool.filter(function(x){return x.str<=ov-1;}).slice(0,1+lvl),tri=pool.filter(function(x){return x.str>ov-1&&dir.indexOf(x)<0;}).slice(0,2+Math.floor(lvl/2));
 if(old&&S.rel.board>=35)P.clubs.push({id:old.id,st:'directa',offer:freeOffer(old,S.rel.board>=60?1:0.9)});
 dir.forEach(function(x){if(old&&x.id===old.id)return;P.clubs.push({id:x.id,st:'directa',offer:freeOffer(x,1)});});
 tri.forEach(function(x){if(old&&x.id===old.id)return;P.clubs.push({id:x.id,st:'prueba'});});
 if(!P.clubs.some(function(x){return x.offer;})){S.pre=P;freeFallback();}
 S.pre=P;
 logm('Eres jugador libre. '+P.clubs.filter(function(x){return x.offer;}).length+' club(es) te ofrecen contrato.');
}
/* si no queda ninguna oferta, siempre hay un club modesto que te ficha */
function freeFallback(){
 var P=S.pre,lgs=S.lgs.filter(function(l){return l.co===P.co;}).sort(function(a,b){return b.t-a.t;}),have={};P.clubs.forEach(function(x){have[x.id]=1;});
 var id=shuffle(lgs[0].clubs.filter(function(i){return !have[i];}))[0];if(id==null)id=lgs[0].clubs[0];
 var x={id:id,st:'directa',offer:freeOffer(S.clubs[id],0.85)};P.clubs.push(x);P.log.unshift(S.clubs[id].n+' te ofrece un contrato para no quedarte en el paro.');return x;
}
function freeSign(i,terms,prima){
 var P=S.pre,x=P&&P.clubs[i];if(!x||!x.offer)return;var o=x.offer,c=S.clubs[x.id],me=S.pl[S.me];
 me.c=c.id;c.ros.push(S.me);
 S.contract=terms||{wage:o.wage,years:o.years,gb:0,ab:0,apb:0,so:0};
 var pr=prima!=null?prima:o.bonus;S.money+=pr;
 var back=c.id===P.old;
 S.rel.coach=back?S.rel.coach:50;S.rel.team=back?S.rel.team:45;S.rel.board=back?Math.max(45,S.rel.board):50;S.rel.fans=c.id===S.cantera?75:back?S.rel.fans:45;
 S.pre=null;S.neg=null;
 logm((back?'Vuelves a firmar con ':'Fichas como jugador libre por ')+c.n+' ('+lgName(c)+'): '+fmt(S.contract.wage)+' por semana, '+S.contract.years+' año(s), prima de '+fmt(pr)+bonusTxt(S.contract)+'.');
 toast('Firmas con '+c.n);if(typeof s3dQueue==='function'){var kc=clubColors(c);s3dQueue('fichaje',{kit:kc.a,kit2:kc.b,num:S.look&&S.look.num,n:c.n},'Presentación con el '+c.n);}genOffers();S.tab='home';save();render();
}

/* ---------- directiva: reuniones cada pocas semanas ---------- */
function atkPos(){return ['DC','SD','EI','ED','MP'].indexOf(S.pos)>=0;}
var BM={
 obj:{t:'Reunión de objetivos de temporada',d:function(){var o=S.bm.o;return 'La directiva te propone un objetivo para esta temporada. Ambicioso: '+o.amb+' '+o.lbl+'. Moderado: '+o.mod+' '+o.lbl+'.';},
  o:[{n:'Objetivo ambicioso',f:function(){var o=S.bm.o;S.bobj={s:S.season,k:o.k,lbl:o.lbl,tgt:o.amb,cash:Math.round(ctr().wage*8),r:8};return 'Te comprometes a '+o.amb+' '+o.lbl+'. Si lo cumples, prima de '+fmt(S.bobj.cash)+'.';}},
     {n:'Objetivo moderado',f:function(){var o=S.bm.o;S.bobj={s:S.season,k:o.k,lbl:o.lbl,tgt:o.mod,cash:Math.round(ctr().wage*3),r:3};return 'Te comprometes a '+o.mod+' '+o.lbl+'. Prima de '+fmt(S.bobj.cash)+' si lo cumples.';}},
     {n:'No me comprometo a nada',f:function(){rel('board',-2);return 'A la directiva no le gusta tu falta de compromiso.';}}]},
 ren:{t:'La directiva quiere renovarte',d:function(){return 'Te queda '+ctr().years+' año de contrato y quieren sentarse a negociar.';},
  o:[{n:'Sentarte a negociar',f:function(){S.bm=null;negOpen('ren');return null;}},
     {n:'Esperar a final de temporada',f:function(){rel('board',-1);S.renewDue=0;return 'Prefieres esperar. Si no renuevas, al final de la temporada quedarás libre.';}},
     {n:'Decir que quieres salir',f:function(){rel('board',-6);S.listed=S.season;S.renewDue=0;return 'La directiva te pone en el mercado.';}}]},
 perf:{t:'La directiva está preocupada',d:function(){return 'Tu rendimiento de las últimas semanas no convence en los despachos.';},
  o:[{n:'Prometer que vas a mejorar',f:function(){rel('board',2);moral(-2);return 'Te dan un voto de confianza.';}},
     {n:'Pedir paciencia (habla tu representante)',f:function(){if(Math.random()<0.3+0.1*agentLvl()){rel('board',3);return agent().n+' los convence: tienes tiempo.';}rel('board',-3);return 'No se quedan tranquilos.';}},
     {n:'Culpar al sistema del míster',f:function(){rel('coach',-7);rel('board',1);rel('team',-2);return 'La directiva toma nota, pero el míster se entera.';}}]},
 sell:{t:'Un grande pregunta por ti',d:function(){return 'Ha llegado una oferta seria al club y la directiva quiere saber qué piensas.';},
  o:[{n:'Quiero irme',f:function(){rel('board',-2);S.listed=S.season;bigOffer();return 'La directiva escucha ofertas. Mira la nueva en Carrera › Club.';}},
     {n:'Me quedo aquí',f:function(){rel('board',5);rel('fans',4);var k=ctr();k.wage=Math.round(k.wage*1.06/100)*100;return 'La afición te adora y la directiva te sube el sueldo un 6%.';}},
     {n:'Que decida el club',f:function(){if(Math.random()<0.5){bigOffer();S.listed=S.season;return 'El club decide escuchar ofertas.';}rel('board',2);return 'El club decide que no te vende.';}}]},
 proj:{t:'Reunión sobre el proyecto del club',d:function(){return 'El presidente quiere conocer tu opinión sobre el equipo.';},
  o:[{n:'Pedir fichajes de nivel',f:function(){var c=myClub();if(S.rel.board>=60&&Math.random()<0.5){c.str=Math.min(95,c.str+1);return 'Te hacen caso: el club se refuerza (+1 de fuerza).';}rel('board',-1);return 'Dicen que no hay dinero.';}},
     {n:'Apoyar al entrenador',f:function(){rel('coach',3);rel('board',1);return 'El míster agradece tu respaldo.';}},
     {n:'Preguntar por tu papel',f:function(){moral(3);return 'Te dicen que eres importante para el proyecto.';}}]}
};
function bmObjective(){var e=expStats(),atk=atkPos();
 if(atk){var v=e.g+e.a;return {k:'ga',lbl:'goles + asistencias en liga',amb:Math.max(3,Math.round(v*1.25)),mod:Math.max(2,Math.round(v*0.85))};}
 return {k:'pj',lbl:'partidos de liga',amb:Math.min(30,Math.max(10,Math.round(e.pj*1.15))),mod:Math.min(24,Math.max(6,Math.round(e.pj*0.85)))};
}
function newBoardMeeting(force){
 var me=S.pl[S.me],c=S.clubs[me.c];if(!c||c.guest)return;var k=null;
 var f=S.form||[],fa=f.length?f.reduce(function(s,x){return s+x;},0)/f.length:6.5;
 if(!S.bobj||S.bobj.s!==S.season){if(S.slot<=12&&!(S.bmObj===S.season)){k='obj';S.bmObj=S.season;}}
 if(!k&&S.renewDue&&S.negSeason!==S.season)k='ren';
 if(!k&&f.length>=4&&fa<5.9)k='perf';
 if(!k&&overall()>c.str+6&&!S.listed&&Math.random()<0.5)k='sell';
 if(!k&&(force||Math.random()<0.6))k='proj';
 if(!k)return;
 S.bm={k:k};if(k==='obj')S.bm.o=bmObjective();
 logm('Reunión con la directiva: '+BM[k].t.toLowerCase()+'.');
}
function boardAns(i){
 var b=S.bm;if(!b)return;var o=BM[b.k].o[i];if(!o)return;
 var m=o.f();if(S.bm===b)S.bm=null;
 if(m){logm(m);toast(m);}
 save();render();
}
function boardWeekly(){
 if(S.bm||S.pre)return;
 if(S.bmNext==null)S.bmNext=(S.wk||0)+3;
 if((S.wk||0)>=S.bmNext){newBoardMeeting();S.bmNext=(S.wk||0)+6+Math.floor(Math.random()*4);}
}
/* evaluación del objetivo al cerrar la temporada */
function boardSeason(sm){
 var o=S.bobj;if(!o||o.s!==S.season)return;
 var v=o.k==='ga'?S.ss.g+S.ss.a:S.ss.pj,ok=v>=o.tgt;
 if(ok){S.money+=o.cash;rel('board',o.r);sm.obj='Objetivo cumplido: '+v+'/'+o.tgt+' '+o.lbl+'. Cobras '+fmt(o.cash)+'.';}
 else{rel('board',-o.r);sm.obj='Objetivo no cumplido: '+v+'/'+o.tgt+' '+o.lbl+'. La directiva está decepcionada.';}
 logm(sm.obj);S.bobj=null;
}
/* oferta grande de un club más fuerte */
function bigOffer(){
 var me=S.pl[S.me],cur=S.clubs[me.c],ov=overall();
 var c=S.clubs.filter(function(x){return !x.guest&&x.id!==cur.id&&x.str>cur.str+3&&x.str<=ov+8;}).sort(function(a,b){return b.str-a.str;}).slice(0,4);
 if(!c.length)return;var x=pick(c),w=wageFor(x.str,ov);
 S.offers.unshift({club:x.id,wage:w,years:2+Math.floor(Math.random()*3),bonus:Math.round(w*5)});
 logm(x.n+' presenta una oferta por ti.');
}

/* ---------- petición de traspaso ---------- */
function transferReqState(){
 if(S.listed)return {ok:false,why:'Ya estás en el mercado.'};
 if(S.treq===S.season)return {ok:false,why:'Ya lo has pedido esta temporada.'};
 return {ok:true};
}
function transferReq(force){
 var me=S.pl[S.me],c=S.clubs[me.c],st=transferReqState();
 if(!force&&!st.ok){toast(st.why,1);return;}
 var key=Math.max(0,overall()-c.str),p=clamp(0.35+0.1*(agentLvl()-1)-key/30+(ctr().years<=1?0.25:0)+(S.rel.board<40?0.1:0),0.1,0.95);
 if(force)p=0.65;
 S.treq=S.season;
 if(Math.random()<p){S.listed=S.season;rel('board',force?-10:-3);rel('coach',-2);if(force){rel('team',-6);rel('fans',-8);}
  if(windowOpen())genOffers();
  var m='La directiva acepta tu petición: estás en el mercado. Tu representante recibirá más ofertas.';logm(m);toast(m);}
 else{rel('board',force?-8:-5);moral(-3);S.treqNo=S.season;var m2=force?'Ni forzando la salida te dejan ir. El club se cierra en banda.':'La directiva rechaza tu petición de traspaso.';logm(m2);toast(m2,1);}
 save();render();
}
function transferForce(){if(S.treqNo!==S.season||S.listed){toast('Solo si la directiva te ha dicho que no.',1);return;}S.treqNo=-1;transferReq(true);}
function transferWithdraw(){if(!S.listed)return;S.listed=0;rel('board',3);rel('fans',2);logm('Retiras tu petición de traspaso. La afición lo celebra.');save();render();}

/* ---------- publicidad: campañas puntuales ---------- */
var ADS=[
 {n:'Anuncio de televisión de una bebida isotónica',f:1,en:12,pr:2},{n:'Campaña de una marca de relojes',f:1.4,en:6,pr:1},
 {n:'Portada de una revista de moda',f:0.8,en:5,pr:3,fol:.02},{n:'Videojuego: sale tu cara en la portada',f:2,en:4,pr:2,fol:.04,min:200000},
 {n:'Anuncio de una cadena de comida rápida',f:1.5,en:5,pr:-1,fans:1},{n:'Spot de una campaña solidaria',f:0.3,en:6,pr:4,fans:4},
 {n:'Gira de promoción por Asia',f:2.5,en:25,pr:1,fol:.05,min:500000}
];
function adPay(a){return Math.round(Math.max(5000,S.fol*0.05)*a.f*(0.8+0.1*agentLvl())/100)*100;}
function adsMonth(){
 S.ads=(S.ads||[]).filter(function(x){return x.exp>(S.wk||0);});
 var ok=ADS.map(function(a,i){return i;}).filter(function(i){return S.fol>=(ADS[i].min||2000)&&!S.ads.some(function(x){return x.i===i;});});
 if(ok.length&&S.ads.length<3&&Math.random()<0.35+0.08*agentLvl()){var i=pick(ok);S.ads.push({i:i,pay:adPay(ADS[i]),exp:(S.wk||0)+5});logm('Te proponen una campaña de publicidad: '+ADS[i].n.toLowerCase()+'.');}
}
function adDo(j,yes){
 var x=(S.ads||[])[j];if(!x)return;var a=ADS[x.i];S.ads.splice(j,1);
 if(!yes){save();render();return;}
 S.money+=x.pay;S.energy=Math.max(0,S.energy-a.en);if(a.pr)rel('press',a.pr);if(a.fans)rel('fans',a.fans);if(a.fol)S.fol=Math.round(S.fol*(1+a.fol));
 var m='Haces la campaña ('+a.n.toLowerCase()+'): cobras '+fmt(x.pay)+'.';logm(m);toast(m);save();render();
}

/* ---------- negocios: empresas con niveles, gestor y resultados mensuales ---------- */
var BIZ=[
 {id:'piso',n:'Piso de alquiler',c:150000,w:1200,r:.05},{id:'cafe',n:'Cafetería',c:450000,w:3800,r:.12},{id:'rest',n:'Restaurante',c:700000,w:6000,r:.15},
 {id:'padel',n:'Club de pádel',c:900000,w:8200,r:.12},{id:'gym',n:'Gimnasio',c:1200000,w:11000,r:.12},{id:'franq',n:'Franquicia de comida rápida',c:1500000,w:14000,r:.18},
 {id:'disco',n:'Discoteca',c:1800000,w:19000,r:.35,img:1},{id:'ropa',n:'Marca de ropa propia',c:2200000,w:20000,r:.25,fol:1},{id:'app',n:'Startup tecnológica',c:2500000,w:14000,r:.6,su:1},
 {id:'esp',n:'Equipo de eSports',c:3000000,w:26000,r:.35,fol:1},{id:'acad',n:'Escuela de fútbol',c:3500000,w:34000,r:.08,fans:1},{id:'bod',n:'Bodega de vino',c:4000000,w:36000,r:.12},
 {id:'conc',n:'Concesionario de coches',c:5000000,w:46000,r:.2},{id:'inmo',n:'Inmobiliaria',c:6000000,w:60000,r:.15},{id:'hotel',n:'Hotel boutique',c:10000000,w:110000,r:.15},
 {id:'clubm',n:'Club de fútbol modesto',c:25000000,w:200000,r:.35,fans:1}
];
var BIZM=[0,1,2.1,3.4];
function bizMig(){
 if(S.biz)return S.biz;S.biz={};
 Object.keys(S.invest||{}).forEach(function(id){var b=byId(BIZ,id);if(b&&S.invest[id])S.biz[id]={lvl:1,inv:b.c,f:1,val:b.c,mg:0};});
 return S.biz;
}
function bizUpCost(b,x){return Math.round(b.c*(x.lvl===1?0.9:1.4)/1000)*1000;}
function bizMgCost(b,x){return Math.round(b.w*BIZM[x.lvl]*0.12/100)*100;}
function bizWeek(id){var b=byId(BIZ,id),x=bizMig()[id];if(!b||!x)return 0;return Math.round(b.w*BIZM[x.lvl]*x.f*(x.mg?1.1:1)-(x.mg?bizMgCost(b,x):0));}
function bizIncome(){var s=0;Object.keys(bizMig()).forEach(function(id){s+=bizWeek(id);});return s;}
function bizBuy(id){var b=byId(BIZ,id),B=bizMig();if(!b||B[id])return;if(S.money<b.c){toast('Te faltan '+fmt(b.c-S.money)+'.',1);return;}
 S.money-=b.c;B[id]={lvl:1,inv:b.c,f:1,val:b.c,mg:0};S.invest[id]=1;logm('Abres un negocio: '+b.n+'.');toast('Nuevo negocio: '+b.n);save();render();}
function bizUp(id){var b=byId(BIZ,id),x=bizMig()[id];if(!x||x.lvl>=3)return;var c=bizUpCost(b,x);if(S.money<c){toast('Te faltan '+fmt(c-S.money)+'.',1);return;}
 S.money-=c;x.lvl++;x.inv+=c;x.val+=c;logm('Amplías '+b.n+' a nivel '+x.lvl+'.');toast(b.n+': nivel '+x.lvl);save();render();}
function bizMg(id){var b=byId(BIZ,id),x=bizMig()[id];if(!x)return;x.mg=x.mg?0:1;logm(x.mg?'Contratas un gestor para '+b.n+'.':'Prescindes del gestor de '+b.n+'.');save();render();}
function bizSale(x){return Math.round(x.val*0.8/1000)*1000;}
function bizSell(id){var b=byId(BIZ,id),B=bizMig(),x=B[id];if(!x)return;var p=bizSale(x);S.money+=p;delete B[id];delete S.invest[id];
 logm('Vendes '+b.n+' por '+fmt(p)+' (invertiste '+fmt(x.inv)+').');toast('Vendes '+b.n+' por '+fmt(p));save();render();}
/* cada mes: el negocio va mejor o peor y a veces pasa algo */
function bizMonth(){
 var B=bizMig();S.bizLog=S.bizLog||[];
 Object.keys(B).forEach(function(id){var b=byId(BIZ,id),x=B[id];if(!b)return;var r=b.r*(x.mg?0.5:1);
  x.f=clamp(1+norm()*r,0.15,2.2);x.val=Math.max(b.c*0.2,Math.round(x.val*(1+(x.f-1)*0.06+0.002)));
  var ev=null,u=Math.random();
  if(b.su&&u<0.03){x.val*=4;ev='Una gran empresa quiere comprar tu startup: su valor se multiplica por 4.';}
  else if(b.su&&u<0.06){x.val=Math.round(x.val*0.25);x.f=0.2;ev='Tu startup se queda sin financiación y se hunde.';}
  else if(b.img&&u<0.05+(x.mg?0:0.04)){rel('press',-4);x.f*=0.6;ev='Una pelea en tu discoteca sale en las noticias.';}
  else if(u<0.03){x.f*=0.5;ev='Inspección en '+b.n.toLowerCase()+': mes flojo y una multa.';S.money-=Math.round(b.w*2);}
  else if(u>0.97){x.f*=1.5;ev='Mes récord en '+b.n.toLowerCase()+'.';}
  if(b.fol&&x.f>1)S.fol=Math.round(S.fol*1.004);
  if(b.fans&&x.f>1)rel('fans',0.5);
  if(ev){logm(ev);S.bizLog.unshift({t:'T'+S.season+' · '+MONTHS[slotMonth(S.slot)].slice(0,3),m:ev});}
 });
 if(S.bizLog.length>12)S.bizLog.length=12;
 adsMonth();
}

/* ---------- vistas de Vida ---------- */
function relRow(k){var v=Math.round(S.rel[k]);return '<div class="item" style="grid-template-columns:1fr"><div><div class="rowb"><b class="tname">'+icoRel(k)+REL_INFO[k][0]+'</b><span class="num '+(v>=65?'good':v<35?'bad':'')+'">'+v+'</span></div><div class="bar big '+(v<35?'low':'en')+'"><i style="width:'+v+'%"></i></div><p>'+REL_INFO[k][1]+'</p></div></div>';}
function moralRow(){return '<div class="item" style="grid-template-columns:1fr"><div><div class="rowb"><b>Moral</b><span class="num">'+S.moral+'</span></div><div class="bar big '+(S.moral<35?'low':'en')+'"><i style="width:'+S.moral+'%"></i></div><p>Sube con buenos partidos y ruedas de prensa con confianza. Mejora tu nota, tus duelos y la fuerza de tu equipo.</p></div></div>';}
function actsCard(ws,title){
 var h='<div class="card"><div class="rowb"><h3 style="margin:0">'+title+'</h3><span class="small mut">Te quedan <b class="num">'+S.acts+'</b> acciones esta semana</span></div>';
 ACTS.filter(function(a){return ws.indexOf(a.w)>=0;}).forEach(function(a){var st=actState(a),f=actFactor(a),lim=a.season?'1 vez por temporada':a.cd>1?'cada '+a.cd+' semanas':'cada semana';
  h+='<div class="item"><div><b class="tname">'+icoAcc(a.id)+a.n+'</b><p>'+REL_INFO[a.w][0]+' · '+a.d+'</p><p class="small">'+lim+(f<1?' · <span class="warn">ahora rinde al '+Math.round(f*100)+' %</span>':'')+(st.ok?'':' · <span class="bad">'+st.why+'</span>')+'</p></div><button class="go alt '+(st.ok?'':'dis')+'" data-a="act" data-id="'+a.id+'">'+st.lbl+'</button></div>';});
 return h+'</div>';
}
function eventCard(){if(!S.event)return '';var ev=EVENTS[S.event.i];return '<div class="card" style="border-color:var(--gold)"><h3>'+ev.t+'</h3><p style="margin:0 0 10px">'+ev.d+'</p><div class="btns">'+ev.o.map(function(o,i){return '<button class="go'+(i?' alt':'')+'" data-a="ev" data-i="'+i+'">'+o.n+'</button>';}).join('')+'</div></div>';}
function boardCard(){if(!S.bm)return '';var B=BM[S.bm.k];return '<div class="card" style="border-color:var(--gold)"><span class="badge">DIRECTIVA</span><h3 style="margin-top:6px">'+B.t+'</h3><p style="margin:0 0 10px">'+B.d()+'</p><div class="btns">'+B.o.map(function(o,i){return '<button class="go'+(i?' alt':'')+'" data-a="bm" data-i="'+i+'">'+o.n+'</button>';}).join('')+'</div></div>';}
function contractCard(){
 var k=ctr(),c=myClub(),st=transferReqState(),o=S.bobj&&S.bobj.s===S.season?S.bobj:null;
 var h='<div class="card"><h3>Tu contrato y la directiva</h3><div class="kv"><div><b class="num good">'+fmt(k.wage)+'</b><span>Salario semanal</span></div><div><b class="num">'+k.years+'</b><span>Años</span></div><div><b class="num">'+fmt(k.gb)+'</b><span>Por gol</span></div><div><b class="num">'+fmt(k.ab)+'</b><span>Por asistencia</span></div><div><b class="num">'+fmt(k.apb)+'</b><span>Por partido</span></div><div><b class="num">'+k.so+'%</b><span>De tu próxima venta</span></div></div>';
 if(o){var v=o.k==='ga'?S.ss.g+S.ss.a:S.ss.pj;h+='<p class="small" style="margin-top:8px">Objetivo de temporada: <b class="num">'+v+' / '+o.tgt+'</b> '+o.lbl+' · prima '+fmt(o.cash)+'</p>';}
 if(k.years<=1)h+='<p class="small warn" style="margin-top:8px">Último año de contrato: si no renuevas antes de que acabe la temporada, quedarás libre.</p>';
 if(S.listed)h+='<p class="small warn" style="margin-top:8px">Estás en el mercado: '+esc(c.n)+' escucha ofertas por ti.</p>';
 var a=byId(ACTS,'contrato'),as=actState(a);
 h+='<div class="btns" style="margin-top:10px"><button class="go alt '+(as.ok?'':'dis')+'" data-a="act" data-id="contrato">Pedir mejora de contrato</button>'+
  (S.listed?'<button class="go alt" data-a="treqno">Retirar petición de traspaso</button>':'<button class="go alt '+(st.ok?'':'dis')+'" data-a="treq">Solicitar el traspaso</button>')+
  (S.treqNo===S.season&&!S.listed?'<button class="go alt full" data-a="tforce">Forzar la salida (mucho riesgo)</button>':'')+'</div>'+
  '<p class="small mut">'+(as.ok?'':'Mejora: '+as.why+' ')+(st.ok||S.listed?'':'Traspaso: '+st.why)+'</p></div>';
 return h;
}
function lifeTeam(){
 return boardCard()+(isCaptain()?'<div class="card"><span class="badge">CAPITÁN</span><p class="small" style="margin:6px 0 0">Llevas el brazalete de '+esc(myClub().n)+': ganas algo más de duelos, el vestuario te respeta y das la cara cuando se pierde.</p></div>':'')+contractCard()+'<div class="card"><h3>Relaciones en el club</h3>'+relRow('coach')+relRow('team')+relRow('board')+moralRow()+'</div>'+actsCard(['coach','team','board'],'Acciones con el equipo');
}
function adsCard(){
 var A=S.ads||[];var h='<div class="card"><h3>Publicidad</h3>';
 if(!A.length)h+='<p class="small mut">Las campañas llegan cada mes según tus seguidores. Un representante mejor trae más y mejor pagadas.</p>';
 A.forEach(function(x,j){var a=ADS[x.i];h+='<div class="item"><div><b>'+esc(a.n)+'</b><p>'+fmt(x.pay)+' · energía −'+a.en+(a.pr?' · prensa '+(a.pr>0?'+':'')+a.pr:'')+(a.fans?' · afición '+(a.fans>0?'+':'')+a.fans:'')+(a.fol?' · seguidores +'+Math.round(a.fol*100)+'%':'')+' · caduca en '+Math.max(0,x.exp-(S.wk||0))+' sem.</p></div><div style="display:grid;gap:6px"><button class="go" data-a="ad" data-i="'+j+'" data-n="1">Aceptar</button><button class="go alt" data-a="ad" data-i="'+j+'" data-n="0">Rechazar</button></div></div>';});
 return h+'</div>';
}
function lifeSocial(){
 var cm=cmObj();
 var h='<div class="card"><h3>Redes sociales</h3><div class="kv"><div><b class="num">'+fnum(S.fol)+'</b><span>Seguidores</span></div><div><b class="num good">'+fmt(socialIncome())+'</b><span>Ingresos por semana</span></div><div><b class="num">'+fmt(postValue())+'</b><span>Colaboración</span></div></div>'+
  (S.post?'<div class="small good" style="margin-top:10px">Colaboración pagada de esta semana hecha.</div>':'<div class="small star" style="margin-top:10px;padding:8px 10px;border-left:3px solid var(--gold);background:rgba(245,197,66,.08);border-radius:6px">Aún no has hecho la colaboración pagada de esta semana ('+fmt(postValue())+'). Si juegas el partido sin publicar, la pierdes.</div>')+
  '<button class="go alt block '+(S.post?'dis':'')+'" data-a="post" style="margin-top:10px">Publicar colaboración pagada</button>';
 if(S.spons.length){h+='<h3 style="margin-top:12px">Publicaciones para tus marcas</h3>';S.spons.forEach(function(s){var b=byId(BRANDS,s.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b><p>Este mes: '+s.done+'/'+s.posts+' publicaciones</p></div><button class="go alt '+(s.done>=s.posts||s.wk===S.slot?'dis':'')+'" data-a="spost" data-id="'+s.id+'">Publicar</button></div>';});}
 h+='<h3 style="margin-top:12px">Community manager</h3><div class="small mut">'+(cm?'Te lleva las redes <b>'+esc(cm.n)+'</b>: +'+ds(cm.g*100)+'% de seguidores por semana, colaboraciones ×'+ds(cm.post)+'.':'Llevas tus redes tú solo.')+'</div>';
 CMS.forEach(function(c){var on=S.cm===c.id;h+='<div class="item"><div><b>'+esc(c.n)+'</b><p>'+fmt(c.c)+'/semana · +'+ds(c.g*100)+'% seguidores · prensa +'+ds(c.pr)+' · colaboraciones ×'+ds(c.post)+' · riesgo de polémica '+ds(c.risk*100)+'%</p></div>'+(on?'<button class="go alt" data-a="cmfire">Despedir</button>':'<button class="go alt" data-a="cmhire" data-id="'+c.id+'">Contratar</button>')+'</div>';});
 h+='</div>';
 return adsCard()+h+'<div class="card"><h3>Imagen pública</h3>'+relRow('press')+relRow('fans')+'</div>'+actsCard(['press','fans'],'Acciones con prensa y afición');
}
function lifeAgent(){
 var ag=agent();
 var sees=NEGF.filter(function(f){return f.lvl<=ag.lvl;}).map(function(f){return f.n.toLowerCase();}).join(', ');
 var h='<div class="card"><h3>Tu representante</h3><div class="rowb"><b>'+esc(ag.n)+'</b><span class="mut">Nivel '+ag.lvl+' · comisión '+Math.round(ag.com*100)+'%</span></div>'+
  '<ul class="small" style="margin:8px 0 0;padding-left:18px;line-height:1.6">'+
  '<li>Trae '+(1+ag.lvl)+' ofertas por mercado, '+(ag.lvl>=3?'de cualquier país':ag.lvl>=2?'de tu país, el de tu cantera y el de tu selección':'solo de tu país')+'.</li>'+
  '<li>En una negociación puede pedir: '+sees+'.</li>'+
  '<li>La directiva le tolera exigencias de hasta un +'+Math.round((0.04+0.05*ag.lvl)*100)+'% (más si te llevas bien con ella o eres mejor que tu club) y aguanta '+(1+ag.lvl)+' rondas.</li>'+
  '<li>'+(ag.lvl>=5?'Ve el límite exacto de la directiva.':ag.lvl>=4?'Intuye el límite de la directiva con un margen de ±3%.':ag.lvl>=3?'Ve la paciencia de la directiva.':'Solo intuye si tu petición es asumible.')+'</li>'+
  '<li>Mejora salarios un '+Math.round((agentWage()-1)*100)+'%, abre marcas antes y trae más campañas de publicidad.</li></ul>'+
  '<div class="btns" style="margin-top:10px"><button class="go alt '+(windowOpen()?'':'dis')+'" data-a="agsearch">Mover mi nombre</button><button class="go alt '+(S.agent==='a1'?'dis':'')+'" data-a="agfire">Despedirlo</button></div></div>';
 h+='<div class="card"><h3>Otros representantes</h3>';
 AGENTS.forEach(function(a){if(a.id===S.agent)return;var ok=overall()>=a.req&&S.fol>=a.fol;
  h+='<div class="item"><div><b>'+esc(a.n)+'</b> <span class="lv">Nv '+a.lvl+'</span><p>Comisión '+Math.round(a.com*100)+'% · firma '+fmt(a.fee)+' · pide valoración '+a.req+' y '+fnum(a.fol)+' seguidores</p></div><button class="go '+(ok&&S.money>=a.fee?'':'dis')+'" data-a="aghire" data-id="'+a.id+'">Fichar</button></div>';});
 h+='</div><div class="card"><h3>Ofertas de clubes</h3><p class="small mut" style="margin:0 0 8px">'+(S.offers.length?S.offers.length+' oferta(s) en la mesa. ':'No hay ofertas ahora. ')+(windowOpen()?'Mercado abierto.':'Mercado cerrado.')+'</p><button class="go alt block" data-a="go" data-id="career" data-k="club">Ver ofertas en Club</button></div>';
 return h;
}
function viewLife(){
 var s=subOf('life');
 return eventCard()+(s!=='team'&&S.bm?'<div class="card"><p style="margin:0">La directiva quiere reunirse contigo.</p><button class="go alt" data-a="sub" data-k="life" data-id="team" style="margin-top:8px">Ir a la reunión</button></div>':'')+
  (s==='red'?lifeSocial():s==='agent'?lifeAgent():s==='pers'?lifePersonal():lifeTeam());
}

/* ---------- vistas de Negocios ---------- */
function bizSummary(){
 var k=ctr(),inv=bizIncome(),sp=sponsorIncome(),so=socialIncome(),com=Math.round(k.wage*agentCom()),cm=cmObj(),cmc=cm?cm.c:0,hc=homeCost(),net=k.wage+inv+sp+so-com-cmc-hc;
 var B=bizMig(),n=Object.keys(B).length,val=0;Object.keys(B).forEach(function(id){val+=bizSale(B[id]);});
 var h='<div class="card"><div class="rowb"><b>Balance fijo por semana</b><b class="'+(net>=0?'good':'bad')+' num">'+fmt(net)+'</b></div>'+
  '<div class="small mut" style="margin-top:6px">Salario '+fmt(k.wage)+' · patrocinios '+fmt(sp)+' · negocios '+fmt(inv)+' · redes '+fmt(so)+' · comisión del representante −'+fmt(com)+(cmc?' · community manager −'+fmt(cmc):'')+(hc?' · casa −'+fmt(hc):'')+'. Además cobras primas por partido, bonus de contrato, publicidad y premios.</div>'+
  '<div class="kv" style="margin-top:8px"><div><b class="num good">'+fmt(S.money)+'</b><span>Dinero</span></div><div><b class="num">'+n+'</b><span>Negocios</span></div><div><b class="num">'+fmt(val)+'</b><span>Valor de venta</span></div><div><b class="num">'+fmt(S.fund)+'</b><span>Fondo de inversión</span></div></div></div>';
 h+='<div class="card"><h3>Fondo de inversión</h3><div class="rowb"><span>Saldo</span><b class="num">'+fmt(S.fund)+'</b></div><div class="small mut">Rinde de media un 0,25% por semana, con altibajos. Puedes perder dinero.</div>'+
  '<div class="btns" style="margin-top:10px"><button class="go alt" data-a="fundin" data-n="25">Aportar 25%</button><button class="go alt" data-a="fundin" data-n="100">Aportar todo</button><button class="go alt full '+(S.fund>0?'':'dis')+'" data-a="fundout">Retirar todo</button></div></div>';
 var L=S.bizLog||[];
 h+='<div class="card"><h3>Noticias de tus negocios</h3>'+(L.length?L.slice(0,6).map(function(l){return '<div class="ev"><b style="min-width:74px;font-size:13px">'+l.t+'</b><span>'+esc(l.m)+'</span></div>';}).join(''):'<p class="small mut">Sin novedades.</p>')+'</div>';
 return h;
}
function bizSpons(){
 var h='<div class="card"><h3>Patrocinios activos</h3>';
 if(!S.spons.length)h+='<p class="mut small">Todavía no tienes patrocinadores.</p>';
 S.spons.forEach(function(s){var b=byId(BRANDS,s.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b> <span class="lv">'+BCAT[s.cat]+'</span><p>'+fmt(s.w)+'/semana · '+s.yrs+' año(s) · publicaciones este mes '+s.done+'/'+s.posts+' · satisfacción '+Math.round(s.sat)+(s.strikes?' · <span class="bad">avisos '+s.strikes+'</span>':'')+(s.cat==='botas'?' · debes jugar con sus botas':'')+'</p></div><button class="go alt" data-a="scancel" data-id="'+s.id+'">Rescindir</button></div>';});
 h+='</div><div class="card"><h3>Propuestas de marcas</h3>';
 if(!S.sofs.length)h+='<p class="mut small">Las marcas te escriben a final de cada mes si cumples sus requisitos. Un representante mejor las atrae antes.</p>';
 S.sofs.forEach(function(o,i){var b=byId(BRANDS,o.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b> <span class="lv">'+BCAT[o.cat]+'</span><p>'+fmt(o.w)+'/semana · '+o.yrs+' año(s) · '+o.posts+' publicaciones al mes'+(o.cat==='botas'?' · exclusividad de botas':'')+'</p></div><div style="display:grid;gap:6px"><button class="go" data-a="ssign" data-i="'+i+'">Firmar</button><button class="go alt" data-a="sreject" data-i="'+i+'">Rechazar</button></div></div>';});
 h+='</div><div class="card"><h3>Marcas</h3><div class="small mut" style="margin-bottom:6px">Requisitos para que se fijen en ti (ya incluyen la ayuda de tu representante).</div>';
 BRANDS.slice().sort(function(a,b){return a.tier-b.tier;}).forEach(function(b){var r=brandReq(b),ok=brandOk(b),has=S.spons.some(function(s){return s.id===b.id;});
  h+='<div class="rowb small" style="padding:5px 0;border-top:1px solid var(--line)"><span>'+esc(b.n)+' <span class="mut">'+BCAT[b.cat]+' · '+'★'.repeat(b.tier)+'</span></span><span class="'+(has?'good':ok?'good':'mut')+'">'+(has?'Patrocinador':'Valoración '+r.ov+' · '+fnum(r.fol)+' seguidores')+'</span></div>';});
 return h+'</div>';
}
function riskTxt(r){return r>=0.5?'<span class="bad">muy alto</span>':r>=0.3?'<span class="warn">alto</span>':r>=0.15?'medio':'<span class="good">bajo</span>';}
function bizCompanies(){
 var B=bizMig(),mine=BIZ.filter(function(b){return B[b.id];}),rest=BIZ.filter(function(b){return !B[b.id];});
 var h='<div class="card"><h3>Tus negocios</h3>';
 if(!mine.length)h+='<p class="small mut">Aún no tienes negocios. Cada uno rinde cada semana; cada mes va mejor o peor según su riesgo. Puedes ampliarlos hasta nivel 3, poner un gestor (cobra un 12%, rinde un 10% más y reduce el riesgo a la mitad) o venderlos.</p>';
 mine.forEach(function(b){var x=B[b.id],up=x.lvl<3?bizUpCost(b,x):0,f=Math.round((x.f-1)*100);
  h+='<div class="item"><div><b>'+esc(b.n)+'</b> <span class="lv">Nv '+x.lvl+'</span><p>Rinde <b class="num '+(bizWeek(b.id)>=0?'good':'bad')+'">'+fmt(bizWeek(b.id))+'</b>/semana · este mes '+(f>=0?'+':'')+f+'% · riesgo '+riskTxt(b.r*(x.mg?0.5:1))+' · '+(x.mg?'con gestor (−'+fmt(bizMgCost(b,x))+')':'sin gestor')+' · vale '+fmt(bizSale(x))+' (invertido '+fmt(x.inv)+')</p></div>'+
   '<div style="display:grid;gap:6px">'+(x.lvl<3?'<button class="go '+(S.money>=up?'':'dis')+'" data-a="bizup" data-id="'+b.id+'">Ampliar · '+fmt(up)+'</button>':'')+'<button class="go alt" data-a="bizmg" data-id="'+b.id+'">'+(x.mg?'Quitar gestor':'Poner gestor')+'</button><button class="go alt" data-a="bizsell" data-id="'+b.id+'">Vender</button></div></div>';});
 h+='</div><div class="card"><h3>Oportunidades</h3>';
 rest.forEach(function(b){h+='<div class="item"><div><b>'+esc(b.n)+'</b><p>Rinde '+fmt(b.w)+'/semana en nivel 1 · riesgo '+riskTxt(b.r)+(b.su?' · puede dispararse o hundirse':'')+(b.img?' · puede darte mala prensa':'')+(b.fol?' · te da seguidores':'')+(b.fans?' · gusta a la afición':'')+'</p></div><button class="go '+(S.money>=b.c?'':'dis')+'" data-a="bizbuy" data-id="'+b.id+'">'+fmt(b.c)+'</button></div>';});
 return h+'</div>';
}
function viewBiz(){var s=subOf('biz');return subTabs('biz')+(s==='spon'?bizSpons():s==='emp'?bizCompanies():bizSummary());}
