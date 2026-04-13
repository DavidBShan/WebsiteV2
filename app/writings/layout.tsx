import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writings",
};

export default function WritingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
