import { ArrowRight } from "lucide-react";
import { business } from "@/data/wellness";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-evergreen py-16 grain sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-organic bg-sage/20 blur-3xl"
      />
      <div className="container-content relative text-center">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] text-cream">
          Ready to feel like yourself again?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-cream/70">
          Your first conversation with {business.coachName} is the first step
          toward a lifestyle that actually fits you.
        </p>
        <a
          href="#contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-honey px-7 py-3.5 text-[15px] font-medium text-evergreen-dark transition hover:bg-honey-light"
        >
          Get started today
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
