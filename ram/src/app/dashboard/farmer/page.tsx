'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { FarmerDashboard } from '@/components/farmer/FarmerDashboard';
import { MachineryRequestForm } from '@/components/farmer/MachineryRequestForm';
import { FarmerRequestsList } from '@/components/farmer/FarmerRequestsList';
import { FarmerHistory } from '@/components/farmer/FarmerHistory';
import { FarmerProfile } from '@/components/farmer/FarmerProfile';

function FarmerDashboardContent() {
  const { setRole } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole('farmer');
  }, [setRole]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <FarmerDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'request-machinery':
        return <MachineryRequestForm onSuccessNavigate={(tab) => setCurrentTab(tab)} />;
      case 'my-requests':
        return <FarmerRequestsList onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'purchase-history':
        return <FarmerHistory onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'profile':
        return <FarmerProfile />;
      default:
        return <FarmerDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
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

export default function FarmerDashboardPage() {
  return (
    <AppProvider>
      <FarmerDashboardContent />
    </AppProvider>
  );
}
