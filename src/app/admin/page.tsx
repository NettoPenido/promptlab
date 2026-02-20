"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { key: "homens", label: "Homens" },
  { key: "mulheres", label: "Mulheres" },
  { key: "infantis", label: "Infantis" },
  { key: "publicidade", label: "Publicidade" },
];

type Item = {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  focusX: number;
  focusY: number;
  prompt: string;
  isPublished: boolean;
  createdAt?: string;
};

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("homens");
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(25);
  const [step, setStep] = useState(5);

  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const s = localStorage.getItem("ADMIN_SECRET") || "";
    if (s) setAdminSecret(s);
  }, []);

  function saveSecret(v: string) {
    setAdminSecret(v);
    localStorage.setItem("ADMIN_SECRET", v);
  }

  async function refresh() {
    setStatus("");
    try {
      if (!adminSecret.trim()) {
        setItems([]);
        setStatus("Cole o ADMIN_SECRET para carregar a lista.");
        return;
      }

      const res = await fetch("/api/admin/prompts", {
        headers: { "x-admin-secret": adminSecret.trim() },
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setItems(data.items || []);
    } catch (e: any) {
      setItems([]);
      setStatus(e?.message || String(e));
    }
  }

  useEffect(() => {
    // carrega automaticamente quando o secret existir
    if (adminSecret.trim()) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSecret]);

  function clamp(n: number) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function move(dx: number, dy: number) {
    setFocusX((v) => clamp(v + dx));
    setFocusY((v) => clamp(v + dy));
  }

  async function create() {
    setStatus("");
    try {
      if (!adminSecret.trim()) {
        setStatus("Cole o ADMIN_SECRET (obrigatório).");
        return;
      }

      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          prompt,
          isPublished, // ✅ agora bate com o Prisma
          focusX,
          focusY,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setTitle("");
      setImageUrl("");
      setPrompt("");
      setFocusX(50);
      setFocusY(25);

      await refresh();
      setStatus("Criado ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  const previewStyle = useMemo(
    () => ({
      backgroundImage: imageUrl
        ? `url(${imageUrl})`
        : "linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
      backgroundSize: "cover",
      backgroundPosition: `${focusX}% ${focusY}%`,
    }),
    [imageUrl, focusX, focusY]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.35em] text-white/60">ADMIN</div>
            <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">Dashboard de Prompts</h1>
            <p className="mt-2 text-white/60">Preview + botões de foco (sem adivinhar %).</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5"
            >
              Recarregar
            </button>
            <Link href="/" className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90">
              Sair
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold mb-4">Novo prompt</div>

            <label className="block text-xs text-white/60 mb-1">ADMIN_SECRET (obrigatório)</label>
            <input
              value={adminSecret}
              onChange={(e) => saveSecret(e.target.value)}
              placeholder="Cole o mesmo ADMIN_SECRET da Vercel"
              className="w-full mb-4 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
            />

            <div className="text-xs tracking-[0.35em] text-white/60 mb-2">PREVIEW DO CARD</div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Preview</div>
                <div className="text-xs text-white/50">
                  Foco atual: {focusX}% {focusY}%
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                <div className="aspect-[16/9]" style={previewStyle} />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="text-xs text-white/60">Passo</div>
                <select
                  value={step}
                  onChange={(e) => setStep(parseInt(e.target.value, 10))}
                  className="rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
                >
                  {[1, 2, 5, 10].map((n) => (
                    <option key={n} value={n}>
                      {n}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <button onClick={() => move(-step, 0)} className="rounded-full border border-white/10 py-2 hover:bg-white/5">
                  ← X
                </button>
                <button onClick={() => move(0, -step)} className="rounded-full border border-white/10 py-2 hover:bg-white/5">
                  ↑ Y
                </button>
                <button onClick={() => move(step, 0)} className="rounded-full border border-white/10 py-2 hover:bg-white/5">
                  X →
                </button>
                <button onClick={() => move(0, step)} className="col-span-3 rounded-full border border-white/10 py-2 hover:bg-white/5">
                  ↓ Y (descer)
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Imagem (ex.: /imgs/01-Homem.jpg)"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Texto do prompt (será bloqueado para não compradores)"
                className="h-40 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                Ativo (mostrar no catálogo)
              </label>

              <button onClick={create} className="w-full rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
                Criar
              </button>

              {status ? <div className="text-sm text-rose-300 whitespace-pre-wrap">{status}</div> : null}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Lista</div>
              <div className="text-xs text-white/60">{items.length} itens</div>
            </div>

            <div className="mt-4 space-y-2">
              {items.length === 0 ? (
                <div className="text-white/60 text-sm">Nenhum item ainda.</div>
              ) : (
                items.map((it) => (
                  <div key={it.id} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-white/50">{it.category}</div>
                    </div>
                    <div className="text-xs text-white/50 mt-1">{it.imageUrl}</div>
                    <div className="text-xs text-white/50 mt-1">
                      foco: {Math.round(it.focusX)}% {Math.round(it.focusY)}% • {it.isPublished ? "ativo" : "oculto"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-white/60 hover:text-white">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </main>
  );
}