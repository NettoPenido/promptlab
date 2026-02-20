"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { key: "homens", label: "Homens" },
  { key: "mulheres", label: "Mulheres" },
  { key: "infantis", label: "Infantis" },
  { key: "publicidade", label: "Publicidade" },
];

type FitMode = "cover" | "contain";

type Item = {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  focusX: number;
  focusY: number;
  prompt: string;
  isActive: boolean;
  sortOrder: number;
  fitMode?: FitMode;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");

  // form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("homens");
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>("cover");

  // focus
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(25);
  const [step, setStep] = useState(5);

  // list
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

  function clamp(n: number) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }
  function move(dx: number, dy: number) {
    setFocusX((v) => clamp(v + dx));
    setFocusY((v) => clamp(v + dy));
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCategory("homens");
    setImageUrl("");
    setPrompt("");
    setIsActive(true);
    setFitMode("cover");
    setFocusX(50);
    setFocusY(25);
  }

  function startEdit(it: Item) {
    setEditingId(it.id);
    setTitle(it.title || "");
    setCategory(it.category || "homens");
    setImageUrl(it.imageUrl || "");
    setPrompt(it.prompt || "");
    setIsActive(Boolean(it.isActive));
    setFitMode((it.fitMode as FitMode) || "cover");
    setFocusX(Number.isFinite(Number(it.focusX)) ? Math.round(Number(it.focusX)) : 50);
    setFocusY(Number.isFinite(Number(it.focusY)) ? Math.round(Number(it.focusY)) : 25);
    setStatus("");
  }

  function autoEnquadrarLocal() {
    setFitMode("contain");
    setFocusX(50);
    setFocusY(50);
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

      const list: Item[] = (data.items || []).slice();
      list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      setItems(list);
    } catch (e: any) {
      setItems([]);
      setStatus(e?.message || String(e));
    }
  }

  useEffect(() => {
    if (adminSecret.trim()) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSecret]);

  async function create() {
    setStatus("");
    try {
      if (!adminSecret.trim()) return setStatus("Cole o ADMIN_SECRET (obrigatório).");

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
          isActive,
          focusX,
          focusY,
          fitMode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      resetForm();
      await refresh();
      setStatus("Criado ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  async function saveEdit() {
    setStatus("");
    try {
      if (!adminSecret.trim()) return setStatus("Cole o ADMIN_SECRET (obrigatório).");
      if (!editingId) return setStatus("Nenhum item em edição.");

      const res = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          id: editingId,
          title,
          category,
          imageUrl,
          prompt,
          isActive,
          focusX,
          focusY,
          fitMode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      await refresh();
      setStatus("Alterações salvas ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  async function autoEnquadrarSalvar() {
    setStatus("");
    try {
      if (!adminSecret.trim()) return setStatus("Cole o ADMIN_SECRET (obrigatório).");
      if (!editingId) return setStatus("Clique em Editar em um item primeiro.");

      // aplica local + salva
      setFitMode("contain");
      setFocusX(50);
      setFocusY(50);

      const res = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          id: editingId,
          fitMode: "contain",
          focusX: 50,
          focusY: 50,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      await refresh();
      setStatus("Auto enquadrado ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  // ===== ORDENAR (Topo / ↑ / ↓) =====
  function moveIndex(from: number, to: number) {
    setItems((prev) => {
      const arr = prev.slice();
      const item = arr[from];
      if (!item) return prev;
      arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  }
  function toTop(index: number) {
    if (index <= 0) return;
    moveIndex(index, 0);
  }
  function up(index: number) {
    if (index <= 0) return;
    moveIndex(index, index - 1);
  }
  function down(index: number) {
    if (index >= items.length - 1) return;
    moveIndex(index, index + 1);
  }

  async function saveOrder() {
    setStatus("");
    try {
      if (!adminSecret.trim()) return setStatus("Cole o ADMIN_SECRET (obrigatório).");

      const payload = items.map((it, idx) => ({ id: it.id, sortOrder: idx + 1 }));

      const res = await fetch("/api/admin/prompts", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({ items: payload }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      await refresh();
      setStatus("Ordem salva ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  const previewStyle = useMemo(
    () => ({
      backgroundImage: imageUrl
        ? `url(${imageUrl})`
        : "linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
      backgroundRepeat: "no-repeat",
      backgroundSize: fitMode === "contain" ? "contain" : "cover",
      backgroundPosition: `${focusX}% ${focusY}%`,
      backgroundColor: "rgba(0,0,0,0.35)",
    }),
    [imageUrl, focusX, focusY, fitMode]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.35em] text-white/60">ADMIN</div>
            <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">Dashboard de Prompts</h1>
            <p className="mt-2 text-white/60">Ordene itens e use “Auto enquadrar” (1 clique) quando quiser mostrar a imagem inteira.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={refresh} className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5">
              Recarregar
            </button>
            <Link href="/" className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90">
              Sair
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-sm font-semibold">{editingId ? "Editar prompt" : "Novo prompt"}</div>
              {editingId ? (
                <button onClick={resetForm} className="rounded-full border border-white/10 px-4 py-2 text-xs hover:bg-white/5">
                  Cancelar edição
                </button>
              ) : null}
            </div>

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
                  Foco: {focusX}% {focusY}% • fit: {fitMode}
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="aspect-[16/9]" style={previewStyle} />
              </div>

              <div className="mt-3 flex items-center gap-3 flex-wrap">
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

                <select
                  value={fitMode}
                  onChange={(e) => setFitMode(e.target.value as FitMode)}
                  className="rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
                  title="cover = Netflix padrão / contain = mostra tudo"
                >
                  <option value="cover">cover (Netflix)</option>
                  <option value="contain">contain (mostrar tudo)</option>
                </select>

                <button
                  onClick={autoEnquadrarLocal}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
                  title="Define contain + foco 50/50 (local)"
                >
                  Auto enquadrar (local)
                </button>

                <button
                  onClick={autoEnquadrarSalvar}
                  className="rounded-full bg-white text-black px-4 py-2 text-xs font-semibold hover:opacity-90"
                  title="Salva no banco (item em edição)"
                >
                  Auto enquadrar (SALVAR)
                </button>
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
                placeholder="Texto do prompt"
                className="h-40 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Ativo (mostrar no catálogo)
              </label>

              {editingId ? (
                <button onClick={saveEdit} className="w-full rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
                  Salvar alterações
                </button>
              ) : (
                <button onClick={create} className="w-full rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90">
                  Criar
                </button>
              )}

              {status ? <div className="text-sm text-rose-300 whitespace-pre-wrap">{status}</div> : null}
            </div>
          </section>

          {/* RIGHT */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Lista (ordem do catálogo)</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/60">{items.length} itens</div>
                <button onClick={saveOrder} className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90">
                  Salvar ordem
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {items.length === 0 ? (
                <div className="text-white/60 text-sm">Nenhum item ainda.</div>
              ) : (
                items.map((it, idx) => (
                  <div key={it.id} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {idx + 1}. {it.title}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          {it.category} • {it.isActive ? "ativo" : "oculto"} • fit: {(it.fitMode as any) || "cover"}
                        </div>
                        <div className="text-xs text-white/50 mt-1 truncate">{it.imageUrl}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => startEdit(it)} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5">
                          Editar
                        </button>

                        <button onClick={() => toTop(idx)} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5">
                          Topo
                        </button>
                        <button onClick={() => up(idx)} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5">
                          ↑
                        </button>
                        <button onClick={() => down(idx)} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5">
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {status ? <div className="mt-4 text-sm text-rose-300 whitespace-pre-wrap">{status}</div> : null}
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