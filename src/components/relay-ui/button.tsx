import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Figma System · Button (38:2) — DS variants only */
const relayButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "rounded-relay-md bg-relay-blue px-4 py-3 text-[13px] font-medium text-relay-white hover:bg-relay-blue-deep",
        secondary:
          "rounded-relay-md border border-relay-border bg-relay-white px-4 py-3 text-[13px] font-medium text-relay-ink hover:bg-relay-panel",
        ghost:
          "rounded-relay-md bg-transparent px-4 py-3 text-[13px] font-medium text-relay-blue hover:text-relay-blue-deep",
        /** Product-screen only — not part of DS (Screens · Chat nav) */
        "nav-cta":
          "rounded-full bg-relay-ink px-[18px] py-2.5 text-sm font-medium text-relay-white hover:bg-relay-ink/90",
        /** Product-screen only — marketing nav outline pill */
        "nav-secondary":
          "rounded-full border border-relay-border bg-relay-white px-[18px] py-2.5 text-sm font-medium text-relay-ink hover:bg-relay-panel",
        /** Product-screen only — not part of DS */
        "nav-ghost":
          "bg-transparent px-0 py-2 text-sm font-normal text-relay-secondary hover:text-relay-ink",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type RelayButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof relayButtonVariants>;

export function RelayButton({
  className,
  variant,
  ...props
}: RelayButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(relayButtonVariants({ variant }), className)}
      {...props}
    />
  );
}
