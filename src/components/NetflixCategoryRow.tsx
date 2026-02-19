"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

export type NetflixCategory = {
  slug: string;
  title: string;
  subtitle: string;
  color: "blue" | "pink" | "yellow" | "orange";
  cover: string; // path in /public
};

const colorStyles: Record<
  NetflixCategory["color"],
  { glow: string; ring: string; chip: string }
> = {
  blue: {
    glow: "shadow-[0_10px_50px_rgba(56,189,248,0.18)]",
    ring: "ring-sky-500/25",
    chip: "bg-sky-500/15 text-sky-100 ring-sky-500/20",
  },
  pink: {
    glow: "shadow-[0_10px_50px_rgba(217,70,239,0.18)]",
    ring: "ring-fuchsia-500/25",
    chip: "bg-fuchsia-500/15 text-fuchsia-100 ring-fuchsia-500/20",
  },
  yellow: {
    glow: "shadow-[0_10px_50px_rgba(251,191,36,0.14)]",
    ring: "ring-amber-400/25",
    chip: "bg-amber-400/15 text-amber-100 ring-amber-400/20",
  },
  orange: {
    glow: "shadow-[0_10px_50px_rgba(249,115,22,0.14)]",
    ring: "ring-orange-500/25",
    chip: "bg-orange-500/15 text-orange-100 ring-orange-500/20",
  },
};

function toCategorySlug(input: string) {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function NetflixCategoryRow({
  title,
  subtitle,
  categories,
}: {
  title: string;
  subtitle?: string;
  categories: NetflixCategory[];
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  function scrollByCards(dir: -1 | 1) {
    const el = railRef.current;
    if (!el) return;

    // Scroll ~1 "screen" of cards
    const amount = Math.max(300, Math.floor(el.clientWidth * 0.85)) * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.4em] text-white/50">CATEGORIAS</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-white/70">{subtitle}</p>
          ) : null}
        </div>

        {/* Netflix-like arrows (desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/40 hover:bg-white/5"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4 text-white/85" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/40 hover:bg-white/5"
            aria-label="Avançar"
          >
            <ArrowRight className="h-4 w-4 text-white/85" />
          </button>
        </div>
      </div>

      <div className="mt-7">
        <div
          ref={railRef}
          className={[
            "flex gap-4 overflow-x-auto pb-4 pr-6",
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            // Netflix-ish feel
            "snap-x snap-mandatory scroll-smooth",
          ].join(" ")}
        >
          {categories.map((c, i) => {
            const s = colorStyles[c.color];
            const slug = toCategorySlug(c.slug || c.title);

            return (
              <motion.div
                key={slug || `${i}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group relative shrink-0 snap-start"
              >
                <Link
                  href={`/categoria/${slug}`}
                  className={[
                    // sizes closer to Netflix row tiles
                    "relative block w-[240px] md:w-[300px]",
                    "overflow-hidden rounded-3xl bg-white/6 ring-1 ring-white/12",
                    "transition-transform duration-300 will-change-transform",
                    "group-hover:scale-[1.10] group-hover:-translate-y-1",
                    "group-hover:z-10",
                    s.glow,
                  ].join(" ")}
                >
                  {/* 16:9 tile area */}
                  <div className="relative h-[135px] md:h-[170px]">
                    <Image
                      src={c.cover}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 240px, 300px"
                      priority={i < 2}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div
                      className={`absolute inset-0 ring-1 ${s.ring} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                    />
                    <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold tracking-tight">
                        {c.title}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                        Abrir <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-white/70">{c.subtitle}</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ring-1 ${s.chip}`}
                      >
                        Imagens + Prompt
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/80 ring-1 ring-white/10">
                        Copiar 1-click
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/80 ring-1 ring-white/10">
                        Prompt protegido
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
