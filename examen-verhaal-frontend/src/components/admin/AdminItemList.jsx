import React from 'react';

const AdminItemList = ({ 
  showCategories, 
  currentItems, 
  searchTerm, 
  handlePublishToggle, 
  handleEditClick, 
  handleDeleteClick 
}) => {
  return (
    <div className={showCategories ? "space-y-4" : "space-y-4"}>
      {showCategories ? (
        currentItems.length > 0 ? (
          currentItems.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between py-3 border-b border-black"
            >
              <span className="font-mono font-bold">{category.naam}</span>
              <div className="flex gap-6">
                <button
                  onClick={() => handleEditClick(category)}
                  className="text-black hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(category)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-black">
            {searchTerm ? (
              <>
                <p className="font-mono font-bold">Geen categorieën gevonden voor "{searchTerm}"</p>
                <p className="text-sm mt-2">Probeer een andere zoekterm of bekijk alle categorieën</p>
              </>
            ) : (
              <p className="font-mono font-bold">Nog geen categorieën beschikbaar</p>
            )}
          </div>
        )
      ) : (
        currentItems.length > 0 ? (
          currentItems.map((verhaal, index) => (
            <div
              key={verhaal.id}
              className={`flex items-center justify-between py-3 ${
                index !== currentItems.length - 1 ? 'border-b border-black' : 'pb-0'
              }`}
            >
              <span className="font-mono font-bold">{verhaal.title}</span>
              <div className="flex gap-6">
                <button
                  onClick={() => handlePublishToggle(verhaal)}
                  className="text-black hover:text-black"
                  title={
                    verhaal.published
                      ? "Verhaal verbergen"
                      : "Verhaal publiceren"
                  }
                >
                  {/* Oog iconen, zwart */}
                  {verhaal.published ? (
                       <svg
                       xmlns="http://www.w3.org/2000/svg"
                       className="h-5 w-5"
                       viewBox="0 0 20 20"
                       fill="#111"
                       >
                       <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                       <path
                         fillRule="evenodd"
                         d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                         clipRule="evenodd"
                       />
                     </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="#111"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => handleEditClick(verhaal)}
                  className="text-black hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteClick(verhaal)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-black">
            {searchTerm ? (
              <>
                <p className="font-mono font-bold">Geen verhalen gevonden voor "{searchTerm}"</p>
                <p className="text-sm mt-2">Probeer een andere zoekterm of bekijk alle verhalen</p>
              </>
            ) : (
              <p className="font-mono font-bold">Nog geen verhalen beschikbaar</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default AdminItemList; 