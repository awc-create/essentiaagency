// src/components/admin/settings/SiteLockSettings.tsx
'use client';

import { useState } from 'react';
import styles from './SiteLockSettings.module.scss';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export default function SiteLockSettings() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  const unlock = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/site-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // admin bypass will handle
      });

      if (!res.ok) {
        setStatus('error');
        setMessage('Could not unlock. Make sure you are signed in as an admin.');
        return;
      }

      setStatus('ok');
      setMessage('Unlocked for this browser (cookie set). Open the main site in a new tab.');
    } catch {
      setStatus('error');
      setMessage('Network error while unlocking.');
    }
  };

  const copyDisableSteps = async () => {
    const text =
      `To fully remove the lock when the site is complete:\n\n` +
      `1) Set SITE_LOCK_ENABLED=false (or delete it)\n` +
      `2) Redeploy\n\n` +
      `The middleware will stop redirecting to /coming-soon.`;

    await navigator.clipboard.writeText(text);
    setStatus('ok');
    setMessage('Copied disable steps.');
  };

  return (
    <section className={styles.section}>
      <h2>Site</h2>
      <p>Manage the temporary coming-soon lock.</p>

      <div className={styles.form}>
        <div className={styles.full}>
          <h3 className={styles.subTitle}>Site lock</h3>
          <p className={styles.subText}>
            While enabled, visitors are redirected to <code>/coming-soon</code>. As an admin, you can
            unlock the site for <strong>this browser</strong> without using the password.
          </p>
        </div>

        <div className={`${styles.actions} ${styles.full}`}>
          <button type="button" className={styles.primary} onClick={unlock} disabled={status === 'loading'}>
            {status === 'loading' ? 'Unlocking…' : 'Unlock this browser'}
          </button>

          <button type="button" className={styles.secondary} onClick={copyDisableSteps}>
            Copy “disable lock” steps
          </button>
        </div>

        {message ? (
          <div
            className={`${styles.notice} ${styles.full} ${
              status === 'error' ? styles.noticeError : styles.noticeOk
            }`}
          >
            {message}
          </div>
        ) : null}
      </div>
    </section>
  );
}
