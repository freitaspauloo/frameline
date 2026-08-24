"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function MarketingFaq({
  className,
  items,
}: {
  className?: string;
  items: readonly { q: string; a: string }[];
}) {
  return (
    <Accordion className={cn("w-full", className)} multiple={false}>
      {items.map((item, index) => (
        <AccordionItem
          key={item.q}
          className="border-b border-border last:border-b-0 transition-colors [&:has([data-open])]:bg-muted/20"
          data-reveal
          value={item.q}
        >
          <AccordionTrigger className="gap-4 px-6 py-5 hover:no-underline sm:px-8 sm:py-6 lg:px-12 [&[data-panel-open]]:pb-3">
            <span className="flex min-w-0 flex-1 items-start gap-4 text-left">
              <span className="mt-0.5 shrink-0 font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                {item.q}
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-8 sm:pb-7 sm:text-[0.9375rem] lg:px-12 lg:pb-8">
            <p className="max-w-[42ch] pl-9">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
