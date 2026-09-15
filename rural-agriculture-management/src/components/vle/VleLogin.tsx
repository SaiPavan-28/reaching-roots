import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, ArrowRight, ShieldCheck, UserCheck, Wrench } from 'lucide-react';

export const VleLogin: React.FC = () => {
  const { vles, loginVle } = useApp();

  const [selectedVleId, setSelectedVleId] = useState(vles[0]?.id || '');
  const [accessPin, setAccessPin] = useState('1234');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVleId) {
      setError('Please select a VLE profile');
      return;
    }
    const res = loginVle(selectedVleId);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">VLE Portal Login</h2>
        <p className="text-xs sm:text-sm text-stone-700 mt-1">
          Village Level Entrepreneur access for machinery fleet dispatch and farmer order fulfillment.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            Select VLE Kendra Account
          </label>
          <div className="space-y-2">
            {vles.map((vle) => {
              const isSelected = vle.id === selectedVleId;
              return (
                <div
                  key={vle.id}
                  onClick={() => setSelectedVleId(vle.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-stone-900 block">{vle.name}</span>
                      <span className="text-xs text-stone-700">{vle.centerName} ({vle.village})</span>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
            VLE Access PIN (Mock Authentication)
          </label>
          <input
            type="password"
            value={accessPin}
            onChange={(e) => setAccessPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 font-mono tracking-widest text-center"
          />
          <p className="text-[11px] text-stone-700 mt-1 text-center">
            Default Prototype PIN: <strong className="font-mono text-teal-800">1234</strong>
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white font-medium text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          Access VLE Dashboard
        </button>
      </form>
    </div>
  );
};
