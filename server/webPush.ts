import webpush from "web-push";
import { ENV } from "./_core/env";
import { getAllPushSubscriptions, deletePushSubscription } from "./db";

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return;
  if (!ENV.vapidPublicKey || !ENV.vapidPrivateKey) {
    console.warn("[WebPush] VAPID keys not configured, push notifications disabled");
    return;
  }
  webpush.setVapidDetails(
    "mailto:admin@xplay.com",
    ENV.vapidPublicKey,
    ENV.vapidPrivateKey
  );
  vapidConfigured = true;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Send push notification to all subscribed browsers.
 * Automatically removes stale/expired subscriptions.
 */
export async function sendPushToAll(payload: PushPayload): Promise<{ sent: number; failed: number; removed: number }> {
  ensureVapid();
  if (!vapidConfigured) return { sent: 0, failed: 0, removed: 0 };

  const subscriptions = await getAllPushSubscriptions();
  let sent = 0;
  let failed = 0;
  let removed = 0;

  const jsonPayload = JSON.stringify(payload);

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        jsonPayload,
        { TTL: 60 * 60 } // 1 hour
      );
      sent++;
    } catch (err: any) {
      failed++;
      // Remove expired/invalid subscriptions (410 Gone, 404 Not Found)
      if (err.statusCode === 410 || err.statusCode === 404) {
        try {
          await deletePushSubscription(sub.endpoint);
          removed++;
        } catch (_) {}
      }
    }
  }

  console.log(`[WebPush] Sent: ${sent}, Failed: ${failed}, Removed stale: ${removed}`);
  return { sent, failed, removed };
}
