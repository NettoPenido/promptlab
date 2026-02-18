"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE } from "@/content/prompts";

export default function PromptCopyCard({ prompt }: { prompt: string }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [copied, setCopied] = useState(false);

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

  async function copy() {
    if (!hasAccess) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  if (!hasAccess) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">🔒 Prompt bloqueado</div>
            <p className="text-white/60 text-sm mt-1">
              O prompt só desbloqueia após a compra aprovada na Hotmart.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={SITE.hotmartUrl}
              target="_blank"
              className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90"
            >
              Comprar acesso
            </a>
            <Link
              href="/acessar"
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5"
            >
              Já comprei — liberar
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-4 text-white/70 text-sm">
          🔒••••••••••••••••••••••••••••••••••
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-white/70">PROMPT</div>
        <button
          onClick={copy}
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm hover:bg-white/5"
        >
          {copied ? "Copiado ✅" : "Copiar"}
        </button>
      </div>

      <pre className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/90">{prompt}</pre>

      <form
        className="mt-4"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/access/logout", { method: "POST" });
          setHasAccess(false);
        }}
      >
        <button className="text-xs text-white/50 hover:text-white" type="submit">
          Sair
        </button>
      </form>
    </div>
  );
}
