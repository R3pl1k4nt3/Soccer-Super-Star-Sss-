/* Estrella del Balón · resumen de carrera, pantalla de retirada y compartir.
   La imagen se dibuja en un canvas (1080×1350, formato vertical de Instagram). En el móvil se comparte con el menú del sistema
   (Instagram, WhatsApp, X, Facebook…); en el ordenador, con enlaces a X, Facebook y WhatsApp y descargando la imagen. */
var SITE_URL='https://r3pl1k4nt3.github.io/Soccer-Super-Star-Sss-/';

/* tiempo real que llevas jugando esta carrera (minutos), solo con la pestaña visible */
function playClock(){if(typeof setInterval==='undefined')return;setInterval(function(){if(S&&!S.pre&&!(typeof document!=='undefined'&&document.hidden))S.playMin=(S.playMin||0)+1;},60000);}

function careerStats(){
 var st=S.stats,H=hitosMig(),cnt=function(k){return H.filter(function(h){return h.k===k;}).length;},V=S.vhist||[];
 var clubs=[];(S.hist||[]).forEach(function(r){var l=clubs[clubs.length-1];if(l&&l.club===r.club){l.to=r.season;l.pj+=r.apps;l.g+=r.g;l.a+=r.a;}else clubs.push({club:r.club,lg:r.lg,from:r.season,to:r.season,pj:r.apps,g:r.g,a:r.a});});
 var best=(S.hist||[]).slice().sort(function(a,b){return (b.g+b.a*0.6+b.rating*2)-(a.g+a.a*0.6+a.rating*2);})[0];
 var peakOv=Math.max(overall(),Math.max.apply(null,[0].concat((S.hist||[]).map(function(r){return r.ov||0;}),V.map(function(x){return x.o||0;}))));
 var peakVal=Math.max(mv(S.pl[S.me])||0,Math.max.apply(null,[0].concat(V.map(function(x){return x.v||0;}))));
 return {name:S.name,pos:POS[S.pos],nat:natName(S.pl[S.me].nat),age:S.age,seasons:(S.hist||[]).length,pj:st.pj,g:st.g,a:st.a,cs:st.cs,sv:st.sv,
  rating:st.rn?st.rsum/st.rn:0,hours:Math.round(st.min/60),play:S.playMin||0,peakOv:peakOv,peakVal:peakVal,
  titles:H.filter(function(h){return ['liga','copa','euro','sel'].indexOf(h.k)>=0;}).length,ligas:cnt('liga'),copas:cnt('copa'),euro:cnt('euro'),sel:cnt('sel'),asc:cnt('asc'),
  bdo:cnt('bdo'),bdop:cnt('bdop'),bota:cnt('bota'),mvp:cnt('mvp'),toy:cnt('toy'),pom:cnt('pom'),tom:cnt('tom'),eux:cnt('eux'),eum:cnt('eum'),wxi:cnt('wxi'),pich:cnt('pich'),
  caps:S.nt.caps,ntg:S.nt.g,clubs:clubs,best:best,gk:S.pos==='POR',money:S.money};
}
function playTxt(m){return m>=60?Math.floor(m/60)+' h '+(m%60)+' min':m+' min';}
function shareText(c,ended){
 var p=[];p.push(c.pj+' partidos');if(c.gk)p.push(c.cs+' porterías a cero');else{p.push(c.g+' goles');p.push(c.a+' asistencias');}
 if(c.titles)p.push(c.titles+' títulos');if(c.bdo)p.push(c.bdo+' Balón'+(c.bdo>1?'es':'')+' de Oro');if(c.mvp)p.push(c.mvp+' veces mejor jugador de la liga');
 return (ended?'He colgado las botas en Estrella del Balón':'Mi carrera en Estrella del Balón')+': '+c.name+', '+c.pos.toLowerCase()+'. '+p.join(', ')+'. ¿Lo superas?';
}

/* bloque HTML con el resumen (pantalla de retirada y Hitos) */
function careerHTML(c){
 var big=[[c.pj,'Partidos'],[c.gk?c.cs:c.g,c.gk?'Porterías a cero':'Goles'],[c.gk?c.sv:c.a,c.gk?'Paradas':'Asistencias'],[c.pj?ds(c.rating):'-','Nota media'],[c.titles,'Títulos'],[c.bdo,'Balones de Oro'],
  [c.mvp,'Mejor jugador de la liga'],[c.toy,'Equipo de la temporada'],[c.pom,'Jugador del mes'],[c.bota,'Botas de Oro'],[c.eux,'Equipo europeo'],[c.wxi,'Equipo mundial'],
  [c.hours+' h','Sobre el césped'],[playTxt(c.play),'Tiempo jugando'],[ds(c.peakOv),'Valoración máxima'],[fmv(c.peakVal),'Valor máximo']];
 var h='<div class="kv carkv">'+big.map(function(x){return '<div><b class="num">'+x[0]+'</b><span>'+x[1]+'</span></div>';}).join('')+'</div>';
 var tr=[[c.ligas,'Ligas'],[c.copas,'Copas'],[c.euro,'Títulos europeos'],[c.sel,'Con la selección'],[c.asc,'Ascensos'],[c.bdop,'Podios del Balón de Oro'],[c.pich,'Pichichis']].filter(function(x){return x[0];});
 if(tr.length)h+='<div class="hitchips" style="margin-top:8px">'+tr.map(function(x){return '<span class="lv">'+x[1]+' ×'+x[0]+'</span>';}).join(' ')+'</div>';
 h+='<p class="small" style="margin:8px 0 0">Selección: '+c.caps+' partidos y '+c.ntg+' goles.'+(c.best?' Mejor temporada: T'+c.best.season+' con '+esc(c.best.club)+' ('+c.best.g+' goles, '+c.best.a+' asistencias, nota '+ds(c.best.rating)+').':'')+'</p>';
 if(c.clubs.length)h+='<h3 style="margin-top:12px">Tus clubes</h3>'+c.clubs.map(function(x){return '<div class="ev"><b class="num" style="min-width:74px">T'+x.from+(x.to>x.from?'–'+x.to:'')+'</b><span>'+esc(x.club)+' <span class="mut small">· '+esc(x.lg)+' · '+x.pj+' PJ, '+x.g+' G, '+x.a+' A</span></span></div>';}).join('');
 return h;
}
/* pantalla final al retirarse */
function retireHTML(){
 var c=careerStats(),kit=clubColors(myClub());
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Fin de tu carrera"><div class="card retire"><div class="rethead"><div class="hfig" style="width:110px">'+portraitSVG(S.look,kit,110,'Retrato de '+S.name)+'</div><div><span class="badge">FIN DE TU CARRERA</span><h2 style="margin:6px 0 2px">'+esc(S.name)+'</h2><p class="mut" style="margin:0">'+c.pos+' · '+c.nat+' · se retira a los '+S.age+' años tras '+c.seasons+' temporadas</p></div></div>'+
  careerHTML(c)+'<div class="btns" style="margin-top:14px"><button class="go" data-a="share">Compartir mi carrera</button><button class="go alt" data-a="retview">Ver todos mis hitos</button><button class="go alt full" data-a="menu">Volver al menú</button></div></div></div>';
}

/* ---------- imagen para compartir ---------- */
function shareCanvas(cb){
 if(typeof document==='undefined'){cb(null);return;}
 var c=careerStats(),W=1080,Hh=1350,cv=document.createElement('canvas');cv.width=W;cv.height=Hh;var g=cv.getContext('2d');
 var gr=g.createLinearGradient(0,0,0,Hh);gr.addColorStop(0,'#123a26');gr.addColorStop(0.45,'#0d1a2c');gr.addColorStop(1,'#0a101d');g.fillStyle=gr;g.fillRect(0,0,W,Hh);
 var F=function(w,s){return w+' '+s+'px "Barlow Condensed","Barlow",system-ui,sans-serif';};
 var star=function(x,y,r,col){g.beginPath();for(var i=0;i<10;i++){var rr=i%2?r*0.42:r,a=-Math.PI/2+i*Math.PI/5;g.lineTo(x+rr*Math.cos(a),y+rr*Math.sin(a));}g.closePath();g.fillStyle=col;g.fill();};
 var draw=function(img){
  if(img)g.drawImage(img,70,80,260,260);else star(200,210,110,'#f5c542');
  g.fillStyle='#2bd47d';g.font=F(700,34);g.fillText(S.retired?'FIN DE CARRERA':'MI CARRERA',370,130);
  g.fillStyle='#fff';g.font=F(700,84);g.fillText(S.name.length>18?S.name.slice(0,18)+'…':S.name,366,215);
  g.fillStyle='#c9d4e8';g.font=F(500,38);g.fillText(c.pos+' · '+c.nat,370,270);g.fillText(c.seasons+' temporadas · '+S.age+' años',370,320);
  var cells=[[c.pj,'PARTIDOS'],[c.gk?c.cs:c.g,c.gk?'PORTERÍAS A 0':'GOLES'],[c.gk?c.sv:c.a,c.gk?'PARADAS':'ASISTENCIAS'],[c.titles,'TÍTULOS'],[c.bdo,'BALONES DE ORO'],[c.mvp,'MEJOR DE LA LIGA'],[c.toy,'EQUIPO DE LA TEMP.'],[c.pom,'JUGADOR DEL MES'],[ds(c.peakOv),'VALORACIÓN MÁX.']];
  cells.forEach(function(x,i){var col=i%3,row=Math.floor(i/3),x0=70+col*320,y0=420+row*215;
   g.fillStyle='rgba(255,255,255,0.06)';g.fillRect(x0,y0,300,190);
   g.fillStyle=i===4&&c.bdo?'#f5c542':'#fff';g.font=F(700,96);g.textAlign='center';g.fillText(String(x[0]),x0+150,y0+115);
   g.fillStyle='#9fb0c9';g.font=F(600,28);g.fillText(x[1],x0+150,y0+160);g.textAlign='left';});
  var tr=[[c.ligas,'Ligas'],[c.copas,'Copas'],[c.euro,'Europa'],[c.asc,'Ascensos'],[c.bota,'Botas de Oro'],[c.eux,'Equipo europeo'],[c.wxi,'Equipo mundial']].filter(function(x){return x[0];}).map(function(x){return x[1]+' ×'+x[0];}).join('  ·  ');
  g.fillStyle='#f5c542';g.font=F(600,34);if(tr)g.fillText(tr.length>60?tr.slice(0,60)+'…':tr,70,1100);
  var cl=c.clubs.map(function(x){return x.club;}).join(' → ');g.fillStyle='#c9d4e8';g.font=F(500,30);g.fillText(cl.length>66?cl.slice(0,66)+'…':cl,70,1150);
  star(100,1255,34,'#f5c542');g.fillStyle='#fff';g.font=F(700,46);g.fillText('Estrella del Balón',150,1272);
  g.fillStyle='#2bd47d';g.font=F(500,28);g.fillText(SITE_URL.replace('https://',''),150,1310);
  cb(cv);
 };
 try{var svg=portraitSVG(S.look,clubColors(myClub()),260,'');if(svg.indexOf('xmlns')<0)svg=svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');
  var img=new Image();img.onload=function(){draw(img);};img.onerror=function(){draw(null);};img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
 catch(e){draw(null);}
}
function shareCareer(){
 var c=careerStats(),txt=shareText(c,!!S.retired);
 shareCanvas(function(cv){
  if(!cv){toast('No se ha podido crear la imagen.',1);return;}
  cv.toBlob(function(blob){
   var file=null;try{file=new File([blob],'estrella-del-balon.png',{type:'image/png'});}catch(e){}
   if(file&&navigator.canShare&&navigator.canShare({files:[file]})){
    navigator.share({files:[file],title:'Estrella del Balón',text:txt+' '+SITE_URL}).catch(function(){});return;}
   UI.share={url:URL.createObjectURL(blob),txt:txt};render();
  },'image/png');
 });
}
function shareHTML(){
 var s=UI.share;if(!s)return '';var t=encodeURIComponent(s.txt),u=encodeURIComponent(SITE_URL);
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Compartir tu carrera"><div class="card pop share"><h2>Compartir tu carrera</h2><img src="'+s.url+'" alt="Resumen de tu carrera" class="shareimg">'+
  '<div class="btns"><a class="go" href="'+s.url+'" download="estrella-del-balon.png">Descargar imagen</a>'+
  '<a class="go alt" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text='+t+'&url='+u+'">X</a>'+
  '<a class="go alt" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+u+'">Facebook</a>'+
  '<a class="go alt" target="_blank" rel="noopener" href="https://wa.me/?text='+t+'%20'+u+'">WhatsApp</a>'+
  '<button class="go alt" data-a="sharecopy">Copiar texto</button><button class="go alt" data-a="shareclose">Cerrar</button></div>'+
  '<p class="small mut">Para Instagram, descarga la imagen y súbela como publicación o historia. En X y Facebook se comparte el enlace y el texto; añade la imagen descargada si quieres.</p></div></div>';
}
function shareCopy(){var t=UI.share?UI.share.txt+' '+SITE_URL:'';try{navigator.clipboard.writeText(t).then(function(){toast('Texto copiado.');});}catch(e){toast('No se ha podido copiar.',1);}}
function shareClose(){if(UI.share&&UI.share.url)try{URL.revokeObjectURL(UI.share.url);}catch(e){}UI.share=null;render();}
