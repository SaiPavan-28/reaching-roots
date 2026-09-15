import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Farmer } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';
import {
  Users,
  Search,
  ArrowLeft,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const VleFarmerHistory: React.FC = () => {
  const { activeVle, farmers, history } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

  if (!activeVle) return null;

  // Filter farmers
  const filteredFarmers = farmers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.mobile.includes(searchTerm) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // History transactions for the selected farmer associated with this VLE (or all history for this farmer)
  const selectedFarmerHistory = selectedFarmer
    ? history.filter((h) => h.farmerId === selectedFarmer.id)
    : [];

  const totalSpentByFarmer = selectedFarmerHistory.reduce((acc, h) => acc + h.amount, 0);

  return (
    <div className="space-y-6">
      {/* If a farmer is selected, show: Farmer History View with back button */}
      {selectedFarmer ? (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedFarmer(null)}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-xs transition-colors"
                title="Back to Farmer List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-stone-900">
                  {selectedFarmer.name} &bull; Service History
                </h1>
                <p className="text-xs sm:text-sm text-stone-700">
                  Village: {selectedFarmer.village} • Mobile: +91 {selectedFarmer.mobile}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedFarmer(null)}
              className="text-xs font-semibold text-teal-800 hover:underline self-start sm:self-auto"
            >
              ← Choose another farmer
            </button>
          </div>

          {/* Farmer metrics banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-teal-50/60 rounded-xl border border-teal-200/80">
            <div>
              <span className="text-xs text-teal-800 block">Total Services</span>
              <span className="text-lg font-bold text-teal-950">
                {selectedFarmerHistory.length} Transactions
              </span>
            </div>
            <div>
              <span className="text-xs text-teal-800 block">Total Billed</span>
              <span className="text-lg font-bold text-teal-950">
                ₹{totalSpentByFarmer.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-xs text-teal-800 block">Registered Village</span>
              <span className="text-sm font-semibold text-teal-950 mt-1 block">
                {selectedFarmer.village}
              </span>
            </div>
            <div>
              <span className="text-xs text-teal-800 block">Land Parcel</span>
              <span className="text-sm font-semibold text-teal-950 mt-1 block">
                {selectedFarmer.landAcres ? `${selectedFarmer.landAcres} Acres` : 'Smallholder'}
              </span>
            </div>
          </div>

          {/* History Records Table */}
          {selectedFarmerHistory.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No Transaction History Found"
              description={`There are no recorded transactions, equipment rentals, or input sales for ${selectedFarmer.name} at this time.`}
            />
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      <th className="px-5 py-3.5">Farmer Name</th>
                      <th className="px-5 py-3.5">Product / Service</th>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Quantity</th>
                      <th className="px-5 py-3.5 text-right">Amount</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm">
                    {selectedFarmerHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-5 py-4 font-semibold text-stone-900">
                          {item.farmerName}
                        </td>
                        <td className="px-5 py-4 text-stone-900 font-medium">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-teal-600 shrink-0" />
                            <span>{item.productOrService}</span>
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
      ) : (
        /* Flow Step 1: Farmer List to Select */
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Farmer Directory & History</h1>
            <p className="text-xs sm:text-sm text-stone-700 mt-1">
              Select any farmer from your operational clusters to review their cumulative service and purchase history.
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center gap-2 shadow-xs">
            <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
            <input
              type="text"
              placeholder="Search farmer by name, mobile, or village to view history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder:text-stone-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Farmer Selection Table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                    <th className="px-5 py-3.5">Farmer Name</th>
                    <th className="px-5 py-3.5">Mobile</th>
                    <th className="px-5 py-3.5">Village</th>
                    <th className="px-5 py-3.5">Services On Record</th>
                    <th className="px-5 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                  {filteredFarmers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-stone-700">
                        No farmers found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredFarmers.map((farmer) => {
                      const farmerHistoryCount = history.filter((h) => h.farmerId === farmer.id).length;

                      return (
                        <tr
                          key={farmer.id}
                          className="hover:bg-teal-50/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedFarmer(farmer)}
                        >
                          <td className="px-5 py-4 font-semibold text-stone-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs shrink-0">
                                {farmer.name.charAt(0)}
                              </div>
                              <div>
                                <span>{farmer.name}</span>
                                {farmer.primaryCrop && (
                                  <span className="block text-xs font-normal text-stone-700">
                                    {farmer.primaryCrop}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-stone-700 font-mono text-xs sm:text-sm">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-stone-400" />
                              +91 {farmer.mobile}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-stone-700">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{farmer.village}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-stone-800 font-medium">
                            <span
                              className={`px-2.5 py-1 text-xs rounded-full font-semibold ${
                                farmerHistoryCount > 0
                                  ? 'bg-teal-100 text-teal-900'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {farmerHistoryCount} Records
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFarmer(farmer);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Select & View History
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
