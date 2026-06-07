import type { Metadata } from "next";
import { InterfaceExplorer } from "@/components/interface-explorer";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me",
};

export default function ContactPage() {
  return (
    <InterfaceExplorer initialView="contact">
      <div className="container py-20">
        <h1 className="mb-4 text-4xl font-bold">Contact</h1>
        <p className="mb-12 text-muted-foreground">
          Have a question or want to work together? Send me a message.
        </p>
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </div>
    </InterfaceExplorer>
  );
}
