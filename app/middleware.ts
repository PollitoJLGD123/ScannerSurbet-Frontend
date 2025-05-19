import { NextRequest, NextResponse } from 'next/server';

// Verificar si la petición viene con un token en una cookie
export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get('auth_token');
  
  // el caso donde hay una cookie de autenticación y se intenta acceder a login o register
  if (authCookie) {
    const url = req.nextUrl.pathname;
    if (url.startsWith('/login') || url.startsWith('/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // redireccion para las rutas protegidas
  if (!authCookie) {
    const url = req.nextUrl.pathname;
    if (url.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
