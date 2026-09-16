import { useState } from 'react';
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
      <header className="mb-6 mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
      </header>

      <div className="flex gap-3 mb-8">
        <Button onClick={() => setIsTxModalOpen(true)} className="flex-1">
          + Tambah
        </Button>
        <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)} className="flex-1">
          Kategori
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
