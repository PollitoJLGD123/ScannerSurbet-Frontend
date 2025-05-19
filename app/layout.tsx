'use client';

import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CookiesWrapper } from "@/components/cookie-provider"
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getLayout = () => {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return <AuthLayout>{children}</AuthLayout>;
    }
    
    if (pathname.startsWith("/dashboard")) {
      return <DashboardLayout>{children}</DashboardLayout>;
    }
    
    // Layout predeterminado para rutas principales
    return <MainLayout>{children}</MainLayout>;
  };

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <CookiesWrapper>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {getLayout()}
          </ThemeProvider>
        </CookiesWrapper>
      </body>
    </html>
  );
}