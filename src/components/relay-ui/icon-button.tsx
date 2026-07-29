import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Figma System · IconButton (51:28) */
const relayIconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-relay-md text-relay-secondary hover:text-relay-ink",
        muted:
          "rounded-relay-md bg-relay-muted text-relay-secondary hover:text-relay-ink",
      },
      size: {
        sm: "size-8",
        md: "size-8",
        send: "size-9 rounded-relay-md bg-relay-blue text-relay-white hover:bg-relay-blue-deep",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type RelayIconButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof relayIconButtonVariants>;

export function RelayIconButton({
  className,
  variant,
  size,
  ...props
}: RelayIconButtonProps) {
  return (
    <ButtonPrimitive
      className={cn(relayIconButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
