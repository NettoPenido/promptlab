export function requireAdmin(req: Request) {
  const expected = process.env.ADMIN_SECRET || "";
  if (!expected) return { ok: false, status: 500, error: "ADMIN_SECRET não configurado." };

  const provided =
    req.headers.get("x-admin-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";

  if (!provided || provided !== expected) {
    return { ok: false, status: 401, error: "Não autorizado." };
  }

  return { ok: true as const };
}
