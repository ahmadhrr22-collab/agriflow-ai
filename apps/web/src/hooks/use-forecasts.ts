'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

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