import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { COOKIE_DEVICE, COOKIE_EMAIL, COOKIE_SESSION, COOKIE_SIG } from "@/lib/access";

export async function POST() {
  const jar = await cookies();
  const sessionToken = jar.get(COOKIE_SESSION)?.value || "";

  if (sessionToken) {
    try {
      await db.accessSession.updateMany({
        where: { sessionToken },
        data: { revokedAt: new Date() },
      });
    } catch {}
  }

  jar.delete(COOKIE_EMAIL);
  jar.delete(COOKIE_SIG);
  jar.delete(COOKIE_DEVICE);
  jar.delete(COOKIE_SESSION);

  return NextResponse.json({ ok: true }, { status: 200 });
}
