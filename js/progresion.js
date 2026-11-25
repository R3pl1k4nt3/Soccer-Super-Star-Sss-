/* Estrella del Balón · progresión del jugador, forma, valor de mercado mensual y momentos estrella. */

/* ---------- potencial y edad ---------- */
/* el potencial es el techo de valoración del jugador; solo se ve como un rango aproximado */
function initProgress(){
 if(S.pot==null){var tp=traitById(S.tp);S.pot=Math.round(clamp(70+norm()*7+(Math.random()<0.12?8:0),60,96));}
 if(S.val==null)S.val=mvRaw();
 S.vhist=S.vhist||[];S.moments=S.moments||[];S.valMom=S.valMom||0;S.form=S.form||[];
}
function potBand(){var p=S.pot,lo=Math.max(40,Math.floor((p-4)/2)*2),hi=lo+8;var t=p>=88?'Clase mundial':p>=82?'Muy alto':p>=75?'Alto':p>=68?'Medio':'Modesto';return t+' ('+lo+'-'+hi+')';}
/* crecimiento según la edad: rápido hasta los 23, estable hasta los 28, luego baja */
function ageGrowth(a){return a<=19?1.35:a<=21?1.25:a<=23?1.12:a<=26?1:a<=28?0.85:a<=30?0.65:a<=32?0.45:0.3;}
/* cuanto más cerca del techo, más cuesta mejorar */
function potGrowth(){var ov=overall(),gap=S.pot-ov;return gap>=10?1:gap>=5?0.8:gap>=2?0.55:gap>=0?0.3:0.12;}
function growthF(){return ageGrowth(S.age)*potGrowth();}
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
