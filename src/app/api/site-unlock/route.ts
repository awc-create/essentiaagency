// src/app/api/site-unlock/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
  const enabled = process.env.SITE_LOCK_ENABLED === 'true';
  if (!enabled) return NextResponse.json({ ok: true });

  const cookieName = process.env.SITE_UNLOCK_COOKIE || 'site_unlocked';
  const isHttps = req.nextUrl.protocol === 'https:';

  // ✅ Admin bypass (unlock from settings without password)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = Boolean(token) && (token as { role?: string }).role === 'admin';

  if (!isAdmin) {
    // Public password flow
    const { password } = (await req.json().catch(() => ({}))) as { password?: string };
    const correct = process.env.SITE_LOCK_PASSWORD;

    if (!password || !correct || password !== correct) {
      return NextResponse.json({ ok: false, error: 'Incorrect password' }, { status: 401 });
    }
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, '1', {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
