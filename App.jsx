import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, PlusCircle, MapPin, Shield, MessageSquare, CheckCircle, 
  AlertTriangle, Filter, Globe, Sparkles, UserCheck, Key, Eye, 
  QrCode, Star, ChevronRight, Lock, ArrowRight, RefreshCw, Send,
  FileText, Check, Clock, Award, X
} from 'lucide-react';

// --- TRANSLATIONS DICTIONARY ---
const TRANSLATIONS = {
  en: {
    title: "Findora",
    tagline: "Don't scroll a list. Get matched with what you lost.",
    navHome: "Home",
    navExplore: "Explore Map",
    navMatches: "Smart Matches",
    navReport: "Report Item",
    navClaims: "Claims Hub",
    heroHeading: "Intelligent Digital Lost & Found",
    heroSub: "AI-powered scoring matches lost items with found reports instantly across campus.",
    btnReportLost: "Report Lost Item",
    btnReportFound: "Report Found Item",
    statsMatched: "Match Accuracy",
    statsReturned: "Items Returned",
    statsAvgTime: "Avg. Return Time",
    searchPlaceholder: "Search keywords (e.g. laptop, keys, wallet)...",
    filterAll: "All Items",
    filterLost: "Lost Items",
    filterFound: "Found Items",
    matchScore: "Match Score",
    trustTier: "Campus Trust",
    secretTrait: "Secret Verification Trait",
    claimBtn: "Claim Ownership",
    handoverQR: "Generate Handover Code",
    chatTitle: "Secure Anonymous Chat",
    sendMsg: "Send",
    verifiedBadge: "Verified Student/Staff",
    custodyDesk: "Custody Handover Desk",
    highPriority: "High Priority",
    medPriority: "Medium Priority",
    lowPriority: "Low Priority"
  },
  es: {
    title: "Findora",
    tagline: "No se desplace por una lista. Encuentre coincidencias con lo que perdió.",
    navHome: "Inicio",
    navExplore: "Explorar Mapa",
    navMatches: "Coincidencias",
    navReport: "Reportar Objeto",
    navClaims: "Centro de Reclamos",
    heroHeading: "Objetos Perdidos Digital Inteligente",
    heroSub: "Emparejamiento inteligente de objetos perdidos y encontrados en el campus.",
    btnReportLost: "Reportar Perdido",
    btnReportFound: "Reportar Encontrado",
    statsMatched: "Precisión de Coincidencia",
    statsReturned: "Objetos Devueltos",
    statsAvgTime: "Tiempo Promedio",
    searchPlaceholder: "Buscar palabras clave (ej. portátil, llaves)...",
    filterAll: "Todos",
    filterLost: "Perdidos",
    filterFound: "Encontrados",
    matchScore: "Puntaje de Coincidencia",
    trustTier: "Confianza Campus",
    secretTrait: "Rasgo Secreto de Verificación",
    claimBtn: "Reclamar Propiedad",
    handoverQR: "Generar Código de Entrega",
    chatTitle: "Chat Anónimo Seguro",
    sendMsg: "Enviar",
    verifiedBadge: "Estudiante/Personal Verificado",
    custodyDesk: "Módulo de Custodia",
    highPriority: "Prioridad Alta",
    medPriority: "Prioridad Media",
    lowPriority: "Prioridad Baja"
  },
  fr: {
    title: "Findora",
    tagline: "Ne faites plus défiler une liste. Obtenez une correspondance directe.",
    navHome: "Accueil",
    navExplore: "Carte Interactive",
    navMatches: "Correspondances",
    navReport: "Signaler un Objet",
    navClaims: "Réclamations",
    heroHeading: "Objets Trouvés Numériques Intelligents",
    heroSub: "Correspondance instantanée par IA entre objets perdus et trouvés sur le campus.",
    btnReportLost: "Signaler Perdu",
    btnReportFound: "Signaler Trouvé",
    statsMatched: "Précision des Matchs",
    statsReturned: "Objets Restitués",
    statsAvgTime: "Temps Moyen",
    searchPlaceholder: "Rechercher des mots-clés...",
    filterAll: "Tous les Objets",
    filterLost: "Objets Perdus",
    filterFound: "Objets Trouvés",
    matchScore: "Score de Match",
    trustTier: "Confiance Campus",
    secretTrait: "Caractéristique Secrète",
    claimBtn: "Reclamer la Propriété",
    handoverQR: "Générer Code Remise",
    chatTitle: "Discussion Anonyme Sécurisée",
    sendMsg: "Envoyer",
    verifiedBadge: "Étudiant/Personnel Vérifié",
    custodyDesk: "Bureau de Custodie",
    highPriority: "Haute Priorité",
    medPriority: "Moyenne Priorité",
    lowPriority: "Basse Priorité"
  },
  hi: {
    title: "Findora",
    tagline: "लंबी सूची स्क्रॉल न करें। अपनी खोई हुई वस्तु से सीधा मैच पाएं।",
    navHome: "मुख्य पृष्ठ",
    navExplore: "कैंपस मैप",
    navMatches: "स्मार्ट मैच",
    navReport: "रिपोर्ट करें",
    navClaims: "दावा केंद्र",
    heroHeading: "इंटेलिजेंट डिजिटल लॉस्ट एंड फाउंड",
    heroSub: "एआई एल्गोरिथ्म खोई और मिली वस्तुओं का तुरंत सटीक मिलान करता है।",
    btnReportLost: "खोया हुआ दर्ज करें",
    btnReportFound: "मिला हुआ दर्ज करें",
    statsMatched: "मैच सटीकता",
    statsReturned: "लौटाई गई वस्तुएं",
    statsAvgTime: "औसत वापसी समय",
    searchPlaceholder: "खोजें (जैसे: लैपटॉप, चाबी, बटुआ)...",
    filterAll: "सभी वस्तुएं",
    filterLost: "खोई हुई वस्तुएं",
    filterFound: "मिली हुई वस्तुएं",
    matchScore: "मैच स्कोर",
    trustTier: "कैंपस ट्रस्ट स्कोर",
    secretTrait: "गुप्त पहचान लक्षण",
    claimBtn: "स्वामित्व का दावा करें",
    handoverQR: "हैंडओवर कोड प्राप्त करें",
    chatTitle: "सुरक्षित अनाम चैट",
    sendMsg: "भेजें",
    verifiedBadge: "सत्यापित छात्र/कर्मचारी",
    custodyDesk: "सुरक्षा डेस्क",
    highPriority: "उच्च प्राथमिकता",
    medPriority: "मध्यम प्राथमिकता",
    lowPriority: "निम्न प्राथमिकता"
  },
  de: {
    title: "Findora",
    tagline: "Nicht scrollen, sondern matchen. Finden Sie Ihr Eigentum direkt.",
    navHome: "Startseite",
    navExplore: "Karte",
    navMatches: "Matches",
    navReport: "Melden",
    navClaims: "Ansprüche",
    heroHeading: "Intelligentes Digitales Fundbüro",
    heroSub: "KI-gestützte Zuordnung von verlorenen und gefundenen Gegenständen auf dem Campus.",
    btnReportLost: "Verlust Melden",
    btnReportFound: "Fund Melden",
    statsMatched: "Match-Genauigkeit",
    statsReturned: "Zurückgegebene Dinge",
    statsAvgTime: "Durchschnittszeit",
    searchPlaceholder: "Suchbegriffe (z.B. Laptop, Schlüssel)...",
    filterAll: "Alle Objekte",
    filterLost: "Verloren",
    filterFound: "Gefunden",
    matchScore: "Match-Punktzahl",
    trustTier: "Campus-Vertrauen",
    secretTrait: "Geheimes Merkmal",
    claimBtn: "Eigentum Beanspruchen",
    handoverQR: "Übergabecode Erzeugen",
    chatTitle: "Sicherer Anonymer Chat",
    sendMsg: "Senden",
    verifiedBadge: "Verifizierter Benutzer",
    custodyDesk: "Abgabestelle",
    highPriority: "Hohe Priorität",
    medPriority: "Mittlere Priorität",
    lowPriority: "Niedrige Priorität"
  }
};

// --- MOCK DATABASE ---
const INITIAL_ITEMS = [
  {
    id: "LOST-101",
    type: "LOST",
    title: "Matte Black Laptop Backpack",
    category: "Bags",
    location: "Main Library - 2nd Floor",
    building: "Main Library",
    time: "2026-10-24 10:30 AM",
    priority: "HIGH",
    color: "Black",
    brand: "SwissGear",
    description: "Contains a 15-inch laptop, blue notebook, and silver water bottle.",
    secretTrait: "A small red dragon keychain inside the front mesh pocket.",
    status: "Matched",
    trustScore: 94,
    reporter: "Alex M. (Student)",
    coordX: 35,
    coordY: 40,
    matchedId: "FOUND-201",
    matchScore: 92,
    matchReason: "High similarity in category, location window (Main Library), and brand characteristics."
  },
  {
    id: "FOUND-201",
    type: "FOUND",
    title: "Black Daypack with Mountain Sticker",
    category: "Bags",
    location: "Main Library Study Hub",
    building: "Main Library",
    time: "2026-10-24 11:15 AM",
    priority: "HIGH",
    color: "Black",
    brand: "SwissGear",
    description: "Black backpack left near study desk 14. Has a sticker on side pocket.",
    secretTrait: "Red dragon keychain hidden in zipper compartment.",
    status: "Matched",
    trustScore: 98,
    reporter: "Custody Desk A",
    coordX: 38,
    coordY: 42,
    matchedId: "LOST-101",
    matchScore: 92,
    matchReason: "Category & color match exactly. Found 45 mins after lost report in same zone."
  },
  {
    id: "LOST-102",
    type: "LOST",
    title: "Apple AirPods Pro (Green Case)",
    category: "Electronics",
    location: "Science & Engineering Hall",
    building: "Engineering Block",
    time: "2026-10-23 03:00 PM",
    priority: "MEDIUM",
    color: "Green",
    brand: "Apple",
    description: "Matte olive green silicone case with small carabiner clip.",
    secretTrait: "Engraved initials 'J.D.' on the internal white lid.",
    status: "Matched",
    trustScore: 88,
    reporter: "Jordan D.",
    coordX: 65,
    coordY: 25,
    matchedId: "FOUND-202",
    matchScore: 77,
    matchReason: "Electronics category match. Location adjacent to Dining Pavilion."
  },
  {
    id: "FOUND-202",
    type: "FOUND",
    title: "Wireless Earbud Case with Clip",
    category: "Electronics",
    location: "Student Center & Dining Pavilion",
    building: "Student Center",
    time: "2026-10-23 04:30 PM",
    priority: "MEDIUM",
    color: "Green",
    brand: "Apple",
    description: "Green silicone earbud case found under dining table.",
    secretTrait: "Initials engraved inside lid.",
    status: "Matched",
    trustScore: 95,
    reporter: "Sarah P. (Staff)",
    coordX: 60,
    coordY: 30,
    matchedId: "LOST-102",
    matchScore: 77,
    matchReason: "Time window matches (within 90 mins). Exact color & clip detail."
  },
  {
    id: "LOST-103",
    type: "LOST",
    title: "Orange Tabby Cat with Bell Collar",
    category: "Pets / Accessories",
    location: "South Quad Lawn",
    building: "South Quad",
    time: "2026-10-24 08:00 AM",
    priority: "HIGH",
    color: "Orange / White",
    brand: "N/A",
    description: "Friendly indoor cat wearing a yellow bell collar, responds to 'Milo'.",
    secretTrait: "Heart-shaped patch of orange fur on right rear leg.",
    status: "Matched",
    trustScore: 99,
    reporter: "Campus Housing Office",
    coordX: 20,
    coordY: 70,
    matchedId: "FOUND-203",
    matchScore: 87,
    matchReason: "Unique animal description and identical quad location."
  },
  {
    id: "FOUND-203",
    type: "FOUND",
    title: "Friendly Ginger Cat with Collar",
    category: "Pets / Accessories",
    location: "South Quad / Lawn",
    building: "South Quad",
    time: "2026-10-24 08:45 AM",
    priority: "HIGH",
    color: "Orange",
    brand: "N/A",
    description: "Found wandering near south dorm benches. Very vocal, wearing collar.",
    secretTrait: "Heart patch on rear leg.",
    status: "Matched",
    trustScore: 92,
    reporter: "Campus Security Desk B",
    coordX: 22,
    coordY: 72,
    matchedId: "LOST-103",
    matchScore: 87,
    matchReason: "Immediate spatial proximity & 45 min interval."
  }
];

export default function App() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home');
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimInput, setClaimInput] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [otpCode, setOtpCode] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', text: 'Chat initiated via Findora Privacy Shield. Personal numbers are hidden.', time: '11:20 AM' },
    { sender: 'Finder', text: 'Hello! I turned this item into Security Desk A in the Main Library.', time: '11:22 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Form State for New Report
  const [reportType, setReportType] = useState('LOST');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    building: 'Main Library',
    location: '',
    color: '',
    brand: '',
    priority: 'MEDIUM',
    description: '',
    secretTrait: ''
  });
  const [formStep, setFormStep] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  const t = TRANSLATIONS[lang];
  const canvasRef = useRef(null);

  // Background Animation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0a0f1d');
      grad.addColorStop(1, '#070a14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / 130 * 0.8})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'Security Desk', text: 'Thank you for your update. Claim verified. You may collect at Desk A.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimInput.trim()) return;
    
    // Simulate smart verification
    setClaimSuccess(true);
    const generatedOTP = Math.floor(100000 + Math.random() * 900000);
    setOtpCode(generatedOTP);
    showToast('Ownership proof accepted! Unique Handover OTP generated.');
  };

  const handleCreateReport = (e) => {
    e.preventDefault();
    const newItem = {
      id: `${reportType}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: reportType,
      title: formData.title || "Unspecified Item",
      category: formData.category,
      location: formData.location || formData.building,
      building: formData.building,
      time: "Just now",
      priority: formData.priority,
      color: formData.color || "N/A",
      brand: formData.brand || "N/A",
      description: formData.description,
      secretTrait: formData.secretTrait,
      status: "Unresolved",
      trustScore: 92,
      reporter: "You (Verified User)",
      coordX: Math.floor(20 + Math.random() * 60),
      coordY: Math.floor(20 + Math.random() * 60),
      matchScore: 85,
      matchReason: "Category and building proximity match existing reports."
    };

    setItems([newItem, ...items]);
    showToast(`Report filed successfully! ID: ${newItem.id}`);
    setActiveTab('explore');
    setFormStep(1);
    setFormData({
      title: '', category: 'Electronics', building: 'Main Library',
      location: '', color: '', brand: '', priority: 'MEDIUM',
      description: '', secretTrait: ''
    });
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen text-slate-100 font-sans relative overflow-x-hidden bg-slate-950">
      {/* Animated Mesh Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40" />

      {/* Floating Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
                  {t.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  PS 02
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">{t.tagline}</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-2xl border border-slate-700/50">
            {[
              { id: 'home', label: t.navHome, icon: Sparkles },
              { id: 'explore', label: t.navExplore, icon: MapPin },
              { id: 'matches', label: t.navMatches, icon: RefreshCw },
              { id: 'report', label: t.navReport, icon: PlusCircle },
              { id: 'claims', label: t.navClaims, icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Switcher Dropdown */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center bg-slate-800/80 rounded-xl border border-slate-700/60 px-3 py-1.5 text-xs text-slate-200">
              <Globe className="w-4 h-4 text-blue-400 mr-2" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                <option value="es" className="bg-slate-900 text-white">Español (ES)</option>
                <option value="fr" className="bg-slate-900 text-white">Français (FR)</option>
                <option value="hi" className="bg-slate-900 text-white">हिंदी (HI)</option>
                <option value="de" className="bg-slate-900 text-white">Deutsch (DE)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-slate-800 text-xs">
          <button onClick={() => setActiveTab('home')} className={`p-2 rounded-lg ${activeTab==='home'?'text-blue-400 font-bold':''}`}>{t.navHome}</button>
          <button onClick={() => setActiveTab('explore')} className={`p-2 rounded-lg ${activeTab==='explore'?'text-blue-400 font-bold':''}`}>{t.navExplore}</button>
          <button onClick={() => setActiveTab('matches')} className={`p-2 rounded-lg ${activeTab==='matches'?'text-blue-400 font-bold':''}`}>{t.navMatches}</button>
          <button onClick={() => setActiveTab('report')} className={`p-2 rounded-lg ${activeTab==='report'?'text-blue-400 font-bold':''}`}>{t.navReport}</button>
        </div>
      </header>

      {/* Main Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-blue-400/30 animate-bounce">
          <CheckCircle className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8">

        {/* TAB 1: HOME LANDING HERO */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <div className="text-center py-12 px-6 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900/60 to-slate-950 border border-slate-800/80 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Campus Match Engine</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
                {t.heroHeading}
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto font-normal">
                {t.heroSub}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => { setReportType('LOST'); setActiveTab('report'); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/25 hover:opacity-90 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>{t.btnReportLost}</span>
                </button>

                <button
                  onClick={() => { setReportType('FOUND'); setActiveTab('report'); }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-base shadow-xl shadow-teal-500/25 hover:opacity-90 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{t.btnReportFound}</span>
                </button>
              </div>

              {/* Key Platform Stats */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-slate-800/80 pt-8 text-left">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-2xl font-black text-blue-400">92.4%</div>
                  <div className="text-xs text-slate-400 mt-1">{t.statsMatched}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400">1,480+</div>
                  <div className="text-xs text-slate-400 mt-1">{t.statsReturned}</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="text-2xl font-black text-purple-400">&lt; 3.5 Hours</div>
                  <div className="text-xs text-slate-400 mt-1">{t.statsAvgTime}</div>
                </div>
              </div>
            </div>

            {/* Quick Match Previews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                    <span>Recent High-Confidence Matches</span>
                  </h2>
                  <p className="text-sm text-slate-400">Real-time candidate pairs generated by Findora's vector engine.</p>
                </div>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-1"
                >
                  <span>View All Matches</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {items.filter(i => i.matchedId).slice(0, 2).map((lostItem) => {
                  const foundItem = items.find(f => f.id === lostItem.matchedId);
                  if (!foundItem) return null;
                  return (
                    <div key={lostItem.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          {lostItem.matchScore}% Confidence Match
                        </span>
                        <span className="text-xs text-slate-400 flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Scored 10m ago</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Lost Side */}
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                          <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">LOST</div>
                          <h4 className="font-bold text-slate-100 text-sm">{lostItem.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />{lostItem.location}
                          </p>
                        </div>

                        {/* Found Side */}
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">FOUND</div>
                          <h4 className="font-bold text-slate-100 text-sm">{foundItem.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />{foundItem.location}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                        <span className="font-semibold text-blue-400">Match Reason: </span>
                        {lostItem.matchReason}
                      </div>

                      <div className="mt-4 flex items-center justify-end space-x-3">
                        <button
                          onClick={() => { setSelectedItem(lostItem); setShowClaimModal(true); }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
                        >
                          {t.claimBtn}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Core Pillars Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
              {[
                { title: "1. Match Engine", desc: "Scored candidate pairs replace endless scrollable lists.", icon: Sparkles, color: "text-blue-400" },
                { title: "2. Verify Identity", desc: "3 trust tiers with student ID and SMS verification.", icon: Shield, color: "text-emerald-400" },
                { title: "3. Campus Map", desc: "Geospatial markers pinned across custody desks.", icon: MapPin, color: "text-amber-400" },
                { title: "4. Safe Handover", desc: "QR token & OTP claim validation at security desks.", icon: QrCode, color: "text-purple-400" }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
                    <Icon className={`w-8 h-8 ${feature.color} mb-3`} />
                    <h3 className="font-bold text-white text-base">{feature.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: EXPLORE MAP & LIST VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            
            {/* Search & Filter Header */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              
              {/* Keyword Search */}
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'ALL', label: t.filterAll },
                  { id: 'LOST', label: t.filterLost },
                  { id: 'FOUND', label: t.filterFound }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filterType === f.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus SVG Map Overlay */}
            <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 overflow-hidden min-h-[320px] flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="font-bold text-white text-sm">Interactive Campus Map</span>
                </div>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="flex items-center text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" />Lost</span>
                  <span className="flex items-center text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" />Found</span>
                  <span className="flex items-center text-blue-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" />Custody Desk</span>
                </div>
              </div>

              {/* Mock Graphic Map Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <circle cx="30%" cy="40%" r="60" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <circle cx="70%" cy="30%" r="80" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                  <circle cx="50%" cy="70%" r="70" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                </svg>
              </div>

              {/* Interactive Map Pins */}
              <div className="relative w-full h-[220px] z-10">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    style={{ left: `${item.coordX}%`, top: `${item.coordY}%` }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border shadow-xl transition-all hover:scale-125 ${
                      item.type === 'LOST' 
                        ? 'bg-amber-500 border-amber-300 text-slate-950' 
                        : 'bg-emerald-500 border-emerald-300 text-slate-950'
                    }`}
                    title={item.title}
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 z-10 text-center">
                Click any pin on the map to inspect details, secret verification traits, or request handover.
              </div>
            </div>

            {/* Item Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                        item.type === 'LOST'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {item.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">{item.description}</p>

                    <div className="mt-4 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center text-slate-400">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-blue-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center text-slate-400">
                        <Shield className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                        <span>Reporter Trust Score: <strong className="text-white">{item.trustScore}/100</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-semibold text-slate-300 hover:text-white flex items-center"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>

                    <button
                      onClick={() => { setSelectedItem(item); setShowClaimModal(true); }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold transition-all"
                    >
                      {t.claimBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: SMART MATCHES BREAKDOWN */}
        {activeTab === 'matches' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <span>Findora Smart Match Suggestions</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Our weighted matching algorithm computes similarity scores based on Category, Look, Location, Timeline, and Text Similarity.
              </p>
            </div>

            <div className="space-y-6">
              {items.filter(i => i.type === 'LOST' && i.matchedId).map((lost) => {
                const found = items.find(f => f.id === lost.matchedId);
                if (!found) return null;

                return (
                  <div key={lost.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                    
                    {/* Top Match Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-lg">
                          {lost.matchScore}%
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Suggested Candidate Match</div>
                          <div className="text-xs text-slate-400">Match Pair ID: #{lost.id} & #{found.id}</div>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        High Confidence
                      </span>
                    </div>

                    {/* Side by Side Detailed Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Lost Side Card */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 relative">
                        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                          LOST REPORT
                        </span>
                        <h4 className="font-bold text-slate-100 text-base">{lost.title}</h4>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                          <div><strong>Category:</strong> {lost.category}</div>
                          <div><strong>Location:</strong> {lost.location}</div>
                          <div><strong>Time Reported:</strong> {lost.time}</div>
                          <div><strong>Brand/Color:</strong> {lost.brand} / {lost.color}</div>
                          <div className="text-slate-400 mt-2">"{lost.description}"</div>
                        </div>
                      </div>

                      {/* Found Side Card */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 relative">
                        <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                          FOUND REPORT
                        </span>
                        <h4 className="font-bold text-slate-100 text-base">{found.title}</h4>
                        <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                          <div><strong>Category:</strong> {found.category}</div>
                          <div><strong>Location:</strong> {found.location}</div>
                          <div><strong>Time Reported:</strong> {found.time}</div>
                          <div><strong>Brand/Color:</strong> {found.brand} / {found.color}</div>
                          <div className="text-slate-400 mt-2">"{found.description}"</div>
                        </div>
                      </div>

                    </div>

                    {/* Detailed Scoring Breakdown */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                      <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Match Breakdown Metrics</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Category Match</span>
                          <span className="font-bold text-emerald-400">100% Exact</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Location Window</span>
                          <span className="font-bold text-blue-400">Adjacent Block</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Time Window</span>
                          <span className="font-bold text-blue-400">&lt; 45 Minutes</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <span className="text-slate-400 block">Secret Trait Verification</span>
                          <span className="font-bold text-purple-400">Pending Review</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-3 pt-2">
                      <button
                        onClick={() => { setActiveChat(found); setActiveTab('claims'); }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span>{t.chatTitle}</span>
                      </button>

                      <button
                        onClick={() => { setSelectedItem(lost); setShowClaimModal(true); }}
                        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
                      >
                        {t.claimBtn}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: REPORT ITEM WIZARD */}
        {activeTab === 'report' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <PlusCircle className="w-6 h-6 text-blue-400" />
                <span>File a New Lost or Found Report</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Complete the 4-step wizard to let Findora's engine find high-confidence matches automatically.
              </p>

              {/* Progress Bar */}
              <div className="flex items-center space-x-2 mt-6">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      formStep >= step ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateReport} className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
              
              {/* STEP 1: Type & Category */}
              {formStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Report Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setReportType('LOST')}
                        className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                          reportType === 'LOST'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        I Lost Something
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('FOUND')}
                        className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all ${
                          reportType === 'FOUND'
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        I Found Something
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Item Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Electronics">Electronics (Laptops, Earbuds, Phones)</option>
                      <option value="Bags">Bags & Backpacks</option>
                      <option value="Wallets & Cards">Wallets, Student IDs & Cards</option>
                      <option value="Keys">Keys & Keychains</option>
                      <option value="Clothing">Clothing & Accessories</option>
                      <option value="Pets / Accessories">Pets / Personal Belongings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Title / Item Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Matte Black SwissGear Laptop Bag"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all"
                  >
                    Next: Location & Time
                  </button>
                </div>
              )}

              {/* STEP 2: Location & Priority */}
              {formStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Campus Building</label>
                    <select
                      value={formData.building}
                      onChange={(e) => setFormData({...formData, building: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Main Library">Main Library</option>
                      <option value="Engineering Block">Engineering Block</option>
                      <option value="Student Center">Student Center & Dining Pavilion</option>
                      <option value="South Quad">South Quad Lawn & Dorms</option>
                      <option value="Science Hall">Science Hall</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Specific Spot / Room</label>
                    <input
                      type="text"
                      placeholder="e.g. 2nd floor silent reading room, desk 14"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Priority Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({...formData, priority: p})}
                          className={`py-2.5 rounded-xl border text-xs font-bold ${
                            formData.priority === p 
                              ? 'bg-blue-600 border-blue-400 text-white' 
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          {p} Priority
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="w-1/2 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="w-1/2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
                    >
                      Next: Appearance Details
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Appearance Attributes */}
              {formStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Primary Color</label>
                      <input
                        type="text"
                        placeholder="e.g. Black, Silver, Navy"
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Brand / Model</label>
                      <input
                        type="text"
                        placeholder="e.g. Apple, SwissGear, Sony"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Public Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe general features visible to anyone..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormStep(2)}
                      className="w-1/2 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStep(4)}
                      className="w-1/2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
                    >
                      Next: Secret Trait
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Secret Verification Trait */}
              {formStep === 4 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block mb-1">Privacy Shield Protection</strong>
                      The Secret Trait is hidden from public lists. When someone claims this item, they must answer this detail to prove ownership.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                      {reportType === 'LOST' ? 'Secret Owner Trait (Only You Know)' : 'Hidden Finder Detail'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Red dragon keychain inside front pocket, or engraved initials 'J.D.'"
                      value={formData.secretTrait}
                      onChange={(e) => setFormData({...formData, secretTrait: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setFormStep(3)}
                      className="w-1/2 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold text-sm shadow-xl shadow-blue-600/30"
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

        {/* TAB 5: CLAIMS & ANONYMOUS CHAT HUB */}
        {activeTab === 'claims' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Claims & Handover Management */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <span>Claims & Ownership Proof Hub</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Manage active claims, submit hidden proof answers, and generate handover QR/OTP tokens for campus custody desks.
                </p>
              </div>

              {/* Active Verification Card */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Award className="w-8 h-8 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">Claim #CLM-9082</h3>
                      <p className="text-xs text-slate-400">Target Item: Matte Black Laptop Backpack (#LOST-101)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-bold">
                    Under Review
                  </span>
                </div>

                {/* Handover OTP Box */}
                {otpCode ? (
                  <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-950/60 to-slate-900 border border-emerald-500/40 text-center space-y-3">
                    <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                      <QrCode className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-white text-base">Verified Pickup Token</h4>
                    <p className="text-xs text-slate-300">Show this code at Custody Desk A (Main Library 1st Floor):</p>
                    <div className="text-3xl font-black tracking-widest text-emerald-400 bg-slate-950 py-3 rounded-xl border border-emerald-500/30">
                      {otpCode}
                    </div>
                    <p className="text-[11px] text-slate-400">Expires in 24 hours. Verified with Student ID.</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs text-slate-300 font-semibold">
                      To complete handover, submit secret trait answer to Security Desk:
                    </div>
                    <form onSubmit={handleClaimSubmit} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Describe the hidden trait..."
                        value={claimInput}
                        onChange={(e) => setClaimInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Verify & Generate OTP
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </div>

            {/* Privacy Shield Anonymous Chat Box */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between h-[520px]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-white text-sm">{t.chatTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {t.verifiedBadge}
                  </span>
                </div>

                {/* Message Log */}
                <div className="mt-4 space-y-3 overflow-y-auto max-h-[340px] pr-1">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl text-xs space-y-1 ${
                        msg.sender === 'You'
                          ? 'bg-blue-600 text-white ml-6'
                          : msg.sender === 'System'
                          ? 'bg-slate-950 text-slate-400 text-center border border-slate-800'
                          : 'bg-slate-800 text-slate-200 mr-6'
                      }`}
                    >
                      {msg.sender !== 'System' && (
                        <div className="font-bold text-[10px] opacity-80">{msg.sender} • {msg.time}</div>
                      )}
                      <div>{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type anonymous message..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>
        )}

      </main>

      {/* ITEM DETAIL MODAL POPUP */}
      {selectedItem && !showClaimModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                selectedItem.type === 'LOST'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {selectedItem.type}
              </span>
              <span className="text-xs text-slate-400">ID: {selectedItem.id}</span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{selectedItem.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Category</div>
                <div className="font-semibold text-slate-200">{selectedItem.category}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Building Zone</div>
                <div className="font-semibold text-slate-200">{selectedItem.building}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Brand / Color</div>
                <div className="font-semibold text-slate-200">{selectedItem.brand} ({selectedItem.color})</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-slate-500">Campus Trust Score</div>
                <div className="font-semibold text-emerald-400">{selectedItem.trustScore}/100</div>
              </div>
            </div>

            {/* Secret Trait Display */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="font-bold text-amber-400 mb-1 flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1" />
                Secret Verification Trait
              </div>
              <p className="text-slate-300">{selectedItem.secretTrait}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => setShowClaimModal(true)}
                className="w-1/2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                {t.claimBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLAIM PROOF MODAL */}
      {showClaimModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative">
            <button
              onClick={() => { setShowClaimModal(false); setClaimSuccess(false); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Prove Ownership</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To prevent unauthorized claims, please describe the secret trait or hidden identifier for <strong>"{selectedItem.title}"</strong>.
            </p>

            {claimSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">Claim Submitted Successfully!</div>
                <div className="text-xs text-slate-300">Your proof has been routed to campus security desk for verification.</div>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Your Ownership Answer</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe specific keychains, markings, stickers or contents..."
                    value={claimInput}
                    onChange={(e) => setClaimInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Verify Proof & File Claim
                </button>
              </form>
            )}

            <button
              onClick={() => { setShowClaimModal(false); setClaimSuccess(false); }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
            >
              Back to Items
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
