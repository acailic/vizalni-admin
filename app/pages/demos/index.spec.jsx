import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DemosIndex from "./index";
import { DEMO_CONFIGS } from "@/lib/demos/config";
vi.mock("next/router", () => ({
    useRouter: () => ({ locale: "sr" }),
}));
describe("DemosIndex", () => {
    it("renders intro and a card per demo config", () => {
        const { container } = render(<DemosIndex />);
        expect(screen.getByText(/Galerija Demo Vizualizacija/i)).toBeInTheDocument();
        const sampleTitles = Object.values(DEMO_CONFIGS)
            .slice(0, 3)
            .map((c) => c.title.sr);
        sampleTitles.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });
        const cards = container.querySelectorAll(".MuiCard-root");
        expect(cards.length).toBeGreaterThanOrEqual(sampleTitles.length);
    });
    it("shows CTA to open showcase", () => {
        render(<DemosIndex />);
        expect(screen.getByText(/Otvori showcase/i)).toBeInTheDocument();
    });
});
