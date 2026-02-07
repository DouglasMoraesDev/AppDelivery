import React, { useState, useEffect } from 'react';
import App from './App';
import LoginAdmin from './components/LoginAdmin';
import AdminDashboard from './components/AdminDashboard';

export default function AppRouter() {
  const [currentView, setCurrentView] = useState<'customer' | 'admin' | 'adminDashboard'>(() => {
    // Verificar parâmetro da URL primeiro
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam === 'customer') {
      return 'customer';
    }
    
    // Verificar se há token de admin salvo
    const token = localStorage.getItem('adminToken');
    return token ? 'adminDashboard' : 'customer';
  });
  
  // Removida verificação de backend - funciona em modo demo

  const handleAdminLogin = () => {
    setCurrentView('adminDashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setCurrentView('customer');
  };

  const handleGoToAdmin = () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setCurrentView('adminDashboard');
    } else {
      setCurrentView('admin');
    }
  };

  const handleBackToCustomer = () => {
    setCurrentView('customer');
  };

  // Verificar URL para modo admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      handleGoToAdmin();
    }
  }, []);

  if (currentView === 'admin') {
    return <LoginAdmin onLoginSuccess={handleAdminLogin} />;
  }

  if (currentView === 'adminDashboard') {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <>
      <App />
      {/* Botão flutuante para acessar admin */}
      <button
        onClick={handleGoToAdmin}
        className="fixed bottom-4 left-4 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition flex items-center justify-center z-50"
        title="Área Administrativa"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </>
  );
}
