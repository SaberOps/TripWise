---
name: web-frontend-quality
description: Qualité front-end : HTML sémantique, CSS responsive, accessibilité WCAG, performance Core Web Vitals, SEO et design soigné.
---

# Qualité front-end

À appliquer à toute interface web créée ou modifiée. Pour la direction esthétique, charger aussi le skill `frontend-design` s'il est disponible.

## 1. HTML sémantique
- Une structure claire : `header`, `nav`, `main` (un seul), `section`, `article`, `aside`, `footer`.
- Hiérarchie de titres logique (un `h1`, pas de niveaux sautés).
- `button` pour les actions, `a` pour la navigation. Jamais de `div` cliquable.
- Formulaires : `label` associé à chaque champ, bons `type` et `autocomplete`, messages d'erreur liés via `aria-describedby`.
- `lang` sur `<html>` ; `dir="rtl"` pour l'arabe.

## 2. CSS et responsive
- Mobile-first, `meta viewport`, unités relatives (rem, %, clamp()).
- Mise en page avec Flexbox/Grid ; container queries quand un composant dépend de son conteneur.
- Variables CSS (design tokens) : couleurs, espacements, rayons, ombres, typographie.
- Tester à ~360 px, 768 px, 1280 px et plus ; aucun défilement horizontal parasite.
- Respecter `prefers-reduced-motion` et `prefers-color-scheme` (mode sombre si pertinent).
- Éviter `!important` et les sélecteurs trop spécifiques ; si Tailwind : classes cohérentes, composants extraits quand répétés.

## 3. Accessibilité (cible : WCAG 2.2 niveau AA)
- Contraste : 4,5:1 pour le texte normal, 3:1 pour le grand texte et les composants UI.
- Tout utilisable au clavier : ordre de tabulation logique, focus visible, pas de piège au clavier, lien d'évitement (« Aller au contenu »).
- Cibles tactiles suffisamment grandes (au moins 24×24 px selon WCAG 2.2, 44 px recommandé sur mobile).
- Images : `alt` pertinent (ou `alt=""` si décorative). Icônes seules : nom accessible.
- ARIA seulement quand le HTML natif ne suffit pas ; le premier principe est de ne pas en mettre si une balise native existe.
- Ne pas communiquer une information par la couleur seule.
- Modales/menus : gestion du focus, fermeture avec Échap, `aria-expanded` et rôles corrects.
- Vérifier avec axe / Lighthouse et un test clavier manuel ; signaler que les outils automatiques ne détectent qu'une partie des problèmes.

## 4. Performance (Core Web Vitals)
Seuils « bon » : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 (au 75e percentile).
- Images : formats modernes (WebP/AVIF), `width`/`height` ou `aspect-ratio` (évite le CLS), `srcset`/`sizes`, `loading="lazy"` sauf pour l'image LCP (qui reçoit `fetchpriority="high"`).
- Polices : `font-display: swap`, sous-ensembles, peu de graisses ; auto-hébergement conseillé.
- JavaScript : code splitting, import dynamique, supprimer les dépendances lourdes inutiles, `defer` sur les scripts, découper les tâches longues.
- CSS critique inline pour les pages statiques simples ; pas de CSS inutilisé volumineux.
- Cache HTTP (assets avec hash + `Cache-Control` long), compression Brotli/gzip, CDN.
- Mesurer avant/après (Lighthouse, WebPageTest, Chrome DevTools, données terrain CrUX si disponibles). Ne pas optimiser à l'aveugle.

## 5. SEO et partage
- `<title>` unique et `meta description` par page, URL propres, `link rel="canonical"`.
- Open Graph / Twitter Card, favicon, `robots.txt`, `sitemap.xml`.
- Données structurées (JSON-LD) quand pertinent.
- Contenu principal rendu côté serveur ou statique pour les pages à indexer.

## 6. Qualité de l'expérience
- Gérer systématiquement les états : chargement (skeleton), vide, erreur, succès, hors-ligne si pertinent.
- Retour visuel immédiat sur les actions ; pas de saut de mise en page.
- Pages 404/500 soignées, formulaires avec validation claire et conservation de la saisie.
- Cohérence : un seul système d'espacements, de typographie et de couleurs.

## 7. Compatibilité
- Définir une liste de navigateurs cible (browserslist) ; vérifier la prise en charge d'une fonctionnalité CSS/JS récente sur MDN / Can I use avant de l'employer, avec repli (progressive enhancement).

## Checklist finale
- [ ] Lighthouse : accessibilité, bonnes pratiques et SEO sans problème majeur ; performance mesurée.
- [ ] Navigation clavier complète testée.
- [ ] Rendu vérifié sur 3 largeurs.
- [ ] Aucune erreur dans la console.