import { useMemo } from 'react';
import { isSameMonth, isSameYear, parseISO } from 'date-fns';
import { useTransactions } from './useTransactions';

export function useDashboardSummary() {
  const { data: transactions = [], isLoading } = useTransactions();

  const summary = useMemo(() => {
    let totalBalance = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    const now = new Date();

    transactions.forEach(tx => {
      const amount = Number(tx.amount);
      const txDate = parseISO(tx.transaction_date);
      const isCurrentMonth = isSameMonth(txDate, now) && isSameYear(txDate, now);

      if (tx.type === 'income') {
        totalBalance += amount;
        if (isCurrentMonth) monthlyIncome += amount;
      } else if (tx.type === 'expense') {
        totalBalance -= amount;
        if (isCurrentMonth) monthlyExpense += amount;
      }
    });

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpense,
    };
  }, [transactions]);

  return { summary, isLoading, transactions };
}
