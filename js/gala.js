/* Estrella del Balón · ventanas de premios.
   - Cada fin de mes: equipo del mes de tu liga, dibujado por puestos en un campo, y el jugador del mes.
   - Al acabar la temporada, antes del resumen: una gala que va desvelando los premios
     (tu liga, las grandes ligas, Europa, selecciones, equipo mundial, Bota de Oro y Balón de Oro del 10 al 1). */

/* ---------- once por puestos en un campo ---------- */
var XISLOT={POR:[[50,88]],DFC:[[37,70],[63,70],[50,74]],LI:[[13,63]],LD:[[87,63]],MCD:[[50,55],[35,57]],MC:[[29,45],[71,45],[50,47]],MP:[[50,36]],EI:[[15,20]],ED:[[85,20]],DC:[[50,14],[35,16],[65,16]]};
/* las animaciones solo se ven la primera vez que se pinta cada ventana (los avisos repintan la pantalla) */
function animCls(key){if(UI.animSeen===key)return ' noanim';setTimeout(function(){UI.animSeen=key;},4500);return '';}
function xiPitchHTML(xi,cap){
 var used={},h='<div class="xpitch" role="img" aria-label="'+esc(cap||'Once ideal')+'">';
 xi.forEach(function(x,i){var g=posGroup(x.p),sl=XISLOT[g]||XISLOT.MC,k=used[g]||0;used[g]=k+1;var xy=sl[k%sl.length];
  if(k>=sl.length)xy=[xy[0]+(k-sl.length+1)*9,xy[1]+4];
  var nm=String(x.n).split(' ');nm=nm.length>1?nm[0].charAt(0)+'. '+nm.slice(1).join(' '):nm[0];
  h+='<div class="xp gin'+(x.me?' me':'')+'" style="left:'+xy[0]+'%;top:'+xy[1]+'%;animation-delay:'+(0.15+i*0.12).toFixed(2)+'s"><b>'+esc(nm)+'</b><span>'+esc(x.c||'')+(x.r!=null?' · '+ds(x.r):'')+'</span></div>';});
 return h+'</div>';
}

/* ---------- equipo del mes ---------- */
function monthQueue(m,lg){S.popQ=(S.popQ||[]).filter(function(q){return q.k!=='month';});S.popQ.push({k:'month',s:S.season,m:m,lg:lg.id});}
function monthPopHTML(P){
 var a=(S.aw||[]).filter(function(x){return x.k==='TOM'&&x.s===P.s&&x.m===P.m&&x.lg===P.lg;})[0],lg=byId(S.lgs,P.lg);
 if(!a||!lg)return '';var mine=a.xi.some(function(x){return x.me;}),b=a.best;
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Equipo del mes"><div class="card pop gala'+animCls('m'+P.s+'_'+P.m)+'">'+
  '<span class="badge">'+MONTHS[P.m].toUpperCase()+' · '+esc(lg.n).toUpperCase()+'</span><h2 style="margin:6px 0">Equipo del mes</h2>'+
  (mine?'<p class="good" style="margin:0 0 6px">¡Estás en el once del mes!</p>':'')+xiPitchHTML(a.xi,'Equipo del mes')+
  (b?'<div class="galaitem gin" style="animation-delay:1.6s"><span class="mut small">Jugador del mes</span><b class="'+(b.me?'star':'')+'">'+esc(b.n)+(b.me?' (tú)':'')+'</b><span class="small mut">'+esc(b.c)+' · '+POS[b.p]+'</span></div>':'')+
  '<button class="go block" data-a="popclose" style="margin-top:12px">Seguir</button></div></div>';
}

/* ---------- gala de fin de temporada ---------- */
function galaCard(t,x,extra,d){if(!x)return '';return '<div class="galaitem gin'+(x.me?' me':'')+'" style="animation-delay:'+d.toFixed(2)+'s"><span class="mut small">'+t+'</span><b>'+esc(x.n)+(x.me?' (tú)':'')+'</b><span class="small mut">'+esc(x.c||'')+(extra?' · '+extra:'')+'</span></div>';}
function galaSlides(m){
 var s=m.season,aw=(S.aw||[]).filter(function(a){return a.s===s;}),out=[];
 var myLg=S.lgs.filter(function(l){return l.n===m.league;})[0],toy=function(lg){return aw.filter(function(a){return a.k==='TOY'&&a.lg===lg.id;})[0];};
 if(myLg){var T=toy(myLg);if(T){
  out.push({t:'Premios de la '+myLg.n,h:'<div class="galagrid">'+galaCard('Máximo goleador',T.top,T.top?T.top.r+' goles':'',0.3)+galaCard('Máximo asistente',T.ast,T.ast?T.ast.r+' asistencias':'',0.9)+galaCard('Mejor jugador',T.mvp,T.mvp?'nota '+ds(T.mvp.r):'',1.5)+galaCard('Mejor jugador joven',T.yng,T.yng?'nota '+ds(T.yng.r):'',2.1)+'</div>'});
  if(T.xi&&T.xi.length)out.push({t:'Equipo de la temporada · '+myLg.n,h:xiPitchHTML(T.xi)});}}
 /* grandes ligas */
 var big=S.lgs.filter(function(l){return l.t===1&&LGCO[l.co]&&LGCO[l.co][0]>=1.5&&l!==myLg;}),rows='';
 big.forEach(function(l,i){var T=toy(l),ch=(S.champs||[]).filter(function(c){return c.s===s&&c.lg===l.id;})[0];if(!T)return;
  rows+='<div class="galarow gin" style="animation-delay:'+(0.3+i*0.4).toFixed(2)+'s"><b>'+esc(l.n)+'</b><span>Campeón: '+(ch?esc(S.clubs[ch.c].n):'—')+'</span><span>Mejor: '+(T.mvp?esc(T.mvp.n):'—')+'</span><span>Goleador: '+(T.top?esc(T.top.n)+' ('+T.top.r+')':'—')+'</span></div>';});
 if(rows)out.push({t:'Las grandes ligas',h:'<div class="galarows">'+rows+'</div>'});
 /* Europa */
 var eu=aw.filter(function(a){return a.k==='TOC'&&/^E/.test(a.comp);});
 if(eu.length)out.push({t:'Competiciones europeas',h:'<div class="galarows">'+eu.map(function(a,i){return '<div class="galarow gin" style="animation-delay:'+(0.3+i*0.5).toFixed(2)+'s"><b>'+esc(a.n)+'</b><span>Campeón: '+(a.win?esc(a.win):'—')+'</span><span>Mejor: '+(a.mvp?esc(a.mvp.n)+(a.mvp.me?' (tú)':''):'—')+'</span><span>Goleador: '+(a.top?esc(a.top.n)+' ('+a.top.r+')':'—')+'</span></div>';}).join('')+'</div>'});
 var E=aw.filter(function(a){return a.k==='TOYE';})[0];
 if(E&&E.xi.length)out.push({t:'Equipo europeo de la temporada',h:xiPitchHTML(E.xi)+galaCard('Mejor jugador de Europa',E.best,'',1.8)});
 /* selecciones */
 var nt=aw.filter(function(a){return a.k==='TOC'&&/^(WC|EC|NC)$/.test(a.comp);});
 if(nt.length)out.push({t:'Torneos de selecciones',h:'<div class="galarows">'+nt.map(function(a,i){return '<div class="galarow gin" style="animation-delay:'+(0.3+i*0.5).toFixed(2)+'s"><b>'+esc(a.n)+'</b><span>Campeón: '+(a.win?esc(a.win):'—')+'</span><span>Mejor: '+(a.mvp?esc(a.mvp.n):'—')+'</span><span>Goleador: '+(a.top?esc(a.top.n)+' ('+a.top.r+')':'—')+'</span></div>';}).join('')+'</div>'});
 var W=aw.filter(function(a){return a.k==='TOYW';})[0];
 if(W&&W.xi.length)out.push({t:'Equipo mundial del año',h:xiPitchHTML(W.xi)});
 /* Bota de Oro y Balón de Oro */
 var B=(S.bdo||[]).filter(function(b){return b.s===s;})[0];
 if(B){
  if(B.bota)out.push({t:'Bota de Oro',h:'<div class="galabig gin" style="animation-delay:.4s"><span class="mut">Bota de Oro '+s+'</span><b class="'+(B.bota.me?'star':'')+'">'+esc(B.bota.n)+(B.bota.me?' (tú)':'')+'</b><span>'+esc(B.bota.c)+' · '+B.bota.r+' goles</span><span class="small mut">Puntos según el coeficiente de cada liga: LaLiga y Premier ×2, Bundesliga y Serie A ×1,9, Ligue 1 ×1,8, Portugal y Países Bajos ×1,5.</span></div>'});
  var top=B.top.slice(0,10),n=top.length,list='';
  for(var i=n-1;i>=1;i--){var x=top[i],d=0.3+(n-1-i)*0.45;list+='<div class="galarow bo gin'+(x.me?' me':'')+'" style="animation-delay:'+d.toFixed(2)+'s"><b class="num">'+(i+1)+'º</b><span>'+esc(x.n)+(x.me?' (tú)':'')+'</span><span class="mut">'+esc(x.c)+'</span></div>';}
  var w=top[0];if(w)list+='<div class="galabig gin win'+(w.me?' me':'')+'" style="animation-delay:'+(0.6+(n-1)*0.45).toFixed(2)+'s"><span class="mut">Balón de Oro '+s+'</span><b class="star">'+esc(w.n)+(w.me?' (tú)':'')+'</b><span>'+esc(w.c)+' · '+natName(w.nat)+'</span></div>';
  out.push({t:'Balón de Oro',h:'<div class="galarows">'+list+'</div>'+(B.me>1?'<p class="small gin" style="animation-delay:'+(1.2+n*0.45).toFixed(2)+'s">Tú quedas '+B.me+'º.</p>':B.me===1?'':'<p class="small mut">No entras entre los 30 primeros.</p>')});
 }
 return out;
}
function galaHTML(m){
 var sl=galaSlides(m);if(!sl.length){m.galaDone=1;return '';}
 var i=clamp(UI.galaI||0,0,sl.length-1),x=sl[i];
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Gala de la temporada"><div class="card pop gala'+animCls('g'+m.season+'_'+i)+'">'+
  '<div class="rowb"><span class="badge">GALA DE LA TEMPORADA '+m.season+'</span><span class="small mut">'+(i+1)+' / '+sl.length+'</span></div>'+
  '<h2 class="gin" style="margin:8px 0 10px">'+x.t+'</h2>'+x.h+
  '<div class="btns" style="margin-top:14px"><button class="go" data-a="galanext">'+(i<sl.length-1?'Siguiente':'Ver tu temporada')+'</button><button class="go alt" data-a="galaskip">Saltar la gala</button></div></div></div>';
}
function galaNext(){var m=S.summary;if(!m)return;var n=galaSlides(m).length;UI.galaI=(UI.galaI||0)+1;if(UI.galaI>=n){m.galaDone=1;UI.galaI=0;save();}render();}
function galaSkip(){if(S.summary){S.summary.galaDone=1;UI.galaI=0;save();}render();}
