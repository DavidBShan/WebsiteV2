import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading",
};

export default function ReadingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
