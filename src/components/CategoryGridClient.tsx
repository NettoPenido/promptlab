"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PromptItem } from "@/content/prompts";
import PromptInlineCopy from "@/components/PromptInlineCopy";

function safeImageSrc(src: string) {
  const s = String(src || "").trim();
  if (!s) return "/imgs/placeholder.jpg";

  // URL or public path
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  if (s.startsWith("/")) return s;

  // Windows absolute path -> map to /imgs/<filename>
  const normalized = s.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  const filename = parts[parts.length - 1] || "";

  if (normalized.toLowerCase().includes("/public/imgs/")) {
    return `/imgs/${filename}`;
  }

  return `/imgs/${filename}`;
}


export default function CategoryGridClient({ items }: { items: PromptItem[] }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/access/me", { cache: "no-store" });
        const data = await res.json();
        setHasAccess(Boolean(data?.hasAccess));
      } catch {
        setHasAccess(false);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((it) => (
        <div
          key={it.id}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black"
        >
          <Link href={`/prompt/${it.id}`} className="block">
            <div className="relative aspect-[16/9] md:aspect-[4/3]">
              <Image
                src={safeImageSrc(it.image)}
                alt={it.title}
                fill
                className="object-cover opacity-95 transition duration-300 group-hover:scale-[1.02]"
                style={{ objectPosition: "50% 25%" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            </div>
          </Link>

          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/prompt/${it.id}`} className="block">
                  <div className="text-base md:text-lg font-semibold leading-snug">
                    {it.title}
                  </div>
                </Link>
                <div className="mt-1 text-xs text-white/60">
                  {it.tags?.slice(0, 4).join(" • ") ?? "Prompt premium"}
                </div>
              </div>

              <Link
                href={`/prompt/${it.id}`}
                className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/10"
              >
                Abrir
              </Link>
            </div>

            {/* Prompt (bloqueado/desbloqueado) */}
            <div className="mt-4">
              <PromptInlineCopy prompt={it.prompt} hasAccess={hasAccess} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
