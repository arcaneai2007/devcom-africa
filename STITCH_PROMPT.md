# 🚀 MASTER PROMPT GOOGLE STITCH — DevCom Africa
> **Produit :** DevCom Africa — La plateforme d'échange africaine, pour les devs, par les devs  
> **Cible :** [Google Stitch](https://stitch.withgoogle.com/)  
> **Objectif :** Concevoir une interface SaaS / plateforme communautaire haute fidélité pour développeurs africains.

---

## 📋 Directives d'utilisation sur Google Stitch

1. Ouvrez [Google Stitch](https://stitch.withgoogle.com/).
2. Créez un nouveau projet intitulé **DevCom Africa**.
3. Collez le **Prompt Principal** ci-dessous dans la console de création.
4. Utilisez les **Prompts d'Itération par Écran** pour générer les vues détaillées (Catalogue, Bourse aux échanges, Profil, Messagerie).

---

```markdown
PROMPT PRINCIPAL POUR GOOGLE STITCH :

Role: Principal Product Designer & Senior Frontend UI/UX Architect.
Task: Design an ultra-premium, full-featured developer exchange platform named "DevCom Africa".
Tagline: "La plateforme d'échange africaine : pour les devs, par les devs."

### 1. BRAND IDENTITY & DESIGN SYSTEM
- Theme: Modern Cyber-African Dark Mode with Obsidian Slate (#0A0E1A, #111827).
- Color Accents:
  * Primary (Ecosystem & Growth): Cyber Emerald Green (#10B981, #059669).
  * Secondary (Value & Bounties): Sunset Amber Gold (#F59E0B, #D97706).
  * Tertiary (Connectivity & APIs): Electric Cyan (#06B6D4, #3B82F6).
  * Surfaces: Dark glassmorphism cards (rgba(18, 25, 41, 0.75), 1px border rgba(255,255,255,0.08), backdrop blur 16px).
- Typography: Outfit / Inter for UI, JetBrains Mono for code blocks and commands.
- Vibe: Production-grade developer platform combining the best of GitHub, npm registry, and Upwork, tailored specifically for African engineering challenges (Mobile Money, offline-first, USSD, SMS gateways).

### 2. CORE INTERFACE ARCHITECTURE

#### A. GLOBAL HEADER & NAVIGATION
- Brand: Sleek glowing DevCom icon (African continent outline intertwined with an infinity loop) + "DevCom Africa" text.
- Navigation links:
  * "⚡ Composants & APIs"
  * "💰 Bourse & Bounties"
  * "🤝 Entraide & Troc"
  * "👥 Développeurs"
- Omnisearch Bar: Centered, with keyboard shortcut hint "⌘K", instant autocomplete across packages, bounties, and dev profiles.
- Right Action Bar:
  * Country Filter (Benin 🇧🇯, Ivory Coast 🇨🇮, Senegal 🇸🇳, Nigeria 🇳🇬, Kenya 🇰🇪, Cameroon 🇨🇲).
  * Messages icon with unread count pill badge.
  * Notifications bell with animated ping.
  * "+ Créer un Échange" Primary CTA Button (Emerald gradient).
  * Developer Profile avatar with reputation points (e.g. "1,250 DP").

#### B. HERO SECTION (IMPACTFUL PRODUCT PITCH)
- Headline: "La plateforme d'échange africaine, pour les devs, par les devs."
- Subtitle: "Partagez des modules de code testés pour l'Afrique (Mobile Money, Offline sync, USSD), financez des bounties de développement en devises locales et échangez vos compétences en direct."
- Live platform metrics bar:
  * "480+" Composants & SDKs africains vérifiés
  * "1,420+" Développeurs inscrits à travers 14 pays
  * "24.5M FCFA" Volume de bounties & missions échangés
  * "99.8%" Taux de résolution des demandes d'entraide
- Fast filter chips: [Tous], [💳 Mobile Money], [📶 Offline-First], [📱 USSD & SMS], [🛡️ Auth & KYC], [☁️ Cloud & DevOps].

#### C. MODULE 1: CATALOGUE DE COMPOSANTS & APIS AFRICAINES
- Grid of interactive package cards:
  * Title, category badge, country flag, rating, and download counter.
  * One-click install command snippet (`npm i @devcom/momo-pay`, `pip install devcom-wave`).
  * Tabs: "Aperçu", "Code", "Documentation", "Tester en Sandbox".
  * Key modules featured:
    1. MTN MoMo & Moov Webhook Auto-Retry (TypeScript / Python).
    2. Wave Checkout & Instant QR Generator (Python / Node.js).
    3. Offline-First IndexedDB Sync Engine for Low-Connectivity Networks.
    4. USSD Tree Navigation Framework (*345#) for Telecom Integrations.
    5. SMS OTP Low-Cost Gateway Router.

#### D. MODULE 2: BOURSE AUX ÉCHANGES & BOUNTIES
- Split view / Feed of active developer exchanges:
  * Bounties rémunérés en FCFA avec versement Mobile Money garanti (ex: "150,000 FCFA — SDK Flutter Wave").
  * Troc de compétences (ex: "J'offre un audit de sécurité backend contre une intégration frontend Next.js").
  * Demandes d'entraide urgente avec récompense en DevPoints.
- Action buttons: "Postuler", "Proposer une collaboration", "Détails".

#### E. MODULE 3: RÉPERTOIRE DES TALENTS & PROFILS DÉVELOPPEURS
- Cards of active developers:
  * Name, avatar, verified badge, country flag, title (e.g., "Fullstack & Cloud Engineer").
  * Tech stack chips: React, Next.js, Python, Flutter, Docker.
  * Reputation score, completed exchanges count.
  * Button: "Envoyer un message / Proposer un échange".

#### F. MODULE 4: SYSTÈME DE MESSAGERIE & MISE EN RELATION
- Floating chat drawer with active conversations, code snippet sharing in chat, and exchange agreement confirmation.

#### G. MODAL DE PUBLICATION D'ÉCHANGE
- Modern modal with 3 exchange types:
  1. "Publier un composant / package open-source"
  2. "Lancer un bounty ou une mission rémunérée"
  3. "Demander de l'aide technique / Proposer un troc de compétences"
```

---

## 🎨 Prompts d'Itération par Écran (Google Stitch)

### Écran 1 : La Fiche Composant / Package Détaillée
> *"Design a detailed Component Showcase Page for '@devcom/momo-pay'. Include an interactive code viewer with dark syntax highlighting, copyable install command, live API parameter playground, author profile card from Benin 🇧🇯, and community discussion tab with upvotes."*

### Écran 2 : La Bourse aux Bounties et Troc de Compétences
> *"Generate the Bounty and Skills Exchange Marketplace feed. Display price badges in bold FCFA (e.g., '150,000 XOF') with Mobile Money logos (MTN MoMo, Wave, Moov). Include filters for bounty amount, difficulty level, and skills exchange tags."*

### Écran 3 : Le Profil Développeur et Portfolio Communautaire
> *"Create a Developer Profile Screen for 'Modeste YABLA' from Cotonou, Benin. Show a clean header with avatar, bio, tech stack pills, GitHub link, rating (4.9/5 stars), a portfolio of published African snippets, and a transaction history of completed bounties."*

### Écran 4 : L'Interface de Messagerie & Collaboration Directe
> *"Design a sleek in-app direct messaging drawer between two developers negotiating an API integration exchange. Include formatted code blocks inside chat bubbles, an attachment button, and a 'Créer un contrat d'échange' button."*
