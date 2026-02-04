import { prisma } from '@/lib/prisma';

const KEY = 'site_lock';

export type SiteLockValue = { enabled: boolean };

export function enabledFromValue(raw: unknown): boolean {
  if (!raw || typeof raw !== 'object') return false;
  return (raw as Partial<SiteLockValue>).enabled === true;
}

export async function getSiteLockEnabled(): Promise<boolean> {
  const row = await prisma.siteConfig.findUnique({ where: { key: KEY } });
  return enabledFromValue(row?.value);
}

export async function setSiteLockEnabled(enabled: boolean): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key: KEY },
    create: { key: KEY, value: { enabled } },
    update: { value: { enabled } },
  });
}
