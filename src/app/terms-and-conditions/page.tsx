import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { Bullets, ContactBlock, Note } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | G1 RE-LIFE Wellness Zone",
  description: "The terms that apply when you visit our website or use G1 RE-LIFE Wellness Zone services.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function Terms() {
  return (
    <LegalLayout
      kicker="Clear and fair terms"
      title="Terms & Conditions"
      lead="The terms that apply when you visit our website or use G1 RE-LIFE Wellness Zone services."
      updated="13 November 2026"
      glance={[
        { icon: "🌿", title: "Wellness guidance", text: "Coaching, not medical treatment." },
        { icon: "🤝", title: "Mutual respect", text: "Honest information, responsible use." },
        { icon: "⚖️", title: "Governed by Indian law", text: "Hyderabad jurisdiction." },
      ]}
      sections={[
        { title: "Acceptance of Terms", content: <p>By accessing g1-relife.com or using any G1 RE-LIFE Wellness Zone service, you agree to these Terms &amp; Conditions and our <Link href="/privacy-policy">Privacy Policy</Link>. If you do not agree, please do not use our website or services.</p> },
        { title: "Our Services", content: <p>G1 RE-LIFE offers personalized wellness coaching across areas including weight and fat loss, muscle gain, weight management, digestive, heart, bone and joint support, sports, children’s, senior, men’s and women’s nutrition, stress, skin, immune health and sleep management. Program details, duration and fees are shared during your consultation and may change over time.</p> },
        { title: "Not Medical Advice", content: <>
          <Note>Our content, calculators and coaching are for general wellness and nutrition guidance. They are <b>not</b> a medical diagnosis, treatment or a substitute for professional healthcare.</Note>
          <p>Always consult a qualified doctor before starting any nutrition, exercise or supplement plan — especially if you are pregnant, nursing, elderly, have a medical condition or take medication. Never ignore or delay professional medical advice because of something you read or were told here. In an emergency, contact local emergency services immediately.</p></> },
        { title: "Your Responsibilities", content: <Bullets items={[
          "Provide accurate and complete information about your health, goals and lifestyle.",
          "Inform your coach of any medical condition, allergy or medication.",
          "Follow your program responsibly and stop if you feel unwell.",
          "Be 18 or older, or have a parent or guardian’s consent.",
        ]} /> },
        { title: "Bookings, Fees & Payments", content: <p>Consultations and programs are scheduled through WhatsApp, phone or our inquiry form. Fees, payment schedules and any refund or rescheduling terms are confirmed with you before you begin. Please give reasonable notice if you need to reschedule so we can keep slots available for others.</p> },
        { title: "Results Disclaimer", content: <p>Outcomes vary from person to person based on genetics, health, consistency and lifestyle. Success stories and transformations shown on our website reflect individual experiences and are not guarantees of similar results.</p> },
        { title: "Nutrition Advisor Opportunity", content: <p>Information about our wellness partner opportunity is provided for general awareness. Any income depends on your own effort, time and market conditions, and is not guaranteed. Specific terms are discussed and agreed with you directly before you join, and you are encouraged to ask questions first.</p> },
        { title: "Website Use & Intellectual Property", content: <p>All text, images, logos, videos and designs on this site belong to G1 RE-LIFE Wellness Zone or its licensors. You may view and share pages for personal use, but may not copy, resell, scrape or modify content without written permission. You agree not to misuse the site, attempt unauthorised access or submit unlawful content.</p> },
        { title: "Third-Party Links", content: <p>Our site links to services such as WhatsApp, Google Maps, Facebook, Instagram and YouTube. We do not control these and are not responsible for their content, availability or privacy practices.</p> },
        { title: "Limitation of Liability", content: <p>To the fullest extent permitted by law, G1 RE-LIFE Wellness Zone and its team are not liable for indirect or consequential loss, or for outcomes arising from your decision to follow general wellness guidance without appropriate medical supervision. Nothing here limits liability that cannot be excluded under applicable law.</p> },
        { title: "Governing Law", content: <p>These terms are governed by the laws of India. Courts at Hyderabad, Telangana have exclusive jurisdiction over any dispute, after good-faith attempts to resolve it directly with us.</p> },
        { title: "Changes to These Terms", content: <p>We may revise these terms occasionally. Updated versions are posted here with a new “Last updated” date, and continued use of our services means you accept the changes.</p> },
        { title: "Contact Us", highlight: true, content: <ContactBlock /> },
      ]}
    />
  );
}