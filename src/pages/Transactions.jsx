import { useState } from 'react';
import { Plus, Tags } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import CategoryList from '../components/categories/CategoryList';

export default function Transactions() {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transaksi</h1>
      </header>

      <div className="flex gap-3 mb-4">
        <Button onClick={() => setIsTxModalOpen(true)} className="flex-1 flex items-center justify-center gap-2">
          <Plus size={18} strokeWidth={2.5} />
          <span>Transaksi</span>
        </Button>
        <Button onClick={() => setIsCategoryModalOpen(true)} className="flex-1 flex items-center justify-center gap-2">
          <Tags size={18} />
          <span>Atur Kategori</span>
        </Button>
      </div>

      <TransactionList />

      <Modal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)}
        title="Tambah Transaksi"
      >
        {isTxModalOpen && (
          <TransactionForm 
            onSuccess={() => setIsTxModalOpen(false)}
            onCancel={() => setIsTxModalOpen(false)}
            onOpenCategoryManage={() => {
              setIsTxModalOpen(false);
              setIsCategoryModalOpen(true);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title=""
      >
        {isCategoryModalOpen && (
          <CategoryList />
        )}
      </Modal>
    </div>
  );
}
