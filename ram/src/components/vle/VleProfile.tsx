import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Phone, MapPin, Package, Users, LogOut, CheckCircle2, Wrench } from 'lucide-react';

export const VleProfile: React.FC = () => {
  const { activeVle, logoutVle, vles, setActiveVleById } = useApp();

  if (!activeVle) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">VLE Center Profile</h1>
        <p className="text-xs sm:text-sm text-stone-700 mt-1">
          Village Level Entrepreneur enterprise information and fleet inventory.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-2xl shadow-xs">
            {activeVle.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{activeVle.name}</h2>
            <p className="text-xs font-semibold text-teal-800">{activeVle.centerName}</p>
            <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Rural Agri Kendra
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Mobile</span>
            <span className="font-mono font-medium text-stone-900 mt-1 block">+91 {activeVle.mobile}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Village Base</span>
            <span className="font-medium text-stone-900 mt-1 block">{activeVle.village}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <span className="text-xs text-stone-700 block uppercase font-semibold">Farmers Served</span>
            <span className="font-bold text-teal-900 mt-1 block">{activeVle.totalFarmersServed} Farmers</span>
          </div>
        </div>

        {/* Machinery Stock Management */}
        <div>
          <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
            <span>Allocated Machinery Fleet & Stock</span>
            <span className="text-xs text-stone-700 font-normal">
              {activeVle.machineryStock.length} equipment lines
            </span>
          </h3>

          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                <tr>
                  <th className="p-3">Equipment Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-center">Available / Total</th>
                  <th className="p-3 text-right">Standard Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeVle.machineryStock.map((mach) => (
                  <tr key={mach.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-stone-400" />
                      {mach.name}
                    </td>
                    <td className="p-3 text-stone-700">{mach.category}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold ${
                          mach.availableUnits > 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {mach.availableUnits} / {mach.totalUnits} Ready
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium text-stone-800">
                      {mach.rateDescription}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Switch VLE (Quick test tool) */}
        <div className="pt-4 border-t border-stone-100">
          <span className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Switch to Another VLE Center (Demo Quick Switch):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {vles.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVleById(v.id)}
                className={`p-2.5 rounded-lg text-left text-xs border transition-all ${
                  v.id === activeVle.id
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <span className="block font-semibold">{v.name}</span>
                <span className="text-[11px] text-stone-700">{v.village}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={logoutVle}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out of VLE Portal
          </button>
        </div>
      </div>
    </div>
  );
};
