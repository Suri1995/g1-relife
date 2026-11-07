import { z } from "zod";

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number")
    .regex(/^[+()\-\s\d]{7,18}$/, "Please enter a valid phone number"),

  // Email is now REQUIRED so every lead can be followed up and thanked.
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),

  interest: z
    .string()
    .trim()
    .min(1, "Please choose what you're interested in")
    .max(120),

  message: z.string().trim().max(1000, "Message is too long").optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/* ------------------------------------------------------------------ */
/* Newsletter signup (used by components/Newsletter.tsx)               */
/* ------------------------------------------------------------------ */
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address")
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;