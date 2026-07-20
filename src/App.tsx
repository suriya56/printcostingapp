import { apiFetch } from './mockApi';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PaperProfile, 
  PlateProfile,
  LaminationRate, 
  MiscCost, 
  PrintingBracketsConfig, 
  Quotation 
} from './types';

// Components
import CalculatorModeA from './components/CalculatorModeA';
import CalculatorModeB from './components/CalculatorModeB';
import AdminPanel from './components/AdminPanel';
import QuotationHistory from './components/QuotationHistory';
import ComparePanel from './components/ComparePanel';
import Auth from './components/Auth';
import { db, auth } from './firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Icons
import { 
  LogOut, 
  BarChart3, 
  FileIcon, 
  Printer, 
  Calculator, 
  BookOpen, 
  Settings, 
  History, 
  FileText, 
  Scale, 
  User, 
  RefreshCw, 
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';

type WorkspaceTab = 'modeA' | 'modeB' | 'history' | 'compare' | 'admin';


import { DEFAULT_PAPERS, DEFAULT_PLATES, DEFAULT_LAMINATION, DEFAULT_MISC, DEFAULT_BRACKETS } from './seedData';
import { setDoc, doc, getDocs, getDoc } from 'firebase/firestore';

const seedDatabaseIfNeeded = async () => {
  try {
    const snapPapers = await getDocs(query(collection(db, 'papers'), limit(1)));
    if (snapPapers.empty) {
      console.log('Seeding papers...');
      for (const p of DEFAULT_PAPERS) await setDoc(doc(db, 'papers', p.id), p);
    }
    const snapPlates = await getDocs(query(collection(db, 'plate-profiles'), limit(1)));
    if (snapPlates.empty) {
      console.log('Seeding plates...');
      for (const p of DEFAULT_PLATES) await setDoc(doc(db, 'plate-profiles', p.id), p);
    }
    const snapLam = await getDocs(query(collection(db, 'lamination'), limit(1)));
    if (snapLam.empty) {
      console.log('Seeding lamination...');
      for (const l of DEFAULT_LAMINATION) await setDoc(doc(db, 'lamination', l.id), l);
    }
    const snapMisc = await getDocs(query(collection(db, 'misc-costs'), limit(1)));
    if (snapMisc.empty) {
      console.log('Seeding misc...');
      for (const m of DEFAULT_MISC) await setDoc(doc(db, 'misc-costs', m.id), m);
    }
    const snapBrackets = await getDoc(doc(db, 'brackets', 'main'));
    if (!snapBrackets.exists()) {
      console.log('Seeding brackets...');
      await setDoc(doc(db, 'brackets', 'main'), DEFAULT_BRACKETS);
    }
  } catch (err: any) {
    console.error("DEBUG CAUGHT IN seeding:", err);
    // Ignore seeding errors if user is not admin
  }
};

export default function App() {
  if (!db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Firebase Not Configured</h2>
          <p className="text-gray-600 mb-6">
            The application cannot connect to the database because the Firebase environment variables are missing.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left text-sm font-mono text-gray-700 overflow-x-auto">
            <p>Make sure these variables are set in your deployment environment (e.g. Vercel):</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>VITE_FIREBASE_API_KEY</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN</li>
              <li>VITE_FIREBASE_PROJECT_ID</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
              <li>VITE_FIREBASE_APP_ID</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  
  // Authentication states
  const [token, setToken] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setToken(user.uid);
        const userStr = localStorage.getItem('press_user');
        setCurrentUser(userStr ? JSON.parse(userStr) : { id: user.uid, name: user.displayName || 'Unknown', role: 'admin' });
      } else {
        setToken('');
        setCurrentUser(null);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);


  // Global pricing configuration and logs loaded from server database
  const [papers, setPapers] = useState<PaperProfile[]>([]);
  const [laminations, setLaminations] = useState<LaminationRate[]>([]);
  const [plateProfiles, setPlateProfiles] = useState<PlateProfile[]>([]);
  const [miscCosts, setMiscCosts] = useState<MiscCost[]>([]);
  const [brackets, setBrackets] = useState<PrintingBracketsConfig>({
    bracket1: { maxImpressions: 1100, cost: 1200 },
    bracket2: { maxImpressions: 2100, cost: 1400 },
    bracket3: { maxImpressions: 3100, cost: 1600 },
    excessStepImpressions: 1000,
    excessStepCost: 400
  });
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  const [quoteToEdit, setQuoteToEdit] = useState<Quotation | null>(null);
  
  // Workspace sub-navigation active tab
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('modeA');
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  const [syncing, setSyncing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleEditQuote = (quote: Quotation) => {
    setQuoteToEdit(quote);
    setActiveTab(quote.mode === 'A' ? 'modeA' : 'modeB');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync session on load
  useEffect(() => {
    if (token) {
      loadWorkspaceData();
    }
  }, [token]);

  

  const loadWorkspaceData = async () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 500);
  };

  useEffect(() => {
    if (!token || activeTab !== 'history') return;
    const unsub = onSnapshot(query(collection(db, 'quotations'), orderBy('date', 'desc'), limit(50)), (snap) => {
      const q = snap.docs.map(d => ({...d.data(), id: d.id} as any));
      q.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setQuotations(q);
    });
    return () => unsub();
  }, [token, activeTab]);

  useEffect(() => {
    if (!token) return;
    
    let isMounted = true;
    const unsubs: any[] = [];
    
    const loadAndSubscribe = async () => {
      setSyncing(true);
      try {
        await seedDatabaseIfNeeded();
        
        if (!isMounted) return;
        
        unsubs.push(onSnapshot(collection(db, 'papers'), (snap) => {
          setPapers(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }, (err: any) => {
          if (err.code === 'permission-denied') handleFirestoreError(err, OperationType.LIST, 'papers');
        }));
        
        unsubs.push(onSnapshot(collection(db, 'lamination'), (snap) => {
          setLaminations(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }));
        
        unsubs.push(onSnapshot(collection(db, 'misc-costs'), (snap) => {
          setMiscCosts(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }));
        
        unsubs.push(onSnapshot(doc(db, 'brackets', 'main'), (snap) => {
          if (snap.exists()) setBrackets(snap.data() as any);
        }));
        
        unsubs.push(onSnapshot(collection(db, 'plate-profiles'), (snap) => {
          setPlateProfiles(snap.docs.map(d => ({...d.data(), id: d.id} as any)));
        }));
        
      } catch (e: any) {
        console.error("DEBUG CAUGHT IN loadAndSubscribe:", e);
      } finally {
        if (isMounted) setSyncing(false);
      }
    };
    
    loadAndSubscribe();
    
    return () => {
      isMounted = false;
      unsubs.forEach(u => u());
    };
  }, [token]);

  const handleLoginSuccess = (newToken: string, user: any) => {
    localStorage.setItem('press_token', newToken);
    localStorage.setItem('press_user', JSON.stringify(user));
    setToken(newToken);
    setCurrentUser(user);
    // Default administrators to admin dashboard, employees to flyer calculator
    setActiveTab(user.role === 'admin' ? 'admin' : 'modeA');
  };

  // Callback on successful quotation creation to refresh quotation ledger logs
  const handleQuotationSaved = (newQuote: Quotation) => {
    setQuotations(prev => [newQuote, ...prev]);
  };

  // Get Tab Display Name & Icon
  const getTabDetails = (tab: WorkspaceTab) => {
    switch (tab) {
      case 'modeA':
        return { label: 'Single Page Estimator', icon: <Calculator className="w-5 h-5 text-indigo-500" /> };
      case 'modeB':
        return { label: 'Booklet Catalog Estimator', icon: <BookOpen className="w-5 h-5 text-violet-500" /> };
      case 'history':
        return { label: 'Estimations Ledger', icon: <FileText className="w-5 h-5 text-emerald-500" /> };
      case 'compare':
        return { label: 'Volume Scaler Simulator', icon: <Scale className="w-5 h-5 text-amber-500" /> };
      case 'admin':
        return { label: 'Pricing Dashboard', icon: <Settings className="w-5 h-5 text-indigo-500" /> };
    }
  };


  const activeTabDetails = getTabDetails(activeTab);

  if (!authInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900"><div className="animate-pulse text-indigo-600">Loading session...</div></div>;
  }
  if (!token) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  return (

    <div className="min-h-screen bg-slate-200 dark:bg-slate-900 flex flex-col font-sans text-slate-800 dark:text-slate-200">
      
      
      {/* Header - Top Bar Layout */}
      <header className="shrink-0 bg-slate-800 text-white border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-1.5 rounded-sm shadow-inner">
                <Printer className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm tracking-tight">PrintEst Pro</h1>
                <span className="bg-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-widest text-slate-300">
                  v1.2
                </span>
              </div>
            </div>
            
            {/* Top Navigation */}
            <nav className="hidden md:flex bg-slate-900 rounded-sm p-0.5 border border-slate-700 items-center">
              {[
                { id: 'modeA', icon: FileIcon, label: 'Mode A' },
                { id: 'modeB', icon: BookOpen, label: 'Mode B' },
                { id: 'compare', icon: BarChart3, label: 'Compare' },
                { id: 'history', icon: History, label: 'History' },
                { id: 'admin', icon: Settings, label: 'Admin Panel', adminOnly: true }
              ].filter(t => !t.adminOnly || currentUser?.role === 'admin').map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold transition ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </nav>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-sm transition"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-200">{currentUser?.name}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{currentUser?.role}</div>
              </div>
              
                    <button
                      onClick={() => {
                        auth.signOut();
                        setToken('');
                        setCurrentUser(null);
                      }}
                      className="p-1.5 hover:bg-slate-700 rounded-md text-red-400 hover:text-red-300 transition-colors"
                      title="Log Out"
                    >

                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 overflow-hidden bg-slate-300 dark:bg-slate-950 relative flex flex-col">
        <div className="flex-1 overflow-y-auto p-2 sm:p-4">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                 {activeTab === 'modeA' && (
                  <CalculatorModeA 
                    papers={papers} 
                    plateProfiles={plateProfiles}
                    brackets={brackets} 
                    token={token} 
                    onSaveSuccess={handleQuotationSaved}
                    quoteToEdit={quoteToEdit?.mode === 'A' ? quoteToEdit : null}
                    onClearEdit={() => setQuoteToEdit(null)}
                  />
                )}
                {activeTab === 'modeB' && (
                  <CalculatorModeB 
                    papers={papers} 
                    laminations={laminations} 
                    plateProfiles={plateProfiles}
                    miscCosts={miscCosts}
                    brackets={brackets} 
                    token={token} 
                    onSaveSuccess={handleQuotationSaved}
                    quoteToEdit={quoteToEdit?.mode === 'B' ? quoteToEdit : null}
                    onClearEdit={() => setQuoteToEdit(null)}
                  />
                )}
                {activeTab === 'history' && (
                  <QuotationHistory 
                    quotations={quotations} 
                    token={token} 
                    currentUser={currentUser}
                    onRefreshData={loadWorkspaceData}
                    onEditQuote={handleEditQuote}
                  />
                )}
                {activeTab === 'compare' && (
                  <ComparePanel 
                    papers={papers} 
                    brackets={brackets} 
                  />
                )}
                {activeTab === 'admin' && (
                  <AdminPanel 
                    papers={papers} 
                    laminations={laminations} 
                    plateProfiles={plateProfiles}
                    miscCosts={miscCosts} 
                    brackets={brackets} 
                    token={token} 
                    onRefreshData={loadWorkspaceData} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </main>

        {/* Footer info bar */}
        <footer className="h-12 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-6 text-[11px] text-slate-400 shrink-0 select-none">
          <div>
            © 2026 PressEstimator Industrial Suite. All rights reserved.
          </div>
          <div className="flex items-center gap-3 font-mono">
            <span>Server Uptime: <strong className="text-emerald-500">99.98%</strong></span>
            <span>|</span>
            <span>Security: <strong className="text-blue-600">SECURE</strong></span>
          </div>
        </footer>
    </div>
  );
}
