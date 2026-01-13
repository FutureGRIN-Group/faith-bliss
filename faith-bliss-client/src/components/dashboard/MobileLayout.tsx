/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <>
      {/* Removed TopBar Since it is shared across pages */}

      {/* Mobile Profile Display */}
      {children}
    </>
  );
};
