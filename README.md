# 🌍 DevCom Africa — La plateforme d'échange africaine, pour les devs, par les devs

[![Systalink Challenge](https://img.shields.io/badge/Systalink%20Challenge-Coupe%20d'Afrique%20des%20Développeurs%202026-059669?style=for-the-badge&logo=codeforces)](https://platform.systalink.com/overview)
[![Équipe Binary Minds](https://img.shields.io/badge/Équipe-Binary%20Minds%20🇧🇯%20Bénin-D97706?style=for-the-badge)](https://platform.systalink.com)
[![Déployé sur Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Systalink Datacloud](https://img.shields.io/badge/Systalink%20Cloud-Datacloud%20Ready%20(-40%25)-2563EB?style=for-the-badge)](https://platform.systalink.com)

> **Projet officiel soumis au Systalink Challenge 2026**  
> **Thème :** *« Construire la plateforme d'échange africaine, pour les devs, par les devs. Livrez un projet utilisable et hébergé en ligne. »*  
> **Équipe :** **Binary Minds** (*« Deux esprits. Des possibilités infinies. Deux esprits valent mieux qu'un. »*)  
> **Auteur principal :** Modeste YABLA (`arcaneai2007@gmail.com`) — Cotonou, Bénin 🇧🇯

---

## 🌟 Vision du Projet

Les développeurs africains font face à des défis d'ingénierie uniques : intégrations complexes des passerelles **Mobile Money** (MTN MoMo, Moov Money, Orange Money, Wave), **instabilité des réseaux internet 3G/4G** imposant le paradigme *Offline-First*, interactions massives via protocoles télécoms **USSD (*345#)**, et coûts d'hébergement cloud souvent prohibitifs.

**DevCom Africa** est l'écosystème unifié conçu pour résoudre ces problématiques :
1. **⚡ Hub de Solutions & Snippets Africains :** Code source prêt à l'emploi (validation HMAC, webhooks résilients, synchronisation IndexedDB, routeur SMS à bas coût).
2. **🤝 Espace "Binary Minds" (Pair-Programming Flash) :** Trouve un binôme de développement en moins de 60 secondes pour débloquer un bug ou réviser du code (*« Deux esprits valent mieux qu'un »*).
3. **💰 Place de Marché & Bounties (FCFA / Mobile Money) :** Missions financées avec rétribution directe en XOF par Mobile Money.
4. **☁️ Intégration Systalink Datacloud :** Optimisé pour l'infrastructure cloud partenaire avec réduction de 40% et latence inférieure à 15 ms en Afrique de l'Ouest.

---

## 🚀 Démarrage Rapide & Visite en Local

L'application est prête à être exécutée immédiatement :

```bash
# Dans le dossier D:\Modeste\DevCom :
python -m http.server 3000
```

Ouvrez ensuite votre navigateur sur : **[http://localhost:3000](http://localhost:3000)**.

---

## 📤 Déploiement sur GitHub & Vercel

### Étape 1 : Initialiser et pousser sur GitHub

```bash
# 1. Initialiser le dépôt git
git init
git add .
git commit -m "feat: Initialisation MVP DevCom Africa - Systalink Challenge 2026 (Binary Minds)"

# 2. Créer le dépôt sur votre compte GitHub (ex: devcom-africa) et lier :
git branch -M main
git remote add origin https://github.com/<votre-utilisateur-github>/devcom-africa.git
git push -u origin main
```

### Étape 2 : Déploiement en 1 clic sur Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez votre compte GitHub.
2. Cliquez sur **"Add New..."** ➔ **"Project"**.
3. Sélectionnez le dépôt `devcom-africa`.
4. Vercel détecte automatiquement la configuration (`vercel.json`).
5. Cliquez sur **"Deploy"** : votre URL de démo en direct est générée en quelques secondes !

---

## 🎨 Utilisation de Google Stitch (`stitch.withgoogle.com`)

Le fichier [`STITCH_PROMPT.md`](./STITCH_PROMPT.md) contient le **Master Prompt complet et calibré** pour générer les maquettes interactives haute fidélité sur la plateforme Google Stitch.

Pour itérer sur l'interface :
1. Ouvrez [Google Stitch](https://stitch.withgoogle.com/).
2. Copiez le contenu du prompt principal depuis [`STITCH_PROMPT.md`](./STITCH_PROMPT.md).
3. Utilisez les prompts d'itération par écran (Hero, Snippet Card, Binary Minds Lobby, Bounty Board).

---

## 🏗️ Structure des Fichiers

```
D:\Modeste\DevCom\
├── index.html            # Structure sémantique HTML5 complète & responsive
├── styles.css            # Design System (tokens, dark/light mode, glassmorphism)
├── app.js                # Moteur interactif (omnisearch, filtres, bac à sable, pair dev)
├── vercel.json           # Configuration optimale Vercel (clean URLs, caching)
├── package.json          # Métadonnées du projet et commandes npm
├── STITCH_PROMPT.md      # Master Prompt Google Stitch complet
├── README.md             # Présentation et guide de soumission
└── assets/
    ├── hero-banner.jpg   # Bannière 8k écosystème tech africain
    └── logo.jpg          # Logo officiel DevCom / Binary Minds
```

---

## 🏆 Checklist Systalink Challenge (Équipe Binary Minds)

- [x] **1. Compte créé :** Modeste YABLA (`arcaneai2007@gmail.com`)
- [x] **2. Équipe constituée :** Binary Minds 🇧🇯
- [x] **3. Projet déclaré :** DevCom Africa
- [x] **4. Produit Systalink Datacloud actif :** Partenariat -40% intégré dans l'UI
- [x] **5. Dépôt Git + Démo Vercel :** Prêt pour soumission au jury
