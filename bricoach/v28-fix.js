/* V28 standalone tutorial routing fix — independent of internal configurator constants */
(function(){
const DEFAULTS={
 'Plomberie / sanitaire':['Repérer les appareils et tracer le réseau','Couper l’eau et sécuriser la zone','Préparer tubes, gaines et passages','Couper, calibrer et ébavurer les tubes','Cintrer et positionner le multicouche','Sertir les raccords avec le bon profil','Fixer et protéger le réseau','Remettre en eau et contrôler chaque raccord'],
 'Électricité':['Couper, condamner et vérifier l’absence de tension','Définir le circuit et repérer les emplacements','Tracer les cheminements et boîtes','Passer gaine et conducteurs adaptés','Poser les boîtes et appareillages','Raccorder phase, neutre et terre','Raccorder la protection au tableau si nécessaire','Contrôler continuité, terre et fonctionnement'],
 'Maçonnerie':['Délimiter et décaisser la zone','Préparer et compacter le fond de forme','Mettre coffrage et niveaux','Poser film / armatures selon le projet','Calculer et préparer le volume de béton','Couler et répartir le béton','Tirer à la règle et finir la surface','Protéger la dalle et respecter la cure']
};
const before=v22Steps;
v22Steps=function(cat){return DEFAULTS[cat]?DEFAULTS[cat].slice():before(cat)};
})();