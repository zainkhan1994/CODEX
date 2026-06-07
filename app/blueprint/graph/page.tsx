import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";

export const metadata: Metadata = {
  title: "Blueprint Graph",
  description: "The graph and mind-map visualization of the Blueprint data.",
};

export default function BlueprintGraphPage() {
  return <InterfaceExplorer initialView="graph" />;
}
