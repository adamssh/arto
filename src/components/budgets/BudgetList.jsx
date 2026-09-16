import { useState } from 'react';
import { useBudgetProgress } from '../../hooks/useBudgetProgress';
import { useDeleteBudget } from '../../hooks/useBudgets';
import BudgetCard from './BudgetCard';
import BudgetForm from './BudgetForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

export default function BudgetList() {
  const { budgetProgress, isLoading } = useBudgetProgress();
  const deleteMutation = useDeleteBudget();

  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat budget...</div>;

  const handleDelete = async () => {
    if (deletingBudget) {
      await deleteMutation.mutateAsync({ id: deletingBudget.id, month: deletingBudget.month, year: deletingBudget.year });
      setDeletingBudget(null);
    }
  };

  if (!budgetProgress || budgetProgress.length === 0) {
    return (
      <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-sm mt-4">
        <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-xl">🎯</span>
        </div>
        <p className="text-sm font-medium text-text-primary mb-1">Belum ada budget bulan ini</p>
        <p className="text-xs text-text-secondary">Atur limit pengeluaranmu sekarang.</p>
      </div>
    );
  }

  return (
    <div className="pb-8 mt-4">
      <div className="flex flex-col">
        {budgetProgress.map(budget => (
          <BudgetCard 
            key={budget.id} 
            budget={budget} 
            onEdit={setEditingBudget}
            onDelete={setDeletingBudget}
          />
        ))}
      </div>

      <Modal 
        isOpen={!!editingBudget} 
        onClose={() => setEditingBudget(null)}
        title="Edit Budget"
      >
        {editingBudget && (
          <BudgetForm 
            initialData={editingBudget} 
            onSuccess={() => setEditingBudget(null)}
            onCancel={() => setEditingBudget(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        title="Hapus Budget"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary">
            Apakah Anda yakin ingin menghapus budget untuk kategori <strong>{deletingBudget?.category?.name}</strong>?
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={() => setDeletingBudget(null)} className="flex-1">
              Batal
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="flex-1 bg-expense hover:bg-expense/90"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

