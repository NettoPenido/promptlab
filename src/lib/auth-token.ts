import crypto from "crypto";

function b64url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlJson(obj: unknown) {
  return b64url(JSON.stringify(obj));
}

export type AccessTokenPayload = {
  sub: string; // email
  exp: number; // unix seconds
};

export function signAccessToken(email: string, ttlSeconds: number) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");

  const header = { alg: "HS256", typ: "JWT" };
  const payload: AccessTokenPayload = {
    sub: email.toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const unsigned = `${b64urlJson(header)}.${b64urlJson(payload)}`;
  const sig = crypto.createHmac("sha256", secret).update(unsigned).digest();
  return `${unsigned}.${b64url(sig)}`;
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, s] = parts;
    const unsigned = `${h}.${p}`;
    const expected = b64url(crypto.createHmac("sha256", secret).update(unsigned).digest());
    if (expected !== s) return null;

    const payloadStr = Buffer.from(p.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const payload = JSON.parse(payloadStr) as AccessTokenPayload;
    if (!payload?.sub || !payload?.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
