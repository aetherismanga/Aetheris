# BRICOACH 1.0 — baseline consolidée

Date de consolidation : 25 août 2026
Baseline fonctionnelle : V38

## Objectif

Stabiliser l'application avant la synchronisation cloud, les paiements et l'ouverture publique, sans changer l'apparence ni les fonctionnalités validées de V38.

## Point d'entrée

- `index.html` ne charge plus individuellement les dizaines de fichiers historiques.
- `bricoach-1.0.js` est le point d'entrée unique de l'application.
- Il assemble les feuilles de style dans l'ordre V38, puis assemble et exécute les modules JavaScript dans l'ordre V38.
- `BRICOACH_BUILD` vaut `1.0.0`.

## Sécurité de la migration

Les anciens fichiers V10 à V38 restent dans le dépôt comme sources de référence. Ils ne sont pas supprimés pendant cette phase afin de permettre une comparaison et un retour rapide.

Une copie de l'ancien point d'entrée est conservée dans :

- `index-v38-backup.html`

## Règle à partir de Bricoach 1.0

Ne plus ajouter de nouvelle balise `v39`, `v40`, etc. dans `index.html`.

Les prochaines évolutions doivent être intégrées dans une architecture fonctionnelle stable :

- Auth / profil
- Projets
- Configurateurs et calculs
- Matériaux / outils / dépenses
- Tarifs / magasins
- Tutoriels / vidéos
- Coach
- Abonnements
- Synchronisation Supabase

## Étape suivante

Synchroniser les chantiers et leurs données avec Supabase afin qu'un même compte retrouve ses projets sur tous ses appareils.
