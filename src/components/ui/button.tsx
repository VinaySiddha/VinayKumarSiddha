
"use client";

import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export function Button({ variant = "default", size = "default", children, className, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    default: "bg-cyber-blue text-black hover:bg-cyber-blue/90 hover:shadow-[0_0_15px_rgba(58,166,255,0.4)]",
    outline: "border border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20",
    ghost: "bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white",
    link: "text-cyber-blue underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-xs rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
