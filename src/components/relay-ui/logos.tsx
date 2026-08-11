import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

/**
 * Frameline brand mark — pinwheel frame (4 L-segments).
 * 1 logo blue (blue on white) · 2 logo white (white on blue) · logo no bg
 */
function LogoImg({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      aria-hidden
      className={cn("aspect-square shrink-0 object-contain", className)}
      draggable={false}
      height={550}
      src={src}
      width={550}
    />
  );
}

/** 1 · logo blue — blue mark on white rounded field */
export function Logo01({ className }: LogoProps) {
  return (
    <LogoImg alt="Frameline" className={className} src="/relay/logo-01.png" />
  );
}

/** 2 · logo white — white mark on blue field (dock / dark surfaces) */
export function Logo02({ className }: LogoProps) {
  return (
    <LogoImg alt="Frameline" className={className} src="/relay/logo-02.png" />
  );
}

/** logo no bg — blue mark on transparent */
export function LogoMark({ className }: LogoProps) {
  return (
    <LogoImg
      alt="Frameline"
      className={className}
      src="/relay/logo-mark.png"
    />
  );
}

/** Horizontal lockup — mark + Frameline wordmark */
export function LogoLockupHorizontal({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="size-8" />
      <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
        Frameline
      </span>
    </span>
  );
}

/** Stacked lockup — mark over wordmark */
export function LogoLockupStacked({ className }: LogoProps) {
  return (
    <span className={cn("inline-flex flex-col items-center gap-2", className)}>
      <LogoMark className="size-12" />
      <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
        Frameline
      </span>
    </span>
  );
}
