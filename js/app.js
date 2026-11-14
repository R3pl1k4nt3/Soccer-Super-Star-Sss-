/* Estrella del Balón · arranque, pintado y eventos. */
var TABS=[['match','Partido'],['train','Entreno'],['comp','Competiciones'],['club','Club'],['life','Vida'],['money','Negocio'],['shop','Tienda'],['career','Carrera']];
var TABSHORT={comp:'Compet.'};
var VIEWS={train:viewTrain,match:viewMatch,comp:viewComp,club:viewClub,life:viewLife,money:viewMoney,shop:viewShop,career:viewCareer};
var ICONS={
 match:'<circle cx="12" cy="12" r="9"/><path d="M12 7l4 3-1.5 4.5h-5L8 10z"/>',
 train:'<path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12"/>',
 comp:'<path d="M8 4h8v4a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 12v5M9 20h6"/>',
 club:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/>',
 life:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 money:'<path d="M4 19h16M7 16V10M12 16V5M17 16v-4"/>',
 shop:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
 career:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'
};
function ico(k){return '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS[k]+'</svg>';}
/* título y subtítulo de cada página */
function pageHead(){
 var sl=S.cal[Math.min(S.slot,S.cal.length-1)],c=myClub();
 var sub={match:slotLabel(sl)+' · semana '+(S.slot+1)+' de '+S.cal.length,train:'Valoración '+ds(overall())+' · '+POS[S.pos],comp:'Clasificaciones, estadísticas y premios',club:esc(c.n)+' · '+esc(lgName(c)),
  life:'Relaciones, moral y redes sociales',money:'Ingresos, patrocinios e inversiones',shop:'Material y servicios',career:esc(S.name)+' · temporada '+S.season+(S.real?' · versión real':'')}[S.tab];
 var t=TABS.filter(function(x){return x[0]===S.tab;})[0];
 return '<header class="pagehead"><div><h1>'+t[1]+'</h1><p>'+sub+'</p></div></header>';
}
function dots(){return {life:!!S.event,match:!!(S.match||S.press),money:S.sofs.length>0};}
function sideHTML(){
 var c=myClub(),kit=clubColors(c),d=dots();
 return '<aside id="side" aria-label="Menú principal"><div class="brand"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 21 12 17.3 5.8 21l1.7-6.9L2 9.3l7.1-.4z" fill="currentColor"/></svg>Estrella del Balón</div>'+
  '<div class="me-card"><div class="face">'+faceSVG(S.look,kit,64)+'</div><div><b>'+esc(S.name)+'</b><span class="small mut">'+POS[S.pos]+' · '+S.age+' años</span><div class="small mut">'+esc(c.n)+'</div></div></div>'+
  '<div class="me-stats"><div><b class="star num">'+ds(overall())+'</b><span>Valoración</span></div><div><b class="money num">'+fmt(S.money)+'</b><span>Dinero</span></div><div><b class="num">'+S.medals+'</b><span>Medallas</span></div></div>'+
  '<nav class="sidenav" aria-label="Secciones">'+TABS.map(function(t){return '<button data-a="tab" data-id="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+ico(t[0])+'<span>'+t[1]+'</span>'+(d[t[0]]?'<span class="dot" aria-label="Pendiente"></span>':'')+'</button>';}).join('')+'</nav>'+
  '<div class="side-foot">'+MONTHS[S.cal[Math.min(S.slot,S.cal.length-1)].m]+' · temporada '+S.season+(S.real?'<br>Versión real · no comercial, solo para pruebas y uso particular.':'')+'</div></aside>';
}
function topHTML(){
 var c=myClub(),sl=S.cal[Math.min(S.slot,S.cal.length-1)];
 return '<header id="top"><div class="face">'+faceSVG(S.look,clubColors(c),38)+'</div>'+
  '<div class="stat" title="Valoración"><span class="star" aria-hidden="true">★</span><span class="num">'+ds(overall())+'</span><span class="sr">de valoración</span></div>'+
  '<div class="stat money num" title="Dinero">'+fmt(S.money)+'</div>'+
  '<div class="stat" title="Medallas"><span class="medal" aria-hidden="true"></span><span class="num">'+S.medals+'</span><span class="sr">medallas</span></div>'+
  '<div class="when"><b>'+esc(S.name)+'</b>'+S.age+' años · T'+S.season+' · '+MONTHS[sl.m]+'</div></header>';
}
function navHTML(){var d=dots();return '<nav id="nav" aria-label="Secciones">'+TABS.map(function(t){return '<button data-a="tab" data-id="'+t[0]+'"'+(S.tab===t[0]?' aria-current="page"':'')+'>'+ico(t[0])+'<span>'+(TABSHORT[t[0]]||t[1])+'</span>'+(d[t[0]]?'<span class="navdot" aria-label="Pendiente"></span>':'')+'</button>';}).join('')+'</nav>';}
function toastsHTML(){return '<div id="toasts" role="status" aria-live="polite">'+toasts.map(function(t){return '<div class="toast '+(t.err?'err':'')+'">'+esc(t.m)+'</div>';}).join('')+'</div>';}
function render(){
 var app=$('#app');if(!app)return;
 if(!S){app.innerHTML=(UI.screen==='new'?setupHTML():menuHTML())+toastsHTML();if(setupErr&&UI.screen==='new'&&$('#nm')&&UI.focusName){UI.focusName=0;$('#nm').focus();}return;}
 var sc=$('#view')?$('#view').scrollTop:0,fid=document.activeElement&&document.activeElement.getAttribute&&document.activeElement.getAttribute('data-a')?[document.activeElement.getAttribute('data-a'),document.activeElement.getAttribute('data-id')]:null;
 var v=(VIEWS[S.tab]||viewTrain)();
 app.innerHTML=sideHTML()+topHTML()+'<main id="view"><div class="page">'+pageHead()+v+'</div></main>'+navHTML()+(UI.sq?squadHTML():'')+modalHTML()+
  toastsHTML();
 if(UI.lastTab===S.tab&&$('#view'))$('#view').scrollTop=sc;else if($('#view'))$('#view').scrollTop=0;
 UI.lastTab=S.tab;
 /* mantener el foco del teclado tras repintar */
 if(fid){var sel='[data-a="'+fid[0]+'"]'+(fid[1]!=null?'[data-id="'+fid[1]+'"]':'');try{var el=document.querySelector('.modal '+sel)||document.querySelector('#view '+sel)||document.querySelector(sel);if(el)el.focus({preventScroll:true});}catch(x){}}
 Array.prototype.forEach.call(document.querySelectorAll('.dis'),function(el){el.setAttribute('aria-disabled','true');});
 Array.prototype.forEach.call(document.querySelectorAll('.bar'),function(el){el.setAttribute('aria-hidden','true');});
 var m=document.querySelector('.modal .card');if(m&&!m.contains(document.activeElement)){m.setAttribute('tabindex','-1');m.focus({preventScroll:true});}
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&UI.sq){UI.sq=null;render();}});document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;
 var a=b.getAttribute('data-a'),id=b.getAttribute('data-id'),n=+b.getAttribute('data-n'),i=+b.getAttribute('data-i');
 if(a==='start'){var nm=($('#nm').value||'').trim();if(!nm){setupErr='Escribe un nombre.';UI.focusName=1;render();return;}setupErr='';setupState.name=nm;newGame(nm,setupState.pos,setupState.tp,setupState.ts,setupState.nat,setupState.co,setupState.ver==='real',setupState.look);CUR=UI.newSlot||freeSlot()||1;saveNow();UI.comp=null;render();return;}
 if(a==='ver'&&!S){setupState.ver=id;render();return;}
 if(!S){var M={menu:function(){UI.screen='menu';UI.delSlot=null;render();},newslot:function(){UI.newSlot=+id;UI.screen='new';setupErr='';render();},
  slotopen:function(){openSlot(+id);},slotexp:function(){exportSlot(+id);},slotdel1:function(){UI.delSlot=+id;render();},slotdel0:function(){UI.delSlot=null;render();},
  slotdel2:function(){deleteSlot(+id);UI.delSlot=null;toast('Partida borrada.');render();}};
  if(M[a]){M[a]();return;}}
 if(a==='look'){var L=S?S.look:setupState.look;setLook(L,b.getAttribute('data-k'),id);if(S)save();render();return;}
 if(a==='tat'&&!S){toggleTat(setupState.look,id);render();return;}
 if(a==='lookrnd'&&!S){setupState.look=randomLook(setupState.pos);render();return;}
 if(!S)return;
 var A={
  tab:function(){S.tab=id;save();render();},
  mult:function(){S.mult=n;save();render();},
  train:function(){train(id);},promo:function(){promo(id);},bono:bono,
  play:function(){playN(n);},
  accept:function(){accept(i);},buy:function(){buy(id);},invest:function(){invest(id);},
  choose:function(){choose(i);},auto:function(){S.auto=!!n;save();render();},
  press:function(){pressAnswer(i);},pressskip:pressSkip,
  ev:function(){doEvent(i);},act:function(){doAct(id);},post:postPaid,
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
  closesum:function(){S.summary=null;save();render();},
  retire:function(){S.retired=true;save();render();},
  reset1:function(){UI.reset=true;render();},reset0:function(){UI.reset=false;render();},
  reset2:function(){UI.reset=false;var id=CUR;S=null;CUR=null;UI.sq=null;if(id)deleteSlot(id);UI.screen='menu';render();},
  menu:toMenu,export:exportCurrent
 };
 if(A[a])A[a]();
});
document.addEventListener('input',function(e){if(e.target&&e.target.id==='nm')setupState.name=e.target.value;});
document.addEventListener('change',function(e){var t=e.target;if(!t)return;
 if(t.id==='imp'){importFile(t.files&&t.files[0]);t.value='';return;}
 if(t.id==='compsel'&&S){if(t.value){UI.comp=t.value;if(UI.ctab==='mes'&&t.value.charAt(0)!=='L')UI.ctab='tabla';render();}return;}
 if(S)return;
 if(t.id==='ps')setupState.pos=t.value;else if(t.id==='tp')setupState.tp=t.value;else if(t.id==='ts')setupState.ts=t.value;else if(t.id==='na')setupState.nat=t.value;else if(t.id==='co')setupState.co=t.value;else return;render();});
window.__dbg={get S(){return S;},set S(v){S=v;},newGame:newGame,playN:playN,playSlot:playSlot,choose:choose,pressAnswer:pressAnswer,doEvent:doEvent,doAct:doAct,train:train,promo:promo,render:render,UI:UI,
 overall:overall,leaders:leaders,genOffers:genOffers,accept:accept,signSponsor:signSponsor,buyGear:buyGear,gearCatalog:gearCatalog,hireAgent:hireAgent,hireCM:hireCM,sponsorPost:sponsorPost,squad:function(c,p){UI.sq={club:c,p:p};var h=squadHTML();UI.sq=null;return h;},views:VIEWS,save:save,saveNow:saveNow,metaAll:metaAll,toMenu:toMenu,openSlot:openSlot};
bootSaves();
render();
