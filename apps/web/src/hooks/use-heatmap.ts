'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useHeatmap(commodityId: string) {
  return useQuery({
    queryKey: ['heatmap', commodityId],
    queryFn: async () => {
      const res = await api.get(`/prices/heatmap?commodityId=${commodityId}`);
      return res.data;
    },
    enabled: !!commodityId,
    refetchInterval: 1000 * 60 * 5,
  });
}