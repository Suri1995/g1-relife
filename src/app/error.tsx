"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <h1 className="font-display text-3xl text-evergreen">
        Something didn&apos;t load right
      </h1>
      <p className="max-w-md text-ink/70">
        We hit a snag showing this page. You can try again, or reach us
        directly on WhatsApp and we&apos;ll help right away.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-evergreen px-6 py-3 text-sm font-medium text-cream transition hover:bg-evergreen-light"
        >
          Try again
        </button>
        <a
          href="https://wa.me/919966763679"
          className="rounded-full border border-evergreen/30 px-6 py-3 text-sm font-medium text-evergreen transition hover:bg-evergreen/5"
        >
          Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
