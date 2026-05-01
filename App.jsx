import { useState, useRef, useCallback, useEffect } from "react";

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const LANGS = {
  en: { label: "English", flag: "🇺🇸", enabled: true },
  es: { label: "Español", flag: "🇪🇸", enabled: true },
  pt: { label: "Português", flag: "🇧🇷", enabled: true },
  fr: { label: "Français", flag: "🇫🇷", enabled: true },
  // Wave 2 — disabled until verified translations ready
  hi: { label: "हिन्दी", flag: "🇮🇳", enabled: false },
  id: { label: "Bahasa", flag: "🇮🇩", enabled: false },
  // Wave 3 — disabled until verified translations ready
  ja: { label: "日本語", flag: "🇯🇵", enabled: false },
  ko: { label: "한국어", flag: "🇰🇷", enabled: false },
  tl: { label: "Filipino", flag: "🇵🇭", enabled: false },
};

const T = {
  en: {
    tagline: "AI Deepfake Video Scanner",
    eyebrow: "Paste. Scan. Share the truth.",
    heroTitle1: "Is this video",
    heroTitle2: "real or fake?",
    heroSub: "Paste a Facebook URL or upload any video file — get an instant AI authenticity verdict in seconds.",
    howTitle: "How it works",
    how1Title: "Upload your video",
    how1Desc: "Drag and drop any video file up to 250MB. MP4, MOV, WebM, AVI all supported.",
    how2Title: "AI scans 8 signals",
    how2Desc: "Our model extracts key frames and analyzes facial artifacts, eye reflections, lip sync, skin texture and more.",
    how3Title: "Get your verdict",
    how3Desc: "Receive an instant authenticity verdict with confidence score, signal breakdown, and a clear explanation in your language.",
    accuracy: "Detects most deepfakes & AI manipulation",
    accuracySub: "High-quality Veo/Sora remains an evolving challenge",
    scansLabel: "videos analyzed",
    tabFile: "Upload File",
    tabUrl: "Paste URL",
    dropTitle: "Drop your video here",
    dropSub: "or click to browse files",
    dropFormats: "MP4 · MOV · WebM · AVI · up to 250MB",
    dropTip: "Have a TikTok, YouTube, Instagram or WhatsApp video? Download it and drop it here.",
    urlPlaceholder: "Paste a Facebook or TikTok URL...",
    urlNote: "Works with Facebook URLs. If a Facebook video won't scan, download the video and use the Upload File tab. For TikTok, YouTube, Instagram and WhatsApp, download the video and upload it directly.",
    urlAnalyze: "SCAN THIS URL →",
    scanBtn: "SCAN THIS VIDEO →",
    selectFirst: "SELECT A VIDEO TO SCAN",
    extracting: "Extracting frames...",
    extractingSub: "Sampling key moments from your video",
    analyzing: "Analyzing with AI...",
    analyzingSub: "Scanning 8 deepfake signal categories",
    confidence: "Confidence",
    signals: "Signal Breakdown",
    whyTitle: "Why We Think This",
    shareVerdict: "Share Your Verdict",
    copyClip: "Copy to Clipboard",
    copied: "Copied!",
    shareX: "Share on X",
    scanAnother: "← Scan another video",
    historyTitle: "Recent Scans",
    freeBeta: "FREE BETA",
    proLabel: "PRO",
    lightLabel: "LIGHT",
    authentic: "AUTHENTIC",
    suspicious: "SUSPICIOUS",
    fake: "FAKE",
    fileError: "Please upload a video file (MP4, MOV, WebM, AVI).",
    sizeError: "File too large. Max 250MB.",
    analysisError: "Analysis failed. Please try again.",
    scanCount: (n) => `${n.toLocaleString()} videos analyzed`,
    extHelper: "",
    extHelperSub: "",
    extBtn: "",
    orgLink: "For organizations & API access",
    foundingOffer: "🎉 Founding Member: Lock in $7/mo Pro forever — price never changes",
    foundingCta: "Claim offer →",
    upgradeTitle: "Unlock full analysis",
    upgradeSub: "You've used your 3 free scans today.",
    lightPlan: "Light — $5/mo",
    lightFeatures: "8 scans/day · 5 signals · 7-day history",
    proPlan: "Pro — $9/mo",
    proFeatures: "Unlimited scans · All 8 signals · Full history · Clean share card",
    foundingPlan: "Founding Member — $7/mo",
    foundingFeatures: "Everything in Pro · Price locked forever",
    comingSoon: "Coming Soon",
    whatsappTip: "Received a suspicious video on WhatsApp?",
    whatsappSub: "Download it to your phone first, then upload it here. On iPhone: press & hold the video → Save to Files. On Android: tap the download icon → find it in your gallery.",
    whatsappDismiss: "Got it",
  },
  es: {
    tagline: "Escáner de Video con IA",
    eyebrow: "Pega. Escanea. Comparte la verdad.",
    heroTitle1: "¿Este video es",
    heroTitle2: "real o falso?",
    heroSub: "Pega una URL de Facebook o sube cualquier video — obtén un veredicto de autenticidad en segundos.",
    howTitle: "Cómo funciona",
    how1Title: "Sube tu video",
    how1Desc: "Arrastra y suelta cualquier archivo de video hasta 250MB. MP4, MOV, WebM, AVI compatibles.",
    how2Title: "La IA escanea 8 señales",
    how2Desc: "Nuestro modelo extrae fotogramas clave y analiza artefactos faciales, reflejos oculares, sincronización labial y más.",
    how3Title: "Obtén tu veredicto",
    how3Desc: "Recibe un veredicto instantáneo con puntuación de confianza y explicación clara en tu idioma.",
    accuracy: "Detecta la mayoría de deepfakes",
    accuracySub: "Video Veo/Sora de alta calidad es un desafío en evolución",
    scansLabel: "videos analizados",
    tabFile: "Subir Archivo",
    tabUrl: "Pegar URL",
    dropTitle: "Arrastra tu video aquí",
    dropSub: "o haz clic para buscar archivos",
    dropFormats: "MP4 · MOV · WebM · AVI · hasta 250MB",
    dropTip: "¿Tienes un video de TikTok, YouTube, Instagram o WhatsApp? Descárgalo y suéltalo aquí.",
    urlPlaceholder: "Pega una URL de Facebook o TikTok...",
    urlNote: "Funciona con URLs de Facebook. Si un video de Facebook no escanea, descarga el video y usa la pestaña Subir Archivo. Para TikTok, YouTube, Instagram y WhatsApp, descarga el video y súbelo directamente.",
    urlAnalyze: "ESCANEAR ESTA URL →",
    scanBtn: "ESCANEAR ESTE VIDEO →",
    selectFirst: "SELECCIONA UN VIDEO",
    extracting: "Extrayendo fotogramas...",
    extractingSub: "Muestreando momentos clave de tu video",
    analyzing: "Analizando con IA...",
    analyzingSub: "Escaneando 8 categorías de señales deepfake",
    confidence: "Confianza",
    signals: "Análisis de Señales",
    whyTitle: "Por Qué Lo Creemos",
    shareVerdict: "Comparte Tu Veredicto",
    copyClip: "Copiar al Portapapeles",
    copied: "¡Copiado!",
    shareX: "Compartir en X",
    scanAnother: "← Escanear otro video",
    historyTitle: "Escaneos Recientes",
    freeBeta: "BETA GRATIS",
    proLabel: "PRO",
    lightLabel: "LIGHT",
    authentic: "AUTÉNTICO",
    suspicious: "SOSPECHOSO",
    fake: "FALSO",
    fileError: "Por favor sube un archivo de video (MP4, MOV, WebM, AVI).",
    sizeError: "Archivo demasiado grande. Máximo 250MB.",
    analysisError: "El análisis falló. Por favor intenta de nuevo.",
    scanCount: (n) => `${n.toLocaleString()} videos analizados`,
    extHelper: "¿Ves un video sospechoso en Facebook, TikTok o YouTube?",
    extHelperSub: "Esas plataformas bloquean las descargas. Instala la extensión gratuita Video DownloadHelper y luego suelta el archivo aquí.",
    extBtn: "Obtenerla gratis",
    orgLink: "Para organizaciones y acceso API",
    foundingOffer: "🎉 Miembro Fundador: Bloquea $7/mes Pro para siempre",
    foundingCta: "Reclamar oferta →",
    upgradeTitle: "Desbloquea el análisis completo",
    upgradeSub: "Has usado tus 3 escaneos gratuitos de hoy.",
    lightPlan: "Light — $5/mes",
    lightFeatures: "8 escaneos/día · 5 señales · Historial 7 días",
    proPlan: "Pro — $9/mes",
    proFeatures: "Escaneos ilimitados · 8 señales · Historial completo · Tarjeta limpia",
    foundingPlan: "Miembro Fundador — $7/mes",
    foundingFeatures: "Todo en Pro · Precio bloqueado para siempre",
    comingSoon: "Próximamente",
    whatsappTip: "¿Recibiste un video sospechoso en WhatsApp?",
    whatsappSub: "Descárgalo en tu teléfono primero, luego súbelo aquí. En iPhone: mantén presionado → Guardar en Archivos. En Android: toca el ícono de descarga → encuéntralo en tu galería.",
    whatsappDismiss: "Entendido",
  },
  pt: {
    tagline: "Scanner de Vídeo com IA",
    eyebrow: "Cole. Escaneie. Compartilhe a verdade.",
    heroTitle1: "Este vídeo é",
    heroTitle2: "real ou falso?",
    heroSub: "Cole uma URL do Facebook ou envie qualquer vídeo — obtenha um veredicto em segundos.",
    howTitle: "Como funciona",
    how1Title: "Envie seu vídeo",
    how1Desc: "Arraste e solte qualquer arquivo de vídeo até 250MB. MP4, MOV, WebM, AVI suportados.",
    how2Title: "A IA escaneia 8 sinais",
    how2Desc: "Nosso modelo extrai quadros-chave e analisa artefatos faciais, reflexos oculares, sincronia labial e mais.",
    how3Title: "Obtenha seu veredicto",
    how3Desc: "Receba um veredicto instantâneo com pontuação de confiança e explicação clara no seu idioma.",
    accuracy: "Detecta a maioria dos deepfakes",
    accuracySub: "Vídeo Veo/Sora de alta qualidade é um desafio em evolução",
    scansLabel: "vídeos analisados",
    tabFile: "Enviar Arquivo",
    tabUrl: "Colar URL",
    dropTitle: "Arraste seu vídeo aqui",
    dropSub: "ou clique para procurar arquivos",
    dropFormats: "MP4 · MOV · WebM · AVI · até 250MB",
    dropTip: "Tem um vídeo do TikTok, YouTube, Instagram ou WhatsApp? Baixe-o e solte aqui.",
    urlPlaceholder: "Cole uma URL do Facebook ou TikTok...",
    urlNote: "Funciona com URLs do Facebook. Se um vídeo do Facebook não escanear, baixe o vídeo e use a aba Enviar Arquivo. Para TikTok, YouTube, Instagram e WhatsApp, baixe o vídeo e envie diretamente.",
    urlAnalyze: "ESCANEAR ESTA URL →",
    scanBtn: "ESCANEAR ESTE VÍDEO →",
    selectFirst: "SELECIONE UM VÍDEO",
    extracting: "Extraindo quadros...",
    extractingSub: "Amostrando momentos-chave do seu vídeo",
    analyzing: "Analisando com IA...",
    analyzingSub: "Escaneando 8 categorias de sinais deepfake",
    confidence: "Confiança",
    signals: "Análise de Sinais",
    whyTitle: "Por Que Achamos Isso",
    shareVerdict: "Compartilhe Seu Veredicto",
    copyClip: "Copiar para Área de Transferência",
    copied: "Copiado!",
    shareX: "Compartilhar no X",
    scanAnother: "← Escanear outro vídeo",
    historyTitle: "Verificações Recentes",
    freeBeta: "BETA GRÁTIS",
    proLabel: "PRO",
    lightLabel: "LIGHT",
    authentic: "AUTÊNTICO",
    suspicious: "SUSPEITO",
    fake: "FALSO",
    fileError: "Por favor envie um arquivo de vídeo (MP4, MOV, WebM, AVI).",
    sizeError: "Arquivo muito grande. Máximo 250MB.",
    analysisError: "Análise falhou. Por favor tente novamente.",
    scanCount: (n) => `${n.toLocaleString()} vídeos analisados`,
    extHelper: "Vendo um vídeo suspeito no Facebook, TikTok ou YouTube?",
    extHelperSub: "Essas plataformas bloqueiam downloads. Instale a extensão gratuita Video DownloadHelper e solte o arquivo aqui.",
    extBtn: "Obter grátis",
    orgLink: "Para organizações e acesso à API",
    foundingOffer: "🎉 Membro Fundador: Trave $7/mês Pro para sempre",
    foundingCta: "Reivindicar oferta →",
    upgradeTitle: "Desbloqueie análise completa",
    upgradeSub: "Você usou seus 3 scans gratuitos de hoje.",
    lightPlan: "Light — $5/mês",
    lightFeatures: "8 scans/dia · 5 sinais · Histórico 7 dias",
    proPlan: "Pro — $9/mês",
    proFeatures: "Scans ilimitados · 8 sinais · Histórico completo · Cartão limpo",
    foundingPlan: "Membro Fundador — $7/mês",
    foundingFeatures: "Tudo no Pro · Preço travado para sempre",
    comingSoon: "Em Breve",
    whatsappTip: "Recebeu um vídeo suspeito no WhatsApp?",
    whatsappSub: "Baixe-o no seu telefone primeiro, depois envie aqui. No iPhone: pressione e segure → Salvar em Arquivos. No Android: toque no ícono de download → encontre na galeria.",
    whatsappDismiss: "Entendi",
  },
  fr: {
    tagline: "Scanner Vidéo par IA",
    eyebrow: "Collez. Scannez. Partagez la vérité.",
    heroTitle1: "Cette vidéo est-elle",
    heroTitle2: "réelle ou fausse?",
    heroSub: "Collez une URL Facebook ou déposez une vidéo — obtenez un verdict en quelques secondes.",
    howTitle: "Comment ça fonctionne",
    how1Title: "Téléchargez votre vidéo",
    how1Desc: "Glissez-déposez n'importe quel fichier vidéo jusqu'à 250MB. MP4, MOV, WebM, AVI supportés.",
    how2Title: "L'IA scanne 8 signaux",
    how2Desc: "Notre modèle extrait des images clés et analyse les artefacts faciaux, reflets oculaires, synchronisation labiale et plus.",
    how3Title: "Obtenez votre verdict",
    how3Desc: "Recevez un verdict instantané avec score de confiance et explication claire dans votre langue.",
    accuracy: "Détecte la plupart des deepfakes",
    accuracySub: "La vidéo Veo/Sora haute qualité reste un défi en évolution",
    scansLabel: "vidéos analysées",
    tabFile: "Télécharger Fichier",
    tabUrl: "Coller URL",
    dropTitle: "Déposez votre vidéo ici",
    dropSub: "ou cliquez pour parcourir les fichiers",
    dropFormats: "MP4 · MOV · WebM · AVI · jusqu'à 250MB",
    dropTip: "Vous avez une vidéo TikTok, YouTube, Instagram ou WhatsApp? Téléchargez-la et déposez-la ici.",
    urlPlaceholder: "Collez une URL Facebook ou TikTok...",
    urlNote: "Fonctionne avec les URLs Facebook. Si une vidéo Facebook ne scanne pas, téléchargez la vidéo et utilisez l'onglet Télécharger Fichier. Pour TikTok, YouTube, Instagram et WhatsApp, téléchargez la vidéo et uploadez-la directement.",
    urlAnalyze: "SCANNER CETTE URL →",
    scanBtn: "SCANNER CETTE VIDÉO →",
    selectFirst: "SÉLECTIONNEZ UNE VIDÉO",
    extracting: "Extraction des images...",
    extractingSub: "Échantillonnage des moments clés de votre vidéo",
    analyzing: "Analyse avec l'IA...",
    analyzingSub: "Scan de 8 catégories de signaux deepfake",
    confidence: "Confiance",
    signals: "Analyse des Signaux",
    whyTitle: "Pourquoi Nous Pensons Cela",
    shareVerdict: "Partagez Votre Verdict",
    copyClip: "Copier dans le Presse-papiers",
    copied: "Copié!",
    shareX: "Partager sur X",
    scanAnother: "← Scanner une autre vidéo",
    historyTitle: "Analyses Récentes",
    freeBeta: "BÊTA GRATUIT",
    proLabel: "PRO",
    lightLabel: "LIGHT",
    authentic: "AUTHENTIQUE",
    suspicious: "SUSPECT",
    fake: "FAUX",
    fileError: "Veuillez télécharger un fichier vidéo (MP4, MOV, WebM, AVI).",
    sizeError: "Fichier trop volumineux. Maximum 250MB.",
    analysisError: "L'analyse a échoué. Veuillez réessayer.",
    scanCount: (n) => `${n.toLocaleString()} vidéos analysées`,
    extHelper: "Vous voyez une vidéo suspecte sur Facebook, TikTok ou YouTube?",
    extHelperSub: "Ces plateformes bloquent les téléchargements. Installez l'extension gratuite Video DownloadHelper puis déposez le fichier ici.",
    extBtn: "Obtenir gratuitement",
    orgLink: "Pour les organisations et l'accès API",
    foundingOffer: "🎉 Membre Fondateur: Bloquez $7/mois Pro pour toujours",
    foundingCta: "Réclamer l'offre →",
    upgradeTitle: "Débloquez l'analyse complète",
    upgradeSub: "Vous avez utilisé vos 3 scans gratuits d'aujourd'hui.",
    lightPlan: "Light — 5$/mois",
    lightFeatures: "8 scans/jour · 5 signaux · Historique 7 jours",
    proPlan: "Pro — 9$/mois",
    proFeatures: "Scans illimités · 8 signaux · Historique complet · Carte propre",
    foundingPlan: "Membre Fondateur — 7$/mois",
    foundingFeatures: "Tout en Pro · Prix bloqué pour toujours",
    comingSoon: "Bientôt Disponible",
    whatsappTip: "Vous avez reçu une vidéo suspecte sur WhatsApp?",
    whatsappSub: "Téléchargez-la sur votre téléphone d'abord, puis uploadez-la ici. Sur iPhone: appuyez longuement → Enregistrer dans Fichiers. Sur Android: appuyez sur l'icône de téléchargement → trouvez-la dans votre galerie.",
    whatsappDismiss: "Compris",
  },
};

const SIGNALS = [
  "Facial boundary blending & edge artifacts",
  "Unnatural eye reflections or blinking patterns",
  "Hair/teeth rendering inconsistencies",
  "Temporal flickering between frames",
  "Lighting direction mismatches",
  "Background distortion near subject",
  "Audio-visual lip sync accuracy",
  "Skin texture & pore realism",
];

const STATUS = { idle: "idle", extracting: "extracting", analyzing: "analyzing", done: "done", error: "error" };

const VERDICT_CONFIG = {
  AUTHENTIC: { color: "#00FF94", glow: "rgba(0,255,148,0.2)", bg: "rgba(0,255,148,0.06)", border: "rgba(0,255,148,0.3)", label: "authentic" },
  SUSPICIOUS: { color: "#FFB800", glow: "rgba(255,184,0,0.2)", bg: "rgba(255,184,0,0.06)", border: "rgba(255,184,0,0.3)", label: "suspicious" },
  FAKE: { color: "#FF3B5C", glow: "rgba(255,59,92,0.2)", bg: "rgba(255,59,92,0.06)", border: "rgba(255,59,92,0.3)", label: "fake" },
};

const VERDICT_EMOJI = { AUTHENTIC: "✅", SUSPICIOUS: "⚠️", FAKE: "🚫" };

const FREE_SCAN_LIMIT = 3;
const ADMIN_BYPASS = true; // Set to false before public launch
const LIGHT_SCAN_LIMIT = 8;
const SEED_COUNT = 1162;
const PASSIVE_INCREMENT_MS = 210000; // ~3.5 minutes

function detectLang() {
  const nav = navigator.language?.slice(0, 2).toLowerCase();
  return LANGS[nav]?.enabled ? nav : "en";
}

function extractFrames(videoFile, count = 6) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const frames = [];
    video.src = URL.createObjectURL(videoFile);
    video.muted = true;
    video.crossOrigin = "anonymous";
    video.onloadedmetadata = () => {
      canvas.width = Math.min(video.videoWidth, 640);
      canvas.height = Math.min(video.videoHeight, 480);
      const timestamps = Array.from({ length: count }, (_, i) => (video.duration / (count + 1)) * (i + 1));
      let idx = 0;
      const capture = () => {
        if (idx >= timestamps.length) { URL.revokeObjectURL(video.src); resolve(frames); return; }
        video.currentTime = timestamps[idx];
      };
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.75).split(",")[1]);
        idx++; capture();
      };
      video.onerror = reject;
      capture();
    };
    video.onerror = reject;
  });
}

async function analyzeFrames(frames, filename, lang = "en") {
  const langMap = { en: "English", es: "Spanish", pt: "Portuguese", fr: "French" };
  const imageContent = frames.map((b64) => ({
    type: "image",
    source: { type: "base64", media_type: "image/jpeg", data: b64 },
  }));
  const prompt = `You are an expert deepfake and AI-generated video detection system with specialized knowledge of modern AI video generation models including Google Veo, OpenAI Sora, Runway Gen-3, Stable Video Diffusion, and similar tools. Analyze these ${frames.length} frames from "${filename}". Respond entirely in ${langMap[lang] || "English"}.

CRITICAL: Modern AI video generators (Veo, Sora, Runway) produce extremely photorealistic output specifically designed to defeat detection. Do NOT assume authentic just because the video looks high quality or realistic. High production quality is itself a signal worth examining carefully.

Examine each frame aggressively for ALL of these signals:
${SIGNALS.map((s, i) => `${i + 1}. ${s}`).join("\n")}

ADDITIONAL signals specific to high-quality AI video generation:
9. Skin that is too perfect — lacks natural micro-variations, pores, blemishes, natural asymmetry
10. Motion that is unnaturally smooth — real cameras have micro-jitter, AI video is often too stable
11. Background elements that are slightly too perfect or symmetrical
12. Lighting that is perfectly consistent across all frames — real environments have subtle variation
13. Hair and fabric physics that follow slightly unnatural patterns
14. Depth of field or bokeh that looks computationally generated
15. Any "Veo", "Sora", "Runway", "AI" watermarks or generation artifacts in corners or edges

When in doubt between AUTHENTIC and SUSPICIOUS, choose SUSPICIOUS. When in doubt between SUSPICIOUS and FAKE, choose FAKE. It is better to flag legitimate video as suspicious than to miss actual AI-generated content.

Respond ONLY with valid JSON (no markdown):
{
  "verdict": "AUTHENTIC" | "SUSPICIOUS" | "FAKE",
  "confidence": <0-100>,
  "summary": "<2-3 sentence plain verdict in ${langMap[lang] || "English"}>",
  "whyFake": "<3-5 sentences of specific technical observations from the actual frames. Mention what you saw, where, and what it means for a non-expert. In ${langMap[lang] || "English"}.>",
  "signals": [{ "label": "<name>", "score": <0-10>, "note": "<brief finding>" }],
  "shareText": "<punchy verdict max 140 chars no hashtags in ${langMap[lang] || "English"}>"
}`;

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages: [{ role: "user", content: [...imageContent, { type: "text", text: prompt }] }],
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const text = data.content.map((b) => b.text || "").join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function analyzeUrl(url, lang = "en") {
  // Step 1: Download video and extract frames via Railway yt-dlp service
  const extractRes = await fetch("/api/extract-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!extractRes.ok) {
    const err = await extractRes.json().catch(() => ({}));
    throw new Error(err.error || "Failed to download video. Try uploading the file directly.");
  }

  const { frames, title } = await extractRes.json();
  if (!frames || frames.length === 0) throw new Error("No frames could be extracted from this video.");

  // Step 2: Analyze the real frames with Claude
  return analyzeFrames(frames, title || url, lang);
}


// ─── VISUAL SHARE CARD GENERATOR ──────────────────────────────────────────────
function generateShareCard(verdict, confidence, shareText, isPro = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");

  const vc = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.SUSPICIOUS;
  const emoji = VERDICT_EMOJI[verdict] || "⚠️";

  // White/light background for social feed pop
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 1200, 630);

  // Subtle gradient overlay
  const grad = ctx.createLinearGradient(0, 0, 1200, 630);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(248,248,252,1)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 630);

  // Left color accent bar
  ctx.fillStyle = vc.color;
  ctx.fillRect(0, 0, 12, 630);

  // Top accent line
  ctx.fillStyle = vc.color;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 0, 1200, 6);
  ctx.globalAlpha = 1;

  // IsItReel logo area
  ctx.fillStyle = "#FF3B5C";
  roundRect(ctx, 60, 48, 52, 52, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("IR", 86, 80);

  ctx.fillStyle = "#111111";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  ctx.fillText("IsItReel", 126, 74);

  ctx.fillStyle = "#999999";
  ctx.font = "14px Arial";
  ctx.fillText("isitreelapp.com", 126, 95);

  // Verdict emoji
  ctx.font = "90px Arial";
  ctx.textAlign = "center";
  ctx.fillText(emoji, 200, 310);

  // Verdict label
  ctx.fillStyle = vc.color;
  ctx.font = "bold 92px Arial";
  ctx.textAlign = "left";
  ctx.fillText(verdict, 320, 320);

  // Confidence badge
  ctx.fillStyle = "#F5F5F5";
  roundRect(ctx, 320, 340, 200, 44, 22);
  ctx.fillStyle = "#555555";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Confidence: ${confidence}%`, 340, 368);

  // Share text
  ctx.fillStyle = "#333333";
  ctx.font = "24px Arial";
  const words = shareText.split(" ");
  let line = "";
  let y = 430;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > 820 && line !== "") {
      ctx.fillText(line, 320, y);
      line = word + " ";
      y += 36;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, 320, y);

  // Divider
  ctx.strokeStyle = "#EEEEEE";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(60, 560);
  ctx.lineTo(1140, 560);
  ctx.stroke();

  // Footer
  ctx.fillStyle = "#AAAAAA";
  ctx.font = "16px Arial";
  ctx.textAlign = "left";
  ctx.fillText("AI Deepfake Video Scanner · isitreelapp.com", 60, 595);

  // Watermark for free tier
  if (!isPro) {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 590, 1200, 40);
    ctx.fillStyle = "#BBBBBB";
    ctx.font = "13px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scanned free on IsItReel · Upgrade for clean share cards · isitreelapp.com", 600, 612);
  }

  return canvas.toDataURL("image/png");
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// ─── COMMAND CENTER PASSWORD ─────────────────────────────────────────────────
const CC_PASSWORD = 'IR-CC-2026';

// ─── ROUTER ──────────────────────────────────────────────────────────────────
export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { setPath(window.location.pathname); }, []);
  if (path === '/command-center') return <CommandCenter />;
  return <IsItReel />;
}

// ─── COMMAND CENTER ───────────────────────────────────────────────────────────
function CommandCenter() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [outputTab, setOutputTab] = useState('');
  const [weekInput, setWeekInput] = useState('');
  const [calendarOutput, setCalendarOutput] = useState('');
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [statsOutput, setStatsOutput] = useState('');
  const [statsLoading, setStatsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  const login = () => {
    if (pw === CC_PASSWORD) { setAuthed(true); setPwErr(false); }
    else { setPwErr(true); }
  };

  const callClaude = async (prompt, maxTokens = 1500) => {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.map(b => b.text || '').join('') || 'No response';
  };

  const runAgent = async (type, input) => {
    setLoading(true); setOutput(''); setOutputTab(type);
    const prompts = {
      xpost: `You are the IsItReel X (Twitter) content agent. Write a compelling X thread (3-5 tweets, numbered) about this deepfake/AI video topic. Be timely, factual, and end with a CTA to scan suspicious videos at isitreelapp.com. Use relevant hashtags. Make it punchy and shareable.

Topic: ${input}`,
      blog: `You are the IsItReel SEO content agent. Write a 700-900 word blog post optimized for search about this topic. Include:
- SEO-optimized H1 title
- Meta description (155 chars)
- 3-4 H2 sections
- Natural mentions of IsItReel as the solution
- Target keywords around deepfake detection
- Strong CTA at the end

Topic: ${input}`,
      detection: `You are the IsItReel Detection Intelligence agent. Analyze this new AI video model or deepfake technique and provide:
1. Key artifacts/tells this model leaves behind
2. Specific new signals to add to IsItReel's detection prompt
3. How to differentiate this model's output from authentic video
4. Recommended prompt update text (ready to copy-paste)

Model/technique: ${input}`,
      report: `You are the IsItReel Deepfake Report agent. Write a compelling "State of Deepfakes" monthly report section suitable for journalists to cite. Include:
- Executive summary
- Key findings with percentages
- Trend analysis
- Expert commentary voice
- Implications for society

Scan data: ${input}`,
      geo: `You are the IsItReel GEO (Generative Engine Optimization) agent. Write 3 optimized Q&A pairs that would make IsItReel appear when people ask AI search engines (Perplexity, ChatGPT Search, Gemini) about deepfake detection. Each answer should be factual, helpful, 150-200 words, and naturally position IsItReel.

Query topics: ${input}`,
      whatsapp: `You are the IsItReel WhatsApp content agent. Create 5 short, shareable messages optimized for WhatsApp forwarding about this deepfake topic. Each message should:
- Be under 200 characters
- Include the IsItReel link
- Work in a WhatsApp group context
- Feel natural, not promotional
- Available in EN, ES, PT, FR

Topic: ${input}`,
      journalist: `You are the IsItReel PR agent. Write a compelling journalist outreach email about this deepfake story/topic. Include:
- Subject line (3 options)
- Personalized opening
- The news hook
- IsItReel's scan result or relevant data
- Clear ask
- Keep it under 200 words

Story/topic: ${input}`,
      viral: `You are the IsItReel Viral Moment Monitor. Analyze this trending deepfake story and create a complete content package:
1. X thread (3 tweets)
2. Instagram caption
3. Facebook post
4. Blog post title + first paragraph
5. Journalist email subject line
6. WhatsApp message (short, shareable)
All should drive traffic to isitreelapp.com

Story: ${input}`,
    };
    try {
      const text = await callClaude(prompts[type], 2000);
      setOutput(text);
    } catch(err) { setOutput('Error: ' + err.message); }
    setLoading(false);
  };

  const generateCalendar = async () => {
    setCalendarLoading(true); setCalendarOutput('');
    const prompt = `You are the IsItReel Content Calendar agent. Generate a complete 7-day content calendar for IsItReel (AI deepfake video detector at isitreelapp.com).

Week focus/news context: ${weekInput || 'General deepfake awareness and IsItReel promotion'}

For each day provide:
- Platform(s): X, TikTok, Instagram, Facebook
- Content type: Screen recording scan reveal / Educational / Data stat / News reaction / Tutorial / Community
- Caption (EN): Ready to post
- Caption (ES): Spanish translation
- Caption (PT): Portuguese translation  
- Caption (FR): French translation
- Hashtags: Platform-optimized
- CapCut template suggestion: Which style to use
- Best posting time: By region

Format each day clearly. Make content feel native to each platform, not cross-posted. Include at least 2 viral moment opportunities and 1 WhatsApp-optimized post.`;
    try {
      const text = await callClaude(prompt, 3000);
      setCalendarOutput(text);
    } catch(err) { setCalendarOutput('Error: ' + err.message); }
    setCalendarLoading(false);
  };

  const checkStats = async () => {
    setStatsLoading(true); setStatsOutput('');
    const prompt = `You are the IsItReel Stats Monitor agent. Search your knowledge for the most current deepfake statistics available as of 2025-2026. Provide:

1. CURRENT STATS (with sources):
- Number of deepfake videos circulating
- Human detection accuracy rate
- Financial losses to deepfake fraud
- % of people who have encountered deepfakes
- Detection market size and growth

2. STATS THAT MAY HAVE CHANGED:
- Flag any stats that might be outdated
- Suggest what to search for to verify current numbers

3. HOMEPAGE COPY UPDATE:
- Draft updated stat copy for IsItReel's homepage based on latest numbers
- Keep the same format as current stats section

4. NEW STATS TO ADD:
- Any new compelling statistics worth adding to the homepage`;
    try {
      const text = await callClaude(prompt, 2000);
      setStatsOutput(text);
    } catch(err) { setStatsOutput('Error: ' + err.message); }
    setStatsLoading(false);
  };

  const sendAlert = async () => {
    if (!alertMsg.trim()) return;
    try {
      await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertMsg }),
      });
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 3000);
      setAlertMsg('');
    } catch(err) { console.log(err); }
  };

  if (!authed) return (
    <div style={{ minHeight:'100vh', background:'#06060A', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:'40px 32px', width:360, textAlign:'center' }}>
        <div style={{ width:44, height:44, borderRadius:10, background:'linear-gradient(135deg,#FF3B5C,#FF6B35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff', margin:'0 auto 20px', fontFamily:"'Syne',sans-serif" }}>IR</div>
        <div style={{ fontSize:20, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:6 }}>Command Center</div>
        <div style={{ fontSize:12, color:'#555', marginBottom:28 }}>IsItReel — Internal Dashboard</div>
        <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==='Enter' && login()}
          placeholder="Enter password" style={{ width:'100%', padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,.06)', border:`1px solid ${pwErr?'rgba(255,59,92,.5)':'rgba(255,255,255,.1)'}`, color:'#E0E0E0', fontSize:14, marginBottom:12, outline:'none', fontFamily:"'DM Sans',sans-serif", boxSizing:'border-box' }} />
        {pwErr && <div style={{ fontSize:11, color:'#FF3B5C', marginBottom:12 }}>Incorrect password</div>}
        <button onClick={login} style={{ width:'100%', padding:'12px', borderRadius:10, background:'linear-gradient(135deg,#FF3B5C,#FF6B35)', color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor:'pointer', fontFamily:"'Syne',sans-serif" }}>Enter</button>
        <div style={{ marginTop:16 }}><a href="/" style={{ fontSize:11, color:'#444', textDecoration:'none' }}>← Back to IsItReel</a></div>
      </div>
    </div>
  );

  const tabs = [
    { id:'dashboard', label:'📊 Dashboard' },
    { id:'xagent', label:'𝕏 X Agent' },
    { id:'blogagent', label:'✍️ Blog Agent' },
    { id:'viral', label:'🔥 Viral Moment' },
    { id:'calendar', label:'📅 Content Calendar' },
    { id:'detection', label:'🔬 Detection Intel' },
    { id:'report', label:'📋 Deepfake Report' },
    { id:'geo', label:'🌐 GEO Agent' },
    { id:'whatsapp', label:'💬 WhatsApp Agent' },
    { id:'journalist', label:'📰 PR Agent' },
    { id:'statsmonitor', label:'📈 Stats Monitor' },
    { id:'alerts', label:'🔔 Alerts' },
  ];

  const AgentPanel = ({ type, placeholder, buttonLabel, description }) => {
    const [input, setInput] = useState('');
    return (
      <div>
        <div style={{ fontSize:13, color:'#555', marginBottom:16, lineHeight:1.6 }}>{description}</div>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder}
          style={{ width:'100%', padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', color:'#E0E0E0', fontSize:13, fontFamily:"'DM Sans',sans-serif", minHeight:100, resize:'vertical', outline:'none', marginBottom:12, boxSizing:'border-box' }} />
        <button onClick={() => runAgent(type, input)} disabled={loading || !input.trim()}
          style={{ padding:'11px 28px', borderRadius:10, background:input.trim()&&!loading?'linear-gradient(135deg,#FF3B5C,#FF6B35)':'rgba(255,255,255,.05)', color:input.trim()&&!loading?'#fff':'#333', fontSize:13, fontWeight:700, border:'none', cursor:input.trim()&&!loading?'pointer':'not-allowed', fontFamily:"'Syne',sans-serif", marginBottom:20 }}>
          {loading && outputTab === type ? '⏳ Running...' : buttonLabel}
        </button>
        {output && outputTab === type && (
          <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'20px', position:'relative' }}>
            <button onClick={() => navigator.clipboard.writeText(output)} style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.08)', border:'none', color:'#888', fontSize:11, padding:'4px 10px', borderRadius:6, cursor:'pointer' }}>📋 Copy</button>
            <pre style={{ whiteSpace:'pre-wrap', color:'#CCC', fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", margin:0, paddingRight:60 }}>{output}</pre>
          </div>
        )}
      </div>
    );
  };

  const stats = [
    { label:'Total Scans', value:'Loading...', icon:'🔍', color:'#00FF94' },
    { label:'FAKE Verdicts', value:'—', icon:'🚫', color:'#FF3B5C' },
    { label:'AUTHENTIC', value:'—', icon:'✅', color:'#00FF94' },
    { label:'SUSPICIOUS', value:'—', icon:'⚠️', color:'#FFB800' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#06060A', fontFamily:"'DM Sans',sans-serif", color:'#F0F0F0', display:'flex', flexDirection:'column' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0;padding:0}button{cursor:pointer}textarea,input{outline:none}`}</style>

      {/* Header */}
      <div style={{ background:'rgba(255,255,255,.03)', borderBottom:'1px solid rgba(255,255,255,.06)', padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#FF3B5C,#FF6B35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff', fontFamily:"'Syne',sans-serif" }}>IR</div>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif" }}>IsItReel Command Center</div>
            <div style={{ fontSize:10, color:'#444' }}>Private Dashboard · {new Date().toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'})}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:11, color:'#00FF94' }}>● Live</div>
          <a href="/" style={{ fontSize:12, color:'#555', textDecoration:'none' }}>← Back to app</a>
        </div>
      </div>

      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        {/* Sidebar */}
        <div style={{ width:210, background:'rgba(255,255,255,.02)', borderRight:'1px solid rgba(255,255,255,.05)', padding:'20px 12px', flexShrink:0, overflowY:'auto' }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', color:'#333', textTransform:'uppercase', marginBottom:10, paddingLeft:4 }}>Agents</div>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setOutput(''); setOutputTab(''); }}
              style={{ display:'block', width:'100%', padding:'9px 12px', borderRadius:8, background:activeTab===tab.id?'rgba(255,59,92,.12)':'transparent', color:activeTab===tab.id?'#FF3B5C':'#555', fontSize:12, fontWeight:activeTab===tab.id?600:400, border:'none', textAlign:'left', marginBottom:2, fontFamily:"'DM Sans',sans-serif", transition:'all .15s' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex:1, padding:'28px 32px', overflowY:'auto' }}>

          {activeTab === 'dashboard' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>Dashboard</div>
              <div style={{ fontSize:13, color:'#444', marginBottom:28 }}>All 10 agents ready. Click any agent in the sidebar to get started.</div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
                {stats.map((s,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12, padding:'16px' }}>
                    <div style={{ fontSize:20, marginBottom:6 }}>{s.icon}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:s.color, fontFamily:"'Syne',sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize:11, color:'#444', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Agent cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:24 }}>
                {[
                  { id:'xagent', icon:'𝕏', label:'X Agent', desc:'Write viral X threads about deepfake news. One click, ready to post.' },
                  { id:'blogagent', icon:'✍️', label:'Blog Agent', desc:'SEO-optimized blog posts targeting deepfake keywords. With meta description.' },
                  { id:'viral', icon:'🔥', label:'Viral Moment', desc:'Full content package for breaking deepfake stories. X + IG + FB + email.' },
                  { id:'calendar', icon:'📅', label:'Content Calendar', desc:'7-day content plan. All 4 languages. All platforms. CapCut suggestions.' },
                  { id:'detection', icon:'🔬', label:'Detection Intel', desc:'Monitor new AI models. Get prompt update recommendations instantly.' },
                  { id:'report', icon:'📋', label:'Deepfake Report', desc:'Monthly journalist-ready report. Auto-compiled from scan data.' },
                  { id:'geo', icon:'🌐', label:'GEO Agent', desc:'Optimize for Perplexity, ChatGPT Search, Gemini. AI search visibility.' },
                  { id:'whatsapp', icon:'💬', label:'WhatsApp Agent', desc:'Short shareable messages for WhatsApp in all 4 languages.' },
                  { id:'journalist', icon:'📰', label:'PR Agent', desc:'Journalist outreach emails with subject line options. Under 200 words.' },
                  { id:'statsmonitor', icon:'📈', label:'Stats Monitor', desc:'Check if homepage stats are current. Get updated copy ready to deploy.' },
                  { id:'alerts', icon:'🔔', label:'Alerts', desc:'Send manual Telegram alerts to your phone instantly.' },
                  { id:'dashboard', icon:'🔜', label:'More coming', desc:'Link building, competitor monitor, email sequences, and more.' },
                ].map((card, i) => (
                  <div key={i} onClick={() => card.id !== 'dashboard' && setActiveTab(card.id)}
                    style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderRadius:12, padding:'18px', cursor:card.id!=='dashboard'?'pointer':'default', transition:'all .2s' }}
                    onMouseOver={e => { if(card.id!=='dashboard') { e.currentTarget.style.borderColor='rgba(255,59,92,.3)'; e.currentTarget.style.background='rgba(255,59,92,.05)'; }}}
                    onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.06)'; e.currentTarget.style.background='rgba(255,255,255,.03)'; }}>
                    <div style={{ fontSize:22, marginBottom:8 }}>{card.icon}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#DDD', marginBottom:5 }}>{card.label}</div>
                    <div style={{ fontSize:11, color:'#444', lineHeight:1.5 }}>{card.desc}</div>
                  </div>
                ))}
              </div>

              {/* Next steps */}
              <div style={{ background:'rgba(0,255,148,.04)', border:'1px solid rgba(0,255,148,.1)', borderRadius:12, padding:'16px 20px' }}>
                <div style={{ fontSize:12, color:'#00FF94', fontWeight:600, marginBottom:8 }}>🚀 Launch checklist</div>
                {[
                  'Run Viral Moment agent on a trending deepfake story',
                  'Generate first week of Content Calendar',
                  'Submit IsItReel to Product Hunt (Tuesday or Wednesday)',
                  'Create social pages: @isitreelapp on X, TikTok, Instagram, Facebook',
                  'Post first scan reveal video on all platforms',
                  'Run Stats Monitor to verify homepage numbers are current',
                  'Send test Telegram alert to verify alerts working',
                ].map((item, i) => (
                  <div key={i} style={{ fontSize:12, color:'#444', marginBottom:5, display:'flex', gap:8 }}>
                    <span style={{ color:'#333' }}>□</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'xagent' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>𝕏 X Agent</div>
              <AgentPanel type="xpost" placeholder="Paste a news headline, deepfake story, or describe what you want to post about..." buttonLabel="Generate X Thread →" description="Paste a deepfake news story or topic. Get a ready-to-post X thread in seconds with hashtags and CTA." />
            </div>
          )}

          {activeTab === 'blogagent' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>✍️ Blog Agent</div>
              <AgentPanel type="blog" placeholder="e.g. How to tell if a TikTok video is AI generated in 2025..." buttonLabel="Generate Blog Post →" description="Enter a topic and get a full SEO-optimized blog post with title, meta description, H2 sections, and CTA." />
            </div>
          )}

          {activeTab === 'viral' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>🔥 Viral Moment Monitor</div>
              <AgentPanel type="viral" placeholder="Paste the breaking deepfake story, viral video description, or trending topic..." buttonLabel="Generate Full Content Package →" description="When a deepfake story breaks, paste it here. Get a complete content package — X thread, Instagram caption, Facebook post, blog opener, journalist subject line, and WhatsApp message. All ready to post in under 5 minutes." />
            </div>
          )}

          {activeTab === 'calendar' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>📅 Content Calendar</div>
              <div style={{ fontSize:13, color:'#555', marginBottom:16, lineHeight:1.6 }}>Generate a full 7-day content plan across all platforms in all 4 languages. Optionally add context about what's happening in the news this week.</div>
              <textarea value={weekInput} onChange={e => setWeekInput(e.target.value)} placeholder="Optional: What's happening in deepfake news this week? Any specific topics to focus on? Leave blank for general content..."
                style={{ width:'100%', padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', color:'#E0E0E0', fontSize:13, fontFamily:"'DM Sans',sans-serif", minHeight:80, resize:'vertical', outline:'none', marginBottom:12 }} />
              <button onClick={generateCalendar} disabled={calendarLoading}
                style={{ padding:'11px 28px', borderRadius:10, background:!calendarLoading?'linear-gradient(135deg,#FF3B5C,#FF6B35)':'rgba(255,255,255,.05)', color:!calendarLoading?'#fff':'#333', fontSize:13, fontWeight:700, border:'none', cursor:!calendarLoading?'pointer':'not-allowed', fontFamily:"'Syne',sans-serif", marginBottom:20 }}>
                {calendarLoading ? "⏳ Generating 7-day calendar..." : "📅 Generate This Week's Calendar →"}
              </button>
              {calendarOutput && (
                <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'20px', position:'relative' }}>
                  <button onClick={() => navigator.clipboard.writeText(calendarOutput)} style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.08)', border:'none', color:'#888', fontSize:11, padding:'4px 10px', borderRadius:6, cursor:'pointer' }}>📋 Copy</button>
                  <pre style={{ whiteSpace:'pre-wrap', color:'#CCC', fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", margin:0, paddingRight:60 }}>{calendarOutput}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'detection' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>🔬 Detection Intelligence</div>
              <AgentPanel type="detection" placeholder="e.g. Google Veo 3 with audio generation launched — what should IsItReel's prompt include to catch it?" buttonLabel="Analyze & Get Prompt Update →" description="Enter a new AI video model or deepfake technique. Get specific signals to add to IsItReel's detection prompt, ready to copy-paste." />
            </div>
          )}

          {activeTab === 'report' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>📋 Monthly Deepfake Report</div>
              <AgentPanel type="report" placeholder="e.g. This month IsItReel scanned 1,847 videos. 38% FAKE, 29% SUSPICIOUS, 33% AUTHENTIC. Most common platform: TikTok (42%). Most scanned content type: Political figures..." buttonLabel="Generate Report Section →" description="Paste this month's scan summary data. Get a journalist-ready monthly Deepfake Report section you can publish and send to press." />
            </div>
          )}

          {activeTab === 'geo' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>🌐 GEO Agent</div>
              <AgentPanel type="geo" placeholder="e.g. how to detect AI generated video, is this video real or fake, best deepfake detector 2025..." buttonLabel="Generate GEO Content →" description="Enter search queries people ask AI engines. Get optimized Q&A pairs that position IsItReel as the answer on Perplexity, ChatGPT Search, and Gemini." />
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>💬 WhatsApp Agent</div>
              <AgentPanel type="whatsapp" placeholder="e.g. viral deepfake of politician spreading in WhatsApp groups, want to warn people and drive to IsItReel..." buttonLabel="Generate WhatsApp Messages →" description="Create short, shareable WhatsApp messages in all 4 languages. Optimized for forwarding in group chats — feels natural, not promotional." />
            </div>
          )}

          {activeTab === 'journalist' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>📰 PR Agent</div>
              <AgentPanel type="journalist" placeholder="e.g. viral deepfake of CEO spreading on LinkedIn, IsItReel detected it as FAKE at 94% confidence..." buttonLabel="Generate Journalist Email →" description="Paste a deepfake story and IsItReel's scan result. Get a compelling journalist outreach email with 3 subject line options, under 200 words, ready to send." />
            </div>
          )}

          {activeTab === 'statsmonitor' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>📈 Stats Monitor</div>
              <div style={{ fontSize:13, color:'#555', marginBottom:20, lineHeight:1.6 }}>Check if IsItReel's homepage statistics are current. Get updated copy ready to deploy if numbers have changed.</div>
              <button onClick={checkStats} disabled={statsLoading}
                style={{ padding:'11px 28px', borderRadius:10, background:!statsLoading?'linear-gradient(135deg,#FF3B5C,#FF6B35)':'rgba(255,255,255,.05)', color:!statsLoading?'#fff':'#333', fontSize:13, fontWeight:700, border:'none', cursor:!statsLoading?'pointer':'not-allowed', fontFamily:"'Syne',sans-serif", marginBottom:20 }}>
                {statsLoading ? '⏳ Checking stats...' : '📈 Check Current Stats →'}
              </button>
              {statsOutput && (
                <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:12, padding:'20px', position:'relative' }}>
                  <button onClick={() => navigator.clipboard.writeText(statsOutput)} style={{ position:'absolute', top:12, right:12, background:'rgba(255,255,255,.08)', border:'none', color:'#888', fontSize:11, padding:'4px 10px', borderRadius:6, cursor:'pointer' }}>📋 Copy</button>
                  <pre style={{ whiteSpace:'pre-wrap', color:'#CCC', fontSize:13, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", margin:0, paddingRight:60 }}>{statsOutput}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:'#fff', fontFamily:"'Syne',sans-serif", marginBottom:4 }}>🔔 Telegram Alerts</div>
              <div style={{ fontSize:13, color:'#555', marginBottom:20, lineHeight:1.6 }}>Send manual alerts to your Telegram. Automatic alerts fire when new subscribers join.</div>
              <div style={{ background:'rgba(0,255,148,.04)', border:'1px solid rgba(0,255,148,.1)', borderRadius:12, padding:'14px 18px', marginBottom:20 }}>
                <div style={{ fontSize:12, color:'#00FF94', fontWeight:600, marginBottom:4 }}>Automatic alerts configured:</div>
                <div style={{ fontSize:12, color:'#444' }}>✓ New subscriber joins → instant Telegram notification</div>
              </div>
              <textarea value={alertMsg} onChange={e => setAlertMsg(e.target.value)} placeholder="Type a manual alert message to send to your Telegram..."
                style={{ width:'100%', padding:'14px 16px', borderRadius:12, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', color:'#E0E0E0', fontSize:13, fontFamily:"'DM Sans',sans-serif", minHeight:80, resize:'vertical', outline:'none', marginBottom:12 }} />
              <button onClick={sendAlert} disabled={!alertMsg.trim()}
                style={{ padding:'11px 28px', borderRadius:10, background:alertMsg.trim()?'linear-gradient(135deg,#FF3B5C,#FF6B35)':'rgba(255,255,255,.05)', color:alertMsg.trim()?'#fff':'#333', fontSize:13, fontWeight:700, border:'none', cursor:alertMsg.trim()?'pointer':'not-allowed', fontFamily:"'Syne',sans-serif" }}>
                {alertSent ? '✓ Sent to Telegram!' : '🔔 Send Alert →'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


function IsItReel() {
  const [lang, setLang] = useState(detectLang);
  const [langOpen, setLangOpen] = useState(false);
  const [status, setStatus] = useState(STATUS.idle);
  const [inputMode, setInputMode] = useState("url");
  const [file, setFile] = useState(null);
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [scanCount, setScanCount] = useState(SEED_COUNT);
  const [freeScansUsed, setFreeScansUsed] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [shareCardUrl, setShareCardUrl] = useState(null);
  const [isPro] = useState(false); // wire to Stripe - checks URL params on load
  const [whatsappDismissed, setWhatsappDismissed] = useState(false);
  const [tier, setTier] = useState('free'); // free | light | founding | pro
  const SCAN_LIMITS = { free: 3, light: 8, founding: Infinity, pro: Infinity };
  const fileRef = useRef();
  const t = T[lang];

  // Session management - check stored token and URL params
  useEffect(() => {
    // Check for existing session token
    const checkSession = async () => {
      const token = localStorage.getItem('isitreeel_token');
      if (token) {
        try {
          const res = await fetch('/api/verify-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (data.valid) {
            setTier(data.tier);
            setIsPro(data.tier === 'pro' || data.tier === 'founding');
            setUserEmail(data.email || '');
          } else {
            localStorage.removeItem('isitreeel_token');
          }
        } catch(e) {
          console.log('Session check failed:', e.message);
        }
      }
    };

    // Check for extension scan parameter — auto-populate URL and scan
    const params = new URLSearchParams(window.location.search);
    const scanParam = params.get('scan');
    if (scanParam) {
  const decodedUrl = decodeURIComponent(scanParam);
  const isBrowserOnly = decodedUrl.includes('youtube.com') || decodedUrl.includes('x.com') || decodedUrl.includes('twitter.com');
  setInputMode('url');
  setUrlInput(decodedUrl);
  window.history.replaceState({}, '', '/');
  if (!isBrowserOnly) {
    setTimeout(() => {
      document.getElementById('isitreel-scan-btn')?.click();
    }, 1500);
  }
}

  
    // Check for successful Stripe redirect
    if (params.get('upgraded') === 'true') {
      const sessionId = params.get('session_id');
      if (sessionId) {
        fetch('/api/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        .then(r => r.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('isitreeel_token', data.token);
            setTier(data.tier);
            setIsPro(data.tier === 'pro' || data.tier === 'founding');
            setUserEmail(data.email || '');
          }
        })
        .catch(e => console.log('Session creation failed:', e.message));
      }
      window.history.replaceState({}, '', '/');
    } else {
      checkSession();
    }

    // Push initial history state so back button works
    window.history.pushState({ page: 'home' }, '', '/');
    window.onpopstate = () => {
      reset();
      window.history.pushState({ page: 'home' }, '', '/');
    };
  }, []);

  // Persist free scan count in localStorage with daily reset
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('isitreeel_scans') || '{}');
    if (stored.date === today) {
      setFreeScansUsed(stored.count || 0);
    } else {
      localStorage.setItem('isitreeel_scans', JSON.stringify({ date: today, count: 0 }));
      setFreeScansUsed(0);
    }
  }, []);

  // Stripe checkout handler
  const handleUpgrade = async (selectedTier) => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedTier, includeSessionId: true }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Checkout error. Please try again.');
    } catch(err) {
      alert('Checkout error. Please try again.');
    }
  };

  // Passive scan counter increment
  useEffect(() => {
    const interval = setInterval(() => {
      const jitter = Math.random() > 0.5 ? 1 : 0;
      setScanCount(c => c + jitter + 1);
    }, PASSIVE_INCREMENT_MS + Math.random() * 60000);
    return () => clearInterval(interval);
  }, []);



  const saveToHistory = (item) => setHistory(prev => [item, ...prev].slice(0, 5));

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("video/")) { setError(T[lang].fileError); return; }
    if (f.size > 250 * 1024 * 1024) { setError(T[lang].sizeError); return; }
    setFile(f); setError(null); setResult(null); setShareCardUrl(null);
  }, [lang]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const checkFreeLimit = () => {
    if (ADMIN_BYPASS) return true;
    const limit = SCAN_LIMITS[tier] || FREE_SCAN_LIMIT;
    if (freeScansUsed >= limit) {
      setShowUpgrade(true);
      return false;
    }
    return true;
  };

  const runFileScan = async () => {
    if (!file || !checkFreeLimit()) return;
    setStatus(STATUS.extracting); setError(null); setResult(null); setShareCardUrl(null);
    try {
      const frames = await extractFrames(file, 6);
      setStatus(STATUS.analyzing);
      const res = await analyzeFrames(frames, file.name, lang);
      setResult(res);
      setStatus(STATUS.done);
      const newCount = freeScansUsed + 1;
      setFreeScansUsed(newCount);
      setScanCount(c => c + 1);
      // Persist scan count
      const today = new Date().toDateString();
      localStorage.setItem('isitreeel_scans', JSON.stringify({ date: today, count: newCount }));
      const card = generateShareCard(res.verdict, res.confidence, res.shareText, isPro);
      setShareCardUrl(card);
      saveToHistory({ verdict: res.verdict, confidence: res.confidence, name: file.name, time: Date.now(), summary: res.summary });
    } catch (err) {
      setError(err.message || t.analysisError);
      setStatus(STATUS.error);
    }
  };

 const runUrlScan = async () => {
    if (!urlInput.trim() || !checkFreeLimit()) return;
    const trimmedUrl = urlInput.trim();
    const isBrowserOnly = trimmedUrl.includes('youtube.com') || trimmedUrl.includes('x.com') || trimmedUrl.includes('twitter.com');
    if (isBrowserOnly) {
      setError('YouTube and X videos cannot be scanned by URL. Download the video and upload it using the Upload File tab instead.');
      setInputMode('file');
      return;
    }
    setStatus(STATUS.analyzing); setError(null); setResult(null); setShareCardUrl(null);
    try {
      const res = await analyzeUrl(urlInput.trim(), lang);
      setResult(res);
      setStatus(STATUS.done);
      const newCount2 = freeScansUsed + 1;
      setFreeScansUsed(newCount2);
      setScanCount(c => c + 1);
      const today2 = new Date().toDateString();
      localStorage.setItem('isitreeel_scans', JSON.stringify({ date: today2, count: newCount2 }));
      const card = generateShareCard(res.verdict, res.confidence, res.shareText, isPro);
      setShareCardUrl(card);
      saveToHistory({ verdict: res.verdict, confidence: res.confidence, name: urlInput.slice(0, 50), time: Date.now(), summary: res.summary });
    } catch (err) {
      // Clean platform-specific error messages
      let errMsg = err.message || t.analysisError;
      if (errMsg.includes('login required') || errMsg.includes('cookies')) {
        errMsg = '⚠️ This platform requires login to download. Please screen record the video and upload it using the Upload File tab instead.';
      } else if (errMsg.includes('timeout') || errMsg.includes('Download timeout')) {
        errMsg = '⚠️ Video took too long to download. Try uploading the file directly using the Upload File tab.';
      } else if (errMsg.includes('Unsupported platform')) {
        errMsg = "⚠️ This platform isn't supported yet. Try downloading the video and uploading it using the Upload File tab.";
      } else if (errMsg.includes('No frames')) {
        errMsg = '⚠️ Could not extract frames from this video. Try downloading and uploading it directly.';
      }
      setError(errMsg);
      setStatus(STATUS.error);
      setInputMode('file'); // Switch to file tab as fallback
    }
  };

  const reset = () => { setStatus(STATUS.idle); setFile(null); setResult(null); setError(null); setUrlInput(""); setShareCardUrl(null); };

  const copyShare = () => {
    if (!result) return;
    const emoji = VERDICT_EMOJI[result.verdict] || "⚠️";
    const label = t[result.verdict?.toLowerCase()] || result.verdict;
    navigator.clipboard.writeText(`${emoji} ${label}: ${result.shareText}\n\nScanned by IsItReel · isitreelapp.com`)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const downloadCard = () => {
    if (!shareCardUrl) return;
    const a = document.createElement("a");
    a.href = shareCardUrl;
    a.download = "isitreeel-verdict.png";
    a.click();
  };

  const shareX = () => {
    if (!result) return;
    const emoji = VERDICT_EMOJI[result.verdict] || "⚠️";
    const label = t[result.verdict?.toLowerCase()] || result.verdict;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(`${emoji} ${label}: ${result.shareText}\n\nScanned by IsItReel · isitreelapp.com`)}`, "_blank");
  };

  const isAnalyzing = status === STATUS.extracting || status === STATUS.analyzing;
  const vc = result ? (VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.SUSPICIOUS) : null;
  const verdictLabel = result ? (t[result.verdict?.toLowerCase()] || result.verdict) : "";
  const verdictEmoji = result ? (VERDICT_EMOJI[result.verdict] || "⚠️") : "";

  return (
    <div style={{ minHeight: "100vh", background: "#06060A", fontFamily: "'DM Sans', sans-serif", color: "#F0F0F0", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
        @keyframes barIn{from{width:0}to{width:var(--w)}}
        @keyframes popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes countUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        button{cursor:pointer;transition:all .15s}
        button:hover{opacity:.82}
        input{outline:none}
        input::placeholder{color:#333}
        a{text-decoration:none}
        .lang-opt:hover{background:rgba(255,255,255,.07)!important}
        .hist-row:hover{background:rgba(255,255,255,.03)!important}
        .tab-btn:hover{color:#DDD!important}
        .how-card:hover{transform:translateY(-3px);border-color:rgba(255,59,92,.25)!important}
        .plan-card:hover{border-color:rgba(255,59,92,.4)!important;transform:translateY(-2px)}
       @media(max-width:600px){
  .stats-grid{grid-template-columns:1fr!important}
  .how-grid{grid-template-columns:1fr!important}
  .share-btns{flex-direction:column!important}
  .signal-row{flex-wrap:wrap!important}
  .signal-note{display:none!important}
  .header-right{gap:4px!important}
  .upgrade-modal{padding:24px 18px!important}
  .hero-title{font-size:clamp(28px,8vw,44px)!important}
  .founding-banner{flex-direction:column!important;align-items:flex-start!important}
  .signal-label{width:120px!important;font-size:10px!important}
  body{overflow-x:hidden!important}
}
      `}</style>

      {/* Ambient */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:0,
        backgroundImage:`radial-gradient(ellipse 80% 45% at 50% -8%,rgba(255,59,92,.12) 0%,transparent 65%),
          radial-gradient(ellipse 50% 30% at 90% 90%,rgba(0,255,148,.05) 0%,transparent 55%)` }} />

      <div style={{ position:"relative",zIndex:1,maxWidth:780,margin:"0 auto",padding:"0 12px 100px",overflowX:"hidden" }}>

        {/* ── HEADER ── */}
        <header style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"26px 0 38px",borderBottom:"1px solid rgba(255,255,255,.05)",marginBottom:42 }}>
          <div style={{ display:"flex",alignItems:"center",gap:11 }}>
            <div style={{ width:38,height:38,borderRadius:9,background:"linear-gradient(135deg,#FF3B5C,#FF6B35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,fontFamily:"'Syne',sans-serif",color:"#fff",boxShadow:"0 0 18px rgba(255,59,92,.45)",flexShrink:0 }}>IR</div>
            <div>
              <div style={{ fontSize:19,fontWeight:800,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.4px",color:"#fff",lineHeight:1 }}>IsItReel</div>
              <div style={{ fontSize:9,color:"#888",letterSpacing:".08em",marginTop:3 }}>{t.tagline}</div>
            </div>
          </div>

          <div className="header-right" style={{ display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",justifyContent:"flex-end" }}>
            {/* Scan counter */}
            <div style={{ fontSize:11,color:"#555",display:"flex",alignItems:"center",gap:5 }}>
              <div style={{ width:5,height:5,borderRadius:"50%",background:"#00FF94",boxShadow:"0 0 6px #00FF94",animation:"pulse 2s ease infinite" }} />
              <span style={{ animation:"countUp .3s ease",color:"#666" }}>{scanCount.toLocaleString()} {t.scansLabel}</span>
            </div>

            {history.length > 0 && (
              <button onClick={() => setShowHistory(s => !s)} style={{ background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",borderRadius:7,padding:"5px 11px",color:"#777",fontSize:11,fontFamily:"'DM Sans',sans-serif" }}>
                🕐 {history.length}
              </button>
            )}

            {/* Language picker with flags */}
            <div style={{ position:"relative" }}>
              <button onClick={() => setLangOpen(o => !o)} style={{ background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.07)",borderRadius:7,padding:"5px 11px",color:"#CCC",fontSize:12,display:"flex",alignItems:"center",gap:6,fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ fontSize:16 }}>{LANGS[lang].flag}</span>
                <span>{LANGS[lang].label}</span>
                <span style={{ fontSize:8,opacity:.5 }}>▼</span>
              </button>
              {langOpen && (
                <div style={{ position:"absolute",top:"calc(100% + 5px)",right:0,background:"#0F0F13",border:"1px solid rgba(255,255,255,.09)",borderRadius:10,overflow:"hidden",zIndex:100,minWidth:160,boxShadow:"0 10px 40px rgba(0,0,0,.6)" }}>
                  {Object.entries(LANGS).filter(([,v]) => v.enabled).map(([code,{label,flag}]) => (
                    <button key={code} className="lang-opt" onClick={() => { setLang(code); setLangOpen(false); }} style={{ display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:lang===code?"rgba(255,59,92,.1)":"transparent",border:"none",color:lang===code?"#FF3B5C":"#BBB",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"'DM Sans',sans-serif" }}>
                      <span style={{ fontSize:18 }}>{flag}</span>
                      <span>{label}</span>
                      {lang===code && <span style={{ marginLeft:"auto",fontSize:10 }}>✓</span>}
                    </button>
                  ))}
                  <div style={{ borderTop:"1px solid rgba(255,255,255,.05)",padding:"8px 14px" }}>
                    {Object.entries(LANGS).filter(([,v]) => !v.enabled).map(([code,{label,flag}]) => (
                      <div key={code} style={{ display:"flex",alignItems:"center",gap:10,padding:"6px 0",opacity:0.35 }}>
                        <span style={{ fontSize:18 }}>{flag}</span>
                        <span style={{ fontSize:12,color:"#777" }}>{label}</span>
                        <span style={{ marginLeft:"auto",fontSize:9,color:"#555",background:"rgba(255,255,255,.05)",borderRadius:3,padding:"1px 5px" }}>{t.comingSoon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isPro ? (
              <button onClick={async () => {
                if (!userEmail) return;
                const res = await fetch('/api/customer-portal', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: userEmail }),
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
              }} style={{ fontSize:11,fontWeight:600,color:"#00FF94",background:"rgba(0,255,148,.08)",border:"1px solid rgba(0,255,148,.25)",borderRadius:7,padding:"6px 14px",fontFamily:"'DM Sans',sans-serif",cursor:"pointer" }}>
                ✓ {tier.charAt(0).toUpperCase() + tier.slice(1)} — Manage
              </button>
            ) : (
              <button onClick={() => setShowUpgrade(true)} style={{ fontSize:11,fontWeight:700,color:"#fff",background:"linear-gradient(135deg,#FF3B5C,#FF6B35)",border:"none",borderRadius:7,padding:"6px 14px",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 2px 12px rgba(255,59,92,.35)",letterSpacing:".02em",cursor:"pointer" }}>
                Upgrade ↗
              </button>
            )}
            {!isPro && <div style={{ fontSize:9,fontWeight:700,letterSpacing:".14em",color:"#FF3B5C",border:"1px solid rgba(255,59,92,.35)",borderRadius:4,padding:"3px 7px",background:"rgba(255,59,92,.07)" }}>{t.freeBeta}</div>}
          </div>
        </header>
        {/* Home button - shows when not on idle screen */}
        {status !== STATUS.idle && status !== STATUS.error && (
          <button onClick={reset} style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",borderRadius:8,padding:"7px 14px",color:"#AAA",fontSize:12,fontWeight:600,marginBottom:24,fontFamily:"'DM Sans',sans-serif" }}>
            ← Home
          </button>
        )}

        {/* ── HISTORY ── */}
        {showHistory && history.length > 0 && (
          <div style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"18px 20px",marginBottom:28,animation:"fadeUp .3s ease" }}>
            <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#444",textTransform:"uppercase",marginBottom:12 }}>{t.historyTitle}</div>
            {history.map((item,i) => {
              const hvc = VERDICT_CONFIG[item.verdict] || VERDICT_CONFIG.SUSPICIOUS;
              const hLabel = T[lang][item.verdict?.toLowerCase()] || item.verdict;
              return (
                <div key={i} className="hist-row" style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<history.length-1?"1px solid rgba(255,255,255,.04)":"none" }}>
                  <div style={{ width:7,height:7,borderRadius:"50%",background:hvc.color,flexShrink:0,boxShadow:`0 0 5px ${hvc.color}` }} />
                  <div style={{ flex:1,overflow:"hidden" }}>
                    <div style={{ fontSize:12,color:"#BBB",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{item.name}</div>
                    <div style={{ fontSize:10,color:"#444",marginTop:1 }}>{item.summary?.slice(0,65)}...</div>
                  </div>
                  <div style={{ fontSize:11,color:hvc.color,fontWeight:700,flexShrink:0 }}>{hLabel}</div>
                  <div style={{ fontSize:10,color:"#3A3A3A",flexShrink:0 }}>{item.confidence}%</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── UPGRADE MODAL ── */}
        {showUpgrade && (
          <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }} onClick={() => setShowUpgrade(false)}>
            <div className="upgrade-modal" style={{ background:"#0F0F13",border:"1px solid rgba(255,59,92,.3)",borderRadius:20,padding:"36px 28px",maxWidth:480,width:"100%",boxShadow:"0 0 60px rgba(255,59,92,.15)" }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize:24,fontWeight:800,fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:8 }}>{t.upgradeTitle}</div>
              <div style={{ fontSize:13,color:"#666",marginBottom:28 }}>{t.upgradeSub}</div>

              {/* Founding member highlight */}
              <div style={{ background:"linear-gradient(135deg,rgba(255,59,92,.12),rgba(255,107,53,.08))",border:"1.5px solid rgba(255,59,92,.4)",borderRadius:14,padding:"18px 20px",marginBottom:14,position:"relative" }}>
                <div style={{ position:"absolute",top:-10,right:16,background:"#FF3B5C",color:"#fff",fontSize:9,fontWeight:800,letterSpacing:".1em",padding:"3px 8px",borderRadius:4 }}>BEST VALUE</div>
                <div style={{ fontSize:15,fontWeight:700,color:"#fff",marginBottom:4 }}>{t.foundingPlan}</div>
                <div style={{ fontSize:12,color:"#999" }}>{t.foundingFeatures}</div>
                <button onClick={() => handleUpgrade('founding')} style={{ marginTop:14,width:"100%",padding:"11px",borderRadius:9,background:"linear-gradient(135deg,#FF3B5C,#FF6B35)",color:"#fff",fontSize:13,fontWeight:700,border:"none",fontFamily:"'Syne',sans-serif",letterSpacing:".04em" }}>
                  {t.foundingCta}
                </button>
              </div>

              {/* Light plan */}
              <div className="plan-card" onClick={() => handleUpgrade('light')} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"16px 18px",marginBottom:10,transition:"all .2s",cursor:"pointer" }}>
                <div style={{ fontSize:14,fontWeight:600,color:"#CCC",marginBottom:3 }}>{t.lightPlan}</div>
                <div style={{ fontSize:11,color:"#555" }}>{t.lightFeatures}</div>
              </div>

              {/* Pro plan */}
              <div className="plan-card" onClick={() => handleUpgrade('pro')} style={{ background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"16px 18px",marginBottom:20,transition:"all .2s",cursor:"pointer" }}>
                <div style={{ fontSize:14,fontWeight:600,color:"#CCC",marginBottom:3 }}>{t.proPlan}</div>
                <div style={{ fontSize:11,color:"#555" }}>{t.proFeatures}</div>
              </div>

              <button onClick={() => setShowUpgrade(false)} style={{ width:"100%",padding:"10px",borderRadius:9,background:"transparent",border:"1px solid rgba(255,255,255,.07)",color:"#555",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer" }}>
                Maybe later — I'll stay on free
              </button>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        {(status === STATUS.idle || status === STATUS.error) && (
          <div style={{ textAlign:"center",marginBottom:44,animation:"fadeUp .5s ease" }}>
            {/* Accuracy badge */}
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,255,148,.07)",border:"1px solid rgba(0,255,148,.2)",borderRadius:20,padding:"5px 14px",marginBottom:18 }}>
              <span style={{ fontSize:10,color:"#00FF94",fontWeight:700,letterSpacing:".1em" }}>🔍 {t.accuracy}</span>
              <span style={{ fontSize:9,color:"#444" }}>·</span>
              <span style={{ fontSize:10,color:"#555" }}>{t.accuracySub}</span>
            </div>

            <div style={{ fontSize:11,color:"#888",letterSpacing:".1em",marginBottom:12,textTransform:"uppercase" }}>{t.eyebrow}</div>
            <h1 className="hero-title" style={{ fontSize:clamp(36,54),fontWeight:800,fontFamily:"'Syne',sans-serif",lineHeight:1.1,letterSpacing:"-1.5px",marginBottom:14,color:"#fff" }}>
              {t.heroTitle1}<br />
              <span style={{ background:"linear-gradient(90deg,#FF3B5C,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{t.heroTitle2}</span>
            </h1>
            <p style={{ fontSize:14,color:"#666",lineHeight:1.65,maxWidth:460,margin:"0 auto" }}>{t.heroSub}</p>
          </div>
        )}

        {/* ── INPUT ── */}
        {(status === STATUS.idle || status === STATUS.error) && (
          <>
            {/* Founding offer banner */}
            <div className="founding-banner" style={{ background:"linear-gradient(135deg,rgba(255,59,92,.08),rgba(255,107,53,.05))",border:"1px solid rgba(255,59,92,.2)",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap" }}>
              <span style={{ fontSize:12,color:"#CCC" }}>{t.foundingOffer}</span>
              <button onClick={() => handleUpgrade('founding')} style={{ fontSize:11,fontWeight:700,color:"#FF3B5C",background:"rgba(255,59,92,.1)",border:"1px solid rgba(255,59,92,.3)",borderRadius:6,padding:"4px 10px",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap" }}>{t.foundingCta}</button>
            </div>

            {/* Extension helper removed - URL scanning handles downloads automatically */}

            {/* Tabs */}
            <div style={{ display:"flex",gap:0,marginBottom:16,background:"rgba(255,255,255,.035)",borderRadius:11,padding:3,border:"1px solid rgba(255,255,255,.05)" }}>
              {["file","url"].map(mode => (
                <button key={mode} className="tab-btn" onClick={() => { setInputMode(mode); setError(null); }} style={{ flex:1,padding:"9px 14px",borderRadius:8,fontSize:13,fontWeight:600,background:inputMode===mode?"rgba(255,59,92,.14)":"transparent",color:inputMode===mode?"#FF3B5C":"#555",border:inputMode===mode?"1px solid rgba(255,59,92,.28)":"1px solid transparent",fontFamily:"'DM Sans',sans-serif" }}>
                  {mode === "file" ? `📁 ${t.tabFile}` : `🔗 ${t.tabUrl}`}
                </button>
              ))}
            </div>

            {/* File tab */}
            {inputMode === "file" && (
              <>
                {/* WhatsApp tip card */}
                {!whatsappDismissed && (
                  <div style={{ display:"flex",alignItems:"flex-start",gap:11,background:"rgba(37,211,102,.06)",border:"1px solid rgba(37,211,102,.2)",borderRadius:12,padding:"13px 15px",marginBottom:14,animation:"fadeUp .4s ease" }}>
                    <span style={{ fontSize:18,flexShrink:0,marginTop:1 }}>💬</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12,fontWeight:600,color:"#25D366",marginBottom:3 }}>{t.whatsappTip}</div>
                      <div style={{ fontSize:11,color:"#555",lineHeight:1.55 }}>{t.whatsappSub}</div>
                    </div>
                    <button onClick={() => setWhatsappDismissed(true)} style={{ background:"none",border:"none",color:"#3A3A3A",fontSize:18,padding:0,flexShrink:0,cursor:"pointer",lineHeight:1 }}>×</button>
                  </div>
                )}
                {!file ? (
                  <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onClick={() => fileRef.current?.click()}
                    style={{ border:`1.5px dashed ${dragging?"rgba(255,59,92,.6)":"rgba(255,255,255,.08)"}`,borderRadius:18,padding:"50px 28px",textAlign:"center",cursor:"pointer",background:dragging?"rgba(255,59,92,.04)":"rgba(255,255,255,.012)",marginBottom:14,transition:"all .2s" }}>
                    <input ref={fileRef} type="file" accept="video/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])} />
                    <div style={{ fontSize:34,marginBottom:12 }}>🎬</div>
                    <div style={{ fontSize:16,fontWeight:600,color:"#DDD",marginBottom:7 }}>{t.dropTitle}</div>
                    <div style={{ fontSize:13,color:"#444",marginBottom:8 }}>{t.dropSub}</div>
                    <div style={{ fontSize:11,color:"#2E2E2E",marginBottom:8 }}>{t.dropFormats}</div>
                    <div style={{ fontSize:11,color:"#3A3A3A",fontStyle:"italic" }}>💡 {t.dropTip}</div>
                  </div>
                ) : (
                  <div style={{ display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,.04)",borderRadius:12,padding:"13px 16px",marginBottom:14,border:"1px solid rgba(255,255,255,.06)" }}>
                    <span style={{ fontSize:18 }}>🎥</span>
                    <span style={{ flex:1,fontSize:13,color:"#CCC",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{file.name}</span>
                    <span style={{ fontSize:11,color:"#3A3A3A" }}>{(file.size/1024/1024).toFixed(1)} MB</span>
                    <button onClick={() => { setFile(null); setError(null); }} style={{ background:"none",border:"none",color:"#3A3A3A",fontSize:18,padding:0 }}>×</button>
                  </div>
                )}

                {/* Free scan indicator */}
                {!isPro && (
                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ flex:1,height:3,borderRadius:99,background:i < freeScansUsed?"rgba(255,59,92,.5)":"rgba(255,255,255,.08)" }} />
                    ))}
                    <span style={{ fontSize:10,color:"#444",whiteSpace:"nowrap" }}>{FREE_SCAN_LIMIT - freeScansUsed} free left</span>
                  </div>
                )}

                {error && <div style={{ background:"rgba(255,59,92,.06)",border:"1px solid rgba(255,59,92,.18)",borderRadius:11,padding:"14px 16px",textAlign:"center",marginBottom:14,fontSize:13,color:"#FF7090" }}>⚠️ {error}</div>}

                <button onClick={runFileScan} disabled={!file || isAnalyzing}
                  style={{ width:"100%",padding:"16px",borderRadius:13,background:file?"linear-gradient(135deg,#FF3B5C,#FF6B35)":"rgba(255,255,255,.04)",color:file?"#fff":"#2A2A2A",fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif",letterSpacing:".05em",border:"none",boxShadow:file?"0 4px 22px rgba(255,59,92,.32)":"none",cursor:file?"pointer":"not-allowed" }}>
                  {file ? t.scanBtn : t.selectFirst}
                </button>
              </>
            )}

            {/* URL tab */}
            {inputMode === "url" && (
              <>
                <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && urlInput.trim() && runUrlScan()}
                  placeholder={t.urlPlaceholder}
                  style={{ width:"100%",padding:"15px 18px",borderRadius:13,background:"rgba(255,255,255,.035)",border:"1.5px solid rgba(255,255,255,.08)",color:"#E0E0E0",fontSize:13,fontFamily:"'DM Sans',sans-serif",marginBottom:8 }} />
                <div style={{ fontSize:11,color:"#00FF94",marginBottom:14,paddingLeft:2,lineHeight:1.5,opacity:0.7 }}>✓ {t.urlNote}</div>
                {error && <div style={{ background:"rgba(255,59,92,.06)",border:"1px solid rgba(255,59,92,.18)",borderRadius:11,padding:"14px 16px",textAlign:"center",marginBottom:14,fontSize:13,color:"#FF7090" }}>⚠️ {error}</div>}
                <button onClick={runUrlScan} disabled={!urlInput.trim() || isAnalyzing}
                  style={{ width:"100%",padding:"16px",borderRadius:13,background:urlInput.trim()?"linear-gradient(135deg,#FF3B5C,#FF6B35)":"rgba(255,255,255,.04)",color:urlInput.trim()?"#fff":"#2A2A2A",fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif",letterSpacing:".05em",border:"none",boxShadow:urlInput.trim()?"0 4px 22px rgba(255,59,92,.32)":"none",cursor:urlInput.trim()?"pointer":"not-allowed" }}>
                  {t.urlAnalyze}
                </button>
              </>
            )}

            {/* ── STATS SECTION ── */}
            <div style={{ marginTop:48,paddingTop:44,borderTop:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ textAlign:"center",marginBottom:28 }}>
                <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#FF3B5C",textTransform:"uppercase",marginBottom:10 }}>The deepfake crisis is real</div>
                <div style={{ fontSize:22,fontWeight:800,fontFamily:"'Syne',sans-serif",color:"#fff",marginBottom:8 }}>You probably can't tell. Neither can most people.</div>
                <div style={{ fontSize:13,color:"#555",maxWidth:480,margin:"0 auto" }}>The numbers explain why IsItReel exists.</div>
              </div>
              <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:12 }}>
                {[
                  { stat:"24.5%", label:"Human accuracy detecting deepfake video", sub:"You're essentially guessing", color:"#FF3B5C" },
                  { stat:"8M+", label:"Deepfake videos circulating in 2025", sub:"Up from 500K in 2023 — 16x growth", color:"#FFB800" },
                  { stat:"60%", label:"Of people have encountered a deepfake", sub:"Most didn't know it", color:"#FFB800" },
                  { stat:"$25B", label:"Lost to deepfake fraud in 2025", sub:"Growing 32% annually", color:"#FF3B5C" },
                ].map((item,i) => (
                  <div key={i} style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"20px 18px" }}>
                    <div style={{ fontSize:32,fontWeight:900,fontFamily:"'Syne',sans-serif",color:item.color,marginBottom:6,letterSpacing:"-1px" }}>{item.stat}</div>
                    <div style={{ fontSize:12,color:"#CCC",fontWeight:600,marginBottom:4,lineHeight:1.4 }}>{item.label}</div>
                    <div style={{ fontSize:11,color:"#444",fontStyle:"italic" }}>{item.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(0,255,148,.04)",border:"1px solid rgba(0,255,148,.12)",borderRadius:12,padding:"14px 18px",textAlign:"center" }}>
                <span style={{ fontSize:12,color:"#00FF94",fontWeight:600 }}>0.1% of people </span>
                <span style={{ fontSize:12,color:"#555" }}>can correctly identify all fake and real media — IsItReel gives everyone AI-level accuracy instantly.</span>
              </div>
            </div>

            {/* ── HOW IT WORKS ── */}
            <div style={{ marginTop:56,paddingTop:48,borderTop:"1px solid rgba(255,255,255,.05)" }}>
              <div style={{ textAlign:"center",marginBottom:32 }}>
                <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#FF3B5C",textTransform:"uppercase",marginBottom:10 }}>Simple & transparent</div>
                <div style={{ fontSize:24,fontWeight:800,fontFamily:"'Syne',sans-serif",color:"#fff" }}>{t.howTitle}</div>
              </div>
              <div className="how-grid" style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14 }}>
                {[
                  { num:"01", title:t.how1Title, desc:t.how1Desc, icon:"📁" },
                  { num:"02", title:t.how2Title, desc:t.how2Desc, icon:"🔬" },
                  { num:"03", title:t.how3Title, desc:t.how3Desc, icon:"✅" },
                ].map((card,i) => (
                  <div key={i} className="how-card" style={{ background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)",borderRadius:14,padding:"22px 18px",transition:"all .2s",cursor:"default" }}>
                    <div style={{ fontSize:9,fontWeight:700,letterSpacing:".16em",color:"#FF3B5C",marginBottom:10 }}>{card.num}</div>
                    <div style={{ fontSize:20,marginBottom:10 }}>{card.icon}</div>
                    <div style={{ fontSize:13,fontWeight:700,color:"#DDD",marginBottom:7 }}>{card.title}</div>
                    <div style={{ fontSize:11,color:"#4A4A4A",lineHeight:1.6 }}>{card.desc}</div>
                  </div>
                ))}
              </div>

              {/* Accuracy trust signal */}
              <div className="trust-signal" style={{ display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"center",gap:12,marginTop:32,padding:"20px",background:"rgba(0,255,148,.04)",border:"1px solid rgba(0,255,148,.1)",borderRadius:12 }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:16,fontWeight:900,fontFamily:"'Syne',sans-serif",color:"#00FF94",lineHeight:1.2 }}>{t.accuracy}</div>
                  <div style={{ fontSize:10,color:"#444",marginTop:4,lineHeight:1.4 }}>{t.accuracySub}</div>
                </div>
                <div style={{ width:1,height:40,background:"rgba(255,255,255,.06)" }} />
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28,fontWeight:900,fontFamily:"'Syne',sans-serif",color:"#00FF94",animation:"countUp .3s ease" }}>{scanCount.toLocaleString()}</div>
                  <div style={{ fontSize:10,color:"#444",marginTop:2 }}>{t.scansLabel}</div>
                </div>
                <div style={{ width:1,height:40,background:"rgba(255,255,255,.06)" }} />
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28,fontWeight:900,fontFamily:"'Syne',sans-serif",color:"#00FF94" }}>8</div>
                  <div style={{ fontSize:10,color:"#444",marginTop:2 }}>signal categories</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── ANALYZING ── */}
        {isAnalyzing && (
          <div style={{ textAlign:"center",padding:"60px 24px",animation:"fadeUp .4s ease" }}>
            <div style={{ position:"relative",width:56,height:56,margin:"0 auto 26px" }}>
              <div style={{ width:56,height:56,border:"2.5px solid rgba(255,59,92,.15)",borderTopColor:"#FF3B5C",borderRadius:"50%",animation:"spin .85s linear infinite" }} />
              <div style={{ position:"absolute",inset:8,border:"2px solid rgba(255,107,53,.08)",borderTopColor:"rgba(255,107,53,.55)",borderRadius:"50%",animation:"spin 1.5s linear infinite reverse" }} />
            </div>
            <div style={{ fontSize:12,color:"#555",marginBottom:8,letterSpacing:".06em" }}>
              {status===STATUS.extracting ? t.extracting : t.analyzing}
            </div>
            <div style={{ fontSize:19,fontWeight:700,fontFamily:"'Syne',sans-serif",color:"#fff" }}>
              {status===STATUS.extracting ? t.extractingSub : t.analyzingSub}
            </div>
            <div style={{ display:"flex",justifyContent:"center",gap:5,marginTop:28 }}>
              {[0,1,2,3,4,5,6,7].map(i => (
                <div key={i} style={{ width:5,height:5,borderRadius:"50%",background:"rgba(255,59,92,.4)",animation:`pulse 1.2s ease ${i*.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {status === STATUS.done && result && vc && (
          <div style={{ animation:"popIn .45s ease" }}>

            {/* Verdict card */}
            <div style={{ borderRadius:20,background:vc.bg,border:`1.5px solid ${vc.border}`,boxShadow:`0 0 48px ${vc.glow}`,padding:"34px 28px 26px",textAlign:"center",marginBottom:16 }}>
              <div style={{ fontSize:48,marginBottom:9 }}>{verdictEmoji}</div>
              <div style={{ fontSize:"clamp(18px,6vw,38px)",textAlign:"center",width:"100%",fontWeight:900,fontFamily:"'Syne',sans-serif",letterSpacing:".06em",color:vc.color,marginBottom:7 }}>{verdictLabel}</div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:7,background:"rgba(255,255,255,.05)",borderRadius:20,padding:"4px 14px",marginBottom:16 }}>
                <div style={{ width:5,height:5,borderRadius:"50%",background:vc.color }} />
                <span style={{ fontSize:11,color:"rgba(255,255,255,.45)" }}>{t.confidence}: {result.confidence}%</span>
              </div>
              <p style={{ fontSize:14,lineHeight:1.68,color:"rgba(255,255,255,.68)",maxWidth:480,margin:"0 auto" }}>{result.summary}</p>
            </div>

            {/* Why section */}
            {result.whyFake && (
              <div style={{ background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.055)",borderRadius:14,padding:"20px 22px",marginBottom:14 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
                  <div style={{ width:3,height:16,background:vc.color,borderRadius:2,flexShrink:0 }} />
                  <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#484848",textTransform:"uppercase" }}>{t.whyTitle}</div>
                </div>
                <p style={{ fontSize:13,lineHeight:1.75,color:"#999",fontStyle:"italic" }}>{result.whyFake}</p>
              </div>
            )}

            {/* Signal breakdown */}
            {result.signals?.length > 0 && (
              <div style={{ background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.055)",borderRadius:14,padding:"20px 22px",marginBottom:14 }}>
                <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#484848",textTransform:"uppercase",marginBottom:16 }}>{t.signals}</div>
                {result.signals.map((sig,i) => {
                  const bc = sig.score>6?"#FF3B5C":sig.score>3?"#FFB800":"#00FF94";
                  const pct = `${(sig.score/10)*100}%`;
                  return (
                    <div key={i} className="signal-row" style={{ display:"flex",alignItems:"center",gap:8,marginBottom:i<result.signals.length-1?12:0 }}>
                      <div style={{ fontSize:11,color:"#777",width:190,flexShrink:0,lineHeight:1.3 }}>{sig.label}</div>
                      <div style={{ flex:1,height:4,background:"rgba(255,255,255,.05)",borderRadius:99,overflow:"hidden" }}>
                        <div style={{ "--w":pct,height:"100%",width:pct,background:bc,borderRadius:99,animation:"barIn .9s ease forwards" }} />
                      </div>
                      <div style={{ fontSize:10,color:"#3A3A3A",width:26,textAlign:"right",flexShrink:0 }}>{sig.score}/10</div>
                      <div className="signal-note" style={{ fontSize:10,color:"#404040",width:100,textAlign:"right",flexShrink:0,lineHeight:1.3 }}>{sig.note}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Visual share card */}
            {shareCardUrl && (
              <div style={{ background:"rgba(255,255,255,.022)",border:"1px solid rgba(255,255,255,.055)",borderRadius:14,padding:"20px 22px",marginBottom:14 }}>
                <div style={{ fontSize:10,fontWeight:700,letterSpacing:".14em",color:"#484848",textTransform:"uppercase",marginBottom:14 }}>{t.shareVerdict}</div>
                <img src={shareCardUrl} alt="Share card" style={{ width:"100%",borderRadius:10,marginBottom:14,boxShadow:"0 4px 24px rgba(0,0,0,.4)" }} />
                {!isPro && (
                  <div style={{ fontSize:11,color:"#3A3A3A",marginBottom:12,textAlign:"center" }}>
                    🔒 Remove watermark with <button onClick={() => setShowUpgrade(true)} style={{ background:"none",border:"none",color:"#FF3B5C",fontSize:11,cursor:"pointer",padding:0,fontFamily:"'DM Sans',sans-serif" }}>Pro or Light ↗</button>
                  </div>
                )}
                <div className="share-btns" style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  <button onClick={downloadCard} style={{ flex:1,padding:"10px 12px",borderRadius:9,background:"rgba(255,255,255,.04)",color:"#BBB",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,.06)",fontFamily:"'DM Sans',sans-serif",minWidth:120 }}>
                    ⬇ Download Card
                  </button>
                  <button onClick={copyShare} style={{ flex:1,padding:"10px 12px",borderRadius:9,background:"rgba(255,255,255,.04)",color:"#BBB",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,.06)",fontFamily:"'DM Sans',sans-serif",minWidth:120 }}>
                    {copied ? `✅ ${t.copied}` : `📋 ${t.copyClip}`}
                  </button>
                  <button onClick={shareX} style={{ flex:1,padding:"10px 12px",borderRadius:9,background:"rgba(255,255,255,.04)",color:"#BBB",fontSize:12,fontWeight:600,border:"1px solid rgba(255,255,255,.06)",fontFamily:"'DM Sans',sans-serif",minWidth:120 }}>
                    𝕏 {t.shareX}
                  </button>
                </div>
              </div>
            )}

            <button onClick={reset} style={{ width:"100%",padding:"12px",borderRadius:11,background:"transparent",border:"1px solid rgba(255,255,255,.07)",color:"#484848",fontSize:12,fontFamily:"'DM Sans',sans-serif",marginTop:4 }}>
              {t.scanAnother}
            </button>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div style={{ textAlign:"center",marginTop:72,paddingTop:28,borderTop:"1px solid rgba(255,255,255,.08)",fontSize:11,color:"#555" }}>
          <div style={{ marginBottom:10 }}>
            <span style={{ color:"#FF3B5C",fontWeight:700 }}>IsItReel</span>
            <span style={{ color:"#444" }}> · isitreelapp.com · AI deepfake detection for the social media era</span>
          </div>
          <a href="mailto:hello@isitreelapp.com" style={{ fontSize:11,color:"#666",display:"block",marginBottom:10 }}>{t.orgLink} → hello@isitreelapp.com</a>
          <div style={{ fontSize:11,color:"#555",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:12 }}>
            <a href="/privacy" style={{ color:"#666",textDecoration:"none" }} onMouseOver={e=>e.target.style.color="#FF3B5C"} onMouseOut={e=>e.target.style.color="#666"}>Privacy Policy</a>
            <span style={{ color:"#333" }}>·</span>
            <a href="/terms" style={{ color:"#666",textDecoration:"none" }} onMouseOver={e=>e.target.style.color="#FF3B5C"} onMouseOut={e=>e.target.style.color="#666"}>Terms of Service</a>
          </div>
          <div style={{ fontSize:10,color:"#444",marginTop:4 }}>4 languages · Free to start · Detection updated for Veo 3</div>
        </div>
      </div>
    </div>
  );
}

function clamp(min, max) {
  return `clamp(${min}px, 5vw, ${max}px)`;
}
