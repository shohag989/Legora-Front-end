import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Legora — Premium Design Marketplace",
  description: "Connect with vetted UI/UX designers for SaaS, mobile, and product design. Legora is the premium marketplace for design talent.",
  icons: {
    icon: "/assets/logos/logo-Footer.svg",
    shortcut: "/assets/logos/logo-Footer.svg",
    apple: "/assets/logos/logo-Footer.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
        <AuthProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
