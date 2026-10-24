import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  LayoutDashboard,
  MapPin,
  ArrowLeftRight,
  QrCode,
  ShieldCheck,
  MessageSquare,
  ShieldAlert,
  PlusCircle,
  Search,
  Sun,
  Moon,
  Bell,
  Sparkles,
  LogIn,
  UserCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  User,
  ItemReport,
  PotentialMatch,
  OwnershipClaim,
  CustodyDesk,
  ChatConversation,
  ChatMessage,
  AppNotification,
  VerificationRequestRecord,
  DisputeRecord,
  AuditLogEntry,
  ReportType,
  CanvasZoneId,
} from './types';
import { Language, translations } from './i18n';
import { CampusMapView } from './components/CampusMapView';
import { MatchingDashboard } from './components/MatchingDashboard';
import { ReportWizardModal } from './components/ReportWizardModal';
import { ClaimsAndHandoverView } from './components/ClaimsAndHandoverView';
import { VerificationCenterView } from './components/VerificationCenterView';
import {
  SecureChatView,
  ItemDetailView,
  AdminGovernancePortal,
} from './components/AdminAndChatViews';
import { InteractiveCanvasWorkspace } from './components/InteractiveCanvasWorkspace';

type ActiveView =
  | 'landing'
  | 'dashboard'
  | 'explore'
  | 'map'
  | 'matches'
  | 'claims'
  | 'verification'
  | 'chat'
  | 'admin'
  | 'item_detail';

export default function App() {
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('findora_theme');
    return saved ? saved === 'dark' : true;
  });
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('findora_lang') as Language;
    return saved === 'hi' ? 'hi' : 'en';
  });

  const t = translations[lang];

  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<ItemReport[]>([]);
  const [matches, setMatches] = useState<PotentialMatch[]>([]);
  const [claims, setClaims] = useState<OwnershipClaim[]>([]);
  const [custodyDesks, setCustodyDesks] = useState<CustodyDesk[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequestRecord[]>([]);
  const [disputes, setDisputes] = useState<DisputeRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [stats, setStats] = useState({
    activeLostCount: 0,
    activeFoundCount: 0,
    matchedCount: 0,
    returnedCount: 0,
    custodyDesksCount: 3,
  });

  // Modals & Selection State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState<ReportType>('lost');
  const [reportModalCoords, setReportModalCoords] = useState<
    { lat: number; lng: number; label?: string } | undefined
  >(undefined);
  const [selectedReport, setSelectedReport] = useState<ItemReport | null>(null);
  const [canvasExternalTrigger, setCanvasExternalTrigger] = useState<{
    report: ItemReport;
    zoneId: CanvasZoneId;
    ts: number;
  } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authIdentifier, setAuthIdentifier] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Explore Search & AI Discovery State
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiSearchSummary, setAiSearchSummary] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found'>('all');

  // Listen to Google Maps Platform Quota Exceeded event (Tier 1 & Tier 2)
  useEffect(() => {
    const handler = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('findora_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('findora_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('findora_lang', lang);
  }, [lang]);

  const getToken = () => {
    let tok = localStorage.getItem('findora_token');
    if (!tok) {
      tok = 'demo-token-student';
      localStorage.setItem('findora_token', tok);
    }
    return tok;
  };

  const fetchBootstrapData = useCallback(async () => {
    const token = getToken();
    try {
      const res = await fetch('/api/bootstrap', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data.user || null);
      setReports(data.reports || []);
      setMatches(data.matches || []);
      setClaims(data.claims || []);
      setCustodyDesks(data.custodyDesks || []);
      setConversations(data.conversations || []);
      setMessages(data.messages || []);
      setNotifications(data.notifications || []);
      setVerificationRequests(data.verificationRequests || []);
      setDisputes(data.disputes || []);
      setAuditLogs(data.auditLogs || []);
      if (data.stats) setStats(data.stats);
    } catch {
      // handled gracefully
    }
  }, []);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  const handleQuickRoleSwitch = async (demoRole: 'student' | 'finder' | 'staff' | 'admin') => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole }),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem('findora_token', data.token);
      await fetchBootstrapData();
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body =
      authMode === 'login'
        ? { identifier: authIdentifier, password: authPassword }
        : {
            email: authIdentifier,
            username: authUsername,
            fullName: authFullName,
            password: authPassword,
          };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      localStorage.setItem('findora_token', data.token);
      setAuthModalOpen(false);
      await fetchBootstrapData();
      setActiveView('dashboard');
    } catch (err: any) {
      setAuthError(err?.message || 'Network error');
    }
  };

  const handleOpenReportWizard = (
    type: ReportType,
    coords?: { lat: number; lng: number; label?: string }
  ) => {
    setReportModalType(type);
    setReportModalCoords(coords);
    setReportModalOpen(true);
  };

  const handleCreateReport = async (payload: any) => {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create report');
    await fetchBootstrapData();
    return data;
  };

  const handleUpdateMatchStatus = async (
    matchId: string,
    status: PotentialMatch['status']
  ) => {
    await fetch(`/api/matches/${matchId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    await fetchBootstrapData();
  };

  const handleAnalyzeMatchesForReport = async (
    reportId: string
  ): Promise<{ report: ItemReport; matches: PotentialMatch[] }> => {
    const res = await fetch(`/api/matches/analyze/${reportId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to analyze matches');
    await fetchBootstrapData();
    return data;
  };

  const handleArchiveReport = async (reportId: string) => {
    const res = await fetch(`/api/reports/${reportId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to archive report');
    await fetchBootstrapData();
  };

  const handleRestoreReport = async (reportId: string) => {
    const res = await fetch(`/api/reports/${reportId}/restore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to restore report');
    await fetchBootstrapData();
  };

  const handleSubmitClaim = async (payload: any) => {
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit claim');
    await fetchBootstrapData();
  };

  const handleReviewClaim = async (
    claimId: string,
    decision: 'approved' | 'rejected',
    reviewerNotes: string
  ) => {
    const res = await fetch(`/api/claims/${claimId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ decision, reviewerNotes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to review claim');
    await fetchBootstrapData();
  };

  const handleValidateHandover = async (
    codeOrToken: string,
    custodyDeskId: string,
    staffNotes: string
  ): Promise<string> => {
    const res = await fetch('/api/handover/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ codeOrToken, custodyDeskId, staffNotes }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Handover validation failed');
    await fetchBootstrapData();
    return data.message;
  };

  const handleRegenerateToken = async (
    claimId: string,
    custodyDeskId?: string,
    pickupWindow?: string
  ) => {
    const res = await fetch(`/api/handover/${claimId}/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ custodyDeskId, pickupWindow }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to refresh pickup token');
    await fetchBootstrapData();
  };

  const handleSendChatMessage = async (conversationId: string, text: string) => {
    await fetch(`/api/chat/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ text }),
    });
    await fetchBootstrapData();
  };

  const handleReviewTier3 = async (reqId: string, decision: 'approved' | 'rejected') => {
    await fetch(`/api/admin/verification/${reqId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ decision }),
    });
    await fetchBootstrapData();
  };

  const handleResolveDispute = async (disputeId: string, resolutionNotes: string) => {
    await fetch(`/api/admin/disputes/${disputeId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ resolutionNotes }),
    });
    await fetchBootstrapData();
  };

  const handleReportChatAbuse = async (conversationId: string, reason: string) => {
    await fetch(`/api/chat/${conversationId}/report-abuse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ reason }),
    });
    await fetchBootstrapData();
  };

  const handleFlagReport = async (reportId: string, flagged: boolean) => {
    await fetch(`/api/admin/reports/${reportId}/flag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ flagged }),
    });
    await fetchBootstrapData();
  };

  const handleRunAiSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiSearching(true);
    setAiSearchSummary(null);
    try {
      const res = await fetch('/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
        setAiSearchSummary(data.summary);
        setActiveView('explore');
      }
    } finally {
      setAiSearching(false);
    }
  };

  const filteredExploreReports = reports.filter((r) => {
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return `${r.title} ${r.category} ${r.color} ${r.brand} ${r.buildingName} ${r.campusZone}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Required Google Maps Platform Demo Quota Banner (Tier 1 & Tier 2) */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* TOP BAR CONTRACT: Strictly 3 zones separated by gap-8 */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveView('landing');
          }}
          className="text-xl font-normal not-italic underline text-justify tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 font-display"
        >
          {t.brand}
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'dashboard' ? 'text-blue-600 dark:text-blue-400 underline underline-offset-8' : ''
            }`}
          >
            {t.navDashboard}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('map')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'map' ? 'text-blue-600 dark:text-blue-400 underline underline-offset-8' : ''
            }`}
          >
            {t.navMap}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('matches')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'matches' ? 'text-blue-600 dark:text-blue-400 underline underline-offset-8' : ''
            }`}
          >
            {t.navMatches}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('claims')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'claims' ? 'text-blue-600 dark:text-blue-400 underline underline-offset-8' : ''
            }`}
          >
            {t.navClaims}
          </button>
          <button
            type="button"
            onClick={() => setActiveView('explore')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeView === 'explore' ? 'text-blue-600 dark:text-blue-400 underline underline-offset-8' : ''
            }`}
          >
            {t.navExplore}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleOpenReportWizard('lost')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
          >
            {t.ctaReportLost}
          </button>
        </div>
      </header>

      {/* Secondary Workspace Controls Bar (Role Switcher, Language, Theme, Auth) */}
      <div className="bg-slate-100/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Active Session:
          </span>
          {user && (
            <span className="font-semibold text-slate-900 dark:text-white">
              {user.fullName} · Tier {user.tier} Verified · Trust Score {user.trustScore}
            </span>
          )}
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-500">Quick Evaluation Role:</span>
          {(
            [
              { key: 'student', label: 'Student (Tier 3)' },
              { key: 'finder', label: 'Finder (Tier 2)' },
              { key: 'staff', label: 'Custody Desk Staff' },
              { key: 'admin', label: 'Platform Admin' },
            ] as const
          ).map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => handleQuickRoleSwitch(r.key)}
              className={`px-2.5 py-1 rounded font-medium transition-colors whitespace-nowrap shrink-0 ${
                (r.key === 'student' && user?.id === 'usr-student-1') ||
                (r.key === 'finder' && user?.id === 'usr-finder-2') ||
                (r.key === 'staff' && user?.id === 'usr-staff-3') ||
                (r.key === 'admin' && user?.id === 'usr-admin-4')
                  ? 'bg-slate-900 dark:bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher (English / Hindi) */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            {lang === 'en' ? 'EN · हिन्दी' : 'हिन्दी · EN'}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle color theme"
            className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0"
          >
            <LogIn className="w-3.5 h-3.5" />
            Switch / Register Account
          </button>
        </div>
      </div>

      {/* Main Content Layout: Landing Page OR Workspace Sidebar + Viewport */}
      {activeView === 'landing' ? (
        <main className="flex-1">
          {/* HERO SECTION */}
          <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <div className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400">
                  {t.promiseBanner}
                </div>

                <h1
                  className="font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                >
                  {t.heroHeadline}
                </h1>

                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  {t.heroSub}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReportWizard('lost')}
                    className="px-6 py-3 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                  >
                    {t.ctaReportLost}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenReportWizard('found')}
                    className="px-5 py-3 text-sm font-semibold bg-slate-900 dark:bg-slate-800 text-white rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                  >
                    {t.ctaReportFound}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('map')}
                    className="px-5 py-3 text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    {t.ctaExploreMap}
                  </button>
                </div>

                {/* Natural Language AI Discovery Bar */}
                <form onSubmit={handleRunAiSmartSearch} className="pt-2">
                  <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2 flex-1 px-2">
                      <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                      <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        placeholder={t.aiDiscoveryPlaceholder}
                        className="w-full text-xs bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={aiSearching}
                      className="px-4 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors whitespace-nowrap shrink-0"
                    >
                      {aiSearching ? 'Searching...' : t.runAiSearch}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Live Interactive Match Preview Card */}
              <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <div className="text-xs text-slate-500">
                      Live Database Match Demonstration
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Explainable Multi-Signal Match Engine
                    </h3>
                  </div>
                  <span className="text-lg font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                    {matches[0]?.totalScore || 94}% Similarity
                  </span>
                </div>

                {matches[0] ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        LOST REPORT · {matches[0].lostReport?.id}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {matches[0].lostReport?.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {matches[0].lostReport?.buildingName} · {matches[0].lostReport?.color}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {matches[0].lostReport?.distinguishingFeatures}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        FOUND REPORT · {matches[0].foundReport?.id}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {matches[0].foundReport?.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {matches[0].foundReport?.approximateLocationLabel} · {matches[0].foundReport?.color}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {matches[0].foundReport?.distinguishingFeatures}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Why These Reports Matched:
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    {(
                      matches[0]?.explanations || [
                        'Identical item category: Electronics',
                        'Matching color profile: Space Gray',
                        'Reported 55m apart near Central Academic Commons',
                      ]
                    ).join(' · ')}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveView('matches')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open Side-by-Side Matching Dashboard →
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('claims')}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Test QR / OTP Handover →
                  </button>
                </div>
              </div>
            </div>

            {/* Full-Width Real Platform Metrics Strip Below Hero Split */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Active Lost Reports', val: stats.activeLostCount },
                { label: 'Active Found Reports', val: stats.activeFoundCount },
                { label: 'Candidate Matches', val: stats.matchedCount },
                { label: 'Verified Returns', val: stats.returnedCount },
                { label: 'Authorized Custody Desks', val: stats.custodyDesksCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                    {stat.val}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* HOW FINDORA WORKS: 5-PILLAR ARCHITECTURE */}
          <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Engineered for High-Trust Campus &amp; Community Recovery
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Every workflow is backed by server-side verification, location privacy guardrails, and auditable custody handovers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveView('map')}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  01. Interactive Campus Discovery Map
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Powered by Google Maps Platform with Advanced Markers and Places search. Filter lost and found reports by category, inspect approximate privacy zones, and locate nearby authorized Custody Desks.
                </p>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  Launch Campus Map →
                </div>
              </div>

              <div
                onClick={() => setActiveView('verification')}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  02. Three-Tier Identity Verification
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Progressive trust across Tier 1 (Campus Email), Tier 2 (SMS Phone OTP required for reporting), and Tier 3 (Institutional Student/Staff ID with private auto-purged storage).
                </p>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  Open Verification Center →
                </div>
              </div>

              <div
                onClick={() => setActiveView('claims')}
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  03. Short-Lived QR &amp; OTP Custody Handover
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When an ownership claim is approved, Findora issues a short-lived QR code and 6-digit OTP. Authorized Custody Desk officers validate it atomically and record a permanent audit trail.
                </p>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  Open Handover Terminal →
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* WORKSPACE LAYOUT: Desktop 256px Sidebar + Main Viewport */
        <div className="flex-1 flex max-w-[1440px] w-full mx-auto">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-6">
            <div className="space-y-1">
              {(
                [
                  { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
                  { id: 'map', label: t.navMap, icon: MapPin },
                  { id: 'matches', label: t.navMatches, icon: ArrowLeftRight },
                  { id: 'claims', label: t.navClaims, icon: QrCode },
                  { id: 'explore', label: t.navExplore, icon: Compass },
                  { id: 'verification', label: t.navVerification, icon: ShieldCheck },
                  { id: 'chat', label: t.navChat, icon: MessageSquare },
                  { id: 'admin', label: t.navAdmin, icon: ShieldAlert },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const active = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                type="button"
                onClick={() => handleOpenReportWizard('lost')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                {t.ctaReportLost}
              </button>
              <button
                type="button"
                onClick={() => handleOpenReportWizard('found')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                {t.ctaReportFound}
              </button>
            </div>
          </aside>

          {/* Main Workspace Viewport */}
          <main className="flex-1 p-6 pb-24 lg:pb-10 overflow-x-hidden">
            {/* VIEW: INTERACTIVE CANVAS PROTOCOL WORKSPACE (MAIN DASHBOARD) */}
            {activeView === 'dashboard' && user && (
              <InteractiveCanvasWorkspace
                user={user}
                reports={reports}
                matches={matches}
                claims={claims}
                custodyDesks={custodyDesks}
                notifications={notifications}
                auditLogs={auditLogs}
                externalTrigger={canvasExternalTrigger}
                onCreateReport={handleCreateReport}
                onAnalyzeMatchesForReport={handleAnalyzeMatchesForReport}
                onUpdateMatchStatus={handleUpdateMatchStatus}
                onSubmitClaim={handleSubmitClaim}
                onReviewClaim={handleReviewClaim}
                onValidateHandover={handleValidateHandover}
                onRegenerateToken={handleRegenerateToken}
                onArchiveReport={handleArchiveReport}
                onRestoreReport={handleRestoreReport}
                onQuickRoleSwitch={handleQuickRoleSwitch}
                onNavigateView={(v) => setActiveView(v)}
              />
            )}

            {/* VIEW: EXPLORE REPORTS */}
            {activeView === 'explore' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Explore Campus Lost &amp; Found Reports
                    </h2>
                    {aiSearchSummary && (
                      <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                        AI Discovery Filter: {aiSearchSummary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg">
                      {(['all', 'lost', 'found'] as const).map((tf) => (
                        <button
                          key={tf}
                          type="button"
                          onClick={() => setTypeFilter(tf)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${
                            typeFilter === tf
                              ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredExploreReports.map((rep) => (
                    <div
                      key={rep.id}
                      onClick={() => {
                        setSelectedReport(rep);
                        setActiveView('item_detail');
                      }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {rep.images?.[0] && (
                          <img
                            src={rep.images[0].url}
                            alt={rep.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-44 object-cover border-b border-slate-200 dark:border-slate-800"
                          />
                        )}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <span
                              className={
                                rep.type === 'lost'
                                  ? 'font-bold uppercase text-rose-600'
                                  : 'font-bold uppercase text-emerald-600'
                              }
                            >
                              {rep.type}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{rep.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="capitalize">{rep.status}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                            {rep.title}
                          </h3>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {rep.distinguishingFeatures}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span className="truncate">{rep.approximateLocationLabel}</span>
                        <span className="font-mono tabular-nums shrink-0">{rep.incidentDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: INTERACTIVE CAMPUS MAP */}
            {activeView === 'map' && (
              <CampusMapView
                reports={reports}
                custodyDesks={custodyDesks}
                onSelectReport={(rep) => {
                  setSelectedReport(rep);
                  setActiveView('item_detail');
                }}
                onSendToCanvasZone={(rep, zoneId) => {
                  setCanvasExternalTrigger({ report: rep, zoneId, ts: Date.now() });
                  setActiveView('dashboard');
                }}
                onReportLostClick={(coords) => handleOpenReportWizard('lost', coords)}
              />
            )}

            {/* VIEW: INTELLIGENT MATCHING DASHBOARD */}
            {activeView === 'matches' && (
              <MatchingDashboard
                matches={matches}
                onOpenClaimModal={(m) => {
                  if (m.foundReport) {
                    setSelectedReport(m.foundReport);
                    setActiveView('item_detail');
                  }
                }}
                onUpdateMatchStatus={handleUpdateMatchStatus}
                onSelectReport={(rep) => {
                  setSelectedReport(rep);
                  setActiveView('item_detail');
                }}
              />
            )}

            {/* VIEW: CLAIMS & SECURE QR/OTP HANDOVER */}
            {activeView === 'claims' && user && (
              <ClaimsAndHandoverView
                user={user}
                claims={claims}
                custodyDesks={custodyDesks}
                auditLogs={auditLogs}
                onReviewClaim={handleReviewClaim}
                onValidateHandover={handleValidateHandover}
                onRegenerateToken={handleRegenerateToken}
                onQuickSwitchToStaff={() => handleQuickRoleSwitch('staff')}
              />
            )}

            {/* VIEW: THREE-TIER IDENTITY VERIFICATION */}
            {activeView === 'verification' && user && (
              <VerificationCenterView user={user} onUserUpdated={(u) => setUser(u)} />
            )}

            {/* VIEW: SECURE IN-APP CHAT */}
            {activeView === 'chat' && user && (
              <SecureChatView
                user={user}
                conversations={conversations}
                messages={messages}
                onSendMessage={handleSendChatMessage}
                onReportAbuse={handleReportChatAbuse}
              />
            )}

            {/* VIEW: ITEM REPORT DETAIL & CLAIM FORM */}
            {activeView === 'item_detail' && selectedReport && (
              <ItemDetailView
                report={selectedReport}
                matches={matches}
                custodyDesks={custodyDesks}
                onBack={() => setActiveView('explore')}
                onSubmitClaim={handleSubmitClaim}
              />
            )}

            {/* VIEW: ADMIN & SECURITY-DESK PORTAL */}
            {activeView === 'admin' && user && (
              <AdminGovernancePortal
                user={user}
                reports={reports}
                custodyDesks={custodyDesks}
                verificationRequests={verificationRequests}
                disputes={disputes}
                auditLogs={auditLogs}
                onReviewTier3={handleReviewTier3}
                onResolveDispute={handleResolveDispute}
                onFlagReport={handleFlagReport}
                onArchiveReport={handleArchiveReport}
              />
            )}
          </main>
        </div>
      )}

      {/* Dedicated Mobile Bottom Navigation Bar (<= 15% mobile viewport height) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 grid grid-cols-5 gap-1">
        {(
          [
            { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
            { id: 'map', label: 'Map', icon: MapPin },
            { id: 'matches', label: 'Matches', icon: ArrowLeftRight },
            { id: 'claims', label: 'QR/OTP', icon: QrCode },
            { id: 'verification', label: 'Verify', icon: ShieldCheck },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-medium ${
                active
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quiet Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Findora</span> — Intelligent Digital Lost &amp; Found Platform · Lost it. Found it. Back to you.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveView('verification')}
              className="hover:underline"
            >
              Privacy &amp; Data Retention Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className="hover:underline"
            >
              Custody &amp; Audit Governance
            </button>
          </div>
        </div>
      </footer>

      {/* 4-Step Guided Report Wizard Modal */}
      {reportModalOpen && (
        <ReportWizardModal
          initialType={reportModalType}
          initialCoords={reportModalCoords}
          custodyDesks={custodyDesks}
          reports={reports}
          onClose={() => setReportModalOpen(false)}
          onSubmitReport={handleCreateReport}
        />
      )}

      {/* Sign In / Create Account Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                {authMode === 'login' ? 'Sign In to Findora' : 'Create Campus Account'}
              </h3>
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white'
                    : 'text-slate-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white'
                    : 'text-slate-500'
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 rounded-lg">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={authFullName}
                      onChange={(e) => setAuthFullName(e.target.value)}
                      placeholder="e.g., Rohan Verma"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Username *</label>
                    <input
                      type="text"
                      required
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      placeholder="e.g., rohan_v"
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {authMode === 'login' ? 'Campus Email or Username *' : 'Campus Email *'}
                </label>
                <input
                  type="text"
                  required
                  value={authIdentifier}
                  onChange={(e) => setAuthIdentifier(e.target.value)}
                  placeholder="arjun.mehta@campus.edu"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                {authMode === 'login' ? 'Sign In' : 'Register & Continue to Verification'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
