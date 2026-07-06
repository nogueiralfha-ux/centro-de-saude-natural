import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  LayoutDashboard, 
  Calculator as CalcIcon, 
  UtensilsCrossed, 
  Dumbbell, 
  TrendingUp, 
  Bell,
  Sun, 
  Moon, 
  CloudLightning,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Calculator from './components/Calculator';
import Recipes from './components/Recipes';
import Exercises from './components/Exercises';
import History from './components/History';
import Reminders from './components/Reminders';
import Login from './components/Login';
import WelcomePortal from './components/WelcomePortal';
import Admin from './components/Admin';
import logo from './assets/logo.svg';

export default function App() {
  const [user, setUser] = useState(null);
  const [showPortal, setShowPortal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [firebaseStatus, setFirebaseStatus] = useState('offline');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inicializar Sessão e Tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('efe_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedUser = localStorage.getItem('efe_active_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('efe_theme', newTheme);
  };

  const handleSyncFirebase = () => {
    setFirebaseStatus('syncing');
    setTimeout(() => {
      setFirebaseStatus('online');
      setTimeout(() => setFirebaseStatus('offline'), 3000);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('efe_active_user');
    setUser(null);
    setShowPortal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'calculator':
        return <Calculator setActiveTab={setActiveTab} user={user} />;
      case 'recipes':
        return <Recipes />;
      case 'exercises':
        return <Exercises setActiveTab={setActiveTab} />;
      case 'history':
        return <History />;
      case 'reminders':
        return <Reminders />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: `Painel de ${user?.name || 'Cuidado'}`, sub: 'Seu progresso físico, emocional e espiritual hoje.' };
      case 'calculator':
        return { title: 'Calculadora de Saúde', sub: 'Calculadora de IMC, TMB e recomendações integradas.' };
      case 'recipes':
        return { title: 'Cardápios e Receitas', sub: 'Alimentação saudável, saladas e porções nutritivas.' };
      case 'exercises':
        return { title: 'Banco de Exercícios', sub: 'Mais de 240 rotinas fitness divididas por objetivo.' };
      case 'history':
        return { title: 'Histórico de Progresso', sub: 'Acompanhe a curva de evolução de peso e medidas.' };
      case 'reminders':
        return { title: 'Lembretes e Devocionais', sub: 'Organize seu dia e alimente sua mente com devocionais.' };
      case 'admin':
        return { title: 'Painel do Administrador', sub: 'Gerencie receitas, exercícios e desafios da comunidade.' };
      default:
        return { title: 'Centro de Saúde Natural', sub: 'Cuidado integral.' };
    }
  };

  // Fluxo de autenticação e portal
  if (!user) {
    return <Login onLoginSuccess={(loggedInUser) => {
      setUser(loggedInUser);
      setShowPortal(true);
      localStorage.setItem('efe_active_user', JSON.stringify(loggedInUser));
    }} />;
  }

  if (showPortal) {
    return <WelcomePortal user={user} onStart={() => setShowPortal(false)} />;
  }

  const headerInfo = getHeaderTitle();

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logo} alt="e.f.e Logo" width="28" height="28" />
            <span>Saúde <strong>Natural</strong></span>
          </div>
          <button 
            className="menu-toggle-btn" 
            style={{ padding: '4px', border: 'none', background: 'transparent', boxShadow: 'none', cursor: 'pointer' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="icon"><LayoutDashboard size={20} /></span>
            <span>Dashboard</span>
          </div>

          <div 
            onClick={() => { setActiveTab('calculator'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
          >
            <span className="icon"><CalcIcon size={20} /></span>
            <span>Calculadora</span>
          </div>

          <div 
            onClick={() => { setActiveTab('recipes'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
          >
            <span className="icon"><UtensilsCrossed size={20} /></span>
            <span>Cardápios / Receitas</span>
          </div>

          <div 
            onClick={() => { setActiveTab('exercises'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'exercises' ? 'active' : ''}`}
          >
            <span className="icon"><Dumbbell size={20} /></span>
            <span>Exercícios / Treinos</span>
          </div>

          <div 
            onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
          >
            <span className="icon"><TrendingUp size={20} /></span>
            <span>Histórico</span>
          </div>

          <div 
            onClick={() => { setActiveTab('reminders'); setIsSidebarOpen(false); }} 
            className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`}
          >
            <span className="icon"><Bell size={20} /></span>
            <span>Lembretes</span>
          </div>

          {user?.isAdmin && (
            <div 
              onClick={() => { setActiveTab('admin'); setIsSidebarOpen(false); }} 
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              style={{ borderLeft: '3px solid var(--primary)', marginTop: '8px' }}
            >
              <span className="icon"><Shield size={20} style={{ color: 'var(--primary)' }} /></span>
              <span style={{ fontWeight: 800 }}>Painel Admin</span>
            </div>
          )}
        </nav>

        <div className="sidebar-footer">
          {/* Cloud Sync Simulation */}
          <button 
            onClick={handleSyncFirebase} 
            className="btn btn-secondary btn-sm"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              justifyContent: 'center',
              background: firebaseStatus === 'syncing' ? 'var(--primary-light)' : 'var(--border-color)',
              color: firebaseStatus === 'syncing' ? 'var(--primary)' : 'var(--text-primary)',
              width: '100%' 
            }}
          >
            <CloudLightning size={16} />
            <span>
              {firebaseStatus === 'syncing' 
                ? 'Sincronizando...' 
                : firebaseStatus === 'online' 
                  ? 'Sincronizado!' 
                  : 'Sincronizar Cloud'}
            </span>
          </button>

          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme} 
            className="nav-item" 
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'transparent' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="theme-text">Tema {theme === 'light' ? 'Claro' : 'Escuro'}</span>
            </span>
          </div>

          {/* Sair / Logout */}
          <div 
            onClick={handleLogout} 
            className="nav-item logout-item"
            style={{ cursor: 'pointer', display: 'flex', gap: '12px', padding: '10px 16px', color: 'var(--danger)' }}
          >
            <LogOut size={20} />
            <span className="theme-text">Desconectar</span>
          </div>
        </div>
      </aside>

      {/* Main Panel View */}
      <main className="main-content">
        <header className="header-bar">
          <button 
            className="menu-toggle-btn"
            onClick={() => setIsSidebarOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}
          >
            <Menu size={20} />
            <span>Menu</span>
          </button>

          <div className="header-title" style={{ flex: 1 }}>
            <h1>{headerInfo.title}</h1>
            <p>{headerInfo.sub}</p>
          </div>
          
          <div className="user-badge">
            <Heart size={16} fill="var(--primary)" style={{ color: 'var(--primary)' }} />
            <span>{user?.goal || 'Cuidado Integral'}</span>
          </div>
        </header>

        {/* Tab view display container */}
        <div style={{ minHeight: 'calc(100vh - 150px)' }}>
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
