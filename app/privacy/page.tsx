import type { Metadata } from "next";
import { PRIVACY, TERMS } from "@/content/legal";
import { LegalPage } from "@/components/pages/LegalPage";

export const metadata: Metadata = { title: "Privacy policy", description: PRIVACY.lead };

export default function Page() {
  return <LegalPage doc={PRIVACY} other={TERMS} />;
}
