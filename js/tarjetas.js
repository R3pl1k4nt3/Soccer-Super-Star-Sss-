/* Estrella del Balón · tarjetas y sanciones.
   - Amarilla al perder un duelo defensivo (más probable cuanto más arriesgada es la opción) o en una entrada fuerte ganada;
     también alguna suelta en tus minutos según tu puesto. Tu Concentración las reduce. Dos amarillas son roja.
   - Roja directa: de 1 a 3 partidos de sanción; doble amarilla: 1 partido. Cada 5 amarillas de liga: 1 partido (ciclo).
   - Las sanciones se cumplen en partidos de club. Expulsado, dejas de jugar: tus goles y minutos cuentan hasta la roja.
   - Los rivales y compañeros también ven tarjetas (se ven en el resumen). */
function cardP(base){return clamp(base*(1-(skv('con')-50)/250),0.01,0.6);}
/* al preparar el partido: tarjetas sueltas tuyas y de los demás */
function cardsPrep(M){
 M.cards=[];M.yc=0;if(!M.mins)return;
 var st=90-M.mins,line=(POSD[S.pos]||{}).line,f={POR:0.25,DEF:1.35,MED:1.1,DEL:0.7}[line]||1;
 if(Math.random()<cardP(0.1*f*(M.mins/90)))M.cards.push({min:st+3+Math.floor(Math.random()*Math.max(1,M.mins-6)),id:S.me,t:'y',me:1,pend:1});
 /* el resto de jugadores, solo informativo */
 [M.txi,M.oxi].forEach(function(xi,k){var n=poisson(1.7);for(var i=0;i<n;i++){var id=pick(xi);if(id===S.me)continue;M.cards.push({min:1+Math.floor(Math.random()*89),id:id,t:Math.random()<0.04?'r':'y',side:k});}});
 M.cards.sort(function(a,b){return a.min-b.min;});
}
/* amarilla (o segunda amarilla) para ti en un minuto */
function myYellow(M,min){
 if(M.red)return '';M.yc=(M.yc||0)+1;M.cards.push({min:min,id:S.me,t:'y',me:1});
 if(M.yc>=2){M.red=min;M.red2=1;M.cards.push({min:min,id:S.me,t:'r',me:1});expel(M,min);return ' · Segunda amarilla: ¡expulsado!';}
 return ' · Tarjeta amarilla';
}
/* expulsado: las jugadas que quedan no las juegas */
function expel(M,min){M.decs.forEach(function(d){if(d.done<0&&d.min>min){d.done=0;d.ok=false;d.res='Estás expulsado';d.skip=1;}});}
/* tras cada duelo: entradas que se pagan con tarjeta */
function cardOnDuel(M,d,o,ok){
 if(o.ef!=='def')return;M.cards=M.cards||[];
 if(/roja/.test(d.res||'')&&!M.redDone){M.redDone=1;M.cards.push({min:d.min,id:S.me,t:'r',me:1});expel(M,d.min);return;}
 if(M.red)return;
 var lf={POR:0.2,DEF:1,MED:0.8,DEL:0.5}[(POSD[S.pos]||{}).line]||1,p=(ok?(o.rk===2?0.06:0):[0.04,0.1,0.2][o.rk])*lf;
 if(p&&Math.random()<cardP(p))d.res+=myYellow(M,d.min);
}
/* al cerrar el partido: amarillas sueltas, minutos hasta la roja y goles después de la expulsión */
function cardsFinish(M){
 if(!M.cards)return;
 M.cards.forEach(function(c){if(c.pend){c.pend=0;if(!M.red||c.min<M.red){M.yc=(M.yc||0)+1;if(M.yc>=2&&!M.red){M.red=c.min;M.red2=1;M.cards.push({min:c.min,id:S.me,t:'r',me:1});}}else c.void=1;}});
 if(M.red&&M.mins>0){var st=90-M.mins,played=Math.max(1,M.red-st);
  M.ev.forEach(function(e){if(e.min<=M.red)return;if(e.sc===S.me){e.sc=wpickXI(M.txi,S.me,'sg');e.mine=0;}if(e.as===S.me)e.as=-1;});
  M.mins=played;}
 M.cards=M.cards.filter(function(c){return !c.void;}).sort(function(a,b){return a.min-b.min;});
}
/* tras el partido: sanciones, ciclo de amarillas y relaciones */
function cardsAfter(M,rep){
 var club=!(M.desc&&M.desc.nat),lg=M.desc&&/^L:/.test(M.desc.ck);
 if(M.role==='sancionado'){S.ban=Math.max(0,(S.ban||0)-1);logm(S.ban?'Cumples un partido de sanción. Te quedan '+S.ban+'.':'Cumples la sanción: ya puedes volver a jugar.');}
 if(!M.cards)return;var y=M.cards.filter(function(c){return c.me&&c.t==='y';}).length,r=M.red?1:0;
 if(rep){rep.yc=y;rep.rc=r;rep.cards=M.cards.map(function(c){var p=S.pl[c.id];return {min:c.min,t:c.t,me:c.me?1:0,n:c.id===S.me?S.name:(p?p.n:'')};});}
 S.stats.yc=(S.stats.yc||0)+y;S.stats.rc=(S.stats.rc||0)+r;
 if(r&&club){var ban=M.red2?1:1+Math.floor(Math.random()*2.4);S.ban=(S.ban||0)+ban;rel('coach',-4);rel('team',-2);moral(-4);
  logm((M.red2?'Expulsado por doble amarilla':'Roja directa')+': '+ban+' partido(s) de sanción.');}
 if(lg&&y&&!M.red2){var before=S.ss.yc||0;S.ss.yc=before+y;if(Math.floor(S.ss.yc/5)>Math.floor(before/5)){S.ban=(S.ban||0)+1;logm('Ciclo de amarillas: '+S.ss.yc+' en liga. Te pierdes el próximo partido.');}}
}
function cardsHTML(r){
 if(!r.cards||!r.cards.length)return '';
 return '<h3 style="margin-top:12px">Tarjetas</h3>'+r.cards.map(function(c){return '<div class="ev"><b class="num">'+c.min+"'</b><span><span class='tcard "+(c.t==='r'?'tr':'ty')+"' aria-label='"+(c.t==='r'?'Roja':'Amarilla')+"'></span> "+'<span class="'+(c.me?'me':'')+'">'+esc(c.n)+(c.me?' (tú)':'')+'</span></span></div>';}).join('');
}
function banTxt(){var p=[];if(S.ban>0)p.push('Sancionado: te pierdes '+S.ban+' partido(s) de club.');var y=(S.ss&&S.ss.yc)||0;if(y%5===4)p.push('Apercibido: llevas '+y+' amarillas en liga; una más y te pierdes un partido.');return p;}
