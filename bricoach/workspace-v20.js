const V20_INVENTORY_KEY='bricoach-tool-inventory-v20';
let v20Inventory={};
try{v20Inventory=JSON.parse(localStorage.getItem(V20_INVENTORY_KEY)||'{}')||{}}catch(_){v20Inventory={}}
function v20SaveInventory(){try{localStorage.setItem(V20_INVENTORY_KEY,JSON.stringify(v20Inventory))}catch(_){}}

const V20_ICON='https://img.icons8.com/fluency/240/';
const V20_TOOL_CATALOG={
  mixer:{name:'Malaxeur',cat:'Carrelage',emoji:'🌀',img:V20_ICON+'drill.png',price:89,rent:18,desc:'Mélanger colle, mortier et enduit sans grumeaux.',rentable:true},
  bucket:{name:'Seau gradué',cat:'Carrelage',emoji:'🪣',img:V20_ICON+'bucket.png',price:12,rent:0,desc:'Préparation de la colle et nettoyage.'},
  notchedTrowel:{name:'Peigne à colle',cat:'Carrelage',emoji:'🪮',img:V20_ICON+'trowel.png',price:16,rent:0,desc:'Peigne adapté au format du carreau.'},
  trowel:{name:'Truelle',cat:'Carrelage',emoji:'🔺',img:V20_ICON+'trowel.png',price:14,rent:0,desc:'Préparation, reprises et petites charges.'},
  tileCutter:{name:'Coupe-carreaux',cat:'Carrelage',emoji:'✂️',img:V20_ICON+'circular-saw.png',price:179,rent:35,desc:'Coupe droite des carreaux.',rentable:true},
  grinder:{name:'Meuleuse + disque diamant',cat:'Carrelage',emoji:'⚙️',img:V20_ICON+'angle-grinder.png',price:95,rent:22,desc:'Découpes, encoches et ajustements.',rentable:true},
  level:{name:'Niveau à bulle',cat:'Commun',emoji:'📏',img:V20_ICON+'level.png',price:29,rent:0,desc:'Contrôle niveau, aplomb et alignement.'},
  laser:{name:'Niveau laser',cat:'Commun',emoji:'🔴',img:V20_ICON+'laser-level.png',price:129,rent:25,desc:'Tracés et contrôles rapides.',rentable:true},
  tape:{name:'Mètre ruban',cat:'Commun',emoji:'📐',img:V20_ICON+'measuring-tape.png',price:10,rent:0,desc:'Mesures du chantier.'},
  mallet:{name:'Maillet caoutchouc',cat:'Carrelage',emoji:'🔨',img:V20_ICON+'hammer.png',price:15,rent:0,desc:'Ajuster sans abîmer la surface.'},
  sponge:{name:'Éponge chantier',cat:'Carrelage',emoji:'🧽',img:V20_ICON+'sponge.png',price:7,rent:0,desc:'Nettoyage des joints et finitions.'},
  groutFloat:{name:'Taloche à joints',cat:'Carrelage',emoji:'⬛',img:V20_ICON+'trowel.png',price:14,rent:0,desc:'Application du mortier de jointoiement.'},
  levelingPliers:{name:'Pince autonivelante',cat:'Carrelage',emoji:'🗜️',img:V20_ICON+'pliers.png',price:18,rent:0,desc:'Serrage des cales du système autonivelant.'},
  suction:{name:'Ventouses de manutention',cat:'Carrelage',emoji:'⭕',img:V20_ICON+'suction-cup.png',price:55,rent:12,desc:'Manipuler les grands formats plus sûrement.',rentable:true},
  kneepads:{name:'Genouillères',cat:'Commun',emoji:'🦵',img:V20_ICON+'knee-pad.png',price:25,rent:0,desc:'Protection pendant les travaux au sol.'},
  vacuum:{name:'Aspirateur chantier',cat:'Commun',emoji:'🧹',img:V20_ICON+'vacuum-cleaner.png',price:119,rent:25,desc:'Limiter poussières et nettoyer le support.',rentable:true},
  ppe:{name:'Lunettes + gants + masque',cat:'Commun',emoji:'🥽',img:V20_ICON+'safety-glasses.png',price:25,rent:0,desc:'Équipement de protection individuelle.'},
  roller:{name:'Rouleau peinture',cat:'Peinture',emoji:'🎨',img:V20_ICON+'paint-roller.png',price:14,rent:0,desc:'Application régulière sur murs et plafonds.'},
  brush:{name:'Pinceaux / brosse à réchampir',cat:'Peinture',emoji:'🖌️',img:V20_ICON+'paint-brush.png',price:18,rent:0,desc:'Angles, bordures et finitions.'},
  tray:{name:'Bac à peinture + grille',cat:'Peinture',emoji:'🧺',img:V20_ICON+'paint-bucket.png',price:12,rent:0,desc:'Charger et essorer le rouleau.'},
  masking:{name:'Ruban de masquage',cat:'Peinture',emoji:'➖',img:V20_ICON+'duct-tape.png',price:9,rent:0,desc:'Protéger les limites et obtenir des lignes nettes.'},
  scraper:{name:'Spatules / couteaux à enduire',cat:'Peinture',emoji:'🔪',img:V20_ICON+'putty-knife.png',price:20,rent:0,desc:'Rebouchage et préparation des supports.'},
  sander:{name:'Ponceuse',cat:'Peinture',emoji:'🟠',img:V20_ICON+'sander.png',price:79,rent:20,desc:'Ponçage rapide des reprises et enduits.',rentable:true},
  ladder:{name:'Escabeau',cat:'Peinture',emoji:'🪜',img:V20_ICON+'ladder.png',price:69,rent:15,desc:'Accès sécurisé aux parties hautes.',rentable:true},
  tarp:{name:'Bâches de protection',cat:'Peinture',emoji:'⬜',img:V20_ICON+'fabric.png',price:18,rent:0,desc:'Protéger sols, meubles et menuiseries.'},
  jigsaw:{name:'Scie sauteuse',cat:'Sol / parquet',emoji:'🪚',img:V20_ICON+'jigsaw.png',price:85,rent:20,desc:'Découpes de parquet et stratifié.',rentable:true},
  cutter:{name:'Cutter professionnel',cat:'Sol / parquet',emoji:'🔪',img:V20_ICON+'utility-knife.png',price:15,rent:0,desc:'Découpe des sous-couches et sols souples.'},
  square:{name:'Équerre',cat:'Sol / parquet',emoji:'📐',img:V20_ICON+'set-square.png',price:14,rent:0,desc:'Tracer des coupes précises.'},
  tapping:{name:'Kit de pose parquet',cat:'Sol / parquet',emoji:'🧱',img:V20_ICON+'hammer.png',price:24,rent:0,desc:'Cale de frappe, tire-lame et cales périphériques.'},
  drill:{name:'Visseuse / perceuse',cat:'Placo / isolation',emoji:'🔩',img:V20_ICON+'drill.png',price:119,rent:22,desc:'Fixation ossature et plaques.',rentable:true},
  snips:{name:'Cisaille à tôle',cat:'Placo / isolation',emoji:'✂️',img:V20_ICON+'scissors.png',price:22,rent:0,desc:'Découpe rails et montants.'},
  drywallKnife:{name:'Couteaux à enduire',cat:'Placo / isolation',emoji:'🔪',img:V20_ICON+'putty-knife.png',price:28,rent:0,desc:'Bandes et finition des joints.'},
  rasp:{name:'Rabot à placo',cat:'Placo / isolation',emoji:'🪵',img:V20_ICON+'hand-plane.png',price:16,rent:0,desc:'Ajuster les chants des plaques.'},
  drywallLift:{name:'Lève-plaque',cat:'Placo / isolation',emoji:'⬆️',img:V20_ICON+'lift-cart.png',price:239,rent:32,desc:'Pose des plaques au plafond.',rentable:true}
};

const V20_MAT_VISUALS=[
  [/carrelage|croisillon|nivelant|cale/i,{emoji:'🧱',img:V20_ICON+'tiles.png'}],
  [/colle|mortier/i,{emoji:'🧴',img:V20_ICON+'cement-bag.png'}],
  [/joint/i,{emoji:'🪣',img:V20_ICON+'paint-bucket.png'}],
  [/primaire|étanchéité|spec|imperm/i,{emoji:'💧',img:V20_ICON+'waterproof.png'}],
  [/peinture|sous-couche/i,{emoji:'🎨',img:V20_ICON+'paint-bucket.png'}],
  [/ruban|bâche|rouleau|pinceau/i,{emoji:'🖌️',img:V20_ICON+'paint-roller.png'}],
  [/parquet|stratifié|pvc|vinyle|revêtement/i,{emoji:'🪵',img:V20_ICON+'wood.png'}],
  [/plinthe/i,{emoji:'📏',img:V20_ICON+'ruler.png'}],
  [/plaque|placo|ba13/i,{emoji:'⬜',img:V20_ICON+'drywall.png'}],
  [/rail|montant|ossature/i,{emoji:'🧰',img:V20_ICON+'steel-i-beam.png'}],
  [/isol/i,{emoji:'🧶',img:V20_ICON+'insulation.png'}],
  [/vis/i,{emoji:'🔩',img:V20_ICON+'screw.png'}],
  [/bande|enduit/i,{emoji:'🧻',img:V20_ICON+'adhesive-tape.png'}]
];
function v20MatVisual(name=''){return V20_MAT_VISUALS.find(x=>x[0].test(name))?.[1]||{emoji:'📦',img:V20_ICON+'package.png'}}
function v20Visual(imgUrl,emoji,alt=''){return `<span class="v20Visual"><img src="${imgUrl}" alt="${esc(alt)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><span style="display:none">${emoji}</span></span>`}

function v20ToolIdsForWork(w){
  const d=w.details||{},cat=w.category;let ids=['tape','level','ppe','vacuum'];
  if(cat==='Carrelage'){
    ids.push('mixer','bucket','notchedTrowel','trowel','tileCutter','mallet','sponge','groutFloat','levelingPliers','kneepads');
    if(['60 × 120','80 × 80','120 × 120'].includes(d.tileFormat))ids.push('grinder','suction','laser');
    if(d.tilePose==='Diagonale')ids.push('grinder');
  }else if(cat==='Peinture'){
    ids.push('roller','brush','tray','masking','scraper','tarp');
    if(d.paintState!=='Bon état')ids.push('sander');
    if(d.scope!=='Murs')ids.push('ladder');
  }else if(cat==='Sol / parquet'){
    ids.push('square','tapping','kneepads');
    if(d.floorProduct==='PVC / vinyle')ids.push('cutter');else ids.push('jigsaw');
  }else if(cat==='Placo / isolation'){
    ids.push('drill','snips','cutter','drywallKnife','rasp','laser');
    if(d.placoWork==='Faux plafond')ids.push('drywallLift');
  }
  return [...new Set(ids)];
}
function v20ProjectTools(p){
  try{p=v14SyncProject(p)}catch(_){}
  const ids=[];(p.locations||[]).forEach(l=>(l.works||[]).forEach(w=>ids.push(...v20ToolIdsForWork(w))));
  return [...new Set(ids)].map(id=>({id,...V20_TOOL_CATALOG[id]})).filter(x=>x.name);
}
function v20EnsureState(p){if(!p.v20ToolStatus||typeof p.v20ToolStatus!=='object')p.v20ToolStatus={};return p.v20ToolStatus}
function v20ToolStatus(p,id){const s=v20EnsureState(p)[id];if(s)return s;return v20Inventory[id]?'owned':'buy'}
function v20SetToolStatus(projectId,id,status){const p=projects.find(x=>x.id===projectId);if(!p)return;v20EnsureState(p)[id]=status;if(status==='owned'){v20Inventory[id]=true;v20SaveInventory()}save();v20RenderWorkspaceBody(projectId,'tools')}
function v20ToolCost(p,t){const st=v20ToolStatus(p,t.id);if(st==='owned'||st==='skip')return 0;if(st==='rent')return Number(t.rent||0);return Number(t.price||0)}
function v20ToolBudget(p){return v20ProjectTools(p).reduce((s,t)=>s+v20ToolCost(p,t),0)}

function v20SetInventory(id,on){v20Inventory[id]=!!on;v20SaveInventory();v20RenderInventoryBody()}
function v20RenderInventoryBody(){
  const el=document.getElementById('v20InventoryBody');if(!el)return;
  const cats=['Carrelage','Peinture','Sol / parquet','Placo / isolation','Commun'];
  el.innerHTML=cats.map(cat=>{const items=Object.entries(V20_TOOL_CATALOG).filter(([,t])=>t.cat===cat);if(!items.length)return'';return `<section class="v20InventoryGroup"><h3>${cat==='Commun'?'🧰 Outils communs':`${meta[cat]?.[2]||'🔧'} ${esc(cat)}`}</h3><div class="v20InventoryGrid">${items.map(([id,t])=>`<label class="v20InventoryItem ${v20Inventory[id]?'owned':''}">${v20Visual(t.img,t.emoji,t.name)}<span><b>${esc(t.name)}</b><small>${v20Inventory[id]?'Déjà dans mon matériel':'Je ne le possède pas'}</small></span><input type="checkbox" ${v20Inventory[id]?'checked':''} onchange="v20SetInventory('${id}',this.checked)"></label>`).join('')}</div></section>`}).join('');
}
function v20OpenInventory(){document.querySelector('#v20InventoryModal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v20InventoryModal"><div class="modal v20InventoryModal"><div class="wizardTop"><div><div class="eyebrow">MON MATÉRIEL</div><h2>Ce que je possède déjà</h2></div><button class="close" onclick="document.querySelector('#v20InventoryModal').remove()">✕</button></div><p class="muted">Coche les outils que tu possèdes. Ils seront automatiquement marqués « Déjà possédé » dans tous tes chantiers et retirés du budget outils.</p><div id="v20InventoryBody"></div><button class="btn primary full" onclick="document.querySelector('#v20InventoryModal').remove();render()">✓ Enregistrer mon matériel</button></div></div>`);v20RenderInventoryBody()}

try{
  const baseProfile=v15RenderProfileModal;
  v15RenderProfileModal=function(){baseProfile();requestAnimationFrame(()=>{const m=document.querySelector('#v15ProfileModal .v15ProfileModal');if(!m||m.querySelector('.v20InventoryLaunch'))return;const saveBtn=[...m.querySelectorAll('button')].find(b=>/Enregistrer mon profil/.test(b.textContent));const box=document.createElement('div');box.className='v20InventoryLaunch';box.innerHTML=`<div><span>🧰</span><div><b>Mon matériel</b><small>Déclare les outils que tu possèdes pour ne plus les chiffrer.</small></div></div><button class="btn soft" onclick="v20OpenInventory()">Gérer mes outils →</button>`;if(saveBtn)m.insertBefore(box,saveBtn);else m.appendChild(box)})}
}catch(_){}

function v20ProjectMaterialRows(p){
  return (p.materials||[]).map((m,i)=>{const v=v20MatVisual(m[0]);return `<label class="v20MaterialRow ${m[2]?'done':''}">${v20Visual(v.img,v.emoji,m[0])}<span class="v20RowText"><b>${esc(m[0])}</b><small>${esc(m[1])}</small></span><span class="v20MaterialCheck"><input type="checkbox" ${m[2]?'checked':''} onchange="v20ToggleMaterial(${p.id},${i},this.checked)"><small>${m[2]?'Déjà disponible':'À prévoir'}</small></span></label>`}).join('')
}
function v20ToggleMaterial(projectId,i,on){const p=projects.find(x=>x.id===projectId);if(!p||!p.materials?.[i])return;p.materials[i][2]=on?1:0;save();v20RenderWorkspaceBody(projectId,'materials')}

function v20WorkspaceSteps(p){return (p.locations||[]).map(l=>`<section class="v20Loc"><h3>📍 ${esc(l.name)}</h3>${(l.works||[]).map(w=>`<div class="v20WorkBlock"><div class="v20WorkTitle"><b>${meta[w.category]?.[2]||'🔧'} ${esc(w.category)}</b><small>${Number(w.area||0).toFixed(1)} m² · ${esc(w.range||'Standard')}</small></div><div class="v20Steps">${(w.steps||[]).map((s,i)=>`<button class="v20Step ${s[1]?'done':''}" onclick="v20ToggleStep(${p.id},${l.id},${w.id},${i})"><span>${s[1]?'✓':i+1}</span><b>${esc(s[0])}</b></button>`).join('')}</div></div>`).join('')}</section>`).join('')}
function v20ToggleStep(pid,lid,wid,i){const p=projects.find(x=>x.id===pid),l=p?.locations?.find(x=>x.id===lid),w=l?.works?.find(x=>x.id===wid);if(!w?.steps?.[i])return;w.steps[i][1]=w.steps[i][1]?0:1;v14SyncProject(p);save();v20RenderWorkspaceBody(pid,'steps')}

function v20WorkspaceTools(p){const tools=v20ProjectTools(p),budget=v20ToolBudget(p);return `<div class="v20ToolSummary"><div><b>${tools.length} outils / équipements identifiés</b><small>Les outils cochés « Je l’ai déjà » ne sont pas comptés.</small></div><strong>À prévoir : ≈ ${budget.toLocaleString('fr-FR')} €</strong><button class="btn soft" onclick="v20OpenInventory()">🧰 Mon matériel</button></div><div class="v20ToolGrid">${tools.map(t=>{const st=v20ToolStatus(p,t.id);return `<article class="v20ToolCard ${st}">${v20Visual(t.img,t.emoji,t.name)}<div class="v20ToolInfo"><b>${esc(t.name)}</b><small>${esc(t.desc)}</small><div class="v20ToolPrice">Achat indicatif ${t.price} €${t.rentable?` · Location ≈ ${t.rent} €/j`:''}</div></div><label class="v20OwnedCheck"><input type="checkbox" ${st==='owned'?'checked':''} onchange="v20SetToolStatus(${p.id},'${t.id}',this.checked?'owned':'buy')"><span>Je l’ai déjà</span></label><div class="v20ToolActions"><button class="${st==='buy'?'active':''}" onclick="v20SetToolStatus(${p.id},'${t.id}','buy')">🛒 Acheter</button>${t.rentable?`<button class="${st==='rent'?'active':''}" onclick="v20SetToolStatus(${p.id},'${t.id}','rent')">🔁 Louer</button>`:''}<button class="${st==='skip'?'active':''}" onclick="v20SetToolStatus(${p.id},'${t.id}','skip')">✕ Inutile</button></div></article>`}).join('')}</div><div class="v20PriceCaveat">Les prix outils sont pour l’instant indicatifs. Le comparateur magasin détaillé des matériaux reste accessible dans « Chiffrage ».</div>`}

function v20WorkspacePlanning(p){let n=0;const rows=[];(p.locations||[]).forEach(l=>(l.works||[]).forEach(w=>(w.steps||[]).forEach(s=>{n++;rows.push(`<div class="v20PlanRow ${s[1]?'done':''}"><span>${s[1]?'✓':n}</span><div><b>${esc(s[0])}</b><small>${esc(l.name)} · ${esc(w.category)}</small></div></div>`)})));const days=Math.max(1,Math.ceil(rows.length/5));return `<div class="v20PlanHead"><div><b>Planning indicatif : ${days} jour${days>1?'s':''}</b><small>Environ 4 à 5 étapes principales par journée, à ajuster selon temps de séchage et complexité.</small></div></div><div class="v20PlanList">${rows.join('')}</div>`}
function v20WorkspaceInfo(p){return `<div class="v20InfoGrid"><div><small>Type</small><b>${esc(p.projectType||'Projet travaux')}</b></div><div><small>Lieux</small><b>${p.locations?.length||1}</b></div><div><small>Surface traitée</small><b>${Number(p.area||0).toFixed(1)} m²</b></div><div><small>Estimation matières</small><b>≈ ${v14ProjectEstimate(p).toLocaleString('fr-FR')} €</b></div></div><div class="v20InfoLocations">${(p.locations||[]).map(l=>`<section><h3>📍 ${esc(l.name)}</h3><small>${l.length&&l.width?`${l.length} × ${l.width} × ${l.height||2.5} m`:''}</small>${(l.works||[]).map(w=>`<div><b>${meta[w.category]?.[2]||'🔧'} ${esc(w.category)}</b><span>${Number(w.area||0).toFixed(1)} m² · ${esc(w.range||'Standard')} · niveau tuto ${typeof v18Level==='function'?esc(v18Level(w.category)):'Bricoleur'}</span></div>`).join('')}</section>`).join('')}</div>`}
function v20WorkspaceTutorials(p){return `<div class="v20TutorialGrid">${(p.locations||[]).flatMap(l=>(l.works||[]).map(w=>`<button onclick="openAdaptiveTutorial(${p.id},${l.id},${w.id})"><span>${meta[w.category]?.[2]||'🔧'}</span><div><b>${esc(w.category)}</b><small>${esc(l.name)} · niveau ${typeof v18Level==='function'?esc(v18Level(w.category)):'Bricoleur'}</small></div><strong>Ouvrir →</strong></button>`)).join('')}</div>`}

function v20WorkspaceBody(p,tab){
  if(tab==='steps')return v20WorkspaceSteps(p);
  if(tab==='materials')return `<div class="v20MaterialsHead"><div><b>Liste de matériaux</b><small>Images, quantités et état de préparation du chantier.</small></div></div><div class="v20MaterialList">${v20ProjectMaterialRows(p)}</div>`;
  if(tab==='tools')return v20WorkspaceTools(p);
  if(tab==='planning')return v20WorkspacePlanning(p);
  if(tab==='tutorials')return v20WorkspaceTutorials(p);
  return v20WorkspaceInfo(p)
}
function v20RenderWorkspaceBody(id,tab){const p=projects.find(x=>x.id===id);if(!p)return;try{v14SyncProject(p)}catch(_){};const body=document.getElementById('v20WorkspaceBody');if(body)body.innerHTML=v20WorkspaceBody(p,tab);document.querySelectorAll('#v20WorkspaceModal .v20Tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));const m=document.getElementById('v20WorkspaceModal');if(m)m.dataset.tab=tab}
function v20OpenWorkspace(id,tab='materials'){const p=projects.find(x=>x.id===id);if(!p)return;try{v14SyncProject(p)}catch(_){};document.querySelector('#v20WorkspaceModal')?.remove();const tabs=[['steps','Étapes'],['materials','Matériaux'],['tools','Outils'],['planning','Planning'],['tutorials','Tutoriels'],['info','Infos']];document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v20WorkspaceModal" data-tab="${tab}"><div class="modal v20WorkspaceModal"><div class="wizardTop"><div><div class="eyebrow">MON CHANTIER</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#v20WorkspaceModal').remove()">✕</button></div><div class="v20Tabs">${tabs.map(([k,l])=>`<button data-tab="${k}" class="v20Tab ${tab===k?'active':''}" onclick="v20RenderWorkspaceBody(${p.id},'${k}')">${l}</button>`).join('')}</div><div id="v20WorkspaceBody" class="v20WorkspaceBody">${v20WorkspaceBody(p,tab)}</div><div class="v20WorkspaceFooter"><button class="btn soft" onclick="document.querySelector('#v20WorkspaceModal').remove();openWizard(null,${p.id})">✏️ Modifier le projet</button><button class="btn primary" onclick="document.querySelector('#v20WorkspaceModal').remove();openLocalQuote(${p.id})">🧾 Chiffrage</button></div></div></div>`)}

try{
  const baseProjectCard=projectCard;
  projectCard=function(p){let h=baseProjectCard(p);const btn=`<button class="btn soft v20DetailsBtn" onclick="v20OpenWorkspace(${p.id},'materials')">📂 Détails</button>`;h=h.replace(/(<div class="projectActions[^>]*>)/,'$1'+btn);return h}
}catch(_){}

const v20BaseQuote=window.openLocalQuote;
function v20QuoteTools(p){const tools=v20ProjectTools(p);return tools.map(t=>{const st=v20ToolStatus(p,t.id),cost=v20ToolCost(p,t);return `<div class="v20BudgetTool ${st}">${v20Visual(t.img,t.emoji,t.name)}<div><b>${esc(t.name)}</b><small>${st==='owned'?'Déjà possédé — retiré du chiffrage':st==='rent'?'Location prévue':st==='skip'?'Non nécessaire':'À acheter'}</small></div><strong>${cost?`≈ ${cost} €`:'0 €'}</strong></div>`}).join('')}
function v20OpenBudget(id){const p=projects.find(x=>x.id===id);if(!p)return;try{v14SyncProject(p)}catch(_){};const mats=v14ProjectEstimate(p),tools=v20ToolBudget(p),total=mats+tools;document.querySelector('#quoteModal')?.remove();document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="quoteModal"><div class="modal v20BudgetModal"><div class="wizardTop"><div><div class="eyebrow">CHIFFRAGE GLOBAL</div><h2>${esc(p.title)}</h2></div><button class="close" onclick="document.querySelector('#quoteModal').remove()">✕</button></div><div class="v20BudgetTotals"><div><small>Matériaux estimés</small><b>≈ ${mats.toLocaleString('fr-FR')} €</b></div><div><small>Outils à acheter / louer</small><b>≈ ${tools.toLocaleString('fr-FR')} €</b></div><div class="total"><small>Total avant comparaison magasins</small><b>≈ ${total.toLocaleString('fr-FR')} €</b></div></div><div class="v20BudgetRule">✓ Tous les outils marqués <b>« Je l’ai déjà »</b> sont automatiquement comptés à 0 €.</div><h3>Outils pris en compte</h3><div class="v20BudgetTools">${v20QuoteTools(p)}</div><div class="v20BudgetActions"><button class="btn soft" onclick="document.querySelector('#quoteModal').remove();v20OpenWorkspace(${p.id},'tools')">Modifier mes outils</button><button class="btn primary" onclick="document.querySelector('#quoteModal').remove();v20BaseQuote(${p.id})">Comparer les matériaux par magasin →</button></div><div class="v20PriceCaveat">Les tarifs outils sont encore indicatifs. Les prix matériaux vérifiés et leurs liens restent dans le comparateur magasins.</div></div></div>`)}
window.openLocalQuote=function(id){const p=projects.find(x=>x.id===id);if(p?.locations?.length)return v20OpenBudget(id);return v20BaseQuote(id)};

try{
  v19ResultRow=function(name,value,note=''){const v=v20MatVisual(name);return `<div class="v19ResultRow v20CalcRow">${v20Visual(v.img,v.emoji,name)}<div><b>${esc(name)}</b>${note?`<small>${esc(note)}</small>`:''}</div><strong>${value}</strong></div>`}
}catch(_){}

try{
  v12QuoteCard=function(q,p){if(q.unsupported)return'';return `<div class="retailerWrapV12 ${q.verified?'verified':'unverified'}"><div class="retailerQuoteV12"><div class="retailerHeadV12"><div><b>${esc(q.retailer.name)}</b><small>${esc(q.band)}</small></div><strong>≈ ${formatEuro(q.total)}</strong></div><div class="retailerDistance" id="distance-${q.key}">📍 Magasin non localisé</div><div class="v12Lines">${q.lines.map(l=>{const v=v20MatVisual(`${l.name} ${l.product}`);return `<div class="v12Line v20QuoteLine">${v20Visual(v.img,v.emoji,l.name)}<div><b>${esc(l.name)}</b><small>${esc(l.qty)}</small><span>${esc(l.product)}</span>${v12SourceBadge(l)}</div><div class="v12Money"><strong>${formatEuro(l.price)}</strong>${l.unit?`<small>${esc(l.unit)}</small>`:''}${l.url?`<a href="${l.url}" target="_blank" rel="noopener">Voir le tarif ↗</a>`:''}</div></div>`}).join('')}</div>${!q.verified?'<div class="quoteUnverified">⚠️ Le produit principal de cette enseigne est une référence de gamme à vérifier dans le magasin/dépôt choisi. Il n’entre pas dans le classement du meilleur panier.</div>':''}</div></div>`}
}catch(_){}

try{render()}catch(_){}
