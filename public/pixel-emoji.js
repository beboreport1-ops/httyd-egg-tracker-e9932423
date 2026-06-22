/* Pixel-art replacements for emoji. Walks the DOM, swaps emoji codepoints
   with tiny inline-SVG <span class="px-emo"> badges. CSS only / cosmetic. */
(function(){
  const P = {
    F:'#e8540a', A:'#f0a500', W:'#f8f1e6', K:'#1a0f08', D:'#3a2a1a',
    L:'#5a3a22', G:'#6fbe2e', B:'#3a8de8', P:'#a060e8', R:'#d12c2c',
    Y:'#f0d028', M:'#4ae0a0', S:'#d8a878', N:'#8a5a2a', X:'#9a9a9a',
    H:'#c0c0c0', J:'#2a1a10', O:'#ff8a3a', T:'#e0e0f0', Z:'#0f0a06',
    Q:'#3aa0d8', V:'#4a8a2a',
  };
  // 10x10 pixel grids. ' ' = transparent.
  const ICONS = {
    '🔍':[
      '          ',
      '   AAA    ',
      '  A   A   ',
      '  A   A   ',
      '  A   A   ',
      '   AAA    ',
      '      AA  ',
      '       AA ',
      '        AA',
      '          ',
    ],
    '🐉':[
      '          ',
      ' FF       ',
      'FFFF  FF  ',
      'FFFFFFFFF ',
      'FOFFFFFFFF',
      'FFFFFFFFF ',
      ' FFFFFFF  ',
      '  FF FF   ',
      '  F   F   ',
      '          ',
    ],
    '🏝️':[
      '   V      ',
      '  VVV     ',
      ' VVVVV  V ',
      '   N   VVV',
      '   N    V ',
      '   N      ',
      '  SSSSSSSS',
      ' SSSSSSSSS',
      'BBBBBBBBBB',
      'BBBBBBBBBB',
    ],
    '🗺️':[
      'WWW WWW WW',
      'WKWWWKWWKW',
      'WWWFFWWWWW',
      'WWFFFFWWWW',
      'WWWFFFWWWW',
      'WWWWWWKWWW',
      'WWKWWWWWWW',
      'WWWWWWWFWW',
      'WWWWKWWWWW',
      'WWW WWW WW',
    ],
    '🌀':[
      '  FFFFFF  ',
      ' FAAAAAAF ',
      'FAFFFFFAF ',
      'FAFAAAFAFF',
      'FAFAFFAFAF',
      'FAFAAAFAFA',
      'FAFFFFFAFA',
      'FAAAAAAAFA',
      ' FFFFFFFAA',
      '   AAAAAA ',
    ],
    '🥚':[
      '          ',
      '   AAAA   ',
      '  AWWWWA  ',
      ' AWWWWWWA ',
      ' AWWWWWWA ',
      ' AWWWWWWA ',
      ' AWWWWWWA ',
      '  AWWWWA  ',
      '   AAAA   ',
      '          ',
    ],
    '📍':[
      '          ',
      '   FFFF   ',
      '  FRRRRF  ',
      '  FRWWRF  ',
      '  FRWWRF  ',
      '  FRRRRF  ',
      '   FFFF   ',
      '    FF    ',
      '    FF    ',
      '     F    ',
    ],
    '✅':[
      '          ',
      ' GGGGGGGG ',
      'GGGGGGGGGG',
      'GGGGGWWGGG',
      'GGGGWWGGGG',
      'GWWGWGGGGG',
      'GGWWGGGGGG',
      'GGGWGGGGGG',
      'GGGGGGGGGG',
      ' GGGGGGGG ',
    ],
    '🟢':[
      '          ',
      '   GGGG   ',
      '  GGGGGG  ',
      ' GGGGGGGG ',
      ' GGGGGGGG ',
      ' GGGGGGGG ',
      ' GGGGGGGG ',
      '  GGGGGG  ',
      '   GGGG   ',
      '          ',
    ],
    '🔵':[
      '          ',
      '   BBBB   ',
      '  BBBBBB  ',
      ' BBBBBBBB ',
      ' BBBBBBBB ',
      ' BBBBBBBB ',
      ' BBBBBBBB ',
      '  BBBBBB  ',
      '   BBBB   ',
      '          ',
    ],
    '🔴':[
      '          ',
      '   RRRR   ',
      '  RRRRRR  ',
      ' RRRRRRRR ',
      ' RRRRRRRR ',
      ' RRRRRRRR ',
      ' RRRRRRRR ',
      '  RRRRRR  ',
      '   RRRR   ',
      '          ',
    ],
    '🟣':[
      '          ',
      '   PPPP   ',
      '  PPPPPP  ',
      ' PPPPPPPP ',
      ' PPPPPPPP ',
      ' PPPPPPPP ',
      ' PPPPPPPP ',
      '  PPPPPP  ',
      '   PPPP   ',
      '          ',
    ],
    '🟠':[
      '          ',
      '   FFFF   ',
      '  FFFFFF  ',
      ' FFFFFFFF ',
      ' FFFFFFFF ',
      ' FFFFFFFF ',
      ' FFFFFFFF ',
      '  FFFFFF  ',
      '   FFFF   ',
      '          ',
    ],
    '🟡':[
      '          ',
      '   YYYY   ',
      '  YYYYYY  ',
      ' YYYYYYYY ',
      ' YYYYYYYY ',
      ' YYYYYYYY ',
      ' YYYYYYYY ',
      '  YYYYYY  ',
      '   YYYY   ',
      '          ',
    ],
    '⬜':[
      '          ',
      ' XXXXXXXX ',
      ' XDDDDDDX ',
      ' XDDDDDDX ',
      ' XDDDDDDX ',
      ' XDDDDDDX ',
      ' XDDDDDDX ',
      ' XDDDDDDX ',
      ' XXXXXXXX ',
      '          ',
    ],
    '⏳':[
      ' AAAAAAAA ',
      ' AAAAAAAA ',
      ' AFFFFFFA ',
      '  AFFFFA  ',
      '   AFFA   ',
      '   AFFA   ',
      '  AAAAAA  ',
      ' AAAAAAAA ',
      ' AAAAAAAA ',
      '          ',
    ],
    '🔒':[
      '   AAAA   ',
      '  A    A  ',
      '  A    A  ',
      ' AAAAAAAA ',
      ' FFFFFFFF ',
      ' FFFKKFFF ',
      ' FFFKKFFF ',
      ' FFFFFFFF ',
      ' FFFFFFFF ',
      '          ',
    ],
    '💬':[
      ' FFFFFFFF ',
      'FFFFFFFFFF',
      'FFWWWWWWFF',
      'FFFFFFFFFF',
      'FFWWWWWWFF',
      'FFFFFFFFFF',
      'FFWWWWFFFF',
      'FFFFFFFFFF',
      ' FFF      ',
      'FF        ',
    ],
    '🔥':[
      '    F     ',
      '   FAF    ',
      '  FAAAF   ',
      ' FAYYAAF  ',
      ' FAYWYAF  ',
      ' FAYYYAFF ',
      'FFAAAAAFF ',
      'FFAAAAFFF ',
      ' FFFFFFF  ',
      '   FF     ',
    ],
    '🏔️':[
      '          ',
      '    W     ',
      '   WWW    ',
      '  WWWWW W ',
      ' DDWWWWWW ',
      ' DDDWWWDD ',
      'DDDDDDDDD ',
      'DDDDDDDDDD',
      'DDDDDDDDDD',
      '          ',
    ],
    '❄️':[
      '    W     ',
      ' W  W  W  ',
      '  W W W   ',
      '   WWW    ',
      'WWWWWWWWW ',
      '   WWW    ',
      '  W W W   ',
      ' W  W  W  ',
      '    W     ',
      '          ',
    ],
    '🌑':[
      '          ',
      '   KKKK   ',
      '  KKKKKK  ',
      ' KKKKKKKK ',
      ' KKKKKKKK ',
      ' KKKKKKKK ',
      ' KKKKKKKK ',
      '  KKKKKK  ',
      '   KKKK   ',
      '          ',
    ],
    '🌿':[
      '       VV ',
      '      VVV ',
      '   V VVV  ',
      '  VVVVV   ',
      ' VVVVVV   ',
      ' VVVVV    ',
      'VVVVN     ',
      'VVVN      ',
      ' VN       ',
      ' N        ',
    ],
    '💀':[
      '          ',
      '  WWWWWW  ',
      ' WWWWWWWW ',
      ' WKKWWKKW ',
      ' WWWWWWWW ',
      ' WWWKKWWW ',
      '  WWWWWW  ',
      '  WKWKWKW ',
      '   WWWWW  ',
      '          ',
    ],
    '🏛️':[
      '   WWWW   ',
      '  WWWWWW  ',
      ' WWWWWWWW ',
      ' WWWWWWWW ',
      ' W WW WW  ',
      ' W WW WW  ',
      ' W WW WW  ',
      ' W WW WW  ',
      'WWWWWWWWWW',
      'WWWWWWWWWW',
    ],
    '🪨':[
      '          ',
      '   DDDD   ',
      '  DLLLLD  ',
      ' DLLLDLDD ',
      ' DLDDLLLD ',
      ' DLLLLDLD ',
      ' DDLLDDDD ',
      '  DDDDDD  ',
      '          ',
      '          ',
    ],
    '🌋':[
      '   F  F   ',
      '  F FF F  ',
      ' F  FF  F ',
      '    FF    ',
      '   FFFF   ',
      '  DDFFDD  ',
      ' DDDDDDDD ',
      'DDDDDDDDDD',
      'DDDDDDDDDD',
      '          ',
    ],
    '🏜️':[
      '          ',
      '   A      ',
      '  AAA     ',
      '          ',
      '  SSSSSSS ',
      ' SSSSSSSSS',
      'SSSSSSSSSS',
      'SSSSSSSSSS',
      'SSSSSSSSSS',
      '          ',
    ],
    '🌫️':[
      '          ',
      ' XXXXXXX  ',
      'XXXXXXXXXX',
      '  XXXXXX  ',
      ' XXXXXXXXX',
      'XXXXXXXX  ',
      '  XXXXXXX ',
      ' XXXXXXXX ',
      'XXXXXXXXX ',
      '          ',
    ],
    '🌲':[
      '    V     ',
      '   VVV    ',
      '  VVVVV   ',
      '   VVV    ',
      '  VVVVV   ',
      ' VVVVVVV  ',
      '  VVVVV   ',
      ' VVVVVVV  ',
      '    N     ',
      '    N     ',
    ],
    '🌾':[
      '    A     ',
      '   AAA    ',
      '  A A A   ',
      '   AAA    ',
      '  A A A   ',
      '   AAA    ',
      '    A     ',
      '    A     ',
      '    A     ',
      '          ',
    ],
    '⚡':[
      '     YY   ',
      '    YY    ',
      '   YY     ',
      '  YYYYY   ',
      '    YY    ',
      '   YY     ',
      '  YY      ',
      ' YY       ',
      '          ',
      '          ',
    ],
    '👑':[
      '          ',
      ' Y   Y  Y ',
      ' YY YYY YY',
      ' YYYYYYYYY',
      ' YAYAYAYAY',
      ' YYYYYYYYY',
      ' YYYYYYYYY',
      '          ',
      '          ',
      '          ',
    ],
    '🗿':[
      '          ',
      '  DDDDDD  ',
      ' DDDDDDDD ',
      ' DKDDDDKD ',
      ' DDDDDDDD ',
      ' DDDKKDDD ',
      ' DDDDDDDD ',
      ' DDDDDDDD ',
      '  DDDDDD  ',
      '          ',
    ],
    '🪸':[
      '   R  R   ',
      '  RR RR   ',
      '  RRRRR R ',
      ' R RRRRRR ',
      ' RRRRRRR  ',
      '  RRRRR   ',
      '   RRR    ',
      '    R     ',
      ' SSSSSSSS ',
      'SSSSSSSSSS',
    ],
    '⚓':[
      '    KK    ',
      '   KWWK   ',
      '    KK    ',
      '  KKKKKK  ',
      '    KK    ',
      '    KK    ',
      '    KK    ',
      ' K  KK  K ',
      ' KKKKKKKK ',
      '  KKKKKK  ',
    ],
    '🌉':[
      '          ',
      ' F      F ',
      ' FF    FF ',
      ' FFFFFFFF ',
      ' F FFFF F ',
      ' F F  F F ',
      ' F F  F F ',
      'BBBBBBBBBB',
      'BBBBBBBBBB',
      '          ',
    ],
    '🐑':[
      '          ',
      '  WWWWWW  ',
      ' WWWWWWWW ',
      'WWKWWWWKWW',
      'WWWWWWWWWW',
      ' WWWWWWWW ',
      '  WWWWWW  ',
      '  K K K K ',
      '          ',
      '          ',
    ],
  };

  const cache = new Map();
  function toSvg(grid){
    if(cache.has(grid)) return cache.get(grid);
    let rects='';
    for(let y=0;y<grid.length;y++){
      const row=grid[y];
      for(let x=0;x<row.length;x++){
        const c=row[x];
        if(c===' ') continue;
        const col=P[c]; if(!col) continue;
        rects+=`<rect x="${x}" y="${y}" width="1" height="1" fill="${col}"/>`;
      }
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" shape-rendering="crispEdges">${rects}</svg>`;
    const url='data:image/svg+xml;utf8,'+encodeURIComponent(svg);
    cache.set(grid,url);
    return url;
  }

  // Build a single regex matching any known emoji (with optional VS16 \uFE0F).
  const keys=Object.keys(ICONS).sort((a,b)=>b.length-a.length);
  const escaped=keys.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const re=new RegExp('(?:'+escaped.join('|')+')\\uFE0F?','gu');

  function makeSpan(emoji){
    const key=emoji.replace(/\uFE0F/g,'');
    const grid=ICONS[key]; if(!grid) return null;
    const url=toSvg(grid);
    return `<span class="px-emo" role="img" aria-label="${key}" style="background-image:url('${url}')"></span>`;
  }

  function processTextNode(node){
    const text=node.nodeValue;
    if(!text || !re.test(text)) return;
    re.lastIndex=0;
    const frag=document.createDocumentFragment();
    let last=0, m;
    while((m=re.exec(text))){
      if(m.index>last) frag.appendChild(document.createTextNode(text.slice(last,m.index)));
      const html=makeSpan(m[0]);
      if(html){
        const tpl=document.createElement('template');
        tpl.innerHTML=html;
        frag.appendChild(tpl.content.firstChild);
      } else {
        frag.appendChild(document.createTextNode(m[0]));
      }
      last=m.index+m[0].length;
    }
    if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag,node);
  }

  function walk(root){
    if(!root) return;
    if(root.nodeType===3){ processTextNode(root); return; }
    if(root.nodeType!==1) return;
    if(root.classList && root.classList.contains('px-emo')) return;
    // Skip inputs/textareas/scripts/styles.
    const tag=root.tagName;
    if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='INPUT') return;
    const kids=Array.from(root.childNodes);
    for(const k of kids) walk(k);
  }

  // Inject CSS for the pixel-emoji spans + pseudo-element (search icon).
  const style=document.createElement('style');
  // Build a CSS rule that overrides .search-wrap::before to use an SVG bg.
  const searchUrl=toSvg(ICONS['🔍']);
  style.textContent=`
    .px-emo{
      display:inline-block;width:1em;height:1em;vertical-align:-0.15em;
      background-repeat:no-repeat;background-position:center;background-size:contain;
      image-rendering:pixelated;image-rendering:crisp-edges;
      filter: drop-shadow(0 0 2px rgba(232,84,10,0.25));
    }
    .search-wrap::before{
      content:'' !important;
      width:14px;height:14px;
      background:url("${searchUrl}") center/contain no-repeat;
      image-rendering:pixelated;
    }
  `;
  document.head.appendChild(style);

  function run(){ walk(document.body); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run);
  else run();

  // Re-run on DOM mutations so dynamic renders get pixelated too.
  const mo=new MutationObserver(muts=>{
    for(const m of muts){
      for(const n of m.addedNodes) walk(n);
      if(m.type==='characterData' && m.target) processTextNode(m.target);
    }
  });
  mo.observe(document.body,{childList:true,subtree:true,characterData:true});
})();
