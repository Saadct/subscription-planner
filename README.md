# Subscription Planner

**Lien de déploiement :** [subscription-planner.vercel.app](https://subscription-planner.vercel.app)

**Description :**
Subscription Planner est une application Angular moderne pour suivre les prélèvements et abonnements de manière simple et efficace. Elle offre un calendrier interactif, un dashboard analytique et une gestion complète côté utilisateur et administrateur.

* **Côté utilisateur :**

  * Suivi des prélèvements et abonnements.
  * Visualisation dans un calendrier.
  * Dashboard avec statistiques et analyses personnalisées.

* **Côté administrateur :**

  * Gestion des utilisateurs.
  * Gestion des catégories d’abonnements.
  * Dashboard global avec toutes les données d’abonnements.

---

## 🔑 Accès de test

Pour tester l’application, voici les utilisateurs disponibles :

| Email                                         | Mot de passe | Rôle  |
| --------------------------------------------- | ------------ | ----- |
| [admin@example.com](mailto:admin@example.com) | admin123     | Admin |
| [user@example.com](mailto:user@example.com)   | user123      | User  |

---

## ⚙️ Fonctionnalités principales

* Authentification et gestion des rôles (User / Admin).
* Calendrier interactif pour suivre les abonnements.
* Dashboard utilisateur avec analyse des dépenses et suivi des prélèvements.
* Dashboard administrateur avec vue globale sur tous les utilisateurs et abonnements.
* Gestion des catégories d’abonnements côté admin.
* Interface responsive et moderne.

---

## 💻 Installation locale

1. Cloner le dépôt :

```bash
git clone <ton-repo-github>
cd subscription-planner
```

2. Installer les dépendances :

```bash
npm install
```

3. Lancer le projet en mode développement :

```bash
ng serve
```

4. Ouvrir le navigateur sur :

```
http://localhost:4200
```

---

## 🏗️ Build pour production

Pour générer le build de production :

```bash
ng build --configuration production
```

Le dossier `dist/subscription-planner` contient le build prêt à être déployé.

---

## 🚀 Déploiement

L’application est déployée sur Vercel :
[https://subscription-planner.vercel.app](https://subscription-planner.vercel.app)

* Si vous souhaitez redéployer vous-même :

```bash
npm install -g vercel
vercel
```

ou configurez le projet pour un déploiement automatique via GitHub.

---

## 📁 Structure du projet

* `src/app/features/auth` : Authentification et gestion des utilisateurs.
* `src/app/features/subscriptions` : Gestion des abonnements et calendrier.
* `src/app/features/admin` : Gestion admin, dashboard global, utilisateurs et catégories.
* `src/app/shared/components` : Composants réutilisables (header, navbar…).
* `src/app/core/guards` : Guards pour la protection des routes (auth / admin).
* `src/app/core/services` : Services Angular pour l’authentification et les données.

---

## 📝 Notes

* Les mots de passe sont stockés en clair dans ce projet pour simplification des tests.
* En production, il est **recommandé de hasher les mots de passe** et de sécuriser le backend avec un vrai serveur et base de données.
* L’application utilise Angular 20+ et des **signals** pour la réactivité.

