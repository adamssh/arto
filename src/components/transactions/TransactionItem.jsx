import { Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import CategoryIcon from '../ui/CategoryIcon';

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  
  // Format amount to Rupiah
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(transaction.amount);

  return (
    <button 
      onClick={() => onEdit(transaction)}
      className="w-full flex items-center justify-between p-4 bg-surface rounded-xl2 shadow-soft border border-sage/10 mb-3 hover:border-primary/30 transition-colors text-left"
    >
      <div className="flex items-center gap-4">
        <CategoryIcon colorString={transaction.category?.color} size="lg" />
        <div>
          <h4 className="font-medium text-text-primary line-clamp-1">
            {transaction.description || transaction.category?.name || 'Tanpa Keterangan'}
          </h4>
          <p className="text-sm text-text-secondary mt-0.5">
            {format(parseISO(transaction.transaction_date), 'dd MMM yyyy', { locale: idLocale })}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <span className={`font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
      </div>
    </button>
  );
}
