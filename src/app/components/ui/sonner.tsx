"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "#395886",
          "--normal-border": "#D5DEEF",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
