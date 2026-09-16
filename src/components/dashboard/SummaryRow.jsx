import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function SummaryRow({ income, expense }) {
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const monthLabel = format(new Date(), 'MMMM yyyy', { locale: idLocale });

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-1 bg-surface rounded-xl2 p-4 border border-sage/10 shadow-soft">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <div className="w-6 h-6 rounded-full bg-income/10 flex items-center justify-center">
            <ArrowDownLeft size={14} className="text-income" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider">{monthLabel}</span>
        </div>
        <p className="text-sm text-text-secondary mb-0.5">Pemasukan</p>
        <p className="text-lg font-semibold text-income">{formatCurrency(income)}</p>
      </div>
      
      <div className="flex-1 bg-surface rounded-xl2 p-4 border border-sage/10 shadow-soft">
        <div className="flex items-center gap-2 mb-2 text-text-secondary">
          <div className="w-6 h-6 rounded-full bg-expense/10 flex items-center justify-center">
            <ArrowUpRight size={14} className="text-expense" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider">{monthLabel}</span>
        </div>
        <p className="text-sm text-text-secondary mb-0.5">Pengeluaran</p>
        <p className="text-lg font-semibold text-expense">{formatCurrency(expense)}</p>
      </div>
    </div>
  );
}

