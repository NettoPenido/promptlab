"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
    glow: "shadow-[0_0_70px_rgba(56,189,248,0.22)]",
    ring: "ring-sky-500/25",
    chip: "bg-sky-500/15 text-sky-100 ring-sky-500/20",
  },
  pink: {
    glow: "shadow-[0_0_70px_rgba(217,70,239,0.22)]",
    ring: "ring-fuchsia-500/25",
    chip: "bg-fuchsia-500/15 text-fuchsia-100 ring-fuchsia-500/20",
  },
  yellow: {
    glow: "shadow-[0_0_70px_rgba(251,191,36,0.18)]",
    ring: "ring-amber-400/25",
    chip: "bg-amber-400/15 text-amber-100 ring-amber-400/20",
  },
  orange: {
    glow: "shadow-[0_0_70px_rgba(249,115,22,0.18)]",
    ring: "ring-orange-500/25",
    chip: "bg-orange-500/15 text-orange-100 ring-orange-500/20",
  },
};

export function NetflixCategoryRow({
  title,
  subtitle,
  categories,
}: {
  title: string;
  subtitle?: string;
  categories: NetflixCategory[];
}) {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div>
        <div className="text-xs tracking-[0.4em] text-white/50">CATEGORIAS</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-white/70">{subtitle}</p>
        ) : null}
      </div>

      <div className="mt-7">
        <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c, i) => {
            const s = colorStyles[c.color];
            return (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group relative w-[260px] shrink-0 md:w-[340px]"
              >
                <Link
                  href={`/categoria/${c.slug}`}
                  className={[
                    "relative block overflow-hidden rounded-3xl bg-white/6 ring-1 ring-white/12",
                    "transition-transform duration-300 will-change-transform",
                    "group-hover:scale-[1.06] group-hover:-translate-y-1",
                    s.glow,
                  ].join(" ")}
                >
                  <div className="relative h-[180px] md:h-[210px]">
                    <Image
                      src={c.cover}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 260px, 340px"
                      priority={i < 2}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className={`absolute inset-0 ring-1 ${s.ring} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                    <div className="pointer-events-none absolute -left-24 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-lg font-semibold tracking-tight">{c.title}</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                        Abrir <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-white/70">{c.subtitle}</div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ring-1 ${s.chip}`}>
                        Imagens + Prompt
                      </span>
                      <span className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-[11px] text-white/80 ring-1 ring-white/10">
                        Copiar 1‑click
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
