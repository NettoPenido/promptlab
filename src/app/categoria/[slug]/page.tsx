import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PROMPTS, SITE, type Category } from "@/content/prompts";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as Category;

  const cat = CATEGORIES.find((c) => c.key === slug);
  const items = PROMPTS.filter((p) => p.category === slug);

  if (!cat) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-4">
        <div className="text-center">
          <div className="text-xl font-semibold">Categoria inválida</div>
          <Link href="/" className="text-white/70 hover:text-white mt-3 inline-block">
            Voltar para a Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/70 hover:text-white">
            ← Home
          </Link>
          <span className="text-white/20">/</span>
          <span className="font-semibold">{cat.label}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={SITE.hotmartUrl}
            target="_blank"
            className="rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            Comprar acesso
          </a>
          <Link
            href="/acessar"
            className="rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5"
          >
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
            Ainda não há itens nesta categoria. Adicione no arquivo{" "}
            <code className="text-white">src/content/prompts.ts</code>.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((it) => (
              <Link
                key={it.id}
                href={`/prompt/${it.id}`}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={it.image}
                    alt={it.title}
                    fill
                    className="object-cover opacity-95 group-hover:scale-[1.02] transition"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/25 to-transparent">
                  <div className="text-sm font-medium leading-snug">{it.title}</div>
                  <div className="text-xs text-white/60 mt-0.5">
                    {it.tags?.slice(0, 3).join(" • ") ?? "Abrir prompt"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-white/50 text-sm flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {SITE.brand} — {SITE.tagline}
          </div>
          <div>
            Contato:{" "}
            <a className="text-white/70 hover:text-white" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
