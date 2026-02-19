import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useConnector } from "../../src/hooks/useConnector";
import { csvConnector } from "@vizualni/connectors";

describe("useConnector", () => {
  it("should return loading state initially", () => {
    const mockCsv = `name,value
Alice,100`;

    global.fetch = vi.fn().mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it("should fetch data and return results", async () => {
    const mockCsv = `name,value
Alice,100
Bob,200`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.schema).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it("should handle fetch errors", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Network error");
  });
});
