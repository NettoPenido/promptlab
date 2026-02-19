import { db } from "@/lib/db";

/**
 * Simple DB-backed rate limit (works on Vercel too).
 */
export async function rateLimitOrThrow(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}) {
  const { key, limit, windowSeconds } = opts;
  const now = new Date();
  const windowStart = new Date(
    Math.floor(now.getTime() / (windowSeconds * 1000)) * windowSeconds * 1000
  );

  const row = await db.accessRateLimit.upsert({
    where: { key },
    create: { key, count: 1, windowStart },
    update: { count: { increment: 1 }, windowStart },
  });

  if (row.windowStart.getTime() !== windowStart.getTime()) {
    await db.accessRateLimit.update({
      where: { key },
      data: { count: 1, windowStart },
    });
    return;
  }

  if (row.count > limit) {
    const retryAfter = Math.max(
      1,
      Math.ceil(
        (windowStart.getTime() + windowSeconds * 1000 - now.getTime()) / 1000
      )
    );
    const err: any = new Error("RATE_LIMIT");
    err.retryAfter = retryAfter;
    throw err;
  }
}
