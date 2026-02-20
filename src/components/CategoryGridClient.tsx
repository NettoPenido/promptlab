'use client';

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import PromptInlineCopy from "@/components/PromptInlineCopy";

function safeImageSrc(src: string) {
  const s = String(src || "").trim();
  if (!s) return "/imgs/placeholder.jpg";

  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;

  const normalized = s.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  const filename = parts[parts.length - 1] || "";

  // se alguém colar caminho tipo public/imgs/arquivo.jpg, converte pra /imgs/arquivo.jpg
  if (normalized.toLowerCase().includes("/public/imgs/")) {
    return `/imgs/${filename}`;
  }

  return `/imgs/${filename}`;
}

type Item = {
  id: string;
  title: string;

  // banco / API
  imageUrl?: string;
  focusX?: number;
  focusY?: number;

  category?: string;
  prompt?: string;
};

export default function CategoryGridClient({ items }: { items: Item[] }) {
  const normalized = useMemo(() => {
    return (items || []).map((it) => {
      const fx = Number.isFinite(Number(it.focusX)) ? Number(it.focusX) : 50;
      const fy = Number.isFinite(Number(it.focusY)) ? Number(it.focusY) : 25;

      return {
        ...it,
        image: safeImageSrc(it.imageUrl || ""),
        imageFocus: `${fx}% ${fy}%`,
      };
    });
  }, [items]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {normalized.map((it) => (
        <article
          key={it.id}
          className="group rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden shadow-[0_20px_120px_rgba(0,0,0,0.7)] hover:border-white/20 transition"
        >
          <Link href={`/prompt/${it.id}`} className="block">
            <div className="relative aspect-[16/9]">
              <Image
                src={(it as any).image}
                alt={it.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="transition-transform duration-500 group-hover:scale-[1.06]"
                style={{ objectFit: "cover", objectPosition: (it as any).imageFocus }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            </div>

            <div className="p-5">
              <h3 className="text-base font-semibold tracking-tight">{it.title}</h3>
            </div>
          </Link>

          <div className="px-5 pb-5">
            <PromptInlineCopy prompt={(it as any).prompt} />
          </div>
        </article>
      ))}
    </div>
  );
}