import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/validation";
import { business } from "@/data/wellness";
import { buildOwnerEmail, buildThankYouEmail } from "@/lib/email-templates";
import { LOGO_BASE64, LOGO_CONTENT_ID } from "@/lib/email-logo";

export const runtime = "nodejs";

const FROM = "G1 RE-LIFE Wellness Zone <noreply@g1-relife.com>";
// Same sender name as the original plain notification (kept it in Primary).
const OWNER_FROM = "G1 Relife <noreply@g1-relife.com>";

// Logo is attached inline (CID) so it always shows, with no hosted URL needed.
const logoAttachment = {
  filename: "g1-logo.png",
  content: Buffer.from(LOGO_BASE64, "base64"),
  contentId: LOGO_CONTENT_ID,
};

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    const databaseUrl = process.env.DATABASE_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!databaseUrl || !resendApiKey || !contactEmail) {
      console.error("Missing required inquiry environment variables.");

      return NextResponse.json(
        { ok: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    // Parse and validate request
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, phone, email, interest, message } = parsed.data;

    // Connect to Neon PostgreSQL
    const sql = neon(databaseUrl);

    // Save inquiry to database
    const result = await sql`
      INSERT INTO inquiries (
        name,
        phone,
        email,
        interest,
        message
      )
      VALUES (
        ${name},
        ${phone},
        ${email},
        ${interest},
        ${message || null}
      )
      RETURNING id, created_at
    `;

    const inquiry = result[0];

    if (!inquiry) {
      throw new Error("Inquiry could not be saved.");
    }

    // Build both emails
    const emailData = {
      id: String(inquiry.id),
      name,
      phone,
      email,
      interest,
      message: message || null,
      createdAt: inquiry.created_at
        ? new Date(inquiry.created_at as string | Date)
        : new Date(),
    };
    const ctx = { business, logoSrc: `cid:${LOGO_CONTENT_ID}` };

    const owner = buildOwnerEmail(emailData, ctx);
    const thanks = buildThankYouEmail(emailData, ctx);

    const resend = new Resend(resendApiKey);

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL || "https://g1-relife.com"
    ).replace(/\/+$/, "");

    type Payload = {
      from: string;
      to: string[];
      replyTo?: string;
      subject: string;
      html: string;
      text: string;
    };

    // Send with the inline logo. If Resend rejects the attachment, retry
    // without it (logo falls back to the hosted file) so the email still arrives.
    const problems: { email: string; error: unknown }[] = [];

    const sendEmail = async (label: string, payload: Payload) => {
      try {
        const first = await resend.emails.send({
          ...payload,
          attachments: [logoAttachment],
        });
        if (!first.error) return true;

        console.error(`[${label}] send with logo failed:`, first.error);
        problems.push({ email: `${label} (with logo)`, error: first.error });

        const fallbackHtml = payload.html
          .split(`cid:${LOGO_CONTENT_ID}`)
          .join(`${siteUrl}/android-chrome-192x192.png`);

        const retry = await resend.emails.send({ ...payload, html: fallbackHtml });
        if (retry.error) {
          console.error(`[${label}] retry without logo failed:`, retry.error);
          problems.push({ email: `${label} (retry)`, error: retry.error });
          return false;
        }
        return true;
      } catch (err) {
        console.error(`[${label}] unexpected send error:`, err);
        problems.push({ email: label, error: String(err) });
        return false;
      }
    };

    // Send one after the other (Resend rate-limits parallel bursts).
    const emailSent = await sendEmail("owner-notification", {
      from: OWNER_FROM,
      to: [contactEmail],
      replyTo: email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    });

    // Brief pause so two sends never hit Resend's per-second limit.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const confirmationSent = await sendEmail("lead-confirmation", {
      from: FROM,
      to: [email],
      replyTo: contactEmail,
      subject: thanks.subject,
      html: thanks.html,
      text: thanks.text,
    });

    // The database record is retained even if email delivery fails.
    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent,
      confirmationSent,
      message: "Inquiry submitted successfully.",
      // Only in local development: shows exactly why an email failed.
      ...(process.env.NODE_ENV !== "production" ? { debug: problems } : {}),
    });
  } catch (error) {
    console.error("Inquiry API error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Unable to submit your inquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}