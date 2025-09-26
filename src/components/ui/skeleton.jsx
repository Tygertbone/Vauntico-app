import * as React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
}

// ✅ Prop validation for clarity
Skeleton.propTypes = {
  className: PropTypes.string,
};

export { Skeleton };