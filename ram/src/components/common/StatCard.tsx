import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'neutral' | 'success' | 'warning';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeType = 'neutral',
  onClick,
}) => {
  const isClickable = !!onClick;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 rounded-xl border border-stone-200 bg-white transition-all ${
        isClickable
          ? 'cursor-pointer hover:border-emerald-500 hover:shadow-sm'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-700">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900">{value}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-stone-700 pt-2 border-t border-stone-100">
          <span>{subtitle}</span>
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                badgeType === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : badgeType === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
