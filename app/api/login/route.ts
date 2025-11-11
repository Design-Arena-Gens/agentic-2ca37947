import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');
const ADMIN_PASS = process.env.APP_PASSWORD_ADMIN || 'adalberto';
const CLIENT_PASS = process.env.APP_PASSWORD_CLIENT || 'cliente';

export async function POST(req: Request) {
  const { password, role } = await req.json();
  const wantsAdmin = role === 'admin';
  const ok = wantsAdmin ? password === ADMIN_PASS : password === CLIENT_PASS || password === ADMIN_PASS;
  if (!ok) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  const token = await new SignJWT({ role: wantsAdmin ? 'admin' : 'client' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);

  const res = NextResponse.json({ redirectTo: '/dashboard' });
  res.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/' });
  return res;
}
