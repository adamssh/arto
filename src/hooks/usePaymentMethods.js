import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';

export function usePaymentMethods() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payment_methods', user?.id],
    queryFn: async () => {
      return await dbService.getPaymentMethods(user);
    },
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (newMethod) => {
      return await dbService.createPaymentMethod(user, newMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user?.id] });
    },
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      return await dbService.updatePaymentMethod(user, id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user?.id] });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id) => {
      return await dbService.deletePaymentMethod(user, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment_methods', user?.id] });
    },
  });
}
