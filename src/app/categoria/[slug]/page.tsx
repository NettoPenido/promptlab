import Link from "next/link";
import { CATEGORIES, SITE } from "@/content/prompts";
import CategoryGridClient from "@/components/CategoryGridClient";
import { getPromptItemsByCategory } from "@/lib/promptsData";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(String(raw || "")).trim().toLowerCase();

  // if empty, show categories (no redirect loop)
  if (!slug) {
    return (
      <main className="min-h-screen bg-black text-white">
        <header className="mx-auto max-w-6xl px-4 py-10 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.35em] text-white/60">CATEGORIAS</div>
            <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">Escolha uma categoria</h1>
            <p className="mt-2 text-white/60 max-w-2xl">Selecione uma categoria abaixo.</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={SITE.hotmartUrl} target="_blank" className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90">
              Comprar acesso
            </a>
            <Link href="/acessar" className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5">
              Já comprei
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/categoria/${cat.key}`}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <div className="text-xs tracking-[0.35em] text-white/50">ABRIR</div>
                <div className="mt-2 text-xl font-semibold">{cat.label}</div>
                <div className="mt-2 text-white/60 text-sm">{cat.desc}</div>
                <div className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">Ver prompts →</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === slug);
  if (!cat) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-4">
        <div className="text-center">
          <div className="text-xl font-semibold">Categoria inválida</div>
          <div className="mt-2 text-white/60 text-sm">Slug recebido: <span className="text-white/80">{slug || "(vazio)"}</span></div>
          <Link href="/" className="text-white/70 hover:text-white mt-3 inline-block">Voltar para a Home</Link>
        </div>
      </main>
    );
  }

  const items = await getPromptItemsByCategory(cat.key);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">← Home</Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">{cat.label}</span>
        </div>

        <div className="flex items-center gap-2">
          <a href={SITE.hotmartUrl} target="_blank" className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90">
            Comprar acesso
          </a>
          <Link href="/acessar" className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5">
            Já comprei
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="text-xs tracking-[0.35em] text-white/60">CATEGORIA</div>
        <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">{cat.label}</h1>
        <p className="mt-2 text-white/60 max-w-2xl">{cat.desc}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/60">
            Ainda não há itens nesta categoria.
          </div>
        ) : (
          <CategoryGridClient items={items as any} />
        )}
      </section>
    </main>
  );
}
