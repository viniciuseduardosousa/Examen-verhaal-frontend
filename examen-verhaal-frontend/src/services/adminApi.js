const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vinininja123.pythonanywhere.com';

// Helper function for fetch options
const getFetchOptions = (method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    mode: 'cors',
  };

  // Only add Authorization header if token exists
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Helper function to construct API URLs
const getApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}/api${path}`;
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login/`, getFetchOptions('POST', credentials));
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Ongeldige gebruikersnaam of wachtwoord');
        }
        throw new Error('Login mislukt');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/logout/`, getFetchOptions('POST'));
      if (!response.ok) {
        throw new Error('Logout mislukt');
      }
      localStorage.removeItem('token');
      return response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
};

// Admin Verhalen API calls
export const adminVerhalenAPI = {
  getAll: async () => {
    try {
      const response = await fetch(getApiUrl('verhalen'), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhalen niet ophalen');
      }
      const data = await response.json();
      // Transform the data to match our frontend structure
      return data.map(verhaal => ({
        id: verhaal.id,
        title: verhaal.titel,
        text: verhaal.tekst,
        description: verhaal.beschrijving,
        published: !verhaal.is_onzichtbaar,
        category: verhaal.categorie,
        coverImage: verhaal.cover_image,
        date: verhaal.datum
      }));
    } catch (error) {
      console.error('Error fetching verhalen:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(getApiUrl(`verhalen/${id}`), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet ophalen');
      }
      const verhaal = await response.json();
      // Transform the data to match our frontend structure
      return {
        id: verhaal.id,
        title: verhaal.titel,
        text: verhaal.tekst,
        description: verhaal.beschrijving,
        published: !verhaal.is_onzichtbaar,
        category: verhaal.categorie,
        coverImage: verhaal.cover_image,
        date: verhaal.datum
      };
    } catch (error) {
      console.error('Error fetching verhaal:', error);
      throw error;
    }
  },

  create: async (verhaalData) => {
    try {
      // Transform the data to match the API structure
      const apiData = {
        titel: verhaalData.title,
        tekst: verhaalData.text,
        beschrijving: verhaalData.description,
        is_onzichtbaar: !verhaalData.published,
        categorie: verhaalData.category,
        cover_image: verhaalData.coverImage,
        datum: verhaalData.date
      };

      const response = await fetch(getApiUrl('verhalen'), getFetchOptions('POST', apiData));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet aanmaken');
      }
      const data = await response.json();
      // Transform the response to match our frontend structure
      return {
        id: data.id,
        title: data.titel,
        text: data.tekst,
        description: data.beschrijving,
        published: !data.is_onzichtbaar,
        category: data.categorie,
        coverImage: data.cover_image,
        date: data.datum
      };
    } catch (error) {
      console.error('Error creating verhaal:', error);
      throw error;
    }
  },

  update: async (id, verhaalData) => {
    try {
      // Transform the data to match the API structure
      const apiData = {
        titel: verhaalData.title,
        tekst: verhaalData.text,
        beschrijving: verhaalData.description,
        is_onzichtbaar: !verhaalData.published,
        categorie: verhaalData.category,
        cover_image: verhaalData.coverImage,
        datum: verhaalData.date
      };

      const response = await fetch(getApiUrl(`verhalen/${id}`), getFetchOptions('PUT', apiData));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet bijwerken');
      }
      const data = await response.json();
      // Transform the response to match our frontend structure
      return {
        id: data.id,
        title: data.titel,
        text: data.tekst,
        description: data.beschrijving,
        published: !data.is_onzichtbaar,
        category: data.categorie,
        coverImage: data.cover_image,
        date: data.datum
      };
    } catch (error) {
      console.error('Error updating verhaal:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(getApiUrl(`verhalen/${id}`), getFetchOptions('DELETE'));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet verwijderen');
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting verhaal:', error);
      throw error;
    }
  },
};

// Admin Categories API calls
export const adminCategoriesAPI = {
  getAll: async () => {
    try {
      const response = await fetch(getApiUrl('categorieen'), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorieën niet ophalen');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  create: async (categoryData) => {
    try {
      const response = await fetch(getApiUrl('categories'), getFetchOptions('POST', categoryData));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet aanmaken');
      }
      return response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const response = await fetch(getApiUrl(`categories/${id}`), getFetchOptions('PUT', categoryData));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet bijwerken');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(getApiUrl(`categories/${id}`), getFetchOptions('DELETE'));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet verwijderen');
      }
      return response.json();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
}; 