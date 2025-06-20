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
      // Verwijder eerst de token uit localStorage
      localStorage.removeItem('token');
      
      // Probeer de logout API aan te roepen
      const response = await fetch(`${API_BASE_URL}/accounts/logout/`, getFetchOptions('POST'));
      
      // Navigeer naar de login pagina, ongeacht of de API call succesvol was
      window.location.href = '/#/admin/login';
      
      // Als de API call succesvol was, return de response
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Zorg ervoor dat we altijd naar de login pagina navigeren, zelfs als er een error is
      window.location.href = '/#/admin/login';
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
    
    if (response.status === 401 && window.location.pathname.includes('/admin')) {
      localStorage.removeItem('token');
      window.location.href = '/Examen-verhaal-frontend/#/admin/login';
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
    is_onzichtbaar: data.is_onzichtbaar, // Keep the original field
    is_downloadable: data.is_downloadable === true || data.is_downloadable === 'true', // Explicitly check for true
    word_file: data.word_file, // Add the Word document field
    word_file_name: data.word_file_name, // Add the Word document filename
    url: data.url || '' // Add the URL field with empty string as fallback
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon verhaal niet ophalen');
      }
      const data = await response.json();
      return transformVerhaalData(data);
    } catch (error) {
      console.error('Error fetching verhaal:', error);
      throw error;
    }
  },

  create: async (verhaalData) => {
    try {
      // Validate required fields
      if (!verhaalData.titel || !verhaalData.tekst || !verhaalData.categorie) {
        throw new Error('Alle velden zijn verplicht');
      }

      // Validate category ID
      const categoryId = parseInt(verhaalData.categorie, 10);
      if (isNaN(categoryId)) {
        throw new Error('Ongeldige categorie ID');
      }
      
      const formData = new FormData();
      
      // Add required fields
      formData.append('titel', verhaalData.titel);
      formData.append('tekst', verhaalData.tekst);
      formData.append('categorie', categoryId.toString());
      formData.append('datum', verhaalData.datum);
      formData.append('is_onzichtbaar', verhaalData.is_onzichtbaar ? 'true' : 'false');
      
      // Add optional fields
      if (verhaalData.beschrijving) {
        formData.append('beschrijving', verhaalData.beschrijving);
      }
      if (verhaalData.is_uitgelicht !== undefined) {
        formData.append('is_uitgelicht', verhaalData.is_uitgelicht ? 'true' : 'false');
      }
      if (verhaalData.is_spotlighted !== undefined) {
        formData.append('is_spotlighted', verhaalData.is_spotlighted ? 'true' : 'false');
      }
      if (verhaalData.is_downloadable !== undefined) {
        formData.append('is_downloadable', verhaalData.is_downloadable ? 'true' : 'false');
      }
      if (verhaalData.url) {
        formData.append('url', verhaalData.url);
      }

      // Handle cover image
      if (verhaalData.cover_image instanceof File) {
        formData.append('cover_image', verhaalData.cover_image);
      }
      
      // Handle Word document
      if (verhaalData.word_file instanceof File) {
        formData.append('word_file', verhaalData.word_file);
      }

      const response = await fetch(getApiUrl('/api/verhalen/admin/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Er is een fout opgetreden bij het aanmaken van het verhaal');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      return response.json();
    } catch (error) {
      console.error('Error creating verhaal:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const formData = new FormData();
      
      // Add standard fields to FormData
      formData.append('titel', data.titel);
      formData.append('tekst', data.tekst);
      formData.append('beschrijving', data.beschrijving);
      formData.append('is_onzichtbaar', data.is_onzichtbaar ? 'true' : 'false');
      formData.append('categorie', data.categorie);
      formData.append('datum', data.datum);
      formData.append('is_uitgelicht', data.is_uitgelicht ? 'true' : 'false');
      formData.append('is_spotlighted', data.is_spotlighted ? 'true' : 'false');
      formData.append('is_downloadable', data.is_downloadable ? 'true' : 'false');
      formData.append('url', data.url || ''); // Add URL field

      if (data.is_spotlighted) {
        try {
          const allStories = await adminVerhalenAPI.getAll();
          for (const story of allStories) {
            if (story.id !== id && story.is_spotlighted) {
              const unspotlightFormData = new FormData();
              unspotlightFormData.append('is_spotlighted', 'false');
              await fetch(getApiUrl(`/api/verhalen/admin/${story.id}`), {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: unspotlightFormData,
                credentials: 'include'
              });
            }
          }
        } catch (error) {
          console.error('Error unspotlighting other stories:', error);
        }
      }
      
      // Handle cover image
      if (data.remove_image) {
        formData.append('cover_image', '');
        formData.append('remove_image', 'true');
      } else if (data.cover_image instanceof File) {
        formData.append('cover_image', data.cover_image);
      }
      
      // Handle Word document
      if (data.word_file === null) {
        formData.append('word_file', '');
      } else if (data.word_file instanceof File) {
        formData.append('word_file', data.word_file);
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Kon verhaal niet bijwerken');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
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
      formData.append('beschrijving', categoryData.beschrijving || '');
      
      // Handle cover image
      if (categoryData.remove_image) {
        formData.append('cover_image', '');
      } else if (categoryData.cover_image instanceof File) {
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
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
      const formData = new FormData();
      formData.append('naam', categoryData.naam);
      formData.append('is_uitgelicht', categoryData.is_uitgelicht ? 'true' : 'false');
      formData.append('beschrijving', categoryData.beschrijving || '');
      
      // Handle cover image
      if (categoryData.remove_image) {
        formData.append('cover_image', '');
      } else if (categoryData.cover_image instanceof File) {
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Kon categorie niet bijwerken');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
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

  patch: async (id, categoryData) => {
    try {
      // If we're removing the image, send as JSON
      if (categoryData.remove_image) {
        const response = await fetch(getApiUrl(`/api/categorieen/admin/${id}`), {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cover_image: null,
            beschrijving: categoryData.beschrijving || null,
            remove_image: true
          }),
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/Examen-verhaal-frontend/#/admin/login';
            throw new Error('Niet geautoriseerd');
          }
          throw new Error('Kon categorie niet bijwerken');
        }
        return response.json();
      }

      // For other updates, use FormData
      const formData = new FormData();
      
      // Add only the fields that are provided
      if (categoryData.naam !== undefined) {
        formData.append('naam', categoryData.naam);
      }
      if (categoryData.is_uitgelicht !== undefined) {
        formData.append('is_uitgelicht', categoryData.is_uitgelicht ? 'true' : 'false');
      }
      if (categoryData.beschrijving !== undefined) {
        formData.append('beschrijving', categoryData.beschrijving || '');
      }
      
      // Handle cover image upload
      if (categoryData.cover_image instanceof File) {
        formData.append('cover_image', categoryData.cover_image);
      }

      const response = await fetch(getApiUrl(`/api/categorieen/admin/${id}`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Kon categorie niet bijwerken');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      
      return response.json();
    } catch (error) {
      console.error('Error patching category:', error);
      throw error;
    }
  },
};

// Profile and Footer API calls
export const profileAPI = {
  getOvermij: async () => {
    try {
      const response = await fetch(getApiUrl('/overmijpagina/overmij/'), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon over mij data niet ophalen');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching over mij data:', error);
      throw error;
    }
  },

  updateOvermij: async (data) => {
    try {
      const formData = new FormData();
      
      // Add text content
      formData.append('tekst', data.aboutMeText);
      formData.append('subtitel', data.subtitle);
      
      // Handle profile photo
      if (data.removePhoto) {
        formData.append('afbeelding', ''); // Send empty string to remove photo
      } else if (data.afbeelding instanceof File) {
        formData.append('afbeelding', data.afbeelding);
      }

      // Handle Word document
      if (data.word_file instanceof File) {
        formData.append('word_file', data.word_file);
      }

      const response = await fetch(getApiUrl('/overmijpagina/overmij/admin/'), {
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
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        
        const errorText = await response.text();
        console.error('Server response:', errorText); // Debug log
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.detail || errorData.message || 'Kon over mij data niet bijwerken');
        } catch (e) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }
      return response.json();
    } catch (error) {
      console.error('Error updating over mij data:', error);
      throw error;
    }
  },

  getFooter: async () => {
    try {
      const response = await fetch(getApiUrl('/overmijpagina/footer/'), getFetchOptions());
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon footer data niet ophalen');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching footer data:', error);
      throw error;
    }
  },

  updateFooter: async (data) => {
    try {
      const response = await fetch(getApiUrl('/overmijpagina/footer/admin/'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tekst: data.footerText,
          email: data.email
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/Examen-verhaal-frontend/#/admin/login';
          throw new Error('Niet geautoriseerd');
        }
        throw new Error('Kon footer data niet bijwerken');
      }
      return response.json();
    } catch (error) {
      console.error('Error updating footer data:', error);
      throw error;
    }
  },
}; 