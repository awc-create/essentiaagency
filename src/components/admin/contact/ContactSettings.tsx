'use client';

import { useEffect, useMemo, useState } from 'react';

type SocialPlatform =
  | 'instagram'
  | 'x'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'soundcloud';

type SocialLink = { platform: SocialPlatform; url: string };

type ContactConfig = {
  eyebrow: string; // allow ""
  title: string;
  lead: string; // allow ""
  buttonLabel: string;

  contactEmail: string;
  contactPhone?: string | null;
  recipientEmail?: string | null;

  modalKicker: string;
  modalTitle: string;
  modalLead: string;
  submitLabel: string;
  successMessage: string;

  socialLinks: SocialLink[];
  fields: unknown[];
};

const DEFAULTS: ContactConfig = {
  eyebrow: "LET'S CONNECT",
  title: 'Get in touch',
  lead: 'General enquiries',
  buttonLabel: 'Open contact form',

  contactEmail: '',
  contactPhone: null,
  recipientEmail: null,

  modalKicker: 'Contact',
  modalTitle: 'Send us a message.',
  modalLead: 'We’ll get back to you shortly.',
  submitLabel: 'Send message',
  successMessage: 'Thanks — we’ll be in touch soon.',

  socialLinks: [],
  fields: [],
};

export default function ContactSettings() {
  const [form, setForm] = useState<ContactConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const setField =
    (key: keyof ContactConfig) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const clearField = (key: keyof ContactConfig) => () => {
    setForm((f) => ({ ...f, [key]: '' as never })); // ✅ store empty string
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/home/contact', { cache: 'no-store' });
        if (!res.ok) return;

        const data = (await res.json()) as Partial<ContactConfig>;

        setForm({
          ...DEFAULTS,

          // ✅ eyebrow/lead must respect cleared values:
          // if API returns "", keep ""
          eyebrow: (data.eyebrow ?? '').trim(),
          lead: (data.lead ?? '').trim(),

          // normal fallbacks
          title: (data.title ?? DEFAULTS.title).trim(),
          buttonLabel: (data.buttonLabel ?? DEFAULTS.buttonLabel).trim(),

          contactEmail: (data.contactEmail ?? DEFAULTS.contactEmail).trim(),
          contactPhone: data.contactPhone ?? null,
          recipientEmail: data.recipientEmail ?? null,

          modalKicker: (data.modalKicker ?? DEFAULTS.modalKicker).trim(),
          modalTitle: (data.modalTitle ?? DEFAULTS.modalTitle).trim(),
          modalLead: (data.modalLead ?? DEFAULTS.modalLead).trim(),
          submitLabel: (data.submitLabel ?? DEFAULTS.submitLabel).trim(),
          successMessage: (data.successMessage ?? DEFAULTS.successMessage).trim(),

          socialLinks: data.socialLinks ?? [],
          fields: data.fields ?? [],
        });
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
      const res = await fetch('/api/home/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        alert('Failed to save Contact settings.');
        return;
      }

      // ✅ Re-fetch so UI matches EXACT stored state (including "")
      const fresh = await fetch('/api/home/contact', { cache: 'no-store' });
      if (fresh.ok) {
        const data = (await fresh.json()) as Partial<ContactConfig>;
        setForm((f) => ({
          ...f,
          eyebrow: (data.eyebrow ?? '').trim(),
          lead: (data.lead ?? '').trim(),
          title: (data.title ?? f.title).trim(),
          buttonLabel: (data.buttonLabel ?? f.buttonLabel).trim(),
        }));
      }

      alert('Contact settings saved!');
    } catch {
      alert('Network error saving Contact settings.');
    } finally {
      setSaving(false);
    }
  };

  const sectionPreview = useMemo(() => {
    const eyebrow = form.eyebrow.trim();
    const lead = form.lead.trim();
    return { eyebrow, lead };
  }, [form.eyebrow, form.lead]);

  return (
    <section>
      <h2>Contact</h2>
      <p>Control the contact section + contact modal settings, icons, and fields.</p>

      <div style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
        <h3 style={{ marginTop: 20 }}>Section copy</h3>

        <div
          style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: '1fr 120px 1fr 120px',
            alignItems: 'end',
            maxWidth: 980,
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
            Eyebrow (optional)
            <input value={form.eyebrow} onChange={setField('eyebrow')} placeholder="LET'S CONNECT" />
          </label>

          <button type="button" onClick={clearField('eyebrow')} style={btnStyle}>
            Clear
          </button>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '.35rem' }}>
            Button label
            <input
              value={form.buttonLabel}
              onChange={setField('buttonLabel')}
              placeholder="Open contact form"
            />
          </label>

          <button type="button" onClick={clearField('buttonLabel')} style={btnStyle}>
            Clear
          </button>

          <label
            style={{
              gridColumn: '1 / -2',
              display: 'flex',
              flexDirection: 'column',
              gap: '.35rem',
            }}
          >
            Title
            <input value={form.title} onChange={setField('title')} placeholder="Get in touch" />
          </label>

          <button type="button" onClick={clearField('title')} style={btnStyle}>
            Clear
          </button>

          <label
            style={{
              gridColumn: '1 / -2',
              display: 'flex',
              flexDirection: 'column',
              gap: '.35rem',
            }}
          >
            Lead (optional)
            <textarea
              rows={4}
              value={form.lead}
              onChange={setField('lead')}
              placeholder="General enquiries"
            />
          </label>

          <button type="button" onClick={clearField('lead')} style={btnStyle}>
            Clear
          </button>
        </div>

        <div style={{ marginTop: 18 }}>
          <button onClick={save} disabled={saving} style={saveStyle}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div style={{ marginTop: 18, opacity: 0.85, fontSize: 13 }}>
          <div>Preview behaviour:</div>
          <ul style={{ margin: '6px 0 0 18px' }}>
            <li>Eyebrow will render: {sectionPreview.eyebrow ? 'Yes' : 'No'}</li>
            <li>Lead will render: {sectionPreview.lead ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '.55rem .85rem',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
};

const saveStyle: React.CSSProperties = {
  padding: '.6rem 1rem',
  borderRadius: 10,
  border: '1px solid #111',
  background: '#111',
  color: '#fff',
  cursor: 'pointer',
};
