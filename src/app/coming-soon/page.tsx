// src/app/coming-soon/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Coming Soon | ESSENTIA',
  description: 'We’re finishing the site. If you have access, enter the password.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-snippet': -1,
      'max-image-preview': 'none',
      'max-video-preview': -1,
    },
  },
};

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<ComingSoonSkeleton />}>
      <ComingSoonClient />
    </Suspense>
  );
}

function ComingSoonSkeleton() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ height: 52, width: 260, background: 'rgba(255,255,255,0.08)', borderRadius: 12 }} />
        <div style={{ height: 18, width: '90%', marginTop: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 10 }} />
        <div style={{ height: 48, width: '100%', marginTop: 22, background: 'rgba(255,255,255,0.06)', borderRadius: 12 }} />
        <div style={{ height: 48, width: '100%', marginTop: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 12 }} />
      </div>
    </main>
  );
}
