"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SIDEBAR_WIDTH = "var(--sidebar-width)";

type SidebarContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}

const SidebarProvider = ({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        open: isMobile ? open : true,
        setOpen,
        isMobile,
      }}
    >
      <div className="flex h-svh w-full">{children}</div>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) => {
  const { open, setOpen, isMobile } = useSidebar();

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        data-sidebar="sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-svh w-[var(--sidebar-width)] flex-col bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))] transition-transform duration-200 ease-linear md:relative md:translate-x-0",
          isMobile && !open && "-translate-x-full",
          className
        )}
        style={{ width: SIDEBAR_WIDTH }}
        {...props}
      >
        {children}
      </aside>
    </>
  );
};

const SidebarHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-sidebar="header"
    className={cn("flex h-14 shrink-0 items-center gap-2 px-4", className)}
    {...props}
  />
);

const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-sidebar="content"
    className={cn("flex flex-1 flex-col gap-2 overflow-auto py-2", className)}
    {...props}
  />
);

const SidebarGroup = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div data-sidebar="group" className={cn("px-2 py-1", className)} {...props} />
);

const SidebarGroupLabel = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-sidebar="group-label"
    className={cn(
      "mb-1 px-2 text-xs font-medium text-[hsl(var(--sidebar-foreground))] opacity-70",
      className
    )}
    {...props}
  />
);

const SidebarGroupContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-sidebar="group-content"
    className={cn("flex flex-col gap-0.5", className)}
    {...props}
  />
);

const SidebarMenu = ({
  className,
  ...props
}: React.ComponentProps<"ul">) => (
  <ul
    data-sidebar="menu"
    className={cn("flex flex-col gap-0.5", className)}
    {...props}
  />
);

const SidebarMenuItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li data-sidebar="menu-item" className={cn("list-none", className)} {...props} />
);

const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & { isActive?: boolean; asChild?: boolean }
>(({ className, isActive, asChild, children, ...props }, ref) => {
  const classes = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]",
    isActive &&
      "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))] font-semibold",
    className
  );
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
      className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      "data-active": isActive,
    });
  }
  return (
    <a
      ref={ref}
      data-active={isActive}
      className={classes}
      {...props}
    >
      {children}
    </a>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    data-sidebar="footer"
    className={cn(
      "mt-auto shrink-0 p-2",
      className
    )}
    {...props}
  />
);

const SidebarInset = ({
  className,
  ...props
}: React.ComponentProps<"main">) => (
  <main
    data-sidebar="inset"
    className={cn(
      "relative flex min-h-0 flex-1 flex-col overflow-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
      className
    )}
    {...props}
  />
);

const SidebarTrigger = ({ className, ...props }: React.ComponentProps<typeof Button>) => {
  const { setOpen, isMobile } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={() => setOpen(true)}
      {...props}
    >
      <PanelLeftIcon className="size-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};

function PanelLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
};
