import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

async function verify(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role?: 'admin' | 'client' };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/login') || pathname.startsWith('/api/login') || pathname.startsWith('/api/logout')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('session')?.value;
  const payload = token ? await verify(token) : null;

  if (!payload) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // RBAC: admin-only routes
  const adminOnly = ['/clients', '/payments'];
  if (adminOnly.some((p) => pathname.startsWith(p)) && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images).*)'],
};
