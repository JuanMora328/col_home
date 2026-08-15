import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "colombia_abriga_admin";
const SESSION_SECONDS = 8 * 60 * 60;

function password(): string {
  const value = process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("Falta la variable de entorno ADMIN_PASSWORD.");
  return value;
}

function digest(value: string): Buffer {
  return createHmac("sha256", password()).update(value).digest();
}

function safeEqual(left: Buffer, right: Buffer): boolean {
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAdminPassword(candidate: string): boolean {
  return safeEqual(digest(candidate), digest(password()));
}

export async function createAdminSession(): Promise<void> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${expires}:${randomBytes(16).toString("base64url")}`;
  (await cookies()).set(COOKIE_NAME, `${payload}.${digest(payload).toString("base64url")}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
    priority: "high",
  });
}

export async function hasAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return false;
  const payload = token.slice(0, separator);
  const supplied = Buffer.from(token.slice(separator + 1), "base64url");
  const separatorInPayload = payload.indexOf(":");
  const expires = Number(separatorInPayload < 0 ? payload : payload.slice(0, separatorInPayload));
  return Number.isSafeInteger(expires) && expires > Math.floor(Date.now() / 1000) && safeEqual(supplied, digest(payload));
}

export async function deleteAdminSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
