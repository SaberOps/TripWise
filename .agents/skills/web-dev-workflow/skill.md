---
name: web-dev-workflow
description: Workflow complet pour développer un site ou une app web : cadrage, choix de stack, architecture, implémentation incrémentale et définition de « terminé ».
---

# Développement web : workflow de bout en bout

À utiliser dès qu'on demande de créer, refondre ou étendre un site / une application web.

## 1. Cadrage (avant d'écrire du code)
- Reformuler le besoin : objectif, utilisateurs cibles, pages/écrans, fonctionnalités, contraintes (délai, budget, hébergement, langues, navigateurs).
- Lister les hypothèses. Poser au maximum 3 questions bloquantes ; sinon avancer avec des hypothèses explicites.
- Distinguer MVP et « plus tard ». Ne pas construire de fonctionnalités non demandées.
- Pour une demande ambiguë sur la stack : proposer 2 options avec compromis, recommander une.

## 2. Choix de stack (justifier chaque choix)
- Site statique/vitrine/blog : HTML/CSS/JS ou générateur statique (Astro, Eleventy…).
- App interactive / SaaS : framework full-stack (Next.js, Nuxt, SvelteKit, Remix…) ou SPA + API.
- Back-end : choisir selon l'équipe (Node/TypeScript, Python/FastAPI/Django, PHP/Laravel, Java/Spring…). Préférer ce que l'utilisateur maîtrise déjà.
- Données : relationnel (PostgreSQL/MySQL) par défaut ; NoSQL seulement si le modèle l'exige.
- Toujours vérifier la version actuelle et la doc officielle d'une bibliothèque avant d'utiliser son API (WebSearch/WebFetch). Ne jamais inventer une API, une option de config ou un nom de paquet : si on n'est pas sûr, vérifier ou le dire.
- TypeScript par défaut pour tout JS non trivial.

## 3. Architecture
- Structure par fonctionnalité (feature folders) plutôt que par type de fichier quand le projet grossit.
- Séparer : UI, logique métier, accès aux données, configuration.
- Définir tôt : modèle de données, contrat d'API (REST/OpenAPI ou GraphQL/tRPC), gestion d'erreurs, authentification/autorisation, stratégie de rendu (SSG/SSR/CSR/ISR), gestion d'état (local d'abord, global seulement si nécessaire).
- Variables d'environnement pour toute config/secret ; fournir un `.env.example`, jamais de secret dans le dépôt.

## 4. Implémentation incrémentale
1. Initialiser le projet, lint (ESLint), formatage (Prettier), typage strict, hooks de commit.
2. Tranche verticale minimale qui fonctionne de bout en bout (UI → API → base).
3. Ajouter les fonctionnalités une par une, chacune avec tests, gestion des états vide/chargement/erreur.
4. Valider les entrées côté serveur (Zod, Joi, Pydantic…) même si le client valide aussi.
5. Commits petits, messages clairs (Conventional Commits).

## 5. Standards de code
- Fonctions courtes, noms explicites, pas de duplication évidente, pas de code mort.
- Composants UI réutilisables et composables ; props typées.
- Gestion d'erreurs explicite (pas de `catch` vide) ; messages utilisateur compréhensibles, logs techniques détaillés côté serveur.
- Accès aux données : requêtes paramétrées / ORM, pagination, index sur les colonnes filtrées, éviter les requêtes N+1.
- Internationalisation dès le départ si plusieurs langues (textes hors du code, support RTL si arabe).

## 6. Définition de « terminé »
- [ ] Le projet se lance avec des commandes documentées (README : install, dev, build, test, déploiement).
- [ ] Build de production sans erreur ni avertissement bloquant ; lint et typage passent.
- [ ] Tests passent ; parcours critiques testés.
- [ ] Responsive vérifié (mobile, tablette, desktop).
- [ ] Accessibilité, performance et sécurité vérifiées (voir skills `web-frontend-quality` et `web-security-qa-deploy`).
- [ ] Aucun secret dans le code ; `.env.example` à jour.
- [ ] Limites connues et prochaines étapes listées honnêtement dans la réponse finale.

## 7. Règle d'honnêteté
Ne jamais affirmer qu'une fonctionnalité marche sans l'avoir exécutée (build, tests, ouverture de la page). Si quelque chose n'a pas pu être vérifié, le dire explicitement.