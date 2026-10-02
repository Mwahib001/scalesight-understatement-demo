import type { Metadata } from "next";
import "./globals.css";
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
      </body>
    </html>
  );
}
