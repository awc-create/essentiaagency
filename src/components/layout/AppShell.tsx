'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import SkyOverlay from '@/components/theme/SkyOverlay';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isComingSoon = pathname === '/coming-soon';

  if (isComingSoon) {
    // Minimal shell for coming soon
    return <>{children}</>;
  }

  // Normal site shell
  return (
    <div className="app-shell">
      <SkyOverlay />
      <div className="site-grain" aria-hidden="true" />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
