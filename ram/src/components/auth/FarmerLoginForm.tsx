'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, CheckCircle2, RotateCw, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const FarmerLoginForm: React.FC = () => {
  const router = useRouter();

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isCounting, setIsCounting] = useState(false);

  // Handle OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNumber = mobileNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate sending OTP
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

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }

    if (cleanOtp !== '123456') {
      setErrorMessage('Invalid OTP. Please enter the prototype OTP: 123456');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Store basic session in localStorage/sessionStorage for placeholder dashboard display
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            role: 'farmer',
            mobile: mobileNumber,
            name: 'Kisan Mitra',
            loggedInAt: new Date().toISOString(),
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
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Prototype Testing Banner */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-amber-950">Farmer Prototype Mode:</span>{' '}
          SMS is mocked. When prompted for OTP, enter{' '}
          <button
            type="button"
            onClick={handleAutoFillTestOtp}
            className="font-mono font-bold bg-amber-200/70 text-amber-950 px-1.5 py-0.5 rounded-md hover:bg-amber-300 transition-colors"
          >
            123456
          </button>{' '}
          or click to auto-fill.
        </div>
      </div>

      {step === 'MOBILE' ? (
        <form onSubmit={handleMobileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Farmer Mobile Number (मोबाइल नंबर)
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
                placeholder="Enter 10-digit number"
                className="w-full pl-24 pr-4 py-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-base font-medium tracking-wide text-stone-900 placeholder:text-stone-400 placeholder:font-normal placeholder:tracking-normal transition-all"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
              <span>🌾 No email required. We send a fast OTP to your mobile.</span>
            </p>
            {errorMessage && (
              <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || mobileNumber.length < 10}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin" /> Sending OTP...
              </span>
            ) : (
              <>
                <span>Send OTP (ओटीपी भेजें)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Enter Verification Code (OTP)
              </label>
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline underline-offset-2"
              >
                Change Number
              </button>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              Code sent to <span className="font-semibold text-stone-900">+91 {mobileNumber}</span>
            </p>

            <div className="relative">
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
                className="w-full text-center tracking-[0.6em] font-mono text-xl sm:text-2xl font-bold py-3.5 px-4 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900 placeholder:text-stone-300 placeholder:font-mono transition-all"
                autoFocus
              />
            </div>

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
                <RotateCw className="w-4 h-4 animate-spin" /> Verifying...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Login (लॉगिन करें)</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
        New Farmer to Reaching Roots?{' '}
        <Link
          href="/signup?role=farmer"
          className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Register as Farmer
        </Link>
      </div>
    </div>
  );
};
