/**
 * Email templates for G1 RE-LIFE Wellness Zone.
 * Table-based layout with inline styles so it renders consistently in
 * Gmail, Outlook, Apple Mail and on mobile.
 */

export type BusinessInfo = {
  phoneDisplay: string;
  phoneRaw: string;
  email: string;
  locationName: string;
  mapsUrl: string;
};

export type InquiryEmailData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  message?: string | null;
  createdAt: Date;
};

type Ctx = {
  business: BusinessInfo;
  /** Image source for the logo, e.g. "cid:g1-logo" for an inline attachment. */
  logoSrc: string;
};

/* ------------------------------------------------------------------ */
/* Design tokens                                                       */
/* ------------------------------------------------------------------ */
const C = {
  evergreen: "#173b2c",
  evergreenLight: "#1f4d3a",
  honey: "#d9a441",
  honeyDark: "#a97a22",
  honeySoft: "#f3d9a0",
  cream: "#faf6ec",
  panel: "#f7f2e5",
  sand: "#f1ece0",
  ink: "#24332b",
  muted: "#6b7a70",
  line: "#e9e2d2",
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
export function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return value.replace(/[&<>"']/g, (c) => entities[c]);
}

/** Digits-only number for wa.me links. 10-digit numbers get the India code. */
function waNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function telHref(raw: string): string {
  return `tel:${raw.replace(/[^\d+]/g, "")}`;
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function refCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

type ButtonKind = "primary" | "gold" | "ghost";

function button(href: string, label: string, kind: ButtonKind): string {
  const styles: Record<ButtonKind, string> = {
    primary: `background:${C.evergreen};color:#ffffff;border:1px solid ${C.evergreen};`,
    gold: `background:${C.honey};color:${C.evergreen};border:1px solid ${C.honey};`,
    ghost: `background:#ffffff;color:${C.evergreen};border:1px solid ${C.evergreen};`,
  };
  return `<a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;margin:5px;padding:13px 26px;border-radius:999px;font-family:${SANS};font-size:14px;font-weight:600;letter-spacing:0.3px;text-decoration:none;${styles[kind]}">${label}</a>`;
}

function detailRow(label: string, valueHtml: string, last = false): string {
  return `
    <tr>
      <td style="padding:15px 0;${last ? "" : `border-bottom:1px solid ${C.line};`}">
        <div style="font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">${label}</div>
        <div style="margin-top:5px;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink};word-break:break-word;overflow-wrap:anywhere;">${valueHtml}</div>
      </td>
    </tr>`;
}

function link(href: string, text: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${C.evergreen};font-weight:600;text-decoration:none;border-bottom:1px solid ${C.honey};">${escapeHtml(text)}</a>`;
}

/* ------------------------------------------------------------------ */
/* Shared shell: header with logo, footer                              */
/* ------------------------------------------------------------------ */
function shell(opts: {
  preheader: string;
  body: string;
  ctx: Ctx;
  footerNote: string;
}): string {
  const { ctx, preheader, body, footerNote } = opts;
  const { business, logoSrc: logo } = ctx;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>G1 RE-LIFE Wellness Zone</title>
  <style>
    @media only screen and (max-width: 480px) {
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.sand};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.sand};">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${C.line};border-radius:24px;overflow:hidden;">

          <!-- Accent bar -->
          <tr>
            <td style="height:5px;line-height:5px;font-size:0;background:${C.honey};background-image:linear-gradient(90deg,${C.evergreen},${C.honey},${C.evergreen});">&nbsp;</td>
          </tr>

          <!-- Header with logo -->
          <tr>
            <td align="center" style="background:${C.cream};padding:36px 24px 28px;border-bottom:1px solid ${C.line};">
              <img src="${escapeHtml(logo)}" width="84" height="84" alt="G1 RE-LIFE Wellness Zone" style="display:block;margin:0 auto;border:0;outline:none;width:84px;height:84px;" />
              <div style="margin-top:14px;font-family:${SERIF};font-size:20px;letter-spacing:4px;color:${C.evergreen};">G1 RE-LIFE</div>
              <div style="margin-top:4px;font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:4px;color:${C.honeyDark};">WELLNESS ZONE</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="px" style="padding:40px 40px 32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px" align="center" style="background:${C.evergreen};padding:30px 32px;">
              <div style="font-family:${SERIF};font-size:16px;letter-spacing:3px;color:${C.honeySoft};">G1 RE-LIFE</div>
              <div style="margin-top:10px;font-family:${SANS};font-size:13px;line-height:1.7;color:#cfe0d6;">
                <a href="${escapeHtml(telHref(business.phoneRaw))}" style="color:#cfe0d6;text-decoration:none;">${escapeHtml(business.phoneDisplay)}</a>
                &nbsp;&middot;&nbsp;
                <a href="mailto:${escapeHtml(business.email)}" style="color:#cfe0d6;text-decoration:none;">${escapeHtml(business.email)}</a>
              </div>
              <div style="margin-top:2px;font-family:${SANS};font-size:13px;line-height:1.7;">
                <a href="${escapeHtml(business.mapsUrl)}" style="color:#cfe0d6;text-decoration:none;">${escapeHtml(business.locationName)}</a>
              </div>
              <div style="margin:18px auto 0;width:40px;height:1px;background:${C.honey};line-height:1px;font-size:0;">&nbsp;</div>
              <div style="margin-top:14px;font-family:${SANS};font-size:11px;line-height:1.6;color:#8fb0a0;">
                ${footerNote}
              </div>
            </td>
          </tr>
        </table>

        <div style="max-width:600px;padding:18px 12px 0;font-family:${SANS};font-size:11px;color:${C.muted};">
          &copy; ${new Date().getFullYear()} G1 RE-LIFE Wellness Zone. All rights reserved.
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/* 1. Notification sent to the business owner                          */
/* ------------------------------------------------------------------ */
export function buildOwnerEmail(data: InquiryEmailData, ctx: Ctx) {
  const name = escapeHtml(data.name);
  const message = data.message?.trim()
    ? escapeHtml(data.message.trim()).replace(/\n/g, "<br />")
    : "No additional message.";

  // Deliberately lightweight (no buttons, banners or coloured blocks) so Gmail
  // treats it as a normal notification and keeps it in the Primary tab.
  const row = (label: string, value: string, last = false) => {
    const border = last ? "" : `border-bottom:1px solid ${C.line};`;
    return `
      <tr>
        <td style="width:110px;padding:12px 12px 12px 0;vertical-align:top;font-family:${SANS};font-size:13px;font-weight:bold;color:${C.muted};${border}">${label}</td>
        <td style="padding:12px 0;font-family:${SANS};font-size:15px;line-height:1.5;color:${C.ink};word-break:break-word;overflow-wrap:anywhere;${border}">${value}</td>
      </tr>`;
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Website Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;">
          <tr>
            <td style="padding-bottom:16px;border-bottom:2px solid ${C.honey};">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${escapeHtml(ctx.logoSrc)}" width="44" height="44" alt="G1 RE-LIFE" style="display:block;border:0;width:44px;height:44px;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:12px;">
                    <div style="font-family:${SERIF};font-size:18px;letter-spacing:2px;color:${C.evergreen};">G1 RE-LIFE</div>
                    <div style="font-family:${SANS};font-size:10px;letter-spacing:3px;color:${C.honeyDark};">WELLNESS ZONE</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;">
              <h2 style="margin:0;font-family:${SANS};font-size:20px;color:${C.evergreen};">New G1 Relife Inquiry</h2>
              <p style="margin:8px 0 18px;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.ink};">
                A new inquiry has been submitted through your website on ${escapeHtml(formatDate(data.createdAt))} (IST).
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.line};">
                ${row("Name", name)}
                ${row("Phone", link(telHref(data.phone), data.phone))}
                ${row("Email", link(`mailto:${data.email}`, data.email))}
                ${row("Interest", escapeHtml(data.interest))}
                ${row("Message", message)}
                ${row("Reference", `#${escapeHtml(refCode(data.id))}`, true)}
              </table>
              <p style="margin:24px 0 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">
                G1 Relife Website Inquiry System. Reply to this email to respond directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    "NEW G1 RELIFE INQUIRY",
    "",
    `Received: ${formatDate(data.createdAt)} (IST)`,
    `Reference: #${refCode(data.id)}`,
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Interest: ${data.interest}`,
    `Message: ${data.message?.trim() || "No additional message."}`,
  ].join("\n");

  return { subject: `New Website Inquiry - ${data.name}`, html, text };
}

/* ------------------------------------------------------------------ */
/* 2. Thank-you / confirmation sent to the person who enquired         */
/* ------------------------------------------------------------------ */
export function buildThankYouEmail(data: InquiryEmailData, ctx: Ctx) {
  const { business } = ctx;
  const rawFirst = data.name.trim().split(/\s+/)[0] || "there";
  const firstName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1);
  const message = data.message?.trim()
    ? escapeHtml(data.message.trim()).replace(/\n/g, "<br />")
    : null;

  const steps = [
    ["We review your inquiry", "Our team reads about your goals and what you are looking for."],
    ["We get in touch", `We will call or message you on ${escapeHtml(data.phone)}.`],
    ["Your journey begins", "Together we shape a plan that fits your lifestyle."],
  ];

  const stepRows = steps
    .map(
      ([title, desc], i) => `
      <tr>
        <td width="44" valign="top" style="padding:10px 0;">
          <div style="width:30px;height:30px;line-height:30px;border-radius:50%;background:${C.evergreen};color:${C.honeySoft};text-align:center;font-family:${SERIF};font-size:14px;">${i + 1}</div>
        </td>
        <td valign="top" style="padding:10px 0 10px 0;">
          <div style="font-family:${SANS};font-size:15px;font-weight:700;color:${C.evergreen};">${title}</div>
          <div style="margin-top:2px;font-family:${SANS};font-size:13.5px;line-height:1.6;color:${C.muted};">${desc}</div>
        </td>
      </tr>`
    )
    .join("");

  const body = `
    <div style="text-align:center;">
      <span style="display:inline-block;padding:7px 16px;border-radius:999px;background:${C.panel};border:1px solid ${C.line};font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:2.4px;color:${C.honeyDark};">INQUIRY RECEIVED</span>
    </div>

    <h1 class="h1" style="margin:22px 0 0;text-align:center;font-family:${SERIF};font-size:32px;line-height:1.25;font-weight:normal;color:${C.evergreen};">
      Thank you, ${escapeHtml(firstName)}!
    </h1>
    <p style="margin:14px auto 0;max-width:440px;text-align:center;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.ink};">
      We have received your inquiry and are delighted you reached out.
      Our wellness team will contact you shortly.
    </p>

    <!-- Summary -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:30px;">
      <tr>
        <td style="background:${C.panel};border-left:4px solid ${C.honey};border-radius:12px;padding:20px 24px;">
          <div style="font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:1.8px;color:${C.honeyDark};">YOU ASKED ABOUT</div>
          <div style="margin-top:6px;font-family:${SERIF};font-size:22px;color:${C.evergreen};">${escapeHtml(data.interest)}</div>
          ${
            message
              ? `<div style="margin-top:12px;font-family:${SERIF};font-size:15px;line-height:1.7;font-style:italic;color:${C.muted};">&ldquo;${message}&rdquo;</div>`
              : ""
          }
        </td>
      </tr>
    </table>

    <!-- What happens next -->
    <div style="margin-top:34px;font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${C.muted};">What happens next</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
      ${stepRows}
    </table>

    <!-- Actions -->
    <div style="margin-top:30px;padding-top:28px;border-top:1px solid ${C.line};text-align:center;">
      <div style="font-family:${SANS};font-size:14px;color:${C.muted};">Prefer a faster reply?</div>
      <div style="margin-top:10px;">
        ${button(`https://wa.me/${waNumber(business.phoneRaw)}`, "Chat on WhatsApp", "gold")}
        ${button(telHref(business.phoneRaw), "Call us", "primary")}
      </div>
    </div>
  `;

  const html = shell({
    ctx,
    preheader: `Thank you, ${firstName}. We have received your inquiry and will be in touch shortly.`,
    body,
    footerNote:
      "You are receiving this email because you submitted an inquiry on our website.<br />Simply reply to this email if you would like to add anything.",
  });

  const text = [
    `Thank you, ${firstName}!`,
    "",
    "We have received your inquiry and our wellness team will contact you shortly.",
    "",
    `You asked about: ${data.interest}`,
    data.message?.trim() ? `Your message: ${data.message.trim()}` : "",
    "",
    `Prefer a faster reply? Call or WhatsApp us on ${business.phoneDisplay}.`,
    "",
    "G1 RE-LIFE Wellness Zone",
    business.locationName,
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");

  return {
    subject: `Thank you for contacting G1 RE-LIFE Wellness Zone, ${firstName}`,
    html,
    text,
  };
}