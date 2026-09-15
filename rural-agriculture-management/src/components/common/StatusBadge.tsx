import React from 'react';
import { RequestStatus, TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: RequestStatus | TransactionStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs sm:text-sm font-medium';

  let colorClasses = 'bg-stone-100 text-stone-700 border-stone-200';
  let dotColor = 'bg-stone-400';

  if (status === 'Pending') {
    colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-500';
  } else if (status === 'Accepted' || status === 'Completed') {
    colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    dotColor = 'bg-emerald-600';
  } else if (status === 'Rejected') {
    colorClasses = 'bg-rose-50 text-rose-800 border-rose-300';
    dotColor = 'bg-rose-600';
  } else if (status === 'Delivered' || status === 'In Progress') {
    colorClasses = 'bg-sky-50 text-sky-800 border-sky-300';
    dotColor = 'bg-sky-600';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap ${sizeClasses} ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};
