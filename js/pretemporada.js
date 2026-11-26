/* Estrella del Balón · pretemporada: empiezas sin club, te siguen varios equipos y haces pruebas.
   3 semanas, una prueba por semana. Un club te ofrece siempre un contrato juvenil sin prueba. */
var TRIALS=[
 {id:'partido',n:'Partidillo',d:'Juegas un partido de entrenamiento con ellos',val:function(){return overall();}},
 {id:'fisica',n:'Prueba física',d:'Velocidad, resistencia y fuerza',val:function(){return catAvg('fis');}},
 {id:'tecnica',n:'Prueba técnica',d:'Lo propio de tu puesto',val:function(){var c=S.pos==='POR'?'def':POSD[S.pos].line==='DEF'?'def':POSD[S.pos].line==='MED'?'med':'ata';return catAvg(c);}}
];
function initPre(co){
 var lgs=S.lgs.filter(function(l){return l.co===co;}).sort(function(a,b){return b.t-a.t;}),low=lgs[0],up=lgs[1]||lgs[0];
 var pool=shuffle(low.clubs.slice()),cl=[];
 cl.push({id:pool[0],st:'directa',offer:preOffer(S.clubs[pool[0]],0.7)});
 for(var i=1;i<=4;i++)cl.push({id:pool[i],st:'prueba'});
 cl.push({id:pick(up.clubs),st:'prueba'});
 S.pre={wk:1,weeks:3,used:false,co:co,clubs:cl,log:[]};
}
function preOffer(c,f){return {wage:Math.max(300,Math.round(wageFor(c.str)*f/100)*100),years:2+Math.floor(Math.random()*2)};}
function preReq(c){return c.str-6;}
function preP(c,tr){return clamp(0.3+(tr.val()-preReq(c))/22,0.06,0.94);}
function preTrial(i,tid){
 var P=S.pre,x=P.clubs[i],c=S.clubs[x.id],tr=byId(TRIALS,tid);if(!x||x.st!=='prueba'||!tr)return;
 if(P.used){toast('Ya has hecho una prueba esta semana. Pasa a la siguiente.',1);return;}
 var p=preP(c,tr),ok=Math.random()<p;P.used=true;
 if(ok){x.st='oferta';x.offer=P.free?freeOffer(c,1):preOffer(c,0.85);P.log.unshift('Semana '+P.wk+': superas la '+tr.n.toLowerCase()+' en '+c.n+'. Te ofrecen contrato.');toast('¡Prueba superada! '+c.n+' te ofrece contrato.');}
 else{x.st='rechazo';P.log.unshift('Semana '+P.wk+': la '+tr.n.toLowerCase()+' en '+c.n+' no sale bien.');toast(c.n+' no te ficha esta vez.',1);}
 save();render();
}
function preNext(){
 var P=S.pre;
 if(P.wk>=P.weeks){var d=P.clubs.filter(function(x){return x.offer;}).sort(function(a,b){return b.offer.wage-a.offer.wage;})[0];
  if(!d&&P.free){d=freeFallback();}
  preSign(P.clubs.indexOf(d));return;}
 P.wk++;P.used=false;
 /* a veces aparece otro club interesado */
 if(P.free){if(Math.random()<0.5){var nf=freePool(P);if(nf.length){var y=nf[0],o=Math.random()<0.5;P.clubs.push(o?{id:y.id,st:'directa',offer:freeOffer(y,0.95)}:{id:y.id,st:'prueba'});P.log.unshift('Semana '+P.wk+': '+y.n+' también se interesa por ti'+(o?' y te ofrece contrato.':'.'));}}save();render();return;}
 if(Math.random()<0.5){var low=S.lgs.filter(function(l){return l.co===P.co;}).sort(function(a,b){return b.t-a.t;})[0],have={};P.clubs.forEach(function(x){have[x.id]=1;});
  var nw=shuffle(low.clubs.filter(function(id){return !have[id];}))[0];if(nw!=null){P.clubs.push({id:nw,st:'prueba'});P.log.unshift('Semana '+P.wk+': '+S.clubs[nw].n+' también se interesa por ti.');}}
 save();render();
}
function preSign(i){
 if(S.pre&&S.pre.free){freeSign(i);return;}
 var x=S.pre.clubs[i];if(!x||!x.offer)return;var c=S.clubs[x.id],me=S.pl[S.me];
 me.c=c.id;c.ros.push(S.me);S.cantera=c.id;S.contract={wage:x.offer.wage,years:x.offer.years};S.pre=null;
 initProgress();
 logm('Firmas tu primer contrato con '+c.n+' ('+lgName(c)+'): '+fmt(x.offer.wage)+' por semana, '+x.offer.years+' años. Será tu club de cantera.');
 genOffers();S.tab='home';save();render();
}
/* para el bot y las pruebas: firma la mejor oferta disponible */
function preAutoSign(){if(!S.pre)return;var P=S.pre,d=P.clubs.filter(function(x){return x.offer;}).sort(function(a,b){return S.clubs[b.id].str-S.clubs[a.id].str;})[0];preSign(P.clubs.indexOf(d));}

function preHTML(){
 var P=S.pre,last=P.wk>=P.weeks,signed=P.clubs.filter(function(x){return x.offer;});
 var h='<div class="setup"><div class="setup-in">'+
  '<div class="hero"'+(typeof heroBg==='function'?heroBg():'')+'><div class="hfig" style="width:96px">'+portraitSVG(S.look,{a:'#5b6b86',b:'#ffffff',st:0},96,'Retrato de '+S.name)+'</div><div><h1>'+(P.free?'Jugador libre':'Pretemporada')+'</h1><p class="mut" style="margin:4px 0 0">'+esc(S.name)+' · '+POS[S.pos]+' · '+S.age+' años · valoración '+ds(overall())+(P.free?' · representante: '+esc(agent().n):'')+'</p></div></div>'+
  '<section class="card"><div class="rowb"><h3 style="margin:0">Semana '+P.wk+' de '+P.weeks+'</h3><span class="small '+(P.used?'mut':'good')+'">'+(P.used?'Prueba de esta semana hecha':'Puedes hacer una prueba esta semana')+'</span></div>'+
  (P.free?'<p class="small mut">Se acabó tu contrato'+(P.old!=null?' con '+esc(S.clubs[P.old].n):'')+' y no tienes club. Llegas libre, sin traspaso: por eso los clubes ofrecen primas de fichaje más altas. Negocia o firma una oferta, o haz pruebas (una por semana) en clubes que todavía dudan. Tu representante decide cuántos clubes y de qué países se interesan. Si acaba la pretemporada sin firmar, aceptas la mejor oferta que tengas.</p>':
  '<p class="small mut">Todavía no tienes club. Estos equipos te siguen: haz pruebas para convencerles (una por semana) o firma una oferta. Donde firmes será tu club de cantera. Si acaba la pretemporada sin firmar, aceptas la mejor oferta que tengas.</p>');
 P.clubs.forEach(function(x,i){var c=S.clubs[x.id],lg=lgName(c);
  h+='<div class="item"><div><b class="tname">'+crestSVG(c,24)+' '+esc(c.n)+'</b><p>'+esc(lg)+' · fuerza '+c.str+'</p>';
  if(x.st==='prueba'){h+='<div class="trials">'+TRIALS.map(function(tr){var p=Math.round(preP(c,tr)*100);return '<button class="chip'+(P.used?' dis':'')+'" data-a="pretrial" data-i="'+i+'" data-id="'+tr.id+'" title="'+tr.d+'">'+tr.n+' · <b class="num" style="color:'+(p>=60?'var(--good)':p>=35?'var(--gold)':'var(--bad)')+'">'+p+'%</b></button>';}).join('')+'</div>';}
  else if(x.offer)h+='<p class="good">'+(P.free?(x.id===P.old?'Tu antiguo club quiere que vuelvas':x.st==='directa'?'Oferta sin prueba':'Prueba superada: te ofrecen contrato')+' · '+fmt(x.offer.wage)+'/semana · '+x.offer.years+' año(s) · prima '+fmt(x.offer.bonus):(x.st==='directa'?'Oferta de contrato juvenil, sin prueba':'Prueba superada: te ofrecen contrato')+' · '+fmt(x.offer.wage)+'/semana · '+x.offer.years+' años')+'</p>';
  else h+='<p class="bad">'+(x.st==='roto'?'Rompe la negociación.':'No te han fichado.')+'</p>';
  h+='</div>'+(x.offer?(P.free?'<div style="display:grid;gap:6px"><button class="go" data-a="preneg" data-i="'+i+'">Negociar</button><button class="go alt" data-a="presign" data-i="'+i+'">Firmar</button></div>':'<button class="go" data-a="presign" data-i="'+i+'">Firmar</button>'):'<span></span>')+'</div>';});
 h+='</section>';
 if(P.log.length)h+='<section class="card"><h3>Diario de la pretemporada</h3>'+P.log.map(function(l){return '<div class="ev"><span>'+esc(l)+'</span></div>';}).join('')+'</section>';
 h+='<div class="wiznav"><button class="go alt" data-a="menu">Menú</button><button class="go" data-a="prenext">'+(last?'Empezar la temporada'+(signed.length?' (firmas la mejor oferta)':''):'Pasar a la semana '+(P.wk+1))+'</button></div></div></div>';
 return h;
}
