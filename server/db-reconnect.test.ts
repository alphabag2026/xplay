import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for the DB reconnection logic in getDb().
 * Verifies that:
 * 1. getDb returns null when DATABASE_URL is not set
 * 2. getDb creates a connection pool on first call
 * 3. getDb reuses the cached connection when pool is healthy
 * 4. getDb reconnects when the pool health check fails (ECONNRESET)
 */

// Mock mysql2/promise
const mockQuery = vi.fn();
const mockEnd = vi.fn();
const mockCreatePool = vi.fn();

vi.mock("mysql2/promise", () => ({
  default: {
    createPool: (...args: any[]) => {
      mockCreatePool(...args);
      return {
        query: mockQuery,
        end: mockEnd,
      };
    },
  },
}));

// Mock drizzle
const mockDrizzle = vi.fn().mockReturnValue({ __drizzle: true });
vi.mock("drizzle-orm/mysql2", () => ({
  drizzle: (...args: any[]) => mockDrizzle(...args),
}));

// Mock schema imports
vi.mock("../drizzle/schema", () => ({}));
vi.mock("./_core/env", () => ({ ENV: {} }));

describe("getDb reconnection logic", () => {
  const originalEnv = process.env.DATABASE_URL;

  beforeEach(() => {
    vi.resetModules();
    mockQuery.mockReset();
    mockEnd.mockReset();
    mockCreatePool.mockReset();
    mockDrizzle.mockReturnValue({ __drizzle: true });
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.DATABASE_URL = originalEnv;
    } else {
      delete process.env.DATABASE_URL;
    }
  });

  it("returns null when DATABASE_URL is not set", async () => {
    delete process.env.DATABASE_URL;
    const { getDb } = await import("./db");
    const db = await getDb();
    expect(db).toBeNull();
  });

  it("creates a new pool on first call", async () => {
    process.env.DATABASE_URL = "mysql://test:test@localhost:3306/testdb";
    const { getDb } = await import("./db");
    const db = await getDb();
    expect(db).toBeTruthy();
    expect(mockCreatePool).toHaveBeenCalledTimes(1);
    expect(mockCreatePool).toHaveBeenCalledWith(
      expect.objectContaining({
        uri: "mysql://test:test@localhost:3306/testdb",
        enableKeepAlive: true,
      })
    );
  });

  it("reuses cached connection when pool is healthy", async () => {
    process.env.DATABASE_URL = "mysql://test:test@localhost:3306/testdb";
    mockQuery.mockResolvedValue([[], []]);
    const { getDb } = await import("./db");

    const db1 = await getDb();
    const db2 = await getDb();
    expect(db1).toBe(db2);
    // createPool called only once (first call), second call reuses
    expect(mockCreatePool).toHaveBeenCalledTimes(1);
    // SELECT 1 health check called on second call
    expect(mockQuery).toHaveBeenCalledWith("SELECT 1");
  });

  it("reconnects when pool health check fails (ECONNRESET)", async () => {
    process.env.DATABASE_URL = "mysql://test:test@localhost:3306/testdb";
    const { getDb } = await import("./db");

    // First call: create pool
    const db1 = await getDb();
    expect(mockCreatePool).toHaveBeenCalledTimes(1);

    // Simulate ECONNRESET on health check
    mockQuery.mockRejectedValueOnce(new Error("read ECONNRESET"));

    // Second call: should detect broken connection and recreate
    const db2 = await getDb();
    expect(mockCreatePool).toHaveBeenCalledTimes(2);
    expect(mockEnd).toHaveBeenCalledTimes(1); // old pool closed
    expect(db2).toBeTruthy();
  });
});
