'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const aiApi = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

export function useRecommendations(commodityId: string, topN: number = 5) {
  return useQuery({
    queryKey: ['recommendations', commodityId, topN],
    queryFn: async () => {
      const res = await aiApi.get(
        `/recommendations/generate?commodity_id=${commodityId}&top_n=${topN}`
      );
      return res.data;
    },
    enabled: !!commodityId,
    refetchInterval: 1000 * 60 * 10,
  });
}