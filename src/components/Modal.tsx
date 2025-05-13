// src/components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  /** ReactNode로 받도록 변경 */
  message: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black px-6 py-4 rounded-lg shadow-lg">
        {/* 스타일을 입힐 수 있게 래퍼 추가 */}
        <div className="modal-message">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Modal;