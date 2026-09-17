import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';

export function useBudgets(month, year) {
  const { user } = useAuth();
  
  const currentMonth = month ?? (new Date().getMonth() + 1);
  const currentYear = year ?? new Date().getFullYear();

  return useQuery({
    queryKey: ['budgets', user?.id, currentMonth, currentYear],
    queryFn: async () => {
      return await dbService.getBudgets(user, currentMonth, currentYear);
    },
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newBudget) => {
      const exists = await dbService.checkBudgetExists(user, newBudget.month, newBudget.year, newBudget.category_id);
      if (exists) {
        throw new Error('Budget untuk kategori ini sudah ada di bulan yang sama');
      }

      return await dbService.createBudget(user, newBudget);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id, variables.month, variables.year] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (updates.category_id !== undefined) {
        const exists = await dbService.checkBudgetExists(user, updates.month, updates.year, updates.category_id, id);
        if (exists) {
          throw new Error('Budget untuk kategori ini sudah ada di bulan yang sama');
        }
      }

      return await dbService.updateBudget(user, id, updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id, variables.month, variables.year] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id }) => {
      return await dbService.deleteBudget(user, id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id, variables.month, variables.year] });
    },
  });
}

