"use client";

import * as React from "react";
import Link from "next/link";
import {
  RiAddLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiAttachmentLine,
  RiBankCardLine,
  RiBold,
  RiCommandLine,
  RiCornerDownLeftLine,
  RiDashboardLine,
  RiExternalLinkLine,
  RiFileZipLine,
  RiGithubLine,
  RiHomeLine,
  RiImageLine,
  RiInboxLine,
  RiItalic,
  RiLogoutBoxRLine,
  RiMailLine,
  RiPlaneLine,
  RiRefreshLine,
  RiSearchLine,
  RiSettings3Line,
  RiShareLine,
  RiTeamLine,
  RiUnderline,
  RiUserLine,
  RiWifiLine,
} from "@remixicon/react";
import { AreaChart, Area, CartesianGrid, XAxis } from "recharts";

import preset from "./preset.json";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "@/components/ui/toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SectionLink = { id: string; label: string };

const SECTIONS: SectionLink[] = [
  { id: "accordion", label: "Accordion" },
  { id: "alert", label: "Alert" },
  { id: "alert-dialog", label: "Alert Dialog" },
  { id: "aspect-ratio", label: "Aspect Ratio" },
  { id: "attachment", label: "Attachment" },
  { id: "avatar", label: "Avatar" },
  { id: "badge", label: "Badge" },
  { id: "breadcrumb", label: "Breadcrumb" },
  { id: "bubble", label: "Bubble" },
  { id: "button", label: "Button" },
  { id: "button-group", label: "Button Group" },
  { id: "calendar", label: "Calendar" },
  { id: "card", label: "Card" },
  { id: "carousel", label: "Carousel" },
  { id: "chart", label: "Chart" },
  { id: "checkbox", label: "Checkbox" },
  { id: "collapsible", label: "Collapsible" },
  { id: "combobox", label: "Combobox" },
  { id: "command", label: "Command" },
  { id: "context-menu", label: "Context Menu" },
  { id: "dialog", label: "Dialog" },
  { id: "direction", label: "Direction" },
  { id: "drawer", label: "Drawer" },
  { id: "dropdown-menu", label: "Dropdown Menu" },
  { id: "empty", label: "Empty" },
  { id: "field", label: "Field" },
  { id: "hover-card", label: "Hover Card" },
  { id: "input", label: "Input" },
  { id: "input-group", label: "Input Group" },
  { id: "input-otp", label: "Input OTP" },
  { id: "item", label: "Item" },
  { id: "kbd", label: "Kbd" },
  { id: "label", label: "Label" },
  { id: "marker", label: "Marker" },
  { id: "menubar", label: "Menubar" },
  { id: "message", label: "Message" },
  { id: "message-scroller", label: "Message Scroller" },
  { id: "native-select", label: "Native Select" },
  { id: "navigation-menu", label: "Navigation Menu" },
  { id: "pagination", label: "Pagination" },
  { id: "popover", label: "Popover" },
  { id: "progress", label: "Progress" },
  { id: "radio-group", label: "Radio Group" },
  { id: "resizable", label: "Resizable" },
  { id: "scroll-area", label: "Scroll Area" },
  { id: "select", label: "Select" },
  { id: "separator", label: "Separator" },
  { id: "sheet", label: "Sheet" },
  { id: "sidebar", label: "Sidebar" },
  { id: "skeleton", label: "Skeleton" },
  { id: "slider", label: "Slider" },
  { id: "spinner", label: "Spinner" },
  { id: "switch", label: "Switch" },
  { id: "table", label: "Table" },
  { id: "tabs", label: "Tabs" },
  { id: "textarea", label: "Textarea" },
  { id: "toast", label: "Toast" },
  { id: "toggle", label: "Toggle" },
  { id: "toggle-group", label: "Toggle Group" },
  { id: "tooltip", label: "Tooltip" },
];

const CONFIG_ROWS = [
  ["Style", preset.style],
  ["Base color", preset.baseColor],
  ["Theme", preset.theme],
  ["Chart color", preset.chartColor],
  ["Heading font", preset.fontHeading],
  ["Body font", preset.font],
  ["Icon library", preset.iconLibrary],
  ["Radius", preset.radius],
] as const;

function Demo({
  id,
  title,
  description,
  className,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 space-y-3">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-semibold tracking-wide uppercase">
          {title}
        </h2>
        {description && (
          <p className="max-w-[65ch] text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className={cnPanel(className)}>{children}</div>
    </section>
  );
}

function cnPanel(className?: string) {
  return [
    "rounded-none border border-border bg-card p-6",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};

const FRAMEWORKS = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "Solid Start"];

function ComboboxDemo() {
  return (
    <Combobox items={FRAMEWORKS}>
      <ComboboxInput placeholder="Search framework..." showClear />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function CommandDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} className="gap-2">
        <RiSearchLine data-icon="inline-start" />
        Search commands
        <KbdGroup className="ml-2">
          <Kbd>
            <RiCommandLine className="size-3" />
          </Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                Calendar
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Search emoji
                <CommandShortcut>⌘E</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Launch app
                <CommandShortcut>⌘L</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Notifications</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-none border border-border"
    />
  );
}

function ProgressDemo() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="flex w-full flex-col gap-4">
      <Progress value={value}>
        <div className="flex w-full items-center justify-between">
          <ProgressLabel>Uploading</ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 10))}
        >
          -10
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.min(100, v + 10))}
        >
          +10
        </Button>
      </div>
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(1);
  const totalPages = 6;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#pagination"
            onClick={(e) => {
              e.preventDefault();
              setPage((p) => Math.max(1, p - 1));
            }}
          />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              href="#pagination"
              isActive={p === page}
              onClick={(e) => {
                e.preventDefault();
                setPage(p);
              }}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#pagination"
            onClick={(e) => {
              e.preventDefault();
              setPage((p) => Math.min(totalPages, p + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function SidebarDemo() {
  return (
    <div className="h-[420px] overflow-hidden rounded-none border border-border">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="none" className="border-r border-border">
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold">
              <RiDashboardLine className="size-4" />
              Frameline
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <RiHomeLine />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <RiTeamLine />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <RiBankCardLine />
                      <span>Billing</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <RiSettings3Line />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex items-center justify-center p-6 text-sm text-muted-foreground">
          Sidebar content area
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

function MessageScrollerDemo() {
  return (
    <div className="h-56 overflow-hidden rounded-none border border-border">
      <MessageScrollerProvider>
        <MessageScroller className="h-full">
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <MessageScrollerItem key={n}>
                  <Message align={n % 2 === 0 ? "end" : "start"}>
                    <MessageContent>
                      <Bubble variant={n % 2 === 0 ? "default" : "muted"}>
                        <BubbleContent>Message number {n}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  );
}

export default function ShadcnGallery() {
  return (
    <TooltipProvider delay={0}>
      <main className="min-h-dvh bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
          <header className="space-y-6 pb-10">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Local reference · /shadcn
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              Component gallery
            </h1>
            <p className="max-w-[65ch] text-muted-foreground">
              Every component in{" "}
              <code className="rounded-none bg-muted px-1.5 py-0.5 text-foreground">
                src/components/ui
              </code>{" "}
              rendered with live, interactive demos. Built from preset{" "}
              <code className="rounded-none bg-muted px-1.5 py-0.5 text-foreground">
                {preset.code}
              </code>{" "}
              (Sera · Stone · Blue · Inter · Geist heading · Remixicon).
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{preset.code}</Badge>
              <Badge variant="outline">{preset.style}</Badge>
              <Badge variant="outline">{preset.theme}</Badge>
              <Badge variant="outline">{preset.iconLibrary}</Badge>
            </div>

            <dl className="grid grid-cols-2 divide-y divide-border border border-border sm:grid-cols-4 sm:divide-y-0 sm:[&>div]:border-l sm:[&>div:first-child]:border-l-0">
              {CONFIG_ROWS.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 px-4 py-3">
                  <dt className="text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
                    {label}
                  </dt>
                  <dd className="text-sm font-medium capitalize">{value}</dd>
                </div>
              ))}
            </dl>

            <pre className="overflow-x-auto rounded-none border border-border bg-muted/40 p-4 text-xs leading-relaxed">
              {preset.apply}
              {"\n"}
              {preset.addAll}
            </pre>

            <div className="flex flex-wrap gap-3">
              <Button nativeButton={false} render={<Link href={preset.url} target="_blank" />}>
                Open preset
                <RiExternalLinkLine data-icon="inline-end" />
              </Button>
              <Button nativeButton={false} render={<Link href="/" />} variant="outline">
                Back home
              </Button>
            </div>
          </header>

          <nav className="sticky top-0 z-40 -mx-6 border-y border-border bg-background/95 px-6 py-3 backdrop-blur-sm supports-backdrop-filter:bg-background/80 lg:-mx-8 lg:px-8">
            <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-none border border-transparent px-2 py-1 text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="space-y-16 py-12">
            <Demo id="accordion" title="Accordion" description="Base UI accordion, multiple items expanded by default.">
              <Accordion defaultValue={["item-1"]} className="max-w-lg">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is Frameline?</AccordionTrigger>
                  <AccordionContent>
                    Frameline is a Next.js app styled with the Sera shadcn preset, Base UI
                    primitives, and Remix icons.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I open more than one item?</AccordionTrigger>
                  <AccordionContent>
                    Yes — this accordion allows multiple panels open simultaneously.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Where do the tokens live?</AccordionTrigger>
                  <AccordionContent>
                    In <code>src/app/globals.css</code>, snapshotted at{" "}
                    <code>src/app/shadcn/theme.css</code>.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Demo>

            <Demo id="alert" title="Alert" description="Default and destructive variants, with an inline action.">
              <div className="flex flex-col gap-4">
                <Alert>
                  <AlertTitle>Deployment scheduled</AlertTitle>
                  <AlertDescription>
                    Your changes will go live within the next 10 minutes.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Payment failed</AlertTitle>
                  <AlertDescription>
                    We couldn&apos;t charge your card. Update your billing details.
                  </AlertDescription>
                  <AlertAction>
                    <Button size="xs" variant="outline">
                      Fix
                    </Button>
                  </AlertAction>
                </Alert>
              </div>
            </Demo>

            <Demo id="alert-dialog" title="Alert Dialog" description="Blocking confirmation for a destructive action.">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive">Delete account</Button>} />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Demo>

            <Demo id="aspect-ratio" title="Aspect Ratio" description="Constrains child content to a fixed ratio.">
              <AspectRatio ratio={16 / 9} className="w-full max-w-sm bg-muted">
                <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                  16 / 9
                </div>
              </AspectRatio>
            </Demo>

            <Demo id="attachment" title="Attachment" description="File attachments in idle, done, and error states.">
              <AttachmentGroup>
                <Attachment state="done">
                  <AttachmentMedia>
                    <RiFileZipLine />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>brand-assets.zip</AttachmentTitle>
                    <AttachmentDescription>4.2 MB</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction>
                      <RiRefreshLine />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
                <Attachment state="uploading">
                  <AttachmentMedia>
                    <RiImageLine />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>cover-photo.png</AttachmentTitle>
                    <AttachmentDescription>Uploading…</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
                <Attachment state="error">
                  <AttachmentMedia>
                    <RiAttachmentLine />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>proposal.pdf</AttachmentTitle>
                    <AttachmentDescription>Upload failed</AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              </AttachmentGroup>
            </Demo>

            <Demo id="avatar" title="Avatar" description="Single avatar with badge, plus a stacked group.">
              <div className="flex flex-wrap items-center gap-6">
                <Avatar size="lg">
                  <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
                  <AvatarFallback>VC</AvatarFallback>
                  <AvatarBadge />
                </Avatar>
                <AvatarGroup>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>EF</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
              </div>
            </Demo>

            <Demo id="badge" title="Badge" description="All variants.">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="ghost">Ghost</Badge>
                <Badge variant="link" render={<Link href="/" />}>
                  Link
                </Badge>
              </div>
            </Demo>

            <Demo id="breadcrumb" title="Breadcrumb" description="Path navigation with a truncated ellipsis.">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link href="/shadcn" />}>Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Gallery</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </Demo>

            <Demo id="bubble" title="Bubble" description="Chat bubble content variants.">
              <div className="flex flex-col items-start gap-2">
                <Bubble>
                  <BubbleContent>Default bubble</BubbleContent>
                </Bubble>
                <Bubble variant="secondary">
                  <BubbleContent>Secondary bubble</BubbleContent>
                </Bubble>
                <Bubble variant="muted">
                  <BubbleContent>Muted bubble</BubbleContent>
                </Bubble>
                <Bubble variant="outline">
                  <BubbleContent>Outline bubble</BubbleContent>
                </Bubble>
              </div>
            </Demo>

            <Demo id="button" title="Button" description="Variants and sizes.">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">Extra small</Button>
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="outline">
                    <RiSettings3Line />
                  </Button>
                </div>
              </div>
            </Demo>

            <Demo id="button-group" title="Button Group" description="Segmented actions and a text/input pairing.">
              <div className="flex flex-col gap-4">
                <ButtonGroup>
                  <Button variant="outline">Day</Button>
                  <Button variant="outline">Week</Button>
                  <Button variant="outline">Month</Button>
                </ButtonGroup>
                <ButtonGroup>
                  <ButtonGroupText>
                    <RiSearchLine />
                  </ButtonGroupText>
                  <Input placeholder="Search…" />
                  <ButtonGroupSeparator />
                  <Button variant="outline" size="icon">
                    <RiAddLine />
                  </Button>
                </ButtonGroup>
              </div>
            </Demo>

            <Demo id="calendar" title="Calendar" description="Single-date selection with controlled state.">
              <CalendarDemo />
            </Demo>

            <Demo id="card" title="Card" description="Header, content, footer composition.">
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>Team plan</CardTitle>
                  <CardDescription>For growing product teams.</CardDescription>
                  <CardAction>
                    <Badge variant="secondary">Popular</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Unlimited projects, shared workspaces, and priority support.
                  </p>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button className="flex-1">Upgrade</Button>
                  <Button variant="outline" className="flex-1">
                    Compare
                  </Button>
                </CardFooter>
              </Card>
            </Demo>

            <Demo id="carousel" title="Carousel" description="Embla-powered carousel with previous/next controls.">
              <Carousel className="w-full max-w-sm">
                <CarouselContent>
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
                    <CarouselItem key={n}>
                      <div className="flex aspect-square items-center justify-center bg-muted text-4xl font-semibold text-muted-foreground">
                        {n}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </Demo>

            <Demo id="chart" title="Chart" description="Recharts area chart wired through ChartContainer.">
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </Demo>

            <Demo id="checkbox" title="Checkbox" description="Standalone checkbox with label.">
              <div className="flex items-center gap-2">
                <Checkbox id="terms" defaultChecked />
                <Label htmlFor="terms">Accept terms and conditions</Label>
              </div>
            </Demo>

            <Demo id="collapsible" title="Collapsible" description="Toggleable content region.">
              <Collapsible className="max-w-sm">
                <CollapsibleTrigger render={<Button variant="outline">Toggle details</Button>} />
                <CollapsibleContent className="mt-2 rounded-none border border-border p-4 text-sm text-muted-foreground">
                  Additional details are revealed here once the trigger is pressed.
                </CollapsibleContent>
              </Collapsible>
            </Demo>

            <Demo id="combobox" title="Combobox" description="Filterable input with popup list.">
              <ComboboxDemo />
            </Demo>

            <Demo id="command" title="Command" description="Command palette rendered inside a dialog.">
              <CommandDemo />
            </Demo>

            <Demo id="context-menu" title="Context Menu" description="Right-click the panel below.">
              <ContextMenu>
                <ContextMenuTrigger className="flex h-32 w-full items-center justify-center rounded-none border border-dashed border-border text-sm text-muted-foreground">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <RiArrowGoBackLine />
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <RiArrowGoForwardLine />
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <RiRefreshLine />
                    Reload
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuLabel>View</ContextMenuLabel>
                  <ContextMenuCheckboxItem checked>Show bookmarks</ContextMenuCheckboxItem>
                  <ContextMenuSeparator />
                  <ContextMenuRadioGroup defaultValue="comfortable">
                    <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
                    <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
                  </ContextMenuRadioGroup>
                </ContextMenuContent>
              </ContextMenu>
            </Demo>

            <Demo id="dialog" title="Dialog" description="Modal dialog with header, footer, and close button.">
              <Dialog>
                <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
                      <Input id="dialog-name" defaultValue="Ada Lovelace" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="dialog-username">Username</FieldLabel>
                      <Input id="dialog-username" defaultValue="@ada" />
                    </Field>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Demo>

            <Demo id="direction" title="Direction" description="Scopes Base UI positioning logic to RTL for a subtree.">
              <DirectionProvider direction="rtl">
                <div dir="rtl" className="flex items-center gap-3 rounded-none border border-border p-4">
                  <Button variant="outline" size="icon-sm">
                    <RiArrowGoBackLine />
                  </Button>
                  <p className="flex-1 text-sm text-muted-foreground">
                    هذه اللوحة تستخدم DirectionProvider لعكس اتجاه القراءة.
                  </p>
                  <Button size="sm">إجراء</Button>
                </div>
              </DirectionProvider>
            </Demo>

            <Demo id="drawer" title="Drawer" description="Bottom sheet with swipe-to-dismiss.">
              <Drawer>
                <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Move goal</DrawerTitle>
                    <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <Slider defaultValue={[350]} max={500} step={10} />
                  </div>
                  <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose render={<Button variant="outline">Cancel</Button>} />
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Demo>

            <Demo id="dropdown-menu" title="Dropdown Menu" description="Menu with submenu, separators, and destructive item.">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline">Options</Button>} />
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <RiUserLine />
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RiBankCardLine />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <RiTeamLine />
                        Invite team
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>By email</DropdownMenuItem>
                        <DropdownMenuItem>By link</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <RiLogoutBoxRLine />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Demo>

            <Demo id="empty" title="Empty" description="Empty state placeholder with icon and action.">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <RiInboxLine />
                  </EmptyMedia>
                  <EmptyTitle>No messages yet</EmptyTitle>
                  <EmptyDescription>
                    When you receive a message, it will show up here.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button size="sm">Compose message</Button>
                </EmptyContent>
              </Empty>
            </Demo>

            <Demo id="field" title="Field" description="Form field composition, including a toggle row.">
              <FieldSet className="max-w-md">
                <FieldLegend>Account</FieldLegend>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="field-email">Email</FieldLabel>
                    <Input id="field-email" type="email" placeholder="you@example.com" />
                    <FieldDescription>We&apos;ll never share your email.</FieldDescription>
                  </Field>
                  <FieldSeparator>Or</FieldSeparator>
                  <FieldLabel htmlFor="field-notifications">
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle>Email notifications</FieldTitle>
                        <FieldDescription>Receive updates about your account.</FieldDescription>
                      </FieldContent>
                      <Switch id="field-notifications" defaultChecked />
                    </Field>
                  </FieldLabel>
                </FieldGroup>
              </FieldSet>
            </Demo>

            <Demo id="hover-card" title="Hover Card" description="Preview card revealed on hover/focus.">
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <a
                      href="https://github.com/vercel"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4"
                    >
                      <RiGithubLine className="size-4" />
                      @vercel
                    </a>
                  }
                />
                <HoverCardContent>
                  <div className="flex gap-3">
                    <Avatar>
                      <AvatarImage src="https://github.com/vercel.png" alt="Vercel" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">@vercel</p>
                      <p className="text-sm text-muted-foreground">
                        Develop. Preview. Ship. The platform for frontend teams.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Demo>

            <Demo id="input" title="Input" description="Text input, including a disabled state.">
              <div className="grid max-w-sm gap-3">
                <Input placeholder="Email address" type="email" />
                <Input placeholder="Disabled" disabled />
              </div>
            </Demo>

            <Demo id="input-group" title="Input Group" description="Input with leading icon and trailing action.">
              <InputGroup className="max-w-sm">
                <InputGroupAddon>
                  <RiMailLine />
                </InputGroupAddon>
                <InputGroupInput placeholder="you@example.com" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton>Verify</InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Demo>

            <Demo id="input-otp" title="Input OTP" description="Six-digit one-time passcode input.">
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Demo>

            <Demo id="item" title="Item" description="List rows with media, content, and actions.">
              <ItemGroup className="max-w-md">
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <RiTeamLine />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Team workspace</ItemTitle>
                    <ItemDescription>Shared across 6 members.</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="icon-sm" variant="ghost">
                      <RiShareLine />
                    </Button>
                  </ItemActions>
                </Item>
                <ItemSeparator />
                <Item variant="outline">
                  <ItemMedia variant="icon">
                    <RiSettings3Line />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Preferences</ItemTitle>
                    <ItemDescription>Manage notifications and theme.</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button size="icon-sm" variant="ghost">
                      <RiShareLine />
                    </Button>
                  </ItemActions>
                </Item>
              </ItemGroup>
            </Demo>

            <Demo id="kbd" title="Kbd" description="Keyboard shortcut hints.">
              <div className="flex flex-col gap-3">
                <KbdGroup>
                  <Kbd>
                    <RiCommandLine className="size-3" />
                  </Kbd>
                  <Kbd>K</Kbd>
                </KbdGroup>
                <p className="text-sm text-muted-foreground">
                  Press{" "}
                  <KbdGroup>
                    <Kbd>Ctrl</Kbd>
                    <Kbd>
                      <RiCornerDownLeftLine className="size-3" />
                    </Kbd>
                  </KbdGroup>{" "}
                  to submit.
                </p>
              </div>
            </Demo>

            <Demo id="label" title="Label" description="Paired with a control.">
              <div className="flex max-w-sm flex-col gap-2">
                <Label htmlFor="label-input">Display name</Label>
                <Input id="label-input" placeholder="Ada Lovelace" />
              </div>
            </Demo>

            <Demo id="marker" title="Marker" description="Section markers used to label groups of content.">
              <div className="flex max-w-sm flex-col gap-4">
                <Marker>
                  <MarkerIcon>
                    <RiSettings3Line />
                  </MarkerIcon>
                  <MarkerContent>Default marker</MarkerContent>
                </Marker>
                <Marker variant="separator">
                  <MarkerContent>Separator marker</MarkerContent>
                </Marker>
                <Marker variant="border">
                  <MarkerContent>Border marker</MarkerContent>
                </Marker>
              </div>
            </Demo>

            <Demo id="menubar" title="Menubar" description="Desktop-style application menu.">
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger>File</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      New tab
                      <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      New window
                      <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                      <MenubarSubTrigger>Share</MenubarSubTrigger>
                      <MenubarSubContent>
                        <MenubarItem>Email link</MenubarItem>
                        <MenubarItem>Copy link</MenubarItem>
                      </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>
                      Log out
                      <MenubarShortcut>⇧⌘Q</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>Undo</MenubarItem>
                    <MenubarItem>Redo</MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                  <MenubarTrigger>View</MenubarTrigger>
                  <MenubarContent>
                    <MenubarCheckboxItem checked>Show sidebar</MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarRadioGroup defaultValue="comfortable">
                      <MenubarRadioItem value="compact">Compact</MenubarRadioItem>
                      <MenubarRadioItem value="comfortable">Comfortable</MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </Demo>

            <Demo id="message" title="Message" description="Chat thread built from Message, Bubble, and Avatar.">
              <MessageGroup className="max-w-md">
                <Message align="start">
                  <MessageAvatar>
                    <Avatar size="sm">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  </MessageAvatar>
                  <MessageContent>
                    <Bubble variant="muted">
                      <BubbleContent>Hey! How can I help today?</BubbleContent>
                    </Bubble>
                    <MessageFooter>9:41 AM</MessageFooter>
                  </MessageContent>
                </Message>
                <Message align="end">
                  <MessageContent>
                    <Bubble>
                      <BubbleContent>
                        Can you summarize the shadcn component gallery?
                      </BubbleContent>
                    </Bubble>
                    <MessageFooter>9:42 AM</MessageFooter>
                  </MessageContent>
                </Message>
              </MessageGroup>
            </Demo>

            <Demo id="message-scroller" title="Message Scroller" description="Auto-scrolling viewport with a jump-to-latest button.">
              <MessageScrollerDemo />
            </Demo>

            <Demo id="native-select" title="Native Select" description="Styled wrapper around the native <select>.">
              <NativeSelect defaultValue="next" className="max-w-xs">
                <NativeSelectOptGroup label="Frameworks">
                  <NativeSelectOption value="next">Next.js</NativeSelectOption>
                  <NativeSelectOption value="remix">Remix</NativeSelectOption>
                  <NativeSelectOption value="astro">Astro</NativeSelectOption>
                </NativeSelectOptGroup>
              </NativeSelect>
            </Demo>

            <Demo id="navigation-menu" title="Navigation Menu" description="Top-level menu with a content panel.">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-64 gap-1">
                        <li>
                          <NavigationMenuLink render={<Link href="/">Overview</Link>} />
                        </li>
                        <li>
                          <NavigationMenuLink render={<Link href="/shadcn">Components</Link>} />
                        </li>
                        <li>
                          <NavigationMenuLink render={<Link href="/">Pricing</Link>} />
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink render={<Link href="/">Docs</Link>} />
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </Demo>

            <Demo id="pagination" title="Pagination" description="Interactive page controls.">
              <PaginationDemo />
            </Demo>

            <Demo id="popover" title="Popover" description="Floating panel anchored to a trigger.">
              <Popover>
                <PopoverTrigger render={<Button variant="outline">Dimensions</Button>} />
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverTitle>Dimensions</PopoverTitle>
                    <PopoverDescription>Set the frame dimensions.</PopoverDescription>
                  </PopoverHeader>
                  <div className="grid gap-3">
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="popover-width">Width</FieldLabel>
                      <Input id="popover-width" defaultValue="100%" className="h-8" />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="popover-height">Height</FieldLabel>
                      <Input id="popover-height" defaultValue="25px" className="h-8" />
                    </Field>
                  </div>
                </PopoverContent>
              </Popover>
            </Demo>

            <Demo id="progress" title="Progress" description="Determinate progress with a live label and value.">
              <ProgressDemo />
            </Demo>

            <Demo id="radio-group" title="Radio Group" description="Single-select plan picker.">
              <RadioGroup defaultValue="pro" className="max-w-xs">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="free" id="plan-free" />
                  <Label htmlFor="plan-free">Free</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="pro" id="plan-pro" />
                  <Label htmlFor="plan-pro">Pro</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="team" id="plan-team" />
                  <Label htmlFor="plan-team">Team</Label>
                </div>
              </RadioGroup>
            </Demo>

            <Demo id="resizable" title="Resizable" description="Draggable panel group.">
              <ResizablePanelGroup orientation="horizontal" className="h-40 max-w-md rounded-none border border-border">
                <ResizablePanel defaultSize="50">
                  <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                    Panel one
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50">
                  <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                    Panel two
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </Demo>

            <Demo id="scroll-area" title="Scroll Area" description="Custom scrollbar over overflowing content.">
              <ScrollArea className="h-48 w-56 rounded-none border border-border">
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                    <div key={n} className="text-sm text-muted-foreground">
                      Row {n}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Demo>

            <Demo id="select" title="Select" description="Popup select list.">
              <Select defaultValue="apple">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="grape">Grape</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Demo>

            <Demo id="separator" title="Separator" description="Horizontal and vertical dividers.">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm font-medium">Frameline</p>
                  <p className="text-sm text-muted-foreground">Design systems platform</p>
                </div>
                <Separator />
                <div className="flex h-5 items-center gap-4 text-sm text-muted-foreground">
                  <span>Blog</span>
                  <Separator orientation="vertical" />
                  <span>Docs</span>
                  <Separator orientation="vertical" />
                  <span>Source</span>
                </div>
              </div>
            </Demo>

            <Demo id="sheet" title="Sheet" description="Side panel, opening from the right.">
              <Sheet>
                <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>
                      Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 px-8">
                    <Field>
                      <FieldLabel htmlFor="sheet-name">Name</FieldLabel>
                      <Input id="sheet-name" defaultValue="Ada Lovelace" />
                    </Field>
                  </div>
                  <SheetFooter>
                    <Button>Save changes</Button>
                    <SheetClose render={<Button variant="outline">Close</Button>} />
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </Demo>

            <Demo id="sidebar" title="Sidebar" description="App sidebar composed inside a bordered, height-limited frame.">
              <SidebarDemo />
            </Demo>

            <Demo id="skeleton" title="Skeleton" description="Loading placeholders.">
              <div className="flex max-w-sm items-center gap-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Demo>

            <Demo id="slider" title="Slider" description="Single-thumb and range variants.">
              <div className="flex max-w-sm flex-col gap-6">
                <Slider defaultValue={[50]} />
                <Slider defaultValue={[25, 75]} />
              </div>
            </Demo>

            <Demo id="spinner" title="Spinner" description="Loading indicator sizes.">
              <div className="flex items-center gap-4">
                <Spinner className="size-4" />
                <Spinner className="size-6" />
                <Spinner className="size-8 text-primary" />
              </div>
            </Demo>

            <Demo id="switch" title="Switch" description="Boolean toggles with labels.">
              <div className="flex max-w-sm flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Switch id="switch-airplane" />
                  <Label htmlFor="switch-airplane" className="flex items-center gap-1.5">
                    <RiPlaneLine className="size-3.5" />
                    Airplane mode
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="switch-wifi" defaultChecked size="sm" />
                  <Label htmlFor="switch-wifi" className="flex items-center gap-1.5">
                    <RiWifiLine className="size-3.5" />
                    Wi-Fi
                  </Label>
                </div>
              </div>
            </Demo>

            <Demo id="table" title="Table" description="Tabular data with header, body, and caption.">
              <Table>
                <TableCaption>Recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["INV001", "Paid", "Credit card", "$250.00"],
                    ["INV002", "Pending", "PayPal", "$150.00"],
                    ["INV003", "Unpaid", "Bank transfer", "$350.00"],
                  ].map(([invoice, status, method, amount]) => (
                    <TableRow key={invoice}>
                      <TableCell className="font-medium">{invoice}</TableCell>
                      <TableCell>{status}</TableCell>
                      <TableCell>{method}</TableCell>
                      <TableCell className="text-right">{amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Demo>

            <Demo id="tabs" title="Tabs" description="Panels switched by tab triggers.">
              <Tabs defaultValue="account" className="max-w-sm">
                <TabsList>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="space-y-3 pt-2">
                  <Field>
                    <FieldLabel htmlFor="tabs-name">Name</FieldLabel>
                    <Input id="tabs-name" defaultValue="Ada Lovelace" />
                  </Field>
                </TabsContent>
                <TabsContent value="password" className="space-y-3 pt-2">
                  <Field>
                    <FieldLabel htmlFor="tabs-password">New password</FieldLabel>
                    <Input id="tabs-password" type="password" />
                  </Field>
                </TabsContent>
              </Tabs>
            </Demo>

            <Demo id="textarea" title="Textarea" description="Multi-line text input.">
              <div className="grid max-w-sm gap-2">
                <Label htmlFor="textarea-bio">Bio</Label>
                <Textarea id="textarea-bio" placeholder="Tell us about yourself" rows={4} />
              </div>
            </Demo>

            <Demo id="toast" title="Toast" description="Transient notifications via the toast manager.">
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: "Event created",
                      description: "Monday, July 28th at 8:30pm.",
                    })
                  }
                >
                  Default
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: "Changes saved",
                      description: "Your profile has been updated.",
                      type: "success",
                    })
                  }
                >
                  Success
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast.add({
                      title: "Something went wrong",
                      description: "Please try again.",
                      type: "error",
                    })
                  }
                >
                  Error
                </Button>
              </div>
              <Toaster />
            </Demo>

            <Demo id="toggle" title="Toggle" description="Single pressed/unpressed control.">
              <Toggle aria-label="Toggle bold" defaultPressed>
                <RiBold />
              </Toggle>
            </Demo>

            <Demo id="toggle-group" title="Toggle Group" description="Multiple selection formatting controls.">
              <ToggleGroup multiple defaultValue={["bold"]} variant="outline">
                <ToggleGroupItem value="bold" aria-label="Bold">
                  <RiBold />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Italic">
                  <RiItalic />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Underline">
                  <RiUnderline />
                </ToggleGroupItem>
              </ToggleGroup>
            </Demo>

            <Demo id="tooltip" title="Tooltip" description="Hover/focus hint anchored to a trigger.">
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="icon"><RiSettings3Line /></Button>} />
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </Demo>
          </div>

          <p className="border-t border-border pt-6 text-xs text-muted-foreground">
            Files: <code>src/app/shadcn/preset.json</code>,{" "}
            <code>src/app/shadcn/theme.css</code>,{" "}
            <code>src/app/shadcn/gallery.tsx</code>
          </p>
        </div>
      </main>
    </TooltipProvider>
  );
}
