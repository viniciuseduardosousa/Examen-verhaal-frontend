const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://vinininja123.pythonanywhere.com';

// Helper function for fetch options
const getFetchOptions = (method = 'GET', body = null, isFormData = false) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
    },
    mode: 'cors',
    credentials: 'include'
  };

  if (!isFormData) {
    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';
  }

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  return options;
};

// Helper function to construct API URLs
const getApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${path}`;
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
      if (data.access) {
        localStorage.setItem('token', data.access);
      }
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

// Helper function to process verhaal data
const processVerhaalData = (verhaalData) => {
  const formData = new FormData();
  
  // Validate required fields
  if (!verhaalData.titel || !verhaalData.tekst || !verhaalData.beschrijving || !verhaalData.categorie) {
    throw new Error('Alle velden zijn verplicht');
  }

  // Validate category ID
  const categoryId = parseInt(verhaalData.categorie, 10);
  if (isNaN(categoryId)) {
    throw new Error('Ongeldige categorie ID');
  }

  // Add all fields to FormData
  formData.append('titel', verhaalData.titel);
  formData.append('tekst', verhaalData.tekst);
  formData.append('beschrijving', verhaalData.beschrijving);
  formData.append('is_onzichtbaar', verhaalData.is_onzichtbaar ? 'true' : 'false');
  formData.append('categorie', categoryId.toString());
  formData.append('datum', verhaalData.datum);

  // Add cover image if provided
  if (verhaalData.cover_image instanceof File) {
    formData.append('cover_image', verhaalData.cover_image);
  }

  return formData;
};

// Helper function to handle API response
const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    const contentType = response.headers.get('content-type');
    
    try {
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
        console.error('API Error Response:', errorData);
      } else {
        const htmlText = await response.text();
        console.error('Server returned HTML error page:', htmlText);
        errorData = { detail: 'Server error - check server logs' };
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      errorData = { detail: 'Error parsing server response' };
    }
    
    console.error('Response status:', response.status);
    console.error('Response status text:', response.statusText);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      throw new Error('Niet geautoriseerd');
    }
    
    let errorMessage = 'Kon verhaal niet aanmaken';
    if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.non_field_errors) {
      errorMessage = errorData.non_field_errors.join(', ');
    } else if (typeof errorData === 'object') {
      const fieldErrors = Object.entries(errorData)
        .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
        .join('; ');
      if (fieldErrors) {
        errorMessage = fieldErrors;
      }
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

// Helper function to transform verhaal data
const transformVerhaalData = (data) => {
  return {
    id: data.id,
    title: data.titel,
    text: data.tekst,
    description: data.beschrijving,
    published: data.is_onzichtbaar === false, // Explicitly check for false
    categorie_id: data.categorie_id || data.categorie?.id || data.categorie, // Keep both category ID formats
    cover_image: data.cover_image,
    date: data.datum,
    is_uitgelicht: data.is_uitgelicht,
    is_spotlighted: data.is_spotlighted,
    is_onzichtbaar: data.is_onzichtbaar // Keep the original field
  };
};

// Admin Verhalen API calls
export const adminVerhalenAPI = {
  getAll: async () => {
    try {
      const response = await fetch(getApiUrl('/api/verhalen/admin/'), getFetchOptions());
      const data = await handleApiResponse(response);
      return data.map(transformVerhaalData);
    } catch (error) {
      console.error('Error fetching verhalen:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/verhalen/admin/${id}`), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet ophalen');
      }
      const data = await response.json();
      console.log('Raw verhaal data from API:', data);
      return transformVerhaalData(data);
    } catch (error) {
      console.error('Error fetching verhaal:', error);
      throw error;
    }
  },

  create: async (verhaalData) => {
    try {
      console.log('Creating verhaal with data:', verhaalData);
      
      // Validate required fields
      if (!verhaalData.titel || !verhaalData.tekst || !verhaalData.beschrijving || !verhaalData.categorie) {
        throw new Error('Alle velden zijn verplicht');
      }

      // Validate category ID
      const categoryId = parseInt(verhaalData.categorie, 10);
      if (isNaN(categoryId)) {
        throw new Error('Ongeldige categorie ID');
      }
      
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('titel', verhaalData.titel);
      formData.append('tekst', verhaalData.tekst);
      formData.append('beschrijving', verhaalData.beschrijving);
      formData.append('is_onzichtbaar', verhaalData.is_onzichtbaar ? 'true' : 'false');
      formData.append('categorie', categoryId.toString());
      formData.append('datum', verhaalData.datum);

      // Add cover image if provided
      if (verhaalData.cover_image instanceof File) {
        formData.append('cover_image', verhaalData.cover_image);
      }

      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value, typeof value);
      }

      const response = await fetch(getApiUrl('/api/verhalen/admin/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          console.error('Error response text:', errorText);
          // Try to parse as JSON if possible
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.detail || errorData.message || 'Er is een fout opgetreden bij het aanmaken van het verhaal');
          } catch (e) {
            // If not JSON, use the raw text
            throw new Error(`Server error: ${response.status} ${response.statusText}\n${errorText}`);
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error creating verhaal:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('titel', data.titel);
      formData.append('tekst', data.tekst);
      formData.append('beschrijving', data.beschrijving);
      formData.append('is_onzichtbaar', data.is_onzichtbaar ? 'true' : 'false');
      formData.append('categorie', data.categorie);
      formData.append('datum', data.datum);
      formData.append('is_uitgelicht', data.is_uitgelicht ? 'true' : 'false');
      formData.append('is_spotlighted', data.is_spotlighted ? 'true' : 'false');

      // Add cover image if provided
      if (data.cover_image instanceof File) {
        formData.append('cover_image', data.cover_image);
      }

      const response = await fetch(getApiUrl(`/api/verhalen/admin/${id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Kon verhaal niet bijwerken');
      }

      const responseData = await response.json();
      return transformVerhaalData(responseData);
    } catch (error) {
      console.error('Error updating verhaal:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/verhalen/admin/${id}`), getFetchOptions('DELETE'));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet verwijderen');
      }
      console.log('Verhaal succesvol verwijderd');
      return true;
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
      const response = await fetch(getApiUrl('/api/categorieen/admin/'), getFetchOptions());
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

  getFeatured: async () => {
    try {
      const response = await fetch(getApiUrl('/api/categorieen/admin/'), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorieën niet ophalen');
      }
      const categories = await response.json();
      // Filter categories where is_uitgelicht is true
      return categories.filter(category => category.is_uitgelicht);
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
  },

  create: async (categoryData) => {
    try {
      const formData = new FormData();
      formData.append('naam', categoryData.naam);
      formData.append('is_uitgelicht', categoryData.is_uitgelicht ? 'true' : 'false');
      
      if (categoryData.cover_image instanceof File) {
        formData.append('cover_image', categoryData.cover_image);
      }

      const response = await fetch(getApiUrl('/api/categorieen/admin/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet aanmaken');
      }
      console.log('Categorie succesvol aangemaakt');
      return response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const formData = new FormData();
      formData.append('naam', categoryData.naam);
      formData.append('is_uitgelicht', categoryData.is_uitgelicht ? 'true' : 'false');
      
      if (categoryData.cover_image instanceof File) {
        formData.append('cover_image', categoryData.cover_image);
      }

      const response = await fetch(getApiUrl(`/api/categorieen/admin/${id}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet bijwerken');
      }
      console.log('Categorie succesvol bijgewerkt');
      return response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(getApiUrl(`/api/categorieen/admin/${id}`), getFetchOptions('DELETE'));
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon categorie niet verwijderen');
      }
      console.log('Categorie succesvol verwijderd');
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
}; 