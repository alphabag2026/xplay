import { describe, expect, it } from "vitest";
import { r2HealthCheck } from "./r2Storage";

describe("Cloudflare R2 Storage", () => {
  it("should connect to R2 bucket successfully", async () => {
    const result = await r2HealthCheck();
    expect(result.ok).toBe(true);
    if (!result.ok) {
      console.error("R2 health check failed:", result.error);
    }
  });
});
