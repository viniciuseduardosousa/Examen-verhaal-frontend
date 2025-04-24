import { useState, useEffect, useCallback } from 'react';
import { verhalenAPI, categoriesAPI } from '../../services/api';

const CreateDialog = ({ isOpen, onClose, isCategory = false, categories, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    isHighlighted: false,
    isPdfDownloadable: false,
    published: false
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (window.innerWidth <= 768) return;
    
    if (e.target.classList.contains('dialog-overlay')) {
      onClose();
    }
  }, [onClose]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isCategory) {
        await categoriesAPI.create(formData);
      } else {
        await verhalenAPI.create(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError("Er is een fout opgetreden bij het aanmaken.");
      console.error("Error creating:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 dialog-overlay"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-lg w-[600px] mx-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-mono">
            {isCategory ? "Categorie aanmaken" : "Verhaal aanmaken"}
          </h2>
          <button
            onClick={onClose}
            className="bg-[#F85B3B] text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-[#e54e30] text-sm"
          >
            aanmaking verlaten
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-800 rounded-lg px-3 py-1.5"
                  placeholder="Verhaal 1"
                  required
                />
              </div>

              {!isCategory && (
                <>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Categorie
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-800 rounded-lg px-3 py-1.5 appearance-none bg-white"
                      required
                    >
                      <option value="">Selecteer een categorie</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Beschrijving
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-800 rounded-lg px-3 py-1.5"
                      rows="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isHighlighted"
                        name="isHighlighted"
                        checked={formData.isHighlighted}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isHighlighted" className="text-sm">Uitgelicht</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPdfDownloadable"
                        name="isPdfDownloadable"
                        checked={formData.isPdfDownloadable}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="isPdfDownloadable" className="text-sm">PDF downloadbaar</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        className="w-4 h-4"
                      />
                      <label htmlFor="published" className="text-sm">Gepubliceerd</label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              disabled={loading}
            >
              annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Aanmaken...' : 'Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDialog; 