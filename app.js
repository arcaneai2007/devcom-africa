/**
 * DevCom Africa — Logique SPA & Navigation par Vues
 * Architecture épurée style Linear / GitHub / Supabase
 */

// ==========================================================================
// 1. Données Initiales : Composants & APIs
// ==========================================================================
const COMPONENTS_DATA = [
  {
    id: "momo-pay",
    title: "@devcom/momo-pay",
    category: "mobile-money",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    author: "Modeste YABLA",
    upvotes: 142,
    installCmd: "npm i @devcom/momo-pay",
    desc: "SDK TypeScript unifié pour MTN MoMo et Moov Money avec vérification de signature HMAC, déduplication des webhooks et retry automatique.",
    code: `import { MoMoClient } from '@devcom/momo-pay';

const client = new MoMoClient({
  subscriptionKey: process.env.MOMO_KEY!,
  apiUser: process.env.MOMO_USER!,
  apiKey: process.env.MOMO_SECRET!,
  environment: 'production'
});

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
    simulation: `[MOMO-PAY] Connexion aux passerelles MTN MoMo & Moov Bénin...
[REQUEST] Demande C2B : 15 000 XOF vers +229 97 00 00 00
[DISPATCH] Notification Push USSD envoyée sur le terminal client...
[WEBHOOK] Callback reçu : TxId #BJ-88392019-OK
[STATUS]  Paiement validé avec succès (Code 200). Solde crédité.`
  },
  {
    id: "wave-sdk",
    title: "devcom-wave-sdk",
    category: "mobile-money",
    lang: "python",
    country: "CI",
    countryFlag: "🇨🇮 Côte d'Ivoire",
    author: "Emmanuel Kouassi",
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
    simulation: `[WAVE] Connexion aux passerelles Wave CI & SN...
[SESSION] Création de session pour 25 000 XOF...
[LINK] Deep Link généré : wave://checkout/sess_839210
[QR] QR Code scannable disponible sur CDN.
[RESULT]  Session active, prête pour redirection mobile.`
  },
  {
    id: "offline-sync",
    title: "@devcom/offline-sync",
    category: "offline",
    lang: "javascript",
    country: "SN",
    countryFlag: "🇸🇳 Sénégal",
    author: "Amina Diallo",
    upvotes: 98,
    installCmd: "npm i @devcom/offline-sync",
    desc: "Moteur de mise en cache IndexedDB et synchronisation en tâche de fond pour applications web en environnement réseau instable.",
    code: `import { AfriSyncEngine } from '@devcom/offline-sync';

const sync = new AfriSyncEngine({
  dbName: 'afri_app_cache',
  autoRetryInterval: 5000,
  syncEndpoint: '/api/v1/sync'
});

export async function submitDataOffline(data) {
  await sync.queueTask({
    action: 'CREATE_CLIENT_RECORD',
    payload: data,
    timestamp: Date.now()
  });
  console.log("Données sauvegardées localement. Synchronisation dès reconnexion.");
}`,
    simulation: `[OFFLINE-SYNC] Moteur initialisé sur IndexedDB.
[NETWORK] État réseau : HORS-LIGNE (Coupure data simulée)
[CACHE] Action 'CREATE_CLIENT_RECORD' sauvegardée dans la file locale.
[NETWORK] Réseau rétabli (4G détectée) !
[SYNC] Envoi des données en arrière-plan vers le serveur...
[SUCCESS]  100% des données locales répliquées sans conflit.`
  },
  {
    id: "ussd-engine",
    title: "@devcom/ussd-engine",
    category: "ussd",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    author: "Modeste YABLA",
    upvotes: 210,
    installCmd: "npm i @devcom/ussd-engine",
    desc: "Framework robuste de routage de menus USSD multi-niveaux compatible avec MTN, Moov, Orange et Airtel dans toute l'Afrique de l'Ouest.",
    code: `import { USSDRouter } from '@devcom/ussd-engine';

const router = new USSDRouter();

router.onRoot((session) => {
  return session.con("Bienvenue sur DevCom USSD\\n1. Mon Solde DevPoints\\n2. Bounties Récents\\n3. Assistance");
});

router.onOption('1', async (session) => {
  return session.end("Votre solde actuel est de : 1,250 DP.\\nDevise locale équivalente : 62,500 FCFA.");
});`,
    simulation: `[USSD-ROUTER] Passerelle USSD initialisée (*345#)...
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
    id: "sms-router",
    title: "devcom-sms-router",
    category: "security",
    lang: "python",
    country: "TG",
    countryFlag: "🇹🇬 Togo",
    author: "Yao Mensah",
    upvotes: 89,
    installCmd: "pip install devcom-sms-router",
    desc: "Routeur d'envoi de SMS transactionnels avec choix intelligent de passerelle pour minimiser les coûts SMS au Bénin, Togo, CI et Sénégal.",
    code: `from devcom_sms_router import SmartSMSBroker

broker = SmartSMSBroker()

def send_auth_code(phone: str):
    otp = broker.generate_secure_otp()
    status = broker.dispatch_sms(
        destination=phone,
        message=f"Votre code de sécurité DevCom est : {otp}"
    )
    return {"status": status, "otp": otp}`,
    simulation: `[SMS-ROUTER] Analyse du numéro destinataire : +228 90 00 00 00 (Togo)
[ALGO] Détection de la route la plus économique...
[ROUTE] Opérateur local sélectionné (Économie : -55%).
[STATUS]  SMS expédié en 380ms. Code généré : 928301.`
  },
  {
    id: "flutter-pay",
    title: "flutter_african_pay",
    category: "mobile-money",
    lang: "flutter",
    country: "NG",
    countryFlag: "🇳🇬 Nigeria",
    author: "Chukwudi Okafor",
    upvotes: 156,
    installCmd: "flutter pub add flutter_african_pay",
    desc: "Widget Flutter clé en main offrant une feuille de paiement prenant en charge MTN MoMo, Wave, Orange Money et cartes bancaires africaines.",
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
    simulation: `[FLUTTER-PAY] Affichage du composant Modal Bottom Sheet...
[UI] Rendu des logos MTN MoMo, Wave et Moov Money en SVG fluide.
[USER] Choix : Wave Côte d'Ivoire / Sénégal.
[DEEP-LINK] Lancement de l'app Wave installée...
[CALLBACK] Validation de transaction #CI-994827 reçue !`
  }
];

// ==========================================================================
// 2. Données Initiales : Bounties & Missions
// ==========================================================================
const BOUNTIES_DATA = [
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
// 3. Données Initiales : Entraide & Troc
// ==========================================================================
const PEER_DATA = [
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
// 4. Données Initiales : Développeurs
// ==========================================================================
const DEVELOPERS_DATA = [
  {
    id: "dev-modeste",
    name: "Modeste YABLA",
    avatar: "MY",
    role: "Fullstack & Cloud Architect",
    country: "🇧🇯 Cotonou, Bénin",
    skills: ["TypeScript", "Next.js", "Python", "Mobile Money"],
    dp: 1250,
    exchanges: 14
  },
  {
    id: "dev-amina",
    name: "Amina Diallo",
    avatar: "AD",
    role: "Mobile & Flutter Engineer",
    country: "🇸🇳 Dakar, Sénégal",
    skills: ["Flutter", "Dart", "IndexedDB", "PWA"],
    dp: 980,
    exchanges: 9
  },
  {
    id: "dev-emmanuel",
    name: "Emmanuel Kouassi",
    avatar: "EK",
    role: "Backend & Fintech Specialist",
    country: "🇨🇮 Abidjan, Côte d'Ivoire",
    skills: ["Python", "FastAPI", "Wave", "PostgreSQL"],
    dp: 1120,
    exchanges: 11
  },
  {
    id: "dev-chukwudi",
    name: "Chukwudi Okafor",
    avatar: "CO",
    role: "DevOps & Systems Engineer",
    country: "🇳🇬 Lagos, Nigeria",
    skills: ["Go", "Docker", "Kubernetes", "AWS/Cloud"],
    dp: 1450,
    exchanges: 18
  }
];

// ==========================================================================
// État Global de l'Application
// ==========================================================================
let appState = {
  currentView: "components-view",
  components: [...COMPONENTS_DATA],
  bounties: [...BOUNTIES_DATA],
  peers: [...PEER_DATA],
  developers: [...DEVELOPERS_DATA],
  componentFilterCat: "all",
  componentFilterLang: "all",
  countryFilter: "all",
  searchQuery: "",
  activeDetailComponent: null,
  activeChatRecipient: "Amina Diallo",
  modalType: "component"
};

// ==========================================================================
// Initialisation
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderComponents();
  renderBounties();
  renderPeers();
  renderDevelopers();
  initNavigation();
  initFilters();
  initDrawersAndModals();
});

// ==========================================================================
// Thème Sombre / Clair
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem("devcom_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("devcom_theme", next);
      showToast(`Mode ${next === "dark" ? "Sombre" : "Clair"}`);
    });
  }
}

// ==========================================================================
// Navigation Dédiée par Vues (SPA)
// ==========================================================================
function switchView(viewId, breadcrumbTitle) {
  appState.currentView = viewId;

  // Mettre à jour la sidebar
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add("active");
    } else if (item.dataset.view) {
      item.classList.remove("active");
    }
  });

  // Basculer l'affichage exclusif des vues
  document.querySelectorAll(".view-container").forEach(view => {
    if (view.id === viewId) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Mettre à jour le titre dans le fil d'Ariane
  const breadcrumbEl = document.getElementById("breadcrumb-current-title");
  if (breadcrumbEl && breadcrumbTitle) {
    breadcrumbEl.textContent = breadcrumbTitle;
  }

  // Fermer la sidebar sur mobile
  const sidebar = document.getElementById("app-sidebar");
  if (sidebar) sidebar.classList.remove("mobile-open");
}

function initNavigation() {
  const navMap = [
    { id: "nav-btn-components", view: "components-view", title: "Composants & APIs" },
    { id: "nav-btn-bounties", view: "bounties-view", title: "Bourse aux Bounties" },
    { id: "nav-btn-peer", view: "peer-view", title: "Entraide & Troc" },
    { id: "nav-btn-developers", view: "developers-view", title: "Développeurs" }
  ];

  navMap.forEach(item => {
    const btn = document.getElementById(item.id);
    if (btn) {
      btn.addEventListener("click", () => switchView(item.view, item.title));
    }
  });

  // Toggle mobile sidebar
  const toggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebar = document.getElementById("app-sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("mobile-open");
    });
  }
}

// ==========================================================================
// Rendu VUE 1 : Composants & APIs
// ==========================================================================
function renderComponents() {
  const container = document.getElementById("components-items-grid");
  if (!container) return;

  const filtered = appState.components.filter(c => {
    if (appState.componentFilterCat !== "all" && c.category !== appState.componentFilterCat) return false;
    if (appState.componentFilterLang !== "all" && c.lang !== appState.componentFilterLang) return false;
    if (appState.countryFilter !== "all" && c.country !== appState.countryFilter) return false;
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

  const countBadge = document.getElementById("count-components-badge");
  if (countBadge) countBadge.textContent = filtered.length;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <p style="color: var(--text-muted); font-size: 0.95rem;">🔍 Aucun composant ne correspond aux filtres actuels.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(comp => `
    <div class="comp-card">
      <div>
        <div class="comp-top">
          <div class="comp-name-group">
            <h3 class="comp-title">${escapeHtml(comp.title)}</h3>
            <span class="comp-cat-tag">${formatCategory(comp.category)}</span>
          </div>
          <span class="comp-country">${comp.countryFlag}</span>
        </div>

        <p class="comp-desc">${escapeHtml(comp.desc)}</p>

        <div class="comp-install-box">
          <code>${escapeHtml(comp.installCmd)}</code>
          <button class="comp-copy-btn" onclick="copyText('${escapeHtml(comp.installCmd)}')" title="Copier la commande">📋</button>
        </div>
      </div>

      <div class="comp-bottom">
        <span class="comp-author-meta">${escapeHtml(comp.author)}</span>
        <div class="comp-btn-group">
          <button class="btn btn-xs btn-outline" onclick="handleUpvote('${comp.id}')">
            ▲ ${comp.upvotes}
          </button>
          <button class="btn btn-xs btn-primary" onclick="openComponentDetail('${comp.id}')">
            Détails & Test
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// Rendu VUE 2 : Bounties
// ==========================================================================
function renderBounties() {
  const container = document.getElementById("bounties-items-list");
  if (!container) return;

  const filtered = appState.bounties.filter(b => {
    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      return b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q) || b.reward.toLowerCase().includes(q);
    }
    return true;
  });

  const countBadge = document.getElementById("count-bounties-badge");
  if (countBadge) countBadge.textContent = filtered.length;

  container.innerHTML = filtered.map(b => `
    <div class="bounty-item">
      <div class="bounty-left">
        <div class="bounty-item-top">
          <span class="bounty-reward-badge">${b.reward}</span>
          <span class="bounty-method-tag">💳 ${b.payoutMethod}</span>
          <span style="font-size: 0.75rem; color: var(--text-faint);">• ${b.difficulty}</span>
        </div>
        <h3 class="bounty-item-title">${escapeHtml(b.title)}</h3>
        <p class="bounty-item-desc">${escapeHtml(b.desc)}</p>
        <div class="bounty-item-meta">
          <span>🏢 ${b.company}</span> • <span>⏳ Échéance : ${b.deadline}</span> • <span>👥 ${b.applicants} candidats</span>
        </div>
      </div>
      <button class="btn btn-sm btn-amber" onclick="applyBounty('${escapeHtml(b.title)}')">
        Postuler
      </button>
    </div>
  `).join('');
}

// ==========================================================================
// Rendu VUE 3 : Entraide & Troc
// ==========================================================================
function renderPeers() {
  const container = document.getElementById("peer-items-list");
  if (!container) return;

  const filtered = appState.peers.filter(p => {
    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    }
    return true;
  });

  const countBadge = document.getElementById("count-peer-badge");
  if (countBadge) countBadge.textContent = filtered.length;

  container.innerHTML = filtered.map(p => `
    <div class="peer-item">
      <div class="peer-left">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span class="bounty-method-tag" style="background: var(--accent-blue-bg); color: var(--accent-blue);">${p.tag}</span>
          <span style="font-size: 0.78rem; color: var(--text-faint);">${p.country} • ${p.author}</span>
        </div>
        <h3 class="bounty-item-title">${escapeHtml(p.title)}</h3>
        <p class="bounty-item-desc">${escapeHtml(p.desc)}</p>
        <div class="peer-deal-box">
          <strong>Accord proposé :</strong> ${escapeHtml(p.deal)}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <button class="btn btn-sm btn-outline" onclick="openChatWith('${p.author}')">
          💬 Contacter
        </button>
        <button class="btn btn-sm btn-primary" onclick="acceptPeerDeal('${escapeHtml(p.title)}')">
          Proposer
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// Rendu VUE 4 : Développeurs
// ==========================================================================
function renderDevelopers() {
  const container = document.getElementById("devs-items-grid");
  if (!container) return;

  const filtered = appState.developers.filter(d => {
    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.role.toLowerCase().includes(q) || d.skills.some(s => s.toLowerCase().includes(q));
    }
    return true;
  });

  container.innerHTML = filtered.map(d => `
    <div class="dev-box">
      <div class="dev-avatar-round">${d.avatar}</div>
      <h3 class="dev-box-name">${escapeHtml(d.name)}</h3>
      <p class="dev-box-role">${escapeHtml(d.role)}</p>
      <div class="dev-box-loc">${d.country}</div>

      <div class="dev-box-skills">
        ${d.skills.map(s => `<span class="dev-skill-pill">${escapeHtml(s)}</span>`).join('')}
      </div>

      <div class="dev-box-bottom">
        <span style="color: var(--accent-green); font-weight: 600;">⚡ ${d.dp} DP</span>
        <button class="btn btn-xs btn-outline" onclick="openChatWith('${escapeHtml(d.name)}')">
          Message
        </button>
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// Tiroir Détail Composant & Bac à sable
// ==========================================================================
window.openComponentDetail = function(id) {
  const comp = appState.components.find(c => c.id === id);
  if (!comp) return;

  appState.activeDetailComponent = comp;

  document.getElementById("drawer-comp-title").textContent = comp.title;
  document.getElementById("drawer-comp-meta").textContent = `${comp.lang.toUpperCase()} • ${comp.countryFlag} • Par ${comp.author}`;
  document.getElementById("drawer-comp-desc").textContent = comp.desc;
  document.getElementById("drawer-comp-install").textContent = comp.installCmd;
  document.getElementById("drawer-comp-code").textContent = comp.code;
  document.getElementById("drawer-sandbox-output").textContent = "Cliquez sur « Lancer le Test » pour simuler l'exécution...";

  const drawer = document.getElementById("detail-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
};

function closeComponentDetail() {
  const drawer = document.getElementById("detail-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Tiroir Messagerie
// ==========================================================================
window.openChatWith = function(recipientName) {
  appState.activeChatRecipient = recipientName;
  document.getElementById("chat-active-recipient").textContent = recipientName;
  document.getElementById("chat-input").placeholder = `Écrire un message à ${recipientName.split(' ')[0]}...`;

  const drawer = document.getElementById("chat-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");

  // Masquer badge non lus
  const pill = document.getElementById("sidebar-unread-pill");
  if (pill) pill.style.display = "none";
};

function closeChat() {
  const drawer = document.getElementById("chat-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Tiroir Profil
// ==========================================================================
function openProfile() {
  const drawer = document.getElementById("profile-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeProfile() {
  const drawer = document.getElementById("profile-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Modal Nouvel Échange
// ==========================================================================
window.openCreateModal = function(type = "component") {
  appState.modalType = type;
  document.querySelectorAll(".type-tab-btn").forEach(b => b.classList.remove("active"));
  const btn = document.querySelector(`.type-tab-btn[data-type="${type}"]`);
  if (btn) btn.classList.add("active");

  updateCreateModalFields(type);

  const modal = document.getElementById("create-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

function closeCreateModal() {
  const modal = document.getElementById("create-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function updateCreateModalFields(type) {
  const labelExtra = document.getElementById("label-form-extra");
  const inputExtra = document.getElementById("form-extra");
  const labelCode = document.getElementById("label-form-code");
  const inputCode = document.getElementById("form-code");

  if (type === "component") {
    labelExtra.textContent = "Langage de programmation";
    inputExtra.placeholder = "TypeScript, Python, Flutter...";
    labelCode.textContent = "Code source du module";
    inputCode.placeholder = "// Insérez votre code ici...";
  } else if (type === "bounty") {
    labelExtra.textContent = "Montant & Devise (ex: 150 000 FCFA)";
    inputExtra.placeholder = "Montant en FCFA / Mobile Money";
    labelCode.textContent = "Critères d'acceptation & Livrables";
    inputCode.placeholder = "Détaillez le résultat attendu...";
  } else if (type === "help") {
    labelExtra.textContent = "Ce que vous offrez en contrepartie";
    inputExtra.placeholder = "Ex: 2h de revue de code, 100 DP...";
    labelCode.textContent = "Détail du point de blocage";
    inputCode.placeholder = "Expliquez le bug ou la problématique...";
  }
}

// ==========================================================================
// Filtres & Recherche
// ==========================================================================
function initFilters() {
  // Recherche globale
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value.trim();
      renderComponents();
      renderBounties();
      renderPeers();
      renderDevelopers();
    });
  }

  // Filtre catégorie de composants
  document.querySelectorAll("#component-category-pills .filter-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#component-category-pills .filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.componentFilterCat = pill.dataset.cat;
      renderComponents();
    });
  });

  // Filtre langage composants
  const langSelect = document.getElementById("component-lang-select");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      appState.componentFilterLang = e.target.value;
      renderComponents();
    });
  }

  // Filtre pays
  const countrySelect = document.getElementById("country-filter");
  if (countrySelect) {
    countrySelect.addEventListener("change", (e) => {
      appState.countryFilter = e.target.value;
      renderComponents();
      showToast(`Pays sélectionné : ${countrySelect.options[countrySelect.selectedIndex].text}`);
    });
  }
}

// ==========================================================================
// Gestionnaires d'Événements des Tiroirs et Modals
// ==========================================================================
function initDrawersAndModals() {
  // Détail Composant
  const closeDetailBtn = document.getElementById("close-detail-drawer");
  if (closeDetailBtn) closeDetailBtn.addEventListener("click", closeComponentDetail);

  const copyInstallBtn = document.getElementById("btn-copy-install");
  if (copyInstallBtn) {
    copyInstallBtn.addEventListener("click", () => {
      if (appState.activeDetailComponent) {
        copyText(appState.activeDetailComponent.installCmd);
      }
    });
  }

  const copyCodeBtn = document.getElementById("btn-copy-code");
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      if (appState.activeDetailComponent) {
        copyText(appState.activeDetailComponent.code);
      }
    });
  }

  const runSandboxBtn = document.getElementById("btn-run-sandbox");
  if (runSandboxBtn) {
    runSandboxBtn.addEventListener("click", () => {
      const out = document.getElementById("drawer-sandbox-output");
      out.textContent = "⏳ Exécution du conteneur de test...";
      setTimeout(() => {
        if (appState.activeDetailComponent && appState.activeDetailComponent.simulation) {
          out.textContent = appState.activeDetailComponent.simulation;
        } else {
          out.textContent = "[SUCCESS] Exécution complétée sans erreurs.";
        }
        showToast("Simulation terminée !");
      }, 400);
    });
  }

  // Messagerie
  const navMsgBtn = document.getElementById("nav-btn-messages");
  if (navMsgBtn) navMsgBtn.addEventListener("click", () => openChatWith(appState.activeChatRecipient));

  const closeChatBtn = document.getElementById("close-chat-drawer");
  if (closeChatBtn) closeChatBtn.addEventListener("click", closeChat);

  document.querySelectorAll(".contact-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".contact-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      openChatWith(tab.dataset.name);
    });
  });

  const chatForm = document.getElementById("chat-send-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const msg = input.value.trim();
      if (!msg) return;

      const container = document.getElementById("chat-messages-container");
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const bubble = document.createElement("div");
      bubble.className = "chat-msg sent";
      bubble.innerHTML = `
        <div class="msg-sender">Moi</div>
        <div class="msg-body">${escapeHtml(msg)}</div>
        <div class="msg-time">${timeStr}</div>
      `;
      container.appendChild(bubble);
      input.value = "";
      container.scrollTop = container.scrollHeight;

      // Réponse automatique simulée
      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "chat-msg received";
        reply.innerHTML = `
          <div class="msg-sender">${appState.activeChatRecipient}</div>
          <div class="msg-body">Bien reçu ! Je regarde ton message et je te réponds tout de suite avec les détails.</div>
          <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        container.appendChild(reply);
        container.scrollTop = container.scrollHeight;
      }, 1000);
    });
  }

  // Profil
  const navProfileBtn = document.getElementById("nav-btn-my-profile");
  const userSnippetBtn = document.getElementById("user-snippet-btn");
  if (navProfileBtn) navProfileBtn.addEventListener("click", openProfile);
  if (userSnippetBtn) userSnippetBtn.addEventListener("click", openProfile);

  const closeProfileBtn = document.getElementById("close-profile-drawer");
  if (closeProfileBtn) closeProfileBtn.addEventListener("click", closeProfile);

  // Modal Création
  const topCreateBtn = document.getElementById("btn-top-create");
  if (topCreateBtn) topCreateBtn.addEventListener("click", () => openCreateModal("component"));

  const closeCreateBtn = document.getElementById("close-create-modal");
  const cancelCreateBtn = document.getElementById("btn-cancel-create");
  if (closeCreateBtn) closeCreateBtn.addEventListener("click", closeCreateModal);
  if (cancelCreateBtn) cancelCreateBtn.addEventListener("click", closeCreateModal);

  document.querySelectorAll(".type-tab-btn").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".type-tab-btn").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      appState.modalType = tab.dataset.type;
      updateCreateModalFields(tab.dataset.type);
    });
  });

  const createForm = document.getElementById("create-exchange-form");
  if (createForm) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("form-title").value.trim();
      const category = document.getElementById("form-category").value;
      const extra = document.getElementById("form-extra").value.trim();
      const desc = document.getElementById("form-desc").value.trim();
      const codeOrDetails = document.getElementById("form-code").value.trim();

      if (appState.modalType === "component") {
        const newComp = {
          id: "comp-" + Date.now(),
          title: title,
          category: category,
          lang: extra.toLowerCase(),
          country: "BJ",
          countryFlag: "🇧🇯 Bénin",
          author: "Modeste YABLA",
          upvotes: 1,
          installCmd: `npm i @devcom/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          desc: desc,
          code: codeOrDetails,
          simulation: `[DEVCOM] Module exécuté avec succès.`
        };
        appState.components.unshift(newComp);
        renderComponents();
        switchView("components-view", "Composants & APIs");
        showToast("Composant publié sur DevCom Africa !");
      } else if (appState.modalType === "bounty") {
        const newBounty = {
          id: "bounty-" + Date.now(),
          reward: extra || "100 000 FCFA",
          title: title,
          payoutMethod: "Mobile Money",
          desc: desc,
          difficulty: "Intermédiaire",
          applicants: 0,
          deadline: "30 nov. 2026",
          company: "Modeste YABLA"
        };
        appState.bounties.unshift(newBounty);
        renderBounties();
        switchView("bounties-view", "Bourse aux Bounties");
        showToast("Bounty ouvert aux candidatures !");
      } else if (appState.modalType === "help") {
        const newPeer = {
          id: "peer-" + Date.now(),
          author: "Modeste YABLA",
          country: "🇧🇯 Bénin",
          tag: "Troc Technique",
          title: title,
          desc: desc,
          deal: extra
        };
        appState.peers.unshift(newPeer);
        renderPeers();
        switchView("peer-view", "Entraide & Troc");
        showToast("Demande d'échange publiée !");
      }

      createForm.reset();
      closeCreateModal();
    });
  }
}

// ==========================================================================
// Utilitaires
// ==========================================================================
window.handleUpvote = function(id) {
  const comp = appState.components.find(c => c.id === id);
  if (!comp) return;
  comp.upvotes += 1;
  renderComponents();
  showToast(`+1 pour ${comp.title}`);
};

window.copyText = function(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copié dans le presse-papier !");
  });
};

window.applyBounty = function(title) {
  const email = prompt(`Postuler à la mission :\n"${title}"\n\nVotre adresse email ou GitHub :`);
  if (email) {
    showToast(`Candidature enregistrée pour ${email} !`);
  }
};

window.acceptPeerDeal = function(title) {
  showToast("Proposition envoyée ! Ouverture du chat...");
  setTimeout(() => openChatWith("Amina Diallo"), 400);
};

function formatCategory(cat) {
  switch(cat) {
    case "mobile-money": return "Mobile Money";
    case "offline": return "Offline";
    case "ussd": return "USSD";
    case "security": return "Sécurité";
    default: return cat;
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showToast(msg) {
  const shelf = document.getElementById("toast-shelf");
  if (!shelf) return;
  const t = document.createElement("div");
  t.className = "toast-msg";
  t.textContent = msg;
  shelf.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 0.2s ease";
    setTimeout(() => t.remove(), 200);
  }, 2500);
}
