"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/content/prompts";

export default function AcessarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      setError("Digite um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/access/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Não foi possível validar o e-mail.");
        return;
      }

      // If hasAccess is true, go back. If false, keep user here with guidance.
      if (data?.hasAccess) {
        router.back();
        return;
      }

      setError(
        "E-mail recebido, mas ainda não consta como liberado. Se você acabou de comprar, aguarde a aprovação do pagamento ou fale conosco."
      );
    } catch {
      setError("Falha ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="text-white/70 hover:text-white">
          ← Voltar para Home
        </Link>
        <a
          href={SITE.hotmartUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90"
        >
          Comprar acesso
        </a>
      </header>

      <section className="mx-auto max-w-xl px-4 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="text-xs tracking-[0.35em] text-white/60">DESBLOQUEIO</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Já comprei — liberar por e-mail
          </h1>
          <p className="mt-2 text-white/60 text-sm">
            Digite o mesmo e-mail usado na compra. Se o pagamento já estiver aprovado, o prompt será desbloqueado automaticamente.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="seuemail@dominio.com"
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <button
              disabled={loading}
              type="submit"
              className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Liberar acesso"}
            </button>

            {error ? <div className="text-sm text-red-300">{error}</div> : null}
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
            >
              Preciso de ajuda
            </a>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await fetch("/api/access/logout", { method: "POST" });
                router.refresh();
              }}
            >
              <button
                type="submit"
                className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
              >
                Sair
              </button>
            </form>
          </div>

          <div className="mt-5 text-xs text-white/50">
            Dica: se você acabou de pagar, a Hotmart pode levar alguns instantes para confirmar o pagamento.
          </div>
        </div>
      </section>
    </main>
  );
}
