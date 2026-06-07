import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";

export const metadata: Metadata = {
  title: "Blueprint Logo Map",
  description: "The app-logo map interface from the legacy Blueprint visualizer.",
};

export default function BlueprintLogoMapPage() {
  return <InterfaceExplorer initialView="logo-map" />;
}
