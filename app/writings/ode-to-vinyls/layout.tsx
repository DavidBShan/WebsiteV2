import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ode to Vinyls",
};

export default function OdeToVinylsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
