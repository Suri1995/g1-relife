import Image from "next/image";
import { business } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section id="about" className="section-pad bg-cream">
      <div className="container-content grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div className="relative mx-auto w-full max-w-[380px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sand">
            <Image
              src={business.profileImage}
              alt={`${business.coachName}, ${business.coachTitle}`}
              fill
              sizes="(max-width: 1024px) 80vw, 380px"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-5 -top-5 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-evergreen text-center shadow-lg sm:-right-8 sm:-top-8 sm:h-28 sm:w-28">
            <span className="font-display text-lg text-sage-light sm:text-xl">
              1:1
            </span>
            <span className="px-2 text-[10px] leading-tight text-cream/70">
              coaching focus
            </span>
          </div>
        </div>

        <div>
          <SectionHeading
            title="Meet your wellness coach"
            description={`${business.coachName} — ${business.coachTitle}`}
          />
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink/75 sm:text-base">
            {business.about.slice(1).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="rounded-xl border border-evergreen/10 bg-white/60 p-4">
              <p className="font-display text-xl text-evergreen">Body</p>
              <p className="mt-1 text-[13px] text-moss">
                Nutrition & fitness plans
              </p>
            </div>
            <div className="rounded-xl border border-evergreen/10 bg-white/60 p-4">
              <p className="font-display text-xl text-evergreen">Mind</p>
              <p className="mt-1 text-[13px] text-moss">
                Stress & sleep support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
