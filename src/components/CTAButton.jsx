import * as React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const CTAButton = ({ label, to = "/vaults", trackEvent = true, className, ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (trackEvent) {
      console.log("📊 Tracking: CTA clicked →", label);
      // Optional: send to analytics service
      // track("cta_click", { label });
    }

    navigate(to);
  };

  return (
    <button
      data-slot="cta-button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "bg-gradient-to-r from-vauntico-gold to-vauntico-gold-hover text-black font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-vauntico-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50",
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
};

export default CTAButton;