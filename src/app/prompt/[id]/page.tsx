import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/content/prompts";
import { getPromptItemById } from "@/lib/promptsData";

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item: any = await getPromptItemById(id);

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

  const teaser =
    item.prompt.length > 220 ? item.prompt.slice(0, 220).trimEnd() + "..." : item.prompt;

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between gap-4">
        <Link href={`/categoria/${item.category}`} className="text-white/70 hover:text-white">
          ← Voltar para {String(item.category).toUpperCase()}
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
        {/* Imagem sempre visível */}
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
              Categoria: <span className="text-white">{String(item.category).toUpperCase()}</span>
            </p>
          </div>

          {/* Cadeado SOMENTE no texto do prompt */}
          <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="p-4 md:p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">🔒 Prompt bloqueado</div>
              <a
                href={SITE.hotmartUrl}
                target="_blank"
                className="rounded-full bg-white text-black px-4 py-2 text-xs font-semibold hover:opacity-90"
              >
                Comprar
              </a>
            </div>

            <div className="p-4 md:p-5 relative">
              <pre className="whitespace-pre-wrap text-sm text-white/70 select-none blur-sm">
                {teaser}
              </pre>

              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 backdrop-blur px-5 py-5 text-center">
                  <div className="text-base font-semibold">Acesso necessário</div>
                  <div className="mt-2 text-sm text-white/60">
                    A imagem é livre. O texto do prompt só desbloqueia após a compra.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <a
                      href={SITE.hotmartUrl}
                      target="_blank"
                      className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90"
                    >
                      Comprar acesso
                    </a>
                    <Link
                      href="/acessar"
                      className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5"
                    >
                      Já comprei (desbloquear)
                    </Link>
                  </div>

                  <div className="mt-3 text-xs text-white/50">
                    Após o desbloqueio, você poderá copiar o prompt completo.
                  </div>
                </div>
              </div>
            </div>
          </div>

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
            Dica: após liberar o acesso, use “Copiar” e cole na IA de preferência.
          </div>
        </div>
      </section>
    </main>
  );
}
