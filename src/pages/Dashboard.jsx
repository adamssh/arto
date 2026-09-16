import { useDashboardSummary } from '../hooks/useDashboardSummary';
import GreetingHeader from '../components/dashboard/GreetingHeader';
import BalanceCard from '../components/dashboard/BalanceCard';
import SummaryRow from '../components/dashboard/SummaryRow';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  const { summary, transactions, isLoading } = useDashboardSummary();

  if (isLoading) {
    return <div className="p-6 text-center text-text-secondary">Memuat data dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <GreetingHeader />
      <BalanceCard balance={summary.totalBalance} />
      <SummaryRow income={summary.monthlyIncome} expense={summary.monthlyExpense} />
      <QuickActions />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
