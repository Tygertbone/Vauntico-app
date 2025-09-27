import CTAButton from '@/components/ui/CTAButton';;

export default function PlanCTA({ planId, label = "Choose Plan", vaultBundle, promoCode, className }) {
  let to = `/checkout?plan=${planId}`;
  if (vaultBundle) to += `&vault=${vaultBundle}`;
  if (promoCode) to += `&promo=${promoCode}`;

  return (
    <CTAButton
      label={label}
      to={to}
      trackEvent={true}
      className={className}
    / className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
  );
}