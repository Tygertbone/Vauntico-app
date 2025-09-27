import CTAButton from '@/components/ui/CTAButton';;

export default function VaultCTA({ vaultId, label = "Unlock Vault", price, trackEvent = true }) {
  const to = `/checkout?vault=${vaultId}${price ? `&price=${price}` : ""}`;

  return (
    <CTAButton
      label={label}
      to={to}
      trackEvent={trackEvent}
      className="w-full mt-4 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
    / className="hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300">
  );
}