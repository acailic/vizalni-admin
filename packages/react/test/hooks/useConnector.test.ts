import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
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

  it("should not fetch when enabled is false", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("name,value\nAlice,100"),
    });
    global.fetch = mockFetch;

    const { result } = renderHook(() =>
      useConnector(
        csvConnector,
        { url: "https://example.com/data.csv" },
        { enabled: false }
      )
    );

    // Wait a bit to ensure fetch wasn't called
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("should fetch when enabled changes from false to true", async () => {
    const mockCsv = `name,value
Alice,100`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const { result, rerender } = renderHook(
      ({ enabled }) =>
        useConnector(
          csvConnector,
          { url: "https://example.com/data.csv" },
          { enabled }
        ),
      { initialProps: { enabled: false } }
    );

    // Should not have fetched yet
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeUndefined();

    // Enable fetching
    rerender({ enabled: true });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(1);
  });

  it("should provide refetch function", async () => {
    const mockCsv = `name,value
Alice,100`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe("function");
  });

  it("should refetch when refetch is called", async () => {
    const mockCsv = `name,value
Alice,100`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Clear the mock to count new calls
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    // Trigger refetch
    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should include schema in result", async () => {
    const mockCsv = `name,value
Alice,100`;
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockCsv),
    });

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.schema).toBeDefined();
    expect(result.current.schema?.fields).toHaveLength(2);
    expect(result.current.schema?.fields.map((f) => f.name)).toEqual([
      "name",
      "value",
    ]);
  });

  it("should handle non-Error rejection", async () => {
    global.fetch = vi.fn().mockRejectedValue("String error");

    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "https://example.com/data.csv" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("String error");
  });

  it("should handle connector validation errors", async () => {
    const { result } = renderHook(() =>
      useConnector(csvConnector, { url: "" })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});
