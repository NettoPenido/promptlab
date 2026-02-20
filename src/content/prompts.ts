export type Category = "homens" | "mulheres" | "infantis" | "publicidade";

export type PromptItem = {
  id: string;
  category: Category;
  title: string;
  image: string; // path under /public
  prompt: string;
  tags?: string[];
};

export const SITE = {
  brand: "Prompt Lab",
  tagline: "The AI Image Vault",
  slogan: "Prompts prontos. Resultados profissionais.",
  hotmartUrl: "https://pay.hotmart.com/R104366135O?off=rbia9a6l&bid=1771432296905",
  // ✅ compat
  hotmartPayUrl: "https://pay.hotmart.com/R104366135O?off=rbia9a6l&bid=1771432296905",
  contactEmail: "penido@consultant.com",
};

export const CATEGORIES: { key: Category; label: string; desc: string }[] = [
  { key: "homens", label: "HOMENS", desc: "Retratos, estilo, moda, lifestyle e cenas." },
  { key: "mulheres", label: "MULHERES", desc: "Editorial, beleza, retratos e variações." },
  { key: "infantis", label: "INFANTIS", desc: "Lúdico, storytelling, personagens e cenas." },
  { key: "publicidade", label: "PUBLICIDADE", desc: "Produto, anúncio, campanhas e brand." },
];

// Fallback local (caso DB esteja vazio)
export const PROMPTS: PromptItem[] = [
  {
    id: "homem-01",
    category: "homens",
    title: "Homem — Retrato Studio",
    image: "/demo.svg",
    prompt: "SEU PROMPT AQUI (bloqueado até pagamento)",
    tags: ["studio", "realista"],
  },
];