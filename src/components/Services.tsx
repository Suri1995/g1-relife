"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Plus, ArrowUpRight, Search, Sparkles, X } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
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
  /** Service that gets the "Most popular" badge. Defaults to the first one. */
  featuredId?: Service["id"];
};

/* -------------------------------------------------------------------------- */
/*  Motion tokens                                                             */
/* -------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// Each card reveals when *it* scrolls into view. `custom` is its column, so a
// row cascades left to right instead of all 16 firing at once off-screen.
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
  // A capture group makes split() keep the matches, at every odd index.
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-honey/30 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div role="search" className="relative w-full sm:max-w-sm">
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
        className="h-12 w-full rounded-full border border-evergreen/10 bg-white/70 pl-11 pr-11 text-[15px] text-ink outline-none backdrop-blur-sm transition-[border-color,box-shadow] duration-300 placeholder:text-moss/60 focus:border-honey focus:ring-4 focus:ring-honey/20"
      />
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
            className="absolute inset-y-0 right-2.5 my-auto grid h-8 w-8 place-items-center rounded-full p-0 text-moss leading-none outline-none transition-colors hover:bg-evergreen/[0.08] focus-visible:ring-2 focus-visible:ring-honey"
          >
            <X size={15} className="shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

type ServiceCardProps = {
  service: Service;
  column: number;
  query: string;
  featured: boolean;
  onSelect: (service: Service, trigger: HTMLElement) => void;
};

// forwardRef is required: AnimatePresence "popLayout" measures its direct child.
const ServiceCard = forwardRef<HTMLLIElement, ServiceCardProps>(
  function ServiceCard({ service, column, query, featured, onSelect }, ref) {
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
        className="list-none"
      >
        <motion.div
          variants={reveal}
          custom={column}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="h-full"
        >
          <article
            data-spotlight
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-evergreen/10 ring-offset-sand transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-18px_rgba(23,50,38,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-honey [&:has(:focus-visible)]:ring-offset-2"
          >
            {/* Shared-spotlight layers (see useGridSpotlight) */}
            <span
              aria-hidden
              style={SPOT_FILL}
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
            />
            <span
              aria-hidden
              style={SPOT_EDGE}
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
            />

            <div className="relative h-44 w-full shrink-0 overflow-hidden bg-sand sm:h-48">
              <Image
                src={service.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen/55 via-evergreen/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {featured && (
                <span className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-honey/95 px-3 py-1.5 text-xs font-semibold text-evergreen-dark shadow-lg backdrop-blur-sm">
                  <Sparkles size={12} aria-hidden />
                  Most popular
                </span>
              )}

              <span
                aria-hidden
                className="absolute right-3 top-3 z-20 flex h-9 w-9 -rotate-45 scale-75 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100"
              >
                <ArrowUpRight size={16} className="text-white" />
              </span>
            </div>

            <div className="relative flex flex-1 items-start justify-between gap-3 p-5 sm:p-6">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[17px] font-medium leading-snug text-evergreen sm:text-lg">
                  <Highlight text={service.title} query={query} />
                </h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-moss/90">
                  <Highlight text={service.description} query={query} />
                </p>
              </div>

              <span
                aria-hidden
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand text-evergreen transition-all duration-300 group-hover:rotate-90 group-hover:bg-honey group-hover:text-evergreen-dark motion-reduce:transition-colors motion-reduce:group-hover:rotate-0"
              >
                <Plus size={16} strokeWidth={2.5} />
              </span>
            </div>

            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 z-10 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-honey via-honey/60 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <button
              type="button"
              aria-label={`View details for ${service.title}`}
              aria-haspopup="dialog"
              onClick={(e) => onSelect(service, e.currentTarget)}
              onPointerEnter={preloadModal}
              onFocus={preloadModal}
              className="absolute inset-0 z-30 cursor-pointer rounded-2xl text-left outline-none focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2"
            />
          </article>
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

  const [active, setActive] = useState<Service | null>(null);
  const [query, setQuery] = useState("");

  const gridRef = useGridSpotlight<HTMLUListElement>(!reduce);
  useScrollLock(active !== null);

  // Background glows drift with scroll instead of pulsing forever.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const glowAY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-70, 70]);
  const glowBY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [90, -90]);

  const normalized = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      normalized
        ? services.filter((s) =>
            `${s.title} ${s.description}`.toLowerCase().includes(normalized)
          )
        : services,
    [normalized]
  );

  const handleSelect = useCallback((service: Service, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setActive(service);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        id="services"
        className="section-pad relative overflow-hidden bg-sand"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <motion.div
            style={{ y: glowAY }}
            className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-honey/10 blur-3xl"
          />
          <motion.div
            style={{ y: glowBY }}
            className="absolute -bottom-48 -right-48 h-[500px] w-[500px] rounded-full bg-evergreen/[0.06] blur-3xl"
          />
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

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <SearchBar value={query} onChange={setQuery} />
            <p role="status" aria-live="polite" className="text-sm text-moss">
              {normalized
                ? `${results.length} of ${services.length} programs`
                : `${services.length} programs`}
            </p>
          </motion.div>

          <ul
            ref={gridRef}
            id="services-grid"
            className="relative mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {/* No `initial={false}` here: it would also switch off the
                per-card scroll reveal inside. */}
            <AnimatePresence mode="popLayout">
              {results.map((service, i) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  column={i % 3}
                  query={normalized}
                  featured={service.id === featuredId}
                  onSelect={handleSelect}
                />
              ))}
            </AnimatePresence>
          </ul>

          <AnimatePresence>
            {results.length === 0 && (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-8 rounded-2xl border border-dashed border-evergreen/20 bg-white/50 px-6 py-14 text-center backdrop-blur-sm"
              >
                <p className="font-display text-xl text-evergreen">
                  No programs match &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-moss">
                  Try a shorter word, or clear the search to see all{" "}
                  {services.length} programs.
                </p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-5 rounded-full bg-evergreen px-5 py-2.5 text-sm font-medium text-cream outline-none transition-colors duration-300 hover:bg-evergreen-dark focus-visible:ring-2 focus-visible:ring-honey focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
                >
                  Clear search
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