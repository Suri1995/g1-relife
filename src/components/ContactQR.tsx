"use client";

import { QRCodeSVG } from "qrcode.react";
import { business } from "@/data/wellness";

export default function ContactQR() {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-evergreen/10 bg-white/60 p-6">
      <div className="rounded-xl bg-white p-3 shadow-sm">
        <QRCodeSVG
          value={business.whatsapp}
          size={92}
          fgColor="#173226"
          bgColor="#ffffff"
        />
      </div>
      <div>
        <p className="font-display text-[16px] text-evergreen">
          Scan to connect
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-moss">
          Scan with your phone camera to open a WhatsApp chat with G1 RE-LIFE
          Wellness Zone instantly.
        </p>
      </div>
    </div>
  );
}
