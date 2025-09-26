import CTAButton from "./CTAButton";

export default function VaultCTA({ vaultId, label = "Unlock Vault", price, trackEvent = true }) {
  const to = `/checkout?vault=${vaultId}${price ? `&price=${price}` : ""}`;

  return (
    <CTAButton
      label={label}
      to={to}
      trackEvent={trackEvent}
      className="w-full mt-4"
    />
  );
}