import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // TODO: Wire this up to your mailing list provider (Mailchimp,
    // Resend Audiences, Brevo, etc.)
    console.log("Newsletter signup:", parsed.data.email, new Date().toISOString());

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter route error:", err);
    return NextResponse.json(
      { ok: false, errors: { form: ["Something went wrong. Please try again."] } },
      { status: 500 }
    );
  }
}
