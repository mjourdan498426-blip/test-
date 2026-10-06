# Révision permis B · Auto-école St Marc

Bandeau de l'auto-école en haut : stages permis à points, agences de Pierrelatte
(Place de l'Église) et Lapalud (4 avenue de la Gare), téléphones cliquables.

Site statique (HTML/CSS/JS, sans installation) pour réviser les 100 fiches officielles
de vérification du permis B : vérification intérieure ou extérieure, question de
sécurité routière et question de premiers secours.

**Utilisation :** ouvrir `index.html` dans un navigateur. Fonctionne hors ligne,
pensé d'abord pour le téléphone.

- **Choisir sa fiche** : 🎲 au hasard ou 🔢 par son numéro (pavé numérique, 00 = fiche 100).
  Le numéro s'affiche comme un compteur kilométrique qui tourne.
- **Réviser** : filtres intérieur / extérieur / à revoir.
  Glisser la carte à gauche pour la suivante, à droite pour la précédente.
  Chaque réponse se dévoile séparément. « Je sais » marque la fiche comme sue.
- **Défi** : série de 5, 10 ou 20 fiches. Pour chaque question on dit si on savait ;
  score, série 🔥, record et confettis. Les fiches réussies en entier sont marquées comme sues.
- Tiroir « toutes les fiches » avec recherche (pneu, feux, alerte…).
- Raccourcis : N (choisir un numéro), Espace / → (au hasard), ← (précédente), R (réponse), K (je sais), L (liste).

Données : `fiches.js`, généré depuis l'extraction du PDF officiel DSR/BRPCE du
1er janvier 2018. Pour 55 vérifications, le document officiel ne donne pas de réponse
écrite ; la fiche l'indique.

## Réponses complémentaires

Le document officiel ne donne pas de réponse pour 55 vérifications (gestes à
faire sur le véhicule). `complements.js` contient une réponse rédigée par
l'auto-école pour chacune, affichée avec la mention « non officielle », et un
pictogramme tiré de Material Design Icons (Pictogrammers, licence libre).
