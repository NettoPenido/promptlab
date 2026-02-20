import { db } from "@/lib/db";
import { PROMPTS } from "@/content/prompts";
import { unstable_noStore as noStore } from "next/cache";

export async function getAllPromptItems() {
  noStore();

  try {
    const dbItems = await db.promptItem.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    if (dbItems.length > 0) return dbItems;
  } catch {
    // ignore
  }

  return PROMPTS;
}

export async function getPromptItemById(id: string) {
  noStore();

  try {
    const bySlug = await db.promptItem.findUnique({ where: { slug: id } });
    if (bySlug) return bySlug;

    const byId = await db.promptItem.findUnique({ where: { id } as any });
    if (byId) return byId;
  } catch {}

  return PROMPTS.find((p) => p.id === id) || null;
}

export async function getPromptItemsByCategory(category: string) {
  noStore();

  const cat = (category || "").trim().toLowerCase();

  try {
    const items = await db.promptItem.findMany({
      where: { category: cat, isActive: true },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    if (items.length > 0) return items;
  } catch {}

  return PROMPTS.filter((p) => p.category === cat);
}