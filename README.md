# Mizan — Suivi des cours de l'or et de l'argent

Application web permettant de consulter les cours actuels de l'or et de l'argent en temps réel, avec conversion en différentes devises, historique des prix et estimation de bijoux selon leur poids.

## Présentation du projet

Mizan est une application développée dans le cadre d'un projet individuel chez **YouCode**.

Elle a été conçue pour répondre aux besoins de la bijouterie **Al Andalous**, située à Nador, qui souhaite centraliser les informations sur les cours de l'or et de l'argent dans une interface simple, rapide et accessible.

L'application récupère les données depuis l'API publique [goldprice.dev](https://goldprice.dev/docs) et les affiche dynamiquement.

## Fonctionnalités

### 1. Consultation des prix (US-01)
- Récupération des cours de l'or et de l'argent depuis l'API.
- Affichage du prix actuel.
- Affichage de la devise utilisée.
- Affichage de la date et de l'heure de la dernière mise à jour.

### 2. Cartes de prix dynamiques (US-02)
- Génération automatique des cartes à partir des données reçues.
- Affichage de la variation des prix.
- Indication de la tendance avec une flèche et une couleur.

### 3. Choix de la devise (US-03)
- Sélection entre MAD, USD et EUR.
- Actualisation des prix selon la devise choisie.
- Conservation de la devise sélectionnée pour les prochaines visites.

### 4. Historique des prix (US-04)
- Consultation de l'historique sur 7 ou 30 jours.
- Affichage de l'évolution des prix sous forme de graphique.
- Gestion des historiques contenant moins de points que prévu.

### 5. Estimateur de bijoux (US-05)
- Saisie du poids d'un bijou en grammes.
- Sélection du métal.
- Calcul automatique de la valeur estimée.
- Validation des données saisies.
- Affichage des messages d'erreur en cas de saisie invalide.

### 6. Gestion des états et des erreurs (US-06)
- État de chargement.
- État de succès.
- État d'erreur.
- Gestion des erreurs réseau, HTTP, hors-ligne, quota et JSON invalide.
- Possibilité de relancer une requête avec le bouton « Réessayer ».

### 7. Journal des requêtes (US-07 — Bonus)
- Affichage des dernières requêtes effectuées.
- Méthode HTTP.
- URL appelée.
- Code de statut.
- Durée de la requête en millisecondes.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript Vanilla (ES Modules)
- API REST : goldprice.dev
- Fetch API
- LocalStorage
- SVG / Canvas pour la visualisation des historiques (selon l'implémentation)

Aucun framework JavaScript ni aucune bibliothèque de graphiques ne sont utilisés.

## Structure du projet

```text
Mizan/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── services/
│   │   └── api.js
│   ├── modules/
│   │   ├── calculator.js
│   │   ├── history.js
│   │   └── storage.js
│   └── ui/
│       ├── render.js
│       └── events.js
│
├── .gitignore
└── README.md
```

*Cette structure est indicative et doit être adaptée à l'organisation réelle du projet.*

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone <repository-url>
```

### 2. Accéder au dossier

```bash
cd Mizan
```

### 3. Lancer l'application

Ouvrir le fichier `index.html` avec un serveur local, par exemple Live Server sur VS Code.

## Sécurité et bonnes pratiques

- Utilisation de `textContent` pour afficher les données provenant de l'API.
- Séparation des appels réseau et de la logique d'affichage.
- Utilisation des modules ES JavaScript.
- Validation des entrées utilisateur.
- Gestion des erreurs réseau et HTTP.
- Respect du quota de l'API.
- Aucune donnée personnelle n'est collectée.
- Aucune authentification ni base de données.

## Objectifs pédagogiques

Ce projet permet de mettre en pratique :

- La consommation d'une API REST avec Fetch.
- La programmation asynchrone avec `async/await`.
- La manipulation du DOM.
- La communication entre modules ES.
- La gestion des événements.
- La validation des formulaires.
- Le stockage local avec LocalStorage.
- La gestion des erreurs et des états d'une application.
- L'utilisation de Git et GitHub.

## Auteur

Projet réalisé individuellement dans le cadre de la formation **YouCode Nador**.

## API utilisée

[goldprice.dev — Documentation officielle](https://goldprice.dev/docs)

---

**Mizan — Les cours des métaux, simplement.**