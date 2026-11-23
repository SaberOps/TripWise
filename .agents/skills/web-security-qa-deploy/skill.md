---
name: web-security-qa-deploy
description: Sécurité, tests et déploiement web : OWASP, auth, validation, tests unitaires/E2E, CI/CD, observabilité et mise en production.
---

# Sécurité, tests et déploiement web

À appliquer avant toute livraison, et pendant le développement pour l'authentification, les formulaires et les API.

## 1. Sécurité applicative (référence : OWASP Top 10 en vigueur, OWASP ASVS)

**Entrées / injections**
- Valider et typer toute entrée côté serveur (liste blanche) ; ne jamais faire confiance au client.
- Requêtes SQL paramétrées ou ORM ; jamais de concaténation de chaînes.
- Échapper les sorties selon le contexte (HTML, attribut, URL, JS). Éviter `innerHTML` / `dangerouslySetInnerHTML` ; si indispensable, assainir avec une bibliothèque reconnue (DOMPurify).
- Pas de `eval`, pas d'exécution de commandes shell avec des entrées utilisateur.

**Authentification et sessions**
- Mots de passe hachés avec Argon2id, bcrypt ou scrypt (jamais MD5/SHA seuls). Ne pas écrire sa propre crypto.
- Préférer une solution éprouvée (OIDC/OAuth 2.0, Auth.js, Keycloak, fournisseur géré) à une implémentation maison.
- Cookies de session : `HttpOnly`, `Secure`, `SameSite=Lax` ou `Strict`. Rotation de l'identifiant de session à la connexion, expiration, déconnexion effective.
- MFA proposée pour les comptes sensibles ; limitation de débit et verrouillage progressif contre le brute force.
- JWT : algorithme fixé côté serveur, durée courte, vérification de `exp`, `aud`, `iss` ; ne pas y stocker de secrets ; éviter le stockage dans `localStorage` pour les jetons sensibles.

**Autorisation**
- Vérifier les droits côté serveur sur chaque requête et chaque objet (prévenir IDOR / Broken Access Control). Principe du moindre privilège.

**Protections navigateur**
- HTTPS partout + HSTS.
- En-têtes : `Content-Security-Policy` (sans `unsafe-inline` si possible), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, protection du clickjacking (`frame-ancestors`).
- Protection CSRF pour les requêtes avec cookies (jeton CSRF ou SameSite + vérification d'origine).
- CORS : origines explicitement autorisées, jamais `*` avec des identifiants.

**Données et secrets**
- Secrets en variables d'environnement ou gestionnaire de secrets ; jamais commités. Si un secret fuit : le révoquer et le régénérer.
- Chiffrement en transit et, pour les données sensibles, au repos. Ne logguer ni mots de passe, ni jetons, ni données personnelles inutiles.
- Uploads : vérifier type réel, taille, renommer, stocker hors du dossier public, scanner si possible.
- Messages d'erreur génériques côté client ; détails uniquement dans les logs.

**Chaîne d'approvisionnement**
- Fichier de verrouillage (lockfile) commité, `npm audit` / `pip-audit` / Dependabot ou Renovate, minimiser les dépendances, vérifier la fiabilité d'un paquet avant de l'ajouter.

**Vie privée**
- Collecter le minimum ; bannière de consentement si cookies non essentiels (RGPD) ; politique de confidentialité ; possibilité de suppression des données.

## 2. Tests
Pyramide : beaucoup de tests unitaires, un nombre raisonnable de tests d'intégration, peu de tests E2E sur les parcours critiques.
- Unitaires/composants : Vitest ou Jest (+ Testing Library), pytest côté Python. Tester le comportement visible, pas l'implémentation.
- Intégration API : requêtes réelles sur une base de test (conteneur éphémère) ; couvrir cas nominaux, erreurs, droits refusés.
- E2E : Playwright (ou Cypress) sur inscription/connexion, parcours principal, paiement si présent.
- Accessibilité automatisée (axe) dans les tests E2E ; tests visuels si l'UI est critique.
- Chaque bug corrigé reçoit un test de non-régression.
- Viser des tests déterministes (pas de dépendance au réseau externe ni à l'heure réelle).

## 3. CI/CD
Pipeline minimal à chaque pull request : installation avec lockfile → lint → typage → tests → build → audit des dépendances.
- Déploiement automatisé depuis la branche principale ; environnements séparés (dev / staging / production) avec configuration propre à chacun.
- Prévisualisation par PR si l'hébergeur le permet.
- Migrations de base de données versionnées, rétrocompatibles, appliquées dans le pipeline.

## 4. Déploiement
- Choisir l'hébergement selon le projet (statique/JAMstack : Netlify, Vercel, Cloudflare Pages ; app full-stack : conteneur Docker sur PaaS ou VPS). Vérifier tarifs et limites actuels avant de recommander.
- Docker : image multi-étapes, utilisateur non root, pas de secrets dans l'image, `.dockerignore`.
- Reverse proxy avec TLS (Let's Encrypt), compression, cache, limitation de débit.
- Domaine, DNS, redirections www/non-www et HTTP→HTTPS.
- Sauvegardes automatiques de la base, restauration testée au moins une fois.
- Plan de retour arrière (rollback) documenté.

## 5. Observabilité
- Logs structurés avec identifiant de requête ; suivi d'erreurs (Sentry ou équivalent) ; métriques et alertes basiques ; endpoint de santé `/health`.
- Suivi des Core Web Vitals en production si possible.

## 6. Checklist avant mise en production
- [ ] Aucun secret dans le dépôt ni dans le bundle client.
- [ ] HTTPS + en-têtes de sécurité vérifiés (ex. scan type securityheaders / Mozilla Observatory).
- [ ] Authentification, autorisation et validation côté serveur testées.
- [ ] `npm audit` (ou équivalent) sans vulnérabilité critique non traitée.
- [ ] Tests unitaires, intégration et E2E verts en CI.
- [ ] Sauvegarde et rollback prêts.
- [ ] Pages d'erreur, `robots.txt`, `sitemap.xml`, analytics/consentement en place.
- [ ] README et documentation d'exploitation à jour.

## 7. Règle d'honnêteté
Indiquer clairement ce qui a été exécuté et vérifié, et ce qui reste à valider. Aucune garantie de « sécurité totale » : proposer un audit ou un test d'intrusion pour les applications sensibles.