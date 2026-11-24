/* Estrella del Balón · vistas. Cada pestaña es una función que devuelve HTML. */
var UI={comp:null,ctab:'tabla',shop:'botas',stype:'',sq:null,reset:false,lastTab:''};

function stars(l){var f=Math.min(5,Math.ceil(l/(MAXL/5))),s='';for(var i=0;i<5;i++)s+=i<f?'★':'<em>★</em>';return s;}
function myClub(){return S.clubs[S.pl[S.me].c];}
function natName(id){var n=nation(id);return n?n.n:id;}
function teamN(id,nat){return nat?natName(id):S.clubs[id].n;}
function pName(p){return p.me?esc(S.name)+' (tú)':esc(p.n);}
function chip(on,a,id,txt,n){return '<button class="chip '+(on?'on':'')+'" aria-pressed="'+!!on+'" data-a="'+a+'"'+(id!=null?' data-id="'+esc(id)+'"':'')+(n!=null?' data-n="'+n+'"':'')+'>'+txt+'</button>';}

/* ---------- Partido ---------- */
function pressCard(){
 var P=S.press,q=PRESS[P.qs[P.i]];
 var h='<div class="card" style="border-color:var(--gold)"><h3>Rueda de prensa · '+esc(P.ctx||'')+'</h3><p style="margin:0 0 10px">«'+q.q+'»</p>';
 q.a.forEach(function(a,i){var fx=Object.keys(a.fx).map(function(k){var v=a.fx[k];if(k==='fol')return 'Seguidores +'+Math.round(v*100)+'%';if(k==='moral')return 'Moral '+(v>0?'+':'')+v*2;if(k==='rumor')return 'Atrae ofertas';return REL_INFO[k][0]+' '+(v>0?'+':'')+v;}).join(' · ');
  h+='<button class="opt" data-a="press" data-i="'+i+'">'+a.n+'<div class="small mut">'+fx+'</div></button>';});
 return h+'<button class="chip" data-a="pressskip">No hablar con la prensa (−2 prensa)</button> <span class="small mut">Pregunta '+(P.i+1)+' de '+P.qs.length+'</span></div>';
}
function decisionCard(){
 var M=S.match,d=nextDec(M),sc=scoreAt(M,d.min),main=S.pl[d.main];
 var h='<div class="card wide hl"><div class="rowb"><h3 style="margin:0">Minuto '+d.min+"'"+(d.dec?' · <span class="bad">JUGADA DECISIVA</span>':'')+'</h3><b class="num">'+esc(M.hn)+' '+sc[0]+' - '+sc[1]+' '+esc(M.an)+'</b></div>';
 h+='<p style="margin:8px 0 4px">'+d.sit+'</p><div class="small" style="margin-bottom:10px">Te enfrentas a <b class="star">'+esc(main.n)+'</b> <span class="mut">('+POS[main.p]+', '+main.a+' años, valoración '+main.o+')</span>'+(d.dec?'. Si sale bien o mal, pesa el doble en tu nota y en el resultado.':'')+'</div>';
 h+='<div class="duel"><div>';
 d.opts.forEach(function(o,i){var pr=duelP(o),rk=['bajo','medio','alto'][o.rk],op=S.pl[o.op];
  var mine=o.sk.map(function(id){return (SKNAME[id]||id)+' '+Math.round(skv(id));}).join(' · ');
  var his=oppVals(o).map(function(x){return x[0]+' '+x[1];}).join(' · ');
  h+='<button class="opt" data-a="choose" data-i="'+i+'"><div class="rowb"><span>'+o.n+'</span><span class="num" style="color:'+(pr>0.6?'var(--good)':pr>0.4?'var(--gold)':'var(--bad)')+'">'+Math.round(pr*100)+'%</span></div>'+
   '<div class="small mut" style="font-family:var(--fb);font-weight:400">Riesgo '+rk+(o.shot?' · disparo':'')+' · Tú: '+mine+'<br>Contra '+esc(op.n)+' ('+op.p+'): '+his+'</div></button>';});
 h+='</div><div>'+oppCard(d)+'</div></div>';
 M.decs.filter(function(x){return x.done>=0;}).forEach(function(x){h+='<div class="ev"><b class="num">'+x.min+"'</b><span>"+x.opts[x.done].n+': <b class="'+(x.ok?'good':'bad')+'">'+esc(x.res)+'</b></span></div>';});
 return h+'</div>';
}
/* ficha del rival en ese momento: forma del día y cansancio según el minuto */
function oppCard(d){
 var p=S.pl[d.main],o=d.opts.filter(function(x){return x.op===d.main;})[0]||d.opts[0],min=d.min,fm=o.fm||0;
 var ids=[];(p.p==='POR'?['ref','uno','cap','aer','arr','pos']:['ace','vel','fue','res']).forEach(function(x){ids.push(x);});
 Object.keys(EMP[p.p]||{}).forEach(function(x){if(ids.indexOf(x)<0)ids.push(x);});
 d.opts.forEach(function(x){if(x.op===d.main)x.ok.forEach(function(k){if(ids.indexOf(k)<0)ids.push(k);});});
 ids=ids.slice(0,12);
 var tired=Math.round((1-tiredF(p,'ace',min))*100);
 var h='<div class="card" style="margin:6px 0 10px;background:rgba(0,0,0,.18)"><div class="rowb"><b>Ficha de '+esc(p.n)+' ahora</b><span class="small mut">'+POS[p.p]+' · '+p.o+' · '+fmv(mv(p))+'</span></div>'+
  '<div class="small mut" style="margin-bottom:6px">Minuto '+min+"' · cansancio "+(tired?'−'+tired+'% en lo físico':'ninguno')+' · forma del día '+(fm>0?'+':'')+fm+'</div><div class="g2">';
 ids.forEach(function(id){var base=pskill(p,id),now=pskillNow(p,id,min,fm),used=d.opts.some(function(x){return x.op===d.main&&x.ok.indexOf(id)>=0;});
  h+='<div class="rowb small"><span'+(used?' style="color:var(--gold)"':'')+'>'+(SKNAME[id]||id)+'</span><b class="num">'+now+(now!==base?' <span class="mut" style="font-weight:400">('+base+')</span>':'')+'</b></div>';});
 return h+'</div><div class="small mut" style="margin-top:6px">En dorado, las habilidades que cuentan en esta jugada. Entre paréntesis, su valor sin cansancio ni forma.</div></div>';
}
function keyRival(desc){
 var me=S.pl[S.me];var oppId=desc.h===(desc.nat?me.nat:me.c)?desc.a:desc.h;
 var xi=desc.nat?natXI(oppId):clubXI(S.clubs[oppId]);var set=SITS[SITKEY[S.pos]][0];
 var g=set.v,grp=g==='LAT'?(S.pos==='EI'||S.pos==='VI'?'LD':'LI'):g==='EXT'?(S.pos==='LI'?'ED':'EI'):g;
 var c=xi.map(function(i){return S.pl[i];}).filter(function(p){return posGroup(p.p)===grp;}).sort(function(a,b){return b.o-a.o;})[0];
 if(!c)return '';
 var vals=set.o[0].ok.concat(set.o[1].ok).filter(function(x,i,a){return a.indexOf(x)===i;}).slice(0,3).map(function(id){return (SKNAME[id]||id)+' '+pskill(c,id);}).join(' · ');
 return '<div class="small" style="margin-top:8px">Duelo clave: <b class="star">'+esc(c.n)+'</b> <span class="mut">('+POS[c.p]+', '+c.o+') · '+vals+'</span></div>';
}
function nextInfo(){
 var nm=myNextMatch(),sl=S.cal[S.slot],me=S.pl[S.me];
 if(!sl)return '<p class="mut">Fin de temporada.</p>';
 if(!nm)return '<p class="small mut">'+slotLabel(sl)+'. Tu equipo no juega esta semana: entrenas y cobras igual.</p>';
 if(nm.h!=null){var H=S.clubs[nm.h],A=S.clubs[nm.a];return '<div class="small mut">'+compName(nm.ck)+' · '+nm.rn+'</div><div class="vs"><b>'+crestSVG(H,44)+'<br>'+esc(H.n)+'</b><span class="mut">vs</span><b>'+crestSVG(A,44)+'<br>'+esc(A.n)+'</b></div>'+keyRival(nm);}
 if(nm.cup){var cu=S.cups[myClub().co];return '<div class="small mut">'+cu.n+' · quedan '+cu.alive.length+' equipos. El sorteo se hace al jugar.</div>';}
 if(nm.eu){var T=tourById(nm.eu);return '<div class="small mut">'+T.n+' · '+tourStageName(T)+'</div>';}
 if(nm.nt){var p=Math.round(ntCallP()*100);return '<div class="small mut">Parón de selecciones. Probabilidad de convocatoria con '+natName(me.nat)+': <b class="num">'+p+'%</b>.</div>';}
 if(nm.tour){var U=tourById(nm.tour);return '<div class="small mut">'+U.n+' con '+natName(me.nat)+' · '+tourStageName(U)+'</div>';}
 return '';
}
function viewMatch(){
 if(S.retired)return '<div class="card"><h2>Carrera terminada</h2><p>Mira tu resumen en la pestaña Carrera.</p></div>';
 var h='';
 if(S.press)h+=pressCard();
 if(S.match)h+=decisionCard();
 var me=myClub(),en=Math.round(S.energy),p=Math.round(starterP(me)*100),sl=S.cal[S.slot];
 h+='<div class="card"><h3>Próximo partido</h3>'+nextInfo()+
  '<div class="rowb small" style="margin-top:8px"><span>Energía</span><span class="num">'+en+'%</span></div><div class="bar big en '+(en<30?'low':'')+'"><i style="width:'+en+'%"></i></div>'+
  '<div class="rowb small" style="margin-top:6px"><span>Moral</span><span class="num">'+S.moral+'</span></div><div class="bar big '+(S.moral<35?'low':'en')+'"><i style="width:'+S.moral+'%"></i></div>'+
  '<div class="small mut" style="margin-top:8px">'+(S.injured>0?'<span class="bad">Lesionado: '+S.injured+' semana(s) de baja.</span>':'Titular en tu club: <b class="num">'+p+'%</b> (tu valoración '+ds(overall())+' frente a tu rival por el puesto).')+'</div>'+
  '<div class="mults" style="margin-top:8px">Decisiones: '+chip(!S.auto,'auto',null,'Elegir yo',0)+chip(S.auto,'auto',null,'Automáticas',1)+'</div>';
 if(S.event)h+='<div class="small" style="margin-top:8px;color:var(--gold)">Tienes un asunto pendiente en la pestaña Vida.</div>';
 if(S.match)h+='<div class="small mut" style="margin-top:10px">Resuelve la decisión para terminar el partido.</div></div>';
 else if(S.press)h+='<div class="small mut" style="margin-top:10px">Responde a la prensa para seguir.</div></div>';
 else h+='<div class="btns" style="margin-top:12px"><button class="go full" data-a="play" data-n="1">'+(S.injured>0?'Descansar':'Jugar siguiente partido')+'</button><button class="go alt" data-a="play" data-n="5">Jugar 5 partidos</button><button class="go alt" data-a="play" data-n="99">Hasta fin de temporada</button></div></div>';
 var r=S.last;
 if(r){
  h+='<div class="card"><h3>Último partido · '+esc(r.comp)+'</h3><div class="vs"><b>'+esc(r.home)+'</b><span class="score num">'+r.gh+' - '+r.ga+'</span><b>'+esc(r.away)+'</b></div>'+(r.pw?'<div class="small mut" style="text-align:center">Gana en los penaltis '+esc(r.pw==='h'?r.home:r.away)+'</div>':'');
  h+='<div class="small mut" style="text-align:center">'+(r.role==='titular'?'Titular, 90 minutos':r.role==='suplente'?'Entras de suplente, '+r.mins+' minutos':r.role==='lesionado'?'Lesionado, no juegas':'No juegas, estás en el banquillo')+'</div>';
  r.evs.forEach(function(e){h+='<div class="ev"><b class="num">'+e.min+"'</b><span class='"+(e.me?'me':'')+"'>"+e.txt+'</span></div>';});
  if(r.decs&&r.decs.length){h+='<h3 style="margin-top:10px">Tus duelos</h3>';r.decs.forEach(function(d){h+='<div class="ev"><b class="num">'+d.min+"'</b><span>"+(d.dec?'<span class="star">◆</span> ':'')+d.n+': <b class="'+(d.ok?'good':'bad')+'">'+esc(d.res)+'</b></span></div>';});}
  h+='<div class="kv"><div><b class="num">'+(r.mins>0?ds(r.r):'-')+'</b><span>Nota</span></div>'+(S.pos==='POR'?'<div><b class="num">'+r.saves+'</b><span>Paradas</span></div>':'<div><b class="num">'+r.g+' / '+r.a+'</b><span>Goles / asist.</span></div>')+
   '<div><b class="num">'+r.pts+'</b><span>Puntos habilidad</span></div><div><b class="num good">'+fmt(r.income||0)+'</b><span>Ingresos</span></div><div><b class="num">'+r.medals+'</b><span>Medallas</span></div><div><b class="num">'+(r.inj?'Sí':'No')+'</b><span>Lesión</span></div></div>';
  var gs=Object.keys(r.gains).map(function(k){return k+' +'+r.gains[k];}).join(', ');
  if(gs)h+='<div class="small mut" style="margin-top:8px">Puntos repartidos: '+gs+'.</div>';
  if(r.costs)h+='<div class="small mut">Gastos de la semana (representante y redes): '+fmt(r.costs)+'.</div>';
  h+='</div>';
 }
 if(S.pressLast){h+='<div class="card"><h3>Última rueda de prensa</h3>';S.pressLast.ans.forEach(function(a){h+='<div class="ev" style="display:block"><div class="small mut">«'+a.q+'»</div><div>'+esc(a.a)+' <span class="small mut">('+a.fx+')</span></div></div>';});h+='</div>';}
 if(S.wres&&S.wres.length){h+='<div class="card"><h3>Otros resultados de la semana</h3>';S.wres.slice(0,14).forEach(function(x){h+='<div class="ev"><span class="small mut" style="width:120px">'+esc(compName(x.ck).replace(/ \(.*\)/,''))+'</span><span>'+esc(teamN(x.h,x.nat))+' <b class="num">'+x.gh+'-'+x.ga+'</b> '+esc(teamN(x.a,x.nat))+(x.pw?' (pen.)':'')+'</span></div>';});h+='</div>';}
 return h;
}

/* ---------- Competiciones ---------- */
function compList(){
 var me=S.pl[S.me],c=myClub(),out=[['L:'+c.co+c.t,'Mi liga']];
 out.push(['C:'+c.co,S.cups[c.co].n]);
 if(country(c.co).lg.length>1)out.push(['P:'+c.co,'Ascensos y descensos']);
 S.eu.forEach(function(T){out.push(['E:'+T.id,T.n]);});
 S.tours.forEach(function(T){out.push(['T:'+T.id,T.n]);});
 out.push(['W','Premios mundiales']);
 return out;
}
function allComps(){var out=[];S.lgs.forEach(function(lg){out.push(['L:'+lg.id,country(lg.co).n+' · '+lg.n]);});COUNTRIES.forEach(function(co){out.push(['C:'+co.id,S.cups[co.id].n]);if(co.lg.length>1)out.push(['P:'+co.id,country(co.id).n+' · ascensos y descensos']);});return out;}
function leaderTable(ck,key){
 var L=ck.charAt(0),ls=leaders(ck,key,15),nat=L==='T';
 if(!ls.length)return '<p class="mut">Todavía no hay datos.</p>';
 var h='<div class="tw"><table><tr><th>#</th><th>Jugador</th><th>'+(nat?'Selección':'Club')+'</th><th>PJ</th><th>'+(key==='g'?'Goles':key==='a'?'Asist.':'Nota')+'</th></tr>';
 ls.forEach(function(p,i){var s=stOf(p,L);h+='<tr class="'+(p.me?'mine':'')+'"><td class="num">'+(i+1)+'</td><td>'+pName(p)+' <span class="small mut">'+p.p+'</span></td><td class="small">'+esc(nat?natName(p.nat):clubName(p))+'</td><td class="num">'+s[0]+'</td><td class="num">'+(key==='g'?s[1]:key==='a'?s[2]:ds(s[3]/s[0]))+'</td></tr>';});
 return h+'</table></div>';
}
function valueTable(ck){
 var L=ck.charAt(0),k=ck.slice(2),ps;
 if(L==='L'){var set={};byId(S.lgs,k).clubs.forEach(function(id){set[id]=1;});ps=S.pl.filter(function(p){return p&&set[p.c];});}
 else if(L==='C')ps=S.pl.filter(function(p){return p&&p.c>=0&&S.clubs[p.c].co===k;});
 else{var T=tourById(k);if(!T)return '';ps=S.pl.filter(function(p){return p&&p.c>=0&&(T.kind==='nat'?T.teams.indexOf(p.nat)>=0:T.teams.indexOf(p.c)>=0);});}
 ps=ps.map(function(p){return {p:p,v:mv(p)};}).sort(function(a,b){return b.v-a.v;}).slice(0,20);
 var h='<div class="tw"><table><tr><th>#</th><th>Jugador</th><th>Club</th><th>Edad</th><th>Valor</th></tr>';
 ps.forEach(function(x,i){var p=x.p;h+='<tr class="'+(p.me?'mine':'')+'"><td class="num">'+(i+1)+'</td><td>'+pName(p)+' <span class="small mut">'+p.p+' · '+esc(natName(p.nat))+'</span></td><td class="small">'+esc(clubName(p))+'</td><td class="num">'+(p.me?S.age:p.a)+'</td><td class="num">'+fmv(x.v)+'</td></tr>';});
 return h+'</table></div>';
}
function xiHTML(xi,title){
 var h=(title?'<h3 style="margin-top:10px">'+title+'</h3>':'')+'<div class="tw"><table><tr><th>Pos</th><th>Jugador</th><th>Club</th><th>Nota</th></tr>';
 xi.forEach(function(x){h+='<tr class="'+(x.me?'mine':'')+'"><td>'+x.p+'</td><td>'+esc(x.n)+(x.me?' (tú)':'')+'</td><td class="small">'+esc(x.c)+'</td><td class="num">'+(x.r==null?'-':ds(x.r))+'</td></tr>';});
 return h+'</table></div>';
}
/* zonas de la tabla según el formato real de cada liga */
var ZCOL={ucl:'#4fa3ff',uel:'#f39c3d',uecl:'#3ddc97',up:'var(--good)',po:'#b6e36b',down:'var(--bad)',pd:'#ffb36b'};
var ZTXT={ucl:'Liga de Campeones',uel:'Liga Europa',uecl:'Conferencia',up:'ascenso directo',po:'play-off de ascenso',down:'descenso',pd:'promoción de permanencia'};
function zones(lg){
 var co=lg.co,t=lg.t,n=lg.clubs.length,z={},F=FMT[co]||[],below=F[t-1],above=t>1?F[t-2]:null,i;
 if(t===1){var q=EUQ[co]||[0,0,0],k=0;['ucl','uel','uecl'].forEach(function(x,j){for(i=0;i<q[j];i++)z[k++]=x;});}
 if(above){for(i=0;i<above.dir;i++)z[i]='up';(above.br||[]).forEach(function(p){z[p-1]='po';});(above.bar||[]).forEach(function(b){z[b[1]-1]='po';});}
 if(below){for(i=0;i<below.rel;i++)z[n-1-i]='down';if(below.up)z[below.up-1]='pd';(below.bar||[]).forEach(function(b){z[b[0]-1]='pd';});}
 return z;
}
function fmtText(co,t){
 var F=FMT[co]||[],f=F[t-1],L=country(co).lg,upN=leagueN(co,t),dnN=leagueN(co,t+1),s='';
 if(!f)return '';
 s+='Entre '+upN+' y '+dnN+': bajan directos los '+f.rel+' últimos'+(f.up?' y el '+f.up+'º juega una promoción':'')+'; suben directos los '+f.dir+' primeros';
 if(f.br)s+=(f.n===2?' y otros dos':' y uno más')+' por play-off ('+f.br[0]+'º a '+f.br[f.br.length-1]+'º'+(f.n===2?', eliminatorias a partido único':', semifinales y final')+(f.up?'; el ganador juega la promoción':'')+')';
 if(f.bar)s+='. Promociones: '+f.bar.map(function(b){return b[0]+'º de '+upN+' contra '+b[1]+'º de '+dnN;}).join(', ');
 return s+'. En las eliminatorias de play-off, si hay empate pasa el mejor clasificado; en finales y promociones hay penaltis.';
}
function leagueN(co,t){var c=country(co);return S.real&&c.rn?c.rn[t-1]:c.lg[t-1][0];}
function leagueTable(lg){
 var tb=table(lg),z=zones(lg),used={};
 var h='<div class="tw"><table><tr><th>#</th><th>Club</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>Pts</th></tr>';
 tb.forEach(function(c,i){var zz=z[i],col=zz?ZCOL[zz]:'';if(zz)used[zz]=1;
  h+='<tr class="'+(c.id===myClub().id?'mine':'')+'"><td class="num" style="'+(col?'box-shadow:inset 3px 0 0 '+col+';color:'+col:'')+'">'+(i+1)+'</td><td>'+clubLink(c)+'</td><td class="num">'+c.pj+'</td><td class="num">'+c.w+'</td><td class="num">'+c.d+'</td><td class="num">'+c.l+'</td><td class="num">'+(c.gf-c.gc)+'</td><td class="num">'+c.pts+'</td></tr>';});
 h+='</table></div><div class="small mut" style="margin-top:6px">'+Object.keys(ZTXT).filter(function(k){return used[k];}).map(function(k){return '<span style="color:'+ZCOL[k]+'">■</span> '+ZTXT[k];}).join(' · ')+'. Toca un club para ver su plantilla.</div>';
 if(lg.t===1&&EUQ[lg.co])h+='<div class="small mut" style="margin-top:4px">El campeón de copa va a la Liga Europa; si ya tiene plaza, pasa al siguiente de la tabla.</div>';
 [lg.t-1,lg.t].forEach(function(t){if(t>=1&&FMT[lg.co]&&FMT[lg.co][t-1])h+='<div class="small mut" style="margin-top:4px">'+fmtText(lg.co,t)+'</div>';});
 return h;
}
function pairsHTML(pairs,nat,leg){return pairs.map(function(p){return '<div class="ev"><span>'+esc(teamN(p.a,nat))+' vs '+esc(teamN(p.b,nat))+(p.l1?' <span class="small mut">(ida: '+esc(teamN(p.b,nat))+' '+p.l1[1]+'-'+p.l1[0]+' '+esc(teamN(p.a,nat))+')</span>':'')+'</span></div>';}).join('');}
function tourTable(T){
 var nat=T.kind==='nat',h='<div class="small mut">'+(T.win!=null?'Campeón: <b class="star">'+esc(teamN(T.win,nat))+'</b>':tourStageName(T))+'</div>';
 if(T.fmt==='lp'){
  if(T.kp&&T.kp.length)h+='<h3 style="margin-top:10px">Eliminatorias en curso</h3>'+pairsHTML(T.kp,false);
  var rs=(S.wres||[]).filter(function(x){return x.ck==='E:'+T.id;});
  if(rs.length){h+='<h3 style="margin-top:10px">Últimos resultados</h3>';rs.forEach(function(x){h+='<div class="ev"><span>'+esc(S.clubs[x.h].n)+' <b class="num">'+x.gh+'-'+x.ga+'</b> '+esc(S.clubs[x.a].n)+(x.agg?' <span class="small mut">(global '+(x.gh+x.agg[0])+'-'+(x.ga+x.agg[1])+')</span>':'')+(x.pw?' (pen.)':'')+'</span></div>';});}
  h+='<h3 style="margin-top:10px">Fase de liga ('+T.md+' jornadas)</h3><div class="tw"><table><tr><th>#</th><th>Club</th><th>PJ</th><th>DG</th><th>Pts</th></tr>';
  lpTable(T).forEach(function(id,i){var x=T.gt[id],c=S.clubs[id],col=i<8?'var(--good)':i<24?'#4fa3ff':'';
   h+='<tr class="'+(id===myClub().id?'mine':'')+'"><td class="num" style="'+(col?'box-shadow:inset 3px 0 0 '+col+';color:'+col:'')+'">'+(i+1)+'</td><td>'+clubLink(c)+' <span class="small mut">'+esc(c.guest?c.gco:country(c.co).n)+'</span></td><td class="num">'+x.pj+'</td><td class="num">'+(x.gf-x.gc)+'</td><td class="num">'+x.pts+'</td></tr>';});
  return h+'</table></div><div class="small mut" style="margin-top:6px"><span class="good">■</span> 1º a 8º, directos a octavos · <span style="color:#4fa3ff">■</span> 9º a 24º, play-off a doble partido. Octavos, cuartos y semifinales a ida y vuelta; final a partido único.</div>';
 }
 if(T.ko){h+='<h3 style="margin-top:10px">'+cupRoundName(T.ko.length)+'</h3>';for(var i=0;i<T.ko.length;i+=2)h+='<div class="ev"><span>'+esc(teamN(T.ko[i],nat))+(T.ko[i+1]!=null?' vs '+esc(teamN(T.ko[i+1],nat)):'')+'</span></div>';}
 T.groups.forEach(function(g,gi){h+='<h3 style="margin-top:10px">Grupo '+String.fromCharCode(65+gi)+'</h3><div class="tw"><table><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>Pts</th></tr>';
  gTable(T,g).forEach(function(id,i){var x=T.gt[id],mine=nat?id===S.pl[S.me].nat:id===myClub().id;h+='<tr class="'+(mine?'mine':'')+'"><td class="num">'+(i+1)+'</td><td>'+(nat?esc(natName(id)):''+clubLink(S.clubs[id])+'')+'</td><td class="num">'+x.pj+'</td><td class="num">'+(x.gf-x.gc)+'</td><td class="num">'+x.pts+'</td></tr>';});
  h+='</table></div>';});
 return h;
}
function cupTable(co){var cu=S.cups[co],cf=CUPCFG[co]||{},h='';
 h+='<div class="small mut">Eliminatorias a partido único'+(cf.low?' en casa del equipo de menor categoría':'')+(cf.sf2?', semifinales a ida y vuelta':'')+' y final en campo neutral. Participan las '+(cf.max||country(co).lg.length)+' primeras divisiones.</div>';
 if(cu.win!=null)h+='<p>Campeón: <b class="star">'+esc(S.clubs[cu.win].n)+'</b></p>';
 else{var mine=cu.alive.indexOf(myClub().id)>=0;h+='<p class="small mut">Quedan '+cu.alive.length+' equipos.'+(myClub().co===co?(mine?' Tu equipo sigue vivo.':' Tu equipo está eliminado o no participa.'):'')+'</p>';}
 if(cu.kp)h+='<h3>Semifinales</h3>'+pairsHTML(cu.kp,false);
 var rs=(S.wres||[]).filter(function(x){return x.ck==='C:'+co;});
 if(rs.length){h+='<h3>Últimos resultados</h3>';rs.forEach(function(x){h+='<div class="ev"><span>'+esc(S.clubs[x.h].n)+' <b class="num">'+x.gh+'-'+x.ga+'</b> '+esc(S.clubs[x.a].n)+(x.agg?' <span class="small mut">(global '+(x.gh+x.agg[0])+'-'+(x.ga+x.agg[1])+')</span>':'')+(x.pw?' (pen.)':'')+'</span></div>';});}
 if(cu.win==null&&cu.alive.length<=16){h+='<h3 style="margin-top:8px">Siguen en la copa</h3><div class="small">'+cu.alive.map(function(id){return esc(S.clubs[id].n);}).join(' · ')+'</div>';}
 return h;
}
/* ascensos, descensos y play-offs de un país */
function poView(co){
 var C=country(co),h='';
 for(var t=1;t<C.lg.length;t++){var B=(S.po||{})[co+t];
  h+='<h3 style="margin-top:10px">'+esc(leagueN(co,t))+' ↔ '+esc(leagueN(co,t+1))+'</h3><div class="small mut">'+fmtText(co,t)+'</div>';
  if(!B){h+='<p class="small mut">Se juega al terminar la liga.</p>';continue;}
  if(B.pairs.length)h+='<div class="small" style="margin-top:6px"><b>Ahora</b></div>'+B.pairs.map(function(p){return '<div class="ev"><span>'+esc(S.clubs[p.a].n)+' vs '+esc(S.clubs[p.b].n)+' <span class="small mut">('+(p.kind==='bar'||p.kind==='up'?'promoción':p.kind==='fin'?'final':'play-off')+')</span></span></div>';}).join('');
  if(B.log.length)h+=B.log.map(function(l){return '<div class="ev"><span>'+esc(S.clubs[l.a].n)+' - '+esc(S.clubs[l.b].n)+': pasa <b>'+esc(S.clubs[l.w].n)+'</b></span></div>';}).join('');
  h+='<div class="small" style="margin-top:6px"><span class="good">Suben:</span> '+(B.up.map(function(id){return esc(S.clubs[id].n);}).join(', ')||'-')+(B.stage!=='done'?' (y más por decidir)':'')+'</div>';
  h+='<div class="small"><span class="bad">Bajan:</span> '+(B.down.map(function(id){return esc(S.clubs[id].n);}).join(', ')||'-')+'</div>';
 }
 return h;
}function worldAwards(){
 var h='',last=S.bdo[S.bdo.length-1];
 /* ranking en directo */
 var champ={};S.lgs.forEach(function(lg){var t=table(lg)[0];if(t.pj)champ[t.id]=3*lgW(lg);});
 var live=S.pl.filter(function(p){return p&&p.c>=0;}).map(function(p){return {p:p,s:ballonScore(p,champ)};}).filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s;}).slice(0,10);
 h+='<div class="card"><h3>Balón de Oro · carrera de esta temporada</h3>'+(live.length?'<div class="tw"><table><tr><th>#</th><th>Jugador</th><th>Club</th><th>Puntos</th></tr>'+live.map(function(x,i){return '<tr class="'+(x.p.me?'mine':'')+'"><td class="num">'+(i+1)+'</td><td>'+pName(x.p)+' <span class="small mut">'+natName(x.p.nat)+'</span></td><td class="small">'+esc(clubName(x.p))+'</td><td class="num">'+Math.round(x.s)+'</td></tr>';}).join('')+'</table></div>':'<p class="mut small">Hacen falta al menos 12 partidos para entrar en la carrera.</p>')+'</div>';
 if(last){h+='<div class="card"><h3>Balón de Oro · temporada '+last.s+'</h3><div class="tw"><table><tr><th>#</th><th>Jugador</th><th>Club</th><th>Goles</th></tr>'+last.top.map(function(x,i){return '<tr class="'+(x.me?'mine':'')+'"><td class="num">'+(i+1)+'</td><td>'+esc(x.n)+' <span class="small mut">'+natName(x.nat)+'</span></td><td class="small">'+esc(x.c)+'</td><td class="num">'+x.g+'</td></tr>';}).join('')+'</table></div>'+
  '<div class="small mut" style="margin-top:6px">'+(last.me?'Tu puesto: <b>'+last.me+'º</b>. ':'No entras entre los 30 primeros. ')+(last.young?'Mejor joven: '+esc(last.young.n)+'. ':'')+(last.bota?'Bota de Oro: '+esc(last.bota.n)+' ('+last.bota.r+' goles).':'')+'</div></div>';
  var w=S.aw.filter(function(a){return a.k==='TOYW';}).pop();if(w)h+='<div class="card">'+xiHTML(w.xi,'Equipo mundial del año · T'+w.s)+'</div>';}
 else h+='<div class="card small mut">Los premios mundiales se entregan al final de cada temporada.</div>';
 var ch=S.champs.filter(function(c){return c.s===S.season-1;});
 if(ch.length){h+='<div class="card"><h3>Campeones de liga · T'+(S.season-1)+'</h3>'+ch.map(function(c){var lg=byId(S.lgs,c.lg);return '<div class="ev"><span class="small mut" style="width:150px">'+country(lg.co).n+' · '+lg.n+'</span><span>'+esc(S.clubs[c.c].n)+'</span></div>';}).join('')+'</div>';}
 return h;
}
function viewComp(){
 var list=compList();if(!UI.comp)UI.comp=list[0][0];
 if(UI.comp!=='W'&&(UI.comp.charAt(0)==='E'||UI.comp.charAt(0)==='T')&&!tourById(UI.comp.slice(2)))UI.comp=list[0][0];
 var ck=UI.comp,L=ck.charAt(0),k=ck.slice(2);
 var h='<div class="wide"><div class="cats" role="group" aria-label="Competición">'+list.map(function(x){return chip(UI.comp===x[0],'comp',x[0],esc(x[1]));}).join('')+'</div>';
 h+='<label for="compsel" class="sr">Ver otra competición</label><select id="compsel" style="margin-top:8px"><option value="">Ver otra liga o copa…</option>'+allComps().map(function(x){return '<option value="'+x[0]+'"'+(x[0]===ck?' selected':'')+'>'+esc(x[1])+'</option>';}).join('')+'</select></div>';
 if(ck==='W')return h+worldAwards();
 if(L==='P')return h+'<div class="card wide"><h3>'+esc(country(k).n)+' · ascensos, descensos y play-offs</h3>'+poView(k)+'</div>';
 var tabs=[['tabla','Clasificación'],['g','Goleadores'],['a','Asistentes'],['r','Notas'],['v','Más valiosos']];
 if(L==='L')tabs.push(['mes','Equipo del mes']);
 tabs.push(['temp','Equipo del año']);
 h+='<div class="cats wide" role="group" aria-label="Vista">'+tabs.map(function(t){return chip(UI.ctab===t[0],'ctab',t[0],t[1]);}).join('')+'</div>';
 var title=compName(ck);
 h+='<div class="card wide"><h3>'+esc(title)+' · T'+S.season+'</h3>';
 if(UI.ctab==='tabla'){
  if(L==='L')h+=leagueTable(byId(S.lgs,k));
  else if(L==='C')h+=cupTable(k);
  else h+=tourTable(tourById(k));
 }
 else if(UI.ctab==='mes'){var ms=S.aw.filter(function(a){return a.k==='TOM'&&a.lg===k&&a.s===S.season;});
  if(!ms.length)h+='<p class="mut">El primer equipo del mes sale a final de agosto.</p>';
  ms.slice().reverse().forEach(function(a){h+=xiHTML(a.xi,MONTHS[a.m]+' · Jugador del mes: '+esc(a.best.n)+(a.best.me?' (tú)':''));});}
 else if(UI.ctab==='temp'){var t=S.aw.filter(function(a){return L==='L'?(a.k==='TOY'&&a.lg===k):(a.k==='TOC'&&a.comp===k);}).pop();
  if(!t)h+='<p class="mut">Se elige al final de la temporada.</p>';
  else{h+='<div class="small mut">Temporada '+t.s+(t.win?' · Campeón: '+esc(t.win):'')+'</div>'+xiHTML(t.xi,'Equipo de la temporada');
   h+='<div class="small" style="margin-top:8px">'+(t.mvp?'Mejor jugador: <b>'+esc(t.mvp.n)+'</b>. ':'')+(t.top?'Máximo goleador: <b>'+esc(t.top.n)+'</b> ('+t.top.r+'). ':'')+(t.ast?'Máximo asistente: <b>'+esc(t.ast.n)+'</b> ('+t.ast.r+'). ':'')+(t.yng?'Mejor joven: <b>'+esc(t.yng.n)+'</b>.':'')+'</div>';}}
 else if(UI.ctab==='v')h+=valueTable(ck);
 else h+=leaderTable(ck,UI.ctab);
 return h+'</div>';
}

/* ---------- Club ---------- */
function viewClub(){
 var me=S.pl[S.me],c=myClub(),lg=lgOf(c.id),rv=rivalFor(c),ag=agent();
 var h='<div class="card"><h3>Tu club</h3><div class="rowb"><b style="font-size:18px;display:flex;align-items:center;gap:10px">'+crestSVG(c,40)+esc(c.n)+'</b><span class="mut">Fuerza '+c.str+'</span></div><div class="small mut">'+lg.n+' · '+country(c.co).n+(c.id===S.cantera?' · tu club de cantera':' · cantera: '+esc(S.clubs[S.cantera].n))+'</div>'+
  '<div class="kv"><div><b class="num good">'+fmt(S.contract.wage)+'</b><span>Salario semanal</span></div><div><b class="num">'+S.contract.years+'</b><span>Años de contrato</span></div><div><b class="num">'+Math.round(starterP(c)*100)+'%</b><span>Ser titular</span></div><div><b class="num good">'+fmv(mv(S.pl[S.me]))+'</b><span>Tu valor de mercado</span></div><div><b class="num">'+fmv(c.ros.reduce(function(s,id){return s+mv(S.pl[id]);},0))+'</b><span>Valor de la plantilla</span></div></div>'+
  (rv?'<div class="small mut" style="margin-top:8px">Tu rival por el puesto: <b>'+esc(rv.n)+'</b> ('+rv.o+' de valoración, '+rv.a+' años).</div>':'')+
  '<button class="go alt block" data-a="squad" data-id="'+c.id+'" style="margin-top:10px">Ver plantilla</button></div>';
 var n=nation(me.nat),cp=Math.round(ntCallP()*100);
 h+='<div class="card"><h3>Selección · '+n.n+'</h3><div class="kv"><div><b class="num">'+S.nt.calls+'</b><span>Convocatorias</span></div><div><b class="num">'+S.nt.caps+'</b><span>Partidos</span></div><div><b class="num">'+S.nt.g+' / '+S.nt.a+'</b><span>Goles / asist.</span></div></div>'+
  '<div class="small mut" style="margin-top:8px">Fuerza de la selección '+n.str+'. Probabilidad de convocatoria ahora: <b class="num">'+cp+'%</b>. Depende de tu valoración frente a los mejores '+natName(me.nat).toLowerCase()+'s de tu puesto, de tu nota media y de la prensa.</div></div>';
 h+='<div class="card"><h3>Representante</h3><div class="rowb"><b>'+esc(ag.n)+'</b><span class="mut">Nivel '+ag.lvl+' · comisión '+Math.round(ag.com*100)+'%</span></div>'+
  '<div class="small mut">Trae '+(1+ag.lvl)+' ofertas por mercado, '+(ag.lvl>=3?'de cualquier país':ag.lvl>=2?'de tu país, el de tu cantera y el de tu selección':'solo de tu país')+'. Mejora salarios un '+Math.round((agentWage()-1)*100)+'% y abre marcas antes.</div>'+
  '<div class="btns" style="margin-top:10px"><button class="go alt '+(windowOpen()?'':'dis')+'" data-a="agsearch">Mover mi nombre</button><button class="go alt '+(S.agent==='a1'?'dis':'')+'" data-a="agfire">Despedirlo</button></div>';
 AGENTS.forEach(function(a){if(a.id===S.agent)return;var ok=overall()>=a.req&&S.fol>=a.fol;
  h+='<div class="item"><div><b>'+esc(a.n)+'</b> <span class="lv">Nv '+a.lvl+'</span><p>Comisión '+Math.round(a.com*100)+'% · firma '+fmt(a.fee)+' · pide valoración '+a.req+' y '+fnum(a.fol)+' seguidores</p></div><button class="go '+(ok&&S.money>=a.fee?'':'dis')+'" data-a="aghire" data-id="'+a.id+'">Fichar</button></div>';});
 h+='</div>';
 h+='<div class="card"><h3>Ofertas</h3><div class="small mut" style="margin-bottom:6px">'+(windowOpen()?'Mercado abierto.':'Mercado cerrado. Abre al inicio de temporada y en enero.')+'</div>';
 S.offers.forEach(function(o,i){var x=S.clubs[o.club],p=Math.round(starterP(x)*100),r2=rivalFor(x),l2=lgOf(x.id);
  h+='<div class="item"><div><b>'+esc(x.n)+'</b><p>'+l2.n+' ('+country(x.co).n+') · fuerza '+x.str+' · '+fmt(o.wage)+'/semana · '+o.years+' año(s) · prima '+fmt(o.bonus)+' · titular '+p+'%'+(r2?' · rival: '+esc(r2.n)+' ('+r2.o+')':'')+'</p></div><div style="display:grid;gap:6px"><button class="go alt" data-a="squad" data-id="'+x.id+'">Plantilla</button><button class="go '+(windowOpen()?'':'dis')+'" data-a="accept" data-i="'+i+'">Fichar</button></div></div>';});
 if(!S.offers.length)h+='<p class="mut">No hay ofertas ahora.</p>';
 h+='</div>';
 if(S.age>=35)h+='<div class="card"><h3>Retirada</h3><p class="small mut">Puedes colgar las botas cuando quieras. A los 40 es obligatorio.</p><button class="go alt block" data-a="retire">Retirarme</button></div>';
 return h;
}

/* ---------- Vida ---------- */
function viewLife(){
 var h='';
 if(S.event){var ev=EVENTS[S.event.i];h+='<div class="card" style="border-color:var(--gold)"><h3>'+ev.t+'</h3><p style="margin:0 0 10px">'+ev.d+'</p><div class="btns">'+ev.o.map(function(o,i){return '<button class="go'+(i?' alt':'')+'" data-a="ev" data-i="'+i+'">'+o.n+'</button>';}).join('')+'</div></div>';}
 h+='<div class="card"><h3>Relaciones y moral</h3>';
 Object.keys(REL_INFO).forEach(function(k){var v=Math.round(S.rel[k]);h+='<div class="item" style="grid-template-columns:1fr"><div><div class="rowb"><b>'+REL_INFO[k][0]+'</b><span class="num '+(v>=65?'good':v<35?'bad':'')+'">'+v+'</span></div><div class="bar big '+(v<35?'low':'en')+'"><i style="width:'+v+'%"></i></div><p>'+REL_INFO[k][1]+'</p></div></div>';});
 h+='<div class="item" style="grid-template-columns:1fr"><div><div class="rowb"><b>Moral</b><span class="num">'+S.moral+'</span></div><div class="bar big '+(S.moral<35?'low':'en')+'"><i style="width:'+S.moral+'%"></i></div><p>Sube con buenos partidos y ruedas de prensa con confianza. Mejora tu nota, tus duelos y la fuerza de tu equipo.</p></div></div></div>';
 h+='<div class="card"><div class="rowb"><h3 style="margin:0">Acciones</h3><span class="small mut">Te quedan <b class="num">'+S.acts+'</b> esta semana</span></div>';
 ACTS.forEach(function(a){var st=actState(a),f=actFactor(a),lim=a.season?'1 vez por temporada':a.cd>1?'cada '+a.cd+' semanas':'cada semana';
  h+='<div class="item"><div><b>'+a.n+'</b><p>'+REL_INFO[a.w][0]+' · '+a.d+'</p><p class="small">'+lim+(f<1?' · <span class="warn">ahora rinde al '+Math.round(f*100)+' %</span>':'')+(st.ok?'':' · <span class="bad">'+st.why+'</span>')+'</p></div><button class="go alt '+(st.ok?'':'dis')+'" data-a="act" data-id="'+a.id+'">'+st.lbl+'</button></div>';});
 h+='</div>';
 var cm=cmObj();
 h+='<div class="card"><h3>Redes sociales</h3><div class="kv"><div><b class="num">'+fnum(S.fol)+'</b><span>Seguidores</span></div><div><b class="num good">'+fmt(socialIncome())+'</b><span>Ingresos por semana</span></div><div><b class="num">'+fmt(postValue())+'</b><span>Colaboración</span></div></div>'+
  '<button class="go alt block '+(S.post?'dis':'')+'" data-a="post" style="margin-top:10px">Publicar colaboración pagada</button>';
 if(S.spons.length){h+='<h3 style="margin-top:12px">Publicaciones para tus marcas</h3>';S.spons.forEach(function(s){var b=byId(BRANDS,s.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b><p>Este mes: '+s.done+'/'+s.posts+' publicaciones</p></div><button class="go alt '+(s.done>=s.posts||s.wk===S.slot?'dis':'')+'" data-a="spost" data-id="'+s.id+'">Publicar</button></div>';});}
 h+='<h3 style="margin-top:12px">Community manager</h3><div class="small mut">'+(cm?'Te lleva las redes <b>'+esc(cm.n)+'</b>: +'+ds(cm.g*100)+'% de seguidores por semana, colaboraciones ×'+ds(cm.post)+'.':'Llevas tus redes tú solo.')+'</div>';
 CMS.forEach(function(c){var on=S.cm===c.id;h+='<div class="item"><div><b>'+esc(c.n)+'</b><p>'+fmt(c.c)+'/semana · +'+ds(c.g*100)+'% seguidores · prensa +'+ds(c.pr)+' · colaboraciones ×'+ds(c.post)+' · riesgo de polémica '+ds(c.risk*100)+'%</p></div>'+(on?'<button class="go alt" data-a="cmfire">Despedir</button>':'<button class="go alt" data-a="cmhire" data-id="'+c.id+'">Contratar</button>')+'</div>';});
 return h+'</div>';
}

/* ---------- Negocio ---------- */
function viewMoney(){
 var inv=0;INVEST.forEach(function(v){if(S.invest[v.id])inv+=v.w;});
 var sp=sponsorIncome(),so=socialIncome(),com=Math.round(S.contract.wage*agentCom()),cm=cmObj(),cmc=cm?cm.c:0,net=S.contract.wage+inv+sp+so-com-cmc;
 var h='<div class="card"><div class="rowb"><b>Balance fijo por semana</b><b class="'+(net>=0?'good':'bad')+' num">'+fmt(net)+'</b></div>'+
  '<div class="small mut" style="margin-top:6px">Salario '+fmt(S.contract.wage)+' · patrocinios '+fmt(sp)+' · negocios '+fmt(inv)+' · redes '+fmt(so)+' · comisión del representante −'+fmt(com)+(cmc?' · community manager −'+fmt(cmc):'')+'. Además cobras primas por partido y premios.</div></div>';
 h+='<div class="card"><h3>Patrocinios activos</h3>';
 if(!S.spons.length)h+='<p class="mut small">Todavía no tienes patrocinadores.</p>';
 S.spons.forEach(function(s){var b=byId(BRANDS,s.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b> <span class="lv">'+BCAT[s.cat]+'</span><p>'+fmt(s.w)+'/semana · '+s.yrs+' año(s) · publicaciones este mes '+s.done+'/'+s.posts+' · satisfacción '+Math.round(s.sat)+(s.strikes?' · <span class="bad">avisos '+s.strikes+'</span>':'')+(s.cat==='botas'?' · debes jugar con sus botas':'')+'</p></div><button class="go alt" data-a="scancel" data-id="'+s.id+'">Rescindir</button></div>';});
 h+='</div><div class="card"><h3>Propuestas de marcas</h3>';
 if(!S.sofs.length)h+='<p class="mut small">Las marcas te escriben a final de cada mes si cumples sus requisitos. Un representante mejor las atrae antes.</p>';
 S.sofs.forEach(function(o,i){var b=byId(BRANDS,o.id);h+='<div class="item"><div><b>'+esc(b.n)+'</b> <span class="lv">'+BCAT[o.cat]+'</span><p>'+fmt(o.w)+'/semana · '+o.yrs+' año(s) · '+o.posts+' publicaciones al mes'+(o.cat==='botas'?' · exclusividad de botas':'')+'</p></div><div style="display:grid;gap:6px"><button class="go" data-a="ssign" data-i="'+i+'">Firmar</button><button class="go alt" data-a="sreject" data-i="'+i+'">Rechazar</button></div></div>';});
 h+='</div><div class="card"><h3>Marcas</h3><div class="small mut" style="margin-bottom:6px">Requisitos para que se fijen en ti (ya incluyen la ayuda de tu representante).</div>';
 BRANDS.slice().sort(function(a,b){return a.tier-b.tier;}).forEach(function(b){var r=brandReq(b),ok=brandOk(b),has=S.spons.some(function(s){return s.id===b.id;});
  h+='<div class="rowb small" style="padding:5px 0;border-top:1px solid var(--line)"><span>'+esc(b.n)+' <span class="mut">'+BCAT[b.cat]+' · '+'★'.repeat(b.tier)+'</span></span><span class="'+(has?'good':ok?'good':'mut')+'">'+(has?'Patrocinador':'Valoración '+r.ov+' · '+fnum(r.fol)+' seguidores')+'</span></div>';});
 h+='</div><div class="card"><h3>Fondo de inversión</h3><div class="rowb"><span>Saldo</span><b class="num">'+fmt(S.fund)+'</b></div><div class="small mut">Rinde de media un 0,25% por semana, con altibajos. Puedes perder dinero.</div>'+
  '<div class="btns" style="margin-top:10px"><button class="go alt" data-a="fundin" data-n="25">Aportar 25%</button><button class="go alt" data-a="fundin" data-n="100">Aportar todo</button><button class="go alt full '+(S.fund>0?'':'dis')+'" data-a="fundout">Retirar todo</button></div></div>';
 h+='<div class="card"><h3>Negocios</h3>';
 INVEST.forEach(function(v){h+='<div class="item"><div><b>'+v.n+'</b><p>Rinde '+fmt(v.w)+'/semana</p></div>'+(S.invest[v.id]?'<span class="good">Comprado</span>':'<button class="go '+(S.money>=v.c?'':'dis')+'" data-a="invest" data-id="'+v.id+'">'+fmt(v.c)+'</button>')+'</div>';});
 return h+'</div>';
}

/* ---------- Tienda ---------- */
function viewShop(){
 var gk=S.pos==='POR',slots=gk?[['botas','Botas'],['guantes','Guantes'],['ropa','Ropa']]:[['botas','Botas'],['ropa','Ropa']];
 var h='<div class="card"><h3>Tu material</h3>';
 slots.forEach(function(s){var g=S.gear[s[0]];h+='<div class="item"><div><b>'+s[1]+'</b><p>'+(g?esc(g.n)+' ('+g.gama+') · '+g.sk.map(function(id){return (SKNAME[id]||id)+' +'+g.b;}).join(', '):'Nada equipado')+'</p>'+(g?'<div class="bar big"><i style="width:'+(g.dur/g.max*100)+'%"></i></div><p>Le quedan '+g.dur+' partidos</p>':'')+'</div></div>';});
 var bs=bootSponsor();if(bs)h+='<div class="small" style="color:var(--gold)">Contrato con '+byId(BRANDS,bs).n+': solo puedes comprar botas de esa marca.</div>';
 h+='</div><div class="card wide"><h3>Material</h3><div class="cats" role="group" aria-label="Tipo de material">'+slots.map(function(s){return chip(UI.shop===s[0],'shop',s[0],s[1]);}).join('')+'</div>';
 var cat=gearCatalog().filter(function(g){return g.slot===UI.shop;});
 var types=[];cat.forEach(function(g){if(types.indexOf(g.type)<0)types.push(g.type);});
 if(types.length>1){if(types.indexOf(UI.stype)<0)UI.stype=types[0];h+='<div class="cats">'+types.map(function(t){var g=cat.filter(function(x){return x.type===t;})[0];return chip(UI.stype===t,'stype',t,g.sk.map(function(id){return SKNAME[id];}).join(' + '));}).join('')+'</div>';cat=cat.filter(function(g){return g.type===UI.stype;});}
 cat.sort(function(a,b){return a.c-b.c;});
 h+='<div>';
 cat.forEach(function(g){var b=byId(BRANDS,g.brand),lock=g.slot==='botas'&&bs&&g.brand!==bs;
  h+='<div class="item"><div><b>'+esc(g.n)+'</b> <span class="lv">'+g.gama+' · '+'★'.repeat(b.tier)+'</span><p>'+g.sk.map(function(id){return (SKNAME[id]||id)+' +'+g.b;}).join(' · ')+' · dura '+g.dur+' partidos</p></div><button class="go '+(S.money>=g.c&&!lock?'':'dis')+'" data-a="gear" data-id="'+g.id+'">'+fmt(g.c)+'</button></div>';});
 h+='</div><div class="card"><h3>Servicios</h3>';
 SHOP.forEach(function(s){var l=itemLvl(s.id);h+='<div class="item"><div><b>'+s.n+' <span class="lv">Nv '+l+'/3</span></b><p>'+s.d+'</p></div>'+(l>=3?'<span class="good">Máximo</span>':'<button class="go '+(S.money>=s.c[l]?'':'dis')+'" data-a="buy" data-id="'+s.id+'">'+fmt(s.c[l])+'</button>')+'</div>';});
 return h+'</div>';
}

/* ---------- Carrera ---------- */
function viewCareer(){
 var st=S.stats,me=S.pl[S.me];
 var h='';
 h+='<div class="card"><h3>'+esc(S.name)+'</h3><div class="small mut">'+POS[S.pos]+' · '+S.age+' años · '+natName(me.nat)+' · '+esc(myClub().n)+'</div><div class="small" style="margin-top:4px;color:var(--gold)">'+traitLine()+'</div>'+
  '<div class="kv"><div><b class="num">'+st.pj+'</b><span>Partidos</span></div><div><b class="num">'+(S.pos==='POR'?st.sv:st.g)+'</b><span>'+(S.pos==='POR'?'Paradas':'Goles')+'</span></div><div><b class="num">'+(S.pos==='POR'?st.cs:st.a)+'</b><span>'+(S.pos==='POR'?'Porterías a cero':'Asistencias')+'</span></div>'+
  '<div><b class="num">'+(st.rn?ds(st.rsum/st.rn):'-')+'</b><span>Nota media</span></div><div><b class="num">'+S.trophies.filter(function(t){return t.k!=='ind';}).length+'</b><span>Títulos</span></div><div><b class="num">'+S.trophies.filter(function(t){return t.k==='ind';}).length+'</b><span>Premios</span></div><div><b class="num good">'+fmv(mv(me))+'</b><span>Valor de mercado</span></div></div></div>';
 if(S.trophies.length){h+='<div class="card"><h3>Palmarés</h3>';S.trophies.slice().reverse().slice(0,40).forEach(function(t){h+='<div class="ev"><b class="num" style="width:40px">T'+t.s+'</b><span>'+(t.k==='ind'?'<span class="star">◆</span> ':'🏆 ')+esc(t.n)+'</span></div>';});h+='</div>';}
 var mine=S.bdo.filter(function(b){return b.me;});
 if(mine.length){h+='<div class="card"><h3>Tus Balones de Oro</h3>'+mine.map(function(b){return '<div class="ev"><b class="num" style="width:40px">T'+b.s+'</b><span>'+b.me+'º puesto</span></div>';}).join('')+'</div>';}
 if(S.hist.length){h+='<div class="card wide"><h3>Temporadas</h3><div class="tw"><table><tr><th>T</th><th>Club</th><th>Pos</th><th>PJ</th><th>G</th><th>A</th><th>Nota</th><th>Val</th></tr>';
  S.hist.slice().reverse().forEach(function(x){h+='<tr><td class="num">'+x.season+'</td><td>'+esc(x.club)+'<div class="small mut">'+esc(x.lg||'')+'</div></td><td class="num">'+x.pos+'º</td><td class="num">'+x.apps+'</td><td class="num">'+x.g+'</td><td class="num">'+x.a+'</td><td class="num">'+(x.apps?ds(x.rating):'-')+'</td><td class="num">'+ds(x.ov)+'</td></tr>';});
  h+='</table></div></div>';}
 h+='<div class="card"><h3>Noticias</h3>';
 S.log.slice(0,20).forEach(function(l){h+='<div class="ev"><b style="width:74px;font-size:13px">'+l.t+'</b><span>'+esc(l.m)+'</span></div>';});
 if(S.real)h+='</div><div class="card small mut">'+REAL_NOTE+(S.realSeason?' Datos de la temporada '+S.realSeason+'.':'');
 h+='</div><div class="card"><h3>Partida</h3><p class="small mut" style="margin-top:0">Se guarda sola en este navegador'+(CUR?' (hueco '+CUR+')':'')+'. Exporta una copia para no perderla o para seguir en otro dispositivo.</p><div class="btns"><button class="go alt" data-a="export">Exportar a archivo</button><button class="go alt" data-a="menu">Menú de partidas</button>'+(UI.reset?'<p class="small bad full" style="margin:6px 0 0">Se borrará esta carrera para siempre. ¿Seguro?</p><button class="go" data-a="reset2">Sí, borrar</button><button class="go alt" data-a="reset0">Cancelar</button>':'<button class="go alt full" data-a="reset1">Borrar esta carrera</button>')+'</div></div>';
 return h;
}

/* ---------- Entreno ---------- */
function viewTrain(){
 var ov=overall(),a=traitById(S.tp),b=traitById(S.ts);
 var h='<div class="card wide"><div class="rowb"><b>Valoración total</b><b class="star num">★ '+ds(ov)+'</b></div><div class="bar big"><i style="width:'+clamp(ov,0,100)+'%"></i></div>'+
  '<div class="small mut" style="margin-top:8px"><span class="star">◆</span> '+(a?a.n:'-')+' (+8) · <span class="star">◆</span> '+(b?b.n:'-')+' (+4). Las demás habilidades llegan hasta el nivel '+(MAXL-3)+'. El material suma aparte.</div>'+
  '<div class="mults">Puntos por pulsación: '+[1,5,25].map(function(m){return chip(S.mult===m,'mult',null,'×'+m,m);}).join('')+'</div></div>';
 h+='<div class="card wide"><div class="cats" role="group" aria-label="Categoría">'+CATS.filter(function(c){return catAvg(c[0])>0;}).map(function(c){return chip(S.cat===c[0],'cat',c[0],catName(c[0])+' <span class="num">'+Math.round(catAvg(c[0]))+'</span>');}).join('')+'</div>';
 h+='<div class="hdr"><span>Entrenar</span><span>Habilidad</span><span>Promoción</span></div>';
 S.skills.filter(function(k){return k.cat===S.cat;}).forEach(function(k){
  var cap=capFor(k),max=k.lvl>=cap,nd=need(k.lvl),cost=costFor(k,S.mult),pc=nd-k.prog,mark=tb(k.id)>0?'<span class="star" title="Rasgo">◆</span> ':'',gb=gearB(k.id);
  h+='<div class="sk"><button class="tr '+(max||S.money<pointCost(k,k.lvl)?'dis':'')+'" data-a="train" data-id="'+k.id+'" aria-label="Entrenar '+k.n+(max?' (al máximo)':' por '+fmt(cost))+'"><span class="star">★</span><span class="num">'+(max?'MAX':fmt(cost))+'</span></button>'+
   '<div class="mid"><div class="nm">'+mark+k.n+' <span class="stars">'+stars(k.lvl)+'</span><span class="lv'+(traitCap(k.id).by&&traitCap(k.id).cap===cap?' lim':'')+'">Nv '+k.lvl+'/'+cap+(traitCap(k.id).by&&traitCap(k.id).cap===cap?' · límite por '+traitCap(k.id).by.n:'')+'</span><span class="val num">★ '+Math.round(skVal(k))+(gb?' <span class="small good">(+'+gb+')</span>':'')+'</span></div>'+
   '<div class="bar"><i style="width:'+(max?100:k.prog/nd*100)+'%"></i><span class="num">'+(max?'MAX':k.prog+'/'+nd)+'</span></div></div>'+
   '<button class="pr '+(max||S.medals<pc?'dis':'')+'" data-a="promo" data-id="'+k.id+'" aria-label="Subir '+k.n+' de nivel con '+(max?'medallas (al máximo)':pc+' medallas')+'"><span class="medal"></span><span class="num">'+(max?'-':pc)+'</span></button></div>';
 });
 h+='<div class="bono"><div class="mid"><div class="rowb"><b>Bono '+(S.pos==='POR'?'1v1':'de duelo')+'</b><span class="good num">+'+S.bono+' / 70</span></div><div class="bar big"><i style="width:'+(S.bono/70*100)+'%"></i></div><div class="small mut" style="margin-top:4px">Mejora tu nota en cada partido. Cada subida suma 2.</div></div>'+
  '<button class="go" data-a="bono">'+(S.bono>=70?'MAX':fmt(bonoCost()))+'</button></div></div>';
 return h;
}

/* ---------- ventanas ---------- */
function skillsGrid(list,gk){
 var h='';
 CATS.forEach(function(c){var ls=list.filter(function(x){return x.cat===c[0];});if(!ls.length)return;
  var avg=Math.round(ls.reduce(function(s,x){return s+x.v;},0)/ls.length),nm=c[1];
  if(gk&&c[0]==='def')nm='Portería';if(gk&&c[0]==='med')nm='Distribución';
  h+='<h3 style="margin-top:10px">'+nm+' <span class="num mut" style="font-size:14px">'+avg+'</span></h3><div class="g2">'+ls.map(function(x){return '<div class="rowb small"><span>'+x.n+'</span><b class="num">'+x.v+'</b></div>';}).join('')+'</div>';});
 return h;
}
function squadHTML(){
 var c=S.clubs[UI.sq.club],h='<div class="modal" role="dialog" aria-modal="true" aria-label="Plantilla de '+esc(c.n)+'"><div class="card"><div class="rowb"><h2 style="margin:0;display:flex;align-items:center;gap:10px">'+crestSVG(c,36)+esc(c.n)+'</h2><button class="chip" data-a="sqclose">Cerrar <span class="sr">(Esc)</span></button></div>';
 if(UI.sq.p!=null){
  var pl=S.pl[UI.sq.p],list,t;
  if(pl.me)list=S.skills.map(function(k){return {id:k.id,n:k.n,cat:k.cat,v:Math.round(skVal(k))};});else list=pskills(pl);
  t=traitById(pl.t);var s=pl.st.L||[0,0,0,0];
  h+='<p style="margin:8px 0 2px"><b>'+pName(pl)+'</b></p><div class="small mut">'+POS[pl.p]+' · '+(pl.me?S.age:pl.a)+' años · '+natName(pl.nat)+' · valoración <b class="num star">'+pl.o+'</b> · valor de mercado <b class="num good">'+fmv(mv(pl))+'</b>'+(t?' · '+t.n:'')+'</div>'+
   '<div class="small mut">Liga esta temporada: '+s[0]+' partidos, '+s[1]+' goles, '+s[2]+' asistencias'+(s[0]?', nota '+ds(s[3]/s[0]):'')+'</div>'+
   skillsGrid(list,pl.p==='POR')+'<button class="go alt block" data-a="sqback" style="margin-top:12px">Volver a la plantilla</button></div></div>';
  return h;
 }
 h+='<div class="small mut">'+esc(lgName(c))+' · fuerza '+c.str+(c.id===myClub().id?' · tu club':'')+'. Toca un jugador para ver sus habilidades.</div><div class="tw"><table><tr><th>Pos</th><th>Jugador</th><th>Edad</th><th>Val</th><th>Valor</th></tr>';
 var rows=c.ros.map(function(id){return S.pl[id];}),tot=0;rows.forEach(function(p){tot+=mv(p);});
 h+='<div class="small mut">Valor total de la plantilla: <b class="good">'+fmv(tot)+'</b></div>';
 rows.sort(function(x,y){return ORDER.indexOf(x.p)-ORDER.indexOf(y.p)||y.o-x.o;});
 rows.forEach(function(p){h+='<tr class="'+(p.me?'mine':'')+'"><td>'+p.p+'</td><td><button class="lnk" data-a="sqp" data-id="'+p.i+'">'+pName(p)+'</button> <span class="small mut">'+p.nat+'</span></td><td class="num">'+(p.me?S.age:p.a)+'</td><td class="num">'+p.o+'</td><td class="num small">'+fmv(mv(p))+'</td></tr>';});
 return h+'</table></div></div></div>';
}
function modalHTML(){
 if(S.retired&&!S.summary){var st=S.stats;return '<div class="modal" role="dialog" aria-modal="true"><div class="card"><h2>Te has retirado</h2><p>'+esc(S.name)+' cuelga las botas a los '+S.age+' años tras '+S.hist.length+' temporadas, '+st.pj+' partidos y '+S.trophies.filter(function(t){return t.k!=='ind';}).length+' títulos.</p>'+
  (S.pos==='POR'?'<p>Hiciste '+st.sv+' paradas y '+st.cs+' porterías a cero.</p>':'<p>Marcaste '+st.g+' goles y diste '+st.a+' asistencias.</p>')+'<p>Con tu selección: '+S.nt.caps+' partidos y '+S.nt.g+' goles.</p><button class="go block" data-a="menu">Volver al menú</button></div></div>';}
 var m=S.summary;if(!m)return '';
 var aw=m.awards.length?'<h3 style="margin-top:10px">Tus premios</h3>'+m.awards.map(function(a){return '<div class="ev"><span><span class="star">◆</span> '+esc(a.t)+'</span></div>';}).join(''):'';
 var b=S.bdo[S.bdo.length-1];
 return '<div class="modal" role="dialog" aria-modal="true"><div class="card"><h2>Fin de la temporada '+m.season+'</h2><p><b>'+esc(m.club)+'</b> acaba '+m.pos+'º en '+esc(m.league)+(m.champion?'. Sois campeones de liga.':'.')+(m.moved?' '+m.moved+'.':'')+(m.euNext?' La próxima temporada jugáis la '+m.euNext+'.':'')+'</p>'+
  '<div class="kv"><div><b class="num">'+m.apps+'</b><span>Partidos de liga</span></div><div><b class="num">'+(m.apps?ds(m.rating):'-')+'</b><span>Nota media</span></div><div><b class="num good">'+fmt(m.prize)+'</b><span>Premios</span></div></div>'+aw+
  (b&&b.top[0]?'<p class="small" style="margin-top:10px">Balón de Oro: <b class="star">'+esc(b.top[0].n)+'</b> ('+esc(b.top[0].c)+').'+(b.me?' Tú quedas '+b.me+'º.':'')+'</p>':'')+
  (m.transfers&&m.transfers.length?'<p class="small mut">Mercado: '+m.transfers.map(esc).join('; ')+'.</p>':'')+
  '<p class="small mut" style="margin-top:10px">Cumples '+S.age+' años. Valoración: '+ds(m.ovBefore)+' → '+ds(m.ovAfter)+(S.age>=31?'. Pierdes algo de nivel físico por la edad.':'.')+(m.renew?' Tu contrato se renueva automáticamente.':'')+(m.retire?' Es el momento de retirarte.':' Mira las ofertas en Club.')+'</p>'+
  '<button class="go block" data-a="closesum" style="margin-top:12px">Continuar</button></div></div>';
}

/* ---------- creación de carrera ---------- */
var setupState={name:'',pos:'DC',tp:'',ts:'',nat:'ESP',co:'ESP',ver:'fic',look:null},setupErr='';
var REAL_NOTE='Versión real: no es una versión comercial. Es solo para pruebas y uso particular. Los nombres de clubes y jugadores y los valores de mercado proceden de un dataset público (Kaggle, datos de Transfermarkt) y pertenecen a sus titulares. Las habilidades de cada jugador son estimaciones del juego.';
/* ---------- creación de carrera en 5 pasos ---------- */
var SETUP_STEPS=['Versión','Datos','Rasgos','Aspecto','Resumen'];
var FXTXT={rate:'mejor nota en cada partido',gs:'más goles',as:'más asistencias',fk:'opción de gol de falta en cada partido',cancel:'evitas goles del rival',team:'tu equipo rinde más contigo',drain:'te cansas mucho menos',big:'rindes mucho más en partidos importantes'};
function skApprox(pos,id,lvl){var all=pos==='POR'?SKG:SKO,s=all.filter(function(x){return x[0]===id;})[0];if(!s)return null;return Math.round(28+2*skW(pos,id,s[2])+(lvl-1)*5);}
function traitInfo(t,role,pos){
 var bonus=role==='tp'?8:4,off=role==='tp'?0:2,all=(pos==='POR'?SKG:SKO).map(function(x){return x[0];});
 var up=t.sk.filter(function(id){return all.indexOf(id)>=0;}).map(function(id){return SKNAME[id]+' +'+bonus;});
 var fx=Object.keys(t.fx).filter(function(k){return FXTXT[k];}).map(function(k){return FXTXT[k];});
 var lim=Object.keys(t.lim||{}).filter(function(id){return all.indexOf(id)>=0;}).map(function(id){var l=t.lim[id]+off;return SKNAME[id]+': máx. nivel '+l+' (≈'+skApprox(pos,id,l)+')';});
 return {up:up,fx:fx,lim:lim,con:t.con};
}
function traitCard(t,role){
 var on=setupState[role]===t.id,other=role==='tp'?setupState.ts:setupState.tp,dis=other===t.id,I=traitInfo(t,role,setupState.pos);
 return '<button class="tcard'+(on?' on':'')+'" data-a="trait" data-k="'+role+'" data-id="'+t.id+'" aria-pressed="'+on+'"'+(dis?' disabled title="Ya es tu otro rasgo"':'')+'>'+
  '<b>'+t.n+'</b><span class="mut">'+t.d+'</span>'+
  '<span class="tup"><i aria-hidden="true">▲</i> Mejora: '+I.up.join(', ')+(I.fx.length?'; '+I.fx.join(', '):'')+'.</span>'+
  (I.lim.length||I.con?'<span class="tdown"><i aria-hidden="true">▼</i> Limita: '+I.lim.join(', ')+(I.lim.length&&I.con?'. ':'')+(I.con||'')+'</span>':'')+'</button>';
}
function traitConflicts(){
 var a=traitById(setupState.tp),b=traitById(setupState.ts),out=[];if(!a||!b)return out;
 a.sk.forEach(function(id){if(b.lim&&b.lim[id]!=null)out.push(SKNAME[id]+': '+a.n+' la mejora, pero '+b.n+' la limita a nivel '+(b.lim[id]+2)+'.');});
 b.sk.forEach(function(id){if(a.lim&&a.lim[id]!=null)out.push(SKNAME[id]+': '+b.n+' la mejora, pero '+a.n+' la limita a nivel '+a.lim[id]+'.');});
 return out;
}
function setupHTML(){
 var st=setupState;if(!st.step)st.step=1;if(!st.maxStep)st.maxStep=1;
 var gk=st.pos==='POR',ts=TRAITS.filter(function(t){return !!t.gk===gk;});
 if(!ts.some(function(t){return t.id===st.tp;}))st.tp=ts[0].id;
 if(!ts.some(function(t){return t.id===st.ts;})||st.ts===st.tp)st.ts=ts.filter(function(t){return t.id!==st.tp;})[0].id;
 if(!st.look)st.look=randomLook(st.pos);
 var hasReal=typeof REALDATA!=='undefined';if(!hasReal)st.ver='fic';var real=st.ver==='real';
 var h='<div class="setup"><div class="setup-in">'+
  '<div class="rowb"><h1>Nueva carrera</h1><button class="go alt" data-a="menu">Cancelar</button></div>'+
  '<ol class="stepper" aria-label="Pasos">'+SETUP_STEPS.map(function(s,i){var n=i+1,cur=n===st.step,ok=n<=st.maxStep;return '<li><button data-a="step" data-n="'+n+'"'+(cur?' aria-current="step"':'')+(ok?'':' disabled')+' class="'+(cur?'cur':n<st.step?'done':'')+'"><span class="sn">'+n+'</span><span class="sl">'+s+'</span></button></li>';}).join('')+'</ol>';
 h+='<section class="card wizard">';
 if(st.step===1){
  var verCard=function(id,tit,txt,dis){var on=st.ver===id;return '<button class="vcard'+(on?' on':'')+'" data-a="ver" data-id="'+id+'" aria-pressed="'+on+'"'+(dis?' disabled':'')+'><b>'+tit+'</b><span>'+txt+'</span></button>';};
  h+='<h2>¿Con qué versión quieres jugar?</h2><div class="vcards">'+verCard('fic','Ficticia','Clubes con nombres inspirados en los reales y jugadores inventados.')+verCard('real','Real','Clubes, jugadores y valores de mercado reales'+(hasReal?' de la temporada '+REALDATA.temporada:'')+'.',!hasReal)+'</div>'+
   (!hasReal?'<p class="small mut">Versión real no disponible en esta copia.</p>':'')+
   (real?'<p class="small notice"><b class="star">Aviso.</b> '+REAL_NOTE+' Las primeras divisiones de España, Inglaterra, Italia, Alemania, Francia, Portugal y Países Bajos son reales; las categorías inferiores e Irlanda son generadas.</p>':'');
 }
 else if(st.step===2){
  var groups=[['Portería',['POR']],['Defensa',['DFC','LI','LD']],['Medio campo',['MCD','MC','VI','VD','MP']],['Ataque',['SD','DC','EI','ED']]];
  var po=groups.map(function(g){return '<optgroup label="'+g[0]+'">'+g[1].map(function(c){return '<option value="'+c+'"'+(c===st.pos?' selected':'')+'>'+POS[c]+'</option>';}).join('')+'</optgroup>';}).join('');
  var na=NATIONS.slice().sort(function(a,b){return a.n.localeCompare(b.n);}).map(function(n){return '<option value="'+n.id+'"'+(n.id===st.nat?' selected':'')+'>'+n.n+'</option>';}).join('');
  var co=COUNTRIES.map(function(c){var low=(real&&c.rn?c.rn[c.rn.length-1]:c.lg[c.lg.length-1][0]);return '<option value="'+c.id+'"'+(c.id===st.co?' selected':'')+'>'+c.n+' · empiezas en '+low+'</option>';}).join('');
  h+='<h2>Tu jugador</h2><div class="formgrid"><div><label for="nm">Nombre</label><input id="nm" maxlength="24" placeholder="Tu nombre" autocomplete="off" value="'+esc(st.name)+'" aria-describedby="nmerr" aria-invalid="'+!!setupErr+'">'+
   (setupErr?'<p id="nmerr" class="bad small" role="alert">'+setupErr+'</p>':'<span id="nmerr"></span>')+'</div>'+
   '<div><label for="ps">Posición</label><select id="ps">'+po+'</select></div>'+
   '<div><label for="na">Nacionalidad (tu selección)</label><select id="na">'+na+'</select></div>'+
   '<div><label for="co">País donde empiezas</label><select id="co" aria-describedby="cohelp">'+co+'</select><p id="cohelp" class="small mut" style="margin:6px 0 0">Te toca un club al azar de la última división: será tu cantera.</p></div></div>';
 }
 else if(st.step===3){
  var cf=traitConflicts();
  h+='<h2>Rasgos especiales</h2><p class="mut small" style="margin-top:0">Cada rasgo te hace especial en algo y te limita en otra cosa. El principal da +8 a sus habilidades y el secundario +4. Las habilidades que no mejora ningún rasgo llegan como mucho al nivel 11 (el máximo es 14). Los límites del rasgo secundario son 2 niveles más suaves.</p>'+
   '<h3>Rasgo principal</h3><div class="tcards">'+ts.map(function(t){return traitCard(t,'tp');}).join('')+'</div>'+
   '<h3 style="margin-top:16px">Rasgo secundario</h3><div class="tcards">'+ts.map(function(t){return traitCard(t,'ts');}).join('')+'</div>'+
   (cf.length?'<p class="small notice" role="status"><b class="star">Ojo.</b> '+cf.join(' ')+'</p>':'');
 }
 else if(st.step===4){
  h+='<div class="rowb"><h2 style="margin:0">Aspecto</h2><button class="chip" data-a="lookrnd">Aleatorio</button></div>'+lookEditor(st.look,'setup',{a:'#1565c0',b:'#ffffff',st:0});
 }
 else{
  var A=traitById(st.tp),B=traitById(st.ts),IA=traitInfo(A,'tp',st.pos),IB=traitInfo(B,'ts',st.pos),cf2=traitConflicts();
  h+='<h2>Resumen</h2><div class="summary"><div class="lookfig">'+portraitSVG(st.look,{a:'#1565c0',b:'#ffffff',st:0},170)+'</div><div>'+
   '<p style="margin:0"><b style="font-size:22px">'+esc(st.name||'Sin nombre')+'</b></p><p class="mut" style="margin:4px 0 12px">'+POS[st.pos]+' · '+nation(st.nat).n+' · empiezas en '+country(st.co).n+' · versión '+(real?'real':'ficticia')+'</p>'+
   '<p style="margin:0 0 4px"><b>'+A.n+'</b> <span class="mut small">(principal)</span></p><p class="small" style="margin:0 0 4px"><span class="good">▲</span> '+IA.up.join(', ')+'</p>'+(IA.lim.length||IA.con?'<p class="small" style="margin:0 0 10px"><span class="bad">▼</span> '+IA.lim.join(', ')+(IA.con?' '+IA.con:'')+'</p>':'')+
   '<p style="margin:0 0 4px"><b>'+B.n+'</b> <span class="mut small">(secundario)</span></p><p class="small" style="margin:0 0 4px"><span class="good">▲</span> '+IB.up.join(', ')+'</p>'+(IB.lim.length||IB.con?'<p class="small" style="margin:0"><span class="bad">▼</span> '+IB.lim.join(', ')+(IB.con?' '+IB.con:'')+'</p>':'')+
   (cf2.length?'<p class="small notice">'+cf2.join(' ')+'</p>':'')+(real?'<p class="small notice">'+REAL_NOTE+'</p>':'')+'</div></div>';
 }
 h+='</section><div class="wiznav">'+(st.step>1?'<button class="go alt" data-a="step" data-n="'+(st.step-1)+'">Atrás</button>':'<span></span>')+
  (st.step<5?'<button class="go" data-a="step" data-n="'+(st.step+1)+'">Siguiente: '+SETUP_STEPS[st.step]+'</button>':'<button class="go big" data-a="start">Empezar carrera</button>')+'</div></div></div>';
 return h;
}/* ---------- menú de partidas ---------- */
function menuHTML(){
 if(!UI.booted)return '<div class="setup"><div class="setup-in"><p class="mut">Cargando partidas…</p></div></div>';
 var m=metaAll(),h='<div class="setup"><div class="setup-in">'+
  '<div class="hero"><svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.9L22 9.3l-5.5 4.8L18.2 21 12 17.3 5.8 21l1.7-6.9L2 9.3l7.1-.4z" fill="currentColor"/></svg><div><h1>Estrella del Balón</h1><p class="mut" style="margin:4px 0 0">Tu carrera de futbolista, de la cantera al Balón de Oro.</p></div></div>'+
  '<section class="card"><h3>Partidas</h3><div class="slots">';
 for(var i=1;i<=NSLOTS;i++){var s=m[i];
  if(!s){h+='<div class="slot empty"><div class="slotbody"><b>Hueco '+i+'</b><span class="mut small">Vacío</span></div><button class="go" data-a="newslot" data-id="'+i+'">Nueva carrera</button></div>';continue;}
  var del=UI.delSlot===i;
  h+='<div class="slot"><div class="face">'+faceSVG(s.look,s.kit,64)+'</div><div class="slotbody"><b>'+esc(s.name)+'</b><span class="small">'+POS[s.pos]+' · '+s.age+' años · valoración '+s.ov+'</span><span class="small mut">'+esc(s.club)+' · temporada '+s.season+(s.real?' · versión real':'')+(s.retired?' · retirado':'')+'</span><span class="small mut">Guardada el '+new Date(s.date).toLocaleString('es-ES',{dateStyle:'short',timeStyle:'short'})+'</span></div>'+
   '<div class="slotbtns">'+(del?'<span class="small bad">¿Borrar para siempre?</span><button class="go" data-a="slotdel2" data-id="'+i+'">Sí, borrar</button><button class="go alt" data-a="slotdel0">No</button>':
   '<button class="go" data-a="slotopen" data-id="'+i+'">Continuar</button><button class="go alt" data-a="slotexp" data-id="'+i+'">Exportar</button><button class="go alt" data-a="slotdel1" data-id="'+i+'">Borrar</button>')+'</div></div>';}
 h+='</div><div class="rowb" style="margin-top:12px;flex-wrap:wrap"><p class="small mut" style="margin:0;max-width:560px">Las partidas se guardan solas en este navegador. Exporta una copia a un archivo para no perderla o para seguir en otro dispositivo.</p>'+
  '<label class="go alt filebtn" style="margin:0">Importar partida<input id="imp" type="file" accept=".json,application/json" class="sr"></label></div></section>'+
  '<p class="small mut">Versión ficticia con clubes inspirados en los reales. La versión real es solo para pruebas y uso particular, no comercial.</p></div></div>';
 return h;
}
