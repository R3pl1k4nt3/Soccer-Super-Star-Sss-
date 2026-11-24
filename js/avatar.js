/* Estrella del Balón · dibujo del jugador.
   headParts() dibuja la cabeza en un lienzo de 200×220 con centro de la cara en (100, 92).
   portraitSVG(): retrato a medio cuerpo (tarjetas, menú, perfil). bodySVG(): cuerpo entero (camiseta, medias, botas). */
var AVN=0;
function lighten(hex,f){var n=parseInt(hex.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;r=Math.round(r+(255-r)*f);g=Math.round(g+(255-g)*f);b=Math.round(b+(255-b)*f);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function lipColor(sk){var n=parseInt(sk.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return '#'+((1<<24)+(Math.round(clamp(r*0.82+28,0,255))<<16)+(Math.round(g*0.58)<<8)+Math.round(b*0.6)).toString(16).slice(1);}

function headParts(L,uid){
 var sk=L.skin,hc=L.hairc,W=L.face==='re'?36:L.face==='al'?31:L.face==='cu'?35:33,chin=L.face==='re'?130:L.face==='al'?140:134,top=48,cx=100;
 var g='sk'+uid,gh='hc'+uid,ink='rgba(24,32,58,.72)';
 var defs='<radialGradient id="'+g+'" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="'+lighten(sk,0.12)+'"/><stop offset=".6" stop-color="'+sk+'"/><stop offset="1" stop-color="'+shade(sk,0.78)+'"/></radialGradient>'+
  '<linearGradient id="'+gh+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lighten(hc,0.22)+'"/><stop offset=".55" stop-color="'+hc+'"/><stop offset="1" stop-color="'+shade(hc,0.7)+'"/></linearGradient>';
 var H='url(#'+gh+')',back='',front='',head='';
 /* cuello */
 back+='<path d="M84 116 L84 152 Q100 162 116 152 L116 116 Z" fill="'+shade(sk,0.86)+'"/><path d="M84 132 Q100 146 116 132 L116 122 L84 122 Z" fill="'+shade(sk,0.7)+'" opacity=".55"/>';
 if(L.tat.indexOf('cu')>=0)back+='<path d="M88 142 q6 -6 12 0 q6 6 12 0" stroke="'+ink+'" stroke-width="2.4" fill="none"/><circle cx="100" cy="147" r="2.2" fill="'+ink+'"/>';
 /* pelo de detrás */
 var hs=L.hair;
 if(hs==='me')back+='<path d="M'+(cx-W-6)+' 70 C'+(cx-W-12)+' 120 '+(cx-W-8)+' 158 '+(cx-W+4)+' 170 L'+(cx+W-4)+' 170 C'+(cx+W+8)+' 158 '+(cx+W+12)+' 120 '+(cx+W+6)+' 70 Z" fill="'+H+'"/>';
 if(hs==='af')back+='<ellipse cx="100" cy="74" rx="'+(W+22)+'" ry="46" fill="'+H+'"/>';
 if(hs==='rs')[-(W+6),-(W+1),-(W-6),W-6,W+1,W+6].forEach(function(d,i){back+='<path d="M'+(cx+d)+' 66 C'+(cx+d*1.08)+' 110 '+(cx+d*1.02)+' 140 '+(cx+d*0.96+(i%2?3:-3))+' 168" stroke="'+hc+'" stroke-width="7.5" stroke-linecap="round" fill="none"/><path d="M'+(cx+d)+' 70 L'+(cx+d*1.04)+' 160" stroke="'+lighten(hc,0.25)+'" stroke-width="1.4" stroke-dasharray="3 5" fill="none"/>';});
 if(hs==='mo')back+='<circle cx="100" cy="36" r="14" fill="'+H+'"/><path d="M90 34 q10 -8 20 0" stroke="'+lighten(hc,0.3)+'" stroke-width="1.5" fill="none"/>';
 if(hs==='co2')back+='<path d="M'+(cx+W-4)+' 74 C'+(cx+W+16)+' 84 '+(cx+W+14)+' 120 '+(cx+W+4)+' 138" stroke="'+hc+'" stroke-width="11" stroke-linecap="round" fill="none"/>';
 if(hs==='ri')for(var i=0;i<11;i++){var a=Math.PI*(1.02+i*0.096);back+='<circle cx="'+(cx+Math.cos(a)*(W+3))+'" cy="'+(80+Math.sin(a)*40)+'" r="10" fill="'+H+'"/>';}
 /* orejas */
 [-1,1].forEach(function(s){var ex=cx+s*(W+1);head+='<ellipse cx="'+ex+'" cy="96" rx="6.5" ry="10.5" fill="'+shade(sk,0.9)+'"/><path d="M'+(ex+s*1.5)+' 90 q'+(s*-3)+' 6 0 12" stroke="'+shade(sk,0.68)+'" stroke-width="1.6" fill="none"/>';});
 /* cara */
 var jaw=L.face==='cu'?[cx+W,118,cx+W*0.78,chin]:L.face==='re'?[cx+W,112,cx+W*0.6,chin]:[cx+W,112,cx+W*0.5,chin-2];
 var face='M'+(cx-W)+' 88 C'+(cx-W)+' 58 '+(cx-W*0.6)+' '+top+' '+cx+' '+top+' C'+(cx+W*0.6)+' '+top+' '+(cx+W)+' 58 '+(cx+W)+' 88 C'+jaw[0]+' '+jaw[1]+' '+jaw[2]+' '+jaw[3]+' '+cx+' '+chin+' C'+(2*cx-jaw[2])+' '+jaw[3]+' '+(2*cx-jaw[0])+' '+jaw[1]+' '+(cx-W)+' 88 Z';
 head+='<path d="'+face+'" fill="url(#'+g+')"/>';
 head+='<ellipse cx="'+(cx-W*0.55)+'" cy="108" rx="7" ry="4" fill="#e0607a" opacity=".1"/><ellipse cx="'+(cx+W*0.55)+'" cy="108" rx="7" ry="4" fill="#e0607a" opacity=".1"/>';
 /* barba (debajo de boca y nariz) */
 if(L.beard==='ct'||L.beard==='po'){var bo=L.beard==='po'?0.95:0.45;
  head+='<path d="M'+(cx-W+1)+' 96 C'+(cx-W+2)+' 118 '+(cx-W*0.5)+' '+(chin+(L.beard==='po'?8:2))+' '+cx+' '+(chin+(L.beard==='po'?9:2))+' C'+(cx+W*0.5)+' '+(chin+(L.beard==='po'?8:2))+' '+(cx+W-2)+' 118 '+(cx+W-1)+' 96 C'+(cx+W-6)+' 112 '+(cx+12)+' 112 '+cx+' 113 C'+(cx-12)+' 112 '+(cx-W+6)+' 112 '+(cx-W+1)+' 96 Z" fill="'+hc+'" opacity="'+bo+'"/>';}
 /* ojos */
 var eo=L.eyes,up=eo==='gr'?7:eo==='ra'?3.6:eo==='en'?4.6:5.6,dn=eo==='gr'?5.5:eo==='ra'?3:4.2,ir=eo==='gr'?4.4:eo==='ra'?3.2:3.8,ey=93;
 [-1,1].forEach(function(s){var ex=cx+s*14;
  head+='<path d="M'+(ex-9)+' '+ey+' Q'+ex+' '+(ey-up)+' '+(ex+9)+' '+ey+' Q'+ex+' '+(ey+dn)+' '+(ex-9)+' '+ey+' Z" fill="#fbfbf8"/>';
  head+='<circle cx="'+(ex+s*0.6)+'" cy="'+(ey+0.3)+'" r="'+ir+'" fill="'+L.eyec+'"/><circle cx="'+(ex+s*0.6)+'" cy="'+(ey+0.3)+'" r="'+(ir*0.45)+'" fill="#111"/><circle cx="'+(ex+s*0.6+1.3)+'" cy="'+(ey-1.2)+'" r="1.1" fill="#fff"/>';
  head+='<path d="M'+(ex-9.5)+' '+(ey+0.5)+' Q'+ex+' '+(ey-up-0.8)+' '+(ex+9.5)+' '+(ey+0.5)+'" stroke="#2a1d17" stroke-width="'+(eo==='en'?2.6:1.8)+'" fill="none" stroke-linecap="round"/>';
  if(eo==='en')head+='<path d="M'+(ex-9)+' '+(ey-1)+' Q'+ex+' '+(ey-up+1.5)+' '+(ex+9)+' '+(ey-1)+' Q'+ex+' '+(ey-up-2)+' '+(ex-9)+' '+(ey-1)+'Z" fill="'+shade(sk,0.9)+'"/>';
  head+='<path d="M'+(ex-7)+' '+(ey+dn+1.2)+' Q'+ex+' '+(ey+dn+2.6)+' '+(ex+7)+' '+(ey+dn+1)+'" stroke="'+shade(sk,0.75)+'" stroke-width="1" fill="none" opacity=".7"/>';
  /* cejas */
  var th=L.brow==='gr'?3.6:L.brow==='ar'?2.3:1.8,by=ey-(L.brow==='ar'?12:10.5),arch=L.brow==='ar'?6:3;
  var x1=ex-s*11,x2=ex+s*10;
  head+='<path d="M'+x1+' '+(by+2.5)+' Q'+ex+' '+(by-arch)+' '+x2+' '+(by+1)+' Q'+ex+' '+(by-arch+th)+' '+x1+' '+(by+2.5+th)+' Z" fill="'+shade(hc,0.9)+'"/>';});
 /* nariz */
 head+='<path d="M100 94 C98 102 95 106 95 109 Q100 113 105 109" stroke="'+shade(sk,0.68)+'" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="96.5" cy="109.5" rx="1.8" ry="1.1" fill="'+shade(sk,0.55)+'"/><ellipse cx="103.5" cy="109.5" rx="1.8" ry="1.1" fill="'+shade(sk,0.55)+'"/>';
 /* bigote y boca */
 if(L.beard==='bi'||L.beard==='po')head+='<path d="M88 117 Q94 112 100 114 Q106 112 112 117 Q106 116 100 117.5 Q94 116 88 117 Z" fill="'+hc+'"/>';
 var lc=lipColor(sk);
 head+='<path d="M90 120 Q95 117 100 118.6 Q105 117 110 120 Q100 121.5 90 120 Z" fill="'+shade(lc,0.85)+'"/><path d="M91 120.3 Q100 128 109 120.3 Q100 122.4 91 120.3 Z" fill="'+lc+'"/><path d="M90 120 Q100 122 110 120" stroke="'+shade(lc,0.55)+'" stroke-width="1.1" fill="none"/>';
 if(L.beard==='pe')head+='<path d="M93 126 Q100 124 107 126 Q106 136 100 138 Q94 136 93 126 Z" fill="'+hc+'"/>';
 if(L.beard==='ct')head+='<path d="M93 126 Q100 124 107 126 Q104 132 100 133 Q96 132 93 126 Z" fill="'+hc+'" opacity=".5"/>';
 /* pelo de delante */
 var hl='<path d="M'+(cx-W*0.5)+' '+(top+3)+' Q'+cx+' '+(top-3)+' '+(cx+W*0.45)+' '+(top+4)+'" stroke="'+lighten(hc,0.4)+'" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>';
 var cap=function(fr,yb){return '<path d="M'+(cx-W-1.5)+' '+(yb||86)+' C'+(cx-W-3)+' 54 '+(cx-W*0.45)+' '+(top-8)+' '+cx+' '+(top-8)+' C'+(cx+W*0.5)+' '+(top-8)+' '+(cx+W+3)+' 54 '+(cx+W+1.5)+' '+(yb||86)+' C'+(cx+W-2)+' 72 '+(cx+W*0.6)+' '+fr+' '+(cx+W*0.15)+' '+(fr+1)+' C'+(cx-4)+' '+(fr-4)+' '+(cx-W*0.5)+' '+(fr+3)+' '+(cx-W+2)+' 74 Z" fill="'+H+'"/>';};
 if(hs==='co')front+=cap(62)+hl;
 else if(hs==='de')front+=cap(60,74)+'<path d="M'+(cx-W-1)+' 74 L'+(cx-W)+' 90 M'+(cx+W+1)+' 74 L'+(cx+W)+' 90" stroke="'+hc+'" stroke-width="3" opacity=".3"/>'+hl;
 else if(hs==='tu')front+='<path d="M'+(cx-W-1.5)+' 84 C'+(cx-W-3)+' 50 '+(cx-16)+' 26 '+(cx+10)+' 26 C'+(cx+W+8)+' 26 '+(cx+W+4)+' 52 '+(cx+W+1.5)+' 84 C'+(cx+W-2)+' 70 '+(cx+W*0.5)+' 58 '+(cx+6)+' 56 C'+(cx-8)+' 56 '+(cx-W*0.6)+' 62 '+(cx-W+2)+' 74 Z" fill="'+H+'"/>'+'<path d="M'+(cx-12)+' 34 Q'+(cx+8)+' 24 '+(cx+24)+' 36" stroke="'+lighten(hc,0.4)+'" stroke-width="2" fill="none" opacity=".6"/>';
 else if(hs==='ra')front+=cap(64,80).replace('fill="'+H+'"','fill="'+hc+'" opacity=".55"');
 else if(hs==='ri'){for(var j=0;j<9;j++){var xx=cx-W+4+j*(2*W-8)/8;front+='<circle cx="'+xx+'" cy="'+(60+Math.abs(j-4)*1.6)+'" r="7.5" fill="'+H+'"/>';}front+=cap(58,78).replace(/fill="url\([^)]*\)"/,'fill="'+hc+'"');}
 else if(hs==='af')front+='<path d="M'+(cx-W-4)+' 92 C'+(cx-W-14)+' 40 '+(cx+W+14)+' 40 '+(cx+W+4)+' 92 C'+(cx+W)+' 70 '+(cx+W*0.5)+' 62 '+cx+' 63 C'+(cx-W*0.5)+' 62 '+(cx-W)+' 70 '+(cx-W-4)+' 92 Z" fill="'+H+'"/>';
 else if(hs==='me')front+='<path d="M'+(cx+2)+' '+(top-6)+' C'+(cx-W*0.9)+' '+(top-6)+' '+(cx-W-6)+' 70 '+(cx-W-4)+' 108 L'+(cx-W+4)+' 96 C'+(cx-W+4)+' 76 '+(cx-12)+' 62 '+(cx+2)+' 56 Z" fill="'+H+'"/><path d="M'+(cx+2)+' '+(top-6)+' C'+(cx+W*0.9)+' '+(top-6)+' '+(cx+W+6)+' 70 '+(cx+W+4)+' 108 L'+(cx+W-4)+' 96 C'+(cx+W-4)+' 76 '+(cx+14)+' 62 '+(cx+2)+' 56 Z" fill="'+H+'"/>';
 else if(hs==='co2'||hs==='mo'||hs==='rs')front+=cap(64,80)+'<path d="M'+(cx-W*0.6)+' 58 Q'+cx+' 50 '+(cx+W*0.6)+' 58 M'+(cx-W*0.4)+' 52 Q'+cx+' 46 '+(cx+W*0.4)+' 52" stroke="'+lighten(hc,0.3)+'" stroke-width="1.3" fill="none" opacity=".6"/>';
 if(hs==='ca')front+='<ellipse cx="'+(cx-8)+'" cy="'+(top+8)+'" rx="9" ry="4" fill="#fff" opacity=".18"/>';
 if(L.band==='si')front+='<path d="M'+(cx-W-1)+' 72 Q'+cx+' 60 '+(cx+W+1)+' 72 L'+(cx+W+1)+' 79 Q'+cx+' 67 '+(cx-W-1)+' 79 Z" fill="#f2f2f2" stroke="rgba(0,0,0,.25)"/>';
 return {defs:defs,back:back,head:head,front:front};
}

function kitDefs(kit,uid){
 return '<linearGradient id="kg'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+lighten(kit.a,0.12)+'"/><stop offset="1" stop-color="'+shade(kit.a,0.78)+'"/></linearGradient>'+
  '<linearGradient id="ko'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient><pattern id="ks'+uid+'" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="'+kit.a+'"/>'+(kit.st?'<rect width="11" height="22" fill="'+kit.b+'" opacity=".95"/>':'')+'</pattern>';
}
/* retrato a medio cuerpo */
function portraitSVG(L,kit,size,label){
 if(typeof gfxOn==='function'&&gfxOn()){var gp=portraitPlus(L||defaultLook('DC'),kit||{a:'#1565c0',b:'#ffffff',st:0},size||160,label);if(gp)return gp;}
 L=L||defaultLook('DC');kit=kit||{a:'#1565c0',b:'#ffffff',st:0};var u=++AVN,P=headParts(L,u),bw=L.build==='de'?0.92:L.build==='fu'?1.08:1;
 var sh='<path d="M'+(100-92*bw)+' 220 C'+(100-88*bw)+' 182 '+(100-62*bw)+' 166 70 160 Q100 174 130 160 C'+(100+62*bw)+' 166 '+(100+88*bw)+' 182 '+(100+92*bw)+' 220 Z" fill="url(#ks'+u+')"/>';
 sh+='<path d="M'+(100-92*bw)+' 220 C'+(100-88*bw)+' 182 '+(100-62*bw)+' 166 70 160 Q100 174 130 160 C'+(100+62*bw)+' 166 '+(100+88*bw)+' 182 '+(100+92*bw)+' 220 Z" fill="url(#ko'+u+')"/>';
 sh+='<path d="M70 160 Q100 174 130 160 L124 157 Q100 168 76 157 Z" fill="'+kit.b+'"/>';
 sh+='<path d="M'+(100-60*bw)+' 182 Q'+(100-56*bw)+' 200 '+(100-58*bw)+' 220 M'+(100+60*bw)+' 182 Q'+(100+56*bw)+' 200 '+(100+58*bw)+' 220" stroke="rgba(0,0,0,.18)" stroke-width="2" fill="none"/>';
 sh+='<text x="138" y="206" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="22" fill="'+kit.b+'" opacity=".9">'+(L.num||10)+'</text>';
 var W=size||160;
 return '<svg viewBox="0 0 200 220" width="'+W+'" height="'+Math.round(W*1.1)+'" role="img" aria-label="'+esc(label||'Retrato del jugador')+'"><defs>'+P.defs+kitDefs(kit,u)+'</defs>'+P.back+sh+P.head+P.front+'</svg>';
}
/* solo la cara, para miniaturas */
function faceSVG(L,kit,size){
 if(typeof gfxOn==='function'&&gfxOn()){var gp=facePlus(L||defaultLook('DC'),kit||{a:'#1565c0',b:'#fff',st:0},size);if(gp)return gp;}
 L=L||defaultLook('DC');var u=++AVN,P=headParts(L,u);kit=kit||{a:'#1565c0',b:'#fff',st:0};
 var sh='<path d="M10 220 C14 182 40 166 70 160 Q100 174 130 160 C160 166 186 182 190 220 Z" fill="'+kit.a+'"/><path d="M70 160 Q100 174 130 160 L124 157 Q100 168 76 157 Z" fill="'+kit.b+'"/>';
 return '<svg viewBox="30 24 140 140" width="'+size+'" height="'+size+'" aria-hidden="true"><defs>'+P.defs+'</defs>'+P.back+sh+P.head+P.front+'</svg>';
}
/* cuerpo entero: 8 cabezas de alto, camiseta por dentro o por fuera, medias, botas y tatuajes */
function bodySVG(L,kit,size){
 if(typeof gfxOn==='function'&&gfxOn()){var gp=bodyPlus(L||defaultLook('DC'),kit||{a:'#1565c0',b:'#ffffff',st:0},size||150);if(gp)return gp;}
 L=L||defaultLook('DC');kit=kit||{a:'#1565c0',b:'#ffffff',st:0};var u=++AVN,P=headParts(L,u);
 var sk=L.skin,ink='rgba(24,32,58,.75)',bw=L.build==='de'?0.9:L.build==='fu'?1.12:1,sy=clamp((L.alt||180)/180,0.93,1.08);
 var cx=100,sw=44*bw,hip=30*bw,y0=150,waist=300,hem=L.shirt==='de'?300:322,sl=L.sleeve==='la',h='';
 var kf='url(#ks'+u+')',skg='url(#bs'+u+')';
 var defs=P.defs+kitDefs(kit,u)+'<linearGradient id="bs'+u+'" x1="0" x2="1"><stop offset="0" stop-color="'+shade(sk,0.85)+'"/><stop offset=".45" stop-color="'+lighten(sk,0.06)+'"/><stop offset="1" stop-color="'+shade(sk,0.8)+'"/></linearGradient>';
 /* piernas */
 var sockTop=L.socks==='al'?408:L.socks==='no'?432:470;
 [-1,1].forEach(function(s){var lx=cx+s*16*bw;
  h+='<path d="M'+(lx-11*bw)+' 330 L'+(lx-9)+' 420 Q'+(lx-8)+' 440 '+(lx-7)+' 492 L'+(lx+7)+' 492 Q'+(lx+8)+' 440 '+(lx+9)+' 420 L'+(lx+11*bw)+' 330 Z" fill="'+skg+'"/>';
  if(s>0&&L.tat.indexOf('pn')>=0)h+='<path d="M'+(lx-4)+' 380 q8 6 0 14 q-8 6 0 14 M'+(lx+3)+' 386 l2 14" stroke="'+ink+'" stroke-width="2.4" fill="none"/>';
  h+='<path d="M'+(lx-10)+' '+sockTop+' L'+(lx-8)+' 494 L'+(lx+8)+' 494 L'+(lx+10)+' '+sockTop+' Z" fill="'+kit.b+'" stroke="rgba(0,0,0,.18)"/>';
  h+='<rect x="'+(lx-10)+'" y="'+(sockTop+6)+'" width="20" height="4" fill="'+kit.a+'"/>';
  if(L.socks==='ba')h+='<rect x="'+(lx-10)+'" y="'+(sockTop-26)+'" width="20" height="26" rx="4" fill="#e9eef5" opacity=".9"/>';
  var bc=bootColor();h+='<path d="M'+(lx-11)+' 490 L'+(lx+9)+' 490 Q'+(lx+s*24)+' 494 '+(lx+s*26)+' 504 L'+(lx-s*12)+' 506 Q'+(lx-s*13)+' 498 '+(lx-11)+' 490 Z" fill="'+bc+'" stroke="rgba(0,0,0,.4)"/><path d="M'+(lx-9)+' 507 h'+(s*28)+'" stroke="rgba(0,0,0,.55)" stroke-width="2.5"/>';});
 /* pantalón */
 h+='<path d="M'+(cx-hip-2)+' 296 L'+(cx+hip+2)+' 296 L'+(cx+hip+8)+' 352 L'+(cx+4)+' 356 L'+cx+' 338 L'+(cx-4)+' 356 L'+(cx-hip-8)+' 352 Z" fill="'+kit.b+'" stroke="rgba(0,0,0,.22)"/>';
 h+='<path d="M'+(cx-hip-6)+' 346 L'+(cx-hip-7)+' 352 M'+(cx+hip+6)+' 346 L'+(cx+hip+7)+' 352" stroke="'+kit.a+'" stroke-width="3"/>';
 /* brazos */
 [-1,1].forEach(function(s){var sx=cx+s*(sw-6),side=s<0?'i':'d',ex=cx+s*(sw+8),hx=cx+s*(sw+10);
  h+='<path d="M'+sx+' 178 Q'+(cx+s*(sw+10))+' 210 '+ex+' 246 Q'+(cx+s*(sw+12))+' 280 '+hx+' 312" stroke="'+skg+'" stroke-width="'+(16*bw)+'" stroke-linecap="round" fill="none"/>';
  if(!sl){
   if(L.tat.indexOf('b'+side)>=0)h+='<path d="M'+(cx+s*(sw+2))+' 222 q'+(s*8)+' 10 '+(s*4)+' 22 q'+(s*-6)+' 12 '+(s*4)+' 26 q'+(s*8)+' 12 '+(s*2)+' 26" stroke="'+ink+'" stroke-width="4" fill="none"/>';
   if(L.tat.indexOf('p'+side)>=0)h+='<path d="M'+(ex+s*1)+' 262 l'+(s*2)+' 30 M'+(ex-s*3)+' 270 q'+(s*5)+' 6 '+(s*1)+' 14" stroke="'+ink+'" stroke-width="3.2" fill="none"/>';}
  h+='<path d="M'+sx+' 176 Q'+(cx+s*(sw+10))+' 206 '+(sl?ex:cx+s*(sw+6))+' '+(sl?246:222)+(sl?' Q'+(cx+s*(sw+12))+' 280 '+hx+' 304':'')+'" stroke="'+kf+'" stroke-width="'+(19*bw)+'" stroke-linecap="round" fill="none"/>';
  if(L.wrist==='si'&&s>0)h+='<rect x="'+(hx-9)+'" y="292" width="18" height="9" rx="3" fill="'+kit.b+'"/>';
  h+='<ellipse cx="'+hx+'" cy="318" rx="8" ry="10" fill="'+sk+'"/>';
  if(s<0&&L.tat.indexOf('ma')>=0)h+='<path d="M'+(hx-3)+' 316 l6 0 M'+hx+' 313 l0 6" stroke="'+ink+'" stroke-width="2"/>';});
 /* camiseta */
 h+='<path d="M'+(cx-sw)+' 174 Q'+cx+' 162 '+(cx+sw)+' 174 L'+(cx+sw-4)+' 240 L'+(cx+hip+4)+' '+hem+' L'+(cx-hip-4)+' '+hem+' L'+(cx-sw+4)+' 240 Z" fill="'+kf+'" stroke="rgba(0,0,0,.25)"/>';
 h+='<path d="M'+(cx-sw+8)+' 200 Q'+(cx-sw+14)+' 250 '+(cx-hip-2)+' '+(hem-4)+'" stroke="rgba(0,0,0,.15)" stroke-width="5" fill="none"/>';
 h+='<path d="M'+(cx-sw)+' 174 Q'+cx+' 162 '+(cx+sw)+' 174 L'+(cx+sw-4)+' 240 L'+(cx+hip+4)+' '+hem+' L'+(cx-hip-4)+' '+hem+' L'+(cx-sw+4)+' 240 Z" fill="url(#ko'+u+')"/>';
 if(L.shirt==='de')h+='<path d="M'+(cx-hip-4)+' 294 Q'+cx+' 300 '+(cx+hip+4)+' 294 L'+(cx+hip+4)+' 302 Q'+cx+' 306 '+(cx-hip-4)+' 302 Z" fill="'+shade(kit.b,0.8)+'"/>';
 h+='<path d="M86 166 L100 186 L114 166" fill="none" stroke="'+kit.b+'" stroke-width="5"/>';
 h+='<text x="'+cx+'" y="238" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="40" fill="'+kit.b+'" stroke="rgba(0,0,0,.25)" stroke-width="1">'+(L.num||10)+'</text>';
 /* cabeza (lienzo del retrato reducido) */
 var hd='<g transform="translate('+(cx-100*0.62)+' 80) scale(.62)">'+P.back.replace(/<path d="M84 116[^>]*>/,'')+P.head+P.front+'</g>';
 h='<path d="M89 140 L89 174 Q100 182 111 174 L111 140 Z" fill="'+shade(sk,0.84)+'"/>'+(L.tat.indexOf('cu')>=0?'<path d="M92 166 q8 -6 16 0" stroke="'+ink+'" stroke-width="2.4" fill="none"/>':'')+h+hd;
 var Wd=size||150;
 return '<svg viewBox="0 0 200 520" width="'+Wd+'" height="'+Math.round(Wd*2.6)+'" role="img" aria-label="Jugador de cuerpo entero"><defs>'+defs+'</defs><ellipse cx="100" cy="508" rx="62" ry="7" fill="rgba(0,0,0,.35)"/><g transform="translate(0 '+(520-520*sy)+') scale(1 '+sy+')">'+h+'</g></svg>';
}
