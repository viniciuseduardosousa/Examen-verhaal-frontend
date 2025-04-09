import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storiesAPI } from '../../services/api';
import { mockStories } from '../../data/mockStories';

const Dashboard = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const storiesPerPage = 7;
  const categories = ['Columns', '50 words', 'Colors', 'Sound Stories'];

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      // In development mode, use mock data
      if (process.env.NODE_ENV === 'development') {
        setStories(mockStories);
        setError(null);
      } else {
        // In production, use the API
        const data = await storiesAPI.getAll();
        setStories(data);
        setError(null);
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het ophalen van de verhalen.');
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (story) => {
    setStoryToDelete(story);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;

    try {
      if (process.env.NODE_ENV === 'development') {
        // In development, just update the local state
        setStories(stories.filter(story => story.id !== storyToDelete.id));
      } else {
        // In production, call the API
        await storiesAPI.delete(storyToDelete.id);
        setStories(stories.filter(story => story.id !== storyToDelete.id));
      }
      setDeleteModalOpen(false);
      setStoryToDelete(null);
    } catch (err) {
      setError('Er is een fout opgetreden bij het verwijderen van het verhaal.');
      console.error('Error deleting story:', err);
    }
  };

  const handlePublishToggle = async (story) => {
    try {
      const updatedStory = { ...story, published: !story.published };
      
      if (process.env.NODE_ENV === 'development') {
        // In development, just update the local state
        setStories(stories.map(s => s.id === story.id ? updatedStory : s));
      } else {
        // In production, call the API
        await storiesAPI.update(story.id, updatedStory);
        setStories(stories.map(s => s.id === story.id ? updatedStory : s));
      }
    } catch (err) {
      setError('Er is een fout opgetreden bij het bijwerken van het verhaal.');
      console.error('Error updating story:', err);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !showCategories || story.category === categories[showCategories ? 1 : 0];
    return matchesSearch && matchesCategory;
  });

  const indexOfLastStory = currentPage * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

  return (
    <div className="min-h-screen bg-[#FFFFF5] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-mono">ReadKeep</h1>
          <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            Log-out 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33333 18C2.96667 18 2.65278 17.8694 2.39167 17.6083C2.13056 17.3472 2 17.0333 2 16.6667V7.33333C2 6.96667 2.13056 6.65278 2.39167 6.39167C2.65278 6.13056 2.96667 6 3.33333 6H8V7.33333H3.33333V16.6667H8V18H3.33333ZM10.6667 15.3333L9.75 14.3667L11.45 12.6667H6V11.3333H11.45L9.75 9.63333L10.6667 8.66667L14 12L10.6667 15.3333Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Welcome and Create Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono">welkom, Ingrid</h2>
          <Link
            to="/admin/verhaal/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            Nieuw verhaal <span className="text-xl leading-none">+</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Tabs and Search */}
          <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
            <div className="flex-1 flex">
              {showSearch ? (
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Zoeken..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 rounded-lg"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowCategories(false)}
                    className={`px-6 py-2 font-mono ${!showCategories ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                  >
                    Verhalen
                  </button>
                  <button
                    onClick={() => setShowCategories(true)}
                    className={`px-6 py-2 font-mono ${showCategories ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'}`}
                  >
                    Categorieën
                  </button>
                </>
              )}
            </div>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-8">Laden...</div>
          ) : (
            <div className="h-[450px] overflow-y-auto">
              <div className="space-y-4">
                {showCategories ? (
                  // Categories List
                  categories.map((category) => (
                    <div key={category} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-mono">{category}</span>
                      <div className="flex gap-6">
                        <Link
                          to={`/admin/categorie/edit/${category}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Stories List
                  currentStories.map((story) => (
                    <div key={story.id} className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="font-mono">{story.title}</span>
                      <div className="flex gap-6">
                        <button
                          onClick={() => handlePublishToggle(story)}
                          className="text-gray-600 hover:text-gray-900"
                          title={story.published ? "Verhaal verbergen" : "Verhaal publiceren"}
                        >
                          {story.published ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                        <Link
                          to={`/admin/verhaal/edit/${story.id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(story)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Pagination */}
          {!showCategories && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-gray-200'
                      : ''
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Weet je zeker?</h2>
            <p className="mb-6">
              Dit verhaal wordt permanent verwijderd.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setStoryToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                annuleren
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 