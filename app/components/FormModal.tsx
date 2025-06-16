import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import { Field } from "@/app/types/content";
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import Image from 'next/image';

interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  title: string;
  fields: Field<T>[];
  initialData?: Partial<T>;
  mode?: 'create' | 'edit';
}

interface WithImage {
  image?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const FormModal = <T extends WithImage>({ 
  open, 
  onClose, 
  onSubmit, 
  title, 
  fields, 
  initialData,
  mode = 'create'
}: FormModalProps<T>) => {
  const [formData, setFormData] = useState<Partial<T>>(initialData || {});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData);
      // Si une image existe déjà, on la met en preview
      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [open, initialData]);

  const validateField = (field: Field<T>, value: T[keyof T] | undefined): string | null => {
    if (mode === 'create' && field.required && !value) {
      return 'Ce champ est requis';
    }
    return null;
  };

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    const field = fields.find(f => f.name === name);
    if (field) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  };

  const optimizeImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Redimensionner si l'image est trop grande
          const MAX_DIMENSION = 1200;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir en WebP si possible, sinon en JPEG
          const quality = 0.8;
          const optimizedBase64 = canvas.toDataURL('image/webp', quality);
          resolve(optimizedBase64);
        };
        img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du type de fichier
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Format d\'image non supporté. Utilisez JPEG, PNG ou WebP.'
      }));
      return;
    }

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        image: 'L\'image est trop volumineuse. Taille maximale : 5MB.'
      }));
      return;
    }

    try {
      setIsUploading(true);
      
      // Créer une prévisualisation immédiate
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Optimiser l'image en arrière-plan
      const optimizedImage = await optimizeImage(file);
      setImagePreview(optimizedImage);
      
      // Nettoyer l'URL de prévisualisation
      URL.revokeObjectURL(previewUrl);
    } catch {
      setErrors(prev => ({
        ...prev,
        image: 'Erreur lors du traitement de l\'image.'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof T, string>> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 || mode === 'edit') {
      if (isUploading) {
        setErrors(prev => ({
          ...prev,
          image: 'Veuillez attendre que l\'image soit traitée.'
        }));
        return;
      }

      if (imagePreview) {
        onSubmit({ ...formData, image: imagePreview });
      } else {
        onSubmit(formData);
      }
    }
  };

  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const renderField = (field: Field<T>) => {
    const error = errors[field.name];
    const isRequired = mode === 'create' && field.required;

    if (field.type === 'multiselect' || field.type === 'select') {
      return (
        <FormControl fullWidth key={String(field.name)} error={!!error}>
          <InputLabel>{field.label}{isRequired ? ' *' : ''}</InputLabel>
          <Select
            multiple={field.multiple}
            value={field.multiple ? (formData[field.name] as string[] || []) : (formData[field.name] as string || '')}
            onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
            label={field.label}
            required={isRequired}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <Typography color="error" variant="caption">{error}</Typography>}
        </FormControl>
      );
    }

    if (field.type === 'date') {
      return (
        <TextField
          key={String(field.name)}
          fullWidth
          label={field.label}
          type="date"
          value={formatDateForInput(formData[field.name] as string)}
          onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
          required={isRequired}
          error={!!error}
          helperText={error}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            style: { 
              padding: '12px 14px',
              fontSize: '16px',
            }
          }}
        />
      );
    }

    if (field.name === 'image') {
      return (
        <Box key={String(field.name)} sx={{ mb: 2 }}>
          <input
            accept={ALLOWED_TYPES.join(',')}
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
            disabled={isUploading}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<ImageIcon />}
              sx={{ mb: 2 }}
              disabled={isUploading}
            >
              {isUploading ? 'Traitement...' : 'Choisir une image'}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Image 
                src={imagePreview} 
                alt="Preview" 
                width={200}
                height={200}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
          {errors.image && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
              {errors.image}
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <TextField
        key={String(field.name)}
        fullWidth
        label={field.label}
        type={field.type === 'time' ? 'time' : 'text'}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value as T[keyof T])}
        required={isRequired}
        multiline={field.type === 'textarea'}
        rows={field.type === 'textarea' ? 4 : 1}
        error={!!error}
        helperText={error}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          style: { 
            padding: '12px 14px',
            fontSize: '16px',
          }
        }}
      />
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="form-modal-title"
      keepMounted
    >
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '90vh',
          overflowY: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 0,
        }}
      >
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            {fields.map((field) => (
              <Box key={String(field.name)} sx={{ mb: 3 }}>
                {renderField(field)}
              </Box>
            ))}
            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 3
            }}>
              <Button 
                onClick={onClose}
                variant="outlined"
                sx={{ 
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{ 
                  minWidth: 100,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {mode === 'create' ? 'Créer' : 'Modifier'}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Modal>
  );
};

export default FormModal;