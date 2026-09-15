import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Staff views
import { StaffDashboard } from './components/staff/StaffDashboard';
import { VillageManagement } from './components/staff/VillageManagement';
import { FarmerManagement } from './components/staff/FarmerManagement';
import { VleManagement } from './components/staff/VleManagement';

// Farmer views
import { FarmerLogin } from './components/farmer/FarmerLogin';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { MachineryRequestForm } from './components/farmer/MachineryRequestForm';
import { FarmerRequestsList } from './components/farmer/FarmerRequestsList';
import { FarmerHistory } from './components/farmer/FarmerHistory';
import { FarmerProfile } from './components/farmer/FarmerProfile';

// VLE views
import { VleLogin } from './components/vle/VleLogin';
import { VleDashboard } from './components/vle/VleDashboard';
import { VleRequestsList } from './components/vle/VleRequestsList';
import { VleFarmerHistory } from './components/vle/VleFarmerHistory';
import { VleProfile } from './components/vle/VleProfile';

const MainLayout: React.FC = () => {
  const { role, isFarmerLoggedIn, isVleLoggedIn } = useApp();

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reset to 'dashboard' whenever role changes
  useEffect(() => {
    setCurrentTab('dashboard');
    setIsMobileMenuOpen(false);
  }, [role]);

  // If Farmer role and not logged in, show Farmer Login flow
  if (role === 'farmer' && !isFarmerLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <FarmerLogin />
        </main>
      </div>
    );
  }

  // If VLE role and not logged in, show VLE Login flow
  if (role === 'vle' && !isVleLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 flex items-center justify-center p-4">
          <VleLogin />
        </main>
      </div>
    );
  }

  // Render role-specific view
  const renderContent = () => {
    if (role === 'staff') {
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
    }

    if (role === 'farmer') {
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
    }

    if (role === 'vle') {
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
    }

    return null;
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

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
