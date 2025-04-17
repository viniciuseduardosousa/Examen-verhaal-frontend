import { useEffect, useCallback } from 'react';

const DeleteDialog = ({ isOpen, onClose, onConfirm, itemName }) => {
  // Handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle outside click (only on desktop)
  const handleOutsideClick = useCallback((e) => {
    // Check if we're on mobile
    if (window.innerWidth <= 768) return;
    
    // Check if click is outside dialog
    if (e.target.classList.contains('dialog-overlay')) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dialog-overlay"
      onClick={handleOutsideClick}
    >
      <div 
        className="bg-white p-6 rounded-lg max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Weet je zeker?</h2>
        <p className="mb-6">
          {itemName 
            ? `"${itemName}" wordt permanent verwijderd.`
            : "Dit item wordt permanent verwijderd."
          }
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            annuleren
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            verwijderen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog; 