/* Estrella del Balón · contenido de carrera: dificultad, periódico, capitanía, vida personal y rival de tu generación. */

/* ---------- dificultad ---------- */
var DIFF={facil:{n:'Fácil',d:'Ganas más duelos, mejoras más rápido y cobras algo más.',p:0.06,gr:1.2,w:1.12},
 normal:{n:'Normal',d:'La experiencia equilibrada.',p:0,gr:1,w:1},
 leyenda:{n:'Leyenda',d:'Duelos más duros, mejora más lenta y contratos más ajustados. Para quien quiera sudar el Balón de Oro.',p:-0.06,gr:0.85,w:0.9}};
function diff(){return DIFF[(S&&S.diff)||'normal']||DIFF.normal;}
function diffCard(){
 return '<div class="card"><h3>Dificultad</h3><div class="chips">'+Object.keys(DIFF).map(function(k){var on=(S.diff||'normal')===k;return '<button class="chip'+(on?' on':'')+'" data-a="diff" data-id="'+k+'" aria-pressed="'+on+'">'+DIFF[k].n+'</button>';}).join(' ')+'</div><p class="small mut" style="margin-bottom:0">'+diff().d+' Puedes cambiarla cuando quieras.</p></div>';
}
function diffSetup(st){return '<p style="margin:12px 0 6px"><b>Dificultad</b></p><div class="chips">'+Object.keys(DIFF).map(function(k){var on=(st.diff||'normal')===k;return '<button class="chip'+(on?' on':'')+'" data-a="sdiff" data-id="'+k+'" aria-pressed="'+on+'">'+DIFF[k].n+'</button>';}).join(' ')+'</div><p class="small mut">'+DIFF[st.diff||'normal'].d+'</p>';}

/* ---------- periódico: Diario Balón ---------- */
function newsAdd(t,k){S.news=S.news||[];if(S.news.slice(0,8).some(function(x){return x.t===t;}))return;S.news.unshift({s:S.season,m:MONTHS[slotMonth(Math.min(S.slot,S.cal.length-1))].slice(0,3),t:t,k:k||''});if(S.news.length>40)S.news.length=40;}
function newsWeekly(rep){
 var me=S.pl[S.me],c=me&&me.c>=0?S.clubs[me.c]:null;if(!c)return;
 if(rep&&rep.mins>0&&!rep.nat){var opp=rep.home===c.n?rep.away:rep.home,n=S.name,t=null;
  if(rep.g>=3)t=pick(['¡Hat-trick de '+n+'! '+c.n+' arrolla a '+opp,n+' firma tres goles ante '+opp]);
  else if(rep.g===2)t=pick(['Doblete de '+n+' frente a '+opp,n+' se viste de goleador: dos tantos ante '+opp]);
  else if(rep.r>=8.5)t=pick(['Exhibición de '+n+' ante '+opp,n+', el mejor del partido contra '+opp]);
  else if(rep.g===1&&rep.win)t=pick(['El gol de '+n+' da la victoria ante '+opp,n+' decide ante '+opp]);
  else if(rep.r<5)t=pick(['Noche para olvidar de '+n+' ante '+opp,'Las críticas apuntan a '+n+' tras el partido ante '+opp]);
  if(t)newsAdd(t,'yo');}
 if(Math.random()<0.6){var lg=lgOf(c.id),tb=table(lg),ld=tb[0],g=leaders('L:'+lg.id,'g',1)[0],R=rivalP();
  var opts=[];
  if(ld&&ld.pj>=3)opts.push(ld.n+' lidera la '+lg.n+' con '+ld.pts+' puntos tras '+ld.pj+' jornadas');
  if(g&&stOf(g,'L')[1]>=3)opts.push((g.me?S.name:g.n)+' ya suma '+stOf(g,'L')[1]+' goles en la '+lg.n);
  if(R&&R.c>=0&&stOf(R,'L')[0]>=3)opts.push('Tu rival '+R.n+' ('+S.clubs[R.c].n+') lleva '+stOf(R,'L')[1]+' goles y '+stOf(R,'L')[2]+' asistencias');
  if(overall()>c.str+6){var big=S.clubs.filter(function(x){return !x.guest&&x.str>c.str+6;});if(big.length)opts.push('Rumor: el '+pick(big).n+' sigue de cerca a '+S.name);}
  if(opts.length)newsAdd(pick(opts),'liga');}
}
function newsCard(){
 var N=S.news||[];if(!N.length)return '';
 return '<div class="card"><h3>Diario Balón</h3>'+N.slice(0,4).map(function(x){return '<div class="ev"><b style="min-width:62px;font-size:13px">T'+x.s+' · '+x.m+'</b><span class="'+(x.k==='yo'?'me':'')+'">'+esc(x.t)+'</span></div>';}).join('')+
  (N.length>4?'<details class="hit"><summary><b>Hemeroteca</b><span class="num mut">'+N.length+'</span></summary>'+N.slice(4).map(function(x){return '<div class="ev"><b style="min-width:62px;font-size:13px">T'+x.s+' · '+x.m+'</b><span>'+esc(x.t)+'</span></div>';}).join('')+'</details>':'')+'</div>';
}

/* ---------- capitanía ---------- */
function isCaptain(){var me=S.pl[S.me];return !!(me&&me.c>=0&&S.captain===me.c);}
function seasonsAtClub(){var me=S.pl[S.me],n=0,c=S.clubs[me.c];if(!c)return 0;for(var i=(S.hist||[]).length-1;i>=0;i--){if(S.hist[i].club===c.n)n++;else break;}return n;}
function captainSeason(){
 var me=S.pl[S.me],c=S.clubs[me.c];if(!c||S.retired)return;
 if(!isCaptain()){
  var rank=c.ros.map(function(id){return S.pl[id];}).filter(function(p){return p&&!p.me;}).filter(function(p){return p.o>overall();}).length;
  if(seasonsAtClub()>=2&&S.age>=22&&S.rel.team>=62&&rank<=3){S.captain=c.id;var k=ctr();k.wage=Math.round(k.wage*1.05/100)*100;rel('coach',3);
   logm('El vestuario te elige capitán de '+c.n+'. Tu salario sube un 5%.');newsAdd(S.name+', nuevo capitán del '+c.n,'yo');hito('cap','Capitán de '+c.n);}}
 /* capitán de la selección */
 if(!S.ntCap&&S.nt.caps>=25&&S.age>=24){var pool=natPool(me.nat).map(function(i){return S.pl[i];});
  if(!pool.some(function(p){return !p.me&&p.o>overall()+2;})){S.ntCap=1;logm('Eres el nuevo capitán de '+nation(me.nat).n+'.');newsAdd(S.name+' llevará el brazalete de '+nation(me.nat).n,'yo');hito('capn','Capitán de '+nation(me.nat).n);}}
}
function captainWeekly(rep){
 if(!isCaptain())return;
 if(S.rel.team<45)rel('team',1);moral(0.5);
 if(rep&&rep.lose&&rep.mins>0&&Math.random()<0.3){rel('press',-1);logm('Como capitán, te toca dar la cara ante la prensa tras la derrota.');}
}

/* ---------- vida personal: casa, coches y familia ---------- */
var HOUSES=[{id:'h0',n:'Piso compartido',w:0,m:0,en:0},{id:'h1',n:'Piso propio',w:600,m:0.3,en:0},{id:'h2',n:'Ático en el centro',w:3500,m:0.6,en:1},
 {id:'h3',n:'Chalet con gimnasio',w:12000,m:0.9,en:3},{id:'h4',n:'Mansión con piscina',w:40000,m:1.2,en:4}];
var CARS=[{id:'c1',n:'Utilitario',c:15000,f:0},{id:'c2',n:'Berlina',c:60000,f:0.005},{id:'c3',n:'Todoterreno de lujo',c:140000,f:0.01},{id:'c4',n:'Deportivo',c:300000,f:0.02},{id:'c5',n:'Superdeportivo',c:1200000,f:0.04}];
function home(){return byId(HOUSES,S.home||'h0')||HOUSES[0];}
function homeCost(){return home().w;}
function moveHome(id){var h=byId(HOUSES,id);if(!h||h.id===home().id)return;var fee=h.w*4;
 if(S.money<fee){toast('Para mudarte necesitas '+fmt(fee)+' (fianza de 4 semanas).',1);return;}
 S.money-=fee;S.home=id;logm('Te mudas: '+h.n+'.');toast('Nueva casa: '+h.n);save();render();}
function buyCar(id){var c=byId(CARS,id);S.cars=S.cars||[];if(!c||S.cars.indexOf(id)>=0)return;if(S.money<c.c){toast('Te faltan '+fmt(c.c-S.money)+'.',1);return;}
 S.money-=c.c;S.cars.push(id);if(typeof s3dNow==='function')s3dNow('coche',{n:c.n.toLowerCase(),color:pick(['#c62828','#1565c0','#f5c542','#111111','#eeeeee']),kit:s3dKit()});if(c.f)S.fol=Math.round(S.fol*(1+c.f));moral(2);logm('Te compras un '+c.n.toLowerCase()+'.');toast('Nuevo coche: '+c.n);save();render();}
function lifeWeekly(){var h=home();if(h.w)S.money-=h.w;if(h.m)moral(h.m);if(h.en)S.energy=Math.min(100,S.energy+h.en);
 var F=S.fam;if(F&&F.p)moral(0.4);}
function famTxt(){var F=S.fam||{};if(!F.p)return 'Sin pareja.';return (F.mar?'Casado/a':'Con pareja')+' desde la temporada '+F.p+(F.kids?' · '+F.kids+' hijo'+(F.kids>1?'s':''):'')+'.';}
function lifePersonal(){
 var h='<div class="card"><h3>Tu casa</h3><p class="small mut" style="margin-top:0">Vives en: <b>'+home().n+'</b>'+(home().w?' ('+fmt(home().w)+'/semana)':'')+'. Una casa mejor sube tu moral y tu descanso cada semana. Mudarte cuesta 4 semanas de alquiler.</p>';
 HOUSES.forEach(function(x){var on=home().id===x.id;h+='<div class="item"><div><b>'+x.n+'</b><p>'+(x.w?fmt(x.w)+'/semana':'Gratis')+(x.m?' · moral +'+ds(x.m)+'/sem.':'')+(x.en?' · energía +'+x.en+'/sem.':'')+'</p></div>'+(on?'<span class="good">Tu casa</span>':'<button class="go alt '+(S.money>=x.w*4?'':'dis')+'" data-a="home" data-id="'+x.id+'">Mudarte</button>')+'</div>';});
 h+='</div><div class="card"><h3>Garaje</h3>';var G=S.cars||[];
 CARS.forEach(function(x){var has=G.indexOf(x.id)>=0;h+='<div class="item"><div><b>'+x.n+'</b><p>'+fmt(x.c)+(x.f?' · seguidores +'+ds(x.f*100)+'%':'')+' · moral +2</p></div>'+(has?'<span class="good">En tu garaje</span>':'<button class="go alt '+(S.money>=x.c?'':'dis')+'" data-a="car" data-id="'+x.id+'">Comprar</button>')+'</div>';});
 h+='</div><div class="card"><h3>Familia</h3><p style="margin:0">'+famTxt()+'</p><p class="small mut">La vida personal llega con eventos: conocer a alguien, la boda, los hijos y alguna crisis. Tener pareja sube un poco tu moral cada semana.</p></div>';
 return h;
}
/* eventos personales (se suman a los de entorno.js) */
var FAM_EVENTS=[
 {t:'Conoces a alguien especial',d:'En una cena con amigos surge la chispa.',c:function(){return !(S.fam&&S.fam.p)&&S.age>=19;},o:[
  {n:'Empezar una relación',f:function(){S.fam=S.fam||{};S.fam.p=S.season;moral(6);return 'Empiezas una relación. Estás feliz.';}},
  {n:'Centrarte en el fútbol',f:function(){return 'Ahora mismo solo piensas en el fútbol.';}}]},
 {t:'¿Es el momento de casarse?',d:'Lleváis tiempo juntos y la idea está en el aire.',c:function(){return S.fam&&S.fam.p&&!S.fam.mar&&S.season-S.fam.p>=2;},o:[
  {n:'Pedir matrimonio (boda: '+fmt(60000)+')',f:function(){if(S.money<60000)return 'Queréis una boda en condiciones: ahorrad un poco más.';S.money-=60000;S.fam.mar=S.season;moral(8);rel('press',2);S.fol=Math.round(S.fol*1.02);newsAdd('Boda de '+S.name+': así fue la celebración','yo');hito('boda','Boda');return '¡Os casáis! Una fiesta inolvidable.';}},
  {n:'Todavía no',f:function(){return 'Seguís como estáis.';}}]},
 {t:'¡Vais a tener un bebé!',d:'La noticia llega en mitad de la temporada.',c:function(){return S.fam&&S.fam.p&&(S.fam.kids||0)<3&&S.season-S.fam.p>=2;},o:[
  {n:'¡Qué alegría!',f:function(){S.fam.kids=(S.fam.kids||0)+1;moral(8);S.energy=Math.max(0,S.energy-10);newsAdd(S.name+' será padre/madre','yo');hito('hijo','Nacimiento de tu hijo');return 'Una gran alegría. Las primeras noches cuesta dormir.';}}]},
 {t:'Crisis de pareja',d:'Los viajes y las concentraciones pasan factura en casa.',c:function(){return S.fam&&S.fam.p;},o:[
  {n:'Dedicarle más tiempo',f:function(){S.energy=Math.max(0,S.energy-10);moral(3);return 'Os dais tiempo y la relación mejora.';}},
  {n:'Centrarte en el fútbol',f:function(){if(Math.random()<0.5){var k=S.fam.kids||0;S.fam={kids:k};moral(-10);return 'Lo dejáis. Te cuesta concentrarte.';}moral(-2);return 'Seguís juntos, pero con distancia.';}}]}
];

/* ---------- el rival de tu generación ---------- */
function rivalP(){var p=S.rival!=null?S.pl[S.rival]:null;return p&&p.c>=0?p:null;}
function rivalPick(){
 if(rivalP())return;var g=posGroup(S.pos),line=(POSD[S.pos]||{}).line;
 var by=function(d){return S.pl.filter(function(p){return p&&!p.me&&p.c>=0&&Math.abs(p.a-S.age)<=d&&(posGroup(p.p)===g||(POSD[p.p]||{}).line===line);}).sort(function(a,b){var t=overall()+6;return Math.abs(a.o-t)-Math.abs(b.o-t);});},c=by(2);if(!c.length)c=by(4);
 if(!c.length)return;var p=c[Math.floor(Math.random()*Math.min(3,c.length))];S.rival=p.i;S.rivW=S.rivW||{me:0,him:0};
 logm('La prensa ya habla de tu gran rival generacional: '+p.n+' ('+S.clubs[p.c].n+').');newsAdd(S.name+' y '+p.n+', la rivalidad que viene','yo');
}
function rivalSeasonScore(g,a,r){return g+a*0.6+r*3;}
function rivalSeason(){
 var R=rivalP();if(!R)return;var L=stOf(R,'L'),rr=L[0]?L[3]/L[0]:0,mine=rivalSeasonScore(S.ss.g,S.ss.a,S.ss.rn?S.ss.rsum/S.ss.rn:0),his=rivalSeasonScore(L[1],L[2],rr);
 S.rivW=S.rivW||{me:0,him:0};if(mine>his)S.rivW.me++;else if(his>mine)S.rivW.him++;
 S.rivLast={s:S.season,me:[S.ss.g,S.ss.a,S.ss.rn?S.ss.rsum/S.ss.rn:0],him:[L[1],L[2],rr],club:S.clubs[R.c].n};
}
function rivalCard(){
 var R=rivalP();if(!R)return '';var W=S.rivW||{me:0,him:0},L=stOf(R,'L'),b=(S.bdo||[]).slice(-1)[0],hisB=b?b.top.findIndex(function(x){return x.n===R.n;})+1:0;
 var row=function(lbl,a,bb,fmtf){var f=fmtf||function(x){return x;};return '<tr><td>'+lbl+'</td><td class="num '+(a>bb?'good':'')+'">'+f(a)+'</td><td class="num '+(bb>a?'bad':'')+'">'+f(bb)+'</td></tr>';};
 return '<div class="card"><h3>Tu gran rival</h3><p class="small mut" style="margin-top:0"><b>'+esc(R.n)+'</b> · '+POS[R.p]+' · '+R.a+' años · '+esc(S.clubs[R.c].n)+'. Temporadas ganadas: <b class="num">'+W.me+' – '+W.him+'</b>.</p>'+
  '<div class="tw"><table><tr><th></th><th>Tú</th><th>'+esc(R.n.split(' ').slice(-1)[0])+'</th></tr>'+row('Valoración',Math.round(overall()),R.o)+row('Valor',mv(S.pl[S.me]),mv(R),fmv)+row('Goles (liga)',S.ss.g,L[1])+row('Asistencias (liga)',S.ss.a,L[2])+
  (b?row('Balón de Oro T'+b.s,b.me?31-b.me:0,hisB?31-hisB:0,function(x){return x?(31-x)+'º':'—';}):'')+'</table></div></div>';
}

/* los eventos personales se suman a los generales; la charla de capitán, a las acciones */
EVENTS.push.apply(EVENTS,FAM_EVENTS);
ACTS.push({id:'charla',w:'team',n:'Charla de capitán',d:'Solo si eres el capitán: +5 vestuario y +3 de moral',cd:4,cost:0,
 cond:function(){return isCaptain()?null:'Solo el capitán puede hacerlo.';},
 run:function(){rel('team',5);moral(3);return 'Reúnes al vestuario y hablas claro. El equipo sale enchufado.';}});
/* ---------- redes: polémicas y momentos virales ----------
   Después de algunos partidos pasa algo en tus redes y decides cómo responder. Si no respondes en 2 semanas, cuenta como ignorarlo. */
var POLEM={
 derrota:{t:'Te critican en redes tras la derrota',d:'Tras la derrota, muchos aficionados te señalan en tus redes.',p:0.18,
  o:[{n:'Responder con calma',f:{fol:0.01,press:2,fans:1},r:'Tu mensaje tranquilo calma los ánimos.'},
     {n:'Contestar con dureza',f:{fol:0.03,press:-4,coach:-2,fans:-3,moral:2},r:'Tu respuesta se hace viral, pero en el club no gusta nada.'},
     {n:'Ignorarlo',f:{fol:-0.01,moral:-2},ig:1,r:'No dices nada y la tormenta pasa, aunque pierdes algún seguidor.'}]},
 roja:{t:'Polémica por tu expulsión',d:'Las imágenes de tu roja dan la vuelta a las redes.',p:0.6,
  o:[{n:'Pedir perdón',f:{fol:-0.005,team:2,fans:2,coach:1},r:'Pides perdón al equipo y a la afición. Se valora.'},
     {n:'Defenderte: no era roja',f:{fol:0.02,press:-3,coach:-1},r:'Muchos te dan la razón, pero la prensa y el club no tanto.'},
     {n:'Silencio',f:{fol:-0.01},ig:1,r:'Prefieres no hablar del tema.'}]},
 fiesta:{t:'Se filtra una foto tuya de fiesta',d:'Alguien sube una foto tuya de madrugada en plena semana.',p:0.035,
  o:[{n:'Explicarte: era un cumpleaños familiar',f:{press:1,coach:-1,fol:0.005},r:'La explicación convence a medias.'},
     {n:'Tomártelo con humor',f:{fol:0.03,coach:-3,press:-1},r:'Tu broma gusta a los seguidores; al entrenador, no.'},
     {n:'Desconectar de redes unos días',f:{fol:-0.02,moral:2,coach:1},ig:1,r:'Desapareces de redes y la cosa se enfría.'}]},
 meme:{t:'Te has convertido en un meme',d:'Una jugada tuya del último partido corre por todas partes convertida en meme.',p:0.04,
  o:[{n:'Reírte de ti mismo',f:{fol:0.05,press:2,moral:2},r:'Te ríes con todos y ganas un montón de seguidores.'},
     {n:'Pedir que lo borren',f:{fol:-0.01,press:-1,moral:-2},r:'Lo único que consigues es que circule más.'},
     {n:'No hacer caso',f:{},ig:1,r:'A los pocos días ya nadie se acuerda.'}]},
 viral:{t:'Tu partido se hace viral',d:'El resumen de tu actuación es lo más visto de la jornada.',p:0.35,
  o:[{n:'Aprovecharlo con una publicación pagada',f:{fol:0.03,money:1},r:'Una marca te paga por publicar en el mejor momento.'},
     {n:'Dar las gracias al equipo',f:{fol:0.02,team:2,press:1},r:'Repartes el mérito y el vestuario lo agradece.'},
     {n:'No darle importancia',f:{fol:0.01},ig:1,r:'Sigues a lo tuyo.'}]}
};
function polemAfter(info){
 if(S.pol||!S.fol)return;var k=null;
 if(info.red&&Math.random()<POLEM.roja.p)k='roja';
 else if(info.res<0&&info.r<6&&Math.random()<POLEM.derrota.p*(info.r<5?1.6:1))k='derrota';
 else if((info.g>=2||info.r>=8.5)&&Math.random()<POLEM.viral.p)k='viral';
 else if(Math.random()<POLEM.meme.p)k='meme';
 else if(Math.random()<POLEM.fiesta.p*(S.moral>70?1.5:1))k='fiesta';
 if(!k)return;S.pol={k:k,wk:S.wk||0};logm(POLEM[k].t+'. Decide cómo responder en Vida → Redes.');
}
function polemDo(i,auto){
 var P=S.pol;if(!P)return;var E=POLEM[P.k],o=E.o[i]||E.o[E.o.length-1],f=o.f,parts=[];S.pol=null;
 if(f.fol){S.fol=Math.max(100,Math.round(S.fol*(1+f.fol)));parts.push('seguidores '+(f.fol>0?'+':'')+Math.round(f.fol*1000)/10+'%');}
 ['press','fans','team','coach'].forEach(function(k){if(f[k])rel(k,f[k]);});
 if(f.moral)moral(f.moral);
 if(f.money){var m=Math.round(postValue()*0.8);S.money+=m;parts.push('cobras '+fmt(m));}
 var msg=(auto?'No respondes a tiempo: ':'')+o.r+(parts.length?' ('+parts.join(', ')+')':'');logm(msg);if(!auto){toast(msg);save();render();}
}
/* cada semana: si llevas 2 sin responder, cuenta como ignorarlo */
function polemWeek(){if(!S.pol)return;if((S.wk||0)-S.pol.wk>=2){var E=POLEM[S.pol.k],ig=0;E.o.forEach(function(o,i){if(o.ig)ig=i;});polemDo(ig,1);}}
function polemCard(){
 if(!S.pol)return '';var E=POLEM[S.pol.k];
 return '<div class="card" style="border-color:var(--gold)"><h3>'+esc(E.t)+'</h3><p class="small mut" style="margin-top:0">'+esc(E.d)+' Si no respondes en 2 semanas, cuenta como «'+esc(E.o.filter(function(o){return o.ig;})[0].n.toLowerCase())+'».</p>'+
  E.o.map(function(o,i){return '<button class="opt" data-a="polem" data-i="'+i+'">'+esc(o.n)+'</button>';}).join('')+'</div>';
}

/* ---------- lesiones: jugar tocado o parar ----------
   Con una lesión leve (3 semanas o menos) puedes pedir jugar tocado: juegas peor, te cansas más y puedes recaer (35%).
   Si eliges parar del todo, cada semana tienes un 25% de recuperarte una semana antes. */
function injCanPlay(){return S.injured>0&&S.injured<=3&&S.injDec==='toc';}
function injSet(k){if(!(S.injured>0))return;S.injDec=k;logm(k==='toc'?'Decides jugar tocado mientras dure la lesión.':'Decides parar del todo hasta recuperarte.');save();render();}
function injCard(){
 if(!(S.injured>0))return '';var leve=S.injured<=3,d=S.injDec;
 return '<div class="card"><h3>Estás lesionado: '+S.injured+' semana(s) de baja</h3>'+
  (leve?'<p class="small mut" style="margin-top:0">Es una lesión leve: puedes jugar tocado o parar del todo.</p>'+
   '<button class="opt'+(d==='toc'?' sel':'')+'" data-a="injdec" data-id="toc"><b>Jugar tocado</b><div class="small mut">Puedes jugar (si el entrenador te pone). Duelos −7%, nota −0,3, más cansancio y un 35% de recaída por partido (2-4 semanas más). Si aguantas, al entrenador le gusta.</div></button>'+
   '<button class="opt'+(d==='rest'?' sel':'')+'" data-a="injdec" data-id="rest"><b>Parar y recuperarte</b><div class="small mut">No juegas. Cada semana, un 25% de volver una semana antes.</div></button>'+
   (d?'<div class="small good" style="margin-top:6px">Elegido: '+(d==='toc'?'jugar tocado':'parar y recuperarte')+'.</div>':'')
  :'<p class="small mut" style="margin-top:0">Es una lesión seria: no puedes jugar. Cuando queden 3 semanas o menos podrás decidir si jugar tocado.</p>'+
   '<button class="opt'+(d==='rest'?' sel':'')+'" data-a="injdec" data-id="rest"><b>Parar y recuperarte</b><div class="small mut">Cada semana, un 25% de volver una semana antes.</div></button>')+'</div>';
}
