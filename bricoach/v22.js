/* Bricoach V22 — tutoriels accessibles sans chantier + retour Coach */

/* ---------- Retour depuis le Coach ---------- */
let v22PrevTab='home';
try{
  const v22BaseGo=go;
  go=function(t){
    if(t==='coach' && tab!=='coach') v22PrevTab=tab||'home';
    v22BaseGo(t);
    requestAnimationFrame(v22PatchCoachBack);
  };
}catch(_){}
function v22CloseCoach(){go(v22PrevTab&&v22PrevTab!=='coach'?v22PrevTab:'home')}
function v22PatchCoachBack(){
  const top=document.querySelector('.top');if(!top)return;
  top.querySelector('.v22CoachBack')?.remove();
  if(tab!=='coach')return;
  const actions=top.querySelector('.v21TopActions');
  const b=document.createElement('button');b.className='v22CoachBack';b.setAttribute('aria-label','Retour');b.innerHTML='✕';b.onclick=v22CloseCoach;
  if(actions)actions.insertAdjacentElement('afterbegin',b);else top.appendChild(b);
}

/* ---------- Bibliothèque tutoriels, même sans chantier ---------- */
const V22_TUTOR_DONE_KEY='bricoach-tutorial-library-v22';
let v22TutorDone={};
try{v22TutorDone=JSON.parse(localStorage.getItem(V22_TUTOR_DONE_KEY)||'{}')||{}}catch(_){v22TutorDone={}}
function v22SaveTutorDone(){try{localStorage.setItem(V22_TUTOR_DONE_KEY,JSON.stringify(v22TutorDone))}catch(_){}}
let v22LibraryState=null;

function v22Steps(cat){
  if(typeof v19TutorialSteps==='function')return v19TutorialSteps(cat);
  if(cat==='Carrelage')return ['Préparer le support','Réaliser l’étanchéité si nécessaire','Tracer et calepiner','Préparer la colle','Poser le carrelage','Utiliser le système autonivelant','Réaliser les joints','Faire les finitions'];
  if(cat==='Peinture')return ['Protéger','Préparer le support','Reboucher et poncer','Sous-couche','Réchampir','Première couche','Deuxième couche','Finitions'];
  if(cat==='Sol / parquet')return ['Contrôler le support','Acclimater le revêtement','Sous-couche','Calepinage','Pose','Coupes','Jeux périphériques','Plinthes'];
  return ['Tracer','Poser rails et montants','Mettre l’isolation','Poser les plaques','Contrôler le vissage','Poser les bandes','Enduire','Poncer'];
}
function v22GenericGuide(cat,name,level){
  const n=name.toLowerCase();
  const intros={
    'Peinture':'Travaille sur un support propre, sec et stable. La qualité de préparation conditionne directement la finition.',
    'Sol / parquet':'Contrôle la planéité, la propreté et l’humidité du support avant de commencer la pose.',
    'Placo / isolation':'Vérifie le traçage, l’aplomb, l’entraxe de l’ossature et la compatibilité des matériaux avant fermeture.'
  };
  let detail=intros[cat]||'Prépare la zone, contrôle le support et respecte l’ordre des opérations.';
  if(level==='Débutant')detail+=' Avance lentement, vérifie chaque étape avant de poursuivre et suis les indications du fabricant.';
  if(level==='Bricoleur')detail+=' Concentre-toi sur les contrôles clés et prépare tous les outils avant de démarrer.';
  if(level==='Confirmé')detail+=' Contrôle les tolérances, les raccords et les points singuliers avant d’enchaîner.';
  if(level==='Expert')detail+=' Va directement aux tolérances, compatibilités produits, points singuliers et contrôles critiques.';
  return {title:name,why:detail,beginner:detail,diy:detail,confirmed:detail,expert:detail,checks:['Support et zone contrôlés','Matériel prêt','Ordre des opérations respecté','Résultat vérifié avant l’étape suivante'],errors:['Aller trop vite','Négliger la préparation','Ignorer les temps de séchage ou prescriptions fabricant'],tools:cat==='Peinture'?['Protection','Rouleau / pinceau','Spatules','Aspirateur / ponceuse']:cat==='Sol / parquet'?['Mètre','Équerre','Scie / cutter','Kit de pose']:['Mètre / laser','Visseuse','Cisaille / cutter','Outils à enduire']};
}
function v22Guide(cat,name,level){
  if(cat==='Carrelage' && typeof v21GuideKey==='function' && typeof V21_TILE_GUIDES!=='undefined'){
    const key=v21GuideKey(name),g=V21_TILE_GUIDES[key]||V21_TILE_GUIDES.generic;
    if(g)return g;
  }
  return v22GenericGuide(cat,name,level);
}
function v22LevelText(g,level){
  if(typeof v21LevelDetail==='function')return v21LevelDetail(g,level);
  if(level==='Débutant')return g.beginner||g.why||'';
  if(level==='Expert')return g.expert||g.confirmed||g.why||'';
  if(level==='Confirmé')return g.confirmed||g.why||'';
  return g.diy||g.why||'';
}
function v22Done(cat,i){return !!(v22TutorDone[cat]&&v22TutorDone[cat][i])}
function v22ToggleDone(){
  if(!v22LibraryState)return;const {cat,active}=v22LibraryState;
  if(!v22TutorDone[cat])v22TutorDone[cat]={};v22TutorDone[cat][active]=!v22TutorDone[cat][active];v22SaveTutorDone();v22RenderStandalone();
}
function v22SelectStep(i){if(!v22LibraryState)return;v22LibraryState.active=i;v22RenderStandalone();requestAnimationFrame(()=>document.querySelector('#v22Standalone .v22StandaloneDetail')?.scrollIntoView({behavior:'smooth',block:'start'}))}
function v22StandaloneProgress(cat){const s=v22Steps(cat);return s.length?Math.round(s.filter((_,i)=>v22Done(cat,i)).length/s.length*100):0}
function v22RenderStandalone(){
  const body=document.getElementById('v22StandaloneBody');if(!body||!v22LibraryState)return;
  const {cat}=v22LibraryState,steps=v22Steps(cat),active=Math.min(v22LibraryState.active||0,Math.max(0,steps.length-1)),name=steps[active]||'Étape',level=typeof v18Level==='function'?v18Level(cat):'Bricoleur',g=v22Guide(cat,name,level),done=v22Done(cat,active),prog=v22StandaloneProgress(cat);
  body.innerHTML=`<div class="v22LibProgress"><div><b>Niveau ${esc(level)}</b><small>${prog}% de cette bibliothèque validé</small></div><div class="progress"><span style="width:${prog}%"></span></div></div><div class="v22StandaloneSteps">${steps.map((s,i)=>`<button class="${i===active?'active':''} ${v22Done(cat,i)?'done':''}" onclick="v22SelectStep(${i})"><span>${v22Done(cat,i)?'✓':i+1}</span><div><b>${esc(s)}</b><small>${v22Done(cat,i)?'Effectuée':'Voir le détail'}</small></div><em>›</em></button>`).join('')}</div><article class="v22StandaloneDetail"><div class="v21TutorDetailTitle"><span>${active+1}</span><div><h3>${esc(g.title||name)}</h3><p>${esc(g.why||'')}</p></div></div><div class="v21LevelBox"><b>${level==='Débutant'?'🌱':level==='Expert'?'🏆':level==='Confirmé'?'🛠️':'🔧'} Explication niveau ${esc(level)}</b><p>${esc(v22LevelText(g,level))}</p></div><div class="v21TutorCols"><div><h4>✓ À contrôler</h4>${(g.checks||[]).map(x=>`<p>✓ ${esc(x)}</p>`).join('')}</div><div><h4>⚠️ Erreurs à éviter</h4>${(g.errors||[]).map(x=>`<p>• ${esc(x)}</p>`).join('')}</div></div><div class="v21TutorTools"><h4>🧰 Outils / produits utiles</h4><div>${(g.tools||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>${cat==='Carrelage'&&typeof v21VideoBlock==='function'?v21VideoBlock(g):''}<button class="btn ${done?'soft':'primary'} full" onclick="v22ToggleDone()">${done?'↩ Marquer comme non terminée':'✓ J’ai effectué cette étape'}</button></article>`;
}
function v22OpenStandalone(cat){
  document.querySelector('#v21TutorHub')?.remove();document.querySelector('#v22Standalone')?.remove();v22LibraryState={cat,active:0};
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v22Standalone"><div class="modal v21TutorModal"><div class="wizardTop"><div><div class="eyebrow">BIBLIOTHÈQUE TUTORIELS</div><h2>${meta[cat]?.[2]||'🔧'} ${esc(cat)}</h2></div><button class="close" onclick="document.querySelector('#v22Standalone').remove()">✕</button></div><div id="v22StandaloneBody"></div></div></div>`);v22RenderStandalone();
}

function v21OpenTutorialHub(){
  document.querySelector('#v21TutorHub')?.remove();const rows=[];(projects||[]).forEach(p=>{try{v14SyncProject(p)}catch(_){};(p.locations||[]).forEach(l=>(l.works||[]).forEach(w=>rows.push({p,l,w})))});
  const cats=(typeof V14_WORKS!=='undefined'?V14_WORKS:['Carrelage','Peinture','Sol / parquet','Placo / isolation']);
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v21TutorHub"><div class="modal v21TutorHub"><div class="wizardTop"><div><div class="eyebrow">TUTORIELS</div><h2>Bibliothèque Bricoach</h2></div><button class="close" onclick="document.querySelector('#v21TutorHub').remove()">✕</button></div><div class="v22HubIntro"><b>Pas besoin de créer un chantier</b><span>Choisis un métier et consulte les étapes immédiatement. Le niveau de détail suit ton profil pour ce métier.</span></div><h3 class="v22HubTitle">Tutoriels par métier</h3><div class="v22LibraryGrid">${cats.map(c=>`<button onclick='v22OpenStandalone(${JSON.stringify(c)})'><span>${meta[c]?.[2]||'🔧'}</span><div><b>${esc(c)}</b><small>Niveau ${typeof v18Level==='function'?esc(v18Level(c)):'Bricoleur'} · ${v22StandaloneProgress(c)}% validé</small></div><strong>Ouvrir →</strong></button>`).join('')}</div>${rows.length?`<h3 class="v22HubTitle project">Tutoriels de mes chantiers</h3><div class="v21TutorHubList">${rows.map(x=>`<button onclick="document.querySelector('#v21TutorHub').remove();openAdaptiveTutorial(${x.p.id},${x.l.id},${x.w.id})"><span>${meta[x.w.category]?.[2]||'🔧'}</span><div><b>${esc(x.w.category)} · ${esc(x.l.name)}</b><small>${esc(x.p.title)} · ${v21TutorialProgress(x.w)}% effectué</small></div><strong>Ouvrir →</strong></button>`).join('')}</div>`:`<div class="v22NoProject"><span>📋</span><div><b>Aucun chantier enregistré</b><small>Ce n’est pas bloquant : la bibliothèque ci-dessus reste entièrement accessible.</small></div></div>`}</div></div>`);
}

requestAnimationFrame(()=>{v21PatchNavigation?.();v22PatchCoachBack()});
