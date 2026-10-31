"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Plus, ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { services, type Service } from "@/data/wellness";
import SectionHeading from "./SectionHeading";

// Only needed once a card is opened, so it stays out of the initial bundle.
const ServiceModal = dynamic(() => import("./ServiceModal"));
// Warms the chunk on hover/focus so the modal opens without a network wait.
const preloadModal = () => void import("./ServiceModal");

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type ServicesProps = {
  /** Service shown as the large lead card with the "Most popular" badge.
   *  Defaults to the first one. */
  featuredId?: Service["id"];
};

/* -------------------------------------------------------------------------- */
/*  Motion tokens & styles                                                    */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Each card reveals when *it* scrolls into view, cascading by column.
const reveal: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: (column: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: column * 0.08 },
  }),
};

// Border-only mask: shows just a 1px ring of whatever gradient sits behind it.
const BORDER_ONLY_MASK: CSSProperties = {
  padding: 1,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
};

const SPOT_FILL: CSSProperties = {
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(340px circle at var(--mx, -999px) var(--my, -999px), rgba(212,175,55,0.13), transparent 70%)",
};

const SPOT_EDGE: CSSProperties = {
  ...BORDER_ONLY_MASK,
  opacity: "var(--spot, 0)",
  background:
    "radial-gradient(260px circle at var(--mx, -999px) var(--my, -999px), rgba(226,190,96,0.9), transparent 70%)",
};

// Fine dot grid that fades out toward the edges of the section.
const DOT_GRID: CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(23,50,38,0.14) 1px, transparent 1.3px)",
  backgroundSize: "24px 24px",
  WebkitMaskImage:
    "radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%)",
  maskImage:
    "radial-gradient(ellipse 70% 60% at 50% 45%, #000 20%, transparent 75%)",
};

const CARD_SHADOW_REST =
  "shadow-[0_1px_2px_rgba(23,50,38,0.05),0_14px_34px_-20px_rgba(23,50,38,0.28)]";
const CARD_SHADOW_HOVER =
  "hover:shadow-[0_2px_4px_rgba(23,50,38,0.05),0_32px_60px_-24px_rgba(23,50,38,0.45)]";

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * One shared spotlight for the whole grid. The pointer listener sits on the
 * grid and writes CSS variables onto each card, so the glow can spill across
 * card edges and React never re-renders while the mouse moves.
 */
function useGridSpotlight<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const grid = ref.current;
    if (!grid || !enabled) return;
    let frame = 0;

    const paint = (x: number, y: number) => {
      grid.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${x - rect.left}px`);
        card.style.setProperty("--my", `${y - rect.top}px`);
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        grid.style.setProperty("--spot", "1");
        paint(e.clientX, e.clientY);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      grid.style.setProperty("--spot", "0");
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return ref;
}

/**
 * Position for the "View details" cursor label. It trails the mouse on a
 * spring and only reports `overCard` when the pointer is on a card, so React
 * re-renders on enter/leave rather than on every move.
 */
function useGridCursor<T extends HTMLElement>(
  ref: { current: T | null },
  enabled: boolean
) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.35 });
  const [overCard, setOverCard] = useState(false);

  useEffect(() => {
    const grid = ref.current;
    if (!grid || !enabled) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = grid.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
      setOverCard(Boolean((e.target as HTMLElement).closest("[data-spotlight]")));
    };
    const onLeave = () => setOverCard(false);

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, ref, x, y]);

  return { x: sx, y: sy, overCard };
}

/** Locks page scroll without the layout jump when the scrollbar disappears. */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [locked]);
}

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Marks the part of `text` that matches the search query. */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-honey/35 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/** A number that rolls up or down when it changes. */
function RollNumber({ value }: { value: number }) {
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SearchBar({
  value,
  onChange,
  inputRef,
}: {
  value: string;
  onChange: (next: string) => void;
  inputRef: { current: HTMLInputElement | null };
}) {
  return (
    <div
      role="search"
      className="relative w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-sm sm:focus-within:max-w-md"
    >
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-moss/70"
      />
      <input
        ref={inputRef}
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.preventDefault();
            onChange("");
          }
        }}
        placeholder="Search programs"
        aria-label="Search programs"
        aria-controls="services-grid"
        aria-keyshortcuts="/"
        className="peer h-11 w-full rounded-full border border-transparent bg-white/90 pl-11 pr-12 text-[15px] text-ink shadow-[inset_0_0_0_1px_rgba(23,50,38,0.08)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-moss/60 focus:border-honey focus:shadow-none focus:ring-4 focus:ring-honey/20"
      />

      {/* Keyboard hint: only on devices with a real pointer, hidden on focus */}
      {!value && (
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-evergreen/15 bg-sand/70 px-1.5 py-0.5 font-sans text-[11px] leading-none text-moss/70 transition-opacity duration-200 peer-focus:opacity-0 [@media(hover:hover)]:block"
        >
          /
        </kbd>
      )}

      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            aria-label="Clear search"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded-full p-0 text-moss leading-none outline-none transition-colors hover:bg-evergreen/[0.08] focus-visible:ring-2 focus-visible:ring-honey"
          >
            <X size={15} className="shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Image that resolves from a soft blur once it has loaded. */
function CardImage({ src, sizes }: { src: Service["image"]; sizes: string }) {
  const [loaded, setLoaded] = useState(false);

  // Safety net: never leave an image hidden if onLoad fired before hydration.
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`absolute inset-0 transition-[filter,opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
        loaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md"
      }`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}

/** Spotlight layers + the full-card button, shared by both card layouts. */
function CardOverlays({
  service,
  onSelect,
  radius,
}: {
  service: Service;
  onSelect: (service: Service, trigger: HTMLElement) => void;
  radius: string;
}) {
  return (
    <>
      <span
        aria-hidden
        style={SPOT_FILL}
        className={`pointer-events-none absolute inset-0 z-10 ${radius} transition-opacity duration-300`}
      />
      <span
        aria-hidden
        style={SPOT_EDGE}
        className={`pointer-events-none absolute inset-0 z-10 ${radius} transition-opacity duration-300`}
      />
      <button
        type="button"
        data-card-button
        aria-label={`View details for ${service.title}`}
        aria-haspopup="dialog"
        onClick={(e) => onSelect(service, e.currentTarget)}
        onPointerEnter={preloadModal}
        onFocus={preloadModal}
        className={`absolute inset-0 z-30 cursor-pointer ${radius} text-left outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2`}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

type ServiceCardProps = {
  service: Service;
  variant: "featured" | "regular";
  column: number;
  query: string;
  badge: boolean;
  onSelect: (service: Service, trigger: HTMLElement) => void;
};

const RADIUS = "rounded-[22px]";

// forwardRef is required: AnimatePresence "popLayout" measures its direct child.
const ServiceCard = forwardRef<HTMLLIElement, ServiceCardProps>(
  function ServiceCard({ service, variant, column, query, badge, onSelect }, ref) {
    const featured = variant === "featured";

    return (
      // Outer <li> owns filter/reflow animation, the inner div owns the
      // scroll reveal, and the <article> owns hover. Three separate layers,
      // so their transforms never fight each other.
      <motion.li
        ref={ref}
        layout="position"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
        transition={{
          layout: { type: "spring", stiffness: 380, damping: 36 },
          duration: 0.3,
        }}
        className={`list-none ${
          featured ? "sm:col-span-2 lg:row-span-2" : ""
        }`}
      >
        <motion.div
          variants={reveal}
          custom={column}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="h-full"
        >
          {featured ? (
            /* ----------------------- Lead card: image-first ---------------------- */
            <article
              data-spotlight
              className={`group relative flex h-full min-h-[400px] flex-col justify-end overflow-hidden ${RADIUS} bg-evergreen-dark ring-1 ring-evergreen/10 ring-offset-sand ${CARD_SHADOW_REST} ${CARD_SHADOW_HOVER} transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 active:scale-[0.99] active:duration-150 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-honey [&:has(:focus-visible)]:ring-offset-2`}
            >
              <CardImage
                src={service.image}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/95 via-evergreen-dark/40 to-evergreen-dark/5" />

              <span className="absolute left-5 top-5 z-20 inline-flex items-center gap-1.5 rounded-full bg-honey px-3.5 py-1.5 text-xs font-semibold text-evergreen-dark shadow-lg">
                <Sparkles size={12} aria-hidden />
                Most popular
              </span>

              <div className="relative z-20 p-6 sm:p-8 lg:p-10">
                <h3 className="max-w-lg font-display text-[28px] font-medium leading-[1.1] text-cream sm:text-4xl lg:text-[2.6rem]">
                  {service.title}
                </h3>
                <p className="mt-3 line-clamp-3 max-w-md text-[15px] leading-relaxed text-cream/75">
                  {service.description}
                </p>
                <span
                  aria-hidden
                  className="mt-6 inline-flex items-center gap-3 rounded-full bg-honey py-1.5 pl-5 pr-1.5 text-sm font-medium text-evergreen-dark transition-colors duration-300 group-hover:bg-honey-light"
                >
                  Learn more
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-evergreen-dark text-cream">
                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
                    />
                  </span>
                </span>
              </div>

              <CardOverlays service={service} onSelect={onSelect} radius={RADIUS} />
            </article>
          ) : (
            /* ------------------------- Regular card ------------------------- */
            <article
              data-spotlight
              className={`group relative flex h-full flex-col overflow-hidden ${RADIUS} bg-gradient-to-b from-white to-white/70 p-2.5 ring-1 ring-evergreen/10 ring-offset-sand ${CARD_SHADOW_REST} ${CARD_SHADOW_HOVER} transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 active:scale-[0.985] active:duration-150 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-honey [&:has(:focus-visible)]:ring-offset-2`}
            >
              {/* Inset image with its own rounded frame */}
              <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden rounded-[14px] bg-sand">
                <CardImage
                  src={service.image}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-evergreen-dark/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {badge && (
                  <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-honey px-3 py-1.5 text-xs font-semibold text-evergreen-dark shadow-lg">
                    <Sparkles size={12} aria-hidden />
                    Most popular
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col px-3 pb-2.5 pt-5 sm:px-3.5">
                <h3 className="font-display text-[19px] font-medium leading-snug text-evergreen sm:text-xl">
                  <Highlight text={service.title} query={query} />
                </h3>
                <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-moss/90">
                  <Highlight text={service.description} query={query} />
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-evergreen/10 pt-4">
                  <span className="relative text-[13.5px] font-medium text-evergreen">
                    Learn more
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-honey transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                  </span>
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-sand text-evergreen transition-all duration-300 group-hover:rotate-90 group-hover:bg-honey group-hover:text-evergreen-dark motion-reduce:transition-colors motion-reduce:group-hover:rotate-0"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </div>
              </div>

              <CardOverlays service={service} onSelect={onSelect} radius={RADIUS} />
            </article>
          )}
        </motion.div>
      </motion.li>
    );
  }
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Services({
  featuredId = services[0]?.id,
}: ServicesProps) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [active, setActive] = useState<Service | null>(null);
  const [query, setQuery] = useState("");

  const gridRef = useGridSpotlight<HTMLUListElement>(!reduce);
  const cursor = useGridCursor(gridRef, !reduce);
  useScrollLock(active !== null);

  // Background glows drift with scroll instead of pulsing forever.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowAY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-70, 70]);
  const glowBY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -90]);

  const normalized = query.trim().toLowerCase();

  // Browsing: the lead card comes first. Searching: a plain, uniform grid.
  const results = useMemo(() => {
    if (normalized) {
      return services.filter((s) =>
        `${s.title} ${s.description}`.toLowerCase().includes(normalized)
      );
    }
    const lead = services.find((s) => s.id === featuredId);
    return lead ? [lead, ...services.filter((s) => s.id !== lead.id)] : services;
  }, [normalized, featuredId]);

  const handleSelect = useCallback((service: Service, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(service);
  }, []);

  // Press "/" anywhere on the page to jump to the search field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({
        block: "center",
        behavior: reduce ? "auto" : "smooth",
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  // Arrow keys move to the nearest card in that direction, so it still
  // works when the lead card spans two rows.
  const handleGridKeys = (e: ReactKeyboardEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    if (!target.matches("[data-card-button]")) return;
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;

    const buttons = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("[data-card-button]")
    );
    const index = buttons.indexOf(target);
    if (index < 0) return;

    let next = -1;
    if (e.key === "ArrowRight") next = index + 1;
    else if (e.key === "ArrowLeft") next = index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = buttons.length - 1;
    else {
      const rectOf = (el: HTMLElement) =>
        (el.closest("li") as HTMLElement).getBoundingClientRect();
      const cur = rectOf(target);
      const cx = cur.left + cur.width / 2;
      const down = e.key === "ArrowDown";
      let best = Infinity;
      buttons.forEach((b, i) => {
        if (b === target) return;
        const r = rectOf(b);
        if (down ? r.top < cur.bottom - 8 : r.bottom > cur.top + 8) return;
        const dy = down ? r.top - cur.bottom : cur.top - r.bottom;
        const dx = Math.abs(r.left + r.width / 2 - cx);
        const score = Math.max(dy, 0) + dx * 2;
        if (score < best) {
          best = score;
          next = i;
        }
      });
    }

    if (next < 0 || next >= buttons.length || next === index) return;
    e.preventDefault();
    buttons[next].focus();
  };

  const countText = normalized
    ? `${results.length} of ${services.length} programs`
    : `${services.length} programs`;

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="services"
        className="section-pad relative isolate overflow-hidden bg-sand"
      >
        {/* Atmosphere: dot grid, drifting glows, and a soft blend from the section above */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-0" style={DOT_GRID} />
          <motion.div
            style={{ y: glowAY }}
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-honey/15 blur-3xl"
          />
          <motion.div
            style={{ y: glowBY }}
            className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-evergreen/[0.08] blur-3xl"
          />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cream to-transparent" />
        </div>

        <div className="container-content relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <SectionHeading
              title="Wellness programs for every goal"
              description={`${services.length} focus areas, each built into a plan shaped around your body and your life.`}
            />
          </motion.div>

          {/* Toolbar: one frosted bar holding search and the count */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-10 flex flex-col gap-2 rounded-[28px] border border-evergreen/10 bg-white/55 p-2 shadow-[0_10px_34px_-20px_rgba(23,50,38,0.3),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:rounded-full"
          >
            <SearchBar value={query} onChange={setQuery} inputRef={inputRef} />

            <p
              role="status"
              aria-live="polite"
              className="self-start rounded-full bg-evergreen/[0.07] px-4 py-2 text-sm font-medium text-evergreen sm:mr-1 sm:self-auto"
            >
              <span className="sr-only">{countText}</span>
              <span aria-hidden>
                {normalized ? (
                  <>
                    <RollNumber value={results.length} /> of {services.length} programs
                  </>
                ) : (
                  <>{services.length} programs</>
                )}
              </span>
            </p>
          </motion.div>

          <div className="relative mt-8">
            <ul
              ref={gridRef}
              id="services-grid"
              onKeyDown={handleGridKeys}
              className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {results.map((service, i) => {
                  const isLead = !normalized && service.id === featuredId;
                  return (
                    <ServiceCard
                      // Key includes the layout so switching between lead and
                      // regular remounts with a clean exit/enter.
                      key={`${service.id}-${isLead ? "lead" : "card"}`}
                      service={service}
                      variant={isLead ? "featured" : "regular"}
                      column={i % 3}
                      query={normalized}
                      badge={service.id === featuredId && !isLead}
                      onSelect={handleSelect}
                    />
                  );
                })}
              </AnimatePresence>
            </ul>

            {/* Cursor label: follows the mouse over a card (mouse only) */}
            {!reduce && (
              <motion.div
                aria-hidden
                style={{ x: cursor.x, y: cursor.y }}
                className="pointer-events-none absolute left-0 top-0 z-40"
              >
                <motion.span
                  initial={false}
                  animate={{
                    opacity: cursor.overCard && !active ? 1 : 0,
                    scale: cursor.overCard && !active ? 1 : 0.6,
                  }}
                  transition={{ duration: 0.25, ease: EASE }}
                  style={{ originX: 0, originY: 0 }}
                  className="ml-5 mt-5 inline-flex items-center gap-1.5 rounded-full bg-evergreen px-3.5 py-2 text-[12.5px] font-medium text-cream shadow-[0_10px_24px_-10px_rgba(23,50,38,0.6)]"
                >
                  View details
                  <ArrowUpRight size={13} />
                </motion.span>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {results.length === 0 && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-8 rounded-[22px] border border-dashed border-evergreen/20 bg-white/50 px-6 py-14 text-center backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                  className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-evergreen/[0.07] text-evergreen"
                >
                  <Search size={20} aria-hidden />
                </motion.div>
                <p className="font-display text-xl text-evergreen">
                  No programs match &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-moss">
                  Try a shorter word, or start from one of these.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {services.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQuery(s.title)}
                      className="max-w-[16rem] truncate rounded-full border border-evergreen/15 bg-white/70 px-4 py-2 text-sm text-evergreen outline-none transition-colors duration-300 hover:border-honey hover:bg-honey/15 focus-visible:ring-2 focus-visible:ring-honey"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-6 rounded-full bg-evergreen px-5 py-2.5 text-sm font-medium text-cream outline-none transition-colors duration-300 hover:bg-evergreen-dark focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
                >
                  Show all {services.length} programs
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal: focus returns to the card that opened it once it has closed */}
        <AnimatePresence
          mode="wait"
          onExitComplete={() => triggerRef.current?.focus({ preventScroll: true })}
        >
          {active && (
            <ServiceModal
              key={active.id}
              service={active}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}