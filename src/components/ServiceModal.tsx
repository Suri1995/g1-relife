"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Check, X } from "lucide-react";
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
          aria-labelledby="service-modal-title"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[min(85vh,900px)] w-[80vw] max-w-[80vw] flex-col overflow-hidden rounded-[1.75rem] bg-cream shadow-2xl md:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-evergreen shadow"
            >
              <X size={18} />
            </button>
            <div className="relative h-[35%] w-full shrink-0 bg-evergreen-dark/5 md:h-full md:w-2/5">
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 80vw, 32vw"
                className="object-cover"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 md:w-3/5 md:flex-none">
              <h2
                id="service-modal-title"
                className="font-display text-2xl text-evergreen sm:text-3xl"
              >
                {service.title}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
                {service.description}
              </p>

              {service.details && (
                <div className="mt-7 space-y-7">
                  <section>
                    <h3 className="font-display text-xl leading-snug text-evergreen sm:text-2xl">
                      {service.details.heading}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75 sm:text-[15px]">
                      {service.details.introduction}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-display text-lg text-evergreen sm:text-xl">
                      {service.details.subheading}
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {service.details.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-relaxed text-ink/75"
                        >
                          <Check
                            size={17}
                            aria-hidden
                            className="mt-0.5 shrink-0 text-evergreen"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h3 className="font-display text-lg text-evergreen sm:text-xl">
                      {service.details.benefitsHeading}
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {service.details.benefits.map((benefit) => (
                        <li
                          key={benefit}
                          className="flex items-start gap-2 rounded-xl bg-white/70 px-3 py-2.5 text-sm leading-relaxed text-ink/75"
                        >
                          <Check
                            size={16}
                            aria-hidden
                            className="mt-0.5 shrink-0 text-evergreen"
                          />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl bg-evergreen/[0.06] p-5">
                    <h3 className="font-display text-lg text-evergreen">
                      {service.details.closingHeading}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/75">
                      {service.details.closingDescription}
                    </p>
                  </section>
                </div>
              )}

              <a
                href="#contact"
                onClick={onClose}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-evergreen px-6 py-3 text-[14px] font-medium text-cream transition hover:bg-evergreen-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2"
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
