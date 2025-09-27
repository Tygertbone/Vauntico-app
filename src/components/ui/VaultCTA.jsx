import CTAButton from '@/components/ui/CTAButton';
import PropTypes from 'prop-types';

export default function VaultCTA({ vaultId, label = "Unlock Vault", price, trackEvent = "vault_cta_click", className }) {
  const to = `/checkout?vault=${vaultId}${price ? `&price=${price}` : ""}`;

  return (
    <CTAButton
      label={label}
      to={to}
      trackEvent={trackEvent}
      className={`w-full mt-4 hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300 ${className || ''}`}
    />
  );
}

VaultCTA.propTypes = {
  vaultId: PropTypes.string.isRequired,
  label: PropTypes.string,
  price: PropTypes.string,
  trackEvent: PropTypes.string,
  className: PropTypes.string,
};