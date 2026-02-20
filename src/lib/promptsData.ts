import { db } from "@/lib/db";
import { PROMPTS } from "@/content/prompts";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllPromptItems() {
  noStore(); // evita cache da lista no Next (atualiza na hora)

  try {
    const dbItems = await db.promptItem.findMany({
      where: { isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    if (dbItems.length > 0) return dbItems;
  } catch {
    // ignore
  }

  return PROMPTS;
}

export async function getPromptItemById(id: string) {
  noStore(); // evita cache do detalhe

  try {
    // seu schema tem slug único. Se seu /prompt/[id] usa slug, tente por slug primeiro:
    const bySlug = await db.promptItem.findUnique({ where: { slug: id } });
    if (bySlug) return bySlug;

    // fallback por id (caso você esteja usando id em algum lugar)
    const byId = await db.promptItem.findUnique({ where: { id } as any });
    if (byId) return byId;
  } catch {}

  return PROMPTS.find((p) => p.id === id) || null;
}

export async function getPromptItemsByCategory(category: string) {
  noStore(); // evita cache da categoria

  const cat = (category || "").trim().toLowerCase();

  try {
    const items = await db.promptItem.findMany({
      where: { category: cat, isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    if (items.length > 0) return items;
  } catch {}

  return PROMPTS.filter((p) => p.category === cat);
}