"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { Service } from "@/data/wellness";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function ServiceModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const dialogRef = useFocusTrap<HTMLDivElement>(!!service);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (service) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-evergreen-dark/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={service.title}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] bg-cream shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-evergreen shadow"
            >
              <X size={18} />
            </button>
            <div className="relative h-56 w-full">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
            </div>
            <div className="p-7">
              <h3 className="font-display text-2xl text-evergreen">
                {service.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                {service.description}
              </p>
              <a
                href="#contact"
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-evergreen px-6 py-3 text-[14px] font-medium text-cream transition hover:bg-evergreen-light"
              >
                Ask about this program
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
