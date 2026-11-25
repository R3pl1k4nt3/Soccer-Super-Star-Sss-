/* Estrella del Balón · aspecto del jugador (avatar SVG), colores de los equipaciones y editor. */

/* opciones del aspecto. tat y alt solo se eligen al crear el jugador; luego no se pueden cambiar (los tatuajes se pueden añadir, no quitar) */
var LOOK_OPTS=[
 {k:'skin',n:'Piel',v:[['#f6d7c3','Muy clara'],['#e9b896','Clara'],['#d29a6e','Media'],['#b07448','Morena'],['#8a5531','Oscura'],['#5e3a22','Muy oscura']]},
 {k:'face',n:'Cara',v:[['ov','Ovalada'],['re','Redonda'],['cu','Cuadrada'],['al','Alargada']]},
 {k:'eyes',n:'Ojos',v:[['no','Normales'],['ra','Rasgados'],['gr','Grandes'],['en','Entornados']]},
 {k:'eyec',n:'Color de ojos',v:[['#4a2c17','Marrones'],['#1c1c1c','Negros'],['#3d7cc9','Azules'],['#4f8a4a','Verdes'],['#a86f2a','Miel']]},
 {k:'brow',n:'Cejas',v:[['fi','Finas'],['gr','Gruesas'],['ar','Arqueadas']]},
 {k:'hair',n:'Pelo',v:[['ra','Rapado'],['co','Corto'],['de','Degradado'],['tu','Tupé'],['ri','Rizos'],['af','Afro'],['me','Melena'],['co2','Coleta'],['mo','Moño'],['rs','Rastas'],['ca','Calvo']]},
 {k:'hairc',n:'Color de pelo',v:[['#1b1410','Negro'],['#4a2e1c','Castaño'],['#c9a25a','Rubio'],['#a3461f','Pelirrojo'],['#9a9a9a','Canoso'],['#efe6c8','Platino'],['#2f6fd1','Teñido azul']]},
 {k:'beard',n:'Barba',v:[['no','Sin barba'],['pe','Perilla'],['ct','Corta'],['po','Poblada'],['bi','Bigote']]},
 {k:'build',n:'Complexión',v:[['de','Delgada'],['no','Normal'],['fu','Fuerte']]},
 {k:'shirt',n:'Camiseta',v:[['fu','Por fuera'],['de','Por dentro']]},
 {k:'sleeve',n:'Manga',v:[['co','Corta'],['la','Larga']]},
 {k:'socks',n:'Medias',v:[['al','Por encima de la rodilla'],['no','Normales'],['ba','Bajadas']]},
 {k:'band',n:'Cinta del pelo',v:[['no','No'],['si','Sí']]},
 {k:'wrist',n:'Muñequera',v:[['no','No'],['si','Sí']]},
 {k:'num',n:'Dorsal',v:[[7,'7'],[9,'9'],[10,'10'],[11,'11'],[8,'8'],[4,'4'],[5,'5'],[1,'1'],[14,'14'],[17,'17'],[19,'19'],[21,'21'],[23,'23'],[99,'99']]}
];
var TATTOOS=[['bi','Brazo izquierdo entero'],['bd','Brazo derecho entero'],['pi','Antebrazo izquierdo'],['pd','Antebrazo derecho'],['cu','Cuello'],['pn','Pierna'],['ma','Mano']];
var TATTOO_COST=3000;
function defaultLook(pos){return {skin:'#e9b896',face:'ov',eyes:'no',eyec:'#4a2c17',brow:'fi',hair:'co',hairc:'#4a2e1c',beard:'no',build:'no',shirt:'fu',sleeve:'co',socks:'no',band:'no',wrist:'no',num:pos==='POR'?1:pos==='DC'?9:10,alt:180,tat:[]};}
function randomLook(pos){var L=defaultLook(pos);LOOK_OPTS.forEach(function(o){if(o.k!=='num')L[o.k]=pick(o.v)[0];});L.alt=168+Math.floor(Math.random()*26);L.tat=Math.random()<0.4?[pick(TATTOOS)[0]]:[];return L;}

/* colores de equipación: algunos clubes conocidos (reales o sus versiones ficticias) y el resto a partir del nombre */
var KITS=[
 [/Real Madrid|Chamartín/,'#ffffff','#1b2a6b'],[/Barcelona$|FC Barcelona|Blaugrana/,'#a50044','#004d98',1],[/Atlético de Madrid|Manzanares/,'#cb3524','#ffffff',1],
 [/Athletic/,'#ee2523','#ffffff',1],[/Sevilla/,'#ffffff','#d71920'],[/Betis|Verdiblanco/,'#00954c','#ffffff',1],[/Valencia|Mestalla/,'#ffffff','#111111'],
 [/Villarreal|Submarino/,'#ffe667','#005187'],[/Real Sociedad|Donostia/,'#0067b1','#ffffff',1],[/Celta|Celeste de Vigo/,'#8ac3ee','#ffffff'],
 [/Arsenal|Gunners/,'#ef0107','#ffffff'],[/Manchester City|Manchester Celeste/,'#6cabdd','#ffffff'],[/Manchester United|Red Devils/,'#da291c','#111111'],
 [/Liverpool|Merseyside/,'#c8102e','#ffffff'],[/Chelsea|London Blues/,'#034694','#ffffff'],[/Tottenham|Spurs/,'#ffffff','#132257'],[/Newcastle|Magpies/,'#111111','#ffffff',1],
 [/Juventus|Vecchia/,'#111111','#ffffff',1],[/Inter/,'#0068a8','#111111',1],[/AC Milan|Rossoneri/,'#fb090b','#111111',1],[/Napoli|Partenopei/,'#12a0d7','#ffffff'],
 [/Roma/,'#8e1f2f','#f0bc42'],[/Bayern|Múnich Rojo/,'#dc052d','#ffffff'],[/Dortmund|Schwarzgelb/,'#fde100','#111111'],[/Leverkusen|Werkself/,'#e32221','#111111'],
 [/Paris Saint|Rouge et Bleu/,'#004170','#da291c'],[/Marseille|Phocéen/,'#ffffff','#2faee0'],[/Benfica|Águias/,'#e83030','#ffffff'],[/Porto|Dragões/,'#003b8e','#ffffff',1],
 [/Sporting CP|Leões/,'#008057','#ffffff',1],[/Ajax|Godenzonen/,'#ffffff','#d2122e'],[/PSV|Lichtstad/,'#ed1c24','#ffffff',1],[/Celtic|Celtas/,'#018749','#ffffff',1],[/Galatasaray|Estambul Leones/,'#a90432','#fdb912',1]
];
var PALETTE=['#c62828','#1565c0','#2e7d32','#f9a825','#6a1b9a','#ef6c00','#00838f','#37474f','#ad1457','#283593','#558b2f','#ffffff','#111111','#8d6e63'];
function hashStr(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h);}
function clubColors(c){
 if(!c)return {a:'#1565c0',b:'#ffffff',st:0};
 if(c.col)return c.col;
 for(var i=0;i<KITS.length;i++)if(KITS[i][0].test(c.n))return (c.col={a:KITS[i][1],b:KITS[i][2],st:KITS[i][3]?1:0});
 var h=hashStr(c.n),a=PALETTE[h%PALETTE.length],b=PALETTE[(h>>4)%PALETTE.length];if(a===b)b=a==='#ffffff'?'#111111':'#ffffff';
 return (c.col={a:a,b:b,st:(h>>8)%5===0?1:0});
}
function bootColor(){var g=S&&S.gear&&S.gear.botas;if(!g)return '#222';var m={tri:'#f2f2f2',arco:'#ff5a1f',fel:'#ffd400',kai:'#1e88e5',nor:'#00c853',leo:'#e53935'};return m[g.brand]||'#222';}
function shade(hex,f){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;r=Math.round(clamp(r*f,0,255));g=Math.round(clamp(g*f,0,255));b=Math.round(clamp(b*f,0,255));return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}

/* el dibujo está en avatar.js */
function avatarSVG(L,kit,size){return bodySVG(L,kit,size);}

/* editor: mode 'setup' (todo editable) o 'game' (sin altura ni tatuajes; los tatuajes se añaden pagando) */
function lookEditor(L,mode,kit){
 var h='<div class="look"><div class="lookfig">'+portraitSVG(L,kit,170)+bodySVG(L,kit,92)+'</div><div class="lookopts">';
 LOOK_OPTS.forEach(function(o){
  if(o.k==='num'){h+='<div class="lookrow"><label class="lookk" for="dorsal" style="margin:0">Dorsal</label><div class="cats" style="margin:0;align-items:center"><input id="dorsal" type="number" min="1" max="99" inputmode="numeric" value="'+(L.num||10)+'" style="width:90px;min-height:40px"> '+[1,7,9,10,11,14,23].map(function(n){var on=+L.num===n;return '<button class="chip '+(on?'on':'')+'" data-a="look" data-k="num" data-id="'+n+'" aria-pressed="'+on+'">'+n+'</button>';}).join('')+'<span class="small mut">Del 1 al 99</span></div></div>';return;}
  var col=o.k==='skin'||o.k==='eyec'||o.k==='hairc';
  h+='<div class="lookrow"><span class="lookk">'+o.n+'</span><div class="cats" style="margin:0">'+o.v.map(function(v){var on=String(L[o.k])===String(v[0]);
   return '<button class="chip '+(on?'on':'')+'" data-a="look" data-k="'+o.k+'" data-id="'+esc(String(v[0]))+'" aria-pressed="'+on+'"'+(col?' title="'+v[1]+'"':'')+'>'+(col?'<span class="sw" style="background:'+v[0]+'"></span>':'')+(col?'<span class="sr">'+v[1]+'</span>':v[1])+'</button>';}).join('')+'</div></div>';});
 if(mode==='setup'){
  h+='<div class="lookrow"><span class="lookk">Altura</span><div class="cats" style="margin:0">'+[168,172,176,180,184,188,192,196].map(function(a){return chip(L.alt===a,'look',a,a+' cm').replace('data-a="look"','data-a="look" data-k="alt"');}).join('')+'</div></div>';
  h+='<div class="lookrow"><span class="lookk">Tatuajes</span><div class="cats" style="margin:0">'+TATTOOS.map(function(t){var on=L.tat.indexOf(t[0])>=0;return '<button class="chip '+(on?'on':'')+'" data-a="tat" data-id="'+t[0]+'" aria-pressed="'+on+'">'+t[1]+'</button>';}).join('')+'</div></div>';
  h+='<div class="small mut">La altura y los tatuajes no se pueden cambiar después. Más tarde podrás hacerte tatuajes nuevos, pero no quitarlos.</div>';
 }else{
  h+='<div class="lookrow"><span class="lookk">Altura</span><span>'+L.alt+' cm</span></div>';
  h+='<div class="lookrow"><span class="lookk">Tatuajes</span><span class="small">'+(L.tat.length?L.tat.map(function(t){return TATTOOS.filter(function(x){return x[0]===t;})[0][1];}).join(', '):'Ninguno')+'</span></div>';
  var free=TATTOOS.filter(function(t){return L.tat.indexOf(t[0])<0;});
  if(free.length)h+='<div class="lookrow"><span class="lookk">Tatuarte</span><div class="cats" style="margin:0">'+free.map(function(t){return '<button class="chip" data-a="tatnew" data-id="'+t[0]+'">'+t[1]+' · '+fmt(TATTOO_COST)+'</button>';}).join('')+'</div></div><div class="small mut">Un tatuaje es para siempre: no se puede quitar.</div>';
 }
 return h+'</div></div>';
}
function setLook(L,k,v){if(k==='num'){L.num=clamp(parseInt(v,10)||10,1,99);return;}var o=byId(LOOK_OPTS.map(function(x){return {id:x.k,v:x.v};}),k);if(k==='alt'){L.alt=+v;return;}if(!o)return;var m=o.v.filter(function(x){return String(x[0])===String(v);})[0];if(m)L[k]=m[0];}
function toggleTat(L,t){var i=L.tat.indexOf(t);if(i>=0)L.tat.splice(i,1);else L.tat.push(t);}
function newTattoo(t){
 if(S.look.tat.indexOf(t)>=0)return;
 if(S.tatConfirm!==t){S.tatConfirm=t;toast('Pulsa otra vez para confirmar: el tatuaje no se puede quitar.');return;}
 if(S.money<TATTOO_COST){toast('Te faltan '+fmt(TATTOO_COST-S.money)+'.',1);return;}
 S.money-=TATTOO_COST;S.look.tat.push(t);S.tatConfirm=null;logm('Te haces un tatuaje nuevo.');S.fol=Math.round(S.fol*1.005);save();render();
}
