import { Pencil, Trash2 } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import CategoryIcon from '../ui/CategoryIcon';

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const { status, percentage, spent, amount, category } = budget;

  let progressColor = 'bg-primary';
  let statusText = null;
  let statusTextColor = '';

  if (status === 'warning') {
    progressColor = 'bg-beige';
    statusText = 'Mendekati limit';
    statusTextColor = 'text-text-secondary';
  } else if (status === 'over') {
    progressColor = 'bg-expense';
    statusText = 'Melebihi limit';
    statusTextColor = 'text-expense';
  }

  return (
    <div className="bg-surface rounded-xl2 p-5 border border-sage/10 shadow-soft mb-4 relative group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <CategoryIcon colorString={category?.color} size="md" />
          <div>
            <h3 className="font-semibold text-text-primary">{category?.name || 'Kategori'}</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              {formatCurrency(spent)} / {formatCurrency(amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity -mr-3 -mt-2">
          <button 
            onClick={() => onEdit(budget)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-primary transition-colors rounded-full"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => onDelete(budget)}
            className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-expense transition-colors rounded-full"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <ProgressBar progress={percentage} color={progressColor} className="mb-2" />
      
      {statusText && (
        <p className={`text-xs font-medium text-right mt-1 ${statusTextColor}`}>
          {statusText}
        </p>
      )}
    </div>
  );
}

