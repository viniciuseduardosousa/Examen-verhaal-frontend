const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vinininja123.pythonanywhere.com';

// Helper function for fetch options
const getFetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Public Verhalen API calls
export const verhalenAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/verhalen/`, getFetchOptions());
    if (!response.ok) {
      throw new Error('Failed to fetch verhalen');
    }
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/verhalen/${id}/`, getFetchOptions());
    if (!response.ok) {
      throw new Error('Failed to fetch verhaal');
    }
    return response.json();
  },
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login/`, getFetchOptions('POST', credentials));
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, getFetchOptions('POST'));
    if (!response.ok) throw new Error('Logout failed');
    localStorage.removeItem('token');
    return response.json();
  },
};

// Categories API calls
export const categoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/categorieen/`, getFetchOptions());
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/examenverhaalfrontend';
        throw new Error('Unauthorized access');
      }
      throw new Error('Failed to fetch categories');
    }
    return response.json();
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/api/categorieen/`, getFetchOptions());
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const categories = await response.json();
    // Filter categories where is_uitgelicht is true
    return categories.filter(category => category.is_uitgelicht);
  },

  create: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/api/categorieen/`, getFetchOptions('POST', categoryData));
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/examenverhaalfrontend';
        throw new Error('Unauthorized access');
      }
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  update: async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/api/categorieen/${id}/`, getFetchOptions('PUT', categoryData));
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/examenverhaalfrontend';
        throw new Error('Unauthorized access');
      }
      throw new Error('Failed to update category');
    }
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/categorieen/${id}/`, getFetchOptions('DELETE'));
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/examenverhaalfrontend';
        throw new Error('Unauthorized access');
      }
      throw new Error('Failed to delete category');
    }
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
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
  }
  throw error;
}; 