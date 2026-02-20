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
  title: string;
  category: string;
  imageUrl: string;
  focusX: number;
  focusY: number;
  prompt: string;
  isPublished: boolean;
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
  const [status, setStatus] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("ADMIN_SECRET") || "";
    if (s) setAdminSecret(s);
  }, []);

  function saveSecret(v: string) {
    setAdminSecret(v);
    localStorage.setItem("ADMIN_SECRET", v);
  }

  async function refresh() {
    try {
      const res = await fetch("/api/admin/prompts", {
        headers: { "x-admin-secret": adminSecret },
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch {}
  }

  function clamp(n: number) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  function move(dx: number, dy: number) {
    setFocusX((v) => clamp(v + dx));
    setFocusY((v) => clamp(v + dy));
  }

  async function create() {
    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          prompt,
          isPublished,
          focusX,
          focusY,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setStatus("Criado ✅");
      refresh();
    } catch (e: any) {
      setStatus(e.message);
    }
  }

  const previewStyle = useMemo(
    () => ({
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: `${focusX}% ${focusY}%`,
    }),
    [imageUrl, focusX, focusY]
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">Dashboard de Prompts</h1>

      <input
        value={adminSecret}
        onChange={(e) => saveSecret(e.target.value)}
        placeholder="ADMIN_SECRET"
        className="mb-6 p-2 bg-black border"
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="aspect-video border mb-3" style={previewStyle} />

          <div className="flex gap-2 mb-3">
            <button onClick={() => move(-step, 0)}>←</button>
            <button onClick={() => move(0, -step)}>↑</button>
            <button onClick={() => move(step, 0)}>→</button>
            <button onClick={() => move(0, step)}>↓</button>
          </div>

          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="w-full mb-2 p-2 bg-black border" />
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/imgs/x.jpg" className="w-full mb-2 p-2 bg-black border" />
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-32 mb-2 p-2 bg-black border" />

          <button onClick={create} className="bg-white text-black px-6 py-2">Criar</button>

          {status && <div className="mt-2 text-red-400">{status}</div>}
        </div>

        <div>
          {items.map((i) => (
            <div key={i.id} className="border p-2 mb-2">
              {i.title}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}