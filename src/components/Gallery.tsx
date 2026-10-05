"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { business, gallery } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

// Only needed once a thumbnail is tapped — keep it out of the initial bundle.
const GalleryLightbox = dynamic(() => import("./GalleryLightbox"));

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const [featured, ...rest] = gallery;

  return (
    <section id="gallery" className="section-pad bg-cream">
      <div className="container-content">
        <SectionHeading
          title="A glimpse into the wellness zone"
          description="Moments from sessions, programs, and the G1 RE-LIFE community."
        />

        <div className="mt-12 space-y-4">
          {/* Featured photo — the tile a viewer's eye lands on first. */}
          <motion.button
            layoutId="gallery-photo-0"
            onClick={() => setIndex(0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:aspect-[3/1]"
          >
            <Image
              src={featured}
              alt="G1 RE-LIFE Wellness Zone gallery photo 1"
              fill
              priority={false}
              sizes="(max-width: 640px) 100vw, 1100px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/70 via-evergreen-dark/10 to-transparent transition-opacity group-hover:from-evergreen-dark/80" />

            <div className="absolute bottom-5 left-5 flex items-center gap-2 text-[13px] font-medium text-cream">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream/15 backdrop-blur-sm transition group-hover:bg-honey group-hover:text-evergreen-dark">
                <Expand size={14} />
              </span>
              {business.name}
            </div>
          </motion.button>

          {/* Supporting strip */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {rest.map((src, i) => {
              const absoluteIndex = i + 1;
              return (
                <motion.button
                  key={src}
                  layoutId={`gallery-photo-${absoluteIndex}`}
                  variants={fadeUp}
                  onClick={() => setIndex(absoluteIndex)}
                  className="group relative aspect-square overflow-hidden rounded-2xl"
                >
                  <Image
                    src={src}
                    alt={`G1 RE-LIFE Wellness Zone gallery photo ${absoluteIndex + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-evergreen-dark/0 transition-colors group-hover:bg-evergreen-dark/30" />
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 text-evergreen opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100">
                    <Expand size={14} />
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      <GalleryLightbox
        images={gallery}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </section>
  );
}