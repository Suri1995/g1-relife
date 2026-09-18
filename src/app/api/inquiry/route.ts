import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, phone, email, interest, message } = parsed.data;

    // TODO: Wire this up to your notification channel of choice —
    // e.g. Resend/SendGrid email, a CRM webhook, or a database insert.
    // Kept provider-agnostic here since no email/CRM credentials were
    // supplied as part of the source content.
    console.log("New inquiry received:", {
      name,
      phone,
      email,
      interest,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inquiry route error:", err);
    return NextResponse.json(
      { ok: false, errors: { form: ["Something went wrong. Please try again."] } },
      { status: 500 }
    );
  }
}
