/* Bricoach V26 — Vidéos par métier + recherche par mots-clés. Ne modifie pas le placement des vidéos dans les tutoriels. */

let v26VideoTrade=null;
let v26VideoQuery='';

function v26Normalize(s=''){
  return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
}

function v26VideoCatalog(){
  const rows=[];
  if(typeof V24_ERIC_VIDEOS!=='undefined'){
    V24_ERIC_VIDEOS.forEach(v=>rows.push({...v,trade:'Carrelage',channel:'Éric Le Carreleur',channelUrl:'https://www.youtube.com/@EricLeCarreleur'}));
  }
  if(typeof V25_VIDEOS!=='undefined'){
    Object.entries(V25_VIDEOS).forEach(([trade,list])=>{
      const ch=(typeof V25_CHANNELS!=='undefined'&&V25_CHANNELS[trade])||{};
      (list||[]).forEach(v=>rows.push({...v,trade,channel:ch.name||'YouTube',channelUrl:ch.url||'',sub:ch.sub||''}));
    });
  }
  return rows;
}

function v26Trades(){
  const order=['Carrelage','Peinture','Placo / isolation','Sol / parquet'];
  const all=[...new Set(v26VideoCatalog().map(v=>v.trade))];
  return order.filter(x=>all.includes(x)).concat(all.filter(x=>!order.includes(x)));
}

function v26TradeIcon(trade){return (typeof meta!=='undefined'&&meta[trade]?.[2])||({Carrelage:'🧱',Peinture:'🎨','Placo / isolation':'🧰','Sol / parquet':'🪵'}[trade]||'🔧')}
function v26TradeLabel(trade){return trade==='Sol / parquet'?'Parquet / stratifié / vinyle':trade}

function v26VideoMatches(v,q){
  if(!q)return true;
  const needle=v26Normalize(q);
  const hay=v26Normalize([v.title,v.cat,v.trade,v.channel,...(v.tags||[])].join(' '));
  return needle.split(/\s+/).filter(Boolean).every(w=>hay.includes(w));
}

function v26VideoThumb(v){return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
function v26VideoCard(v){
  return `<button class="v26VideoCard" onclick='v26OpenVideo(${JSON.stringify(v.id)})'>
    <span class="v26VideoThumb"><img src="${v26VideoThumb(v)}" alt="${esc(v.title)}" loading="lazy"><i>▶</i></span>
    <span class="v26VideoInfo"><em>${esc(v.cat||v.trade)}</em><b>${esc(v.title)}</b><small>${esc(v.channel||'YouTube')}</small></span>
  </button>`;
}

function v26OpenVideo(id){
  const v=v26VideoCatalog().find(x=>x.id===id);if(!v)return;
  document.querySelector('#v26Player')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v26Player"><div class="modal v26Player"><div class="wizardTop"><div><div class="eyebrow">VIDÉO TUTORIEL</div><h2>${esc(v.title)}</h2></div><button class="close" onclick="document.querySelector('#v26Player').remove()">✕</button></div><div class="v26PlayerFrame"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="v26PlayerMeta"><div><b>${v26TradeIcon(v.trade)} ${esc(v26TradeLabel(v.trade))}</b><small>${esc(v.channel||'YouTube')} · ${esc(v.cat||'Tutoriel')}</small></div><a class="btn soft" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">Ouvrir sur YouTube ↗</a></div></div></div>`);
}

function v26RenderVideoHub(){
  const body=document.getElementById('v26VideoHubBody');if(!body)return;
  const all=v26VideoCatalog();
  const q=v26VideoQuery.trim();
  if(!v26VideoTrade && !q){
    body.innerHTML=`<div class="v26VideoIntro"><b>Choisis un métier</b><span>Tu retrouveras ensuite toutes ses vidéos tutoriels. La recherche permet aussi de retrouver rapidement une vidéo quand la bibliothèque grandira.</span></div><div class="v26TradeGrid">${v26Trades().map(t=>{const count=all.filter(v=>v.trade===t).length;const sample=all.find(v=>v.trade===t);return `<button onclick='v26SelectVideoTrade(${JSON.stringify(t)})'><span>${v26TradeIcon(t)}</span><div><b>${esc(v26TradeLabel(t))}</b><small>${count} vidéo${count>1?'s':''} · ${esc(sample?.channel||'')}</small></div><strong>›</strong></button>`}).join('')}</div>`;
    return;
  }
  let list=all;
  if(v26VideoTrade)list=list.filter(v=>v.trade===v26VideoTrade);
  if(q)list=list.filter(v=>v26VideoMatches(v,q));
  const title=v26VideoTrade?v26TradeLabel(v26VideoTrade):'Tous les métiers';
  body.innerHTML=`<div class="v26ResultsHead"><button class="btn soft" onclick="v26ClearVideoTrade()">← Métiers</button><div><b>${v26TradeIcon(v26VideoTrade||'')} ${esc(title)}</b><small>${list.length} résultat${list.length>1?'s':''}${q?` pour « ${esc(q)} »`:''}</small></div></div>${list.length?`<div class="v26VideoGrid">${list.map(v26VideoCard).join('')}</div>`:`<div class="v26Empty"><span>🔎</span><b>Aucune vidéo trouvée</b><small>Essaie un autre mot-clé : « joint », « plafond », « vinyle », « bande », « grand format »…</small></div>`}`;
}

function v26SearchVideos(value){v26VideoQuery=value||'';v26RenderVideoHub()}
function v26SelectVideoTrade(trade){v26VideoTrade=trade;v26RenderVideoHub()}
function v26ClearVideoTrade(){v26VideoTrade=null;v26VideoQuery='';const inp=document.getElementById('v26VideoSearch');if(inp)inp.value='';v26RenderVideoHub()}

function v26OpenVideoHub(){
  document.querySelector('#v26VideoHub')?.remove();v26VideoTrade=null;v26VideoQuery='';
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v26VideoHub"><div class="modal v26VideoHub"><div class="wizardTop"><div><div class="eyebrow">VIDÉOTHÈQUE BRICOACH</div><h2>🎬 Vidéos par métier</h2></div><button class="close" onclick="document.querySelector('#v26VideoHub').remove()">✕</button></div><label class="v26Search"><span>🔎</span><input id="v26VideoSearch" type="search" placeholder="Rechercher : joint, plafond, parquet, ragréage…" oninput="v26SearchVideos(this.value)"><button type="button" onclick="this.previousElementSibling.value='';v26SearchVideos('')">✕</button></label><div id="v26VideoHubBody"></div></div></div>`);v26RenderVideoHub();
}

/* Ajoute l'entrée dans le burger sans toucher au fonctionnement ni au placement des vidéos existantes. */
try{
  const v26BaseOpenMenu=v21OpenMenu;
  v21OpenMenu=function(){
    v26BaseOpenMenu();
    requestAnimationFrame(()=>{
      const links=document.querySelector('#v21Menu .v21DrawerLinks');if(!links||links.querySelector('.v26MenuVideos'))return;
      const buttons=[...links.querySelectorAll('button')];
      const anchor=buttons.find(b=>/Mon matériel/i.test(b.textContent));
      const b=document.createElement('button');b.className='v26MenuVideos';b.innerHTML='<span>🎬</span><b>Vidéos par métier</b><em>›</em>';b.onclick=()=>v21MenuAction(()=>v26OpenVideoHub());
      if(anchor)links.insertBefore(b,anchor);else links.appendChild(b);
    });
  };
}catch(_){}

requestAnimationFrame(()=>{try{v21PatchNavigation?.()}catch(_){}});
