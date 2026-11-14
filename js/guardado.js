/* Estrella del Balón · partidas guardadas.
   Tres huecos. Cada partida (1,5-2 MB) se guarda en IndexedDB del navegador; si no está disponible, en localStorage.
   El índice de huecos (nombre, club, temporada…) va en localStorage. Se puede exportar e importar como archivo .json. */
var NSLOTS=3,META_KEY='estrella_balon_huecos',DBN='estrella_balon',DBS='partidas',DB=null,CUR=null,saveTimer=null,saveWarned=false;

function idbOpen(cb){
 if(typeof indexedDB==='undefined'){cb(null);return;}
 try{var r=indexedDB.open(DBN,1);
  r.onupgradeneeded=function(){r.result.createObjectStore(DBS);};
  r.onsuccess=function(){DB=r.result;cb(DB);};
  r.onerror=function(){cb(null);};
 }catch(e){cb(null);}
}
function metaAll(){try{return JSON.parse(localStorage.getItem(META_KEY))||{};}catch(e){return {};}}
function metaSet(id,m){var a=metaAll();if(m)a[id]=m;else delete a[id];try{localStorage.setItem(META_KEY,JSON.stringify(a));}catch(e){}}
function metaNow(){var c=S.clubs[S.pl[S.me].c];return {name:S.name,pos:S.pos,club:c.n,season:S.season,age:S.age,ov:Math.round(overall()),real:!!S.real,retired:!!S.retired,date:Date.now(),look:S.look,kit:clubColors(c)};}
function slotKey(id){return KEY+'_'+id;}

/* guarda la partida actual en su hueco (con un pequeño retardo para no escribir 2 MB en cada clic) */
function save(){
 if(!S||CUR==null)return;
 if(saveTimer)clearTimeout(saveTimer);
 saveTimer=setTimeout(saveNow,250);
 if(typeof saveTimer!=='number'&&!saveTimer)saveNow();
}
function saveNow(){
 saveTimer=null;if(!S||CUR==null)return;
 var json;try{json=JSON.stringify(S);}catch(e){return;}
 metaSet(CUR,metaNow());
 if(DB){try{var tx=DB.transaction(DBS,'readwrite');tx.objectStore(DBS).put(json,CUR);tx.onerror=function(){warnSave();};}catch(e){warnSave();}}
 else{try{localStorage.setItem(slotKey(CUR),json);}catch(e){warnSave();}}
}
function warnSave(){if(saveWarned)return;saveWarned=true;toast('No se ha podido guardar: el navegador no tiene espacio. Exporta la partida a un archivo desde Carrera.',1);}
function loadSlot(id,cb){
 function done(raw){var o=null;try{o=raw?JSON.parse(raw):null;}catch(e){}cb(o&&o.v===VER?o:null);}
 if(DB){try{var rq=DB.transaction(DBS,'readonly').objectStore(DBS).get(id);rq.onsuccess=function(){done(rq.result);};rq.onerror=function(){done(null);};}catch(e){done(null);}}
 else{var raw=null;try{raw=localStorage.getItem(slotKey(id));}catch(e){}done(raw);}
}
function deleteSlot(id){
 metaSet(id,null);
 if(DB){try{DB.transaction(DBS,'readwrite').objectStore(DBS).delete(id);}catch(e){}}
 try{localStorage.removeItem(slotKey(id));}catch(e){}
}
function freeSlot(){var m=metaAll();for(var i=1;i<=NSLOTS;i++)if(!m[i])return i;return null;}
function openSlot(id){loadSlot(id,function(o){if(!o){toast('No se ha podido cargar esa partida.',1);return;}S=o;CUR=id;UI.comp=null;UI.sq=null;UI.lastTab='';render();});}
function toMenu(){if(S)saveNow();S=null;CUR=null;UI.screen='menu';UI.sq=null;render();}

/* exportar e importar */
function fileName(o){return ('estrella-del-balon-'+(o.name||'partida')+'-T'+o.season).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9-]+/g,'-')+'.json';}
function downloadJSON(o){
 var blob=new Blob([JSON.stringify(o)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=fileName(o);document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(url);a.remove();},500);
}
function exportCurrent(){if(!S)return;saveNow();downloadJSON(S);toast('Partida exportada a un archivo.');}
function exportSlot(id){loadSlot(id,function(o){if(o)downloadJSON(o);else toast('No se ha podido leer esa partida.',1);});}
function importFile(file){
 if(!file)return;
 var id=freeSlot();if(!id){toast('Los '+NSLOTS+' huecos están ocupados. Borra una partida antes de importar.',1);return;}
 var rd=new FileReader();
 rd.onload=function(){var o=null;try{o=JSON.parse(rd.result);}catch(e){}
  if(!o||!o.pl||!o.clubs){toast('Ese archivo no es una partida de Estrella del Balón.',1);return;}
  if(o.v!==VER){toast('La partida es de otra versión del juego (v'+o.v+') y no se puede cargar.',1);return;}
  S=o;CUR=id;saveNow();S=null;CUR=null;toast('Partida importada en el hueco '+id+'.');render();};
 rd.readAsText(file);
}

/* arranque: abre la base de datos y pasa al menú (migra la partida antigua de localStorage si la hay) */
function bootSaves(){
 idbOpen(function(){
  try{var old=localStorage.getItem(KEY);if(old){var o=JSON.parse(old);if(o&&o.v===VER&&!metaAll()[1]){S=o;CUR=1;saveNow();}localStorage.removeItem(KEY);}}catch(e){}
  S=null;CUR=null;UI.screen='menu';UI.booted=true;render();
 });
}
