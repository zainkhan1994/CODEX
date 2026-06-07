import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";

export const metadata: Metadata = {
  title: "Blueprint Mind Map Demo",
  description: "The earlier standalone MindMapViewer demo.",
};

export default function BlueprintMindMapDemoPage() {
  return <InterfaceExplorer initialView="mindmap-demo" />;
}
