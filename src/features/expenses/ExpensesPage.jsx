import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/app/store/StoreProvider';
import { format, parseISO, startOfDay, endOfDay, isWithinInterval, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// Importar estilos modulares
import './styles/ExpensesPage.base.css';    // Estilos base comunes
import './styles/ExpensesPage.mobile.css';  // Estilos para móvil
import './styles/ExpensesPage.tablet.css';  // Estilos para tablet
import './styles/ExpensesPage.desktop.css'; // Estilos para desktop

const ExpensesPage = () => {
  const { state, actions } = useStore();

  // Estados para filtros y paginación
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    type: 'expense'
  });

  const [sortField, setSortField] = useState('dateISO');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });

  // Estado para el modal de filtros en tablet
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filtrar solo movimientos de tipo 'expense'
  const expenses = useMemo(() => {
    if (!state.movements || !Array.isArray(state.movements)) {
      return [];
    }

    return state.movements.filter(movement => movement.type === 'expense');
  }, [state.movements]);

  // Estadísticas mensuales
  useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) {
      return { totalAmount: 0, count: 0 };
    }

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    const monthlyExpenses = expenses.filter(expense => {
      try {
        const expenseDate = parseISO(expense.dateISO);
        return isWithinInterval(expenseDate, {
          start: startOfCurrentMonth,
          end: endOfCurrentMonth
        });
      } catch (error) {
        return false;
      }
    });

    const totalAmount = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalAmount,
      count: monthlyExpenses.length
    };
  }, [expenses]);

// Aplicar filtros
  const filteredExpenses = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) {
      return [];
    }

    let filtered = [...expenses];

    // Filtro de búsqueda
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(expense => {
        const note = expense.meta?.note || '';
        return note.toLowerCase().includes(searchTerm);
      });
    }

    // Filtro de fecha
    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(expense => {
        try {
          const expenseDate = parseISO(expense.dateISO);

          if (filters.dateFrom) {
            const fromDate = startOfDay(parseISO(filters.dateFrom));
            if (expenseDate < fromDate) return false;
          }

          if (filters.dateTo) {
            const toDate = endOfDay(parseISO(filters.dateTo));
            if (expenseDate > toDate) return false;
          }

          return true;
        } catch (error) {
          return false;
        }
      });
    }

    return filtered;
  }, [expenses, filters]);

  // Ordenamiento
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'amount') {
        aValue = a.amount;
        bValue = b.amount;
      } else if (sortField === 'dateISO') {
        aValue = new Date(a.dateISO);
        bValue = new Date(b.dateISO);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredExpenses, sortField, sortDirection]);

  // Paginación
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedExpenses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);

  // Handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleQuickFilter = (type) => {
    if (type === 'last7days') {
      const sevenDaysAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      setFilters(prev => ({
        ...prev,
        dateFrom: sevenDaysAgo,
        dateTo: format(new Date(), 'yyyy-MM-dd')
      }));
    } else if (type === 'last30days') {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      setFilters(prev => ({
        ...prev,
        dateFrom: thirtyDaysAgo,
        dateTo: format(new Date(), 'yyyy-MM-dd')
      }));
    } else if (type === 'thisMonth') {
      const startOfCurrentMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endOfCurrentMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      setFilters(prev => ({
        ...prev,
        dateFrom: startOfCurrentMonth,
        dateTo: endOfCurrentMonth
      }));
    }
    setCurrentPage(1);
  };

  const handleDateRange = (days) => {
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');
    const endDate = format(new Date(), 'yyyy-MM-dd');
    setFilters(prev => ({
      ...prev,
      dateFrom: startDate,
      dateTo: endDate
    }));
    setCurrentPage(1);
  };

  // Obtener filtros activos para mostrar en chips
  const getActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.search && filters.search.trim()) {
      activeFilters.push({
        key: 'search',
        label: `Búsqueda: "${filters.search}"`,
        value: filters.search
      });
    }
    
    if (filters.dateFrom) {
      activeFilters.push({
        key: 'dateFrom',
        label: `Desde: ${format(parseISO(filters.dateFrom), 'dd/MM/yyyy', { locale: es })}`,
        value: filters.dateFrom
      });
    }
    
    if (filters.dateTo) {
      activeFilters.push({
        key: 'dateTo',
        label: `Hasta: ${format(parseISO(filters.dateTo), 'dd/MM/yyyy', { locale: es })}`,
        value: filters.dateTo
      });
    }
    
    return activeFilters;
  };

  // Eliminar filtro específico
  const removeFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: filterKey === 'search' ? '' : ''
    }));
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      type: 'expense'
    });
  };

  const handleOpenModal = (movement = null) => {
    setEditingMovement(movement);
    setFormData({
      amount: movement ? (movement.amount / 100).toFixed(2) : '',
      note: movement ? (movement.meta?.note || '') : '',
      date: movement ? format(parseISO(movement.dateISO), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMovement(null);
    setFormData({
      amount: '',
      note: '',
      date: format(new Date(), 'yyyy-MM-dd')
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
        const updatedMovement = {
          ...editingMovement,
          amount: amountInCents,
          dateISO: new Date(formData.date).toISOString(),
          meta
        };
        actions.updateMovement(updatedMovement);
      } else {
        actions.addExpense(amountInCents, formData.note);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error al guardar el gasto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (movementId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      actions.deleteMovement(movementId);
    }
  };

  const formatAmount = (amountInCents) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amountInCents / 100);
  };

  const formatDisplayDate = (dateISO) => {
    return format(parseISO(dateISO), 'dd/MM/yyyy', { locale: es });
  };

  return (
    <>

      <div className="expenses-page">

        {/* Botón flotante para agregar */}
        <button
          className="expenses-floating-add-btn"
          onClick={() => handleOpenModal()}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : '➕'} Agregar Gasto
        </button>

        {/* Layout de dos columnas  expenses-layout */}
        <div className="expenses-layout">

          {/* Columna izquierda: Filtros */}
          <div className="expenses-filters-column">
            <div className="expenses-filters-section">

              <div className="expenses-filters-header">
                <h3>Filtros y Búsqueda</h3>

                <div className="expenses-quick-filters">
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
                      onClick={() => handleQuickFilter('thisMonth')}
                  >
                    Este mes
                  </button>
                  <button
                      className="quick-filter-btn"
                      onClick={() => setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))}
                  >
                    Limpiar fechas
                  </button>
                </div>
              </div>


              <div className="filters-grid">
                <div className="filter-group filter-search">
                  <label>🔍 Búsqueda:</label>
                  <input
                    type="text"
                    placeholder="Buscar por comentario..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group filter-date-from">
                  <label>📅 Fecha desde:</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group filter-date-to">
                  <label>📅 Fecha hasta:</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="results-info">
                <div className="results-count">
                  {sortedExpenses.length} gasto{sortedExpenses.length !== 1 ? 's' : ''} encontrado{sortedExpenses.length !== 1 ? 's' : ''}
                </div>
                {filters.search && (
                  <div className="search-term">
                    Búsqueda: "{filters.search}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha: Lista de gastos expenses-column */}
          <div className="expenses-column">
            {/* Chips de filtros activos */}
            {getActiveFilters().length > 0 && (
              <div className="active-filters-section">

                <div className="active-filters-chips">
                  <button
                      className="clear-all-filters-btn"
                      onClick={clearAllFilters}
                      title="Limpiar todos los filtros"
                  >
                    Limpiar todo
                  </button>
                  {getActiveFilters().map((filter) => (
                    <div key={filter.key} className="active-filter-chip">
                      <span className="filter-chip-label">{filter.label}</span>
                      <button 
                        className="filter-chip-remove"
                        onClick={() => removeFilter(filter.key)}
                        title={`Eliminar filtro: ${filter.label}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="expenses-table-container">
              <div className="table-header-section">
                <h3>Lista de Gastos</h3>
                <div className="table-controls">
                  <div className="table-info">
                    Página {currentPage} de {totalPages} • {sortedExpenses.length} total
                  </div>
                  
                  {/* Botón Filtrar para tablet */}
                  <button 
                    className="filter-toggle-btn"
                    onClick={() => setShowFiltersModal(true)}
                  >
                    <span className="filter-icon">🔍</span>
                    Filtrar
                    {getActiveFilters().length > 0 && (
                      <span className="filter-count">{getActiveFilters().length}</span>
                    )}
                  </button>
                </div>
              </div>

              {paginatedExpenses.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">💰</div>
                  <h3>No se encontraron gastos</h3>
                  <p>Intenta ajustar los filtros o agrega un nuevo gasto</p>
                </div>
              ) : (
                <>
                  <div className="expenses-table">
                    <div className="table-header">
                      <div
                        className={`table-cell sortable ${sortField === 'dateISO' ? `sort-${sortDirection}` : ''}`}
                        onClick={() => handleSort('dateISO')}
                        title="Fecha"
                      >
                        <span className="header-icon">📅</span>
                        <span className="header-text">Fecha</span>
                      </div>
                      <div className="table-cell col-type" title="Tipo">
                        <span className="header-icon">🏷️</span>
                        <span className="header-text">Tipo</span>
                      </div>
                      <div
                        className={`table-cell col-amount sortable ${sortField === 'amount' ? `sort-${sortDirection}` : ''}`}
                        onClick={() => handleSort('amount')}
                        title="Monto"
                      >
                        <span className="header-icon">💰</span>
                        <span className="header-text">Monto</span>
                      </div>
                      <div className="table-cell" title="Observaciones">
                        <span className="header-icon">📝</span>
                        <span className="header-text">Observaciones</span>
                      </div>
                      <div className="table-cell" title="Acciones">
                        <span className="header-icon">⚙️</span>
                        <span className="header-text">Acciones</span>
                      </div>
                    </div>

                    <div className="table-body">
                      {paginatedExpenses.map((expense) => (
                        <div key={expense.id} className="table-row">
                          <div className="table-cell col-date">
                            <div className="date-main">{formatDisplayDate(expense.dateISO)}</div>
                            <div className="date-time">{format(parseISO(expense.dateISO), 'HH:mm', { locale: es })}</div>
                          </div>
                          <div className="table-cell col-type">
                            <span className="type-badge type-expense">Gasto</span>
                          </div>
                          <div className="table-cell">
                            <div className="amount-value expense-amount col-amount">
                              {formatAmount(expense.amount)}
                            </div>
                          </div>
                          <div className="table-cell">
                            <div className="note-content">
                              {expense.meta?.note ? (
                                <span>{expense.meta.note}</span>
                              ) : (
                                <span className="no-note">Sin observaciones</span>
                              )}
                            </div>
                          </div>
                          <div className="table-cell">
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => handleOpenModal(expense)}
                                title="Editar gasto"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(expense.id)}
                                title="Eliminar gasto"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || totalPages <= 1}
                    >
                      ← Anterior
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: Math.max(1, Math.min(5, totalPages || 1)) }, (_, i) => {
                        let pageNum;
                        if ((totalPages || 1) <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={totalPages <= 1}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages || 1, prev + 1))}
                      disabled={currentPage === (totalPages || 1) || totalPages <= 1}
                    >
                      Siguiente →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMovement ? 'Editar Gasto' : 'Agregar Gasto'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="amount">Monto *</label>
                <input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="note">Observaciones</label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Descripción del gasto (opcional)"
                  rows="3"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Fecha</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="form-input"
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
                {isLoading ? '⏳ Guardando...' : (editingMovement ? 'Actualizar' : 'Guardar')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de filtros para tablet */}
      {showFiltersModal && (
        <div className="filters-modal-overlay" onClick={() => setShowFiltersModal(false)}>
          <div className="filters-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="filters-modal-header">
              <h3>Filtros y Búsqueda</h3>

              <button 
                className="filters-modal-close"
                onClick={() => setShowFiltersModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="filters-modal-body">
              {/* Chips de filtros rápidos */}
              <div className="expenses-quick-filters">
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
                    onClick={() => handleQuickFilter('thisMonth')}
                >
                  Este mes
                </button>
                <button
                    className="quick-filter-btn"
                    onClick={() => setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))}
                >
                  Limpiar fechas
                </button>
              </div>

              <div className="filters-grid">
                <div className="filter-group filter-search">
                  <label>🔍 Buscar:</label>
                  <input
                    type="text"
                    placeholder="Buscar por comentario..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group filter-date-from">
                  <label>📅 Fecha desde:</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group filter-date-to">
                  <label>📅 Fecha hasta:</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="results-info">
                <div className="results-count">
                  {sortedExpenses.length} gasto{sortedExpenses.length !== 1 ? 's' : ''} encontrado{sortedExpenses.length !== 1 ? 's' : ''}
                </div>
                {filters.search && (
                  <div className="search-term">
                    Búsqueda: "{filters.search}"
                  </div>
                )}
              </div>
            </div>

            <div className="filters-modal-footer">
              <button
                className="btn-secondary"
                onClick={clearAllFilters}
              >
                Limpiar todo
              </button>
              <button
                className="btn-primary"
                onClick={() => setShowFiltersModal(false)}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default ExpensesPage;