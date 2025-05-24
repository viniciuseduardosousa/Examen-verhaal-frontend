import React from 'react';

const DialogActions = ({ onClose, onSubmit, isLoading = false }) => {
  return (
    <div className="flex justify-end gap-4 mt-6">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
        disabled={isLoading}
      >
        Annuleren
      </button>
      <button
        type="submit"
        onClick={onSubmit}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? 'Opslaan...' : 'Opslaan'}
      </button>
    </div>
  );
};

export default DialogActions; 