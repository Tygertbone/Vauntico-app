import * as React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";

// ✅ Global Vauntico polish applied
const Link = ({ className = "", children, ...props }) => {
  return (
    <RouterLink
      className={clsx(
        className,
        "hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
      )}
      {...props}
    >
      {children}
    </RouterLink>
  );
};

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Link };