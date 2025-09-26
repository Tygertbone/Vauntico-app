import CTAButton from "./CTAButton";

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
    />
  );
}