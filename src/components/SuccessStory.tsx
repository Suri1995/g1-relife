
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Expand,
  Sparkles,
} from "lucide-react";

import { Stories } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"));

const previewCount = 4;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function SuccessStory() {
  const [index, setIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleStories = showAll
    ? Stories
    : Stories.slice(0, previewCount);

  return (
    <section
      id="success-stories"
      className="relative overflow-hidden bg-cream py-20 sm:py-24 lg:py-28"
    >
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-evergreen/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-evergreen/5 blur-3xl" />

      <div className="container-content relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionHeading
            title="Real stories. Real progress."
            description="Every transformation tells a story of commitment, consistency, and a healthier tomorrow."
          />
        </motion.div>

        {/* Gallery introduction */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={15} className="text-evergreen" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-evergreen/70">
                Community transformations
              </span>
            </div>

            <p className="max-w-xl text-sm leading-7 text-evergreen/65 sm:text-base">
              A glimpse into the journeys and milestones of our wellness
              community.
            </p>
          </div>

          <span className="text-xs font-semibold tracking-wide text-evergreen/50">
            {String(Stories.length).padStart(2, "0")} STORIES
          </span>
        </motion.div>

        {/* Story gallery */}
        <motion.div
          layout
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {visibleStories.map((src, storyIndex) => (
              <motion.button
                key={src}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  y: 15,
                  transition: { duration: 0.25 },
                }}
                type="button"
                onClick={() => setIndex(storyIndex)}
                aria-label={`View success story ${storyIndex + 1}`}
                className="group relative isolate aspect-[4/5] overflow-hidden rounded-2xl bg-evergreen/10 text-left shadow-[0_8px_25px_rgba(20,50,35,0.06)] outline-none transition-shadow duration-500 hover:shadow-[0_20px_45px_rgba(20,50,35,0.18)] focus-visible:ring-2 focus-visible:ring-evergreen focus-visible:ring-offset-4"
              >
                {/* Image */}
                <Image
                  src={src}
                  alt={`G1 RE-LIFE community success story ${storyIndex + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071b12]/65 via-transparent to-[#071b12]/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Top label */}
                <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                  <span className="rounded-full border border-white/30 bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md">
                    G1 RE-LIFE
                  </span>
                </div>

                {/* Bottom information */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                  <div className="translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/70">
                      Community story
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      View journey
                    </p>
                  </div>

                  {/* Expand button */}
                  <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-evergreen sm:h-11 sm:w-11">
                    <Expand size={16} strokeWidth={1.7} />
                  </span>
                </div>

                {/* Hover border */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/50" />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View more / less */}
        {Stories.length > previewCount && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-col items-center"
          >
            <motion.button
              type="button"
              onClick={() => {
                setShowAll((current) => !current);
                setIndex(null);
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center gap-3 rounded-full border border-evergreen/20 bg-evergreen px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(20,50,35,0.12)] transition-all duration-300 hover:bg-evergreen-dark hover:shadow-[0_12px_30px_rgba(20,50,35,0.2)]"
            >
              {showAll ? "View fewer stories" : "Explore all stories"}

              <motion.span
                animate={{ rotate: showAll ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {showAll ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowRight size={16} />
                )}
              </motion.span>
            </motion.button>

            <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-evergreen/40">
              {showAll
                ? "Showing all community stories"
                : `${Stories.length - previewCount} more stories to explore`}
            </p>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        images={Stories}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
        imageLabel="Success story"
        layoutIdPrefix="success-story-photo"
      />
    </section>
  );
}
