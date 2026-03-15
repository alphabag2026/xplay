/**
 * Direct Cloudflare R2 Storage Module
 * Replaces Manus proxy with direct S3-compatible API
 * Uses the same r2Storage module for actual operations
 */
import { r2Upload, r2Delete } from "./r2Storage";

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function getPublicUrl(): string {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) throw new Error("R2_PUBLIC_URL is not set");
  return url.replace(/\/+$/, "");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  
  // Convert string to Buffer if needed
  let buffer: Buffer;
  if (typeof data === "string") {
    buffer = Buffer.from(data);
  } else if (data instanceof Uint8Array) {
    buffer = Buffer.from(data);
  } else {
    buffer = data;
  }

  const result = await r2Upload(key, buffer, contentType);
  return { key, url: result.url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const publicUrl = getPublicUrl();
  return {
    key,
    url: `${publicUrl}/${key}`,
  };
}

export async function storageDelete(relKey: string): Promise<void> {
  const key = normalizeKey(relKey);
  await r2Delete(key);
}
