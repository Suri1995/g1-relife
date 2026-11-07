"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Send,
} from "lucide-react";
import { business, services } from "@/data/wellness";
import { inquirySchema, type InquiryInput } from "@/lib/validation";
import SectionHeading from "./SectionHeading";

// The QR code library is only needed for this one decorative widget —
// split it out of the shared bundle.
const ContactQR = dynamic(() => import("./ContactQR"), {
  loading: () => (
    <div
      aria-hidden
      className="h-[124px] animate-pulse rounded-2xl border border-evergreen/10 bg-white/40"
    />
  ),
});
const Newsletter = dynamic(() => import("./Newsletter"));

const EASE = [0.22, 1, 0.36, 1] as const;

// Fine film grain: gives flat colour a tactile, printed-paper feel.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/* One orchestrated entrance for the whole section. */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/* Copy-to-clipboard button with animated icon swap                    */
/* ------------------------------------------------------------------ */
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — fail silently */
    }
  };

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileTap={{ scale: 0.88 }}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="relative mr-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-moss transition-colors hover:bg-sage/15 hover:text-evergreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-honey"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "copy"}
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
          transition={{ duration: 0.18 }}
          className="flex"
        >
          {copied ? (
            <Check size={15} className="text-sage-dark" />
          ) : (
            <Copy size={15} />
          )}
        </motion.span>
      </AnimatePresence>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Contact row: glass card, cursor spotlight, lift                     */
/* ------------------------------------------------------------------ */
function ContactRow({
  icon,
  label,
  value,
  href,
  external,
  copyValue,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  copyValue?: string;
}) {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, rgba(217,164,65,0.2), transparent 70%)`;

  return (
    <motion.div
      variants={item}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex items-center overflow-hidden rounded-2xl border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_30px_-18px_rgba(20,60,40,0.25)] backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-honey/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_50px_-22px_rgba(20,60,40,0.4)]"
    >
      <motion.span
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="relative flex flex-1 items-center gap-4 p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-honey"
      >
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage-dark transition-all duration-500 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:bg-evergreen group-hover:text-cream">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12px] text-moss">{label}</span>
          <span className="block font-display text-[15px] leading-snug text-evergreen [overflow-wrap:anywhere]">
            {value}
          </span>
        </span>
        <ArrowUpRight
          size={16}
          aria-hidden
          className="shrink-0 -translate-x-1 translate-y-1 text-honey opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </a>

      {copyValue && <CopyButton value={copyValue} label={label.toLowerCase()} />}
    </motion.div>
  );
}

const STEPS: { label: string; fields: (keyof InquiryInput)[] }[] = [
  { label: "Interest", fields: ["interest"] },
  { label: "Details", fields: ["name", "phone", "email"] },
  { label: "Message", fields: ["message"] },
];
const LAST = STEPS.length - 1;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

/** Digits-only WhatsApp number; 10-digit numbers get the India code. */
function whatsappUrl(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

/* Direction-aware slide between steps. */
const slide: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d * -40, transition: { duration: 0.22 } }),
};

/* ------------------------------------------------------------------ */
/* Measures an element so its wrapper can animate to the new height    */
/* ------------------------------------------------------------------ */
function useMeasure<T extends HTMLElement>(dep?: unknown) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dep]);
  return [ref, height] as const;
}

/* ------------------------------------------------------------------ */
/* Magnetic primary button                                             */
/* ------------------------------------------------------------------ */
function MagneticButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.12);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-full bg-evergreen px-6 py-3.5 text-[15px] font-medium text-cream shadow-[0_16px_34px_-14px_rgba(20,60,40,0.75)] transition-colors hover:bg-evergreen-light disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[420%]"
      />
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Floating-label field (input or textarea)                            */
/* ------------------------------------------------------------------ */
type FieldProps = Omit<ComponentPropsWithoutRef<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  valid?: boolean;
  multiline?: boolean;
};

const FloatingField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FieldProps
>(function FloatingField({ id, label, error, valid, multiline, ...props }, ref) {
  const base =
    "peer w-full rounded-xl border bg-white pb-2 pl-4 pr-10 pt-6 text-[14px] text-evergreen outline-none transition-[border-color,box-shadow] duration-300 placeholder-transparent";
  const state = error
    ? "border-red-400 focus:ring-4 focus:ring-red-100"
    : "border-evergreen/15 hover:border-evergreen/30 focus:border-honey focus:ring-4 focus:ring-honey/15";

  const common = {
    id,
    placeholder: " ",
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <motion.div
      animate={error ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={4}
            {...(props as unknown as ComponentPropsWithoutRef<"textarea">)}
            {...common}
            className={`${base} ${state} resize-none`}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...props}
            {...common}
            className={`${base} ${state}`}
          />
        )}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1.5 origin-left text-[11px] font-medium text-moss transition-all duration-200 peer-placeholder-shown:top-[17px] peer-placeholder-shown:text-[14px] peer-placeholder-shown:font-normal peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-evergreen"
        >
          {label}
        </label>

        <AnimatePresence>
          {valid && !error && (
            <motion.span
              aria-hidden
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ type: "spring", stiffness: 500, damping: 24 }}
              className="absolute right-3.5 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-sage/20 text-sage-dark"
            >
              <Check size={12} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden pt-1.5 text-[12px] text-red-700"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */
function Stepper({ step, onGo }: { step: number; onGo: (i: number) => void }) {
  return (
    <ol className="flex items-center" aria-label="Form progress">
      {STEPS.map((s, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={s.label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={i > step}
              onClick={() => done && onGo(i)}
              aria-current={current ? "step" : undefined}
              aria-label={`${s.label}${done ? " (completed, edit)" : ""}`}
              className="flex items-center gap-2.5 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-honey enabled:cursor-pointer disabled:cursor-default"
            >
              <span
                className={`relative flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-medium transition-colors duration-300 ${
                  done
                    ? "border-evergreen bg-evergreen text-cream"
                    : current
                    ? "border-evergreen bg-white text-evergreen"
                    : "border-evergreen/15 bg-white text-moss"
                }`}
              >
                {current && (
                  <motion.span
                    layoutId="step-ring"
                    aria-hidden
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute -inset-1 rounded-full border-2 border-honey"
                  />
                )}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={done ? "d" : "n"}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex"
                  >
                    {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span
                className={`hidden text-[12.5px] transition-colors sm:inline ${
                  current ? "font-medium text-evergreen" : "text-moss"
                }`}
              >
                {s.label}
              </span>
            </button>

            {i < LAST && (
              <span
                aria-hidden
                className="relative mx-3 h-px flex-1 overflow-hidden bg-evergreen/10"
              >
                <motion.span
                  initial={false}
                  animate={{ scaleX: step > i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 origin-left bg-gradient-to-r from-evergreen to-honey"
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepTitle({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-5">
      <h4 className="font-display text-[18px] tracking-tight text-evergreen">
        {title}
      </h4>
      <p className="mt-0.5 text-[13px] text-moss">{hint}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Success moment: drawn check + particle burst + personal thank-you   */
/* ------------------------------------------------------------------ */
const PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return { x: Math.cos(a) * 58, y: Math.sin(a) * 58, delay: (i % 3) * 0.03 };
});

type Submitted = { name: string; email: string; confirmed: boolean };

function SuccessView({
  submitted,
  onReset,
}: {
  submitted: Submitted;
  onReset: () => void;
}) {
  const rawFirst = submitted.name.trim().split(/\s+/)[0] || "there";
  const firstName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1);
  const rootRef = useRef<HTMLDivElement>(null);

  // Bring the thank-you message into view once the form is replaced.
  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <motion.div
      ref={rootRef}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex flex-col items-center gap-3 rounded-2xl bg-sage/10 p-8 text-center sm:p-10"
    >
      <div className="relative flex h-20 w-20 items-center justify-center">
        <motion.span
          aria-hidden
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="absolute inset-0 rounded-full bg-sage/25"
        />
        <motion.span
          aria-hidden
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
          className="absolute inset-0 rounded-full border border-sage-dark/40"
        />
        {PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 + p.delay }}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-honey"
          />
        ))}
        <svg
          viewBox="0 0 24 24"
          className="relative h-10 w-10 text-sage-dark"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <motion.path
            d="M5.5 12.5l4.2 4.2 8.8-9.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
          />
        </svg>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="font-display text-2xl tracking-tight text-evergreen"
      >
        Thank you, {firstName}!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-xs text-[14px] leading-relaxed text-moss"
      >
        Your inquiry has been received. Our wellness team will get in touch with
        you shortly.
      </motion.p>

      {submitted.confirmed && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex w-full max-w-xs items-start gap-2 rounded-2xl border border-evergreen/10 bg-white/70 px-4 py-2.5 text-left text-[12.5px] leading-snug text-evergreen"
        >
          <Mail size={14} aria-hidden className="mt-0.5 shrink-0 text-honey" />
          <span className="min-w-0 [overflow-wrap:anywhere]">
            Confirmation sent to {submitted.email}
          </span>
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="mt-3 flex flex-col items-center gap-3"
      >
        <a
          href={whatsappUrl(business.phoneRaw)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-evergreen px-6 py-2.5 text-[13.5px] font-medium text-cream shadow-[0_12px_26px_-12px_rgba(20,60,40,0.7)] transition-colors hover:bg-evergreen-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey"
        >
          Chat with us on WhatsApp
        </a>
        <button
          type="button"
          onClick={onReset}
          className="rounded text-[13px] font-medium text-evergreen underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-honey"
        >
          Send another inquiry
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
function InquiryForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [submitted, setSubmitted] = useState<Submitted | null>(null);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const touched = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [measureRef, height] = useMeasure<HTMLDivElement>(status);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", email: "", interest: "", message: "" },
  });

  const [name, phone, email, interest] = useWatch({
    control,
    name: ["name", "phone", "email", "interest"],
  });

  const options = [
    ...services.map((s) => ({ key: s.id, value: s.title })),
    { key: "advisor", value: "Nutrition Advisor Opportunity" },
    { key: "unsure", value: "Not sure yet" },
  ];

  const go = (i: number) => {
    touched.current = true;
    setDir(i > step ? 1 : -1);
    setStep(i);
    // On small screens, bring the top of the form back into view if the
    // previous (taller) step left the page scrolled past it.
    requestAnimationFrame(() => {
      const el = formRef.current;
      if (el && el.getBoundingClientRect().top < 72) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const next = async () => {
    const ok = await trigger(STEPS[step].fields);
    if (ok) go(step + 1);
  };

  const onSubmit = async (data: InquiryInput) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");

      const json = (await res.json().catch(() => ({}))) as {
        confirmationSent?: boolean;
      };

      // Keep the details for the thank-you screen before the form is cleared.
      setSubmitted({
        name: data.name,
        email: data.email,
        confirmed: json.confirmationSent !== false,
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  // If the final submit fails validation, jump back to the first step with a problem.
  const onInvalid = (errs: FieldErrors<InquiryInput>) => {
    const idx = STEPS.findIndex((s) => s.fields.some((f) => errs[f]));
    if (idx >= 0 && idx !== step) go(idx);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < LAST) {
      void next();
      return;
    }
    void handleSubmit(onSubmit, onInvalid)(e);
  };

  // Move keyboard focus into the new step once it has slid in.
  useEffect(() => {
    if (!touched.current) return;
    const t = setTimeout(() => {
      measureRef.current
        ?.querySelector<HTMLElement>("input:not([type=hidden]), textarea, button")
        ?.focus({ preventScroll: true });
    }, 480);
    return () => clearTimeout(t);
  }, [step, measureRef]);

  const resetAll = () => {
    setStatus("idle");
    setSubmitted(null);
    setStep(0);
    setDir(1);
    touched.current = false;
  };

  const primaryKey =
    status === "loading" ? "loading" : step === LAST ? "send" : "next";

  // Show the thank-you screen as soon as the inquiry has been submitted.
  if (status === "success" && submitted) {
    return <SuccessView submitted={submitted} onReset={resetAll} />;
  }

  return (
    <>
        <div className="mb-7">
          <h3 className="font-display text-2xl tracking-tight text-evergreen">
            Send an inquiry
          </h3>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-moss">
            Three quick steps. We&apos;ll get back to you as soon as possible.
          </p>
        </div>
        <motion.form
          ref={formRef}
          onSubmit={submit}
          noValidate
          className="scroll-mt-28"
        >
          <Stepper step={step} onGo={go} />
          <input type="hidden" {...register("interest")} />

          {/* Height animates to fit each step */}
          <motion.div
            initial={false}
            animate={{ height: height === null ? "auto" : height + 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="-mx-3 -mb-6 mt-4 overflow-hidden px-3 pb-6"
          >
            <div ref={measureRef} className="pt-4">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  {step === 0 && (
                    <>
                      <StepTitle
                        title="What are you interested in?"
                        hint="Pick the closest match — you can change it before sending."
                      />
                      <div
                        role="group"
                        aria-label="Program of interest"
                        className="grid gap-2.5 sm:grid-cols-2"
                      >
                        {options.map((o) => {
                          const active = interest === o.value;
                          return (
                            <motion.button
                              key={o.key}
                              type="button"
                              aria-pressed={active}
                              whileHover={{ y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() =>
                                setValue("interest", o.value, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }
                              className={`relative flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[13.5px] leading-snug transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey ${
                                active
                                  ? "border-transparent text-cream"
                                  : "border-evergreen/15 bg-white text-evergreen hover:border-honey/60"
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId="interest-pill"
                                  aria-hidden
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 32,
                                  }}
                                  className="absolute inset-0 rounded-xl bg-evergreen shadow-[0_10px_24px_-10px_rgba(20,60,40,0.7)]"
                                />
                              )}
                              <span className="relative">{o.value}</span>
                              <span
                                aria-hidden
                                className={`relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                                  active
                                    ? "border-honey bg-honey text-evergreen"
                                    : "border-evergreen/20"
                                }`}
                              >
                                {active && <Check size={11} strokeWidth={3.5} />}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                      <AnimatePresence initial={false}>
                        {errors.interest && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pt-2 text-[12px] text-red-700"
                          >
                            {errors.interest.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <StepTitle
                        title="How can we reach you?"
                        hint="We'll use these details to get in touch and send you a confirmation."
                      />
                      <div className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FloatingField
                            id="name"
                            label="Full name"
                            autoComplete="name"
                            error={errors.name?.message}
                            valid={!!name?.trim()}
                            {...register("name")}
                          />
                          <FloatingField
                            id="phone"
                            label="Phone number"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            error={errors.phone?.message}
                            valid={!!phone?.trim()}
                            {...register("phone")}
                          />
                        </div>
                        <FloatingField
                          id="email"
                          label="Email address"
                          type="email"
                          autoComplete="email"
                          error={errors.email?.message}
                          valid={EMAIL_PATTERN.test(email?.trim() ?? "")}
                          {...register("email")}
                        />
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <StepTitle
                        title="Anything you'd like us to know?"
                        hint="Share your goals, or skip this and send."
                      />
                      <div className="space-y-5">
                        <FloatingField
                          id="message"
                          label="Message (optional)"
                          multiline
                          {...register("message")}
                        />
                        <dl className="space-y-2.5 rounded-2xl border border-evergreen/10 bg-sage/10 p-4 text-[13px]">
                          {[
                            { k: "Interest", v: interest, to: 0 },
                            { k: "Name", v: name, to: 1 },
                            { k: "Phone", v: phone, to: 1 },
                            { k: "Email", v: email, to: 1 },
                          ].map((r) => (
                            <div
                              key={r.k}
                              className="flex items-start justify-between gap-3"
                            >
                              <dt className="shrink-0 pt-0.5 text-moss">{r.k}</dt>
                              <dd className="flex min-w-0 items-start gap-2 text-right text-evergreen">
                                <span className="min-w-0 pt-0.5 [overflow-wrap:anywhere]">
                                  {r.v}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => go(r.to)}
                                  aria-label={`Edit ${r.k.toLowerCase()}`}
                                  className="shrink-0 rounded-full p-1 text-moss transition-colors hover:bg-white hover:text-evergreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-honey"
                                >
                                  <Pencil size={12} />
                                </button>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <p role="alert" aria-live="assertive" className="sr-only">
            {status === "error" &&
              "Something went wrong. Please try again, or message us on WhatsApp."}
          </p>
          <AnimatePresence initial={false}>
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-700"
              >
                Something went wrong — please try again, or message us on
                WhatsApp.
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-7 flex items-center gap-3">
            <AnimatePresence initial={false}>
              {step > 0 && (
                <motion.button
                  type="button"
                  onClick={() => go(step - 1)}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex shrink-0 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-full py-3.5 pr-2 text-[14px] text-moss transition-colors hover:text-evergreen focus-visible:outline focus-visible:outline-2 focus-visible:outline-honey"
                >
                  <ArrowLeft size={15} />
                  Back
                </motion.button>
              )}
            </AnimatePresence>

            <MagneticButton disabled={status === "loading"}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={primaryKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="relative flex items-center gap-2"
                >
                  {primaryKey === "loading" && (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending…
                    </>
                  )}
                  {primaryKey === "send" && (
                    <>
                      Send inquiry
                      <Send
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                      />
                    </>
                  )}
                  {primaryKey === "next" && (
                    <>
                      Continue
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </motion.span>
              </AnimatePresence>
            </MagneticButton>
          </div>
        </motion.form>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blobA = useTransform(scrollYProgress, [0, 1], [-70, 90]);
  const blobB = useTransform(scrollYProgress, [0, 1], [80, -90]);

  // A soft light that trails the cursor across the whole section.
  const mx = useMotionValue(-800);
  const my = useMotionValue(-800);
  const sx = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 20, mass: 0.6 });
  const aurora = useMotionTemplate`radial-gradient(560px circle at ${sx}px ${sy}px, rgba(217,164,65,0.16), transparent 65%)`;

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        ref={ref}
        id="contact"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
        className="section-pad relative isolate overflow-hidden bg-sand"
      >
        {/* Ambient background layers */}
        <motion.div
          aria-hidden
          style={{ y: blobA }}
          className="pointer-events-none absolute -left-24 top-10 -z-10 h-[460px] w-[460px] rounded-full bg-sage/25 blur-3xl"
        />
        <motion.div
          aria-hidden
          style={{ y: blobB }}
          className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-honey/20 blur-3xl"
        />
        <motion.div
          aria-hidden
          style={{ background: aurora }}
          className="pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden
          style={{ backgroundImage: GRAIN }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        />
        {/* hairline that draws across the top edge */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-honey/60 to-transparent"
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="container-content"
        >
          {/* Heading + subheading */}
          <motion.div variants={item} className="mx-auto max-w-2xl text-center">
            <SectionHeading
              title="Start your wellness journey"
              description="Reach out with a message, or book a consultation directly — we're here to help."
            />
          </motion.div>

          {/* Two columns, side by side */}
          <div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            {/* Left column */}
            <div>
              <div className="space-y-4">
                <ContactRow
                  icon={<Phone size={18} />}
                  label="Call or WhatsApp"
                  value={business.phoneDisplay}
                  href={`tel:${business.phoneRaw}`}
                  copyValue={business.phoneDisplay}
                />
                <ContactRow
                  icon={<Mail size={18} />}
                  label="Email"
                  value={business.email}
                  href={`mailto:${business.email}`}
                  copyValue={business.email}
                />
                <ContactRow
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={business.locationName}
                  href={business.mapsUrl}
                  external
                />
              </div>

              <motion.div variants={item} className="mt-6">
                <ContactQR />
              </motion.div>

              <motion.div variants={item} className="mt-6">
                <Newsletter />
              </motion.div>
            </div>

            {/* Right column: the signature moment — a slow light travelling
                around the form's edge. */}
            <motion.div
              variants={item}
              className="relative self-start overflow-hidden rounded-[2rem] bg-evergreen/10 p-px shadow-[0_40px_80px_-40px_rgba(20,60,40,0.55)]"
            >
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 9, ease: "linear", repeat: Infinity }}
                style={{
                  x: "-50%",
                  y: "-50%",
                  left: "50%",
                  top: "50%",
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, rgba(217,164,65,0.95) 40deg, transparent 110deg)",
                }}
                className="pointer-events-none absolute aspect-square w-[250%]"
              />

              <div className="relative rounded-[calc(2rem-1px)] bg-gradient-to-b from-white to-cream/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,1)] sm:p-10">
                <InquiryForm />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </MotionConfig>
  );
}