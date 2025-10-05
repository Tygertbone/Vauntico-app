"use client";

import * as React from "react";
import PropTypes from "prop-types";
import { PanelLeftIcon, FolderIcon, VaultIcon, StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({ children, className, style, ...props }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const toggleSidebar = () => (isMobile ? setOpenMobile(!openMobile) : setOpen(!open));

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider
      value={{ open, setOpen, openMobile, setOpenMobile, toggleSidebar, isMobile, state }}
    >
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={{
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          }}
          className={cn(
            "flex min-h-screen w-full bg-[var(--sidebar)] text-[var(--sidebar-foreground)]",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({ children }) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent className="w-[var(--sidebar-width)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Mobile Sidebar</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex w-[var(--sidebar-width)] flex-col border-r border-[var(--sidebar-border)] shadow-md">
      <div className="p-4 text-xl font-bold text-[var(--sidebar-accent)]">Vauntico</div>
      <nav className="flex flex-col gap-2 px-4">
        <SidebarLink href="/prompt-vault" icon={<FolderIcon />} label="Prompt Vault" />
        <SidebarLink href="/vaults" icon={<VaultIcon />} label="Vaults" />
        <SidebarLink href="/creator-pass" icon={<StarIcon />} label="Creator Pass" />
      </nav>
    </div>
  );
}

function SidebarLink({ href, icon, label }) {
  const isActive = typeof window !== "undefined" && window.location.pathname === href;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
              : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]",
            "hover:scale-[1.02] hover:shadow-vauntico-glow transition-all duration-300"
          )}
        >
          {icon}
          <span>{label}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function SidebarTrigger({ className }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      onClick={toggleSidebar}
      className={cn("size-7 text-[var(--sidebar-accent)]", className)}
      variant="ghost"
      size="icon"
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarInset({ className, ...props }) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  );
}

// ✅ Prop validation for clarity
SidebarProvider.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

Sidebar.propTypes = { children: PropTypes.node };
SidebarLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};
SidebarTrigger.propTypes = { className: PropTypes.string };
SidebarInset.propTypes = { className: PropTypes.string };

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
};