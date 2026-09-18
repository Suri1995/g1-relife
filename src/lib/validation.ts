import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15, "Enter a valid phone number")
    .regex(/^[0-9+\s-]+$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  interest: z.string().min(1, "Please select a service"),
  message: z.string().max(600).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
