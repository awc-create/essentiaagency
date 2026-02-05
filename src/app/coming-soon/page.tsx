// src/app/coming-soon/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title:
    'ESSENTIA | Curated DJs & Live Music for Hospitality Venues, Brands & Events in Birmingham',
  description:
    'Curated DJs and live musicians for restaurants, bars and premium hospitality venues in Birmingham. ESSENTIA also delivers atmosphere-first music programming for brand launches and corporate events — always tailored to the room.',
  alternates: {
    canonical: 'https://essentiaagency.co.uk/',
  },
  openGraph: {
    title:
      'ESSENTIA | Curated DJs & Live Music for Hospitality Venues, Brands & Events in Birmingham',
    description:
      'Curated DJs and live musicians for restaurants, bars and premium hospitality venues in Birmingham. ESSENTIA also delivers atmosphere-first music programming for brand launches and corporate events — always tailored to the room.',
    url: 'https://essentiaagency.co.uk/',
    siteName: 'ESSENTIA',
    type: 'website',
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
        <div
          style={{ height: 52, width: 260, background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}
        />
        <div
          style={{
            height: 18,
            width: '90%',
            marginTop: 14,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 10,
          }}
        />
        <div
          style={{
            height: 48,
            width: '100%',
            marginTop: 22,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
          }}
        />
        <div
          style={{
            height: 48,
            width: '100%',
            marginTop: 12,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
          }}
        />
      </div>
    </main>
  );
}
