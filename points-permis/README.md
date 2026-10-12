# Mes points de permis

Application web pédagogique, en français, qui estime le solde de points du permis
de conduire. Elle tient compte du permis probatoire, des infractions datées, des
infractions simultanées et des délais de récupération. Chaque événement est expliqué
en mots simples, avec l'article du Code de la route.

> Estimation indicative : le solde officiel est tenu par le ministère de l'Intérieur.

- **Aucun backend** : tout le calcul se fait sur l'appareil. Les saisies sont stockées
  dans `localStorage` et ne sont envoyées nulle part (bouton « Tout effacer »).
- **PWA installable** qui fonctionne hors ligne (`vite-plugin-pwa`).
- Vite, React 19, TypeScript, Tailwind CSS v4. Aucune bibliothèque de dates.

## Lancement

```bash
cd points-permis
npm install
npm run dev       # http://localhost:5173
npm run build     # vérification TypeScript + build de production dans dist/
npm run preview   # sert dist/ (http://localhost:4173)
```

## Tests

```bash
npm test          # Vitest : moteur de calcul et données (src/lib/compute.test.ts)
npm run test:e2e  # Playwright : rendu mobile à 360, 390 et 430 px
```

Avec un Chromium déjà installé (sans `playwright install`) :

```bash
PLAYWRIGHT_CHROMIUM_PATH=/chemin/vers/chromium npm run test:e2e
```

Les tests Playwright vérifient les points suivants : ouverture à vide, ordre mobile
(solde, saisies, chronologie), parcours complet avec le panneau coulissant, barre
compacte du solde, zones tactiles d'au moins 44 px, champs d'au moins 16 px, texte
agrandi à 200 % sans défilement horizontal, manifeste et service worker.

Pour l'audit Lighthouse mobile (la catégorie PWA n'existe plus depuis Lighthouse 12) :

```bash
npm run build && npx vite preview --port 4173 &
npx lighthouse@11 http://localhost:4173/ --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices,pwa
```

## Structure

```
src/
  data/infractions.ts    # barème typé {art, title, pts, cls}, cls ∈ 'D' | 1..5
  lib/dates.ts           # dates civiles en UTC, ajouts de mois/années avec fin de mois
  lib/compute.ts         # calcul pur (sans React) : solde, chronologie, prochaines étapes
  lib/compute.test.ts    # un scénario par règle (Vitest)
  lib/storage.ts         # sauvegarde localStorage protégée par try/catch
  components/            # jauge, résultat, saisies, panneau coulissant, chronologie, règles
  App.tsx                # mise en page : mobile d'abord, deux colonnes sur bureau
tests/mobile.spec.ts     # tests Playwright (émulation mobile)
public/icons/            # icônes PWA 192 / 512 px (+ maskable)
```

## Règles implémentées

Toutes les règles sont dans `src/lib/compute.ts`, commentées.

- **Régime selon la date d'obtention.** Avant le 01/03/2004 : 12 points.
  Du 01/03/2004 au 31/12/2007 : 6 points fixes, puis 12 à la fin du probatoire
  sans infraction. Depuis le 01/01/2008 : +2 points par an (+3 en conduite
  accompagnée) tant qu'aucune infraction n'est commise. La formation
  complémentaire réduit le probatoire. La date du 01/01/2008 est isolée dans
  `ANNUAL_INCREASE_START`, **à confirmer sur Légifrance**.
- **Retraits** à la date de paiement ou de condamnation (L223-1). Le solde ne
  descend pas sous 0. Les infractions commises **au même lieu et à la même heure**
  sont plafonnées à 8 points au total (L223-2) : l'usager les relie au moment de la
  saisie. Un retrait isolé de 9 points (L235-1) n'est pas réduit.
- **Récupérations** : un point à 6 mois ; retour à 12 points après 2 ou 3 ans
  (chaîne d'infractions, jamais avant la fin du probatoire) ; 10 ans pour les
  contraventions de classe 1 à 4 ; stage (+4 points, un par an).
- **Invalidation** à 0 point (L223-5, R223-3) : la procédure est affichée et la
  simulation s'arrête.

## Données

Le barème (72 infractions, dont le palier à 1 point de R413-14 découpé selon la
vitesse maximale autorisée) reprend le document « Infractions et retrait de
points » : Code de la route, Légifrance, textes consolidés au 12 octobre 2026.
Les intitulés sont abrégés ; seul le texte de l'article fait foi.

## Hors périmètre

Permis étrangers, suspensions, annulations.
