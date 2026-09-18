"use client";

import { useMemo, useState } from "react";
import { calculateBmi } from "@/lib/utils";
import SectionHeading from "./SectionHeading";

export default function BMICalculator() {
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(65);

  const result = useMemo(() => calculateBmi(height, weight), [height, weight]);

  // gauge position 0-100 across a 15 - 35 bmi range
  const gaugePct = result
    ? Math.min(100, Math.max(0, ((result.bmi - 15) / (35 - 15)) * 100))
    : 0;

  return (
    <section id="bmi" className="section-pad bg-evergreen-dark">
      <div className="container-content grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          tone="light"
          title="Check your BMI in seconds"
          description="A quick starting point for our conversation — not a diagnosis. Your coach will look at the full picture with you."
        />

        <div className="rounded-[2rem] bg-cream p-7 shadow-2xl sm:p-9">
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-[13px] font-medium text-moss">
                Height (cm)
              </span>
              <input
                type="range"
                min={120}
                max={210}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="mt-3 w-full accent-honey"
                aria-label="Height in centimeters"
              />
              <span className="mt-1 block font-display text-2xl text-evergreen">
                {height} cm
              </span>
            </label>

            <label className="block">
              <span className="text-[13px] font-medium text-moss">
                Weight (kg)
              </span>
              <input
                type="range"
                min={30}
                max={150}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="mt-3 w-full accent-honey"
                aria-label="Weight in kilograms"
              />
              <span className="mt-1 block font-display text-2xl text-evergreen">
                {weight} kg
              </span>
            </label>
          </div>

          {result && (
            <div className="mt-8 rounded-2xl bg-sand p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[13px] text-moss">Your BMI</p>
                  <p className="font-display text-4xl text-evergreen">
                    {result.bmi}
                  </p>
                </div>
                <span
                  className="rounded-full px-4 py-1.5 text-[13px] font-medium text-cream"
                  style={{ backgroundColor: result.color }}
                >
                  {result.category}
                </span>
              </div>
              <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-evergreen/10">
                <div
                  className="h-full rounded-full bg-honey transition-all duration-300"
                  style={{ width: `${gaugePct}%` }}
                />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-moss">
                Want a plan tailored to this number?{" "}
                <a href="#contact" className="font-medium text-evergreen underline underline-offset-2">
                  Talk to your coach
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
