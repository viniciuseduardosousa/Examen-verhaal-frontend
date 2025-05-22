import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminVerhalenAPI, authAPI, adminCategoriesAPI } from "../../services/adminApi";
import { motion } from "framer-motion";
import CreateDialog from "../../components/dialogs/CreateDialog";
import EditDialog from "../../components/dialogs/EditDialog";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import LogoutDialog from "../../components/dialogs/LogoutDialog";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminTabs from "../../components/admin/AdminTabs";
import AdminSearchBar from "../../components/admin/AdminSearchBar";
import AdminItemList from "../../components/admin/AdminItemList";
import { AdminPagination } from "../../components/Pagination";
import toast from 'react-hot-toast';

// Custom hook voor dynamische items per pagina
const useItemsPerPage = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    const calculateItemsPerPage = () => {
      const itemHeight = 60;
      const containerHeight = window.innerHeight - 300;
      const calculatedItems = Math.floor(containerHeight / itemHeight);
      const clampedItems = Math.min(Math.max(calculatedItems, 15), 20);
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
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('token');
      navigate('/');
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
        cover_image: item.cover_image,
        is_uitgelicht: item.is_uitgelicht || false
      };
      console.log('Transformed category for edit:', transformedItem);
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
        is_downloadable: item.is_downloadable,
        url: item.url,
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

  // Filtering and sorting
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
        {/* Header Component */}
        <AdminHeader onLogout={handleLogout} />

        {/* Create Button */}
        <div className="flex justify-end mb-6">
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
            <AdminTabs 
              showCategories={showCategories} 
              setShowCategories={setShowCategories} 
            />
            <div className="flex-1 flex justify-end">
              <AdminSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
            <>
              <AdminItemList
                showCategories={showCategories}
                currentItems={currentItems}
                searchTerm={searchTerm}
                handlePublishToggle={handlePublishToggle}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
                verhalen={verhalen}
              />

              {/* Pagination */}
              {currentItems.length > 0 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog Components - Keep these unchanged */}
      <CreateDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSave={handleCreateSuccess}
        type={showCategories ? 'category' : 'story'}
      />

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

      <DeleteDialog
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVerhaalToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={verhaalToDelete?.title || verhaalToDelete?.naam}
      />

      <LogoutDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Dashboard;
