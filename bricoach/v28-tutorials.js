/* Bricoach V28 — tutoriels + vidéos Plomberie, Électricité, Maçonnerie */
(function(){
Object.assign(V25_CHANNELS,{
 'Plomberie / sanitaire':{name:'DJ. PLOMBERIE',sub:'≈ 295 k abonnés',url:'https://www.youtube.com/@DJ.PLOMBERIE'},
 'Électricité':{name:'Les Disjonctés',sub:'≈ 157 k abonnés',url:'https://www.youtube.com/@lesdisjonctes'},
 'Maçonnerie':{name:'Maçons du 47',sub:'≈ 133 k abonnés',url:'https://www.youtube.com/@maconsdu47'}
});
Object.assign(V25_VIDEOS,{
 'Plomberie / sanitaire':[
  {id:'V_NpVp0CULk',title:'Cintrage tube multicouche : méthode simple',cat:'Multicouche',tags:['multicouche','cintrage','tube','alimentation','préparer','positionner']},
  {id:'QRZPa3dkGzM',title:'PVC pression : raccords et mise en œuvre',cat:'PVC',tags:['pvc','évacuation','raccord','coller','tube']},
  {id:'38GFj6I6NNQ',title:'Passer de la baignoire à la douche : pose d’un bac à douche recoupable',cat:'Douche',tags:['douche','receveur','bac','bonde','évacuation','sanitaire']}
 ],
 'Électricité':[
  {id:'WPZfN65MNb0',title:'Électricité pour les nuls : ce qu’il faut savoir avant de commencer',cat:'Bases / sécurité',tags:['sécurité','débutant','vat','hors tension','circuit','norme']},
  {id:'sjj1V-nouJI',title:'Interrupteur différentiel et coupure générale : tout savoir',cat:'Tableau',tags:['tableau','différentiel','protection','coupure','disjoncteur']},
  {id:'f7aVu1wpxs4',title:'Remplacer un tableau électrique : simple et efficace',cat:'Tableau',tags:['tableau','rénovation','disjoncteur','différentiel','repérage']},
  {id:'GdROWFDAuOw',title:'Interrupteur à voyant simple allumage : tout savoir',cat:'Éclairage',tags:['interrupteur','éclairage','commande','voyant','raccordement']},
  {id:'IKGylGHn-ZY',title:'Interrupteur simple allumage et norme circuit lumière',cat:'Éclairage',tags:['interrupteur','lumière','éclairage','norme','1,5 mm²']},
  {id:'V3v_P71nH90',title:'NF C 15-100 : les règles essentielles de l’installation',cat:'Norme',tags:['norme','nf c 15-100','tableau','circuits','protection','sécurité']}
 ],
 'Maçonnerie':[
  {id:'2Oi95OtNarQ',title:'3 astuces spécial parpaing — tutoriel',cat:'Parpaings',tags:['parpaing','mur','mortier','premier rang','alignement']},
  {id:'9-LpzL4EP58',title:'Enduire un mur à la main : la première couche',cat:'Enduit',tags:['enduit','mur','première couche','gobetis','mortier']},
  {id:'sV3_EZbpzkY',title:'Faire un enduit sur parpaings — résumé',cat:'Enduit',tags:['enduit','parpaing','dresser','finition']},
  {id:'mtIkPXtSHHs',title:'Apprendre à projeter un enduit — niveau débutant',cat:'Enduit',tags:['enduit','débutant','projeter','appliquer','mur']},
  {id:'3eA-pqkCOaQ',title:'Mur en pierre — mise en œuvre et chantier',cat:'Mur',tags:['mur','maçonnerie','pierre','mortier','alignement']}
 ]
});

/* Étapes standalone : reprendre exactement les parcours configurateur V28. */
const v28BaseV22Steps=v22Steps;
v22Steps=function(cat){
 if(cat==='Plomberie / sanitaire')return V28_STEPS?.[cat]?.['Alimentation multicouche']||v28BaseV22Steps(cat);
 if(cat==='Électricité')return V28_STEPS?.[cat]?.['Prises de courant']||v28BaseV22Steps(cat);
 if(cat==='Maçonnerie')return V28_STEPS?.[cat]?.['Dalle béton']||v28BaseV22Steps(cat);
 return v28BaseV22Steps(cat);
};

function v28G(title,why,action,checks,errors,tools,technical=''){
 return {title,why,
  beginner:`${action} Avance étape par étape et ne poursuis que lorsque les contrôles sont bons.`,
  diy:`${action} Prépare tout le matériel avant de commencer et vérifie les points clés avant l’étape suivante.`,
  confirmed:`${action} ${technical||'Contrôle les dimensions, raccordements et prescriptions du système choisi.'}`,
  expert:`${technical||action} Vérifie surtout les tolérances, compatibilités, points singuliers et conditions de mise en œuvre.`,
  checks,errors,tools};
}
const V28_GUIDES={
 'Plomberie / sanitaire':[
  [/repérer|tracer|emplacement|hauteur/i,v28G('Tracer et préparer le réseau','Un bon tracé limite les raccords, pertes de charge et conflits avec les autres corps d’état.','Repère chaque appareil, arrivée, évacuation et passage avant de couper le premier tube.',['Appareils positionnés','Diamètres cohérents','Passages accessibles','Raccords cachés évités si non autorisés'],['Tracer sans tenir compte des cloisons','Multiplier les raccords inutiles','Oublier la dilatation / fixation'],['Mètre','Laser','Crayon','Plan du chantier'],'Valide diamètres, accessibilité des raccords, rayon de cintrage et cheminements avant exécution.')],
  [/couper l’eau|sécuriser/i,v28G('Couper l’eau et sécuriser','Toute modification d’un réseau sous pression doit commencer par une coupure et une décompression.','Ferme la vanne adaptée puis ouvre un point d’eau pour vérifier que la pression est réellement tombée.',['Arrivée fermée','Réseau dépressurisé','Zone protégée','Récipients disponibles'],['Se fier uniquement à la position d’une vanne','Couper un tube encore sous pression'],['Clé','Seau','Chiffons','Bouchons temporaires'])],
  [/couper|calibrer|ébavur|cintrer|tube/i,v28G('Préparer les tubes','Une coupe propre et une préparation correcte conditionnent l’étanchéité du raccord.','Coupe à 90°, ébavure et calibre selon le système ; respecte le rayon de courbure sans écraser le tube.',['Coupe d’équerre','Tube non ovalisé','Ébavurage correct','Profondeur d’emboîtement repérée'],['Coupe à la meuleuse sur multicouche','Oublier le calibrage','Cintrer trop serré'],['Coupe-tube','Calibreur','Ressort / cintreuse'],'Respecte le mode opératoire et les tolérances du fabricant du raccord.')],
  [/sertir|raccord/i,v28G('Réaliser les raccords','Le bon profil de mâchoire et l’enfoncement complet sont indispensables pour un sertissage fiable.','Vérifie le profil de sertissage, insère le tube jusqu’à la butée puis sertis perpendiculairement.',['Bon profil de mâchoire','Tube en butée','Sertissage complet','Raccord non contraint'],['Mauvais profil','Double sertissage mal placé','Sertir un tube mal calibré'],['Sertisseuse','Mâchoire compatible','Marqueur'],'Contrôle compatibilité tube/raccord/profil, profondeur d’insertion et inspection visuelle après sertissage.')],
  [/pvc|coller|emboît/i,v28G('Assembler une évacuation PVC','Le montage à blanc, l’orientation et la pente doivent être validés avant collage.','Présente tous les raccords à blanc, marque leur orientation, coupe et ébavure puis colle conformément au produit.',['Pente continue','Emboîtures propres','Orientation repérée','Colliers correctement espacés'],['Coller avant d’avoir testé le tracé','Créer une contre-pente','Forcer un tube en contrainte'],['Scie PVC','Ébavureur','Colle PVC','Mètre'],'Contrôle pente, sens d’écoulement, dilatation et maintien mécanique du réseau.')],
  [/wc|cuvette|bâti/i,v28G('Installer le WC','Le WC doit être stable, correctement raccordé et testé avant finition.','Présente, règle et fixe l’équipement sans contrainte sur l’évacuation ; teste plusieurs chasses avant la finition.',['Évacuation étanche','Cuvette stable','Alimentation sans fuite','Chasse fonctionnelle'],['Serrer excessivement la céramique','Masquer une fuite avant test','Déformer la pipe WC'],['Niveau','Clés','Perceuse','Mastic sanitaire'])],
  [/vasque|lavabo|robinet|siphon/i,v28G('Poser vasque et robinetterie','Les raccordements doivent rester accessibles et sans contrainte.','Monte la robinetterie et la bonde avant accès difficile, puis raccorde alimentation et siphon et teste.',['Robinet fixé','Bonde étanche','Siphon accessible','Flexibles non vrillés'],['Tordre un flexible','Oublier un joint','Serrer trop fort un raccord avec joint'],['Clé lavabo','Clés plates','Seau','Mastic'])],
  [/douche|receveur|bonde/i,v28G('Poser et raccorder la douche','Le receveur doit être stable et l’évacuation testée avant fermeture.','Mets le receveur à niveau, raccorde la bonde sans contrainte puis réalise un essai d’écoulement prolongé.',['Receveur stable','Bonde accessible avant fermeture','Évacuation rapide','Aucune fuite'],['Fermer avant essai','Compter sur le silicone pour corriger un mauvais support','Créer une contre-pente'],['Niveau','Clés','Seau','Mastic sanitaire'])],
  [/remettre en eau|contrôler|tester|essai/i,v28G('Mettre en service et contrôler','Le test final doit révéler les défauts avant habillage ou remise en service définitive.','Remets en eau progressivement et inspecte chaque raccord avec un papier sec ; teste aussi les évacuations en débit réel.',['Aucune goutte aux raccords','Pression stable','Écoulement correct','Fixations stables'],['Tester trop vite','Ne vérifier que visuellement','Refermer une cloison sans essai'],['Papier absorbant','Lampe','Manomètre si nécessaire','Seau'])]
 ],
 'Électricité':[
  [/couper|absence de tension|hors tension/i,v28G('Mettre l’installation en sécurité','Une coupure supposée ne suffit pas : l’absence de tension doit être vérifiée.','Identifie la bonne coupure, condamne-la si possible puis vérifie l’absence de tension avec un VAT adapté avant tout contact.',['Bon circuit identifié','Coupure condamnée','VAT vérifié avant/après usage','Absence de tension confirmée'],['Utiliser un tournevis testeur comme seule vérification','Travailler sur simple supposition','Neutraliser les protections'],['VAT','EPI adaptés','Repérage'],'Applique une procédure de consignation adaptée ; en cas de doute, fais intervenir un électricien qualifié.')],
  [/définir|repérer|emplacement|tracer/i,v28G('Concevoir et tracer le circuit','Le nombre de points, la section, la protection et le cheminement se décident avant le câblage.','Repère les points, le tableau et les cheminements puis associe section et protection au circuit prévu.',['Fonction du circuit définie','Section adaptée','Protection prévue','Cheminement cohérent'],['Mélanger des usages sans plan','Sous-dimensionner section ou protection','Ignorer volumes et zones spécifiques'],['Plan','Mètre','Crayon','Référentiel NF C 15-100'],'Valide architecture, sections, calibres, volumes réglementés et règles de la NF C 15-100 applicables au chantier.')],
  [/passer|gaine|conducteur|câble/i,v28G('Passer gaines et conducteurs','Un conducteur ne doit pas être blessé, pincé ni soumis à une traction excessive.','Pose les gaines avec des courbes larges puis tire les conducteurs sans endommager leur isolation et garde du mou dans les boîtes.',['Gaine continue','Conducteurs non blessés','Couleurs cohérentes','Longueur suffisante en boîte'],['Trop remplir une gaine','Créer un coude trop serré','Utiliser une couleur réservée à un autre usage'],['Aiguille tire-fil','Lubrifiant adapté','Pince coupante','Repères'])],
  [/boîte|appareillage|prise|interrupteur|dcl/i,v28G('Poser et raccorder l’appareillage','Les connexions doivent être propres, serrées et rangées sans écraser les conducteurs.','Dénude à la longueur prévue, raccorde chaque borne selon son repérage puis range les conducteurs sans contrainte.',['Cuivre non apparent hors borne','Terre raccordée lorsque requise','Bornes serrées','Appareillage droit'],['Trop dénuder','Coincer un fil derrière le mécanisme','Mélanger neutre / phase / terre'],['Pince à dénuder','Tournevis isolés','Connecteurs','Niveau'])],
  [/différentiel|disjoncteur|tableau|protection/i,v28G('Raccorder les protections','Le tableau protège les personnes et les circuits ; son architecture ne se choisit pas au hasard.','Repère les départs, installe les protections compatibles et respecte les consignes de câblage et de couple de serrage.',['Protection adaptée au circuit','Différentiels correctement répartis','Conducteurs repérés','Serrages contrôlés'],['Pontages improvisés','Mauvais calibre','Absence de repérage'],['Tournevis dynamométrique si requis','VAT','Étiquettes','Schéma'],'Respecte NF C 15-100, notice des appareils, règles amont/aval et couples de serrage fabricant.')],
  [/rj45|réseau|noyau/i,v28G('Câbler le réseau RJ45','Un câble réseau mal rayoné ou mal raccordé peut fonctionner mal même sans défaut visible.','Éloigne-le autant que possible des courants forts, respecte le rayon de courbure et le même schéma de câblage aux deux extrémités.',['Paires peu détorsadées','Même standard aux deux bouts','Câble non écrasé','Test de continuité OK'],['Dépairer trop longtemps','Serrer avec des colliers trop forts','Mélanger T568A et T568B'],['Outil de raccordement','Testeur RJ45','Étiquettes'])],
  [/contrôler|tester|mise en service/i,v28G('Contrôler avant remise sous tension','Le contrôle final ne se limite pas à “ça fonctionne”.','Vérifie les raccordements, continuités et protections avant de remettre sous tension, puis teste chaque fonction.',['Capots remis','Aucun cuivre exposé','Terre / protections contrôlées','Fonctions testées'],['Mettre sous tension avant inspection','Ignorer un déclenchement','Laisser un tableau non repéré'],['VAT','Multimètre selon compétence','Testeur','Étiquettes'],'Les mesures réglementaires d’une installation neuve ou modifiée peuvent nécessiter un professionnel et des appareils adaptés.')]
 ],
 'Maçonnerie':[
  [/délimiter|décaisser|assise|fond de forme/i,v28G('Préparer l’assise','La maçonnerie ne compense pas un sol instable ou mal préparé.','Décaisse jusqu’au niveau prévu, élimine la terre meuble et compacte les couches de fondation adaptées au projet.',['Fond stable','Niveaux repérés','Épaisseurs prévues','Évacuation des eaux anticipée'],['Couler sur terre meuble','Négliger le compactage','Oublier les niveaux finis'],['Pelle','Plaque vibrante','Laser','Règle'],'Pour un ouvrage porteur ou fondation, valide dimensionnement, sol et ferraillage avec les règles de construction adaptées.')],
  [/coffrage|armature|treillis/i,v28G('Coffrer et armer','Le coffrage donne la géométrie et l’armature doit rester correctement enrobée.','Monte un coffrage solide, règle les niveaux et place les armatures sur cales sans contact direct avec le sol.',['Coffrage rigide','Diagonales / niveaux vérifiés','Armatures calées','Épaisseur conforme'],['Treillis posé au fond','Coffrage trop faible','Oublier joints nécessaires'],['Planches','Visseuse','Cales d’enrobage','Laser'])],
  [/volume|préparer|béton|mortier|gâcher/i,v28G('Préparer béton ou mortier','Le dosage en eau et l’homogénéité influencent directement la résistance et la mise en œuvre.','Mesure les quantités, mélange jusqu’à homogénéité et n’ajoute pas d’eau arbitrairement pour rendre le produit plus fluide.',['Dosage respecté','Mélange homogène','Temps d’utilisation connu','Support prêt avant gâchage'],['Surdoser l’eau','Préparer trop de produit','Réutiliser un mélange ayant commencé à prendre'],['Bétonnière / malaxeur','Seaux gradués','Pelle','Eau propre'],'Respecte dosage, classe et destination du produit ; pour le béton structurel, le dimensionnement prévaut sur une simple estimation de sacs.')],
  [/couler|répartir|compacter|tirer|règle/i,v28G('Mettre en place et régler','Le matériau doit être réparti et serré sans créer de vides ni perdre le niveau.','Répartis régulièrement, compacte selon le produit puis tire à la règle sur des guides fiables.',['Niveau tenu','Pas de nid / vide','Épaisseur régulière','Surface correctement dressée'],['Tirer sans guides','Ajouter de l’eau en surface','Attendre trop longtemps avant réglage'],['Règle de maçon','Taloche','Pelle','Niveau'])],
  [/premier rang|parpaing|rangs|monter/i,v28G('Monter le mur en parpaings','Le premier rang conditionne aplomb, niveau et quantité de reprises sur tout le mur.','Pose le premier rang sur une assise réglée, tends le cordeau puis monte avec joints décalés en contrôlant régulièrement.',['Premier rang parfaitement réglé','Joints décalés','Aplomb contrôlé','Cordeau suivi'],['Rattraper de gros défauts sur les rangs suivants','Joints verticaux alignés','Taper excessivement sur les blocs'],['Truelle','Cordeau','Niveau','Massette'])],
  [/primaire|ragréage|autolissant/i,v28G('Réaliser le ragréage','Le support, le primaire et le dosage d’eau sont déterminants pour l’adhérence et la planéité.','Aspire, applique le primaire adapté, dose précisément l’eau puis verse et répartis dans le temps ouvert du produit.',['Support cohésif','Primaire sec selon notice','Dosage exact','Épaisseur dans la plage produit'],['Ragréer sur poussière','Ajouter de l’eau en cours de prise','Dépasser l’épaisseur admise'],['Aspirateur','Malaxeur','Lisseuse','Rouleau débulleur si prévu'])],
  [/enduit|gobetis|projeter|dresser/i,v28G('Appliquer l’enduit','L’accrochage, l’épaisseur et le moment du dressage déterminent la tenue et l’aspect final.','Prépare le support, applique la couche prévue puis dresse à la règle avant la finition au bon moment de prise.',['Support préparé','Épaisseur régulière','Adhérence correcte','Finition homogène'],['Enduire un support trop sec ou poussiéreux','Travailler en plein dessèchement','Finir trop tôt'],['Truelle','Taloche','Règle','Machine à projeter si prévue'])],
  [/protéger|cure|séchage|durcir/i,v28G('Protéger et laisser durcir','La cure et le séchage font partie du chantier : solliciter trop tôt peut fissurer ou dégrader l’ouvrage.','Protège du soleil, gel, pluie battante et dessiccation rapide selon le produit ; respecte les délais avant charge ou revêtement.',['Conditions météo compatibles','Surface protégée','Délai de cure respecté','Pas de charge prématurée'],['Arroser au hasard','Décoffrer / charger trop tôt','Laisser sécher brutalement'],['Protection','Bâche','Brumisation selon système','Thermomètre'])]
 ]
};
function v28GuideFor(cat,name){const arr=V28_GUIDES[cat]||[];for(const [re,g] of arr)if(re.test(name))return g;return v28G(name,'Cette étape prépare la suivante et doit être contrôlée avant de poursuivre.',`Réalise « ${name} » selon les prescriptions des produits et du chantier.`,['Résultat stable et propre','Dimensions / raccords contrôlés','Étape prête pour la suite'],['Aller trop vite','Ignorer la notice fabricant'],['Mètre','Niveau','EPI adaptés']);}
const v28BaseGuide=v22Guide;
v22Guide=function(cat,name,level){if(V28_GUIDES[cat])return v28GuideFor(cat,name);return v28BaseGuide(cat,name,level)};

/* Vidéos associées plus précisément aux nouveaux métiers. */
const v28BaseRelated=v25RelatedVideos;
v25RelatedVideos=function(cat,step=''){
 if(!['Plomberie / sanitaire','Électricité','Maçonnerie'].includes(cat))return v28BaseRelated(cat,step);
 const s=String(step).toLowerCase(),vids=V25_VIDEOS[cat]||[];let out=vids.filter(v=>(v.tags||[]).some(t=>s.includes(t)||t.includes(s)));
 if(cat==='Plomberie / sanitaire'){
   if(/multicouche|cintr|sert/.test(s))out=vids.filter(v=>v.id==='V_NpVp0CULk');
   else if(/pvc|évac|coll/.test(s))out=vids.filter(v=>v.id==='QRZPa3dkGzM');
   else if(/douche|receveur|bonde/.test(s))out=vids.filter(v=>v.id==='38GFj6I6NNQ');
 } else if(cat==='Électricité'){
   if(/sécur|absence|définir|tracer/.test(s))out=vids.filter(v=>['WPZfN65MNb0','V3v_P71nH90'].includes(v.id));
   else if(/tableau|différ|protection/.test(s))out=vids.filter(v=>['sjj1V-nouJI','f7aVu1wpxs4'].includes(v.id));
   else if(/éclairage|interrup|commande|dcl/.test(s))out=vids.filter(v=>['GdROWFDAuOw','IKGylGHn-ZY'].includes(v.id));
 } else {
   if(/parpaing|rang|mur/.test(s))out=vids.filter(v=>v.id==='2Oi95OtNarQ');
   else if(/enduit|projeter|dresser/.test(s))out=vids.filter(v=>['9-LpzL4EP58','sV3_EZbpzkY','mtIkPXtSHHs'].includes(v.id));
 }
 return (out.length?out:vids.slice(0,2)).slice(0,3);
};

/* Tutoriel chantier : reconstruire le contenu pour les 3 nouveaux métiers, puis vidéo. */
const v28BaseProjectTutor=v21TutorBody;
v21TutorBody=function(){
 const s=v21TutorState,p=projects.find(x=>x.id===s?.projectId),l=p?.locations?.find(x=>x.id===s?.locId),w=l?.works?.find(x=>x.id===s?.workId);
 if(!w||!V28_GUIDES[w.category])return v28BaseProjectTutor();
 const level=typeof v18Level==='function'?v18Level(w.category):'Bricoleur',active=Math.min(s.active||0,Math.max(0,w.steps.length-1)),step=w.steps[active],name=step?.[0]||'Étape',g=v28GuideFor(w.category,name),done=!!step?.[1],prog=v21TutorialProgress(w),ch=V25_CHANNELS[w.category],videos=v25RelatedVideos(w.category,name);
 const videoBlock=videos.length?`<section class="v25Related v25ProjectRelated"><div class="v24RelatedHead"><div><h4>🎥 Voir la démonstration</h4><small>Vidéos ${esc(ch.name)} liées à cette étape.</small></div><button class="v24AllVideos" onclick='v25OpenVideoLibrary(${JSON.stringify(w.category)})'>Toutes les vidéos →</button></div><div class="v24RelatedGrid">${videos.map(v=>v25VideoCard(w.category,v)).join('')}</div></section>`:'';
 return `<div class="v21TutorHead"><div><span>Niveau ${esc(level)} · ${esc(l.name)}</span><b>${esc(w.category)}</b></div><strong>${prog}% terminé</strong></div><div class="progress"><span style="width:${prog}%"></span></div><div class="v21TutorList">${w.steps.map((x,i)=>`<button class="${i===active?'active':''} ${x[1]?'done':''}" onclick="v21TutorSelect(${i})"><span>${x[1]?'✓':i+1}</span><div><b>${esc(x[0])}</b><small>${x[1]?'Effectuée':'Cliquer pour le détail'}</small></div><em>›</em></button>`).join('')}</div><article class="v21TutorDetail"><div class="v21TutorDetailTitle"><span>${active+1}</span><div><h3>${esc(g.title)}</h3><p>${esc(g.why)}</p></div></div><div class="v21LevelBox"><b>${level==='Débutant'?'🌱':level==='Expert'?'🏆':level==='Confirmé'?'🛠️':'🔧'} Explication niveau ${esc(level)}</b><p>${esc(v21LevelDetail(g,level))}</p></div><div class="v21TutorCols"><div><h4>✓ À contrôler</h4>${g.checks.map(x=>`<p>✓ ${esc(x)}</p>`).join('')}</div><div><h4>⚠️ Erreurs à éviter</h4>${g.errors.map(x=>`<p>• ${esc(x)}</p>`).join('')}</div></div><div class="v21TutorTools"><h4>🧰 Outils / produits utiles</h4><div>${g.tools.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>${videoBlock}<button class="btn ${done?'soft':'primary'} full v21Validate" onclick="v21TutorToggleDone()">${done?'↩ Marquer comme non terminée':'✓ J’ai effectué cette étape'}</button></article>`;
};

/* La vidéothèque burger V26 lit automatiquement V25_VIDEOS : les 3 métiers apparaissent sans autre duplication. */
})();