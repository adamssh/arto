import { useState } from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TransactionForm from '../transactions/TransactionForm';
import CategoryForm from '../categories/CategoryForm';
import PaymentMethodForm from '../transactions/PaymentMethodForm';

export default function QuickActions() {
  const [modalState, setModalState] = useState({ isOpen: false, type: 'expense' });
  const [categoryModalState, setCategoryModalState] = useState({ isOpen: false, type: 'expense' });
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

  const openModal = (type) => setModalState({ isOpen: true, type });
  const closeModal = () => setModalState({ isOpen: false, type: 'expense' });

  return (
    <>
      <div className="flex gap-3 mb-6">
        <Button 
          onClick={() => openModal('income')} 
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#6f937e] to-[#537260] text-white border-0 shadow-soft hover:opacity-90 transition-opacity rounded-xl2"
        >
          <PlusCircle size={18} />
          <span className="text-sm font-medium">Pemasukan</span>
        </Button>
        <Button 
          onClick={() => openModal('expense')} 
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#6f937e] to-[#537260] text-white border-0 shadow-soft hover:opacity-90 transition-opacity rounded-xl2"
        >
          <MinusCircle size={18} />
          <span className="text-sm font-medium">Pengeluaran</span>
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
            onOpenCategoryManage={(currentType) => setCategoryModalState({ isOpen: true, type: currentType })}
            onOpenPaymentMethodManage={() => setIsPaymentMethodModalOpen(true)}
          />
        )}
      </Modal>

      <Modal
        isOpen={categoryModalState.isOpen}
        onClose={() => setCategoryModalState({ isOpen: false, type: 'expense' })}
        title="Tambah Kategori"
      >
        {categoryModalState.isOpen && (
          <CategoryForm
            initialData={{ type: categoryModalState.type }}
            onSuccess={() => setCategoryModalState({ isOpen: false, type: 'expense' })}
            onCancel={() => setCategoryModalState({ isOpen: false, type: 'expense' })}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPaymentMethodModalOpen}
        onClose={() => setIsPaymentMethodModalOpen(false)}
        title="Tambah Metode Pembayaran"
      >
        {isPaymentMethodModalOpen && (
          <PaymentMethodForm
            onSuccess={() => setIsPaymentMethodModalOpen(false)}
            onCancel={() => setIsPaymentMethodModalOpen(false)}
          />
        )}
      </Modal>
    </>
  );
}

