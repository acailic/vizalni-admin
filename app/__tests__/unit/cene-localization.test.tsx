import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";

import { LocaleProvider } from "@/locales/use-locale";
import CenePage from "@/pages/cene";
import { render, screen } from "@/test-utils";

describe("/cene localization", () => {
  it("renders English table and filter values consistently in English mode", () => {
    render(
      <LocaleProvider value="en">
        <CenePage
          initialData={{
            data: [
              {
                id: "1",
                naziv: "Лаптоп Dell Inspiron 15",
                proizvodjac: "Dell",
                kategorija: "Електроника",
                cenaRegular: 89999,
                cenaPopust: 79999,
                cenaPoJedinici: "RSD/kom",
                valuta: "RSD",
                lokacija: "Београд",
                datum: "2026-03-09T00:00:00.000Z",
              },
            ],
            stats: {
              totalProducts: 1,
              averagePrice: 89999,
              categories: ["Електроника"],
              retailers: ["Demo"],
            },
          }}
        />
      </LocaleProvider>
    );

    expect(screen.getByText("Price analysis")).toBeVisible();
    expect(screen.getByText("Search results")).toBeVisible();
    expect(screen.getByText("Product name")).toBeVisible();
    expect(screen.getByRole("option", { name: "Electronics" })).toBeVisible();
    expect(screen.getAllByText("Belgrade").length).toBeGreaterThan(0);
  });
});
