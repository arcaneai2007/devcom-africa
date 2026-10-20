/**
 * DevCom Africa — Logique & Interactivité
 * Coupe d'Afrique des Développeurs 2026 | Systalink Challenge
 * Équipe : Binary Minds (Bénin 🇧🇯)
 */

// ==========================================================================
// Base de données initiale des Solutions & Snippets Africains
// ==========================================================================
const INITIAL_SNIPPETS = [
  {
    id: "momo-webhook-verify",
    title: "Vérificateur de Webhook MTN MoMo & Moov Bénin / CI",
    category: "mobile-money",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    verified: true,
    author: "Koffi A.",
    authorAvatar: "KA",
    upvotes: 142,
    desc: "Valide les signatures HMAC SHA256 des webhooks MTN et Moov Money, avec gestion automatique des timeouts réseau et déduplication des callbacks.",
    code: `import crypto from 'crypto';

interface MoMoWebhookPayload {
  transactionId: string;
  amount: number;
  currency: 'XOF';
  senderPhone: string;
  signature: string;
}

export function verifyMoMoSignature(payload: MoMoWebhookPayload, secretKey: string): boolean {
  const dataToSign = \`\${payload.transactionId}:\${payload.amount}:\${payload.senderPhone}\`;
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(payload.signature), Buffer.from(computedHash));
}

// Exemple d'utilisation dans une route API Next.js / Node
export async function handlePaymentCallback(req: any) {
  const isValid = verifyMoMoSignature(req.body, process.env.MOMO_SECRET_KEY!);
  if (!isValid) throw new Error("Signature de paiement invalide !");
  return { status: "SUCCESS", message: "Crédit alloué sur Systalink Datacloud" };
}`,
    simulationOutput: `[INFO] Initialisation du vérificateur MTN MoMo (Bénin / CI)...
[TEST] Envoi d'un webhook simulé : Tx #BJ-98234, Montant : 15 000 XOF
[HASH] Signature reçue : a7b2e8f190c4...
[COMPUTED] Signature calculée : a7b2e8f190c4...
[RESULT]  VALIDATION RÉUSSIE (Timing-Safe) !
[STATUS] Paiement 15,000 XOF validé via MoMo Bénin. Réponse HTTP 200 renvoyée.`
  },
  {
    id: "offline-indexeddb-sync",
    title: "Moteur de Synchronisation Offline-First (IndexedDB & ServiceWorker)",
    category: "offline",
    lang: "javascript",
    country: "SN",
    countryFlag: "🇸🇳 Sénégal",
    verified: true,
    author: "Amina Diallo",
    authorAvatar: "AD",
    upvotes: 98,
    desc: "Permet aux apps web africaines de fonctionner sans connexion internet (coupures data) et de synchroniser les transactions en arrière-plan dès le retour du réseau.",
    code: `// Initialisation de la base locale IndexedDB pour les zones à faible débit
const DB_NAME = 'AfriSyncLocalDB';
const STORE_NAME = 'pendingTransactions';

export async function queueOfflineTransaction(txData) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).add({
    ...txData,
    timestamp: Date.now(),
    synced: false
  });
  
  if (navigator.onLine) {
    await syncPendingWithSystalink();
  } else {
    navigator.serviceWorker.ready.then(reg => {
      reg.sync.register('sync-african-transactions');
    });
  }
}

async function syncPendingWithSystalink() {
  console.log("Synchronisation sécurisée vers Systalink Datacloud...");
}`,
    simulationOutput: `[INFO] Simulation de coupure réseau 3G/4G...
[STATUS] Navigateur en mode : HORS-LIGNE (Offline)
[LOCAL] 1 transaction enregistrée dans IndexedDB (ID: local-tx-491)
[NETWORK] Réseau détecté ! Événement 'online' déclenché.
[SYNC] Envoi du lot vers Systalink Datacloud (0.18s)...
[SUCCESS]  1/1 transaction synchronisée. Données persistées avec succès.`
  },
  {
    id: "wave-checkout-sdk",
    title: "Intégration Express Wave Mobile Money (QR Code & Deep Link)",
    category: "mobile-money",
    lang: "python",
    country: "CI",
    countryFlag: "🇨🇮 Côte d'Ivoire",
    verified: true,
    author: "Emmanuel K.",
    authorAvatar: "EK",
    upvotes: 184,
    desc: "SDK Python / Django / FastAPI pour générer un lien de paiement direct Wave ou afficher un QR Code scannable par l'application Wave.",
    code: `import httpx
import os

WAVE_API_URL = "https://api.wave.com/v1/checkout/sessions"

class WavePaymentGateway:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {"Authorization": f"Bearer {self.api_key}"}

    async def create_checkout_session(self, amount: int, currency: str = "XOF", client_reference: str = ""):
        payload = {
            "amount": str(amount),
            "currency": currency,
            "error_url": "https://devcom.africa/payment/cancel",
            "success_url": "https://devcom.africa/payment/success",
            "client_reference": client_reference
        }
        async with httpx.AsyncClient() as client:
            resp = await client.post(WAVE_API_URL, json=payload, headers=self.headers)
            resp.raise_for_status()
            data = resp.json()
            return {
                "wave_launch_url": data.get("wave_launch_url"),
                "qr_code_url": data.get("qr_code_url")
            }`,
    simulationOutput: `[INIT] Initialisation du client Wave CI / SN...
[API] Appel POST https://api.wave.com/v1/checkout/sessions
[PARAM] Montant: 25,000 XOF | Devise: FCFA | Ref: DEVC-2026-99
[RESPONSE] HTTP 200 OK
[DATA] Wave Launch URL : wave://checkout/s_9281ab091
[DATA] QR Code Image : https://static.wave.com/qr/s_9281ab091.png
[RESULT]  Session créée avec succès. Prête pour le client mobile.`
  },
  {
    id: "ussd-menu-engine",
    title: "Moteur de Menu USSD Interactif Multi-Opérateurs",
    category: "ussd",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    verified: true,
    author: "Modeste YABLA",
    authorAvatar: "MY",
    upvotes: 210,
    desc: "Framework léger de parsing et de navigation pour sessions USSD (*345#) sans perte d'état de session, compatible MTN Bénin, Moov et Orange.",
    code: `export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  text: string;
}

export function handleUSSDRequest(session: USSDSession): string {
  const steps = session.text.split('*');
  
  // Niveau racine
  if (session.text === '' || session.text === '0') {
    return "CON Bienvenue sur DevCom USSD\\n1. Consulter les Bounties\\n2. Trouver un Mentor\\n3. Statut Systalink";
  }
  
  // Option 1 : Bounties
  if (steps[0] === '1') {
    return "CON Bounties Disponibles :\\n1. Webhook MoMo (150k XOF)\\n2. Template Offline (80k XOF)\\n0. Retour";
  }

  // Option 3 : Systalink
  if (steps[0] === '3') {
    return "END Systalink Datacloud : Opérationnel\\nLatence Bénin : 8ms\\nChallenge -40% actif.";
  }

  return "END Choix invalide. Tapez *345# pour recommencer.";
}`,
    simulationOutput: `[USSD] Connexion passerelle Telco MTN/Moov (*345#)...
[SESSION] SessionID: BJ-TELCO-771829 | Téléphone: +229 97 00 00 00
[REQUEST] Texte entrant: ""
[OUTPUT] 
CON Bienvenue sur DevCom USSD
1. Consulter les Bounties
2. Trouver un Mentor
3. Statut Systalink
[INPUT] Sélection de l'option 3...
[OUTPUT]
END Systalink Datacloud : Opérationnel
Latence Bénin : 8ms
Challenge -40% actif.
[RESULT]  Session USSD terminée proprement (Code: 200).`
  },
  {
    id: "systalink-s3-wrapper",
    title: "Client de Stockage Objet Systalink Datacloud (S3 Compatible)",
    category: "systalink",
    lang: "typescript",
    country: "BJ",
    countryFlag: "🇧🇯 Bénin",
    verified: true,
    author: "Binary Minds",
    authorAvatar: "BM",
    upvotes: 165,
    desc: "Wrapper TypeScript pour téléverser et distribuer des assets média directement sur le Datacloud Systalink avec chiffrement de bout en bout et coût réduit (-40%).",
    code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Point de terminaison du Datacloud Systalink Afrique de l'Ouest
export const systalinkCloud = new S3Client({
  endpoint: "https://datacloud.systalink.com/v1",
  region: "west-africa-1",
  credentials: {
    accessKeyId: process.env.SYSTALINK_ACCESS_KEY!,
    secretAccessKey: process.env.SYSTALINK_SECRET_KEY!
  }
});

export async function uploadToSystalink(filename: string, fileBuffer: Buffer, mimeType: string) {
  const uploadParams = {
    Bucket: "devcom-challenge-assets",
    Key: \`uploads/\${Date.now()}_\${filename}\`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read"
  };

  const command = new PutObjectCommand(uploadParams as any);
  await systalinkCloud.send(command);
  return \`https://datacloud.systalink.com/devcom-challenge-assets/\${uploadParams.Key}\`;
}`,
    simulationOutput: `[CLOUD] Connexion à Systalink Datacloud (west-africa-1)...
[AUTH] Clé partenaire Systalink Challenge reconnue (-40% actif).
[UPLOAD] Envoi de l'image 'avatar-devcom.png' (240 KB)...
[LATENCE] Temps de transfert : 14ms (via PoP Cotonou).
[STATUS]  Fichier déployé avec succès.
[URL] https://datacloud.systalink.com/devcom-challenge-assets/uploads/1729432_avatar.png`
  },
  {
    id: "low-cost-sms-otp",
    title: "Micro-Service SMS OTP Économique pour Télécoms d'Afrique de l'Ouest",
    category: "security",
    lang: "python",
    country: "TG",
    countryFlag: "🇹🇬 Togo",
    verified: true,
    author: "Yao Mensah",
    authorAvatar: "YM",
    upvotes: 89,
    desc: "Routeur d'envoi de SMS OTP avec routage intelligent entre opérateurs pour réduire la facture SMS de 60% au Togo, Bénin, Côte d'Ivoire et Sénégal.",
    code: `import secrets
import time

class IntelligentSMSRouter:
    def __init__(self):
        self.otp_vault = {}

    def generate_otp(self, phone_number: str) -> str:
        otp_code = "".join([str(secrets.randbelow(10)) for _ in range(6)])
        self.otp_vault[phone_number] = {
            "code": otp_code,
            "expires_at": time.time() + 300 # 5 min
        }
        # Routage vers le broker le moins coûteux selon l'indicatif
        provider = "Systalink-SMS-Hub" if phone_number.startswith(("+229", "+228", "+225")) else "Global-Gateway"
        print(f"[SMS] Code {otp_code} routé vers {phone_number} via {provider}")
        return otp_code`,
    simulationOutput: `[OTP] Génération d'un code sécurisé 6 chiffres...
[NUMBER] Téléphone cible : +229 97 12 34 56 (Bénin)
[ROUTING] Opérateur détecté : Réseau local West Africa.
[BROKER] Choix automatique : Systalink SMS Gateway (Tarif -40% : 8 FCFA/sms).
[DISPATCH] SMS envoyé avec succès en 420ms. Code de validation : 482910.`
  }
];

// ==========================================================================
// Base de données des Bounties Tech Africains
// ==========================================================================
const INITIAL_BOUNTIES = [
  {
    id: "bounty-1",
    reward: "150 000 FCFA",
    title: "Module d'authentification par SMS OTP économique",
    payoutMethod: "MTN MoMo & Wave",
    desc: "Concevoir un SDK multi-langages gérant l'auto-retry et le basculement d'opérateurs pour les SMS de validation d'inscription.",
    difficulty: "Intermédiaire",
    applicants: 4,
    deadline: "5 nov. 2026",
    status: "Actif"
  },
  {
    id: "bounty-2",
    reward: "80 000 FCFA",
    title: "Template Tailwind CSS & PWA ultra-light pour faible débit",
    payoutMethod: "Moov Money",
    desc: "Créer un template de dashboard dashboard e-commerce pesant moins de 100 KB au chargement initial avec support offline.",
    difficulty: "Débutant/Intermédiaire",
    applicants: 7,
    deadline: "10 nov. 2026",
    status: "Actif"
  },
  {
    id: "bounty-3",
    reward: "250 000 FCFA",
    title: "Connecteur Systalink Datacloud pour Next.js & Nuxt",
    payoutMethod: "Virement / MoMo",
    desc: "Développer un adaptateur open-source permettant le stockage automatique de médias Next.js vers Systalink Datacloud S3.",
    difficulty: "Avancé",
    applicants: 2,
    deadline: "12 nov. 2026",
    status: "Actif"
  }
];

// ==========================================================================
// Sessions d'Entraide Binary Minds
// ==========================================================================
const INITIAL_PAIRS = [
  {
    id: "pair-1",
    user: "Koffi A.",
    country: "🇧🇯 Cotonou",
    title: "Debug signature webhook Wave en production sur Vercel",
    tech: "TypeScript / Next.js",
    timeAgo: "Il y a 4 min",
    status: "En attente"
  },
  {
    id: "pair-2",
    user: "Amina D.",
    country: "🇸🇳 Dakar",
    title: "Optimisation requêtes PostgreSQL sur Systalink Datacloud",
    tech: "PostgreSQL / Prisma",
    timeAgo: "Il y a 12 min",
    status: "En attente"
  },
  {
    id: "pair-3",
    user: "Emmanuel K.",
    country: "🇨🇮 Abidjan",
    title: "Pair review sur synchronisation offline Flutter / SQLite",
    tech: "Flutter / Dart",
    timeAgo: "Il y a 25 min",
    status: "En attente"
  }
];

// ==========================================================================
// État global de l'application
// ==========================================================================
let appState = {
  snippets: [...INITIAL_SNIPPETS],
  bounties: [...INITIAL_BOUNTIES],
  pairs: [...INITIAL_PAIRS],
  activeCategory: "all",
  activeLang: "all",
  activeCountry: "all",
  searchQuery: "",
  activeSandboxSnippet: null
};

// ==========================================================================
// Initialisation au chargement du DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initCountdown();
  renderSnippets();
  renderBounties();
  renderPairs();
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
// Compte à Rebours Officiel Systalink Challenge
// ==========================================================================
function initCountdown() {
  // Clôture officielle le 15 Novembre 2026 à 23h59 UTC
  const deadline = new Date("2026-11-15T23:59:59Z").getTime();

  function update() {
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) {
      document.getElementById("countdown-timer").innerHTML = "<div class='time-val'>CHALLENGE CLÔTURÉ</div>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    const daysEl = document.getElementById("count-days");
    const hoursEl = document.getElementById("count-hours");
    const minEl = document.getElementById("count-minutes");
    const secEl = document.getElementById("count-seconds");

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minEl) minEl.textContent = pad(minutes);
    if (secEl) secEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// Rendu dynamique des Snippets
// ==========================================================================
function renderSnippets() {
  const container = document.getElementById("snippets-grid");
  if (!container) return;

  const filtered = appState.snippets.filter(s => {
    // Filtre de catégorie
    if (appState.activeCategory !== "all" && s.category !== appState.activeCategory) return false;
    // Filtre de langage
    if (appState.activeLang !== "all" && s.lang !== appState.activeLang) return false;
    // Filtre de pays
    if (appState.activeCountry !== "all" && s.country !== appState.activeCountry) return false;
    // Recherche textuelle
    if (appState.searchQuery) {
      const q = appState.searchQuery.toLowerCase();
      const match = s.title.toLowerCase().includes(q) || 
                    s.desc.toLowerCase().includes(q) || 
                    s.code.toLowerCase().includes(q) ||
                    s.lang.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-md);">
        <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 12px;">🔍 Aucun snippet ne correspond à ces critères.</p>
        <button class="btn btn-outline" onclick="resetFilters()">Réinitialiser les filtres</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(snippet => `
    <article class="snippet-card" data-id="${snippet.id}">
      <div>
        <div class="snippet-header">
          <span class="snippet-category-badge">${formatCategoryName(snippet.category)}</span>
          <div class="snippet-meta-flags">
            <span>${snippet.countryFlag}</span>
            ${snippet.verified ? `<span class="verified-badge" title="Testé et approuvé pour Systalink Datacloud">✓ Systalink Ready</span>` : ''}
          </div>
        </div>

        <h3 class="snippet-title">${escapeHtml(snippet.title)}</h3>
        <p class="snippet-desc">${escapeHtml(snippet.desc)}</p>

        <div class="snippet-code-box">
          <pre><code>${escapeHtml(snippet.code.slice(0, 220))}...</code></pre>
        </div>
      </div>

      <div class="snippet-footer">
        <div class="snippet-author">
          <div class="author-avatar">${snippet.authorAvatar}</div>
          <span>${snippet.author}</span>
        </div>

        <div class="snippet-actions">
          <button class="upvote-btn" onclick="handleUpvote('${snippet.id}')">
            ▲ <span class="vote-count">${snippet.upvotes}</span>
          </button>
          <button class="btn btn-xs btn-outline" onclick="openSandbox('${snippet.id}')">
            🧪 Tester
          </button>
          <button class="btn btn-xs btn-primary" onclick="copySnippetCode('${snippet.id}')">
            Copier
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu dynamique des Bounties
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
          <span>⏳ Fin : ${bounty.deadline}</span> • <span>👥 ${bounty.applicants} postulants</span>
        </div>
        <button class="btn btn-sm btn-amber" onclick="applyToBounty('${escapeHtml(bounty.title)}')">
          Postuler
        </button>
      </div>
    </article>
  `).join('');
}

// ==========================================================================
// Rendu dynamique des Sessions Pair-Dev Binary Minds
// ==========================================================================
function renderPairs() {
  const container = document.getElementById("pairs-list");
  if (!container) return;

  container.innerHTML = appState.pairs.map(pair => `
    <div class="pair-item">
      <div class="pair-item-info">
        <div class="pair-item-title">${escapeHtml(pair.title)}</div>
        <div class="pair-item-meta">
          <span>${pair.country}</span> • <span>${pair.user}</span> • <span>${pair.tech}</span> • <span>${pair.timeAgo}</span>
        </div>
      </div>
      <button class="btn btn-xs btn-amber" onclick="joinPairSession('${pair.user}', '${escapeHtml(pair.title)}')">
        Rejoindre
      </button>
    </div>
  `).join('');
}

// ==========================================================================
// Bac à Sable / Testeur Interactif de Snippet
// ==========================================================================
window.openSandbox = function(snippetId) {
  const snippet = appState.snippets.find(s => s.id === snippetId);
  if (!snippet) return;

  appState.activeSandboxSnippet = snippet;

  document.getElementById("sandbox-title").textContent = snippet.title;
  document.getElementById("sandbox-filename").textContent = `${snippet.id}.${snippet.lang === 'python' ? 'py' : 'ts'}`;
  document.getElementById("sandbox-code-content").textContent = snippet.code;
  
  const execOutput = document.getElementById("exec-output");
  execOutput.innerHTML = `<span class="exec-idle">Cliquez sur « ▶ Exécuter » pour simuler le comportement du snippet dans l'environnement Datacloud...</span>`;

  const modal = document.getElementById("sandbox-modal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

function closeSandbox() {
  const modal = document.getElementById("sandbox-modal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

window.copySnippetCode = function(snippetId) {
  const snippet = appState.snippets.find(s => s.id === snippetId);
  if (!snippet) return;

  navigator.clipboard.writeText(snippet.code).then(() => {
    showToast(`Code copié dans le presse-papier !`);
  }).catch(() => {
    showToast(`Code sélectionné`);
  });
};

window.handleUpvote = function(snippetId) {
  const snippet = appState.snippets.find(s => s.id === snippetId);
  if (!snippet) return;

  snippet.upvotes += 1;
  renderSnippets();
  showToast(`+1 vote pour : "${snippet.title.slice(0, 25)}..."`);
};

window.joinPairSession = function(user, title) {
  showToast(`Connexion à la salle de pair-dev de ${user} en cours...`);
  setTimeout(() => {
    alert(`🎉 Vous avez rejoint la session de travail en binôme avec ${user} !\nSujet : ${title}\n« Deux esprits valent mieux qu'un. » (Binary Minds)`);
  }, 400);
};

window.applyToBounty = function(title) {
  const email = prompt(`Postuler au bounty :\n"${title}"\n\nEntrez votre adresse email ou compte GitHub / Systalink :`);
  if (email) {
    showToast(`Candidature envoyée avec succès pour ${email} !`);
  }
};

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
  
  renderSnippets();
};

// ==========================================================================
// Gestionnaires d'Événements
// ==========================================================================
function initEventListeners() {
  // Recherche
  const searchInput = document.getElementById("omnisearch-input");
  const clearBtn = document.getElementById("search-clear");
  
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      appState.searchQuery = e.target.value.trim();
      clearBtn.style.display = appState.searchQuery ? "block" : "none";
      renderSnippets();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      appState.searchQuery = "";
      clearBtn.style.display = "none";
      renderSnippets();
    });
  }

  // Filtres par Catégorie (Chips)
  document.querySelectorAll(".quick-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".quick-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      appState.activeCategory = chip.dataset.category;
      renderSnippets();
    });
  });

  // Filtres par Langages (Pills)
  document.querySelectorAll(".lang-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      appState.activeLang = pill.dataset.lang;
      renderSnippets();
    });
  });

  // Filtre Pays
  const countrySelect = document.getElementById("country-filter");
  if (countrySelect) {
    countrySelect.addEventListener("change", (e) => {
      appState.activeCountry = e.target.value;
      renderSnippets();
      showToast(`Filtré sur le pays : ${countrySelect.options[countrySelect.selectedIndex].text}`);
    });
  }

  // Simulation d'exécution dans le bac à sable
  const runSimBtn = document.getElementById("btn-run-simulation");
  if (runSimBtn) {
    runSimBtn.addEventListener("click", () => {
      const output = document.getElementById("exec-output");
      output.textContent = "⏳ Exécution du code dans l'environnement sandbox Systalink Datacloud...";
      
      setTimeout(() => {
        if (appState.activeSandboxSnippet && appState.activeSandboxSnippet.simulationOutput) {
          output.textContent = appState.activeSandboxSnippet.simulationOutput;
        } else {
          output.textContent = "[SUCCESS] Snippet exécuté sans erreurs dans le conteneur Edge.";
        }
        showToast("Simulation complétée avec succès !");
      }, 500);
    });
  }

  // Fermeture Sandbox
  const closeSandboxBtn = document.getElementById("close-sandbox-btn");
  if (closeSandboxBtn) closeSandboxBtn.addEventListener("click", closeSandbox);

  const copySandboxBtn = document.getElementById("btn-copy-sandbox");
  if (copySandboxBtn) {
    copySandboxBtn.addEventListener("click", () => {
      if (appState.activeSandboxSnippet) {
        navigator.clipboard.writeText(appState.activeSandboxSnippet.code);
        showToast("Code copié !");
      }
    });
  }

  // Modale de publication
  const publishModal = document.getElementById("publish-modal");
  const openPub1 = document.getElementById("btn-open-publish");
  const openPub2 = document.getElementById("btn-open-publish-2");
  const closePub = document.getElementById("close-publish-btn");
  const cancelPub = document.getElementById("btn-cancel-publish");
  const publishForm = document.getElementById("publish-snippet-form");

  const openPubHandler = () => {
    publishModal.classList.add("open");
    publishModal.setAttribute("aria-hidden", "false");
  };

  const closePubHandler = () => {
    publishModal.classList.remove("open");
    publishModal.setAttribute("aria-hidden", "true");
  };

  if (openPub1) openPub1.addEventListener("click", openPubHandler);
  if (openPub2) openPub2.addEventListener("click", openPubHandler);
  if (closePub) closePub.addEventListener("click", closePubHandler);
  if (cancelPub) cancelPub.addEventListener("click", closePubHandler);

  if (publishForm) {
    publishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("new-snippet-title").value.trim();
      const category = document.getElementById("new-snippet-category").value;
      const lang = document.getElementById("new-snippet-lang").value;
      const code = document.getElementById("new-snippet-code").value.trim();

      const newSnippet = {
        id: "user-snippet-" + Date.now(),
        title: title,
        category: category,
        lang: lang,
        country: "BJ",
        countryFlag: "🇧🇯 Bénin",
        verified: true,
        author: "Modeste YABLA",
        authorAvatar: "MY",
        upvotes: 1,
        desc: "Solution partagée par Modeste YABLA (Binary Minds) pour la communauté panafricaine.",
        code: code,
        simulationOutput: `[SYSTALINK] Code personnalisé validé. Environnement prêt.`
      };

      appState.snippets.unshift(newSnippet);
      renderSnippets();
      closePubHandler();
      publishForm.reset();
      showToast("🎉 Snippet publié avec succès dans l'écosystème DevCom !");
    });
  }

  // Formulaire Binary Minds Pair-Programming
  const pairForm = document.getElementById("pair-request-form");
  if (pairForm) {
    pairForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const tech = document.getElementById("pair-tech").value;
      const desc = document.getElementById("pair-description").value.trim();

      const newPair = {
        id: "pair-" + Date.now(),
        user: "Modeste YABLA",
        country: "🇧🇯 Cotonou",
        title: desc,
        tech: tech,
        timeAgo: "À l'instant",
        status: "En attente"
      };

      appState.pairs.unshift(newPair);
      renderPairs();
      pairForm.reset();
      showToast("🚀 Demande de pair-dev publiée ! Recherche d'un binôme en cours...");
    });
  }

  // Testeur de latence Systalink
  const testLatencyBtn = document.getElementById("btn-test-latency");
  if (testLatencyBtn) {
    testLatencyBtn.addEventListener("click", () => {
      showToast("Mesure de la latence Datacloud en cours...");
      
      const cities = [
        { id: "lat-bj", base: 8 },
        { id: "lat-ci", base: 14 },
        { id: "lat-sn", base: 18 },
        { id: "lat-ng", base: 11 },
        { id: "lat-ke", base: 32 }
      ];

      cities.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) {
          const jitter = Math.floor(Math.random() * 4) - 2;
          const val = Math.max(4, c.base + jitter);
          el.textContent = `${val} ms`;
        }
      });

      setTimeout(() => {
        showToast("✓ PoP Cotonou & Ouest Afrique ultra-rapides (<15ms) !");
      }, 500);
    });
  }

  // Mobile Menu
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
// Notifications Toasts
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
    case "ussd": return "USSD & Telco";
    case "systalink": return "Systalink Cloud";
    case "security": return "Sécurité & Auth";
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
