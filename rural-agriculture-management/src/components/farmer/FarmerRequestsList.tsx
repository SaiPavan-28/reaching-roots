import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { Tractor, Calendar, Store, Clock, AlertCircle, Plus, Search } from 'lucide-react';

interface FarmerRequestsListProps {
  onNavigate: (tab: string) => void;
}

export const FarmerRequestsList: React.FC<FarmerRequestsListProps> = ({ onNavigate }) => {
  const { activeFarmer, requests } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  if (!activeFarmer) return null;

  const myRequests = requests.filter((r) => r.farmerId === activeFarmer.id);

  const filtered = myRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Machinery Requests</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Track status of farm machinery bookings with Village Level Entrepreneurs (VLEs).
          </p>
        </div>

        <button
          onClick={() => onNavigate('request-machinery')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'Pending', 'Accepted', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {st === 'ALL' ? `All Requests (${myRequests.length})` : st}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Tractor}
          title={myRequests.length === 0 ? 'No Machinery Requests Found' : `No ${filterStatus} Requests`}
          description={
            myRequests.length === 0
              ? 'You have not submitted any machinery requests yet. Book a tractor, harvester, or tiller directly from your local VLE.'
              : `No requests with status "${filterStatus}" currently found in your profile.`
          }
          actionText={myRequests.length === 0 ? 'Book Machinery Now' : undefined}
          onAction={myRequests.length === 0 ? () => onNavigate('request-machinery') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-stone-900">{req.machineryName}</h3>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-700">
                  <span className="flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 text-stone-400" />
                    VLE: <strong className="text-stone-700 font-semibold">{req.vleName}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    Required for: <strong className="text-stone-700 font-semibold">{req.requestedDate}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    Requested on: {req.requestDate}
                  </span>
                  <span>
                    Area/Quantity: <strong className="text-stone-700 font-semibold">{req.quantityOrArea}</strong>
                  </span>
                </div>

                {req.notes && (
                  <p className="text-xs text-stone-700 bg-stone-50 p-2 rounded-lg border border-stone-100 italic">
                    &ldquo;{req.notes}&rdquo;
                  </p>
                )}

                {req.rejectionReason && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Rejection Note: {req.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Status Indicator Callout */}
              <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <span className="text-[11px] uppercase tracking-wider text-stone-700 block mb-1">
                  Current Status
                </span>
                <StatusBadge status={req.status} size="md" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
