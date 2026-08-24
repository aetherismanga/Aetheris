/* Bricoach V28 — Plomberie/Sanitaire, Électricité, Maçonnerie */
(function(){
const NEW=['Plomberie / sanitaire','Électricité','Maçonnerie'];
NEW.forEach(c=>{if(!V14_WORKS.includes(c))V14_WORKS.push(c)});
Object.assign(meta,{
 'Plomberie / sanitaire':['Plomberie / sanitaire','Alimentations, évacuations et équipements sanitaires.','🚿'],
 'Électricité':['Électricité','Circuits, prises, éclairage et protections.','⚡'],
 'Maçonnerie':['Maçonnerie','Béton, dalle, chape, parpaings et enduits.','🧱']
});
Object.assign(images,{
 'Plomberie / sanitaire':'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1400&q=88',
 'Électricité':'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=88',
 'Maçonnerie':'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=88'
});
try{NEW.forEach(c=>{if(!v15Profile.skills[c])v15Profile.skills[c]='Bricoleur'});v18Save()}catch(_){}

const V28_PLUMBING_TYPES={
 'Alimentation multicouche':{icon:'🔵',desc:'Réseau EF/ECS, raccords à sertir et collecteurs.'},
 'Alimentation PER':{icon:'🔴',desc:'Réseau PER sous gaine, raccords et nourrices.'},
 'Évacuation PVC':{icon:'⬜',desc:'Évier, lavabo, douche, WC : pentes, diamètres et raccords.'},
 'WC à poser':{icon:'🚽',desc:'Remplacement ou création d’un WC au sol.'},
 'WC suspendu':{icon:'🚽',desc:'Bâti-support, alimentation, évacuation et cuvette.'},
 'Lavabo / vasque':{icon:'🚰',desc:'Vasque, siphon, robinetterie et raccordements.'},
 'Douche / receveur':{icon:'🚿',desc:'Receveur, bonde, alimentation et colonne.'}
};
const V28_ELEC_TYPES={
 'Prises de courant':{icon:'🔌',desc:'Création ou rénovation de circuits prises.'},
 'Éclairage / interrupteurs':{icon:'💡',desc:'Points lumineux, DCL et commandes.'},
 'Circuit spécialisé':{icon:'⚡',desc:'Four, plaque, lave-linge ou autre départ dédié.'},
 'Tableau électrique':{icon:'🧰',desc:'Organisation, protections et repérage du tableau.'},
 'Réseau RJ45':{icon:'🌐',desc:'Câblage réseau et prises de communication.'}
};
const V28_MASON_TYPES={
 'Dalle béton':{icon:'⬛',desc:'Dalle, terrasse ou petite plateforme béton.'},
 'Chape':{icon:'▤',desc:'Chape traditionnelle ou mortier de nivellement.'},
 'Ragréage':{icon:'◻️',desc:'Correction de planéité avant revêtement.'},
 'Mur en parpaings':{icon:'🧱',desc:'Muret ou mur maçonné avec mortier.'},
 'Enduit ciment':{icon:'🪣',desc:'Gobetis, corps d’enduit et finition.'},
 'Scellement / petit béton':{icon:'🔩',desc:'Poteau, seuil, scellement ou petite reprise.'}
};
function cards(obj,current,fn){return `<div class="v28SubGrid">${Object.entries(obj).map(([k,v])=>`<button class="${current===k?'selected':''}" onclick='${fn}(${JSON.stringify(k)})'><span>${v.icon}</span><div><b>${esc(k)}</b><small>${esc(v.desc)}</small></div></button>`).join('')}</div>`}

const baseDefaults=v14WorkDefaults;
v14WorkDefaults=function(c,r=''){
 const w=baseDefaults(c,r);const d=w.details||{};
 if(c==='Plomberie / sanitaire'){Object.assign(d,{plumbingType:'Alimentation multicouche',pipeLength:10,pipeDiameter:'16 mm',fixtureCount:1,pvcDiameter:'40 mm'});}
 if(c==='Électricité'){Object.assign(d,{electricType:'Prises de courant',pointCount:4,cableLength:25,cableSection:'2,5 mm²',embedded:true});}
 if(c==='Maçonnerie'){Object.assign(d,{masonryType:'Dalle béton',thickness:10,wallLength:3,wallHeight:1,blockType:'20 × 20 × 50 cm'});}
 w.details=d;return w;
};
function v28SetType(key,val){const q=v14Current();if(!q)return;q.work.details[key]=val;q.work.steps=[];q.work.materials=[];renderWizard()}
window.v28SetPlumbing=v=>v28SetType('plumbingType',v);window.v28SetElectric=v=>v28SetType('electricType',v);window.v28SetMasonry=v=>v28SetType('masonryType',v);

const baseCatDetails=v14CategoryDetails;
v14CategoryDetails=function(q){const w=q.work,d=w.details||{};
 if(w.category==='Plomberie / sanitaire')return `<div class="v14DetailBlock"><label>Travaux de plomberie</label>${cards(V28_PLUMBING_TYPES,d.plumbingType,'v28SetPlumbing')}<label>Longueur estimée de réseau</label><div class="bigInput"><input type="number" min="1" step="1" value="${d.pipeLength||10}" oninput="v14Current().work.details.pipeLength=Number(this.value)||0"><span>m</span></div>${/Alimentation/.test(d.plumbingType)?`<label>Diamètre principal</label>${v14Choice(['12 mm','16 mm','20 mm','26 mm'],d.pipeDiameter,'pipeDiameter')}`:''}${d.plumbingType==='Évacuation PVC'?`<label>Diamètre PVC principal</label>${v14Choice(['32 mm','40 mm','50 mm','100 mm'],d.pvcDiameter,'pvcDiameter')}`:''}${/WC|Lavabo|Douche/.test(d.plumbingType)?`<label>Nombre d’équipements</label><div class="bigInput"><input type="number" min="1" step="1" value="${d.fixtureCount||1}" oninput="v14Current().work.details.fixtureCount=Number(this.value)||1"><span>u.</span></div>`:''}<div class="v28Safety info"><b>💧 Conseil</b><span>Bricoach calcule les raccords et longueurs de base. Les raccordements réels restent à ajuster au plan et aux prescriptions des fabricants.</span></div></div>`;
 if(w.category==='Électricité')return `<div class="v14DetailBlock"><label>Travaux électriques</label>${cards(V28_ELEC_TYPES,d.electricType,'v28SetElectric')}<label>Nombre de points</label><div class="bigInput"><input type="number" min="1" step="1" value="${d.pointCount||4}" oninput="v14Current().work.details.pointCount=Number(this.value)||1"><span>pts</span></div><label>Longueur estimée de câble / gaine</label><div class="bigInput"><input type="number" min="1" step="1" value="${d.cableLength||25}" oninput="v14Current().work.details.cableLength=Number(this.value)||0"><span>m</span></div>${d.electricType!=='Réseau RJ45'?`<label>Section principale</label>${v14Choice(['1,5 mm²','2,5 mm²','6 mm²'],d.cableSection,'cableSection')}`:''}<div class="v14Toggles"><label><input type="checkbox" ${d.embedded?'checked':''} onchange="v14SetWork('embedded',this.checked,true)"><span><b>Pose encastrée</b><small>Prévoit gaines, boîtes et rebouchage.</small></span></label></div><div class="v28Safety danger"><b>⚠️ Sécurité électrique</b><span>Travail hors tension, condamnation de la coupure et vérification d’absence de tension avec un VAT adapté. Pour une installation complète ou en cas de doute, intervention d’un électricien qualifié.</span></div></div>`;
 if(w.category==='Maçonnerie')return `<div class="v14DetailBlock"><label>Travaux de maçonnerie</label>${cards(V28_MASON_TYPES,d.masonryType,'v28SetMasonry')}${['Dalle béton','Chape','Ragréage'].includes(d.masonryType)?`<label>Épaisseur moyenne</label><div class="bigInput"><input type="number" min="1" step="1" value="${d.thickness||10}" oninput="v14Current().work.details.thickness=Number(this.value)||0"><span>cm</span></div>`:''}${d.masonryType==='Mur en parpaings'?`<label>Longueur du mur</label><div class="bigInput"><input type="number" min="0.5" step="0.5" value="${d.wallLength||3}" oninput="v14Current().work.details.wallLength=Number(this.value)||0"><span>m</span></div><label>Hauteur du mur</label><div class="bigInput"><input type="number" min="0.5" step="0.5" value="${d.wallHeight||1}" oninput="v14Current().work.details.wallHeight=Number(this.value)||0"><span>m</span></div><label>Bloc</label>${v14Choice(['20 × 20 × 50 cm','15 × 20 × 50 cm','10 × 20 × 50 cm'],d.blockType,'blockType')}`:''}<div class="v28Safety info"><b>🧱 Structure</b><span>Les ouvrages porteurs, fondations, linteaux et reprises structurelles nécessitent un dimensionnement adapté au bâtiment et au sol.</span></div></div>`;
 return baseCatDetails(q);
};

const baseSuggested=v14SuggestedArea;
v14SuggestedArea=function(l,w){if(w.category==='Plomberie / sanitaire')return Math.max(1,Number(w.details?.pipeLength)||10);if(w.category==='Électricité')return Math.max(1,Number(w.details?.pointCount)||1);if(w.category==='Maçonnerie'){const d=w.details||{};if(d.masonryType==='Mur en parpaings')return Math.max(.5,(Number(d.wallLength)||0)*(Number(d.wallHeight)||0));return v14LocationFloor(l)||Number(w.area)||1}return baseSuggested(l,w)};

const V28_STEPS={
 'Plomberie / sanitaire':{
  'Alimentation multicouche':['Repérer les appareils et tracer le réseau','Couper l’eau et sécuriser la zone','Préparer tubes, gaines et passages','Couper, calibrer et ébavurer les tubes','Cintrer et positionner le multicouche','Sertir les raccords avec le bon profil','Fixer et protéger le réseau','Remettre en eau et contrôler chaque raccord'],
  'Alimentation PER':['Repérer les appareils et tracer le réseau','Couper l’eau et sécuriser la zone','Dérouler les tubes PER sous gaine','Passer les réseaux sans contrainte ni pincement','Poser nourrice et sorties de cloison','Réaliser les raccordements adaptés','Fixer et protéger les passages','Remettre en eau et vérifier l’étanchéité'],
  'Évacuation PVC':['Repérer les appareils et les diamètres','Tracer le parcours avec la pente nécessaire','Présenter les tubes et raccords à blanc','Couper et ébavurer le PVC','Nettoyer et préparer les emboîtures','Coller les raccords dans le bon sens','Fixer les canalisations sans contrainte','Faire un essai d’écoulement et contrôler les fuites'],
  'WC à poser':['Fermer l’eau et déposer l’ancien WC si nécessaire','Contrôler arrivée et évacuation','Présenter la cuvette et repérer les fixations','Raccorder la pipe d’évacuation','Fixer la cuvette','Raccorder le réservoir et l’alimentation','Poser le joint sanitaire adapté','Remettre en eau et tester plusieurs chasses'],
  'WC suspendu':['Choisir et positionner le bâti-support','Raccorder l’évacuation et l’alimentation','Régler hauteur, aplomb et profondeur','Fixer solidement le bâti','Tester l’étanchéité avant fermeture','Habiller le bâti avec le système prévu','Ajuster manchons et poser la cuvette','Poser plaque de commande et tester'],
  'Lavabo / vasque':['Tracer l’axe et la hauteur','Préparer fixations et arrivées d’eau','Poser la vasque ou le lavabo','Installer la robinetterie','Raccorder flexibles et robinets d’arrêt','Monter bonde et siphon','Raccorder l’évacuation','Remettre en eau et contrôler'],
  'Douche / receveur':['Contrôler niveaux et emplacement de la bonde','Préparer l’évacuation','Mettre en place et régler le receveur','Raccorder la bonde et tester','Préparer les arrivées d’eau','Poser mitigeur / colonne','Réaliser les joints périphériques prévus','Mettre en eau et contrôler débit et évacuation']
 },
 'Électricité':{
  'Prises de courant':['Couper, condamner et vérifier l’absence de tension','Définir le circuit et repérer les emplacements','Tracer les cheminements et boîtes','Passer gaine et conducteurs adaptés','Poser les boîtes et appareillages','Raccorder phase, neutre et terre','Raccorder la protection au tableau si nécessaire','Contrôler continuité, terre et fonctionnement'],
  'Éclairage / interrupteurs':['Couper, condamner et vérifier l’absence de tension','Définir points lumineux et commandes','Tracer le cheminement du circuit','Passer conducteurs et gaines','Poser DCL, boîtes et interrupteurs','Raccorder le circuit de commande','Raccorder la protection adaptée','Contrôler et tester le fonctionnement'],
  'Circuit spécialisé':['Identifier l’appareil et ses besoins','Couper, condamner et vérifier l’absence de tension','Choisir section et protection adaptées','Tracer et passer le câble dédié','Poser la sortie de câble ou prise adaptée','Raccorder l’appareillage','Raccorder le départ au tableau','Mesurer et tester avant mise en service'],
  'Tableau électrique':['Couper l’alimentation en amont et vérifier l’absence de tension','Repérer tous les circuits existants','Définir l’organisation et les protections','Poser le coffret et les appareils','Raccorder différentiels et disjoncteurs','Raccorder et repérer chaque circuit','Contrôler serrages, terre et réserves','Effectuer les essais avant remise sous tension'],
  'Réseau RJ45':['Définir l’emplacement des prises et du coffret','Tracer les cheminements en évitant les perturbations','Passer les câbles réseau sans les écraser','Poser les prises RJ45','Raccorder les noyaux selon le même standard','Raccorder le coffret / panneau','Identifier chaque liaison','Tester chaque câble avec un testeur réseau']
 },
 'Maçonnerie':{
  'Dalle béton':['Délimiter et décaisser la zone','Préparer et compacter le fond de forme','Mettre coffrage et niveaux','Poser film / armatures selon le projet','Calculer et préparer le volume de béton','Couler et répartir le béton','Tirer à la règle et finir la surface','Protéger la dalle et respecter la cure'],
  'Chape':['Contrôler le support et les niveaux','Préparer bandes périphériques et repères','Calculer le volume de mortier','Préparer le mortier de chape','Répartir et compacter','Tirer à la règle','Taloche / lisser selon finition','Protéger et respecter le séchage'],
  'Ragréage':['Contrôler planéité et cohésion du support','Nettoyer et aspirer soigneusement','Appliquer le primaire adapté','Préparer le ragréage au bon dosage','Verser et répartir le produit','Aider l’étalement / débuller si prévu','Laisser durcir sans courant d’air excessif','Contrôler la planéité avant revêtement'],
  'Mur en parpaings':['Tracer le mur et préparer l’assise','Préparer le mortier','Poser et régler le premier rang','Monter les rangs avec joints décalés','Contrôler niveau, aplomb et alignement','Réaliser coupes et points singuliers','Mettre chaînages / renforts prévus','Nettoyer les joints et protéger la maçonnerie'],
  'Enduit ciment':['Contrôler, nettoyer et humidifier le support','Préparer le mortier de gobetis','Projeter la couche d’accrochage','Préparer le corps d’enduit','Appliquer et dresser à la règle','Laisser tirer et corriger les défauts','Appliquer la finition','Protéger de la dessiccation trop rapide'],
  'Scellement / petit béton':['Préparer et dépoussiérer la réservation','Humidifier si nécessaire','Positionner et caler l’élément','Préparer le béton / mortier adapté','Remplir et compacter correctement','Contrôler niveau et aplomb','Nettoyer les débords','Laisser durcir avant sollicitation']
 }
};
const baseSteps=buildSteps;
buildSteps=function(cat,room,details={}){if(V28_STEPS[cat]){const key=cat==='Plomberie / sanitaire'?details.plumbingType:cat==='Électricité'?details.electricType:details.masonryType;return (V28_STEPS[cat][key]||Object.values(V28_STEPS[cat])[0]).map(s=>[s,0])}return baseSteps(cat,room,details)};

function ceil(n){return Math.max(1,Math.ceil(n))}
const baseMaterials=buildMaterials;
buildMaterials=function(cat,area,w={}){const a=Math.max(.1,Number(area)||1);
 if(cat==='Plomberie / sanitaire'){const t=w.plumbingType||'Alimentation multicouche',L=Math.max(2,Number(w.pipeLength)||a||10),n=Math.max(1,Number(w.fixtureCount)||1),m=[];
  if(t==='Alimentation multicouche')m.push(['Tube multicouche',`${Math.ceil(L*1.1)} m`,0],['Raccords à sertir','Selon plan · base 6 pièces',0],['Colliers / fixations',`${ceil(L/1.2)} pièces`,0],['Nourrice / collecteur','Selon nombre de départs',0],['Gaines / protections','Selon passages',0]);
  else if(t==='Alimentation PER')m.push(['Tube PER sous gaine',`${Math.ceil(L*1.1)} m`,0],['Raccords PER','Selon plan · base 6 pièces',0],['Nourrice / collecteur','Selon départs',0],['Sorties de cloison',`${n*2} pièces indicatives`,0],['Colliers / protections','Selon passages',0]);
  else if(t==='Évacuation PVC')m.push([`Tube PVC ${w.pvcDiameter||'40 mm'}`,`${Math.ceil(L*1.1)} m`,0],['Coudes / tés PVC','Selon tracé · base 4 pièces',0],['Manchons PVC','2 pièces indicatives',0],['Colle PVC','1 pot',0],['Décapant / nettoyant PVC','1 produit',0],['Colliers PVC',`${ceil(L/1.2)} pièces`,0]);
  else if(t==='WC à poser')m.push(['WC à poser',`${n} ensemble(s)`,0],['Pipe / raccord WC',`${n} pièce(s)`,0],['Robinet d’arrêt',`${n} pièce(s)`,0],['Flexible alimentation',`${n} pièce(s)`,0],['Fixations WC','1 kit / WC',0],['Mastic sanitaire','1 cartouche',0]);
  else if(t==='WC suspendu')m.push(['Bâti-support WC',`${n} ensemble(s)`,0],['Cuvette suspendue',`${n} pièce(s)`,0],['Plaque de commande',`${n} pièce(s)`,0],['Kit manchons évacuation / chasse',`${n} kit(s)`,0],['Robinet / alimentation','Selon bâti',0],['Habillage hydrofuge','Selon système',0]);
  else if(t==='Lavabo / vasque')m.push(['Vasque / lavabo',`${n} pièce(s)`,0],['Mitigeur lavabo',`${n} pièce(s)`,0],['Bonde',`${n} pièce(s)`,0],['Siphon',`${n} pièce(s)`,0],['Flexibles / raccords','1 kit / équipement',0],['Mastic sanitaire','1 cartouche',0]);
  else m.push(['Receveur de douche',`${n} pièce(s)`,0],['Bonde / siphon douche',`${n} pièce(s)`,0],['Mitigeur / colonne de douche',`${n} ensemble(s)`,0],['Raccords alimentation','Selon réseau',0],['Tube PVC évacuation','Selon distance',0],['Mastic sanitaire','1 cartouche',0]);return m;
 }
 if(cat==='Électricité'){const t=w.electricType||'Prises de courant',pts=Math.max(1,Number(w.pointCount)||a),L=Math.max(5,Number(w.cableLength)||25),m=[];
  if(t==='Prises de courant')m.push(['Câble / conducteurs 2,5 mm²',`${Math.ceil(L*1.1)} m`,0],['Gaine ICTA',`${Math.ceil(L*1.05)} m`,0],['Boîtes d’encastrement',`${pts} pièces`,0],['Prises 2P+T',`${pts} pièces`,0],['Connecteurs type Wago','1 assortiment',0],['Disjoncteur circuit prises','1 pièce si nouveau circuit',0]);
  else if(t==='Éclairage / interrupteurs')m.push(['Conducteurs 1,5 mm²',`${Math.ceil(L*1.1)} m`,0],['Gaine ICTA',`${Math.ceil(L*1.05)} m`,0],['Boîtes / DCL',`${pts} pièces`,0],['Interrupteurs',`${Math.max(1,Math.ceil(pts/2))} pièces indicatives`,0],['Connecteurs','1 assortiment',0],['Disjoncteur éclairage','1 pièce si nouveau circuit',0]);
  else if(t==='Circuit spécialisé')m.push([`Câble ${w.cableSection||'2,5 mm²'}`,`${Math.ceil(L*1.1)} m`,0],['Gaine / cheminement',`${Math.ceil(L*1.05)} m`,0],['Sortie de câble / prise dédiée',`${pts} pièce(s)`,0],['Disjoncteur adapté','1 pièce',0],['Connecteurs / repérage','1 lot',0]);
  else if(t==='Tableau électrique')m.push(['Coffret électrique','1 ensemble',0],['Interrupteurs différentiels','Selon architecture',0],['Disjoncteurs divisionnaires',`${Math.max(4,pts)} pièces indicatives`,0],['Peignes / répartiteurs','1 lot',0],['Bornes et accessoires','1 lot',0],['Étiquettes de repérage','1 planche',0]);
  else m.push(['Câble RJ45 Cat.6 / 6A',`${Math.ceil(L*1.1)} m`,0],['Prises RJ45',`${pts} pièces`,0],['Boîtes d’encastrement',`${pts} pièces`,0],['Coffret / panneau de brassage','Selon installation',0],['Connecteurs / noyaux RJ45',`${pts} pièces`,0]);return m;
 }
 if(cat==='Maçonnerie'){const t=w.masonryType||'Dalle béton',m=[];
  if(t==='Dalle béton'){const vol=a*(Number(w.thickness)||10)/100,bags=ceil(vol/0.017);m.push(['Béton prêt à l’emploi 35 kg',`${bags} sacs env. · ${vol.toFixed(2)} m³`,0],['Treillis soudé','Selon projet / surface',0],['Film polyane','Selon besoin',0],['Planches de coffrage','Selon périmètre',0],['Cales / accessoires','1 lot',0]);}
  else if(t==='Chape'){const vol=a*(Number(w.thickness)||5)/100;m.push(['Mortier chape / sable-ciment',`≈ ${vol.toFixed(2)} m³`,0],['Ciment / liant','Selon dosage',0],['Sable à maçonner','Selon dosage',0],['Bande périphérique','Selon périmètre',0]);}
  else if(t==='Ragréage'){m.push(['Ragréage autolissant',`${ceil(a*1.6/25)} sacs de 25 kg indicatifs`,0],['Primaire d’accrochage',`${ceil(a/30)} bidon(s) indicatif(s)`,0]);}
  else if(t==='Mur en parpaings'){const wall=Math.max(.5,(Number(w.wallLength)||3)*(Number(w.wallHeight)||1)),blocks=ceil(wall*10.5);m.push(['Parpaings',`${blocks} blocs env.`,0],['Mortier de montage',`${ceil(wall*18/25)} sacs de 25 kg indicatifs`,0],['Ferraillage / chaînage','Selon ouvrage',0],['Cales / cordeau','1 lot',0]);}
  else if(t==='Enduit ciment')m.push(['Mortier d’enduit',`${ceil(a*18/25)} sacs de 25 kg indicatifs`,0],['Ciment / liant complémentaire','Selon système',0],['Sable / enduit','Selon système',0],['Profilés / règles d’angle','Selon chantier',0]);
  else m.push(['Béton / mortier prêt à l’emploi',`${ceil(a*2)} sacs indicatifs`,0],['Cales / maintien','1 lot',0],['Ferraillage si nécessaire','Selon ouvrage',0]);return m;
 }
 return baseMaterials(cat,area,w);
};

/* Estimation matières */
const baseEst=v14EstimateWork;
v14EstimateWork=function(w){const a=Math.max(1,Number(w.area)||1),d=w.details||{},r=w.range||'Standard',coef=r==='Éco'?.8:r==='Premium'?1.5:1;
 if(w.category==='Plomberie / sanitaire'){const t=d.plumbingType||'';let b=/WC suspendu/.test(t)?450:/WC à poser/.test(t)?180:/Douche/.test(t)?350:/Lavabo/.test(t)?220:/Évacuation/.test(t)?Math.max(45,(d.pipeLength||10)*6):Math.max(90,(d.pipeLength||10)*8);return Math.round(b*coef)}
 if(w.category==='Électricité'){const t=d.electricType||'';let b=t==='Tableau électrique'?550:t==='Réseau RJ45'?Math.max(100,(d.pointCount||4)*35):Math.max(80,(d.pointCount||4)*45);return Math.round(b*coef)}
 if(w.category==='Maçonnerie'){const t=d.masonryType||'';let b=t==='Mur en parpaings'?a*28:t==='Ragréage'?a*12:t==='Enduit ciment'?a*18:t==='Dalle béton'?a*(d.thickness||10)*1.7:a*16;return Math.round(b*coef)}
 return baseEst(w)};

/* Outils */
Object.assign(V20_TOOL_CATALOG,{
 pressTool:{name:'Sertisseuse multicouche',cat:'Plomberie / sanitaire',emoji:'🗜️',img:V20_ICON+'pliers.png',price:249,rent:35,desc:'Sertissage des raccords avec mâchoire/profil compatible.',rentable:true},
 pipeCutter:{name:'Coupe-tube',cat:'Plomberie / sanitaire',emoji:'✂️',img:V20_ICON+'pipe-cutter.png',price:25,rent:0,desc:'Coupe nette des tubes.'},
 calibrator:{name:'Calibreur / ébavureur multicouche',cat:'Plomberie / sanitaire',emoji:'⭕',img:V20_ICON+'settings.png',price:22,rent:0,desc:'Reforme et ébavure le tube avant raccord.'},
 basinWrench:{name:'Clé lavabo / clés plates',cat:'Plomberie / sanitaire',emoji:'🔧',img:V20_ICON+'wrench.png',price:28,rent:0,desc:'Serrage des raccords et robinetteries.'},
 pvcSaw:{name:'Scie PVC / scie fine',cat:'Plomberie / sanitaire',emoji:'🪚',img:V20_ICON+'hand-saw.png',price:18,rent:0,desc:'Coupe des évacuations PVC.'},
 vat:{name:'VAT — vérificateur d’absence de tension',cat:'Électricité',emoji:'⚡',img:V20_ICON+'electricity.png',price:55,rent:0,desc:'Vérifie l’absence de tension avant intervention.'},
 wireStripper:{name:'Pince à dénuder',cat:'Électricité',emoji:'🗜️',img:V20_ICON+'pliers.png',price:28,rent:0,desc:'Dénudage propre des conducteurs.'},
 electricianDrivers:{name:'Tournevis isolés',cat:'Électricité',emoji:'🪛',img:V20_ICON+'screwdriver.png',price:35,rent:0,desc:'Jeu de tournevis isolés adapté aux appareillages.'},
 cableTester:{name:'Testeur RJ45',cat:'Électricité',emoji:'🌐',img:V20_ICON+'network-cable.png',price:32,rent:0,desc:'Contrôle de continuité des liaisons réseau.'},
 concreteMixer:{name:'Bétonnière',cat:'Maçonnerie',emoji:'🌀',img:V20_ICON+'concrete-mixer.png',price:329,rent:45,desc:'Préparation régulière de béton et mortier.',rentable:true},
 masonRule:{name:'Règle de maçon',cat:'Maçonnerie',emoji:'📏',img:V20_ICON+'ruler.png',price:35,rent:0,desc:'Tirer dalle, chape ou enduit.'},
 masonTrowel:{name:'Truelle de maçon',cat:'Maçonnerie',emoji:'🔺',img:V20_ICON+'trowel.png',price:18,rent:0,desc:'Mortier, montage et reprises.'},
 floatTool:{name:'Taloche',cat:'Maçonnerie',emoji:'⬛',img:V20_ICON+'trowel.png',price:20,rent:0,desc:'Dressage et finition des mortiers.'},
 wheelbarrow:{name:'Brouette',cat:'Maçonnerie',emoji:'🛒',img:V20_ICON+'wheelbarrow.png',price:75,rent:15,desc:'Transport des matériaux.',rentable:true}
});
const baseTools=v20ToolIdsForWork;
v20ToolIdsForWork=function(w){if(w.category==='Plomberie / sanitaire'){let ids=['tape','level','ppe','vacuum','pipeCutter','basinWrench'];const t=w.details?.plumbingType||'';if(/multicouche/i.test(t))ids.push('pressTool','calibrator');if(/PVC|WC|Lavabo|Douche/i.test(t))ids.push('pvcSaw');return [...new Set(ids)]}if(w.category==='Électricité'){let ids=['tape','level','ppe','vat','wireStripper','electricianDrivers','drill'];if(w.details?.electricType==='Réseau RJ45')ids.push('cableTester');return [...new Set(ids)]}if(w.category==='Maçonnerie'){return ['tape','level','ppe','concreteMixer','masonRule','masonTrowel','floatTool','wheelbarrow','laser']}return baseTools(w)};

/* Calculateurs */
const baseCalcBody=v19CalculatorBody,baseRecalc=v19Recalc;
v19CalculatorBody=function(){if(v19CalcTrade==='Plomberie / sanitaire')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🚿</span><div><h3>Calculateur plomberie</h3><p>Longueurs, raccords et fournitures principales.</p></div></div><div class="v19Fields"><label>Type<select id="v28PType" onchange="v19Recalc()">${Object.keys(V28_PLUMBING_TYPES).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Longueur de réseau (m)<input id="v19Area" type="number" value="20" min="1" step="1" oninput="v19Recalc()"></label><label>Nombre d’équipements<input id="v28Count" type="number" value="1" min="1" step="1" oninput="v19Recalc()"></label></div><div id="v19CalcResult"></div></div>`;
 if(v19CalcTrade==='Électricité')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>⚡</span><div><h3>Calculateur électricité</h3><p>Points, câble, gaine, boîtes et appareillages.</p></div></div><div class="v19Fields"><label>Type<select id="v28EType" onchange="v19Recalc()">${Object.keys(V28_ELEC_TYPES).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Nombre de points<input id="v19Area" type="number" value="6" min="1" step="1" oninput="v19Recalc()"></label><label>Longueur moyenne par point (m)<input id="v28Len" type="number" value="6" min="1" step="1" oninput="v19Recalc()"></label></div><div id="v19CalcResult"></div></div>`;
 if(v19CalcTrade==='Maçonnerie')return `<div class="v19CalcCard"><div class="v19CalcHead"><span>🧱</span><div><h3>Calculateur maçonnerie</h3><p>Dalle, chape, ragréage ou mur en parpaings.</p></div></div><div class="v19Fields"><label>Type<select id="v28MType" onchange="v19Recalc()"><option>Dalle béton</option><option>Chape</option><option>Ragréage</option><option>Mur en parpaings</option><option>Enduit ciment</option></select></label><label>Surface / mur (m²)<input id="v19Area" type="number" value="20" min="1" step="0.5" oninput="v19Recalc()"></label><label>Épaisseur (cm)<input id="v28Thick" type="number" value="10" min="0.3" step="0.5" oninput="v19Recalc()"></label></div><div id="v19CalcResult"></div></div>`;return baseCalcBody()};
v19Recalc=function(){const el=document.getElementById('v19CalcResult');if(!el)return;const a=Math.max(.1,Number(document.getElementById('v19Area')?.value)||1),row=v19ResultRow;
 if(v19CalcTrade==='Plomberie / sanitaire'){const t=document.getElementById('v28PType')?.value||'Alimentation multicouche',n=Math.max(1,Number(document.getElementById('v28Count')?.value)||1);let h=row('Réseau à prévoir',`${Math.ceil(a*1.1)} m`,'10 % de marge');if(/Alimentation/.test(t))h+=row('Raccords','≈ 6 à 10 pièces','À ajuster au tracé et au nombre de départs')+row('Colliers',`${ceil(a/1.2)} pièces`);else if(t==='Évacuation PVC')h+=row('Raccords PVC','≈ 4 à 8 pièces')+row('Colle PVC','1 pot');else h=row('Équipement',`${n} ensemble(s)`)+row('Raccordements','1 kit / équipement');el.innerHTML=`<div class="v19Results">${h}</div>`;return;}
 if(v19CalcTrade==='Électricité'){const t=document.getElementById('v28EType')?.value||'Prises de courant',len=Math.max(1,Number(document.getElementById('v28Len')?.value)||6),L=Math.ceil(a*len*1.1);let h=row('Câble / conducteurs',`${L} m`,'Marge 10 %')+row('Gaine ICTA',`${Math.ceil(L*.95)} m`);if(t==='Prises de courant')h+=row('Prises',`${Math.ceil(a)} pièces`)+row('Boîtes',`${Math.ceil(a)} pièces`);else if(t==='Éclairage / interrupteurs')h+=row('Points DCL',`${Math.ceil(a)} points`)+row('Interrupteurs',`≈ ${Math.max(1,Math.ceil(a/2))}`);else h+=row('Appareillages / protections','Selon circuit');el.innerHTML=`<div class="v19Results">${h}</div><div class="v28CalcWarn">⚠️ Vérifier la NF C 15-100 et travailler hors tension.</div>`;return;}
 if(v19CalcTrade==='Maçonnerie'){const t=document.getElementById('v28MType')?.value||'Dalle béton',th=Math.max(.3,Number(document.getElementById('v28Thick')?.value)||10);let h='';if(t==='Dalle béton'){const v=a*th/100,b=ceil(v/0.017);h=row('Volume béton',`${v.toFixed(2)} m³`)+row('Béton 35 kg',`${b} sacs env.`,'Petits volumes uniquement ; comparer avec béton livré pour gros volume');}else if(t==='Chape'){const v=a*th/100;h=row('Volume mortier',`${v.toFixed(2)} m³`)+row('Mortier / sable-ciment','Selon dosage');}else if(t==='Ragréage')h=row('Ragréage 25 kg',`${ceil(a*1.6/25)} sacs`,'Hypothèse env. 1,6 kg/m²/mm à ajuster')+row('Primaire',`${ceil(a/30)} bidon(s)`);else if(t==='Mur en parpaings')h=row('Parpaings',`${ceil(a*10.5)} blocs`)+row('Mortier',`${ceil(a*18/25)} sacs de 25 kg`);else h=row('Mortier d’enduit',`${ceil(a*18/25)} sacs de 25 kg`);el.innerHTML=`<div class="v19Results">${h}</div>`;return;}return baseRecalc()};

/* Gammes */
const baseRanges=v14RangeChoices;
v14RangeChoices=function(w){if(!NEW.includes(w.category))return baseRanges(w);const labels={
 'Plomberie / sanitaire':{'Éco':'Fonctionnel / marque distributeur','Standard':'Qualité durable / gamme intermédiaire','Premium':'Marques et finitions haut de gamme'},
 'Électricité':{'Éco':'Appareillage et protections essentiels','Standard':'Marques reconnues / finition standard','Premium':'Gamme design / connectée / haut de gamme'},
 'Maçonnerie':{'Éco':'Matériaux courants','Standard':'Produits techniques / confort de mise en œuvre','Premium':'Produits haute performance / spécifiques'}
}[w.category];return `<div class="v14Ranges">${['Éco','Standard','Premium'].map(r=>`<button class="v14Range ${w.range===r?'selected':''}" onclick='v14SetWork("range",${JSON.stringify(r)},false)'><b>${r}</b><small>${esc(labels[r])}</small></button>`).join('')}</div>`};

/* Visuels matériaux */
try{V23_REAL_VISUALS.unshift(
 [/multicouche|per|tube pvc|raccord|siphon|bonde|wc|vasque|receveur|mitigeur/i,{img:'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=85',emoji:'🚿'}],
 [/câble|conducteur|gaine icta|prise|interrupteur|disjoncteur|différentiel|rj45|coffret électrique/i,{img:'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=85',emoji:'⚡'}],
 [/béton|mortier|parpaing|ragréage|chape|treillis|ciment|enduit ciment/i,{img:'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=85',emoji:'🧱'}]
)}catch(_){}

try{v15RenderProfileModal();document.querySelector('#v15ProfileModal')?.remove()}catch(_){}
try{render()}catch(_){}
})();