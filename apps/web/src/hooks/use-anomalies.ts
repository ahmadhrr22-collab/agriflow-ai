'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export function useAnomalies(commodityId: string, regionId: string) {
  return useQuery({
    queryKey: ['anomalies', commodityId, regionId],
    queryFn: async () => {
      const res = await aiApi.get(
        `/anomalies/detect?commodity_id=${commodityId}&region_id=${regionId}`
      );
      return res.data;
    },
    enabled: !!commodityId && !!regionId,
  });
}