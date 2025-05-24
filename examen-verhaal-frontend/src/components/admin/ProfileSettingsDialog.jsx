import React, { useState, useEffect, useRef } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import TextInput from './TextInput';
import DialogActions from './DialogActions';
import { profileAPI } from '../../services/adminApi';
import toast from 'react-hot-toast';

const ProfileSettingsDialog = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    aboutMeText: '',
    footerText: '',
    afbeelding: null,
    removePhoto: false
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const dialogRef = useRef(null);

  const scrollToTop = () => {
    const dialogContent = document.querySelector('.max-h-\\[90vh\\].overflow-y-auto');
    if (dialogContent) {
      dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
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
        afbeelding: null,
        removePhoto: false
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
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <ProfilePhotoUpload
              photoPreview={photoPreview}
              onPhotoChange={handlePhotoChange}
              onPhotoRemove={handleRemovePhoto}
            />

            <TextInput
              label="Over Mij Tekst"
              name="aboutMeText"
              value={formData.aboutMeText}
              onChange={handleChange}
              rows={5}
              required
              isSubmitted={isSubmitted}
            />

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
  );
};

export default ProfileSettingsDialog; 