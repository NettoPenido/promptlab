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

function clampPct(n: any, fallback: number) {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalizeFitMode(v: any) {
  const s = String(v ?? "").trim().toLowerCase();
  return (VALID_FIT as readonly string[]).includes(s) ? s : "cover";
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

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const guard = requireAdmin(req);
  if (!guard.ok) return guard.res;

  try {
    const { id } = await ctx.params;

    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const data: any = {};

    if (body.title != null) data.title = String(body.title).trim();
    if (body.prompt != null) data.prompt = String(body.prompt).trim();
    if (body.imageUrl != null) data.imageUrl = String(body.imageUrl).trim();

    if (body.category != null) {
      const cat = normalizeCategory(body.category);
      if (!VALID_CATEGORIES.includes(cat as any)) {
        return NextResponse.json(
          { error: `Categoria inválida: "${cat}". Use: ${VALID_CATEGORIES.join(", ")}` },
          { status: 400 }
        );
      }
      data.category = cat;
    }

    if (body.isActive != null || body.isPublished != null) {
      data.isActive = Boolean(body.isActive ?? body.isPublished);
    }

    if (body.focusX != null) data.focusX = clampPct(body.focusX, 50);
    if (body.focusY != null) data.focusY = clampPct(body.focusY, 25);

    if (body.fitMode != null) data.fitMode = normalizeFitMode(body.fitMode);

    // “auto enquadrar” pode vir como { autoFrame: true, mode: "contain"|"cover" }
    if (body.autoFrame) {
      data.focusX = 50;
      data.focusY = 50;
      data.fitMode = normalizeFitMode(body.mode || "contain");
    }

    const updated = await prisma.promptItem.update({
      where: { id: String(id) },
      data,
    });

    return NextResponse.json({ item: updated });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
