'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { RoleSelector, UserRole } from '@/components/auth/RoleSelector';
import { FarmerSignupForm } from '@/components/auth/FarmerSignupForm';
import { VleSignupForm } from '@/components/auth/VleSignupForm';
import { ShieldAlert, ShieldCheck, Sprout } from 'lucide-react';
import Link from 'next/link';

function SignupContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'farmer';
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    ['farmer', 'vle'].includes(initialRole) ? initialRole : 'farmer'
  );

  return (
    <div className="min-h-screen bg-stone-50 bg-agriculture-pattern flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative rural ambient blur orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="auth-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80">
          <AuthHeader
            title="Create an Account"
            subtitle="Join Reaching Roots to digitize and empower rural farming communities"
          />

          <RoleSelector
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            mode="signup"
          />

          {/* Dynamic Form based on selected role */}
          <div className="min-h-[290px] flex flex-col justify-between">
            {selectedRole === 'farmer' && <FarmerSignupForm />}
            {selectedRole === 'vle' && <VleSignupForm />}
            {selectedRole === 'staff' && (
              <div className="text-center py-6 px-4 bg-stone-50 border border-stone-200 rounded-2xl animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  Staff Registration Restricted
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Staff accounts cannot be registered publicly. They are provisioned and managed directly by the administration authority.
                </p>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs">
                  Already have staff credentials?{' '}
                  <Link
                    href="/login?role=staff"
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    Go to Staff Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Simple & Transparent Registration
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            Empowering Villages
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
