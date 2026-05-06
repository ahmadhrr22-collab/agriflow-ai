'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useNationalSummary(commodityId: string) {
  return useQuery({
    queryKey: ['national-summary', commodityId],
    queryFn: async () => {
      const res = await api.get(`/prices/national-summary?commodityId=${commodityId}`);
      return res.data;
    },
    enabled: !!commodityId,
    refetchInterval: 1000 * 60 * 5,
  });
}

export function usePriceHistory(commodityId: string, regionId: string, days = 30) {
  return useQuery({
    queryKey: ['price-history', commodityId, regionId, days],
    queryFn: async () => {
      const res = await api.get(
        `/prices/history?commodityId=${commodityId}&regionId=${regionId}&days=${days}`
      );
      return res.data;
    },
    enabled: !!commodityId && !!regionId,
  });
}

export function useHeatmapData(commodityId: string) {
  return useQuery({
    queryKey: ['heatmap', commodityId],
    queryFn: async () => {
      const res = await api.get(`/prices/heatmap?commodityId=${commodityId}`);
      return res.data;
    },
    enabled: !!commodityId,
  });
}

export function useCommodities() {
  return useQuery({
    queryKey: ['commodities'],
    queryFn: async () => {
      const res = await api.get('/commodities');
      return res.data;
    },
  });
}