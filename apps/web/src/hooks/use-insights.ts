'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const aiApi = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export function useMarketInsight() {
  return useMutation({
    mutationFn: async (params: { commodity_id: string; commodity_name: string }) => {
      const res = await aiApi.post('/insights/market', params);
      return res.data;
    },
  });
}