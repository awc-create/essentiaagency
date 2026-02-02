'use client';

import React, { useEffect, useState } from 'react';
import styles from './EnquireSettings.module.scss';

type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'tel'
  | 'date'
  | 'time'
  | 'datetime'
  | 'url'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'checkboxes'
  | 'file';

type ShowIf = { field: string; equals: string };

type FormField = {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;

  placeholder?: string;
  helpText?: string;
  options?: string[];

  min?: number;
  max?: number;
  step?: number;

  accept?: string;
  multipleFiles?: boolean;
  showIf?: ShowIf;
};

type EnquireConfig = {
  // Section
  eyebrow: string;
  title: string;
  lead: string;
  buttonLabel: string;

  // ✅ Secondary CTA
  consultCallLabel: string;
  consultCallUrl: string;

  // Modal
  modalKicker: string;
  modalTitle: string;
  modalLead: string;
  submitLabel: string;
  successMessage: string;

  // Delivery
  recipientEmail?: string | null;

  fields: FormField[];
};

const FALLBACK: EnquireConfig = {
  eyebrow: 'For venues & events',
  title: 'Enquire about DJs and live music.',
  lead:
    'We curate DJs and musicians for restaurants, bars and event spaces — matching artists to your brand, guest profile and schedule.',
  buttonLabel: 'Open enquiry form',

  consultCallLabel: 'Book consultant call',
  consultCallUrl: 'https://calendar.app.google/hdvYediQuWn4wDQH6',

  modalKicker: 'Enquire Now',
  modalTitle: 'Tell us about your venue or event.',
  modalLead:
    'Share a few details about your space, schedule and music brief — we’ll match you with the right artists.',
  submitLabel: 'Send enquiry',
  successMessage: 'Thanks — we’ll be in touch shortly.',

  recipientEmail: null,
  fields: [],
};

export default function EnquireSettings() {
  const [config, setConfig] = useState<EnquireConfig>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const onConfigText =
    (key: keyof EnquireConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setConfig((prev) => ({ ...prev, [key]: e.target.value }));
    };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/home/enquire', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as Partial<EnquireConfig>;
          setConfig({
            ...FALLBACK,
            ...data,
            fields: data.fields ?? [],
          });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/home/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error('Save failed');

      alert('Enquire settings updated.');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Network error saving Enquire.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <h2>Enquire</h2>
        <p>Loading enquire settings…</p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Enquire</h2>
      <p>Control the enquire section, secondary CTA, modal content, and form fields.</p>

      <div className={styles.form}>
        {/* ================= Section copy ================= */}
        <fieldset className={`${styles.fieldset} ${styles.full}`}>
          <legend>Section copy</legend>

          <div className={styles.fieldGrid}>
            <label>
              Eyebrow
              <input value={config.eyebrow} onChange={onConfigText('eyebrow')} />
            </label>

            <label>
              Primary button label
              <input value={config.buttonLabel} onChange={onConfigText('buttonLabel')} />
            </label>

            <label className={styles.full}>
              Title
              <input value={config.title} onChange={onConfigText('title')} />
            </label>

            <label className={styles.full}>
              Lead
              <textarea rows={3} value={config.lead} onChange={onConfigText('lead')} />
            </label>
          </div>
        </fieldset>

        {/* ================= Secondary CTA ================= */}
        <fieldset className={`${styles.fieldset} ${styles.full}`}>
          <legend>Secondary CTA (Consultant call)</legend>

          <div className={styles.fieldGrid}>
            <label>
              Button label
              <input
                value={config.consultCallLabel}
                onChange={onConfigText('consultCallLabel')}
                placeholder="Book consultant call"
              />
            </label>

            <label>
              Button URL
              <input
                value={config.consultCallUrl}
                onChange={onConfigText('consultCallUrl')}
                placeholder="https://calendar.app.google/..."
              />
            </label>
          </div>

          <small>Leave the URL empty to hide the “Book consultant call” button on the site.</small>
        </fieldset>

        {/* ================= Modal copy ================= */}
        <fieldset className={`${styles.fieldset} ${styles.full}`}>
          <legend>Modal copy</legend>

          <div className={styles.fieldGrid}>
            <label>
              Modal kicker
              <input value={config.modalKicker} onChange={onConfigText('modalKicker')} />
            </label>

            <label>
              Recipient email (optional)
              <input
                value={config.recipientEmail ?? ''}
                onChange={onConfigText('recipientEmail')}
                placeholder="bookings@essentia.com"
              />
            </label>

            <label className={styles.full}>
              Modal title
              <input value={config.modalTitle} onChange={onConfigText('modalTitle')} />
            </label>

            <label className={styles.full}>
              Modal lead
              <textarea rows={3} value={config.modalLead} onChange={onConfigText('modalLead')} />
            </label>

            <label>
              Submit button label
              <input value={config.submitLabel} onChange={onConfigText('submitLabel')} />
            </label>

            <label>
              Success message
              <input value={config.successMessage} onChange={onConfigText('successMessage')} />
            </label>
          </div>
        </fieldset>

        <div className={styles.actions}>
          <button type="button" className={styles.save} onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </section>
  );
}
