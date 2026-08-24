/* Bricoach V24 — tutoriels accueil interactifs + vidéothèque Eric Le Carreleur */

const V24_ERIC_VIDEOS=[
  {id:'MDKfHF8xRE8',title:'Comment rattraper son sol avant la pose du carrelage ? Le ragréage',cat:'Support',tags:['support','ragréage','préparation','planéité']},
  {id:'0i9MYShEg14',title:"L’implantation du carrelage : par où commencer ?",cat:'Calepinage',tags:['calepinage','implantation','tracé','traçage']},
  {id:'KHwP5Zch2lI',title:'Étanchéité douche, bac prêt à carreler et cloison',cat:'Salle de bain',tags:['étanchéité','douche','salle de bain','support']},
  {id:'cB01kLork7c',title:'Pose du carrelage sol SDB et douche italienne',cat:'Salle de bain',tags:['pose','douche','salle de bain','sol']},
  {id:'yAXMN8BUJQc',title:'Carrelage complet d’une salle de bain de A à Z',cat:'Salle de bain',tags:['pose','salle de bain','joint','finition']},
  {id:'zIEKL6_p1vA',title:'Poser du carrelage grand format 80×80',cat:'Grand format',tags:['pose','grand format','80x80','autonivelant','pavilift','double encollage']},
  {id:'0j2JZe4EKQE',title:'Poser un carrelage grand format dans une maison neuve',cat:'Grand format',tags:['pose','grand format','support','maison neuve']},
  {id:'tIhM4z5by6Q',title:'Comment faire des joints de carrelage au sol',cat:'Joints',tags:['joint','joints','finition']},
  {id:'VeBsmYTyU7k',title:'Réaliser une étanchéité en terrasse avant carrelage',cat:'Terrasse',tags:['étanchéité','terrasse','extérieur']},
  {id:'IWm7zW2bA-s',title:'Poser du carrelage sur une terrasse extérieure',cat:'Terrasse',tags:['pose','terrasse','extérieur']}
];

function v24VideoThumb(v){return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
function v24VideoCard(v){return `<button class="v24VideoCard" onclick='v24OpenVideo(${JSON.stringify(v.id)})'><span class="v24VideoImg"><img src="${v24VideoThumb(v)}" alt="${esc(v.title)}" loading="lazy"><i>▶</i></span><span class="v24VideoText"><em>${esc(v.cat)}</em><b>${esc(v.title)}</b><small>Éric Le Carreleur</small></span></button>`}
function v24VideoById(id){return V24_ERIC_VIDEOS.find(v=>v.id===id)}
function v24OpenVideo(id){
  const v=v24VideoById(id);if(!v)return;
  document.querySelector('#v24VideoModal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v24VideoModal"><div class="modal v24VideoModal"><div class="wizardTop"><div><div class="eyebrow">DÉMONSTRATION VIDÉO</div><h2>${esc(v.title)}</h2></div><button class="close" onclick="document.querySelector('#v24VideoModal').remove()">✕</button></div><div class="v24Player"><iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div><div class="v24VideoMeta"><div><b>🎥 Éric Le Carreleur</b><small>${esc(v.cat)} · vidéo externe intégrée dans Bricoach</small></div><a class="btn soft" target="_blank" rel="noopener" href="https://www.youtube.com/watch?v=${v.id}">Ouvrir sur YouTube ↗</a></div><div class="v24EmbedNote">Si YouTube bloque la lecture intégrée sur ton appareil, utilise le bouton « Ouvrir sur YouTube ».</div></div></div>`);
}
function v24OpenVideoLibrary(){
  document.querySelector('#v24VideoLibrary')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v24VideoLibrary"><div class="modal v24VideoLibrary"><div class="wizardTop"><div><div class="eyebrow">VIDÉOTHÈQUE CARRELAGE</div><h2>🎬 Éric Le Carreleur</h2></div><button class="close" onclick="document.querySelector('#v24VideoLibrary').remove()">✕</button></div><p class="muted">Toutes les démonstrations actuellement référencées dans Bricoach. Elles restent hébergées sur YouTube et se lisent directement dans l’application quand l’intégration est autorisée.</p><div class="v24VideoGrid">${V24_ERIC_VIDEOS.map(v24VideoCard).join('')}</div><a class="btn soft full v24ChannelLink" target="_blank" rel="noopener" href="https://www.youtube.com/@EricLeCarreleur">Voir toute la chaîne Éric Le Carreleur ↗</a></div></div>`);
}

/* Depuis l'accueil, l'ancienne bibliothèque statique ouvre maintenant la vraie bibliothèque interactive. */
try{openTutorialLibrary=function(cat='Carrelage'){v22OpenStandalone(cat)}}catch(_){}

/* Ajouter les vidéos reliées à l'étape affichée dans la bibliothèque autonome. */
function v24RelatedVideos(cat,step=''){
  if(cat!=='Carrelage')return [];
  const s=String(step).toLowerCase();
  let vids=V24_ERIC_VIDEOS.filter(v=>v.tags.some(t=>s.includes(t)||t.includes(s)));
  if(/support|prépar|ragr|plan/.test(s))vids=V24_ERIC_VIDEOS.filter(v=>['MDKfHF8xRE8','0j2JZe4EKQE'].includes(v.id));
  else if(/calep|trac|implant/.test(s))vids=V24_ERIC_VIDEOS.filter(v=>v.id==='0i9MYShEg14');
  else if(/colle|encoll|poser|pose|autonivel|planéité|align/.test(s))vids=V24_ERIC_VIDEOS.filter(v=>['zIEKL6_p1vA','cB01kLork7c'].includes(v.id));
  else if(/joint|finition/.test(s))vids=V24_ERIC_VIDEOS.filter(v=>['tIhM4z5by6Q','yAXMN8BUJQc'].includes(v.id));
  else if(/étanch|douche/.test(s))vids=V24_ERIC_VIDEOS.filter(v=>['KHwP5Zch2lI','cB01kLork7c'].includes(v.id));
  if(!vids.length)vids=V24_ERIC_VIDEOS.slice(0,2);
  return vids.slice(0,2);
}
function v24InjectStandaloneVideos(){
  if(!v22LibraryState||v22LibraryState.cat!=='Carrelage')return;
  const detail=document.querySelector('#v22Standalone .v22StandaloneDetail');if(!detail||detail.querySelector('.v24Related'))return;
  const steps=v22Steps('Carrelage'),name=steps[v22LibraryState.active||0]||'',videos=v24RelatedVideos('Carrelage',name);
  const validate=detail.querySelector('button.full');
  const box=document.createElement('section');box.className='v24Related';box.innerHTML=`<div class="v24RelatedHead"><div><h4>🎥 Voir la démonstration</h4><small>Vidéos d’Éric Le Carreleur en rapport avec cette étape.</small></div><button class="v24AllVideos" onclick="v24OpenVideoLibrary()">Toutes les vidéos →</button></div><div class="v24RelatedGrid">${videos.map(v24VideoCard).join('')}</div>`;
  if(validate)detail.insertBefore(box,validate);else detail.appendChild(box);
}
try{
  const v24BaseStandalone=v22RenderStandalone;
  v22RenderStandalone=function(){v24BaseStandalone();requestAnimationFrame(v24InjectStandaloneVideos)};
}catch(_){}

/* Même vidéothèque dans l'onglet Tutoriels du menu burger. */
function v24InjectHubVideos(){
  const hub=document.querySelector('#v21TutorHub .v21TutorHub');if(!hub||hub.querySelector('.v24HubVideos'))return;
  const lib=hub.querySelector('.v22LibraryGrid');if(!lib)return;
  const section=document.createElement('section');section.className='v24HubVideos';section.innerHTML=`<div class="v24HubVideoHead"><div><h3>🎬 Vidéos Carrelage — Éric Le Carreleur</h3><p>Accès direct aux démonstrations : support, calepinage, salle de bain, grand format, joints et terrasse.</p></div><button class="btn soft" onclick="v24OpenVideoLibrary()">Voir toutes (${V24_ERIC_VIDEOS.length})</button></div><div class="v24HubVideoStrip">${V24_ERIC_VIDEOS.slice(0,5).map(v24VideoCard).join('')}</div>`;
  lib.insertAdjacentElement('afterend',section);
}
try{
  const v24BaseHub=v21OpenTutorialHub;
  v21OpenTutorialHub=function(){v24BaseHub();requestAnimationFrame(v24InjectHubVideos)};
}catch(_){}

requestAnimationFrame(()=>{try{v21PatchNavigation?.()}catch(_){}});
