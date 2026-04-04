import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Ticket } from '../types';

// 1. Hook to get all tickets
export const useGetTickets = () => {
  return useQuery({
    queryKey: ['tickets'], // This is the unique "cache key"
    queryFn: async () => {
      const { data } = await api.get<Ticket[]>('/tickets');
      return data;
    },
  });
};

// 2. Hook to create a new ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTicket: { title: string; description: string; priority: string }) => {
      const { data } = await api.post<Ticket>('/tickets', newTicket);
      return data;
    },
    // When the mutation succeeds, tell React Query to refetch the tickets!
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
};

// 3. Hook to update a ticket (e.g., changing status)
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Ticket> & { id: number }) => {
      const { data } = await api.patch<Ticket>(`/tickets/${id}`, updates);
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific ticket details cache
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket', variables.id] });
    },
  });
};