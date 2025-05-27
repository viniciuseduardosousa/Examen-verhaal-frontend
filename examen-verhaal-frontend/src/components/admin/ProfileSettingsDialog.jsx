import React, { useState, useEffect, useRef } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import TextInput from './TextInput';
import DialogActions from './DialogActions';
import RichTextDisplay from './RichTextDisplay';
import { profileAPI } from '../../services/adminApi';
import toast from 'react-hot-toast';
import mammoth from 'mammoth';

const ProfileSettingsDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    aboutMeText: '',
    footerText: '',
    subtitle: '',
    afbeelding: null,
    removePhoto: false,
    word_file: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [wordFilename, setWordFilename] = useState('');
  const dialogRef = useRef(null);

  const scrollToTop = () => {
    if (dialogRef.current) {
      dialogRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form state when dialog closes
      setIsSubmitted(false);
      setError(null);
      setIsShaking(false);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const fetchData = async () => {
    try {
      const [overmijData, footerData] = await Promise.all([
        profileAPI.getOvermij(),
        profileAPI.getFooter()
      ]);
      
      setFormData({
        aboutMeText: overmijData.tekst || '',
        footerText: footerData.tekst || '',
        subtitle: overmijData.subtitel || 'De persoonlijke schrijfplek van Ingrid (ook wel Inge genoemd)',
        afbeelding: null,
        removePhoto: false,
        word_file: null
      });

      if (overmijData.afbeelding) {
        setPhotoPreview(overmijData.afbeelding);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Kon data niet laden');
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.aboutMeText?.trim()) {
      errors.push('Over Mij tekst is verplicht');
    }
    if (!formData.footerText?.trim()) {
      errors.push('Footer tekst is verplicht');
    }
    if (!formData.subtitle?.trim()) {
      errors.push('Subtitel is verplicht');
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      scrollToTop();
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        afbeelding: file,
        removePhoto: false
      }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      afbeelding: null,
      removePhoto: true
    }));
    setPhotoPreview(null);
  };

  const handleWordImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Convert HTML formatting to markdown-style formatting
      const formattedText = html
        // Convert bold and italic (must be done first)
        .replace(/<strong[^>]*><em[^>]*>(.*?)<\/em><\/strong>/gi, '***$1***')
        // Convert bold
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        // Convert italic
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        // Convert underline
        .replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__')
        // Convert strikethrough
        .replace(/<s[^>]*>(.*?)<\/s>/gi, '~~$1~~')
        // Convert code
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        // Convert paragraphs to double newlines
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        // Convert line breaks to single newlines
        .replace(/<br\s*\/?>/gi, '\n')
        // Remove other HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up extra spaces and newlines while preserving structure
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/\s+$/gm, '') // Remove trailing spaces on each line
        .trim();

      setFormData(prev => ({
        ...prev,
        aboutMeText: formattedText,
        word_file: file
      }));
      setWordFilename(file.name);
    } catch (error) {
      console.error('Error importing Word document:', error);
      setError('Er is een fout opgetreden bij het importeren van het Word document');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      scrollToTop();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setError(null);
    setIsLoading(true);
    scrollToTop();

    try {
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      const [profileResponse, footerResponse] = await Promise.all([
        profileAPI.updateOvermij({
          aboutMeText: formData.aboutMeText.trim(),
          subtitle: formData.subtitle.trim(),
          afbeelding: formData.afbeelding instanceof File ? formData.afbeelding : undefined,
          removePhoto: formData.removePhoto
        }),
        profileAPI.updateFooter({
          footerText: formData.footerText.trim()
        })
      ]);

      window.dispatchEvent(new Event('profileDataUpdated'));
      window.dispatchEvent(new Event('footerTextUpdated'));

      toast.success('Instellingen succesvol opgeslagen');
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Er is een fout opgetreden bij het opslaan van de instellingen');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      scrollToTop();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={dialogRef} className="bg-[#FFFFF5] rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Profiel Instellingen</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="md:max-h-none max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <ProfilePhotoUpload
                photoPreview={photoPreview}
                onPhotoChange={handlePhotoChange}
                onPhotoRemove={handleRemovePhoto}
              />

              <TextInput
                label="Subtitel"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                rows={1}
                required
                isSubmitted={isSubmitted}
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-mono font-bold">
                    Over Mij Tekst
                  </label>
                  {!wordFilename && (
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 rounded-md cursor-pointer text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-blue-700 font-mono text-sm">
                        Word importeren
                      </span>
                      <input
                        type="file"
                        accept=".docx"
                        onChange={handleWordImport}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>
                
                {wordFilename && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-md mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-700 font-mono flex-grow truncate text-sm">
                      {wordFilename}
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        if (confirm(`Wilt u het document "${wordFilename}" verwijderen?`)) {
                          setWordFilename('');
                          setFormData(prev => ({
                            ...prev,
                            word_file: null,
                            aboutMeText: ''
                          }));
                          
                          // Reset file input
                          const fileInput = document.querySelector('input[type="file"][accept=".docx"]');
                          if (fileInput) {
                            fileInput.value = "";
                          }
                        }
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                      title="Verwijder document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <TextInput
                  name="aboutMeText"
                  value={formData.aboutMeText}
                  onChange={handleChange}
                  rows={5}
                  required
                  isSubmitted={isSubmitted}
                />
              </div>

              <TextInput
                label="Footer Tekst"
                name="footerText"
                value={formData.footerText}
                onChange={handleChange}
                rows={3}
                required
                isSubmitted={isSubmitted}
              />
            </div>

            <DialogActions 
              onClose={onClose} 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsDialog; 