/* Estrella del Balón · gráficos «Clásicos» o «Mejorados».
   Mejorados usa los archivos de diseno/entregas registrados en js/graficos-mejorados.js (tools/registrar-graficos.ps1).
   Si falta una pieza, se usa el dibujo clásico. La elección se guarda en el navegador, no en la partida. */
var GFX_KEY='estrella_graficos';
function gfxMode(){try{return localStorage.getItem(GFX_KEY)||'clasicos';}catch(e){return 'clasicos';}}
function setGfxMode(m){try{localStorage.setItem(GFX_KEY,m);}catch(e){}if(m==='mejorados')loadGfx();applyGfxBackground();}
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
 /* solo se recolorean rellenos y trazos, no los degradados de luz y sombra */
 if(map)Object.keys(map).forEach(function(ref){s=s.replace(new RegExp('(fill|stroke)="'+ref+'"','gi'),'$1="'+map[ref]+'"');});
 s=s.replace(/<!--[\s\S]*?-->/g,'');
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
 if(!gfxOn())return null;
 /* en la versión real mandan los escudos reales descargados */
 if(S&&S.real&&typeof ESCUDOS!=='undefined'&&ESCUDOS[c.n])return null;
 var k='escudos/club-'+slugify(c.n);
 if(GFX.svg[k])return '<span class="crest" style="display:inline-block;width:'+size+'px;height:'+size+'px">'+GFX.svg[k].replace(/<svg/i,'<svg width="'+size+'" height="'+size+'"')+'</span>';
 if(GFX.img[k])return '<img class="crest" src="'+esc(GFX.img[k])+'" alt="" width="'+size+'" height="'+size+'" loading="lazy">';
 return crestModular(c,size);
}
/* escudo modular: forma + división + emblema, elegidos a partir del nombre del club y coloreados con sus colores */
function gKeys(prefix){return gfxAvail()?Object.keys(GFX.svg).filter(function(k){return k.indexOf(prefix)===0;}).sort():[];}
function crestModular(c,size){
 var F=gKeys('escudos/forma-'),D=gKeys('escudos/division-'),E=gKeys('escudos/emblema-');if(!F.length)return null;
 var h=hashStr(c.n),k=clubColors(c),a=k.a,b=k.b;if(a===b)b=lum(a)>0.5?'#111111':'#ffffff';
 var map={'#ff00ff':a,'#00ffff':b};
 var fk=F[h%F.length],dk=D.length?(k.st&&D.indexOf('escudos/division-rayas')>=0?'escudos/division-rayas':D[(h>>3)%D.length]):null,ek=E.length?E[(h>>6)%E.length]:null;
 var forma=gInner(fk,map);if(!forma)return null;
 var sil=(forma.match(/silueta"\s+d="([^"]+)"/)||forma.match(/<path[^>]*d="([^"]+)"/)||[])[1];
 var prin=(forma.match(/<g id="[^"]*principal">[\s\S]*?<\/g>/)||[''])[0],rest=forma.replace(prin,'');
 var id='cm'+(++AVN);
 return '<svg class="crest" viewBox="0 0 100 104" width="'+size+'" height="'+size+'" aria-hidden="true"><defs><clipPath id="'+id+'"><path d="'+(sil||'M0 0H100V104H0Z')+'"/></clipPath></defs>'+
  prin+'<g clip-path="url(#'+id+')">'+(dk?gInner(dk,map):'')+'</g>'+(ek?gInner(ek,map):'')+rest+'</svg>';
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
  (on&&!n&&gfxLoading?'<p class="small mut" style="margin:6px 0 0">Cargando gráficos…</p>':on&&!n?'<p class="small mut" style="margin:6px 0 0">Todavía no hay gráficos nuevos instalados: se ven los clásicos. Sigue diseno/INSTRUCCIONES.md.</p>':'');
}

/* ---------- iconos de rasgos, acciones, relaciones y momentos ---------- */
var ICO_RASGO={reg:'regateador',tl:'tirador-lejano',fk:'lanzador-de-faltas',muro:'muro-de-hierro',mago:'mago-del-balon',killer:'killer-del-area',rayo:'velocista',aereo:'rey-del-juego-aereo',capi:'lider-nato',pulmon:'pulmon-infinito',pase:'pase-milimetrico',centr:'centrador-letal',lector:'lector-del-juego',grande:'partidos-grandes',gato:'gato-bajo-palos',libero:'portero-libero',paran:'parapenaltis',gral:'general-de-la-defensa'};
var ICO_ACC={consejo:'consejo',minutos:'pedir-minutos',cena:'cena-equipo',joven:'ayudar-joven',entrevista:'entrevista',polemica:'polemica',autografos:'autografos',dona:'donacion',contrato:'mejora-contrato'};
var ICO_REL={coach:'entrenador',team:'vestuario',press:'prensa',fans:'aficion',board:'directiva'};
function gIcon(key,size){var s=gSvg('iconos/'+key);if(!s)return '';s=s.replace(/<\?xml[^>]*\?>/,'').replace(/<!--[\s\S]*?-->/g,'');return '<span class="gico" aria-hidden="true">'+s.replace(/<svg/i,'<svg width="'+(size||22)+'" height="'+(size||22)+'"')+'</span>';}
function icoRasgo(id,size){return ICO_RASGO[id]?gIcon('rasgo-'+ICO_RASGO[id],size):'';}
function icoAcc(id){return ICO_ACC[id]?gIcon('accion-'+ICO_ACC[id]):'';}
function icoRel(id){return ICO_REL[id]?gIcon('relacion-'+ICO_REL[id]):'';}
function icoMom(m){return m&&m.ic?gIcon('momento-'+m.ic):'';}
/* imágenes de los momentos y de la cabecera del menú */
function momBg(kind){var i=gImg(kind==='star'?'fondos/momento-estrella':'fondos/momento-negro');return i?' style="background-image:linear-gradient(90deg,rgba(10,16,29,.92) 45%,rgba(10,16,29,.5)),url(\''+i+'\');background-size:cover;background-position:center"':'';}
function heroBg(){var i=gImg('fondos/cabecera-menu');return i?' style="background-image:linear-gradient(90deg,rgba(10,16,29,.92) 35%,rgba(10,16,29,.3)),url(\''+i+'\');background-size:cover;background-position:center;padding:30px 22px;border-radius:16px"':'';}
/* minicampo subido (sustituye al césped dibujado de la jugada) */
function pitchBase(){var s=gInner('fondos/minicampo');return s?'<g>'+s+'</g>':null;}

/* el paquete de gráficos (≈1 MB) solo se descarga si se eligen los Mejorados */
var gfxLoading=false;
function loadGfx(){
 if(gfxAvail()||gfxLoading||typeof document==='undefined'||!document.createElement)return;
 gfxLoading=true;var s=document.createElement('script');s.src='js/graficos-mejorados.js?v='+Date.now().toString(36).slice(0,5);
 s.onload=function(){gfxLoading=false;applyGfxBackground();if(typeof render==='function')render();};
 s.onerror=function(){gfxLoading=false;};document.body.appendChild(s);
}
