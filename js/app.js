/* Estrella del Balón · arranque, pintado y eventos. */
var TABS=[['home','Inicio'],['match','Partido'],['player','Jugador'],['career','Carrera'],['life','Vida'],['biz','Negocios']];
var TABSHORT={};
var VIEWS={home:viewHome,match:viewMatch,player:viewPlayer,career:viewCareerHub,life:viewLifeHub,biz:viewBiz};
var ICONS={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 player:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
 match:'<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/>',
 train:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
 comp:'<path d="M8 4h8v4a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 12v5M9 20h6"/>',
 club:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
 life:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 money:'<path d="M4 19h16M7 16V10M12 16V5M17 16v-4"/>',
 biz:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
 shop:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 career:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'
};
function ico(k){if(typeof icoPlus==='function'){var ip=icoPlus(k);if(ip)return ip;}return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[k]+'</svg>';}
/* título y subtítulo de cada página */
function pageHead(){
 var sl=S.cal[Math.min(S.slot,S.cal.length-1)],c=myClub();
 var sub={home:MONTHS[sl.m]+' · temporada '+S.season+' · '+slotLabel(sl),match:slotLabel(sl)+' · semana '+(S.slot+1)+' de '+S.cal.length,player:'Valoración '+ds(overall())+' · '+POS[S.pos]+' · valor '+fmv(mv(S.pl[S.me])),
  career:esc(c.n)+' · '+esc(lgName(c)),life:'Equipo, redes y publicidad, vida personal y representante',biz:'Dinero '+fmt(S.money)+' · patrocinios y empresas'}[S.tab];
 var t=TABS.filter(function(x){return x[0]===S.tab;})[0];
 return '<header class="pagehead"><div><h1>'+t[1]+'</h1><p>'+sub+'</p></div></header>';
}
function dots(){return {home:homeBadge(),life:!!S.event||!!S.pol||!!S.bm||!!S.neg||(S.ads||[]).length>0||!S.post||S.spons.some(function(s){return s.done<s.posts&&s.wk!==S.slot;}),biz:S.sofs.length>0,match:!!(S.match||S.press)};}
function sideHTML(){
 var c=myClub(),kit=clubColors(c),d=dots();
 return '<aside id="side" aria-label="Menú principal"><div class="brand">'+(logoPlus(26)||'<svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 21 12 17.3 5.8 21l1.7-6.9L2 9.3l7.1-.4z" fill="currentColor"/></svg>')+'Estrella del Balón</div>'+
  '<div class="me-card"><div class="face">'+faceSVG(S.look,kit,64)+'</div><div><b>'+esc(S.name)+'</b><span class="small mut">'+POS[S.pos]+' · '+S.age+' años</span><div class="small mut">'+esc(c.n)+'</div></div></div>'+
  '<div class="me-stats"><div><b class="star num">'+ds(overall())+'</b><span>Valoración</span></div><div><b class="money num">'+fmt(S.money)+'</b><span>Dinero</span></div><div><b class="num">'+S.medals+'</b><span>Medallas</span></div></div>'+
  '<nav class="sidenav" aria-label="Secciones">'+TABS.map(function(t){return '<button data-a="tab" data-id="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+ico(t[0])+'<span>'+t[1]+'</span>'+(d[t[0]]?'<span class="dot'+(typeof d[t[0]]==='number'?' n':'')+'" aria-label="Pendiente">'+(typeof d[t[0]]==='number'?d[t[0]]:'')+'</span>':'')+'</button>';}).join('')+'</nav>'+
  '<button class="go alt block" data-a="menu" style="margin-top:6px">Menú de partidas</button><a class="lnk small" href="https://github.com/R3pl1k4nt3/Soccer-Super-Star-Sss-/issues/new" target="_blank" rel="noopener" style="display:block;margin-top:8px">Enviar sugerencias o fallos</a><div class="side-foot">'+MONTHS[S.cal[Math.min(S.slot,S.cal.length-1)].m]+' · temporada '+S.season+(S.real?'<br>Versión real · no comercial, solo para pruebas y uso particular.':'')+'</div></aside>';
}
function topHTML(){
 var c=myClub(),sl=S.cal[Math.min(S.slot,S.cal.length-1)];
 return '<header id="top"><div class="face">'+faceSVG(S.look,clubColors(c),38)+'</div>'+
  '<div class="stat" title="Valoración"><span class="star" aria-hidden="true">★</span><span class="num">'+ds(overall())+'</span><span class="sr">de valoración</span></div>'+
  '<div class="stat money num" title="Dinero">'+fmt(S.money)+'</div>'+
  '<div class="stat" title="Medallas"><span class="medal" aria-hidden="true"></span><span class="num">'+S.medals+'</span><span class="sr">medallas</span></div>'+
  '<div class="when"><b>'+esc(S.name)+'</b>'+S.age+' años · T'+S.season+' · '+MONTHS[sl.m]+'</div><button class="chip topmenu" data-a="menu" aria-label="Menú de partidas">Menú</button></header>';
}
function navHTML(){var d=dots();return '<nav id="nav" aria-label="Secciones">'+TABS.map(function(t){return '<button data-a="tab" data-id="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+ico(t[0])+'<span>'+(TABSHORT[t[0]]||t[1])+'</span>'+(d[t[0]]?'<span class="navdot'+(typeof d[t[0]]==='number'?' n':'')+'" aria-label="Pendiente">'+(typeof d[t[0]]==='number'?d[t[0]]:'')+'</span>':'')+'</button>';}).join('')+'</nav>';}
function toastsHTML(){return '<div id="toasts" role="status" aria-live="polite">'+toasts.map(function(t){return '<div class="toast '+(t.err?'err':'')+'">'+esc(t.m)+'</div>';}).join('')+'</div>';}
function render(){
 var app=$('#app');if(!app)return;
 if(!S){
  /* pantallas de inicio y creación: al repintar se conserva el desplazamiento y el control activo */
  var scr=UI.screen==='new'?'new':'menu',st=$('.setup'),keep=st&&UI.lastScr===scr?st.scrollTop:0,ae=document.activeElement,fk=null;
  if(ae&&ae!==document.body)fk=ae.id?'#'+ae.id:ae.getAttribute('data-a')?'[data-a="'+ae.getAttribute('data-a')+'"]'+(ae.getAttribute('data-k')?'[data-k="'+ae.getAttribute('data-k')+'"]':'')+(ae.getAttribute('data-id')!=null?'[data-id="'+ae.getAttribute('data-id')+'"]':''):null;
  app.innerHTML=(scr==='new'?setupHTML():menuHTML())+toastsHTML();
  var st2=$('.setup');if(st2)st2.scrollTop=keep;UI.lastScr=scr;
  if(fk){try{var fe=document.querySelector(fk);if(fe)fe.focus({preventScroll:true});}catch(x){}}
  if(setupErr&&scr==='new'&&$('#nm')&&UI.focusName){UI.focusName=0;$('#nm').focus();}
  return;}
 var sc=$('#view')?$('#view').scrollTop:0,fid=document.activeElement&&document.activeElement.getAttribute&&document.activeElement.getAttribute('data-a')?[document.activeElement.getAttribute('data-a'),document.activeElement.getAttribute('data-id')]:null;
 if(S.freePending&&!S.summary)freeStart();
 if(S.pre){app.innerHTML=preHTML()+(S.neg?negHTML():'')+toastsHTML();var stp=$('.setup');if(stp)stp.scrollTop=UI.preScroll||0;return;}
 normTab();
 if(!UI.pop&&S.popQ&&S.popQ.length&&!S.match&&!S.summary&&!S.neg&&!UI.busy&&!S.press)UI.pop=S.popQ.shift();
 var v=(VIEWS[S.tab]||viewHome)();
 app.innerHTML=sideHTML()+topHTML()+'<main id="view"><div class="page">'+pageHead()+v+'</div></main>'+navHTML()+(UI.sq?squadHTML():'')+modalHTML()+(S.neg&&!S.summary?negHTML():'')+popHTML()+(UI.share?shareHTML():'')+(UI.pen&&S.match?penAimHTML():'')+(UI.busy?'<div class="busy" role="status"><div class="spin" aria-hidden="true"></div><b>'+UI.busy+'</b></div>':'')+
  toastsHTML();
 if(UI.lastTab===S.tab&&$('#view'))$('#view').scrollTop=sc;else if($('#view'))$('#view').scrollTop=0;
 UI.lastTab=S.tab;
 /* mantener el foco del teclado tras repintar */
 if(fid){var sel='[data-a="'+fid[0]+'"]'+(fid[1]!=null?'[data-id="'+fid[1]+'"]':'');try{var el=document.querySelector('.modal '+sel)||document.querySelector('#view '+sel)||document.querySelector(sel);if(el)el.focus({preventScroll:true});}catch(x){}}
 Array.prototype.forEach.call(document.querySelectorAll('.dis'),function(el){el.setAttribute('aria-disabled','true');});
 Array.prototype.forEach.call(document.querySelectorAll('.bar'),function(el){el.setAttribute('aria-hidden','true');});
 var m=document.querySelector('.modal .card');if(m&&!m.contains(document.activeElement)){m.setAttribute('tabindex','-1');m.focus({preventScroll:true});}
 liveTick();
 if(UI.pop&&UI.pop.s3d&&!UI.pop.s3dRun&&typeof play3D==='function'){var P3=UI.pop;P3.s3dRun=1;play3D(P3.s3d.k,P3.s3d.o).then(function(){if(S)render();});}
}
/* reloj del partido en directo: corre solo en la pestaña Partido y sin ventanas abiertas */
var liveT=null;
function liveRuns(){return S&&S.match&&!S.pre&&S.tab==='match'&&!UI.pop&&!UI.pen&&!(document.hidden);}
function liveTick(){
 if(liveT&&typeof clearTimeout==='function')clearTimeout(liveT);liveT=null;
 if(!liveRuns())return;var M=S.match;if((M.clock||0)>=liveTarget(M)&&nextDec(M))return;
 liveT=setTimeout(function(){liveT=null;if(!liveRuns())return;var r=liveStep();
  if(r==='min'){var el=$('#livein');if(el){el.innerHTML=liveInner();liveTick();}else render();}
  else if(r!=='end'){save();render();}},VELMS[liveSpeed()]);
}
document.addEventListener('visibilitychange',function(){if(S&&S.match)liveTick();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&UI.pop){var c=document.querySelector('[data-a=popclose]');if(c)c.click();return;}if(e.key==='Escape'&&UI.sq){UI.sq=null;render();}});document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;
 var a=b.getAttribute('data-a'),id=b.getAttribute('data-id'),n=+b.getAttribute('data-n'),i=+b.getAttribute('data-i');
 if(a==='start'){var nm=(($('#nm')?$('#nm').value:setupState.name)||'').trim();if(!nm){setupErr='Escribe un nombre.';setupState.step=2;UI.focusName=1;render();return;}setupErr='';setupState.name=nm;newGame(nm,setupState.pos,setupState.tp,setupState.ts,setupState.nat,setupState.co,setupState.ver==='real',setupState.look);S.diff=setupState.diff||'normal';CUR=UI.newSlot||freeSlot()||1;saveNow();UI.comp=null;render();return;}
 if(a==='gfx'){setGfxMode(id);render();return;}
 if(a==='sdiff'&&!S){setupState.diff=id;render();return;}
 if(a==='ver'&&!S){setupState.ver=id;render();return;}
 if(a==='step'&&!S){var st=setupState;
  if(n>st.step&&st.step<=2&&n>2&&!(st.name||'').trim()){st.step=2;setupErr='Escribe un nombre para seguir.';UI.focusName=1;render();return;}
  if(n>3&&(!st.tp||!st.ts)){st.step=3;st.maxStep=Math.max(st.maxStep||1,3);toast('Elige tus dos rasgos para seguir.',1);render();return;}
  setupErr='';st.step=n;st.maxStep=Math.max(st.maxStep||1,n);UI.lastScr='';render();var h=document.querySelector('.wizard h2');if(h){h.setAttribute('tabindex','-1');h.focus();}return;}
 if(a==='trait'&&!S){var k=b.getAttribute('data-k');setupState[k]=id||null;if(k==='tp')setupState.ts=null;UI.lastScr='';render();return;}
 if(!S){var M={menu:function(){UI.screen='menu';UI.delSlot=null;render();},newslot:function(){UI.newSlot=+id;UI.screen='new';setupErr='';setupState.step=1;setupState.maxStep=1;render();},
  slotopen:function(){openSlot(+id);},slotexp:function(){exportSlot(+id);},slotdel1:function(){UI.delSlot=+id;render();},slotdel0:function(){UI.delSlot=null;render();},
  slotdel2:function(){deleteSlot(+id);UI.delSlot=null;toast('Partida borrada.');render();}};
  if(M[a]){M[a]();return;}}
 if(a==='look'){var L=S?S.look:setupState.look;setLook(L,b.getAttribute('data-k'),id);if(S)save();render();return;}
 if(a==='tat'&&!S){toggleTat(setupState.look,id);render();return;}
 if(a==='lookrnd'&&!S){setupState.look=randomLook(setupState.pos);render();return;}
 if(!S)return;
 var A={
  tab:function(){if(S.tab==='home')S.logSeen=S.logN;S.tab=id;save();render();},
  sub:function(){subSet(b.getAttribute('data-k'),id);save();render();},
  go:function(){if(S.tab==='home')S.logSeen=S.logN;S.tab=id;var k=b.getAttribute('data-k');if(k)subSet(id,k);save();render();},
  seen:function(){S.logSeen=S.logN;save();render();},
  mult:function(){S.mult=n;save();render();},
  train:function(){train(id);},promo:function(){var k=mySk(id),l0=k?k.lvl:0;promo(id);if(k&&k.lvl>l0&&typeof s3dNow==='function'&&Math.random()<0.45)s3dNow('entreno',{kit:s3dKit(),n:k.n+' sube a nivel '+k.lvl});},bono:bono,
  play:function(){
   /* varias semanas o el cierre de temporada tardan algo en móviles: primero se pinta el aviso y luego se calcula */
   var heavy=n>1||S.slot>=S.cal.length-1;if(!heavy){playN(n);return;}
   UI.busy=S.slot>=S.cal.length-1||n>=30?'Cerrando la temporada…':'Jugando '+n+' partidos…';render();
   setTimeout(function(){UI.busy=null;playN(n);render();},40);},
  accept:function(){negOpen('fich',i);},buy:function(){buy(id);},invest:function(){bizBuy(id);},
  negadj:function(){negAdj(id,n);},negprop:negPropose,negacc:negAcceptCur,negquit:negQuit,
  bm:function(){boardAns(i);},treq:function(){transferReq();},treqno:transferWithdraw,tforce:transferForce,
  ad:function(){adDo(i,!!n);},bizbuy:function(){bizBuy(id);},bizup:function(){bizUp(id);},bizmg:function(){bizMg(id);},bizsell:function(){bizSell(id);},
  lang:function(){setLang(id);},
  choose:function(){choose(i);},tenpick:function(){tenChoose(i);},auto:function(){S.auto=!!n;save();render();},
  press:function(){pressAnswer(i);},pressskip:pressSkip,
  ev:function(){doEvent(i);},injdec:function(){injSet(id);},polem:function(){polemDo(i);},act:function(){doAct(id);},post:postPaid,
  fundin:function(){fundIn(n/100);},fundout:fundOut,
  cat:function(){S.cat=id;save();render();},
  comp:function(){UI.comp=id;if(UI.ctab==='mes'&&id.charAt(0)!=='L')UI.ctab='tabla';render();},
  ctab:function(){UI.ctab=id;render();},
  shop:function(){UI.shop=id;UI.stype='';render();},stype:function(){UI.stype=id;render();},gear:function(){buyGear(id);},
  aghire:function(){hireAgent(id);},agfire:fireAgent,agsearch:agentSearch,
  cmhire:function(){hireCM(id);},cmfire:fireCM,
  ssign:function(){signSponsor(i);},sreject:function(){rejectSponsor(i);},spost:function(){sponsorPost(id);},scancel:function(){cancelSponsor(id);},
  squad:function(){UI.sq={club:+id,p:null};render();},
  sqp:function(){UI.sq.p=+id;render();},sqback:function(){UI.sq.p=null;render();},sqclose:function(){UI.sq=null;render();},
  tatnew:function(){newTattoo(id);},lookedit:function(){UI.lookEdit=!UI.lookEdit;render();},
  closesum:function(){var r0=S.retired;S.summary=null;save();render();if(r0&&typeof s3dNow==='function')s3dNow('retiro',{n:S.name,kit:s3dKit()});},
  retire:function(){S.retired=true;save();render();if(typeof s3dNow==='function')s3dNow('retiro',{n:S.name,kit:s3dKit()});},
  reset1:function(){UI.reset=true;render();},reset0:function(){UI.reset=false;render();},
  reset2:function(){UI.reset=false;var id=CUR;S=null;CUR=null;UI.sq=null;if(id)deleteSlot(id);UI.screen='menu';render();},
  pretrial:function(){UI.preScroll=$('.setup')?$('.setup').scrollTop:0;preTrial(i,id);},presign:function(){preSign(i);},preneg:function(){negOpen('libre',i);},prenext:function(){UI.preScroll=0;preNext();},
  addtrait:function(){addTrait(id);},
  popclose:function(){if(UI.pop&&UI.pop.k==='dec'&&UI.pendRep){UI.pop={k:'match',rep:UI.pendRep};UI.pendRep=null;}else UI.pop=null;save();render();},
  livespeed:function(){localStorage.setItem('estrella_vel',String(n));render();},
  livejump:function(){liveJump();},s3d:function(){localStorage.setItem('estrella_3d',n?'1':'0');render();},
  diff:function(){S.diff=id;save();render();},home:function(){moveHome(id);},car:function(){buyCar(id);},
  penset:function(){penSet(b.getAttribute('data-k'),id);},penshoot:penShoot,pencancel:penCancel,
  galanext:galaNext,galaskip:galaSkip,
  share:shareCareer,sharecopy:shareCopy,shareclose:shareClose,
  retview:function(){UI.retHide=1;S.tab='career';subSet('career','hitos');render();},retshow:function(){UI.retHide=0;render();},
  adwatch:adWatch,adclaim:adReward,buygame:buyGame,buyok:buyConfirm,tutok:function(){S.tutDone=1;save();render();},
  report:function(){UI.pop={k:'match',rep:(S.reports||[])[i]};render();},
  menu:toMenu,export:exportCurrent
 };
 if(A[a])A[a]();
});
document.addEventListener('input',function(e){if(e.target&&e.target.id==='nm')setupState.name=e.target.value;});
document.addEventListener('change',function(e){var t=e.target;if(!t)return;
 if(t.id==='imp'){importFile(t.files&&t.files[0]);t.value='';return;}
 if(t.id==='dorsal'){var L=S?S.look:setupState.look;setLook(L,'num',t.value);if(S)save();render();return;}
 if(t.id==='compsel'&&S){if(t.value){UI.comp=t.value;if(UI.ctab==='mes'&&t.value.charAt(0)!=='L')UI.ctab='tabla';render();}return;}
 if(S)return;
 if(t.id==='ps')setupState.pos=t.value;else if(t.id==='tp')setupState.tp=t.value;else if(t.id==='ts')setupState.ts=t.value;else if(t.id==='na')setupState.nat=t.value;else if(t.id==='co')setupState.co=t.value;else return;render();});
window.__dbg={get S(){return S;},set S(v){S=v;},newGame:newGame,playN:playN,playSlot:playSlot,choose:choose,liveEnd:function(){return liveEnd(true);},pressAnswer:pressAnswer,doEvent:doEvent,doAct:doAct,train:train,promo:promo,render:render,UI:UI,
 overall:overall,leaders:leaders,genOffers:genOffers,accept:accept,signSponsor:signSponsor,buyGear:buyGear,gearCatalog:gearCatalog,hireAgent:hireAgent,hireCM:hireCM,sponsorPost:sponsorPost,squad:function(c,p){UI.sq={club:c,p:p};var h=squadHTML();UI.sq=null;return h;},views:VIEWS,viewComp:viewComp,preAutoSign:function(){preAutoSign();},negOpen:negOpen,freeStart:freeStart,negAdj:negAdj,negPropose:negPropose,negAcceptCur:negAcceptCur,negQuit:negQuit,boardAns:boardAns,newBoardMeeting:newBoardMeeting,transferReq:transferReq,transferForce:transferForce,adDo:adDo,bizBuy:bizBuy,bizUp:bizUp,bizMg:bizMg,bizSell:bizSell,doActCheck:actState,save:save,saveNow:saveNow,metaAll:metaAll,toMenu:toMenu,openSlot:openSlot};
appInit();playClock();
/* web instalable y sin conexión (sw.js); no en archivos locales ni dentro de la app nativa */
try{if(typeof navigator!=='undefined'&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!isNative())navigator.serviceWorker.register('sw.js').catch(function(){});}catch(e){}
if(gfxMode()==='mejorados')loadGfx();
applyGfxBackground();
bootSaves();
render();
