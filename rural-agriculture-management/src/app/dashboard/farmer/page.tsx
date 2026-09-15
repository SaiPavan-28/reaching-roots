'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, LogOut, CheckCircle2, Phone, MapPin, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function FarmerDashboardPlaceholder() {
  const router = useRouter();
  const [session, setSession] = useState<{
    name?: string;
    mobile?: string;
    village?: string;
    isNewAccount?: boolean;
    createdAt?: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('user_session');
      if (raw) {
        try {
          setSession(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');
    }
    router.push('/login?role=farmer');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col antialiased">
      {/* Top Navigation */}
      <header className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-stone-900 leading-tight">Reaching Roots</div>
            <div className="text-xs text-stone-500">Farmer Portal (किसान सेवा)</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center items-center">
        <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-md text-center relative overflow-hidden">
          {/* Header Badge */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Farmer Authentication Successful
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Welcome to the Farmer Portal
          </h1>
          <p className="text-stone-600 text-sm max-w-md mx-auto mt-2 mb-8">
            You have successfully verified your mobile number via OTP. This placeholder marks the landing destination for authenticated farmers.
          </p>

          {/* Session Overview Card */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left max-w-md mx-auto mb-8 space-y-3">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Session Profile
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-800">
              <User className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Name: <strong className="text-stone-900">{session?.name || 'Kisan Mitra'}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-800">
              <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Mobile: <strong className="text-stone-900">+91 {session?.mobile || 'Verified Mobile'}</strong></span>
            </div>
            {session?.village && (
              <div className="flex items-center gap-3 text-sm text-stone-800">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Village: <strong className="text-stone-900">{session.village}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 border-t border-stone-200">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Status: Active Session ({session?.isNewAccount ? 'Newly Registered' : 'Logged In'})</span>
            </div>
          </div>

          {/* Stage Note */}
          <div className="bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs max-w-md mx-auto mb-6 leading-relaxed text-left">
            <strong className="block text-amber-950 font-semibold mb-1">
              Phase 1 Milestone Completed:
            </strong>
            Authentication UI is fully operational. Machinery booking, crop tracking, and request management dashboards will be activated in the subsequent phase.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              Sign Out & Test Another Role
            </button>
            <Link
              href="/login"
              className="py-3 px-6 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              Back to Login Screen
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
