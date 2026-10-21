/**
 * DevCom Africa — Logique & Interactivité (Original & Moderne)
 * Fonctionnalités :
 * - Personas Démo (Visiteur, Développeur, Porteur de Projet, Mainteneur)
 * - Mode Économie de Données (Data-Saver)
 * - Convertisseur Multi-Devises (FCFA, NGN, KES, USD)
 * - Hero Live Code Sandbox
 * - Catalogue Composants & APIs avec Bac à Sable & Copie
 * - Bounties en Devises Locales & Séquestre
 * - Espace Entraide & Troc Technique entre Pairs
 * - Projets Open Source & Preuve de Travail
 * - Annuaire Panafricain & Messagerie Directe
 */

// ==========================================================================
// 1. ÉTAT GLOBAL DE L'APPLICATION
// ==========================================================================
const appState = {
  theme: localStorage.getItem('devcom_theme') || 'dark',
  dataSaver: localStorage.getItem('devcom_datasaver') === 'true',
  persona: 'developer',
  currency: 'FCFA', // 'FCFA', 'NGN', 'KES', 'USD'
  activeCategory: 'all',
  searchQuery: '',
  modalType: 'component',
  activeChatContact: 'Amina Diallo',

  // Taux de conversion par rapport au FCFA
  currencyRates: {
    'FCFA': { symbol: 'FCFA', rate: 1, suffix: true },
    'NGN': { symbol: '₦', rate: 2.5, suffix: false },
    'KES': { symbol: 'KSh', rate: 0.22, suffix: false },
    'USD': { symbol: '$', rate: 0.00164, suffix: false }
  },

  // Données Hero Terminal
  heroDemos: {
    momo: {
      title: "mtn-momo-c2b.ts",
      code: `import { MoMoDisbursement } from '@devcom/momo-disbursement';

const momo = new MoMoDisbursement({
  apiKey: process.env.MOMO_API_KEY!,
  subscriptionKey: process.env.MOMO_SUB_KEY!,
  country: 'BJ' // Bénin
});

// Déclenche une demande de paiement C2B instantanée
export async function collectMobileMoney(phone: string, amount: number) {
  const result = await momo.requestToPay({
    amount: amount,
    currency: 'XOF',
    payer: { partyIdType: 'MSISDN', partyId: phone },
    payerMessage: 'DevCom Bourse & Services'
  });
  return result; // Retourne le ReferenceId pour le Webhook
}`,
      simulation: `[MOMO GATEWAY] Initialisation de la connexion sécurisée UEMOA...
[AUTH] Token d'accès OAuth2 généré avec succès (validité 3600s).
[DISPATCH] Requête C2B transmise vers +229 97 00 00 00 pour 15 000 XOF...
[USSD PUSH] Invite de confirmation transmise sur le mobile client.
[WEBHOOK] Callback reçu avec signature HMAC valide : Statut SUCCÈS.
[SOLDE] 15 000 XOF crédités sur le compte séquestre DevCom.`
    },
    wave: {
      title: "wave-checkout-session.py",
      code: `import httpx
from devcom_wave import WaveClient

wave = WaveClient(api_key="wave_ci_secret_live_...")

async def create_wave_session(amount: int, client_ref: str):
    session = await wave.create_checkout_session(
        amount_xof=amount,
        client_reference=client_ref,
        success_url="https://devcom.africa/escrow/success",
        error_url="https://devcom.africa/escrow/cancel"
    )
    # Renvoie l'URL de deep-link (wave://) et le QR Code SVG scannable
    return session.launch_url, session.qr_code_svg`,
      simulation: `[WAVE CLIENT] Appel API vers https://api.wave.com/v1/checkout...
[SESSION] Session active générée : id=sess_ci_99482019
[DEEP LINK] wave://checkout/sess_ci_99482019 généré pour mobile.
[QR CODE] SVG vectoriel disponible pour affichage comptoir ou web.
[STATUS] 200 OK — En attente du scan par l'application Wave de l'utilisateur.`
    },
    ussd: {
      title: "ussd-menu-router.ts",
      code: `import { USSDSession, USSDResponse } from '@devcom/ussd-core';

export function routeUSSD(session: USSDSession): USSDResponse {
  const { text, phoneNumber } = session;

  if (!text) {
    // Menu initial
    return USSDResponse.con(
      "DevCom Africa\\n1. Mes Bounties\\n2. Mon Solde DevPoints\\n3. Code SOS Bug"
    );
  }

  if (text === '1') {
    return USSDResponse.con("Bounties Récentes :\\n1. SDK MoMo (150k)\\n2. Sync PWA (200k)");
  }

  if (text === '2') {
    return USSDResponse.end("Votre solde est de 1,450 DP (72,500 FCFA).");
  }

  return USSDResponse.end("Merci d'utiliser le réseau DevCom Africa (*345#).");
}`,
      simulation: `[TELCO GATEWAY] Connexion socket télécom MTN / Moov active (*345#).
[SESSION] Nouveau canal USSD alloué pour MSISDN: +229 95 11 22 33
[CON] Envoi du premier écran texte (encodage GSM 7-bit, < 140 cars).
[INPUT] Touche pressée : '2' (Mon Solde DevPoints).
[END] Réponse 'Votre solde est de 1,450 DP'. Canal libéré proprement.`
    },
    offline: {
      title: "offline-crdt-sync.js",
      code: `import { AfriSyncEngine } from '@devcom/offline-crdt-sync';

// Initialise un stockage local chiffré IndexedDB résilient aux coupures
const sync = new AfriSyncEngine({
  dbName: 'devcom_cache',
  conflictResolution: 'last-write-wins-crdt'
});

window.addEventListener('online', async () => {
  console.log("Réseau 3G/4G rétabli. Synchronisation de la file d'attente...");
  const queue = await sync.getPendingQueue();
  await sync.flushToRemote('https://api.devcom.africa/sync', queue);
});`,
      simulation: `[OFFLINE ENGINE] Détection d'instabilité réseau (connexion intermittente).
[QUEUE] 4 transactions locales enregistrées dans IndexedDB local.
[EVENT] Événement 'online' reçu du navigateur.
[CRDT] Résolution des conflits temporels sans perte de données.
[SYNC] 4/4 requêtes synchronisées avec l'API centrale en arrière-plan.`
    }
  },

  // Données Composants
  components: [
    {
      id: "comp-1",
      title: "@devcom/orange-money-webpay",
      category: "fintech",
      lang: "TypeScript",
      country: "🇸🇳 Sénégal",
      author: "Amina Diallo",
      upvotes: 188,
      installCmd: "npm i @devcom/orange-money-webpay",
      desc: "SDK complet pour l'API WebPay et Max It d'Orange Money. Gestion native des callbacks IPN, tokens temporaires et validation d'intégrité.",
      code: `import { OrangeMoneyClient } from '@devcom/orange-money-webpay';

const om = new OrangeMoneyClient({
  clientId: process.env.OM_CLIENT_ID!,
  clientSecret: process.env.OM_SECRET!,
  merchantKey: process.env.OM_MERCHANT_KEY!,
  currency: 'XOF'
});

export async function initiatePayment(orderId: string, amount: number) {
  return await om.createPaymentSession({
    orderId,
    amount,
    returnUrl: 'https://monapp.com/order/confirm',
    cancelUrl: 'https://monapp.com/order/cancel'
  });
}`,
      simulation: `[ORANGE MONEY] Initialisation de session WebPay...
[AUTH] OAuth2 Bearer token obtenu auprès de la passerelle Orange SN.
[SESSION] Création de commande ID #OM-SN-882910 réussie.
[URL] Redirection client générée vers https://api.orange.sn/webpay/pay?token=...
[STATUS] 200 OK — Session prête.`
    },
    {
      id: "comp-2",
      title: "@devcom/momo-disbursement",
      category: "fintech",
      lang: "TypeScript",
      country: "🇧🇯 Bénin",
      author: "Modeste YABLA",
      upvotes: 215,
      installCmd: "npm i @devcom/momo-disbursement",
      desc: "Passerelle unifiée MTN Mobile Money et Moov Money pour l'Afrique de l'Ouest. Signature HMAC timing-safe et retry exponentiel automatique.",
      code: `import { MoMoDisbursement } from '@devcom/momo-disbursement';

const client = new MoMoDisbursement({
  subscriptionKey: process.env.MOMO_KEY!,
  apiUser: process.env.MOMO_USER!,
  apiKey: process.env.MOMO_SECRET!,
  environment: 'production'
});

export async function payDeveloperBounty(phone: string, amountCfa: number) {
  return await client.transfer({
    amount: amountCfa,
    currency: 'XOF',
    recipientPhone: phone,
    note: 'Paiement de mission DevCom Africa'
  });
}`,
      simulation: `[MOMO DISBURSEMENT] Connexion aux passerelles MTN MoMo & Moov Bénin...
[DISBURSE] Virement B2C de 150 000 XOF vers +229 97 00 00 00...
[CONFIRMATION] Reçu du réseau télécom : Ref #BJ-MOMO-772910-OK.
[STATUS] Transfert exécuté avec succès. Fonds reçus instantanément.`
    },
    {
      id: "comp-3",
      title: "devcom-wave-checkout",
      category: "fintech",
      lang: "Python",
      country: "🇨🇮 Côte d'Ivoire",
      author: "Emmanuel Kouassi",
      upvotes: 164,
      installCmd: "pip install devcom-wave",
      desc: "Client Python asynchrone pour les encaissements instantanés Wave. Génération de QR codes SVG hors-ligne et gestion des webhooks signés.",
      code: `from devcom_wave import WaveCheckoutSession

wave = WaveCheckoutSession(api_key="wave_ci_live_...")

def create_checkout(order_id: str, amount_xof: int):
    return wave.create_session(
        amount=amount_xof,
        currency="XOF",
        success_url=f"https://monapp.ci/checkout/{order_id}/success"
    )`,
      simulation: `[WAVE CI] Session créée pour 25 000 XOF.
[DEEP LINK] wave://checkout/sess_ci_4482910 actif.
[QR CODE] QR code haute résolution généré. Prêt pour affichage web.`
    },
    {
      id: "comp-4",
      title: "devcom-ussd-core",
      category: "telecom",
      lang: "Node.js / TS",
      country: "🇳🇬 Nigeria",
      author: "Chukwudi Okafor",
      upvotes: 142,
      installCmd: "npm i devcom-ussd-core",
      desc: "Moteur de création d'arborescences USSD multi-opérateurs (*345#) avec gestion de session en mémoire ou Redis et support des téléphones basiques.",
      code: `import { USSDMenuRouter } from 'devcom-ussd-core';

const router = new USSDMenuRouter();

router.start((session) => {
  return session.con("Bienvenue sur DevCom Africa\\n1. Catalogue\\n2. Bounties\\n3. Aide");
});

router.on('1', (session) => {
  return session.end("Consultez https://devcom.africa pour le catalogue complet !");
});`,
      simulation: `[USSD ROUTER] Session démarrée sur canal télécom GSM.
[STATE] Réponse 'CON' transmise au terminal (session active).
[EVENT] Saisie utilisateur traitée : '1'.
[RESULT] Réponse 'END' envoyée. Session fermée proprement.`
    },
    {
      id: "comp-5",
      title: "@devcom/offline-crdt-sync",
      category: "offline",
      lang: "JavaScript",
      country: "🇷🇼 Rwanda",
      author: "Grace Uwase",
      upvotes: 119,
      installCmd: "npm i @devcom/offline-crdt-sync",
      desc: "Bibliothèque de synchronisation offline-first basée sur les CRDTs pour bases de données locales IndexedDB, sans conflits lors des reconnexions.",
      code: `import { CRDTSyncManager } from '@devcom/offline-crdt-sync';

const syncManager = new CRDTSyncManager({
  storageKey: 'offline_tasks',
  endpoint: 'https://api.devcom.africa/v1/sync'
});

await syncManager.saveRecord({ id: 'item-1', data: 'Contenu modifié hors-ligne' });`,
      simulation: `[CRDT SYNC] Donnée écrite en local avec vecteur d'horloge logique.
[OFFLINE] Connexion perdue : sauvegarde sécurisée dans IndexedDB.
[ONLINE] Connexion rétablie : réconciliation automatique sans écrasement.`
    },
    {
      id: "comp-6",
      title: "@devcom/webhook-hmac-guard",
      category: "security",
      lang: "TypeScript",
      country: "🇧🇯 Bénin",
      author: "Modeste YABLA",
      upvotes: 177,
      installCmd: "npm i @devcom/webhook-hmac-guard",
      desc: "Middleware de validation de signatures HMAC timing-safe pour tous les webhooks télécoms et fintechs d'Afrique (MTN, Wave, Orange, Hub2).",
      code: `import { createHmacGuard } from '@devcom/webhook-hmac-guard';

export const guard = createHmacGuard({
  algorithm: 'sha256',
  secret: process.env.WEBHOOK_SECRET!,
  headerName: 'x-signature-token'
});`,
      simulation: `[SECURITY GUARD] Requête webhook reçue.
[VERIFY] Calcul du hash HMAC-SHA256 sur le payload brut.
[COMPARE] Comparaison en temps constant (timing-safe).
[AUTH] Signature validée avec succès. Attaque par temporisation évitée.`
    }
  ],

  // Données Bounties (montants de base en FCFA)
  bounties: [
    {
      id: "bounty-1",
      amountCfa: 250000,
      title: "Intégration Passerelle Wave + MTN MoMo pour Pharmacie en Ligne",
      company: "PharmaTech Cotonou & Abidjan",
      difficulty: "Intermédiaire",
      deadline: "28 nov. 2026",
      applicants: 4,
      desc: "Développement d'un connecteur unifié dans une application NestJS pour accepter Wave CI et MTN MoMo Bénin avec gestion automatisée des reçus par SMS."
    },
    {
      id: "bounty-2",
      amountCfa: 180000,
      title: "Arborescence USSD pour Consultation des Prix Agricoles du Marché",
      company: "AgriConnect Bénin",
      difficulty: "Tous niveaux",
      deadline: "15 déc. 2026",
      applicants: 7,
      desc: "Mise en place d'un menu USSD (*345*10#) permettant aux maraîchers de consulter les cours des denrées vivrières à Parakou et Malanville."
    },
    {
      id: "bounty-3",
      amountCfa: 350000,
      title: "Moteur de Cache Offline & Sync Bidirectionnelle pour Cliniques Rurales",
      company: "AfriHealth Solutions",
      difficulty: "Expert",
      deadline: "5 déc. 2026",
      applicants: 3,
      desc: "Conception d'un module Flutter / SQLite capable d'enregistrer des consultations médicales sans réseau et de synchroniser les dossiers dès le retour de la 3G."
    },
    {
      id: "bounty-4",
      amountCfa: 400000,
      title: "Audit de Sécurité & Détection de Fraude sur API Microfinance",
      company: "KrediFintech Dakar",
      difficulty: "Expert",
      deadline: "20 déc. 2026",
      applicants: 2,
      desc: "Audit approfondi des flux de décaissement Mobile Money, protection contre les attaques de replay et tests de pénétration sur API FastAPI."
    }
  ],

  // Données Troc Technique (Peer Barter)
  peers: [
    {
      id: "peer-1",
      name: "Modeste YABLA",
      initials: "MY",
      location: "Cotonou 🇧🇯",
      give: "Architecture Django, Webhooks MoMo & Sécurité API",
      want: "Débogage et build release Flutter iOS",
      status: "Disponible ce week-end"
    },
    {
      id: "peer-2",
      name: "Amina Diallo",
      initials: "AD",
      location: "Dakar 🇸🇳",
      give: "Développement Mobile Flutter & intégrations Wave SN",
      want: "Optimisation de requêtes PostgreSQL volumineuses",
      status: "Réponse sous 2h"
    },
    {
      id: "peer-3",
      name: "Emmanuel Kouassi",
      initials: "EK",
      location: "Abidjan 🇨🇮",
      give: "Conteneurisation Docker, CI/CD GitHub Actions & VPS",
      want: "Revue de code UI React avec Tailwind / CSS propre",
      status: "Ouvert aux sessions pair-programming"
    },
    {
      id: "peer-4",
      name: "Chukwudi Okafor",
      initials: "CO",
      location: "Lagos 🇳🇬",
      give: "Passerelles USSD télécoms & solutions SMS OTP",
      want: "Support sur conformité RGPD / lois de protection UEMOA",
      status: "Actif ce soir"
    }
  ],

  // Données Projets Open-Source
  projects: [
    {
      id: "proj-1",
      name: "afri-geo-address",
      badge: "Bon premier ticket",
      stars: 142,
      contributors: 11,
      desc: "Bibliothèque de normalisation et géocodage des repères informels pour les livraisons en Afrique de l'Ouest (ex: 'À 50m de la pharmacie du carrefour').",
      tags: ["TypeScript", "Geolocation", "Node.js", "OpenStreetMap"],
      lookingFor: "Maintainer · Testeur CI"
    },
    {
      id: "proj-2",
      name: "open-ussd-simulator",
      badge: "Tous niveaux",
      stars: 189,
      contributors: 16,
      desc: "Simulateur visuel interactif de combiné téléphonique dans le navigateur pour tester des parcours USSD complexes sans payer de sessions télécoms.",
      tags: ["JavaScript", "HTML5", "Telecom", "Emulateur"],
      lookingFor: "Contributeur UI · Rédacteur Docs"
    },
    {
      id: "proj-3",
      name: "wa-invoice-bot",
      badge: "Projet Actif",
      stars: 96,
      contributors: 8,
      desc: "Générateur automatique de factures PDF et reçus de paiement envoyé via l'API WhatsApp Cloud pour les commerçants du secteur informel.",
      tags: ["Python", "FastAPI", "PDFKit", "WhatsApp API"],
      lookingFor: "Dev Python · Intégrateur MoMo"
    }
  ],

  // Annuaire des Talents
  talents: [
    {
      id: "talent-1",
      name: "Modeste YABLA",
      initials: "MY",
      headline: "Fullstack Architect & MoMo Specialist",
      location: "Cotonou 🇧🇯",
      points: "1,450 DP",
      skills: ["TypeScript", "Python", "Mobile Money", "Docker"],
      proofOfWork: "Auteur de 3 SDKs vérifiés"
    },
    {
      id: "talent-2",
      name: "Amina Diallo",
      initials: "AD",
      headline: "Senior Mobile Engineer",
      location: "Dakar 🇸🇳",
      points: "1,280 DP",
      skills: ["Flutter", "Dart", "Wave SDK", "IndexedDB"],
      proofOfWork: "14 PRs publiques mergées"
    },
    {
      id: "talent-3",
      name: "Emmanuel Kouassi",
      initials: "EK",
      headline: "Backend & Cloud Engineer",
      location: "Abidjan 🇨🇮",
      points: "1,120 DP",
      skills: ["FastAPI", "PostgreSQL", "CI/CD", "AWS"],
      proofOfWork: "Contributeur Core AfriSync"
    },
    {
      id: "talent-4",
      name: "Chukwudi Okafor",
      initials: "CO",
      headline: "Telecom & USSD Infrastructure Dev",
      location: "Lagos 🇳🇬",
      points: "1,620 DP",
      skills: ["Go", "Node.js", "USSD Protocols", "Redis"],
      proofOfWork: "Passerelle USSD 100k users"
    }
  ]
};

// ==========================================================================
// 2. INITIALISATION AU CHARGEMENT DU DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initDataSaver();
  initCurrency();
  initPersonaSwitcher();
  initHeroTerminal();
  renderComponents();
  renderBounties();
  renderPeers();
  renderProjects();
  renderTalents();
  setupEventListeners();
});

// ==========================================================================
// 3. THÈME SOMBRE / CLAIR
// ==========================================================================
function initTheme() {
  document.documentElement.setAttribute('data-theme', appState.theme);
  updateThemeIcon();

  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', appState.theme);
      localStorage.setItem('devcom_theme', appState.theme);
      updateThemeIcon();
      showToast(appState.theme === 'dark' ? "Mode Sombre activé 🌙" : "Mode Clair activé ☀️");
    });
  }
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = appState.theme === 'dark' ? "🌙" : "☀️";
  }
}

// ==========================================================================
// 4. MODE ÉCONOMIE DE DONNÉES (DATA-SAVER)
// ==========================================================================
function initDataSaver() {
  if (appState.dataSaver) {
    document.body.classList.add('data-saver-active');
  }
  updateDataSaverUI();

  const toggleBtn = document.getElementById("data-saver-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      appState.dataSaver = !appState.dataSaver;
      localStorage.setItem('devcom_datasaver', appState.dataSaver);
      if (appState.dataSaver) {
        document.body.classList.add('data-saver-active');
        showToast("⚡ Mode Économie Data activé (chargement ultra-rapide) !");
      } else {
        document.body.classList.remove('data-saver-active');
        showToast("Mode standard restauré.");
      }
      updateDataSaverUI();
    });
  }
}

function updateDataSaverUI() {
  const statusLabel = document.getElementById("data-saver-status");
  const toggleBtn = document.getElementById("data-saver-toggle");
  if (statusLabel) {
    statusLabel.textContent = appState.dataSaver ? "ON" : "OFF";
  }
  if (toggleBtn) {
    if (appState.dataSaver) {
      toggleBtn.classList.add('active');
    } else {
      toggleBtn.classList.remove('active');
    }
  }
}

// ==========================================================================
// 5. CONVERTISSEUR MULTI-DEVISES
// ==========================================================================
function initCurrency() {
  const currencyBtn = document.getElementById("currency-toggle-btn");
  if (currencyBtn) {
    currencyBtn.addEventListener("click", () => {
      const currencies = ['FCFA', 'NGN', 'KES', 'USD'];
      const currentIndex = currencies.indexOf(appState.currency);
      appState.currency = currencies[(currentIndex + 1) % currencies.length];
      
      const label = document.getElementById("current-currency-label");
      if (label) label.textContent = appState.currency;

      renderBounties();
      updateHeroMetrics();
      showToast(`Devise d'affichage : ${appState.currency}`);
    });
  }
}

function formatAmount(amountCfa) {
  const info = appState.currencyRates[appState.currency];
  const converted = Math.round(amountCfa * info.rate);
  const formattedNumber = converted.toLocaleString('fr-FR');
  return info.suffix ? `${formattedNumber} ${info.symbol}` : `${info.symbol}${formattedNumber}`;
}

function updateHeroMetrics() {
  const metricEl = document.getElementById("hero-bounties-amount");
  if (metricEl) {
    metricEl.textContent = formatAmount(28400000);
  }
}

// ==========================================================================
// 6. PERSONA SWITCHER (MODE DÉMO)
// ==========================================================================
function initPersonaSwitcher() {
  const select = document.getElementById("persona-select");
  const badge = document.getElementById("persona-welcome-badge");

  if (select) {
    select.addEventListener("change", (e) => {
      appState.persona = e.target.value;
      if (appState.persona === 'visitor') {
        if (badge) badge.textContent = "Découvrez l'écosystème open-source africain";
        showToast("Vue Visiteur : découvrez librement les ressources et briques tech.");
      } else if (appState.persona === 'developer') {
        if (badge) badge.textContent = "Bienvenue Modeste YABLA (Solde : 1,450 DevPoints)";
        showToast("Vue Développeur Membre : vos accès aux trocs et aux bounties sont actifs.");
      } else if (appState.persona === 'founder') {
        if (badge) badge.textContent = "Espace Porteur de Projet : 1.2M FCFA en séquestre";
        showToast("Vue Startup : déposez un nouveau bounty ou recrutez un contributeur.");
      } else if (appState.persona === 'maintainer') {
        if (badge) badge.textContent = "Mainteneur : 4 tickets en attente de revue";
        showToast("Vue Mainteneur : gérez les PRs et demandes de contributeurs.");
      }
    });
  }
}

// ==========================================================================
// 7. HERO LIVE CODE TERMINAL
// ==========================================================================
function initHeroTerminal() {
  const tabs = document.querySelectorAll("#hero-terminal-tabs .terminal-tab-btn");
  const codeEl = document.getElementById("hero-terminal-code");
  const runBtn = document.getElementById("btn-run-hero-demo");

  let currentTab = "momo";

  function setHeroTab(tabKey) {
    currentTab = tabKey;
    tabs.forEach(t => t.classList.toggle("active", t.dataset.tab === tabKey));
    if (codeEl && appState.heroDemos[tabKey]) {
      codeEl.textContent = appState.heroDemos[tabKey].code;
    }
  }

  tabs.forEach(btn => {
    btn.addEventListener("click", () => setHeroTab(btn.dataset.tab));
  });

  // Premier chargement
  setHeroTab("momo");

  if (runBtn) {
    runBtn.addEventListener("click", () => {
      const demo = appState.heroDemos[currentTab];
      if (!demo) return;

      openSandboxModal({
        title: demo.title,
        lang: "TypeScript / Python",
        code: demo.code,
        simulation: demo.simulation
      });
    });
  }
}

// ==========================================================================
// 8. RENDU DES COMPOSANTS & APIS
// ==========================================================================
function renderComponents() {
  const container = document.getElementById("components-grid-container");
  if (!container) return;

  const filtered = appState.components.filter(c => {
    const matchCategory = appState.activeCategory === 'all' || c.category === appState.activeCategory;
    const query = appState.searchQuery.toLowerCase();
    const matchSearch = !query || 
      c.title.toLowerCase().includes(query) || 
      c.desc.toLowerCase().includes(query) ||
      c.lang.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-dim);">
        <p style="font-size: 16px;">Aucun module trouvé pour « ${escapeHtml(appState.searchQuery)} » dans cette catégorie.</p>
        <button class="btn btn-outline btn-sm btn-pill" style="margin-top: 12px;" onclick="resetComponentFilters()">Réinitialiser les filtres</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(comp => `
    <article class="component-card">
      <div class="card-top-header">
        <div>
          <h3 class="comp-pkg-title">${escapeHtml(comp.title)}</h3>
          <div class="comp-author-meta">
            <span>Par <strong>${escapeHtml(comp.author)}</strong></span>
            <span>•</span>
            <span>${escapeHtml(comp.country)}</span>
          </div>
        </div>
        <button class="upvote-badge-btn" onclick="handleUpvote('${comp.id}')" title="Voter pour ce composant">
          <span>▲</span>
          <span id="upvotes-${comp.id}">${comp.upvotes}</span>
        </button>
      </div>

      <p class="comp-description">${escapeHtml(comp.desc)}</p>

      <div class="comp-install-box">
        <code>${escapeHtml(comp.installCmd)}</code>
        <button class="copy-mini-btn" onclick="copyText('${escapeHtml(comp.installCmd)}')">Copier</button>
      </div>

      <div class="comp-footer-actions">
        <span class="lang-tech-badge">${escapeHtml(comp.lang)}</span>
        <button class="btn btn-primary btn-sm btn-pill" onclick="triggerSandboxById('${comp.id}')">
          🧪 Tester dans le Sandbox
        </button>
      </div>
    </article>
  `).join("");
}

window.resetComponentFilters = function() {
  appState.activeCategory = 'all';
  appState.searchQuery = '';
  const searchInput = document.getElementById("comp-search-input");
  if (searchInput) searchInput.value = '';
  document.querySelectorAll("#comp-category-filters .filter-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.filter === 'all');
  });
  renderComponents();
};

window.handleUpvote = function(id) {
  const comp = appState.components.find(c => c.id === id);
  if (!comp) return;
  comp.upvotes += 1;
  const countEl = document.getElementById(`upvotes-${id}`);
  if (countEl) countEl.textContent = comp.upvotes;
  showToast(`+1 vote enregistré pour ${comp.title} !`);
};

window.copyText = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Commande copiée dans le presse-papier !");
  });
};

// ==========================================================================
// 9. RENDU DES BOUNTIES (MISSIONS RÉMUNÉRÉES)
// ==========================================================================
function renderBounties() {
  const container = document.getElementById("bounties-grid-container");
  if (!container) return;

  container.innerHTML = appState.bounties.map(b => `
    <article class="bounty-card">
      <div class="bounty-reward-row">
        <span class="bounty-amount">${formatAmount(b.amountCfa)}</span>
        <span class="escrow-verified-pill">🛡️ Séquestre Garanti</span>
      </div>

      <h3 class="bounty-title">${escapeHtml(b.title)}</h3>
      <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">${escapeHtml(b.desc)}</p>

      <div class="bounty-specs-row">
        <span>Niveau : <strong>${escapeHtml(b.difficulty)}</strong></span>
        <span>•</span>
        <span>Échéance : ${escapeHtml(b.deadline)}</span>
        <span>•</span>
        <span>${b.applicants} candidats</span>
      </div>

      <div class="bounty-footer">
        <span style="font-size: 12px; color: var(--text-dim);">${escapeHtml(b.company)}</span>
        <button class="btn btn-solar btn-sm btn-pill" onclick="applyToBounty('${b.id}')">
          Postuler au Bounty ↗
        </button>
      </div>
    </article>
  `).join("");
}

window.applyToBounty = function(id) {
  const bounty = appState.bounties.find(b => b.id === id);
  if (!bounty) return;

  const contact = prompt(`Postuler à la mission :\n"${bounty.title}"\nMontant : ${formatAmount(bounty.amountCfa)}\n\nEntrez votre email ou profil GitHub :`);
  if (contact) {
    bounty.applicants += 1;
    renderBounties();
    showToast("Candidature transmise au porteur du projet avec succès !");
  }
};

// ==========================================================================
// 10. RENDU DU TROC TECHNIQUE ENTRE PAIRS
// ==========================================================================
function renderPeers() {
  const container = document.getElementById("peer-grid-container");
  if (!container) return;

  container.innerHTML = appState.peers.map(p => `
    <article class="peer-card">
      <div class="peer-header">
        <div class="peer-avatar">${p.initials}</div>
        <div class="peer-user-info">
          <h4>${escapeHtml(p.name)}</h4>
          <span class="peer-location">${escapeHtml(p.location)} • <span style="color: var(--accent-mint); font-weight: 500;">${escapeHtml(p.status)}</span></span>
        </div>
      </div>

      <div class="peer-exchange-box">
        <div class="exchange-give">
          <span>🤝</span>
          <span><strong>J'offre :</strong> ${escapeHtml(p.give)}</span>
        </div>
        <div class="exchange-want">
          <span>🎯</span>
          <span><strong>Je cherche :</strong> ${escapeHtml(p.want)}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; padding-top: 6px;">
        <button class="btn btn-outline btn-sm btn-pill" onclick="openChatWith('${p.name}')">
          Proposer un Échange 💬
        </button>
      </div>
    </article>
  `).join("");
}

// ==========================================================================
// 11. RENDU DES PROJETS OPEN-SOURCE
// ==========================================================================
function renderProjects() {
  const container = document.getElementById("projects-grid-container");
  if (!container) return;

  container.innerHTML = appState.projects.map(proj => `
    <article class="project-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="project-badge-tag">${escapeHtml(proj.badge)}</span>
        <span style="font-size: 12px; color: var(--text-dim); font-weight: 600;">★ ${proj.stars} stars</span>
      </div>

      <h3 class="project-card-title">${escapeHtml(proj.name)}</h3>
      <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">${escapeHtml(proj.desc)}</p>

      <div class="project-tags-list">
        ${proj.tags.map(t => `<span class="project-mini-tag">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 12px;">
        <span style="color: var(--accent-solar); font-weight: 600;">Recherche : ${escapeHtml(proj.lookingFor)}</span>
        <button class="btn btn-outline btn-sm btn-pill" onclick="openProjectModal('${proj.name}')">
          Contribuer ↗
        </button>
      </div>
    </article>
  `).join("");
}

window.openProjectModal = function(name) {
  showToast(`Dépôt open-source « ${name} » : PRs publiques ouvertes aux contributeurs !`);
};

// ==========================================================================
// 12. RENDU DE L'ANNUAIRE DES TALENTS
// ==========================================================================
function renderTalents() {
  const container = document.getElementById("devs-grid-container");
  if (!container) return;

  container.innerHTML = appState.talents.map(t => `
    <article class="dev-profile-card">
      <div class="dev-avatar-wrap">
        <div class="dev-large-avatar">${t.initials}</div>
        <span class="online-status-dot" title="En ligne"></span>
      </div>

      <div>
        <h3 class="dev-name">${escapeHtml(t.name)}</h3>
        <span class="dev-headline">${escapeHtml(t.headline)}</span>
        <div style="font-size: 12px; color: var(--text-dim); margin-top: 3px;">${escapeHtml(t.location)}</div>
      </div>

      <span class="dev-points-badge">${t.points} • ${escapeHtml(t.proofOfWork)}</span>

      <div class="dev-skills-row">
        ${t.skills.map(s => `<span class="lang-tech-badge" style="font-size: 11px;">${escapeHtml(s)}</span>`).join("")}
      </div>

      <button class="btn btn-primary btn-sm btn-pill" style="width: 100%; margin-top: 4px;" onclick="openChatWith('${t.name}')">
        Contacter en Direct 💬
      </button>
    </article>
  `).join("");
}

// ==========================================================================
// 13. BAC À SABLE (SANDBOX MODAL)
// ==========================================================================
window.triggerSandboxById = function(id) {
  const comp = appState.components.find(c => c.id === id);
  if (!comp) return;

  openSandboxModal({
    title: comp.title,
    lang: comp.lang,
    code: comp.code,
    simulation: comp.simulation
  });
};

function openSandboxModal(data) {
  const modal = document.getElementById("sandbox-modal");
  const title = document.getElementById("sandbox-modal-pkg-title");
  const lang = document.getElementById("sandbox-modal-lang");
  const codeBody = document.getElementById("sandbox-modal-code-body");
  const logs = document.getElementById("sandbox-modal-console-logs");
  const runBtn = document.getElementById("btn-run-sandbox-modal");
  const copyBtn = document.getElementById("btn-copy-sandbox-code");

  if (!modal) return;

  if (title) title.textContent = data.title;
  if (lang) lang.textContent = data.lang;
  if (codeBody) codeBody.textContent = data.code;
  if (logs) logs.textContent = "Cliquez sur « Exécuter dans la Console » pour déclencher l'appel et observer la réponse...";

  if (runBtn) {
    runBtn.onclick = () => {
      logs.textContent = "Exécution en cours...\n";
      setTimeout(() => {
        logs.textContent = data.simulation || "[EXEC] Exécution réussie sans erreurs.";
        showToast("Simulation exécutée avec succès !");
      }, 400);
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => {
      copyText(data.code);
    };
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
}

function closeSandboxModal() {
  const modal = document.getElementById("sandbox-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// ==========================================================================
// 14. MODAL CRÉER UN ÉCHANGE (MULTI-TYPES)
// ==========================================================================
window.openCreateModal = function(type = 'component') {
  appState.modalType = type;
  const modal = document.getElementById("create-modal");
  const tabs = document.querySelectorAll("#create-modal .modal-tab-item");
  const extraLabel = document.getElementById("label-create-extra");
  const extraInput = document.getElementById("create-extra");

  if (!modal) return;

  tabs.forEach(t => {
    t.classList.toggle("active", t.dataset.type === type);
  });

  if (type === 'component') {
    if (extraLabel) extraLabel.textContent = "Langage / Stack";
    if (extraInput) extraInput.placeholder = "TypeScript, Python, Go...";
  } else if (type === 'bounty') {
    if (extraLabel) extraLabel.textContent = "Récompense estimée (FCFA)";
    if (extraInput) extraInput.placeholder = "200000";
  } else if (type === 'help') {
    if (extraLabel) extraLabel.textContent = "Ce que vous offrez en échange";
    if (extraInput) extraInput.placeholder = "Architecture Docker contre aide Flutter...";
  } else if (type === 'project') {
    if (extraLabel) extraLabel.textContent = "Rôle ou profil recherché";
    if (extraInput) extraInput.placeholder = "Maintainer, Testeur...";
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
};

function closeCreateModal() {
  const modal = document.getElementById("create-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }
}

// ==========================================================================
// 15. MESSAGERIE DIRECTE (CHAT DRAWER)
// ==========================================================================
window.openChatWith = function(name) {
  appState.activeChatContact = name;
  const drawer = document.getElementById("chat-drawer");
  const recipient = document.getElementById("chat-recipient-indicator");

  if (recipient) {
    recipient.textContent = `● Discussion avec ${name}`;
  }

  if (drawer) {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
  }
};

function closeChatDrawer() {
  const drawer = document.getElementById("chat-drawer");
  if (drawer) {
    drawer.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
  }
}

// ==========================================================================
// 16. EVENT LISTENERS
// ==========================================================================
function setupEventListeners() {
  // Filtres de catégories de composants
  const categoryButtons = document.querySelectorAll("#comp-category-filters .filter-pill");
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      appState.activeCategory = btn.dataset.filter;
      renderComponents();
    });
  });

  // Recherche temps réel composants
  const searchInput = document.getElementById("comp-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value.trim();
      renderComponents();
    });
  }

  // Fermetures Modales
  const closeSandboxBtn = document.getElementById("close-sandbox-modal-btn");
  if (closeSandboxBtn) closeSandboxBtn.addEventListener("click", closeSandboxModal);

  const closeCreateBtn = document.getElementById("close-create-modal-btn");
  if (closeCreateBtn) closeCreateBtn.addEventListener("click", closeCreateModal);

  const cancelCreateBtn = document.getElementById("btn-cancel-create-modal");
  if (cancelCreateBtn) cancelCreateBtn.addEventListener("click", closeCreateModal);

  const closeChatBtn = document.getElementById("close-chat-drawer-btn");
  if (closeChatBtn) closeChatBtn.addEventListener("click", closeChatDrawer);

  const openChatBtn = document.getElementById("btn-open-chat");
  if (openChatBtn) {
    openChatBtn.addEventListener("click", () => openChatWith(appState.activeChatContact));
  }

  // Onglets dans la modale de création
  const modalTypeTabs = document.querySelectorAll("#create-modal .modal-tab-item");
  modalTypeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      openCreateModal(tab.dataset.type);
    });
  });

  // Soumission Formulaire Création
  const createForm = document.getElementById("create-modal-form");
  if (createForm) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("create-title").value.trim();
      const cat = document.getElementById("create-category").value;
      const extra = document.getElementById("create-extra").value.trim();
      const desc = document.getElementById("create-desc").value.trim();
      const codeOrContent = document.getElementById("create-code").value.trim();

      if (appState.modalType === 'component') {
        appState.components.unshift({
          id: "comp-" + Date.now(),
          title: title,
          category: cat,
          lang: extra || "TypeScript",
          country: "🇧🇯 Bénin",
          author: "Modeste YABLA",
          upvotes: 1,
          installCmd: `npm i ${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          desc: desc,
          code: codeOrContent,
          simulation: `[DEVCOM] Module « ${title} » exécuté avec succès.`
        });
        renderComponents();
        showToast("Composant publié sur le catalogue avec succès !");
      } else if (appState.modalType === 'bounty') {
        const amount = parseInt(extra) || 200000;
        appState.bounties.unshift({
          id: "bounty-" + Date.now(),
          amountCfa: amount,
          title: title,
          company: "Modeste YABLA (Startup)",
          difficulty: "Intermédiaire",
          deadline: "31 déc. 2026",
          applicants: 0,
          desc: desc
        });
        renderBounties();
        showToast("Bounty déposé et séquestre ouvert !");
      } else if (appState.modalType === 'help') {
        appState.peers.unshift({
          id: "peer-" + Date.now(),
          name: "Modeste YABLA",
          initials: "MY",
          location: "Cotonou 🇧🇯",
          give: extra,
          want: desc,
          status: "Publié à l'instant"
        });
        renderPeers();
        showToast("Demande de troc technique publiée dans le flux !");
      } else if (appState.modalType === 'project') {
        appState.projects.unshift({
          id: "proj-" + Date.now(),
          name: title,
          badge: "Nouveau Projet",
          stars: 1,
          contributors: 1,
          desc: desc,
          tags: [extra || "Open Source"],
          lookingFor: "Contributeurs"
        });
        renderProjects();
        showToast("Projet open-source ajouté avec succès !");
      }

      createForm.reset();
      closeCreateModal();
    });
  }

  // Soumission Formulaire Chat
  const chatForm = document.getElementById("chat-message-form");
  const chatInput = document.getElementById("chat-user-input");
  const chatFlow = document.getElementById("chat-messages-flow");

  if (chatForm && chatInput && chatFlow) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const userMsg = document.createElement("div");
      userMsg.className = "chat-bubble chat-bubble-out";
      userMsg.innerHTML = `${escapeHtml(text)}<span style="display: block; font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">À l'instant</span>`;
      chatFlow.appendChild(userMsg);
      chatInput.value = "";
      chatFlow.scrollTop = chatFlow.scrollHeight;

      // Réponse automatique de démonstration
      setTimeout(() => {
        const replyMsg = document.createElement("div");
        replyMsg.className = "chat-bubble chat-bubble-in";
        replyMsg.innerHTML = `<strong>${escapeHtml(appState.activeChatContact)} :</strong><br>Super, bien reçu ! Je regarde ton extrait de code et je te réponds avec les ajustements nécessaires.<span style="display: block; font-size: 10px; color: var(--text-dim); margin-top: 4px;">À l'instant</span>`;
        chatFlow.appendChild(replyMsg);
        chatFlow.scrollTop = chatFlow.scrollHeight;
      }, 1200);
    });
  }

  // Sélecteur de contacts dans le drawer
  const contactButtons = document.querySelectorAll("[data-chat-contact]");
  contactButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      contactButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      openChatWith(btn.dataset.chatContact);
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("main-nav-links");
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "68px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "var(--bg-surface)";
      navLinks.style.padding = "20px";
      navLinks.style.borderBottom = "1px solid var(--border-subtle)";
      navLinks.style.zIndex = "40";
    });
  }
}

// ==========================================================================
// 17. UTILITAIRES : TOASTS & SANITIZATION
// ==========================================================================
function showToast(message) {
  const shelf = document.getElementById("toast-shelf");
  if (!shelf) return;

  const toast = document.createElement("div");
  toast.className = "toast-item";
  toast.innerHTML = `<span>⚡</span><span>${escapeHtml(message)}</span>`;
  shelf.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(16px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
