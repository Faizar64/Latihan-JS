import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WarehouseProvider } from './context/WarehouseContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import PersediaanView from './views/PersediaanView';
import BarangMasukView from './views/BarangMasukView';
import BarangKeluarView from './views/BarangKeluarView';
import LaporanMutasiView from './views/LaporanMutasiView';

// Modals
import ItemFormModal from './components/forms/ItemFormModal';
import TransactionInModal from './components/forms/TransactionInModal';
import TransactionOutModal from './components/forms/TransactionOutModal';

function MainLayout() {
  const { isAuthenticated } = useAuth();

  // Navigation Tab State
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Modal States
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isInModalOpen, setIsInModalOpen] = useState(false);
  const [defaultInItem, setDefaultInItem] = useState(null);

  const [isOutModalOpen, setIsOutModalOpen] = useState(false);
  const [defaultOutItem, setDefaultOutItem] = useState(null);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Quick Action Handlers
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleOpenAddIn = () => {
    setDefaultInItem(null);
    setIsInModalOpen(true);
  };

  const handleQuickAddStock = (item) => {
    setDefaultInItem(item);
    setIsInModalOpen(true);
  };

  const handleOpenAddOut = () => {
    setDefaultOutItem(null);
    setIsOutModalOpen(true);
  };

  const handleQuickIssueStock = (item) => {
    setDefaultOutItem(item);
    setIsOutModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 transition-all">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setIsMobileOpen={setIsMobileOpen}
          onOpenAddItem={handleOpenAddItem}
          onOpenAddIn={handleOpenAddIn}
          onOpenAddOut={handleOpenAddOut}
        />

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              setCurrentTab={setCurrentTab}
              onOpenAddItem={handleOpenAddItem}
              onOpenAddIn={handleOpenAddIn}
              onOpenAddOut={handleOpenAddOut}
              onQuickAddStock={handleQuickAddStock}
            />
          )}

          {currentTab === 'persediaan' && (
            <PersediaanView
              onOpenAddItem={handleOpenAddItem}
              onOpenEditItem={handleOpenEditItem}
              onQuickAddStock={handleQuickAddStock}
              onQuickIssueStock={handleQuickIssueStock}
            />
          )}

          {currentTab === 'masuk' && (
            <BarangMasukView onOpenAddIn={handleOpenAddIn} />
          )}

          {currentTab === 'keluar' && (
            <BarangKeluarView onOpenAddOut={handleOpenAddOut} />
          )}

          {currentTab === 'laporan' && <LaporanMutasiView />}
        </main>
      </div>

      {/* Global Modals */}
      <ItemFormModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
      />

      <TransactionInModal
        isOpen={isInModalOpen}
        onClose={() => {
          setIsInModalOpen(false);
          setDefaultInItem(null);
        }}
        defaultItem={defaultInItem}
      />

      <TransactionOutModal
        isOpen={isOutModalOpen}
        onClose={() => {
          setIsOutModalOpen(false);
          setDefaultOutItem(null);
        }}
        defaultItem={defaultOutItem}
      />

      {/* Global Toast Notifications */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WarehouseProvider>
        <MainLayout />
      </WarehouseProvider>
    </AuthProvider>
  );
}

