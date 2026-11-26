/* Estrella del Balón · Inicio (resumen y bandeja) y secciones agrupadas.
   Cinco pestañas: Inicio, Partido, Jugador (entreno, material, aspecto), Carrera (club, competiciones, trayectoria)
   y Vida (relaciones y redes, negocio). */
var SUBS={
 player:[['train','Entreno'],['shop','Material'],['look','Aspecto']],
 career:[['club','Club'],['comp','Competiciones'],['hist','Trayectoria'],['hitos','Hitos']],
 life:[['team','Equipo'],['red','Redes y publicidad'],['agent','Representante']],
 biz:[['res','Resumen'],['spon','Patrocinios'],['emp','Empresas']]
};
/* pestañas antiguas (partidas guardadas) → pestaña y sección nuevas */
var OLDTAB={train:['player','train'],shop:['player','shop'],comp:['career','comp'],club:['career','club'],money:['biz','res']};
function normTab(){
 if(S.pot==null||S.val==null||(S.skills[0]&&S.skills[0].gr==null))initProgress();
 ctr();bizMig();hitosMig();
 if(OLDTAB[S.tab]){var o=OLDTAB[S.tab];S.tab=o[0];subSet(o[0],o[1]);}
 if(S.sub&&S.sub.life==='money'){S.sub.life='team';if(S.tab==='life'){S.tab='biz';subSet('biz','res');}}
 if(S.sub&&S.sub.life==='rel')S.sub.life='team';
 if(S.tab==='career'&&!S.sub)subSet('career','hist');
 if(['home','match','player','career','life','biz'].indexOf(S.tab)<0)S.tab='home';
}
function subOf(tab){S.sub=S.sub||{};return S.sub[tab]||SUBS[tab][0][0];}
function subSet(tab,s){S.sub=S.sub||{};S.sub[tab]=s;}
function subTabs(tab){var cur=subOf(tab);return '<div class="subtabs wide" role="tablist" aria-label="Secciones">'+SUBS[tab].map(function(s){var on=s[0]===cur;return '<button role="tab" aria-selected="'+on+'" class="'+(on?'on':'')+'" data-a="sub" data-k="'+tab+'" data-id="'+s[0]+'">'+s[1]+'</button>';}).join('')+'</div>';}

function lookCard(){
 var kit=clubColors(myClub());
 return '<div class="card wide"><h3>Tu aspecto</h3><p class="small mut" style="margin-top:0">Cambia peinado, barba, camiseta, medias y más cuando quieras. La altura no se puede cambiar y los tatuajes se pueden añadir, pero no quitar.</p>'+lookEditor(S.look,'game',kit)+'</div>';
}
function viewPlayer(){var s=subOf('player');return subTabs('player')+(s==='shop'?viewShop():s==='look'?lookCard():viewTrain());}
function viewCareerHub(){var s=subOf('career');return subTabs('career')+(s==='club'?viewClub():s==='comp'?viewComp():s==='hitos'?viewHitos():viewCareer());}
function viewLifeHub(){return subTabs('life')+viewLife();}

/* ---------- bandeja: lo que está pendiente ---------- */
function pendingItems(){
 var p=[];
 if(S.match)p.push({k:'hl',t:'Tienes un partido en juego.',go:'match',btn:'Ir al partido'});
 if(S.press)p.push({k:'hl',t:'Te espera una rueda de prensa.',go:'match',btn:'Responder'});
 if(newTraitSlot())p.push({k:'hl',t:'Puedes elegir un rasgo nuevo.',go:'player',sub:'train',btn:'Elegir rasgo'});
 if(S.neg)p.push({k:'hl',t:'Tienes una negociación de contrato abierta.',go:'life',sub:'team',btn:'Negociar'});
 if(S.bm)p.push({k:'hl',t:'La directiva quiere reunirse contigo: '+BM[S.bm.k].t.toLowerCase()+'.',go:'life',sub:'team',btn:'Ir a la reunión'});
 if(S.contract&&S.contract.years<=1&&!S.bm&&!S.neg)p.push({k:'bad',t:'Último año de contrato: si no renuevas, al acabar la temporada quedarás libre.',go:'life',sub:'team',btn:'Ver contrato'});
 if(S.event)p.push({t:EVENTS[S.event.i].t+'.',go:'life',sub:'team',btn:'Decidir'});
 if(windowOpen()&&S.offers.length)p.push({t:S.offers.length+(S.offers.length>1?' clubes quieren ficharte':' club quiere ficharte')+' y el mercado está abierto.',go:'career',sub:'club',btn:'Ver ofertas'});
 if(S.sofs.length)p.push({t:S.sofs.length+(S.sofs.length>1?' marcas quieren':' marca quiere')+' patrocinarte.',go:'biz',sub:'spon',btn:'Ver propuestas'});
 if((S.ads||[]).length)p.push({t:S.ads.length+(S.ads.length>1?' campañas de publicidad esperan':' campaña de publicidad espera')+' tu respuesta.',go:'life',sub:'red',btn:'Ver campañas'});
 S.spons.forEach(function(s){if(s.done<s.posts)p.push({t:byId(BRANDS,s.id).n+': te faltan '+(s.posts-s.done)+' publicación(es) este mes.',go:'life',sub:'red',btn:'Publicar'});});
 var free=ACTS.filter(function(a){return actState(a).ok;}).length;
 if(S.acts>0&&free)p.push({t:'Te quedan '+S.acts+' acciones esta semana ('+free+' disponibles).',go:'life',sub:'team',btn:'Ver acciones'});
 if(S.injured>0)p.push({k:'bad',t:'Estás lesionado: '+S.injured+' semana(s) de baja.'});
 else if(S.energy<35)p.push({k:'bad',t:'Energía baja ('+Math.round(S.energy)+' %): rindes menos y te puedes lesionar.'});
 if(S.moral<35)p.push({k:'bad',t:'Moral baja ('+S.moral+'). Un buen partido o una rueda de prensa positiva ayudan.'});
 return p;
}
function unreadN(){return Math.max(0,(S.logN||0)-(S.logSeen||0));}
function homeBadge(){return pendingItems().filter(function(x){return x.go;}).length+unreadN();}

function formChips(){
 var f=S.form||[];if(!f.length)return '<span class="small mut">Sin partidos todavía.</span>';
 return f.map(function(r){var c=r>=7.5?'f-top':r>=6.5?'f-good':r>=5.5?'f-mid':'f-bad';return '<span class="fchip '+c+'" title="Nota '+ds(r)+'">'+ds(r)+'</span>';}).join('');
}
function viewHome(){
 var me=S.pl[S.me],c=myClub(),kit=clubColors(c),lg=lgOf(c.id),tb=table(lg),pos=tb.indexOf(c)+1,en=Math.round(S.energy),un=unreadN();
 var h='<div class="card wide herocard"><div class="hero2"><div class="hfig">'+portraitSVG(S.look,kit,120,'Retrato de '+S.name)+'</div><div class="hinfo">'+
  '<b class="hname">'+esc(S.name)+'</b><span class="mut">'+POS[S.pos]+' · '+S.age+' años · '+natName(me.nat)+'</span>'+
  '<span class="hclub">'+crestSVG(c,22)+esc(c.n)+' <span class="mut small">· '+esc(lg.n)+', '+pos+'º</span></span>'+
  '<div class="hstats"><div><b class="star num">'+ds(overall())+'</b><span>Valoración</span></div><div><b class="good num">'+fmv(mv(me))+'</b><span>Valor</span></div><div><b class="num">'+Math.round(starterP(c)*100)+'%</b><span>Titular</span></div></div>'+
  '<div class="hform"><span class="small mut">Forma</span>'+formChips()+'</div></div>'+
  '<div class="hbars"><div class="rowb small"><span>Energía</span><span class="num">'+en+'%</span></div><div class="bar big en '+(en<30?'low':'')+'"><i style="width:'+en+'%"></i></div>'+
  '<div class="rowb small" style="margin-top:8px"><span>Moral</span><span class="num">'+S.moral+'</span></div><div class="bar big '+(S.moral<35?'low':'en')+'"><i style="width:'+S.moral+'%"></i></div></div></div></div>';
 /* próximo partido */
 h+='<div class="card"><h3>Próximo partido</h3>'+nextInfo()+(S.match||S.press?'<button class="go block" data-a="go" data-id="match" style="margin-top:10px">Ir al partido</button>':
  '<div class="btns" style="margin-top:10px"><button class="go" data-a="play" data-n="1">Jugar siguiente</button><button class="go alt" data-a="go" data-id="match">Ver partido</button></div>')+'</div>';
 /* pendiente */
 var P=pendingItems();
 h+='<div class="card"><h3>Pendiente</h3>'+(P.length?P.map(function(x){return '<div class="item"><div><p style="margin:0;color:var(--'+(x.k==='bad'?'bad':x.k==='hl'?'gold':'txt')+')">'+x.t+'</p></div>'+(x.go?'<button class="go alt" data-a="go" data-id="'+x.go+'"'+(x.sub?' data-k="'+x.sub+'"':'')+'>'+x.btn+'</button>':'<span></span>')+'</div>';}).join(''):'<p class="small mut">Todo al día.</p>')+'</div>';
 /* novedades */
 h+='<div class="card"><div class="rowb"><h3 style="margin:0">Novedades'+(un?' <span class="badge">'+un+' nuevas</span>':'')+'</h3>'+(un?'<button class="chip" data-a="seen">Marcar leídas</button>':'')+'</div>';
 S.log.slice(0,8).forEach(function(l,i){h+='<div class="ev'+(i<un?' new':'')+'"><b style="min-width:74px;font-size:13px">'+l.t+'</b><span>'+esc(l.m)+'</span></div>';});
 h+='<button class="lnk small" data-a="go" data-id="career" data-k="hist" style="margin-top:8px">Ver todas en Trayectoria</button></div>';
 /* liga */
 var top=tb.slice(0,5);if(pos>5)top.push(c);
 h+='<div class="card"><h3>'+esc(lg.n)+'</h3><div class="tw"><table><tr><th>#</th><th>Club</th><th>PJ</th><th>Pts</th></tr>'+top.map(function(x){var i=tb.indexOf(x)+1;return '<tr class="'+(x===c?'mine':'')+'"><td class="num">'+i+'</td><td>'+clubLink(x)+'</td><td class="num">'+x.pj+'</td><td class="num">'+x.pts+'</td></tr>';}).join('')+'</table></div>'+
  '<button class="lnk small" data-a="go" data-id="career" data-k="comp" style="margin-top:8px">Ver clasificación completa</button></div>';
 return h;
}
