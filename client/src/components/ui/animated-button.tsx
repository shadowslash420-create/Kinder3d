import { useRef, useEffect } from "react";
import { animate } from "animejs";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = ""
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const background = backgroundRef.current;
    if (!button || !background) return;

    const handleMouseEnter = () => {
      animate(background, {
        height: "120%",
        top: "50%",
        width: "120%",
        duration: 300,
        ease: "outQuad"
      });
    };

    const handleMouseLeave = () => {
      animate(background, {
        height: "3px",
        top: "100%",
        width: "100%",
        duration: 300,
        ease: "outQuad"
      });
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`relative font-semibold cursor-pointer bg-transparent border-none outline-none transition-colors duration-300 text-white hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div
        ref={backgroundRef}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md -z-10"
        style={{
          top: "100%",
          height: "3px",
          width: "100%",
          backgroundColor: "#DC2626"
        }}
      />
    </button>
  );
}

interface AnimatedNavLinkProps {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
  className?: string;
}

export function AnimatedNavLink({ children, href, onClick, className = "" }: AnimatedNavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const background = backgroundRef.current;
    if (!link || !background) return;

    const handleMouseEnter = () => {
      animate(background, {
        height: "100%",
        top: "50%",
        width: "120%",
        duration: 250,
        ease: "outQuad"
      });
    };

    const handleMouseLeave = () => {
      animate(background, {
        height: "2px",
        top: "100%",
        width: "100%",
        duration: 250,
        ease: "outQuad"
      });
    };

    link.addEventListener("mouseenter", handleMouseEnter);
    link.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter);
      link.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={onClick}
      className={`relative font-bold uppercase tracking-[0.15em] cursor-pointer bg-transparent border-none outline-none text-white hover:text-white transition-colors duration-300 px-2 py-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div
        ref={backgroundRef}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm -z-10"
        style={{
          top: "100%",
          height: "2px",
          width: "100%",
          backgroundColor: "#DC2626"
        }}
      />
    </a>
  );
}

interface AnimatedHamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

export function AnimatedHamburger({ isOpen, onClick }: AnimatedHamburgerProps) {
  const topLineRef = useRef<HTMLDivElement>(null);
  const middleLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topLine = topLineRef.current;
    const middleLine = middleLineRef.current;
    const bottomLine = bottomLineRef.current;

    if (!topLine || !middleLine || !bottomLine) return;

    if (isOpen) {
      animate(topLine, {
        translateY: 8,
        rotate: 45,
        duration: 300,
        ease: "outQuad"
      });
      animate(middleLine, {
        opacity: 0,
        scaleX: 0,
        duration: 200,
        ease: "outQuad"
      });
      animate(bottomLine, {
        translateY: -8,
        rotate: -45,
        duration: 300,
        ease: "outQuad"
      });
    } else {
      animate(topLine, {
        translateY: 0,
        rotate: 0,
        duration: 300,
        ease: "outQuad"
      });
      animate(middleLine, {
        opacity: 1,
        scaleX: 1,
        duration: 200,
        ease: "outQuad"
      });
      animate(bottomLine, {
        translateY: 0,
        rotate: 0,
        duration: 300,
        ease: "outQuad"
      });
    }
  }, [isOpen]);

  return (
    <button
      onClick={onClick}
      className="md:hidden p-3 flex flex-col justify-center items-center w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer relative group"
      aria-label="Toggle menu"
    >
      <div
        className="absolute inset-0 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #991B1B 100%)",
          filter: "blur(6px)"
        }}
      />
      <div
        ref={topLineRef}
        className="w-6 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        style={{ transformOrigin: "center" }}
      />
      <div
        ref={middleLineRef}
        className="w-6 h-0.5 bg-white rounded-full mt-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        style={{ transformOrigin: "center" }}
      />
      <div
        ref={bottomLineRef}
        className="w-6 h-0.5 bg-white rounded-full mt-2 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
        style={{ transformOrigin: "center" }}
      />
    </button>
  );
}
