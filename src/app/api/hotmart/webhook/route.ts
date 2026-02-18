import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getHeader(req: Request, name: string) {
  return req.headers.get(name) || req.headers.get(name.toLowerCase()) || "";
}

function extractEmail(payload: any): string | null {
  const candidates = [
    payload?.buyer?.email,
    payload?.data?.buyer?.email,
    payload?.purchase?.buyer?.email,
    payload?.data?.purchase?.buyer?.email,
    payload?.data?.purchase?.buyer_email,
    payload?.data?.buyer_email,
  ].filter(Boolean);
  const email = candidates[0];
  if (typeof email === "string" && email.includes("@")) return email.toLowerCase();
  return null;
}

function extractEvent(payload: any): string {
  return (
    payload?.event ||
    payload?.event_name ||
    payload?.type ||
    payload?.data?.event ||
    payload?.data?.event_name ||
    "unknown"
  );
}

function isApprovedEvent(eventName: string, payload: any) {
  const e = String(eventName).toLowerCase();
  if (e.includes("approved")) return true;
  // fallback: sometimes status fields exist
  const status = String(payload?.purchase?.status || payload?.data?.purchase?.status || "").toLowerCase();
  return status.includes("approved") || status.includes("completed");
}

function isRevokeEvent(eventName: string) {
  const e = String(eventName).toLowerCase();
  return (
    e.includes("refunded") ||
    e.includes("chargeback") ||
    e.includes("canceled") ||
    e.includes("cancelled") ||
    e.includes("expired")
  );
}

export async function POST(req: Request) {
  // Hotmart recommends validating the X-HOTMART-HOTTOK header.
  const hottok = getHeader(req, "X-HOTMART-HOTTOK");
  const expected = process.env.HOTMART_HOTTOK || "";
  if (!expected || hottok !== expected) {
    // Return 200 to avoid aggressive retries; we simply ignore invalid requests.
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const eventName = extractEvent(payload);
  const email = extractEmail(payload);

  if (!email) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const raw = JSON.stringify(payload).slice(0, 10000);

  if (isApprovedEvent(eventName, payload)) {
    await db.accessGrant.upsert({
      where: { email },
      update: { status: "ACTIVE", lastEvent: eventName, raw },
      create: { email, status: "ACTIVE", lastEvent: eventName, raw },
    });
  } else if (isRevokeEvent(eventName)) {
    await db.accessGrant.upsert({
      where: { email },
      update: { status: "INACTIVE", lastEvent: eventName, raw },
      create: { email, status: "INACTIVE", lastEvent: eventName, raw },
    });
  } else {
    // store event for debugging without changing status
    await db.accessGrant.upsert({
      where: { email },
      update: { lastEvent: eventName, raw },
      create: { email, status: "ACTIVE", lastEvent: eventName, raw },
    });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
