export default function AtheraHeroPreloader() {
  return (
    <div
      data-hero-preloader
      className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-[#f4f4f4]"
      aria-hidden
    >
      <div className="relative flex size-14 items-center justify-center">
        <div data-hero-preloader-ring className="absolute inset-0 rounded-full border-2" />
        <div data-hero-preloader-dot className="size-2.5 rounded-full" />
      </div>
    </div>
  )
}
