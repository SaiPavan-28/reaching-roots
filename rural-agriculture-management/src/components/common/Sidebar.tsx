import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Store,
  Tractor,
  ClipboardList,
  History,
  UserCheck,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { role, requests, activeVle } = useApp();

  // Calculate pending counts for VLE if role is vle
  const pendingRequestsCount = requests.filter(
    (r) => r.status === 'Pending' && (!activeVle || r.vleId === activeVle.id)
  ).length;

  const staffNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'villages', label: 'Village Management', icon: Building2 },
    { id: 'farmers', label: 'Farmer Management', icon: Users },
    { id: 'vles', label: 'VLE Management', icon: Store },
  ];

  const farmerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'request-machinery', label: 'Request Machinery', icon: Tractor },
    { id: 'my-requests', label: 'My Requests', icon: ClipboardList },
    { id: 'purchase-history', label: 'Purchase/Service History', icon: History },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  const vleNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'farmer-requests',
      label: 'Farmer Requests',
      icon: ClipboardList,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
    },
    { id: 'farmers', label: 'Farmers', icon: Users },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: UserCheck },
  ];

  const navItems =
    role === 'staff'
      ? staffNavItems
      : role === 'farmer'
      ? farmerNavItems
      : vleNavItems;

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6 overflow-y-auto">
          {/* Navigation Section */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                {role === 'staff' ? 'Staff Portal' : role === 'farmer' ? 'Farmer Portal' : 'VLE Portal'}
              </span>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {'badge' in item && item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info box */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/70">
          <div className="flex items-center gap-2 text-stone-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">Rural Agri Network • v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
