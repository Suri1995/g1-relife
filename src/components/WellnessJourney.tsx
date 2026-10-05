"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { journeySteps } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

type Step = (typeof journeySteps)[number];

/**
 * A badge whose fill rises like liquid as the shared scroll progress passes
 * this step's position — one continuous mechanism driving both the overall
 * track and each node, rather than separate, uncoordinated animations.
 */
function JourneyBadge({
  label,
  index,
  total,
  progress,
}: {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / Math.max(total - 1, 1);
  const fill = useTransform(progress, [Math.max(start - 0.1, 0), start + 0.02], [0, 1]);

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream ring-1 ring-evergreen/15">
      <motion.div
        aria-hidden
        style={{ scaleY: fill, originY: 1 }}
        className="absolute inset-0 bg-honey"
      />
      {/* evergreen text reads clearly against both the cream rest-state
          and the honey fill, so it never needs to swap color mid-scroll */}
      <span className="relative z-10 flex h-full w-full items-center justify-center font-display text-[15px] text-evergreen">
        {label}
      </span>
    </div>
  );
}

function JourneyContent({ step, index }: { step: Step; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="sr-only">Step {index + 1}: </span>
      <h3 className="font-display text-[17px] text-evergreen">{step.title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-moss">
        {step.description}
      </p>
    </motion.div>
  );
}

export default function WellnessJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.85", "end 0.5"],
  });

  const total = journeySteps.length;

  return (
    <section id="journey" className="section-pad bg-sand">
      <div className="container-content">
        <SectionHeading
          title="Your wellness journey, step by step"
          description="A simple, guided path from your first message to a lasting lifestyle change."
        />

        <div ref={trackRef} className="relative mt-14">
          {/* Below sm: a vertical timeline — previously mobile had no
              connecting line at all. */}
          <div className="relative space-y-10 sm:hidden">
            <div
              aria-hidden
              className="absolute bottom-2 left-6 top-2 w-px bg-evergreen/12"
            />
            <motion.div
              aria-hidden
              style={{ scaleY: scrollYProgress, originY: 0 }}
              className="absolute bottom-2 left-6 top-2 w-px bg-honey"
            />
            {journeySteps.map((step, i) => (
              <div key={step.step} className="relative flex gap-5">
                <JourneyBadge
                  label={step.step}
                  index={i}
                  total={total}
                  progress={scrollYProgress}
                />
                <div className="pt-1.5">
                  <JourneyContent step={step} index={i} />
                </div>
              </div>
            ))}
          </div>

          {/* sm and up: 2 → 4 column grid. The connecting line only spans
              a single row, so it's reserved for the lg 4-up layout. */}
          <div className="relative hidden sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-4 lg:gap-8">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px bg-evergreen/12 lg:block"
            />
            <motion.div
              aria-hidden
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="absolute left-0 right-0 top-6 hidden h-px bg-honey lg:block"
            />
            {journeySteps.map((step, i) => (
              <div key={step.step}>
                <JourneyBadge
                  label={step.step}
                  index={i}
                  total={total}
                  progress={scrollYProgress}
                />
                <div className="mt-5">
                  <JourneyContent step={step} index={i} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}