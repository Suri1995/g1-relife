import { Phone } from "lucide-react";
import { business } from "@/data/wellness";

/**
 * Floating contact actions for G1 RE-LIFE Wellness Zone.
 *
 * Motion plan (kept deliberate, not busy):
 *  - One entrance: the dock rises in, WhatsApp first, then Call.
 *  - WhatsApp: soft double ripple + gentle float to draw the eye.
 *  - Call: the handset "rings" briefly every few seconds, then rests.
 *  - Hover / keyboard focus: a label slides out to the left.
 *  - All looping motion stops for users who prefer reduced motion.
 */

const COPPER = "#C9976B"; // matches the copper figure in the logo

const styles = `
@keyframes gl-rise {
  from { opacity: 0; transform: translateY(18px) scale(.92); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes gl-ripple {
  0%   { transform: scale(1);   opacity: .45; }
  100% { transform: scale(1.95); opacity: 0; }
}
@keyframes gl-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2.5px); }
}
@keyframes gl-handset {
  0%, 62%, 100% { transform: rotate(0); }
  66%  { transform: rotate(-16deg); }
  70%  { transform: rotate(14deg); }
  74%  { transform: rotate(-12deg); }
  78%  { transform: rotate(10deg); }
  82%  { transform: rotate(-6deg); }
  86%  { transform: rotate(0); }
}
@keyframes gl-halo {
  0%, 62%, 100% { opacity: .55; transform: scale(1); }
  74%           { opacity: 1;   transform: scale(1.12); }
}
.gl-rise-1 { animation: gl-rise .7s cubic-bezier(.2,.8,.2,1) .6s both; }
.gl-rise-2 { animation: gl-rise .7s cubic-bezier(.2,.8,.2,1) .8s both; }
.gl-ripple { animation: gl-ripple 2.6s ease-out infinite; }
.gl-ripple-2 { animation-delay: 1.3s; }
.gl-float { animation: gl-float 3.2s ease-in-out infinite; }
.gl-handset { animation: gl-handset 5.5s ease-in-out 2s infinite; transform-origin: 50% 55%; }
.gl-halo { animation: gl-halo 5.5s ease-in-out 2s infinite; }
@media (prefers-reduced-motion: reduce) {
  .gl-rise-1, .gl-rise-2, .gl-ripple, .gl-float, .gl-handset, .gl-halo {
    animation: none !important;
  }
}
`;

const labelClasses =
  "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full " +
  "border border-[#C9976B]/40 bg-cream/95 px-4 py-2 text-sm font-medium tracking-wide text-evergreen " +
  "shadow-[0_8px_24px_-8px_rgba(31,48,37,0.35)] backdrop-blur " +
  "translate-x-3 opacity-0 transition duration-300 ease-out " +
  "group-hover:translate-x-0 group-hover:opacity-100 " +
  "group-focus-visible:translate-x-0 group-focus-visible:opacity-100";

const focusClasses =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#C9976B] focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function FloatingActions() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-4 sm:bottom-7 sm:right-7">
        {/* WhatsApp */}
        <div className="gl-rise-1">
          <a
            href={business.whatsapp}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat on WhatsApp"
            className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_28px_-6px_rgba(37,211,102,0.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-whatsapp-dark hover:shadow-[0_14px_32px_-6px_rgba(37,211,102,0.65)] active:scale-95 ${focusClasses}`}
          >
            {/* ripples */}
            <span aria-hidden className="gl-ripple absolute inset-0 -z-10 rounded-full bg-whatsapp" />
            <span aria-hidden className="gl-ripple gl-ripple-2 absolute inset-0 -z-10 rounded-full bg-whatsapp" />

            {/* thin copper ring */}
            <span
              aria-hidden
              className="absolute -inset-[5px] rounded-full border"
              style={{ borderColor: `${COPPER}99` }}
            />

            <span className="gl-float flex transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.75.457 3.469 1.325 4.984L2 22l5.13-1.317a10.02 10.02 0 0 0 4.874 1.24h.005c5.525 0 10.003-4.478 10.003-10.004 0-2.674-1.043-5.187-2.937-7.08A9.936 9.936 0 0 0 12.004 2zm0 18.223h-.004a8.174 8.174 0 0 1-4.166-1.14l-.299-.177-3.045.782.813-2.968-.194-.305a8.19 8.19 0 0 1-1.256-4.41c0-4.523 3.68-8.203 8.207-8.203a8.15 8.15 0 0 1 5.804 2.406 8.15 8.15 0 0 1 2.4 5.805c0 4.524-3.68 8.21-8.26 8.21z" />
              </svg>
            </span>

            <span className={labelClasses}>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Call */}
        <div className="gl-rise-2 mr-1">
          <a
            href={`tel:${business.phoneRaw}`}
            aria-label="Call G1 RE-LIFE Wellness Zone"
            className={`group relative flex h-12 w-12 items-center justify-center rounded-full bg-evergreen text-cream shadow-[0_10px_28px_-8px_rgba(31,48,37,0.6)] transition duration-300 hover:-translate-y-0.5 hover:bg-evergreen-light active:scale-95 ${focusClasses}`}
          >
            {/* copper halo that pulses with the ring */}
            <span
              aria-hidden
              className="gl-halo absolute -inset-[5px] rounded-full border"
              style={{ borderColor: COPPER }}
            />

            <span className="gl-handset flex transition-transform duration-300 group-hover:scale-110">
              <Phone size={19} strokeWidth={1.9} />
            </span>

            <span className={labelClasses}>Call us</span>
          </a>
        </div>
      </div>
    </>
  );
}