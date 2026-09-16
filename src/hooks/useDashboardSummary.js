import { useMemo } from 'react';
import { isSameMonth, isSameYear, isSameWeek, isSameDay, parseISO } from 'date-fns';
import { useTransactions } from './useTransactions';

export function useDashboardSummary() {
  const { data: transactions = [], isLoading } = useTransactions();

  const summary = useMemo(() => {
    let totalBalance = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let weeklyExpense = 0;
    let dailyExpense = 0;

    const now = new Date();

    transactions.forEach(tx => {
      const amount = Number(tx.amount);
      const txDate = parseISO(tx.transaction_date);
      const isCurrentMonth = isSameMonth(txDate, now) && isSameYear(txDate, now);
      const isCurrentWeek = isSameWeek(txDate, now, { weekStartsOn: 1 }); // Start on Monday
      const isCurrentDay = isSameDay(txDate, now);

      if (tx.type === 'income') {
        totalBalance += amount;
        if (isCurrentMonth) monthlyIncome += amount;
      } else if (tx.type === 'expense') {
        totalBalance -= amount;
        if (isCurrentMonth) monthlyExpense += amount;
        if (isCurrentWeek) weeklyExpense += amount;
        if (isCurrentDay) dailyExpense += amount;
      }
    });

    const dayOfWeek = now.getDay();
    const daysElapsedThisWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    const averageWeeklyExpense = weeklyExpense / daysElapsedThisWeek;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      weeklyExpense,
      dailyExpense,
      averageWeeklyExpense
    };
  }, [transactions]);

  return { summary, isLoading, transactions };
}
