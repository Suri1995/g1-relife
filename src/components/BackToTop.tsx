"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-cream text-evergreen shadow-lg ring-1 ring-evergreen/10 transition hover:bg-sand sm:bottom-7 sm:left-7"
    >
      <ArrowUp size={18} />
    </button>
  );
}
