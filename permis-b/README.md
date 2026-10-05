# Révision permis B

Site statique (HTML/CSS/JS, sans installation) pour réviser les 100 fiches officielles
de vérification du permis B : vérification intérieure ou extérieure, question de
sécurité routière et question de premiers secours.

**Utilisation :** ouvrir `index.html` dans un navigateur (double-clic). Fonctionne hors ligne.

- Tirage d'une fiche au hasard, filtrable par type (VI / VE)
- Réponses masquées jusqu'au clic sur « Afficher les réponses »
- « Je la connais » mémorise les fiches sues dans le navigateur, pour ne tirer que les autres
- Raccourcis : Espace (tirer), R (réponses), ← → (précédente / suivante)

Données : `fiches.js`, généré depuis l'extraction du PDF officiel DSR/BRPCE du
1er janvier 2018. Pour 55 vérifications, le document officiel ne donne pas de réponse ;
la fiche l'indique.
