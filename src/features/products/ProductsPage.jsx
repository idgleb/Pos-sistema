import React, { useState, useMemo } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ProductModal from './ProductModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { formatCurrency } from '../../lib/dateHelpers';
import './ProductsPage.css';

const ProductsPage = () => {
  const { state, actions } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, fixed, free
  const [sortBy, setSortBy] = useState('custom'); // custom, name, price-asc, price-desc
  const [draggedProduct, setDraggedProduct] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null, productName: '' });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product) => {
    setConfirmDelete({ 
      isOpen: true, 
      productId: product.id, 
      productName: product.name 
    });
  };

  const confirmDeleteProduct = () => {
    if (confirmDelete.productId) {
      actions.deleteProduct(confirmDelete.productId);
      setConfirmDelete({ isOpen: false, productId: null, productName: '' });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, productId: null, productName: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Actualizar producto existente
      actions.updateProduct({
        ...editingProduct,
        ...productData
      });
    } else {
      // Agregar nuevo producto
      actions.addProduct(productData);
    }
    handleCloseModal();
  };

  // Manejadores de drag & drop
  const handleDragStart = (e, product) => {
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', product.id);
    // Agregar una clase visual al elemento arrastrado
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedProduct(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, product) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedProduct && draggedProduct.id !== product.id) {
      setDragOverIndex(product.id);
    }
  };

  const handleDrop = (e, dropProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedProduct || draggedProduct.id === dropProduct.id) {
      setDragOverIndex(null);
      return;
    }

    // Obtener índices en el array completo de productos
    const products = [...state.products];
    const dragIndex = products.findIndex(p => p.id === draggedProduct.id);
    const dropIndex = products.findIndex(p => p.id === dropProduct.id);
    
    if (dragIndex === -1 || dropIndex === -1) {
      setDragOverIndex(null);
      return;
    }
    
    // Remover el elemento de su posición original
    const [draggedItem] = products.splice(dragIndex, 1);
    
    // Insertar en la nueva posición
    products.splice(dropIndex, 0, draggedItem);
    
    // Actualizar el estado
    actions.reorderProducts(products);
    
    setDragOverIndex(null);
  };

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let filtered = [...state.products];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo de precio
    if (filterType === 'fixed') {
      filtered = filtered.filter(product => !product.isFreePrice);
    } else if (filterType === 'free') {
      filtered = filtered.filter(product => product.isFreePrice);
    }

    // Ordenar (solo si no es 'custom')
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    // Si es 'custom', mantener el orden original de state.products

    return filtered;
  }, [state.products, searchTerm, filterType, sortBy]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalProducts = state.products.length;
    const fixedPriceProducts = state.products.filter(p => !p.isFreePrice).length;
    const freePriceProducts = state.products.filter(p => p.isFreePrice).length;
    const averagePrice = state.products.filter(p => !p.isFreePrice).length > 0
      ? state.products.filter(p => !p.isFreePrice).reduce((sum, p) => sum + p.price, 0) / fixedPriceProducts
      : 0;

    return {
      totalProducts,
      fixedPriceProducts,
      freePriceProducts,
      averagePrice
    };
  }, [state.products]);

  return (
    <div className="products-page">
      <div className="products-content">
        <div className="products-layout">
          {/* Izquierda: Grid de productos */}
          <div className="products-left">
            {/* Mensaje de reordenamiento */}
            {!searchTerm && filterType === 'all' && sortBy === 'custom' && state.products.length > 1 && (
              <div className="reorder-hint">
                💡 Arrastra y suelta las tarjetas para cambiar su orden
              </div>
            )}
            
            {/* Grid de productos */}
            <div className="products-grid">
            {state.products.length === 0 ? (
              <div className="products-empty">
                <div className="empty-icon">📦</div>
                <h2>No hay productos</h2>
                <p>Agrega tu primer producto para comenzar</p>
                <Button variant="primary" size="lg" onClick={handleAddProduct}>
                  Agregar Producto
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="products-empty">
                <div className="empty-icon">🔍</div>
                <h2>No se encontraron productos</h2>
                <p>Intenta con otros términos de búsqueda o filtros</p>
                <Button variant="secondary" size="md" onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
            filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`product-card ${product.isFreePrice ? 'product-card--free-price' : ''} ${dragOverIndex === product.id ? 'drag-over' : ''}`}
                draggable={!searchTerm && filterType === 'all' && sortBy === 'custom'}
                onDragStart={(e) => handleDragStart(e, product)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, product)}
                onDrop={(e) => handleDrop(e, product)}
              >
                <div className="product-image">
                  {product.imageDataUrl ? (
                    <img src={product.imageDataUrl} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">
                      <span className="product-icon">📦</span>
                    </div>
                  )}
                  
                  {/* Botones flotantes sobre la imagen */}
                  <div className="product-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(product);
                      }}
                      className="action-btn action-btn-edit"
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product);
                      }}
                      className="action-btn action-btn-delete"
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className={`product-price ${product.isFreePrice ? 'product-price--free' : ''}`}>
                    {product.isFreePrice ? 'Precio libre' : formatCurrency(product.price)}
                  </p>
                </div>
              </div>
              ))
            )}
            </div>
          </div>

          {/* Derecha: Filtros y búsqueda */}
          <div className="products-right">
            <div className="products-right-content">
              {/* Header con botón */}
              <div className="filters-header">
                <h2 className="filters-title">Filtros y Búsqueda</h2>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleAddProduct}
                  className="add-product-btn-top"
                >
                  <span className="btn-icon">➕</span>
                  Agregar
                </Button>
              </div>

              {/* Contador */}
              <div className="products-counter">
                <span className="counter-icon">📦</span>
                <div className="counter-content">
                  <span className="counter-value">{filteredProducts.length}</span>
                  <span className="counter-label">
                    {filteredProducts.length === state.products.length
                      ? 'productos en total'
                      : `de ${state.products.length} productos`}
                  </span>
                </div>
              </div>

              {/* Búsqueda */}
              <div className="filter-section">
                <label className="filter-label">
                  🔍 Búsqueda
                </label>
                <div className="search-box-right">
                  <Input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-right"
                  />
                  {searchTerm && (
                    <button 
                      className="search-clear-right"
                      onClick={() => setSearchTerm('')}
                      title="Limpiar"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Filtro por tipo */}
              <div className="filter-section">
                <label className="filter-label">
                  🏷️ Tipo de precio
                </label>
                <div className="filter-options-right">
                  <label className="filter-option-right">
                    <input
                      type="radio"
                      name="filterType"
                      value="all"
                      checked={filterType === 'all'}
                      onChange={(e) => setFilterType(e.target.value)}
                    />
                    <span>Todos</span>
                  </label>
                  <label className="filter-option-right">
                    <input
                      type="radio"
                      name="filterType"
                      value="fixed"
                      checked={filterType === 'fixed'}
                      onChange={(e) => setFilterType(e.target.value)}
                    />
                    <span>Precio fijo</span>
                  </label>
                  <label className="filter-option-right">
                    <input
                      type="radio"
                      name="filterType"
                      value="free"
                      checked={filterType === 'free'}
                      onChange={(e) => setFilterType(e.target.value)}
                    />
                    <span>Precio libre</span>
                  </label>
                </div>
              </div>

              {/* Ordenamiento */}
              <div className="filter-section">
                <label className="filter-label">
                  📊 Ordenar por
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select-right"
                >
                  <option value="custom">Orden personalizado</option>
                  <option value="name">Nombre (A-Z)</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                </select>
              </div>

              {/* Limpiar filtros */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setSortBy('custom');
                }}
                className="clear-filters-btn-right"
              >
                🔄 Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteProduct}
        title="¿Estás seguro de eliminar este producto?"
        message={`El producto "${confirmDelete.productName}" será eliminado permanentemente.`}
        confirmText="Aceptar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

export default ProductsPage;
