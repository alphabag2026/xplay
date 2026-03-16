/**
 * Scheduled announcement publisher.
 * Runs every 60 seconds to check for announcements with status='scheduled'
 * whose scheduledAt time has passed, and publishes them.
 * Also sends push notifications when scheduled announcements are published.
 */
import { getScheduledAnnouncements, publishScheduledAnnouncement } from "./db";
import { sendPushToAll } from "./webPush";

let schedulerInterval: ReturnType<typeof setInterval> | null = null;

export function startScheduler() {
  if (schedulerInterval) return;

  console.log("[Scheduler] Starting announcement scheduler (60s interval)");

  schedulerInterval = setInterval(async () => {
    try {
      const pending = await getScheduledAnnouncements();
      if (pending.length === 0) return;

      for (const ann of pending) {
        try {
          await publishScheduledAnnouncement(ann.id);
          console.log(`[Scheduler] Published scheduled announcement #${ann.id}: ${ann.title}`);
          // Send push notification for newly published scheduled announcement
          sendPushToAll({
            title: `📢 ${ann.title}`,
            body: ann.content.replace(/<[^>]*>/g, "").substring(0, 120),
            url: "/",
            icon: "/favicon.ico",
            tag: `announcement-${ann.id}`,
          }).catch(err => console.error("[WebPush] Failed to send scheduled announcement push:", err));
        } catch (e) {
          console.error(`[Scheduler] Failed to publish #${ann.id}:`, e);
        }
      }
    } catch (e) {
      console.error("[Scheduler] Error checking scheduled announcements:", e);
    }
  }, 60_000); // every 60 seconds
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log("[Scheduler] Stopped announcement scheduler");
  }
}
