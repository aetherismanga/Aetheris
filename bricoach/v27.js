/* Bricoach V27 — enrichissement vidéos + subdivision Sol/Parquet/Vinyle */

/* ---------- Plus de vidéos, mêmes créateurs ---------- */
function v27PushUnique(arr,items){items.forEach(x=>{if(!arr.some(v=>v.id===x.id))arr.push(x)})}
try{
  v27PushUnique(V24_ERIC_VIDEOS,[
    {id:'uDDJqexOjEI',title:'TUTO Poser du carrelage 30×30 — technique, conseils et astuces',cat:'Pose',tags:['pose','30x30','sol','débutant','technique']},
    {id:'l9Aq5mexJd8',title:'Petites découpes carrelage : précision et astuces',cat:'Découpes',tags:['découpe','coupe','meuleuse','finition','ajustement']},
    {id:'m61Xr_UKKlo',title:'Croisillons nivelants PAVILIFT : utilisation et réglage',cat:'Autonivelant',tags:['autonivelant','pavilift','croisillons','pince','planéité']}
  ]);
  v27PushUnique(V25_VIDEOS['Peinture'],[
    {id:'0X-N33zYbR8',title:'Réparer un plafond après suppression d’une cloison',cat:'Réparation plafond',tags:['plafond','réparer','cloison','enduit','ponçage','rénovation']}
  ]);
  v27PushUnique(V25_VIDEOS['Placo / isolation'],[
    {id:'M-R-ssuLf4Q',title:'Quel enduit choisir pour coller ses bandes placo ?',cat:'Bandes',tags:['bandes','enduit','joint','collage','placo']},
    {id:'9vKgG1151y0',title:'Plafond placo : ossature, fourrures et isolation — série chantier',cat:'Plafond',tags:['plafond','fourrure','isolation','ossature','lisse']},
    {id:'I8UAfnNoobU',title:'Pied des plaques, chape et protection contre les remontées d’humidité',cat:'Mise en œuvre',tags:['plaque','sol','chape','humidité','polyane']},
    {id:'b5GyvaeFDuc',title:'Plafond placo autoporté / sous rampant',cat:'Plafond',tags:['plafond','autoporté','rampant','montants','ossature']}
  ]);
  v27PushUnique(V25_VIDEOS['Sol / parquet'],[
    {id:'rbUY7vmNl2Y',title:'Poser un sol stratifié avec système Clic+',cat:'Stratifié',tags:['stratifié','clic','clipser','pose','lames']},
    {id:'u35du83JzcU',title:'Poser un sol stratifié en point de Hongrie',cat:'Stratifié',tags:['stratifié','point de hongrie','calepinage','coupe','pose']}
  ]);
}catch(e){console.warn('V27 videos',e)}

/* ---------- Subdivision réelle du poste Sol / parquet ---------- */
const V27_FLOOR_TYPES={
  'Stratifié':{icon:'🪵',label:'Sol stratifié',desc:'Pose flottante clipsée, sous-couche et jeu périphérique.'},
  'Parquet contrecollé':{icon:'🌳',label:'Parquet contrecollé',desc:'Pose flottante ou collée, contrôle humidité et dilatation.'},
  'PVC / vinyle':{icon:'▦',label:'Vinyle / PVC',desc:'Pose clipsée ou collée sur support très plan.'}
};
function v27FloorType(d){return V27_FLOOR_TYPES[d?.floorProduct]?d.floorProduct:'Stratifié'}
function v27FloorInstall(type,d){let p=d?.floorInstall||'';if(type==='Stratifié')return 'Clipsée';if(type==='Parquet contrecollé')return ['Flottante','Collée'].includes(p)?p:'Flottante';return ['Clipsée','Collée'].includes(p)?p:'Clipsée'}
function v27SetFloorProduct(type){const q=v14Current();if(!q)return;q.work.details.floorProduct=type;q.work.details.floorInstall=type==='Stratifié'?'Clipsée':type==='Parquet contrecollé'?'Flottante':'Clipsée';q.work.steps=[];q.work.materials=[];renderWizard()}
function v27SetFloorInstall(mode){const q=v14Current();if(!q)return;q.work.details.floorInstall=mode;q.work.steps=[];q.work.materials=[];renderWizard()}

try{
  const v27BaseCategoryDetails=v14CategoryDetails;
  v14CategoryDetails=function(q){
    if(q.work.category!=='Sol / parquet')return v27BaseCategoryDetails(q);
    const d=q.work.details||{},type=v27FloorType(d),install=v27FloorInstall(type,d),installs=type==='Stratifié'?['Clipsée']:type==='Parquet contrecollé'?['Flottante','Collée']:['Clipsée','Collée'];
    return `<div class="v14DetailBlock v27FloorConfig"><label>Type de revêtement</label><div class="v27FloorChoices">${Object.entries(V27_FLOOR_TYPES).map(([k,x])=>`<button class="${type===k?'selected':''}" onclick='v27SetFloorProduct(${JSON.stringify(k)})'><span>${x.icon}</span><div><b>${esc(x.label)}</b><small>${esc(x.desc)}</small></div></button>`).join('')}</div><label>Méthode de pose</label><div class="v14ChoiceGrid">${installs.map(m=>`<button class="v14Choice ${install===m?'selected':''}" onclick='v27SetFloorInstall(${JSON.stringify(m)})'>${esc(m)}</button>`).join('')}</div><label>Support</label>${v14Choice(['Chape / ciment','Ancien carrelage','Ancien parquet','OSB / bois'],d.support,'support')}<div class="v14Toggles"><label><input type="checkbox" ${d.removeExisting?'checked':''} onchange="v14SetWork('removeExisting',this.checked,true)"><span><b>Dépose de l’ancien sol</b><small>Ajoute la dépose et la préparation au planning.</small></span></label></div><div class="v27FloorInfo"><b>${V27_FLOOR_TYPES[type].icon} ${esc(V27_FLOOR_TYPES[type].label)} · ${esc(install)}</b><span>${type==='Stratifié'?'Pas de colle : la planéité, la sous-couche et le jeu périphérique sont déterminants.':type==='Parquet contrecollé'&&install==='Collée'?'Support sec et très plan, colle parquet adaptée et transfert de colle régulier.':type==='Parquet contrecollé'?'Le bois doit être acclimaté ; contrôle humidité, sous-couche et dilatation.':install==='Collée'?'Le support doit être extrêmement lisse ; prévoir primaire/ragréage si nécessaire, colle et marouflage.':'Les lames PVC clipsées exigent un support très plan et les prescriptions de sous-couche du fabricant.'}</span></div></div>`;
  };
}catch(e){console.warn('V27 floor config',e)}

const V27_FLOOR_STEPS={
  'Stratifié':[
    'Contrôler la planéité, la propreté et l’humidité du support',
    'Acclimater les paquets dans la pièce',
    'Poser pare-vapeur et sous-couche si nécessaires',
    'Choisir le sens de pose et préparer le calepinage',
    'Poser et régler la première rangée',
    'Clipser les rangées suivantes et décaler les joints',
    'Réaliser les coupes, huisseries et seuils',
    'Retirer les cales et poser plinthes et profils'
  ],
  'Parquet contrecollé':{
    'Flottante':[
      'Contrôler planéité et humidité du support',
      'Acclimater et mélanger les lames des paquets',
      'Poser pare-vapeur et sous-couche adaptés',
      'Choisir le sens de pose et répartir les coupes',
      'Poser la première rangée avec jeu périphérique',
      'Assembler les rangées et décaler les joints',
      'Traiter les coupes, seuils et passages techniques',
      'Retirer les cales puis poser plinthes et profils'
    ],
    'Collée':[
      'Contrôler planéité, cohésion et humidité du support',
      'Acclimater le parquet et contrôler les conditions de la pièce',
      'Préparer le support et le primaire si le système le demande',
      'Tracer le sens de pose et faire une répartition à sec',
      'Appliquer la colle parquet à la spatule adaptée',
      'Poser les lames dans la colle et contrôler le transfert',
      'Réaliser les coupes et conserver les jeux périphériques',
      'Nettoyer les traces de colle puis poser les finitions après prise'
    ]
  },
  'PVC / vinyle':{
    'Clipsée':[
      'Contrôler un support très plan, propre et sec',
      'Acclimater les lames ou dalles PVC',
      'Vérifier si une sous-couche est autorisée ou intégrée',
      'Choisir le sens de pose et équilibrer les coupes',
      'Poser la première rangée avec le jeu prescrit',
      'Clipser les rangées suivantes sans forcer les assemblages',
      'Découper les lames, huisseries et passages techniques',
      'Poser plinthes, profils et finitions périphériques'
    ],
    'Collée':[
      'Déposer les anciens revêtements et contrôler le support',
      'Ragréer / lisser le support si nécessaire puis dépoussiérer',
      'Acclimater le vinyle et réaliser un calepinage à sec',
      'Appliquer le primaire si prévu par le système de colle',
      'Étaler la colle sur une zone adaptée au temps ouvert',
      'Poser les lames ou dalles puis maroufler soigneusement',
      'Réaliser les coupes et contrôler les joints',
      'Respecter le temps de prise puis poser plinthes et profils'
    ]
  }
};
function v27FloorSteps(details={}){const type=v27FloorType(details),install=v27FloorInstall(type,details);const x=V27_FLOOR_STEPS[type];return Array.isArray(x)?x:(x[install]||x[Object.keys(x)[0]])}
try{
  const v27BaseBuildSteps=buildSteps;
  buildSteps=function(category,room,details={}){if(category==='Sol / parquet')return v27FloorSteps(details).map(s=>[s,0]);return v27BaseBuildSteps(category,room,details)};
}catch(e){console.warn('V27 buildSteps',e)}

try{
  const v27BaseBuildMaterials=buildMaterials;
  buildMaterials=function(category,area,w={}){
    if(category!=='Sol / parquet')return v27BaseBuildMaterials(category,area,w);
    const a=Math.max(.1,Number(area)||0),type=v27FloorType(w),install=v27FloorInstall(type,w),order=Math.round(a*1.08*10)/10,m=[];
    if(type==='Stratifié'){
      m.push(['Sol stratifié',`${order} m²`,0],['Sous-couche compatible',`${Math.round(a*1.05*10)/10} m²`,0],['Pare-vapeur si support minéral',`${Math.round(a*1.05*10)/10} m²`,0],['Cales de dilatation','1 kit',0],['Plinthes','Selon périmètre',0],['Barres / profils de seuil','Selon passages',0]);
    }else if(type==='Parquet contrecollé'){
      m.push(['Parquet contrecollé',`${order} m²`,0]);
      if(install==='Collée')m.push(['Colle parquet adaptée',`≈ ${Math.ceil(a)} kg indicatif`,0],['Primaire compatible','Selon support / colle',0]);
      else m.push(['Sous-couche parquet',`${Math.round(a*1.05*10)/10} m²`,0],['Pare-vapeur si nécessaire',`${Math.round(a*1.05*10)/10} m²`,0]);
      m.push(['Cales de dilatation','1 kit',0],['Plinthes','Selon périmètre',0],['Profils / seuils','Selon passages',0]);
    }else{
      m.push(['Lames / dalles PVC vinyle',`${order} m²`,0]);
      if(install==='Collée')m.push(['Primaire sol si nécessaire','Selon support',0],['Ragréage / lissage si nécessaire','Selon état du support',0],['Colle PVC / vinyle',`≈ ${Math.ceil(a*.35)} kg indicatif`,0]);
      else m.push(['Sous-couche uniquement si autorisée par le fabricant',`${Math.round(a*1.05*10)/10} m² max`,0]);
      m.push(['Plinthes / profils de finition','Selon périmètre',0],['Barres de seuil','Selon passages',0]);
    }
    return m;
  };
}catch(e){console.warn('V27 buildMaterials',e)}

/* Outils spécifiques par type de sol */
try{
  V20_TOOL_CATALOG.moistureMeter={name:'Humidimètre',cat:'Sol / parquet',emoji:'💧',img:V20_ICON+'humidity.png',price:39,rent:0,desc:'Contrôle indicatif de l’humidité avant pose.'};
  V20_TOOL_CATALOG.vinylRoller={name:'Rouleau de marouflage sol',cat:'Sol / parquet',emoji:'🧻',img:V20_ICON+'paint-roller.png',price:35,rent:0,desc:'Maroufler les lames ou dalles PVC collées.'};
  V20_TOOL_CATALOG.vinylTrowel={name:'Spatule crantée colle sol',cat:'Sol / parquet',emoji:'🔺',img:V20_ICON+'trowel.png',price:18,rent:0,desc:'Appliquer la colle au grammage prescrit.'};
  const v27BaseToolIds=v20ToolIdsForWork;
  v20ToolIdsForWork=function(w){
    if(w.category!=='Sol / parquet')return v27BaseToolIds(w);
    const d=w.details||{},type=v27FloorType(d),install=v27FloorInstall(type,d);let ids=['tape','level','square','ppe','vacuum','kneepads'];
    if(type==='Stratifié')ids.push('jigsaw','cutter','tapping');
    else if(type==='Parquet contrecollé'){ids.push('jigsaw','tapping','moistureMeter');if(install==='Collée')ids.push('vinylTrowel','mallet')}
    else{ids.push('cutter');if(install==='Collée')ids.push('vinylTrowel','vinylRoller');else ids.push('tapping')}
    return [...new Set(ids)];
  };
}catch(e){console.warn('V27 tools',e)}

/* ---------- Tutoriels Sol : choix du sous-métier ---------- */
let v27FloorTutorialMode=null;
function v27OpenFloorTutorialChooser(){
  document.querySelector('#v27FloorTutorialChooser')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v27FloorTutorialChooser"><div class="modal v27FloorTutorialChooser"><div class="wizardTop"><div><div class="eyebrow">TUTORIELS SOL</div><h2>🪵 Quel revêtement veux-tu poser ?</h2></div><button class="close" onclick="document.querySelector('#v27FloorTutorialChooser').remove()">✕</button></div><p class="muted">Les méthodes sont séparées car la préparation, l’outillage et la pose sont réellement différents.</p><div class="v27FloorTutorialChoices">${Object.entries(V27_FLOOR_TYPES).map(([k,x])=>`<button onclick='v27StartFloorTutorial(${JSON.stringify(k)})'><span>${x.icon}</span><div><b>${esc(x.label)}</b><small>${esc(x.desc)}</small></div><strong>›</strong></button>`).join('')}</div></div></div>`);
}
let v27BaseOpenStandalone=null;
try{
  v27BaseOpenStandalone=v22OpenStandalone;
  v22OpenStandalone=function(cat){if(cat==='Sol / parquet'&&!v27FloorTutorialMode)return v27OpenFloorTutorialChooser();return v27BaseOpenStandalone(cat)};
}catch(e){console.warn('V27 tutorial chooser',e)}
function v27StartFloorTutorial(mode){v27FloorTutorialMode=mode;document.querySelector('#v27FloorTutorialChooser')?.remove();if(v27BaseOpenStandalone)v27BaseOpenStandalone('Sol / parquet')}

try{
  const v27BaseV22Steps=v22Steps;
  v22Steps=function(cat){if(cat==='Sol / parquet')return v27FloorSteps({floorProduct:v27FloorTutorialMode||'Stratifié',floorInstall:v27FloorTutorialMode==='Parquet contrecollé'?'Flottante':'Clipsée'});return v27BaseV22Steps(cat)};
}catch(e){console.warn('V27 standalone steps',e)}

function v27FloorGuide(type,name){
  const n=String(name).toLowerCase(),install=type==='Parquet contrecollé'?'flottante':type==='PVC / vinyle'?'clipsée':'clipsée';
  const common=(title,why,action,checks,errors,tools,expert)=>({title,why,beginner:action,diy:action,confirmed:`${action} Contrôle en plus les tolérances et les raccords avant de poursuivre.`,expert:expert||`Valide les tolérances fabricant, les interfaces et les points singuliers avant d’enchaîner.`,checks,errors,tools});
  if(/planéité|support|déposer|ragréer/.test(n))return common('Préparer et contrôler le support',type==='PVC / vinyle'?'Le vinyle révèle immédiatement les défauts du support et exige une surface très lisse.':'La stabilité du revêtement dépend directement d’un support plan, sec et propre.',type==='PVC / vinyle'?'Retire les résidus, contrôle bosses et creux, puis ragrée si nécessaire. Passe la main et une règle : aucune surépaisseur ne doit rester sous une lame.':'Aspire, contrôle la planéité avec une règle et vérifie l’humidité si le support ou le fabricant l’impose. Corrige les défauts avant la pose.',['Support propre et sec','Planéité contrôlée','Défauts corrigés','Ancien revêtement stable ou déposé'],['Poser sur poussière','Masquer un creux avec la sous-couche','Négliger une humidité anormale'],['Aspirateur','Règle / niveau','Humidimètre si nécessaire','Ragréage si besoin'],type==='PVC / vinyle'?'Contrôle de planéité très serré, cohésion, porosité et compatibilité primaire/colle si pose collée.':'Contrôle humidité, planéité, cohésion et exigences du fabricant du revêtement.');
  if(/acclimater/.test(n))return common('Acclimater le revêtement','Les matériaux doivent se stabiliser dans les conditions de la pièce avant la pose.',type==='Stratifié'?'Pose les paquets à plat dans la pièce pendant le délai prévu par le fabricant, sans les ouvrir inutilement.':type==='Parquet contrecollé'?'Stocke le parquet à plat dans la pièce, protège-le des courants d’air et respecte le temps d’acclimatation indiqué.':'Entrepose les lames ou dalles dans la pièce, à plat, à la température de pose indiquée par le fabricant.',['Température de la pièce stable','Paquets à plat','Délai fabricant respecté'],['Stocker dans un garage froid puis poser immédiatement','Appuyer les paquets contre un mur humide'],['Thermomètre','Hygromètre si nécessaire'], 'Contrôle température/hygrométrie et conditions de stockage avant ouverture des paquets.');
  if(/sous-couche|pare-vapeur|primaire/.test(n))return common(type==='PVC / vinyle'?'Préparer le système sous le revêtement':'Poser sous-couche et pare-vapeur','La couche sous le revêtement doit être compatible avec le support et le produit.',type==='PVC / vinyle'?'Ne mets jamais une sous-couche “par habitude”. Vérifie si elle est intégrée ou autorisée. En pose collée, suis le système primaire + colle prévu.':'Déroule la sous-couche sans plis. Sur support minéral, pose le pare-vapeur uniquement selon les prescriptions du système choisi.',['Compatibilité vérifiée','Lés jointifs','Pas de plis','Recouvrements / adhésifs conformes'],['Cumuler deux sous-couches','Mettre une sous-couche sous un vinyle collé','Percer inutilement le pare-vapeur'],['Cutter','Ruban adapté','Sous-couche / primaire'], 'Valide la compatibilité support–pare-vapeur–sous-couche–revêtement et les performances acoustiques demandées.');
  if(/sens|calepinage|répartition|tracer/.test(n))return common('Choisir le sens de pose et le calepinage','Un bon départ évite les petites bandes et les décalages visibles.',`Mesure la largeur de la pièce et calcule la largeur de la dernière rangée. Ajuste la première rangée si nécessaire. Choisis le sens selon la pièce, la lumière et les contraintes du revêtement.`,['Dernière rangée pas trop étroite','Axes et portes anticipés','Motifs / teintes répartis'],['Démarrer sans calculer la dernière rangée','Aligner tous les joints de bout'],['Mètre','Équerre','Cordeau / laser'], 'Optimise axes, rythmes de joints, seuils, changements de pièces et raccords visuels.');
  if(/première rangée|premiere rangée/.test(n))return common('Poser la première rangée','Toute la géométrie du sol dépend de cette première ligne.',type==='PVC / vinyle'?'Pose les premières lames parfaitement droites et respecte le jeu indiqué si le système clipsé l’exige.':'Place les cales périphériques, assemble les premières lames et contrôle l’alignement avant d’aller plus loin.',['Rangée droite','Jeu périphérique régulier','Assemblages fermés'],['Forcer un clic mal engagé','Négliger un mur faux','Oublier les cales'],['Cales','Maillet','Kit de pose','Règle'], 'Contrôle ligne de référence, rectitude, jeu périphérique et contraintes des seuils avant la deuxième rangée.');
  if(/clipser|assembler|rangées suivantes/.test(n))return common('Poursuivre la pose et décaler les joints','Le bon emboîtement évite jeux, grincements et fragilité des assemblages.',`Décale les joints de bout selon le minimum du fabricant. Engage chaque lame sans forcer et contrôle régulièrement que les rangées restent parallèles.`,['Joints décalés','Pas de jour entre lames','Rangées parallèles'],['Frapper directement sur la languette','Forcer une lame mal engagée','Aligner les joints de bout'],['Kit de frappe','Maillet','Équerre'], 'Surveille rectitude cumulative, qualité des clics et dilatation sur grandes longueurs.');
  if(/colle|maroufler|marouflage|transfert/.test(n))return common('Encoller et poser',type==='Parquet contrecollé'?'Une pose collée exige un transfert de colle suffisant et un support compatible.':'Le collage du vinyle dépend du bon grammage, du temps ouvert et du marouflage.',type==='Parquet contrecollé'?'Étale la colle avec la spatule prescrite sur une petite zone. Pose les lames dans la colle, presse-les et nettoie immédiatement les débordements.':'Étale la colle au bon grammage, respecte son temps de gommage/ouvert puis pose les éléments et maroufle dans les deux sens.',['Spatule adaptée','Temps ouvert respecté','Bon transfert de colle','Traces nettoyées immédiatement'],['Encoller une trop grande zone','Marcher sur le revêtement avant prise','Laisser sécher la colle sur la surface'],['Spatule crantée','Colle adaptée','Chiffons','Rouleau de marouflage si vinyle'], 'Contrôle consommation au m², transfert de colle, temps ouvert, température et pression de marouflage.');
  if(/coupe|huisserie|seuil|passage/.test(n))return common('Réaliser les coupes et passages','Les finitions autour des huisseries et seuils font la différence visuelle.',type==='PVC / vinyle'?'Reporte précisément les formes. Coupe au cutter selon l’épaisseur et le type de produit, sans créer de contrainte dans la lame.':'Trace les coupes en tenant compte du jeu périphérique. Utilise une scie adaptée et présente à blanc avant assemblage.',['Jeu périphérique conservé','Coupe propre','Profil de seuil prévu'],['Couper trop serré contre le mur','Oublier l’épaisseur du profil','Faire éclater la face décorative'],['Cutter ou scie sauteuse','Équerre','Gabarit / crayon'], 'Anticipe profils, jeux de dilatation, raccords multi-pièces et sens d’éclatement de l’outil.');
  return common('Finitions périphériques','Les plinthes et profils masquent les jeux mais ne doivent jamais bloquer un sol flottant.',`Retire les cales, vérifie que le sol reste libre en périphérie puis fixe les plinthes au mur, jamais au revêtement. Pose les profils de seuil sans empêcher les mouvements nécessaires.`,['Cales retirées','Plinthes fixées au mur','Jeux non bloqués','Seuils propres'],['Visser une plinthe dans le sol','Remplir le jeu périphérique avec un matériau rigide','Bloquer le revêtement sous un profil'],['Scie / boîte à onglet','Colle ou clips de plinthes','Profils de seuil'], 'Contrôle liberté périphérique, fractionnements et raccords avec huisseries avant réception.');
}
try{
  const v27BaseGuide=v22Guide;
  v22Guide=function(cat,name,level){if(cat==='Sol / parquet')return v27FloorGuide(v27FloorTutorialMode||'Stratifié',name);return v27BaseGuide(cat,name,level)};
}catch(e){console.warn('V27 guides',e)}

/* Quand on ferme la bibliothèque sol, le prochain accès repropose le type. */
const v27Observe=new MutationObserver(()=>{if(!document.querySelector('#v22Standalone')&&!document.querySelector('#v27FloorTutorialChooser'))v27FloorTutorialMode=null});
v27Observe.observe(document.body,{childList:true,subtree:false});

/* ---------- Vidéothèque : sous-filtres pour les sols ---------- */
let v27FloorVideoFilter='';
function v27FloorFilterOf(v){const h=v26Normalize([v.cat,...(v.tags||[]),v.title].join(' '));if(h.includes('vinyle')||h.includes('pvc'))return'Vinyle / PVC';if(h.includes('parquet')&&!h.includes('stratifie'))return'Parquet';if(h.includes('stratifie'))return'Stratifié';return'Autres'}
function v27SetFloorVideoFilter(v){v27FloorVideoFilter=v;v26RenderVideoHub()}
try{
  const v27BaseSelectTrade=v26SelectVideoTrade;
  v26SelectVideoTrade=function(trade){v27FloorVideoFilter='';v27BaseSelectTrade(trade)};
  const v27BaseClearTrade=v26ClearVideoTrade;
  v26ClearVideoTrade=function(){v27FloorVideoFilter='';v27BaseClearTrade()};
  const v27BaseRenderHub=v26RenderVideoHub;
  v26RenderVideoHub=function(){
    v27BaseRenderHub();
    if(v26VideoTrade!=='Sol / parquet')return;
    const body=document.getElementById('v26VideoHubBody');if(!body)return;
    const head=body.querySelector('.v26ResultsHead');if(!head)return;
    const filters=document.createElement('div');filters.className='v27FloorVideoFilters';filters.innerHTML=['','Stratifié','Parquet','Vinyle / PVC'].map(f=>`<button class="${v27FloorVideoFilter===f?'active':''}" onclick='v27SetFloorVideoFilter(${JSON.stringify(f)})'>${f||'Tous les sols'}</button>`).join('');head.insertAdjacentElement('afterend',filters);
    if(v27FloorVideoFilter){
      const cards=[...body.querySelectorAll('.v26VideoCard')],catalog=v26VideoCatalog().filter(v=>v.trade==='Sol / parquet'&&v26VideoMatches(v,v26VideoQuery.trim())).filter(v=>v27FloorFilterOf(v)===v27FloorVideoFilter);
      body.querySelector('.v26VideoGrid')?.remove();body.querySelector('.v26Empty')?.remove();
      filters.insertAdjacentHTML('afterend',catalog.length?`<div class="v26VideoGrid">${catalog.map(v26VideoCard).join('')}</div>`:`<div class="v26Empty"><span>🔎</span><b>Aucune vidéo dans ce sous-métier</b><small>La bibliothèque continuera de s’enrichir.</small></div>`);
      const small=head.querySelector('small');if(small)small.textContent=`${catalog.length} résultat${catalog.length>1?'s':''} · ${v27FloorVideoFilter}`;
    }
  };
}catch(e){console.warn('V27 video filter',e)}

requestAnimationFrame(()=>{try{v21PatchNavigation?.()}catch(_){}});
