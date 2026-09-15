'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, RotateCw, AlertCircle, ShieldAlert } from 'lucide-react';

interface StaffLoginFormProps {
  onForgotPassword: () => void;
}

export const StaffLoginForm: React.FC<StaffLoginFormProps> = ({ onForgotPassword }) => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Staff ID or official email');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your staff password');
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
            role: 'staff',
            staffId: identifier,
            name: 'Agricultural Officer',
            department: 'Rural Development & Extension',
            loggedInAt: new Date().toISOString(),
          })
        );
      }
      router.push('/dashboard/staff');
    }, 700);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in duration-200">
      {/* Admin Notice */}
      <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-3 flex items-start gap-2.5 text-xs text-stone-700 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-900">Official Access Only:</span> Staff accounts are issued and managed by system administrators. Public signup is disabled.
        </div>
      </div>

      {/* Staff ID or Email */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
          Staff ID or Work Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Mail className="w-4 h-4 text-emerald-700" />
          </div>
          <input
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="e.g. STF-2041 or officer@agri.gov.in"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm text-stone-900 placeholder:text-stone-400 transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* Password */}
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
            placeholder="Enter your staff password"
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

      {errorMessage && (
        <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={isLoading || !identifier.trim() || !password}
        className="w-full py-3.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-sm shadow-md shadow-emerald-800/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg mt-2"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <RotateCw className="w-4 h-4 animate-spin" /> Authenticating...
          </span>
        ) : (
          <>
            <span>Login as Staff</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Help / Contact Admin notice */}
      <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
        Need assistance or new staff credentials? Contact your{' '}
        <span className="font-semibold text-stone-700">District Administrator</span>.
      </div>
    </form>
  );
};
