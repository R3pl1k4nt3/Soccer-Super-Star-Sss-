/* Simula carreras completas en Node para detectar errores de lógica.
   Uso: node tests/simulacion.js [temporadas]  */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const srcs=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1].split('?')[0]);
/* un navegador mínimo: lo justo para que el juego pinte y guarde sin pantalla */
const noop=()=>{},cls={add:noop,remove:noop,contains:()=>false};
const el={innerHTML:'',scrollTop:0,value:'',style:{},classList:cls,setAttribute:noop,getAttribute:()=>null,focus:noop,contains:()=>true,appendChild:noop,remove:noop,querySelector:()=>null,querySelectorAll:()=>[]};
const store={};
const ctx={console,Math,JSON,Date,URL,performance:{now:()=>Date.now()},
 document:{querySelector:()=>el,querySelectorAll:()=>[],addEventListener:noop,createElement:()=>Object.assign({},el,{getContext:()=>null}),
  body:el,documentElement:{classList:cls},hidden:false,baseURI:'http://localhost/'},
 localStorage:{getItem:k=>store[k]===undefined?null:store[k],setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}},
 setTimeout:()=>0,clearTimeout:()=>0,matchMedia:()=>({matches:false})};
ctx.window=ctx;ctx.global=ctx;vm.createContext(ctx);
/* datos-reales.js solo existe en local (no está en el repositorio): se salta si falta */
for(const s of srcs){const f=path.join(root,s);if(!fs.existsSync(f)){console.log('(se omite '+s+': no está en esta copia)');continue;}vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:s});}
vm.runInContext(fs.readFileSync(path.join(__dirname,'bot.js'),'utf8'),ctx,{filename:'bot.js'});
const G=ctx.__dbg,years=+process.argv[2]||5;
let fail=0;
const casos=[['DC','killer','tl','ESP','ESP'],['POR','gato','libero','IRL','IRL'],['MC','mago','pase','ARG','ITA'],['DFC','muro','aereo','ENG','ENG'],['EI','reg','rayo','BRA','POR']];
if(typeof ctx.REALDATA!=='undefined')casos.push(['MP','mago','grande','ESP','ESP',1]);
for(const [pos,tp,ts,nat,co,real] of casos){
 const r=ctx.botCarrera(G,pos,tp,ts,nat,co,years,{real:!!real});
 console.log(`\n== ${real?'REAL':'ficticia'} · ${pos} · ${nat} · empieza en ${co} · ${Math.round(r.size/1024)} KB guardados`);
 r.rows.forEach(x=>console.log('  '+x));
 if(r.trofeos.length)console.log('  Palmarés: '+r.trofeos.slice(-8).join(' | '));
 console.log('  Selección: '+JSON.stringify(r.seleccion));
 if(r.balon.length)console.log('  Balón de Oro: '+r.balon.slice(-1)[0]);
 if(r.errs.length){fail=1;r.errs.forEach(e=>console.log('  ERROR '+e));}
 if(r.size>4500000){fail=1;console.log('  ERROR la partida ocupa demasiado para localStorage');}
}
console.log(fail?'\nFALLOS':'\nok');
process.exit(fail);
