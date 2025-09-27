import * as React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import clsx from "clsx";

// ✅ CTAButton enforces Vauntico polish globally
const CTAButton = ({
  to,
  label,
  trackEvent,
  className = "",
  children,
  ...props
}) => {
  const handleClick = () => {
    if (trackEvent) {
      console.log(`Tracking event: ${trackEvent}`);
      // 🔧 Hook into analytics here if needed
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      aria-label={label}
      className={clsx(
        className,
        "hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300 inline-flex items-center justify-center rounded-md font-medium"
      )}
      {...props}
    >
      {children || label}
    </Link>
  );
};

// ✅ Prop validation
CTAButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  trackEvent: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CTAButton;