/* Estrella del Balón · Hitos: trofeos y premios individuales de toda la carrera,
   cada uno con su temporada, club y división (con su nivel). Se guardan en S.hitos (premios.js · hito). */
var HCAT=[
 /* trofeos */
 {k:'liga',g:'t',n:'Ligas'},{k:'asc',g:'t',n:'Ascensos'},{k:'copa',g:'t',n:'Copas'},{k:'euro',g:'t',n:'Competiciones europeas'},{k:'sel',g:'t',n:'Títulos con la selección'},
 /* premios mundiales y europeos */
 {k:'bdo',g:'w',n:'Balón de Oro'},{k:'bdop',g:'w',n:'Podios del Balón de Oro'},{k:'bota',g:'w',n:'Bota de Oro'},{k:'bdoy',g:'w',n:'Mejor joven del mundo'},
 {k:'wxi',g:'w',n:'Equipo mundial del año'},{k:'eum',g:'w',n:'Mejor jugador de Europa'},{k:'eux',g:'w',n:'Equipo europeo de la temporada'},
 /* premios de liga */
 {k:'mvp',g:'l',n:'Mejor jugador de la liga'},{k:'pich',g:'l',n:'Máximo goleador de la liga'},{k:'ast',g:'l',n:'Máximo asistente de la liga'},{k:'yng',g:'l',n:'Mejor joven de la liga'},
 {k:'toy',g:'l',n:'Equipo de la temporada de la liga'},{k:'pom',g:'l',n:'Jugador del mes'},{k:'tom',g:'l',n:'Equipo del mes'},
 /* torneos */
 {k:'tocm',g:'c',n:'Mejor jugador de un torneo'},{k:'tocg',g:'c',n:'Máximo goleador de un torneo'},{k:'toc',g:'c',n:'Equipo ideal de un torneo'},
 /* vida */
 {k:'cap',g:'v',n:'Capitán de tu club'},{k:'capn',g:'v',n:'Capitán de la selección'},{k:'boda',g:'v',n:'Boda'},{k:'hijo',g:'v',n:'Hijos'}
];
var HGRP=[['t','Trofeos'],['w','Premios mundiales y europeos'],['l','Premios de liga'],['c','Premios en copas europeas y torneos'],['v','Capitanías y vida']];
/* partidas anteriores: se reconstruyen desde el palmarés y la trayectoria (sin nivel de la división) */
function hitosMig(){
 if(S.hitos)return S.hitos;
 var lgn={};S.lgs.forEach(function(l){lgn[l.n]=l;});
 var cat=function(t){var n=t.n,rest=n.split(' · ')[1]||'',isL=!!lgn[rest];
  if(t.k==='liga')return 'liga';if(t.k==='sel')return 'sel';
  if(t.k!=='ind')return /Champions|Europa|Conference|Copa de Europa|Liga de Campeones/i.test(n)?'euro':'copa';
  if(/^Balón de Oro/.test(n))return 'bdo';if(/^Podio del Balón/.test(n))return 'bdop';if(/joven del mundo/.test(n))return 'bdoy';if(/^Bota de Oro/.test(n))return 'bota';
  if(/^Equipo mundial/.test(n))return 'wxi';if(/^Jugador del mes/.test(n))return 'pom';if(/^Equipo del mes/.test(n))return 'tom';
  if(/^Equipo de la temporada · /.test(n))return 'toy';if(/^Mejor jugador joven/.test(n))return 'yng';if(/^Máximo asistente/.test(n))return 'ast';
  if(/^Máximo goleador/.test(n))return isL?'pich':'tocg';if(/^Mejor jugador · /.test(n))return isL?'mvp':'tocm';if(/^Equipo ideal/.test(n))return 'toc';return null;};
 S.hitos=[];
 (S.trophies||[]).forEach(function(t){var k=cat(t);if(!k)return;var h=(S.hist||[]).filter(function(x){return x.season===t.s;})[0],L=h?lgn[h.lg]:null;
  var m=/\(([A-Za-zé]+)\)/.exec(t.n);
  S.hitos.push({k:k,s:t.s,t:t.n,club:h?h.club:'',lg:h?h.lg:'',tier:L?L.t:0,niv:0,m:(k==='pom'||k==='tom')&&m?m[1]:undefined});});
 return S.hitos;
}
function hitoWhere(h){
 var p=[];if(h.club)p.push(esc(h.club));
 if(h.lg)p.push(esc(h.lg)+(h.tier?' ('+h.tier+'ª división'+(h.niv?', nivel '+h.niv:'')+')':''));
 return p.join(' · ');
}
function viewHitos(){
 var H=hitosMig(),by={};H.forEach(function(h){(by[h.k]=by[h.k]||[]).push(h);});
 var big=['bdo','bota','pom','tom','toy','eux','wxi','liga','copa','euro','asc','sel'];
 var h='<div class="card wide"><div class="rowb"><h3 style="margin:0">Tu carrera en cifras</h3><div class="btns" style="margin:0"><button class="go" data-a="share">Compartir mi carrera</button>'+(S.retired?'<button class="go alt" data-a="retshow">Resumen final</button>':'')+'</div></div>'+careerHTML(careerStats())+'</div>';
 h+='<div class="card wide"><h3>Resumen de tu carrera</h3><div class="kv hitkv">'+big.map(function(k){var c=HCAT.filter(function(x){return x.k===k;})[0],n=(by[k]||[]).length;return '<div class="'+(n?'':'mut')+'"><b class="num'+(n&&(c.g==='w'||c.g==='t')?' star':'')+'">'+n+'</b><span>'+c.n+'</span></div>';}).join('')+'</div>'+
  '<p class="small mut" style="margin-bottom:0">Cada hito guarda la temporada, el club y la división (con su nivel medio) en la que lo conseguiste.</p></div>';
 HGRP.forEach(function(g){
  var cs=HCAT.filter(function(c){return c.g===g[0]&&(by[c.k]||[]).length;});
  h+='<div class="card"><h3>'+g[1]+'</h3>';
  if(!cs.length){h+='<p class="small mut">'+(g[0]==='t'?'Aún no has ganado ningún título.':'Todavía nada. ¡A por ello!')+'</p></div>';return;}
  cs.forEach(function(c){var L=by[c.k],per={};
   L.forEach(function(x){var key=x.lg||'—';per[key]=(per[key]||0)+1;});
   var chips=Object.keys(per).length>1?'<div class="hitchips">'+Object.keys(per).map(function(k){return '<span class="lv">'+esc(k)+' ×'+per[k]+'</span>';}).join(' ')+'</div>':'';
   h+='<details class="hit"'+(L.length<=3?' open':'')+'><summary><b>'+c.n+'</b><span class="num star">×'+L.length+'</span></summary>'+chips+
    L.slice().reverse().map(function(x){return '<div class="ev"><b class="num" style="min-width:42px">T'+x.s+'</b><span>'+(x.m?esc(x.m)+' · ':'')+(c.g==='t'||c.g==='c'||c.k==='bota'||c.k==='bdop'?esc(x.t)+(hitoWhere(x)?' · ':''):'')+'<span class="mut">'+hitoWhere(x)+'</span></span></div>';}).join('')+'</details>';});
  h+='</div>';
 });
 /* Balón de Oro temporada a temporada */
 var B=(S.bdo||[]).filter(function(b){return b.s>=((S.hist[0]||{}).season||1);});
 if(B.length)h+='<div class="card"><h3>Tu puesto en el Balón de Oro</h3><div class="hitchips">'+B.map(function(b){return '<span class="lv'+(b.me===1?' star':'')+'">T'+b.s+': '+(b.me?b.me+'º':'—')+'</span>';}).join(' ')+'</div></div>';
 return h;
}
