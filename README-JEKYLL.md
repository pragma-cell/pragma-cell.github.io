# Migration Jekyll - Pragma IT

## 🎯 Objectif

Migration du site statique HTML vers Jekyll avec ajout d'un blog optimisé SEO pour améliorer le référencement sur les mots-clés liés à la digitalisation des PME.

## 📋 Ce qui a été fait

### 1. Structure Jekyll
- ✅ Configuration `_config.yml` avec SEO optimisé
- ✅ Layouts : `default.html`, `post.html`, `blog.html`
- ✅ Includes : `navigation.html`, `footer.html`, `seo-schema.html`
- ✅ Page d'accueil convertie en template Jekyll (`index.md`)
- ✅ Page blog (`blog/index.html`)

### 2. Blog avec 3 articles optimisés SEO
- ✅ "Digitalisation des PME : Par où commencer ?"
- ✅ "Les 7 erreurs fatales de la digitalisation en PME"
- ✅ "Comment automatiser vos processus sans vous ruiner ?"

### 3. Optimisation SEO
- ✅ Plugin `jekyll-seo-tag` pour meta tags automatiques
- ✅ Schema.org (LocalBusiness, BlogPosting, BreadcrumbList)
- ✅ Sitemap automatique via `jekyll-sitemap`
- ✅ RSS Feed via `jekyll-feed`
- ✅ `robots.txt` configuré
- ✅ Open Graph et Twitter Cards
- ✅ Structured data pour Google Rich Results

### 4. GitHub Actions
- ✅ Workflow de déploiement automatique (`.github/workflows/jekyll-gh-pages.yml`)

## 🚀 Installation et Build Local

### Prérequis
- Ruby >= 3.0
- Bundler

### Installation

```bash
# Vérifier la version de Ruby
ruby --version  # Doit être >= 3.0

# Si Ruby est trop ancien, installer rbenv ou rvm
# macOS avec Homebrew :
brew install rbenv
rbenv install 3.2.0
rbenv local 3.2.0

# Installer les dépendances
bundle install

# Lancer le serveur local
bundle exec jekyll serve

# Le site sera accessible sur http://localhost:4000
```

### Build de production

```bash
bundle exec jekyll build
```

Les fichiers générés seront dans `_site/`.

## 📊 Optimisations SEO Implémentées

### Mots-clés ciblés
- Digitalisation PME
- Transformation numérique TPE
- Accompagnement digital Belgique
- Audit informatique PME
- Stratégie digitale
- Automatisation processus

### Structure SEO

#### Meta tags dynamiques
Chaque page et article a :
- Title optimisé
- Meta description unique
- Keywords ciblés
- Open Graph (LinkedIn, Facebook)
- Twitter Cards

#### Schema.org
- **LocalBusiness** : Pour le référencement local (Hannut, Liège)
- **BlogPosting** : Pour chaque article
- **BreadcrumbList** : Navigation claire pour Google
- **FAQPage** : Support FAQ (extensible)

#### Sitemap et Robots
- Sitemap XML automatique
- robots.txt configuré pour les crawlers
- Feed RSS pour les abonnés

## 🔧 Configuration GitHub Pages

### Option 1 : Via GitHub Actions (Recommandé)

Le workflow est déjà configuré dans `.github/workflows/jekyll-gh-pages.yml`.

**Étapes :**

1. Aller dans les Settings du repository
2. Pages → Source → "GitHub Actions"
3. Pusher la branche `feature/jekyll-blog-migration` ou la merger dans `main`
4. Le build se lancera automatiquement

### Option 2 : Build automatique GitHub Pages

Si vous préférez le build automatique sans GitHub Actions :

1. Settings → Pages → Source → "Deploy from a branch"
2. Sélectionner la branche `main` (ou `feature/jekyll-blog-migration`)
3. GitHub détectera automatiquement Jekyll et buildera

⚠️ **Limitation** : GitHub Pages supporte uniquement certains plugins Jekyll. Notre configuration est compatible.

## 📝 Ajouter un nouvel article de blog

C'est **ultra simple** ! Il suffit de créer un fichier `.md` dans `_posts/` :

### Étape 1 : Créer le fichier

Format : `YYYY-MM-DD-titre-de-l-article.md`

```bash
touch _posts/2025-01-15-mon-nouvel-article.md
```

### Étape 2 : Ajouter le front matter

```markdown
---
layout: post
title: "Mon Titre d'Article"
date: 2025-01-15 10:00:00 +0100
categories: [Stratégie, Outils]
tags: [PME, digitalisation, conseil]
author: "Pragma IT"
excerpt: "Résumé de l'article en 1-2 phrases pour le SEO et l'aperçu."
image: /assets/images/blog/mon-image.jpg
reading_time: 8
keywords: "mots-clés, SEO, pour, cet, article"
show_author_bio: true
---

Contenu de l'article en Markdown...

## Section 1

Texte...

## Section 2

Texte...
```

### Étape 3 : C'est tout !

Le fichier sera automatiquement :
- Listé sur la page blog
- Accessible via URL `/blog/2025/01/15/mon-nouvel-article/`
- Optimisé SEO (meta tags, schema.org)
- Ajouté au sitemap et RSS feed

## 📁 Structure du Projet

```
.
├── _config.yml              # Configuration Jekyll
├── _layouts/
│   ├── default.html         # Layout principal
│   ├── post.html           # Layout article de blog
│   └── blog.html           # Layout index blog
├── _includes/
│   ├── navigation.html     # Menu navigation
│   ├── footer.html         # Footer
│   └── seo-schema.html     # Schema.org pour SEO
├── _posts/                  # Articles de blog (Markdown)
│   ├── 2025-01-02-digitalisation-pme.md
│   ├── 2024-12-15-erreurs-digitalisation.md
│   └── 2024-11-28-automatiser-processus.md
├── assets/
│   ├── css/
│   │   ├── theme-dark-premium.css
│   │   ├── responsive.css
│   │   └── blog.css        # Styles blog
│   ├── js/
│   ├── images/
│   └── icons/
├── blog/
│   └── index.html          # Page d'accueil blog
├── index.md                # Page d'accueil site
├── Gemfile                 # Dépendances Ruby
├── robots.txt              # SEO
└── .github/
    └── workflows/
        └── jekyll-gh-pages.yml  # CI/CD
```

## 🎨 Traductions i18n

Le système i18n existant (FR/NL/EN) fonctionne toujours via `assets/js/i18n.js`.

Pour ajouter des traductions aux articles de blog, vous pouvez :
1. Créer des collections par langue dans `_config.yml`
2. Ou utiliser le plugin `jekyll-multiple-languages-plugin`

## 🔍 Vérifier le SEO

### Outils recommandés

1. **Google Search Console** : Soumettre le sitemap
2. **Google PageSpeed Insights** : Vérifier la performance
3. **Schema Markup Validator** : Tester les données structurées
4. **Ahrefs / SEMrush** : Suivre le ranking

### URLs importantes

- Sitemap : `https://pragma-cell.github.io/sitemap.xml`
- RSS : `https://pragma-cell.github.io/feed.xml`
- Blog : `https://pragma-cell.github.io/blog/`

## 📈 Prochaines étapes recommandées

1. ✅ Merger cette branche dans `main`
2. ✅ Activer GitHub Pages
3. 🔄 Ajouter 2-3 articles/mois sur des sujets ciblés
4. 🔄 Soumettre le sitemap à Google Search Console
5. 🔄 Créer des backlinks depuis LinkedIn/Medium
6. 🔄 Ajouter des images optimisées aux articles
7. 🔄 Implémenter Google Analytics pour suivre le trafic

## 🆘 Problèmes connus

### Build local échoue (version Ruby)

Si `bundle install` échoue :

```bash
# Installer une version moderne de Ruby
rbenv install 3.2.0
rbenv local 3.2.0

# Réinstaller bundler
gem install bundler
bundle install
```

### Le site ne se déploie pas sur GitHub Pages

1. Vérifier que GitHub Pages est activé (Settings → Pages)
2. Vérifier les logs du workflow (Actions)
3. S'assurer que `_config.yml` n'a pas d'erreurs YAML

## 💡 Conseils pour le SEO

### Fréquence de publication
- **Minimum** : 1 article/mois
- **Idéal** : 2-3 articles/mois
- **Objectif** : 20-30 articles au total

### Sujets à couvrir
- Études de cas clients (anonymisés)
- Guides pratiques ("Comment faire X")
- Comparatifs d'outils
- Tendances du marché
- Retours d'expérience

### Longueur optimale
- **Articles courts** : 800-1200 mots (guides rapides)
- **Articles longs** : 2000-3000 mots (guides complets)

### Maillage interne
- Lier les articles entre eux
- Lier vers les pages services
- Lier vers la page contact avec CTA

---

**Questions ?** Contactez-moi pour plus de détails sur la migration.
