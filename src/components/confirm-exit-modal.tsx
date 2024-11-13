import React from 'react';

interface ConfirmExitModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmExitModal: React.FC<ConfirmExitModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-2">¿Seguro que quieres salir?</h2>
        <p className="mb-4">Perderás la información ingresada.</p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
