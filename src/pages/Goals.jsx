import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import BudgetList from '../components/budgets/BudgetList';
import BudgetForm from '../components/budgets/BudgetForm';

export default function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: categories = [], isLoading } = useCategories();
  
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Budget Bulan Ini</h1>
      </header>

      {(!isLoading && expenseCategories.length === 0) ? (
        <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-soft mt-4">
          <p className="text-sm font-medium text-text-primary mb-1">Belum ada kategori pengeluaran</p>
          <p className="text-xs text-text-secondary mb-4">Buat kategori pengeluaran terlebih dahulu di halaman Transaksi.</p>
        </div>
      ) : (
        <Button onClick={() => setIsModalOpen(true)} className="w-full mb-2">
          + Tambah Budget
        </Button>
      )}

      <BudgetList />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Tambah Budget"
      >
        {isModalOpen && (
          <BudgetForm 
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
