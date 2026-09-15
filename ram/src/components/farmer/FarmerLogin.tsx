import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tractor, Phone, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const FarmerLogin: React.FC = () => {
  const { farmers, loginFarmer, setActiveFarmerById } = useApp();

  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate brief network delay
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = loginFarmer(mobile, otp);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleSelectQuickFarmer = (farmerId: string) => {
    const f = farmers.find((farm) => farm.id === farmerId);
    if (f) {
      setMobile(f.mobile);
      setOtp('123456');
      setStep('otp');
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-12 p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
          <Tractor className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Kisan Portal Login</h2>
        <p className="text-xs sm:text-sm text-stone-700 mt-1">
          Access agricultural machinery booking and service history. No email required.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'mobile' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-stone-700 font-mono text-sm">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-mono"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Pickers for instant testing */}
          <div className="pt-4 border-t border-stone-100">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-2">
              Quick Test Demo Profiles:
            </span>
            <div className="space-y-1.5">
              {farmers.slice(0, 3).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectQuickFarmer(f.id)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-xs flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-stone-800">
                    {f.name} ({f.village})
                  </span>
                  <span className="text-stone-700 font-mono">+91 {f.mobile}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>OTP sent to +91 {mobile}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep('mobile');
                setError('');
              }}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                setError('');
              }}
              className="w-full text-center tracking-[0.5em] text-lg font-mono py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              required
              autoFocus
            />
            <p className="text-[11px] text-stone-700 mt-1 text-center">
              Prototype Test OTP: <strong className="text-emerald-700 font-mono">123456</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-medium text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify & Enter Dashboard
          </button>
        </form>
      )}
    </div>
  );
};
