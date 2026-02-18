import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, PROMPTS, SITE } from "@/content/prompts";

function Glow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="absolute top-40 left-10 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="absolute top-60 right-10 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
    </div>
  );
}

function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="mb-6">
      <div className="text-xs tracking-[0.35em] text-white/60">{kicker}</div>
      <h2 className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      {desc ? <p className="mt-2 text-white/60 max-w-2xl">{desc}</p> : null}
    </div>
  );
}

export default function Home() {
  const showcase = PROMPTS.slice(0, 12);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="relative">
        <Glow />

        <header className="relative mx-auto max-w-6xl px-4 pt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="text-sm text-white/70">{SITE.tagline}</div>
              <div className="text-xl font-semibold">{SITE.brand}</div>
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
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="hidden sm:inline-flex rounded-full border border-white/15 px-5 py-2 text-sm font-medium hover:bg-white/5"
              >
                Contato
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-4 pt-10 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70">
                🔒 Cofre privado de prompts
              </div>

              <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
                {SITE.brand} <span className="text-white/70">—</span> {SITE.tagline}
              </h1>
              <p className="mt-4 text-white/70 max-w-xl">{SITE.slogan}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={SITE.hotmartUrl}
                  target="_blank"
                  className="rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90"
                >
                  Acessar o Cofre (Hotmart)
                </a>
                <Link
                  href="#categorias"
                  className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
                >
                  Ver categorias
                </Link>
              </div>

              <div className="mt-6 flex gap-6 text-xs text-white/60">
                <div>✅ Galeria organizada</div>
                <div>✅ Copy 1-clique</div>
                <div>✅ Prompt protegido 🔒</div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 via-transparent to-cyan-400/10" />
              <div className="relative p-4">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black">
                  <Image
                    src="/hero.svg"
                    alt="Prompt Lab hero"
                    fill
                    className="object-cover opacity-95"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {showcase.slice(0, 3).map((it) => (
                    <div
                      key={it.id}
                      className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 bg-black"
                    >
                      <Image src={it.image} alt={it.title} fill className="object-cover" sizes="20vw" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Categorias */}
      <section id="categorias" className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle
          kicker="CATEGORIAS"
          title="Escolha seu cofre"
          desc="Quatro coleções principais. Dentro de cada uma: galeria de imagens + prompt (desbloqueia automaticamente após pagamento aprovado)."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/categoria/${c.key}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <div className="text-xl font-semibold">{c.label}</div>
              <div className="text-white/60 text-sm mt-2">{c.desc}</div>
              <div className="mt-6 text-sm text-white/70 group-hover:text-white">Abrir →</div>
            </Link>
          ))}
        </div>
      </section>

      
      {/* Ferramentas (atalhos) */}
      <section id="ferramentas" className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          kicker="FERRAMENTAS"
          title="Geradores recomendados (aceitam foto + prompt)"
          desc="Atalhos para IA’s onde seu cliente pode enviar a própria foto e aplicar o prompt. Não somos afiliados — confira requisitos e termos em cada plataforma."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              name: "ChatGPT",
              href: "https://chatgpt.com/",
              note: "Imagem + prompt",
              domain: "chatgpt.com",
            },
            {
              name: "Gemini (NanoBanana Pro)",
              href: "https://gemini.google.com/",
              note: "Imagem + prompt",
              domain: "gemini.google.com",
            },
            {
              name: "Leonardo AI",
              href: "https://leonardo.ai/",
              note: "Image-to-image",
              domain: "leonardo.ai",
            },
            {
              name: "Adobe Firefly",
              href: "https://firefly.adobe.com/",
              note: "Referência/edição",
              domain: "firefly.adobe.com",
            },
            {
              name: "Midjourney",
              href: "https://www.midjourney.com/",
              note: "Image prompt",
              domain: "midjourney.com",
            },
          ].map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border border-white/10 bg-black/40 grid place-items-center overflow-hidden">
                  {/* favicon proxy (evita precisar de assets locais) */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${t.domain}&sz=64`}
                    alt={`${t.name} logo`}
                    className="h-6 w-6"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold leading-tight">{t.name}</div>
                  <div className="text-xs text-white/60">{t.note}</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-white/70 group-hover:text-white">
                Abrir →
              </div>
            </a>
          ))}
        </div>
      </section>

{/* Vitrine */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <SectionTitle
          kicker="VITRINE"
          title="Preview da biblioteca"
          desc="Um mosaico do conteúdo. Você pode cadastrar quantos itens quiser por categoria no arquivo src/content/prompts.ts."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {showcase.map((it) => (
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
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/25 to-transparent">
                <div className="text-sm font-medium">{it.title}</div>
                <div className="text-xs text-white/60">{it.category.toUpperCase()}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle
          kicker="COMO FUNCIONA"
          title="3 passos"
          desc="Escolha, copie, gere. O prompt fica protegido e desbloqueia automaticamente após pagamento aprovado via Hotmart Webhook."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { t: "1) Escolha uma categoria", d: "HOMENS, MULHERES, INFANTIS ou PUBLICIDADE." },
            { t: "2) Abra um item", d: "Veja a imagem e o botão de copiar o prompt." },
            { t: "3) Copie e use", d: "Cole na IA preferida do cliente (Nano Banana, Midjourney, etc.)." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-lg font-semibold">{x.t}</div>
              <p className="text-white/60 mt-2 text-sm">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <SectionTitle kicker="FAQ" title="Dúvidas rápidas" />

        <div className="space-y-3">
          {[
            {
              q: "O prompt fica visível para todo mundo?",
              a: "As imagens ficam visíveis. O prompt fica protegido com cadeado e desbloqueia quando o acesso for validado.",
            },
            {
              q: "Como o desbloqueio funciona?",
              a: "Após o pagamento aprovado na Hotmart, um webhook registra seu e-mail como ativo. Depois, você entra em ‘Já comprei’ e libera com seu e-mail.",
            },
            {
              q: "Posso usar em qualquer IA?",
              a: "Sim. Você copia e cola no gerador de preferência do cliente (desde que aceite prompt).",
            },
          ].map((item) => (
            <details key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <summary className="cursor-pointer select-none font-medium">{item.q}</summary>
              <p className="mt-2 text-white/60 text-sm">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={SITE.hotmartUrl}
            target="_blank"
            className="rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:opacity-90"
          >
            Comprar acesso
          </a>
          <Link
            href="/acessar"
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
          >
            Já comprei — liberar
          </Link>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold hover:bg-white/5"
          >
            Falar no email
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-4 text-white/50 text-sm flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {SITE.brand} — {SITE.tagline}
          </div>
          <div>
            Contato: <a className="text-white/70 hover:text-white" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
