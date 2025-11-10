import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../app/store/StoreProvider';
import { formatCurrency } from '../../lib/dateHelpers';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import './MovementsPage.css';

const MovementsPage = () => {
  const { state, actions } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [formData, setFormData] = useState({
    type: 'sale',
    amount: '',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm')
  });

  // Filtros y búsqueda
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: '',
    search: ''
  });
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('dateISO');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Funciones auxiliares
  const getTypeLabel = (type) => {
    const labels = {
      sale: 'Venta',
      expense: 'Gasto',
      adjustment: 'Ajuste'
    };
    return labels[type] || type;
  };

  const getTypeClass = (type) => {
    const classes = {
      sale: 'type-sale',
      expense: 'type-expense',
      adjustment: 'type-adjustment'
    };
    return classes[type] || '';
  };

  // Estadísticas de movimientos
  const movementStats = useMemo(() => {
    if (!state.movements || !Array.isArray(state.movements)) {
      return {
        totalMovements: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        revenueCount: 0,
        expenseCount: 0
      };
    }
    
    const today = new Date();
    const thisMonth = state.movements.filter(m => {
      try {
        return isWithinInterval(parseISO(m.dateISO), { 
          start: startOfMonth(today), 
          end: endOfMonth(today) 
        });
      } catch (error) {
        console.warn('Error parsing date in movementStats:', m.dateISO);
        return false;
      }
    });
    
    const totalRevenue = thisMonth
      .filter(m => m.type === 'sale')
      .reduce((sum, m) => sum + m.amount, 0);
    
    const totalExpenses = thisMonth
      .filter(m => m.type === 'expense')
      .reduce((sum, m) => sum + m.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    
    return {
      totalMovements: thisMonth.length,
      totalRevenue,
      totalExpenses,
      netProfit,
      revenueCount: thisMonth.filter(m => m.type === 'sale').length,
      expenseCount: thisMonth.filter(m => m.type === 'expense').length
    };
  }, [state.movements]);

  // Filtrar y ordenar movimientos
  const filteredMovements = useMemo(() => {
    try {
      // Validar que state.movements existe
      if (!state.movements || !Array.isArray(state.movements)) {
        console.warn('state.movements is not an array:', state.movements);
        return [];
      }
      
      let filtered = [...state.movements];
      console.log('Total movements:', state.movements.length);
      console.log('Filters:', filters);

      // Filtrar por tipo
      if (filters.type) {
        filtered = filtered.filter(movement => movement.type === filters.type);
        console.log('After type filter:', filtered.length);
      }

      // Filtrar por búsqueda
      if (filters.search && filters.search.trim()) {
        const searchLower = filters.search.toLowerCase().trim();
        console.log('Searching for:', searchLower);
        filtered = filtered.filter(movement => {
          const note = movement.meta?.note || '';
          const typeLabel = getTypeLabel(movement.type);
          const matches = note.toLowerCase().includes(searchLower) ||
                         typeLabel.toLowerCase().includes(searchLower);
          return matches;
        });
        console.log('After search filter:', filtered.length);
      }

    // Filtrar por rango de fechas
    if (filters.dateFrom) {
      try {
        const fromDate = startOfDay(parseISO(filters.dateFrom));
        filtered = filtered.filter(movement => {
          try {
            return isWithinInterval(parseISO(movement.dateISO), { start: fromDate, end: new Date() });
          } catch (error) {
            console.warn('Error parsing movement date:', movement.dateISO);
            return false;
          }
        });
      } catch (error) {
        console.warn('Error parsing dateFrom:', filters.dateFrom);
      }
    }

    if (filters.dateTo) {
      try {
        const toDate = endOfDay(parseISO(filters.dateTo));
        filtered = filtered.filter(movement => {
          try {
            return isWithinInterval(parseISO(movement.dateISO), { start: new Date(0), end: toDate });
          } catch (error) {
            console.warn('Error parsing movement date:', movement.dateISO);
            return false;
          }
        });
      } catch (error) {
        console.warn('Error parsing dateTo:', filters.dateTo);
      }
    }

      // Ordenar
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        if (sortField === 'dateISO') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      console.log('Final filtered movements:', filtered.length);
      return filtered;
    } catch (error) {
      console.error('Error in filteredMovements:', error);
      return [];
    }
  }, [state.movements, filters, sortField, sortDirection]);

  // Paginación
  const paginatedMovements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMovements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMovements, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);

  const handleOpenModal = (movement = null) => {
    if (movement) {
      setEditingMovement(movement);
      
      // Extraer la fecha y hora del ISO string convirtiendo a zona horaria local
      let dateValue = format(new Date(), 'yyyy-MM-dd');
      let timeValue = format(new Date(), 'HH:mm');
      
      if (movement.dateISO) {
        // Parsear el ISO string para convertir a zona horaria local
        const localDate = parseISO(movement.dateISO);
        
        // Extraer fecha y hora en zona horaria local
        dateValue = format(localDate, 'yyyy-MM-dd');
        timeValue = format(localDate, 'HH:mm');
      }
      
      setFormData({
        type: movement.type,
        amount: (movement.amount / 100).toString(),
        note: movement.meta?.note || '',
        date: dateValue,
        time: timeValue
      });
    } else {
      setEditingMovement(null);
      setFormData({
        type: 'sale',
        amount: '',
        note: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMovement(null);
    setFormData({
      type: 'sale',
      amount: '',
      note: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm')
    });
  };

  const handleSave = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    setIsLoading(true);
    
    try {
      const amountInCents = Math.round(parseFloat(formData.amount) * 100);
      const meta = formData.note ? { note: formData.note } : {};

      if (editingMovement) {
        // Crear fecha local con la fecha y hora seleccionadas
        // formData.date está en formato 'yyyy-MM-dd' y formData.time en formato 'HH:mm'
        const [year, month, day] = formData.date.split('-').map(Number);
        const [hours, minutes] = formData.time.split(':').map(Number);
        
        // Crear Date en zona horaria local
        const localDate = new Date(year, month - 1, day, hours, minutes);
        
        // Convertir a ISO string (esto automáticamente convierte a UTC)
        const dateISO = localDate.toISOString();
        
        const updatedMovement = {
          ...editingMovement,
          type: formData.type,
          amount: amountInCents,
          dateISO: dateISO,
          meta
        };
        actions.updateMovement(updatedMovement);
      } else {
        actions.addMovement(formData.type, amountInCents, meta);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving movement:', error);
      alert('Error al guardar el movimiento');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (movementId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      actions.deleteMovement(movementId);
    }
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      type: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleQuickFilter = (type) => {
    const today = new Date();
    setFilters({
      dateFrom: format(today, 'yyyy-MM-dd'),
      dateTo: format(today, 'yyyy-MM-dd'),
      type: type,
      search: ''
    });
    setCurrentPage(1);
  };

  const handleDateRange = (days) => {
    const today = new Date();
    const fromDate = subDays(today, days);
    setFilters({
      dateFrom: format(fromDate, 'yyyy-MM-dd'),
      dateTo: format(today, 'yyyy-MM-dd'),
      type: '',
      search: ''
    });
    setCurrentPage(1);
  };

  return (
    <>
      <div className="movements-page">
        {/* Botón flotante */}
        <button 
          className="movements-floating-add-btn"
          onClick={() => handleOpenModal()}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : '➕'} Agregar Movimiento
        </button>

        {/* Layout de dos columnas */}
        <div className="movements-layout">

          {/* Columna izquierda: Filtros */}
          <div className="movements-filters-column">
            <div className="movements-filters-section">

              <div className="movements-filters-header">
                <h3>Filtros y Búsqueda</h3>
              </div>
              
              <div className="quick-filters">
                <button 
                  className="quick-filter-btn"
                  onClick={() => handleDateRange(7)}
                >
                  Últimos 7 días
                </button>
                <button 
                  className="quick-filter-btn"
                  onClick={() => handleDateRange(30)}
                >
                  Últimos 30 días
                </button>
                <button 
                  className="quick-filter-btn"
                  onClick={() => handleQuickFilter('sale')}
                >
                  Solo Ventas
                </button>
                <button 
                  className="quick-filter-btn"
                  onClick={() => handleQuickFilter('expense')}
                >
                  Solo Gastos
                </button>
              </div>
            
            <div className="filters-grid">
              <div className="filter-group">
                <label>🔍 Búsqueda:</label>
                <input
                  type="text"
                  placeholder="Buscar por observaciones o tipo..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              
              <div className="filter-group">
                <label>📅 Fecha desde:</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              
              <div className="filter-group">
                <label>📅 Fecha hasta:</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
              
              <div className="filter-group">
                <label>🏷️ Tipo:</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="">Todos los tipos</option>
                  <option value="sale">Venta</option>
                  <option value="expense">Gasto</option>
                  <option value="adjustment">Ajuste</option>
                </select>
              </div>
              
              <div className="filter-actions">
                <button 
                  className="btn-secondary"
                  onClick={clearFilters}
                >
                  🗑️ Limpiar Filtros
                </button>
              </div>
            </div>
            
            {/* Resultados */}
            <div className="results-info">
              <span className="results-count">
                {filteredMovements.length} de {state.movements.length} movimientos
              </span>
              {filters.search && (
                <span className="search-term">
                  Buscando: "{filters.search}"
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: Lista de movimientos */}
        <div className="movements-column">
          <div className="expenses-table-container">
        <div className="table-header-section">
          <h3>Lista de Movimientos</h3>
          <div className="table-controls">
            <span className="table-info">
              Página {currentPage} de {totalPages} ({filteredMovements.length} resultados)
            </span>
          </div>
        </div>
        
        <div className="movements-table">
          <div className="table-header">
            <div 
              className={`col-date sortable ${sortField === 'dateISO' ? `sort-${sortDirection}` : ''}`}
              onClick={() => handleSort('dateISO')}
            >
              📅 Fecha {sortField === 'dateISO' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div 
              className={`col-type sortable ${sortField === 'type' ? `sort-${sortDirection}` : ''}`}
              onClick={() => handleSort('type')}
            >
              🏷️ Tipo {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div 
              className={`col-amount sortable ${sortField === 'amount' ? `sort-${sortDirection}` : ''}`}
              onClick={() => handleSort('amount')}
            >
              💰 Monto {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </div>
            <div className="col-note">📝 Observaciones</div>
            <div className="col-actions">⚙️ Acciones</div>
          </div>
          
          <div className="table-body">
            {paginatedMovements.length === 0 ? (
              <div className="no-data">
                <div className="no-data-icon">📊</div>
                <h4>No hay movimientos</h4>
                <p>No se encontraron movimientos que coincidan con los filtros aplicados.</p>
                <button 
                  className="btn-primary"
                  onClick={() => handleOpenModal()}
                >
                  ➕ Agregar Primer Movimiento
                </button>
              </div>
            ) : (
              paginatedMovements.map(movement => (
                <div key={movement.id} className="table-row">
                  <div className="col-date">
                    <div className="date-main">
                      {(() => {
                        // Extraer solo la parte de la fecha (YYYY-MM-DD) del ISO string
                        // Esto evita problemas de zona horaria al mostrar la fecha
                        const dateMatch = movement.dateISO.match(/^(\d{4}-\d{2}-\d{2})/);
                        if (dateMatch) {
                          const [year, month, day] = dateMatch[1].split('-').map(Number);
                          return format(new Date(year, month - 1, day), 'dd/MM/yyyy', { locale: es });
                        }
                        return format(parseISO(movement.dateISO), 'dd/MM/yyyy', { locale: es });
                      })()}
                    </div>
                    <div className="date-time">
                      {(() => {
                        // Parsear el ISO string para convertir a zona horaria local
                        const localDate = parseISO(movement.dateISO);
                        // Formatear la hora en zona horaria local
                        return format(localDate, 'HH:mm', { locale: es });
                      })()}
                    </div>
                  </div>
                  <div className="col-type">
                    <span className={`type-badge ${getTypeClass(movement.type)}`}>
                      {getTypeLabel(movement.type)}
                    </span>
                  </div>
                  <div className="col-amount">
                    <span className={`amount-value ${movement.type === 'expense' ? 'amount-negative' : 'amount-positive'}`}>
                      {movement.type === 'expense' ? '-' : '+'}{formatCurrency(movement.amount)}
                    </span>
                  </div>
                  <div className="col-note">
                    <div className="note-content">
                      {movement.meta?.note || <span className="no-note">Sin observaciones</span>}
                    </div>
                  </div>
                  <div className="col-actions">
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleOpenModal(movement)}
                        title="Editar movimiento"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(movement.id)}
                        title="Eliminar movimiento"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
      </div>

    </div>
    </div> {/* ← Cierra .movements-page */}

    {/* Modal */}
    {showModal && (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>{editingMovement ? 'Editar Movimiento' : 'Agregar Movimiento'}</h2>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Tipo *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="sale">Venta</option>
                <option value="expense">Gasto</option>
                <option value="adjustment">Ajuste</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Monto *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Hora</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            
            <div className="form-group">
              <label>Nota</label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Observaciones opcionales..."
                rows="3"
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={handleCloseModal}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? '⏳ Guardando...' : (editingMovement ? '✅ Actualizar' : '💾 Guardar')}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MovementsPage;