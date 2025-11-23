import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import DemoShowcasePage from "./showcase";
vi.mock("next/router", () => ({
    useRouter: () => ({ locale: "sr" }),
}));
vi.mock("@/components/demos/charts", () => ({
    ColumnChart: (props) => (<div data-testid="column-chart">{JSON.stringify(props)}</div>),
    LineChart: (props) => (<div data-testid="line-chart">{JSON.stringify(props)}</div>),
    PieChart: (props) => (<div data-testid="pie-chart">{JSON.stringify(props)}</div>),
}));
describe("DemoShowcasePage", () => {
    it("renders hero content and charts with Serbian locale", () => {
        render(<DemoShowcasePage />);
        expect(screen.getByText(/Demo Showcase vizualizacija/i)).toBeInTheDocument();
        expect(screen.getByText(/Snop najtrazenijih pokazatelja/i)).toBeInTheDocument();
        expect(screen.getByTestId("column-chart")).toBeInTheDocument();
        expect(screen.getByTestId("line-chart")).toBeInTheDocument();
        expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });
    it("switches copy when locale is English", async () => {
        vi.doMock("next/router", () => ({
            useRouter: () => ({ locale: "en" }),
        }));
        const { default: Page } = await import("./showcase");
        render(<Page />);
        expect(screen.getByText(/Demo Showcase Visualizations/i)).toBeInTheDocument();
        expect(screen.getByText(/Browse all demo pages/i)).toBeInTheDocument();
    });
});
