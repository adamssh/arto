import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ExpenseSummaryCard({ weeklyExpense, dailyExpense, averageWeeklyExpense }) {
  const [isObscured, setIsObscured] = useState(() => {
    const saved = localStorage.getItem('arto_expense_obscured');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const toggleObscured = () => {
    setIsObscured(prev => {
      const next = !prev;
      localStorage.setItem('arto_expense_obscured', JSON.stringify(next));
      return next;
    });
  };

  const formatCurrency = (amount) => {
    if (isObscured) return 'Rp •••••••';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-6 bg-gradient-to-br from-[#688c76] to-[#425b4b] text-surface rounded-xl2 p-6 shadow-soft overflow-hidden relative">
      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-surface/80 text-sm font-medium uppercase tracking-wide">Pengeluaran Hari Ini</p>
            <button 
              onClick={toggleObscured}
              className="text-surface/60 hover:text-surface transition-colors focus:outline-none"
              aria-label="Toggle visibility"
            >
              {isObscured ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">{formatCurrency(dailyExpense)}</h2>
        </div>

        <div className="flex items-center bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <div className="flex flex-col flex-1">
            <span className="text-surface/70 text-xs font-medium mb-0.5">Minggu Ini</span>
            <span className="text-surface font-semibold">{formatCurrency(weeklyExpense)}</span>
          </div>
          <div className="w-px h-8 bg-white/20 mx-4" />
          <div className="flex flex-col flex-1 text-left">
            <span className="text-surface/70 text-xs font-medium mb-0.5">Rata-Rata / Hari</span>
            <span className="text-surface font-semibold">{formatCurrency(averageWeeklyExpense)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

