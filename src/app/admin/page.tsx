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
        headers: adminSecret ? { "x-admin-secret": adminSecret } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.items);
    } catch (e: any) {
      setStatus(e.message);
    }
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
          focusX,
          focusY,
          isPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTitle("");
      setImageUrl("");
      setPrompt("");
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
      <h1 className="text-3xl mb-6">Admin Prompts</h1>

      <input
        value={adminSecret}
        onChange={(e) => saveSecret(e.target.value)}
        placeholder="ADMIN_SECRET"
        className="mb-4 p-2 bg-black border border-white/20"
      />

      <div className="h-48 mb-4" style={previewStyle} />

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" />
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/imgs/x.jpg" />
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />

      <button onClick={create}>Criar</button>

      {status && <div className="text-red-400">{status}</div>}

      <div className="mt-6">
        {items.map((i) => (
          <div key={i.id}>{i.title}</div>
        ))}
      </div>

      <Link href="/">Voltar</Link>
    </main>
  );
}