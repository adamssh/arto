import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';

export function useCategories() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      return await dbService.getCategories(user);
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newCategory) => {
      return await dbService.createCategory(user, newCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      return await dbService.updateCategory(user, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id) => {
      return await dbService.deleteCategory(user, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', user?.id] });
    },
  });
}

