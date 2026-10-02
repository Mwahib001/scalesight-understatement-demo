import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./vendor/calendly-widget.css";
import { AppShell } from "../components/AppShell";
export const metadata: Metadata = {
  title: "ScaleSight × Understatement — Size Curve Planning",
  description:
    "Illustrative managed merchandise and size-planning concept for Understatement’s NATURANA capsule collaboration.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        {process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() && (
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
