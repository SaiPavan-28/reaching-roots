'use client';

import React from 'react';
import { Sprout, Tractor, ShieldCheck, Lock } from 'lucide-react';

export type UserRole = 'farmer' | 'vle' | 'staff';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  mode?: 'login' | 'signup';
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  mode = 'login',
}) => {
  const roles: {
    id: UserRole;
    label: string;
    description: string;
    icon: React.ElementType;
    disabledInSignup?: boolean;
  }[] = [
    {
      id: 'farmer',
      label: 'Farmer',
      description: 'Crops & Equipment',
      icon: Sprout,
    },
    {
      id: 'vle',
      label: 'VLE',
      description: 'Village Entrepreneur',
      icon: Tractor,
    },
    {
      id: 'staff',
      label: 'Staff',
      description: 'System Operations',
      icon: ShieldCheck,
      disabledInSignup: mode === 'signup',
    },
  ];

  return (
    <div className="w-full mb-6">
      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
        Select Your Role
      </label>
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-stone-100/90 rounded-2xl border border-stone-200">
        {roles.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedRole === item.id;
          const isRestricted = item.disabledInSignup;

          return (
            <button
              key={item.id}
              type="button"
              disabled={isRestricted}
              onClick={() => onSelectRole(item.id)}
              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 text-center select-none ${
                isSelected
                  ? 'bg-white text-emerald-950 shadow-md shadow-emerald-900/10 border border-emerald-500/30 ring-1 ring-emerald-500/20 font-semibold scale-[1.02]'
                  : isRestricted
                  ? 'opacity-45 bg-stone-100 cursor-not-allowed text-stone-400'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              {isRestricted && (
                <span className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-stone-200 text-stone-500">
                  <Lock className="w-2.5 h-2.5" />
                </span>
              )}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : isRestricted
                    ? 'bg-stone-200 text-stone-400'
                    : 'bg-stone-200/80 text-stone-700 group-hover:bg-emerald-100'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium leading-tight line-clamp-1">
                {item.label}
              </span>
              <span className="text-[10px] text-stone-500 hidden sm:block mt-0.5 font-normal">
                {isRestricted ? 'Restricted' : item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
