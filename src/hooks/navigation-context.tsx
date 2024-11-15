// navigation-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface NavigationContextType {
  showNavigationWarning: boolean;
  setShowNavigationWarning: (show: boolean) => void;
  pendingPath: string | null;
  setPendingPath: (path: string | null) => void;
  handleNavigation: (targetPath: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const router = useRouter();
  const currentPath = usePathname();

  const handleNavigation = (targetPath: string) => {
    const hasStoredProducts = localStorage.getItem('selectedProducts') === 'true';
    const lastPath = localStorage.getItem('lastPath');
    
    if (hasStoredProducts && lastPath?.includes('compras-almacen-fisico')) {
      setShowNavigationWarning(true); // Establecemos explícitamente showNavigationWarning
      setPendingPath(targetPath);
      return true;
    }
    return false;
  };

  useEffect(() => {
    // Interceptar navegación del navegador
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasSelectedProducts = localStorage.getItem('selectedProducts') === 'true';
      const lastPath = localStorage.getItem('lastPath');
      
      if (hasSelectedProducts && lastPath?.includes('compras-almacen-fisico')) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <NavigationContext.Provider value={{
      showNavigationWarning,
      setShowNavigationWarning,
      pendingPath,
      setPendingPath,
      handleNavigation
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
