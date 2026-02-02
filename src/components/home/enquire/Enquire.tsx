// src/components/home/enquire/Enquire.tsx
'use client';

import { useEffect, useState } from 'react';
import { useModals } from '../modals/ModalContext';
import EnquireModal from './EnquireModal';
import styles from './Enquire.module.scss';

type EnquireConfig = {
  eyebrow: string;
  title: string;
  lead: string;
  buttonLabel: string;

  consultCallLabel: string; // allow ""
  consultCallUrl: string; // allow ""
};

const FALLBACK: EnquireConfig = {
  eyebrow: 'For venues & events',
  title: 'Enquire about DJs and live music.',
  lead: 'We curate DJs and musicians for restaurants, bars and event spaces — matching artists to your brand, guest profile and schedule.',
  buttonLabel: 'Open enquiry form',

  consultCallLabel: 'Book consultant call',
  consultCallUrl: 'https://calendar.app.google/hdvYediQuWn4wDQH6',
};

export default function Enquire() {
  const { openEnquire } = useModals();
  const [cfg, setCfg] = useState<EnquireConfig>(FALLBACK);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/enquire', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as Partial<EnquireConfig>;

        setCfg({
          ...FALLBACK,
          ...data,
          consultCallLabel: (data.consultCallLabel ?? FALLBACK.consultCallLabel).trim(),
          consultCallUrl: (data.consultCallUrl ?? FALLBACK.consultCallUrl).trim(),
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const showConsult = Boolean(cfg.consultCallUrl?.trim());

  return (
    <>
      <section id="enquire" className={styles.section} aria-labelledby="enquire-heading">
        <div className={styles.inner}>
          <p className={styles.kicker}>{cfg.eyebrow}</p>

          <h2 id="enquire-heading" className={styles.title}>
            {cfg.title}
          </h2>

          <p className={styles.lead}>{cfg.lead}</p>

          <div className={styles.ctaRow}>
            <button type="button" className={styles.cta} onClick={openEnquire}>
              {cfg.buttonLabel}
            </button>

            {showConsult ? (
              <a
                className={styles.ctaSecondary}
                href={cfg.consultCallUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${cfg.consultCallLabel || 'Book consultant call'} (opens in a new tab)`}
              >
                {cfg.consultCallLabel || 'Book consultant call'}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <EnquireModal />
    </>
  );
}
