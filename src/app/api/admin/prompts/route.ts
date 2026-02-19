import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("category") || "").trim();

  const where: any = {};
  if (category) where.category = category;
  if (q) where.OR = [{ title: { contains: q } }, { prompt: { contains: q } }];

  const items = await prisma.promptItem.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ ok: true, items }, { status: 200 });
}

export async function POST(req: Request) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title || "").trim();
  const category = String(body?.category || "").trim();
  const prompt = String(body?.prompt || "").trim();
  const image = String(body?.image || "").trim();
  const imageFocus = String(body?.imageFocus || "50% 25%").trim();
  const isActive = Boolean(body?.isActive ?? true);

  if (!title || !category || !prompt || !image) {
    return NextResponse.json({ ok: false, error: "Preencha título, categoria, imagem e prompt." }, { status: 400 });
  }

  const item = await prisma.promptItem.create({
    data: { title, category, prompt, image, imageFocus, isActive },
  });

  return NextResponse.json({ ok: true, item }, { status: 201 });
}
