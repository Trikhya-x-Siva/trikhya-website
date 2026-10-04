import type { Metadata } from "next";
import { PRIVACY, TERMS } from "@/content/legal";
import { LegalPage } from "@/components/pages/LegalPage";

export const metadata: Metadata = { title: "Terms of use", description: TERMS.lead };

export default function Page() {
  return <LegalPage doc={TERMS} other={PRIVACY} />;
}
