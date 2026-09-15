'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { RoleSelector, UserRole } from '@/components/auth/RoleSelector';
import { FarmerLoginForm } from '@/components/auth/FarmerLoginForm';
import { VleLoginForm } from '@/components/auth/VleLoginForm';
import { StaffLoginForm } from '@/components/auth/StaffLoginForm';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { ShieldCheck, Sparkles, Sprout } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'farmer';
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    ['farmer', 'vle', 'staff'].includes(initialRole) ? initialRole : 'farmer'
  );

  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 bg-agriculture-pattern flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative rural ambient blur orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Card Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="auth-glass rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-200/80">
          <AuthHeader
            title="Sign in to Reaching Roots"
            subtitle="Access tailored services, machinery scheduling, and agricultural support"
          />

          <RoleSelector
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
            mode="login"
          />

          {/* Dynamic Form based on selected role */}
          <div className="min-h-[290px] flex flex-col justify-between">
            {selectedRole === 'farmer' && <FarmerLoginForm />}
            {selectedRole === 'vle' && (
              <VleLoginForm onForgotPassword={() => setIsForgotModalOpen(true)} />
            )}
            {selectedRole === 'staff' && (
              <StaffLoginForm onForgotPassword={() => setIsForgotModalOpen(true)} />
            )}
          </div>
        </div>

        {/* Trust Badges / Footer Info */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Verified Rural Platform
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            Empowering Agriculture
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        role={selectedRole}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
