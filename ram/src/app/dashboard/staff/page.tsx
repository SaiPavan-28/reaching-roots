'use client';

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { StaffDashboard } from '@/components/staff/StaffDashboard';
import { VillageManagement } from '@/components/staff/VillageManagement';
import { FarmerManagement } from '@/components/staff/FarmerManagement';
import { VleManagement } from '@/components/staff/VleManagement';

function StaffDashboardContent() {
  const { setRole } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole('staff');
  }, [setRole]);

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <StaffDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'villages':
        return <VillageManagement />;
      case 'farmers':
        return <FarmerManagement />;
      case 'vles':
        return <VleManagement />;
      default:
        return <StaffDashboard onNavigate={(tab) => setCurrentTab(tab)} />;
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

export default function StaffDashboardPage() {
  return (
    <AppProvider>
      <StaffDashboardContent />
    </AppProvider>
  );
}
