import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { trackAnalyticsEvent } from "@/utils/analytics";

const CTAButton = ({
  to = "/vaults",
  label,
  trackEvent = true,
  className,
  onClick,
  disabled = false,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) return;

    if (trackEvent) {
      const eventName = typeof trackEvent === "string" ? trackEvent : "cta_click";
      trackAnalyticsEvent(eventName, { label, to });
    }

    if (onClick) {
      onClick(e);
    } else {
      window.location.href = to;
    }
  };

  return (
    <button
      data-slot="cta-button"
      data-event={typeof trackEvent === "string" ? trackEvent : undefined}
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
className={cn(
        "bg-gradient-to-r from-[var(--vauntico-gold)] to-[var(--vauntico-gold-hover)] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vauntico-gold-hover)]/50 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {label}
    </button>
  );
};

CTAButton.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string,
  trackEvent: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CTAButton;