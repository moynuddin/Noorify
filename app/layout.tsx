import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import { NotificationProvider } from "@/components/NotificationProvider";
import { AuthProvider } from "@/components/AuthProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Dhikr - Tasbih & Spiritual Productivity",
  description:
    "A minimal, offline-first Islamic productivity app for daily Dhikr tracking and Prayer reminders.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} h-full antialiased`}
    >
      {/* We use min-[100dvh] to fix mobile browser bottom bar shift */}
      <body className="min-h-[100dvh] flex flex-col font-sans bg-background text-foreground selection:bg-brand-500/30 overflow-x-hidden">
        <ThemeProvider>
          <NotificationProvider>
            <AuthProvider>
              {/* Added breakpoint sizes for tablets and adjusted safe padding */}
              <main className="flex-1 w-full max-w-md md:max-w-2xl mx-auto pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] relative transition-all duration-300">
                {children}
              </main>
              <BottomNav />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
