"use client";

import { RiSideBarLine } from "@remixicon/react";
import { useMemo, useState } from "react";

import { useInferenceTheme } from "@/app/inference/_components/theme/theme-provider";
import {
  ThemePanelActions,
  ThemePickerRow,
  ThemeIcons,
} from "@/app/inference/_components/theme/theme-picker-row";
import {
  BASE_COLOR_OPTIONS,
  CHART_COLOR_OPTIONS,
  FONT_HEADING_OPTIONS,
  FONT_OPTIONS,
  ICON_LIBRARY_OPTIONS,
  MENU_ACCENT_OPTIONS,
  MENU_COLOR_OPTIONS,
  RADIUS_OPTIONS,
  STYLE_OPTIONS,
  themesForBaseColor,
} from "@/app/inference/_lib/preset-config";
import {
  resolveInferenceThemeVars,
  themeSwatchColor,
} from "@/app/inference/_lib/resolve-theme";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function ThemePanelBody({ className }: { className?: string }) {
  const {
    applyCommand,
    config,
    createUrl,
    presetCode,
    setField,
    shuffle,
  } = useInferenceTheme();

  const themeOptions = useMemo(
    () => themesForBaseColor(config.baseColor),
    [config.baseColor],
  );

  const baseSwatch = themeSwatchColor(
    resolveInferenceThemeVars({ ...config, theme: config.baseColor }),
  );
  const themeSwatch = themeSwatchColor(resolveInferenceThemeVars(config));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <ThemePickerRow
        icon={ThemeIcons.shape}
        label="Style"
        onChange={(value) =>
          setField("style", value as typeof config.style)
        }
        options={STYLE_OPTIONS}
        value={config.style}
      />
      <ThemePickerRow
        label="Base color"
        onChange={(value) =>
          setField("baseColor", value as typeof config.baseColor)
        }
        options={BASE_COLOR_OPTIONS}
        swatch={baseSwatch}
        value={config.baseColor}
      />
      <ThemePickerRow
        label="Theme"
        onChange={(value) => setField("theme", value as typeof config.theme)}
        options={themeOptions}
        swatch={themeSwatch}
        value={config.theme}
      />
      <ThemePickerRow
        icon={ThemeIcons.chart}
        label="Chart color"
        onChange={(value) =>
          setField("chartColor", value as typeof config.chartColor)
        }
        options={CHART_COLOR_OPTIONS.filter((option) =>
          themeOptions.some((theme) => theme.value === option.value),
        )}
        value={config.chartColor ?? config.theme}
      />
      <ThemePickerRow
        icon={ThemeIcons.font}
        label="Heading"
        onChange={(value) =>
          setField("fontHeading", value as typeof config.fontHeading)
        }
        options={FONT_HEADING_OPTIONS}
        value={config.fontHeading}
      />
      <ThemePickerRow
        icon={ThemeIcons.font}
        label="Font"
        onChange={(value) => setField("font", value as typeof config.font)}
        options={FONT_OPTIONS}
        value={config.font}
      />
      <ThemePickerRow
        label="Icon library"
        onChange={(value) =>
          setField("iconLibrary", value as typeof config.iconLibrary)
        }
        options={ICON_LIBRARY_OPTIONS}
        value={config.iconLibrary}
      />
      <ThemePickerRow
        label="Radius"
        onChange={(value) => setField("radius", value as typeof config.radius)}
        options={RADIUS_OPTIONS}
        value={config.radius}
      />
      <ThemePickerRow
        label="Menu accent"
        onChange={(value) =>
          setField("menuAccent", value as typeof config.menuAccent)
        }
        options={MENU_ACCENT_OPTIONS}
        value={config.menuAccent}
      />
      <ThemePickerRow
        label="Menu"
        onChange={(value) =>
          setField("menuColor", value as typeof config.menuColor)
        }
        options={MENU_COLOR_OPTIONS}
        value={config.menuColor}
      />

      <ThemePanelActions
        applyCommand={applyCommand}
        className="pt-2"
        createUrl={createUrl}
        onShuffle={shuffle}
        presetCode={presetCode}
      />
    </div>
  );
}

export function InferenceThemePanel() {
  return (
    <aside className="hidden w-72 shrink-0 overflow-y-auto border-border border-l bg-background/95 p-3 xl:block">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="font-medium text-sm">Theme</p>
        <span className="text-[10px] text-muted-foreground">shadcn create</span>
      </div>
      <ThemePanelBody />
    </aside>
  );
}

export function InferenceThemePanelMobile() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        render={
          <Button
            aria-label="Open theme panel"
            className="xl:hidden"
            size="icon-sm"
            variant="outline"
          />
        }
      >
        <RiSideBarLine />
      </SheetTrigger>
      <SheetContent className="w-[min(100vw-2rem,20rem)] gap-4 overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle>Theme</SheetTitle>
        </SheetHeader>
        <ThemePanelBody />
      </SheetContent>
    </Sheet>
  );
}
