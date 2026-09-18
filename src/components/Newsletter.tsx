"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl bg-evergreen-dark p-6 sm:p-7">
      <h3 className="font-display text-lg text-cream">
        Subscribe to our newsletter
      </h3>
      <p className="mt-1.5 text-[13.5px] text-cream/60">
        Sign up to get exclusive wellness updates directly from Veena.
      </p>

      {status === "success" ? (
        <p role="status" aria-live="polite" className="mt-4 text-[14px] text-sage-light">
          You&apos;re subscribed — thank you!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-4 flex flex-col gap-2 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full rounded-full border border-cream/20 bg-cream/5 px-4 py-2.5 text-[14px] text-cream placeholder:text-cream/40 outline-none focus:border-honey"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="flex items-center justify-center gap-2 rounded-full bg-honey px-5 py-2.5 text-[14px] font-medium text-evergreen-dark transition hover:bg-honey-light disabled:opacity-60"
          >
            <Send size={14} />
            Subscribe
          </button>
        </form>
      )}
      {errors.email && (
        <p className="mt-2 text-[12px] text-honey-light">{errors.email.message}</p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-2 text-[12px] text-honey-light">
          Couldn&apos;t subscribe — please try again.
        </p>
      )}
    </div>
  );
}
