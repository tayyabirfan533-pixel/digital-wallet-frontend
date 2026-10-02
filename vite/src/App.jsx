import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import WalletView from './views/WalletView';
import TransferView from './views/TransferView';
import HistoryView from './views/HistoryView';
import NotificationsView from './views/NotificationsView';
import AnalyticsView from './views/AnalyticsView';
import AdminView from './views/AdminView';
import './App.css'; // <-- Ensure this import is present

function MainLayout() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 'bold' }}>Loading PayVault...</div>;
  }

  if (!user) {
    return <LoginView/>;
  }

  return (
    <div className="app-container">
      <Navbar/>
      <div className="main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
        <main className="content-area">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab}/>}
          {activeTab === 'wallet' && <WalletView/>}
          {activeTab === 'transfer' && <TransferView/>}
          {activeTab === 'history' && <HistoryView/>}
          {activeTab === 'notifications' && <NotificationsView/>}
          {activeTab === 'analytics' && <AnalyticsView/>}
          {activeTab === 'admin' && user.role === 'admin' && <AdminView/>}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  );
}