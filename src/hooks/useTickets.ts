import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Ticket, Comment, User } from '../types';

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

// 4. Hook to get a single ticket by ID
export const useGetTicketById = (id: number) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await api.get<Ticket>(`/tickets/${id}`);
      return data;
    },
    enabled: !!id, // Only fetch if we have a valid ID
  });
};

// 5. Hook to get comments for a ticket
export const useGetTicketComments = (id: number) => {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data } = await api.get<Comment[]>(`/tickets/${id}/comments`);
      return data;
    },
    enabled: !!id,
  });
};

// 6. Hook to create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: number; message: string }) => {
      const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, { message });
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the comments cache for this specific ticket so it updates instantly
      queryClient.invalidateQueries({ queryKey: ['comments', variables.ticketId] });
    },
  });
};

// 7. Hook to get all users (for the assignment dropdown)
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users');
      return data;
    },
  });
};