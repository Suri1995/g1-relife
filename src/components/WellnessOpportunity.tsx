import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { opportunity, business } from "@/data/wellness";

export default function WellnessOpportunity() {
  return (
    <section className="section-pad bg-evergreen">
      <div className="container-content relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-evergreen-dark p-6 grain sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            fill
            sizes="(max-width: 1024px) 90vw, 480px"
            className="object-cover"
          />
        </div>
        <div>
          <span className="inline-flex rounded-full border border-honey/40 px-4 py-1.5 text-[13px] font-medium text-honey-light">
            Wellness opportunity
          </span>
          <h2 className="mt-5 font-display text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.15] text-cream">
            {opportunity.title}
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-cream/70 sm:text-base">
            {opportunity.description}
          </p>
          <a
            href={business.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 text-[14px] font-medium text-evergreen-dark transition hover:bg-honey-light"
          >
            Learn about this opportunity
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
