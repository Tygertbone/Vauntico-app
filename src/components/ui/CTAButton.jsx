import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

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
      console.log("📊 Tracking: CTA clicked →", label);
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
      onClick={handleClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "bg-gradient-to-r from-vauntico-gold to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-vauntico-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50 disabled:cursor-not-allowed",
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
  trackEvent: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CTAButton;