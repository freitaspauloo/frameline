import { ATHERA_ASSETS } from "./constants"

export function PartnerLogos() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- dev preview marketing strip
    <img
      alt="Google, Microsoft, Stripe, and Amazon"
      className="h-[39px] w-auto"
      src={ATHERA_ASSETS.partnerLogos}
    />
  )
}
