# 🎉 Event Planning Portal

Une application web responsive pour la gestion d'événements avec distinction des rôles administrateur et client.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📑 Sommaire

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
  - [Administrateur](#administrateur)
  - [Client](#client)
  - [Fonctionnalités bonus](#fonctionnalités-bonus-implémentées)
- [Architecture et décisions techniques](#-architecture-et-décisions-techniques)
  - [Architecture Onion](#architecture-onion)
  - [Gestion des données](#gestion-des-données)
  - [Pagination](#pagination)
  - [Séparation admin/client](#séparation-des-fonctionnalités-adminclient)
  - [Thème clair/sombre](#thème-clairsombre)
  - [Principes SOLID](#principes-solid-appliqués)
- [Technologies utilisées](#-technologies-utilisées)
- [Responsive Design](#-responsive-design)
- [Installation et démarrage](#-installation-et-démarrage)
- [Utilisation](#-utilisation)
  - [Comptes de démonstration](#comptes-de-démonstration)
  - [Fonctionnalités principales](#fonctionnalités-principales)
- [Simplifications et hypothèses](#-simplifications-et-hypothèses)

## 👀 Aperçu

Event Planning Portal est une application web moderne permettant la gestion complète d'événements, incluant la création, la modification, la réservation et le suivi. L'interface adaptative fonctionne aussi bien sur ordinateurs que sur appareils mobiles.

## ✨ Fonctionnalités

### Administrateur

- 📋 Voir la liste des événements avec titre, date, heure et lieu
- ➕ Créer un événement (titre, description, date/heure, lieu, capacité, etc.)
- 🖊️ Modifier et supprimer un événement existant
- 👥 Voir les réservations (liste de clients ayant réservé un événement)

### Client

- 🔍 Voir les événements
- ℹ️ Accéder aux détails d'un événement
- 🎟️ Réserver une place s'il reste des disponibilités
- 📜 Visualiser ses réservations passées

### Fonctionnalités bonus implémentées

- 🔐 Authentification de base (distinction admin/client)
- 🔄 Filtrage/tri des événements (par date, lieu, catégorie)
- 🔎 Recherche d'événements avec une barre de recherche fonctionnelle
- 📚 Historique de réservation du client
- 🌓 Thème clair/sombre
- 📄 Pagination des listes d'événements et de réservations

## 🏗️ Architecture et décisions techniques

### Architecture Onion

L'application utilise une **architecture Onion** (ou architecture en couches) qui offre plusieurs avantages:

- **Séparation des préoccupations**: Chaque couche a une responsabilité spécifique
- **Testabilité améliorée**: Les couches peuvent être testées indépendamment
- **Maintenabilité**: Facilite les modifications et extensions futures
- **Découplage**: Réduit les dépendances entre les composants

Les couches principales sont:

1. **Cœur** (`lib/`) - Contient la logique métier et les entités
2. **Services** (`hooks/`) - Gère l'accès aux données et encapsule la logique
3. **UI** (`components/`, `app/`) - Interface utilisateur et routes

### Gestion des données

L'application utilise une approche de gestion des données en mémoire avec persistance via localStorage:

- 💾 Les données sont stockées dans le localStorage du navigateur
- 🔄 Des hooks personnalisés (`useEvents` et `useReservations`) encapsulent la logique de gestion des données
- 🚀 Les données sont chargées au démarrage de l'application et sauvegardées à chaque modification

### Pagination

- 📄 Implémentation d'un composant de pagination réutilisable
- 🧩 Logique de pagination encapsulée dans les services de données
- ⚡ Pagination côté client pour optimiser les performances

### Séparation des fonctionnalités admin/client

- 🛣️ Routes distinctes pour les fonctionnalités administrateur (`/admin/*`)
- 🔒 Vérification des rôles utilisateur pour l'accès aux fonctionnalités protégées
- 🎨 Interface utilisateur adaptée en fonction du rôle de l'utilisateur

### Thème clair/sombre

- 🌓 Utilisation de next-themes pour la gestion du thème
- 🖥️ Support du thème système, clair et sombre
- 💾 Persistance du choix de thème entre les sessions

### Principes SOLID appliqués

- **S**ingle Responsibility: Chaque composant et hook a une responsabilité unique
- **O**pen/Closed: L'architecture permet d'étendre les fonctionnalités sans modifier le code existant
- **L**iskov Substitution: Les interfaces sont cohérentes et substituables
- **I**nterface Segregation: Les interfaces sont spécifiques aux besoins
- **D**ependency Inversion: Les composants dépendent des abstractions (hooks) plutôt que des implémentations concrètes

## 🛠️ Technologies utilisées

- **[Next.js](https://nextjs.org/)**: Framework React pour le développement full-stack
- **[React](https://reactjs.org/)**: Bibliothèque UI pour la construction d'interfaces
- **[TypeScript](https://www.typescriptlang.org/)**: Typage statique pour une meilleure qualité de code
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utilitaire pour le styling
- **[shadcn/ui](https://ui.shadcn.com/)**: Composants UI réutilisables
- **localStorage**: Pour la persistance des données côté client
- **[next-themes](https://github.com/pacocoursey/next-themes)**: Pour la gestion du thème clair/sombre

## 📱 Responsive Design

L'application est entièrement adaptative et offre une expérience utilisateur optimale sur:

- 💻 Ordinateurs de bureau et portables
- 📱 Tablettes
- 📱 Smartphones

Cette conception responsive est obtenue grâce à:

- L'utilisation des classes responsives de **Tailwind CSS**
- Des composants adaptés aux différentes tailles d'écran
- Des hooks personnalisés (`use-mobile.tsx`) pour détecter et s'adapter aux appareils mobiles
- Une navigation simplifiée sur les petits écrans via `user-nav.tsx`

## 🚀 Installation et démarrage

```bash
# Cloner le dépôt
git clone https://github.com/votre-nom/event-planning-portal.git
cd event-planning-portal

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Ou pour construire et démarrer en production
npm run build
npm start
```

L'application sera disponible à l'adresse http://localhost:3000

## 👥 Utilisation

### Comptes de démonstration

- **Admin**: admin@example.com (mot de passe : n'importe quoi)
- **Client**: client@example.com (mot de passe : n'importe quoi)

### Fonctionnalités principales

1. 🏠 Parcourir les événements sur la page d'accueil
2. 🔎 Filtrer et rechercher des événements
3. ℹ️ Voir les détails d'un événement et réserver une place
4. 📜 Consulter ses réservations
5. ⚙️ Pour les administrateurs, gérer les événements et voir les réservations

## ⚠️ Simplifications et hypothèses

- 👶 Projet réalisé dans le cadre d’un niveau intern/junior
- 🔑 Authentification simplifiée sans véritable backend
- 👤 Utilisateurs de démonstration prédéfinis (admin et client)
- ✅ Pas de validation côté serveur des données
- 🔄 Pas de gestion des conflits de données entre utilisateurs
- 💰 Les événements sont gratuits (pas de gestion de paiement)
