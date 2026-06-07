import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";
import { PortfolioHome } from "@/components/portfolio-home";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "The polished public-facing Blueprint portfolio experience.",
};

export default function PortfolioPage() {
  return (
    <InterfaceExplorer initialView="portfolio">
      <PortfolioHome />
    </InterfaceExplorer>
  );
}
