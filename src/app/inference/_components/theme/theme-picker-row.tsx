"use client";

import {
  RiCheckLine,
  RiPaletteLine,
  RiSparklingLine,
} from "@remixicon/react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ThemePickerOption {
  label: string;
  value: string;
}

export function ThemePickerRow({
  label,
  value,
  options,
  onChange,
  swatch,
  icon: Icon = RiPaletteLine,
}: {
  label: string;
  value: string;
  options: ThemePickerOption[];
  onChange: (value: string) => void;
  swatch?: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border/80 bg-card/70 px-3 py-2.5 text-left transition-colors hover:bg-muted/40",
        )}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border/70 bg-muted/30"
          style={swatch ? { backgroundColor: swatch } : undefined}
        >
          {!swatch ? <Icon className="size-3.5 text-muted-foreground" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] text-muted-foreground">{label}</span>
          <span className="block truncate font-medium text-sm">
            {selected?.label ?? value}
          </span>
        </span>
        <Icon className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}…`} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => onChange(option.value)}
                  value={option.label}
                >
                  <span className="flex-1">{option.label}</span>
                  {option.value === value ? (
                    <RiCheckLine className="size-4" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function ThemePanelActions({
  presetCode,
  createUrl,
  applyCommand,
  onShuffle,
  className,
}: {
  presetCode: string;
  createUrl: string;
  applyCommand: string;
  onShuffle: () => void;
  className?: string;
}) {
  const copyCommand = async () => {
    await navigator.clipboard.writeText(applyCommand);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="rounded-xl border border-border/80 bg-muted/20 px-3 py-2 font-mono text-[11px] text-muted-foreground">
        --preset {presetCode}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          nativeButton={false}
          render={<a href={createUrl} rel="noreferrer" target="_blank" />}
          size="sm"
          variant="outline"
        >
          Open preset
        </Button>
        <Button onClick={onShuffle} size="sm" variant="outline">
          Shuffle
        </Button>
      </div>
      <Button className="w-full" onClick={copyCommand} size="sm">
        Get code
      </Button>
    </div>
  );
}

export const ThemeIcons = {
  chart: RiSparklingLine,
  font: RiPaletteLine,
  palette: RiPaletteLine,
  shape: RiPaletteLine,
};
