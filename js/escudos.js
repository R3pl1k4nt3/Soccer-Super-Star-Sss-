/* Estrella del Balón · escudos.
   Generados para todos los clubes (forma, colores, franjas e iniciales salen del nombre).
   En la versión real, si existe js/escudos-reales.js (tools/descargar-escudos.ps1), se usa la imagen descargada. */
var CREST_STOP={fc:1,cf:1,cd:1,ud:1,sd:1,ac:1,as:1,sc:1,ss:1,us:1,afc:1,rc:1,rcd:1,sv:1,vfl:1,vfb:1,tsv:1,fk:1,sk:1,bk:1,gd:1,de:1,del:1,la:1,el:1,los:1,las:1,y:1,'&':1,da:1,do:1,des:1,di:1,du:1,the:1,club:1,'1.':1,'1.fc':1};
function crestInitials(n){
 var w=n.replace(/[()'.]/g,' ').split(/\s+/).filter(function(x){return x&&!CREST_STOP[x.toLowerCase()]&&!/^\d+$/.test(x);});
 if(!w.length)w=n.split(/\s+/);
 return (w.length===1?w[0].slice(0,3):w.slice(0,3).map(function(x){return x.charAt(0);}).join('')).toUpperCase();
}
function lum(hex){var n=parseInt(hex.slice(1),16);return (0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255;}
var CREST_SHAPES=[
 'M12 8 H88 V46 C88 72 70 88 50 96 C30 88 12 72 12 46 Z',
 'M50 6 A44 44 0 1 1 49.9 6 Z',
 'M14 8 H86 Q92 8 92 14 V70 Q92 92 50 96 Q8 92 8 70 V14 Q8 8 14 8 Z',
 'M14 8 H86 L84 50 Q80 80 50 96 Q20 80 16 50 Z',
 'M10 14 L30 6 L50 14 L70 6 L90 14 V50 C90 74 72 88 50 96 C28 88 10 74 10 50 Z'
];
function crestSVG(c,size){
 if(!c)return '';size=size||22;
 if(typeof crestPlus==='function'){var cp=crestPlus(c,size);if(cp)return cp;}
 if(S&&S.real&&typeof ESCUDOS!=='undefined'&&ESCUDOS[c.n])return '<img class="crest" src="'+esc(ESCUDOS[c.n])+'" alt="" width="'+size+'" height="'+size+'" loading="lazy">';
 var k=clubColors(c),h=hashStr(c.n),shape=CREST_SHAPES[h%CREST_SHAPES.length],div=(h>>3)%6,id='cr'+(++AVN);
 var a=k.a,b=k.b;if(a===b)b=lum(a)>0.5?'#111':'#fff';
 var body='<rect width="100" height="100" fill="'+a+'"/>';
 if(k.st||div===1)body+='<rect x="30" width="13" height="100" fill="'+b+'"/><rect x="57" width="13" height="100" fill="'+b+'"/>';
 else if(div===2)body+='<rect x="50" width="50" height="100" fill="'+b+'"/>';
 else if(div===3)body+='<path d="M0 30 L30 0 H55 L0 55 Z M45 100 L100 45 V70 L70 100 Z" fill="'+b+'"/>';
 else if(div===4)body+='<path d="M0 46 L50 70 L100 46 V62 L50 86 L0 62 Z" fill="'+b+'"/>';
 else if(div===5)body+='<rect y="38" width="100" height="22" fill="'+b+'"/>';
 var ini=crestInitials(c.n),fs=ini.length>=3?26:32,tx=lum(div===5||div===2?b:a)>0.6?'#111':'#fff';
 var txt='<text x="50" y="'+(div===5?57:58)+'" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="'+fs+'" fill="'+(div===5?(lum(b)>0.6?'#111':'#fff'):tx)+'" stroke="rgba(0,0,0,.25)" stroke-width="1">'+esc(ini)+'</text>';
 var star=c.t===1&&c.str>=80?'<path d="M50 0 l3 6 6 .8 -4.5 4 1.2 6.2 -5.7 -3 -5.7 3 1.2 -6.2 -4.5 -4 6 -.8z" transform="translate(0 -1) scale(1)" fill="#f5c542"/>':'';
 return '<svg class="crest" viewBox="0 -4 100 104" width="'+size+'" height="'+size+'" aria-hidden="true"><defs><clipPath id="'+id+'"><path d="'+shape+'"/></clipPath></defs><g clip-path="url(#'+id+')">'+body+'</g><path d="'+shape+'" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="4"/><path d="'+shape+'" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>'+txt+star+'</svg>';
}
/* nombre de club con escudo, como botón que abre la plantilla */
function clubLink(c,extra){return '<button class="lnk clublnk" data-a="squad" data-id="'+c.id+'">'+crestSVG(c,20)+'<span>'+esc(c.n)+'</span></button>'+(extra||'');}
