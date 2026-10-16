"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { Stories } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

const GalleryLightbox = dynamic(() => import("./GalleryLightbox"));
const previewCount = 4;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SuccessStory() {
  const [index, setIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleStories = showAll ? Stories : Stories.slice(0, previewCount);

  return (
    <section id="success-stories" className="section-pad bg-cream">
      <div className="container-content">
        <SectionHeading
          title="Real stories. Real progress."
          description="Explore the wellness journeys shared by our G1 RE-LIFE community."
        />

        <div
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {visibleStories.map((src, storyIndex) => (
            <motion.button
              key={src}
              type="button"
              initial="hidden"
              animate="show"
              layoutId={`success-story-photo-${storyIndex}`}
              variants={fadeUp}
              transition={{ delay: Math.min(storyIndex * 0.08, 0.4) }}
              onClick={() => setIndex(storyIndex)}
              aria-label={`View success story ${storyIndex + 1}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-evergreen/5"
            >
              <Image
                src={src}
                alt={`G1 RE-LIFE community success story ${storyIndex + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/50 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-evergreen transition-transform group-hover:scale-105">
                <Expand size={15} />
              </span>
            </motion.button>
          ))}
        </div>

        {Stories.length > previewCount && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setShowAll((current) => !current);
                setIndex(null);
              }}
              className="inline-flex items-center justify-center rounded-full border border-evergreen/20 bg-white px-6 py-3 text-sm font-semibold text-evergreen transition hover:border-evergreen/40 hover:bg-evergreen/5"
            >
              {showAll ? "View less" : "More stories"}
            </button>
          </div>
        )}
      </div>

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
