'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, CheckCircle2, RotateCw, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const COMMON_VILLAGES = [
  'Rampur',
  'Shivpuri',
  'Belur',
  'Krishnapur',
  'Madhupur',
  'Dharamgarh',
  'Chandpur',
  'Sundarpur',
];

export const FarmerSignupForm: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [village, setVillage] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!village.trim()) {
      setErrorMessage('Please enter or select your Village');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
      setCountdown(30);
      setIsCounting(true);
    }, 600);
  };

  const handleResendOtp = () => {
    if (countdown > 0) return;
    setErrorMessage('');
    setIsCounting(true);
    setCountdown(30);
    setOtp('');
  };

  const handleOtpVerifyAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (otp.trim() !== '123456') {
      setErrorMessage('Invalid OTP. Please enter the prototype OTP: 123456');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            role: 'farmer',
            name: fullName.trim(),
            mobile: mobileNumber.replace(/\D/g, ''),
            village: village.trim(),
            isNewAccount: true,
            createdAt: new Date().toISOString(),
          })
        );
      }
      router.push('/dashboard/farmer');
    }, 700);
  };

  const handleAutoFillTestOtp = () => {
    setOtp('123456');
    setErrorMessage('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Prototype Testing Banner */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-amber-950">Farmer Registration:</span> Use your actual details. For verification, use prototype OTP{' '}
          <button
            type="button"
            onClick={handleAutoFillTestOtp}
            className="font-mono font-bold bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded-md hover:bg-amber-300 transition-colors"
          >
            123456
          </button>.
        </div>
      </div>

      {step === 'DETAILS' ? (
        <form onSubmit={handleDetailsSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Full Name (पूरा नाम)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4 text-emerald-700" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. Ramesh Kumar Patel"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Mobile Number (मोबाइल नंबर)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-stone-500 font-medium text-sm border-r border-stone-200 pr-2.5 flex items-center gap-1.5 select-none">
                <Phone className="w-4 h-4 text-emerald-700" />
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, ''));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="10-digit mobile number"
                className="w-full pl-24 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 placeholder:font-normal transition-all"
              />
            </div>
          </div>

          {/* Village */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Village / Gram Panchayat (गांव)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <MapPin className="w-4 h-4 text-emerald-700" />
              </div>
              <input
                list="village-suggestions"
                type="text"
                value={village}
                onChange={(e) => {
                  setVillage(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Select or enter your village"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
              />
              <datalist id="village-suggestions">
                {COMMON_VILLAGES.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errorMessage}
            </p>
          )}

          {/* Send OTP button */}
          <button
            type="submit"
            disabled={isLoading || !fullName || mobileNumber.length < 10 || !village}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mt-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin" /> Sending Verification Code...
              </span>
            ) : (
              <>
                <span>Send OTP to Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* OTP Step */
        <form onSubmit={handleOtpVerifyAndCreate} className="space-y-4">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">{fullName}</span>
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="text-emerald-700 hover:underline font-medium"
              >
                Edit Details
              </button>
            </div>
            <div className="text-stone-500 mt-0.5">
              Village: {village} • Mobile: +91 {mobileNumber}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Enter 6-Digit OTP (ओटीपी दर्ज करें)
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ''));
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="123456"
              className="w-full text-center tracking-[0.6em] font-mono text-2xl font-bold py-3.5 px-4 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900 transition-all"
              autoFocus
            />
            {errorMessage && (
              <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1.5 justify-center">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600 py-1">
            <span>Didn't receive code?</span>
            {isCounting ? (
              <span className="font-medium text-stone-500">
                Resend in <span className="font-mono text-emerald-700 font-semibold">{countdown}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" /> Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin" /> Creating Account...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Registration & Enter</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
        Already registered as Farmer?{' '}
        <Link
          href="/login?role=farmer"
          className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};
