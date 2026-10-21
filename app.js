/**
 * DevCom Africa — Logique & Interactivité (Inspiré de DevBénin)
 * Fonctionnalités : DevSearch, Showroom, Sandbox, Bounties, Entraide & Messagerie
 */

// ==========================================================================
// 1. Base de Connaissances DevSearch (Signature DevBénin)
// ==========================================================================
const DEVSEARCH_KB = [
  {
    keywords: ["momo", "mtn", "webhook", "signature", "hmac", "benin"],
    title: "Validation de Webhook MTN MoMo (Bénin & Afrique de l'Ouest)",
    framework: "Node.js / TypeScript",
    explanation: "Pour valider les callbacks MTN MoMo, concaténez transactionId, amount et senderPhone séparés par deux-points, puis comparez le hash HMAC-SHA256 avec la signature transmise dans le header.",
    code: `import crypto from 'crypto';

export function verifyMoMoWebhook(payload: any, signature: string, secret: string): boolean {
  const data = \`\${payload.transactionId}:\${payload.amount}:\${payload.senderPhone}\`;
  const expectedHash = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedHash));
}`
  },
  {
    keywords: ["wave", "qr", "session", "checkout", "ci", "senegal"],
    title: "Création de Session Checkout Wave & Génération QR Code",
    framework: "Python / FastAPI / Django",
    explanation: "L'API Wave crée une session checkout renvoyant une URL de redirection mobile (deep link wave://) ainsi qu'un QR code SVG scannable par l'application cliente.",
    code: `import httpx

async def create_wave_checkout(amount: int, order_id: str, api_key: str):
    url = "https://api.wave.com/v1/checkout/sessions"
    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "amount": str(amount),
        "currency": "XOF",
        "client_reference": order_id,
        "success_url": "https://devcom.africa/payment/success"
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, headers=headers)
        return res.json() # contient wave_launch_url & qr_code_url`
  },
  {
    keywords: ["ussd", "menu", "telco", "format", "session", "mtn", "moov"],
    title: "Format de Réponse USSD Multi-Opérateurs (*345#)",
    framework: "Standard Télécom (CON / END)",
    explanation: "Chaque réponse USSD doit débuter par 'CON' pour maintenir la session ouverte avec un menu, ou par 'END' pour clore l'échange et libérer le canal télécom.",
    code: `export function handleUSSD(userInput: string, phoneNumber: string): string {
  if (!userInput) {
    return "CON Bienvenue sur DevCom USSD\\n1. Mon Solde\\n2. Bounties\\n3. Support";
  }
  if (userInput === '1') {
    return "END Votre solde est de 1,250 DevPoints (62,500 FCFA).";
  }
  return "END Choix invalide. Tapez *345# pour recommencer.";
}`
  },
  {
    keywords: ["offline", "sync", "indexeddb", "pwa", "reseau"],
    title: "File de Synchronisation Offline-First avec IndexedDB",
    framework: "JavaScript / Service Worker",
    explanation: "Stockez les requêtes en échec dans une base locale IndexedDB en mode hors-ligne, et écoutez l'événement 'online' du navigateur pour dépiler et envoyer automatiquement vers le serveur.",
    code: `window.addEventListener('online', async () => {
  console.log("Réseau rétabli. Synchronisation des transactions locales...");
  const pending = await getPendingFromIndexedDB();
  for (const item of pending) {
    await fetch('/api/sync', { method: 'POST', body: JSON.stringify(item) });
  }
  await clearIndexedDBQueue();
});`
  }
];

// ==========================================================================
// 2. Données Showroom Composants & APIs
// ==========================================================================
const COMPONENTS_LIST = [
  {
    id: "momo-pay",
    title: "@devcom/momo-pay",
    category: "mobile-money",
    lang: "TypeScript",
    country: "🇧🇯 Bénin",
    author: "Modeste YABLA",
    upvotes: 142,
    installCmd: "npm i @devcom/momo-pay",
    desc: "SDK TypeScript unifié pour MTN MoMo et Moov Money avec validation HMAC timing-safe et retry automatique des callbacks.",
    code: `import { MoMoClient } from '@devcom/momo-pay';

const client = new MoMoClient({
  subscriptionKey: process.env.MOMO_KEY!,
  apiUser: process.env.MOMO_USER!,
  apiKey: process.env.MOMO_SECRET!,
  environment: 'production'
});

export async function requestPayment(phone: string, amount: number) {
  return await client.requestToPay({
    amount: amount,
    currency: 'XOF',
    payer: { partyIdType: 'MSISDN', partyId: phone },
    payerMessage: 'Abonnement DevCom'
  });
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
    lang: "Python",
    country: "🇨🇮 Côte d'Ivoire",
    author: "Emmanuel Kouassi",
    upvotes: 184,
    installCmd: "pip install devcom-wave",
    desc: "Client Python pour intégrer les paiements Wave instantanés avec génération automatique de QR Code et deep links mobiles.",
    code: `from devcom_wave import WaveCheckoutSession

wave = WaveCheckoutSession(api_key="wave_ci_live_secret_...")

def create_order_payment(order_id: str, amount_cfa: int):
    return wave.create_session(
        amount=amount_cfa,
        currency="XOF",
        success_url=f"https://devcom.africa/orders/{order_id}/success"
    )`,
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
    lang: "JavaScript",
    country: "🇸🇳 Sénégal",
    author: "Amina Diallo",
    upvotes: 98,
    installCmd: "npm i @devcom/offline-sync",
    desc: "Moteur de mise en cache IndexedDB et réplication résiliente en arrière-plan pour réseaux 3G/4G intermittents.",
    code: `import { AfriSyncEngine } from '@devcom/offline-sync';

const sync = new AfriSyncEngine({
  dbName: 'afri_app_cache',
  autoRetryInterval: 5000,
  syncEndpoint: '/api/v1/sync'
});

export async function submitDataOffline(data) {
  await sync.queueTask({ action: 'CREATE_RECORD', payload: data });
}`,
    simulation: `[OFFLINE-SYNC] Moteur initialisé sur IndexedDB.
[NETWORK] État réseau : HORS-LIGNE (Coupure data simulée)
[CACHE] Action sauvegardée dans la file locale.
[NETWORK] Réseau rétabli (4G détectée) !
[SYNC] Envoi des données en arrière-plan vers le serveur...
[SUCCESS]  100% des données locales répliquées sans conflit.`
  },
  {
    id: "ussd-engine",
    title: "@devcom/ussd-engine",
    category: "ussd",
    lang: "TypeScript",
    country: "🇧🇯 Bénin",
    author: "Modeste YABLA",
    upvotes: 210,
    installCmd: "npm i @devcom/ussd-engine",
    desc: "Framework robuste de routage de menus USSD multi-opérateurs (*345#) sans perte d'état de session.",
    code: `import { USSDRouter } from '@devcom/ussd-engine';

const router = new USSDRouter();
router.onRoot((session) => session.con("Bienvenue sur DevCom\\n1. Mon Solde\\n2. Bounties"));
router.onOption('1', (session) => session.end("Votre solde : 1,250 DP."));`,
    simulation: `[USSD-ROUTER] Passerelle USSD initialisée (*345#)...
[USER] Appel entrant : +229 97 12 34 56
[RESPONSE] CON Bienvenue sur DevCom\\n1. Mon Solde\\n2. Bounties
[INPUT] Touche '1' pressée...
[RESPONSE] END Votre solde : 1,250 DP.
[STATUS]  Session clôturée avec succès.`
  },
  {
    id: "sms-router",
    title: "devcom-sms-router",
    category: "security",
    lang: "Python",
    country: "🇹🇬 Togo",
    author: "Yao Mensah",
    upvotes: 89,
    installCmd: "pip install devcom-sms-router",
    desc: "Routeur intelligent d'envoi de SMS transactionnels minimisant les coûts télécoms au Bénin, Togo, CI et Sénégal.",
    code: `from devcom_sms_router import SmartSMSBroker

broker = SmartSMSBroker()
def send_otp(phone: str):
    return broker.dispatch_sms(destination=phone, message="Code : 928301")`,
    simulation: `[SMS-ROUTER] Analyse du numéro destinataire : +228 90 00 00 00 (Togo)
[ALGO] Détection de la route la plus économique...
[STATUS]  SMS expédié en 380ms. Code généré : 928301.`
  },
  {
    id: "flutter-pay",
    title: "flutter_african_pay",
    category: "mobile-money",
    lang: "Flutter",
    country: "🇳🇬 Nigeria",
    author: "Chukwudi Okafor",
    upvotes: 156,
    installCmd: "flutter pub add flutter_african_pay",
    desc: "Widget Flutter clé en main prenant en charge MTN MoMo, Wave, Orange Money et cartes bancaires africaines.",
    code: `import 'package:flutter_african_pay/flutter_african_pay.dart';

AfricanPaySheet.show(context, amount: 15000, currency: "XOF");`,
    simulation: `[FLUTTER-PAY] Affichage du composant Modal Bottom Sheet...
[UI] Rendu des logos MTN MoMo, Wave et Moov Money en SVG.
[CALLBACK] Validation de transaction #CI-994827 reçue !`
  }
];

// ==========================================================================
// 3. Données Bounties & Missions
// ==========================================================================
const BOUNTIES_LIST = [
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
    payoutMethod: "Virement / MoMo",
    desc: "Créer un middleware Next.js & FastAPI assurant la réplication automatique de documents et médias sur datacenters régionaux.",
    difficulty: "Avancé",
    applicants: 3,
    deadline: "20 nov. 2026",
    company: "CloudWest Africa"
  }
];

// ==========================================================================
// 4. Données Entraide & Développeurs
// ==========================================================================
const PEER_LIST = [
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

const DEVELOPERS_LIST = [
  {
    name: "Modeste YABLA",
    avatar: "MY",
    role: "Fullstack & Cloud Architect",
    country: "🇧🇯 Cotonou, Bénin",
    skills: ["TypeScript", "Next.js", "Python", "Mobile Money"],
    dp: 1250
  },
  {
    name: "Amina Diallo",
    avatar: "AD",
    role: "Mobile & Flutter Engineer",
    country: "🇸🇳 Dakar, Sénégal",
    skills: ["Flutter", "Dart", "IndexedDB", "PWA"],
    dp: 980
  },
  {
    name: "Emmanuel Kouassi",
    avatar: "EK",
    role: "Backend & Fintech Specialist",
    country: "🇨🇮 Abidjan, Côte d'Ivoire",
    skills: ["Python", "FastAPI", "Wave", "PostgreSQL"],
    dp: 1120
  },
  {
    name: "Chukwudi Okafor",
    avatar: "CO",
    role: "DevOps & Systems Engineer",
    country: "🇳🇬 Lagos, Nigeria",
    skills: ["Go", "Docker", "Kubernetes", "AWS/Cloud"],
    dp: 1450
  }
];

// ==========================================================================
// État Global
// ==========================================================================
let state = {
  components: [...COMPONENTS_LIST],
  bounties: [...BOUNTIES_LIST],
  peers: [...PEER_LIST],
  developers: [...DEVELOPERS_LIST],
  activeCat: "all",
  searchKeyword: "",
  activeSandboxComp: null,
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
  initDevSearch();
  initEventListeners();
});

// ==========================================================================
// Gestion du Thème Dark / Light
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem("devcom_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("devcom_theme", next);
      showToast(`Mode ${next === "dark" ? "Sombre" : "Clair"} activé`);
    });
  }
}

// ==========================================================================
// Moteur DevSearch (Signature DevBénin)
// ==========================================================================
function initDevSearch() {
  const input = document.getElementById("devsearch-query-input");
  const runBtn = document.getElementById("btn-run-devsearch");
  const resultBox = document.getElementById("devsearch-result-content");
  const resultStatus = document.getElementById("devsearch-result-status");

  function search(q) {
    if (!q || !q.trim()) return;
    const lower = q.toLowerCase();

    // Recherche dans la base DevSearch
    const match = DEVSEARCH_KB.find(item => 
      item.keywords.some(k => lower.includes(k)) || item.title.toLowerCase().includes(lower)
    );

    if (match) {
      resultStatus.textContent = `Résultat vérifié : ${match.framework}`;
      resultBox.innerHTML = `
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: var(--primary);">${escapeHtml(match.title)}</h4>
        <p style="margin-bottom: 12px; color: var(--text-muted); font-size: 0.92rem;">${escapeHtml(match.explanation)}</p>
        <div style="background: #08080A; border: 1px solid var(--border-glass); border-radius: var(--radius-sm); padding: 12px; font-family: var(--font-code); font-size: 0.82rem; color: var(--accent-cyan); overflow-x: auto;">
          <pre><code>${escapeHtml(match.code)}</code></pre>
        </div>
        <div style="margin-top: 12px; display: flex; justify-content: flex-end;">
          <button class="btn btn-xs btn-outline rounded-full" onclick="copyText('${escapeHtml(match.code.replace(/\n/g, '\\n').replace(/'/g, "\\'"))}')">Copier le code 📋</button>
        </div>
      `;
    } else {
      resultStatus.textContent = "Résultat issu de la communauté";
      resultBox.innerHTML = `
        <p>🔍 <strong>Recherche :</strong> "${escapeHtml(q)}"</p>
        <p style="color: var(--text-muted); margin-top: 6px;">Consultez la documentation détaillée ou posez votre question directement à la communauté dans l'onglet Entraide.</p>
      `;
    }
  }

  if (runBtn && input) {
    runBtn.addEventListener("click", () => search(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") search(input.value);
    });
  }

  document.querySelectorAll(".sugg-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.query;
      if (input) input.value = q;
      search(q);
    });
  });
}

// ==========================================================================
// Rendu Showroom Composants
// ==========================================================================
function renderComponents() {
  const container = document.getElementById("components-grid");
  if (!container) return;

  const filtered = state.components.filter(c => {
    if (state.activeCat !== "all" && c.category !== state.activeCat) return false;
    if (state.searchKeyword) {
      const q = state.searchKeyword.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.lang.toLowerCase().includes(q);
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
        <p style="color: var(--text-muted);">🔍 Aucun composant ne correspond à cette recherche.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(comp => `
    <article class="showroom-card">
      <div>
        <div class="showroom-top">
          <span class="tag-cat">${comp.category.toUpperCase()}</span>
          <span style="font-size: 0.8rem; color: var(--text-faint);">${comp.country}</span>
        </div>

        <h3 class="showroom-title">${escapeHtml(comp.title)}</h3>
        <p class="showroom-desc">${escapeHtml(comp.desc)}</p>

        <div class="cmd-strip">
          <code>${escapeHtml(comp.installCmd)}</code>
          <button class="copy-mini-btn" onclick="copyText('${escapeHtml(comp.installCmd)}')" title="Copier">📋</button>
        </div>
      </div>

      <div class="showroom-footer">
        <span class="author-txt">${escapeHtml(comp.author)} • ${comp.lang}</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-xs btn-outline rounded-full" onclick="handleUpvote('${comp.id}')">
            ▲ ${comp.upvotes}
          </button>
          <button class="btn btn-xs btn-primary rounded-full" onclick="openSandbox('${comp.id}')">
            Tester 🧪
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu Bounties
// ==========================================================================
function renderBounties() {
  const container = document.getElementById("bounties-grid");
  if (!container) return;

  container.innerHTML = state.bounties.map(b => `
    <article class="bounty-card-devbenin">
      <div>
        <div class="bounty-val-row">
          <span class="bounty-amount">${b.reward}</span>
          <span class="bounty-pill-pay">💳 ${b.payoutMethod}</span>
        </div>

        <h3 class="bounty-name">${escapeHtml(b.title)}</h3>
        <p class="bounty-text">${escapeHtml(b.desc)}</p>
      </div>

      <div class="bounty-row-footer">
        <span style="color: var(--text-faint);">⏳ ${b.deadline} • 👥 ${b.applicants} candidats</span>
        <button class="btn btn-sm btn-amber rounded-full" onclick="applyBounty('${escapeHtml(b.title)}')">
          Postuler ↗
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu Entraide & Troc
// ==========================================================================
function renderPeers() {
  const container = document.getElementById("peer-grid");
  if (!container) return;

  container.innerHTML = state.peers.map(p => `
    <article class="peer-card-box">
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <span class="tag-cat" style="background: var(--accent-cyan-bg); color: var(--accent-cyan);">${p.tag}</span>
          <span style="font-size: 0.8rem; color: var(--text-faint);">${p.country} • ${p.author}</span>
        </div>

        <h3 class="showroom-title">${escapeHtml(p.title)}</h3>
        <p class="showroom-desc">${escapeHtml(p.desc)}</p>

        <div class="deal-strip">
          <strong>Accord proposé :</strong> ${escapeHtml(p.deal)}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 8px; padding-top: 14px; border-top: 1px solid var(--border-glass);">
        <button class="btn btn-sm btn-outline rounded-full" onclick="openChat('${p.author}')">
          💬 Contacter
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu Développeurs
// ==========================================================================
function renderDevelopers() {
  const container = document.getElementById("devs-grid");
  if (!container) return;

  container.innerHTML = state.developers.map(d => `
    <article class="dev-avatar-box">
      <div class="dev-circle-lg">${d.avatar}</div>
      <h3 class="dev-name-title">${escapeHtml(d.name)}</h3>
      <p class="dev-role-txt">${escapeHtml(d.role)}</p>
      <div class="dev-country-txt">${d.country}</div>

      <div class="skills-tags-row">
        ${d.skills.map(s => `<span class="skill-micro-tag">${escapeHtml(s)}</span>`).join('')}
      </div>

      <div class="dev-box-footer">
        <span style="color: var(--primary); font-weight: 700; font-size: 0.82rem;">⚡ ${d.dp} DP</span>
        <button class="btn btn-xs btn-outline rounded-full" onclick="openChat('${escapeHtml(d.name)}')">
          Message
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Bac à Sable / Testeur de Code
// ==========================================================================
window.openSandbox = function(id) {
  const comp = state.components.find(c => c.id === id);
  if (!comp) return;

  state.activeSandboxComp = comp;
  document.getElementById("sandbox-title").textContent = comp.title;
  document.getElementById("sandbox-meta").textContent = `${comp.lang} • ${comp.country} • Par ${comp.author}`;
  document.getElementById("sandbox-lang-tag").textContent = comp.lang;
  document.getElementById("sandbox-code-view").textContent = comp.code;
  document.getElementById("sandbox-console-output").textContent = "Cliquez sur « Exécuter » pour simuler l'exécution du composant...";

  const modal = document.getElementById("sandbox-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

function closeSandbox() {
  const modal = document.getElementById("sandbox-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Messagerie Directe
// ==========================================================================
window.openChat = function(recipientName) {
  state.activeChatRecipient = recipientName;
  document.getElementById("chat-recipient-name").textContent = recipientName;
  document.getElementById("chat-input").placeholder = `Écrire un message à ${recipientName.split(' ')[0]}...`;

  const drawer = document.getElementById("chat-drawer");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");

  const dot = document.getElementById("unread-dot");
  if (dot) dot.style.display = "none";
};

function closeChat() {
  const drawer = document.getElementById("chat-drawer");
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

// ==========================================================================
// Modal Multi-Types : Créer un Échange
// ==========================================================================
window.openCreateModal = function(type = "component") {
  state.modalType = type;
  document.querySelectorAll(".type-tab-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.type-tab-btn[data-type="${type}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  updateModalFields(type);

  const modal = document.getElementById("create-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

function closeCreateModal() {
  const modal = document.getElementById("create-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function updateModalFields(type) {
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
    labelCode.textContent = "Cahier des charges & Livrables";
    inputCode.placeholder = "Détaillez le travail attendu...";
  } else if (type === "help") {
    labelExtra.textContent = "Ce que vous offrez en contrepartie";
    inputExtra.placeholder = "Ex: 2h de revue de code, mentorat...";
    labelCode.textContent = "Détail du besoin technique";
    inputCode.placeholder = "Expliquez le problème à résoudre...";
  }
}

// ==========================================================================
// Gestionnaires d'Événements
// ==========================================================================
function initEventListeners() {
  // Filtres Catégories
  document.querySelectorAll("#category-filter-pills .pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#category-filter-pills .pill-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeCat = btn.dataset.cat;
      renderComponents();
    });
  });

  // Recherche Composants
  const compSearch = document.getElementById("component-search-input");
  if (compSearch) {
    compSearch.addEventListener("input", (e) => {
      state.searchKeyword = e.target.value.trim();
      renderComponents();
    });
  }

  // Modales & Bac à sable
  const closeSandboxBtn = document.getElementById("close-sandbox-btn");
  if (closeSandboxBtn) closeSandboxBtn.addEventListener("click", closeSandbox);

  const copyCodeBtn = document.getElementById("btn-copy-code");
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", () => {
      if (state.activeSandboxComp) {
        copyText(state.activeSandboxComp.code);
      }
    });
  }

  const runSandboxBtn = document.getElementById("btn-run-sandbox");
  if (runSandboxBtn) {
    runSandboxBtn.addEventListener("click", () => {
      const out = document.getElementById("sandbox-console-output");
      out.textContent = "⏳ Exécution du conteneur de simulation en cours...";
      setTimeout(() => {
        if (state.activeSandboxComp && state.activeSandboxComp.simulation) {
          out.textContent = state.activeSandboxComp.simulation;
        } else {
          out.textContent = "[SUCCESS] Exécution complétée sans erreur.";
        }
        showToast("Simulation complétée avec succès !");
      }, 400);
    });
  }

  // Messagerie
  const btnOpenMsg = document.getElementById("btn-open-messages");
  if (btnOpenMsg) btnOpenMsg.addEventListener("click", () => openChat("Amina Diallo"));

  const closeChatBtn = document.getElementById("close-chat-btn");
  if (closeChatBtn) closeChatBtn.addEventListener("click", closeChat);

  document.querySelectorAll(".contact-pill").forEach(p => {
    p.addEventListener("click", () => {
      document.querySelectorAll(".contact-pill").forEach(pill => pill.classList.remove("active"));
      p.classList.add("active");
      openChat(p.dataset.user);
    });
  });

  const chatForm = document.getElementById("chat-form");
  if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("chat-input");
      const msg = input.value.trim();
      if (!msg) return;

      const flow = document.getElementById("chat-messages-flow");
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const bubble = document.createElement("div");
      bubble.className = "chat-msg msg-out";
      bubble.innerHTML = `
        <div class="msg-author">Moi</div>
        <div class="msg-bubble">${escapeHtml(msg)}</div>
        <div class="msg-timestamp">${timeStr}</div>
      `;
      flow.appendChild(bubble);
      input.value = "";
      flow.scrollTop = flow.scrollHeight;

      // Réponse automatique
      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "chat-msg msg-in";
        reply.innerHTML = `
          <div class="msg-author">${state.activeChatRecipient}</div>
          <div class="msg-bubble">Parfait ! J'ai bien reçu ton message, je jette un coup d'œil et je te réponds avec les précisions techniques.</div>
          <div class="msg-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        flow.appendChild(reply);
        flow.scrollTop = flow.scrollHeight;
      }, 1000);
    });
  }

  // Modal Création
  const closeCreateBtn = document.getElementById("close-create-btn");
  const cancelCreateBtn = document.getElementById("btn-cancel-create");
  if (closeCreateBtn) closeCreateBtn.addEventListener("click", closeCreateModal);
  if (cancelCreateBtn) cancelCreateBtn.addEventListener("click", closeCreateModal);

  document.querySelectorAll(".type-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.modalType = btn.dataset.type;
      updateModalFields(btn.dataset.type);
    });
  });

  const formCreate = document.getElementById("create-exchange-form");
  if (formCreate) {
    formCreate.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("form-title").value.trim();
      const cat = document.getElementById("form-category").value;
      const extra = document.getElementById("form-extra").value.trim();
      const desc = document.getElementById("form-desc").value.trim();
      const codeOrDetails = document.getElementById("form-code").value.trim();

      if (state.modalType === "component") {
        const newComp = {
          id: "comp-" + Date.now(),
          title: title,
          category: cat,
          lang: extra,
          country: "🇧🇯 Bénin",
          author: "Modeste YABLA",
          upvotes: 1,
          installCmd: `npm i @devcom/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          desc: desc,
          code: codeOrDetails,
          simulation: `[DEVCOM] Exécution du module réussie.`
        };
        state.components.unshift(newComp);
        renderComponents();
        showToast("Composant publié avec succès sur DevCom Africa !");
      } else if (state.modalType === "bounty") {
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
        state.bounties.unshift(newBounty);
        renderBounties();
        showToast("Bounty publié et ouvert aux candidatures !");
      } else if (state.modalType === "help") {
        const newPeer = {
          id: "peer-" + Date.now(),
          author: "Modeste YABLA",
          country: "🇧🇯 Bénin",
          tag: "Troc Technique",
          title: title,
          desc: desc,
          deal: extra
        };
        state.peers.unshift(newPeer);
        renderPeers();
        showToast("Demande d'entraide publiée dans le flux !");
      }

      formCreate.reset();
      closeCreateModal();
    });
  }

  // Menu Mobile
  const mobileToggle = document.getElementById("mobile-toggle-btn");
  const navMenu = document.getElementById("nav-menu");
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const isVisible = navMenu.style.display === "flex";
      navMenu.style.display = isVisible ? "none" : "flex";
      navMenu.style.flexDirection = "column";
      navMenu.style.position = "absolute";
      navMenu.style.top = "70px";
      navMenu.style.left = "0";
      navMenu.style.right = "0";
      navMenu.style.background = "var(--bg-card)";
      navMenu.style.padding = "20px";
      navMenu.style.borderBottom = "1px solid var(--border-glass)";
    });
  }
}

// ==========================================================================
// Utilitaires
// ==========================================================================
window.handleUpvote = function(id) {
  const comp = state.components.find(c => c.id === id);
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
  const email = prompt(`Postuler au bounty :\n"${title}"\n\nIndiquez votre email ou identifiant GitHub :`);
  if (email) {
    showToast(`Candidature envoyée pour "${title.slice(0, 25)}..." !`);
  }
};

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
    t.style.transform = "translateY(20px)";
    t.style.transition = "all 0.25s ease";
    setTimeout(() => t.remove(), 250);
  }, 3000);
}
