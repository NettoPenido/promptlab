"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PromptItem = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  image: string;
  imageFocus: string;
  isActive: boolean;
  updatedAt: string;
};

const CATS = [
  { key: "homens", label: "Homens" },
  { key: "mulheres", label: "Mulheres" },
  { key: "infantis", label: "Infantis" },
  { key: "publicidade", label: "Publicidade" },
];

const FOCUS_PRESETS = [
  { key: "50% 25%", label: "Topo (Netflix)" },
  { key: "50% 15%", label: "Topo forte (rostos)" },
  { key: "50% 50%", label: "Centro" },
  { key: "50% 70%", label: "Baixo" },
  { key: "30% 50%", label: "Esquerda" },
  { key: "70% 50%", label: "Direita" },
];

function parseFocus(input: string): { x: number; y: number } {
  const s = String(input || "").trim();
  const m = s.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
  if (!m) return { x: 50, y: 25 };
  return { x: Number(m[1]), y: Number(m[2]) };
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function fmtFocus(x: number, y: number) {
  const xx = clamp(Math.round(x * 10) / 10, 0, 100);
  const yy = clamp(Math.round(y * 10) / 10, 0, 100);
  return `${xx}% ${yy}%`;
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);

  const [items, setItems] = useState<PromptItem[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [step, setStep] = useState(5);

  const [form, setForm] = useState({
    id: "",
    title: "",
    category: "homens",
    image: "",
    imageFocus: "50% 25%",
    prompt: "",
    isActive: true,
  });

  const focusLabel = useMemo(() => {
    return FOCUS_PRESETS.find((p) => p.key === form.imageFocus)?.label || "Personalizado";
  }, [form.imageFocus]);

  const focusXY = useMemo(() => parseFocus(form.imageFocus), [form.imageFocus]);

  useEffect(() => {
    const s = localStorage.getItem("ADMIN_SECRET") || "";
    if (s) {
      setSecret(s);
      setAuthed(true);
    }
  }, []);

  async function fetchItems() {
    setErr(null);
    setLoading(true);
    try {
      const url = new URL("/api/admin/prompts", window.location.origin);
      if (q.trim()) url.searchParams.set("q", q.trim());
      if (category) url.searchParams.set("category", category);

      const res = await fetch(url.toString(), {
        headers: { "x-admin-secret": secret },
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao carregar");
      setItems(data.items || []);
    } catch (e: any) {
      setErr(e.message || "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authed) fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  function saveSecret() {
    if (!secret.trim()) return;
    localStorage.setItem("ADMIN_SECRET", secret.trim());
    setAuthed(true);
  }

  function logout() {
    localStorage.removeItem("ADMIN_SECRET");
    setAuthed(false);
    setItems([]);
  }

  function nudge(dx: number, dy: number) {
    const { x, y } = focusXY;
    const nx = clamp(x + dx, 0, 100);
    const ny = clamp(y + dy, 0, 100);
    setForm((s) => ({ ...s, imageFocus: fmtFocus(nx, ny) }));
  }

  async function createItem() {
    setErr(null);
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          prompt: form.prompt,
          image: form.image,
          imageFocus: form.imageFocus,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao criar");
      setForm({ id: "", title: "", category: "homens", image: "", imageFocus: "50% 25%", prompt: "", isActive: true });
      await fetchItems();
    } catch (e: any) {
      setErr(e.message || "Erro");
    }
  }

  async function updateItem() {
    setErr(null);
    try {
      const res = await fetch(`/api/admin/prompts/${form.id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": secret,
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          prompt: form.prompt,
          image: form.image,
          imageFocus: form.imageFocus,
          isActive: form.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao atualizar");
      setForm({ id: "", title: "", category: "homens", image: "", imageFocus: "50% 25%", prompt: "", isActive: true });
      await fetchItems();
    } catch (e: any) {
      setErr(e.message || "Erro");
    }
  }

  async function del(id: string) {
    if (!confirm("Excluir este prompt?")) return;
    setErr(null);
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erro ao excluir");
      await fetchItems();
    } catch (e: any) {
      setErr(e.message || "Erro");
    }
  }

  function edit(it: PromptItem) {
    setForm({
      id: it.id,
      title: it.title,
      category: it.category,
      image: it.image,
      imageFocus: it.imageFocus || "50% 25%",
      prompt: it.prompt,
      isActive: it.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs tracking-[0.35em] text-white/60">ADMIN</div>
          <h1 className="mt-2 text-2xl font-semibold">Painel PromptLab</h1>
          <p className="mt-2 text-sm text-white/60">Digite sua senha admin (ADMIN_SECRET).</p>

          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="password"
            placeholder="ADMIN_SECRET"
            className="mt-5 w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
          />

          <button
            onClick={saveSecret}
            className="mt-4 w-full rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
          >
            Entrar
          </button>

          <div className="mt-4 text-xs text-white/50">Dica: a senha fica salva só neste navegador.</div>

          <div className="mt-4">
            <Link href="/" className="text-white/70 hover:text-white text-sm">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const previewSrc = form.image?.trim() ? form.image.trim() : "/imgs/placeholder.jpg";

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between gap-4">
        <div>
          <div className="text-xs tracking-[0.35em] text-white/60">ADMIN</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Dashboard de Prompts</h1>
          <p className="mt-2 text-white/60 text-sm">
            Preview + botões de foco (sem adivinhar %).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchItems}
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5"
          >
            Recarregar
          </button>
          <button
            onClick={logout}
            className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-10 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold">{form.id ? "Editar prompt" : "Novo prompt"}</div>

          {/* Preview */}
          <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="text-xs tracking-[0.35em] text-white/50">PREVIEW DO CARD</div>
              <div className="text-xs text-white/60">
                Foco atual: <span className="text-white/80">{form.imageFocus}</span>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={previewSrc}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: form.imageFocus,
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.12), transparent)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    transform: "translate(-50%, -50%)",
                    border: "2px solid rgba(255,255,255,0.75)",
                    boxShadow: "0 0 0 8px rgba(0,0,0,0.25)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-center">
                <div className="text-xs text-white/60">
                  Ajuste com os botões até o enquadramento ficar perfeito (tipo Netflix). Depois clique em{" "}
                  <span className="text-white/80">{form.id ? "Salvar" : "Criar"}</span>.
                </div>

                <div className="flex items-center gap-2 justify-start md:justify-end">
                  <div className="text-xs text-white/50 mr-1">Passo</div>
                  <select
                    value={step}
                    onChange={(e) => setStep(Number(e.target.value))}
                    className="rounded-xl bg-black/40 border border-white/15 px-3 py-2 text-xs text-white outline-none focus:border-white/30"
                  >
                    <option value={1}>1%</option>
                    <option value={3}>3%</option>
                    <option value={5}>5%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 max-w-[360px]">
                <button
                  onClick={() => nudge(-step, 0)}
                  className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold hover:bg-white/5"
                  title="Mover foco para a esquerda"
                >
                  ← X
                </button>
                <button
                  onClick={() => nudge(0, -step)}
                  className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold hover:bg-white/5"
                  title="Mover foco para cima (mostrar mais rosto)"
                >
                  ↑ Y
                </button>
                <button
                  onClick={() => nudge(step, 0)}
                  className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold hover:bg-white/5"
                  title="Mover foco para a direita"
                >
                  X →
                </button>
                <button
                  onClick={() => nudge(0, step)}
                  className="col-span-3 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold hover:bg-white/5"
                  title="Mover foco para baixo"
                >
                  ↓ Y (descer)
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
              placeholder="Título"
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <select
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
            >
              {CATS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>

            <input
              value={form.image}
              onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
              placeholder="Imagem (ex.: /imgs/01-homem.jpg)"
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs tracking-[0.35em] text-white/50">FOCO DA IMAGEM</div>
              <div className="mt-2 text-sm text-white/70">
                Preset rápido ou personalizado. Atual: <span className="text-white/90">{focusLabel}</span>
              </div>

              <div className="mt-3 grid gap-2">
                <select
                  value={FOCUS_PRESETS.some((p) => p.key === form.imageFocus) ? form.imageFocus : "custom"}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === "custom") return;
                    setForm((s) => ({ ...s, imageFocus: v }));
                  }}
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
                >
                  {FOCUS_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label}
                    </option>
                  ))}
                  <option value="custom">Personalizado…</option>
                </select>

                <input
                  value={form.imageFocus}
                  onChange={(e) => setForm((s) => ({ ...s, imageFocus: e.target.value }))}
                  placeholder='Ex.: "50% 20%" (x y)'
                  className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
                />

                <div className="text-xs text-white/50">
                  Dica: quanto menor o Y, mais “topo/rosto” aparece. Ex.: 15%–25%.
                </div>
              </div>
            </div>

            <textarea
              value={form.prompt}
              onChange={(e) => setForm((s) => ({ ...s, prompt: e.target.value }))}
              placeholder="Texto do prompt (será bloqueado para não compradores)"
              rows={10}
              className="w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-white outline-none focus:border-white/30"
            />

            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
              />
              Ativo (mostrar no catálogo)
            </label>

            <div className="flex gap-2">
              {form.id ? (
                <>
                  <button
                    onClick={updateItem}
                    className="flex-1 rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() =>
                      setForm({
                        id: "",
                        title: "",
                        category: "homens",
                        image: "",
                        imageFocus: "50% 25%",
                        prompt: "",
                        isActive: true,
                      })
                    }
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <button
                  onClick={createItem}
                  className="w-full rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
                >
                  Criar
                </button>
              )}
            </div>

            {err ? <div className="text-sm text-red-300">{err}</div> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm font-semibold">Lista</div>

            <div className="flex flex-wrap gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar..."
                className="rounded-xl bg-black/40 border border-white/15 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl bg-black/40 border border-white/15 px-4 py-2 text-sm text-white outline-none focus:border-white/30"
              >
                <option value="">Todas</option>
                {CATS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchItems}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/5"
              >
                Filtrar
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {loading ? (
              <div className="text-sm text-white/60">Carregando...</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-white/60">Nenhum item ainda.</div>
            ) : (
              items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">
                        {it.title} <span className="ml-2 text-xs text-white/50">({it.category})</span>
                        {!it.isActive ? <span className="ml-2 text-xs text-red-200/80">inativo</span> : null}
                      </div>
                      <div className="mt-1 text-xs text-white/50 break-all">{it.image}</div>
                      <div className="mt-1 text-xs text-white/50">Foco: {it.imageFocus || "50% 25%"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => edit(it)}
                        className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/5"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => del(it.id)}
                        className="rounded-xl border border-red-400/30 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 line-clamp-2 text-xs text-white/70 whitespace-pre-wrap">{it.prompt}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-white/50 text-sm flex items-center justify-between">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Voltar ao site
          </Link>
          <div className="text-xs text-white/40">/admin</div>
        </div>
      </footer>
    </main>
  );
}
