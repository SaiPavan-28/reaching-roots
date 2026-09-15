import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Tractor,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  History,
  CheckCircle2,
  Wrench,
  Phone,
} from 'lucide-react';

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { activeFarmer, requests, history, vles } = useApp();

  if (!activeFarmer) return null;

  // Filter requests & history for this active farmer
  const myRequests = requests.filter((r) => r.farmerId === activeFarmer.id);
  const myHistory = history.filter((h) => h.farmerId === activeFarmer.id);

  // Find VLE serving this village
  const localVle = vles.find((v) => v.village.toLowerCase() === activeFarmer.village.toLowerCase()) || vles[0];

  return (
    <div className="space-y-6">
      {/* Farmer Greeting Card */}
      <div className="bg-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-700/90 text-emerald-100 border border-emerald-600">
                Registered Farmer
              </span>
              <span className="text-xs text-emerald-200">ID: {activeFarmer.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Namaste, {activeFarmer.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-emerald-100 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-300" />
                Village: {activeFarmer.village}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-emerald-300" />
                +91 {activeFarmer.mobile}
              </span>
              {activeFarmer.landAcres && (
                <span>Land: {activeFarmer.landAcres} Acres ({activeFarmer.primaryCrop || 'Mixed'})</span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => onNavigate('request-machinery')}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-sm rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              Request Machinery
            </button>
          </div>
        </div>
      </div>

      {/* Available Local Machinery Snapshot */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Available Machinery from {localVle?.centerName || 'Local VLE Center'}
            </h2>
            <p className="text-xs text-stone-700">
              Assigned VLE: {localVle?.name} (+91 {localVle?.mobile})
            </p>
          </div>
          <button
            onClick={() => onNavigate('request-machinery')}
            className="text-xs font-semibold text-emerald-700 hover:underline self-start sm:self-auto"
          >
            Book Equipment →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {localVle?.machineryStock.slice(0, 4).map((mach) => (
            <div
              key={mach.id}
              className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-stone-900 line-clamp-1">{mach.name}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${
                      mach.availableUnits > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {mach.availableUnits > 0 ? `${mach.availableUnits} Available` : 'Out of Stock'}
                  </span>
                </div>
                <span className="text-[11px] text-stone-700 block">{mach.category}</span>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-700 font-medium">{mach.rateDescription}</span>
                <button
                  onClick={() => onNavigate('request-machinery')}
                  disabled={mach.availableUnits <= 0}
                  className={`text-xs font-semibold ${
                    mach.availableUnits > 0
                      ? 'text-emerald-700 hover:underline'
                      : 'text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Requests & Purchase/Service History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900">Recent Machinery Requests</h3>
            <button
              onClick={() => onNavigate('my-requests')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              View All ({myRequests.length})
            </button>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-6 text-center bg-stone-50 rounded-lg text-xs text-stone-700">
              No recent machinery requests. Click &ldquo;Request Machinery&rdquo; to make your first booking.
            </div>
          ) : (
            <div className="space-y-3">
              {myRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-sm">{req.machineryName}</span>
                    </div>
                    <p className="text-xs text-stone-700">
                      VLE: {req.vleName} • Area/Qty: {req.quantityOrArea}
                    </p>
                    <p className="text-[11px] text-stone-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Required Date: <span className="font-medium text-stone-700">{req.requestedDate}</span>
                    </p>
                    {req.rejectionReason && (
                      <p className="text-[11px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        Reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Purchase & Service History Snapshot */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-stone-900">Purchase & Service History</h3>
            <button
              onClick={() => onNavigate('purchase-history')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Full History ({myHistory.length})
            </button>
          </div>

          {myHistory.length === 0 ? (
            <div className="p-6 text-center bg-stone-50 rounded-lg text-xs text-stone-700">
              No previous service or purchase transactions on record.
            </div>
          ) : (
            <div className="space-y-3">
              {myHistory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{item.productOrService}</h4>
                    <p className="text-xs text-stone-700">
                      {item.vleName} • {item.date} • {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-stone-900 block">
                      ₹{item.amount.toLocaleString()}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
