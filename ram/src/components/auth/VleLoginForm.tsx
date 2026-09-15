'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Lock, Eye, EyeOff, ArrowRight, RotateCw, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface VleLoginFormProps {
  onForgotPassword: () => void;
}

export const VleLoginForm: React.FC<VleLoginFormProps> = ({ onForgotPassword }) => {
  const router = useRouter();

  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanNumber = mobile.replace(/\D/g, '');
    if (cleanNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters');
      return;
    }

    setIsLoading(true);

    // Mock static authentication
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            role: 'vle',
            mobile: cleanNumber,
            name: 'Village Entrepreneur Center',
            village: 'Rampur Hub',
            loggedInAt: new Date().toISOString(),
          })
        );
      }
      router.push('/dashboard/vle');
    }, 700);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-200">
      {/* Mobile Input */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          VLE Mobile Number
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
            autoFocus
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
            Password
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
          >
            Forgot Password?
          </button>
        </div>
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
            placeholder="Enter your VLE password"
            className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-stone-600">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4 border-stone-300"
          />
          <span>Remember this device</span>
        </label>
        <span className="text-[11px] text-stone-400">Mock Auth Active</span>
      </div>

      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || mobile.length < 10 || !password}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mt-2"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin" /> Logging in...
          </span>
        ) : (
          <>
            <span>Login as VLE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Don't have an account link */}
      <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup?role=vle"
          className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          Sign up as VLE
        </Link>
      </div>
    </form>
  );
};
