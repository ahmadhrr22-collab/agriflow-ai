'use client';

import { useMutation } from '@tanstack/react-query';
import aiApi from '@/lib/ai-api';

export function useForecast() {
  return useMutation({
    mutationFn: async (params: {
      commodity_id: string;
      region_id: string;
      horizon?: number;
    }) => {
      const res = await aiApi.post('/forecasts/generate', {
        ...params,
        horizon: params.horizon || 7,
      });
      return res.data;
    },
  });
}