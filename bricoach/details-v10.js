const detailConfig={
  Carrelage:{
    scopes:['Sol','Murs','Sol + murs'],
    formats:['30 × 60','60 × 60','60 × 120','80 × 80','120 × 120','Mosaïque','Autre'],
    supports:['Chape / ciment','Ancien carrelage','Béton','Placo hydro','Placo standard','Autre'],
    poses:['Droite','Décalée','Diagonale']
  },
  Peinture:{
    scopes:['Murs','Plafond','Murs + plafond'],
    states:['Bon état','Petites reprises','Support abîmé / fissuré'],
    finishes:['Mat','Velours','Satiné']
  },
  'Sol / parquet':{
    installs:['Flottante','Collée','Clipsée'],
    supports:['Chape / ciment','Ancien carrelage','Ancien parquet','OSB / bois','Autre'],
    products:['Stratifié','Parquet contrecollé','PVC / vinyle']
  },
  'Placo / isolation':{
    works:['Cloison','Doublage mur','Faux plafond'],
    plates:['BA13 standard','Hydrofuge','Phonique','Feu'],
    insulations:['Sans isolant','Laine de verre','Laine de roche','Fibre de bois']
  }
};

function ensureWizardDetails(w){
  if(!w)return w;
  w.scope=w.scope||'Sol + murs';
  w.tileFormat=w.tileFormat||'60 × 60';
  w.support=w.support||'Chape / ciment';
  w.tilePose=w.tilePose||'Droite';
  w.removeExisting=!!w.removeExisting;
  w.wetArea=w.wetArea!==false;
  w.paintState=w.paintState||'Petites reprises';
  w.paintFinish=w.paintFinish||'Velours';
  w.floorInstall=w.floorInstall||'Flottante';
  w.floorProduct=w.floorProduct||'Stratifié';
  w.placoWork=w.placoWork||'Cloison';
  w.plateType=w.plateType||'BA13 standard';
  w.insulation=w.insulation||'Sans isolant';
  return w;
}

function defaultWizard(category='Carrelage'){
  return ensureWizardDetails({step:1,editId:null,category,room:'Salle de bain',title:'',area:10,level:'Débutant',budget:750,range:'Standard'});
}

function openWizard(category=null,editId=null){
  if(editId){
    const p=projects.find(x=>x.id===editId); if(!p)return;
    wizard=ensureWizardDetails({step:1,editId:p.id,category:p.category,room:p.room||'Salle de bain',title:p.title||'',area:p.area||10,level:p.level||'Débutant',budget:p.budget||750,range:p.range||'Standard',...(p.details||{})});
  }else wizard=defaultWizard(category||'Carrelage');
  renderWizard();
}

function detailPill(value){return `<span class="detailPill">${esc(value)}</span>`}
function choiceButton(value,current,onclick,sub=''){return `<button class="detailChoice ${current===value?'selected':''}" onclick="${onclick}"><b>${esc(value)}</b>${sub?`<small>${esc(sub)}</small>`:''}</button>`}

function detailsStep(){
  if(wizard.category==='Carrelage'){
    const c=detailConfig.Carrelage;
    return `<div class="detailSection"><h3>Que veux-tu carreler ?</h3><div class="detailGrid cols3">${c.scopes.map(v=>choiceButton(v,wizard.scope,`setW('scope','${v}')`)).join('')}</div></div>
    <div class="detailSection"><h3>Format du carrelage</h3><div class="detailGrid cols3">${c.formats.map(v=>choiceButton(v,wizard.tileFormat,`setW('tileFormat','${v.replace(/'/g,"\\'")}')`)).join('')}</div></div>
    <div class="detailSection"><h3>Support existant</h3><div class="detailGrid cols2">${c.supports.map(v=>choiceButton(v,wizard.support,`setW('support','${v.replace(/'/g,"\\'")}')`)).join('')}</div></div>
    <div class="detailSection"><h3>Type de pose</h3><div class="detailGrid cols3">${c.poses.map(v=>choiceButton(v,wizard.tilePose,`setW('tilePose','${v}')`)).join('')}</div></div>
    <div class="switchList"><label><input type="checkbox" ${wizard.removeExisting?'checked':''} onchange="setWInput('removeExisting',this.checked)"><span><b>Dépose de l’existant</b><small>Ancien carrelage ou revêtement à retirer</small></span></label><label><input type="checkbox" ${wizard.wetArea?'checked':''} onchange="setWInput('wetArea',this.checked)"><span><b>Zone humide / douche</b><small>Ajoute l’étanchéité et les produits associés</small></span></label></div>`;
  }
  if(wizard.category==='Peinture'){
    const c=detailConfig.Peinture;
    return `<div class="detailSection"><h3>Surfaces à peindre</h3><div class="detailGrid cols3">${c.scopes.map(v=>choiceButton(v,wizard.scope,`setW('scope','${v}')`)).join('')}</div></div><div class="detailSection"><h3>État du support</h3><div class="detailGrid cols3">${c.states.map(v=>choiceButton(v,wizard.paintState,`setW('paintState','${v.replace(/'/g,"\\'")}')`)).join('')}</div></div><div class="detailSection"><h3>Finition souhaitée</h3><div class="detailGrid cols3">${c.finishes.map(v=>choiceButton(v,wizard.paintFinish,`setW('paintFinish','${v}')`)).join('')}</div></div>`;
  }
  if(wizard.category==='Sol / parquet'){
    const c=detailConfig['Sol / parquet'];
    return `<div class="detailSection"><h3>Produit</h3><div class="detailGrid cols3">${c.products.map(v=>choiceButton(v,wizard.floorProduct,`setW('floorProduct','${v}')`)).join('')}</div></div><div class="detailSection"><h3>Type de pose</h3><div class="detailGrid cols3">${c.installs.map(v=>choiceButton(v,wizard.floorInstall,`setW('floorInstall','${v}')`)).join('')}</div></div><div class="detailSection"><h3>Support</h3><div class="detailGrid cols2">${c.supports.map(v=>choiceButton(v,wizard.support,`setW('support','${v.replace(/'/g,"\\'")}')`)).join('')}</div></div><div class="switchList"><label><input type="checkbox" ${wizard.removeExisting?'checked':''} onchange="setWInput('removeExisting',this.checked)"><span><b>Dépose de l’ancien sol</b><small>À intégrer dans les étapes et le temps de chantier</small></span></label></div>`;
  }
  const c=detailConfig['Placo / isolation'];
  return `<div class="detailSection"><h3>Type de travaux</h3><div class="detailGrid cols3">${c.works.map(v=>choiceButton(v,wizard.placoWork,`setW('placoWork','${v}')`)).join('')}</div></div><div class="detailSection"><h3>Type de plaque</h3><div class="detailGrid cols2">${c.plates.map(v=>choiceButton(v,wizard.plateType,`setW('plateType','${v}')`)).join('')}</div></div><div class="detailSection"><h3>Isolation</h3><div class="detailGrid cols2">${c.insulations.map(v=>choiceButton(v,wizard.insulation,`setW('insulation','${v}')`)).join('')}</div></div>`;
}

function detailSummary(){
  if(wizard.category==='Carrelage') return [wizard.scope,wizard.tileFormat,wizard.support,wizard.tilePose,wizard.wetArea?'Zone humide':'Zone sèche'];
  if(wizard.category==='Peinture') return [wizard.scope,wizard.paintState,wizard.paintFinish];
  if(wizard.category==='Sol / parquet') return [wizard.floorProduct,wizard.floorInstall,wizard.support];
  return [wizard.placoWork,wizard.plateType,wizard.insulation];
}

function nextW(){if(!wizard)return;if(wizard.step===2&&!wizard.title.trim())wizard.title=`${wizard.category} - ${wizard.room}`;wizard.step=Math.min(7,wizard.step+1);renderWizard()}
function prevW(){if(!wizard)return;wizard.step=Math.max(1,wizard.step-1);renderWizard()}

function renderWizard(){
  document.querySelector('#wizardModal')?.remove();
  const editing=!!wizard.editId;
  const labels=['Travaux','Pièce','Détails','Surface','Niveau','Budget','Validation'];
  let body='';
  if(wizard.step===1) body=`<div class="wizardChoices tradeChoices">${Object.entries(meta).map(([cat,m])=>`<button class="wizardChoice ${wizard.category===cat?'selected':''}" onclick="setW('category','${cat.replace(/'/g,"\\'")}')"><span class="choiceEmoji">${m[2]}</span><b>${m[0]}</b><small>${m[1]}</small></button>`).join('')}</div>`;
  if(wizard.step===2) body=`<div class="field"><label>Dans quelle pièce ?</label><div class="chipGrid">${rooms.map(r=>`<button class="choiceChip ${wizard.room===r?'selected':''}" onclick="setW('room','${r.replace(/'/g,"\\'")}')">${r}</button>`).join('')}</div></div><div class="field"><label>Nom du chantier</label><input value="${esc(wizard.title)}" placeholder="Ex : Salle de bain principale" oninput="setWInput('title',this.value)"></div>`;
  if(wizard.step===3) body=detailsStep();
  if(wizard.step===4) body=`<div class="wizardNumber"><span>📐</span><div><b>Surface concernée</b><small>Surface totale à traiter pour le poste sélectionné.</small></div></div><div class="bigInput"><input type="number" min="1" step="0.5" value="${wizard.area}" oninput="setWInput('area',Number(this.value)||1)"><span>m²</span></div><div class="wizardTip">💡 Pour une salle de bain “sol + murs”, indique la surface totale carrelée. Un calculateur de pièce détaillé viendra ensuite.</div>`;
  if(wizard.step===5) body=`<div class="wizardChoices">${levels.map(l=>`<button class="wizardChoice ${wizard.level===l[0]?'selected':''}" onclick="setW('level','${l[0]}')"><span class="choiceEmoji">${l[2]}</span><b>${l[0]}</b><small>${l[1]}</small></button>`).join('')}</div>`;
  if(wizard.step===6) body=`<div class="field"><label>Budget cible</label><div class="moneyInput"><input type="number" min="0" step="50" value="${wizard.budget}" oninput="setWInput('budget',Number(this.value)||0)"><span>€</span></div></div><div class="field"><label>Gamme souhaitée</label><div class="wizardChoices rangeChoices">${ranges.map(r=>`<button class="wizardChoice ${wizard.range===r[0]?'selected':''}" onclick="setW('range','${r[0]}')"><span class="rangePrice">${r[2]}</span><b>${r[0]}</b><small>${r[1]}</small></button>`).join('')}</div></div>`;
  if(wizard.step===7){const mats=buildMaterials(wizard.category,wizard.area,wizard);body=`<div class="summaryCard"><img src="${img(wizard.category)}" alt="${esc(wizard.category)}"><div class="summaryBody"><span class="pill">${esc(wizard.category)}</span><h3>${esc(wizard.title||`${wizard.category} - ${wizard.room}`)}</h3><div class="summaryGrid"><div><small>Pièce</small><b>${esc(wizard.room)}</b></div><div><small>Surface</small><b>${wizard.area} m²</b></div><div><small>Niveau</small><b>${esc(wizard.level)}</b></div><div><small>Budget</small><b>${wizard.budget} €</b></div></div><div class="detailPills">${detailSummary().map(detailPill).join('')}</div></div></div><div class="quotePreview"><div><b>🧾 Première estimation matières</b><small>Quantités calculées à partir des choix du projet.</small></div>${mats.slice(0,5).map(m=>`<div class="quoteLine"><span>${esc(m[0])}</span><b>${esc(m[1])}</b></div>`).join('')}<button class="btn soft full" onclick="detectStoresFromWizard()">📍 Chercher les magasins proches</button><div id="wizardStores" class="storeResult small muted">Les prix magasin en temps réel seront affichés uniquement lorsqu’une source tarifaire live est disponible.</div></div><div class="validationNote">✓ Le chantier ne sera enregistré qu’en appuyant sur <b>${editing?'Enregistrer les modifications':'Créer et enregistrer'}</b>.</div>`;}
  const modal=`<div class="modalBack" id="wizardModal"><div class="modal wizardModal"><div class="wizardTop"><div><div class="eyebrow">${editing?'MODIFIER LE CHANTIER':'NOUVEAU CHANTIER'}</div><h2>${labels[wizard.step-1]}</h2></div><button class="close" onclick="closeWizard()">✕</button></div><div class="wizardProgress"><span style="width:${wizard.step/7*100}%"></span></div><div class="wizardSteps">${labels.map((x,i)=>`<span class="${i+1<=wizard.step?'active':''}">${i+1}</span>`).join('')}</div><div class="wizardBody">${body}</div><div class="wizardFooter">${wizard.step>1?`<button class="btn soft" onclick="prevW()">← Retour</button>`:'<span></span>'}${wizard.step<7?`<button class="btn primary" onclick="nextW()">Continuer →</button>`:`<button class="btn primary" onclick="finishWizard()">✓ ${editing?'Enregistrer les modifications':'Créer et enregistrer'}</button>`}</div></div></div>`;
  document.body.insertAdjacentHTML('beforeend',modal);
}

function tileLoss(w){let loss=0.10;if(w.tileFormat==='30 × 60')loss=.08;if(['60 × 120','80 × 80'].includes(w.tileFormat))loss=.12;if(w.tileFormat==='120 × 120')loss=.15;if(w.tilePose==='Diagonale')loss+=.05;return loss;}
function buildMaterials(category,area,w={}){
  area=Number(area)||1; w=ensureWizardDetails({...w});
  if(category==='Carrelage'){
    const loss=tileLoss(w),order=area*(1+loss);let kgm2=4.5;if(['60 × 120','80 × 80'].includes(w.tileFormat))kgm2=5.5;if(w.tileFormat==='120 × 120')kgm2=6.5;
    const glue=Math.max(1,Math.ceil(area*kgm2/25)),joint=Math.max(2,Math.ceil(area*(w.tileFormat==='30 × 60'?.4:.25))),clips=Math.ceil(area*(w.tileFormat==='30 × 60'?20:14));
    let m=[['Carrelage',`${order.toFixed(1)} m²`,0],['Colle C2S1',`${glue} sacs de 25 kg`,0],['Joint',`${joint} kg`,0],['Croisillons / nivelants',`${clips} pièces`,0],['Primaire',`${Math.max(1,Math.ceil(area/10))} bidon(s) indicatif(s)`,0]];
    if(w.wetArea)m.push(['Étanchéité sous carrelage',`${Math.max(1,Math.ceil(area*1.2/15))} kit(s) indicatif(s)`,0],['Bandes / angles étanchéité','1 lot',0]);
    return m;
  }
  if(category==='Peinture'){
    const coats=w.paintState==='Bon état'?2:3;return [['Peinture finition',`${Math.max(1,Math.ceil(area*coats/10))} pot(s) indicatif(s)`,0],['Sous-couche',`${Math.max(1,Math.ceil(area/10))} pot(s)`,0],['Enduit',w.paintState==='Bon état'?'5 kg':`${Math.max(5,Math.ceil(area/8)*5)} kg`,0],['Adhésif + protections','1 lot',0]];
  }
  if(category==='Sol / parquet') return [[w.floorProduct||'Revêtement',`${(area*1.08).toFixed(1)} m²`,0],['Sous-couche',`${Math.ceil(area)} m²`,0],['Plinthes','À mesurer au périmètre',0],[w.floorInstall==='Collée'?'Colle parquet':'Accessoires de pose','1 lot',0]];
  return [[w.plateType||'Plaques de plâtre','À calculer selon dimensions',0],['Rails / montants','À calculer selon dimensions',0],[w.insulation||'Isolant',w.insulation==='Sans isolant'?'Non prévu':`${Math.ceil(area)} m²`,0],['Vis + bandes + enduit','1 lot',0]];
}

function buildSteps(category,room,w={}){
  w=ensureWizardDetails({...w});
  let arr={Carrelage:['Protection et préparation','Contrôle du support','Traçage / calepinage','Préparation de la colle','Pose du carrelage','Joints et finitions'],Peinture:['Protection de la pièce','Nettoyage du support','Rebouchage et ponçage','Sous-couche','Première couche','Deuxième couche et finitions'],'Sol / parquet':['Contrôle du support','Préparation / ragréage si besoin','Sous-couche','Calepinage','Pose du revêtement','Plinthes et finitions'],'Placo / isolation':['Traçage','Pose des rails','Pose des montants','Isolation','Pose des plaques','Bandes, enduit et ponçage']}[category]||['Préparation','Réalisation','Finitions'];
  arr=[...arr];if(w.removeExisting)arr.unshift('Dépose de l’existant et évacuation');if(category==='Carrelage'&&w.wetArea&&/Salle de bain|WC/.test(room))arr.splice(w.removeExisting?4:3,0,'Étanchéité des zones humides');return arr.map(x=>[x,0]);
}

function finishWizard(){
  if(!wizard)return;const title=(wizard.title||`${wizard.category} - ${wizard.room}`).trim();const details={scope:wizard.scope,tileFormat:wizard.tileFormat,support:wizard.support,tilePose:wizard.tilePose,removeExisting:wizard.removeExisting,wetArea:wizard.wetArea,paintState:wizard.paintState,paintFinish:wizard.paintFinish,floorInstall:wizard.floorInstall,floorProduct:wizard.floorProduct,placoWork:wizard.placoWork,plateType:wizard.plateType,insulation:wizard.insulation};
  if(wizard.editId){const idx=projects.findIndex(x=>x.id===wizard.editId);if(idx<0)return;const old=projects[idx];projects[idx]={...old,title,category:wizard.category,room:wizard.room,area:Number(wizard.area)||1,level:wizard.level,budget:Number(wizard.budget)||0,range:wizard.range,details,steps:buildSteps(wizard.category,wizard.room,wizard),materials:buildMaterials(wizard.category,wizard.area,wizard),updatedAt:Date.now()};}
  else projects.unshift({id:Date.now(),title,category:wizard.category,room:wizard.room,area:Number(wizard.area)||1,level:wizard.level,budget:Number(wizard.budget)||0,range:wizard.range,details,steps:buildSteps(wizard.category,wizard.room,wizard),materials:buildMaterials(wizard.category,wizard.area,wizard),createdAt:Date.now()});
  save();closeWizard();tab='projects';render();window.scrollTo({top:0,behavior:'smooth'});
}

function projectCard(p){const ds=p.details||{};let extra=[];if(p.category==='Carrelage')extra=[ds.scope,ds.tileFormat,ds.support];else if(p.category==='Peinture')extra=[ds.scope,ds.paintFinish];else if(p.category==='Sol / parquet')extra=[ds.floorProduct,ds.floorInstall];else extra=[ds.placoWork,ds.plateType];extra=extra.filter(Boolean);return `<div class="card projectCard"><div class="projectMedia compact"><img src="${img(p.category)}" loading="lazy" alt="${esc(p.category)}"><span class="projectMediaShade"></span><div class="projectMediaTitle"><span class="pill">${esc(p.category)}</span><h3>${esc(p.title)}</h3></div></div><div class="projectBody"><div class="projectMeta"><span>${esc(p.room||'Pièce')}</span><span>${Number(p.area||0)} m²</span><span>${esc(p.level||'')}</span>${extra.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="sectionHead"><span class="muted">Budget ${p.budget||0} € · ${esc(p.range||'Standard')}</span><b>${progress(p)}%</b></div><div class="progress"><span style="width:${progress(p)}%"></span></div><div class="steps">${p.steps.map((s,i)=>`<button class="step" onclick="toggleStep(${p.id},${i})"><span class="dot ${s[1]?'done':''}">${s[1]?'✓':i+1}</span>${esc(s[0])}</button>`).join('')}</div><div class="projectActions projectActions3"><button class="btn soft" onclick="openWizard(null,${p.id})">✏️ Modifier</button><button class="btn soft" onclick="openLocalQuote(${p.id})">🧾 Chiffrage</button><button class="btn dangerBtn" onclick="askDelete(${p.id})">🗑️ Supprimer</button></div></div></div>`}

const referenceUnitPrices={
  Éco:{tile:12.9,glueBag:14.9,jointKg:2.8,clips100:8.9,primer:18,waterproofKit:54,paintPot:29,undercoat:25,parquetM2:9.9},
  Standard:{tile:24.9,glueBag:20.9,jointKg:3.8,clips100:11.9,primer:24,waterproofKit:69,paintPot:42,undercoat:32,parquetM2:18.9},
  Premium:{tile:44.9,glueBag:27.9,jointKg:5.2,clips100:15.9,primer:31,waterproofKit:89,paintPot:59,undercoat:42,parquetM2:34.9}
};
function technicalEstimate(p){const r=referenceUnitPrices[p.range]||referenceUnitPrices.Standard,area=Number(p.area)||1,d=p.details||{};let total=0;if(p.category==='Carrelage'){const w=ensureWizardDetails({...d});total+=area*(1+tileLoss(w))*r.tile;total+=Math.ceil(area*(['60 × 120','80 × 80','120 × 120'].includes(w.tileFormat)?5.8:4.5)/25)*r.glueBag;total+=Math.max(2,Math.ceil(area*.3))*r.jointKg;total+=Math.ceil(area*14/100)*r.clips100;total+=r.primer;if(w.wetArea)total+=r.waterproofKit;}else if(p.category==='Peinture')total+=Math.max(1,Math.ceil(area*2/10))*r.paintPot+r.undercoat;else if(p.category==='Sol / parquet')total+=area*1.08*r.parquetM2+40;else total+=area*18+90;return Math.round(total);}

function openLocalQuote(id){const p=projects.find(x=>x.id===id);if(!p)return;document.querySelector('#quoteModal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="quoteModal"><div class="modal quoteModal"><div class="wizardTop"><div><div class="eyebrow">CHIFFRAGE PRODUITS</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#quoteModal').remove()">✕</button></div><div class="estimateBox"><small>Estimation technique Bricoach</small><b>≈ ${technicalEstimate(p).toLocaleString('fr-FR')} €</b><span>Cette estimation utilise un panier de référence, pas encore les tarifs live des enseignes.</span></div><h3>Magasins proches</h3><p class="muted">Autorise la localisation pour rechercher Leroy Merlin, Castorama et Brico Dépôt autour de toi.</p><button class="btn primary full" onclick="detectNearbyStores('quoteStores')">📍 Utiliser ma position</button><div id="quoteStores" class="storeResult"><div class="empty">Aucune localisation demandée.</div></div><div class="livePriceNote"><b>Prix en vigueur</b><p>Pour comparer automatiquement le même panier avec les prix réellement pratiqués par chaque magasin, Bricoach doit passer par un service serveur et des flux produits autorisés. Je préfère afficher “non disponible” plutôt qu’un faux prix.</p></div></div></div>`);}

function detectStoresFromWizard(){detectNearbyStores('wizardStores')}
function detectNearbyStores(targetId){const el=document.getElementById(targetId);if(!el)return;if(!navigator.geolocation){el.innerHTML='Géolocalisation non disponible sur cet appareil.';return;}el.innerHTML='<div class="storeLoading">Recherche des magasins autour de toi…</div>';navigator.geolocation.getCurrentPosition(async pos=>{const {latitude:lat,longitude:lon}=pos.coords;try{localStorage.setItem('bricoach-location-v10',JSON.stringify({lat,lon,at:Date.now()}));}catch(_){}try{const q=`[out:json][timeout:20];(nwr[\"name\"~\"Leroy Merlin|Castorama|Brico Dépôt|Brico Depot\",i](around:50000,${lat},${lon}););out center tags;`;const url='https://overpass-api.de/api/interpreter?data='+encodeURIComponent(q);const res=await fetch(url);const data=await res.json();const stores=(data.elements||[]).map(e=>{const la=e.lat||e.center?.lat,lo=e.lon||e.center?.lon;if(!la||!lo)return null;const name=e.tags?.name||e.tags?.brand||'Magasin bricolage';const km=haversine(lat,lon,la,lo);return {name,km};}).filter(Boolean).sort((a,b)=>a.km-b.km).filter((s,i,a)=>i===a.findIndex(x=>x.name===s.name)).slice(0,6);el.innerHTML=stores.length?stores.map(s=>`<div class="storeRow"><span>📍 ${esc(s.name)}</span><b>${s.km.toFixed(1)} km</b></div>`).join(''):'Aucun magasin des enseignes ciblées trouvé dans un rayon de 50 km.';}catch(e){el.innerHTML='La recherche de magasins n’a pas répondu. Réessaie dans quelques instants.';}},err=>{el.innerHTML='Position non autorisée. Tu peux activer la localisation du navigateur pour obtenir les magasins les plus proches.';},{enableHighAccuracy:false,timeout:10000,maximumAge:300000});}
function haversine(a,b,c,d){const R=6371,t=x=>x*Math.PI/180,dp=t(c-a),dl=t(d-b),x=Math.sin(dp/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(dl/2)**2;return 2*R*Math.asin(Math.sqrt(x));}

render();