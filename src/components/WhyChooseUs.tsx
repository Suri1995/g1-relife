import { whyChooseUs } from "@/data/wellness";
import SectionHeading from "./SectionHeading";
import { HeartHandshake, Leaf, MessageCircleHeart, Smile } from "lucide-react";

const icons = [Leaf, HeartHandshake, MessageCircleHeart, Smile];

export default function WhyChooseUs() {
  return (
    <section className="section-pad bg-cream">
      <div className="container-content">
        <SectionHeading
          title="Why people choose G1 RE-LIFE"
          align="center"
          description="A coaching relationship built on real support, not a generic program."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-evergreen/10 bg-white/60 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage/15 text-sage-dark">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 font-display text-[17px] text-evergreen">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-moss">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
