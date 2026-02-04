'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './SiteLockSettings.module.scss';

type Status = 'idle' | 'loading' | 'ok' | 'error';

export default function SiteLockSettings() {
  const [enabled, setEnabled] = useState(false);
  const [loadingState, setLoadingState] = useState<Status>('idle');
  const [msg, setMsg] = useState<string>('');

  const cookieName = useMemo(() => 'site_unlocked', []);

  const load = async () => {
    try {
      const res = await fetch('/api/settings/site-lock', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed');
      const data = (await res.json()) as { enabled: boolean };
      setEnabled(Boolean(data.enabled));
    } catch {
      // Safe default
      setEnabled(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleLock = async (next: boolean) => {
    setLoadingState('loading');
    setMsg('');

    try {
      const res = await fetch('/api/settings/site-lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: next }),
      });

      if (!res.ok) {
        setLoadingState('error');
        setMsg('Failed to update site lock. Are you signed in as admin?');
        return;
      }

      const data = (await res.json()) as { enabled: boolean };
      setEnabled(Boolean(data.enabled));
      setLoadingState('ok');
      setMsg(data.enabled ? 'Site lock enabled.' : 'Site lock disabled.');

      // reset badge after a moment
      window.setTimeout(() => setLoadingState('idle'), 1200);
    } catch {
      setLoadingState('error');
      setMsg('Network error updating site lock.');
    }
  };

  const unlockBrowser = async () => {
    setLoadingState('loading');
    setMsg('');

    try {
      const res = await fetch('/api/site-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // admin bypass
      });

      if (!res.ok) {
        setLoadingState('error');
        setMsg('Unlock failed. Make sure the lock is enabled and you are signed in as admin.');
        return;
      }

      setLoadingState('ok');
      setMsg('Unlocked for this browser (cookie set). Open the main site in a new tab.');

      window.setTimeout(() => setLoadingState('idle'), 1200);
    } catch {
      setLoadingState('error');
      setMsg('Network error while unlocking.');
    }
  };

  const copyDisableSteps = async () => {
    const text =
      `Disable site lock:\n` +
      `1) Go to Admin → Settings → Site lock\n` +
      `2) Toggle "Site locked" OFF\n` +
      `\nNotes:\n` +
      `- Browser unlock cookie: ${cookieName}\n` +
      `- Password is still stored in env (SITE_LOCK_PASSWORD)\n`;

    try {
      await navigator.clipboard.writeText(text);
      setMsg('Copied disable steps.');
      setLoadingState('ok');
      window.setTimeout(() => setLoadingState('idle'), 1200);
    } catch {
      setMsg('Could not copy to clipboard.');
      setLoadingState('error');
    }
  };

  return (
    <section className={styles.section}>
      <h2>Site</h2>
      <p>Manage the temporary coming-soon lock.</p>

      <div className={styles.card}>
        <div className={styles.row}>
          <div className={styles.left}>
            <div className={styles.title}>Site lock</div>
            <div className={styles.sub}>
              While enabled, visitors are redirected to <code>/coming-soon</code>. As an admin, you
              can unlock the site for <strong>this browser</strong> without using the password.
            </div>
          </div>

          <div className={styles.actions}>
            <label className={styles.switch} title="Toggle site lock">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => toggleLock(e.target.checked)}
              />
              <span className={styles.slider} />
              <span className={styles.switchLabel}>{enabled ? 'Locked' : 'Unlocked'}</span>
            </label>

            <button type="button" className={styles.primary} onClick={unlockBrowser} disabled={!enabled}>
              Unlock this browser
            </button>

            <button type="button" className={styles.secondary} onClick={copyDisableSteps}>
              Copy “disable lock” steps
            </button>

            <div className={styles.badge} data-status={loadingState}>
              {loadingState === 'idle' && (enabled ? 'LOCK ON' : 'LOCK OFF')}
              {loadingState === 'loading' && 'WORKING'}
              {loadingState === 'ok' && 'DONE'}
              {loadingState === 'error' && 'ERROR'}
            </div>
          </div>
        </div>

        {msg ? (
          <div className={`${styles.notice} ${loadingState === 'error' ? styles.noticeError : styles.noticeOk}`}>
            {msg}
          </div>
        ) : (
          <div className={styles.hint}>
            When the site is complete, just leave lock <strong>off</strong>. No redeploy needed.
          </div>
        )}
      </div>
    </section>
  );
}
