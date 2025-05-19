'use client';

import { CookiesProvider } from 'react-cookie';

export function CookiesWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>{children}</CookiesProvider>
  );
}
