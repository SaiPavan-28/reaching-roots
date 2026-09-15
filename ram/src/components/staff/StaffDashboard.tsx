import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Building2, Users, Store, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';

interface StaffDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate }) => {
  const { villages, farmers, vles, requests } = useApp();

  const totalAcres = villages.reduce((acc, curr) => acc + curr.acresUnderCultivation, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-700/80 text-emerald-100 border border-emerald-600 mb-3">
            District Administration Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Staff Agriculture Control Center
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100">
            Monitor village irrigation and acreage, register farmers, and coordinate with Village Level Entrepreneurs (VLEs) across the district.
          </p>
        </div>
      </div>

      {/* Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          id="stat-total-villages"
          title="Total Villages"
          value={villages.length}
          subtitle={`${totalAcres.toLocaleString()} Total acres monitored`}
          icon={Building2}
          onClick={() => onNavigate('villages')}
        />
        <StatCard
          id="stat-total-farmers"
          title="Total Farmers"
          value={farmers.length}
          subtitle="Registered agricultural producers"
          icon={Users}
          onClick={() => onNavigate('farmers')}
        />
        <StatCard
          id="stat-total-vles"
          title="Total VLEs"
          value={vles.length}
          subtitle="Active Village Level Entrepreneurs"
          icon={Store}
          onClick={() => onNavigate('vles')}
        />
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-base font-bold text-stone-900 mb-3">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => onNavigate('villages')}
            className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-emerald-700 flex items-center justify-between">
              Village Management
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-stone-700 mt-1">
              View registered villages, add new village jurisdictions, and track water resources and cultivable acres.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span>{villages.length} Villages Active</span>
              <span className="flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Add New</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('farmers')}
            className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-amber-700 flex items-center justify-between">
              Farmer Management
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-stone-700 mt-1">
              Maintain farmer directory, register new farmers with their contact details and village assignments.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-amber-700 font-medium">
              <span>{farmers.length} Farmers Enrolled</span>
              <span className="flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Register</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('vles')}
            className="p-5 bg-white border border-stone-200 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 group-hover:text-teal-700 flex items-center justify-between">
              VLE Management
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
            </h3>
            <p className="text-xs text-stone-700 mt-1">
              Onboard and track Village Level Entrepreneurs, inspect their machinery stock, and monitor service delivery.
            </p>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-teal-700 font-medium">
              <span>{vles.length} Centers Operational</span>
              <span className="flex items-center gap-1"><PlusCircle className="w-3.5 h-3.5" /> Onboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Summary snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Villages Table Snapshot */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900">Key Villages</h3>
            <button
              onClick={() => onNavigate('villages')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {villages.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60"
              >
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{v.name}</h4>
                  <p className="text-xs text-stone-700">{v.waterResources}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900 block">{v.farmersCount} Farmers</span>
                  <span className="text-[11px] text-stone-700">{v.acresUnderCultivation} Acres</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests Snapshot */}
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900">Latest Farmer Machinery Requests</h3>
            <span className="text-xs font-medium text-stone-700">Live Network Activity</span>
          </div>
          <div className="space-y-3">
            {requests.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60"
              >
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{r.machineryName}</h4>
                  <p className="text-xs text-stone-700">
                    {r.farmerName} • {r.farmerVillage} → VLE: {r.vleName}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                      r.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : r.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="text-[11px] text-stone-700 block mt-0.5">{r.quantityOrArea}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
