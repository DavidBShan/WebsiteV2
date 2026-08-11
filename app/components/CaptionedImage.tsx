import type { ReactNode } from "react";

type CaptionedImageProps = {
  caption: string;
  children: ReactNode;
  className?: string;
};

// wraps any image in a hover target: hovering veils the image in gray and
// fades the caption in over it. an empty caption renders the image untouched
// so half-written caption lists still look intentional.
export function CaptionedImage({
  caption,
  children,
  className,
}: CaptionedImageProps) {
  if (!caption) {
    return <>{children}</>;
  }

  return (
    <figure
      className={["captioned-image", className].filter(Boolean).join(" ")}
    >
      {children}
      <figcaption className="captioned-image-caption">{caption}</figcaption>
    </figure>
  );
}
