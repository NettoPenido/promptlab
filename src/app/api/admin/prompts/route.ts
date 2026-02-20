import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_CATEGORIES = ["homens", "mulheres", "infantis", "publicidade"] as const;

function getAdminSecret(req: Request) {
  return req.headers.get("x-admin-secret")?.trim() || "";
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
    if (!secret) return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });

    const incoming = getAdminSecret(req);
    if (incoming !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    if (!secret) return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });

    const incoming = getAdminSecret(req);
    if (incoming !== secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const title = String(body.title ?? "").trim();
    const prompt = String(body.prompt ?? "").trim();
    const imageUrl = String(body.imageUrl ?? "").trim();
    const category = String(body.category ?? "").toLowerCase();

    if (!title) return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
    if (!prompt) return NextResponse.json({ error: "Prompt obrigatório" }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ error: "Imagem obrigatória" }, { status: 400 });

    if (!VALID_CATEGORIES.includes(category as any)) {
      return NextResponse.json({ error: "Categoria inválida" }, { status: 400 });
    }

    const focusX = Math.max(0, Math.min(100, Number(body.focusX ?? 50)));
    const focusY = Math.max(0, Math.min(100, Number(body.focusY ?? 50)));

    const slug = slugify(title);

    const created = await prisma.promptItem.create({
      data: {
        slug,
        title,
        category,
        imageUrl,
        focusX,
        focusY,
        prompt,
        isPublished: true,
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}