import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminVerhalenAPI, authAPI, adminCategoriesAPI } from "../../services/adminApi";
import { motion, AnimatePresence } from "framer-motion";
import CreateDialog from "../../components/dialogs/CreateDialog";
import EditDialog from "../../components/dialogs/EditDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";

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

  const verhalenPerPage = 7;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
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
      navigate('/admin/login');
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
      } else {
        await adminVerhalenAPI.delete(verhaalToDelete.id);
      }
      if (showCategories) {
        setCategories(categories.filter(cat => cat.id !== verhaalToDelete.id));
      } else {
        setVerhalen(verhalen.filter((v) => v.id !== verhaalToDelete.id));
      }
      setDeleteModalOpen(false);
      setVerhaalToDelete(null);
    } catch (err) {
      setError("Er is een fout opgetreden bij het verwijderen.");
      console.error("Error deleting:", err);
    }
  };

  const handlePublishToggle = async (verhaal) => {
    try {
      const updatedVerhaal = { ...verhaal, published: !verhaal.published };
      await adminVerhalenAPI.update(verhaal.id, updatedVerhaal);
      setVerhalen(verhalen.map((v) => (v.id === verhaal.id ? updatedVerhaal : v)));
    } catch (err) {
      setError("Er is een fout opgetreden bij het bijwerken van het verhaal.");
      console.error("Error updating verhaal:", err);
    }
  };

  const handleEditClick = (item) => {
    setItemToEdit(item);
    setEditDialogOpen(true);
  };

  const handleCreateSuccess = async (formData) => {
    try {
      console.log('Creating story with data:', formData);
      if (showCategories) {
        await adminCategoriesAPI.create(formData);
        fetchCategories();
      } else {
        await adminVerhalenAPI.create(formData);
        fetchVerhalen();
      }
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating item:', err);
      setError("Er is een fout opgetreden bij het aanmaken.");
    }
  };

  const handleEditSuccess = () => {
    if (showCategories) {
      fetchCategories();
    } else {
      fetchVerhalen();
    }
  };

  const filteredVerhalen = verhalen.filter((verhaal) => {
    const matchesSearch = verhaal.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !showCategories || verhaal.category === categories[showCategories ? 1 : 0];
    return matchesSearch && matchesCategory;
  });

  const indexOfLastVerhaal = currentPage * verhalenPerPage;
  const indexOfFirstVerhaal = indexOfLastVerhaal - verhalenPerPage;
  const currentVerhalen = filteredVerhalen.slice(
    indexOfFirstVerhaal,
    indexOfLastVerhaal
  );
  const totalPages = Math.ceil(filteredVerhalen.length / verhalenPerPage);

  return (
    <div className="min-h-screen bg-[#FFFFF5] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-mono">Ingscribblings</h1>
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
          <h2 className="text-xl font-mono">welkom, Ingrid</h2>
          <button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            {showCategories ? "Nieuwe categorie" : "Nieuw verhaal"}{" "}
            <span className="text-xl leading-none">+</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Tabs and Search */}
          <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
            <div className="flex-1 flex">
              <>
                <button
                  onClick={() => setShowCategories(false)}
                  className={`px-6 py-2 font-mono ${
                    !showCategories
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  Verhalen
                </button>
                <button
                  onClick={() => setShowCategories(true)}
                  className={`px-6 py-2 font-mono ${
                    showCategories
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  Categorieën
                </button>
              </>
              {showSearch ? (
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.3 }}
                      className="w-full ml-auto"
                    >
                      <input
                        type="text"
                        placeholder="Zoeken..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-800 rounded-full pr-10 focus:outline-none"
                        autoFocus
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              ) : null}
            </div>
            <button onClick={() => setShowSearch(!showSearch)} className="p-2">
              <svg
                className="h-5 w-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
            <div className="h-[450px] overflow-y-auto">
              <div className="space-y-4">
                {showCategories
                  ? categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between py-3 border-b border-gray-200"
                      >
                        <span className="font-mono">{category.naam}</span>
                        <div className="flex gap-6">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="text-gray-600 hover:text-gray-900"
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
                            className="text-gray-600 hover:text-gray-900"
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
                  : currentVerhalen.map((verhaal) => (
                      <div
                        key={verhaal.id}
                        className="flex items-center justify-between py-3 border-b border-gray-200"
                      >
                        <span className="font-mono">{verhaal.title}</span>
                        <div className="flex gap-6">
                          <button
                            onClick={() => handlePublishToggle(verhaal)}
                            className="text-gray-600 hover:text-gray-900"
                            title={
                              verhaal.published
                                ? "Verhaal verbergen"
                                : "Verhaal publiceren"
                            }
                          >
                            {verhaal.published ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
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
                                fill="currentColor"
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
                            className="text-gray-600 hover:text-gray-900"
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
                            className="text-gray-600 hover:text-gray-900"
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
                    ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!showCategories && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page ? "bg-gray-200" : ""
                    }`}
                  >
                    {page}
                  </button>
                )
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
