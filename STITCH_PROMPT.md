# 🚀 MASTER PROMPT GOOGLE STITCH — DevCom Africa
> **Produit :** DevCom Africa — Le Carrefour des Développeurs Africains  
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
Tagline: "Le Carrefour des Développeurs Africains."

### 1. BRAND IDENTITY & DESIGN SYSTEM ("SOLAR TECH AFRICA")
- Theme: Modern Cyber-African Dark Mode with Deep Slate (#0A0E17, #111726, #161F33) & Clean High-Contrast Light Mode (#F8FAFC, #FFFFFF).
- Color Accents:
  * Primary (Cyber Indigo): Electric Indigo (#6366F1, #4F46E5) with subtle luminous glow.
  * Secondary (Solar Tangerine): African Sun Energy (#F97316, #EA580C).
  * Financial & Escrow: Emerald Mint (#10B981, #059669).
  * Telecom & Connectivity: Deep Sky Cyan (#0EA5E9).
- Typography:
  * Headings: Outfit / Plus Jakarta Sans (bold, modern geometric).
  * Body: Plus Jakarta Sans (clean readability).
  * Code & Terminals: Fira Code / JetBrains Mono.
- Vibe: Production-grade developer platform combining the best of npm, GitHub, and Upwork, tailored specifically for African engineering challenges (Mobile Money, offline-first CRDTs, USSD, SMS gateways).

### 2. CORE INTERFACE ARCHITECTURE

#### A. GLOBAL HEADER & UTILITY BAR
- Top Utility Bar:
  * Live status indicator: "● Réseau Panafricain Actif • 18 pays connectés".
  * Interactive Persona Switcher: [👤 Visiteur] | [💻 Développeur Membre] | [🏢 Porteur de Projet] | [🌍 Mainteneur].
  * Data-Saver toggle button: "⚡ Économie Data : ON / OFF" (essential for low-bandwidth African contexts).
  * Multi-currency switcher: [FCFA] | [NGN ₦] | [KES KSh] | [USD $].
- Sticky Main Navbar:
  * Brand Logo: DevCom Africa with animated circuit/solar icon.
  * Navigation links: "Composants & APIs", "Bounties & Missions", "Troc Technique", "Projets Open Source", "Talents".
  * Actions: Dark/Light Mode toggle, Direct Messages drawer trigger, "+ Publier un Échange" CTA pill button.

#### B. HERO SECTION (INTERACTIVE LIVE PREVIEW)
- Headline: "Le Carrefour des Développeurs Africains."
- Subtitle: "Partagez des modules logiciels conçus pour les réalités du continent (Mobile Money, USSD, Offline-First), débloquez vos projets entre pairs et monétisez vos compétences en monnaie locale."
- Hero Live Code Terminal Widget:
  * Tabs: [MTN MoMo C2B], [Wave Checkout], [Menu USSD *345#], [Sync Offline CRDT].
  * Interactive "Simuler l'Appel API" button with real-time console streaming output.
- Live platform metrics ribbon:
  * "520+" Modules & SDKs vérifiés
  * "28.4M FCFA" Versés en Bounties & Séquestre
  * "18" Pays Connectés
  * "98.4%" Taux d'Entraide Résolue

#### C. MODULE 1: CATALOGUE DE COMPOSANTS & SDKS AFRICAINS
- Filter toolbar: [Tous les modules], [💳 Fintech & Mobile Money], [📱 Télécoms & USSD], [📶 Offline & Sync], [🛡️ Sécurité & Webhooks].
- Instant search bar with real-time filtering.
- Cards showing:
  * Package title (`@devcom/orange-money-webpay`, `@devcom/momo-disbursement`, `devcom-wave-checkout`, `devcom-ussd-core`).
  * Author & country badge (Bénin 🇧🇯, Sénégal 🇸🇳, Côte d'Ivoire 🇨🇮, Nigeria 🇳🇬, Rwanda 🇷🇼).
  * Upvote counter button.
  * 1-click install command snippet.
  * "🧪 Tester dans le Sandbox" button opening live execution modal.

#### D. MODULE 2: BOURSE AUX BOUNTIES & SÉQUESTRE GARANTI
- Missions rémunérées avec conversion multi-devises en temps réel.
- Escrow security guarantee badge: "🛡️ Séquestre Garanti".
- Details: Difficulty level, deadline, applicants counter, company name, and "Postuler au Bounty" CTA.

#### E. MODULE 3: ENTRAIDE & TROC TECHNIQUE ENTRE PAIRS (PEER BARTER)
- Practical skill exchanges:
  * "J'offre : Architecture Django & Webhooks MoMo — Je cherche : Débogage Flutter iOS".
  * "J'offre : Conteneurisation Docker & VPS — Je cherche : Revue de code React UI".
- "Proposer un Échange" button opening direct communication drawer.

#### F. MODULE 4: PROJETS OPEN-SOURCE & PREUVE DE TRAVAIL (PROOF OF WORK)
- Showcasing active African initiatives (`afri-geo-address`, `open-ussd-simulator`, `wa-invoice-bot`).
- Badges: "Bon premier ticket", "Tous niveaux", "Help Wanted".
- Proof of Work philosophy: verified GitHub PRs and commits rather than declarations.

#### G. MODULE 5: ANNUAIRE DES TALENTS PANAFRICAINS
- Verified developer cards with initials avatar, location, skills tags, DevPoints score, and "Contacter en Direct" button.

#### H. MODALES INTERACTIVES & DRAWER
1. Sandbox Modal: Code viewer + live console runner.
2. Multi-Type Create Modal: Tabs for (+ Composant, + Bounty, + Troc, + Projet).
3. Chat Drawer: Instant direct messaging with contacts (Amina, Emmanuel, Chukwudi).
4. Responsive Toast Notification Shelf.
```
