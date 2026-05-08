'use client';

import { useMutation } from '@tanstack/react-query';
import aiApi from '@/lib/ai-api';

export function useMarketInsight() {
  return useMutation({
    mutationFn: async (params: { commodity_id: string; commodity_name: string }) => {
      const res = await aiApi.post('/insights/market', params);
      return res.data;
    },
  });
}