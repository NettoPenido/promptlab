import Image from "next/image";
import Link from "next/link";
import { PROMPTS, SITE } from "@/content/prompts";
import PromptCopyCard from "@/components/PromptCopyCard";

export default function PromptPage({ params }: { params: { id: string } }) {
  const item = PROMPTS.find((p) => p.id === params.id);

  if (!item) {
    return (
      <main className="min-h-screen bg-black text-white grid place-items-center px-4">
        <div className="text-center">
          <div className="text-xl font-semibold">Item não encontrado</div>
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
        <Link href={`/categoria/${item.category}`} className="text-white/70 hover:text-white">
          ← Voltar para {item.category.toUpperCase()}
        </Link>

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

      <section className="mx-auto max-w-6xl px-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Imagem de demonstração */}
        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="relative aspect-[4/5] bg-black">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover opacity-95"
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={70}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs tracking-[0.35em] text-white/60">PROMPT</div>
            <h1 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">{item.title}</h1>
            <p className="mt-2 text-white/60">
              Categoria: <span className="text-white">{item.category.toUpperCase()}</span>
            </p>
          </div>

          <PromptCopyCard prompt={item.prompt} />

          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.hotmartUrl}
              target="_blank"
              className="rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90"
            >
              Comprar acesso
            </a>
            <a
              href={`mailto:${SITE.contactEmail}`}
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
            >
              Falar no email
            </a>
          </div>

          <div className="text-xs text-white/50">
            Dica: após liberar o acesso, use “Copiar” e cole na IA de preferência do cliente.
          </div>
        </div>
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
