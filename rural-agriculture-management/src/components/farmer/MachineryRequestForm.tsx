import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Tractor,
  Calendar,
  Store,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MachineryRequestFormProps {
  onSuccessNavigate: (tab: string) => void;
}

export const MachineryRequestForm: React.FC<MachineryRequestFormProps> = ({ onSuccessNavigate }) => {
  const { activeFarmer, vles, submitMachineryRequest } = useApp();

  // Find preferred VLE for this farmer's village
  const defaultVle =
    vles.find((v) => activeFarmer && v.village.toLowerCase() === activeFarmer.village.toLowerCase()) ||
    vles[0];

  const [selectedVleId, setSelectedVleId] = useState<string>(defaultVle?.id || '');
  const [selectedMachineryId, setSelectedMachineryId] = useState<string>('mach-1');
  const [requiredDate, setRequiredDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] // 2 days ahead
  );
  const [quantityOrArea, setQuantityOrArea] = useState<string>('4 Acres');
  const [notes, setNotes] = useState<string>('');

  const [error, setError] = useState<string>('');
  const [submittedRequest, setSubmittedRequest] = useState<{
    machineryName: string;
    vleName: string;
    requiredDate: string;
    quantityOrArea: string;
    status: 'Pending';
  } | null>(null);

  // Get currently selected VLE object
  const currentVle = vles.find((v) => v.id === selectedVleId) || defaultVle;

  // Equipment available in this VLE
  const availableStock = currentVle ? currentVle.machineryStock : [];
  const selectedMachinery = availableStock.find((m) => m.id === selectedMachineryId) || availableStock[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachinery) {
      setError('Please select machinery to request');
      return;
    }
    if (!currentVle) {
      setError('Please select a Village Level Entrepreneur (VLE)');
      return;
    }
    if (!requiredDate) {
      setError('Please select a required date');
      return;
    }
    if (!quantityOrArea.trim()) {
      setError('Please specify the required quantity or acreage');
      return;
    }

    const res = submitMachineryRequest({
      machineryId: selectedMachinery.id,
      machineryName: selectedMachinery.name,
      vleId: currentVle.id,
      requestedDate: requiredDate,
      quantityOrArea: quantityOrArea.trim(),
      notes: notes.trim(),
    });

    if (res.success) {
      setSubmittedRequest({
        machineryName: selectedMachinery.name,
        vleName: currentVle.name,
        requiredDate,
        quantityOrArea: quantityOrArea.trim(),
        status: 'Pending',
      });
      setError('');
    } else {
      setError(res.message);
    }
  };

  if (submittedRequest) {
    return (
      <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 bg-white border border-stone-200 rounded-2xl shadow-xs text-center space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-900">Machinery Request Submitted!</h2>
          <p className="text-xs sm:text-sm text-stone-700 mt-1">
            Your booking has been transmitted to <strong className="text-stone-800">{submittedRequest.vleName}</strong> for review.
          </p>
        </div>

        {/* Status Confirmation Card */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-left space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <span className="text-xs font-semibold text-stone-700 uppercase">Request Status</span>
            <StatusBadge status={submittedRequest.status} />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-stone-700 block">Machinery:</span>
              <span className="font-semibold text-stone-900">{submittedRequest.machineryName}</span>
            </div>
            <div>
              <span className="text-stone-700 block">Required Date:</span>
              <span className="font-semibold text-stone-900">{submittedRequest.requiredDate}</span>
            </div>
            <div>
              <span className="text-stone-700 block">Quantity / Area:</span>
              <span className="font-semibold text-stone-900">{submittedRequest.quantityOrArea}</span>
            </div>
            <div>
              <span className="text-stone-700 block">Assigned VLE:</span>
              <span className="font-semibold text-stone-900">{submittedRequest.vleName}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setSubmittedRequest(null)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs sm:text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
          >
            Request Another Machine
          </button>
          <button
            onClick={() => onSuccessNavigate('my-requests')}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            View All My Requests
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Request Agricultural Machinery</h1>
        <p className="text-xs sm:text-sm text-stone-700 mt-1">
          Select equipment, choose your Village Level Entrepreneur (VLE), and submit your reservation request.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Step 1: Select / Identify VLE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            1. Select / Identify Village Level Entrepreneur (VLE) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {vles.map((vle) => {
              const isSelected = vle.id === selectedVleId;
              const isLocalVillage = activeFarmer && vle.village.toLowerCase() === activeFarmer.village.toLowerCase();

              return (
                <div
                  key={vle.id}
                  onClick={() => {
                    setSelectedVleId(vle.id);
                    // ensure selected machinery exists in this VLE
                    if (!vle.machineryStock.some((m) => m.id === selectedMachineryId)) {
                      setSelectedMachineryId(vle.machineryStock[0]?.id || 'mach-1');
                    }
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{vle.name}</h4>
                      <p className="text-xs text-stone-700 truncate">{vle.centerName}</p>
                    </div>
                    {isLocalVillage && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Your Village
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-stone-700 pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span>Base: {vle.village}</span>
                    <span className="text-emerald-700 font-medium">
                      {vle.machineryStock.length} Machines
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Machinery Type */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            2. Select Machinery Type *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableStock.map((mach) => {
              const isSelected = mach.id === selectedMachineryId;
              const isAvailable = mach.availableUnits > 0;

              return (
                <div
                  key={mach.id}
                  onClick={() => setSelectedMachineryId(mach.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-900">{mach.name}</h4>
                      <span className="text-xs text-stone-700 block">{mach.category}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isAvailable ? `${mach.availableUnits} in stock` : '0 in stock'}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-medium">{mach.rateDescription}</span>
                    {!isAvailable && (
                      <span className="text-rose-600 text-[11px] font-medium">
                        Waitlist / Pending restock
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Required Details */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            3. Enter Reservation Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Required Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Quantity or Field Area *
              </label>
              <input
                type="text"
                placeholder="e.g. 4 Acres or 2 Days"
                value={quantityOrArea}
                onChange={(e) => setQuantityOrArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 4: Additional Note */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Additional Note (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Land is irrigated and ready for tilling; prefer morning slot."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-700 text-center sm:text-left">
            Request will initially be marked as <strong className="text-amber-700 font-semibold">Pending</strong> until confirmed by VLE.
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            Submit Request
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
