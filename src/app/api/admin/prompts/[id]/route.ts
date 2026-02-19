import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const id = String(params.id || "");
  const body = await req.json().catch(() => ({}));

  const data: any = {};
  if (body.title != null) data.title = String(body.title).trim();
  if (body.category != null) data.category = String(body.category).trim();
  if (body.prompt != null) data.prompt = String(body.prompt).trim();
  if (body.image != null) data.image = String(body.image).trim();
  if (body.imageFocus != null) data.imageFocus = String(body.imageFocus).trim() || "50% 25%";
  if (body.isActive != null) data.isActive = Boolean(body.isActive);

  const item = await prisma.promptItem.update({ where: { id }, data });
  return NextResponse.json({ ok: true, item }, { status: 200 });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

  const id = String(params.id || "");
  await prisma.promptItem.delete({ where: { id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
