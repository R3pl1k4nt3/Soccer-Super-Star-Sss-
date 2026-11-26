/* Estrella del Balón · versión app (Android).
   - Modo app: dentro de Capacitor, o en el navegador con ?app=1 para probar. En la web normal el juego es libre.
   - Una temporada gratis al día por dispositivo. Para jugar más ese día: comprar el juego o ver anuncios
     (MONET.adsPerSeason anuncios desbloquean una temporada). Las temporadas desbloqueadas se guardan.
   - Anuncios con recompensa: AdMob si está el plugin de Capacitor; si no, un anuncio simulado para probar.
   - Botón atrás de Android: cierra ventanas, sale de la negociación o vuelve a Inicio antes de salir de la app. */
var MONET={freePerDay:1,adsPerSeason:3,adSecs:5,price:'2,99 €',
 admobRewardId:'ca-app-pub-3940256099942544/5224354917' /* identificador de PRUEBA de Google; cambiar por el real al publicar */};
function isApp(){try{if(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform())return true;}catch(e){}return typeof location!=='undefined'&&/[?&]app=1/.test(location.search);}
function isNative(){try{return !!(window.Capacitor&&Capacitor.isNativePlatform&&Capacitor.isNativePlatform());}catch(e){return false;}}
function mToday(){var d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function mState(){var m;try{m=JSON.parse(localStorage.getItem('estrella_monet')||'{}');}catch(e){m={};}
 if(m.day!==mToday()){m.day=mToday();m.used=0;}m.credits=m.credits||0;m.ads=m.ads||0;return m;}
function mSave(m){try{localStorage.setItem('estrella_monet',JSON.stringify(m));}catch(e){}}
function gateOn(){return isApp()&&!mState().premium;}

/* ¿se puede jugar esta temporada? Se cobra al jugar el primer partido de cada temporada */
function seasonGate(){
 if(!S)return true;
 if(S.gateSeason==null&&S.slot>0)S.gateSeason=S.season; /* partidas empezadas antes de existir el límite */
 if(S.gateSeason===S.season)return true;
 if(!gateOn()){S.gateSeason=S.season;return true;}
 var m=mState();
 if(m.used<MONET.freePerDay){m.used++;mSave(m);S.gateSeason=S.season;logm('Empiezas tu temporada gratis de hoy.');return true;}
 if(m.credits>0){m.credits--;mSave(m);S.gateSeason=S.season;logm('Usas una temporada desbloqueada con anuncios.');return true;}
 return false;
}
function gateTxt(){var m=mState();
 if(!isApp())return '';if(m.premium)return 'Juego completo: temporadas sin límite y sin anuncios.';
 return 'Hoy: '+Math.min(m.used,MONET.freePerDay)+'/'+MONET.freePerDay+' temporada gratis usada · '+m.credits+' desbloqueada(s) con anuncios · anuncios '+m.ads+'/'+MONET.adsPerSeason+'.';}
function gateCard(){if(!isApp())return '';var m=mState();
 return '<div class="card"><h3>'+(m.premium?'Juego completo':'Temporadas de hoy')+'</h3><p class="small mut" style="margin:0">'+gateTxt()+'</p>'+
  (m.premium?'':'<div class="btns" style="margin-top:10px"><button class="go alt" data-a="adwatch">Ver anuncio</button><button class="go" data-a="buygame">Comprar el juego · '+MONET.price+'</button></div>')+'</div>';}

/* ---------- anuncios con recompensa ---------- */
var adTimer=null;
function adWatch(){
 var P=isNative()&&window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.AdMob;
 if(P){P.prepareRewardVideoAd({adId:MONET.admobRewardId,isTesting:true}).then(function(){return P.showRewardVideoAd();}).then(function(r){if(r)adReward();})
  .catch(function(){toast('No hay anuncios disponibles ahora. Prueba en un rato.',1);});return;}
 /* simulado: cuenta atrás y recompensa */
 UI.pop={k:'ad',left:MONET.adSecs};render();adTick();
}
function adTick(){if(adTimer)clearTimeout(adTimer);if(!UI.pop||UI.pop.k!=='ad'||UI.pop.left<=0)return;
 adTimer=setTimeout(function(){if(!UI.pop||UI.pop.k!=='ad')return;UI.pop.left--;render();adTick();},1000);}
function adReward(){
 var m=mState();m.ads++;var un=false;if(m.ads>=MONET.adsPerSeason){m.ads=0;m.credits++;un=true;}mSave(m);
 if(un){UI.pop=null;toast('¡Temporada desbloqueada! Ya puedes seguir jugando.');}
 else{UI.pop={k:'gate'};toast('Anuncio visto: '+m.ads+'/'+MONET.adsPerSeason+'.');}
 render();
}
/* ---------- compra ---------- */
function buyGame(){
 if(isNative()){toast('La compra se hará con Google Play cuando la app esté publicada.',1);return;}
 UI.pop={k:'buy'};render();
}
function buyConfirm(){var m=mState();m.premium=true;mSave(m);UI.pop=null;toast('Juego completo activado (compra simulada).');render();}

/* ventanas: límite, anuncio simulado y compra simulada */
function monetPop(P){
 var m=mState();
 if(P.k==='ad')return '<div class="modal" role="dialog" aria-modal="true" aria-label="Anuncio"><div class="card pop adsim"><span class="badge">ANUNCIO DE PRUEBA</span>'+
  '<div class="adbox"><b>Tu anuncio aquí</b><span class="small mut">En la app se mostrará un anuncio de vídeo de AdMob.</span></div>'+
  (P.left>0?'<p class="mut" style="text-align:center">La recompensa llega en <b class="num">'+P.left+'</b> s</p>':'<button class="go block" data-a="adclaim">Recoger recompensa</button>')+'</div></div>';
 if(P.k==='buy')return '<div class="modal" role="dialog" aria-modal="true" aria-label="Comprar el juego"><div class="card pop"><h2>Juego completo · '+MONET.price+'</h2>'+
  '<p>Temporadas sin límite y sin anuncios, en todas tus partidas.</p><p class="small mut">Modo de prueba: no se cobra nada. En la app de Android el pago lo gestiona Google Play.</p>'+
  '<div class="btns"><button class="go" data-a="buyok">Activar (prueba)</button><button class="go alt" data-a="popclose">Cancelar</button></div></div></div>';
 var dots='';for(var i=0;i<MONET.adsPerSeason;i++)dots+='<span class="addot'+(i<m.ads?' on':'')+'"></span>';
 return '<div class="modal" role="dialog" aria-modal="true" aria-label="Has jugado tu temporada de hoy"><div class="card pop"><h2>Has jugado tu temporada de hoy</h2>'+
  '<p>Cada día tienes '+(MONET.freePerDay===1?'una temporada gratis':MONET.freePerDay+' temporadas gratis')+'. Para seguir hoy, compra el juego completo o mira '+MONET.adsPerSeason+' anuncios y desbloquea una temporada más.</p>'+
  '<div class="addots" aria-label="Anuncios vistos: '+m.ads+' de '+MONET.adsPerSeason+'">'+dots+'</div>'+
  '<div class="btns" style="margin-top:12px"><button class="go" data-a="adwatch">Ver anuncio ('+(m.ads+1)+' de '+MONET.adsPerSeason+')</button><button class="go alt" data-a="buygame">Comprar el juego · '+MONET.price+'</button><button class="go alt full" data-a="popclose">Volver mañana</button></div></div></div>';
}

/* ---------- botón atrás ---------- */
function appBack(){
 if(typeof UI==='undefined')return false;
 if(UI.pop&&UI.pop.k==='ad')return true;
 if(UI.pop){var c=document.querySelector('[data-a=popclose]');if(c)c.click();else{UI.pop=null;render();}return true;}
 if(!S){if(UI.screen==='new'){UI.screen='menu';render();return true;}return false;}
 if(S.neg){negQuit();return true;}
 if(UI.sq){UI.sq=null;render();return true;}
 if(S.summary||S.pre||S.retired)return true;
 if(S.tab!=='home'){S.tab='home';save();render();return true;}
 return false;
}
function appInit(){
 if(!isApp())return;
 document.documentElement.classList.add('app');
 if(isNative()&&Capacitor.Plugins&&Capacitor.Plugins.App){Capacitor.Plugins.App.addListener('backButton',function(){if(!appBack())Capacitor.Plugins.App.exitApp();});return;}
 /* prueba en el navegador: el botón atrás del navegador hace de botón atrás de Android */
 history.pushState({app:1},'');window.addEventListener('popstate',function(){if(appBack())history.pushState({app:1},'');});
}

/* ---------- primeros pasos ---------- */
function tutCard(){
 if(S.tutDone||S.season>2)return '';
 return '<div class="card wide tut"><div class="rowb"><h3 style="margin:0">Primeros pasos</h3><button class="chip" data-a="tutok">Entendido</button></div><ol class="small">'+
  '<li><b>Jugador › Entreno:</b> gasta dinero y medallas en tus habilidades. Mira hasta dónde puede llegar cada una.</li>'+
  '<li><b>Partido:</b> juega la semana. El reloj corre y se para en tus jugadas: elige bien contra cada rival.</li>'+
  '<li><b>Vida:</b> tienes 2 acciones por semana con el míster, el vestuario, la directiva, la prensa y la afición.</li>'+
  '<li><b>Carrera › Club:</b> ofertas de otros clubes. Al fichar o renovar, negocia: tu representante marca lo que puedes pedir.</li>'+
  '<li><b>Negocios:</b> patrocinios y empresas para cuando ganes dinero. Y en <b>Carrera › Hitos</b>, todos tus logros.</li></ol></div>';
}
