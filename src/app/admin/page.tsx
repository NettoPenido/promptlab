"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("ADMIN_SECRET") || "";
    setSecret(s);
  }, []);

  function saveSecret(v: string) {
    setSecret(v);
    localStorage.setItem("ADMIN_SECRET", v);
  }

  async function create() {
    setStatus("");

    const res = await fetch("/api/admin/prompts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({
        title,
        category: "homens",
        imageUrl,
        prompt,
        focusX: 50,
        focusY: 25,
        isActive: true,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus(data?.error || "Erro");
      return;
    }

    setStatus("Criado ✅");
    setTitle("");
    setImageUrl("");
    setPrompt("");
  }

  return (
    <main style={{ padding: 40, color: "white", background: "black", minHeight: "100vh" }}>
      <h1>Admin Prompts</h1>

      <input
        placeholder="ADMIN_SECRET"
        value={secret}
        onChange={(e) => saveSecret(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="/imgs/x.jpg"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <br /><br />

      <button onClick={create}>Criar</button>

      <div>{status}</div>
    </main>
  );
}