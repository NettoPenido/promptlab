import { db } from "@/lib/db";
import { PROMPTS } from "@/content/prompts";

export async function getAllPromptItems() {
  try {
    const dbItems = await db.promptItem.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    if (dbItems.length > 0) return dbItems;
  } catch {
    // ignore
  }

  return PROMPTS;
}

export async function getPromptItemById(id: string) {
  try {
    const item = await db.promptItem.findUnique({ where: { id } });
    if (item) return item;
  } catch {}

  return PROMPTS.find((p) => p.id === id) || null;
}

export async function getPromptItemsByCategory(category: string) {
  const cat = (category || "").trim().toLowerCase();
  try {
    const items = await db.promptItem.findMany({
      where: { category: cat, isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    if (items.length > 0) return items;
  } catch {}

  return PROMPTS.filter((p) => p.category === cat);
}
