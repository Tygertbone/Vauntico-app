import * as React from "react";
import PropTypes from "prop-types";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

function Collapsible({ ...props }) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({ ...props }) {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />;
}

function CollapsibleContent({ ...props }) {
  return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} />;
}

// ✅ Prop validation for clarity
Collapsible.propTypes = {
  children: PropTypes.node,
};

CollapsibleTrigger.propTypes = {
  children: PropTypes.node,
};

CollapsibleContent.propTypes = {
  children: PropTypes.node,
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };