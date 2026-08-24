const V14_ROOM_CHOICES=['Salle de bain','Cuisine','Salon / séjour','Chambre','WC','Entrée / couloir','Bureau','Buanderie','Garage','Terrasse','Façade / extérieur'];
const V14_WORKS=['Carrelage','Peinture','Sol / parquet','Placo / isolation'];
const V14_PROJECT_TYPES=['Rénovation complète','Rafraîchissement','Création / neuf'];
const v14BaseOpenLocalQuote=window.openLocalQuote;

function v14Id(){return Date.now()+Math.floor(Math.random()*10000)}
function v14Clone(o){return JSON.parse(JSON.stringify(o))}
function v14WorkDefaults(category,room=''){
  const wet=/Salle de bain|WC|Buanderie/i.test(room);
  const details={scope:category==='Peinture'?'Murs + plafond':'Sol + murs',tileFormat:'60 × 60',support:'Chape / ciment',tilePose:'Droite',removeExisting:false,wetArea:wet,paintState:'Petites reprises',paintFinish:'Velours',floorInstall:'Flottante',floorProduct:'Stratifié',placoWork:'Cloison',plateType:wet?'Hydrofuge':'BA13 standard',insulation:'Sans isolant'};
  return {id:v14Id(),category,area:0,range:'Standard',level:'Débutant',details,steps:[],materials:[]};
}
function v14Location(name){return {id:v14Id(),name,length:0,width:0,height:2.5,openings:0,works:[]}}
function v14LegacyLocations(p){
  if(Array.isArray(p.locations)&&p.locations.length)return p.locations;
  const loc=v14Location(p.room&&p.room!=='Pièce non précisée'?p.room:'Pièce principale');
  const work=v14WorkDefaults(p.category||'Carrelage',loc.name);
  work.area=Number(p.area)||0;work.range=p.range||'Standard';work.level=p.level||'Débutant';work.details={...work.details,...(p.details||{})};work.steps=v14Clone(p.steps||[]);work.materials=v14Clone(p.materials||[]);loc.works=[work];return [loc];
}
function v14SyncProject(p){
  p.locations=v14LegacyLocations(p);
  const works=p.locations.flatMap(l=>l.works||[]);
  works.forEach(w=>{w.details=ensureWizardDetails({...w.details});w.steps=w.steps?.length?w.steps:buildSteps(w.category,'',w.details);w.materials=buildMaterials(w.category,w.area,w.details)});
  const first=works[0]||v14WorkDefaults('Carrelage');
  p.category=first.category;p.room=p.locations.length===1?p.locations[0].name:`${p.locations.length} lieux`;
  p.area=Math.round(works.reduce((s,w)=>s+(Number(w.area)||0),0)*10)/10;
  p.level=works.length&&works.every(w=>w.level===works[0].level)?works[0].level:'Mixte';
  p.range=works.length&&works.every(w=>w.range===works[0].range)?works[0].range:'Mixte';
  p.steps=[];p.materials=[];
  p.locations.forEach(l=>(l.works||[]).forEach(w=>{
    (w.steps||[]).forEach(s=>p.steps.push([`${l.name} · ${w.category} — ${s[0]}`,s[1]?1:0]));
    (w.materials||[]).forEach(m=>p.materials.push([`${l.name} · ${w.category} · ${m[0]}`,m[1],m[2]||0]));
  }));
  return p;
}
function v14LocationFloor(l){return Math.max(0,(Number(l.length)||0)*(Number(l.width)||0))}
function v14LocationWalls(l){return Math.max(0,2*((Number(l.length)||0)+(Number(l.width)||0))*(Number(l.height)||0)-(Number(l.openings)||0))}
function v14SuggestedArea(l,w){
  const floor=v14LocationFloor(l),walls=v14LocationWalls(l),ceiling=floor,d=w.details||{};
  if(!floor&&!walls)return 0;
  if(w.category==='Carrelage')return d.scope==='Sol'?floor:d.scope==='Murs'?walls:floor+walls;
  if(w.category==='Peinture')return d.scope==='Murs'?walls:d.scope==='Plafond'?ceiling:walls+ceiling;
  if(w.category==='Sol / parquet')return floor;
  return walls;
}
function v14EstimateWork(w){
  try{return technicalEstimate({category:w.category,area:w.area,range:w.range==='Mixte'?'Standard':w.range,details:w.details})}catch(_){return 0}
}
function v14ProjectEstimate(p){return (p.locations||[]).flatMap(l=>l.works||[]).reduce((s,w)=>s+v14EstimateWork(w),0)}
function v14ProjectProgress(p){const works=(p.locations||[]).flatMap(l=>l.works||[]),steps=works.flatMap(w=>w.steps||[]);return steps.length?Math.round(steps.filter(s=>s[1]).length/steps.length*100):0}

function v14NewWizard(category=null){return {version:14,step:1,editId:null,title:'',projectType:'Rénovation complète',selectedRooms:[],locations:[],detailIndex:0,presetCategory:category||null}}
function openWizard(category=null,editId=null){
  if(editId){const p=projects.find(x=>x.id===editId);if(!p)return;const mp=v14SyncProject(v14Clone(p));wizard={version:14,step:1,editId:p.id,title:mp.title||'',projectType:mp.projectType||'Rénovation complète',selectedRooms:mp.locations.map(l=>l.name),locations:mp.locations,detailIndex:0,presetCategory:null};}
  else wizard=v14NewWizard(category);
  renderWizard();
}
function closeWizard(){wizard=null;document.querySelector('#wizardModal')?.remove()}
function v14Set(key,val){wizard[key]=val;renderWizard()}
function v14SetInput(key,val){wizard[key]=val}
function v14ToggleRoom(name){
  const i=wizard.selectedRooms.indexOf(name);if(i>=0)wizard.selectedRooms.splice(i,1);else wizard.selectedRooms.push(name);renderWizard();
}
function v14AddCustomRoom(){const el=document.getElementById('v14CustomRoom'),name=(el?.value||'').trim();if(!name)return;if(!wizard.selectedRooms.includes(name))wizard.selectedRooms.push(name);renderWizard()}
function v14SyncLocations(){
  const old=wizard.locations||[];wizard.locations=wizard.selectedRooms.map(name=>old.find(l=>l.name===name)||v14Location(name));
  if(wizard.presetCategory&&wizard.locations[0]&&!wizard.locations[0].works.length)wizard.locations[0].works.push(v14WorkDefaults(wizard.presetCategory,wizard.locations[0].name));
}
function v14SetLocation(locIndex,key,val){wizard.locations[locIndex][key]=Number(val)||0;renderWizard()}
function v14ToggleWork(locIndex,category){
  const loc=wizard.locations[locIndex],i=loc.works.findIndex(w=>w.category===category);if(i>=0)loc.works.splice(i,1);else loc.works.push(v14WorkDefaults(category,loc.name));renderWizard();
}
function v14Queue(){return wizard.locations.flatMap((loc,li)=>(loc.works||[]).map((work,wi)=>({loc,li,work,wi})))}
function v14Current(){return v14Queue()[wizard.detailIndex]||null}
function v14SetWork(key,val,detail=false){const q=v14Current();if(!q)return;if(detail)q.work.details[key]=val;else q.work[key]=val;renderWizard()}
function v14UseSuggested(){const q=v14Current();if(!q)return;const s=v14SuggestedArea(q.loc,q.work);if(s>0)q.work.area=Math.round(s*10)/10;renderWizard()}
function v14ApplyAutoAreas(){wizard.locations.forEach(l=>(l.works||[]).forEach(w=>{if(!(Number(w.area)>0)){const s=v14SuggestedArea(l,w);if(s>0)w.area=Math.round(s*10)/10;}}))}
function v14WorksReady(){return wizard.locations.length>0&&wizard.locations.every(l=>(l.works||[]).length>0)}
function v14DetailsReady(){return v14Queue().every(q=>Number(q.work.area)>0)}

function nextW(){
  if(!wizard)return;
  if(wizard.step===1){if(!wizard.title.trim())wizard.title='Mon projet travaux';wizard.step=2;}
  else if(wizard.step===2){if(!wizard.selectedRooms.length)return;v14SyncLocations();wizard.step=3;}
  else if(wizard.step===3){if(!v14WorksReady())return;v14ApplyAutoAreas();wizard.detailIndex=0;wizard.step=4;}
  else if(wizard.step===4){const q=v14Queue();if(!q.length)return;if(!(Number(q[wizard.detailIndex].work.area)>0))return;if(wizard.detailIndex<q.length-1)wizard.detailIndex++;else wizard.step=5;}
  renderWizard();
}
function prevW(){
  if(!wizard)return;
  if(wizard.step===4&&wizard.detailIndex>0)wizard.detailIndex--;else if(wizard.step===5){wizard.step=4;wizard.detailIndex=Math.max(0,v14Queue().length-1);}else wizard.step=Math.max(1,wizard.step-1);renderWizard();
}
function v14EscAttr(v){return esc(v)}
function v14Choice(values,current,key,detail=true){return `<div class="v14ChoiceGrid">${values.map(v=>`<button class="v14Choice ${current===v?'selected':''}" onclick='v14SetWork("${key}",${JSON.stringify(v).replace(/'/g,'\\u0027')},${detail})'>${esc(v)}</button>`).join('')}</div>`}
function v14RangeChoices(w){
  const labels={Carrelage:{'Éco':'≤ 23,50 €/m²','Standard':'23,90–34,90 €/m²','Premium':'≥ 35 €/m²'},Peinture:{'Éco':'Entrée de gamme','Standard':'Bon rapport qualité / prix','Premium':'Haut de gamme'},'Sol / parquet':{'Éco':'≤ 15,99 €/m²','Standard':'16,50–34,90 €/m²','Premium':'≥ 35 €/m²'},'Placo / isolation':{'Éco':'≤ 3,60 €/m²','Standard':'4,50–7,50 €/m²','Premium':'≥ 7,60 €/m²'}}[w.category]||{};
  return `<div class="v14Ranges">${['Éco','Standard','Premium'].map(r=>`<button class="v14Range ${w.range===r?'selected':''}" onclick='v14SetWork("range",${JSON.stringify(r)},false)'><b>${r}</b><small>${esc(labels[r]||'')}</small></button>`).join('')}</div>`;
}
function v14CommonWork(q){const s=v14SuggestedArea(q.loc,q.work);return `<div class="v14WorkHeader"><div><span>${esc(q.loc.name)}</span><h3>${esc(q.work.category)}</h3></div><strong>Poste ${wizard.detailIndex+1}/${v14Queue().length}</strong></div><div class="v14MeasureSuggestion"><div><b>Surface du poste</b><small>${s>0?`Calcul d’après les mesures du lieu : ${s.toFixed(1)} m²`:'Pas assez de mesures pour calculer automatiquement.'}</small></div>${s>0?`<button class="btn soft" onclick="v14UseSuggested()">Utiliser ${s.toFixed(1)} m²</button>`:''}</div><div class="field"><label>Surface à traiter</label><div class="bigInput v14Area"><input type="number" min="0.5" step="0.5" value="${Number(q.work.area)||''}" oninput="v14Current().work.area=Number(this.value)||0"><span>m²</span></div></div><div class="field"><label>Gamme de produits</label>${v14RangeChoices(q.work)}</div><div class="field"><label>Niveau de l’utilisateur</label>${v14Choice(['Débutant','Bricoleur','Confirmé'],q.work.level,'level',false)}</div>`}
function v14CategoryDetails(q){const w=q.work,d=w.details||{};
  if(w.category==='Carrelage')return `<div class="v14DetailBlock"><label>Zones carrelées</label>${v14Choice(['Sol','Murs','Sol + murs'],d.scope,'scope')}<label>Format</label>${v14Choice(['30 × 60','60 × 60','60 × 120','80 × 80','120 × 120','Mosaïque'],d.tileFormat,'tileFormat')}<label>Support</label>${v14Choice(['Chape / ciment','Ancien carrelage','Béton','Placo hydro','Placo standard'],d.support,'support')}<label>Pose</label>${v14Choice(['Droite','Décalée','Diagonale'],d.tilePose,'tilePose')}<div class="v14Toggles"><label><input type="checkbox" ${d.removeExisting?'checked':''} onchange="v14SetWork('removeExisting',this.checked,true)"><span><b>Dépose de l’existant</b><small>Ajoute la dépose et l’évacuation.</small></span></label><label><input type="checkbox" ${d.wetArea?'checked':''} onchange="v14SetWork('wetArea',this.checked,true)"><span><b>Zone humide / douche</b><small>Ajoute le système d’étanchéité.</small></span></label></div></div>`;
  if(w.category==='Peinture')return `<div class="v14DetailBlock"><label>Surfaces</label>${v14Choice(['Murs','Plafond','Murs + plafond'],d.scope,'scope')}<label>État du support</label>${v14Choice(['Bon état','Petites reprises','Support abîmé / fissuré'],d.paintState,'paintState')}<label>Finition</label>${v14Choice(['Mat','Velours','Satiné'],d.paintFinish,'paintFinish')}</div>`;
  if(w.category==='Sol / parquet')return `<div class="v14DetailBlock"><label>Revêtement</label>${v14Choice(['Stratifié','Parquet contrecollé','PVC / vinyle'],d.floorProduct,'floorProduct')}<label>Type de pose</label>${v14Choice(['Flottante','Collée','Clipsée'],d.floorInstall,'floorInstall')}<label>Support</label>${v14Choice(['Chape / ciment','Ancien carrelage','Ancien parquet','OSB / bois'],d.support,'support')}<div class="v14Toggles"><label><input type="checkbox" ${d.removeExisting?'checked':''} onchange="v14SetWork('removeExisting',this.checked,true)"><span><b>Dépose de l’ancien sol</b><small>Intègre la dépose au planning.</small></span></label></div></div>`;
  return `<div class="v14DetailBlock"><label>Type de travaux</label>${v14Choice(['Cloison','Doublage mur','Faux plafond'],d.placoWork,'placoWork')}<label>Type de plaque</label>${v14Choice(['BA13 standard','Hydrofuge','Phonique','Feu'],d.plateType,'plateType')}<label>Isolation</label>${v14Choice(['Sans isolant','Laine de verre','Laine de roche','Fibre de bois'],d.insulation,'insulation')}</div>`;
}
function v14Step1(){return `<div class="v14Intro"><div class="v14IntroIcon">🏗️</div><h3>Commence par le projet global</h3><p>Un projet peut contenir plusieurs pièces et plusieurs métiers. Tu les configureras ensuite une par une.</p></div><div class="field"><label>Nom du projet</label><input value="${esc(wizard.title)}" placeholder="Ex : Rénovation appartement" oninput="v14SetInput('title',this.value)"></div><div class="field"><label>Nature du projet</label><div class="v14ChoiceGrid">${V14_PROJECT_TYPES.map(t=>`<button class="v14Choice ${wizard.projectType===t?'selected':''}" onclick='v14Set("projectType",${JSON.stringify(t)})'>${esc(t)}</button>`).join('')}</div></div>`}
function v14Step2(){return `<div class="v14Intro"><div class="v14IntroIcon">📍</div><h3>Sélectionne tous les lieux concernés</h3><p>Tu peux faire, par exemple, Salle de bain + Cuisine + Salon dans le même projet.</p></div><div class="v14RoomGrid">${V14_ROOM_CHOICES.map(r=>`<button class="v14Room ${wizard.selectedRooms.includes(r)?'selected':''}" onclick='v14ToggleRoom(${JSON.stringify(r)})'><span>${wizard.selectedRooms.includes(r)?'✓':'+'}</span>${esc(r)}</button>`).join('')}</div><div class="v14CustomRoom"><input id="v14CustomRoom" placeholder="Autre lieu : dressing, chambre enfant…"><button class="btn soft" onclick="v14AddCustomRoom()">Ajouter</button></div>${wizard.selectedRooms.length?`<div class="v14SelectedCount"><b>${wizard.selectedRooms.length} lieu${wizard.selectedRooms.length>1?'x':''} sélectionné${wizard.selectedRooms.length>1?'s':''}</b><span>${wizard.selectedRooms.map(esc).join(' · ')}</span></div>`:''}`}
function v14Step3(){return `<div class="v14Intro"><div class="v14IntroIcon">🧰</div><h3>Que fais-tu dans chaque lieu ?</h3><p>Choisis un ou plusieurs métiers par pièce et indique les mesures. Bricoach calculera ensuite les surfaces poste par poste.</p></div><div class="v14LocationList">${wizard.locations.map((l,li)=>`<section class="v14LocationCard"><div class="v14LocationTitle"><span>${li+1}</span><div><b>${esc(l.name)}</b><small>${l.works.length} poste${l.works.length>1?'s':''} sélectionné${l.works.length>1?'s':''}</small></div></div><div class="v14Dims"><label>Longueur<input type="number" step="0.1" min="0" value="${l.length||''}" placeholder="m" onchange="v14SetLocation(${li},'length',this.value)"></label><label>Largeur<input type="number" step="0.1" min="0" value="${l.width||''}" placeholder="m" onchange="v14SetLocation(${li},'width',this.value)"></label><label>Hauteur<input type="number" step="0.1" min="0" value="${l.height||2.5}" placeholder="m" onchange="v14SetLocation(${li},'height',this.value)"></label><label>Ouvertures<input type="number" step="0.1" min="0" value="${l.openings||''}" placeholder="m²" onchange="v14SetLocation(${li},'openings',this.value)"></label></div>${l.length&&l.width?`<div class="v14CalcHint">Sol : <b>${v14LocationFloor(l).toFixed(1)} m²</b>${l.height?` · Murs nets : <b>${v14LocationWalls(l).toFixed(1)} m²</b>`:''}</div>`:''}<div class="v14WorkPicker">${V14_WORKS.map(c=>`<button class="v14WorkPick ${l.works.some(w=>w.category===c)?'selected':''}" onclick='v14ToggleWork(${li},${JSON.stringify(c)})'><span>${meta[c]?.[2]||'🔧'}</span><b>${esc(c)}</b><small>${l.works.some(w=>w.category===c)?'Sélectionné':'Ajouter'}</small></button>`).join('')}</div>${!l.works.length?'<div class="v14ErrorHint">Choisis au moins un travail pour ce lieu.</div>':''}</section>`).join('')}</div>`}
function v14Step4(){const q=v14Current();if(!q)return '<div class="empty">Aucun poste à configurer.</div>';return `<div class="v14DetailNav">${v14Queue().map((x,i)=>`<button class="${i===wizard.detailIndex?'active':''} ${Number(x.work.area)>0?'done':''}" onclick="wizard.detailIndex=${i};renderWizard()"><span>${i+1}</span><small>${esc(x.loc.name)}</small><b>${esc(x.work.category)}</b></button>`).join('')}</div><div class="v14WorkEditor">${v14CommonWork(q)}${v14CategoryDetails(q)}</div>`}
function v14Step5(){
  const total=v14ProjectEstimate({locations:wizard.locations});return `<div class="v14SummaryHead"><div><span>PROJET PRÊT À ENREGISTRER</span><h3>${esc(wizard.title||'Mon projet travaux')}</h3><p>${esc(wizard.projectType)} · ${wizard.locations.length} lieu${wizard.locations.length>1?'x':''} · ${v14Queue().length} poste${v14Queue().length>1?'s':''}</p></div><strong>≈ ${total.toLocaleString('fr-FR')} €</strong></div><div class="v14SummaryLocations">${wizard.locations.map(l=>`<section><div class="v14SummaryLocTitle"><b>📍 ${esc(l.name)}</b><small>${l.length&&l.width?`${l.length} × ${l.width} × ${l.height||2.5} m`:''}</small></div>${l.works.map(w=>`<div class="v14SummaryWork"><div><b>${meta[w.category]?.[2]||'🔧'} ${esc(w.category)}</b><small>${Number(w.area).toFixed(1)} m² · ${esc(w.range)} · ${esc(w.level)}</small></div><strong>≈ ${v14EstimateWork(w).toLocaleString('fr-FR')} €</strong></div>`).join('')}</section>`).join('')}</div><div class="validationNote">✓ Rien n’est enregistré avant d’appuyer sur <b>${wizard.editId?'Enregistrer les modifications':'Créer et enregistrer'}</b>. Tu pourras ensuite modifier les lieux ou les postes.</div>`}
function renderWizard(){
  document.querySelector('#wizardModal')?.remove();if(!wizard)return;
  const labels=['Projet','Lieux','Travaux','Détails','Récapitulatif'];
  const body=[null,v14Step1,v14Step2,v14Step3,v14Step4,v14Step5][wizard.step]();
  const canNext=wizard.step===2?wizard.selectedRooms.length>0:wizard.step===3?v14WorksReady():wizard.step===4?(v14Current()&&Number(v14Current().work.area)>0):true;
  let nextLabel='Continuer →';if(wizard.step===3)nextLabel='Configurer les postes →';if(wizard.step===4)nextLabel=wizard.detailIndex<v14Queue().length-1?'Poste suivant →':'Voir le récapitulatif →';
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack v14Back" id="wizardModal"><div class="modal v14Wizard"><div class="wizardTop"><div><div class="eyebrow">CONFIGURATEUR BRICOACH</div><h2>${labels[wizard.step-1]}</h2></div><button class="close" onclick="closeWizard()">✕</button></div><div class="v14MainProgress">${labels.map((x,i)=>`<div class="${i+1<=wizard.step?'active':''}"><span>${i+1<wizard.step?'✓':i+1}</span><small>${x}</small></div>`).join('')}</div><div class="v14Body">${body}</div><div class="wizardFooter v14Footer">${wizard.step>1?'<button class="btn soft" onclick="prevW()">← Retour</button>':'<span></span>'}${wizard.step<5?`<button class="btn primary" ${canNext?'':'disabled'} onclick="nextW()">${nextLabel}</button>`:`<button class="btn primary" onclick="finishWizard()">✓ ${wizard.editId?'Enregistrer les modifications':'Créer et enregistrer'}</button>`}</div></div></div>`);
}
function finishWizard(){
  if(!wizard||!v14DetailsReady())return;
  const data={title:(wizard.title||'Mon projet travaux').trim(),projectType:wizard.projectType,locations:v14Clone(wizard.locations),updatedAt:Date.now()};
  data.locations.forEach(l=>l.works.forEach(w=>{w.steps=buildSteps(w.category,l.name,w.details);w.materials=buildMaterials(w.category,w.area,w.details)}));
  if(wizard.editId){const i=projects.findIndex(p=>p.id===wizard.editId);if(i<0)return;projects[i]=v14SyncProject({...projects[i],...data});}
  else projects.unshift(v14SyncProject({id:v14Id(),createdAt:Date.now(),...data}));
  save();closeWizard();tab='projects';render();window.scrollTo({top:0,behavior:'smooth'});
}
function toggleWorkStep(projectId,locId,workId,stepIndex){const p=projects.find(x=>x.id===projectId),l=p?.locations?.find(x=>x.id===locId),w=l?.works?.find(x=>x.id===workId);if(!w||!w.steps?.[stepIndex])return;w.steps[stepIndex][1]=w.steps[stepIndex][1]?0:1;v14SyncProject(p);save();render()}
function projectCard(p){p=v14SyncProject(p);const pr=v14ProjectProgress(p),estimate=v14ProjectEstimate(p);return `<div class="card projectCard v14ProjectCard"><div class="projectMedia compact"><img src="${img(p.category)}" loading="lazy" alt="${esc(p.category)}"><span class="projectMediaShade"></span><div class="projectMediaTitle"><span class="pill">${esc(p.projectType||'Projet travaux')}</span><h3>${esc(p.title)}</h3></div></div><div class="projectBody"><div class="v14ProjectStats"><span><b>${p.locations.length}</b> lieu${p.locations.length>1?'x':''}</span><span><b>${p.locations.flatMap(l=>l.works).length}</b> poste${p.locations.flatMap(l=>l.works).length>1?'s':''}</span><span><b>${p.area}</b> m² traités</span><span><b>${estimate.toLocaleString('fr-FR')} €</b> estimés</span></div><div class="sectionHead"><span class="muted">Avancement global</span><b>${pr}%</b></div><div class="progress"><span style="width:${pr}%"></span></div><div class="v14ProjectLocations">${p.locations.map(l=>`<details><summary><span>📍</span><b>${esc(l.name)}</b><small>${l.works.length} poste${l.works.length>1?'s':''}</small></summary><div>${l.works.map(w=>`<div class="v14ProjectWork"><div class="v14ProjectWorkHead"><span>${meta[w.category]?.[2]||'🔧'}</span><div><b>${esc(w.category)}</b><small>${Number(w.area).toFixed(1)} m² · ${esc(w.range)}</small></div><strong>${w.steps?.length?Math.round(w.steps.filter(s=>s[1]).length/w.steps.length*100):0}%</strong></div><div class="steps">${(w.steps||[]).map((s,i)=>`<button class="step" onclick="toggleWorkStep(${p.id},${l.id},${w.id},${i})"><span class="dot ${s[1]?'done':''}">${s[1]?'✓':i+1}</span>${esc(s[0])}</button>`).join('')}</div></div>`).join('')}</div></details>`).join('')}</div><div class="projectActions projectActions3"><button class="btn soft" onclick="openWizard(null,${p.id})">✏️ Modifier</button><button class="btn soft" onclick="openLocalQuote(${p.id})">🧾 Chiffrage</button><button class="btn dangerBtn" onclick="askDelete(${p.id})">🗑️ Supprimer</button></div></div></div>`}
function featuredProject(p){p=v14SyncProject(p);return `<div class="card project featuredProject"><div class="projectMedia"><img src="${img(p.category)}" alt="${esc(p.category)}"><span class="projectMediaShade"></span><div class="projectMediaTitle"><span class="pill">${p.locations.length} lieu${p.locations.length>1?'x':''}</span><h3>${esc(p.title)}</h3></div></div><div class="projectBody"><div class="sectionHead"><div><div class="muted small">${p.locations.map(l=>esc(l.name)).join(' · ')}</div><b>${v14ProjectProgress(p)}% terminé</b></div><button class="btn soft" onclick="go('projects')">Continuer →</button></div><div class="progress"><span style="width:${v14ProjectProgress(p)}%"></span></div><div class="v14MiniWorks">${p.locations.flatMap(l=>l.works.map(w=>`<span>${meta[w.category]?.[2]||'🔧'} ${esc(l.name)} · ${esc(w.category)}</span>`)).slice(0,5).join('')}</div></div></div><div class="card stats"><h3>Vue rapide</h3><div class="metric"><span class="muted">📍 Lieux</span><b>${p.locations.length}</b></div><div class="metric"><span class="muted">🧰 Postes</span><b>${p.locations.flatMap(l=>l.works).length}</b></div><div class="metric"><span class="muted">€ Estimation</span><b>${v14ProjectEstimate(p).toLocaleString('fr-FR')} €</b></div></div>`}

async function v14OpenWorkQuote(projectId,locId,workId){const p=projects.find(x=>x.id===projectId),l=p?.locations?.find(x=>x.id===locId),w=l?.works?.find(x=>x.id===workId);if(!p||!l||!w)return;document.querySelector('#quoteModal')?.remove();const tmpId=-v14Id(),tmp={id:tmpId,title:`${p.title} — ${l.name} — ${w.category}`,category:w.category,room:l.name,area:w.area,range:w.range,level:w.level,details:w.details,steps:w.steps,materials:w.materials};projects.unshift(tmp);try{await v14BaseOpenLocalQuote(tmpId)}finally{projects=projects.filter(x=>x.id!==tmpId)}}
async function openLocalQuote(id){const p=projects.find(x=>x.id===id);if(!p)return;if(!p.locations?.length)return v14BaseOpenLocalQuote(id);const all=p.locations.flatMap(l=>(l.works||[]).map(w=>({l,w})));if(all.length===1)return v14OpenWorkQuote(id,all[0].l.id,all[0].w.id);document.querySelector('#quoteModal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="quoteModal"><div class="modal quoteModal v14QuoteChooser"><div class="wizardTop"><div><div class="eyebrow">CHIFFRAGE PAR POSTE</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#quoteModal').remove()">✕</button></div><p class="muted">Choisis le lieu et le poste à chiffrer. Cela évite de mélanger un carrelage Premium de salle de bain avec une peinture Éco de chambre.</p><div class="v14QuoteLocations">${p.locations.map(l=>`<section><h3>📍 ${esc(l.name)}</h3>${l.works.map(w=>`<button onclick="v14OpenWorkQuote(${p.id},${l.id},${w.id})"><span>${meta[w.category]?.[2]||'🔧'}</span><div><b>${esc(w.category)}</b><small>${Number(w.area).toFixed(1)} m² · ${esc(w.range)}</small></div><strong>Chiffrer →</strong></button>`).join('')}</section>`).join('')}</div></div></div>`)}

try{projects=projects.map(p=>v14SyncProject(p));save();render()}catch(e){console.error('V14 migration',e)}
