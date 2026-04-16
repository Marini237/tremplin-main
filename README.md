# Test Tremplin - Majordhom

Projet réalisé dans le cadre du test technique Majordhom.

L’objectif était d’intégrer une maquette de formulaire de contact pour une agence immobilière, puis d’enregistrer les données saisies dans une base de données.

---

## À propos de moi

- **Nom / prénom :** Kana Marini
- **Formation :** Étudiant ingénieur en informatique à 3iL
- **Niveau d’étude :** Dernière année de cycle ingénieur
- **Stage recherché :** Stage en développement fullstack
- **Durée de stage souhaitée :** 6 mois
- **Disponibilité :** Immédiate

---

## Présentation du projet

Ce projet reproduit une maquette de formulaire immobilier fournie dans le cadre du test.

L’application permet à un utilisateur de :

- renseigner ses coordonnées,
- choisir le type de message,
- écrire un message libre,
- ajouter une ou plusieurs disponibilités pour une visite,
- envoyer le formulaire,
- enregistrer l’ensemble des données dans une base MySQL.

Le projet a été réalisé sous la forme d’une application **Next.js** avec une partie interface utilisateur, une route API serveur, Prisma pour l’accès aux données, et MySQL exécuté dans Docker.

---

## Captures d’écran

<img width="1813" height="965" alt="Image" src="https://github.com/user-attachments/assets/fedca537-7f10-4fb9-ba89-2ac5066aafbb" />

<img width="1472" height="583" alt="Image" src="https://github.com/user-attachments/assets/0d08d973-9e51-45f5-b453-50a5d34d0c7a" />

<img width="1856" height="526" alt="Image" src="https://github.com/user-attachments/assets/ecd6c873-10e5-4971-8d52-87e6b583e5fd" />

<img width="1280" height="720" alt="Image" src="https://github.com/user-attachments/assets/5f4a74f7-d73c-429c-a426-093e62029888" />
---

## Stack technique & choix

### Framework principal

- **Next.js 16.2.4**
  - Choisi pour construire une application fullstack dans un seul projet, avec rendu d’interface, composants client et routes API serveur.

### Langage

- **TypeScript**
  - Choisi pour sécuriser la structure des données et rendre le code plus clair, notamment pour les disponibilités et les échanges avec l’API.

### Interface utilisateur

- **React (via Next.js)**
  - Utilisé pour construire l’interface en composants et gérer l’état du formulaire côté client.

### Stylisation

- **CSS global simple (`globals.css`)**
  - Choisi pour rester très lisible et garder un contrôle précis sur la reproduction de la maquette sans ajouter de couche de complexité inutile.

### Base de données

- **MySQL 8.4**
  - Choisi comme base relationnelle pour stocker les demandes de contact et les disponibilités associées.

### ORM

- **Prisma**
  - Choisi pour modéliser la base, gérer les migrations et simplifier la lecture/écriture des données.

### Exécution locale de la base

- **Docker Compose**
  - Utilisé pour démarrer rapidement MySQL dans un environnement reproductible et indépendant de la machine.

### Accès runtime à MySQL

- **Prisma Adapter MariaDB**
  - Utilisé avec Prisma Client pour connecter l’application Next.js à MySQL au runtime avec la configuration actuelle du projet.

### Outil de visualisation des données

- **Prisma Studio**
  - Utilisé pour vérifier facilement les enregistrements créés dans les tables sans passer immédiatement par des requêtes SQL manuelles.

---

## Fonctionnalités réalisées

### Interface

- intégration de la maquette principale,
- fond visuel avec bloc formulaire arrondi,
- section coordonnées,
- section message,
- section disponibilités,
- bouton d’envoi.

### Logique côté client

- gestion des champs contrôlés avec `useState`,
- choix de la civilité,
- choix du type de message,
- saisie du message libre,
- ajout dynamique de disponibilités,
- suppression d’une disponibilité avant envoi,
- message de retour utilisateur après soumission.

### Logique côté serveur

- route API `POST /api/contact`,
- validation minimale des champs obligatoires,
- création d’une demande de contact,
- enregistrement des disponibilités liées à cette demande,
- retour JSON côté frontend.

### Base de données

- modélisation d’une demande principale,
- relation entre une demande et plusieurs disponibilités,
- migration Prisma appliquée sur MySQL.

---

## Structure des données

Le projet repose sur deux entités principales.

### `ContactRequest`

Contient les informations principales du formulaire :

- civilité,
- nom,
- prénom,
- email,
- téléphone,
- type de message,
- message,
- date de création.

### `Availability`

Contient les disponibilités associées à une demande :

- jour / date affichée,
- créneau horaire,
- identifiant de la demande de contact liée.

### Relation

Une demande peut contenir plusieurs disponibilités.

Autrement dit :

- **1 `ContactRequest`**
- vers **N `Availability`**

---

## Architecture du projet

```text
Utilisateur
   ↓
Composant client ContactForm
   ↓
fetch("/api/contact")
   ↓
Route API Next.js
   ↓
Prisma
   ↓
MySQL (Docker)
```

### Répartition des responsabilités

- **`app/page.tsx`** : structure générale de la page
- **`components/ContactForm.tsx`** : gestion de l’interface interactive et de la soumission
- **`app/api/contact/route.ts`** : traitement serveur de la requête
- **`lib/prisma.ts`** : initialisation réutilisable du client Prisma
- **`prisma/schema.prisma`** : modèle de données et configuration Prisma
- **`docker-compose.yml`** : démarrage de MySQL

---

## Lancement du projet

### 1. Cloner le dépôt

```bash
git clone <LIEN_DU_DEPOT>
cd tremplin-main
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer MySQL avec Docker

```bash
docker compose up -d
```

### 4. Vérifier la variable d’environnement

Le fichier `.env` doit contenir la connexion MySQL utilisée par le projet.

Exemple :

```env
DATABASE_URL="mysql://root:verysecurepassword@localhost:3306/tremplin_db"
```

### 5. Générer Prisma si nécessaire

```bash
npx prisma generate
```

### 6. Lancer l’application

```bash
npm run dev
```

### 7. Ouvrir le projet

```text
http://localhost:3000
```

---

## Vérification des données enregistrées

### Avec Prisma Studio

```bash
npx prisma studio
```

Puis consulter :

- `ContactRequest`
- `Availability`

### Vérification attendue

Après un envoi réussi :

- une nouvelle ligne doit apparaître dans `ContactRequest`,
- les disponibilités ajoutées avant l’envoi doivent apparaître dans `Availability` avec la clé étrangère correspondante.

---

## Détails d’implémentation

### Ajout des disponibilités

Le bouton **AJOUTER DISPO** n’enregistre pas immédiatement en base.

Il sert d’abord à :

- construire une disponibilité temporaire côté client,
- l’afficher immédiatement dans l’interface,
- permettre sa suppression avant validation finale.

### Envoi final

Le bouton **ENVOYER** transmet en une seule fois :

- les coordonnées,
- le type de message,
- le message,
- la liste des disponibilités temporaires.

C’est seulement à ce moment-là que l’enregistrement en base est effectué.

Ce fonctionnement évite d’écrire en base à chaque clic intermédiaire sur l’ajout d’une disponibilité.

---

## Choix techniques importants

### Pourquoi Next.js plutôt qu’un frontend + backend séparés

J’ai choisi Next.js pour garder un seul projet, ce qui simplifie :

- l’organisation générale,
- les routes API,
- le lien entre interface et logique serveur,
- la maintenance du test dans un format compact.

### Pourquoi Prisma

Prisma permet de :

- modéliser clairement la base,
- appliquer des migrations proprement,
- écrire des requêtes plus lisibles qu’en SQL brut,
- accélérer le développement sur un test technique de ce format.

### Pourquoi Docker pour MySQL

Docker permet d’assurer un démarrage rapide et reproductible de la base sans dépendre d’une installation MySQL locale déjà présente sur la machine.

---

## Difficultés rencontrées

Plusieurs points techniques ont demandé de l’attention pendant le développement :

- compréhension de la structure App Router de Next.js,
- distinction entre composants serveur et composants client,
- configuration de Prisma avec l’environnement choisi,
- mise en place correcte de la route API dans l’arborescence `app/api/contact/route.ts`,
- gestion de la connexion runtime à MySQL,
- mise en cohérence entre l’ajout local des disponibilités et leur enregistrement final en base.

Ces points ont été progressivement corrigés puis validés par test fonctionnel.

---

## Réponses aux questions demandées

### Avez-vous trouvé l’exercice facile ou difficile ? Qu’est-ce qui vous a posé problème ?

J’ai trouvé l’exercice intéressant et formateur. La partie intégration visuelle était accessible, mais la partie fullstack demandait davantage de rigueur, notamment pour l’organisation du projet Next.js, la mise en place de l’API et la connexion à la base MySQL. Les principaux points d’attention ont été la configuration de Prisma, la bonne structure des routes et la cohérence entre l’ajout local des disponibilités et leur enregistrement final.

### Avez-vous appris de nouveaux outils pour répondre à l’exercice ? Si oui, lesquels ?

Oui. Cet exercice m’a permis d’approfondir l’utilisation de **Next.js** en mode App Router, de mieux comprendre **Prisma** pour la modélisation et les migrations, et d’utiliser **Prisma Studio** pour contrôler les données enregistrées. J’ai également consolidé l’usage de **Docker Compose** pour exécuter MySQL localement.

### Quelle est la place du développement web dans votre cursus de formation ?

Le développement web occupe une place importante dans mon cursus. J’ai travaillé sur plusieurs projets liés au frontend, au backend et au fullstack, avec des technologies comme React, Angular, Node.js, Spring Boot et MySQL. Cet exercice s’inscrit donc dans la continuité de mon parcours, avec un accent particulier sur l’intégration soignée et la cohérence entre interface, logique métier et persistance des données.

---

## Améliorations possibles

Si je devais pousser le projet plus loin, j’ajouterais :

- une validation plus complète côté frontend,
- une validation plus stricte côté backend,
- un rafraîchissement automatique des données après soumission,
- une meilleure adaptation responsive mobile,
- une gestion plus avancée des retours utilisateur,
- des tests unitaires et/ou tests d’intégration.

---

## Conclusion

Ce test m’a permis de réaliser une interface fidèle à la maquette tout en mettant en place une logique fullstack complète : gestion du formulaire, ajout dynamique des disponibilités, création d’une API, persistance en base MySQL et vérification des données enregistrées.

J’ai cherché à produire un rendu lisible, structuré et cohérent, en gardant une architecture suffisamment claire pour qu’un recruteur ou un développeur puisse consulter le projet facilement.
