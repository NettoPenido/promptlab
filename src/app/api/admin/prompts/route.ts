import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = ["homens", "mulheres", "infantis", "publicidade"] as const;

function getAdminSecret(req: Request) {
  const header = req.headers.get("x-admin-secret") || req.headers.get("X-Admin-Secret");
  return header?.trim() || "";
}

function normalizeCategory(input: unknown) {
  return String(input ?? "").trim().toLowerCase();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function GET(req: Request) {
  try {
    const secret = (process.env.ADMIN_SECRET || "").trim();
    if (!secret) return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });

    const incoming = getAdminSecret(req);
    if (!incoming) return NextResponse.json({ error: "Missing x-admin-secret header" }, { status: 401 });
    if (incoming !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.promptItem.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const secret = (process.env.ADMIN_SECRET || "").trim();
    if (!secret) return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });

    const incoming = getAdminSecret(req);
    if (!incoming) return NextResponse.json({ error: "Missing x-admin-secret header" }, { status: 401 });
    if (incoming !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const title = String(body.title ?? "").trim();
    const prompt = String(body.prompt ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const category = normalizeCategory(body.category);

    // UI chama de "Ativo", mas no DB é isPublished
    const isPublished = Boolean(body.isPublished ?? body.isActive ?? true);

    const focusX = Number.isFinite(Number(body.focusX)) ? Math.max(0, Math.min(100, Math.round(Number(body.focusX)))) : 50;
    const focusY = Number.isFinite(Number(body.focusY)) ? Math.max(0, Math.min(100, Math.round(Number(body.focusY)))) : 25;

    if (!title) return NextResponse.json({ error: "Título obrigatório." }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt obrigatório." }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ error: "Imagem obrigatória (ex.: /imgs/01-Homem.jpg)." }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json(
        { error: `Categoria inválida: "${category}". Use: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const slug = String(body.slug ?? "").trim() || slugify(String(body.id ?? "").trim() || title);
    if (!slug) return NextResponse.json({ error: "Slug inválido." }, { status: 400 });

    const created = await prisma.promptItem.create({
      data: {
        slug,
        title,
        category,
        imageUrl,
        focusX,
        focusY,
        prompt,
        isPublished,
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err: any) {
    // Se slug duplicar, o Prisma vai acusar unique constraint.
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}