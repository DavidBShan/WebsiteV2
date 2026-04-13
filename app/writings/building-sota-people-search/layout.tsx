import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Building SOTA People Search",
};

export default function BuildingSOTAPeopleSearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
