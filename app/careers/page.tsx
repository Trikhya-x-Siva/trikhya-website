import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/CareersPage";

export const metadata: Metadata = { title: "Careers" };

export default function Page() {
  return <CareersPage />;
}
