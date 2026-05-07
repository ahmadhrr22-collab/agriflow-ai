'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAlerts(status?: string) {
  return useQuery({
    queryKey: ['alerts', status],
    queryFn: async () => {
      const url = status ? `/alerts?status=${status}` : '/alerts';
      const res = await api.get(url);
      return res.data;
    },
    refetchInterval: 1000 * 30,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['alerts-unread'],
    queryFn: async () => {
      const res = await api.get('/alerts/unread-count');
      return res.data;
    },
    refetchInterval: 1000 * 30,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/alerts/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-unread'] });
    },
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/alerts/${id}/dismiss`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      queryClient.invalidateQueries({ queryKey: ['alerts-unread'] });
    },
  });
}