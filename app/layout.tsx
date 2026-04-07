import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMIEV — Centre de Médecine Intégrative des Eaux-Vives",
  description:
    "Centre de médecine intégrative à Genève réunissant physiothérapie, ostéopathie, psychiatrie, homéopathie, fasciathérapie et Pilates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
