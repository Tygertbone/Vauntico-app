"use client";

import * as React from "react";
import PropTypes from "prop-types";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

function Popover(props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ className, ...props }) {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      className={cn(className)}
      {...props}
    />
  );
}

function PopoverContent({ className, sideOffset = 4, ...props }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

// ✅ Prop validation for clarity
PopoverTrigger.propTypes = { className: PropTypes.string };
PopoverContent.propTypes = {
  className: PropTypes.string,
  sideOffset: PropTypes.number,
};

export { Popover, PopoverTrigger, PopoverContent };