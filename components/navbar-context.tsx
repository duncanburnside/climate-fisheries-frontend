'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextType {
  indicatorLabel: string | null;
  setIndicatorLabel: (label: string | null) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [indicatorLabel, setIndicatorLabel] = useState<string | null>(null);

  return (
    <NavbarContext.Provider value={{ indicatorLabel, setIndicatorLabel }}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
}

