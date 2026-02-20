"use client";

import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/content/prompts";

const TIKTOK_URL = "https://www.tiktok.com/@mundopromptia";

// ✅ Troque estes arquivos em /public quando quiser (mantendo o mesmo nome)
const HERO_IMAGE = "/hero-waldir-bmw.jpg";
const HERO_BG = "/hero-city-bg.jpg";

// ====== IAs (logos + links) ======
// Coloque os logos em /public/ias/ (PNG/SVG) com estes nomes (ou altere abaixo):
const AI_TOOLS = [
  { name: "ChatGPT", href: "https://chatgpt.com", logo: "/ias/chatgpt.png" },
  { name: "Gemini", href: "https://gemini.google.com", logo: "/ias/gemini.png" },
  { name: "Leonardo", href: "https://leonardo.ai", logo: "/ias/leonardo.png" },
  { name: "Midjourney", href: "https://www.midjourney.com", logo: "/ias/midjourney.png" },
  { name: "Adobe Firefly", href: "https://firefly.adobe.com", logo: "/ias/firefly.png" },
];

// (Opcional) ícone TikTok inline
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M30.5 7c1.5 5.7 5.2 9.4 10.9 10.9v7.3c-4.1.1-7.6-1.2-10.9-3.4V33c0 7.7-6.3 14-14 14S2.5 40.7 2.5 33s6.3-14 14-14c1.2 0 2.3.1 3.4.4v7.9c-1-.7-2.1-1.1-3.4-1.1-3.7 0-6.8 3-6.8 6.8 0 3.7 3 6.8 6.8 6.8 3.8 0 7-3 7-7V1h6.5c0 2 .2 4 .5 6Z"
        fill="currentColor"
      />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { delay: d, duration: 0.6 } }),
};

function AiRow() {
  return (
    <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-white/85">IAs compatíveis (foto + prompt)</div>
        <div className="text-xs text-white/55">Clique para abrir</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {AI_TOOLS.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80 hover:bg-white/5"
            title={t.name}
          >
            {/* usa <img> aqui para não depender do next/image para assets pequenos */}
            <img
              src={t.logo}
              alt={`${t.name} logo`}
              className="h-6 w-6 rounded-md object-contain bg-white/5 ring-1 ring-white/10"
              loading="lazy"
              onError={(e) => {
                // fallback visual caso o logo não exista
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="font-medium">{t.name}</span>
            <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-80" />
          </a>
        ))}
      </div>

      <div className="mt-3 text-xs text-white/55">
        Dica: abra a IA, envie sua foto e depois cole o prompt do Prompt Lab.
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060a] text-white">
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="absolute top-32 left-10 h-[440px] w-[440px] rounded-full bg-cyan-500/18 blur-[130px]" />
        <div className="absolute bottom-0 right-0 h-[620px] w-[620px] rounded-full bg-indigo-600/16 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.06),transparent_48%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.55),rgba(0,0,0,0.92))]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      {/* Top nav */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-white/90" />
          </span>
          <div className="leading-tight">
            <div className="text-sm text-white/70">{SITE.tagline}</div>
            <div className="text-lg font-semibold tracking-tight">{SITE.brand}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <a
            className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 hover:bg-white/10"
            href={TIKTOK_URL}
            target="_blank"
            rel="noreferrer"
            title="TikTok @mundopromptia"
          >
            <TikTokIcon className="h-4 w-4" />
            TikTok
            <ExternalLink className="h-4 w-4 opacity-60" />
          </a>

          {/* ✅ BOTÃO PREMIUM COM DESTAQUE (neon) */}
          <a
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black
                       shadow-[0_0_24px_rgba(16,255,120,0.35)] hover:bg-emerald-300"
            href={SITE.hotmartUrl}
            target="_blank"
            rel="noreferrer"
          >
            Comprar acesso premium <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-4 md:pb-16 md:pt-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm text-white/80 ring-1 ring-white/10">
              <Lock className="h-4 w-4" />
              Cofre privado de prompts • desbloqueio via Hotmart
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              {SITE.brand} — <span className="text-white/70">{SITE.tagline}</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {SITE.slogan} <br />
              <span className="text-white/90 font-medium">+1.000 prompts profissionais</span> organizados por categoria, com botão copiar.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* ✅ BOTÃO PREMIUM COM DESTAQUE (neon) */}
              <a
                href={SITE.hotmartUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black
                           shadow-[0_0_30px_rgba(16,255,120,0.35)] hover:bg-emerald-300"
              >
                COMPRAR ACESSO PREMIUM <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#categorias"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/7 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/12 hover:bg-white/10"
              >
                Ver categorias <Zap className="h-4 w-4" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
                <ShieldCheck className="h-4 w-4" /> Prompt protegido
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
                <Copy className="h-4 w-4" /> Copy 1-click
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-1 ring-1 ring-white/10">
                <ImageIcon className="h-4 w-4" /> Foto + prompt
              </span>
            </div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0.15} className="relative">
            <div className="relative overflow-hidden rounded-[28px] bg-white/6 ring-1 ring-white/12">
              {/* optional bg */}
              <div className="absolute inset-0 opacity-25">
                <Image src={HERO_BG} alt="" fill className="object-cover" />
              </div>

              {/* main image */}
              <div className="relative aspect-[16/10] md:aspect-[16/9]">
                <Image src={HERO_IMAGE} alt="Foto principal" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section id="categorias" className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="text-xs tracking-[0.4em] text-white/50">CATEGORIAS</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Escolha uma das opções</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
            Clique para abrir. Dentro: imagens + prompt com botão copiar. O prompt fica protegido e desbloqueia automaticamente após pagamento
            aprovado via Hotmart.
          </p>

          {/* ✅ (1) VOLTA AS IAs LOGO ABAIXO DE CATEGORIAS */}
          <AiRow />

          {/* ✅ (3) COPY PROMPT INDIVIDUAL R$ 4,99 (uma linha abaixo do enunciado) */}
          <div className="mt-6 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-semibold text-white/90">
                  Quer só 1 prompt específico?
                </div>
                <div className="mt-1 text-sm text-white/70">
                  Compre um prompt individual por <span className="text-white font-semibold">R$ 4,99</span>. Você solicita por email e eu te envio o prompt + a imagem correspondente.
                </div>
              </div>

              <a
                href={`mailto:${SITE.contactEmail}?subject=Quero%201%20prompt%20individual%20(R%24%204%2C99)&body=Olá%2C%20quero%20comprar%201%20prompt%20individual%20por%20R%24%204%2C99.%0A%0ACategoria%3A%20%0ATítulo%20ou%20descrição%3A%20%0A%0AImagem%20(referência%20ou%20ideia)%3A%20%0A%0AObrigado!`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-black
                           shadow-[0_0_28px_rgba(16,255,120,0.30)] hover:bg-emerald-300"
              >
                Solicitar por email <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-3 text-xs text-white/55">
              Obs.: o pacote Premium continua sendo o melhor custo-benefício para desbloquear tudo de uma vez.
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              slug: "homens",
              title: "HOMENS",
              subtitle: "Retratos, moda, lifestyle, cenas urbanas",
              accent: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/25",
              cover: "/prompts/homens/cover.jpg",
            },
            {
              slug: "mulheres",
              title: "MULHERES",
              subtitle: "Editorial, beleza, retratos e variações",
              accent: "bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-400/25",
              cover: "/prompts/mulheres/cover.jpg",
            },
            {
              slug: "infantis",
              title: "INFANTIS",
              subtitle: "Lúdico, storytelling, personagens e cenas",
              accent: "bg-amber-500/15 text-amber-200 ring-amber-400/25",
              cover: "/prompts/infantis/cover.jpg",
            },
            {
              slug: "publicidade",
              title: "PUBLICIDADE",
              subtitle: "Produto, anúncio, campanha e brand",
              accent: "bg-orange-500/15 text-orange-200 ring-orange-400/25",
              cover: "/prompts/publicidade/cover.jpg",
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_12px_70px_rgba(0,0,0,.45)] transition hover:border-white/18"
            >
              <div className="absolute inset-0">
                <Image
                  src={cat.cover}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-90 transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.82),rgba(0,0,0,.35),rgba(0,0,0,.10))]" />
                <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_55%)]" />
              </div>

              <div className="relative flex min-h-[260px] flex-col justify-end p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs tracking-[0.35em] text-white/55">CATEGORIA</div>
                    <div className="mt-2 text-xl font-semibold tracking-tight">{cat.title}</div>
                    <div className="mt-1 text-sm text-white/70">{cat.subtitle}</div>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                    Abrir <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-4 flex flex-nowrap items-center gap-2 overflow-hidden">
                  <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-[11px] font-medium ring-1 ${cat.accent}`}>
                    Imagens + Prompt
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                    Copiar 1-click
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75 ring-1 ring-white/10">
                    Prompt protegido
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ====== SEÇÕES QUE VOCÊ DISSE QUE SUMIRAM: MANTIDAS / VOLTANDO ====== */}

      {/* Criatividade / processo */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <Sparkles className="h-4 w-4" />
              CRIATIVIDADE
            </div>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              Seu processo criativo{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                nunca mais será o mesmo
              </span>
            </h2>
            <p className="mt-4 text-white/70 md:text-lg">
              A diferença entre quem cresce e quem trava está em saber usar as ferramentas certas — e ter prompts prontos,
              testados e organizados.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" /> Prompt protegido e desbloqueio via Hotmart
              </div>
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-cyan-300" /> Copiar 1-click (cliente cola na IA)
              </div>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-fuchsia-300" /> Foto + prompt (mantendo identidade visual)
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <Image
                src="/sections/waldir-processo.jpg"
                alt="Seu processo criativo"
                width={900}
                height={1200}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.20),transparent_35%),radial-gradient(circle_at_90%_30%,rgba(217,70,239,0.18),transparent_40%)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sobre você + LinkedIn */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-xs tracking-[0.4em] text-white/50">SOBRE</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Quem é o Engenheiro de Prompt{" "}
              <span className="bg-gradient-to-r from-fuchsia-300 via-white to-cyan-300 bg-clip-text text-transparent">
                Waldir Penido
              </span>
              ?
            </h2>
            <p className="mt-4 text-white/70 md:text-lg">
              Especialista em IA e Marketing Digital para Negócios | MBA em Engenharia de Prompt | Consultor Estratégico | Gestão de Tráfego |
              Automação | Performance e Escala
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/waldir-penido-528a7b6a/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-bold">in</span>
                LinkedIn <ExternalLink className="h-4 w-4" />
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                <TikTokIcon className="h-4 w-4" />
                TikTok <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <Image
                src="/sections/waldir-portrait.jpg"
                alt="Waldir Penido"
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,70,239,0.18),transparent_42%),radial-gradient(circle_at_90%_30%,rgba(34,211,238,0.16),transparent_45%)]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recuperação de fotos antigas + casal casamento */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-xs tracking-[0.4em] text-white/50">RECUPERAÇÃO</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Restaure fotos antigas com{" "}
              <span className="bg-gradient-to-r from-amber-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                alta fidelidade
              </span>
            </h2>
            <p className="mt-4 text-white/70 md:text-lg">
              Sabe aquela foto antiga da família, casamento, formatura… com baixa qualidade? Aqui você encontra prompts
              prontos para restaurar, colorizar e melhorar nitidez mantendo a identidade e os detalhes originais.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
              <div className="flex items-center gap-2 font-medium text-white/80">
                <Lock className="h-4 w-4 text-amber-200" /> Dica rápida (leigo)
              </div>
              <ol className="mt-3 list-decimal space-y-2 pl-5">
                <li>Abra sua IA (Gemini/ChatGPT/Leonardo/etc.).</li>
                <li>Envie a foto antiga (a imagem).</li>
                <li>Clique em <b>Copiar prompt</b> aqui no Prompt Lab e cole na IA.</li>
                <li>Gere e salve a versão restaurada.</li>
              </ol>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <Image
                src="/sections/recovery-wedding.jpg"
                alt="Restauração de fotos antigas"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fitness / musculação */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-xs tracking-[0.4em] text-white/50">FITNESS</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
              Prompts de academia,{" "}
              <span className="bg-gradient-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent">
                musculação e treino
              </span>
            </h2>
            <p className="mt-4 text-white/70 md:text-lg">
              Crie imagens de performance, transformação, campanhas fitness e conteúdo para redes sociais sem perder
              características físicas e identidade visual.
            </p>

            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-300" /> Pronto para Reels, Ads e capas
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" /> Estilo premium, iluminação de estúdio, realismo
              </div>
              <div className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-fuchsia-300" /> Copy + prompt para colar na IA
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={0.1} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <Image
                src="/sections/fitness-prompts.png"
                alt="Fitness prompts"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="text-xs tracking-[0.4em] text-white/50">DEPOIMENTOS</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
          Resultados reais de quem{" "}
          <span className="bg-gradient-to-r from-fuchsia-300 via-white to-cyan-300 bg-clip-text text-transparent">
            aplicou os prompts
          </span>
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Cliente — Tráfego",
              text: "“Economizei horas. Agora faço criativos prontos pra anúncio em minutos — e com visual premium.”",
            },
            {
              name: "Cliente — Social Media",
              text: "“A biblioteca por categoria é ouro. Copiar/colar e pronto. Meu conteúdo ficou outro nível.”",
            },
            {
              name: "Cliente — E-commerce",
              text: "“Usei os prompts de produto e aumentou muito a qualidade das peças e a taxa de clique.”",
            },
          ].map((t) => (
            <div key={t.name} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/85">{t.name}</div>
              <p className="mt-3 text-sm text-white/70">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20">
        <div className="text-xs tracking-[0.4em] text-white/50">FAQ</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">Dúvidas rápidas</h2>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-3 md:p-6">
          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "Como eu uso os prompts (sou iniciante)?",
                a: "1) Clique em uma categoria. 2) Abra um item. 3) Clique em “Copiar prompt”. 4) Abra sua IA (ChatGPT/Gemini/Leonardo/etc.), envie sua foto e cole o prompt. 5) Gere e baixe a imagem.",
              },
              { q: "Eu preciso saber design ou edição?", a: "Não. O Prompt Lab já entrega prompts prontos com instruções de câmera, luz e estilo. Você só copia e cola." },
              { q: "O prompt aparece para todo mundo?", a: "Não. O texto do prompt fica protegido. Após pagamento aprovado na Hotmart, o acesso é liberado automaticamente." },
              { q: "Quais IAs aceitam foto + prompt?", a: "ChatGPT (Imagem), Gemini, Leonardo AI, Adobe Firefly (em alguns modos), Midjourney (via upload + prompt). Cada plataforma tem regras próprias." },
              { q: "Quantos prompts eu vou ter acesso?", a: "Mais de 1.000 prompts profissionais, organizados em HOMENS, MULHERES, INFANTIS e PUBLICIDADE." },
              { q: "Como funciona o botão copiar?", a: "Você clica e o texto vai para a área de transferência. Depois é só colar na IA com Ctrl+V (ou toque e segure no celular)." },
              { q: "Posso usar em celular?", a: "Sim. No celular: abra o item → toque em “Copiar prompt” → abra sua IA → envie a foto → cole o prompt." },
              { q: "Preciso de suporte?", a: "Se travar em qualquer passo, fale no email de contato. A gente te orienta para rodar o prompt do jeito certo." },
            ].map((f, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10">
                <AccordionTrigger className="text-left text-white/85">{f.q}</AccordionTrigger>
                <AccordionContent className="text-white/70">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div>
            <div className="text-sm font-semibold text-white/85">Contato</div>
            <a className="mt-1 block text-sm text-white/70 hover:text-white" href={`mailto:${SITE.contactEmail}`}>
              {SITE.contactEmail}
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={SITE.hotmartUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-black
                         shadow-[0_0_26px_rgba(16,255,120,0.30)] hover:bg-emerald-300"
            >
              Comprar premium <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/10"
            >
              <TikTokIcon className="h-4 w-4" />
              TikTok
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-6xl px-6 pb-10 pt-8 text-sm text-white/60">
        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} {SITE.brand} — {SITE.tagline} <span className="text-white/40">•</span>{" "}
            <span className="text-white/70">Waldir Penido</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 ring-1 ring-white/10 hover:bg-white/10"
            >
              <TikTokIcon className="h-4 w-4" /> TikTok @mundopromptia
              <ExternalLink className="h-4 w-4 opacity-60" />
            </a>

            <a
              href={SITE.hotmartUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-2 font-semibold text-black
                         shadow-[0_0_22px_rgba(16,255,120,0.28)] hover:bg-emerald-300"
            >
              Comprar premium <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}