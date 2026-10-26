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
function getInitialTheme() {
  try {
    const saved = localStorage.getItem('devcom_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch (e) {}
  const domTheme = document.documentElement.getAttribute('data-theme');
  if (domTheme === 'dark' || domTheme === 'light') return domTheme;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

const appState = {
  theme: getInitialTheme(),
  dataSaver: localStorage.getItem('devcom_datasaver') === 'true',
  persona: 'developer',
  currency: 'FCFA', // 'FCFA', 'NGN', 'KES', 'USD'
  activeCategory: 'all',
  searchQuery: '',
  modalType: 'component',
  activeChatContact: 'Amina Diallo',
  votedComponents: new Set(), // Protection anti double-vote
  unreadCount: 2, // Compteur messages non lus

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
      country: "Sénégal",
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
      country: "Bénin",
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
      country: "Côte d'Ivoire",
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
      country: "Nigeria",
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
      country: "Rwanda",
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
      country: "Bénin",
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
    },
    {
      id: "comp-7",
      title: "devcom-moov-flooz-pay",
      category: "fintech",
      lang: "Python / FastAPI",
      country: "Togo & Bénin",
      author: "Modeste YABLA",
      upvotes: 134,
      installCmd: "pip install devcom-moov-flooz",
      desc: "Connecteur unifié pour l'API Moov Money Flooz (Push USSD, consultation solde marchand et validation OTP sécurisée).",
      code: `from devcom_flooz import FloozClient

flooz = FloozClient(
    merchant_id="FLOOZ_BJ_8820",
    api_key="secret_live_flooz_..."
)

async def trigger_flooz_push(phone: str, amount: int):
    return await flooz.push_payment(
        msisdn=phone,
        amount=amount,
        reference="CMD-99482"
    )`,
      simulation: `[FLOOZ GATEWAY] Connexion au serveur Moov Money Afrique de l'Ouest...
[PUSH USSD] Invite de confirmation transmise au client (+228 90 00 00 00).
[STATUS] Code PIN validé par l'abonné sur son terminal mobile.
[CONFIRMATION] Débit effectué avec succès (Réf: FLOOZ-BJ-99482). 200 OK.`
    },
    {
      id: "comp-8",
      title: "@devcom/sms-hub-africa",
      category: "telecom",
      lang: "TypeScript",
      country: "Kenya & Panafricain",
      author: "Grace Uwase",
      upvotes: 153,
      installCmd: "npm i @devcom/sms-hub-africa",
      desc: "Routeur de SMS transactionnels multi-opérateurs avec bascule automatique (Safaricom, MTN, Airtel) et délivrabilité garantie > 99%.",
      code: `import { AfricaSMSHub } from '@devcom/sms-hub-africa';

const sms = new AfricaSMSHub({
  providers: ['safaricom', 'mtn', 'airtel'],
  priorityFallback: true
});

export async function sendOtpCode(to: string, code: string) {
  return await sms.sendTransactional({
    recipient: to,
    message: \`Votre code de vérification DevCom est : \${code}. Valable 5 min.\`,
    senderId: 'DEVCOM'
  });
}`,
      simulation: `[SMS ROUTER] Sélection du canal télécom optimal pour +254 712 345 678...
[ROUTE] Opérateur primaire Safaricom alloué (latence 180ms).
[DISPATCH] SMS envoyé avec SenderID 'DEVCOM'.
[DELIVERY REPORT] Reçu de remise opérateur reçu (DLR: DELIVERED).`
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
      title: "Arborescence USSD pour Consultation des Cours Agricoles",
      company: "AgriConnect Bénin & Niger",
      difficulty: "Tous niveaux",
      deadline: "15 déc. 2026",
      applicants: 7,
      desc: "Mise en place d'un menu USSD (*345*10#) permettant aux maraîchers de consulter les cours des denrées vivrières à Parakou et Malanville."
    },
    {
      id: "bounty-3",
      amountCfa: 350000,
      title: "Moteur de Cache Offline & Sync Bidirectionnelle pour Cliniques Rurales",
      company: "AfriHealth Solutions Kigali & Dakar",
      difficulty: "Expert",
      deadline: "5 déc. 2026",
      applicants: 3,
      desc: "Conception d'un module Flutter / SQLite capable d'enregistrer des consultations médicales sans réseau et de synchroniser les dossiers dès le retour de la 3G."
    },
    {
      id: "bounty-4",
      amountCfa: 400000,
      title: "Audit de Sécurité & Détection de Fraude sur API Microfinance",
      company: "KrediFintech Dakar & Douala",
      difficulty: "Expert",
      deadline: "20 déc. 2026",
      applicants: 2,
      desc: "Audit approfondi des flux de décaissement Mobile Money, protection contre les attaques de replay et tests de pénétration sur API FastAPI."
    },
    {
      id: "bounty-5",
      amountCfa: 320000,
      title: "Passerelle Télémétrie Solaire LoRaWAN vers API Rust & TimescaleDB",
      company: "SunAfrica Energy Nairobi & Cotonou",
      difficulty: "Expert",
      deadline: "18 déc. 2026",
      applicants: 3,
      desc: "Création d'un collecteur asynchrone pour 5 000 kits solaires ruraux avec gestion des paquets binaires compacts et alertes de coupure par webhook."
    },
    {
      id: "bounty-6",
      amountCfa: 220000,
      title: "Module de Géocodage Repères Informels pour Livreurs à Moto",
      company: "ZemExpress Lomé & Cotonou",
      difficulty: "Intermédiaire",
      deadline: "10 déc. 2026",
      applicants: 5,
      desc: "Algorithme de calcul d'itinéraire basé sur les carrefours populaires et pharmacies plutôt que les numéros de rue souvent absents dans les quartiers."
    }
  ],

  // Données Troc Technique (Peer Barter)
  peers: [
    {
      id: "peer-1",
      name: "Modeste YABLA",
      initials: "MY",
      location: "Cotonou, Bénin",
      give: "Architecture Django, Webhooks MoMo & Sécurité API",
      want: "Débogage et build release Flutter iOS",
      status: "Disponible ce week-end"
    },
    {
      id: "peer-2",
      name: "Amina Diallo",
      initials: "AD",
      location: "Dakar, Sénégal",
      give: "Développement Mobile Flutter & intégrations Wave SN",
      want: "Optimisation de requêtes SQL PostgreSQL volumineuses",
      status: "Réponse sous 2h"
    },
    {
      id: "peer-3",
      name: "Emmanuel Kouassi",
      initials: "EK",
      location: "Abidjan, Côte d'Ivoire",
      give: "Conteneurisation Docker, CI/CD GitHub Actions & VPS",
      want: "Revue de code UI React avec Tailwind / CSS propre",
      status: "Ouvert aux sessions pair-programming"
    },
    {
      id: "peer-4",
      name: "Chukwudi Okafor",
      initials: "CO",
      location: "Lagos, Nigeria",
      give: "Passerelles USSD télécoms & solutions SMS OTP",
      want: "Support sur conformité RGPD / lois de protection UEMOA",
      status: "Actif ce soir"
    },
    {
      id: "peer-5",
      name: "Grace Uwase",
      initials: "GU",
      location: "Kigali, Rwanda",
      give: "Bases locales SQLite, CRDTs & Progressive Web Apps",
      want: "Intégration passerelle M-Pesa Daraja & tests de charge",
      status: "Disponible en soirée"
    },
    {
      id: "peer-6",
      name: "Jean-Luc Mbia",
      initials: "JM",
      location: "Douala, Cameroun",
      give: "Microservices Go & gRPC haute disponibilité",
      want: "Conception Design System Figma vers Vanilla CSS moderne",
      status: "En ligne maintenant"
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
    },
    {
      id: "proj-4",
      name: "afri-clinic-offline",
      badge: "Impact Santé",
      stars: 128,
      contributors: 9,
      desc: "Dossier patient électronique fonctionnant 100% hors-ligne pour les centres de santé ruraux, avec synchronisation CRDT automatique lors de la reconnexion.",
      tags: ["Flutter", "SQLite", "Offline-First", "CRDT"],
      lookingFor: "Dev Mobile · UX Designer"
    },
    {
      id: "proj-5",
      name: "momo-mock-server",
      badge: "Populaire",
      stars: 215,
      contributors: 14,
      desc: "Émulateur local sans clé API des passerelles MTN MoMo, Wave et Orange Money pour exécuter tests d'intégration et CI/CD sans dépenser d'argent.",
      tags: ["TypeScript", "Express", "Docker", "Testing"],
      lookingFor: "Testeur QA · Dev Go"
    }
  ],

  // Annuaire des Talents
  talents: [
    {
      id: "talent-1",
      name: "Modeste YABLA",
      initials: "MY",
      headline: "Fullstack Architect & MoMo Specialist",
      location: "Cotonou, Bénin 🇧🇯",
      points: "1,450 DP",
      skills: ["TypeScript", "Python", "Mobile Money", "Docker"],
      proofOfWork: "Auteur de 3 SDKs vérifiés"
    },
    {
      id: "talent-2",
      name: "Amina Diallo",
      initials: "AD",
      headline: "Senior Mobile Engineer",
      location: "Dakar, Sénégal 🇸🇳",
      points: "1,280 DP",
      skills: ["Flutter", "Dart", "Wave SDK", "IndexedDB"],
      proofOfWork: "14 PRs publiques mergées"
    },
    {
      id: "talent-3",
      name: "Emmanuel Kouassi",
      initials: "EK",
      headline: "Backend & Cloud Engineer",
      location: "Abidjan, Côte d'Ivoire 🇨🇮",
      points: "1,120 DP",
      skills: ["FastAPI", "PostgreSQL", "CI/CD", "AWS"],
      proofOfWork: "Contributeur Core AfriSync"
    },
    {
      id: "talent-4",
      name: "Chukwudi Okafor",
      initials: "CO",
      headline: "Telecom & USSD Infrastructure Dev",
      location: "Lagos, Nigeria 🇳🇬",
      points: "1,620 DP",
      skills: ["Go", "Node.js", "USSD Protocols", "Redis"],
      proofOfWork: "Passerelle USSD 100k users"
    },
    {
      id: "talent-5",
      name: "Grace Uwase",
      initials: "GU",
      headline: "Offline-First & CRDT Specialist",
      location: "Kigali, Rwanda 🇷🇼",
      points: "1,340 DP",
      skills: ["TypeScript", "CRDTs", "SQLite", "PWA"],
      proofOfWork: "Auteure de 2 modules IndexedDB"
    },
    {
      id: "talent-6",
      name: "Jean-Luc Mbia",
      initials: "JM",
      headline: "Distributed Systems & Go Engineer",
      location: "Douala, Cameroun 🇨🇲",
      points: "1,190 DP",
      skills: ["Go", "gRPC", "Kubernetes", "Kafka"],
      proofOfWork: "Maintainer momo-mock-server"
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
  initNetworkTicker();
  updateUnreadBadge();
});

// ==========================================================================
// 3. THÈME SOMBRE / CLAIR
// ==========================================================================
function initTheme() {
  applyTheme(appState.theme);

  const themeToggle = document.getElementById("theme-toggle-btn");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
      showToast(nextTheme === 'dark' ? "Mode Sombre activé" : "Mode Clair activé");
    });
  }

  // Écoute du changement de préférence système (si l'utilisateur n'a pas fixé de choix manuel)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem('devcom_theme')) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      } catch (err) {}
    });
  }
}

function applyTheme(theme, save = false) {
  appState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-theme', theme);
  if (save) {
    try {
      localStorage.setItem('devcom_theme', theme);
    } catch (e) {}
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById("theme-icon");
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (icon) {
    if (appState.theme === 'dark') {
      // Icône Soleil vectorielle pour passer en clair
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else {
      // Icône Lune vectorielle pour passer en sombre
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }
  if (toggleBtn) {
    toggleBtn.setAttribute("title", appState.theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre");
    toggleBtn.setAttribute("aria-label", appState.theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre");
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
        showToast("Mode Économie Data activé (chargement ultra-rapide) !");
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
  updateHeroMetrics();
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

// ==========================================================================
// 5B. TICKER RÉSEAU (Rotation automatique des messages)
// ==========================================================================
function initNetworkTicker() {
  const ticker = document.getElementById('network-ticker');
  if (!ticker) return;

  const messages = [
    '24 pays connectés • 2,450+ devs actifs',
    '6 bounties actifs • 1.4M FCFA en séquestre',
    '120+ composants open-source vérifiés',
    'Dernier commit il y a 3 min par Amina Diallo',
    '42 trocs techniques en cours ce mois',
    'Nouveau projet : afri-geo-address v2.0 publié'
  ];
  let idx = 0;

  setInterval(() => {
    ticker.style.opacity = '0';
    ticker.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      idx = (idx + 1) % messages.length;
      ticker.textContent = messages[idx];
      ticker.style.opacity = '1';
    }, 320);
  }, 4000);
}

function updateHeroMetrics() {
  const metricEl = document.getElementById("hero-bounties-amount");
  if (metricEl) {
    metricEl.textContent = formatAmount(28400000);
  }
  const bentoEl = document.getElementById("bento-bounties-amount");
  if (bentoEl) {
    bentoEl.textContent = formatAmount(520000);
  }
}

// ==========================================================================
// 6. PERSONA SWITCHER (MODE DÉMO)
// ==========================================================================
// 6. PERSONA SWITCHER (MODE DÉMO DYNAMIQUE AVEC ADAPTATION COMPLÈTE)
// ==========================================================================
const personaConfigs = {
  visitor: {
    kickerTag: "DÉCOUVERTE • TOUT PUBLIC",
    welcomeBadge: "Découvrez librement l'écosystème open-source africain",
    headline: `Explorez le potentiel du <br><span class="hero-headline-highlight">logiciel &amp; web africain</span>`,
    subtitle: "Accédez sans inscription aux composants open-source, passerelles Mobile Money documentées et briques mutualisées conçues par les développeurs du continent.",
    primaryBtn: {
      text: "REJOINDRE LE RÉSEAU",
      href: "#about",
      action: () => {
        showToast("💡 Choisissez un profil (Développeur, Startup ou Mainteneur) pour simuler vos accès membres !");
      }
    },
    secondaryBtn: {
      text: "EXPLORER LE CATALOGUE",
      href: "#composants"
    },
    navCtaText: "REJOINDRE LE RÉSEAU",
    navCtaAction: () => {
      showToast("👋 Bienvenue ! Vous êtes actuellement en Vue Visiteur. Sélectionnez un rôle en haut pour simuler une publication.");
    },
    toastMsg: "👀 Vue Visiteur activée : exploration libre de la vitrine et des documentations.",
    targetSectionId: "about"
  },

  developer: {
    kickerTag: "ESPACE DÉVELOPPEUR • MEMBRE ACTIF",
    welcomeBadge: "Modeste YABLA (Solde : 1,450 DevPoints • 210,000 FCFA)",
    headline: `Gagnez des bounties et <br><span class="hero-headline-highlight">boostez vos projets africains</span>`,
    subtitle: "Décrochez des missions rémunérées sous séquestre Mobile Money, troquez votre expertise avec des pairs de 24 pays et intégrez les modules certifiés.",
    primaryBtn: {
      text: "CHASSER UN BOUNTY",
      href: "#bounties",
      action: null
    },
    secondaryBtn: {
      text: "PROPOSER UN TROC",
      href: "#entraide"
    },
    navCtaText: "+ PUBLIER UN ÉCHANGE",
    navCtaAction: () => {
      openCreateModal('component');
    },
    toastMsg: "🚀 Vue Développeur Membre : accès complet aux bounties, trocs techniques et bacs à sable.",
    targetSectionId: "bounties"
  },

  founder: {
    kickerTag: "ESPACE STARTUP &amp; PORTEUR DE PROJET",
    welcomeBadge: "Porteur de Projet • 1,200,000 FCFA disponibles sous séquestre",
    headline: `Financez vos modules &amp; <br><span class="hero-headline-highlight">recrutez l'élite tech d'Afrique</span>`,
    subtitle: "Déposez vos besoins en développement sous séquestre garanti, accélérez la livraison de vos briques critiques et recrutez des ingénieurs seniors vérifiés.",
    primaryBtn: {
      text: "DÉPOSER UN BOUNTY (ESCROW)",
      href: "#bounties",
      action: () => {
        openCreateModal('bounty');
      }
    },
    secondaryBtn: {
      text: "EXPLORER LES TALENTS",
      href: "#talents"
    },
    navCtaText: "+ DÉPOSER UN BOUNTY",
    navCtaAction: () => {
      openCreateModal('bounty');
    },
    toastMsg: "💼 Vue Startup : publiez un bounty sous séquestre et explorez les profils seniors.",
    targetSectionId: "talents"
  },

  maintainer: {
    kickerTag: "CONSOLE MAINTENEUR • TECH LEAD",
    welcomeBadge: "Mainteneur : 4 PRs &amp; 12 issues en attente de revue",
    headline: `Pilotez vos dépôts et <br><span class="hero-headline-highlight">fédérez des contributeurs qualifiés</span>`,
    subtitle: "Organisez vos feuilles de route open-source, validez les revues de code, sécurisez vos composants et encouragez les meilleures contributions.",
    primaryBtn: {
      text: "AJOUTER UN PROJET OS",
      href: "#projets",
      action: () => {
        openCreateModal('project');
      }
    },
    secondaryBtn: {
      text: "VOIR LES PROJETS ACTIFS",
      href: "#projets"
    },
    navCtaText: "+ AJOUTER UN PROJET",
    navCtaAction: () => {
      openCreateModal('project');
    },
    toastMsg: "🛠️ Vue Mainteneur Open Source : gestion des dépôts, des tickets et des revues de code.",
    targetSectionId: "projets"
  }
};

window.handleNavCtaClick = function() {
  const cfg = personaConfigs[appState.persona] || personaConfigs.developer;
  if (cfg && cfg.navCtaAction) {
    cfg.navCtaAction();
  } else {
    openCreateModal('component');
  }
};

function applyPersona(personaKey, shouldScroll = false) {
  const cfg = personaConfigs[personaKey];
  if (!cfg) return;

  appState.persona = personaKey;

  // 1. Kicker tag & Welcome Badge
  const kickerTagEl = document.getElementById("hero-kicker-tag");
  if (kickerTagEl) kickerTagEl.innerHTML = cfg.kickerTag;

  const badgeEl = document.getElementById("persona-welcome-badge");
  if (badgeEl) badgeEl.innerHTML = cfg.welcomeBadge;

  // 2. Headline & Subtitle
  const titleEl = document.getElementById("hero-main-title");
  if (titleEl) titleEl.innerHTML = cfg.headline;

  const descEl = document.getElementById("hero-main-desc");
  if (descEl) descEl.textContent = cfg.subtitle;

  // 3. Boutons d'action Hero
  const primaryBtn = document.getElementById("hero-btn-primary");
  const primaryText = document.getElementById("hero-btn-primary-text");
  if (primaryBtn) {
    primaryBtn.setAttribute("href", cfg.primaryBtn.href);
    if (primaryText) primaryText.textContent = cfg.primaryBtn.text;
    primaryBtn.onclick = (e) => {
      if (cfg.primaryBtn.action) {
        e.preventDefault();
        cfg.primaryBtn.action();
      }
    };
  }

  const secondaryBtn = document.getElementById("hero-btn-secondary");
  if (secondaryBtn) {
    secondaryBtn.setAttribute("href", cfg.secondaryBtn.href);
    secondaryBtn.textContent = cfg.secondaryBtn.text;
  }

  // 4. Bouton CTA Navbar
  const navCtaText = document.getElementById("nav-persona-cta-text");
  if (navCtaText) navCtaText.textContent = cfg.navCtaText;

  // 5. Toast d'information
  showToast(cfg.toastMsg);

  // 6. Mise en avant douce de la section cible
  if (shouldScroll && cfg.targetSectionId) {
    const targetSection = document.getElementById(cfg.targetSectionId);
    if (targetSection) {
      targetSection.classList.remove("persona-highlight-active");
      void targetSection.offsetWidth; // Déclenche le reflow pour relancer l'animation
      targetSection.classList.add("persona-highlight-active");
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function initPersonaSwitcher() {
  const select = document.getElementById("persona-select");
  if (select) {
    select.value = appState.persona;
    select.addEventListener("change", (e) => {
      applyPersona(e.target.value, true);
    });
  }
  applyPersona(appState.persona, false);
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Tester dans le Sandbox</span>
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
  // Anti double-vote : on utilise l'ID de session (pas de compte réel)
  if (appState.votedComponents.has(id)) {
    showToast('Vous avez déjà voté pour ce composant.');
    return;
  }
  const comp = appState.components.find(c => c.id === id);
  if (!comp) return;
  appState.votedComponents.add(id);
  comp.upvotes += 1;
  const countEl = document.getElementById(`upvotes-${id}`);
  if (countEl) {
    countEl.textContent = comp.upvotes;
    // Animation visuelle du bouton
    const btn = countEl.closest('.upvote-badge-btn');
    if (btn) {
      btn.style.color = 'var(--accent-solar)';
      btn.style.borderColor = 'var(--accent-solar)';
      btn.style.background = 'var(--accent-solar-subtle)';
      btn.disabled = true;
      btn.title = 'Déjà voté';
    }
  }
  showToast(`+1 vote enregistré pour ${comp.title} !`);
};

window.copyText = function(text) {
  // Fallback pour HTTP ou navigateurs anciens
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Commande copiée dans le presse-papier !');
    }).catch(() => {
      _fallbackCopy(text);
    });
  } else {
    _fallbackCopy(text);
  }
};

function _fallbackCopy(text) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Commande copiée !');
  } catch (e) {
    showToast('Impossible de copier automatiquement. Copiez manuellement.');
  }
}

// ==========================================================================
// 9. RENDU DES BOUNTIES (MISSIONS RÉMUNÉRÉES)
// ==========================================================================
function renderBounties() {
  const container = document.getElementById("bounties-grid-container");
  if (!container) return;

  container.innerHTML = appState.bounties.map(b => {
    let diffClass = "diff-yellow";
    if (b.difficulty === "Tous niveaux" || b.difficulty === "Débutant") diffClass = "diff-green";
    else if (b.difficulty === "Expert") diffClass = "diff-red";

    const btnText = b._applied ? '✓ Candidature envoyée' : 'Postuler au Bounty';
    const btnDisabled = b._applied ? 'disabled style="opacity:0.7;cursor:default"' : '';

    return `
    <article class="bounty-card">
      <div class="bounty-reward-row">
        <span class="bounty-amount">${formatAmount(b.amountCfa)}</span>
        <span class="escrow-verified-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Séquestre Garanti</span>
        </span>
      </div>

      <h3 class="bounty-title">${escapeHtml(b.title)}</h3>
      <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.55;">${escapeHtml(b.desc)}</p>

      <div class="bounty-specs-row">
        <span><span class="diff-tag ${diffClass}">${escapeHtml(b.difficulty)}</span></span>
        <span>•</span>
        <span>Échéance : <strong>${escapeHtml(b.deadline)}</strong></span>
        <span>•</span>
        <span id="bounty-count-${b.id}">${b.applicants} candidats</span>
      </div>

      <div class="bounty-footer">
        <span style="font-size: 12px; color: var(--text-dim);">${escapeHtml(b.company)}</span>
        <button id="bounty-btn-${b.id}" class="btn btn-solar btn-sm btn-pill" onclick="applyToBounty('${b.id}')" ${btnDisabled}>
          <span>${btnText}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </button>
      </div>
    </article>
  `;
  }).join("");
}

window.applyToBounty = function(id) {
  const bounty = appState.bounties.find(b => b.id === id);
  if (!bounty) return;

  // Anti double-candidature
  if (bounty._applied) {
    showToast('Vous avez déjà postulé à ce bounty.');
    return;
  }
  bounty._applied = true;
  bounty.applicants += 1;

  // Mise à jour ciblée sans recréer tout le DOM
  const countEl = document.getElementById(`bounty-count-${id}`);
  if (countEl) countEl.textContent = `${bounty.applicants} candidats`;
  const btn = document.getElementById(`bounty-btn-${id}`);
  if (btn) {
    btn.textContent = '✓ Candidature envoyée';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'default';
  }

  const applicantName = appState.persona === 'developer' ? 'Modeste YABLA' : 'votre profil';
  showToast(`🛡️ Candidature enregistrée pour ${applicantName} ! Séquestre de ${formatAmount(bounty.amountCfa)} garanti.`);
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
          <span class="exchange-icon-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <span><strong>J'offre :</strong> ${escapeHtml(p.give)}</span>
        </div>
        <div class="exchange-want">
          <span class="exchange-icon-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </span>
          <span><strong>Je cherche :</strong> ${escapeHtml(p.want)}</span>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; padding-top: 6px;">
        <button class="btn btn-outline btn-sm btn-pill" onclick="openChatWith('${p.name}')">
          <span>Proposer un Échange</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
        <span style="font-size: 12px; color: var(--text-dim); font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${proj.stars} stars
        </span>
      </div>

      <h3 class="project-card-title">${escapeHtml(proj.name)}</h3>
      <p style="font-size: 13.5px; color: var(--text-muted); line-height: 1.5;">${escapeHtml(proj.desc)}</p>

      <div class="project-tags-list">
        ${proj.tags.map(t => `<span class="project-mini-tag">${escapeHtml(t)}</span>`).join("")}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 12px;">
        <span style="color: var(--accent-solar); font-weight: 600;">Recherche : ${escapeHtml(proj.lookingFor)}</span>
        <button class="btn btn-outline btn-sm btn-pill" onclick="openProjectModal('${proj.name}')">
          <span>Contribuer</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
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
        <span>Contacter en Direct</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
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
      if (!logs) return;
      logs.textContent = '';
      runBtn.disabled = true;
      runBtn.style.opacity = '0.6';

      const simText = data.simulation || "[EXEC] Exécution réussie sans erreurs.";
      const lines = simText.split('\n');
      let lineIdx = 0;

      function typeNextLine() {
        if (lineIdx >= lines.length) {
          runBtn.disabled = false;
          runBtn.style.opacity = '1';
          showToast('Simulation exécutée avec succès !');
          return;
        }
        logs.textContent += (lineIdx > 0 ? '\n' : '') + lines[lineIdx];
        logs.scrollTop = logs.scrollHeight;
        lineIdx++;
        setTimeout(typeNextLine, 160 + Math.random() * 80);
      }

      setTimeout(typeNextLine, 200);
    };
  }

  if (copyBtn) {
    copyBtn.onclick = () => copyText(data.code);
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  // Focus sur le bouton Fermer pour l'accessibilité
  setTimeout(() => {
    const closeBtn = document.getElementById('close-sandbox-modal-btn');
    if (closeBtn) closeBtn.focus();
  }, 80);
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
appState.chatThreads = {
  "Amina Diallo": [
    { sender: "Amina Diallo", text: "Salut ! J'ai vu ton profil sur DevCom Africa. Tu as pu tester l'intégration avec le webhook Wave CI ?", time: "Aujourd'hui à 14:20" }
  ],
  "Modeste YABLA": [
    { sender: "Modeste YABLA", text: "Hello ! Si tu as besoin d'un coup de main sur l'architecture Django ou les signatures HMAC MTN MoMo, fais-moi signe !", time: "Hier à 18:45" }
  ],
  "Emmanuel Kouassi": [
    { sender: "Emmanuel Kouassi", text: "Salut camarade ! Je finalise le conteneur Docker pour le gateway MoMo. Tu as une dispo ce soir pour du pair-programming ?", time: "11:15" }
  ],
  "Chukwudi Okafor": [
    { sender: "Chukwudi Okafor", text: "Hello! We are testing the USSD menu router for Nigeria telecom networks. Let me know if you want to collaborate on the SMS gateway fallback.", time: "Hier à 16:30" }
  ],
  "Grace Uwase": [
    { sender: "Grace Uwase", text: "Muraho ! Je teste les conflits CRDT en mode offline sur IndexedDB. On peut s'échanger nos retours d'expérience sur la synchronisation ?", time: "10:05" }
  ],
  "Jean-Luc Mbia": [
    { sender: "Jean-Luc Mbia", text: "Salut ! Je prépare le microservice gRPC pour les paiements en zone CEMAC. Intéressé par un échange technique ?", time: "09:30" }
  ]
};

window.openChatWith = function(name) {
  appState.activeChatContact = name || 'Amina Diallo';
  const drawer = document.getElementById("chat-drawer");
  const recipient = document.getElementById("chat-recipient-indicator");
  const nameEl = document.getElementById("chat-contact-name");
  const avatarEl = document.getElementById("chat-contact-avatar");

  if (recipient) {
    recipient.textContent = `● Discussion avec ${appState.activeChatContact} • En ligne`;
  }
  if (nameEl) {
    nameEl.textContent = appState.activeChatContact;
  }
  if (avatarEl) {
    const initials = appState.activeChatContact.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    avatarEl.textContent = initials;
  }

  // Initialise le fil de discussion s'il n'existe pas encore
  if (!appState.chatThreads[appState.activeChatContact]) {
    appState.chatThreads[appState.activeChatContact] = [
      {
        sender: appState.activeChatContact,
        text: `Salut ! Ravi d'échanger avec toi sur DevCom Africa. Sur quoi travailles-tu en ce moment ?`,
        time: "À l'instant"
      }
    ];
  }

  renderChatMessages();

  // Réinitialise le compteur non-lus à l'ouverture du chat
  appState.unreadCount = 0;
  updateUnreadBadge();

  if (drawer) {
    drawer.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    // Focus sur l'input pour UX mobile
    setTimeout(() => {
      const input = document.getElementById('chat-input-field');
      if (input) input.focus();
    }, 100);
  }
};

function updateUnreadBadge() {
  const badge = document.getElementById('unread-count');
  if (!badge) return;
  if (appState.unreadCount > 0) {
    badge.textContent = appState.unreadCount;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderChatMessages() {
  const chatFlow = document.getElementById("chat-messages-container") || document.getElementById("chat-messages-flow");
  if (!chatFlow) return;

  const thread = appState.chatThreads[appState.activeChatContact] || [];
  chatFlow.innerHTML = thread.map(msg => {
    const isMe = msg.sender === 'me';
    return `
      <div class="chat-bubble ${isMe ? 'chat-bubble-out' : 'chat-bubble-in'}">
        ${!isMe ? `<strong>${escapeHtml(msg.sender)} :</strong><br>` : ''}
        ${escapeHtml(msg.text)}
        <span style="display: block; font-size: 10px; color: ${isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)'}; margin-top: 4px;">${escapeHtml(msg.time)}</span>
      </div>
    `;
  }).join("");

  chatFlow.scrollTop = chatFlow.scrollHeight;
}

window.quickSendChat = function(text) {
  const chatInput = document.getElementById("chat-input-field") || document.getElementById("chat-user-input");
  if (chatInput) {
    chatInput.value = text;
    window.sendChatMessage();
  }
};

window.sendChatMessage = function() {
  const chatInput = document.getElementById("chat-input-field") || document.getElementById("chat-user-input");
  if (!chatInput) return;

  const text = chatInput.value.trim();
  if (!text) return;

  if (!appState.chatThreads[appState.activeChatContact]) {
    appState.chatThreads[appState.activeChatContact] = [];
  }

  appState.chatThreads[appState.activeChatContact].push({
    sender: 'me',
    text: text,
    time: "À l'instant"
  });

  chatInput.value = "";
  renderChatMessages();

  // Indicateur de frappe
  const chatFlow = document.getElementById('chat-messages-container');
  if (chatFlow) {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-bubble chat-bubble-in chat-typing-indicator';
    typingEl.id = 'chat-typing';
    typingEl.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    chatFlow.appendChild(typingEl);
    chatFlow.scrollTop = chatFlow.scrollHeight;
  }

  // Réponses automatiques contextualisées
  const delay = 700 + Math.random() * 600;
  setTimeout(() => {
    // Retire l'indicateur de frappe
    const typingEl = document.getElementById('chat-typing');
    if (typingEl) typingEl.remove();

    let reply = `Super, bien reçu ! Je regarde ton message et je te réponds avec les détails techniques.`;
    const lower = text.toLowerCase();
    if (lower.includes('webhook') || lower.includes('momo')) {
      reply = `Très bien ! Pour les webhooks MoMo, vérifie bien que tu renvoies un statut HTTP 200 immédiat avant de traiter le payload en tâche de fond pour éviter les timeouts opérateurs.`;
    } else if (lower.includes('call') || lower.includes('dispo')) {
      reply = `Parfait, je suis connecté ce soir à partir de 19h GMT sur Google Meet ou Discord !`;
    } else if (lower.includes('module') || lower.includes('test')) {
      reply = `Excellent ! N'hésite pas à ouvrir une PR sur le repo si tu trouves une amélioration ou un cas d'usage limite.`;
    } else if (lower.includes('flutter') || lower.includes('mobile')) {
      reply = `Flutter est excellent pour les apps offline-first ! Utilise Hive ou Isar pour le stockage local côté Dart.`;
    } else if (lower.includes('ussd')) {
      reply = `Pour l'USSD, rappelle-toi que la session doit répondre en moins de 20 secondes sinon le réseau télécom la coupe automatiquement.`;
    }

    appState.chatThreads[appState.activeChatContact].push({
      sender: appState.activeChatContact,
      text: reply,
      time: "À l'instant"
    });
    renderChatMessages();

    // Incrémenter non-lus si le tiroir est fermé
    const drawer = document.getElementById('chat-drawer');
    if (!drawer || !drawer.classList.contains('active')) {
      appState.unreadCount++;
      updateUnreadBadge();
    }
    showToast(`💬 Nouveau message de ${appState.activeChatContact}`);
  }, delay);
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

  // Recherche temps réel composants (debounce 200ms)
  const searchInput = document.getElementById("comp-search-input");
  if (searchInput) {
    let searchDebounce;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        appState.searchQuery = e.target.value.trim();
        renderComponents();
      }, 200);
    });
    // Touche Escape pour vider la recherche
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        appState.searchQuery = '';
        renderComponents();
        searchInput.blur();
      }
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

  // Fermeture des modales en cliquant sur l'overlay (fond flouté)
  const sandboxOverlay = document.getElementById("sandbox-modal");
  if (sandboxOverlay) {
    sandboxOverlay.addEventListener("click", (e) => {
      if (e.target === sandboxOverlay) closeSandboxModal();
    });
  }
  const createOverlay = document.getElementById("create-modal");
  if (createOverlay) {
    createOverlay.addEventListener("click", (e) => {
      if (e.target === createOverlay) closeCreateModal();
    });
  }
  // Fermer le chat drawer en cliquant sur le fond
  const chatDrawerEl = document.getElementById("chat-drawer");
  if (chatDrawerEl) {
    chatDrawerEl.addEventListener("click", (e) => {
      if (e.target === chatDrawerEl) closeChatDrawer();
    });
  }

  // Touche Escape pour fermer toute modale ou tiroir ouverts
  document.addEventListener("keydown", (e) => {
    if (e.key !== 'Escape') return;
    const sandboxModal = document.getElementById("sandbox-modal");
    const createModal = document.getElementById("create-modal");
    const chatDrawer = document.getElementById("chat-drawer");
    const navLinks = document.getElementById("main-nav-links");
    if (sandboxModal && sandboxModal.classList.contains('active')) { closeSandboxModal(); return; }
    if (createModal && createModal.classList.contains('active')) { closeCreateModal(); return; }
    if (chatDrawer && chatDrawer.classList.contains('active')) { closeChatDrawer(); return; }
    if (navLinks && navLinks.classList.contains('mobile-menu-active')) {
      navLinks.classList.remove('mobile-menu-active');
      const mobileBtn = document.getElementById("mobile-menu-toggle");
      if (mobileBtn) {
        mobileBtn.setAttribute('aria-expanded', 'false');
        mobileBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
      }
    }
  });

  // Onglets dans la modale de création
  const modalTypeTabs = document.querySelectorAll("#create-modal .modal-tab-item");
  modalTypeTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      openCreateModal(tab.dataset.type);
    });
  });

  // Soumission Formulaire Création avec validation UX
  const createForm = document.getElementById("create-modal-form");
  if (createForm) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("create-title");
      const descInput = document.getElementById("create-desc");
      const title = titleInput.value.trim();
      const cat = document.getElementById("create-category").value;
      const extra = document.getElementById("create-extra").value.trim();
      const desc = descInput.value.trim();
      const codeOrContent = document.getElementById("create-code").value.trim();

      // Validation minimale avec feedback visuel
      if (!title) {
        titleInput.style.borderColor = 'var(--accent-rose)';
        titleInput.focus();
        showToast('⚠️ Le titre est obligatoire.');
        titleInput.addEventListener('input', () => { titleInput.style.borderColor = ''; }, { once: true });
        return;
      }
      if (!desc) {
        descInput.style.borderColor = 'var(--accent-rose)';
        descInput.focus();
        showToast('⚠️ La description est obligatoire.');
        descInput.addEventListener('input', () => { descInput.style.borderColor = ''; }, { once: true });
        return;
      }

      if (appState.modalType === 'component') {
        appState.components.unshift({
          id: "comp-" + Date.now(),
          title: title,
          category: cat,
          lang: extra || "TypeScript",
          country: "Bénin",
          author: "Modeste YABLA",
          upvotes: 1,
          installCmd: `npm i ${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          desc: desc,
          code: codeOrContent || `// Code du module ${title}`,
          simulation: `[DEVCOM] Module « ${title} » exécuté avec succès.`
        });
        renderComponents();
        showToast("✅ Composant publié sur le catalogue avec succès !");
      } else if (appState.modalType === 'bounty') {
        const amount = parseInt(extra) || 200000;
        if (isNaN(amount) || amount <= 0) {
          showToast('⚠️ Montant invalide. Entrez une valeur numérique en FCFA.');
          return;
        }
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
        showToast("✅ Bounty déposé et séquestre ouvert !");
      } else if (appState.modalType === 'help') {
        appState.peers.unshift({
          id: "peer-" + Date.now(),
          name: "Modeste YABLA",
          initials: "MY",
          location: "Cotonou, Bénin",
          give: extra || desc,
          want: desc,
          status: "Publié à l'instant"
        });
        renderPeers();
        showToast("✅ Demande de troc technique publiée dans le flux !");
      } else if (appState.modalType === 'project') {
        appState.projects.unshift({
          id: "proj-" + Date.now(),
          name: title,
          badge: "Nouveau Projet",
          stars: 1,
          contributors: 1,
          desc: desc,
          tags: (extra || "Open Source").split(',').map(t => t.trim()).filter(Boolean),
          lookingFor: "Contributeurs"
        });
        renderProjects();
        showToast("✅ Projet open-source ajouté avec succès !");
      }

      createForm.reset();
      closeCreateModal();
    });
  }

  // Soumission Formulaire Chat
  const chatForm = document.getElementById("chat-form") || document.getElementById("chat-message-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.sendChatMessage();
    });
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("main-nav-links");
  if (mobileMenuBtn && navLinks) {
    const hamburgerSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    const closeSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle("mobile-menu-active");
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileMenuBtn.innerHTML = isOpen ? closeSvg : hamburgerSvg;
    });

    // Fermer le menu lors du clic sur un lien
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-menu-active");
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = hamburgerSvg;
      });
    });

    // Fermer si clic à l'extérieur
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && e.target !== mobileMenuBtn) {
        navLinks.classList.remove("mobile-menu-active");
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = hamburgerSvg;
      }
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
  toast.innerHTML = `<span class="toast-icon-svg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></span><span>${escapeHtml(message)}</span>`;
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
