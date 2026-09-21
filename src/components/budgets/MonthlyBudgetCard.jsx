import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudgets, useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';
import { Edit2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function MonthlyBudgetCard() {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const { data: transactions = [] } = useTransactions();
  const { data: budgets = [] } = useBudgets();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const globalBudget = budgets.find(b => b.category_id === null);
  
  // Calculate total expenses this month
  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const tDate = new Date(t.transaction_date);
    return tDate.getMonth() + 1 === currentMonth && tDate.getFullYear() === currentYear;
  }).reduce((sum, t) => sum + t.amount, 0);

  const budgetAmount = globalBudget?.amount || 0;
  
  const handleOpenEdit = () => {
    setInputValue(budgetAmount ? budgetAmount.toString() : '');
    setIsEditOpen(true);
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    const rawVal = inputValue.toString().replace(/\D/g, '');
    const amount = rawVal ? parseInt(rawVal, 10) : 0;
    
    if (amount <= 0) return;
    
    if (globalBudget) {
      await updateMutation.mutateAsync({
        id: globalBudget.id,
        amount,
        month: currentMonth,
        year: currentYear,
        category_id: null
      });
    } else {
      await createMutation.mutateAsync({
        amount,
        month: currentMonth,
        year: currentYear,
        category_id: null
      });
    }
    setIsEditOpen(false);
  };

  const percentage = budgetAmount > 0 ? Math.min(Math.round((currentMonthExpenses / budgetAmount) * 100), 100) : 0;
  
  let progressColor = 'bg-primary';
  if (percentage >= 90) progressColor = 'bg-expense';
  else if (percentage >= 75) progressColor = 'bg-orange-400';

  const formatNumberInput = (val) => {
    if (!val) return '';
    const raw = val.toString().replace(/\D/g, '');
    return raw ? new Intl.NumberFormat('id-ID').format(raw) : '';
  };

  return (
    <>
      <div className="bg-gradient-to-br from-[#688c76] to-[#425b4b] text-surface rounded-xl2 p-6 shadow-soft relative overflow-hidden mb-6 group">
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <h2 className="text-surface/80 text-sm font-medium uppercase tracking-wide mb-1">
              Total Budget Bulan Ini
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {budgetAmount > 0 ? formatCurrency(budgetAmount) : 'Belum Diatur'}
              </span>
            </div>
          </div>
          <button 
            onClick={handleOpenEdit}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-surface transition-colors border border-white/10"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {budgetAmount > 0 && (
          <div className="relative z-10 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 space-y-3">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-surface/80">
                Terpakai: <span className="text-surface font-semibold">{formatCurrency(currentMonthExpenses)}</span>
              </span>
              <span className={percentage >= 100 ? 'text-red-300 font-bold' : percentage >= 80 ? 'text-orange-300 font-bold' : 'text-surface font-bold'}>
                {percentage}%
              </span>
            </div>
            
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-red-400' : percentage >= 80 ? 'bg-orange-400' : 'bg-white'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="text-right text-[10px] text-surface/70 font-medium">
              Sisa: {formatCurrency(Math.max(budgetAmount - currentMonthExpenses, 0))}
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Atur Total Budget">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input 
            label="Total Budget Bulanan (Rp)"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={formatNumberInput(inputValue)}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              setInputValue(val);
            }}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            autoFocus
          />
          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)} className="flex-1">
              Batal
            </Button>
            <Button type="submit" disabled={!inputValue} className="flex-1">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
