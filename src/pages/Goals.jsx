import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import BudgetList from '../components/budgets/BudgetList';
import BudgetForm from '../components/budgets/BudgetForm';
import MonthlyBudgetCard from '../components/budgets/MonthlyBudgetCard';
import AuthProfileButton from '../components/ui/AuthProfileButton';

export default function Goals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: categories = [], isLoading } = useCategories();
  
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Budget</h1>
        <AuthProfileButton />
      </header>

      <MonthlyBudgetCard />

      {(!isLoading && expenseCategories.length === 0) ? (
        <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-soft mt-4">
          <p className="text-sm font-medium text-text-primary mb-1">Belum ada kategori pengeluaran</p>
          <p className="text-xs text-text-secondary mb-4">Buat kategori pengeluaran terlebih dahulu di halaman Transaksi.</p>
        </div>
      ) : (
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="w-full mb-6 bg-gradient-to-br from-[#6f937e] to-[#537260] text-white border-0 shadow-soft hover:opacity-90 transition-opacity rounded-xl2"
        >
          + Tambah Budget Kategori
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
