/* Estrella del Balón · más jugadas en tus partidos.
   - Situaciones nuevas por puesto (SITX) que se suman a las de partido.js (SITS).
   - Situaciones comunes de ataque (para defensas y medios) y de defensa (para delanteros, extremos y mediapuntas):
     los atacantes también defienden y los defensores también atacan.
   - Cada situación tiene su zona del campo (z: [x de 0 a 100 hacia la portería rival, y de 0 a 100 desde tu banda]),
     con algo de variación, para que el minicampo no muestre siempre el mismo sitio. */
var SITX={
 POR:[
  {t:'Disparo lejano con efecto hacia la escuadra.',v:'MC',z:[5,50],o:[
   {n:'Volar a la escuadra',sk:['ref','agi'],ok:['tir','fin'],rk:1,ef:'def'},
   {n:'Blocar en dos tiempos',sk:['cap','pos'],ok:['tir','fin'],rk:0,ef:'def'},
   {n:'Despejar a córner con una mano',sk:['ref','fue'],ok:['tir','fin'],rk:2,ef:'def'}]},
  {t:'Penalti en contra.',v:'DC',z:[3,50],o:[
   {n:'Tirarte a tu derecha',sk:['ref','agi'],ok:['fin','cfz'],rk:1,ef:'def'},
   {n:'Esperar hasta el último momento',sk:['con','pos'],ok:['fin','cst'],rk:0,ef:'def'},
   {n:'Adivinar y tirarte antes',sk:['arr','ref'],ok:['fin','tir'],rk:2,ef:'def'}]}],
 DFC:[
  {t:'Salida de balón con presión del rival.',v:'DC',z:[16,50],o:[
   {n:'Pase largo a la espalda de su defensa',sk:['pal','vis'],ok:['ant','pos'],vs:'DFC',rk:2,ef:'att'},
   {n:'Conducir hasta el medio campo',sk:['ctl','fue'],ok:['ent','res'],rk:1,ef:'att'},
   {n:'Pase seguro al portero',sk:['pas','con'],ok:['ant','vel'],rk:0,ef:'att'}]},
  {t:'El delantero rival pide el balón al espacio.',v:'DC',z:[24,38],o:[
   {n:'Correr con él',sk:['vel','res'],ok:['ace','des'],rk:0,ef:'def'},
   {n:'Tirar el fuera de juego',sk:['pos','lid'],ok:['des','ant'],rk:2,ef:'def'},
   {n:'Cruzarte y despejar',sk:['ant','fue'],ok:['ace','ctl'],rk:1,ef:'def'}]}],
 LAT:[
  {t:'El extremo rival recibe a tu espalda.',v:'EXT',z:[26,12],o:[
   {n:'Volver a toda velocidad',sk:['vel','res'],ok:['vel','ctl'],rk:1,ef:'def'},
   {n:'Entrada por detrás al balón',sk:['ent','ace'],ok:['agi','reg'],rk:2,ef:'def'},
   {n:'Encerrarle contra la línea',sk:['pos','mar'],ok:['reg','fue'],rk:0,ef:'def'}]},
  {t:'Llegas desdoblando hasta línea de fondo.',v:'EXT',z:[88,10],o:[
   {n:'Centro atrás al punto de penalti',sk:['cen','vis'],ok:['ant','pos'],rk:1,ef:'att'},
   {n:'Encarar y disparar al primer palo',sk:['reg','tir'],ok:['ent','pos'],vs:'POR',rk:2,ef:'att',shot:1},
   {n:'Ganar el córner',sk:['fue','ctl'],ok:['ent','fue'],rk:0,ef:'att'}]}],
 MCD:[
  {t:'El rival prepara un contraataque.',v:'MC',z:[42,50],o:[
   {n:'Falta táctica',sk:['ent','dec'],ok:['agi','reg'],rk:2,ef:'def'},
   {n:'Temporizar hasta que vuelvan',sk:['pos','res'],ok:['pas','vis'],rk:0,ef:'def'},
   {n:'Robo limpio',sk:['ent','ant'],ok:['ctl','fue'],rk:1,ef:'def'}]}],
 MC:[
  {t:'Llegas desde segunda línea al área.',v:'MCD',z:[80,56],o:[
   {n:'Pisar área y rematar',sk:['des','fin'],ok:['mar','res'],rk:2,ef:'att',shot:1},
   {n:'Esperar el rechace en la frontal',sk:['ant','tir'],ok:['pos','ant'],rk:1,ef:'att',shot:1},
   {n:'Abrir para el extremo',sk:['pas','vis'],ok:['ant','pos'],rk:0,ef:'att'}]},
  {t:'Balón dividido en el centro del campo.',v:'MC',z:[50,50],o:[
   {n:'Ir con todo',sk:['fue','ent'],ok:['fue','ent'],rk:2,ef:'def'},
   {n:'Llegar antes leyendo la jugada',sk:['ant','ace'],ok:['ant','ace'],rk:1,ef:'def'},
   {n:'Esperar y tapar',sk:['pos','con'],ok:['ctl','pas'],rk:0,ef:'def'}]}],
 INT:[
  {t:'Recibes de espaldas y presionado.',v:'MCD',z:[60,30],o:[
   {n:'Girarte con un control orientado',sk:['ctl','agi'],ok:['ent','ant'],rk:2,ef:'att'},
   {n:'Apoyo de cara',sk:['pas','con'],ok:['mar','ant'],rk:0,ef:'att'},
   {n:'Aguantar y buscar la falta',sk:['fue','ctl'],ok:['ent','fue'],rk:1,ef:'att'}]}],
 MP:[
  {t:'Falta directa en la frontal.',v:'POR',z:[78,50],o:[
   {n:'Al palo del portero',sk:['bpa','tir'],ok:['ref','pos'],rk:1,ef:'att',shot:1},
   {n:'Por encima de la barrera',sk:['bpa','fin'],ok:['ref','sal'],rk:2,ef:'att',shot:1},
   {n:'Jugada ensayada en corto',sk:['pas','vis'],ok:['ant','pos'],vs:'MCD',rk:0,ef:'att'}]},
  {t:'Ves el desmarque del delantero.',v:'MCD',z:[66,50],o:[
   {n:'Pase al hueco de primeras',sk:['vis','pas'],ok:['ant','pos'],rk:1,ef:'att'},
   {n:'Pase picado por encima',sk:['pal','vis'],ok:['sal','pos'],vs:'DFC',rk:2,ef:'att'},
   {n:'Conducir y esperar la segunda línea',sk:['ctl','dec'],ok:['ent','mar'],rk:0,ef:'att'}]}],
 DC:[
  {t:'Desmarque a la espalda de la defensa.',v:'DFC',z:[82,50],o:[
   {n:'Romper al espacio y definir',sk:['des','ace'],ok:['ant','vel'],rk:1,ef:'att',shot:1},
   {n:'Pedirla al pie y girarte',sk:['ctl','reg'],ok:['ent','fue'],rk:2,ef:'att',shot:1},
   {n:'Arrastrar la marca para un compañero',sk:['des','dec'],ok:['pos','mar'],rk:0,ef:'att'}]},
  {t:'Balón largo del portero: te toca pelearlo.',v:'DFC',z:[62,50],o:[
   {n:'Ganar el salto y prolongar',sk:['sal','cab'],ok:['sal','cab'],rk:1,ef:'att'},
   {n:'Proteger con el cuerpo y descargar',sk:['fue','pas'],ok:['fue','ent'],rk:0,ef:'att'},
   {n:'Controlar y encarar',sk:['ctl','reg'],ok:['ent','ant'],rk:2,ef:'att',shot:1}]}],
 EXT:[
  {t:'El lateral te tapa y te cierra la banda.',v:'LAT',z:[78,10],o:[
   {n:'Bicicleta y salir por fuera',sk:['reg','agi'],ok:['ent','agi'],rk:2,ef:'att'},
   {n:'Pared con el interior',sk:['pas','des'],ok:['ant','mar'],vs:'MC',rk:1,ef:'att'},
   {n:'Aguantar y ganar la falta',sk:['fue','ctl'],ok:['ent','fue'],rk:0,ef:'att'}]},
  {t:'Centro desde la otra banda al segundo palo.',v:'LAT',z:[88,72],o:[
   {n:'Volea al primer toque',sk:['tir','agi'],ok:['sal','pos'],rk:2,ef:'att',shot:1},
   {n:'Cabecear hacia el centro',sk:['cab','vis'],ok:['sal','mar'],rk:1,ef:'att'},
   {n:'Controlar y asegurar',sk:['ctl','con'],ok:['ent','ant'],rk:0,ef:'att'}]}]
};
/* jugadas de ataque para defensas y medios */
var SITC_ATT=[
 {t:'Recuperáis el balón y salís a la contra en superioridad.',v:'MCD',z:[55,50],o:[
  {n:'Conducir y soltar en el momento justo',sk:['ctl','vis'],ok:['ant','pos'],rk:1,ef:'att'},
  {n:'Pase largo al espacio',sk:['pal','vis'],ok:['vel','ant'],vs:'DFC',rk:2,ef:'att'},
  {n:'Asegurar y esperar al equipo',sk:['pas','dec'],ok:['mar','res'],rk:0,ef:'att'}]},
 {t:'Te llega un rechace en la frontal del área.',v:'MCD',z:[80,44],o:[
  {n:'Golpear de primeras',sk:['tir','cfz'],ok:['pos','ref'],vs:'POR',rk:2,ef:'att',shot:1},
  {n:'Controlar y buscar el pase',sk:['ctl','pas'],ok:['ent','ant'],rk:1,ef:'att'},
  {n:'Devolverla atrás',sk:['pas','con'],ok:['ant','mar'],rk:0,ef:'att'}]},
 {t:'Falta lateral en tres cuartos de campo.',v:'DFC',z:[74,22],o:[
  {n:'Centro tenso al área',sk:['bpa','cen'],ok:['cab','pos'],rk:1,ef:'att'},
  {n:'Jugada ensayada en corto',sk:['pas','dec'],ok:['ant','mar'],rk:0,ef:'att'},
  {n:'Ir al remate de cabeza',sk:['cab','sal'],ok:['sal','mar'],rk:2,ef:'att',shot:1}]}
];
/* jugadas de defensa para delanteros, extremos, mediapuntas y medios */
var SITC_DEF=[
 {t:'Pierdes el balón y el rival sale a la contra.',v:'MC',z:[48,50],o:[
  {n:'Presión tras pérdida',sk:['res','ent'],ok:['ctl','pas'],rk:1,ef:'def'},
  {n:'Falta táctica',sk:['ent','dec'],ok:['reg','agi'],rk:2,ef:'def'},
  {n:'Replegar y tapar el pase',sk:['pos','vel'],ok:['vis','pas'],rk:0,ef:'def'}]},
 {t:'El lateral rival sube por tu banda.',v:'LAT',z:[34,14],o:[
  {n:'Acompañarle hasta el final',sk:['res','mar'],ok:['vel','res'],rk:0,ef:'def'},
  {n:'Anticiparte al pase',sk:['ant','ace'],ok:['pas','ctl'],rk:1,ef:'def'},
  {n:'Entrada para robar',sk:['ent','fue'],ok:['reg','ctl'],rk:2,ef:'def'}]},
 {t:'Córner en contra: te toca defender en tu área.',v:'DFC',z:[7,45],o:[
  {n:'Marcar al rematador',sk:['mar','sal'],ok:['cab','sal'],rk:1,ef:'def'},
  {n:'Defender en zona el primer palo',sk:['pos','cab'],ok:['des','cab'],rk:0,ef:'def'},
  {n:'Salir rápido a por el rechace',sk:['ace','ant'],ok:['ctl','tir'],rk:2,ef:'def'}]},
 {t:'El central rival sale jugando: es tu momento de presionar.',v:'DFC',z:[86,50],o:[
  {n:'Presión al central',sk:['res','ace'],ok:['ctl','pas'],rk:1,ef:'att'},
  {n:'Lanzarte a por el portero',sk:['ace','fue'],ok:['pas','agi'],vs:'POR',rk:2,ef:'att',shot:1},
  {n:'Cerrar la línea de pase',sk:['pos','ant'],ok:['pas','vis'],vs:'MC',rk:0,ef:'def'}]}
];
/* jugadas propias y de la otra fase según el puesto, sin repetir en el mismo partido */
function sitDeck(key){
 var own=(SITS[key]||[]).concat(SITX[key]||[]),cross=[],p=0;
 if(['DC','EXT','MP'].indexOf(key)>=0){cross=SITC_DEF;p=0.3;}
 else if(['DFC','LAT','MCD'].indexOf(key)>=0){cross=SITC_ATT;p=0.3;}
 else if(key==='MC'||key==='INT'){cross=SITC_ATT.concat(SITC_DEF);p=0.3;}
 return {own:shuffle(own.slice()),cross:shuffle(cross.slice()),p:p};
}
function sitDraw(D){var useX=D.cross.length&&(Math.random()<D.p||!D.own.length);var src=useX?D.cross:D.own;if(!src.length)src=D.own.length?D.own:D.cross;var s=src.shift();src.push(s);return s;}
/* zona de la jugada: la de la situación (o una por defecto) con variación; los de banda derecha se reflejan */
function sitZone(sit){
 var line=(POSD[S.pos]||{}).line,att=sit.o.filter(function(o){return o.ef==='att';}).length>=sit.o.length/2;
 var z=sit.z?sit.z.slice():[att?{POR:20,DEF:62,MED:70,DEL:80}[line]:{POR:6,DEF:18,MED:32,DEL:45}[line],50];
 var right=/D$/.test(S.pos)&&S.pos!=='MCD',left=/I$/.test(S.pos);
 if(!sit.z&&(right||left))z[1]=left?22:78;
 else if(right)z[1]=100-z[1];
 z[0]=clamp(z[0]+Math.round(norm()*5),3,92);z[1]=clamp(z[1]+Math.round(norm()*7),6,94);
 return z;
}

/* ---------- animación de la jugada (ventana del resultado y de tus goles) ----------
   Minicampo con tu jugador, el rival y el balón. SVG animado sin librerías; solo se anima la primera vez que se pinta. */
function playAnimSVG(P){
 var W=320,H=170,z=P.z||[84,50],x=W*clamp(z[0],8,92)/100,y=H*clamp(z[1],12,88)/100,kit=clubColors(myClub());
 var att=P.ef!=='def',gx=att?W-10:10,gy=H/2,key='p'+P.min+'_'+P.n,still=UI.animSeen===key||(typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 if(!still)setTimeout(function(){UI.animSeen=key;},3000);
 var rx=x+(att?30:-30),ry=y-12,mx=clamp(x+(att?55:-55),20,W-20),my=clamp(y+(y<H/2?32:-32),16,H-16);
 var seq=[],ball=[x,y],kind;
 if(P.gk==='g'||(P.ok&&P.shot&&att&&/Gol/.test(P.res||''))){kind='gol';seq=[[x,y,gx,gy+((y-gy)*0.2),0.5,0.7]];}
 else if(P.gk==='a'){kind='asis';seq=[[x,y,mx,my,0.4,0.55],[mx,my,gx,gy,1.05,0.6]];}
 else if(P.ok&&att){kind='avanza';seq=[[x,y,clamp(x+70,20,W-20),y,0.4,0.9]];}
 else if(P.ok){kind='roba';ball=[rx,ry];seq=[[rx,ry,x,y,0.45,0.5],[x,y,clamp(x+60,20,W-20),y,1.0,0.7]];}
 else if(att){kind='pierde';seq=[[x,y,rx,ry,0.45,0.4],[rx,ry,clamp(rx-80,20,W-20),ry,0.9,0.8]];}
 else{kind='supera';ball=[rx,ry];seq=[[rx,ry,clamp(x-60,12,W-12),y+10,0.45,0.9]];}
 var mv=function(a,b,c,d,beg,dur){return still?'':'<animateMotion path="M0 0 L'+(c-a).toFixed(1)+' '+(d-b).toFixed(1)+'" begin="'+beg+'s" dur="'+dur+'s" fill="freeze"/>';};
 var end=seq[seq.length-1];
 /* el balón: un tramo por elemento, encadenados */
 var balls='';seq.forEach(function(s,i){var last=i===seq.length-1;
  if(still){if(last)balls+='<circle cx="'+s[2]+'" cy="'+s[3]+'" r="4.5" fill="#fff" stroke="#111"/>';return;}
  balls+='<circle cx="'+s[0]+'" cy="'+s[1]+'" r="4.5" fill="#fff" stroke="#111" opacity="'+(i?0:1)+'">'+(i?'<set attributeName="opacity" to="1" begin="'+s[4]+'s"/>':'')+mv(s[0],s[1],s[2],s[3],s[4],s[5])+(!last?'<set attributeName="opacity" to="0" begin="'+(seq[i+1][4])+'s"/>':'')+'</circle>';});
 /* jugadores: tú, el rival y un compañero en la asistencia */
 var meMove=kind==='avanza'?mv(x,y,clamp(x+60,20,W-20),y,0.4,0.9):kind==='roba'?mv(x,y,clamp(x+50,20,W-20),y,1.0,0.7):'';
 var rvMove=kind==='pierde'?mv(rx,ry,clamp(rx-80,20,W-20),ry,0.9,0.8):kind==='supera'?mv(rx,ry,clamp(x-60,12,W-12),y+10,0.45,0.9):kind==='roba'?mv(rx,ry,rx+14,ry-14,0.6,0.4):'';
 var stillMe=still&&kind==='avanza'?[clamp(x+60,20,W-20),y]:still&&kind==='roba'?[clamp(x+50,20,W-20),y]:[x,y];
 var stillRv=still&&kind==='pierde'?[clamp(rx-80,20,W-20),ry]:still&&kind==='supera'?[clamp(x-60,12,W-12),y+10]:[rx,ry];
 var net=kind==='gol'||kind==='asis'?'<rect x="'+(att?W-12:4)+'" y="'+(H/2-18)+'" width="8" height="36" fill="#fff" opacity="'+(still?0.55:0)+'">'+(still?'':'<animate attributeName="opacity" values="0;.8;.2;.6" begin="'+(end[4]+end[5]).toFixed(2)+'s" dur=".6s" fill="freeze"/>')+'</rect>':'';
 return '<svg class="playanim" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Animación de la jugada">'+
  '<rect width="'+W+'" height="'+H+'" rx="10" fill="#1f7a46"/><g fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.4"><rect x="4" y="4" width="'+(W-8)+'" height="'+(H-8)+'"/><line x1="'+W/2+'" y1="4" x2="'+W/2+'" y2="'+(H-4)+'"/><circle cx="'+W/2+'" cy="'+H/2+'" r="20"/><rect x="4" y="'+(H/2-34)+'" width="38" height="68"/><rect x="'+(W-42)+'" y="'+(H/2-34)+'" width="38" height="68"/></g>'+
  '<rect x="'+(W-6)+'" y="'+(H/2-18)+'" width="4" height="36" fill="#fff"/><rect x="2" y="'+(H/2-18)+'" width="4" height="36" fill="#fff"/>'+net+
  (kind==='asis'?'<circle cx="'+mx+'" cy="'+my+'" r="9" fill="'+kit.a+'" stroke="#fff" stroke-width="2"/>':'')+
  '<g><circle cx="'+stillRv[0]+'" cy="'+stillRv[1]+'" r="10" fill="#e53935" stroke="#fff" stroke-width="2"/>'+rvMove+'</g>'+
  '<g><circle cx="'+stillMe[0]+'" cy="'+stillMe[1]+'" r="11" fill="'+kit.a+'" stroke="#f5c542" stroke-width="3"/>'+meMove+'</g>'+balls+'</svg>';
}