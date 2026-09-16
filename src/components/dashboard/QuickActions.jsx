import { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TransactionForm from '../transactions/TransactionForm';

export default function QuickActions() {
  const [modalState, setModalState] = useState({ isOpen: false, type: 'expense' });

  const openModal = (type) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: 'expense' });

  return (
    <>
      <div className="flex gap-3 mb-8">
        <Button 
          variant="secondary" 
          onClick={() => openModal('income')} 
          className="flex-1 flex items-center justify-center gap-2 border-income text-income hover:bg-income/5"
        >
          <PlusCircle size={18} />
          <span className="text-sm">Pemasukan</span>
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => openModal('expense')} 
          className="flex-1 flex items-center justify-center gap-2 border-expense text-expense hover:bg-expense/5"
        >
          <MinusCircle size={18} />
          <span className="text-sm">Pengeluaran</span>
        </Button>
      </div>

      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModal}
        title={`Tambah ${modalState.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}`}
      >
        {modalState.isOpen && (
          <TransactionForm 
            initialData={{ type: modalState.type }} 
            onSuccess={closeModal}
            onCancel={closeModal}
            onOpenCategoryManage={() => {
              // Not fully supported navigating to category modal from dashboard without redesigning router or lifting state
              // But we can just close the modal for now or redirect
              closeModal();
              alert("Buka tab Transactions untuk mengelola kategori.");
            }}
          />
        )}
      </Modal>
    </>
  );
}

