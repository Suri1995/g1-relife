"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
  imageLabel = "Gallery",
  layoutIdPrefix = "gallery-photo",
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
  imageLabel?: string;
  layoutIdPrefix?: string;
}) {
  const open = index !== null;
  const dialogRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index !== null)
        onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft" && index !== null)
        onNavigate((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence mode="popLayout">
      {open && index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          ref={dialogRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-evergreen-dark/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${imageLabel} image viewer`}
        >
          <button
            aria-label="Close gallery"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream"
          >
            <X size={20} />
          </button>

          <button
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index - 1 + images.length) % images.length);
            }}
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream sm:left-6"
          >
            <ChevronLeft size={22} />
          </button>

          <motion.div
            key={index}
            layoutId={`${layoutIdPrefix}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative h-[70vh] w-full max-w-3xl"
          >
            <Image
              src={images[index]}
              alt={`${imageLabel} ${index + 1}`}
              fill
              sizes="90vw"
              className="rounded-xl object-contain"
            />
          </motion.div>

          <button
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((index + 1) % images.length);
            }}
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream sm:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}