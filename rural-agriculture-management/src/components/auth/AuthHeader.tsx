'use client';

import React from 'react';
import { Sprout, Wheat } from 'lucide-react';
import Link from 'next/link';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-6">
      <Link 
        href="/login" 
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 hover:bg-emerald-100 transition-all duration-200 group mb-3 shadow-xs"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <Sprout className="w-4 h-4 text-emerald-100" />
        </div>
        <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-emerald-950">
          <span>Reaching Roots</span>
          <Wheat className="w-4 h-4 text-amber-600" />
        </div>
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-1">
        {title}
      </h1>
      <p className="text-sm text-stone-600 mt-1.5 max-w-sm mx-auto">
        {subtitle}
      </p>
    </div>
  );
};
