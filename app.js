/**
 * DevCom Africa — Logique & Interactivité (Plateforme Réelle)
 * La plateforme d'échange africaine : pour les devs, par les devs
 */

// ==========================================================================
// 1. Catalogue de Composants & APIs Africaines
// ==========================================================================
const INITIAL_COMPONENTS = [
  {
    id: "momo-pay",
    title: "@devcom/momo-pay",
    category: "mobile-money",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    verified: true,
    author: "Modeste YABLA",
    authorAvatar: "MY",
    downloads: "4.8k",
    rating: 4.9,
    upvotes: 142,
    installCmd: "npm i @devcom/momo-pay",
    desc: "SDK TypeScript & Node.js unifié pour MTN MoMo et Moov Money avec vérification de signature HMAC, déduplication des webhooks et retry automatique.",
    code: `import { MoMoClient } from '@devcom/momo-pay';

const client = new MoMoClient({
  subscriptionKey: process.env.MOMO_KEY!,
  apiUser: process.env.MOMO_USER!,
  apiKey: process.env.MOMO_SECRET!,
  environment: 'sandbox' // 'production' pour l'Afrique de l'Ouest
});

// Initialiser une demande de paiement (C2B)
export async function requestPayment(phone: string, amount: number) {
  const payment = await client.requestToPay({
    amount: amount,
    currency: 'XOF',
    payer: { partyIdType: 'MSISDN', partyId: phone },
    payerMessage: 'Abonnement DevCom Pro',
    payeeNote: 'Merci pour votre confiance'
  });
  return payment;
}`,
    simulationOutput: `[MOMO-PAY] Initialisation du client Sandbox MoMo Bénin...
[REQUEST] Appel C2B : 15 000 XOF vers +229 97 00 00 00
[DISPATCH] Notification Push USSD envoyée sur le terminal client...
[WEBHOOK] Callback reçu : TxId #BJ-88392019-OK
[STATUS]  Paiement validé avec succès (Code 200). Solde crédité.`
  },
  {
    id: "wave-checkout",
    title: "devcom-wave-sdk",
    category: "mobile-money",
    lang: "python",
    country: "CI",
    countryFlag: "🇨🇮 Côte d'Ivoire",
    verified: true,
    author: "Emmanuel Kouassi",
    authorAvatar: "EK",
    downloads: "3.2k",
    rating: 4.8,
    upvotes: 184,
    installCmd: "pip install devcom-wave",
    desc: "Client Python pour intégrer les sessions de paiement Wave instantanées avec génération de QR code scannable et deep links mobiles.",
    code: `from devcom_wave import WaveCheckoutSession

wave = WaveCheckoutSession(api_key="wave_ci_live_secret_...")

def create_order_payment(order_id: str, amount_cfa: int):
    session = wave.create_session(
        amount=amount_cfa,
        currency="XOF",
        success_url=f"https://devcom.africa/orders/{order_id}/success",
        error_url=f"https://devcom.africa/orders/{order_id}/cancel"
    )
    return {
        "checkout_url": session.wave_launch_url,
        "qr_code_svg": session.qr_code_url
    }`,
    simulationOutput: `[WAVE] Connexion aux passerelles Wave CI & SN...
[SESSION] Création de session pour 25 000 XOF...
[LINK] Deep Link généré : wave://checkout/sess_839210
[QR] QR Code scannable disponible sur CDN.
[RESULT]  Session active, prête pour redirection mobile.`
  },
  {
    id: "offline-sync-engine",
    title: "@devcom/offline-sync",
    category: "offline",
    lang: "javascript",
    country: "SN",
    countryFlag: "🇸🇳 Sénégal",
    verified: true,
    author: "Amina Diallo",
    authorAvatar: "AD",
    downloads: "2.1k",
    rating: 4.95,
    upvotes: 98,
    installCmd: "npm i @devcom/offline-sync",
    desc: "Moteur de mise en cache IndexedDB et synchronisation en tâche de fond (Background Sync) pour applications web en environnement réseau instable.",
    code: `import { AfriSyncEngine } from '@devcom/offline-sync';

const sync = new AfriSyncEngine({
  dbName: 'afri_app_cache',
  autoRetryInterval: 5000,
  syncEndpoint: '/api/v1/sync'
});

// Enregistrer une action hors-ligne
export async function submitDataOffline(data) {
  await sync.queueTask({
    action: 'CREATE_CLIENT_RECORD',
    payload: data,
    timestamp: Date.now()
  });
  console.log("Données sauvegardées localement. Synchronisation dès reconnexion.");
}`,
    simulationOutput: `[OFFLINE-SYNC] Moteur initialisé sur IndexedDB.
[NETWORK] État réseau : HORS-LIGNE (Coupure data simulée)
[CACHE] Action 'CREATE_CLIENT_RECORD' sauvegardée dans la file locale.
[NETWORK] Réseau rétabli (4G détectée) !
[SYNC] Envoi des données en arrière-plan vers le serveur...
[SUCCESS]  100% des données locales répliquées sans conflit.`
  },
  {
    id: "ussd-framework",
    title: "@devcom/ussd-engine",
    category: "ussd",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    verified: true,
    author: "Modeste YABLA",
    authorAvatar: "MY",
    downloads: "5.4k",
    rating: 5.0,
    upvotes: 210,
    installCmd: "npm i @devcom/ussd-engine",
    desc: "Framework robuste de routage de menus USSD multi-niveaux compatible avec MTN, Moov, Orange et Airtel dans toute l'Afrique de l'Ouest et Centrale.",
    code: `import { USSDRouter } from '@devcom/ussd-engine';

const router = new USSDRouter();

router.onRoot((session) => {
  return session.con("Bienvenue sur DevCom USSD\\n1. Mon Solde DevPoints\\n2. Bounties Récents\\n3. Assistance");
});

router.onOption('1', async (session) => {
  return session.end("Votre solde actuel est de : 1,250 DP.\\nDevise locale équivalente : 62,500 FCFA.");
});

router.onOption('2', async (session) => {
  return session.con("Bounties du jour :\\n1. SDK Flutter (150k)\\n2. Module SMS (80k)\\n0. Retour");
});`,
    simulationOutput: `[USSD-ROUTER] Passerelle USSD initialisée (*345#)...
[USER] Appel entrant : +229 97 12 34 56
[RESPONSE]
CON Bienvenue sur DevCom USSD
1. Mon Solde DevPoints
2. Bounties Récents
3. Assistance
[INPUT] Sélection de la touche '1'...
[RESPONSE]
END Votre solde actuel est de : 1,250 DP.
Devise locale équivalente : 62,500 FCFA.
[STATUS]  Session clôturée avec succès (Code 200).`
  },
  {
    id: "sms-otp-gateway",
    title: "devcom-sms-router",
    category: "security",
    lang: "python",
    country: "TG",
    countryFlag: "🇹🇬 Togo",
    verified: true,
    author: "Yao Mensah",
    authorAvatar: "YM",
    downloads: "1.7k",
    rating: 4.7,
    upvotes: 89,
    installCmd: "pip install devcom-sms-router",
    desc: "Routeur d'envoi de SMS transactionnels avec choix intelligent de passerelle pour minimiser les coûts SMS au Bénin, Togo, CI et Sénégal.",
    code: `from devcom_sms_router import SmartSMSBroker

broker = SmartSMSBroker()

def send_auth_code(phone: str):
    otp = broker.generate_secure_otp()
    # Route automatiquement vers le fournisseur le moins cher selon le préfixe
    status = broker.dispatch_sms(
        destination=phone,
        message=f"Votre code de sécurité DevCom est : {otp}"
    )
    return {"status": status, "otp": otp}`,
    simulationOutput: `[SMS-ROUTER] Analyse du numéro destinataire : +228 90 00 00 00 (Togo)
[ALGO] Détection de la route la plus économique...
[ROUTE] Opérateur local sélectionné (Économie : -55%).
[STATUS]  SMS expédié en 380ms. Code généré : 928301.`
  },
  {
    id: "flutter-momo-widget",
    title: "flutter_african_pay",
    category: "mobile-money",
    lang: "flutter",
    country: "NG",
    countryFlag: "🇳🇬 Nigeria",
    verified: true,
    author: "Chukwudi Okafor",
    authorAvatar: "CO",
    downloads: "4.1k",
    rating: 4.9,
    upvotes: 156,
    installCmd: "flutter pub add flutter_african_pay",
    desc: "Widget Flutter clé en main offrant une feuille de paiement élégante prenant en charge MTN MoMo, Wave, Orange Money et cartes bancaires africaines.",
    code: `import 'package:flutter_african_pay/flutter_african_pay.dart';

void showPaymentSheet(BuildContext context) {
  AfricanPaySheet.show(
    context,
    amount: 15000,
    currency: "XOF",
    allowedMethods: [PaymentMethod.mtnMoMo, PaymentMethod.wave, PaymentMethod.moovMoney],
    onSuccess: (txId) => print("Paiement réussi : $txId"),
    onError: (err) => print("Erreur : $err"),
  );
}`,
    simulationOutput: `[FLUTTER-PAY] Affichage du composant Modal Bottom Sheet...
[UI] Rendu des logos MTN MoMo, Wave et Moov Money en SVG fluide.
[USER] Choix : Wave Côte d'Ivoire / Sénégal.
[DEEP-LINK] Lancement de l'app Wave installée...
[CALLBACK] Validation de transaction #CI-994827 reçue !`
  }
];

// ==========================================================================
// 2. Bourse aux Échanges, Missions & Bounties
// ==========================================================================
const INITIAL_BOUNTIES = [
  {
    id: "bounty-1",
    reward: "150 000 FCFA",
    title: "SDK Flutter pour intégration Wave avec Deep Links & QR",
    payoutMethod: "Wave & MTN MoMo",
    desc: "Développer un package Flutter open-source permettant de déclencher des paiements Wave sans redirection web externe.",
    difficulty: "Intermédiaire",
    applicants: 4,
    deadline: "15 nov. 2026",
    company: "AfriTech Labs"
  },
  {
    id: "bounty-2",
    reward: "80 000 FCFA",
    title: "Template Dashboard PWA ultra-léger (<120 KB)",
    payoutMethod: "Moov Money",
    desc: "Concevoir un template Tailwind CSS optimisé pour une consommation data minimale sur smartphones Android d'entrée de gamme.",
    difficulty: "Débutant / Intermédiaire",
    applicants: 6,
    deadline: "10 nov. 2026",
    company: "DevCom Community"
  },
  {
    id: "bounty-3",
    reward: "250 000 FCFA",
    title: "Connecteur S3 Stockage Objet Haute Résilience",
    payoutMethod: "Virement bancaire / MoMo",
    desc: "Créer un middleware Next.js & FastAPI assurant la réplication automatique de documents et médias sur datacenters régionaux.",
    difficulty: "Avancé",
    applicants: 3,
    deadline: "20 nov. 2026",
    company: "CloudWest Africa"
  }
];

// ==========================================================================
// 3. Espace Entraide & Troc de Compétences
// ==========================================================================
const INITIAL_PEER_EXCHANGES = [
  {
    id: "peer-1",
    author: "Koffi A.",
    country: "🇧🇯 Bénin",
    tag: "Troc Technique",
    title: "Audit de sécurité backend Django contre intégration Next.js 14",
    desc: "J'offre un audit complet des failles et requêtes SQL sur votre backend Django en échange d'une aide sur les Server Components Next.js.",
    deal: "Offre : 3h d'audit Django | Demande : 3h d'accompagnement Next.js"
  },
  {
    id: "peer-2",
    author: "Amina Diallo",
    country: "🇸🇳 Sénégal",
    tag: "Entraide Flash",
    title: "Besoin d'un regard critique sur synchronisation IndexedDB offline",
    desc: "Je bloque sur la résolution de conflits de timestamps lors de la reconnexion. Récompense : 150 DevPoints + mention dans le README du package.",
    deal: "Récompense : 150 DP + Mentorat Flutter"
  },
  {
    id: "peer-3",
    author: "Grace Uwase",
    country: "🇷🇼 Rwanda",
    tag: "Revue de Code",
    title: "Revue UI/UX Tailwind CSS pour app fintech bilingue (EN/FR)",
    desc: "Je propose de restructurer le design system d'une app contre une aide pour configurer une passerelle de paiement MTN MoMo Bénin.",
    deal: "Offre : Design System complet | Demande : Passerelle MTN MoMo"
  }
];

// ==========================================================================
// 4. Annuaire des Développeurs
// ==========================================================================
const INITIAL_DEVELOPERS = [
  {
    id: "dev-modeste",
    name: "Modeste YABLA",
    avatar: "MY",
    role: "Fullstack & Cloud Architect",
    country: "🇧🇯 Cotonou, Bénin",
    skills: ["TypeScript", "Next.js", "Python", "Mobile Money"],
    dp: 1250,
    exchangesCount: 14
  },
  {
    id: "dev-amina",
    name: "Amina Diallo",
    avatar: "AD",
    role: "Mobile & Flutter Engineer",
    country: "🇸🇳 Dakar, Sénégal",
    skills: ["Flutter", "Dart", "IndexedDB", "PWA"],
    dp: 980,
    exchangesCount: 9
  },
  {
    id: "dev-emmanuel",
    name: "Emmanuel Kouassi",
    avatar: "EK",
    role: "Backend & Fintech Specialist",
    country: "🇨🇮 Abidjan, Côte d'Ivoire",
    skills: ["Python", "FastAPI", "Wave", "PostgreSQL"],
    dp: 1120,
    exchangesCount: 11
  },
  {
    id: "dev-chukwudi",
    name: "Chukwudi Okafor",
    avatar: "CO",
    role: "DevOps & Systems Engineer",
    country: "🇳🇬 Lagos, Nigeria",
    skills: ["Go", "Docker", "Kubernetes", "AWS/Cloud"],
    dp: 1450,
    exchangesCount: 18
  }
];

// ==========================================================================
// État Global de l'Application
// ==========================================================================
let appState = {
  components: [...INITIAL_COMPONENTS],
  bounties: [...INITIAL_BOUNTIES],
  peerExchanges: [...INITIAL_PEER_EXCHANGES],
  developers: [...INITIAL_DEVELOPERS],
  activeCategory: "all",
  activeLang: "all",
  activeCountry: "all",
  searchQuery: "",
  activeSandboxComponent: null,
  activeChatRecipient: "Amina Diallo",
  exchangeModalType: "component"
};

// ==========================================================================
// Initialisation au chargement du DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderComponents();
  renderBounties();
  renderPeerExchanges();
  renderDevelopers();
  initEventListeners();
});

// ==========================================================================
// Gestion du Thème Dark / Light
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem("devcom_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const toggleBtn = document.getElementById("theme-toggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const target = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", target);
      localStorage.setItem("devcom_theme", target);
      showToast(`Mode ${target === "dark" ? "Sombre" : "Clair"} activé`);
    });
  }
}

// ==========================================================================
// Rendu dynamique des Composants & APIs
// ==========================================================================
function renderComponents() {
  const container = document.getElementById("components-grid");
  if (!container) return;

  const filtered = appState.components.filter(c => {
    if (appState.activeCategory !== "all" && c.category !== appState.activeCategory) return false;
    if (appState.activeLang !== "all" && c.lang !== appState.activeLang) return false;
    if (appState.activeCountry !== "all" && c.country !== appState.activeCountry) return false;
    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      const match = c.title.toLowerCase().includes(q) || 
                    c.desc.toLowerCase().includes(q) || 
                    c.lang.toLowerCase().includes(q) ||
                    c.author.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-md);">
        <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 12px;">🔍 Aucun composant ne correspond à cette recherche.</p>
        <button class="btn btn-outline" onclick="resetFilters()">Réinitialiser les filtres</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(comp => `
    <article class="component-card" data-id="${comp.id}">
      <div>
        <div class="component-header">
          <span class="component-category-badge">${formatCategoryName(comp.category)}</span>
          <div class="component-meta-flags">
            <span>${comp.countryFlag}</span>
            <span class="verified-badge">✓ Vérifié</span>
          </div>
        </div>

        <h3 class="component-title">${escapeHtml(comp.title)}</h3>
        <p class="component-desc">${escapeHtml(comp.desc)}</p>

        <div class="install-command-box">
          <code>${escapeHtml(comp.installCmd)}</code>
          <button class="copy-install-btn" onclick="copyInstallCmd('${escapeHtml(comp.installCmd)}')" title="Copier la commande">📋</button>
        </div>
      </div>

      <div class="component-footer">
        <div class="component-author">
          <div class="avatar-circle" style="width: 24px; height: 24px; font-size: 0.75rem;">${comp.authorAvatar}</div>
          <span>${comp.author} • ⭐ ${comp.rating}</span>
        </div>

        <div class="component-actions">
          <button class="upvote-btn" onclick="handleUpvote('${comp.id}')">
            ▲ <span>${comp.upvotes}</span>
          </button>
          <button class="btn btn-xs btn-outline" onclick="openSandbox('${comp.id}')">
            🧪 Tester
          </button>
          <button class="btn btn-xs btn-primary" onclick="copyComponentCode('${comp.id}')">
            Code
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu dynamique de la Bourse aux Bounties
// ==========================================================================
function renderBounties() {
  const container = document.getElementById("bounties-grid");
  if (!container) return;

  container.innerHTML = appState.bounties.map(bounty => `
    <article class="bounty-card">
      <div class="bounty-top">
        <span class="bounty-reward">${bounty.reward}</span>
        <span class="payout-method-badge">💳 ${bounty.payoutMethod}</span>
      </div>

      <h3 class="bounty-title">${escapeHtml(bounty.title)}</h3>
      <p class="bounty-desc">${escapeHtml(bounty.desc)}</p>

      <div class="bounty-footer">
        <div class="bounty-deadline">
          <span>⏳ Limite : ${bounty.deadline}</span> • <span>👥 ${bounty.applicants} candidats</span>
        </div>
        <button class="btn btn-sm btn-amber" onclick="applyToBounty('${escapeHtml(bounty.title)}')">
          Postuler
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu dynamique de l'Entraide & Troc
// ==========================================================================
function renderPeerExchanges() {
  const container = document.getElementById("peer-exchange-grid");
  if (!container) return;

  container.innerHTML = appState.peerExchanges.map(peer => `
    <article class="peer-card">
      <div>
        <div class="peer-header">
          <span class="peer-tag">${peer.tag}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${peer.country} • ${peer.author}</span>
        </div>
        <h3 class="peer-title">${escapeHtml(peer.title)}</h3>
        <p class="peer-desc">${escapeHtml(peer.desc)}</p>
        <div class="peer-exchange-deal">
          <strong>Modalité :</strong> ${escapeHtml(peer.deal)}
        </div>
      </div>

      <div class="peer-footer">
        <button class="btn btn-sm btn-outline" onclick="contactDeveloper('${peer.author}', 'Proposition pour : ${escapeHtml(peer.title)}')">
          💬 Contacter ${peer.author.split(' ')[0]}
        </button>
        <button class="btn btn-sm btn-primary" onclick="acceptDeal('${escapeHtml(peer.title)}')">
          Proposer l'échange
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu dynamique de l'Annuaire Développeurs
// ==========================================================================
function renderDevelopers() {
  const container = document.getElementById("developers-grid");
  if (!container) return;

  container.innerHTML = appState.developers.map(dev => `
    <article class="developer-card">
      <div class="dev-avatar">${dev.avatar}</div>
      <h3 class="dev-name">${escapeHtml(dev.name)}</h3>
      <p class="dev-role">${escapeHtml(dev.role)}</p>
      <div class="dev-country">${dev.country}</div>

      <div class="dev-skills-list">
        ${dev.skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}
      </div>

      <div class="dev-card-footer">
        <span class="dev-points">⚡ ${dev.dp} DP</span>
        <button class="btn btn-xs btn-outline" onclick="contactDeveloper('${escapeHtml(dev.name)}')">
          Contacter
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Bac à Sable / Testeur de Code en Direct
// ==========================================================================
window.openSandbox = function(componentId) {
  const comp = appState.components.find(c => c.id === componentId);
  if (!comp) return;

  appState.activeSandboxComponent = comp;

  document.getElementById("sandbox-title").textContent = comp.title;
  document.getElementById("sandbox-filename").textContent = `${comp.id}.${comp.lang === 'python' ? 'py' : comp.lang === 'flutter' ? 'dart' : 'ts'}`;
  document.getElementById("sandbox-code-content").textContent = comp.code;
  
  const execOutput = document.getElementById("exec-output");
  execOutput.innerHTML = `<span class="exec-idle">Cliquez sur « ▶ Exécuter » pour simuler l'exécution du module dans un environnement d'exécution Edge...</span>`;

  const modal = document.getElementById("sandbox-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

function closeSandbox() {
  const modal = document.getElementById("sandbox-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

window.copyComponentCode = function(componentId) {
  const comp = appState.components.find(c => c.id === componentId);
  if (!comp) return;

  navigator.clipboard.writeText(comp.code).then(() => {
    showToast(`Code source de ${comp.title} copié !`);
  }).catch(() => {
    showToast(`Code sélectionné`);
  });
};

window.copyInstallCmd = function(cmd) {
  navigator.clipboard.writeText(cmd).then(() => {
    showToast(`Commande d'installation copiée : ${cmd}`);
  });
};

window.handleUpvote = function(componentId) {
  const comp = appState.components.find(c => c.id === componentId);
  if (!comp) return;

  comp.upvotes += 1;
  renderComponents();
  showToast(`+1 vote pour ${comp.title} !`);
};

// ==========================================================================
// Actions Messagerie Directe & Mise en Relation
// ==========================================================================
window.openMessagesDrawer = function(recipient = null) {
  const drawer = document.getElementById("messages-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");

  if (recipient) {
    appState.activeChatRecipient = recipient;
    // Vérifier si un pill existe ou l'ajouter
    const contactsBar = document.getElementById("chat-contacts-bar");
    let existingPill = Array.from(contactsBar.children).find(b => b.dataset.user === recipient);
    if (!existingPill) {
      const newBtn = document.createElement("button");
      newBtn.className = "contact-pill active";
      newBtn.dataset.user = recipient;
      newBtn.textContent = `👤 ${recipient}`;
      contactsBar.appendChild(newBtn);
    }
    document.querySelectorAll(".contact-pill").forEach(p => p.classList.remove("active"));
    const target = Array.from(contactsBar.children).find(b => b.dataset.user === recipient);
    if (target) target.classList.add("active");
  }

  // Réinitialiser le compteur de non-lus
  const unread = document.getElementById("unread-count");
  if (unread) unread.style.display = "none";
};

window.closeMessagesDrawer = function() {
  const drawer = document.getElementById("messages-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
};

window.contactDeveloper = function(devName, prefillMessage = "") {
  openMessagesDrawer(devName);
  if (prefillMessage) {
    const input = document.getElementById("chat-message-input");
    if (input) {
      input.value = prefillMessage;
      input.focus();
    }
  }
};

window.applyToBounty = function(title) {
  const contact = prompt(`Postuler au bounty :\n"${title}"\n\nIndiquez votre email ou identifiant GitHub :`);
  if (contact) {
    showToast(`Candidature envoyée pour "${title.slice(0, 25)}..." !`);
  }
};

window.acceptDeal = function(title) {
  showToast(`Proposition d'échange envoyée !`);
  setTimeout(() => {
    openMessagesDrawer();
  }, 400);
};

// ==========================================================================
// Modal Multi-Types : Créer un Échange
// ==========================================================================
window.openCreateExchangeModal = function(type = "component") {
  appState.exchangeModalType = type;
  const modal = document.getElementById("create-exchange-modal");
  
  // Basculer les onglets
  document.querySelectorAll(".type-tab").forEach(t => t.classList.remove("active"));
  const activeTab = document.querySelector(`.type-tab[data-type="${type}"]`);
  if (activeTab) activeTab.classList.add("active");

  updateModalFieldsForType(type);

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

window.closeCreateExchangeModal = function() {
  const modal = document.getElementById("create-exchange-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

function updateModalFieldsForType(type) {
  const heading = document.getElementById("modal-exchange-heading");
  const dynamicLabel = document.getElementById("label-dynamic-field");
  const dynamicInput = document.getElementById("exchange-secondary");
  const codeLabel = document.querySelector("#group-code-field label");
  const codeArea = document.getElementById("exchange-code");

  if (type === "component") {
    heading.textContent = "Publier un Composant ou une API";
    dynamicLabel.textContent = "Langage de programmation";
    dynamicInput.placeholder = "TypeScript, Python, Flutter, PHP...";
    codeLabel.textContent = "Code source du composant";
    codeArea.placeholder = "// Insérez votre code ici...";
  } else if (type === "bounty") {
    heading.textContent = "Lancer un Bounty ou une Mission Rémunérée";
    dynamicLabel.textContent = "Rémunération & Devise (ex: 150 000 FCFA)";
    dynamicInput.placeholder = "Montant en FCFA ou Mobile Money";
    codeLabel.textContent = "Cahier des charges & Livrables attendus";
    codeArea.placeholder = "Détaillez les critères d'acceptation du livrable...";
  } else if (type === "help") {
    heading.textContent = "Demander de l'Aide ou Proposer un Troc";
    dynamicLabel.textContent = "Ce que vous offrez en échange";
    dynamicInput.placeholder = "Ex: 2h de revue de code, 100 DevPoints, mentorat...";
    codeLabel.textContent = "Description du besoin technique ou du blocage";
    codeArea.placeholder = "Expliquez le problème technique à résoudre...";
  }
}

// ==========================================================================
// Gestionnaires d'Événements
// ==========================================================================
function initEventListeners() {
  // Recherche Omnisearch
  const searchInput = document.getElementById("omnisearch-input");
  const clearBtn = document.getElementById("search-clear");
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value.trim();
      clearBtn.style.display = appState.searchQuery ? "block" : "none";
      renderComponents();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      appState.searchQuery = "";
      clearBtn.style.display = "none";
      renderComponents();
    });
  }

  // Filtres Catégories (Chips)
  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      appState.activeCategory = chip.dataset.category;
      renderComponents();
    });
  });

  // Filtres Langages (Pills)
  document.querySelectorAll(".lang-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.activeLang = pill.dataset.lang;
      renderComponents();
    });
  });

  // Filtre Pays
  const countrySelect = document.getElementById("country-filter");
  if (countrySelect) {
    countrySelect.addEventListener("change", (e) => {
      appState.activeCountry = e.target.value;
      renderComponents();
      showToast(`Filtré sur : ${countrySelect.options[countrySelect.selectedIndex].text}`);
    });
  }

  // Boutons Header
  const btnCreateEx = document.getElementById("btn-create-exchange");
  if (btnCreateEx) btnCreateEx.addEventListener("click", () => openCreateExchangeModal('component'));

  const btnOpenMsg = document.getElementById("btn-open-messages");
  if (btnOpenMsg) btnOpenMsg.addEventListener("click", () => openMessagesDrawer());

  const btnCloseMsg = document.getElementById("close-messages-btn");
  if (btnCloseMsg) btnCloseMsg.addEventListener("click", closeMessagesDrawer);

  const btnOpenProfile = document.getElementById("btn-open-profile");
  const profileDrawer = document.getElementById("profile-drawer");
  const btnCloseProfile = document.getElementById("close-profile-btn");

  if (btnOpenProfile && profileDrawer) {
    btnOpenProfile.addEventListener("click", () => {
      profileDrawer.classList.add("open");
      profileDrawer.setAttribute("aria-hidden", "false");
    });
  }
  if (btnCloseProfile && profileDrawer) {
    btnCloseProfile.addEventListener("click", () => {
      profileDrawer.classList.remove("open");
      profileDrawer.setAttribute("aria-hidden", "true");
    });
  }

  // Type Selector Tabs in Modal
  document.querySelectorAll(".type-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".type-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      appState.exchangeModalType = tab.dataset.type;
      updateModalFieldsForType(tab.dataset.type);
    });
  });

  // Formulaire Créer un Échange
  const formExchange = document.getElementById("create-exchange-form");
  if (formExchange) {
    formExchange.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("exchange-title").value.trim();
      const category = document.getElementById("exchange-category").value;
      const secondary = document.getElementById("exchange-secondary").value.trim();
      const description = document.getElementById("exchange-description").value.trim();
      const codeOrDetails = document.getElementById("exchange-code").value.trim();

      if (appState.exchangeModalType === "component") {
        const newComp = {
          id: "comp-" + Date.now(),
          title: title,
          category: category,
          lang: secondary.toLowerCase(),
          country: "BJ",
          countryFlag: "🇧🇯 Bénin",
          verified: true,
          author: "Modeste YABLA",
          authorAvatar: "MY",
          downloads: "1",
          rating: 5.0,
          upvotes: 1,
          installCmd: `npm i @devcom/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          desc: description,
          code: codeOrDetails,
          simulationOutput: `[DEVCOM] Module exécuté avec succès.`
        };
        appState.components.unshift(newComp);
        renderComponents();
        showToast("🎉 Composant publié avec succès sur DevCom Africa !");
      } else if (appState.exchangeModalType === "bounty") {
        const newBounty = {
          id: "bounty-" + Date.now(),
          reward: secondary || "100 000 FCFA",
          title: title,
          payoutMethod: "Mobile Money",
          desc: description,
          difficulty: "Intermédiaire",
          applicants: 0,
          deadline: "30 nov. 2026",
          company: "Modeste YABLA (Binary Minds)"
        };
        appState.bounties.unshift(newBounty);
        renderBounties();
        showToast("💰 Bounty publié et ouvert aux candidatures !");
      } else if (appState.exchangeModalType === "help") {
        const newPeer = {
          id: "peer-" + Date.now(),
          author: "Modeste YABLA",
          country: "🇧🇯 Bénin",
          tag: "Troc Technique",
          title: title,
          desc: description,
          deal: secondary
        };
        appState.peerExchanges.unshift(newPeer);
        renderPeerExchanges();
        showToast("🤝 Demande d'échange publiée dans le flux communautaire !");
      }

      formExchange.reset();
      closeCreateExchangeModal();
    });
  }

  const btnCloseExModal = document.getElementById("close-exchange-modal-btn");
  const btnCancelEx = document.getElementById("btn-cancel-exchange");
  if (btnCloseExModal) btnCloseExModal.addEventListener("click", closeCreateExchangeModal);
  if (btnCancelEx) btnCancelEx.addEventListener("click", closeCreateExchangeModal);

  // Chat Form Send
  const chatForm = document.getElementById("chat-send-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-message-input");
      const msg = input.value.trim();
      if (!msg) return;

      const chatArea = document.getElementById("chat-messages-area");
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Bulle utilisateur
      const userBubble = document.createElement("div");
      userBubble.className = "chat-bubble sender";
      userBubble.innerHTML = `
        <div class="bubble-sender">Moi (Modeste YABLA)</div>
        <div class="bubble-text">${escapeHtml(msg)}</div>
        <div class="bubble-time">${timeStr}</div>
      `;
      chatArea.appendChild(userBubble);
      input.value = "";
      chatArea.scrollTop = chatArea.scrollHeight;

      // Simulation de réponse automatique
      setTimeout(() => {
        const replyBubble = document.createElement("div");
        replyBubble.className = "chat-bubble recipient";
        replyBubble.innerHTML = `
          <div class="bubble-sender">${appState.activeChatRecipient}</div>
          <div class="bubble-text">Bien reçu ! Je regarde ton message et je te réponds tout de suite avec les détails de l'implémentation.</div>
          <div class="bubble-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatArea.appendChild(replyBubble);
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 1200);
    });
  }

  // Simulation Sandbox
  const runSimBtn = document.getElementById("btn-run-simulation");
  if (runSimBtn) {
    runSimBtn.addEventListener("click", () => {
      const output = document.getElementById("exec-output");
      output.textContent = "⏳ Exécution du code dans l'environnement Edge Sandbox...";
      
      setTimeout(() => {
        if (appState.activeSandboxComponent && appState.activeSandboxComponent.simulationOutput) {
          output.textContent = appState.activeSandboxComponent.simulationOutput;
        } else {
          output.textContent = "[SUCCESS] Composant exécuté sans erreurs dans le conteneur Edge.";
        }
        showToast("Simulation complétée avec succès !");
      }, 500);
    });
  }

  const closeSandboxBtn = document.getElementById("close-sandbox-btn");
  if (closeSandboxBtn) closeSandboxBtn.addEventListener("click", closeSandbox);

  const copySandboxBtn = document.getElementById("btn-copy-sandbox");
  if (copySandboxBtn) {
    copySandboxBtn.addEventListener("click", () => {
      if (appState.activeSandboxComponent) {
        navigator.clipboard.writeText(appState.activeSandboxComponent.code);
        showToast("Code copié !");
      }
    });
  }

  // Menu Mobile
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("main-nav");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      const isVisible = navLinks.style.display === "flex";
      navLinks.style.display = isVisible ? "none" : "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "74px";
      navLinks.style.left = "0";
      navLinks.style.right = "0";
      navLinks.style.background = "var(--bg-surface)";
      navLinks.style.padding = "20px";
      navLinks.style.borderBottom = "1px solid var(--border-glass)";
    });
  }
}

// ==========================================================================
// Toasts de Notification
// ==========================================================================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>⚡</span> <span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// Utilitaires
// ==========================================================================
function formatCategoryName(cat) {
  switch (cat) {
    case "mobile-money": return "Mobile Money";
    case "offline": return "Offline & PWA";
    case "ussd": return "USSD & Télécom";
    case "security": return "Sécurité & Auth";
    case "cloud": return "Cloud & DevOps";
    default: return cat;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.resetFilters = function() {
  appState.activeCategory = "all";
  appState.activeLang = "all";
  appState.activeCountry = "all";
  appState.searchQuery = "";
  
  document.getElementById("omnisearch-input").value = "";
  document.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
  document.querySelector(".quick-chip[data-category='all']").classList.add("active");
  document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
  document.querySelector(".lang-pill[data-lang='all']").classList.add("active");
  
  renderComponents();
};
