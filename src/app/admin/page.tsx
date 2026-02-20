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
    setAdminSecret(s);
  }, []);

  function saveSecret(v: string) {
    setAdminSecret(v);
    localStorage.setItem("ADMIN_SECRET", v);
  }

  async function refresh() {
    try {
      const res = await fetch("/api/admin/prompts", {
        headers: { "x-admin-secret": adminSecret },
        cache: "no-store",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems(data.items || []);
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
      setPrompt("");
      setImageUrl("");
      refresh();
      setStatus("Criado ✅");
    } catch (e: any) {
      setStatus(e.message);
    }
  }

  const previewStyle = useMemo(
    () => ({
      backgroundImage: imageUrl ? `url(${imageUrl})` : "",
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
        className="border p-2 mb-4 text-black"
      />

      <div className="h-48 mb-4 rounded overflow-hidden" style={previewStyle} />

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="border p-2 mb-2 text-black w-full"
      />

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="/imgs/x.jpg"
        className="border p-2 mb-2 text-black w-full"
      />

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt"
        className="border p-2 mb-2 text-black w-full"
      />

      <button onClick={create} className="bg-white text-black px-4 py-2">
        Criar
      </button>

      <div className="mt-6">{status}</div>

      <button onClick={refresh} className="mt-4 underline">
        Atualizar lista
      </button>

      <div className="mt-4">
        {items.map((i) => (
          <div key={i.id}>{i.title}</div>
        ))}
      </div>

      <Link href="/" className="block mt-10 underline">
        Voltar
      </Link>
    </main>
  );
}