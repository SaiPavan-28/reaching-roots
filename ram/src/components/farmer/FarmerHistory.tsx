import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import { History, ShoppingBag, Store, Calendar, ArrowUpDown, UserCheck } from 'lucide-react';

interface FarmerHistoryProps {
  onNavigate: (tab: string) => void;
}

export const FarmerHistory: React.FC<FarmerHistoryProps> = ({ onNavigate }) => {
  const { activeFarmer, history, farmers, setActiveFarmerById } = useApp();

  const [forceEmptyDemo, setForceEmptyDemo] = useState(false);

  if (!activeFarmer) return null;

  const actualHistory = history.filter((h) => h.farmerId === activeFarmer.id);
  const displayedHistory = forceEmptyDemo ? [] : actualHistory;

  const totalSpent = displayedHistory.reduce((acc, h) => acc + h.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Purchase & Service History</h1>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Official ledger of machinery rentals, seed purchases, and agricultural services provided via VLEs.
          </p>
        </div>

        {/* Demo Toggle to test both populated & empty state as explicitly requested in the prompt */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setForceEmptyDemo(!forceEmptyDemo)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-xs"
          >
            {forceEmptyDemo ? 'Show Populated History' : 'Preview Empty State'}
          </button>
        </div>
      </div>

      {/* Summary metric bar */}
      {displayedHistory.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
          <div>
            <span className="text-xs text-emerald-800 block">Total Services Received</span>
            <span className="text-lg font-bold text-emerald-950">{displayedHistory.length} Transactions</span>
          </div>
          <div>
            <span className="text-xs text-emerald-800 block">Total Amount</span>
            <span className="text-lg font-bold text-emerald-950">₹{totalSpent.toLocaleString()}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-xs text-emerald-800 block">Active Village Hub</span>
            <span className="text-sm font-semibold text-emerald-950">{activeFarmer.village}</span>
          </div>
        </div>
      )}

      {/* Table or Empty State */}
      {displayedHistory.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Transaction History Available"
          description={`No past machinery rentals or agricultural product purchases are recorded yet for ${activeFarmer.name}. Service records will appear here once fulfilled by your VLE.`}
          actionText="Request Farm Equipment"
          onAction={() => onNavigate('request-machinery')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Product / Service Name</th>
                  <th className="px-5 py-3.5">VLE Name</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Quantity</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {displayedHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{item.productOrService}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-stone-400" />
                        <span>{item.vleName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-700 font-mono text-xs">
                      {item.date}
                    </td>
                    <td className="px-5 py-4 text-stone-700 font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-stone-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
