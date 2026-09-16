import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';

export default function SummaryCard({ income, expense, month, year }) {
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const balance = income - expense;

  const currentDate = new Date();
  const isCurrentMonth = month === (currentDate.getMonth() + 1) && year === currentDate.getFullYear();
  const daysToDivide = isCurrentMonth ? Math.max(1, currentDate.getDate()) : new Date(year, month, 0).getDate();
  const averageDailyExpense = expense / daysToDivide;

  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark text-surface rounded-2xl p-6 shadow-soft mb-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10 transition-transform duration-700 group-hover:scale-110" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm border border-white/10 shadow-sm">
              <Wallet size={16} className="text-surface" />
            </div>
            <p className="text-surface/90 text-sm font-medium tracking-wide">Sisa Saldo</p>
          </div>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
            <div className="text-right pb-1">
              <p className="text-surface/70 text-[10px] font-medium uppercase tracking-wider mb-0.5">Rata-rata/hari</p>
              <p className="text-surface/90 text-xs font-semibold">
                {formatCurrency(averageDailyExpense)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/10 shadow-inner">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-full border border-white/10 shadow-sm">
              <ArrowDownLeft size={16} className="text-surface" />
            </div>
            <div className="flex flex-col">
              <span className="text-surface/70 text-[10px] font-medium uppercase tracking-wider mb-0.5">Pemasukan</span>
              <span className="text-surface font-semibold text-sm">{formatCurrency(income)}</span>
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/20 mx-2" />
          
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-full border border-white/10 shadow-sm">
              <ArrowUpRight size={16} className="text-surface" />
            </div>
            <div className="flex flex-col">
              <span className="text-surface/70 text-[10px] font-medium uppercase tracking-wider mb-0.5">Pengeluaran</span>
              <span className="text-surface font-semibold text-sm">{formatCurrency(expense)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

