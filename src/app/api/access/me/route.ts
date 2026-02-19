import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db";
import {
  COOKIE_DEVICE,
  COOKIE_EMAIL,
  COOKIE_SESSION,
  COOKIE_SIG,
  hasAccessForEmail,
  signEmail,
} from "@/lib/access";

export async function GET() {
  const jar = await cookies();
  const email = jar.get(COOKIE_EMAIL)?.value || "";
  const sig = jar.get(COOKIE_SIG)?.value || "";
  const deviceId = jar.get(COOKIE_DEVICE)?.value || "";
  const sessionToken = jar.get(COOKIE_SESSION)?.value || "";

  if (!email || !sig || !deviceId || !sessionToken) {
    return NextResponse.json({ hasAccess: false }, { status: 200 });
  }

  if (sig !== signEmail(email)) {
    jar.delete(COOKIE_EMAIL);
    jar.delete(COOKIE_SIG);
    jar.delete(COOKIE_DEVICE);
    jar.delete(COOKIE_SESSION);
    return NextResponse.json({ hasAccess: false }, { status: 200 });
  }

  try {
    const sess = await db.accessSession.findUnique({ where: { sessionToken } });
    if (!sess) return NextResponse.json({ hasAccess: false }, { status: 200 });
    if (sess.revokedAt) return NextResponse.json({ hasAccess: false }, { status: 200 });
    if (sess.email !== email) return NextResponse.json({ hasAccess: false }, { status: 200 });
    if (sess.deviceId !== deviceId) return NextResponse.json({ hasAccess: false }, { status: 200 });
    if (sess.expiresAt.getTime() <= Date.now()) return NextResponse.json({ hasAccess: false }, { status: 200 });

    await db.accessSession.update({
      where: { sessionToken },
      data: { lastSeenAt: new Date() },
    });
  } catch {
    // DB issue: fallback to allowlist behavior (still checks signature)
  }

  const hasAccess = await hasAccessForEmail(email);
  return NextResponse.json({ hasAccess, email }, { status: 200 });
}
