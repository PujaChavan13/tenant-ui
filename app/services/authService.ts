import { apiClient } from "@/lib/api/client";
import type { AdminUser } from "@/lib/types/auth";

const loginPath =
  process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH ?? "/auth/login";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" ? (value as UnknownRecord) : null;
}

function pickToken(payload: UnknownRecord): string | null {
  const direct =
    payload.token ?? payload.accessToken ?? payload.access_token ?? payload.jwt;
  if (typeof direct === "string" && direct.length > 0) return direct;
  const nested = asRecord(payload.data);
  if (nested) {
    const t =
      nested.token ??
      nested.accessToken ??
      nested.access_token ??
      nested.jwt;
    if (typeof t === "string" && t.length > 0) return t;
  }
  return null;
}

function pickUserRaw(payload: UnknownRecord): unknown {
  return (
    payload.user ??
    payload.admin ??
    asRecord(payload.data)?.user ??
    asRecord(payload.data)?.admin
  );
}

function normalizeUser(raw: unknown, fallbackEmail: string): AdminUser {
  const o = asRecord(raw);
  if (!o) {
    return {
      id: "current",
      email: fallbackEmail,
      name: "Admin",
    };
  }
  const id = String(o.id ?? o._id ?? o.userId ?? "current");
  const email = String(o.email ?? fallbackEmail);
  const name = o.name != null ? String(o.name) : undefined;
  const role = o.role != null ? String(o.role) : undefined;
  return { id, email, name, role };
}

export type LoginResult = {
  token: string;
  user: AdminUser;
};

/**
 * POST login — adapts common API shapes: { token, user }, { data: { token, user } }, etc.
 */
export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResult> {
  const { data } = await apiClient.post<unknown>(loginPath, { email, password });
  const root = asRecord(data) ?? {};
  const token = pickToken(root);
  if (!token) {
    throw new Error("Invalid login response: missing token");
  }
  const userRaw = pickUserRaw(root);
  const user = normalizeUser(userRaw, email);
  return { token, user };
}
