/**
 * Cloudflare R2 Storage Module
 * 
 * Provides upload/delete/list operations for images and videos.
 * Uses AWS S3-compatible API via @aws-sdk/client-s3.
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials missing: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function getBucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not set");
  return bucket;
}

function getPublicUrl(): string {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) throw new Error("R2_PUBLIC_URL is not set");
  return url.replace(/\/+$/, "");
}

/**
 * Check if R2 connection is working
 */
export async function r2HealthCheck(): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = getR2Client();
    const bucket = getBucketName();
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

/**
 * Upload a file to R2
 */
export async function r2Upload(
  key: string,
  data: Buffer | Uint8Array,
  contentType: string
): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const bucket = getBucketName();
  const publicUrl = getPublicUrl();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
    })
  );

  return {
    key,
    url: `${publicUrl}/${key}`,
  };
}

/**
 * Delete a file from R2
 */
export async function r2Delete(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = getBucketName();

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

/**
 * List files in R2 with optional prefix
 */
export async function r2List(
  prefix?: string,
  maxKeys = 100
): Promise<Array<{ key: string; size: number; lastModified: Date | undefined; url: string }>> {
  const client = getR2Client();
  const bucket = getBucketName();
  const publicUrl = getPublicUrl();

  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      MaxKeys: maxKeys,
    })
  );

  return (result.Contents ?? []).map((item) => ({
    key: item.Key ?? "",
    size: item.Size ?? 0,
    lastModified: item.LastModified,
    url: `${publicUrl}/${item.Key}`,
  }));
}

/**
 * Generate a unique file key with random suffix
 */
export function generateFileKey(folder: string, originalName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split(".").pop() || "bin";
  const safeName = originalName
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9가-힣_-]/g, "_")
    .substring(0, 50);
  return `${folder}/${safeName}-${timestamp}-${randomSuffix}.${ext}`;
}
