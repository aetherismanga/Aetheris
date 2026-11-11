# Reprendre AETHERIS après interruption

## Sources et branche

Dépôt : https://github.com/aetherismanga/Aetheris

Branche de travail : `production/reprise-chapitre-2-2026-11-11`.

Ne pas travailler sur `main`, ne pas publier sur le site public sans validation finale de Jérôme. Ne pas écraser les originaux récupérés.

## Procédure obligatoire

1. Récupérer la branche, lire `PRODUCTION_STATUS.md`, `CONTINUITE_PERSONNAGES.md`, `CHAPITRE_2_DECOUPAGE.md`, puis `production/reprise-2026-11-11/AUDIT_CONTINUITE.md` si présent.
2. Vérifier la tête distante et le dernier checkpoint. Les déclarations d’une conversation ne constituent pas une preuve de sauvegarde.
3. Vérifier les empreintes de `RECUPERATION_ORIGINAUX.json` et du manifeste de production ; ouvrir les dernières images réelles.
4. Distinguer les planches existantes, retenues avec réserve, refusées et manquantes. Ne jamais compter un prompt ou un brouillon comme illustration terminée.
5. Reprendre la première planche absente ou dont le contrôle est explicitement bloquant, par lots de deux maximum. Ne pas régénérer 01–04 pour recommencer.
6. Utiliser les dernières images et les fiches personnages en références directes. Enregistrer le prompt et les dialogues avant l’appel de génération.
7. Après chaque lot : lecture visuelle des visages, mains, vêtements, tresse, blessure, décors, bulles et enchaînement. Consigner les réserves ; conserver les versions refusées sans les exposer dans le lecteur.
8. Sauvegarder images, transcription, prompts, manifestes et rapport ensemble. Faire un commit sur cette branche. Vérifier le SHA distant et l’existence des fichiers avant d’annoncer une sauvegarde.
9. Actualiser `PRODUCTION_STATUS.md` avec les champs du rapport, les contrôles, la prochaine page et le dernier commit distant effectivement vérifié. Le SHA peut être celui du précédent checkpoint pour éviter une référence circulaire au commit courant.
10. Préparer l’aperçu hors ligne `production/reprise-2026-11-11/apercu.html`. Ne pas connecter le chapitre 2 au lecteur public avant validation.

## Limites connues à préserver

Le découpage de l’ancienne session n’a pas été retrouvé dans les sources accessibles. La nouvelle version est une **reconstitution éditoriale**, pas une récupération à l’identique. Les quatre illustrations fournies sont la source des pages01–04. Les captures jointes sont des preuves de déclarations de l’ancienne session, pas des fichiers de production.

Braam est le sage ; le forgeron est le père de Vaïana, sans nom attesté. Kael et Vaïana ont une relation fraternelle. Draven ne vole pas ; Lyssara garde sa blessure à la cuisse gauche.

## Instructions à copier dans une nouvelle session

« Reprends le dépôt AETHERIS sur la branche `production/reprise-chapitre-2-2026-11-11`. Lis les quatre documents de reprise à la racine et les manifestes/audits dans `production/reprise-2026-11-11`. Vérifie les fichiers et le commit distant, ouvre les deux dernières planches retenues puis continue la première manquante, par lots de deux maximum avec contrôle et commit vérifié après chaque lot. Préserve les originaux et la distinction entre scénario récupéré et reconstitué. Ne publie pas sur main ou le site public sans ma validation finale. »
