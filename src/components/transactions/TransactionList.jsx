import { useState } from 'react';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import id from 'date-fns/locale/id';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CategoryForm from '../categories/CategoryForm';

export default function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat transaksi...</div>;
  if (!transactions || transactions.length === 0) {
    return <div className="p-8 text-center text-text-secondary">Belum ada transaksi.</div>;
  }

  // Group by date
  const grouped = transactions.reduce((acc, curr) => {
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
    return format(d, 'EEEE, d MMMM', { locale: id });
  };

  return (
    <div className="pb-8">
      {dates.map(date => (
        <div key={date} className="mb-6">
          <h3 className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider pl-2">
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
      ))}

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

