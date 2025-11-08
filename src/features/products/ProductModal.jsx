import React, { useState, useEffect } from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { generateId } from '../../lib/id';
import './ProductModal.css';

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    isFreePrice: false,
    imageDataUrl: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (product) {
      // Modo edición
      setFormData({
        name: product.name,
        price: product.isFreePrice ? '' : (product.price / 100).toString(),
        isFreePrice: product.isFreePrice,
        imageDataUrl: product.imageDataUrl
      });
      setImagePreview(product.imageDataUrl);
    } else {
      // Modo creación
      setFormData({
        name: '',
        price: '',
        isFreePrice: false,
        imageDataUrl: null
      });
      setImagePreview(null);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'isFreePrice') {
      setFormData(prev => ({
        ...prev,
        isFreePrice: checked,
        price: checked ? '' : prev.price
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Por favor selecciona una imagen válida' }));
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'La imagen debe ser menor a 2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageDataUrl: reader.result }));
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageDataUrl: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.isFreePrice) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        newErrors.price = 'El precio debe ser mayor a 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const productData = {
      id: product ? product.id : generateId(),
      name: formData.name.trim(),
      price: formData.isFreePrice ? 0 : Math.round(parseFloat(formData.price) * 100),
      isFreePrice: formData.isFreePrice,
      imageDataUrl: formData.imageDataUrl
    };

    onSave(productData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Agregar Producto'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nombre del producto <span className="required">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Café Americano"
            error={errors.name}
          />
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="isFreePrice"
              name="isFreePrice"
              checked={formData.isFreePrice}
              onChange={handleChange}
              className="checkbox-input"
            />
            <label htmlFor="isFreePrice" className="checkbox-label">
              Precio libre (se define al momento de venta)
            </label>
          </div>
        </div>

        {!formData.isFreePrice && (
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Precio <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">$</span>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.price}
                className="input-with-prefix-field"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Imagen del producto</label>
          
          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="image-remove-btn"
              >
                🗑️ Eliminar imagen
              </button>
            </div>
          ) : (
            <div className="image-upload-container">
              <label htmlFor="image" className="image-upload-label">
                <div className="image-upload-content">
                  <span className="upload-icon">📷</span>
                  <span className="upload-text">Click para subir imagen</span>
                  <span className="upload-hint">PNG, JPG hasta 2MB</span>
                </div>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-upload-input"
              />
            </div>
          )}
          {errors.image && <span className="error-message">{errors.image}</span>}
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="form-btn"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="form-btn"
          >
            {product ? 'Guardar cambios' : 'Agregar producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;

