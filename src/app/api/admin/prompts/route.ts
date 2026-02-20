import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = ["homens", "mulheres", "infantis", "publicidade"] as const;
const VALID_FIT = ["cover", "contain"] as const;

function getAdminSecret(req: Request) {
  const header = req.headers.get("x-admin-secret") || req.headers.get("X-Admin-Secret");
  return header?.trim() || "";
}

function normalizeCategory(input: unknown) {
  return String(input ?? "").trim().toLowerCase();
}

function slugify(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function ensureUniqueSlug(base: string) {
  let slug = base || "item";
  let i = 1;

  while (true) {
    const exists = await prisma.promptItem.findUnique({ where: { slug } });
    if (!exists) return slug;
    i += 1;
    slug = `${base}-${i}`.slice(0, 90);
  }
}

function clampPct(n: any, fallback: number) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalizeFitMode(input: any) {
  const v = String(input ?? "").trim().toLowerCase();
  if (v === "contain") return "contain";
  return "cover";
}

function requireAdmin(req: Request) {
  const secret = process.env.ADMIN_SECRET || "";
  if (!secret) {
    return { ok: false as const, res: NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 }) };
  }
  const incoming = getAdminSecret(req);
  if (incoming !== secret) {
    return { ok: false as const, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const };
}

export async function GET(req: Request) {
  const guard = requireAdmin(req);
  if (!guard.ok) return guard.res;

  try {
    const items = await prisma.promptItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (!guard.ok) return guard.res;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const title = String(body.title ?? "").trim();
    const prompt = String(body.prompt ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const category = normalizeCategory(body.category);

    const isActive = Boolean(body.isActive ?? body.isPublished ?? true);

    const focusX = clampPct(body.focusX, 50);
    const focusY = clampPct(body.focusY, 25);

    const fitMode = normalizeFitMode(body.fitMode); // "cover" | "contain"

    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ error: "Imagem obrigatória (ex.: /imgs/01-Homem.jpg)." }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json(
        { error: `Categoria inválida: "${category}". Use: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const requested = String(body.slug ?? body.id ?? "").trim();
    const baseSlug = slugify(requested || title);
    const slug = await ensureUniqueSlug(baseSlug);

    const agg = await prisma.promptItem.aggregate({ _max: { sortOrder: true } });
    const nextSort = (agg._max.sortOrder ?? 0) + 1;

    const created = await prisma.promptItem.create({
      data: {
        slug,
        title,
        category,
        imageUrl,
        focusX,
        focusY,
        prompt,
        isActive,
        sortOrder: nextSort,
        fitMode, // ✅ agora existe no schema
      } as any,
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

/**
 * PUT: editar 1 item
 * Body esperado:
 * { id, title, prompt, imageUrl, category, isActive/isPublished, focusX, focusY, fitMode }
 */
export async function PUT(req: Request) {
  const guard = requireAdmin(req);
  if (!guard.ok) return guard.res;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const id = String(body.id ?? "").trim();
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const title = String(body.title ?? "").trim();
    const prompt = String(body.prompt ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const category = normalizeCategory(body.category);

    const isActive = Boolean(body.isActive ?? body.isPublished ?? true);

    const focusX = clampPct(body.focusX, 50);
    const focusY = clampPct(body.focusY, 25);

    const fitMode = normalizeFitMode(body.fitMode);

    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ error: "Imagem obrigatória." }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json(
        { error: `Categoria inválida: "${category}". Use: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await prisma.promptItem.update({
      where: { id },
      data: {
        title,
        prompt,
        imageUrl,
        category,
        isActive,
        focusX,
        focusY,
        fitMode,
      } as any,
    });

    return NextResponse.json({ item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

/**
 * PATCH: salvar ordem manual
 * Body esperado:
 * { items: [{ id: "cuid...", sortOrder: 1 }, ...] }
 */
export async function PATCH(req: Request) {
  const guard = requireAdmin(req);
  if (!guard.ok) return guard.res;

  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const items = Array.isArray(body.items) ? body.items : null;
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Envie { items: [{id, sortOrder}, ...] }" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((it: any) =>
        prisma.promptItem.update({
          where: { id: String(it.id) },
          data: { sortOrder: Number(it.sortOrder) },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}