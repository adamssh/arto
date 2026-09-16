import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import CategoryForm from './CategoryForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function CategoryList() {
  const { data: categories, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat kategori...</div>;

  const incomeCategories = categories?.filter(c => c.type === 'income') || [];
  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  const handleDelete = async () => {
    if (deletingCategory) {
      await deleteMutation.mutateAsync(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const renderCategoryList = (list, title) => (
    <div className="mb-6 last:mb-0">
      <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">{title}</h3>
      {list.length === 0 ? (
        <p className="text-sm text-text-secondary italic">Belum ada kategori</p>
      ) : (
        <div className="flex flex-col gap-2">
          {list.map(category => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-sage/10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-${category.color}`} />
                <span className="font-medium text-text-primary">{category.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditingCategory(category)}
                  className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                >
                  <Pencil size={16} />
                </button>
                <button 
                  onClick={() => setDeletingCategory(category)}
                  className="p-1.5 text-text-secondary hover:text-expense transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Daftar Kategori</h2>
        <Button 
          onClick={() => setEditingCategory({ isNew: true })}
          className="py-1.5 px-3 text-sm"
        >
          + Tambah
        </Button>
      </div>

      {renderCategoryList(expenseCategories, 'Pengeluaran')}
      {renderCategoryList(incomeCategories, 'Pemasukan')}

      <Modal 
        isOpen={!!editingCategory} 
        onClose={() => setEditingCategory(null)}
        title={editingCategory?.id ? "Edit Kategori" : "Tambah Kategori"}
      >
        {editingCategory && (
          <CategoryForm 
            initialData={editingCategory.isNew ? undefined : editingCategory} 
            onSuccess={() => setEditingCategory(null)}
            onCancel={() => setEditingCategory(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        title="Hapus Kategori"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary">
            Apakah Anda yakin ingin menghapus kategori <strong>{deletingCategory?.name}</strong>? 
            Transaksi yang menggunakan kategori ini akan kehilangan referensi kategorinya.
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={() => setDeletingCategory(null)} className="flex-1">
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
