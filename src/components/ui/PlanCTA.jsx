import CTAButton from '@/components/ui/CTAButton';
import PropTypes from 'prop-types';

export default function PlanCTA({ planId, label = "Choose Plan", vaultBundle, promoCode, className, trackEvent = "plan_cta_click" }) {
  let to = `/checkout?plan=${planId}`;
  if (vaultBundle) to += `&vault=${vaultBundle}`;
  if (promoCode) to += `&promo=${promoCode}`;

  return (
    <CTAButton
      label={label}
      to={to}
      trackEvent={trackEvent}
      className={`hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300 ${className || ''}`}
    />
  );
}

PlanCTA.propTypes = {
  planId: PropTypes.string.isRequired,
  label: PropTypes.string,
  vaultBundle: PropTypes.string,
  promoCode: PropTypes.string,
  className: PropTypes.string,
  trackEvent: PropTypes.string,
};