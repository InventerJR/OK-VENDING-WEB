"use client";
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useNavigation } from '../../../hooks/navigation-context';

interface NavigationWarningModalProps {
  hasSelectedProducts: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const NavigationWarningModal = ({
  hasSelectedProducts,
  onConfirm,
  onCancel
}: NavigationWarningModalProps) => {
  const { showNavigationWarning, setShowNavigationWarning, pendingPath, setPendingPath } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  // Añadir este efecto para manejar el estado del modal
  useEffect(() => {
    if (hasSelectedProducts) {
      localStorage.setItem('selectedProducts', 'true');
      localStorage.setItem('lastPath', pathname);
      // No establecemos showNavigationWarning aquí porque lo haremos cuando se intente navegar
    } else {
      localStorage.removeItem('selectedProducts');
      localStorage.removeItem('lastPath');
      setShowNavigationWarning(false);
    }
  }, [hasSelectedProducts, pathname, setShowNavigationWarning]);

  const handleConfirm = () => {
    setShowNavigationWarning(false);
    if (onConfirm) {
      onConfirm();
    }
    localStorage.removeItem('selectedProducts');
    localStorage.removeItem('lastPath');
    if (pendingPath) {
      router.push(pendingPath);
      setPendingPath(null);
    }
  };

  const handleCancel = () => {
    setShowNavigationWarning(false);
    setPendingPath(null);
    if (onCancel) {
      onCancel();
    }
  };

  // Añadido console.log para debug
  console.log('Modal State:', { showNavigationWarning, hasSelectedProducts, pendingPath });

  if (!showNavigationWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3">
            ¿Estás seguro que deseas salir?
          </h3>
          <p className="text-gray-600 mb-6">
            Tienes productos seleccionados. Si sales ahora, perderás los cambios realizados.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationWarningModal;