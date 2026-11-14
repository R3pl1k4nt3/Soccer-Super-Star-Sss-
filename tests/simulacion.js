const fs=require('fs');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const js=html.split('<script>')[1].split('</script>')[0];
const el={innerHTML:'',scrollTop:0,value:''};
global.window=global;
global.document={querySelector:()=>el,addEventListener(){}};
let store={};
global.localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]};
global.setTimeout=()=>0;
eval(js);
const G=window.__dbg;
const tabs=['train','match','league','club','life','money','shop','career'];
for(const [pos,tp,ts] of [['POR','gato','libero'],['DFC','muro','aereo'],['LI','centr','rayo'],['MCD','lector','pulmon'],['MC','mago','pase'],['MP','reg','grande'],['SD','fk','killer'],['DC','killer','tl'],['EI','reg','rayo']]){
  G.newGame('Test',pos,tp,ts);
  const S=G.S;let last='',goals=0,sample='';
  for(let y=0;y<10&&!S.retired;y++){
    for(let c of ['men','fis','def','med','ata']){S.cat=c;}
    for(let i=0;i<20;i++){const k=S.skills[Math.floor(Math.random()*S.skills.length)];S.mult=5;G.train(k.id);G.promo(k.id);}
    for(let w=0;w<38;w++){
      if(S.event)G.doEvent(0);
      G.playN(1);let g=0;while(S.match&&g++<5)G.choose(0);
      if(S.last&&S.last.evs.length&&!sample)sample=S.last.evs.map(e=>e.txt).join(' | ');
      if(S.summary){const m=S.summary;last=`T${m.season} ov ${m.ovBefore.toFixed(1)} pos${m.pos} apps${m.apps} nota${m.rating.toFixed(1)} €${Math.round(S.money/1000)}k`;S.summary=null;break;}
      for(const t of tabs){S.tab=t;G.render();}
    }
  }
  console.log(pos,tp,ts,last,'|',sample.slice(0,140));
}
// vistas de plantilla
G.newGame('Ana','DC','killer','tl');
const html2=[];G.S.tab='train';G.render();
console.log('sk',G.S.skills.length,'ros',G.S.clubs[0].ros.length,G.S.clubs[3].ros[0]);
console.log('ok');
G.newGame('Ana','POR','gato','libero');
const a=G.sq(0,null), b=G.sq(0,3), c=G.sq(G.S.clubId,'me');
console.log(a.length,b.length,c.length, b.includes('Portería')||b.includes('Mentales'));
