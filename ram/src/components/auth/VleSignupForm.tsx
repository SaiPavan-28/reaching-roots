'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, MapPin, Lock, Eye, EyeOff, CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const VleSignupForm: React.FC = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [village, setVillage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanNumber = mobile.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!village.trim()) {
      setErrorMessage('Please enter your enterprise village / location');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsLoading(true);

    // Mock static registration
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            role: 'vle',
            name: fullName.trim(),
            mobile: cleanNumber,
            village: village.trim(),
            isNewAccount: true,
            registeredAt: new Date().toISOString(),
          })
        );
      }
      router.push('/dashboard/vle');
    }, 700);
  };

  return (
    <form onSubmit={handleSignup} className="space-y-3.5 animate-in fade-in duration-200">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Full Name
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
            placeholder="e.g. Suresh Verma"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Mobile Number
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-stone-500 font-medium text-sm border-r border-stone-200 pr-2.5 flex items-center gap-1.5 select-none">
            <Phone className="w-4 h-4 text-emerald-700" />
            +91
          </span>
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value.replace(/\D/g, ''));
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="10-digit mobile number"
            className="w-full pl-24 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium text-stone-900 placeholder:text-stone-400 placeholder:font-normal transition-all"
          />
        </div>
      </div>

      {/* Village / Enterprise Location */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Village / Operational Center
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <input
            type="text"
            value={village}
            onChange={(e) => {
              setVillage(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="e.g. Rampur Center"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
          />
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4 text-emerald-700" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Min 6 characters"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4 text-emerald-700" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Re-type password"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
            >
              {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !fullName || mobile.length < 10 || !village || !password}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mt-2"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin" /> Registering VLE Account...
          </span>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Create VLE Account</span>
          </>
        )}
      </button>

      {/* Footer */}
      <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600">
        Already have a VLE account?{' '}
        <Link
          href="/login?role=vle"
          className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Login here
        </Link>
      </div>
    </form>
  );
};
