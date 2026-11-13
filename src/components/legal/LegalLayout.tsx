"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Info,
  LifeBuoy,
  Link2,
  Printer,
} from "lucide-react";

export type LegalSection = { title: string; content: ReactNode; highlight?: boolean };
type Props = {
  kicker: string;
  title: string;
  lead: string;
  updated: string;
  glance: { icon: string; title: string; text: string }[];
  sections: LegalSection[];
};

/* ---------- Brand tokens ----------
   sage-900 #394637 · sage-700 #475545 · sage-500 #4F5C4D (text on cream)
   clay #C69A75 · clay-dark #AC7F5C · clay-text #8A5F3E (AA on paper)
   sand #D8B391 · cream #F5EEE4 · paper #FCFAF6
------------------------------------------------------- */

const DOCS = [
  { href: "/privacy-policy", label: "Privacy Policy", hint: "How we collect, use and protect your information." },
  { href: "/terms-and-conditions", label: "Terms & Conditions", hint: "The terms that apply to our website and services." },
];

const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C69A75]";
const num = (i: number) => String(i + 1).padStart(2, "0");

/* All motion is CSS (compositor-only: transform + opacity). JS only toggles
   attributes / CSS variables — no per-frame React re-renders. */
const CSS = `
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
.lgz-bar{transform:scaleX(var(--p,0));will-change:transform}

/* hero entrance */
.lgz-rise{opacity:0;animation:lgz-rise .85s cubic-bezier(.2,.7,.2,1) var(--d,0s) forwards}
@keyframes lgz-rise{from{opacity:0;transform:translate3d(0,18px,0)}to{opacity:1;transform:none}}
.lgz-mask{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.lgz-word{display:inline-block;transform:translate3d(0,110%,0);animation:lgz-word .95s cubic-bezier(.2,.7,.2,1) calc(.12s + var(--i,0) * .07s) forwards}
@keyframes lgz-word{to{transform:none}}
.lgz-drift{animation:lgz-drift 16s ease-in-out infinite alternate;will-change:transform}
@keyframes lgz-drift{to{transform:translate3d(-48px,36px,0) scale(1.1)}}
.lgz-spin{transform-origin:200px 200px;animation:lgz-spin 90s linear infinite}
@keyframes lgz-spin{to{transform:rotate(360deg)}}
.lgz-arc{stroke-dasharray:880;stroke-dashoffset:880;animation:lgz-draw 2.4s .5s cubic-bezier(.3,.7,.2,1) forwards}
@keyframes lgz-draw{to{stroke-dashoffset:220}}
.lgz-grain::after{content:"";position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.07;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* scroll reveal (state set by IntersectionObserver) */
.lgz-r{transition:opacity .75s cubic-bezier(.2,.7,.2,1),transform .75s cubic-bezier(.2,.7,.2,1)}
.lgz-r[data-r="0"]{opacity:0;transform:translate3d(0,24px,0)}
.lgz-sec{position:relative}
.lgz-sec::before{content:"";position:absolute;left:0;top:2.4rem;height:2.2rem;width:3px;border-radius:0 3px 3px 0;background:linear-gradient(#C69A75,#AC7F5C);
  transform:scaleY(0);transform-origin:top;transition:transform .6s cubic-bezier(.2,.7,.2,1) .25s}
.lgz-sec[data-r="1"]::before{transform:scaleY(1)}
.lgz-sec[data-on="1"]{background:linear-gradient(90deg,rgba(216,179,145,.12),transparent 55%)}
.lgz-sec{transition:background-color .4s}

/* glance spotlight (pointer devices only) */
.lgz-card{position:relative;transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.lgz-card::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .35s;
  background:radial-gradient(280px circle at var(--mx,50%) var(--my,50%),rgba(198,154,117,.18),transparent 70%)}
.lgz-ico{transition:transform .5s cubic-bezier(.3,1.4,.5,1)}
@media (hover:hover){
  .lgz-card:hover::after{opacity:1}
  .lgz-card:hover .lgz-ico{transform:scale(1.12) rotate(-6deg)}
}

/* mobile TOC popover */
.lgz-pop{animation:lgz-pop .24s cubic-bezier(.2,.7,.2,1)}
@keyframes lgz-pop{from{opacity:0;transform:translate3d(0,-8px,0)}to{opacity:1;transform:none}}

/* sidebar indicator */
.lgz-ind{transition:transform .45s cubic-bezier(.2,.8,.2,1),height .45s cubic-bezier(.2,.8,.2,1)}

@media (prefers-reduced-motion:reduce){
  .lgz-rise,.lgz-word{animation:none;opacity:1;transform:none}
  .lgz-drift,.lgz-spin,.lgz-pop{animation:none}
  .lgz-arc{animation:none;stroke-dashoffset:220}
  .lgz-r,.lgz-sec::before,.lgz-ind,.lgz-card,.lgz-ico{transition:none}
  .lgz-r[data-r="0"]{opacity:1;transform:none}
  .lgz-sec::before{transform:scaleY(1)}
}

@media print{
  .lgz-no-print{display:none!important}
  .lgz-root{background:#fff!important}
  .lgz-hero{background:#fff!important;color:#000!important;padding:0 0 16px!important}
  .lgz-hero *{color:#000!important;border-color:#ccc!important;background:transparent!important}
  .lgz-grain::after{display:none}
  .lgz-r,.lgz-r[data-r="0"]{opacity:1!important;transform:none!important}
  .lgz-sec::before{display:none}
  .lgz-sec{break-inside:avoid;background:none!important}
  .lgz-paper,.lgz-panel,.lgz-glance{box-shadow:none!important}
  .lgz-panel{background:#fff!important;color:#000!important;border:1px solid #ccc}
  .lgz-panel *{color:#000!important}
}
`;

export default function LegalLayout({ kicker, title, lead, updated, glance, sections }: Props) {
  const path = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const olRef = useRef<HTMLOListElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pctRef = useRef<HTMLSpanElement>(null);
  const tocWrap = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState("s1");
  const [minutes, setMinutes] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const count = sections.length;

  /* reading time, scroll-spy, scroll reveal, progress (no re-render per frame) */
  useEffect(() => {
    const article = articleRef.current;
    const root = rootRef.current;
    const words = (article?.innerText ?? "").trim().split(/\s+/).length;
    setMinutes(Math.max(1, Math.round(words / 200)));

    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).id)),
      { rootMargin: "-20% 0px -70% 0px" }
    );
    article?.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

    const reveal = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          (e.target as HTMLElement).dataset.r = "1";
          reveal.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    root?.querySelectorAll<HTMLElement>(".lgz-r").forEach((el) => {
      const below = el.getBoundingClientRect().top > window.innerHeight * 0.92;
      el.dataset.r = below ? "0" : "1";
      if (below) reveal.observe(el);
    });

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement;
        const max = h.scrollHeight - window.innerHeight || 1;
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        root?.style.setProperty("--p", p.toFixed(4));
        if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
        if (window.innerHeight + window.scrollY >= h.scrollHeight - 4) setActive(`s${count}`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      spy.disconnect();
      reveal.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const activeIndex = Math.max(0, Number(active.slice(1)) - 1);

  /* sliding sidebar indicator + keep active item visible */
  useEffect(() => {
    const a = linkRefs.current[activeIndex];
    const ind = indRef.current;
    if (!a || !ind) return;
    ind.style.transform = `translate3d(0,${a.offsetTop}px,0)`;
    ind.style.height = `${a.offsetHeight}px`;
    const aside = asideRef.current;
    if (aside && aside.offsetParent) {
      const top = a.offsetTop + (olRef.current?.offsetTop ?? 0);
      if (top < aside.scrollTop + 16 || top + a.offsetHeight > aside.scrollTop + aside.clientHeight - 16) {
        aside.scrollTo({ top: Math.max(0, top - aside.clientHeight / 3), behavior: "smooth" });
      }
    }
    /* soft highlight on the section being read */
    articleRef.current?.querySelectorAll<HTMLElement>(".lgz-sec").forEach((el) => {
      el.dataset.on = el.id === active ? "1" : "0";
    });
  }, [activeIndex, active]);

  /* mobile TOC: Escape + click outside */
  useEffect(() => {
    if (!tocOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTocOpen(false);
    const onDown = (e: Event) => {
      if (tocWrap.current && !tocWrap.current.contains(e.target as Node)) setTocOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [tocOpen]);

  const copy = useCallback(async (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}${id === "page" ? "" : `#${id}`}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1800);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }, []);

  const spot = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const other = DOCS.find((d) => d.href !== path);
  const regular = sections.map((s, i) => ({ s, i })).filter((x) => !x.s.highlight);
  const featured = sections.map((s, i) => ({ s, i })).filter((x) => x.s.highlight);
  const words = title.split(" ");

  const heroBtn = `inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-[#FCFAF6] backdrop-blur transition-[background-color,transform] duration-300 hover:bg-white/20 active:scale-95 ${focus}`;

  return (
    <div
      ref={rootRef}
      className="lgz-root overflow-x-clip bg-[#F5EEE4] text-[#394637] antialiased [--legal-top:5.5rem] lg:[--legal-top:7rem]"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>

      {/* Reading progress */}
      <div
        aria-hidden
        className="lgz-bar lgz-no-print fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[#AC7F5C] via-[#C69A75] to-[#D8B391]"
      />

      {/* ───────── Hero ───────── */}
      <section className="lgz-hero lgz-grain relative overflow-hidden bg-gradient-to-br from-[#475545] via-[#425040] to-[#394637] pb-28 pt-28 text-[#FCFAF6] sm:pb-32 sm:pt-40">
        <div
          aria-hidden
          className="lgz-drift absolute -right-24 -top-32 h-[320px] w-[320px] rounded-full bg-[#C69A75] opacity-30 blur-[80px] sm:h-[460px] sm:w-[460px] sm:blur-[90px]"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-32 h-[300px] w-[300px] rounded-full bg-[#D8B391] opacity-10 blur-[90px]"
        />

        {/* Re-Life ring motif */}
        <svg
          aria-hidden
          viewBox="0 0 400 400"
          className="pointer-events-none absolute -right-24 top-1/2 hidden h-[460px] w-[460px] -translate-y-1/2 md:block lg:right-[4%]"
          fill="none"
        >
          <circle cx="200" cy="200" r="190" stroke="rgba(252,250,246,.10)" strokeWidth="1" />
          <circle cx="200" cy="200" r="140" stroke="rgba(252,250,246,.10)" strokeWidth="1" />
          <circle cx="200" cy="200" r="90" stroke="rgba(252,250,246,.10)" strokeWidth="1" />
          <g className="lgz-spin">
            <circle
              className="lgz-arc"
              cx="200"
              cy="200"
              r="140"
              stroke="#D8B391"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform="rotate(-90 200 200)"
            />
            <circle cx="200" cy="60" r="5" fill="#D8B391" />
          </g>
        </svg>

        <div className="relative z-[1] mx-auto max-w-[1160px] px-5 sm:px-6">
          <span
            className="lgz-rise inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-[#F5EEE4] backdrop-blur"
            style={{ ["--d" as string]: "0s" } as CSSProperties}
          >
            <i className="h-1.5 w-1.5 rounded-full bg-[#D8B391]" />
            {kicker}
          </span>

          <h1
            aria-label={title}
            className="mb-4 mt-6 max-w-3xl font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.08] tracking-[-0.01em]"
          >
            {words.map((w, i) => (
              <span key={i} aria-hidden>
                <span className="lgz-mask">
                  <span className="lgz-word" style={{ ["--i" as string]: i } as CSSProperties}>
                    {w}
                  </span>
                </span>
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          <p
            className="lgz-rise max-w-xl text-[1.02rem] leading-relaxed text-[#F5EEE4]/85 sm:text-[1.08rem]"
            style={{ ["--d" as string]: ".35s" } as CSSProperties}
          >
            {lead}
          </p>

          <div
            className="lgz-rise lgz-no-print mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#F5EEE4]/85"
            style={{ ["--d" as string]: ".5s" } as CSSProperties}
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[#D8B391]" aria-hidden />
              Last updated {updated}
            </span>
            {minutes && (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#D8B391]" aria-hidden />
                {minutes} min read
              </span>
            )}
            <span className="flex flex-wrap items-center gap-2.5">
              <button type="button" onClick={() => window.print()} className={heroBtn}>
                <Printer className="h-4 w-4" aria-hidden /> Print
              </button>
              <button type="button" onClick={() => copy("page")} className={heroBtn}>
                {copied === "page" ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
                {copied === "page" ? "Link copied" : "Copy link"}
              </button>
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1160px] px-5 sm:px-6">
        {/* ───────── At a glance ───────── */}
        <div className="lgz-glance relative z-[2] -mt-12 grid divide-y divide-[#D8B391]/40 overflow-hidden rounded-2xl border border-[#D8B391]/40 bg-[#FCFAF6] shadow-[0_30px_60px_-36px_rgba(57,70,55,.55)] sm:-mt-14 md:grid-cols-3 md:divide-x md:divide-y-0">
          {glance.map((g, i) => (
            <div
              key={g.title}
              onPointerMove={spot}
              className="lgz-card lgz-rise flex items-start gap-4 p-5 sm:p-7"
              style={{ ["--d" as string]: `${0.55 + i * 0.1}s` } as CSSProperties}
            >
              <span
                aria-hidden
                className="lgz-ico grid h-12 w-12 flex-none place-items-center rounded-full bg-[#F5EEE4] text-[1.4rem] ring-1 ring-[#D8B391]/50"
              >
                {g.icon}
              </span>
              <div>
                <h3 className="font-display text-[1.08rem] leading-snug text-[#394637]">{g.title}</h3>
                <p className="mt-1 text-[.93rem] leading-relaxed text-[#4F5C4D]">{g.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-y-6 pb-20 pt-10 sm:pb-24 sm:pt-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-14">
          {/* ───────── Mobile / tablet jump bar ───────── */}
          <div
            ref={tocWrap}
            className="lgz-no-print sticky top-[var(--legal-top)] z-40 -mx-5 border-b border-[#D8B391]/40 bg-[#F5EEE4]/90 px-5 backdrop-blur-md sm:-mx-6 sm:px-6 lg:hidden"
          >
            <button
              type="button"
              aria-expanded={tocOpen}
              aria-controls="lgz-mobile-toc"
              onClick={() => setTocOpen((o) => !o)}
              className={`flex w-full items-center justify-between gap-3 py-3 text-left text-[.95rem] font-medium text-[#394637] ${focus}`}
            >
              <span className="truncate">
                <span className="mr-2 tabular-nums text-[#8A5F3E]">{num(activeIndex)}</span>
                {sections[activeIndex]?.title}
              </span>
              <span className="flex flex-none items-center gap-2 text-xs tabular-nums text-[#4F5C4D]">
                {num(activeIndex)}/{num(count - 1)}
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${tocOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </span>
            </button>
            {tocOpen && (
              <ol
                id="lgz-mobile-toc"
                className="lgz-pop absolute inset-x-0 top-full max-h-[60vh] overflow-y-auto overscroll-contain border-b border-[#D8B391]/40 bg-[#FCFAF6] px-5 py-2 shadow-[0_24px_40px_-24px_rgba(57,70,55,.45)] sm:px-6"
              >
                {sections.map((s, i) => (
                  <li key={s.title}>
                    <a
                      href={`#s${i + 1}`}
                      onClick={() => setTocOpen(false)}
                      className={`flex items-baseline gap-3 rounded-lg py-3 text-[.95rem] ${focus} ${
                        i === activeIndex ? "font-semibold text-[#394637]" : "text-[#4F5C4D]"
                      }`}
                    >
                      <span className="w-6 tabular-nums text-[#8A5F3E]">{num(i)}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* ───────── Desktop sidebar ───────── */}
          <aside
            ref={asideRef}
            className="lgz-no-print sticky top-[calc(var(--legal-top)+1rem)] hidden max-h-[calc(100vh-var(--legal-top)-3rem)] overflow-y-auto overscroll-contain pr-1 lg:block"
          >
            <nav aria-label="On this page">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#394637]">On this page</h2>
                <span ref={pctRef} className="text-xs tabular-nums text-[#4F5C4D]" aria-hidden>
                  0%
                </span>
              </div>
              <ol ref={olRef} className="relative">
                <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-[#D8B391]/60" />
                <span
                  ref={indRef}
                  aria-hidden
                  className="lgz-ind absolute left-[-0.5px] top-0 w-[2px] rounded-full bg-[#AC7F5C]"
                  style={{ height: 0 }}
                />
                {sections.map((s, i) => {
                  const id = `s${i + 1}`;
                  const on = active === id;
                  return (
                    <li key={id}>
                      <a
                        ref={(el) => {
                          linkRefs.current[i] = el;
                        }}
                        href={`#${id}`}
                        aria-current={on ? "location" : undefined}
                        className={`block py-1.5 pl-4 pr-2 text-[.92rem] leading-snug transition-[color,transform] duration-300 ${focus} ${
                          on
                            ? "translate-x-0.5 font-semibold text-[#394637]"
                            : "text-[#4F5C4D] hover:translate-x-0.5 hover:text-[#394637]"
                        }`}
                      >
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <a
              href={`#s${count}`}
              className={`group mt-6 flex items-center gap-3 rounded-xl border border-[#D8B391]/50 bg-[#FCFAF6] p-4 text-sm transition-[border-color,background-color] duration-300 hover:border-[#C69A75] hover:bg-white ${focus}`}
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#F5EEE4] text-[#8A5F3E]">
                <LifeBuoy className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-[#394637]">Have a question?</span>
                <span className="block text-[#4F5C4D]">Jump to contact</span>
              </span>
            </a>
          </aside>

          {/* ───────── Document ───────── */}
          <article ref={articleRef} className="min-w-0">
            <div className="lgz-paper divide-y divide-[#D8B391]/40 overflow-hidden rounded-2xl border border-[#D8B391]/40 bg-[#FCFAF6] shadow-[0_30px_60px_-44px_rgba(57,70,55,.5)]">
              {regular.map(({ s, i }) => (
                <section
                  key={s.title}
                  id={`s${i + 1}`}
                  aria-labelledby={`s${i + 1}-h`}
                  className="lgz-sec lgz-r group grid scroll-mt-[calc(var(--legal-top)+4rem)] gap-x-6 px-5 py-7 sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:px-10 sm:py-10"
                >
                  <span
                    aria-hidden
                    className="hidden pt-[.6rem] text-sm font-semibold tabular-nums text-[#8A5F3E] sm:block"
                  >
                    {num(i)}
                  </span>
                  <div className="min-w-0">
                    <h2
                      id={`s${i + 1}-h`}
                      className="mb-4 flex items-start gap-2 font-display text-[1.35rem] leading-snug text-[#394637] sm:text-[1.65rem]"
                    >
                      <span aria-hidden className="mr-1 mt-[.4rem] text-sm font-semibold tabular-nums text-[#8A5F3E] sm:hidden">
                        {num(i)}
                      </span>
                      <span>{s.title}</span>
                      <button
                        type="button"
                        onClick={() => copy(`s${i + 1}`)}
                        aria-label={`Copy link to ${s.title}`}
                        className={`mt-1.5 hidden rounded-md p-1.5 text-[#8A5F3E] opacity-0 transition-opacity duration-200 hover:bg-[#D8B391]/25 focus-visible:opacity-100 group-hover:opacity-100 sm:inline-flex ${focus}`}
                      >
                        {copied === `s${i + 1}` ? (
                          <Check className="h-4 w-4" aria-hidden />
                        ) : (
                          <Link2 className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    </h2>
                    <div className="max-w-[68ch] space-y-3.5 break-words text-[1rem] leading-[1.8] text-[#394637]/90 sm:text-[1.02rem] [&_a]:font-medium [&_a]:text-[#394637] [&_a]:underline [&_a]:decoration-[#C69A75] [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:decoration-[#AC7F5C] [&_b]:font-semibold [&_b]:text-[#394637]">
                      {s.content}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Highlighted section (contact) */}
            {featured.map(({ s, i }) => (
              <section
                key={s.title}
                id={`s${i + 1}`}
                aria-labelledby={`s${i + 1}-h`}
                className="lgz-panel lgz-r relative mt-6 scroll-mt-[calc(var(--legal-top)+4rem)] overflow-hidden rounded-2xl bg-gradient-to-br from-[#475545] to-[#394637] px-5 py-8 text-[#F5EEE4] shadow-[0_30px_60px_-34px_rgba(57,70,55,.7)] sm:px-10 sm:py-11"
              >
                <div
                  aria-hidden
                  className="lgz-drift pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C69A75] opacity-25 blur-[70px]"
                />
                <div className="relative grid gap-x-6 sm:grid-cols-[2.75rem_minmax(0,1fr)]">
                  <span aria-hidden className="hidden pt-[.6rem] text-sm font-semibold tabular-nums text-[#D8B391] sm:block">
                    {num(i)}
                  </span>
                  <div className="min-w-0">
                    <h2 id={`s${i + 1}-h`} className="mb-4 font-display text-[1.45rem] leading-snug text-white sm:text-[1.65rem]">
                      {s.title}
                    </h2>
                    <div className="max-w-[68ch] space-y-3.5 break-words text-[1rem] leading-[1.8] sm:text-[1.02rem] [&_a]:font-medium [&_a]:text-[#D8B391] [&_a]:underline [&_a]:decoration-[#D8B391]/60 [&_a]:underline-offset-4 hover:[&_a]:decoration-[#D8B391] [&_b]:font-semibold [&_b]:text-white">
                      {s.content}
                    </div>
                  </div>
                </div>
              </section>
            ))}

            {/* Related document */}
            {other && (
              <Link
                href={other.href}
                className={`lgz-no-print lgz-r group mt-6 flex items-center justify-between gap-6 rounded-2xl border border-[#D8B391]/50 bg-[#FCFAF6] px-5 py-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#C69A75] hover:bg-white sm:px-10 ${focus}`}
              >
                <span>
                  <span className="block text-sm text-[#4F5C4D]">Also read</span>
                  <span className="mt-0.5 block font-display text-[1.2rem] text-[#394637]">{other.label}</span>
                  <span className="mt-0.5 block text-[.93rem] text-[#4F5C4D]">{other.hint}</span>
                </span>
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#475545] text-[#FCFAF6] transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </span>
              </Link>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}

/* ---------- Content helpers used by the pages ---------- */

export const Bullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="my-3 space-y-0.5">
    {items.map((t, i) => (
      <li key={i} className="relative py-1 pl-6">
        <span
          aria-hidden
          className="absolute left-0.5 top-[1.02rem] h-1.5 w-1.5 rounded-full bg-[#AC7F5C] shadow-[0_0_0_3px_rgba(198,154,117,.28)]"
        />
        {t}
      </li>
    ))}
  </ul>
);

export const Note = ({ children }: { children: ReactNode }) => (
  <div
    role="note"
    className="flex gap-3.5 rounded-xl border border-[#D8B391]/60 border-l-4 border-l-[#AC7F5C] bg-[#F5EEE4] px-4 py-4 text-[.97rem] leading-relaxed text-[#394637] sm:px-5 sm:text-[.99rem]"
  >
    <Info className="mt-1 h-5 w-5 flex-none text-[#8A5F3E]" aria-hidden />
    <div className="min-w-0">{children}</div>
  </div>
);

export const ContactBlock = () => (
  <>
    <p>Questions about this document? Reach out any time — we respond as soon as we can.</p>
    <Bullets
      items={[
        <>Email: <a href="mailto:g1relifenutrition@gmail.com">g1relifenutrition@gmail.com</a></>,
        <>Phone / WhatsApp: <a href="tel:+919966763679">+91 99667 63679</a></>,
        <>Address: G1 RE-LIFE Wellness Zone, Dilsukhnagar, Hyderabad, Telangana, India</>,
      ]}
    />
  </>
);