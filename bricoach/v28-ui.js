/* Bricoach V28 — UX de complétion : outils + sous-tutoriels */
(function(){
/* Nouveaux métiers dans Mon matériel */
try{[['Plomberie / sanitaire','🚿'],['Électricité','⚡'],['Maçonnerie','🧱']].forEach(x=>{if(!V21_TOOL_CATS.some(y=>y[0]===x[0]))V21_TOOL_CATS.splice(V21_TOOL_CATS.length-1,0,x)})}catch(_){}

/* Libellé de métrique cohérent dans le configurateur */
try{const base=v14CommonWork;v14CommonWork=function(q){let h=base(q);if(q.work.category==='Plomberie / sanitaire')h=h.replace('Surface du poste','Longueur / métrique du poste').replace('<span>m²</span>','<span>m</span>');if(q.work.category==='Électricité')h=h.replace('Surface du poste','Nombre de points de référence').replace('<span>m²</span>','<span>pts</span>');return h}}catch(_){}

const V28_TUTOR_OPTIONS={
 'Plomberie / sanitaire':[
  ['Alimentation multicouche','🔵'],['Alimentation PER','🔴'],['Évacuation PVC','⬜'],['WC à poser','🚽'],['WC suspendu','🚽'],['Lavabo / vasque','🚰'],['Douche / receveur','🚿']
 ],
 'Électricité':[
  ['Prises de courant','🔌'],['Éclairage / interrupteurs','💡'],['Circuit spécialisé','⚡'],['Tableau électrique','🧰'],['Réseau RJ45','🌐']
 ],
 'Maçonnerie':[
  ['Dalle béton','⬛'],['Chape','▤'],['Ragréage','◻️'],['Mur en parpaings','🧱'],['Enduit ciment','🪣'],['Scellement / petit béton','🔩']
 ]
};
let v28TutorChoice={};
function detailsFor(cat,sub){const w=v14WorkDefaults(cat,'');if(cat==='Plomberie / sanitaire')w.details.plumbingType=sub;if(cat==='Électricité')w.details.electricType=sub;if(cat==='Maçonnerie')w.details.masonryType=sub;return w.details}
const stepBase=v22Steps;
v22Steps=function(cat){if(V28_TUTOR_OPTIONS[cat]){const sub=v28TutorChoice[cat]||V28_TUTOR_OPTIONS[cat][0][0];return buildSteps(cat,'',detailsFor(cat,sub)).map(x=>Array.isArray(x)?x[0]:x)}return stepBase(cat)};
const standaloneBase=v22OpenStandalone;
function v28LaunchStandalone(cat,sub){v28TutorChoice[cat]=sub;document.querySelector('#v28TutorChooser')?.remove();standaloneBase(cat);requestAnimationFrame(()=>{const title=document.querySelector('#v22Standalone .wizardTop h2');if(title)title.textContent=`${meta[cat]?.[2]||'🔧'} ${cat} — ${sub}`})}
window.v28LaunchStandalone=v28LaunchStandalone;
function v28OpenChooser(cat){document.querySelector('#v28TutorChooser')?.remove();const opts=V28_TUTOR_OPTIONS[cat]||[];document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v28TutorChooser"><div class="modal v28TutorChooser"><div class="wizardTop"><div><div class="eyebrow">TUTORIELS ${esc(cat.toUpperCase())}</div><h2>${meta[cat]?.[2]||'🔧'} Que veux-tu réaliser ?</h2></div><button class="close" onclick="document.querySelector('#v28TutorChooser').remove()">✕</button></div><p class="muted">Chaque intervention possède ses propres étapes, matériaux, contrôles et vidéos.</p><div class="v28TutorOptions">${opts.map(([n,i])=>`<button onclick='v28LaunchStandalone(${JSON.stringify(cat)},${JSON.stringify(n)})'><span>${i}</span><div><b>${esc(n)}</b><small>Ouvrir le tutoriel adapté à mon niveau</small></div><strong>›</strong></button>`).join('')}</div></div></div>`)}
window.v28OpenChooser=v28OpenChooser;
v22OpenStandalone=function(cat){if(V28_TUTOR_OPTIONS[cat])return v28OpenChooser(cat);return standaloneBase(cat)};

/* Le bouton Accueil ancien appelle openTutorialLibrary : même logique. */
try{const old=openTutorialLibrary;openTutorialLibrary=function(cat='Carrelage'){if(V28_TUTOR_OPTIONS[cat])return v28OpenChooser(cat);return old(cat)}}catch(_){}
})();