import Image from "next/image";
import Link from "next/link";

const SRC = "/brand/evolusg-logo.png";

const sizes = {
  sm: 48,
  md: 88,
  lg: 168,
} as const;

export function BrandLogo({
  href = "/",
  size = "md",
  priority = false,
  className,
}: {
  href?: string;
  size?: keyof typeof sizes;
  priority?: boolean;
  className?: string;
}) {
  const px = sizes[size];
  const image = (
    <Image
      alt="EvolUSG"
      className={["rounded-2xl", className].filter(Boolean).join(" ")}
      height={px}
      priority={priority}
      src={SRC}
      width={px}
    />
  );

  if (!href) {
    return image;
  }

  return (
    <Link aria-label="EvolUSG" className="inline-flex shrink-0" href={href}>
      {image}
    </Link>
  );
}
