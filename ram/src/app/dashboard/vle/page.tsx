'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { VleDashboard } from '@/components/vle/VleDashboard';
import { VleRequestsList } from '@/components/vle/VleRequestsList';
import { VleFarmerHistory } from '@/components/vle/VleFarmerHistory';
import { VleProfile } from '@/components/vle/VleProfile';

function VleDashboardContent() {
  const { setRole } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole('vle');
  }, [setRole]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <VleDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'farmer-requests':
        return <VleRequestsList />;
      case 'farmers':
      case 'history':
        return <VleFarmerHistory />;
      case 'profile':
        return <VleProfile />;
      default:
        return <VleDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col antialiased">
      <Header
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 lg:pl-64 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function VleDashboardPage() {
  return (
    <AppProvider>
      <VleDashboardContent />
    </AppProvider>
  );
}
