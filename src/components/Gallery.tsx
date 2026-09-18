"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gallery } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

// Only needed once a thumbnail is tapped — keep it out of the initial bundle.
const GalleryLightbox = dynamic(() => import("./GalleryLightbox"));

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-pad bg-cream">
      <div className="container-content">
        <SectionHeading
          title="A glimpse into the wellness zone"
          description="Moments from sessions, programs, and the G1 RE-LIFE community."
        />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {gallery.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              className={`group relative aspect-square overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1" : ""
              }`}
            >
              <Image
                src={src}
                alt={`G1 RE-LIFE Wellness Zone gallery photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-evergreen-dark/0 transition-colors group-hover:bg-evergreen-dark/20" />
            </button>
          ))}
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
