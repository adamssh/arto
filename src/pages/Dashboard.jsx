import { useState } from 'react';
import { useDashboardSummary } from '../hooks/useDashboardSummary';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import ExpenseSummaryCard from '../components/dashboard/ExpenseSummaryCard';
import SummaryRow from '../components/dashboard/SummaryRow';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/transactions/TransactionForm';
import CategoryForm from '../components/categories/CategoryForm';
import PaymentMethodForm from '../components/transactions/PaymentMethodForm';

export default function Dashboard() {
  const { summary, transactions, isLoading } = useDashboardSummary();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryModalState, setCategoryModalState] = useState({ isOpen: false, type: 'expense' });
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6 text-center text-text-secondary">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <GreetingHeader />
      <ExpenseSummaryCard 
        weeklyExpense={summary.weeklyExpense}
        dailyExpense={summary.dailyExpense}
        averageWeeklyExpense={summary.averageWeeklyExpense}
      />
      <SummaryRow income={summary.monthlyIncome} expense={summary.monthlyExpense} />
      <QuickActions />
      <RecentTransactions 
        transactions={transactions} 
        onEditTransaction={setEditingTransaction} 
      />

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
    </div>
  );
}
