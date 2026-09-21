import { useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import PeriodSelector from '../components/analytics/PeriodSelector';
import SummaryCard from '../components/analytics/SummaryCard';
import TrendChart from '../components/analytics/TrendChart';
import ExpensePieChart from '../components/analytics/ExpensePieChart';
import ExpenseMethodPieChart from '../components/analytics/ExpenseMethodPieChart';
import AuthProfileButton from '../components/ui/AuthProfileButton';

export default function Analytics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  
  const { 
    getExpenseByCategory,
    getExpenseByPaymentMethod, 
    getMonthlyTrend, 
    getSummary,
    isLoading 
  } = useAnalytics();

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const summary = getSummary(month, year);
  const expenseData = getExpenseByCategory(month, year);
  const methodExpenseData = getExpenseByPaymentMethod(month, year);
  const trendData = getMonthlyTrend(6);

  if (isLoading) {
    return <div className="p-6 text-center text-text-secondary">Memuat analitik...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Analisis</h1>
        <AuthProfileButton />
      </header>

      <PeriodSelector 
        currentDate={currentDate} 
        onChangeDate={(newDate) => {
          setCurrentDate(newDate);
          setSelectedCategoryId(null);
          setSelectedMethodId(null);
        }} 
      />

      {summary.income === 0 && summary.expense === 0 ? (
        <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-soft mt-4">
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📊</span>
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">Belum ada data</p>
          <p className="text-xs text-text-secondary">Tidak ada transaksi pada periode ini.</p>
        </div>
      ) : (
        <>
          <SummaryCard income={summary.income} expense={summary.expense} month={month} year={year} />
          
          <TrendChart data={trendData} />

          <h3 className="text-lg font-semibold mb-3 text-text-primary">Pengeluaran per Kategori</h3>
          
          <ExpensePieChart 
            data={expenseData} 
            selectedCategoryId={selectedCategoryId} 
            onSelectCategory={setSelectedCategoryId}
          />

          <h3 className="text-lg font-semibold mb-3 text-text-primary mt-6">Pengeluaran per Metode Pembayaran</h3>
          
          <ExpenseMethodPieChart 
            data={methodExpenseData} 
            selectedMethodId={selectedMethodId} 
            onSelectMethod={setSelectedMethodId}
          />

        </>
      )}
    </div>
  );
}
