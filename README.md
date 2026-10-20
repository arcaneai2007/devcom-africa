# 🌍 DevCom Africa — La plateforme d'échange africaine, pour les devs, par les devs

[![Plateforme Panafricaine](https://img.shields.io/badge/Plateforme-Panafricaine%20DevCom-059669?style=for-the-badge)](https://github.com/arcaneai2007/devcom-africa)
[![Déployé sur Vercel](https://img.shields.io/badge/Deploy%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Licence MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **DevCom Africa** est la plateforme d'échange tout-en-un conçue pour et par les développeurs africains : partage de composants et SDKs locaux (Mobile Money, offline-first, USSD), bourse aux missions & bounties financés en devises locales, entraide technique et mise en relation directe.

---

## 🚀 Fonctionnalités Clés

1. **⚡ Catalogue de Composants & APIs Africaines :**
   - Intégrations prêtes à l'emploi pour **MTN MoMo**, **Moov Money**, **Wave**, passerelles **USSD (*345#)** et moteurs de synchronisation **Offline-First**.
   - Bac à sable (sandbox) d'exécution de code directement dans le navigateur.
   - Commandes d'installation prêtes (`npm i @devcom/momo-pay`, `pip install devcom-wave`, etc.).

2. **💰 Bourse aux Échanges & Bounties :**
   - Missions et défis techniques rémunérés en monnaies locales (FCFA, NGN, KES) avec versement Mobile Money.
   - Candidature et suivi des projets en temps réel.

3. **🤝 Espace d'Entraide & Troc de Compétences :**
   - Échange équitable de services entre développeurs (revue de code, audit de sécurité, mentorat).
   - Récompense en DevPoints pour valoriser la contribution communautaire.

4. **👥 Annuaire & Messagerie Directe :**
   - Profils de développeurs vérifiés à travers tout le continent (Bénin 🇧🇯, Côte d'Ivoire 🇨🇮, Sénégal 🇸🇳, Nigeria 🇳🇬, Rwanda 🇷🇼).
   - Tiroir de messagerie en temps réel pour échanger du code et collaborer sur des projets.

5. **👤 Espace Membre & Réputation :**
   - Suivi du score de réputation (DevPoints), historique des contributions et gestion des échanges actifs.

---

## 💻 Tester et Visiter en Local

Le projet fonctionne instantanément sans build complexe :

```bash
# Dans le dossier racine du projet :
python -m http.server 3000
```

Puis ouvrez votre navigateur sur : **[http://localhost:3000](http://localhost:3000)**.

---

## 🎨 Master Prompt Google Stitch

Le document [`STITCH_PROMPT.md`](./STITCH_PROMPT.md) contient le Master Prompt calibré pour générer et itérer sur l'ensemble des écrans haute fidélité de DevCom Africa dans [Google Stitch](https://stitch.withgoogle.com/).

---

## 📤 Déploiement sur GitHub & Vercel

### 1. Pousser vers GitHub

```bash
git add .
git commit -m "feat: DevCom Africa - La plateforme d'échange africaine pour les devs par les devs"
git push -u origin main
```

### 2. Déploiement sur Vercel
1. Rendez-vous sur [vercel.com](https://vercel.com).
2. Cliquez sur **Add New...** ➔ **Project**.
3. Sélectionnez le dépôt `devcom-africa`.
4. Cliquez sur **Deploy** (Vercel détecte automatiquement la configuration [`vercel.json`](./vercel.json)).
