import type { Metadata } from "next";
import LegalLayout, { Bullets, ContactBlock, Note } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | G1 RE-LIFE Wellness Zone",
  description: "How G1 RE-LIFE Wellness Zone collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      kicker="Your privacy matters"
      title="Privacy Policy"
      lead="How G1 RE-LIFE Wellness Zone collects, uses and protects your personal information."
      updated="13 November 2026"
      glance={[
        { icon: "🔒", title: "Never sold", text: "We do not sell your personal data." },
        { icon: "🩺", title: "Care with health data", text: "Used only to guide your program." },
        { icon: "✋", title: "You are in control", text: "Access, correct or erase your data." },
      ]}
      sections={[
        { title: "Overview", content: <p>G1 RE-LIFE Wellness Zone (“G1 RE-LIFE”, “we”, “us”) provides personalized wellness coaching led by Veena Jeevan. This Privacy Policy explains what personal data we collect through <b>g1-relife.com</b>, WhatsApp, calls and in-person consultations, why we collect it, and the choices you have. We handle your data in line with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000 of India.</p> },
        { title: "Information We Collect", content: <>
          <p>We collect only what we need to respond to you and personalize your wellness plan:</p>
          <Bullets items={[
            <><b>Contact details:</b> name, phone number, email address.</>,
            <><b>Inquiry details:</b> the programs you are interested in and the message you send through our forms, WhatsApp or email.</>,
            <><b>Wellness information you choose to share:</b> age, gender, height, weight, activity level, health goals, diet and lifestyle habits.</>,
            <><b>Newsletter data:</b> your email address if you subscribe.</>,
            <><b>Technical data:</b> device, browser, pages viewed and approximate location, collected through standard logs and cookies.</>,
          ]} />
          <Note>The BMI and calorie calculator on our site runs in your browser. Values you enter there are not sent to us unless you share them with your coach.</Note></> },
        { title: "How We Use Your Information", content: <>
          <Bullets items={[
            "To reply to inquiries and schedule consultations.",
            "To design, deliver and follow up on your personalized wellness program.",
            "To send newsletters and wellness updates you have opted into.",
            "To improve our website, services and user experience.",
            "To meet legal obligations and protect against misuse or fraud.",
          ]} />
          <p>We process your data on the basis of your consent and, where applicable, for legitimate uses permitted by law. We never sell your personal data.</p></> },
        { title: "Health & Sensitive Data", content: <p>Wellness details such as weight, medical conditions or dietary needs are treated with extra care. We use them only to guide your program, limit access to your coach and authorised team members, and never share them for advertising. You can choose not to share any health detail; some personalization may then be limited.</p> },
        { title: "Sharing & Third Parties", content: <>
          <p>We share data only when necessary and with trusted providers acting on our instructions:</p>
          <Bullets items={[
            <><b>Communication platforms</b> such as WhatsApp, email and telephony providers.</>,
            <><b>Website hosting and analytics</b> providers that keep the site secure and fast.</>,
            <><b>Authorities</b> when required by law or valid legal process.</>,
          ]} />
          <p>Links to Facebook, Instagram, YouTube, WhatsApp or Google Maps lead to third-party services governed by their own privacy policies.</p></> },
        { title: "Cookies & Analytics", content: <p>We use essential cookies to keep the site working and, where enabled, privacy-conscious analytics to understand how pages are used. You can block or delete cookies in your browser settings; the site will still function, though some features may be reduced.</p> },
        { title: "Data Retention & Security", content: <p>We keep personal data only as long as needed for the purposes above or as the law requires, then delete or anonymise it. We use reasonable technical and organisational safeguards — encrypted connections (HTTPS), access controls and minimal data collection. No online system is perfectly secure, so please avoid sending sensitive documents over open channels.</p> },
        { title: "Your Rights", content: <>
          <p>Under applicable law you may:</p>
          <Bullets items={[
            "Access a summary of the personal data we hold about you.",
            "Request correction or updating of inaccurate data.",
            "Request erasure of your data, subject to legal requirements.",
            "Withdraw consent or unsubscribe from newsletters at any time.",
            "Raise a grievance with us, and with the Data Protection Board of India where applicable.",
          ]} /></> },
        { title: "Children’s Privacy", content: <p>Our programs for children are arranged through a parent or guardian. We do not knowingly collect data from anyone under 18 without verifiable guardian consent. If you believe a child has shared data without consent, contact us and we will remove it.</p> },
        { title: "Changes to This Policy", content: <p>We may update this policy from time to time. The “Last updated” date above shows the latest version, and material changes will be highlighted on our website. Continued use of our services after an update means you accept the revised policy.</p> },
        { title: "Contact Us", highlight: true, content: <ContactBlock /> },
      ]}
    />
  );
}