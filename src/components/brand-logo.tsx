import Image from "next/image";
import Link from "next/link";
import { cn } from "@/components/ui";

const SRC = "/brand/evolusg-logo.png";

const sizes = {
  sm: { width: 140, height: 56 },
  md: { width: 200, height: 80 },
  lg: { width: 280, height: 112 },
} as const;

export function BrandLogo({
  href = "/",
  size = "md",
  priority = false,
  className,
}: {
  href?: string | null;
  size?: keyof typeof sizes;
  priority?: boolean;
  className?: string;
}) {
  const dims = sizes[size];
  const image = (
    <Image
      alt="evolUSG"
      className={cn("m-0 block h-auto w-auto object-contain p-0", className)}
      height={dims.height}
      priority={priority}
      src={SRC}
      width={dims.width}
    />
  );

  if (href === null) {
    return image;
  }

  return (
    <Link aria-label="evolUSG" className="m-0 inline-flex shrink-0 p-0" href={href}>
      {image}
    </Link>
  );
}
