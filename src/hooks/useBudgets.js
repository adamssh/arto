import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useBudgets(month, year) {
  const { user } = useAuth();
  
  const currentMonth = month ?? (new Date().getMonth() + 1);
  const currentYear = year ?? new Date().getFullYear();

  return useQuery({
    queryKey: ['budgets', user?.id, currentMonth, currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newBudget) => {
      // Validate duplicates
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_id', newBudget.category_id)
        .eq('month', newBudget.month)
        .eq('year', newBudget.year);
        
      if (existing && existing.length > 0) {
        throw new Error('Budget untuk kategori ini sudah ada di bulan yang sama');
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...newBudget, user_id: user.id }])
        .select();
        
      if (error) throw error;
      return data;
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
      // If changing category, check for duplicates
      if (updates.category_id) {
        const { data: existing } = await supabase
          .from('budgets')
          .select('id')
          .eq('user_id', user.id)
          .eq('category_id', updates.category_id)
          .eq('month', updates.month)
          .eq('year', updates.year)
          .neq('id', id);
          
        if (existing && existing.length > 0) {
          throw new Error('Budget untuk kategori ini sudah ada di bulan yang sama');
        }
      }

      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();
        
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets', user?.id, variables.month, variables.year] });
    },
  });
}
