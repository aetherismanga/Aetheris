let v19CalcTrade='Carrelage';
const v19BaseBuildMaterials=buildMaterials;

function v19Num(v,d=0){const n=Number(String(v??'').replace(',','.'));return Number.isFinite(n)?n:d}
function v19Fmt(n,d=1){return Number(n||0).toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d})}
function v19TileClipRate(format){return {'30 × 60':20,'60 × 60':14,'60 × 120':10,'80 × 80':10,'120 × 120':8,'Mosaïque':0}[format]??14}
function v19TileGlueRate(format){if(format==='120 × 120')return 6.5;if(['60 × 120','80 × 80'].includes(format))return 5.5;return 4.5}
function v19TileLoss(format,pose){let p={'30 × 60':8,'60 × 60':10,'60 × 120':12,'80 × 80':12,'120 × 120':15,'Mosaïque':10}[format]??10;if(pose==='Diagonale')p+=5;return p}

buildMaterials=function(category,area,w={}){
  const mats=v19BaseBuildMaterials(category,area,w);
  if(category!=='Carrelage')return mats;
  const d=ensureWizardDetails({...w}),rate=v19TileClipRate(d.tileFormat);
  const i=mats.findIndex(m=>/Croisillons|nivelants/i.test(m[0]));
  if(rate===0){if(i>=0)mats.splice(i,1,['Croisillons adaptés mosaïque','Selon trame et largeur de joint',0]);return mats}
  const clips=Math.max(1,Math.ceil((Number(area)||1)*rate));
  const wedges=Math.max(50,Math.ceil(clips*.55/50)*50);
  const repl=[['Croisillons autonivelants à pince',`${clips} pièces`,0],['Cales réutilisables pour autonivelants',`${wedges} pièces env.`,0],['Pince de serrage autonivelante','1 pince',0]];
  if(i>=0)mats.splice(i,1,...repl);else mats.push(...repl);
  return mats;
};

try{
  const base=v12AccessoryLines;
  v12AccessoryLines=function(...args){return base(...args).map(x=>/nivelants/i.test(x.name)?{...x,name:x.name.replace(/nivelants/ig,'système autonivelant à pince'),product:(x.product||'').replace(/nivelants/ig,'croisillons + cales + pince autonivelante')}:x)};
}catch(_){}

function v19CalcTabs(){return `<div class="v19CalcTabs">${V14_WORKS.map(c=>`<button class="${v19CalcTrade===c?'active':''}" onclick='v19SetCalcTrade(${JSON.stringify(c)})'><span>${meta[c]?.[2]||'🔧'}</span><b>${esc(c)}</b></button>`).join('')}</div>`}
function v19SetCalcTrade(cat){v19CalcTrade=cat;document.querySelectorAll('.v19CalcTabs button').forEach(b=>b.classList.toggle('active',b.textContent.includes(cat.split(' / ')[0])));const box=document.getElementById('v19CalcTool');if(box)box.innerHTML=v19CalculatorBody();v19Recalc()}

function v19CalculatorBody(){
  if(v19CalcTrade==='Carrelage')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🧱</span><div><h3>Calculateur carrelage</h3><p>Carrelage, colle, joint et système autonivelant à pince.</p></div></div><div class="v19Fields"><label>Surface nette (m²)<input id="v19Area" type="number" value="20" min="0.5" step="0.5" oninput="v19Recalc()"></label><label>Format<select id="v19Format" onchange="v19Recalc()"><option>30 × 60</option><option selected>60 × 60</option><option>60 × 120</option><option>80 × 80</option><option>120 × 120</option><option>Mosaïque</option></select></label><label>Pose<select id="v19Pose" onchange="v19Recalc()"><option selected>Droite</option><option>Décalée</option><option>Diagonale</option></select></label></div><div id="v19CalcResult"></div></div>`;
  if(v19CalcTrade==='Peinture')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🎨</span><div><h3>Calculateur peinture</h3><p>Peinture de finition, nombre de couches et sous-couche.</p></div></div><div class="v19Fields"><label>Surface à peindre (m²)<input id="v19Area" type="number" value="60" min="1" step="1" oninput="v19Recalc()"></label><label>Nombre de couches<select id="v19Coats" onchange="v19Recalc()"><option>1</option><option selected>2</option><option>3</option></select></label><label>Rendement peinture<select id="v19Yield" onchange="v19Recalc()"><option value="8">8 m²/L</option><option value="10" selected>10 m²/L</option><option value="12">12 m²/L</option></select></label><label class="v19Check"><input id="v19Primer" type="checkbox" checked onchange="v19Recalc()"> Prévoir une sous-couche</label></div><div id="v19CalcResult"></div></div>`;
  if(v19CalcTrade==='Sol / parquet')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🪵</span><div><h3>Calculateur sol / parquet</h3><p>Revêtement, marge de coupe, sous-couche et plinthes.</p></div></div><div class="v19Fields"><label>Surface nette (m²)<input id="v19Area" type="number" value="25" min="1" step="0.5" oninput="v19Recalc()"></label><label>Type<select id="v19FloorType" onchange="v19Recalc()"><option>Stratifié</option><option>Parquet contrecollé</option><option>PVC / vinyle</option></select></label><label>Marge de coupe<select id="v19FloorLoss" onchange="v19Recalc()"><option value="5">5 %</option><option value="8" selected>8 %</option><option value="10">10 %</option></select></label><label>Périmètre plinthes (ml)<input id="v19Perimeter" type="number" value="20" min="0" step="0.5" oninput="v19Recalc()"></label></div><div id="v19CalcResult"></div></div>`;
  return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🧰</span><div><h3>Calculateur placo / isolation</h3><p>Plaques, vis, bandes, enduit et isolant.</p></div></div><div class="v19Fields"><label>Surface à réaliser (m²)<input id="v19Area" type="number" value="30" min="1" step="0.5" oninput="v19Recalc()"></label><label>Type de plaque<select id="v19Plate" onchange="v19Recalc()"><option>BA13 standard</option><option>Hydrofuge</option><option>Phonique</option><option>Feu</option></select></label><label>Format plaque<select id="v19PlateSize" onchange="v19Recalc()"><option value="3" selected>1,20 × 2,50 m = 3 m²</option><option value="3.12">1,20 × 2,60 m = 3,12 m²</option></select></label><label class="v19Check"><input id="v19Insulation" type="checkbox" checked onchange="v19Recalc()"> Prévoir l'isolation</label></div><div id="v19CalcResult"></div></div>`;
}
function v19ResultRow(name,value,note=''){return `<div class="v19ResultRow"><div><b>${name}</b>${note?`<small>${note}</small>`:''}</div><strong>${value}</strong></div>`}
function v19Recalc(){
  const el=document.getElementById('v19CalcResult');if(!el)return;
  const area=Math.max(.1,v19Num(document.getElementById('v19Area')?.value,1));let rows='';
  if(v19CalcTrade==='Carrelage'){
    const f=document.getElementById('v19Format')?.value||'60 × 60',pose=document.getElementById('v19Pose')?.value||'Droite',loss=v19TileLoss(f,pose),order=area*(1+loss/100),bags=Math.ceil(area*v19TileGlueRate(f)/25),joint=Math.max(1,Math.ceil(area*(f==='30 × 60'?.4:.25))),rate=v19TileClipRate(f),clips=Math.ceil(area*rate),wedges=Math.max(50,Math.ceil(clips*.55/50)*50);
    rows+=v19ResultRow('Carrelage à commander',`${v19Fmt(order)} m²`,`Marge de coupe : ${loss} %`)+v19ResultRow('Colle C2S1',`${bags} sac${bags>1?'s':''} de 25 kg`,`Consommation indicative selon format`)+v19ResultRow('Joint',`≈ ${joint} kg`);
    if(rate)rows+=v19ResultRow('Croisillons autonivelants à pince',`${clips} pièces`,`Base indicative : ${rate}/m²`)+v19ResultRow('Cales réutilisables',`≈ ${wedges} pièces`,`Réutilisables au fur et à mesure de la pose`)+v19ResultRow('Pince autonivelante','1 pince','Réglée selon l’épaisseur du carreau');else rows+=v19ResultRow('Calage mosaïque','Croisillons adaptés','Le système à pince n’est généralement pas utilisé sur mosaïque');
  }else if(v19CalcTrade==='Peinture'){
    const coats=v19Num(document.getElementById('v19Coats')?.value,2),yieldM=v19Num(document.getElementById('v19Yield')?.value,10),litres=area*coats/yieldM,pots10=Math.ceil(litres/10),primer=document.getElementById('v19Primer')?.checked;
    rows+=v19ResultRow('Peinture de finition',`≈ ${v19Fmt(litres)} L`,`${coats} couche${coats>1?'s':''} · rendement ${yieldM} m²/L`)+v19ResultRow('Conditionnement indicatif',`${pots10} pot${pots10>1?'s':''} de 10 L`);if(primer)rows+=v19ResultRow('Sous-couche',`≈ ${v19Fmt(area/10)} L`,'À ajuster au rendement du produit choisi');
  }else if(v19CalcTrade==='Sol / parquet'){
    const loss=v19Num(document.getElementById('v19FloorLoss')?.value,8),order=area*(1+loss/100),per=v19Num(document.getElementById('v19Perimeter')?.value,0),type=document.getElementById('v19FloorType')?.value||'Stratifié';
    rows+=v19ResultRow(type,`${v19Fmt(order)} m²`,`Surface + ${loss} % de coupe`)+v19ResultRow('Sous-couche',`${v19Fmt(area*1.05)} m²`,'Hors PVC avec sous-couche intégrée ou pose collée')+(per?v19ResultRow('Plinthes',`${v19Fmt(per*1.08)} ml`,'Périmètre + 8 % de marge'):'');
  }else{
    const size=v19Num(document.getElementById('v19PlateSize')?.value,3),plates=Math.ceil(area*1.10/size),screws=Math.ceil(area*20/100)*100,tape=Math.ceil(area*.7),coat=Math.max(5,Math.ceil(area*.35)),ins=document.getElementById('v19Insulation')?.checked;
    rows+=v19ResultRow('Plaques',`${plates} plaque${plates>1?'s':''}`,`≈ ${v19Fmt(area*1.10)} m² avec 10 % de marge`)+v19ResultRow('Vis placo',`≈ ${screws} vis`)+v19ResultRow('Bande à joint',`≈ ${tape} ml`)+v19ResultRow('Enduit à joint',`≈ ${coat} kg`);if(ins)rows+=v19ResultRow('Isolation',`≈ ${v19Fmt(area*1.05)} m²`,'Marge indicative 5 %');
  }
  el.innerHTML=`<div class="v19Results">${rows}</div><div class="v19CalcNote">Calcul indicatif : toujours vérifier le rendement et les prescriptions du fabricant du produit choisi.</div>`;
}

function calcPage(){
  const shopping=projects.length?`<div class="card v19Shopping"><h3>Listes de courses de mes chantiers</h3>${projects.map(p=>`<div class="shopping"><b>${esc(p.title)}</b>${(p.materials||[]).slice(0,12).map((m,i)=>`<label class="shopItem ${m[2]?'done':''}"><input type="checkbox" ${m[2]?'checked':''} onchange="toggleMat(${p.id},${i})"><span>${esc(m[0])}</span><b>${esc(m[1])}</b></label>`).join('')}</div>`).join('')}</div>`:'';
  setTimeout(v19Recalc,0);
  return `<div class="pageTitle"><h2>🧮 Calculs par métier</h2><div class="muted">Choisis le poste : les quantités se recalculent immédiatement.</div></div>${v19CalcTabs()}<div id="v19CalcTool">${v19CalculatorBody()}</div><div class="v19CalcTutorial"><div><b>🎓 Besoin de savoir comment faire ?</b><span>Ouvre le tutoriel adapté à ton niveau pour ce métier.</span></div><button class="btn soft" onclick="openTutorialLibrary(v19CalcTrade)">Voir le tutoriel →</button></div>${shopping}`;
}

function v19TutorialSteps(cat){
  const d=ensureWizardDetails({});
  if(cat==='Carrelage')return ['Contrôler et préparer le support','Faire le calepinage et les tracés','Préparer la colle','Encoller et poser les carreaux','Mettre les croisillons autonivelants, les cales et serrer à la pince','Contrôler planéité et alignements','Retirer les croisillons au bon moment','Réaliser les joints et les finitions'];
  if(cat==='Peinture')return ['Protéger la pièce','Lessiver / dépoussiérer','Reboucher et poncer','Appliquer la sous-couche si nécessaire','Faire les angles et réchampis','Appliquer la première couche','Appliquer la deuxième couche','Retirer les protections et contrôler'];
  if(cat==='Sol / parquet')return ['Contrôler le support','Acclimater le revêtement si nécessaire','Poser la sous-couche','Tracer et choisir le sens de pose','Poser les premières rangées','Maintenir le jeu périphérique','Réaliser les coupes et seuils','Poser les plinthes et finitions'];
  return ['Tracer le chantier','Poser rails et montants','Mettre l’isolation si prévue','Poser les plaques','Contrôler vissage et joints','Poser les bandes','Enduire en plusieurs passes','Poncer et préparer la finition'];
}
function openTutorialLibrary(cat='Carrelage'){
  const level=typeof v18Level==='function'?v18Level(cat):'Bricoleur',t=typeof v18Tutorial==='function'?v18Tutorial(cat,level):{intro:'Tutoriel adapté à ton niveau.',tips:[]},steps=v19TutorialSteps(cat);
  document.querySelector('#v19TutorialModal')?.remove();
  document.body.insertAdjacentHTML('beforeend',`<div class="modalBack" id="v19TutorialModal"><div class="modal v19TutorialModal"><div class="wizardTop"><div><div class="eyebrow">BIBLIOTHÈQUE TUTORIELS</div><h2>${meta[cat]?.[2]||'🔧'} ${esc(cat)}</h2></div><button class="close" onclick="document.querySelector('#v19TutorialModal').remove()">✕</button></div><div class="v19TutorialLevel"><b>Niveau ${esc(level)}</b><span>${esc(t.intro||'')}</span><button class="btn soft" onclick="document.querySelector('#v19TutorialModal').remove();openProfileSettings()">Modifier mon niveau</button></div><div class="v19TutorialSteps">${steps.map((s,i)=>`<section><span>${i+1}</span><div><b>${esc(s)}</b><small>${level==='Débutant'?'Explication détaillée avec contrôles avant de continuer.':level==='Expert'?'Focus sur tolérances, compatibilités et points critiques.':'Étape, contrôle et points de vigilance.'}</small></div></section>`).join('')}</div>${t.tips?.length?`<div class="v15TutorTips"><h3>Points de vigilance</h3>${t.tips.map(x=>`<div>✓ ${esc(x)}</div>`).join('')}</div>`:''}</div></div>`);
}
function v19TutorialHome(){return `<section class="v19TutorialHome"><div class="v19TutorialHomeHead"><div><div class="eyebrow">TUTORIELS</div><h2>Apprendre avant de commencer</h2><p>Chaque tutoriel utilise ton niveau défini pour le métier concerné.</p></div></div><div class="v19TutorialGrid">${V14_WORKS.map(c=>`<button onclick='openTutorialLibrary(${JSON.stringify(c)})'><span>${meta[c]?.[2]||'🔧'}</span><div><b>${esc(c)}</b><small>Niveau ${typeof v18Level==='function'?esc(v18Level(c)):'Bricoleur'}</small></div><strong>Ouvrir →</strong></button>`).join('')}</div></section>`}
try{const b=home;home=function(){const html=b(),block=v19TutorialHome(),marker='<div class="grid">';return html.includes(marker)?html.replace(marker,block+marker):html+block}}catch(_){}
try{render()}catch(_){}