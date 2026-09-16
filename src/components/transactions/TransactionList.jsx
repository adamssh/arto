import { useState, useMemo } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import id from 'date-fns/locale/id';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
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

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch = !searchTerm || 
        (t.category?.name || '').toLowerCase().includes(searchLower) || 
        (t.description || '').toLowerCase().includes(searchLower);
        
      const matchCategory = !filters.categoryId || t.category_id === filters.categoryId;
      const matchDateStart = !filters.startDate || t.transaction_date >= filters.startDate;
      const matchDateEnd = !filters.endDate || t.transaction_date <= filters.endDate;
      const matchMinAmount = !filters.minAmount || t.amount >= Number(filters.minAmount);
      const matchMaxAmount = !filters.maxAmount || t.amount <= Number(filters.maxAmount);
      
      return matchSearch && matchCategory && matchDateStart && matchDateEnd && matchMinAmount && matchMaxAmount;
    });
  }, [transactions, searchTerm, filters]);

  const handleClearFilters = () => {
    setFilters({ categoryId: '', startDate: '', endDate: '', minAmount: '', maxAmount: '' });
  };

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat transaksi...</div>;
  if (!transactions || transactions.length === 0) {
    return <div className="p-8 text-center text-text-secondary">Belum ada transaksi.</div>;
  }

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
            <div className="relative">
              <select
                value={filters.categoryId}
                onChange={e => setFilters({...filters, categoryId: e.target.value})}
                className="w-full bg-surface border border-sage/30 rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-primary appearance-none"
              >
                <option value="">Semua Kategori</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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

