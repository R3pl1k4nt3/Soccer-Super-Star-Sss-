/* Estrella del Balón · objetos de protección y rendimiento, y servicios nuevos.
   Espinilleras y tobilleras bajan el riesgo de lesión; las medias de compresión, el cansancio;
   las plantillas suben aceleración y velocidad; el chaleco GPS da puntos de habilidad extra por partido.
   Se compran en Jugador › Material, tienen cuatro gamas y se gastan con los partidos, como las botas. */
var PROT=[
 {slot:'espin',n:'Espinilleras',d:'Menos riesgo de lesión',fx:'inj',v:[0.12,0.2,0.28,0.36],f:0.22},
 {slot:'tob',n:'Tobilleras',d:'Menos lesiones y algo más de agilidad',fx:'inj',v:[0.06,0.1,0.14,0.18],sk:['agi'],b:[0,1,1,2],f:0.2},
 {slot:'med',n:'Medias de compresión',d:'Te cansas menos en cada partido',fx:'drain',v:[0.06,0.1,0.15,0.2],f:0.16},
 {slot:'pla',n:'Plantillas a medida',d:'Más aceleración y velocidad',sk:['ace','vel'],b:[1,1,2,3],f:0.4},
 {slot:'gps',n:'Chaleco GPS',d:'Más puntos de habilidad por partido',fx:'pts',v:[0.5,1,1.5,2],f:0.6}
];
var PROTSLOTS=PROT.map(function(p){return [p.slot,p.n];});
function extraGear(gk){
 var out=[],kb={b:'leo',m:'kai',p:'fel',e:'tri'},have=(gk?SKG:SKO).map(function(s){return s[0];});
 GAMAS.forEach(function(G,i){PROT.forEach(function(p){var b=byId(BRANDS,kb[G.id]),sk=(p.sk||[]).filter(function(id){return have.indexOf(id)>=0;}),fx={};if(p.fx)fx[p.fx]=p.v[i];
  out.push({id:'x_'+p.slot+'_'+G.id,slot:p.slot,n:p.n+' '+b.n,brand:b.id,gama:G.n,type:p.slot,sk:sk,b:p.b?p.b[i]:0,fx:fx,c:Math.round(G.c*p.f/100)*100,dur:G.dur+6});});});
 return out;
}
/* suma de un efecto de todo lo que llevas puesto */
function gearFx(k){if(!S||!S.gear)return 0;var t=0;Object.keys(S.gear).forEach(function(sl){var g=S.gear[sl];if(g&&g.fx&&g.fx[k])t+=g.fx[k];});return k==='pts'?t:Math.min(0.6,t);}
function gearTxt(g){var p=[];(g.sk||[]).forEach(function(id){if(g.b)p.push((SKNAME[id]||id)+' +'+g.b);});var f=g.fx||{};
 if(f.inj)p.push('lesiones −'+Math.round(f.inj*100)+'%');if(f.drain)p.push('cansancio −'+Math.round(f.drain*100)+'%');if(f.pts)p.push('+'+ds(f.pts)+' puntos por partido');return p.join(' · ');}
/* servicios nuevos (se suman a los de entorno.js) */
SHOP.push({id:'crio',n:'Crioterapia',d:'+3 de energía semanal por nivel; desde el nivel 2, las lesiones duran una semana menos',c:[70000,200000,500000]},
          {id:'chef',n:'Cocinero personal',d:'+2 de energía y algo de moral cada semana por nivel',c:[50000,150000,380000]});
