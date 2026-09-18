"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { inquirySchema, type InquiryInput } from "@/lib/validation";
import { services } from "@/data/wellness";

export default function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", email: "", interest: "", message: "" },
  });

  const onSubmit = async (data: InquiryInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-3 rounded-2xl bg-sage/10 p-10 text-center"
      >
        <CheckCircle2 className="text-sage-dark" size={36} aria-hidden />
        <h3 className="font-display text-xl text-evergreen">Message sent</h3>
        <p className="max-w-xs text-[14px] text-moss">
          Thank you — {`we'll`} get back to you shortly. For a faster reply,
          message us on WhatsApp.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-[13px] font-medium text-evergreen underline underline-offset-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-[13px] font-medium text-moss">
            Full name
          </label>
          <input
            id="name"
            {...register("name")}
            className="mt-1.5 w-full rounded-xl border border-evergreen/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-honey"
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-[12px] text-red-700">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="text-[13px] font-medium text-moss">
            Phone number
          </label>
          <input
            id="phone"
            {...register("phone")}
            className="mt-1.5 w-full rounded-xl border border-evergreen/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-honey"
            placeholder="98765 43210"
          />
          {errors.phone && (
            <p className="mt-1 text-[12px] text-red-700">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="text-[13px] font-medium text-moss">
          Email (optional)
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-xl border border-evergreen/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-honey"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-[12px] text-red-700">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="interest" className="text-[13px] font-medium text-moss">
          I&apos;m interested in
        </label>
        <select
          id="interest"
          {...register("interest")}
          className="mt-1.5 w-full rounded-xl border border-evergreen/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-honey"
          defaultValue=""
        >
          <option value="" disabled>
            Select a program
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Nutrition Advisor Opportunity">
            Nutrition Advisor Opportunity
          </option>
          <option value="Not sure yet">Not sure yet</option>
        </select>
        {errors.interest && (
          <p className="mt-1 text-[12px] text-red-700">{errors.interest.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-[13px] font-medium text-moss">
          Message (optional)
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="mt-1.5 w-full resize-none rounded-xl border border-evergreen/15 bg-white px-4 py-3 text-[14px] outline-none focus:border-honey"
          placeholder="Tell us a bit about your goals…"
        />
      </div>

      <p role="alert" aria-live="assertive" className="sr-only">
        {status === "error" &&
          "Something went wrong. Please try again, or message us on WhatsApp."}
      </p>
      {status === "error" && (
        <p className="text-[13px] text-red-700">
          Something went wrong — please try again, or message us on WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-evergreen px-6 py-3.5 text-[15px] font-medium text-cream transition hover:bg-evergreen-light disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
