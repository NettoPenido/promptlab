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
  isActive: boolean; // vem mapeado do prisma (@map isPublished)
  sortOrder: number;
  fitMode?: FitMode;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState("");

  // form (novo)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("homens");
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>("cover");

  // focus (novo)
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(25);
  const [step, setStep] = useState(5);

  // list + reorder
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<string>("");

  // edit modal
  const [editing, setEditing] = useState<Item | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("homens");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editPrompt, setEditPrompt] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editFitMode, setEditFitMode] = useState<FitMode>("cover");
  const [editFocusX, setEditFocusX] = useState(50);
  const [editFocusY, setEditFocusY] = useState(25);

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
          isActive,
          focusX,
          focusY,
          fitMode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setTitle("");
      setImageUrl("");
      setPrompt("");
      setIsActive(true);
      setFitMode("cover");
      setFocusX(50);
      setFocusY(25);

      await refresh();
      setStatus("Criado ✅");
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
      if (!adminSecret.trim()) {
        setStatus("Cole o ADMIN_SECRET (obrigatório).");
        return;
      }

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

  // ===== EDITAR =====
  function openEdit(it: Item) {
    setEditing(it);
    setEditTitle(it.title || "");
    setEditCategory(it.category || "homens");
    setEditImageUrl(it.imageUrl || "");
    setEditPrompt(it.prompt || "");
    setEditIsActive(Boolean(it.isActive));
    setEditFitMode((it.fitMode as FitMode) || "cover");
    setEditFocusX(Number.isFinite(Number(it.focusX)) ? Math.round(Number(it.focusX)) : 50);
    setEditFocusY(Number.isFinite(Number(it.focusY)) ? Math.round(Number(it.focusY)) : 25);
  }

  function closeEdit() {
    setEditing(null);
  }

  async function saveEdit() {
    setStatus("");
    try {
      if (!editing) return;
      if (!adminSecret.trim()) {
        setStatus("Cole o ADMIN_SECRET (obrigatório).");
        return;
      }

      const res = await fetch(`/api/admin/prompts/${editing.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
          imageUrl: editImageUrl,
          prompt: editPrompt,
          isActive: editIsActive,
          focusX: editFocusX,
          focusY: editFocusY,
          fitMode: editFitMode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      await refresh();
      closeEdit();
      setStatus("Editado ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  async function autoFrameEdit(mode: FitMode) {
    setStatus("");
    try {
      if (!editing) return;
      if (!adminSecret.trim()) {
        setStatus("Cole o ADMIN_SECRET (obrigatório).");
        return;
      }

      const res = await fetch(`/api/admin/prompts/${editing.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret.trim(),
        },
        body: JSON.stringify({ autoFrame: true, mode }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      await refresh();
      setEditFocusX(50);
      setEditFocusY(50);
      setEditFitMode(mode);

      setStatus("Auto enquadrar aplicado ✅");
    } catch (e: any) {
      setStatus(e?.message || String(e));
    }
  }

  const previewStyle = useMemo(
    () => ({
      backgroundImage: imageUrl
        ? `url(${imageUrl})`
        : "linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
      backgroundSize: fitMode === "contain" ? "contain" : "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${focusX}% ${focusY}%`,
    }),
    [imageUrl, focusX, focusY, fitMode]
  );

  const editPreviewStyle = useMemo(
    () => ({
      backgroundImage: editImageUrl
        ? `url(${editImageUrl})`
        : "linear-gradient(135deg, rgba(255,255,255,.06), rgba(255,255,255,.02))",
      backgroundSize: editFitMode === "contain" ? "contain" : "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${editFocusX}% ${editFocusY}%`,
    }),
    [editImageUrl, editFocusX, editFocusY, editFitMode]
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.35em] text-white/60">ADMIN</div>
            <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">Dashboard de Prompts</h1>
            <p className="mt-2 text-white/60">
              Ordene itens com Topo/↑/↓ e clique “Salvar ordem”. Para enquadrar, use “Auto enquadrar” no Editar.
            </p>
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
          {/* LEFT: create */}
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
                  Foco: {focusX}% {focusY}% • {fitMode}
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

                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-white/60">Modo</span>
                  <select
                    value={fitMode}
                    onChange={(e) => setFitMode((e.target.value as FitMode) || "cover")}
                    className="rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm"
                  >
                    <option value="cover">cover</option>
                    <option value="contain">contain</option>
                  </select>
                </div>
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

              <button
                onClick={create}
                className="w-full rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
              >
                Criar
              </button>

              {status ? <div className="text-sm text-rose-300 whitespace-pre-wrap">{status}</div> : null}
            </div>
          </section>

          {/* RIGHT: list + ordering */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Lista (ordem do catálogo)</div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-white/60">{items.length} itens</div>
                <button
                  onClick={saveOrder}
                  className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90"
                >
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
                          {it.category} • {it.isActive ? "ativo" : "oculto"} • {(it.fitMode as any) || "cover"}
                        </div>
                        <div className="text-xs text-white/50 mt-1 truncate">{it.imageUrl}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => openEdit(it)}
                          className="rounded-full bg-white text-black px-3 py-1 text-xs font-semibold hover:opacity-90"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => toTop(idx)}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                        >
                          Topo
                        </button>
                        <button
                          onClick={() => up(idx)}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => down(idx)}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                        >
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

      {/* EDIT MODAL */}
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold">Editar</div>
              <button onClick={closeEdit} className="rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5">
                Fechar
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <div className="text-xs tracking-[0.35em] text-white/60 mb-2">PREVIEW</div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Preview</div>
                    <div className="text-xs text-white/50">
                      Foco: {editFocusX}% {editFocusY}% • {editFitMode}
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
                    <div className="aspect-[16/9]" style={editPreviewStyle} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => autoFrameEdit("contain")}
                      className="rounded-full bg-white text-black px-4 py-2 text-xs font-semibold hover:opacity-90"
                    >
                      Auto enquadrar (mostrar tudo)
                    </button>
                    <button
                      onClick={() => autoFrameEdit("cover")}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs hover:bg-white/5"
                    >
                      Auto enquadrar (preencher)
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="text-xs text-white/60">
                      Focus X
                      <input
                        type="number"
                        value={editFocusX}
                        onChange={(e) => setEditFocusX(clamp(parseInt(e.target.value || "0", 10)))}
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="text-xs text-white/60">
                      Focus Y
                      <input
                        type="number"
                        value={editFocusY}
                        onChange={(e) => setEditFocusY(clamp(parseInt(e.target.value || "0", 10)))}
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs text-white/60">
                      Fit mode
                      <select
                        value={editFitMode}
                        onChange={(e) => setEditFitMode((e.target.value as FitMode) || "cover")}
                        className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
                      >
                        <option value="cover">cover</option>
                        <option value="contain">contain</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                />

                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <input
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="Imagem (ex.: /imgs/01-Homem.jpg)"
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                />

                <textarea
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Texto do prompt"
                  className="h-48 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                />

                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                  Ativo (mostrar no catálogo)
                </label>

                <button
                  onClick={saveEdit}
                  className="w-full rounded-2xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
                >
                  Salvar edição
                </button>
              </div>
            </div>

            {status ? <div className="mt-4 text-sm text-rose-300 whitespace-pre-wrap">{status}</div> : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
