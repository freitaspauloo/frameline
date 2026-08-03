import { CheckoutForm } from "@/components/checkout-form";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; material?: string }>;
}) {
  const { plan, material } = await searchParams;
  return <CheckoutForm initialMaterial={material} initialPlan={plan} />;
}
