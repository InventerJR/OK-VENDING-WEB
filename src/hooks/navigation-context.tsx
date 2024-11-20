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
    if (typeof window !== 'undefined') {
      const hasSelectedProducts = localStorage.getItem('selectedProducts') === 'true';
      
      if (hasSelectedProducts) {
        console.log('Productos seleccionados detectados');
        setShowNavigationWarning(true);
        setPendingPath(targetPath);
        return true;
      }
    }
    return false;
  };

  // Manejador de eventos para el botón de retroceso del navegador
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (event: PopStateEvent) => {
      const hasSelectedProducts = localStorage.getItem('selectedProducts') === 'true';
      
      if (hasSelectedProducts) {
        event.preventDefault();
        setShowNavigationWarning(true);
        // Restaurar la URL actual
        window.history.pushState(null, '', currentPath);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentPath]);

  // Manejador para prevenir que se cierre la pestaña
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasSelectedProducts = localStorage.getItem('selectedProducts') === 'true';
      
      if (hasSelectedProducts) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Debug logs
  useEffect(() => {
    console.log('Estado del modal:', { showNavigationWarning, pendingPath });
  }, [showNavigationWarning, pendingPath]);

  return (
    <NavigationContext.Provider
      value={{
        showNavigationWarning,
        setShowNavigationWarning,
        pendingPath,
        setPendingPath,
        handleNavigation
      }}
    >
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