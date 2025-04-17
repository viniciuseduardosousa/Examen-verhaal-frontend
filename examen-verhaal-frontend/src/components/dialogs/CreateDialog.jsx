import { useState } from 'react';

const CreateDialog = ({ isOpen, onClose, isCategory = false, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    isHighlighted: false,
    isPdfDownloadable: false
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-mono">
            {isCategory ? "Categorie aanmaken" : "Verhaal aanmaken"}
          </h2>
          <button
            onClick={onClose}
            className="bg-[#f84e3b] text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-[#e54e30] text-sm"
          >
            aanmaking verlaten
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
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
                    >
                      <option value="">Actie</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Datum
                    </label>
                    <select
                      id="date"
                      className="w-full border-2 border-gray-800 rounded-lg px-3 py-1.5 appearance-none bg-white"
                    >
                      <option value="">{new Date().toLocaleDateString()}</option>
                    </select>
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
                      <label htmlFor="isPdfDownloadable" className="text-sm">Download als pdf</label>
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isCategory && (
              <div className="border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 h-[180px]">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Upload omslag foto</p>
                </div>
              </div>
            )}
          </div>

          {!isCategory && (
            <>
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Korte beschrijving
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-gray-50"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Verhaal
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={6}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-1.5 bg-gray-50"
                />
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                // Handle form submission
                onClose();
              }}
              className="bg-[#4CAF50] text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[#45a049] text-sm"
            >
              {isCategory ? "Categorie Opslaan" : "Verhaal Publiceren"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDialog; 