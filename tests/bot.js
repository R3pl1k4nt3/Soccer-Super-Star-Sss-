/* Bot de pruebas: juega carreras completas usando las funciones del juego.
   Funciona en Node (tests/simulacion.js) y en el navegador (cargándolo en la consola). */
(function(root){
function carrera(G,pos,tp,ts,nat,co,years,opts){
 opts=opts||{};
 var errs=[],rows=[],libres=0;try{localStorage.setItem('estrella_3d','0');}catch(e){}
 G.newGame('Bot',pos,tp,ts,nat,co,!!opts.real);
 var S=G.S;if(S.pre&&G.preAutoSign)G.preAutoSign();S.auto=!opts.manual;
 for(var y=0;y<years&&!S.retired;y++){
  try{
   for(var i=0;i<15;i++){var k=S.skills[Math.floor(Math.random()*S.skills.length)];S.mult=25;G.train(k.id);G.promo(k.id);}
   var g=0;
   while(!S.summary&&!S.retired&&g++<150){
    if(S.freePending)G.freeStart();
    if(S.pre){var fr=S.pre.clubs.map(function(x,j){return x.offer?j:-1;}).filter(function(j){return j>=0;});
     if(fr.length&&Math.random()<0.5){G.negOpen('libre',fr[0]);if(S.neg){G.negAdj('wage',2);G.negPropose();if(S.neg)G.negAcceptCur();}}
     if(S.pre)G.preAutoSign();libres++;continue;}
    if(S.event)G.doEvent(Math.random()<0.5?0:1);
    if(S.bm)G.boardAns(Math.floor(Math.random()*BM[S.bm.k].o.length));
    if(S.neg){var t=0;NEGF.forEach(function(f){if(Math.random()<0.5)G.negAdj(f.k,1+Math.floor(Math.random()*3));});
     while(S.neg&&t++<6)G.negPropose();if(S.neg)G.negAcceptCur();}
    if(S.ads&&S.ads.length)G.adDo(0,Math.random()<0.6);
    if(g%13===0){var bz=BIZ.filter(function(b){return !(S.biz||{})[b.id]&&b.c<S.money*0.3;});if(bz.length)G.bizBuy(bz[bz.length-1].id);
     Object.keys(S.biz||{}).forEach(function(id){if(Math.random()<0.3)G.bizUp(id);if(Math.random()<0.1)G.bizMg(id);if(Math.random()<0.03)G.bizSell(id);});}
    if(g%17===0&&S.acts>0){var ac=ACTS.filter(function(a){return G.doActCheck(a).ok;});if(ac.length)G.doAct(pick(ac).id);}
    if(g===30&&Math.random()<0.3)G.transferReq();
    if(S.press){G.pressAnswer(Math.floor(Math.random()*3));continue;}
    G.playN(1);
    var q=0;while(S.match&&nextDec(S.match)&&q++<8)G.choose(Math.floor(Math.random()*3));if(S.match)G.liveEnd();if(G.UI)G.UI.pop=null;
    if(S.sofs.length)G.signSponsor(0);
    if(typeof newTraitSlot==='function'&&newTraitSlot()){var op=TRAITS.filter(function(x){return !!x.gk===(S.pos==='POR')&&x.id!==S.tp&&x.id!==S.ts&&(S.tx||[]).indexOf(x.id)<0;});if(op.length)addTrait(op[0].id);}
    S.spons.forEach(function(s){G.sponsorPost(s.id);});
    if(g%7===0){var cat=G.gearCatalog().filter(function(x){return x.c<S.money*0.2;});if(cat.length)G.buyGear(cat[cat.length-1].id);}
    if(g%11===0)Object.keys(G.views).forEach(function(t){S.tab=t;G.render();});
    if(S.offers.length&&g<4){var best=S.offers.slice().sort(function(a,b){return S.clubs[b.club].str-S.clubs[a.club].str;})[0];
     if(S.clubs[best.club].str>S.clubs[S.pl[S.me].c].str){if(Math.random()<0.5)G.accept(S.offers.indexOf(best));else{G.negOpen('fich',S.offers.indexOf(best));if(S.neg){G.negAdj('wage',2);G.negPropose();if(S.neg)G.negAcceptCur();}}}}
   }
   var m=S.summary;if(!m)break;
   rows.push('T'+m.season+' '+m.club+' ('+m.league+') '+m.pos+'º · val '+m.ovBefore.toFixed(0)+' · PJ '+m.apps+' · G '+m.g+' · A '+m.a+' · nota '+m.rating.toFixed(2)+' · premios '+m.awards.length+(m.moved?' · '+m.moved:'')+' · '+Math.round(S.money/1000)+'k€ · '+S.fol+' seg.');
   S.summary=null;
  }catch(e){errs.push(e.stack||String(e));break;}
 }
 if(S.freePending)G.freeStart();if(S.pre)G.preAutoSign();
 Object.keys(G.views).forEach(function(t){try{S.tab=t;G.views[t]();}catch(e){errs.push(t+': '+(e.stack||e));}});
 Object.keys(SUBS).forEach(function(t){SUBS[t].forEach(function(s){try{subSet(t,s[0]);G.views[t]();}catch(e){errs.push(t+'/'+s[0]+': '+(e.stack||e));}});});
 try{G.newBoardMeeting(true);if(S.bm)G.boardAns(0);if(S.offers.length){G.negOpen('fich',0);negHTML();G.negQuit();}}catch(e){errs.push('directiva/negociación: '+(e.stack||e));}
 ['W','L:ENG1','L:IRL2','C:ESP','P:ESP','P:GER','P:IRL','E:E1','E:E3','T:WC','T:EC'].forEach(function(c){['tabla','g','a','r','mes','temp'].forEach(function(tb){try{G.UI.comp=c;G.UI.ctab=tb;G.viewComp();}catch(e){errs.push(c+'/'+tb+': '+(e.stack||e));}});});
 G.UI.comp=null;G.UI.ctab='tabla';
 try{G.squad(0,null);G.squad(0,S.clubs[0].ros[0]);G.squad(S.pl[S.me].c,S.me);}catch(e){errs.push('plantilla: '+(e.stack||e));}
 return {libres:libres,rows:rows,errs:errs,size:JSON.stringify(S).length,trofeos:S.trophies.map(function(t){return 'T'+t.s+' '+t.n;}),seleccion:S.nt,balon:S.bdo.map(function(b){return 'T'+b.s+': '+b.top.slice(0,3).map(function(x){return x.n+' ('+x.c+')';}).join(', ')+(b.me?' · tú '+b.me+'º':'');})};
}
root.botCarrera=carrera;
if(typeof module!=='undefined')module.exports=carrera;
})(typeof window!=='undefined'?window:global);
