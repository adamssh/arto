import { Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'income';
  const categoryColor = transaction.category?.color || 'sage';

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(transaction.amount);

  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-xl2 shadow-sm border border-sage/10 mb-3 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${categoryColor} shrink-0`}>
          <div className="w-4 h-4 bg-white/40 rounded-full" />
        </div>
        <div>
          <h4 className="font-medium text-text-primary line-clamp-1">
            {transaction.description || transaction.category?.name || 'Tanpa Keterangan'}
          </h4>
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
            <span>{transaction.category?.name}</span>
            <span>•</span>
            <span>{format(parseISO(transaction.transaction_date), 'dd MMM yyyy')}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
        <span className={`font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
        <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -mr-2 mt-1">
          <button 
            onClick={() => onEdit(transaction)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-primary transition-colors rounded-full"
            aria-label="Edit"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => onDelete(transaction)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-expense transition-colors rounded-full"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
