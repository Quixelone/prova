import React, { useState, useEffect } from 'react';
import { LayoutDashboard, NotebookPen, Target, ShieldCheck, MessageSquare, Settings, Menu, Bell, HelpCircle, Sparkles, ChevronRight, Briefcase, PlusCircle, BookOpen, LogOut, Loader2, WifiOff, Database, User } from 'lucide-react';
import { ViewState, Strategy, Trade } from './types';
import { MOCK_STRATEGIES, MOCK_TRADES } from './constants';
import { supabase } from './lib/supabase';
import { api } from './services/api';

import Dashboard from './components/Dashboard';
import StrategyBuilder from './components/StrategyBuilder';
import Journal from './components/Journal';
import Warranty from './components/Warranty';
import TelegramBot from './components/TelegramBot';
import Academy from './components/Academy';
import Auth from './components/Auth';
import SqlSetup from './components/SqlSetup';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [showSqlSetup, setShowSqlSetup] = useState(false);
  const [dismissSqlSetup, setDismissSqlSetup] = useState(false);
  const [dbError, setDbError] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fc_guest_mode') === 'true';
    }
    return false;
  });
  
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<number | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  const isSchemaError = (e: any) => {
    const msg = (e?.message || JSON.stringify(e)).toLowerCase();
    if (e?.code === '42P01' || e?.code === '42703') return true;
    if (msg.includes('relation') && msg.includes('does not exist')) return true;
    if (msg.includes('column') && msg.includes('does not exist')) return true;
    if (msg.includes('schema cache')) return true;
    return false;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
        if(session) await loadData(false);
        else if (isGuest) await loadData(true);
        else setLoading(false);
      } catch (err) {
        setLoading(false);
        setConnectionError(true);
      }
    };
    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isGuest) {
        setSession(session);
        if(session) loadData(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [isGuest]);

  const loadData = async (guestMode: boolean) => {
    setLoading(true);
    if (guestMode) {
      setTimeout(() => {
        setStrategies(MOCK_STRATEGIES);
        setTrades(MOCK_TRADES);
        setLoading(false);
      }, 600);
      return;
    }
    try {
       const [stratData, tradeData] = await Promise.all([api.getStrategies(), api.getTrades()]);
       setStrategies(stratData);
       setTrades(tradeData);
    } catch (error: any) {
       if (isSchemaError(error)) {
         setDbError(error);
         if (!dismissSqlSetup) setShowSqlSetup(true);
       }
    } finally {
       setLoading(false);
    }
  };

  const saveStrategy = async (newStrategy: Strategy) => {
    if (isGuest) {
      setStrategies(prev => [newStrategy, ...prev]);
      setSelectedStrategyId(newStrategy.id || null);
      setCurrentView('dashboard');
      return;
    }
    try {
      const saved = await api.createStrategy(newStrategy);
      setStrategies(prev => [saved, ...prev]);
      setSelectedStrategyId(saved.id || null);
      setCurrentView('dashboard');
    } catch (e: any) {
      if (isSchemaError(e)) {
        setDbError(e);
        setShowSqlSetup(true);
      } else {
        alert(`Errore salvataggio: ${e.message}`);
      }
    }
  };

  const handleAddTrade = async (trade: Trade) => {
    if (isGuest) {
      setTrades(prev => [trade, ...prev]);
      return;
    }
    try {
      const saved = await api.createTrade(trade);
      setTrades(prev => [saved, ...prev]);
    } catch (e: any) {
      if (isSchemaError(e)) {
        setDbError(e);
        setShowSqlSetup(true);
      } 
      throw e;
    }
  };

  const handleUpdateTrade = async (trade: Trade) => {
     if (isGuest) {
        setTrades(prev => prev.map(t => t.id === trade.id ? trade : t));
        return;
     }
     try {
        const updated = await api.updateTrade(trade);
        setTrades(prev => prev.map(t => t.id === trade.id ? updated : t));
     } catch (e: any) {
        if (isSchemaError(e)) {
          setDbError(e);
          setShowSqlSetup(true);
        }
        throw e;
     }
  };

  const handleDeleteTrade = async (id: number) => {
     if (isGuest) {
        setTrades(prev => prev.filter(t => t.id !== id));
        return;
     }
     try {
        await api.deleteTrade(id);
        setTrades(prev => prev.filter(t => t.id !== id));
     } catch (e: any) {
        alert("Errore cancellazione: " + e.message);
     }
  };

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false);
      localStorage.removeItem('fc_guest_mode');
      window.location.reload();
    } else {
      await supabase.auth.signOut();
      setSession(null);
    }
  };

  const handleForceSqlModal = (errorMsg?: string) => {
    if (errorMsg) setDbError({ message: errorMsg });
    setShowSqlSetup(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': 
        return <Dashboard strategies={strategies} selectedStrategyId={selectedStrategyId} onSelectStrategy={setSelectedStrategyId} trades={trades} onCreateStrategy={() => setCurrentView('strategy')} />;
      case 'strategy': return <StrategyBuilder onSave={saveStrategy} />;
      case 'journal': return <Journal strategies={strategies} trades={trades} onAddTrade={handleAddTrade} onUpdateTrade={handleUpdateTrade} onDeleteTrade={handleDeleteTrade} onTriggerSchemaError={handleForceSqlModal} />;
      case 'warranty': return <Warranty />;
      case 'telegram': return <TelegramBot strategies={strategies} />;
      case 'academy': return <Academy />;
      default: return <Dashboard strategies={strategies} selectedStrategyId={selectedStrategyId} onSelectStrategy={setSelectedStrategyId} trades={trades} onCreateStrategy={() => setCurrentView('strategy')} />;
    }
  };

  const NavItem = ({ view, label, icon: Icon }: { view: ViewState, label: string, icon: any }) => (
    <button onClick={() => { setCurrentView(view); setIsMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm mb-1 ${currentView === view ? 'bg-accent-purple text-white shadow-lg shadow-purple-900/40' : 'text-slate-400 hover:bg-dark-800 hover:text-white'}`}>
      <div className="flex items-center gap-3"><Icon size={18} /><span>{label}</span></div>
      {currentView === view && <ChevronRight size={14} className="opacity-50" />}
    </button>
  );

  if (loading) return <div className="h-screen w-screen bg-dark-900 flex flex-col items-center justify-center text-accent-purple"><Loader2 size={48} className="animate-spin mb-4" /><p>Syncing...</p></div>;

  if (!session && !isGuest) return <><Auth onGuestLogin={() => { setIsGuest(true); localStorage.setItem('fc_guest_mode', 'true'); }} /></>;

  const userProfile = session?.user?.user_metadata;
  const displayName = isGuest ? 'Guest Trader' : (userProfile?.full_name || session?.user?.email?.split('@')[0] || 'Trader');
  const avatarUrl = isGuest ? `https://api.dicebear.com/7.x/avataaars/svg?seed=Guest` : (userProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email}`);

  return (
    <div className="flex h-screen bg-dark-900 text-slate-100 font-sans">
      {showSqlSetup && !isGuest && <SqlSetup onClose={() => setShowSqlSetup(false)} onIgnore={() => { setDismissSqlSetup(true); setShowSqlSetup(false); }} lastError={dbError} />}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-dark-900 border-r border-dark-800/50 transform transition-transform duration-200 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-8 pb-4"><h1 className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-blue-500 bg-clip-text text-transparent">Finanza<span className="text-white">Creativa</span></h1></div>
        <nav className="flex-1 px-6 overflow-y-auto space-y-8 mt-4">
          <div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">General</div><NavItem view="dashboard" label="Overview" icon={LayoutDashboard} /><NavItem view="strategy" label="Strategie" icon={Target} /><NavItem view="academy" label="Academy" icon={BookOpen} /></div>
          <div><div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">Reports</div><NavItem view="journal" label="Trading Journal" icon={NotebookPen} /><NavItem view="warranty" label="Garanzia" icon={ShieldCheck} /><NavItem view="telegram" label="Segnali Bot" icon={MessageSquare} /></div>
          <div>
             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4">Settings</div>
             {!isGuest && <button onClick={() => { setDbError(null); setShowSqlSetup(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-dark-800 hover:text-white transition-all duration-200 font-medium text-sm mb-1"><Database size={18} /> Database Reset</button>}
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 font-medium text-sm mb-1"><LogOut size={18} /> {isGuest ? 'Esci da Guest Mode' : 'Sign Out'}</button>
          </div>
        </nav>
        <div className="p-6"><div className="px-2 pt-2 border-t border-dark-700/50"><div className="text-[10px] text-slate-600 flex justify-between items-center"><span>FinanzaCreativa.live</span><span className="text-accent-purple font-bold">v1.8 Clean</span></div></div></div>
      </aside>
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-dark-900 relative">
        <header className="h-20 flex items-center justify-between px-8 pt-4">
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}><Menu size={24} /></button>
          <div className="hidden md:flex flex-col"><h2 className="text-xl font-bold text-white">{`Bentornato, ${displayName}`}</h2></div>
          <div className="flex-1 max-w-xl mx-auto px-8 hidden md:block">
            <div className="relative flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-full p-1 pl-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400"><Briefcase size={16} /><span className="text-xs font-bold uppercase tracking-wider">Context:</span></div>
              <select value={selectedStrategyId || ''} onChange={(e) => { const val = e.target.value; setSelectedStrategyId(val ? parseInt(val) : null); setCurrentView('dashboard'); }} className="flex-1 bg-transparent border-none text-sm font-medium text-white focus:ring-0 cursor-pointer py-1.5">
                <option value="">Global Overview</option>
                {strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <button onClick={() => setCurrentView('strategy')} className="p-1.5 bg-accent-purple rounded-full text-white hover:bg-purple-600 transition-colors"><PlusCircle size={16} /></button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="ml-2 w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-blue-600 p-[2px] cursor-pointer group"><div className="w-full h-full rounded-full bg-dark-800 flex items-center justify-center overflow-hidden relative"><img src={avatarUrl} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8"><div className="max-w-[1600px] mx-auto pb-10">{renderContent()}</div></div>
      </main>
    </div>
  );
};

export default App;