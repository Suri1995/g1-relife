"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Plus } from "lucide-react";
import { services, type Service } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

// Only needed once a card is tapped — keep it out of the initial bundle.
const ServiceModal = dynamic(() => import("./ServiceModal"));

export default function Services() {
  const [active, setActive] = useState<Service | null>(null);

  return (
    <section id="services" className="section-pad bg-sand">
      <div className="container-content">
        <SectionHeading
          title="Wellness programs for every goal"
          description="Sixteen focus areas, each built into a plan shaped around your body and your life."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActive(service)}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white text-left ring-1 ring-evergreen/8 transition hover:-translate-y-1 hover:ring-evergreen/15 hover:shadow-[0_18px_40px_-15px_rgba(23,50,38,0.35)]"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 items-start justify-between gap-3 p-5">
                <div>
                  <h3 className="font-display text-[17px] text-evergreen">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-moss">
                    {service.description}
                  </p>
                </div>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand text-evergreen transition group-hover:bg-honey group-hover:text-evergreen-dark">
                  <Plus size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ServiceModal service={active} onClose={() => setActive(null)} />
    </section>
  );
}
