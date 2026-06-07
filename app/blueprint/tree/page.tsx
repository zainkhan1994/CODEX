import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";

export const metadata: Metadata = {
  title: "Blueprint Tree",
  description: "The original folder-and-file Blueprint experience.",
};

export default function BlueprintTreePage() {
  return <InterfaceExplorer initialView="tree" />;
}
