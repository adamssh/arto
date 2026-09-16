import { useMemo } from 'react';
import { parseISO, getMonth, getYear } from 'date-fns';
import { useBudgets } from './useBudgets';
import { useTransactions } from './useTransactions';

export function useBudgetProgress(month, year) {
  const currentMonth = month ?? (new Date().getMonth() + 1);
  const currentYear = year ?? new Date().getFullYear();

  const { data: budgets = [], isLoading: loadingBudgets } = useBudgets(currentMonth, currentYear);
  const { data: transactions = [], isLoading: loadingTransactions } = useTransactions();

  const budgetProgress = useMemo(() => {
    if (!budgets.length) return [];

    return budgets.map(budget => {
      // Find all expense transactions for this category in the given month/year
      const spent = transactions.reduce((total, tx) => {
        if (tx.type !== 'expense' || tx.category_id !== budget.category_id) return total;
        
        const txDate = parseISO(tx.transaction_date);
        const txMonth = getMonth(txDate) + 1;
        const txYear = getYear(txDate);

        if (txMonth === currentMonth && txYear === currentYear) {
          return total + Number(tx.amount);
        }
        return total;
      }, 0);

      const amount = Number(budget.amount);
      const rawPercentage = (spent / amount) * 100;
      const percentage = Math.min(rawPercentage, 100);

      let status = 'normal';
      if (rawPercentage >= 100) status = 'over';
      else if (rawPercentage >= 80) status = 'warning';

      return {
        ...budget,
        spent,
        percentage,
        status,
      };
    });
  }, [budgets, transactions, currentMonth, currentYear]);

  return {
    budgetProgress,
    isLoading: loadingBudgets || loadingTransactions,
  };
}

