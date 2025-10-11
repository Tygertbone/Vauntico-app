import * as React from "react";
import PropTypes from "prop-types";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({ delayDuration = 0, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({ className, sideOffset = 0, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance bg-primary text-primary-foreground origin-[--radix-tooltip-content-transform-origin] animate-in zoom-in-95 fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="z-50 size-2.5 rotate-45 translate-y-[calc(-50%_-_2px)] rounded-[2px] bg-primary fill-primary" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

// ✅ Prop validation for clarity
TooltipProvider.propTypes = {
  delayDuration: PropTypes.number,
};

TooltipContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
  children: PropTypes.node,
};

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };