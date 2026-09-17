import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      return await dbService.getProfile(user);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates) => {
      return await dbService.updateProfile(user, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
  });
}

