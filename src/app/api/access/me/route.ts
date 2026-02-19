import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth-token";

export async function GET() {
  const token = (await cookies()).get("promptlab_token")?.value;
  if (!token) return NextResponse.json({ hasAccess: false }, { status: 200 });

  const payload = verifyAccessToken(token);
  if (!payload) return NextResponse.json({ hasAccess: false }, { status: 200 });

  return NextResponse.json({ hasAccess: true, email: payload.sub }, { status: 200 });
}
