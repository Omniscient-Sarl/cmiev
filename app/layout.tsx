import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMIEV — Centre de Médecine Intégrative des Eaux-Vives",
  description:
    "Centre de médecine intégrative à Genève réunissant physiothérapie, ostéopathie, psychiatrie, homéopathie, fasciathérapie et Pilates.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      {children}
      <Analytics />
    </ClerkProvider>
  );
}
