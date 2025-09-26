import * as React from "react";
import PropTypes from "prop-types";
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({ ...props }) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

// ✅ Prop validation for clarity
AspectRatio.propTypes = {
  children: PropTypes.node,
  ratio: PropTypes.number, // e.g. 16 / 9
};

export { AspectRatio };