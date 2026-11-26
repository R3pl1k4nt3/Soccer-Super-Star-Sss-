/* Estrella del Balón · progresión del jugador, forma, valor de mercado mensual y momentos estrella. */

/* ---------- potencial y edad ---------- */
/* el potencial es el techo de valoración del jugador; solo se ve como un rango aproximado */
function initProgress(){
 if(S.pot==null){var tp=traitById(S.tp);S.pot=Math.round(clamp(70+norm()*7+(Math.random()<0.12?8:0),60,96));}
 if(S.val==null)S.val=mvRaw();
 S.vhist=S.vhist||[];S.moments=S.moments||[];S.valMom=S.valMom||0;S.form=S.form||[];
 if(!S.tl)S.tl={p:{t:0,x:0},s:{t:0,x:0}};
 S.skills.forEach(function(k){if(k.gr==null){var x=skTalent();k.gr=x.gr;k.cj=x.cj;}});
}
function potBand(){var p=S.pot,lo=Math.max(40,Math.floor((p-4)/2)*2),hi=lo+8;var t=p>=88?'Clase mundial':p>=82?'Muy alto':p>=75?'Alto':p>=68?'Medio':'Modesto';return t+' ('+lo+'-'+hi+')';}
/* crecimiento según la edad: rápido hasta los 23, estable hasta los 28, luego baja */
function ageGrowth(a){return a<=19?1.35:a<=21?1.25:a<=23?1.12:a<=26?1:a<=28?0.85:a<=30?0.65:a<=32?0.45:0.3;}
/* cuanto más cerca del techo, más cuesta mejorar */
function potGrowth(){var ov=overall(),gap=S.pot-ov;return gap>=10?1:gap>=5?0.8:gap>=2?0.55:gap>=0?0.3:0.12;}
/* ---------- ritmo de mejora: edad × liga × potencial ----------
   Liga: en ligas fuertes mejoras más rápido; en las bajas marcas más, pero tu valoración se estanca antes (techo de la liga).
   Edad: de joven la liga marca mucho tu desarrollo; de veterano, poco. A partir de los 31, en una liga fuerte
   mantienes mejor el físico (mejores médicos y preparadores); en una baja lo pierdes antes. */
function lgLevelOf(cid){var c=S.clubs[cid];if(!c)return 50;var lg=lgOf(cid),s=0;if(!lg)return c.str;lg.clubs.forEach(function(id){s+=S.clubs[id].str;});return s/lg.clubs.length;}
function lgLevel(){var me=S.pl[S.me];if(!me||me.c==null||me.c<0)return 50;return lgLevelOf(me.c);}
function ceilOf(L){return Math.round(L+14);}
function leagueCeil(){return ceilOf(lgLevel());}
/* cuánto pesa la liga según la edad */
function lgAgeW(a){return a<=19?1.25:a<=21?1.15:a<=24?1:a<=27?0.75:a<=30?0.55:0.4;}
function lgBase(L){return clamp(0.65+(L-40)/60,0.6,1.35);}
function leagueFor(L,a,ov){var f=1+(lgBase(L)-1)*lgAgeW(a),c=ceilOf(L);if(ov>c)f*=clamp(1-(ov-c)/10,0.25,1);return Math.max(0.2,f);}
function leagueF(){return leagueFor(lgLevel(),S.age,overall());}
/* pérdida física de los veteranos: menos en ligas fuertes */
function declineFor(L){return clamp(1.2-(L-40)/100,0.8,1.2);}
function growthAt(cid){return ageGrowth(S.age)*potGrowth()*leagueFor(lgLevelOf(cid),S.age,overall());}
function growthF(){return ageGrowth(S.age)*potGrowth()*leagueF()*diff().gr;}
function pcnt(x){return Math.round(x*100)+'%';}
function rateCls(f){return f>=1?'good':f<0.75?'bad':'';}
function leagueTxt(){var a=ageGrowth(S.age),l=leagueF(),p=potGrowth(),g=a*l*p,ov=overall(),c=leagueCeil();
 return 'Ritmo de mejora: <b class="num '+rateCls(g)+'">'+pcnt(g)+'</b> <span class="mut">= edad '+pcnt(a)+' × liga '+pcnt(l)+' × potencial '+pcnt(p)+'</span>'+
  (ov>c?'<br><span class="bad">Te has quedado pequeño para esta liga: por encima de '+c+' casi no mejoras.</span>':'<br><span class="mut">Techo de tu liga ≈'+c+'. A tu edad la liga pesa un '+pcnt(lgAgeW(S.age))+(S.age>=31?'; en ella pierdes físico al '+pcnt(declineFor(lgLevel()))+'.':'.')+'</span>');}
/* ritmo que tendrías en cada división de tu país, a tu edad y con tu valoración */
function lgRatesCard(){
 var me=S.pl[S.me],c=S.clubs[me.c];if(!c||c.guest)return '';
 var lgs=S.lgs.filter(function(l){return l.co===c.co;}).sort(function(a,b){return a.t-b.t;}),ov=overall(),a=ageGrowth(S.age),p=potGrowth();
 var h='<div class="card"><h3>Dónde mejorarías más</h3><p class="small mut" style="margin-top:0">Ritmo de mejora en cada división de '+esc(country(c.co).n)+' con tu edad ('+S.age+') y tu valoración ('+ds(ov)+'). En las bajas juegas más y marcas más, pero te estancas antes.</p><div class="tw"><table><tr><th>División</th><th>Nivel</th><th>Techo</th><th>Ritmo</th></tr>';
 lgs.forEach(function(l){var s=0;l.clubs.forEach(function(id){s+=S.clubs[id].str;});var L=s/l.clubs.length,g=a*p*leagueFor(L,S.age,ov),mine=l.id===c.co+c.t;
  h+='<tr class="'+(mine?'mine':'')+'"><td>'+esc(l.n)+(mine?' (tú)':'')+'</td><td class="num">'+Math.round(L)+'</td><td class="num">'+ceilOf(L)+'</td><td class="num '+rateCls(g)+'">'+pcnt(g)+'</td></tr>';});
 return h+'</table></div></div>';
}
function growthTxt(){var g=growthF();return g>=1.1?'Creces muy rápido':g>=0.85?'Creces a buen ritmo':g>=0.55?'Creces despacio':g>=0.3?'Cerca de tu techo':'En tu techo o por encima';}

/* ---------- entrenar sin jugar rinde cada vez menos ---------- */
/* cada punto comprado esta semana encarece el siguiente un 4 % */
function trainSurcharge(){return 1+0.04*(S.weekTrain||0);}

/* ---------- forma: media de las últimas 5 notas ---------- */
function formAvg(){var f=S.form||[];if(!f.length)return 6.3;return f.reduce(function(s,x){return s+x;},0)/f.length;}
function formF(){return clamp(formAvg()-6.5,-1.5,1.5);}
function formTxt(){var f=formAvg();return !S.form||!S.form.length?'Sin partidos':f>=7.5?'Excelente':f>=6.9?'Buena':f>=6.2?'Normal':f>=5.6?'Floja':'Mala';}

/* ---------- valor de mercado: se actualiza a final de cada mes ---------- */
function mvRaw(){
 var me=S.pl[S.me],c=S.clubs[me.c],caps=S.nt?S.nt.caps:0,aw=(S.trophies||[]).filter(function(t){return t.s>=S.season-1;}).length;
 var f=1+formF()*0.12,mins=S.ss&&S.ss.pj?clamp(S.ss.pj/Math.max(1,(S.slot||1)/2.2),0.6,1.15):1,fame=1+Math.min(0.3,Math.log10(Math.max(1,S.fol))/30);
 var nat=1+Math.min(0.15,caps*0.01),awd=1+Math.min(0.2,aw*0.03),yrs=S.contract&&S.contract.years<=1?0.9:1;
 return mvBase(overall(),S.age,S.pos,c.co,c.t)*f*mins*fame*nat*awd*yrs;
}
function valuation(){
 var old=S.val||mvRaw(),nv=mvRound(mvRaw()*(1+(S.valMom||0)));S.valMom=0;S.val=nv;
 S.vhist=S.vhist||[];S.vhist.push({s:S.season,m:slotMonth(Math.max(0,S.slot-1)),v:nv,o:r1(overall())});if(S.vhist.length>240)S.vhist.shift();
 var d=nv-old,pc=old?d/old:0;
 if(Math.abs(pc)>=0.03){var m='Tu valor de mercado '+(d>0?'sube':'baja')+' a '+fmv(nv)+' ('+(d>0?'+':'−')+fmv(Math.abs(d))+').';logm(m);toast(m,d<0);}
}

/* ---------- momentos estrella y momentos negros ---------- */
function moment(kind,txt,fx){
 fx=fx||{};S.moments=S.moments||[];
 S.moments.unshift({s:S.season,m:slotMonth(S.slot),k:kind,t:txt,ic:fx.ic||null});if(S.moments.length>80)S.moments.length=80;
 var star=kind==='star',big=fx.big?1.6:1;
 S.valMom=(S.valMom||0)+(star?0.06:-0.06)*big;
 S.fol=Math.round(S.fol*(1+(star?0.05:-0.01)*big));
 moral((star?10:-12)*big);rel('press',(star?4:-5)*big);if(!star)rel('fans',-3*big);else rel('fans',3*big);
 logm((star?'★ Momento estrella: ':'✖ Momento negro: ')+txt);
 return {k:kind,t:txt,ic:fx.ic||null};
}
/* se revisa al final de cada partido del jugador; devuelve los momentos para mostrarlos en el resumen */
function checkMoments(M,rep){
 var out=[],me=S.pl[S.me],desc=M.desc,nat=!!desc.nat,fin=/Final/.test(desc.rn||''),ko=desc.ko||desc.leg;
 traitXP(M,rep).forEach(function(x){out.push(x);});
 if(rep.mins>0){
  if(!nat&&S.stats.pj===1)out.push(moment('star','Debut como profesional con '+S.clubs[me.c].n+'.',{ic:'debut'}));
  if(nat&&S.nt.caps===1)out.push(moment('star','Debut con la selección de '+nation(me.nat).n+'.',{big:1,ic:'debut'}));
  if(rep.g>0&&S.stats.g===rep.g)out.push(moment('star','Primer gol como profesional.',{ic:'primer-gol'}));
  if(rep.g>=3)out.push(moment('star','Hat-trick contra '+(M.home?rep.away:rep.home)+'.',{big:1,ic:'hat-trick'}));
  var gs=Math.floor(S.stats.g/50)*50;if(gs>0&&S.stats.g-rep.g<gs)out.push(moment('star','Llegas a '+gs+' goles como profesional.'));
  /* gol decisivo: tuyo, en el minuto 80 o más, que da la victoria o el empate en un partido importante */
  var late=rep.evs.filter(function(e){return e.me==='g'&&e.min>=80;});
  if(late.length&&(rep.win||(!rep.lose&&rep.gf===rep.gc))&&M.imp>=1.3)out.push(moment('star','Gol decisivo en el minuto '+late[late.length-1].min+(fin?' de la final':'')+'.',{big:fin,ic:'gol-decisivo'}));
  /* duelo decisivo fallado que acaba en derrota en un partido grande */
  var bad=M.decs.filter(function(d){return d.dec&&d.done>=0&&!d.ok;});
  if(bad.length&&rep.lose&&M.imp>=1.4)out.push(moment('black','Fallas en la jugada decisiva'+(fin?' de la final':'')+' y tu equipo pierde.',{big:fin}));
  if(rep.red)out.push(moment('black','Expulsado en el minuto '+rep.red+'.',{ic:'expulsion'}));
  if(rep.r>=9.8&&(rep.g+rep.a>=2||S.pos==='POR')&&S.perfS!==S.season){S.perfS=S.season;out.push(moment('star','Partido perfecto: nota '+ds(rep.r)+'.'));}
  if(rep.r<=4)out.push(moment('black','Uno de los peores partidos de tu carrera (nota '+ds(rep.r)+').'));
 }
 /* tanda de penaltis: a veces te toca el lanzamiento decisivo */
 if(rep.pw&&rep.mins>=60&&S.pos!=='POR'&&Math.random()<0.4){
  var p=clamp(0.55+(skv('fin')+skv('con'))/400+(S.moral-50)*0.003,0.35,0.92),ok=Math.random()<p;
  rep.pen=ok?'Marcas el penalti decisivo de la tanda.':'Fallas el penalti decisivo de la tanda.';
  out.push(moment(ok?'star':'black',rep.pen+(fin?' En una final.':''),{big:fin,ic:ok?'penalti-marcado':'penalti-fallado'}));
 }
 return out;
}
/* título ganado: momento estrella */
function titleMoment(n){moment('star','Campeón: '+n+'.',{big:1,ic:'titulo'});}

/* ---------- gráfico de evolución (SVG) ---------- */
function valueChart(){
 var H=S.vhist||[];if(H.length<2)return '<p class="small mut">El gráfico aparece cuando tengas al menos dos valoraciones mensuales.</p>';
 var W=640,Hh=200,pad=36,mx=Math.max.apply(null,H.map(function(x){return x.v;}))*1.1||1,mo=100,mn=Math.min.apply(null,H.map(function(x){return x.o;}))-5;
 var X=function(i){return pad+(W-pad*2)*i/(H.length-1);},Yv=function(v){return Hh-pad+(-(Hh-pad*2))*v/mx;},Yo=function(o){return Hh-pad-(Hh-pad*2)*(o-mn)/(mo-mn);};
 var pv=H.map(function(x,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Yv(x.v).toFixed(1);}).join(' '),po=H.map(function(x,i){return (i?'L':'M')+X(i).toFixed(1)+' '+Yo(x.o).toFixed(1);}).join(' ');
 var seasons='';H.forEach(function(x,i){if(i&&x.s!==H[i-1].s)seasons+='<line x1="'+X(i)+'" x2="'+X(i)+'" y1="'+pad/2+'" y2="'+(Hh-pad)+'" stroke="rgba(148,163,184,.2)"/><text x="'+(X(i)+3)+'" y="'+(pad/2+10)+'" fill="#9fb0c8" font-size="11">T'+x.s+'</text>';});
 var last=H[H.length-1];
 return '<svg class="chart" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Evolución de tu valor de mercado, ahora '+fmv(last.v)+', y de tu valoración, ahora '+ds(last.o)+'">'+seasons+
  '<path d="'+pv+'" fill="none" stroke="#3ddc84" stroke-width="3" stroke-linejoin="round"/><path d="'+po+'" fill="none" stroke="#f5c542" stroke-width="2" stroke-dasharray="5 4"/>'+
  '<text x="'+pad+'" y="'+(Hh-10)+'" fill="#9fb0c8" font-size="12">Máximo: '+fmv(mx/1.1)+'</text></svg>'+
  '<div class="small mut"><span class="good">━</span> Valor de mercado · <span class="star">┅</span> Valoración</div>';
}

/* ---------- rangos de rasgo: Bronce, Plata, Oro, Platino ---------- */
/* rasgos del jugador con su papel: p principal, s secundario, x0 y x1 añadidos durante la carrera */
function myTraits(){var l=[{r:'p',id:S.tp},{r:'s',id:S.ts}];(S.tx||[]).forEach(function(id,i){l.push({r:'x'+i,id:id});});return l.filter(function(x){return x.id;});}
function roleName(r){return {p:'Principal',s:'Secundario',x0:'Tercer rasgo',x1:'Cuarto rasgo'}[r];}
/* experiencia por partido: nota y uso del rasgo (goles, asistencias, porterías a cero, partidos grandes) */
function traitXP(M,rep){
 var out=[];if(!S.tl||rep.mins<=0)return out;
 myTraits().forEach(function(z){
  var r=z.r,t=traitById(z.id),st=S.tl[r]||(S.tl[r]={t:0,x:0});if(!t||st.t>=TIERMAX[r])return;
  var f=r==='p'?1:r==='s'?0.7:0.5,x=(1.5+Math.max(0,rep.r-5.5)*2)*f;
  if(t.fx.gs||t.fx.fk)x+=rep.g*4;
  if(t.fx.as)x+=rep.a*4;
  if((t.fx.cancel||t.gk)&&rep.gc===0)x+=4;
  if(t.fx.big&&M.imp>=1.5)x+=4;
  if(t.fx.team||t.fx.rate||t.fx.drain)x+=rep.win?2:0;
  st.x=r1(st.x+x*(rep.mins/90));
  var nx=TIERS[st.t+1];
  if(st.x>=nx.xp){st.t++;var msg='Tu rasgo '+t.n+' sube a '+TIERS[st.t].n+'.';out.push(moment('star',msg,{ic:'titulo'}));toast(msg);}
 });
 if(newTraitSlot()&&!S.ntNotified){S.ntNotified=1;logm('Puedes elegir un rasgo nuevo en Jugador → Entreno.');toast('¡Puedes elegir un rasgo nuevo!');}
 return out;
}
/* hueco para un rasgo nuevo: el tercero cuando el principal llega a Oro; el cuarto cuando el secundario llega a Oro */
function newTraitSlot(){if(!S.tl)return false;var n=(S.tx||[]).length;if(n===0&&tierOf('p')>=2)return true;if(n===1&&tierOf('s')>=2)return true;return false;}
function addTrait(id){
 if(!newTraitSlot())return;var t=traitById(id);if(!t||id===S.tp||id===S.ts||(S.tx||[]).indexOf(id)>=0||!!t.gk!==(S.pos==='POR'))return;
 S.tx=S.tx||[];S.tx.push(id);S.tl['x'+(S.tx.length-1)]={t:0,x:0};S.ntNotified=0;
 logm('Nuevo rasgo: '+t.n+' (llegará como mucho a '+TIERS[TIERMAX['x'+(S.tx.length-1)]].n+').');toast('Nuevo rasgo: '+t.n);save();render();
}
function traitBadge(r){
 var id=r==='p'?S.tp:r==='s'?S.ts:(S.tx||[])[+r.slice(1)],t=traitById(id);if(!t)return '';var st=S.tl&&S.tl[r]||{t:2,x:0},T=TIERS[st.t],nx=st.t<TIERMAX[r]?TIERS[st.t+1]:null;
 return '<span class="tbadge" style="--tc:'+T.c+'">'+(typeof icoRasgo==='function'?icoRasgo(t.id,18):'')+t.n+' · <b>'+T.n+'</b>'+(nx?' <span class="mut">'+Math.floor(st.x)+'/'+nx.xp+' XP</span>':'')+'</span>';
}
/* barra de desarrollo de un rasgo: los cuatro rangos, el progreso al siguiente y los rangos que no puede alcanzar */
function traitBar(z){
 var t=traitById(z.id);if(!t)return '';var st=S.tl&&S.tl[z.r]||{t:2,x:0},mx=TIERMAX[z.r],nx=st.t<mx?TIERS[st.t+1]:null,prev=TIERS[st.t].xp,pc=nx?clamp((st.x-prev)/(nx.xp-prev),0,1):1;
 var pips=TIERS.map(function(T,i){var cls=i<=st.t?'on':i<=mx?'':'lock';return '<span class="tpip '+cls+'" style="--tc:'+T.c+'" title="'+T.n+(i>mx?' (bloqueado para este rasgo)':'')+'">'+(i>mx?'🔒 ':'')+T.n+'</span>';}).join('');
 var lim=Object.keys(t.lim||{}).filter(function(id){return mySk(id);}).map(function(id){return SKNAME[id]+' '+capVal(id);}).join(', ');
 return '<div class="tdev"><div class="rowb"><b class="tname">'+(typeof icoRasgo==='function'?icoRasgo(t.id,24):'')+t.n+'</b><span class="small mut">'+roleName(z.r)+' · máximo '+TIERS[mx].n+'</span></div>'+
  '<div class="tpips">'+pips+'</div><div class="bar big" aria-hidden="true"><i style="width:'+Math.round(pc*100)+'%;background:'+TIERS[nx?st.t+1:st.t].c+'"></i></div>'+
  '<div class="small mut">'+(nx?Math.floor(st.x)+' / '+nx.xp+' XP para '+nx.n+'. Sube jugando bien y usando el rasgo.':'Rango máximo alcanzado.')+' Mejora '+t.sk.filter(function(id){return mySk(id);}).map(function(id){return SKNAME[id];}).join(', ')+' (techo '+(function(f){return f?capVal(f)+(capTop(f)>capVal(f)?', '+capTop(f)+' en '+TIERS[mx].n:''):'';})(t.sk.filter(function(id){return mySk(id);})[0])+')'+(lim?'. Limita: '+lim:'')+'.</div></div>';
}
function traitsCard(){
 var h='<div class="card wide"><h3>Rasgos y desarrollo</h3><div class="tdevs">'+myTraits().map(traitBar).join('')+'</div>';
 var n=(S.tx||[]).length;
 if(newTraitSlot()){
  var r='x'+n,opts=TRAITS.filter(function(t){return !!t.gk===(S.pos==='POR')&&t.id!==S.tp&&t.id!==S.ts&&(S.tx||[]).indexOf(t.id)<0;});
  h+='<h3 style="margin-top:14px">Elige un rasgo nuevo</h3><p class="small mut" style="margin-top:0">Llegará como mucho a <b>'+TIERS[TIERMAX[r]].n+'</b>. Da algo menos de bonificación que tus rasgos principales y también trae sus limitaciones (3 niveles más suaves).</p><div class="tcards">'+
   opts.map(function(t){var lim=Object.keys(t.lim||{}).filter(function(id){return mySk(id);}).map(function(id){var c=25+t.lim[id]*5+LIMOFF['x'+n],cur=capVal(id);return SKNAME[id]+' máx. '+Math.min(c,cur)+(skVal(mySk(id))>c?' (ya tienes '+Math.round(skVal(mySk(id)))+')':'');});
    return '<button class="tcard" data-a="addtrait" data-id="'+t.id+'"><b class="tname">'+(typeof icoRasgo==='function'?icoRasgo(t.id,26):'')+t.n+'</b><span class="mut">'+t.d+'</span><span class="tup">▲ Mejora: '+t.sk.filter(function(id){return mySk(id);}).map(function(id){return SKNAME[id];}).join(', ')+'</span>'+(lim.length?'<span class="tdown">▼ Limita: '+lim.join(', ')+'</span>':'')+'</button>';}).join('')+'</div>';
 }else if(n<2)h+='<p class="small mut" style="margin-top:10px">'+(n===0?'Cuando tu rasgo principal llegue a Oro podrás elegir un tercer rasgo (hasta Plata).':'Cuando tu rasgo secundario llegue a Oro podrás elegir un cuarto rasgo (hasta Bronce).')+'</p>';
 return h+'</div>';
}