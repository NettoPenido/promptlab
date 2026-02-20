import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = ["homens", "mulheres", "infantis", "publicidade"] as const;

function getAdminSecret(req: Request) {
  return (req.headers.get("x-admin-secret") || "").trim();
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(req: Request) {
  try {
    const secret = process.env.ADMIN_SECRET || "";
    if (!secret) {
      return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
    }

    const incoming = getAdminSecret(req);
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.promptItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const secret = process.env.ADMIN_SECRET || "";
    if (!secret) {
      return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
    }

    const incoming = getAdminSecret(req);
    if (incoming !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const prompt = String(body.prompt ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const category = String(body.category ?? "").toLowerCase().trim();

    if (!title) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt obrigatório" }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ error: "Imagem obrigatória" }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json({ error: "Categoria inválida" }, { status: 400 });
    }

    const slug = slugify(body.slug || title);

    const focusX = Number.isFinite(Number(body.focusX)) ? Number(body.focusX) : 50;
    const focusY = Number.isFinite(Number(body.focusY)) ? Number(body.focusY) : 50;

    const created = await prisma.promptItem.create({
      data: {
        slug,
        title,
        category,
        prompt,
        imageUrl,
        focusX,
        focusY,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json({ item: created });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}