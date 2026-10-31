"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Data & motion tokens                                                      */
/* -------------------------------------------------------------------------- */

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#journey", label: "Journey" },
  { href: "#bmi", label: "BMI Check" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

const hrefs = links.map((l) => l.href);
const CTA_LABEL = "Schedule My Wellness Session";

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 380, damping: 32 } as const;

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

const mobileListVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.18 },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

/** Tracks which section sits in the middle band of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = ids
      .map((id) => document.querySelector(id))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));

    const onScroll = () => {
      if (window.scrollY < 80) setActive("");
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

/* -------------------------------------------------------------------------- */
/*  Pieces                                                                    */
/* -------------------------------------------------------------------------- */

/** Primary action: leans toward the cursor, rolls its label, sweeps a highlight. */
function MagneticCTA({ onClick }: { onClick?: () => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, {
    stiffness: 220,
    damping: 18,
    mass: 0.4,
  });

  const sy = useSpring(y, {
    stiffness: 220,
    damping: 18,
    mass: 0.4,
  });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();

    x.set((e.clientX - (r.left + r.width / 2)) * 0.2);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="#contact"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      whileTap={{ scale: 0.96 }}
      className="group relative hidden overflow-hidden whitespace-nowrap rounded-full bg-honey px-5 py-2.5 text-[14px] font-medium text-evergreen-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-[background-color,box-shadow] duration-300 hover:bg-honey-light hover:shadow-[0_10px_24px_-10px_rgba(23,50,38,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-evergreen lg:block"
    >
      <span className="relative block h-[1.3em] overflow-hidden leading-[1.3]">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none">
          {CTA_LABEL}
        </span>

        <span
          aria-hidden="true"
          className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none"
        >
          {CTA_LABEL}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%] motion-reduce:hidden"
      />
    </motion.a>
  );
}

/** Desktop links with a hover pill that glides between items. */
function DesktopLinks({
  active,
  scrolled,
}: {
  active: string;
  scrolled: boolean;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="show"
      onMouseLeave={() => setHovered(null)}
      className="hidden items-center gap-0.5 lg:flex"
    >
      {links.map((link) => {
        const isActive = active === link.href;
        const isHovered = hovered === link.href;

        return (
          <motion.li
            key={link.href}
            variants={itemVariants}
            className="relative"
          >
            <a
              href={link.href}
              aria-current={isActive ? "true" : undefined}
              onMouseEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
              onBlur={() => setHovered(null)}
              className={cn(
                "relative z-10 block rounded-full px-3.5 py-2 text-[16px] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-evergreen/60",
                scrolled ? "text-evergreen" : "!text-white",
              )}
            >
              {link.label}
            </a>

            {isHovered && (
              <motion.span
                layoutId="nav-hover"
                transition={spring}
                className="absolute inset-0 rounded-full bg-evergreen/[0.07]"
              />
            )}

            {isActive && (
              <motion.span
                layoutId="nav-active"
                transition={spring}
                className="absolute -bottom-0.5 left-1/2 -ml-0.5 h-1 w-1 rounded-full bg-honey"
              />
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

/** Three bars that morph into a cross. */
function MenuToggle({
  open,
  onClick,
  innerRef,
}: {
  open: boolean;
  onClick: () => void;
  innerRef: React.Ref<HTMLButtonElement>;
}) {
  const bar =
    "absolute left-1/2 top-1/2 -ml-2.5 -mt-px block h-[1.5px] w-5 rounded-full bg-current";

  return (
    <motion.button
      ref={innerRef}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="mobile-menu"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="relative h-10 w-10 rounded-full text-evergreen outline-none transition-colors hover:bg-evergreen/5 focus-visible:ring-2 focus-visible:ring-evergreen/60 lg:hidden"
    >
      <motion.span
        className={bar}
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
        transition={{ duration: 0.4, ease }}
      />

      <motion.span
        className={bar}
        initial={false}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.25, ease }}
      />

      <motion.span
        className={bar}
        initial={false}
        animate={open ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
        transition={{ duration: 0.4, ease }}
      />
    </motion.button>
  );
}

/** Mobile panel: unrolls from the bar, links rise in one after another. */
function MobileMenu({ active, close }: { active: string; close: () => void }) {
  return (
    <>
      <motion.div
        key="backdrop"
        aria-hidden="true"
        onClick={close}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto fixed inset-0 -z-10 bg-evergreen-dark/30 backdrop-blur-sm lg:hidden"
      />

      {/* Outer layer carries the shadow so the clip-path below can't cut it off */}
      <motion.div
        key="panel"
        id="mobile-menu"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.25, delay: 0.1 },
        }}
        transition={{ duration: 0.4, ease }}
        className="pointer-events-auto absolute inset-x-0 top-full mt-2 rounded-[28px] shadow-[0_28px_60px_-24px_rgba(23,50,38,0.45)] lg:hidden"
      >
        <motion.div
          initial={{ clipPath: "inset(0% 0% 100% 0% round 28px)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0% round 28px)",
            transition: { duration: 0.35, ease },
          }}
          transition={{ duration: 0.6, ease }}
          className="rounded-[28px] border border-evergreen/10 bg-cream p-3"
        >
          <motion.ul
            variants={mobileListVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col"
          >
            {links.map((link) => {
              const isActive = active === link.href;

              return (
                <motion.li key={link.href} variants={mobileItemVariants}>
                  <motion.a
                    href={link.href}
                    onClick={close}
                    whileTap={{ scale: 0.98 }}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-[18px] font-medium transition-colors",
                      isActive
                        ? "bg-evergreen/[0.06] text-[var(--surface)]"
                        : "text-ink/80 hover:bg-evergreen/5 hover:text-evergreen",
                    )}
                  >
                    {link.label}

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-honey"
                      />
                    )}
                  </motion.a>
                </motion.li>
              );
            })}

            <motion.li variants={mobileItemVariants} className="mt-2">
              <motion.a
                href="#contact"
                onClick={close}
                whileTap={{ scale: 0.97 }}
                className="block rounded-full bg-honey px-5 py-3.5 text-center text-[15px] font-medium text-evergreen-dark shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-colors hover:bg-honey-light"
              >
                {CTA_LABEL}
              </motion.a>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                    */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const toggleRef = useRef<HTMLButtonElement>(null);

  const active = useActiveSection(hrefs);

  // Reading progress, drawn along the bottom edge of the bar
  const { scrollY, scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Keep header visible while scrolling both up and down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const y = Math.max(latest, 0);
    setScrolled(y > 12);
  });

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Escape closes the menu and returns focus to the toggle;
  // resizing up to desktop closes it too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <MotionConfig reducedMotion="user">
      {/* Sticky header - always visible while scrolling */}
      <header className="fixed inset-x-0 top-0 z-50 w-full py-3">
        <motion.div
          animate={{ y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="container-content relative"
        >
          <motion.nav
            aria-label="Main"
            initial={{ opacity: 0, y: -16 }}
            animate={{
              opacity: 1,
              y: 0,
              height: scrolled ? 68 : 80,
            }}
            transition={{
              default: { duration: 0.6, ease },
              height: { duration: 0.35, ease },
            }}
            className={cn(
              "relative flex items-center justify-between overflow-hidden rounded-full border px-4 transition-[background-color,border-color,box-shadow] duration-500 sm:px-6",
              scrolled || open
                ? "border-evergreen/10 bg-cream/90 shadow-[0_10px_34px_-14px_rgba(23,50,38,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl"
                : "border-transparent bg-transparent shadow-none",
            )}
          >
            {/* Logo */}
            {/* Logo */}
<motion.a
  href="#top"
  aria-label="G1 RE-LIFE home"
  whileTap={{ scale: 0.97 }}
  className="flex shrink-0 items-center rounded-full outline-none"
>
  <AnimatePresence mode="wait" initial={false}>
    <motion.div
      key={scrolled ? "transparent-logo" : "background-logo"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Image
        src={
          scrolled
            ? "/g1relife-logo-transparent.webp"
            : "/logo_white_transparent.png"
        }
        alt="G1 RE-LIFE"
        width={140}
        height={48}
        priority
        className="h-16 w-auto object-contain object-left"
      />
    </motion.div>
  </AnimatePresence>
</motion.a>

            {/* Desktop navigation */}
            <DesktopLinks active={active} scrolled={scrolled || open} />

            {/* Desktop CTA */}
            <MagneticCTA />

            {/* Mobile menu button */}
            <MenuToggle
              open={open}
              onClick={() => setOpen((v) => !v)}
              innerRef={toggleRef}
            />

            {/* Reading progress hairline */}
            <motion.span
              aria-hidden="true"
              style={{ scaleX: progress }}
              animate={{ opacity: scrolled ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-honey"
            />
          </motion.nav>

          {/* Mobile menu */}
          <AnimatePresence>
            {open && <MobileMenu active={active} close={close} />}
          </AnimatePresence>
        </motion.div>
      </header>
    </MotionConfig>
  );
}
