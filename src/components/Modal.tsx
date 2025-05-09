import React from 'react';

interface ModalProps {
  isOpen: boolean;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg">
        {message}
      </div>
    </div>
  );
};

export default Modal;