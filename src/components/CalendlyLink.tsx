"use client";

import { ArrowRight } from "lucide-react";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void };
  }
}

export function CalendlyLink({ children }: { children: React.ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  if (!url) return null;

  return (
    <a
      className="text-link calendly-link"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        if (
          window.Calendly &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          window.Calendly.initPopupWidget({ url });
        }
      }}
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </a>
  );
}
