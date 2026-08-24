const $ = s => document.querySelector(s);
const STORAGE_KEY = 'bricoach-projects-v9';
const CLEAN_MARKER = 'bricoach-storage-clean-v9';

try {
  if (!localStorage.getItem(CLEAN_MARKER)) {
    localStorage.removeItem('bricoach-projects');
    localStorage.setItem(CLEAN_MARKER, '1');
  }
} catch (_) {}

const heroImg='https://images.unsplash.com/photo-1763485956292-6fb531f01b0c?auto=format&fit=crop&w=1800&q=85';
const diagImg='https://images.unsplash.com/photo-1543525469-65b61cc2bc06?auto=format&fit=crop&w=1400&q=85';
const images={
  Carrelage:'https://images.unsplash.com/photo-1782805153077-0e348cc5409d?auto=format&fit=crop&w=1400&q=85',
  Peinture:'https://images.unsplash.com/photo-1693985120993-e9b203ce7631?auto=format&fit=crop&w=1400&q=85',
  'Sol / parquet':'https://images.unsplash.com/photo-1743385199973-0f867a26c833?auto=format&fit=crop&w=1400&q=85',
  'Placo / isolation':'https://images.unsplash.com/photo-1768321902114-12b1777549a6?auto=format&fit=crop&w=1400&q=85'
};
const meta={
  Carrelage:['Carrelage','Préparation, calepinage, pose et joints.','🧱'],
  Peinture:['Peinture','Préparer, protéger et appliquer dans le bon ordre.','🎨'],
  'Sol / parquet':['Sol / parquet','Sous-couche, pose et finitions.','🪵'],
  'Placo / isolation':['Placo / isolation','Rails, isolant, plaques et bandes.','🧰']
};
const rooms=['Salle de bain','Cuisine','Salon','Chambre','WC','Entrée / couloir','Terrasse','Autre'];
const levels=[['Débutant','Je découvre','🌱'],['Bricoleur','Je fais déjà quelques travaux','🔧'],['Confirmé','Je suis à l’aise techniquement','🛠️']];
const ranges=[['Éco','Priorité au budget','€'],['Standard','Bon rapport qualité / prix','€€'],['Premium','Finitions et produits haut de gamme','€€€']];

let projects=[];
try { projects=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]')||[]; } catch(_) { projects=[]; }
let tab='home', photo='', diagnosed=false, problem='Humidité / moisissure';
let messages=[['bot','Bonjour 👋 Je suis ton Coach chantier. Pose-moi une question sur ton projet, les matériaux ou l’ordre des travaux.']];
let wizard=null;

const nav=[['home','🏠','Accueil'],['projects','📋','Chantiers'],['calc','🧮','Calculs'],['diagnostic','📸','Photo'],['coach','💬','Coach']];

function esc(v='') { return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function progress(p){return p.steps?.length?Math.round(p.steps.filter(x=>x[1]).length/p.steps.length*100):0}
function img(cat){return images[cat]||heroImg}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(projects))}
function go(t){tab=t;render();window.scrollTo({top:0,behavior:'smooth'})}

function shell(content){return `<div class="shell"><aside class="side"><div class="brand"><span class="logo">🔨</span>Bricoach</div><div class="tag">Ton chantier, étape par étape</div><div class="nav">${nav.map(n=>`<button class="${tab===n[0]?'active':''}" onclick="go('${n[0]}')"><span>${n[1]}</span>${n[2]}</button>`).join('')}</div><div class="sideFoot"><b>💡 Conseil du Coach</b><br>Un chantier n'est enregistré qu'après ta validation finale.</div></aside><main class="main"><div class="top"><div><div class="eyebrow">MON COACH TRAVAUX</div><h1>${tab==='home'?'Bonjour 👋':nav.find(n=>n[0]===tab)[2]}</h1></div><div class="avatar">BC</div></div>${content}</main><nav class="bottom">${nav.map(n=>`<button class="${tab===n[0]?'active':''}" onclick="go('${n[0]}')"><span>${n[1]}</span>${n[2]}</button>`).join('')}</nav></div>`}

function home(){
  let p=projects[0];
  return `<section class="hero"><div class="heroCopy"><div class="eyebrow heroEye">TON CHANTIER, BIEN ACCOMPAGNÉ</div><h2>Planifie. Réalise.<br><span>Profite.</span></h2><p>Décris ton projet et Bricoach te prépare un chantier structuré : ordre des travaux, quantités, budget et liste de courses.</p><div class="heroActions"><button class="btn primary" onclick="openWizard()">＋ Démarrer un chantier</button><button class="btn glass" onclick="go('diagnostic')">📸 J’ai un problème</button></div><div class="heroTrust"><span>✓ Enregistrement après validation</span><span>✓ Modification possible</span><span>✓ Suppression à tout moment</span></div></div><div class="heroVisual"><img src="${heroImg}" alt="Rénovation intérieure Bricoach"><div class="heroFloat"><span class="floatIcon">✓</span><div><b>${projects.length} chantier${projects.length>1?'s':''} en cours</b><small>${projects.length?'Reprends exactement où tu t’es arrêté.':'Aucun projet enregistré pour le moment.'}</small></div></div></div></section>
  <section class="sectionBlock"><div class="sectionTitle"><div><div class="eyebrow">CHOISIS TON PROJET</div><h2>Un accompagnement adapté au chantier</h2></div><div class="muted">Chaque métier a ses propres étapes, calculs et conseils.</div></div><div class="tradeGrid">${Object.entries(meta).map(([cat,m])=>`<button class="tradeCard" onclick="openWizard('${cat}')"><img src="${img(cat)}" loading="lazy" alt="${m[0]}"><span class="tradeShade"></span><span class="tradeText"><b>${m[0]}</b><small>${m[1]}</small></span></button>`).join('')}</div></section>
  <div class="grid"><div class="card quick visualQuick" onclick="go('diagnostic')"><img src="${diagImg}" loading="lazy" alt="Diagnostic chantier"><div class="quickOverlay"><div class="quickIcon">📸</div><div><h3>Montre-moi ton problème</h3><div>Photo + diagnostic guidé</div></div></div></div><div class="card quick" onclick="go('calc')"><div class="quickIcon">🧮</div><div><h3>Calculer mes matériaux</h3><div class="muted">Quantités, pertes et liste de courses</div></div></div><div class="card quick" onclick="go('coach')"><div class="quickIcon">💬</div><div><h3>Demander au Coach</h3><div class="muted">Une question sur ton chantier ?</div></div></div>${p?featuredProject(p):''}</div>`;
}

function featuredProject(p){return `<div class="card project featuredProject"><div class="projectMedia"><img src="${img(p.category)}" alt="${esc(p.category)}"><span class="projectMediaShade"></span><div class="projectMediaTitle"><span class="pill">${esc(p.category)}</span><h3>${esc(p.title)}</h3></div></div><div class="projectBody"><div class="sectionHead"><div><div class="muted small">CHANTIER PRIORITAIRE</div><b>${progress(p)}% terminé</b></div><button class="btn soft" onclick="go('projects')">Continuer →</button></div><div class="progress"><span style="width:${progress(p)}%"></span></div><div class="steps">${p.steps.slice(0,4).map((s,i)=>`<div class="step"><span class="dot ${s[1]?'done':''}">${s[1]?'✓':i+1}</span>${esc(s[0])}</div>`).join('')}</div></div></div><div class="card stats"><h3>Vue rapide</h3><div class="metric"><span class="muted">⏱ Avancement</span><b>${progress(p)}%</b></div><div class="metric"><span class="muted">€ Budget</span><b>${p.budget||0} €</b></div><div class="metric"><span class="muted">☑ Étapes</span><b>${p.steps.filter(x=>x[1]).length}/${p.steps.length}</b></div></div>`}

function projectsPage(){
  if(!projects.length) return `<div class="sectionHead pageTitle"><div><h2>Mes chantiers</h2><div class="muted">Aucun chantier enregistré.</div></div><button class="btn primary" onclick="openWizard()">＋ Nouveau chantier</button></div><div class="card emptyProjects"><div class="emptyIcon">📋</div><h3>Ton espace chantier est vide</h3><p class="muted">Commence un projet et valide la dernière étape pour l’enregistrer ici.</p><button class="btn primary" onclick="openWizard()">Créer mon premier chantier</button></div>`;
  return `<div class="sectionHead pageTitle"><div><h2>Mes chantiers</h2><div class="muted">Enregistrés : ${projects.length}. Tu peux les modifier ou les supprimer.</div></div><button class="btn primary" onclick="openWizard()">＋ Nouveau chantier</button></div><div class="cards2">${projects.map(p=>projectCard(p)).join('')}</div>`;
}

function projectCard(p){return `<div class="card projectCard"><div class="projectMedia compact"><img src="${img(p.category)}" loading="lazy" alt="${esc(p.category)}"><span class="projectMediaShade"></span><div class="projectMediaTitle"><span class="pill">${esc(p.category)}</span><h3>${esc(p.title)}</h3></div></div><div class="projectBody"><div class="projectMeta"><span>${esc(p.room||'Pièce non précisée')}</span><span>${Number(p.area||0)} m²</span><span>${esc(p.level||'')}</span></div><div class="sectionHead"><span class="muted">Budget ${p.budget||0} € · ${esc(p.range||'Standard')}</span><b>${progress(p)}%</b></div><div class="progress"><span style="width:${progress(p)}%"></span></div><div class="steps">${p.steps.map((s,i)=>`<button class="step" onclick="toggleStep(${p.id},${i})"><span class="dot ${s[1]?'done':''}">${s[1]?'✓':i+1}</span>${esc(s[0])}</button>`).join('')}</div><div class="projectActions"><button class="btn soft" onclick="openWizard(null,${p.id})">✏️ Modifier</button><button class="btn dangerBtn" onclick="askDelete(${p.id})">🗑️ Supprimer</button></div></div></div>`}

function toggleStep(id,i){let p=projects.find(x=>x.id===id);if(!p)return;p.steps[i][1]=p.steps[i][1]?0:1;save();render()}

function calcPage(){return `<div class="pageTitle"><h2>Calculateur matériaux</h2><div class="muted">Une estimation simple et transparente.</div></div><div class="cards2"><div class="card calcCard"><div class="calcCover"><img src="${images.Carrelage}" alt="Carrelage"></div><h3>Calcul express carrelage</h3><div class="field"><label>Surface nette (m²)</label><input id="surface" type="number" value="20" oninput="recalc()"></div><div class="field"><label>Marge de perte (%)</label><input id="loss" type="number" value="10" oninput="recalc()"></div><div id="calcResult" class="diagnostic"></div></div><div class="card"><h3>Listes de courses</h3>${projects.length?projects.map(p=>`<div class="shopping"><b>${esc(p.title)}</b>${(p.materials||[]).map((m,i)=>`<label class="shopItem ${m[2]?'done':''}"><input type="checkbox" ${m[2]?'checked':''} onchange="toggleMat(${p.id},${i})"><span>${esc(m[0])}</span><b>${esc(m[1])}</b></label>`).join('')}</div>`).join(''):'<div class="empty">Crée et enregistre un chantier pour obtenir sa liste de courses.</div>'}</div></div>`}
function recalc(){let s=Number($('#surface')?.value||20),l=Number($('#loss')?.value||10),order=s*(1+l/100),glue=Math.ceil(s/5),el=$('#calcResult');if(el)el.innerHTML=`<b>À commander : ${order.toFixed(1)} m²</b><br><span class="muted">Colle estimative : ${glue} sacs de 25 kg. À ajuster selon format, support et rendement fabricant.</span>`}
function toggleMat(id,i){let p=projects.find(x=>x.id===id);if(!p||!p.materials?.[i])return;p.materials[i][2]=p.materials[i][2]?0:1;save();render()}

function diagPage(){return `<div class="pageTitle"><h2>📸 Montre-moi ton chantier</h2><div class="muted">Ajoute une photo puis choisis le type de problème.</div></div><div class="diagHero"><img src="${diagImg}" alt="Diagnostic chantier"><div><div class="eyebrow">ASSISTANCE CHANTIER</div><h3>Un problème ? Commence par observer avant de réparer.</h3><p>Bricoach structure les vérifications et te signale les situations où un professionnel est préférable.</p></div></div><div class="cards2"><div class="card"><div class="upload"><div class="camera">📷</div><h3>Prendre ou ajouter une photo</h3><input type="file" accept="image/*" capture="environment" onchange="loadPhoto(event)">${photo?`<img class="preview" src="${photo}">`:''}</div><div class="field"><label>Type de problème</label><select onchange="problem=this.value;diagnosed=false"><option>Humidité / moisissure</option><option>Fissure</option><option>Carrelage décollé</option><option>Fuite d’eau</option><option>Électricité</option></select></div><button class="btn primary full" ${photo?'':'disabled'} onclick="diagnosed=true;render()">✨ Analyser le problème</button></div><div class="card"><h3>Diagnostic guidé</h3>${diagnosed?diagnosticText():`<div class="empty">Le résultat apparaîtra ici après l’ajout d’une photo.</div>`}</div></div>`}
function loadPhoto(e){let f=e.target.files?.[0];if(!f)return;let r=new FileReader();r.onload=()=>{photo=r.result;diagnosed=false;render()};r.readAsDataURL(f)}
function diagnosticText(){let t='Contrôle recommandé',b='Observe la zone et identifie la cause avant toute réparation définitive.',danger=false;if(problem.includes('Humidité')){t='Traces compatibles avec un problème d’humidité';b='Vérifie si la trace augmente après la pluie, s’il existe une canalisation proche et si la ventilation est correcte.'}if(problem==='Fissure'){t='Fissure à qualifier';b='Mesure sa largeur et surveille son évolution. Une fissure active, large ou traversante mérite un avis professionnel.'}if(problem.includes('Carrelage')){t='Décollement possible';b='Teste doucement les carreaux voisins. S’ils bougent ou sonnent creux, contrôle le support et le collage.'}if(problem.includes('Fuite')){t='Suspicion de fuite';b='Coupe l’eau si la fuite est active et identifie l’origine avant toute remise en état.';danger=true}if(problem.includes('Électricité')){t='Intervention électrique';b='Coupe le circuit au tableau et ne démonte pas une installation sous tension.';danger=true}return `<div class="diagnostic ${danger?'danger':''}"><b>${danger?'⚠️':'🔎'} ${t}</b><p>${b}</p><div class="small">Diagnostic indicatif : ne remplace pas le contrôle d’un professionnel lorsqu’il existe un risque.</div></div>`}

function coachPage(){return `<div class="pageTitle"><h2>Coach chantier</h2><div class="muted">Le Coach utilise le contexte du chantier principal.</div></div><div class="card"><div class="chat" id="chat">${messages.map(m=>`<div class="bubble ${m[0]}">${esc(m[1])}</div>`).join('')}</div><form class="chatForm" onsubmit="coach(event)"><input id="msg" placeholder="Ex : quelle colle pour ma douche ?"><button class="btn primary">Envoyer</button></form></div>`}
function coach(e){e.preventDefault();let q=$('#msg').value.trim();if(!q)return;let p=projects[0],l=q.toLowerCase(),a='Avance étape par étape et vérifie les préconisations du fabricant.';if(!p)a='Crée d’abord un chantier pour que je puisse répondre avec son contexte.';else if(l.includes('colle'))a=`Pour ${p.category.toLowerCase()}, choisis la colle selon le support, le format et l’usage. Ton chantier fait ${p.area} m².`;else if(l.includes('étanch'))a='En douche, traite angles, jonctions et passages de tuyaux puis respecte le temps de séchage.';else if(l.includes('budget'))a=`Le budget enregistré pour « ${p.title} » est de ${p.budget} €. Prévois 10 à 15 % de marge.`;messages.push(['user',q],['bot',a]);render();setTimeout(()=>{let c=$('#chat');if(c)c.scrollTop=c.scrollHeight},0)}

function defaultWizard(category='Carrelage') {return {step:1,editId:null,category,room:'Salle de bain',title:'',area:10,level:'Débutant',budget:750,range:'Standard'};}
function openWizard(category=null,editId=null){
  if(editId){
    const p=projects.find(x=>x.id===editId); if(!p)return;
    wizard={step:1,editId:p.id,category:p.category,room:p.room||'Salle de bain',title:p.title||'',area:p.area||10,level:p.level||'Débutant',budget:p.budget||750,range:p.range||'Standard'};
  } else wizard=defaultWizard(category||'Carrelage');
  renderWizard();
}
function closeWizard(){wizard=null;document.querySelector('#wizardModal')?.remove()}
function setW(key,val){ if(!wizard)return; wizard[key]=val; renderWizard(); }
function setWInput(key,val){if(wizard)wizard[key]=val}
function nextW(){if(!wizard)return;if(wizard.step===2&&!wizard.title.trim())wizard.title=`${wizard.category} - ${wizard.room}`;wizard.step=Math.min(6,wizard.step+1);renderWizard()}
function prevW(){if(!wizard)return;wizard.step=Math.max(1,wizard.step-1);renderWizard()}

function renderWizard(){
  document.querySelector('#wizardModal')?.remove();
  const editing=!!wizard.editId;
  const labels=['Travaux','Pièce','Surface','Niveau','Budget','Validation'];
  let body='';
  if(wizard.step===1) body=`<div class="wizardChoices tradeChoices">${Object.entries(meta).map(([cat,m])=>`<button class="wizardChoice ${wizard.category===cat?'selected':''}" onclick="setW('category','${cat.replace(/'/g,"\\'")}')"><span class="choiceEmoji">${m[2]}</span><b>${m[0]}</b><small>${m[1]}</small></button>`).join('')}</div>`;
  if(wizard.step===2) body=`<div class="field"><label>Dans quelle pièce ?</label><div class="chipGrid">${rooms.map(r=>`<button class="choiceChip ${wizard.room===r?'selected':''}" onclick="setW('room','${r.replace(/'/g,"\\'")}')">${r}</button>`).join('')}</div></div><div class="field"><label>Nom du chantier</label><input value="${esc(wizard.title)}" placeholder="Ex : Salle de bain principale" oninput="setWInput('title',this.value)"></div>`;
  if(wizard.step===3) body=`<div class="wizardNumber"><span>📐</span><div><b>Surface à réaliser</b><small>Indique la surface approximative concernée par les travaux.</small></div></div><div class="bigInput"><input type="number" min="1" step="0.5" value="${wizard.area}" oninput="setWInput('area',Number(this.value)||1)"><span>m²</span></div><div class="wizardTip">💡 Tu pourras affiner les dimensions plus tard dans le calculateur métier.</div>`;
  if(wizard.step===4) body=`<div class="wizardChoices">${levels.map(l=>`<button class="wizardChoice ${wizard.level===l[0]?'selected':''}" onclick="setW('level','${l[0]}')"><span class="choiceEmoji">${l[2]}</span><b>${l[0]}</b><small>${l[1]}</small></button>`).join('')}</div>`;
  if(wizard.step===5) body=`<div class="field"><label>Budget cible</label><div class="moneyInput"><input type="number" min="0" step="50" value="${wizard.budget}" oninput="setWInput('budget',Number(this.value)||0)"><span>€</span></div></div><div class="field"><label>Gamme souhaitée</label><div class="wizardChoices rangeChoices">${ranges.map(r=>`<button class="wizardChoice ${wizard.range===r[0]?'selected':''}" onclick="setW('range','${r[0]}')"><span class="rangePrice">${r[2]}</span><b>${r[0]}</b><small>${r[1]}</small></button>`).join('')}</div></div>`;
  if(wizard.step===6) body=`<div class="summaryCard"><img src="${img(wizard.category)}" alt="${esc(wizard.category)}"><div class="summaryBody"><span class="pill">${esc(wizard.category)}</span><h3>${esc(wizard.title||`${wizard.category} - ${wizard.room}`)}</h3><div class="summaryGrid"><div><small>Pièce</small><b>${esc(wizard.room)}</b></div><div><small>Surface</small><b>${wizard.area} m²</b></div><div><small>Niveau</small><b>${esc(wizard.level)}</b></div><div><small>Budget</small><b>${wizard.budget} €</b></div><div><small>Gamme</small><b>${esc(wizard.range)}</b></div></div></div></div><div class="validationNote">✓ Le chantier ne sera enregistré qu’en appuyant sur <b>${editing?'Enregistrer les modifications':'Créer et enregistrer'}</b>.</div>`;
  const modal=`<div class="modalBack" id="wizardModal"><div class="modal wizardModal"><div class="wizardTop"><div><div class="eyebrow">${editing?'MODIFIER LE CHANTIER':'NOUVEAU CHANTIER'}</div><h2>${labels[wizard.step-1]}</h2></div><button class="close" onclick="closeWizard()">✕</button></div><div class="wizardProgress"><span style="width:${wizard.step/6*100}%"></span></div><div class="wizardSteps">${labels.map((x,i)=>`<span class="${i+1<=wizard.step?'active':''}">${i+1}</span>`).join('')}</div><div class="wizardBody">${body}</div><div class="wizardFooter">${wizard.step>1?`<button class="btn soft" onclick="prevW()">← Retour</button>`:'<span></span>'}${wizard.step<6?`<button class="btn primary" onclick="nextW()">Continuer →</button>`:`<button class="btn primary" onclick="finishWizard()">✓ ${editing?'Enregistrer les modifications':'Créer et enregistrer'}</button>`}</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',modal);
}

function buildSteps(category,room){
  const base={
    Carrelage:['Protection et préparation','Contrôle et préparation des supports','Traçage / calepinage','Préparation de la colle','Pose du carrelage','Joints et finitions'],
    Peinture:['Protection de la pièce','Lessivage / nettoyage','Rebouchage et ponçage','Sous-couche','Première couche','Deuxième couche et finitions'],
    'Sol / parquet':['Contrôle du support','Préparation / ragréage si besoin','Sous-couche','Calepinage','Pose du revêtement','Plinthes et finitions'],
    'Placo / isolation':['Traçage','Pose des rails','Pose des montants','Isolation','Pose des plaques','Bandes, enduit et ponçage']
  }[category]||['Préparation','Réalisation','Finitions'];
  let arr=[...base];
  if(category==='Carrelage' && /Salle de bain|WC/.test(room)) arr.splice(3,0,'Étanchéité des zones humides');
  return arr.map(x=>[x,0]);
}
function buildMaterials(category,area){
  area=Number(area)||1;
  if(category==='Carrelage') return [['Carrelage',`${(area*1.1).toFixed(1)} m²`,0],['Colle C2S1',`${Math.max(1,Math.ceil(area/5))} sacs de 25 kg`,0],['Joint',`${Math.max(2,Math.ceil(area*.25))} kg`,0],['Croisillons / nivelants',`${Math.ceil(area*18)} pièces`,0]];
  if(category==='Peinture') return [['Peinture finition',`${Math.max(1,Math.ceil(area*2/10))} pot(s) indicatif(s)`,0],['Sous-couche',`${Math.max(1,Math.ceil(area/10))} pot(s)`,0],['Enduit',`${Math.max(5,Math.ceil(area/10)*5)} kg`,0]];
  if(category==='Sol / parquet') return [['Revêtement',`${(area*1.08).toFixed(1)} m²`,0],['Sous-couche',`${Math.ceil(area)} m²`,0],['Plinthes','À mesurer au périmètre',0]];
  return [['Plaques de plâtre','À calculer selon murs',0],['Rails / montants','À calculer selon dimensions',0],['Isolant',`${Math.ceil(area)} m²`,0],['Vis + bandes + enduit','1 lot',0]];
}
function finishWizard(){
  if(!wizard)return;
  const title=(wizard.title||`${wizard.category} - ${wizard.room}`).trim();
  if(wizard.editId){
    const idx=projects.findIndex(x=>x.id===wizard.editId); if(idx<0)return;
    const old=projects[idx], sameCat=old.category===wizard.category && old.room===wizard.room;
    projects[idx]={...old,title,category:wizard.category,room:wizard.room,area:Number(wizard.area)||1,level:wizard.level,budget:Number(wizard.budget)||0,range:wizard.range,steps:sameCat?old.steps:buildSteps(wizard.category,wizard.room),materials:sameCat?old.materials:buildMaterials(wizard.category,wizard.area),updatedAt:Date.now()};
  } else {
    projects.unshift({id:Date.now(),title,category:wizard.category,room:wizard.room,area:Number(wizard.area)||1,level:wizard.level,budget:Number(wizard.budget)||0,range:wizard.range,steps:buildSteps(wizard.category,wizard.room),materials:buildMaterials(wizard.category,wizard.area),createdAt:Date.now()});
  }
  save(); closeWizard(); tab='projects'; render(); window.scrollTo({top:0,behavior:'smooth'});
}

function askDelete(id){
  const p=projects.find(x=>x.id===id); if(!p)return;
  document.querySelector('#deleteModal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="deleteModal"><div class="modal deleteModal"><div class="deleteIcon">🗑️</div><h2>Supprimer ce chantier ?</h2><p>« ${esc(p.title)} » sera supprimé de cet appareil. Cette action est définitive.</p><div class="deleteActions"><button class="btn soft" onclick="document.querySelector('#deleteModal').remove()">Annuler</button><button class="btn dangerBtn" onclick="deleteProject(${id})">Supprimer définitivement</button></div></div></div>`);
}
function deleteProject(id){projects=projects.filter(x=>x.id!==id);save();document.querySelector('#deleteModal')?.remove();render()}

function render(){
  let c=tab==='home'?home():tab==='projects'?projectsPage():tab==='calc'?calcPage():tab==='diagnostic'?diagPage():coachPage();
  const app=$('#app');if(app)app.innerHTML=shell(c);if(tab==='calc')setTimeout(recalc,0)
}
render();