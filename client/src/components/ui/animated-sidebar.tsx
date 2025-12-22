"use client";

import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useAnimatedSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useAnimatedSidebar must be used within an AnimatedSidebar");
  }
  return context;
};

export const AnimatedSidebar = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const AnimatedSidebarBody = (
  props: React.ComponentProps<typeof motion.div>
) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useAnimatedSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-slate-900 text-white w-[300px] flex-shrink-0 fixed left-0 top-0 z-40",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useAnimatedSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 flex flex-row md:hidden items-center justify-between bg-slate-900 text-white w-full sticky top-0 z-50 shadow-md"
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">Creperie</span>
        </div>
        <div className="flex justify-end">
          <Menu
            className="text-white cursor-pointer h-6 w-6"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-slate-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  href,
  icon,
  label,
  onClick,
  isActive = false,
  className,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}) => {
  const { open, animate } = useAnimatedSidebar();
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-4 rounded-lg cursor-pointer transition-colors",
        isActive ? "bg-red-500 text-white" : "text-slate-300 hover:bg-slate-800",
        className
      )}
    >
      {icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {label}
      </motion.span>
    </div>
  );
};

export const SidebarHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, animate } = useAnimatedSidebar();
  
  return (
    <motion.div
      animate={{
        display: animate ? (open ? "block" : "none") : "block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className={cn("border-b border-slate-700 pb-4 mb-4", className)}
    >
      {children}
    </motion.div>
  );
};

export const SidebarFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { open, animate } = useAnimatedSidebar();
  
  return (
    <motion.div
      animate={{
        display: animate ? (open ? "block" : "none") : "block",
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      className={cn("border-t border-slate-700 pt-4 mt-auto", className)}
    >
      {children}
    </motion.div>
  );
};
