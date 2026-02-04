import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getSiteLockEnabled, setSiteLockEnabled } from '@/lib/siteLock';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const enabled = await getSiteLockEnabled();
    return NextResponse.json({ enabled });
  } catch (e) {
    console.error('GET /api/settings/site-lock failed:', e);
    // Safe default: unlocked
    return NextResponse.json({ enabled: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as { enabled?: boolean };
    const enabled = body.enabled === true;

    await setSiteLockEnabled(enabled);
    return NextResponse.json({ ok: true, enabled });
  } catch (e) {
    console.error('POST /api/settings/site-lock failed:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
