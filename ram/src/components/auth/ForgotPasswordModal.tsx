'use client';

import React, { useState } from 'react';
import { X, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from './RoleSelector';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  role,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(
        role === 'vle'
          ? 'Please enter your registered mobile number'
          : 'Please enter your work email or Staff ID'
      );
      return;
    }

    if (role === 'vle' && identifier.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setIdentifier('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Reset Your Password
            </h3>
            <p className="text-sm text-stone-600 mt-1.5 mb-6">
              {role === 'vle'
                ? 'Enter your registered 10-digit mobile number. We will send a secure verification code to reset your VLE account password.'
                : 'Enter your Staff ID or official email address. Instructions will be routed to your department administrator.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {role === 'vle' ? 'Registered Mobile Number' : 'Staff ID or Work Email'}
                </label>
                <input
                  type={role === 'vle' ? 'tel' : 'text'}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={
                    role === 'vle' ? 'e.g. 9876543210' : 'e.g. STF-1029 or rajesh@dept.org'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900 placeholder:text-stone-400 text-sm transition-all"
                />
                {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Send Request'}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Request Sent!</h3>
            <p className="text-sm text-stone-600 mt-2 mb-6 leading-relaxed">
              {role === 'vle'
                ? `If an active VLE account exists for ${identifier}, a password reset link has been dispatched via SMS.`
                : `Your reset request for ${identifier} has been submitted to the portal administrator.`}
            </p>
            <button
              onClick={handleResetAndClose}
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold shadow-xs transition-colors"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
