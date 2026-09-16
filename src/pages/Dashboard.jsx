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

export default function Dashboard() {
  const { summary, transactions, isLoading } = useDashboardSummary();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

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
