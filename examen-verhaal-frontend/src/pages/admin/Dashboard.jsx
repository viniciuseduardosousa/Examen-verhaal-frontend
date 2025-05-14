import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminVerhalenAPI, authAPI, adminCategoriesAPI } from "../../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import CreateDialog from "../../components/dialogs/CreateDialog";
import EditDialog from "../../components/dialogs/EditDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import toast from 'react-hot-toast';

// Custom hook voor dynamische items per pagina
const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const itemHeight = 60;
      const containerHeight = window.innerHeight - 300;
      const calculatedItems = Math.floor(containerHeight / itemHeight);
      const clampedItems = Math.min(Math.max(calculatedItems, 4), 8);
      setItemsPerPage(clampedItems);
    };

    calculateItemsPerPage();
    window.addEventListener('resize', calculateItemsPerPage);

    return () => window.removeEventListener('resize', calculateItemsPerPage);
  }, []);

  return itemsPerPage;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [verhalen, setVerhalen] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [verhaalToDelete, setVerhaalToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [success, setSuccess] = useState(null);

  // Voor dynamische items per pagina, het is beter en wat globaler
  const verhalenPerPage = useItemsPerPage();

  // Reset pagination when switching tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [showCategories]);

  // Error handler voor API calls
  const handleApiError = (error) => {
    console.error("API Error:", error);
    // Als de error een 401 (Unauthorized) of 403 (Forbidden) is, of als de token ongeldig is
    if (error?.response?.status === 401 || error?.response?.status === 403 || error?.message?.includes('token')) {
      localStorage.removeItem('token');
      window.location.href = '/Examen-verhaal-frontend/#/admin/login';
    } else {
      setError("Er is een fout opgetreden. Probeer het later opnieuw.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/Examen-verhaal-frontend/#/admin/login';
      return;
    }
    fetchVerhalen();
    fetchCategories();
  }, [navigate]);

  const fetchVerhalen = async () => {
    try {
      const data = await adminVerhalenAPI.getAll();
      setVerhalen(data);
      setError(null);
    } catch (err) {
      setError("Er is een fout opgetreden bij het ophalen van de verhalen.");
      console.error("Error fetching verhalen:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminCategoriesAPI.getAll();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      window.location.href = '/Examen-verhaal-frontend/#/admin/login';
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleDeleteClick = (verhaal) => {
    setVerhaalToDelete(verhaal);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!verhaalToDelete) return;

    try {
      if (showCategories) {
        await adminCategoriesAPI.delete(verhaalToDelete.id);
        setCategories(categories.filter(cat => cat.id !== verhaalToDelete.id));
        toast.success('Categorie succesvol verwijderd');
      } else {
        await adminVerhalenAPI.delete(verhaalToDelete.id);
        const newVerhalen = verhalen.filter((v) => v.id !== verhaalToDelete.id);
        setVerhalen(newVerhalen);
        
        // Bereken het nieuwe aantal pagina's
        const newTotalPages = Math.ceil(newVerhalen.length / verhalenPerPage);
        
        // Als we op de laatste pagina zijn en die wordt leeg, ga naar de vorige pagina
        if (currentPage > newTotalPages) {
          setCurrentPage(newTotalPages);
        }
        toast.success('Verhaal succesvol verwijderd');
      }
      setDeleteModalOpen(false);
      setVerhaalToDelete(null);
    } catch (err) {
      toast.error('Er is een fout opgetreden bij het verwijderen');
      console.error("Error deleting:", err);
    }
  };

  const handlePublishToggle = async (verhaal) => {
    try {
      // Get the first item if it's an array
      const verhaalData = Array.isArray(verhaal) ? verhaal[0] : verhaal;
      
      const categoryId = verhaalData.categorie_id || verhaalData.categorie?.id || verhaalData.categorie;
      const numericCategoryId = parseInt(categoryId, 10);
      
      if (isNaN(numericCategoryId)) {
        throw new Error('Ongeldige categorie ID');
      }
      
      // Transform the data using the API field names
      const transformedData = {
        titel: verhaalData.titel || verhaalData.title,
        tekst: verhaalData.tekst || verhaalData.text,
        beschrijving: verhaalData.beschrijving || verhaalData.description,
        is_onzichtbaar: verhaalData.is_onzichtbaar === undefined ? !verhaalData.published : !verhaalData.is_onzichtbaar,
        categorie: numericCategoryId,
        datum: verhaalData.datum || verhaalData.date,
        cover_image: verhaalData.cover_image,
        is_uitgelicht: verhaalData.is_uitgelicht || false,
        is_spotlighted: verhaalData.is_spotlighted || false
      };
      
      // Update the story
      await adminVerhalenAPI.update(verhaalData.id, transformedData);
      
      // Refresh the data
      await fetchVerhalen();

      toast.success(transformedData.is_onzichtbaar ? 'Verhaal verborgen' : 'Verhaal gepubliceerd');
    } catch (err) {
      toast.error('Er is een fout opgetreden bij het bijwerken van het verhaal');
      console.error("Error updating verhaal:", err);
    }
  };

  const handleEditClick = (item) => {
    if (showCategories) {
      const transformedItem = {
        id: item.id,
        naam: item.naam,
        cover_image: item.cover_image
      };
      setItemToEdit(transformedItem);
      setEditDialogOpen(true);
    } else {
      const transformedItem = {
        id: item.id,
        titel: item.title,
        tekst: item.text,
        beschrijving: item.description,
        is_onzichtbaar: !item.published,
        categorie: item.categorie?.id || item.categorie_id,
        datum: item.date,
        is_uitgelicht: item.is_uitgelicht,
        is_spotlighted: item.is_spotlighted,
        cover_image: item.cover_image
      };
      console.log('Transformed item for edit:', transformedItem);
      setItemToEdit(transformedItem);
      setEditDialogOpen(true);
    }
  };

  const handleCreateSuccess = async (formData) => {
    try {
      console.log('Creating story with data:', formData);
      if (showCategories) {
        await adminCategoriesAPI.create(formData);
        fetchCategories();
        toast.success('Categorie succesvol aangemaakt');
      } else {
        await adminVerhalenAPI.create(formData);
        fetchVerhalen();
        toast.success('Verhaal succesvol aangemaakt');
      }
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating item:', err);
      toast.error('Er is een fout opgetreden bij het aanmaken');
    }
  };

  const handleEditSuccess = () => {
    if (showCategories) {
      fetchCategories();
      toast.success('Categorie succesvol bijgewerkt');
    } else {
      fetchVerhalen();
      toast.success('Verhaal succesvol bijgewerkt');
    }
  };

  const filteredVerhalen = verhalen.filter((verhaal) => {
    const matchesSearch = verhaal.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredCategories = categories.filter((category) => {
    return category.naam.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort verhalen by date (newest first)
  const sortedVerhalen = [...filteredVerhalen].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Sort categories by updated_at or created_at date (newest first)
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    // Try to get updated_at, or fall back to created_at or other timestamp fields
    const dateA = a.updated_at || a.created_at || a.timestamp || 0;
    const dateB = b.updated_at || b.created_at || b.timestamp || 0;
    
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return new Date(dateB) - new Date(dateA);
  });

  const indexOfLastItem = currentPage * verhalenPerPage;
  const indexOfFirstItem = indexOfLastItem - verhalenPerPage;
  const currentItems = showCategories
    ? sortedCategories.slice(indexOfFirstItem, indexOfLastItem)
    : sortedVerhalen.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (showCategories ? filteredCategories.length : filteredVerhalen.length) / verhalenPerPage
  );

  return (
    <div className="min-h-screen bg-[#FFFFF5] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-mono font-bold">Ingscribblings</h1>
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            Log-out
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33333 18C2.96667 18 2.65278 17.8694 2.39167 17.6083C2.13056 17.3472 2 17.0333 2 16.6667V7.33333C2 6.96667 2.13056 6.65278 2.39167 6.39167C2.65278 6.13056 2.96667 6 3.33333 6H8V7.33333H3.33333V16.6667H8V18H3.33333ZM10.6667 15.3333L9.75 14.3667L11.45 12.6667H6V11.3333H11.45L9.75 9.63333L10.6667 8.66667L14 12L10.6667 15.3333Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Welcome and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono font-bold">welkom, Ingrid</h2>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-blue-700 transition font-bold"
          >
            {showCategories ? "Nieuwe categorie" : "Nieuw verhaal"} {" "}
            <span className="text-xl leading-none font-bold">+</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          {/* Tabs and Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-[#F5F5F5] rounded-full shadow-inner h-10 w-full max-w-sm relative">
              <motion.div
                className="absolute bg-white rounded-full shadow"
                initial={false}
                animate={{
                  x: showCategories ? '100%' : '0%',
                  width: '50%',
                  height: '100%',
                  top: '0',
                  left: '0'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setShowCategories(false)}
                className={`w-1/2 flex justify-center items-center px-3 h-10 text-base font-mono rounded-full transition-all font-bold relative z-10 ${
                  !showCategories
                    ? "text-blue-600"
                    : "text-gray-500 font-normal"
                }`}
              >
                Verhalen
              </button>
              <button
                onClick={() => setShowCategories(true)}
                className={`w-1/2 flex justify-center items-center px-3 h-10 text-base font-mono rounded-full transition-all font-bold relative z-10 ${
                  showCategories
                    ? "text-blue-600"
                    : "text-gray-500 font-normal"
                }`}
              >
                Categorieën
              </button>
            </div>
            <div className="flex-1 flex justify-end">
              {/* Zoekbalk container met vaste breedte en relatieve positie */}
              <div className="relative w-full max-w-md h-10 flex items-center">
                <div className="flex items-center w-full justify-end">
                  <motion.div
                    key="searchbar"
                    initial={false}
                    animate={{ width: showSearch ? '100%' : 0, opacity: showSearch ? 1 : 0 }}
                    transition={{ width: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2 } }}
                    onAnimationComplete={() => {
                      if (showSearch) {
                        const searchInput = document.querySelector('input[type="text"]');
                        if (searchInput) {
                          searchInput.focus();
                        }
                      }
                    }}
                    className="flex items-center bg-[#F5F5F5] rounded-full shadow-inner px-4 h-10 absolute right-0 w-full z-10"
                    style={{ overflow: 'hidden' }}
                  >
                    <input
                      type="text"
                      placeholder="Zoeken ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent flex-1 outline-none font-mono text-base"
                      autoFocus={showSearch}
                      style={{ minWidth: 0 }}
                    />
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setShowSearch(false);
                      }}
                      className="ml-2 text-black hover:text-gray-700"
                      title="Zoekbalk sluiten"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </motion.div>
                  <motion.button
                    key="searchbutton"
                    initial={false}
                    animate={{ opacity: showSearch ? 0 : 1, width: showSearch ? 0 : 40 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setShowSearch(true)}
                    className="w-10 h-10 bg-[#F5F5F5] rounded-full shadow-inner hover:bg-gray-200 transition flex items-center justify-center absolute right-0 z-20"
                    style={{ pointerEvents: showSearch ? 'none' : 'auto' }}
                  >
                    <svg className="h-5 w-5 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
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

              {/* Pagination */}
              {currentItems.length > 0 && (
                <div className="flex justify-center gap-2 mt-2 pt-4 border-t">
                  {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded font-mono transition-all font-bold ${
                          currentPage === page
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Dialog */}
      <CreateDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateSuccess}
        type={showCategories ? 'category' : 'story'}
      />

      {/* Edit Dialog */}
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setItemToEdit(null);
        }}
        isCategory={showCategories}
        categories={categories}
        data={itemToEdit}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVerhaalToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={verhaalToDelete?.title || verhaalToDelete?.naam}
      />
    </div>
  );
};

export default Dashboard;
