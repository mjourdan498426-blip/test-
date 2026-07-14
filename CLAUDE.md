@AGENTS.md

# CLAUDE.md

Guide pour Claude Code (et l'équipe) sur ce dépôt.

## Projet

Site vitrine **one-page** de **Jourdan Marc — Consultant IA pour PME**.
Objectif : présenter les services (Audit IA, Automatisation, Formation), la
méthode et un moyen de contact. Ton premium, façon agence tech haut de gamme.

## Stack

- **Next.js 16** (App Router, Turbopack) — voir `@AGENTS.md` : cette version a
  des changements cassants, consulter `node_modules/next/dist/docs/` au besoin.
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/postcss`, config dans `app/globals.css`)
- **Fonts** : `next/font/google` — Space Grotesk (titres) + Inter (texte),
  auto-hébergées (aucune requête externe au runtime)

Rendu **100 % statique** — déployable sur Vercel sans configuration.

## Commandes

```bash
npm run dev     # serveur de dev → http://localhost:3000
npm run build   # build de production (à lancer avant tout commit non-trivial)
npm run start   # sert le build de production
npm run lint    # ESLint
```

## Structure

```
app/
  layout.tsx     # <html lang="fr">, fonts, metadata SEO (title, OG, keywords)
  page.tsx       # tout le contenu des 5 sections (source d'édition principale)
  globals.css    # design system : variables couleurs, .glass, .reveal, animations
components/
  Nav.tsx        # nav sticky glass qui se condense au scroll (client)
  Reveal.tsx     # fade-in au scroll via IntersectionObserver (client)
  Parallax.tsx   # parallax discret rAF-throttlé, respecte reduced-motion (client)
```

## Conventions

- **Contenu éditorial** : centralisé dans `app/page.tsx` (tableaux `services`,
  `steps`, et le JSX des sections). Modifier le texte ici, pas ailleurs.
- **Email de contact** : constante `CONTACT_EMAIL` en haut de `app/page.tsx`
  (`jourdanmarc@aol.com`), utilisée par les liens `mailto:`.
- **Design system** : couleurs et effets définis comme variables CSS dans
  `app/globals.css` (`--accent-1/2/3`, `.glass`, `.text-gradient`, `.card-hover`,
  `.btn-glow`). Réutiliser ces classes plutôt que de dupliquer des styles.
- **Animations** : envelopper un bloc dans `<Reveal>` pour le fade-in au scroll
  (`delay` en ms, `as` pour changer la balise). `prefers-reduced-motion` est
  respecté partout — ne pas ajouter d'animation qui l'ignore.
- **Accessibilité / sémantique** : garder les balises `header/main/section/
  article/ol/footer` et les `aria-hidden` sur les éléments décoratifs.
- **SEO** : toute metadata vit dans `export const metadata` de `app/layout.tsx`.
  Les mots-clés ciblent « consultant IA PME » — préserver cet axe.

## Déploiement

Connecter le dépôt à Vercel : détection automatique de Next.js, aucun réglage.
Penser à mettre à jour `siteUrl` dans `app/layout.tsx` avec le domaine réel.

## Notes

- `npm run build` doit rester vert avant chaque commit touchant le code.
- Les composants avec `"use client"` (Nav, Reveal, Parallax) le sont pour cause
  d'API navigateur (scroll, IntersectionObserver) — garder `page.tsx` en Server
  Component.
