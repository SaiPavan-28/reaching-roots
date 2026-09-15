import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reaching Roots | Rural Agriculture Management',
  description: 'Clean, accessible digital platform empowering farmers, village entrepreneurs, and agricultural staff.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
