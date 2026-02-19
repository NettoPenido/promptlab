"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SITE } from "@/content/prompts";

export default function PromptInlineCopy({
  prompt,
  hasAccess,
}: {
  prompt: string;
  hasAccess?: boolean;
}) {
  const [autoAccess, setAutoAccess] = useState<boolean | null>(null);
  const access = hasAccess ?? autoAccess ?? false;

  const teaser = useMemo(() => {
    const t = (prompt || "").trim();
    if (!t) return "";
    return t.length > 220 ? t.slice(0, 220).trimEnd() + "..." : t;
  }, [prompt]);

  useEffect(() => {
    // If caller already knows access, don't fetch.
    if (typeof hasAccess === "boolean") return;

    (async () => {
      try {
        const res = await fetch("/api/access/me", { cache: "no-store" });
        const data = await res.json();
        setAutoAccess(Boolean(data?.hasAccess));
      } catch {
        setAutoAccess(false);
      }
    })();
  }, [hasAccess]);

  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!access) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  if (!access) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-white/70">
            <div className="font-semibold text-white/85">🔒 Prompt protegido</div>
            <div className="mt-1 text-xs text-white/60">Compre para desbloquear e copiar.</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={SITE.hotmartUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:opacity-90"
            >
              Comprar premium
            </a>
            <Link
              href="/acessar"
              className="rounded-full border border-white/15 bg-white/0 px-4 py-2 text-xs font-semibold text-white/85 hover:bg-white/5"
            >
              Já comprei
            </Link>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70">
          {teaser ? <span className="select-none blur-sm">{teaser}</span> : "🔒••••••••••••••••••••••••••••••••••"}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-semibold tracking-[0.25em] text-white/60">PROMPT</div>
        <button
          onClick={copy}
          className="rounded-full border border-white/20 bg-white/0 px-4 py-1.5 text-xs font-semibold text-white/85 hover:bg-white/5"
        >
          {copied ? "Copiado ✅" : "Copiar"}
        </button>
      </div>

      <div className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/90">{prompt}</div>

      <div className="mt-3 text-[11px] text-white/50">
        Dica: clique em <span className="text-white/70">Abrir</span> para ver a imagem em tamanho grande.
      </div>
    </div>
  );
}
