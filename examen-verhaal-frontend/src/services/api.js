const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
};

// Stories API calls
export const storiesAPI = {
  // Haal alle verhalen op
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/stories/`);
    if (!response.ok) throw new Error('Failed to fetch stories');
    return response.json();
  },

  // Haal één verhaal op
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/stories/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch story');
    return response.json();
  },

  // Maak een nieuw verhaal
  create: async (storyData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/stories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    if (!response.ok) throw new Error('Failed to create story');
    return response.json();
  },

  // Update een verhaal
  update: async (id, storyData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/stories/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(storyData),
    });
    if (!response.ok) throw new Error('Failed to update story');
    return response.json();
  },

  // Verwijder een verhaal
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/stories/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete story');
    return response.json();
  },
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  create: async (categoryData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },
};

// Helper functie voor het toevoegen van auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Error handler
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response?.status === 401) {
    // Token expired of ongeldig
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  }
  throw error;
}; 