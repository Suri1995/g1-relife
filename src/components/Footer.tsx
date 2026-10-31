import { Facebook, Instagram, Leaf, Youtube } from "lucide-react";
import { business, services } from "@/data/wellness";

export default function Footer() {
  return (
    <footer className="bg-evergreen-dark pt-16 text-cream/70">
      <div className="container-content grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img
            src="/logo_white_transparent.png"
            alt="G1 RE-LIFE"
            className="block h-30 w-auto max-w-[180px] object-contain object-left"
          />
          </div>
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed">
            Personalized wellness solutions for a healthier, more balanced
            lifestyle — guided by {business.coachName}.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={business.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-cream/20"
            >
              <Facebook size={16} />
            </a>
            <a
              href={business.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-cream/20"
            >
              <Instagram size={16} />
            </a>
            <a
              href={business.social.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream/10 transition hover:bg-cream/20"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream">Popular programs</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            {services.slice(0, 5).map((s) => (
              <li key={s.id}>
                <a href="#services" className="hover:text-cream">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            <li><a href="#about" className="hover:text-cream">About</a></li>
            <li><a href="#journey" className="hover:text-cream">Wellness journey</a></li>
            <li><a href="#bmi" className="hover:text-cream">BMI calculator</a></li>
            <li><a href="#gallery" className="hover:text-cream">Gallery</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[13px] font-medium text-cream">Contact</p>
          <ul className="mt-4 space-y-2.5 text-[13.5px]">
            <li>{business.phoneDisplay}</li>
            <li className="break-all">{business.email}</li>
            <li>{business.locationName}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-6">
        <div className="container-content flex flex-col items-center justify-between gap-3 text-[12.5px] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p>Coached by {business.coachName}</p>
        </div>
      </div>
    </footer>
  );
}
