import { Phone } from "lucide-react";
import { business } from "@/data/wellness";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 sm:bottom-7 sm:right-7">
      <a
        href={`tel:${business.phoneRaw}`}
        aria-label="Call G1 RE-LIFE Wellness Zone"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-evergreen text-cream shadow-lg transition hover:bg-evergreen-light"
      >
        <Phone size={19} />
      </a>
      <a
        href={business.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition hover:bg-whatsapp-dark"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2C6.478 2 2 6.478 2 12.004c0 1.75.457 3.469 1.325 4.984L2 22l5.13-1.317a10.02 10.02 0 0 0 4.874 1.24h.005c5.525 0 10.003-4.478 10.003-10.004 0-2.674-1.043-5.187-2.937-7.08A9.936 9.936 0 0 0 12.004 2zm0 18.223h-.004a8.174 8.174 0 0 1-4.166-1.14l-.299-.177-3.045.782.813-2.968-.194-.305a8.19 8.19 0 0 1-1.256-4.41c0-4.523 3.68-8.203 8.207-8.203a8.15 8.15 0 0 1 5.804 2.406 8.15 8.15 0 0 1 2.4 5.805c0 4.524-3.68 8.21-8.26 8.21z" />
        </svg>
      </a>
    </div>
  );
}
