import { Pencil, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import CategoryIcon from '../ui/CategoryIcon';

const HEX_COLORS = {
  'primary': '#678770',
  'sage': '#8FA99A',
  'expense': '#B87568',
  'pastel-red': '#FFB3BA',
  'pastel-orange': '#FFDFBA',
  'pastel-green': '#BAFFC9',
  'pastel-blue': '#BAE1FF',
  'pastel-purple': '#D5AAFF',
  'pastel-pink': '#FFC4E1',
  'pastel-teal': '#A2E1DB',
  'pastel-peach': '#FFD3B6',
  'pastel-lavender': '#E6B3FF',
};

function hexToRgba(hex, alpha) {
  if (!hex) return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

      <div className="flex flex-col items-end">
        <span className={`font-semibold ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
        {transaction.payment_method && (() => {
          const pmColorName = transaction.payment_method.color || 'sage';
          const pmHex = HEX_COLORS[pmColorName] || HEX_COLORS.sage;
          
          return (
            <span 
              className="text-[11px] font-medium text-text-primary/90 px-2 py-0.5 rounded-md mt-1 whitespace-nowrap"
              style={{ backgroundColor: hexToRgba(pmHex, 0.4) }}
            >
              {transaction.payment_method.name}
            </span>
          );
        })()}
      </div>
    </button>
  );
}
