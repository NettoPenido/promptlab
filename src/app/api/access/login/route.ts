import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import {
  COOKIE_DEVICE,
  COOKIE_EMAIL,
  COOKIE_SESSION,
  COOKIE_SIG,
  hasAccessForEmail,
  nowPlusSeconds,
  randomToken,
  sessionTtlSeconds,
  signEmail,
} from "@/lib/access";
import { rateLimitOrThrow } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Rate limit by IP
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  try {
    await rateLimitOrThrow({ key: `login:${ip}`, limit: 10, windowSeconds: 600 });
  } catch (e: any) {
    const retryAfter = e?.retryAfter ?? 60;
    return NextResponse.json(
      {
        ok: false,
        error: "Muitas tentativas. Aguarde e tente novamente.",
        retryAfter,
      },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {}

  const email = String(body?.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "E-mail inválido." }, { status: 400 });
  }

  const jar = await cookies();

  // Ensure device id cookie exists (stable per browser)
  let deviceId = jar.get(COOKIE_DEVICE)?.value || "";
  if (!deviceId) {
    deviceId = randomToken(16);
    jar.set(COOKIE_DEVICE, deviceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year device id
    });
  }

  // Signed email cookies (identifica o comprador)
  jar.set(COOKIE_EMAIL, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  jar.set(COOKIE_SIG, signEmail(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const ttl = sessionTtlSeconds();
  const ua = h.get("user-agent") || "";

  // ✅ MAX 1 dispositivo: NÃO derruba o anterior. Bloqueia e avisa.
  try {
    const existing = await db.accessSession.findFirst({
      where: {
        email,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing && existing.deviceId !== deviceId) {
      return NextResponse.json(
        {
          ok: false,
          code: "DEVICE_LIMIT",
          error:
            "Você já está logado em outro dispositivo. Para trocar de dispositivo, solicite suporte.",
        },
        { status: 409 }
      );
    }

    if (existing && existing.deviceId === deviceId) {
      // same device: refresh session (extend TTL) and reuse token
      const newExpires = nowPlusSeconds(ttl);
      await db.accessSession.update({
        where: { sessionToken: existing.sessionToken },
        data: { lastSeenAt: new Date(), expiresAt: newExpires, ip, userAgent: ua },
      });

      jar.set(COOKIE_SESSION, existing.sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: ttl,
      });

      const hasAccess = await hasAccessForEmail(email);
      return NextResponse.json(
        { ok: true, email, hasAccess, expiresAt: newExpires },
        { status: 200 }
      );
    }
  } catch {
    // If DB isn't ready yet, fall through and create cookie-only session (fallback)
  }

  // create a new session (first login)
  const sessionToken = randomToken(32);
  const expiresAt = nowPlusSeconds(ttl);

  try {
    await db.accessSession.create({
      data: { email, sessionToken, deviceId, ip, userAgent: ua, expiresAt },
    });
  } catch {
    // DB not ready: still set cookie (fallback allowlist)
  }

  jar.set(COOKIE_SESSION, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: ttl,
  });

  const hasAccess = await hasAccessForEmail(email);
  return NextResponse.json({ ok: true, email, hasAccess, expiresAt }, { status: 200 });
}
