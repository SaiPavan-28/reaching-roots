import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  Clock,
  CheckCircle2,
  Package,
  Users,
  Store,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Phone,
} from 'lucide-react';

interface VleDashboardProps {
  onNavigate: (tab: string) => void;
}

export const VleDashboard: React.FC<VleDashboardProps> = ({ onNavigate }) => {
  const { activeVle, requests, history } = useApp();

  if (!activeVle) return null;

  // Requests targeted to this VLE
  const vleRequests = requests.filter((r) => r.vleId === activeVle.id);
  const pendingRequests = vleRequests.filter((r) => r.status === 'Pending');
  const acceptedRequests = vleRequests.filter((r) => r.status === 'Accepted');

  const totalAvailableStock = activeVle.machineryStock.reduce(
    (acc, item) => acc + item.availableUnits,
    0
  );
  const totalStockCapacity = activeVle.machineryStock.reduce(
    (acc, item) => acc + item.totalUnits,
    0
  );

  return (
    <div className="space-y-6">
      {/* VLE Center Welcome Header */}
      <div className="bg-teal-800 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-700 text-teal-100 border border-teal-600">
                VLE Operations Center
              </span>
              <span className="text-xs text-teal-200">Kendra ID: {activeVle.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeVle.centerName}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Entrepreneur: <strong className="text-white">{activeVle.name}</strong> • Village Base: {activeVle.village} • Contact: +91 {activeVle.mobile}
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigate('farmer-requests')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-teal-50 text-teal-900 font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              Manage Farmer Requests
              <ArrowRight className="w-4 h-4 text-teal-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-vle-pending"
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="Awaiting dispatch review"
          icon={Clock}
          badge={pendingRequests.length > 0 ? 'Requires Action' : undefined}
          badgeType={pendingRequests.length > 0 ? 'warning' : 'neutral'}
          onClick={() => onNavigate('farmer-requests')}
        />
        <StatCard
          id="stat-vle-accepted"
          title="Accepted Requests"
          value={acceptedRequests.length}
          subtitle="Scheduled or deployed"
          icon={CheckCircle2}
          onClick={() => onNavigate('farmer-requests')}
        />
        <StatCard
          id="stat-vle-stock"
          title="Available Stock"
          value={`${totalAvailableStock} / ${totalStockCapacity}`}
          subtitle="Ready machines in yard"
          icon={Package}
          onClick={() => onNavigate('profile')}
        />
        <StatCard
          id="stat-vle-farmers-served"
          title="Total Farmers Served"
          value={activeVle.totalFarmersServed}
          subtitle="Cumulative farmer beneficiaries"
          icon={Users}
          onClick={() => onNavigate('farmers')}
        />
      </div>

      {/* Pending Requests Alert & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Urgent Farmer Requests</h2>
              <p className="text-xs text-stone-700">Incoming bookings awaiting acceptance or decline</p>
            </div>
            <button
              onClick={() => onNavigate('farmer-requests')}
              className="text-xs font-semibold text-teal-800 hover:underline"
            >
              All Requests ({vleRequests.length})
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200/60">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-stone-900">All caught up!</h4>
              <p className="text-xs text-stone-700 mt-1">
                There are no pending requests right now. New farmer orders will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((req) => {
                // Check if current VLE has available stock for this machinery
                const stockItem = activeVle.machineryStock.find((m) => m.id === req.machineryId);
                const isOutOfStock = stockItem ? stockItem.availableUnits <= 0 : false;

                return (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{req.machineryName}</span>
                          <StatusBadge status={req.status} size="sm" />
                        </div>
                        <p className="text-xs text-stone-700 mt-0.5">
                          From <strong className="text-stone-800">{req.farmerName}</strong> ({req.farmerVillage}) • Mobile: {req.farmerMobile}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-stone-900 bg-white px-2 py-1 rounded border border-stone-200">
                        {req.quantityOrArea}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-stone-200/70">
                      <span className="text-stone-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        Required: <strong className="text-stone-800">{req.requestedDate}</strong>
                      </span>

                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          Stock Unavailable (0 left)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-medium">
                          In Stock ({stockItem?.availableUnits} available)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 text-center">
                <button
                  onClick={() => onNavigate('farmer-requests')}
                  className="text-xs font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                >
                  Go to Farmer Requests Tab to Accept / Reject →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Machinery Stock In Yard */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-1">Kendra Equipment Yard</h3>
            <p className="text-xs text-stone-700 mb-4">Current fleet availability status</p>

            <div className="space-y-3">
              {activeVle.machineryStock.map((mach) => (
                <div
                  key={mach.id}
                  className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-stone-900 block truncate">{mach.name}</span>
                    <span className="text-stone-700 text-[11px] block">{mach.rateDescription}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded font-bold whitespace-nowrap ${
                      mach.availableUnits > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {mach.availableUnits} / {mach.totalUnits} Ready
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-700">
            Machinery counts directly regulate farmer request approvals.
          </div>
        </div>
      </div>
    </div>
  );
};
