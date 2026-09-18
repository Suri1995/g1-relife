import { journeySteps } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

export default function WellnessJourney() {
  return (
    <section id="journey" className="section-pad bg-sand">
      <div className="container-content">
        <SectionHeading
          title="Your wellness journey, step by step"
          description="A simple, guided path from your first message to a lasting lifestyle change."
        />

        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-evergreen/15 lg:block"
          />
          {journeySteps.map((step) => (
            <div key={step.step} className="relative">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-evergreen font-display text-base text-sage-light">
                {step.step}
              </div>
              <h3 className="mt-5 font-display text-[17px] text-evergreen">
                {step.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-moss">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
