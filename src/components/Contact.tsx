import dynamic from "next/dynamic";
import { Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/data/wellness";
import SectionHeading from "./SectionHeading";
import InquiryForm from "./InquiryForm";

// The QR code library is only needed for this one decorative widget —
// split it out of the shared bundle.
const ContactQR = dynamic(() => import("./ContactQR"), {
  loading: () => (
    <div
      aria-hidden
      className="h-[124px] animate-pulse rounded-2xl border border-evergreen/10 bg-white/40"
    />
  ),
});
const Newsletter = dynamic(() => import("./Newsletter"));

export default function Contact() {
  return (
    <section id="contact" className="section-pad bg-sand">
      <div className="container-content grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            title="Start your wellness journey"
            description="Reach out with a message, or book a consultation directly — we're here to help."
          />

          <div className="mt-8 space-y-4">
            <a
              href={`tel:${business.phoneRaw}`}
              className="flex items-center gap-4 rounded-2xl border border-evergreen/10 bg-white/60 p-5 transition hover:border-honey/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-dark">
                <Phone size={18} />
              </span>
              <div>
                <p className="text-[12px] text-moss">Call or WhatsApp</p>
                <p className="font-display text-[15px] text-evergreen">
                  {business.phoneDisplay}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${business.email}`}
              className="flex items-center gap-4 rounded-2xl border border-evergreen/10 bg-white/60 p-5 transition hover:border-honey/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-dark">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-[12px] text-moss">Email</p>
                <p className="font-display text-[15px] text-evergreen">
                  {business.email}
                </p>
              </div>
            </a>

            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-evergreen/10 bg-white/60 p-5 transition hover:border-honey/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-dark">
                <MapPin size={18} />
              </span>
              <div>
                <p className="text-[12px] text-moss">Location</p>
                <p className="font-display text-[15px] text-evergreen">
                  {business.locationName}
                </p>
              </div>
            </a>
          </div>

          <div className="mt-6">
            <ContactQR />
          </div>

          <div className="mt-6">
            <Newsletter />
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-9">
          <h3 className="font-display text-xl text-evergreen">Send an inquiry</h3>
          <p className="mt-1.5 text-[13.5px] text-moss">
            Fill this out and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="mt-6">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
