import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Phone, MapPin, Sprout, Calendar, LogOut, CheckCircle2 } from 'lucide-react';

export const FarmerProfile: React.FC = () => {
  const { activeFarmer, logoutFarmer, farmers, setActiveFarmerById } = useApp();

  if (!activeFarmer) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Farmer Profile</h1>
        <p className="text-xs sm:text-sm text-stone-700 mt-1">
          Registered identity details and village association records.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            {activeFarmer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{activeFarmer.name}</h2>
            <p className="text-xs text-stone-700">Member ID: {activeFarmer.id}</p>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Mobile Farmer
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Mobile Number</span>
            <span className="font-mono font-medium text-stone-900 mt-1 block">+91 {activeFarmer.mobile}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Village Panchayat</span>
            <span className="font-medium text-stone-900 mt-1 block">{activeFarmer.village}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Cultivable Land</span>
            <span className="font-medium text-stone-900 mt-1 block">
              {activeFarmer.landAcres ? `${activeFarmer.landAcres} Acres` : 'Standard Smallholder'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Primary Cultivated Crops</span>
            <span className="font-medium text-stone-900 mt-1 block">
              {activeFarmer.primaryCrop || 'Mixed Seasonal Crops'}
            </span>
          </div>
        </div>

        {/* Switch Account (for testing prototype) */}
        <div className="pt-4 border-t border-stone-100">
          <span className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Switch to Another Registered Farmer (Demo Quick Switch):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {farmers.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFarmerById(f.id)}
                className={`p-2.5 rounded-lg text-left text-xs border transition-all flex items-center justify-between ${
                  f.id === activeFarmer.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <span>{f.name} ({f.village})</span>
                {f.id === activeFarmer.id && <span className="text-[10px] uppercase font-bold text-emerald-700">Active</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={logoutFarmer}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of Farmer Portal
          </button>
        </div>
      </div>
    </div>
  );
};
