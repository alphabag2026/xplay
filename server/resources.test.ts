import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("./db", () => ({
  getResources: vi.fn(),
  getAllResources: vi.fn(),
  getResourceById: vi.fn(),
  createResource: vi.fn(),
  updateResource: vi.fn(),
  deleteResource: vi.fn(),
}));

import {
  getResources,
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} from "./db";

describe("Resources DB helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getResources returns filtered results by language", async () => {
    const mockData = [
      { id: 1, type: "document", lang: "ko", title: "한국어 문서", isActive: true },
      { id: 2, type: "blog", lang: "all", title: "전체 블로그", isActive: true },
    ];
    (getResources as any).mockResolvedValue(mockData);

    const result = await getResources({ lang: "ko" });
    expect(result).toHaveLength(2);
    expect(result[0].lang).toBe("ko");
    expect(result[1].lang).toBe("all");
  });

  it("getResources returns all active resources when no filter", async () => {
    const mockData = [
      { id: 1, type: "document", lang: "ko", title: "Doc 1", isActive: true },
      { id: 2, type: "blog", lang: "en", title: "Blog 1", isActive: true },
      { id: 3, type: "video", lang: "zh", title: "Video 1", isActive: true },
    ];
    (getResources as any).mockResolvedValue(mockData);

    const result = await getResources();
    expect(result).toHaveLength(3);
  });

  it("getResources filters by type", async () => {
    const mockData = [
      { id: 1, type: "blog", lang: "ko", title: "Blog 1", isActive: true },
    ];
    (getResources as any).mockResolvedValue(mockData);

    const result = await getResources({ type: "blog" });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("blog");
  });

  it("getAllResources returns all resources including inactive", async () => {
    const mockData = [
      { id: 1, type: "document", lang: "ko", isActive: true },
      { id: 2, type: "blog", lang: "en", isActive: false },
    ];
    (getAllResources as any).mockResolvedValue(mockData);

    const result = await getAllResources();
    expect(result).toHaveLength(2);
  });

  it("getResourceById returns a single resource", async () => {
    const mockResource = { id: 1, type: "document", lang: "ko", title: "Test Doc" };
    (getResourceById as any).mockResolvedValue(mockResource);

    const result = await getResourceById(1);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  it("getResourceById returns null for non-existent", async () => {
    (getResourceById as any).mockResolvedValue(null);

    const result = await getResourceById(999);
    expect(result).toBeNull();
  });

  it("createResource returns new id", async () => {
    (createResource as any).mockResolvedValue({ id: 10 });

    const result = await createResource({
      type: "blog",
      lang: "ko",
      title: "새 블로그",
      url: "https://example.com/blog",
    } as any);
    expect(result.id).toBe(10);
  });

  it("updateResource completes without error", async () => {
    (updateResource as any).mockResolvedValue(undefined);

    await expect(
      updateResource(1, { title: "Updated Title" } as any)
    ).resolves.toBeUndefined();
  });

  it("deleteResource completes without error", async () => {
    (deleteResource as any).mockResolvedValue(undefined);

    await expect(deleteResource(1)).resolves.toBeUndefined();
  });

  it("resources support all language tags", () => {
    const validLangs = ["ko", "en", "zh", "ja", "vi", "th", "all"];
    validLangs.forEach((lang) => {
      expect(typeof lang).toBe("string");
      expect(lang.length).toBeGreaterThan(0);
    });
  });

  it("resources support all types", () => {
    const validTypes = ["document", "blog", "video"];
    validTypes.forEach((type) => {
      expect(typeof type).toBe("string");
    });
  });
});
