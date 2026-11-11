# AETHERIS — Audit de continuité de reprise

Audit du 11 novembre 2026. Sources lues : dépôt local issu de `origin/production/chapitres-1-2-2026-11-11`, fichiers de référence `personnages/`, 100 fichiers du chapitre 1 en vue d'ensemble, pages 69, 74, 76–82 et 90–100 en lecture ciblée, quatre planches jointes `upload/01-1000062644.png` à `upload/04-1000062647.png`. Aucun original modifié par cet audit.

## État matériel vérifié

- `chapters/chapitre-01/01.jpg` à `100.jpg` : 100 fichiers présents, aucune lacune de numéro, tous décodables par Pillow, aucune duplication binaire SHA-256 entre ces fichiers.
- Les 100 fichiers ne sont pas 100 pages narratives homogènes : couverture couleur en 01, présentation auteur en 02, titre en 03, date en 04, fiches personnages insérées notamment en 28, 44, 57, 63 et 85.
- `js/app.js:99` utilise bien `totalPages = 100` et construit les chemins de 01 à 100. `assets/data/database.json` n'énumère que 01–03 : métadonnée incomplète, sans conclure qu'il manque les autres images.
- La page 100 est une fin en suspens : grand navire noir, chaînes, oiseaux, mer agitée. Aucun dessin absent ne peut être déduit de ce seul suspense.
- L'audit visuel global ne vaut pas correction orthographique complète de toutes les bulles : les passages de continuité cités ci-dessous ont été lus en détail.

## Identités à verrouiller

| Personnage | Sources | Invariants vérifiés |
| --- | --- | --- |
| Kael | `personnages/kael.jpeg`, `kael2.jpeg`, ch1 p83–92, nouvelles p01–04 | 16 ans ; cheveux noirs ébouriffés ; taches de rousseur ; marque frontale ; médaillon rond confié par Aldren ; chemise claire lacée usée/déchirée, ceinture/cordon, pantalon rapiécé, sac. Généreux, manque de confiance, se fatigue. |
| Vaïana | `personnages/vaiana.jpeg`, `vaiana2.jpeg`, ch1 p84–92, nouvelles p01–04 | 10 ans ; petite fille du forgeron ; longue tresse noire ; grands yeux, frange, boucles d'oreilles, bracelets, robe usée à manches courtes, ceinture nouée, sandales. Admire Kael comme un grand frère ; relation fraternelle. Mère perdue très jeune, lien fort avec son père. |
| Aldren | `personnages/aldren.jpeg`, `aldren2.jpeg`, ch1 p91–92, nouvelles p01–04 | Environ 65 ans ; cheveux gris, barbe blanche, casquette, long manteau sombre, médaillon. A recueilli Kael bébé et l'élève comme son petit-fils. Le vieil homme des nouvelles pages est Aldren, pas le forgeron. |
| Père de Vaïana | nouvelles p03–04 | Adulte chauve, trapu et très musclé, épaisse barbe noire, chemise claire retroussée, tablier sombre de forge. Vérifie d'abord l'état de sa fille puis aide la voisine. Aucun nom confirmé dans les sources lues. |
| Braam | ch1 p83,84,92 ; nouvelle p01 | Sage chez qui Kael doit aller. **Distinct du père de Vaïana.** P83 cartouche « sage Braam » ; p84 et p92 bulles « Graam ». Retenir Braam pour la suite, consigner la correction éditoriale des anciennes graphies. |
| Lyssara | `personnages/lyssara.jpeg`, `lyssara2.jpeg`, ch1 p56–82 | 17 ans ; démone, longues mèches noires, deux cornes striées, oreilles pointues, marque frontale, bijoux et tenue sombre. Empathique ; télékinésie, barrières, communication animale. Ne pas inventer maîtrise illimitée ou guérison. |
| Draven | `personnages/draven.jpeg`, `draven2.jpeg`, ch1 p58–63,82 | Petit drake à écailles sombres, cornes, ailes, queue. Lié à Lyssara. Ne sait pas encore voler (p61). Bondit ; son attaque finale p82 est un bond, pas un vol ou une téléportation. |

## Chronologie établie avant la reprise

1. Ch1 p05–17 : fuite d'une femme avec bébé et abandon protégé par magie, puis saut de seize ans. Ne pas identifier la femme sans preuve.
2. Ch1 p26–40 : Aldren, lettre scellée et souvenir de découverte de Kael bébé. Ses origines restent mystérieuses.
3. Ch1 p56–82 : Lyssara et Draven en forêt, puis attaque. L'assaillant encapuchonné refuse de donner son nom (p69). Il est distinct des brigands précédents.
4. Ch1 p73–74 : blessure de Lyssara à la cuisse ; p81 une marque lumineuse apparaît à cette blessure ; p82 l'assaillant draine ses pouvoirs par cette plaie pour son maître non nommé. Elle est épuisée et à terre. L'incantation p81 « Elyon… Vareth… » ne prouve pas le nom de l'homme.
5. Dernière case p82 : Draven bondit vers l'assaillant. **La fuite n'est pas encore montrée dans le chapitre 1.** Elle doit être explicitée avant la rencontre avec Kael : diversion, rupture du drain, progression pénible dans le terrain, avance crédible.
6. Ch1 p83 : Kael part vers le sage Braam. P84–89 : rencontre avec Vaïana, jeu, manifestation de marque, fatigue. P90–91 : eau offerte, fatigue persistante, question sur la marque interrompue par Aldren.
7. P92 : Aldren veut aller chez « Graam » et demande à Vaïana de rejoindre son père. P93–100 : nuages noirs, panique au village, arrivée du navire noir.
8. Nouvelles p01–04 : Kael, Aldren, Vaïana rejoignent les ruelles ; une voisine appelle à l'aide près de la forge ; Kael n'a pas la force de soulever à mains nues ; Vaïana cherche son père ; levier sur billot, retrait d'une caisse ; voisine dégagée, Kael rend ses filets puis vacille. La planche 05 est la première nouvelle planche manquante attestée.

## Lecture des quatre planches récupérées

| Planche | Dialogues lus | Contrôle / réserve |
| --- | --- | --- |
| 01 | Aldren : « On monte chez Braam. » Appel : « À l’aide ! » Kael : « Attends. » | Conserve le navire noir au large. Fatigue de Kael visible. La voie vers Braam n'est pas une entrée directe à la forge. |
| 02 | Aldren : « Pas avec les mains. » Vaïana : « Mon père a ce qu’il faut ! » | Les mains de Kael tremblent. Vaïana court chercher de l'outillage/son père. Tresse visuellement raccourcie en course : réserve de continuité. |
| 03 | Père : « Tu n’as rien ? » Vaïana : « C’est la voisine. Sa jambe ! » Père : « Montre-moi. » | Père chauve/barbe noire bien distinct d'Aldren. Tresse longue jusqu'à mi-cuisse/genou ou plus bas selon angle, nettement plus longue que p02. |
| 04 | Père : « Maintenant. » Voisine : « Mes filets… » Kael : « Je les ai. » | Levier et billot visibles ; Vaïana retire une caisse ; voisine libérée, jambe bandée, soutenue par père. Kael chancelle, Aldren le retient. Ne pas le rendre soudain guéri en p05. |

## Réserves à suivre

- **Tresse de Vaïana :** ne pas modifier les originaux. Pour la suite, utiliser une longue tresse dont l'extrémité atteint environ le genou en station debout, selon la perspective ; ne pas substituer une courte natte d'épaule. Les vues repliées ne permettent pas une mesure absolue. Comparer en priorité les nouvelles p01 et p03.
- **Braam/Graam :** incohérence orthographique établie. Braam est le sage. Ne pas donner son nom au père forgeron.
- **Blessure de Lyssara :** p74 et p81/82 montrent la cuisse anatomiquement gauche (à droite pour le lecteur dans la vue frontale p81). Maintenir ce côté ; éviter plan miroir non justifié. La plaie n'est pas une simple fatigue : elle sert au drain magique. Pas de cicatrisation spontanée.
- **Poursuite :** l'homme peut masquer sa présence et provoquer une brume (p77–80) ; ne pas lui attribuer téléportation ou omniscience sans preuve. Il doit chercher/reprendre une piste après la diversion pour expliquer l'avance de Lyssara.
- **Kael :** fatigue liée au jeu/marque (p88–91), puis secours physique. Une pause/eau/gestes limités sont crédibles ; exploits soudains de force et guérison instantanée seraient incohérents.
- **Voisine :** blessure à la jambe, foulard clair, gilet sombre, longue jupe, chemise claire ; pas de diagnostic médical inventé.
- **Ordre de lecture :** nouvelles planches lisibles de gauche à droite et haut en bas. Garder cet ordre dans l'aperçu.
- **Ch1 corrections éditoriales possibles, à préparer séparément :** p69 accords et impératifs, p76 « Qui es-tu ? », p78 « Où est-il ? »/« Il a disparu », p92 « Que se passe-t-il, grand-père ? » et Braam. Les images existantes sont conservées. Aucun correctif par réécriture d'image réalisé dans cet audit.

## Point de départ recommandé pour p05–06

Faire entrer le groupe et la voisine dans la forge, poser Kael au repos ; laisser Vaïana agir concrètement (eau, tabouret) et son père se montrer protecteur. Aldren doit conserver l'urgence d'aller chez Braam, sans abandonner brutalement son petit-fils chancelant. Le père n'est pas Braam. La branche Lyssara doit repartir de Draven en plein bond p82, montrer l'interruption du drain et une fuite laborieuse avant toute rencontre. Aucun nouveau nom de maître ou d'assaillant n'est confirmé.

Cet audit ne prétend pas retrouver le découpage exact des 20 pages : seule sa présence éventuelle dans un autre fichier ou une archive peut l'attester.
