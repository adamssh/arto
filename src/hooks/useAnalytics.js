import { useMemo } from 'react';
import { parseISO, getMonth, getYear, subMonths, format, isSameMonth, isSameYear } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { tailwindColors } from '../utils/colors';

export function useAnalytics() {
  const { data: transactions = [], isLoading: isLoadingTx } = useTransactions();
  const { data: categories = [], isLoading: isLoadingCat } = useCategories();

  const getExpenseByCategory = (month, year) => {
    if (!transactions.length) return [];

    const expensesMap = {};

    transactions.forEach(tx => {
      const txDate = parseISO(tx.transaction_date);
      if (
        tx.type === 'expense' && 
        getMonth(txDate) + 1 === month && 
        getYear(txDate) === year
      ) {
        const catId = tx.category_id;
        if (!expensesMap[catId]) {
          expensesMap[catId] = {
            id: catId,
            categoryName: tx.category?.name || 'Tanpa Kategori',
            amount: 0,
            color: tailwindColors[tx.category?.color] || tailwindColors['sage'],
            rawColor: tx.category?.color || 'sage'
          };
        }
        expensesMap[catId].amount += Number(tx.amount);
      }
    });

    return Object.values(expensesMap).sort((a, b) => b.amount - a.amount);
  };

  const getMonthlyTrend = (monthsCount = 6) => {
    if (!transactions.length) return [];

    const trend = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const targetDate = subMonths(now, i);
      const targetMonth = getMonth(targetDate);
      const targetYear = getYear(targetDate);
      
      let income = 0;
      let expense = 0;

      transactions.forEach(tx => {
        const txDate = parseISO(tx.transaction_date);
        if (getMonth(txDate) === targetMonth && getYear(txDate) === targetYear) {
          if (tx.type === 'income') income += Number(tx.amount);
          if (tx.type === 'expense') expense += Number(tx.amount);
        }
      });

      trend.push({
        monthLabel: format(targetDate, 'MMM', { locale: idLocale }),
        fullDate: targetDate, // For internal reference if needed
        income,
        expense
      });
    }

    return trend;
  };

  const getSummary = (month, year) => {
    let income = 0;
    let expense = 0;

    transactions.forEach(tx => {
      const txDate = parseISO(tx.transaction_date);
      if (getMonth(txDate) + 1 === month && getYear(txDate) === year) {
        if (tx.type === 'income') income += Number(tx.amount);
        if (tx.type === 'expense') expense += Number(tx.amount);
      }
    });

    return { income, expense };
  };

  return {
    getExpenseByCategory,
    getMonthlyTrend,
    getSummary,
    categories,
    isLoading: isLoadingTx || isLoadingCat
  };
}

