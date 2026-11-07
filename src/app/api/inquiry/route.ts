
import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";
import { inquirySchema } from "@/lib/validation";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

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
        ${email || null},
        ${interest},
        ${message || null}
      )
      RETURNING id, created_at
    `;

    const inquiry = result[0];

    if (!inquiry) {
      throw new Error("Inquiry could not be saved.");
    }

    // Send notification through Resend
    const resend = new Resend(resendApiKey);

    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email || "Not provided");
    const safeInterest = escapeHtml(interest);
    const safeMessage = escapeHtml(message || "No additional message.");

    const { error: emailError } = await resend.emails.send({
      from: "G1 Relife <noreply@g1-relife.com>",
      to: [contactEmail],
      ...(email ? { replyTo: email } : {}),
      subject: `New Website Inquiry - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; color: #173b2c;">
          <h2 style="color: #173b2c;">New G1 Relife Inquiry</h2>

          <p>A new inquiry has been submitted through your website.</p>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Inquiry ID</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${escapeHtml(String(inquiry.id))}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Name</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Phone</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safePhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Interest</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeInterest}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Message</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd;">${safeMessage}</td>
            </tr>
          </table>

          <p style="margin-top: 24px; color: #777; font-size: 12px;">
            G1 Relife Website Inquiry System
          </p>
        </div>
      `,
      text: `
New G1 Relife Inquiry

Inquiry ID: ${inquiry.id}
Name: ${name}
Phone: ${phone}
Email: ${email || "Not provided"}
Interest: ${interest}
Message: ${message || "No additional message."}
      `,
    });

    // The database record is retained even if email delivery fails.
    if (emailError) {
      console.error("Resend notification failed:", emailError);

      return NextResponse.json({
        ok: true,
        saved: true,
        emailSent: false,
        message: "Inquiry saved. Email notification could not be sent.",
      });
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      emailSent: true,
      message: "Inquiry submitted successfully.",
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
