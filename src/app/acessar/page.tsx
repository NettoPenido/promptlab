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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/access/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/");
      return;
    }

    if (res.status === 403) {
      setError("Não encontrei acesso liberado para este e-mail ainda. Verifique se você digitou o mesmo e-mail usado na Hotmart.");
      return;
    }

    setError("Não consegui validar seu acesso. Tente novamente.");
  }

  return (
    <main className="min-h-screen bg-black text-white grid place-items-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="text-xs tracking-[0.35em] text-white/60">PROMPT LAB</div>
        <h1 className="mt-2 text-2xl font-semibold">Desbloquear acesso</h1>
        <p className="mt-2 text-white/60 text-sm">
          Digite o <b>mesmo e-mail</b> usado na compra da Hotmart. Se sua compra já foi aprovada, o acesso libera automaticamente.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="seuemail@..."
            className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm outline-none focus:border-white/30"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Validando..." : "Liberar"}
          </button>

          {error ? <div className="text-sm text-red-300">{error}</div> : null}
        </form>

        <div className="mt-6 flex flex-col gap-2 text-sm">
          <a className="rounded-xl border border-white/15 px-4 py-3 hover:bg-white/5" href={SITE.hotmartUrl} target="_blank">
            Ainda não comprei — ir para pagamento
          </a>
          <Link className="text-white/70 hover:text-white text-center" href="/">
            Voltar
          </Link>
        </div>

        <div className="mt-6 text-xs text-white/45">
          Suporte: <a className="text-white/70 hover:text-white" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </div>
      </div>
    </main>
  );
}
