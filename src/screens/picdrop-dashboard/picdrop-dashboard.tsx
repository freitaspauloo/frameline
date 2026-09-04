"use client"

import type { ComponentType, ReactNode } from "react"
import { GeistSans } from "geist/font/sans"
import {
  CheckSquare,
  ChevronDown,
  Download,
  ExternalLink,
  Lightbulb,
  PanelLeftClose,
  Search,
  Settings,
  Trash2,
  Upload,
} from "lucide-react"
import { HiOutlinePhotograph } from "react-icons/hi"
import { IoIosArrowRoundBack, IoIosGitBranch } from "react-icons/io"
import { MdOutlineExplore, MdStorage } from "react-icons/md"
import type { IconType } from "react-icons"
import { cn } from "@/lib/utils"
import { CollectionFolderPreview } from "./background-collection-folder"
import { FramelineBrand } from "./frameline-brand"
import type { PicdropTheme } from "./themes"
import { usePicdropDashboardMotion } from "./use-picdrop-motion"
import "./picdrop-dashboard.css"

function ActivitiesNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-[15px] shrink-0", className)} aria-hidden>
      <path
        d="M8 2.4C6.4 2.4 5.2 3.7 5.2 5.2V8.1L3.8 10.2H12.2L10.8 8.1V5.2C10.8 3.7 9.6 2.4 8 2.4Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path d="M6.4 10.2H9.6" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path
        d="M7.1 11.4C7.3 12.1 7.9 12.6 8.6 12.6C9.3 12.6 9.9 12.1 10.1 11.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

function FeedbackNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-[15px] shrink-0", className)} aria-hidden>
      <path
        d="M3.2 3.8H12.8C13.3 3.8 13.7 4.2 13.7 4.7V9.3C13.7 9.8 13.3 10.2 12.8 10.2H6.4L3.8 12.2V4.7C3.8 4.2 4.2 3.8 4.7 3.8H3.2Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HelpCenterNavIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={cn("size-[15px] shrink-0", className)} aria-hidden>
      <rect x="3.2" y="3.2" width="9.6" height="9.6" rx="2.2" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M6.1 6.2C6.1 5.3 6.9 4.7 8 4.7C9.1 4.7 9.9 5.3 9.9 6.1C9.9 6.9 9.2 7.2 8.5 7.6C8.1 7.9 7.9 8.2 7.9 8.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.4" r="0.55" fill="currentColor" />
    </svg>
  )
}

type PicdropDashboardProps = {
  className?: string
  theme?: PicdropTheme
}

const FOLDER_IMAGES = [
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/components-assets/picdrop-dashboard/folder-img-1.png",
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/components-assets/picdrop-dashboard/folder-img-2.png",
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/components-assets/picdrop-dashboard/folder-img-3.png",
]

const FOLDER_IMAGE_ORDERS = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [2, 1, 0],
] as const

function folderPreviews(folderIndex: number) {
  const order = FOLDER_IMAGE_ORDERS[folderIndex % FOLDER_IMAGE_ORDERS.length] ?? FOLDER_IMAGE_ORDERS[0]
  return order.map((imageIndex) => FOLDER_IMAGES[imageIndex] ?? FOLDER_IMAGES[0])
}

const GALLERY_ITEMS = [
  {
    title: "Studio Portraits",
    photos: "105 photos",
    size: "4.3 GB",
    seed: "studio",
  },
  {
    title: "Outdoor Shoots",
    photos: "15 photos",
    size: "1.2 GB",
    seed: "outdoor",
  },
  {
    title: "Summer Campaign",
    photos: "12 photos",
    size: "850 MB",
    seed: "summer",
  },
  {
    title: "Product Shots",
    photos: "48 photos",
    size: "2.1 GB",
    seed: "product",
  },
]

const SHOOT_ROWS = [
  { name: "Studio Portraits", files: "48 photos", user: "John Doe", status: "Sent", activity: "Yesterday" },
  { name: "Outdoor Sessions", files: "32 photos", user: "John Doe", status: "Sent", activity: "2 days ago" },
  { name: "Summer Campaign", files: "12 photos", user: "John Doe", status: "Sent", activity: "3 days ago" },
  { name: "Product Launch", files: "24 photos", user: "John Doe", status: "Sent", activity: "Last week" },
  { name: "Editorial Lookbook", files: "64 photos", user: "John Doe", status: "Sent", activity: "Last week" },
  { name: "Brand Campaign", files: "28 photos", user: "John Doe", status: "Sent", activity: "2 weeks ago" },
  { name: "Wedding Album", files: "86 photos", user: "John Doe", status: "Sent", activity: "2 weeks ago" },
  { name: "Fashion Week", files: "41 photos", user: "John Doe", status: "Sent", activity: "3 weeks ago" },
  { name: "Architecture Set", files: "19 photos", user: "John Doe", status: "Sent", activity: "Last month" },
]

const TABLE_HEAD_CELL =
  "overflow-hidden border-b border-l border-black/10 bg-[#fafafa] px-5 py-3 align-middle"
const TABLE_BODY_CELL =
  "overflow-hidden border-b border-l border-black/10 bg-white px-5 py-3 align-middle"

const FEEDBACK = [
  { name: "claudia", action: "liked 5 photos", avatar: "CL" },
  { name: "Alam", action: "commented on Outdoor Sessions", avatar: "AL" },
  { name: "Sarah", action: "selected 12 favorites", avatar: "SA" },
  { name: "Mike", action: "downloaded gallery", avatar: "MI" },
  { name: "Elena", action: "liked 8 photos", avatar: "EL" },
  { name: "Noah", action: "commented on Studio Portraits", avatar: "NO" },
  { name: "Priya", action: "selected 6 favorites", avatar: "PR" },
  { name: "James", action: "downloaded Product Launch", avatar: "JA" },
  { name: "Maya", action: "liked 3 photos", avatar: "MA" },
]

const TEAM_AVATARS = ["JD", "AK", "PS", "RW"]

const DASHBOARD_AVATAR =
  "https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/components-assets/picdrop-dashboard/avatar.png"

function Avatar({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div className={cn("relative size-8 shrink-0 overflow-hidden rounded-full", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DASHBOARD_AVATAR} alt={label} className="size-full object-cover" />
    </div>
  )
}

const SIDEBAR_WIDTH = 260

export default function PicdropDashboard({ className, theme = "pink" }: PicdropDashboardProps) {
  const rootRef = usePicdropDashboardMotion(theme)

  return (
    <div
      ref={rootRef}
      className={cn(
        GeistSans.className,
        "picdrop-dashboard",
        `picdrop-theme-${theme}`,
        "relative min-h-dvh w-full overflow-x-hidden bg-[#f7f7f7] text-zinc-900",
        className,
      )}
    >
      {/* Fixed sidebar */}
      <aside
        data-pd-sidebar
        className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#ebebeb] bg-white"
        style={{ width: SIDEBAR_WIDTH }}
      >
        <div className="shrink-0 px-4 pb-3 pt-5">
          <div className="flex items-center justify-between px-1">
            <FramelineBrand />
            <button
              type="button"
              className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="size-4" strokeWidth={2} />
            </button>
          </div>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder="Search Anything..."
              className="picdrop-search h-9 w-full rounded-full border-0 bg-[#f3f3f3] pl-9 pr-3 text-[13px] outline-none placeholder:text-zinc-400 focus:bg-[#ececec] focus:ring-2"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-2">
          <nav className="space-y-0.5">
            <SidebarLink icon={MdOutlineExplore} label="Dashboard" active />
            <SidebarLink icon={HiOutlinePhotograph} label="Shoots" />
            <div>
              <SidebarLink
                icon={MdOutlineExplore}
                label="Galleries"
                trailing={<ChevronDown className="size-3.5 text-zinc-400" strokeWidth={2.5} />}
              />
              <div className="relative ml-[29px] mt-0.5 pl-3.5">
                <div
                  aria-hidden
                  className="absolute bottom-1 left-0 top-[-4px] w-px bg-[#e3e3e3]"
                />
                <SubLink label="Studio Portraits" count={105} />
                <SubLink label="Outdoor Shoots" count={15} />
                <SubLink label="Summer Campaign" count={12} isLast />
              </div>
            </div>
            <SidebarLink icon={ActivitiesNavIcon} label="Activities" />
            <SidebarLink icon={IoIosGitBranch} label="Integrations" />
          </nav>
        </div>

        <div data-pd-sidebar-footer data-pd-animate className="shrink-0 border-t border-[#f0f0f0] px-3 pb-4 pt-3">
          <div className="rounded-2xl border border-[#ececec] bg-[#fafafa] p-3.5">
            <div className="flex items-center gap-2">
              <MdStorage className="size-[15px] text-zinc-900" />
              <p className="text-xs font-semibold text-zinc-900">Storage</p>
            </div>
            <p className="mt-2 text-[13px] font-medium leading-snug text-zinc-500">
              1.00 GB used out of 1.5 GB
            </p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#e4e4e4]">
              <div data-pd-storage-fill className="picdrop-storage-fill h-full w-[67%] rounded-full" />
            </div>
            <button type="button" className="picdrop-upgrade-btn mt-3 w-full rounded-xl py-2 text-[13px] font-medium text-white transition">
              Upgrade plan
            </button>
          </div>

          <div className="mt-3 space-y-0.5">
            <SidebarLink icon={FeedbackNavIcon} label="Feedback" compact />
            <SidebarLink icon={HelpCenterNavIcon} label="Help Center" compact />
          </div>

          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#e5e7eb] bg-white px-2.5 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[11px] font-semibold text-zinc-500">
              PY
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-zinc-900">Pankaj Yadav</p>
              <p className="truncate text-xs text-zinc-500">Product Designer</p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
            >
              <Settings className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main — offset for fixed sidebar */}
      <main className="min-w-0 px-6 py-5 lg:px-8" style={{ marginLeft: SIDEBAR_WIDTH }}>
          {/* Top bar */}
          <div data-pd-enter data-pd-animate className="-mx-6 -mt-5 flex items-center justify-between self-stretch border-b border-black/10 bg-[#fafafa] p-5 lg:-mx-8">
            <button
              type="button"
              className="flex items-center gap-0.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              <IoIosArrowRoundBack className="size-[22px] shrink-0" />
              Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="mr-2 text-xs font-medium text-zinc-500">Recent Activity</span>
                <div className="flex -space-x-2">
                  {TEAM_AVATARS.map((label) => (
                    <Avatar key={label} label={label} className="size-7 border-2 border-white" />
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-[12px] border border-black/20 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <Lightbulb className="size-4 text-zinc-500" />
                What&apos;s new
              </button>
            </div>
          </div>

          {/* Welcome banner */}
          <div data-pd-enter data-pd-animate className="mt-5 flex items-center justify-between gap-4 self-stretch rounded-[20px] border border-black/10 bg-[#F4F4F4] p-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f3f4f6] text-zinc-400">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://aruyghvpjdiiuiesaupw.supabase.co/storage/v1/object/public/components-assets/picdrop-dashboard/banner-icon.svg"
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-[24px] font-medium leading-[160%] tracking-[-1.44px] text-black">
                  Good Evening, Pankaj!
                </h1>
                <p className="mt-1 text-[18px] font-normal leading-[160%] tracking-[-1.08px] text-[#919191]">
                  Here&apos;s recent activity on your shoots and video shoots
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <button
                type="button"
                className="picdrop-primary-btn flex items-center gap-2 rounded-[12px] border px-4 py-2.5 text-[13px] font-medium text-white transition"
              >
                <span className="text-[15px] leading-none">+</span>
                Create Gallery
              </button>
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-[12px] border border-black/20 bg-white px-3 py-2 text-[13px] font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                <HiOutlinePhotograph className="size-[15px] text-zinc-500" />
                New Shoots
              </button>
            </div>
          </div>

          {/* Galleries + feedback */}
          <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_364px]">
            <div className="flex min-w-0 w-full flex-col items-start gap-5 py-0">
              <div className="flex w-full gap-3">
                <StatCard data-pd-stat icon={StatPhotoIcon} label="Active Shoots" value="150" />
                <StatCard data-pd-stat icon={StatClockIcon} label="Pending selections" value="12" />
                <StatCard data-pd-stat icon={CheckSquare} label="Files Delivered" value="5,630" />
                <StatCard data-pd-stat icon={Download} label="Downloads this week" value="8" />
              </div>
              <div className="flex w-full flex-col items-start gap-5 rounded-[20px] border border-black/10 p-5">
                <div className="flex w-full items-center justify-between">
                  <h2 className="text-base font-semibold text-zinc-900">Recent Galleries</h2>
                  <button type="button" className="picdrop-link-accent text-sm font-medium text-zinc-500 transition">
                    view all
                  </button>
                </div>
                <div className="relative min-w-0 w-full">
                  <div className="scrollbar-none min-w-0 w-full overflow-x-auto">
                    <div className="flex w-full gap-3">
                      {GALLERY_ITEMS.map((gallery, index) => (
                        <div key={gallery.title} data-pd-gallery data-pd-animate className="w-[210px] shrink-0">
                          <CollectionFolderPreview
                            id={gallery.seed}
                            name={gallery.title}
                            previews={folderPreviews(index)}
                            subtitle={`${gallery.photos} · ${gallery.size}`}
                            tone="light"
                            grayscale
                            className="w-full"
                            frameClassName="h-[184px] w-[210px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#f7f7f7]"
                  />
                </div>
              </div>
            </div>

            <aside
              data-pd-feedback-panel
              data-pd-animate
              className="flex h-[416px] w-[364px] max-w-full flex-col items-start gap-5 rounded-[20px] border border-black/10 bg-white p-5"
            >
              <h2 className="text-base font-semibold text-zinc-900">Clients Feedback</h2>
              <div className="relative min-h-0 w-full flex-1">
                <ul className="scrollbar-none h-full space-y-4 overflow-y-auto">
                  {FEEDBACK.map((item) => (
                    <li key={item.name + item.action} data-pd-feedback data-pd-animate className="flex gap-3">
                      <Avatar label={item.avatar} className="size-9" />
                      <div className="min-w-0 text-sm leading-snug">
                        <span className="font-semibold text-zinc-900">{item.name}</span>{" "}
                        <span className="text-zinc-500">{item.action}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-white"
                />
              </div>
              <button
                type="button"
                className="w-full rounded-xl bg-[#f3f4f6] py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-200"
              >
                View all
              </button>
            </aside>
          </div>

          <section data-pd-table data-pd-animate className="mt-5 min-w-0 w-full overflow-hidden rounded-2xl border border-[#ededed] bg-white shadow-sm">
              <div className="flex flex-row items-center gap-3 border-b border-[#ededed] px-4 py-3.5">
                <div className="flex w-fit items-center gap-2 rounded-[10px] border border-black/10 bg-white px-3 py-2.5">
                  <Search className="size-4 shrink-0 text-zinc-400" />
                  <input
                    type="search"
                    placeholder="Search Employee..."
                    size={18}
                    className="w-auto bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  />
                </div>
                <div className="flex items-center overflow-hidden rounded-[10px] border border-black/10 pr-[5px]">
                  {["Sent", "Failed", "Pending"].map((tab, index) => (
                    <button
                      key={tab}
                      type="button"
                      className={cn(
                        "flex items-center justify-center gap-2.5 px-3 py-2.5 text-xs font-medium",
                        index < 2 && "border-r border-[#E6E6E6]",
                        index === 0 && "picdrop-tab-active rounded-l-[9px] text-zinc-900",
                        index !== 0 && "text-zinc-600 hover:bg-zinc-50",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="ml-auto flex items-center gap-[5px] rounded-[12px] border border-black/20 py-2 pl-3 pr-[5px] text-xs font-medium text-zinc-600"
                >
                  Recent
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
                  <colgroup>
                    {Array.from({ length: 6 }, (_, index) => (
                      <col key={index} className="w-[16.66%]" />
                    ))}
                  </colgroup>
                  <thead>
                    <tr className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      <th className={TABLE_HEAD_CELL}>
                        <span className="flex items-center gap-2">
                          <input type="checkbox" className="picdrop-check shrink-0" />
                          Shoot Name
                        </span>
                      </th>
                      <th className={TABLE_HEAD_CELL}>Files</th>
                      <th className={TABLE_HEAD_CELL}>Shared with</th>
                      <th className={TABLE_HEAD_CELL}>Status</th>
                      <th className={TABLE_HEAD_CELL}>Last Activity</th>
                      <th className={TABLE_HEAD_CELL}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHOOT_ROWS.map((row) => (
                      <tr key={row.name} data-pd-row data-pd-animate className="hover:bg-[#fafafa]">
                        <td className={TABLE_BODY_CELL}>
                          <span className="flex min-w-0 items-center gap-2 font-medium text-zinc-900">
                            <input type="checkbox" className="picdrop-check shrink-0" />
                            <span className="truncate">{row.name}</span>
                          </span>
                        </td>
                        <td className={TABLE_BODY_CELL}>
                          <span className="rounded-md bg-[#f3f4f6] px-2 py-1 text-xs font-medium text-zinc-600">
                            {row.files}
                          </span>
                        </td>
                        <td className={TABLE_BODY_CELL}>
                          <span className="flex items-center gap-2">
                            <Avatar label="JD" className="size-7" />
                            <span className="text-zinc-700">{row.user}</span>
                          </span>
                        </td>
                        <td className={TABLE_BODY_CELL}>
                          <span className="picdrop-status-sent inline-flex rounded-full px-2.5 py-1 text-xs font-semibold">
                            {row.status}
                          </span>
                        </td>
                        <td className={cn(TABLE_BODY_CELL, "text-zinc-500")}>{row.activity}</td>
                        <td className={TABLE_BODY_CELL}>
                          <span className="flex items-center gap-1">
                            <IconButton icon={Trash2} tone="danger" />
                            <IconButton icon={Upload} />
                            <IconButton icon={ExternalLink} />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
        </main>
    </div>
  )
}

function SidebarLink({
  icon: Icon,
  label,
  active,
  compact,
  trailing,
}: {
  icon: IconType | ComponentType<{ className?: string }>
  label: string
  active?: boolean
  compact?: boolean
  trailing?: ReactNode
}) {
  return (
    <button
      type="button"
      data-pd-nav
      data-pd-animate
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-2.5 text-[13px] font-medium transition",
        compact ? "py-2" : "py-2",
        active
          ? "picdrop-sidebar-active"
          : "text-zinc-600 hover:bg-[#f7f7f7] hover:text-zinc-900",
      )}
    >
      <Icon className={cn("size-[15px] shrink-0", active ? "picdrop-accent-icon" : "text-zinc-500")} />
      <span className="flex-1 text-left">{label}</span>
      {trailing}
    </button>
  )
}

function SubLink({ label, count, isLast }: { label: string; count: number; isLast?: boolean }) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute -left-3.5 top-1/2 h-px w-2.5 -translate-y-1/2 bg-[#e3e3e3]"
      />
      <button
        type="button"
        className={cn(
          "relative flex w-full items-center justify-between rounded-lg py-1.5 pr-0.5 text-[13px] text-zinc-600 transition hover:bg-[#f7f7f7] hover:text-zinc-900",
          isLast ? "pb-0.5" : "",
        )}
      >
        <span className="truncate">{label}</span>
        <span className="ml-2 shrink-0 tabular-nums text-xs font-medium text-zinc-400">{count}</span>
      </button>
    </div>
  )
}

function StatPhotoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M16.617 20.498C17.4558 20.4736 18.2657 20.1861 18.932 19.676C19.5984 19.166 20.0874 18.4603 20.33 17.657C20.44 17.291 20.5 16.902 20.5 16.5V7.5C20.5 6.43913 20.0786 5.42172 19.3284 4.67157C18.5783 3.92143 17.5609 3.5 16.5 3.5H7.5C6.43913 3.5 5.42172 3.92143 4.67157 4.67157C3.92143 5.42172 3.5 6.43913 3.5 7.5V16.57C3.51835 17.6187 3.94787 18.6182 4.69604 19.3533C5.4442 20.0884 6.45115 20.5002 7.5 20.5H16.5L16.617 20.498ZM20.33 17.657L20.242 17.553L17.776 14.577C17.5889 14.3513 17.3544 14.1694 17.0892 14.0443C16.824 13.9193 16.5346 13.8541 16.2414 13.8533C15.9482 13.8525 15.6584 13.9162 15.3925 14.0399C15.1267 14.1636 14.8913 14.3442 14.703 14.569L13.391 16.135L13.177 16.396M3.501 16.571L3.678 16.37L6.884 12.543C7.07172 12.319 7.30626 12.1388 7.57112 12.0152C7.83598 11.8916 8.12471 11.8275 8.417 11.8275C8.70929 11.8275 8.99802 11.8916 9.26288 12.0152C9.52774 12.1388 9.76228 12.319 9.95 12.543L13.177 16.396L16.524 20.392L16.617 20.498"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0938 10.4102C15.9222 10.4102 16.5938 9.73858 16.5938 8.91016C16.5938 8.08173 15.9222 7.41016 15.0938 7.41016C14.2653 7.41016 13.5938 8.08173 13.5938 8.91016C13.5938 9.73858 14.2653 10.4102 15.0938 10.4102Z"
        fill="currentColor"
      />
    </svg>
  )
}

function StatClockIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 8V13H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  ...rest
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  label: string
  value: string
} & React.ComponentPropsWithoutRef<"article">) {
  return (
    <article
      {...rest}
      data-pd-animate
      className="flex h-[108px] min-w-0 flex-1 items-end justify-between rounded-[12px] border border-black/10 bg-[#fafafa] p-3"
    >
      <div className="flex w-[100px] shrink-0 flex-col items-start justify-between self-stretch">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
      </div>
      <div className="picdrop-stat-icon flex items-center gap-2 rounded-[8px] border bg-white p-2">
        <Icon className="size-6 shrink-0" strokeWidth={2} />
      </div>
    </article>
  )
}

function IconButton({
  icon: Icon,
  tone,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  tone?: "danger"
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg p-1.5 transition",
        tone === "danger"
          ? "text-red-500 hover:bg-red-50"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600",
      )}
    >
      <Icon className="size-4" strokeWidth={2} />
    </button>
  )
}
