// src/app/sitemap.ts
export default function sitemap() {
  const base = 'https://essentiaagency.co.uk';

  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/faq`, priority: 0.6 },
    { url: `${base}/privacy-policy`, priority: 0.3 },
    { url: `${base}/terms-of-service`, priority: 0.3 },
  ];
}
