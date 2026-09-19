import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import id from 'date-fns/locale/id';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import CategoryIcon from '../ui/CategoryIcon';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CategoryForm from '../categories/CategoryForm';
import Input from '../ui/Input';
import DatePicker from '../ui/DatePicker';

export default function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const { data: paymentMethods = [] } = usePaymentMethods();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = React.useRef(null);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const paymentMethodDropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (paymentMethodDropdownRef.current && !paymentMethodDropdownRef.current.contains(event.target)) {
        setIsPaymentMethodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryIds: [],
    paymentMethodIds: [],
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const activeFilterCount = Object.values(filters).filter(val => Array.isArray(val) ? val.length > 0 : Boolean(val)).length;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = !searchTerm || 
        (t.category?.name || '').toLowerCase().includes(searchLower) || 
        (t.description || '').toLowerCase().includes(searchLower);
        
            const matchCategory = filters.categoryIds.length === 0 || filters.categoryIds.includes(t.category_id);
      const matchPaymentMethod = filters.paymentMethodIds.length === 0 || filters.paymentMethodIds.includes(t.payment_method_id);
      const matchDateStart = !filters.startDate || t.transaction_date >= filters.startDate;
      const matchDateEnd = !filters.endDate || t.transaction_date <= filters.endDate;
      const matchMinAmount = !filters.minAmount || t.amount >= Number(filters.minAmount);
      const matchMaxAmount = !filters.maxAmount || t.amount <= Number(filters.maxAmount);
      
      return matchSearch && matchCategory && matchPaymentMethod && matchDateStart && matchDateEnd && matchMinAmount && matchMaxAmount;
    });
  }, [transactions, searchTerm, filters]);

  const handleClearFilters = () => { setFilters({ categoryIds: [], paymentMethodIds: [], startDate: '', endDate: '', minAmount: '', maxAmount: '' }); };

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat transaksi...</div>;


  // Group by date
  const grouped = filteredTransactions.reduce((acc, curr) => {
    const date = curr.transaction_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(curr);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

  const getDayLabel = (dateStr) => {
    const d = parseISO(dateStr);
    if (isToday(d)) return 'Hari ini';
    if (isYesterday(d)) return 'Kemarin';
    return format(d, 'dd MMMM yyyy', { locale: id });
  };

  return (
    <div className="pb-8">
      {/* Search & Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Cari kategori atau catatan..."
            className="w-full bg-surface/50 border border-sage/30 rounded-xl2 pl-10 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`relative p-2.5 rounded-xl2 border transition-colors flex items-center justify-center ${showFilters || activeFilterCount > 0 ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface/50 border-sage/30 text-text-secondary hover:bg-surface'}`}
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-surface/50 border border-sage/30 p-4 rounded-xl2 mb-6 flex flex-col gap-4 text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-text-primary">Filter Transaksi</span>
            {(searchTerm || activeFilterCount > 0) && (
              <button onClick={() => { setSearchTerm(''); handleClearFilters(); }} className="text-xs text-expense font-medium hover:underline">
                Reset Semua
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary ml-1">Kategori</label>
            <div className="relative" ref={categoryDropdownRef}>
              <div 
                className="w-full bg-surface border border-sage/30 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    if (filters.categoryIds.length === 0) return <span className="text-text-secondary text-sm">Semua Kategori</span>;
                    if (filters.categoryIds.length === 1) {
                      const sel = categories.find(c => c.id === filters.categoryIds[0]);
                      return <span className="text-text-primary text-sm font-medium">{sel ? sel.name : 'Semua Kategori'}</span>;
                    }
                    return <span className="text-text-primary text-sm font-medium">{filters.categoryIds.length} Kategori Terpilih</span>;
                  })()}
                </div>
                <ChevronDown size={16} className={`text-text-secondary transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </div>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-[0_8px_30px_rgba(85,117,97,0.12)] border border-sage/10 overflow-hidden z-50 max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setFilters({...filters, categoryIds: []})}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      filters.categoryIds.length === 0 ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.categoryIds.length === 0 ? 'bg-primary border-primary text-white' : 'border-sage/30 bg-surface'}`}>
                      {filters.categoryIds.length === 0 && <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="currentColor"/></svg>}
                    </div>
                    <span className="font-medium text-sm">Semua Kategori</span>
                  </button>
                  {categories.map(c => {
                    const isSelected = filters.categoryIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          const newIds = isSelected 
                            ? filters.categoryIds.filter(id => id !== c.id) 
                            : [...filters.categoryIds, c.id];
                          setFilters({...filters, categoryIds: newIds});
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                          isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-sage/30 bg-surface'}`}>
                          {isSelected && <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="currentColor"/></svg>}
                        </div>
                        <CategoryIcon colorString={c.color} size="sm" />
                        <span className="font-medium text-sm">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary ml-1">Metode Pembayaran</label>
            <div className="relative" ref={paymentMethodDropdownRef}>
              <div 
                className="w-full bg-surface border border-sage/30 rounded-xl px-3 py-2 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
                onClick={() => setIsPaymentMethodOpen(!isPaymentMethodOpen)}
              >
                <div className="flex items-center gap-2">
                  {(() => {
                    if (filters.paymentMethodIds.length === 0) return <span className="text-text-secondary text-sm">Semua Metode Pembayaran</span>;
                    if (filters.paymentMethodIds.length === 1) {
                      const sel = paymentMethods.find(c => c.id === filters.paymentMethodIds[0]);
                      return <span className="text-text-primary text-sm font-medium">{sel ? sel.name : 'Semua Metode Pembayaran'}</span>;
                    }
                    return <span className="text-text-primary text-sm font-medium">{filters.paymentMethodIds.length} Metode Terpilih</span>;
                  })()}
                </div>
                <ChevronDown size={16} className={`text-text-secondary transition-transform ${isPaymentMethodOpen ? 'rotate-180' : ''}`} />
              </div>

              {isPaymentMethodOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-[0_8px_30px_rgba(85,117,97,0.12)] border border-sage/10 overflow-hidden z-50 max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setFilters({...filters, paymentMethodIds: []})}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      filters.paymentMethodIds.length === 0 ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.paymentMethodIds.length === 0 ? 'bg-primary border-primary text-white' : 'border-sage/30 bg-surface'}`}>
                      {filters.paymentMethodIds.length === 0 && <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="currentColor"/></svg>}
                    </div>
                    <span className="font-medium text-sm">Semua Metode Pembayaran</span>
                  </button>
                  {paymentMethods.map(pm => {
                    const isSelected = filters.paymentMethodIds.includes(pm.id);
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          const newIds = isSelected 
                            ? filters.paymentMethodIds.filter(id => id !== pm.id) 
                            : [...filters.paymentMethodIds, pm.id];
                          setFilters({...filters, paymentMethodIds: newIds});
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                          isSelected ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-sage/30 bg-surface'}`}>
                          {isSelected && <svg width="10" height="8" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 9.4L0 5.4L1.4 4L4 6.6L10.6 0L12 1.4L4 9.4Z" fill="currentColor"/></svg>}
                        </div>
                        <div className={`w-5 h-5 rounded flex-shrink-0 bg-${pm.color || 'sage'}`}></div>
                        <span className="font-medium text-sm">{pm.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <DatePicker
                label="Dari Tanggal"
                value={filters.startDate}
                onChange={val => setFilters({...filters, startDate: val})}
                compact={true}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                label="Sampai"
                value={filters.endDate}
                onChange={val => setFilters({...filters, endDate: val})}
                align="right"
                compact={true}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium text-text-secondary ml-1">Min. Nominal (Rp)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0"
                value={filters.minAmount}
                onChange={e => setFilters({...filters, minAmount: e.target.value.replace(/\D/g,'')})}
                className="w-full bg-surface border border-sage/30 rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-xs font-medium text-text-secondary ml-1">Maks. Nominal (Rp)</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="Tak hingga"
                value={filters.maxAmount}
                onChange={e => setFilters({...filters, maxAmount: e.target.value.replace(/\D/g,'')})}
                className="w-full bg-surface border border-sage/30 rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {dates.length === 0 && (searchTerm || activeFilterCount > 0) ? (
        <div className="py-10 text-center">
          <p className="text-text-secondary">Tidak ada transaksi yang cocok dengan filter/pencarian Anda.</p>
          <Button variant="secondary" className="mt-4" onClick={() => { setSearchTerm(''); handleClearFilters(); }}>
            Hapus Filter
          </Button>
        </div>
      ) : dates.length === 0 ? (
        <div className="py-10 text-center text-text-secondary">Belum ada transaksi.</div>
      ) : (
        dates.map(date => (
          <div key={date} className="mb-3">
            <h3 className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider pl-2">
              {getDayLabel(date)}
            </h3>
            <div className="flex flex-col">
              {grouped[date].map(t => (
                <TransactionItem 
                  key={t.id} 
                  transaction={t} 
                  onEdit={setEditingTransaction}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <Modal 
        isOpen={!!editingTransaction} 
        onClose={() => setEditingTransaction(null)}
        title="Edit Transaksi"
      >
        {editingTransaction && (
          <TransactionForm 
            initialData={editingTransaction} 
            onSuccess={() => setEditingTransaction(null)}
            onCancel={() => setEditingTransaction(null)}
            onOpenCategoryManage={() => setCategoryModalOpen(true)}
          />
        )}
      </Modal>

      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Tambah Kategori"
      >
        {categoryModalOpen && (
          <CategoryForm
            initialData={{ type: editingTransaction?.type || 'expense' }}
            onSuccess={() => setCategoryModalOpen(false)}
            onCancel={() => setCategoryModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

