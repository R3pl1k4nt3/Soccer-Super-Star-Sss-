/* Estrella del Balón · gráficos «Clásicos» o «Mejorados».
   Mejorados usa los archivos de diseno/entregas registrados en js/graficos-mejorados.js (tools/registrar-graficos.ps1).
   Si falta una pieza, se usa el dibujo clásico. La elección se guarda en el navegador, no en la partida. */
var GFX_KEY='estrella_graficos';
function gfxMode(){try{return localStorage.getItem(GFX_KEY)||'clasicos';}catch(e){return 'clasicos';}}
function setGfxMode(m){try{localStorage.setItem(GFX_KEY,m);}catch(e){}applyGfxBackground();}
function gfxAvail(){return typeof GFX!=='undefined';}
function gfxCount(){if(!gfxAvail())return 0;return Object.keys(GFX.svg).length+Object.keys(GFX.img).length;}
function gfxOn(){return gfxMode()==='mejorados'&&gfxAvail();}
function gSvg(k){return gfxOn()&&GFX.svg[k]||null;}
function gImg(k){return gfxOn()&&GFX.img[k]||null;}
function gHas(k){return !!(gSvg(k)||gImg(k));}
/* contenido interior de un SVG, con los colores de referencia sustituidos */
function gInner(k,map){
 var s=gSvg(k);if(!s)return null;
 s=s.replace(/^[\s\S]*?<svg[^>]*>/i,'').replace(/<\/svg>\s*$/i,'');
 if(map)Object.keys(map).forEach(function(ref){s=s.split(ref).join(map[ref]).split(ref.toUpperCase()).join(map[ref]);});
 /* los id internos se renombran para que no choquen si hay varios dibujos en la página */
 var u='g'+(++AVN)+'_';s=s.replace(/id="([^"]+)"/g,'id="'+u+'$1"').replace(/url\(#([^)]+)\)/g,'url(#'+u+'$1)').replace(/href="#([^"]+)"/g,'href="#'+u+'$1"');
 return s;
}
function gPiece(k,map){var s=gInner(k,map);if(s)return '<g>'+s+'</g>';var i=gImg(k);return i?'<image href="'+esc(i)+'" x="0" y="0" width="200" height="220"/>':'';}

/* nombres de archivo según el aspecto */
var GF={face:{ov:'ovalada',re:'redonda',cu:'cuadrada',al:'alargada'},eyes:{no:'normales',ra:'rasgados',gr:'grandes',en:'entornados'},brow:{fi:'finas',gr:'gruesas',ar:'arqueadas'},
 beard:{pe:'perilla',ct:'corta',po:'poblada',bi:'bigote'},hair:{ra:'rapado',co:'corto',de:'degradado',tu:'tupe',ri:'rizos',af:'afro',me:'melena',co2:'coleta',mo:'mono',rs:'rastas'},
 back:{me:'melena',af:'afro',rs:'rastas',co2:'coleta',mo:'mono'},build:{de:'delgado',no:'normal',fu:'fuerte'},socks:{al:'altas',no:'normales',ba:'bajadas'}};
function lookMap(L,kit){return {'#d29a6e':L.skin,'#4a2e1c':L.hairc,'#3d7cc9':L.eyec,'#1565c0':kit.a};}
/* retrato mejorado: solo si están todas las piezas necesarias para este aspecto */
function portraitParts(L,kit){
 var need=['retrato/cara-'+GF.face[L.face],'retrato/cuello','retrato/ojos-'+GF.eyes[L.eyes],'retrato/cejas-'+GF.brow[L.brow],'retrato/nariz-boca','retrato/camiseta-cuello-v'];
 if(L.hair!=='ca')need.push('retrato/pelo-'+GF.hair[L.hair]);
 if(GF.back[L.hair])need.push('retrato/pelo-atras-'+GF.back[L.hair]);
 if(L.beard!=='no')need.push('retrato/barba-'+GF.beard[L.beard]);
 if(!need.every(gHas))return null;
 var m=lookMap(L,kit),shirt={'#1565c0':kit.a,'#ffffff':kit.b,'#FFFFFF':kit.b};
 var back=GF.back[L.hair]?gPiece('retrato/pelo-atras-'+GF.back[L.hair],m):'';
 var head=gPiece('retrato/cuello',m)+(L.tat.indexOf('cu')>=0?gPiece('retrato/tatuaje-cuello'):'')+gPiece('retrato/cara-'+GF.face[L.face],m)+gPiece('retrato/ojos-'+GF.eyes[L.eyes],m)+
  gPiece('retrato/cejas-'+GF.brow[L.brow],m)+gPiece('retrato/nariz-boca',m)+(L.beard!=='no'?gPiece('retrato/barba-'+GF.beard[L.beard],m):'');
 var front=(L.hair!=='ca'?gPiece('retrato/pelo-'+GF.hair[L.hair],m):'')+(L.band==='si'?gPiece('retrato/cinta'):'');
 return {back:back,shirt:gPiece('retrato/camiseta-cuello-v',shirt),head:head,front:front};
}
function portraitPlus(L,kit,W,label){
 var P=portraitParts(L,kit);if(!P)return null;
 return '<svg viewBox="0 0 200 220" width="'+W+'" height="'+Math.round(W*1.1)+'" role="img" aria-label="'+esc(label||'Retrato del jugador')+'">'+P.back+P.shirt+P.head+P.front+'</svg>';
}
function facePlus(L,kit,size){var P=portraitParts(L,kit);if(!P)return null;return '<svg viewBox="30 24 140 140" width="'+size+'" height="'+size+'" aria-hidden="true">'+P.back+P.shirt+P.head+P.front+'</svg>';}
/* cuerpo entero mejorado: cuerpo, pantalón, camiseta y medias; la cabeza sale del retrato */
function bodyPlus(L,kit,Wd){
 var b=GF.build[L.build],shirt='cuerpo/camiseta-'+(L.shirt==='de'?'dentro':'fuera')+'-manga-'+(L.sleeve==='la'?'larga':'corta')+'-'+b;
 var need=['cuerpo/cuerpo-'+b,'cuerpo/pantalon-'+b,shirt,'cuerpo/medias-'+GF.socks[L.socks]];
 if(!need.every(gHas))return null;
 var P=portraitParts(L,kit),m={'#d29a6e':L.skin,'#1565c0':kit.a,'#ffffff':kit.b,'#FFFFFF':kit.b};
 var tat={bi:'brazo-izq',bd:'brazo-der',pi:'antebrazo-izq',pd:'antebrazo-der',pn:'pierna',ma:'mano'},t='';
 L.tat.forEach(function(x){if(tat[x])t+=gPiece('cuerpo/tatuaje-'+tat[x]);});
 var pc=function(k,mm){var s=gInner(k,mm);if(s)return '<g>'+s+'</g>';var i=gImg(k);return i?'<image href="'+esc(i)+'" width="200" height="520"/>':'';};
 var head=P?'<g transform="translate(38 80) scale(.62)">'+P.back+P.head+P.front+'</g>':'';
 var h=pc('cuerpo/cuerpo-'+b,{'#d29a6e':L.skin})+t+pc('cuerpo/medias-'+GF.socks[L.socks],m)+pc('cuerpo/pantalon-'+b,m)+pc(shirt,m)+(L.wrist==='si'?pc('cuerpo/munequera',m):'')+head;
 return '<svg viewBox="0 0 200 520" width="'+Wd+'" height="'+Math.round(Wd*2.6)+'" role="img" aria-label="Jugador de cuerpo entero">'+h+'</svg>';
}
/* escudo de un club ficticio, si se ha subido */
function crestPlus(c,size){
 if(!gfxOn())return null;var k='escudos/club-'+slugify(c.n);
 if(GFX.svg[k])return '<span class="crest" style="display:inline-block;width:'+size+'px;height:'+size+'px">'+GFX.svg[k].replace(/<svg/i,'<svg width="'+size+'" height="'+size+'"')+'</span>';
 if(GFX.img[k])return '<img class="crest" src="'+esc(GFX.img[k])+'" alt="" width="'+size+'" height="'+size+'" loading="lazy">';
 return null;
}
/* imagen de una pieza de material de la tienda */
function gearImg(g){
 if(!gfxOn())return '';var b=byId(BRANDS,g.brand),tipo=g.slot==='ropa'?g.n.replace(' '+b.n,''):g.n.replace((g.slot==='guantes'?'Guantes ':'')+b.n+' ','');
 var k='material/'+(g.slot==='botas'?'bota':g.slot==='guantes'?'guantes':'ropa')+'-'+slugify(b.n)+'-'+slugify(tipo)+'-'+slugify(g.gama),src=GFX.img[k];
 if(src)return '<img class="gearimg" src="'+esc(src)+'" alt="" loading="lazy">';
 if(GFX.svg[k])return '<span class="gearimg">'+GFX.svg[k]+'</span>';
 return '';
}
/* iconos de navegación */
var NAVICO={home:'inicio',match:'partido',player:'jugador',career:'carrera',life:'vida'};
function icoPlus(k){var s=gSvg('iconos/nav-'+NAVICO[k]);return s?s.replace(/<svg/i,'<svg class="ico" aria-hidden="true"'):null;}
function slugify(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
/* fondo y logotipo */
function applyGfxBackground(){
 if(typeof document==='undefined'||!document.body||!document.body.style)return;
 var w=window.innerWidth<760,src=gImg(w?'fondos/fondo-movil':'fondos/fondo-escritorio')||gImg('fondos/fondo-escritorio');
 document.body.style.backgroundImage=src?'linear-gradient(rgba(10,16,29,.72),rgba(10,16,29,.86)),url("'+src+'")':'';
 document.body.style.backgroundSize=src?'cover':'';document.body.style.backgroundPosition=src?'center':'';
}
function logoPlus(size){var s=gSvg('logo/logo-icono');if(s)return s.replace(/<svg/i,'<svg width="'+size+'" height="'+size+'" aria-hidden="true"');var i=gImg('logo/logo-icono');return i?'<img src="'+esc(i)+'" alt="" width="'+size+'" height="'+size+'">':null;}
/* interruptor para el menú y la pestaña Carrera */
function gfxSwitch(){
 var n=gfxCount(),on=gfxMode()==='mejorados';
 return '<div class="rowb" style="flex-wrap:wrap;gap:8px"><span class="small">Gráficos</span><div class="cats" role="group" aria-label="Gráficos" style="margin:0">'+
  '<button class="chip'+(on?'':' on')+'" aria-pressed="'+!on+'" data-a="gfx" data-id="clasicos">Clásicos</button>'+
  '<button class="chip'+(on?' on':'')+'" aria-pressed="'+on+'" data-a="gfx" data-id="mejorados">Mejorados'+(n?' ('+n+' piezas)':'')+'</button></div></div>'+
  (on&&!n?'<p class="small mut" style="margin:6px 0 0">Todavía no hay gráficos nuevos instalados: se ven los clásicos. Sigue diseno/INSTRUCCIONES.md.</p>':'');
}
